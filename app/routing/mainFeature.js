const multer = require('multer');
const NodeCouchDb = require('node-couchdb');
const passportConfig = require("../utils/passport-config.js")
const googleUtils = require('../utils/googleUtils.js')
var SpotifyWebApi = require('spotify-web-api-node');


const fileStorageEngine = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './public/images')
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + '--' + file.originalname);
	}
});

const upload = multer({ storage: fileStorageEngine })

const couch = new NodeCouchDb({
	host: process.env.COUCHDB_HOST || "localhost",
	port: '5984',
	auth: {
		user: process.env.DB_USER,
		pass: process.env.DB_PASSWORD
	}
})

const dbName = 'p2splaylists';
module.exports = function build(userData){
	const router = require('express').Router();
	/************** Gestione dell'input **************/
	router.get('/input', passportConfig.checkAuthenticated, function (req, res) { // input prima del login con google 
		res.render('./pages/input.ejs',
			{
				albums: req.session.user.albums,
				logged: req.session.user.accessTokenGoogle != '',
				p2sUser: {
					username: req.session.user.name,
					user_image: req.session.user.prof_pic
				}
			})
	});
	/************** Gestione del risultato **************/
	router.post('/result', upload.array("images", 50), passportConfig.checkAuthenticated, function (req, res) {
		userData.set(req.session.user.id, {
			photos: Array(),
			names: Array(),
			songsDB: Array(),
			songsChosen: Array()
		})
		p2sUser = {
			username: req.session.user.name,
			user_image: req.session.user.prof_pic,
			id: req.session.user.id
		}

		if (req.files) {//finito
			userData.get(req.session.user.id).photos = req.files;
			let photos = userData.get(req.session.user.id).photos
			let names = userData.get(req.session.user.id).names
			if (photos.length != 0) {
				let urls = Array();

				for (let index = 0; index < userData.get(req.session.user.id).photos.length; index++) {
					names.push(photos[index].path.substring(photos[index].path.indexOf("-") + 2))
					urls.push(photos[index].path.substring(6));
				}

				res.render('./pages/result.ejs', { urls: urls, num: photos.length, p2sUser: p2sUser , socket_connect: process.env.SOCKET_URI})
			}
			else res.redirect('/input');
		}
		else if (req.body.urls) {//finito
			let photos = userData.get(req.session.user.id).photos
			let names = userData.get(req.session.user.id).names
			try {
				req.body.urls.forEach(element => {
					photos.push(element)
					names.push(element)
				})
			} catch (e) {
				photos.push(req.body.urls)
				names.push(req.body.urls)
			}
			if (photos.length != 0) {
				res.render('./pages/result.ejs', { urls: photos, num: photos.length, p2sUser: p2sUser ,socket_connect: process.env.SOCKET_URI})
			}
		}
		else if (req.body.album) {//finito
			i = req.body.album
			let album = req.session.user.albums[i]
			googleUtils.getPhotos(req.session.user.accessTokenGoogle, album.id)
				.then(data => {
					let photos = userData.get(req.session.user.id).photos
					let names = userData.get(req.session.user.id).names
					try{
						data.forEach(element => { //concateno <titolo dell'album>.<nome della foto> come identificatore delle foto per il DB 
							names.push(album.title + "." + element.filename);
							photos.push(element.baseUrl)
						});


						res.render('./pages/result.ejs', { urls: photos, num: photos.length, p2sUser: p2sUser ,socket_connect: process.env.SOCKET_URI})
					} catch(e){
						console.log('google accesstoken expired')
						res.redirect('/google-login')
					}
				})
		}
		else res.redirect('/input');

	})
	router.post('/playlist', passportConfig.checkAuthenticated, function (req, res) {


		let songsDB = Array.from(userData.get(req.session.user.id).songsDB)
		if (songsDB.length == 0) res.redirect('/input')
		let spotifyApi = new SpotifyWebApi({
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		})
		spotifyApi.setAccessToken(req.session.user.accessToken)
		let selectedSongs=Array()
		try {
			req.body.songs.forEach(element => {
				selectedSongs.push(element)
			})
		} catch (e) {
			selectedSongs.push(req.body.songs)
		}
		console.log(selectedSongs)
		spotifyApi.createPlaylist(req.body.name || 'Il mio album in musica', {// creo una nuova playlist
			'description': req.body.description
		}).then(data => {//aggiungo le tracce selezionate nella nuova playlist (se presenti)
			if (selectedSongs) {
				spotifyApi.addTracksToPlaylist(data.body.id, selectedSongs)
			}
		})

		//songsDB è un array di obj di questo tipo
		/* {
			song:{
				uri: 'spotify:track:<id della canzone>'
				name: <nome della canzone>
			}
			photo: <nome foto>
		} */
		songsDB = songsDB.filter(songImg => selectedSongs.includes(songImg.song.uri)) // filtro le canzoni in base alle canzoni che l'utente ha selezionato

		couch.uniqid().then((ids) => {
			const id = ids[0]
			couch.insert(dbName, {
				_id: id,
				name: req.body.name||'Il mio album in musica',
				user: req.session.user.id,
				description: req.body.description,			
				song_number: selectedSongs.length,
				songs: songsDB //penso qui possa andarci songsDB direttamente
			})
		})
		res.redirect('/')
	})
	return router;
}


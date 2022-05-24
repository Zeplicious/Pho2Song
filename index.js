require('dotenv').config

const express = require('express');
const path = require("path");
const secrets = require('./secrets');
const passport = require('passport');

const flash = require('express-flash')
const session = require('express-session')

const Joi = require('joi');
const methodOverride = require('method-override')
const NodeCouchDb = require('node-couchdb');

var SpotifyWebApi = require('spotify-web-api-node');

const SpotifyStrategy = require('passport-spotify').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const spotifyUtils = require("./utils/spotifyUtils.js");
const googleUtils = require('./utils/googleUtils.js')
const colorUtil = require("./utils/getColors.js");
const { render } = require('express/lib/response');

const bodyParser = require('body-parser');
const multer = require('multer');			//Abilita il file upload verso il server
const res = require('express/lib/response');
const { runInNewContext } = require('vm');
const { join } = require('path');



/**************  Passport declarations **************/
function checkAuthenticated(req, res, next) { //controllo se l'utente è autenticato
	if (req.isAuthenticated()) {
		return next()
	}
	return res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) { //controllo se l'utente NON è autenticato
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	return next()
}


/**************  Creazione CouchDb   ************** */
const couch = new NodeCouchDb({
	auth: {
		user: secrets.database.user,
		pass: secrets.database.password
	}
})

const dbName = 'p2splaylists';
const viewUrl = '_design/all_playlists/_view/all';

function view(doc) {
	emit(doc._id, {name: doc.name, user: doc.user, song_number: doc.song_number, songs: doc.songs});
  }

//STRATEGIA PASSPORT SPOTIFY
const spotify_users = new Map();
const spotify_client_id = secrets.spotify.client_id;
const spotify_client_secret = secrets.spotify.client_secret;
const spotify_scopes = [
	'ugc-image-upload',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'streaming',
	'app-remote-control',
	'user-read-email',
	'user-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-read-private',
	'playlist-modify-private',
	'user-library-modify',
	'user-library-read',
	'user-top-read',
	'user-read-playback-position',
	'user-read-recently-played',
	'user-follow-read',
	'user-follow-modify'
];//da ottimizzare

/* var spotifyApi = new SpotifyWebApi({
	clientId: spotify_client_id,
	clientSecret: spotify_client_secret,
}); */
passport.use('spotify',
	new SpotifyStrategy({
		clientID: spotify_client_id,
		clientSecret: spotify_client_secret,
		callbackURL: '/spotify-login/callback'
	},
		async function (accessToken, refreshToken, expiresIn, profile, done) {
			let spotifyApi=  new SpotifyWebApi({
				clientId: spotify_client_id,
				clientSecret: spotify_client_secret,
			})

			//Setto accessToken e refreshToken ottenuti dalla strategia passport
			
			spotifyApi.setAccessToken(accessToken);
			spotifyApi.setRefreshToken(refreshToken);
			let tastes =await spotifyUtils.getUserTaste(spotifyApi)

			//gestisco il refreshtoken automatizzando la richiesta di un nuovo accesstoken
			let intervalID=	setInterval(async () => {
				let data = await spotifyApi.refreshAccessToken();
				let access_token = data.body['access_token'];
				spotifyApi.setAccessToken(access_token);
			  }, expiresIn / 2 * 1000);

			let prof_pic
			if(profile.photos.length==0)prof_pic = './images/skuffed_def_prof_pic_spotify.jpg'
			else prof_pic = profile.photos[0].value

			
			spotify_users.set(profile.id,{
				id: profile.id,
				name: profile.displayName,
				prof_pic: prof_pic,
				accessToken: accessToken,
				//timer: intervalID,
				tastes: tastes, 

				accessTokenGoogle: '',
				albums: null
			})
			return done(null,profile);
			
		}
	)
)
//serializza Utente
passport.serializeUser(function (user, done) {
	done(null, user.id); 
})

//deserializza Utente
passport.deserializeUser(function (id, done) {

	let user=spotify_users.get(id)
	if(user!=null){
		done(null, user)
	}
	else{
		user=google_users.get(id)
		done(null, user) 
		//google_users.delete(id)
	}
})
//STRATEGIA PASSPORT GOOGLE
const google_client_id = secrets.google.client_id;
const google_client_secret = secrets.google.client_secret;
const google_scopes=[
	'https://www.googleapis.com/auth/photoslibrary.readonly', 
	'https://www.googleapis.com/auth/userinfo.profile'
]
const google_users=new Map();
passport.use('google',
	new GoogleStrategy({
		clientID: google_client_id,
		clientSecret: google_client_secret,
		callbackURL: '/google-login/callback'
	},
		async function (accessToken, refreshToken, profile, cb) {
			//ottengo gli album dell'utente tramite accessToken
			
			let data = await googleUtils.getAlbums(accessToken)
			google_users.set(profile.id,{
				id: profile.id,
				albums: data,
				accessToken: accessToken
			})
			return cb(null, profile)
		})
)


const app = express();
/**************  **************/

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}))
app.use(passport.session())

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**************  Aux function multer **************/

const fileStorageEngine = multer.diskStorage({
	destination: (req, file, callback) => {
	  callback(null, './public/images')
	},
	filename: (req, file, callback) => {
	  callback(null, Date.now()  + '--' + file.originalname);
	}
});

const upload = multer({ storage : fileStorageEngine })


/**************  Gestione della home **************/

app.get('/', /* checkNotAuthenticated, */(req, res) => {
	let p2sUser = null
	if(req.session.user !==undefined &&  req.session.user != null){
		p2sUser = {
			username: req.session.user.name,
			user_image: req.session.user.prof_pic
		}
	}
	res.render('./pages/landing_page.ejs', { p2sUser: p2sUser })

})

//passport.authenticate per autenticare l'utente all'interno del sito con successivo redirect in caso di fallimento o di successo

app.get('/login', checkNotAuthenticated, (req, res) => {
	let p2sUser=null
	if(req.session.user!==undefined){
		p2sUser={
			username: req.session.user.name,
			user_image: req.session.user.prof_pic
		} 
	}
	res.render('./pages/login.ejs', {p2sUser: p2sUser})
})

app.post('/logout', checkAuthenticated, (req, res) => {
	spotify_users.delete(req.session.user.id);
	
	req.logout()
	req.session.user=undefined;
	userData.delete(req.session.user.id)
	res.redirect('/')
})


/************** Listening section of the server setup **************/

//questo setup fa solo da ponte, al click sul pulsante "log me in with spotify" il browser dell'utente effettua una get a /spotify-login...
app.get('/spotify-login', checkNotAuthenticated, passport.authenticate('spotify', { scope: spotify_scopes }),function(req,res){
	console.log("ciao-login")
});


app.get('/spotify-login/callback', checkNotAuthenticated,passport.authenticate('spotify', {
	successRedirect: '/spotify-login/callback/return',
	failureRedirect: '/'
}),
function(req,res){
	console.log("ciao-login/callback")
}
)
app.get('/spotify-login/callback/return',function(req,res){
	console.log("ciao-login/callback/return")
	req.session.user=req.user
	res.redirect('/')
})


//anche se non strettamente necessario per comprensibilità ho utilizzato lo stesso "flow" utilizzato per spotify
//Passport.authenticate per ottenere l'autorizzazione nell'utilizzare lo scope photoslibrary.readonly dell'utente
app.get('/google-login', checkAuthenticated, passport.authenticate('google', { scope: google_scopes })); //function(req, res){  //chiamato dal file input#.ejs


//passport.authenticate per autenticare l'utente all'interno del sito con successivo redirect in caso di fallimento o successo
app.get('/google-login/callback', checkAuthenticated, passport.authenticate('google', {
	successRedirect: '/google-login/callback/return',
	failureRedirect: '/input'
}));
app.get('/google-login/callback/return',function(req,res){
	console.log(req.session.user.id+':'+ req.user.id)
	req.session.user.albums=req.user.albums
	req.session.user.accessTokenGoogle=req.user.accessToken
	res.redirect('/input')
})


/************** Gestione dell'input **************/
app.get('/input', checkAuthenticated, function (req, res) { // input prima del login con google 
	res.render('./pages/input.ejs', 
	{ 
		albums: req.session.user.albums,
		logged: req.session.user.accessTokenGoogle!='', 
		p2sUser: {
			username: req.session.user.name,
			user_image: req.session.user.prof_pic
		} 
	})
});


/************** Gestione del risultato **************/

const userData = new Map();

async function work(userTasteInfo,userData) {
	try{
		var photo = userData.photos.pop();
	}catch(e){
		return 'error'
	}
	var imgName = userData.names.pop();
	if (photo == null) return;
	var song
	try{
		url = new URL(photo)
		song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(photo),userTasteInfo)
		
	}catch(e){
		song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUpload(photo),userTasteInfo)
	}

	userData.songsDB.push({
		song: song,
		photo: imgName
	})
	return song
}

app.post('/result',upload.array("images", 50), checkAuthenticated, function (req, res) {
	/* let spotifyApi=  new SpotifyWebApi({
		clientId: spotify_client_id,
		clientSecret: spotify_client_secret,
	})
	spotifyApi.setAccessToken(accessToken);
	req.session.user.tastes=spotifyUtils.getUserTaste(spotifyApi) */
	
	userData.set(req.session.user.id,{
		photos: Array(),
		names: Array(),
		songsDB: Array(),
		songsChosen: Array()
	})
	p2sUser={
		username: req.session.user.name,
		user_image: req.session.user.prof_pic
	}
	
	if (req.files) {//finito
		userData.get(req.session.user.id).photos=req.files;
		let photos=userData.get(req.session.user.id).photos
		let names=userData.get(req.session.user.id).names
		if(photos.length!=0){
			let urls=Array();
			
			for (let index = 0; index < userData.get(req.session.user.id).photos.length; index++) {
				names.push(photos[index].path.substring(photos[index].path.indexOf("-") + 2))
				urls.push(photos[index].path.substring(6));
			}
			
			res.render('./pages/result.ejs', { urls:urls, num: photos.length, p2sUser: p2sUser })
		}
		else res.redirect('/input');
	}
	else if (req.body.urls) {//finito
		let photos=userData.get(req.session.user.id).photos
		let names=userData.get(req.session.user.id).names
		try{
			req.body.urls.forEach(element=>{
				photos.push(element)
				names.push(element)
			})
		}catch(e){
			photos.push(req.body.urls)
			names.push(req.body.urls)
		}
		if(photos.length!=0){
			res.render('./pages/result.ejs', { urls: photos,num: photos.length, p2sUser: p2sUser })
		}
	}
	else if (req.body.album) {//finito
		i = req.body.album
		let album=req.session.user.albums[i]
		
		googleUtils.getPhotos(req.session.user.accessTokenGoogle,album.id)
			.then(data => {
				let photos=userData.get(req.session.user.id).photos
				let names=userData.get(req.session.user.id).names
				data.forEach(element => { //concateno <titolo dell'album>.<nome della foto> come identificatore delle foto per il DB 
					names.push( album.title + "." + element.filename );
					photos.push(element.baseUrl)
				});


				res.render('./pages/result.ejs', { urls:photos,num: photos.length, p2sUser: p2sUser })
			})
	}
	else res.redirect('/input');
	
})

app.post('/playlist', checkAuthenticated, function (req, res) {

	let songsDB = Array.from(userData.get(req.session.user.id).songsDB)
	if (songsDB.length==0)res.redirect('/input')

	let spotifyApi=  new SpotifyWebApi({
		clientId: spotify_client_id,
		clientSecret: spotify_client_secret,
	})
	spotifyApi.setAccessToken(req.session.user.accessToken)
	let selectedSongs = Array.from(req.body.songs)
	spotifyApi.createPlaylist(req.body.name, {// creo una nuova playlist
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
	songsDB=songsDB.filter(songImg => selectedSongs.includes(songImg.song.uri)) // filtro le canzoni in base alle canzoni che l'utente ha selezionato

	console.log(songsDB)

	couch.uniqid().then((ids) => {
        const id = ids[0]
		couch.insert(dbName, {
			_id: id,
			name: req.body.name,
			user: p2sUser.id,
			description: req.body.description,			
			song_number: req.body.songs.length,
			songs: songsDB //penso qui possa andarci songsDB direttamente
		})
	})
	res.redirect('/')
})

app.get('/getSong',checkAuthenticated,async function (req, res) {
	try {
		let data	
		try{
			let photo = userData.get(req.session.user.id).photos.pop();
			let imgName = userData.get(req.session.user.id).names.pop();
			console.log((typeof photo) == String)
			if (photo == null) data=null
			else{
				let song
				if(photo.path !== undefined){
					song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUpload(photo),/* await */ req.session.user.tastes, userData.get(req.session.user.id).songsChosen)
					userData.get(req.session.user.id).songsChosen.push(song)
					console.log(userData.get(req.session.user.id).songsChosen.push(song))
					console.log('CIAO')					
				}
				else{
					song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(photo),/*  await */ req.session.user.tastes, userData.get(req.session.user.id).songsChosen)
					userData.get(req.session.user.id).songsChosen.push(song)
					console.log(userData.get(req.session.user.id).songsChosen.push(song))				
				}
			
				userData.get(req.session.user.id).songsDB.push({
					song: song,
					photo: imgName
				})
				data=song
			}
		}catch(e){
			console.log(e)
			data='error'
		}
		//console.log(data)
		if (data=='error') res.redirect('/')
		else if (data) res.send(data)
		else res.send('end')


		/* work(req.session.user.tastes,userData.get(req.session.user.id)).then(data => {
			console.log(data)
			if (data=='error') res.redirect('/')
			else if (data) res.send(data)
			else res.send('end')

		}) */
	} catch (error) {
		res.send('end')
	}
})

/************** Funzionalità: Playlist analyzer **************/
app.get('/plist-analyzer', checkAuthenticated, (req, res) => {
	let spotifyApi=  new SpotifyWebApi({
		clientId: spotify_client_id,
		clientSecret: spotify_client_secret,
	})
	spotifyApi.setAccessToken(req.session.user.accessToken)

	spotifyApi.getUserPlaylists(req.session.user.id,{limit: 50}).then(data => {

		var playlists = data.body.items.filter(item=>item.tracks.total != 0)
		res.render('./pages/plist-analyzer.ejs', {playlists: playlists, p2sUser: {
			username: req.session.user.name,
			user_image: req.session.user.prof_pic
		}})  /* Invia al frontend le playlist da cui l'utente sceglie quella da anallizare */
	})
})


app.post('/plist-analyzer', (req, res) => {
	let spotifyApi=  new SpotifyWebApi({
		clientId: spotify_client_id,
		clientSecret: spotify_client_secret,
	})
	spotifyApi.setAccessToken(req.session.user.accessToken)
	spotifyUtils.analyzePlaylist(spotifyApi, req.body.playlistID).then(data => {
		res.send(data)
	})
})

app.listen(process.env.PORT||8888, () => {
	console.log('Server listening on http://localhost:8888/');
});

/************** Funzionalità: Playlist History ******************* */

app.get('/playlist_history', /* checkAuthenticated */(req, res) => {
	couch.get(dbName, viewUrl ).then(
        (data, headers, status) => {
			res.render('./pages/playlist_history.ejs', {
				p2sUser: {
					username: req.session.user.name,
					user_image: req.session.user.prof_pic
				},
				p2suser: req.session.user.id,
				p2splaylists: data.data.rows
				})
			},
        (err) => {
            res.send(err);
        }
    );
})

/************************** CHIAMATE API *************************** */

app.post('/api/playlists/analyze', (req, res) => {
	const schema = Joi.object({
		id: Joi.string().required(),
		accessToken: Joi.string().required()
	})
	const { error } = validate(schema, req.body)
	if(error) return res.status(400).send(error.details[0].message)
	let spotifyApi=  new SpotifyWebApi({
		clientId: spotify_client_id,
		clientSecret: spotify_client_secret,
	})
	spotifyApi.setAccessToken(req.body.accessToken)
	try{
		spotifyUtils.analyzePlaylist(spotifyApi, req.body.id).then(data => {
			res.send(data)
		})
	}
	catch(e){
		res.status(400).send(e)
	} 
})

/* app.post('/api/p2s/album-playlist', async function (req, res){
	const schema = Joi.object({
		url: Joi.string().required(),
		accessToken: Joi.string().required()
	})
	const result = schema.validate(req.body)
	if(result.error){
		return res.status(400).send(result.error.details[0].message)
	}
	let spotifyApi=  new SpotifyWebApi({
		clientId: spotify_client_id,
		clientSecret: spotify_client_secret,
	})
	spotifyApi.setAccessToken(req.body.accessToken)
	try{
		let taste = await spotifyUtils.getUserTaste(spotifyApi)
		song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(req.body.url), taste, [])
		res.send(song)
	}
	catch(e){
		res.status(400).send(e)
	} 
}) */

app.post('/api/p2s/photo-song', async function (req, res){ //è richiesto lo scope user-top-read
	const schema = Joi.object({
		url: Joi.string().required(),
		accessToken: Joi.string().required()
	})
	const { error } = validate(schema, req.body)
	if(error) return res.status(400).send(error.details[0].message)
	let spotifyApi=  new SpotifyWebApi({
		clientId: spotify_client_id,
		clientSecret: spotify_client_secret,
	})
	spotifyApi.setAccessToken(req.body.accessToken)
	
	try{
		let taste = await spotifyUtils.getUserTaste(spotifyApi)
		song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(req.body.url), taste, [])
		res.send(song)
	}
	catch(e){
		res.status(400).send(e)
	} 
})

app.get('/api/p2s/playlists', (req, res) => {
	couch.get(dbName, viewUrl).then (
		(data, headers, status) => {
			res.send(data.data.rows)
		}
	)
})

app.get('/api/p2s/playlists/:id', (req, res) => {
	couch.get(dbName, viewUrl).then (
		(data, headers, status) => {
			for(index = 0; index < data.data.rows.length; index++) {
				if(data.data.rows[index].id === req.params.id){
					res.send(data.data.rows[index].id);
				}
			}
			res.status(404).send('La playlist con id ' + req.params.id + ' non è stata trovata')
		}
	)
})

app.get('/api/p2s/playlists/users/:user', (req, res) => {
	user_playlists = new Map()
	couch.get(dbName, viewUrl).then (
		(data, headers, status) => {
			for(index = 0; index < data.data.rows.length; index++) {
				if(data.data.rows[index].value.user === req.params.user){
					user_playlists.set("user", req.params.user )
				}
			}
			if(!user_playlists.has(req.params.user)){
				res.status(404).send('L\'user con id ' + req.params.user + ' non trovato')
			}
			else{
				res.send(user_playlists);
			}
		}
	)
})

function validate(schema, body){
	return schema.validate(body)
}
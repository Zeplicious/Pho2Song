require('dotenv').config

const express = require('express');
const path = require("path");
const secrets = require('./secrets');
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
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



/**************  Passport declarations **************/
function checkAuthenticated(req, res, next) { //controllo se l'utente è autenticato
	if (req.isAuthenticated()) {
		return next()
	}
	console.log('non autenticato: ' + req)
	return res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) { //controllo se l'utente NON è autenticato
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	console.log('non autenticato: ' + req.user)
	return next()
}

var User = [];

/**************  Creazione CouchDb   ************** */
const couch = new NodeCouchDb({
	auth: {
		user: 'admin',
		pass: 'Musazza7'
	}
})

const dbName = 'p2splaylists';
const viewUrl = '_design/all_playlists/_view/all';

function view(doc) {
	emit(doc._id, {name: doc.name, user: doc.user, song_number: doc.song_number, songs: doc.songs});
  }

//STRATEGIA PASSPORT SPOTIFY
passport.use('spotify',
	new SpotifyStrategy({
		clientID: secrets.spotify.client_id,
		clientSecret: secrets.spotify.client_secret,
		callbackURL: 'http://localhost:8888/spotify-login/callback'
	},
		function (accessToken, refreshToken, expiresIn, profile, done) {
			//Setto accessToken e refreshToken ottenuti dalla strategia passport
			spotifyApi.setAccessToken(accessToken);
			spotifyApi.setRefreshToken(refreshToken);
			//Controllo se l'utente è presente nell'array User
			if (User.find(profile => profile.id === id)) {
				(err, user) => {
					//Ottengo l'id dell'utente tramite Spotify
					spotifyApi
						.getMe()
						.then(userinfo => {
							User.push({
								id: userinfo.id,
							})
						})
					return done(err, user)
				}
				
			}
			return done(null, profile);
			
		}
	)
)
//serializza Utente
passport.serializeUser(function (user, done) {
	done(null, user);
})

//deserializza Utente
passport.deserializeUser(function (obj, done) {
	done(null, obj)
})

//STRATEGIA PASSPORT GOOGLE
passport.use('google',
	new GoogleStrategy({
		clientID: secrets.google.client_id,
		clientSecret: secrets.google.client_secret,
		callbackURL: 'http://localhost:8888/google-login/callback'
	},
		async function (accessToken, refreshToken, profile, cb) {
			//ottengo gli album dell'utente tramite accessToken
			let data = await googleUtils.getAlbums(accessToken)
			albums = data
			access_token = accessToken
			return cb(null, profile)
		})
)

const app = express();


/************** google api declarations **************/
google_client_id = secrets.google.client_id;
google_client_secret = secrets.google.client_secret;
google_redirect_uri = 'http://localhost:8888/callback';

var access_token = '';
var album = '';


/************** spotify api declarations **************/
spotify_client_id = secrets.spotify.client_id;
spotify_client_secret = secrets.spotify.client_secret;
spotify_client_uri = 'http://localhost:8888';

const scopes = [
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

var spotifyApi = new SpotifyWebApi({
	clientId: spotify_client_id,
	clientSecret: spotify_client_secret,
	redirectUri: spotify_client_uri
});
var albums;


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

var userTasteInfo;
var p2sUser = null
app.get('/', /* checkNotAuthenticated, */(req, res) => {
	if (spotifyApi.getAccessToken()) {
		spotifyApi.getMe().then(data => {

			spotifyUtils.getUserTaste(spotifyApi)
				.then(body => {
					userTasteInfo = body
				})

			p2sUser = {
				username: data.body.display_name,
				id: data.body.id,
				user_image: data.body.images[0].url
			}
			res.render('./pages/landing_page.ejs', { p2sUser: p2sUser })
		})
	}
	else {
		res.render('./pages/landing_page.ejs', { p2sUser: null })
	}

})

//passport.authenticate per autenticare l'utente all'interno del sito con successivo redirect in caso di fallimento o di successo

app.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('./pages/login.ejs')
})

app.post('/logout', checkAuthenticated, (req, res) => {
	req.logout()
	p2sUser = null
	spotifyApi.setAccessToken(null)
	res.redirect('/')
})


/************** Listening section of the server setup **************/

//questo setup fa solo da ponte, al click sul pulsante "log me in with spotify" il browser dell'utente effettua una get a /spotify-login...
app.get('/spotify-login', checkNotAuthenticated, passport.authenticate('spotify', { scope: scopes }));


app.get('/spotify-login/callback', checkNotAuthenticated, passport.authenticate('spotify', {
	successRedirect: '/',
	failureRedirect: '/'
}))


//anche se non strettamente necessario per comprensibilità ho utilizzato lo stesso "flow" utilizzato per spotify
//Passport.authenticate per ottenere l'autorizzazione nell'utilizzare lo scope photoslibrary.readonly dell'utente
app.get('/google-login', checkAuthenticated, passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/photoslibrary.readonly', 'https://www.googleapis.com/auth/userinfo.profile'] })); //function(req, res){  //chiamato dal file input#.ejs


//passport.authenticate per autenticare l'utente all'interno del sito con successivo redirect in caso di fallimento o successo
app.get('/google-login/callback', checkAuthenticated, passport.authenticate('google', {
	successRedirect: '/input',
	failureRedirect: '/input'
}));


/************** Gestione dell'input **************/
app.get('/input', checkAuthenticated, function (req, res) { // input prima del login con google 
	res.render('./pages/input.ejs', { albums: albums, p2sUser: p2sUser })
});


/************** Gestione del risultato **************/

var photos = Array()
var imgNames= Array()
var songsDB= Array()

async function work() {
	var photo = photos.pop();
	var imgName = imgNames.pop();
	if (photo == null) return;
	var song
	if (typeof photo == String) {
		song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(photo), userTasteInfo)

	} // controlli il tipo; se stringa photo in input
	else song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUpload(photo), userTasteInfo)

	songsDB.push({
		song: song,
		img: imgName
	})
	return song
}

app.post('/result',upload.array("images", 50), checkAuthenticated, function (req, res) {
	if (req.files) {//finito
		photos= req.files;
		if(photos.length!=0){
			var urls=Array();
			
			for (let index = 0; index < photos.length; index++) {
				imgNames.push(photos[index].path.substring(url.lastIndexOf("/") + 1))
				urls.push(photos[index].path.substring(6));
			}
			res.render('./pages/result.ejs', { urls:urls, num: photos.length, p2sUser: p2sUser })
		}
		else res.redirect('/input');
	}
	else if (req.body.urls) {//finito

		if (typeof photo == String){
			photos.push(req.body.urls)
		}
		else photos = Array.from(req.body.urls)

		photos.forEach(element => { //utilizzo l'url come identificatore delle foto per il DB
			imgNames.push(element);
		});

		if(photos.length!=0){
			res.render('./pages/result.ejs', { urls: photos,num: photos.length, p2sUser: p2sUser })
		}
	}
	else if (req.body.album) {//finito
		i = req.body.album
		googleUtils.getPhotos(access_token, albums[i].id)
			.then(data => {
				
				data.forEach(element => { //concateno <titolo dell'album>.<nome della foto> come identificatore delle foto per il DB 
					imgNames.push( albums[i].title + "." + element.filename );
					photos.push(element.baseUrl)
				});
				
				res.render('./pages/result.ejs', { urls: photos,num: albums[i].mediaItemsCount, p2sUser: p2sUser })
			})
	}
	else res.redirect('/input');
	
})

app.post('/playlist', checkAuthenticated, function (req, res) {
	var rev;
	var songsArray = Array();
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
		img: <nome foto>
	} */
	songsDB=songsDB.filter(songImg => selectedSongs.includes(songImg.song.uri)) // filtro le canzoni in base alle canzoni che l'utente ha selezionato
	console.log(songsDB)
	for(index = 0; index < req.body.songs.length; index++){//non penso questo serva più
		songsArray[index] = {"name": req.body.songs[index]}
	}

	couch.uniqid().then((ids) => {
        const id = ids[0]
		couch.insert(dbName, {
			_id: id,
			name: req.body.name,
			user: p2sUser.id,
			description: req.body.description,			
			song_number: req.body.songs.length,
			songs: songsArray //penso qui possa andarci songsDB direttamente
		})
	})
	
	
	res.redirect('/')
})

app.get('/getSong', function (req, res) {
	try {
		work().then(data => {
			if (data) res.send(data)
			else res.send('end')
		})
	} catch (error) {
		res.send('end')
	}
})

/************** Funzionalità: Playlist analyzer **************/
app.get('/plist-analyzer', checkAuthenticated, (req, res) => {
	spotifyApi.getUserPlaylists({limit: 50}).then(data => {
		var playlists = data.body.items.filter(item=>item.tracks.total != 0)
		res.render('./pages/plist-analyzer.ejs', {playlists: playlists, p2sUser: p2sUser})  /* Invia al frontend le playlist da cui l'utente sceglie quella da anallizare */
	})
})


app.post('/plist-analyzer', (req, res) => {
	spotifyUtils.analyzePlaylist(spotifyApi, req.body.playlistID).then(data => {
		res.send(data)
	})
})

app.listen(8888, () => {
	console.log('Server listening on http://localhost:8888/');
});

/************** Funzionalità: Song History ******************* */

app.get('/song_history', checkAuthenticated, (req, res) => {
	couch.get(dbName, viewUrl ).then(
        (data, headers, status) => {
			res.render('./pages/song_history.ejs', {
				p2sUser: p2sUser,
				p2suser: p2sUser.id,
				p2splaylists: data.data.rows
				})
			},
        (err) => {
            res.send(err);
        }
    );
})
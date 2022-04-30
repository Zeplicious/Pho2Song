if(process.env.NODE_ENC !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const utils = require('./oauthUtils.js')
const secrets = require('./secrets');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
var SpotifyWebApi = require('spotify-web-api-node');
const wrapper = require("./wrapper.js");

const app = express();

var code = "";

google_client_id = secrets.google.client_id
google_client_secret = secrets.google.client_secret;

spotify_client_id = secrets.spotify.client_id
spotify_client_secret = secrets.spotify.client_secret;

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    id => secrets.spotify.find(secrets => secrets.spotify.client_id === id)
)

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
  ];

var spotifyApi = new SpotifyWebApi({
    clientId: spotify_client_id,
    clientSecret: spotify_client_secret,
    redirectUri: 'http://localhost:8888/home'
});

redirect_uri='http://localhost:8888/callback';

var getCode = "https://accounts.google.com/o/oauth2/auth?client_id="+google_client_id+"&scope=https://www.googleapis.com/auth/photoslibrary.readonly&approval_prompt=force&redirect_uri="+redirect_uri+"&response_type=code";

var access_token='';
var album='';

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, function(req, res) {
	res.sendFile('/public/index.ejs')
});

app.get('/login', checkNotAuthenticated, function(req, res){ 
        res.send("<br><br><button onclick='window.location.href=\""+ getCode +"\"'>Log in with Google</button>");
});

app.get('/spotify-login', checkNotAuthenticated, (req, res) => {
	res.redirect(spotifyApi.createAuthorizeURL(scopes));
	res.render('spotify-login.ejs');
});

app.post('/spotify-login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failuredRedirect: '/login',
    failureFlash: true
}))
  
app.get('/data', checkAuthenticated, (req,res)=>{
	wrapper.getMyData(spotifyApi,function(ret){
		res.send('Ecco le tue playlist:\r\n' + ret);
	});
}); 
  
app.get('/home', (req, res) => {
	const error = req.query.error;
	const code = req.query.code;
	const state = req.query.state;
	if (error) {	
	  console.error('Callback Error:', error);
	  res.send(`Callback Error: ${error}`);
	  return;
	}
	spotifyApi
	.authorizationCodeGrant(code)
	.then(data => {
		const access_token = data.body['access_token'];
		const refresh_token = data.body['refresh_token'];
		const expires_in = data.body['expires_in'];
  
		spotifyApi.setAccessToken(access_token);
		spotifyApi.setRefreshToken(refresh_token);
  
		console.log('access_token:', access_token);
		console.log('refresh_token:', refresh_token);
	
		console.log(
			`Sucessfully retreived access token. Expires in ${expires_in} s.`
		);
		  
		setInterval(async () => {
		  	const data = await spotifyApi.refreshAccessToken();
		  	const access_token = data.body['access_token'];
	
		  	console.log('The access token has been refreshed!');
		  	console.log('access_token:', access_token);
		  	spotifyApi.setAccessToken(access_token);
		}, expires_in / 2 * 1000);
  
	  	}).catch(error => {
			console.error('Error getting Tokens:', error);
			res.send(`Error getting Tokens: ${error}`);
		});
	res.sendFile('/public/home.ejs');
});

app.get('/callback', checkAuthenticated, function (req, res) {
	code = req.query.code;
	utils.getToken(code)
	.then(token => utils.getAlbums(token)
	.then(albums => {
		album=albums[1].id
		access_token=token
		res.send("<br><br><h2>"+albums+"</h2><button onclick='window.location.href=\"http://localhost:8888/input\"'>Get colors</button>")
	}
	));
});

app.get('/input', checkAuthenticated, function (req,res){
	utils.getColors(res,access_token,album)
	.then(colors => res.send(colors))
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }

    return res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    return next()
}

app.listen(8888, ()=>{
    console.log('Server listening on http://localhost:8888/login');
});
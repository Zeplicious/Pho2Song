require('dotenv').config

const express = require('express');
const utils = require('./oauthUtils.js')
const secrets = require('./secrets');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
var SpotifyWebApi = require('spotify-web-api-node');
const SpotifyStrategy = require('passport-spotify').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const wrapper = require("./wrapper.js");

// ***************************************************  passport declarations *************************************************** 
function checkAuthenticated(req, res, next){ //controllo se l'utente è autenticato
    if(req.isAuthenticated()){
        return next()
    }
	console.log('non autenticato: ' + req)
    return res.redirect('/')
}

function checkNotAuthenticated(req, res, next){ //controllo se l'utente NON è autenticato
   	if(req.isAuthenticated()){
    	 return res.redirect('/home')
    }
	console.log('non autenticato: ' + req.user)
    return next()
}

var User=[]

//STRATEGIA PASSPORT GOOGLE
passport.use('google',
	new GoogleStrategy({
		clientID: secrets.google.client_id,
    	clientSecret: secrets.google.client_secret,
   	 	callbackURL: 'http://localhost:8888/google-login/callback'
 	},
  	function(accessToken, refreshToken, profile, cb) {
    	//ottengo gli album dell'utente tramite accessToken
		utils.getAlbums(accessToken)
			.then(albums => {
				album=albums[1].id
				access_token=accessToken
		/*DA IMPLEMENTARE
			render degli album tramite EJS
		*/
			})
		return cb(null, profile)
	})
)

//STRATEGIA PASSPORT SPOTIFY
passport.use('spotify',
	new SpotifyStrategy({
			clientID: secrets.spotify.client_id,
			clientSecret: secrets.spotify.client_secret,
			callbackURL: 'http://localhost:8888/spotify-login/callback'
		},	
		function(accessToken, refreshToken, expiresIn, profile, done){
			//Setto accessToken e refreshToken ottenuti dalla strategia passport
			spotifyApi.setAccessToken(accessToken);
			spotifyApi.setRefreshToken(refreshToken);
			//Controllo se l'utente è presente nell'array User (simil database temporaneo)
			if(!User.find( profile => profile.id === id)){
				(err, user) => {
					//Ottengo l'id dell'utente tramite Spotify
					spotifyApi
					.getMe()
					.then(userinfo => {
						User.push({
							id: userinfo.id,		
						})
					console.log('utente inserito')
					})
				return done(err, user)
				}
			}
			return done(null, profile);
		}
	)
)

//serializza Utente
passport.serializeUser(function (user,done) {
	done(null,user);
})

//deserializza Utente
passport.deserializeUser(function (obj, done) {
	done(null, obj)
})

const app = express();


// *************************************************** google api declarations *************************************************** 
google_client_id = secrets.google.client_id;
google_client_secret = secrets.google.client_secret;
google_redirect_uri='http://localhost:8888/callback';

var getCode = "https://accounts.google.com/o/oauth2/auth?client_id="+google_client_id+"&scope=https://www.googleapis.com/auth/photoslibrary.readonly&approval_prompt=force&redirect_uri="+google_redirect_uri+"&response_type=code";
var access_token='';
var album='';
var code = "";

// ***************************************************  spotify api declarations *************************************************** 
spotify_client_id = secrets.spotify.client_id;
spotify_client_secret = secrets.spotify.client_secret;
spotify_client_uri='http://localhost:8888/home';

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
//  ************************************************************************************************************************

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
//app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


// *************************************************** Listening section of the server setup *********************************************************************

/*app.get('/', checkAuthenticated, function(req, res) {
	res.sendFile('/public/index.ejs')
	
});*/ //inutile già presente un gestore di richieste get su '/'

//questo setup fa solo da ponte, al click sul pulsante "log me in with spotify" il browser dell'utente effettua una get a /spotify-login...
app.get('/spotify-login', checkNotAuthenticated, passport.authenticate('spotify', {scope: scopes}),
	/* (req, res) => { //chiamato dal file home#.ejs
	console.log('ciao')*/
	
		//in callback riceviamo una GET su /home con il nostro accesscode per spotify=> home per loggati
	//res.render('spotify-login.ejs'); per ora è inutile
);

//anche se non strettamente necessario per comprensibilità ho utilizzato lo stesso "flow" utilizzato per spotify
//Passport.authenticate per ottenere l'autorizzazione nell'utilizzare lo scope photoslibrary.readonly dell'utente
app.get('/google-login', checkAuthenticated, passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/photoslibrary.readonly', 'https://www.googleapis.com/auth/userinfo.profile']}), //function(req, res){  //chiamato dal file input#.ejs
	//res.redirect(getCode);//in callback riceviamo una GET su /callback (da sistemare per maggiore chiarezza) con il nostro accesscode per google photo=> input per loggati Google
/*}*/);



/*app.post('/spotify-login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failuredRedirect: '/login',
    failureFlash: true
})) //inutile */ 
  
/*app.get('/data', checkAuthenticated, (req,res)=>{
	wrapper.getMyData(spotifyApi,function(ret){
		res.send('Ecco le tue playlist:\r\n' + ret);
	});
}); //per ora è inutile */



//****************gestione della home******************

app.get('/', checkNotAuthenticated, (req, res) => { //home per i non loggati
	res.render('home#.ejs')
})

//passport.authenticate per autenticare l'utente all'interno del sito con successivo redirect in caso di fallimento o di successo
app.get('/spotify-login/callback', checkNotAuthenticated, passport.authenticate('spotify', {
	successRedirect: '/home',
	failureRedirect: '/'
}))

app.get('/home', checkAuthenticated, (req, res) => { //home per i loggati
	/*const error = req.query.error;
	const code = req.query.code;
	const state = req.query.state;
	if (error) {	
	  console.error('Callback Error:', error);
	  res.send(`Callback Error: ${error}`);
	  return;
	}*/
	//se non abbiamo errori, utilizziamo il nostro accesscode (variabile code) per ottenere access e refresh token
	/*spotifyApi
	.authorizationCodeGrant(code)
	.then(data => {
		const access_token = data.body['access_token'];
		const refresh_token = data.body['refresh_token'];
		const expires_in = data.body['expires_in'];*/
  
		
		/* da qui in poi posso accedere ad ogni dato utente di spotify che voglio, aggiungere quindi:
			-chiamata per l'analisi degli UserTaste dell'utente spotify => analisi in background dei gusti preventivamente all'utilizzo delle funzionalità (ottimizzabile)
			-chiamata getUserId da spotify => utile per la gestione della sessione con passport
		*/
		console.log('sicuro?')
		res.render('home.ejs')
		// authenticazione finita, renderizzo la pagina
		
		//print di debug su console
		/*console.log('access_token:', access_token);
		console.log('refresh_token:', refresh_token);
		console.log(
			`Sucessfully retreived access token. Expires in ${expires_in} s.`
		);
		//refresh automatico dell'accesstoken  
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
	*/});

//****************gestione dell'input******************
app.get('/input', checkAuthenticated, function (req, res) { // input prima del login con google 
	res.render('input#.ejs')
});

app.get('/callback', checkAuthenticated, function (req, res) {
	res.render('input.ejs')
}) 

//passport.authenticate per autenticare l'utente all'interno del sito con successivo redirect in caso di fallimento o successo
app.get('/google-login/callback', checkAuthenticated, passport.authenticate('google', {
		successRedirect: '/callback',
		failureRedirect: '/input'
	}),// function (req, res) { // input dopo il login con google
	//code = req.query.code;
	/*utils.getToken(code)
	.then(token => utils.getAlbums(token)
	.then(albums => {
		album=albums[1].id
		access_token=token
		DA IMPLEMENTARE
			render degli album tramite EJS
		
		res.render('input.ejs')
	}
	));*/
	//res.render('input.ejs')
/*}*/);

//****************gestione del risultato******************
app.get('/result', checkAuthenticated, function (req,res){
	utils.getColors(res,access_token,album)
	.then(colors => res.send(colors))
})




app.listen(8888, ()=>{
    console.log('Server listening on http://localhost:8888/login');
});
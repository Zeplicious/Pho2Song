const passportConfig = require("../utils/passport-config.js")
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
const google_scopes = [
	'https://www.googleapis.com/auth/photoslibrary.readonly',
	'https://www.googleapis.com/auth/userinfo.profile'
]
module.exports= function build(passport){
    /**************  Gestione della home **************/
    const router = require("express").Router();

    router.get('/',(req, res) => {
        let p2sUser = null
        if (req.session.user !== undefined && req.session.user != null) {
            p2sUser = {
                username: req.session.user.name,
                user_image: req.session.user.prof_pic
            }
        }
        res.render('./pages/landing_page.ejs', { p2sUser: p2sUser })

    })

    //passport.authenticate per autenticare l'utente all'interno del sito con successivo redirect in caso di fallimento o di successo

    router.get('/login', passportConfig.checkNotAuthenticated, (req, res) => {
        console.log("ciao-login");
        let p2sUser = null
        if (req.session.user !== undefined) {
            p2sUser = {
                username: req.session.user.name,
                user_image: req.session.user.prof_pic
            }
        }
        res.render('./pages/login.ejs', { p2sUser: p2sUser })
    })

    router.post('/logout', passportConfig.checkAuthenticated, (req, res) => {
        console.log(req.session.user.id)
        spotify_users.delete(req.session.user.id);
        clearInterval(spotify_timers.get(req.session.user.id));
	    spotify_timers.delete(req.session.user.id)
        req.logout()
        
        req.session.user = undefined;
        res.redirect('/')
    })


    /************** Listening section of the server setup **************/

    //questo setup fa solo da ponte, al click sul pulsante "log me in with spotify" il browser dell'utente effettua una get a /spotify-login...
    router.get('/spotify', passportConfig.checkNotAuthenticated, passport.authenticate('spotify', { scope: spotify_scopes }));


    router.get('/spotify/callback', passportConfig.checkNotAuthenticated, passport.authenticate('spotify', {
        successRedirect: '/spotify-login/callback/return',
        failureRedirect: '/'
    })
    )
    router.get('/spotify-login/callback/return', passportConfig.checkAuthenticated, function (req, res) {
        console.log("ciao-login/callback/return")
        req.session.user = req.user
        res.redirect('/')
    })


    //anche se non strettamente necessario per comprensibilità ho utilizzato lo stesso "flow" utilizzato per spotify
    //Passport.authenticate per ottenere l'autorizzazione nell'utilizzare lo scope photoslibrary.readonly dell'utente
    router.get('/google-login', passportConfig.checkAuthenticated,passport.authenticate('google', { scope: google_scopes })); //function(req, res){  //chiamato dal file input#.ejs


    //passport.authenticate per autenticare l'utente all'interno del sito con successivo redirect in caso di fallimento o successo
    router.get('/google-login/callback', passportConfig.checkAuthenticated, passport.authenticate('google', {
        successRedirect: '/google-login/callback/return',
        failureRedirect: '/input'
    }));
    router.get('/google-login/callback/return', function (req, res) {
        console.log(req.session.user.id + ':' + req.user.id)
        req.session.user.albums = req.user.albums
        req.session.user.accessTokenGoogle = req.user.accessToken
        res.redirect('/input')
    })
    return router
}
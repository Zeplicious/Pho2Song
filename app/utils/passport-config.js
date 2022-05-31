
const SpotifyStrategy = require('passport-spotify').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var SpotifyWebApi = require('spotify-web-api-node');
const got = require('got')
const spotifyUtils = require("./spotifyUtils.js");
const googleUtils = require("./googleUtils.js");

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;

function initialize(passport, spotify_users, spotify_timers, spotify_users_data, google_users){
    //STRATEGIA PASSPORT SPOTIFY
    passport.use('spotify',
        new SpotifyStrategy({
            clientID: spotify_client_id,
            clientSecret: spotify_client_secret,
            callbackURL: process.env.SPOTIFY_URI || 'http://localhost:8080/spotify/callback'
        },
            async function (accessToken, refreshToken, expiresIn, profile, done) {
                let spotifyApi = new SpotifyWebApi({
                    clientId: spotify_client_id,
                    clientSecret: spotify_client_secret,
                })

                //Setto accessToken e refreshToken ottenuti dalla strategia passport

                spotifyApi.setAccessToken(accessToken);
                spotifyApi.setRefreshToken(refreshToken);
                let tastes = await spotifyUtils.getUserTaste(spotifyApi)

                //gestisco il refreshtoken automatizzando la richiesta di un nuovo accesstoken
                let intervalID = setInterval(async () => {
                    let data = await spotifyApi.refreshAccessToken();
                    let access_token = data.body['access_token'];
                    spotifyApi.setAccessToken(access_token);
                    spotify_users_data.set(profile.id,{tastes:tastes, accessToken: access_token})
                    console.log("accesstoken refreshed: " + spotify_users_data.get(profile.id).accessToken)
                }, expiresIn / 2  * 1000);
                spotify_timers.set(profile.id,intervalID)

                let prof_pic
                if (profile.photos.length == 0) prof_pic = './images/skuffed_def_prof_pic_spotify.jpg'
                else prof_pic = profile.photos[0].value

                spotify_users_data.set(profile.id,{tastes:tastes, accessToken: accessToken})
                spotify_users.set(profile.id, {
                    id: profile.id,
                    name: profile.displayName,
                    prof_pic: prof_pic,
                    //timer: intervalID,
                    accessTokenGoogle: '',
                    albums: null
                })
                return done(null, profile);

            }
        )
    )
    //STRATEGIA PASSPORT GOOGLE
    passport.use('google',
        new GoogleStrategy({
            clientID: google_client_id,
            clientSecret: google_client_secret,
            callbackURL: process.env.GOOGLE_URI || 'http://localhost:8080/google-login/callback'
        },
            async function (accessToken, refreshToken, profile, cb) {
                let data = await googleUtils.getAlbums(accessToken)
                google_users.set(profile.id, {
                    id: profile.id,
                    albums: data,
                    accessToken: accessToken,
                })
                return cb(null, profile)
            })
    )
    //serializza Utente
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })

    //deserializza Utente
    passport.deserializeUser(function (id, done) {

        let user = spotify_users.get(id)
        if (user != null) {
            done(null, user)
        }
        else {
            user = google_users.get(id)
            done(null, user)
            //google_users.delete(id)
        }
    })
}
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


module.exports = {
    initialize,
    checkAuthenticated,
    checkNotAuthenticated,
}
const passportConfig = require("../utils/passport-config.js")
const spotifyUtils = require("../utils/spotifyUtils.js");
var SpotifyWebApi = require('spotify-web-api-node');
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
module.exports =function build(users){
    const router = require("express").Router();

    router.get('/plist-analyzer',  passportConfig.checkAuthenticated, (req, res) => {
        let spotifyApi = new SpotifyWebApi({
            clientId: spotify_client_id,
            clientSecret: spotify_client_secret,
        })
        spotifyApi.setAccessToken(users.get(req.session.user.id).accessToken)

        spotifyApi.getUserPlaylists(req.session.user.id, { limit: 50 }).then(data => {

            var playlists = data.body.items.filter(item => item.tracks.total != 0)
            res.render('./pages/plist-analyzer.ejs', {
                playlists: playlists, p2sUser: {
                    userID: req.session.user.id,
                    username: req.session.user.name,
                    user_image: req.session.user.prof_pic
                }
            })  /* Invia al frontend le playlist da cui l'utente sceglie quella da anallizare */
        })
    })
    return router

}


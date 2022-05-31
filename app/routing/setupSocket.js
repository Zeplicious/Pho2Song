var SpotifyWebApi = require('spotify-web-api-node');
const spotifyUtils = require("../utils/spotifyUtils.js");
const colorUtil = require("../utils/getColors.js");

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var userData
var spotify_users_tastes

async function work(spotifyId) {
    let data
    try {
        let photo = userData.get(spotifyId).photos.pop();
        let imgName = userData.get(spotifyId).names.pop();
        if (photo == null) data = null
        else {
            let song
            if(photo.path !== undefined){
                song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUpload(photo),/* await */ spotify_users_tastes.get(spotifyId).tastes, userData.get(spotifyId).songsChosen)
                userData.get(spotifyId).songsChosen.push(song)			
            }
            else {
                song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(photo),/*  await */spotify_users_tastes.get(spotifyId).tastes,userData.get(spotifyId).songsChosen)
                userData.get(spotifyId).songsChosen.push(song)					
            }
            userData.get(spotifyId).songsDB.push({
                song: song,
                photo: imgName
            })
            data = song
        }
    } catch (e) {
        console.log(e)
        data = 'error'
    }
    return data
}
module.exports=function setup(server,data, users){
    userData=data
    spotify_users_tastes= users
    const io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log("Connected succesfully to the socket ...");
        socket.on('message', async function(message){
            while(true){
                let data=await work(message)
                if (data=='error') break;
                else if (data) socket.emit('message',data)
                else {
                    socket.emit('message','end')
                    break
                }
            }
        })

        socket.on("plist-analyzer-message", async (message) => {
            let spotifyApi = new SpotifyWebApi({
                clientId: spotify_client_id,
                clientSecret: spotify_client_secret,
            })
            spotifyApi.setAccessToken(users.get(message.userID).accessToken)
            spotifyUtils.analyzePlaylist(spotifyApi, message.playlistID).then(data => {
                socket.emit("plist-stats", data)
            })
        })

        socket.on('disconnect', function() {
            console.log('Got disconnect!');
        });
    });
}
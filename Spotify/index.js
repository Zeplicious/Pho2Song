
var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const wrapper = require("./wrapper.js");
const secrets = require('./secrets')

client_id = secrets.spotify.client_id
client_secret = secrets.spotify.client_secret;

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
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: 'http://localhost:8888/callback'
  });
const app = express();

app.get('/', function(req, res) {
  res.sendFile('/home/daniele/codeenv/primaprovaspotify/SpotifyPlaylistExport/public/index.html')
});



app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});
app.get('/data', (req,res)=>{
  wrapper.getMyData(spotifyApi,function(ret){
    res.send('Ecco le tue playlist:\r\n' + ret);
  });
}); 
app.get('/callback', (req, res) => {
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
  res.sendFile('/home/daniele/codeenv/primaprovaspotify/SpotifyPlaylistExport/public/home.html');
});
  
app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  )
);






//spotifyApi.getAudioFeaturesForTrack()
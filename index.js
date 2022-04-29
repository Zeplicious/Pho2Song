const express = require('express');
const utils = require('./oauthUtils.js')
const secrets = require('./secrets')
const app = express();

var code = "";

client_id = secrets.google.client_id
client_secret = secrets.google.client_secret;

redirect_uri='http://localhost:8888/callback';

var getCode = "https://accounts.google.com/o/oauth2/auth?client_id="+client_id+"&scope=https://www.googleapis.com/auth/photoslibrary.readonly&approval_prompt=force&redirect_uri="+redirect_uri+"&response_type=code";

var access_token='';
var album='';
app.get('/login', function(req, res){ 
        res.send("<br><br><button onclick='window.location.href=\""+ getCode +"\"'>Log in with Google</button>");
});

app.get('/callback', function (req, res) {
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
app.get('/input', function (req,res){
	utils.getColors(res,access_token,album)
	.then(colors => res.send(colors))
})

app.listen(8888, ()=>{
    console.log('Server listening on http://localhost:8888/login');
});
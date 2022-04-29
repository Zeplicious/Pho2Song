const express = require('express');
const utils = require('./oauthUtils.js')
const app = express();

var code = "";

client_id = '375115062743-lakfnqvihlgm2rbuggptdqstiujqger4.apps.googleusercontent.com';
client_secret = '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';

redirect_uri='http://localhost:8888/callback';

var getCode = "https://accounts.google.com/o/oauth2/auth?client_id="+client_id+"&scope=https://www.googleapis.com/auth/photoslibrary.readonly&approval_prompt=force&redirect_uri="+redirect_uri+"&response_type=code";



app.get('/login', function(req, res){ 
        res.send("<br><br><button onclick='window.location.href=\""+ getCode +"\"'>Log in with Google</button>");
});

app.get('/callback', async function (req, res) {
	code = req.query.code;
	utils.getToken(code)
	.then(token => utils.getAlbums(token)
	.then(albums => {
		utils.getColors(token,albums[1].id)
		console.log(albums)
		res.send(albums)
	}));
});

app.listen(8888, ()=>{
    console.log('Server listening on http://localhost:8888/login');
});
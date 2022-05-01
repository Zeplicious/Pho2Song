const res = require('express/lib/response');
const fetch = require('node-fetch')
const colorUtil = require('./getColors.js')
const secrets = require('./secrets')
const wrapper = require('./wrapper.js')


client_id = secrets.google.client_id
client_secret = secrets.google.client_secret;

async function getToken(code){

    let url = 'https://www.googleapis.com/oauth2/v3/token';
    let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    let body ="code="+code+"&client_id="+client_id+"&client_secret="+client_secret+"&redirect_uri=http%3A//localhost%3A8888/callback&grant_type=authorization_code";
	
    const response = await fetch(url, {
	    method: 'post',
	    body: body,
	    headers: headers
    });
    const data = await response.json();
    return  data.access_token
}

async function getAlbums(token){

    let url = 'https://photoslibrary.googleapis.com/v1/albums'
	let headers = {'Authorization': 'Bearer '+token};
    const response = await fetch(url, {
	    method: 'get',
	    headers: headers
    });
    const data = await response.json();
    return  data.albums
}
async function getPhotos(token,albumId){

    let url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'
	let headers = {'Authorization': 'Bearer '+token};
    let body = '{"albumId" : "'+albumId+'"}'

    const response = await fetch(url, {
	    method: 'post',
        body: body,
	    headers: headers
    });
    const data = await response.json();
    
    return data.mediaItems
}
module.exports={
    getToken,
    getAlbums,
    getPhotos
}
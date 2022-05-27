
const fetch = require('node-fetch')

async function getAlbums(accessToken){

    let url = 'https://photoslibrary.googleapis.com/v1/albums'
	let headers = {'Authorization': 'Bearer '+accessToken};
    const response = await fetch(url, {
	    method: 'get',
	    headers: headers
    });
    const data = await response.json();
    return  data.albums
}
async function getPhotos(accessToken,albumId){

    let url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'
	let headers = {'Authorization': 'Bearer '+accessToken};
    let body = '{"albumId" : "'+albumId+'"}'

    const response = await fetch(url, {
	    method: 'post',
        body: body,
	    headers: headers
    });
    const data = await response.json();
    return data.mediaItems
}
//getToken,
module.exports={
    getAlbums,
    getPhotos
}
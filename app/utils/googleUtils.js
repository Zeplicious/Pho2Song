
const got = require('got')
async function getAlbums(accessToken){

    let url = 'https://photoslibrary.googleapis.com/v1/albums'
	let headers = {'Authorization': 'Bearer '+accessToken};
    var data = await got(url, {headers: headers}).json();

    return  data.albums
}
async function getPhotos(accessToken,albumId){
    let url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'
	let headers = {'Authorization': 'Bearer '+accessToken};
    let body = '{"albumId" : "'+albumId+'"}'
    try {
        var data = await got.post(url, {headers: headers, body: body}).json();
        return data.mediaItems
    } catch (error) {
        console.log("getPhotos: "+error)
    }
}
//getToken,
module.exports={
    getAlbums,
    getPhotos
}
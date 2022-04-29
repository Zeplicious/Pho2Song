const fetch = require('node-fetch')
const secrets = require('./secrets')

const client_id = secrets.imagga.client_id
const client_secret = secrets.imagga.client_secret;

async function getColorsFromUrl(imageUrl){
    var url = 'https://api.imagga.com/v2/colors?image_url=' + encodeURIComponent(imageUrl);
    var auth = client_id+':'+client_secret;
    var authString = auth.toString();
    const response = await fetch(url, {
	    method: 'get',
	    headers: {
            Authorization: "Basic "+Buffer.from(authString).toString('base64')
          }
    });
    var data = await response.json();
    console.log('5 most representative colors of the photo in RGB:')
    for(let color of data.result.colors.image_colors){
        console.log('R:'+color.r, 'G:'+color.g,'B:'+color.b)
    }
}

module.exports={
    getColorsFromUrl
}
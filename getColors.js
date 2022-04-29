const res = require('express/lib/response');
const fetch = require('node-fetch')
const secrets = require('./secrets')

const client_id = secrets.imagga.client_id
const client_secret = secrets.imagga.client_secret;

async function getColorsFromUrl(imageUrl,id){
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
    var temp=Array();
    for(let color of data.result.colors.image_colors){
        temp.push(
            {
                r: color.r,
                g: color.g,
                b: color.b
            })
    }
    var imInfo={
        id: id,
        url: imageUrl,
        colors: temp
    }
    return imInfo;

}
module.exports={
    getColorsFromUrl
}
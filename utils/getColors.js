const { get } = require('express/lib/request');
const res = require('express/lib/response');
const fetch = require('node-fetch')
const secrets = require('../secrets')

const client_id = secrets.imagga.client_id
const client_secret = secrets.imagga.client_secret;

async function getColorsFromUpload(image){
    const body = new FormData
    body.append("image", image)

    var response = await fetch("https://api.imagga.com/v2/uploads", {
        body,
        headers: {
          Authorization: "Basic "+Buffer.from(authString).toString('base64'),
        "Content-Type": "multipart/form-data"
        }
    })
    var url = 'https://api.imagga.com/v2/colors?image_upload_id=' + response.result.upload_id+ '&extract_overall_colors=1&extract_object_colors=0&overall_count=5&separated_count=0';
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
        //url: imageUrl,
        colors: temp
    }
    console.log(imInfo);
    return imInfo;

}

async function getColorsFromUrl(imageUrl){
    var url = 'https://api.imagga.com/v2/colors?image_url=' + encodeURIComponent(imageUrl)+ '&extract_overall_colors=1&extract_object_colors=0&overall_count=5&separated_count=0';
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
        //url: imageUrl,
        colors: temp
    }
    console.log(imInfo);
    return imInfo;

}

async function debug(){
    let i=0
    let array=Array()
    while(i<10){
        array.push(await getColorsFromUrl('https://lh3.googleusercontent.com/lr/AFBm1_aoF3I48dJVLFnxUlgx00VwIDlCQDfr-14gkJ1MaJH9xo_FeSDri2Qi3FP6Jycyv1nvEcXAc5CbNMdbSqihiD_vWi3cmo9LxlOd7zVGyMddTSvKoAEsotXyOlRKZH9TXw6riJ9OCVnRyJfUje1MZUadwO85s9Upn8FGHe3XIzxJaVBPjH-nxX9fubLBN4RVFXFBH_MVijS7dRoCo9epiWGHrOJotMBPHZkPsl9G_HG3VIfcp7mB9oMewwV6DkxLoTfj08-EQm4SvDdohONnErIr-6YkbZBEezNVvIDZJXXlY7WVP1NNNy9hMB7fAp3rJtQHCEghJogUZyTz1BntYw6cnPJRxT74FkBDX3BzKj-XqQ9gr-pvTfkqOMNMUoTp4X1CGOomEnw_9BqU_Q9J5eXJuCco0GOkzCJhfAEFXBYwcnRDhRXQADYgV4EDgnwBD2DMo-n3FTq8cXVxycIQeEhhaoYYGeiuOvAfSzGs6wlShbzDNTEf2RXiejLiQWMn-jz3E0xH52gutSBi8qJIIfG3M2sSR9LeW38EiTOtQE8ml7hl_iRVkcjsK0lKp4A8dNgMuE5bSRhVZzw8emuA4v54x1bwL5MxIhmLc6_4i_84ke3GAaRu_Cj9s1Ynkx8PlNijuf2zhRLQ78SBdsUu9meqhtMEZNGhwBog8xSr_-rxP95AQYSD3nAqg3JqwybH1Znmtorug7tZNZrIWsZ2Qw_4NnnQoYA8q3mhl7GxeCSCXlyzx2otS_CcM62fHbanAf9fq2rZV7AoAv00blokUAPFonrrz7lwu_akiJckQqxYj3ykjYR-BAMxIYgIAfarnsjMs3o',i))
        i++;
    }
    console.log(array)
}
//debug()
module.exports={
    getColorsFromUpload,
    getColorsFromUrl
}
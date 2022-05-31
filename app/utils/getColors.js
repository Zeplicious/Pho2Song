require('dotenv').config()
const got = require('got')
/* const secrets = require('../secrets') */

const FormData=require('form-data');
const fs =require('fs');


const client_id = process.env.IMAGGA_CLIENT_ID;
const client_secret = process.env.IMAGGA_CLIENT_SECRET;

async function getColorsFromUpload(image){
    var temp = Array();

    
    for (let index = 0; index < 1000000000; index++){}      //Scommentare solo quando si intende fare prove in locale. Ricordare di commentare nuovamente prima di effetturare un push
    temp.push(
        {
            r: 104,
            g: 104,
            b: 104
        }
    )
    return;
    

    if(image.mimetype && image.mimetype.startsWith("image/")) {
        const filePath = image.path;
        console.log(filePath)
        const formData = new FormData();
        formData.append("image", fs.createReadStream(filePath));
        var response;

        try {
            response = await got.post('https://api.imagga.com/v2/uploads', { body: formData, username: client_id, password: client_secret }).json();

            var url = 'https://api.imagga.com/v2/colors?image_upload_id=' + response.result.upload_id + '&extract_overall_colors=1&extract_object_colors=0&overall_count=5&separated_count=0';

            response = await got(url, { username: client_id, password: client_secret }).json();
        

            for (let color of response.result.colors.image_colors) {

                temp.push(
                    {
                        r: color.r,
                        g: color.g,
                        b: color.b
                    }
                )
            }
        } catch (error) {
            temp.push(
                {
                    r: 57,
                    g: 105,
                    b: 4
                }
            )
            console.log(error);
        }
    }
    else {
        temp.push(
            {
                r: 57,
                g: 105,
                b: 4
            }
        )
    }
    
    return temp;    
}

async function getColorsFromUrl(imageUrl){
    var temp=Array();


    for (let index = 0; index < 1000000000; index++){}       //Scommentare solo quando si intende fare prove in locale. Ricordare di commentare nuovamente prima di effetturare un push
    temp.push(
        {
            r: 104,
            g: 104,
            b: 104
        }
    )
    return;


    var url = 'https://api.imagga.com/v2/colors?image_url=' + encodeURIComponent(imageUrl)+ '&extract_overall_colors=1&extract_object_colors=0&overall_count=5&separated_count=0'
    var response

    try {
        response = await got(url, {username: client_id, password: client_secret}).json();

        if (response.statusCode!==undefined && response.statusCode == 403) {
            temp.push(
                {
                    r: 104,
                    g: 104,
                    b: 104
                }
            )
    
            return temp
        }

        for(let color of response.result.colors.image_colors){
            temp.push(
                {
                    r: color.r,
                    g: color.g,
                    b: color.b
                }
            )
        }
        
    } catch (error) {
        temp.push(
            {
                r: 104,
                g: 104,
                b: 104
            }
        )
        console.log(error);
    }


    //url: imageUrl,
 

    //console.log(imInfo);
    return temp;    
}
async function test(){
    
    const got = await import('got')
    const filePath = "../images/1652619577614--a2wxxe - Copia - Copia.jpg";
    const formData = new FormData();
    formData.append("image",fs.createReadStream(filePath));

    var auth = client_id+':'+client_secret;
    var authString = auth.toString();
    try {
        const response = await got.post('https://api.imagga.com/v2/uploads', {body: formData, username: client_id, password: client_secret});
        
        console.log(response.body);
    } catch (error) {
        console.log(error);
    }
    console.log(response)
    //var url = 'https://api.imagga.com/v2/colors?image_upload_id=' + response.result.upload_id+ '&extract_overall_colors=1&extract_object_colors=0&overall_count=5&separated_count=0';
     

    /* const got = await import('../../node_modules/got/dist/source/index.js')
    const imageUrl = 'https://imagga.com/static/images/tagging/wind-farm-538576_640.jpg';
    const url = 'https://api.imagga.com/v2/colors?image_url=' + encodeURIComponent(imageUrl);

    
    try {
        const response = await got(url, {username: client_id, password: client_secret});
        console.log(response.body);
    } catch (error) {
        console.log(error);
    } */
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

module.exports={
    getColorsFromUpload,
    getColorsFromUrl
}
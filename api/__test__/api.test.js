//Dipendenze necessarie
require('dotenv').config()
const got = require("got")
const request = require('supertest');

const app = require("../server.js");
var client_id = process.env.SPOTIFY_CLIENT_ID
var client_secret = process.env.SPOTIFY_CLIENT_SECRET
let url = 'https://accounts.spotify.com/api/token'
let headers = { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) }
let form = { grant_type: 'client_credentials' }


let data=got.post(url, {
    headers: headers,
    form: form
}).json()
describe("POST /playlists/analyze", () => {
    

    test("Status code should be 200 and response should be defined",async()=>{
        let accessToken = (await data).access_token
        let response= await request(app)
        .post('/api/playlists/analyze')
        .send({id: '37i9dQZEVXbMDoHDwVN2tF',accessToken: accessToken.toString()})
        expect(response.statusCode).toBe(200)
        expect(response).toBeDefined()
        expect(response.body.Acousticness).toBeDefined()
    })
    test("Status code should be 400",async()=>{
        let accessToken = (await data).access_token
        let response= await request(app)
        .post('/api/playlists/analyze')
        .send({id: '',accessToken: accessToken.toString()})
        expect(response.statusCode).toBe(400)
    })

})
describe("POST /photo-song", () => {
    let temp
    test("Status code should be 200 and response should be defined",async()=>{
        let accessToken = (await data).access_token
        let url= 'https://www.psicosocial.it/wp-content/uploads/2020/10/immagine-fissa-si-muove.jpg'
        
        temp=request(app)
        .post('/api/photo-song')
        .send({url: url,accessToken: accessToken.toString()})
        response=await temp
        expect(response.statusCode).toBe(200)
        expect(response).toBeDefined()
        expect(response.body.uri).toBeDefined()
        expect(response.body.name).toBeDefined()
    })
    test("Status code should be 400",async()=>{
        let accessToken = (await data).access_token
        
        await temp
        let response= await request(app)
        .post('/api/photo-song')
        .send({url: '',accessToken: accessToken.toString()})
        expect(response.statusCode).toBe(400)
    })

})
describe("POST /palette-song", () => {
    var temp=[
        {
            r: 104,
            g: 104,
            b: 104
        },
        {
            r: 104,
            g: 104,
            b: 104
        },
        {
            r: 104,
            g: 104,
            b: 104
        }
    ]
    test("Status code should be 200 and response should be defined",async()=>{
        let accessToken = (await data).access_token
        let response= await request(app)
        .post('/api/palette-song')
        .send({colors: temp,accessToken: accessToken.toString()})
        expect(response.statusCode).toBe(200)
        expect(response).toBeDefined()
        expect(response.body.uri).toBeDefined()
        expect(response.body.name).toBeDefined()
    })
    test("Status code should be 400",async()=>{
        let response= await request(app)
        .post('/api/palette-song')
        .send({id: '',accessToken: ''})
        expect(response.statusCode).toBe(400)
    })

}) 

//Dipendenze necessarie
require('dotenv').config()
const got = require("got")
const request = require('supertest');

const app = require("../server.js");

describe("POST /analyze", () => {
    describe("POST playlist/analyze", () => {
        test("Status code should be 200 and response should be defined",async()=>{
            let response= await request(app)
            .post('/api/playlist/analyze')
            .send({playlist_id: "37i9dQZEVXbMDoHDwVN2tF"})
            expect(response.statusCode).toBe(200)
            expect(response).toBeDefined()
            expect(response.body.Acousticness).toBeDefined()
        })
        test("Status code should be 400",async()=>{
            let response= await request(app)
            .post('/api/playlist/analyze')
            .send({playlist_id: ""})
            expect(response.statusCode).toBe(400)
        })
    })
    describe("POST album/analyze", () => {
        test("Status code should be 200 and response should be defined",async()=>{
            let response= await request(app)
            .post('/api/album/analyze')
            .send({album_id: "0VliboIrLzdC2Qgjdm5V4S"})
            expect(response.statusCode).toBe(200)
            expect(response).toBeDefined()
            expect(response.body.Acousticness).toBeDefined()
        })
        test("Status code should be 400",async()=>{
            let response= await request(app)
            .post('/api/album/analyze')
            .send({album_id: ""})
            expect(response.statusCode).toBe(400)
        })
    })

})
describe("POST /photo-song", () => {
    let url= 'https://www.psicosocial.it/wp-content/uploads/2020/10/immagine-fissa-si-muove.jpg'
    let temp
    describe("POST playlist/photo-song", () => {
        test("Status code should be 200 and response should be defined",async()=>{
            let url= 'https://www.psicosocial.it/wp-content/uploads/2020/10/immagine-fissa-si-muove.jpg'
            
            temp=request(app)
            .post('/api/playlist/photo-song')
            .send({url: url,playlist_id: "37i9dQZEVXbMDoHDwVN2tF"})
            response=await temp
            expect(response.statusCode).toBe(200)
            expect(response).toBeDefined()
            expect(response.body.uri).toBeDefined()
            expect(response.body.name).toBeDefined()
        })
        test("Status code should be 400",async()=>{
            
            await temp
            temp = request(app)
            let response=await temp
            .post('/api/playlist/photo-song')
            .send({url: '',playlist_id: "37i9dQZEVXbMDoHDwVN2tF"})
            expect(response.statusCode).toBe(400)
        })
        test("Status code should be 400",async()=>{
            
            await temp
            temp= request(app)
            .post('/api/playlist/photo-song')
            .send({url: url,playlist_id: ""})
            let response=await temp
            expect(response.statusCode).toBe(400)
        })
    })
    describe("POST album/photo-song", () => {
        test("Status code should be 200 and response should be defined",async()=>{
            await temp
            temp=request(app)
            .post('/api/album/photo-song')
            .send({url: url,album_id: "0VliboIrLzdC2Qgjdm5V4S"})
            response=await temp
            expect(response.statusCode).toBe(200)
            expect(response).toBeDefined()
            expect(response.body.uri).toBeDefined()
            expect(response.body.name).toBeDefined()
        })
        test("Status code should be 400",async()=>{
            
            await temp
            temp= request(app)
            .post('/api/album/photo-song')
            .send({url: '',album_id: "0VliboIrLzdC2Qgjdm5V4S"})
            let response=await temp
            expect(response.statusCode).toBe(400)
        })
        test("Status code should be 400",async()=>{
            
            await temp
            temp=request(app)
            let response=await temp
            .post('/api/album/photo-song')
            .send({url: url,album_id: ""})
            expect(response.statusCode).toBe(400)
        })
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
    describe("POST playlist/palette-song", () => {
        test("Status code should be 200 and response should be defined",async()=>{
            let response= await request(app)
            .post('/api/playlist/palette-song')
            .send({colors: temp,playlist_id: "37i9dQZEVXbMDoHDwVN2tF"})
            expect(response.statusCode).toBe(200)
            expect(response).toBeDefined()
            expect(response.body.uri).toBeDefined()
            expect(response.body.name).toBeDefined()
        })
        test("Status code should be 400",async()=>{
            let response= await request(app)
            .post('/api/playlist/palette-song')
            .send({colors: [],playlist_id: "37i9dQZEVXbMDoHDwVN2tF"})
            expect(response.statusCode).toBe(400)
        })
        test("Status code should be 400",async()=>{
            let response= await request(app)
            .post('/api/playlist/palette-song')
            .send({colors: temp,playlist_id: ""})
            expect(response.statusCode).toBe(400)
        })
    })
    describe("POST album/palette-song", () => {
        test("Status code should be 200 and response should be defined",async()=>{
            let response= await request(app)
            .post('/api/album/palette-song')
            .send({colors: temp,album_id: "0VliboIrLzdC2Qgjdm5V4S"})
            expect(response.statusCode).toBe(200)
            expect(response).toBeDefined()
            expect(response.body.uri).toBeDefined()
            expect(response.body.name).toBeDefined()
        })
        test("Status code should be 400",async()=>{
            let response= await request(app)
            .post('/api/album/palette-song')
            .send({colors: [],album_id: "0VliboIrLzdC2Qgjdm5V4S"})
            expect(response.statusCode).toBe(400)
        })
        test("Status code should be 400",async()=>{
            let response= await request(app)
            .post('/api/album/palette-song')
            .send({colors: temp,album_id: ""})
            expect(response.statusCode).toBe(400)
        })
    })

}) 

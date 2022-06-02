//Dipendenze necessarie
const imaggaUtils = require("../utils/getColors")
const spotifyUtils = require("../utils/spotifyUtils")
const SpotifyWebApi = require("spotify-web-api-node")
const got = require("got")

var userTastes
var colors

/* Testing del workflow completo della funzinalità principale */

//Ottengo i gusti musicali di un utente simulandolo
describe("Get user's taste from his Spotify account", () => {

    let result

    describe("Given a correct spotifyApi struct", () => {

        //Creazione struttura di autorizzazione per Client Credentials Auth. Flow
        var client_id = process.env.SPOTIFY_CLIENT_ID
        var client_secret = process.env.SPOTIFY_CLIENT_SECRET

        let url = 'https://accounts.spotify.com/api/token'
        let headers = { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) }
        let form = { grant_type: 'client_credentials' }

        test("Should return an array containing objects that identifies a song with its uri, name and main stats", async () => {

            let data = await got.post(url, {
                headers: headers,
                form: form
            }).json()
    
            let spotifyApi = new SpotifyWebApi({
                clientId: client_id,
                clientSecret: client_secret,
            })
            
            spotifyApi.setAccessToken(data.access_token)

            let input = spotifyApi

            result = spotifyUtils.getUserTaste(input)

            let response = await result
            userTastes = response

            expect(response).toBeDefined()
            expect(response.length).toBeGreaterThan(0)
            expect(response[0]).toBeDefined()
        })
    })
})

//Ottengo i colori da una foto dummy e da un url dummy
describe("Get colors from file upload or url", () => {

    let result

    describe("Given a file that is a photo", () => {

        let input = {
            fieldname: 'images',
            originalname: '1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            destination: './public/images',
            filename: '1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            path: 'public/images/1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            size: 751546
        }

        test("Should respond with a defined Array of lenght > 0 containing objects with rgb parameters inside", async () => {

            await result

            result = imaggaUtils.getColorsFromUpload(input)

            let response = await result
            colors = response

            expect(response).toBeDefined()
            expect(response.length).toBeGreaterThan(0)
            expect(response[0]).toBeDefined()
        }, 10000)
    })

    describe("Given a file that is not a photo", () => {

        let input = {
            fieldname: 'images',
            originalname: '1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            encoding: '7bit',
            mimetype: 'text/plain',
            destination: './public/images',
            filename: '1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            path: 'public/images/1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            size: 751546
        }

        test("Should respond with an Array containing a random set of colors", async () => {

            await result

            result = imaggaUtils.getColorsFromUpload(input)
            let response = await result

            expect(response).toBeDefined()
            expect(response.length).toBeGreaterThan(0)
            expect(response[0]).toBeDefined()
        })
    })

    describe("Given a url", () => {

        const input = "https://appartements-panorama.it/wp-content/uploads/2021/04/Apartements-Panorama-Vols-am-Schlern-Dolomiten-18.jpg"

        test("Should respond with a defined Array of lenght > 0 containing objects with rgb parameters inside", async () => {

            await result
            result = imaggaUtils.getColorsFromUrl(input)
            let response = await result

            expect(response).toBeDefined()
            expect(response.length).toBeGreaterThan(0)
            expect(response[0]).toBeDefined()
        }, 10000)
    })

    describe("Given an url that is not a photo", () => {

        const input = "https://upload.wikimedia.org/wikipedia/commons/5/58/Forggensee_Panorama_SK_0001.jpg"

        test("Should respond with an Array containing a random set of colors", async () => {

            await result
            result = imaggaUtils.getColorsFromUpload(input)
            let response = await result

            expect(response).toBeDefined()
            expect(response.length).toBeGreaterThan(0)
            expect(response[0]).toBeDefined()
        })
    })
})

//Ottengo una canzone dai gusti dell'utente simulato iniziali, più i colori ottenuti dalla foto dummy
describe("Get song from user's tastes and an Array of colors", () => {

    let result

    describe("Given a correct user's tastes array and a correct array of color objects", () => {

        

        test("Should return an object with uri and name of the new song", async () =>  {

            let input = {
                userTastes: await userTastes,
                colors: await colors,
                songsChosen: new Array()
            }

            result = spotifyUtils.getSongFromColors(input.colors, input.userTastes, input.songsChosen)
            let response = await result

            expect(response).toBeDefined()
            expect(response.uri).toBeDefined()
            expect(response.name).toBeDefined()
        })
    })
})
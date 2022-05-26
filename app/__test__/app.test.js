//Dipendenze necessarie
const imaggaUtils = require("../utils/getColors")
const os = require("os")

describe("Get colors from file upload or url", () => {

    let result

    describe("Given a file that is a photo", () => {

        let photoPath

        const input = {
            fieldname: 'images',
            originalname: '1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            destination: './public/images',
            filename: '1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            path: photoPath,
            size: 751546
        }

        test("Should respond with a defined Array of lenght > 0 containing objects with rgb parameters inside", async () => {

            await result

            if (os.type() == "Windows_NT") {
                //
                photoPath = 'public\\images\\1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg'
                console.log("Siamo su un sistema Windows")
            }
            else if(os.type() == "Darwin") {
                //
                photoPath = 'public/images/1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg'
                console.log("Siamo su un sistema macOS")
            }
            else if(os.type() == "Linux") {
                //
                photoPath = 'public/images/1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg'
                console.log("Siamo su un sistema Linux")
            }
            input.photoPath = photoPath

            result = imaggaUtils.getColorsFromUpload(input)
            let response = await result

            expect(response).toBeDefined()
            expect(response.length).toBeGreaterThan(0)
            expect(response[0]).toBeDefined()
        }, 10000)
    })

    describe("Given a file that is not a photo", () => {

        let photoPath

        const input = {
            fieldname: 'images',
            originalname: '1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            encoding: '7bit',
            mimetype: 'text/plain',
            destination: './public/images',
            filename: '1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg',
            path: photoPath,
            size: 751546
        }

        test("Should respond with an Array containing a random set of colors", async () => {

            await result

            if (os.type() == "Windows_NT") {
                //Siamo su un sistema Windows
                photoPath = 'public\\images\\1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg'
            }
            else if(os.type() == "Darwin") {
                //Siamo su un sistema macOS
                photoPath = 'public/images/1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg'
            }
            else if(os.type() == "Linux") {
                //Siamo su un sistema Unix
                photoPath = 'public/images/1653478147460--1. AWx ROG wallpaper-2560 x 1440 pixel-20200728-1.jpg'
            }

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
function validate(schema, body) {
	return schema.validate(body)
}

const dbName = 'p2splaylists';
const viewUrl = '_design/all_playlists/_view/all';

module.exports = function build(joi, couch, spotifyWebApi, spotifyUtils, colorUtil) {
    const Router = require("express").Router()

    Router.get('/playlists', (req, res) => {
        couch.get(dbName, viewUrl).then(
            (data, headers, status) => {
                res.send(data.data.rows)
            },
        (err)=>{
            console.log('ciao')
            if(err.body.reason=="Database does not exist."){
            couch.createDatabase(dbName).then(() => {
                couch.insert(dbName, {
                    _id: "_design/all_playlists",
                    "views": {
                        "all": {
                          "map": "function (doc) {\n  emit(doc._id, {name: doc.name, user: doc.user, song_number: doc.song_number, description: doc.description, songs: doc.songs});\n}"
                        }
                      },
                      "language": "javascript"
                }).then(({data, headers, status}) => {
                    couch.get(dbName, viewUrl).then(
                        (data, headers, status) => {
                            res.send(data.data.rows)
                        }
                    )            
                }, err => {
                    res.send(err);
                });
            }, 	
            err => {
                res.send(err);
            });
            }
            else res.send(err);	
        })
    })

    Router.get('/playlists/:id', (req, res) => {
        couch.get(dbName, viewUrl).then(
            (data, headers, status) => {
                for (index = 0; index < data.data.rows.length; index++) {
                    if (data.data.rows[index].id === req.params.id) {
                        return res.send(data.data.rows[index].id);
                    }
                }
                res.status(404).send('La playlist con id ' + req.params.id + ' non è stata trovata')
            },
            (err)=>{
                console.log('ciao')
                if(err.body.reason=="Database does not exist."){
                couch.createDatabase(dbName).then(() => {
                    couch.insert(dbName, {
                        _id: "_design/all_playlists",
                        "views": {
                            "all": {
                              "map": "function (doc) {\n  emit(doc._id, {name: doc.name, user: doc.user, song_number: doc.song_number, description: doc.description, songs: doc.songs});\n}"
                            }
                          },
                          "language": "javascript"
                    }).then(({data, headers, status}) => {
                        couch.get(dbName, viewUrl).then(
                            (data, headers, status) => {
                                res.send(data.data.rows)
                            }
                        )            
                    }, err => {
                        res.send(err);
                    });
                }, 	
                err => {
                    res.send(err);
                });
                }
                else res.send(err);	
            })
    })
    
    Router.post('/playlists/analyze', (req, res) => {
        const schema = joi.object({
            id: joi.string().required(),
            accessToken: joi.string().required()
        })
        
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)
        let spotifyApi = new spotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        })
        spotifyApi.setAccessToken(req.body.accessToken)
        try {
            spotifyUtils.analyzePlaylist(spotifyApi, req.body.id).then(data => {
                res.send(data)
            })
        }
        catch (e) {
            res.status(400).send(e)
        }
    })
    
    Router.post('/photo-song', async function (req, res) { //è richiesto lo scope user-top-read
        const schema = joi.object({
            url: joi.string().required(),
            accessToken: joi.string().required()
        })
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)
        let spotifyApi = new spotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        })
        spotifyApi.setAccessToken(req.body.accessToken)
    
        try {
            let taste = await spotifyUtils.getUserTaste(spotifyApi)
            song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(req.body.url), taste, [])
            res.send(song)
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    Router.post('/palette-song', async function (req, res) { //è richiesto lo scope user-top-read
        const schema = joi.object({
            colors: joi.array().items(
                joi.object({
                    r: joi.number().min(0).max(255).required(),
                    g: joi.number().min(0).max(255).required(),
                    b: joi.number().min(0).max(255).required(),
                })
            ),
            accessToken: joi.string().required()
        })
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)
        let spotifyApi = new spotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        })
        spotifyApi.setAccessToken(req.body.accessToken)
        let colors = new Array()
        for(index = 0; index < req.body.colors.length; index++){
            colors[index] = req.body.colors[index]
        }
        console.log("colori: " + colors)
        try {
            let taste = await spotifyUtils.getUserTaste(spotifyApi)
            song = await spotifyUtils.getSongFromColors(colors, taste, [])
            res.send(song)
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    return Router
}
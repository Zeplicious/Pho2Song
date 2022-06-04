async function analyzeAlbum(spotifyApi, albumId) {

    var data = await spotifyApi.getAlbumTracks(albumId)
    var ids = Array()

    for (let item of data.body.items) {
        ids.push(item.id);
    }

    let averageAcousticness = 0, countAcousticness = 0
    let averageDanceability = 0, countDanceability = 0
    let averageEnergy = 0, countEnergy = 0
    let averageInstrumentalness = 0, countInstrumentalness = 0
    let averageLiveness = 0, countLiveness = 0
    let averageLoudness = 0, countLoudness = 0
    let averageSpeechiness = 0, countSpeechiness = 0
    let averageTempo = 0, countTempo = 0

    var data2 = await spotifyApi.getAudioFeaturesForTracks(ids)

    for (let track of data2.body.audio_features) {
        if (track !== undefined && track != null) {
            if (track.acousticness !== undefined && track.acousticness != null) {
                averageAcousticness += track.acousticness * 100
                countAcousticness++
            }
            if (track.danceability !== undefined && track.danceability != null) {
                averageDanceability += track.danceability * 100
                countDanceability++
            }
            if (track.energy !== undefined && track.energy != null) {
                averageEnergy += track.energy * 100
                countEnergy++
            }
            if (track.instrumentalness !== undefined && track.instrumentalness != null) {
                averageInstrumentalness += track.instrumentalness * 100
                countInstrumentalness++
            }
            if (track.liveness !== undefined && track.liveness != null) {
                averageLiveness += track.liveness * 100
                countLiveness++
            }
            if (track.loudness !== undefined && track.loudness != null) {
                averageLoudness += track.loudness
                countLoudness++
            }
            if (track.speechiness !== undefined && track.speechiness != null) {
                averageSpeechiness += track.speechiness * 100
                countSpeechiness++
            }
            if (track.tempo !== undefined && track.tempo != null) {
                averageTempo += track.tempo
                countTempo++
            }
        }
    }


    var ret = {
        Acousticness: (averageAcousticness / (countAcousticness)).toFixed(2),
        Danceability: (averageDanceability / (countDanceability)).toFixed(2),
        Energy: (averageEnergy / (countEnergy)).toFixed(2),
        Instrumentalness: (averageInstrumentalness / (countInstrumentalness)).toFixed(2),
        Liveness: (averageLiveness / (countLiveness)).toFixed(2),
        Loudness: (averageLoudness / (countLoudness)).toFixed(2),
        Speechiness: (averageSpeechiness / (countSpeechiness)).toFixed(2),
        Tempo: (averageTempo / (countTempo)).toFixed(2)
    }




    return ret
}

async function getFeaturesFromAlbum(spotifyApi, album_id) {
    let ids = new Array()
    let names = new Array()

    console.log("entrato")

    try {
        let response = await spotifyApi.getAlbumTracks(album_id)
        for (let track of response.body.items) {
            ids.push(track.id)
            names.push(track.name)
        }
    }
    catch (e) {
        res.status(400).send(e)
    }

    try {
        albumData = await spotifyApi.getAudioFeaturesForTracks(ids)
    }
    catch (e) {
        res.status(400).send(e)
    }

    let result = new Array()

    //parse dei parametri utili
    var index = 0
    for (let track of albumData.body.audio_features) {
        if (track === undefined || track == null) continue
        result.push(
            {
                uri: ('spotify:track:' + track.id),
                name: names[index],
                danceability: track.danceability * 255,
                energy: track.energy * 255,
                acousticness: track.acousticness * 255,
            });
        index++
    }

    return result
}

async function getFeaturesFromPlaylist(spotifyApi, playlist_id) {
    let ids = new Array()
    let names = new Array()

    try {
        let response = await spotifyApi.getPlaylistTracks(playlist_id)
        for (let track of response.body.items) {
            ids.push(track.track.id)
            names.push(track.track.name)
        }
    }
    catch (e) {
        res.status(400).send(e)
    }

    try {
        playlistData = await spotifyApi.getAudioFeaturesForTracks(ids)
    }
    catch (e) {
        res.status(400).send(e)
    }

    let result = new Array()

    //parse dei parametri utili
    var index = 0
    for (let track of playlistData.body.audio_features) {
        if (track === undefined || track == null) continue
        result.push(
            {
                uri: ('spotify:track:' + track.id),
                name: names[index],
                danceability: track.danceability * 255,
                energy: track.energy * 255,
                acousticness: track.acousticness * 255,
            });
        index++
    }

    return result
}

async function setup(spotifyApi){
    let url = 'https://accounts.spotify.com/api/token'
    let headers = { 'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) }
    let form = { grant_type: 'client_credentials' }

	let data = got.post(url, {
        headers: headers,
        form: form
    }).json()

    var accessToken = (await data).access_token;

    var expires_in = (await data).expires_in

    spotifyApi.setAccessToken(accessToken);

    setInterval(async () => {
        let data = got.post(url, {
            headers: headers,
            form: form
        }).json()
        let accessToken = data.access_token;
        spotifyApi.setAccessToken(accessToken);
        console.log("refreshed access token")
    }, expires_in / 2 * 1000);
}

function validate(schema, body) {
    return schema.validate(body)
}


const got = require("got");
const { func } = require("joi")
const SpotifyWebApi = require("spotify-web-api-node");

module.exports = function build(joi, spotifyWebApi, spotifyUtils, colorUtil) {
    const Router = require("express").Router()

    var spotifyApi = new spotifyWebApi({
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    })

    spotifyApi.setAccessToken(null)

    //chiamate API che sfruttano gli album di Spotify

    Router.post('/album/analyze', async (req, res) => {
        const schema = joi.object({
            album_id: joi.string().required()
        })
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)

        if(spotifyApi.getAccessToken() == null){
            await setup(spotifyApi);
        }

        try {
            analyzeAlbum(spotifyApi, req.body.album_id).then(data => {
                res.send(data)
            })
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    Router.post('/album/palette-song', async function (req, res) {
        const schema = joi.object({
            album_id: joi.string().required(),
            colors: joi.array().items(
                joi.object({
                    r: joi.number().min(0).max(255).required(),
                    g: joi.number().min(0).max(255).required(),
                    b: joi.number().min(0).max(255).required(),
                })
            )
        })
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)

        if(spotifyApi.getAccessToken() == null){
            await setup(spotifyApi);
        }

        let colors = new Array()
        for (index = 0; index < req.body.colors.length; index++) {
            colors[index] = req.body.colors[index]
        }

        console.log(colors)

        try {
            song = await spotifyUtils.getSongFromColors(colors, await getFeaturesFromAlbum(spotifyApi, req.body.album_id), [])
            res.send(song)
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    Router.post('/album/photo-song', async function (req, res) {
        const schema = joi.object({
            album_id: joi.string().required(),
            url: joi.string().required()
        })
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)

        if(spotifyApi.getAccessToken() == null){
            await setup(spotifyApi);
        }

        try {
            song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(req.body.url), await getFeaturesFromAlbum(spotifyApi, req.body.album_id), [])
            res.send(song)
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    //chiamate API che sfruttano le playlist di Spotify

    Router.post('/playlist/analyze', async (req, res) => {
        const schema = joi.object({
            playlist_id: joi.string().required()
        })
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)

        if(spotifyApi.getAccessToken() == null){
            await setup(spotifyApi);
        }

        try {
            spotifyUtils.analyzePlaylist(spotifyApi, req.body.playlist_id).then(data => {
                res.send(data)
            })
        }
        catch (e) {
            res.status(400).send(e)
        }

    })

    Router.post('/playlist/palette-song', async function (req, res) {
        const schema = joi.object({
            playlist_id: joi.string().required(),
            colors: joi.array().items(
                joi.object({
                    r: joi.number().min(0).max(255).required(),
                    g: joi.number().min(0).max(255).required(),
                    b: joi.number().min(0).max(255).required(),
                })
            )
        })
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)

        if(spotifyApi.getAccessToken() == null){
            await setup(spotifyApi);
        }

        let colors = new Array()
        for (index = 0; index < req.body.colors.length; index++) {
            colors[index] = req.body.colors[index]
        }

        console.log(colors)

        try {
            song = await spotifyUtils.getSongFromColors(colors, await getFeaturesFromPlaylist(spotifyApi, req.body.playlist_id), [])
            res.send(song)
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    Router.post('/playlist/photo-song', async function (req, res) {
        const schema = joi.object({
            playlist_id: joi.string().required(),
            url: joi.string().required()
        })
        const { error } = validate(schema, req.body)
        if (error) return res.status(400).send(error.details[0].message)

        if(spotifyApi.getAccessToken() == null){
            await setup(spotifyApi);
        }

        try {
            song = await spotifyUtils.getSongFromColors(await colorUtil.getColorsFromUrl(req.body.url), await getFeaturesFromPlaylist(spotifyApi, req.body.playlist_id), [])
            res.send(song)
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    

    return Router
}
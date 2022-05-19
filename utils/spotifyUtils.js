var index = 0;
const fs = require('fs');
const { isBuffer } = require('util');
var ret = '';

async function getUserTaste(spotifyApi) {
  var data = await spotifyApi.getMyTopTracks({limit: 100})
  
  ids=Array()
  names=Array()
  if(data.body.total<50){
    let data = await spotifyApi.getPlaylistTracks('37i9dQZEVXbMDoHDwVN2tF', { limit: 50})
    for(let track of data.body.items){
      ids.push(track.track.id);
      names.push(track.track.name);
    }
    
  }
  if(data.body.total!=0){
    for(let track of data.body.items){
      ids.push(track.id);
      names.push(track.name);
    }
  }

  console.log(ids)
  var data = await spotifyApi.getAudioFeaturesForTracks(ids)
  ret = Array()

  //parse dei parametri utili
  index=0
  for(let track of data.body.audio_features){
    ret.push(
      {
        uri: ('spotify:track:'+track.id),
        name: names[index],
        danceability: track.danceability * 255,
        energy: track.energy * 255,
        acousticness: track.acousticness * 255,
      });
    index++
  }
  return ret
}


async function getSongFromColors(colors, songs) {

  //scegli una foto per i colori
  ret={
    uri: songs[index % songs.length].uri,
    name: songs[index % songs.length].name
  }
  index++;

  return ret


}

async function analyzePlaylist(spotifyApi, playlistId) {

  var data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 100 })
  var ids = Array()

  for (let item of data.body.items) {
    ids.push(item.track.id);
  }

  let averageAcousticness = 0
  let averageDanceability = 0
  let averageEnergy = 0
  let averageInstrumentalness = 0
  let averageLiveness = 0
  let averageLoudness = 0
  let averageSpeechiness = 0
  let averageTempo = 0

  var data2 = await spotifyApi.getAudioFeaturesForTracks(ids)

  for (let track of data2.body.audio_features) {
    averageAcousticness += track.acousticness * 100
    averageDanceability += track.danceability * 100
    averageEnergy += track.energy * 100
    averageInstrumentalness += track.instrumentalness * 100
    averageLiveness += track.liveness * 100
    averageLoudness += track.loudness
    averageSpeechiness += track.speechiness * 100
    averageTempo += track.tempo
  }


  var ret = {
    Acousticness: (averageAcousticness / (ids.length)).toFixed(2),
    Danceability: (averageDanceability / (ids.length)).toFixed(2),
    Energy: (averageEnergy / (ids.length)).toFixed(2),
    Instrumentalness: (averageInstrumentalness / (ids.length)).toFixed(2),
    Liveness: (averageLiveness / (ids.length)).toFixed(2),
    Loudness: (averageLoudness / (ids.length)).toFixed(2),
    Speechiness: (averageSpeechiness / (ids.length)).toFixed(2),
    Tempo: (averageTempo / (ids.length)).toFixed(2)
  }

  console.log(ret)

  return ret
}


module.exports = {
  getUserTaste,
  getSongFromColors,
  analyzePlaylist
}


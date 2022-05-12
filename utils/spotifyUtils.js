var index=0;
const fs = require('fs');
var ret= '';

async function getUserTaste(spotifyApi){

  var data = await spotifyApi.getMyTopTracks({limit: 100})
  ids=Array()
  
  for(let track of data.body.items){
    ids.push(track.id);
  }

  var data = await spotifyApi.getAudioFeaturesForTracks(ids)
  ret=Array()
  //parse dei parametri utili

  for(let track of data.body.audio_features){
    ret.push(
      {"id": track.id,
        "danceability":track.danceability*255,
        "energy":track.energy*255,
        "loudness":track.danceability*255,
      });
  }
  return ret


}
async function getSongFromColors(colors,songs){
  //scegli una foto per i colori
  ret=songs[index % songs.length].id
  index++;
  
  return ret


}
function getMyData(spotifyApi,callback) {
  (async() => {
    // console.log(me.body);
    getUserPlaylists(spotifyApi).then(data=>{
      console.log('---------------------------------Finito---------------------------------\n'+ret);
      callback(ret);
    });
  })().catch(e => {
    console.error(e);
  });
}//inutile
async function getUserPlaylists(spotifyApi) {
  const data = await spotifyApi.getUserPlaylists()
  
  //console.log("---------------+++++++++++++++++++++++++")
  let playlists = []
    
  for (let playlist of data.body.items) {
     // console.log(playlist.name + " " + playlist.id)
      ret += playlist.name + " " + playlist.id +'\r\n';
      let tracks = await getPlaylistTracks(spotifyApi,playlist.id, playlist.name);
      // console.log(tracks);
  
      const tracksJSON = { tracks }
      let data = JSON.stringify(tracksJSON);
      fs.writeFileSync('export/'+playlist.name+'.json', data);
    }
  }//inulile
  //GET SONGS FROM PLAYLIST
async function getPlaylistTracks(spotifyApi,playlistId, playlistName) {
  
  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })
  
    // console.log('The playlist contains these tracks', data.body);
    // console.log('The playlist contains these tracks: ', data.body.items[0].track);
    // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];
  
  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    //console.log(track.name + " : " + track.artists[0].name)
  }
    
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}//inutile
module.exports = {
  getMyData,
  getUserPlaylists,
  getPlaylistTracks,
  getUserTaste,
  getSongFromColors
}


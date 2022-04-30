
const fs = require('fs');
var ret= '';
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
}

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
  }
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
}
module.exports = {
    getMyData,
    getUserPlaylists,
    getPlaylistTracks
}

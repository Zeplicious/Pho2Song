function displaySongs(playlist){
    var playlistContainer = document.getElementById(playlist + "Songs");
    console.log(playlist + "Songs")
    if(playlistContainer.style.display == "none"){
        playlistContainer.style = "display: initial;"
    }
    else{
        playlistContainer.style = "display: none;"
    } 
}


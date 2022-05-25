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

function displayIsEmpty(){
    /* noSongsDisplayed = document.getElementById("no-songs-displayed");
    headerThreeNoPlaylists = '<h3>Sembra che in questa sessione tu non abbia ancora utilizzato Pho2Song :(</h3>'
    anchorToPho2Song = '<h3>Perché non provi a rimediare <a class="plist-analyzer-link" href="/input">cliccando qui! </a></h3>' */
    if(document.getElementById("playlistItem1") == null){      
        return true;
       /*  noSongsDisplayed.innerHTML = '<div class="row mx-auto p-2 text-center"> <div class="col-lg-6 col-xl-6 col-xxl-6">' + headerThreeNoPlaylists + '</div> </div>'
        noSongsDisplayed.innerHTML += '<div class="row mx-auto p-2 text-center"> <div class="col-lg-6 col-xl-6 col-xxl-6">' + anchorToPho2Song + '</div> </div>' */
    } 
    return false;
}


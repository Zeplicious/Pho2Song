var socket
//Creo la connessione con la socket
function connectToSocket() {
    let url = document.getElementById("url").innerHTML
    if(url && url!= null && url!=""){
        socket = io.connect(url);
    }
    else{    
        socket = io.connect("http://localhost:8080");
    }
    socket.on("plist-stats", (values) => {
        console.log(values.place)
        if (document.getElementById("sezione-risultato").style.display == "none") {
            document.getElementById("sezione-risultato").style.display = "initial"
        }

        if (document.getElementById("stats" + values.place).style.display == "none") {
            document.getElementById("stats" + values.place).style.display = "initial"
        }

        if ((document.getElementById("aggiungi-scelta").style.display == "none") && (document.getElementById("scelta2").style.display == "none")) {
            document.getElementById("aggiungi-scelta").style.display = "initial"
        }

        document.getElementById("plist" + values.place).innerHTML = values.plist_name
        
        let string = ''
        if (values.place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Acousticness + '%;" aria-valuenow=" ' + values.data.Acousticness + ' " aria-valuemin="0" aria-valuemax="100">' + values.data.Acousticness + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Acousticness + '%;" aria-valuenow=" ' + values.data.Acousticness + ' " aria-valuemin="0" aria-valuemax="100">' + values.data.Acousticness + '%</div>'
        }
        
        document.getElementById("acousticness" + values.place).innerHTML = string

        if (values.place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Danceability + '%;"aria-valuenow=" ' + values.data.Danceability + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Danceability + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Danceability + '%;" aria-valuenow=" ' + values.data.Danceability + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Danceability + '%</div>'
        }
        
        document.getElementById("danceability" + values.place).innerHTML = string

        if (values.place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Energy + '%;" aria-valuenow=" ' + values.data.Energy + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Energy + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Energy + '%;" aria-valuenow=" ' + values.data.Energy + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Energy + '%</div>'
        }
        
        document.getElementById("energy" + values.place).innerHTML = string

        if (values.place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Instrumentalness + '%;"aria-valuenow=" ' + values.data.Instrumentalness + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Instrumentalness + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Instrumentalness + '%;" aria-valuenow=" ' + values.data.Instrumentalness + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Instrumentalness + '%</div>'
        }
        
        document.getElementById("instrumentalness" + values.place).innerHTML = string

        if (values.place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Liveness + '%;"aria-valuenow=" ' + values.data.Liveness + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Liveness + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Liveness + '%;" aria-valuenow=" ' + values.data.Liveness + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Liveness + '%</div>'
        }
        
        document.getElementById("liveness" + values.place).innerHTML = string

        if (values.place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Speechiness + '%;"aria-valuenow=" ' + values.data.Speechiness + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Speechiness + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.data.Speechiness + '%;" aria-valuenow=" ' + values.data.Speechiness + ' " aria-valuemin="0"aria-valuemax="100">' + values.data.Speechiness + '%</div>'
        }
        
        document.getElementById("speechiness" + values.place).innerHTML = string

        if (values.place == 1) {
            string = '<h6>Volume medio in decibel: ' + values.data.Loudness + ' dB</h6>'
        } else {
            string = '<h6>' + values.data.Loudness + ' dB: ' + 'Volume medio in decibel</h6>'
        }
        
        document.getElementById("loudness" + values.place).innerHTML = string

        if (values.place == 1) {
            string = '<h6>Tempo medio: ' + values.data.Tempo + ' BPM</h6>'
        }
        else {
            string = '<h6>' + values.data.Tempo + ' BPM: ' + 'Tempo medio</h6>'
        }
        
        document.getElementById("tempo" + values.place).innerHTML = string 
    })
}

//Viene mostrata la sezione dei risultati corrispondente alla lista di playlist da cui è generata
function showAnalysis(id, place, plist_name) {
    
    var userID = document.getElementById("userID").innerHTML

    socket.emit("plist-analyzer-message", {playlistID: id, playlistName: plist_name, userID: userID, place: place})

   
}

//Viene nascosto il bottono per far apparire la seconda lista di playlist e viene mostrata la seconda lista di playlist
function choosePlaylistToCompare() {
    document.getElementById("aggiungi-scelta").style.display = "none"

    document.getElementById("scelta2").style.display = "initial"
}

/* Tooltips della Plist Analyzer page */
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

window.onbeforeunload = closingCode;

//Quando la risorsa Plist Analyzer non è più utilizzata, ovvero quando si abbandona la pagina, la connessione con la socket viene chiusa
function closingCode() {
    socket.disconnect()
    return null;
}
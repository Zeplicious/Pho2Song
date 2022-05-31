var socket

//Creo la connessione con la socket
function connectToSocket() {
    socket = io.connect('http://localhost:8080')
}

//Viene mostrata la sezione dei risultati corrispondente alla lista di playlist da cui è generata
function showAnalysis(id, place, plist_name) {
    
    var userID = document.getElementById("userID").innerHTML

    socket.emit("plist-analyzer-message", {playlistID: id, userID: userID})

    socket.on("plist-stats", (values) => {
        if (document.getElementById("sezione-risultato").style.display == "none") {
            document.getElementById("sezione-risultato").style.display = "initial"
        }

        if (document.getElementById("stats" + place).style.display == "none") {
            document.getElementById("stats" + place).style.display = "initial"
        }

        if ((document.getElementById("aggiungi-scelta").style.display == "none") && (document.getElementById("scelta2").style.display == "none")) {
            document.getElementById("aggiungi-scelta").style.display = "initial"
        }

        document.getElementById("plist" + place).innerHTML = plist_name
        
        let string = ''

        if (place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Acousticness + '%;" aria-valuenow=" ' + values.Acousticness + ' " aria-valuemin="0" aria-valuemax="100">' + values.Acousticness + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Acousticness + '%;" aria-valuenow=" ' + values.Acousticness + ' " aria-valuemin="0" aria-valuemax="100">' + values.Acousticness + '%</div>'
        }
        
        document.getElementById("acousticness" + place).innerHTML = string

        if (place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Danceability + '%;"aria-valuenow=" ' + values.Danceability + ' " aria-valuemin="0"aria-valuemax="100">' + values.Danceability + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Danceability + '%;" aria-valuenow=" ' + values.Danceability + ' " aria-valuemin="0"aria-valuemax="100">' + values.Danceability + '%</div>'
        }
        
        document.getElementById("danceability" + place).innerHTML = string

        if (place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Energy + '%;" aria-valuenow=" ' + values.Energy + ' " aria-valuemin="0"aria-valuemax="100">' + values.Energy + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Energy + '%;" aria-valuenow=" ' + values.Energy + ' " aria-valuemin="0"aria-valuemax="100">' + values.Energy + '%</div>'
        }
        
        document.getElementById("energy" + place).innerHTML = string

        if (place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Instrumentalness + '%;"aria-valuenow=" ' + values.Instrumentalness + ' " aria-valuemin="0"aria-valuemax="100">' + values.Instrumentalness + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Instrumentalness + '%;" aria-valuenow=" ' + values.Instrumentalness + ' " aria-valuemin="0"aria-valuemax="100">' + values.Instrumentalness + '%</div>'
        }
        
        document.getElementById("instrumentalness" + place).innerHTML = string

        if (place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Liveness + '%;"aria-valuenow=" ' + values.Liveness + ' " aria-valuemin="0"aria-valuemax="100">' + values.Liveness + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Liveness + '%;" aria-valuenow=" ' + values.Liveness + ' " aria-valuemin="0"aria-valuemax="100">' + values.Liveness + '%</div>'
        }
        
        document.getElementById("liveness" + place).innerHTML = string

        if (place == 1) {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Speechiness + '%;"aria-valuenow=" ' + values.Speechiness + ' " aria-valuemin="0"aria-valuemax="100">' + values.Speechiness + '%</div>'
        }
        else {
            string = '<div class="progress-bar" role="progressbar" style="width:' + values.Speechiness + '%;" aria-valuenow=" ' + values.Speechiness + ' " aria-valuemin="0"aria-valuemax="100">' + values.Speechiness + '%</div>'
        }
        
        document.getElementById("speechiness" + place).innerHTML = string

        if (place == 1) {
            string = '<h6>Volume medio in decibel: ' + values.Loudness + ' dB</h6>'
        } else {
            string = '<h6>' + values.Loudness + ' dB: ' + 'Volume medio in decibel</h6>'
        }
        
        document.getElementById("loudness" + place).innerHTML = string

        if (place == 1) {
            string = '<h6>Tempo medio: ' + values.Tempo + ' BPM</h6>'
        }
        else {
            string = '<h6>' + values.Tempo + ' BPM: ' + 'Tempo medio</h6>'
        }
        
        document.getElementById("tempo" + place).innerHTML = string 
    })
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
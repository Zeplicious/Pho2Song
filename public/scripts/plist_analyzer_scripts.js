function showAnalysis(id, place, plist_name) {
    console.log(id)
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let values = JSON.parse(this.responseText);

            document.getElementById("sezione-risultato").style.display = "initial"

            if (document.getElementById("stats" + place).style.display == "none") {
                document.getElementById("stats" + place).style.display = "initial"
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
                string = '<h5>Volume medio in decibel: ' + values.Loudness + ' dB</h5>'
            } else {
                string = '<h5>' + values.Loudness + ' dB: ' + 'Volume medio in decibel</h5>'
            }
            
            document.getElementById("loudness" + place).innerHTML = string

            if (place == 1) {
                string = '<h5>Tempo medio: ' + values.Tempo + ' BPM</h5>'
            }
            else {
                string = '<h5>' + values.Loudness + ' BPM: ' + 'Tempo medio</h5>'
            }
            
            document.getElementById("tempo" + place).innerHTML = string
        }
    };
    xhttp.open("POST", "plist-analyzer");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("playlistID=" + id);
}


function choosePlaylistToCompare() {
    document.getElementById("aggiungi-scelta").style.display = "none"
    document.getElementById("scelta2").style.display = "initial"
}

/* Tooltips della Plist Analyzer page */
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
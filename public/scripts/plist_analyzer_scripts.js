function showAnalysis(id) {
    console.log(id)
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let values = JSON.parse(this.responseText);

            if (document.getElementById("stats1").style.display == "none") {
                document.getElementById("stats1").style.display = "initial"
            }
        let string = '<div class="progress"> <div class="progress-bar" role="progressbar" style="width: ' + values.Acousticness + '%;" aria-valuenow=" ' + values.Acousticness + ' " aria-valuemin="0" aria-valuemax="100">' + values.Acousticness + '%</div> </div>'
        document.getElementById("acousticness").innerHTML = string
        
        string = '<div class="progress"> <div class="progress-bar" role="progressbar" style="width: ' + values.Danceability + '%;" aria-valuenow=" ' + values.Danceability + ' " aria-valuemin="0" aria-valuemax="100">' + values.Danceability + '%</div> </div>'
        document.getElementById("danceability").innerHTML = string
        
        string = '<div class="progress"> <div class="progress-bar" role="progressbar" style="width: ' + values.Energy + '%;" aria-valuenow=" ' + values.Energy + ' " aria-valuemin="0" aria-valuemax="100">' + values.Energy + '%</div> </div>'
        document.getElementById("energy").innerHTML = string

        string = '<div class="progress"> <div class="progress-bar" role="progressbar" style="width: ' + values.Instrumentalness + '%;" aria-valuenow=" ' + values.Instrumentalness + ' " aria-valuemin="0" aria-valuemax="100">' + values.Instrumentalness + '%</div> </div>'
        document.getElementById("instrumentalness").innerHTML = string

        string = '<div class="progress"> <div class="progress-bar" role="progressbar" style="width: ' + values.Liveness + '%;" aria-valuenow=" ' + values.Liveness + ' " aria-valuemin="0" aria-valuemax="100">' + values.Liveness + '%</div> </div>'
        document.getElementById("liveness").innerHTML = string

        string = '<div class="progress"> <div class="progress-bar" role="progressbar" style="width: ' + values.Speechiness + '%;" aria-valuenow=" ' + values.Speechiness + ' " aria-valuemin="0" aria-valuemax="100">' + values.Speechiness + '%</div> </div>'
        document.getElementById("speechiness").innerHTML = string

        string = '<h5>Volume medio in decibel: ' + values.Loudness + ' dB</h5>'
        document.getElementById("loudness").innerHTML = string

        string = '<h5>Tempo medio: ' + values.Tempo + ' BPM</h5>'
        document.getElementById("tempo").innerHTML = string
        }
    };
    xhttp.open("POST", "plist-analyzer");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("playlistID=" + id);
}
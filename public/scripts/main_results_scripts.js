function getSong(id){
    /* document.getElementById("spin").style.display="none" */
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
            if(this.responseText!='fin'){
                let embed = 'https://open.spotify.com/embed/track/' + this.responseText + '?utm_source=generator'
                let string='<div class="col-11 px-0"><iframe style="border-radius:12px" src="'+embed+ '" width="280" height="80" frameBorder="0" allowfullscreen="1" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>'//<div class="ratio" style="--bs-aspect-ratio: 20%;"></div>';
                document.getElementById("li"+id).style.display="initial"
                document.getElementById(id).innerHTML+=string;
                document.getElementById("check"+id).value = 'spotify:track:'+this.responseText;
                getSong(++id);
            }
            else{
                document.getElementById("submit").style.display="initial"
            }
        }
    };
    xmlhttp.open("GET", "getSong", true);
    xmlhttp.send();
}
function checkAll(){
    if(document.getElementById('masterCheck').checked){
        var checkboxes = document.getElementsByName('songs')
        for (let index = 0; index < checkboxes.length; index++){
            checkboxes[index].checked=true
        }
    }
}
function checkValid(){
    var checkboxes = document.getElementsByName('songs')
        for (let index = 0; index < checkboxes.length; index++){
            if(checkboxes[index].checked){
                (document.getElementsByName('submitmodal'))[0].id = "exampleModal";
            }
        }
}
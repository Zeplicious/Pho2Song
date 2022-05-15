function getSong(id){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
        document.getElementById("spin"+id).style.display="none"
            if(this.responseText!='end'){
                let response=JSON.parse(this.responseText)
                let embed = 'https://open.spotify.com/embed?uri=' +encodeURIComponent('spotify:track:'+response.id)
                let string='<div class="col-11 px-0"><iframe style="border-radius:12px" src="'+embed+ '" allowtransparency="true" width="280" height="80" frameBorder="0" allow="encrypted-media;"></iframe></div>'//<div class="ratio" style="--bs-aspect-ratio: 20%;"></div>';
                document.getElementById("text"+id).innerText=response.name;
                document.getElementById(id).innerHTML+=string;
                document.getElementById("li"+id).style.display="initial"
                document.getElementById("check"+id).value = 'spotify:track:'+response.id;
                getSong(++id);
            }
            else{
                document.getElementById("carouselExampleControls").style.display="initial"
                document.getElementById("submit").style.display="initial"
            }
        }
    };
    document.getElementById("spin"+id).style.display="initial"
    xmlhttp.open("GET", "getSong", true);
    xmlhttp.send();
}

function checkAll(){
    
    var checkboxes = document.getElementsByName('songs')
    for (let index = 0; index < checkboxes.length; index++){
        checkboxes[index].checked=true
    }
    document.getElementById('submitmodal').disabled=false;
}
function checkValid(id){
    if(document.getElementById(id).checked){
        document.getElementById('submitmodal').disabled=false;
    }
    else{
        var checkboxes = document.getElementsByName('songs')
        for (let index = 0; index < checkboxes.length; index++){
            if(checkboxes[index].checked){
                return;
            }
        }
        document.getElementById('submitmodal').disabled=true;
    }
}
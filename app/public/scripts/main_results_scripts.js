
function connect(){
    var socket = io.connect('http://localhost:8080');
    socket.emit('message', document.getElementById('id').innerHTML )
    let index=0
    socket.on('message', function(message) {
        if(message!='end'){
            let response=message
            console.log(response)
            let embed = 'https://open.spotify.com/embed?uri=' +encodeURIComponent(response.uri)
            let string='<div class="col-11 px-0"><iframe style="border-radius:12px" src="'+embed+ '" allowtransparency="true" width="280" height="80" frameBorder="0" allow="encrypted-media;"></iframe></div>'//<div class="ratio" style="--bs-aspect-ratio: 20%;"></div>';
            document.getElementById("text"+index).innerText=response.name;
            document.getElementById( index).innerHTML+=string;
            document.getElementById("li"+ index).style.display="initial"
            document.getElementById("check"+ index).value = response.uri;
            index++;
        }
        else{
            document.getElementById("carouselExampleControls").style.display="initial"
            document.getElementById("submit").style.display="initial"
            socket.disconnect() 
        }
    });
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
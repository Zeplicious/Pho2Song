const upload = document.getElementById("upload");
const previewFileContainer = document.getElementById("filePreview")
const previewUrlContainer = document.getElementById("urlPreview")
const inputContainer = document.getElementById("inputContainer")
const inputForm = document.getElementById("stupido")
const urlForm = document.getElementById("urlForm")

var urlIndex = 1;
var arrayUrl = [];


upload.addEventListener("change", function () {
    var arrayFile = [];
    var n = 0
    var m = 0
    console.log(this.files)
    if(!arrayFile[0]){
        previewFileContainer.innerHTML += "<div class = divider> </div>"
    }
    for (i of this.files) {
        arrayFile[m] = i;
        m += 1
    };
    /* console.log(arrayFile) */

    if (arrayFile[0]) {
        arrayFile.forEach(i => {
            const reader = new FileReader();
            reader.addEventListener("load", function () {
               /*  console.log(i.result)
                console.log(i) */
                previewFileContainer.innerHTML += "<li class='list-group-item' id='groupItem" + n + "'> <div class='row mx-auto my-2'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-auto'> <p class='my-auto' value= " + n + ">" + i.name + "<p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-auto'> <button class='btn-danger btn' >Elimina</button> </div> </div> </li>" /* onclick='FileDelete("+n+")' */
                n += 1
            })
            reader.readAsText(i)
            
        })

    }
    document.getElementById("count").value=m;
})


function addImage() {
    var imgText = urlForm.querySelector("#url");
    display(imgText.value)
};

function display(res) {
    let resName = res.substring(res.lastIndexOf("/") + 1, res.length);
    arrayUrl.forEach(urlName => {
        if(resName == urlName){
            urlForm.innerHTML += "<div class='alert alert-danger alert-dismissible' role='alert'> Questo Url è già stato inserito. </div>"
            
        }
    })
    if(resName != ""){
        previewUrlContainer.innerHTML += "<p id='result'> " + resName + "</p>"
        urlIndex++;
    }
    else{
        urlForm.innerHTML += "<div class='alert alert-danger alert-dismissible' role='alert'> Errore: file non supportato! </div>"
    }    
    arrayUrl.push(resName)
}

function FileDelete(index){
    //evnt.preventDefault();
    //fileItem = document.getElementById("groupItem" + index).style.display='none';
    //arrayFile.splice(index);
}
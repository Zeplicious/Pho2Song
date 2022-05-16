const upload = document.getElementById("upload");
const previewFileContainer = document.getElementById("filePreview")
const previewUrlContainer = document.getElementById("urlPreview")
const urlForm = document.getElementById("urlForm")

var fileIndex = 1;
var urlIndex = 1;
var arrayUrl = [];
var arrayFile = [];
var tempArrayFile = [];
var urlIsEmpty = false;
var urlIsNew = true;
var fileIsNew = true;
var m = 0

upload.addEventListener("change", function () {

    console.log(this.files)

    if (this.files.length > 0) {
        document.getElementById("submit-files").disabled = false
    }
    else {
        document.getElementById("submit-files").disabled = true
    }

    for (indice = 0; indice < this.files.length; indice++){
        tempArrayFile[indice] = this.files[indice];

    }

    tempArrayFile.forEach(i => {
        const reader = new FileReader();
            reader.addEventListener("load", function () {
                previewFileContainer.innerHTML += "<li class='list-group-item' id='fileItem" + fileIndex + "'> <div class='row mx-auto my-2 align-items-center'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-auto p-file' value= " + fileIndex + ">" + i.name + "</p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2'> <button class='btn-danger btn' onclick='FileDelete(" + fileIndex + ")'>Elimina</button> </div> </li>"
                fileIndex += 1
            })
        reader.readAsText(i)
    })

});

function addImage() {
    let imgText = urlForm.querySelector("#urlText");
    display(imgText.value)
};

function display(res) {
    let resName = res.substring(res.lastIndexOf("/") + 1, res.length);

    arrayUrl.forEach(url => {
        if (res == url) {
            urlForm.innerHTML += "<div class='alert alert-danger alert-dismissible' role='alert'> Questo Url è già stato inserito. <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"
            urlIsNew = false;
            return false;
        }
        /*urlForm.querySelector("#url").value += " "
        urlForm.querySelector("#url").value += url*/
    })

    if (resName != "" && urlIsNew) {
        if (urlIndex == 1) {
            previewUrlContainer.innerHTML += "<li class='list-group-item' id='urlItem" + urlIndex + "'> <input type='text'  name='urls' id='urlFile" + urlIndex + "' value=" + res + " style='display: none'> <div class='row mx-auto my-2'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-2' value= " + urlIndex + ">" + resName + "</p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2'> <button class='btn btn-danger' onclick='UrlDelete(" + urlIndex + ")'>Elimina</button> </div> </li>"
            urlIndex++;
            arrayUrl.push(res)
        }
        else {
            for (index = 1; index < urlIndex; index++) {
                if(document.getElementById("urlFile" + index) == null || document.getElementById("urlFile" + index).value == null) {
                    document.getElementById("urlFile" + index).innerHTML += "<li class='list-group-item' id='urlItem" + index + "'> <input type='text' name='urls' id='urlFile" + index + "' value=" + res + " style='display: none'> <div class='row mx-auto my-2'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-2' value= " + index + ">" + resName + "</p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2'> <button class='btn btn-danger' onclick='UrlDelete(" + index + ")'>Elimina</button> </div> </li>"
                    arrayUrl.push(res)
                    urlIsEmpty = true;
                    break;
                }
                else {
                    urlIsEmpty = false;
                }
            }
    
            if(!urlIsEmpty) {
                previewUrlContainer.innerHTML += "<li class='list-group-item' id='urlItem" + urlIndex + "'> <input type='text'  name='urls' id='urlFile" + urlIndex + "' value=" + res + " style='display: none'> <div class='row mx-auto my-2'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-2' value= " + urlIndex + ">" + resName + "</p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2'> <button class='btn btn-danger' onclick='UrlDelete(" + urlIndex + ")'>Elimina</button> </div> </li>"
                urlIndex++;
                arrayUrl.push(res)
            }
        }
    }
    else if (resName == "") {
        urlForm.innerHTML += "<div class='alert alert-danger alert-dismissible' role='alert'> Errore: file non supportato!<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button> </div>"
    }
    urlIsNew = true;
}

function FileDelete(index) {
    document.getElementById("fileItem" + index).value = null;
    document.getElementById("fileItem" + index).style.display = "none"; 
    console.log(document.getElementById("fileItem" + index).value)
}

function UrlDelete(index){
    document.getElementById("urlFile" + index).value = null;
    document.getElementById("urlItem" + index).style.display = "none";
    console.log(document.getElementById("urlFile" + index).value);
}
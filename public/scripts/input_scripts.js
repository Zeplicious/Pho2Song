//const e = require("method-override");

const upload = document.getElementById("upload");
const previewFileContainer = document.getElementById("filePreview")
const previewUrlContainer = document.getElementById("urlPreview")
const inputContainer = document.getElementById("inputContainer")
const inputForm = document.getElementById("stupido")
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
    var n = 0
    console.log(this.files)
    console.log(this.files[0])
    console.log(URL.createObjectURL(this.files[0]))
    console.log(this.files.fileUpload)
    for (indice = 0; indice < this.files.length; indice++) /*i of this.files)*/ {
        tempArrayFile[indice] = this.files[indice];

    };
    console.log(tempArrayFile)
    /*arrayFile.forEach(file => {
        this.files.push(file);
    })*/
    tempArrayFile.forEach(i => {
        arrayFile.forEach(j => {
            if (j == i) {
                isNew = false;
            }
        })
        if (fileIsNew == true) {
            arrayFile.push(i)
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                /*  console.log(i.result)*/
                console.log(i)
                previewFileContainer.innerHTML += "<li class='list-group-item' id='fileItem" + fileIndex + "'> <div class='row mx-auto my-2 align-items-center'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-auto p-file' value= " + fileIndex + ">" + i.name + "</p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2'> <button class='btn-danger btn' onclick='FileDelete(" + fileIndex + ")'>Elimina</button> </div> </li>"
                fileIndex += 1
            })
            reader.readAsText(i)
        }
    })
    fileIsNew = true;
    document.getElementById("fileCount").value = fileIndex;
})

function addImage() {
    var imgText = urlForm.querySelector("#urlText");
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
        for (index = 1; index <= urlIndex; index++) {
            if(document.getElementById("urlFile" + index) == null || document.getElementById("urlFile" + index).value == null){
                previewUrlContainer.innerHTML += "<li class='list-group-item' id='urlItem" + urlIndex + "'> <input type='text' id='urlFile" + urlIndex + "' value=" + res + " style='display: none'> <div class='row mx-auto my-2'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-2' value= " + index + ">" + resName + "</p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2'> <button class='btn-danger btn' onclick='UrlDelete(" + index + ")'>Elimina</button> </div> </li>"
                arrayUrl.push(res)
                urlIsEmpty = true;
                break;
            }
            else{
                urlIsEmpty = false;
            }
        }
        if(!urlIsEmpty){
            previewUrlContainer.innerHTML += "<li class='list-group-item' id='urlItem" + urlIndex + "'> <input type='text' id='urlFile" + urlIndex + "' value=" + res + " style='display: none'> <div class='row mx-auto my-2'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-2' value= " + urlIndex + ">" + resName + "</p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2'> <button class='btn-danger btn' onclick='UrlDelete(" + urlIndex + ")'>Elimina</button> </div> </li>"
            urlIndex++;
            arrayUrl.push(res)
        }
    }
    else if (resName == "") {
        urlForm.innerHTML += "<div class='alert alert-danger alert-dismissible' role='alert'> Errore: file non supportato!<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button> </div>"
    }
    urlIsNew = true;
    document.getElementById("urlCount").value = urlIndex;
}

function FileDelete(index) {
    console.log("ueue")
    console.log(arrayFile[index])
    fileItem = document.getElementById("fileItem" + index);
    fileItem.value = null;
    arrayFile.splice(index - 1);
    fileIndex--;
}

function UrlDelete(index) {
    //arrayUrl.splice(index-1);

    document.getElementById("urlFile" + index).value = null;
    document.getElementById("urlItem" + index).style.display = "none";
    console.log(document.getElementById("urlFile" + index).value);
}
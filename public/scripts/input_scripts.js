/* const upload = document.getElementById("upload");
const previewFileContainer = document.getElementById("filePreview") */

const urlPreview = document.getElementById("urlPreview")
const urlForm = document.getElementById("urlForm")
const urlInputArea = document.getElementById("urlInputArea")

var arrayUrl = [];
var arrayFile = [];
var tempArrayFile = [];
var urlIsEmpty = false;
//defining HTML alert
const alertAlreadyInHTML = "<div class='alert alert-danger alert-dismissible' role='alert'> Questo Url è già stato inserito. <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"
const alertInvalidHTML = "<div class='alert alert-danger alert-dismissible' role='alert'> Questo Url non è valido. <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"

//initializing global variables for urls
var urlListItemId = 0;

var fileIndex = 1;
var fileIsNew = true;
var m = 0


/* upload.addEventListener("change", function () {

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

function FileDelete(index) {
    document.getElementById("fileItem" + index).value = null;
    document.getElementById("fileItem" + index).style.display = "none"; 
    console.log(document.getElementById("fileItem" + index).value)
}
 */
function setUp(){
    arrayUrl = [];
    urlListItemId = 0;
    urlInputArea.innerHTML+= "<input type='text'  class='form-control' name='urls' id='urlSent" + urlListItemId+ "'placeholder='https://...' >"
}

function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
}
function isNew(url){
    for (let index = 0; index < arrayUrl.length; index++) {
        if (url == arrayUrl[index])return false
    }
    return true
}
function reloadInputText(target){
    target.style.display='none'
    console.log(urlListItemId)
    urlInputArea.innerHTML += "<div></div><input type='text'  class='form-control' name='urls' id='urlSent" + (urlListItemId+1) + "' 'placeholder='https://...''></div>"
}
function invalidateInputText(target){
    target.value=''
}

function addImage() {
    let urlInput = document.getElementById("urlSent"  + urlListItemId)
    display(urlInput)
};


function display(urlInput) {
    let url = urlInput.value
    let imgName = url.substring(url.lastIndexOf("/") + 1, url.length);
    reloadInputText(urlInput)
    if(!isValidHttpUrl(urlInput.value)){
        //document.getElementById('accordionSection').innerHTML += alertInvalidHTML;
        invalidateInputText(urlInput)
        urlListItemId++
        return
    }
    else if(!isNew(urlInput.value)){ 
        //document.getElementById('accordionSection').innerHTML += alertAlreadyInHTML;
        invalidateInputText(urlInput)
        urlListItemId++
        return
    }
    
    //check if url already in input

    
    arrayUrl.push(url) // inserisco nell'array di url in input

    //defining HTML partials
    let paragraphImgNameHTML = "<div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-2'>" + imgName + "</p> </div>"
    let removeButtonHTML ='<div class="col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2"> <button class="btn btn-danger"type="button" onclick="UrlDelete(\''+url+'\','+ urlListItemId+ ')">Elimina</button> </div>'
    let rowHTML= "<div class='row mx-auto my-2'>"+paragraphImgNameHTML+removeButtonHTML+"</div>"

    let urlListItemHTML ="<li class='list-group-item' id='urlItem" + urlListItemId + "'>" + rowHTML +"</li>"

    //appending the new list item
    urlPreview.innerHTML += urlListItemHTML

    urlListItemId++

}


function UrlDelete(url,id){

    document.getElementById("urlSent" + id).value=''
    document.getElementById("urlItem" + id).style.display = "none";

    arrayUrl=arrayUrl.filter(arrayUrlElem => arrayUrlElem!=url )

}
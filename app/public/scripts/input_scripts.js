const uploadFiles = document.getElementById("upload-files");
const filesList = document.getElementById("files-list")
const fileInputArea = document.getElementById("file-input-area")

const urlPreview = document.getElementById("urlPreview")
const urlForm = document.getElementById("urlForm")
const urlInputArea = document.getElementById("urlInputArea")
const urlSubmitButton= document.getElementById("submit-urls")




//Initializing global variables for urls
var urlListItemId = 0;
var arrayUrl = [];

//defining HTML alert
const alertAlreadyInHTML = "<div class='alert alert-danger alert-dismissible' role='alert'> Questo Url è già stato inserito. <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"
const alertInvalidHTML = "<div class='alert alert-danger alert-dismissible' role='alert'> Questo Url non è valido. <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"

//Initializing global variables for files
var fileListItemId = 0;
var arrayFiles = [];
var deleteButtonForFile = '<div class="col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2"><button class="btn-danger btn" type="button" onclick="FileDelete(" + fileIndex + ")">Elimina</button></div>'


/************* Files management section *************/

//Utiliy functions for files

function annihilateWholeLineage() {
    let dim = filesList.childNodes.length
    for (let i = 0; i < dim; i++) {
        filesList.removeChild(filesList.childNodes[0])
        
    }
}

function manageSubmitButton(dim) {
    if (dim > 0) {
        document.getElementById("submit-files").disabled = false
    } else {
        document.getElementById("submit-files").disabled = true
    }
}

//Main functionality

function showFilesPreview(inputFiles) {
    
    manageSubmitButton(inputFiles.length)

    for (let i = 0; i < inputFiles.length; i++) {
        filesList.innerHTML += '<li class="list-group-item" id="file-item"' + fileListItemId + '"> <div class="row mx-auto my-2 align-items-center"> <div class="col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2"> <p class="my-auto p-file">' + inputFiles[i].name + '</p></div></li>'
        fileListItemId++
    }
}

/************* URLs management section *************/

//Toasts initialization

var toastTrigger = document.getElementById('aggiungi-url')
var toastLive = document.getElementById('liveToast')
if (toastTrigger) {
    var toast = new bootstrap.Toast(toastLive)
}

//Setup the used variables
function setUp(){
    arrayUrl = Array();
    urlListItemId = 0;
    urlInputArea.innerHTML+= "<input type='text'  class='form-control' name='urls' id='urlSent" + urlListItemId+ "'placeholder='https://...' >"
}

//URL validation
function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
}

//URL checking if it is already in arrayUrl
function isNew(url){
    for (let index = 0; index < arrayUrl.length; index++) {
        if (url == arrayUrl[index])return false
    }
    return true
}

//URL manipulating input texts
function reloadInputText(target){
    target.style.display='none'//disabilito l'input relativo al i-esimo click su 'Agggiungi'
    //creo l'input relativo al i+1-esimo click su 'Agggiungi'
    urlInputArea.innerHTML += "<input type='text'  class='form-control' name='urls' id='urlSent" + (urlListItemId+1) + "' 'placeholder='https://...''>" 
}

function invalidateInputText(target){
    target.parentElement.removeChild(target);
    urlInputArea.innerHTML += "<input type='text'  class='form-control' name='urls' id='urlSent" + (urlListItemId+1) + "' 'placeholder='https://...''>" 
}

//chiamata onclick del tasto 'Submit'
function prepareSubmit() { //cancello l'ultimo campo text che sarà vuoto al momento del submit
    let urlInput = document.getElementById("urlSent"  + urlListItemId)
    urlInputArea.removeChild(urlInput);

    let i=0;
    urlInputArea.childNodes.forEach(urlInput=>{
        if(urlInput.id !== undefined){
            urlInput.value=arrayUrl[i]
            i++
        }
    })
}

function addImage() {
    console.log(arrayUrl)

    let urlInput = document.getElementById("urlSent"  + urlListItemId)
    if(!isValidHttpUrl(urlInput.value)){
        toast.show()
        invalidateInputText(urlInput)
    }
    else if(!isNew(urlInput.value)){ 
        toast.show()
        invalidateInputText(urlInput)
    }
    else{
        reloadInputText(urlInput)
        display(urlInput)
    }
    urlListItemId++
}


function display(urlInput) {
    let url=urlInput.value
    if(urlSubmitButton.disabled)urlSubmitButton.disabled=false;// riabilito il tasto di submit se precentemente disabilitato

    let imgName = url.substring(url.lastIndexOf("/") + 1, url.length);//estraggo il nome del file
    arrayUrl.push(url) // inserisco nell'array di url in input
    
    //defining HTML partials
    let paragraphImgNameHTML = "<div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-2'>" + imgName + "</p> </div>"
    let removeButtonHTML ='<div class="col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2"> <button class="btn btn-danger"type="button" onclick="UrlDelete(\''+url+'\','+ urlListItemId+ ')">Elimina</button> </div>'
    let rowHTML= "<div class='row mx-auto my-2'>"+paragraphImgNameHTML+removeButtonHTML+"</div>"

    let urlListItemHTML ="<li class='list-group-item' id='urlItem" + urlListItemId + "'>" + rowHTML +"</li>"

    //appending the new list item
    urlPreview.innerHTML += urlListItemHTML
    urlInput.value=url;
}

function UrlDelete(url,id){
    let urlInput=document.getElementById("urlSent" + id)
    urlInput.parentElement.removeChild(urlInput);//disabilito il relativo campo input
    document.getElementById("urlItem" + id).style.display = "none";//nascondo il list item che visualizzava il nome

    arrayUrl=arrayUrl.filter(arrayUrlElem => arrayUrlElem!=url )//rimuovo dalla lista dei link attivi
    if(arrayUrl.length==0)urlSubmitButton.disabled=true;//se la lista è vuota disabilito il tasto submit
}
const uploadFiles = document.getElementById("upload-files");
const filesList = document.getElementById("files-list")
const fileInputArea = document.getElementById("file-input-area")

const urlPreview = document.getElementById("urlPreview")
const urlForm = document.getElementById("urlForm")
const urlInputArea = document.getElementById("urlInputArea")
const urlSubmitButton= document.getElementById("submit-urls")

var arrayUrl = [];
var arrayFiles = [];

//defining HTML alert
const alertAlreadyInHTML = "<div class='alert alert-danger alert-dismissible' role='alert'> Questo Url è già stato inserito. <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"
const alertInvalidHTML = "<div class='alert alert-danger alert-dismissible' role='alert'> Questo Url non è valido. <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>"

//initializing global variables for urls
var urlListItemId = 0;

//initializing global variables for urls
var fileListItemId = 0;

var fileIndex = 1;
var fileIsNew = true;


/************* Files management section *************/

//Utiliy functions for files

function annihilateWholeLineage() {
    let dim = filesList.childNodes.length
    for (let i = 0; i < dim; i++) {
        filesList.removeChild(filesList.childNodes[0])
        
    }
}

function showFilesPreview(inputFiles) {
    
    manageSubmitButton(inputFiles.length)

    for (let i = 0; i < inputFiles.length; i++) {
        filesList.innerHTML += '<li class="list-group-item" id="file-item"' + fileListItemId + '"> <div class="row mx-auto my-2 align-items-center"> <div class="col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2"> <p class="my-auto p-file">' + inputFiles[i].name + '</p></div></li>'
        fileListItemId++
    }
}

function manageSubmitButton(dim) {
    if (dim > 0) {
        document.getElementById("submit-files").disabled = false
    } else {
        document.getElementById("submit-files").disabled = true
    }
}

/* function setUpForFiles(){
    arrayFiles = Array();
    fileInputId = 0;
    fileInputArea.innerHTML += '<input id="file-input' + fileinputId + '" class="form-control" type="file" name="images" accept="image/*" multiple onchange="addFiles()">'
}

function isNewForFiles(arrayOfInputFiles){                  //This function return true if all files in input are new, false otherwise
    for (let i = 0; i < arrayOfInputFiles.length; i++) {
        for (let j = 0; j < arrayFiles.length; j++) {
            if (arrayOfInputFiles[i] == arrayFiles[j]) {
                return false
            }
            
        }
    }
    return true
}

function invalidateInputFiles(target){
    target.parentElement.removeChild(target);
    fileInputArea.innerHTML += '<input id="file-input' + (fileInputId + 1) + '" class="form-control" type="file" name="images" accept="image/*" multiple onchange="addFiles()">'
}

function reloadInputText(target){
    target.style.display='none'//disabilito l'input relativo al i-esimo click su 'Agggiungi'
    //creo l'input relativo al i+1-esimo click su 'Agggiungi'
    urlInputArea.innerHTML += "<input type='text'  class='form-control' name='urls' id='urlSent" + (urlListItemId+1) + "' 'placeholder='https://...''>" 
}

function addFiles() {
    let fileInput = document.getElementById("file-input" + fileInputId)
    if(!isNew(fileInput.files)){ 
        //document.getElementById('accordionSection').innerHTML += alertAlreadyInHTML;
        invalidateInputFiles(fileInput)
    }
    else{
        reloadInputText(fileInput)
        display(fileInput.files)
    }

    urlListItemId++
} */

/* uploadFiles.addEventListener("change", function () {

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
                fileList.innerHTML += "<li class='list-group-item' id='fileItem" + fileIndex + "'> <div class='row mx-auto my-2 align-items-center'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-2'> <p class='my-auto p-file' value= " + fileIndex + ">" + i.name + "</p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-2'> <button class='btn-danger btn' onclick='FileDelete(" + fileIndex + ")'>Elimina</button> </div> </li>"
                fileIndex += 1
            })
        reader.readAsText(i)
    })

}); */

/************* URLs management section *************/

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
        //document.getElementById('accordionSection').innerHTML += alertInvalidHTML;
        invalidateInputText(urlInput)
    }
    else if(!isNew(urlInput.value)){ 
        //document.getElementById('accordionSection').innerHTML += alertAlreadyInHTML;
        invalidateInputText(urlInput)
    }
    else{
        reloadInputText(urlInput)
        display(urlInput)
    }
    urlListItemId++
};


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
const upload = document.getElementById("upload");
const previewContainer = document.getElementById("imagePreview")
const urlContainer = document.getElementById("urlContainer")
const inputContainer = document.getElementById("inputContainer")
const inputForm = document.getElementById("stupido")

var urlIndex = 1;
var arrayFile = [];

upload.addEventListener("change", function () {
    var n = 0
    var m = 0
    console.log(this.files)
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
                previewContainer.innerHTML += "<div class='row mx-auto my-auto'> <div class='col-lg-8 col-xl-8 col-xxl-8 mx-auto my-auto'> <p>" + i.name + "<p> </div> <div class='col-lg-4 col-xl-4 col-xxl-4 mx-auto my-auto'> <button class='btn-danger btn' onsubmit='FileDelete()'>Elimina</button> </div>"
            })
            reader.readAsText(i)
            n += 1
        })

    }
    document.getElementById("count").value=m;
})

function onSubmit() {
    console.log("pisellI")
    console.log(document.getElementById("upload").value)
};
/* 
function addImage() {
    var imgText = urlContainer.querySelector("#url");
    display(imgText.value)
};

function display(res) {
    let resName = res.substring(res.lastIndexOf("/") + 1, res.length);
    if(resName != ""){
        previewContainer.innerHTML += "<p id='result'> " + resName + "</p>"
        urlIndex++;
    }
    else{
        inputContainer.innerHTML += "<div class='alert alert-danger' role='alert'> Errore: file non supportato! </div>"
    }    
}
 */
/* inputForm.addEventListener('submit', function (evnt) {
    evnt.preventDefault();
    arrayFile.forEach(function (file) {
        sendFile(file);
    });
});

sendFile = function (file) {
  var formData = new FormData();
  var request = new XMLHttpRequest();

  formData.set('file', file);
  console.log(formData.keys)
  request.open("POST", '/result');
  request.send(file);
}; */
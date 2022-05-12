const upload = document.getElementById("upload");
const previewContainer = document.getElementById("imagePreview")
const previewDefaultText = previewContainer.querySelector(".image-preview__default-text")

upload.addEventListener("change", function(){
    var arrayFile = []
    var n = 0
    var m = 0
    console.log(this.files)
    for(i of this.files){
        arrayFile[m] = i;
        m+=1
    }; 
    console.log(arrayFile)

    if(arrayFile[0]) {
        arrayFile.forEach(i => {
            const reader = new FileReader();
            reader.addEventListener("load", function() {
                console.log(i.result)
                console.log(i)
                previewDefaultText.innerText += i.name
            })
            reader.readAsText(i)
            n+=1
        })
        
    }
})

/*$(document).ready(function(){
    $("#upload").change(function (e) {
        var file = e.target.file[0]
        readImage(file);
    })

    $("#url-form").submit(function(e){
        e.preventDefault();

        if($("#url").val() != ""){
            var url = $("#url").val()
            convertImage(url);
        }
    })
})

function readImage(file){
    if(file.type && file.type.indexOf('image') == -1) {
        alert("file is not an image")
        return
    }
    console.log("tutto a posto")
    const reader = new FileReader();
    reader.addEventListener('load' , (event) => {
        imageUrl = event.target.result;
        console.log(imageUrl);
    })
    reader.readAsDataURL(file);
}

function convertImage(url){
    
    //if(broswerImageConverter.downloadImageWithType(url, imageType)){}
}*/
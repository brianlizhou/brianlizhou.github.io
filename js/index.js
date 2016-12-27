(function() {
const maxWidthOfImage = 200;
const maxHeightOfImage = 200;
window.onload = function(){

    var currentPostState = {};
    var clearSelection = function(){
        currentPostState = {
            numFiles:0,
            attachedImages:[],
            imageID:0,
            currentPostID:0
        };

        var node = document.getElementById('placeToShowFiles')
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }      
        document.getElementById("postText").value = "";
    }

    var calculateAspectRatioFit = function(srcWidth, srcHeight, maxWidth, maxHeight) {
        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        return { width: srcWidth*ratio, height: srcHeight*ratio };
    }

    
    var turnOnDragDrop = function(){   
        clearSelection();
        var FileDragHover = function(e){
            // cancel event and hover styling
            e.stopPropagation();
            e.preventDefault();
            //Converts the event to hover instead of dragover
            e.target.className = (e.type == "dragover" ? "hover" : "");
        }
        var FileSelectHandler = function(e) {
            var setNumFilesAndSizeText = function (){
                var numFilesText = document.getElementById('numFiles');
                var newFileCount = currentPostState.numFiles;
                numFilesText.innerHTML = newFileCount == 1 ?  newFileCount + " File Attached" : newFileCount+ " Files Attached";
            }
            var addNewImage = function(ev2){
                currentPostState.attachedImages.push(newImage);
                var appendParent = document.getElementById('placeToShowFiles');
                var newImage = document.createElement('img');
                newImage.id = currentPostState.imageID;
                appendParent.appendChild(newImage);

                var newImageIdJQuery = '#' + newImage.id;
                $(newImageIdJQuery).attr('src', ev2.target.result);
                var newDimensions = calculateAspectRatioFit(newImage.clientWidth,newImage.clientHeight,maxWidthOfImage,maxHeightOfImage);
                $(newImageIdJQuery).attr('width', newDimensions.width); $(newImageIdJQuery).attr('height',newDimensions.height);     
                currentPostState.imageID++;
            }
            var parser = function(file,e) {
                var fr = new FileReader();
                fr.onload = function(ev2) {
                    console.dir(ev2);
                    currentPostState.attachedImages.push(ev2.target.result);
                    addNewImage(ev2);                  
                };   
                fr.readAsDataURL(file);
            }
            FileDragHover(e)
            // fetch FileList object
            var files = e.target.files || e.dataTransfer.files;
            // process all File objects
            for (var i = 0, f; f = files[i]; i++) {
                parser(f,e);
                currentPostState.numFiles++;
            }
            setNumFilesAndSizeText(currentPostState.numFiles);
        }   
        if (window.File && window.FileList && window.FileReader) {
            var fileselect = document.getElementById('fileselect'),
            filedrag = document.getElementById('filedrag');
            // file select on change
            fileselect.addEventListener("change", FileSelectHandler, false);
            
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                // file drop
                filedrag.addEventListener("dragover", FileDragHover,false);
                filedrag.addEventListener("dragleave", FileDragHover,false);
                filedrag.addEventListener("drop", FileSelectHandler,false);    
            }   
        }     
    };
    turnOnDragDrop();

    var makeNewPost = function(){
        var addLineBreak = function(parentElement){
            parentElement.appendChild(document.createElement("br"));
        }
        var createImageEntry = function(imageSRC){
            var container = document.createElement('div'); container.className="design-half";
            var image = document.createElement('img'); image.src = imageSRC; image.className = "design-margin-bottom";
            image.style.width="100%";
            container.appendChild(image);
            return container;
        }

        var elementToAppendTo = 
        var parentElement = document.createElement('div');
        parentElement.id = "post" + currentPostState.currentPostID;
        parentElement.className = "design-container design-card-2 design-white design-round design-margin";
        addLineBreak(parentElement);

        var profileImage = document.createElement('img');profileImage.src = "http://www.w3schools.com/w3images/avatar2.png"; 
        profileImage.className = "design-left design-circle design-margin-right"; profileImage.style.width = "60px";
        parentElement.appendChild(profileImage);

        var userName = document.createElement("h4"); userName.innerHTML = "Visitor";
        parentElement.appendChild(userName); addLineBreak(parentElement);

        var horizontalLine = document.createElement("hr"); horizontalLine.className = "design-clear";
        parentElement.appendChild(horizontalLine);

        var text = document.createElement('p'); text.innerHTML = document.getElementById("postText").value;
        parentElement.appendChild(text);

        var innerParentElement = document.createElement('div'); innerParentElement.className="design-row-padding";
        innerParentElement.style.margin="0 -16px";

       




        
    }

    $('#clear').click(function(){
        clearSelection();
    });

    $('#post').click(function() {
        makeNewPost();
        clearSelection();
    });
        
}})();
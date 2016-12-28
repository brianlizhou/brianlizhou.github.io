(function() {
const maxWidthOfImage = 200;
const maxHeightOfImage = 200;
window.onload = function(){

    var currentPostState = {};
    var currentPostID = 0;

    var setNumFilesAndSizeText = function (){
        var numFilesText = document.getElementById('numFiles');
        var newFileCount = currentPostState.attachedImages.length;
        numFilesText.innerHTML = newFileCount == 1 ?  newFileCount + " File Attached" : newFileCount+ " Files Attached";
    }

    var clearSelection = function(){
        currentPostState = {
            attachedImages:[],
            imageID:0,
        };
        setNumFilesAndSizeText();
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
        (function(){
            var image = document.createElement('img'); 
            image.src = "images/Welcome.jpg";
            image.style.width = "250px"; image.style.height = "100.4475px";
            document.getElementById('placeToShowFiles').appendChild(image);
        })();
        currentPostState.attachedImages.push("images/Welcome.jpg");
        setNumFilesAndSizeText();
        
        var FileDragHover = function(e){
            // cancel event and hover styling
            e.stopPropagation();
            e.preventDefault();
            //Converts the event to hover instead of dragover
            e.target.className = (e.type == "dragover" ? "hover" : "");
        }
        var FileSelectHandler = function(e) {
            var addNewImage = function(ev2){
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
                    setNumFilesAndSizeText();
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
            }
            setNumFilesAndSizeText();
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

        var elementToAppendToID = currentPostID == 0 ? '#initialPost' :"#post" + currentPostID.toString();
        currentPostID++;

        var parentElement = document.createElement('div');
        parentElement.style.display="none";
        var parentElementID = "#post" + currentPostID.toString();
        parentElement.id = "post" + currentPostID.toString();
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
        for(var i=0; i<currentPostState.attachedImages.length; i++){
            if(currentPostState.attachedImages[i] != undefined){
                innerParentElement.appendChild(createImageEntry(currentPostState.attachedImages[i]));
            }
        }
        parentElement.appendChild(innerParentElement);      
        var likeButton = document.createElement('button'); 
        likeButton.className = "design-btn design-theme-d1 design-margin-bottom";
        likeButton.innerHTML = "<i class='fa fa-thumbs-up'></i> Like";
        parentElement.appendChild(likeButton);

        var commentButton = document.createElement('button'); 
        commentButton.className = "design-btn design-theme-d1 design-margin-bottom";
        commentButton.innerHTML = "<i class='fa fa-comment'></i>  Comment";
        commentButton.style.marginLeft = "4px";
        parentElement.appendChild(commentButton);

        //Append it all at the end to minimize DOM exposure
        document.getElementById('dummy').appendChild(parentElement);

        $(parentElementID).insertBefore(elementToAppendToID);
        $(parentElementID).fadeIn(1000).css('display','block');
    }   

    $('#clear').click(function(){
        clearSelection();
    });

    $('#post').click(function() {
        makeNewPost();
        clearSelection();
    });


        
}})();
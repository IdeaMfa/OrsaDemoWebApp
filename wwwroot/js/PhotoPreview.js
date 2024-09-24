const fileInput = document.getElementById('photoUpload');
const text = document.getElementById('defaultText');
window.UploadedPhotos = [];
let imageCounter = 1;

function TextVisibility() {
    if (window.UploadedPhotos.length > 0) {
        $('#defaultText').hide();
    } else {
        $('#defaultText').show();
    }
}

fileInput.addEventListener('change', function () {
    const previewArea = document.getElementById('previewArea');

    [...this.files].forEach(file => {

        if (file.type.match('image/jpg') || file.type.match('image/png') || file.type.match('image/jpeg')) {
            const reader = new FileReader();
            const newImage = new Image();
            let imageId;

            reader.addEventListener('load', function () {
                const imageData = this.result;
                imageId = 'previewImage_' + imageCounter++;
                const imagearr = {
                    id: imageId,
                    name: file.name,
                    file: file,
                    path: this.result,
                };

                const containerdiv = document.createElement('div');
                containerdiv.className = 'image-container col-12 mb-2';
                newImage.src = imageData;
                newImage.id = imageId;
                newImage.alt = "Uploaded Photo";
                newImage.style.maxWidth = "100%";
                newImage.style.maxHeight = "100%";
                newImage.style.width = "100%";
                newImage.style.height = "100%";

                const deleteButton = document.createElement('button');
                deleteButton.style.position = 'absolute';
                deleteButton.innerHTML = 'X';
                deleteButton.className = 'btn btn-danger rounded-circle d-inline-block';
                deleteButton.style.transform = 'translate(-100%, -0%)';
                deleteButton.style.fontSize = '0.5rem';

                deleteButton.addEventListener('click', function () {
                    previewArea.removeChild(containerdiv);
                    window.UploadedPhotos = window.UploadedPhotos.filter(img => img.name !== file.name);
                    document.getElementById("photoUpload").value = "";
                    imageCounter--;

                    if (window.UploadedPhotos.length === 0) {
                        TextVisibility();
                    }
                });

                containerdiv.appendChild(newImage);
                containerdiv.appendChild(deleteButton);
                previewArea.appendChild(containerdiv);

                
            });

            reader.readAsDataURL(file);
            // Add photo to UploadedPhotos array
            window.UploadedPhotos.push(file);
            // Update text visibility after adding a photo
            TextVisibility();
        }
    });
});

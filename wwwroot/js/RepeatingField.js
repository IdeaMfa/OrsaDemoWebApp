window.institutionImages = [];
var cloneCount = 1;
window.allImages = {};
var cloneCounts = {};
var baseId = 1000;

function cloneForm(button) {

    var original = document.getElementById('institutionField_1');
    var clone = original.cloneNode(true);

    var deleteButton = clone.querySelector('.btn-danger.btn-sm');
    if (deleteButton) {
        deleteButton.remove();
    }

    cloneCount++;
    updateCloneIds(clone, cloneCount); //ok
    clearCloneImageArea(clone);  // ok
    insertCloneAfterCurrent(button, clone);  //ok
    addDeleteButton(clone);  //ok
    updateCustomDiv(clone, cloneCount); //ok
    updateIds();  //ok
    initializeCounter("institutionField_" + cloneCount);  //ok

}

function updateCloneIds(clone, count) {

    clone.id = "institutionField_" + count;
    clone.querySelector('[id^="institution_"').id = "institution_" + count;
    clone.querySelector('[id^="graduation_"').id = "graduation_" + count;
    clone.querySelector('.institutionfileinput').id = "institutionphotoupload_" + count;
    clone.querySelector('.institutionarea').id = "institutionarea_" + count;

    var fileInputButton = clone.querySelector('.institutionfileinput + input[type="button"]');
    fileInputButton.setAttribute('onclick', 'document.querySelector("#institutionphotoupload_' + count + '").click();');

}

function clearCloneImageArea(clone) {

    var cloneImageArea = clone.querySelector('.institutionarea');
    cloneImageArea.innerHTML = ""; 

}

function insertCloneAfterCurrent(button, clone) {

    var parentForm = button.closest('.form-institution');
    if (parentForm.nextSibling) {
        parentForm.parentNode.insertBefore(clone, parentForm.nextSibling);
    }
    else {
        parentForm.parentNode.appendChild(clone);
    }

}

function addDeleteButton(clone) {

    var deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('class', 'btn btn-danger btn-sm');
    deleteButton.setAttribute('onclick', 'deleteForm(this)');
    deleteButton.textContent = '-';
    clone.querySelector('.col-1').appendChild(deleteButton);

}

function updateCustomDiv(clone, count) {

    var customDiv = clone.querySelector('[id^="customDiv_"]');
    if (!customDiv) {
        customDiv = document.createElement('div');
        customDiv.style.visibility = "hidden";
        clone.appendChild(customDiv);
    }
    var customDivId = baseId + (count - 1) * 1000;  
    customDiv.id = "customDiv_" + customDivId;
    customDiv.textContent = "Custom Div " + customDivId;

}

function updateIds() {

    var forms = document.querySelectorAll('.form-institution');
    var newAllImages = {};

    forms.forEach((form, index) => {
        var oldId = form.id;
        var newCount = index + 1;
        var newId = "institutionField_" + newCount;
        var customDivId = baseId + (newCount - 1) * 1000;

        updateCustomDivId(form, customDivId);

        if (oldId !== newId) {
            updateCloneIds(form, newCount);
            if (allImages[oldId]) {
                newAllImages[newId] = allImages[oldId];
                delete allImages[oldId];
            }
        }
        else {
            newAllImages[newId] = allImages[oldId];
        }
    });

    allImages = newAllImages;

}

function updateCustomDivId(form, customDivId) {

    var customDiv = form.querySelector('[id^="customDiv_"]');
    if (customDiv) {

        customDiv.id = "customDiv_" + customDivId;
        customDiv.textContent = "Custom Div " + customDivId;

    }

}

function deleteForm(button) {

    var formToDelete = button.closest('.form-institution');
    var cloneId = formToDelete.id;
    delete allImages[cloneId];
    formToDelete.remove();
    updateIds();

}

function clearForm(formId) {
    var form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll('select, input').forEach(element => {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0;
            } else if (element.type === 'file') {
                element.value = '';
            } else if (element.type !== 'button' && !element.classList.contains('institutionfileinput')) {
                element.value = '';
            }
        });
        clearCloneImageArea(form);

        delete allImages[formId];
    }
}

function initializeCounter(id) {
    cloneCounts[id] = 1;
}

function incrementCounter(cloneId) {
    if (!cloneCounts[cloneId]) {
        cloneCounts[cloneId] = 1;
    }

    if (!allImages[cloneId] || allImages[cloneId].length === 0) {
        return 'institutionImage_1';
    }

    const lastImageId = allImages[cloneId][allImages[cloneId].length - 1].id;
    const lastIndex = parseInt(lastImageId.replace('institutionImage_', ''));
    return 'institutionImage_' + (lastIndex + 1);
}

// Bütün sayfayı dinleyecek bir event listener ekle ve content üzerindeki değişiklikleri dinle
// Bu değişikiliğin dosya ekleme olup olmadığını kontrol ederek gerekli dosya işlemlerini yapacak
// Fonksiyonu çağır
document.addEventListener('change', function (event) {
    if (event.target && event.target.classList.contains('institutionfileinput')) {
        handleFileUpload(event.target);
    }
});

function handleFileUpload(input) {
    const schoolarea = input.closest('.form-institution').querySelector('.institutionarea');
    const files = input.files; // FileList {0: file1, 1: file2, length: 2}
    const cloneId = input.closest('.form-institution').id;

    if (!allImages[cloneId]) {
        allImages[cloneId] = [];
        initializeCounter(cloneId);
    }

    [...files].forEach(file => {   // ... spread operatörü parse eder
        if (file.type.match('image/jpeg') || file.type.match('image/png') || file.type.match('image/jpg')) {
            const reader = new FileReader();   // File reader nesnesi 

            reader.addEventListener('load', function () {
                const imageData = this.result;
                const newImage = new Image();
                const imageId = getNewImageId(cloneId);

                newImage.src = imageData;
                newImage.id = imageId;
                newImage.alt = "Uploaded Photo";
                newImage.style.maxWidth = "100%";
                newImage.style.maxHeight = "100%";
                newImage.style.width = "100%";
                newImage.style.height = "100%";

                const containerDiv = document.createElement('div');
                containerDiv.className = 'image-container col-4 mb-2';
                containerDiv.id = 'container_' + imageId;

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = 'X';
                deleteButton.className = 'btn btn-danger rounded-circle d-inline-block';
                deleteButton.style.position = 'absolute';
                deleteButton.style.transform = 'translate(-100%, -0%)';
                deleteButton.style.fontSize = '0.5rem';

                deleteButton.addEventListener('click', function () {
                    const index = allImages[cloneId].findIndex(img => img.file.name === file.name);
                    if (index !== -1) {
                        allImages[cloneId].splice(index, 1);
                        const container = document.getElementById('container_' + imageId);
                        if (container) {
                            schoolarea.removeChild(container);
                        }
                    }
                });

                containerDiv.appendChild(newImage);
                containerDiv.appendChild(deleteButton);
                schoolarea.appendChild(containerDiv);

                allImages[cloneId].push({ id: imageId, file });
            });

            reader.readAsDataURL(file);
        }
    });
}

function incrementGlobalCounter() {
    let highestId = 0;
    Object.keys(allImages).forEach(cloneId => {
        if (allImages[cloneId]) {
            allImages[cloneId].forEach(image => {
                const idNumber = parseInt(image.id.replace('institutionImage_', ''));
                if (idNumber > highestId) {
                    highestId = idNumber;
                }
            });
        }
    });
    return 'institutionImage_' + (highestId + 1);
}

function getNewImageId(cloneId) {
    const newId = incrementGlobalCounter();
    cloneCounts[cloneId] = parseInt(newId.replace('institutionImage_', ''));
    return newId;
}
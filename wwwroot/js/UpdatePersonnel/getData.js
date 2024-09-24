// /wwwroot/js/UpdatePersonnel/getData.js
window.deletedPersonnelPhotos = [];
window.deletedInstitutionPhotos = [];
window.allImages = {};
var cloneCounts = {};
var baseId = 1000;

export function GetData() {
    var url = window.location.href;
    var parts = url.split('/');
    var id = parts[parts.length - 1];
    var idInt = parseInt(id);

    $.ajax({
        url: "/UpdatePersonnel/EditPersonnel",
        type: "GET",
        dataType: "json",
        data: { id: idInt },
        success: function (data) {
            console.log(data);

            $("#PersonnelName").val(data.name);
            $("#PersonnelSurname").val(data.surname);
            $("#PersonnelPhoneNumber").val(data.phoneNumber);
            $("#PersonnelEmail").val(data.email);

            var dateTime = new Date(data.dateOfBirth);
            var formatDate = dateTime.toISOString().slice(0, 10);
            $("#PersonnelDateOfBirth").val(formatDate);

            // Set static text boxes for country and city
            $("#staticCountry").val(data.country || 'Unknown');
            $("#staticCity").val(data.city || 'Unknown');

            var photos = data.mediaLibrary;
            console.log(photos);

            //var photosContainer = $("#PersonnelPhotos");

            let imageId;
            const previewArea = $('#previewArea');
            $.each(photos, function (index, photo) {
                //console.log(photo);
                imageId = photo.id;
                console.log(imageId);

                var photoData = {
                    id: imageId,
                    mediaUrl: '/MediaLibrary/' + photo.mediaUrl,
                    name: photo.mediaName
                }
                var containerDiv = $('<div></div>').addClass('image-container col-12');
                const newImage = new Image();

                newImage.id = imageId;
                newImage.src = photoData.mediaUrl;
                newImage.alt = "Uploaded Photo";
                newImage.style.maxWidth = "100%";
                newImage.style.maxHeight = "100%";
                newImage.style.width = "100%";
                newImage.style.height = "100%";

                const deleteFromDataBaseButton = document.createElement('button');
                deleteFromDataBaseButton.style.position = 'absolute';
                deleteFromDataBaseButton.innerHTML = 'X';
                deleteFromDataBaseButton.className = 'btn btn-danger rounded-circle d-inline-block';
                deleteFromDataBaseButton.style.transform = '0.5rem';

                deleteFromDataBaseButton.addEventListener('click', function () {

                    var imageIdToDelete = $(this).siblings('img').attr('id');
                    deletedPersonnelPhotos.push(imageIdToDelete);
                    $(this).closest('.image-container').remove();
                    document.getElementById("photoUpload").value = "";
                    
                });

                containerDiv.append(newImage);
                containerDiv.append(deleteFromDataBaseButton);
                previewArea.append(containerDiv);

            });

            // Get institution data into corresponding areas
            var institutionInfo = data.personnelInstitutions;
            console.log(institutionInfo);
            var original = document.getElementById('database_1');

            // Fill first field
            if (institutionInfo.length > 0) {
                var institutionNonMediaInfo = {
                    "institutionId": institutionInfo[0].institutionId,
                    "institutionName": institutionInfo[0].institutionName,
                    "graduationYear": institutionInfo[0].graduationYear,
                };

                fillInstitutionInfo(original, institutionNonMediaInfo, institutionInfo[0].institutionMediaLibrary, institutionInfo[0].institutionNumber);
            } else {
                updateToNewField(original);
            }

            for (var i = 1; i < institutionInfo.length; i++) {
                var clonedOriginal = original.cloneNode(true);
                var newId = "database_" + (i + 1);
                clonedOriginal.id = newId;

                // Update IDs and attributes for the cloned element
                updateDatabaseIds(clonedOriginal, newId);

                // Fill the cloned element with information
                var institutionNonMediaInfoIndex = {
                    "institutionId": institutionInfo[i].institutionId,
                    "institutionName": institutionInfo[i].institutionName,
                    "graduationYear": institutionInfo[i].graduationYear,
                };
                fillInstitutionInfo(clonedOriginal, institutionNonMediaInfoIndex, institutionInfo[i].institutionMediaLibrary, institutionInfo[i].institutionNumber);

                // Append the cloned element to the DOM
                document.getElementById('form-container').appendChild(clonedOriginal);
            }


            function fillInstitutionInfo(container, institutionInfo, institutionMedia, institutionNumber) {
                var institutionSelect = container.querySelector('[id^="databaseinstitution_"], [id^="newfieldinstitution_"]');
                if (!institutionSelect) {
                    console.log("Not found any institution");

                    return;
                }

                fillDropdown($(institutionSelect), institutionInfo.institutionId);

                var graduationInput = container.querySelector('[id^="databaseinstitutiongraduation_"], [id^="newfieldgraduation_"]');

                if (graduationInput) {
                    graduationInput.value = institutionInfo.graduationYear;
                };

                if (container.id.startsWith("database_")) {
                    var institutionInfoDiv = document.querySelector('.institutionInfoId');

                    if (!institutionInfoDiv) {
                        institutionInfoDiv = document.createElement('div');
                        institutionInfoDiv.id = "instiutionInfoId_" + container.id.split('_')[1];
                        institutionInfoDiv.style.display = "none";
                        institutionInfoDiv.className = "institutionInfoId";
                        institutionInfoDiv.textContent = institutionInfo.id;
                        container.appendChild(institutionInfoDiv);
                    } else {
                        institutionInfoDiv.textContent = institutionInfo.id;
                    }
                }

                var previews = container.querySelector('.databaseinstitutionarea, .newfieldinstitutionarea');
                if (previews) {
                    previews.innerHTML = '';

                    institutionMedia.forEach(function (media) {
                        var img = document.createElement('img');
                        img.src = '/MediaLibrary/' + media.mediaUrl;
                        img.alt = media.id;
                        img.style.maxWidth = "100%";
                        img.style.maxHeight = "100%";
                        img.style.width = "100%";
                        img.style.height = "100%";
                        var databasephoto = $('<div></div>').addClass('image-container col-6');
                        const deletedatabaseimageinstitutionbutton = document.createElement('button');
                        deletedatabaseimageinstitutionbutton.style.position = 'absolute';
                        deletedatabaseimageinstitutionbutton.innerHTML = 'X';
                        deletedatabaseimageinstitutionbutton.className = 'btn btn-danger rounded-circle d-inline-block';
                        deletedatabaseimageinstitutionbutton.style.transform = 'translate(-100%,-0%)';
                        deletedatabaseimageinstitutionbutton.style.fontSize = '0.5rem';

                        databasephoto.append(img);
                        databasephoto.append(deletedatabaseimageinstitutionbutton);
                        $(previews).append(databasephoto);

                        deletedatabaseimageinstitutionbutton.addEventListener('click', function () {
                            var imageIdToDelete = $(this).siblings('img').attr('alt');
                            deletedInstitutionPhotos.push(imageIdToDelete);
                            console.log(imageIdToDelete);
                            console.log(deletedInstitutionPhotos);
                            $(this).closest('.image-container').remove();
                            document.getElementById("photoUpload").value = "";
                        });
                    });
                }

                var customDiv = container.querySelector('[id^="customDiv_"]');
                if (!customDiv) {
                    customDiv = document.createElement('div');
                    customDiv.style.visibility = "hidden";
                    container.appendChild(customDiv);
                }

                customDiv.id = "customDiv_" + institutionNumber;
                customDiv.textContent = "Custom Div " + institutionNumber;

                var existingDeleteButton = container.querySelector('.btn-danger.btn-sm');
                if (existingDeleteButton) {
                    existingDeleteButton.remove();
                }

                var deleteButton = document.createElement('button');
                deleteButton.setAttribute('type', 'button');
                deleteButton.setAttribute('class', 'btn btn-danger btn-sm');
                deleteButton.textContent = '-';

                deleteButton.addEventListener('click', function () {
                    deleteDatabaseForm(container, institutionInfo.institutionNumber);
                });
                container.querySelector('.col-1').appendChild(deleteButton);
            }

            function updateDatabaseIds(clone, newId) {
                var count = newId.split('_')[1];

                clone.querySelector('[id^="databaseinstitution_"]').id = "databaseinstitution_" + count;
                clone.querySelector('[id^="databaseinstitutiongraduation_"]').id = "databaseinstitutiongraduation_" + count;
                clone.querySelector('.databaseinstitutionfileinput').id = "fileInput_" + count;
                clone.querySelector('.databaseinstitutionarea').id = "institutionarea_" + count;

                var fileInputButton = clone.querySelector('.databaseinstitutionfileinput + input[type="button"]');
                if (fileInputButton) fileInputButton.setAttribute('onclick', 'document.querySelector("#fileInput_' + count + '").click();');
            }

            function updateToNewField(original) {
                var newId = "newfield_1";
                original.id = newId;
                updateCloneIDs(original, newId);
            }

            function deleteDatabaseForm(form, institutionInfoNumber) {
                if (confirm("Are you sure to delete this data")) {
                    var institutionInfoDiv = form.querySelector('.institutionInfoId');
                    if (institutionInfoDiv) {
                        var institutionInfoId = institutionInfoDiv.textContent;
                        console.log(institutionInfoId);
                    }

                    $.ajax({
                        url: "/UpdatePersonnel/InstitutionDataDelete",
                        type: "PUT",
                        data: { id: institutionInfoId },
                        success: function () {
                            if (institutionInfoNumber == 1000 || form.id === "newfield_1" || form.id === "database_1") {
                                clearCustomDivInputs(form, institutionInfoNumber);
                            }
                            else {
                                form.remove();
                                updateIds();
                            }
                        },
                        error: function () {
                            alert("Deleting action is unsuccessful");
                        }
                    });
                } else {
                    alert("Deleting action has canceled");
                }
            }

            document.addEventListener('change', function (event) {
                if (event.target && event.target.classList.contains('databaseinstitutionfileinput')) {
                    changeincominginfo(event.target);
                }
            });

            function changeincominginfo(input) {
                const institutionarea = input.closest('.form-institution').querySelector('.databaseinstitutionarea, .newfieldinstitutionarea');
                const files = input.files;
                const cloneId = input.closest('.form-institution').id;

                if (!allImages[cloneId]) {
                    allImages[cloneId] = [];
                    initializeCounter(cloneId);
                }

                [...files].forEach(file => {
                    if (file.type.match('image/jpeg') || file.type.match('image/png') || file.type.match('image/jpg')) {
                        const reader = new FileReader();

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
                                const index = allImages[cloneId].findIndex(img => img.id === imageId);
                                if (index !== -1) {
                                    allImages[cloneId].splice(index, 1);
                                    const container = document.getElementById('container_' + imageId);
                                    if (container) {
                                        institutionarea.removeChild(container);
                                    }
                                }
                            });

                            containerDiv.appendChild(newImage);
                            containerDiv.appendChild(deleteButton);
                            institutionarea.appendChild(containerDiv);

                            allImages[cloneId].push({ id: imageId, file });
                        });

                        reader.readAsDataURL(file);
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Error while fetching personnel data:", status, error);
        }
    });
}

export function cloneForm(button) {
    var original = document.querySelector('.form-institution').cloneNode(true);

    var forms = document.querySelectorAll('.form-institution');
    var newId = generateNewId(forms);
    var number = calculateNewNumber(forms, button);

    updateCloneIDs(original, newId);
    clearCloneImageArea(original);
    insertCloneAtPosition(button, original, newId);
    addDeleteButton(original);
    updateCustomDiv(original, newId, number);
    initializeCounter(newId);
    fillDropdown($(original).find('[id^="institution_"], [id^="newfieldinstitution_"]'));

    if (newId.startsWith("database_")) {
        var institutionInfoDiv = document.createElement('div');
        institutionInfoDiv.id = "institutionInfoId_" + newId.split('_')[1];
        institutionInfoDiv.style.display = "none";
        institutionInfoDiv.className = "institutionInfoId";
        original.appendChild(institutionInfoDiv);
    } else {
           var institutionInfoDiv = original.querySelector('.institutionInfoId');
        if (institutionInfoDiv) {
            institutionInfoDiv.remove();
        }

    }
}

function generateNewId(forms) {
    var newIdNumber = 1;
    var existingIds = Array.from(forms).map(form => form.id.startsWith('newfield_') ? parseInt(form.id.split('_')[1]) : 0).filter(id => id > 0).sort((a, b) => a - b);

    while (existingIds.includes(newIdNumber)) {
        newIdNumber++;
    }

    return "newfield_" + newIdNumber;
}

function calculateNewNumber(forms, button) {
    var prevForm = button.closest('.form-institution');
    var prevNumber = parseInt(prevForm.querySelector('[id^="customDiv_"]').id.split('_')[1]);
    var nextForm = prevForm.nextElementSibling;
    var nextNumber = nextForm ? parseInt(nextForm.querySelector('[id^="customDiv_"]').id.split('_')[1]) : (prevNumber + 1000);
    return nextForm ? Math.floor((prevNumber + nextNumber) / 2) : prevNumber + 1000;
}

function updateCloneIDs(clone, newId) {
    clone.id = newId;
    var count = newId.split('_')[1];
    var institutionSelect = clone.querySelector('[id^="databaseinstitution_"], [id^="newfieldinstitution_"]');
    var graduationInput = clone.querySelector('[id^="databaseinstitutiongraduation_"], [id^="newfieldgraduation_"]');
    var fileInput = clone.querySelector('.databaseinstitutionfileinput');
    var institutionArea = clone.querySelector('newfieldinstitutionarea');

    if (institutionSelect) institutionSelect.id = "newfieldinstitution_" + count;
    if (institutionSelect) graduationInput.id = "newfieldgraduation_" + count;
    if (fileInput) fileInput.id = "fileInput_" + count;
    if (institutionArea) institutionArea.id = "institutionArea_" + count;

    console.log($('#newinstitutionfield_1'));
    fillDropdown($('#newinstitutionfield_1'));

    var fileInputButton = clone.querySelector('.databaseinstitutionfileinput + input[type="button"]');

    if (fileInputButton) fileInputButton.setAttribute('onclick', 'document.querySelector("#fileInput_' + count + '").click();');

    var originalone = document.querySelector('[id^="newfieldinstitution_1"]');

    if (originalone && originalone.options.length <= 1) {
        fillDropdown($(originalone));
    }
}

function fillDropdown(dropdown, selectedId = "") {
    dropdown.empty();
    dropdown.append('<option value="">Choose Institution</option>');
    $.each(dropdownData, function (key, value) {
        var option = new Option(value.institutionName, value.id);
        if (value.id === selectedId) {
            option.selected = true;
        }
        dropdown.append(option);
    });
}

function clearCloneImageArea(clone) {
    var cloneImageArea = clone.querySelector('.databaseinstitutionarea, .newfieldinstitutionarea');
    cloneImageArea.className = 'newfieldinstitutionarea';
    cloneImageArea.innerHTML = "";
}

function insertCloneAtPosition(button, clone, newId) {
    var parentForm = button.closest('.form-institution');
    parentForm.parentNode.insertBefore(clone, parentForm.nextSibling);
}

function addDeleteButton(clone, isInitial = false) {
    var existingDeleteButton = clone.querySelector('.btn-danger.btn-sm');
    if (existingDeleteButton) {
        existingDeleteButton.remove();
    }

    var deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('class', 'btn btn-danger btn-sm');
    deleteButton.textContent = '-';

    if (isInitial) {
        deleteButton.addEventListener('click', function () {
            clearCustomDivInputs(clone, 1000);
        });
    } else {
        deleteButton.setAttribute('onclick', 'deleteForm(this)');
    }

    clone.querySelector('.col-1').appendChild(deleteButton);
}

function updateCustomDiv(clone, newId, number) {
    var customDiv = clone.querySelector('[id^="customDiv_"]');
    if (!customDiv) {
        customDiv = document.createElement('div');
        customDiv.style.visibility = "hidden";
        clone.appendChild(customDiv);
    }

    customDiv.id = "customDiv_" + number;
    customDiv.textContent = "Custom Div " + number;
}

export function deleteForm(button) {
    var formToDelete = button.closest('.form-institution');
    var cloneId = formToDelete.id;

    delete allImages[cloneId];

    formToDelete.remove();

    updateIDs();
}

function updateIDs() {
    var forms = document.querySelectorAll('.form-institution');
    var newAllImages = {};

    forms.forEach((form, index) => {
        var oldId = form.id;
        if (oldId.startsWith("newfield_")) {
            var newCount = index + 1;
            var newId = "newfield_" + newCount;
            var customDivId = calculateNewCustomDivId(forms, newCount - 1);

            updateCustomDivId(form, customDivId);
            updateCloneIDs(form, newId);
            if (allImages[oldId]) {
                newAllImages[newId] = allImages[oldId];
                delete allImages[oldId];
            }
        } else {
            newAllImages[oldId] = allImages[oldId];
        }
    });

    allImages = newAllImages;
}

function calculateNewCustomDivId(forms, index) {
    var prevCustomDivId = index > 0 ? parseInt(forms[index - 1].querySelector('[id^="customDiv_"]').id.split('_')[1]) : baseId;
    var nextCustomDivId = (index + 1 < forms.length) ? parseInt(forms[index + 1].querySelector('[id^="customDiv_"]').id.split('_')[1]) : (prevCustomDivId + 1000);
    return Math.floor((prevCustomDivId + nextCustomDivId) / 2);
}

function updateCustomDivId(form, customDivId) {
    var customDiv = form.querySelector('[id^="customDiv_"]');
    if (customDiv) {
        customDiv.id = "customDiv_" + customDivId;
        customDiv.textContent = "Custom Div " + customDivId;
    }
}

function clearForm(formId) {
    var form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll('select, input').forEach(element => {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0;
            } else if (element.type === 'file') {
                element.value = '';
            } else if (element.type !== 'button' && !element.classList.contains('databaseinstitutionfileinput')) {
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
    console.log("Bu fonksiyon kullanılıyor");
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


function getNewImageId(cloneId) {
    const newId = incrementGlobalCounter();
    cloneCounts[cloneId] = parseInt(newId.replace('institutionImage_', ''));
    return newId;
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




//------------------------------------------------------------------------------------------------

//window.silinenpersonelfotograflari =[];
//window.silinenOkulFotograflari = []; //
//window.allImages = {}; //
//var cloneCounts = {};
//var baseId = 1000;

//$(function () {

//    var url = window.location.href;
//    var parts = url.split('/');
//    var id = parts[parts.length - 1];

//    var Numid = id.match(/\d+$/);
//    id2 = parseInt(Numid[0], 10);



//    $.ajax({
//        url: "/Duzenleme/VeriGetir",
//        type: "GET",
//        dataType: "json",
//        data: { id: id2 },
//        success: function (data) {
//            console.log(data.id);
//            console.log(data);
//            var datalar = data.ogrencilers;
//            var fotograflar = data.medyalar;

//            $("#OgrenciAdi").val(datalar.ogrenciAd);
//            $("#OgrenciSinif").val(datalar.ogrenciSinif);
//            $("#OgrenciSifre").val(datalar.sifre);
//            $("#OkulNo").val(datalar.okulNo);

//            const previewArea = $('#previewArea');
//            $.each(fotograflar, function (index, photo) {
//                var imageid = photo.id;
//                var photoData = {
//                    ids: imageid,
//                    medyaUrl: '/MedyaKutuphanesi/' + photo.medyaUrl,
//                    names: photo.medyaAdi
//                };
//                var containerDiv = $('<div></div>').addClass('image-container col-12');
//                const newImage = new Image();
//                newImage.id = imageid;
//                newImage.src = photoData.medyaUrl;
//                newImage.alt = "Yüklenen Fotoğraf";
//                newImage.style.maxWidth = "100%";
//                newImage.style.maxHeight = "100%";
//                newImage.style.width = "100%";
//                newImage.style.height = "100%";

//                const deletedatabasebutton = document.createElement('button');
//                deletedatabasebutton.style.position = 'absolute';
//                deletedatabasebutton.innerHTML = 'X';
//                deletedatabasebutton.className = 'btn btn-danger rounded-circle d-inline-block';
//                deletedatabasebutton.style.transform = 'translate(-100%,-0%)';
//                deletedatabasebutton.style.fontSize = '0.5rem';

//                deletedatabasebutton.addEventListener('click', function () {
//                    var imageIdToDelete = $(this).siblings('img').attr('id');
//                    silinenpersonelfotograflari.push(imageIdToDelete);
//                    $(this).closest('.image-container').remove();
//                    document.getElementById("photoUpload").value = "";
//                });

//                containerDiv.append(newImage);
//                containerDiv.append(deletedatabasebutton);
//                previewArea.append(containerDiv);

//            });

//            // Okul verilerini ilgili alanlara çek
//            var okulInfo = data.okullarData;
//            var original = document.getElementById("database_1");

//            // İlk alanı doldur
//            if (okulInfo.length > 0) {
//                var okulNonMediaInfo = {
//                    "okulId": okulInfo[0].okulNonMedia.okulId,
//                    "okulAdi": okulInfo[0].okulNonMedia.okulAdi,
//                    "mezuniyetYili": okulInfo[0].okulNonMedia.mezuniyetYili
//                };
//                okulInfoDoldur(original, okulNonMediaInfo, okulInfo[0].okulMedyalar, okulInfo[0].okulNonMedia.okulSirasiNumarasi);
//            }
//        },
//    });
//});

//function okulInfoDoldur(container, okulInfo, okulMedia, okulNumber) {
//    var okulSelect = container.querySelector('[id^="databaseokul_"], [id^="yenialanokul_"]');
//    if (!okulSelect) {
//        console.error("Herhangi bir okul bulunamadı");
//        return;
//    }

//    dropdownDoldur($(okulSelect), okulInfo.okulId);

//    var mezuniyetInput = container.querySelector('[id^="databasemezuniyet_"], [id^="yenialanmezuniyet_"]');
//    if (mezuniyetInput) {
//        mezuniyetInput.value = okulInfo.mezuniyetYili;
//    }

//    if (container.id.startsWith('database_')) {
//        var okulInfoDiv = document.querySelector('.okulInfoId');

//        if (!okulInfoDiv) {
//            okulInfoDiv = document.createElement('div');
//            okulInfoDiv.id = "okulInfoId_" + container.id.split('_')[1];
//            okulInfoDiv.style.display = "none";
//            okulInfoDiv.className = "okulInfo";
//            okulInfoDiv.textContent = okulInfo.id;
//            container.appendChild(okulInfoDiv);
//        } else {
//            okulInfoDiv.textContent = okulInfo.id;
//        }
//    }

//    var previews = container.querySelector('.databaseokulalan, .yeniokulalan');
//    if (previews) {
//        previews.innerHTML = '';

//        okulMedia.forEach(function (media) {
//            var img = document.createElement('img');
//            img.src = '/MedyaKutuphanesi/' + media.medyaUrl;
//            img.alt = media.id;
//            img.style.maxWidth = "100%";
//            img.style.maxHeight = "100%";
//            img.style.width = "100%";
//            img.style.height = "100%";

//            var databasephoto = $('<div></div>').addClass('image-container col-6');

//            const deletedatabaseimageokulbutton = document.createElement('button');
//            deletedatabaseimageokulbutton.style.position = 'absolute';
//            deletedatabaseimageokulbutton.innerHTML = 'X';
//            deletedatabaseimageokulbutton.className = 'btn btn-danger rounded-circle d-inline-block';
//            deletedatabaseimageokulbutton.style.transform = 'translate(-100%,-0%)';
//            deletedatabaseimageokulbutton.style.fontSize = '0.5rem';

//            databasephoto.append(img);
//            databasephoto.append(deletedatabaseimageokulbutton);
//            $(previews).append(databasephoto);

//            deletedatabaseimageokulbutton.addEventListener('click', function () {
//                var imageIdToDelete = $(this).siblings('img').attr('alt');
//                silinenOkulFotograflari.push(imageIdToDelete);
//                $(this).closest('.image-container').remove();
//                document.getElementById("photoUpload").value = "";
//            });
//        });
//    }
//}

//function dropdownDoldur(dropdown, selectedId = "") {
//    dropdown.empty();
//    dropdown.append('<option value=""> Okul Seç </option>');
//    $.each(dropdownOkullarData, function (key, value) {
//        var option = new Option(value.okulAdi, value.id);
//        if (value.id === selectedId) {
//            option.selected = true;
//        }
//        dropdown.append(option);
//    });
//}
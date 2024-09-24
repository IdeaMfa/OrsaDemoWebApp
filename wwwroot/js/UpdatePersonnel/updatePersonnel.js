const fieldForUploadingPhoto = new FormData();

export async function UpdatePersonnel() {
    var id = window.location.href.split('/').pop();
    var name = $("#PersonnelName").val();
    var surname = $("#PersonnelSurname").val();
    var password = $("#Password").val();
    var passwordAgain = $("#PasswordAgain").val();
    var phoneNumber = $("#PersonnelPhoneNumber").val();
    var phoneNumberPattern = /^0?\d{10,11}$/;
    var email = $("#PersonnelEmail").val();
    var emailPattern = /^[a-zA-Z0-9_\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var dateOfBirth = $("#PersonnelDateOfBirth").val();
    var city = $("#city").val();

    console.log(id);

    var putList = [];

    for (let i = 0; i < deletedPersonnelPhotos.length; i++) {
        putList.push(deletedPersonnelPhotos[i]);
    }

    let idInt = parseInt(id, 10);
    putList.push(idInt);
    console.log(putList);

    if (!phoneNumberPattern.test(phoneNumber)) {
        alert("Please enter a valid phone number");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    if (password != passwordAgain) {
        alert("Passwords do not match");
        return;
    }

    var Model = {
        Id: id,
        Name: name,
        Surname: surname,
        PhoneNumber: phoneNumber,
        Email: email,
        DateOfBirth: dateOfBirth,
        Password: password,
        City: city
    };

    var instFormData = new FormData();
    $('.form-institution').each((index, form) => {
        const institutionId = $(form).find('[id^="databaseinstitution_"]').val();
        const newFieldInstitutionId = $(form).find('[id^="newfieldinstitution_"]').val();
        const graduationYear = $(form).find('[id^="databaseinstitutiongraduation_"]').val();
        const newFieldGraduationYear = $(form).find('[id^="newfieldgraduation_"]').val();
        const customDivId = $(form).find('[id^="customDiv_"]').attr('id').split('_')[1];
        const institutionInfoDiv = $(form).find('.institutionInfoId');
        const institutionInfoId = institutionInfoDiv.length > 0 ? institutionInfoDiv.text() : null;
        console.log(institutionInfoId);

        if (typeof institutionId !== 'undefined' && institutionId !== null && institutionId !== '') {
            instFormData.append(`institutions[${index}][institutionId]`, institutionId);
            instFormData.append(`institutions[${index}][graduationYear]`, graduationYear);
        } else {
            instFormData.append(`institutions[${index}][newFieldInstitution]`, newFieldInstitutionId);
            instFormData.append(`institutions[${index}][newFieldGraduationYear]`, newFieldGraduationYear);
        }

        instFormData.append(`institutions[${index}][customDivId]`, customDivId);

        if (institutionInfoId !== null) {
            instFormData.append(`institutions[${index}][institutionInfoId]`, institutionInfoId);
        }

        const formId = form.id;
        console.log(`Processing form: ${formId}`);
        const images = allImages[formId];
        console.log(`Images for form ${formId}:`, images);

        if (images && images.length > 0) {
            images.forEach((image, imageIndex) => {
                if (image.file) {
                    instFormData.append(`institutions[${index}][images][${imageIndex}]`, image.file, image.file.name);
                    console.log(`Added image: ${image.file.name}`);
                } else {
                    console.error(`No file found for image at index ${imageIndex}`);
                }
            });
        } else {
            console.error(`No images found for form ${formId}`);
        }
    });
    instFormData.append('personnelid', id);

    for (var pair of instFormData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    try {
        const validationResult = await $.ajax({
            url: "/ModelValid/ValidateModel",
            type: "POST",
            dataType: "json",
            data: Model
        });

        if (validationResult.success) {
            const data = await $.ajax({
                url: "/UpdatePersonnel/EditPersonnelPut",
                type: "PUT",
                dataType: "json",
                data: Model
            });

            if (UploadedPhotos.length > 0) {
                $.each(UploadedPhotos, function (index, file) {
                    fieldForUploadingPhoto.append(`file_${index}`, file);
                });
                fieldForUploadingPhoto.append(`PersonnelId`, data.id);
            }

            await $.ajax({
                url: "/AddPersonnel/PersonnelSavePhoto",
                type: "POST",
                data: fieldForUploadingPhoto,
                processData: false,
                contentType: false
            });

            await $.ajax({
                url: "/DeletePersonnelPhotos",
                type: "PUT",
                data: { Ids: putList }
            });

            await $.ajax({
                url: "/UpdatePersonnel/DeleteInstitutionMedia",
                type: "PUT",
                data: { ids: window.deletedInstitutionPhotos }
            });

            await $.ajax({
                url: "/UpdatePersonnel/UpdateRepeatingField",
                type: 'PUT',
                data: instFormData,
                processData: false,
                contentType: false
            });

            alert("Updating Action is Successful");
            window.location.href = '';

        } else {
            alert(validationResult.error);
        }

    } catch (error) {
        console.error("Error:", error);
        alert(error);
    }
}

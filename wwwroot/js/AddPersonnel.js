const fieldForUploadingPhoto = new FormData();
var institutionFormData = new FormData();
$(document).ready(function () {
    // Bind the SavePersonnel function to the button click event
    $("#SavePersonnel").on("click", function (event) {
        event.preventDefault(); // Prevent default form submission 
        SavePersonnel();
    });
});

function SavePersonnel() {
    // Get the user info and validate them
    var name = $("#PersonnelName").val();
    var surname = $("#PersonnelSurname").val();
    var password = $("#Password").val();
    var passwordAgain = $("#PasswordAgain").val();
    var phoneNumber = $("#PersonnelPhoneNumber").val();
    var phoneNumberPattern = /^0?\d{10,11}$/;
    var dateOfBirth = $("#PersonnelDateOfBirth").val();
    var email = $("#PersonnelEmail").val();
    var emailPattern = /^[a-zA-Z0-9_\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var city = $("#city").val();

    // Check if any info is missing
    if (name == "" || surname == "" || password == "" || passwordAgain == "" || phoneNumber == "" || email == "" || dateOfBirth == "" || city == "") {
        alert("Please do not leave any field blank");
        return;
    }

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

    if (UploadedPhotos.length > 4) {
        alert("Photo uploading limit is 4");
        return;
    }

    var Model = {
        Name: name,
        Surname: surname,
        PhoneNumber: phoneNumber,
        Email: email,
        DateOfBirth: dateOfBirth,
        City: city,
        Password: password
    };

    var getTableId;
    $.ajax({
        url: "/ModelValid/ValidateModel",
        type: "POST",
        dataType: "json",
        data: Model,
        success: function (validationResult) {
            if (validationResult.success) {
                $.ajax({
                    url: "/AddPersonnel/PostOfAddingPersonnel",
                    type: "POST",
                    dataType: "json",
                    data: Model,
                    success: function (data) {
                        console.log(data.id);
                        getTableId = data.id;
                        if (UploadedPhotos.length > 0) {
                            $.each(UploadedPhotos, function (index, file) {

                                console.log(`file_${index}`);
                                console.log(file);
                                fieldForUploadingPhoto.append(`file_${index}`, file);
                                console.log(fieldForUploadingPhoto);
                                console.log(fieldForUploadingPhoto.file);

                            });
                            fieldForUploadingPhoto.append(`PersonnelId`, data.id);
                            // Display the values
                            for (const value of fieldForUploadingPhoto.values()) {
                                console.log(value.id);
                                console.log(value.name);
                                console.log(value.path);
                            }
                        }

                        $.ajax({
                            url: "/AddPersonnel/PersonnelSavePhoto",
                            type: "POST",
                            contentType: 'application/json',
                            data: fieldForUploadingPhoto,
                            processData: false,
                            contentType: false,
                            success: function (photoId) {

                                if (allImages != null) {

                                    var personnelId = getTableId;
                                    $('.form-institution').each(function (index, element) {

                                        var institutionName = $(element).find('[id^="institution_"]').val();
                                        var graduationYear = $(element).find('[id^="graduation_"]').val();

                                        institutionFormData.append('institution_' + (index + 1), institutionName);
                                        institutionFormData.append('graduation_' + (index + 1), graduationYear);
                                        var customDiv = $(element).find('[id^="customDiv_"]');
                                        if (customDiv.length > 0) {

                                            var customDivId = customDiv.attr('id');
                                            var customDivNumber = customDivId.match(/\d+$/)[0];

                                            institutionFormData.append('customDivNumber_' + (index + 1), customDivNumber);

                                        }

                                        var cloneId = $(element).attr('id');

                                        if (allImages[cloneId]) {


                                            allImages[cloneId].forEach(function (image, imageIndex) {

                                                institutionFormData.append('institutionImage_' + (index + 1), image.file);

                                            });

                                        }

                                    });
                                    institutionFormData.append('personnelId', personnelId);

                                    $.ajax({

                                        url: "/AddPersonnel/SaveInstitutionData",
                                        type: 'POST',
                                        data: institutionFormData,
                                        contentType: false,
                                        processData: false,
                                        success: function (institutionMedia) {

                                            console.log("Adding Personnel Action is Successful");
                                            console.log(institutionFormData);
                                            //window.location.href = 'https://localhost:5001/AddPersonnel/AddPersonnel'; // Type location here

                                        },

                                        error: function (xhr, status, error) {

                                            console.error("Error while posting institution data:", status, error);

                                        }

                                    });

                                }

                                console.log(fieldForUploadingPhoto);
                                console.log("Photos uploaded successfully");
                            },
                            error: function (xhr, status, error) {
                                console.error("Error while uploading photos:", status, error);
                                alert(error);
                            }
                        });

                        console.log(data.city);
                        console.log("Saving personnel action has successfully done!");
                        alert("Saving personnel action has successfully done");
                    },
                    error: function (xhr, status, error) {
                        console.error("Error while saving personnel:", status, error);
                        alert(error);
                    }
                });
            }
            else {
                alert(validationResult.error);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error while validating model:", status, error);
            alert(error);
        }
    });
}



// Previous version of ajax request:
/*
$.ajax({

    url: "/AddPersonnel/PostOfAddingPersonnel",
    type: "POST",
    dataType: "json",
    data: Model,

    success: function (data) {

        //getTableId = data.Id;
        console.log("Saving personnel action has successfully done: ");
        alert(data);
        console.log(data.Name);

    },
    error: function (xhr, status, error) {

        console.error("Error while saving personnel:", status, error);

    }

});
*/

/*
$(document).ready(function () {
    // Bind the SavePersonnel function to the button click event
    $("#SavePersonnel").click(function (event) {
        SavePersonnel();
    });
});
*/
// /wwwroot/js/UpdatePersonnel/main.js
import { GetData } from './getData.js';
import { cloneForm } from './getData.js';
import { deleteForm } from './getData.js';
import { UpdatePersonnel } from './updatePersonnel.js';


$(document).ready(function () {
    GetData();

    // Bind the SavePersonnel function to the button click event
    $("#Update").click(function (event) {
        event.preventDefault(); // Prevent the default form submission
        UpdatePersonnel();
    });

    // Handle form cloning
    $(document).on('click', '.btn-success', function (event) {
        event.preventDefault();
        cloneForm(this);
    });

    $(document).on('click', '.btn-danger', function (event) {
        event.preventDefault();
        deleteForm(this);
    });

});

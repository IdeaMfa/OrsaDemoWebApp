window.dropdownData = [];

$(function () {

    $.ajax({

        url: '/AddPersonnel/GetAllInstitutions',
        type: 'Get',
        dataType: 'json',
        success: function (Data) {

            dropdownData = Data;
            var dropdown = $('#institution_1');
            dropdown.empty();
            dropdown.append('<option value=""> Select Institution </option>');
            $.each(Data, function (key, value) {

                dropdown.append('<option value="' + value.id + '">' + value.institutionName + '</option>');
                
            });

        }

    });

});
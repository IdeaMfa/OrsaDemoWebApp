$(document).ready(function () {
    // Fetch countries when the page loads
    fetchLocations(0, '#country');

    // Event handler for country dropdown change
    $('#country').change(function () {
        var countryId = $(this).val(); // Get selected country ID
        if (countryId) {
            // Fetch cities based on selected country ID
            fetchLocations(countryId, '#city');
            $('#city').prop('disabled', false); // Enable the city dropdown
        } else {
            // Disable city dropdown and reset it if no country is selected
            $('#city').prop('disabled', true).empty().append('<option value="">Select City</option>');
        }
    });

    // Function to fetch locations based on ParentId
    function fetchLocations(parentId, dropdownId) {
        console.log("Fetching locations for ParentId:", parentId); // Debugging line
        $.ajax({
            url: '/GetLocation/GetLocation', // API endpoint
            type: 'GET',
            data: { ParentId: parentId }, // Send ParentId to the API
            success: function (data) {
                console.log("Data received:", data); // Debugging line
                var options = '<option value="">Select ' + (dropdownId === '#country' ? 'Country' : 'City') + '</option>';

                // Check if data is an array and process it
                if (Array.isArray(data)) {
                    $.each(data, function (index, location) {
                        console.log(location.regionName); // Debugging line
                        options += '<option value="' + location.id + '">' + location.regionName + '</option>';
                    });
                    $(dropdownId).html(options);

                    // Enable the dropdown if it has options
                    if (data.length > 0) {
                        $(dropdownId).prop('disabled', false);
                    }
                } else {
                    console.error("Unexpected data format:", data); // Debugging line
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX error:", status, error); // Debugging line
                console.error("XHR object:", xhr); // Debugging line
                alert('Error fetching locations.');
            }
        });
    }
});



/*$(document).ready(function () {

    $.ajax({

        url: '/GetLocation/GetLocation',
        type: 'GET',
        dataType: 'json',
        data: { ParentId: 1 },
        success: function (data) {
            console.log(data[0].parentId);
            console.log("Data received:", data); // Debugging line
            var options = '<option value="">Select Country </option>';
            $.each(data, function (index, location) {
                console.log(location.regionName);
                options += '<option value="' + location.id + '">' + location.regionName + '</option>';
            });
            $('#country').html(options);

            // Enable the dropdown if it has options
            if (data.length > 0) {
                $('#country').prop('disabled', false);
            }
            localStorage.removeItem(data);
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error); // Debugging line
            console.error("XHR object:", xhr); // Debugging line
            alert('Error fetching locations.');
        }
    });

    // Event handler for country dropdown change
    $('#country').change(function () {
        var countryId = parseInt($(this).val(), 10);
        if (countryId) {
            console.log(countryId);

            $.ajax({

                url: '/GetLocation/GetCity',
                type: 'GET',
                dataType: 'json',
                data: { ParentId: countryId },
                success: function (data) {
                    console.log(data[0].parentId);
                    console.log("Data received:", data); // Debugging line
                    var options = '<option value="">Select City </option>';
                    $.each(data, function (index, location) {
                        console.log(location.regionName);
                        options += '<option value="' + location.id + '">' + location.regionName + '</option>';
                    });
                    $('#city').html(options);

                    // Enable the dropdown if it has options
                    if (data.length > 0) {
                        $('#city').prop('disabled', false);
                    }
                    localStorage.removeItem(data);
                },
                error: function (xhr, status, error) {
                    console.error("AJAX error:", status, error); // Debugging line
                    console.error("XHR object:", xhr); // Debugging line
                    alert('Error fetching locations.');
                }
            });

            $('#city').prop('disabled', false); // Enable the city dropdown
        } else {
            $('#city').prop('disabled', true).empty().append('<option value="">Select City</option>');
        }
    });

})
*/


/*$(document).ready(function () {
    var apiBaseUrl = "https://localhost:44313/api/";

    // Ülke dropdown menüsünü doldur
    $.getJSON("https://localhost:5001/GetLocation/GetLocation", function (data) {
        var countryDropdown = $("#country");
        $.each(data, function (index, country) {
            countryDropdown.append(
                $("<option></option>").val(country.id).text(country.name)
            );
        });
    });

    // Ülke seçildiğinde şehir dropdown menüsünü doldur
    $("#country").change(function () {
        var countryId = $(this).val();
        var cityDropdown = $("#city");

        // Mevcut seçenekleri temizle
        cityDropdown.empty().append(
            $("<option></option>").val("").text("Şehir Seçin")
        );

        if (countryId) {
            $.getJSON(`https://localhost:5001/GetLocation/GetCity/${countryId}`, function (data) {
                $.each(data, function (index, city) {
                    cityDropdown.append(
                        $("<option></option>").val(city.name).text(city.name)
                    );
                });
            });
        }
    });
 
});
*/













/*
*/
/*
function fetchCity(parentId, dropdownId) {
    console.log("Fetching locations for ParentId:", parentId); // Debugging line
    $.ajax({

        url: '/GetLocation/GetLocation',
        type: 'GET',
        dataType: 'json',
        data2: { ParentId: parentId },
        success: function (data2) {
            console.log(data2[0].parentId);
            console.log(parentId);
            console.log("Data received:", data2); // Debugging line
            var options = '<option value="">Select ' + (dropdownId === '#country' ? 'Country' : 'City') + '</option>';
            $.each(data2, function (index, location) {
                console.log(location.regionName);
                options += '<option value="' + location.id + '">' + location.regionName + '</option>';
            });
            $(dropdownId).html(options);

            // Enable the dropdown if it has options
            if (data2.length > 0) {
                $(dropdownId).prop('disabled', false);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error); // Debugging line
            console.error("XHR object:", xhr); // Debugging line
            alert('Error fetching locations.');
        }
    });
}
*/


/*
$(document).ready(function () {
    // Fetch countries when the page loads
    fetchLocations(0, '#country');

    // Event handler for country dropdown change
    $('#country').change(function () {
        var countryId = $(this).val(); // Get selected country ID
        if (countryId) {
            // Fetch cities based on selected country ID
            fetchLocations(countryId, '#city');
            $('#city').prop('disabled', false); // Enable the city dropdown
        } else {
            // Disable city dropdown and reset it if no country is selected
            $('#city').prop('disabled', true).empty().append('<option value="">Select City</option>');
        }
    });

    // Function to fetch locations based on ParentId
    function fetchLocations(parentId, dropdownId) {
        console.log("Fetching locations for ParentId:", parentId); // Debugging line
        $.ajax({
            url: '/GetLocation/GetLocation', // API endpoint
            type: 'GET',
            data: { ParentId: parentId }, // Send ParentId to the API
            success: function (data) {
                console.log("Data received:", data); // Debugging line
                var options = '<option value="">Select ' + (dropdownId === '#country' ? 'Country' : 'City') + '</option>';

                // Check if data is an array and process it
                if (Array.isArray(data)) {
                    $.each(data, function (index, location) {
                        console.log(location.regionName); // Debugging line
                        options += '<option value="' + location.id + '">' + location.regionName + '</option>';
                    });
                    $(dropdownId).html(options);

                    // Enable the dropdown if it has options
                    if (data.length > 0) {
                        $(dropdownId).prop('disabled', false);
                    }
                } else {
                    console.error("Unexpected data format:", data); // Debugging line
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX error:", status, error); // Debugging line
                console.error("XHR object:", xhr); // Debugging line
                alert('Error fetching locations.');
            }
        });
    }
});
*/
$(document).ready(function () {
    var cities = {};
    var cityIdToCountries = {};

    // First AJAX request to fetch personnel data
    $.ajax({
        url: "/Request/ListPersonnels",
        type: "GET",
        dataType: "json"
    }).then(function (personnelData) {
        console.log("Personnel data fetched successfully:", personnelData);

        // Second AJAX request to fetch all locations
        return $.ajax({
            url: "/GetLocation/GetAllLocations",
            type: "GET",
            dataType: "json"
        }).then(function (locationData) {
            console.log("Location data fetched successfully:", locationData);

            // Populate locationsList
            locationData.forEach(function (location) {
                if (location.parentId !== 0) {
                    cities[location.id] = location.regionName;
                } else {
                    locationData.forEach(function (_location) {
                        if (_location.parentId === location.id) {
                            cityIdToCountries[_location.id] = location.regionName;
                        }
                    });
                }
            });

            // Initialize DataTable after locationsList is populated
            $("#dataTable").DataTable({
                data: personnelData,
                columns: [
                    { "data": 'id' },
                    { "data": 'name' },
                    { "data": 'surname' },
                    { "data": 'phoneNumber' },
                    { "data": 'email' },
                    {
                        "data": 'dateOfBirth',
                        "render": function (data) {
                            var date = new Date(data);
                            var day = date.getDate().toString().padStart(2, '0');
                            var month = (date.getMonth() + 1).toString().padStart(2, '0');
                            var year = date.getFullYear();
                            var today = new Date();
                            var age = today.getFullYear() - date.getFullYear();
                            var monthDiff = today.getMonth() - date.getMonth();

                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
                                age--;
                            }

                            return day + "-" + month + "-" + year + "<br>" + "Age: " + age;
                        }
                    },
                    {
                        "data": 'city',
                        "render": function (data) {
                            return data ? data : 'Unknown';
                        }
                    },
                    {
                        "data": 'country',
                        "render": function (data) {
                            return data ? data : 'Unknown';
                        }
                    },
                    {
                        "data": 'personnelInstitution',
                        "render": function (data) {
                            return data.lastInstitutionName ? data.lastInstitutionName : 'Unknown';
                        }
                    },
                    {
                        "data": 'personnelInstitution',
                        "render": function (data) {
                            if (data.lastInstitutionUrl == null) {
                                return 'Unknown';
                            } else {
                                return '<img src="/MediaLibrary/' + data.lastInstitutionUrl + '" class="media-img">';
                            }
                        }
                    },
                    {
                        "data": 'mediaLibrary',
                        "render": function (data, type, row) {
                            console.log("mediaLibrary data:", data);
                            var photoHtml = '';
                            if (Array.isArray(data) && data.length > 0 && data[0] != null) {
                                var lastMedia = data[data.length - 1];
                                console.log(lastMedia);
                                console.log(lastMedia.mediaUrl);
                                photoHtml = '<img src="/MediaLibrary/' + lastMedia.mediaUrl + '" class="media-img">';
                            } else {
                                photoHtml = 'No photos';
                            }
                            return photoHtml;
                        }
                    },
                    {
                        "data": 'id',
                        "render": function (data, type, row) {
                            return '<a type="button" class="btn btn-warning btn-sm mx-2" href="/UpdatePersonnel/PersonnelUpdatePage/' + row.id + '">Edit</a> <a type="button" class="btn btn-danger btn-sm mx-2" href="#' + row.id + '">Delete</a>';
                        }
                    }
                ]
            });
        }).fail(function (xhr, status, error) {
            console.error("Error while fetching location data:", status, error);
            alert('Error fetching location data.');
        });
    }).fail(function (xhr, status, error) {
        console.error("Error while fetching personnel data:", status, error);
        alert('Error fetching personnel data.');
    });
});

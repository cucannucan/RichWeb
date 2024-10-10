//display data in the table
function displayData(data) {
    const tableBody = document.getElementById('data-table');
    tableBody.innerHTML = '';  // Clear the table body before adding new rows

    data.forEach(person => {
        const nameParts = person.name.split(' ');
        const row = `<tr>
            <td>${nameParts[0]}</td>
            <td>${nameParts[1]}</td>
            <td>${person.id}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Synchronous XMLHttpRequest
function fetchDataSync() {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/reference.json', false);  // Synchronous request
        xhr.send();

        if (xhr.status === 200) {
            const referenceData = JSON.parse(xhr.responseText);
            let allData = [];

            // Fetch data1.json
            let data1Request = new XMLHttpRequest();
            data1Request.open('GET', 'data/' + referenceData.data_location, false);
            data1Request.send();
            if (data1Request.status === 200) {
                const data1 = JSON.parse(data1Request.responseText);
                allData = [...data1.data];
                
                // Fetch data2.json
                let data2Request = new XMLHttpRequest();
                data2Request.open('GET', 'data/' + data1.data_location, false);
                data2Request.send();
                if (data2Request.status === 200) {
                    const data2 = JSON.parse(data2Request.responseText);
                    allData = [...allData, ...data2.data];
                    
                    // Fetch data3.json
                    let data3Request = new XMLHttpRequest();
                    data3Request.open('GET', 'data/data3.json', false);
                    data3Request.send();
                    if (data3Request.status === 200) {
                        const data3 = JSON.parse(data3Request.responseText);
                        allData = [...allData, ...data3.data];

                        // Display all data
                        displayData(allData);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error during synchronous data fetch:", error);
    }
}

// Asynchronous XMLHttpRequest with Callbacks
function fetchDataAsync() {
    const request = new XMLHttpRequest();
    request.open('GET', 'data/reference.json', true);
    request.onload = function() {
        if (request.status === 200) {
            const referenceData = JSON.parse(request.responseText);

            fetchFileAsync('data/' + referenceData.data_location, function(data1) {
                fetchFileAsync('data/' + data1.data_location, function(data2) {
                    fetchFileAsync('data/data3.json', function(data3) {
                        const allData = [...data1.data, ...data2.data, ...data3.data];
                        displayData(allData);
                    });
                });
            });
        }
    };
    request.send();
}

// Helper function for async requests
function fetchFileAsync(url, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status === 200) {
            const data = JSON.parse(request.responseText);
            callback(data);
        }
    };
    request.send();
}

// Fetch API with Promises
function fetchDataFetch() {
    fetch('data/reference.json')
        .then(response => response.json())
        .then(referenceData => {
            return fetch('data/' + referenceData.data_location)
                .then(response => response.json())
                .then(data1 => {
                    return fetch('data/' + data1.data_location)
                        .then(response => response.json())
                        .then(data2 => {
                            return fetch('data/data3.json')
                                .then(response => response.json())
                                .then(data3 => {
                                    const allData = [...data1.data, ...data2.data, ...data3.data];
                                    displayData(allData);
                                });
                        });
                });
        })
        .catch(error => console.error('Error during fetch():', error));
}

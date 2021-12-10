const APIKEY = '96342a0cd031f214e5d9cb089eb89977';

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&appid={API key}
                          
// {
//     "coord": {
//       "lon": -122.08,
//       "lat": 37.39
//     },
//     "weather": [
//       {
//         "id": 800,
//         "main": "Clear",
//         "description": "clear sky",
//         "icon": "01d"
//       }
//     ],
//     "base": "stations",
//     "main": {
//       "temp": 282.55,
//       "feels_like": 281.86,
//       "temp_min": 280.37,
//       "temp_max": 284.26,
//       "pressure": 1023,
//       "humidity": 100
//     },
//     "visibility": 16093,
//     "wind": {
//       "speed": 1.5,
//       "deg": 350
//     },
//     "clouds": {
//       "all": 1
//     },
//     "dt": 1560350645,
//     "sys": {
//       "type": 1,
//       "id": 5122,
//       "message": 0.0139,
//       "country": "US",
//       "sunrise": 1560343627,
//       "sunset": 1560396563
//     },
//     "timezone": -25200,
//     "id": 420006353,
//     "name": "Mountain View",
//     "cod": 200
//     }                         

// icon: https://openweathermap.org/img/wn/{10d}@2x.png

/** Search Function to get a latitude and longitude from a city string */
function searchForLocation(input) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${APIKEY}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log("geocoding", JSON.stringify(data));
        // Handle error response
        if (data.cod >= 400) {
            throw data.message;
        }

        // TODO: allow user to select from results
        
        return weatherByLocation(data[0].lat, data[0].lon);
    })
    .catch(function(error) {
        // Handle error response
        console.error('Error:', error);
        window.alert(error);
    })
}

/** Gets the weather from the onecall api for a latitude and longitude */
function weatherByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=Imperial&appid=${APIKEY}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        // Handle error response
        if (data.cod >= 400) {
            throw data.message;
        }


    })
    .catch(function(error) {
        // Handle error response
        console.error('Error:', error);
        window.alert(error);
    })
}

/** Input Handler */
function searchHandler(event) {
    event.preventDefault();
    console.log("submitted");
    var searchValue = $('#search-input').val();
    searchForLocation(searchValue);
}

/** Add submit handler to search box */
$('form').submit(searchHandler);
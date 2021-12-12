const APIKEY = '96342a0cd031f214e5d9cb089eb89977';

var city = "Portland"; // currently selected city
var date = new moment(); // current date
var cities = []; // list of city buttons from localStorage

var currentEl = $('#today');
var citiesContainerEl = $('#saved-cities');
var forecastContainerEl = $('#forecast');

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

        city = data[0].name;

        if ( !cities.includes(city) ) {
            cities.unshift(city);
        }

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

        // Update the page with the response data
        displayWeather(data);
    })
    .catch(function(error) {
        // Handle error response
        console.error('Error:', error);
        window.alert(error);
    })
}

/** Converts dt to a moment */
function dtToMoment(dt) {
    return moment(parseInt(dt + "000")); // need to add milliseconds to dt propert
}

/** Displays the city */
function displayCity(cityString) {

}

/** Displays the city buttons */
function displayCityButtons(citiesArray) {

}

/** Displays the weather on the page */
function displayWeather(data) {
    // clear elements

    currentEl.empty();
    forecastContainerEl.empty();

    // Set Current
    currentEl.append(buildMainWeatherCard(data.current));

    // Set 5-day forecast
    for (var i = 0; i < 5; i++) {
        let card = buildForecastWeatherCard(data.daily[i]);
        forecastContainerEl.append(card);
    }
    
}

/** Build main weather card */
function buildMainWeatherCard(data) {
    console.log('building main weather card');
    let date = dtToMoment(data.dt);
    return $(`
    <h3>
        <span>${city}</span>
        <span>(${date})</span>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}"></img>
    </h3>
    <div>Temp: ${data.temp}˚</div>
    <div>Wind: ${data.wind_speed} MPH</div>
    <div>Humidity: ${data.humidity}%</div>
    <div>UV Index: ${data.uvi}</div>
    `);
}


/** Builds each separate forecast weather card */
function buildForecastWeatherCard(data) {
    console.log('building forecast');
    let date = dtToMoment(data.dt);
    return $(`
    <div class="cell card small-12 medium-auto">
        <div>${date}</div>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}"></img>
        <div>Temp: ${data.temp}˚</div>
        <div>Wind: ${data.wind_speed} MPH</div>
        <div>Humidity: ${data.humidity}%</div>
    </div>
    `);
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
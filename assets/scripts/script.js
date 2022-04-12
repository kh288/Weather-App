var userForm = $("#input-form");
var userInput = $("#user-search");
var searchButton = $("#search-button");
var searchHistory = $("#search-history");
var currentDate = moment().format("(MM/DD/YYYY)");

var locations = [];

const dailyResults = $("#daily-results");
const forecastResults = $("#forecast-results");
var clearButton = $("#button-clear");

// var lat = 0;
// var lon = 0;
// var uvi = 0;

const apiKey = "432a869893a494f470cf1cd147c88c43";

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// GENERATE CONTENT ONCE WITH LINK
// ONCE CONTENT IS GENERATED
    // EVERY OTHER SEARCH AFTER WILL REPLACE THOSE VARIABLES INSTEAD OF GENERATE
// GET SEARCH, BUTTON TO WORK INSTEAD OF JUST PRESSING ENTER

// Gets the information from the web link
function getWeatherAPI (apiInputLink) {
    console.log("Contacting " + apiInputLink + "...");
    fetch(apiInputLink)
    .then(function (response) {
        return response.json();
    })
    .then(function(data){
    if (data.cod !== '404') {
        // Read forecast data with lat/lon
        var foreCastLink = "https://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&units=imperial&exclude=alerts,hourly,minutely,current&appid="+apiKey;
        fetch(foreCastLink)
        .then(function(response2) {
            return response2.json();
        })
        .then(function(data2){ 
            if (data.cod !== '404') {
                console.log(data);
                console.log(data2);
                showCardResults(true, data, data2);
                showForeCastResults(data2);
                return;
            }
        })
    } else {
        // IF INPUT IS BAD THEN DO THIS:
        showCardResults(false, 0, 0); // SHOW CARD RESULTS WITH AN ERROR
        return;
    }
    })
}

function getForecastAPI (apiInputLink) {
    fetch(apiInputLink)
    .then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        console.log("Day 0:" + data.daily[0].uvi);
        return data;
    })
}

function getForecast(lat, lon) {
    // var foreCastLink = https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&units=imperial&appid={API key}
    var foreCastLink = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=alerts,hourly,minutely,current&appid="+apiKey;
    // console.log("FORECAST LINK INFORMATION: " + foreCastLink);
    // getForecastAPI(foreCastLink);
    return foreCastLink;
    // return ;
}

// Gets the search information from the user then sends it to the getWeather function
function getSearchInput(event) {
    // Get input from user and push it into the getWeatherAPI function
    // Get input from user
    event.preventDefault();
    console.log("Successfully submitted user input");
    var input = userInput.val();
    var link = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=" + apiKey;
    
    getWeatherAPI(link);
}

// Generates content upon recieving the search results input
function showCardResults(input, data, data2) {
    // When receiving proper results:

    // var forecast = getForecastAPI(getForecast(lat, lon));
    // console.log("FORECAST OUTPUT: " + forecast);

    if (input && data !== 0) {
        // Then print results and return
        // console.log("User input was truthy, and valid");
        // console.log(data.name);
        // clear old elements before generating new ones :ok_hand:
        dailyResults.empty();

        // CREATE CARD DIV, APPEND ALL NEW DIVS TO THIS
        var cardGroup = $("<div class='bg-white text-dark card my-3 p-3'>");
            var cardInfoName = $("<h3>");

            if(locations.includes(data.name)) {
                // IF ITEM IS ALREADY IN LOCATIONS ARRAY THEN WE MOVE IT TO THE TOP
                locations.splice (locations.indexOf(data.name), 1); // removes item 
                locations.unshift(data.name); // places it on top
                // Save current array into local storage
                saveSearchLocal();
            } else {
                // If it doesn't include that element, we put it in the back.
                locations.push(data.name);

                // Save current array into local storage
                saveSearchLocal();
            }

            var iconTag = $("<img src='" + "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'>");
            cardInfoName.text(data.name + " " + currentDate);
            iconTag.appendTo(cardInfoName);
            cardInfoName.appendTo(cardGroup);
            // TEMP
            var cardInfoTemp = $("<p>");
            cardInfoTemp.text("Temperature: " + data.main.temp + "°F");
            cardInfoTemp.appendTo(cardGroup);
            // HUMIDITY
            var cardInfoHumidity = $("<p>");
            cardInfoHumidity.text("Humidity: " + data.main.humidity + "%");
            cardInfoHumidity.appendTo(cardGroup);
            // WIND SPEED
            var cardInfoWindSpeed = $("<p>");
            cardInfoWindSpeed.text("Wind Speed: " + data.wind.speed + " MPH");
            cardInfoWindSpeed.appendTo(cardGroup);
            // UV INDEX
            var cardInfoUvIndex = $("<p>");
            cardInfoUvIndex.text("UV Index: " + data2.daily[0].uvi);
            cardInfoUvIndex.appendTo(cardGroup);
        // NOW THAT WE CREATED AND APPENDED THEM TO THE MAIN CARD...
        // APPEND THAT CARD TO THE RESULTS DIV
        cardGroup.appendTo(dailyResults);
        loadSearchLocal();
        showHistory();
    } else {
        console.log("Generating error message");
    
        var cardGroup = $("<div class='text-dark card p-3 m-3'>");
        var cardTitleEl = $("<h3>");
        cardTitleEl.text("Invalid City, try again");
        cardTitleEl.appendTo(cardGroup);
        cardGroup.appendTo(dailyResults);
    }
}

function showForeCastResults(data) {
    console.log("DATA I CARE ABOUT RN:");
    console.log(data);

    forecastResults.empty();
    $("#forecast-title").attr("style","display: initial");
    // var today = moment().format("(MM/DD/YYYY)");

    // Look at the weather at the NEXT 5 days
    for (i = 1; i <= 5; i++) {
        var cardGroup = $("<div class='bg-primary text-light card my-3 p-3'>");
            var date = $("<h6>");
            var time = moment().add(i, 'days');
            date.text(time.format("(MM/DD/YYYY)"));
            date.appendTo(cardGroup);
    
            var ico = $("<img style='width: min-content' src='" + "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png'>");
            ico.appendTo(cardGroup);
    
            var temp = $("<p>");
            temp.text("Temp: " + data.daily[i].temp.day);
            temp.appendTo(cardGroup);
    
            var hum = $("<p>");
            hum.text("Humidity: " + data.daily[i].humidity);
            hum.appendTo(cardGroup);

            cardGroup.appendTo(forecastResults);
    }
    return;
}

// Saves from locations array to local storage
function saveSearchLocal() {
    localStorage.setItem("locations", locations);
    loadSearchLocal();
}
// Loads items from localstorage to locations array
function loadSearchLocal() {
    if (localStorage.getItem("locations")) {
        // IF THERES A VALUE HERE, LOAD INFO INTO locations variable
        locations = localStorage.getItem("locations")
        locations = locations.split(",");
    }
}

function showHistory() {
    if (locations[0]) {
        console.log("LOCATIONS HAS ITEMS");
        searchHistory.empty();
        // ITERATE THROUGH LOCATIONS VARIABLE AND MAKE BUTTONS FOR EACH INSTANCE IN THE ARRAY
        // for(i = locations.length - 1 ; i >= 0; i--) {
        // }
        for (i = 0; i < locations.length; i++) {
            var cardForm = $("<form id='"+ locations[i] +"' class='input-group'>");
            var cardInfoName = $("<p class='input-group btn btn-light bg-white mb-1 p-2'>");
            cardInfoName.text(locations[i]);
            cardInfoName.appendTo(cardForm);
            cardForm.appendTo(searchHistory);
            // append to searchHistory when done creating item.\
        }
    }
}

function clearItems() {
    locations = [];
    localStorage.clear();
    searchHistory.empty();
}

loadSearchLocal();
showHistory();
// Triggers the search function upon search activation

// $(".input-group").on("click",getSearchInput);
userForm.on('submit',getSearchInput);
clearButton.on('click',clearItems);
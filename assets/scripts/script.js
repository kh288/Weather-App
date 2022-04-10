var userForm = $("#input-form");
var userInput = $("#user-search");
var searchHistory = $("#search-history");
var currentDate = moment().format("(MM/DD/YYYY)");

var locations = [];

var dailyResults = $("#daily-results");
const forecastResults = $("#forecast-results");

const apiKey = "432a869893a494f470cf1cd147c88c43";

// GENERATE CONTENT ONCE WITH LINK
// ONCE CONTENT IS GENERATED
    // EVERY OTHER SEARCH AFTER WILL REPLACE THOSE VARIABLES INSTEAD OF GENERATE
// GET SEARCH, BUTTON TO WORK INSTEAD OF JUST PRESSING ENTER

// Gets the information from the web link
function getWeatherAPI (apiInputLink) {
    console.log("Contacting " + apiInputLink + "...")
    fetch(apiInputLink)
    .then(function (response) {
        return response.json();
    }).then(function(data){
        console.log(data);
            if (data.cod !== '404') {
                console.log("Data is truthy!");
                showCardResults(true, data); // SHOW CARD RESULTS WITH ACTUAL RESULTS
                return;
            }
            console.log("Invalid Response");
            showCardResults(false); // SHOW CARD RESULTS WITH AN ERROR
            return;
        })
}

// Gets the search information from the user then sends it to the getWeather function
function getSearchInput(event) {
    // Get input from user and push it into the getWeatherAPI function
    // Get input from user
    event.preventDefault();
    console.log("Successfully submitted user input");
    // userinput.splice(" ", "%20");
    // var input = userInput.splice(" ", "%20");
    var input = userInput.val();
    // input = input.splice(" ", "%20");

    // var link = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=" + apiKey;
    // var geolink = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&appid={API key}";
    // var foreCastLink = https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    
    var link = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=imperial&appid=" + apiKey;
    
    getWeatherAPI(link);
}

// Generates content upon recieving the search results input
function showCardResults(input, data) {
    // When receiving proper results:
    if (input) {
        // Then print results and return
        console.log("User input was truthy, and valid");
        console.log(data.name);
        // clear old elements before generating new ones :ok_hand:
        dailyResults.empty();

        // CREATE CARD DIV, APPEND ALL NEW DIVS TO THIS
        var cardGroup = $("<div class='bg-white text-dark card my-3 p-3'>");
            // NAME
            var cardInfoName = $("<h3>");
            // INSERT CARDINFO NAME INTO A FUNCTION THAT GRABS THIS AS A SEARCH FOR THE FUTURE.
            if (locations.includes(data.name) === false) {
                saveSearchLocal(data.name);
                console.log("SAVING: " + data.name);
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
            cardInfoUvIndex.text("UV Index: ");
            cardInfoUvIndex.appendTo(cardGroup);
        // NOW THAT WE CREATED AND APPENDED THEM TO THE MAIN CARD...
        // APPEND THAT CARD TO THE RESULTS DIV
        cardGroup.appendTo(dailyResults);
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

function saveSearchLocal(previousSearch) {
    locations.push(previousSearch);
    localStorage.setItem("locations", locations);
}

function loadSearchLocal() {
    if (localStorage.getItem("locations")) {
        // IF THERES A VALUE HERE, LOAD INFO INTO locations variable
        locations = localStorage.getItem("locations")
        locations = locations.split(",");
        return;
    }
    // localStorage.getItem().getLength();
}

function showHistory() {
    if (locations[0]) {
        console.log("LOCATIONS HAS ITEMS");
        searchHistory.empty();
        for(i = 0; i < locations.length; i++) {
            var cardGroup = $("<div class='bg-white text-center text-dark card mb-1 p-2'>");
            var cardInfoName = $("<h5>");
            cardInfoName.text(locations[i]);
            cardInfoName.appendTo(cardGroup);

            cardGroup.appendTo(searchHistory);
            // append to searchHistory when done creating item.

        }
    } else{
        console.log("LOCATIONS IS EMPTY")
    }
}

loadSearchLocal();
showHistory();
// Triggers the search function upon search activation
userForm.on('submit',getSearchInput);
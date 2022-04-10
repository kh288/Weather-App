var userForm = $("#input-form");
var userInput = $("#user-search");

const dailyResults = $("#daily-results");
const forecastResults = $("#forecast-results");

const apiKey = "432a869893a494f470cf1cd147c88c43";
var weatherTest = "https://api.openweathermap.org/data/2.5/weather?q=San%20Francisco&units=imperial&appid=432a869893a494f470cf1cd147c88c43";
// https://api.openweathermap.org/data/2.5/weather?q=San%20Francisco&units=imperial&appid=432a869893a494f470cf1cd147c88c43

function getWeatherAPI (apiInputLink) {
    console.log("Contacting openweathermap.org...")
    fetch(apiInputLink)
    .then(function (response) {
        if (!(response.status == 200)) {
            // console.log(response);
            console.log("Invalid Response");
            showCardResults(false); // SHOW CARD RESULTS WITH AN ERROR
            return;
        }
        console.log("Successful response!");
        
        return response.json();
        }).then(function(data){
            // console.log(data);
            // console.log("data.name: " + data.name);
            showCardResults(true, data); // SHOW CARD RESULTS WITH ACTUAL RESULTS
        })
}

function getSearchInput(event) {
    // Get input from user and push it into the getWeatherAPI function
    // Get input from user
    event.preventDefault();
    console.log("Success submit");
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

function showCardResults(input, data) {
    // When receiving proper results:
    if (input) {
        // Then print results and return
        return;
    } else {
        console.log("Generating error message");
    
        var cardEl = $("<div class='text-dark card p-3 m-3'>");
        var cardTitleEl = $("<h3>");
        cardTitleEl.text("Invalid City, try again");
        cardTitleEl.appendTo(cardEl);
        cardEl.appendTo(dailyResults);
    }
}

// console.log(getWeatherAPI(weatherTest));
userForm.on('submit', getSearchInput);
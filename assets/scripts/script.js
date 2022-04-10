var test = $("#test");
var apiKey = "appid=432a869893a494f470cf1cd147c88c43";
var weatherTest = "https://api.openweathermap.org/data/2.5/weather?q=San%20Francisco&units=imperial&" + apiKey;
// https://api.openweathermap.org/data/2.5/weather?q=San%20Francisco&units=imperial&appid=432a869893a494f470cf1cd147c88c43
function getWeatherAPI (apiInputLink) {
    console.log("Contacting openweathermap.org...")
    fetch(apiInputLink)
    .then(function (response) {
        if (response.status == 200) {
            console.log("Successful response!");
            return response.json();
        }
        }).then(function(data){
            console.log(data);
            console.log("data.name: " + data.name);
        })
}

function getSearchInput() {
    // Get input from user and push it into the getWeatherAPI function
    // Get input from user
    // userinput.splice(" ", "%20");
    var link =  "https://api.openweathermap.org/data/2.5/weather?q=" +
                "San%20Francisco" +
                "&units=imperial&appid=" +
                apiKey;
}

getWeatherAPI(weatherTest);

// console.log(weatherTest);
test.append("Test text");
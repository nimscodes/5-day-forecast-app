const SEARCH = document.getElementById('search-button');
const HISTORY = document.getElementById('history');
const FORECAST = document.getElementById('forecast');

//apikey safely stored in a hiddenly js file 
const APIKEY = config.APIKEY;

// retreive history from local storage
const history = JSON.parse(localStorage.getItem('history')) || [];

// function to clear any content when passed an elementid
function clearContent(elementID){
    document.getElementById(elementID).innerHTML = "";
}

// display weather forecast based on user argument
function renderForecast(city) {

    const queryURL = `https://api.openweathermap.org/data/2.5/forecast/?q=${city}&units=metric&cnt=40&appid=${APIKEY}`;
    $.ajax({
        url: queryURL
    }).then(function(response){
        console.log(response);
        const forecast = response.list;
        const cityName = response.city.name;
        const todaysDate = moment(new Date()).format("DD-MM-YYYY");
        console.log(todaysDate);
        const forecastArr = [];
        for (let i = 0; i < forecast.length; i += 8) {
            forecastArr.push(forecast[i]);
        }

        console.log(forecastArr);
        const tempInDegrees = forecastArr[0].main.temp;
        const humidity = forecastArr[0].main.humidity;
        const windSpeed = forecastArr[0].wind.speed;
        const weatherIcon = forecastArr[0].weather[0].icon;
        const iconurl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
        $('#today').append(`
            <h5 class="mt-2">5-day weather forecast:</h5>
        `)
        $('#today').append(`
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">${cityName} (${todaysDate})<img src=${iconurl} alt="weather icon"></h5>
                <p class="card-text">Temp: ${tempInDegrees}&#8451;</p>
                <p class="card-text">Wind: ${windSpeed}KPH</p>
                <p class="card-text">Humidity: ${humidity}%</p>
                </div>
            </div>
        `)
        
        for (let i = 0; i < forecastArr.length; i++) {
            const new_date = moment(new Date()).add(i, 'd').format("DD-MM-YYYY");
            const weatherIcon = forecastArr[i].weather[0].icon;
            const iconurl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
            const tempInDegrees = forecastArr[i].main.temp;
            const humidity = forecastArr[i].main.humidity;
            // clearContent('forecast');
            $('#forecast').append(`
                <div class="card bg-primary mr-2 mb-2 p-2 text-white" style = "width: 11rem;">
                    <div class="card-body">
                    <h5 class="card-title">${new_date}</h5>
                    <p class="card-text"><img src=${iconurl} alt="weather icon"></p>
                    <p class="card-text">Temp: ${tempInDegrees}&#8451;</p>
                    <p class="card-text">Humidity: ${humidity}%</p>
                    </div>
                </div>
            `)
        }


    })
}

// display search history of user
function renderHistoryButtons(){
    $("#history").empty();

   // Loops through the array of history
   for (var i = 0; i < history.length; i++) {
     const cityButton = $("<button>");
     cityButton.addClass("btn btn-block btn-secondary city");
     cityButton.attr("data-name", history[i]);
     cityButton.text(history[i]);
     $("#history").append(cityButton)
   }
}

// initialize app
function init(){
    renderHistoryButtons();
}

init();

SEARCH.addEventListener('click', (event) => {
    event.preventDefault();
    const userInput = $('#search-input').val().trim();
    if(!history.includes(userInput)){
        history.push(userInput);
    }
    localStorage.setItem('history', JSON.stringify(history))
    renderForecast(userInput);
    renderHistoryButtons();
})

$('#clear-button').on('click', function(e){
    e.preventDefault();
    clearContent('history');
    localStorage.removeItem('history');
})



$(document).on('click', '.city', function(e){
    e.preventDefault();
    let cityName = $(this).attr("data-name");
    renderForecast(cityName);
})



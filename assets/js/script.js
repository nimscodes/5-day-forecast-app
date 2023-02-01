
//apikey safely stored in a hiddenly js file 
const APIKEY = "dcaf47b710d76b6837dcc43dd5aaf5c9";

// retreive history from local storage
const history = JSON.parse(localStorage.getItem('history')) || [];

// function to clear any content when passed an elementid
function clearContent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function getDay(day) {
    let dayinWords = "";

    switch (day) {
        case 0:
            dayinWords = "Sunday"
            break;
        case 1:
            dayinWords = "Monday"
            break;
        case 2:
            dayinWords = "Tuesday"
            break;
        case 3:
            dayinWords = "Wednesday"
            break;
        case 4:
            dayinWords = "Thursday"
            break;
        case 5:
            dayinWords = "Friday"
            break;
        case 6:
            dayinWords = "Saturday"
            break;
        default:
            break;
    }
    if(day === moment(new Date()).day()){
        dayinWords = "Today";
    }

    return dayinWords;
}

// display weather forecast based on user argument
function renderForecast(city) {
    $('#today').empty();
    $('#forecast').empty();
    $('#forecast-header').empty();
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast/?q=${city}&units=metric&cnt=40&appid=${APIKEY}`;
    $.ajax({
        url: queryURL
    }).then(function (response) {
        const forecast = response.list;
        const cityName = response.city.name;
        const todaysDate = moment(new Date()).format("DD-MM-YYYY");
        const forecastArr = [];
        for (let i = 0; i < forecast.length; i += 8) {
            forecastArr.push(forecast[i]);
        }

        const tempInDegrees = forecastArr[0].main.temp;
        const humidity = forecastArr[0].main.humidity;
        const windSpeed = forecastArr[0].wind.speed;
        const weatherIcon = forecastArr[0].weather[0].icon;
        const iconurl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";

        $('#today').append(`
            <div class="card rounded-0">
                <div class="card-header py-0">
                    <h5 class="card-title">${cityName} (${todaysDate})<img src=${iconurl} alt="weather icon"></h5>
                </div>
                <div class="card-body">
                    <p class="card-text">Temp: ${tempInDegrees}&#8451;</p>
                    <p class="card-text">Wind: ${windSpeed}KPH</p>
                    <p class="card-text">Humidity: ${humidity}%</p>
                </div>
            </div>
        `)
        $('#forecast-header').text = "5-DAY WEATHER FORCAST:"
        for (let i = 0; i < forecastArr.length; i++) {
            const new_date = getDay(moment(new Date()).add(i, 'd').day());
            const weatherIcon = forecastArr[i].weather[0].icon;
            const iconurl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
            const tempInDegrees = forecastArr[i].main.temp;
            const humidity = forecastArr[i].main.humidity;
            // clearContent('forecast');

            $('#forecast').append(`
                <div class="card bg-primary mr-2 mb-2 p-0 text-white text-center rounded-0";">
                    <div class="card-header py-1">
                        <h5 class="card-title">${new_date}</h5>
                    </div>
                    <div class="card-body">
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
function renderHistoryButtons() {
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
function init() {
    renderHistoryButtons();
}

init();

SEARCH.addEventListener('click', (event) => {
    event.preventDefault();


    const userInput = $('#search-input').val().trim();
    if (userInput !== "" && !history.includes(userInput)) {
        history.push(userInput);
        localStorage.setItem('history', JSON.stringify(history));
        renderForecast(userInput);
        renderHistoryButtons();
    }

})

$('#clear-button').on('click', function (e) {
    e.preventDefault();
    clearContent('history');
    localStorage.removeItem('history');
})



$(document).on('click', '.city', function (e) {
    e.preventDefault();
    let cityName = $(this).attr("data-name");
    renderForecast(cityName);
})



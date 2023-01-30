const SEARCH = document.getElementById('search-button');
const HISTORY = document.getElementById('history');
const FORECAST = document.getElementById('forecast');

const APIKEY = "88f2e9603106d9234412cf3c047c4822"


function renderTodaysWeather(userInput) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=Leicester&appid=${APIKEY}`
    $.ajax({
        url: queryURL
    }).then(response => {
        console.log(response);
        const cityName = response.name;
        const todaysDate = moment().format("DD/MM/YYYY");
        const weatherIcon = response.weather[0].icon;
        const iconurl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
        const tempInDegrees = response.main.temp - 273.15;
        const humidity = response.main.humidity;
        const windSpeed = response.wind.speed;

        $('#today').append(`
        <div class="card">
            <div class="card-body">
            <h5 class="card-title">${cityName} (${todaysDate})<img src=${iconurl} alt="weather icon"></h5>
            <p class="card-text">Temp: ${tempInDegrees.toFixed(2)}&#8451;</p>
            <p class="card-text">Wind: ${windSpeed}KPH</p>
            <p class="card-text">Humidity: ${humidity}%</p>
            </div>
        </div>
        `)
    })
}

renderTodaysWeather();

SEARCH.addEventListener('click', (event) => {
    event.preventDefault();
    const userInput = $('#search-input').val().trim();
    renderTodaysWeather(userInput);
})
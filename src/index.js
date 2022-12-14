let currentDate = new Date();

let currentMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dez",
];
let month = currentMonths[currentDate.getMonth()];

let currentDay = currentDate.getDate();

let currentWeekDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekDay = currentWeekDay[currentDate.getDay()];

let currentHour = currentDate.getHours();
if (currentHour < 10) {
  currentHour = `0${currentHour}`;
}
let currentMinute = currentDate.getMinutes();
if (currentMinute < 10) {
  currentMinute = `0${currentMinute} `;
}

let newMonth = document.querySelector("#month-day");
newMonth.innerHTML = `${month}  ${currentDay} `;

let weekDayNow = document.querySelector("#week-day");
weekDayNow.innerHTML = `${weekDay}`;

let currentTime = document.querySelector("#hour");
currentTime.innerHTML = `${currentHour} : ${currentMinute}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col">
        <div class="weather-forecast-day">${formatDay(forecastDay.dt)}</div>
      <img 
      src = "http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" alt = "">
        <div class="weather-forecast-temperature">
          <span class="max-temperarure">
          ${Math.round(forecastDay.temp.max)}°</span>/
          <span class="min-temperature">
          ${Math.round(forecastDay.temp.min)}°</span>
        </div>
      </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "2bc6b4fefdb04abbb3ef0da316d15f59";
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function getWeather(response) {
  let weather = Math.round(response.data.main.temp);
  let city = response.data.name;
  let wind = Math.round(response.data.wind.speed);
  let humidity = response.data.main.humidity;
  let description = response.data.weather[0].description;
  let icon = response.data.weather[0].icon;

  celsiusTemperature = response.data.main.temp;

  let newTemperature = document.querySelector("#temperature");
  newTemperature.innerHTML = `${weather}`;

  let newCity = document.querySelector("#city");
  newCity.innerHTML = `${city}`;

  let newDescription = document.querySelector("#description");
  newDescription.innerHTML = `${description}`;

  let newHumidity = document.querySelector("#humidity");
  newHumidity.innerHTML = `Humidity: ${humidity}%`;

  let newWind = document.querySelector("#wind");
  newWind.innerHTML = `Wind: ${wind}mph`;

  let newIcon = document.querySelector("#icon");
  newIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  newIcon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "2bc6b4fefdb04abbb3ef0da316d15f59";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);
}

function newCity(event) {
  event.preventDefault();
  let cityName = document.querySelector("#city-name");
  search(cityName.value);
}
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "2bc6b4fefdb04abbb3ef0da316d15f59";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(getWeather);
}

function currentLocationWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", currentLocationWeather);

let form = document.querySelector("#enter-city");
form.addEventListener("submit", newCity);

search("London");

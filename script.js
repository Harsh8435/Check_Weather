
const API_KEY = '2c086b11e3914c87a9e122353252905';      //API key

// --------------------------Function to handle the search by city input
function getWeatherByCity() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    alert('Please enter a valid city name.');
    return;
  }
  fetchWeather(city);
  addRecentCity(city);
}

//------------------------Function to handle the search by current location

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    }, () => {
      alert('Location access denied.');
    });
  } else {
    alert('Geolocation not supported.');
  }
}

//--------------- Function to handle the recent search dropdown selection

function handleRecentSearch() {
  const selectedCity = document.getElementById('recentDropdown').value;
  fetchWeather(selectedCity);
}

//------------------ Event listeners for the buttons

function fetchWeather(city) {
  const output = document.getElementById('weatherResult');
  output.innerHTML = 'Loading...';

  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`)
    .then(response => response.json())
    .then(data => {
      renderWeatherData(data);
    })
    .catch(err => {
      output.innerHTML = `<p class="text-red-500">Error: ${err.message}</p>`;
    });
}

//---------------- Function to fetch weather data by coordinates

function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5`)
    .then(response => response.json())
    .then(data => {
      renderWeatherData(data);
    })
    .catch(err => {
      document.getElementById('weatherResult').innerHTML = `<p class="text-red-500">Error: ${err.message}</p>`;
    });
}

//-------------------- Function to render the weather data on the page

function renderWeatherData(data) {
  const output = document.getElementById('weatherResult');
  const { name, localtime } = data.location;
  const { temp_c, condition, humidity, wind_kph } = data.current;
  output.innerHTML = `
    <h2 class="text-xl font-bold">${name} (${localtime.split(' ')[0]})</h2>
    <p>Temperature: ${temp_c}°C</p>
    <p>Wind: ${wind_kph} M/S</p>
    <p>Humidity: ${humidity}%</p>
    <div class="mt-2 flex items-center">
      <img src="https:${condition.icon}" alt="icon" class="w-10 h-10"/>
      <span class="ml-2">${condition.text}</span>
    </div>
  `;
  renderForecast(data.forecast.forecastday);
}

//--------------------- Function to render the forecast data

function renderForecast(days) {
  const forecast = document.getElementById('forecast');
  forecast.innerHTML = '';
  days.forEach(day => {
    forecast.innerHTML += `
      <div class="bg-gray-200 p-4 rounded shadow text-center">
        <p class="font-bold">(${day.date})</p>
        <img src="https:${day.day.condition.icon}" alt="icon" class="mx-auto w-10 h-10"/>
        <p>Temp: ${day.day.avgtemp_c}°C</p>
        <p>Wind: ${day.day.maxwind_kph} M/S</p>
        <p>Humidity: ${day.day.avghumidity}%</p>
      </div>
    `;
  });
}

// -------------------------Function to add a city to the recent searches and update the dropdown

function addRecentCity(city) {
  let recent = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!recent.includes(city)) {
    recent.unshift(city);
    if (recent.length > 5) recent.pop();
    localStorage.setItem('recentCities', JSON.stringify(recent));
  }
  updateDropdown();
}

// ***************Function to update the recent cities dropdown

function updateDropdown() {
  const recent = JSON.parse(localStorage.getItem('recentCities')) || [];
  const dropdown = document.getElementById('recentDropdown');
  const container = document.getElementById('recentCities');
  dropdown.innerHTML = '';
  if (recent.length > 0) {
    container.classList.remove('hidden');
    recent.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      dropdown.appendChild(option);
    });
  } else {
    container.classList.add('hidden');
  }
}

// ********************Initialize the recent cities dropdown on page load

window.onload = updateDropdown;

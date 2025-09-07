async function fetchWeather() {
  const searchInput = document.getElementById('search').value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  const apiKey = "a8e2d8dd718be9774830bf4fc2eaaf56";

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  try {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
    const geoResponse = await fetch(geocodeURL);
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>City Not Found</h2>
          <p>Please enter a valid city name.</p>
        </div>
      `;
      return;
    }

    const { lat, lon, name } = geoData[0];

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" 
           alt="${weatherData.weather[0].description}" width="100" />
      <div>
        <h2>${name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp)}°C</p>
        <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
      </div>
    `;

  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherDataSection.innerHTML = `
      <div>
        <h2>Error!</h2>
        <p>Could not fetch weather data at this moment. Try again later.</p>
      </div>
    `;
  }

  document.getElementById('search').value = "";
}

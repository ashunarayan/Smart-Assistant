const axios = require("axios");

async function execute({ city }) {
  try {
    if (!city || city.trim() === "") {
      return { error: "City name is required." };
    }

    console.log(` Fetching weather info for: ${city}...`);

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: apiKey,
        units: "metric", 
      },
    });

    const data = response.data;
    const weather = {
      location: `${data.name}, ${data.sys.country}`,
      temperature: `${data.main.temp}°C`,
      feels_like: `${data.main.feels_like}°C`,
      condition: data.weather[0].description,
      humidity: `${data.main.humidity}%`,
      wind_speed: `${data.wind.speed} m/s`,
    };

    console.log(" Weather fetched successfully!");
    return { status: "success", city, weather };

  } catch (error) {
    console.error(" Weather Tool Error:", error.response?.data || error.message);
    return { error: "Failed to fetch weather data." };
  }
}

module.exports = { execute };

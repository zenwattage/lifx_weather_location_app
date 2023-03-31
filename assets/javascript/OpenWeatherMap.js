import axios from 'axios';
import owmConfig from './owmConfig';

// Function to get weather data from OpenWeatherMap API
export const getWeatherData = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${owmConfig.units}&appid=${owmConfig.weatherAPIKey}`;

    return axios.get(url)
        .then((response) => {
            return response.data;
        });
}

// Get reference to the elements
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherInfoDiv = document.getElementById('weatherInfo');

// Event listener for the button
getWeatherBtn.addEventListener('click', function() {
    const city = document.getElementById('city').value.trim();

    // Check if the user entered a city
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    // Coordinates for cities (Example: Berlin, Germany)
    const cityCoordinates = {
        'Berlin': { lat: 52.5200, lon: 13.4050 },
        'Paris': { lat: 48.8566, lon: 2.3522 },
        'London': { lat: 51.5074, lon: -0.1278 }
    };

    const coords = cityCoordinates[city];
    
    // If city not found in predefined list, show an error
    if (!coords) {
        alert("City not found. Please enter a valid city.");
        return;
    }

    // API URL (7Timer API doesn't require an API key)
    const apiUrl = `http://www.7timer.info/bin/api.pl?lon=${coords.lon}&lat=${coords.lat}&product=civil&output=json`;

    // Fetch weather data from 7Timer API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to retrieve weather data.");
        });
});

// Function to display weather data
function displayWeather(data) {
    // Clear previous weather data
    weatherInfoDiv.innerHTML = '';

    // Check if data is valid
    if (!data || !data.dataseries) {
        weatherInfoDiv.innerHTML = '<p>No weather data available for the selected city.</p>';
        return;
    }

    // Loop through the 7-day weather data
    data.dataseries.forEach(day => {
        const date = new Date(day.timepoint * 1000);  // Convert timestamp to a readable date
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

        // Create weather info for each day
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('weather-day');
        
        dayDiv.innerHTML = `
            <strong>${dayOfWeek} (${date.toLocaleDateString()})</strong><br>
            Temp: ${day.temp2m}°C<br>
            Weather: ${day.temp2m > 0 ? "Sunny" : "Cloudy"}<br>
            Wind Speed: ${day.wind10m_max} m/s
        `;

        // Append the weather information for the day
        weatherInfoDiv.appendChild(dayDiv);
    });
}

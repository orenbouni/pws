// ===========================
// Configuration
// ===========================
const CONFIG = {
    // Weather Station Configuration
    // You can configure this to work with Ambient Weather, Ecowitt, or your custom API
    apiType: 'ambient', // Options: 'ambient', 'ecowitt', 'custom'

    // Ambient Weather API Configuration
    ambientWeather: {
        // API Keys are now handled by the backend server
        // apiKey: '...',
        // applicationKey: '...',
    },

    // Custom API Configuration (if using direct PWS connection)
    customApi: {
        endpoint: 'YOUR_PWS_ENDPOINT_HERE',
        // Example: 'http://192.168.1.100/data.json' for local network access
    },

    // OpenWeatherMap for forecast (free tier available)
    openWeatherMap: {
        apiKey: 'YOUR_OWM_API_KEY_HERE',
        // Get free API key from: https://openweathermap.org/api
        lat: 32.4, // Ramot Me'ir approximate latitude
        lon: 35.0  // Ramot Me'ir approximate longitude
    },

    // Update intervals (in milliseconds)
    updateInterval: 60000, // Update every 60 seconds
    forecastUpdateInterval: 1800000, // Update forecast every 30 minutes

    // Units
    // Initial Units (will be overridden by localStorage if available)
    units: {
        system: 'metric', // 'metric' or 'imperial'
        temperature: 'C', // C or F
        wind: 'kmh',      // kmh, mph, ms
        pressure: 'hPa',  // hPa, inHg, mb
        rain: 'mm'        // mm or in
    }
};

// Initialize units from local storage
const savedSystem = localStorage.getItem('weatherUnits');
if (savedSystem) {
    setUnits(savedSystem);
} else {
    // Default to Metric if not set
    setUnits('metric');
}

function setUnits(system) {
    CONFIG.units.system = system;
    if (system === 'metric') {
        CONFIG.units.temperature = 'C';
        CONFIG.units.wind = 'kmh';
        CONFIG.units.pressure = 'hPa';
        CONFIG.units.rain = 'mm';
    } else {
        CONFIG.units.temperature = 'F';
        CONFIG.units.wind = 'mph';
        CONFIG.units.pressure = 'inHg';
        CONFIG.units.rain = 'in';
    }
    localStorage.setItem('weatherUnits', system);

    // Update button text if it exists
    const btn = document.getElementById('unitToggleBtn');
    if (btn) {
        btn.textContent = system === 'metric' ? '°C' : '°F';
    }
}

function toggleUnits() {
    const newSystem = CONFIG.units.system === 'metric' ? 'imperial' : 'metric';
    setUnits(newSystem);

    // Refresh UI if data exists
    if (state.currentData) {
        updateUI(state.currentData);
    }
    if (state.forecastData) {
        updateForecastUI(state.forecastData);
    }
}


// ===========================
// State Management
// ===========================
const state = {
    currentData: null,
    forecastData: null,
    historicalData: {
        temperature: [],
        humidity: [],
        pressure: []
    },
    lastUpdate: null,
    isConnected: false
};

// ===========================
// API Functions
// ===========================

/**
 * Fetch data from Local Backend API
 */
async function fetchAmbientWeatherData() {
    try {
        const url = `/api/current`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Backend returns the data object directly
        return parseAmbientWeatherData({ lastData: data });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        updateConnectionStatus('error', 'Failed to fetch data');
        return getDemoWeatherData();
    }
}

/**
 * Parse Ambient Weather API response
 */
function parseAmbientWeatherData(data) {
    if (!data || !data.lastData) return null;

    const last = data.lastData;

    return {
        timestamp: last.dateutc || last.date,
        temperature: convertTemperature(last.tempf),
        temperatureFeelsLike: convertTemperature(last.feelsLike),
        humidity: last.humidity,
        dewPoint: convertTemperature(last.dewPoint),
        pressure: convertPressure(last.baromrelin),
        pressureAbsolute: convertPressure(last.baromabsin),
        windSpeed: convertWindSpeed(last.windspeedmph),
        windDirection: last.winddir,
        windGust: convertWindSpeed(last.windgustmph),
        rainRate: convertRain(last.hourlyrainin),
        rainDaily: convertRain(last.dailyrainin),
        rainWeekly: convertRain(last.weeklyrainin),
        rainMonthly: convertRain(last.monthlyrainin),
        solarRadiation: last.solarradiation,
        uv: last.uv,
        tempMin24h: convertTemperature(last.tempinf), // Adjust based on your device
        tempMax24h: convertTemperature(last.tempinf), // Adjust based on your device
        humidityMin24h: last.humidity,
        humidityMax24h: last.humidity,
        pressureMin24h: convertPressure(last.baromrelin),
        pressureMax24h: convertPressure(last.baromrelin)
    };
}

/**
 * Fetch forecast data from OpenWeatherMap
 */
async function fetchForecastData() {
    const { apiKey, lat, lon } = CONFIG.openWeatherMap;

    if (!apiKey || apiKey === 'YOUR_OWM_API_KEY_HERE') {
        console.warn('OpenWeatherMap API key not configured. Using demo forecast.');
        return getDemoForecastData();
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return parseForecastData(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        return getDemoForecastData();
    }
}

/**
 * Parse OpenWeatherMap forecast response
 */
function parseForecastData(data) {
    const dailyForecasts = [];
    const processedDays = new Set();

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toISOString().split('T')[0];

        // Get one forecast per day (around noon)
        if (!processedDays.has(dateStr) && date.getHours() >= 11 && date.getHours() <= 13) {
            processedDays.add(dateStr);
            dailyForecasts.push({
                date: date,
                temp: item.main.temp,
                tempMin: item.main.temp_min,
                tempMax: item.main.temp_max,
                humidity: item.main.humidity,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                windSpeed: item.wind.speed * 3.6, // Convert m/s to km/h
                clouds: item.clouds.all,
                rain: item.rain?.['3h'] || 0
            });
        }
    });

    return dailyForecasts.slice(0, 5);
}

// ===========================
// Unit Conversion Functions
// ===========================

function convertTemperature(fahrenheit) {
    if (CONFIG.units.temperature === 'C') {
        return ((fahrenheit - 32) * 5 / 9).toFixed(1);
    }
    return fahrenheit.toFixed(1);
}

function convertWindSpeed(mph) {
    switch (CONFIG.units.wind) {
        case 'kmh':
            return (mph * 1.60934).toFixed(1);
        case 'ms':
            return (mph * 0.44704).toFixed(1);
        default:
            return mph.toFixed(1);
    }
}

function convertPressure(inHg) {
    switch (CONFIG.units.pressure) {
        case 'hPa':
        case 'mb':
            return (inHg * 33.8639).toFixed(1);
        default:
            return inHg.toFixed(2);
    }
}

function convertRain(inches) {
    if (CONFIG.units.rain === 'mm') {
        return (inches * 25.4).toFixed(1);
    }
    return inches.toFixed(2);
}

function convertTempFromC(celsius) {
    if (CONFIG.units.temperature === 'F') {
        return ((celsius * 9 / 5) + 32).toFixed(1);
    }
    return parseFloat(celsius).toFixed(1);
}

// ===========================
// Demo Data (for testing)
// ===========================

function getDemoWeatherData() {
    const now = new Date();
    const baseTemp = 22 + Math.sin(now.getHours() / 24 * Math.PI * 2) * 5;

    return {
        timestamp: now.toISOString(),
        temperature: baseTemp.toFixed(1),
        temperatureFeelsLike: (baseTemp - 1).toFixed(1),
        humidity: (60 + Math.random() * 20).toFixed(0),
        dewPoint: (baseTemp - 5).toFixed(1),
        pressure: (1013 + Math.random() * 10 - 5).toFixed(1),
        pressureAbsolute: (1013 + Math.random() * 10 - 5).toFixed(1),
        windSpeed: (Math.random() * 20).toFixed(1),
        windDirection: Math.floor(Math.random() * 360),
        windGust: (Math.random() * 30).toFixed(1),
        rainRate: (Math.random() * 2).toFixed(1),
        rainDaily: (Math.random() * 10).toFixed(1),
        rainWeekly: (Math.random() * 30).toFixed(1),
        rainMonthly: (Math.random() * 100).toFixed(1),
        solarRadiation: Math.max(0, Math.sin((now.getHours() - 6) / 12 * Math.PI) * 1000).toFixed(0),
        uv: Math.max(0, Math.sin((now.getHours() - 6) / 12 * Math.PI) * 11).toFixed(1),
        tempMin24h: (baseTemp - 8).toFixed(1),
        tempMax24h: (baseTemp + 6).toFixed(1),
        humidityMin24h: 45,
        humidityMax24h: 85,
        pressureMin24h: 1008,
        pressureMax24h: 1018
    };
}

function getDemoForecastData() {
    const forecasts = [];
    const now = new Date();

    for (let i = 1; i <= 5; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);

        forecasts.push({
            date: date,
            temp: (20 + Math.random() * 10).toFixed(1),
            tempMin: (15 + Math.random() * 5).toFixed(1),
            tempMax: (25 + Math.random() * 5).toFixed(1),
            humidity: (50 + Math.random() * 30).toFixed(0),
            description: ['clear sky', 'few clouds', 'scattered clouds', 'partly cloudy'][Math.floor(Math.random() * 4)],
            icon: '01d',
            windSpeed: (Math.random() * 20).toFixed(1),
            clouds: Math.floor(Math.random() * 100),
            rain: (Math.random() * 5).toFixed(1)
        });
    }

    return forecasts;
}

// ===========================
// UI Update Functions
// ===========================

function updateUI(data) {
    if (!data) return;

    // Update current temperature
    document.getElementById('currentTemp').textContent = data.temperature;
    document.getElementById('tempCurrent').textContent = `${data.temperature}°${CONFIG.units.temperature}`;

    // Update temperature range
    document.getElementById('tempMin').textContent = data.tempMin24h;
    document.getElementById('tempMax').textContent = data.tempMax24h;
    document.getElementById('tempMinDay').textContent = `${data.tempMin24h}°${CONFIG.units.temperature}`;
    document.getElementById('tempMaxDay').textContent = `${data.tempMax24h}°${CONFIG.units.temperature}`;
    document.getElementById('feelsLike').textContent = `${data.temperatureFeelsLike}°${CONFIG.units.temperature}`;

    // Update humidity
    document.getElementById('humidityCurrent').textContent = `${data.humidity}%`;
    document.getElementById('humidityMin').textContent = `${data.humidityMin24h}%`;
    document.getElementById('humidityMax').textContent = `${data.humidityMax24h}%`;
    document.getElementById('dewPoint').textContent = `${data.dewPoint}°${CONFIG.units.temperature}`;

    // Update wind
    document.getElementById('windSpeed').textContent = `${data.windSpeed} ${CONFIG.units.wind}`;
    document.getElementById('windDir').textContent = getWindDirection(data.windDirection);
    document.getElementById('windGust').textContent = `${data.windGust} ${CONFIG.units.wind}`;

    // Update wind compass
    const compassArrow = document.querySelector('.compass-arrow');
    if (compassArrow) {
        compassArrow.style.transform = `translate(-50%, -100%) rotate(${data.windDirection}deg)`;
    }

    // Update pressure
    document.getElementById('pressureCurrent').textContent = `${data.pressure} ${CONFIG.units.pressure}`;
    document.getElementById('pressureMin').textContent = `${data.pressureMin24h} ${CONFIG.units.pressure}`;
    document.getElementById('pressureMax').textContent = `${data.pressureMax24h} ${CONFIG.units.pressure}`;
    document.getElementById('pressureTrend').textContent = getPressureTrend(data.pressure, data.pressureAbsolute);

    // Update rain
    document.getElementById('rainRate').textContent = `${data.rainRate} ${CONFIG.units.rain}/h`;
    document.getElementById('rainToday').textContent = `${data.rainDaily} ${CONFIG.units.rain}`;
    document.getElementById('rainWeek').textContent = `${data.rainWeekly} ${CONFIG.units.rain}`;
    document.getElementById('rainMonth').textContent = `${data.rainMonthly} ${CONFIG.units.rain}`;

    // Update solar & UV
    document.getElementById('solarRadiation').textContent = `${data.solarRadiation} W/m²`;
    document.getElementById('uvIndex').textContent = data.uv;
    document.getElementById('uvLevel').textContent = getUVLevel(data.uv);
    document.getElementById('lightIntensity').textContent = getSolarIntensity(data.solarRadiation);

    // Update weather description
    document.getElementById('weatherDesc').textContent = getWeatherDescription(data);

    // Update last update time
    updateLastUpdateTime(data.timestamp);

    // Add fade-in animation
    document.querySelectorAll('.weather-card').forEach(card => {
        card.classList.add('fade-in');
    });
}

function updateForecastUI(forecasts) {
    if (!forecasts || forecasts.length === 0) return;

    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';

    forecasts.forEach((forecast, index) => {
        const card = createForecastCard(forecast, index);
        forecastGrid.appendChild(card);
    });
}

function createForecastCard(forecast, index) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const dayName = forecast.date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = forecast.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    card.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-date">${dateStr}</div>
        <div class="forecast-icon">
            ${getWeatherIconSVG(forecast.description)}
        </div>
        <div class="forecast-temp">${convertTempFromC(forecast.temp)}°${CONFIG.units.temperature}</div>
        <div class="forecast-temp-range">
            ${convertTempFromC(forecast.tempMin)}° / ${convertTempFromC(forecast.tempMax)}°
        </div>
        <div class="forecast-description">${forecast.description}</div>
    `;

    return card;
}

function updateLastUpdateTime(timestamp) {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    document.querySelector('.update-time').textContent = timeStr;
}

function updateConnectionStatus(status, message) {
    const statusEl = document.getElementById('connectionStatus');
    const statusText = statusEl.querySelector('.status-text');

    statusEl.className = 'connection-status';

    switch (status) {
        case 'connected':
            statusEl.classList.add('connected');
            statusText.textContent = message || 'Connected';
            state.isConnected = true;
            break;
        case 'error':
            statusEl.classList.add('error');
            statusText.textContent = message || 'Connection Error';
            state.isConnected = false;
            break;
        default:
            statusText.textContent = message || 'Connecting...';
            state.isConnected = false;
    }
}

// ===========================
// Helper Functions
// ===========================

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function getPressureTrend(current, absolute) {
    const diff = parseFloat(current) - parseFloat(absolute);
    if (Math.abs(diff) < 0.5) return 'Steady';
    return diff > 0 ? 'Rising ↗' : 'Falling ↘';
}

function getUVLevel(uv) {
    const uvValue = parseFloat(uv);
    if (uvValue < 3) return 'Low';
    if (uvValue < 6) return 'Moderate';
    if (uvValue < 8) return 'High';
    if (uvValue < 11) return 'Very High';
    return 'Extreme';
}

function getSolarIntensity(solar) {
    const value = parseFloat(solar);
    if (value < 200) return 'Low';
    if (value < 400) return 'Moderate';
    if (value < 600) return 'High';
    if (value < 800) return 'Very High';
    return 'Extreme';
}

function getWeatherDescription(data) {
    const temp = parseFloat(data.temperature);
    const humidity = parseFloat(data.humidity);
    const rain = parseFloat(data.rainRate);

    if (rain > 1) return 'Rainy';
    if (humidity > 80) return 'Humid';
    if (temp > 30) return 'Hot';
    if (temp < 10) return 'Cold';
    if (temp >= 20 && temp <= 25) return 'Pleasant';
    return 'Partly Cloudy';
}

function getWeatherIconSVG(description) {
    // Simple weather icon based on description
    if (description.includes('rain')) {
        return `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="19" x2="8" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
        </svg>`;
    } else if (description.includes('cloud')) {
        return `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>`;
    } else {
        return `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        </svg>`;
    }
}

// ===========================
// Data Fetching
// ===========================

async function fetchAllData() {
    try {
        updateConnectionStatus('connecting', 'Fetching data...');

        // Fetch current weather data
        const weatherData = await fetchAmbientWeatherData();
        if (weatherData) {
            state.currentData = weatherData;
            updateUI(weatherData);
        }

        // Fetch forecast data
        const forecastData = await fetchForecastData();
        if (forecastData) {
            state.forecastData = forecastData;
            updateForecastUI(forecastData);
        }

        state.lastUpdate = new Date();
        updateConnectionStatus('connected', 'Live Data');
    } catch (error) {
        console.error('Error fetching data:', error);
        updateConnectionStatus('error', 'Failed to fetch data');
    }
}

// ===========================
// Event Listeners
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Initial data fetch
    fetchAllData();

    // Set up auto-refresh intervals
    setInterval(fetchAllData, CONFIG.updateInterval);

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', () => {
        refreshBtn.querySelector('svg').classList.add('spin');
        fetchAllData().then(() => {
            setTimeout(() => {
                refreshBtn.querySelector('svg').classList.remove('spin');
            }, 500);
        });
    });


    // Setup unit toggle
    const unitToggleBtn = document.getElementById('unitToggleBtn');
    if (unitToggleBtn) {
        unitToggleBtn.textContent = CONFIG.units.temperature === 'C' ? '°C' : '°F';
        unitToggleBtn.addEventListener('click', toggleUnits);
    }

    // Log configuration for user
    console.log('Weather Dashboard initialized');
    console.log('Configuration:', CONFIG);
    console.log('To connect to your weather station:');
    console.log('1. Edit the CONFIG object in app.js');
    console.log('2. Add your API keys');
    console.log('3. Refresh the page');
});

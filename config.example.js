// Example Configuration File
// Copy this to create your own local configuration

// INSTRUCTIONS:
// 1. Copy this file and rename to: config.local.js
// 2. Fill in your actual API keys
// 3. Import this in app.js instead of hardcoding

const CONFIG_EXAMPLE = {
    // ===========================
    // Weather Station Configuration
    // ===========================

    // Choose your API type: 'ambient', 'ecowitt', 'custom'
    apiType: 'ambient',

    // Ambient Weather API Configuration
    // Get keys from: https://ambientweather.net/account
    ambientWeather: {
        apiKey: 'YOUR_AMBIENT_API_KEY_HERE',
        applicationKey: 'YOUR_AMBIENT_APPLICATION_KEY_HERE',
    },

    // Ecowitt Configuration (if you have Ecowitt station)
    ecowitt: {
        apiKey: 'YOUR_ECOWITT_API_KEY_HERE',
        applicationKey: 'YOUR_ECOWITT_APP_KEY_HERE',
        mac: 'YOUR_STATION_MAC_ADDRESS',
    },

    // Custom API Configuration (for local weather station)
    customApi: {
        endpoint: 'http://192.168.1.100/data.json',
        // Common endpoints for different stations:
        // - Ambient Weather Local: 'http://IP_ADDRESS/livedata.htm'
        // - Ecowitt Local: 'http://IP_ADDRESS/get_livedata_info'
        // - Davis WeatherLink: Use WeatherLink API
    },

    // ===========================
    // Forecast Configuration
    // ===========================

    // OpenWeatherMap for forecast
    // Get free API key from: https://openweathermap.org/api
    openWeatherMap: {
        apiKey: 'YOUR_OPENWEATHERMAP_API_KEY_HERE',
        lat: 32.4,  // Ramot Me'ir latitude (update for accuracy)
        lon: 35.0   // Ramot Me'ir longitude (update for accuracy)
    },

    // ===========================
    // Update Intervals
    // ===========================

    // How often to refresh data (in milliseconds)
    updateInterval: 60000,         // 60 seconds for current weather
    forecastUpdateInterval: 1800000, // 30 minutes for forecast

    // ===========================
    // Display Units
    // ===========================

    units: {
        temperature: 'C',   // 'C' for Celsius, 'F' for Fahrenheit
        wind: 'kmh',        // 'kmh', 'mph', or 'ms' (meters/second)
        pressure: 'hPa',    // 'hPa', 'inHg', or 'mb'
        rain: 'mm'          // 'mm' or 'in'
    },

    // ===========================
    // Location Information
    // ===========================

    location: {
        name: 'Or-Bo PWS',
        city: 'Ramot Me\'ir',
        country: 'Israel',
        timezone: 'Asia/Jerusalem'
    }
};

// If using this as a separate config file, export it:
// export default CONFIG_EXAMPLE;

// ===========================
// Quick Setup Examples
// ===========================

// Example 1: Ambient Weather Setup
/*
const CONFIG = {
    apiType: 'ambient',
    ambientWeather: {
        apiKey: 'abc123def456ghi789',
        applicationKey: 'xyz987uvw654rst321',
    },
    openWeatherMap: {
        apiKey: 'your_owm_key_here',
        lat: 32.4073,
        lon: 35.0148
    },
    updateInterval: 60000,
    forecastUpdateInterval: 1800000,
    units: {
        temperature: 'C',
        wind: 'kmh',
        pressure: 'hPa',
        rain: 'mm'
    }
};
*/

// Example 2: Local Weather Station
/*
const CONFIG = {
    apiType: 'custom',
    customApi: {
        endpoint: 'http://192.168.1.150/data.json',
    },
    openWeatherMap: {
        apiKey: 'your_owm_key_here',
        lat: 32.4073,
        lon: 35.0148
    },
    updateInterval: 30000, // 30 seconds for local
    forecastUpdateInterval: 1800000,
    units: {
        temperature: 'C',
        wind: 'kmh',
        pressure: 'hPa',
        rain: 'mm'
    }
};
*/

// ===========================
// API Rate Limits (Free Tiers)
// ===========================

/*
Ambient Weather (Free):
- 1 request per second
- 288 requests per 24 hours per API key

OpenWeatherMap (Free):
- 60 calls per minute
- 1,000,000 calls per month

Keep update intervals reasonable to stay within limits!
*/

// ===========================
// Getting Your Exact Coordinates
// ===========================

/*
To get precise coordinates for Ramot Me'ir:

1. Visit: https://www.google.com/maps
2. Search for your exact location
3. Right-click on the map at your location
4. Click on the coordinates to copy them
5. Update the lat/lon values above

Or use: https://www.latlong.net/
*/

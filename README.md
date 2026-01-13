# Or-Bo PWS Weather Dashboard 🌤️

A beautiful, modern weather dashboard for your personal weather station in Ramot Me'ir, Israel. This dashboard displays real-time weather data with stunning visualizations, min/max values, and a 5-day forecast.

## ✨ Features

- **Real-time Weather Data**: Live updates from your personal weather station
- **Comprehensive Metrics**: Temperature, humidity, wind, pressure, rainfall, solar radiation, and UV index
- **Min/Max Values**: 24-hour minimum and maximum values for all key metrics
- **5-Day Forecast**: Weather predictions for the next 5 days
- **Premium Design**: Modern dark theme with glassmorphism effects and smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Unit Toggle**: Switch between Metric (mm, °C, km/h) and Imperial (in, °F, mph) units instantly
- **Multi-API Support**: Compatible with Ambient Weather, Ecowitt, and custom APIs

## 🚀 Quick Start

### Running the Dashboard

The dashboard now requires a Python backend to fetch and store weather data.

```bash
# 1. Provide execution permissions to the start script
chmod +x start.sh

# 2. Run the application
./start.sh
```

Or manually:

```bash
# Create/Activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python3 server.py
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Connect to Your Weather Station

1. **Edit the configuration** in `app.js`:
   - Open `app.js` in your text editor
   - Find the `CONFIG` object at the top of the file
   - Add your API credentials

2. **Choose your API type**:

   The project comes pre-configured with keys, but you can update them if needed.

#### For Ambient Weather Network:

```javascript
const CONFIG = {
    apiType: 'ambient',
    
    ambientWeather: {
        apiKey: 'YOUR_API_KEY_HERE',
        applicationKey: 'YOUR_APPLICATION_KEY_HERE',
    },
    // ... rest of config
};
```

**Get Ambient Weather API Keys:**
1. Go to [https://ambientweather.net/account](https://ambientweather.net/account)
2. Log in to your Ambient Weather account
3. Navigate to "API Keys" section
4. Generate new API key and Application key
5. Copy both keys into the config

#### For Custom/Local API:

```javascript
const CONFIG = {
    apiType: 'custom',
    
    customApi: {
        endpoint: 'http://192.168.1.100/data.json',
        // Replace with your PWS IP address or endpoint
    },
    // ... rest of config
};
```

#### For Weather Forecast:

The dashboard uses OpenWeatherMap for forecasts (free tier available):

```javascript
openWeatherMap: {
    apiKey: 'YOUR_OWM_API_KEY_HERE',
    lat: 32.4,  // Ramot Me'ir latitude
    lon: 35.0   // Ramot Me'ir longitude
},
```

**Get OpenWeatherMap API Key (Free):**
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Copy it into the config

## 📊 Displayed Metrics

### Temperature
- Current temperature with feels-like
- 24-hour min/max values
- Real-time updates

### Humidity
- Current humidity percentage
- 24-hour min/max values
- Dew point calculation

### Wind
- Current wind speed and direction
- Wind gusts
- Visual compass indicator

### Atmospheric Pressure
- Current barometric pressure
- 24-hour min/max values
- Pressure trend (rising/falling/steady)

### Rainfall
- Current rain rate
- Daily, weekly, and monthly totals
- Accumulation tracking

### Solar & UV
- Solar radiation (W/m²)
- UV index with risk level
- Light intensity classification

## ⚙️ Configuration Options

### Units

You can toggle between Metric and Imperial units using the button in the header. The selection is saved in your browser's local storage.

Default configuration in `app.js`:

```javascript
units: {
    system: 'metric',   // 'metric' or 'imperial'
    temperature: 'C',   // 'C' or 'F'
    wind: 'kmh',        // 'kmh', 'mph', or 'ms'
    pressure: 'hPa',    // 'hPa', 'inHg', or 'mb'
    rain: 'mm'          // 'mm' or 'in'
}
```

### Update Intervals

Adjust how often data refreshes:

```javascript
updateInterval: 60000,           // 60 seconds for weather data
forecastUpdateInterval: 1800000, // 30 minutes for forecast
```

### Location

Update your exact coordinates for accurate forecasts:

```javascript
openWeatherMap: {
    lat: 32.4,  // Your latitude
    lon: 35.0   // Your longitude
}
```

## 🎨 Design Features

- **Dark Theme**: Easy on the eyes with premium color palette
- **Glassmorphism**: Modern frosted glass effects
- **Animations**: Smooth transitions and micro-animations
- **Gradients**: Beautiful color gradients throughout
- **Responsive**: Adapts to any screen size
- **Accessibility**: Semantic HTML and proper ARIA labels

## 🔧 Troubleshooting

### Dashboard shows demo data

- Check that your API keys are correctly configured in `app.js`
- Open browser console (F12) to see any error messages
- Verify your weather station is online and accessible

### CORS errors in browser console

- Use a local web server instead of opening the file directly
- For Ambient Weather API, CORS should work fine
- For local weather stations, you may need to enable CORS on your device

### Forecast not showing

- Verify your OpenWeatherMap API key is valid
- Check that coordinates are correct
- Free tier has rate limits (60 calls/minute)

### Data not updating

- Check your internet connection
- Verify API keys are valid and not expired
- Check browser console for errors
- Try refreshing the page manually

## 🌐 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 📱 Mobile Usage

The dashboard is fully responsive and works great on mobile devices. Simply open the URL on your phone or tablet for on-the-go weather monitoring.

## 🚀 Deployment Options

### Local Network Access

To access from other devices on your network:

```bash
# Start a simple HTTP server
python3 -m http.server 8000

# Access from other devices using your computer's IP
# Example: http://192.168.1.100:8000
```

### Cloud Hosting (Free Options)

1. **GitHub Pages**:
   - Push to a GitHub repository
   - Enable GitHub Pages in settings
   - Access via `https://yourusername.github.io/repository-name`

2. **Netlify**:
   - Drag and drop the folder to Netlify
   - Get instant deployment
   - Custom domain support

3. **Vercel**:
   - Connect your GitHub repo
   - Automatic deployments
   - Fast global CDN

## 🔒 Security Notes

- **Never commit API keys to public repositories**
- Consider using environment variables for production
- Use HTTPS for deployed versions
- Keep API keys secure and rotate them periodically

## 🎯 Future Enhancements

Potential features to add:

- [ ] Historical data charts
- [ ] Weather alerts and notifications
- [ ] Multiple weather station support
- [ ] Export data to CSV/JSON
- [ ] Custom themes and color schemes
- [ ] Weather statistics and analytics
- [ ] Integration with smart home systems

## 📝 Customization

Feel free to customize:

- Colors in `styles.css` (see CSS variables in `:root`)
- Layout and card arrangement
- Add/remove weather metrics
- Modify update intervals
- Change fonts

## 🤝 Support

For issues or questions:

1. Check the browser console for errors
2. Verify your API configuration
3. Test with demo mode first
4. Check your weather station documentation

## 📄 License

This project is open source and available for personal use.

## 🙏 Credits

- Weather data: Your personal weather station + OpenWeatherMap
- Fonts: Google Fonts (Inter, Outfit)
- Icons: SVG line icons
- Design: Custom premium theme

---

**Enjoy your beautiful weather dashboard! 🌈**

For the best experience, use a modern browser and ensure your weather station is properly configured and online.

# Weather Dashboard Configuration Guide

## Step-by-Step Setup for Or-Bo PWS

### Step 1: Identify Your Weather Station Type

Or-Bo PWS appears to be a personal weather station. Let's determine which API you should use:

**Common Options:**
- **Ambient Weather Network** - If your station uploads to ambientweather.net
- **Ecowitt** - If you have an Ecowitt station (GW1000, GW1100, etc.)
- **Weather Underground** - If your station uploads to wunderground.com
- **Direct/Local API** - If your station has a local web interface

### Step 2: Get Your API Credentials

#### Option A: Ambient Weather API (Most Common)

1. Visit: https://ambientweather.net/account
2. Log in with your account
3. Click on "API Keys" in the menu
4. Create a new API Key
5. Copy both:
   - API Key (looks like: abc123def456...)
   - Application Key (looks like: xyz789uvw012...)

#### Option B: OpenWeatherMap (For Forecast)

1. Visit: https://openweathermap.org/api
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

#### Option C: Local Weather Station

If your weather station has a local web interface:
1. Find your station's IP address (check your router)
2. Access the web interface (usually http://192.168.1.xxx)
3. Look for API documentation or data endpoint
4. Common endpoints:
   - `/livedata.htm`
   - `/data.json`
   - `/weatherstation/updateweatherstation.php`

### Step 3: Configure the Dashboard

Open `app.js` and find the `CONFIG` object around line 10.

**For Ambient Weather:**
```javascript
const CONFIG = {
    apiType: 'ambient', // Change this
    
    ambientWeather: {
        apiKey: 'PASTE_YOUR_API_KEY_HERE',
        applicationKey: 'PASTE_YOUR_APPLICATION_KEY_HERE',
    },
    
    openWeatherMap: {
        apiKey: 'PASTE_YOUR_OWM_KEY_HERE',
        lat: 32.4,  // Update if needed
        lon: 35.0   // Update if needed
    },
    
    // Keep the rest as is...
};
```

**For Local Weather Station:**
```javascript
const CONFIG = {
    apiType: 'custom', // Change this
    
    customApi: {
        endpoint: 'http://192.168.1.100/data.json', // Your station's IP and endpoint
    },
    
    openWeatherMap: {
        apiKey: 'PASTE_YOUR_OWM_KEY_HERE',
        lat: 32.4,
        lon: 35.0
    },
    
    // Keep the rest as is...
};
```

### Step 4: Get Exact Coordinates for Ramot Me'ir

For accurate forecasts, update your coordinates:

1. Visit: https://www.latlong.net/
2. Search for "Ramot Me'ir, Israel"
3. Copy the coordinates
4. Update in `app.js`:

```javascript
openWeatherMap: {
    apiKey: 'YOUR_KEY_HERE',
    lat: 32.3xxx,  // Replace with actual latitude
    lon: 35.0xxx   // Replace with actual longitude
}
```

### Step 5: Test the Dashboard

1. Save `app.js` with your changes
2. Refresh the browser (the server is already running)
3. Check the browser console (F12) for any errors
4. Look for "Connected" status in the bottom right

### Troubleshooting

**"Connection Error" showing:**
- Check API keys are correct (no extra spaces)
- Verify your weather station is online
- Check browser console for specific errors

**Still seeing demo data:**
- Make sure you saved `app.js`
- Hard refresh the page (Cmd+Shift+R on Mac)
- Check that API keys don't have quotes inside the strings

**CORS errors:**
- This is common with local weather stations
- You may need to enable CORS on your station
- Or use a proxy service

**Forecast not showing:**
- OpenWeatherMap free tier is limited to 60 calls/minute
- Make sure coordinates are in decimal format (not degrees/minutes)
- Check that API key is active (can take a few minutes after creation)

### Common Weather Station Models and Their APIs

- **Ambient Weather WS-2902, WS-5000**: Use Ambient Weather API
- **Ecowitt GW1100, GW1000**: Use Ecowitt API or local JSON
- **Davis Vantage Pro2**: Use WeatherLink API
- **La Crosse**: Check if it uploads to Ambient Weather Network

### Security Best Practices

1. **Never share** your API keys publicly
2. Don't commit `app.js` with keys to GitHub
3. Consider creating `config.local.js` (add to .gitignore)
4. Rotate keys periodically

### Advanced: Environment Variables (Optional)

For production deployments:

1. Create a `.env` file:
```
AMBIENT_API_KEY=your_key_here
AMBIENT_APP_KEY=your_app_key_here
OWM_API_KEY=your_owm_key_here
```

2. Add `.env` to `.gitignore`
3. Use a build tool to inject these at runtime

### Need Help?

**Check these resources:**
- Ambient Weather API Docs: https://ambientweather.docs.apiary.io/
- OpenWeatherMap API Docs: https://openweathermap.org/api
- Your weather station's manual

**Still stuck?**
- Check browser console (F12) for specific error messages
- Verify your weather station is uploading data
- Try demo mode to ensure dashboard works generally
- Check that your API free tier limits aren't exceeded

---

**Quick Reference: API Key Locations**

| Service | Where to Get Keys | Free Tier |
|---------|------------------|-----------|
| Ambient Weather | ambientweather.net/account | Yes (1 call/sec) |
| OpenWeatherMap | openweathermap.org/api | Yes (60 calls/min) |
| WeatherUnderground | wunderground.com/member | Limited |
| Ecowitt | ecowitt.net | Yes |

**Good luck! Your weather dashboard should be up and running shortly! 🌤️**

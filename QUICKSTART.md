# 🌤️ Or-Bo PWS Dashboard - Quick Start

## ✅ Your Dashboard is Ready!

I've created a **beautiful, modern weather dashboard** for your Or-Bo Personal Weather Station in Ramot Me'ir! 

### 📁 What's Been Created

```
/Users/orenbouni/Downloads/Ambient/
├── index.html              # Main dashboard page
├── styles.css              # Premium dark theme with animations
├── app.js                  # Weather data logic and API integration
├── README.md               # Complete documentation
├── CONFIGURATION.md        # Step-by-step setup guide
├── config.example.js       # Configuration examples
├── start.sh                # Quick start script
└── .gitignore             # Protects your API keys
```

## 🚀 Getting Started (3 Options)

### Option 1: View Demo Right Now ⚡

The dashboard is **already running** with demo data!

**Open in your browser:**
- URL: http://localhost:8000
- Or click the link above

You'll see live demo data showing all dashboard features.

### Option 2: Connect to Your Weather Station 🛰️

To display **real data** from your Or-Bo PWS:

1. **Open `app.js`** in your text editor
2. **Find the `CONFIG` object** (around line 10)
3. **Add your API keys:**

```javascript
const CONFIG = {
    apiType: 'ambient',  // or 'custom' for local access
    
    ambientWeather: {
        apiKey: 'YOUR_API_KEY',
        applicationKey: 'YOUR_APP_KEY',
    },
    
    openWeatherMap: {
        apiKey: 'YOUR_OWM_KEY',
        lat: 32.4,
        lon: 35.0
    },
    // ... rest
};
```

4. **Save the file**
5. **Refresh your browser** (Cmd+Shift+R)

**Where to get API keys:**
- Ambient Weather: https://ambientweather.net/account
- OpenWeatherMap: https://openweathermap.org/api (free!)

**See `CONFIGURATION.md` for detailed setup instructions.**

### Option 3: Restart Anytime 🔄

To restart the server later:

```bash
cd /Users/orenbouni/Downloads/Ambient
./start.sh
```

Or manually:
```bash
python3 -m http.server 8000
```

## ✨ Dashboard Features

Your dashboard displays:

### 📊 Current Conditions
- **Temperature** with feels-like and 24h min/max
- **Humidity** with dew point and 24h range
- **Wind** speed, direction, gusts + visual compass
- **Pressure** with trend indicator and 24h range
- **Rainfall** rate, daily, weekly, monthly totals
- **Solar & UV** radiation with safety levels

### 🔮 5-Day Forecast
- Temperature predictions
- Weather conditions
- Min/max temperatures
- Beautiful icons

### 🎨 Design Highlights
- **Premium dark theme** easy on the eyes
- **Glassmorphism effects** modern and sleek
- **Smooth animations** professional feel
- **Real-time updates** every 60 seconds
- **Fully responsive** works on phone, tablet, desktop

## 🔧 Common Tasks

### Change Units
Edit `app.js`, find the `units` section:
```javascript
units: {
    temperature: 'C',   // or 'F'
    wind: 'kmh',        // or 'mph', 'ms'
    pressure: 'hPa',    // or 'inHg', 'mb'
    rain: 'mm'          // or 'in'
}
```

### Update Faster/Slower
```javascript
updateInterval: 60000,  // milliseconds (60s default)
```

### Change Location Coordinates
```javascript
openWeatherMap: {
    lat: 32.4073,  // Your exact latitude
    lon: 35.0148   // Your exact longitude
}
```

## 📱 Access from Phone/Tablet

1. **Find your computer's IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **On your mobile device**, open:
   ```
   http://YOUR_COMPUTER_IP:8000
   ```
   Example: `http://192.168.1.50:8000`

## 🌐 Deploy Online (Optional)

To access from anywhere:

**Free Options:**
- **GitHub Pages**: Push to GitHub, enable Pages
- **Netlify**: Drag & drop deployment
- **Vercel**: Connect GitHub for auto-deploys

See `README.md` for deployment instructions.

## 🆘 Troubleshooting

**Still seeing demo data?**
- Check API keys are configured in `app.js`
- Make sure you saved the file
- Hard refresh browser (Cmd+Shift+R)

**"Connection Error"?**
- Verify API keys are correct
- Check your weather station is online
- Open browser console (F12) for error details

**Forecast not showing?**
- Add OpenWeatherMap API key
- Check coordinates are correct
- Free tier has rate limits

**Need help?**
- Read `CONFIGURATION.md` for detailed setup
- Check browser console (F12) for errors
- Verify your weather station model and API type

## 📚 Documentation

- **README.md** - Complete documentation
- **CONFIGURATION.md** - Step-by-step API setup
- **config.example.js** - Configuration examples

## 🎯 Next Steps

1. ✅ **View the demo** at http://localhost:8000
2. 📝 **Configure your API keys** following CONFIGURATION.md
3. 🔄 **Refresh browser** to see live data
4. 🎨 **Customize** colors, units, update intervals
5. 📱 **Access from mobile** using your computer's IP
6. ☁️ **Deploy online** (optional) for remote access

## 💡 Pro Tips

- **Bookmark the dashboard** for quick access
- **Pin to home screen** on mobile for app-like experience
- **Check browser console** (F12) for detailed logs
- **Use demo mode** to test before configuring APIs
- **Keep API keys private** - never share or commit to GitHub

---

## 🎉 Enjoy Your Weather Dashboard!

You now have a **professional-grade weather dashboard** showing:
- Real-time conditions from your weather station
- Beautiful visualizations with min/max values
- 5-day forecasts
- Premium design with smooth animations

**Questions?** Check the documentation files or browser console for detailed information.

**Happy weather monitoring! ☀️🌧️⛈️❄️**

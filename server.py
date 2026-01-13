import os
import sqlite3
import time
import requests
import logging
from datetime import datetime
from flask import Flask, jsonify, send_from_directory
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_KEY = os.getenv('AMBIENT_API_KEY')
APP_KEY = os.getenv('AMBIENT_APP_KEY')
DB_FILE = 'weather.db'

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__, static_url_path='', static_folder='.')

# Database Setup
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS readings (
            timestamp TEXT PRIMARY KEY,
            temp_f REAL,
            humidity REAL,
            wind_speed_mph REAL,
            wind_dir REAL,
            rain_rate_in REAL,
            uv REAL,
            solar_rad REAL,
            pressure_rel_in REAL,
            raw_json TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Data Fetching Logic
def fetch_weather_data():
    if not API_KEY or not APP_KEY:
        logger.error("API Keys missing")
        return

    url = f"https://api.ambientweather.net/v1/devices?applicationKey={APP_KEY}&apiKey={API_KEY}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data and len(data) > 0:
            device = data[0]
            last = device.get('lastData', {})
            save_to_db(last)
        else:
            logger.warning("No data received from API")
            
    except Exception as e:
        logger.error(f"Error fetching data: {e}")

def save_to_db(data):
    if not data:
        return
        
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    
    # Ambient Weather timestamps are usually ms, but sometimes strings. Handle both.
    ts_val = data.get('dateutc') or data.get('date')
    if isinstance(ts_val, (int, float)):
        # Convert ms to ISO string
        timestamp = datetime.utcfromtimestamp(ts_val / 1000.0).isoformat() + 'Z'
    else:
        timestamp = str(ts_val)

    try:
        c.execute('''
            INSERT OR IGNORE INTO readings 
            (timestamp, temp_f, humidity, wind_speed_mph, wind_dir, rain_rate_in, uv, solar_rad, pressure_rel_in, raw_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            timestamp,
            data.get('tempf'),
            data.get('humidity'),
            data.get('windspeedmph'),
            data.get('winddir'),
            data.get('hourlyrainin'),
            data.get('uv'),
            data.get('solarradiation'),
            data.get('baromrelin'),
            str(data)
        ))
        conn.commit()
        logger.info(f"Saved data for {timestamp}")
    except Exception as e:
        logger.error(f"Database error: {e}")
    finally:
        conn.close()

# Scheduler Setup
scheduler = BackgroundScheduler()
scheduler.add_job(func=fetch_weather_data, trigger="interval", seconds=60)
scheduler.start()

# API Routes
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/current')
def get_current_weather():
    # Attempt to get latest from DB first
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM readings ORDER BY timestamp DESC LIMIT 1')
    row = c.fetchone()
    conn.close()
    
    if row:
        # Construct response similar to Ambient API for frontend compatibility
        # Or simpler format. Let's stick to what app.js expects or adapt it.
        # app.js expects { lastData: ... } structure roughly if we want to minimize changes,
        # OR we can serve the flat structure and update app.js.
        # Let's serve reasonable JSON.
        data = dict(row)
        # Parse raw_json if needed or just use columns.
        # To minimize app.js refactor, let's return a structure it can easily parse.
        # Ideally, we return the cached 'lastData' object.
        import ast
        try:
            raw = ast.literal_eval(data['raw_json'])
            # Ensure timestamp is consistent
            raw['dateutc'] = data['timestamp'] 
            return jsonify(raw)
        except:
            return jsonify(data)
    else:
        # Fallback to fetching immediately if DB is empty
        fetch_weather_data()
        return jsonify({"message": "Fetching data, please refresh..."}), 202

@app.route('/api/history')
def get_history():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM readings ORDER BY timestamp DESC LIMIT 1440') # Last 24h (approx)
    rows = c.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

if __name__ == '__main__':
    init_db()
    # Fetch once on startup
    fetch_weather_data()
    # Run on port 8000 to match user's previous preference, 
    # but be aware if the old one is still running it might fail.
    # I'll try 8000, if it fails user sees error.
    app.run(host='0.0.0.0', port=8000, debug=False)

"""
Weather API Routes
Handles weather data fetching from OpenWeatherMap and other sources
"""

from fastapi import APIRouter, HTTPException
import aiohttp
import asyncio
from datetime import datetime, timedelta
import os
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Configuration - Load from environment
WEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "1801423b3942e324ab80f5b47afe0859")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"
ONECALL_API_URL = "https://api.openweathermap.org/data/3.0/onecall"

print(f"🔑 Weather API Key loaded: {'✅ Real key' if WEATHER_API_KEY != 'demo_key' else '❌ Demo key'}")

@router.get("/weather/{lat}/{lon}")
async def get_weather_data(lat: float, lon: float):
    """
    Get current weather data for specified coordinates
    Returns real data from OpenWeatherMap or realistic fallback
    """
    try:
        if WEATHER_API_KEY != "demo_key":
            # Use real OpenWeatherMap API
            url = f"{OPENWEATHER_BASE_URL}/weather"
            params = {
                "lat": lat,
                "lon": lon,
                "appid": WEATHER_API_KEY,
                "units": "metric"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "temperature": data["main"]["temp"],
                            "conditions": data["weather"][0]["description"].title(),
                            "humidity": data["main"]["humidity"],
                            "wind_speed": data["wind"].get("speed", 0),
                            "pressure": data["main"]["pressure"],
                            "visibility": data.get("visibility", 10000) / 1000,  # Convert to km
                            "last_updated": datetime.now().isoformat(),
                            "source": "OpenWeatherMap"
                        }
                    else:
                        raise Exception(f"API returned {response.status}")
        
        else:
            # Generate realistic fallback weather data
            return _generate_realistic_weather(lat, lon)
            
    except Exception as e:
        print(f"Weather API error: {e}")
        return _generate_realistic_weather(lat, lon)

def _generate_realistic_weather(lat: float, lon: float):
    """Generate realistic weather data based on location and season"""
    
    # Base temperature calculation (realistic by latitude)
    base_temp = 20 - abs(lat) * 0.5  # Colder as we move from equator
    
    # Seasonal adjustment
    month = datetime.now().month
    if month in [12, 1, 2]:  # Winter
        seasonal_adj = -5
    elif month in [3, 4, 5]:  # Spring
        seasonal_adj = 0
    elif month in [6, 7, 8]:  # Summer
        seasonal_adj = 8
    else:  # Fall
        seasonal_adj = -2
    
    # Generate realistic weather
    temperature = base_temp + seasonal_adj + random.uniform(-3, 3)
    
    # Humidity based on location (coastal areas higher)
    base_humidity = 50
    if abs(lat) < 30:  # Tropical
        base_humidity = 70
    elif abs(lat) > 60:  # Polar
        base_humidity = 40
    
    humidity = max(20, min(95, base_humidity + random.randint(-15, 15)))
    
    # Wind speed
    wind_speed = max(0, 8 + random.uniform(-3, 10))
    
    # Pressure
    pressure = 1013 + random.uniform(-15, 15)
    
    # Conditions based on season and location
    conditions_pool = [
        "Clear Sky", "Partly Cloudy", "Cloudy", "Light Rain", 
        "Overcast", "Sunny", "Scattered Clouds"
    ]
    
    if month in [12, 1, 2] and abs(lat) > 40:
        conditions_pool.extend(["Snow", "Light Snow", "Overcast"])
    elif humidity > 80:
        conditions_pool.extend(["Rain", "Drizzle", "Thunderstorm"])
    
    return {
        "temperature": round(temperature, 1),
        "conditions": random.choice(conditions_pool),
        "humidity": round(humidity, 1),
        "wind_speed": round(wind_speed, 1),
        "pressure": round(pressure, 1),
        "visibility": round(random.uniform(5, 15), 1),
        "last_updated": datetime.now().isoformat(),
        "source": "Realistic Simulation"
    }

@router.get("/weather/forecast/{lat}/{lon}")
async def get_weather_forecast(lat: float, lon: float, days: int = 7):
    """
    Get 7-day weather forecast using OpenWeatherMap One Call API
    Returns real forecast data or realistic fallback
    """
    try:
        if WEATHER_API_KEY and WEATHER_API_KEY != "demo_key":
            # Try One Call API 3.0 for 7-day forecast
            url = f"{ONECALL_API_URL}?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric&exclude=current,minutely,hourly,alerts"
            
            print(f"🌐 Requesting 7-day forecast from OpenWeatherMap: {lat}, {lon}")
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        forecast = []
                        
                        # Parse daily forecast (up to 7 days)
                        for day_data in data.get("daily", [])[:days]:
                            forecast.append({
                                "date": datetime.fromtimestamp(day_data["dt"]).strftime("%Y-%m-%d"),
                                "day": datetime.fromtimestamp(day_data["dt"]).strftime("%a"),
                                "temperature": round(day_data["temp"]["day"], 1),
                                "temp_min": round(day_data["temp"]["min"], 1),
                                "temp_max": round(day_data["temp"]["max"], 1),
                                "feels_like": round(day_data["feels_like"]["day"], 1),
                                "conditions": day_data["weather"][0]["description"].title(),
                                "humidity": day_data["humidity"],
                                "wind_speed": round(day_data["wind_speed"], 1),
                                "pressure": day_data["pressure"],
                                "precipitation": round(day_data.get("rain", 0) + day_data.get("snow", 0), 1),
                                "uvi": round(day_data.get("uvi", 0), 1),
                                "risk_score": _calculate_daily_risk(day_data)
                            })
                        
                        print(f"✅ 7-day forecast retrieved successfully from OpenWeatherMap")
                        return {
                            "forecast": forecast,
                            "location": {"latitude": lat, "longitude": lon},
                            "last_updated": datetime.now().isoformat(),
                            "source": "OpenWeatherMap One Call API 3.0",
                            "is_real": True
                        }
            else:
                print(f"⚠️ One Call API failed with status {response.status_code}, using fallback")
                raise requests.RequestException(f"API returned {response.status_code}")
        else:
            raise requests.RequestException("No API key available")
            
    except Exception as e:
        print(f"❌ Forecast API error: {e}, generating fallback data")
        # Generate realistic fallback forecast
        return _generate_fallback_forecast(lat, lon, days)

def _calculate_daily_risk(day_data: dict) -> float:
    """Calculate risk score for a day based on weather conditions"""
    risk = 0.0
    
    # High wind speeds
    wind_speed = day_data.get("wind_speed", 0)
    if wind_speed > 25:
        risk += 3.0
    elif wind_speed > 15:
        risk += 1.5
    
    # Heavy precipitation
    precip = day_data.get("rain", 0) + day_data.get("snow", 0)
    if precip > 50:
        risk += 3.5
    elif precip > 20:
        risk += 2.0
    elif precip > 5:
        risk += 1.0
    
    # Extreme temperatures
    temp_max = day_data["temp"]["max"]
    temp_min = day_data["temp"]["min"]
    if temp_max > 40 or temp_min < -10:
        risk += 2.5
    elif temp_max > 35 or temp_min < 0:
        risk += 1.5
    
    # High humidity
    humidity = day_data.get("humidity", 0)
    if humidity > 85:
        risk += 1.0
    
    return round(min(risk, 10.0), 1)  # Cap at 10.0

def _generate_fallback_forecast(lat: float, lon: float, days: int = 7):
    """Generate realistic fallback forecast data"""
    forecast = []
    base_temp = 20 - abs(lat) * 0.5
    
    for i in range(days):
        date = datetime.now().date()
        day_offset = i
        forecast_date = datetime(date.year, date.month, date.day)
        
        # Add day-to-day variation
        temp_variation = random.uniform(-3, 3)
        temp = round(base_temp + temp_variation, 1)
        
        forecast.append({
            "date": (date + timedelta(days=day_offset)).strftime("%Y-%m-%d") if day_offset > 0 else date.strftime("%Y-%m-%d"),
            "day": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][(date.weekday() + day_offset) % 7],
            "temperature": temp,
            "temp_min": round(temp - 3, 1),
            "temp_max": round(temp + 5, 1),
            "feels_like": round(temp - 1, 1),
            "conditions": random.choice(["Clear Sky", "Partly Cloudy", "Cloudy", "Light Rain"]),
            "humidity": random.randint(40, 80),
            "wind_speed": round(random.uniform(5, 20), 1),
            "pressure": round(1013 + random.uniform(-10, 10), 1),
            "precipitation": round(random.uniform(0, 15), 1),
            "uvi": round(random.uniform(0, 8), 1),
            "risk_score": round(random.uniform(2, 8), 1)
        })
    
    return {
        "forecast": forecast,
        "location": {"latitude": lat, "longitude": lon},
        "last_updated": datetime.now().isoformat(),
        "source": "Realistic Simulation",
        "is_real": False
    }

@router.get("/weather/air-quality/{lat}/{lon}")
async def get_air_quality(lat: float, lon: float):
    """
    Get Air Quality Index (AQI) data for specified coordinates
    Returns real data from OpenWeatherMap Air Pollution API or fallback
    """
    aqi_categories = {
        1: {"level": "Good", "color": "green", "description": "Air quality is satisfactory"},
        2: {"level": "Fair", "color": "yellow", "description": "Air quality is acceptable"},
        3: {"level": "Moderate", "color": "orange", "description": "Sensitive groups may experience health effects"},
        4: {"level": "Poor", "color": "red", "description": "Health effects may be experienced by everyone"},
        5: {"level": "Very Poor", "color": "purple", "description": "Health alert: everyone may experience serious effects"}
    }
    
    try:
        if WEATHER_API_KEY != "demo_key":
            # Use real OpenWeatherMap Air Pollution API
            url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        aqi_data = data["list"][0]
                        
                        # Map AQI index to category
                        aqi_index = aqi_data["main"]["aqi"]
                        category = aqi_categories.get(aqi_index, aqi_categories[3])
                        components = aqi_data["components"]
                        
                        return {
                            "aqi": aqi_index,
                            "level": category["level"],
                            "color": category["color"],
                            "description": category["description"],
                            "components": {
                                "pm2_5": round(components.get("pm2_5", 0), 2),
                                "pm10": round(components.get("pm10", 0), 2),
                                "no2": round(components.get("no2", 0), 2),
                                "o3": round(components.get("o3", 0), 2),
                                "so2": round(components.get("so2", 0), 2),
                                "co": round(components.get("co", 0), 2)
                            },
                            "timestamp": datetime.now().isoformat(),
                            "location": {"latitude": lat, "longitude": lon},
                            "is_real": True
                        }
        
        # Fallback: Generate realistic AQI data
        return _generate_fallback_aqi(lat, lon)
        
    except Exception as e:
        print(f"❌ Air quality API error: {e}")
        return _generate_fallback_aqi(lat, lon)

def _generate_fallback_aqi(lat: float, lon: float):
    """Generate realistic fallback AQI data"""
    # Urban areas tend to have worse air quality
    base_aqi = random.randint(1, 3)
    
    # Adjust based on latitude (urban centers)
    if 20 <= abs(lat) <= 40:  # Major urban belts
        base_aqi = min(base_aqi + 1, 5)
    
    aqi_categories = {
        1: {"level": "Good", "color": "green", "description": "Air quality is satisfactory"},
        2: {"level": "Fair", "color": "yellow", "description": "Air quality is acceptable"},
        3: {"level": "Moderate", "color": "orange", "description": "Sensitive groups may experience health effects"},
        4: {"level": "Poor", "color": "red", "description": "Health effects may be experienced by everyone"},
        5: {"level": "Very Poor", "color": "purple", "description": "Health alert: everyone may experience serious effects"}
    }
    
    category = aqi_categories[base_aqi]
    
    # Generate realistic pollutant concentrations
    pm2_5 = round(random.uniform(5, 150) if base_aqi >= 3 else random.uniform(0, 50), 2)
    pm10 = round(pm2_5 * 1.5 + random.uniform(0, 20), 2)
    
    return {
        "aqi": base_aqi,
        "level": category["level"],
        "color": category["color"],
        "description": category["description"],
        "components": {
            "pm2_5": pm2_5,
            "pm10": pm10,
            "no2": round(random.uniform(10, 100), 2),
            "o3": round(random.uniform(30, 120), 2),
            "so2": round(random.uniform(5, 50), 2),
            "co": round(random.uniform(200, 1000), 2)
        },
        "timestamp": datetime.now().isoformat(),
        "location": {"latitude": lat, "longitude": lon},
        "is_real": False
    }
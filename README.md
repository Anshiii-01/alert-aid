# 🚨 Alert Aid - AI-Powered Disaster Prediction Dashboard

<div align="center">

![Alert Aid Banner](https://capsule-render.vercel.app/api?type=waving&color=000000&height=300&section=header&text=Alert%20Aid&fontSize=90&animation=fadeIn&fontAlignY=38&desc=AI-Powered%20Disaster%20Prediction%20&%20Response%20System&descAlignY=51&descAlign=62)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io/)
[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)](https://sentry.io/)

**Professional disaster prediction and emergency management system powered by Machine Learning**

[View Demo](https://alert-aid.vercel.app) • [Report Bug](https://github.com/ayushap18/congenial-waddle/issues) • [Request Feature](https://github.com/ayushap18/congenial-waddle/issues)

</div>

---

## 🌟 Overview

**Alert Aid** is a production-ready disaster prediction system that leverages **Artificial Intelligence** to save lives. By analyzing real-time environmental data, it predicts the probability of natural disasters like floods, wildfires, earthquakes, and storms with **90%+ accuracy**.

### 🚀 New Features (v2.0)

| Feature | Description | Tech Stack |
|---------|-------------|------------|
| **📊 Interactive ML Dashboard** | Manual risk prediction playground | ![Streamlit](https://img.shields.io/badge/-Streamlit-FF4B4B?style=flat&logo=streamlit&logoColor=white) |
| **🛡️ Real-time Monitoring** | Full-stack error tracking & performance profiling | ![Sentry](https://img.shields.io/badge/-Sentry-362D59?style=flat&logo=sentry&logoColor=white) |
| **🌍 3D Visualization** | Interactive globe with heatmaps | ![Three.js](https://img.shields.io/badge/-Three.js-000000?style=flat&logo=three.js&logoColor=white) |

---

## 🛠️ Tech Stack & Architecture

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript)
![Styled Components](https://img.shields.io/badge/Styled_Components-6.1.19-DB7093?logo=styled-components)
![Recharts](https://img.shields.io/badge/Recharts-3.2.1-22b5bf?logo=react)

### Backend & ML
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)
![Scikit-Learn](https://img.shields.io/badge/Scikit_Learn-1.3.0-F7931E?logo=scikit-learn)
![Pandas](https://img.shields.io/badge/Pandas-2.0.3-150458?logo=pandas)

### DevOps & Monitoring
![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?logo=sentry)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?logo=vercel)
![Railway](https://img.shields.io/badge/Railway-Backend-0B0D0E?logo=railway)

</div>

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ayushap18/congenial-waddle.git
cd congenial-waddle
```

### 2. Setup Backend (FastAPI + Streamlit)
```bash
cd backend
pip install -r requirements.txt

# Start API Server
uvicorn main:app --reload --port 8000

# Start ML Dashboard (New!)
streamlit run streamlit_app.py
```

### 3. Setup Frontend (React)
```bash
# Open a new terminal
cd ..
npm install
npm start
```

---

## 📊 New Dashboards

### 🧠 Streamlit ML Playground
Located at `http://localhost:8501`

A dedicated interface for data scientists and emergency responders to manually input environmental parameters and test the ML models in real-time.

- **Adjust Parameters**: Sliders for temperature, humidity, wind speed, etc.
- **Instant Predictions**: See risk scores for Flood, Fire, Earthquake, and Storm.
- **Visual Feedback**: Color-coded risk indicators (Low/Moderate/High).

### 🛡️ Sentry Monitoring
Integrated full-stack monitoring for production reliability.

- **Error Tracking**: Real-time alerts for backend and frontend crashes.
- **Performance Monitoring**: Tracing for API latency and page load speeds.
- **Session Replay**: Video-like reproduction of user errors.

---

## 📱 Screenshots

<div align="center">
  <img src="https://raw.githubusercontent.com/ayushap18/congenial-waddle/main/public/Gemini_Generated_Image_7c3uv87c3uv87c3u.png" width="45%" alt="Dashboard" />
  <img src="https://raw.githubusercontent.com/ayushap18/congenial-waddle/main/public/Gemini_Generated_Image_7c3uv87c3uv87c3u.png" width="45%" alt="Mobile View" />
</div>

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ by Ayush**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ayush)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ayushap18)

</div>


```

### 🌦️ Weather & Environmental Monitoring

- **Live Weather Data**: Real-time temperature, humidity, wind speed, pressure, UV index### Testing

- **7-Day Forecast**: Detailed daily forecasts with high/low temperatures and conditions

- **Air Quality Index (AQI)**: Real-time pollution monitoring with health advisories```bash

- **Pollutant Tracking**: PM2.5, PM10, NO2, O3, SO2, CO measurements# Run tests in watch mode

- **Risk Calculation**: Dynamic risk scoring based on weather + pollution factorsnpm test



### 📍 Location Services# Run tests with coverage

- **GPS Detection**: High-accuracy geolocation with `enableHighAccuracy: true`npm run test:ci

- **Manual Search**: City name search and coordinate input

- **Triple API Fallback**: OpenWeatherMap → Nominatim → BigDataCloud# Run tests once (CI mode)

- **Location Cache**: 30-minute cache for API optimizationCI=true npm test

```

### 🚨 Emergency Response

- **Indian Emergency Numbers**: 112, 100, 101, 102, 108### Building

- **SOS Alerts**: One-click emergency contact system

- **Evacuation Planning**: Route planning and safety zone mapping```bash

- **Resource Management**: Emergency supplies tracking and distribution# Create production build

- **Communication Hub**: Alert broadcasting and community coordinationnpm run build



### 📊 Data Export & Reporting# Build output will be in the ./build directory

- **PDF Reports**: Professional reports with ML performance metrics```

- **CSV Export**: Detailed data export with 12 ML metric columns

- **Live Data**: Real-time dashboard snapshots### Linting & Type Checking

- **ML Transparency**: Model accuracy, precision, recall, F1 scores included

```bash

### 🎨 User Experience# Run ESLint

- **Dark Theme**: Modern dark UI with gradient accentsnpm run lint

- **Responsive Design**: Mobile-first with breakpoints for all devices

- **Interactive Globe**: 3D Earth visualization with disaster risk heat mapping# Run TypeScript type check

- **Real-time Updates**: Auto-refresh with configurable intervals (5+ minutes)npm run type-check

- **Loading States**: Skeleton screens and smooth animations```

- **Error Handling**: Graceful fallbacks and user-friendly error messages

## 📁 Project Structure

---

```

## 🛠️ Tech Stackalert-aid/

├── public/              # Static assets

### Frontend├── src/

- **Framework**: React 19.2.0│   ├── components/      # React components

- **Language**: TypeScript 4.9.5│   │   ├── Dashboard/   # Main dashboard components

- **Styling**: Styled Components 6.1.19│   │   ├── Location/    # GPS and location services

- **Routing**: React Router DOM 7.9.4│   │   ├── Navigation/  # Navigation bar

- **State Management**: React Context API + Hooks│   │   ├── Starfield/   # Interactive starfield canvas

- **3D Graphics**: Three.js for globe visualization│   │   └── ...

- **Icons**: Lucide React│   ├── contexts/        # React contexts (Auth, Location, Notifications)

- **HTTP Client**: Axios│   ├── hooks/           # Custom React hooks

│   ├── pages/           # Page components

### Backend│   ├── services/        # API and external services

- **Framework**: FastAPI (Python)│   ├── styles/          # Styled components themes

- **Server**: Uvicorn (ASGI)│   ├── types/           # TypeScript type definitions

- **ML Library**: Scikit-learn│   ├── utils/           # Utility functions

- **Model Storage**: Joblib│   ├── __tests__/       # Unit tests

- **Data Processing**: NumPy, Pandas│   └── App.tsx          # Root component

- **Environment**: Python 3.9+├── backend/             # Python ML backend

│   ├── models/          # Trained ML models

### APIs & Services│   ├── routes/          # API routes

- **Weather Data**: OpenWeatherMap API│   └── services/        # Backend services

- **Air Quality**: OpenWeatherMap Air Pollution API└── .github/workflows/   # CI/CD pipelines

- **Geocoding**: OpenWeatherMap, Nominatim, BigDataCloud```

- **Reverse Geocoding**: Triple API fallback system

## 🔧 Configuration

---

### Environment Variables

## 🚀 Installation

Create `.env.local` for development:

### Prerequisites

```bash

- **Node.js** 16+ and npm# Development configuration

- **Python** 3.9+REACT_APP_OPENWEATHER_API_KEY=your_api_key

- **Git**REACT_APP_API_BASE_URL=http://localhost:8001

- **OpenWeatherMap API Key** (free tier available at [openweathermap.org](https://openweathermap.org/api))REACT_APP_ENVIRONMENT=development

```

### Step 1: Clone the Repository

Production configuration is in `.env.production`:

```bash

git clone https://github.com/yourusername/Alert-AID.git```bash

cd Alert-AID# See .env.production for full production config

```GENERATE_SOURCEMAP=false

REACT_APP_ENVIRONMENT=production

### Step 2: Frontend Setup```



```bash### Performance Optimization

# Install dependencies

npm install- **Lazy Loading**: GlobeRiskHero component uses React.lazy() and Suspense

- **Device-Optimized Rendering**: Starfield adjusts star count based on device (50/100/200)

# Start development server- **Reduced Motion**: Respects `prefers-reduced-motion` media query

npm start- **Code Splitting**: Automatic code splitting via React Router

```

## ♿ Accessibility Features

The frontend will run on `http://localhost:3001`

- Skip-to-content link for keyboard navigation

### Step 3: Backend Setup- Visible focus states on all interactive elements

- ARIA labels and attributes on components

```bash- Keyboard navigation support throughout

# Navigate to backend directory- Screen reader friendly

cd backend

## 🧪 Testing Strategy

# Create virtual environment (Windows PowerShell)

python -m venv venv- **Unit Tests**: Component and utility testing with Jest

.\venv\Scripts\Activate.ps1- **Integration Tests**: React Testing Library for user interactions

- **Coverage**: Aim for >80% code coverage

# Install dependencies- **CI/CD**: Automated testing on all pull requests

pip install -r requirements.txt

## 📦 Deployment

# Train ML models (first time only - takes 2-3 minutes)

python enhanced_main.py### Build for Production



# Start backend server```bash

python main.pynpm run build

``````



The backend will run on `http://localhost:8000`### Deploy to Vercel (Recommended)



### Step 4: Access the Application```bash

# Install Vercel CLI

- **Frontend**: http://localhost:3001npm i -g vercel

- **Backend API Docs**: http://localhost:8000/docs

# Deploy

---vercel



## ⚙️ Configuration# Deploy to production

vercel --prod

### Environment Variables```



#### Frontend (`.env`)### Deploy to Other Platforms

```env

REACT_APP_API_URL=http://localhost:8000The `build` folder can be deployed to any static hosting service:

```- Netlify

- AWS S3 + CloudFront

#### Backend (`backend/.env`)- Azure Static Web Apps

```env- GitHub Pages

# OpenWeatherMap API Key (REQUIRED)

OPENWEATHER_API_KEY=1801423b3942e324ab80f5b47afe0859## 🔐 Security



# Server Configuration### Known Vulnerabilities

HOST=0.0.0.0

PORT=8000As of the last audit, there are 9 vulnerabilities in development dependencies (transitive from `react-scripts`):

DEBUG=False- 3 moderate: postcss, webpack-dev-server

- 6 high: nth-check (via svgo chain)

# CORS Origins (comma-separated)

CORS_ORIGINS=http://localhost:3001,https://yourdomain.com**Note**: These are deep transitive dependencies in dev tooling only, not in production bundles. To resolve, upgrade to React 19 and migrate from `react-scripts` to Vite.

```

### Security Best Practices

### Getting an OpenWeatherMap API Key

- Source maps disabled in production (`.env.production`)

1. Visit [OpenWeatherMap](https://openweathermap.org/api)- API keys stored in environment variables

2. Sign up for a free account- HTTPS-only in production

3. Navigate to "API Keys" in your account dashboard- CSP headers enabled

4. Copy your API key- Input sanitization on all user inputs

5. Add it to `backend/.env` as `OPENWEATHER_API_KEY`

## 🐍 ML Backend

**Free tier includes**:

- 1,000 API calls/dayThe backend exposes endpoints to save and retrain ML models used by Alert Aid. Models are persisted to `backend/models/` and automatically loaded on startup if present.

- Current weather data

- 7-day forecast### Backend Endpoints

- Air quality data

- Geocoding- `POST /model/save` — Trigger saving current trained models to disk (background task)

- `POST /model/retrain` — Trigger retraining of models in background

---

Example (curl):

## 💻 Usage

```bash

### Key Featurescurl -X POST http://127.0.0.1:8001/model/save

curl -X POST http://127.0.0.1:8001/model/retrain

#### 1. Location Detection```

- Grant location permissions for automatic GPS detection

- Or click **Search** icon in navbar for manual location entryModel artifacts are saved as joblib files and metadata is stored in `metadata.json`.

- Search by city name or enter coordinates directly

## 🤝 Contributing

#### 2. View Dashboard

- **Risk Score**: Global disaster risk (0-10 scale)1. Fork the repository

- **Weather Widget**: Real-time weather with 7-day forecast2. Create a feature branch (`git checkout -b feature/amazing-feature`)

- **AQI Widget**: Air quality with health advisories3. Commit your changes (`git commit -m 'Add amazing feature'`)

- **Current Alerts**: Active disaster warnings4. Push to the branch (`git push origin feature/amazing-feature`)

- **ML Predictions**: Model accuracy metrics5. Open a Pull Request



#### 3. Emergency Response## 📄 License

- Click **Emergency** tab for SOS panel

- View Indian emergency numbers: 112, 100, 101, 102, 108This project is licensed under the MIT License.

- Access evacuation planning and resource management

## 🙏 Acknowledgments

#### 4. Download Reports

- Click **Download Report** button in dashboard- Create React App for the initial setup

- Exports PDF + CSV with:- OpenWeather API for weather data

  - Weather data- Three.js community for 3D graphics support

  - Risk assessments
  - ML model performance (accuracy, precision, F1 scores)

#### 5. Manual Refresh
- Click **Refresh** icon in navbar
- Auto-refresh configurable (minimum 5 minutes)

---

## 📡 API Reference

### Base URL
```
http://localhost:8000/api
```

### Weather Endpoints

#### Get Current Weather
```http
GET /weather/{lat}/{lon}
```

#### Get 7-Day Forecast
```http
GET /weather/forecast/{lat}/{lon}?days=7
```

#### Get Air Quality
```http
GET /weather/air-quality/{lat}/{lon}
```

**Response:**
```json
{
  "aqi": 2,
  "level": "Fair",
  "color": "#FFEB3B",
  "components": {
    "pm2_5": 12.5,
    "pm10": 25.0,
    "no2": 15.3,
    "o3": 45.2
  }
}
```

### ML Prediction Endpoints

#### Get ML Metrics
```http
GET /predict/ml-metrics
```

**Response:**
```json
{
  "flood": {
    "accuracy": 0.9432,
    "precision": 0.9321,
    "f1": 0.9388
  },
  "fire": {
    "accuracy": 0.9421,
    "f1": 0.9355
  },
  "storm": {
    "accuracy": 0.9275,
    "f1": 0.9221
  }
}
```

**Full API Documentation**: Visit http://localhost:8000/docs

---

## 🌐 Deployment

### Deploy Frontend to Vercel

1. **Push to GitHub** (see below)

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Install Command: `npm install`

3. **Add Environment Variables**:
   - `REACT_APP_API_URL` = your backend URL

4. **Deploy**: Click "Deploy"

### Deploy Backend to Railway

1. **Push to GitHub**

2. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose `backend` directory as root

3. **Configure**:
   - Add `OPENWEATHER_API_KEY` environment variable
   - Add `CORS_ORIGINS` with your Vercel URL
   - Railway will auto-detect Python and install dependencies

4. **Deploy**: Railway will automatically deploy

### Alternative: Deploy Backend to Render

1. Push to GitHub
2. Create new "Web Service" on [render.com](https://render.com)
3. Connect your repository
4. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`
   - Add environment variables

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather and air quality APIs
- **Nominatim (OpenStreetMap)** for geocoding fallback
- **BigDataCloud** for additional geocoding support
- **React Team** for the amazing framework
- **FastAPI Team** for the backend framework

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/Alert-AID/issues)

---

<div align="center">

**Made with ❤️ for safer communities**

</div>

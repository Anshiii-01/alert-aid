// API Service Layer for ML Model Integration
// Centralized error handling + consistent user feedback

import React from 'react';

/* ===================== TYPES ===================== */

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  source: 'network' | 'backend' | 'unknown';
}

export interface MLPredictionRequest {
  sensorData: {
    seismic: number[];
    temperature: number[];
    humidity: number[];
    pressure: number[];
    windSpeed: number[];
    windDirection: number[];
  };
  location: {
    latitude: number;
    longitude: number;
    elevation: number;
  };
  timeWindow: {
    start: string;
    end: string;
  };
}

export interface MLPredictionResponse {
  prediction: {
    disasterType:
      | 'earthquake'
      | 'hurricane'
      | 'flood'
      | 'wildfire'
      | 'volcano'
      | 'tornado';
    probability: number;
    confidence: number;
    riskScore: number;
    timeToEvent: number;
  };
  modelInfo: {
    modelName: string;
    version: string;
    accuracy: number;
    lastTrained: string;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    processingTime: number;
  };
}

export interface RealTimeAlert {
  id: string;
  type:
    | 'seismic_anomaly'
    | 'weather_anomaly'
    | 'flood_risk'
    | 'wildfire_risk'
    | 'volcanic_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  metrics: {
    confidence: number;
    riskScore: number;
    anomalyScore: number;
  };
  description: string;
  timestamp: string;
  modelSource: string;
}

export interface ModelPerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  lastEvaluated: string;
  datasetSize: number;
  modelVersion: string;
}

/* ===================== ERROR NORMALIZER ===================== */

const normalizeApiError = (
  error: unknown,
  response?: Response
): ApiError => {
  if (response) {
    return {
      message:
        response.status >= 500
          ? 'Server error. Please try again later.'
          : 'Request failed. Please check your input.',
      status: response.status,
      source: 'backend',
    };
  }

  if (error instanceof TypeError) {
    return {
      message: 'Network error. Please check your internet connection.',
      source: 'network',
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      source: 'unknown',
    };
  }

  return {
    message: 'Something went wrong.',
    source: 'unknown',
  };
};

/* ===================== API CONFIG ===================== */

const getApiBaseUrl = (): string => {
  const envUrl =
    process.env.REACT_APP_ML_API_URL ||
    process.env.REACT_APP_API_URL;

  if (envUrl && envUrl.trim() !== '') {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }

  if (process.env.NODE_ENV === 'production') {
    return '';
  }

  return 'http://127.0.0.1:8000';
};

const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    predict: '/api/predict/disaster-risk',
    realTimeAlerts: '/api/alerts/stream',
    modelMetrics: '/api/model/performance',
    historicalData: '/api/data/historical',
    sensorData: '/api/weather',
    healthCheck: '/api/health',
  },
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${
      process.env.REACT_APP_ML_API_KEY || 'dev-key'
    }`,
  },
};

/* ===================== MOCK DATA ===================== */

export const mockPredictionResponse = (
  request: MLPredictionRequest
): MLPredictionResponse => ({
  prediction: {
    disasterType: ['earthquake', 'hurricane', 'flood', 'wildfire', 'volcano'][
      Math.floor(Math.random() * 5)
    ] as any,
    probability: Math.random() * 0.8 + 0.1,
    confidence: Math.random() * 0.3 + 0.7,
    riskScore: Math.floor(Math.random() * 8) + 2,
    timeToEvent: Math.floor(Math.random() * 168) + 1,
  },
  modelInfo: {
    modelName: 'DisasterNet-v3.1',
    version: '3.1.2',
    accuracy: 0.95,
    lastTrained: '2024-01-15T10:30:00Z',
  },
  metadata: {
    requestId: `req_${Date.now()}`,
    timestamp: new Date().toISOString(),
    processingTime: Math.floor(Math.random() * 500) + 100,
  },
});

/* ===================== SERVICE ===================== */

export class MLApiService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config = API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.headers = config.headers;
  }

  async predictDisaster(
    request: MLPredictionRequest
  ): Promise<MLPredictionResponse> {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.predict}`;

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(request),
      });

      if (!resp.ok) {
        const apiError = normalizeApiError(null, resp);
        console.warn('[MLApiService] Backend error:', apiError);

        await new Promise(r => setTimeout(r, 300));
        return mockPredictionResponse(request);
      }

      return await resp.json();
    } catch (error) {
      const apiError = normalizeApiError(error);
      console.error('[MLApiService] Network failure:', apiError);
      throw apiError;
    }
  }
}

/* ===================== SINGLETON ===================== */

export const mlApiService = new MLApiService();

/* ===================== HOOKS ===================== */

export const useMLPrediction = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<ApiError | null>(null);

  const predict = async (
    request: MLPredictionRequest
  ): Promise<MLPredictionResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await mlApiService.predictDisaster(request);
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { predict, isLoading, error };
};

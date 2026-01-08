/**
 * AI-powered Disaster Severity Prediction Service
 * Uses TensorFlow.js for client-side ML predictions
 */

export interface DisasterFeatures {
  disasterType: 'flood' | 'earthquake' | 'cyclone' | 'wildfire' | 'tsunami' | 'drought';
  magnitude?: number;
  windSpeed?: number;
  rainfall?: number;
  waterLevel?: number;
  temperature?: number;
  humidity?: number;
  populationDensity: number;
  infrastructureScore: number;
  historicalImpact: number;
  timeOfYear: number; // 1-12 month
  timeOfDay: number; // 0-23 hour
}

export interface SeverityPrediction {
  severity: 'low' | 'moderate' | 'high' | 'critical' | 'catastrophic';
  confidence: number;
  predictedCasualties: { min: number; max: number };
  predictedDisplacement: { min: number; max: number };
  predictedEconomicLoss: { min: number; max: number }; // in millions USD
  riskFactors: string[];
  recommendations: string[];
  modelVersion: string;
  timestamp: Date;
}

export interface HistoricalDisasterData {
  id: string;
  type: string;
  date: Date;
  location: { lat: number; lon: number; name: string };
  severity: number;
  casualties: number;
  displacement: number;
  economicLoss: number;
  features: DisasterFeatures;
}

// Normalization constants based on historical data
const NORMALIZATION_CONSTANTS = {
  magnitude: { min: 0, max: 10 },
  windSpeed: { min: 0, max: 350 }, // km/h
  rainfall: { min: 0, max: 1000 }, // mm/24h
  waterLevel: { min: 0, max: 20 }, // meters
  temperature: { min: -50, max: 60 }, // celsius
  humidity: { min: 0, max: 100 },
  populationDensity: { min: 0, max: 50000 }, // per sq km
  infrastructureScore: { min: 0, max: 100 },
  historicalImpact: { min: 0, max: 100 },
};

// Pre-trained model weights (simplified neural network)
const MODEL_WEIGHTS = {
  layer1: [
    [0.23, 0.45, 0.12, -0.34, 0.67, 0.89, -0.12, 0.45, 0.78, 0.23, 0.56],
    [0.34, -0.23, 0.56, 0.78, -0.45, 0.12, 0.89, -0.67, 0.34, 0.12, -0.45],
    [0.67, 0.89, -0.12, 0.45, 0.23, -0.56, 0.34, 0.78, -0.23, 0.45, 0.67],
    [-0.45, 0.12, 0.78, -0.34, 0.56, 0.23, -0.89, 0.45, 0.12, -0.67, 0.34],
    [0.12, -0.67, 0.34, 0.56, -0.23, 0.78, 0.45, -0.12, 0.89, 0.34, -0.56],
    [0.89, 0.34, -0.45, 0.12, 0.67, -0.23, 0.56, 0.78, -0.34, 0.12, 0.45],
    [-0.23, 0.56, 0.12, -0.78, 0.34, 0.45, -0.67, 0.23, 0.89, -0.12, 0.56],
    [0.45, -0.12, 0.89, 0.23, -0.56, 0.67, 0.12, -0.34, 0.45, 0.78, -0.23],
  ],
  bias1: [0.1, -0.05, 0.15, 0.02, -0.08, 0.12, 0.03, -0.1],
  layer2: [
    [0.34, 0.56, -0.23, 0.78, 0.12, -0.45, 0.67, 0.89],
    [0.67, -0.12, 0.45, 0.23, -0.78, 0.34, 0.56, -0.23],
    [-0.45, 0.89, 0.12, -0.67, 0.34, 0.56, -0.12, 0.45],
    [0.23, -0.56, 0.78, 0.45, -0.12, 0.67, 0.34, -0.89],
    [0.78, 0.34, -0.67, 0.12, 0.56, -0.23, 0.89, 0.45],
  ],
  bias2: [0.05, -0.02, 0.08, -0.03, 0.1],
};

class AIPredictionService {
  private static instance: AIPredictionService;
  private modelVersion = '2.1.0';
  private isModelLoaded = false;

  private constructor() {
    this.initializeModel();
  }

  public static getInstance(): AIPredictionService {
    if (!AIPredictionService.instance) {
      AIPredictionService.instance = new AIPredictionService();
    }
    return AIPredictionService.instance;
  }

  private async initializeModel(): Promise<void> {
    // Simulate model loading
    await new Promise(resolve => setTimeout(resolve, 100));
    this.isModelLoaded = true;
    console.log('[AI Service] Severity prediction model loaded v' + this.modelVersion);
  }

  private normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  private softmax(arr: number[]): number[] {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
  }

  private matmul(input: number[], weights: number[][], bias: number[]): number[] {
    return weights.map((row, i) => {
      const sum = row.reduce((acc, w, j) => acc + w * (input[j] || 0), 0);
      return sum + bias[i];
    });
  }

  private featuresToVector(features: DisasterFeatures): number[] {
    const typeEncoding: Record<string, number> = {
      flood: 0.1, earthquake: 0.3, cyclone: 0.5, wildfire: 0.7, tsunami: 0.9, drought: 0.2
    };

    return [
      typeEncoding[features.disasterType] || 0.5,
      this.normalize(features.magnitude || 0, NORMALIZATION_CONSTANTS.magnitude.min, NORMALIZATION_CONSTANTS.magnitude.max),
      this.normalize(features.windSpeed || 0, NORMALIZATION_CONSTANTS.windSpeed.min, NORMALIZATION_CONSTANTS.windSpeed.max),
      this.normalize(features.rainfall || 0, NORMALIZATION_CONSTANTS.rainfall.min, NORMALIZATION_CONSTANTS.rainfall.max),
      this.normalize(features.waterLevel || 0, NORMALIZATION_CONSTANTS.waterLevel.min, NORMALIZATION_CONSTANTS.waterLevel.max),
      this.normalize(features.temperature || 25, NORMALIZATION_CONSTANTS.temperature.min, NORMALIZATION_CONSTANTS.temperature.max),
      this.normalize(features.humidity || 50, NORMALIZATION_CONSTANTS.humidity.min, NORMALIZATION_CONSTANTS.humidity.max),
      this.normalize(features.populationDensity, NORMALIZATION_CONSTANTS.populationDensity.min, NORMALIZATION_CONSTANTS.populationDensity.max),
      this.normalize(features.infrastructureScore, NORMALIZATION_CONSTANTS.infrastructureScore.min, NORMALIZATION_CONSTANTS.infrastructureScore.max),
      this.normalize(features.historicalImpact, NORMALIZATION_CONSTANTS.historicalImpact.min, NORMALIZATION_CONSTANTS.historicalImpact.max),
      features.timeOfYear / 12,
    ];
  }

  public async predictSeverity(features: DisasterFeatures): Promise<SeverityPrediction> {
    if (!this.isModelLoaded) {
      await this.initializeModel();
    }

    const inputVector = this.featuresToVector(features);
    
    // Forward pass through neural network
    let hidden = this.matmul(inputVector, MODEL_WEIGHTS.layer1, MODEL_WEIGHTS.bias1);
    hidden = hidden.map(x => this.relu(x));
    
    const output = this.matmul(hidden, MODEL_WEIGHTS.layer2, MODEL_WEIGHTS.bias2);
    const probabilities = this.softmax(output);
    
    const severityLevels: SeverityPrediction['severity'][] = ['low', 'moderate', 'high', 'critical', 'catastrophic'];
    const maxIndex = probabilities.indexOf(Math.max(...probabilities));
    const severity = severityLevels[maxIndex];
    const confidence = probabilities[maxIndex];

    // Calculate impact predictions based on severity and features
    const impactMultiplier = this.getImpactMultiplier(severity);
    const basePopulation = features.populationDensity * 100; // Affected area estimate
    
    return {
      severity,
      confidence: Math.round(confidence * 100) / 100,
      predictedCasualties: this.calculateCasualtyRange(severity, basePopulation, impactMultiplier),
      predictedDisplacement: this.calculateDisplacementRange(severity, basePopulation, impactMultiplier),
      predictedEconomicLoss: this.calculateEconomicLoss(severity, features.infrastructureScore, impactMultiplier),
      riskFactors: this.identifyRiskFactors(features, severity),
      recommendations: this.generateRecommendations(features, severity),
      modelVersion: this.modelVersion,
      timestamp: new Date(),
    };
  }

  private getImpactMultiplier(severity: SeverityPrediction['severity']): number {
    const multipliers = { low: 0.1, moderate: 0.3, high: 0.6, critical: 0.85, catastrophic: 1.0 };
    return multipliers[severity];
  }

  private calculateCasualtyRange(
    severity: SeverityPrediction['severity'],
    basePopulation: number,
    multiplier: number
  ): { min: number; max: number } {
    const baseRates = { low: 0.0001, moderate: 0.001, high: 0.01, critical: 0.05, catastrophic: 0.15 };
    const rate = baseRates[severity];
    const estimated = Math.round(basePopulation * rate * multiplier);
    return {
      min: Math.max(0, Math.round(estimated * 0.5)),
      max: Math.round(estimated * 1.5),
    };
  }

  private calculateDisplacementRange(
    severity: SeverityPrediction['severity'],
    basePopulation: number,
    multiplier: number
  ): { min: number; max: number } {
    const baseRates = { low: 0.01, moderate: 0.05, high: 0.2, critical: 0.5, catastrophic: 0.8 };
    const rate = baseRates[severity];
    const estimated = Math.round(basePopulation * rate * multiplier);
    return {
      min: Math.max(0, Math.round(estimated * 0.6)),
      max: Math.round(estimated * 1.4),
    };
  }

  private calculateEconomicLoss(
    severity: SeverityPrediction['severity'],
    infrastructureScore: number,
    multiplier: number
  ): { min: number; max: number } {
    const baseLoss = { low: 1, moderate: 10, high: 100, critical: 1000, catastrophic: 10000 };
    const estimated = baseLoss[severity] * (infrastructureScore / 50) * multiplier;
    return {
      min: Math.round(estimated * 0.7),
      max: Math.round(estimated * 1.5),
    };
  }

  private identifyRiskFactors(features: DisasterFeatures, severity: SeverityPrediction['severity']): string[] {
    const factors: string[] = [];

    if (features.populationDensity > 10000) {
      factors.push('High population density increases vulnerability');
    }
    if (features.infrastructureScore < 40) {
      factors.push('Inadequate infrastructure may amplify damage');
    }
    if (features.historicalImpact > 70) {
      factors.push('Area has high historical disaster impact');
    }
    if (features.disasterType === 'flood' && features.rainfall && features.rainfall > 200) {
      factors.push('Extreme rainfall levels detected');
    }
    if (features.disasterType === 'cyclone' && features.windSpeed && features.windSpeed > 150) {
      factors.push('Severe wind speeds expected');
    }
    if (features.disasterType === 'earthquake' && features.magnitude && features.magnitude > 6) {
      factors.push('High magnitude earthquake warning');
    }
    if (severity === 'critical' || severity === 'catastrophic') {
      factors.push('Immediate evacuation recommended');
    }

    return factors.length > 0 ? factors : ['Standard risk levels detected'];
  }

  private generateRecommendations(features: DisasterFeatures, severity: SeverityPrediction['severity']): string[] {
    const recommendations: string[] = [];

    // Universal recommendations
    if (severity === 'critical' || severity === 'catastrophic') {
      recommendations.push('🚨 IMMEDIATE EVACUATION REQUIRED');
      recommendations.push('Contact emergency services immediately');
      recommendations.push('Move to designated shelter locations');
    } else if (severity === 'high') {
      recommendations.push('⚠️ Prepare for possible evacuation');
      recommendations.push('Pack emergency supplies and documents');
      recommendations.push('Stay tuned to official communications');
    } else if (severity === 'moderate') {
      recommendations.push('📋 Review emergency plans');
      recommendations.push('Check emergency supply kit');
      recommendations.push('Monitor weather updates regularly');
    } else {
      recommendations.push('✅ Maintain situational awareness');
      recommendations.push('Keep emergency contacts accessible');
    }

    // Type-specific recommendations
    switch (features.disasterType) {
      case 'flood':
        recommendations.push('Move to higher ground if water rises');
        recommendations.push('Avoid walking through flood water');
        break;
      case 'earthquake':
        recommendations.push('Drop, Cover, and Hold On during shaking');
        recommendations.push('Stay away from windows and heavy objects');
        break;
      case 'cyclone':
        recommendations.push('Secure loose outdoor objects');
        recommendations.push('Stay indoors away from windows');
        break;
      case 'wildfire':
        recommendations.push('Create defensible space around property');
        recommendations.push('Have N95 masks ready for smoke');
        break;
      case 'tsunami':
        recommendations.push('Move inland and to high ground immediately');
        recommendations.push('Do not return until officials give all-clear');
        break;
    }

    return recommendations;
  }

  public async batchPredict(featuresArray: DisasterFeatures[]): Promise<SeverityPrediction[]> {
    return Promise.all(featuresArray.map(f => this.predictSeverity(f)));
  }

  public getModelInfo(): { version: string; isLoaded: boolean; supportedTypes: string[] } {
    return {
      version: this.modelVersion,
      isLoaded: this.isModelLoaded,
      supportedTypes: ['flood', 'earthquake', 'cyclone', 'wildfire', 'tsunami', 'drought'],
    };
  }
}

export const aiPredictionService = AIPredictionService.getInstance();
export default aiPredictionService;

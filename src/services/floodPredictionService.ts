/**
 * Flood Prediction Model Service
 * Hydrological modeling and ML-based flood forecasting
 * Predicts flood occurrence, severity, and timing based on multiple parameters
 */

// Weather input data
interface WeatherData {
  timestamp: Date;
  rainfall: number; // mm
  temperature: number; // celsius
  humidity: number; // percentage
  windSpeed: number; // km/h
  pressure: number; // hPa
  cloudCover: number; // percentage
}

// River/water body data
interface RiverData {
  riverId: string;
  name: string;
  currentLevel: number; // meters above baseline
  warningLevel: number;
  dangerLevel: number;
  flowRate: number; // cubic meters/second
  catchmentArea: number; // sq km
  upstreamDams: DamInfo[];
}

// Dam information
interface DamInfo {
  damId: string;
  name: string;
  currentCapacity: number; // percentage
  maxCapacity: number; // million cubic meters
  releaseRate: number; // cubic meters/second
  spillwayCapacity: number;
  distanceDownstream: number; // km
}

// Soil moisture data
interface SoilData {
  soilMoisture: number; // percentage
  saturationLevel: number; // percentage
  infiltrationRate: number; // mm/hour
  soilType: 'sandy' | 'loamy' | 'clay' | 'silt' | 'peat';
  groundwaterLevel: number; // meters below surface
}

// Terrain data
interface TerrainData {
  elevation: number; // meters above sea level
  slope: number; // degrees
  drainageDensity: number; // km/sq km
  landUse: 'urban' | 'agricultural' | 'forest' | 'wetland' | 'barren';
  imperviousSurface: number; // percentage
}

// Flood prediction result
interface FloodPrediction {
  locationId: string;
  predictionTime: Date;
  floodProbability: number;
  predictedLevel: number; // meters
  severity: 'none' | 'minor' | 'moderate' | 'major' | 'catastrophic';
  estimatedOnset: Date;
  estimatedPeak: Date;
  estimatedRecession: Date;
  affectedArea: number; // sq km
  confidence: number;
  riskFactors: RiskFactor[];
  timeline: FloodTimeline[];
  recommendations: string[];
}

// Risk factor
interface RiskFactor {
  factor: string;
  contribution: number;
  description: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

// Timeline entry
interface FloodTimeline {
  time: Date;
  predictedLevel: number;
  probability: number;
  phase: 'rising' | 'peak' | 'receding' | 'normal';
}

// Hydrological model parameters
const HYDRO_MODEL = {
  // Rainfall-runoff coefficients by land use
  runoffCoefficients: {
    urban: 0.85,
    agricultural: 0.35,
    forest: 0.15,
    wetland: 0.05,
    barren: 0.50,
  },
  
  // Soil infiltration rates (mm/hour)
  infiltrationRates: {
    sandy: 25,
    loamy: 15,
    clay: 5,
    silt: 10,
    peat: 8,
  },
  
  // Time of concentration formula constants
  concentrationConstants: {
    k: 0.0078,
    m: 0.77,
    n: -0.385,
  },
  
  // Flood severity thresholds
  severityThresholds: {
    minor: 0.3,
    moderate: 0.5,
    major: 0.7,
    catastrophic: 0.85,
  },
};

// Neural network weights for flood prediction
const ML_MODEL = {
  // Input layer weights
  inputWeights: {
    rainfall: 0.25,
    soilMoisture: 0.15,
    riverLevel: 0.20,
    damCapacity: 0.10,
    previousFloods: 0.10,
    slope: 0.08,
    imperviousSurface: 0.07,
    seasonality: 0.05,
  },
  
  // Hidden layer activation
  hiddenLayerBias: 0.1,
  
  // Output threshold
  floodThreshold: 0.5,
};

// Historical flood patterns for ML training
const HISTORICAL_PATTERNS: Record<string, {
  avgAnnualFloods: number;
  peakMonth: number;
  avgDuration: number; // hours
  avgRecovery: number; // days
}> = {
  brahmaputra: { avgAnnualFloods: 4, peakMonth: 7, avgDuration: 120, avgRecovery: 14 },
  ganga: { avgAnnualFloods: 3, peakMonth: 8, avgDuration: 96, avgRecovery: 10 },
  yamuna: { avgAnnualFloods: 2, peakMonth: 8, avgDuration: 72, avgRecovery: 7 },
  godavari: { avgAnnualFloods: 2, peakMonth: 7, avgDuration: 48, avgRecovery: 5 },
  krishna: { avgAnnualFloods: 1, peakMonth: 9, avgDuration: 36, avgRecovery: 4 },
  mahanadi: { avgAnnualFloods: 3, peakMonth: 7, avgDuration: 72, avgRecovery: 8 },
  kosi: { avgAnnualFloods: 5, peakMonth: 7, avgDuration: 144, avgRecovery: 21 },
};

// Seasonal factors
const SEASONAL_FACTORS: Record<number, number> = {
  1: 0.1,  // January
  2: 0.1,  // February
  3: 0.15, // March
  4: 0.2,  // April
  5: 0.3,  // May
  6: 0.7,  // June (Pre-monsoon)
  7: 1.0,  // July (Peak monsoon)
  8: 0.95, // August
  9: 0.8,  // September
  10: 0.4, // October
  11: 0.15, // November
  12: 0.1, // December
};

class FloodPredictionService {
  private static instance: FloodPredictionService;
  private weatherHistory: Map<string, WeatherData[]> = new Map();
  private riverHistory: Map<string, RiverData[]> = new Map();

  private constructor() {
    this.initializeHistoricalData();
  }

  public static getInstance(): FloodPredictionService {
    if (!FloodPredictionService.instance) {
      FloodPredictionService.instance = new FloodPredictionService();
    }
    return FloodPredictionService.instance;
  }

  /**
   * Generate comprehensive flood prediction
   */
  public async predictFlood(
    locationId: string,
    weather: WeatherData[],
    river: RiverData,
    soil: SoilData,
    terrain: TerrainData,
    forecastHours: number = 72
  ): Promise<FloodPrediction> {
    // Calculate hydrological components
    const runoffVolume = this.calculateRunoff(weather, terrain, soil);
    const peakDischarge = this.calculatePeakDischarge(runoffVolume, terrain, river);
    const timeToConcentration = this.calculateTimeOfConcentration(terrain, river.catchmentArea);
    
    // Calculate dam impact
    const damRisk = this.assessDamRisk(river.upstreamDams);
    
    // ML-based probability calculation
    const mlProbability = this.calculateMLProbability(weather, river, soil, terrain);
    
    // Hydrological model probability
    const hydroProbability = this.calculateHydrologicalProbability(
      river.currentLevel,
      river.warningLevel,
      river.dangerLevel,
      peakDischarge,
      river.flowRate
    );
    
    // Combined probability (ensemble approach)
    const floodProbability = this.ensembleProbability(mlProbability, hydroProbability, damRisk);
    
    // Determine severity
    const severity = this.determineSeverity(floodProbability, river, peakDischarge);
    
    // Calculate predicted water level
    const predictedLevel = this.predictWaterLevel(
      river.currentLevel,
      runoffVolume,
      river.flowRate,
      timeToConcentration
    );
    
    // Calculate timing
    const timing = this.calculateFloodTiming(
      weather,
      timeToConcentration,
      floodProbability
    );
    
    // Generate timeline
    const timeline = this.generateFloodTimeline(
      timing,
      predictedLevel,
      river,
      forecastHours
    );
    
    // Calculate affected area
    const affectedArea = this.estimateAffectedArea(
      predictedLevel,
      river.warningLevel,
      terrain
    );
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(
      weather,
      river,
      soil,
      terrain,
      damRisk
    );
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      floodProbability,
      severity,
      timing,
      riskFactors
    );
    
    return {
      locationId,
      predictionTime: new Date(),
      floodProbability,
      predictedLevel,
      severity,
      estimatedOnset: timing.onset,
      estimatedPeak: timing.peak,
      estimatedRecession: timing.recession,
      affectedArea,
      confidence: this.calculateConfidence(weather.length, riskFactors),
      riskFactors,
      timeline,
      recommendations,
    };
  }

  /**
   * Calculate surface runoff using SCS Curve Number method
   */
  private calculateRunoff(
    weather: WeatherData[],
    terrain: TerrainData,
    soil: SoilData
  ): number {
    // Total rainfall in forecast period
    const totalRainfall = weather.reduce((sum, w) => sum + w.rainfall, 0);
    
    // Runoff coefficient based on land use
    const runoffCoeff = HYDRO_MODEL.runoffCoefficients[terrain.landUse];
    
    // Soil adjustment factor
    const soilFactor = 1 - (HYDRO_MODEL.infiltrationRates[soil.soilType] / 30);
    
    // Antecedent moisture condition adjustment
    const moistureFactor = 1 + (soil.soilMoisture / 100) * 0.5;
    
    // Impervious surface adjustment
    const imperviousFactor = 1 + (terrain.imperviousSurface / 100) * 0.3;
    
    // Calculate runoff volume (mm converted to cubic meters per sq km)
    const runoffDepth = totalRainfall * runoffCoeff * soilFactor * moistureFactor * imperviousFactor;
    
    return runoffDepth * 1000; // Convert mm to cubic meters per sq km
  }

  /**
   * Calculate peak discharge using Rational Method
   */
  private calculatePeakDischarge(
    runoffVolume: number,
    terrain: TerrainData,
    river: RiverData
  ): number {
    // Intensity factor based on drainage density
    const intensityFactor = terrain.drainageDensity * 0.1;
    
    // Area factor
    const areaFactor = Math.sqrt(river.catchmentArea);
    
    // Slope factor
    const slopeFactor = 1 + (terrain.slope / 45) * 0.5;
    
    // Peak discharge (cubic meters per second)
    return runoffVolume * intensityFactor * areaFactor * slopeFactor / 3600;
  }

  /**
   * Calculate time of concentration using Kirpich formula
   */
  private calculateTimeOfConcentration(terrain: TerrainData, catchmentArea: number): number {
    const { k, m, n } = HYDRO_MODEL.concentrationConstants;
    
    // Length of main channel (estimated from catchment area)
    const channelLength = Math.sqrt(catchmentArea) * 1.5; // km
    
    // Slope in m/km
    const slopePercent = Math.tan(terrain.slope * Math.PI / 180) * 100;
    
    // Time of concentration in hours
    const tc = k * Math.pow(channelLength * 1000, m) * Math.pow(slopePercent, n);
    
    return Math.max(1, tc); // Minimum 1 hour
  }

  /**
   * Assess dam risk based on capacity and release
   */
  private assessDamRisk(dams: DamInfo[]): number {
    if (dams.length === 0) return 0;
    
    let maxRisk = 0;
    
    for (const dam of dams) {
      // Risk increases as capacity approaches maximum
      const capacityRisk = dam.currentCapacity / 100;
      
      // Risk from high release rate
      const releaseRisk = dam.releaseRate / dam.spillwayCapacity;
      
      // Distance factor (closer = higher risk)
      const distanceFactor = Math.exp(-dam.distanceDownstream / 50);
      
      const damRisk = (capacityRisk * 0.6 + releaseRisk * 0.4) * distanceFactor;
      maxRisk = Math.max(maxRisk, damRisk);
    }
    
    return maxRisk;
  }

  /**
   * ML-based probability calculation using neural network simulation
   */
  private calculateMLProbability(
    weather: WeatherData[],
    river: RiverData,
    soil: SoilData,
    terrain: TerrainData
  ): number {
    // Normalize inputs
    const avgRainfall = weather.reduce((sum, w) => sum + w.rainfall, 0) / weather.length;
    const normalizedRainfall = Math.min(1, avgRainfall / 50); // 50mm as max normal
    
    const normalizedRiverLevel = Math.min(1, river.currentLevel / river.dangerLevel);
    const normalizedSoilMoisture = soil.soilMoisture / 100;
    
    const avgDamCapacity = river.upstreamDams.length > 0
      ? river.upstreamDams.reduce((sum, d) => sum + d.currentCapacity, 0) / river.upstreamDams.length / 100
      : 0;
    
    const normalizedSlope = terrain.slope / 45;
    const normalizedImpervious = terrain.imperviousSurface / 100;
    
    // Seasonal factor
    const currentMonth = new Date().getMonth() + 1;
    const seasonalFactor = SEASONAL_FACTORS[currentMonth];
    
    // Historical pattern factor
    const riverPattern = HISTORICAL_PATTERNS[river.name.toLowerCase()];
    const historicalFactor = riverPattern
      ? (currentMonth === riverPattern.peakMonth ? 1.5 : 1.0)
      : 1.0;
    
    // Calculate weighted sum
    const weights = ML_MODEL.inputWeights;
    let hiddenLayerInput = 
      normalizedRainfall * weights.rainfall +
      normalizedSoilMoisture * weights.soilMoisture +
      normalizedRiverLevel * weights.riverLevel +
      avgDamCapacity * weights.damCapacity +
      (riverPattern?.avgAnnualFloods || 2) / 5 * weights.previousFloods +
      normalizedSlope * weights.slope +
      normalizedImpervious * weights.imperviousSurface +
      seasonalFactor * weights.seasonality;
    
    // Add bias
    hiddenLayerInput += ML_MODEL.hiddenLayerBias;
    
    // Apply historical pattern boost
    hiddenLayerInput *= historicalFactor;
    
    // Sigmoid activation for probability output
    const probability = 1 / (1 + Math.exp(-5 * (hiddenLayerInput - 0.4)));
    
    return Math.min(1, Math.max(0, probability));
  }

  /**
   * Hydrological model probability
   */
  private calculateHydrologicalProbability(
    currentLevel: number,
    warningLevel: number,
    dangerLevel: number,
    peakDischarge: number,
    currentFlow: number
  ): number {
    // Level-based probability
    const levelRatio = currentLevel / dangerLevel;
    const levelProbability = Math.pow(levelRatio, 2);
    
    // Discharge-based probability
    const dischargeRatio = peakDischarge / (currentFlow * 3); // 3x normal as danger threshold
    const dischargeProbability = Math.min(1, dischargeRatio);
    
    // Combined probability
    return (levelProbability * 0.6 + dischargeProbability * 0.4);
  }

  /**
   * Ensemble probability from multiple models
   */
  private ensembleProbability(
    mlProb: number,
    hydroProb: number,
    damRisk: number
  ): number {
    // Weighted ensemble
    const baseProb = mlProb * 0.5 + hydroProb * 0.5;
    
    // Dam risk can significantly increase probability
    const damAdjustedProb = baseProb + damRisk * (1 - baseProb) * 0.5;
    
    return Math.min(1, damAdjustedProb);
  }

  /**
   * Determine flood severity
   */
  private determineSeverity(
    probability: number,
    river: RiverData,
    peakDischarge: number
  ): 'none' | 'minor' | 'moderate' | 'major' | 'catastrophic' {
    if (probability < HYDRO_MODEL.severityThresholds.minor) return 'none';
    
    // Combine probability with physical indicators
    const levelFactor = river.currentLevel / river.dangerLevel;
    const dischargeFactor = peakDischarge / (river.flowRate * 4);
    
    const severityScore = probability * 0.4 + levelFactor * 0.3 + dischargeFactor * 0.3;
    
    if (severityScore >= HYDRO_MODEL.severityThresholds.catastrophic) return 'catastrophic';
    if (severityScore >= HYDRO_MODEL.severityThresholds.major) return 'major';
    if (severityScore >= HYDRO_MODEL.severityThresholds.moderate) return 'moderate';
    if (severityScore >= HYDRO_MODEL.severityThresholds.minor) return 'minor';
    return 'none';
  }

  /**
   * Predict water level
   */
  private predictWaterLevel(
    currentLevel: number,
    runoffVolume: number,
    currentFlow: number,
    timeToConcentration: number
  ): number {
    // Simplified level rise calculation
    const volumeContribution = runoffVolume / 10000; // Scale factor
    const flowFactor = 1 + (runoffVolume / (currentFlow * timeToConcentration * 3600));
    
    const predictedRise = volumeContribution * flowFactor;
    
    return currentLevel + predictedRise;
  }

  /**
   * Calculate flood timing
   */
  private calculateFloodTiming(
    weather: WeatherData[],
    timeToConcentration: number,
    probability: number
  ): { onset: Date; peak: Date; recession: Date } {
    const now = new Date();
    
    // Find peak rainfall time
    let peakRainfallIndex = 0;
    let maxRainfall = 0;
    weather.forEach((w, i) => {
      if (w.rainfall > maxRainfall) {
        maxRainfall = w.rainfall;
        peakRainfallIndex = i;
      }
    });
    
    // Onset is time of concentration after peak rainfall
    const onsetHours = peakRainfallIndex + timeToConcentration;
    const onset = new Date(now.getTime() + onsetHours * 60 * 60 * 1000);
    
    // Peak is 6-24 hours after onset depending on river size
    const peakDelay = Math.min(24, Math.max(6, timeToConcentration * 2));
    const peak = new Date(onset.getTime() + peakDelay * 60 * 60 * 1000);
    
    // Recession is typically 2-3 times the rise time
    const recessionDelay = peakDelay * 2.5;
    const recession = new Date(peak.getTime() + recessionDelay * 60 * 60 * 1000);
    
    return { onset, peak, recession };
  }

  /**
   * Generate flood timeline
   */
  private generateFloodTimeline(
    timing: { onset: Date; peak: Date; recession: Date },
    predictedLevel: number,
    river: RiverData,
    forecastHours: number
  ): FloodTimeline[] {
    const timeline: FloodTimeline[] = [];
    const now = new Date();
    const intervalHours = 3;
    
    for (let i = 0; i <= forecastHours; i += intervalHours) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      
      let phase: 'normal' | 'rising' | 'peak' | 'receding';
      let level: number;
      let probability: number;
      
      if (time < timing.onset) {
        phase = 'normal';
        level = river.currentLevel;
        probability = 0.1;
      } else if (time < timing.peak) {
        phase = 'rising';
        const progress = (time.getTime() - timing.onset.getTime()) / 
                        (timing.peak.getTime() - timing.onset.getTime());
        level = river.currentLevel + (predictedLevel - river.currentLevel) * progress;
        probability = 0.3 + progress * 0.5;
      } else if (time < timing.recession) {
        phase = 'peak';
        const progress = (time.getTime() - timing.peak.getTime()) / 
                        (timing.recession.getTime() - timing.peak.getTime());
        level = predictedLevel - (predictedLevel - river.currentLevel) * progress * 0.3;
        probability = 0.8 - progress * 0.2;
      } else {
        phase = 'receding';
        const hoursAfterRecession = (time.getTime() - timing.recession.getTime()) / (60 * 60 * 1000);
        level = Math.max(river.currentLevel, predictedLevel * Math.exp(-hoursAfterRecession / 48));
        probability = Math.max(0.1, 0.6 - hoursAfterRecession / 72);
      }
      
      timeline.push({
        time,
        predictedLevel: Math.round(level * 100) / 100,
        probability: Math.round(probability * 100) / 100,
        phase,
      });
    }
    
    return timeline;
  }

  /**
   * Estimate affected area
   */
  private estimateAffectedArea(
    predictedLevel: number,
    warningLevel: number,
    terrain: TerrainData
  ): number {
    if (predictedLevel <= warningLevel) return 0;
    
    const excessLevel = predictedLevel - warningLevel;
    
    // Base area affected per meter of excess
    const baseArea = 5; // sq km per meter
    
    // Slope factor (flatter = more spread)
    const slopeFactor = Math.max(0.5, 2 - terrain.slope / 10);
    
    // Land use factor
    const landUseFactor = terrain.landUse === 'urban' ? 0.7 :
                         terrain.landUse === 'agricultural' ? 1.2 :
                         terrain.landUse === 'wetland' ? 1.5 : 1.0;
    
    return Math.round(excessLevel * baseArea * slopeFactor * landUseFactor * 100) / 100;
  }

  /**
   * Identify risk factors
   */
  private identifyRiskFactors(
    weather: WeatherData[],
    river: RiverData,
    soil: SoilData,
    terrain: TerrainData,
    damRisk: number
  ): RiskFactor[] {
    const factors: RiskFactor[] = [];
    
    // Rainfall risk
    const totalRainfall = weather.reduce((sum, w) => sum + w.rainfall, 0);
    if (totalRainfall > 100) {
      factors.push({
        factor: 'Heavy Rainfall',
        contribution: Math.min(0.4, totalRainfall / 250),
        description: `Expected ${totalRainfall}mm rainfall in forecast period`,
        trend: this.getRainfallTrend(weather),
      });
    }
    
    // River level risk
    const levelRatio = river.currentLevel / river.warningLevel;
    if (levelRatio > 0.7) {
      factors.push({
        factor: 'Elevated River Level',
        contribution: levelRatio * 0.3,
        description: `River at ${Math.round(levelRatio * 100)}% of warning level`,
        trend: 'increasing',
      });
    }
    
    // Soil saturation
    if (soil.saturationLevel > 70) {
      factors.push({
        factor: 'Saturated Soil',
        contribution: (soil.saturationLevel - 70) / 100,
        description: `Soil ${soil.saturationLevel}% saturated, limiting absorption`,
        trend: 'stable',
      });
    }
    
    // Impervious surfaces
    if (terrain.imperviousSurface > 50) {
      factors.push({
        factor: 'Urban Runoff',
        contribution: terrain.imperviousSurface / 300,
        description: `${terrain.imperviousSurface}% impervious surface increases runoff`,
        trend: 'stable',
      });
    }
    
    // Dam risk
    if (damRisk > 0.3) {
      factors.push({
        factor: 'Upstream Dam Capacity',
        contribution: damRisk * 0.4,
        description: 'Upstream dams nearing capacity may release water',
        trend: 'increasing',
      });
    }
    
    // Seasonal factor
    const currentMonth = new Date().getMonth() + 1;
    const seasonalFactor = SEASONAL_FACTORS[currentMonth];
    if (seasonalFactor > 0.6) {
      factors.push({
        factor: 'Monsoon Season',
        contribution: seasonalFactor * 0.2,
        description: 'Peak flood season increases baseline risk',
        trend: currentMonth < 8 ? 'increasing' : 'decreasing',
      });
    }
    
    return factors.sort((a, b) => b.contribution - a.contribution);
  }

  /**
   * Get rainfall trend from weather data
   */
  private getRainfallTrend(weather: WeatherData[]): 'increasing' | 'stable' | 'decreasing' {
    if (weather.length < 2) return 'stable';
    
    const firstHalf = weather.slice(0, Math.floor(weather.length / 2));
    const secondHalf = weather.slice(Math.floor(weather.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, w) => sum + w.rainfall, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, w) => sum + w.rainfall, 0) / secondHalf.length;
    
    const diff = (secondAvg - firstAvg) / (firstAvg || 1);
    
    if (diff > 0.2) return 'increasing';
    if (diff < -0.2) return 'decreasing';
    return 'stable';
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    probability: number,
    severity: string,
    timing: { onset: Date; peak: Date; recession: Date },
    riskFactors: RiskFactor[]
  ): string[] {
    const recommendations: string[] = [];
    const hoursToOnset = Math.max(0, (timing.onset.getTime() - Date.now()) / (60 * 60 * 1000));
    
    if (probability > 0.7) {
      recommendations.push('URGENT: Initiate evacuation procedures for low-lying areas');
      recommendations.push('Alert emergency response teams for immediate deployment');
    } else if (probability > 0.5) {
      recommendations.push('Issue flood warning to affected communities');
      recommendations.push('Prepare evacuation centers and relief supplies');
    } else if (probability > 0.3) {
      recommendations.push('Monitor water levels closely');
      recommendations.push('Alert relevant authorities of developing situation');
    }
    
    if (hoursToOnset < 24 && probability > 0.4) {
      recommendations.push(`Expected onset in approximately ${Math.round(hoursToOnset)} hours`);
    }
    
    if (riskFactors.some(f => f.factor === 'Upstream Dam Capacity')) {
      recommendations.push('Coordinate with dam authorities for controlled release');
    }
    
    if (riskFactors.some(f => f.factor === 'Saturated Soil')) {
      recommendations.push('Avoid movement on slopes - landslide risk elevated');
    }
    
    if (severity === 'major' || severity === 'catastrophic') {
      recommendations.push('Request NDRF/SDRF team deployment');
      recommendations.push('Establish emergency communication networks');
    }
    
    return recommendations;
  }

  /**
   * Calculate confidence
   */
  private calculateConfidence(dataPoints: number, riskFactors: RiskFactor[]): number {
    let confidence = 0.5;
    
    // More data = higher confidence
    confidence += Math.min(0.2, dataPoints * 0.02);
    
    // More identified risk factors = higher confidence
    confidence += Math.min(0.2, riskFactors.length * 0.04);
    
    // Strong trends increase confidence
    const strongTrends = riskFactors.filter(f => f.trend !== 'stable').length;
    confidence += strongTrends * 0.03;
    
    return Math.min(0.95, confidence);
  }

  /**
   * Initialize sample historical data
   */
  private initializeHistoricalData(): void {
    // Sample data initialization for demo
  }

  /**
   * Quick flood risk check
   */
  public quickFloodCheck(
    latitude: number,
    longitude: number,
    recentRainfall: number
  ): { risk: 'low' | 'medium' | 'high'; message: string } {
    const currentMonth = new Date().getMonth() + 1;
    const seasonalFactor = SEASONAL_FACTORS[currentMonth];
    
    let baseRisk = 0.2;
    baseRisk += (recentRainfall / 200) * 0.4; // 200mm as high rainfall
    baseRisk *= seasonalFactor;
    
    if (baseRisk > 0.6) {
      return { risk: 'high', message: 'High flood risk - immediate precautions recommended' };
    }
    if (baseRisk > 0.3) {
      return { risk: 'medium', message: 'Moderate flood risk - monitor situation closely' };
    }
    return { risk: 'low', message: 'Low flood risk - continue normal activities' };
  }

  /**
   * Get flood history for a river
   */
  public getFloodHistory(riverName: string): typeof HISTORICAL_PATTERNS.brahmaputra | null {
    return HISTORICAL_PATTERNS[riverName.toLowerCase()] || null;
  }
}

export const floodPredictionService = FloodPredictionService.getInstance();
export type {
  WeatherData,
  RiverData,
  DamInfo,
  SoilData,
  TerrainData,
  FloodPrediction,
  FloodTimeline,
  RiskFactor,
};

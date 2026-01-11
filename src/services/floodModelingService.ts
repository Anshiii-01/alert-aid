/**
 * Flood Modeling Service - Issue #143 Implementation
 * 
 * Provides comprehensive flood modeling for disaster response including
 * hydrological analysis, inundation mapping, flood forecasting, dam break
 * analysis, flash flood prediction, and flood risk assessment.
 */

// Type definitions
type FloodType = 'riverine' | 'flash' | 'coastal' | 'urban' | 'dam_break' | 'ice_jam' | 'groundwater';
type FloodSeverity = 'minor' | 'moderate' | 'major' | 'record' | 'catastrophic';
type AlertStatus = 'watch' | 'warning' | 'emergency' | 'all_clear';
type ModelingMethod = 'hec_ras' | 'hec_hms' | 'mike_flood' | 'tuflow' | 'flo_2d' | 'simplified';
type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';

// Core interfaces
interface FloodEvent {
  id: string;
  name: string;
  type: FloodType;
  severity: FloodSeverity;
  status: 'forecasted' | 'imminent' | 'ongoing' | 'receding' | 'ended';
  startTime?: Date;
  peakTime?: Date;
  endTime?: Date;
  location: FloodLocation;
  hydrology: HydrologicalData;
  inundation: InundationData;
  impacts: FloodImpacts;
  forecast: FloodForecast;
  alerts: FloodAlert[];
  timeline: { timestamp: Date; event: string; details?: string }[];
  modelingResults: ModelingResult[];
  lastUpdated: Date;
}

interface FloodLocation {
  latitude: number;
  longitude: number;
  riverBasin?: string;
  watershed?: string;
  subBasin?: string;
  riverName?: string;
  reachId?: string;
  gageId?: string;
  city?: string;
  county?: string;
  state?: string;
}

interface HydrologicalData {
  timestamp: Date;
  currentStage: number; // feet
  currentFlow: number; // cfs
  floodStage: number;
  moderateFloodStage: number;
  majorFloodStage: number;
  recordStage: number;
  recordStageDate?: Date;
  stageChange24h: number;
  flowChange24h: number;
  precipitation: PrecipitationData;
  soilMoisture?: number;
  snowpack?: SnowpackData;
  observations: StageObservation[];
}

interface PrecipitationData {
  last1Hour: number;
  last3Hours: number;
  last6Hours: number;
  last24Hours: number;
  last48Hours: number;
  last7Days: number;
  forecast24Hours: number;
  forecast48Hours: number;
  forecast7Days: number;
  intensity?: number; // inches per hour
}

interface SnowpackData {
  snowWaterEquivalent: number;
  snowDepth: number;
  meltRate?: number;
  temperature?: number;
}

interface StageObservation {
  timestamp: Date;
  stage: number;
  flow?: number;
  quality: 'good' | 'fair' | 'poor' | 'estimated';
  source: 'gage' | 'manual' | 'satellite' | 'estimated';
}

interface InundationData {
  currentExtent: InundationExtent;
  projectedExtent?: InundationExtent;
  maxExtent?: InundationExtent;
  floodedArea: number; // acres
  waterVolume: number; // acre-feet
  averageDepth: number; // feet
  maxDepth: number; // feet
  flowVelocity: number; // fps
  riskZones: RiskZone[];
}

interface InundationExtent {
  timestamp: Date;
  polygon: { latitude: number; longitude: number }[];
  area: number; // acres
  perimeter: number; // miles
  depths: DepthGrid[];
  confidence: number;
  source: 'modeled' | 'observed' | 'satellite' | 'hybrid';
}

interface DepthGrid {
  latitude: number;
  longitude: number;
  depth: number; // feet
  velocity?: number; // fps
  hazardRating?: number;
}

interface RiskZone {
  id: string;
  name: string;
  level: RiskLevel;
  polygon: { latitude: number; longitude: number }[];
  population: number;
  structures: number;
  criticalFacilities: string[];
  floodFrequency?: string; // e.g., "100-year", "500-year"
}

interface FloodImpacts {
  population: {
    total: number;
    evacuated: number;
    sheltered: number;
    displaced: number;
    rescued: number;
    casualties?: number;
    missing?: number;
  };
  structures: {
    total: number;
    flooded: number;
    damaged: number;
    destroyed: number;
    residential: number;
    commercial: number;
    industrial: number;
  };
  infrastructure: {
    roadsClosed: number;
    bridgesClosed: number;
    powerOutages: number;
    waterSystemsAffected: number;
    sewageOverflows: number;
    damsConcern: number;
  };
  agriculture: {
    acresFlooded: number;
    cropDamage: number; // dollars
    livestockLoss: number;
  };
  economicLoss: number;
}

interface FloodForecast {
  id: string;
  createdAt: Date;
  validFrom: Date;
  validTo: Date;
  confidence: number;
  method: ModelingMethod;
  stages: ForecastStage[];
  peak: {
    stage: number;
    flow: number;
    time: Date;
    severity: FloodSeverity;
  };
  duration: number; // hours above flood stage
  warnings: string[];
  assumptions: string[];
}

interface ForecastStage {
  timestamp: Date;
  stage: number;
  flow: number;
  confidence: number;
  inundationArea?: number;
  severity: FloodSeverity;
}

interface FloodAlert {
  id: string;
  eventId: string;
  type: 'flood_watch' | 'flood_warning' | 'flash_flood_warning' | 'flood_advisory' | 'dam_safety' | 'evacuation';
  status: AlertStatus;
  severity: FloodSeverity;
  headline: string;
  description: string;
  instructions: string[];
  affectedAreas: string[];
  population: number;
  issuedAt: Date;
  effectiveAt: Date;
  expiresAt: Date;
  evacuationInfo?: EvacuationInfo;
}

interface EvacuationInfo {
  zones: string[];
  routes: EvacuationRoute[];
  shelters: Shelter[];
  deadline?: Date;
  mandatory: boolean;
}

interface EvacuationRoute {
  id: string;
  name: string;
  status: 'open' | 'flooded' | 'closed' | 'congested';
  startPoint: { latitude: number; longitude: number };
  endPoint: { latitude: number; longitude: number };
  distance: number;
  estimatedTime: number;
  alternates?: string[];
}

interface Shelter {
  id: string;
  name: string;
  location: { latitude: number; longitude: number };
  capacity: number;
  currentOccupancy: number;
  amenities: string[];
  petFriendly: boolean;
  accessibleAda: boolean;
  status: 'open' | 'full' | 'closed';
}

interface ModelingResult {
  id: string;
  eventId: string;
  method: ModelingMethod;
  createdAt: Date;
  scenario: string;
  inputs: ModelingInputs;
  outputs: ModelingOutputs;
  confidence: number;
  runTime: number; // seconds
  status: 'completed' | 'running' | 'failed';
}

interface ModelingInputs {
  hydrograph?: { time: Date; flow: number }[];
  rainfall?: { time: Date; intensity: number }[];
  initialConditions?: {
    waterSurfaceElevation: number;
    baseFlow: number;
    soilSaturation: number;
  };
  boundaryConditions?: {
    upstream: { type: string; value: number };
    downstream: { type: string; value: number };
  };
  terrain?: string; // DEM reference
  landUse?: string;
  manningCoefficients?: Record<string, number>;
}

interface ModelingOutputs {
  maxStage: number;
  maxFlow: number;
  timeToMax: number; // hours
  inundationMap: InundationExtent;
  velocityMap?: DepthGrid[];
  hazardMap?: DepthGrid[];
  hydrograph: { time: Date; stage: number; flow: number }[];
  statistics: {
    floodedArea: number;
    floodVolume: number;
    averageDepth: number;
    maxDepth: number;
    maxVelocity: number;
  };
}

// Dam break specific interfaces
interface DamBreakAnalysis {
  id: string;
  damId: string;
  damName: string;
  location: { latitude: number; longitude: number };
  damHeight: number;
  reservoirVolume: number;
  breachScenario: 'sunny_day' | 'flood_induced' | 'seismic' | 'piping';
  breachParameters: {
    width: number;
    time: number;
    peakOutflow: number;
  };
  inundationZone: InundationExtent;
  arrivalTimes: { location: string; distance: number; arrivalMinutes: number; maxDepth: number }[];
  populationAtRisk: number;
  warnings: string[];
  modeledAt: Date;
}

// Sample data
const sampleFloodEvents: FloodEvent[] = [
  {
    id: 'flood-001',
    name: 'Clear Creek Flood',
    type: 'riverine',
    severity: 'major',
    status: 'ongoing',
    startTime: new Date(),
    location: {
      latitude: 39.75,
      longitude: -105.22,
      riverBasin: 'South Platte',
      watershed: 'Clear Creek',
      riverName: 'Clear Creek',
      gageId: 'USGS-06719505',
      city: 'Golden',
      county: 'Jefferson',
      state: 'CO'
    },
    hydrology: {
      timestamp: new Date(),
      currentStage: 12.5,
      currentFlow: 8500,
      floodStage: 8.0,
      moderateFloodStage: 10.0,
      majorFloodStage: 12.0,
      recordStage: 14.2,
      recordStageDate: new Date('1965-06-16'),
      stageChange24h: 3.2,
      flowChange24h: 4500,
      precipitation: {
        last1Hour: 0.5,
        last3Hours: 1.8,
        last6Hours: 3.2,
        last24Hours: 5.1,
        last48Hours: 6.8,
        last7Days: 8.2,
        forecast24Hours: 1.5,
        forecast48Hours: 2.0,
        forecast7Days: 2.5
      },
      observations: []
    },
    inundation: {
      currentExtent: {
        timestamp: new Date(),
        polygon: [],
        area: 1500,
        perimeter: 15,
        depths: [],
        confidence: 0.85,
        source: 'modeled'
      },
      floodedArea: 1500,
      waterVolume: 12000,
      averageDepth: 4,
      maxDepth: 12,
      flowVelocity: 8,
      riskZones: []
    },
    impacts: {
      population: { total: 15000, evacuated: 3000, sheltered: 1200, displaced: 500, rescued: 25 },
      structures: { total: 5000, flooded: 800, damaged: 200, destroyed: 15, residential: 4000, commercial: 800, industrial: 200 },
      infrastructure: { roadsClosed: 12, bridgesClosed: 3, powerOutages: 2500, waterSystemsAffected: 1, sewageOverflows: 2, damsConcern: 0 },
      agriculture: { acresFlooded: 500, cropDamage: 250000, livestockLoss: 10 },
      economicLoss: 15000000
    },
    forecast: {
      id: 'fcst-001',
      createdAt: new Date(),
      validFrom: new Date(),
      validTo: new Date(Date.now() + 72 * 60 * 60 * 1000),
      confidence: 0.8,
      method: 'hec_ras',
      stages: [],
      peak: {
        stage: 13.5,
        flow: 10000,
        time: new Date(Date.now() + 6 * 60 * 60 * 1000),
        severity: 'major'
      },
      duration: 36,
      warnings: ['Near-record flooding expected'],
      assumptions: ['No additional significant rainfall']
    },
    alerts: [],
    timeline: [],
    modelingResults: [],
    lastUpdated: new Date()
  }
];

class FloodModelingService {
  private static instance: FloodModelingService;
  private floodEvents: Map<string, FloodEvent> = new Map();
  private alerts: Map<string, FloodAlert> = new Map();
  private modelingResults: Map<string, ModelingResult> = new Map();
  private damBreakAnalyses: Map<string, DamBreakAnalysis> = new Map();

  // Stage-discharge rating curves (simplified)
  private readonly ratingCurves: Record<string, { stage: number; flow: number }[]> = {
    'default': [
      { stage: 0, flow: 0 },
      { stage: 2, flow: 500 },
      { stage: 4, flow: 1500 },
      { stage: 6, flow: 3500 },
      { stage: 8, flow: 6000 },
      { stage: 10, flow: 9000 },
      { stage: 12, flow: 13000 },
      { stage: 14, flow: 18000 },
      { stage: 16, flow: 24000 }
    ]
  };

  // Manning's n values for different land cover types
  private readonly manningN: Record<string, number> = {
    'channel': 0.03,
    'floodplain_grass': 0.035,
    'floodplain_brush': 0.07,
    'urban': 0.05,
    'forest': 0.12,
    'agricultural': 0.04
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): FloodModelingService {
    if (!FloodModelingService.instance) {
      FloodModelingService.instance = new FloodModelingService();
    }
    return FloodModelingService.instance;
  }

  private initializeSampleData(): void {
    sampleFloodEvents.forEach(e => this.floodEvents.set(e.id, e));
  }

  // ==================== Flood Event Management ====================

  async createFloodEvent(params: {
    name: string;
    type: FloodType;
    location: FloodLocation;
    hydrology: Partial<HydrologicalData>;
    severity?: FloodSeverity;
  }): Promise<FloodEvent> {
    const now = new Date();

    const severity = params.severity || this.determineSeverity(
      params.hydrology.currentStage || 0,
      params.hydrology.floodStage || 10,
      params.hydrology.majorFloodStage || 14
    );

    const event: FloodEvent = {
      id: `flood-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      severity,
      status: 'forecasted',
      location: params.location,
      hydrology: {
        timestamp: now,
        currentStage: params.hydrology.currentStage || 0,
        currentFlow: params.hydrology.currentFlow || 0,
        floodStage: params.hydrology.floodStage || 10,
        moderateFloodStage: params.hydrology.moderateFloodStage || 12,
        majorFloodStage: params.hydrology.majorFloodStage || 14,
        recordStage: params.hydrology.recordStage || 20,
        stageChange24h: 0,
        flowChange24h: 0,
        precipitation: params.hydrology.precipitation || {
          last1Hour: 0, last3Hours: 0, last6Hours: 0, last24Hours: 0,
          last48Hours: 0, last7Days: 0, forecast24Hours: 0, forecast48Hours: 0, forecast7Days: 0
        },
        observations: []
      },
      inundation: {
        currentExtent: {
          timestamp: now,
          polygon: [],
          area: 0,
          perimeter: 0,
          depths: [],
          confidence: 0.5,
          source: 'modeled'
        },
        floodedArea: 0,
        waterVolume: 0,
        averageDepth: 0,
        maxDepth: 0,
        flowVelocity: 0,
        riskZones: []
      },
      impacts: {
        population: { total: 0, evacuated: 0, sheltered: 0, displaced: 0, rescued: 0 },
        structures: { total: 0, flooded: 0, damaged: 0, destroyed: 0, residential: 0, commercial: 0, industrial: 0 },
        infrastructure: { roadsClosed: 0, bridgesClosed: 0, powerOutages: 0, waterSystemsAffected: 0, sewageOverflows: 0, damsConcern: 0 },
        agriculture: { acresFlooded: 0, cropDamage: 0, livestockLoss: 0 },
        economicLoss: 0
      },
      forecast: {
        id: `fcst-${Date.now()}`,
        createdAt: now,
        validFrom: now,
        validTo: new Date(Date.now() + 72 * 60 * 60 * 1000),
        confidence: 0.7,
        method: 'simplified',
        stages: [],
        peak: { stage: 0, flow: 0, time: now, severity: 'minor' },
        duration: 0,
        warnings: [],
        assumptions: []
      },
      alerts: [],
      timeline: [{ timestamp: now, event: 'Flood event created', details: params.name }],
      modelingResults: [],
      lastUpdated: now
    };

    this.floodEvents.set(event.id, event);

    // Generate initial forecast
    await this.generateForecast(event.id);

    return event;
  }

  private determineSeverity(currentStage: number, floodStage: number, majorStage: number): FloodSeverity {
    if (currentStage < floodStage) return 'minor';
    if (currentStage < (floodStage + majorStage) / 2) return 'moderate';
    if (currentStage < majorStage * 1.2) return 'major';
    if (currentStage < majorStage * 1.5) return 'record';
    return 'catastrophic';
  }

  async getFloodEvent(eventId: string): Promise<FloodEvent | null> {
    return this.floodEvents.get(eventId) || null;
  }

  async updateFloodEvent(eventId: string, updates: {
    status?: FloodEvent['status'];
    severity?: FloodSeverity;
    hydrology?: Partial<HydrologicalData>;
    impacts?: Partial<FloodImpacts>;
  }): Promise<FloodEvent> {
    const event = this.floodEvents.get(eventId);
    if (!event) throw new Error(`Flood event not found: ${eventId}`);

    if (updates.status) {
      event.status = updates.status;
      event.timeline.push({ timestamp: new Date(), event: `Status changed to ${updates.status}` });
    }
    if (updates.severity) event.severity = updates.severity;
    if (updates.hydrology) {
      const oldStage = event.hydrology.currentStage;
      event.hydrology = { ...event.hydrology, ...updates.hydrology, timestamp: new Date() };
      event.hydrology.stageChange24h = (updates.hydrology.currentStage || event.hydrology.currentStage) - oldStage;
    }
    if (updates.impacts) {
      event.impacts = { ...event.impacts, ...updates.impacts } as FloodImpacts;
    }

    event.lastUpdated = new Date();
    this.floodEvents.set(eventId, event);

    // Check alert conditions
    await this.checkAlertConditions(event);

    return event;
  }

  async addStageObservation(eventId: string, observation: Omit<StageObservation, 'timestamp'>): Promise<HydrologicalData> {
    const event = this.floodEvents.get(eventId);
    if (!event) throw new Error(`Flood event not found: ${eventId}`);

    const obs: StageObservation = {
      ...observation,
      timestamp: new Date()
    };

    event.hydrology.observations.push(obs);
    event.hydrology.currentStage = observation.stage;
    if (observation.flow) event.hydrology.currentFlow = observation.flow;
    event.hydrology.timestamp = new Date();
    event.lastUpdated = new Date();

    // Update severity based on new observation
    event.severity = this.determineSeverity(
      observation.stage,
      event.hydrology.floodStage,
      event.hydrology.majorFloodStage
    );

    this.floodEvents.set(eventId, event);

    return event.hydrology;
  }

  // ==================== Flood Forecasting ====================

  async generateForecast(eventId: string, hoursAhead: number = 72): Promise<FloodForecast> {
    const event = this.floodEvents.get(eventId);
    if (!event) throw new Error(`Flood event not found: ${eventId}`);

    const stages: ForecastStage[] = [];
    let currentStage = event.hydrology.currentStage;
    let currentFlow = event.hydrology.currentFlow;
    let peakStage = currentStage;
    let peakFlow = currentFlow;
    let peakTime = new Date();
    let rising = true;

    // Simplified hydrological model
    const precipFactor = (event.hydrology.precipitation.forecast24Hours + event.hydrology.precipitation.last24Hours) / 2;
    const riseRate = this.calculateRiseRate(event, precipFactor);

    for (let h = 1; h <= hoursAhead; h++) {
      const timestamp = new Date(Date.now() + h * 60 * 60 * 1000);

      if (rising && h < hoursAhead / 3) {
        // Rising limb
        currentStage += riseRate;
        if (currentStage > peakStage) {
          peakStage = currentStage;
          peakTime = timestamp;
        }
      } else if (rising) {
        // Transition to recession
        rising = false;
      } else {
        // Recession limb
        currentStage -= riseRate * 0.5;
        currentStage = Math.max(currentStage, event.hydrology.floodStage * 0.5);
      }

      currentFlow = this.stageToFlow(currentStage);
      if (currentFlow > peakFlow) peakFlow = currentFlow;

      const severity = this.determineSeverity(currentStage, event.hydrology.floodStage, event.hydrology.majorFloodStage);

      stages.push({
        timestamp,
        stage: currentStage,
        flow: currentFlow,
        confidence: Math.max(0.5, 0.95 - (h / hoursAhead) * 0.3),
        inundationArea: this.estimateInundationArea(currentStage, event.hydrology.floodStage),
        severity
      });
    }

    const peakSeverity = this.determineSeverity(peakStage, event.hydrology.floodStage, event.hydrology.majorFloodStage);

    const forecast: FloodForecast = {
      id: `fcst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      validFrom: new Date(),
      validTo: new Date(Date.now() + hoursAhead * 60 * 60 * 1000),
      confidence: this.calculateForecastConfidence(event, hoursAhead),
      method: 'simplified',
      stages,
      peak: {
        stage: peakStage,
        flow: peakFlow,
        time: peakTime,
        severity: peakSeverity
      },
      duration: this.calculateFloodDuration(stages, event.hydrology.floodStage),
      warnings: this.generateForecastWarnings(peakStage, peakSeverity, event),
      assumptions: [
        'Based on current precipitation and forecast',
        'No dam releases or failures',
        'Normal channel conditions'
      ]
    };

    event.forecast = forecast;
    event.lastUpdated = new Date();
    this.floodEvents.set(eventId, event);

    return forecast;
  }

  private calculateRiseRate(event: FloodEvent, precipFactor: number): number {
    // Simplified rise rate calculation
    const baseRate = 0.2; // feet per hour
    const precipMultiplier = 1 + precipFactor * 0.5;
    const soilFactor = event.hydrology.soilMoisture ? (event.hydrology.soilMoisture / 100) : 0.5;

    return baseRate * precipMultiplier * (1 + soilFactor);
  }

  private stageToFlow(stage: number): number {
    // Simplified stage-discharge relationship
    const curve = this.ratingCurves['default'];
    for (let i = 0; i < curve.length - 1; i++) {
      if (stage >= curve[i].stage && stage <= curve[i + 1].stage) {
        const ratio = (stage - curve[i].stage) / (curve[i + 1].stage - curve[i].stage);
        return curve[i].flow + ratio * (curve[i + 1].flow - curve[i].flow);
      }
    }
    // Extrapolate if above curve
    const lastTwo = curve.slice(-2);
    const slope = (lastTwo[1].flow - lastTwo[0].flow) / (lastTwo[1].stage - lastTwo[0].stage);
    return lastTwo[1].flow + slope * (stage - lastTwo[1].stage);
  }

  private estimateInundationArea(stage: number, floodStage: number): number {
    if (stage < floodStage) return 0;
    // Simplified area estimation (acres)
    const excessStage = stage - floodStage;
    return Math.pow(excessStage, 1.5) * 100;
  }

  private calculateFloodDuration(stages: ForecastStage[], floodStage: number): number {
    return stages.filter(s => s.stage >= floodStage).length;
  }

  private calculateForecastConfidence(event: FloodEvent, hours: number): number {
    let confidence = 0.9;
    confidence -= hours * 0.003; // Reduce for longer forecasts
    if (event.hydrology.observations.length < 5) confidence -= 0.1;
    if (event.type === 'flash') confidence -= 0.1; // Flash floods harder to predict
    return Math.max(0.4, confidence);
  }

  private generateForecastWarnings(peakStage: number, severity: FloodSeverity, event: FloodEvent): string[] {
    const warnings: string[] = [];

    if (peakStage >= event.hydrology.recordStage) {
      warnings.push('RECORD FLOODING EXPECTED - Exceeds historical maximum');
    }
    if (severity === 'catastrophic') {
      warnings.push('CATASTROPHIC FLOODING - Life-threatening conditions');
    }
    if (severity === 'major') {
      warnings.push('Major flooding expected - Significant impacts likely');
    }
    if (event.hydrology.precipitation.forecast24Hours > 2) {
      warnings.push('Heavy rainfall expected - Conditions may worsen');
    }
    if (event.type === 'flash') {
      warnings.push('Flash flooding - Rapid onset with little warning');
    }

    return warnings;
  }

  // ==================== Inundation Modeling ====================

  async runInundationModel(eventId: string, params?: {
    method?: ModelingMethod;
    scenario?: string;
    stage?: number;
    duration?: number;
  }): Promise<ModelingResult> {
    const event = this.floodEvents.get(eventId);
    if (!event) throw new Error(`Flood event not found: ${eventId}`);

    const startTime = Date.now();
    const stage = params?.stage || event.forecast.peak.stage;
    const flow = this.stageToFlow(stage);

    // Generate inundation extent
    const inundationArea = this.estimateInundationArea(stage, event.hydrology.floodStage);
    const extent = this.generateInundationExtent(event.location, inundationArea, stage);

    // Calculate statistics
    const maxDepth = stage - event.hydrology.floodStage + 2; // Approximate
    const avgDepth = maxDepth * 0.6;
    const volume = inundationArea * avgDepth; // acre-feet
    const maxVelocity = this.calculateVelocity(flow, extent.area);

    // Generate hydrograph
    const hydrograph = this.generateModelHydrograph(event, stage, params?.duration || 72);

    const result: ModelingResult = {
      id: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      method: params?.method || 'simplified',
      createdAt: new Date(),
      scenario: params?.scenario || 'peak_forecast',
      inputs: {
        initialConditions: {
          waterSurfaceElevation: event.hydrology.currentStage,
          baseFlow: event.hydrology.currentFlow,
          soilSaturation: event.hydrology.soilMoisture || 50
        }
      },
      outputs: {
        maxStage: stage,
        maxFlow: flow,
        timeToMax: (event.forecast.peak.time.getTime() - Date.now()) / (1000 * 60 * 60),
        inundationMap: extent,
        hydrograph,
        statistics: {
          floodedArea: inundationArea,
          floodVolume: volume,
          averageDepth: avgDepth,
          maxDepth,
          maxVelocity
        }
      },
      confidence: 0.75,
      runTime: (Date.now() - startTime) / 1000,
      status: 'completed'
    };

    this.modelingResults.set(result.id, result);
    event.modelingResults.push(result);
    event.inundation.currentExtent = extent;
    event.inundation.floodedArea = inundationArea;
    event.inundation.waterVolume = volume;
    event.inundation.averageDepth = avgDepth;
    event.inundation.maxDepth = maxDepth;
    this.floodEvents.set(eventId, event);

    return result;
  }

  private generateInundationExtent(location: FloodLocation, area: number, stage: number): InundationExtent {
    // Generate approximate polygon for flooded area
    const radiusMiles = Math.sqrt(area / 640);
    const radiusDegrees = radiusMiles / 69;

    const polygon: { latitude: number; longitude: number }[] = [];
    // Elongate along river (assuming E-W orientation)
    for (let angle = 0; angle < 360; angle += 15) {
      const rad = angle * Math.PI / 180;
      const latFactor = Math.cos(rad);
      const lonFactor = Math.sin(rad) * 2; // Elongate E-W

      polygon.push({
        latitude: location.latitude + radiusDegrees * latFactor,
        longitude: location.longitude + radiusDegrees * lonFactor / Math.cos(location.latitude * Math.PI / 180)
      });
    }

    // Generate depth grid
    const depths: DepthGrid[] = this.generateDepthGrid(location, area, stage - 8);

    return {
      timestamp: new Date(),
      polygon,
      area,
      perimeter: radiusMiles * 2 * Math.PI,
      depths,
      confidence: 0.75,
      source: 'modeled'
    };
  }

  private generateDepthGrid(location: FloodLocation, area: number, maxDepth: number): DepthGrid[] {
    const grid: DepthGrid[] = [];
    const radiusMiles = Math.sqrt(area / 640);
    const radiusDegrees = radiusMiles / 69;
    const step = radiusDegrees / 5;

    for (let latOffset = -radiusDegrees; latOffset <= radiusDegrees; latOffset += step) {
      for (let lonOffset = -radiusDegrees * 2; lonOffset <= radiusDegrees * 2; lonOffset += step) {
        const distance = Math.sqrt(Math.pow(latOffset, 2) + Math.pow(lonOffset / 2, 2));
        if (distance <= radiusDegrees) {
          const depthFactor = 1 - (distance / radiusDegrees);
          const depth = maxDepth * depthFactor;
          if (depth > 0) {
            grid.push({
              latitude: location.latitude + latOffset,
              longitude: location.longitude + lonOffset / Math.cos(location.latitude * Math.PI / 180),
              depth,
              velocity: depth * 0.5, // Simplified
              hazardRating: depth * (depth * 0.5) // Depth * velocity
            });
          }
        }
      }
    }

    return grid;
  }

  private calculateVelocity(flow: number, area: number): number {
    // Simplified Manning's equation result
    const crossSectionArea = area * 0.001; // Approximate
    return flow / crossSectionArea;
  }

  private generateModelHydrograph(event: FloodEvent, peakStage: number, hours: number): { time: Date; stage: number; flow: number }[] {
    const hydrograph: { time: Date; stage: number; flow: number }[] = [];
    const currentStage = event.hydrology.currentStage;
    const timeToPeak = hours / 3;
    const riseRate = (peakStage - currentStage) / timeToPeak;

    for (let h = 0; h <= hours; h++) {
      let stage: number;
      if (h <= timeToPeak) {
        stage = currentStage + riseRate * h;
      } else {
        const recessionTime = h - timeToPeak;
        stage = peakStage - (riseRate * 0.5 * recessionTime);
        stage = Math.max(stage, event.hydrology.floodStage * 0.5);
      }

      hydrograph.push({
        time: new Date(Date.now() + h * 60 * 60 * 1000),
        stage,
        flow: this.stageToFlow(stage)
      });
    }

    return hydrograph;
  }

  // ==================== Dam Break Analysis ====================

  async runDamBreakAnalysis(params: {
    damId: string;
    damName: string;
    location: { latitude: number; longitude: number };
    damHeight: number;
    reservoirVolume: number;
    breachScenario: DamBreakAnalysis['breachScenario'];
  }): Promise<DamBreakAnalysis> {
    // Calculate breach parameters
    const breachWidth = params.damHeight * 2.5;
    const breachTime = params.damHeight * 0.5; // minutes
    const peakOutflow = this.calculateDamBreakPeakOutflow(params.reservoirVolume, params.damHeight);

    // Calculate arrival times at downstream locations
    const arrivalTimes = this.calculateArrivalTimes(params.location, peakOutflow);

    // Generate inundation zone
    const inundationArea = params.reservoirVolume * 0.1; // Simplified
    const inundationZone = this.generateInundationExtent(
      { ...params.location, latitude: params.location.latitude - 0.05 },
      inundationArea,
      params.damHeight
    );

    // Calculate population at risk
    const populationAtRisk = Math.round(inundationArea * 10); // Simplified

    const analysis: DamBreakAnalysis = {
      id: `dambreak-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      damId: params.damId,
      damName: params.damName,
      location: params.location,
      damHeight: params.damHeight,
      reservoirVolume: params.reservoirVolume,
      breachScenario: params.breachScenario,
      breachParameters: {
        width: breachWidth,
        time: breachTime,
        peakOutflow
      },
      inundationZone,
      arrivalTimes,
      populationAtRisk,
      warnings: [
        'Dam break flood wave travels rapidly',
        'Immediate evacuation required for downstream areas',
        'First wave arrives within minutes at nearest locations'
      ],
      modeledAt: new Date()
    };

    this.damBreakAnalyses.set(analysis.id, analysis);
    return analysis;
  }

  private calculateDamBreakPeakOutflow(volume: number, height: number): number {
    // Simplified dam break outflow (acre-feet -> cfs)
    return volume * 0.25 * Math.sqrt(height);
  }

  private calculateArrivalTimes(damLocation: { latitude: number; longitude: number }, peakOutflow: number): DamBreakAnalysis['arrivalTimes'] {
    // Simplified wave travel calculation
    const waveSpeed = Math.sqrt(32.2 * 10); // fps for 10ft depth
    const waveMph = waveSpeed * 0.68;

    const locations = [
      { name: 'Downstream Community A', distance: 2 },
      { name: 'Downstream Community B', distance: 5 },
      { name: 'Downstream Community C', distance: 10 },
      { name: 'Major City D', distance: 20 }
    ];

    return locations.map(loc => ({
      location: loc.name,
      distance: loc.distance,
      arrivalMinutes: Math.round(loc.distance / waveMph * 60),
      maxDepth: Math.max(2, 15 - loc.distance * 0.5)
    }));
  }

  // ==================== Alert Management ====================

  private async checkAlertConditions(event: FloodEvent): Promise<void> {
    const { currentStage, floodStage, moderateFloodStage, majorFloodStage } = event.hydrology;

    if (currentStage >= majorFloodStage && event.status === 'ongoing') {
      await this.createFloodAlert({
        eventId: event.id,
        type: 'flood_warning',
        severity: 'major',
        affectedAreas: [event.location.city || 'Affected Area'],
        population: event.impacts.population.total
      });
    } else if (currentStage >= floodStage && event.status === 'ongoing') {
      await this.createFloodAlert({
        eventId: event.id,
        type: 'flood_warning',
        severity: 'moderate',
        affectedAreas: [event.location.city || 'Affected Area'],
        population: event.impacts.population.total
      });
    }
  }

  async createFloodAlert(params: {
    eventId: string;
    type: FloodAlert['type'];
    severity: FloodSeverity;
    affectedAreas: string[];
    population: number;
    evacuationInfo?: EvacuationInfo;
  }): Promise<FloodAlert> {
    const event = this.floodEvents.get(params.eventId);
    const eventName = event?.name || 'Flood Event';

    const alert: FloodAlert = {
      id: `falert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventId: params.eventId,
      type: params.type,
      status: 'warning',
      severity: params.severity,
      headline: this.generateAlertHeadline(params.type, params.severity, eventName),
      description: this.generateAlertDescription(params.type, params.severity, event),
      instructions: this.getFloodInstructions(params.type, params.severity),
      affectedAreas: params.affectedAreas,
      population: params.population,
      issuedAt: new Date(),
      effectiveAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      evacuationInfo: params.evacuationInfo
    };

    this.alerts.set(alert.id, alert);
    if (event) {
      event.alerts.push(alert);
      this.floodEvents.set(params.eventId, event);
    }

    return alert;
  }

  private generateAlertHeadline(type: FloodAlert['type'], severity: FloodSeverity, eventName: string): string {
    const severityText = severity.toUpperCase();
    switch (type) {
      case 'flood_warning': return `${severityText} FLOOD WARNING - ${eventName}`;
      case 'flash_flood_warning': return `FLASH FLOOD WARNING - ${eventName}`;
      case 'flood_watch': return `FLOOD WATCH - ${eventName}`;
      case 'dam_safety': return `DAM SAFETY WARNING - ${eventName}`;
      case 'evacuation': return `EVACUATION ORDER - ${eventName}`;
      default: return `FLOOD ADVISORY - ${eventName}`;
    }
  }

  private generateAlertDescription(type: FloodAlert['type'], severity: FloodSeverity, event?: FloodEvent): string {
    if (!event) return 'Flooding is occurring or expected.';

    const stage = event.hydrology.currentStage;
    const peak = event.forecast.peak.stage;

    return `${severity.charAt(0).toUpperCase() + severity.slice(1)} flooding is ${event.status} along ${event.location.riverName || 'the affected waterway'}. ` +
      `Current stage is ${stage.toFixed(1)} feet, expected to crest at ${peak.toFixed(1)} feet. ` +
      `Flood stage is ${event.hydrology.floodStage} feet.`;
  }

  private getFloodInstructions(type: FloodAlert['type'], severity: FloodSeverity): string[] {
    const base = [
      'Never walk, swim, or drive through flood waters',
      'Turn around, don\'t drown',
      'Move to higher ground if flooding is imminent'
    ];

    if (severity === 'major' || severity === 'catastrophic') {
      return [
        'EVACUATE IMMEDIATELY if ordered',
        'Do not wait to be told to leave',
        ...base,
        'Avoid bridges over fast-moving water',
        'If trapped by flooding, call 911'
      ];
    }

    return [
      ...base,
      'Monitor weather and emergency alerts',
      'Prepare to evacuate if conditions worsen'
    ];
  }

  // ==================== Statistics ====================

  async getStatistics(eventId?: string): Promise<{
    totalEvents: number;
    activeEvents: number;
    totalPopulationAffected: number;
    totalStructuresFlooded: number;
    totalEconomicLoss: number;
    activeAlerts: number;
    byType: Record<FloodType, number>;
    bySeverity: Record<FloodSeverity, number>;
  }> {
    let events = Array.from(this.floodEvents.values());
    if (eventId) {
      events = events.filter(e => e.id === eventId);
    }

    const byType: Record<FloodType, number> = {
      riverine: 0, flash: 0, coastal: 0, urban: 0, dam_break: 0, ice_jam: 0, groundwater: 0
    };
    const bySeverity: Record<FloodSeverity, number> = {
      minor: 0, moderate: 0, major: 0, record: 0, catastrophic: 0
    };

    let totalPop = 0, totalStructures = 0, totalLoss = 0;

    events.forEach(e => {
      byType[e.type]++;
      bySeverity[e.severity]++;
      totalPop += e.impacts.population.total;
      totalStructures += e.impacts.structures.flooded;
      totalLoss += e.impacts.economicLoss;
    });

    return {
      totalEvents: events.length,
      activeEvents: events.filter(e => e.status === 'ongoing' || e.status === 'imminent').length,
      totalPopulationAffected: totalPop,
      totalStructuresFlooded: totalStructures,
      totalEconomicLoss: totalLoss,
      activeAlerts: Array.from(this.alerts.values()).filter(a => a.status === 'warning' || a.status === 'emergency').length,
      byType,
      bySeverity
    };
  }
}

export const floodModelingService = FloodModelingService.getInstance();
export default FloodModelingService;

/**
 * Wildfire Spread Modeling Service - Issue #142 Implementation
 * 
 * Provides comprehensive wildfire spread modeling for disaster response including
 * fire behavior prediction, spread rate calculation, evacuation zone determination,
 * resource deployment optimization, and suppression strategy support.
 */

// Type definitions
type FireBehavior = 'surface' | 'crown_passive' | 'crown_active' | 'spotting' | 'ground' | 'extreme';
type FuelType = 'grass' | 'shrub' | 'timber_understory' | 'timber_litter' | 'slash' | 'brush' | 'hardwood' | 'mixed';
type FireStatus = 'uncontained' | 'partially_contained' | 'contained' | 'controlled' | 'extinguished';
type AlertLevel = 'watch' | 'warning' | 'evacuation_warning' | 'evacuation_order' | 'shelter_in_place';
type SpreadDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
type TerrainType = 'flat' | 'rolling' | 'mountainous' | 'canyon' | 'ridge' | 'valley';

// Fire behavior interfaces
interface WildfireIncident {
  id: string;
  name: string;
  incidentId?: string;
  startTime: Date;
  discoveryTime: Date;
  cause: 'lightning' | 'human' | 'equipment' | 'powerline' | 'campfire' | 'arson' | 'unknown';
  status: FireStatus;
  currentBehavior: FireBehavior;
  originLocation: { latitude: number; longitude: number; elevation: number };
  currentPerimeter: FirePerimeter;
  perimeterHistory: FirePerimeter[];
  weather: WeatherConditions;
  terrain: TerrainInfo;
  fuels: FuelConditions;
  resources: ResourceDeployment[];
  evacuationZones: EvacuationZone[];
  structures: StructureInfo;
  projections: SpreadProjection[];
  timeline: { timestamp: Date; event: string; details?: string }[];
  containment: number;
  acresBurned: number;
  estimatedFinalSize?: number;
  lastUpdated: Date;
}

interface FirePerimeter {
  id: string;
  timestamp: Date;
  area: number; // acres
  perimeterLength: number; // miles
  coordinates: { latitude: number; longitude: number }[];
  activeEdges: ActiveEdge[];
  containedEdges: { start: number; end: number }[];
  confidence: number;
  source: 'aerial' | 'satellite' | 'ground' | 'ir' | 'modeled';
}

interface ActiveEdge {
  id: string;
  startIndex: number;
  endIndex: number;
  spreadRate: number; // chains per hour
  flameLength: number; // feet
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
  direction: SpreadDirection;
  threat: 'minimal' | 'moderate' | 'significant' | 'critical';
}

interface WeatherConditions {
  timestamp: Date;
  temperature: number; // Fahrenheit
  relativeHumidity: number; // percent
  windSpeed: number; // mph
  windGusts?: number;
  windDirection: number; // degrees
  transportWindSpeed?: number;
  transportWindDirection?: number;
  mixingHeight?: number;
  hainesIndex?: number;
  redFlagWarning: boolean;
  forecast: WeatherForecast[];
}

interface WeatherForecast {
  validTime: Date;
  temperature: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: number;
  precipProbability: number;
  conditions: string;
}

interface TerrainInfo {
  slope: number; // degrees
  aspect: SpreadDirection;
  elevation: number; // feet
  terrainType: TerrainType;
  drainages: string[];
  barriers: { type: string; location: string; effectiveness: number }[];
}

interface FuelConditions {
  fuelType: FuelType;
  fuelModel: string;
  moistureContent: {
    oneHour: number;
    tenHour: number;
    hundredHour: number;
    live: number;
  };
  fuelLoading: number; // tons per acre
  fuelBedDepth: number; // feet
  curedPercent?: number;
  droughtIndex?: number;
  energyReleaseComponent?: number;
  burningIndex?: number;
}

// Spread modeling interfaces
interface SpreadProjection {
  id: string;
  fireId: string;
  model: 'farsite' | 'behave' | 'phoenix' | 'prometheus' | 'flammap' | 'simplified';
  createdAt: Date;
  validFrom: Date;
  validTo: Date;
  timeSteps: ProjectionTimeStep[];
  confidence: number;
  assumptions: string[];
  warnings: string[];
}

interface ProjectionTimeStep {
  timestamp: Date;
  projectedPerimeter: { latitude: number; longitude: number }[];
  projectedArea: number;
  spreadRate: SpreadRateInfo;
  firelinIntensity: number; // BTU/ft/s
  flameLength: number; // feet
  heatPerUnitArea: number;
  rateOfSpread: number; // chains/hour
  headFireDirection: number;
  spotFireProbability: number;
  crownFirePotential: 'none' | 'passive' | 'active' | 'independent';
  structuresAtRisk: number;
  populationAtRisk: number;
}

interface SpreadRateInfo {
  head: number; // chains per hour
  flanking: number;
  backing: number;
  maxSpotDistance?: number; // miles
  averageRate: number;
}

// Resource interfaces
interface ResourceDeployment {
  id: string;
  resourceId: string;
  type: 'engine' | 'crew' | 'helicopter' | 'airtanker' | 'dozer' | 'water_tender' | 'overhead';
  name: string;
  assignment: string;
  location?: { latitude: number; longitude: number };
  status: 'assigned' | 'en_route' | 'on_scene' | 'working' | 'available' | 'unavailable';
  arrivalTime?: Date;
  capabilities: string[];
  personnel?: number;
  cost?: number;
}

interface EvacuationZone {
  id: string;
  name: string;
  level: AlertLevel;
  status: 'active' | 'pending' | 'lifted';
  polygon: { latitude: number; longitude: number }[];
  population: number;
  structures: number;
  criticalFacilities: string[];
  evacuationRoutes: string[];
  shelters: string[];
  issuedAt: Date;
  effectiveAt: Date;
  expiresAt?: Date;
  liftedAt?: Date;
  instructions: string[];
}

interface StructureInfo {
  structuresTotal: number;
  structuresThreatened: number;
  structuresDestroyed: number;
  structuresDamaged: number;
  structuresDefended: number;
  structuresByZone: { zone: string; count: number; threatened: number }[];
  criticalInfrastructure: {
    type: string;
    name: string;
    location: { latitude: number; longitude: number };
    status: 'safe' | 'threatened' | 'evacuated' | 'damaged' | 'destroyed';
  }[];
}

// Fire behavior calculation interfaces
interface FireBehaviorCalculation {
  id: string;
  location: { latitude: number; longitude: number };
  timestamp: Date;
  inputs: {
    fuelModel: string;
    slope: number;
    aspect: number;
    windSpeed: number;
    windDirection: number;
    moistures: FuelConditions['moistureContent'];
  };
  outputs: {
    rateOfSpread: number;
    flameLength: number;
    firelineIntensity: number;
    heatPerUnitArea: number;
    reactionIntensity: number;
    effectiveWindSpeed: number;
    directionOfMaxSpread: number;
    crownFirePotential: string;
  };
}

// Alert interfaces
interface WildfireAlert {
  id: string;
  fireId: string;
  type: 'new_fire' | 'growth' | 'behavior_change' | 'evacuation' | 'containment' | 'all_clear';
  level: AlertLevel;
  title: string;
  message: string;
  affectedAreas: string[];
  population: number;
  instructions: string[];
  evacuationInfo?: {
    zones: string[];
    routes: string[];
    shelters: string[];
    deadline?: Date;
  };
  healthAdvisory?: {
    aqiImpact: string;
    recommendations: string[];
    vulnerablePopulations: string[];
  };
  issuedAt: Date;
  effectiveAt: Date;
  expiresAt?: Date;
  status: 'active' | 'updated' | 'expired' | 'cancelled';
}

// Sample data
const sampleIncidents: WildfireIncident[] = [
  {
    id: 'fire-001',
    name: 'Mountain View Fire',
    startTime: new Date(),
    discoveryTime: new Date(),
    cause: 'lightning',
    status: 'uncontained',
    currentBehavior: 'surface',
    originLocation: { latitude: 34.2, longitude: -117.5, elevation: 4500 },
    currentPerimeter: {
      id: 'perim-001',
      timestamp: new Date(),
      area: 500,
      perimeterLength: 5.2,
      coordinates: [],
      activeEdges: [],
      containedEdges: [],
      confidence: 0.85,
      source: 'aerial'
    },
    perimeterHistory: [],
    weather: {
      timestamp: new Date(),
      temperature: 95,
      relativeHumidity: 15,
      windSpeed: 20,
      windDirection: 270,
      redFlagWarning: true,
      forecast: []
    },
    terrain: {
      slope: 25,
      aspect: 'SW',
      elevation: 4500,
      terrainType: 'mountainous',
      drainages: ['Canyon Creek'],
      barriers: []
    },
    fuels: {
      fuelType: 'shrub',
      fuelModel: 'SH5',
      moistureContent: { oneHour: 3, tenHour: 4, hundredHour: 8, live: 75 },
      fuelLoading: 8,
      fuelBedDepth: 6,
      burningIndex: 145
    },
    resources: [],
    evacuationZones: [],
    structures: {
      structuresTotal: 500,
      structuresThreatened: 150,
      structuresDestroyed: 0,
      structuresDamaged: 0,
      structuresDefended: 50,
      structuresByZone: [],
      criticalInfrastructure: []
    },
    projections: [],
    timeline: [],
    containment: 0,
    acresBurned: 500,
    lastUpdated: new Date()
  }
];

class WildfireSpreadService {
  private static instance: WildfireSpreadService;
  private incidents: Map<string, WildfireIncident> = new Map();
  private projections: Map<string, SpreadProjection> = new Map();
  private calculations: Map<string, FireBehaviorCalculation> = new Map();
  private alerts: Map<string, WildfireAlert> = new Map();

  // Fuel model parameters (simplified NFFL models)
  private readonly fuelModels: Record<string, {
    loadOneHour: number;
    loadTenHour: number;
    loadHundredHour: number;
    loadLive: number;
    depth: number;
    moisture: number;
    spreadRate: number;
    heatContent: number;
  }> = {
    'GR1': { loadOneHour: 0.1, loadTenHour: 0, loadHundredHour: 0, loadLive: 0.3, depth: 0.4, moisture: 15, spreadRate: 0.83, heatContent: 8000 },
    'GR2': { loadOneHour: 0.1, loadTenHour: 0, loadHundredHour: 0, loadLive: 1.0, depth: 1.0, moisture: 15, spreadRate: 1.33, heatContent: 8000 },
    'SH5': { loadOneHour: 3.6, loadTenHour: 2.1, loadHundredHour: 0, loadLive: 2.9, depth: 6.0, moisture: 15, spreadRate: 2.17, heatContent: 8000 },
    'TL3': { loadOneHour: 0.5, loadTenHour: 2.2, loadHundredHour: 2.8, loadLive: 0, depth: 0.3, moisture: 25, spreadRate: 0.33, heatContent: 8000 },
    'TU5': { loadOneHour: 4.0, loadTenHour: 4.0, loadHundredHour: 3.0, loadLive: 3.0, depth: 1.0, moisture: 25, spreadRate: 1.0, heatContent: 8000 }
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): WildfireSpreadService {
    if (!WildfireSpreadService.instance) {
      WildfireSpreadService.instance = new WildfireSpreadService();
    }
    return WildfireSpreadService.instance;
  }

  private initializeSampleData(): void {
    sampleIncidents.forEach(i => this.incidents.set(i.id, i));
  }

  // ==================== Incident Management ====================

  async createIncident(params: {
    name: string;
    incidentId?: string;
    cause: WildfireIncident['cause'];
    originLocation: WildfireIncident['originLocation'];
    weather: Partial<WeatherConditions>;
    terrain: Partial<TerrainInfo>;
    fuels: Partial<FuelConditions>;
    initialSize?: number;
  }): Promise<WildfireIncident> {
    const now = new Date();

    const incident: WildfireIncident = {
      id: `fire-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      incidentId: params.incidentId,
      startTime: now,
      discoveryTime: now,
      cause: params.cause,
      status: 'uncontained',
      currentBehavior: 'surface',
      originLocation: params.originLocation,
      currentPerimeter: {
        id: `perim-${Date.now()}`,
        timestamp: now,
        area: params.initialSize || 1,
        perimeterLength: Math.sqrt(params.initialSize || 1) * 0.1,
        coordinates: this.generateInitialPerimeter(params.originLocation, params.initialSize || 1),
        activeEdges: [],
        containedEdges: [],
        confidence: 0.7,
        source: 'ground'
      },
      perimeterHistory: [],
      weather: {
        timestamp: now,
        temperature: params.weather.temperature || 85,
        relativeHumidity: params.weather.relativeHumidity || 25,
        windSpeed: params.weather.windSpeed || 10,
        windDirection: params.weather.windDirection || 270,
        redFlagWarning: params.weather.redFlagWarning || false,
        forecast: []
      },
      terrain: {
        slope: params.terrain.slope || 10,
        aspect: params.terrain.aspect || 'S',
        elevation: params.terrain.elevation || params.originLocation.elevation,
        terrainType: params.terrain.terrainType || 'rolling',
        drainages: params.terrain.drainages || [],
        barriers: params.terrain.barriers || []
      },
      fuels: {
        fuelType: params.fuels.fuelType || 'grass',
        fuelModel: params.fuels.fuelModel || 'GR2',
        moistureContent: params.fuels.moistureContent || { oneHour: 5, tenHour: 7, hundredHour: 10, live: 80 },
        fuelLoading: params.fuels.fuelLoading || 2,
        fuelBedDepth: params.fuels.fuelBedDepth || 1
      },
      resources: [],
      evacuationZones: [],
      structures: {
        structuresTotal: 0,
        structuresThreatened: 0,
        structuresDestroyed: 0,
        structuresDamaged: 0,
        structuresDefended: 0,
        structuresByZone: [],
        criticalInfrastructure: []
      },
      projections: [],
      timeline: [{ timestamp: now, event: 'Fire discovered', details: `Origin: ${params.originLocation.latitude}, ${params.originLocation.longitude}` }],
      containment: 0,
      acresBurned: params.initialSize || 1,
      lastUpdated: now
    };

    this.incidents.set(incident.id, incident);

    // Generate initial projection
    await this.generateSpreadProjection(incident.id);

    return incident;
  }

  private generateInitialPerimeter(origin: { latitude: number; longitude: number }, acres: number): { latitude: number; longitude: number }[] {
    const radiusMiles = Math.sqrt(acres / 640); // Convert acres to circular radius
    const radiusDegrees = radiusMiles / 69; // Approximate miles to degrees

    const points: { latitude: number; longitude: number }[] = [];
    for (let angle = 0; angle < 360; angle += 15) {
      const rad = angle * Math.PI / 180;
      points.push({
        latitude: origin.latitude + radiusDegrees * Math.cos(rad),
        longitude: origin.longitude + radiusDegrees * Math.sin(rad) / Math.cos(origin.latitude * Math.PI / 180)
      });
    }
    return points;
  }

  async getIncident(fireId: string): Promise<WildfireIncident | null> {
    return this.incidents.get(fireId) || null;
  }

  async updateIncident(fireId: string, updates: {
    status?: FireStatus;
    behavior?: FireBehavior;
    containment?: number;
    acresBurned?: number;
    weather?: Partial<WeatherConditions>;
    structures?: Partial<StructureInfo>;
  }): Promise<WildfireIncident> {
    const incident = this.incidents.get(fireId);
    if (!incident) throw new Error(`Fire incident not found: ${fireId}`);

    if (updates.status) incident.status = updates.status;
    if (updates.behavior) incident.currentBehavior = updates.behavior;
    if (updates.containment !== undefined) incident.containment = updates.containment;
    if (updates.acresBurned !== undefined) {
      const growth = updates.acresBurned - incident.acresBurned;
      if (growth > 0) {
        incident.timeline.push({
          timestamp: new Date(),
          event: 'Fire growth',
          details: `Fire grew ${growth} acres to ${updates.acresBurned} total acres`
        });
      }
      incident.acresBurned = updates.acresBurned;
    }
    if (updates.weather) {
      incident.weather = { ...incident.weather, ...updates.weather, timestamp: new Date() };
    }
    if (updates.structures) {
      incident.structures = { ...incident.structures, ...updates.structures };
    }

    incident.lastUpdated = new Date();
    this.incidents.set(fireId, incident);

    // Check for alert conditions
    await this.checkAlertConditions(incident);

    return incident;
  }

  async updatePerimeter(fireId: string, perimeter: {
    area: number;
    coordinates: { latitude: number; longitude: number }[];
    source: FirePerimeter['source'];
    confidence?: number;
  }): Promise<FirePerimeter> {
    const incident = this.incidents.get(fireId);
    if (!incident) throw new Error(`Fire incident not found: ${fireId}`);

    // Save current perimeter to history
    incident.perimeterHistory.push(incident.currentPerimeter);

    const newPerimeter: FirePerimeter = {
      id: `perim-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(),
      area: perimeter.area,
      perimeterLength: this.calculatePerimeterLength(perimeter.coordinates),
      coordinates: perimeter.coordinates,
      activeEdges: this.identifyActiveEdges(perimeter.coordinates, incident),
      containedEdges: [],
      confidence: perimeter.confidence || 0.8,
      source: perimeter.source
    };

    incident.currentPerimeter = newPerimeter;
    incident.acresBurned = perimeter.area;
    incident.lastUpdated = new Date();
    incident.timeline.push({
      timestamp: new Date(),
      event: 'Perimeter updated',
      details: `New area: ${perimeter.area} acres`
    });

    this.incidents.set(fireId, incident);

    // Generate new projection
    await this.generateSpreadProjection(fireId);

    return newPerimeter;
  }

  private calculatePerimeterLength(coords: { latitude: number; longitude: number }[]): number {
    let length = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      length += this.calculateDistance(
        coords[i].latitude, coords[i].longitude,
        coords[j].latitude, coords[j].longitude
      );
    }
    return length;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private identifyActiveEdges(coords: { latitude: number; longitude: number }[], incident: WildfireIncident): ActiveEdge[] {
    const edges: ActiveEdge[] = [];
    const windDir = incident.weather.windDirection;

    // Identify head fire direction (downwind)
    const headDirection = (windDir + 180) % 360;

    for (let i = 0; i < coords.length; i += 3) {
      const edgeDirection = this.calculateEdgeDirection(coords[i], coords[(i + 1) % coords.length]);
      const angleDiff = Math.abs(edgeDirection - headDirection);
      const isHead = angleDiff < 45 || angleDiff > 315;

      const spreadRate = this.calculateSpreadRate(incident, isHead);
      const flameLength = this.calculateFlameLength(spreadRate, incident);

      edges.push({
        id: `edge-${i}`,
        startIndex: i,
        endIndex: (i + 3) % coords.length,
        spreadRate,
        flameLength,
        intensity: flameLength > 11 ? 'extreme' : flameLength > 8 ? 'high' : flameLength > 4 ? 'moderate' : 'low',
        direction: this.getDirection(edgeDirection),
        threat: spreadRate > 200 ? 'critical' : spreadRate > 100 ? 'significant' : spreadRate > 50 ? 'moderate' : 'minimal'
      });
    }

    return edges;
  }

  private calculateEdgeDirection(p1: { latitude: number; longitude: number }, p2: { latitude: number; longitude: number }): number {
    const dLon = p2.longitude - p1.longitude;
    const dLat = p2.latitude - p1.latitude;
    return (Math.atan2(dLon, dLat) * 180 / Math.PI + 360) % 360;
  }

  private getDirection(degrees: number): SpreadDirection {
    const directions: SpreadDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  // ==================== Fire Behavior Calculations ====================

  async calculateFireBehavior(params: {
    location: { latitude: number; longitude: number };
    fuelModel: string;
    slope: number;
    aspect: number;
    windSpeed: number;
    windDirection: number;
    moistures: FuelConditions['moistureContent'];
  }): Promise<FireBehaviorCalculation> {
    const fuelParams = this.fuelModels[params.fuelModel] || this.fuelModels['GR2'];

    // Simplified Rothermel calculations
    const slopeFactor = 1 + (params.slope / 100) * 2;
    const windFactor = 1 + (params.windSpeed / 10) * 0.5;
    const moistureFactor = Math.max(0.1, 1 - (params.moistures.oneHour / 30));

    const rateOfSpread = fuelParams.spreadRate * slopeFactor * windFactor * moistureFactor * 66; // chains/hour
    const firelineIntensity = rateOfSpread * fuelParams.heatContent * fuelParams.loadOneHour / 60;
    const flameLength = 0.45 * Math.pow(firelineIntensity, 0.46);
    const heatPerUnitArea = fuelParams.heatContent * (fuelParams.loadOneHour + fuelParams.loadTenHour);
    const reactionIntensity = heatPerUnitArea / fuelParams.depth;

    // Effective wind speed calculation
    const slopeWindEquivalent = params.slope * 0.5;
    const effectiveWindSpeed = params.windSpeed + slopeWindEquivalent;

    // Direction of maximum spread
    const directionOfMaxSpread = (params.windDirection + 180) % 360;

    // Crown fire potential
    let crownFirePotential = 'none';
    if (firelineIntensity > 500) crownFirePotential = 'active';
    else if (firelineIntensity > 200) crownFirePotential = 'passive';

    const calculation: FireBehaviorCalculation = {
      id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      location: params.location,
      timestamp: new Date(),
      inputs: {
        fuelModel: params.fuelModel,
        slope: params.slope,
        aspect: params.aspect,
        windSpeed: params.windSpeed,
        windDirection: params.windDirection,
        moistures: params.moistures
      },
      outputs: {
        rateOfSpread,
        flameLength,
        firelineIntensity,
        heatPerUnitArea,
        reactionIntensity,
        effectiveWindSpeed,
        directionOfMaxSpread,
        crownFirePotential
      }
    };

    this.calculations.set(calculation.id, calculation);
    return calculation;
  }

  private calculateSpreadRate(incident: WildfireIncident, isHead: boolean): number {
    const fuelParams = this.fuelModels[incident.fuels.fuelModel] || this.fuelModels['GR2'];
    const slopeFactor = 1 + (incident.terrain.slope / 100) * 2;
    const windFactor = 1 + (incident.weather.windSpeed / 10) * 0.5;
    const moistureFactor = Math.max(0.1, 1 - (incident.fuels.moistureContent.oneHour / 30));

    let rate = fuelParams.spreadRate * slopeFactor * windFactor * moistureFactor * 66;

    if (!isHead) {
      rate *= 0.3; // Flanking spread is about 30% of head fire
    }

    return rate;
  }

  private calculateFlameLength(spreadRate: number, incident: WildfireIncident): number {
    const fuelParams = this.fuelModels[incident.fuels.fuelModel] || this.fuelModels['GR2'];
    const firelineIntensity = spreadRate * fuelParams.heatContent * fuelParams.loadOneHour / 60;
    return 0.45 * Math.pow(firelineIntensity, 0.46);
  }

  // ==================== Spread Projection ====================

  async generateSpreadProjection(fireId: string, hoursAhead: number = 24): Promise<SpreadProjection> {
    const incident = this.incidents.get(fireId);
    if (!incident) throw new Error(`Fire incident not found: ${fireId}`);

    const timeSteps: ProjectionTimeStep[] = [];
    let currentArea = incident.acresBurned;
    let currentPerimeter = [...incident.currentPerimeter.coordinates];

    // Calculate fire behavior for projection
    const behavior = await this.calculateFireBehavior({
      location: incident.originLocation,
      fuelModel: incident.fuels.fuelModel,
      slope: incident.terrain.slope,
      aspect: this.aspectToDegrees(incident.terrain.aspect),
      windSpeed: incident.weather.windSpeed,
      windDirection: incident.weather.windDirection,
      moistures: incident.fuels.moistureContent
    });

    for (let h = 1; h <= hoursAhead; h++) {
      // Project perimeter growth
      const hourlyGrowth = this.projectHourlyGrowth(incident, behavior.outputs.rateOfSpread, h);
      currentArea += hourlyGrowth.areaGrowth;

      // Adjust perimeter
      currentPerimeter = this.expandPerimeter(currentPerimeter, hourlyGrowth.expansionRate, incident.weather.windDirection);

      // Calculate threat metrics
      const structuresAtRisk = this.calculateStructuresAtRisk(currentPerimeter, incident);
      const populationAtRisk = structuresAtRisk * 2.5;

      timeSteps.push({
        timestamp: new Date(Date.now() + h * 60 * 60 * 1000),
        projectedPerimeter: currentPerimeter,
        projectedArea: currentArea,
        spreadRate: {
          head: behavior.outputs.rateOfSpread,
          flanking: behavior.outputs.rateOfSpread * 0.3,
          backing: behavior.outputs.rateOfSpread * 0.1,
          maxSpotDistance: behavior.outputs.rateOfSpread > 100 ? behavior.outputs.rateOfSpread / 50 : undefined,
          averageRate: behavior.outputs.rateOfSpread * 0.5
        },
        firelinIntensity: behavior.outputs.firelineIntensity,
        flameLength: behavior.outputs.flameLength,
        heatPerUnitArea: behavior.outputs.heatPerUnitArea,
        rateOfSpread: behavior.outputs.rateOfSpread,
        headFireDirection: behavior.outputs.directionOfMaxSpread,
        spotFireProbability: this.calculateSpotFireProbability(incident, behavior),
        crownFirePotential: behavior.outputs.crownFirePotential as any,
        structuresAtRisk,
        populationAtRisk
      });
    }

    const projection: SpreadProjection = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fireId,
      model: 'simplified',
      createdAt: new Date(),
      validFrom: new Date(),
      validTo: new Date(Date.now() + hoursAhead * 60 * 60 * 1000),
      timeSteps,
      confidence: this.calculateProjectionConfidence(incident, hoursAhead),
      assumptions: [
        'Weather conditions remain constant',
        'No suppression activities',
        'Fuel continuity throughout projection area'
      ],
      warnings: this.generateProjectionWarnings(incident, timeSteps)
    };

    this.projections.set(projection.id, projection);
    incident.projections.push(projection);
    this.incidents.set(fireId, incident);

    return projection;
  }

  private aspectToDegrees(aspect: SpreadDirection): number {
    const directions: Record<SpreadDirection, number> = {
      'N': 0, 'NE': 45, 'E': 90, 'SE': 135, 'S': 180, 'SW': 225, 'W': 270, 'NW': 315
    };
    return directions[aspect];
  }

  private projectHourlyGrowth(incident: WildfireIncident, spreadRate: number, hour: number): { areaGrowth: number; expansionRate: number } {
    // Simplified growth model
    const baseGrowth = spreadRate * 0.01 * incident.currentPerimeter.area;
    const weatherFactor = incident.weather.relativeHumidity < 20 ? 1.5 : incident.weather.relativeHumidity < 30 ? 1.2 : 1.0;
    const windFactor = incident.weather.windSpeed > 20 ? 1.5 : incident.weather.windSpeed > 10 ? 1.2 : 1.0;

    return {
      areaGrowth: baseGrowth * weatherFactor * windFactor,
      expansionRate: spreadRate / 66 / 5280 // Convert chains/hour to miles/hour
    };
  }

  private expandPerimeter(perimeter: { latitude: number; longitude: number }[], rate: number, windDirection: number): { latitude: number; longitude: number }[] {
    const headDirection = (windDirection + 180) % 360;

    return perimeter.map((point, index) => {
      const angle = (index / perimeter.length) * 360;
      const angleDiff = Math.abs(angle - headDirection);
      const isHead = angleDiff < 45 || angleDiff > 315;

      const expansion = isHead ? rate : rate * 0.3;
      const expansionDegrees = expansion / 69;

      return {
        latitude: point.latitude + expansionDegrees * Math.cos(angle * Math.PI / 180),
        longitude: point.longitude + expansionDegrees * Math.sin(angle * Math.PI / 180) / Math.cos(point.latitude * Math.PI / 180)
      };
    });
  }

  private calculateStructuresAtRisk(perimeter: { latitude: number; longitude: number }[], incident: WildfireIncident): number {
    // Simplified - would integrate with actual structure data
    const area = this.calculatePolygonArea(perimeter);
    return Math.round(area * 0.5); // Assume 0.5 structures per acre at risk
  }

  private calculatePolygonArea(coords: { latitude: number; longitude: number }[]): number {
    // Shoelace formula (simplified)
    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      area += coords[i].latitude * coords[j].longitude;
      area -= coords[j].latitude * coords[i].longitude;
    }
    area = Math.abs(area) / 2;
    return area * 4046.86 * 69 * 69; // Convert to acres (very rough)
  }

  private calculateSpotFireProbability(incident: WildfireIncident, behavior: FireBehaviorCalculation): number {
    let probability = 0;

    if (behavior.outputs.firelineIntensity > 500) probability += 0.4;
    else if (behavior.outputs.firelineIntensity > 200) probability += 0.2;

    if (incident.weather.windSpeed > 30) probability += 0.3;
    else if (incident.weather.windSpeed > 20) probability += 0.15;

    if (incident.fuels.moistureContent.oneHour < 5) probability += 0.2;

    return Math.min(1, probability);
  }

  private calculateProjectionConfidence(incident: WildfireIncident, hours: number): number {
    let confidence = 0.9;

    // Reduce confidence for longer projections
    confidence -= hours * 0.02;

    // Reduce for extreme conditions
    if (incident.weather.windSpeed > 30) confidence -= 0.1;
    if (incident.weather.relativeHumidity < 15) confidence -= 0.1;
    if (incident.currentBehavior === 'extreme') confidence -= 0.15;

    return Math.max(0.3, confidence);
  }

  private generateProjectionWarnings(incident: WildfireIncident, timeSteps: ProjectionTimeStep[]): string[] {
    const warnings: string[] = [];

    if (incident.weather.redFlagWarning) {
      warnings.push('Red Flag Warning in effect - extreme fire behavior possible');
    }

    if (timeSteps.some(ts => ts.crownFirePotential === 'active')) {
      warnings.push('Active crown fire potential - rapid spread expected');
    }

    if (timeSteps.some(ts => ts.spotFireProbability > 0.5)) {
      warnings.push('High spot fire probability - fire may spread beyond perimeter');
    }

    if (timeSteps[timeSteps.length - 1]?.structuresAtRisk > 100) {
      warnings.push('Significant structures at risk - evacuation may be necessary');
    }

    return warnings;
  }

  // ==================== Alert Management ====================

  private async checkAlertConditions(incident: WildfireIncident): Promise<void> {
    const latestProjection = incident.projections[incident.projections.length - 1];

    if (latestProjection?.timeSteps.some(ts => ts.structuresAtRisk > 50)) {
      await this.createAlert({
        fireId: incident.id,
        type: 'evacuation',
        level: latestProjection.timeSteps.some(ts => ts.structuresAtRisk > 200) ? 'evacuation_order' : 'evacuation_warning',
        affectedAreas: ['surrounding_areas'],
        population: latestProjection.timeSteps[0]?.populationAtRisk || 0
      });
    }
  }

  async createAlert(params: {
    fireId: string;
    type: WildfireAlert['type'];
    level: AlertLevel;
    affectedAreas: string[];
    population: number;
    evacuationInfo?: WildfireAlert['evacuationInfo'];
  }): Promise<WildfireAlert> {
    const incident = this.incidents.get(params.fireId);
    const fireName = incident?.name || 'Unknown Fire';

    const alert: WildfireAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fireId: params.fireId,
      type: params.type,
      level: params.level,
      title: this.generateAlertTitle(params.type, params.level, fireName),
      message: this.generateAlertMessage(params.type, params.level, fireName),
      affectedAreas: params.affectedAreas,
      population: params.population,
      instructions: this.getAlertInstructions(params.level),
      evacuationInfo: params.evacuationInfo || (params.level === 'evacuation_order' || params.level === 'evacuation_warning' ? {
        zones: params.affectedAreas,
        routes: ['Primary evacuation route', 'Secondary evacuation route'],
        shelters: ['Emergency Shelter A', 'Emergency Shelter B']
      } : undefined),
      healthAdvisory: {
        aqiImpact: 'Air quality may be unhealthy due to smoke',
        recommendations: [
          'Limit outdoor activities',
          'Keep windows and doors closed',
          'Use air purifiers if available'
        ],
        vulnerablePopulations: ['Elderly', 'Children', 'Those with respiratory conditions']
      },
      issuedAt: new Date(),
      effectiveAt: new Date(),
      status: 'active'
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private generateAlertTitle(type: WildfireAlert['type'], level: AlertLevel, fireName: string): string {
    const levelText = level.toUpperCase().replace(/_/g, ' ');
    return `${levelText}: ${fireName}`;
  }

  private generateAlertMessage(type: WildfireAlert['type'], level: AlertLevel, fireName: string): string {
    switch (level) {
      case 'evacuation_order':
        return `MANDATORY EVACUATION ORDER for the ${fireName}. Leave immediately. Follow designated evacuation routes.`;
      case 'evacuation_warning':
        return `EVACUATION WARNING for the ${fireName}. Be prepared to evacuate. Have essential items ready.`;
      case 'warning':
        return `Fire conditions are dangerous. The ${fireName} is actively spreading. Monitor conditions closely.`;
      case 'watch':
        return `Fire weather conditions exist. The ${fireName} may become active. Be aware and prepared.`;
      default:
        return `Information regarding the ${fireName}. Monitor for updates.`;
    }
  }

  private getAlertInstructions(level: AlertLevel): string[] {
    switch (level) {
      case 'evacuation_order':
        return [
          'Leave immediately',
          'Take only essential items',
          'Follow designated evacuation routes',
          'Do not return until authorities give all-clear',
          'Check in at designated shelter'
        ];
      case 'evacuation_warning':
        return [
          'Be ready to evacuate at a moment\'s notice',
          'Pack essential items and medications',
          'Identify evacuation routes',
          'Make arrangements for pets and livestock',
          'Monitor emergency communications'
        ];
      case 'warning':
        return [
          'Stay informed through official channels',
          'Know your evacuation zone',
          'Prepare emergency supplies',
          'Create defensible space around home if time permits'
        ];
      default:
        return [
          'Monitor conditions',
          'Stay informed',
          'Be prepared'
        ];
    }
  }

  // ==================== Statistics ====================

  async getStatistics(fireId?: string): Promise<{
    totalIncidents: number;
    activeIncidents: number;
    totalAcresBurned: number;
    containmentAverage: number;
    structuresThreatened: number;
    structuresDestroyed: number;
    activeAlerts: number;
    resourcesDeployed: number;
    byStatus: Record<FireStatus, number>;
    byBehavior: Record<FireBehavior, number>;
  }> {
    let incidents = Array.from(this.incidents.values());

    if (fireId) {
      incidents = incidents.filter(i => i.id === fireId);
    }

    const byStatus: Record<FireStatus, number> = {
      uncontained: 0, partially_contained: 0, contained: 0, controlled: 0, extinguished: 0
    };
    const byBehavior: Record<FireBehavior, number> = {
      surface: 0, crown_passive: 0, crown_active: 0, spotting: 0, ground: 0, extreme: 0
    };

    let totalAcres = 0;
    let totalContainment = 0;
    let totalThreatened = 0;
    let totalDestroyed = 0;
    let totalResources = 0;

    incidents.forEach(i => {
      byStatus[i.status]++;
      byBehavior[i.currentBehavior]++;
      totalAcres += i.acresBurned;
      totalContainment += i.containment;
      totalThreatened += i.structures.structuresThreatened;
      totalDestroyed += i.structures.structuresDestroyed;
      totalResources += i.resources.length;
    });

    const activeIncidents = incidents.filter(i => i.status !== 'extinguished' && i.status !== 'controlled').length;

    return {
      totalIncidents: incidents.length,
      activeIncidents,
      totalAcresBurned: totalAcres,
      containmentAverage: incidents.length > 0 ? totalContainment / incidents.length : 0,
      structuresThreatened: totalThreatened,
      structuresDestroyed: totalDestroyed,
      activeAlerts: Array.from(this.alerts.values()).filter(a => a.status === 'active').length,
      resourcesDeployed: totalResources,
      byStatus,
      byBehavior
    };
  }
}

export const wildfireSpreadService = WildfireSpreadService.getInstance();
export default WildfireSpreadService;

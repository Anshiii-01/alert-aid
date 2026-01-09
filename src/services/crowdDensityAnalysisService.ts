/**
 * Crowd Density Analysis Service - Issue #134 Implementation
 * 
 * Provides comprehensive crowd monitoring, density analysis, and flow prediction
 * for evacuation planning, shelter management, and public safety. Uses computer
 * vision integration, sensor data, and historical patterns for real-time analytics.
 */

// Type definitions
type DensityLevel = 'empty' | 'sparse' | 'moderate' | 'dense' | 'overcrowded' | 'critical';
type FlowDirection = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest' | 'stationary' | 'dispersing';
type AlertType = 'overcrowding' | 'stampede_risk' | 'bottleneck' | 'flow_reversal' | 'capacity_breach' | 'anomaly_detected';
type ZoneType = 'evacuation_route' | 'shelter' | 'checkpoint' | 'staging_area' | 'public_space' | 'transit_hub' | 'medical_point' | 'restricted';
type DataSource = 'camera' | 'sensor' | 'mobile' | 'wifi' | 'manual' | 'satellite' | 'drone' | 'lidar';

// Monitoring zone interfaces
interface MonitoringZone {
  id: string;
  name: string;
  type: ZoneType;
  incidentId?: string;
  location: {
    coordinates: { lat: number; lon: number }[];
    center: { lat: number; lon: number };
    areaSquareMeters: number;
  };
  capacity: {
    safe: number;
    maximum: number;
    emergency: number;
  };
  entrances: ZoneEntrance[];
  exits: ZoneExit[];
  dataSources: ZoneDataSource[];
  currentMetrics?: ZoneMetrics;
  thresholds: ZoneThresholds;
  status: 'active' | 'inactive' | 'maintenance';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface ZoneEntrance {
  id: string;
  name: string;
  location: { lat: number; lon: number };
  width: number;
  capacity: number;
  isOpen: boolean;
  flowRate?: number;
}

interface ZoneExit {
  id: string;
  name: string;
  location: { lat: number; lon: number };
  width: number;
  capacity: number;
  isOpen: boolean;
  isEmergencyExit: boolean;
  flowRate?: number;
}

interface ZoneDataSource {
  id: string;
  type: DataSource;
  name: string;
  location?: { lat: number; lon: number };
  coverageArea?: number;
  accuracy: number;
  isActive: boolean;
  lastDataTime?: Date;
}

interface ZoneMetrics {
  timestamp: Date;
  currentCount: number;
  density: number;
  densityLevel: DensityLevel;
  occupancyRate: number;
  flowRate: {
    incoming: number;
    outgoing: number;
    net: number;
  };
  dominantFlowDirection: FlowDirection;
  avgDwellTime: number;
  velocityAvg: number;
  hotspots: Hotspot[];
  confidence: number;
}

interface ZoneThresholds {
  warningOccupancy: number;
  criticalOccupancy: number;
  maxDensity: number;
  minFlowRate: number;
  maxDwellTime: number;
  stampedRiskVelocity: number;
}

interface Hotspot {
  id: string;
  location: { lat: number; lon: number };
  radius: number;
  density: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
}

// Crowd measurement interfaces
interface CrowdMeasurement {
  id: string;
  zoneId: string;
  timestamp: Date;
  source: DataSource;
  sourceId: string;
  headCount: number;
  density: number;
  confidence: number;
  flowVectors: FlowVector[];
  demographics?: DemographicEstimate;
  rawData?: any;
}

interface FlowVector {
  location: { lat: number; lon: number };
  direction: number; // degrees from north
  magnitude: number; // people per meter per second
  confidence: number;
}

interface DemographicEstimate {
  ageGroups?: {
    children: number;
    adults: number;
    elderly: number;
  };
  mobilityImpaired?: number;
  withLuggage?: number;
}

// Movement tracking interfaces
interface CrowdMovement {
  id: string;
  zoneId: string;
  period: { start: Date; end: Date };
  totalInflow: number;
  totalOutflow: number;
  peakCount: number;
  peakTime: Date;
  avgCount: number;
  entranceStats: { entranceId: string; count: number; avgRate: number }[];
  exitStats: { exitId: string; count: number; avgRate: number }[];
  flowPatterns: FlowPattern[];
}

interface FlowPattern {
  startLocation: { lat: number; lon: number };
  endLocation: { lat: number; lon: number };
  volume: number;
  avgTravelTime: number;
  pathType: 'direct' | 'indirect' | 'congested';
}

// Alert interfaces
interface CrowdAlert {
  id: string;
  zoneId: string;
  zoneName: string;
  incidentId?: string;
  type: AlertType;
  severity: 'warning' | 'critical' | 'emergency';
  title: string;
  description: string;
  location?: { lat: number; lon: number };
  metrics: {
    currentValue: number;
    threshold: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  recommendedActions: string[];
  affectedCapacity: number;
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

// Prediction interfaces
interface CrowdPrediction {
  id: string;
  zoneId: string;
  generatedAt: Date;
  horizon: number; // minutes
  predictions: PredictionPoint[];
  confidence: number;
  methodology: 'historical' | 'ml_model' | 'simulation' | 'hybrid';
  assumptions: string[];
}

interface PredictionPoint {
  timestamp: Date;
  predictedCount: number;
  predictedDensity: number;
  predictedFlowRate: number;
  confidenceInterval: { low: number; high: number };
  riskLevel: DensityLevel;
}

// Evacuation interfaces
interface EvacuationScenario {
  id: string;
  zoneId: string;
  name: string;
  currentPopulation: number;
  targetCapacity: number;
  estimatedDuration: number;
  exitUtilization: { exitId: string; allocation: number; flowRate: number }[];
  bottlenecks: { location: { lat: number; lon: number }; severity: number; mitigation: string }[];
  phases: EvacuationPhase[];
  riskAssessment: {
    overcrowdingRisk: number;
    stampedRisk: number;
    bottleneckRisk: number;
  };
  recommendations: string[];
  createdAt: Date;
}

interface EvacuationPhase {
  phase: number;
  description: string;
  duration: number;
  exitsToUse: string[];
  populationToMove: number;
  instructions: string;
}

// Historical data interfaces
interface HistoricalPattern {
  id: string;
  zoneId: string;
  patternType: 'daily' | 'weekly' | 'event' | 'emergency';
  dayOfWeek?: number;
  hourOfDay?: number;
  eventType?: string;
  avgCount: number;
  peakCount: number;
  peakTime: string;
  avgDwellTime: number;
  flowPatterns: { hour: number; inflow: number; outflow: number }[];
  sampleSize: number;
  confidence: number;
}

// Capacity management interfaces
interface CapacityEvent {
  id: string;
  zoneId: string;
  timestamp: Date;
  eventType: 'capacity_changed' | 'entrance_closed' | 'exit_closed' | 'emergency_declared' | 'all_clear';
  previousCapacity?: number;
  newCapacity?: number;
  reason: string;
  authorizedBy: string;
  duration?: number;
}

// Sample data
const sampleZones: MonitoringZone[] = [
  {
    id: 'zone-001',
    name: 'Central Evacuation Shelter',
    type: 'shelter',
    incidentId: 'incident-001',
    location: {
      coordinates: [
        { lat: 37.7749, lon: -122.4194 },
        { lat: 37.7759, lon: -122.4194 },
        { lat: 37.7759, lon: -122.4184 },
        { lat: 37.7749, lon: -122.4184 }
      ],
      center: { lat: 37.7754, lon: -122.4189 },
      areaSquareMeters: 5000
    },
    capacity: {
      safe: 500,
      maximum: 750,
      emergency: 1000
    },
    entrances: [
      { id: 'entrance-001', name: 'Main Entrance', location: { lat: 37.7749, lon: -122.4189 }, width: 4, capacity: 200, isOpen: true, flowRate: 50 },
      { id: 'entrance-002', name: 'Side Entrance', location: { lat: 37.7754, lon: -122.4194 }, width: 2, capacity: 100, isOpen: true, flowRate: 25 }
    ],
    exits: [
      { id: 'exit-001', name: 'Main Exit', location: { lat: 37.7759, lon: -122.4189 }, width: 4, capacity: 200, isOpen: true, isEmergencyExit: false, flowRate: 45 },
      { id: 'exit-002', name: 'Emergency Exit A', location: { lat: 37.7754, lon: -122.4184 }, width: 2, capacity: 150, isOpen: true, isEmergencyExit: true }
    ],
    dataSources: [
      { id: 'cam-001', type: 'camera', name: 'Main Hall Camera', accuracy: 0.92, isActive: true, lastDataTime: new Date() },
      { id: 'sensor-001', type: 'sensor', name: 'Entrance Counter', accuracy: 0.95, isActive: true, lastDataTime: new Date() }
    ],
    currentMetrics: {
      timestamp: new Date(),
      currentCount: 320,
      density: 0.064,
      densityLevel: 'moderate',
      occupancyRate: 0.64,
      flowRate: { incoming: 15, outgoing: 10, net: 5 },
      dominantFlowDirection: 'east',
      avgDwellTime: 45,
      velocityAvg: 1.2,
      hotspots: [],
      confidence: 0.89
    },
    thresholds: {
      warningOccupancy: 0.7,
      criticalOccupancy: 0.9,
      maxDensity: 0.4,
      minFlowRate: -20,
      maxDwellTime: 180,
      stampedRiskVelocity: 2.5
    },
    status: 'active',
    metadata: { building: 'Community Center', floor: 1 },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class CrowdDensityAnalysisService {
  private static instance: CrowdDensityAnalysisService;
  private zones: Map<string, MonitoringZone> = new Map();
  private measurements: Map<string, CrowdMeasurement[]> = new Map();
  private movements: Map<string, CrowdMovement[]> = new Map();
  private alerts: Map<string, CrowdAlert> = new Map();
  private predictions: Map<string, CrowdPrediction[]> = new Map();
  private patterns: Map<string, HistoricalPattern[]> = new Map();
  private capacityEvents: Map<string, CapacityEvent[]> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CrowdDensityAnalysisService {
    if (!CrowdDensityAnalysisService.instance) {
      CrowdDensityAnalysisService.instance = new CrowdDensityAnalysisService();
    }
    return CrowdDensityAnalysisService.instance;
  }

  private initializeSampleData(): void {
    sampleZones.forEach(z => this.zones.set(z.id, z));
  }

  // ==================== Zone Management ====================

  async createZone(params: {
    name: string;
    type: ZoneType;
    incidentId?: string;
    coordinates: { lat: number; lon: number }[];
    capacity: MonitoringZone['capacity'];
    entrances?: Omit<ZoneEntrance, 'flowRate'>[];
    exits?: Omit<ZoneExit, 'flowRate'>[];
    thresholds?: Partial<ZoneThresholds>;
  }): Promise<MonitoringZone> {
    // Calculate center and area
    const lats = params.coordinates.map(c => c.lat);
    const lons = params.coordinates.map(c => c.lon);
    const center = {
      lat: lats.reduce((a, b) => a + b, 0) / lats.length,
      lon: lons.reduce((a, b) => a + b, 0) / lons.length
    };

    // Approximate area using shoelace formula
    let area = 0;
    for (let i = 0; i < params.coordinates.length; i++) {
      const j = (i + 1) % params.coordinates.length;
      area += params.coordinates[i].lat * params.coordinates[j].lon;
      area -= params.coordinates[j].lat * params.coordinates[i].lon;
    }
    area = Math.abs(area / 2) * 111320 * 111320; // Convert to square meters (approximate)

    const zone: MonitoringZone = {
      id: `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      incidentId: params.incidentId,
      location: {
        coordinates: params.coordinates,
        center,
        areaSquareMeters: area
      },
      capacity: params.capacity,
      entrances: (params.entrances || []).map(e => ({ ...e, flowRate: 0 })),
      exits: (params.exits || []).map(e => ({ ...e, flowRate: 0 })),
      dataSources: [],
      thresholds: {
        warningOccupancy: params.thresholds?.warningOccupancy || 0.7,
        criticalOccupancy: params.thresholds?.criticalOccupancy || 0.9,
        maxDensity: params.thresholds?.maxDensity || 0.4,
        minFlowRate: params.thresholds?.minFlowRate || -50,
        maxDwellTime: params.thresholds?.maxDwellTime || 240,
        stampedRiskVelocity: params.thresholds?.stampedRiskVelocity || 2.5
      },
      status: 'active',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.zones.set(zone.id, zone);
    this.measurements.set(zone.id, []);
    this.movements.set(zone.id, []);
    this.predictions.set(zone.id, []);

    return zone;
  }

  async getZone(zoneId: string): Promise<MonitoringZone | null> {
    return this.zones.get(zoneId) || null;
  }

  async getZones(params?: {
    type?: ZoneType;
    incidentId?: string;
    status?: MonitoringZone['status'];
  }): Promise<MonitoringZone[]> {
    let zones = Array.from(this.zones.values());

    if (params?.type) {
      zones = zones.filter(z => z.type === params.type);
    }

    if (params?.incidentId) {
      zones = zones.filter(z => z.incidentId === params.incidentId);
    }

    if (params?.status) {
      zones = zones.filter(z => z.status === params.status);
    }

    return zones;
  }

  async updateZone(zoneId: string, updates: Partial<MonitoringZone>): Promise<MonitoringZone> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    Object.assign(zone, updates, { updatedAt: new Date() });
    return zone;
  }

  async addDataSource(zoneId: string, source: Omit<ZoneDataSource, 'lastDataTime'>): Promise<MonitoringZone> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    zone.dataSources.push({ ...source, lastDataTime: undefined });
    zone.updatedAt = new Date();

    return zone;
  }

  async updateEntrance(zoneId: string, entranceId: string, updates: Partial<ZoneEntrance>): Promise<MonitoringZone> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    const entrance = zone.entrances.find(e => e.id === entranceId);
    if (!entrance) throw new Error(`Entrance not found: ${entranceId}`);

    Object.assign(entrance, updates);
    zone.updatedAt = new Date();

    return zone;
  }

  async updateExit(zoneId: string, exitId: string, updates: Partial<ZoneExit>): Promise<MonitoringZone> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    const exit = zone.exits.find(e => e.id === exitId);
    if (!exit) throw new Error(`Exit not found: ${exitId}`);

    Object.assign(exit, updates);
    zone.updatedAt = new Date();

    return zone;
  }

  // ==================== Measurements ====================

  async recordMeasurement(params: {
    zoneId: string;
    source: DataSource;
    sourceId: string;
    headCount: number;
    confidence: number;
    flowVectors?: FlowVector[];
    demographics?: DemographicEstimate;
    rawData?: any;
  }): Promise<CrowdMeasurement> {
    const zone = this.zones.get(params.zoneId);
    if (!zone) throw new Error(`Zone not found: ${params.zoneId}`);

    const density = params.headCount / zone.location.areaSquareMeters;

    const measurement: CrowdMeasurement = {
      id: `measure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zoneId: params.zoneId,
      timestamp: new Date(),
      source: params.source,
      sourceId: params.sourceId,
      headCount: params.headCount,
      density,
      confidence: params.confidence,
      flowVectors: params.flowVectors || [],
      demographics: params.demographics,
      rawData: params.rawData
    };

    const zoneMeasurements = this.measurements.get(params.zoneId) || [];
    zoneMeasurements.push(measurement);
    
    // Keep last 1000 measurements per zone
    if (zoneMeasurements.length > 1000) {
      zoneMeasurements.shift();
    }
    
    this.measurements.set(params.zoneId, zoneMeasurements);

    // Update zone metrics
    await this.updateZoneMetrics(params.zoneId);

    // Check for alerts
    await this.checkAlertConditions(zone);

    // Update data source timestamp
    const dataSource = zone.dataSources.find(ds => ds.id === params.sourceId);
    if (dataSource) {
      dataSource.lastDataTime = new Date();
    }

    return measurement;
  }

  private async updateZoneMetrics(zoneId: string): Promise<void> {
    const zone = this.zones.get(zoneId);
    if (!zone) return;

    const recentMeasurements = (this.measurements.get(zoneId) || [])
      .filter(m => m.timestamp.getTime() > Date.now() - 5 * 60 * 1000) // Last 5 minutes
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (recentMeasurements.length === 0) return;

    // Calculate weighted average based on confidence
    const totalWeight = recentMeasurements.reduce((sum, m) => sum + m.confidence, 0);
    const weightedCount = recentMeasurements.reduce((sum, m) => sum + m.headCount * m.confidence, 0) / totalWeight;
    const weightedDensity = recentMeasurements.reduce((sum, m) => sum + m.density * m.confidence, 0) / totalWeight;

    // Calculate flow rates
    const entranceFlows = zone.entrances.reduce((sum, e) => sum + (e.flowRate || 0), 0);
    const exitFlows = zone.exits.reduce((sum, e) => sum + (e.flowRate || 0), 0);

    // Determine dominant flow direction from vectors
    const allVectors = recentMeasurements.flatMap(m => m.flowVectors);
    const dominantDirection = this.calculateDominantDirection(allVectors);

    // Identify hotspots
    const hotspots = this.identifyHotspots(recentMeasurements, zone);

    // Calculate density level
    const densityLevel = this.calculateDensityLevel(weightedDensity, zone);

    zone.currentMetrics = {
      timestamp: new Date(),
      currentCount: Math.round(weightedCount),
      density: weightedDensity,
      densityLevel,
      occupancyRate: weightedCount / zone.capacity.safe,
      flowRate: {
        incoming: entranceFlows,
        outgoing: exitFlows,
        net: entranceFlows - exitFlows
      },
      dominantFlowDirection: dominantDirection,
      avgDwellTime: 30, // Would be calculated from tracking data
      velocityAvg: allVectors.length > 0 
        ? allVectors.reduce((sum, v) => sum + v.magnitude, 0) / allVectors.length 
        : 0,
      hotspots,
      confidence: recentMeasurements.reduce((sum, m) => sum + m.confidence, 0) / recentMeasurements.length
    };

    zone.updatedAt = new Date();
  }

  private calculateDominantDirection(vectors: FlowVector[]): FlowDirection {
    if (vectors.length === 0) return 'stationary';

    const avgDirection = vectors.reduce((sum, v) => sum + v.direction * v.magnitude, 0) /
      vectors.reduce((sum, v) => sum + v.magnitude, 0);

    const avgMagnitude = vectors.reduce((sum, v) => sum + v.magnitude, 0) / vectors.length;

    if (avgMagnitude < 0.1) return 'stationary';

    // Convert angle to cardinal direction
    const directions: FlowDirection[] = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
    const index = Math.round(((avgDirection + 360) % 360) / 45) % 8;
    
    return directions[index];
  }

  private identifyHotspots(measurements: CrowdMeasurement[], zone: MonitoringZone): Hotspot[] {
    // Simplified hotspot detection - production would use spatial clustering
    const hotspots: Hotspot[] = [];

    if (zone.currentMetrics && zone.currentMetrics.density > zone.thresholds.maxDensity * 0.7) {
      hotspots.push({
        id: `hotspot-${Date.now()}`,
        location: zone.location.center,
        radius: 10,
        density: zone.currentMetrics.density,
        severity: zone.currentMetrics.density > zone.thresholds.maxDensity ? 'critical' : 'high',
        trend: 'stable'
      });
    }

    return hotspots;
  }

  private calculateDensityLevel(density: number, zone: MonitoringZone): DensityLevel {
    if (density === 0) return 'empty';
    if (density < 0.02) return 'sparse';
    if (density < 0.1) return 'moderate';
    if (density < zone.thresholds.maxDensity * 0.8) return 'dense';
    if (density < zone.thresholds.maxDensity) return 'overcrowded';
    return 'critical';
  }

  async getMeasurements(zoneId: string, params?: {
    startTime?: Date;
    endTime?: Date;
    source?: DataSource;
    limit?: number;
  }): Promise<CrowdMeasurement[]> {
    let measurements = this.measurements.get(zoneId) || [];

    if (params?.startTime) {
      measurements = measurements.filter(m => m.timestamp >= params.startTime!);
    }

    if (params?.endTime) {
      measurements = measurements.filter(m => m.timestamp <= params.endTime!);
    }

    if (params?.source) {
      measurements = measurements.filter(m => m.source === params.source);
    }

    measurements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (params?.limit) {
      measurements = measurements.slice(0, params.limit);
    }

    return measurements;
  }

  // ==================== Alert Management ====================

  private async checkAlertConditions(zone: MonitoringZone): Promise<void> {
    if (!zone.currentMetrics) return;

    const metrics = zone.currentMetrics;

    // Check overcrowding
    if (metrics.occupancyRate >= zone.thresholds.criticalOccupancy) {
      await this.createAlert({
        zoneId: zone.id,
        type: 'overcrowding',
        severity: 'critical',
        title: `Critical overcrowding in ${zone.name}`,
        description: `Occupancy at ${(metrics.occupancyRate * 100).toFixed(1)}% of safe capacity`,
        metrics: {
          currentValue: metrics.occupancyRate,
          threshold: zone.thresholds.criticalOccupancy,
          trend: 'increasing'
        }
      });
    } else if (metrics.occupancyRate >= zone.thresholds.warningOccupancy) {
      await this.createAlert({
        zoneId: zone.id,
        type: 'overcrowding',
        severity: 'warning',
        title: `High occupancy warning in ${zone.name}`,
        description: `Occupancy at ${(metrics.occupancyRate * 100).toFixed(1)}% of safe capacity`,
        metrics: {
          currentValue: metrics.occupancyRate,
          threshold: zone.thresholds.warningOccupancy,
          trend: 'increasing'
        }
      });
    }

    // Check density
    if (metrics.density >= zone.thresholds.maxDensity) {
      await this.createAlert({
        zoneId: zone.id,
        type: 'capacity_breach',
        severity: 'critical',
        title: `Dangerous density level in ${zone.name}`,
        description: `Density at ${metrics.density.toFixed(3)} people/m² exceeds safe limit`,
        metrics: {
          currentValue: metrics.density,
          threshold: zone.thresholds.maxDensity,
          trend: 'increasing'
        }
      });
    }

    // Check for stampede risk (high velocity)
    if (metrics.velocityAvg >= zone.thresholds.stampedRiskVelocity) {
      await this.createAlert({
        zoneId: zone.id,
        type: 'stampede_risk',
        severity: 'emergency',
        title: `Stampede risk detected in ${zone.name}`,
        description: `Crowd velocity at ${metrics.velocityAvg.toFixed(2)} m/s indicates potential stampede`,
        metrics: {
          currentValue: metrics.velocityAvg,
          threshold: zone.thresholds.stampedRiskVelocity,
          trend: 'increasing'
        }
      });
    }
  }

  async createAlert(params: {
    zoneId: string;
    type: AlertType;
    severity: CrowdAlert['severity'];
    title: string;
    description: string;
    location?: { lat: number; lon: number };
    metrics: CrowdAlert['metrics'];
  }): Promise<CrowdAlert> {
    const zone = this.zones.get(params.zoneId);
    if (!zone) throw new Error(`Zone not found: ${params.zoneId}`);

    // Check for existing similar active alert
    const existingAlert = Array.from(this.alerts.values()).find(a =>
      a.zoneId === params.zoneId &&
      a.type === params.type &&
      a.status === 'active'
    );

    if (existingAlert) {
      // Update existing alert if severity increased
      if (
        (params.severity === 'emergency') ||
        (params.severity === 'critical' && existingAlert.severity !== 'emergency')
      ) {
        existingAlert.severity = params.severity;
        existingAlert.metrics = params.metrics;
        existingAlert.description = params.description;
      }
      return existingAlert;
    }

    const recommendedActions = this.getRecommendedActions(params.type, params.severity);

    const alert: CrowdAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zoneId: params.zoneId,
      zoneName: zone.name,
      incidentId: zone.incidentId,
      type: params.type,
      severity: params.severity,
      title: params.title,
      description: params.description,
      location: params.location,
      metrics: params.metrics,
      recommendedActions,
      affectedCapacity: zone.currentMetrics?.currentCount || 0,
      createdAt: new Date(),
      status: 'active'
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private getRecommendedActions(type: AlertType, severity: CrowdAlert['severity']): string[] {
    const actions: string[] = [];

    switch (type) {
      case 'overcrowding':
        actions.push('Temporarily close additional entrances');
        actions.push('Direct incoming crowd to alternative locations');
        if (severity === 'critical' || severity === 'emergency') {
          actions.push('Begin controlled evacuation');
          actions.push('Open emergency exits');
        }
        break;
      case 'stampede_risk':
        actions.push('Immediately dispatch crowd control personnel');
        actions.push('Activate emergency PA system with calming announcements');
        actions.push('Open all emergency exits');
        actions.push('Create physical barriers to slow movement');
        break;
      case 'bottleneck':
        actions.push('Deploy personnel to manage flow at bottleneck');
        actions.push('Open additional exits if available');
        actions.push('Redirect crowd through alternative routes');
        break;
      case 'capacity_breach':
        actions.push('Close all entrances immediately');
        actions.push('Begin managed exit procedure');
        actions.push('Notify emergency services');
        break;
      default:
        actions.push('Monitor situation closely');
        actions.push('Prepare contingency measures');
    }

    return actions;
  }

  async getAlerts(params?: {
    zoneId?: string;
    incidentId?: string;
    type?: AlertType;
    severity?: CrowdAlert['severity'];
    status?: CrowdAlert['status'];
  }): Promise<CrowdAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.zoneId) {
      alerts = alerts.filter(a => a.zoneId === params.zoneId);
    }

    if (params?.incidentId) {
      alerts = alerts.filter(a => a.incidentId === params.incidentId);
    }

    if (params?.type) {
      alerts = alerts.filter(a => a.type === params.type);
    }

    if (params?.severity) {
      alerts = alerts.filter(a => a.severity === params.severity);
    }

    if (params?.status) {
      alerts = alerts.filter(a => a.status === params.status);
    }

    return alerts.sort((a, b) => {
      const severityOrder = { emergency: 0, critical: 1, warning: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity] || b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<CrowdAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.status = 'acknowledged';
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;

    return alert;
  }

  async resolveAlert(alertId: string, resolvedBy: string): Promise<CrowdAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.status = 'resolved';
    alert.resolvedAt = new Date();
    alert.resolvedBy = resolvedBy;

    return alert;
  }

  // ==================== Predictions ====================

  async generatePrediction(zoneId: string, horizonMinutes: number = 60): Promise<CrowdPrediction> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    const measurements = await this.getMeasurements(zoneId, {
      startTime: new Date(Date.now() - 60 * 60 * 1000),
      limit: 100
    });

    const patterns = this.patterns.get(zoneId) || [];
    const currentCount = zone.currentMetrics?.currentCount || 0;
    const currentDensity = zone.currentMetrics?.density || 0;

    // Simple linear prediction - production would use ML models
    const predictions: PredictionPoint[] = [];
    const intervalMinutes = 5;
    const steps = horizonMinutes / intervalMinutes;

    // Calculate trend from recent measurements
    let trend = 0;
    if (measurements.length >= 2) {
      const recentCount = measurements[0].headCount;
      const olderCount = measurements[Math.min(measurements.length - 1, 10)].headCount;
      trend = (recentCount - olderCount) / measurements.length;
    }

    for (let i = 1; i <= steps; i++) {
      const minutesAhead = i * intervalMinutes;
      const predictedCount = Math.max(0, currentCount + trend * i);
      const predictedDensity = predictedCount / zone.location.areaSquareMeters;
      const predictedOccupancy = predictedCount / zone.capacity.safe;

      predictions.push({
        timestamp: new Date(Date.now() + minutesAhead * 60 * 1000),
        predictedCount: Math.round(predictedCount),
        predictedDensity,
        predictedFlowRate: trend * (60 / intervalMinutes), // Per hour
        confidenceInterval: {
          low: Math.round(predictedCount * 0.85),
          high: Math.round(predictedCount * 1.15)
        },
        riskLevel: this.calculateDensityLevel(predictedDensity, zone)
      });
    }

    const prediction: CrowdPrediction = {
      id: `pred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zoneId,
      generatedAt: new Date(),
      horizon: horizonMinutes,
      predictions,
      confidence: measurements.length > 10 ? 0.7 : 0.5,
      methodology: 'historical',
      assumptions: [
        'Current flow trends continue',
        'No major events or disruptions',
        'Similar patterns to historical data'
      ]
    };

    const zonePredictions = this.predictions.get(zoneId) || [];
    zonePredictions.push(prediction);
    
    // Keep last 24 hours of predictions
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    this.predictions.set(zoneId, zonePredictions.filter(p => p.generatedAt.getTime() > cutoff));

    return prediction;
  }

  async getPredictions(zoneId: string): Promise<CrowdPrediction[]> {
    return this.predictions.get(zoneId) || [];
  }

  // ==================== Evacuation Planning ====================

  async simulateEvacuation(zoneId: string, targetDuration?: number): Promise<EvacuationScenario> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    const currentPopulation = zone.currentMetrics?.currentCount || zone.capacity.safe * 0.5;
    const openExits = zone.exits.filter(e => e.isOpen);
    const totalExitCapacity = openExits.reduce((sum, e) => sum + e.capacity, 0);

    // Calculate optimal exit utilization
    const exitUtilization = openExits.map(exit => {
      const proportion = exit.capacity / totalExitCapacity;
      return {
        exitId: exit.id,
        allocation: Math.ceil(currentPopulation * proportion),
        flowRate: Math.min(exit.capacity / 60, exit.width * 40) // People per minute
      };
    });

    // Estimate duration
    const totalFlowRate = exitUtilization.reduce((sum, e) => sum + e.flowRate, 0);
    const estimatedDuration = Math.ceil(currentPopulation / totalFlowRate);

    // Identify bottlenecks
    const bottlenecks: EvacuationScenario['bottlenecks'] = [];
    openExits.forEach(exit => {
      if (exit.width < 2) {
        bottlenecks.push({
          location: exit.location,
          severity: 0.7,
          mitigation: `Widen exit ${exit.name} or reduce allocation`
        });
      }
    });

    // Generate phases
    const phases: EvacuationPhase[] = [
      {
        phase: 1,
        description: 'Priority evacuation',
        duration: Math.ceil(estimatedDuration * 0.2),
        exitsToUse: openExits.filter(e => e.isEmergencyExit).map(e => e.id),
        populationToMove: Math.ceil(currentPopulation * 0.3),
        instructions: 'Evacuate mobility-impaired and elderly first through emergency exits'
      },
      {
        phase: 2,
        description: 'Main evacuation',
        duration: Math.ceil(estimatedDuration * 0.5),
        exitsToUse: openExits.map(e => e.id),
        populationToMove: Math.ceil(currentPopulation * 0.5),
        instructions: 'Direct main crowd through all available exits'
      },
      {
        phase: 3,
        description: 'Final sweep',
        duration: Math.ceil(estimatedDuration * 0.3),
        exitsToUse: openExits.map(e => e.id),
        populationToMove: Math.ceil(currentPopulation * 0.2),
        instructions: 'Final verification sweep and stragglers'
      }
    ];

    // Risk assessment
    const overcrowdingRisk = currentPopulation / zone.capacity.maximum;
    const bottleneckRisk = bottlenecks.reduce((sum, b) => sum + b.severity, 0) / Math.max(1, openExits.length);
    const stampedRisk = (zone.currentMetrics?.velocityAvg || 0) / zone.thresholds.stampedRiskVelocity;

    const scenario: EvacuationScenario = {
      id: `evac-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zoneId,
      name: `Evacuation Plan - ${zone.name}`,
      currentPopulation,
      targetCapacity: 0,
      estimatedDuration,
      exitUtilization,
      bottlenecks,
      phases,
      riskAssessment: {
        overcrowdingRisk: Math.min(1, overcrowdingRisk),
        stampedRisk: Math.min(1, stampedRisk),
        bottleneckRisk: Math.min(1, bottleneckRisk)
      },
      recommendations: this.generateEvacuationRecommendations(zone, bottlenecks, { overcrowdingRisk, stampedRisk, bottleneckRisk }),
      createdAt: new Date()
    };

    return scenario;
  }

  private generateEvacuationRecommendations(
    zone: MonitoringZone,
    bottlenecks: EvacuationScenario['bottlenecks'],
    risks: { overcrowdingRisk: number; stampedRisk: number; bottleneckRisk: number }
  ): string[] {
    const recommendations: string[] = [];

    if (risks.overcrowdingRisk > 0.8) {
      recommendations.push('Consider staggered evacuation to prevent exit congestion');
    }

    if (risks.stampedRisk > 0.5) {
      recommendations.push('Deploy crowd control personnel at high-velocity areas');
      recommendations.push('Use PA announcements to maintain calm and orderly movement');
    }

    if (bottlenecks.length > 0) {
      recommendations.push('Address identified bottlenecks before initiating full evacuation');
    }

    const closedExits = zone.exits.filter(e => !e.isOpen);
    if (closedExits.length > 0) {
      recommendations.push(`Open ${closedExits.length} additional exits to increase flow capacity`);
    }

    recommendations.push('Ensure clear signage and wayfinding for all exits');
    recommendations.push('Position first responders at assembly points');

    return recommendations;
  }

  // ==================== Capacity Management ====================

  async recordCapacityEvent(params: {
    zoneId: string;
    eventType: CapacityEvent['eventType'];
    newCapacity?: number;
    reason: string;
    authorizedBy: string;
    duration?: number;
  }): Promise<CapacityEvent> {
    const zone = this.zones.get(params.zoneId);
    if (!zone) throw new Error(`Zone not found: ${params.zoneId}`);

    const event: CapacityEvent = {
      id: `cap-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zoneId: params.zoneId,
      timestamp: new Date(),
      eventType: params.eventType,
      previousCapacity: zone.capacity.safe,
      newCapacity: params.newCapacity,
      reason: params.reason,
      authorizedBy: params.authorizedBy,
      duration: params.duration
    };

    if (params.newCapacity !== undefined) {
      zone.capacity.safe = params.newCapacity;
      zone.updatedAt = new Date();
    }

    const zoneEvents = this.capacityEvents.get(params.zoneId) || [];
    zoneEvents.push(event);
    this.capacityEvents.set(params.zoneId, zoneEvents);

    return event;
  }

  async getCapacityEvents(zoneId: string): Promise<CapacityEvent[]> {
    return this.capacityEvents.get(zoneId) || [];
  }

  // ==================== Statistics ====================

  async getStatistics(params?: { incidentId?: string }): Promise<{
    totalZones: number;
    activeZones: number;
    totalCurrentOccupancy: number;
    totalCapacity: number;
    avgOccupancyRate: number;
    zonesAtCapacity: number;
    activeAlerts: number;
    criticalAlerts: number;
  }> {
    let zones = Array.from(this.zones.values()).filter(z => z.status === 'active');

    if (params?.incidentId) {
      zones = zones.filter(z => z.incidentId === params.incidentId);
    }

    const totalOccupancy = zones.reduce((sum, z) => sum + (z.currentMetrics?.currentCount || 0), 0);
    const totalCapacity = zones.reduce((sum, z) => sum + z.capacity.safe, 0);
    const zonesAtCapacity = zones.filter(z =>
      z.currentMetrics && z.currentMetrics.occupancyRate >= z.thresholds.criticalOccupancy
    ).length;

    const alerts = await this.getAlerts({ status: 'active' });
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length;

    return {
      totalZones: this.zones.size,
      activeZones: zones.length,
      totalCurrentOccupancy: totalOccupancy,
      totalCapacity,
      avgOccupancyRate: totalCapacity > 0 ? totalOccupancy / totalCapacity : 0,
      zonesAtCapacity,
      activeAlerts: alerts.length,
      criticalAlerts
    };
  }
}

export const crowdDensityAnalysisService = CrowdDensityAnalysisService.getInstance();
export default CrowdDensityAnalysisService;

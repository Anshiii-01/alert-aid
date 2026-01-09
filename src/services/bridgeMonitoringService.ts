/**
 * Bridge Monitoring Service - Issue #146 Implementation
 * 
 * Provides comprehensive bridge infrastructure monitoring for disaster response
 * including structural health monitoring, load tracking, inspection management,
 * and emergency closure procedures.
 */

// Type definitions
type BridgeType = 'beam' | 'arch' | 'suspension' | 'cable_stayed' | 'truss' | 'cantilever' | 'movable' | 'pontoon' | 'culvert';
type BridgeMaterial = 'steel' | 'concrete' | 'prestressed_concrete' | 'timber' | 'masonry' | 'composite';
type ConditionRating = 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | 'failed';
type OperationalStatus = 'open' | 'restricted' | 'closed' | 'emergency_closure' | 'under_construction' | 'demolished';
type InspectionType = 'routine' | 'damage' | 'in_depth' | 'special' | 'underwater' | 'fracture_critical';
type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';
type SensorType = 'strain_gauge' | 'accelerometer' | 'displacement' | 'tilt' | 'temperature' | 'crack_monitor' | 'scour' | 'load_cell';

// Bridge interfaces
interface Bridge {
  id: string;
  name: string;
  bridgeNumber: string;
  type: BridgeType;
  material: BridgeMaterial;
  location: BridgeLocation;
  dimensions: BridgeDimensions;
  specifications: BridgeSpecifications;
  condition: BridgeCondition;
  operationalStatus: OperationalStatus;
  restrictions: BridgeRestriction[];
  sensors: string[];
  inspections: string[];
  maintenanceHistory: MaintenanceRecord[];
  emergencyContacts: EmergencyContact[];
  alternateRoutes: string[];
  trafficData: TrafficData;
  createdAt: Date;
  updatedAt: Date;
}

interface BridgeLocation {
  address: string;
  city: string;
  state: string;
  highway: string;
  mileMarker?: number;
  coordinates: {
    start: { lat: number; lon: number };
    end: { lat: number; lon: number };
    center: { lat: number; lon: number };
  };
  waterway?: string;
  railroadCrossing?: string;
  jurisdiction: string;
}

interface BridgeDimensions {
  totalLength: number; // meters
  mainSpanLength: number;
  deckWidth: number;
  clearanceBelow: number;
  clearanceAbove?: number;
  numberOfSpans: number;
  numberOfLanes: number;
  sidewalkWidth?: number;
  approachLength: { north: number; south: number };
}

interface BridgeSpecifications {
  yearBuilt: number;
  yearReconstructed?: number;
  designLoad: string;
  postedLoadLimit?: number; // tons
  maxVehicleWeight?: number;
  maxAxleWeight?: number;
  maxGrossWeight?: number;
  speedLimit: number;
  seismicRating?: string;
  hydraulicOpening?: number; // square meters
  navigationClearance?: number;
}

interface BridgeCondition {
  overallRating: ConditionRating;
  nbiRating: number; // 0-9 NBI condition rating
  sufficiencyRating: number; // 0-100
  healthIndex: number; // 0-100
  componentRatings: ComponentRating[];
  lastAssessment: Date;
  nextAssessment: Date;
  structurallyDeficient: boolean;
  functionallyObsolete: boolean;
  fractureCritical: boolean;
  scourCritical: boolean;
}

interface ComponentRating {
  component: 'deck' | 'superstructure' | 'substructure' | 'channel' | 'culvert' | 'approach' | 'railing' | 'joints' | 'bearings';
  rating: number; // 0-9
  condition: ConditionRating;
  notes: string;
  lastInspected: Date;
}

interface BridgeRestriction {
  id: string;
  type: 'weight' | 'height' | 'width' | 'speed' | 'lane' | 'vehicle_type' | 'time';
  value: number | string;
  unit?: string;
  reason: string;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
}

// Sensor interfaces
interface BridgeSensor {
  id: string;
  bridgeId: string;
  type: SensorType;
  name: string;
  location: {
    component: string;
    position: string;
    coordinates?: { lat: number; lon: number };
  };
  specifications: {
    manufacturer: string;
    model: string;
    range: { min: number; max: number };
    unit: string;
    accuracy: number;
  };
  thresholds: {
    warning: number;
    critical: number;
    emergency: number;
  };
  calibration: {
    lastCalibrated: Date;
    nextCalibration: Date;
    factor: number;
  };
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  lastReading?: SensorReading;
  alerts: string[];
  installedAt: Date;
}

interface SensorReading {
  id: string;
  sensorId: string;
  bridgeId: string;
  timestamp: Date;
  rawValue: number;
  calibratedValue: number;
  unit: string;
  quality: 'good' | 'suspect' | 'bad';
  status: 'normal' | 'warning' | 'critical' | 'emergency';
  metadata?: Record<string, any>;
}

interface SensorAlert {
  id: string;
  sensorId: string;
  bridgeId: string;
  bridgeName: string;
  severity: AlertSeverity;
  type: 'threshold_exceeded' | 'rapid_change' | 'sensor_failure' | 'anomaly';
  title: string;
  description: string;
  currentValue: number;
  threshold: number;
  unit: string;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  actions: string[];
}

// Inspection interfaces
interface BridgeInspection {
  id: string;
  bridgeId: string;
  inspectionType: InspectionType;
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  inspector: InspectorInfo;
  teamMembers?: string[];
  findings: InspectionFinding[];
  componentRatings: ComponentRating[];
  overallAssessment: {
    condition: ConditionRating;
    nbiRating: number;
    recommendations: string[];
    urgentActions: string[];
  };
  photos: InspectionPhoto[];
  documents: string[];
  weatherConditions?: string;
  trafficControl?: string;
  equipmentUsed: string[];
  duration: number; // hours
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InspectorInfo {
  id: string;
  name: string;
  certificationNumber: string;
  organization: string;
  phone: string;
  email: string;
}

interface InspectionFinding {
  id: string;
  component: string;
  location: string;
  defectType: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  dimensions?: { length: number; width: number; depth: number };
  photoIds: string[];
  recommendedAction: string;
  priority: 'immediate' | 'urgent' | 'routine' | 'monitor';
  estimatedCost?: number;
}

interface InspectionPhoto {
  id: string;
  url: string;
  thumbnail?: string;
  caption: string;
  component: string;
  location: string;
  timestamp: Date;
  tags: string[];
}

// Maintenance interfaces
interface MaintenanceRecord {
  id: string;
  type: 'preventive' | 'corrective' | 'emergency' | 'rehabilitation';
  description: string;
  component: string;
  workPerformed: string;
  contractor?: string;
  cost: number;
  startDate: Date;
  endDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  impactToTraffic: string;
  notes: string;
}

// Traffic interfaces
interface TrafficData {
  averageDailyTraffic: number;
  truckPercentage: number;
  peakHourVolume: number;
  currentVolume?: number;
  lastUpdated: Date;
  congestionLevel: 'free_flow' | 'light' | 'moderate' | 'heavy' | 'severe';
}

// Emergency interfaces
interface EmergencyContact {
  role: string;
  name: string;
  organization: string;
  phone: string;
  email: string;
  available24x7: boolean;
}

interface BridgeClosure {
  id: string;
  bridgeId: string;
  incidentId?: string;
  type: 'full' | 'partial' | 'lane' | 'directional';
  reason: string;
  severity: AlertSeverity;
  affectedLanes?: number[];
  affectedDirection?: 'northbound' | 'southbound' | 'eastbound' | 'westbound' | 'both';
  detourRoute: string;
  estimatedDuration?: number; // hours
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'resolved';
  authorizedBy: string;
  notifications: ClosureNotification[];
  trafficImpact: {
    delayMinutes: number;
    affectedVehicles: number;
    economicImpactPerHour: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ClosureNotification {
  id: string;
  recipient: string;
  channel: 'email' | 'sms' | 'app' | 'broadcast';
  sentAt: Date;
  content: string;
  status: 'sent' | 'delivered' | 'failed';
}

// Report interfaces
interface BridgeReport {
  id: string;
  reportType: 'condition' | 'inspection' | 'monitoring' | 'incident';
  bridges: string[];
  period: { start: Date; end: Date };
  generatedAt: Date;
  generatedBy: string;
  summary: BridgeReportSummary;
  details: any[];
  recommendations: string[];
}

interface BridgeReportSummary {
  totalBridges: number;
  byCondition: Record<ConditionRating, number>;
  byStatus: Record<OperationalStatus, number>;
  structurallyDeficient: number;
  functionallyObsolete: number;
  fractureCritical: number;
  inspectionsDue: number;
  activeAlerts: number;
  activeClosure: number;
}

// Sample data
const sampleBridges: Bridge[] = [
  {
    id: 'bridge-001',
    name: 'Metro River Bridge',
    bridgeNumber: 'BR-2024-001',
    type: 'beam',
    material: 'prestressed_concrete',
    location: {
      address: 'Highway 101',
      city: 'Metro City',
      state: 'CA',
      highway: 'US-101',
      mileMarker: 45.2,
      coordinates: {
        start: { lat: 34.0520, lon: -118.2440 },
        end: { lat: 34.0525, lon: -118.2430 },
        center: { lat: 34.0522, lon: -118.2435 }
      },
      waterway: 'Metro River',
      jurisdiction: 'State DOT'
    },
    dimensions: {
      totalLength: 250,
      mainSpanLength: 80,
      deckWidth: 15,
      clearanceBelow: 8,
      numberOfSpans: 4,
      numberOfLanes: 4,
      sidewalkWidth: 1.5,
      approachLength: { north: 50, south: 45 }
    },
    specifications: {
      yearBuilt: 1985,
      yearReconstructed: 2010,
      designLoad: 'HL-93',
      postedLoadLimit: 40,
      speedLimit: 65,
      seismicRating: 'Zone 4'
    },
    condition: {
      overallRating: 'good',
      nbiRating: 7,
      sufficiencyRating: 85,
      healthIndex: 82,
      componentRatings: [],
      lastAssessment: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      nextAssessment: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      structurallyDeficient: false,
      functionallyObsolete: false,
      fractureCritical: false,
      scourCritical: false
    },
    operationalStatus: 'open',
    restrictions: [],
    sensors: ['sensor-001', 'sensor-002'],
    inspections: [],
    maintenanceHistory: [],
    emergencyContacts: [
      { role: 'Bridge Engineer', name: 'John Smith', organization: 'State DOT', phone: '555-0101', email: 'jsmith@dot.gov', available24x7: true }
    ],
    alternateRoutes: ['Highway 405 via Exit 42', 'Surface streets via Main St'],
    trafficData: {
      averageDailyTraffic: 45000,
      truckPercentage: 12,
      peakHourVolume: 4500,
      lastUpdated: new Date(),
      congestionLevel: 'light'
    },
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class BridgeMonitoringService {
  private static instance: BridgeMonitoringService;
  private bridges: Map<string, Bridge> = new Map();
  private sensors: Map<string, BridgeSensor> = new Map();
  private readings: Map<string, SensorReading[]> = new Map();
  private alerts: Map<string, SensorAlert> = new Map();
  private inspections: Map<string, BridgeInspection> = new Map();
  private closures: Map<string, BridgeClosure> = new Map();
  private reports: Map<string, BridgeReport> = new Map();

  private readonly CONDITION_THRESHOLDS = {
    excellent: 8,
    good: 6,
    fair: 5,
    poor: 4,
    critical: 2
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): BridgeMonitoringService {
    if (!BridgeMonitoringService.instance) {
      BridgeMonitoringService.instance = new BridgeMonitoringService();
    }
    return BridgeMonitoringService.instance;
  }

  private initializeSampleData(): void {
    sampleBridges.forEach(b => this.bridges.set(b.id, b));
  }

  private getConditionFromNBI(nbiRating: number): ConditionRating {
    if (nbiRating >= this.CONDITION_THRESHOLDS.excellent) return 'excellent';
    if (nbiRating >= this.CONDITION_THRESHOLDS.good) return 'good';
    if (nbiRating >= this.CONDITION_THRESHOLDS.fair) return 'fair';
    if (nbiRating >= this.CONDITION_THRESHOLDS.poor) return 'poor';
    if (nbiRating >= this.CONDITION_THRESHOLDS.critical) return 'critical';
    return 'failed';
  }

  // ==================== Bridge Management ====================

  async createBridge(params: Omit<Bridge, 'id' | 'sensors' | 'inspections' | 'createdAt' | 'updatedAt'>): Promise<Bridge> {
    const bridge: Bridge = {
      ...params,
      id: `bridge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sensors: [],
      inspections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.bridges.set(bridge.id, bridge);
    return bridge;
  }

  async getBridge(bridgeId: string): Promise<Bridge | null> {
    return this.bridges.get(bridgeId) || null;
  }

  async getBridges(params?: {
    condition?: ConditionRating[];
    status?: OperationalStatus;
    jurisdiction?: string;
    structurallyDeficient?: boolean;
    fractureCritical?: boolean;
  }): Promise<Bridge[]> {
    let bridges = Array.from(this.bridges.values());

    if (params?.condition && params.condition.length > 0) {
      bridges = bridges.filter(b => params.condition!.includes(b.condition.overallRating));
    }

    if (params?.status) {
      bridges = bridges.filter(b => b.operationalStatus === params.status);
    }

    if (params?.jurisdiction) {
      bridges = bridges.filter(b => b.location.jurisdiction === params.jurisdiction);
    }

    if (params?.structurallyDeficient !== undefined) {
      bridges = bridges.filter(b => b.condition.structurallyDeficient === params.structurallyDeficient);
    }

    if (params?.fractureCritical !== undefined) {
      bridges = bridges.filter(b => b.condition.fractureCritical === params.fractureCritical);
    }

    return bridges;
  }

  async updateBridgeCondition(bridgeId: string, condition: Partial<BridgeCondition>): Promise<Bridge> {
    const bridge = this.bridges.get(bridgeId);
    if (!bridge) throw new Error(`Bridge not found: ${bridgeId}`);

    Object.assign(bridge.condition, condition);

    // Update overall rating based on NBI rating
    if (condition.nbiRating !== undefined) {
      bridge.condition.overallRating = this.getConditionFromNBI(condition.nbiRating);
    }

    // Check for automatic restrictions based on condition
    if (bridge.condition.overallRating === 'poor' || bridge.condition.overallRating === 'critical') {
      bridge.condition.structurallyDeficient = true;
    }

    bridge.updatedAt = new Date();
    return bridge;
  }

  async updateBridgeStatus(bridgeId: string, status: OperationalStatus, reason?: string): Promise<Bridge> {
    const bridge = this.bridges.get(bridgeId);
    if (!bridge) throw new Error(`Bridge not found: ${bridgeId}`);

    bridge.operationalStatus = status;
    bridge.updatedAt = new Date();

    // Add restriction if closed
    if (status === 'closed' || status === 'emergency_closure') {
      bridge.restrictions.push({
        id: `restrict-${Date.now()}`,
        type: 'lane',
        value: 'all',
        reason: reason || 'Bridge closed',
        effectiveDate: new Date(),
        isActive: true
      });
    }

    return bridge;
  }

  async addRestriction(bridgeId: string, restriction: Omit<BridgeRestriction, 'id'>): Promise<BridgeRestriction> {
    const bridge = this.bridges.get(bridgeId);
    if (!bridge) throw new Error(`Bridge not found: ${bridgeId}`);

    const newRestriction: BridgeRestriction = {
      ...restriction,
      id: `restrict-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    };

    bridge.restrictions.push(newRestriction);
    bridge.updatedAt = new Date();

    // Update status if significant restriction
    if (restriction.type === 'weight' || restriction.type === 'lane') {
      if (bridge.operationalStatus === 'open') {
        bridge.operationalStatus = 'restricted';
      }
    }

    return newRestriction;
  }

  async removeRestriction(bridgeId: string, restrictionId: string): Promise<Bridge> {
    const bridge = this.bridges.get(bridgeId);
    if (!bridge) throw new Error(`Bridge not found: ${bridgeId}`);

    const restriction = bridge.restrictions.find(r => r.id === restrictionId);
    if (restriction) {
      restriction.isActive = false;
      restriction.expirationDate = new Date();
    }

    // Check if bridge can be reopened
    const activeRestrictions = bridge.restrictions.filter(r => r.isActive);
    if (activeRestrictions.length === 0 && bridge.operationalStatus === 'restricted') {
      bridge.operationalStatus = 'open';
    }

    bridge.updatedAt = new Date();
    return bridge;
  }

  // ==================== Sensor Management ====================

  async installSensor(params: Omit<BridgeSensor, 'id' | 'alerts' | 'installedAt'>): Promise<BridgeSensor> {
    const bridge = this.bridges.get(params.bridgeId);
    if (!bridge) throw new Error(`Bridge not found: ${params.bridgeId}`);

    const sensor: BridgeSensor = {
      ...params,
      id: `sensor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      alerts: [],
      installedAt: new Date()
    };

    this.sensors.set(sensor.id, sensor);
    bridge.sensors.push(sensor.id);
    bridge.updatedAt = new Date();

    return sensor;
  }

  async getSensor(sensorId: string): Promise<BridgeSensor | null> {
    return this.sensors.get(sensorId) || null;
  }

  async getSensorsForBridge(bridgeId: string): Promise<BridgeSensor[]> {
    return Array.from(this.sensors.values()).filter(s => s.bridgeId === bridgeId);
  }

  async recordSensorReading(params: {
    sensorId: string;
    rawValue: number;
    quality?: SensorReading['quality'];
    metadata?: Record<string, any>;
  }): Promise<SensorReading> {
    const sensor = this.sensors.get(params.sensorId);
    if (!sensor) throw new Error(`Sensor not found: ${params.sensorId}`);

    const calibratedValue = params.rawValue * sensor.calibration.factor;
    
    // Determine status based on thresholds
    let status: SensorReading['status'] = 'normal';
    if (Math.abs(calibratedValue) >= sensor.thresholds.emergency) {
      status = 'emergency';
    } else if (Math.abs(calibratedValue) >= sensor.thresholds.critical) {
      status = 'critical';
    } else if (Math.abs(calibratedValue) >= sensor.thresholds.warning) {
      status = 'warning';
    }

    const reading: SensorReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sensorId: params.sensorId,
      bridgeId: sensor.bridgeId,
      timestamp: new Date(),
      rawValue: params.rawValue,
      calibratedValue,
      unit: sensor.specifications.unit,
      quality: params.quality || 'good',
      status,
      metadata: params.metadata
    };

    // Store reading
    const readings = this.readings.get(sensor.bridgeId) || [];
    readings.push(reading);
    if (readings.length > 10000) readings.shift();
    this.readings.set(sensor.bridgeId, readings);

    // Update sensor
    sensor.lastReading = reading;

    // Create alert if threshold exceeded
    if (status !== 'normal') {
      await this.createSensorAlert(sensor, reading);
    }

    return reading;
  }

  private async createSensorAlert(sensor: BridgeSensor, reading: SensorReading): Promise<SensorAlert> {
    const bridge = this.bridges.get(sensor.bridgeId);
    const severity: AlertSeverity = reading.status === 'emergency' ? 'emergency' :
                                    reading.status === 'critical' ? 'critical' : 'warning';

    const alert: SensorAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sensorId: sensor.id,
      bridgeId: sensor.bridgeId,
      bridgeName: bridge?.name || 'Unknown Bridge',
      severity,
      type: 'threshold_exceeded',
      title: `${sensor.type} threshold exceeded on ${bridge?.name || 'bridge'}`,
      description: `Sensor ${sensor.name} recorded ${reading.calibratedValue.toFixed(2)} ${reading.unit}, exceeding ${reading.status} threshold`,
      currentValue: reading.calibratedValue,
      threshold: reading.status === 'emergency' ? sensor.thresholds.emergency :
                 reading.status === 'critical' ? sensor.thresholds.critical :
                 sensor.thresholds.warning,
      unit: reading.unit,
      triggeredAt: new Date(),
      actions: this.getRecommendedActions(sensor.type, severity)
    };

    this.alerts.set(alert.id, alert);
    sensor.alerts.push(alert.id);

    return alert;
  }

  private getRecommendedActions(sensorType: SensorType, severity: AlertSeverity): string[] {
    const actions: string[] = [];

    if (severity === 'emergency') {
      actions.push('Initiate emergency closure procedures');
      actions.push('Dispatch inspection team immediately');
      actions.push('Notify emergency contacts');
    }

    switch (sensorType) {
      case 'strain_gauge':
        actions.push('Review load history');
        actions.push('Check for visible cracking');
        break;
      case 'accelerometer':
        actions.push('Review seismic/vibration data');
        actions.push('Check structural connections');
        break;
      case 'scour':
        actions.push('Assess underwater conditions');
        actions.push('Review recent flood data');
        break;
      case 'tilt':
        actions.push('Check foundation settlement');
        actions.push('Survey deck alignment');
        break;
    }

    return actions;
  }

  async getAlerts(params?: {
    bridgeId?: string;
    severity?: AlertSeverity;
    unresolved?: boolean;
  }): Promise<SensorAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.bridgeId) {
      alerts = alerts.filter(a => a.bridgeId === params.bridgeId);
    }

    if (params?.severity) {
      alerts = alerts.filter(a => a.severity === params.severity);
    }

    if (params?.unresolved) {
      alerts = alerts.filter(a => !a.resolvedAt);
    }

    return alerts.sort((a, b) => {
      const severityOrder = { emergency: 0, critical: 1, warning: 2, info: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<SensorAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;
    return alert;
  }

  async resolveAlert(alertId: string): Promise<SensorAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.resolvedAt = new Date();
    return alert;
  }

  // ==================== Inspection Management ====================

  async scheduleInspection(params: {
    bridgeId: string;
    inspectionType: InspectionType;
    scheduledDate: Date;
    inspector: InspectorInfo;
    teamMembers?: string[];
    equipmentRequired?: string[];
    notes?: string;
  }): Promise<BridgeInspection> {
    const bridge = this.bridges.get(params.bridgeId);
    if (!bridge) throw new Error(`Bridge not found: ${params.bridgeId}`);

    const inspection: BridgeInspection = {
      id: `insp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bridgeId: params.bridgeId,
      inspectionType: params.inspectionType,
      scheduledDate: params.scheduledDate,
      status: 'scheduled',
      inspector: params.inspector,
      teamMembers: params.teamMembers,
      findings: [],
      componentRatings: [],
      overallAssessment: {
        condition: bridge.condition.overallRating,
        nbiRating: bridge.condition.nbiRating,
        recommendations: [],
        urgentActions: []
      },
      photos: [],
      documents: [],
      equipmentUsed: params.equipmentRequired || [],
      duration: 0,
      notes: params.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.inspections.set(inspection.id, inspection);
    bridge.inspections.push(inspection.id);

    return inspection;
  }

  async startInspection(inspectionId: string): Promise<BridgeInspection> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error(`Inspection not found: ${inspectionId}`);

    inspection.status = 'in_progress';
    inspection.actualDate = new Date();
    inspection.updatedAt = new Date();

    return inspection;
  }

  async addInspectionFinding(inspectionId: string, finding: Omit<InspectionFinding, 'id'>): Promise<InspectionFinding> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error(`Inspection not found: ${inspectionId}`);

    const newFinding: InspectionFinding = {
      ...finding,
      id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    };

    inspection.findings.push(newFinding);
    inspection.updatedAt = new Date();

    // Add to urgent actions if critical
    if (finding.severity === 'critical' || finding.priority === 'immediate') {
      inspection.overallAssessment.urgentActions.push(finding.recommendedAction);
    }

    return newFinding;
  }

  async completeInspection(inspectionId: string, completion: {
    componentRatings: ComponentRating[];
    overallCondition: ConditionRating;
    nbiRating: number;
    recommendations: string[];
    duration: number;
  }): Promise<BridgeInspection> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error(`Inspection not found: ${inspectionId}`);

    inspection.status = 'completed';
    inspection.componentRatings = completion.componentRatings;
    inspection.overallAssessment.condition = completion.overallCondition;
    inspection.overallAssessment.nbiRating = completion.nbiRating;
    inspection.overallAssessment.recommendations = completion.recommendations;
    inspection.duration = completion.duration;
    inspection.updatedAt = new Date();

    // Update bridge condition
    const bridge = this.bridges.get(inspection.bridgeId);
    if (bridge) {
      await this.updateBridgeCondition(bridge.id, {
        overallRating: completion.overallCondition,
        nbiRating: completion.nbiRating,
        componentRatings: completion.componentRatings,
        lastAssessment: new Date()
      });
    }

    return inspection;
  }

  async getInspections(params?: {
    bridgeId?: string;
    status?: BridgeInspection['status'];
    type?: InspectionType;
    overdue?: boolean;
  }): Promise<BridgeInspection[]> {
    let inspections = Array.from(this.inspections.values());

    if (params?.bridgeId) {
      inspections = inspections.filter(i => i.bridgeId === params.bridgeId);
    }

    if (params?.status) {
      inspections = inspections.filter(i => i.status === params.status);
    }

    if (params?.type) {
      inspections = inspections.filter(i => i.inspectionType === params.type);
    }

    if (params?.overdue) {
      const now = new Date();
      inspections = inspections.filter(i =>
        i.status === 'scheduled' && i.scheduledDate < now
      );
    }

    return inspections.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  // ==================== Emergency Closures ====================

  async initiateClosure(params: {
    bridgeId: string;
    incidentId?: string;
    type: BridgeClosure['type'];
    reason: string;
    severity: AlertSeverity;
    affectedLanes?: number[];
    affectedDirection?: BridgeClosure['affectedDirection'];
    estimatedDuration?: number;
    authorizedBy: string;
  }): Promise<BridgeClosure> {
    const bridge = this.bridges.get(params.bridgeId);
    if (!bridge) throw new Error(`Bridge not found: ${params.bridgeId}`);

    const closure: BridgeClosure = {
      id: `closure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bridgeId: params.bridgeId,
      incidentId: params.incidentId,
      type: params.type,
      reason: params.reason,
      severity: params.severity,
      affectedLanes: params.affectedLanes,
      affectedDirection: params.affectedDirection,
      detourRoute: bridge.alternateRoutes[0] || 'Detour route to be determined',
      estimatedDuration: params.estimatedDuration,
      startTime: new Date(),
      status: 'active',
      authorizedBy: params.authorizedBy,
      notifications: [],
      trafficImpact: {
        delayMinutes: params.type === 'full' ? 30 : 10,
        affectedVehicles: bridge.trafficData.averageDailyTraffic / 24,
        economicImpactPerHour: (bridge.trafficData.averageDailyTraffic / 24) * 15 // $15 per vehicle-hour
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.closures.set(closure.id, closure);

    // Update bridge status
    const newStatus: OperationalStatus = params.type === 'full' ? 'emergency_closure' : 'restricted';
    await this.updateBridgeStatus(params.bridgeId, newStatus, params.reason);

    return closure;
  }

  async resolveClosure(closureId: string): Promise<BridgeClosure> {
    const closure = this.closures.get(closureId);
    if (!closure) throw new Error(`Closure not found: ${closureId}`);

    closure.status = 'resolved';
    closure.endTime = new Date();
    closure.updatedAt = new Date();

    // Check if bridge can be reopened
    const activeClosures = Array.from(this.closures.values())
      .filter(c => c.bridgeId === closure.bridgeId && c.status === 'active');

    if (activeClosures.length === 0) {
      await this.updateBridgeStatus(closure.bridgeId, 'open');
    }

    return closure;
  }

  async getActiveClosures(incidentId?: string): Promise<BridgeClosure[]> {
    let closures = Array.from(this.closures.values())
      .filter(c => c.status === 'active');

    if (incidentId) {
      closures = closures.filter(c => c.incidentId === incidentId);
    }

    return closures;
  }

  // ==================== Reporting ====================

  async generateReport(params: {
    reportType: BridgeReport['reportType'];
    bridges?: string[];
    period: { start: Date; end: Date };
    generatedBy: string;
  }): Promise<BridgeReport> {
    const bridgeList = params.bridges ?
      params.bridges.map(id => this.bridges.get(id)).filter((b): b is Bridge => b !== undefined) :
      Array.from(this.bridges.values());

    const byCondition: Record<ConditionRating, number> = {
      excellent: 0, good: 0, fair: 0, poor: 0, critical: 0, failed: 0
    };
    const byStatus: Record<OperationalStatus, number> = {
      open: 0, restricted: 0, closed: 0, emergency_closure: 0, under_construction: 0, demolished: 0
    };

    bridgeList.forEach(b => {
      byCondition[b.condition.overallRating]++;
      byStatus[b.operationalStatus]++;
    });

    const alerts = await this.getAlerts({ unresolved: true });
    const closures = await this.getActiveClosures();

    const report: BridgeReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reportType: params.reportType,
      bridges: bridgeList.map(b => b.id),
      period: params.period,
      generatedAt: new Date(),
      generatedBy: params.generatedBy,
      summary: {
        totalBridges: bridgeList.length,
        byCondition,
        byStatus,
        structurallyDeficient: bridgeList.filter(b => b.condition.structurallyDeficient).length,
        functionallyObsolete: bridgeList.filter(b => b.condition.functionallyObsolete).length,
        fractureCritical: bridgeList.filter(b => b.condition.fractureCritical).length,
        inspectionsDue: bridgeList.filter(b => b.condition.nextAssessment < new Date()).length,
        activeAlerts: alerts.length,
        activeClosure: closures.length
      },
      details: bridgeList,
      recommendations: this.generateRecommendations(bridgeList)
    };

    this.reports.set(report.id, report);
    return report;
  }

  private generateRecommendations(bridges: Bridge[]): string[] {
    const recommendations: string[] = [];

    const criticalBridges = bridges.filter(b => b.condition.overallRating === 'critical' || b.condition.overallRating === 'poor');
    if (criticalBridges.length > 0) {
      recommendations.push(`${criticalBridges.length} bridges in poor/critical condition require immediate attention`);
    }

    const overdueInspections = bridges.filter(b => b.condition.nextAssessment < new Date());
    if (overdueInspections.length > 0) {
      recommendations.push(`${overdueInspections.length} bridges have overdue inspections`);
    }

    const fractureCritical = bridges.filter(b => b.condition.fractureCritical);
    if (fractureCritical.length > 0) {
      recommendations.push(`Review inspection frequency for ${fractureCritical.length} fracture-critical bridges`);
    }

    return recommendations;
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalBridges: number;
    byCondition: Record<ConditionRating, number>;
    byStatus: Record<OperationalStatus, number>;
    structurallyDeficient: number;
    activeSensors: number;
    activeAlerts: number;
    activeClosures: number;
    averageHealthIndex: number;
  }> {
    const bridges = Array.from(this.bridges.values());
    const sensors = Array.from(this.sensors.values());
    const alerts = await this.getAlerts({ unresolved: true });
    const closures = incidentId ?
      await this.getActiveClosures(incidentId) :
      await this.getActiveClosures();

    const byCondition: Record<ConditionRating, number> = {
      excellent: 0, good: 0, fair: 0, poor: 0, critical: 0, failed: 0
    };
    const byStatus: Record<OperationalStatus, number> = {
      open: 0, restricted: 0, closed: 0, emergency_closure: 0, under_construction: 0, demolished: 0
    };

    let totalHealth = 0;
    bridges.forEach(b => {
      byCondition[b.condition.overallRating]++;
      byStatus[b.operationalStatus]++;
      totalHealth += b.condition.healthIndex;
    });

    return {
      totalBridges: bridges.length,
      byCondition,
      byStatus,
      structurallyDeficient: bridges.filter(b => b.condition.structurallyDeficient).length,
      activeSensors: sensors.filter(s => s.status === 'online').length,
      activeAlerts: alerts.length,
      activeClosures: closures.length,
      averageHealthIndex: bridges.length > 0 ? totalHealth / bridges.length : 0
    };
  }
}

export const bridgeMonitoringService = BridgeMonitoringService.getInstance();
export default BridgeMonitoringService;

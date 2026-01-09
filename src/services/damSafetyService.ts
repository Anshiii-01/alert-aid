/**
 * Dam Safety Service - Issue #147 Implementation
 * 
 * Provides comprehensive dam safety monitoring and management for disaster response
 * including structural monitoring, reservoir levels, spillway operations,
 * emergency action plans, and downstream evacuation coordination.
 */

// Type definitions
type DamType = 'gravity' | 'arch' | 'buttress' | 'embankment' | 'earth' | 'rockfill' | 'roller_compacted' | 'timber_crib';
type DamHazardClass = 'high' | 'significant' | 'low';
type ConditionAssessment = 'satisfactory' | 'fair' | 'poor' | 'unsatisfactory' | 'not_rated';
type OperationalStatus = 'normal' | 'elevated' | 'watch' | 'warning' | 'emergency' | 'failure_imminent';
type SpillwayType = 'service' | 'auxiliary' | 'emergency' | 'fuse_plug';
type AlertLevel = 'normal' | 'advisory' | 'watch' | 'warning' | 'emergency';
type SensorType = 'water_level' | 'seepage' | 'pore_pressure' | 'displacement' | 'settlement' | 'seismic' | 'temperature' | 'tilt';

// Dam interfaces
interface Dam {
  id: string;
  name: string;
  nationalId: string;
  type: DamType;
  hazardClass: DamHazardClass;
  location: DamLocation;
  physical: DamPhysical;
  reservoir: ReservoirInfo;
  spillways: Spillway[];
  outlets: Outlet[];
  operationalStatus: OperationalStatus;
  conditionAssessment: ConditionAssessment;
  sensors: string[];
  emergencyActionPlan: EmergencyActionPlan;
  owner: OwnerInfo;
  regulatoryInfo: RegulatoryInfo;
  inspectionHistory: string[];
  incidentHistory: DamIncident[];
  createdAt: Date;
  updatedAt: Date;
}

interface DamLocation {
  address: string;
  city: string;
  state: string;
  county: string;
  coordinates: { lat: number; lon: number };
  river: string;
  riverMile?: number;
  watershed: string;
  nearestTown: string;
  distanceToTown: number; // km
  accessRoute: string;
}

interface DamPhysical {
  heightAboveFoundation: number; // meters
  heightAboveStreambed: number;
  crestLength: number; // meters
  crestWidth: number;
  crestElevation: number; // meters above sea level
  structuralVolume: number; // cubic meters
  foundationType: string;
  yearCompleted: number;
  yearModified?: number;
  designLife: number; // years
  ageYears: number;
}

interface ReservoirInfo {
  name: string;
  normalStorageCapacity: number; // acre-feet
  maxStorageCapacity: number;
  currentStorage: number;
  surfaceArea: number; // acres at normal pool
  maxDepth: number; // meters
  normalPoolElevation: number;
  maxPoolElevation: number;
  spillwayCretsElevation: number;
  currentElevation: number;
  inflowRate: number; // cubic meters per second
  outflowRate: number;
  purposes: string[];
  waterQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface Spillway {
  id: string;
  type: SpillwayType;
  crestElevation: number;
  width: number;
  capacity: number; // cubic meters per second
  gated: boolean;
  numberOfGates?: number;
  gateType?: string;
  gateStatus?: 'open' | 'closed' | 'partial';
  gateOpeningPercent?: number;
  currentFlow: number;
  condition: ConditionAssessment;
}

interface Outlet {
  id: string;
  type: 'low_level' | 'mid_level' | 'penstock' | 'sluice';
  diameter: number;
  capacity: number;
  elevation: number;
  operationalStatus: 'operational' | 'blocked' | 'maintenance';
  lastOperated: Date;
}

interface EmergencyActionPlan {
  id: string;
  version: string;
  lastUpdated: Date;
  nextReview: Date;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  inundationMaps: InundationZone[];
  notificationList: EmergencyContact[];
  evacuationRoutes: EvacuationRoute[];
  actionLevels: ActionLevel[];
  exercises: PlanExercise[];
}

interface InundationZone {
  id: string;
  name: string;
  scenario: 'sunny_day' | 'flood' | 'seismic' | 'cascade';
  floodArrivalTime: number; // minutes
  maxDepth: number;
  maxVelocity: number;
  affectedPopulation: number;
  criticalFacilities: string[];
  polygon: { lat: number; lon: number }[];
}

interface EmergencyContact {
  role: string;
  name: string;
  organization: string;
  phone: string;
  altPhone?: string;
  email: string;
  notificationOrder: number;
  available24x7: boolean;
}

interface EvacuationRoute {
  id: string;
  zone: string;
  primaryRoute: string;
  alternateRoute?: string;
  assemblyPoint: string;
  capacity: number; // people per hour
  estimatedClearTime: number; // minutes
  specialConsiderations: string[];
}

interface ActionLevel {
  level: AlertLevel;
  triggers: string[];
  actions: string[];
  notifications: string[];
  reservoirThreshold?: number;
  seepageThreshold?: number;
}

interface PlanExercise {
  id: string;
  type: 'tabletop' | 'functional' | 'full_scale';
  date: Date;
  participants: string[];
  scenarioDescription: string;
  lessonsLearned: string[];
  correctiveActions: string[];
  nextExercise: Date;
}

// Sensor interfaces
interface DamSensor {
  id: string;
  damId: string;
  type: SensorType;
  name: string;
  location: {
    structure: string;
    position: string;
    elevation: number;
    coordinates?: { lat: number; lon: number };
  };
  specifications: {
    manufacturer: string;
    model: string;
    range: { min: number; max: number };
    unit: string;
    accuracy: number;
    resolution: number;
  };
  thresholds: {
    normal: { min: number; max: number };
    advisory: { min: number; max: number };
    warning: { min: number; max: number };
    emergency: { min: number; max: number };
  };
  calibration: {
    lastCalibrated: Date;
    nextCalibration: Date;
    factor: number;
  };
  status: 'online' | 'offline' | 'degraded' | 'maintenance' | 'alarm';
  lastReading?: SensorReading;
  installedAt: Date;
}

interface SensorReading {
  id: string;
  sensorId: string;
  damId: string;
  timestamp: Date;
  value: number;
  unit: string;
  quality: 'good' | 'suspect' | 'bad' | 'missing';
  alertLevel: AlertLevel;
  trend: 'rising' | 'stable' | 'falling' | 'unknown';
  rateOfChange?: number;
}

interface SensorAlert {
  id: string;
  sensorId: string;
  damId: string;
  damName: string;
  alertLevel: AlertLevel;
  type: 'threshold' | 'rate_of_change' | 'sensor_failure' | 'anomaly' | 'trend';
  title: string;
  description: string;
  currentValue: number;
  thresholdValue: number;
  unit: string;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  escalatedAt?: Date;
  escalatedTo?: string;
  actions: string[];
}

// Inspection interfaces
interface DamInspection {
  id: string;
  damId: string;
  inspectionType: 'routine' | 'annual' | 'comprehensive' | 'special' | 'emergency';
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  inspector: InspectorInfo;
  weatherConditions?: string;
  reservoirLevel: number;
  findings: InspectionFinding[];
  componentRatings: ComponentRating[];
  overallAssessment: ConditionAssessment;
  recommendations: string[];
  priorityRepairs: PriorityRepair[];
  photos: string[];
  documents: string[];
  duration: number; // hours
  createdAt: Date;
  updatedAt: Date;
}

interface InspectorInfo {
  id: string;
  name: string;
  certificationNumber: string;
  certificationExpiry: Date;
  organization: string;
  phone: string;
  email: string;
}

interface InspectionFinding {
  id: string;
  component: string;
  location: string;
  deficiencyType: string;
  severity: 'minor' | 'moderate' | 'significant' | 'critical';
  description: string;
  previouslyIdentified: boolean;
  changeFromLast?: string;
  photoIds: string[];
  recommendedAction: string;
  priority: 'immediate' | 'urgent' | 'routine' | 'monitor';
}

interface ComponentRating {
  component: string;
  condition: ConditionAssessment;
  rating: number; // 1-5
  notes: string;
  maintenanceNeeded: boolean;
}

interface PriorityRepair {
  id: string;
  description: string;
  component: string;
  priority: 'emergency' | 'high' | 'medium' | 'low';
  estimatedCost: number;
  targetDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
}

// Incident interfaces
interface DamIncident {
  id: string;
  damId: string;
  type: 'seepage' | 'cracking' | 'displacement' | 'overtopping' | 'gate_failure' | 'instrumentation' | 'debris' | 'vandalism';
  severity: AlertLevel;
  description: string;
  reportedAt: Date;
  reportedBy: string;
  location: string;
  status: 'reported' | 'investigating' | 'mitigating' | 'resolved' | 'monitoring';
  actions: IncidentAction[];
  resolvedAt?: Date;
  rootCause?: string;
  preventiveMeasures?: string[];
}

interface IncidentAction {
  id: string;
  description: string;
  assignedTo: string;
  startedAt?: Date;
  completedAt?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  notes: string;
}

// Owner/Regulatory interfaces
interface OwnerInfo {
  name: string;
  type: 'federal' | 'state' | 'local' | 'private' | 'utility';
  contactName: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: EmergencyContact;
}

interface RegulatoryInfo {
  regulatoryAgency: string;
  permitNumber?: string;
  lastInspectionDate: Date;
  nextInspectionDue: Date;
  complianceStatus: 'compliant' | 'minor_issues' | 'major_issues' | 'non_compliant';
  outstandingViolations: string[];
  remedialActions: string[];
}

// Sample data
const sampleDams: Dam[] = [
  {
    id: 'dam-001',
    name: 'Riverside Dam',
    nationalId: 'NID-CA-00123',
    type: 'embankment',
    hazardClass: 'high',
    location: {
      address: 'Dam Road',
      city: 'Riverside',
      state: 'CA',
      county: 'Riverside County',
      coordinates: { lat: 33.9806, lon: -117.3755 },
      river: 'Santa Ana River',
      riverMile: 45,
      watershed: 'Santa Ana Watershed',
      nearestTown: 'Riverside',
      distanceToTown: 5,
      accessRoute: 'Highway 91 to Dam Road exit'
    },
    physical: {
      heightAboveFoundation: 60,
      heightAboveStreambed: 55,
      crestLength: 450,
      crestWidth: 8,
      crestElevation: 320,
      structuralVolume: 500000,
      foundationType: 'Rock',
      yearCompleted: 1965,
      yearModified: 2010,
      designLife: 100,
      ageYears: 59
    },
    reservoir: {
      name: 'Riverside Reservoir',
      normalStorageCapacity: 25000,
      maxStorageCapacity: 35000,
      currentStorage: 20000,
      surfaceArea: 800,
      maxDepth: 45,
      normalPoolElevation: 310,
      maxPoolElevation: 318,
      spillwayCretsElevation: 315,
      currentElevation: 308,
      inflowRate: 15,
      outflowRate: 12,
      purposes: ['water_supply', 'flood_control', 'recreation'],
      waterQuality: 'good'
    },
    spillways: [
      {
        id: 'spillway-001',
        type: 'service',
        crestElevation: 315,
        width: 30,
        capacity: 1500,
        gated: true,
        numberOfGates: 3,
        gateType: 'radial',
        gateStatus: 'closed',
        gateOpeningPercent: 0,
        currentFlow: 0,
        condition: 'satisfactory'
      }
    ],
    outlets: [
      {
        id: 'outlet-001',
        type: 'low_level',
        diameter: 2.5,
        capacity: 50,
        elevation: 275,
        operationalStatus: 'operational',
        lastOperated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ],
    operationalStatus: 'normal',
    conditionAssessment: 'satisfactory',
    sensors: ['sensor-001', 'sensor-002'],
    emergencyActionPlan: {
      id: 'eap-001',
      version: '3.2',
      lastUpdated: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      nextReview: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      approved: true,
      approvedBy: 'State Dam Safety Office',
      approvalDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      inundationMaps: [],
      notificationList: [],
      evacuationRoutes: [],
      actionLevels: [],
      exercises: []
    },
    owner: {
      name: 'Riverside Water Authority',
      type: 'local',
      contactName: 'John Davis',
      phone: '555-0101',
      email: 'jdavis@riversidewater.gov',
      address: '123 Water St, Riverside, CA',
      emergencyContact: { role: 'Dam Safety Officer', name: 'Sarah Miller', organization: 'Riverside Water Authority', phone: '555-0102', email: 'smiller@riversidewater.gov', notificationOrder: 1, available24x7: true }
    },
    regulatoryInfo: {
      regulatoryAgency: 'California DSOD',
      permitNumber: 'DSOD-2024-123',
      lastInspectionDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      nextInspectionDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      complianceStatus: 'compliant',
      outstandingViolations: [],
      remedialActions: []
    },
    inspectionHistory: [],
    incidentHistory: [],
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class DamSafetyService {
  private static instance: DamSafetyService;
  private dams: Map<string, Dam> = new Map();
  private sensors: Map<string, DamSensor> = new Map();
  private readings: Map<string, SensorReading[]> = new Map();
  private alerts: Map<string, SensorAlert> = new Map();
  private inspections: Map<string, DamInspection> = new Map();

  private readonly RESERVOIR_WARNING_PERCENT = 90;
  private readonly RESERVOIR_EMERGENCY_PERCENT = 95;

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): DamSafetyService {
    if (!DamSafetyService.instance) {
      DamSafetyService.instance = new DamSafetyService();
    }
    return DamSafetyService.instance;
  }

  private initializeSampleData(): void {
    sampleDams.forEach(d => this.dams.set(d.id, d));
  }

  // ==================== Dam Management ====================

  async createDam(params: Omit<Dam, 'id' | 'sensors' | 'inspectionHistory' | 'incidentHistory' | 'createdAt' | 'updatedAt'>): Promise<Dam> {
    const dam: Dam = {
      ...params,
      id: `dam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sensors: [],
      inspectionHistory: [],
      incidentHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dams.set(dam.id, dam);
    return dam;
  }

  async getDam(damId: string): Promise<Dam | null> {
    return this.dams.get(damId) || null;
  }

  async getDams(params?: {
    hazardClass?: DamHazardClass;
    operationalStatus?: OperationalStatus;
    conditionAssessment?: ConditionAssessment;
    state?: string;
    river?: string;
  }): Promise<Dam[]> {
    let dams = Array.from(this.dams.values());

    if (params?.hazardClass) {
      dams = dams.filter(d => d.hazardClass === params.hazardClass);
    }

    if (params?.operationalStatus) {
      dams = dams.filter(d => d.operationalStatus === params.operationalStatus);
    }

    if (params?.conditionAssessment) {
      dams = dams.filter(d => d.conditionAssessment === params.conditionAssessment);
    }

    if (params?.state) {
      dams = dams.filter(d => d.location.state === params.state);
    }

    if (params?.river) {
      dams = dams.filter(d => d.location.river === params.river);
    }

    return dams;
  }

  async updateDamStatus(damId: string, status: OperationalStatus, reason?: string): Promise<Dam> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);

    const previousStatus = dam.operationalStatus;
    dam.operationalStatus = status;
    dam.updatedAt = new Date();

    // Log status change as incident if elevated
    if (status !== 'normal' && previousStatus === 'normal') {
      await this.reportIncident({
        damId,
        type: 'instrumentation',
        severity: this.getAlertLevelForStatus(status),
        description: reason || `Dam status changed from ${previousStatus} to ${status}`,
        location: 'General',
        reportedBy: 'System'
      });
    }

    return dam;
  }

  private getAlertLevelForStatus(status: OperationalStatus): AlertLevel {
    switch (status) {
      case 'emergency':
      case 'failure_imminent':
        return 'emergency';
      case 'warning':
        return 'warning';
      case 'watch':
        return 'watch';
      case 'elevated':
        return 'advisory';
      default:
        return 'normal';
    }
  }

  async updateReservoirLevel(damId: string, currentElevation: number, inflowRate?: number, outflowRate?: number): Promise<Dam> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);

    dam.reservoir.currentElevation = currentElevation;
    if (inflowRate !== undefined) dam.reservoir.inflowRate = inflowRate;
    if (outflowRate !== undefined) dam.reservoir.outflowRate = outflowRate;

    // Calculate current storage based on elevation
    const elevationPercent = (currentElevation - (dam.reservoir.normalPoolElevation - 20)) /
      (dam.reservoir.maxPoolElevation - (dam.reservoir.normalPoolElevation - 20));
    dam.reservoir.currentStorage = Math.round(dam.reservoir.maxStorageCapacity * elevationPercent);

    dam.updatedAt = new Date();

    // Check for alert conditions
    const storagePercent = (dam.reservoir.currentStorage / dam.reservoir.maxStorageCapacity) * 100;
    if (storagePercent >= this.RESERVOIR_EMERGENCY_PERCENT) {
      await this.updateDamStatus(damId, 'warning', 'Reservoir at emergency level');
    } else if (storagePercent >= this.RESERVOIR_WARNING_PERCENT) {
      await this.updateDamStatus(damId, 'elevated', 'Reservoir at elevated level');
    }

    return dam;
  }

  // ==================== Spillway Operations ====================

  async operateSpillway(damId: string, spillwayId: string, operation: {
    gateStatus: 'open' | 'closed' | 'partial';
    gateOpeningPercent?: number;
  }): Promise<Spillway> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);

    const spillway = dam.spillways.find(s => s.id === spillwayId);
    if (!spillway) throw new Error(`Spillway not found: ${spillwayId}`);

    if (!spillway.gated) {
      throw new Error('Cannot operate ungated spillway');
    }

    spillway.gateStatus = operation.gateStatus;
    if (operation.gateOpeningPercent !== undefined) {
      spillway.gateOpeningPercent = operation.gateOpeningPercent;
      spillway.currentFlow = (operation.gateOpeningPercent / 100) * spillway.capacity;
    }

    dam.updatedAt = new Date();
    return spillway;
  }

  async getSpillwayStatus(damId: string): Promise<Spillway[]> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);
    return dam.spillways;
  }

  // ==================== Sensor Management ====================

  async installSensor(params: Omit<DamSensor, 'id' | 'installedAt'>): Promise<DamSensor> {
    const dam = this.dams.get(params.damId);
    if (!dam) throw new Error(`Dam not found: ${params.damId}`);

    const sensor: DamSensor = {
      ...params,
      id: `sensor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      installedAt: new Date()
    };

    this.sensors.set(sensor.id, sensor);
    dam.sensors.push(sensor.id);
    dam.updatedAt = new Date();

    return sensor;
  }

  async getSensor(sensorId: string): Promise<DamSensor | null> {
    return this.sensors.get(sensorId) || null;
  }

  async getSensorsForDam(damId: string): Promise<DamSensor[]> {
    return Array.from(this.sensors.values()).filter(s => s.damId === damId);
  }

  async recordSensorReading(params: {
    sensorId: string;
    value: number;
    quality?: SensorReading['quality'];
  }): Promise<SensorReading> {
    const sensor = this.sensors.get(params.sensorId);
    if (!sensor) throw new Error(`Sensor not found: ${params.sensorId}`);

    // Get previous reading for trend analysis
    const previousReadings = this.readings.get(sensor.damId) || [];
    const lastReading = previousReadings.filter(r => r.sensorId === sensor.id).slice(-1)[0];

    // Determine trend
    let trend: SensorReading['trend'] = 'unknown';
    let rateOfChange: number | undefined;
    if (lastReading) {
      const timeDiff = (Date.now() - lastReading.timestamp.getTime()) / 3600000; // hours
      rateOfChange = (params.value - lastReading.value) / timeDiff;
      if (Math.abs(rateOfChange) < 0.01) {
        trend = 'stable';
      } else if (rateOfChange > 0) {
        trend = 'rising';
      } else {
        trend = 'falling';
      }
    }

    // Determine alert level
    let alertLevel: AlertLevel = 'normal';
    const value = params.value;
    const thresholds = sensor.thresholds;
    
    if (value < thresholds.emergency.min || value > thresholds.emergency.max) {
      alertLevel = 'emergency';
    } else if (value < thresholds.warning.min || value > thresholds.warning.max) {
      alertLevel = 'warning';
    } else if (value < thresholds.advisory.min || value > thresholds.advisory.max) {
      alertLevel = 'watch';
    } else if (value < thresholds.normal.min || value > thresholds.normal.max) {
      alertLevel = 'advisory';
    }

    const reading: SensorReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sensorId: params.sensorId,
      damId: sensor.damId,
      timestamp: new Date(),
      value: params.value,
      unit: sensor.specifications.unit,
      quality: params.quality || 'good',
      alertLevel,
      trend,
      rateOfChange
    };

    // Store reading
    const readings = this.readings.get(sensor.damId) || [];
    readings.push(reading);
    if (readings.length > 50000) readings.shift();
    this.readings.set(sensor.damId, readings);

    // Update sensor
    sensor.lastReading = reading;
    if (alertLevel !== 'normal') {
      sensor.status = 'alarm';
      await this.createAlert(sensor, reading);
    }

    return reading;
  }

  private async createAlert(sensor: DamSensor, reading: SensorReading): Promise<SensorAlert> {
    const dam = this.dams.get(sensor.damId);

    const alert: SensorAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sensorId: sensor.id,
      damId: sensor.damId,
      damName: dam?.name || 'Unknown Dam',
      alertLevel: reading.alertLevel,
      type: 'threshold',
      title: `${sensor.type} alert at ${dam?.name || 'dam'}`,
      description: `Sensor ${sensor.name} recorded ${reading.value} ${reading.unit}, indicating ${reading.alertLevel} condition`,
      currentValue: reading.value,
      thresholdValue: this.getThresholdForLevel(sensor.thresholds, reading.alertLevel),
      unit: reading.unit,
      triggeredAt: new Date(),
      actions: this.getAlertActions(sensor.type, reading.alertLevel)
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private getThresholdForLevel(thresholds: DamSensor['thresholds'], level: AlertLevel): number {
    switch (level) {
      case 'emergency': return thresholds.emergency.max;
      case 'warning': return thresholds.warning.max;
      case 'watch': return thresholds.advisory.max;
      default: return thresholds.normal.max;
    }
  }

  private getAlertActions(sensorType: SensorType, alertLevel: AlertLevel): string[] {
    const actions: string[] = [];

    if (alertLevel === 'emergency' || alertLevel === 'warning') {
      actions.push('Activate Emergency Action Plan notification procedures');
      actions.push('Dispatch inspection team immediately');
    }

    switch (sensorType) {
      case 'water_level':
        actions.push('Review spillway operations');
        actions.push('Consider controlled release');
        break;
      case 'seepage':
        actions.push('Visual inspection of seepage area');
        actions.push('Monitor turbidity and flow rate');
        break;
      case 'pore_pressure':
        actions.push('Review piezometer network data');
        actions.push('Assess slope stability');
        break;
      case 'displacement':
        actions.push('Survey dam alignment');
        actions.push('Review historical movement data');
        break;
      case 'seismic':
        actions.push('Conduct post-earthquake inspection');
        actions.push('Review all sensor data for anomalies');
        break;
    }

    return actions;
  }

  async getAlerts(params?: {
    damId?: string;
    alertLevel?: AlertLevel;
    unresolved?: boolean;
  }): Promise<SensorAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.damId) {
      alerts = alerts.filter(a => a.damId === params.damId);
    }

    if (params?.alertLevel) {
      alerts = alerts.filter(a => a.alertLevel === params.alertLevel);
    }

    if (params?.unresolved) {
      alerts = alerts.filter(a => !a.resolvedAt);
    }

    return alerts.sort((a, b) => {
      const levelOrder = { emergency: 0, warning: 1, watch: 2, advisory: 3, normal: 4 };
      return levelOrder[a.alertLevel] - levelOrder[b.alertLevel];
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
    damId: string;
    inspectionType: DamInspection['inspectionType'];
    scheduledDate: Date;
    inspector: InspectorInfo;
  }): Promise<DamInspection> {
    const dam = this.dams.get(params.damId);
    if (!dam) throw new Error(`Dam not found: ${params.damId}`);

    const inspection: DamInspection = {
      id: `insp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      damId: params.damId,
      inspectionType: params.inspectionType,
      scheduledDate: params.scheduledDate,
      status: 'scheduled',
      inspector: params.inspector,
      reservoirLevel: dam.reservoir.currentElevation,
      findings: [],
      componentRatings: [],
      overallAssessment: dam.conditionAssessment,
      recommendations: [],
      priorityRepairs: [],
      photos: [],
      documents: [],
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.inspections.set(inspection.id, inspection);
    dam.inspectionHistory.push(inspection.id);

    return inspection;
  }

  async startInspection(inspectionId: string): Promise<DamInspection> {
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

    // Add to priority repairs if significant
    if (finding.severity === 'critical' || finding.severity === 'significant') {
      inspection.priorityRepairs.push({
        id: `repair-${Date.now()}`,
        description: finding.recommendedAction,
        component: finding.component,
        priority: finding.priority === 'immediate' ? 'emergency' : 'high',
        estimatedCost: 0,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending'
      });
    }

    return newFinding;
  }

  async completeInspection(inspectionId: string, completion: {
    componentRatings: ComponentRating[];
    overallAssessment: ConditionAssessment;
    recommendations: string[];
    duration: number;
  }): Promise<DamInspection> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error(`Inspection not found: ${inspectionId}`);

    inspection.status = 'completed';
    inspection.componentRatings = completion.componentRatings;
    inspection.overallAssessment = completion.overallAssessment;
    inspection.recommendations = completion.recommendations;
    inspection.duration = completion.duration;
    inspection.updatedAt = new Date();

    // Update dam condition
    const dam = this.dams.get(inspection.damId);
    if (dam) {
      dam.conditionAssessment = completion.overallAssessment;
      dam.regulatoryInfo.lastInspectionDate = new Date();
      dam.regulatoryInfo.nextInspectionDue = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      dam.updatedAt = new Date();
    }

    return inspection;
  }

  async getInspections(params?: {
    damId?: string;
    status?: DamInspection['status'];
    type?: DamInspection['inspectionType'];
    overdue?: boolean;
  }): Promise<DamInspection[]> {
    let inspections = Array.from(this.inspections.values());

    if (params?.damId) {
      inspections = inspections.filter(i => i.damId === params.damId);
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

  // ==================== Incident Management ====================

  async reportIncident(params: {
    damId: string;
    type: DamIncident['type'];
    severity: AlertLevel;
    description: string;
    location: string;
    reportedBy: string;
  }): Promise<DamIncident> {
    const dam = this.dams.get(params.damId);
    if (!dam) throw new Error(`Dam not found: ${params.damId}`);

    const incident: DamIncident = {
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      damId: params.damId,
      type: params.type,
      severity: params.severity,
      description: params.description,
      reportedAt: new Date(),
      reportedBy: params.reportedBy,
      location: params.location,
      status: 'reported',
      actions: []
    };

    dam.incidentHistory.push(incident);
    dam.updatedAt = new Date();

    // Update dam status based on incident severity
    if (params.severity === 'emergency') {
      dam.operationalStatus = 'emergency';
    } else if (params.severity === 'warning') {
      dam.operationalStatus = 'warning';
    } else if (params.severity === 'watch') {
      dam.operationalStatus = 'watch';
    }

    return incident;
  }

  async updateIncidentStatus(damId: string, incidentId: string, status: DamIncident['status'], notes?: string): Promise<DamIncident> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);

    const incident = dam.incidentHistory.find(i => i.id === incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    incident.status = status;
    if (status === 'resolved') {
      incident.resolvedAt = new Date();
    }

    dam.updatedAt = new Date();
    return incident;
  }

  async addIncidentAction(damId: string, incidentId: string, action: Omit<IncidentAction, 'id'>): Promise<IncidentAction> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);

    const incident = dam.incidentHistory.find(i => i.id === incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    const newAction: IncidentAction = {
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    };

    incident.actions.push(newAction);
    dam.updatedAt = new Date();

    return newAction;
  }

  // ==================== Emergency Action Plan ====================

  async activateEAP(damId: string, alertLevel: AlertLevel, reason: string): Promise<{
    dam: Dam;
    notifications: string[];
    actions: string[];
  }> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);

    const eap = dam.emergencyActionPlan;
    const actionLevel = eap.actionLevels.find(a => a.level === alertLevel);

    const notifications: string[] = [];
    const actions: string[] = [];

    if (actionLevel) {
      // Simulate notifications
      eap.notificationList.forEach(contact => {
        notifications.push(`Notified ${contact.name} (${contact.role}) at ${contact.phone}`);
      });

      actions.push(...actionLevel.actions);
    }

    // Update dam status
    await this.updateDamStatus(damId, this.getStatusFromAlertLevel(alertLevel), reason);

    return { dam, notifications, actions };
  }

  private getStatusFromAlertLevel(alertLevel: AlertLevel): OperationalStatus {
    switch (alertLevel) {
      case 'emergency': return 'emergency';
      case 'warning': return 'warning';
      case 'watch': return 'watch';
      case 'advisory': return 'elevated';
      default: return 'normal';
    }
  }

  async getInundationZones(damId: string, scenario?: InundationZone['scenario']): Promise<InundationZone[]> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);

    let zones = dam.emergencyActionPlan.inundationMaps;
    if (scenario) {
      zones = zones.filter(z => z.scenario === scenario);
    }

    return zones;
  }

  async getEvacuationRoutes(damId: string): Promise<EvacuationRoute[]> {
    const dam = this.dams.get(damId);
    if (!dam) throw new Error(`Dam not found: ${damId}`);

    return dam.emergencyActionPlan.evacuationRoutes;
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalDams: number;
    byHazardClass: Record<DamHazardClass, number>;
    byStatus: Record<OperationalStatus, number>;
    byCondition: Record<ConditionAssessment, number>;
    activeSensors: number;
    activeAlerts: number;
    overdueInspections: number;
    activeIncidents: number;
    totalReservoirCapacity: number;
    currentTotalStorage: number;
  }> {
    const dams = Array.from(this.dams.values());
    const sensors = Array.from(this.sensors.values());
    const alerts = await this.getAlerts({ unresolved: true });
    const overdueInspections = await this.getInspections({ overdue: true });

    const byHazardClass: Record<DamHazardClass, number> = { high: 0, significant: 0, low: 0 };
    const byStatus: Record<OperationalStatus, number> = {
      normal: 0, elevated: 0, watch: 0, warning: 0, emergency: 0, failure_imminent: 0
    };
    const byCondition: Record<ConditionAssessment, number> = {
      satisfactory: 0, fair: 0, poor: 0, unsatisfactory: 0, not_rated: 0
    };

    let totalCapacity = 0;
    let totalStorage = 0;
    let activeIncidents = 0;

    dams.forEach(d => {
      byHazardClass[d.hazardClass]++;
      byStatus[d.operationalStatus]++;
      byCondition[d.conditionAssessment]++;
      totalCapacity += d.reservoir.maxStorageCapacity;
      totalStorage += d.reservoir.currentStorage;
      activeIncidents += d.incidentHistory.filter(i => i.status !== 'resolved').length;
    });

    return {
      totalDams: dams.length,
      byHazardClass,
      byStatus,
      byCondition,
      activeSensors: sensors.filter(s => s.status === 'online' || s.status === 'alarm').length,
      activeAlerts: alerts.length,
      overdueInspections: overdueInspections.length,
      activeIncidents,
      totalReservoirCapacity: totalCapacity,
      currentTotalStorage: totalStorage
    };
  }
}

export const damSafetyService = DamSafetyService.getInstance();
export default DamSafetyService;

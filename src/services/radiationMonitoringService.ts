/**
 * Radiation Monitoring Service - Issue #141 Implementation
 * 
 * Provides comprehensive radiation monitoring for disaster response including
 * dose rate measurement, contamination detection, exposure tracking, plume
 * modeling, protective action recommendations, and decontamination guidance.
 */

// Type definitions
type RadiationType = 'alpha' | 'beta' | 'gamma' | 'neutron' | 'x_ray';
type RadiationSource = 'nuclear_plant' | 'dirty_bomb' | 'medical' | 'industrial' | 'natural' | 'unknown';
type ExposurePathway = 'external' | 'inhalation' | 'ingestion' | 'skin_contact';
type AlertLevel = 'normal' | 'elevated' | 'alert' | 'site_emergency' | 'general_emergency';
type MonitorStatus = 'operational' | 'elevated' | 'alarm' | 'offline' | 'calibrating';
type ProtectiveAction = 'shelter_in_place' | 'evacuation' | 'ki_distribution' | 'food_restriction' | 'water_restriction';

// Measurement interfaces
interface RadiationReading {
  id: string;
  monitorId: string;
  stationId: string;
  locationId: string;
  timestamp: Date;
  doseRate: number;
  doseRateUnit: 'mSv/h' | 'µSv/h' | 'mR/h' | 'µR/h';
  cumulativeDose?: number;
  radiationType: RadiationType[];
  spectrum?: SpectrumData;
  isotopeIdentification?: IsotopeIdentification[];
  backgroundLevel: number;
  elevationAboveBackground: number;
  isAlarm: boolean;
  alarmThreshold: number;
  temperature: number;
  humidity: number;
  batteryLevel?: number;
  qualityFlag: 'valid' | 'suspect' | 'invalid';
  rawCounts: number;
  metadata: Record<string, any>;
}

interface SpectrumData {
  channels: number;
  energyRange: { min: number; max: number };
  counts: number[];
  liveTime: number;
  realTime: number;
  peaks: { energy: number; counts: number; fwhm: number }[];
}

interface IsotopeIdentification {
  isotope: string;
  confidence: number;
  activity: number;
  activityUnit: string;
  halfLife: string;
  decayMode: string;
  primaryEnergy: number;
}

// Monitoring equipment interfaces
interface RadiationMonitor {
  id: string;
  name: string;
  type: 'fixed' | 'portable' | 'personal' | 'area' | 'portal';
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
    description: string;
    indoor: boolean;
  };
  detectorType: 'geiger' | 'scintillator' | 'semiconductor' | 'ion_chamber' | 'neutron';
  capabilities: RadiationType[];
  measurementRange: { min: number; max: number };
  sensitivity: number;
  energyRange?: { min: number; max: number };
  alarmSetpoints: {
    level: string;
    threshold: number;
    unit: string;
  }[];
  status: MonitorStatus;
  lastReading?: Date;
  lastCalibration: Date;
  nextCalibration: Date;
  batteryLevel?: number;
  operator: string;
  metadata: Record<string, any>;
}

interface MonitoringNetwork {
  id: string;
  name: string;
  description: string;
  monitors: string[];
  coverageArea: { type: 'polygon' | 'circle'; coordinates: number[][]; radiusKm?: number };
  purpose: 'emergency' | 'environmental' | 'occupational' | 'security';
  dataFrequency: 'continuous' | 'hourly' | 'daily';
  status: 'active' | 'partial' | 'offline';
  alertRecipients: string[];
  createdAt: Date;
}

// Exposure interfaces
interface PersonnelExposure {
  id: string;
  personnelId: string;
  personnelName: string;
  role: string;
  organization: string;
  incidentId?: string;
  exposureRecords: ExposureRecord[];
  totalDose: {
    deep: number;
    shallow: number;
    lens: number;
    extremity: number;
    committed: number;
  };
  doseUnit: string;
  annualLimit: number;
  emergencyLimit: number;
  percentOfLimit: number;
  dosimeterId?: string;
  bioassayRequired: boolean;
  medicalSurveillance: boolean;
  restrictions?: string[];
  lastUpdated: Date;
}

interface ExposureRecord {
  id: string;
  timestamp: Date;
  duration: number; // minutes
  location: string;
  pathway: ExposurePathway;
  doseRate: number;
  totalDose: number;
  protectiveEquipment: string[];
  task: string;
  verifiedBy?: string;
}

// Alert interfaces
interface RadiationAlert {
  id: string;
  type: 'elevated' | 'alarm' | 'emergency' | 'release' | 'contamination';
  level: AlertLevel;
  title: string;
  message: string;
  source: RadiationSource;
  facilityId?: string;
  affectedAreas: AffectedArea[];
  measurements: {
    monitorId: string;
    value: number;
    unit: string;
    timestamp: Date;
  }[];
  isotopes?: string[];
  protectiveActions: ProtectiveActionRecommendation[];
  evacuationZones?: EvacuationZone[];
  shelterInPlaceZones?: string[];
  kiDistributionAreas?: string[];
  projectedPath?: PlumePath;
  startTime: Date;
  expectedDuration?: number;
  status: 'active' | 'monitoring' | 'resolved';
  issuedBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AffectedArea {
  id: string;
  name: string;
  type: 'zone' | 'sector' | 'municipality' | 'county';
  population: number;
  distance: number;
  direction: string;
  projectedDose: number;
  recommendedAction: ProtectiveAction;
}

interface ProtectiveActionRecommendation {
  action: ProtectiveAction;
  areas: string[];
  priority: 'immediate' | 'urgent' | 'recommended';
  duration?: string;
  instructions: string[];
  healthGuidance: string[];
}

interface EvacuationZone {
  id: string;
  name: string;
  radius: number;
  population: number;
  routes: string[];
  shelters: string[];
  priority: number;
  estimatedTime: string;
}

// Plume modeling interfaces
interface PlumePath {
  id: string;
  alertId: string;
  modelType: 'gaussian' | 'lagrangian' | 'puff';
  releasePoint: { latitude: number; longitude: number; height: number };
  releaseRate?: number;
  releaseInventory?: { isotope: string; activity: number }[];
  meteorology: {
    windSpeed: number;
    windDirection: number;
    stabilityClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
    mixingHeight: number;
    precipitation: number;
  };
  projections: PlumeProjection[];
  validFrom: Date;
  validTo: Date;
  confidence: number;
}

interface PlumeProjection {
  timestamp: Date;
  centerline: { latitude: number; longitude: number }[];
  contours: {
    doseRate: number;
    polygon: { latitude: number; longitude: number }[];
  }[];
  groundDeposition?: {
    isotope: string;
    activity: number;
    area: { latitude: number; longitude: number }[];
  }[];
}

// Contamination interfaces
interface ContaminationSurvey {
  id: string;
  incidentId?: string;
  surveyType: 'area' | 'personnel' | 'equipment' | 'vehicle' | 'food';
  location: string;
  timestamp: Date;
  surveyorId: string;
  instrumentUsed: string;
  results: ContaminationResult[];
  overallStatus: 'clean' | 'contaminated' | 'highly_contaminated';
  decontaminationRequired: boolean;
  recommendations: string[];
  photos?: string[];
  signoff?: string;
}

interface ContaminationResult {
  area: string;
  surfaceType: string;
  reading: number;
  unit: string;
  actionLevel: number;
  isAboveLimit: boolean;
  isotope?: string;
  removable?: number;
  fixed?: number;
}

// Decontamination interfaces
interface DecontaminationRecord {
  id: string;
  surveyId: string;
  type: 'personnel' | 'equipment' | 'area' | 'vehicle';
  subject: string;
  location: string;
  timestamp: Date;
  method: string;
  initialLevel: number;
  finalLevel: number;
  reductionFactor: number;
  successful: boolean;
  performedBy: string;
  wasteGenerated?: { type: string; volume: number; disposition: string };
  followUpRequired: boolean;
  notes: string;
}

// Health physics interfaces
interface DoseProjection {
  id: string;
  alertId: string;
  location: string;
  population: number;
  pathways: {
    pathway: ExposurePathway;
    dose: number;
    percentage: number;
  }[];
  totalProjectedDose: number;
  doseUnit: string;
  timeframe: string;
  protectiveActionBenefit: {
    action: ProtectiveAction;
    doseAverted: number;
    percentReduction: number;
  }[];
  confidence: number;
  assumptions: string[];
  generatedAt: Date;
}

// Sample data
const sampleReadings: RadiationReading[] = [
  {
    id: 'reading-001',
    monitorId: 'monitor-001',
    stationId: 'station-001',
    locationId: 'loc-001',
    timestamp: new Date(),
    doseRate: 0.12,
    doseRateUnit: 'µSv/h',
    radiationType: ['gamma'],
    backgroundLevel: 0.1,
    elevationAboveBackground: 0.02,
    isAlarm: false,
    alarmThreshold: 1.0,
    temperature: 22,
    humidity: 45,
    batteryLevel: 95,
    qualityFlag: 'valid',
    rawCounts: 45,
    metadata: {}
  }
];

class RadiationMonitoringService {
  private static instance: RadiationMonitoringService;
  private readings: Map<string, RadiationReading> = new Map();
  private monitors: Map<string, RadiationMonitor> = new Map();
  private networks: Map<string, MonitoringNetwork> = new Map();
  private exposures: Map<string, PersonnelExposure> = new Map();
  private alerts: Map<string, RadiationAlert> = new Map();
  private plumes: Map<string, PlumePath> = new Map();
  private surveys: Map<string, ContaminationSurvey> = new Map();
  private deconRecords: Map<string, DecontaminationRecord> = new Map();
  private projections: Map<string, DoseProjection> = new Map();

  // Dose limits (ICRP recommendations)
  private readonly doseLimits = {
    occupational: {
      annual: 20, // mSv
      emergency: 100, // mSv - life-saving
      emergencyInformed: 500 // mSv - voluntary, informed
    },
    public: {
      annual: 1, // mSv
      emergency: 20 // mSv
    }
  };

  // Protective action guidelines (EPA)
  private readonly protectiveActionLevels = {
    shelterInPlace: 10, // mSv projected
    evacuation: 50, // mSv projected
    kiDistribution: 0.05, // Gy thyroid
    foodRestriction: 5, // mSv first year
    waterRestriction: 10 // mSv first year
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): RadiationMonitoringService {
    if (!RadiationMonitoringService.instance) {
      RadiationMonitoringService.instance = new RadiationMonitoringService();
    }
    return RadiationMonitoringService.instance;
  }

  private initializeSampleData(): void {
    sampleReadings.forEach(r => this.readings.set(r.id, r));
  }

  // ==================== Reading Management ====================

  async recordReading(params: {
    monitorId: string;
    stationId: string;
    locationId: string;
    doseRate: number;
    doseRateUnit: RadiationReading['doseRateUnit'];
    radiationType: RadiationType[];
    backgroundLevel?: number;
    spectrum?: SpectrumData;
    temperature?: number;
    humidity?: number;
    batteryLevel?: number;
    rawCounts?: number;
  }): Promise<RadiationReading> {
    const monitor = this.monitors.get(params.monitorId);
    const backgroundLevel = params.backgroundLevel || 0.1;
    const elevation = params.doseRate - backgroundLevel;
    const alarmThreshold = monitor?.alarmSetpoints[0]?.threshold || 1.0;

    // Identify isotopes if spectrum provided
    const isotopes = params.spectrum ? this.identifyIsotopes(params.spectrum) : undefined;

    const reading: RadiationReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      monitorId: params.monitorId,
      stationId: params.stationId,
      locationId: params.locationId,
      timestamp: new Date(),
      doseRate: params.doseRate,
      doseRateUnit: params.doseRateUnit,
      radiationType: params.radiationType,
      spectrum: params.spectrum,
      isotopeIdentification: isotopes,
      backgroundLevel,
      elevationAboveBackground: elevation,
      isAlarm: params.doseRate > alarmThreshold,
      alarmThreshold,
      temperature: params.temperature || 20,
      humidity: params.humidity || 50,
      batteryLevel: params.batteryLevel,
      qualityFlag: this.validateReading(params.doseRate, backgroundLevel),
      rawCounts: params.rawCounts || Math.round(params.doseRate * 60),
      metadata: {}
    };

    this.readings.set(reading.id, reading);

    // Update monitor status
    if (monitor) {
      monitor.lastReading = new Date();
      monitor.status = reading.isAlarm ? 'alarm' : reading.elevationAboveBackground > backgroundLevel * 0.5 ? 'elevated' : 'operational';
      this.monitors.set(monitor.id, monitor);
    }

    // Check alert conditions
    await this.checkAlertConditions(reading);

    return reading;
  }

  private identifyIsotopes(spectrum: SpectrumData): IsotopeIdentification[] {
    const isotopes: IsotopeIdentification[] = [];

    // Simplified isotope library
    const isotopeLibrary: { isotope: string; energy: number; halfLife: string; decayMode: string }[] = [
      { isotope: 'Cs-137', energy: 662, halfLife: '30.17 years', decayMode: 'beta-gamma' },
      { isotope: 'I-131', energy: 364, halfLife: '8.02 days', decayMode: 'beta-gamma' },
      { isotope: 'Co-60', energy: 1173, halfLife: '5.27 years', decayMode: 'beta-gamma' },
      { isotope: 'K-40', energy: 1461, halfLife: '1.25e9 years', decayMode: 'beta-gamma' },
      { isotope: 'Ra-226', energy: 186, halfLife: '1600 years', decayMode: 'alpha' }
    ];

    spectrum.peaks.forEach(peak => {
      const match = isotopeLibrary.find(iso => Math.abs(iso.energy - peak.energy) < 10);
      if (match) {
        isotopes.push({
          isotope: match.isotope,
          confidence: Math.min(0.95, 0.7 + peak.counts / 1000),
          activity: peak.counts * 0.001,
          activityUnit: 'µCi',
          halfLife: match.halfLife,
          decayMode: match.decayMode,
          primaryEnergy: match.energy
        });
      }
    });

    return isotopes;
  }

  private validateReading(doseRate: number, background: number): RadiationReading['qualityFlag'] {
    if (doseRate < 0) return 'invalid';
    if (doseRate > background * 1000) return 'suspect';
    return 'valid';
  }

  async getReading(readingId: string): Promise<RadiationReading | null> {
    return this.readings.get(readingId) || null;
  }

  async searchReadings(query: {
    monitorId?: string;
    stationId?: string;
    locationId?: string;
    minDoseRate?: number;
    maxDoseRate?: number;
    isAlarm?: boolean;
    dateRange?: { start: Date; end: Date };
    limit?: number;
    offset?: number;
  }): Promise<{ readings: RadiationReading[]; total: number }> {
    let readings = Array.from(this.readings.values());

    if (query.monitorId) {
      readings = readings.filter(r => r.monitorId === query.monitorId);
    }

    if (query.stationId) {
      readings = readings.filter(r => r.stationId === query.stationId);
    }

    if (query.locationId) {
      readings = readings.filter(r => r.locationId === query.locationId);
    }

    if (query.minDoseRate !== undefined) {
      readings = readings.filter(r => r.doseRate >= query.minDoseRate!);
    }

    if (query.maxDoseRate !== undefined) {
      readings = readings.filter(r => r.doseRate <= query.maxDoseRate!);
    }

    if (query.isAlarm !== undefined) {
      readings = readings.filter(r => r.isAlarm === query.isAlarm);
    }

    if (query.dateRange) {
      readings = readings.filter(r =>
        r.timestamp >= query.dateRange!.start && r.timestamp <= query.dateRange!.end
      );
    }

    readings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = readings.length;
    const offset = query.offset || 0;
    const limit = query.limit || 100;

    return {
      readings: readings.slice(offset, offset + limit),
      total
    };
  }

  // ==================== Monitor Management ====================

  async registerMonitor(params: {
    name: string;
    type: RadiationMonitor['type'];
    location: RadiationMonitor['location'];
    detectorType: RadiationMonitor['detectorType'];
    capabilities: RadiationType[];
    measurementRange: { min: number; max: number };
    sensitivity: number;
    alarmSetpoints: { level: string; threshold: number; unit: string }[];
    operator: string;
  }): Promise<RadiationMonitor> {
    const monitor: RadiationMonitor = {
      id: `monitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      location: params.location,
      detectorType: params.detectorType,
      capabilities: params.capabilities,
      measurementRange: params.measurementRange,
      sensitivity: params.sensitivity,
      alarmSetpoints: params.alarmSetpoints,
      status: 'operational',
      lastCalibration: new Date(),
      nextCalibration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      operator: params.operator,
      metadata: {}
    };

    this.monitors.set(monitor.id, monitor);
    return monitor;
  }

  async getMonitor(monitorId: string): Promise<RadiationMonitor | null> {
    return this.monitors.get(monitorId) || null;
  }

  async listMonitors(query?: {
    type?: RadiationMonitor['type'];
    status?: MonitorStatus;
    capability?: RadiationType;
    nearLocation?: { latitude: number; longitude: number; radiusKm: number };
  }): Promise<RadiationMonitor[]> {
    let monitors = Array.from(this.monitors.values());

    if (query?.type) {
      monitors = monitors.filter(m => m.type === query.type);
    }

    if (query?.status) {
      monitors = monitors.filter(m => m.status === query.status);
    }

    if (query?.capability) {
      monitors = monitors.filter(m => m.capabilities.includes(query.capability!));
    }

    if (query?.nearLocation) {
      monitors = monitors.filter(m => {
        const distance = this.calculateDistance(
          query.nearLocation!.latitude,
          query.nearLocation!.longitude,
          m.location.latitude,
          m.location.longitude
        );
        return distance <= query.nearLocation!.radiusKm;
      });
    }

    return monitors;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ==================== Alert Management ====================

  private async checkAlertConditions(reading: RadiationReading): Promise<void> {
    if (reading.isAlarm) {
      const level = this.determineAlertLevel(reading);
      await this.createAlert({
        type: 'alarm',
        level,
        source: 'unknown',
        measurements: [{
          monitorId: reading.monitorId,
          value: reading.doseRate,
          unit: reading.doseRateUnit,
          timestamp: reading.timestamp
        }],
        isotopes: reading.isotopeIdentification?.map(i => i.isotope),
        affectedAreas: [reading.locationId]
      });
    }
  }

  private determineAlertLevel(reading: RadiationReading): AlertLevel {
    const normalized = this.normalizeDoseRate(reading.doseRate, reading.doseRateUnit);
    
    if (normalized > 1000) return 'general_emergency';
    if (normalized > 100) return 'site_emergency';
    if (normalized > 10) return 'alert';
    if (normalized > 1) return 'elevated';
    return 'normal';
  }

  private normalizeDoseRate(value: number, unit: RadiationReading['doseRateUnit']): number {
    // Normalize to µSv/h
    switch (unit) {
      case 'mSv/h': return value * 1000;
      case 'µSv/h': return value;
      case 'mR/h': return value * 10;
      case 'µR/h': return value * 0.01;
      default: return value;
    }
  }

  async createAlert(params: {
    type: RadiationAlert['type'];
    level: AlertLevel;
    source: RadiationSource;
    facilityId?: string;
    measurements: RadiationAlert['measurements'];
    isotopes?: string[];
    affectedAreas: string[];
    projectedPath?: PlumePath;
  }): Promise<RadiationAlert> {
    const protectiveActions = this.determineProtectiveActions(params.level, params.measurements);
    const affectedAreaDetails = params.affectedAreas.map(area => this.getAffectedAreaDetails(area, params.level));

    const alert: RadiationAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      level: params.level,
      title: this.generateAlertTitle(params.type, params.level),
      message: this.generateAlertMessage(params.level, params.isotopes),
      source: params.source,
      facilityId: params.facilityId,
      affectedAreas: affectedAreaDetails,
      measurements: params.measurements,
      isotopes: params.isotopes,
      protectiveActions,
      evacuationZones: params.level === 'general_emergency' ? this.generateEvacuationZones() : undefined,
      shelterInPlaceZones: params.level === 'site_emergency' || params.level === 'general_emergency' 
        ? params.affectedAreas : undefined,
      kiDistributionAreas: params.isotopes?.includes('I-131') ? params.affectedAreas : undefined,
      projectedPath: params.projectedPath,
      startTime: new Date(),
      status: 'active',
      issuedBy: 'Radiation Monitoring System',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private generateAlertTitle(type: RadiationAlert['type'], level: AlertLevel): string {
    const levelNames: Record<AlertLevel, string> = {
      normal: 'Normal',
      elevated: 'Elevated Radiation',
      alert: 'Radiation Alert',
      site_emergency: 'Site Area Emergency',
      general_emergency: 'General Emergency'
    };
    return `RADIOLOGICAL ${levelNames[level].toUpperCase()}`;
  }

  private generateAlertMessage(level: AlertLevel, isotopes?: string[]): string {
    let message = '';
    
    switch (level) {
      case 'elevated':
        message = 'Radiation levels above normal background have been detected. Monitoring continues.';
        break;
      case 'alert':
        message = 'Significant elevation in radiation levels detected. Assessment underway.';
        break;
      case 'site_emergency':
        message = 'A site emergency has been declared. Protective actions may be required for nearby areas.';
        break;
      case 'general_emergency':
        message = 'A general emergency has been declared. Follow protective action instructions immediately.';
        break;
      default:
        message = 'Radiation levels are within normal limits.';
    }

    if (isotopes && isotopes.length > 0) {
      message += ` Isotopes identified: ${isotopes.join(', ')}.`;
    }

    return message;
  }

  private determineProtectiveActions(level: AlertLevel, measurements: RadiationAlert['measurements']): ProtectiveActionRecommendation[] {
    const actions: ProtectiveActionRecommendation[] = [];

    if (level === 'site_emergency' || level === 'general_emergency') {
      actions.push({
        action: 'shelter_in_place',
        areas: ['all_affected'],
        priority: 'immediate',
        duration: 'Until further notice',
        instructions: [
          'Go indoors immediately',
          'Close all windows and doors',
          'Turn off HVAC systems',
          'Seal gaps with wet towels if possible',
          'Move to interior room on lower floor',
          'Monitor official communications'
        ],
        healthGuidance: [
          'Remain calm',
          'Shelter significantly reduces exposure',
          'Do not evacuate unless instructed'
        ]
      });
    }

    if (level === 'general_emergency') {
      actions.push({
        action: 'ki_distribution',
        areas: ['affected_zones'],
        priority: 'urgent',
        instructions: [
          'Take KI only if instructed by authorities',
          'Follow dosage instructions exactly',
          'KI protects only the thyroid gland',
          'Report any adverse reactions'
        ],
        healthGuidance: [
          'KI is most effective within 4 hours of exposure',
          'Not recommended for those over 40 unless doses very high',
          'Consult doctor if you have thyroid conditions'
        ]
      });

      actions.push({
        action: 'evacuation',
        areas: ['inner_zone'],
        priority: 'immediate',
        instructions: [
          'Evacuate immediately if in evacuation zone',
          'Follow designated evacuation routes',
          'Bring essential items only',
          'Report to designated shelter'
        ],
        healthGuidance: [
          'Keep vehicle windows closed',
          'Use recirculated air in vehicle',
          'Shower and change clothes upon arrival at shelter'
        ]
      });
    }

    return actions;
  }

  private getAffectedAreaDetails(areaId: string, level: AlertLevel): AffectedArea {
    return {
      id: areaId,
      name: `Area ${areaId}`,
      type: 'zone',
      population: 50000,
      distance: 5,
      direction: 'downwind',
      projectedDose: level === 'general_emergency' ? 50 : level === 'site_emergency' ? 20 : 5,
      recommendedAction: level === 'general_emergency' ? 'evacuation' : 'shelter_in_place'
    };
  }

  private generateEvacuationZones(): EvacuationZone[] {
    return [
      {
        id: 'zone-1',
        name: '2-Mile Evacuation Zone',
        radius: 3.2,
        population: 5000,
        routes: ['Route A - North', 'Route B - South'],
        shelters: ['Emergency Shelter 1', 'Emergency Shelter 2'],
        priority: 1,
        estimatedTime: '2-4 hours'
      },
      {
        id: 'zone-2',
        name: '5-Mile Evacuation Zone',
        radius: 8,
        population: 25000,
        routes: ['Route C - East', 'Route D - West'],
        shelters: ['Emergency Shelter 3', 'Emergency Shelter 4'],
        priority: 2,
        estimatedTime: '4-8 hours'
      }
    ];
  }

  async getActiveAlerts(locationId?: string): Promise<RadiationAlert[]> {
    let alerts = Array.from(this.alerts.values()).filter(a => a.status === 'active');

    if (locationId) {
      alerts = alerts.filter(a => a.affectedAreas.some(area => area.id === locationId));
    }

    const levelOrder: Record<AlertLevel, number> = {
      general_emergency: 0, site_emergency: 1, alert: 2, elevated: 3, normal: 4
    };

    return alerts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
  }

  async resolveAlert(alertId: string): Promise<RadiationAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.status = 'resolved';
    alert.updatedAt = new Date();

    this.alerts.set(alertId, alert);
    return alert;
  }

  // ==================== Personnel Exposure ====================

  async recordExposure(params: {
    personnelId: string;
    personnelName: string;
    role: string;
    organization: string;
    incidentId?: string;
    duration: number;
    location: string;
    pathway: ExposurePathway;
    doseRate: number;
    protectiveEquipment: string[];
    task: string;
  }): Promise<PersonnelExposure> {
    let exposure = this.exposures.get(params.personnelId);

    const record: ExposureRecord = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(),
      duration: params.duration,
      location: params.location,
      pathway: params.pathway,
      doseRate: params.doseRate,
      totalDose: params.doseRate * (params.duration / 60),
      protectiveEquipment: params.protectiveEquipment,
      task: params.task
    };

    if (!exposure) {
      exposure = {
        id: `pers-${params.personnelId}`,
        personnelId: params.personnelId,
        personnelName: params.personnelName,
        role: params.role,
        organization: params.organization,
        incidentId: params.incidentId,
        exposureRecords: [],
        totalDose: { deep: 0, shallow: 0, lens: 0, extremity: 0, committed: 0 },
        doseUnit: 'mSv',
        annualLimit: this.doseLimits.occupational.annual,
        emergencyLimit: this.doseLimits.occupational.emergency,
        percentOfLimit: 0,
        bioassayRequired: false,
        medicalSurveillance: false,
        lastUpdated: new Date()
      };
    }

    exposure.exposureRecords.push(record);
    exposure.totalDose.deep += record.totalDose;
    exposure.percentOfLimit = (exposure.totalDose.deep / exposure.annualLimit) * 100;
    exposure.bioassayRequired = exposure.totalDose.deep > 5;
    exposure.medicalSurveillance = exposure.totalDose.deep > 10;
    
    if (exposure.percentOfLimit > 80) {
      exposure.restrictions = ['Limited to low-dose areas', 'Review before additional exposure'];
    }

    exposure.lastUpdated = new Date();
    this.exposures.set(params.personnelId, exposure);

    return exposure;
  }

  async getPersonnelExposure(personnelId: string): Promise<PersonnelExposure | null> {
    return this.exposures.get(personnelId) || null;
  }

  async listPersonnelExposures(query?: {
    organization?: string;
    incidentId?: string;
    minDose?: number;
    needsBioassay?: boolean;
  }): Promise<PersonnelExposure[]> {
    let exposures = Array.from(this.exposures.values());

    if (query?.organization) {
      exposures = exposures.filter(e => e.organization === query.organization);
    }

    if (query?.incidentId) {
      exposures = exposures.filter(e => e.incidentId === query.incidentId);
    }

    if (query?.minDose !== undefined) {
      exposures = exposures.filter(e => e.totalDose.deep >= query.minDose!);
    }

    if (query?.needsBioassay) {
      exposures = exposures.filter(e => e.bioassayRequired);
    }

    return exposures.sort((a, b) => b.totalDose.deep - a.totalDose.deep);
  }

  // ==================== Contamination Survey ====================

  async recordSurvey(params: {
    incidentId?: string;
    surveyType: ContaminationSurvey['surveyType'];
    location: string;
    surveyorId: string;
    instrumentUsed: string;
    results: Omit<ContaminationResult, 'isAboveLimit'>[];
    recommendations?: string[];
  }): Promise<ContaminationSurvey> {
    const processedResults: ContaminationResult[] = params.results.map(r => ({
      ...r,
      isAboveLimit: r.reading > r.actionLevel
    }));

    const overallStatus = processedResults.some(r => r.reading > r.actionLevel * 10) ? 'highly_contaminated' :
      processedResults.some(r => r.isAboveLimit) ? 'contaminated' : 'clean';

    const survey: ContaminationSurvey = {
      id: `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      surveyType: params.surveyType,
      location: params.location,
      timestamp: new Date(),
      surveyorId: params.surveyorId,
      instrumentUsed: params.instrumentUsed,
      results: processedResults,
      overallStatus,
      decontaminationRequired: overallStatus !== 'clean',
      recommendations: params.recommendations || this.generateSurveyRecommendations(overallStatus, processedResults)
    };

    this.surveys.set(survey.id, survey);
    return survey;
  }

  private generateSurveyRecommendations(status: ContaminationSurvey['overallStatus'], results: ContaminationResult[]): string[] {
    const recommendations: string[] = [];

    if (status === 'clean') {
      recommendations.push('No decontamination required');
      recommendations.push('Document results and release');
    } else if (status === 'contaminated') {
      recommendations.push('Decontamination required');
      recommendations.push('Use standard decontamination procedures');
      recommendations.push('Re-survey after decontamination');
    } else {
      recommendations.push('High-level contamination - isolate immediately');
      recommendations.push('Contact radiation safety officer');
      recommendations.push('May require specialized decontamination');
      recommendations.push('Consider disposal if decontamination not feasible');
    }

    return recommendations;
  }

  // ==================== Statistics ====================

  async getStatistics(locationId?: string): Promise<{
    totalReadings: number;
    averageDoseRate: number;
    maxDoseRate: number;
    alarmsCount: number;
    activeAlerts: number;
    monitorsOnline: number;
    monitorsTotal: number;
    personnelExposed: number;
    totalCollectiveDose: number;
    contamSurveysToday: number;
    last24HoursTrend: { hour: Date; doseRate: number }[];
  }> {
    let readings = Array.from(this.readings.values());

    if (locationId) {
      readings = readings.filter(r => r.locationId === locationId);
    }

    const now = new Date();
    const last24Hours = readings.filter(r => 
      r.timestamp >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
    );

    const doseRates = readings.map(r => this.normalizeDoseRate(r.doseRate, r.doseRateUnit));
    const avgDoseRate = doseRates.length > 0 ? doseRates.reduce((a, b) => a + b, 0) / doseRates.length : 0;
    const maxDoseRate = doseRates.length > 0 ? Math.max(...doseRates) : 0;

    const monitors = Array.from(this.monitors.values());
    const exposures = Array.from(this.exposures.values());
    const surveys = Array.from(this.surveys.values());

    return {
      totalReadings: readings.length,
      averageDoseRate: avgDoseRate,
      maxDoseRate,
      alarmsCount: readings.filter(r => r.isAlarm).length,
      activeAlerts: Array.from(this.alerts.values()).filter(a => a.status === 'active').length,
      monitorsOnline: monitors.filter(m => m.status === 'operational').length,
      monitorsTotal: monitors.length,
      personnelExposed: exposures.filter(e => e.totalDose.deep > 0).length,
      totalCollectiveDose: exposures.reduce((sum, e) => sum + e.totalDose.deep, 0),
      contamSurveysToday: surveys.filter(s => 
        s.timestamp >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
      ).length,
      last24HoursTrend: last24Hours
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map(r => ({ hour: r.timestamp, doseRate: this.normalizeDoseRate(r.doseRate, r.doseRateUnit) }))
    };
  }
}

export const radiationMonitoringService = RadiationMonitoringService.getInstance();
export default RadiationMonitoringService;

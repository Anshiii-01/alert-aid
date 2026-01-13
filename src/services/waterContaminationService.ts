/**
 * Water Contamination Monitoring Service - Issue #140 Implementation
 * 
 * Provides comprehensive water quality monitoring for disaster response including
 * contamination detection, source tracing, treatment recommendations, distribution
 * network management, and public health protection.
 */

// Type definitions
type ContaminantType = 'bacterial' | 'viral' | 'chemical' | 'heavy_metal' | 'organic' | 'radioactive' | 'particulate' | 'biological';
type WaterSource = 'municipal' | 'well' | 'surface' | 'reservoir' | 'spring' | 'rainwater' | 'desalinated' | 'recycled';
type AlertSeverity = 'advisory' | 'watch' | 'warning' | 'emergency' | 'do_not_use' | 'do_not_drink';
type SampleStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'invalid';
type TreatmentMethod = 'chlorination' | 'uv' | 'ozonation' | 'filtration' | 'reverse_osmosis' | 'boiling' | 'activated_carbon' | 'ion_exchange';

// Measurement interfaces
interface WaterQualityReading {
  id: string;
  sampleId: string;
  stationId: string;
  locationId: string;
  source: WaterSource;
  timestamp: Date;
  parameters: WaterParameter[];
  overallQuality: 'excellent' | 'good' | 'acceptable' | 'poor' | 'unsafe';
  qualityScore: number;
  contaminantsDetected: ContaminantDetection[];
  isCompliant: boolean;
  violations: Violation[];
  temperature: number;
  turbidity: number;
  ph: number;
  dissolvedOxygen: number;
  conductivity: number;
  rawData: Record<string, number>;
  collectedBy: string;
  analyzedAt: Date;
  notes: string;
}

interface WaterParameter {
  parameter: string;
  value: number;
  unit: string;
  mcl: number; // Maximum Contaminant Level
  mclg?: number; // MCL Goal
  percentOfLimit: number;
  isExceedance: boolean;
  category: 'physical' | 'chemical' | 'biological' | 'radiological';
  healthRisk: 'none' | 'low' | 'moderate' | 'high' | 'immediate';
}

interface ContaminantDetection {
  id: string;
  contaminant: string;
  type: ContaminantType;
  concentration: number;
  unit: string;
  detectionLimit: number;
  regulatoryLimit: number;
  isAboveLimit: boolean;
  potentialSources: string[];
  healthEffects: string[];
  treatmentOptions: TreatmentMethod[];
}

interface Violation {
  id: string;
  parameter: string;
  value: number;
  limit: number;
  exceedancePercent: number;
  regulation: string;
  severity: 'tier1' | 'tier2' | 'tier3';
  requiredActions: string[];
  notificationDeadline: Date;
}

// Monitoring interfaces
interface MonitoringStation {
  id: string;
  name: string;
  type: 'intake' | 'treatment_plant' | 'distribution' | 'consumer' | 'source' | 'effluent';
  location: {
    latitude: number;
    longitude: number;
    address: string;
    systemId: string;
    pressureZone?: string;
  };
  source: WaterSource;
  sensors: WaterSensor[];
  status: 'online' | 'offline' | 'maintenance' | 'alarm';
  capabilities: string[];
  samplingFrequency: 'continuous' | 'hourly' | 'daily' | 'weekly';
  lastSample: Date;
  nextScheduledSample: Date;
  operator: string;
  metadata: Record<string, any>;
}

interface WaterSensor {
  id: string;
  parameter: string;
  model: string;
  status: 'active' | 'calibrating' | 'offline' | 'error';
  accuracy: number;
  lastCalibration: Date;
  measurementRange: { min: number; max: number };
  alarmThresholds: { low?: number; high?: number };
}

// Alert interfaces
interface WaterAlert {
  id: string;
  type: 'contamination' | 'exceedance' | 'system_failure' | 'pressure_loss' | 'boil_water' | 'do_not_drink' | 'do_not_use';
  severity: AlertSeverity;
  contaminant?: string;
  contaminantType?: ContaminantType;
  title: string;
  message: string;
  affectedAreas: string[];
  affectedPopulation: number;
  affectedConnections: number;
  detectedValue?: number;
  safeLimit?: number;
  healthRisks: string[];
  protectiveActions: string[];
  alternativeWaterSources: AlternativeSource[];
  expectedDuration?: number;
  startTime: Date;
  expectedResolution?: Date;
  actualResolution?: Date;
  isActive: boolean;
  issuedBy: string;
  publicNotificationSent: boolean;
  regulatoryNotificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AlternativeSource {
  type: 'bottled' | 'tanker' | 'distribution_point' | 'neighboring_system';
  location?: { address: string; latitude: number; longitude: number };
  availability: string;
  capacity?: number;
  cost?: string;
  instructions: string;
}

// Contamination event interfaces
interface ContaminationEvent {
  id: string;
  name: string;
  type: ContaminantType;
  contaminants: string[];
  incidentId?: string;
  startTime: Date;
  detectionTime: Date;
  endTime?: Date;
  isActive: boolean;
  sourceIdentified: boolean;
  source?: ContaminationSource;
  affectedInfrastructure: string[];
  spreadPattern: SpreadPattern;
  responseActions: ResponseAction[];
  timeline: { timestamp: Date; event: string; details?: string }[];
  status: 'investigating' | 'contained' | 'remediation' | 'resolved' | 'monitoring';
}

interface ContaminationSource {
  id: string;
  type: 'point' | 'nonpoint' | 'intrusion' | 'backflow' | 'cross_connection' | 'natural';
  description: string;
  location?: { latitude: number; longitude: number; address?: string };
  confirmedAt?: Date;
  evidences: string[];
  responsibleParty?: string;
}

interface SpreadPattern {
  modelType: 'hydraulic' | 'tracer' | 'statistical';
  affectedNodes: string[];
  frontLocation?: { latitude: number; longitude: number };
  spreadRate?: number;
  predictedAffectedAreas: { time: Date; areas: string[] }[];
  dilutionFactor?: number;
}

interface ResponseAction {
  id: string;
  action: string;
  category: 'isolation' | 'flushing' | 'treatment' | 'notification' | 'sampling' | 'repair';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

// Treatment interfaces
interface TreatmentRecommendation {
  id: string;
  eventId?: string;
  contaminant: string;
  concentration: number;
  targetLevel: number;
  recommendedMethods: {
    method: TreatmentMethod;
    effectiveness: number;
    requirements: string[];
    estimatedTime: string;
    cost: string;
  }[];
  householdGuidance: {
    method: string;
    instructions: string[];
    effectiveness: number;
    duration?: string;
  }[];
  doNotUseConditions?: string[];
  generatedAt: Date;
}

// Sample management interfaces
interface WaterSample {
  id: string;
  stationId: string;
  locationId: string;
  collectionTime: Date;
  collectedBy: string;
  sampleType: 'routine' | 'compliance' | 'investigation' | 'complaint' | 'follow_up';
  source: WaterSource;
  preservationMethod?: string;
  chainOfCustody: { time: Date; handler: string; action: string }[];
  status: SampleStatus;
  labId?: string;
  receivedAt?: Date;
  analyzedAt?: Date;
  results?: WaterQualityReading;
  notes: string;
}

// Distribution system interfaces
interface DistributionSystem {
  id: string;
  name: string;
  serviceArea: string[];
  populationServed: number;
  connectionsCount: number;
  sources: { sourceId: string; name: string; type: WaterSource; capacity: number }[];
  treatmentPlants: TreatmentPlant[];
  storageFacilities: StorageFacility[];
  pressureZones: PressureZone[];
  maintenanceSchedule: { date: Date; type: string; area: string }[];
  status: 'normal' | 'advisory' | 'alert' | 'emergency';
}

interface TreatmentPlant {
  id: string;
  name: string;
  location: { latitude: number; longitude: number };
  capacity: number;
  currentFlow: number;
  processes: TreatmentMethod[];
  status: 'operational' | 'reduced' | 'offline';
  residualTarget: number;
  currentResidual: number;
}

interface StorageFacility {
  id: string;
  name: string;
  type: 'elevated' | 'ground' | 'standpipe';
  capacity: number;
  currentLevel: number;
  percentFull: number;
  status: 'normal' | 'low' | 'filling' | 'draining' | 'offline';
}

interface PressureZone {
  id: string;
  name: string;
  targetPressure: number;
  currentPressure: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  connections: number;
}

// Sample data
const sampleReadings: WaterQualityReading[] = [
  {
    id: 'reading-001',
    sampleId: 'sample-001',
    stationId: 'station-001',
    locationId: 'loc-001',
    source: 'municipal',
    timestamp: new Date(),
    parameters: [
      { parameter: 'Total Coliform', value: 0, unit: 'MPN/100mL', mcl: 0, percentOfLimit: 0, isExceedance: false, category: 'biological', healthRisk: 'none' },
      { parameter: 'E. coli', value: 0, unit: 'MPN/100mL', mcl: 0, percentOfLimit: 0, isExceedance: false, category: 'biological', healthRisk: 'none' },
      { parameter: 'Lead', value: 0.002, unit: 'mg/L', mcl: 0.015, percentOfLimit: 13.3, isExceedance: false, category: 'chemical', healthRisk: 'low' },
      { parameter: 'Chlorine Residual', value: 0.8, unit: 'mg/L', mcl: 4, percentOfLimit: 20, isExceedance: false, category: 'chemical', healthRisk: 'none' }
    ],
    overallQuality: 'excellent',
    qualityScore: 95,
    contaminantsDetected: [],
    isCompliant: true,
    violations: [],
    temperature: 18.5,
    turbidity: 0.3,
    ph: 7.2,
    dissolvedOxygen: 8.5,
    conductivity: 450,
    rawData: {},
    collectedBy: 'Water Quality Technician',
    analyzedAt: new Date(),
    notes: 'Routine compliance sample'
  }
];

class WaterContaminationService {
  private static instance: WaterContaminationService;
  private readings: Map<string, WaterQualityReading> = new Map();
  private stations: Map<string, MonitoringStation> = new Map();
  private alerts: Map<string, WaterAlert> = new Map();
  private events: Map<string, ContaminationEvent> = new Map();
  private samples: Map<string, WaterSample> = new Map();
  private systems: Map<string, DistributionSystem> = new Map();
  private treatments: Map<string, TreatmentRecommendation> = new Map();

  // EPA MCL standards (simplified)
  private readonly mclStandards: Record<string, { mcl: number; unit: string; mclg?: number; healthRisk: string }> = {
    'total_coliform': { mcl: 0, unit: 'presence', healthRisk: 'Indicates potential fecal contamination' },
    'e_coli': { mcl: 0, unit: 'presence', healthRisk: 'Severe gastrointestinal illness' },
    'lead': { mcl: 0.015, unit: 'mg/L', mclg: 0, healthRisk: 'Developmental delays in children, kidney problems' },
    'copper': { mcl: 1.3, unit: 'mg/L', mclg: 1.3, healthRisk: 'Gastrointestinal distress, liver/kidney damage' },
    'arsenic': { mcl: 0.01, unit: 'mg/L', mclg: 0, healthRisk: 'Skin damage, circulatory problems, cancer' },
    'nitrate': { mcl: 10, unit: 'mg/L', mclg: 10, healthRisk: 'Blue baby syndrome in infants' },
    'fluoride': { mcl: 4, unit: 'mg/L', mclg: 4, healthRisk: 'Bone disease, mottled teeth' },
    'chlorine': { mcl: 4, unit: 'mg/L', mclg: 4, healthRisk: 'Eye/nose irritation, stomach discomfort' },
    'turbidity': { mcl: 1, unit: 'NTU', healthRisk: 'Interferes with disinfection' }
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): WaterContaminationService {
    if (!WaterContaminationService.instance) {
      WaterContaminationService.instance = new WaterContaminationService();
    }
    return WaterContaminationService.instance;
  }

  private initializeSampleData(): void {
    sampleReadings.forEach(r => this.readings.set(r.id, r));
  }

  // ==================== Reading Management ====================

  async recordReading(params: {
    sampleId: string;
    stationId: string;
    locationId: string;
    source: WaterSource;
    parameters: { parameter: string; value: number; unit: string }[];
    temperature: number;
    turbidity: number;
    ph: number;
    dissolvedOxygen?: number;
    conductivity?: number;
    collectedBy: string;
    notes?: string;
  }): Promise<WaterQualityReading> {
    // Process parameters and check against standards
    const processedParams: WaterParameter[] = params.parameters.map(p => {
      const standard = this.mclStandards[p.parameter.toLowerCase().replace(/\s+/g, '_')];
      const mcl = standard?.mcl || 1;
      const percentOfLimit = (p.value / mcl) * 100;

      return {
        parameter: p.parameter,
        value: p.value,
        unit: p.unit,
        mcl,
        mclg: standard?.mclg,
        percentOfLimit,
        isExceedance: p.value > mcl,
        category: this.categorizeParameter(p.parameter),
        healthRisk: this.assessHealthRisk(p.value, mcl)
      };
    });

    // Detect contaminants
    const contaminants = this.detectContaminants(processedParams);

    // Check for violations
    const violations = this.checkViolations(processedParams);

    // Calculate overall quality score
    const qualityScore = this.calculateQualityScore(processedParams, params.turbidity, params.ph);
    const overallQuality = this.getOverallQuality(qualityScore);

    const reading: WaterQualityReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sampleId: params.sampleId,
      stationId: params.stationId,
      locationId: params.locationId,
      source: params.source,
      timestamp: new Date(),
      parameters: processedParams,
      overallQuality,
      qualityScore,
      contaminantsDetected: contaminants,
      isCompliant: violations.length === 0,
      violations,
      temperature: params.temperature,
      turbidity: params.turbidity,
      ph: params.ph,
      dissolvedOxygen: params.dissolvedOxygen || 0,
      conductivity: params.conductivity || 0,
      rawData: {},
      collectedBy: params.collectedBy,
      analyzedAt: new Date(),
      notes: params.notes || ''
    };

    this.readings.set(reading.id, reading);

    // Check for alert conditions
    await this.checkAlertConditions(reading);

    return reading;
  }

  private categorizeParameter(parameter: string): WaterParameter['category'] {
    const paramLower = parameter.toLowerCase();
    if (paramLower.includes('coliform') || paramLower.includes('coli') || paramLower.includes('bacteria')) {
      return 'biological';
    }
    if (paramLower.includes('radium') || paramLower.includes('uranium') || paramLower.includes('radon')) {
      return 'radiological';
    }
    if (paramLower.includes('turbidity') || paramLower.includes('color') || paramLower.includes('odor')) {
      return 'physical';
    }
    return 'chemical';
  }

  private assessHealthRisk(value: number, mcl: number): WaterParameter['healthRisk'] {
    const ratio = value / mcl;
    if (ratio <= 0.5) return 'none';
    if (ratio <= 0.8) return 'low';
    if (ratio <= 1.0) return 'moderate';
    if (ratio <= 2.0) return 'high';
    return 'immediate';
  }

  private detectContaminants(params: WaterParameter[]): ContaminantDetection[] {
    const contaminants: ContaminantDetection[] = [];

    params.forEach(p => {
      if (p.isExceedance || p.healthRisk === 'high' || p.healthRisk === 'immediate') {
        contaminants.push({
          id: `contam-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          contaminant: p.parameter,
          type: this.getContaminantType(p.parameter),
          concentration: p.value,
          unit: p.unit,
          detectionLimit: p.mcl * 0.1,
          regulatoryLimit: p.mcl,
          isAboveLimit: p.isExceedance,
          potentialSources: this.getPotentialSources(p.parameter),
          healthEffects: this.getHealthEffects(p.parameter),
          treatmentOptions: this.getTreatmentOptions(p.parameter)
        });
      }
    });

    return contaminants;
  }

  private getContaminantType(parameter: string): ContaminantType {
    const paramLower = parameter.toLowerCase();
    if (paramLower.includes('coliform') || paramLower.includes('coli')) return 'bacterial';
    if (paramLower.includes('virus')) return 'viral';
    if (paramLower.includes('lead') || paramLower.includes('copper') || paramLower.includes('arsenic')) return 'heavy_metal';
    if (paramLower.includes('benzene') || paramLower.includes('pcb') || paramLower.includes('tce')) return 'organic';
    if (paramLower.includes('radium') || paramLower.includes('radon')) return 'radioactive';
    return 'chemical';
  }

  private getPotentialSources(parameter: string): string[] {
    const sources: Record<string, string[]> = {
      'lead': ['Lead service lines', 'Plumbing fixtures', 'Solder'],
      'e. coli': ['Sewage contamination', 'Animal waste', 'Septic system failure'],
      'arsenic': ['Natural deposits', 'Industrial runoff', 'Agricultural chemicals'],
      'nitrate': ['Fertilizer runoff', 'Septic systems', 'Animal feedlots'],
      'turbidity': ['Sediment disturbance', 'Construction activity', 'Storm runoff']
    };
    return sources[parameter.toLowerCase()] || ['Unknown source'];
  }

  private getHealthEffects(parameter: string): string[] {
    const standard = this.mclStandards[parameter.toLowerCase().replace(/\s+/g, '_')];
    return standard ? [standard.healthRisk] : ['Potential health effects'];
  }

  private getTreatmentOptions(parameter: string): TreatmentMethod[] {
    const treatments: Record<string, TreatmentMethod[]> = {
      'lead': ['reverse_osmosis', 'filtration', 'ion_exchange'],
      'bacteria': ['chlorination', 'uv', 'boiling'],
      'turbidity': ['filtration', 'activated_carbon'],
      'arsenic': ['reverse_osmosis', 'ion_exchange', 'activated_carbon'],
      'organic': ['activated_carbon', 'ozonation', 'reverse_osmosis']
    };
    return treatments[parameter.toLowerCase()] || ['filtration'];
  }

  private checkViolations(params: WaterParameter[]): Violation[] {
    const violations: Violation[] = [];

    params.forEach(p => {
      if (p.isExceedance) {
        violations.push({
          id: `viol-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          parameter: p.parameter,
          value: p.value,
          limit: p.mcl,
          exceedancePercent: ((p.value - p.mcl) / p.mcl) * 100,
          regulation: 'EPA SDWA',
          severity: p.healthRisk === 'immediate' ? 'tier1' : p.healthRisk === 'high' ? 'tier2' : 'tier3',
          requiredActions: this.getRequiredActions(p.parameter, p.healthRisk),
          notificationDeadline: new Date(Date.now() + (p.healthRisk === 'immediate' ? 24 : 72) * 60 * 60 * 1000)
        });
      }
    });

    return violations;
  }

  private getRequiredActions(parameter: string, risk: WaterParameter['healthRisk']): string[] {
    const actions: string[] = ['Notify regulatory agency'];

    if (risk === 'immediate' || risk === 'high') {
      actions.push('Issue public notification');
      actions.push('Implement corrective action');
    }

    if (parameter.toLowerCase().includes('coliform') || parameter.toLowerCase().includes('coli')) {
      actions.push('Collect confirmation samples');
      actions.push('Increase disinfectant residual');
    }

    return actions;
  }

  private calculateQualityScore(params: WaterParameter[], turbidity: number, ph: number): number {
    let score = 100;

    // Deduct for parameter exceedances
    params.forEach(p => {
      if (p.isExceedance) score -= 30;
      else if (p.percentOfLimit > 80) score -= 10;
      else if (p.percentOfLimit > 50) score -= 5;
    });

    // Deduct for turbidity
    if (turbidity > 1) score -= 20;
    else if (turbidity > 0.5) score -= 5;

    // Deduct for pH outside range
    if (ph < 6.5 || ph > 8.5) score -= 10;
    else if (ph < 7.0 || ph > 8.0) score -= 5;

    return Math.max(0, score);
  }

  private getOverallQuality(score: number): WaterQualityReading['overallQuality'] {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'acceptable';
    if (score >= 30) return 'poor';
    return 'unsafe';
  }

  async getReading(readingId: string): Promise<WaterQualityReading | null> {
    return this.readings.get(readingId) || null;
  }

  async searchReadings(query: {
    stationId?: string;
    locationId?: string;
    source?: WaterSource;
    qualityLevel?: WaterQualityReading['overallQuality'];
    hasViolations?: boolean;
    dateRange?: { start: Date; end: Date };
    limit?: number;
    offset?: number;
  }): Promise<{ readings: WaterQualityReading[]; total: number }> {
    let readings = Array.from(this.readings.values());

    if (query.stationId) {
      readings = readings.filter(r => r.stationId === query.stationId);
    }

    if (query.locationId) {
      readings = readings.filter(r => r.locationId === query.locationId);
    }

    if (query.source) {
      readings = readings.filter(r => r.source === query.source);
    }

    if (query.qualityLevel) {
      readings = readings.filter(r => r.overallQuality === query.qualityLevel);
    }

    if (query.hasViolations !== undefined) {
      readings = readings.filter(r => query.hasViolations ? r.violations.length > 0 : r.violations.length === 0);
    }

    if (query.dateRange) {
      readings = readings.filter(r =>
        r.timestamp >= query.dateRange!.start && r.timestamp <= query.dateRange!.end
      );
    }

    readings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = readings.length;
    const offset = query.offset || 0;
    const limit = query.limit || 50;

    return {
      readings: readings.slice(offset, offset + limit),
      total
    };
  }

  // ==================== Alert Management ====================

  private async checkAlertConditions(reading: WaterQualityReading): Promise<void> {
    if (!reading.isCompliant || reading.overallQuality === 'unsafe') {
      const severity = this.determineSeverity(reading);
      await this.createAlert({
        type: reading.violations.some(v => v.severity === 'tier1') ? 'do_not_drink' : 'contamination',
        severity,
        contaminant: reading.contaminantsDetected[0]?.contaminant,
        contaminantType: reading.contaminantsDetected[0]?.type,
        affectedAreas: [reading.locationId],
        detectedValue: reading.contaminantsDetected[0]?.concentration,
        safeLimit: reading.contaminantsDetected[0]?.regulatoryLimit
      });
    }
  }

  private determineSeverity(reading: WaterQualityReading): AlertSeverity {
    if (reading.violations.some(v => v.severity === 'tier1')) return 'emergency';
    if (reading.violations.some(v => v.severity === 'tier2')) return 'warning';
    if (reading.violations.length > 0) return 'watch';
    if (reading.overallQuality === 'poor') return 'advisory';
    return 'advisory';
  }

  async createAlert(params: {
    type: WaterAlert['type'];
    severity: AlertSeverity;
    contaminant?: string;
    contaminantType?: ContaminantType;
    affectedAreas: string[];
    detectedValue?: number;
    safeLimit?: number;
    expectedDuration?: number;
  }): Promise<WaterAlert> {
    const alternativeSources = this.getAlternativeSources(params.severity);
    const protectiveActions = this.getProtectiveActions(params.type, params.severity);
    const healthRisks = params.contaminant ? this.getHealthEffects(params.contaminant) : [];

    const alert: WaterAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      severity: params.severity,
      contaminant: params.contaminant,
      contaminantType: params.contaminantType,
      title: this.generateAlertTitle(params.type, params.severity, params.contaminant),
      message: this.generateAlertMessage(params.type, params.severity, params.contaminant),
      affectedAreas: params.affectedAreas,
      affectedPopulation: params.affectedAreas.length * 10000, // Estimate
      affectedConnections: params.affectedAreas.length * 3000,
      detectedValue: params.detectedValue,
      safeLimit: params.safeLimit,
      healthRisks,
      protectiveActions,
      alternativeWaterSources: alternativeSources,
      expectedDuration: params.expectedDuration,
      startTime: new Date(),
      expectedResolution: params.expectedDuration
        ? new Date(Date.now() + params.expectedDuration * 60 * 60 * 1000)
        : undefined,
      isActive: true,
      issuedBy: 'Water Quality Management System',
      publicNotificationSent: false,
      regulatoryNotificationSent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private generateAlertTitle(type: WaterAlert['type'], severity: AlertSeverity, contaminant?: string): string {
    const severityText = severity.toUpperCase().replace('_', ' ');
    const contaminantText = contaminant ? ` - ${contaminant}` : '';

    switch (type) {
      case 'boil_water': return `BOIL WATER NOTICE${contaminantText}`;
      case 'do_not_drink': return `DO NOT DRINK WATER${contaminantText}`;
      case 'do_not_use': return `DO NOT USE WATER${contaminantText}`;
      default: return `WATER QUALITY ${severityText}${contaminantText}`;
    }
  }

  private generateAlertMessage(type: WaterAlert['type'], severity: AlertSeverity, contaminant?: string): string {
    switch (type) {
      case 'boil_water':
        return 'Due to conditions that may pose a health risk, all water used for drinking, cooking, or preparing food should be boiled for at least one minute before use.';
      case 'do_not_drink':
        return `Elevated levels of ${contaminant || 'contaminants'} have been detected. Do not drink the water or use it for cooking. Boiling will NOT remove this contaminant.`;
      case 'do_not_use':
        return 'Do not use this water for any purpose including bathing, washing, or cleaning. Avoid all contact with the water.';
      default:
        return `Water quality issues have been detected in your area. Please follow the protective actions provided.`;
    }
  }

  private getProtectiveActions(type: WaterAlert['type'], severity: AlertSeverity): string[] {
    const actions: string[] = [];

    switch (type) {
      case 'boil_water':
        actions.push('Bring water to a rolling boil for at least 1 minute');
        actions.push('Let water cool before drinking');
        actions.push('Use boiled or bottled water for drinking, cooking, brushing teeth');
        actions.push('Bathing is safe but avoid swallowing water');
        break;
      case 'do_not_drink':
        actions.push('Use only bottled water for drinking and cooking');
        actions.push('Do not boil water - it will not remove the contamination');
        actions.push('Bathing may be safe but avoid swallowing water');
        actions.push('Check with authorities before using for other purposes');
        break;
      case 'do_not_use':
        actions.push('Do not use water for any purpose');
        actions.push('Use only bottled water');
        actions.push('Avoid showering or bathing with contaminated water');
        actions.push('Evacuate if necessary');
        break;
    }

    if (severity === 'emergency') {
      actions.unshift('This is an emergency - take immediate action');
    }

    return actions;
  }

  private getAlternativeSources(severity: AlertSeverity): AlternativeSource[] {
    const sources: AlternativeSource[] = [
      {
        type: 'bottled',
        availability: 'Available at local stores',
        instructions: 'Use commercially bottled water for drinking and cooking'
      }
    ];

    if (severity === 'warning' || severity === 'emergency' || severity === 'do_not_use') {
      sources.push({
        type: 'distribution_point',
        availability: 'Emergency distribution points will be established',
        instructions: 'Check local emergency management for locations and times'
      });
      sources.push({
        type: 'tanker',
        availability: 'Water tankers dispatched to affected areas',
        instructions: 'Bring clean containers to fill'
      });
    }

    return sources;
  }

  async getActiveAlerts(locationId?: string): Promise<WaterAlert[]> {
    let alerts = Array.from(this.alerts.values()).filter(a => a.isActive);

    if (locationId) {
      alerts = alerts.filter(a => a.affectedAreas.includes(locationId));
    }

    const severityOrder: Record<AlertSeverity, number> = {
      do_not_use: 0, emergency: 1, do_not_drink: 2, warning: 3, watch: 4, advisory: 5
    };

    return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }

  async resolveAlert(alertId: string): Promise<WaterAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.isActive = false;
    alert.actualResolution = new Date();
    alert.updatedAt = new Date();

    this.alerts.set(alertId, alert);
    return alert;
  }

  // ==================== Contamination Event Management ====================

  async createContaminationEvent(params: {
    name: string;
    type: ContaminantType;
    contaminants: string[];
    incidentId?: string;
    affectedInfrastructure: string[];
    sourceInfo?: Partial<ContaminationSource>;
  }): Promise<ContaminationEvent> {
    const event: ContaminationEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      contaminants: params.contaminants,
      incidentId: params.incidentId,
      startTime: new Date(),
      detectionTime: new Date(),
      isActive: true,
      sourceIdentified: !!params.sourceInfo,
      source: params.sourceInfo ? {
        id: `source-${Date.now()}`,
        type: params.sourceInfo.type || 'unknown' as any,
        description: params.sourceInfo.description || 'Under investigation',
        location: params.sourceInfo.location,
        evidences: []
      } : undefined,
      affectedInfrastructure: params.affectedInfrastructure,
      spreadPattern: {
        modelType: 'hydraulic',
        affectedNodes: params.affectedInfrastructure,
        predictedAffectedAreas: []
      },
      responseActions: [],
      timeline: [
        { timestamp: new Date(), event: 'Event created', details: 'Contamination event initiated' }
      ],
      status: 'investigating'
    };

    this.events.set(event.id, event);
    return event;
  }

  async addResponseAction(eventId: string, action: {
    action: string;
    category: ResponseAction['category'];
    priority: ResponseAction['priority'];
    assignedTo: string;
  }): Promise<ResponseAction> {
    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event not found: ${eventId}`);

    const responseAction: ResponseAction = {
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      action: action.action,
      category: action.category,
      priority: action.priority,
      status: 'pending',
      assignedTo: action.assignedTo
    };

    event.responseActions.push(responseAction);
    event.timeline.push({
      timestamp: new Date(),
      event: 'Response action added',
      details: action.action
    });

    this.events.set(eventId, event);
    return responseAction;
  }

  async updateEventStatus(eventId: string, status: ContaminationEvent['status']): Promise<ContaminationEvent> {
    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event not found: ${eventId}`);

    event.status = status;
    event.timeline.push({
      timestamp: new Date(),
      event: 'Status updated',
      details: `Status changed to ${status}`
    });

    if (status === 'resolved') {
      event.isActive = false;
      event.endTime = new Date();
    }

    this.events.set(eventId, event);
    return event;
  }

  // ==================== Treatment Recommendations ====================

  async getTreatmentRecommendation(contaminant: string, concentration: number): Promise<TreatmentRecommendation> {
    const standard = this.mclStandards[contaminant.toLowerCase().replace(/\s+/g, '_')];
    const targetLevel = standard?.mcl || 0;
    const treatmentMethods = this.getTreatmentOptions(contaminant);

    const recommendation: TreatmentRecommendation = {
      id: `treat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contaminant,
      concentration,
      targetLevel,
      recommendedMethods: treatmentMethods.map(method => ({
        method,
        effectiveness: this.getTreatmentEffectiveness(method, contaminant),
        requirements: this.getTreatmentRequirements(method),
        estimatedTime: this.getTreatmentTime(method),
        cost: this.getTreatmentCost(method)
      })),
      householdGuidance: this.getHouseholdGuidance(contaminant, concentration),
      doNotUseConditions: concentration > targetLevel * 10
        ? ['Contamination too high for household treatment']
        : undefined,
      generatedAt: new Date()
    };

    this.treatments.set(recommendation.id, recommendation);
    return recommendation;
  }

  private getTreatmentEffectiveness(method: TreatmentMethod, contaminant: string): number {
    const effectiveness: Record<TreatmentMethod, Record<string, number>> = {
      chlorination: { bacteria: 0.99, virus: 0.95, chemical: 0.1 },
      uv: { bacteria: 0.999, virus: 0.99, chemical: 0.05 },
      ozonation: { bacteria: 0.999, virus: 0.999, chemical: 0.7 },
      filtration: { bacteria: 0.9, virus: 0.5, chemical: 0.3, particulate: 0.99 },
      reverse_osmosis: { bacteria: 0.99, virus: 0.99, chemical: 0.95, heavy_metal: 0.99 },
      boiling: { bacteria: 0.999, virus: 0.99, chemical: 0.1 },
      activated_carbon: { chemical: 0.9, organic: 0.95 },
      ion_exchange: { heavy_metal: 0.95, chemical: 0.8 }
    };

    const contaminantType = this.getContaminantType(contaminant).toString();
    return effectiveness[method]?.[contaminantType] || 0.5;
  }

  private getTreatmentRequirements(method: TreatmentMethod): string[] {
    const requirements: Record<TreatmentMethod, string[]> = {
      chlorination: ['Chlorine supply', 'Contact time', 'pH monitoring'],
      uv: ['UV reactor', 'Electricity', 'Pre-filtration'],
      ozonation: ['Ozone generator', 'Contact chamber', 'Residual monitoring'],
      filtration: ['Filter media', 'Regular replacement', 'Pre-treatment'],
      reverse_osmosis: ['RO membrane', 'Pre-treatment', 'Energy supply'],
      boiling: ['Heat source', 'Clean container', 'Cooling time'],
      activated_carbon: ['Carbon media', 'Regular replacement'],
      ion_exchange: ['Resin', 'Regeneration chemicals']
    };
    return requirements[method] || [];
  }

  private getTreatmentTime(method: TreatmentMethod): string {
    const times: Record<TreatmentMethod, string> = {
      chlorination: '30-60 minutes contact time',
      uv: 'Seconds (flow-through)',
      ozonation: '15-30 minutes',
      filtration: 'Continuous',
      reverse_osmosis: 'Continuous',
      boiling: '1 minute rolling boil + cooling',
      activated_carbon: 'Continuous',
      ion_exchange: 'Continuous'
    };
    return times[method];
  }

  private getTreatmentCost(method: TreatmentMethod): string {
    const costs: Record<TreatmentMethod, string> = {
      chlorination: 'Low',
      uv: 'Medium',
      ozonation: 'High',
      filtration: 'Low-Medium',
      reverse_osmosis: 'Medium-High',
      boiling: 'Low (fuel cost)',
      activated_carbon: 'Low-Medium',
      ion_exchange: 'Medium'
    };
    return costs[method];
  }

  private getHouseholdGuidance(contaminant: string, concentration: number): TreatmentRecommendation['householdGuidance'] {
    const guidance: TreatmentRecommendation['householdGuidance'] = [];

    if (contaminant.toLowerCase().includes('coliform') || contaminant.toLowerCase().includes('bacteria')) {
      guidance.push({
        method: 'Boiling',
        instructions: [
          'Bring water to a rolling boil',
          'Maintain boil for at least 1 minute',
          'Let cool before drinking',
          'Store in clean container'
        ],
        effectiveness: 0.999,
        duration: '5-10 minutes including cooling'
      });
    }

    guidance.push({
      method: 'Use bottled water',
      instructions: [
        'Purchase commercially bottled water',
        'Check seal is intact',
        'Store properly'
      ],
      effectiveness: 1.0
    });

    return guidance;
  }

  // ==================== Statistics ====================

  async getStatistics(locationId?: string): Promise<{
    totalReadings: number;
    complianceRate: number;
    qualityDistribution: Record<WaterQualityReading['overallQuality'], number>;
    activeAlerts: number;
    activeEvents: number;
    commonViolations: { parameter: string; count: number }[];
    avgQualityScore: number;
  }> {
    let readings = Array.from(this.readings.values());

    if (locationId) {
      readings = readings.filter(r => r.locationId === locationId);
    }

    const qualityDistribution: Record<WaterQualityReading['overallQuality'], number> = {
      excellent: 0, good: 0, acceptable: 0, poor: 0, unsafe: 0
    };

    const violationCounts: Record<string, number> = {};
    let compliantCount = 0;
    let totalScore = 0;

    readings.forEach(r => {
      qualityDistribution[r.overallQuality]++;
      if (r.isCompliant) compliantCount++;
      totalScore += r.qualityScore;

      r.violations.forEach(v => {
        violationCounts[v.parameter] = (violationCounts[v.parameter] || 0) + 1;
      });
    });

    const commonViolations = Object.entries(violationCounts)
      .map(([parameter, count]) => ({ parameter, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalReadings: readings.length,
      complianceRate: readings.length > 0 ? (compliantCount / readings.length) * 100 : 100,
      qualityDistribution,
      activeAlerts: Array.from(this.alerts.values()).filter(a => a.isActive).length,
      activeEvents: Array.from(this.events.values()).filter(e => e.isActive).length,
      commonViolations,
      avgQualityScore: readings.length > 0 ? totalScore / readings.length : 100
    };
  }
}

export const waterContaminationService = WaterContaminationService.getInstance();
export default WaterContaminationService;

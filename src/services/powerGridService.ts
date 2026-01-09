/**
 * Power Grid Service - Issue #145 Implementation
 * 
 * Provides comprehensive power grid monitoring and management for disaster
 * response including outage tracking, load management, restoration coordination,
 * and critical facility prioritization.
 */

// Type definitions
type GridStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'blackout';
type OutageType = 'planned' | 'unplanned' | 'emergency' | 'rolling_blackout';
type OutageCause = 'weather' | 'equipment_failure' | 'vegetation' | 'vehicle_accident' | 'animal' | 'overload' | 'cyber_attack' | 'unknown';
type FacilityPriority = 'critical' | 'high' | 'medium' | 'low';
type RestorationPhase = 'assessment' | 'isolation' | 'repair' | 'testing' | 'energization' | 'verification';
type VoltageLevel = 'transmission' | 'sub_transmission' | 'distribution' | 'secondary';

// Grid infrastructure interfaces
interface GridZone {
  id: string;
  name: string;
  region: string;
  status: GridStatus;
  voltageLevel: VoltageLevel;
  substations: string[];
  feeders: string[];
  boundingBox: {
    northeast: { lat: number; lon: number };
    southwest: { lat: number; lon: number };
  };
  metrics: GridMetrics;
  criticalFacilities: string[];
  population: number;
  lastUpdated: Date;
}

interface GridMetrics {
  totalCustomers: number;
  customersWithPower: number;
  customersWithoutPower: number;
  percentServed: number;
  loadMW: number;
  capacityMW: number;
  utilizationPercent: number;
  frequency: number; // Hz
  voltage: number; // kV
  powerFactor: number;
}

interface Substation {
  id: string;
  name: string;
  type: 'transmission' | 'distribution' | 'switching';
  zoneId: string;
  location: {
    address: string;
    coordinates: { lat: number; lon: number };
  };
  voltageIn: number;
  voltageOut: number;
  capacity: number; // MVA
  currentLoad: number; // MVA
  status: 'operational' | 'limited' | 'offline' | 'maintenance';
  transformers: Transformer[];
  feedersOut: string[];
  backupPower: {
    available: boolean;
    type?: 'generator' | 'battery' | 'ups';
    capacity?: number;
    runtime?: number; // hours
  };
  lastInspection: Date;
  alerts: string[];
}

interface Transformer {
  id: string;
  name: string;
  type: 'power' | 'distribution' | 'instrument';
  ratingMVA: number;
  currentLoadMVA: number;
  voltageRatio: string;
  temperature: number;
  oilLevel: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  age: number;
  lastMaintenance: Date;
}

interface Feeder {
  id: string;
  name: string;
  substationId: string;
  zoneId: string;
  voltage: number;
  length: number; // km
  type: 'overhead' | 'underground' | 'mixed';
  customersServed: number;
  currentLoad: number;
  capacity: number;
  status: 'energized' | 'de_energized' | 'faulted' | 'maintenance';
  automatedSwitches: number;
  sectionalizers: SectionalizerDevice[];
  criticalLoads: CriticalLoad[];
}

interface SectionalizerDevice {
  id: string;
  name: string;
  type: 'recloser' | 'sectionalizer' | 'switch';
  location: { lat: number; lon: number };
  status: 'closed' | 'open' | 'fault';
  automated: boolean;
  lastOperation: Date;
}

interface CriticalLoad {
  id: string;
  name: string;
  type: 'hospital' | 'emergency_services' | 'water_treatment' | 'shelter' | 'communication' | 'government' | 'other';
  priority: FacilityPriority;
  loadKW: number;
  backupPower: boolean;
  backupRuntime?: number;
  contactName: string;
  contactPhone: string;
}

// Outage interfaces
interface PowerOutage {
  id: string;
  incidentId?: string;
  type: OutageType;
  cause: OutageCause;
  causeDetails?: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  affectedArea: {
    zones: string[];
    substations: string[];
    feeders: string[];
    boundingBox?: {
      northeast: { lat: number; lon: number };
      southwest: { lat: number; lon: number };
    };
  };
  impact: OutageImpact;
  timeline: OutageEvent[];
  crews: CrewAssignment[];
  restoration: RestorationPlan;
  status: 'active' | 'restoring' | 'restored' | 'closed';
  reportedAt: Date;
  startTime: Date;
  estimatedRestoration?: Date;
  actualRestoration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface OutageImpact {
  customersAffected: number;
  criticalFacilitiesAffected: CriticalLoad[];
  estimatedLoadLossMW: number;
  estimatedDamage?: number;
  economicImpactPerHour?: number;
  populationAffected: number;
}

interface OutageEvent {
  id: string;
  timestamp: Date;
  type: 'reported' | 'confirmed' | 'crew_dispatched' | 'cause_identified' | 'repair_started' | 'partial_restoration' | 'full_restoration' | 'closed' | 'update';
  description: string;
  actor: string;
  details?: Record<string, any>;
}

interface CrewAssignment {
  id: string;
  crewId: string;
  crewName: string;
  crewSize: number;
  specialty: 'line' | 'substation' | 'underground' | 'tree' | 'general';
  assignedAt: Date;
  dispatchedAt?: Date;
  arrivedAt?: Date;
  completedAt?: Date;
  status: 'assigned' | 'en_route' | 'on_site' | 'working' | 'completed' | 'reassigned';
  location?: { lat: number; lon: number };
  equipment: string[];
  notes: string;
}

interface RestorationPlan {
  phases: RestorationPhaseDetail[];
  currentPhase: RestorationPhase;
  progress: number; // percentage
  estimatedCompletion: Date;
  prioritySequence: string[]; // feeder IDs in restoration order
  resourcesRequired: ResourceRequirement[];
  constraints: string[];
}

interface RestorationPhaseDetail {
  phase: RestorationPhase;
  description: string;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
}

interface ResourceRequirement {
  type: 'crew' | 'equipment' | 'material';
  description: string;
  quantity: number;
  available: number;
  status: 'available' | 'en_route' | 'shortage';
}

// Load management interfaces
interface LoadSheddingPlan {
  id: string;
  name: string;
  trigger: 'manual' | 'automatic' | 'emergency';
  stages: LoadSheddingStage[];
  currentStage: number;
  status: 'standby' | 'active' | 'completed';
  activatedAt?: Date;
  deactivatedAt?: Date;
  createdBy: string;
  approvedBy?: string;
}

interface LoadSheddingStage {
  stage: number;
  loadReductionMW: number;
  affectedFeeders: string[];
  customersAffected: number;
  criticalExempt: boolean;
  rotationMinutes?: number;
  activationThreshold?: {
    frequency?: number;
    voltage?: number;
    load?: number;
  };
}

// Report interfaces
interface GridReport {
  id: string;
  reportType: 'status' | 'outage' | 'restoration' | 'performance';
  period: { start: Date; end: Date };
  generatedAt: Date;
  generatedBy: string;
  summary: GridReportSummary;
  outages: PowerOutage[];
  metrics: GridPerformanceMetrics;
  recommendations: string[];
}

interface GridReportSummary {
  totalOutages: number;
  totalCustomerMinutesInterrupted: number;
  saidi: number; // System Average Interruption Duration Index
  saifi: number; // System Average Interruption Frequency Index
  caidi: number; // Customer Average Interruption Duration Index
  averageRestorationTime: number; // minutes
  outagesByType: Record<OutageType, number>;
  outagesByCause: Record<OutageCause, number>;
}

interface GridPerformanceMetrics {
  systemReliability: number;
  peakLoad: number;
  averageLoad: number;
  capacityUtilization: number;
  voltageCompliance: number;
  frequencyDeviation: number;
  lossPercentage: number;
}

// Sample data
const sampleZones: GridZone[] = [
  {
    id: 'zone-001',
    name: 'Downtown District',
    region: 'Metro City',
    status: 'operational',
    voltageLevel: 'distribution',
    substations: ['sub-001', 'sub-002'],
    feeders: ['feeder-001', 'feeder-002', 'feeder-003'],
    boundingBox: {
      northeast: { lat: 34.06, lon: -118.23 },
      southwest: { lat: 34.04, lon: -118.26 }
    },
    metrics: {
      totalCustomers: 45000,
      customersWithPower: 45000,
      customersWithoutPower: 0,
      percentServed: 100,
      loadMW: 120,
      capacityMW: 180,
      utilizationPercent: 66.7,
      frequency: 60.0,
      voltage: 12.5,
      powerFactor: 0.95
    },
    criticalFacilities: ['hospital-001', 'fire-station-001'],
    population: 125000,
    lastUpdated: new Date()
  }
];

const sampleOutages: PowerOutage[] = [
  {
    id: 'outage-001',
    incidentId: 'incident-001',
    type: 'unplanned',
    cause: 'weather',
    causeDetails: 'High winds caused tree to fall on power lines',
    severity: 'moderate',
    affectedArea: {
      zones: ['zone-002'],
      substations: [],
      feeders: ['feeder-004']
    },
    impact: {
      customersAffected: 2500,
      criticalFacilitiesAffected: [],
      estimatedLoadLossMW: 8,
      populationAffected: 6000
    },
    timeline: [
      { id: 'event-001', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'reported', description: 'Multiple customer reports of outage', actor: 'System' },
      { id: 'event-002', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), type: 'crew_dispatched', description: 'Line crew dispatched', actor: 'Dispatch' }
    ],
    crews: [],
    restoration: {
      phases: [],
      currentPhase: 'repair',
      progress: 40,
      estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000),
      prioritySequence: ['feeder-004'],
      resourcesRequired: [],
      constraints: []
    },
    status: 'restoring',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    startTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    estimatedRestoration: new Date(Date.now() + 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class PowerGridService {
  private static instance: PowerGridService;
  private zones: Map<string, GridZone> = new Map();
  private substations: Map<string, Substation> = new Map();
  private feeders: Map<string, Feeder> = new Map();
  private outages: Map<string, PowerOutage> = new Map();
  private loadSheddingPlans: Map<string, LoadSheddingPlan> = new Map();
  private reports: Map<string, GridReport> = new Map();
  private criticalLoads: Map<string, CriticalLoad> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): PowerGridService {
    if (!PowerGridService.instance) {
      PowerGridService.instance = new PowerGridService();
    }
    return PowerGridService.instance;
  }

  private initializeSampleData(): void {
    sampleZones.forEach(z => this.zones.set(z.id, z));
    sampleOutages.forEach(o => this.outages.set(o.id, o));
  }

  // ==================== Zone Management ====================

  async createZone(params: Omit<GridZone, 'id' | 'lastUpdated'>): Promise<GridZone> {
    const zone: GridZone = {
      ...params,
      id: `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date()
    };

    this.zones.set(zone.id, zone);
    return zone;
  }

  async getZone(zoneId: string): Promise<GridZone | null> {
    return this.zones.get(zoneId) || null;
  }

  async getZones(params?: { status?: GridStatus; region?: string }): Promise<GridZone[]> {
    let zones = Array.from(this.zones.values());

    if (params?.status) {
      zones = zones.filter(z => z.status === params.status);
    }

    if (params?.region) {
      zones = zones.filter(z => z.region === params.region);
    }

    return zones;
  }

  async updateZoneMetrics(zoneId: string, metrics: Partial<GridMetrics>): Promise<GridZone> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    Object.assign(zone.metrics, metrics);
    zone.lastUpdated = new Date();

    // Update zone status based on metrics
    if (zone.metrics.percentServed < 50) {
      zone.status = 'major_outage';
    } else if (zone.metrics.percentServed < 80) {
      zone.status = 'partial_outage';
    } else if (zone.metrics.percentServed < 95) {
      zone.status = 'degraded';
    } else {
      zone.status = 'operational';
    }

    return zone;
  }

  // ==================== Substation Management ====================

  async createSubstation(params: Omit<Substation, 'id' | 'alerts'>): Promise<Substation> {
    const substation: Substation = {
      ...params,
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      alerts: []
    };

    this.substations.set(substation.id, substation);

    // Add to zone
    const zone = this.zones.get(params.zoneId);
    if (zone) {
      zone.substations.push(substation.id);
    }

    return substation;
  }

  async getSubstation(substationId: string): Promise<Substation | null> {
    return this.substations.get(substationId) || null;
  }

  async getSubstationsForZone(zoneId: string): Promise<Substation[]> {
    return Array.from(this.substations.values()).filter(s => s.zoneId === zoneId);
  }

  async updateSubstationLoad(substationId: string, currentLoad: number): Promise<Substation> {
    const substation = this.substations.get(substationId);
    if (!substation) throw new Error(`Substation not found: ${substationId}`);

    substation.currentLoad = currentLoad;

    // Check for overload
    if (currentLoad > substation.capacity * 0.9) {
      substation.alerts.push(`Warning: Load at ${((currentLoad / substation.capacity) * 100).toFixed(1)}% capacity`);
      substation.status = 'limited';
    }

    return substation;
  }

  // ==================== Feeder Management ====================

  async createFeeder(params: Omit<Feeder, 'id'>): Promise<Feeder> {
    const feeder: Feeder = {
      ...params,
      id: `feeder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.feeders.set(feeder.id, feeder);

    // Add to zone
    const zone = this.zones.get(params.zoneId);
    if (zone) {
      zone.feeders.push(feeder.id);
    }

    return feeder;
  }

  async getFeeder(feederId: string): Promise<Feeder | null> {
    return this.feeders.get(feederId) || null;
  }

  async updateFeederStatus(feederId: string, status: Feeder['status']): Promise<Feeder> {
    const feeder = this.feeders.get(feederId);
    if (!feeder) throw new Error(`Feeder not found: ${feederId}`);

    feeder.status = status;

    // Update zone metrics if feeder is de-energized
    if (status === 'de_energized' || status === 'faulted') {
      const zone = this.zones.get(feeder.zoneId);
      if (zone) {
        zone.metrics.customersWithoutPower += feeder.customersServed;
        zone.metrics.customersWithPower -= feeder.customersServed;
        zone.metrics.percentServed = (zone.metrics.customersWithPower / zone.metrics.totalCustomers) * 100;
        await this.updateZoneMetrics(zone.id, zone.metrics);
      }
    }

    return feeder;
  }

  // ==================== Outage Management ====================

  async reportOutage(params: {
    incidentId?: string;
    type: OutageType;
    cause: OutageCause;
    causeDetails?: string;
    affectedArea: PowerOutage['affectedArea'];
    estimatedRestoration?: Date;
    reportedBy: string;
  }): Promise<PowerOutage> {
    // Calculate impact
    let customersAffected = 0;
    let loadLoss = 0;
    const criticalAffected: CriticalLoad[] = [];

    for (const feederId of params.affectedArea.feeders) {
      const feeder = this.feeders.get(feederId);
      if (feeder) {
        customersAffected += feeder.customersServed;
        loadLoss += feeder.currentLoad;
        criticalAffected.push(...feeder.criticalLoads);
      }
    }

    const severity = customersAffected > 10000 ? 'critical' :
                     customersAffected > 5000 ? 'major' :
                     customersAffected > 1000 ? 'moderate' : 'minor';

    const outage: PowerOutage = {
      id: `outage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      type: params.type,
      cause: params.cause,
      causeDetails: params.causeDetails,
      severity,
      affectedArea: params.affectedArea,
      impact: {
        customersAffected,
        criticalFacilitiesAffected: criticalAffected,
        estimatedLoadLossMW: loadLoss / 1000,
        populationAffected: customersAffected * 2.5
      },
      timeline: [{
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        type: 'reported',
        description: `Outage reported by ${params.reportedBy}`,
        actor: params.reportedBy
      }],
      crews: [],
      restoration: {
        phases: this.createRestorationPhases(),
        currentPhase: 'assessment',
        progress: 0,
        estimatedCompletion: params.estimatedRestoration || new Date(Date.now() + 4 * 60 * 60 * 1000),
        prioritySequence: this.prioritizeFeeders(params.affectedArea.feeders),
        resourcesRequired: [],
        constraints: []
      },
      status: 'active',
      reportedAt: new Date(),
      startTime: new Date(),
      estimatedRestoration: params.estimatedRestoration,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.outages.set(outage.id, outage);

    // Update affected feeders
    for (const feederId of params.affectedArea.feeders) {
      await this.updateFeederStatus(feederId, 'faulted');
    }

    return outage;
  }

  private createRestorationPhases(): RestorationPhaseDetail[] {
    return [
      { phase: 'assessment', description: 'Assess damage and determine scope', estimatedDuration: 30, status: 'pending' },
      { phase: 'isolation', description: 'Isolate faulted section', estimatedDuration: 15, status: 'pending' },
      { phase: 'repair', description: 'Repair damaged equipment', estimatedDuration: 120, status: 'pending' },
      { phase: 'testing', description: 'Test repaired equipment', estimatedDuration: 15, status: 'pending' },
      { phase: 'energization', description: 'Re-energize feeders', estimatedDuration: 20, status: 'pending' },
      { phase: 'verification', description: 'Verify service restoration', estimatedDuration: 10, status: 'pending' }
    ];
  }

  private prioritizeFeeders(feederIds: string[]): string[] {
    return feederIds.sort((a, b) => {
      const feederA = this.feeders.get(a);
      const feederB = this.feeders.get(b);
      
      if (!feederA || !feederB) return 0;

      // Prioritize feeders with critical loads
      const criticalA = feederA.criticalLoads.filter(l => l.priority === 'critical').length;
      const criticalB = feederB.criticalLoads.filter(l => l.priority === 'critical').length;
      
      if (criticalA !== criticalB) return criticalB - criticalA;
      
      // Then by customers served
      return feederB.customersServed - feederA.customersServed;
    });
  }

  async getOutage(outageId: string): Promise<PowerOutage | null> {
    return this.outages.get(outageId) || null;
  }

  async getActiveOutages(params?: { incidentId?: string; severity?: PowerOutage['severity'][] }): Promise<PowerOutage[]> {
    let outages = Array.from(this.outages.values())
      .filter(o => o.status === 'active' || o.status === 'restoring');

    if (params?.incidentId) {
      outages = outages.filter(o => o.incidentId === params.incidentId);
    }

    if (params?.severity && params.severity.length > 0) {
      outages = outages.filter(o => params.severity!.includes(o.severity));
    }

    return outages.sort((a, b) => {
      const severityOrder = { critical: 0, major: 1, moderate: 2, minor: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  async updateOutageProgress(outageId: string, phase: RestorationPhase, progress: number, actor: string): Promise<PowerOutage> {
    const outage = this.outages.get(outageId);
    if (!outage) throw new Error(`Outage not found: ${outageId}`);

    outage.restoration.currentPhase = phase;
    outage.restoration.progress = progress;
    outage.updatedAt = new Date();

    // Update phase status
    const phaseDetail = outage.restoration.phases.find(p => p.phase === phase);
    if (phaseDetail && phaseDetail.status !== 'completed') {
      if (phaseDetail.status === 'pending') {
        phaseDetail.status = 'in_progress';
        phaseDetail.startedAt = new Date();
      }
    }

    outage.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'update',
      description: `Restoration progress: ${phase} at ${progress}%`,
      actor
    });

    // Update status based on progress
    if (progress > 0 && outage.status === 'active') {
      outage.status = 'restoring';
    }

    return outage;
  }

  async assignCrew(outageId: string, crew: Omit<CrewAssignment, 'id' | 'assignedAt' | 'status'>): Promise<CrewAssignment> {
    const outage = this.outages.get(outageId);
    if (!outage) throw new Error(`Outage not found: ${outageId}`);

    const assignment: CrewAssignment = {
      ...crew,
      id: `crew-assign-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      assignedAt: new Date(),
      status: 'assigned'
    };

    outage.crews.push(assignment);
    outage.updatedAt = new Date();

    outage.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'crew_dispatched',
      description: `Crew ${crew.crewName} assigned`,
      actor: 'Dispatch'
    });

    return assignment;
  }

  async restoreOutage(outageId: string, actor: string): Promise<PowerOutage> {
    const outage = this.outages.get(outageId);
    if (!outage) throw new Error(`Outage not found: ${outageId}`);

    outage.status = 'restored';
    outage.actualRestoration = new Date();
    outage.restoration.progress = 100;
    outage.restoration.currentPhase = 'verification';
    outage.updatedAt = new Date();

    // Mark all phases complete
    outage.restoration.phases.forEach(p => {
      p.status = 'completed';
      if (!p.completedAt) p.completedAt = new Date();
    });

    outage.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'full_restoration',
      description: 'Power restored to all affected customers',
      actor
    });

    // Restore feeders
    for (const feederId of outage.affectedArea.feeders) {
      await this.updateFeederStatus(feederId, 'energized');
    }

    return outage;
  }

  // ==================== Load Shedding ====================

  async createLoadSheddingPlan(params: {
    name: string;
    trigger: LoadSheddingPlan['trigger'];
    stages: Omit<LoadSheddingStage, 'stage'>[];
    createdBy: string;
  }): Promise<LoadSheddingPlan> {
    const plan: LoadSheddingPlan = {
      id: `shed-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      trigger: params.trigger,
      stages: params.stages.map((s, i) => ({ ...s, stage: i + 1 })),
      currentStage: 0,
      status: 'standby',
      createdBy: params.createdBy
    };

    this.loadSheddingPlans.set(plan.id, plan);
    return plan;
  }

  async activateLoadShedding(planId: string, stage: number, approvedBy: string): Promise<LoadSheddingPlan> {
    const plan = this.loadSheddingPlans.get(planId);
    if (!plan) throw new Error(`Load shedding plan not found: ${planId}`);

    plan.status = 'active';
    plan.currentStage = stage;
    plan.activatedAt = new Date();
    plan.approvedBy = approvedBy;

    // De-energize affected feeders
    const stageData = plan.stages.find(s => s.stage === stage);
    if (stageData) {
      for (const feederId of stageData.affectedFeeders) {
        await this.updateFeederStatus(feederId, 'de_energized');
      }
    }

    return plan;
  }

  async deactivateLoadShedding(planId: string): Promise<LoadSheddingPlan> {
    const plan = this.loadSheddingPlans.get(planId);
    if (!plan) throw new Error(`Load shedding plan not found: ${planId}`);

    // Re-energize all affected feeders
    for (const stage of plan.stages) {
      if (stage.stage <= plan.currentStage) {
        for (const feederId of stage.affectedFeeders) {
          await this.updateFeederStatus(feederId, 'energized');
        }
      }
    }

    plan.status = 'completed';
    plan.deactivatedAt = new Date();
    plan.currentStage = 0;

    return plan;
  }

  // ==================== Critical Loads ====================

  async registerCriticalLoad(params: Omit<CriticalLoad, 'id'>): Promise<CriticalLoad> {
    const load: CriticalLoad = {
      ...params,
      id: `critical-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.criticalLoads.set(load.id, load);
    return load;
  }

  async getCriticalLoads(priority?: FacilityPriority): Promise<CriticalLoad[]> {
    let loads = Array.from(this.criticalLoads.values());

    if (priority) {
      loads = loads.filter(l => l.priority === priority);
    }

    return loads.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async getCriticalLoadsAtRisk(): Promise<CriticalLoad[]> {
    const activeOutages = await this.getActiveOutages();
    const atRisk: CriticalLoad[] = [];

    for (const outage of activeOutages) {
      atRisk.push(...outage.impact.criticalFacilitiesAffected);
    }

    return atRisk;
  }

  // ==================== Reporting ====================

  async generateReport(params: {
    reportType: GridReport['reportType'];
    period: { start: Date; end: Date };
    generatedBy: string;
  }): Promise<GridReport> {
    const outages = Array.from(this.outages.values())
      .filter(o => o.createdAt >= params.period.start && o.createdAt <= params.period.end);

    // Calculate reliability indices
    const totalCustomers = Array.from(this.zones.values())
      .reduce((sum, z) => sum + z.metrics.totalCustomers, 0);

    let totalCMI = 0; // Customer Minutes Interrupted
    let totalInterruptions = 0;

    outages.forEach(o => {
      const duration = o.actualRestoration ? 
        (o.actualRestoration.getTime() - o.startTime.getTime()) / (60 * 1000) :
        (Date.now() - o.startTime.getTime()) / (60 * 1000);
      
      totalCMI += o.impact.customersAffected * duration;
      totalInterruptions += o.impact.customersAffected;
    });

    const saidi = totalCustomers > 0 ? totalCMI / totalCustomers : 0;
    const saifi = totalCustomers > 0 ? totalInterruptions / totalCustomers : 0;
    const caidi = totalInterruptions > 0 ? totalCMI / totalInterruptions : 0;

    const outagesByType: Record<OutageType, number> = {
      planned: 0, unplanned: 0, emergency: 0, rolling_blackout: 0
    };
    const outagesByCause: Record<OutageCause, number> = {
      weather: 0, equipment_failure: 0, vegetation: 0, vehicle_accident: 0,
      animal: 0, overload: 0, cyber_attack: 0, unknown: 0
    };

    outages.forEach(o => {
      outagesByType[o.type]++;
      outagesByCause[o.cause]++;
    });

    const report: GridReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reportType: params.reportType,
      period: params.period,
      generatedAt: new Date(),
      generatedBy: params.generatedBy,
      summary: {
        totalOutages: outages.length,
        totalCustomerMinutesInterrupted: totalCMI,
        saidi,
        saifi,
        caidi,
        averageRestorationTime: outages.length > 0 ? caidi : 0,
        outagesByType,
        outagesByCause
      },
      outages,
      metrics: {
        systemReliability: 100 - (saidi / (params.period.end.getTime() - params.period.start.getTime()) * 100 / (60 * 1000)),
        peakLoad: Math.max(...Array.from(this.zones.values()).map(z => z.metrics.loadMW)),
        averageLoad: Array.from(this.zones.values()).reduce((sum, z) => sum + z.metrics.loadMW, 0) / this.zones.size,
        capacityUtilization: Array.from(this.zones.values()).reduce((sum, z) => sum + z.metrics.utilizationPercent, 0) / this.zones.size,
        voltageCompliance: 99.5,
        frequencyDeviation: 0.01,
        lossPercentage: 4.5
      },
      recommendations: this.generateRecommendations(outages)
    };

    this.reports.set(report.id, report);
    return report;
  }

  private generateRecommendations(outages: PowerOutage[]): string[] {
    const recommendations: string[] = [];

    const weatherOutages = outages.filter(o => o.cause === 'weather').length;
    if (weatherOutages > outages.length * 0.5) {
      recommendations.push('Consider vegetation management program to reduce weather-related outages');
      recommendations.push('Evaluate undergrounding options for high-impact circuits');
    }

    const equipmentFailures = outages.filter(o => o.cause === 'equipment_failure').length;
    if (equipmentFailures > 3) {
      recommendations.push('Review maintenance schedules for aging infrastructure');
      recommendations.push('Consider predictive maintenance implementation');
    }

    const avgRestoration = outages.reduce((sum, o) => {
      if (o.actualRestoration) {
        return sum + (o.actualRestoration.getTime() - o.startTime.getTime());
      }
      return sum;
    }, 0) / outages.filter(o => o.actualRestoration).length;

    if (avgRestoration > 4 * 60 * 60 * 1000) {
      recommendations.push('Investigate ways to reduce average restoration time');
    }

    return recommendations;
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalZones: number;
    zonesWithOutages: number;
    totalCustomers: number;
    customersWithoutPower: number;
    percentServed: number;
    activeOutages: number;
    totalLoadMW: number;
    totalCapacityMW: number;
    criticalFacilitiesAtRisk: number;
  }> {
    const zones = Array.from(this.zones.values());
    const outages = incidentId ?
      (await this.getActiveOutages({ incidentId })) :
      (await this.getActiveOutages());

    const totalCustomers = zones.reduce((sum, z) => sum + z.metrics.totalCustomers, 0);
    const customersWithoutPower = zones.reduce((sum, z) => sum + z.metrics.customersWithoutPower, 0);
    const criticalAtRisk = await this.getCriticalLoadsAtRisk();

    return {
      totalZones: zones.length,
      zonesWithOutages: zones.filter(z => z.status !== 'operational').length,
      totalCustomers,
      customersWithoutPower,
      percentServed: totalCustomers > 0 ? ((totalCustomers - customersWithoutPower) / totalCustomers) * 100 : 100,
      activeOutages: outages.length,
      totalLoadMW: zones.reduce((sum, z) => sum + z.metrics.loadMW, 0),
      totalCapacityMW: zones.reduce((sum, z) => sum + z.metrics.capacityMW, 0),
      criticalFacilitiesAtRisk: criticalAtRisk.length
    };
  }
}

export const powerGridService = PowerGridService.getInstance();
export default PowerGridService;

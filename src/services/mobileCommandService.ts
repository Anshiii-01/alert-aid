/**
 * Mobile Command Service - Issue #164 Implementation
 * 
 * Provides comprehensive mobile command center management for disaster response
 * including command vehicle deployment, communications setup, field coordination,
 * resource staging, and mobile operations management.
 */

// Type definitions
type CommandUnitType = 'mobile_command' | 'communications' | 'medical' | 'hazmat' | 'decon' | 'logistics' | 'rehab' | 'technical_rescue';
type UnitStatus = 'available' | 'reserved' | 'deploying' | 'deployed' | 'operational' | 'returning' | 'maintenance' | 'out_of_service';
type DeploymentStatus = 'planned' | 'en_route' | 'staging' | 'setup' | 'operational' | 'demobilizing' | 'complete';
type CommunicationStatus = 'offline' | 'initializing' | 'online' | 'degraded' | 'failed';

// Mobile command unit interfaces
interface MobileCommandUnit {
  id: string;
  name: string;
  callSign: string;
  type: CommandUnitType;
  status: UnitStatus;
  homeStation: string;
  specifications: UnitSpecifications;
  capabilities: UnitCapabilities;
  equipment: UnitEquipment[];
  crew: CrewMember[];
  vehicle: VehicleInfo;
  communications: CommunicationsConfig;
  power: PowerConfig;
  maintenance: MaintenanceRecord;
  certifications: UnitCertification[];
  deploymentHistory: DeploymentSummary[];
  currentDeployment?: string;
  location?: UnitLocation;
  createdAt: Date;
  updatedAt: Date;
}

interface UnitSpecifications {
  manufacturer: string;
  model: string;
  year: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  axles: number;
  slideOuts?: number;
  workstations: number;
  seating: number;
  sleepingCapacity?: number;
}

interface UnitCapabilities {
  commandFunctions: string[];
  communicationSystems: string[];
  dataCapabilities: string[];
  specialFeatures: string[];
  interoperability: string[];
  maxOperationalRange: string;
  deploymentTime: string;
  autonomyDuration: string;
}

interface UnitEquipment {
  id: string;
  name: string;
  category: 'communications' | 'computers' | 'display' | 'power' | 'environmental' | 'safety' | 'office' | 'other';
  model?: string;
  serialNumber?: string;
  quantity: number;
  status: 'operational' | 'degraded' | 'failed' | 'missing';
  lastInspection?: Date;
  notes?: string;
}

interface CrewMember {
  id: string;
  name: string;
  role: 'driver' | 'operator' | 'technician' | 'commander' | 'support';
  certification: string[];
  agency: string;
  contact: { phone: string; email?: string };
  status: 'available' | 'assigned' | 'off_duty';
}

interface VehicleInfo {
  vin: string;
  licensePlate: string;
  registration: { state: string; expiration: Date };
  insurance: { provider: string; policy: string; expiration: Date };
  mileage: number;
  fuelType: string;
  fuelCapacity: number;
  currentFuel?: number;
}

interface CommunicationsConfig {
  primaryRadio: { type: string; frequencies: string[] };
  backupRadio?: { type: string; frequencies: string[] };
  satellite: { provider?: string; phoneNumber?: string; enabled: boolean };
  cellular: { carriers: string[]; hotspotCapable: boolean };
  internet: { primary: string; backup?: string; maxBandwidth: string };
  antennas: { type: string; height: string; coverage: string }[];
  interoperability: { p25: boolean; starcom: boolean; other: string[] };
}

interface PowerConfig {
  generator: { type: string; output: string; fuelType: string; runtime: string };
  shore: { voltage: string; amperage: string };
  inverter?: { output: string };
  battery: { type: string; capacity: string; backup: string };
  ups: boolean;
}

interface MaintenanceRecord {
  lastService: Date;
  nextService: Date;
  mileageAtService: number;
  serviceHistory: ServiceEntry[];
  issues: MaintenanceIssue[];
}

interface ServiceEntry {
  date: Date;
  type: 'routine' | 'repair' | 'inspection' | 'upgrade';
  description: string;
  mileage: number;
  cost: number;
  vendor: string;
}

interface MaintenanceIssue {
  id: string;
  reported: Date;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  resolution?: string;
  resolvedDate?: Date;
}

interface UnitCertification {
  type: string;
  issuedBy: string;
  issueDate: Date;
  expirationDate: Date;
  status: 'valid' | 'expiring' | 'expired';
}

interface DeploymentSummary {
  id: string;
  incidentName: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  location: string;
  hoursOperational: number;
}

interface UnitLocation {
  latitude: number;
  longitude: number;
  address?: string;
  lastUpdate: Date;
  heading?: number;
  speed?: number;
}

// Deployment interfaces
interface CommandDeployment {
  id: string;
  unitId: string;
  unitName: string;
  incidentId: string;
  incidentName: string;
  status: DeploymentStatus;
  requestedBy: string;
  requestDate: Date;
  mission: DeploymentMission;
  location: DeploymentLocation;
  schedule: DeploymentSchedule;
  crew: DeployedCrew[];
  setup: SetupChecklist;
  communications: DeployedCommunications;
  operations: CommandOperations;
  resources: DeployedResources;
  logs: DeploymentLog[];
  createdAt: Date;
  updatedAt: Date;
}

interface DeploymentMission {
  purpose: string;
  objectives: string[];
  authority: string;
  commandingOfficer: string;
  reportingTo: string;
  duration: string;
  specialInstructions?: string[];
}

interface DeploymentLocation {
  address: string;
  coordinates: [number, number];
  siteName?: string;
  accessRoutes: string[];
  parkingRequirements: string;
  utilityAccess: { power: boolean; water: boolean; sewer: boolean };
  securityRequirements?: string[];
}

interface DeploymentSchedule {
  requestedArrival: Date;
  actualArrival?: Date;
  operationalBy?: Date;
  plannedDemobilization?: Date;
  actualDemobilization?: Date;
  shifts: ShiftSchedule[];
}

interface ShiftSchedule {
  shiftNumber: number;
  startTime: Date;
  endTime: Date;
  personnel: string[];
  supervisor: string;
}

interface DeployedCrew {
  id: string;
  name: string;
  role: string;
  agency: string;
  shift: number;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'en_route' | 'on_site' | 'off_site' | 'departed';
}

interface SetupChecklist {
  items: ChecklistItem[];
  completedBy?: string;
  completedAt?: Date;
  notes?: string;
}

interface ChecklistItem {
  id: string;
  category: 'positioning' | 'power' | 'communications' | 'equipment' | 'safety' | 'connectivity';
  item: string;
  required: boolean;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
  notes?: string;
}

interface DeployedCommunications {
  status: CommunicationStatus;
  primaryChannel: string;
  tacticalChannels: string[];
  phoneLines: { number: string; purpose: string }[];
  internetStatus: 'connected' | 'limited' | 'disconnected';
  bandwidth?: string;
  satelliteActive: boolean;
  interopChannels: string[];
  issues: { time: Date; issue: string; resolution?: string }[];
}

interface CommandOperations {
  status: 'staging' | 'limited' | 'full' | 'reduced';
  activeWorkstations: number;
  personnelOnSite: number;
  briefingsHeld: number;
  decisionsProcessed: number;
  resourceRequestsHandled: number;
  currentActivities: string[];
}

interface DeployedResources {
  consumables: { item: string; quantity: number; unit: string; status: string }[];
  fuelStatus: { current: number; capacity: number; consumption: string };
  generatorHours: number;
  issues: string[];
}

interface DeploymentLog {
  timestamp: Date;
  type: 'status' | 'communication' | 'operations' | 'issue' | 'personnel' | 'resource';
  entry: string;
  recordedBy: string;
  priority?: 'routine' | 'important' | 'urgent';
}

// Communication hub interfaces
interface CommunicationHub {
  id: string;
  deploymentId: string;
  name: string;
  status: CommunicationStatus;
  location: { latitude: number; longitude: number };
  systems: CommunicationSystem[];
  channels: ChannelAssignment[];
  patching: PatchConfiguration[];
  networkConnections: NetworkConnection[];
  performance: HubPerformance;
  incidents: CommunicationIncident[];
  createdAt: Date;
  updatedAt: Date;
}

interface CommunicationSystem {
  id: string;
  name: string;
  type: 'radio' | 'satellite' | 'cellular' | 'internet' | 'phone' | 'intercom';
  status: 'online' | 'standby' | 'failed' | 'maintenance';
  configuration: Record<string, string>;
  lastTest?: Date;
  reliability: number;
}

interface ChannelAssignment {
  channel: string;
  frequency?: string;
  purpose: string;
  assignedTo: string[];
  primary: boolean;
  encryption?: string;
}

interface PatchConfiguration {
  id: string;
  name: string;
  sources: string[];
  active: boolean;
  createdAt: Date;
  createdBy: string;
}

interface NetworkConnection {
  type: 'ethernet' | 'wifi' | 'cellular' | 'satellite';
  provider: string;
  status: 'connected' | 'disconnected' | 'limited';
  bandwidth: { up: string; down: string };
  latency?: string;
  reliability: number;
}

interface HubPerformance {
  uptime: number;
  messagesProcessed: number;
  callsHandled: number;
  dataTransferred: string;
  peakLoad?: Date;
  issues: number;
}

interface CommunicationIncident {
  id: string;
  timestamp: Date;
  type: 'outage' | 'degradation' | 'interference' | 'capacity' | 'security';
  description: string;
  affectedSystems: string[];
  resolution?: string;
  resolvedAt?: Date;
  reportedBy: string;
}

// Resource staging interfaces
interface StagingArea {
  id: string;
  deploymentId: string;
  name: string;
  type: 'primary' | 'secondary' | 'forward' | 'specialized';
  status: 'inactive' | 'activating' | 'active' | 'deactivating';
  location: StagingLocation;
  manager: string;
  capacity: StagingCapacity;
  resources: StagedResource[];
  access: StagingAccess;
  operations: StagingOperations;
  createdAt: Date;
  updatedAt: Date;
}

interface StagingLocation {
  address: string;
  coordinates: [number, number];
  description: string;
  terrain: string;
  size: string;
  surfaceType: string;
}

interface StagingCapacity {
  vehicles: { current: number; maximum: number };
  personnel: { current: number; maximum: number };
  equipment: { current: number; maximum: number };
  storageArea: string;
}

interface StagedResource {
  id: string;
  type: 'vehicle' | 'equipment' | 'supplies' | 'personnel';
  name: string;
  quantity: number;
  status: 'available' | 'assigned' | 'deployed' | 'returning';
  location: string;
  owner: string;
  arrivalTime?: Date;
  departureTime?: Date;
}

interface StagingAccess {
  entryPoints: { name: string; coordinates: [number, number] }[];
  routes: { name: string; description: string }[];
  restrictions?: string[];
  security: { level: string; checkIn: boolean; badging: boolean };
}

interface StagingOperations {
  checkIns: number;
  checkOuts: number;
  resourceRequests: number;
  averageWaitTime: string;
  currentQueue: number;
}

// Sample data
const sampleUnits: MobileCommandUnit[] = [
  {
    id: 'mcu-001',
    name: 'Mobile Command 1',
    callSign: 'Command One',
    type: 'mobile_command',
    status: 'available',
    homeStation: 'Emergency Management HQ',
    specifications: {
      manufacturer: 'LDV Custom',
      model: 'MCC-53',
      year: 2022,
      length: '53 feet',
      width: '8.5 feet',
      height: '13.5 feet',
      weight: '45,000 lbs',
      axles: 3,
      slideOuts: 3,
      workstations: 8,
      seating: 12,
      sleepingCapacity: 4
    },
    capabilities: {
      commandFunctions: ['Incident Command', 'EOC Operations', 'Multi-Agency Coordination'],
      communicationSystems: ['VHF/UHF', '800 MHz', 'P25', 'Satellite', 'Cellular', 'WiFi'],
      dataCapabilities: ['GIS Mapping', 'Video Conferencing', 'Data Sharing', 'Internet Access'],
      specialFeatures: ['Weather Station', 'Drone Operations', 'Night Operations'],
      interoperability: ['ACU-1000', 'ICALL', 'StarCom'],
      maxOperationalRange: '500 miles',
      deploymentTime: '45 minutes',
      autonomyDuration: '72 hours'
    },
    equipment: [
      { id: 'eq-001', name: 'Command Workstation', category: 'computers', quantity: 8, status: 'operational' },
      { id: 'eq-002', name: 'Video Wall Display', category: 'display', quantity: 1, status: 'operational' },
      { id: 'eq-003', name: 'Satellite Terminal', category: 'communications', quantity: 1, status: 'operational' }
    ],
    crew: [
      {
        id: 'crew-001',
        name: 'Mike Thompson',
        role: 'driver',
        certification: ['CDL-A', 'Emergency Vehicle Operations'],
        agency: 'Emergency Management',
        contact: { phone: '555-0201' },
        status: 'available'
      }
    ],
    vehicle: {
      vin: '1FVACYDC5PHAB1234',
      licensePlate: 'EMG-001',
      registration: { state: 'CA', expiration: new Date('2025-12-31') },
      insurance: { provider: 'State Insurance', policy: 'POL-123456', expiration: new Date('2025-06-30') },
      mileage: 15420,
      fuelType: 'Diesel',
      fuelCapacity: 150,
      currentFuel: 120
    },
    communications: {
      primaryRadio: { type: 'Motorola APX8000', frequencies: ['VHF', 'UHF', '700/800'] },
      backupRadio: { type: 'Kenwood NX-5000', frequencies: ['VHF', 'UHF'] },
      satellite: { provider: 'BGAN', phoneNumber: '870-555-0001', enabled: true },
      cellular: { carriers: ['Verizon', 'AT&T', 'FirstNet'], hotspotCapable: true },
      internet: { primary: 'Cellular', backup: 'Satellite', maxBandwidth: '50 Mbps' },
      antennas: [
        { type: 'Telescoping Mast', height: '50 feet', coverage: '10 mile radius' }
      ],
      interoperability: { p25: true, starcom: true, other: ['ACU-1000'] }
    },
    power: {
      generator: { type: 'Onan QG 12500', output: '12.5 kW', fuelType: 'Diesel', runtime: '24 hours' },
      shore: { voltage: '240V', amperage: '100A' },
      inverter: { output: '3000W' },
      battery: { type: 'AGM', capacity: '400 Ah', backup: '4 hours' },
      ups: true
    },
    maintenance: {
      lastService: new Date('2024-11-15'),
      nextService: new Date('2025-02-15'),
      mileageAtService: 15200,
      serviceHistory: [],
      issues: []
    },
    certifications: [
      {
        type: 'Type 1 Mobile Command',
        issuedBy: 'State Emergency Management',
        issueDate: new Date('2023-01-15'),
        expirationDate: new Date('2026-01-15'),
        status: 'valid'
      }
    ],
    deploymentHistory: [],
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date()
  }
];

class MobileCommandService {
  private static instance: MobileCommandService;
  private units: Map<string, MobileCommandUnit> = new Map();
  private deployments: Map<string, CommandDeployment> = new Map();
  private communicationHubs: Map<string, CommunicationHub> = new Map();
  private stagingAreas: Map<string, StagingArea> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): MobileCommandService {
    if (!MobileCommandService.instance) {
      MobileCommandService.instance = new MobileCommandService();
    }
    return MobileCommandService.instance;
  }

  private initializeSampleData(): void {
    sampleUnits.forEach(u => this.units.set(u.id, u));
  }

  // ==================== Unit Management ====================

  async createUnit(params: Omit<MobileCommandUnit, 'id' | 'deploymentHistory' | 'createdAt' | 'updatedAt'>): Promise<MobileCommandUnit> {
    const unit: MobileCommandUnit = {
      ...params,
      id: `mcu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deploymentHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.units.set(unit.id, unit);
    return unit;
  }

  async getUnit(unitId: string): Promise<MobileCommandUnit | null> {
    return this.units.get(unitId) || null;
  }

  async getUnits(params?: {
    type?: CommandUnitType;
    status?: UnitStatus;
    homeStation?: string;
  }): Promise<MobileCommandUnit[]> {
    let units = Array.from(this.units.values());

    if (params?.type) {
      units = units.filter(u => u.type === params.type);
    }

    if (params?.status) {
      units = units.filter(u => u.status === params.status);
    }

    if (params?.homeStation) {
      units = units.filter(u => u.homeStation === params.homeStation);
    }

    return units.sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateUnitStatus(unitId: string, status: UnitStatus): Promise<MobileCommandUnit> {
    const unit = this.units.get(unitId);
    if (!unit) throw new Error(`Unit not found: ${unitId}`);

    unit.status = status;
    unit.updatedAt = new Date();

    return unit;
  }

  async updateUnitLocation(unitId: string, location: UnitLocation): Promise<MobileCommandUnit> {
    const unit = this.units.get(unitId);
    if (!unit) throw new Error(`Unit not found: ${unitId}`);

    unit.location = { ...location, lastUpdate: new Date() };
    unit.updatedAt = new Date();

    return unit;
  }

  async addMaintenanceIssue(unitId: string, issue: Omit<MaintenanceIssue, 'id' | 'status'>): Promise<MobileCommandUnit> {
    const unit = this.units.get(unitId);
    if (!unit) throw new Error(`Unit not found: ${unitId}`);

    unit.maintenance.issues.push({
      ...issue,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'open'
    });
    unit.updatedAt = new Date();

    return unit;
  }

  // ==================== Deployment Management ====================

  async createDeployment(params: Omit<CommandDeployment, 'id' | 'status' | 'logs' | 'createdAt' | 'updatedAt'>): Promise<CommandDeployment> {
    const unit = this.units.get(params.unitId);
    if (!unit) throw new Error(`Unit not found: ${params.unitId}`);

    if (unit.status !== 'available' && unit.status !== 'reserved') {
      throw new Error('Unit is not available for deployment');
    }

    const deployment: CommandDeployment = {
      ...params,
      id: `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'planned',
      logs: [
        {
          timestamp: new Date(),
          type: 'status',
          entry: 'Deployment created',
          recordedBy: params.requestedBy
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.deployments.set(deployment.id, deployment);

    // Update unit
    unit.status = 'reserved';
    unit.currentDeployment = deployment.id;
    unit.updatedAt = new Date();

    return deployment;
  }

  async getDeployment(deploymentId: string): Promise<CommandDeployment | null> {
    return this.deployments.get(deploymentId) || null;
  }

  async getDeployments(params?: {
    unitId?: string;
    incidentId?: string;
    status?: DeploymentStatus;
  }): Promise<CommandDeployment[]> {
    let deployments = Array.from(this.deployments.values());

    if (params?.unitId) {
      deployments = deployments.filter(d => d.unitId === params.unitId);
    }

    if (params?.incidentId) {
      deployments = deployments.filter(d => d.incidentId === params.incidentId);
    }

    if (params?.status) {
      deployments = deployments.filter(d => d.status === params.status);
    }

    return deployments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateDeploymentStatus(deploymentId: string, status: DeploymentStatus, updatedBy: string): Promise<CommandDeployment> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error(`Deployment not found: ${deploymentId}`);

    deployment.status = status;
    deployment.logs.push({
      timestamp: new Date(),
      type: 'status',
      entry: `Status changed to ${status}`,
      recordedBy: updatedBy
    });

    // Update schedule timestamps
    if (status === 'en_route') {
      // Unit is moving
    } else if (status === 'staging') {
      deployment.schedule.actualArrival = new Date();
    } else if (status === 'operational') {
      deployment.schedule.operationalBy = new Date();
    } else if (status === 'complete') {
      deployment.schedule.actualDemobilization = new Date();

      // Update unit
      const unit = this.units.get(deployment.unitId);
      if (unit) {
        unit.status = 'available';
        unit.currentDeployment = undefined;
        unit.deploymentHistory.push({
          id: deployment.id,
          incidentName: deployment.incidentName,
          startDate: deployment.createdAt,
          endDate: new Date(),
          duration: this.calculateDuration(deployment.createdAt, new Date()),
          location: deployment.location.address,
          hoursOperational: deployment.operations.briefingsHeld * 2
        });
        unit.updatedAt = new Date();
      }
    }

    deployment.updatedAt = new Date();
    return deployment;
  }

  private calculateDuration(start: Date, end: Date): string {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}, ${hours % 24} hour${(hours % 24) !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  async completeSetupItem(deploymentId: string, itemId: string, completedBy: string): Promise<CommandDeployment> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error(`Deployment not found: ${deploymentId}`);

    const item = deployment.setup.items.find(i => i.id === itemId);
    if (!item) throw new Error(`Setup item not found: ${itemId}`);

    item.completed = true;
    item.completedBy = completedBy;
    item.completedAt = new Date();

    // Check if all required items complete
    const allRequired = deployment.setup.items.filter(i => i.required);
    if (allRequired.every(i => i.completed)) {
      deployment.setup.completedBy = completedBy;
      deployment.setup.completedAt = new Date();
    }

    deployment.updatedAt = new Date();
    return deployment;
  }

  async addDeploymentLog(deploymentId: string, log: Omit<DeploymentLog, 'timestamp'>): Promise<CommandDeployment> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error(`Deployment not found: ${deploymentId}`);

    deployment.logs.push({
      ...log,
      timestamp: new Date()
    });
    deployment.updatedAt = new Date();

    return deployment;
  }

  // ==================== Communication Hub Management ====================

  async createCommunicationHub(params: Omit<CommunicationHub, 'id' | 'performance' | 'incidents' | 'createdAt' | 'updatedAt'>): Promise<CommunicationHub> {
    const hub: CommunicationHub = {
      ...params,
      id: `hub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      performance: {
        uptime: 100,
        messagesProcessed: 0,
        callsHandled: 0,
        dataTransferred: '0 GB',
        issues: 0
      },
      incidents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.communicationHubs.set(hub.id, hub);
    return hub;
  }

  async getCommunicationHub(hubId: string): Promise<CommunicationHub | null> {
    return this.communicationHubs.get(hubId) || null;
  }

  async updateHubStatus(hubId: string, status: CommunicationStatus): Promise<CommunicationHub> {
    const hub = this.communicationHubs.get(hubId);
    if (!hub) throw new Error(`Communication hub not found: ${hubId}`);

    hub.status = status;
    hub.updatedAt = new Date();

    return hub;
  }

  async reportCommunicationIncident(hubId: string, incident: Omit<CommunicationIncident, 'id' | 'timestamp'>): Promise<CommunicationHub> {
    const hub = this.communicationHubs.get(hubId);
    if (!hub) throw new Error(`Communication hub not found: ${hubId}`);

    hub.incidents.push({
      ...incident,
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date()
    });
    hub.performance.issues++;
    hub.updatedAt = new Date();

    return hub;
  }

  // ==================== Staging Area Management ====================

  async createStagingArea(params: Omit<StagingArea, 'id' | 'resources' | 'operations' | 'createdAt' | 'updatedAt'>): Promise<StagingArea> {
    const stagingArea: StagingArea = {
      ...params,
      id: `staging-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      resources: [],
      operations: {
        checkIns: 0,
        checkOuts: 0,
        resourceRequests: 0,
        averageWaitTime: '0 minutes',
        currentQueue: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.stagingAreas.set(stagingArea.id, stagingArea);
    return stagingArea;
  }

  async getStagingArea(areaId: string): Promise<StagingArea | null> {
    return this.stagingAreas.get(areaId) || null;
  }

  async getStagingAreas(params?: {
    deploymentId?: string;
    type?: StagingArea['type'];
    status?: StagingArea['status'];
  }): Promise<StagingArea[]> {
    let areas = Array.from(this.stagingAreas.values());

    if (params?.deploymentId) {
      areas = areas.filter(a => a.deploymentId === params.deploymentId);
    }

    if (params?.type) {
      areas = areas.filter(a => a.type === params.type);
    }

    if (params?.status) {
      areas = areas.filter(a => a.status === params.status);
    }

    return areas;
  }

  async checkInResource(areaId: string, resource: Omit<StagedResource, 'id' | 'arrivalTime'>): Promise<StagingArea> {
    const area = this.stagingAreas.get(areaId);
    if (!area) throw new Error(`Staging area not found: ${areaId}`);

    area.resources.push({
      ...resource,
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      arrivalTime: new Date()
    });

    area.operations.checkIns++;

    // Update capacity
    if (resource.type === 'vehicle') {
      area.capacity.vehicles.current++;
    } else if (resource.type === 'personnel') {
      area.capacity.personnel.current += resource.quantity;
    }

    area.updatedAt = new Date();
    return area;
  }

  async checkOutResource(areaId: string, resourceId: string): Promise<StagingArea> {
    const area = this.stagingAreas.get(areaId);
    if (!area) throw new Error(`Staging area not found: ${areaId}`);

    const resource = area.resources.find(r => r.id === resourceId);
    if (!resource) throw new Error(`Resource not found: ${resourceId}`);

    resource.status = 'deployed';
    resource.departureTime = new Date();
    area.operations.checkOuts++;

    // Update capacity
    if (resource.type === 'vehicle') {
      area.capacity.vehicles.current--;
    } else if (resource.type === 'personnel') {
      area.capacity.personnel.current -= resource.quantity;
    }

    area.updatedAt = new Date();
    return area;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalUnits: number;
    availableUnits: number;
    deployedUnits: number;
    activeDeployments: number;
    totalDeployments: number;
    communicationHubs: number;
    onlineHubs: number;
    stagingAreas: number;
    activeStagingAreas: number;
    byUnitType: Record<CommandUnitType, number>;
    byDeploymentStatus: Record<DeploymentStatus, number>;
    totalDeploymentHours: number;
    averageDeploymentDuration: string;
  }> {
    const units = Array.from(this.units.values());
    const deployments = Array.from(this.deployments.values());
    const hubs = Array.from(this.communicationHubs.values());
    const stagingAreas = Array.from(this.stagingAreas.values());

    const byUnitType: Record<CommandUnitType, number> = {} as any;
    units.forEach(u => {
      byUnitType[u.type] = (byUnitType[u.type] || 0) + 1;
    });

    const byDeploymentStatus: Record<DeploymentStatus, number> = {} as any;
    deployments.forEach(d => {
      byDeploymentStatus[d.status] = (byDeploymentStatus[d.status] || 0) + 1;
    });

    let totalDeploymentHours = 0;
    units.forEach(u => {
      u.deploymentHistory.forEach(h => {
        totalDeploymentHours += h.hoursOperational;
      });
    });

    const completedDeployments = deployments.filter(d => d.status === 'complete');
    let avgHours = 0;
    if (completedDeployments.length > 0) {
      const totalMs = completedDeployments.reduce((sum, d) => {
        if (d.schedule.actualDemobilization) {
          return sum + (d.schedule.actualDemobilization.getTime() - d.createdAt.getTime());
        }
        return sum;
      }, 0);
      avgHours = totalMs / completedDeployments.length / (1000 * 60 * 60);
    }

    return {
      totalUnits: units.length,
      availableUnits: units.filter(u => u.status === 'available').length,
      deployedUnits: units.filter(u => ['deploying', 'deployed', 'operational'].includes(u.status)).length,
      activeDeployments: deployments.filter(d => ['en_route', 'staging', 'setup', 'operational'].includes(d.status)).length,
      totalDeployments: deployments.length,
      communicationHubs: hubs.length,
      onlineHubs: hubs.filter(h => h.status === 'online').length,
      stagingAreas: stagingAreas.length,
      activeStagingAreas: stagingAreas.filter(s => s.status === 'active').length,
      byUnitType,
      byDeploymentStatus,
      totalDeploymentHours,
      averageDeploymentDuration: `${avgHours.toFixed(1)} hours`
    };
  }
}

export const mobileCommandService = MobileCommandService.getInstance();
export default MobileCommandService;

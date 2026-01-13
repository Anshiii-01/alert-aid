/**
 * Telecom Network Service - Issue #148 Implementation
 * 
 * Provides comprehensive telecommunications infrastructure monitoring for disaster response
 * including cell tower status, network coverage, emergency communications,
 * restoration coordination, and mobile command unit deployment.
 */

// Type definitions
type NetworkType = '5g' | '4g_lte' | '3g' | '2g' | 'satellite' | 'microwave' | 'fiber' | 'copper';
type TowerStatus = 'operational' | 'degraded' | 'offline' | 'damaged' | 'destroyed' | 'maintenance' | 'overloaded';
type ServiceType = 'voice' | 'data' | 'sms' | 'emergency_911' | 'first_net' | 'broadcast';
type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
type EquipmentType = 'antenna' | 'radio' | 'power' | 'backhaul' | 'cabinet' | 'generator' | 'battery' | 'fiber_node';
type OutageType = 'power' | 'equipment' | 'backhaul' | 'congestion' | 'damage' | 'planned' | 'unknown';

// Cell Tower interfaces
interface CellTower {
  id: string;
  name: string;
  siteId: string;
  location: TowerLocation;
  physical: TowerPhysical;
  networks: NetworkConfiguration[];
  equipment: TowerEquipment[];
  power: PowerConfiguration;
  backhaul: BackhaulConfiguration;
  status: TowerStatus;
  capacity: TowerCapacity;
  coverage: CoverageInfo;
  services: ServiceAvailability[];
  owner: OwnerInfo;
  maintenanceHistory: MaintenanceRecord[];
  incidents: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TowerLocation {
  address: string;
  city: string;
  state: string;
  county: string;
  coordinates: { lat: number; lon: number };
  elevation: number; // meters above sea level
  towerHeight: number;
  antennaHeights: number[];
  accessInstructions: string;
  nearestCrossStreet?: string;
  floodZone?: string;
  seismicZone?: string;
}

interface TowerPhysical {
  structureType: 'monopole' | 'self_support' | 'guyed' | 'rooftop' | 'small_cell' | 'das';
  height: number; // meters
  yearInstalled: number;
  lastInspected: Date;
  maxLoadCapacity: number; // kg
  currentLoad: number;
  windRating: number; // mph
  iceLoading: boolean;
}

interface NetworkConfiguration {
  type: NetworkType;
  bands: string[];
  sectors: number;
  antennaType: string;
  power: number; // watts
  maxCapacity: number; // connections
  currentLoad: number;
  status: 'active' | 'inactive' | 'degraded';
}

interface TowerEquipment {
  id: string;
  type: EquipmentType;
  manufacturer: string;
  model: string;
  serialNumber: string;
  installedDate: Date;
  warrantyExpiry?: Date;
  status: 'operational' | 'degraded' | 'failed' | 'offline';
  lastMaintenance: Date;
  nextMaintenance: Date;
  specifications: Record<string, any>;
}

interface PowerConfiguration {
  primarySource: 'grid' | 'solar' | 'generator' | 'hybrid';
  gridConnection: boolean;
  gridStatus: 'connected' | 'disconnected' | 'unknown';
  generator: {
    present: boolean;
    fuelType?: string;
    capacity?: number; // kW
    fuelLevel?: number; // percent
    runTime?: number; // hours remaining
    autoStart: boolean;
  };
  battery: {
    present: boolean;
    type?: string;
    capacity?: number; // kWh
    chargeLevel?: number; // percent
    estimatedRuntime?: number; // hours
  };
  solarPanels?: {
    present: boolean;
    capacity?: number; // kW
    currentOutput?: number;
  };
  currentPowerSource: 'grid' | 'generator' | 'battery' | 'solar' | 'unknown';
  loadKw: number;
}

interface BackhaulConfiguration {
  primaryType: 'fiber' | 'microwave' | 'satellite';
  primaryStatus: 'connected' | 'degraded' | 'disconnected';
  primaryCapacity: number; // Mbps
  backupType?: 'fiber' | 'microwave' | 'satellite';
  backupStatus?: 'connected' | 'degraded' | 'disconnected' | 'standby';
  backupCapacity?: number;
  latency: number; // ms
  packetLoss: number; // percent
}

interface TowerCapacity {
  maxConnections: number;
  currentConnections: number;
  utilizationPercent: number;
  voiceChannelsTotal: number;
  voiceChannelsInUse: number;
  dataCapacityMbps: number;
  dataUsageMbps: number;
  congestionLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
}

interface CoverageInfo {
  radius: number; // km
  area: number; // sq km
  populationServed: number;
  sectors: SectorCoverage[];
  signalStrength: {
    excellent: number; // percent of area
    good: number;
    fair: number;
    poor: number;
  };
}

interface SectorCoverage {
  id: string;
  azimuth: number; // degrees
  beamwidth: number;
  tilt: number;
  coverage: { lat: number; lon: number }[];
}

interface ServiceAvailability {
  service: ServiceType;
  available: boolean;
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'unavailable';
  capacity: number; // percent of normal
}

interface OwnerInfo {
  company: string;
  type: 'carrier' | 'tower_company' | 'government' | 'private';
  contactName: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    phone: string;
    available24x7: boolean;
  };
}

// Outage interfaces
interface NetworkOutage {
  id: string;
  towerIds: string[];
  type: OutageType;
  severity: AlertPriority;
  affectedArea: {
    center: { lat: number; lon: number };
    radius: number;
    polygon?: { lat: number; lon: number }[];
  };
  affectedServices: ServiceType[];
  affectedPopulation: number;
  cause: string;
  description: string;
  reportedAt: Date;
  confirmedAt?: Date;
  status: 'reported' | 'confirmed' | 'investigating' | 'repair_dispatched' | 'repair_in_progress' | 'resolved';
  estimatedRestoration?: Date;
  actualRestoration?: Date;
  restorationPriority: number;
  workOrders: string[];
  updates: OutageUpdate[];
  impactAssessment: ImpactAssessment;
  createdAt: Date;
  updatedAt: Date;
}

interface OutageUpdate {
  id: string;
  timestamp: Date;
  author: string;
  status: string;
  message: string;
  isPublic: boolean;
}

interface ImpactAssessment {
  criticalFacilitiesAffected: CriticalFacility[];
  emergencyServicesImpact: string;
  economicImpactPerHour: number;
  workaroundAvailable: boolean;
  workaroundDescription?: string;
}

interface CriticalFacility {
  id: string;
  name: string;
  type: 'hospital' | 'fire_station' | 'police' | 'school' | 'shelter' | 'government' | 'utility';
  address: string;
  hasBackupComms: boolean;
}

// Mobile Command Unit interfaces
interface MobileCommandUnit {
  id: string;
  name: string;
  callSign: string;
  type: 'cow' | 'colt' | 'satellite_hub' | 'repeater' | 'portable_cell';
  owner: string;
  capabilities: {
    networks: NetworkType[];
    maxConnections: number;
    coverageRadius: number; // km
    services: ServiceType[];
    powerSource: string;
    autonomy: number; // hours
  };
  equipment: MobileEquipment[];
  currentLocation?: { lat: number; lon: number };
  status: 'available' | 'deployed' | 'en_route' | 'maintenance' | 'offline';
  currentDeployment?: Deployment;
  deploymentHistory: Deployment[];
  crew: CrewMember[];
  createdAt: Date;
  updatedAt: Date;
}

interface MobileEquipment {
  type: string;
  quantity: number;
  status: 'operational' | 'degraded' | 'failed';
}

interface Deployment {
  id: string;
  unitId: string;
  incidentId?: string;
  location: { lat: number; lon: number };
  address: string;
  purpose: string;
  startTime: Date;
  endTime?: Date;
  status: 'planned' | 'setup' | 'operational' | 'teardown' | 'complete';
  connectionsServed: number;
  dataTransferred: number; // GB
  notes: string;
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  phone: string;
  onDuty: boolean;
}

// Alert interfaces
interface NetworkAlert {
  id: string;
  type: 'outage' | 'degradation' | 'congestion' | 'equipment_failure' | 'power' | 'security';
  priority: AlertPriority;
  towerIds: string[];
  title: string;
  description: string;
  affectedServices: ServiceType[];
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  escalatedTo?: string;
  actions: string[];
  relatedOutageId?: string;
}

// Maintenance interfaces
interface MaintenanceRecord {
  id: string;
  type: 'preventive' | 'corrective' | 'emergency' | 'upgrade';
  description: string;
  scheduledStart: Date;
  scheduledEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  serviceImpact: 'none' | 'degraded' | 'outage';
  technician: string;
  workOrder: string;
  notes: string;
}

// Sample data
const sampleTowers: CellTower[] = [
  {
    id: 'tower-001',
    name: 'Downtown Metro Tower',
    siteId: 'SITE-DT-001',
    location: {
      address: '100 Main Street',
      city: 'Metro City',
      state: 'CA',
      county: 'Metro County',
      coordinates: { lat: 34.0522, lon: -118.2437 },
      elevation: 75,
      towerHeight: 50,
      antennaHeights: [45, 40, 35],
      accessInstructions: 'Access via Main St, keypad code required',
      nearestCrossStreet: 'First Avenue'
    },
    physical: {
      structureType: 'monopole',
      height: 50,
      yearInstalled: 2015,
      lastInspected: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      maxLoadCapacity: 5000,
      currentLoad: 3500,
      windRating: 120,
      iceLoading: true
    },
    networks: [
      { type: '5g', bands: ['n77', 'n78'], sectors: 3, antennaType: 'Massive MIMO', power: 200, maxCapacity: 5000, currentLoad: 2500, status: 'active' },
      { type: '4g_lte', bands: ['B2', 'B4', 'B66'], sectors: 3, antennaType: 'Panel', power: 100, maxCapacity: 3000, currentLoad: 1800, status: 'active' }
    ],
    equipment: [],
    power: {
      primarySource: 'grid',
      gridConnection: true,
      gridStatus: 'connected',
      generator: { present: true, fuelType: 'diesel', capacity: 50, fuelLevel: 85, runTime: 72, autoStart: true },
      battery: { present: true, type: 'lithium', capacity: 100, chargeLevel: 100, estimatedRuntime: 8 },
      currentPowerSource: 'grid',
      loadKw: 25
    },
    backhaul: {
      primaryType: 'fiber',
      primaryStatus: 'connected',
      primaryCapacity: 10000,
      backupType: 'microwave',
      backupStatus: 'standby',
      backupCapacity: 1000,
      latency: 5,
      packetLoss: 0.01
    },
    status: 'operational',
    capacity: {
      maxConnections: 8000,
      currentConnections: 4300,
      utilizationPercent: 54,
      voiceChannelsTotal: 200,
      voiceChannelsInUse: 85,
      dataCapacityMbps: 10000,
      dataUsageMbps: 5500,
      congestionLevel: 'low'
    },
    coverage: {
      radius: 3,
      area: 28.27,
      populationServed: 15000,
      sectors: [],
      signalStrength: { excellent: 40, good: 35, fair: 20, poor: 5 }
    },
    services: [
      { service: 'voice', available: true, quality: 'excellent', capacity: 100 },
      { service: 'data', available: true, quality: 'excellent', capacity: 100 },
      { service: 'sms', available: true, quality: 'excellent', capacity: 100 },
      { service: 'emergency_911', available: true, quality: 'excellent', capacity: 100 },
      { service: 'first_net', available: true, quality: 'excellent', capacity: 100 }
    ],
    owner: {
      company: 'Metro Wireless',
      type: 'carrier',
      contactName: 'Robert Chen',
      phone: '555-0101',
      email: 'rchen@metrowireless.com',
      emergencyContact: { name: 'NOC Team', phone: '555-0199', available24x7: true }
    },
    maintenanceHistory: [],
    incidents: [],
    createdAt: new Date(Date.now() - 365 * 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

const sampleMobileUnits: MobileCommandUnit[] = [
  {
    id: 'mcu-001',
    name: 'Cell on Wheels Unit 1',
    callSign: 'COW-1',
    type: 'cow',
    owner: 'Metro Wireless',
    capabilities: {
      networks: ['4g_lte', '5g'],
      maxConnections: 2000,
      coverageRadius: 2,
      services: ['voice', 'data', 'sms', 'emergency_911'],
      powerSource: 'generator',
      autonomy: 48
    },
    equipment: [
      { type: 'antenna', quantity: 3, status: 'operational' },
      { type: 'radio', quantity: 6, status: 'operational' },
      { type: 'generator', quantity: 1, status: 'operational' }
    ],
    status: 'available',
    deploymentHistory: [],
    crew: [
      { id: 'crew-001', name: 'Mike Johnson', role: 'Lead Technician', certifications: ['RF Safety', 'Tower Climbing'], phone: '555-0201', onDuty: true }
    ],
    createdAt: new Date(Date.now() - 365 * 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class TelecomNetworkService {
  private static instance: TelecomNetworkService;
  private towers: Map<string, CellTower> = new Map();
  private outages: Map<string, NetworkOutage> = new Map();
  private mobileUnits: Map<string, MobileCommandUnit> = new Map();
  private alerts: Map<string, NetworkAlert> = new Map();

  private readonly CONGESTION_THRESHOLDS = {
    low: 60,
    moderate: 75,
    high: 85,
    critical: 95
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): TelecomNetworkService {
    if (!TelecomNetworkService.instance) {
      TelecomNetworkService.instance = new TelecomNetworkService();
    }
    return TelecomNetworkService.instance;
  }

  private initializeSampleData(): void {
    sampleTowers.forEach(t => this.towers.set(t.id, t));
    sampleMobileUnits.forEach(u => this.mobileUnits.set(u.id, u));
  }

  // ==================== Tower Management ====================

  async createTower(params: Omit<CellTower, 'id' | 'incidents' | 'maintenanceHistory' | 'createdAt' | 'updatedAt'>): Promise<CellTower> {
    const tower: CellTower = {
      ...params,
      id: `tower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidents: [],
      maintenanceHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.towers.set(tower.id, tower);
    return tower;
  }

  async getTower(towerId: string): Promise<CellTower | null> {
    return this.towers.get(towerId) || null;
  }

  async getTowers(params?: {
    status?: TowerStatus;
    network?: NetworkType;
    city?: string;
    state?: string;
    owner?: string;
  }): Promise<CellTower[]> {
    let towers = Array.from(this.towers.values());

    if (params?.status) {
      towers = towers.filter(t => t.status === params.status);
    }

    if (params?.network) {
      towers = towers.filter(t => t.networks.some(n => n.type === params.network));
    }

    if (params?.city) {
      towers = towers.filter(t => t.location.city === params.city);
    }

    if (params?.state) {
      towers = towers.filter(t => t.location.state === params.state);
    }

    if (params?.owner) {
      towers = towers.filter(t => t.owner.company === params.owner);
    }

    return towers;
  }

  async getTowersInRadius(center: { lat: number; lon: number }, radiusKm: number): Promise<CellTower[]> {
    return Array.from(this.towers.values()).filter(tower => {
      const distance = this.calculateDistance(
        center.lat, center.lon,
        tower.location.coordinates.lat, tower.location.coordinates.lon
      );
      return distance <= radiusKm;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async updateTowerStatus(towerId: string, status: TowerStatus, reason?: string): Promise<CellTower> {
    const tower = this.towers.get(towerId);
    if (!tower) throw new Error(`Tower not found: ${towerId}`);

    const previousStatus = tower.status;
    tower.status = status;
    tower.updatedAt = new Date();

    // Update services based on status
    if (status === 'offline' || status === 'damaged' || status === 'destroyed') {
      tower.services.forEach(s => {
        s.available = false;
        s.quality = 'unavailable';
        s.capacity = 0;
      });
    }

    // Create alert if status degraded
    if (previousStatus === 'operational' && status !== 'operational') {
      await this.createAlert({
        type: 'outage',
        priority: status === 'destroyed' ? 'critical' : status === 'damaged' ? 'high' : 'medium',
        towerIds: [towerId],
        title: `Tower ${tower.name} status changed to ${status}`,
        description: reason || `Tower status changed from ${previousStatus} to ${status}`,
        affectedServices: tower.services.filter(s => s.available).map(s => s.service),
        actions: []
      });
    }

    return tower;
  }

  async updateTowerCapacity(towerId: string, capacity: Partial<TowerCapacity>): Promise<CellTower> {
    const tower = this.towers.get(towerId);
    if (!tower) throw new Error(`Tower not found: ${towerId}`);

    Object.assign(tower.capacity, capacity);

    // Calculate utilization and congestion
    if (capacity.currentConnections !== undefined || capacity.maxConnections !== undefined) {
      tower.capacity.utilizationPercent = Math.round(
        (tower.capacity.currentConnections / tower.capacity.maxConnections) * 100
      );
    }

    // Update congestion level
    const util = tower.capacity.utilizationPercent;
    if (util >= this.CONGESTION_THRESHOLDS.critical) {
      tower.capacity.congestionLevel = 'critical';
    } else if (util >= this.CONGESTION_THRESHOLDS.high) {
      tower.capacity.congestionLevel = 'high';
    } else if (util >= this.CONGESTION_THRESHOLDS.moderate) {
      tower.capacity.congestionLevel = 'moderate';
    } else if (util >= this.CONGESTION_THRESHOLDS.low) {
      tower.capacity.congestionLevel = 'low';
    } else {
      tower.capacity.congestionLevel = 'none';
    }

    tower.updatedAt = new Date();

    // Create alert if congested
    if (tower.capacity.congestionLevel === 'critical' || tower.capacity.congestionLevel === 'high') {
      await this.createAlert({
        type: 'congestion',
        priority: tower.capacity.congestionLevel === 'critical' ? 'critical' : 'high',
        towerIds: [towerId],
        title: `High congestion on ${tower.name}`,
        description: `Tower utilization at ${tower.capacity.utilizationPercent}%`,
        affectedServices: ['voice', 'data'],
        actions: []
      });
    }

    return tower;
  }

  async updateTowerPower(towerId: string, power: Partial<PowerConfiguration>): Promise<CellTower> {
    const tower = this.towers.get(towerId);
    if (!tower) throw new Error(`Tower not found: ${towerId}`);

    Object.assign(tower.power, power);
    tower.updatedAt = new Date();

    // Create alert if on backup power
    if (power.currentPowerSource && power.currentPowerSource !== 'grid') {
      await this.createAlert({
        type: 'power',
        priority: power.currentPowerSource === 'battery' ? 'high' : 'medium',
        towerIds: [towerId],
        title: `Tower ${tower.name} on backup power`,
        description: `Tower running on ${power.currentPowerSource}`,
        affectedServices: [],
        actions: []
      });
    }

    return tower;
  }

  async updateBackhaulStatus(towerId: string, backhaul: Partial<BackhaulConfiguration>): Promise<CellTower> {
    const tower = this.towers.get(towerId);
    if (!tower) throw new Error(`Tower not found: ${towerId}`);

    Object.assign(tower.backhaul, backhaul);
    tower.updatedAt = new Date();

    if (backhaul.primaryStatus === 'disconnected') {
      // Switch to backup
      if (tower.backhaul.backupStatus === 'standby') {
        tower.backhaul.backupStatus = 'connected';
      }

      await this.createAlert({
        type: 'outage',
        priority: tower.backhaul.backupStatus === 'connected' ? 'medium' : 'critical',
        towerIds: [towerId],
        title: `Backhaul failure on ${tower.name}`,
        description: 'Primary backhaul disconnected',
        affectedServices: ['data'],
        actions: []
      });
    }

    return tower;
  }

  // ==================== Outage Management ====================

  async reportOutage(params: {
    towerIds: string[];
    type: OutageType;
    severity: AlertPriority;
    cause: string;
    description: string;
    affectedServices: ServiceType[];
  }): Promise<NetworkOutage> {
    const towers = params.towerIds.map(id => this.towers.get(id)).filter((t): t is CellTower => t !== undefined);
    if (towers.length === 0) throw new Error('No valid towers found');

    // Calculate affected area
    const lats = towers.map(t => t.location.coordinates.lat);
    const lons = towers.map(t => t.location.coordinates.lon);
    const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const centerLon = lons.reduce((a, b) => a + b, 0) / lons.length;
    const maxRadius = Math.max(...towers.map(t => t.coverage.radius));

    // Calculate affected population
    const affectedPopulation = towers.reduce((sum, t) => sum + t.coverage.populationServed, 0);

    const outage: NetworkOutage = {
      id: `outage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      towerIds: params.towerIds,
      type: params.type,
      severity: params.severity,
      affectedArea: {
        center: { lat: centerLat, lon: centerLon },
        radius: maxRadius * 1.5
      },
      affectedServices: params.affectedServices,
      affectedPopulation,
      cause: params.cause,
      description: params.description,
      reportedAt: new Date(),
      status: 'reported',
      restorationPriority: this.calculateRestorationPriority(towers, params.severity),
      workOrders: [],
      updates: [{
        id: `update-${Date.now()}`,
        timestamp: new Date(),
        author: 'System',
        status: 'reported',
        message: params.description,
        isPublic: true
      }],
      impactAssessment: {
        criticalFacilitiesAffected: [],
        emergencyServicesImpact: this.assessEmergencyImpact(towers, params.affectedServices),
        economicImpactPerHour: this.calculateEconomicImpact(towers),
        workaroundAvailable: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.outages.set(outage.id, outage);

    // Update tower statuses
    for (const tower of towers) {
      await this.updateTowerStatus(tower.id, 'offline', params.cause);
    }

    return outage;
  }

  private calculateRestorationPriority(towers: CellTower[], severity: AlertPriority): number {
    let priority = 0;

    // Base priority on severity
    switch (severity) {
      case 'critical': priority = 100; break;
      case 'high': priority = 75; break;
      case 'medium': priority = 50; break;
      case 'low': priority = 25; break;
    }

    // Adjust based on population served
    const totalPop = towers.reduce((sum, t) => sum + t.coverage.populationServed, 0);
    if (totalPop > 50000) priority += 20;
    else if (totalPop > 25000) priority += 15;
    else if (totalPop > 10000) priority += 10;

    // Adjust based on services affected
    const hasEmergency = towers.some(t => t.services.some(s => s.service === 'emergency_911' && s.available));
    if (!hasEmergency) priority += 30;

    return Math.min(priority, 100);
  }

  private assessEmergencyImpact(towers: CellTower[], affectedServices: ServiceType[]): string {
    if (affectedServices.includes('emergency_911')) {
      return 'CRITICAL: 911 services affected';
    }
    if (affectedServices.includes('first_net')) {
      return 'HIGH: FirstNet services affected';
    }
    if (affectedServices.includes('voice')) {
      return 'MODERATE: Voice services affected';
    }
    return 'LOW: Data services affected';
  }

  private calculateEconomicImpact(towers: CellTower[]): number {
    // Simple calculation based on connections
    const totalConnections = towers.reduce((sum, t) => sum + t.capacity.currentConnections, 0);
    return totalConnections * 2; // $2 per connection per hour
  }

  async updateOutageStatus(outageId: string, status: NetworkOutage['status'], message?: string): Promise<NetworkOutage> {
    const outage = this.outages.get(outageId);
    if (!outage) throw new Error(`Outage not found: ${outageId}`);

    outage.status = status;
    outage.updatedAt = new Date();

    if (status === 'confirmed') {
      outage.confirmedAt = new Date();
    } else if (status === 'resolved') {
      outage.actualRestoration = new Date();

      // Update tower statuses
      for (const towerId of outage.towerIds) {
        await this.updateTowerStatus(towerId, 'operational');
      }
    }

    // Add update
    outage.updates.push({
      id: `update-${Date.now()}`,
      timestamp: new Date(),
      author: 'System',
      status,
      message: message || `Status changed to ${status}`,
      isPublic: true
    });

    return outage;
  }

  async getOutages(params?: {
    status?: NetworkOutage['status'];
    severity?: AlertPriority;
    active?: boolean;
  }): Promise<NetworkOutage[]> {
    let outages = Array.from(this.outages.values());

    if (params?.status) {
      outages = outages.filter(o => o.status === params.status);
    }

    if (params?.severity) {
      outages = outages.filter(o => o.severity === params.severity);
    }

    if (params?.active) {
      outages = outages.filter(o => o.status !== 'resolved');
    }

    return outages.sort((a, b) => b.restorationPriority - a.restorationPriority);
  }

  // ==================== Mobile Command Units ====================

  async getMobileUnit(unitId: string): Promise<MobileCommandUnit | null> {
    return this.mobileUnits.get(unitId) || null;
  }

  async getMobileUnits(params?: {
    status?: MobileCommandUnit['status'];
    type?: MobileCommandUnit['type'];
    available?: boolean;
  }): Promise<MobileCommandUnit[]> {
    let units = Array.from(this.mobileUnits.values());

    if (params?.status) {
      units = units.filter(u => u.status === params.status);
    }

    if (params?.type) {
      units = units.filter(u => u.type === params.type);
    }

    if (params?.available) {
      units = units.filter(u => u.status === 'available');
    }

    return units;
  }

  async deployMobileUnit(unitId: string, deployment: Omit<Deployment, 'id' | 'unitId' | 'connectionsServed' | 'dataTransferred'>): Promise<Deployment> {
    const unit = this.mobileUnits.get(unitId);
    if (!unit) throw new Error(`Mobile unit not found: ${unitId}`);

    if (unit.status !== 'available') {
      throw new Error(`Mobile unit is not available: ${unit.status}`);
    }

    const newDeployment: Deployment = {
      ...deployment,
      id: `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      unitId,
      connectionsServed: 0,
      dataTransferred: 0
    };

    unit.status = deployment.status === 'planned' ? 'available' : 'deployed';
    unit.currentDeployment = newDeployment;
    unit.currentLocation = deployment.location;
    unit.updatedAt = new Date();

    return newDeployment;
  }

  async updateDeployment(unitId: string, status: Deployment['status'], stats?: {
    connectionsServed?: number;
    dataTransferred?: number;
  }): Promise<Deployment> {
    const unit = this.mobileUnits.get(unitId);
    if (!unit || !unit.currentDeployment) {
      throw new Error('No active deployment found');
    }

    unit.currentDeployment.status = status;
    if (stats) {
      if (stats.connectionsServed !== undefined) {
        unit.currentDeployment.connectionsServed = stats.connectionsServed;
      }
      if (stats.dataTransferred !== undefined) {
        unit.currentDeployment.dataTransferred = stats.dataTransferred;
      }
    }

    if (status === 'complete') {
      unit.currentDeployment.endTime = new Date();
      unit.deploymentHistory.push(unit.currentDeployment);
      unit.status = 'available';
      const completedDeployment = unit.currentDeployment;
      unit.currentDeployment = undefined;
      unit.currentLocation = undefined;
      unit.updatedAt = new Date();
      return completedDeployment;
    }

    unit.updatedAt = new Date();
    return unit.currentDeployment;
  }

  // ==================== Alert Management ====================

  private async createAlert(params: Omit<NetworkAlert, 'id' | 'triggeredAt'>): Promise<NetworkAlert> {
    const alert: NetworkAlert = {
      ...params,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      triggeredAt: new Date(),
      actions: this.getAlertActions(params.type, params.priority)
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private getAlertActions(type: NetworkAlert['type'], priority: AlertPriority): string[] {
    const actions: string[] = [];

    if (priority === 'critical') {
      actions.push('Notify NOC leadership immediately');
      actions.push('Consider deploying mobile command unit');
      actions.push('Notify emergency services of potential impact');
    }

    switch (type) {
      case 'outage':
        actions.push('Dispatch field technician');
        actions.push('Verify backhaul connectivity');
        actions.push('Check power status');
        break;
      case 'congestion':
        actions.push('Implement load balancing');
        actions.push('Consider traffic management');
        actions.push('Evaluate need for temporary capacity');
        break;
      case 'power':
        actions.push('Monitor fuel/battery levels');
        actions.push('Coordinate with power utility');
        actions.push('Dispatch refueling if needed');
        break;
    }

    return actions;
  }

  async getAlerts(params?: {
    type?: NetworkAlert['type'];
    priority?: AlertPriority;
    unresolved?: boolean;
  }): Promise<NetworkAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.type) {
      alerts = alerts.filter(a => a.type === params.type);
    }

    if (params?.priority) {
      alerts = alerts.filter(a => a.priority === params.priority);
    }

    if (params?.unresolved) {
      alerts = alerts.filter(a => !a.resolvedAt);
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<NetworkAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;
    return alert;
  }

  async resolveAlert(alertId: string): Promise<NetworkAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.resolvedAt = new Date();
    return alert;
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalTowers: number;
    byStatus: Record<TowerStatus, number>;
    totalPopulationServed: number;
    averageUtilization: number;
    activeOutages: number;
    affectedPopulation: number;
    mobileUnitsAvailable: number;
    mobileUnitsDeployed: number;
    activeAlerts: number;
    criticalAlerts: number;
  }> {
    const towers = Array.from(this.towers.values());
    const outages = await this.getOutages({ active: true });
    const mobileUnits = Array.from(this.mobileUnits.values());
    const alerts = await this.getAlerts({ unresolved: true });

    const byStatus: Record<TowerStatus, number> = {
      operational: 0, degraded: 0, offline: 0, damaged: 0, destroyed: 0, maintenance: 0, overloaded: 0
    };

    let totalPop = 0;
    let totalUtil = 0;

    towers.forEach(t => {
      byStatus[t.status]++;
      totalPop += t.coverage.populationServed;
      totalUtil += t.capacity.utilizationPercent;
    });

    const affectedPop = outages.reduce((sum, o) => sum + o.affectedPopulation, 0);

    return {
      totalTowers: towers.length,
      byStatus,
      totalPopulationServed: totalPop,
      averageUtilization: towers.length > 0 ? Math.round(totalUtil / towers.length) : 0,
      activeOutages: outages.length,
      affectedPopulation: affectedPop,
      mobileUnitsAvailable: mobileUnits.filter(u => u.status === 'available').length,
      mobileUnitsDeployed: mobileUnits.filter(u => u.status === 'deployed').length,
      activeAlerts: alerts.length,
      criticalAlerts: alerts.filter(a => a.priority === 'critical').length
    };
  }

  async getCoverageMap(): Promise<{
    towers: { id: string; name: string; status: TowerStatus; coordinates: { lat: number; lon: number }; radius: number }[];
    outageAreas: { center: { lat: number; lon: number }; radius: number }[];
    deployments: { unitId: string; name: string; coordinates: { lat: number; lon: number }; radius: number }[];
  }> {
    const towers = Array.from(this.towers.values()).map(t => ({
      id: t.id,
      name: t.name,
      status: t.status,
      coordinates: t.location.coordinates,
      radius: t.coverage.radius
    }));

    const outageAreas = (await this.getOutages({ active: true })).map(o => ({
      center: o.affectedArea.center,
      radius: o.affectedArea.radius
    }));

    const deployments = Array.from(this.mobileUnits.values())
      .filter(u => u.status === 'deployed' && u.currentLocation)
      .map(u => ({
        unitId: u.id,
        name: u.name,
        coordinates: u.currentLocation!,
        radius: u.capabilities.coverageRadius
      }));

    return { towers, outageAreas, deployments };
  }
}

export const telecomNetworkService = TelecomNetworkService.getInstance();
export default TelecomNetworkService;

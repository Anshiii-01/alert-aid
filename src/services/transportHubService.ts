/**
 * Transport Hub Service - Issue #149 Implementation
 * 
 * Provides comprehensive transportation hub management for disaster response
 * including airports, train stations, bus terminals, ports, evacuation points,
 * capacity tracking, and transit coordination.
 */

// Type definitions
type HubType = 'airport' | 'train_station' | 'bus_terminal' | 'port' | 'ferry_terminal' | 'metro_station' | 'multimodal' | 'evacuation_point';
type OperationalStatus = 'operational' | 'limited' | 'suspended' | 'closed' | 'emergency_only' | 'evacuation_mode';
type ServiceStatus = 'on_time' | 'delayed' | 'cancelled' | 'suspended' | 'diverted';
type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';
type VehicleType = 'aircraft' | 'train' | 'bus' | 'ferry' | 'ship' | 'metro' | 'emergency_vehicle';
type FacilityType = 'runway' | 'platform' | 'gate' | 'berth' | 'terminal' | 'parking' | 'fuel' | 'maintenance';

// Hub interfaces
interface TransportHub {
  id: string;
  name: string;
  code: string;
  type: HubType;
  location: HubLocation;
  facilities: Facility[];
  services: TransportService[];
  capacity: HubCapacity;
  operationalStatus: OperationalStatus;
  currentConditions: CurrentConditions;
  emergencyPlan: EmergencyPlan;
  contacts: HubContact[];
  vehicles: string[];
  incidents: string[];
  maintenanceSchedule: MaintenanceSchedule[];
  createdAt: Date;
  updatedAt: Date;
}

interface HubLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates: { lat: number; lon: number };
  timezone: string;
  elevation?: number; // meters
  accessRoutes: AccessRoute[];
  parkingCapacity: number;
  currentParking: number;
}

interface AccessRoute {
  id: string;
  name: string;
  type: 'highway' | 'road' | 'rail' | 'water';
  status: 'open' | 'restricted' | 'closed';
  condition: string;
  restrictions?: string;
}

interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  capacity: number;
  currentUsage: number;
  status: 'operational' | 'limited' | 'closed' | 'maintenance';
  specifications: Record<string, any>;
  lastInspected: Date;
  nextInspection: Date;
}

interface TransportService {
  id: string;
  type: VehicleType;
  operator: string;
  routeNumber: string;
  origin: string;
  destination: string;
  scheduledDeparture: Date;
  scheduledArrival: Date;
  actualDeparture?: Date;
  actualArrival?: Date;
  status: ServiceStatus;
  delay?: number; // minutes
  platform?: string;
  gate?: string;
  vehicleId?: string;
  capacity: number;
  passengers: number;
  notes?: string;
}

interface HubCapacity {
  maxPassengersPerHour: number;
  currentPassengersPerHour: number;
  maxVehicles: number;
  currentVehicles: number;
  evacuationCapacityPerHour: number;
  storageArea: number; // sq meters
  shelterCapacity: number;
  utilizationPercent: number;
}

interface CurrentConditions {
  weather: {
    description: string;
    temperature: number;
    visibility: number; // km
    windSpeed: number; // km/h
    windDirection: string;
    precipitation: string;
    alerts: string[];
  };
  traffic: {
    level: 'free_flow' | 'light' | 'moderate' | 'heavy' | 'severe';
    accessDelays: number; // minutes
    parkingAvailable: number;
  };
  security: {
    level: 'normal' | 'elevated' | 'high' | 'severe';
    restrictions: string[];
    checkpointWaitTime: number; // minutes
  };
  crowding: {
    level: 'low' | 'moderate' | 'high' | 'overcrowded';
    waitTimes: { area: string; minutes: number }[];
  };
}

interface EmergencyPlan {
  id: string;
  version: string;
  lastUpdated: Date;
  evacuationRoutes: EvacuationRoute[];
  assemblyPoints: AssemblyPoint[];
  shelterAreas: ShelterArea[];
  emergencyContacts: EmergencyContact[];
  procedures: EmergencyProcedure[];
  resources: EmergencyResource[];
}

interface EvacuationRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  capacity: number; // people per hour
  distance: number; // meters
  estimatedTime: number; // minutes
  accessibility: boolean;
  waypoints: { lat: number; lon: number }[];
}

interface AssemblyPoint {
  id: string;
  name: string;
  location: { lat: number; lon: number };
  capacity: number;
  type: 'indoor' | 'outdoor';
  facilities: string[];
  currentOccupancy: number;
}

interface ShelterArea {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  accessibility: boolean;
  supplies: { item: string; quantity: number }[];
}

interface EmergencyContact {
  role: string;
  name: string;
  organization: string;
  phone: string;
  altPhone?: string;
  email: string;
  available24x7: boolean;
}

interface EmergencyProcedure {
  id: string;
  scenario: string;
  steps: string[];
  responsibilities: { role: string; actions: string[] }[];
  resources: string[];
}

interface EmergencyResource {
  type: string;
  description: string;
  quantity: number;
  location: string;
  status: 'available' | 'deployed' | 'maintenance';
}

interface HubContact {
  role: string;
  name: string;
  department: string;
  phone: string;
  email: string;
  available24x7: boolean;
}

// Vehicle interfaces
interface Vehicle {
  id: string;
  type: VehicleType;
  identifier: string;
  operator: string;
  capacity: {
    passengers: number;
    cargo: number; // kg
    special?: string[];
  };
  currentLocation?: { lat: number; lon: number };
  status: 'in_service' | 'available' | 'maintenance' | 'emergency' | 'out_of_service';
  currentService?: string;
  fuelLevel?: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  certifications: string[];
  accessibility: boolean;
}

// Incident interfaces
interface HubIncident {
  id: string;
  hubId: string;
  type: 'security' | 'accident' | 'weather' | 'mechanical' | 'medical' | 'fire' | 'hazmat' | 'crowd';
  severity: AlertSeverity;
  location: string;
  description: string;
  reportedAt: Date;
  reportedBy: string;
  status: 'reported' | 'responding' | 'contained' | 'resolved' | 'escalated';
  affectedAreas: string[];
  affectedServices: string[];
  response: IncidentResponse;
  updates: IncidentUpdate[];
  resolvedAt?: Date;
}

interface IncidentResponse {
  commander?: string;
  responders: string[];
  actions: string[];
  evacuationInitiated: boolean;
  servicesAffected: string[];
  estimatedResolution?: Date;
}

interface IncidentUpdate {
  id: string;
  timestamp: Date;
  author: string;
  status: string;
  message: string;
}

// Maintenance interfaces
interface MaintenanceSchedule {
  id: string;
  facilityId: string;
  type: 'routine' | 'preventive' | 'corrective' | 'emergency';
  description: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  impact: 'none' | 'minor' | 'moderate' | 'major';
  contractor?: string;
}

// Alert interfaces
interface HubAlert {
  id: string;
  hubId: string;
  type: 'operational' | 'weather' | 'security' | 'capacity' | 'incident' | 'service';
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedServices: string[];
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'resolved';
  actions: string[];
  updates: string[];
}

// Evacuation interfaces
interface EvacuationOperation {
  id: string;
  hubId: string;
  incidentId?: string;
  type: 'precautionary' | 'mandatory' | 'emergency';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  targetPopulation: number;
  evacuatedCount: number;
  routes: string[];
  destinations: string[];
  vehicles: string[];
  coordinator: string;
  updates: EvacuationUpdate[];
}

interface EvacuationUpdate {
  id: string;
  timestamp: Date;
  evacuatedCount: number;
  status: string;
  notes: string;
}

// Sample data
const sampleHubs: TransportHub[] = [
  {
    id: 'hub-001',
    name: 'Metro International Airport',
    code: 'MIA',
    type: 'airport',
    location: {
      address: '1 Airport Boulevard',
      city: 'Metro City',
      state: 'CA',
      country: 'USA',
      coordinates: { lat: 34.0522, lon: -118.2437 },
      timezone: 'America/Los_Angeles',
      elevation: 38,
      accessRoutes: [
        { id: 'route-001', name: 'Highway 101', type: 'highway', status: 'open', condition: 'Good' },
        { id: 'route-002', name: 'Airport Rail Link', type: 'rail', status: 'open', condition: 'Good' }
      ],
      parkingCapacity: 15000,
      currentParking: 8500
    },
    facilities: [
      { id: 'fac-001', type: 'runway', name: 'Runway 25L/7R', capacity: 60, currentUsage: 35, status: 'operational', specifications: { length: 3500, width: 60 }, lastInspected: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), nextInspection: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000) },
      { id: 'fac-002', type: 'terminal', name: 'Terminal 1', capacity: 10000, currentUsage: 6000, status: 'operational', specifications: { gates: 25, area: 50000 }, lastInspected: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), nextInspection: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) }
    ],
    services: [],
    capacity: {
      maxPassengersPerHour: 8000,
      currentPassengersPerHour: 4500,
      maxVehicles: 200,
      currentVehicles: 85,
      evacuationCapacityPerHour: 15000,
      storageArea: 100000,
      shelterCapacity: 5000,
      utilizationPercent: 56
    },
    operationalStatus: 'operational',
    currentConditions: {
      weather: {
        description: 'Partly Cloudy',
        temperature: 22,
        visibility: 15,
        windSpeed: 15,
        windDirection: 'W',
        precipitation: 'None',
        alerts: []
      },
      traffic: {
        level: 'moderate',
        accessDelays: 10,
        parkingAvailable: 6500
      },
      security: {
        level: 'normal',
        restrictions: [],
        checkpointWaitTime: 15
      },
      crowding: {
        level: 'moderate',
        waitTimes: [
          { area: 'Security', minutes: 15 },
          { area: 'Immigration', minutes: 20 }
        ]
      }
    },
    emergencyPlan: {
      id: 'eplan-001',
      version: '2.1',
      lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      evacuationRoutes: [],
      assemblyPoints: [],
      shelterAreas: [],
      emergencyContacts: [],
      procedures: [],
      resources: []
    },
    contacts: [
      { role: 'Operations Director', name: 'James Wilson', department: 'Operations', phone: '555-0101', email: 'jwilson@mia.com', available24x7: true }
    ],
    vehicles: [],
    incidents: [],
    maintenanceSchedule: [],
    createdAt: new Date(Date.now() - 365 * 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class TransportHubService {
  private static instance: TransportHubService;
  private hubs: Map<string, TransportHub> = new Map();
  private vehicles: Map<string, Vehicle> = new Map();
  private incidents: Map<string, HubIncident> = new Map();
  private alerts: Map<string, HubAlert> = new Map();
  private evacuations: Map<string, EvacuationOperation> = new Map();

  private readonly CAPACITY_THRESHOLDS = {
    moderate: 60,
    high: 80,
    overcrowded: 95
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): TransportHubService {
    if (!TransportHubService.instance) {
      TransportHubService.instance = new TransportHubService();
    }
    return TransportHubService.instance;
  }

  private initializeSampleData(): void {
    sampleHubs.forEach(h => this.hubs.set(h.id, h));
  }

  // ==================== Hub Management ====================

  async createHub(params: Omit<TransportHub, 'id' | 'vehicles' | 'incidents' | 'createdAt' | 'updatedAt'>): Promise<TransportHub> {
    const hub: TransportHub = {
      ...params,
      id: `hub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vehicles: [],
      incidents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.hubs.set(hub.id, hub);
    return hub;
  }

  async getHub(hubId: string): Promise<TransportHub | null> {
    return this.hubs.get(hubId) || null;
  }

  async getHubs(params?: {
    type?: HubType;
    status?: OperationalStatus;
    city?: string;
    state?: string;
  }): Promise<TransportHub[]> {
    let hubs = Array.from(this.hubs.values());

    if (params?.type) {
      hubs = hubs.filter(h => h.type === params.type);
    }

    if (params?.status) {
      hubs = hubs.filter(h => h.operationalStatus === params.status);
    }

    if (params?.city) {
      hubs = hubs.filter(h => h.location.city === params.city);
    }

    if (params?.state) {
      hubs = hubs.filter(h => h.location.state === params.state);
    }

    return hubs;
  }

  async getHubsInRadius(center: { lat: number; lon: number }, radiusKm: number): Promise<TransportHub[]> {
    return Array.from(this.hubs.values()).filter(hub => {
      const distance = this.calculateDistance(
        center.lat, center.lon,
        hub.location.coordinates.lat, hub.location.coordinates.lon
      );
      return distance <= radiusKm;
    });
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

  async updateHubStatus(hubId: string, status: OperationalStatus, reason?: string): Promise<TransportHub> {
    const hub = this.hubs.get(hubId);
    if (!hub) throw new Error(`Hub not found: ${hubId}`);

    const previousStatus = hub.operationalStatus;
    hub.operationalStatus = status;
    hub.updatedAt = new Date();

    // Update services based on status
    if (status === 'closed' || status === 'suspended') {
      hub.services.forEach(s => {
        s.status = 'suspended';
      });
    }

    // Create alert if status changed significantly
    if (previousStatus === 'operational' && status !== 'operational') {
      await this.createAlert({
        hubId,
        type: 'operational',
        severity: status === 'closed' ? 'critical' : 'warning',
        title: `${hub.name} status changed to ${status}`,
        description: reason || `Hub operational status changed from ${previousStatus} to ${status}`,
        affectedServices: hub.services.map(s => s.id)
      });
    }

    return hub;
  }

  async updateHubCapacity(hubId: string, capacity: Partial<HubCapacity>): Promise<TransportHub> {
    const hub = this.hubs.get(hubId);
    if (!hub) throw new Error(`Hub not found: ${hubId}`);

    Object.assign(hub.capacity, capacity);

    // Calculate utilization
    if (capacity.currentPassengersPerHour !== undefined || capacity.maxPassengersPerHour !== undefined) {
      hub.capacity.utilizationPercent = Math.round(
        (hub.capacity.currentPassengersPerHour / hub.capacity.maxPassengersPerHour) * 100
      );
    }

    // Update crowding level
    const util = hub.capacity.utilizationPercent;
    if (util >= this.CAPACITY_THRESHOLDS.overcrowded) {
      hub.currentConditions.crowding.level = 'overcrowded';
    } else if (util >= this.CAPACITY_THRESHOLDS.high) {
      hub.currentConditions.crowding.level = 'high';
    } else if (util >= this.CAPACITY_THRESHOLDS.moderate) {
      hub.currentConditions.crowding.level = 'moderate';
    } else {
      hub.currentConditions.crowding.level = 'low';
    }

    hub.updatedAt = new Date();

    // Alert if overcrowded
    if (hub.currentConditions.crowding.level === 'overcrowded') {
      await this.createAlert({
        hubId,
        type: 'capacity',
        severity: 'warning',
        title: `${hub.name} approaching capacity`,
        description: `Current utilization: ${hub.capacity.utilizationPercent}%`,
        affectedServices: []
      });
    }

    return hub;
  }

  async updateConditions(hubId: string, conditions: Partial<CurrentConditions>): Promise<TransportHub> {
    const hub = this.hubs.get(hubId);
    if (!hub) throw new Error(`Hub not found: ${hubId}`);

    if (conditions.weather) {
      Object.assign(hub.currentConditions.weather, conditions.weather);
    }
    if (conditions.traffic) {
      Object.assign(hub.currentConditions.traffic, conditions.traffic);
    }
    if (conditions.security) {
      Object.assign(hub.currentConditions.security, conditions.security);
    }
    if (conditions.crowding) {
      Object.assign(hub.currentConditions.crowding, conditions.crowding);
    }

    hub.updatedAt = new Date();

    // Create weather alert if needed
    if (conditions.weather?.alerts && conditions.weather.alerts.length > 0) {
      await this.createAlert({
        hubId,
        type: 'weather',
        severity: 'warning',
        title: `Weather alert at ${hub.name}`,
        description: conditions.weather.alerts.join(', '),
        affectedServices: []
      });
    }

    return hub;
  }

  // ==================== Service Management ====================

  async addService(hubId: string, service: Omit<TransportService, 'id'>): Promise<TransportService> {
    const hub = this.hubs.get(hubId);
    if (!hub) throw new Error(`Hub not found: ${hubId}`);

    const newService: TransportService = {
      ...service,
      id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    hub.services.push(newService);
    hub.updatedAt = new Date();

    return newService;
  }

  async updateServiceStatus(hubId: string, serviceId: string, update: {
    status: ServiceStatus;
    delay?: number;
    actualDeparture?: Date;
    actualArrival?: Date;
    notes?: string;
  }): Promise<TransportService> {
    const hub = this.hubs.get(hubId);
    if (!hub) throw new Error(`Hub not found: ${hubId}`);

    const service = hub.services.find(s => s.id === serviceId);
    if (!service) throw new Error(`Service not found: ${serviceId}`);

    Object.assign(service, update);
    hub.updatedAt = new Date();

    // Create alert for significant delays or cancellations
    if (update.status === 'cancelled' || (update.delay && update.delay > 60)) {
      await this.createAlert({
        hubId,
        type: 'service',
        severity: update.status === 'cancelled' ? 'warning' : 'info',
        title: `Service ${service.routeNumber} ${update.status}`,
        description: update.notes || `Service ${update.status}${update.delay ? ` (${update.delay} min delay)` : ''}`,
        affectedServices: [serviceId]
      });
    }

    return service;
  }

  async getServices(hubId: string, params?: {
    type?: VehicleType;
    status?: ServiceStatus;
    destination?: string;
  }): Promise<TransportService[]> {
    const hub = this.hubs.get(hubId);
    if (!hub) throw new Error(`Hub not found: ${hubId}`);

    let services = hub.services;

    if (params?.type) {
      services = services.filter(s => s.type === params.type);
    }

    if (params?.status) {
      services = services.filter(s => s.status === params.status);
    }

    if (params?.destination) {
      services = services.filter(s =>
        s.destination.toLowerCase().includes(params.destination!.toLowerCase())
      );
    }

    return services.sort((a, b) => a.scheduledDeparture.getTime() - b.scheduledDeparture.getTime());
  }

  // ==================== Facility Management ====================

  async updateFacilityStatus(hubId: string, facilityId: string, status: Facility['status'], notes?: string): Promise<Facility> {
    const hub = this.hubs.get(hubId);
    if (!hub) throw new Error(`Hub not found: ${hubId}`);

    const facility = hub.facilities.find(f => f.id === facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    facility.status = status;
    hub.updatedAt = new Date();

    if (status === 'closed' || status === 'maintenance') {
      await this.createAlert({
        hubId,
        type: 'operational',
        severity: status === 'closed' ? 'warning' : 'info',
        title: `${facility.name} ${status}`,
        description: notes || `Facility status changed to ${status}`,
        affectedServices: []
      });
    }

    return facility;
  }

  // ==================== Vehicle Management ====================

  async registerVehicle(params: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const vehicle: Vehicle = {
      ...params,
      id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.vehicles.set(vehicle.id, vehicle);
    return vehicle;
  }

  async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    return this.vehicles.get(vehicleId) || null;
  }

  async getVehicles(params?: {
    type?: VehicleType;
    status?: Vehicle['status'];
    available?: boolean;
  }): Promise<Vehicle[]> {
    let vehicles = Array.from(this.vehicles.values());

    if (params?.type) {
      vehicles = vehicles.filter(v => v.type === params.type);
    }

    if (params?.status) {
      vehicles = vehicles.filter(v => v.status === params.status);
    }

    if (params?.available) {
      vehicles = vehicles.filter(v => v.status === 'available');
    }

    return vehicles;
  }

  async assignVehicleToService(vehicleId: string, serviceId: string): Promise<Vehicle> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) throw new Error(`Vehicle not found: ${vehicleId}`);

    if (vehicle.status !== 'available') {
      throw new Error(`Vehicle not available: ${vehicle.status}`);
    }

    vehicle.status = 'in_service';
    vehicle.currentService = serviceId;

    return vehicle;
  }

  async releaseVehicle(vehicleId: string): Promise<Vehicle> {
    const vehicle = this.vehicles.get(vehicleId);
    if (!vehicle) throw new Error(`Vehicle not found: ${vehicleId}`);

    vehicle.status = 'available';
    vehicle.currentService = undefined;

    return vehicle;
  }

  // ==================== Incident Management ====================

  async reportIncident(params: {
    hubId: string;
    type: HubIncident['type'];
    severity: AlertSeverity;
    location: string;
    description: string;
    reportedBy: string;
  }): Promise<HubIncident> {
    const hub = this.hubs.get(params.hubId);
    if (!hub) throw new Error(`Hub not found: ${params.hubId}`);

    const incident: HubIncident = {
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      hubId: params.hubId,
      type: params.type,
      severity: params.severity,
      location: params.location,
      description: params.description,
      reportedAt: new Date(),
      reportedBy: params.reportedBy,
      status: 'reported',
      affectedAreas: [params.location],
      affectedServices: [],
      response: {
        responders: [],
        actions: [],
        evacuationInitiated: false,
        servicesAffected: []
      },
      updates: [{
        id: `update-${Date.now()}`,
        timestamp: new Date(),
        author: 'System',
        status: 'reported',
        message: params.description
      }]
    };

    this.incidents.set(incident.id, incident);
    hub.incidents.push(incident.id);
    hub.updatedAt = new Date();

    // Create corresponding alert
    await this.createAlert({
      hubId: params.hubId,
      type: 'incident',
      severity: params.severity,
      title: `${params.type} incident at ${hub.name}`,
      description: params.description,
      affectedServices: []
    });

    // Update hub status based on severity
    if (params.severity === 'emergency' || params.severity === 'critical') {
      await this.updateHubStatus(params.hubId, 'limited', `Incident: ${params.description}`);
    }

    return incident;
  }

  async updateIncident(incidentId: string, update: {
    status?: HubIncident['status'];
    affectedAreas?: string[];
    affectedServices?: string[];
    response?: Partial<IncidentResponse>;
    message?: string;
    author?: string;
  }): Promise<HubIncident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    if (update.status) {
      incident.status = update.status;
      if (update.status === 'resolved') {
        incident.resolvedAt = new Date();
      }
    }

    if (update.affectedAreas) {
      incident.affectedAreas = update.affectedAreas;
    }

    if (update.affectedServices) {
      incident.affectedServices = update.affectedServices;
    }

    if (update.response) {
      Object.assign(incident.response, update.response);
    }

    if (update.message) {
      incident.updates.push({
        id: `update-${Date.now()}`,
        timestamp: new Date(),
        author: update.author || 'System',
        status: incident.status,
        message: update.message
      });
    }

    return incident;
  }

  async getIncidents(params?: {
    hubId?: string;
    status?: HubIncident['status'];
    severity?: AlertSeverity;
    active?: boolean;
  }): Promise<HubIncident[]> {
    let incidents = Array.from(this.incidents.values());

    if (params?.hubId) {
      incidents = incidents.filter(i => i.hubId === params.hubId);
    }

    if (params?.status) {
      incidents = incidents.filter(i => i.status === params.status);
    }

    if (params?.severity) {
      incidents = incidents.filter(i => i.severity === params.severity);
    }

    if (params?.active) {
      incidents = incidents.filter(i => i.status !== 'resolved');
    }

    return incidents.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
  }

  // ==================== Alert Management ====================

  private async createAlert(params: Omit<HubAlert, 'id' | 'startTime' | 'status' | 'actions' | 'updates'>): Promise<HubAlert> {
    const alert: HubAlert = {
      ...params,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date(),
      status: 'active',
      actions: this.getAlertActions(params.type, params.severity),
      updates: []
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private getAlertActions(type: HubAlert['type'], severity: AlertSeverity): string[] {
    const actions: string[] = [];

    if (severity === 'emergency' || severity === 'critical') {
      actions.push('Activate emergency operations center');
      actions.push('Notify senior management');
      actions.push('Consider evacuation procedures');
    }

    switch (type) {
      case 'operational':
        actions.push('Assess impact on services');
        actions.push('Notify affected operators');
        actions.push('Update passenger information systems');
        break;
      case 'weather':
        actions.push('Monitor weather updates');
        actions.push('Prepare contingency plans');
        actions.push('Alert ground operations');
        break;
      case 'security':
        actions.push('Coordinate with security personnel');
        actions.push('Implement access controls');
        actions.push('Brief law enforcement');
        break;
      case 'capacity':
        actions.push('Implement crowd control measures');
        actions.push('Open additional processing lanes');
        actions.push('Consider restricting access');
        break;
    }

    return actions;
  }

  async getAlerts(params?: {
    hubId?: string;
    type?: HubAlert['type'];
    severity?: AlertSeverity;
    active?: boolean;
  }): Promise<HubAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.hubId) {
      alerts = alerts.filter(a => a.hubId === params.hubId);
    }

    if (params?.type) {
      alerts = alerts.filter(a => a.type === params.type);
    }

    if (params?.severity) {
      alerts = alerts.filter(a => a.severity === params.severity);
    }

    if (params?.active) {
      alerts = alerts.filter(a => a.status === 'active');
    }

    return alerts.sort((a, b) => {
      const severityOrder = { emergency: 0, critical: 1, warning: 2, info: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  async resolveAlert(alertId: string): Promise<HubAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.status = 'resolved';
    alert.endTime = new Date();
    return alert;
  }

  // ==================== Evacuation Management ====================

  async initiateEvacuation(params: {
    hubId: string;
    incidentId?: string;
    type: EvacuationOperation['type'];
    routes: string[];
    destinations: string[];
    targetPopulation: number;
    coordinator: string;
  }): Promise<EvacuationOperation> {
    const hub = this.hubs.get(params.hubId);
    if (!hub) throw new Error(`Hub not found: ${params.hubId}`);

    const evacuation: EvacuationOperation = {
      id: `evac-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      hubId: params.hubId,
      incidentId: params.incidentId,
      type: params.type,
      status: 'in_progress',
      startTime: new Date(),
      targetPopulation: params.targetPopulation,
      evacuatedCount: 0,
      routes: params.routes,
      destinations: params.destinations,
      vehicles: [],
      coordinator: params.coordinator,
      updates: [{
        id: `update-${Date.now()}`,
        timestamp: new Date(),
        evacuatedCount: 0,
        status: 'initiated',
        notes: `Evacuation initiated by ${params.coordinator}`
      }]
    };

    this.evacuations.set(evacuation.id, evacuation);

    // Update hub status
    await this.updateHubStatus(params.hubId, 'evacuation_mode', 'Evacuation in progress');

    // Create emergency alert
    await this.createAlert({
      hubId: params.hubId,
      type: 'operational',
      severity: 'emergency',
      title: `${params.type.toUpperCase()} Evacuation at ${hub.name}`,
      description: `Target population: ${params.targetPopulation}`,
      affectedServices: hub.services.map(s => s.id)
    });

    return evacuation;
  }

  async updateEvacuation(evacuationId: string, update: {
    evacuatedCount: number;
    status?: EvacuationOperation['status'];
    notes?: string;
    vehiclesAssigned?: string[];
  }): Promise<EvacuationOperation> {
    const evacuation = this.evacuations.get(evacuationId);
    if (!evacuation) throw new Error(`Evacuation not found: ${evacuationId}`);

    evacuation.evacuatedCount = update.evacuatedCount;

    if (update.status) {
      evacuation.status = update.status;
      if (update.status === 'completed') {
        evacuation.endTime = new Date();
      }
    }

    if (update.vehiclesAssigned) {
      evacuation.vehicles = update.vehiclesAssigned;
    }

    evacuation.updates.push({
      id: `update-${Date.now()}`,
      timestamp: new Date(),
      evacuatedCount: update.evacuatedCount,
      status: update.status || evacuation.status,
      notes: update.notes || `Evacuated count updated to ${update.evacuatedCount}`
    });

    return evacuation;
  }

  async getEvacuations(params?: {
    hubId?: string;
    status?: EvacuationOperation['status'];
    active?: boolean;
  }): Promise<EvacuationOperation[]> {
    let evacuations = Array.from(this.evacuations.values());

    if (params?.hubId) {
      evacuations = evacuations.filter(e => e.hubId === params.hubId);
    }

    if (params?.status) {
      evacuations = evacuations.filter(e => e.status === params.status);
    }

    if (params?.active) {
      evacuations = evacuations.filter(e =>
        e.status === 'planned' || e.status === 'in_progress'
      );
    }

    return evacuations.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalHubs: number;
    byType: Record<HubType, number>;
    byStatus: Record<OperationalStatus, number>;
    totalCapacity: number;
    currentUtilization: number;
    activeIncidents: number;
    activeAlerts: number;
    activeEvacuations: number;
    totalVehicles: number;
    availableVehicles: number;
    delayedServices: number;
    cancelledServices: number;
  }> {
    const hubs = Array.from(this.hubs.values());
    const vehicles = Array.from(this.vehicles.values());
    const incidents = await this.getIncidents({ active: true });
    const alerts = await this.getAlerts({ active: true });
    const evacuations = await this.getEvacuations({ active: true });

    const byType: Record<HubType, number> = {
      airport: 0, train_station: 0, bus_terminal: 0, port: 0,
      ferry_terminal: 0, metro_station: 0, multimodal: 0, evacuation_point: 0
    };
    const byStatus: Record<OperationalStatus, number> = {
      operational: 0, limited: 0, suspended: 0, closed: 0, emergency_only: 0, evacuation_mode: 0
    };

    let totalCapacity = 0;
    let currentUtil = 0;
    let delayedServices = 0;
    let cancelledServices = 0;

    hubs.forEach(h => {
      byType[h.type]++;
      byStatus[h.operationalStatus]++;
      totalCapacity += h.capacity.maxPassengersPerHour;
      currentUtil += h.capacity.currentPassengersPerHour;

      h.services.forEach(s => {
        if (s.status === 'delayed') delayedServices++;
        if (s.status === 'cancelled') cancelledServices++;
      });
    });

    return {
      totalHubs: hubs.length,
      byType,
      byStatus,
      totalCapacity,
      currentUtilization: totalCapacity > 0 ? Math.round((currentUtil / totalCapacity) * 100) : 0,
      activeIncidents: incidents.length,
      activeAlerts: alerts.length,
      activeEvacuations: evacuations.length,
      totalVehicles: vehicles.length,
      availableVehicles: vehicles.filter(v => v.status === 'available').length,
      delayedServices,
      cancelledServices
    };
  }
}

export const transportHubService = TransportHubService.getInstance();
export default TransportHubService;

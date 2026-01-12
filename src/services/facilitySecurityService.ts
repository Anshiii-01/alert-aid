/**
 * Facility Security Service - Issue #170 Implementation
 * 
 * Provides comprehensive facility security management for disaster response
 * including building security, access management, surveillance systems,
 * alarm monitoring, and facility protection protocols.
 */

// Type definitions
type FacilityType = 'eoc' | 'shelter' | 'distribution_center' | 'medical' | 'staging' | 'warehouse' | 'command_post' | 'government' | 'critical_infrastructure';
type FacilitySecurityStatus = 'normal' | 'elevated' | 'high_alert' | 'lockdown' | 'evacuated' | 'compromised';
type AlarmType = 'intrusion' | 'fire' | 'panic' | 'duress' | 'environmental' | 'tamper' | 'medical' | 'access_violation';
type AlarmPriority = 'low' | 'medium' | 'high' | 'critical';
type AlarmStatus = 'active' | 'acknowledged' | 'investigating' | 'resolved' | 'false_alarm';

// Facility interfaces
interface SecuredFacility {
  id: string;
  name: string;
  type: FacilityType;
  status: FacilitySecurityStatus;
  location: FacilityLocation;
  classification: SecurityClassification;
  physicalSecurity: PhysicalSecurityFeatures;
  accessControl: FacilityAccessControl;
  surveillance: SurveillanceSystem;
  alarmSystems: AlarmSystem[];
  emergencyPlans: EmergencyPlan[];
  securityContacts: SecurityContact[];
  inspections: SecurityInspection[];
  incidents: FacilityIncident[];
  operationalSchedule: OperationalSchedule;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FacilityLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: [number, number];
  campus?: string;
  building?: string;
  floors: number;
  squareFootage: number;
}

interface SecurityClassification {
  level: 'unclassified' | 'sensitive' | 'confidential' | 'restricted' | 'highly_restricted';
  specialDesignations: string[];
  complianceRequirements: string[];
  clearanceRequired?: string;
}

interface PhysicalSecurityFeatures {
  perimeterSecurity: PerimeterSecurity;
  entrances: EntrancePoint[];
  barriers: PhysicalBarrier[];
  lighting: LightingSystem;
  signage: SecuritySignage[];
  safeRooms?: SafeRoom[];
  parkingAreas: ParkingArea[];
}

interface PerimeterSecurity {
  type: 'fence' | 'wall' | 'natural' | 'none';
  height?: number;
  material?: string;
  toppings?: string[];
  gates: GateInfo[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastInspected: Date;
}

interface GateInfo {
  id: string;
  name: string;
  type: 'vehicle' | 'pedestrian' | 'emergency';
  location: string;
  accessControl: string;
  operatingHours?: { open: string; close: string };
  status: 'operational' | 'closed' | 'damaged';
}

interface EntrancePoint {
  id: string;
  name: string;
  type: 'main' | 'secondary' | 'emergency' | 'loading' | 'restricted';
  location: string;
  floor: number;
  accessLevel: string;
  controlMethods: string[];
  monitoringDevices: string[];
  staffed: boolean;
  operatingHours?: { open: string; close: string };
  status: 'operational' | 'locked' | 'emergency_only' | 'disabled';
}

interface PhysicalBarrier {
  type: 'bollard' | 'planter' | 'jersey_barrier' | 'crash_gate' | 'turnstile' | 'mantrap';
  location: string;
  quantity: number;
  purpose: string;
  ratedProtection?: string;
}

interface LightingSystem {
  coverage: 'full' | 'partial' | 'minimal';
  type: string[];
  backupPower: boolean;
  motionActivated: boolean;
  controlSystem: string;
  lastMaintenance: Date;
}

interface SecuritySignage {
  type: 'warning' | 'access' | 'camera' | 'restricted' | 'emergency' | 'evacuation';
  location: string;
  message: string;
  compliant: boolean;
}

interface SafeRoom {
  id: string;
  name: string;
  location: string;
  floor: number;
  capacity: number;
  features: string[];
  supplies: { item: string; quantity: number }[];
  communication: string[];
  lastInspected: Date;
}

interface ParkingArea {
  id: string;
  name: string;
  type: 'surface' | 'garage' | 'underground';
  capacity: number;
  accessControl: string;
  surveillance: boolean;
  lighting: 'adequate' | 'needs_improvement';
  restrictions?: string;
}

// Access control interfaces
interface FacilityAccessControl {
  system: AccessControlSystem;
  policies: AccessPolicy[];
  schedules: AccessSchedule[];
  visitorManagement: VisitorManagement;
  keyManagement: KeyManagement;
  auditLogs: AccessAuditLog[];
}

interface AccessControlSystem {
  vendor: string;
  model: string;
  type: 'card' | 'biometric' | 'pin' | 'multi_factor';
  totalReaders: number;
  totalDoors: number;
  integration: string[];
  backupPower: boolean;
  failsafeMode: 'locked' | 'unlocked';
  lastMaintenance: Date;
  status: 'operational' | 'degraded' | 'offline';
}

interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  accessLevel: string;
  areas: string[];
  timeRestrictions?: { days: string[]; startTime: string; endTime: string };
  requiredCredentials: string[];
  escortRequired: boolean;
  approvalRequired: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
}

interface AccessSchedule {
  id: string;
  name: string;
  type: 'business_hours' | 'extended' | '24_7' | 'emergency' | 'custom';
  schedule: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    accessLevel: string;
  }[];
  holidays: { date: Date; schedule: string }[];
}

interface VisitorManagement {
  system: string;
  preRegistrationRequired: boolean;
  idVerification: boolean;
  badgeRequired: boolean;
  escortRequired: boolean;
  signInProcedure: string[];
  signOutProcedure: string[];
  restrictedAreas: string[];
  maxVisitorCapacity?: number;
}

interface KeyManagement {
  system: 'manual' | 'electronic' | 'key_cabinet';
  totalKeys: number;
  keyTypes: { type: string; quantity: number; access: string }[];
  issuanceProcedure: string[];
  returnProcedure: string[];
  auditFrequency: string;
  lastAudit: Date;
}

interface AccessAuditLog {
  id: string;
  timestamp: Date;
  cardHolder?: string;
  door: string;
  action: 'granted' | 'denied' | 'alarm' | 'held_open' | 'forced';
  reason?: string;
}

// Surveillance interfaces
interface SurveillanceSystem {
  vendor: string;
  vmsType: string;
  totalCameras: number;
  cameras: Camera[];
  recordingCapacity: { days: number; storageType: string };
  monitoringStations: MonitoringStation[];
  analytics: VideoAnalytics[];
  integration: string[];
  backup: { type: string; location: string; retention: number };
  status: 'operational' | 'degraded' | 'offline';
}

interface Camera {
  id: string;
  name: string;
  type: 'fixed' | 'ptz' | 'dome' | 'bullet' | 'thermal';
  location: string;
  floor?: number;
  coverage: string;
  resolution: string;
  capabilities: string[];
  recording: boolean;
  status: 'operational' | 'offline' | 'maintenance';
  lastMaintenance?: Date;
}

interface MonitoringStation {
  id: string;
  name: string;
  location: string;
  monitors: number;
  cameraCapacity: number;
  staffed: boolean;
  staffingSchedule?: string;
  capabilities: string[];
}

interface VideoAnalytics {
  type: 'motion_detection' | 'facial_recognition' | 'license_plate' | 'object_detection' | 'crowd_detection' | 'behavioral';
  enabled: boolean;
  cameras: string[];
  alertThreshold?: string;
  accuracy?: number;
}

// Alarm interfaces
interface AlarmSystem {
  id: string;
  type: AlarmType;
  vendor: string;
  model: string;
  zones: AlarmZone[];
  panels: AlarmPanel[];
  monitoring: AlarmMonitoring;
  responseProtocols: AlarmResponseProtocol[];
  testing: AlarmTesting;
  status: 'armed' | 'disarmed' | 'alarm' | 'trouble' | 'maintenance';
  lastMaintenance: Date;
}

interface AlarmZone {
  id: string;
  name: string;
  type: string;
  location: string;
  sensors: AlarmSensor[];
  status: 'normal' | 'alarm' | 'trouble' | 'bypassed';
  sensitivity: 'low' | 'medium' | 'high';
}

interface AlarmSensor {
  id: string;
  type: 'pir' | 'door_contact' | 'glass_break' | 'smoke' | 'heat' | 'water' | 'motion' | 'vibration';
  location: string;
  status: 'normal' | 'alarm' | 'tamper' | 'low_battery' | 'offline';
  lastTriggered?: Date;
}

interface AlarmPanel {
  id: string;
  name: string;
  location: string;
  zones: string[];
  backupPower: boolean;
  batteryStatus: number;
  communicationPaths: string[];
  status: 'normal' | 'alarm' | 'trouble';
}

interface AlarmMonitoring {
  centralStation: string;
  primaryPath: string;
  backupPath?: string;
  responseCompany?: string;
  responseTime: string;
  contacts: { name: string; phone: string; order: number }[];
  verificationRequired: boolean;
}

interface AlarmResponseProtocol {
  alarmType: AlarmType;
  priority: AlarmPriority;
  steps: string[];
  notifications: string[];
  escalation: { time: number; action: string }[];
  documentation: string[];
}

interface AlarmTesting {
  frequency: string;
  lastTest: Date;
  nextTest: Date;
  testResults: { date: Date; result: 'pass' | 'fail'; notes?: string }[];
}

// Alarm event interfaces
interface AlarmEvent {
  id: string;
  facilityId: string;
  facilityName: string;
  alarmSystemId: string;
  alarmType: AlarmType;
  priority: AlarmPriority;
  status: AlarmStatus;
  zone: string;
  sensor?: string;
  triggeredAt: Date;
  description: string;
  location: string;
  responseActions: AlarmResponseAction[];
  resolution?: AlarmResolution;
  timeline: AlarmTimelineEntry[];
  createdAt: Date;
  updatedAt: Date;
}

interface AlarmResponseAction {
  id: string;
  action: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

interface AlarmResolution {
  cause: string;
  actionTaken: string;
  resolvedBy: string;
  resolvedAt: Date;
  preventiveMeasures?: string[];
  followUpRequired: boolean;
}

interface AlarmTimelineEntry {
  timestamp: Date;
  event: string;
  actor: string;
}

// Emergency plan interfaces
interface EmergencyPlan {
  id: string;
  type: 'evacuation' | 'lockdown' | 'shelter_in_place' | 'active_shooter' | 'fire' | 'medical' | 'bomb_threat' | 'hazmat';
  name: string;
  version: string;
  lastUpdated: Date;
  nextReview: Date;
  procedures: ProcedureStep[];
  evacuationRoutes?: EvacuationRoute[];
  assemblyPoints?: AssemblyPoint[];
  communications: EmergencyComms;
  resources: EmergencyResource[];
  contacts: EmergencyContact[];
  training: TrainingRecord[];
  drills: DrillRecord[];
}

interface ProcedureStep {
  order: number;
  action: string;
  responsible: string;
  timeline?: string;
  notes?: string;
}

interface EvacuationRoute {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  floors: number[];
  path: string;
  accessibility: boolean;
  capacity: number;
  alternateRoute?: string;
}

interface AssemblyPoint {
  id: string;
  name: string;
  location: string;
  coordinates?: [number, number];
  capacity: number;
  primary: boolean;
  amenities: string[];
}

interface EmergencyComms {
  primaryMethod: string;
  backupMethods: string[];
  announcements: { type: string; script: string }[];
  contactList: { role: string; name: string; phone: string }[];
}

interface EmergencyResource {
  type: string;
  location: string;
  quantity: number;
  lastInspected: Date;
}

interface EmergencyContact {
  agency: string;
  role: string;
  name?: string;
  phone: string;
  available: string;
}

interface TrainingRecord {
  date: Date;
  type: string;
  attendees: number;
  instructor: string;
  topics: string[];
  pass: boolean;
}

interface DrillRecord {
  id: string;
  date: Date;
  type: string;
  announced: boolean;
  participants: number;
  duration: number;
  objectives: string[];
  results: string;
  improvements: string[];
  nextDrillDate?: Date;
}

// Security inspection interfaces
interface SecurityInspection {
  id: string;
  facilityId: string;
  type: 'routine' | 'annual' | 'compliance' | 'incident_follow_up' | 'special';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  completedDate?: Date;
  inspector: InspectorInfo;
  checklist: InspectionChecklist;
  findings: InspectionFinding[];
  overallRating: 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  report?: InspectionReport;
  createdAt: Date;
  updatedAt: Date;
}

interface InspectorInfo {
  name: string;
  organization: string;
  credentials: string[];
  contact: string;
}

interface InspectionChecklist {
  categories: {
    name: string;
    items: {
      id: string;
      description: string;
      requirement: string;
      status: 'compliant' | 'non_compliant' | 'na' | 'not_inspected';
      notes?: string;
    }[];
  }[];
}

interface InspectionFinding {
  id: string;
  category: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  description: string;
  requirement: string;
  location?: string;
  evidence?: string;
  recommendation: string;
  dueDate?: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  resolution?: string;
}

interface InspectionReport {
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  criticalFindings: number;
  majorFindings: number;
  minorFindings: number;
  recommendations: string[];
  followUpDate?: Date;
}

// Security contact interfaces
interface SecurityContact {
  id: string;
  name: string;
  role: string;
  organization: string;
  phone: string;
  altPhone?: string;
  email: string;
  available: string;
  primary: boolean;
}

// Facility incident interfaces
interface FacilityIncident {
  id: string;
  incidentNumber: string;
  type: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  date: Date;
  location: string;
  description: string;
  reportedBy: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
}

// Operational schedule interfaces
interface OperationalSchedule {
  businessHours: { dayOfWeek: string; open: string; close: string }[];
  holidays: { date: Date; name: string; hours?: string }[];
  specialEvents: { date: Date; name: string; securityRequirements: string }[];
  maintenanceWindows: { dayOfWeek: string; start: string; end: string; systems: string[] }[];
}

// Sample data
const sampleFacilities: SecuredFacility[] = [
  {
    id: 'facility-001',
    name: 'County Emergency Operations Center',
    type: 'eoc',
    status: 'normal',
    location: {
      address: '100 Emergency Way',
      city: 'Springfield',
      state: 'CA',
      zipCode: '95814',
      coordinates: [38.5816, -121.4944],
      building: 'EOC Building',
      floors: 2,
      squareFootage: 25000
    },
    classification: {
      level: 'restricted',
      specialDesignations: ['Critical Infrastructure', 'Essential Facility'],
      complianceRequirements: ['NIMS', 'FEMA', 'DHS'],
      clearanceRequired: 'Background Check'
    },
    physicalSecurity: {
      perimeterSecurity: {
        type: 'fence',
        height: 8,
        material: 'Chain Link',
        toppings: ['Barbed Wire'],
        gates: [
          {
            id: 'gate-001',
            name: 'Main Vehicle Gate',
            type: 'vehicle',
            location: 'North Side',
            accessControl: 'Card Reader + Intercom',
            operatingHours: { open: '06:00', close: '22:00' },
            status: 'operational'
          }
        ],
        condition: 'good',
        lastInspected: new Date('2024-01-15')
      },
      entrances: [
        {
          id: 'entrance-001',
          name: 'Main Entrance',
          type: 'main',
          location: 'Front of Building',
          floor: 1,
          accessLevel: 'All Employees',
          controlMethods: ['Badge Reader', 'Mantrap'],
          monitoringDevices: ['CCTV', 'Intercom'],
          staffed: true,
          operatingHours: { open: '07:00', close: '19:00' },
          status: 'operational'
        }
      ],
      barriers: [
        {
          type: 'bollard',
          location: 'Main Entrance',
          quantity: 6,
          purpose: 'Vehicle Mitigation',
          ratedProtection: 'K8'
        }
      ],
      lighting: {
        coverage: 'full',
        type: ['LED', 'Motion-Activated'],
        backupPower: true,
        motionActivated: true,
        controlSystem: 'BMS Integration',
        lastMaintenance: new Date('2024-01-01')
      },
      signage: [
        {
          type: 'warning',
          location: 'Perimeter Fence',
          message: 'Restricted Area - Authorized Personnel Only',
          compliant: true
        }
      ],
      safeRooms: [
        {
          id: 'safe-001',
          name: 'Executive Safe Room',
          location: 'Floor 2, Room 201',
          floor: 2,
          capacity: 10,
          features: ['Reinforced Walls', 'Ballistic Glass', 'Independent HVAC'],
          supplies: [
            { item: 'Water', quantity: 20 },
            { item: 'First Aid Kit', quantity: 2 }
          ],
          communication: ['Satellite Phone', 'Radio'],
          lastInspected: new Date('2024-01-10')
        }
      ],
      parkingAreas: [
        {
          id: 'parking-001',
          name: 'Main Parking Lot',
          type: 'surface',
          capacity: 100,
          accessControl: 'Badge Required',
          surveillance: true,
          lighting: 'adequate'
        }
      ]
    },
    accessControl: {
      system: {
        vendor: 'HID Global',
        model: 'EDGE EVO',
        type: 'multi_factor',
        totalReaders: 24,
        totalDoors: 20,
        integration: ['CCTV', 'Fire Alarm', 'Building Management'],
        backupPower: true,
        failsafeMode: 'locked',
        lastMaintenance: new Date('2024-01-05'),
        status: 'operational'
      },
      policies: [],
      schedules: [],
      visitorManagement: {
        system: 'Visitor Pro',
        preRegistrationRequired: true,
        idVerification: true,
        badgeRequired: true,
        escortRequired: true,
        signInProcedure: ['Present ID', 'Verify appointment', 'Issue badge', 'Escort arrives'],
        signOutProcedure: ['Return badge', 'Sign out'],
        restrictedAreas: ['Server Room', 'Communications Center', 'Executive Suite'],
        maxVisitorCapacity: 50
      },
      keyManagement: {
        system: 'electronic',
        totalKeys: 50,
        keyTypes: [
          { type: 'Master', quantity: 3, access: 'All Areas' },
          { type: 'Department', quantity: 15, access: 'Department Areas' }
        ],
        issuanceProcedure: ['Submit request', 'Manager approval', 'Security issues key'],
        returnProcedure: ['Return to security', 'Sign key log'],
        auditFrequency: 'Monthly',
        lastAudit: new Date('2024-01-01')
      },
      auditLogs: []
    },
    surveillance: {
      vendor: 'Axis Communications',
      vmsType: 'Milestone XProtect',
      totalCameras: 32,
      cameras: [],
      recordingCapacity: { days: 30, storageType: 'NVR' },
      monitoringStations: [
        {
          id: 'mon-001',
          name: 'Security Control Room',
          location: 'Floor 1',
          monitors: 6,
          cameraCapacity: 32,
          staffed: true,
          staffingSchedule: '24/7',
          capabilities: ['Live View', 'Playback', 'Analytics', 'Export']
        }
      ],
      analytics: [
        {
          type: 'motion_detection',
          enabled: true,
          cameras: ['All'],
          alertThreshold: 'Medium'
        }
      ],
      integration: ['Access Control', 'Fire Alarm'],
      backup: { type: 'Off-site', location: 'Cloud Storage', retention: 90 },
      status: 'operational'
    },
    alarmSystems: [],
    emergencyPlans: [],
    securityContacts: [
      {
        id: 'contact-001',
        name: 'Chief Security Officer',
        role: 'Security Director',
        organization: 'County EM',
        phone: '555-0400',
        email: 'security@county.gov',
        available: '24/7',
        primary: true
      }
    ],
    inspections: [],
    incidents: [],
    operationalSchedule: {
      businessHours: [
        { dayOfWeek: 'Monday', open: '07:00', close: '19:00' },
        { dayOfWeek: 'Tuesday', open: '07:00', close: '19:00' },
        { dayOfWeek: 'Wednesday', open: '07:00', close: '19:00' },
        { dayOfWeek: 'Thursday', open: '07:00', close: '19:00' },
        { dayOfWeek: 'Friday', open: '07:00', close: '19:00' }
      ],
      holidays: [],
      specialEvents: [],
      maintenanceWindows: []
    },
    notes: 'Primary EOC facility with enhanced security measures',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  }
];

class FacilitySecurityService {
  private static instance: FacilitySecurityService;
  private facilities: Map<string, SecuredFacility> = new Map();
  private alarmEvents: Map<string, AlarmEvent> = new Map();
  private inspections: Map<string, SecurityInspection> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): FacilitySecurityService {
    if (!FacilitySecurityService.instance) {
      FacilitySecurityService.instance = new FacilitySecurityService();
    }
    return FacilitySecurityService.instance;
  }

  private initializeSampleData(): void {
    sampleFacilities.forEach(f => this.facilities.set(f.id, f));
  }

  // ==================== Facility Management ====================

  async createFacility(params: Omit<SecuredFacility, 'id' | 'incidents' | 'createdAt' | 'updatedAt'>): Promise<SecuredFacility> {
    const facility: SecuredFacility = {
      ...params,
      id: `facility-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.facilities.set(facility.id, facility);
    return facility;
  }

  async getFacility(facilityId: string): Promise<SecuredFacility | null> {
    return this.facilities.get(facilityId) || null;
  }

  async getAllFacilities(params?: {
    type?: FacilityType;
    status?: FacilitySecurityStatus;
    city?: string;
    classification?: string;
  }): Promise<SecuredFacility[]> {
    let facilities = Array.from(this.facilities.values());

    if (params?.type) {
      facilities = facilities.filter(f => f.type === params.type);
    }

    if (params?.status) {
      facilities = facilities.filter(f => f.status === params.status);
    }

    if (params?.city) {
      facilities = facilities.filter(f => f.location.city === params.city);
    }

    if (params?.classification) {
      facilities = facilities.filter(f => f.classification.level === params.classification);
    }

    return facilities.sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateFacilityStatus(facilityId: string, status: FacilitySecurityStatus): Promise<SecuredFacility> {
    const facility = this.facilities.get(facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    facility.status = status;
    facility.updatedAt = new Date();
    return facility;
  }

  async addEntrance(facilityId: string, entrance: Omit<EntrancePoint, 'id'>): Promise<SecuredFacility> {
    const facility = this.facilities.get(facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    facility.physicalSecurity.entrances.push({
      ...entrance,
      id: `entrance-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    facility.updatedAt = new Date();
    return facility;
  }

  async addCamera(facilityId: string, camera: Omit<Camera, 'id'>): Promise<SecuredFacility> {
    const facility = this.facilities.get(facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    facility.surveillance.cameras.push({
      ...camera,
      id: `cam-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    facility.surveillance.totalCameras = facility.surveillance.cameras.length;
    facility.updatedAt = new Date();
    return facility;
  }

  async addAlarmSystem(facilityId: string, alarmSystem: Omit<AlarmSystem, 'id'>): Promise<SecuredFacility> {
    const facility = this.facilities.get(facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    facility.alarmSystems.push({
      ...alarmSystem,
      id: `alarm-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    facility.updatedAt = new Date();
    return facility;
  }

  async addEmergencyPlan(facilityId: string, plan: Omit<EmergencyPlan, 'id'>): Promise<SecuredFacility> {
    const facility = this.facilities.get(facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    facility.emergencyPlans.push({
      ...plan,
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    facility.updatedAt = new Date();
    return facility;
  }

  // ==================== Alarm Event Management ====================

  async createAlarmEvent(params: Omit<AlarmEvent, 'id' | 'status' | 'responseActions' | 'timeline' | 'createdAt' | 'updatedAt'>): Promise<AlarmEvent> {
    const event: AlarmEvent = {
      ...params,
      id: `alarm-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      responseActions: [],
      timeline: [{ timestamp: params.triggeredAt, event: 'Alarm triggered', actor: 'System' }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.alarmEvents.set(event.id, event);
    return event;
  }

  async getAlarmEvent(eventId: string): Promise<AlarmEvent | null> {
    return this.alarmEvents.get(eventId) || null;
  }

  async getAlarmEvents(params?: {
    facilityId?: string;
    alarmType?: AlarmType;
    priority?: AlarmPriority;
    status?: AlarmStatus;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AlarmEvent[]> {
    let events = Array.from(this.alarmEvents.values());

    if (params?.facilityId) {
      events = events.filter(e => e.facilityId === params.facilityId);
    }

    if (params?.alarmType) {
      events = events.filter(e => e.alarmType === params.alarmType);
    }

    if (params?.priority) {
      events = events.filter(e => e.priority === params.priority);
    }

    if (params?.status) {
      events = events.filter(e => e.status === params.status);
    }

    if (params?.startDate) {
      events = events.filter(e => e.triggeredAt >= params.startDate!);
    }

    if (params?.endDate) {
      events = events.filter(e => e.triggeredAt <= params.endDate!);
    }

    return events.sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
  }

  async acknowledgeAlarm(eventId: string, acknowledgedBy: string): Promise<AlarmEvent> {
    const event = this.alarmEvents.get(eventId);
    if (!event) throw new Error(`Alarm event not found: ${eventId}`);

    event.status = 'acknowledged';
    event.timeline.push({
      timestamp: new Date(),
      event: 'Alarm acknowledged',
      actor: acknowledgedBy
    });
    event.updatedAt = new Date();
    return event;
  }

  async resolveAlarm(eventId: string, resolution: AlarmResolution): Promise<AlarmEvent> {
    const event = this.alarmEvents.get(eventId);
    if (!event) throw new Error(`Alarm event not found: ${eventId}`);

    event.status = 'resolved';
    event.resolution = resolution;
    event.timeline.push({
      timestamp: new Date(),
      event: 'Alarm resolved',
      actor: resolution.resolvedBy
    });
    event.updatedAt = new Date();
    return event;
  }

  async addAlarmResponseAction(eventId: string, action: Omit<AlarmResponseAction, 'id' | 'status'>): Promise<AlarmEvent> {
    const event = this.alarmEvents.get(eventId);
    if (!event) throw new Error(`Alarm event not found: ${eventId}`);

    event.responseActions.push({
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending'
    });
    event.updatedAt = new Date();
    return event;
  }

  // ==================== Security Inspection Management ====================

  async createInspection(params: Omit<SecurityInspection, 'id' | 'status' | 'findings' | 'createdAt' | 'updatedAt'>): Promise<SecurityInspection> {
    const inspection: SecurityInspection = {
      ...params,
      id: `insp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      findings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.inspections.set(inspection.id, inspection);
    return inspection;
  }

  async getInspection(inspectionId: string): Promise<SecurityInspection | null> {
    return this.inspections.get(inspectionId) || null;
  }

  async getInspections(params?: {
    facilityId?: string;
    type?: SecurityInspection['type'];
    status?: SecurityInspection['status'];
  }): Promise<SecurityInspection[]> {
    let inspections = Array.from(this.inspections.values());

    if (params?.facilityId) {
      inspections = inspections.filter(i => i.facilityId === params.facilityId);
    }

    if (params?.type) {
      inspections = inspections.filter(i => i.type === params.type);
    }

    if (params?.status) {
      inspections = inspections.filter(i => i.status === params.status);
    }

    return inspections.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
  }

  async addInspectionFinding(inspectionId: string, finding: Omit<InspectionFinding, 'id' | 'status'>): Promise<SecurityInspection> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error(`Inspection not found: ${inspectionId}`);

    inspection.findings.push({
      ...finding,
      id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'open'
    });
    inspection.updatedAt = new Date();
    return inspection;
  }

  async completeInspection(inspectionId: string, report: InspectionReport): Promise<SecurityInspection> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error(`Inspection not found: ${inspectionId}`);

    inspection.status = 'completed';
    inspection.completedDate = new Date();
    inspection.report = report;
    inspection.updatedAt = new Date();

    // Update facility
    const facility = this.facilities.get(inspection.facilityId);
    if (facility) {
      facility.inspections.push(inspection);
      facility.updatedAt = new Date();
    }

    return inspection;
  }

  // ==================== Access Control ====================

  async verifyFacilityAccess(facilityId: string, entranceId: string, credentialId: string): Promise<{ granted: boolean; reason?: string }> {
    const facility = this.facilities.get(facilityId);
    if (!facility) return { granted: false, reason: 'Facility not found' };

    const entrance = facility.physicalSecurity.entrances.find(e => e.id === entranceId);
    if (!entrance) return { granted: false, reason: 'Entrance not found' };

    if (entrance.status !== 'operational') {
      return { granted: false, reason: `Entrance ${entrance.status}` };
    }

    // Record access attempt
    facility.accessControl.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      cardHolder: credentialId,
      door: entrance.name,
      action: 'granted',
      reason: 'Valid credential'
    });

    return { granted: true };
  }

  async lockdownFacility(facilityId: string, reason: string, initiatedBy: string): Promise<SecuredFacility> {
    const facility = this.facilities.get(facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    facility.status = 'lockdown';
    facility.incidents.push({
      id: `incident-${Date.now()}`,
      incidentNumber: `FI-${Date.now()}`,
      type: 'lockdown',
      severity: 'critical',
      date: new Date(),
      location: 'Entire Facility',
      description: reason,
      reportedBy: initiatedBy,
      status: 'open'
    });
    facility.updatedAt = new Date();

    return facility;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalFacilities: number;
    byType: Record<FacilityType, number>;
    byStatus: Record<FacilitySecurityStatus, number>;
    totalCameras: number;
    camerasOperational: number;
    totalAlarmSystems: number;
    activeAlarms: number;
    recentAlarms: number;
    pendingInspections: number;
    openFindings: number;
    criticalFindings: number;
    averageInspectionRating: string;
    recentIncidents: number;
  }> {
    const facilities = Array.from(this.facilities.values());
    const alarmEvents = Array.from(this.alarmEvents.values());
    const inspections = Array.from(this.inspections.values());

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const byType: Record<FacilityType, number> = {} as any;
    const byStatus: Record<FacilitySecurityStatus, number> = {} as any;
    let totalCameras = 0;
    let camerasOperational = 0;
    let totalAlarmSystems = 0;

    facilities.forEach(f => {
      byType[f.type] = (byType[f.type] || 0) + 1;
      byStatus[f.status] = (byStatus[f.status] || 0) + 1;
      totalCameras += f.surveillance.totalCameras;
      camerasOperational += f.surveillance.cameras.filter(c => c.status === 'operational').length;
      totalAlarmSystems += f.alarmSystems.length;
    });

    const openFindings = inspections.reduce((sum, i) => 
      sum + i.findings.filter(f => f.status === 'open').length, 0
    );

    const criticalFindings = inspections.reduce((sum, i) =>
      sum + i.findings.filter(f => f.status === 'open' && f.severity === 'critical').length, 0
    );

    return {
      totalFacilities: facilities.length,
      byType,
      byStatus,
      totalCameras,
      camerasOperational,
      totalAlarmSystems,
      activeAlarms: alarmEvents.filter(e => e.status === 'active').length,
      recentAlarms: alarmEvents.filter(e => e.triggeredAt >= sevenDaysAgo).length,
      pendingInspections: inspections.filter(i => i.status === 'scheduled').length,
      openFindings,
      criticalFindings,
      averageInspectionRating: 'satisfactory',
      recentIncidents: facilities.reduce((sum, f) =>
        sum + f.incidents.filter(i => i.date >= sevenDaysAgo).length, 0
      )
    };
  }
}

export const facilitySecurityService = FacilitySecurityService.getInstance();
export default FacilitySecurityService;

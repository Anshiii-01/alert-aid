/**
 * Security Service - Issue #169 Implementation
 * 
 * Provides comprehensive security management for disaster response
 * including access control, threat assessment, security personnel
 * management, incident security, and perimeter protection.
 */

// Type definitions
type SecurityLevel = 'low' | 'elevated' | 'high' | 'severe' | 'critical';
type ThreatType = 'physical' | 'cyber' | 'natural' | 'civil_unrest' | 'terrorism' | 'looting' | 'other';
type ThreatStatus = 'identified' | 'monitoring' | 'active' | 'contained' | 'neutralized' | 'escalated';
type AccessLevel = 'public' | 'restricted' | 'confidential' | 'secret' | 'top_secret';
type PersonnelStatus = 'on_duty' | 'off_duty' | 'standby' | 'deployed' | 'unavailable';
type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

// Security zone interfaces
interface SecurityZone {
  id: string;
  name: string;
  type: 'perimeter' | 'controlled' | 'restricted' | 'secure' | 'critical';
  incidentId?: string;
  location: ZoneLocation;
  boundaries: ZoneBoundary[];
  accessRequirements: AccessRequirement[];
  securityLevel: SecurityLevel;
  status: 'active' | 'inactive' | 'breached' | 'locked_down';
  checkpoints: Checkpoint[];
  patrols: PatrolRoute[];
  surveillanceAssets: SurveillanceAsset[];
  incidents: SecurityIncidentRef[];
  personnel: AssignedPersonnel[];
  schedule: ZoneSchedule;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ZoneLocation {
  address: string;
  city: string;
  state: string;
  coordinates: [number, number];
  facility?: string;
  area: number; // square meters
}

interface ZoneBoundary {
  type: 'fence' | 'barrier' | 'natural' | 'virtual' | 'building';
  description: string;
  coordinates: [number, number][];
  status: 'intact' | 'damaged' | 'breached';
  lastInspected: Date;
}

interface AccessRequirement {
  level: AccessLevel;
  credentials: string[];
  verification: string[];
  escortRequired: boolean;
  timeRestrictions?: { start: string; end: string };
  additionalRequirements?: string[];
}

interface Checkpoint {
  id: string;
  name: string;
  type: 'entry' | 'exit' | 'vehicle' | 'pedestrian' | 'mixed';
  location: [number, number];
  status: 'operational' | 'closed' | 'compromised';
  equipment: string[];
  staffing: { minimum: number; current: number };
  verificationMethods: string[];
  throughput: { capacity: number; current: number };
}

interface PatrolRoute {
  id: string;
  name: string;
  type: 'foot' | 'vehicle' | 'drone' | 'combined';
  waypoints: { id: string; name: string; coordinates: [number, number]; checkTime: number }[];
  frequency: string;
  duration: number;
  assignedPersonnel: string[];
  lastCompleted?: Date;
  status: 'active' | 'suspended' | 'completed';
}

interface SurveillanceAsset {
  id: string;
  type: 'camera' | 'sensor' | 'drone' | 'tower' | 'mobile';
  name: string;
  location: [number, number];
  coverage: { angle: number; range: number };
  status: 'operational' | 'offline' | 'maintenance' | 'damaged';
  capabilities: string[];
  lastMaintenance?: Date;
}

interface SecurityIncidentRef {
  incidentId: string;
  type: string;
  date: Date;
  severity: IncidentPriority;
  resolved: boolean;
}

interface AssignedPersonnel {
  personnelId: string;
  name: string;
  role: string;
  shift: string;
  contact: string;
  armed: boolean;
  certifications: string[];
}

interface ZoneSchedule {
  operationalHours: { start: string; end: string };
  shifts: { name: string; start: string; end: string; minimumStaff: number }[];
  specialEvents?: { date: Date; description: string; securityLevel: SecurityLevel }[];
}

// Threat assessment interfaces
interface ThreatAssessment {
  id: string;
  incidentId?: string;
  threatType: ThreatType;
  status: ThreatStatus;
  priority: IncidentPriority;
  title: string;
  description: string;
  source: ThreatSource;
  indicators: ThreatIndicator[];
  affectedAssets: string[];
  affectedAreas: string[];
  potentialImpact: ImpactAssessment;
  likelihood: 'unlikely' | 'possible' | 'likely' | 'almost_certain';
  riskScore: number;
  mitigations: Mitigation[];
  timeline: ThreatTimeline;
  intelligence: IntelligenceReport[];
  recommendations: string[];
  assignedAnalyst: string;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ThreatSource {
  type: 'intelligence' | 'observation' | 'report' | 'sensor' | 'social_media' | 'other';
  description: string;
  reliability: 'confirmed' | 'probably_true' | 'possibly_true' | 'doubtful' | 'unconfirmed';
  dateReceived: Date;
  reportedBy?: string;
}

interface ThreatIndicator {
  id: string;
  type: string;
  description: string;
  observedDate: Date;
  location?: string;
  evidence?: string;
  confidence: 'high' | 'medium' | 'low';
}

interface ImpactAssessment {
  personnel: { affected: number; severity: string };
  property: { value: number; description: string };
  operations: { disruption: string; duration: string };
  reputation: { level: string; description: string };
  overall: IncidentPriority;
}

interface Mitigation {
  id: string;
  measure: string;
  status: 'proposed' | 'approved' | 'implementing' | 'implemented' | 'rejected';
  effectiveness: 'high' | 'medium' | 'low';
  cost: number;
  timeToImplement: string;
  responsible: string;
  completedDate?: Date;
}

interface ThreatTimeline {
  identified: Date;
  assessed?: Date;
  escalated?: Date;
  mitigated?: Date;
  resolved?: Date;
  events: { date: Date; event: string; actor: string }[];
}

interface IntelligenceReport {
  id: string;
  source: string;
  classification: AccessLevel;
  content: string;
  date: Date;
  analyst: string;
  actionable: boolean;
}

// Security incident interfaces
interface SecurityIncident {
  id: string;
  incidentNumber: string;
  type: SecurityIncidentType;
  priority: IncidentPriority;
  status: 'reported' | 'investigating' | 'responding' | 'contained' | 'resolved' | 'closed';
  title: string;
  description: string;
  location: IncidentLocation;
  reportedBy: ReporterInfo;
  reportedAt: Date;
  affectedZones: string[];
  affectedAssets: string[];
  responseActions: ResponseAction[];
  evidence: Evidence[];
  suspects: SuspectInfo[];
  witnesses: WitnessInfo[];
  timeline: IncidentTimelineEvent[];
  resolution?: ResolutionDetails;
  notifications: NotificationRecord[];
  assignedTo: string[];
  createdAt: Date;
  updatedAt: Date;
}

type SecurityIncidentType = 
  | 'unauthorized_access' 
  | 'theft' 
  | 'vandalism' 
  | 'assault' 
  | 'trespassing'
  | 'threat'
  | 'suspicious_activity'
  | 'breach'
  | 'sabotage'
  | 'protest'
  | 'civil_disturbance'
  | 'other';

interface IncidentLocation {
  zone?: string;
  facility: string;
  building?: string;
  floor?: string;
  room?: string;
  coordinates?: [number, number];
  description: string;
}

interface ReporterInfo {
  name: string;
  role: string;
  contact: string;
  anonymous: boolean;
}

interface ResponseAction {
  id: string;
  action: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  priority: IncidentPriority;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

interface Evidence {
  id: string;
  type: 'physical' | 'digital' | 'video' | 'photo' | 'document' | 'witness_statement';
  description: string;
  collectedAt: Date;
  collectedBy: string;
  location: string;
  chainOfCustody: { date: Date; from: string; to: string; purpose: string }[];
  status: 'collected' | 'processing' | 'analyzed' | 'archived';
}

interface SuspectInfo {
  id: string;
  description: string;
  identified: boolean;
  name?: string;
  lastKnownLocation?: string;
  vehicle?: string;
  associatedIncidents?: string[];
  status: 'at_large' | 'located' | 'apprehended' | 'released';
}

interface WitnessInfo {
  id: string;
  name: string;
  contact: string;
  statement?: string;
  interviewDate?: Date;
  interviewedBy?: string;
  credibility: 'high' | 'medium' | 'low' | 'unknown';
}

interface IncidentTimelineEvent {
  timestamp: Date;
  event: string;
  actor: string;
  details?: string;
}

interface ResolutionDetails {
  summary: string;
  outcome: string;
  lessonsLearned: string[];
  followUpRequired: boolean;
  followUpActions?: string[];
  closedBy: string;
  closedAt: Date;
}

interface NotificationRecord {
  id: string;
  recipient: string;
  method: 'email' | 'phone' | 'radio' | 'in_person';
  message: string;
  sentAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

// Access control interfaces
interface AccessCredential {
  id: string;
  type: 'badge' | 'biometric' | 'pin' | 'key' | 'certificate' | 'token';
  holderId: string;
  holderName: string;
  holderOrganization: string;
  accessLevel: AccessLevel;
  zones: string[];
  validFrom: Date;
  validUntil: Date;
  status: 'active' | 'suspended' | 'expired' | 'revoked' | 'lost';
  issuedBy: string;
  issuedAt: Date;
  lastUsed?: Date;
  usageHistory: AccessEvent[];
  restrictions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AccessEvent {
  timestamp: Date;
  zone: string;
  checkpoint?: string;
  action: 'grant' | 'deny' | 'timeout' | 'alarm';
  reason?: string;
  verifiedBy?: string;
}

// Security personnel interfaces
interface SecurityPersonnel {
  id: string;
  employeeId: string;
  name: string;
  rank: string;
  unit: string;
  status: PersonnelStatus;
  contact: {
    phone: string;
    radio: string;
    email: string;
  };
  qualifications: SecurityQualification[];
  certifications: SecurityCertification[];
  equipment: AssignedEquipment[];
  currentAssignment?: string;
  schedule: PersonnelSchedule;
  performanceRating?: number;
  incidents: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SecurityQualification {
  name: string;
  level: string;
  issuedDate: Date;
  expirationDate?: Date;
  issuedBy: string;
}

interface SecurityCertification {
  name: string;
  type: 'armed' | 'unarmed' | 'tactical' | 'k9' | 'surveillance' | 'executive_protection' | 'other';
  certificationNumber: string;
  issuedDate: Date;
  expirationDate: Date;
  status: 'valid' | 'expiring' | 'expired';
}

interface AssignedEquipment {
  id: string;
  type: string;
  serialNumber: string;
  assignedDate: Date;
  returnDate?: Date;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

interface PersonnelSchedule {
  regularShift: string;
  currentShift?: { start: Date; end: Date; zone: string };
  upcomingShifts: { date: Date; shift: string; zone: string }[];
  timeOff: { start: Date; end: Date; type: string; approved: boolean }[];
}

// Sample data
const sampleSecurityZones: SecurityZone[] = [
  {
    id: 'zone-001',
    name: 'Emergency Operations Center',
    type: 'secure',
    location: {
      address: '100 Emergency Way',
      city: 'Springfield',
      state: 'CA',
      coordinates: [38.5816, -121.4944],
      facility: 'County EOC Building',
      area: 5000
    },
    boundaries: [
      {
        type: 'fence',
        description: '8ft chain link with barbed wire',
        coordinates: [[38.5820, -121.4950], [38.5820, -121.4938], [38.5812, -121.4938], [38.5812, -121.4950]],
        status: 'intact',
        lastInspected: new Date('2024-01-10')
      }
    ],
    accessRequirements: [
      {
        level: 'restricted',
        credentials: ['EOC Badge', 'Agency ID'],
        verification: ['Badge Scan', 'PIN'],
        escortRequired: false
      }
    ],
    securityLevel: 'high',
    status: 'active',
    checkpoints: [
      {
        id: 'cp-001',
        name: 'Main Gate',
        type: 'mixed',
        location: [38.5816, -121.4950],
        status: 'operational',
        equipment: ['Badge Reader', 'Vehicle Scanner', 'CCTV'],
        staffing: { minimum: 2, current: 2 },
        verificationMethods: ['Badge', 'Visual ID'],
        throughput: { capacity: 50, current: 12 }
      }
    ],
    patrols: [],
    surveillanceAssets: [
      {
        id: 'cam-001',
        type: 'camera',
        name: 'Main Gate Camera',
        location: [38.5816, -121.4950],
        coverage: { angle: 180, range: 50 },
        status: 'operational',
        capabilities: ['PTZ', 'Night Vision', 'Motion Detection']
      }
    ],
    incidents: [],
    personnel: [
      {
        personnelId: 'sp-001',
        name: 'Officer Johnson',
        role: 'Gate Guard',
        shift: 'Day',
        contact: '555-0301',
        armed: true,
        certifications: ['Armed Security', 'CPR']
      }
    ],
    schedule: {
      operationalHours: { start: '00:00', end: '23:59' },
      shifts: [
        { name: 'Day', start: '06:00', end: '14:00', minimumStaff: 4 },
        { name: 'Swing', start: '14:00', end: '22:00', minimumStaff: 4 },
        { name: 'Night', start: '22:00', end: '06:00', minimumStaff: 2 }
      ]
    },
    notes: 'Primary command facility - enhanced security during activations',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date()
  }
];

const sampleThreatAssessments: ThreatAssessment[] = [
  {
    id: 'threat-001',
    threatType: 'looting',
    status: 'monitoring',
    priority: 'medium',
    title: 'Post-Disaster Looting Risk Assessment',
    description: 'Assessment of potential looting activity in evacuated residential areas following major flood event',
    source: {
      type: 'intelligence',
      description: 'Historical analysis and social media monitoring',
      reliability: 'probably_true',
      dateReceived: new Date()
    },
    indicators: [
      {
        id: 'ind-001',
        type: 'Social',
        description: 'Increased social media chatter about unsecured properties',
        observedDate: new Date(),
        confidence: 'medium'
      }
    ],
    affectedAssets: ['Residential Properties', 'Commercial Districts'],
    affectedAreas: ['Downtown', 'Riverside District'],
    potentialImpact: {
      personnel: { affected: 0, severity: 'Low' },
      property: { value: 500000, description: 'Potential property losses' },
      operations: { disruption: 'Moderate', duration: '1-2 weeks' },
      reputation: { level: 'High', description: 'Public trust impact' },
      overall: 'medium'
    },
    likelihood: 'possible',
    riskScore: 6.5,
    mitigations: [
      {
        id: 'mit-001',
        measure: 'Increase patrol frequency in evacuated areas',
        status: 'implementing',
        effectiveness: 'high',
        cost: 15000,
        timeToImplement: '24 hours',
        responsible: 'Security Chief'
      }
    ],
    timeline: {
      identified: new Date(),
      events: []
    },
    intelligence: [],
    recommendations: [
      'Deploy additional patrol units to evacuated areas',
      'Establish curfew in affected zones',
      'Coordinate with local law enforcement'
    ],
    assignedAnalyst: 'M. Thompson',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class SecurityService {
  private static instance: SecurityService;
  private securityZones: Map<string, SecurityZone> = new Map();
  private threatAssessments: Map<string, ThreatAssessment> = new Map();
  private securityIncidents: Map<string, SecurityIncident> = new Map();
  private accessCredentials: Map<string, AccessCredential> = new Map();
  private securityPersonnel: Map<string, SecurityPersonnel> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private initializeSampleData(): void {
    sampleSecurityZones.forEach(z => this.securityZones.set(z.id, z));
    sampleThreatAssessments.forEach(t => this.threatAssessments.set(t.id, t));
  }

  // ==================== Security Zone Management ====================

  async createSecurityZone(params: Omit<SecurityZone, 'id' | 'incidents' | 'createdAt' | 'updatedAt'>): Promise<SecurityZone> {
    const zone: SecurityZone = {
      ...params,
      id: `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.securityZones.set(zone.id, zone);
    return zone;
  }

  async getSecurityZone(zoneId: string): Promise<SecurityZone | null> {
    return this.securityZones.get(zoneId) || null;
  }

  async getAllSecurityZones(params?: {
    type?: SecurityZone['type'];
    status?: SecurityZone['status'];
    securityLevel?: SecurityLevel;
    incidentId?: string;
  }): Promise<SecurityZone[]> {
    let zones = Array.from(this.securityZones.values());

    if (params?.type) {
      zones = zones.filter(z => z.type === params.type);
    }

    if (params?.status) {
      zones = zones.filter(z => z.status === params.status);
    }

    if (params?.securityLevel) {
      zones = zones.filter(z => z.securityLevel === params.securityLevel);
    }

    if (params?.incidentId) {
      zones = zones.filter(z => z.incidentId === params.incidentId);
    }

    return zones;
  }

  async updateZoneStatus(zoneId: string, status: SecurityZone['status']): Promise<SecurityZone> {
    const zone = this.securityZones.get(zoneId);
    if (!zone) throw new Error(`Security zone not found: ${zoneId}`);

    zone.status = status;
    zone.updatedAt = new Date();
    return zone;
  }

  async updateSecurityLevel(zoneId: string, level: SecurityLevel): Promise<SecurityZone> {
    const zone = this.securityZones.get(zoneId);
    if (!zone) throw new Error(`Security zone not found: ${zoneId}`);

    zone.securityLevel = level;
    zone.updatedAt = new Date();
    return zone;
  }

  async addCheckpoint(zoneId: string, checkpoint: Omit<Checkpoint, 'id'>): Promise<SecurityZone> {
    const zone = this.securityZones.get(zoneId);
    if (!zone) throw new Error(`Security zone not found: ${zoneId}`);

    zone.checkpoints.push({
      ...checkpoint,
      id: `cp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    zone.updatedAt = new Date();
    return zone;
  }

  async addPatrolRoute(zoneId: string, patrol: Omit<PatrolRoute, 'id'>): Promise<SecurityZone> {
    const zone = this.securityZones.get(zoneId);
    if (!zone) throw new Error(`Security zone not found: ${zoneId}`);

    zone.patrols.push({
      ...patrol,
      id: `patrol-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    zone.updatedAt = new Date();
    return zone;
  }

  // ==================== Threat Assessment ====================

  async createThreatAssessment(params: Omit<ThreatAssessment, 'id' | 'riskScore' | 'timeline' | 'createdAt' | 'updatedAt'>): Promise<ThreatAssessment> {
    const assessment: ThreatAssessment = {
      ...params,
      id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      riskScore: this.calculateRiskScore(params.priority, params.likelihood),
      timeline: {
        identified: new Date(),
        events: [{ date: new Date(), event: 'Threat identified', actor: params.assignedAnalyst }]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.threatAssessments.set(assessment.id, assessment);
    return assessment;
  }

  private calculateRiskScore(priority: IncidentPriority, likelihood: ThreatAssessment['likelihood']): number {
    const priorityScores: Record<IncidentPriority, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    const likelihoodScores: Record<string, number> = { unlikely: 1, possible: 2, likely: 3, almost_certain: 4 };
    
    return (priorityScores[priority] * likelihoodScores[likelihood]) / 1.6; // Scale to 0-10
  }

  async getThreatAssessment(assessmentId: string): Promise<ThreatAssessment | null> {
    return this.threatAssessments.get(assessmentId) || null;
  }

  async getThreatAssessments(params?: {
    threatType?: ThreatType;
    status?: ThreatStatus;
    priority?: IncidentPriority;
    incidentId?: string;
  }): Promise<ThreatAssessment[]> {
    let assessments = Array.from(this.threatAssessments.values());

    if (params?.threatType) {
      assessments = assessments.filter(a => a.threatType === params.threatType);
    }

    if (params?.status) {
      assessments = assessments.filter(a => a.status === params.status);
    }

    if (params?.priority) {
      assessments = assessments.filter(a => a.priority === params.priority);
    }

    if (params?.incidentId) {
      assessments = assessments.filter(a => a.incidentId === params.incidentId);
    }

    return assessments.sort((a, b) => b.riskScore - a.riskScore);
  }

  async updateThreatStatus(assessmentId: string, status: ThreatStatus, notes?: string): Promise<ThreatAssessment> {
    const assessment = this.threatAssessments.get(assessmentId);
    if (!assessment) throw new Error(`Threat assessment not found: ${assessmentId}`);

    assessment.status = status;
    assessment.timeline.events.push({
      date: new Date(),
      event: `Status changed to ${status}${notes ? `: ${notes}` : ''}`,
      actor: assessment.assignedAnalyst
    });

    if (status === 'contained') assessment.timeline.mitigated = new Date();
    if (status === 'neutralized') assessment.timeline.resolved = new Date();

    assessment.updatedAt = new Date();
    return assessment;
  }

  async addMitigation(assessmentId: string, mitigation: Omit<Mitigation, 'id'>): Promise<ThreatAssessment> {
    const assessment = this.threatAssessments.get(assessmentId);
    if (!assessment) throw new Error(`Threat assessment not found: ${assessmentId}`);

    assessment.mitigations.push({
      ...mitigation,
      id: `mit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    assessment.updatedAt = new Date();
    return assessment;
  }

  // ==================== Security Incident Management ====================

  async createSecurityIncident(params: Omit<SecurityIncident, 'id' | 'incidentNumber' | 'status' | 'responseActions' | 'evidence' | 'suspects' | 'witnesses' | 'timeline' | 'notifications' | 'createdAt' | 'updatedAt'>): Promise<SecurityIncident> {
    const incident: SecurityIncident = {
      ...params,
      id: `sec-inc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentNumber: `SI-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'reported',
      responseActions: [],
      evidence: [],
      suspects: [],
      witnesses: [],
      timeline: [{ timestamp: params.reportedAt, event: 'Incident reported', actor: params.reportedBy.name }],
      notifications: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.securityIncidents.set(incident.id, incident);
    return incident;
  }

  async getSecurityIncident(incidentId: string): Promise<SecurityIncident | null> {
    return this.securityIncidents.get(incidentId) || null;
  }

  async getSecurityIncidents(params?: {
    type?: SecurityIncidentType;
    priority?: IncidentPriority;
    status?: SecurityIncident['status'];
    zone?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<SecurityIncident[]> {
    let incidents = Array.from(this.securityIncidents.values());

    if (params?.type) {
      incidents = incidents.filter(i => i.type === params.type);
    }

    if (params?.priority) {
      incidents = incidents.filter(i => i.priority === params.priority);
    }

    if (params?.status) {
      incidents = incidents.filter(i => i.status === params.status);
    }

    if (params?.zone) {
      incidents = incidents.filter(i => i.affectedZones.includes(params.zone!));
    }

    if (params?.startDate) {
      incidents = incidents.filter(i => i.reportedAt >= params.startDate!);
    }

    if (params?.endDate) {
      incidents = incidents.filter(i => i.reportedAt <= params.endDate!);
    }

    return incidents.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
  }

  async updateIncidentStatus(incidentId: string, status: SecurityIncident['status'], actor: string): Promise<SecurityIncident> {
    const incident = this.securityIncidents.get(incidentId);
    if (!incident) throw new Error(`Security incident not found: ${incidentId}`);

    incident.status = status;
    incident.timeline.push({
      timestamp: new Date(),
      event: `Status updated to ${status}`,
      actor
    });
    incident.updatedAt = new Date();
    return incident;
  }

  async addResponseAction(incidentId: string, action: Omit<ResponseAction, 'id' | 'status'>): Promise<SecurityIncident> {
    const incident = this.securityIncidents.get(incidentId);
    if (!incident) throw new Error(`Security incident not found: ${incidentId}`);

    incident.responseActions.push({
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending'
    });
    incident.updatedAt = new Date();
    return incident;
  }

  async addEvidence(incidentId: string, evidence: Omit<Evidence, 'id' | 'chainOfCustody' | 'status'>): Promise<SecurityIncident> {
    const incident = this.securityIncidents.get(incidentId);
    if (!incident) throw new Error(`Security incident not found: ${incidentId}`);

    incident.evidence.push({
      ...evidence,
      id: `evid-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      chainOfCustody: [],
      status: 'collected'
    });
    incident.timeline.push({
      timestamp: new Date(),
      event: `Evidence collected: ${evidence.description}`,
      actor: evidence.collectedBy
    });
    incident.updatedAt = new Date();
    return incident;
  }

  async resolveIncident(incidentId: string, resolution: Omit<ResolutionDetails, 'closedAt'>): Promise<SecurityIncident> {
    const incident = this.securityIncidents.get(incidentId);
    if (!incident) throw new Error(`Security incident not found: ${incidentId}`);

    incident.status = 'resolved';
    incident.resolution = {
      ...resolution,
      closedAt: new Date()
    };
    incident.timeline.push({
      timestamp: new Date(),
      event: 'Incident resolved',
      actor: resolution.closedBy
    });
    incident.updatedAt = new Date();
    return incident;
  }

  // ==================== Access Control ====================

  async createAccessCredential(params: Omit<AccessCredential, 'id' | 'usageHistory' | 'createdAt' | 'updatedAt'>): Promise<AccessCredential> {
    const credential: AccessCredential = {
      ...params,
      id: `cred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      usageHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accessCredentials.set(credential.id, credential);
    return credential;
  }

  async getAccessCredential(credentialId: string): Promise<AccessCredential | null> {
    return this.accessCredentials.get(credentialId) || null;
  }

  async verifyAccess(credentialId: string, zoneId: string, checkpoint?: string): Promise<{ granted: boolean; reason?: string }> {
    const credential = this.accessCredentials.get(credentialId);
    if (!credential) {
      return { granted: false, reason: 'Invalid credential' };
    }

    if (credential.status !== 'active') {
      return { granted: false, reason: `Credential ${credential.status}` };
    }

    const now = new Date();
    if (now < credential.validFrom || now > credential.validUntil) {
      return { granted: false, reason: 'Credential not valid at this time' };
    }

    if (!credential.zones.includes(zoneId) && !credential.zones.includes('*')) {
      return { granted: false, reason: 'Zone not authorized' };
    }

    // Record access event
    credential.usageHistory.push({
      timestamp: now,
      zone: zoneId,
      checkpoint,
      action: 'grant'
    });
    credential.lastUsed = now;
    credential.updatedAt = now;

    return { granted: true };
  }

  async suspendCredential(credentialId: string, reason: string): Promise<AccessCredential> {
    const credential = this.accessCredentials.get(credentialId);
    if (!credential) throw new Error(`Credential not found: ${credentialId}`);

    credential.status = 'suspended';
    credential.restrictions = credential.restrictions || [];
    credential.restrictions.push(`Suspended: ${reason}`);
    credential.updatedAt = new Date();
    return credential;
  }

  // ==================== Security Personnel ====================

  async createSecurityPersonnel(params: Omit<SecurityPersonnel, 'id' | 'incidents' | 'createdAt' | 'updatedAt'>): Promise<SecurityPersonnel> {
    const personnel: SecurityPersonnel = {
      ...params,
      id: `sp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.securityPersonnel.set(personnel.id, personnel);
    return personnel;
  }

  async getSecurityPersonnel(personnelId: string): Promise<SecurityPersonnel | null> {
    return this.securityPersonnel.get(personnelId) || null;
  }

  async getAllSecurityPersonnel(params?: {
    status?: PersonnelStatus;
    unit?: string;
    certification?: string;
  }): Promise<SecurityPersonnel[]> {
    let personnel = Array.from(this.securityPersonnel.values());

    if (params?.status) {
      personnel = personnel.filter(p => p.status === params.status);
    }

    if (params?.unit) {
      personnel = personnel.filter(p => p.unit === params.unit);
    }

    if (params?.certification) {
      personnel = personnel.filter(p =>
        p.certifications.some(c => c.type === params.certification)
      );
    }

    return personnel;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalZones: number;
    activeZones: number;
    zonesBySecurityLevel: Record<SecurityLevel, number>;
    totalThreats: number;
    activeThreats: number;
    threatsByType: Record<ThreatType, number>;
    averageRiskScore: number;
    totalIncidents: number;
    openIncidents: number;
    incidentsByType: Record<string, number>;
    totalCredentials: number;
    activeCredentials: number;
    accessEventsToday: number;
    totalPersonnel: number;
    onDutyPersonnel: number;
    recentTrends: { period: string; incidents: number; threats: number }[];
  }> {
    const zones = Array.from(this.securityZones.values());
    const threats = Array.from(this.threatAssessments.values());
    const incidents = Array.from(this.securityIncidents.values());
    const credentials = Array.from(this.accessCredentials.values());
    const personnel = Array.from(this.securityPersonnel.values());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const zonesBySecurityLevel: Record<SecurityLevel, number> = {} as any;
    zones.forEach(z => {
      zonesBySecurityLevel[z.securityLevel] = (zonesBySecurityLevel[z.securityLevel] || 0) + 1;
    });

    const threatsByType: Record<ThreatType, number> = {} as any;
    let totalRiskScore = 0;
    threats.forEach(t => {
      threatsByType[t.threatType] = (threatsByType[t.threatType] || 0) + 1;
      totalRiskScore += t.riskScore;
    });

    const incidentsByType: Record<string, number> = {};
    incidents.forEach(i => {
      incidentsByType[i.type] = (incidentsByType[i.type] || 0) + 1;
    });

    let accessEventsToday = 0;
    credentials.forEach(c => {
      accessEventsToday += c.usageHistory.filter(e => e.timestamp >= today).length;
    });

    return {
      totalZones: zones.length,
      activeZones: zones.filter(z => z.status === 'active').length,
      zonesBySecurityLevel,
      totalThreats: threats.length,
      activeThreats: threats.filter(t => ['identified', 'monitoring', 'active'].includes(t.status)).length,
      threatsByType,
      averageRiskScore: threats.length > 0 ? totalRiskScore / threats.length : 0,
      totalIncidents: incidents.length,
      openIncidents: incidents.filter(i => !['resolved', 'closed'].includes(i.status)).length,
      incidentsByType,
      totalCredentials: credentials.length,
      activeCredentials: credentials.filter(c => c.status === 'active').length,
      accessEventsToday,
      totalPersonnel: personnel.length,
      onDutyPersonnel: personnel.filter(p => p.status === 'on_duty').length,
      recentTrends: [
        { period: 'This Week', incidents: 5, threats: 2 },
        { period: 'Last Week', incidents: 8, threats: 3 },
        { period: 'This Month', incidents: 25, threats: 8 }
      ]
    };
  }
}

export const securityService = SecurityService.getInstance();
export default SecurityService;

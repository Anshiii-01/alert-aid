/**
 * Incident Security Response Service - Issue #173 Implementation
 * 
 * Provides comprehensive security response management for disaster incidents
 * including security operations centers, rapid response teams, security
 * protocols, and incident-specific security coordination.
 */

// Type definitions
type SecurityResponseLevel = 'routine' | 'elevated' | 'high' | 'maximum' | 'lockdown';
type ResponseTeamStatus = 'standby' | 'activated' | 'deployed' | 'on_scene' | 'returning' | 'deactivated';
type SecurityMissionType = 'perimeter_control' | 'access_control' | 'escort' | 'patrol' | 'crowd_control' | 'vip_protection' | 'evidence_protection' | 'evacuation_support' | 'search' | 'investigation';
type ProtocolStatus = 'draft' | 'approved' | 'active' | 'suspended' | 'retired';
type CoordinationLevel = 'local' | 'regional' | 'state' | 'federal' | 'multi_agency';

// Security operation center interfaces
interface SecurityOperationsCenter {
  id: string;
  name: string;
  type: 'primary' | 'backup' | 'mobile' | 'virtual';
  status: 'inactive' | 'activated' | 'operational' | 'degraded' | 'offline';
  location: SOCLocation;
  capabilities: SOCCapabilities;
  staffing: SOCStaffing;
  communications: SOCCommunications;
  technology: SOCTechnology;
  activations: SOCActivation[];
  currentIncident?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SOCLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: [number, number];
  facility: string;
  room?: string;
  accessLevel: string;
}

interface SOCCapabilities {
  maxOperators: number;
  surveillanceMonitors: number;
  radioChannels: number;
  phoneLines: number;
  videoWall: boolean;
  gisCapability: boolean;
  dispatchCapability: boolean;
  integrations: string[];
}

interface SOCStaffing {
  minimumStaff: number;
  currentStaff: number;
  positions: SOCPosition[];
  shifts: { name: string; start: string; end: string; supervisor: string }[];
}

interface SOCPosition {
  title: string;
  role: string;
  assignedTo?: string;
  status: 'filled' | 'vacant' | 'standby';
  responsibilities: string[];
}

interface SOCCommunications {
  primaryRadioFrequency: string;
  backupRadioFrequency?: string;
  talkGroups: string[];
  phoneNumbers: { type: string; number: string }[];
  emergencyLine: string;
  interoperability: string[];
}

interface SOCTechnology {
  cameraSystem: { vendor: string; totalCameras: number; status: string };
  accessControlSystem: { vendor: string; status: string };
  alarmMonitoring: { vendor: string; zonesMonitored: number; status: string };
  dispatchSystem: { vendor: string; status: string };
  gis: { platform: string; status: string };
  networking: { redundancy: boolean; backupPower: boolean; status: string };
}

interface SOCActivation {
  id: string;
  incidentId?: string;
  incidentName?: string;
  activatedAt: Date;
  deactivatedAt?: Date;
  level: SecurityResponseLevel;
  reason: string;
  staffingLevel: number;
  activities: string[];
}

// Rapid response team interfaces
interface RapidResponseTeam {
  id: string;
  name: string;
  type: 'security' | 'tactical' | 'investigation' | 'k9' | 'mounted' | 'bike' | 'marine' | 'specialized';
  status: ResponseTeamStatus;
  homeBase: string;
  currentLocation?: [number, number];
  personnel: TeamMember[];
  equipment: TeamEquipment[];
  vehicles: TeamVehicle[];
  certifications: string[];
  specializations: string[];
  responseTime: number; // minutes
  deployments: TeamDeployment[];
  availability: TeamAvailability;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  id: string;
  name: string;
  rank: string;
  role: 'leader' | 'member' | 'specialist';
  specialties: string[];
  certifications: string[];
  contact: string;
  status: 'available' | 'deployed' | 'off_duty' | 'unavailable';
  armed: boolean;
}

interface TeamEquipment {
  id: string;
  type: string;
  description: string;
  quantity: number;
  status: 'ready' | 'deployed' | 'maintenance';
  location: string;
}

interface TeamVehicle {
  id: string;
  type: string;
  callSign: string;
  licensePlate: string;
  capacity: number;
  status: 'available' | 'deployed' | 'maintenance';
  currentLocation?: [number, number];
  equipment: string[];
}

interface TeamDeployment {
  id: string;
  incidentId?: string;
  incidentName?: string;
  missionType: SecurityMissionType;
  location: string;
  coordinates?: [number, number];
  deployedAt: Date;
  returnedAt?: Date;
  status: ResponseTeamStatus;
  objectives: string[];
  activities: DeploymentActivity[];
  incidents: string[];
  notes: string;
}

interface DeploymentActivity {
  timestamp: Date;
  activity: string;
  reportedBy: string;
  location?: string;
}

interface TeamAvailability {
  schedule: { dayOfWeek: number; available: boolean; hours?: { start: string; end: string } }[];
  onCallPersonnel: string[];
  nextAvailable?: Date;
  blackoutDates: { start: Date; end: Date; reason: string }[];
}

// Security mission interfaces
interface SecurityMission {
  id: string;
  missionNumber: string;
  incidentId: string;
  incidentName: string;
  type: SecurityMissionType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planned' | 'briefed' | 'in_progress' | 'completed' | 'aborted' | 'suspended';
  description: string;
  objectives: MissionObjective[];
  location: MissionLocation;
  timeline: MissionTimeline;
  resources: MissionResources;
  coordination: MissionCoordination;
  risks: MissionRisk[];
  briefing: MissionBriefing;
  reporting: MissionReporting;
  debrief?: MissionDebrief;
  createdAt: Date;
  updatedAt: Date;
}

interface MissionObjective {
  id: string;
  description: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'achieved' | 'failed' | 'cancelled';
  metrics?: { target: string; actual?: string };
}

interface MissionLocation {
  name: string;
  address: string;
  coordinates: [number, number];
  areaOfOperation: string;
  boundaryDescription?: string;
  hazards: string[];
  accessPoints: { name: string; coordinates: [number, number]; type: string }[];
}

interface MissionTimeline {
  plannedStart: Date;
  plannedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  milestones: { name: string; plannedTime: Date; actualTime?: Date; status: string }[];
  extensions: { requestedAt: Date; newEndTime: Date; reason: string; approved: boolean }[];
}

interface MissionResources {
  teams: { teamId: string; teamName: string; role: string; personnelCount: number }[];
  personnel: { name: string; role: string; callSign?: string; armed: boolean }[];
  vehicles: { vehicleId: string; type: string; callSign: string }[];
  equipment: { type: string; quantity: number; assignedTo?: string }[];
  externalSupport: { agency: string; type: string; contact: string }[];
}

interface MissionCoordination {
  level: CoordinationLevel;
  commandStructure: { position: string; name: string; contact: string }[];
  agencies: { name: string; role: string; contact: string; resources?: string }[];
  communications: {
    primaryChannel: string;
    tacticalChannel?: string;
    commandChannel?: string;
    emergencyChannel: string;
    phoneContacts: { role: string; number: string }[];
  };
  checkInSchedule: string;
  reportingSchedule: string;
}

interface MissionRisk {
  id: string;
  category: 'safety' | 'security' | 'operational' | 'environmental' | 'legal';
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'severe';
  mitigations: string[];
  status: 'identified' | 'mitigated' | 'accepted' | 'occurred';
}

interface MissionBriefing {
  conducted: boolean;
  conductedAt?: Date;
  conductedBy?: string;
  attendees: string[];
  topics: string[];
  safetyBrief: boolean;
  rulesOfEngagement?: string[];
  specialInstructions?: string[];
  questions: { question: string; answer: string }[];
}

interface MissionReporting {
  statusReports: StatusReport[];
  incidentReports: IncidentReport[];
  mediaReports: string[];
}

interface StatusReport {
  id: string;
  timestamp: Date;
  reportedBy: string;
  status: string;
  location?: string;
  activities: string;
  issues?: string;
  nextActions?: string;
}

interface IncidentReport {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  location: string;
  involved: string[];
  actions: string[];
  reportedBy: string;
  followUp?: string;
}

interface MissionDebrief {
  conductedAt: Date;
  conductedBy: string;
  attendees: string[];
  objectivesAchieved: boolean;
  summary: string;
  whatWorked: string[];
  challenges: string[];
  lessonsLearned: string[];
  recommendations: string[];
  followUpActions: { action: string; assignedTo: string; dueDate: Date }[];
}

// Security protocol interfaces
interface SecurityProtocol {
  id: string;
  name: string;
  code: string;
  type: 'response' | 'prevention' | 'investigation' | 'recovery' | 'communication';
  status: ProtocolStatus;
  version: string;
  effectiveDate: Date;
  reviewDate: Date;
  scope: ProtocolScope;
  triggers: ProtocolTrigger[];
  procedures: ProtocolProcedure[];
  resources: ProtocolResource[];
  communications: ProtocolCommunication[];
  training: ProtocolTraining;
  history: ProtocolHistoryEntry[];
  approvedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProtocolScope {
  applicability: string[];
  locations: string[];
  incidentTypes: string[];
  securityLevels: SecurityResponseLevel[];
  exclusions?: string[];
}

interface ProtocolTrigger {
  condition: string;
  threshold?: string;
  autoActivate: boolean;
  notificationList: string[];
}

interface ProtocolProcedure {
  id: string;
  stepNumber: number;
  action: string;
  responsible: string;
  timeframe: string;
  dependencies?: string[];
  resources?: string[];
  documentation?: string;
  alternateActions?: { condition: string; action: string }[];
}

interface ProtocolResource {
  type: 'personnel' | 'equipment' | 'facility' | 'external' | 'information';
  name: string;
  quantity?: number;
  location?: string;
  contactInfo?: string;
  notes?: string;
}

interface ProtocolCommunication {
  phase: string;
  audience: string;
  message: string;
  method: string;
  timing: string;
  responsible: string;
  template?: string;
}

interface ProtocolTraining {
  required: boolean;
  frequency: string;
  targetAudience: string[];
  methods: string[];
  lastTraining?: Date;
  nextTraining?: Date;
  trainingRecords: { date: Date; attendees: number; instructor: string }[];
}

interface ProtocolHistoryEntry {
  date: Date;
  version: string;
  changes: string;
  changedBy: string;
  reason: string;
}

// Security coordination interfaces
interface SecurityCoordination {
  id: string;
  incidentId: string;
  incidentName: string;
  level: CoordinationLevel;
  status: 'initiated' | 'active' | 'suspended' | 'concluded';
  commandStructure: CommandStructure;
  agencies: CoordinatingAgency[];
  resources: SharedResource[];
  communications: CoordinationComms;
  meetings: CoordinationMeeting[];
  agreements: MutualAidAgreement[];
  issues: CoordinationIssue[];
  documentation: CoordinationDocument[];
  createdAt: Date;
  updatedAt: Date;
}

interface CommandStructure {
  unifiedCommand: boolean;
  incidentCommander?: string;
  securityBranchDirector?: string;
  operationsSectionChief?: string;
  positions: { title: string; name: string; agency: string; contact: string }[];
  organizationChart?: string;
}

interface CoordinatingAgency {
  id: string;
  name: string;
  type: 'law_enforcement' | 'fire' | 'ems' | 'emergency_management' | 'military' | 'private' | 'federal' | 'other';
  role: string;
  primaryContact: { name: string; title: string; phone: string; email: string };
  resources: { type: string; quantity: number; status: string }[];
  jurisdiction: string;
  limitations?: string[];
  status: 'engaged' | 'standby' | 'released';
}

interface SharedResource {
  id: string;
  type: string;
  description: string;
  providedBy: string;
  assignedTo?: string;
  quantity: number;
  status: 'available' | 'assigned' | 'deployed' | 'returned';
  location?: string;
  conditions?: string;
}

interface CoordinationComms {
  primaryChannel: string;
  interopChannels: { name: string; frequency: string; agencies: string[] }[];
  callSigns: { agency: string; callSign: string }[];
  communicationsPlan?: string;
  issues: { issue: string; resolution: string; resolved: boolean }[];
}

interface CoordinationMeeting {
  id: string;
  type: 'planning' | 'operational' | 'briefing' | 'debrief';
  scheduledTime: Date;
  location: string;
  attendees: string[];
  agenda: string[];
  minutes?: string;
  decisions: string[];
  actionItems: { item: string; assignedTo: string; dueDate: Date; status: string }[];
}

interface MutualAidAgreement {
  id: string;
  title: string;
  parties: string[];
  type: 'mutual_aid' | 'memorandum' | 'contract' | 'emergency';
  effectiveDate: Date;
  expirationDate?: Date;
  scope: string;
  terms: string[];
  activated: boolean;
  activationDate?: Date;
  contact: string;
}

interface CoordinationIssue {
  id: string;
  type: 'communication' | 'resource' | 'jurisdiction' | 'policy' | 'operational' | 'other';
  description: string;
  reportedBy: string;
  reportedAt: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
}

interface CoordinationDocument {
  id: string;
  type: 'iap' | 'sitrep' | 'agreement' | 'roster' | 'map' | 'briefing' | 'other';
  name: string;
  version: string;
  uploadedAt: Date;
  uploadedBy: string;
  url?: string;
}

// Sample data
const sampleSOCs: SecurityOperationsCenter[] = [
  {
    id: 'soc-001',
    name: 'County Emergency Security Operations Center',
    type: 'primary',
    status: 'operational',
    location: {
      address: '100 Emergency Way',
      city: 'Springfield',
      state: 'CA',
      coordinates: [38.5816, -121.4944],
      facility: 'EOC Building',
      room: 'Room 150',
      accessLevel: 'Restricted'
    },
    capabilities: {
      maxOperators: 12,
      surveillanceMonitors: 24,
      radioChannels: 8,
      phoneLines: 20,
      videoWall: true,
      gisCapability: true,
      dispatchCapability: true,
      integrations: ['CAD', 'Access Control', 'Video Management', 'Alarm Monitoring']
    },
    staffing: {
      minimumStaff: 3,
      currentStaff: 4,
      positions: [
        { title: 'Watch Commander', role: 'Supervision', assignedTo: 'Sgt. Johnson', status: 'filled', responsibilities: ['Overall operations', 'Decision making'] },
        { title: 'Surveillance Operator', role: 'Monitoring', assignedTo: 'Officer Smith', status: 'filled', responsibilities: ['Camera monitoring', 'Alarm response'] },
        { title: 'Dispatcher', role: 'Communications', assignedTo: 'Officer Brown', status: 'filled', responsibilities: ['Radio communications', 'Resource dispatch'] }
      ],
      shifts: [
        { name: 'Day', start: '06:00', end: '14:00', supervisor: 'Sgt. Johnson' },
        { name: 'Swing', start: '14:00', end: '22:00', supervisor: 'Sgt. Martinez' },
        { name: 'Night', start: '22:00', end: '06:00', supervisor: 'Sgt. Lee' }
      ]
    },
    communications: {
      primaryRadioFrequency: '460.525 MHz',
      backupRadioFrequency: '460.550 MHz',
      talkGroups: ['Security Main', 'Security Tactical', 'Command'],
      phoneNumbers: [
        { type: 'Main', number: '555-0500' },
        { type: 'Direct', number: '555-0501' }
      ],
      emergencyLine: '555-0911',
      interoperability: ['Fire', 'EMS', 'Law Enforcement', 'Public Works']
    },
    technology: {
      cameraSystem: { vendor: 'Axis', totalCameras: 150, status: 'operational' },
      accessControlSystem: { vendor: 'HID', status: 'operational' },
      alarmMonitoring: { vendor: 'Honeywell', zonesMonitored: 500, status: 'operational' },
      dispatchSystem: { vendor: 'CAD Pro', status: 'operational' },
      gis: { platform: 'ArcGIS', status: 'operational' },
      networking: { redundancy: true, backupPower: true, status: 'operational' }
    },
    activations: [],
    notes: 'Primary SOC with full capabilities. Backup power for 72 hours.',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  }
];

const sampleTeams: RapidResponseTeam[] = [
  {
    id: 'team-001',
    name: 'Alpha Response Team',
    type: 'security',
    status: 'standby',
    homeBase: 'Security Headquarters',
    personnel: [
      {
        id: 'member-001',
        name: 'Sgt. Williams',
        rank: 'Sergeant',
        role: 'leader',
        specialties: ['Tactical Operations', 'Crisis Negotiation'],
        certifications: ['Use of Force Instructor', 'CPR'],
        contact: '555-0601',
        status: 'available',
        armed: true
      }
    ],
    equipment: [
      {
        id: 'equip-001',
        type: 'Tactical Kit',
        description: 'Full tactical equipment set',
        quantity: 6,
        status: 'ready',
        location: 'Equipment Room A'
      }
    ],
    vehicles: [
      {
        id: 'veh-001',
        type: 'Response Vehicle',
        callSign: 'Alpha-1',
        licensePlate: 'GOV-1234',
        capacity: 6,
        status: 'available',
        equipment: ['Radio', 'First Aid', 'Barrier Tape', 'Cones']
      }
    ],
    certifications: ['Active Shooter Response', 'Crowd Control', 'VIP Protection'],
    specializations: ['Rapid Response', 'Perimeter Security'],
    responseTime: 15,
    deployments: [],
    availability: {
      schedule: [
        { dayOfWeek: 0, available: true },
        { dayOfWeek: 1, available: true, hours: { start: '06:00', end: '22:00' } },
        { dayOfWeek: 2, available: true, hours: { start: '06:00', end: '22:00' } },
        { dayOfWeek: 3, available: true, hours: { start: '06:00', end: '22:00' } },
        { dayOfWeek: 4, available: true, hours: { start: '06:00', end: '22:00' } },
        { dayOfWeek: 5, available: true, hours: { start: '06:00', end: '22:00' } },
        { dayOfWeek: 6, available: true }
      ],
      onCallPersonnel: ['Sgt. Williams', 'Officer Davis'],
      blackoutDates: []
    },
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date()
  }
];

class IncidentSecurityResponseService {
  private static instance: IncidentSecurityResponseService;
  private socs: Map<string, SecurityOperationsCenter> = new Map();
  private teams: Map<string, RapidResponseTeam> = new Map();
  private missions: Map<string, SecurityMission> = new Map();
  private protocols: Map<string, SecurityProtocol> = new Map();
  private coordinations: Map<string, SecurityCoordination> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): IncidentSecurityResponseService {
    if (!IncidentSecurityResponseService.instance) {
      IncidentSecurityResponseService.instance = new IncidentSecurityResponseService();
    }
    return IncidentSecurityResponseService.instance;
  }

  private initializeSampleData(): void {
    sampleSOCs.forEach(s => this.socs.set(s.id, s));
    sampleTeams.forEach(t => this.teams.set(t.id, t));
  }

  // ==================== SOC Management ====================

  async activateSOC(socId: string, incidentId: string, incidentName: string, level: SecurityResponseLevel, reason: string): Promise<SecurityOperationsCenter> {
    const soc = this.socs.get(socId);
    if (!soc) throw new Error(`SOC not found: ${socId}`);

    soc.status = 'activated';
    soc.currentIncident = incidentId;
    soc.activations.push({
      id: `act-${Date.now()}`,
      incidentId,
      incidentName,
      activatedAt: new Date(),
      level,
      reason,
      staffingLevel: soc.staffing.currentStaff,
      activities: ['SOC activated', 'All systems checked']
    });
    soc.updatedAt = new Date();
    return soc;
  }

  async deactivateSOC(socId: string): Promise<SecurityOperationsCenter> {
    const soc = this.socs.get(socId);
    if (!soc) throw new Error(`SOC not found: ${socId}`);

    const currentActivation = soc.activations.find(a => !a.deactivatedAt);
    if (currentActivation) {
      currentActivation.deactivatedAt = new Date();
    }

    soc.status = 'inactive';
    soc.currentIncident = undefined;
    soc.updatedAt = new Date();
    return soc;
  }

  async getSOC(socId: string): Promise<SecurityOperationsCenter | null> {
    return this.socs.get(socId) || null;
  }

  async getAllSOCs(): Promise<SecurityOperationsCenter[]> {
    return Array.from(this.socs.values());
  }

  async updateSOCStaffing(socId: string, positions: SOCPosition[]): Promise<SecurityOperationsCenter> {
    const soc = this.socs.get(socId);
    if (!soc) throw new Error(`SOC not found: ${socId}`);

    soc.staffing.positions = positions;
    soc.staffing.currentStaff = positions.filter(p => p.status === 'filled').length;
    soc.updatedAt = new Date();
    return soc;
  }

  // ==================== Response Team Management ====================

  async createRapidResponseTeam(params: Omit<RapidResponseTeam, 'id' | 'deployments' | 'createdAt' | 'updatedAt'>): Promise<RapidResponseTeam> {
    const team: RapidResponseTeam = {
      ...params,
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deployments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.teams.set(team.id, team);
    return team;
  }

  async getRapidResponseTeam(teamId: string): Promise<RapidResponseTeam | null> {
    return this.teams.get(teamId) || null;
  }

  async getRapidResponseTeams(params?: {
    type?: RapidResponseTeam['type'];
    status?: ResponseTeamStatus;
  }): Promise<RapidResponseTeam[]> {
    let teams = Array.from(this.teams.values());

    if (params?.type) {
      teams = teams.filter(t => t.type === params.type);
    }

    if (params?.status) {
      teams = teams.filter(t => t.status === params.status);
    }

    return teams;
  }

  async deployTeam(teamId: string, deployment: Omit<TeamDeployment, 'id' | 'status' | 'activities'>): Promise<RapidResponseTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    team.deployments.push({
      ...deployment,
      id: `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'deployed',
      activities: [{ timestamp: new Date(), activity: 'Team deployed', reportedBy: 'SOC' }]
    });
    team.status = 'deployed';
    team.currentLocation = deployment.coordinates;
    team.updatedAt = new Date();
    return team;
  }

  async returnTeam(teamId: string, deploymentId: string, notes: string): Promise<RapidResponseTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    const deployment = team.deployments.find(d => d.id === deploymentId);
    if (deployment) {
      deployment.returnedAt = new Date();
      deployment.status = 'deactivated';
      deployment.notes = notes;
      deployment.activities.push({ timestamp: new Date(), activity: 'Team returned to base', reportedBy: 'SOC' });
    }

    team.status = 'standby';
    team.currentLocation = undefined;
    team.updatedAt = new Date();
    return team;
  }

  async addDeploymentActivity(teamId: string, deploymentId: string, activity: string, reportedBy: string, location?: string): Promise<RapidResponseTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    const deployment = team.deployments.find(d => d.id === deploymentId);
    if (!deployment) throw new Error(`Deployment not found: ${deploymentId}`);

    deployment.activities.push({ timestamp: new Date(), activity, reportedBy, location });
    team.updatedAt = new Date();
    return team;
  }

  // ==================== Security Mission Management ====================

  async createSecurityMission(params: Omit<SecurityMission, 'id' | 'missionNumber' | 'status' | 'reporting' | 'createdAt' | 'updatedAt'>): Promise<SecurityMission> {
    const mission: SecurityMission = {
      ...params,
      id: `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      missionNumber: `SM-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'planned',
      reporting: { statusReports: [], incidentReports: [], mediaReports: [] },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.missions.set(mission.id, mission);
    return mission;
  }

  async getSecurityMission(missionId: string): Promise<SecurityMission | null> {
    return this.missions.get(missionId) || null;
  }

  async getSecurityMissions(params?: {
    incidentId?: string;
    type?: SecurityMissionType;
    status?: SecurityMission['status'];
    priority?: string;
  }): Promise<SecurityMission[]> {
    let missions = Array.from(this.missions.values());

    if (params?.incidentId) {
      missions = missions.filter(m => m.incidentId === params.incidentId);
    }

    if (params?.type) {
      missions = missions.filter(m => m.type === params.type);
    }

    if (params?.status) {
      missions = missions.filter(m => m.status === params.status);
    }

    if (params?.priority) {
      missions = missions.filter(m => m.priority === params.priority);
    }

    return missions.sort((a, b) => {
      const priorityOrder = ['critical', 'high', 'medium', 'low'];
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    });
  }

  async updateMissionStatus(missionId: string, status: SecurityMission['status']): Promise<SecurityMission> {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    mission.status = status;
    if (status === 'in_progress' && !mission.timeline.actualStart) {
      mission.timeline.actualStart = new Date();
    } else if (status === 'completed' || status === 'aborted') {
      mission.timeline.actualEnd = new Date();
    }
    mission.updatedAt = new Date();
    return mission;
  }

  async addStatusReport(missionId: string, report: Omit<StatusReport, 'id'>): Promise<SecurityMission> {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    mission.reporting.statusReports.push({
      ...report,
      id: `sr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    mission.updatedAt = new Date();
    return mission;
  }

  async conductMissionBriefing(missionId: string, briefing: Omit<MissionBriefing, 'conducted'>): Promise<SecurityMission> {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    mission.briefing = { ...briefing, conducted: true };
    mission.status = 'briefed';
    mission.updatedAt = new Date();
    return mission;
  }

  async conductMissionDebrief(missionId: string, debrief: MissionDebrief): Promise<SecurityMission> {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    mission.debrief = debrief;
    mission.updatedAt = new Date();
    return mission;
  }

  // ==================== Security Protocol Management ====================

  async createSecurityProtocol(params: Omit<SecurityProtocol, 'id' | 'status' | 'history' | 'createdAt' | 'updatedAt'>): Promise<SecurityProtocol> {
    const protocol: SecurityProtocol = {
      ...params,
      id: `protocol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      history: [{ date: new Date(), version: params.version, changes: 'Initial creation', changedBy: params.approvedBy, reason: 'New protocol' }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.protocols.set(protocol.id, protocol);
    return protocol;
  }

  async getSecurityProtocol(protocolId: string): Promise<SecurityProtocol | null> {
    return this.protocols.get(protocolId) || null;
  }

  async getSecurityProtocols(params?: {
    type?: SecurityProtocol['type'];
    status?: ProtocolStatus;
  }): Promise<SecurityProtocol[]> {
    let protocols = Array.from(this.protocols.values());

    if (params?.type) {
      protocols = protocols.filter(p => p.type === params.type);
    }

    if (params?.status) {
      protocols = protocols.filter(p => p.status === params.status);
    }

    return protocols;
  }

  async activateProtocol(protocolId: string, approver: string): Promise<SecurityProtocol> {
    const protocol = this.protocols.get(protocolId);
    if (!protocol) throw new Error(`Protocol not found: ${protocolId}`);

    protocol.status = 'active';
    protocol.history.push({
      date: new Date(),
      version: protocol.version,
      changes: 'Protocol activated',
      changedBy: approver,
      reason: 'Approved for operational use'
    });
    protocol.updatedAt = new Date();
    return protocol;
  }

  // ==================== Security Coordination ====================

  async createSecurityCoordination(params: Omit<SecurityCoordination, 'id' | 'status' | 'meetings' | 'issues' | 'documentation' | 'createdAt' | 'updatedAt'>): Promise<SecurityCoordination> {
    const coordination: SecurityCoordination = {
      ...params,
      id: `coord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'initiated',
      meetings: [],
      issues: [],
      documentation: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.coordinations.set(coordination.id, coordination);
    return coordination;
  }

  async getSecurityCoordination(coordinationId: string): Promise<SecurityCoordination | null> {
    return this.coordinations.get(coordinationId) || null;
  }

  async getCoordinationByIncident(incidentId: string): Promise<SecurityCoordination | null> {
    return Array.from(this.coordinations.values()).find(c => c.incidentId === incidentId) || null;
  }

  async addCoordinatingAgency(coordinationId: string, agency: Omit<CoordinatingAgency, 'id' | 'status'>): Promise<SecurityCoordination> {
    const coordination = this.coordinations.get(coordinationId);
    if (!coordination) throw new Error(`Coordination not found: ${coordinationId}`);

    coordination.agencies.push({
      ...agency,
      id: `agency-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'engaged'
    });
    coordination.updatedAt = new Date();
    return coordination;
  }

  async scheduleCoordinationMeeting(coordinationId: string, meeting: Omit<CoordinationMeeting, 'id' | 'decisions' | 'actionItems'>): Promise<SecurityCoordination> {
    const coordination = this.coordinations.get(coordinationId);
    if (!coordination) throw new Error(`Coordination not found: ${coordinationId}`);

    coordination.meetings.push({
      ...meeting,
      id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      decisions: [],
      actionItems: []
    });
    coordination.updatedAt = new Date();
    return coordination;
  }

  async reportCoordinationIssue(coordinationId: string, issue: Omit<CoordinationIssue, 'id' | 'status'>): Promise<SecurityCoordination> {
    const coordination = this.coordinations.get(coordinationId);
    if (!coordination) throw new Error(`Coordination not found: ${coordinationId}`);

    coordination.issues.push({
      ...issue,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'open'
    });
    coordination.updatedAt = new Date();
    return coordination;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalSOCs: number;
    activeSOCs: number;
    totalTeams: number;
    deployedTeams: number;
    standbyTeams: number;
    totalMissions: number;
    activeMissions: number;
    completedMissions: number;
    missionsByType: Record<SecurityMissionType, number>;
    totalProtocols: number;
    activeProtocols: number;
    activeCoordinations: number;
    coordinatingAgencies: number;
    averageMissionDuration: number;
    teamUtilizationRate: number;
  }> {
    const socs = Array.from(this.socs.values());
    const teams = Array.from(this.teams.values());
    const missions = Array.from(this.missions.values());
    const protocols = Array.from(this.protocols.values());
    const coordinations = Array.from(this.coordinations.values());

    const missionsByType: Record<SecurityMissionType, number> = {} as any;
    let totalMissionDuration = 0;
    let completedMissionsWithDuration = 0;

    missions.forEach(m => {
      missionsByType[m.type] = (missionsByType[m.type] || 0) + 1;
      if (m.timeline.actualStart && m.timeline.actualEnd) {
        totalMissionDuration += (m.timeline.actualEnd.getTime() - m.timeline.actualStart.getTime()) / (1000 * 60 * 60);
        completedMissionsWithDuration++;
      }
    });

    const deployedTeamCount = teams.filter(t => t.status === 'deployed' || t.status === 'on_scene').length;

    return {
      totalSOCs: socs.length,
      activeSOCs: socs.filter(s => ['activated', 'operational'].includes(s.status)).length,
      totalTeams: teams.length,
      deployedTeams: deployedTeamCount,
      standbyTeams: teams.filter(t => t.status === 'standby').length,
      totalMissions: missions.length,
      activeMissions: missions.filter(m => m.status === 'in_progress').length,
      completedMissions: missions.filter(m => m.status === 'completed').length,
      missionsByType,
      totalProtocols: protocols.length,
      activeProtocols: protocols.filter(p => p.status === 'active').length,
      activeCoordinations: coordinations.filter(c => c.status === 'active').length,
      coordinatingAgencies: coordinations.reduce((sum, c) => sum + c.agencies.length, 0),
      averageMissionDuration: completedMissionsWithDuration > 0 ? totalMissionDuration / completedMissionsWithDuration : 0,
      teamUtilizationRate: teams.length > 0 ? (deployedTeamCount / teams.length) * 100 : 0
    };
  }
}

export const incidentSecurityResponseService = IncidentSecurityResponseService.getInstance();
export default IncidentSecurityResponseService;

/**
 * Field Operations Service - Issue #163 Implementation
 * 
 * Provides comprehensive field operations management for disaster response
 * including team deployment, operational zones, field assignments,
 * situation reports, and operational planning.
 */

// Type definitions
type OperationStatus = 'planning' | 'mobilizing' | 'active' | 'scaling_down' | 'demobilizing' | 'completed' | 'suspended';
type ZoneType = 'impact' | 'staging' | 'evacuation' | 'shelter' | 'medical' | 'logistics' | 'command' | 'restricted';
type ZoneStatus = 'inactive' | 'activating' | 'active' | 'transitioning' | 'deactivating';
type AssignmentStatus = 'pending' | 'accepted' | 'en_route' | 'on_site' | 'in_progress' | 'completed' | 'cancelled';
type Priority = 'critical' | 'high' | 'medium' | 'low';

// Field operation interfaces
interface FieldOperation {
  id: string;
  name: string;
  incidentId: string;
  incidentName: string;
  type: 'response' | 'recovery' | 'mitigation' | 'preparedness' | 'exercise';
  status: OperationStatus;
  commandStructure: CommandStructure;
  objectives: OperationalObjective[];
  zones: string[];
  teams: string[];
  assignments: string[];
  timeline: OperationTimeline;
  resources: OperationResources;
  communications: CommunicationPlan;
  safetyPlan: SafetyPlan;
  logistics: LogisticsPlan;
  briefings: Briefing[];
  situationReports: string[];
  metrics: OperationMetrics;
  createdAt: Date;
  updatedAt: Date;
}

interface CommandStructure {
  incidentCommander: Personnel;
  operationsChief?: Personnel;
  planningChief?: Personnel;
  logisticsChief?: Personnel;
  financeChief?: Personnel;
  safetyOfficer?: Personnel;
  publicInfoOfficer?: Personnel;
  liaisonOfficer?: Personnel;
  branches?: Branch[];
  divisions?: Division[];
}

interface Personnel {
  id: string;
  name: string;
  title: string;
  agency: string;
  contact: { phone: string; email: string; radio?: string };
  qualifications?: string[];
}

interface Branch {
  name: string;
  director: Personnel;
  divisions: string[];
}

interface Division {
  name: string;
  supervisor: Personnel;
  groups: string[];
}

interface OperationalObjective {
  id: string;
  description: string;
  priority: Priority;
  assignedTo?: string;
  startDate?: Date;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  progress: number;
  metrics?: { name: string; target: number; current: number }[];
}

interface OperationTimeline {
  activationDate: Date;
  estimatedDuration: string;
  phases: OperationPhase[];
  milestones: { name: string; date: Date; status: string }[];
  demobilizationDate?: Date;
}

interface OperationPhase {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'planned' | 'active' | 'completed';
  objectives: string[];
}

interface OperationResources {
  personnelCount: number;
  vehicleCount: number;
  equipmentCount: number;
  estimatedCost: number;
  actualCost: number;
  resourceRequests: ResourceRequest[];
}

interface ResourceRequest {
  id: string;
  type: string;
  quantity: number;
  priority: Priority;
  status: 'pending' | 'approved' | 'fulfilled' | 'denied';
  requestedBy: string;
  requestDate: Date;
}

interface CommunicationPlan {
  primaryChannel: string;
  backupChannel: string;
  frequencies: { name: string; frequency: string; purpose: string }[];
  callSigns: { position: string; callSign: string }[];
  checkInSchedule: string;
  emergencySignal: string;
}

interface SafetyPlan {
  hazards: { type: string; description: string; mitigation: string }[];
  ppe: string[];
  medicalSupport: { location: string; contact: string };
  evacuationRoutes: { name: string; description: string }[];
  accountabilityProcedure: string;
  emergencySignals: { signal: string; meaning: string; action: string }[];
}

interface LogisticsPlan {
  stagingAreas: { name: string; location: string; purpose: string }[];
  supplyPoints: { name: string; location: string; items: string[] }[];
  fuelPoints: { name: string; location: string }[];
  foodService: { location: string; schedule: string };
  restAreas: { name: string; location: string; capacity: number }[];
}

interface Briefing {
  id: string;
  type: 'operational' | 'safety' | 'situation' | 'shift_change' | 'demobilization';
  date: Date;
  conductor: string;
  attendees: string[];
  topics: string[];
  notes?: string;
  attachments?: string[];
}

interface OperationMetrics {
  areasCleared: number;
  structuresSearched: number;
  peopleAssisted: number;
  evacuationsCompleted: number;
  resourcesDeployed: number;
  hoursWorked: number;
  incidentsReported: number;
}

// Operational zone interfaces
interface OperationalZone {
  id: string;
  operationId: string;
  name: string;
  type: ZoneType;
  status: ZoneStatus;
  boundaries: ZoneBoundary;
  description: string;
  supervisor?: Personnel;
  teams: string[];
  capacity?: number;
  currentOccupancy?: number;
  accessControl: AccessControl;
  hazards: string[];
  resources: ZoneResources;
  checkpoints: Checkpoint[];
  activities: ZoneActivity[];
  createdAt: Date;
  updatedAt: Date;
}

interface ZoneBoundary {
  type: 'polygon' | 'circle' | 'address_range';
  coordinates?: [number, number][];
  center?: [number, number];
  radius?: number;
  addresses?: { start: string; end: string };
  landmarks?: string[];
}

interface AccessControl {
  level: 'open' | 'restricted' | 'controlled' | 'closed';
  authorizedPersonnel: string[];
  requiredCredentials?: string[];
  entryPoints: { name: string; location: string; manned: boolean }[];
  restrictions?: string[];
}

interface ZoneResources {
  personnel: number;
  vehicles: number;
  equipment: { type: string; quantity: number }[];
  supplies: { type: string; quantity: number; unit: string }[];
}

interface Checkpoint {
  id: string;
  name: string;
  location: string;
  type: 'entry' | 'exit' | 'interior' | 'perimeter';
  manned: boolean;
  personnel?: string[];
  equipment?: string[];
  status: 'active' | 'inactive';
}

interface ZoneActivity {
  timestamp: Date;
  type: string;
  description: string;
  reportedBy: string;
}

// Field team interfaces
interface FieldTeam {
  id: string;
  name: string;
  operationId: string;
  type: 'search_rescue' | 'medical' | 'evacuation' | 'damage_assessment' | 'utilities' | 'security' | 'logistics' | 'general';
  status: 'available' | 'assigned' | 'deployed' | 'returning' | 'off_duty' | 'standby';
  leader: Personnel;
  members: TeamMember[];
  currentAssignment?: string;
  currentZone?: string;
  location?: TeamLocation;
  equipment: TeamEquipment[];
  vehicle?: TeamVehicle;
  capabilities: string[];
  certifications: string[];
  shift: ShiftInfo;
  communications: TeamCommunications;
  activityLog: TeamActivity[];
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  agency: string;
  certifications: string[];
  contact: { phone: string; radio?: string };
  status: 'active' | 'injured' | 'fatigued' | 'unavailable';
}

interface TeamLocation {
  latitude: number;
  longitude: number;
  address?: string;
  zone?: string;
  lastUpdate: Date;
  accuracy?: number;
}

interface TeamEquipment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  status: 'operational' | 'damaged' | 'lost';
}

interface TeamVehicle {
  id: string;
  type: string;
  identifier: string;
  capacity: number;
  status: 'operational' | 'maintenance' | 'fueling';
  fuelLevel?: number;
}

interface ShiftInfo {
  startTime: Date;
  endTime: Date;
  breaksTaken: { start: Date; end: Date }[];
  hoursWorked: number;
  nextShift?: Date;
}

interface TeamCommunications {
  primaryRadio: string;
  backupRadio?: string;
  callSign: string;
  lastCheckIn?: Date;
  checkInInterval: number;
}

interface TeamActivity {
  timestamp: Date;
  type: 'deployment' | 'arrival' | 'task_start' | 'task_complete' | 'check_in' | 'incident' | 'return';
  description: string;
  location?: string;
  reportedBy: string;
}

// Field assignment interfaces
interface FieldAssignment {
  id: string;
  operationId: string;
  teamId: string;
  teamName: string;
  zoneId?: string;
  zoneName?: string;
  type: 'search' | 'rescue' | 'evacuation' | 'assessment' | 'patrol' | 'support' | 'transport' | 'medical';
  priority: Priority;
  status: AssignmentStatus;
  title: string;
  description: string;
  objectives: string[];
  location: AssignmentLocation;
  schedule: AssignmentSchedule;
  instructions: string[];
  safetyNotes: string[];
  contacts: { role: string; name: string; phone: string }[];
  resources: string[];
  progress: AssignmentProgress;
  reports: AssignmentReport[];
  createdAt: Date;
  updatedAt: Date;
}

interface AssignmentLocation {
  address?: string;
  coordinates?: [number, number];
  landmark?: string;
  zone?: string;
  sector?: string;
  searchArea?: ZoneBoundary;
}

interface AssignmentSchedule {
  assignedDate: Date;
  startTime?: Date;
  estimatedDuration: string;
  deadline?: Date;
  actualStart?: Date;
  actualEnd?: Date;
}

interface AssignmentProgress {
  percentComplete: number;
  areasCompleted: string[];
  areasRemaining: string[];
  findings: string[];
  issues: string[];
}

interface AssignmentReport {
  id: string;
  timestamp: Date;
  type: 'status' | 'completion' | 'incident' | 'discovery';
  reportedBy: string;
  content: string;
  attachments?: string[];
  location?: [number, number];
}

// Situation report interfaces
interface SituationReport {
  id: string;
  operationId: string;
  operationName: string;
  reportNumber: number;
  reportPeriod: { start: Date; end: Date };
  preparedBy: string;
  approvedBy?: string;
  status: 'draft' | 'submitted' | 'approved' | 'distributed';
  executiveSummary: string;
  currentSituation: CurrentSituation;
  operations: OperationsSummary;
  resources: ResourcesSummary;
  safety: SafetySummary;
  weather: WeatherSummary;
  plannedActions: string[];
  issues: { issue: string; impact: string; action: string }[];
  attachments: string[];
  distribution: string[];
  createdAt: Date;
}

interface CurrentSituation {
  overview: string;
  affectedArea: string;
  population: { affected: number; evacuated: number; sheltered: number };
  infrastructure: { status: string; details: string }[];
  significantEvents: string[];
}

interface OperationsSummary {
  activitiesCompleted: string[];
  activitiesOngoing: string[];
  objectivesProgress: { objective: string; progress: number }[];
  teamsDeployed: number;
  zonesActive: number;
}

interface ResourcesSummary {
  personnel: { assigned: number; onScene: number; available: number };
  vehicles: { assigned: number; operational: number };
  equipment: { type: string; quantity: number; status: string }[];
  expenditures: number;
}

interface SafetySummary {
  injuries: number;
  fatalities: number;
  nearMisses: number;
  safetyIssues: string[];
  correctiveActions: string[];
}

interface WeatherSummary {
  current: string;
  forecast: string;
  impacts: string[];
  alerts: string[];
}

// Sample data
const sampleOperations: FieldOperation[] = [
  {
    id: 'op-001',
    name: 'Hurricane Response - Coastal County',
    incidentId: 'inc-2024-001',
    incidentName: 'Hurricane Delta',
    type: 'response',
    status: 'active',
    commandStructure: {
      incidentCommander: {
        id: 'pers-001',
        name: 'Chief Sarah Mitchell',
        title: 'Incident Commander',
        agency: 'County Emergency Management',
        contact: { phone: '555-0100', email: 'smitchell@county.gov', radio: 'Command 1' }
      },
      operationsChief: {
        id: 'pers-002',
        name: 'Captain John Rivera',
        title: 'Operations Section Chief',
        agency: 'Fire Department',
        contact: { phone: '555-0101', email: 'jrivera@fire.gov', radio: 'Ops 1' }
      }
    },
    objectives: [
      {
        id: 'obj-001',
        description: 'Complete primary search of impact zone',
        priority: 'critical',
        targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'in_progress',
        progress: 65
      }
    ],
    zones: ['zone-001', 'zone-002'],
    teams: ['team-001', 'team-002'],
    assignments: ['assign-001'],
    timeline: {
      activationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estimatedDuration: '14 days',
      phases: [
        {
          name: 'Initial Response',
          description: 'Life safety and immediate needs',
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'active',
          objectives: ['Search and rescue', 'Evacuation support']
        }
      ],
      milestones: []
    },
    resources: {
      personnelCount: 150,
      vehicleCount: 45,
      equipmentCount: 200,
      estimatedCost: 500000,
      actualCost: 275000,
      resourceRequests: []
    },
    communications: {
      primaryChannel: 'TAC 1',
      backupChannel: 'TAC 2',
      frequencies: [
        { name: 'Command', frequency: '154.280', purpose: 'Command coordination' },
        { name: 'Tactical', frequency: '154.295', purpose: 'Field operations' }
      ],
      callSigns: [
        { position: 'Incident Commander', callSign: 'Command' },
        { position: 'Operations', callSign: 'Ops' }
      ],
      checkInSchedule: 'Every 30 minutes',
      emergencySignal: 'MAYDAY MAYDAY MAYDAY'
    },
    safetyPlan: {
      hazards: [
        { type: 'Flood water', description: 'Standing water contamination', mitigation: 'PPE, avoid contact' }
      ],
      ppe: ['Hard hat', 'Safety vest', 'Steel-toe boots', 'Gloves'],
      medicalSupport: { location: 'Staging Area A', contact: 'Medical 1' },
      evacuationRoutes: [{ name: 'Primary', description: 'Highway 101 North' }],
      accountabilityProcedure: 'PAR every 30 minutes',
      emergencySignals: [{ signal: '3 horn blasts', meaning: 'Evacuate immediately', action: 'Move to rally point' }]
    },
    logistics: {
      stagingAreas: [{ name: 'Staging A', location: 'County Fairgrounds', purpose: 'Primary staging' }],
      supplyPoints: [{ name: 'Supply 1', location: 'Staging A', items: ['Water', 'MREs', 'PPE'] }],
      fuelPoints: [{ name: 'Fuel 1', location: 'East lot' }],
      foodService: { location: 'Fairgrounds Building B', schedule: '0600, 1200, 1800' },
      restAreas: [{ name: 'Rest 1', location: 'Building C', capacity: 50 }]
    },
    briefings: [],
    situationReports: [],
    metrics: {
      areasCleared: 45,
      structuresSearched: 230,
      peopleAssisted: 156,
      evacuationsCompleted: 89,
      resourcesDeployed: 150,
      hoursWorked: 3600,
      incidentsReported: 5
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class FieldOperationsService {
  private static instance: FieldOperationsService;
  private operations: Map<string, FieldOperation> = new Map();
  private zones: Map<string, OperationalZone> = new Map();
  private teams: Map<string, FieldTeam> = new Map();
  private assignments: Map<string, FieldAssignment> = new Map();
  private situationReports: Map<string, SituationReport> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): FieldOperationsService {
    if (!FieldOperationsService.instance) {
      FieldOperationsService.instance = new FieldOperationsService();
    }
    return FieldOperationsService.instance;
  }

  private initializeSampleData(): void {
    sampleOperations.forEach(op => this.operations.set(op.id, op));
  }

  // ==================== Operation Management ====================

  async createOperation(params: Omit<FieldOperation, 'id' | 'zones' | 'teams' | 'assignments' | 'situationReports' | 'briefings' | 'createdAt' | 'updatedAt'>): Promise<FieldOperation> {
    const operation: FieldOperation = {
      ...params,
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zones: [],
      teams: [],
      assignments: [],
      situationReports: [],
      briefings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.operations.set(operation.id, operation);
    return operation;
  }

  async getOperation(operationId: string): Promise<FieldOperation | null> {
    return this.operations.get(operationId) || null;
  }

  async getOperations(params?: {
    incidentId?: string;
    status?: OperationStatus;
    type?: FieldOperation['type'];
  }): Promise<FieldOperation[]> {
    let operations = Array.from(this.operations.values());

    if (params?.incidentId) {
      operations = operations.filter(o => o.incidentId === params.incidentId);
    }

    if (params?.status) {
      operations = operations.filter(o => o.status === params.status);
    }

    if (params?.type) {
      operations = operations.filter(o => o.type === params.type);
    }

    return operations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateOperationStatus(operationId: string, status: OperationStatus): Promise<FieldOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.status = status;
    operation.updatedAt = new Date();

    return operation;
  }

  async addObjective(operationId: string, objective: Omit<OperationalObjective, 'id' | 'status' | 'progress'>): Promise<FieldOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.objectives.push({
      ...objective,
      id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'not_started',
      progress: 0
    });

    operation.updatedAt = new Date();
    return operation;
  }

  async updateObjectiveProgress(operationId: string, objectiveId: string, progress: number): Promise<FieldOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    const objective = operation.objectives.find(o => o.id === objectiveId);
    if (!objective) throw new Error(`Objective not found: ${objectiveId}`);

    objective.progress = progress;
    objective.status = progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';
    operation.updatedAt = new Date();

    return operation;
  }

  async addBriefing(operationId: string, briefing: Omit<Briefing, 'id'>): Promise<FieldOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.briefings.push({
      ...briefing,
      id: `brief-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    operation.updatedAt = new Date();
    return operation;
  }

  // ==================== Zone Management ====================

  async createZone(params: Omit<OperationalZone, 'id' | 'teams' | 'activities' | 'createdAt' | 'updatedAt'>): Promise<OperationalZone> {
    const zone: OperationalZone = {
      ...params,
      id: `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      teams: [],
      activities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.zones.set(zone.id, zone);

    // Add to operation
    const operation = this.operations.get(params.operationId);
    if (operation) {
      operation.zones.push(zone.id);
      operation.updatedAt = new Date();
    }

    return zone;
  }

  async getZone(zoneId: string): Promise<OperationalZone | null> {
    return this.zones.get(zoneId) || null;
  }

  async getZones(params?: {
    operationId?: string;
    type?: ZoneType;
    status?: ZoneStatus;
  }): Promise<OperationalZone[]> {
    let zones = Array.from(this.zones.values());

    if (params?.operationId) {
      zones = zones.filter(z => z.operationId === params.operationId);
    }

    if (params?.type) {
      zones = zones.filter(z => z.type === params.type);
    }

    if (params?.status) {
      zones = zones.filter(z => z.status === params.status);
    }

    return zones;
  }

  async updateZoneStatus(zoneId: string, status: ZoneStatus): Promise<OperationalZone> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    zone.status = status;
    zone.activities.push({
      timestamp: new Date(),
      type: 'status_change',
      description: `Zone status changed to ${status}`,
      reportedBy: 'System'
    });
    zone.updatedAt = new Date();

    return zone;
  }

  async logZoneActivity(zoneId: string, activity: Omit<ZoneActivity, 'timestamp'>): Promise<OperationalZone> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);

    zone.activities.push({
      ...activity,
      timestamp: new Date()
    });
    zone.updatedAt = new Date();

    return zone;
  }

  // ==================== Team Management ====================

  async createTeam(params: Omit<FieldTeam, 'id' | 'activityLog' | 'createdAt' | 'updatedAt'>): Promise<FieldTeam> {
    const team: FieldTeam = {
      ...params,
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      activityLog: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.teams.set(team.id, team);

    // Add to operation
    const operation = this.operations.get(params.operationId);
    if (operation) {
      operation.teams.push(team.id);
      operation.updatedAt = new Date();
    }

    return team;
  }

  async getTeam(teamId: string): Promise<FieldTeam | null> {
    return this.teams.get(teamId) || null;
  }

  async getTeams(params?: {
    operationId?: string;
    type?: FieldTeam['type'];
    status?: FieldTeam['status'];
    zoneId?: string;
  }): Promise<FieldTeam[]> {
    let teams = Array.from(this.teams.values());

    if (params?.operationId) {
      teams = teams.filter(t => t.operationId === params.operationId);
    }

    if (params?.type) {
      teams = teams.filter(t => t.type === params.type);
    }

    if (params?.status) {
      teams = teams.filter(t => t.status === params.status);
    }

    if (params?.zoneId) {
      teams = teams.filter(t => t.currentZone === params.zoneId);
    }

    return teams;
  }

  async updateTeamStatus(teamId: string, status: FieldTeam['status']): Promise<FieldTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    team.status = status;
    team.activityLog.push({
      timestamp: new Date(),
      type: 'check_in',
      description: `Status updated to ${status}`,
      reportedBy: team.leader.name
    });
    team.updatedAt = new Date();

    return team;
  }

  async updateTeamLocation(teamId: string, location: TeamLocation): Promise<FieldTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    team.location = { ...location, lastUpdate: new Date() };
    team.updatedAt = new Date();

    return team;
  }

  async teamCheckIn(teamId: string, reportedBy: string): Promise<FieldTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    team.communications.lastCheckIn = new Date();
    team.activityLog.push({
      timestamp: new Date(),
      type: 'check_in',
      description: 'Routine check-in',
      reportedBy
    });
    team.updatedAt = new Date();

    return team;
  }

  // ==================== Assignment Management ====================

  async createAssignment(params: Omit<FieldAssignment, 'id' | 'status' | 'progress' | 'reports' | 'createdAt' | 'updatedAt'>): Promise<FieldAssignment> {
    const assignment: FieldAssignment = {
      ...params,
      id: `assign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      progress: {
        percentComplete: 0,
        areasCompleted: [],
        areasRemaining: [],
        findings: [],
        issues: []
      },
      reports: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.assignments.set(assignment.id, assignment);

    // Update operation
    const operation = this.operations.get(params.operationId);
    if (operation) {
      operation.assignments.push(assignment.id);
      operation.updatedAt = new Date();
    }

    // Update team
    const team = this.teams.get(params.teamId);
    if (team) {
      team.currentAssignment = assignment.id;
      team.status = 'assigned';
      team.updatedAt = new Date();
    }

    return assignment;
  }

  async getAssignment(assignmentId: string): Promise<FieldAssignment | null> {
    return this.assignments.get(assignmentId) || null;
  }

  async getAssignments(params?: {
    operationId?: string;
    teamId?: string;
    zoneId?: string;
    status?: AssignmentStatus;
    priority?: Priority;
  }): Promise<FieldAssignment[]> {
    let assignments = Array.from(this.assignments.values());

    if (params?.operationId) {
      assignments = assignments.filter(a => a.operationId === params.operationId);
    }

    if (params?.teamId) {
      assignments = assignments.filter(a => a.teamId === params.teamId);
    }

    if (params?.zoneId) {
      assignments = assignments.filter(a => a.zoneId === params.zoneId);
    }

    if (params?.status) {
      assignments = assignments.filter(a => a.status === params.status);
    }

    if (params?.priority) {
      assignments = assignments.filter(a => a.priority === params.priority);
    }

    return assignments;
  }

  async updateAssignmentStatus(assignmentId: string, status: AssignmentStatus): Promise<FieldAssignment> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    assignment.status = status;

    if (status === 'in_progress' && !assignment.schedule.actualStart) {
      assignment.schedule.actualStart = new Date();
    } else if (status === 'completed') {
      assignment.schedule.actualEnd = new Date();
      assignment.progress.percentComplete = 100;

      // Update team
      const team = this.teams.get(assignment.teamId);
      if (team) {
        team.currentAssignment = undefined;
        team.status = 'available';
        team.updatedAt = new Date();
      }
    }

    assignment.updatedAt = new Date();
    return assignment;
  }

  async updateAssignmentProgress(assignmentId: string, progress: Partial<AssignmentProgress>): Promise<FieldAssignment> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    Object.assign(assignment.progress, progress);
    assignment.updatedAt = new Date();

    return assignment;
  }

  async addAssignmentReport(assignmentId: string, report: Omit<AssignmentReport, 'id' | 'timestamp'>): Promise<FieldAssignment> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    assignment.reports.push({
      ...report,
      id: `rpt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date()
    });
    assignment.updatedAt = new Date();

    return assignment;
  }

  // ==================== Situation Reports ====================

  async createSituationReport(params: Omit<SituationReport, 'id' | 'status' | 'createdAt'>): Promise<SituationReport> {
    const report: SituationReport = {
      ...params,
      id: `sitrep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      createdAt: new Date()
    };

    this.situationReports.set(report.id, report);

    // Add to operation
    const operation = this.operations.get(params.operationId);
    if (operation) {
      operation.situationReports.push(report.id);
      operation.updatedAt = new Date();
    }

    return report;
  }

  async getSituationReport(reportId: string): Promise<SituationReport | null> {
    return this.situationReports.get(reportId) || null;
  }

  async getSituationReports(params?: {
    operationId?: string;
    status?: SituationReport['status'];
  }): Promise<SituationReport[]> {
    let reports = Array.from(this.situationReports.values());

    if (params?.operationId) {
      reports = reports.filter(r => r.operationId === params.operationId);
    }

    if (params?.status) {
      reports = reports.filter(r => r.status === params.status);
    }

    return reports.sort((a, b) => b.reportNumber - a.reportNumber);
  }

  async approveSituationReport(reportId: string, approver: string): Promise<SituationReport> {
    const report = this.situationReports.get(reportId);
    if (!report) throw new Error(`Situation report not found: ${reportId}`);

    report.status = 'approved';
    report.approvedBy = approver;

    return report;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalOperations: number;
    activeOperations: number;
    totalZones: number;
    activeZones: number;
    totalTeams: number;
    deployedTeams: number;
    totalAssignments: number;
    activeAssignments: number;
    completedAssignments: number;
    totalPersonnel: number;
    areasCleared: number;
    structuresSearched: number;
    peopleAssisted: number;
    byOperationType: Record<string, number>;
    byTeamType: Record<string, number>;
  }> {
    const operations = Array.from(this.operations.values());
    const zones = Array.from(this.zones.values());
    const teams = Array.from(this.teams.values());
    const assignments = Array.from(this.assignments.values());

    let totalPersonnel = 0;
    let areasCleared = 0;
    let structuresSearched = 0;
    let peopleAssisted = 0;

    operations.forEach(op => {
      totalPersonnel += op.resources.personnelCount;
      areasCleared += op.metrics.areasCleared;
      structuresSearched += op.metrics.structuresSearched;
      peopleAssisted += op.metrics.peopleAssisted;
    });

    const byOperationType: Record<string, number> = {};
    operations.forEach(op => {
      byOperationType[op.type] = (byOperationType[op.type] || 0) + 1;
    });

    const byTeamType: Record<string, number> = {};
    teams.forEach(t => {
      byTeamType[t.type] = (byTeamType[t.type] || 0) + 1;
    });

    return {
      totalOperations: operations.length,
      activeOperations: operations.filter(o => o.status === 'active').length,
      totalZones: zones.length,
      activeZones: zones.filter(z => z.status === 'active').length,
      totalTeams: teams.length,
      deployedTeams: teams.filter(t => t.status === 'deployed').length,
      totalAssignments: assignments.length,
      activeAssignments: assignments.filter(a => ['accepted', 'en_route', 'on_site', 'in_progress'].includes(a.status)).length,
      completedAssignments: assignments.filter(a => a.status === 'completed').length,
      totalPersonnel,
      areasCleared,
      structuresSearched,
      peopleAssisted,
      byOperationType,
      byTeamType
    };
  }
}

export const fieldOperationsService = FieldOperationsService.getInstance();
export default FieldOperationsService;

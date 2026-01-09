/**
 * Search and Rescue Service - Issue #165 Implementation
 * 
 * Provides comprehensive search and rescue operations management
 * including SAR team coordination, search area management, victim tracking,
 * rescue operations, and mission documentation.
 */

// Type definitions
type SARMissionType = 'wilderness' | 'urban' | 'water' | 'avalanche' | 'cave' | 'disaster' | 'missing_person' | 'technical_rescue';
type MissionStatus = 'alert' | 'planning' | 'active' | 'suspended' | 'demobilizing' | 'closed';
type SearchStatus = 'not_started' | 'in_progress' | 'completed' | 'suspended' | 'cleared';
type VictimStatus = 'missing' | 'located' | 'contacted' | 'rescued' | 'recovered' | 'self_rescued' | 'false_alarm';
type TeamType = 'ground' | 'k9' | 'mounted' | 'water' | 'air' | 'technical' | 'medical' | 'dive';
type RescueType = 'ambulatory' | 'carryout' | 'technical' | 'helicopter' | 'water' | 'confined_space';

// SAR mission interfaces
interface SARMission {
  id: string;
  name: string;
  missionNumber: string;
  type: SARMissionType;
  status: MissionStatus;
  priority: 'emergency' | 'urgent' | 'routine';
  incidentId?: string;
  requestingAgency: string;
  reportedDate: Date;
  subject: SubjectInfo;
  lastKnownPoint: LocationPoint;
  searchArea: SearchAreaDefinition;
  planningData: PlanningData;
  teams: string[];
  assignments: string[];
  victims: string[];
  rescues: string[];
  timeline: MissionTimeline;
  weather: WeatherConditions;
  hazards: string[];
  communications: SARCommunications;
  resources: SARResources;
  clues: Clue[];
  briefings: SARBriefing[];
  documentation: MissionDocumentation;
  statistics: MissionStatistics;
  createdAt: Date;
  updatedAt: Date;
}

interface SubjectInfo {
  name: string;
  age?: number;
  gender?: string;
  description: PhysicalDescription;
  medicalConditions?: string[];
  medications?: string[];
  mentalStatus?: string;
  experience: 'none' | 'beginner' | 'intermediate' | 'expert';
  equipment?: string[];
  contacts: EmergencyContact[];
  photos?: string[];
  lastSeen: { time: Date; location: string; activity: string };
  intendedDestination?: string;
  vehicleInfo?: { make: string; model: string; color: string; plate: string };
}

interface PhysicalDescription {
  height?: string;
  weight?: string;
  hairColor?: string;
  eyeColor?: string;
  clothing?: string[];
  distinguishingFeatures?: string[];
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  interviewed: boolean;
}

interface LocationPoint {
  latitude: number;
  longitude: number;
  elevation?: number;
  accuracy?: number;
  source: string;
  timestamp: Date;
  description?: string;
}

interface SearchAreaDefinition {
  type: 'circle' | 'polygon' | 'corridor';
  coordinates: [number, number][];
  radius?: number;
  totalArea: number;
  areaUnit: 'sq_miles' | 'sq_km' | 'acres';
  terrain: string[];
  segments: SearchSegment[];
}

interface SearchSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  area: number;
  priority: number;
  pod: number;
  status: SearchStatus;
  assignedTeam?: string;
  terrain: string;
  difficulty: 'easy' | 'moderate' | 'difficult' | 'extreme';
  hazards: string[];
  searchedAt?: Date;
  coverage?: number;
}

interface PlanningData {
  probabilityOfDetection: number;
  probabilityOfArea: number;
  cumulativePod: number;
  searchObjective: string;
  searchTactics: string[];
  resourceRequirements: string[];
  constraints: string[];
  assumptions: string[];
}

interface MissionTimeline {
  alertTime: Date;
  activationTime?: Date;
  firstTeamDeployed?: Date;
  subjectLocated?: Date;
  subjectRescued?: Date;
  missionClosed?: Date;
  operationalPeriods: OperationalPeriod[];
}

interface OperationalPeriod {
  number: number;
  start: Date;
  end: Date;
  objectives: string[];
  resources: number;
  areaSearched: number;
  results: string;
}

interface WeatherConditions {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    precipitation: string;
    visibility: string;
    conditions: string;
  };
  forecast: {
    period: string;
    conditions: string;
    temperature: { high: number; low: number };
    precipitation: string;
  }[];
  alerts: string[];
  survivalImpact: string;
}

interface SARCommunications {
  commandChannel: string;
  tacticalChannels: string[];
  airOpsChannel?: string;
  emergencyChannel: string;
  cellCoverage: 'none' | 'poor' | 'moderate' | 'good';
  satelliteAvailable: boolean;
  callSigns: { role: string; callSign: string }[];
}

interface SARResources {
  personnel: { total: number; fieldDeployed: number; basecamp: number };
  teams: { type: TeamType; count: number; status: string }[];
  vehicles: { type: string; count: number }[];
  aircraft: { type: string; callSign: string; status: string }[];
  equipment: { item: string; quantity: number }[];
  k9Units: { handler: string; dog: string; specialty: string; status: string }[];
}

interface Clue {
  id: string;
  timestamp: Date;
  type: 'physical' | 'track' | 'scent' | 'sighting' | 'communication' | 'other';
  description: string;
  location: LocationPoint;
  foundBy: string;
  significance: 'high' | 'medium' | 'low' | 'unknown';
  verified: boolean;
  photos?: string[];
  collected: boolean;
  analysis?: string;
}

interface SARBriefing {
  id: string;
  type: 'initial' | 'operational' | 'team' | 'demobilization';
  date: Date;
  conductor: string;
  attendees: number;
  topics: string[];
  iapVersion?: string;
  notes?: string;
}

interface MissionDocumentation {
  incidentActionPlans: { version: number; date: Date; url: string }[];
  maps: { name: string; type: string; url: string }[];
  forms: { name: string; completed: boolean; url?: string }[];
  mediaReleases: { date: Date; content: string }[];
  afterActionReport?: string;
}

interface MissionStatistics {
  hoursSearched: number;
  areaSearched: number;
  segmentsCleared: number;
  cluesFound: number;
  resourceHours: number;
  milesHiked: number;
  flightHours: number;
}

// SAR team interfaces
interface SARTeam {
  id: string;
  missionId: string;
  name: string;
  type: TeamType;
  status: 'staging' | 'briefing' | 'deployed' | 'searching' | 'rescue' | 'returning' | 'debriefing' | 'off_duty';
  leader: TeamLeader;
  members: SARTeamMember[];
  assignment?: string;
  segment?: string;
  equipment: string[];
  communications: TeamComms;
  location?: LocationPoint;
  trackLog: TrackPoint[];
  findings: TeamFinding[];
  shift: { start: Date; end: Date };
  createdAt: Date;
  updatedAt: Date;
}

interface TeamLeader {
  id: string;
  name: string;
  certifications: string[];
  agency: string;
  contact: { phone: string; radio: string };
}

interface SARTeamMember {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  agency: string;
  medicalTraining?: string;
  status: 'active' | 'fatigued' | 'injured';
}

interface TeamComms {
  primaryRadio: string;
  callSign: string;
  lastContact: Date;
  checkInSchedule: string;
  gpsTracking: boolean;
}

interface TrackPoint {
  timestamp: Date;
  latitude: number;
  longitude: number;
  elevation?: number;
  activity?: string;
}

interface TeamFinding {
  id: string;
  timestamp: Date;
  type: 'clue' | 'subject' | 'hazard' | 'route' | 'note';
  description: string;
  location: LocationPoint;
  photos?: string[];
  action?: string;
}

// Search assignment interfaces
interface SearchAssignment {
  id: string;
  missionId: string;
  teamId: string;
  teamName: string;
  assignmentNumber: string;
  type: 'hasty' | 'grid' | 'sweep' | 'containment' | 'trail' | 'water' | 'air';
  status: 'assigned' | 'in_progress' | 'completed' | 'suspended' | 'cancelled';
  segment: SearchSegment;
  tactics: SearchTactics;
  schedule: AssignmentSchedule;
  objectives: string[];
  instructions: string[];
  safetyNotes: string[];
  results?: AssignmentResults;
  debriefing?: TeamDebriefing;
  createdAt: Date;
  updatedAt: Date;
}

interface SearchTactics {
  method: string;
  spacing: string;
  direction: string;
  pattern?: string;
  speed: string;
  coverage: string;
}

interface AssignmentSchedule {
  briefingTime: Date;
  deployTime: Date;
  expectedReturn: Date;
  actualDepart?: Date;
  actualReturn?: Date;
}

interface AssignmentResults {
  areaSearched: number;
  podAchieved: number;
  cluesFound: number;
  coverage: number;
  timeInField: number;
  distanceCovered: number;
  completionStatus: 'full' | 'partial' | 'aborted';
  notes: string;
}

interface TeamDebriefing {
  conductor: string;
  date: Date;
  areaDescription: string;
  searchQuality: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  issues: string[];
  gpsTrack?: string;
  photos?: string[];
}

// Victim/subject tracking interfaces
interface VictimRecord {
  id: string;
  missionId: string;
  subjectNumber: number;
  status: VictimStatus;
  name: string;
  demographics: {
    age?: number;
    gender?: string;
  };
  condition?: PatientCondition;
  timeline: VictimTimeline;
  location?: LocationPoint;
  foundBy?: string;
  rescueId?: string;
  disposition?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PatientCondition {
  status: 'stable' | 'serious' | 'critical' | 'deceased';
  injuries: string[];
  medicalNeeds: string[];
  ambulatory: boolean;
  conscious: boolean;
  triageCategory?: 'immediate' | 'delayed' | 'minor' | 'expectant';
}

interface VictimTimeline {
  reported: Date;
  searchStarted?: Date;
  located?: Date;
  contacted?: Date;
  rescued?: Date;
  transported?: Date;
  hospitalArrival?: Date;
}

// Rescue operation interfaces
interface RescueOperation {
  id: string;
  missionId: string;
  victimId: string;
  type: RescueType;
  status: 'planning' | 'en_route' | 'on_scene' | 'extracting' | 'transporting' | 'completed';
  priority: 'immediate' | 'urgent' | 'routine';
  location: LocationPoint;
  rescueTeam: string;
  medicalTeam?: string;
  equipment: string[];
  plan: RescuePlan;
  execution: RescueExecution;
  outcome?: RescueOutcome;
  createdAt: Date;
  updatedAt: Date;
}

interface RescuePlan {
  approach: string;
  extractionMethod: string;
  transportMethod: string;
  destination: string;
  hazards: string[];
  safetyMeasures: string[];
  backupPlan?: string;
  estimatedTime: string;
}

interface RescueExecution {
  startTime?: Date;
  arrivalTime?: Date;
  patientContact?: Date;
  extractionStart?: Date;
  extractionComplete?: Date;
  transportStart?: Date;
  arrivalAtDestination?: Date;
  issues: string[];
  adaptations: string[];
}

interface RescueOutcome {
  success: boolean;
  patientCondition: string;
  destination: string;
  handoffTo: string;
  handoffTime: Date;
  notes: string;
}

// Sample data
const sampleMissions: SARMission[] = [
  {
    id: 'sar-001',
    name: 'Missing Hiker - Eagle Peak',
    missionNumber: 'SAR-2024-0042',
    type: 'wilderness',
    status: 'active',
    priority: 'urgent',
    requestingAgency: 'County Sheriff',
    reportedDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    subject: {
      name: 'John Smith',
      age: 34,
      gender: 'Male',
      description: {
        height: '5\'10"',
        weight: '175 lbs',
        hairColor: 'Brown',
        eyeColor: 'Blue',
        clothing: ['Red jacket', 'Blue jeans', 'Brown hiking boots'],
        distinguishingFeatures: ['Beard', 'Tattoo on left arm']
      },
      medicalConditions: ['Diabetes'],
      medications: ['Insulin'],
      experience: 'intermediate',
      equipment: ['Backpack', 'Water bottle', 'Cell phone'],
      contacts: [
        {
          name: 'Jane Smith',
          relationship: 'Wife',
          phone: '555-0150',
          interviewed: true
        }
      ],
      lastSeen: {
        time: new Date(Date.now() - 24 * 60 * 60 * 1000),
        location: 'Eagle Peak Trailhead',
        activity: 'Started day hike'
      },
      intendedDestination: 'Eagle Peak Summit',
      vehicleInfo: {
        make: 'Toyota',
        model: 'Tacoma',
        color: 'Silver',
        plate: 'ABC-1234'
      }
    },
    lastKnownPoint: {
      latitude: 39.7392,
      longitude: -104.9903,
      elevation: 8500,
      source: 'Trailhead witness',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      description: 'Eagle Peak Trailhead parking lot'
    },
    searchArea: {
      type: 'circle',
      coordinates: [[39.7392, -104.9903]],
      radius: 5,
      totalArea: 78.5,
      areaUnit: 'sq_miles',
      terrain: ['Alpine', 'Forest', 'Rocky'],
      segments: [
        {
          id: 'seg-001',
          name: 'Primary Trail Corridor',
          coordinates: [[39.7392, -104.9903], [39.7500, -104.9800]],
          area: 2.5,
          priority: 1,
          pod: 0,
          status: 'in_progress',
          terrain: 'Trail',
          difficulty: 'moderate',
          hazards: ['Steep terrain', 'Loose rock']
        }
      ]
    },
    planningData: {
      probabilityOfDetection: 0.7,
      probabilityOfArea: 0.85,
      cumulativePod: 0.35,
      searchObjective: 'Locate and rescue missing hiker',
      searchTactics: ['Hasty search of trails', 'K9 track from LKP', 'Air search'],
      resourceRequirements: ['4 ground teams', '1 K9 team', '1 helicopter'],
      constraints: ['Limited daylight', 'Weather deteriorating'],
      assumptions: ['Subject is mobile', 'Subject seeking help']
    },
    teams: ['team-001', 'team-002'],
    assignments: ['assign-001'],
    victims: ['victim-001'],
    rescues: [],
    timeline: {
      alertTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      activationTime: new Date(Date.now() - 7 * 60 * 60 * 1000),
      firstTeamDeployed: new Date(Date.now() - 6 * 60 * 60 * 1000),
      operationalPeriods: [
        {
          number: 1,
          start: new Date(Date.now() - 6 * 60 * 60 * 1000),
          end: new Date(Date.now() + 6 * 60 * 60 * 1000),
          objectives: ['Search primary trail corridor', 'Deploy K9 team'],
          resources: 25,
          areaSearched: 15,
          results: 'In progress'
        }
      ]
    },
    weather: {
      current: {
        temperature: 45,
        humidity: 65,
        windSpeed: 15,
        windDirection: 'NW',
        precipitation: 'None',
        visibility: '10 miles',
        conditions: 'Partly cloudy'
      },
      forecast: [
        {
          period: 'Tonight',
          conditions: 'Clearing',
          temperature: { high: 50, low: 32 },
          precipitation: '10%'
        }
      ],
      alerts: [],
      survivalImpact: 'Moderate - Cold overnight temperatures'
    },
    hazards: ['Steep terrain', 'Loose rock', 'Wildlife', 'Cold temperatures'],
    communications: {
      commandChannel: 'SAR TAC 1',
      tacticalChannels: ['SAR TAC 2', 'SAR TAC 3'],
      airOpsChannel: 'AIR OPS 1',
      emergencyChannel: 'EMERGENCY',
      cellCoverage: 'poor',
      satelliteAvailable: true,
      callSigns: [
        { role: 'Command', callSign: 'SAR Command' },
        { role: 'Air', callSign: 'Air 1' }
      ]
    },
    resources: {
      personnel: { total: 35, fieldDeployed: 25, basecamp: 10 },
      teams: [
        { type: 'ground', count: 4, status: 'deployed' },
        { type: 'k9', count: 1, status: 'deployed' }
      ],
      vehicles: [{ type: 'ATV', count: 4 }],
      aircraft: [{ type: 'Helicopter', callSign: 'Air 1', status: 'searching' }],
      equipment: [{ item: 'Litter', quantity: 4 }],
      k9Units: [{ handler: 'Officer Brown', dog: 'Rex', specialty: 'Tracking', status: 'deployed' }]
    },
    clues: [],
    briefings: [],
    documentation: {
      incidentActionPlans: [],
      maps: [],
      forms: [],
      mediaReleases: []
    },
    statistics: {
      hoursSearched: 24,
      areaSearched: 15,
      segmentsCleared: 3,
      cluesFound: 2,
      resourceHours: 150,
      milesHiked: 45,
      flightHours: 2
    },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class SearchAndRescueService {
  private static instance: SearchAndRescueService;
  private missions: Map<string, SARMission> = new Map();
  private teams: Map<string, SARTeam> = new Map();
  private assignments: Map<string, SearchAssignment> = new Map();
  private victims: Map<string, VictimRecord> = new Map();
  private rescues: Map<string, RescueOperation> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SearchAndRescueService {
    if (!SearchAndRescueService.instance) {
      SearchAndRescueService.instance = new SearchAndRescueService();
    }
    return SearchAndRescueService.instance;
  }

  private initializeSampleData(): void {
    sampleMissions.forEach(m => this.missions.set(m.id, m));
  }

  // ==================== Mission Management ====================

  async createMission(params: Omit<SARMission, 'id' | 'teams' | 'assignments' | 'victims' | 'rescues' | 'clues' | 'briefings' | 'statistics' | 'createdAt' | 'updatedAt'>): Promise<SARMission> {
    const mission: SARMission = {
      ...params,
      id: `sar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      teams: [],
      assignments: [],
      victims: [],
      rescues: [],
      clues: [],
      briefings: [],
      statistics: {
        hoursSearched: 0,
        areaSearched: 0,
        segmentsCleared: 0,
        cluesFound: 0,
        resourceHours: 0,
        milesHiked: 0,
        flightHours: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.missions.set(mission.id, mission);
    return mission;
  }

  async getMission(missionId: string): Promise<SARMission | null> {
    return this.missions.get(missionId) || null;
  }

  async getMissions(params?: {
    type?: SARMissionType;
    status?: MissionStatus;
    priority?: SARMission['priority'];
  }): Promise<SARMission[]> {
    let missions = Array.from(this.missions.values());

    if (params?.type) {
      missions = missions.filter(m => m.type === params.type);
    }

    if (params?.status) {
      missions = missions.filter(m => m.status === params.status);
    }

    if (params?.priority) {
      missions = missions.filter(m => m.priority === params.priority);
    }

    return missions.sort((a, b) => b.reportedDate.getTime() - a.reportedDate.getTime());
  }

  async updateMissionStatus(missionId: string, status: MissionStatus): Promise<SARMission> {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    mission.status = status;

    if (status === 'active' && !mission.timeline.activationTime) {
      mission.timeline.activationTime = new Date();
    } else if (status === 'closed') {
      mission.timeline.missionClosed = new Date();
    }

    mission.updatedAt = new Date();
    return mission;
  }

  async addClue(missionId: string, clue: Omit<Clue, 'id' | 'timestamp'>): Promise<SARMission> {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    mission.clues.push({
      ...clue,
      id: `clue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date()
    });

    mission.statistics.cluesFound++;
    mission.updatedAt = new Date();

    return mission;
  }

  async updateSearchSegment(missionId: string, segmentId: string, update: Partial<SearchSegment>): Promise<SARMission> {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    const segment = mission.searchArea.segments.find(s => s.id === segmentId);
    if (!segment) throw new Error(`Segment not found: ${segmentId}`);

    Object.assign(segment, update);

    if (update.status === 'completed') {
      segment.searchedAt = new Date();
      mission.statistics.segmentsCleared++;
    }

    mission.updatedAt = new Date();
    return mission;
  }

  async addBriefing(missionId: string, briefing: Omit<SARBriefing, 'id'>): Promise<SARMission> {
    const mission = this.missions.get(missionId);
    if (!mission) throw new Error(`Mission not found: ${missionId}`);

    mission.briefings.push({
      ...briefing,
      id: `brief-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    mission.updatedAt = new Date();
    return mission;
  }

  // ==================== Team Management ====================

  async createTeam(params: Omit<SARTeam, 'id' | 'trackLog' | 'findings' | 'createdAt' | 'updatedAt'>): Promise<SARTeam> {
    const team: SARTeam = {
      ...params,
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trackLog: [],
      findings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.teams.set(team.id, team);

    // Add to mission
    const mission = this.missions.get(params.missionId);
    if (mission) {
      mission.teams.push(team.id);
      mission.updatedAt = new Date();
    }

    return team;
  }

  async getTeam(teamId: string): Promise<SARTeam | null> {
    return this.teams.get(teamId) || null;
  }

  async getTeams(params?: {
    missionId?: string;
    type?: TeamType;
    status?: SARTeam['status'];
  }): Promise<SARTeam[]> {
    let teams = Array.from(this.teams.values());

    if (params?.missionId) {
      teams = teams.filter(t => t.missionId === params.missionId);
    }

    if (params?.type) {
      teams = teams.filter(t => t.type === params.type);
    }

    if (params?.status) {
      teams = teams.filter(t => t.status === params.status);
    }

    return teams;
  }

  async updateTeamStatus(teamId: string, status: SARTeam['status']): Promise<SARTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    team.status = status;
    team.updatedAt = new Date();

    return team;
  }

  async updateTeamLocation(teamId: string, location: LocationPoint): Promise<SARTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    team.location = location;
    team.trackLog.push({
      timestamp: new Date(),
      latitude: location.latitude,
      longitude: location.longitude,
      elevation: location.elevation
    });
    team.communications.lastContact = new Date();
    team.updatedAt = new Date();

    return team;
  }

  async addTeamFinding(teamId: string, finding: Omit<TeamFinding, 'id' | 'timestamp'>): Promise<SARTeam> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    team.findings.push({
      ...finding,
      id: `find-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date()
    });
    team.updatedAt = new Date();

    return team;
  }

  // ==================== Assignment Management ====================

  async createAssignment(params: Omit<SearchAssignment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<SearchAssignment> {
    const assignment: SearchAssignment = {
      ...params,
      id: `assign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'assigned',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.assignments.set(assignment.id, assignment);

    // Update mission
    const mission = this.missions.get(params.missionId);
    if (mission) {
      mission.assignments.push(assignment.id);
      mission.updatedAt = new Date();
    }

    // Update team
    const team = this.teams.get(params.teamId);
    if (team) {
      team.assignment = assignment.id;
      team.segment = params.segment.id;
      team.updatedAt = new Date();
    }

    return assignment;
  }

  async getAssignment(assignmentId: string): Promise<SearchAssignment | null> {
    return this.assignments.get(assignmentId) || null;
  }

  async getAssignments(params?: {
    missionId?: string;
    teamId?: string;
    status?: SearchAssignment['status'];
    type?: SearchAssignment['type'];
  }): Promise<SearchAssignment[]> {
    let assignments = Array.from(this.assignments.values());

    if (params?.missionId) {
      assignments = assignments.filter(a => a.missionId === params.missionId);
    }

    if (params?.teamId) {
      assignments = assignments.filter(a => a.teamId === params.teamId);
    }

    if (params?.status) {
      assignments = assignments.filter(a => a.status === params.status);
    }

    if (params?.type) {
      assignments = assignments.filter(a => a.type === params.type);
    }

    return assignments;
  }

  async updateAssignmentStatus(assignmentId: string, status: SearchAssignment['status']): Promise<SearchAssignment> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    assignment.status = status;

    if (status === 'in_progress') {
      assignment.schedule.actualDepart = new Date();
    } else if (status === 'completed') {
      assignment.schedule.actualReturn = new Date();

      // Update mission segment
      const mission = this.missions.get(assignment.missionId);
      if (mission) {
        const segment = mission.searchArea.segments.find(s => s.id === assignment.segment.id);
        if (segment && assignment.results) {
          segment.status = 'completed';
          segment.coverage = assignment.results.coverage;
          segment.pod = assignment.results.podAchieved;
        }
      }
    }

    assignment.updatedAt = new Date();
    return assignment;
  }

  async completeAssignment(assignmentId: string, results: AssignmentResults): Promise<SearchAssignment> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    assignment.status = 'completed';
    assignment.results = results;
    assignment.schedule.actualReturn = new Date();
    assignment.updatedAt = new Date();

    // Update mission statistics
    const mission = this.missions.get(assignment.missionId);
    if (mission) {
      mission.statistics.areaSearched += results.areaSearched;
      mission.statistics.milesHiked += results.distanceCovered;
      mission.statistics.resourceHours += results.timeInField;
      mission.updatedAt = new Date();
    }

    return assignment;
  }

  async addDebriefing(assignmentId: string, debriefing: TeamDebriefing): Promise<SearchAssignment> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    assignment.debriefing = debriefing;
    assignment.updatedAt = new Date();

    return assignment;
  }

  // ==================== Victim Management ====================

  async createVictimRecord(params: Omit<VictimRecord, 'id' | 'timeline' | 'createdAt' | 'updatedAt'>): Promise<VictimRecord> {
    const victim: VictimRecord = {
      ...params,
      id: `victim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timeline: {
        reported: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.victims.set(victim.id, victim);

    // Add to mission
    const mission = this.missions.get(params.missionId);
    if (mission) {
      mission.victims.push(victim.id);
      mission.updatedAt = new Date();
    }

    return victim;
  }

  async getVictimRecord(victimId: string): Promise<VictimRecord | null> {
    return this.victims.get(victimId) || null;
  }

  async updateVictimStatus(victimId: string, status: VictimStatus, location?: LocationPoint): Promise<VictimRecord> {
    const victim = this.victims.get(victimId);
    if (!victim) throw new Error(`Victim record not found: ${victimId}`);

    victim.status = status;

    if (location) {
      victim.location = location;
    }

    // Update timeline
    if (status === 'located') {
      victim.timeline.located = new Date();
    } else if (status === 'contacted') {
      victim.timeline.contacted = new Date();
    } else if (status === 'rescued') {
      victim.timeline.rescued = new Date();
    }

    // Update mission timeline
    const mission = this.missions.get(victim.missionId);
    if (mission && status === 'located' && !mission.timeline.subjectLocated) {
      mission.timeline.subjectLocated = new Date();
      mission.updatedAt = new Date();
    }

    victim.updatedAt = new Date();
    return victim;
  }

  async updateVictimCondition(victimId: string, condition: PatientCondition): Promise<VictimRecord> {
    const victim = this.victims.get(victimId);
    if (!victim) throw new Error(`Victim record not found: ${victimId}`);

    victim.condition = condition;
    victim.updatedAt = new Date();

    return victim;
  }

  // ==================== Rescue Operations ====================

  async createRescueOperation(params: Omit<RescueOperation, 'id' | 'status' | 'execution' | 'createdAt' | 'updatedAt'>): Promise<RescueOperation> {
    const rescue: RescueOperation = {
      ...params,
      id: `rescue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'planning',
      execution: {
        issues: [],
        adaptations: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.rescues.set(rescue.id, rescue);

    // Add to mission
    const mission = this.missions.get(params.missionId);
    if (mission) {
      mission.rescues.push(rescue.id);
      mission.updatedAt = new Date();
    }

    // Update victim
    const victim = this.victims.get(params.victimId);
    if (victim) {
      victim.rescueId = rescue.id;
      victim.updatedAt = new Date();
    }

    return rescue;
  }

  async getRescueOperation(rescueId: string): Promise<RescueOperation | null> {
    return this.rescues.get(rescueId) || null;
  }

  async updateRescueStatus(rescueId: string, status: RescueOperation['status']): Promise<RescueOperation> {
    const rescue = this.rescues.get(rescueId);
    if (!rescue) throw new Error(`Rescue operation not found: ${rescueId}`);

    rescue.status = status;

    // Update execution timestamps
    if (status === 'en_route') {
      rescue.execution.startTime = new Date();
    } else if (status === 'on_scene') {
      rescue.execution.arrivalTime = new Date();
    } else if (status === 'extracting') {
      rescue.execution.extractionStart = new Date();
    } else if (status === 'transporting') {
      rescue.execution.extractionComplete = new Date();
      rescue.execution.transportStart = new Date();
    } else if (status === 'completed') {
      rescue.execution.arrivalAtDestination = new Date();
    }

    rescue.updatedAt = new Date();
    return rescue;
  }

  async completeRescue(rescueId: string, outcome: RescueOutcome): Promise<RescueOperation> {
    const rescue = this.rescues.get(rescueId);
    if (!rescue) throw new Error(`Rescue operation not found: ${rescueId}`);

    rescue.status = 'completed';
    rescue.outcome = outcome;
    rescue.execution.arrivalAtDestination = new Date();
    rescue.updatedAt = new Date();

    // Update victim
    const victim = this.victims.get(rescue.victimId);
    if (victim) {
      victim.status = 'rescued';
      victim.timeline.rescued = new Date();
      victim.disposition = outcome.destination;
      victim.updatedAt = new Date();
    }

    // Update mission
    const mission = this.missions.get(rescue.missionId);
    if (mission && !mission.timeline.subjectRescued) {
      mission.timeline.subjectRescued = new Date();
      mission.updatedAt = new Date();
    }

    return rescue;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalMissions: number;
    activeMissions: number;
    totalTeams: number;
    deployedTeams: number;
    totalVictims: number;
    victimsLocated: number;
    victimsRescued: number;
    totalRescues: number;
    successfulRescues: number;
    totalHoursSearched: number;
    totalAreaSearched: number;
    totalCluesFound: number;
    averageResponseTime: string;
    byMissionType: Record<SARMissionType, number>;
    byTeamType: Record<TeamType, number>;
  }> {
    const missions = Array.from(this.missions.values());
    const teams = Array.from(this.teams.values());
    const victims = Array.from(this.victims.values());
    const rescues = Array.from(this.rescues.values());

    let totalHoursSearched = 0;
    let totalAreaSearched = 0;
    let totalCluesFound = 0;

    missions.forEach(m => {
      totalHoursSearched += m.statistics.hoursSearched;
      totalAreaSearched += m.statistics.areaSearched;
      totalCluesFound += m.statistics.cluesFound;
    });

    const byMissionType: Record<SARMissionType, number> = {} as any;
    missions.forEach(m => {
      byMissionType[m.type] = (byMissionType[m.type] || 0) + 1;
    });

    const byTeamType: Record<TeamType, number> = {} as any;
    teams.forEach(t => {
      byTeamType[t.type] = (byTeamType[t.type] || 0) + 1;
    });

    // Calculate average response time
    let totalResponseTime = 0;
    let responseMissions = 0;
    missions.forEach(m => {
      if (m.timeline.activationTime) {
        totalResponseTime += m.timeline.activationTime.getTime() - m.reportedDate.getTime();
        responseMissions++;
      }
    });
    const avgResponseMs = responseMissions > 0 ? totalResponseTime / responseMissions : 0;
    const avgResponseMinutes = Math.round(avgResponseMs / (1000 * 60));

    return {
      totalMissions: missions.length,
      activeMissions: missions.filter(m => m.status === 'active').length,
      totalTeams: teams.length,
      deployedTeams: teams.filter(t => ['deployed', 'searching', 'rescue'].includes(t.status)).length,
      totalVictims: victims.length,
      victimsLocated: victims.filter(v => ['located', 'contacted', 'rescued'].includes(v.status)).length,
      victimsRescued: victims.filter(v => v.status === 'rescued').length,
      totalRescues: rescues.length,
      successfulRescues: rescues.filter(r => r.outcome?.success).length,
      totalHoursSearched,
      totalAreaSearched,
      totalCluesFound,
      averageResponseTime: `${avgResponseMinutes} minutes`,
      byMissionType,
      byTeamType
    };
  }
}

export const searchAndRescueService = SearchAndRescueService.getInstance();
export default SearchAndRescueService;

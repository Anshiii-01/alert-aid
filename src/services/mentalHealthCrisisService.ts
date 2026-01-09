/**
 * Mental Health Crisis Service - Issue #130 Implementation
 * 
 * Provides comprehensive mental health crisis response management including
 * crisis assessment, intervention protocols, resource allocation, peer support,
 * and coordination with behavioral health services during emergencies.
 */

// Type definitions
type CrisisType = 'suicidal_ideation' | 'self_harm' | 'psychotic_episode' | 'panic_attack' | 'severe_anxiety' | 'depression' | 'substance_crisis' | 'trauma_response' | 'grief' | 'domestic_violence' | 'child_abuse' | 'elder_abuse' | 'eating_disorder' | 'other';
type RiskLevel = 'low' | 'moderate' | 'high' | 'imminent';
type InterventionType = 'crisis_stabilization' | 'safety_planning' | 'hospitalization' | 'mobile_crisis' | 'peer_support' | 'telehealth' | 'referral' | 'follow_up';
type ProviderType = 'psychiatrist' | 'psychologist' | 'lcsw' | 'lpc' | 'crisis_counselor' | 'peer_specialist' | 'case_manager' | 'nurse';
type ServiceStatus = 'available' | 'busy' | 'offline' | 'emergency_only';

// Crisis assessment interfaces
interface CrisisAssessment {
  id: string;
  clientId: string;
  assessorId: string;
  incidentId?: string;
  crisisType: CrisisType;
  presenting_problem: string;
  riskAssessment: RiskAssessmentResult;
  mentalStatusExam: MentalStatusExam;
  safetyPlan?: SafetyPlan;
  disposition: CrisisDisposition;
  interventions: CrisisIntervention[];
  referrals: Referral[];
  followUp: FollowUp;
  timeline: AssessmentEvent[];
  createdAt: Date;
  updatedAt: Date;
}

interface RiskAssessmentResult {
  suicidalIdeation: {
    present: boolean;
    frequency?: 'rare' | 'occasional' | 'frequent' | 'constant';
    plan: boolean;
    planDetails?: string;
    intent: boolean;
    means: boolean;
    meansAccess?: string;
  };
  selfHarm: {
    present: boolean;
    history: boolean;
    recentAttempt: boolean;
    method?: string;
  };
  violenceRisk: {
    toOthers: boolean;
    specificTarget: boolean;
    plan: boolean;
  };
  protectiveFactors: string[];
  riskFactors: string[];
  overallRiskLevel: RiskLevel;
  rationale: string;
}

interface MentalStatusExam {
  appearance: string;
  behavior: string;
  speech: string;
  mood: string;
  affect: string;
  thoughtProcess: string;
  thoughtContent: string;
  perceptions: string;
  cognition: {
    orientation: { person: boolean; place: boolean; time: boolean; situation: boolean };
    memory: string;
    concentration: string;
    judgment: string;
    insight: string;
  };
  observations: string;
}

interface SafetyPlan {
  id: string;
  warningSignals: string[];
  copingStrategies: {
    internal: string[];
    external: string[];
  };
  reasonsToLive: string[];
  socialSupports: SafetyContact[];
  professionalContacts: SafetyContact[];
  emergencyContacts: SafetyContact[];
  environmentSafety: {
    meansRestriction: string[];
    safeEnvironment: string[];
  };
  crisisResources: string[];
  commitmentStatement?: string;
  createdAt: Date;
  reviewDate: Date;
}

interface SafetyContact {
  name: string;
  relationship: string;
  phone: string;
  available: string; // "24/7", "9am-5pm", etc.
  canDiscussCrisis: boolean;
}

interface CrisisDisposition {
  level: 'outpatient' | 'intensive_outpatient' | 'partial_hospitalization' | 'crisis_stabilization' | 'inpatient' | 'emergency_room';
  voluntary: boolean;
  facility?: string;
  transportMethod?: 'self' | 'family' | 'ambulance' | 'police' | 'mobile_crisis';
  acceptancePending: boolean;
  acceptedAt?: Date;
  notes: string;
}

interface CrisisIntervention {
  id: string;
  type: InterventionType;
  description: string;
  providerId: string;
  providerName: string;
  startedAt: Date;
  completedAt?: Date;
  outcome: 'successful' | 'partial' | 'unsuccessful' | 'ongoing';
  notes: string;
}

interface Referral {
  id: string;
  type: 'psychiatry' | 'therapy' | 'substance_treatment' | 'case_management' | 'support_group' | 'housing' | 'financial' | 'legal' | 'medical' | 'other';
  agency: string;
  contact: string;
  phone: string;
  urgency: 'immediate' | 'within_24_hours' | 'within_week' | 'routine';
  status: 'pending' | 'scheduled' | 'completed' | 'declined';
  appointmentDate?: Date;
  notes: string;
}

interface FollowUp {
  required: boolean;
  timing: 'within_24_hours' | 'within_48_hours' | 'within_week' | 'within_month';
  assignedTo: string;
  scheduledDate?: Date;
  completed: boolean;
  completedDate?: Date;
  outcome?: string;
}

interface AssessmentEvent {
  timestamp: Date;
  type: 'created' | 'updated' | 'intervention' | 'disposition' | 'follow_up' | 'note';
  description: string;
  actor: string;
}

// Client interfaces
interface CrisisClient {
  id: string;
  anonymousId: string;
  demographics?: {
    age?: number;
    gender?: string;
    preferredLanguage?: string;
  };
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  history: {
    previousCrises: string[];
    mentalHealthHistory: string[];
    substanceUse: string[];
    medications: string[];
    allergies: string[];
    currentProviders: string[];
  };
  safetyPlans: string[];
  assessments: string[];
  status: 'active_crisis' | 'stabilizing' | 'stable' | 'in_treatment' | 'discharged';
  createdAt: Date;
  updatedAt: Date;
}

// Provider interfaces
interface CrisisProvider {
  id: string;
  name: string;
  credentials: string[];
  type: ProviderType;
  specializations: CrisisType[];
  languages: string[];
  contact: {
    phone: string;
    email: string;
  };
  availability: ProviderAvailability;
  currentCaseload: number;
  maxCaseload: number;
  status: ServiceStatus;
  ratings: {
    average: number;
    count: number;
  };
  certifications: string[];
}

interface ProviderAvailability {
  schedule: {
    [day: string]: { start: string; end: string }[];
  };
  onCall: boolean;
  nextAvailable?: Date;
}

// Resource interfaces
interface CrisisResource {
  id: string;
  name: string;
  type: 'crisis_center' | 'psychiatric_hospital' | 'emergency_room' | 'mobile_crisis_team' | 'crisis_hotline' | 'peer_support' | 'respite' | 'detox' | 'shelter';
  address?: string;
  location?: { lat: number; lon: number };
  phone: string;
  hours: string;
  services: string[];
  populations: string[];
  languages: string[];
  insurance: string[];
  currentCapacity?: {
    total: number;
    available: number;
    waitTime?: number;
  };
  status: 'open' | 'limited' | 'full' | 'closed';
  lastUpdated: Date;
}

interface MobileCrisisTeam {
  id: string;
  name: string;
  coverage: string;
  members: CrisisProvider[];
  vehicle?: {
    id: string;
    type: string;
    location?: { lat: number; lon: number };
  };
  status: 'available' | 'dispatched' | 'on_scene' | 'transporting' | 'offline';
  currentDispatch?: {
    assessmentId: string;
    dispatchedAt: Date;
    eta?: number;
  };
  completedToday: number;
  averageResponseTime: number;
}

// Support group interfaces
interface SupportGroup {
  id: string;
  name: string;
  type: CrisisType[];
  format: 'in_person' | 'virtual' | 'hybrid';
  schedule: {
    day: string;
    time: string;
    frequency: 'weekly' | 'biweekly' | 'monthly';
  };
  facilitator: string;
  location?: string;
  virtualLink?: string;
  capacity: number;
  currentMembers: number;
  openEnrollment: boolean;
  description: string;
}

// Disaster mental health interfaces
interface DisasterMentalHealthResponse {
  id: string;
  incidentId: string;
  incidentName: string;
  activatedAt: Date;
  deactivatedAt?: Date;
  scope: 'local' | 'regional' | 'state' | 'national';
  teams: MobileCrisisTeam[];
  shelterSupport: {
    shelters: string[];
    staffAssigned: number;
    individualsServed: number;
  };
  psychologicalFirstAid: {
    trained: number;
    deployed: number;
    contactsMade: number;
  };
  briefings: number;
  criticalIncidentStressManagement: {
    defusings: number;
    debriefings: number;
    individualsReached: number;
  };
  status: 'activated' | 'active' | 'demobilizing' | 'deactivated';
}

// Sample data
const sampleProviders: CrisisProvider[] = [
  {
    id: 'provider-001',
    name: 'Dr. Sarah Mitchell',
    credentials: ['PhD', 'Licensed Psychologist'],
    type: 'psychologist',
    specializations: ['suicidal_ideation', 'trauma_response', 'depression'],
    languages: ['English', 'Spanish'],
    contact: { phone: '+1-555-0101', email: 'smitchell@mentalhealth.org' },
    availability: {
      schedule: {
        monday: [{ start: '09:00', end: '17:00' }],
        tuesday: [{ start: '09:00', end: '17:00' }],
        wednesday: [{ start: '09:00', end: '17:00' }],
        thursday: [{ start: '09:00', end: '17:00' }],
        friday: [{ start: '09:00', end: '15:00' }]
      },
      onCall: true
    },
    currentCaseload: 12,
    maxCaseload: 20,
    status: 'available',
    ratings: { average: 4.8, count: 156 },
    certifications: ['Trauma-Informed Care', 'CISM', 'PFA']
  }
];

const sampleResources: CrisisResource[] = [
  {
    id: 'resource-001',
    name: 'Metro Crisis Center',
    type: 'crisis_center',
    address: '100 Mental Health Way',
    location: { lat: 34.0522, lon: -118.2437 },
    phone: '+1-555-CRISIS',
    hours: '24/7',
    services: ['Crisis assessment', 'Stabilization', 'Safety planning', 'Referrals'],
    populations: ['Adults', 'Adolescents'],
    languages: ['English', 'Spanish', 'Mandarin'],
    insurance: ['Medicare', 'Medicaid', 'Private', 'Self-pay'],
    currentCapacity: { total: 20, available: 8, waitTime: 15 },
    status: 'open',
    lastUpdated: new Date()
  },
  {
    id: 'resource-002',
    name: 'National Suicide Prevention Lifeline',
    type: 'crisis_hotline',
    phone: '988',
    hours: '24/7',
    services: ['Crisis support', 'Suicide prevention', 'Referrals'],
    populations: ['All ages'],
    languages: ['English', 'Spanish', '150+ languages via interpreter'],
    insurance: ['Free'],
    status: 'open',
    lastUpdated: new Date()
  }
];

class MentalHealthCrisisService {
  private static instance: MentalHealthCrisisService;
  private clients: Map<string, CrisisClient> = new Map();
  private assessments: Map<string, CrisisAssessment> = new Map();
  private providers: Map<string, CrisisProvider> = new Map();
  private resources: Map<string, CrisisResource> = new Map();
  private mobileTeams: Map<string, MobileCrisisTeam> = new Map();
  private supportGroups: Map<string, SupportGroup> = new Map();
  private disasterResponses: Map<string, DisasterMentalHealthResponse> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): MentalHealthCrisisService {
    if (!MentalHealthCrisisService.instance) {
      MentalHealthCrisisService.instance = new MentalHealthCrisisService();
    }
    return MentalHealthCrisisService.instance;
  }

  private initializeSampleData(): void {
    sampleProviders.forEach(p => this.providers.set(p.id, p));
    sampleResources.forEach(r => this.resources.set(r.id, r));
  }

  // ==================== Client Management ====================

  async registerClient(params: {
    contactInfo?: CrisisClient['contactInfo'];
    demographics?: CrisisClient['demographics'];
    emergencyContact?: CrisisClient['emergencyContact'];
    history?: Partial<CrisisClient['history']>;
  }): Promise<CrisisClient> {
    const client: CrisisClient = {
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      anonymousId: `ANO-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      demographics: params.demographics,
      contactInfo: params.contactInfo || {},
      emergencyContact: params.emergencyContact,
      history: {
        previousCrises: params.history?.previousCrises || [],
        mentalHealthHistory: params.history?.mentalHealthHistory || [],
        substanceUse: params.history?.substanceUse || [],
        medications: params.history?.medications || [],
        allergies: params.history?.allergies || [],
        currentProviders: params.history?.currentProviders || []
      },
      safetyPlans: [],
      assessments: [],
      status: 'active_crisis',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.clients.set(client.id, client);
    return client;
  }

  async getClient(clientId: string): Promise<CrisisClient | null> {
    return this.clients.get(clientId) || null;
  }

  async updateClientStatus(clientId: string, status: CrisisClient['status']): Promise<CrisisClient> {
    const client = this.clients.get(clientId);
    if (!client) throw new Error(`Client not found: ${clientId}`);

    client.status = status;
    client.updatedAt = new Date();

    return client;
  }

  // ==================== Crisis Assessment ====================

  async createAssessment(params: {
    clientId: string;
    assessorId: string;
    incidentId?: string;
    crisisType: CrisisType;
    presentingProblem: string;
    riskAssessment: RiskAssessmentResult;
    mentalStatusExam: MentalStatusExam;
  }): Promise<CrisisAssessment> {
    const client = this.clients.get(params.clientId);
    if (!client) throw new Error(`Client not found: ${params.clientId}`);

    const assessment: CrisisAssessment = {
      id: `assess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      clientId: params.clientId,
      assessorId: params.assessorId,
      incidentId: params.incidentId,
      crisisType: params.crisisType,
      presenting_problem: params.presentingProblem,
      riskAssessment: params.riskAssessment,
      mentalStatusExam: params.mentalStatusExam,
      disposition: {
        level: this.recommendDisposition(params.riskAssessment),
        voluntary: true,
        acceptancePending: false,
        notes: ''
      },
      interventions: [],
      referrals: [],
      followUp: {
        required: true,
        timing: this.recommendFollowUpTiming(params.riskAssessment.overallRiskLevel),
        assignedTo: params.assessorId,
        completed: false
      },
      timeline: [{
        timestamp: new Date(),
        type: 'created',
        description: 'Crisis assessment initiated',
        actor: params.assessorId
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.assessments.set(assessment.id, assessment);
    client.assessments.push(assessment.id);

    return assessment;
  }

  private recommendDisposition(riskAssessment: RiskAssessmentResult): CrisisDisposition['level'] {
    switch (riskAssessment.overallRiskLevel) {
      case 'imminent':
        return 'inpatient';
      case 'high':
        return 'crisis_stabilization';
      case 'moderate':
        return 'intensive_outpatient';
      default:
        return 'outpatient';
    }
  }

  private recommendFollowUpTiming(riskLevel: RiskLevel): FollowUp['timing'] {
    switch (riskLevel) {
      case 'imminent':
      case 'high':
        return 'within_24_hours';
      case 'moderate':
        return 'within_48_hours';
      default:
        return 'within_week';
    }
  }

  async getAssessment(assessmentId: string): Promise<CrisisAssessment | null> {
    return this.assessments.get(assessmentId) || null;
  }

  async recordIntervention(assessmentId: string, intervention: Omit<CrisisIntervention, 'id' | 'startedAt'>): Promise<CrisisAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    const newIntervention: CrisisIntervention = {
      ...intervention,
      id: `int-${Date.now()}`,
      startedAt: new Date()
    };

    assessment.interventions.push(newIntervention);
    assessment.timeline.push({
      timestamp: new Date(),
      type: 'intervention',
      description: `${intervention.type}: ${intervention.description}`,
      actor: intervention.providerName
    });
    assessment.updatedAt = new Date();

    return assessment;
  }

  async updateDisposition(assessmentId: string, disposition: Partial<CrisisDisposition>): Promise<CrisisAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    Object.assign(assessment.disposition, disposition);
    assessment.timeline.push({
      timestamp: new Date(),
      type: 'disposition',
      description: `Disposition updated to ${disposition.level || assessment.disposition.level}`,
      actor: 'System'
    });
    assessment.updatedAt = new Date();

    return assessment;
  }

  // ==================== Safety Planning ====================

  async createSafetyPlan(clientId: string, plan: Omit<SafetyPlan, 'id' | 'createdAt' | 'reviewDate'>): Promise<SafetyPlan> {
    const client = this.clients.get(clientId);
    if (!client) throw new Error(`Client not found: ${clientId}`);

    const safetyPlan: SafetyPlan = {
      ...plan,
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };

    client.safetyPlans.push(safetyPlan.id);
    client.updatedAt = new Date();

    return safetyPlan;
  }

  generateSafetyPlanTemplate(): Omit<SafetyPlan, 'id' | 'createdAt' | 'reviewDate'> {
    return {
      warningSignals: [],
      copingStrategies: {
        internal: ['Deep breathing', 'Progressive muscle relaxation', 'Mindfulness meditation'],
        external: ['Take a walk', 'Listen to music', 'Watch a favorite show']
      },
      reasonsToLive: [],
      socialSupports: [],
      professionalContacts: [
        {
          name: 'National Suicide Prevention Lifeline',
          relationship: 'Crisis Line',
          phone: '988',
          available: '24/7',
          canDiscussCrisis: true
        },
        {
          name: 'Crisis Text Line',
          relationship: 'Text Support',
          phone: 'Text HOME to 741741',
          available: '24/7',
          canDiscussCrisis: true
        }
      ],
      emergencyContacts: [
        {
          name: 'Emergency Services',
          relationship: 'Emergency',
          phone: '911',
          available: '24/7',
          canDiscussCrisis: true
        }
      ],
      environmentSafety: {
        meansRestriction: [],
        safeEnvironment: []
      },
      crisisResources: [
        'Go to nearest emergency room',
        'Call 911',
        'Call 988 Suicide & Crisis Lifeline'
      ]
    };
  }

  // ==================== Referral Management ====================

  async createReferral(assessmentId: string, referral: Omit<Referral, 'id' | 'status'>): Promise<Referral> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    const newReferral: Referral = {
      ...referral,
      id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending'
    };

    assessment.referrals.push(newReferral);
    assessment.updatedAt = new Date();

    return newReferral;
  }

  async updateReferralStatus(assessmentId: string, referralId: string, status: Referral['status'], appointmentDate?: Date): Promise<Referral> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    const referral = assessment.referrals.find(r => r.id === referralId);
    if (!referral) throw new Error(`Referral not found: ${referralId}`);

    referral.status = status;
    if (appointmentDate) {
      referral.appointmentDate = appointmentDate;
    }

    return referral;
  }

  // ==================== Provider Management ====================

  async registerProvider(provider: Omit<CrisisProvider, 'id' | 'currentCaseload' | 'ratings'>): Promise<CrisisProvider> {
    const newProvider: CrisisProvider = {
      ...provider,
      id: `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      currentCaseload: 0,
      ratings: { average: 0, count: 0 }
    };

    this.providers.set(newProvider.id, newProvider);
    return newProvider;
  }

  async getProvider(providerId: string): Promise<CrisisProvider | null> {
    return this.providers.get(providerId) || null;
  }

  async findAvailableProviders(params: {
    crisisType?: CrisisType;
    language?: string;
    providerType?: ProviderType;
  }): Promise<CrisisProvider[]> {
    let providers = Array.from(this.providers.values())
      .filter(p => p.status !== 'offline' && p.currentCaseload < p.maxCaseload);

    if (params.crisisType) {
      providers = providers.filter(p => p.specializations.includes(params.crisisType!));
    }

    if (params.language) {
      providers = providers.filter(p => p.languages.includes(params.language!));
    }

    if (params.providerType) {
      providers = providers.filter(p => p.type === params.providerType);
    }

    return providers.sort((a, b) => {
      // Prioritize by availability and rating
      if (a.status === 'available' && b.status !== 'available') return -1;
      if (b.status === 'available' && a.status !== 'available') return 1;
      return b.ratings.average - a.ratings.average;
    });
  }

  async updateProviderStatus(providerId: string, status: ServiceStatus): Promise<CrisisProvider> {
    const provider = this.providers.get(providerId);
    if (!provider) throw new Error(`Provider not found: ${providerId}`);

    provider.status = status;
    return provider;
  }

  // ==================== Resource Management ====================

  async registerResource(resource: Omit<CrisisResource, 'id' | 'lastUpdated'>): Promise<CrisisResource> {
    const newResource: CrisisResource = {
      ...resource,
      id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date()
    };

    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  async getResource(resourceId: string): Promise<CrisisResource | null> {
    return this.resources.get(resourceId) || null;
  }

  async findResources(params: {
    type?: CrisisResource['type'];
    population?: string;
    language?: string;
    availableOnly?: boolean;
    location?: { lat: number; lon: number; radiusMiles: number };
  }): Promise<CrisisResource[]> {
    let resources = Array.from(this.resources.values());

    if (params.type) {
      resources = resources.filter(r => r.type === params.type);
    }

    if (params.population) {
      resources = resources.filter(r => r.populations.includes(params.population!));
    }

    if (params.language) {
      resources = resources.filter(r => r.languages.includes(params.language!));
    }

    if (params.availableOnly) {
      resources = resources.filter(r => r.status === 'open' || r.status === 'limited');
    }

    if (params.location && params.location.lat && params.location.lon) {
      resources = resources.filter(r => {
        if (!r.location) return true; // Include hotlines without location
        const distance = this.calculateDistance(
          params.location!.lat, params.location!.lon,
          r.location.lat, r.location.lon
        );
        return distance <= params.location!.radiusMiles;
      });
    }

    return resources;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async updateResourceCapacity(resourceId: string, capacity: CrisisResource['currentCapacity']): Promise<CrisisResource> {
    const resource = this.resources.get(resourceId);
    if (!resource) throw new Error(`Resource not found: ${resourceId}`);

    resource.currentCapacity = capacity;
    resource.lastUpdated = new Date();

    // Auto-update status based on capacity
    if (capacity) {
      if (capacity.available === 0) {
        resource.status = 'full';
      } else if (capacity.available < capacity.total * 0.2) {
        resource.status = 'limited';
      } else {
        resource.status = 'open';
      }
    }

    return resource;
  }

  // ==================== Mobile Crisis Teams ====================

  async registerMobileTeam(team: Omit<MobileCrisisTeam, 'id' | 'status' | 'completedToday' | 'averageResponseTime'>): Promise<MobileCrisisTeam> {
    const newTeam: MobileCrisisTeam = {
      ...team,
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'available',
      completedToday: 0,
      averageResponseTime: 0
    };

    this.mobileTeams.set(newTeam.id, newTeam);
    return newTeam;
  }

  async dispatchMobileTeam(teamId: string, assessmentId: string, eta?: number): Promise<MobileCrisisTeam> {
    const team = this.mobileTeams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    if (team.status !== 'available') {
      throw new Error(`Team is not available: ${team.status}`);
    }

    team.status = 'dispatched';
    team.currentDispatch = {
      assessmentId,
      dispatchedAt: new Date(),
      eta
    };

    return team;
  }

  async updateTeamStatus(teamId: string, status: MobileCrisisTeam['status']): Promise<MobileCrisisTeam> {
    const team = this.mobileTeams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    team.status = status;

    if (status === 'available' && team.currentDispatch) {
      team.completedToday++;
      team.currentDispatch = undefined;
    }

    return team;
  }

  async findAvailableMobileTeam(location?: { lat: number; lon: number }): Promise<MobileCrisisTeam | null> {
    const availableTeams = Array.from(this.mobileTeams.values())
      .filter(t => t.status === 'available');

    if (availableTeams.length === 0) return null;

    if (location) {
      // Sort by distance if location provided
      availableTeams.sort((a, b) => {
        if (!a.vehicle?.location || !b.vehicle?.location) return 0;
        const distA = this.calculateDistance(location.lat, location.lon, a.vehicle.location.lat, a.vehicle.location.lon);
        const distB = this.calculateDistance(location.lat, location.lon, b.vehicle.location.lat, b.vehicle.location.lon);
        return distA - distB;
      });
    }

    return availableTeams[0];
  }

  // ==================== Disaster Response ====================

  async activateDisasterResponse(params: {
    incidentId: string;
    incidentName: string;
    scope: DisasterMentalHealthResponse['scope'];
  }): Promise<DisasterMentalHealthResponse> {
    const response: DisasterMentalHealthResponse = {
      id: `dmh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      incidentName: params.incidentName,
      activatedAt: new Date(),
      scope: params.scope,
      teams: [],
      shelterSupport: {
        shelters: [],
        staffAssigned: 0,
        individualsServed: 0
      },
      psychologicalFirstAid: {
        trained: 0,
        deployed: 0,
        contactsMade: 0
      },
      briefings: 0,
      criticalIncidentStressManagement: {
        defusings: 0,
        debriefings: 0,
        individualsReached: 0
      },
      status: 'activated'
    };

    this.disasterResponses.set(response.id, response);
    return response;
  }

  async updateDisasterResponse(responseId: string, updates: Partial<DisasterMentalHealthResponse>): Promise<DisasterMentalHealthResponse> {
    const response = this.disasterResponses.get(responseId);
    if (!response) throw new Error(`Response not found: ${responseId}`);

    Object.assign(response, updates);
    return response;
  }

  async getDisasterResponse(responseId: string): Promise<DisasterMentalHealthResponse | null> {
    return this.disasterResponses.get(responseId) || null;
  }

  async getActiveDisasterResponses(): Promise<DisasterMentalHealthResponse[]> {
    return Array.from(this.disasterResponses.values())
      .filter(r => r.status !== 'deactivated');
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    activeClients: number;
    assessmentsToday: number;
    highRiskCases: number;
    availableProviders: number;
    openResources: number;
    availableTeams: number;
    pendingFollowUps: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const assessments = Array.from(this.assessments.values());
    const todayAssessments = assessments.filter(a => a.createdAt >= today);

    return {
      activeClients: Array.from(this.clients.values())
        .filter(c => c.status === 'active_crisis' || c.status === 'stabilizing').length,
      assessmentsToday: todayAssessments.length,
      highRiskCases: assessments.filter(a => 
        a.riskAssessment.overallRiskLevel === 'high' || 
        a.riskAssessment.overallRiskLevel === 'imminent'
      ).length,
      availableProviders: Array.from(this.providers.values())
        .filter(p => p.status === 'available').length,
      openResources: Array.from(this.resources.values())
        .filter(r => r.status === 'open' || r.status === 'limited').length,
      availableTeams: Array.from(this.mobileTeams.values())
        .filter(t => t.status === 'available').length,
      pendingFollowUps: assessments.filter(a => 
        a.followUp.required && !a.followUp.completed
      ).length
    };
  }

  async getCrisisTypeBreakdown(): Promise<Record<CrisisType, number>> {
    const breakdown: Record<CrisisType, number> = {
      suicidal_ideation: 0,
      self_harm: 0,
      psychotic_episode: 0,
      panic_attack: 0,
      severe_anxiety: 0,
      depression: 0,
      substance_crisis: 0,
      trauma_response: 0,
      grief: 0,
      domestic_violence: 0,
      child_abuse: 0,
      elder_abuse: 0,
      eating_disorder: 0,
      other: 0
    };

    for (const assessment of this.assessments.values()) {
      breakdown[assessment.crisisType]++;
    }

    return breakdown;
  }
}

export const mentalHealthCrisisService = MentalHealthCrisisService.getInstance();
export default MentalHealthCrisisService;

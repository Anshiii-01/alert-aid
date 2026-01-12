/**
 * Interagency Coordination Service - Issue #160 Implementation
 * 
 * Provides comprehensive interagency coordination for disaster response
 * including multi-agency operations, resource sharing, joint planning,
 * communication protocols, and unified command management.
 */

// Type definitions
type AgencyType = 'federal' | 'state' | 'local' | 'tribal' | 'military' | 'ngo' | 'private' | 'international';
type CoordinationLevel = 'strategic' | 'operational' | 'tactical';
type AgreementType = 'mou' | 'moa' | 'mutual_aid' | 'contract' | 'compact' | 'task_order';
type AgreementStatus = 'draft' | 'pending_approval' | 'active' | 'expired' | 'terminated' | 'suspended';
type OperationStatus = 'planning' | 'mobilizing' | 'active' | 'demobilizing' | 'completed' | 'suspended';

// Agency interfaces
interface PartnerAgency {
  id: string;
  name: string;
  abbreviation: string;
  type: AgencyType;
  description: string;
  jurisdiction: string;
  capabilities: AgencyCapability[];
  resources: AgencyResource[];
  contacts: AgencyContact[];
  agreements: string[];
  liaison?: LiaisonOfficer;
  operationalStatus: 'available' | 'limited' | 'engaged' | 'unavailable';
  activationThreshold?: string;
  responseTime?: string;
  communicationInfo: CommunicationInfo;
  address: AgencyAddress;
  createdAt: Date;
  updatedAt: Date;
}

interface AgencyCapability {
  id: string;
  name: string;
  category: string;
  description: string;
  capacity: number;
  unit: string;
  availability: 'immediate' | '2_hours' | '4_hours' | '12_hours' | '24_hours' | 'varies';
  qualifications?: string[];
  limitations?: string[];
  costRecovery?: boolean;
  mutualAidEligible: boolean;
}

interface AgencyResource {
  id: string;
  name: string;
  type: string;
  category: string;
  quantity: number;
  status: 'available' | 'deployed' | 'maintenance' | 'reserved';
  location?: string;
  specifications?: Record<string, string>;
  deployable: boolean;
  deploymentTime?: string;
}

interface AgencyContact {
  id: string;
  name: string;
  title: string;
  role: 'executive' | 'operations' | 'liaison' | 'technical' | 'logistics' | 'finance' | 'emergency';
  phone: string;
  alternatePhone?: string;
  email: string;
  availability: '24_7' | 'business_hours' | 'on_call';
  isPrimary: boolean;
}

interface LiaisonOfficer {
  name: string;
  title: string;
  phone: string;
  email: string;
  assignedTo?: string;
  startDate?: Date;
  endDate?: Date;
}

interface CommunicationInfo {
  primaryChannel: string;
  backupChannel?: string;
  radioFrequencies?: { frequency: string; purpose: string }[];
  sharedSystems: string[];
  protocols: string[];
}

interface AgencyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: { lat: number; lon: number };
}

// Agreement interfaces
interface InteragencyAgreement {
  id: string;
  agreementNumber: string;
  title: string;
  type: AgreementType;
  status: AgreementStatus;
  parties: AgreementParty[];
  purpose: string;
  scope: AgreementScope;
  terms: AgreementTerms;
  resources: AgreementResource[];
  financialTerms: FinancialTerms;
  governance: AgreementGovernance;
  effectiveDate: Date;
  expirationDate?: Date;
  autoRenew: boolean;
  amendments: AgreementAmendment[];
  activations: AgreementActivation[];
  documents: AgreementDocument[];
  createdAt: Date;
  updatedAt: Date;
}

interface AgreementParty {
  agencyId: string;
  agencyName: string;
  role: 'lead' | 'supporting' | 'participating';
  authorizedRepresentative: string;
  title: string;
  signatureDate?: Date;
  responsibilities: string[];
}

interface AgreementScope {
  geographicArea: string[];
  incidentTypes: string[];
  services: string[];
  limitations: string[];
  exclusions: string[];
}

interface AgreementTerms {
  activationProcedure: string;
  requestProcess: string;
  responseTimeframe: string;
  terminationNotice: string;
  disputeResolution: string;
  liabilityProvisions: string;
  insuranceRequirements?: string;
  confidentiality?: string;
  specialConditions?: string[];
}

interface AgreementResource {
  type: string;
  description: string;
  providingAgency: string;
  quantity?: number;
  availability: string;
  restrictions?: string;
}

interface FinancialTerms {
  costSharing: 'requesting_pays' | 'providing_pays' | 'shared' | 'federal_reimbursement' | 'no_cost';
  rateSchedule?: { item: string; rate: number; unit: string }[];
  reimbursementProcess?: string;
  invoicingRequirements?: string;
  paymentTerms?: string;
  maximumAmount?: number;
}

interface AgreementGovernance {
  managingAgency: string;
  coordinationBody?: string;
  reviewFrequency: string;
  amendmentProcess: string;
  contacts: { role: string; name: string; email: string; phone: string }[];
}

interface AgreementAmendment {
  id: string;
  amendmentNumber: number;
  date: Date;
  description: string;
  changedSections: string[];
  approvedBy: string[];
}

interface AgreementActivation {
  id: string;
  incidentId?: string;
  incidentName?: string;
  activatedBy: string;
  activationDate: Date;
  deactivationDate?: Date;
  resourcesProvided: { type: string; quantity: number; duration: string }[];
  totalCost?: number;
  performanceNotes?: string;
  lessonsLearned?: string[];
}

interface AgreementDocument {
  id: string;
  type: 'agreement' | 'amendment' | 'attachment' | 'correspondence';
  title: string;
  url: string;
  uploadedDate: Date;
}

// Joint operation interfaces
interface JointOperation {
  id: string;
  name: string;
  incidentId?: string;
  incidentName?: string;
  type: string;
  coordinationLevel: CoordinationLevel;
  status: OperationStatus;
  commandStructure: CommandStructure;
  participatingAgencies: OperatingAgency[];
  objectives: OperationalObjective[];
  actionPlan: ActionPlan;
  resources: OperationalResource[];
  communications: OperationalCommunications;
  logistics: OperationalLogistics;
  timeline: OperationalTimeline;
  meetings: CoordinationMeeting[];
  reports: OperationalReport[];
  issues: OperationalIssue[];
  createdAt: Date;
  updatedAt: Date;
}

interface CommandStructure {
  type: 'unified_command' | 'single_command' | 'area_command' | 'multiagency_coordination';
  incidentCommander?: string;
  unifiedCommanders?: { agencyId: string; agencyName: string; name: string }[];
  generalStaff: {
    operations?: StaffPosition;
    planning?: StaffPosition;
    logistics?: StaffPosition;
    finance?: StaffPosition;
  };
  liaisons: { agencyId: string; agencyName: string; name: string; phone: string }[];
}

interface StaffPosition {
  name: string;
  agency: string;
  phone: string;
  email: string;
  deputies?: { name: string; agency: string }[];
}

interface OperatingAgency {
  agencyId: string;
  agencyName: string;
  role: 'lead' | 'support' | 'coordinating' | 'assisting';
  personnelAssigned: number;
  resourcesProvided: string[];
  responsibilities: string[];
  liaison: string;
  liaisonPhone: string;
  status: 'active' | 'standby' | 'demobilizing' | 'released';
}

interface OperationalObjective {
  id: string;
  priority: number;
  description: string;
  assignedTo: string[];
  targetDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'deferred';
  progress?: number;
  metrics?: { name: string; target: number; actual: number }[];
}

interface ActionPlan {
  operationalPeriod: { start: Date; end: Date };
  situationSummary: string;
  executionPlan: string;
  assignmentList: Assignment[];
  safetyPlan: string;
  weatherForecast?: string;
  approvedBy: string;
  approvalDate: Date;
}

interface Assignment {
  id: string;
  division?: string;
  group?: string;
  branch?: string;
  description: string;
  assignedResources: string[];
  specialInstructions?: string;
  startTime: Date;
  endTime?: Date;
}

interface OperationalResource {
  id: string;
  type: string;
  name: string;
  providingAgency: string;
  quantity: number;
  status: 'ordered' | 'en_route' | 'on_scene' | 'assigned' | 'available' | 'released';
  location?: string;
  assignment?: string;
  eta?: Date;
  demobilizationDate?: Date;
}

interface OperationalCommunications {
  primaryFrequency: string;
  tacticalFrequencies: { name: string; frequency: string; purpose: string }[];
  commandChannel: string;
  interoperabilityPlan: string;
  communicationsUnit?: string;
  contacts: { role: string; callSign: string; phone: string }[];
}

interface OperationalLogistics {
  baseCamp?: { name: string; location: string; coordinates?: { lat: number; lon: number } };
  stagingAreas: { name: string; location: string; purpose: string }[];
  supplyPoints: { name: string; location: string; resources: string[] }[];
  medicalFacility?: string;
  transportationPlan?: string;
  feedingPlan?: string;
}

interface OperationalTimeline {
  phases: { name: string; startDate: Date; endDate?: Date; status: string }[];
  milestones: { name: string; date: Date; achieved: boolean }[];
  operationalPeriods: { number: number; start: Date; end: Date }[];
}

interface CoordinationMeeting {
  id: string;
  type: 'command' | 'planning' | 'operations' | 'briefing' | 'coordination';
  scheduledTime: Date;
  location: string;
  attendees: { name: string; agency: string; role: string }[];
  agenda: string[];
  decisions: string[];
  actionItems: { item: string; assignedTo: string; dueDate: Date }[];
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface OperationalReport {
  id: string;
  type: 'sitrep' | 'spot' | 'final' | 'progress' | 'resource_status';
  title: string;
  period?: { start: Date; end: Date };
  submittedBy: string;
  submittedAt: Date;
  content: string;
  attachments?: string[];
}

interface OperationalIssue {
  id: string;
  category: 'resource' | 'communication' | 'coordination' | 'safety' | 'logistics' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  resolution?: string;
  resolvedAt?: Date;
}

// Resource sharing interfaces
interface ResourceSharingRequest {
  id: string;
  requestingAgencyId: string;
  requestingAgencyName: string;
  incidentId?: string;
  incidentName?: string;
  operationId?: string;
  resourceType: string;
  quantity: number;
  specifications?: Record<string, string>;
  justification: string;
  priority: 'routine' | 'urgent' | 'immediate' | 'life_safety';
  neededBy: Date;
  duration: string;
  deliveryLocation: string;
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'denied' | 'fulfilled' | 'cancelled';
  responses: ResourceResponse[];
  selectedProvider?: string;
  fulfillmentDetails?: FulfillmentDetails;
  createdAt: Date;
  updatedAt: Date;
}

interface ResourceResponse {
  agencyId: string;
  agencyName: string;
  canFulfill: boolean;
  quantity?: number;
  availability?: string;
  estimatedArrival?: Date;
  cost?: number;
  conditions?: string[];
  respondedAt: Date;
}

interface FulfillmentDetails {
  providingAgencyId: string;
  providingAgencyName: string;
  quantity: number;
  departureDate?: Date;
  arrivalDate?: Date;
  trackingInfo?: string;
  receivedBy?: string;
  receivedDate?: Date;
  returnDate?: Date;
  actualCost?: number;
  performanceRating?: number;
  feedback?: string;
}

// Sample data
const sampleAgencies: PartnerAgency[] = [
  {
    id: 'agency-001',
    name: 'Federal Emergency Management Agency',
    abbreviation: 'FEMA',
    type: 'federal',
    description: 'Federal agency responsible for coordinating the response to disasters.',
    jurisdiction: 'National',
    capabilities: [
      {
        id: 'cap-001',
        name: 'Disaster Response Teams',
        category: 'Personnel',
        description: 'Trained disaster response specialists',
        capacity: 1000,
        unit: 'personnel',
        availability: '24_hours',
        mutualAidEligible: true
      }
    ],
    resources: [
      {
        id: 'res-001',
        name: 'Mobile Emergency Response Support',
        type: 'Equipment',
        category: 'Communications',
        quantity: 10,
        status: 'available',
        deployable: true,
        deploymentTime: '24 hours'
      }
    ],
    contacts: [
      {
        id: 'contact-001',
        name: 'Regional Administrator',
        title: 'Regional Administrator',
        role: 'executive',
        phone: '555-0100',
        email: 'regional@fema.gov',
        availability: '24_7',
        isPrimary: true
      }
    ],
    agreements: [],
    operationalStatus: 'available',
    activationThreshold: 'Presidential Disaster Declaration',
    responseTime: '24-48 hours',
    communicationInfo: {
      primaryChannel: 'FEMA Operations Center',
      sharedSystems: ['WebEOC', 'NIMS', 'EMNet'],
      protocols: ['NIMS', 'ICS']
    },
    address: {
      street: '500 C Street SW',
      city: 'Washington',
      state: 'DC',
      zipCode: '20472'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleAgreements: InteragencyAgreement[] = [
  {
    id: 'agreement-001',
    agreementNumber: 'MA-2024-001',
    title: 'Statewide Mutual Aid Agreement',
    type: 'mutual_aid',
    status: 'active',
    parties: [
      {
        agencyId: 'state-ema',
        agencyName: 'State Emergency Management Agency',
        role: 'lead',
        authorizedRepresentative: 'Director John Smith',
        title: 'Director',
        signatureDate: new Date('2024-01-01'),
        responsibilities: ['Coordination', 'Resource tracking', 'Reimbursement processing']
      }
    ],
    purpose: 'Establish framework for mutual aid assistance among participating jurisdictions during emergencies.',
    scope: {
      geographicArea: ['Statewide'],
      incidentTypes: ['All hazards'],
      services: ['Personnel', 'Equipment', 'Facilities', 'Technical assistance'],
      limitations: ['Subject to resource availability'],
      exclusions: ['Law enforcement arrest powers']
    },
    terms: {
      activationProcedure: 'Written or verbal request to State EOC',
      requestProcess: 'Through WebEOC resource request system',
      responseTimeframe: '4 hours acknowledgment, resources within 24 hours',
      terminationNotice: '30 days written notice',
      disputeResolution: 'Mediation through State Attorney General',
      liabilityProvisions: 'Each party responsible for own personnel'
    },
    resources: [
      {
        type: 'Personnel',
        description: 'Emergency response personnel',
        providingAgency: 'Participating jurisdictions',
        availability: 'As available'
      }
    ],
    financialTerms: {
      costSharing: 'requesting_pays',
      reimbursementProcess: 'Submit within 60 days of demobilization',
      paymentTerms: 'Net 30 days'
    },
    governance: {
      managingAgency: 'State Emergency Management Agency',
      reviewFrequency: 'Annual',
      amendmentProcess: 'Written consent of all parties',
      contacts: [
        { role: 'Agreement Manager', name: 'Jane Doe', email: 'jdoe@state.gov', phone: '555-0200' }
      ]
    },
    effectiveDate: new Date('2024-01-01'),
    expirationDate: new Date('2029-01-01'),
    autoRenew: true,
    amendments: [],
    activations: [],
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class InteragencyCoordinationService {
  private static instance: InteragencyCoordinationService;
  private agencies: Map<string, PartnerAgency> = new Map();
  private agreements: Map<string, InteragencyAgreement> = new Map();
  private operations: Map<string, JointOperation> = new Map();
  private resourceRequests: Map<string, ResourceSharingRequest> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): InteragencyCoordinationService {
    if (!InteragencyCoordinationService.instance) {
      InteragencyCoordinationService.instance = new InteragencyCoordinationService();
    }
    return InteragencyCoordinationService.instance;
  }

  private initializeSampleData(): void {
    sampleAgencies.forEach(a => this.agencies.set(a.id, a));
    sampleAgreements.forEach(a => this.agreements.set(a.id, a));
  }

  // ==================== Agency Management ====================

  async registerAgency(params: Omit<PartnerAgency, 'id' | 'createdAt' | 'updatedAt'>): Promise<PartnerAgency> {
    const agency: PartnerAgency = {
      ...params,
      id: `agency-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.agencies.set(agency.id, agency);
    return agency;
  }

  async getAgency(agencyId: string): Promise<PartnerAgency | null> {
    return this.agencies.get(agencyId) || null;
  }

  async getAgencies(params?: {
    type?: AgencyType;
    operationalStatus?: PartnerAgency['operationalStatus'];
    capability?: string;
    search?: string;
  }): Promise<PartnerAgency[]> {
    let agencies = Array.from(this.agencies.values());

    if (params?.type) {
      agencies = agencies.filter(a => a.type === params.type);
    }

    if (params?.operationalStatus) {
      agencies = agencies.filter(a => a.operationalStatus === params.operationalStatus);
    }

    if (params?.capability) {
      agencies = agencies.filter(a =>
        a.capabilities.some(c => c.name.toLowerCase().includes(params.capability!.toLowerCase()))
      );
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      agencies = agencies.filter(a =>
        a.name.toLowerCase().includes(searchLower) ||
        a.abbreviation.toLowerCase().includes(searchLower)
      );
    }

    return agencies.sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateAgency(agencyId: string, update: Partial<PartnerAgency>): Promise<PartnerAgency> {
    const agency = this.agencies.get(agencyId);
    if (!agency) throw new Error(`Agency not found: ${agencyId}`);

    Object.assign(agency, update, { updatedAt: new Date() });
    return agency;
  }

  async updateOperationalStatus(agencyId: string, status: PartnerAgency['operationalStatus']): Promise<PartnerAgency> {
    return this.updateAgency(agencyId, { operationalStatus: status });
  }

  async assignLiaison(agencyId: string, liaison: LiaisonOfficer): Promise<PartnerAgency> {
    return this.updateAgency(agencyId, { liaison });
  }

  // ==================== Agreement Management ====================

  async createAgreement(params: Omit<InteragencyAgreement, 'id' | 'amendments' | 'activations' | 'documents' | 'createdAt' | 'updatedAt'>): Promise<InteragencyAgreement> {
    const agreement: InteragencyAgreement = {
      ...params,
      id: `agreement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amendments: [],
      activations: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.agreements.set(agreement.id, agreement);

    // Update participating agencies
    for (const party of params.parties) {
      const agency = this.agencies.get(party.agencyId);
      if (agency) {
        agency.agreements.push(agreement.id);
        agency.updatedAt = new Date();
      }
    }

    return agreement;
  }

  async getAgreement(agreementId: string): Promise<InteragencyAgreement | null> {
    return this.agreements.get(agreementId) || null;
  }

  async getAgreements(params?: {
    type?: AgreementType;
    status?: AgreementStatus;
    agencyId?: string;
    expiringSoon?: boolean;
  }): Promise<InteragencyAgreement[]> {
    let agreements = Array.from(this.agreements.values());

    if (params?.type) {
      agreements = agreements.filter(a => a.type === params.type);
    }

    if (params?.status) {
      agreements = agreements.filter(a => a.status === params.status);
    }

    if (params?.agencyId) {
      agreements = agreements.filter(a =>
        a.parties.some(p => p.agencyId === params.agencyId)
      );
    }

    if (params?.expiringSoon) {
      const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      agreements = agreements.filter(a =>
        a.expirationDate && a.expirationDate <= ninetyDaysFromNow && a.status === 'active'
      );
    }

    return agreements;
  }

  async activateAgreement(agreementId: string, activation: Omit<AgreementActivation, 'id'>): Promise<InteragencyAgreement> {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) throw new Error(`Agreement not found: ${agreementId}`);

    agreement.activations.push({
      ...activation,
      id: `activation-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    agreement.updatedAt = new Date();
    return agreement;
  }

  async deactivateAgreementActivation(agreementId: string, activationId: string, notes: string): Promise<InteragencyAgreement> {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) throw new Error(`Agreement not found: ${agreementId}`);

    const activation = agreement.activations.find(a => a.id === activationId);
    if (!activation) throw new Error(`Activation not found: ${activationId}`);

    activation.deactivationDate = new Date();
    activation.performanceNotes = notes;

    agreement.updatedAt = new Date();
    return agreement;
  }

  async amendAgreement(agreementId: string, amendment: Omit<AgreementAmendment, 'id'>): Promise<InteragencyAgreement> {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) throw new Error(`Agreement not found: ${agreementId}`);

    agreement.amendments.push({
      ...amendment,
      id: `amend-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    agreement.updatedAt = new Date();
    return agreement;
  }

  // ==================== Joint Operations ====================

  async createOperation(params: Omit<JointOperation, 'id' | 'meetings' | 'reports' | 'issues' | 'createdAt' | 'updatedAt'>): Promise<JointOperation> {
    const operation: JointOperation = {
      ...params,
      id: `operation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      meetings: [],
      reports: [],
      issues: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.operations.set(operation.id, operation);
    return operation;
  }

  async getOperation(operationId: string): Promise<JointOperation | null> {
    return this.operations.get(operationId) || null;
  }

  async getOperations(params?: {
    status?: OperationStatus;
    coordinationLevel?: CoordinationLevel;
    agencyId?: string;
  }): Promise<JointOperation[]> {
    let operations = Array.from(this.operations.values());

    if (params?.status) {
      operations = operations.filter(o => o.status === params.status);
    }

    if (params?.coordinationLevel) {
      operations = operations.filter(o => o.coordinationLevel === params.coordinationLevel);
    }

    if (params?.agencyId) {
      operations = operations.filter(o =>
        o.participatingAgencies.some(a => a.agencyId === params.agencyId)
      );
    }

    return operations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateOperationStatus(operationId: string, status: OperationStatus): Promise<JointOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.status = status;
    operation.updatedAt = new Date();

    return operation;
  }

  async addAgencyToOperation(operationId: string, agency: OperatingAgency): Promise<JointOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.participatingAgencies.push(agency);
    operation.updatedAt = new Date();

    return operation;
  }

  async updateActionPlan(operationId: string, actionPlan: ActionPlan): Promise<JointOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.actionPlan = actionPlan;
    operation.updatedAt = new Date();

    return operation;
  }

  async scheduleMeeting(operationId: string, meeting: Omit<CoordinationMeeting, 'id' | 'decisions' | 'actionItems' | 'status'>): Promise<JointOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.meetings.push({
      ...meeting,
      id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      decisions: [],
      actionItems: [],
      status: 'scheduled'
    });

    operation.updatedAt = new Date();
    return operation;
  }

  async submitReport(operationId: string, report: Omit<OperationalReport, 'id' | 'submittedAt'>): Promise<JointOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.reports.push({
      ...report,
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      submittedAt: new Date()
    });

    operation.updatedAt = new Date();
    return operation;
  }

  async reportIssue(operationId: string, issue: Omit<OperationalIssue, 'id' | 'reportedAt' | 'status'>): Promise<JointOperation> {
    const operation = this.operations.get(operationId);
    if (!operation) throw new Error(`Operation not found: ${operationId}`);

    operation.issues.push({
      ...issue,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      reportedAt: new Date(),
      status: 'open'
    });

    operation.updatedAt = new Date();
    return operation;
  }

  // ==================== Resource Sharing ====================

  async createResourceRequest(params: Omit<ResourceSharingRequest, 'id' | 'status' | 'responses' | 'createdAt' | 'updatedAt'>): Promise<ResourceSharingRequest> {
    const request: ResourceSharingRequest = {
      ...params,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      responses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.resourceRequests.set(request.id, request);
    return request;
  }

  async getResourceRequest(requestId: string): Promise<ResourceSharingRequest | null> {
    return this.resourceRequests.get(requestId) || null;
  }

  async getResourceRequests(params?: {
    requestingAgencyId?: string;
    status?: ResourceSharingRequest['status'];
    priority?: ResourceSharingRequest['priority'];
  }): Promise<ResourceSharingRequest[]> {
    let requests = Array.from(this.resourceRequests.values());

    if (params?.requestingAgencyId) {
      requests = requests.filter(r => r.requestingAgencyId === params.requestingAgencyId);
    }

    if (params?.status) {
      requests = requests.filter(r => r.status === params.status);
    }

    if (params?.priority) {
      requests = requests.filter(r => r.priority === params.priority);
    }

    // Sort by priority
    const priorityOrder: Record<ResourceSharingRequest['priority'], number> = {
      life_safety: 0,
      immediate: 1,
      urgent: 2,
      routine: 3
    };

    return requests.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  async submitResourceRequest(requestId: string): Promise<ResourceSharingRequest> {
    const request = this.resourceRequests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    request.status = 'submitted';
    request.updatedAt = new Date();

    return request;
  }

  async respondToResourceRequest(requestId: string, response: ResourceResponse): Promise<ResourceSharingRequest> {
    const request = this.resourceRequests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    request.responses.push(response);
    request.status = 'reviewing';
    request.updatedAt = new Date();

    return request;
  }

  async selectResourceProvider(requestId: string, providerId: string): Promise<ResourceSharingRequest> {
    const request = this.resourceRequests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    const response = request.responses.find(r => r.agencyId === providerId);
    if (!response) throw new Error('Response from this agency not found');

    request.selectedProvider = providerId;
    request.status = 'approved';
    request.fulfillmentDetails = {
      providingAgencyId: response.agencyId,
      providingAgencyName: response.agencyName,
      quantity: response.quantity || 0
    };

    request.updatedAt = new Date();
    return request;
  }

  async fulfillResourceRequest(requestId: string, details: Partial<FulfillmentDetails>): Promise<ResourceSharingRequest> {
    const request = this.resourceRequests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    if (request.fulfillmentDetails) {
      Object.assign(request.fulfillmentDetails, details);
    }

    request.status = 'fulfilled';
    request.updatedAt = new Date();

    return request;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalAgencies: number;
    availableAgencies: number;
    byAgencyType: Record<AgencyType, number>;
    totalAgreements: number;
    activeAgreements: number;
    expiringAgreements: number;
    activeOperations: number;
    pendingResourceRequests: number;
    totalResourceRequests: number;
    agreementActivations: number;
    liaisonsAssigned: number;
  }> {
    const agencies = Array.from(this.agencies.values());
    const agreements = Array.from(this.agreements.values());
    const operations = Array.from(this.operations.values());
    const requests = Array.from(this.resourceRequests.values());

    const byAgencyType: Record<AgencyType, number> = {} as any;
    agencies.forEach(a => {
      byAgencyType[a.type] = (byAgencyType[a.type] || 0) + 1;
    });

    const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    let totalActivations = 0;
    agreements.forEach(a => {
      totalActivations += a.activations.length;
    });

    return {
      totalAgencies: agencies.length,
      availableAgencies: agencies.filter(a => a.operationalStatus === 'available').length,
      byAgencyType,
      totalAgreements: agreements.length,
      activeAgreements: agreements.filter(a => a.status === 'active').length,
      expiringAgreements: agreements.filter(a =>
        a.expirationDate && a.expirationDate <= ninetyDaysFromNow && a.status === 'active'
      ).length,
      activeOperations: operations.filter(o => o.status === 'active' || o.status === 'mobilizing').length,
      pendingResourceRequests: requests.filter(r =>
        r.status === 'submitted' || r.status === 'reviewing'
      ).length,
      totalResourceRequests: requests.length,
      agreementActivations: totalActivations,
      liaisonsAssigned: agencies.filter(a => a.liaison !== undefined).length
    };
  }
}

export const interagencyCoordinationService = InteragencyCoordinationService.getInstance();
export default InteragencyCoordinationService;

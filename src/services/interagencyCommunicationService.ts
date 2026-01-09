/**
 * Interagency Communication Service - Issue #126 Implementation
 * 
 * Provides cross-agency communication protocols for coordinating between
 * police, fire, medical, military, and other emergency response agencies.
 * Implements ICS (Incident Command System) communication standards.
 */

// Status and type definitions
type AgencyType = 'police' | 'fire' | 'ems' | 'hospital' | 'public_health' | 'emergency_management' | 'military' | 'national_guard' | 'coast_guard' | 'fema' | 'red_cross' | 'utilities' | 'transportation' | 'public_works' | 'other';
type ChannelStatus = 'active' | 'standby' | 'busy' | 'emergency' | 'offline';
type MessageClassification = 'unclassified' | 'for_official_use' | 'law_enforcement_sensitive' | 'confidential' | 'secret';
type ICSPosition = 'incident_commander' | 'operations_chief' | 'planning_chief' | 'logistics_chief' | 'finance_chief' | 'public_info_officer' | 'safety_officer' | 'liaison_officer' | 'branch_director' | 'division_supervisor' | 'group_supervisor' | 'unit_leader' | 'task_force_leader' | 'strike_team_leader' | 'single_resource';
type MessagePriority = 'flash' | 'immediate' | 'priority' | 'routine';
type IncidentType = 'fire' | 'hazmat' | 'mass_casualty' | 'search_rescue' | 'law_enforcement' | 'natural_disaster' | 'terrorism' | 'civil_unrest' | 'infrastructure' | 'public_health' | 'multi_agency';

// Agency interfaces
interface Agency {
  id: string;
  name: string;
  type: AgencyType;
  jurisdiction: {
    level: 'local' | 'county' | 'state' | 'federal' | 'tribal' | 'private';
    area: string;
    boundaries?: { lat: number; lon: number }[];
  };
  contacts: AgencyContact[];
  channels: CommunicationChannel[];
  capabilities: AgencyCapabilities;
  agreements: MutualAidAgreement[];
  status: 'operational' | 'limited' | 'offline';
  lastUpdate: Date;
}

interface AgencyContact {
  id: string;
  name: string;
  title: string;
  role: ICSPosition | 'dispatcher' | 'commander' | 'administrator' | 'liaison';
  phone: string[];
  email: string;
  radio?: string;
  availability: 'available' | 'on_duty' | 'off_duty' | 'unavailable';
  certifications: string[];
  lastActive: Date;
}

interface CommunicationChannel {
  id: string;
  name: string;
  type: 'radio' | 'phone' | 'data' | 'satellite' | 'mesh' | 'internet';
  frequency?: string;
  talkgroup?: string;
  encryption: boolean;
  interoperable: boolean;
  status: ChannelStatus;
  agencies: string[];
}

interface AgencyCapabilities {
  resources: ResourceType[];
  specialTeams: string[];
  equipment: string[];
  personnel: number;
  vehicles: number;
  coverage: number; // square miles
}

interface ResourceType {
  type: string;
  quantity: number;
  available: number;
  deployed: number;
}

interface MutualAidAgreement {
  id: string;
  partnerAgency: string;
  type: 'automatic' | 'requested' | 'statewide' | 'interstate' | 'federal';
  resources: string[];
  validFrom: Date;
  validTo: Date;
  terms: string;
}

// Incident interfaces
interface Incident {
  id: string;
  name: string;
  type: IncidentType;
  status: 'active' | 'contained' | 'resolved' | 'monitoring';
  location: {
    lat: number;
    lon: number;
    address: string;
    area: string;
  };
  severity: 'catastrophic' | 'major' | 'moderate' | 'minor';
  icsStructure: ICSOrganization;
  agencies: IncidentAgency[];
  resources: IncidentResource[];
  communications: IncidentCommunications;
  timeline: IncidentEvent[];
  objectives: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ICSOrganization {
  incidentCommander: ICSAssignment;
  unifiedCommand?: ICSAssignment[];
  generalStaff: {
    operations?: ICSAssignment;
    planning?: ICSAssignment;
    logistics?: ICSAssignment;
    finance?: ICSAssignment;
  };
  commandStaff: {
    publicInfo?: ICSAssignment;
    safety?: ICSAssignment;
    liaison?: ICSAssignment;
  };
  branches: ICSBranch[];
}

interface ICSAssignment {
  position: ICSPosition;
  assignee: {
    name: string;
    agencyId: string;
    contactId: string;
    radio: string;
    phone: string;
  };
  assignedAt: Date;
  relievedAt?: Date;
}

interface ICSBranch {
  id: string;
  name: string;
  director: ICSAssignment;
  divisions: ICSDivision[];
}

interface ICSDivision {
  id: string;
  name: string;
  supervisor: ICSAssignment;
  resources: string[];
  area?: string;
}

interface IncidentAgency {
  agencyId: string;
  role: 'lead' | 'support' | 'mutual_aid' | 'observer';
  personnelDeployed: number;
  resourcesDeployed: string[];
  liaisons: string[];
  assignedAt: Date;
}

interface IncidentResource {
  id: string;
  type: string;
  name: string;
  agencyId: string;
  status: 'available' | 'assigned' | 'out_of_service';
  location?: { lat: number; lon: number };
  assignment?: string;
  checkInTime: Date;
}

interface IncidentCommunications {
  commandChannel: CommunicationChannel;
  tacticalChannels: CommunicationChannel[];
  interopChannels: CommunicationChannel[];
  plan: CommunicationsPlan;
}

interface CommunicationsPlan {
  id: string;
  channels: ChannelAssignment[];
  frequencies: FrequencyAssignment[];
  callSigns: CallSignAssignment[];
  procedures: string;
}

interface ChannelAssignment {
  channel: string;
  function: string;
  assignment: string;
  rxFrequency?: string;
  txFrequency?: string;
  tone?: string;
  remarks?: string;
}

interface FrequencyAssignment {
  frequency: string;
  channel: string;
  function: string;
  agency: string;
}

interface CallSignAssignment {
  callSign: string;
  assignment: string;
  name?: string;
}

interface IncidentEvent {
  id: string;
  timestamp: Date;
  type: 'created' | 'updated' | 'resource_assigned' | 'resource_released' | 'message' | 'status_change' | 'escalation';
  description: string;
  actor: string;
  details?: Record<string, any>;
}

// Message interfaces
interface InteragencyMessage {
  id: string;
  incidentId?: string;
  type: 'request' | 'notification' | 'update' | 'resource_request' | 'situation_report' | 'order' | 'acknowledgment';
  priority: MessagePriority;
  classification: MessageClassification;
  from: {
    agencyId: string;
    contactId: string;
    name: string;
    position?: ICSPosition;
  };
  to: {
    agencyIds: string[];
    positions?: ICSPosition[];
    broadcast: boolean;
  };
  subject: string;
  body: string;
  attachments?: MessageAttachment[];
  acknowledgments: MessageAcknowledgment[];
  routing: MessageRouting[];
  expiresAt?: Date;
  createdAt: Date;
}

interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  classification: MessageClassification;
}

interface MessageAcknowledgment {
  agencyId: string;
  contactId: string;
  timestamp: Date;
  response?: string;
}

interface MessageRouting {
  agencyId: string;
  receivedAt: Date;
  readAt?: Date;
  forwardedTo?: string[];
}

// Resource request interfaces
interface ResourceRequest {
  id: string;
  incidentId: string;
  requestingAgency: string;
  requestedResources: RequestedResource[];
  justification: string;
  priority: MessagePriority;
  neededBy: Date;
  status: 'pending' | 'approved' | 'partial' | 'denied' | 'fulfilled' | 'cancelled';
  responses: ResourceResponse[];
  createdAt: Date;
  updatedAt: Date;
}

interface RequestedResource {
  type: string;
  quantity: number;
  specifications?: string;
  duration?: string;
}

interface ResourceResponse {
  agencyId: string;
  resourcesOffered: { type: string; quantity: number }[];
  eta?: Date;
  conditions?: string;
  status: 'offered' | 'accepted' | 'declined' | 'enroute' | 'arrived';
  respondedAt: Date;
}

// Situation report interfaces
interface SituationReport {
  id: string;
  incidentId: string;
  reportNumber: number;
  period: { start: Date; end: Date };
  preparedBy: string;
  approvedBy?: string;
  summary: string;
  currentSituation: {
    weatherConditions?: string;
    currentActions: string;
    plannedActions: string;
    resources: { type: string; total: number; active: number }[];
    casualties?: { fatalities: number; injuries: number; missing: number };
    evacuees?: number;
    structuresAffected?: number;
  };
  agencyUpdates: {
    agencyId: string;
    agencyName: string;
    update: string;
    resources: string[];
  }[];
  mediaContacts?: number;
  publicInformation?: string;
  createdAt: Date;
}

// Subscription interface
interface CommunicationSubscription {
  id: string;
  callback: (event: CommunicationEvent) => void;
  eventTypes?: CommunicationEventType[];
}

type CommunicationEventType = 'message_received' | 'resource_request' | 'incident_update' | 'agency_status' | 'channel_status';

interface CommunicationEvent {
  type: CommunicationEventType;
  timestamp: Date;
  data: any;
}

// Sample data
const sampleAgencies: Agency[] = [
  {
    id: 'agency-pd-001',
    name: 'Metro Police Department',
    type: 'police',
    jurisdiction: {
      level: 'local',
      area: 'Metro City'
    },
    contacts: [
      {
        id: 'contact-001',
        name: 'Chief Robert Martinez',
        title: 'Chief of Police',
        role: 'commander',
        phone: ['+1-555-0101', '+1-555-0102'],
        email: 'rmartinez@metropd.gov',
        radio: 'Metro-1',
        availability: 'on_duty',
        certifications: ['ICS-100', 'ICS-200', 'ICS-300', 'ICS-400'],
        lastActive: new Date()
      }
    ],
    channels: [
      {
        id: 'ch-pd-001',
        name: 'PD Dispatch',
        type: 'radio',
        frequency: '460.125 MHz',
        encryption: true,
        interoperable: false,
        status: 'active',
        agencies: ['agency-pd-001']
      }
    ],
    capabilities: {
      resources: [
        { type: 'Patrol Officers', quantity: 500, available: 180, deployed: 320 },
        { type: 'Detectives', quantity: 100, available: 40, deployed: 60 },
        { type: 'SWAT', quantity: 30, available: 30, deployed: 0 }
      ],
      specialTeams: ['SWAT', 'K-9', 'Bomb Squad', 'Traffic', 'Marine Unit'],
      equipment: ['Patrol Vehicles', 'Armored Vehicles', 'Helicopters', 'Boats'],
      personnel: 650,
      vehicles: 400,
      coverage: 150
    },
    agreements: [],
    status: 'operational',
    lastUpdate: new Date()
  },
  {
    id: 'agency-fd-001',
    name: 'Metro Fire Department',
    type: 'fire',
    jurisdiction: {
      level: 'local',
      area: 'Metro City'
    },
    contacts: [
      {
        id: 'contact-002',
        name: 'Chief Lisa Chen',
        title: 'Fire Chief',
        role: 'commander',
        phone: ['+1-555-0201'],
        email: 'lchen@metrofd.gov',
        radio: 'Fire-1',
        availability: 'on_duty',
        certifications: ['ICS-100', 'ICS-200', 'ICS-300', 'ICS-400', 'HAZMAT IC'],
        lastActive: new Date()
      }
    ],
    channels: [
      {
        id: 'ch-fd-001',
        name: 'Fire Dispatch',
        type: 'radio',
        frequency: '154.280 MHz',
        encryption: false,
        interoperable: true,
        status: 'active',
        agencies: ['agency-fd-001']
      }
    ],
    capabilities: {
      resources: [
        { type: 'Firefighters', quantity: 400, available: 150, deployed: 250 },
        { type: 'Paramedics', quantity: 80, available: 30, deployed: 50 },
        { type: 'HAZMAT Technicians', quantity: 40, available: 35, deployed: 5 }
      ],
      specialTeams: ['HAZMAT', 'Technical Rescue', 'Wildland', 'Marine', 'Urban Search and Rescue'],
      equipment: ['Engines', 'Ladders', 'Rescue', 'HAZMAT Units', 'Boats'],
      personnel: 520,
      vehicles: 120,
      coverage: 150
    },
    agreements: [],
    status: 'operational',
    lastUpdate: new Date()
  }
];

const interoperableChannels: CommunicationChannel[] = [
  {
    id: 'ch-interop-001',
    name: 'ICALL',
    type: 'radio',
    frequency: '155.475 MHz',
    encryption: false,
    interoperable: true,
    status: 'standby',
    agencies: ['agency-pd-001', 'agency-fd-001', 'agency-ems-001']
  },
  {
    id: 'ch-interop-002',
    name: 'ITAC',
    type: 'radio',
    frequency: '156.0375 MHz',
    encryption: false,
    interoperable: true,
    status: 'standby',
    agencies: ['agency-pd-001', 'agency-fd-001', 'agency-ems-001']
  }
];

class InteragencyCommunicationService {
  private static instance: InteragencyCommunicationService;
  private agencies: Map<string, Agency> = new Map();
  private channels: Map<string, CommunicationChannel> = new Map();
  private incidents: Map<string, Incident> = new Map();
  private messages: Map<string, InteragencyMessage> = new Map();
  private resourceRequests: Map<string, ResourceRequest> = new Map();
  private situationReports: Map<string, SituationReport> = new Map();
  private subscriptions: Map<string, CommunicationSubscription> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): InteragencyCommunicationService {
    if (!InteragencyCommunicationService.instance) {
      InteragencyCommunicationService.instance = new InteragencyCommunicationService();
    }
    return InteragencyCommunicationService.instance;
  }

  private initializeSampleData(): void {
    sampleAgencies.forEach(a => this.agencies.set(a.id, a));
    interoperableChannels.forEach(c => this.channels.set(c.id, c));
  }

  // ==================== Agency Management ====================

  async registerAgency(agency: Omit<Agency, 'id' | 'lastUpdate'>): Promise<Agency> {
    const newAgency: Agency = {
      ...agency,
      id: `agency-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdate: new Date()
    };

    this.agencies.set(newAgency.id, newAgency);
    return newAgency;
  }

  async getAgency(agencyId: string): Promise<Agency | null> {
    return this.agencies.get(agencyId) || null;
  }

  async getAllAgencies(filters?: { type?: AgencyType[]; jurisdiction?: string }): Promise<Agency[]> {
    let agencies = Array.from(this.agencies.values());

    if (filters?.type) {
      agencies = agencies.filter(a => filters.type!.includes(a.type));
    }

    if (filters?.jurisdiction) {
      agencies = agencies.filter(a => 
        a.jurisdiction.area.toLowerCase().includes(filters.jurisdiction!.toLowerCase())
      );
    }

    return agencies;
  }

  async updateAgencyStatus(agencyId: string, status: Agency['status']): Promise<Agency> {
    const agency = this.agencies.get(agencyId);
    if (!agency) throw new Error(`Agency not found: ${agencyId}`);

    agency.status = status;
    agency.lastUpdate = new Date();

    this.emitEvent({
      type: 'agency_status',
      timestamp: new Date(),
      data: { agencyId, status }
    });

    return agency;
  }

  async updateContactAvailability(agencyId: string, contactId: string, availability: AgencyContact['availability']): Promise<AgencyContact> {
    const agency = this.agencies.get(agencyId);
    if (!agency) throw new Error(`Agency not found: ${agencyId}`);

    const contact = agency.contacts.find(c => c.id === contactId);
    if (!contact) throw new Error(`Contact not found: ${contactId}`);

    contact.availability = availability;
    contact.lastActive = new Date();

    return contact;
  }

  // ==================== Incident Management ====================

  async createIncident(params: {
    name: string;
    type: IncidentType;
    location: Incident['location'];
    severity: Incident['severity'];
    leadAgency: string;
    incidentCommander: ICSAssignment['assignee'];
  }): Promise<Incident> {
    const incident: Incident = {
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      status: 'active',
      location: params.location,
      severity: params.severity,
      icsStructure: {
        incidentCommander: {
          position: 'incident_commander',
          assignee: params.incidentCommander,
          assignedAt: new Date()
        },
        generalStaff: {},
        commandStaff: {},
        branches: []
      },
      agencies: [{
        agencyId: params.leadAgency,
        role: 'lead',
        personnelDeployed: 0,
        resourcesDeployed: [],
        liaisons: [],
        assignedAt: new Date()
      }],
      resources: [],
      communications: {
        commandChannel: this.assignCommandChannel(params.type),
        tacticalChannels: [],
        interopChannels: Array.from(this.channels.values()).filter(c => c.interoperable),
        plan: this.createDefaultCommsPlan(params.name)
      },
      timeline: [{
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        type: 'created',
        description: `Incident ${params.name} created`,
        actor: params.incidentCommander.name
      }],
      objectives: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.incidents.set(incident.id, incident);

    this.emitEvent({
      type: 'incident_update',
      timestamp: new Date(),
      data: { incidentId: incident.id, action: 'created', incident }
    });

    return incident;
  }

  private assignCommandChannel(type: IncidentType): CommunicationChannel {
    // Find or create appropriate command channel
    const existing = Array.from(this.channels.values()).find(
      c => c.status === 'standby' && c.interoperable
    );

    if (existing) {
      existing.status = 'active';
      return existing;
    }

    // Create new channel
    const channel: CommunicationChannel = {
      id: `ch-cmd-${Date.now()}`,
      name: `Command Channel - ${type}`,
      type: 'radio',
      frequency: '155.475 MHz',
      encryption: true,
      interoperable: true,
      status: 'active',
      agencies: []
    };

    this.channels.set(channel.id, channel);
    return channel;
  }

  private createDefaultCommsPlan(incidentName: string): CommunicationsPlan {
    return {
      id: `comms-plan-${Date.now()}`,
      channels: [
        { channel: 'Command', function: 'Command and Control', assignment: 'IC and General Staff' },
        { channel: 'Tactical 1', function: 'Operations', assignment: 'Ops Section' },
        { channel: 'Support', function: 'Logistics', assignment: 'Logistics Section' }
      ],
      frequencies: [],
      callSigns: [
        { callSign: `${incidentName}-Command`, assignment: 'Incident Commander' },
        { callSign: `${incidentName}-Ops`, assignment: 'Operations Chief' }
      ],
      procedures: 'Standard ICS communications protocols apply'
    };
  }

  async getIncident(incidentId: string): Promise<Incident | null> {
    return this.incidents.get(incidentId) || null;
  }

  async getAllIncidents(filters?: { status?: Incident['status'][]; type?: IncidentType[] }): Promise<Incident[]> {
    let incidents = Array.from(this.incidents.values());

    if (filters?.status) {
      incidents = incidents.filter(i => filters.status!.includes(i.status));
    }

    if (filters?.type) {
      incidents = incidents.filter(i => filters.type!.includes(i.type));
    }

    return incidents.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateIncidentStatus(incidentId: string, status: Incident['status']): Promise<Incident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    incident.status = status;
    incident.updatedAt = new Date();

    incident.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'status_change',
      description: `Incident status changed to ${status}`,
      actor: 'System'
    });

    this.emitEvent({
      type: 'incident_update',
      timestamp: new Date(),
      data: { incidentId, action: 'status_change', status }
    });

    return incident;
  }

  // ==================== ICS Organization ====================

  async assignICSPosition(incidentId: string, position: ICSPosition, assignee: ICSAssignment['assignee']): Promise<Incident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    const assignment: ICSAssignment = {
      position,
      assignee,
      assignedAt: new Date()
    };

    // Assign to appropriate section
    switch (position) {
      case 'incident_commander':
        incident.icsStructure.incidentCommander = assignment;
        break;
      case 'operations_chief':
        incident.icsStructure.generalStaff.operations = assignment;
        break;
      case 'planning_chief':
        incident.icsStructure.generalStaff.planning = assignment;
        break;
      case 'logistics_chief':
        incident.icsStructure.generalStaff.logistics = assignment;
        break;
      case 'finance_chief':
        incident.icsStructure.generalStaff.finance = assignment;
        break;
      case 'public_info_officer':
        incident.icsStructure.commandStaff.publicInfo = assignment;
        break;
      case 'safety_officer':
        incident.icsStructure.commandStaff.safety = assignment;
        break;
      case 'liaison_officer':
        incident.icsStructure.commandStaff.liaison = assignment;
        break;
    }

    incident.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'updated',
      description: `${assignee.name} assigned as ${position.replace(/_/g, ' ')}`,
      actor: incident.icsStructure.incidentCommander.assignee.name
    });

    incident.updatedAt = new Date();

    return incident;
  }

  async addAgencyToIncident(incidentId: string, agencyId: string, role: IncidentAgency['role']): Promise<Incident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    const agency = this.agencies.get(agencyId);
    if (!agency) throw new Error(`Agency not found: ${agencyId}`);

    // Check if already assigned
    if (incident.agencies.some(a => a.agencyId === agencyId)) {
      throw new Error(`Agency already assigned to incident`);
    }

    incident.agencies.push({
      agencyId,
      role,
      personnelDeployed: 0,
      resourcesDeployed: [],
      liaisons: [],
      assignedAt: new Date()
    });

    // Add agency to communications channels
    incident.communications.commandChannel.agencies.push(agencyId);

    incident.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'updated',
      description: `${agency.name} joined incident as ${role}`,
      actor: 'System'
    });

    incident.updatedAt = new Date();

    return incident;
  }

  // ==================== Resource Management ====================

  async requestResources(params: {
    incidentId: string;
    requestingAgency: string;
    resources: RequestedResource[];
    justification: string;
    priority: MessagePriority;
    neededBy: Date;
  }): Promise<ResourceRequest> {
    const request: ResourceRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      requestingAgency: params.requestingAgency,
      requestedResources: params.resources,
      justification: params.justification,
      priority: params.priority,
      neededBy: params.neededBy,
      status: 'pending',
      responses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.resourceRequests.set(request.id, request);

    // Notify agencies with matching capabilities
    const matchingAgencies = this.findAgenciesWithResources(params.resources);
    for (const agency of matchingAgencies) {
      if (agency.id !== params.requestingAgency) {
        await this.sendMessage({
          incidentId: params.incidentId,
          type: 'resource_request',
          priority: params.priority,
          from: {
            agencyId: params.requestingAgency,
            contactId: '',
            name: 'Resource Request System'
          },
          to: {
            agencyIds: [agency.id],
            broadcast: false
          },
          subject: `Resource Request - ${params.priority.toUpperCase()}`,
          body: `Resources needed:\n${params.resources.map(r => `- ${r.quantity} ${r.type}`).join('\n')}\n\nJustification: ${params.justification}`
        });
      }
    }

    this.emitEvent({
      type: 'resource_request',
      timestamp: new Date(),
      data: request
    });

    return request;
  }

  private findAgenciesWithResources(resources: RequestedResource[]): Agency[] {
    return Array.from(this.agencies.values()).filter(agency => {
      return resources.some(requested => {
        const agencyResource = agency.capabilities.resources.find(
          r => r.type.toLowerCase().includes(requested.type.toLowerCase())
        );
        return agencyResource && agencyResource.available >= requested.quantity;
      });
    });
  }

  async respondToResourceRequest(requestId: string, response: Omit<ResourceResponse, 'respondedAt'>): Promise<ResourceRequest> {
    const request = this.resourceRequests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    request.responses.push({
      ...response,
      respondedAt: new Date()
    });

    // Update request status
    const totalOffered = request.responses.reduce((sum, r) => {
      return sum + r.resourcesOffered.reduce((rSum, res) => rSum + res.quantity, 0);
    }, 0);

    const totalRequested = request.requestedResources.reduce((sum, r) => sum + r.quantity, 0);

    if (totalOffered >= totalRequested) {
      request.status = 'fulfilled';
    } else if (totalOffered > 0) {
      request.status = 'partial';
    }

    request.updatedAt = new Date();

    return request;
  }

  async checkInResource(incidentId: string, resource: Omit<IncidentResource, 'id' | 'checkInTime'>): Promise<IncidentResource> {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    const newResource: IncidentResource = {
      ...resource,
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      checkInTime: new Date()
    };

    incident.resources.push(newResource);

    // Update agency deployment count
    const incidentAgency = incident.agencies.find(a => a.agencyId === resource.agencyId);
    if (incidentAgency) {
      incidentAgency.resourcesDeployed.push(newResource.type);
    }

    incident.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'resource_assigned',
      description: `Resource ${resource.name} (${resource.type}) checked in`,
      actor: resource.agencyId
    });

    incident.updatedAt = new Date();

    return newResource;
  }

  // ==================== Messaging ====================

  async sendMessage(params: {
    incidentId?: string;
    type: InteragencyMessage['type'];
    priority: MessagePriority;
    classification?: MessageClassification;
    from: InteragencyMessage['from'];
    to: InteragencyMessage['to'];
    subject: string;
    body: string;
    attachments?: MessageAttachment[];
    expiresAt?: Date;
  }): Promise<InteragencyMessage> {
    const message: InteragencyMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      type: params.type,
      priority: params.priority,
      classification: params.classification || 'unclassified',
      from: params.from,
      to: params.to,
      subject: params.subject,
      body: params.body,
      attachments: params.attachments,
      acknowledgments: [],
      routing: [],
      expiresAt: params.expiresAt,
      createdAt: new Date()
    };

    this.messages.set(message.id, message);

    // Route to recipients
    const targetAgencies = params.to.broadcast
      ? Array.from(this.agencies.keys())
      : params.to.agencyIds;

    for (const agencyId of targetAgencies) {
      message.routing.push({
        agencyId,
        receivedAt: new Date()
      });

      this.emitEvent({
        type: 'message_received',
        timestamp: new Date(),
        data: { messageId: message.id, agencyId, priority: message.priority }
      });
    }

    // Add to incident timeline if applicable
    if (params.incidentId) {
      const incident = this.incidents.get(params.incidentId);
      if (incident) {
        incident.timeline.push({
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          type: 'message',
          description: `${params.type}: ${params.subject}`,
          actor: params.from.name,
          details: { messageId: message.id, priority: params.priority }
        });
      }
    }

    return message;
  }

  async acknowledgeMessage(messageId: string, agencyId: string, contactId: string, response?: string): Promise<InteragencyMessage> {
    const message = this.messages.get(messageId);
    if (!message) throw new Error(`Message not found: ${messageId}`);

    message.acknowledgments.push({
      agencyId,
      contactId,
      timestamp: new Date(),
      response
    });

    // Update routing
    const routing = message.routing.find(r => r.agencyId === agencyId);
    if (routing) {
      routing.readAt = new Date();
    }

    return message;
  }

  async getMessages(filters?: {
    incidentId?: string;
    agencyId?: string;
    type?: InteragencyMessage['type'][];
    unread?: boolean;
  }): Promise<InteragencyMessage[]> {
    let messages = Array.from(this.messages.values());

    if (filters?.incidentId) {
      messages = messages.filter(m => m.incidentId === filters.incidentId);
    }

    if (filters?.agencyId) {
      messages = messages.filter(m => 
        m.from.agencyId === filters.agencyId ||
        m.to.agencyIds.includes(filters.agencyId!) ||
        m.to.broadcast
      );
    }

    if (filters?.type) {
      messages = messages.filter(m => filters.type!.includes(m.type));
    }

    if (filters?.unread && filters.agencyId) {
      messages = messages.filter(m => {
        const routing = m.routing.find(r => r.agencyId === filters.agencyId);
        return routing && !routing.readAt;
      });
    }

    return messages.sort((a, b) => {
      const priorityOrder = { flash: 0, immediate: 1, priority: 2, routine: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  // ==================== Situation Reports ====================

  async createSituationReport(params: {
    incidentId: string;
    period: SituationReport['period'];
    preparedBy: string;
    summary: string;
    currentSituation: SituationReport['currentSituation'];
  }): Promise<SituationReport> {
    const incident = this.incidents.get(params.incidentId);
    if (!incident) throw new Error(`Incident not found: ${params.incidentId}`);

    // Get report number
    const existingReports = Array.from(this.situationReports.values())
      .filter(r => r.incidentId === params.incidentId);
    const reportNumber = existingReports.length + 1;

    const report: SituationReport = {
      id: `sitrep-${Date.now()}`,
      incidentId: params.incidentId,
      reportNumber,
      period: params.period,
      preparedBy: params.preparedBy,
      summary: params.summary,
      currentSituation: params.currentSituation,
      agencyUpdates: incident.agencies.map(ia => {
        const agency = this.agencies.get(ia.agencyId);
        return {
          agencyId: ia.agencyId,
          agencyName: agency?.name || ia.agencyId,
          update: '',
          resources: ia.resourcesDeployed
        };
      }),
      createdAt: new Date()
    };

    this.situationReports.set(report.id, report);

    // Broadcast to all incident agencies
    await this.sendMessage({
      incidentId: params.incidentId,
      type: 'situation_report',
      priority: 'routine',
      from: {
        agencyId: incident.agencies[0].agencyId,
        contactId: '',
        name: params.preparedBy,
        position: 'planning_chief'
      },
      to: {
        agencyIds: incident.agencies.map(a => a.agencyId),
        broadcast: false
      },
      subject: `Situation Report #${reportNumber} - ${incident.name}`,
      body: params.summary
    });

    return report;
  }

  async getSituationReports(incidentId: string): Promise<SituationReport[]> {
    return Array.from(this.situationReports.values())
      .filter(r => r.incidentId === incidentId)
      .sort((a, b) => b.reportNumber - a.reportNumber);
  }

  // ==================== Channel Management ====================

  async getChannel(channelId: string): Promise<CommunicationChannel | null> {
    return this.channels.get(channelId) || null;
  }

  async getAllChannels(filters?: { interoperable?: boolean; status?: ChannelStatus }): Promise<CommunicationChannel[]> {
    let channels = Array.from(this.channels.values());

    if (filters?.interoperable !== undefined) {
      channels = channels.filter(c => c.interoperable === filters.interoperable);
    }

    if (filters?.status) {
      channels = channels.filter(c => c.status === filters.status);
    }

    return channels;
  }

  async updateChannelStatus(channelId: string, status: ChannelStatus): Promise<CommunicationChannel> {
    const channel = this.channels.get(channelId);
    if (!channel) throw new Error(`Channel not found: ${channelId}`);

    channel.status = status;

    this.emitEvent({
      type: 'channel_status',
      timestamp: new Date(),
      data: { channelId, status }
    });

    return channel;
  }

  // ==================== ICS Forms ====================

  generateICS201(incident: Incident): string {
    // Generate ICS 201 - Incident Briefing
    return `
ICS 201 - INCIDENT BRIEFING
===========================

1. INCIDENT NAME: ${incident.name}

2. INCIDENT NUMBER: ${incident.id}

3. DATE/TIME PREPARED: ${new Date().toISOString()}

4. MAP/SKETCH: [See attached]

5. CURRENT SITUATION:
   Type: ${incident.type}
   Status: ${incident.status}
   Location: ${incident.location.address}

6. INITIAL OBJECTIVES:
${incident.objectives.map((o, i) => `   ${i + 1}. ${o}`).join('\n')}

7. CURRENT ORGANIZATION:
   Incident Commander: ${incident.icsStructure.incidentCommander.assignee.name}
   Operations: ${incident.icsStructure.generalStaff.operations?.assignee.name || 'Not assigned'}
   Planning: ${incident.icsStructure.generalStaff.planning?.assignee.name || 'Not assigned'}
   Logistics: ${incident.icsStructure.generalStaff.logistics?.assignee.name || 'Not assigned'}
   Finance: ${incident.icsStructure.generalStaff.finance?.assignee.name || 'Not assigned'}

8. RESOURCES ASSIGNED:
${incident.resources.map(r => `   - ${r.name} (${r.type}) - ${r.status}`).join('\n')}
    `.trim();
  }

  generateICS205(incident: Incident): string {
    // Generate ICS 205 - Communications Plan
    const plan = incident.communications.plan;
    return `
ICS 205 - INCIDENT RADIO COMMUNICATIONS PLAN
=============================================

1. INCIDENT NAME: ${incident.name}

2. DATE/TIME PREPARED: ${new Date().toISOString()}

3. OPERATIONAL PERIOD: [Current]

4. BASIC RADIO CHANNEL USE:

Zone/Ch | Function | Channel Name | Assignment | RX Freq | TX Freq | Mode
--------|----------|--------------|------------|---------|---------|------
${plan.channels.map((c, i) => 
  `${i + 1}      | ${c.function} | ${c.channel} | ${c.assignment} | ${c.rxFrequency || 'N/A'} | ${c.txFrequency || 'N/A'} | A/D`
).join('\n')}

5. SPECIAL INSTRUCTIONS:
${plan.procedures}

6. PREPARED BY (COMMUNICATIONS UNIT LEADER):
   Name: [COML]
    `.trim();
  }

  // ==================== Statistics ====================

  getStatistics(): {
    agencies: { total: number; operational: number };
    incidents: { active: number; total: number };
    channels: { active: number; total: number };
    pendingRequests: number;
    unreadMessages: number;
  } {
    const agencies = Array.from(this.agencies.values());
    const incidents = Array.from(this.incidents.values());
    const channels = Array.from(this.channels.values());
    const messages = Array.from(this.messages.values());
    const requests = Array.from(this.resourceRequests.values());

    return {
      agencies: {
        total: agencies.length,
        operational: agencies.filter(a => a.status === 'operational').length
      },
      incidents: {
        active: incidents.filter(i => i.status === 'active').length,
        total: incidents.length
      },
      channels: {
        active: channels.filter(c => c.status === 'active' || c.status === 'busy').length,
        total: channels.length
      },
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      unreadMessages: messages.filter(m => 
        m.routing.some(r => !r.readAt)
      ).length
    };
  }

  // ==================== Subscriptions ====================

  subscribe(callback: (event: CommunicationEvent) => void, eventTypes?: CommunicationEventType[]): string {
    const id = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(id, { id, callback, eventTypes });
    return id;
  }

  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  private emitEvent(event: CommunicationEvent): void {
    for (const subscription of this.subscriptions.values()) {
      if (!subscription.eventTypes || subscription.eventTypes.includes(event.type)) {
        try {
          subscription.callback(event);
        } catch (error) {
          console.error('Subscription callback error:', error);
        }
      }
    }
  }
}

export const interagencyCommunicationService = InteragencyCommunicationService.getInstance();
export default InteragencyCommunicationService;

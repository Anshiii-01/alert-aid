/**
 * Disability Assistance Service - Issue #131 Implementation
 * 
 * Provides comprehensive disability support services for emergency response
 * including accessibility accommodations, assistive technology coordination,
 * specialized evacuation assistance, and service animal support.
 */

// Type definitions
type DisabilityType = 'mobility' | 'visual' | 'hearing' | 'cognitive' | 'speech' | 'chronic_illness' | 'mental_health' | 'developmental' | 'multiple';
type AssistanceLevel = 'independent' | 'minimal' | 'moderate' | 'extensive' | 'total';
type AccommodationType = 'physical' | 'communication' | 'sensory' | 'cognitive' | 'medical' | 'emotional';
type EvacuationType = 'self_evacuate' | 'assisted' | 'carry' | 'transport_required' | 'shelter_in_place';
type ServiceAnimalType = 'guide_dog' | 'hearing_dog' | 'mobility_dog' | 'psychiatric_service_dog' | 'seizure_alert' | 'diabetic_alert' | 'autism_support' | 'other';
type EquipmentStatus = 'functional' | 'damaged' | 'lost' | 'replacement_needed' | 'unavailable';

// Individual profile interfaces
interface DisabilityProfile {
  id: string;
  personId: string;
  personalInfo: {
    name: string;
    dateOfBirth?: Date;
    preferredName?: string;
    gender?: string;
    primaryLanguage: string;
    communicationPreferences: string[];
  };
  disabilities: DisabilityInfo[];
  assistanceNeeds: AssistanceNeed[];
  medicalInfo: MedicalInfo;
  equipment: AssistiveEquipment[];
  serviceAnimals: ServiceAnimal[];
  emergencyContacts: EmergencyContact[];
  evacuation: EvacuationPlan;
  accommodations: AccommodationRequirement[];
  registeredLocations: RegisteredLocation[];
  status: 'active' | 'inactive' | 'needs_update';
  lastUpdated: Date;
  createdAt: Date;
}

interface DisabilityInfo {
  type: DisabilityType;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'profound';
  onset: 'congenital' | 'acquired';
  progressive: boolean;
  documentation?: string;
}

interface AssistanceNeed {
  category: 'mobility' | 'communication' | 'daily_living' | 'medical' | 'cognitive' | 'emotional';
  description: string;
  level: AssistanceLevel;
  frequency: 'constant' | 'frequent' | 'occasional' | 'situational';
  specificRequirements: string[];
}

interface MedicalInfo {
  conditions: string[];
  medications: MedicationInfo[];
  allergies: string[];
  treatments: string[];
  medicalEquipmentNeeds: string[];
  powerDependentEquipment: boolean;
  oxygenDependent: boolean;
  dialysisRequired: boolean;
  physicalCapabilities: {
    canWalk: boolean;
    walkingDistance?: number;
    canClimbStairs: boolean;
    stairsLimit?: number;
    canTransfer: boolean;
    weightBearingStatus?: string;
  };
  emergencyMedicalInfo: string;
}

interface MedicationInfo {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  refrigerationRequired: boolean;
  criticalMedication: boolean;
  supplyDays: number;
}

interface AssistiveEquipment {
  id: string;
  type: 'wheelchair' | 'walker' | 'cane' | 'prosthetic' | 'hearing_aid' | 'cochlear_implant' | 'glasses' | 'ventilator' | 'cpap' | 'feeding_tube' | 'communication_device' | 'insulin_pump' | 'other';
  description: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  powerRequired: boolean;
  batteryBackup?: number; // hours
  status: EquipmentStatus;
  lastMaintenance?: Date;
  portability: 'portable' | 'semi_portable' | 'fixed';
  essentialForEvacuation: boolean;
}

interface ServiceAnimal {
  id: string;
  name: string;
  type: ServiceAnimalType;
  species: string;
  breed?: string;
  weight?: number;
  tasks: string[];
  identification: {
    microchip?: string;
    registrationNumber?: string;
    vest: boolean;
  };
  veterinaryInfo: {
    vetName: string;
    vetPhone: string;
    lastCheckup?: Date;
    vaccinations: { type: string; date: Date; expires: Date }[];
  };
  emergencySupplies: string[];
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  canMakeDecisions: boolean;
  hasKey: boolean;
  knowsSignLanguage?: boolean;
  notes?: string;
}

interface EvacuationPlan {
  type: EvacuationType;
  assistanceRequired: string[];
  evacuationRoutes: EvacuationRoute[];
  safeRooms: string[];
  meetingPoints: { location: string; coordinates?: { lat: number; lon: number } }[];
  specialInstructions: string;
  transportNeeds: {
    wheelchairAccessible: boolean;
    stretcherRequired: boolean;
    medicalTransport: boolean;
    accompaniment: boolean;
  };
  estimatedEvacuationTime: number; // minutes
}

interface EvacuationRoute {
  name: string;
  description: string;
  accessible: boolean;
  obstacles: string[];
  alternateRoute?: string;
}

interface AccommodationRequirement {
  type: AccommodationType;
  description: string;
  priority: 'essential' | 'important' | 'preferred';
  specifications: string[];
}

interface RegisteredLocation {
  type: 'home' | 'work' | 'school' | 'medical' | 'other';
  name: string;
  address: string;
  coordinates?: { lat: number; lon: number };
  floor?: number;
  unit?: string;
  accessNotes: string;
  scheduleNotes?: string;
}

// Assistance request interfaces
interface AssistanceRequest {
  id: string;
  profileId: string;
  incidentId?: string;
  type: 'evacuation' | 'shelter' | 'medical' | 'equipment' | 'communication' | 'transportation' | 'supplies' | 'other';
  priority: 'immediate' | 'urgent' | 'standard';
  description: string;
  specificNeeds: string[];
  location: {
    address: string;
    coordinates?: { lat: number; lon: number };
    floor?: number;
    accessInstructions?: string;
  };
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTeam?: string;
  timeline: RequestEvent[];
  createdAt: Date;
  updatedAt: Date;
}

interface RequestEvent {
  timestamp: Date;
  type: 'created' | 'assigned' | 'status_change' | 'note' | 'completed';
  description: string;
  actor: string;
}

// Shelter accessibility interfaces
interface AccessibleShelter {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lon: number };
  totalCapacity: number;
  accessibleCapacity: number;
  currentOccupancy: number;
  accessibleOccupancy: number;
  accessibility: ShelterAccessibility;
  services: ShelterService[];
  medicalSupport: MedicalSupportLevel;
  petFriendly: boolean;
  serviceAnimalsAllowed: boolean;
  status: 'open' | 'limited' | 'full' | 'closed';
  lastUpdated: Date;
}

interface ShelterAccessibility {
  wheelchairAccessible: boolean;
  accessibleEntrance: boolean;
  accessibleRestrooms: boolean;
  accessibleShowers: boolean;
  accessibleSleepingAreas: boolean;
  elevatorAvailable: boolean;
  rampAvailable: boolean;
  wideDoorways: boolean;
  accessibleParking: boolean;
  hearingLoopSystem: boolean;
  visualAlerts: boolean;
  quietAreas: boolean;
  sensoryFriendlySpaces: boolean;
  privateAreas: boolean;
  refrigerationForMedications: boolean;
  powerOutlets: boolean;
  generatorBackup: boolean;
}

interface ShelterService {
  type: string;
  available: boolean;
  notes?: string;
}

type MedicalSupportLevel = 'basic' | 'intermediate' | 'advanced' | 'none';

// Resource interfaces
interface AccessibilityResource {
  id: string;
  type: 'equipment' | 'service' | 'personnel' | 'transportation';
  name: string;
  description: string;
  quantity: number;
  available: number;
  location?: string;
  contact?: string;
  specifications?: Record<string, string>;
  status: 'available' | 'limited' | 'unavailable';
}

interface TransportationResource {
  id: string;
  type: 'wheelchair_van' | 'ambulance' | 'paratransit' | 'accessible_bus' | 'stretcher_vehicle';
  provider: string;
  capacity: {
    wheelchairs: number;
    ambulatory: number;
    stretchers: number;
  };
  features: string[];
  status: 'available' | 'dispatched' | 'maintenance' | 'unavailable';
  location?: { lat: number; lon: number };
  eta?: number;
}

// Communication support interfaces
interface CommunicationSupport {
  id: string;
  type: 'sign_language_interpreter' | 'video_relay' | 'captioning' | 'translation' | 'augmentative_communication' | 'braille' | 'large_print' | 'audio_description';
  provider: string;
  languages?: string[];
  availability: 'immediate' | 'within_hour' | 'scheduled';
  contact: string;
  notes?: string;
}

// Sample data
const sampleProfiles: DisabilityProfile[] = [
  {
    id: 'profile-001',
    personId: 'person-001',
    personalInfo: {
      name: 'Robert Johnson',
      preferredName: 'Bob',
      primaryLanguage: 'English',
      communicationPreferences: ['verbal', 'written']
    },
    disabilities: [
      { type: 'mobility', description: 'Spinal cord injury - paraplegia', severity: 'severe', onset: 'acquired', progressive: false }
    ],
    assistanceNeeds: [
      { category: 'mobility', description: 'Uses manual wheelchair', level: 'moderate', frequency: 'constant', specificRequirements: ['Accessible pathways', 'Transfer assistance'] }
    ],
    medicalInfo: {
      conditions: ['Paraplegia T6', 'Neurogenic bladder'],
      medications: [{ name: 'Baclofen', dosage: '10mg', frequency: 'TID', purpose: 'Spasticity', refrigerationRequired: false, criticalMedication: true, supplyDays: 30 }],
      allergies: ['Latex'],
      treatments: ['Intermittent catheterization'],
      medicalEquipmentNeeds: ['Wheelchair', 'Cushion', 'Catheter supplies'],
      powerDependentEquipment: false,
      oxygenDependent: false,
      dialysisRequired: false,
      physicalCapabilities: {
        canWalk: false,
        canClimbStairs: false,
        canTransfer: true,
        weightBearingStatus: 'Non-weight bearing lower extremities'
      },
      emergencyMedicalInfo: 'T6 paraplegic, risk of autonomic dysreflexia with bladder distension'
    },
    equipment: [
      { id: 'eq-001', type: 'wheelchair', description: 'Manual wheelchair - TiLite ZRA', manufacturer: 'TiLite', model: 'ZRA', powerRequired: false, status: 'functional', portability: 'portable', essentialForEvacuation: true }
    ],
    serviceAnimals: [],
    emergencyContacts: [
      { name: 'Mary Johnson', relationship: 'Wife', phone: '+1-555-0101', canMakeDecisions: true, hasKey: true }
    ],
    evacuation: {
      type: 'assisted',
      assistanceRequired: ['Wheelchair accessible vehicle', 'Assistance with transfers'],
      evacuationRoutes: [
        { name: 'Front door', description: 'Ramp access, no stairs', accessible: true, obstacles: [] }
      ],
      safeRooms: ['Ground floor bedroom'],
      meetingPoints: [{ location: 'Front yard by mailbox' }],
      specialInstructions: 'Grab wheelchair cushion and catheter supplies',
      transportNeeds: {
        wheelchairAccessible: true,
        stretcherRequired: false,
        medicalTransport: false,
        accompaniment: false
      },
      estimatedEvacuationTime: 15
    },
    accommodations: [
      { type: 'physical', description: 'Wheelchair accessible sleeping area', priority: 'essential', specifications: ['Ground floor', 'Near accessible bathroom'] }
    ],
    registeredLocations: [
      { type: 'home', name: 'Home', address: '123 Main St', floor: 1, accessNotes: 'Ramp at front door' }
    ],
    status: 'active',
    lastUpdated: new Date(),
    createdAt: new Date()
  }
];

const sampleShelters: AccessibleShelter[] = [
  {
    id: 'shelter-001',
    name: 'Metro Community Center',
    address: '500 Civic Center Dr',
    coordinates: { lat: 34.0522, lon: -118.2437 },
    totalCapacity: 500,
    accessibleCapacity: 50,
    currentOccupancy: 150,
    accessibleOccupancy: 12,
    accessibility: {
      wheelchairAccessible: true,
      accessibleEntrance: true,
      accessibleRestrooms: true,
      accessibleShowers: true,
      accessibleSleepingAreas: true,
      elevatorAvailable: true,
      rampAvailable: true,
      wideDoorways: true,
      accessibleParking: true,
      hearingLoopSystem: true,
      visualAlerts: true,
      quietAreas: true,
      sensoryFriendlySpaces: true,
      privateAreas: true,
      refrigerationForMedications: true,
      powerOutlets: true,
      generatorBackup: true
    },
    services: [
      { type: 'Medical staff on site', available: true },
      { type: 'Sign language interpreters', available: true, notes: 'ASL available 8am-8pm' },
      { type: 'Durable medical equipment', available: true }
    ],
    medicalSupport: 'intermediate',
    petFriendly: false,
    serviceAnimalsAllowed: true,
    status: 'open',
    lastUpdated: new Date()
  }
];

class DisabilityAssistanceService {
  private static instance: DisabilityAssistanceService;
  private profiles: Map<string, DisabilityProfile> = new Map();
  private requests: Map<string, AssistanceRequest> = new Map();
  private shelters: Map<string, AccessibleShelter> = new Map();
  private resources: Map<string, AccessibilityResource> = new Map();
  private transportation: Map<string, TransportationResource> = new Map();
  private communicationSupports: Map<string, CommunicationSupport> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): DisabilityAssistanceService {
    if (!DisabilityAssistanceService.instance) {
      DisabilityAssistanceService.instance = new DisabilityAssistanceService();
    }
    return DisabilityAssistanceService.instance;
  }

  private initializeSampleData(): void {
    sampleProfiles.forEach(p => this.profiles.set(p.id, p));
    sampleShelters.forEach(s => this.shelters.set(s.id, s));
  }

  // ==================== Profile Management ====================

  async createProfile(profile: Omit<DisabilityProfile, 'id' | 'createdAt' | 'lastUpdated' | 'status'>): Promise<DisabilityProfile> {
    const newProfile: DisabilityProfile = {
      ...profile,
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    this.profiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  async getProfile(profileId: string): Promise<DisabilityProfile | null> {
    return this.profiles.get(profileId) || null;
  }

  async updateProfile(profileId: string, updates: Partial<DisabilityProfile>): Promise<DisabilityProfile> {
    const profile = this.profiles.get(profileId);
    if (!profile) throw new Error(`Profile not found: ${profileId}`);

    Object.assign(profile, updates, { lastUpdated: new Date() });
    return profile;
  }

  async searchProfiles(params: {
    disabilityType?: DisabilityType;
    evacuationType?: EvacuationType;
    location?: { lat: number; lon: number; radiusMiles: number };
    powerDependent?: boolean;
  }): Promise<DisabilityProfile[]> {
    let profiles = Array.from(this.profiles.values())
      .filter(p => p.status === 'active');

    if (params.disabilityType) {
      profiles = profiles.filter(p =>
        p.disabilities.some(d => d.type === params.disabilityType)
      );
    }

    if (params.evacuationType) {
      profiles = profiles.filter(p => p.evacuation.type === params.evacuationType);
    }

    if (params.powerDependent !== undefined) {
      profiles = profiles.filter(p =>
        p.medicalInfo.powerDependentEquipment === params.powerDependent
      );
    }

    if (params.location) {
      profiles = profiles.filter(p => {
        const homeLocation = p.registeredLocations.find(l => l.type === 'home');
        if (!homeLocation?.coordinates) return false;
        const distance = this.calculateDistance(
          params.location!.lat, params.location!.lon,
          homeLocation.coordinates.lat, homeLocation.coordinates.lon
        );
        return distance <= params.location!.radiusMiles;
      });
    }

    return profiles;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ==================== Assistance Requests ====================

  async createAssistanceRequest(params: {
    profileId: string;
    incidentId?: string;
    type: AssistanceRequest['type'];
    priority: AssistanceRequest['priority'];
    description: string;
    specificNeeds: string[];
    location: AssistanceRequest['location'];
  }): Promise<AssistanceRequest> {
    const profile = this.profiles.get(params.profileId);
    if (!profile) throw new Error(`Profile not found: ${params.profileId}`);

    const request: AssistanceRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      profileId: params.profileId,
      incidentId: params.incidentId,
      type: params.type,
      priority: params.priority,
      description: params.description,
      specificNeeds: params.specificNeeds,
      location: params.location,
      status: 'pending',
      timeline: [{
        timestamp: new Date(),
        type: 'created',
        description: 'Assistance request created',
        actor: 'System'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.requests.set(request.id, request);
    return request;
  }

  async getRequest(requestId: string): Promise<AssistanceRequest | null> {
    return this.requests.get(requestId) || null;
  }

  async updateRequestStatus(requestId: string, status: AssistanceRequest['status'], actor: string, notes?: string): Promise<AssistanceRequest> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    request.status = status;
    request.updatedAt = new Date();
    request.timeline.push({
      timestamp: new Date(),
      type: 'status_change',
      description: `Status changed to ${status}${notes ? `: ${notes}` : ''}`,
      actor
    });

    return request;
  }

  async assignTeamToRequest(requestId: string, teamId: string, actor: string): Promise<AssistanceRequest> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    request.assignedTeam = teamId;
    request.status = 'assigned';
    request.updatedAt = new Date();
    request.timeline.push({
      timestamp: new Date(),
      type: 'assigned',
      description: `Assigned to team ${teamId}`,
      actor
    });

    return request;
  }

  async getPendingRequests(priority?: AssistanceRequest['priority']): Promise<AssistanceRequest[]> {
    let requests = Array.from(this.requests.values())
      .filter(r => r.status === 'pending' || r.status === 'assigned');

    if (priority) {
      requests = requests.filter(r => r.priority === priority);
    }

    // Sort by priority
    const priorityOrder = { immediate: 0, urgent: 1, standard: 2 };
    return requests.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  // ==================== Evacuation Support ====================

  async generateEvacuationBriefing(profileId: string): Promise<{
    personalInfo: DisabilityProfile['personalInfo'];
    evacuationType: EvacuationType;
    assistanceNeeds: string[];
    equipment: { item: string; essential: boolean }[];
    medicalPriorities: string[];
    communicationNeeds: string[];
    transportRequirements: EvacuationPlan['transportNeeds'];
    specialInstructions: string;
  }> {
    const profile = this.profiles.get(profileId);
    if (!profile) throw new Error(`Profile not found: ${profileId}`);

    return {
      personalInfo: profile.personalInfo,
      evacuationType: profile.evacuation.type,
      assistanceNeeds: profile.assistanceNeeds.map(n => n.description),
      equipment: profile.equipment.map(e => ({
        item: e.description,
        essential: e.essentialForEvacuation
      })),
      medicalPriorities: [
        ...profile.medicalInfo.medications.filter(m => m.criticalMedication).map(m => `${m.name} (${m.dosage})`),
        ...profile.medicalInfo.treatments,
        profile.medicalInfo.emergencyMedicalInfo
      ].filter(Boolean),
      communicationNeeds: profile.personalInfo.communicationPreferences,
      transportRequirements: profile.evacuation.transportNeeds,
      specialInstructions: profile.evacuation.specialInstructions
    };
  }

  async findEvacuationResources(profileId: string): Promise<{
    transportation: TransportationResource[];
    shelters: AccessibleShelter[];
    communicationSupport: CommunicationSupport[];
  }> {
    const profile = this.profiles.get(profileId);
    if (!profile) throw new Error(`Profile not found: ${profileId}`);

    // Find appropriate transportation
    const transport = Array.from(this.transportation.values())
      .filter(t => {
        if (t.status !== 'available') return false;
        if (profile.evacuation.transportNeeds.wheelchairAccessible && t.capacity.wheelchairs === 0) return false;
        if (profile.evacuation.transportNeeds.stretcherRequired && t.capacity.stretchers === 0) return false;
        return true;
      });

    // Find accessible shelters
    const shelters = await this.findAccessibleShelters({
      wheelchairAccessible: profile.disabilities.some(d => d.type === 'mobility'),
      sensoryFriendly: profile.disabilities.some(d => d.type === 'cognitive' || d.type === 'developmental'),
      medicalSupport: profile.medicalInfo.powerDependentEquipment || profile.medicalInfo.oxygenDependent ? 'intermediate' : 'basic',
      serviceAnimalsAllowed: profile.serviceAnimals.length > 0
    });

    // Find communication support
    const commSupport = Array.from(this.communicationSupports.values())
      .filter(c => {
        if (profile.disabilities.some(d => d.type === 'hearing') &&
          (c.type === 'sign_language_interpreter' || c.type === 'video_relay' || c.type === 'captioning')) {
          return true;
        }
        if (profile.disabilities.some(d => d.type === 'visual') &&
          (c.type === 'braille' || c.type === 'large_print' || c.type === 'audio_description')) {
          return true;
        }
        return false;
      });

    return { transportation: transport, shelters, communicationSupport: commSupport };
  }

  // ==================== Shelter Management ====================

  async registerShelter(shelter: Omit<AccessibleShelter, 'id' | 'lastUpdated'>): Promise<AccessibleShelter> {
    const newShelter: AccessibleShelter = {
      ...shelter,
      id: `shelter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date()
    };

    this.shelters.set(newShelter.id, newShelter);
    return newShelter;
  }

  async getShelter(shelterId: string): Promise<AccessibleShelter | null> {
    return this.shelters.get(shelterId) || null;
  }

  async findAccessibleShelters(requirements: {
    wheelchairAccessible?: boolean;
    sensoryFriendly?: boolean;
    medicalSupport?: MedicalSupportLevel;
    serviceAnimalsAllowed?: boolean;
    location?: { lat: number; lon: number; radiusMiles: number };
  }): Promise<AccessibleShelter[]> {
    let shelters = Array.from(this.shelters.values())
      .filter(s => s.status === 'open' || s.status === 'limited');

    if (requirements.wheelchairAccessible) {
      shelters = shelters.filter(s => s.accessibility.wheelchairAccessible);
    }

    if (requirements.sensoryFriendly) {
      shelters = shelters.filter(s =>
        s.accessibility.sensoryFriendlySpaces && s.accessibility.quietAreas
      );
    }

    if (requirements.medicalSupport) {
      const supportLevels = { none: 0, basic: 1, intermediate: 2, advanced: 3 };
      shelters = shelters.filter(s =>
        supportLevels[s.medicalSupport] >= supportLevels[requirements.medicalSupport!]
      );
    }

    if (requirements.serviceAnimalsAllowed) {
      shelters = shelters.filter(s => s.serviceAnimalsAllowed);
    }

    if (requirements.location) {
      shelters = shelters.filter(s => {
        const distance = this.calculateDistance(
          requirements.location!.lat, requirements.location!.lon,
          s.coordinates.lat, s.coordinates.lon
        );
        return distance <= requirements.location!.radiusMiles;
      });
    }

    // Sort by available accessible capacity
    return shelters.sort((a, b) =>
      (b.accessibleCapacity - b.accessibleOccupancy) - (a.accessibleCapacity - a.accessibleOccupancy)
    );
  }

  async updateShelterOccupancy(shelterId: string, accessibleOccupancy: number): Promise<AccessibleShelter> {
    const shelter = this.shelters.get(shelterId);
    if (!shelter) throw new Error(`Shelter not found: ${shelterId}`);

    shelter.accessibleOccupancy = accessibleOccupancy;
    shelter.lastUpdated = new Date();

    if (shelter.accessibleOccupancy >= shelter.accessibleCapacity) {
      shelter.status = 'full';
    } else if (shelter.accessibleOccupancy >= shelter.accessibleCapacity * 0.9) {
      shelter.status = 'limited';
    }

    return shelter;
  }

  // ==================== Resource Management ====================

  async registerResource(resource: Omit<AccessibilityResource, 'id'>): Promise<AccessibilityResource> {
    const newResource: AccessibilityResource = {
      ...resource,
      id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  async findResources(type?: AccessibilityResource['type']): Promise<AccessibilityResource[]> {
    let resources = Array.from(this.resources.values())
      .filter(r => r.status !== 'unavailable');

    if (type) {
      resources = resources.filter(r => r.type === type);
    }

    return resources;
  }

  async requestEquipment(profileId: string, equipmentType: AssistiveEquipment['type'], reason: string): Promise<AssistanceRequest> {
    const profile = this.profiles.get(profileId);
    if (!profile) throw new Error(`Profile not found: ${profileId}`);

    return this.createAssistanceRequest({
      profileId,
      type: 'equipment',
      priority: 'urgent',
      description: `Equipment request: ${equipmentType}`,
      specificNeeds: [equipmentType, reason],
      location: {
        address: profile.registeredLocations.find(l => l.type === 'home')?.address || '',
        accessInstructions: profile.registeredLocations.find(l => l.type === 'home')?.accessNotes
      }
    });
  }

  // ==================== Transportation ====================

  async registerTransportation(transport: Omit<TransportationResource, 'id'>): Promise<TransportationResource> {
    const newTransport: TransportationResource = {
      ...transport,
      id: `transport-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.transportation.set(newTransport.id, newTransport);
    return newTransport;
  }

  async findAvailableTransport(requirements: {
    wheelchairs?: number;
    stretchers?: number;
    ambulatory?: number;
  }): Promise<TransportationResource[]> {
    return Array.from(this.transportation.values())
      .filter(t => {
        if (t.status !== 'available') return false;
        if (requirements.wheelchairs && t.capacity.wheelchairs < requirements.wheelchairs) return false;
        if (requirements.stretchers && t.capacity.stretchers < requirements.stretchers) return false;
        if (requirements.ambulatory && t.capacity.ambulatory < requirements.ambulatory) return false;
        return true;
      });
  }

  async dispatchTransport(transportId: string, destination: { lat: number; lon: number }): Promise<TransportationResource> {
    const transport = this.transportation.get(transportId);
    if (!transport) throw new Error(`Transport not found: ${transportId}`);

    transport.status = 'dispatched';
    return transport;
  }

  // ==================== Communication Support ====================

  async registerCommunicationSupport(support: Omit<CommunicationSupport, 'id'>): Promise<CommunicationSupport> {
    const newSupport: CommunicationSupport = {
      ...support,
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.communicationSupports.set(newSupport.id, newSupport);
    return newSupport;
  }

  async findCommunicationSupport(type?: CommunicationSupport['type'], language?: string): Promise<CommunicationSupport[]> {
    let supports = Array.from(this.communicationSupports.values());

    if (type) {
      supports = supports.filter(s => s.type === type);
    }

    if (language) {
      supports = supports.filter(s =>
        !s.languages || s.languages.includes(language)
      );
    }

    return supports.sort((a, b) => {
      const availabilityOrder = { immediate: 0, within_hour: 1, scheduled: 2 };
      return availabilityOrder[a.availability] - availabilityOrder[b.availability];
    });
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalProfiles: number;
    byDisabilityType: Record<DisabilityType, number>;
    byEvacuationType: Record<EvacuationType, number>;
    powerDependentCount: number;
    pendingRequests: number;
    availableShelterCapacity: number;
    availableTransport: number;
  }> {
    const profiles = Array.from(this.profiles.values());
    const requests = Array.from(this.requests.values());
    const shelters = Array.from(this.shelters.values());
    const transport = Array.from(this.transportation.values());

    const byDisabilityType: Record<DisabilityType, number> = {
      mobility: 0, visual: 0, hearing: 0, cognitive: 0, speech: 0,
      chronic_illness: 0, mental_health: 0, developmental: 0, multiple: 0
    };

    const byEvacuationType: Record<EvacuationType, number> = {
      self_evacuate: 0, assisted: 0, carry: 0, transport_required: 0, shelter_in_place: 0
    };

    profiles.forEach(p => {
      p.disabilities.forEach(d => byDisabilityType[d.type]++);
      byEvacuationType[p.evacuation.type]++;
    });

    return {
      totalProfiles: profiles.length,
      byDisabilityType,
      byEvacuationType,
      powerDependentCount: profiles.filter(p => p.medicalInfo.powerDependentEquipment).length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      availableShelterCapacity: shelters.reduce((sum, s) =>
        sum + (s.accessibleCapacity - s.accessibleOccupancy), 0),
      availableTransport: transport.filter(t => t.status === 'available').length
    };
  }
}

export const disabilityAssistanceService = DisabilityAssistanceService.getInstance();
export default DisabilityAssistanceService;

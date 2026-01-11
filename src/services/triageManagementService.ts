/**
 * Triage Management Service - Issue #127 Implementation
 * 
 * Provides comprehensive triage management for mass casualty incidents,
 * implementing START (Simple Triage and Rapid Treatment), SALT, and JumpSTART
 * protocols for efficient patient categorization and treatment prioritization.
 */

// Type definitions
type TriageCategory = 'immediate' | 'delayed' | 'minor' | 'expectant' | 'deceased';
type TriageProtocol = 'START' | 'SALT' | 'JumpSTART' | 'SMART' | 'CareFlight' | 'Sieve';
type AgeGroup = 'infant' | 'child' | 'adult' | 'elderly';
type TriageStatus = 'pending' | 'in_progress' | 'completed' | 'reassessed';
type TransportPriority = 'immediate' | 'urgent' | 'delayed' | 'none';

// Triage color codes
const TRIAGE_COLORS: Record<TriageCategory, string> = {
  immediate: 'red',
  delayed: 'yellow',
  minor: 'green',
  expectant: 'gray',
  deceased: 'black'
};

// Triage interfaces
interface TriageAssessment {
  id: string;
  patientId: string;
  incidentId: string;
  protocol: TriageProtocol;
  category: TriageCategory;
  colorCode: string;
  priority: number;
  assessor: {
    id: string;
    name: string;
    role: 'paramedic' | 'nurse' | 'physician' | 'first_responder';
  };
  location: {
    lat: number;
    lon: number;
    area: string;
    sector?: string;
  };
  vitals?: VitalSigns;
  injuries: Injury[];
  interventions: Intervention[];
  tags: TriageTag[];
  transportPriority: TransportPriority;
  destination?: string;
  status: TriageStatus;
  assessedAt: Date;
  reassessedAt?: Date;
  notes: string;
}

interface VitalSigns {
  respiratoryRate?: number;
  pulse?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  oxygenSaturation?: number;
  temperature?: number;
  consciousness: 'alert' | 'verbal' | 'pain' | 'unresponsive';
  capillaryRefill?: number;
  walking?: boolean;
  recordedAt: Date;
}

interface Injury {
  id: string;
  type: 'trauma' | 'burn' | 'fracture' | 'laceration' | 'internal' | 'respiratory' | 'cardiac' | 'neurological' | 'chemical' | 'radiation' | 'other';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  bodyPart: string;
  description: string;
  treatmentRequired: string[];
}

interface Intervention {
  id: string;
  type: 'airway' | 'breathing' | 'circulation' | 'hemorrhage_control' | 'immobilization' | 'medication' | 'iv_access' | 'other';
  description: string;
  performedBy: string;
  performedAt: Date;
  outcome: 'successful' | 'partial' | 'unsuccessful';
}

interface TriageTag {
  id: string;
  number: string;
  category: TriageCategory;
  attachedAt: Date;
  attachedBy: string;
  qrCode?: string;
  rfid?: string;
}

interface Patient {
  id: string;
  triageNumber: string;
  demographicsKnown: boolean;
  name?: string;
  age?: number;
  ageGroup: AgeGroup;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  identifiers?: {
    type: string;
    value: string;
  }[];
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  currentAssessment?: TriageAssessment;
  assessmentHistory: string[];
  status: 'on_scene' | 'in_transport' | 'at_facility' | 'discharged' | 'deceased';
  createdAt: Date;
  updatedAt: Date;
}

interface TriageStation {
  id: string;
  name: string;
  incidentId: string;
  location: {
    lat: number;
    lon: number;
    description: string;
  };
  type: 'primary' | 'secondary' | 'treatment' | 'transport';
  capacity: number;
  currentPatients: number;
  staff: StationStaff[];
  supplies: StationSupply[];
  status: 'setup' | 'operational' | 'at_capacity' | 'closed';
  createdAt: Date;
}

interface StationStaff {
  id: string;
  name: string;
  role: string;
  certification: string[];
  assignedAt: Date;
}

interface StationSupply {
  name: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
}

interface TreatmentArea {
  id: string;
  stationId: string;
  category: TriageCategory;
  capacity: number;
  currentPatients: number;
  patients: string[];
  location: string;
}

interface TransportRequest {
  id: string;
  patientId: string;
  assessmentId: string;
  priority: TransportPriority;
  requestedBy: string;
  requestedAt: Date;
  destination: string;
  specialRequirements: string[];
  assignedUnit?: string;
  departureTime?: Date;
  arrivalTime?: Date;
  status: 'requested' | 'assigned' | 'enroute' | 'delivered' | 'cancelled';
}

interface MassCasualtyIncident {
  id: string;
  name: string;
  type: string;
  location: { lat: number; lon: number; address: string };
  estimatedCasualties: number;
  confirmedCasualties: number;
  triageStations: string[];
  transportUnits: TransportUnit[];
  receivingFacilities: ReceivingFacility[];
  commandStructure: {
    medicalBranchDirector?: string;
    triageUnitLeader?: string;
    treatmentUnitLeader?: string;
    transportUnitLeader?: string;
  };
  status: 'active' | 'winding_down' | 'closed';
  startedAt: Date;
  closedAt?: Date;
}

interface TransportUnit {
  id: string;
  callSign: string;
  type: 'als' | 'bls' | 'helicopter' | 'bus' | 'private';
  capacity: number;
  currentLoad: number;
  status: 'available' | 'assigned' | 'enroute_scene' | 'at_scene' | 'enroute_hospital' | 'at_hospital' | 'out_of_service';
  eta?: number;
  location?: { lat: number; lon: number };
}

interface ReceivingFacility {
  id: string;
  name: string;
  type: 'trauma_center' | 'hospital' | 'urgent_care' | 'burn_center' | 'pediatric';
  traumaLevel?: 1 | 2 | 3 | 4 | 5;
  capacity: {
    immediate: number;
    delayed: number;
    minor: number;
  };
  currentLoad: {
    immediate: number;
    delayed: number;
    minor: number;
  };
  specialties: string[];
  distance: number;
  eta: number;
  divertStatus: 'open' | 'limited' | 'divert';
  contact: string;
}

interface TriageStatistics {
  totalPatients: number;
  byCategory: Record<TriageCategory, number>;
  byStatus: Record<string, number>;
  averageTriageTime: number;
  transportedCount: number;
  onSceneCount: number;
}

// Sample data
const samplePatients: Patient[] = [
  {
    id: 'patient-001',
    triageNumber: 'T-0001',
    demographicsKnown: true,
    name: 'John Smith',
    age: 45,
    ageGroup: 'adult',
    gender: 'male',
    assessmentHistory: [],
    status: 'on_scene',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'patient-002',
    triageNumber: 'T-0002',
    demographicsKnown: false,
    ageGroup: 'adult',
    gender: 'female',
    assessmentHistory: [],
    status: 'on_scene',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleFacilities: ReceivingFacility[] = [
  {
    id: 'facility-001',
    name: 'Metro General Hospital',
    type: 'trauma_center',
    traumaLevel: 1,
    capacity: { immediate: 10, delayed: 20, minor: 50 },
    currentLoad: { immediate: 3, delayed: 8, minor: 15 },
    specialties: ['trauma', 'cardiac', 'neuro', 'burn'],
    distance: 5.2,
    eta: 12,
    divertStatus: 'open',
    contact: '+1-555-0101'
  },
  {
    id: 'facility-002',
    name: 'Community Medical Center',
    type: 'hospital',
    traumaLevel: 3,
    capacity: { immediate: 5, delayed: 15, minor: 30 },
    currentLoad: { immediate: 2, delayed: 5, minor: 10 },
    specialties: ['general', 'orthopedic'],
    distance: 3.1,
    eta: 8,
    divertStatus: 'open',
    contact: '+1-555-0102'
  }
];

class TriageManagementService {
  private static instance: TriageManagementService;
  private patients: Map<string, Patient> = new Map();
  private assessments: Map<string, TriageAssessment> = new Map();
  private stations: Map<string, TriageStation> = new Map();
  private treatmentAreas: Map<string, TreatmentArea> = new Map();
  private transportRequests: Map<string, TransportRequest> = new Map();
  private incidents: Map<string, MassCasualtyIncident> = new Map();
  private facilities: Map<string, ReceivingFacility> = new Map();
  private triageCounter: number = 0;

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): TriageManagementService {
    if (!TriageManagementService.instance) {
      TriageManagementService.instance = new TriageManagementService();
    }
    return TriageManagementService.instance;
  }

  private initializeSampleData(): void {
    samplePatients.forEach(p => this.patients.set(p.id, p));
    sampleFacilities.forEach(f => this.facilities.set(f.id, f));
  }

  // ==================== Patient Management ====================

  async registerPatient(params: {
    incidentId: string;
    location: TriageAssessment['location'];
    demographicsKnown?: boolean;
    name?: string;
    age?: number;
    gender?: Patient['gender'];
    ageGroup?: AgeGroup;
  }): Promise<Patient> {
    this.triageCounter++;
    const triageNumber = `T-${String(this.triageCounter).padStart(4, '0')}`;

    const patient: Patient = {
      id: `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      triageNumber,
      demographicsKnown: params.demographicsKnown || false,
      name: params.name,
      age: params.age,
      ageGroup: params.ageGroup || this.determineAgeGroup(params.age),
      gender: params.gender || 'unknown',
      assessmentHistory: [],
      status: 'on_scene',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.patients.set(patient.id, patient);

    // Update incident casualty count
    const incident = this.incidents.get(params.incidentId);
    if (incident) {
      incident.confirmedCasualties++;
    }

    return patient;
  }

  private determineAgeGroup(age?: number): AgeGroup {
    if (!age) return 'adult';
    if (age < 1) return 'infant';
    if (age < 8) return 'child';
    if (age >= 65) return 'elderly';
    return 'adult';
  }

  async getPatient(patientId: string): Promise<Patient | null> {
    return this.patients.get(patientId) || null;
  }

  async getPatientByTriageNumber(triageNumber: string): Promise<Patient | null> {
    return Array.from(this.patients.values())
      .find(p => p.triageNumber === triageNumber) || null;
  }

  async updatePatientStatus(patientId: string, status: Patient['status']): Promise<Patient> {
    const patient = this.patients.get(patientId);
    if (!patient) throw new Error(`Patient not found: ${patientId}`);

    patient.status = status;
    patient.updatedAt = new Date();

    return patient;
  }

  // ==================== Triage Assessment ====================

  async performTriageAssessment(params: {
    patientId: string;
    incidentId: string;
    protocol: TriageProtocol;
    assessor: TriageAssessment['assessor'];
    location: TriageAssessment['location'];
    vitals?: VitalSigns;
    injuries?: Injury[];
    notes?: string;
  }): Promise<TriageAssessment> {
    const patient = this.patients.get(params.patientId);
    if (!patient) throw new Error(`Patient not found: ${params.patientId}`);

    // Determine triage category based on protocol
    const category = this.calculateTriageCategory(
      params.protocol,
      params.vitals,
      patient.ageGroup
    );

    const assessment: TriageAssessment = {
      id: `assess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      patientId: params.patientId,
      incidentId: params.incidentId,
      protocol: params.protocol,
      category,
      colorCode: TRIAGE_COLORS[category],
      priority: this.getCategoryPriority(category),
      assessor: params.assessor,
      location: params.location,
      vitals: params.vitals,
      injuries: params.injuries || [],
      interventions: [],
      tags: [{
        id: `tag-${Date.now()}`,
        number: patient.triageNumber,
        category,
        attachedAt: new Date(),
        attachedBy: params.assessor.name
      }],
      transportPriority: this.determineTransportPriority(category),
      status: 'completed',
      assessedAt: new Date(),
      notes: params.notes || ''
    };

    this.assessments.set(assessment.id, assessment);

    // Update patient
    patient.currentAssessment = assessment;
    patient.assessmentHistory.push(assessment.id);
    patient.updatedAt = new Date();

    return assessment;
  }

  private calculateTriageCategory(
    protocol: TriageProtocol,
    vitals?: VitalSigns,
    ageGroup?: AgeGroup
  ): TriageCategory {
    if (!vitals) return 'minor';

    switch (protocol) {
      case 'START':
        return this.startTriage(vitals);
      case 'JumpSTART':
        return this.jumpStartTriage(vitals);
      case 'SALT':
        return this.saltTriage(vitals);
      default:
        return this.startTriage(vitals);
    }
  }

  private startTriage(vitals: VitalSigns): TriageCategory {
    // START Protocol for adults
    // Can they walk? -> Minor (Green)
    if (vitals.walking) return 'minor';

    // Are they breathing?
    if (!vitals.respiratoryRate || vitals.respiratoryRate === 0) {
      // Open airway - still not breathing?
      return 'deceased';
    }

    // Respiratory rate > 30?
    if (vitals.respiratoryRate > 30) return 'immediate';

    // Capillary refill > 2 seconds or no radial pulse?
    if (vitals.capillaryRefill && vitals.capillaryRefill > 2) return 'immediate';
    if (vitals.pulse === 0) return 'immediate';

    // Mental status - follows commands?
    if (vitals.consciousness === 'unresponsive' || vitals.consciousness === 'pain') {
      return 'immediate';
    }

    return 'delayed';
  }

  private jumpStartTriage(vitals: VitalSigns): TriageCategory {
    // JumpSTART Protocol for pediatric patients
    if (vitals.walking) return 'minor';

    if (!vitals.respiratoryRate || vitals.respiratoryRate === 0) {
      // Check for pulse
      if (!vitals.pulse || vitals.pulse === 0) return 'deceased';
      // Give 5 rescue breaths, check for breathing
      return 'immediate';
    }

    if (vitals.respiratoryRate < 15 || vitals.respiratoryRate > 45) {
      return 'immediate';
    }

    if (vitals.pulse === 0) return 'immediate';

    if (vitals.consciousness === 'unresponsive') return 'immediate';

    return 'delayed';
  }

  private saltTriage(vitals: VitalSigns): TriageCategory {
    // SALT Protocol (Sort, Assess, Lifesaving Interventions, Treatment/Transport)
    if (vitals.walking) return 'minor';

    // Wave/purposeful movement?
    if (vitals.consciousness === 'alert' || vitals.consciousness === 'verbal') {
      // Assess breathing
      if (vitals.respiratoryRate && vitals.respiratoryRate > 0) {
        // Check for major hemorrhage, pulse
        if (!vitals.pulse || vitals.pulse === 0) return 'immediate';
        return 'delayed';
      }
    }

    // Still/obvious life threat?
    if (!vitals.respiratoryRate || vitals.respiratoryRate === 0) {
      // Open airway
      return 'expectant';
    }

    return 'immediate';
  }

  private getCategoryPriority(category: TriageCategory): number {
    const priorities: Record<TriageCategory, number> = {
      immediate: 1,
      delayed: 2,
      minor: 3,
      expectant: 4,
      deceased: 5
    };
    return priorities[category];
  }

  private determineTransportPriority(category: TriageCategory): TransportPriority {
    const transportMap: Record<TriageCategory, TransportPriority> = {
      immediate: 'immediate',
      delayed: 'delayed',
      minor: 'delayed',
      expectant: 'none',
      deceased: 'none'
    };
    return transportMap[category];
  }

  async reassessPatient(assessmentId: string, params: {
    assessor: TriageAssessment['assessor'];
    vitals?: VitalSigns;
    notes?: string;
  }): Promise<TriageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    const newVitals = params.vitals || assessment.vitals;
    const newCategory = newVitals 
      ? this.calculateTriageCategory(assessment.protocol, newVitals)
      : assessment.category;

    assessment.category = newCategory;
    assessment.colorCode = TRIAGE_COLORS[newCategory];
    assessment.priority = this.getCategoryPriority(newCategory);
    assessment.transportPriority = this.determineTransportPriority(newCategory);
    assessment.vitals = newVitals;
    assessment.reassessedAt = new Date();
    assessment.status = 'reassessed';
    
    if (params.notes) {
      assessment.notes += `\n[Reassessment ${new Date().toISOString()}]: ${params.notes}`;
    }

    // Add new tag if category changed
    if (newCategory !== assessment.category) {
      assessment.tags.push({
        id: `tag-${Date.now()}`,
        number: assessment.tags[0].number,
        category: newCategory,
        attachedAt: new Date(),
        attachedBy: params.assessor.name
      });
    }

    return assessment;
  }

  async recordIntervention(assessmentId: string, intervention: Omit<Intervention, 'id'>): Promise<TriageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    assessment.interventions.push({
      ...intervention,
      id: `int-${Date.now()}`
    });

    return assessment;
  }

  // ==================== Triage Station Management ====================

  async createTriageStation(params: {
    name: string;
    incidentId: string;
    location: TriageStation['location'];
    type: TriageStation['type'];
    capacity: number;
  }): Promise<TriageStation> {
    const station: TriageStation = {
      id: `station-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      incidentId: params.incidentId,
      location: params.location,
      type: params.type,
      capacity: params.capacity,
      currentPatients: 0,
      staff: [],
      supplies: this.getDefaultSupplies(),
      status: 'setup',
      createdAt: new Date()
    };

    this.stations.set(station.id, station);

    // Create treatment areas for treatment stations
    if (params.type === 'treatment') {
      await this.createTreatmentAreas(station.id);
    }

    // Link to incident
    const incident = this.incidents.get(params.incidentId);
    if (incident) {
      incident.triageStations.push(station.id);
    }

    return station;
  }

  private getDefaultSupplies(): StationSupply[] {
    return [
      { name: 'Triage Tags', quantity: 100, unit: 'tags', reorderLevel: 20 },
      { name: 'Bandages', quantity: 50, unit: 'boxes', reorderLevel: 10 },
      { name: 'Tourniquets', quantity: 20, unit: 'units', reorderLevel: 5 },
      { name: 'Cervical Collars', quantity: 15, unit: 'units', reorderLevel: 5 },
      { name: 'Backboards', quantity: 10, unit: 'units', reorderLevel: 3 },
      { name: 'Oxygen Tanks', quantity: 10, unit: 'tanks', reorderLevel: 3 },
      { name: 'IV Supplies', quantity: 30, unit: 'kits', reorderLevel: 10 }
    ];
  }

  private async createTreatmentAreas(stationId: string): Promise<void> {
    const categories: TriageCategory[] = ['immediate', 'delayed', 'minor', 'expectant'];
    const capacities: Record<TriageCategory, number> = {
      immediate: 10,
      delayed: 20,
      minor: 30,
      expectant: 5,
      deceased: 10
    };

    for (const category of categories) {
      const area: TreatmentArea = {
        id: `area-${stationId}-${category}`,
        stationId,
        category,
        capacity: capacities[category],
        currentPatients: 0,
        patients: [],
        location: `${category.toUpperCase()} Treatment Area`
      };
      this.treatmentAreas.set(area.id, area);
    }
  }

  async assignStaffToStation(stationId: string, staff: Omit<StationStaff, 'assignedAt'>): Promise<TriageStation> {
    const station = this.stations.get(stationId);
    if (!station) throw new Error(`Station not found: ${stationId}`);

    station.staff.push({
      ...staff,
      assignedAt: new Date()
    });

    if (station.status === 'setup') {
      station.status = 'operational';
    }

    return station;
  }

  async updateStationStatus(stationId: string, status: TriageStation['status']): Promise<TriageStation> {
    const station = this.stations.get(stationId);
    if (!station) throw new Error(`Station not found: ${stationId}`);

    station.status = status;
    return station;
  }

  // ==================== Transport Management ====================

  async requestTransport(params: {
    patientId: string;
    assessmentId: string;
    destination: string;
    specialRequirements?: string[];
    requestedBy: string;
  }): Promise<TransportRequest> {
    const assessment = this.assessments.get(params.assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${params.assessmentId}`);

    const request: TransportRequest = {
      id: `transport-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      patientId: params.patientId,
      assessmentId: params.assessmentId,
      priority: assessment.transportPriority,
      requestedBy: params.requestedBy,
      requestedAt: new Date(),
      destination: params.destination,
      specialRequirements: params.specialRequirements || [],
      status: 'requested'
    };

    this.transportRequests.set(request.id, request);

    return request;
  }

  async assignTransportUnit(requestId: string, unitId: string): Promise<TransportRequest> {
    const request = this.transportRequests.get(requestId);
    if (!request) throw new Error(`Transport request not found: ${requestId}`);

    request.assignedUnit = unitId;
    request.status = 'assigned';

    return request;
  }

  async updateTransportStatus(requestId: string, status: TransportRequest['status'], timestamp?: Date): Promise<TransportRequest> {
    const request = this.transportRequests.get(requestId);
    if (!request) throw new Error(`Transport request not found: ${requestId}`);

    request.status = status;

    if (status === 'enroute') {
      request.departureTime = timestamp || new Date();
      // Update patient status
      const patient = this.patients.get(request.patientId);
      if (patient) {
        patient.status = 'in_transport';
        patient.updatedAt = new Date();
      }
    }

    if (status === 'delivered') {
      request.arrivalTime = timestamp || new Date();
      // Update patient status
      const patient = this.patients.get(request.patientId);
      if (patient) {
        patient.status = 'at_facility';
        patient.updatedAt = new Date();
      }
    }

    return request;
  }

  async getTransportQueue(incidentId: string): Promise<TransportRequest[]> {
    const incidentAssessments = Array.from(this.assessments.values())
      .filter(a => a.incidentId === incidentId)
      .map(a => a.id);

    return Array.from(this.transportRequests.values())
      .filter(r => incidentAssessments.includes(r.assessmentId) && r.status !== 'delivered' && r.status !== 'cancelled')
      .sort((a, b) => {
        const priorityOrder = { immediate: 0, urgent: 1, delayed: 2, none: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.requestedAt.getTime() - b.requestedAt.getTime();
      });
  }

  // ==================== MCI Management ====================

  async initiateMCI(params: {
    name: string;
    type: string;
    location: MassCasualtyIncident['location'];
    estimatedCasualties: number;
  }): Promise<MassCasualtyIncident> {
    const incident: MassCasualtyIncident = {
      id: `mci-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      location: params.location,
      estimatedCasualties: params.estimatedCasualties,
      confirmedCasualties: 0,
      triageStations: [],
      transportUnits: [],
      receivingFacilities: Array.from(this.facilities.values()),
      commandStructure: {},
      status: 'active',
      startedAt: new Date()
    };

    this.incidents.set(incident.id, incident);
    this.triageCounter = 0;

    return incident;
  }

  async getMCI(incidentId: string): Promise<MassCasualtyIncident | null> {
    return this.incidents.get(incidentId) || null;
  }

  async closeMCI(incidentId: string): Promise<MassCasualtyIncident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`MCI not found: ${incidentId}`);

    incident.status = 'closed';
    incident.closedAt = new Date();

    // Close all triage stations
    for (const stationId of incident.triageStations) {
      const station = this.stations.get(stationId);
      if (station) {
        station.status = 'closed';
      }
    }

    return incident;
  }

  // ==================== Facility Management ====================

  async updateFacilityCapacity(facilityId: string, category: TriageCategory, change: number): Promise<ReceivingFacility> {
    const facility = this.facilities.get(facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    if (category === 'immediate' || category === 'delayed' || category === 'minor') {
      facility.currentLoad[category] += change;
    }

    // Auto-update divert status
    const totalCapacity = facility.capacity.immediate + facility.capacity.delayed + facility.capacity.minor;
    const totalLoad = facility.currentLoad.immediate + facility.currentLoad.delayed + facility.currentLoad.minor;
    const utilizationRate = totalLoad / totalCapacity;

    if (utilizationRate >= 0.95) {
      facility.divertStatus = 'divert';
    } else if (utilizationRate >= 0.8) {
      facility.divertStatus = 'limited';
    } else {
      facility.divertStatus = 'open';
    }

    return facility;
  }

  async getAvailableFacilities(category: TriageCategory, specialties?: string[]): Promise<ReceivingFacility[]> {
    return Array.from(this.facilities.values())
      .filter(f => {
        if (f.divertStatus === 'divert') return false;
        
        // Check capacity
        if (category === 'immediate' || category === 'delayed' || category === 'minor') {
          if (f.currentLoad[category] >= f.capacity[category]) return false;
        }

        // Check specialties
        if (specialties && specialties.length > 0) {
          const hasSpecialty = specialties.some(s => 
            f.specialties.map(fs => fs.toLowerCase()).includes(s.toLowerCase())
          );
          if (!hasSpecialty) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Prioritize trauma centers for immediate patients
        if (category === 'immediate') {
          const aScore = a.traumaLevel || 5;
          const bScore = b.traumaLevel || 5;
          if (aScore !== bScore) return aScore - bScore;
        }
        return a.eta - b.eta;
      });
  }

  async recommendDestination(assessmentId: string): Promise<ReceivingFacility | null> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    // Determine required specialties based on injuries
    const requiredSpecialties: string[] = [];
    for (const injury of assessment.injuries) {
      if (injury.type === 'burn' && injury.severity === 'critical') {
        requiredSpecialties.push('burn');
      }
      if (injury.type === 'neurological') {
        requiredSpecialties.push('neuro');
      }
      if (injury.type === 'cardiac') {
        requiredSpecialties.push('cardiac');
      }
    }

    // Get patient age group for pediatric consideration
    const patient = this.patients.get(assessment.patientId);
    if (patient && (patient.ageGroup === 'infant' || patient.ageGroup === 'child')) {
      const pediatricFacility = Array.from(this.facilities.values())
        .find(f => f.type === 'pediatric' && f.divertStatus !== 'divert');
      if (pediatricFacility) return pediatricFacility;
    }

    const available = await this.getAvailableFacilities(assessment.category, requiredSpecialties);
    return available.length > 0 ? available[0] : null;
  }

  // ==================== Statistics ====================

  async getIncidentStatistics(incidentId: string): Promise<TriageStatistics> {
    const incidentAssessments = Array.from(this.assessments.values())
      .filter(a => a.incidentId === incidentId);

    const byCategory: Record<TriageCategory, number> = {
      immediate: 0,
      delayed: 0,
      minor: 0,
      expectant: 0,
      deceased: 0
    };

    const byStatus: Record<string, number> = {
      on_scene: 0,
      in_transport: 0,
      at_facility: 0,
      discharged: 0,
      deceased: 0
    };

    let totalTriageTime = 0;
    let assessmentCount = 0;

    for (const assessment of incidentAssessments) {
      byCategory[assessment.category]++;
      
      const patient = this.patients.get(assessment.patientId);
      if (patient) {
        byStatus[patient.status]++;
      }

      // Calculate triage time (assume 2 minutes average for demo)
      totalTriageTime += 120;
      assessmentCount++;
    }

    const transportedCount = Array.from(this.transportRequests.values())
      .filter(r => {
        const assessment = this.assessments.get(r.assessmentId);
        return assessment?.incidentId === incidentId && r.status === 'delivered';
      }).length;

    return {
      totalPatients: incidentAssessments.length,
      byCategory,
      byStatus,
      averageTriageTime: assessmentCount > 0 ? totalTriageTime / assessmentCount : 0,
      transportedCount,
      onSceneCount: byStatus.on_scene
    };
  }

  async getPatientsByCategory(incidentId: string, category: TriageCategory): Promise<Patient[]> {
    const assessments = Array.from(this.assessments.values())
      .filter(a => a.incidentId === incidentId && a.category === category);

    return assessments
      .map(a => this.patients.get(a.patientId))
      .filter((p): p is Patient => p !== undefined);
  }

  // ==================== Utility Methods ====================

  generateTriageReport(incidentId: string): string {
    const incident = this.incidents.get(incidentId);
    if (!incident) return 'Incident not found';

    const assessments = Array.from(this.assessments.values())
      .filter(a => a.incidentId === incidentId);

    const stats = {
      immediate: assessments.filter(a => a.category === 'immediate').length,
      delayed: assessments.filter(a => a.category === 'delayed').length,
      minor: assessments.filter(a => a.category === 'minor').length,
      expectant: assessments.filter(a => a.category === 'expectant').length,
      deceased: assessments.filter(a => a.category === 'deceased').length
    };

    return `
TRIAGE REPORT - ${incident.name}
================================
Date/Time: ${new Date().toISOString()}
Location: ${incident.location.address}
Incident Type: ${incident.type}

CASUALTY SUMMARY
----------------
Estimated: ${incident.estimatedCasualties}
Confirmed: ${incident.confirmedCasualties}

BY TRIAGE CATEGORY
------------------
IMMEDIATE (Red):   ${stats.immediate}
DELAYED (Yellow):  ${stats.delayed}
MINOR (Green):     ${stats.minor}
EXPECTANT (Gray):  ${stats.expectant}
DECEASED (Black):  ${stats.deceased}

TOTAL TRIAGED: ${assessments.length}

RECEIVING FACILITIES STATUS
---------------------------
${Array.from(this.facilities.values()).map(f => 
  `${f.name}: ${f.divertStatus.toUpperCase()} (${f.currentLoad.immediate}/${f.capacity.immediate} Immediate)`
).join('\n')}
    `.trim();
  }
}

export const triageManagementService = TriageManagementService.getInstance();
export default TriageManagementService;

/**
 * Personnel Deployment Service - Issue #168 Implementation
 * 
 * Provides comprehensive personnel management for disaster response
 * including staff deployment, shift scheduling, qualification tracking,
 * availability management, and workforce analytics.
 */

// Type definitions
type PersonnelType = 'employee' | 'volunteer' | 'contractor' | 'mutual_aid' | 'reservist';
type DeploymentStatus = 'available' | 'assigned' | 'deployed' | 'in_transit' | 'on_scene' | 'returning' | 'off_duty' | 'unavailable';
type ShiftType = 'day' | 'night' | 'swing' | 'extended' | 'split';
type QualificationStatus = 'active' | 'expired' | 'pending' | 'revoked';
type RequestStatus = 'submitted' | 'reviewing' | 'approved' | 'assigned' | 'deployed' | 'completed' | 'denied' | 'cancelled';

// Personnel interfaces
interface Personnel {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  type: PersonnelType;
  status: DeploymentStatus;
  organization: OrganizationInfo;
  contact: ContactInfo;
  emergency: EmergencyContactInfo;
  position: PositionInfo;
  qualifications: Qualification[];
  certifications: Certification[];
  training: TrainingRecord[];
  physicalRequirements: PhysicalRequirements;
  availability: AvailabilityInfo;
  deploymentHistory: DeploymentHistoryEntry[];
  currentDeployment?: string;
  preferences: DeploymentPreferences;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrganizationInfo {
  name: string;
  department: string;
  division?: string;
  unit?: string;
  supervisor: string;
  supervisorPhone: string;
}

interface ContactInfo {
  phone: string;
  altPhone?: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  radio?: string;
}

interface EmergencyContactInfo {
  name: string;
  relationship: string;
  phone: string;
  altPhone?: string;
  email?: string;
}

interface PositionInfo {
  title: string;
  classification: string;
  payGrade?: string;
  icsPosition?: string;
  specialties: string[];
  languages: { language: string; proficiency: 'basic' | 'intermediate' | 'fluent' | 'native' }[];
}

interface Qualification {
  id: string;
  name: string;
  category: string;
  level: string;
  issuedBy: string;
  issueDate: Date;
  expirationDate?: Date;
  status: QualificationStatus;
  requirements?: string[];
  verifiedBy?: string;
  verificationDate?: Date;
}

interface Certification {
  id: string;
  name: string;
  type: string;
  issuedBy: string;
  issueDate: Date;
  expirationDate: Date;
  certificateNumber?: string;
  status: QualificationStatus;
  renewalRequirements?: string;
}

interface TrainingRecord {
  id: string;
  courseName: string;
  courseCode?: string;
  provider: string;
  completedDate: Date;
  expirationDate?: Date;
  hours: number;
  score?: number;
  certificateUrl?: string;
}

interface PhysicalRequirements {
  medicalClearance: boolean;
  medicalClearanceDate?: Date;
  medicalExpirationDate?: Date;
  physicalFitness?: string;
  restrictions?: string[];
  accommodations?: string[];
}

interface AvailabilityInfo {
  generalAvailability: 'full_time' | 'part_time' | 'on_call' | 'limited';
  schedule: WeeklySchedule;
  exceptions: AvailabilityException[];
  preferredShift?: ShiftType;
  maxConsecutiveDays?: number;
  travelWilling: boolean;
  travelRadius?: number;
  overnightWilling: boolean;
}

interface WeeklySchedule {
  monday: { available: boolean; hours?: { start: string; end: string } };
  tuesday: { available: boolean; hours?: { start: string; end: string } };
  wednesday: { available: boolean; hours?: { start: string; end: string } };
  thursday: { available: boolean; hours?: { start: string; end: string } };
  friday: { available: boolean; hours?: { start: string; end: string } };
  saturday: { available: boolean; hours?: { start: string; end: string } };
  sunday: { available: boolean; hours?: { start: string; end: string } };
}

interface AvailabilityException {
  id: string;
  type: 'vacation' | 'sick' | 'training' | 'personal' | 'deployment' | 'other';
  startDate: Date;
  endDate: Date;
  reason?: string;
  approved: boolean;
}

interface DeploymentHistoryEntry {
  deploymentId: string;
  incidentName: string;
  role: string;
  location: string;
  startDate: Date;
  endDate: Date;
  hoursWorked: number;
  performance?: string;
  notes?: string;
}

interface DeploymentPreferences {
  preferredRoles: string[];
  preferredLocations: string[];
  avoidLocations?: string[];
  specialSkills?: string[];
  equipmentCertified?: string[];
  teamPreferences?: string[];
}

// Personnel deployment interfaces
interface PersonnelDeployment {
  id: string;
  incidentId: string;
  incidentName: string;
  personnelId: string;
  personnelName: string;
  status: DeploymentStatus;
  role: string;
  icsPosition?: string;
  reportingTo: string;
  location: DeploymentLocation;
  schedule: DeploymentSchedule;
  assignment: AssignmentDetails;
  lodging?: LodgingInfo;
  travel?: TravelInfo;
  timekeeping: TimekeepingInfo;
  equipment: string[];
  communications: DeploymentCommunications;
  notes: DeploymentNote[];
  createdAt: Date;
  updatedAt: Date;
}

interface DeploymentLocation {
  name: string;
  address: string;
  coordinates?: [number, number];
  facility?: string;
  reportingLocation?: string;
}

interface DeploymentSchedule {
  requestedStart: Date;
  requestedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  shifts: ScheduledShift[];
  extensions: { requestDate: Date; newEndDate: Date; approved: boolean; reason: string }[];
}

interface ScheduledShift {
  date: Date;
  type: ShiftType;
  startTime: string;
  endTime: string;
  hoursScheduled: number;
  location?: string;
  supervisor?: string;
}

interface AssignmentDetails {
  taskForce?: string;
  team?: string;
  division?: string;
  branch?: string;
  responsibilities: string[];
  specialInstructions?: string[];
  safetyBriefingCompleted: boolean;
  safetyBriefingDate?: Date;
}

interface LodgingInfo {
  type: 'hotel' | 'dormitory' | 'camp' | 'home' | 'other';
  name?: string;
  address?: string;
  phone?: string;
  checkIn?: Date;
  checkOut?: Date;
  confirmationNumber?: string;
  dailyRate?: number;
}

interface TravelInfo {
  mode: 'personal_vehicle' | 'rental' | 'agency_vehicle' | 'air' | 'bus' | 'other';
  departureLocation: string;
  departureDate: Date;
  returnDate?: Date;
  mileage?: number;
  flightInfo?: { airline: string; flightNumber: string; confirmation: string };
  estimatedCost: number;
  actualCost?: number;
}

interface TimekeepingInfo {
  totalHoursWorked: number;
  regularHours: number;
  overtimeHours: number;
  holidayHours: number;
  travelHours: number;
  timeEntries: TimeEntry[];
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

interface TimeEntry {
  date: Date;
  startTime: string;
  endTime: string;
  hours: number;
  type: 'regular' | 'overtime' | 'travel' | 'standby' | 'holiday';
  activity: string;
  location?: string;
  verified: boolean;
}

interface DeploymentCommunications {
  primaryPhone: string;
  radioCallSign?: string;
  radioChannel?: string;
  email: string;
  emergencyContact: string;
  checkInSchedule?: string;
  lastCheckIn?: Date;
}

interface DeploymentNote {
  timestamp: Date;
  author: string;
  content: string;
  type: 'info' | 'issue' | 'commendation' | 'safety';
}

// Personnel request interfaces
interface PersonnelRequest {
  id: string;
  requestNumber: string;
  incidentId: string;
  incidentName: string;
  status: RequestStatus;
  requestedBy: RequestorInfo;
  requestDate: Date;
  neededBy: Date;
  duration: string;
  positions: RequestedPosition[];
  location: RequestLocation;
  workConditions: WorkConditions;
  approvals: RequestApproval[];
  fulfillment: FulfillmentStatus;
  costs: RequestCosts;
  notes: RequestNote[];
  createdAt: Date;
  updatedAt: Date;
}

interface RequestorInfo {
  name: string;
  title: string;
  organization: string;
  phone: string;
  email: string;
}

interface RequestedPosition {
  id: string;
  title: string;
  icsPosition?: string;
  quantity: number;
  filled: number;
  qualificationsRequired: string[];
  certificationsRequired: string[];
  preferredQualifications?: string[];
  description: string;
  assignedPersonnel: string[];
}

interface RequestLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  coordinates?: [number, number];
  reportingInstructions?: string;
}

interface WorkConditions {
  shiftLength: string;
  shiftType: ShiftType;
  lodgingProvided: boolean;
  mealsProvided: boolean;
  hazards: string[];
  ppeRequired: string[];
  physicalRequirements: string[];
}

interface RequestApproval {
  level: string;
  approver: string;
  status: 'pending' | 'approved' | 'denied' | 'modified';
  date?: Date;
  comments?: string;
}

interface FulfillmentStatus {
  totalRequested: number;
  totalFilled: number;
  percentFilled: number;
  sources: { source: string; count: number }[];
  gaps: { position: string; shortage: number }[];
}

interface RequestCosts {
  estimatedLabor: number;
  estimatedTravel: number;
  estimatedLodging: number;
  estimatedPerDiem: number;
  estimatedTotal: number;
  actualTotal?: number;
}

interface RequestNote {
  timestamp: Date;
  author: string;
  content: string;
}

// Shift schedule interfaces
interface ShiftSchedule {
  id: string;
  incidentId: string;
  incidentName: string;
  name: string;
  effectiveDate: Date;
  endDate?: Date;
  status: 'draft' | 'published' | 'active' | 'archived';
  shifts: ShiftDefinition[];
  assignments: ShiftAssignment[];
  coverage: CoverageAnalysis;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ShiftDefinition {
  id: string;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  duration: number;
  positions: { title: string; minimumStaff: number; optimalStaff: number }[];
  breakSchedule?: { breakNumber: number; duration: number; timing: string }[];
}

interface ShiftAssignment {
  id: string;
  shiftId: string;
  date: Date;
  personnelId: string;
  personnelName: string;
  position: string;
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'completed' | 'no_show' | 'cancelled';
  checkInTime?: Date;
  checkOutTime?: Date;
  hoursWorked?: number;
  notes?: string;
}

interface CoverageAnalysis {
  totalShifts: number;
  filledShifts: number;
  openShifts: number;
  coveragePercent: number;
  byPosition: { position: string; required: number; filled: number }[];
  byDay: { date: Date; required: number; filled: number }[];
  gaps: { date: Date; shift: string; position: string; shortage: number }[];
}

// Roster interfaces
interface Roster {
  id: string;
  name: string;
  type: 'incident' | 'unit' | 'team' | 'standby' | 'training';
  incidentId?: string;
  status: 'draft' | 'active' | 'archived';
  effectiveDate: Date;
  personnel: RosterEntry[];
  positions: RosterPosition[];
  statistics: RosterStatistics;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RosterEntry {
  personnelId: string;
  name: string;
  position: string;
  icsPosition?: string;
  organization: string;
  contact: string;
  status: DeploymentStatus;
  assignedDate: Date;
  notes?: string;
}

interface RosterPosition {
  title: string;
  icsPosition?: string;
  required: number;
  assigned: number;
  status: 'filled' | 'partial' | 'unfilled';
}

interface RosterStatistics {
  totalPositions: number;
  filledPositions: number;
  totalPersonnel: number;
  byOrganization: { organization: string; count: number }[];
  byType: { type: PersonnelType; count: number }[];
  qualificationGaps: string[];
}

// Sample data
const samplePersonnel: Personnel[] = [
  {
    id: 'pers-001',
    employeeId: 'EMP-2024-001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    type: 'employee',
    status: 'available',
    organization: {
      name: 'County Emergency Management',
      department: 'Emergency Services',
      division: 'Response',
      supervisor: 'Chief Martinez',
      supervisorPhone: '555-0100'
    },
    contact: {
      phone: '555-0201',
      email: 'sjohnson@county.gov',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'CA',
        zipCode: '95814'
      },
      radio: 'Response 5'
    },
    emergency: {
      name: 'Michael Johnson',
      relationship: 'Spouse',
      phone: '555-0202'
    },
    position: {
      title: 'Emergency Management Specialist',
      classification: 'Professional',
      payGrade: 'P4',
      icsPosition: 'Operations Section Chief',
      specialties: ['Evacuation Planning', 'Shelter Management'],
      languages: [
        { language: 'English', proficiency: 'native' },
        { language: 'Spanish', proficiency: 'intermediate' }
      ]
    },
    qualifications: [
      {
        id: 'qual-001',
        name: 'ICS-300',
        category: 'Incident Command',
        level: 'Advanced',
        issuedBy: 'FEMA',
        issueDate: new Date('2023-06-15'),
        status: 'active'
      },
      {
        id: 'qual-002',
        name: 'ICS-400',
        category: 'Incident Command',
        level: 'Expert',
        issuedBy: 'FEMA',
        issueDate: new Date('2023-08-20'),
        status: 'active'
      }
    ],
    certifications: [
      {
        id: 'cert-001',
        name: 'Certified Emergency Manager',
        type: 'Professional',
        issuedBy: 'IAEM',
        issueDate: new Date('2022-01-15'),
        expirationDate: new Date('2027-01-15'),
        status: 'active'
      }
    ],
    training: [
      {
        id: 'train-001',
        courseName: 'EOC Operations',
        courseCode: 'G775',
        provider: 'FEMA EMI',
        completedDate: new Date('2023-04-10'),
        hours: 24
      }
    ],
    physicalRequirements: {
      medicalClearance: true,
      medicalClearanceDate: new Date('2024-01-15'),
      medicalExpirationDate: new Date('2025-01-15'),
      physicalFitness: 'Good'
    },
    availability: {
      generalAvailability: 'full_time',
      schedule: {
        monday: { available: true, hours: { start: '08:00', end: '17:00' } },
        tuesday: { available: true, hours: { start: '08:00', end: '17:00' } },
        wednesday: { available: true, hours: { start: '08:00', end: '17:00' } },
        thursday: { available: true, hours: { start: '08:00', end: '17:00' } },
        friday: { available: true, hours: { start: '08:00', end: '17:00' } },
        saturday: { available: false },
        sunday: { available: false }
      },
      exceptions: [],
      preferredShift: 'day',
      maxConsecutiveDays: 14,
      travelWilling: true,
      travelRadius: 200,
      overnightWilling: true
    },
    deploymentHistory: [],
    preferences: {
      preferredRoles: ['Operations Section Chief', 'Planning Section Chief'],
      preferredLocations: ['California', 'Nevada'],
      specialSkills: ['Bilingual', 'GIS'],
      equipmentCertified: ['Mobile Command Vehicle']
    },
    notes: '',
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date()
  }
];

class PersonnelDeploymentService {
  private static instance: PersonnelDeploymentService;
  private personnel: Map<string, Personnel> = new Map();
  private deployments: Map<string, PersonnelDeployment> = new Map();
  private requests: Map<string, PersonnelRequest> = new Map();
  private schedules: Map<string, ShiftSchedule> = new Map();
  private rosters: Map<string, Roster> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): PersonnelDeploymentService {
    if (!PersonnelDeploymentService.instance) {
      PersonnelDeploymentService.instance = new PersonnelDeploymentService();
    }
    return PersonnelDeploymentService.instance;
  }

  private initializeSampleData(): void {
    samplePersonnel.forEach(p => this.personnel.set(p.id, p));
  }

  // ==================== Personnel Management ====================

  async createPersonnel(params: Omit<Personnel, 'id' | 'fullName' | 'deploymentHistory' | 'createdAt' | 'updatedAt'>): Promise<Personnel> {
    const personnel: Personnel = {
      ...params,
      id: `pers-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fullName: `${params.firstName} ${params.lastName}`,
      deploymentHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.personnel.set(personnel.id, personnel);
    return personnel;
  }

  async getPersonnel(personnelId: string): Promise<Personnel | null> {
    return this.personnel.get(personnelId) || null;
  }

  async getPersonnelByEmployeeId(employeeId: string): Promise<Personnel | null> {
    return Array.from(this.personnel.values()).find(p => p.employeeId === employeeId) || null;
  }

  async getAllPersonnel(params?: {
    type?: PersonnelType;
    status?: DeploymentStatus;
    organization?: string;
    qualification?: string;
    certification?: string;
    available?: boolean;
    search?: string;
  }): Promise<Personnel[]> {
    let personnel = Array.from(this.personnel.values());

    if (params?.type) {
      personnel = personnel.filter(p => p.type === params.type);
    }

    if (params?.status) {
      personnel = personnel.filter(p => p.status === params.status);
    }

    if (params?.organization) {
      personnel = personnel.filter(p => p.organization.name.includes(params.organization!));
    }

    if (params?.qualification) {
      personnel = personnel.filter(p => 
        p.qualifications.some(q => q.name.includes(params.qualification!) && q.status === 'active')
      );
    }

    if (params?.certification) {
      personnel = personnel.filter(p =>
        p.certifications.some(c => c.name.includes(params.certification!) && c.status === 'active')
      );
    }

    if (params?.available) {
      personnel = personnel.filter(p => p.status === 'available');
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      personnel = personnel.filter(p =>
        p.fullName.toLowerCase().includes(searchLower) ||
        p.employeeId.toLowerCase().includes(searchLower) ||
        p.position.title.toLowerCase().includes(searchLower)
      );
    }

    return personnel.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  async updatePersonnelStatus(personnelId: string, status: DeploymentStatus): Promise<Personnel> {
    const personnel = this.personnel.get(personnelId);
    if (!personnel) throw new Error(`Personnel not found: ${personnelId}`);

    personnel.status = status;
    personnel.updatedAt = new Date();

    return personnel;
  }

  async addQualification(personnelId: string, qualification: Omit<Qualification, 'id'>): Promise<Personnel> {
    const personnel = this.personnel.get(personnelId);
    if (!personnel) throw new Error(`Personnel not found: ${personnelId}`);

    personnel.qualifications.push({
      ...qualification,
      id: `qual-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    personnel.updatedAt = new Date();

    return personnel;
  }

  async addCertification(personnelId: string, certification: Omit<Certification, 'id'>): Promise<Personnel> {
    const personnel = this.personnel.get(personnelId);
    if (!personnel) throw new Error(`Personnel not found: ${personnelId}`);

    personnel.certifications.push({
      ...certification,
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    personnel.updatedAt = new Date();

    return personnel;
  }

  async addTrainingRecord(personnelId: string, training: Omit<TrainingRecord, 'id'>): Promise<Personnel> {
    const personnel = this.personnel.get(personnelId);
    if (!personnel) throw new Error(`Personnel not found: ${personnelId}`);

    personnel.training.push({
      ...training,
      id: `train-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    personnel.updatedAt = new Date();

    return personnel;
  }

  async addAvailabilityException(personnelId: string, exception: Omit<AvailabilityException, 'id'>): Promise<Personnel> {
    const personnel = this.personnel.get(personnelId);
    if (!personnel) throw new Error(`Personnel not found: ${personnelId}`);

    personnel.availability.exceptions.push({
      ...exception,
      id: `exc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    personnel.updatedAt = new Date();

    return personnel;
  }

  async findAvailablePersonnel(params: {
    neededBy: Date;
    duration: number;
    qualifications?: string[];
    certifications?: string[];
    location?: string;
    count: number;
  }): Promise<Personnel[]> {
    let available = Array.from(this.personnel.values())
      .filter(p => p.status === 'available');

    // Filter by qualifications
    if (params.qualifications && params.qualifications.length > 0) {
      available = available.filter(p =>
        params.qualifications!.every(req =>
          p.qualifications.some(q => q.name.includes(req) && q.status === 'active')
        )
      );
    }

    // Filter by certifications
    if (params.certifications && params.certifications.length > 0) {
      available = available.filter(p =>
        params.certifications!.every(req =>
          p.certifications.some(c => c.name.includes(req) && c.status === 'active')
        )
      );
    }

    // Filter out those with conflicting exceptions
    available = available.filter(p => {
      const endDate = new Date(params.neededBy.getTime() + params.duration * 24 * 60 * 60 * 1000);
      return !p.availability.exceptions.some(exc =>
        exc.approved && 
        exc.startDate <= endDate && 
        exc.endDate >= params.neededBy
      );
    });

    // Sort by deployment history (prefer those with less recent deployments)
    available.sort((a, b) => {
      const aLastDeployment = a.deploymentHistory.length > 0 
        ? new Date(a.deploymentHistory[a.deploymentHistory.length - 1].endDate).getTime() 
        : 0;
      const bLastDeployment = b.deploymentHistory.length > 0 
        ? new Date(b.deploymentHistory[b.deploymentHistory.length - 1].endDate).getTime() 
        : 0;
      return aLastDeployment - bLastDeployment;
    });

    return available.slice(0, params.count);
  }

  // ==================== Deployment Management ====================

  async createDeployment(params: Omit<PersonnelDeployment, 'id' | 'status' | 'timekeeping' | 'notes' | 'createdAt' | 'updatedAt'>): Promise<PersonnelDeployment> {
    const personnel = this.personnel.get(params.personnelId);
    if (!personnel) throw new Error(`Personnel not found: ${params.personnelId}`);

    const deployment: PersonnelDeployment = {
      ...params,
      id: `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'assigned',
      timekeeping: {
        totalHoursWorked: 0,
        regularHours: 0,
        overtimeHours: 0,
        holidayHours: 0,
        travelHours: 0,
        timeEntries: [],
        approved: false
      },
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.deployments.set(deployment.id, deployment);

    // Update personnel
    personnel.status = 'assigned';
    personnel.currentDeployment = deployment.id;
    personnel.updatedAt = new Date();

    return deployment;
  }

  async getDeployment(deploymentId: string): Promise<PersonnelDeployment | null> {
    return this.deployments.get(deploymentId) || null;
  }

  async getDeployments(params?: {
    incidentId?: string;
    personnelId?: string;
    status?: DeploymentStatus;
  }): Promise<PersonnelDeployment[]> {
    let deployments = Array.from(this.deployments.values());

    if (params?.incidentId) {
      deployments = deployments.filter(d => d.incidentId === params.incidentId);
    }

    if (params?.personnelId) {
      deployments = deployments.filter(d => d.personnelId === params.personnelId);
    }

    if (params?.status) {
      deployments = deployments.filter(d => d.status === params.status);
    }

    return deployments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateDeploymentStatus(deploymentId: string, status: DeploymentStatus): Promise<PersonnelDeployment> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error(`Deployment not found: ${deploymentId}`);

    deployment.status = status;

    if (status === 'deployed' && !deployment.schedule.actualStart) {
      deployment.schedule.actualStart = new Date();
    } else if (status === 'off_duty' || status === 'available') {
      deployment.schedule.actualEnd = new Date();

      // Update personnel
      const personnel = this.personnel.get(deployment.personnelId);
      if (personnel) {
        personnel.status = 'available';
        personnel.currentDeployment = undefined;
        personnel.deploymentHistory.push({
          deploymentId: deployment.id,
          incidentName: deployment.incidentName,
          role: deployment.role,
          location: deployment.location.name,
          startDate: deployment.schedule.actualStart || deployment.schedule.requestedStart,
          endDate: new Date(),
          hoursWorked: deployment.timekeeping.totalHoursWorked
        });
        personnel.updatedAt = new Date();
      }
    }

    deployment.updatedAt = new Date();

    // Update personnel status
    const pers = this.personnel.get(deployment.personnelId);
    if (pers) {
      pers.status = status;
      pers.updatedAt = new Date();
    }

    return deployment;
  }

  async recordTimeEntry(deploymentId: string, entry: Omit<TimeEntry, 'verified'>): Promise<PersonnelDeployment> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error(`Deployment not found: ${deploymentId}`);

    deployment.timekeeping.timeEntries.push({
      ...entry,
      verified: false
    });

    // Update totals
    deployment.timekeeping.totalHoursWorked += entry.hours;
    if (entry.type === 'regular') {
      deployment.timekeeping.regularHours += entry.hours;
    } else if (entry.type === 'overtime') {
      deployment.timekeeping.overtimeHours += entry.hours;
    } else if (entry.type === 'travel') {
      deployment.timekeeping.travelHours += entry.hours;
    } else if (entry.type === 'holiday') {
      deployment.timekeeping.holidayHours += entry.hours;
    }

    deployment.updatedAt = new Date();
    return deployment;
  }

  async approveTimekeeping(deploymentId: string, approver: string): Promise<PersonnelDeployment> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error(`Deployment not found: ${deploymentId}`);

    deployment.timekeeping.approved = true;
    deployment.timekeeping.approvedBy = approver;
    deployment.timekeeping.approvalDate = new Date();
    deployment.updatedAt = new Date();

    return deployment;
  }

  async addDeploymentNote(deploymentId: string, note: Omit<DeploymentNote, 'timestamp'>): Promise<PersonnelDeployment> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) throw new Error(`Deployment not found: ${deploymentId}`);

    deployment.notes.push({
      ...note,
      timestamp: new Date()
    });
    deployment.updatedAt = new Date();

    return deployment;
  }

  // ==================== Request Management ====================

  async createRequest(params: Omit<PersonnelRequest, 'id' | 'requestNumber' | 'status' | 'approvals' | 'fulfillment' | 'notes' | 'createdAt' | 'updatedAt'>): Promise<PersonnelRequest> {
    const request: PersonnelRequest = {
      ...params,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requestNumber: `PR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'submitted',
      approvals: [],
      fulfillment: {
        totalRequested: params.positions.reduce((sum, p) => sum + p.quantity, 0),
        totalFilled: 0,
        percentFilled: 0,
        sources: [],
        gaps: []
      },
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.requests.set(request.id, request);
    return request;
  }

  async getRequest(requestId: string): Promise<PersonnelRequest | null> {
    return this.requests.get(requestId) || null;
  }

  async getRequests(params?: {
    incidentId?: string;
    status?: RequestStatus;
  }): Promise<PersonnelRequest[]> {
    let requests = Array.from(this.requests.values());

    if (params?.incidentId) {
      requests = requests.filter(r => r.incidentId === params.incidentId);
    }

    if (params?.status) {
      requests = requests.filter(r => r.status === params.status);
    }

    return requests.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async approveRequest(requestId: string, approval: Omit<RequestApproval, 'date'>): Promise<PersonnelRequest> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    request.approvals.push({
      ...approval,
      date: new Date()
    });

    if (approval.status === 'approved') {
      request.status = 'approved';
    } else if (approval.status === 'denied') {
      request.status = 'denied';
    }

    request.updatedAt = new Date();
    return request;
  }

  async assignPersonnelToRequest(requestId: string, positionId: string, personnelId: string): Promise<PersonnelRequest> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    const position = request.positions.find(p => p.id === positionId);
    if (!position) throw new Error(`Position not found: ${positionId}`);

    position.assignedPersonnel.push(personnelId);
    position.filled++;

    // Update fulfillment
    request.fulfillment.totalFilled = request.positions.reduce((sum, p) => sum + p.filled, 0);
    request.fulfillment.percentFilled = (request.fulfillment.totalFilled / request.fulfillment.totalRequested) * 100;

    if (request.fulfillment.percentFilled >= 100) {
      request.status = 'deployed';
    } else if (request.fulfillment.totalFilled > 0) {
      request.status = 'assigned';
    }

    request.updatedAt = new Date();
    return request;
  }

  // ==================== Schedule Management ====================

  async createShiftSchedule(params: Omit<ShiftSchedule, 'id' | 'status' | 'assignments' | 'coverage' | 'createdAt' | 'updatedAt'>): Promise<ShiftSchedule> {
    const schedule: ShiftSchedule = {
      ...params,
      id: `sched-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      assignments: [],
      coverage: {
        totalShifts: 0,
        filledShifts: 0,
        openShifts: 0,
        coveragePercent: 0,
        byPosition: [],
        byDay: [],
        gaps: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.schedules.set(schedule.id, schedule);
    return schedule;
  }

  async getShiftSchedule(scheduleId: string): Promise<ShiftSchedule | null> {
    return this.schedules.get(scheduleId) || null;
  }

  async addShiftAssignment(scheduleId: string, assignment: Omit<ShiftAssignment, 'id' | 'status'>): Promise<ShiftSchedule> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) throw new Error(`Schedule not found: ${scheduleId}`);

    schedule.assignments.push({
      ...assignment,
      id: `assign-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'scheduled'
    });

    await this.updateScheduleCoverage(scheduleId);
    schedule.updatedAt = new Date();

    return schedule;
  }

  async updateShiftAssignmentStatus(scheduleId: string, assignmentId: string, status: ShiftAssignment['status']): Promise<ShiftSchedule> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) throw new Error(`Schedule not found: ${scheduleId}`);

    const assignment = schedule.assignments.find(a => a.id === assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    assignment.status = status;

    if (status === 'checked_in') {
      assignment.checkInTime = new Date();
    } else if (status === 'completed') {
      assignment.checkOutTime = new Date();
      if (assignment.checkInTime) {
        assignment.hoursWorked = (assignment.checkOutTime.getTime() - assignment.checkInTime.getTime()) / (1000 * 60 * 60);
      }
    }

    schedule.updatedAt = new Date();
    return schedule;
  }

  private async updateScheduleCoverage(scheduleId: string): Promise<void> {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) return;

    schedule.coverage.filledShifts = schedule.assignments.filter(a => 
      ['scheduled', 'confirmed', 'checked_in', 'completed'].includes(a.status)
    ).length;
    schedule.coverage.openShifts = schedule.coverage.totalShifts - schedule.coverage.filledShifts;
    schedule.coverage.coveragePercent = schedule.coverage.totalShifts > 0 
      ? (schedule.coverage.filledShifts / schedule.coverage.totalShifts) * 100 
      : 0;
  }

  // ==================== Roster Management ====================

  async createRoster(params: Omit<Roster, 'id' | 'personnel' | 'statistics' | 'createdAt' | 'updatedAt'>): Promise<Roster> {
    const roster: Roster = {
      ...params,
      id: `roster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      personnel: [],
      statistics: {
        totalPositions: params.positions.reduce((sum, p) => sum + p.required, 0),
        filledPositions: 0,
        totalPersonnel: 0,
        byOrganization: [],
        byType: [],
        qualificationGaps: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.rosters.set(roster.id, roster);
    return roster;
  }

  async getRoster(rosterId: string): Promise<Roster | null> {
    return this.rosters.get(rosterId) || null;
  }

  async addPersonnelToRoster(rosterId: string, entry: Omit<RosterEntry, 'assignedDate'>): Promise<Roster> {
    const roster = this.rosters.get(rosterId);
    if (!roster) throw new Error(`Roster not found: ${rosterId}`);

    roster.personnel.push({
      ...entry,
      assignedDate: new Date()
    });

    // Update position
    const position = roster.positions.find(p => p.title === entry.position);
    if (position) {
      position.assigned++;
      position.status = position.assigned >= position.required ? 'filled' : 
        position.assigned > 0 ? 'partial' : 'unfilled';
    }

    // Update statistics
    roster.statistics.totalPersonnel = roster.personnel.length;
    roster.statistics.filledPositions = roster.positions.filter(p => p.status === 'filled').length;

    roster.updatedAt = new Date();
    return roster;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalPersonnel: number;
    availablePersonnel: number;
    deployedPersonnel: number;
    activeDeployments: number;
    totalRequests: number;
    pendingRequests: number;
    totalHoursWorked: number;
    averageDeploymentDuration: number;
    byType: Record<PersonnelType, number>;
    byStatus: Record<DeploymentStatus, number>;
    qualificationExpiringSoon: number;
    certificationExpiringSoon: number;
    topQualifications: { name: string; count: number }[];
  }> {
    const personnel = Array.from(this.personnel.values());
    const deployments = Array.from(this.deployments.values());
    const requests = Array.from(this.requests.values());

    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const byType: Record<PersonnelType, number> = {} as any;
    const byStatus: Record<DeploymentStatus, number> = {} as any;
    let qualificationExpiringSoon = 0;
    let certificationExpiringSoon = 0;
    const qualificationCounts: Map<string, number> = new Map();

    personnel.forEach(p => {
      byType[p.type] = (byType[p.type] || 0) + 1;
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;

      p.qualifications.forEach(q => {
        if (q.expirationDate && q.expirationDate <= thirtyDaysFromNow && q.status === 'active') {
          qualificationExpiringSoon++;
        }
        qualificationCounts.set(q.name, (qualificationCounts.get(q.name) || 0) + 1);
      });

      p.certifications.forEach(c => {
        if (c.expirationDate <= thirtyDaysFromNow && c.status === 'active') {
          certificationExpiringSoon++;
        }
      });
    });

    let totalHoursWorked = 0;
    let totalDuration = 0;
    let completedDeployments = 0;

    deployments.forEach(d => {
      totalHoursWorked += d.timekeeping.totalHoursWorked;
      if (d.schedule.actualEnd && d.schedule.actualStart) {
        totalDuration += d.schedule.actualEnd.getTime() - d.schedule.actualStart.getTime();
        completedDeployments++;
      }
    });

    const avgDurationDays = completedDeployments > 0 
      ? totalDuration / completedDeployments / (1000 * 60 * 60 * 24) 
      : 0;

    const topQualifications = Array.from(qualificationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      totalPersonnel: personnel.length,
      availablePersonnel: personnel.filter(p => p.status === 'available').length,
      deployedPersonnel: personnel.filter(p => ['deployed', 'on_scene'].includes(p.status)).length,
      activeDeployments: deployments.filter(d => ['assigned', 'deployed', 'in_transit', 'on_scene'].includes(d.status)).length,
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => ['submitted', 'reviewing'].includes(r.status)).length,
      totalHoursWorked,
      averageDeploymentDuration: avgDurationDays,
      byType,
      byStatus,
      qualificationExpiringSoon,
      certificationExpiringSoon,
      topQualifications
    };
  }
}

export const personnelDeploymentService = PersonnelDeploymentService.getInstance();
export default PersonnelDeploymentService;

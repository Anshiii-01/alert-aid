/**
 * Community Leader Service - Issue #154 Implementation
 * 
 * Provides comprehensive community leader coordination for disaster response
 * including leader registration, territory management, communication networks,
 * mobilization tracking, training programs, and community resilience building.
 */

// Type definitions
type LeaderRole = 'neighborhood_captain' | 'block_warden' | 'zone_coordinator' | 'district_lead' | 'regional_director' | 'volunteer_coordinator' | 'religious_leader' | 'civic_leader' | 'business_liaison';
type LeaderStatus = 'pending' | 'active' | 'inactive' | 'on_leave' | 'suspended' | 'emeritus';
type CertificationLevel = 'basic' | 'intermediate' | 'advanced' | 'master' | 'instructor';
type CommunicationMethod = 'phone' | 'sms' | 'email' | 'radio' | 'app' | 'in_person';
type MeetingType = 'regular' | 'emergency' | 'training' | 'planning' | 'debrief' | 'community_event';
type ActivityType = 'patrol' | 'check_in' | 'distribution' | 'evacuation' | 'assessment' | 'training' | 'outreach' | 'meeting' | 'report';

// Leader interfaces
interface CommunityLeader {
  id: string;
  personalInfo: LeaderPersonalInfo;
  role: LeaderRole;
  status: LeaderStatus;
  territory: TerritoryAssignment;
  certifications: LeaderCertification[];
  skills: LeaderSkill[];
  availability: AvailabilitySchedule;
  equipment: AssignedEquipment[];
  contacts: EmergencyContact[];
  subordinates: string[]; // leader IDs
  supervisor?: string; // leader ID
  statistics: LeaderStatistics;
  activityLog: ActivityRecord[];
  notes: LeaderNote[];
  createdAt: Date;
  updatedAt: Date;
}

interface LeaderPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lon: number };
  };
  languages: string[];
  occupation?: string;
  employer?: string;
  yearsInCommunity: number;
  photo?: string;
  backgroundCheckDate?: Date;
  backgroundCheckStatus?: 'pending' | 'cleared' | 'flagged';
}

interface TerritoryAssignment {
  id: string;
  name: string;
  type: 'neighborhood' | 'block' | 'zone' | 'district' | 'region' | 'city';
  boundaries: {
    type: 'polygon';
    coordinates: { lat: number; lon: number }[];
  };
  population: number;
  households: number;
  vulnerablePopulation: number;
  keyLocations: TerritoryLocation[];
  assignedSince: Date;
}

interface TerritoryLocation {
  id: string;
  name: string;
  type: 'shelter' | 'school' | 'hospital' | 'fire_station' | 'police' | 'community_center' | 'church' | 'business' | 'hazard' | 'evacuation_route';
  address: string;
  coordinates: { lat: number; lon: number };
  contactPerson?: string;
  contactPhone?: string;
  notes?: string;
}

interface LeaderCertification {
  id: string;
  name: string;
  type: string;
  level: CertificationLevel;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  certificateNumber?: string;
  verificationUrl?: string;
}

interface LeaderSkill {
  name: string;
  category: 'medical' | 'technical' | 'communication' | 'leadership' | 'logistics' | 'language' | 'specialized';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
  verifiedBy?: string;
}

interface AvailabilitySchedule {
  general: 'full_time' | 'part_time' | 'on_call' | 'emergency_only';
  weekdays: DaySchedule[];
  exceptions: ScheduleException[];
  preferredContactMethod: CommunicationMethod;
  responseTime: number; // minutes
  canTravel: boolean;
  travelRadius: number; // km
  hasVehicle: boolean;
  vehicleCapacity?: number;
}

interface DaySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  available: boolean;
  startTime?: string;
  endTime?: string;
}

interface ScheduleException {
  startDate: Date;
  endDate: Date;
  reason: string;
  available: boolean;
}

interface AssignedEquipment {
  id: string;
  name: string;
  type: 'radio' | 'phone' | 'first_aid' | 'vest' | 'badge' | 'flashlight' | 'megaphone' | 'other';
  serialNumber?: string;
  assignedDate: Date;
  condition: 'new' | 'good' | 'fair' | 'poor';
  lastInspection?: Date;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

interface LeaderStatistics {
  totalActivities: number;
  activitiesByType: Record<ActivityType, number>;
  hoursServed: number;
  householdsReached: number;
  eventsOrganized: number;
  trainingsCompleted: number;
  trainingsLed: number;
  incidentsResponded: number;
  reportsSubmitted: number;
  recognitionsReceived: number;
  currentStreak: number; // days active
  longestStreak: number;
}

interface ActivityRecord {
  id: string;
  type: ActivityType;
  date: Date;
  duration: number; // minutes
  location?: string;
  description: string;
  participants?: number;
  householdsContacted?: number;
  outcome?: string;
  attachments?: string[];
  verifiedBy?: string;
}

interface LeaderNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  isPrivate: boolean;
  category: 'general' | 'performance' | 'concern' | 'commendation' | 'follow_up';
  createdAt: Date;
}

// Meeting interfaces
interface CommunityMeeting {
  id: string;
  title: string;
  type: MeetingType;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  organizer: string;
  territory: string;
  date: Date;
  duration: number; // minutes
  location: {
    name: string;
    address: string;
    coordinates?: { lat: number; lon: number };
    isVirtual: boolean;
    virtualLink?: string;
  };
  agenda: AgendaItem[];
  invitedLeaders: string[];
  attendees: MeetingAttendee[];
  minutes?: MeetingMinutes;
  actionItems: ActionItem[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AgendaItem {
  id: string;
  order: number;
  title: string;
  duration: number; // minutes
  presenter?: string;
  notes?: string;
}

interface MeetingAttendee {
  leaderId: string;
  leaderName: string;
  role: LeaderRole;
  status: 'confirmed' | 'tentative' | 'declined' | 'attended' | 'absent';
  arrivalTime?: Date;
  notes?: string;
}

interface MeetingMinutes {
  recorder: string;
  summary: string;
  keyDecisions: string[];
  discussionPoints: DiscussionPoint[];
  nextMeeting?: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

interface DiscussionPoint {
  topic: string;
  discussedBy: string[];
  summary: string;
  outcome?: string;
}

interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  completedAt?: Date;
  notes?: string;
}

// Communication interfaces
interface CommunityBroadcast {
  id: string;
  type: 'alert' | 'announcement' | 'update' | 'request' | 'reminder';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  message: string;
  sender: string;
  recipients: BroadcastRecipient[];
  channels: CommunicationMethod[];
  territory?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  expiresAt?: Date;
  acknowledgments: { leaderId: string; acknowledgedAt: Date }[];
  attachments?: string[];
}

interface BroadcastRecipient {
  leaderId: string;
  leaderName: string;
  channels: CommunicationMethod[];
  sentVia: CommunicationMethod[];
  deliveredAt?: Date;
  readAt?: Date;
  acknowledged: boolean;
}

// Check-in interfaces
interface WelfareCheckIn {
  id: string;
  leaderId: string;
  territoryId: string;
  checkInType: 'routine' | 'emergency' | 'post_incident' | 'wellness';
  date: Date;
  householdsChecked: number;
  householdsContacted: number;
  issuesReported: CheckInIssue[];
  needsIdentified: IdentifiedNeed[];
  vulnerablePersonsChecked: VulnerablePersonCheck[];
  overallStatus: 'normal' | 'minor_issues' | 'significant_concerns' | 'critical';
  summary: string;
  nextCheckInDue?: Date;
}

interface CheckInIssue {
  id: string;
  household: string;
  category: 'health' | 'safety' | 'utility' | 'property' | 'access' | 'financial' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actionTaken?: string;
  referredTo?: string;
  resolved: boolean;
}

interface IdentifiedNeed {
  id: string;
  household?: string;
  type: 'food' | 'water' | 'medical' | 'shelter' | 'transportation' | 'financial' | 'emotional_support' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  description: string;
  quantity?: number;
  fulfilled: boolean;
  fulfilledBy?: string;
}

interface VulnerablePersonCheck {
  id: string;
  personType: 'elderly' | 'disabled' | 'child_alone' | 'pregnant' | 'chronic_illness' | 'mobility_limited' | 'mental_health';
  address: string;
  status: 'safe' | 'needs_assistance' | 'relocated' | 'unable_to_contact' | 'hospitalized';
  notes: string;
  followUpRequired: boolean;
}

// Training interfaces
interface LeaderTrainingProgram {
  id: string;
  name: string;
  description: string;
  level: CertificationLevel;
  duration: number; // hours
  modules: TrainingModule[];
  prerequisites: string[];
  certification?: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
}

interface TrainingModule {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: number; // minutes
  type: 'lecture' | 'hands_on' | 'simulation' | 'field' | 'assessment';
  materials: string[];
  objectives: string[];
}

interface TrainingSession {
  id: string;
  programId: string;
  programName: string;
  instructor: string;
  date: Date;
  duration: number;
  location: {
    name: string;
    address: string;
    isVirtual: boolean;
    virtualLink?: string;
  };
  maxParticipants: number;
  enrolledParticipants: TrainingParticipant[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  materials: string[];
  feedback?: TrainingFeedback;
}

interface TrainingParticipant {
  leaderId: string;
  leaderName: string;
  enrolledAt: Date;
  attended: boolean;
  score?: number;
  passed?: boolean;
  certificateIssued?: boolean;
  feedback?: string;
}

interface TrainingFeedback {
  averageRating: number;
  totalResponses: number;
  comments: { leaderId: string; rating: number; comment: string }[];
}

// Recognition interfaces
interface LeaderRecognition {
  id: string;
  leaderId: string;
  leaderName: string;
  type: 'certificate' | 'award' | 'commendation' | 'promotion' | 'milestone';
  name: string;
  description: string;
  awardedBy: string;
  awardedAt: Date;
  ceremony?: {
    date: Date;
    location: string;
    attended: boolean;
  };
  publicAnnouncement: boolean;
}

// Sample data
const sampleLeaders: CommunityLeader[] = [
  {
    id: 'leader-001',
    personalInfo: {
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'maria.rodriguez@community.org',
      phone: '555-0101',
      address: {
        street: '456 Oak Street',
        city: 'Metro City',
        state: 'CA',
        zipCode: '90002',
        coordinates: { lat: 34.0522, lon: -118.2437 }
      },
      languages: ['English', 'Spanish'],
      occupation: 'Retired Teacher',
      yearsInCommunity: 25,
      backgroundCheckDate: new Date('2023-06-15'),
      backgroundCheckStatus: 'cleared'
    },
    role: 'neighborhood_captain',
    status: 'active',
    territory: {
      id: 'territory-001',
      name: 'Oakwood Heights',
      type: 'neighborhood',
      boundaries: {
        type: 'polygon',
        coordinates: [
          { lat: 34.05, lon: -118.25 },
          { lat: 34.05, lon: -118.24 },
          { lat: 34.06, lon: -118.24 },
          { lat: 34.06, lon: -118.25 }
        ]
      },
      population: 3500,
      households: 1200,
      vulnerablePopulation: 450,
      keyLocations: [
        {
          id: 'loc-001',
          name: 'Oakwood Community Center',
          type: 'community_center',
          address: '100 Community Way',
          coordinates: { lat: 34.052, lon: -118.245 },
          contactPerson: 'John Smith',
          contactPhone: '555-0200'
        }
      ],
      assignedSince: new Date('2022-01-15')
    },
    certifications: [
      {
        id: 'cert-001',
        name: 'CERT Basic Training',
        type: 'Emergency Response',
        level: 'intermediate',
        issuedBy: 'FEMA',
        issuedDate: new Date('2022-03-20'),
        expiryDate: new Date('2025-03-20'),
        certificateNumber: 'CERT-2022-12345'
      }
    ],
    skills: [
      { name: 'First Aid', category: 'medical', proficiency: 'advanced', verified: true, verifiedBy: 'Red Cross' },
      { name: 'Spanish Translation', category: 'language', proficiency: 'expert', verified: true }
    ],
    availability: {
      general: 'full_time',
      weekdays: [
        { day: 'monday', available: true, startTime: '08:00', endTime: '18:00' },
        { day: 'tuesday', available: true, startTime: '08:00', endTime: '18:00' },
        { day: 'wednesday', available: true, startTime: '08:00', endTime: '18:00' },
        { day: 'thursday', available: true, startTime: '08:00', endTime: '18:00' },
        { day: 'friday', available: true, startTime: '08:00', endTime: '18:00' },
        { day: 'saturday', available: true, startTime: '09:00', endTime: '14:00' },
        { day: 'sunday', available: false }
      ],
      exceptions: [],
      preferredContactMethod: 'phone',
      responseTime: 15,
      canTravel: true,
      travelRadius: 25,
      hasVehicle: true,
      vehicleCapacity: 5
    },
    equipment: [
      { id: 'equip-001', name: 'Two-Way Radio', type: 'radio', serialNumber: 'RAD-2022-001', assignedDate: new Date('2022-02-01'), condition: 'good', lastInspection: new Date('2024-01-15') },
      { id: 'equip-002', name: 'First Aid Kit', type: 'first_aid', assignedDate: new Date('2022-02-01'), condition: 'good' }
    ],
    contacts: [
      { name: 'Carlos Rodriguez', relationship: 'Spouse', phone: '555-0102', isPrimary: true }
    ],
    subordinates: ['leader-010', 'leader-011', 'leader-012'],
    supervisor: 'leader-002',
    statistics: {
      totalActivities: 245,
      activitiesByType: { patrol: 50, check_in: 100, distribution: 20, evacuation: 5, assessment: 30, training: 15, outreach: 15, meeting: 8, report: 2 },
      hoursServed: 1250,
      householdsReached: 1150,
      eventsOrganized: 12,
      trainingsCompleted: 8,
      trainingsLed: 3,
      incidentsResponded: 15,
      reportsSubmitted: 48,
      recognitionsReceived: 4,
      currentStreak: 45,
      longestStreak: 120
    },
    activityLog: [],
    notes: [],
    createdAt: new Date('2022-01-10'),
    updatedAt: new Date()
  }
];

const sampleTerritories: TerritoryAssignment[] = [
  {
    id: 'territory-001',
    name: 'Oakwood Heights',
    type: 'neighborhood',
    boundaries: {
      type: 'polygon',
      coordinates: [
        { lat: 34.05, lon: -118.25 },
        { lat: 34.05, lon: -118.24 },
        { lat: 34.06, lon: -118.24 },
        { lat: 34.06, lon: -118.25 }
      ]
    },
    population: 3500,
    households: 1200,
    vulnerablePopulation: 450,
    keyLocations: [],
    assignedSince: new Date('2022-01-15')
  }
];

class CommunityLeaderService {
  private static instance: CommunityLeaderService;
  private leaders: Map<string, CommunityLeader> = new Map();
  private territories: Map<string, TerritoryAssignment> = new Map();
  private meetings: Map<string, CommunityMeeting> = new Map();
  private broadcasts: Map<string, CommunityBroadcast> = new Map();
  private checkIns: Map<string, WelfareCheckIn> = new Map();
  private trainingPrograms: Map<string, LeaderTrainingProgram> = new Map();
  private trainingSessions: Map<string, TrainingSession> = new Map();
  private recognitions: Map<string, LeaderRecognition> = new Map();

  private readonly ROLE_HIERARCHY: LeaderRole[] = [
    'block_warden', 'neighborhood_captain', 'zone_coordinator',
    'district_lead', 'regional_director'
  ];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CommunityLeaderService {
    if (!CommunityLeaderService.instance) {
      CommunityLeaderService.instance = new CommunityLeaderService();
    }
    return CommunityLeaderService.instance;
  }

  private initializeSampleData(): void {
    sampleLeaders.forEach(l => this.leaders.set(l.id, l));
    sampleTerritories.forEach(t => this.territories.set(t.id, t));
  }

  // ==================== Leader Management ====================

  async registerLeader(params: {
    personalInfo: LeaderPersonalInfo;
    role: LeaderRole;
    territoryId?: string;
    skills?: LeaderSkill[];
    availability: Partial<AvailabilitySchedule>;
    contacts: EmergencyContact[];
    supervisorId?: string;
  }): Promise<CommunityLeader> {
    const leader: CommunityLeader = {
      id: `leader-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      personalInfo: {
        ...params.personalInfo,
        backgroundCheckStatus: 'pending'
      },
      role: params.role,
      status: 'pending',
      territory: params.territoryId
        ? this.territories.get(params.territoryId)!
        : {
          id: '', name: 'Unassigned', type: 'neighborhood',
          boundaries: { type: 'polygon', coordinates: [] },
          population: 0, households: 0, vulnerablePopulation: 0,
          keyLocations: [], assignedSince: new Date()
        },
      certifications: [],
      skills: params.skills || [],
      availability: {
        general: params.availability.general || 'on_call',
        weekdays: params.availability.weekdays || [],
        exceptions: [],
        preferredContactMethod: params.availability.preferredContactMethod || 'phone',
        responseTime: params.availability.responseTime || 30,
        canTravel: params.availability.canTravel || false,
        travelRadius: params.availability.travelRadius || 10,
        hasVehicle: params.availability.hasVehicle || false
      },
      equipment: [],
      contacts: params.contacts,
      subordinates: [],
      supervisor: params.supervisorId,
      statistics: {
        totalActivities: 0,
        activitiesByType: {} as any,
        hoursServed: 0,
        householdsReached: 0,
        eventsOrganized: 0,
        trainingsCompleted: 0,
        trainingsLed: 0,
        incidentsResponded: 0,
        reportsSubmitted: 0,
        recognitionsReceived: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      activityLog: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.leaders.set(leader.id, leader);

    // Add to supervisor's subordinates if applicable
    if (params.supervisorId) {
      const supervisor = this.leaders.get(params.supervisorId);
      if (supervisor) {
        supervisor.subordinates.push(leader.id);
      }
    }

    return leader;
  }

  async getLeader(leaderId: string): Promise<CommunityLeader | null> {
    return this.leaders.get(leaderId) || null;
  }

  async getLeaders(params?: {
    role?: LeaderRole;
    status?: LeaderStatus;
    territoryId?: string;
    skill?: string;
    certificationLevel?: CertificationLevel;
    availableNow?: boolean;
    supervisorId?: string;
    limit?: number;
  }): Promise<CommunityLeader[]> {
    let leaders = Array.from(this.leaders.values());

    if (params?.role) {
      leaders = leaders.filter(l => l.role === params.role);
    }

    if (params?.status) {
      leaders = leaders.filter(l => l.status === params.status);
    }

    if (params?.territoryId) {
      leaders = leaders.filter(l => l.territory.id === params.territoryId);
    }

    if (params?.skill) {
      leaders = leaders.filter(l =>
        l.skills.some(s => s.name.toLowerCase().includes(params.skill!.toLowerCase()))
      );
    }

    if (params?.certificationLevel) {
      leaders = leaders.filter(l =>
        l.certifications.some(c => c.level === params.certificationLevel)
      );
    }

    if (params?.availableNow) {
      const now = new Date();
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      leaders = leaders.filter(l => {
        if (l.status !== 'active') return false;
        const daySchedule = l.availability.weekdays.find(d => d.day === dayOfWeek);
        if (!daySchedule?.available) return false;
        if (daySchedule.startTime && daySchedule.endTime) {
          return currentTime >= daySchedule.startTime && currentTime <= daySchedule.endTime;
        }
        return true;
      });
    }

    if (params?.supervisorId) {
      leaders = leaders.filter(l => l.supervisor === params.supervisorId);
    }

    if (params?.limit) {
      leaders = leaders.slice(0, params.limit);
    }

    return leaders;
  }

  async updateLeader(leaderId: string, update: Partial<{
    status: LeaderStatus;
    role: LeaderRole;
    personalInfo: Partial<LeaderPersonalInfo>;
    availability: Partial<AvailabilitySchedule>;
    supervisor: string;
  }>): Promise<CommunityLeader> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    if (update.status) leader.status = update.status;
    if (update.role) leader.role = update.role;
    if (update.personalInfo) {
      leader.personalInfo = { ...leader.personalInfo, ...update.personalInfo };
    }
    if (update.availability) {
      leader.availability = { ...leader.availability, ...update.availability };
    }
    if (update.supervisor) {
      // Remove from old supervisor
      if (leader.supervisor) {
        const oldSupervisor = this.leaders.get(leader.supervisor);
        if (oldSupervisor) {
          oldSupervisor.subordinates = oldSupervisor.subordinates.filter(id => id !== leaderId);
        }
      }
      // Add to new supervisor
      const newSupervisor = this.leaders.get(update.supervisor);
      if (newSupervisor) {
        newSupervisor.subordinates.push(leaderId);
      }
      leader.supervisor = update.supervisor;
    }

    leader.updatedAt = new Date();
    return leader;
  }

  async activateLeader(leaderId: string, approvedBy: string): Promise<CommunityLeader> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    leader.status = 'active';
    leader.updatedAt = new Date();

    // Add activation note
    leader.notes.push({
      id: `note-${Date.now()}`,
      authorId: approvedBy,
      authorName: 'System',
      content: 'Leader activated and approved for duty',
      isPrivate: false,
      category: 'general',
      createdAt: new Date()
    });

    return leader;
  }

  // ==================== Territory Management ====================

  async assignTerritory(leaderId: string, territory: Omit<TerritoryAssignment, 'assignedSince'>): Promise<CommunityLeader> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    const fullTerritory: TerritoryAssignment = {
      ...territory,
      assignedSince: new Date()
    };

    leader.territory = fullTerritory;
    this.territories.set(territory.id, fullTerritory);
    leader.updatedAt = new Date();

    return leader;
  }

  async getTerritory(territoryId: string): Promise<TerritoryAssignment | null> {
    return this.territories.get(territoryId) || null;
  }

  async getTerritories(): Promise<TerritoryAssignment[]> {
    return Array.from(this.territories.values());
  }

  async addKeyLocation(territoryId: string, location: Omit<TerritoryLocation, 'id'>): Promise<TerritoryAssignment> {
    const territory = this.territories.get(territoryId);
    if (!territory) throw new Error(`Territory not found: ${territoryId}`);

    territory.keyLocations.push({
      ...location,
      id: `loc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    return territory;
  }

  // ==================== Certifications ====================

  async addCertification(leaderId: string, certification: Omit<LeaderCertification, 'id'>): Promise<CommunityLeader> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    leader.certifications.push({
      ...certification,
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    leader.statistics.trainingsCompleted++;
    leader.updatedAt = new Date();

    return leader;
  }

  async getExpiringCertifications(daysAhead: number = 30): Promise<{
    leader: CommunityLeader;
    certification: LeaderCertification;
    daysUntilExpiry: number;
  }[]> {
    const results: { leader: CommunityLeader; certification: LeaderCertification; daysUntilExpiry: number }[] = [];
    const cutoffDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

    for (const leader of this.leaders.values()) {
      for (const cert of leader.certifications) {
        if (cert.expiryDate && cert.expiryDate <= cutoffDate) {
          const daysUntilExpiry = Math.ceil((cert.expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
          results.push({ leader, certification: cert, daysUntilExpiry });
        }
      }
    }

    return results.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  }

  // ==================== Equipment ====================

  async assignEquipment(leaderId: string, equipment: Omit<AssignedEquipment, 'id' | 'assignedDate'>): Promise<CommunityLeader> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    leader.equipment.push({
      ...equipment,
      id: `equip-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      assignedDate: new Date()
    });
    leader.updatedAt = new Date();

    return leader;
  }

  async returnEquipment(leaderId: string, equipmentId: string): Promise<CommunityLeader> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    leader.equipment = leader.equipment.filter(e => e.id !== equipmentId);
    leader.updatedAt = new Date();

    return leader;
  }

  // ==================== Activity Logging ====================

  async logActivity(leaderId: string, activity: Omit<ActivityRecord, 'id'>): Promise<ActivityRecord> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    const record: ActivityRecord = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    };

    leader.activityLog.push(record);
    leader.statistics.totalActivities++;
    leader.statistics.activitiesByType[activity.type] = (leader.statistics.activitiesByType[activity.type] || 0) + 1;
    leader.statistics.hoursServed += activity.duration / 60;

    if (activity.householdsContacted) {
      leader.statistics.householdsReached += activity.householdsContacted;
    }

    leader.updatedAt = new Date();
    return record;
  }

  async getActivityLog(leaderId: string, params?: {
    type?: ActivityType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ActivityRecord[]> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    let activities = [...leader.activityLog];

    if (params?.type) {
      activities = activities.filter(a => a.type === params.type);
    }

    if (params?.startDate) {
      activities = activities.filter(a => a.date >= params.startDate!);
    }

    if (params?.endDate) {
      activities = activities.filter(a => a.date <= params.endDate!);
    }

    activities.sort((a, b) => b.date.getTime() - a.date.getTime());

    if (params?.limit) {
      activities = activities.slice(0, params.limit);
    }

    return activities;
  }

  // ==================== Meetings ====================

  async scheduleMeeting(params: Omit<CommunityMeeting, 'id' | 'attendees' | 'actionItems' | 'createdAt' | 'updatedAt'>): Promise<CommunityMeeting> {
    const meeting: CommunityMeeting = {
      ...params,
      id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attendees: params.invitedLeaders.map(leaderId => {
        const leader = this.leaders.get(leaderId);
        return {
          leaderId,
          leaderName: leader ? `${leader.personalInfo.firstName} ${leader.personalInfo.lastName}` : 'Unknown',
          role: leader?.role || 'block_warden',
          status: 'tentative' as const
        };
      }),
      actionItems: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.meetings.set(meeting.id, meeting);
    return meeting;
  }

  async getMeeting(meetingId: string): Promise<CommunityMeeting | null> {
    return this.meetings.get(meetingId) || null;
  }

  async getMeetings(params?: {
    organizerId?: string;
    territoryId?: string;
    type?: MeetingType;
    status?: CommunityMeeting['status'];
    dateRange?: { start: Date; end: Date };
  }): Promise<CommunityMeeting[]> {
    let meetings = Array.from(this.meetings.values());

    if (params?.organizerId) {
      meetings = meetings.filter(m => m.organizer === params.organizerId);
    }

    if (params?.territoryId) {
      meetings = meetings.filter(m => m.territory === params.territoryId);
    }

    if (params?.type) {
      meetings = meetings.filter(m => m.type === params.type);
    }

    if (params?.status) {
      meetings = meetings.filter(m => m.status === params.status);
    }

    if (params?.dateRange) {
      meetings = meetings.filter(m =>
        m.date >= params.dateRange!.start && m.date <= params.dateRange!.end
      );
    }

    return meetings.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async recordAttendance(meetingId: string, attendeeId: string, status: MeetingAttendee['status']): Promise<CommunityMeeting> {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error(`Meeting not found: ${meetingId}`);

    const attendee = meeting.attendees.find(a => a.leaderId === attendeeId);
    if (attendee) {
      attendee.status = status;
      if (status === 'attended') {
        attendee.arrivalTime = new Date();
      }
    }

    meeting.updatedAt = new Date();
    return meeting;
  }

  async addMeetingMinutes(meetingId: string, minutes: MeetingMinutes): Promise<CommunityMeeting> {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error(`Meeting not found: ${meetingId}`);

    meeting.minutes = minutes;
    meeting.status = 'completed';
    meeting.updatedAt = new Date();

    return meeting;
  }

  async addActionItem(meetingId: string, actionItem: Omit<ActionItem, 'id' | 'status'>): Promise<ActionItem> {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error(`Meeting not found: ${meetingId}`);

    const item: ActionItem = {
      ...actionItem,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending'
    };

    meeting.actionItems.push(item);
    meeting.updatedAt = new Date();

    return item;
  }

  // ==================== Broadcasts ====================

  async sendBroadcast(params: Omit<CommunityBroadcast, 'id' | 'sentAt' | 'acknowledgments'>): Promise<CommunityBroadcast> {
    const broadcast: CommunityBroadcast = {
      ...params,
      id: `broadcast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sentAt: params.scheduledAt && params.scheduledAt > new Date() ? undefined : new Date(),
      acknowledgments: []
    };

    this.broadcasts.set(broadcast.id, broadcast);
    return broadcast;
  }

  async acknowledgeBroadcast(broadcastId: string, leaderId: string): Promise<CommunityBroadcast> {
    const broadcast = this.broadcasts.get(broadcastId);
    if (!broadcast) throw new Error(`Broadcast not found: ${broadcastId}`);

    const recipient = broadcast.recipients.find(r => r.leaderId === leaderId);
    if (recipient) {
      recipient.acknowledged = true;
    }

    broadcast.acknowledgments.push({ leaderId, acknowledgedAt: new Date() });
    return broadcast;
  }

  async getBroadcasts(params?: {
    type?: CommunityBroadcast['type'];
    territory?: string;
    unacknowledgedBy?: string;
  }): Promise<CommunityBroadcast[]> {
    let broadcasts = Array.from(this.broadcasts.values());

    if (params?.type) {
      broadcasts = broadcasts.filter(b => b.type === params.type);
    }

    if (params?.territory) {
      broadcasts = broadcasts.filter(b => b.territory === params.territory);
    }

    if (params?.unacknowledgedBy) {
      broadcasts = broadcasts.filter(b =>
        b.recipients.some(r => r.leaderId === params.unacknowledgedBy && !r.acknowledged)
      );
    }

    return broadcasts.sort((a, b) =>
      (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0)
    );
  }

  // ==================== Welfare Check-Ins ====================

  async submitCheckIn(checkIn: Omit<WelfareCheckIn, 'id'>): Promise<WelfareCheckIn> {
    const fullCheckIn: WelfareCheckIn = {
      ...checkIn,
      id: `checkin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.checkIns.set(fullCheckIn.id, fullCheckIn);

    // Update leader statistics
    const leader = this.leaders.get(checkIn.leaderId);
    if (leader) {
      leader.statistics.householdsReached += checkIn.householdsContacted;
      leader.statistics.reportsSubmitted++;
      leader.updatedAt = new Date();
    }

    return fullCheckIn;
  }

  async getCheckIns(params?: {
    leaderId?: string;
    territoryId?: string;
    checkInType?: WelfareCheckIn['checkInType'];
    dateRange?: { start: Date; end: Date };
  }): Promise<WelfareCheckIn[]> {
    let checkIns = Array.from(this.checkIns.values());

    if (params?.leaderId) {
      checkIns = checkIns.filter(c => c.leaderId === params.leaderId);
    }

    if (params?.territoryId) {
      checkIns = checkIns.filter(c => c.territoryId === params.territoryId);
    }

    if (params?.checkInType) {
      checkIns = checkIns.filter(c => c.checkInType === params.checkInType);
    }

    if (params?.dateRange) {
      checkIns = checkIns.filter(c =>
        c.date >= params.dateRange!.start && c.date <= params.dateRange!.end
      );
    }

    return checkIns.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // ==================== Training ====================

  async createTrainingProgram(params: Omit<LeaderTrainingProgram, 'id' | 'status' | 'createdAt'>): Promise<LeaderTrainingProgram> {
    const program: LeaderTrainingProgram = {
      ...params,
      id: `program-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      createdAt: new Date()
    };

    this.trainingPrograms.set(program.id, program);
    return program;
  }

  async scheduleTrainingSession(params: Omit<TrainingSession, 'id' | 'enrolledParticipants' | 'status'>): Promise<TrainingSession> {
    const session: TrainingSession = {
      ...params,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      enrolledParticipants: [],
      status: 'scheduled'
    };

    this.trainingSessions.set(session.id, session);
    return session;
  }

  async enrollInTraining(sessionId: string, leaderId: string): Promise<TrainingSession> {
    const session = this.trainingSessions.get(sessionId);
    if (!session) throw new Error(`Training session not found: ${sessionId}`);

    if (session.enrolledParticipants.length >= session.maxParticipants) {
      throw new Error('Training session is full');
    }

    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    session.enrolledParticipants.push({
      leaderId,
      leaderName: `${leader.personalInfo.firstName} ${leader.personalInfo.lastName}`,
      enrolledAt: new Date(),
      attended: false
    });

    return session;
  }

  async completeTraining(sessionId: string, leaderId: string, result: {
    score?: number;
    passed: boolean;
    feedback?: string;
  }): Promise<TrainingSession> {
    const session = this.trainingSessions.get(sessionId);
    if (!session) throw new Error(`Training session not found: ${sessionId}`);

    const participant = session.enrolledParticipants.find(p => p.leaderId === leaderId);
    if (!participant) throw new Error('Participant not found in session');

    participant.attended = true;
    participant.score = result.score;
    participant.passed = result.passed;
    participant.feedback = result.feedback;

    if (result.passed) {
      participant.certificateIssued = true;

      // Update leader stats
      const leader = this.leaders.get(leaderId);
      if (leader) {
        leader.statistics.trainingsCompleted++;
        leader.updatedAt = new Date();
      }
    }

    return session;
  }

  // ==================== Recognition ====================

  async awardRecognition(params: Omit<LeaderRecognition, 'id'>): Promise<LeaderRecognition> {
    const recognition: LeaderRecognition = {
      ...params,
      id: `recognition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.recognitions.set(recognition.id, recognition);

    // Update leader stats
    const leader = this.leaders.get(params.leaderId);
    if (leader) {
      leader.statistics.recognitionsReceived++;
      leader.updatedAt = new Date();
    }

    return recognition;
  }

  async getRecognitions(params?: {
    leaderId?: string;
    type?: LeaderRecognition['type'];
  }): Promise<LeaderRecognition[]> {
    let recognitions = Array.from(this.recognitions.values());

    if (params?.leaderId) {
      recognitions = recognitions.filter(r => r.leaderId === params.leaderId);
    }

    if (params?.type) {
      recognitions = recognitions.filter(r => r.type === params.type);
    }

    return recognitions.sort((a, b) => b.awardedAt.getTime() - a.awardedAt.getTime());
  }

  // ==================== Hierarchy & Organization ====================

  async getHierarchy(rootLeaderId?: string): Promise<{
    leader: CommunityLeader;
    subordinates: { leader: CommunityLeader; subordinates: any[] }[];
  } | null> {
    const buildTree = (leaderId: string): any => {
      const leader = this.leaders.get(leaderId);
      if (!leader) return null;

      return {
        leader,
        subordinates: leader.subordinates.map(subId => buildTree(subId)).filter(Boolean)
      };
    };

    if (rootLeaderId) {
      return buildTree(rootLeaderId);
    }

    // Find top-level leaders (no supervisor)
    const topLeaders = Array.from(this.leaders.values()).filter(l => !l.supervisor);
    return topLeaders.length > 0 ? buildTree(topLeaders[0].id) : null;
  }

  async promoteLeader(leaderId: string, newRole: LeaderRole, promotedBy: string): Promise<CommunityLeader> {
    const leader = this.leaders.get(leaderId);
    if (!leader) throw new Error(`Leader not found: ${leaderId}`);

    const oldRole = leader.role;
    leader.role = newRole;
    leader.updatedAt = new Date();

    // Add recognition
    await this.awardRecognition({
      leaderId,
      leaderName: `${leader.personalInfo.firstName} ${leader.personalInfo.lastName}`,
      type: 'promotion',
      name: `Promoted to ${newRole.replace(/_/g, ' ')}`,
      description: `Promoted from ${oldRole.replace(/_/g, ' ')} to ${newRole.replace(/_/g, ' ')}`,
      awardedBy: promotedBy,
      awardedAt: new Date(),
      publicAnnouncement: true
    });

    return leader;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalLeaders: number;
    byRole: Record<LeaderRole, number>;
    byStatus: Record<LeaderStatus, number>;
    totalTerritories: number;
    totalHouseholdsCovered: number;
    totalPopulationCovered: number;
    totalVulnerablePopulation: number;
    activeMeetingsThisMonth: number;
    checkInsThisWeek: number;
    upcomingTrainingSessions: number;
  }> {
    const leaders = Array.from(this.leaders.values());
    const territories = Array.from(this.territories.values());
    const meetings = Array.from(this.meetings.values());
    const checkIns = Array.from(this.checkIns.values());
    const sessions = Array.from(this.trainingSessions.values());

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byRole: Record<LeaderRole, number> = {} as any;
    const byStatus: Record<LeaderStatus, number> = {} as any;

    leaders.forEach(l => {
      byRole[l.role] = (byRole[l.role] || 0) + 1;
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    });

    return {
      totalLeaders: leaders.length,
      byRole,
      byStatus,
      totalTerritories: territories.length,
      totalHouseholdsCovered: territories.reduce((sum, t) => sum + t.households, 0),
      totalPopulationCovered: territories.reduce((sum, t) => sum + t.population, 0),
      totalVulnerablePopulation: territories.reduce((sum, t) => sum + t.vulnerablePopulation, 0),
      activeMeetingsThisMonth: meetings.filter(m => m.date >= monthStart && m.date <= now).length,
      checkInsThisWeek: checkIns.filter(c => c.date >= weekStart).length,
      upcomingTrainingSessions: sessions.filter(s => s.date > now && s.status === 'scheduled').length
    };
  }

  async getLeaderPerformance(leaderId: string): Promise<{
    leader: CommunityLeader;
    metrics: {
      activitiesThisMonth: number;
      hoursThisMonth: number;
      householdsReachedThisMonth: number;
      meetingsAttended: number;
      checkInsSubmitted: number;
      responseRate: number;
      certificationsCurrent: number;
      certificationsExpiring: number;
    };
    ranking: {
      inTerritory: number;
      overall: number;
    };
  } | null> {
    const leader = this.leaders.get(leaderId);
    if (!leader) return null;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const activitiesThisMonth = leader.activityLog.filter(a => a.date >= monthStart);
    const checkIns = await this.getCheckIns({ leaderId, dateRange: { start: monthStart, end: now } });

    // Calculate meetings attended
    const meetings = await this.getMeetings();
    const meetingsAttended = meetings.filter(m =>
      m.attendees.some(a => a.leaderId === leaderId && a.status === 'attended')
    ).length;

    // Certifications status
    const currentCerts = leader.certifications.filter(c => !c.expiryDate || c.expiryDate > now);
    const expiringCerts = leader.certifications.filter(c =>
      c.expiryDate && c.expiryDate > now && c.expiryDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    );

    // Simple ranking calculation
    const allLeaders = Array.from(this.leaders.values());
    const territoryLeaders = allLeaders.filter(l => l.territory.id === leader.territory.id);

    const sortedByActivities = [...allLeaders].sort((a, b) =>
      b.statistics.totalActivities - a.statistics.totalActivities
    );
    const overallRank = sortedByActivities.findIndex(l => l.id === leaderId) + 1;

    const sortedTerritoryLeaders = [...territoryLeaders].sort((a, b) =>
      b.statistics.totalActivities - a.statistics.totalActivities
    );
    const territoryRank = sortedTerritoryLeaders.findIndex(l => l.id === leaderId) + 1;

    return {
      leader,
      metrics: {
        activitiesThisMonth: activitiesThisMonth.length,
        hoursThisMonth: activitiesThisMonth.reduce((sum, a) => sum + a.duration / 60, 0),
        householdsReachedThisMonth: activitiesThisMonth.reduce((sum, a) => sum + (a.householdsContacted || 0), 0),
        meetingsAttended,
        checkInsSubmitted: checkIns.length,
        responseRate: 95, // Would need more data to calculate
        certificationsCurrent: currentCerts.length,
        certificationsExpiring: expiringCerts.length
      },
      ranking: {
        inTerritory: territoryRank,
        overall: overallRank
      }
    };
  }
}

export const communityLeaderService = CommunityLeaderService.getInstance();
export default CommunityLeaderService;

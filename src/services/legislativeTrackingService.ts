/**
 * Legislative Tracking Service - Issue #161 Implementation
 * 
 * Provides comprehensive legislative tracking for emergency management
 * including bill monitoring, legislative analysis, advocacy management,
 * stakeholder engagement, and policy impact tracking.
 */

// Type definitions
type LegislativeLevel = 'federal' | 'state' | 'local' | 'tribal';
type BillStatus = 'introduced' | 'committee' | 'floor' | 'passed_chamber' | 'conference' | 'passed' | 'vetoed' | 'enacted' | 'failed' | 'withdrawn';
type VoteType = 'voice' | 'roll_call' | 'recorded' | 'unanimous_consent';
type StakeholderPosition = 'support' | 'oppose' | 'neutral' | 'watching' | 'undecided';
type ActionType = 'testimony' | 'letter' | 'meeting' | 'coalition' | 'grassroots' | 'media' | 'amendment';

// Legislative body interfaces
interface LegislativeBody {
  id: string;
  name: string;
  abbreviation: string;
  level: LegislativeLevel;
  jurisdiction: string;
  chamber?: 'upper' | 'lower' | 'unicameral';
  members: number;
  currentSession: LegislativeSession;
  committees: LegislativeCommittee[];
  contacts: LegislativeContact[];
  website: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LegislativeSession {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'recess' | 'ended';
  regularSession: boolean;
  specialSessionTopic?: string;
}

interface LegislativeCommittee {
  id: string;
  name: string;
  abbreviation?: string;
  type: 'standing' | 'select' | 'joint' | 'conference' | 'subcommittee';
  parentCommittee?: string;
  jurisdiction: string[];
  chair?: string;
  viceChai?: string;
  members: CommitteeMember[];
  meetingSchedule?: string;
}

interface CommitteeMember {
  legislatorId: string;
  name: string;
  party: string;
  role: 'chair' | 'vice_chair' | 'ranking_member' | 'member';
}

interface LegislativeContact {
  role: string;
  name: string;
  title: string;
  phone: string;
  email: string;
}

// Legislator interfaces
interface Legislator {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  party: string;
  bodyId: string;
  bodyName: string;
  chamber?: string;
  district: string;
  state?: string;
  termStart: Date;
  termEnd?: Date;
  status: 'active' | 'inactive';
  committees: string[];
  leadership?: string;
  contactInfo: LegislatorContact;
  socialMedia?: SocialMediaInfo;
  keyIssues: string[];
  votingRecord?: VotingPattern;
  emergencyManagementRecord?: EmergencyManagementRecord;
  createdAt: Date;
  updatedAt: Date;
}

interface LegislatorContact {
  officePhone: string;
  districtPhone?: string;
  email: string;
  office: string;
  districtOffice?: string;
  website?: string;
}

interface SocialMediaInfo {
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

interface VotingPattern {
  partyLinePercent: number;
  emergencyManagementSupport: number;
  publicSafetySupport: number;
  recentVotes: { billId: string; billTitle: string; vote: string; date: Date }[];
}

interface EmergencyManagementRecord {
  sponsoredBills: number;
  cosponsoredBills: number;
  supportivVotes: number;
  opposingVotes: number;
  committeeAssignments: string[];
  publicStatements: { date: Date; topic: string; position: string }[];
  rating?: number;
}

// Bill interfaces
interface LegislativeBill {
  id: string;
  billNumber: string;
  title: string;
  shortTitle?: string;
  summary: string;
  bodyId: string;
  bodyName: string;
  session: string;
  status: BillStatus;
  introducedDate: Date;
  sponsors: BillSponsor[];
  cosponsors: BillSponsor[];
  committees: BillCommitteeRef[];
  subjects: string[];
  textVersions: BillText[];
  actions: BillAction[];
  votes: BillVote[];
  amendments: BillAmendment[];
  relatedBills: string[];
  fiscalImpact?: FiscalImpact;
  analysis?: BillAnalysis;
  organizationPosition?: OrganizationPosition;
  tracking: BillTracking;
  alerts: BillAlert[];
  createdAt: Date;
  updatedAt: Date;
}

interface BillSponsor {
  legislatorId: string;
  name: string;
  party: string;
  isPrimary: boolean;
  addedDate: Date;
}

interface BillCommitteeRef {
  committeeId: string;
  committeeName: string;
  referralDate: Date;
  status: 'referred' | 'hearing_scheduled' | 'hearing_held' | 'reported' | 'discharged';
  hearingDate?: Date;
  reportDate?: Date;
  recommendation?: string;
}

interface BillText {
  version: string;
  date: Date;
  url: string;
  description?: string;
}

interface BillAction {
  date: Date;
  description: string;
  chamber?: string;
  committee?: string;
  vote?: string;
  result?: string;
}

interface BillVote {
  id: string;
  date: Date;
  chamber: string;
  voteType: VoteType;
  question: string;
  result: 'passed' | 'failed' | 'tabled';
  yeas: number;
  nays: number;
  present: number;
  notVoting: number;
  individualVotes?: { legislatorId: string; name: string; party: string; vote: string }[];
}

interface BillAmendment {
  id: string;
  number: string;
  sponsor: string;
  description: string;
  status: 'proposed' | 'adopted' | 'rejected' | 'withdrawn';
  date: Date;
  vote?: BillVote;
}

interface FiscalImpact {
  estimatedCost?: number;
  estimatedSavings?: number;
  fiscalYears: string[];
  fundingSources?: string[];
  analysisUrl?: string;
  notes?: string;
}

interface BillAnalysis {
  summary: string;
  keyProvisions: string[];
  impacts: {
    category: string;
    description: string;
    positive: boolean;
  }[];
  stakeholders: { name: string; position: StakeholderPosition; concerns?: string[] }[];
  opportunities: string[];
  concerns: string[];
  recommendations: string[];
  analyzedBy: string;
  analyzedDate: Date;
}

interface OrganizationPosition {
  position: StakeholderPosition;
  rationale: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  keyContacts: string[];
  actions: AdvocacyAction[];
  lastUpdated: Date;
}

interface BillTracking {
  isTracked: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  notes?: string;
  lastReviewed?: Date;
  nextReviewDate?: Date;
}

interface BillAlert {
  id: string;
  type: 'status_change' | 'hearing' | 'vote' | 'deadline' | 'amendment' | 'custom';
  message: string;
  date: Date;
  read: boolean;
  actionRequired: boolean;
}

// Advocacy interfaces
interface AdvocacyAction {
  id: string;
  type: ActionType;
  billId?: string;
  billNumber?: string;
  description: string;
  target: string;
  targetType: 'legislator' | 'committee' | 'body' | 'public';
  scheduledDate?: Date;
  completedDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  participants: string[];
  outcome?: string;
  followUp?: string;
  documents?: { name: string; url: string }[];
  createdAt: Date;
}

interface AdvocacyCampaign {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  bills: string[];
  targetLegislators: string[];
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  actions: AdvocacyAction[];
  coalition: CoalitionMember[];
  metrics: CampaignMetrics;
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CoalitionMember {
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  role: 'lead' | 'partner' | 'supporter';
  commitments: string[];
  joinedDate: Date;
}

interface CampaignMetrics {
  legislatorContacts: number;
  testimoniesDelivered: number;
  lettersSubmitted: number;
  mediaHits: number;
  grassrootsActions: number;
  billsInfluenced: number;
}

// Hearing interfaces
interface LegislativeHearing {
  id: string;
  committeeId: string;
  committeeName: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  virtualOption?: string;
  billIds: string[];
  agenda?: string[];
  witnesses: HearingWitness[];
  publicComment: {
    allowed: boolean;
    deadline?: Date;
    submissionUrl?: string;
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'cancelled';
  recording?: string;
  transcript?: string;
  materials: { title: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
}

interface HearingWitness {
  name: string;
  title: string;
  organization: string;
  position?: StakeholderPosition;
  testimony?: string;
  invitedBy?: string;
  confirmed: boolean;
}

// Report interfaces
interface LegislativeReport {
  id: string;
  title: string;
  type: 'session_summary' | 'bill_tracker' | 'advocacy_report' | 'stakeholder_analysis' | 'impact_assessment';
  period?: { start: Date; end: Date };
  generatedDate: Date;
  generatedBy: string;
  summary: string;
  sections: { title: string; content: string }[];
  statistics: Record<string, number>;
  recommendations?: string[];
  attachments?: string[];
}

// Sample data
const sampleBills: LegislativeBill[] = [
  {
    id: 'bill-001',
    billNumber: 'HB 1234',
    title: 'Emergency Management Modernization Act',
    shortTitle: 'EM Modernization Act',
    summary: 'A bill to modernize emergency management capabilities, enhance interagency coordination, and improve disaster response effectiveness.',
    bodyId: 'body-001',
    bodyName: 'State House of Representatives',
    session: '2024 Regular Session',
    status: 'committee',
    introducedDate: new Date('2024-01-15'),
    sponsors: [
      {
        legislatorId: 'leg-001',
        name: 'Rep. John Smith',
        party: 'Democratic',
        isPrimary: true,
        addedDate: new Date('2024-01-15')
      }
    ],
    cosponsors: [],
    committees: [
      {
        committeeId: 'comm-001',
        committeeName: 'Homeland Security Committee',
        referralDate: new Date('2024-01-20'),
        status: 'hearing_scheduled',
        hearingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ],
    subjects: ['Emergency Management', 'Public Safety', 'Disaster Response', 'Technology'],
    textVersions: [
      {
        version: 'Introduced',
        date: new Date('2024-01-15'),
        url: '/bills/hb1234-introduced.pdf'
      }
    ],
    actions: [
      { date: new Date('2024-01-15'), description: 'Introduced and read first time' },
      { date: new Date('2024-01-20'), description: 'Referred to Homeland Security Committee' }
    ],
    votes: [],
    amendments: [],
    relatedBills: [],
    fiscalImpact: {
      estimatedCost: 5000000,
      fiscalYears: ['FY2025', 'FY2026'],
      fundingSources: ['General Fund', 'Federal Grants']
    },
    analysis: {
      summary: 'This bill would significantly enhance state emergency management capabilities through technology modernization and improved coordination.',
      keyProvisions: [
        'Establishes integrated emergency communications system',
        'Creates regional coordination centers',
        'Mandates interoperability standards'
      ],
      impacts: [
        { category: 'Emergency Response', description: 'Improved response times and coordination', positive: true },
        { category: 'Budget', description: 'Initial investment required', positive: false }
      ],
      stakeholders: [
        { name: 'Emergency Managers Association', position: 'support' },
        { name: 'First Responders Union', position: 'support' }
      ],
      opportunities: ['Federal matching funds available', 'Technology grants'],
      concerns: ['Implementation timeline', 'Training requirements'],
      recommendations: ['Support with amendments for phased implementation'],
      analyzedBy: 'Policy Analysis Team',
      analyzedDate: new Date()
    },
    organizationPosition: {
      position: 'support',
      rationale: 'Aligns with strategic priorities for emergency management modernization',
      priority: 'high',
      keyContacts: ['Rep. Smith office', 'Committee Chair'],
      actions: [],
      lastUpdated: new Date()
    },
    tracking: {
      isTracked: true,
      priority: 'high',
      assignedTo: 'Government Affairs Team',
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    alerts: [
      {
        id: 'alert-001',
        type: 'hearing',
        message: 'Committee hearing scheduled in 14 days',
        date: new Date(),
        read: false,
        actionRequired: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class LegislativeTrackingService {
  private static instance: LegislativeTrackingService;
  private bodies: Map<string, LegislativeBody> = new Map();
  private legislators: Map<string, Legislator> = new Map();
  private bills: Map<string, LegislativeBill> = new Map();
  private hearings: Map<string, LegislativeHearing> = new Map();
  private campaigns: Map<string, AdvocacyCampaign> = new Map();
  private reports: Map<string, LegislativeReport> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): LegislativeTrackingService {
    if (!LegislativeTrackingService.instance) {
      LegislativeTrackingService.instance = new LegislativeTrackingService();
    }
    return LegislativeTrackingService.instance;
  }

  private initializeSampleData(): void {
    sampleBills.forEach(b => this.bills.set(b.id, b));
  }

  // ==================== Legislative Body Management ====================

  async createLegislativeBody(params: Omit<LegislativeBody, 'id' | 'createdAt' | 'updatedAt'>): Promise<LegislativeBody> {
    const body: LegislativeBody = {
      ...params,
      id: `body-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.bodies.set(body.id, body);
    return body;
  }

  async getLegislativeBody(bodyId: string): Promise<LegislativeBody | null> {
    return this.bodies.get(bodyId) || null;
  }

  async getLegislativeBodies(params?: {
    level?: LegislativeLevel;
    jurisdiction?: string;
  }): Promise<LegislativeBody[]> {
    let bodies = Array.from(this.bodies.values());

    if (params?.level) {
      bodies = bodies.filter(b => b.level === params.level);
    }

    if (params?.jurisdiction) {
      bodies = bodies.filter(b =>
        b.jurisdiction.toLowerCase().includes(params.jurisdiction!.toLowerCase())
      );
    }

    return bodies;
  }

  // ==================== Legislator Management ====================

  async createLegislator(params: Omit<Legislator, 'id' | 'createdAt' | 'updatedAt'>): Promise<Legislator> {
    const legislator: Legislator = {
      ...params,
      id: `leg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.legislators.set(legislator.id, legislator);
    return legislator;
  }

  async getLegislator(legislatorId: string): Promise<Legislator | null> {
    return this.legislators.get(legislatorId) || null;
  }

  async getLegislators(params?: {
    bodyId?: string;
    party?: string;
    committee?: string;
    district?: string;
    search?: string;
  }): Promise<Legislator[]> {
    let legislators = Array.from(this.legislators.values());

    if (params?.bodyId) {
      legislators = legislators.filter(l => l.bodyId === params.bodyId);
    }

    if (params?.party) {
      legislators = legislators.filter(l => l.party === params.party);
    }

    if (params?.committee) {
      legislators = legislators.filter(l => l.committees.includes(params.committee!));
    }

    if (params?.district) {
      legislators = legislators.filter(l => l.district === params.district);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      legislators = legislators.filter(l =>
        l.name.toLowerCase().includes(searchLower) ||
        l.district.toLowerCase().includes(searchLower)
      );
    }

    return legislators.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  async updateLegislatorRecord(legislatorId: string, record: Partial<EmergencyManagementRecord>): Promise<Legislator> {
    const legislator = this.legislators.get(legislatorId);
    if (!legislator) throw new Error(`Legislator not found: ${legislatorId}`);

    legislator.emergencyManagementRecord = {
      ...legislator.emergencyManagementRecord,
      ...record
    } as EmergencyManagementRecord;

    legislator.updatedAt = new Date();
    return legislator;
  }

  // ==================== Bill Management ====================

  async createBill(params: Omit<LegislativeBill, 'id' | 'votes' | 'amendments' | 'alerts' | 'createdAt' | 'updatedAt'>): Promise<LegislativeBill> {
    const bill: LegislativeBill = {
      ...params,
      id: `bill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      votes: [],
      amendments: [],
      alerts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.bills.set(bill.id, bill);
    return bill;
  }

  async getBill(billId: string): Promise<LegislativeBill | null> {
    return this.bills.get(billId) || null;
  }

  async getBills(params?: {
    bodyId?: string;
    status?: BillStatus;
    subject?: string;
    sponsorId?: string;
    tracked?: boolean;
    priority?: BillTracking['priority'];
    position?: StakeholderPosition;
    search?: string;
    limit?: number;
  }): Promise<LegislativeBill[]> {
    let bills = Array.from(this.bills.values());

    if (params?.bodyId) {
      bills = bills.filter(b => b.bodyId === params.bodyId);
    }

    if (params?.status) {
      bills = bills.filter(b => b.status === params.status);
    }

    if (params?.subject) {
      bills = bills.filter(b =>
        b.subjects.some(s => s.toLowerCase().includes(params.subject!.toLowerCase()))
      );
    }

    if (params?.sponsorId) {
      bills = bills.filter(b =>
        b.sponsors.some(s => s.legislatorId === params.sponsorId) ||
        b.cosponsors.some(c => c.legislatorId === params.sponsorId)
      );
    }

    if (params?.tracked !== undefined) {
      bills = bills.filter(b => b.tracking.isTracked === params.tracked);
    }

    if (params?.priority) {
      bills = bills.filter(b => b.tracking.priority === params.priority);
    }

    if (params?.position) {
      bills = bills.filter(b =>
        b.organizationPosition?.position === params.position
      );
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      bills = bills.filter(b =>
        b.billNumber.toLowerCase().includes(searchLower) ||
        b.title.toLowerCase().includes(searchLower) ||
        b.summary.toLowerCase().includes(searchLower)
      );
    }

    // Sort by priority then by date
    const priorityOrder: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3
    };

    bills.sort((a, b) => {
      const priorityDiff = priorityOrder[a.tracking.priority] - priorityOrder[b.tracking.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.introducedDate.getTime() - a.introducedDate.getTime();
    });

    if (params?.limit) {
      bills = bills.slice(0, params.limit);
    }

    return bills;
  }

  async updateBillStatus(billId: string, status: BillStatus, action: BillAction): Promise<LegislativeBill> {
    const bill = this.bills.get(billId);
    if (!bill) throw new Error(`Bill not found: ${billId}`);

    bill.status = status;
    bill.actions.push(action);

    // Create alert
    bill.alerts.push({
      id: `alert-${Date.now()}`,
      type: 'status_change',
      message: `Bill status changed to ${status}: ${action.description}`,
      date: new Date(),
      read: false,
      actionRequired: ['floor', 'conference', 'passed_chamber'].includes(status)
    });

    bill.updatedAt = new Date();
    return bill;
  }

  async setOrganizationPosition(billId: string, position: OrganizationPosition): Promise<LegislativeBill> {
    const bill = this.bills.get(billId);
    if (!bill) throw new Error(`Bill not found: ${billId}`);

    bill.organizationPosition = position;
    bill.updatedAt = new Date();

    return bill;
  }

  async addBillAnalysis(billId: string, analysis: BillAnalysis): Promise<LegislativeBill> {
    const bill = this.bills.get(billId);
    if (!bill) throw new Error(`Bill not found: ${billId}`);

    bill.analysis = analysis;
    bill.updatedAt = new Date();

    return bill;
  }

  async recordVote(billId: string, vote: Omit<BillVote, 'id'>): Promise<LegislativeBill> {
    const bill = this.bills.get(billId);
    if (!bill) throw new Error(`Bill not found: ${billId}`);

    bill.votes.push({
      ...vote,
      id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    // Create alert
    bill.alerts.push({
      id: `alert-${Date.now()}`,
      type: 'vote',
      message: `Vote recorded: ${vote.question} - ${vote.result}`,
      date: new Date(),
      read: false,
      actionRequired: false
    });

    bill.updatedAt = new Date();
    return bill;
  }

  async trackBill(billId: string, tracking: BillTracking): Promise<LegislativeBill> {
    const bill = this.bills.get(billId);
    if (!bill) throw new Error(`Bill not found: ${billId}`);

    bill.tracking = tracking;
    bill.updatedAt = new Date();

    return bill;
  }

  async getUnreadAlerts(billIds?: string[]): Promise<BillAlert[]> {
    const alerts: BillAlert[] = [];

    for (const bill of this.bills.values()) {
      if (billIds && !billIds.includes(bill.id)) continue;

      for (const alert of bill.alerts) {
        if (!alert.read) {
          alerts.push(alert);
        }
      }
    }

    return alerts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // ==================== Hearing Management ====================

  async createHearing(params: Omit<LegislativeHearing, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<LegislativeHearing> {
    const hearing: LegislativeHearing = {
      ...params,
      id: `hearing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.hearings.set(hearing.id, hearing);

    // Create alerts for related bills
    for (const billId of params.billIds) {
      const bill = this.bills.get(billId);
      if (bill) {
        bill.alerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: 'hearing',
          message: `Hearing scheduled: ${hearing.title} on ${hearing.date.toLocaleDateString()}`,
          date: new Date(),
          read: false,
          actionRequired: true
        });
        bill.updatedAt = new Date();
      }
    }

    return hearing;
  }

  async getHearing(hearingId: string): Promise<LegislativeHearing | null> {
    return this.hearings.get(hearingId) || null;
  }

  async getHearings(params?: {
    committeeId?: string;
    billId?: string;
    status?: LegislativeHearing['status'];
    upcoming?: boolean;
    dateRange?: { start: Date; end: Date };
  }): Promise<LegislativeHearing[]> {
    let hearings = Array.from(this.hearings.values());

    if (params?.committeeId) {
      hearings = hearings.filter(h => h.committeeId === params.committeeId);
    }

    if (params?.billId) {
      hearings = hearings.filter(h => h.billIds.includes(params.billId!));
    }

    if (params?.status) {
      hearings = hearings.filter(h => h.status === params.status);
    }

    if (params?.upcoming) {
      hearings = hearings.filter(h =>
        h.date > new Date() && h.status === 'scheduled'
      );
    }

    if (params?.dateRange) {
      hearings = hearings.filter(h =>
        h.date >= params.dateRange!.start && h.date <= params.dateRange!.end
      );
    }

    return hearings.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async registerWitness(hearingId: string, witness: HearingWitness): Promise<LegislativeHearing> {
    const hearing = this.hearings.get(hearingId);
    if (!hearing) throw new Error(`Hearing not found: ${hearingId}`);

    hearing.witnesses.push(witness);
    hearing.updatedAt = new Date();

    return hearing;
  }

  // ==================== Advocacy Campaign Management ====================

  async createCampaign(params: Omit<AdvocacyCampaign, 'id' | 'actions' | 'metrics' | 'createdAt' | 'updatedAt'>): Promise<AdvocacyCampaign> {
    const campaign: AdvocacyCampaign = {
      ...params,
      id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      actions: [],
      metrics: {
        legislatorContacts: 0,
        testimoniesDelivered: 0,
        lettersSubmitted: 0,
        mediaHits: 0,
        grassrootsActions: 0,
        billsInfluenced: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async getCampaigns(params?: {
    status?: AdvocacyCampaign['status'];
    billId?: string;
  }): Promise<AdvocacyCampaign[]> {
    let campaigns = Array.from(this.campaigns.values());

    if (params?.status) {
      campaigns = campaigns.filter(c => c.status === params.status);
    }

    if (params?.billId) {
      campaigns = campaigns.filter(c => c.bills.includes(params.billId!));
    }

    return campaigns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addAdvocacyAction(campaignId: string, action: Omit<AdvocacyAction, 'id' | 'status' | 'createdAt'>): Promise<AdvocacyCampaign> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) throw new Error(`Campaign not found: ${campaignId}`);

    campaign.actions.push({
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'planned',
      createdAt: new Date()
    });

    campaign.updatedAt = new Date();
    return campaign;
  }

  async completeAdvocacyAction(campaignId: string, actionId: string, outcome: string): Promise<AdvocacyCampaign> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) throw new Error(`Campaign not found: ${campaignId}`);

    const action = campaign.actions.find(a => a.id === actionId);
    if (!action) throw new Error(`Action not found: ${actionId}`);

    action.status = 'completed';
    action.completedDate = new Date();
    action.outcome = outcome;

    // Update metrics
    switch (action.type) {
      case 'meeting':
        campaign.metrics.legislatorContacts++;
        break;
      case 'testimony':
        campaign.metrics.testimoniesDelivered++;
        break;
      case 'letter':
        campaign.metrics.lettersSubmitted++;
        break;
      case 'media':
        campaign.metrics.mediaHits++;
        break;
      case 'grassroots':
        campaign.metrics.grassrootsActions++;
        break;
    }

    campaign.updatedAt = new Date();
    return campaign;
  }

  // ==================== Report Generation ====================

  async generateReport(params: Omit<LegislativeReport, 'id' | 'generatedDate'>): Promise<LegislativeReport> {
    const report: LegislativeReport = {
      ...params,
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      generatedDate: new Date()
    };

    this.reports.set(report.id, report);
    return report;
  }

  async getReports(params?: {
    type?: LegislativeReport['type'];
    limit?: number;
  }): Promise<LegislativeReport[]> {
    let reports = Array.from(this.reports.values());

    if (params?.type) {
      reports = reports.filter(r => r.type === params.type);
    }

    reports.sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime());

    if (params?.limit) {
      reports = reports.slice(0, params.limit);
    }

    return reports;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalBillsTracked: number;
    billsByStatus: Record<BillStatus, number>;
    billsByPriority: Record<string, number>;
    billsByPosition: Record<StakeholderPosition, number>;
    upcomingHearings: number;
    activeCampaigns: number;
    unreadAlerts: number;
    actionItems: number;
    supportedBills: number;
    opposedBills: number;
    legislatorsTracked: number;
  }> {
    const bills = Array.from(this.bills.values());
    const hearings = Array.from(this.hearings.values());
    const campaigns = Array.from(this.campaigns.values());
    const legislators = Array.from(this.legislators.values());

    const billsByStatus: Record<BillStatus, number> = {} as any;
    const billsByPriority: Record<string, number> = {};
    const billsByPosition: Record<StakeholderPosition, number> = {} as any;
    let unreadAlerts = 0;

    bills.forEach(b => {
      billsByStatus[b.status] = (billsByStatus[b.status] || 0) + 1;
      billsByPriority[b.tracking.priority] = (billsByPriority[b.tracking.priority] || 0) + 1;

      if (b.organizationPosition) {
        billsByPosition[b.organizationPosition.position] =
          (billsByPosition[b.organizationPosition.position] || 0) + 1;
      }

      unreadAlerts += b.alerts.filter(a => !a.read).length;
    });

    const now = new Date();
    const upcomingHearings = hearings.filter(h =>
      h.date > now && h.status === 'scheduled'
    ).length;

    let actionItems = 0;
    bills.forEach(b => {
      actionItems += b.alerts.filter(a => !a.read && a.actionRequired).length;
    });

    return {
      totalBillsTracked: bills.filter(b => b.tracking.isTracked).length,
      billsByStatus,
      billsByPriority,
      billsByPosition,
      upcomingHearings,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      unreadAlerts,
      actionItems,
      supportedBills: billsByPosition['support'] || 0,
      opposedBills: billsByPosition['oppose'] || 0,
      legislatorsTracked: legislators.filter(l => l.status === 'active').length
    };
  }
}

export const legislativeTrackingService = LegislativeTrackingService.getInstance();
export default LegislativeTrackingService;

/**
 * Governance Service - Issue #157 Implementation
 * 
 * Provides comprehensive governance management for disaster response
 * including decision-making workflows, authority delegation, approval chains,
 * governance policies, and accountability tracking.
 */

// Type definitions
type GovernanceLevel = 'local' | 'district' | 'state' | 'regional' | 'national' | 'federal';
type DecisionStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'deferred' | 'escalated' | 'implemented';
type DecisionPriority = 'low' | 'medium' | 'high' | 'critical' | 'emergency';
type AuthorityType = 'executive' | 'legislative' | 'administrative' | 'emergency' | 'delegated';
type PolicyType = 'law' | 'regulation' | 'guideline' | 'procedure' | 'directive' | 'standard';

// Governance body interfaces
interface GovernanceBody {
  id: string;
  name: string;
  type: 'committee' | 'council' | 'board' | 'agency' | 'department' | 'task_force';
  level: GovernanceLevel;
  jurisdiction: string;
  description: string;
  authority: AuthorityScope;
  members: GovernanceMember[];
  leadership: LeadershipRole[];
  meetingSchedule?: MeetingSchedule;
  parentBody?: string;
  childBodies: string[];
  contactInfo: GovernanceContact;
  status: 'active' | 'inactive' | 'temporary' | 'dissolved';
  establishedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthorityScope {
  type: AuthorityType;
  domains: string[];
  limitations: string[];
  delegationSource?: string;
  budgetAuthority?: number;
  personnelAuthority?: number;
  emergencyPowers: boolean;
  declarationAuthority: boolean;
}

interface GovernanceMember {
  id: string;
  name: string;
  title: string;
  role: string;
  organization: string;
  email: string;
  phone: string;
  votingRights: boolean;
  termStart: Date;
  termEnd?: Date;
  status: 'active' | 'leave' | 'resigned' | 'removed';
  expertise: string[];
  committees: string[];
}

interface LeadershipRole {
  role: 'chair' | 'vice_chair' | 'secretary' | 'treasurer' | 'executive_director';
  memberId: string;
  memberName: string;
  appointedDate: Date;
  termEnd?: Date;
}

interface MeetingSchedule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'as_needed';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time?: string;
  location?: string;
  virtualOption: boolean;
  quorumRequirement: number; // percentage
}

interface GovernanceContact {
  primaryPhone: string;
  emergencyPhone?: string;
  email: string;
  address?: string;
  website?: string;
}

// Decision interfaces
interface GovernanceDecision {
  id: string;
  title: string;
  description: string;
  type: 'policy' | 'resource_allocation' | 'emergency_declaration' | 'operational' | 'administrative' | 'legislative';
  category: string;
  priority: DecisionPriority;
  status: DecisionStatus;
  governanceBodyId: string;
  governanceBodyName: string;
  submittedBy: DecisionSubmitter;
  submittedAt: Date;
  deadline?: Date;
  context: DecisionContext;
  options: DecisionOption[];
  selectedOption?: string;
  approvalChain: ApprovalStep[];
  currentApprover?: string;
  attachments: DecisionAttachment[];
  impact: DecisionImpact;
  deliberation: Deliberation;
  outcome?: DecisionOutcome;
  appealable: boolean;
  appeal?: Appeal;
  relatedDecisions: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface DecisionSubmitter {
  id: string;
  name: string;
  title: string;
  organization: string;
  email: string;
}

interface DecisionContext {
  background: string;
  urgency: string;
  stakeholders: string[];
  constraints: string[];
  risks: { risk: string; mitigation: string }[];
  legalConsiderations?: string;
  precedents?: string[];
}

interface DecisionOption {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  cost?: number;
  timeframe?: string;
  resources?: string[];
  recommendation: boolean;
  supportingEvidence?: string[];
}

interface ApprovalStep {
  order: number;
  approverRole: string;
  approverId?: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  requiredBy?: Date;
  actionDate?: Date;
  comments?: string;
  conditions?: string[];
  delegatedTo?: string;
}

interface DecisionAttachment {
  id: string;
  name: string;
  type: 'document' | 'report' | 'data' | 'media' | 'legal';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

interface DecisionImpact {
  affected: {
    population?: number;
    area?: string;
    organizations?: string[];
    services?: string[];
  };
  financial?: {
    cost: number;
    funding: string;
    budgetImpact: string;
  };
  timeline?: {
    implementation: string;
    milestones: { name: string; date: Date }[];
  };
  environmental?: string;
  social?: string;
}

interface Deliberation {
  discussions: Discussion[];
  votes?: VotingRecord;
  amendments: Amendment[];
  expertConsultations: ExpertConsultation[];
}

interface Discussion {
  date: Date;
  participants: string[];
  summary: string;
  keyPoints: string[];
  concerns: string[];
  recordUrl?: string;
}

interface VotingRecord {
  date: Date;
  method: 'voice' | 'roll_call' | 'secret' | 'unanimous_consent';
  result: 'passed' | 'failed' | 'tabled' | 'withdrawn';
  yeas: number;
  nays: number;
  abstentions: number;
  notVoting: number;
  individualVotes?: { memberId: string; memberName: string; vote: 'yea' | 'nay' | 'abstain' | 'not_voting' }[];
  quorumMet: boolean;
}

interface Amendment {
  id: string;
  proposedBy: string;
  description: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'withdrawn';
  vote?: VotingRecord;
}

interface ExpertConsultation {
  expert: string;
  organization: string;
  date: Date;
  topic: string;
  recommendations: string[];
}

interface DecisionOutcome {
  decision: string;
  rationale: string;
  conditions?: string[];
  implementationPlan?: string;
  responsibleParty: string;
  effectiveDate: Date;
  reviewDate?: Date;
  publicAnnouncement?: Date;
}

interface Appeal {
  id: string;
  filedBy: string;
  filedAt: Date;
  grounds: string;
  status: 'filed' | 'under_review' | 'upheld' | 'overturned' | 'modified' | 'dismissed';
  reviewBody: string;
  outcome?: string;
  decidedAt?: Date;
}

// Authority delegation interfaces
interface AuthorityDelegation {
  id: string;
  delegatorId: string;
  delegatorName: string;
  delegatorTitle: string;
  delegateeId: string;
  delegateeName: string;
  delegateeTitle: string;
  scope: DelegationScope;
  reason: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'expired' | 'revoked' | 'superseded';
  conditions: string[];
  limitations: string[];
  reportingRequirements?: string[];
  approvedBy?: string;
  createdAt: Date;
}

interface DelegationScope {
  authorities: string[];
  budgetLimit?: number;
  personnelLimit?: number;
  decisionTypes: string[];
  geographicScope?: string;
  temporalScope?: string;
  excludedMatters: string[];
}

// Accountability interfaces
interface AccountabilityRecord {
  id: string;
  entityType: 'individual' | 'body' | 'agency';
  entityId: string;
  entityName: string;
  period: { start: Date; end: Date };
  responsibilities: ResponsibilityItem[];
  performance: PerformanceMetrics;
  audits: AuditRecord[];
  reports: AccountabilityReport[];
  issues: AccountabilityIssue[];
  status: 'compliant' | 'partial' | 'non_compliant' | 'under_review';
  createdAt: Date;
  updatedAt: Date;
}

interface ResponsibilityItem {
  description: string;
  category: string;
  source: string; // law, policy, etc.
  kpis: { metric: string; target: string; actual?: string }[];
  status: 'met' | 'partially_met' | 'not_met' | 'not_applicable';
}

interface PerformanceMetrics {
  overallScore: number;
  categories: {
    category: string;
    score: number;
    weight: number;
    indicators: { name: string; value: number; target: number }[];
  }[];
  trend: 'improving' | 'stable' | 'declining';
  benchmarkComparison?: string;
}

interface AuditRecord {
  id: string;
  type: 'internal' | 'external' | 'regulatory';
  auditor: string;
  date: Date;
  scope: string;
  findings: { finding: string; severity: 'low' | 'medium' | 'high' | 'critical'; status: 'open' | 'resolved' }[];
  recommendations: string[];
  managementResponse?: string;
  reportUrl?: string;
}

interface AccountabilityReport {
  id: string;
  type: 'annual' | 'quarterly' | 'incident' | 'special';
  title: string;
  period: { start: Date; end: Date };
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'accepted' | 'revision_required';
  url?: string;
}

interface AccountabilityIssue {
  id: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  identifiedDate: Date;
  source: 'audit' | 'complaint' | 'self_reported' | 'investigation';
  status: 'identified' | 'investigating' | 'remediation' | 'resolved' | 'escalated';
  resolution?: string;
  resolvedDate?: Date;
}

// Sample data
const sampleGovernanceBodies: GovernanceBody[] = [
  {
    id: 'gov-body-001',
    name: 'Emergency Management Council',
    type: 'council',
    level: 'state',
    jurisdiction: 'Statewide Emergency Response',
    description: 'Primary governing body for state-level emergency management decisions and policy.',
    authority: {
      type: 'executive',
      domains: ['emergency_declaration', 'resource_allocation', 'interagency_coordination'],
      limitations: ['Subject to legislative oversight', 'Budget constraints'],
      budgetAuthority: 50000000,
      personnelAuthority: 500,
      emergencyPowers: true,
      declarationAuthority: true
    },
    members: [
      {
        id: 'member-001',
        name: 'Gov. Patricia Reynolds',
        title: 'Governor',
        role: 'Chair',
        organization: 'Office of the Governor',
        email: 'governor@state.gov',
        phone: '555-0001',
        votingRights: true,
        termStart: new Date('2023-01-15'),
        status: 'active',
        expertise: ['executive_leadership', 'public_policy'],
        committees: []
      }
    ],
    leadership: [
      {
        role: 'chair',
        memberId: 'member-001',
        memberName: 'Gov. Patricia Reynolds',
        appointedDate: new Date('2023-01-15')
      }
    ],
    meetingSchedule: {
      frequency: 'monthly',
      dayOfMonth: 15,
      time: '10:00',
      location: 'State Emergency Operations Center',
      virtualOption: true,
      quorumRequirement: 51
    },
    childBodies: [],
    contactInfo: {
      primaryPhone: '555-0100',
      emergencyPhone: '555-0911',
      email: 'emc@state.gov',
      website: 'https://emc.state.gov'
    },
    status: 'active',
    establishedDate: new Date('2010-03-01'),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleDecisions: GovernanceDecision[] = [
  {
    id: 'decision-001',
    title: 'Emergency Resource Allocation for Flood Response',
    description: 'Allocate emergency funds and resources for immediate flood response in affected counties.',
    type: 'resource_allocation',
    category: 'Emergency Response',
    priority: 'critical',
    status: 'approved',
    governanceBodyId: 'gov-body-001',
    governanceBodyName: 'Emergency Management Council',
    submittedBy: {
      id: 'submitter-001',
      name: 'Director James Chen',
      title: 'Emergency Management Director',
      organization: 'State Emergency Management Agency',
      email: 'jchen@sema.gov'
    },
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    context: {
      background: 'Severe flooding has affected 5 counties with over 10,000 residents displaced.',
      urgency: 'Immediate action required to support ongoing rescue and relief operations.',
      stakeholders: ['Affected residents', 'Local governments', 'First responders', 'NGOs'],
      constraints: ['Budget limitations', 'Resource availability', 'Access challenges'],
      risks: [
        { risk: 'Delayed response worsens conditions', mitigation: 'Pre-position resources' },
        { risk: 'Resource shortfall', mitigation: 'Coordinate with federal partners' }
      ]
    },
    options: [
      {
        id: 'opt-001',
        name: 'Full Emergency Funding',
        description: 'Allocate $10M immediately from emergency reserves',
        pros: ['Immediate resource availability', 'Comprehensive response'],
        cons: ['Depletes emergency reserves', 'May exceed actual needs'],
        cost: 10000000,
        timeframe: 'Immediate',
        recommendation: true
      }
    ],
    selectedOption: 'opt-001',
    approvalChain: [
      {
        order: 1,
        approverRole: 'Emergency Management Director',
        approverId: 'approver-001',
        approverName: 'Director James Chen',
        status: 'approved',
        actionDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        order: 2,
        approverRole: 'Governor',
        approverId: 'member-001',
        approverName: 'Gov. Patricia Reynolds',
        status: 'approved',
        actionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ],
    attachments: [],
    impact: {
      affected: {
        population: 50000,
        area: '5 counties',
        organizations: ['Local fire departments', 'Police', 'EMS', 'Red Cross'],
        services: ['Shelter operations', 'Food distribution', 'Medical care']
      },
      financial: {
        cost: 10000000,
        funding: 'Emergency Reserve Fund',
        budgetImpact: '20% of annual emergency reserves'
      },
      timeline: {
        implementation: 'Immediate deployment',
        milestones: [
          { name: 'Resource deployment', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Operations review', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
        ]
      }
    },
    deliberation: {
      discussions: [],
      votes: {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        method: 'voice',
        result: 'passed',
        yeas: 12,
        nays: 0,
        abstentions: 1,
        notVoting: 0,
        quorumMet: true
      },
      amendments: [],
      expertConsultations: []
    },
    outcome: {
      decision: 'Approved full emergency funding allocation',
      rationale: 'Urgent need and widespread impact require immediate comprehensive response',
      responsibleParty: 'State Emergency Management Agency',
      effectiveDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    appealable: false,
    relatedDecisions: [],
    tags: ['flood', 'emergency', 'resource_allocation'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class GovernanceService {
  private static instance: GovernanceService;
  private governanceBodies: Map<string, GovernanceBody> = new Map();
  private decisions: Map<string, GovernanceDecision> = new Map();
  private delegations: Map<string, AuthorityDelegation> = new Map();
  private accountabilityRecords: Map<string, AccountabilityRecord> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): GovernanceService {
    if (!GovernanceService.instance) {
      GovernanceService.instance = new GovernanceService();
    }
    return GovernanceService.instance;
  }

  private initializeSampleData(): void {
    sampleGovernanceBodies.forEach(b => this.governanceBodies.set(b.id, b));
    sampleDecisions.forEach(d => this.decisions.set(d.id, d));
  }

  // ==================== Governance Body Management ====================

  async createGovernanceBody(params: Omit<GovernanceBody, 'id' | 'createdAt' | 'updatedAt'>): Promise<GovernanceBody> {
    const body: GovernanceBody = {
      ...params,
      id: `gov-body-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.governanceBodies.set(body.id, body);
    return body;
  }

  async getGovernanceBody(bodyId: string): Promise<GovernanceBody | null> {
    return this.governanceBodies.get(bodyId) || null;
  }

  async getGovernanceBodies(params?: {
    type?: GovernanceBody['type'];
    level?: GovernanceLevel;
    status?: GovernanceBody['status'];
    hasEmergencyPowers?: boolean;
  }): Promise<GovernanceBody[]> {
    let bodies = Array.from(this.governanceBodies.values());

    if (params?.type) {
      bodies = bodies.filter(b => b.type === params.type);
    }

    if (params?.level) {
      bodies = bodies.filter(b => b.level === params.level);
    }

    if (params?.status) {
      bodies = bodies.filter(b => b.status === params.status);
    }

    if (params?.hasEmergencyPowers) {
      bodies = bodies.filter(b => b.authority.emergencyPowers);
    }

    return bodies;
  }

  async updateGovernanceBody(bodyId: string, update: Partial<GovernanceBody>): Promise<GovernanceBody> {
    const body = this.governanceBodies.get(bodyId);
    if (!body) throw new Error(`Governance body not found: ${bodyId}`);

    Object.assign(body, update, { updatedAt: new Date() });
    return body;
  }

  async addMember(bodyId: string, member: GovernanceMember): Promise<GovernanceBody> {
    const body = this.governanceBodies.get(bodyId);
    if (!body) throw new Error(`Governance body not found: ${bodyId}`);

    body.members.push(member);
    body.updatedAt = new Date();
    return body;
  }

  async removeMember(bodyId: string, memberId: string, reason: string): Promise<GovernanceBody> {
    const body = this.governanceBodies.get(bodyId);
    if (!body) throw new Error(`Governance body not found: ${bodyId}`);

    const member = body.members.find(m => m.id === memberId);
    if (member) {
      member.status = 'removed';
    }

    body.updatedAt = new Date();
    return body;
  }

  // ==================== Decision Management ====================

  async createDecision(params: Omit<GovernanceDecision, 'id' | 'status' | 'deliberation' | 'createdAt' | 'updatedAt'>): Promise<GovernanceDecision> {
    const decision: GovernanceDecision = {
      ...params,
      id: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      deliberation: {
        discussions: [],
        amendments: [],
        expertConsultations: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.decisions.set(decision.id, decision);
    return decision;
  }

  async getDecision(decisionId: string): Promise<GovernanceDecision | null> {
    return this.decisions.get(decisionId) || null;
  }

  async getDecisions(params?: {
    governanceBodyId?: string;
    type?: GovernanceDecision['type'];
    status?: DecisionStatus;
    priority?: DecisionPriority;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<GovernanceDecision[]> {
    let decisions = Array.from(this.decisions.values());

    if (params?.governanceBodyId) {
      decisions = decisions.filter(d => d.governanceBodyId === params.governanceBodyId);
    }

    if (params?.type) {
      decisions = decisions.filter(d => d.type === params.type);
    }

    if (params?.status) {
      decisions = decisions.filter(d => d.status === params.status);
    }

    if (params?.priority) {
      decisions = decisions.filter(d => d.priority === params.priority);
    }

    if (params?.startDate) {
      decisions = decisions.filter(d => d.submittedAt >= params.startDate!);
    }

    if (params?.endDate) {
      decisions = decisions.filter(d => d.submittedAt <= params.endDate!);
    }

    // Sort by priority then date
    const priorityOrder: Record<DecisionPriority, number> = {
      emergency: 0,
      critical: 1,
      high: 2,
      medium: 3,
      low: 4
    };

    decisions.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.submittedAt.getTime() - a.submittedAt.getTime();
    });

    if (params?.limit) {
      decisions = decisions.slice(0, params.limit);
    }

    return decisions;
  }

  async submitForApproval(decisionId: string): Promise<GovernanceDecision> {
    const decision = this.decisions.get(decisionId);
    if (!decision) throw new Error(`Decision not found: ${decisionId}`);

    decision.status = 'under_review';
    decision.currentApprover = decision.approvalChain.find(s => s.status === 'pending')?.approverId;
    decision.updatedAt = new Date();

    return decision;
  }

  async processApproval(decisionId: string, approverId: string, action: {
    approved: boolean;
    comments?: string;
    conditions?: string[];
  }): Promise<GovernanceDecision> {
    const decision = this.decisions.get(decisionId);
    if (!decision) throw new Error(`Decision not found: ${decisionId}`);

    const step = decision.approvalChain.find(s =>
      s.approverId === approverId && s.status === 'pending'
    );

    if (!step) throw new Error('No pending approval step found for this approver');

    step.status = action.approved ? 'approved' : 'rejected';
    step.actionDate = new Date();
    step.comments = action.comments;
    step.conditions = action.conditions;

    // Check if all approvals complete
    const allApproved = decision.approvalChain.every(s => s.status === 'approved');
    const anyRejected = decision.approvalChain.some(s => s.status === 'rejected');

    if (anyRejected) {
      decision.status = 'rejected';
    } else if (allApproved) {
      decision.status = 'approved';
    } else {
      // Move to next approver
      const nextStep = decision.approvalChain.find(s => s.status === 'pending');
      decision.currentApprover = nextStep?.approverId;
    }

    decision.updatedAt = new Date();
    return decision;
  }

  async escalateDecision(decisionId: string, reason: string, targetBodyId: string): Promise<GovernanceDecision> {
    const decision = this.decisions.get(decisionId);
    if (!decision) throw new Error(`Decision not found: ${decisionId}`);

    const targetBody = this.governanceBodies.get(targetBodyId);
    if (!targetBody) throw new Error(`Target governance body not found: ${targetBodyId}`);

    decision.status = 'escalated';
    decision.governanceBodyId = targetBodyId;
    decision.governanceBodyName = targetBody.name;
    decision.updatedAt = new Date();

    // Add escalation to deliberation
    decision.deliberation.discussions.push({
      date: new Date(),
      participants: [],
      summary: `Decision escalated: ${reason}`,
      keyPoints: [reason],
      concerns: []
    });

    return decision;
  }

  async recordVote(decisionId: string, vote: VotingRecord): Promise<GovernanceDecision> {
    const decision = this.decisions.get(decisionId);
    if (!decision) throw new Error(`Decision not found: ${decisionId}`);

    decision.deliberation.votes = vote;

    if (vote.result === 'passed') {
      decision.status = 'approved';
    } else if (vote.result === 'failed') {
      decision.status = 'rejected';
    } else if (vote.result === 'tabled') {
      decision.status = 'deferred';
    }

    decision.updatedAt = new Date();
    return decision;
  }

  async implementDecision(decisionId: string, outcome: DecisionOutcome): Promise<GovernanceDecision> {
    const decision = this.decisions.get(decisionId);
    if (!decision) throw new Error(`Decision not found: ${decisionId}`);

    decision.outcome = outcome;
    decision.status = 'implemented';
    decision.updatedAt = new Date();

    return decision;
  }

  async fileAppeal(decisionId: string, appeal: Omit<Appeal, 'id' | 'status'>): Promise<GovernanceDecision> {
    const decision = this.decisions.get(decisionId);
    if (!decision) throw new Error(`Decision not found: ${decisionId}`);

    if (!decision.appealable) {
      throw new Error('This decision is not appealable');
    }

    decision.appeal = {
      ...appeal,
      id: `appeal-${Date.now()}`,
      status: 'filed'
    };

    decision.updatedAt = new Date();
    return decision;
  }

  // ==================== Authority Delegation ====================

  async createDelegation(params: Omit<AuthorityDelegation, 'id' | 'status' | 'createdAt'>): Promise<AuthorityDelegation> {
    const delegation: AuthorityDelegation = {
      ...params,
      id: `delegation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      createdAt: new Date()
    };

    this.delegations.set(delegation.id, delegation);
    return delegation;
  }

  async getDelegations(params?: {
    delegatorId?: string;
    delegateeId?: string;
    status?: AuthorityDelegation['status'];
  }): Promise<AuthorityDelegation[]> {
    let delegations = Array.from(this.delegations.values());

    if (params?.delegatorId) {
      delegations = delegations.filter(d => d.delegatorId === params.delegatorId);
    }

    if (params?.delegateeId) {
      delegations = delegations.filter(d => d.delegateeId === params.delegateeId);
    }

    if (params?.status) {
      delegations = delegations.filter(d => d.status === params.status);
    }

    return delegations;
  }

  async revokeDelegation(delegationId: string, reason: string): Promise<AuthorityDelegation> {
    const delegation = this.delegations.get(delegationId);
    if (!delegation) throw new Error(`Delegation not found: ${delegationId}`);

    delegation.status = 'revoked';
    return delegation;
  }

  async checkDelegationValidity(delegateeId: string, authority: string): Promise<{
    valid: boolean;
    delegation?: AuthorityDelegation;
    reason?: string;
  }> {
    const delegations = await this.getDelegations({
      delegateeId,
      status: 'active'
    });

    for (const delegation of delegations) {
      if (delegation.scope.authorities.includes(authority)) {
        // Check if not expired
        if (delegation.endDate && delegation.endDate < new Date()) {
          delegation.status = 'expired';
          return { valid: false, delegation, reason: 'Delegation has expired' };
        }

        // Check exclusions
        if (delegation.scope.excludedMatters.includes(authority)) {
          return { valid: false, delegation, reason: 'Authority is in excluded matters' };
        }

        return { valid: true, delegation };
      }
    }

    return { valid: false, reason: 'No delegation found for this authority' };
  }

  // ==================== Accountability ====================

  async createAccountabilityRecord(params: Omit<AccountabilityRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccountabilityRecord> {
    const record: AccountabilityRecord = {
      ...params,
      id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accountabilityRecords.set(record.id, record);
    return record;
  }

  async getAccountabilityRecords(params?: {
    entityType?: AccountabilityRecord['entityType'];
    entityId?: string;
    status?: AccountabilityRecord['status'];
  }): Promise<AccountabilityRecord[]> {
    let records = Array.from(this.accountabilityRecords.values());

    if (params?.entityType) {
      records = records.filter(r => r.entityType === params.entityType);
    }

    if (params?.entityId) {
      records = records.filter(r => r.entityId === params.entityId);
    }

    if (params?.status) {
      records = records.filter(r => r.status === params.status);
    }

    return records;
  }

  async submitAuditFinding(recordId: string, audit: AuditRecord): Promise<AccountabilityRecord> {
    const record = this.accountabilityRecords.get(recordId);
    if (!record) throw new Error(`Accountability record not found: ${recordId}`);

    record.audits.push(audit);

    // Add issues from critical findings
    for (const finding of audit.findings.filter(f => f.severity === 'critical' || f.severity === 'high')) {
      record.issues.push({
        id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        description: finding.finding,
        severity: finding.severity === 'critical' ? 'critical' : 'major',
        identifiedDate: audit.date,
        source: 'audit',
        status: 'identified'
      });
    }

    record.updatedAt = new Date();
    return record;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalGovernanceBodies: number;
    activeGovernanceBodies: number;
    totalDecisions: number;
    pendingDecisions: number;
    approvedDecisions: number;
    rejectedDecisions: number;
    activeDelegations: number;
    complianceRate: number;
    byLevel: Record<GovernanceLevel, number>;
    byDecisionType: Record<string, number>;
    averageApprovalTime: number;
    emergencyDecisions: number;
  }> {
    const bodies = Array.from(this.governanceBodies.values());
    const decisions = Array.from(this.decisions.values());
    const delegations = Array.from(this.delegations.values());
    const accountability = Array.from(this.accountabilityRecords.values());

    const byLevel: Record<GovernanceLevel, number> = {} as any;
    bodies.forEach(b => {
      byLevel[b.level] = (byLevel[b.level] || 0) + 1;
    });

    const byDecisionType: Record<string, number> = {};
    decisions.forEach(d => {
      byDecisionType[d.type] = (byDecisionType[d.type] || 0) + 1;
    });

    // Calculate average approval time for approved decisions
    let totalApprovalTime = 0;
    let approvedCount = 0;
    for (const decision of decisions.filter(d => d.status === 'approved' && d.outcome)) {
      const submittedTime = decision.submittedAt.getTime();
      const approvedTime = decision.outcome!.effectiveDate.getTime();
      totalApprovalTime += (approvedTime - submittedTime) / (1000 * 60 * 60 * 24); // days
      approvedCount++;
    }

    const complianceCount = accountability.filter(a => a.status === 'compliant').length;

    return {
      totalGovernanceBodies: bodies.length,
      activeGovernanceBodies: bodies.filter(b => b.status === 'active').length,
      totalDecisions: decisions.length,
      pendingDecisions: decisions.filter(d => d.status === 'pending' || d.status === 'under_review').length,
      approvedDecisions: decisions.filter(d => d.status === 'approved' || d.status === 'implemented').length,
      rejectedDecisions: decisions.filter(d => d.status === 'rejected').length,
      activeDelegations: delegations.filter(d => d.status === 'active').length,
      complianceRate: accountability.length > 0 ? (complianceCount / accountability.length) * 100 : 100,
      byLevel,
      byDecisionType,
      averageApprovalTime: approvedCount > 0 ? totalApprovalTime / approvedCount : 0,
      emergencyDecisions: decisions.filter(d => d.priority === 'emergency' || d.priority === 'critical').length
    };
  }
}

export const governanceService = GovernanceService.getInstance();
export default GovernanceService;

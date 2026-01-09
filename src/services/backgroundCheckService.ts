/**
 * Background Check Service - Issue #172 Implementation
 * 
 * Provides comprehensive personnel vetting and background check management
 * for disaster response including security clearances, criminal history checks,
 * reference verification, and continuous evaluation programs.
 */

// Type definitions
type CheckType = 'criminal' | 'credit' | 'employment' | 'education' | 'reference' | 'identity' | 'drug_test' | 'driving' | 'professional_license' | 'international';
type CheckStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired' | 'cancelled';
type ClearanceLevel = 'none' | 'public_trust' | 'confidential' | 'secret' | 'top_secret' | 'sci';
type VettingResult = 'approved' | 'conditionally_approved' | 'denied' | 'pending_review' | 'escalated';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Background check interfaces
interface BackgroundCheck {
  id: string;
  checkNumber: string;
  subjectId: string;
  subjectInfo: SubjectInfo;
  type: CheckType;
  status: CheckStatus;
  requestedBy: RequestorInfo;
  requestDate: Date;
  priority: 'standard' | 'expedited' | 'urgent';
  scope: CheckScope;
  provider: ProviderInfo;
  consent: ConsentInfo;
  results?: CheckResults;
  flags: CheckFlag[];
  timeline: CheckTimelineEvent[];
  documents: CheckDocument[];
  notes: CheckNote[];
  expirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SubjectInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  ssn?: string;
  email: string;
  phone: string;
  address: AddressInfo;
  aliases?: string[];
  citizenship: string;
  employeeId?: string;
  positionApplying?: string;
}

interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  yearsAtAddress?: number;
}

interface RequestorInfo {
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  organization: string;
}

interface CheckScope {
  yearsBack: number;
  jurisdictions: string[];
  databases: string[];
  verifications: string[];
  specialRequirements?: string[];
}

interface ProviderInfo {
  name: string;
  type: 'internal' | 'vendor' | 'government';
  contactName?: string;
  contactEmail?: string;
  referenceNumber?: string;
  submittedDate?: Date;
  completedDate?: Date;
}

interface ConsentInfo {
  obtained: boolean;
  consentDate?: Date;
  consentMethod: 'electronic' | 'paper' | 'verbal';
  consentFormId?: string;
  fcraCompliant: boolean;
  stateNotices?: string[];
}

interface CheckResults {
  overall: VettingResult;
  completedDate: Date;
  summary: string;
  riskLevel: RiskLevel;
  components: ComponentResult[];
  recommendation?: string;
  reviewedBy?: string;
  reviewDate?: Date;
}

interface ComponentResult {
  type: string;
  status: 'clear' | 'hit' | 'unable_to_verify' | 'pending';
  details: string;
  records?: RecordHit[];
  verifiedDate?: Date;
}

interface RecordHit {
  type: string;
  date?: Date;
  jurisdiction?: string;
  description: string;
  disposition?: string;
  severity: RiskLevel;
}

interface CheckFlag {
  id: string;
  type: 'criminal' | 'credit' | 'employment_gap' | 'discrepancy' | 'identity' | 'other';
  severity: RiskLevel;
  description: string;
  details: string;
  resolution?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedDate?: Date;
}

interface CheckTimelineEvent {
  timestamp: Date;
  event: string;
  actor: string;
  details?: string;
}

interface CheckDocument {
  id: string;
  type: 'consent_form' | 'authorization' | 'report' | 'supporting_document' | 'adjudication';
  name: string;
  uploadedAt: Date;
  uploadedBy: string;
  url?: string;
}

interface CheckNote {
  id: string;
  timestamp: Date;
  author: string;
  content: string;
  type: 'general' | 'adjudication' | 'follow_up';
  confidential: boolean;
}

// Security clearance interfaces
interface SecurityClearance {
  id: string;
  holderId: string;
  holderName: string;
  level: ClearanceLevel;
  status: 'active' | 'interim' | 'suspended' | 'revoked' | 'expired' | 'pending';
  sponsoringAgency: string;
  grantedDate?: Date;
  expirationDate?: Date;
  investigationType: string;
  accessAuthorizations: AccessAuthorization[];
  indoctrinations: Indoctrination[];
  briefings: SecurityBriefing[];
  investigations: ClearanceInvestigation[];
  incidents: ClearanceIncident[];
  continuousEvaluation: ContinuousEvaluationInfo;
  adjudication?: AdjudicationInfo;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AccessAuthorization {
  id: string;
  type: string;
  program?: string;
  grantedDate: Date;
  expirationDate?: Date;
  status: 'active' | 'expired' | 'revoked';
  grantedBy: string;
}

interface Indoctrination {
  id: string;
  type: string;
  program: string;
  date: Date;
  briefer: string;
  expirationDate?: Date;
  debriefDate?: Date;
}

interface SecurityBriefing {
  id: string;
  type: 'initial' | 'annual' | 'special' | 'debrief';
  topic: string;
  date: Date;
  conductor: string;
  acknowledged: boolean;
  nextDue?: Date;
}

interface ClearanceInvestigation {
  id: string;
  type: string;
  initiatedDate: Date;
  completedDate?: Date;
  agency: string;
  caseNumber?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'closed';
  result?: string;
}

interface ClearanceIncident {
  id: string;
  type: 'security_violation' | 'foreign_contact' | 'financial' | 'criminal' | 'suspicious_activity' | 'other';
  date: Date;
  description: string;
  reportedBy: string;
  investigation?: string;
  outcome?: string;
  impact?: string;
}

interface ContinuousEvaluationInfo {
  enrolled: boolean;
  enrollmentDate?: Date;
  lastCheck?: Date;
  nextCheck?: Date;
  alerts: CEAlert[];
  status: 'clear' | 'review_required' | 'action_required';
}

interface CEAlert {
  id: string;
  date: Date;
  type: string;
  source: string;
  description: string;
  severity: RiskLevel;
  status: 'new' | 'reviewing' | 'resolved' | 'escalated';
  resolution?: string;
}

interface AdjudicationInfo {
  decision: 'granted' | 'denied' | 'revoked' | 'suspended';
  date: Date;
  adjudicator: string;
  rationale: string;
  conditions?: string[];
  appealInfo?: {
    filed: boolean;
    filedDate?: Date;
    status?: string;
    outcome?: string;
  };
}

// Vetting program interfaces
interface VettingProgram {
  id: string;
  name: string;
  description: string;
  type: 'pre_employment' | 'volunteer' | 'contractor' | 'disaster_response' | 'sensitive_position';
  status: 'active' | 'inactive' | 'draft';
  requirements: VettingRequirement[];
  positions: PositionRequirement[];
  workflow: VettingWorkflow;
  slas: SLASLA[];
  complianceStandards: string[];
  effectiveDate: Date;
  reviewDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VettingRequirement {
  id: string;
  checkType: CheckType;
  mandatory: boolean;
  frequency: 'once' | 'annual' | 'biennial' | 'continuous';
  scope: CheckScope;
  acceptanceCriteria: string[];
}

interface PositionRequirement {
  positionTitle: string;
  positionCategory: string;
  clearanceRequired: ClearanceLevel;
  checksRequired: CheckType[];
  specialRequirements?: string[];
}

interface VettingWorkflow {
  stages: WorkflowStage[];
  escalationPath: string[];
  approvalAuthorities: { level: string; authority: string; scope: string }[];
  automaticActions: { trigger: string; action: string }[];
}

interface WorkflowStage {
  order: number;
  name: string;
  description: string;
  responsibleRole: string;
  expectedDuration: number;
  requiredActions: string[];
  nextStage?: string;
  alternateStages?: { condition: string; stage: string }[];
}

interface SLASLA {
  checkType: string;
  targetDays: number;
  warningDays: number;
  escalationDays: number;
  priority: string;
}

// Reference check interfaces
interface ReferenceCheck {
  id: string;
  backgroundCheckId: string;
  subjectName: string;
  reference: ReferenceInfo;
  status: 'pending' | 'contacted' | 'completed' | 'unable_to_reach' | 'declined';
  questions: ReferenceQuestion[];
  response?: ReferenceResponse;
  attempts: ContactAttempt[];
  verifiedRelationship: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReferenceInfo {
  name: string;
  title?: string;
  organization?: string;
  relationship: string;
  yearsKnown: number;
  phone: string;
  email?: string;
  preferredContact: 'phone' | 'email';
}

interface ReferenceQuestion {
  id: string;
  question: string;
  category: 'character' | 'performance' | 'skills' | 'reliability' | 'recommendation';
  required: boolean;
  answer?: string;
}

interface ReferenceResponse {
  respondedDate: Date;
  overallRating: 1 | 2 | 3 | 4 | 5;
  wouldRehire?: boolean;
  strengths: string[];
  concerns: string[];
  additionalComments?: string;
  verifiedBy: string;
}

interface ContactAttempt {
  timestamp: Date;
  method: 'phone' | 'email' | 'mail';
  result: 'no_answer' | 'left_message' | 'spoke_with' | 'email_sent' | 'bounced';
  notes?: string;
  attemptedBy: string;
}

// Identity verification interfaces
interface IdentityVerification {
  id: string;
  subjectId: string;
  subjectName: string;
  status: 'pending' | 'verified' | 'failed' | 'requires_review';
  verificationDate?: Date;
  methods: VerificationMethod[];
  documents: IdentityDocument[];
  biometrics?: BiometricData;
  matchScore?: number;
  fraudIndicators: FraudIndicator[];
  result?: VerificationResult;
  createdAt: Date;
  updatedAt: Date;
}

interface VerificationMethod {
  type: 'document' | 'knowledge' | 'biometric' | 'database' | 'live';
  status: 'passed' | 'failed' | 'pending';
  score?: number;
  details: string;
  timestamp: Date;
}

interface IdentityDocument {
  type: 'passport' | 'drivers_license' | 'state_id' | 'military_id' | 'birth_certificate' | 'ssn_card' | 'other';
  documentNumber?: string;
  issuingAuthority: string;
  issueDate?: Date;
  expirationDate?: Date;
  verified: boolean;
  verificationMethod: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

interface BiometricData {
  fingerprints?: { captured: boolean; quality: string; matchResult?: string };
  facial?: { captured: boolean; quality: string; matchResult?: string };
  signature?: { captured: boolean; matchResult?: string };
}

interface FraudIndicator {
  type: string;
  severity: RiskLevel;
  description: string;
  source: string;
  resolved: boolean;
}

interface VerificationResult {
  verified: boolean;
  confidence: number;
  issues: string[];
  recommendations: string[];
  reviewedBy?: string;
  reviewDate?: Date;
}

// Sample data
const sampleBackgroundChecks: BackgroundCheck[] = [
  {
    id: 'bgc-001',
    checkNumber: 'BGC-2024-001234',
    subjectId: 'subj-001',
    subjectInfo: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new Date('1985-03-15'),
      email: 'jsmith@email.com',
      phone: '555-0123',
      address: {
        street: '123 Oak Street',
        city: 'Springfield',
        state: 'CA',
        zipCode: '95814',
        country: 'USA',
        yearsAtAddress: 3
      },
      citizenship: 'US Citizen',
      positionApplying: 'Emergency Response Coordinator'
    },
    type: 'criminal',
    status: 'completed',
    requestedBy: {
      name: 'Jane Doe',
      title: 'HR Manager',
      department: 'Human Resources',
      email: 'jdoe@agency.gov',
      phone: '555-0100',
      organization: 'County Emergency Management'
    },
    requestDate: new Date('2024-01-10'),
    priority: 'standard',
    scope: {
      yearsBack: 7,
      jurisdictions: ['Federal', 'California', 'All Counties'],
      databases: ['NCIC', 'State Criminal Database', 'Sex Offender Registry'],
      verifications: ['SSN Trace', 'Address History']
    },
    provider: {
      name: 'SecureCheck Inc.',
      type: 'vendor',
      contactEmail: 'orders@securecheck.com',
      referenceNumber: 'SC-2024-5678',
      submittedDate: new Date('2024-01-11'),
      completedDate: new Date('2024-01-15')
    },
    consent: {
      obtained: true,
      consentDate: new Date('2024-01-10'),
      consentMethod: 'electronic',
      consentFormId: 'CF-2024-001',
      fcraCompliant: true,
      stateNotices: ['California Consumer Rights Notice']
    },
    results: {
      overall: 'approved',
      completedDate: new Date('2024-01-15'),
      summary: 'No adverse findings. Subject cleared for position.',
      riskLevel: 'low',
      components: [
        { type: 'SSN Verification', status: 'clear', details: 'SSN verified, matches subject information' },
        { type: 'Criminal History', status: 'clear', details: 'No criminal records found in searched jurisdictions' },
        { type: 'Sex Offender Registry', status: 'clear', details: 'Not listed on any sex offender registries' }
      ],
      recommendation: 'Approve for hire',
      reviewedBy: 'HR Background Check Team',
      reviewDate: new Date('2024-01-16')
    },
    flags: [],
    timeline: [
      { timestamp: new Date('2024-01-10'), event: 'Background check initiated', actor: 'Jane Doe' },
      { timestamp: new Date('2024-01-10'), event: 'Consent obtained electronically', actor: 'System' },
      { timestamp: new Date('2024-01-11'), event: 'Submitted to vendor', actor: 'System' },
      { timestamp: new Date('2024-01-15'), event: 'Results received', actor: 'SecureCheck Inc.' },
      { timestamp: new Date('2024-01-16'), event: 'Review completed - Approved', actor: 'HR Team' }
    ],
    documents: [
      { id: 'doc-001', type: 'consent_form', name: 'Electronic Consent Form', uploadedAt: new Date('2024-01-10'), uploadedBy: 'System' },
      { id: 'doc-002', type: 'report', name: 'Background Check Report', uploadedAt: new Date('2024-01-15'), uploadedBy: 'SecureCheck Inc.' }
    ],
    notes: [],
    expirationDate: new Date('2025-01-15'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-16')
  }
];

const sampleClearances: SecurityClearance[] = [
  {
    id: 'clear-001',
    holderId: 'emp-001',
    holderName: 'Sarah Johnson',
    level: 'secret',
    status: 'active',
    sponsoringAgency: 'Department of Homeland Security',
    grantedDate: new Date('2022-06-15'),
    expirationDate: new Date('2032-06-15'),
    investigationType: 'Tier 3 (T3)',
    accessAuthorizations: [
      {
        id: 'auth-001',
        type: 'Classified Systems Access',
        grantedDate: new Date('2022-06-20'),
        status: 'active',
        grantedBy: 'Security Office'
      }
    ],
    indoctrinations: [],
    briefings: [
      {
        id: 'brief-001',
        type: 'initial',
        topic: 'Initial Security Briefing',
        date: new Date('2022-06-15'),
        conductor: 'Security Officer Smith',
        acknowledged: true,
        nextDue: new Date('2024-06-15')
      }
    ],
    investigations: [
      {
        id: 'inv-001',
        type: 'T3 Investigation',
        initiatedDate: new Date('2022-01-15'),
        completedDate: new Date('2022-06-10'),
        agency: 'DCSA',
        caseNumber: 'DCSA-2022-123456',
        status: 'completed',
        result: 'Favorable'
      }
    ],
    incidents: [],
    continuousEvaluation: {
      enrolled: true,
      enrollmentDate: new Date('2022-06-15'),
      lastCheck: new Date('2024-01-01'),
      nextCheck: new Date('2024-04-01'),
      alerts: [],
      status: 'clear'
    },
    adjudication: {
      decision: 'granted',
      date: new Date('2022-06-15'),
      adjudicator: 'Central Adjudication Facility',
      rationale: 'No disqualifying factors found. Background investigation favorable.'
    },
    notes: '',
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date()
  }
];

class BackgroundCheckService {
  private static instance: BackgroundCheckService;
  private backgroundChecks: Map<string, BackgroundCheck> = new Map();
  private securityClearances: Map<string, SecurityClearance> = new Map();
  private vettingPrograms: Map<string, VettingProgram> = new Map();
  private referenceChecks: Map<string, ReferenceCheck> = new Map();
  private identityVerifications: Map<string, IdentityVerification> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): BackgroundCheckService {
    if (!BackgroundCheckService.instance) {
      BackgroundCheckService.instance = new BackgroundCheckService();
    }
    return BackgroundCheckService.instance;
  }

  private initializeSampleData(): void {
    sampleBackgroundChecks.forEach(b => this.backgroundChecks.set(b.id, b));
    sampleClearances.forEach(c => this.securityClearances.set(c.id, c));
  }

  // ==================== Background Check Management ====================

  async createBackgroundCheck(params: Omit<BackgroundCheck, 'id' | 'checkNumber' | 'status' | 'flags' | 'timeline' | 'documents' | 'notes' | 'createdAt' | 'updatedAt'>): Promise<BackgroundCheck> {
    const check: BackgroundCheck = {
      ...params,
      id: `bgc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      checkNumber: `BGC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'pending',
      flags: [],
      timeline: [{ timestamp: new Date(), event: 'Background check initiated', actor: params.requestedBy.name }],
      documents: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.backgroundChecks.set(check.id, check);
    return check;
  }

  async getBackgroundCheck(checkId: string): Promise<BackgroundCheck | null> {
    return this.backgroundChecks.get(checkId) || null;
  }

  async getBackgroundChecks(params?: {
    type?: CheckType;
    status?: CheckStatus;
    subjectId?: string;
    requestedBy?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<BackgroundCheck[]> {
    let checks = Array.from(this.backgroundChecks.values());

    if (params?.type) {
      checks = checks.filter(c => c.type === params.type);
    }

    if (params?.status) {
      checks = checks.filter(c => c.status === params.status);
    }

    if (params?.subjectId) {
      checks = checks.filter(c => c.subjectId === params.subjectId);
    }

    if (params?.requestedBy) {
      checks = checks.filter(c => c.requestedBy.name.includes(params.requestedBy!));
    }

    if (params?.startDate) {
      checks = checks.filter(c => c.requestDate >= params.startDate!);
    }

    if (params?.endDate) {
      checks = checks.filter(c => c.requestDate <= params.endDate!);
    }

    return checks.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async updateCheckStatus(checkId: string, status: CheckStatus, actor: string, details?: string): Promise<BackgroundCheck> {
    const check = this.backgroundChecks.get(checkId);
    if (!check) throw new Error(`Background check not found: ${checkId}`);

    check.status = status;
    check.timeline.push({
      timestamp: new Date(),
      event: `Status changed to ${status}${details ? `: ${details}` : ''}`,
      actor
    });
    check.updatedAt = new Date();
    return check;
  }

  async submitCheckResults(checkId: string, results: CheckResults): Promise<BackgroundCheck> {
    const check = this.backgroundChecks.get(checkId);
    if (!check) throw new Error(`Background check not found: ${checkId}`);

    check.results = results;
    check.status = 'completed';
    check.timeline.push({
      timestamp: new Date(),
      event: `Results submitted: ${results.overall}`,
      actor: results.reviewedBy || 'System'
    });
    check.updatedAt = new Date();
    return check;
  }

  async addFlag(checkId: string, flag: Omit<CheckFlag, 'id' | 'resolved'>): Promise<BackgroundCheck> {
    const check = this.backgroundChecks.get(checkId);
    if (!check) throw new Error(`Background check not found: ${checkId}`);

    check.flags.push({
      ...flag,
      id: `flag-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      resolved: false
    });
    check.timeline.push({
      timestamp: new Date(),
      event: `Flag added: ${flag.type} - ${flag.description}`,
      actor: 'System'
    });
    check.updatedAt = new Date();
    return check;
  }

  async resolveFlag(checkId: string, flagId: string, resolution: string, resolvedBy: string): Promise<BackgroundCheck> {
    const check = this.backgroundChecks.get(checkId);
    if (!check) throw new Error(`Background check not found: ${checkId}`);

    const flag = check.flags.find(f => f.id === flagId);
    if (!flag) throw new Error(`Flag not found: ${flagId}`);

    flag.resolved = true;
    flag.resolution = resolution;
    flag.resolvedBy = resolvedBy;
    flag.resolvedDate = new Date();

    check.timeline.push({
      timestamp: new Date(),
      event: `Flag resolved: ${flag.type}`,
      actor: resolvedBy
    });
    check.updatedAt = new Date();
    return check;
  }

  async addDocument(checkId: string, document: Omit<CheckDocument, 'id'>): Promise<BackgroundCheck> {
    const check = this.backgroundChecks.get(checkId);
    if (!check) throw new Error(`Background check not found: ${checkId}`);

    check.documents.push({
      ...document,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    check.updatedAt = new Date();
    return check;
  }

  // ==================== Security Clearance Management ====================

  async createSecurityClearance(params: Omit<SecurityClearance, 'id' | 'accessAuthorizations' | 'indoctrinations' | 'briefings' | 'investigations' | 'incidents' | 'createdAt' | 'updatedAt'>): Promise<SecurityClearance> {
    const clearance: SecurityClearance = {
      ...params,
      id: `clear-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      accessAuthorizations: [],
      indoctrinations: [],
      briefings: [],
      investigations: [],
      incidents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.securityClearances.set(clearance.id, clearance);
    return clearance;
  }

  async getSecurityClearance(clearanceId: string): Promise<SecurityClearance | null> {
    return this.securityClearances.get(clearanceId) || null;
  }

  async getClearanceByHolder(holderId: string): Promise<SecurityClearance | null> {
    return Array.from(this.securityClearances.values()).find(c => c.holderId === holderId) || null;
  }

  async getSecurityClearances(params?: {
    level?: ClearanceLevel;
    status?: SecurityClearance['status'];
    sponsoringAgency?: string;
    expiringWithinDays?: number;
  }): Promise<SecurityClearance[]> {
    let clearances = Array.from(this.securityClearances.values());

    if (params?.level) {
      clearances = clearances.filter(c => c.level === params.level);
    }

    if (params?.status) {
      clearances = clearances.filter(c => c.status === params.status);
    }

    if (params?.sponsoringAgency) {
      clearances = clearances.filter(c => c.sponsoringAgency.includes(params.sponsoringAgency!));
    }

    if (params?.expiringWithinDays) {
      const cutoff = new Date(Date.now() + params.expiringWithinDays * 24 * 60 * 60 * 1000);
      clearances = clearances.filter(c => c.expirationDate && c.expirationDate <= cutoff);
    }

    return clearances.sort((a, b) => a.holderName.localeCompare(b.holderName));
  }

  async updateClearanceStatus(clearanceId: string, status: SecurityClearance['status'], reason?: string): Promise<SecurityClearance> {
    const clearance = this.securityClearances.get(clearanceId);
    if (!clearance) throw new Error(`Clearance not found: ${clearanceId}`);

    clearance.status = status;
    if (reason) {
      clearance.notes += `\n[${new Date().toISOString()}] Status changed to ${status}: ${reason}`;
    }
    clearance.updatedAt = new Date();
    return clearance;
  }

  async addAccessAuthorization(clearanceId: string, auth: Omit<AccessAuthorization, 'id'>): Promise<SecurityClearance> {
    const clearance = this.securityClearances.get(clearanceId);
    if (!clearance) throw new Error(`Clearance not found: ${clearanceId}`);

    clearance.accessAuthorizations.push({
      ...auth,
      id: `auth-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    clearance.updatedAt = new Date();
    return clearance;
  }

  async addSecurityBriefing(clearanceId: string, briefing: Omit<SecurityBriefing, 'id'>): Promise<SecurityClearance> {
    const clearance = this.securityClearances.get(clearanceId);
    if (!clearance) throw new Error(`Clearance not found: ${clearanceId}`);

    clearance.briefings.push({
      ...briefing,
      id: `brief-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    clearance.updatedAt = new Date();
    return clearance;
  }

  async reportClearanceIncident(clearanceId: string, incident: Omit<ClearanceIncident, 'id'>): Promise<SecurityClearance> {
    const clearance = this.securityClearances.get(clearanceId);
    if (!clearance) throw new Error(`Clearance not found: ${clearanceId}`);

    clearance.incidents.push({
      ...incident,
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    clearance.updatedAt = new Date();
    return clearance;
  }

  async addCEAlert(clearanceId: string, alert: Omit<CEAlert, 'id' | 'status'>): Promise<SecurityClearance> {
    const clearance = this.securityClearances.get(clearanceId);
    if (!clearance) throw new Error(`Clearance not found: ${clearanceId}`);

    clearance.continuousEvaluation.alerts.push({
      ...alert,
      id: `ce-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'new'
    });
    clearance.continuousEvaluation.status = alert.severity === 'critical' || alert.severity === 'high' ? 'action_required' : 'review_required';
    clearance.updatedAt = new Date();
    return clearance;
  }

  // ==================== Vetting Program Management ====================

  async createVettingProgram(params: Omit<VettingProgram, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<VettingProgram> {
    const program: VettingProgram = {
      ...params,
      id: `prog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.vettingPrograms.set(program.id, program);
    return program;
  }

  async getVettingProgram(programId: string): Promise<VettingProgram | null> {
    return this.vettingPrograms.get(programId) || null;
  }

  async getVettingPrograms(params?: {
    type?: VettingProgram['type'];
    status?: VettingProgram['status'];
  }): Promise<VettingProgram[]> {
    let programs = Array.from(this.vettingPrograms.values());

    if (params?.type) {
      programs = programs.filter(p => p.type === params.type);
    }

    if (params?.status) {
      programs = programs.filter(p => p.status === params.status);
    }

    return programs;
  }

  // ==================== Reference Check Management ====================

  async createReferenceCheck(params: Omit<ReferenceCheck, 'id' | 'status' | 'attempts' | 'verifiedRelationship' | 'createdAt' | 'updatedAt'>): Promise<ReferenceCheck> {
    const refCheck: ReferenceCheck = {
      ...params,
      id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      attempts: [],
      verifiedRelationship: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.referenceChecks.set(refCheck.id, refCheck);
    return refCheck;
  }

  async getReferenceCheck(refCheckId: string): Promise<ReferenceCheck | null> {
    return this.referenceChecks.get(refCheckId) || null;
  }

  async getReferencesByBackgroundCheck(bgcId: string): Promise<ReferenceCheck[]> {
    return Array.from(this.referenceChecks.values())
      .filter(r => r.backgroundCheckId === bgcId);
  }

  async recordContactAttempt(refCheckId: string, attempt: ContactAttempt): Promise<ReferenceCheck> {
    const refCheck = this.referenceChecks.get(refCheckId);
    if (!refCheck) throw new Error(`Reference check not found: ${refCheckId}`);

    refCheck.attempts.push(attempt);
    if (attempt.result === 'spoke_with') {
      refCheck.status = 'contacted';
    }
    refCheck.updatedAt = new Date();
    return refCheck;
  }

  async submitReferenceResponse(refCheckId: string, response: ReferenceResponse): Promise<ReferenceCheck> {
    const refCheck = this.referenceChecks.get(refCheckId);
    if (!refCheck) throw new Error(`Reference check not found: ${refCheckId}`);

    refCheck.response = response;
    refCheck.status = 'completed';
    refCheck.verifiedRelationship = true;
    refCheck.updatedAt = new Date();
    return refCheck;
  }

  // ==================== Identity Verification ====================

  async createIdentityVerification(params: Omit<IdentityVerification, 'id' | 'status' | 'methods' | 'fraudIndicators' | 'createdAt' | 'updatedAt'>): Promise<IdentityVerification> {
    const verification: IdentityVerification = {
      ...params,
      id: `idv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      methods: [],
      fraudIndicators: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.identityVerifications.set(verification.id, verification);
    return verification;
  }

  async getIdentityVerification(verificationId: string): Promise<IdentityVerification | null> {
    return this.identityVerifications.get(verificationId) || null;
  }

  async addVerificationMethod(verificationId: string, method: VerificationMethod): Promise<IdentityVerification> {
    const verification = this.identityVerifications.get(verificationId);
    if (!verification) throw new Error(`Verification not found: ${verificationId}`);

    verification.methods.push(method);
    verification.updatedAt = new Date();
    return verification;
  }

  async completeVerification(verificationId: string, result: VerificationResult): Promise<IdentityVerification> {
    const verification = this.identityVerifications.get(verificationId);
    if (!verification) throw new Error(`Verification not found: ${verificationId}`);

    verification.result = result;
    verification.status = result.verified ? 'verified' : 'failed';
    verification.verificationDate = new Date();
    verification.matchScore = result.confidence;
    verification.updatedAt = new Date();
    return verification;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalBackgroundChecks: number;
    pendingChecks: number;
    completedChecks: number;
    approvedRate: number;
    averageProcessingDays: number;
    checksByType: Record<CheckType, number>;
    checksByStatus: Record<CheckStatus, number>;
    totalClearances: number;
    activeClearances: number;
    clearancesByLevel: Record<ClearanceLevel, number>;
    expiringClearances: number;
    pendingInvestigations: number;
    openFlags: number;
    highRiskFlags: number;
    referenceCompletionRate: number;
    identityVerificationRate: number;
  }> {
    const checks = Array.from(this.backgroundChecks.values());
    const clearances = Array.from(this.securityClearances.values());
    const references = Array.from(this.referenceChecks.values());
    const idVerifications = Array.from(this.identityVerifications.values());

    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const checksByType: Record<CheckType, number> = {} as any;
    const checksByStatus: Record<CheckStatus, number> = {} as any;
    let totalProcessingDays = 0;
    let completedWithDates = 0;

    checks.forEach(c => {
      checksByType[c.type] = (checksByType[c.type] || 0) + 1;
      checksByStatus[c.status] = (checksByStatus[c.status] || 0) + 1;

      if (c.results?.completedDate && c.requestDate) {
        totalProcessingDays += (c.results.completedDate.getTime() - c.requestDate.getTime()) / (1000 * 60 * 60 * 24);
        completedWithDates++;
      }
    });

    const clearancesByLevel: Record<ClearanceLevel, number> = {} as any;
    clearances.forEach(c => {
      clearancesByLevel[c.level] = (clearancesByLevel[c.level] || 0) + 1;
    });

    const completedChecks = checks.filter(c => c.status === 'completed');
    const approvedChecks = completedChecks.filter(c => c.results?.overall === 'approved');

    return {
      totalBackgroundChecks: checks.length,
      pendingChecks: checks.filter(c => ['pending', 'in_progress'].includes(c.status)).length,
      completedChecks: completedChecks.length,
      approvedRate: completedChecks.length > 0 ? (approvedChecks.length / completedChecks.length) * 100 : 0,
      averageProcessingDays: completedWithDates > 0 ? totalProcessingDays / completedWithDates : 0,
      checksByType,
      checksByStatus,
      totalClearances: clearances.length,
      activeClearances: clearances.filter(c => c.status === 'active').length,
      clearancesByLevel,
      expiringClearances: clearances.filter(c => c.expirationDate && c.expirationDate <= thirtyDaysFromNow).length,
      pendingInvestigations: clearances.reduce((sum, c) => 
        sum + c.investigations.filter(i => i.status === 'pending' || i.status === 'in_progress').length, 0
      ),
      openFlags: checks.reduce((sum, c) => sum + c.flags.filter(f => !f.resolved).length, 0),
      highRiskFlags: checks.reduce((sum, c) => 
        sum + c.flags.filter(f => !f.resolved && (f.severity === 'high' || f.severity === 'critical')).length, 0
      ),
      referenceCompletionRate: references.length > 0 
        ? (references.filter(r => r.status === 'completed').length / references.length) * 100 
        : 0,
      identityVerificationRate: idVerifications.length > 0
        ? (idVerifications.filter(v => v.status === 'verified').length / idVerifications.length) * 100
        : 0
    };
  }
}

export const backgroundCheckService = BackgroundCheckService.getInstance();
export default BackgroundCheckService;

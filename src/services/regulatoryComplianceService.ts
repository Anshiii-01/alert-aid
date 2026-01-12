/**
 * Regulatory Compliance Service - Issue #159 Implementation
 * 
 * Provides comprehensive regulatory compliance management for disaster response
 * including regulatory tracking, compliance monitoring, audit management,
 * permit handling, and regulatory reporting.
 */

// Type definitions
type RegulationType = 'federal' | 'state' | 'local' | 'industry' | 'international';
type ComplianceLevel = 'full' | 'substantial' | 'partial' | 'minimal' | 'non_compliant';
type AuditType = 'scheduled' | 'unscheduled' | 'self' | 'third_party' | 'regulatory';
type PermitStatus = 'pending' | 'approved' | 'active' | 'expired' | 'suspended' | 'revoked' | 'renewal_pending';
type ViolationType = 'administrative' | 'technical' | 'safety' | 'environmental' | 'financial' | 'procedural';

// Regulation interfaces
interface Regulation {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  type: RegulationType;
  issuingAuthority: string;
  enforcementAgency: string;
  category: string;
  subcategory?: string;
  effectiveDate: Date;
  lastAmendedDate?: Date;
  expirationDate?: Date;
  status: 'proposed' | 'active' | 'amended' | 'repealed' | 'superseded';
  requirements: RegulatoryRequirement[];
  applicability: RegulatoryApplicability;
  penalties: RegulatoryPenalty[];
  relatedRegulations: string[];
  references: { title: string; url?: string; citation?: string }[];
  guidance: RegulatoryGuidance[];
  updates: RegulationUpdate[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface RegulatoryRequirement {
  id: string;
  description: string;
  category: string;
  type: 'mandatory' | 'conditional' | 'recommended';
  applicableTo: string[];
  complianceCriteria: string[];
  evidenceRequired: string[];
  frequency?: string;
  deadline?: Date;
  exemptions?: string[];
}

interface RegulatoryApplicability {
  industries: string[];
  organizationTypes: string[];
  organizationSizes: string[];
  geographicAreas: string[];
  activities: string[];
  thresholds?: { metric: string; value: number; unit: string }[];
  exemptions: { type: string; criteria: string[]; approvalRequired: boolean }[];
}

interface RegulatoryPenalty {
  violationType: ViolationType;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  penaltyType: 'fine' | 'suspension' | 'revocation' | 'criminal' | 'corrective_action';
  description: string;
  minPenalty?: number;
  maxPenalty?: number;
  escalation?: string;
}

interface RegulatoryGuidance {
  id: string;
  title: string;
  type: 'faq' | 'interpretation' | 'best_practice' | 'checklist' | 'template';
  content: string;
  publishedDate: Date;
  url?: string;
}

interface RegulationUpdate {
  date: Date;
  type: 'amendment' | 'clarification' | 'guidance' | 'enforcement_action';
  description: string;
  effectiveDate?: Date;
  source?: string;
}

// Compliance record interfaces
interface ComplianceRecord {
  id: string;
  organizationId: string;
  organizationName: string;
  regulationId: string;
  regulationCode: string;
  regulationTitle: string;
  status: ComplianceLevel;
  assessmentDate: Date;
  nextAssessmentDate: Date;
  assessor: string;
  requirementStatus: RequirementStatus[];
  overallScore: number;
  gaps: ComplianceGapItem[];
  correctiveActions: CorrectiveAction[];
  evidence: EvidenceItem[];
  history: AssessmentHistory[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RequirementStatus {
  requirementId: string;
  description: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable' | 'pending';
  score: number;
  evidence: string[];
  findings?: string;
  lastVerified: Date;
}

interface ComplianceGapItem {
  id: string;
  requirementId: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rootCause?: string;
  businessImpact?: string;
  regulatoryRisk?: string;
  status: 'open' | 'in_remediation' | 'closed' | 'accepted_risk';
  identifiedDate: Date;
  targetClosureDate?: Date;
  actualClosureDate?: Date;
}

interface CorrectiveAction {
  id: string;
  gapId: string;
  description: string;
  type: 'immediate' | 'short_term' | 'long_term' | 'preventive';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  completedDate?: Date;
  verificationRequired: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
  resources?: string[];
  cost?: number;
}

interface EvidenceItem {
  id: string;
  requirementId: string;
  type: 'document' | 'record' | 'photo' | 'video' | 'certificate' | 'report' | 'log';
  title: string;
  description?: string;
  url: string;
  uploadedBy: string;
  uploadedDate: Date;
  validUntil?: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
}

interface AssessmentHistory {
  date: Date;
  type: string;
  assessor: string;
  score: number;
  status: ComplianceLevel;
  summary: string;
  findings: number;
  improvements: string[];
}

// Audit interfaces
interface ComplianceAudit {
  id: string;
  title: string;
  type: AuditType;
  scope: string;
  organizationId: string;
  organizationName: string;
  regulationIds: string[];
  status: 'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled';
  schedule: AuditSchedule;
  team: AuditTeamMember[];
  plan: AuditPlan;
  fieldwork: AuditFieldwork;
  findings: AuditFinding[];
  report?: AuditReport;
  followUp: AuditFollowUp;
  createdAt: Date;
  updatedAt: Date;
}

interface AuditSchedule {
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  fieldworkDates: { start: Date; end: Date }[];
  reportDueDate: Date;
  milestones: { name: string; plannedDate: Date; actualDate?: Date }[];
}

interface AuditTeamMember {
  id: string;
  name: string;
  role: 'lead' | 'auditor' | 'specialist' | 'observer';
  organization?: string;
  responsibilities: string[];
  qualifications: string[];
  email: string;
  phone?: string;
}

interface AuditPlan {
  objectives: string[];
  scope: {
    included: string[];
    excluded: string[];
  };
  methodology: string;
  criteria: string[];
  riskAreas: string[];
  samplingApproach?: string;
  resources: string[];
  communications: { type: string; frequency: string; audience: string }[];
}

interface AuditFieldwork {
  activities: AuditActivity[];
  interviews: AuditInterview[];
  observations: AuditObservation[];
  documentReviews: DocumentReview[];
  tests: AuditTest[];
}

interface AuditActivity {
  id: string;
  date: Date;
  description: string;
  auditor: string;
  status: 'planned' | 'completed' | 'cancelled';
  notes?: string;
}

interface AuditInterview {
  id: string;
  interviewee: string;
  title: string;
  date: Date;
  auditor: string;
  topics: string[];
  keyFindings: string[];
  followUpRequired: boolean;
  notes?: string;
}

interface AuditObservation {
  id: string;
  date: Date;
  location: string;
  auditor: string;
  description: string;
  findings: string[];
  photos?: string[];
}

interface DocumentReview {
  id: string;
  documentTitle: string;
  documentType: string;
  reviewDate: Date;
  auditor: string;
  findings: string[];
  adequacy: 'adequate' | 'inadequate' | 'needs_improvement';
  notes?: string;
}

interface AuditTest {
  id: string;
  testName: string;
  description: string;
  date: Date;
  auditor: string;
  methodology: string;
  sampleSize?: number;
  result: 'pass' | 'fail' | 'partial' | 'inconclusive';
  findings: string[];
  evidence?: string[];
}

interface AuditFinding {
  id: string;
  type: 'non_conformity' | 'observation' | 'opportunity' | 'strength';
  severity: 'minor' | 'major' | 'critical';
  area: string;
  description: string;
  criteria: string;
  evidence: string[];
  rootCause?: string;
  recommendation: string;
  managementResponse?: string;
  status: 'draft' | 'confirmed' | 'disputed' | 'closed';
}

interface AuditReport {
  executiveSummary: string;
  scope: string;
  methodology: string;
  findings: AuditFinding[];
  conclusion: string;
  overallRating: 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  recommendations: string[];
  managementActionPlan?: { finding: string; action: string; owner: string; dueDate: Date }[];
  distribution: string[];
  issuedDate: Date;
  issuedBy: string;
}

interface AuditFollowUp {
  required: boolean;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'not_required';
  activities: { date: Date; description: string; outcome: string }[];
  closureDate?: Date;
  closedBy?: string;
}

// Permit interfaces
interface RegulatoryPermit {
  id: string;
  permitNumber: string;
  type: string;
  title: string;
  description: string;
  organizationId: string;
  organizationName: string;
  issuingAuthority: string;
  regulationId?: string;
  status: PermitStatus;
  application: PermitApplication;
  conditions: PermitCondition[];
  effectiveDate?: Date;
  expirationDate?: Date;
  renewalDate?: Date;
  fees: PermitFee[];
  inspections: PermitInspection[];
  modifications: PermitModification[];
  violations: PermitViolation[];
  documents: PermitDocument[];
  contacts: PermitContact[];
  createdAt: Date;
  updatedAt: Date;
}

interface PermitApplication {
  applicationDate: Date;
  applicant: string;
  applicationNumber: string;
  status: 'submitted' | 'under_review' | 'additional_info_requested' | 'approved' | 'denied';
  reviewNotes?: string;
  decisionDate?: Date;
  decisionBy?: string;
  denialReason?: string;
}

interface PermitCondition {
  id: string;
  description: string;
  type: 'general' | 'specific' | 'monitoring' | 'reporting' | 'operational';
  frequency?: string;
  deadline?: Date;
  complianceRequired: boolean;
  currentStatus: 'compliant' | 'non_compliant' | 'pending_verification';
}

interface PermitFee {
  type: 'application' | 'issuance' | 'renewal' | 'modification' | 'inspection';
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paidDate?: Date;
  receiptNumber?: string;
}

interface PermitInspection {
  id: string;
  type: 'routine' | 'complaint' | 'follow_up' | 'pre_approval';
  scheduledDate: Date;
  actualDate?: Date;
  inspector: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  result?: 'satisfactory' | 'unsatisfactory' | 'conditional';
  findings: string[];
  correctiveActionsRequired: string[];
  nextInspectionDate?: Date;
  report?: string;
}

interface PermitModification {
  id: string;
  requestDate: Date;
  requestedBy: string;
  description: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied' | 'withdrawn';
  reviewNotes?: string;
  decisionDate?: Date;
  effectiveDate?: Date;
}

interface PermitViolation {
  id: string;
  date: Date;
  description: string;
  conditionId?: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  identifiedBy: string;
  status: 'identified' | 'under_investigation' | 'confirmed' | 'remediated' | 'closed';
  correctiveAction?: string;
  penalty?: number;
  resolutionDate?: Date;
}

interface PermitDocument {
  id: string;
  type: 'application' | 'permit' | 'inspection_report' | 'correspondence' | 'supporting';
  title: string;
  url: string;
  uploadedDate: Date;
  uploadedBy: string;
}

interface PermitContact {
  role: 'applicant' | 'responsible_party' | 'technical' | 'regulatory';
  name: string;
  title?: string;
  organization?: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

// Sample data
const sampleRegulations: Regulation[] = [
  {
    id: 'reg-001',
    code: 'FEMA-44-CFR',
    title: 'Emergency Management and Assistance',
    shortTitle: 'FEMA Regulations',
    description: 'Federal regulations governing emergency management, disaster assistance, and related programs.',
    type: 'federal',
    issuingAuthority: 'Federal Emergency Management Agency',
    enforcementAgency: 'FEMA',
    category: 'Emergency Management',
    effectiveDate: new Date('2020-01-01'),
    status: 'active',
    requirements: [
      {
        id: 'req-001',
        description: 'Maintain comprehensive emergency operations plan',
        category: 'Planning',
        type: 'mandatory',
        applicableTo: ['State agencies', 'Local governments'],
        complianceCriteria: ['Plan updated annually', 'Includes all hazards', 'Reviewed by FEMA'],
        evidenceRequired: ['Current EOP document', 'FEMA approval letter'],
        frequency: 'Annual review'
      }
    ],
    applicability: {
      industries: ['Government', 'Emergency Services'],
      organizationTypes: ['Federal agencies', 'State agencies', 'Local governments'],
      organizationSizes: ['All sizes'],
      geographicAreas: ['United States'],
      activities: ['Emergency management', 'Disaster response'],
      exemptions: []
    },
    penalties: [
      {
        violationType: 'procedural',
        severity: 'major',
        penaltyType: 'corrective_action',
        description: 'Failure to maintain compliant EOP may result in ineligibility for federal disaster assistance'
      }
    ],
    relatedRegulations: [],
    references: [
      { title: 'Stafford Act', citation: '42 U.S.C. § 5121-5207' }
    ],
    guidance: [],
    updates: [],
    tags: ['federal', 'fema', 'emergency_management'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class RegulatoryComplianceService {
  private static instance: RegulatoryComplianceService;
  private regulations: Map<string, Regulation> = new Map();
  private complianceRecords: Map<string, ComplianceRecord> = new Map();
  private audits: Map<string, ComplianceAudit> = new Map();
  private permits: Map<string, RegulatoryPermit> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): RegulatoryComplianceService {
    if (!RegulatoryComplianceService.instance) {
      RegulatoryComplianceService.instance = new RegulatoryComplianceService();
    }
    return RegulatoryComplianceService.instance;
  }

  private initializeSampleData(): void {
    sampleRegulations.forEach(r => this.regulations.set(r.id, r));
  }

  // ==================== Regulation Management ====================

  async createRegulation(params: Omit<Regulation, 'id' | 'updates' | 'createdAt' | 'updatedAt'>): Promise<Regulation> {
    const regulation: Regulation = {
      ...params,
      id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      updates: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.regulations.set(regulation.id, regulation);
    return regulation;
  }

  async getRegulation(regulationId: string): Promise<Regulation | null> {
    return this.regulations.get(regulationId) || null;
  }

  async getRegulations(params?: {
    type?: RegulationType;
    category?: string;
    status?: Regulation['status'];
    issuingAuthority?: string;
    search?: string;
  }): Promise<Regulation[]> {
    let regulations = Array.from(this.regulations.values());

    if (params?.type) {
      regulations = regulations.filter(r => r.type === params.type);
    }

    if (params?.category) {
      regulations = regulations.filter(r => r.category === params.category);
    }

    if (params?.status) {
      regulations = regulations.filter(r => r.status === params.status);
    }

    if (params?.issuingAuthority) {
      regulations = regulations.filter(r =>
        r.issuingAuthority.toLowerCase().includes(params.issuingAuthority!.toLowerCase())
      );
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      regulations = regulations.filter(r =>
        r.title.toLowerCase().includes(searchLower) ||
        r.code.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
      );
    }

    return regulations.sort((a, b) => a.code.localeCompare(b.code));
  }

  async updateRegulation(regulationId: string, update: Partial<Regulation>): Promise<Regulation> {
    const regulation = this.regulations.get(regulationId);
    if (!regulation) throw new Error(`Regulation not found: ${regulationId}`);

    Object.assign(regulation, update, { updatedAt: new Date() });
    return regulation;
  }

  async addRegulationUpdate(regulationId: string, update: RegulationUpdate): Promise<Regulation> {
    const regulation = this.regulations.get(regulationId);
    if (!regulation) throw new Error(`Regulation not found: ${regulationId}`);

    regulation.updates.push(update);
    regulation.lastAmendedDate = update.date;
    regulation.updatedAt = new Date();

    return regulation;
  }

  async getApplicableRegulations(params: {
    industry?: string;
    organizationType?: string;
    activity?: string;
    geographicArea?: string;
  }): Promise<Regulation[]> {
    const regulations = Array.from(this.regulations.values()).filter(r => r.status === 'active');

    return regulations.filter(r => {
      const app = r.applicability;

      if (params.industry && !app.industries.includes(params.industry) && !app.industries.includes('All')) {
        return false;
      }

      if (params.organizationType && !app.organizationTypes.includes(params.organizationType) && !app.organizationTypes.includes('All')) {
        return false;
      }

      if (params.activity && !app.activities.includes(params.activity) && !app.activities.includes('All')) {
        return false;
      }

      if (params.geographicArea && !app.geographicAreas.includes(params.geographicArea) && !app.geographicAreas.includes('All')) {
        return false;
      }

      return true;
    });
  }

  // ==================== Compliance Tracking ====================

  async createComplianceRecord(params: Omit<ComplianceRecord, 'id' | 'gaps' | 'correctiveActions' | 'evidence' | 'history' | 'createdAt' | 'updatedAt'>): Promise<ComplianceRecord> {
    const record: ComplianceRecord = {
      ...params,
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      gaps: [],
      correctiveActions: [],
      evidence: [],
      history: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.complianceRecords.set(record.id, record);
    return record;
  }

  async getComplianceRecord(recordId: string): Promise<ComplianceRecord | null> {
    return this.complianceRecords.get(recordId) || null;
  }

  async getComplianceRecords(params?: {
    organizationId?: string;
    regulationId?: string;
    status?: ComplianceLevel;
  }): Promise<ComplianceRecord[]> {
    let records = Array.from(this.complianceRecords.values());

    if (params?.organizationId) {
      records = records.filter(r => r.organizationId === params.organizationId);
    }

    if (params?.regulationId) {
      records = records.filter(r => r.regulationId === params.regulationId);
    }

    if (params?.status) {
      records = records.filter(r => r.status === params.status);
    }

    return records;
  }

  async assessCompliance(recordId: string, requirementStatus: RequirementStatus[]): Promise<ComplianceRecord> {
    const record = this.complianceRecords.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    record.requirementStatus = requirementStatus;

    // Calculate overall score
    const scores = requirementStatus.filter(r => r.status !== 'not_applicable').map(r => r.score);
    record.overallScore = scores.length > 0
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length
      : 100;

    // Determine status
    if (record.overallScore >= 95) {
      record.status = 'full';
    } else if (record.overallScore >= 80) {
      record.status = 'substantial';
    } else if (record.overallScore >= 60) {
      record.status = 'partial';
    } else if (record.overallScore >= 40) {
      record.status = 'minimal';
    } else {
      record.status = 'non_compliant';
    }

    // Record history
    record.history.push({
      date: new Date(),
      type: 'Assessment',
      assessor: record.assessor,
      score: record.overallScore,
      status: record.status,
      summary: `Compliance assessment completed with ${record.overallScore.toFixed(1)}% score`,
      findings: record.gaps.filter(g => g.status === 'open').length,
      improvements: []
    });

    record.assessmentDate = new Date();
    record.updatedAt = new Date();

    return record;
  }

  async addComplianceGap(recordId: string, gap: Omit<ComplianceGapItem, 'id' | 'status' | 'identifiedDate'>): Promise<ComplianceRecord> {
    const record = this.complianceRecords.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    record.gaps.push({
      ...gap,
      id: `gap-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'open',
      identifiedDate: new Date()
    });

    record.updatedAt = new Date();
    return record;
  }

  async addCorrectiveAction(recordId: string, action: Omit<CorrectiveAction, 'id' | 'status'>): Promise<ComplianceRecord> {
    const record = this.complianceRecords.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    record.correctiveActions.push({
      ...action,
      id: `ca-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'planned'
    });

    record.updatedAt = new Date();
    return record;
  }

  async uploadEvidence(recordId: string, evidence: Omit<EvidenceItem, 'id' | 'uploadedDate' | 'verified'>): Promise<ComplianceRecord> {
    const record = this.complianceRecords.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    record.evidence.push({
      ...evidence,
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      uploadedDate: new Date(),
      verified: false
    });

    record.updatedAt = new Date();
    return record;
  }

  async verifyEvidence(recordId: string, evidenceId: string, verifier: string): Promise<ComplianceRecord> {
    const record = this.complianceRecords.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    const evidence = record.evidence.find(e => e.id === evidenceId);
    if (!evidence) throw new Error(`Evidence not found: ${evidenceId}`);

    evidence.verified = true;
    evidence.verifiedBy = verifier;
    evidence.verifiedDate = new Date();

    record.updatedAt = new Date();
    return record;
  }

  // ==================== Audit Management ====================

  async createAudit(params: Omit<ComplianceAudit, 'id' | 'status' | 'fieldwork' | 'findings' | 'followUp' | 'createdAt' | 'updatedAt'>): Promise<ComplianceAudit> {
    const audit: ComplianceAudit = {
      ...params,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'planned',
      fieldwork: {
        activities: [],
        interviews: [],
        observations: [],
        documentReviews: [],
        tests: []
      },
      findings: [],
      followUp: {
        required: false,
        status: 'not_required',
        activities: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.audits.set(audit.id, audit);
    return audit;
  }

  async getAudit(auditId: string): Promise<ComplianceAudit | null> {
    return this.audits.get(auditId) || null;
  }

  async getAudits(params?: {
    organizationId?: string;
    type?: AuditType;
    status?: ComplianceAudit['status'];
    dateRange?: { start: Date; end: Date };
  }): Promise<ComplianceAudit[]> {
    let audits = Array.from(this.audits.values());

    if (params?.organizationId) {
      audits = audits.filter(a => a.organizationId === params.organizationId);
    }

    if (params?.type) {
      audits = audits.filter(a => a.type === params.type);
    }

    if (params?.status) {
      audits = audits.filter(a => a.status === params.status);
    }

    if (params?.dateRange) {
      audits = audits.filter(a =>
        a.schedule.plannedStartDate >= params.dateRange!.start &&
        a.schedule.plannedStartDate <= params.dateRange!.end
      );
    }

    return audits.sort((a, b) =>
      b.schedule.plannedStartDate.getTime() - a.schedule.plannedStartDate.getTime()
    );
  }

  async updateAuditStatus(auditId: string, status: ComplianceAudit['status']): Promise<ComplianceAudit> {
    const audit = this.audits.get(auditId);
    if (!audit) throw new Error(`Audit not found: ${auditId}`);

    audit.status = status;

    if (status === 'in_progress') {
      audit.schedule.actualStartDate = new Date();
    } else if (status === 'completed') {
      audit.schedule.actualEndDate = new Date();
    }

    audit.updatedAt = new Date();
    return audit;
  }

  async addAuditFinding(auditId: string, finding: Omit<AuditFinding, 'id' | 'status'>): Promise<ComplianceAudit> {
    const audit = this.audits.get(auditId);
    if (!audit) throw new Error(`Audit not found: ${auditId}`);

    audit.findings.push({
      ...finding,
      id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'draft'
    });

    audit.updatedAt = new Date();
    return audit;
  }

  async issueAuditReport(auditId: string, report: AuditReport): Promise<ComplianceAudit> {
    const audit = this.audits.get(auditId);
    if (!audit) throw new Error(`Audit not found: ${auditId}`);

    audit.report = report;
    audit.status = 'completed';

    // Determine if follow-up is required
    const majorFindings = audit.findings.filter(f =>
      f.type === 'non_conformity' && (f.severity === 'major' || f.severity === 'critical')
    );

    if (majorFindings.length > 0) {
      audit.followUp.required = true;
      audit.followUp.status = 'pending';
      audit.followUp.dueDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
    }

    audit.updatedAt = new Date();
    return audit;
  }

  // ==================== Permit Management ====================

  async createPermit(params: Omit<RegulatoryPermit, 'id' | 'status' | 'inspections' | 'modifications' | 'violations' | 'documents' | 'createdAt' | 'updatedAt'>): Promise<RegulatoryPermit> {
    const permit: RegulatoryPermit = {
      ...params,
      id: `permit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      inspections: [],
      modifications: [],
      violations: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.permits.set(permit.id, permit);
    return permit;
  }

  async getPermit(permitId: string): Promise<RegulatoryPermit | null> {
    return this.permits.get(permitId) || null;
  }

  async getPermits(params?: {
    organizationId?: string;
    type?: string;
    status?: PermitStatus;
    expiringSoon?: boolean;
  }): Promise<RegulatoryPermit[]> {
    let permits = Array.from(this.permits.values());

    if (params?.organizationId) {
      permits = permits.filter(p => p.organizationId === params.organizationId);
    }

    if (params?.type) {
      permits = permits.filter(p => p.type === params.type);
    }

    if (params?.status) {
      permits = permits.filter(p => p.status === params.status);
    }

    if (params?.expiringSoon) {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      permits = permits.filter(p =>
        p.expirationDate && p.expirationDate <= thirtyDaysFromNow && p.status === 'active'
      );
    }

    return permits;
  }

  async approvePermit(permitId: string, decisionBy: string): Promise<RegulatoryPermit> {
    const permit = this.permits.get(permitId);
    if (!permit) throw new Error(`Permit not found: ${permitId}`);

    permit.application.status = 'approved';
    permit.application.decisionDate = new Date();
    permit.application.decisionBy = decisionBy;
    permit.status = 'approved';
    permit.updatedAt = new Date();

    return permit;
  }

  async activatePermit(permitId: string, effectiveDate: Date, expirationDate: Date): Promise<RegulatoryPermit> {
    const permit = this.permits.get(permitId);
    if (!permit) throw new Error(`Permit not found: ${permitId}`);

    permit.status = 'active';
    permit.effectiveDate = effectiveDate;
    permit.expirationDate = expirationDate;
    permit.updatedAt = new Date();

    return permit;
  }

  async scheduleInspection(permitId: string, inspection: Omit<PermitInspection, 'id' | 'status'>): Promise<RegulatoryPermit> {
    const permit = this.permits.get(permitId);
    if (!permit) throw new Error(`Permit not found: ${permitId}`);

    permit.inspections.push({
      ...inspection,
      id: `insp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'scheduled'
    });

    permit.updatedAt = new Date();
    return permit;
  }

  async recordViolation(permitId: string, violation: Omit<PermitViolation, 'id' | 'status'>): Promise<RegulatoryPermit> {
    const permit = this.permits.get(permitId);
    if (!permit) throw new Error(`Permit not found: ${permitId}`);

    permit.violations.push({
      ...violation,
      id: `viol-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'identified'
    });

    permit.updatedAt = new Date();
    return permit;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalRegulations: number;
    activeRegulations: number;
    byType: Record<RegulationType, number>;
    totalComplianceRecords: number;
    averageComplianceScore: number;
    complianceByLevel: Record<ComplianceLevel, number>;
    openGaps: number;
    overdueCorrectiveActions: number;
    activeAudits: number;
    upcomingAudits: number;
    activePermits: number;
    expiringPermits: number;
    openViolations: number;
  }> {
    const regulations = Array.from(this.regulations.values());
    const complianceRecords = Array.from(this.complianceRecords.values());
    const audits = Array.from(this.audits.values());
    const permits = Array.from(this.permits.values());

    const byType: Record<RegulationType, number> = {} as any;
    regulations.forEach(r => {
      byType[r.type] = (byType[r.type] || 0) + 1;
    });

    const complianceByLevel: Record<ComplianceLevel, number> = {} as any;
    complianceRecords.forEach(c => {
      complianceByLevel[c.status] = (complianceByLevel[c.status] || 0) + 1;
    });

    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    let openGaps = 0;
    let overdueCorrectiveActions = 0;
    complianceRecords.forEach(r => {
      openGaps += r.gaps.filter(g => g.status === 'open' || g.status === 'in_remediation').length;
      overdueCorrectiveActions += r.correctiveActions.filter(a => a.status !== 'completed' && a.dueDate < now).length;
    });

    let openViolations = 0;
    permits.forEach(p => {
      openViolations += p.violations.filter(v => v.status !== 'closed').length;
    });

    return {
      totalRegulations: regulations.length,
      activeRegulations: regulations.filter(r => r.status === 'active').length,
      byType,
      totalComplianceRecords: complianceRecords.length,
      averageComplianceScore: complianceRecords.length > 0
        ? complianceRecords.reduce((sum, c) => sum + c.overallScore, 0) / complianceRecords.length
        : 100,
      complianceByLevel,
      openGaps,
      overdueCorrectiveActions,
      activeAudits: audits.filter(a => a.status === 'in_progress' || a.status === 'fieldwork').length,
      upcomingAudits: audits.filter(a => a.status === 'planned' && a.schedule.plannedStartDate <= thirtyDaysFromNow).length,
      activePermits: permits.filter(p => p.status === 'active').length,
      expiringPermits: permits.filter(p => p.status === 'active' && p.expirationDate && p.expirationDate <= thirtyDaysFromNow).length,
      openViolations
    };
  }
}

export const regulatoryComplianceService = RegulatoryComplianceService.getInstance();
export default RegulatoryComplianceService;

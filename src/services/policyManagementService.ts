/**
 * Policy Management Service - Issue #158 Implementation
 * 
 * Provides comprehensive policy management for disaster response
 * including policy creation, versioning, lifecycle management,
 * compliance tracking, and policy impact assessment.
 */

// Type definitions
type PolicyStatus = 'draft' | 'review' | 'approved' | 'active' | 'suspended' | 'superseded' | 'archived';
type PolicyCategory = 'emergency_response' | 'resource_management' | 'communication' | 'safety' | 'recovery' | 'mitigation' | 'preparedness' | 'coordination';
type PolicyScope = 'local' | 'district' | 'state' | 'regional' | 'national' | 'cross_jurisdictional';
type EnforcementLevel = 'mandatory' | 'recommended' | 'advisory' | 'optional';
type ComplianceStatus = 'compliant' | 'partial' | 'non_compliant' | 'exempt' | 'pending_review';

// Policy interfaces
interface Policy {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  category: PolicyCategory;
  type: 'law' | 'regulation' | 'guideline' | 'procedure' | 'directive' | 'standard' | 'protocol';
  scope: PolicyScope;
  jurisdiction: string;
  enforcementLevel: EnforcementLevel;
  status: PolicyStatus;
  version: PolicyVersion;
  versionHistory: PolicyVersion[];
  content: PolicyContent;
  authority: PolicyAuthority;
  applicability: PolicyApplicability;
  requirements: PolicyRequirement[];
  compliance: ComplianceFramework;
  effectiveDate: Date;
  expirationDate?: Date;
  reviewDate?: Date;
  relatedPolicies: string[];
  references: PolicyReference[];
  tags: string[];
  metadata: PolicyMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface PolicyVersion {
  version: string;
  status: PolicyStatus;
  effectiveDate: Date;
  expirationDate?: Date;
  changesDescription: string;
  approvedBy?: string;
  approvedDate?: Date;
  documentUrl?: string;
}

interface PolicyContent {
  purpose: string;
  background?: string;
  definitions: { term: string; definition: string }[];
  sections: PolicySection[];
  procedures: PolicyProcedure[];
  appendices?: PolicyAppendix[];
  forms?: PolicyForm[];
}

interface PolicySection {
  id: string;
  order: number;
  title: string;
  content: string;
  subsections?: {
    id: string;
    order: number;
    title: string;
    content: string;
  }[];
}

interface PolicyProcedure {
  id: string;
  title: string;
  description: string;
  steps: ProcedureStep[];
  responsible: string[];
  frequency?: string;
  triggers?: string[];
}

interface ProcedureStep {
  order: number;
  action: string;
  responsible: string;
  timeframe?: string;
  outputs?: string[];
  conditions?: string;
}

interface PolicyAppendix {
  id: string;
  title: string;
  content: string;
  attachments?: string[];
}

interface PolicyForm {
  id: string;
  name: string;
  description: string;
  url: string;
  version: string;
  mandatory: boolean;
}

interface PolicyAuthority {
  issuingAuthority: string;
  enactingBody: string;
  legalBasis?: string;
  delegatedFrom?: string;
  enforcementAuthority: string;
  penalties?: string[];
  appealProcess?: string;
}

interface PolicyApplicability {
  organizations: string[];
  roles: string[];
  geographicAreas: string[];
  scenarios: string[];
  exemptions: PolicyExemption[];
  conditions?: string[];
}

interface PolicyExemption {
  type: string;
  description: string;
  criteria: string[];
  approvalRequired: boolean;
  approvalAuthority?: string;
  duration?: string;
}

interface PolicyRequirement {
  id: string;
  description: string;
  category: string;
  enforcementLevel: EnforcementLevel;
  measurementCriteria: string[];
  evidenceRequired: string[];
  deadline?: Date;
  frequency?: string;
  responsible: string[];
}

interface ComplianceFramework {
  reviewFrequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  reportingRequirements: ReportingRequirement[];
  auditSchedule?: string;
  metrics: ComplianceMetric[];
  escalationPath: string[];
}

interface ReportingRequirement {
  type: string;
  frequency: string;
  format: string;
  recipient: string;
  deadline?: string;
}

interface ComplianceMetric {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
  measurementMethod: string;
}

interface PolicyReference {
  type: 'law' | 'regulation' | 'standard' | 'guideline' | 'external';
  title: string;
  citation?: string;
  url?: string;
  relevance: string;
}

interface PolicyMetadata {
  owner: string;
  author: string;
  reviewers: string[];
  approvers: string[];
  lastReviewedBy?: string;
  lastReviewDate?: Date;
  classification: 'public' | 'internal' | 'restricted' | 'confidential';
  language: string;
  translations?: string[];
}

// Policy review interfaces
interface PolicyReview {
  id: string;
  policyId: string;
  policyTitle: string;
  type: 'scheduled' | 'triggered' | 'mandatory' | 'compliance';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  initiatedBy: string;
  initiatedDate: Date;
  dueDate: Date;
  reviewers: Reviewer[];
  findings: ReviewFinding[];
  recommendations: ReviewRecommendation[];
  outcome?: ReviewOutcome;
  createdAt: Date;
  updatedAt: Date;
}

interface Reviewer {
  id: string;
  name: string;
  role: string;
  status: 'assigned' | 'reviewing' | 'completed' | 'declined';
  assignedDate: Date;
  completedDate?: Date;
  comments?: string;
}

interface ReviewFinding {
  id: string;
  category: 'clarity' | 'compliance' | 'effectiveness' | 'relevance' | 'consistency' | 'completeness';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  section?: string;
  evidence?: string;
  status: 'identified' | 'addressed' | 'deferred' | 'rejected';
}

interface ReviewRecommendation {
  id: string;
  type: 'amendment' | 'clarification' | 'addition' | 'removal' | 'restructure' | 'no_change';
  description: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'proposed' | 'accepted' | 'rejected' | 'implemented';
  implementedDate?: Date;
}

interface ReviewOutcome {
  decision: 'approve' | 'approve_with_changes' | 'reject' | 'defer';
  summary: string;
  changesRequired?: string[];
  nextReviewDate?: Date;
  approvedBy: string;
  approvedDate: Date;
}

// Compliance tracking interfaces
interface OrganizationCompliance {
  id: string;
  organizationId: string;
  organizationName: string;
  policyId: string;
  policyTitle: string;
  status: ComplianceStatus;
  assessmentDate: Date;
  nextAssessmentDate: Date;
  requirements: RequirementCompliance[];
  overallScore: number;
  gaps: ComplianceGap[];
  actions: ComplianceAction[];
  evidence: ComplianceEvidence[];
  history: ComplianceAssessment[];
  createdAt: Date;
  updatedAt: Date;
}

interface RequirementCompliance {
  requirementId: string;
  requirementDescription: string;
  status: ComplianceStatus;
  score: number;
  evidence: string[];
  notes?: string;
  lastVerified?: Date;
}

interface ComplianceGap {
  id: string;
  requirementId: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rootCause?: string;
  impact?: string;
  status: 'identified' | 'remediation' | 'resolved' | 'accepted_risk';
  dueDate?: Date;
  owner?: string;
}

interface ComplianceAction {
  id: string;
  gapId?: string;
  description: string;
  type: 'corrective' | 'preventive' | 'improvement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  dueDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  completedDate?: Date;
  verifiedBy?: string;
}

interface ComplianceEvidence {
  id: string;
  requirementId: string;
  type: 'document' | 'record' | 'observation' | 'interview' | 'test_result';
  description: string;
  url?: string;
  uploadedDate: Date;
  validUntil?: Date;
  verifiedBy?: string;
}

interface ComplianceAssessment {
  date: Date;
  assessor: string;
  type: 'self' | 'internal_audit' | 'external_audit' | 'regulatory';
  score: number;
  status: ComplianceStatus;
  findings: string[];
}

// Impact assessment interfaces
interface PolicyImpactAssessment {
  id: string;
  policyId: string;
  policyTitle: string;
  assessmentType: 'pre_implementation' | 'post_implementation' | 'periodic';
  status: 'draft' | 'in_progress' | 'completed' | 'approved';
  assessor: string;
  assessmentDate: Date;
  scope: {
    populations: string[];
    organizations: string[];
    geographicAreas: string[];
    timeframe: string;
  };
  impacts: ImpactArea[];
  stakeholderFeedback: StakeholderFeedback[];
  costBenefitAnalysis?: CostBenefitAnalysis;
  riskAssessment: RiskAssessmentItem[];
  recommendations: string[];
  conclusion: string;
  createdAt: Date;
}

interface ImpactArea {
  category: 'operational' | 'financial' | 'social' | 'environmental' | 'legal' | 'safety';
  description: string;
  magnitude: 'minimal' | 'minor' | 'moderate' | 'significant' | 'major';
  direction: 'positive' | 'negative' | 'neutral' | 'mixed';
  affectedGroups: string[];
  mitigationMeasures?: string[];
}

interface StakeholderFeedback {
  stakeholder: string;
  organization?: string;
  feedback: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  concerns: string[];
  suggestions: string[];
  collectedDate: Date;
}

interface CostBenefitAnalysis {
  costs: { item: string; amount: number; type: 'one_time' | 'recurring'; period?: string }[];
  benefits: { item: string; value: number; type: 'quantifiable' | 'qualitative'; description?: string }[];
  netBenefit: number;
  paybackPeriod?: string;
  roi?: number;
}

interface RiskAssessmentItem {
  risk: string;
  likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'almost_certain';
  impact: 'negligible' | 'minor' | 'moderate' | 'major' | 'catastrophic';
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  mitigation: string;
  residualRisk: string;
}

// Sample data
const samplePolicies: Policy[] = [
  {
    id: 'policy-001',
    code: 'ERP-001',
    title: 'Emergency Response Activation Protocol',
    shortTitle: 'Emergency Activation',
    description: 'Defines the procedures and criteria for activating emergency response operations across all levels.',
    category: 'emergency_response',
    type: 'protocol',
    scope: 'state',
    jurisdiction: 'Statewide',
    enforcementLevel: 'mandatory',
    status: 'active',
    version: {
      version: '3.0',
      status: 'active',
      effectiveDate: new Date('2024-01-01'),
      changesDescription: 'Updated activation thresholds and added remote activation procedures',
      approvedBy: 'Emergency Management Council',
      approvedDate: new Date('2023-12-15')
    },
    versionHistory: [],
    content: {
      purpose: 'To establish clear procedures for the activation of emergency response operations, ensuring rapid and coordinated response to emergencies.',
      definitions: [
        { term: 'Emergency', definition: 'An event that requires immediate action to protect life, property, or the environment' },
        { term: 'Activation Level', definition: 'A designation indicating the severity and scope of emergency response operations' }
      ],
      sections: [
        {
          id: 'sec-001',
          order: 1,
          title: 'Activation Levels',
          content: 'This section defines the four levels of emergency activation and their corresponding response requirements.'
        }
      ],
      procedures: [
        {
          id: 'proc-001',
          title: 'Emergency Activation Procedure',
          description: 'Steps to activate emergency response operations',
          steps: [
            { order: 1, action: 'Receive and verify emergency notification', responsible: 'Duty Officer', timeframe: '5 minutes' },
            { order: 2, action: 'Assess situation and determine activation level', responsible: 'Emergency Manager', timeframe: '15 minutes' },
            { order: 3, action: 'Notify required personnel and agencies', responsible: 'Communications Officer', timeframe: '30 minutes' }
          ],
          responsible: ['Emergency Management Agency'],
          triggers: ['Disaster event', 'Threat assessment', 'Request from local authority']
        }
      ]
    },
    authority: {
      issuingAuthority: 'State Emergency Management Agency',
      enactingBody: 'Emergency Management Council',
      legalBasis: 'Emergency Management Act Section 5.2',
      enforcementAuthority: 'State Emergency Management Agency',
      penalties: ['Administrative sanctions', 'Removal from duty'],
      appealProcess: 'Appeals may be filed with the Emergency Management Council within 30 days'
    },
    applicability: {
      organizations: ['All state agencies', 'Local emergency management offices', 'First responder agencies'],
      roles: ['Emergency managers', 'First responders', 'Agency heads'],
      geographicAreas: ['All state jurisdictions'],
      scenarios: ['Natural disasters', 'Technological incidents', 'Public health emergencies'],
      exemptions: []
    },
    requirements: [
      {
        id: 'req-001',
        description: 'Maintain 24/7 emergency notification capability',
        category: 'Operational',
        enforcementLevel: 'mandatory',
        measurementCriteria: ['System uptime > 99.9%', 'Response time < 5 minutes'],
        evidenceRequired: ['System logs', 'Drill reports'],
        responsible: ['Emergency Management Agency']
      }
    ],
    compliance: {
      reviewFrequency: 'annual',
      reportingRequirements: [
        { type: 'Activation Report', frequency: 'Per activation', format: 'Standard form', recipient: 'State Emergency Management Agency' }
      ],
      metrics: [
        { id: 'metric-001', name: 'Activation Time', description: 'Time from notification to full activation', target: 30, unit: 'minutes', measurementMethod: 'System timestamps' }
      ],
      escalationPath: ['Local Emergency Manager', 'Regional Coordinator', 'State Emergency Director']
    },
    effectiveDate: new Date('2024-01-01'),
    reviewDate: new Date('2025-01-01'),
    relatedPolicies: [],
    references: [
      { type: 'law', title: 'Emergency Management Act', citation: 'State Code Chapter 42', relevance: 'Legal authority for emergency operations' }
    ],
    tags: ['emergency', 'activation', 'response', 'protocol'],
    metadata: {
      owner: 'State Emergency Management Agency',
      author: 'Policy Division',
      reviewers: ['Operations Division', 'Legal Counsel'],
      approvers: ['Emergency Management Council'],
      classification: 'public',
      language: 'en'
    },
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date()
  }
];

class PolicyManagementService {
  private static instance: PolicyManagementService;
  private policies: Map<string, Policy> = new Map();
  private reviews: Map<string, PolicyReview> = new Map();
  private compliance: Map<string, OrganizationCompliance> = new Map();
  private impactAssessments: Map<string, PolicyImpactAssessment> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): PolicyManagementService {
    if (!PolicyManagementService.instance) {
      PolicyManagementService.instance = new PolicyManagementService();
    }
    return PolicyManagementService.instance;
  }

  private initializeSampleData(): void {
    samplePolicies.forEach(p => this.policies.set(p.id, p));
  }

  // ==================== Policy Management ====================

  async createPolicy(params: Omit<Policy, 'id' | 'version' | 'versionHistory' | 'createdAt' | 'updatedAt'>): Promise<Policy> {
    const policy: Policy = {
      ...params,
      id: `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      version: {
        version: '1.0',
        status: 'draft',
        effectiveDate: params.effectiveDate,
        changesDescription: 'Initial version'
      },
      versionHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.policies.set(policy.id, policy);
    return policy;
  }

  async getPolicy(policyId: string): Promise<Policy | null> {
    return this.policies.get(policyId) || null;
  }

  async getPolicies(params?: {
    category?: PolicyCategory;
    type?: Policy['type'];
    scope?: PolicyScope;
    status?: PolicyStatus;
    enforcementLevel?: EnforcementLevel;
    search?: string;
  }): Promise<Policy[]> {
    let policies = Array.from(this.policies.values());

    if (params?.category) {
      policies = policies.filter(p => p.category === params.category);
    }

    if (params?.type) {
      policies = policies.filter(p => p.type === params.type);
    }

    if (params?.scope) {
      policies = policies.filter(p => p.scope === params.scope);
    }

    if (params?.status) {
      policies = policies.filter(p => p.status === params.status);
    }

    if (params?.enforcementLevel) {
      policies = policies.filter(p => p.enforcementLevel === params.enforcementLevel);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      policies = policies.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.code.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return policies.sort((a, b) => a.code.localeCompare(b.code));
  }

  async updatePolicy(policyId: string, update: Partial<Policy>): Promise<Policy> {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy not found: ${policyId}`);

    Object.assign(policy, update, { updatedAt: new Date() });
    return policy;
  }

  async createNewVersion(policyId: string, params: {
    changesDescription: string;
    effectiveDate: Date;
    expirationDate?: Date;
  }): Promise<Policy> {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy not found: ${policyId}`);

    // Archive current version
    policy.versionHistory.push({ ...policy.version });

    // Parse current version
    const versionParts = policy.version.version.split('.');
    const major = parseInt(versionParts[0]);
    const minor = parseInt(versionParts[1] || '0');

    // Create new version
    policy.version = {
      version: `${major}.${minor + 1}`,
      status: 'draft',
      effectiveDate: params.effectiveDate,
      expirationDate: params.expirationDate,
      changesDescription: params.changesDescription
    };

    policy.updatedAt = new Date();
    return policy;
  }

  async submitForApproval(policyId: string): Promise<Policy> {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy not found: ${policyId}`);

    policy.status = 'review';
    policy.version.status = 'review';
    policy.updatedAt = new Date();

    return policy;
  }

  async approvePolicy(policyId: string, approver: string): Promise<Policy> {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy not found: ${policyId}`);

    policy.status = 'approved';
    policy.version.status = 'approved';
    policy.version.approvedBy = approver;
    policy.version.approvedDate = new Date();
    policy.updatedAt = new Date();

    return policy;
  }

  async activatePolicy(policyId: string): Promise<Policy> {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy not found: ${policyId}`);

    if (policy.status !== 'approved') {
      throw new Error('Policy must be approved before activation');
    }

    policy.status = 'active';
    policy.version.status = 'active';
    policy.updatedAt = new Date();

    return policy;
  }

  async suspendPolicy(policyId: string, reason: string): Promise<Policy> {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy not found: ${policyId}`);

    policy.status = 'suspended';
    policy.updatedAt = new Date();

    return policy;
  }

  async archivePolicy(policyId: string): Promise<Policy> {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy not found: ${policyId}`);

    policy.status = 'archived';
    policy.version.status = 'archived';
    policy.updatedAt = new Date();

    return policy;
  }

  // ==================== Policy Review ====================

  async initiateReview(params: Omit<PolicyReview, 'id' | 'status' | 'findings' | 'recommendations' | 'createdAt' | 'updatedAt'>): Promise<PolicyReview> {
    const review: PolicyReview = {
      ...params,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      findings: [],
      recommendations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.reviews.set(review.id, review);
    return review;
  }

  async getReview(reviewId: string): Promise<PolicyReview | null> {
    return this.reviews.get(reviewId) || null;
  }

  async getReviews(params?: {
    policyId?: string;
    status?: PolicyReview['status'];
    type?: PolicyReview['type'];
  }): Promise<PolicyReview[]> {
    let reviews = Array.from(this.reviews.values());

    if (params?.policyId) {
      reviews = reviews.filter(r => r.policyId === params.policyId);
    }

    if (params?.status) {
      reviews = reviews.filter(r => r.status === params.status);
    }

    if (params?.type) {
      reviews = reviews.filter(r => r.type === params.type);
    }

    return reviews.sort((a, b) => b.initiatedDate.getTime() - a.initiatedDate.getTime());
  }

  async addReviewFinding(reviewId: string, finding: Omit<ReviewFinding, 'id' | 'status'>): Promise<PolicyReview> {
    const review = this.reviews.get(reviewId);
    if (!review) throw new Error(`Review not found: ${reviewId}`);

    review.findings.push({
      ...finding,
      id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'identified'
    });

    review.updatedAt = new Date();
    return review;
  }

  async addReviewRecommendation(reviewId: string, recommendation: Omit<ReviewRecommendation, 'id' | 'status'>): Promise<PolicyReview> {
    const review = this.reviews.get(reviewId);
    if (!review) throw new Error(`Review not found: ${reviewId}`);

    review.recommendations.push({
      ...recommendation,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'proposed'
    });

    review.updatedAt = new Date();
    return review;
  }

  async completeReview(reviewId: string, outcome: ReviewOutcome): Promise<PolicyReview> {
    const review = this.reviews.get(reviewId);
    if (!review) throw new Error(`Review not found: ${reviewId}`);

    review.outcome = outcome;
    review.status = 'completed';
    review.updatedAt = new Date();

    // Update policy review date
    const policy = this.policies.get(review.policyId);
    if (policy) {
      policy.reviewDate = outcome.nextReviewDate;
      policy.metadata.lastReviewedBy = outcome.approvedBy;
      policy.metadata.lastReviewDate = outcome.approvedDate;
      policy.updatedAt = new Date();
    }

    return review;
  }

  // ==================== Compliance Tracking ====================

  async createComplianceRecord(params: Omit<OrganizationCompliance, 'id' | 'gaps' | 'actions' | 'evidence' | 'history' | 'createdAt' | 'updatedAt'>): Promise<OrganizationCompliance> {
    const record: OrganizationCompliance = {
      ...params,
      id: `compliance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      gaps: [],
      actions: [],
      evidence: [],
      history: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.compliance.set(record.id, record);
    return record;
  }

  async getComplianceRecord(recordId: string): Promise<OrganizationCompliance | null> {
    return this.compliance.get(recordId) || null;
  }

  async getComplianceRecords(params?: {
    organizationId?: string;
    policyId?: string;
    status?: ComplianceStatus;
  }): Promise<OrganizationCompliance[]> {
    let records = Array.from(this.compliance.values());

    if (params?.organizationId) {
      records = records.filter(r => r.organizationId === params.organizationId);
    }

    if (params?.policyId) {
      records = records.filter(r => r.policyId === params.policyId);
    }

    if (params?.status) {
      records = records.filter(r => r.status === params.status);
    }

    return records;
  }

  async updateComplianceStatus(recordId: string, requirements: RequirementCompliance[]): Promise<OrganizationCompliance> {
    const record = this.compliance.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    record.requirements = requirements;

    // Calculate overall score
    const totalScore = requirements.reduce((sum, r) => sum + r.score, 0);
    record.overallScore = requirements.length > 0 ? totalScore / requirements.length : 0;

    // Determine status
    if (record.overallScore >= 90) {
      record.status = 'compliant';
    } else if (record.overallScore >= 70) {
      record.status = 'partial';
    } else {
      record.status = 'non_compliant';
    }

    record.updatedAt = new Date();
    return record;
  }

  async addComplianceGap(recordId: string, gap: Omit<ComplianceGap, 'id' | 'status'>): Promise<OrganizationCompliance> {
    const record = this.compliance.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    record.gaps.push({
      ...gap,
      id: `gap-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'identified'
    });

    record.updatedAt = new Date();
    return record;
  }

  async addComplianceAction(recordId: string, action: Omit<ComplianceAction, 'id' | 'status'>): Promise<OrganizationCompliance> {
    const record = this.compliance.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    record.actions.push({
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'planned'
    });

    record.updatedAt = new Date();
    return record;
  }

  async uploadComplianceEvidence(recordId: string, evidence: Omit<ComplianceEvidence, 'id' | 'uploadedDate'>): Promise<OrganizationCompliance> {
    const record = this.compliance.get(recordId);
    if (!record) throw new Error(`Compliance record not found: ${recordId}`);

    record.evidence.push({
      ...evidence,
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      uploadedDate: new Date()
    });

    record.updatedAt = new Date();
    return record;
  }

  // ==================== Impact Assessment ====================

  async createImpactAssessment(params: Omit<PolicyImpactAssessment, 'id' | 'status' | 'createdAt'>): Promise<PolicyImpactAssessment> {
    const assessment: PolicyImpactAssessment = {
      ...params,
      id: `impact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      createdAt: new Date()
    };

    this.impactAssessments.set(assessment.id, assessment);
    return assessment;
  }

  async getImpactAssessments(params?: {
    policyId?: string;
    assessmentType?: PolicyImpactAssessment['assessmentType'];
    status?: PolicyImpactAssessment['status'];
  }): Promise<PolicyImpactAssessment[]> {
    let assessments = Array.from(this.impactAssessments.values());

    if (params?.policyId) {
      assessments = assessments.filter(a => a.policyId === params.policyId);
    }

    if (params?.assessmentType) {
      assessments = assessments.filter(a => a.assessmentType === params.assessmentType);
    }

    if (params?.status) {
      assessments = assessments.filter(a => a.status === params.status);
    }

    return assessments;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalPolicies: number;
    activePolicies: number;
    draftPolicies: number;
    byCategory: Record<PolicyCategory, number>;
    byType: Record<string, number>;
    byScope: Record<PolicyScope, number>;
    pendingReviews: number;
    overdueReviews: number;
    averageComplianceScore: number;
    nonCompliantOrganizations: number;
    upcomingExpirations: number;
  }> {
    const policies = Array.from(this.policies.values());
    const reviews = Array.from(this.reviews.values());
    const compliance = Array.from(this.compliance.values());

    const byCategory: Record<PolicyCategory, number> = {} as any;
    const byType: Record<string, number> = {};
    const byScope: Record<PolicyScope, number> = {} as any;

    policies.forEach(p => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      byType[p.type] = (byType[p.type] || 0) + 1;
      byScope[p.scope] = (byScope[p.scope] || 0) + 1;
    });

    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return {
      totalPolicies: policies.length,
      activePolicies: policies.filter(p => p.status === 'active').length,
      draftPolicies: policies.filter(p => p.status === 'draft').length,
      byCategory,
      byType,
      byScope,
      pendingReviews: reviews.filter(r => r.status === 'pending' || r.status === 'in_progress').length,
      overdueReviews: reviews.filter(r => r.status !== 'completed' && r.dueDate < now).length,
      averageComplianceScore: compliance.length > 0
        ? compliance.reduce((sum, c) => sum + c.overallScore, 0) / compliance.length
        : 100,
      nonCompliantOrganizations: compliance.filter(c => c.status === 'non_compliant').length,
      upcomingExpirations: policies.filter(p =>
        p.expirationDate && p.expirationDate <= thirtyDaysFromNow && p.status === 'active'
      ).length
    };
  }
}

export const policyManagementService = PolicyManagementService.getInstance();
export default PolicyManagementService;

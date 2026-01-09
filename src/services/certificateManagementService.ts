/**
 * Certificate Management Service
 * Comprehensive certificate lifecycle management, PKI, and TLS/SSL administration
 */

// Certificate Type
type CertificateType = 'ssl_tls' | 'code_signing' | 'client_auth' | 'email' | 'ca' | 'intermediate_ca' | 'wildcard' | 'multi_domain' | 'ev' | 'ov' | 'dv';

// Certificate Status
type CertificateStatus = 'active' | 'pending' | 'expired' | 'revoked' | 'suspended' | 'renewed';

// Key Algorithm
type KeyAlgorithm = 'RSA-2048' | 'RSA-4096' | 'ECDSA-256' | 'ECDSA-384' | 'Ed25519';

// Validation Level
type ValidationLevel = 'domain' | 'organization' | 'extended';

// Certificate
interface Certificate {
  id: string;
  name: string;
  description: string;
  type: CertificateType;
  subject: CertificateSubject;
  issuer: CertificateIssuer;
  validity: CertificateValidity;
  keyInfo: CertificateKeyInfo;
  extensions: CertificateExtensions;
  chain: CertificateChain;
  deployment: CertificateDeployment;
  renewal: CertificateRenewal;
  compliance: CertificateCompliance;
  audit: CertificateAudit;
  status: CertificateStatus;
  metadata: CertificateMetadata;
}

// Certificate Subject
interface CertificateSubject {
  commonName: string;
  organization?: string;
  organizationalUnit?: string;
  locality?: string;
  state?: string;
  country?: string;
  emailAddress?: string;
  subjectAlternativeNames: SubjectAlternativeName[];
}

// Subject Alternative Name
interface SubjectAlternativeName {
  type: 'dns' | 'ip' | 'email' | 'uri';
  value: string;
}

// Certificate Issuer
interface CertificateIssuer {
  commonName: string;
  organization: string;
  country?: string;
  isCA: boolean;
  caType?: 'root' | 'intermediate' | 'external';
  trustChain: string[];
}

// Certificate Validity
interface CertificateValidity {
  notBefore: Date;
  notAfter: Date;
  duration: number;
  durationUnit: 'days' | 'months' | 'years';
  remainingDays: number;
  isExpired: boolean;
  expirationWarningThreshold: number;
}

// Certificate Key Info
interface CertificateKeyInfo {
  algorithm: KeyAlgorithm;
  keySize: number;
  publicKey: string;
  privateKeyStored: boolean;
  privateKeyLocation?: string;
  keyUsage: KeyUsage[];
  fingerprint: CertificateFingerprint;
}

// Key Usage
type KeyUsage = 'digitalSignature' | 'keyEncipherment' | 'dataEncipherment' | 'keyAgreement' | 'keyCertSign' | 'cRLSign' | 'encipherOnly' | 'decipherOnly';

// Certificate Fingerprint
interface CertificateFingerprint {
  sha1: string;
  sha256: string;
  md5?: string;
}

// Certificate Extensions
interface CertificateExtensions {
  basicConstraints?: BasicConstraints;
  keyUsage?: string[];
  extendedKeyUsage?: ExtendedKeyUsage[];
  subjectKeyIdentifier?: string;
  authorityKeyIdentifier?: string;
  crlDistributionPoints?: string[];
  authorityInfoAccess?: AuthorityInfoAccess;
  certificatePolicies?: CertificatePolicy[];
  customExtensions?: CustomExtension[];
}

// Basic Constraints
interface BasicConstraints {
  isCA: boolean;
  pathLength?: number;
}

// Extended Key Usage
type ExtendedKeyUsage = 'serverAuth' | 'clientAuth' | 'codeSigning' | 'emailProtection' | 'timeStamping' | 'ocspSigning';

// Authority Info Access
interface AuthorityInfoAccess {
  ocspResponder?: string;
  caIssuers?: string;
}

// Certificate Policy
interface CertificatePolicy {
  oid: string;
  name: string;
  cps?: string;
}

// Custom Extension
interface CustomExtension {
  oid: string;
  name: string;
  critical: boolean;
  value: string;
}

// Certificate Chain
interface CertificateChain {
  certificates: ChainCertificate[];
  isComplete: boolean;
  isValid: boolean;
  validationErrors?: string[];
}

// Chain Certificate
interface ChainCertificate {
  position: number;
  type: 'end_entity' | 'intermediate' | 'root';
  subject: string;
  issuer: string;
  fingerprint: string;
  validFrom: Date;
  validTo: Date;
}

// Certificate Deployment
interface CertificateDeployment {
  targets: DeploymentTarget[];
  status: 'not_deployed' | 'deploying' | 'deployed' | 'failed' | 'partial';
  lastDeployment?: Date;
  deploymentHistory: DeploymentHistoryEntry[];
  autoDeployment: AutoDeploymentConfig;
}

// Deployment Target
interface DeploymentTarget {
  id: string;
  type: 'server' | 'load_balancer' | 'cdn' | 'api_gateway' | 'kubernetes' | 'container' | 'application';
  name: string;
  endpoint: string;
  status: 'pending' | 'deployed' | 'failed' | 'outdated';
  lastDeployed?: Date;
  deployedVersion?: number;
  config: DeploymentConfig;
}

// Deployment Config
interface DeploymentConfig {
  method: 'push' | 'pull' | 'agent' | 'api';
  credentials?: string;
  path?: string;
  format?: 'pem' | 'pfx' | 'p12' | 'jks' | 'der';
  includeChain: boolean;
  includePrivateKey: boolean;
  postDeploymentCheck: boolean;
}

// Deployment History Entry
interface DeploymentHistoryEntry {
  id: string;
  timestamp: Date;
  action: 'deploy' | 'update' | 'rollback' | 'remove';
  target: string;
  version: number;
  status: 'success' | 'failed' | 'rolled_back';
  initiatedBy: string;
  duration: number;
  error?: string;
}

// Auto Deployment Config
interface AutoDeploymentConfig {
  enabled: boolean;
  triggerOn: ('renewal' | 'reissue' | 'manual')[];
  targets: string[];
  schedule?: {
    type: 'immediate' | 'scheduled' | 'maintenance_window';
    window?: {
      startTime: string;
      endTime: string;
      daysOfWeek: number[];
    };
  };
  notifications: string[];
}

// Certificate Renewal
interface CertificateRenewal {
  autoRenew: boolean;
  renewalDaysBefore: number;
  lastRenewal?: Date;
  nextRenewal?: Date;
  renewalStatus: 'not_required' | 'pending' | 'in_progress' | 'completed' | 'failed' | 'overdue';
  renewalHistory: RenewalHistoryEntry[];
  renewalConfig: RenewalConfig;
}

// Renewal History Entry
interface RenewalHistoryEntry {
  id: string;
  timestamp: Date;
  oldCertificateId: string;
  newCertificateId: string;
  trigger: 'automatic' | 'manual' | 'policy';
  status: 'success' | 'failed';
  duration: number;
  error?: string;
}

// Renewal Config
interface RenewalConfig {
  preservePrivateKey: boolean;
  preserveSANs: boolean;
  validityPeriod: number;
  validityUnit: 'days' | 'months' | 'years';
  approvalRequired: boolean;
  approvers?: string[];
  notifyOnRenewal: string[];
}

// Certificate Compliance
interface CertificateCompliance {
  standards: ComplianceStandard[];
  validations: ComplianceValidation[];
  score: number;
  lastCheck: Date;
  nextCheck: Date;
  violations: ComplianceViolation[];
}

// Compliance Standard
interface ComplianceStandard {
  name: string;
  version: string;
  requirements: string[];
  status: 'compliant' | 'non_compliant' | 'partial';
}

// Compliance Validation
interface ComplianceValidation {
  check: string;
  status: 'passed' | 'failed' | 'warning' | 'skipped';
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  lastChecked: Date;
}

// Compliance Violation
interface ComplianceViolation {
  id: string;
  standard: string;
  requirement: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  remediation: string;
  status: 'open' | 'remediated' | 'accepted';
  detectedAt: Date;
  resolvedAt?: Date;
}

// Certificate Audit
interface CertificateAudit {
  enabled: boolean;
  events: AuditEvent[];
  retentionDays: number;
  exportEnabled: boolean;
  lastExport?: Date;
}

// Audit Event
interface AuditEvent {
  id: string;
  timestamp: Date;
  action: 'created' | 'renewed' | 'deployed' | 'revoked' | 'exported' | 'accessed' | 'modified';
  actor: string;
  actorType: 'user' | 'service' | 'system';
  details: Record<string, unknown>;
  ipAddress?: string;
  result: 'success' | 'failure';
}

// Certificate Metadata
interface CertificateMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
  owner: string;
  team: string;
  environment: string;
  application: string;
  tags: string[];
  labels: Record<string, string>;
  externalId?: string;
  notes?: string;
}

// Certificate Authority
interface CertificateAuthority {
  id: string;
  name: string;
  description: string;
  type: 'root' | 'intermediate' | 'issuing';
  certificate: CACertificate;
  configuration: CAConfiguration;
  policies: CAPolicy[];
  templates: CertificateTemplate[];
  crl: CRLConfiguration;
  ocsp: OCSPConfiguration;
  issuedCertificates: string[];
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  metadata: CAMetadata;
}

// CA Certificate
interface CACertificate {
  subject: CertificateSubject;
  validity: CertificateValidity;
  keyInfo: CertificateKeyInfo;
  serialNumber: string;
  fingerprint: CertificateFingerprint;
  parentCA?: string;
}

// CA Configuration
interface CAConfiguration {
  maxPathLength?: number;
  allowedKeyUsages: KeyUsage[];
  allowedExtendedKeyUsages: ExtendedKeyUsage[];
  defaultValidityDays: number;
  maxValidityDays: number;
  signatureAlgorithm: string;
  digestAlgorithm: string;
  serialNumberFormat: 'sequential' | 'random';
  issuanceRateLimit?: number;
}

// CA Policy
interface CAPolicy {
  id: string;
  name: string;
  description: string;
  subjectConstraints: SubjectConstraints;
  sanConstraints: SANConstraints;
  keyConstraints: KeyConstraints;
  validityConstraints: ValidityConstraints;
  approvalRequired: boolean;
  enabled: boolean;
}

// Subject Constraints
interface SubjectConstraints {
  allowedOrganizations?: string[];
  allowedOUs?: string[];
  allowedCountries?: string[];
  requiredFields: string[];
  prohibitedFields?: string[];
}

// SAN Constraints
interface SANConstraints {
  allowedDNSPatterns?: string[];
  allowedIPRanges?: string[];
  maxSANs?: number;
  requireDNS?: boolean;
}

// Key Constraints
interface KeyConstraints {
  allowedAlgorithms: KeyAlgorithm[];
  minKeySize: number;
  maxKeySize?: number;
}

// Validity Constraints
interface ValidityConstraints {
  minDays: number;
  maxDays: number;
  mustNotExceedIssuer: boolean;
}

// Certificate Template
interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  type: CertificateType;
  defaults: TemplateDefaults;
  constraints: TemplateConstraints;
  approvalWorkflow?: ApprovalWorkflow;
  enabled: boolean;
  usageCount: number;
}

// Template Defaults
interface TemplateDefaults {
  keyAlgorithm: KeyAlgorithm;
  keySize: number;
  validityDays: number;
  keyUsage: KeyUsage[];
  extendedKeyUsage: ExtendedKeyUsage[];
  includeBasicConstraints: boolean;
  extensions: Record<string, unknown>;
}

// Template Constraints
interface TemplateConstraints {
  subject: SubjectConstraints;
  san: SANConstraints;
  key: KeyConstraints;
  validity: ValidityConstraints;
}

// Approval Workflow
interface ApprovalWorkflow {
  enabled: boolean;
  approvers: WorkflowApprover[];
  requiredApprovals: number;
  timeout: number;
  escalation?: string;
}

// Workflow Approver
interface WorkflowApprover {
  id: string;
  type: 'user' | 'group' | 'role';
  name: string;
  email: string;
  level: number;
}

// CRL Configuration
interface CRLConfiguration {
  enabled: boolean;
  distributionPoints: string[];
  updateFrequency: number;
  updateUnit: 'hours' | 'days';
  nextUpdate: Date;
  lastPublished?: Date;
  crlNumber: number;
  deltaEnabled: boolean;
}

// OCSP Configuration
interface OCSPConfiguration {
  enabled: boolean;
  responderUrl: string;
  signingCertificate?: string;
  cacheDuration: number;
  includeNonce: boolean;
  status: 'online' | 'offline' | 'degraded';
}

// CA Metadata
interface CAMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
  owner: string;
  contactEmail: string;
}

// Certificate Request
interface CertificateRequest {
  id: string;
  type: 'new' | 'renewal' | 'reissue' | 'rekey';
  template?: string;
  requestor: Requestor;
  subject: CertificateSubject;
  keyInfo: RequestKeyInfo;
  csr?: string;
  approval: RequestApproval;
  validation: RequestValidation;
  status: 'pending' | 'approved' | 'rejected' | 'issued' | 'cancelled' | 'expired';
  issuedCertificateId?: string;
  metadata: RequestMetadata;
}

// Requestor
interface Requestor {
  id: string;
  name: string;
  email: string;
  department: string;
  justification: string;
}

// Request Key Info
interface RequestKeyInfo {
  algorithm: KeyAlgorithm;
  keySize: number;
  generateKey: boolean;
}

// Request Approval
interface RequestApproval {
  required: boolean;
  approvers: ApprovalRecord[];
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  rejectedAt?: Date;
  comments?: string;
}

// Approval Record
interface ApprovalRecord {
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: Date;
  comments?: string;
}

// Request Validation
interface RequestValidation {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  validationType: ValidationLevel;
  validationMethod?: 'dns' | 'http' | 'email' | 'manual';
  challenges: ValidationChallenge[];
  completedAt?: Date;
}

// Validation Challenge
interface ValidationChallenge {
  id: string;
  type: 'dns' | 'http' | 'email';
  domain: string;
  token: string;
  value: string;
  status: 'pending' | 'valid' | 'invalid' | 'expired';
  expiresAt: Date;
  verifiedAt?: Date;
}

// Request Metadata
interface RequestMetadata {
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  ticketId?: string;
}

// Certificate Discovery
interface CertificateDiscovery {
  id: string;
  name: string;
  description: string;
  scope: DiscoveryScope;
  schedule: DiscoverySchedule;
  scanners: DiscoveryScanner[];
  results: DiscoveryResults;
  status: 'idle' | 'running' | 'completed' | 'failed';
  metadata: DiscoveryMetadata;
}

// Discovery Scope
interface DiscoveryScope {
  networks: string[];
  ports: number[];
  domains: string[];
  excludePatterns: string[];
  includeInternal: boolean;
  includeExternal: boolean;
}

// Discovery Schedule
interface DiscoverySchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  timezone: string;
  lastRun?: Date;
  nextRun?: Date;
}

// Discovery Scanner
interface DiscoveryScanner {
  id: string;
  name: string;
  type: 'network' | 'cloud' | 'container' | 'application';
  config: Record<string, unknown>;
  enabled: boolean;
}

// Discovery Results
interface DiscoveryResults {
  lastScan: Date;
  totalScanned: number;
  certificatesFound: number;
  newCertificates: number;
  expiringSoon: number;
  expired: number;
  issues: DiscoveryIssue[];
  certificates: DiscoveredCertificate[];
}

// Discovery Issue
interface DiscoveryIssue {
  id: string;
  type: 'expired' | 'expiring' | 'weak_key' | 'untrusted' | 'misconfigured' | 'duplicate';
  severity: 'critical' | 'high' | 'medium' | 'low';
  certificateId?: string;
  description: string;
  recommendation: string;
}

// Discovered Certificate
interface DiscoveredCertificate {
  id: string;
  subject: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
  source: string;
  endpoint: string;
  port: number;
  isManaged: boolean;
  linkedCertificateId?: string;
}

// Discovery Metadata
interface DiscoveryMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  scanCount: number;
}

// Certificate Statistics
interface CertificateStatistics {
  overview: {
    totalCertificates: number;
    activeCertificates: number;
    expiredCertificates: number;
    revokedCertificates: number;
    expiringIn30Days: number;
    expiringIn60Days: number;
    expiringIn90Days: number;
  };
  byType: Record<CertificateType, number>;
  byStatus: Record<CertificateStatus, number>;
  byAlgorithm: Record<KeyAlgorithm, number>;
  byIssuer: Record<string, number>;
  authorities: {
    totalCAs: number;
    activeCAs: number;
    issuedThisMonth: number;
    revokedThisMonth: number;
  };
  requests: {
    pending: number;
    approved: number;
    rejected: number;
    avgApprovalTime: number;
  };
  deployment: {
    deployed: number;
    pendingDeployment: number;
    failedDeployment: number;
    avgDeploymentTime: number;
  };
  compliance: {
    compliantCertificates: number;
    nonCompliantCertificates: number;
    openViolations: number;
    avgComplianceScore: number;
  };
}

class CertificateManagementService {
  private static instance: CertificateManagementService;
  private certificates: Map<string, Certificate> = new Map();
  private authorities: Map<string, CertificateAuthority> = new Map();
  private requests: Map<string, CertificateRequest> = new Map();
  private discoveries: Map<string, CertificateDiscovery> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CertificateManagementService {
    if (!CertificateManagementService.instance) {
      CertificateManagementService.instance = new CertificateManagementService();
    }
    return CertificateManagementService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Certificates
    const certificatesData = [
      { name: 'api.example.com', type: 'ssl_tls' as CertificateType, cn: 'api.example.com', days: 365 },
      { name: '*.example.com', type: 'wildcard' as CertificateType, cn: '*.example.com', days: 730 },
      { name: 'app.example.com', type: 'ssl_tls' as CertificateType, cn: 'app.example.com', days: 90 },
      { name: 'Code Signing Certificate', type: 'code_signing' as CertificateType, cn: 'Example Inc Code Signing', days: 365 },
      { name: 'Client Auth Certificate', type: 'client_auth' as CertificateType, cn: 'service-account', days: 365 },
      { name: 'Internal Root CA', type: 'ca' as CertificateType, cn: 'Example Root CA', days: 3650 },
      { name: 'Intermediate CA', type: 'intermediate_ca' as CertificateType, cn: 'Example Intermediate CA', days: 1825 },
      { name: 'Multi-Domain Certificate', type: 'multi_domain' as CertificateType, cn: 'example.com', days: 365 },
    ];

    certificatesData.forEach((cert, idx) => {
      const daysRemaining = cert.days - (idx * 30);
      const validFrom = new Date(Date.now() - (cert.days - daysRemaining) * 24 * 60 * 60 * 1000);
      const validTo = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000);
      const isExpired = daysRemaining <= 0;

      const certificate: Certificate = {
        id: `cert-${(idx + 1).toString().padStart(4, '0')}`,
        name: cert.name,
        description: `${cert.name} certificate`,
        type: cert.type,
        subject: {
          commonName: cert.cn,
          organization: 'Example Inc',
          organizationalUnit: 'IT',
          locality: 'San Francisco',
          state: 'California',
          country: 'US',
          subjectAlternativeNames: cert.type === 'multi_domain' ? [
            { type: 'dns', value: 'example.com' },
            { type: 'dns', value: 'www.example.com' },
            { type: 'dns', value: 'api.example.com' },
          ] : [{ type: 'dns', value: cert.cn }],
        },
        issuer: {
          commonName: cert.type === 'ca' ? 'Example Root CA' : 'Example Intermediate CA',
          organization: 'Example Inc',
          isCA: cert.type === 'ca' || cert.type === 'intermediate_ca',
          caType: cert.type === 'ca' ? 'root' : cert.type === 'intermediate_ca' ? 'intermediate' : 'external',
          trustChain: ['Example Root CA'],
        },
        validity: {
          notBefore: validFrom,
          notAfter: validTo,
          duration: cert.days,
          durationUnit: 'days',
          remainingDays: Math.max(0, daysRemaining),
          isExpired,
          expirationWarningThreshold: 30,
        },
        keyInfo: {
          algorithm: 'RSA-2048',
          keySize: 2048,
          publicKey: '-----BEGIN PUBLIC KEY-----\nMIIB...\n-----END PUBLIC KEY-----',
          privateKeyStored: true,
          privateKeyLocation: 'vault://certificates/' + cert.cn,
          keyUsage: cert.type === 'ca' || cert.type === 'intermediate_ca' ? ['keyCertSign', 'cRLSign'] : ['digitalSignature', 'keyEncipherment'],
          fingerprint: {
            sha1: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          },
        },
        extensions: {
          basicConstraints: cert.type === 'ca' || cert.type === 'intermediate_ca' ? { isCA: true, pathLength: cert.type === 'ca' ? 1 : 0 } : { isCA: false },
          keyUsage: cert.type === 'ca' || cert.type === 'intermediate_ca' ? ['keyCertSign', 'cRLSign'] : ['digitalSignature', 'keyEncipherment'],
          extendedKeyUsage: cert.type === 'ssl_tls' || cert.type === 'wildcard' || cert.type === 'multi_domain' ? ['serverAuth', 'clientAuth'] : cert.type === 'code_signing' ? ['codeSigning'] : ['clientAuth'],
          subjectKeyIdentifier: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          crlDistributionPoints: ['http://crl.example.com/crl.pem'],
          authorityInfoAccess: { ocspResponder: 'http://ocsp.example.com', caIssuers: 'http://ca.example.com/ca.crt' },
        },
        chain: {
          certificates: [
            { position: 0, type: 'end_entity', subject: cert.cn, issuer: 'Example Intermediate CA', fingerprint: 'abc123', validFrom, validTo },
            { position: 1, type: 'intermediate', subject: 'Example Intermediate CA', issuer: 'Example Root CA', fingerprint: 'def456', validFrom: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), validTo: new Date(Date.now() + 1460 * 24 * 60 * 60 * 1000) },
            { position: 2, type: 'root', subject: 'Example Root CA', issuer: 'Example Root CA', fingerprint: 'ghi789', validFrom: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000), validTo: new Date(Date.now() + 2920 * 24 * 60 * 60 * 1000) },
          ],
          isComplete: true,
          isValid: !isExpired,
        },
        deployment: {
          targets: cert.type === 'ssl_tls' || cert.type === 'wildcard' || cert.type === 'multi_domain' ? [
            {
              id: `target-${idx}-1`,
              type: 'load_balancer',
              name: 'Production ALB',
              endpoint: 'alb-prod.example.com',
              status: 'deployed',
              lastDeployed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              deployedVersion: 1,
              config: { method: 'api', format: 'pem', includeChain: true, includePrivateKey: true, postDeploymentCheck: true },
            },
          ] : [],
          status: cert.type === 'ssl_tls' || cert.type === 'wildcard' || cert.type === 'multi_domain' ? 'deployed' : 'not_deployed',
          lastDeployment: cert.type === 'ssl_tls' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : undefined,
          deploymentHistory: [],
          autoDeployment: {
            enabled: cert.type === 'ssl_tls' || cert.type === 'wildcard',
            triggerOn: ['renewal'],
            targets: [],
            notifications: ['ops@example.com'],
          },
        },
        renewal: {
          autoRenew: cert.type === 'ssl_tls' || cert.type === 'wildcard',
          renewalDaysBefore: 30,
          lastRenewal: idx % 2 === 0 ? new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) : undefined,
          nextRenewal: daysRemaining > 30 ? new Date(Date.now() + (daysRemaining - 30) * 24 * 60 * 60 * 1000) : undefined,
          renewalStatus: daysRemaining <= 0 ? 'overdue' : daysRemaining <= 30 ? 'pending' : 'not_required',
          renewalHistory: [],
          renewalConfig: {
            preservePrivateKey: false,
            preserveSANs: true,
            validityPeriod: cert.days,
            validityUnit: 'days',
            approvalRequired: false,
            notifyOnRenewal: ['security@example.com'],
          },
        },
        compliance: {
          standards: [
            { name: 'CAB Forum Baseline Requirements', version: '1.8.0', requirements: ['Key size >= 2048', 'Valid chain'], status: 'compliant' },
            { name: 'PCI-DSS', version: '4.0', requirements: ['Strong encryption', 'Regular rotation'], status: 'compliant' },
          ],
          validations: [
            { check: 'Key Strength', status: 'passed', message: 'RSA 2048-bit key meets requirements', severity: 'info', lastChecked: new Date() },
            { check: 'Chain Validity', status: 'passed', message: 'Certificate chain is complete and valid', severity: 'info', lastChecked: new Date() },
            { check: 'Expiration', status: daysRemaining <= 30 ? 'warning' : 'passed', message: `${daysRemaining} days until expiration`, severity: daysRemaining <= 30 ? 'high' : 'info', lastChecked: new Date() },
          ],
          score: isExpired ? 50 : daysRemaining <= 30 ? 75 : 95,
          lastCheck: new Date(),
          nextCheck: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          violations: [],
        },
        audit: {
          enabled: true,
          events: [
            { id: `audit-${idx}-1`, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), action: 'deployed', actor: 'admin', actorType: 'user', details: { target: 'Production ALB' }, result: 'success' },
            { id: `audit-${idx}-2`, timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), action: 'created', actor: 'admin', actorType: 'user', details: {}, result: 'success' },
          ],
          retentionDays: 365,
          exportEnabled: true,
        },
        status: isExpired ? 'expired' : 'active',
        metadata: {
          createdAt: validFrom,
          createdBy: 'admin',
          updatedAt: new Date(),
          version: 1,
          owner: 'platform-team',
          team: 'platform',
          environment: 'production',
          application: cert.type === 'ssl_tls' ? 'api-gateway' : 'infrastructure',
          tags: [cert.type, 'production'],
          labels: { environment: 'production', team: 'platform' },
        },
      };
      this.certificates.set(certificate.id, certificate);
    });

    // Initialize Certificate Authority
    const ca: CertificateAuthority = {
      id: 'ca-0001',
      name: 'Internal PKI',
      description: 'Internal Public Key Infrastructure',
      type: 'root',
      certificate: {
        subject: {
          commonName: 'Example Root CA',
          organization: 'Example Inc',
          country: 'US',
          subjectAlternativeNames: [],
        },
        validity: {
          notBefore: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
          notAfter: new Date(Date.now() + 2920 * 24 * 60 * 60 * 1000),
          duration: 10,
          durationUnit: 'years',
          remainingDays: 2920,
          isExpired: false,
          expirationWarningThreshold: 365,
        },
        keyInfo: {
          algorithm: 'RSA-4096',
          keySize: 4096,
          publicKey: '-----BEGIN PUBLIC KEY-----\nMIIC...\n-----END PUBLIC KEY-----',
          privateKeyStored: true,
          privateKeyLocation: 'hsm://slot/1',
          keyUsage: ['keyCertSign', 'cRLSign'],
          fingerprint: {
            sha1: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          },
        },
        serialNumber: '01',
        fingerprint: {
          sha1: Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        },
      },
      configuration: {
        maxPathLength: 1,
        allowedKeyUsages: ['digitalSignature', 'keyEncipherment', 'keyCertSign', 'cRLSign'],
        allowedExtendedKeyUsages: ['serverAuth', 'clientAuth', 'codeSigning'],
        defaultValidityDays: 365,
        maxValidityDays: 730,
        signatureAlgorithm: 'sha256WithRSAEncryption',
        digestAlgorithm: 'SHA-256',
        serialNumberFormat: 'random',
        issuanceRateLimit: 100,
      },
      policies: [
        {
          id: 'policy-1',
          name: 'Server Certificates',
          description: 'Policy for SSL/TLS server certificates',
          subjectConstraints: { allowedOrganizations: ['Example Inc'], requiredFields: ['commonName', 'organization'] },
          sanConstraints: { allowedDNSPatterns: ['*.example.com', '*.internal.example.com'], maxSANs: 10 },
          keyConstraints: { allowedAlgorithms: ['RSA-2048', 'RSA-4096', 'ECDSA-256'], minKeySize: 2048 },
          validityConstraints: { minDays: 30, maxDays: 365, mustNotExceedIssuer: true },
          approvalRequired: false,
          enabled: true,
        },
      ],
      templates: [
        {
          id: 'template-1',
          name: 'Web Server',
          description: 'Template for web server certificates',
          type: 'ssl_tls',
          defaults: {
            keyAlgorithm: 'RSA-2048',
            keySize: 2048,
            validityDays: 365,
            keyUsage: ['digitalSignature', 'keyEncipherment'],
            extendedKeyUsage: ['serverAuth'],
            includeBasicConstraints: true,
            extensions: {},
          },
          constraints: {
            subject: { requiredFields: ['commonName'] },
            san: { requireDNS: true, maxSANs: 10 },
            key: { allowedAlgorithms: ['RSA-2048', 'RSA-4096'], minKeySize: 2048 },
            validity: { minDays: 30, maxDays: 365, mustNotExceedIssuer: true },
          },
          enabled: true,
          usageCount: 150,
        },
      ],
      crl: {
        enabled: true,
        distributionPoints: ['http://crl.example.com/root.crl'],
        updateFrequency: 24,
        updateUnit: 'hours',
        nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        lastPublished: new Date(Date.now() - 1 * 60 * 60 * 1000),
        crlNumber: 156,
        deltaEnabled: true,
      },
      ocsp: {
        enabled: true,
        responderUrl: 'http://ocsp.example.com',
        cacheDuration: 3600,
        includeNonce: true,
        status: 'online',
      },
      issuedCertificates: Array.from(this.certificates.keys()),
      status: 'active',
      metadata: {
        createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        updatedAt: new Date(),
        version: 5,
        owner: 'security-team',
        contactEmail: 'pki@example.com',
      },
    };
    this.authorities.set(ca.id, ca);

    // Initialize Certificate Request
    const request: CertificateRequest = {
      id: 'req-0001',
      type: 'new',
      template: 'template-1',
      requestor: {
        id: 'user-001',
        name: 'John Developer',
        email: 'john@example.com',
        department: 'Engineering',
        justification: 'New API endpoint requires SSL certificate',
      },
      subject: {
        commonName: 'newapi.example.com',
        organization: 'Example Inc',
        subjectAlternativeNames: [{ type: 'dns', value: 'newapi.example.com' }],
      },
      keyInfo: {
        algorithm: 'RSA-2048',
        keySize: 2048,
        generateKey: true,
      },
      approval: {
        required: true,
        approvers: [
          { approverId: 'admin-1', approverName: 'Security Admin', status: 'pending' },
        ],
        status: 'pending',
      },
      validation: {
        status: 'pending',
        validationType: 'domain',
        validationMethod: 'dns',
        challenges: [
          {
            id: 'challenge-1',
            type: 'dns',
            domain: 'newapi.example.com',
            token: 'abc123xyz',
            value: '_acme-challenge.newapi.example.com TXT "abc123xyz"',
            status: 'pending',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      status: 'pending',
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        priority: 'normal',
      },
    };
    this.requests.set(request.id, request);

    // Initialize Discovery
    const discovery: CertificateDiscovery = {
      id: 'discovery-0001',
      name: 'Production Network Scan',
      description: 'Discover certificates in production network',
      scope: {
        networks: ['10.0.0.0/8', '192.168.0.0/16'],
        ports: [443, 8443, 9443],
        domains: ['example.com', 'internal.example.com'],
        excludePatterns: ['*.dev.*'],
        includeInternal: true,
        includeExternal: true,
      },
      schedule: {
        enabled: true,
        frequency: 'weekly',
        time: '02:00',
        timezone: 'UTC',
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      scanners: [
        { id: 'scanner-1', name: 'Network Scanner', type: 'network', config: { timeout: 30 }, enabled: true },
        { id: 'scanner-2', name: 'Cloud Scanner', type: 'cloud', config: { providers: ['aws', 'azure'] }, enabled: true },
      ],
      results: {
        lastScan: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        totalScanned: 500,
        certificatesFound: 45,
        newCertificates: 3,
        expiringSoon: 5,
        expired: 2,
        issues: [
          { id: 'issue-1', type: 'expiring', severity: 'high', certificateId: 'cert-0003', description: 'Certificate expiring in 30 days', recommendation: 'Renew certificate' },
          { id: 'issue-2', type: 'weak_key', severity: 'medium', description: 'Certificate using RSA 1024-bit key', recommendation: 'Reissue with stronger key' },
        ],
        certificates: [
          { id: 'discovered-1', subject: 'api.example.com', issuer: 'Example Intermediate CA', validFrom: new Date(), validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), fingerprint: 'abc123', source: 'network', endpoint: '10.0.1.100', port: 443, isManaged: true, linkedCertificateId: 'cert-0001' },
        ],
      },
      status: 'completed',
      metadata: {
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        updatedAt: new Date(),
        scanCount: 26,
      },
    };
    this.discoveries.set(discovery.id, discovery);
  }

  // Certificate Operations
  public getCertificates(type?: CertificateType): Certificate[] {
    let certs = Array.from(this.certificates.values());
    if (type) certs = certs.filter((c) => c.type === type);
    return certs;
  }

  public getCertificateById(id: string): Certificate | undefined {
    return this.certificates.get(id);
  }

  public getExpiringCertificates(days: number): Certificate[] {
    const threshold = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return Array.from(this.certificates.values()).filter(
      (c) => c.status === 'active' && c.validity.notAfter <= threshold
    );
  }

  // Authority Operations
  public getAuthorities(): CertificateAuthority[] {
    return Array.from(this.authorities.values());
  }

  public getAuthorityById(id: string): CertificateAuthority | undefined {
    return this.authorities.get(id);
  }

  // Request Operations
  public getRequests(status?: CertificateRequest['status']): CertificateRequest[] {
    let reqs = Array.from(this.requests.values());
    if (status) reqs = reqs.filter((r) => r.status === status);
    return reqs;
  }

  public getRequestById(id: string): CertificateRequest | undefined {
    return this.requests.get(id);
  }

  // Discovery Operations
  public getDiscoveries(): CertificateDiscovery[] {
    return Array.from(this.discoveries.values());
  }

  public getDiscoveryById(id: string): CertificateDiscovery | undefined {
    return this.discoveries.get(id);
  }

  // Statistics
  public getStatistics(): CertificateStatistics {
    const certs = Array.from(this.certificates.values());
    const authorities = Array.from(this.authorities.values());
    const requests = Array.from(this.requests.values());

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const byType: Record<CertificateType, number> = {
      ssl_tls: 0, code_signing: 0, client_auth: 0, email: 0, ca: 0,
      intermediate_ca: 0, wildcard: 0, multi_domain: 0, ev: 0, ov: 0, dv: 0,
    };
    const byStatus: Record<CertificateStatus, number> = {
      active: 0, pending: 0, expired: 0, revoked: 0, suspended: 0, renewed: 0,
    };
    const byAlgorithm: Record<KeyAlgorithm, number> = {
      'RSA-2048': 0, 'RSA-4096': 0, 'ECDSA-256': 0, 'ECDSA-384': 0, 'Ed25519': 0,
    };
    const byIssuer: Record<string, number> = {};

    certs.forEach((c) => {
      byType[c.type]++;
      byStatus[c.status]++;
      byAlgorithm[c.keyInfo.algorithm]++;
      byIssuer[c.issuer.commonName] = (byIssuer[c.issuer.commonName] || 0) + 1;
    });

    return {
      overview: {
        totalCertificates: certs.length,
        activeCertificates: certs.filter((c) => c.status === 'active').length,
        expiredCertificates: certs.filter((c) => c.status === 'expired').length,
        revokedCertificates: certs.filter((c) => c.status === 'revoked').length,
        expiringIn30Days: certs.filter((c) => c.status === 'active' && c.validity.notAfter <= in30Days).length,
        expiringIn60Days: certs.filter((c) => c.status === 'active' && c.validity.notAfter <= in60Days).length,
        expiringIn90Days: certs.filter((c) => c.status === 'active' && c.validity.notAfter <= in90Days).length,
      },
      byType,
      byStatus,
      byAlgorithm,
      byIssuer,
      authorities: {
        totalCAs: authorities.length,
        activeCAs: authorities.filter((a) => a.status === 'active').length,
        issuedThisMonth: 15,
        revokedThisMonth: 2,
      },
      requests: {
        pending: requests.filter((r) => r.status === 'pending').length,
        approved: requests.filter((r) => r.status === 'approved').length,
        rejected: requests.filter((r) => r.status === 'rejected').length,
        avgApprovalTime: 4.5,
      },
      deployment: {
        deployed: certs.filter((c) => c.deployment.status === 'deployed').length,
        pendingDeployment: certs.filter((c) => c.deployment.status === 'deploying').length,
        failedDeployment: certs.filter((c) => c.deployment.status === 'failed').length,
        avgDeploymentTime: 2.5,
      },
      compliance: {
        compliantCertificates: certs.filter((c) => c.compliance.score >= 90).length,
        nonCompliantCertificates: certs.filter((c) => c.compliance.score < 90).length,
        openViolations: certs.reduce((sum, c) => sum + c.compliance.violations.filter((v) => v.status === 'open').length, 0),
        avgComplianceScore: certs.reduce((sum, c) => sum + c.compliance.score, 0) / (certs.length || 1),
      },
    };
  }

  // Event Handling
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) this.eventListeners.splice(index, 1);
    };
  }

  private emit(event: string, data: unknown): void {
    this.eventListeners.forEach((callback) => callback(event, data));
  }
}

export const certificateManagementService = CertificateManagementService.getInstance();
export type {
  CertificateType,
  CertificateStatus,
  KeyAlgorithm,
  ValidationLevel,
  Certificate,
  CertificateSubject,
  SubjectAlternativeName,
  CertificateIssuer,
  CertificateValidity,
  CertificateKeyInfo,
  KeyUsage,
  CertificateFingerprint,
  CertificateExtensions,
  BasicConstraints,
  ExtendedKeyUsage,
  AuthorityInfoAccess,
  CertificatePolicy,
  CustomExtension,
  CertificateChain,
  ChainCertificate,
  CertificateDeployment,
  DeploymentTarget,
  DeploymentConfig,
  DeploymentHistoryEntry,
  AutoDeploymentConfig,
  CertificateRenewal,
  RenewalHistoryEntry,
  RenewalConfig,
  CertificateCompliance,
  ComplianceStandard,
  ComplianceValidation,
  ComplianceViolation,
  CertificateAudit,
  AuditEvent,
  CertificateMetadata,
  CertificateAuthority,
  CACertificate,
  CAConfiguration,
  CAPolicy,
  SubjectConstraints,
  SANConstraints,
  KeyConstraints,
  ValidityConstraints,
  CertificateTemplate,
  TemplateDefaults,
  TemplateConstraints,
  ApprovalWorkflow,
  WorkflowApprover,
  CRLConfiguration,
  OCSPConfiguration,
  CAMetadata,
  CertificateRequest,
  Requestor,
  RequestKeyInfo,
  RequestApproval,
  ApprovalRecord,
  RequestValidation,
  ValidationChallenge,
  RequestMetadata,
  CertificateDiscovery,
  DiscoveryScope,
  DiscoverySchedule,
  DiscoveryScanner,
  DiscoveryResults,
  DiscoveryIssue,
  DiscoveredCertificate,
  DiscoveryMetadata,
  CertificateStatistics,
};

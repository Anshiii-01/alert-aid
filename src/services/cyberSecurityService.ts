/**
 * Cyber Security Service - Issue #171 Implementation
 * 
 * Provides comprehensive cybersecurity management for disaster response
 * including threat detection, vulnerability assessment, incident response,
 * network security monitoring, and security compliance.
 */

// Type definitions
type ThreatSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
type ThreatCategory = 'malware' | 'phishing' | 'ransomware' | 'ddos' | 'intrusion' | 'data_breach' | 'insider_threat' | 'social_engineering' | 'apt' | 'unknown';
type AlertStatus = 'new' | 'triaging' | 'investigating' | 'escalated' | 'contained' | 'resolved' | 'false_positive';
type VulnerabilityStatus = 'open' | 'in_progress' | 'mitigated' | 'accepted_risk' | 'false_positive';
type AssetCriticality = 'low' | 'medium' | 'high' | 'critical';

// Security alert interfaces
interface SecurityAlert {
  id: string;
  alertNumber: string;
  title: string;
  description: string;
  category: ThreatCategory;
  severity: ThreatSeverity;
  status: AlertStatus;
  source: AlertSource;
  indicators: ThreatIndicator[];
  affectedAssets: AffectedAsset[];
  timeline: AlertTimeline;
  analysis: ThreatAnalysis;
  containment: ContainmentActions;
  assignedTo: string;
  escalatedTo?: string;
  relatedAlerts: string[];
  notes: AlertNote[];
  createdAt: Date;
  updatedAt: Date;
}

interface AlertSource {
  system: string;
  type: 'siem' | 'ids' | 'edr' | 'firewall' | 'av' | 'user_report' | 'threat_intel' | 'manual';
  sourceId?: string;
  rawData?: string;
  detectedAt: Date;
}

interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'file' | 'registry' | 'process' | 'behavior';
  value: string;
  confidence: 'high' | 'medium' | 'low';
  firstSeen: Date;
  lastSeen: Date;
  context?: string;
  threatIntelMatch?: boolean;
}

interface AffectedAsset {
  assetId: string;
  assetName: string;
  assetType: string;
  ipAddress?: string;
  hostname?: string;
  owner?: string;
  criticality: AssetCriticality;
  impact: string;
  compromiseLevel: 'suspected' | 'confirmed' | 'contained' | 'clean';
}

interface AlertTimeline {
  detected: Date;
  acknowledged?: Date;
  triageStart?: Date;
  investigationStart?: Date;
  containmentStart?: Date;
  containmentComplete?: Date;
  resolved?: Date;
  events: TimelineEvent[];
}

interface TimelineEvent {
  timestamp: Date;
  event: string;
  actor: string;
  details?: string;
  automated: boolean;
}

interface ThreatAnalysis {
  summary?: string;
  attackVector?: string;
  tactics?: string[];
  techniques?: string[];
  mitreMappings?: { tactic: string; technique: string; id: string }[];
  rootCause?: string;
  impactAssessment?: string;
  recommendations: string[];
}

interface ContainmentActions {
  status: 'not_started' | 'in_progress' | 'completed';
  actions: ContainmentAction[];
  playbook?: string;
  automatedActions: string[];
}

interface ContainmentAction {
  id: string;
  action: string;
  type: 'isolate' | 'block' | 'disable' | 'patch' | 'reset' | 'restore' | 'other';
  target: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  executedBy?: string;
  executedAt?: Date;
  result?: string;
  automated: boolean;
}

interface AlertNote {
  id: string;
  timestamp: Date;
  author: string;
  content: string;
  type: 'analysis' | 'update' | 'communication' | 'handoff';
}

// Vulnerability interfaces
interface Vulnerability {
  id: string;
  cveId?: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  cvssScore?: number;
  cvssVector?: string;
  status: VulnerabilityStatus;
  discoveredDate: Date;
  discoverySource: string;
  affectedSystems: VulnerableSystem[];
  exploit: ExploitInfo;
  remediation: RemediationInfo;
  riskAssessment: RiskAssessment;
  tracking: VulnerabilityTracking;
  createdAt: Date;
  updatedAt: Date;
}

interface VulnerableSystem {
  assetId: string;
  hostname: string;
  ipAddress?: string;
  osVersion?: string;
  application?: string;
  version?: string;
  owner: string;
  criticality: AssetCriticality;
  exposureLevel: 'internal' | 'dmz' | 'internet_facing';
  status: VulnerabilityStatus;
  patchedDate?: Date;
}

interface ExploitInfo {
  available: boolean;
  inTheWild: boolean;
  exploitMaturity: 'unproven' | 'poc' | 'functional' | 'high' | 'unknown';
  exploitReferences?: string[];
  activeExploitation: boolean;
}

interface RemediationInfo {
  available: boolean;
  type: 'patch' | 'workaround' | 'configuration' | 'upgrade' | 'none';
  description: string;
  vendor?: string;
  patchId?: string;
  instructions: string[];
  estimatedEffort: string;
  deadline?: Date;
  compensatingControls?: string[];
}

interface RiskAssessment {
  riskScore: number;
  likelihood: 'unlikely' | 'possible' | 'likely' | 'almost_certain';
  impact: 'minimal' | 'minor' | 'moderate' | 'major' | 'severe';
  businessRisk: string;
  dataAtRisk?: string[];
  regulatoryImpact?: string;
  priorityScore: number;
}

interface VulnerabilityTracking {
  discoveredBy: string;
  assignedTo: string;
  slaDeadline?: Date;
  slaMet?: boolean;
  exceptions: VulnerabilityException[];
  history: VulnerabilityHistoryEntry[];
}

interface VulnerabilityException {
  id: string;
  reason: string;
  approvedBy: string;
  approvedDate: Date;
  expirationDate: Date;
  compensatingControls: string[];
  riskAcceptance: string;
}

interface VulnerabilityHistoryEntry {
  date: Date;
  action: string;
  actor: string;
  details?: string;
}

// Asset inventory interfaces
interface CyberAsset {
  id: string;
  hostname: string;
  ipAddress: string;
  macAddress?: string;
  type: 'server' | 'workstation' | 'network_device' | 'iot' | 'mobile' | 'cloud' | 'container' | 'virtual';
  os: string;
  osVersion: string;
  criticality: AssetCriticality;
  status: 'active' | 'inactive' | 'decommissioned' | 'unknown';
  location: AssetLocation;
  owner: string;
  department: string;
  applications: InstalledApplication[];
  securityControls: SecurityControl[];
  compliance: ComplianceStatus[];
  vulnerabilities: string[];
  lastScan?: Date;
  lastSeen?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AssetLocation {
  site: string;
  building?: string;
  room?: string;
  rack?: string;
  cloud?: { provider: string; region: string; account: string };
}

interface InstalledApplication {
  name: string;
  version: string;
  vendor: string;
  licensed: boolean;
  endOfLife?: Date;
  criticality: 'low' | 'medium' | 'high';
}

interface SecurityControl {
  type: 'av' | 'edr' | 'dlp' | 'encryption' | 'mfa' | 'firewall' | 'patching' | 'backup';
  product?: string;
  version?: string;
  status: 'active' | 'inactive' | 'not_installed';
  lastUpdate?: Date;
  compliant: boolean;
}

interface ComplianceStatus {
  framework: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  lastAssessed: Date;
  findings?: string;
}

// Incident response interfaces
interface CyberIncident {
  id: string;
  incidentNumber: string;
  title: string;
  type: ThreatCategory;
  severity: ThreatSeverity;
  status: 'declared' | 'investigating' | 'containing' | 'eradicating' | 'recovering' | 'closed' | 'post_incident';
  classification: 'confidential' | 'internal' | 'public';
  description: string;
  impactSummary: ImpactSummary;
  timeline: IncidentTimeline;
  affectedAssets: AffectedAsset[];
  indicators: ThreatIndicator[];
  responseTeam: IncidentTeamMember[];
  actions: IncidentAction[];
  communications: IncidentCommunication[];
  evidence: DigitalEvidence[];
  lessons: LessonsLearned;
  reporting: RegulatoryReporting;
  createdAt: Date;
  updatedAt: Date;
}

interface ImpactSummary {
  dataCompromised: boolean;
  dataTypes?: string[];
  recordsAffected?: number;
  systemsAffected: number;
  usersAffected: number;
  financialImpact?: number;
  operationalImpact: string;
  reputationalImpact: string;
  regulatoryImpact?: string;
}

interface IncidentTimeline {
  detected: Date;
  declared: Date;
  containment?: Date;
  eradication?: Date;
  recovery?: Date;
  closed?: Date;
  postIncidentReview?: Date;
  events: TimelineEvent[];
}

interface IncidentTeamMember {
  id: string;
  name: string;
  role: 'incident_commander' | 'lead_analyst' | 'analyst' | 'forensics' | 'communications' | 'legal' | 'executive';
  contact: string;
  responsibilities: string[];
  assignedDate: Date;
}

interface IncidentAction {
  id: string;
  phase: 'detection' | 'analysis' | 'containment' | 'eradication' | 'recovery' | 'lessons_learned';
  action: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  completedDate?: Date;
  notes?: string;
}

interface IncidentCommunication {
  id: string;
  timestamp: Date;
  type: 'internal' | 'executive' | 'legal' | 'external' | 'regulatory' | 'media';
  recipients: string[];
  subject: string;
  content: string;
  sentBy: string;
  approved: boolean;
  approvedBy?: string;
}

interface DigitalEvidence {
  id: string;
  type: 'log' | 'memory_dump' | 'disk_image' | 'network_capture' | 'malware_sample' | 'screenshot' | 'document';
  description: string;
  source: string;
  collectedAt: Date;
  collectedBy: string;
  hash: { algorithm: string; value: string };
  storageLocation: string;
  chainOfCustody: { timestamp: Date; action: string; actor: string }[];
  analyzed: boolean;
  analysisNotes?: string;
}

interface LessonsLearned {
  completed: boolean;
  reviewDate?: Date;
  participants: string[];
  whatWorked: string[];
  whatDidntWork: string[];
  rootCause?: string;
  recommendations: Recommendation[];
  actionItems: ActionItem[];
}

interface Recommendation {
  id: string;
  category: 'process' | 'technology' | 'people' | 'policy';
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  status: 'proposed' | 'approved' | 'implementing' | 'implemented' | 'rejected';
}

interface ActionItem {
  id: string;
  action: string;
  owner: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  completedDate?: Date;
}

interface RegulatoryReporting {
  required: boolean;
  frameworks: string[];
  notifications: {
    entity: string;
    required: boolean;
    deadline?: Date;
    notifiedDate?: Date;
    status: 'pending' | 'submitted' | 'acknowledged' | 'not_required';
  }[];
  breachNotification?: {
    required: boolean;
    deadline?: Date;
    method?: string;
    content?: string;
    sentDate?: Date;
  };
}

// Security metrics interfaces
interface SecurityMetrics {
  id: string;
  period: { start: Date; end: Date };
  alerts: AlertMetrics;
  incidents: IncidentMetrics;
  vulnerabilities: VulnerabilityMetrics;
  assets: AssetMetrics;
  compliance: ComplianceMetrics;
  trends: TrendData[];
  generatedAt: Date;
}

interface AlertMetrics {
  total: number;
  bySeverity: Record<ThreatSeverity, number>;
  byCategory: Record<ThreatCategory, number>;
  byStatus: Record<AlertStatus, number>;
  meanTimeToDetect: number;
  meanTimeToRespond: number;
  meanTimeToResolve: number;
  falsePositiveRate: number;
}

interface IncidentMetrics {
  total: number;
  bySeverity: Record<ThreatSeverity, number>;
  byType: Record<ThreatCategory, number>;
  averageDuration: number;
  containmentTime: number;
  recoveryTime: number;
  dataBreaches: number;
}

interface VulnerabilityMetrics {
  total: number;
  bySeverity: Record<ThreatSeverity, number>;
  byStatus: Record<VulnerabilityStatus, number>;
  averageTimeToRemediate: number;
  overdueSLAs: number;
  exceptionsGranted: number;
  patchCompliance: number;
}

interface AssetMetrics {
  total: number;
  byType: Record<string, number>;
  byCriticality: Record<AssetCriticality, number>;
  compliantAssets: number;
  assetsWithVulnerabilities: number;
  unprotectedAssets: number;
}

interface ComplianceMetrics {
  overallScore: number;
  byFramework: { framework: string; score: number; findings: number }[];
  criticalFindings: number;
  openFindings: number;
}

interface TrendData {
  metric: string;
  dataPoints: { date: Date; value: number }[];
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
}

// Sample data
const sampleSecurityAlerts: SecurityAlert[] = [
  {
    id: 'alert-001',
    alertNumber: 'SA-2024-001234',
    title: 'Potential Ransomware Activity Detected',
    description: 'Multiple file encryption operations detected on workstation WS-1234 with unusual patterns',
    category: 'ransomware',
    severity: 'critical',
    status: 'investigating',
    source: {
      system: 'CrowdStrike Falcon',
      type: 'edr',
      sourceId: 'CS-DET-98765',
      detectedAt: new Date()
    },
    indicators: [
      {
        id: 'ioc-001',
        type: 'process',
        value: 'suspicious_process.exe',
        confidence: 'high',
        firstSeen: new Date(),
        lastSeen: new Date(),
        context: 'Process spawned from email attachment',
        threatIntelMatch: true
      },
      {
        id: 'ioc-002',
        type: 'hash',
        value: 'a1b2c3d4e5f6789012345678',
        confidence: 'high',
        firstSeen: new Date(),
        lastSeen: new Date(),
        threatIntelMatch: true
      }
    ],
    affectedAssets: [
      {
        assetId: 'asset-1234',
        assetName: 'WS-1234',
        assetType: 'workstation',
        ipAddress: '192.168.1.100',
        hostname: 'WS-1234.local',
        owner: 'John Smith',
        criticality: 'medium',
        impact: 'Potential data encryption',
        compromiseLevel: 'suspected'
      }
    ],
    timeline: {
      detected: new Date(),
      acknowledged: new Date(),
      triageStart: new Date(),
      investigationStart: new Date(),
      events: [
        { timestamp: new Date(), event: 'Alert generated by EDR', actor: 'System', automated: true },
        { timestamp: new Date(), event: 'Alert acknowledged by SOC analyst', actor: 'Jane Doe', details: 'Beginning triage', automated: false }
      ]
    },
    analysis: {
      summary: 'Suspected ransomware infection via phishing email',
      attackVector: 'Email attachment (malicious Word document)',
      tactics: ['Initial Access', 'Execution', 'Impact'],
      techniques: ['Phishing', 'User Execution', 'Data Encrypted for Impact'],
      mitreMappings: [
        { tactic: 'Initial Access', technique: 'Phishing', id: 'T1566' },
        { tactic: 'Impact', technique: 'Data Encrypted for Impact', id: 'T1486' }
      ],
      recommendations: ['Isolate affected system immediately', 'Preserve evidence', 'Check backup status']
    },
    containment: {
      status: 'in_progress',
      actions: [
        {
          id: 'contain-001',
          action: 'Network isolation',
          type: 'isolate',
          target: 'WS-1234',
          status: 'completed',
          executedBy: 'SOC Team',
          executedAt: new Date(),
          result: 'System isolated from network',
          automated: true
        }
      ],
      playbook: 'Ransomware Response Playbook',
      automatedActions: ['Network isolation triggered', 'User account disabled']
    },
    assignedTo: 'Jane Doe',
    relatedAlerts: [],
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleVulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-001',
    cveId: 'CVE-2024-12345',
    title: 'Critical Remote Code Execution in Apache Server',
    description: 'A critical vulnerability in Apache HTTP Server allows remote attackers to execute arbitrary code',
    severity: 'critical',
    cvssScore: 9.8,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    status: 'in_progress',
    discoveredDate: new Date('2024-01-15'),
    discoverySource: 'Tenable Vulnerability Scanner',
    affectedSystems: [
      {
        assetId: 'server-001',
        hostname: 'web-server-01',
        ipAddress: '10.0.1.50',
        osVersion: 'Ubuntu 22.04',
        application: 'Apache HTTP Server',
        version: '2.4.51',
        owner: 'IT Operations',
        criticality: 'high',
        exposureLevel: 'internet_facing',
        status: 'in_progress'
      }
    ],
    exploit: {
      available: true,
      inTheWild: true,
      exploitMaturity: 'functional',
      exploitReferences: ['https://exploit-db.com/exploits/12345'],
      activeExploitation: true
    },
    remediation: {
      available: true,
      type: 'patch',
      description: 'Upgrade Apache HTTP Server to version 2.4.54 or later',
      vendor: 'Apache Foundation',
      patchId: 'apache-2.4.54',
      instructions: [
        'Schedule maintenance window',
        'Backup current configuration',
        'Apply update via package manager',
        'Verify service functionality'
      ],
      estimatedEffort: '2 hours per server',
      deadline: new Date('2024-01-22')
    },
    riskAssessment: {
      riskScore: 9.5,
      likelihood: 'almost_certain',
      impact: 'severe',
      businessRisk: 'Critical - Internet-facing web server could be compromised',
      dataAtRisk: ['Customer data', 'Application data'],
      regulatoryImpact: 'PCI-DSS compliance impact',
      priorityScore: 100
    },
    tracking: {
      discoveredBy: 'Vulnerability Scanner',
      assignedTo: 'Server Admin Team',
      slaDeadline: new Date('2024-01-22'),
      exceptions: [],
      history: [
        { date: new Date('2024-01-15'), action: 'Vulnerability discovered', actor: 'System' },
        { date: new Date('2024-01-16'), action: 'Assigned to remediation team', actor: 'Security Team' }
      ]
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  }
];

class CyberSecurityService {
  private static instance: CyberSecurityService;
  private securityAlerts: Map<string, SecurityAlert> = new Map();
  private vulnerabilities: Map<string, Vulnerability> = new Map();
  private cyberAssets: Map<string, CyberAsset> = new Map();
  private cyberIncidents: Map<string, CyberIncident> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CyberSecurityService {
    if (!CyberSecurityService.instance) {
      CyberSecurityService.instance = new CyberSecurityService();
    }
    return CyberSecurityService.instance;
  }

  private initializeSampleData(): void {
    sampleSecurityAlerts.forEach(a => this.securityAlerts.set(a.id, a));
    sampleVulnerabilities.forEach(v => this.vulnerabilities.set(v.id, v));
  }

  // ==================== Security Alert Management ====================

  async createSecurityAlert(params: Omit<SecurityAlert, 'id' | 'alertNumber' | 'status' | 'timeline' | 'containment' | 'notes' | 'createdAt' | 'updatedAt'>): Promise<SecurityAlert> {
    const alert: SecurityAlert = {
      ...params,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      alertNumber: `SA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'new',
      timeline: {
        detected: params.source.detectedAt,
        events: [{ timestamp: params.source.detectedAt, event: 'Alert created', actor: 'System', automated: true }]
      },
      containment: {
        status: 'not_started',
        actions: [],
        automatedActions: []
      },
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.securityAlerts.set(alert.id, alert);
    return alert;
  }

  async getSecurityAlert(alertId: string): Promise<SecurityAlert | null> {
    return this.securityAlerts.get(alertId) || null;
  }

  async getSecurityAlerts(params?: {
    category?: ThreatCategory;
    severity?: ThreatSeverity;
    status?: AlertStatus;
    assignedTo?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<SecurityAlert[]> {
    let alerts = Array.from(this.securityAlerts.values());

    if (params?.category) {
      alerts = alerts.filter(a => a.category === params.category);
    }

    if (params?.severity) {
      alerts = alerts.filter(a => a.severity === params.severity);
    }

    if (params?.status) {
      alerts = alerts.filter(a => a.status === params.status);
    }

    if (params?.assignedTo) {
      alerts = alerts.filter(a => a.assignedTo === params.assignedTo);
    }

    if (params?.startDate) {
      alerts = alerts.filter(a => a.createdAt >= params.startDate!);
    }

    if (params?.endDate) {
      alerts = alerts.filter(a => a.createdAt <= params.endDate!);
    }

    return alerts.sort((a, b) => {
      const severityOrder = ['critical', 'high', 'medium', 'low', 'info'];
      return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    });
  }

  async updateAlertStatus(alertId: string, status: AlertStatus, actor: string, notes?: string): Promise<SecurityAlert> {
    const alert = this.securityAlerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.status = status;
    
    // Update timeline based on status
    if (status === 'triaging' && !alert.timeline.triageStart) {
      alert.timeline.triageStart = new Date();
    } else if (status === 'investigating' && !alert.timeline.investigationStart) {
      alert.timeline.investigationStart = new Date();
    } else if (status === 'contained' && !alert.timeline.containmentComplete) {
      alert.timeline.containmentComplete = new Date();
      alert.containment.status = 'completed';
    } else if (status === 'resolved') {
      alert.timeline.resolved = new Date();
    }

    alert.timeline.events.push({
      timestamp: new Date(),
      event: `Status changed to ${status}${notes ? `: ${notes}` : ''}`,
      actor,
      automated: false
    });

    alert.updatedAt = new Date();
    return alert;
  }

  async addContainmentAction(alertId: string, action: Omit<ContainmentAction, 'id'>): Promise<SecurityAlert> {
    const alert = this.securityAlerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.containment.actions.push({
      ...action,
      id: `contain-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    if (alert.containment.status === 'not_started') {
      alert.containment.status = 'in_progress';
      alert.timeline.containmentStart = new Date();
    }

    alert.updatedAt = new Date();
    return alert;
  }

  async addAlertNote(alertId: string, note: Omit<AlertNote, 'id' | 'timestamp'>): Promise<SecurityAlert> {
    const alert = this.securityAlerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.notes.push({
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date()
    });
    alert.updatedAt = new Date();
    return alert;
  }

  async addThreatIndicator(alertId: string, indicator: Omit<ThreatIndicator, 'id'>): Promise<SecurityAlert> {
    const alert = this.securityAlerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.indicators.push({
      ...indicator,
      id: `ioc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
    alert.updatedAt = new Date();
    return alert;
  }

  // ==================== Vulnerability Management ====================

  async createVulnerability(params: Omit<Vulnerability, 'id' | 'status' | 'tracking' | 'createdAt' | 'updatedAt'>): Promise<Vulnerability> {
    const vulnerability: Vulnerability = {
      ...params,
      id: `vuln-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'open',
      tracking: {
        discoveredBy: params.discoverySource,
        assignedTo: '',
        exceptions: [],
        history: [
          { date: new Date(), action: 'Vulnerability discovered', actor: 'System' }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.vulnerabilities.set(vulnerability.id, vulnerability);
    return vulnerability;
  }

  async getVulnerability(vulnerabilityId: string): Promise<Vulnerability | null> {
    return this.vulnerabilities.get(vulnerabilityId) || null;
  }

  async getVulnerabilities(params?: {
    severity?: ThreatSeverity;
    status?: VulnerabilityStatus;
    cveId?: string;
    assignedTo?: string;
    exploitAvailable?: boolean;
  }): Promise<Vulnerability[]> {
    let vulnerabilities = Array.from(this.vulnerabilities.values());

    if (params?.severity) {
      vulnerabilities = vulnerabilities.filter(v => v.severity === params.severity);
    }

    if (params?.status) {
      vulnerabilities = vulnerabilities.filter(v => v.status === params.status);
    }

    if (params?.cveId) {
      vulnerabilities = vulnerabilities.filter(v => v.cveId === params.cveId);
    }

    if (params?.assignedTo) {
      vulnerabilities = vulnerabilities.filter(v => v.tracking.assignedTo === params.assignedTo);
    }

    if (params?.exploitAvailable !== undefined) {
      vulnerabilities = vulnerabilities.filter(v => v.exploit.available === params.exploitAvailable);
    }

    return vulnerabilities.sort((a, b) => b.riskAssessment.priorityScore - a.riskAssessment.priorityScore);
  }

  async updateVulnerabilityStatus(vulnId: string, status: VulnerabilityStatus, actor: string): Promise<Vulnerability> {
    const vuln = this.vulnerabilities.get(vulnId);
    if (!vuln) throw new Error(`Vulnerability not found: ${vulnId}`);

    vuln.status = status;
    vuln.tracking.history.push({
      date: new Date(),
      action: `Status changed to ${status}`,
      actor
    });
    vuln.updatedAt = new Date();
    return vuln;
  }

  async assignVulnerability(vulnId: string, assignee: string, actor: string): Promise<Vulnerability> {
    const vuln = this.vulnerabilities.get(vulnId);
    if (!vuln) throw new Error(`Vulnerability not found: ${vulnId}`);

    vuln.tracking.assignedTo = assignee;
    vuln.tracking.history.push({
      date: new Date(),
      action: `Assigned to ${assignee}`,
      actor
    });
    vuln.updatedAt = new Date();
    return vuln;
  }

  async addVulnerabilityException(vulnId: string, exception: Omit<VulnerabilityException, 'id'>): Promise<Vulnerability> {
    const vuln = this.vulnerabilities.get(vulnId);
    if (!vuln) throw new Error(`Vulnerability not found: ${vulnId}`);

    vuln.tracking.exceptions.push({
      ...exception,
      id: `exc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });

    if (exception.riskAcceptance) {
      vuln.status = 'accepted_risk';
    }

    vuln.tracking.history.push({
      date: new Date(),
      action: 'Exception granted',
      actor: exception.approvedBy,
      details: exception.reason
    });
    vuln.updatedAt = new Date();
    return vuln;
  }

  // ==================== Asset Management ====================

  async createCyberAsset(params: Omit<CyberAsset, 'id' | 'vulnerabilities' | 'createdAt' | 'updatedAt'>): Promise<CyberAsset> {
    const asset: CyberAsset = {
      ...params,
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vulnerabilities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.cyberAssets.set(asset.id, asset);
    return asset;
  }

  async getCyberAsset(assetId: string): Promise<CyberAsset | null> {
    return this.cyberAssets.get(assetId) || null;
  }

  async getCyberAssets(params?: {
    type?: CyberAsset['type'];
    criticality?: AssetCriticality;
    status?: CyberAsset['status'];
    department?: string;
  }): Promise<CyberAsset[]> {
    let assets = Array.from(this.cyberAssets.values());

    if (params?.type) {
      assets = assets.filter(a => a.type === params.type);
    }

    if (params?.criticality) {
      assets = assets.filter(a => a.criticality === params.criticality);
    }

    if (params?.status) {
      assets = assets.filter(a => a.status === params.status);
    }

    if (params?.department) {
      assets = assets.filter(a => a.department === params.department);
    }

    return assets.sort((a, b) => a.hostname.localeCompare(b.hostname));
  }

  async updateAssetSecurityControls(assetId: string, controls: SecurityControl[]): Promise<CyberAsset> {
    const asset = this.cyberAssets.get(assetId);
    if (!asset) throw new Error(`Asset not found: ${assetId}`);

    asset.securityControls = controls;
    asset.updatedAt = new Date();
    return asset;
  }

  // ==================== Incident Management ====================

  async createCyberIncident(params: Omit<CyberIncident, 'id' | 'incidentNumber' | 'status' | 'timeline' | 'actions' | 'communications' | 'evidence' | 'lessons' | 'createdAt' | 'updatedAt'>): Promise<CyberIncident> {
    const incident: CyberIncident = {
      ...params,
      id: `cyber-inc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentNumber: `CI-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'declared',
      timeline: {
        detected: new Date(),
        declared: new Date(),
        events: [{ timestamp: new Date(), event: 'Incident declared', actor: params.responseTeam[0]?.name || 'System', automated: false }]
      },
      actions: [],
      communications: [],
      evidence: [],
      lessons: {
        completed: false,
        participants: [],
        whatWorked: [],
        whatDidntWork: [],
        recommendations: [],
        actionItems: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.cyberIncidents.set(incident.id, incident);
    return incident;
  }

  async getCyberIncident(incidentId: string): Promise<CyberIncident | null> {
    return this.cyberIncidents.get(incidentId) || null;
  }

  async getCyberIncidents(params?: {
    type?: ThreatCategory;
    severity?: ThreatSeverity;
    status?: CyberIncident['status'];
  }): Promise<CyberIncident[]> {
    let incidents = Array.from(this.cyberIncidents.values());

    if (params?.type) {
      incidents = incidents.filter(i => i.type === params.type);
    }

    if (params?.severity) {
      incidents = incidents.filter(i => i.severity === params.severity);
    }

    if (params?.status) {
      incidents = incidents.filter(i => i.status === params.status);
    }

    return incidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateIncidentStatus(incidentId: string, status: CyberIncident['status'], actor: string): Promise<CyberIncident> {
    const incident = this.cyberIncidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    incident.status = status;
    
    // Update timeline
    if (status === 'containing') incident.timeline.containment = new Date();
    else if (status === 'eradicating') incident.timeline.eradication = new Date();
    else if (status === 'recovering') incident.timeline.recovery = new Date();
    else if (status === 'closed') incident.timeline.closed = new Date();
    else if (status === 'post_incident') incident.timeline.postIncidentReview = new Date();

    incident.timeline.events.push({
      timestamp: new Date(),
      event: `Status changed to ${status}`,
      actor,
      automated: false
    });

    incident.updatedAt = new Date();
    return incident;
  }

  async addIncidentAction(incidentId: string, action: Omit<IncidentAction, 'id' | 'status'>): Promise<CyberIncident> {
    const incident = this.cyberIncidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    incident.actions.push({
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending'
    });
    incident.updatedAt = new Date();
    return incident;
  }

  async addEvidence(incidentId: string, evidence: Omit<DigitalEvidence, 'id' | 'chainOfCustody' | 'analyzed'>): Promise<CyberIncident> {
    const incident = this.cyberIncidents.get(incidentId);
    if (!incident) throw new Error(`Incident not found: ${incidentId}`);

    incident.evidence.push({
      ...evidence,
      id: `evid-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      chainOfCustody: [{ timestamp: new Date(), action: 'Evidence collected', actor: evidence.collectedBy }],
      analyzed: false
    });
    incident.updatedAt = new Date();
    return incident;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalAlerts: number;
    openAlerts: number;
    criticalAlerts: number;
    alertsBySeverity: Record<ThreatSeverity, number>;
    alertsByCategory: Record<ThreatCategory, number>;
    totalVulnerabilities: number;
    openVulnerabilities: number;
    criticalVulnerabilities: number;
    averageCVSS: number;
    totalAssets: number;
    assetsByCriticality: Record<AssetCriticality, number>;
    totalIncidents: number;
    activeIncidents: number;
    meanTimeToDetect: number;
    meanTimeToRespond: number;
    meanTimeToResolve: number;
  }> {
    const alerts = Array.from(this.securityAlerts.values());
    const vulnerabilities = Array.from(this.vulnerabilities.values());
    const assets = Array.from(this.cyberAssets.values());
    const incidents = Array.from(this.cyberIncidents.values());

    const alertsBySeverity: Record<ThreatSeverity, number> = {} as any;
    const alertsByCategory: Record<ThreatCategory, number> = {} as any;
    alerts.forEach(a => {
      alertsBySeverity[a.severity] = (alertsBySeverity[a.severity] || 0) + 1;
      alertsByCategory[a.category] = (alertsByCategory[a.category] || 0) + 1;
    });

    const assetsByCriticality: Record<AssetCriticality, number> = {} as any;
    assets.forEach(a => {
      assetsByCriticality[a.criticality] = (assetsByCriticality[a.criticality] || 0) + 1;
    });

    const vulnsWithScore = vulnerabilities.filter(v => v.cvssScore);
    const avgCVSS = vulnsWithScore.length > 0
      ? vulnsWithScore.reduce((sum, v) => sum + (v.cvssScore || 0), 0) / vulnsWithScore.length
      : 0;

    // Calculate MTTD, MTTR, MTTRES (in hours)
    let totalDetectTime = 0, totalRespondTime = 0, totalResolveTime = 0;
    let detectCount = 0, respondCount = 0, resolveCount = 0;

    alerts.forEach(a => {
      if (a.timeline.detected && a.timeline.acknowledged) {
        totalDetectTime += (a.timeline.acknowledged.getTime() - a.timeline.detected.getTime()) / (1000 * 60 * 60);
        detectCount++;
      }
      if (a.timeline.acknowledged && a.timeline.containmentStart) {
        totalRespondTime += (a.timeline.containmentStart.getTime() - a.timeline.acknowledged.getTime()) / (1000 * 60 * 60);
        respondCount++;
      }
      if (a.timeline.detected && a.timeline.resolved) {
        totalResolveTime += (a.timeline.resolved.getTime() - a.timeline.detected.getTime()) / (1000 * 60 * 60);
        resolveCount++;
      }
    });

    return {
      totalAlerts: alerts.length,
      openAlerts: alerts.filter(a => !['resolved', 'false_positive'].includes(a.status)).length,
      criticalAlerts: alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length,
      alertsBySeverity,
      alertsByCategory,
      totalVulnerabilities: vulnerabilities.length,
      openVulnerabilities: vulnerabilities.filter(v => v.status === 'open').length,
      criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'critical' && v.status === 'open').length,
      averageCVSS: avgCVSS,
      totalAssets: assets.length,
      assetsByCriticality,
      totalIncidents: incidents.length,
      activeIncidents: incidents.filter(i => !['closed', 'post_incident'].includes(i.status)).length,
      meanTimeToDetect: detectCount > 0 ? totalDetectTime / detectCount : 0,
      meanTimeToRespond: respondCount > 0 ? totalRespondTime / respondCount : 0,
      meanTimeToResolve: resolveCount > 0 ? totalResolveTime / resolveCount : 0
    };
  }
}

export const cyberSecurityService = CyberSecurityService.getInstance();
export default CyberSecurityService;

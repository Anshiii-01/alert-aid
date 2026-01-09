/**
 * Moderation Service - #113
 * Content filtering, ML detection, queues, appeals, audit logging
 */

// Moderation status
type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'escalated' | 'appealed' | 'auto_approved' | 'auto_rejected';

// Content type
type ContentType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'link' | 'comment' | 'profile' | 'message';

// Violation type
type ViolationType = 'spam' | 'harassment' | 'hate_speech' | 'violence' | 'nudity' | 'misinformation' | 'copyright' | 'illegal' | 'self_harm' | 'terrorism' | 'fraud' | 'impersonation' | 'other';

// Severity level
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// Appeal status
type AppealStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';

// Moderator role
type ModeratorRole = 'junior' | 'senior' | 'lead' | 'admin' | 'ml_system';

// Detection method
type DetectionMethod = 'ml_text' | 'ml_image' | 'ml_video' | 'ml_audio' | 'keyword' | 'regex' | 'hash' | 'manual' | 'user_report' | 'automated_rule';

// Moderation rule
interface ModerationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  contentTypes: ContentType[];
  conditions: {
    type: 'keyword' | 'regex' | 'threshold' | 'ml_score' | 'user_attribute' | 'content_attribute';
    field: string;
    operator: 'contains' | 'matches' | 'equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
    value: string | number | string[];
    caseSensitive?: boolean;
  }[];
  actions: {
    type: 'flag' | 'reject' | 'approve' | 'escalate' | 'notify' | 'shadowban' | 'queue';
    params?: Record<string, unknown>;
  }[];
  violationType: ViolationType;
  severity: SeverityLevel;
  stats: {
    triggered: number;
    falsePositives: number;
    lastTriggered?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Content item for moderation
interface ModerationItem {
  id: string;
  contentId: string;
  contentType: ContentType;
  content: {
    text?: string;
    url?: string;
    thumbnail?: string;
    metadata?: Record<string, unknown>;
  };
  author: {
    id: string;
    username: string;
    trustScore: number;
    previousViolations: number;
    accountAge: number;
  };
  context: {
    source: string;
    parentId?: string;
    reportCount: number;
    viewCount: number;
    flaggedBy?: string[];
  };
  detection: {
    method: DetectionMethod;
    ruleId?: string;
    confidence: number;
    scores: Record<ViolationType, number>;
    detectedAt: Date;
  };
  status: ModerationStatus;
  violation?: {
    type: ViolationType;
    severity: SeverityLevel;
    description: string;
    evidence: string[];
  };
  assignment?: {
    moderatorId: string;
    assignedAt: Date;
    dueAt?: Date;
  };
  decision?: {
    action: 'approve' | 'reject' | 'escalate' | 'no_action';
    reason: string;
    moderatorId: string;
    decidedAt: Date;
    notes?: string;
  };
  appeal?: ModerationAppeal;
  auditTrail: AuditLogEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Moderation queue
interface ModerationQueue {
  id: string;
  name: string;
  description: string;
  contentTypes: ContentType[];
  violationTypes: ViolationType[];
  priority: number;
  assignedModerators: string[];
  settings: {
    autoAssign: boolean;
    maxItemsPerModerator: number;
    slaHours: number;
    escalationThreshold: number;
  };
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
    avgResolutionTime: number;
  };
  filters: {
    severityLevels?: SeverityLevel[];
    minConfidence?: number;
    maxConfidence?: number;
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Moderation appeal
interface ModerationAppeal {
  id: string;
  itemId: string;
  userId: string;
  status: AppealStatus;
  reason: string;
  evidence?: string[];
  originalDecision: {
    action: string;
    reason: string;
    decidedAt: Date;
  };
  review?: {
    reviewerId: string;
    decision: 'uphold' | 'overturn' | 'partial';
    reason: string;
    reviewedAt: Date;
  };
  timeline: {
    event: string;
    timestamp: Date;
    actor?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Audit log entry
interface AuditLogEntry {
  id: string;
  itemId: string;
  action: string;
  actor: {
    id: string;
    type: 'moderator' | 'system' | 'user';
    role?: ModeratorRole;
  };
  details: Record<string, unknown>;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// ML detection result
interface MLDetectionResult {
  contentId: string;
  model: string;
  version: string;
  scores: {
    category: ViolationType;
    score: number;
    confidence: number;
  }[];
  overallRisk: number;
  flagged: boolean;
  explanation?: string;
  processingTime: number;
  timestamp: Date;
}

// Moderator profile
interface ModeratorProfile {
  id: string;
  userId: string;
  username: string;
  role: ModeratorRole;
  queues: string[];
  specializations: ViolationType[];
  permissions: {
    canApprove: boolean;
    canReject: boolean;
    canEscalate: boolean;
    canBan: boolean;
    canViewAppeals: boolean;
    canReviewAppeals: boolean;
    canManageRules: boolean;
  };
  stats: {
    totalDecisions: number;
    approvals: number;
    rejections: number;
    escalations: number;
    accuracyRate: number;
    avgDecisionTime: number;
    appealsOverturned: number;
  };
  schedule: {
    timezone: string;
    workingHours: { start: string; end: string };
    daysOff: number[];
  };
  status: 'active' | 'away' | 'offline';
  lastActive: Date;
  createdAt: Date;
}

// Moderation statistics
interface ModerationStats {
  period: { start: Date; end: Date };
  overview: {
    totalItems: number;
    pending: number;
    approved: number;
    rejected: number;
    escalated: number;
    appealed: number;
  };
  byViolationType: {
    type: ViolationType;
    count: number;
    percentage: number;
  }[];
  byContentType: {
    type: ContentType;
    count: number;
    percentage: number;
  }[];
  bySeverity: {
    level: SeverityLevel;
    count: number;
    percentage: number;
  }[];
  performance: {
    avgResolutionTime: number;
    slaCompliance: number;
    accuracyRate: number;
    falsePositiveRate: number;
  };
  trends: {
    date: Date;
    items: number;
    violations: number;
  }[];
  topModerators: {
    id: string;
    username: string;
    decisions: number;
    accuracy: number;
  }[];
}

// Content filter
interface ContentFilter {
  id: string;
  name: string;
  type: 'keyword' | 'regex' | 'hash' | 'ml_model';
  enabled: boolean;
  pattern?: string;
  keywords?: string[];
  hashes?: string[];
  modelId?: string;
  action: 'flag' | 'block' | 'replace' | 'warn';
  replacement?: string;
  severity: SeverityLevel;
  contexts: string[];
  stats: {
    matches: number;
    lastMatch?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Ban record
interface BanRecord {
  id: string;
  userId: string;
  username: string;
  type: 'temporary' | 'permanent' | 'shadowban';
  reason: string;
  violationType: ViolationType;
  evidence: string[];
  moderatorId: string;
  startDate: Date;
  endDate?: Date;
  lifted?: {
    at: Date;
    by: string;
    reason: string;
  };
  appealed: boolean;
  createdAt: Date;
}

class ModerationService {
  private static instance: ModerationService;
  private rules: Map<string, ModerationRule> = new Map();
  private items: Map<string, ModerationItem> = new Map();
  private queues: Map<string, ModerationQueue> = new Map();
  private appeals: Map<string, ModerationAppeal> = new Map();
  private auditLogs: Map<string, AuditLogEntry> = new Map();
  private moderators: Map<string, ModeratorProfile> = new Map();
  private filters: Map<string, ContentFilter> = new Map();
  private bans: Map<string, BanRecord> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ModerationService {
    if (!ModerationService.instance) {
      ModerationService.instance = new ModerationService();
    }
    return ModerationService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize moderation rules
    const rulesData = [
      { name: 'Spam Detection', type: 'spam', severity: 'medium', keywords: ['buy now', 'click here', 'free money'] },
      { name: 'Hate Speech Filter', type: 'hate_speech', severity: 'high', keywords: [] },
      { name: 'Violence Detection', type: 'violence', severity: 'high', keywords: [] },
      { name: 'Misinformation Flag', type: 'misinformation', severity: 'medium', keywords: ['fake', 'hoax', 'conspiracy'] },
      { name: 'Self-Harm Prevention', type: 'self_harm', severity: 'critical', keywords: [] },
      { name: 'Fraud Detection', type: 'fraud', severity: 'high', keywords: ['wire transfer', 'bank details', 'password'] },
    ];

    rulesData.forEach((rule, idx) => {
      const moderationRule: ModerationRule = {
        id: `rule-${(idx + 1).toString().padStart(4, '0')}`,
        name: rule.name,
        description: `Automated ${rule.name.toLowerCase()} rule`,
        enabled: true,
        priority: idx + 1,
        contentTypes: ['text', 'comment', 'message'],
        conditions: [
          {
            type: 'ml_score',
            field: rule.type,
            operator: 'greater_than',
            value: 0.7,
          },
        ],
        actions: [
          { type: 'flag', params: { severity: rule.severity } },
          { type: 'queue', params: { queueId: 'queue-0001' } },
        ],
        violationType: rule.type as ViolationType,
        severity: rule.severity as SeverityLevel,
        stats: {
          triggered: Math.floor(Math.random() * 1000) + 100,
          falsePositives: Math.floor(Math.random() * 50),
          lastTriggered: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        createdBy: 'admin-001',
      };
      this.rules.set(moderationRule.id, moderationRule);
    });

    // Initialize moderation queues
    const queuesData = [
      { name: 'High Priority', types: ['hate_speech', 'violence', 'self_harm', 'terrorism'], priority: 1 },
      { name: 'General Review', types: ['spam', 'misinformation', 'other'], priority: 2 },
      { name: 'Media Review', types: ['nudity', 'violence', 'copyright'], priority: 3 },
      { name: 'Appeals', types: [], priority: 4 },
    ];

    queuesData.forEach((queue, idx) => {
      const moderationQueue: ModerationQueue = {
        id: `queue-${(idx + 1).toString().padStart(4, '0')}`,
        name: queue.name,
        description: `${queue.name} moderation queue`,
        contentTypes: ['text', 'image', 'video', 'comment'],
        violationTypes: queue.types as ViolationType[],
        priority: queue.priority,
        assignedModerators: [`mod-${idx + 1}`, `mod-${idx + 2}`],
        settings: {
          autoAssign: true,
          maxItemsPerModerator: 50,
          slaHours: queue.priority === 1 ? 1 : queue.priority === 2 ? 4 : 24,
          escalationThreshold: 3,
        },
        stats: {
          pending: Math.floor(Math.random() * 100) + 10,
          inProgress: Math.floor(Math.random() * 30) + 5,
          completed: Math.floor(Math.random() * 500) + 100,
          avgResolutionTime: Math.floor(Math.random() * 120) + 15,
        },
        filters: {
          severityLevels: queue.priority === 1 ? ['high', 'critical'] : undefined,
        },
        enabled: true,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.queues.set(moderationQueue.id, moderationQueue);
    });

    // Initialize moderators
    const moderatorsData = [
      { username: 'mod_alice', role: 'lead', accuracy: 96 },
      { username: 'mod_bob', role: 'senior', accuracy: 94 },
      { username: 'mod_carol', role: 'junior', accuracy: 89 },
      { username: 'mod_dave', role: 'senior', accuracy: 92 },
      { username: 'ml_system', role: 'ml_system', accuracy: 87 },
    ];

    moderatorsData.forEach((mod, idx) => {
      const profile: ModeratorProfile = {
        id: `mod-${(idx + 1).toString().padStart(4, '0')}`,
        userId: `user-mod-${idx + 1}`,
        username: mod.username,
        role: mod.role as ModeratorRole,
        queues: ['queue-0001', 'queue-0002'],
        specializations: ['spam', 'hate_speech', 'misinformation'] as ViolationType[],
        permissions: {
          canApprove: true,
          canReject: true,
          canEscalate: true,
          canBan: mod.role !== 'junior',
          canViewAppeals: mod.role !== 'junior',
          canReviewAppeals: mod.role === 'lead' || mod.role === 'admin',
          canManageRules: mod.role === 'lead' || mod.role === 'admin',
        },
        stats: {
          totalDecisions: Math.floor(Math.random() * 5000) + 500,
          approvals: Math.floor(Math.random() * 3000) + 300,
          rejections: Math.floor(Math.random() * 1500) + 150,
          escalations: Math.floor(Math.random() * 200) + 20,
          accuracyRate: mod.accuracy,
          avgDecisionTime: Math.floor(Math.random() * 120) + 30,
          appealsOverturned: Math.floor(Math.random() * 20) + 2,
        },
        schedule: {
          timezone: 'Asia/Kolkata',
          workingHours: { start: '09:00', end: '18:00' },
          daysOff: [0, 6],
        },
        status: idx < 3 ? 'active' : 'away',
        lastActive: new Date(Date.now() - idx * 30 * 60 * 1000),
        createdAt: new Date(Date.now() - idx * 60 * 24 * 60 * 60 * 1000),
      };
      this.moderators.set(profile.id, profile);
    });

    // Initialize moderation items
    const itemsData = [
      { type: 'spam', status: 'pending', severity: 'medium' },
      { type: 'hate_speech', status: 'flagged', severity: 'high' },
      { type: 'misinformation', status: 'pending', severity: 'medium' },
      { type: 'violence', status: 'rejected', severity: 'high' },
      { type: 'spam', status: 'approved', severity: 'low' },
      { type: 'harassment', status: 'escalated', severity: 'high' },
      { type: 'fraud', status: 'pending', severity: 'critical' },
      { type: 'nudity', status: 'rejected', severity: 'medium' },
    ];

    itemsData.forEach((item, idx) => {
      const moderationItem: ModerationItem = {
        id: `item-${(idx + 1).toString().padStart(6, '0')}`,
        contentId: `content-${idx + 1}`,
        contentType: ['text', 'comment', 'image', 'message'][idx % 4] as ContentType,
        content: {
          text: `Sample content for moderation item #${idx + 1}`,
          metadata: { source: 'user_generated' },
        },
        author: {
          id: `author-${idx + 1}`,
          username: `user${idx + 1}`,
          trustScore: 50 + Math.random() * 50,
          previousViolations: Math.floor(Math.random() * 3),
          accountAge: Math.floor(Math.random() * 365) + 30,
        },
        context: {
          source: 'public_feed',
          reportCount: Math.floor(Math.random() * 5),
          viewCount: Math.floor(Math.random() * 1000) + 100,
        },
        detection: {
          method: ['ml_text', 'keyword', 'user_report', 'automated_rule'][idx % 4] as DetectionMethod,
          ruleId: `rule-${((idx % 6) + 1).toString().padStart(4, '0')}`,
          confidence: 0.7 + Math.random() * 0.25,
          scores: {
            spam: Math.random() * 0.3,
            harassment: Math.random() * 0.3,
            hate_speech: item.type === 'hate_speech' ? 0.8 + Math.random() * 0.15 : Math.random() * 0.2,
            violence: item.type === 'violence' ? 0.8 + Math.random() * 0.15 : Math.random() * 0.2,
            nudity: Math.random() * 0.1,
            misinformation: item.type === 'misinformation' ? 0.75 + Math.random() * 0.2 : Math.random() * 0.2,
            copyright: Math.random() * 0.1,
            illegal: Math.random() * 0.05,
            self_harm: Math.random() * 0.05,
            terrorism: Math.random() * 0.02,
            fraud: item.type === 'fraud' ? 0.85 + Math.random() * 0.1 : Math.random() * 0.1,
            impersonation: Math.random() * 0.1,
            other: Math.random() * 0.1,
          },
          detectedAt: new Date(Date.now() - idx * 2 * 60 * 60 * 1000),
        },
        status: item.status as ModerationStatus,
        violation: item.status !== 'approved' ? {
          type: item.type as ViolationType,
          severity: item.severity as SeverityLevel,
          description: `Potential ${item.type.replace('_', ' ')} violation detected`,
          evidence: [`ML score: ${(0.7 + Math.random() * 0.25).toFixed(2)}`],
        } : undefined,
        decision: ['approved', 'rejected'].includes(item.status) ? {
          action: item.status === 'approved' ? 'approve' : 'reject',
          reason: item.status === 'approved' ? 'Content meets guidelines' : 'Violation confirmed',
          moderatorId: 'mod-0001',
          decidedAt: new Date(),
        } : undefined,
        auditTrail: [
          {
            id: `audit-${idx}-1`,
            itemId: `item-${(idx + 1).toString().padStart(6, '0')}`,
            action: 'created',
            actor: { id: 'system', type: 'system' },
            details: { source: 'auto_detection' },
            timestamp: new Date(Date.now() - idx * 2 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - idx * 2 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.items.set(moderationItem.id, moderationItem);
    });

    // Initialize content filters
    const filtersData = [
      { name: 'Profanity Filter', type: 'keyword', action: 'replace' },
      { name: 'URL Spam Filter', type: 'regex', action: 'block' },
      { name: 'Known Bad Actors', type: 'hash', action: 'block' },
      { name: 'AI Content Detector', type: 'ml_model', action: 'flag' },
    ];

    filtersData.forEach((filter, idx) => {
      const contentFilter: ContentFilter = {
        id: `filter-${(idx + 1).toString().padStart(4, '0')}`,
        name: filter.name,
        type: filter.type as ContentFilter['type'],
        enabled: true,
        keywords: filter.type === 'keyword' ? ['badword1', 'badword2', 'badword3'] : undefined,
        pattern: filter.type === 'regex' ? 'https?://(?:bit\\.ly|tinyurl\\.com)/\\S+' : undefined,
        modelId: filter.type === 'ml_model' ? 'model-content-safety-v2' : undefined,
        action: filter.action as ContentFilter['action'],
        replacement: filter.action === 'replace' ? '***' : undefined,
        severity: 'medium',
        contexts: ['comments', 'posts', 'messages'],
        stats: {
          matches: Math.floor(Math.random() * 10000) + 1000,
          lastMatch: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.filters.set(contentFilter.id, contentFilter);
    });

    // Initialize appeals
    for (let i = 0; i < 5; i++) {
      const appeal: ModerationAppeal = {
        id: `appeal-${(i + 1).toString().padStart(6, '0')}`,
        itemId: `item-${(i + 4).toString().padStart(6, '0')}`,
        userId: `user-${i + 1}`,
        status: ['pending', 'under_review', 'approved', 'rejected', 'pending'][i] as AppealStatus,
        reason: 'I believe this content was wrongly flagged. It does not violate community guidelines.',
        originalDecision: {
          action: 'reject',
          reason: 'Content violated community guidelines',
          decidedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        },
        review: i === 2 || i === 3 ? {
          reviewerId: 'mod-0001',
          decision: i === 2 ? 'overturn' : 'uphold',
          reason: i === 2 ? 'Upon review, content does not violate guidelines' : 'Original decision upheld',
          reviewedAt: new Date(),
        } : undefined,
        timeline: [
          { event: 'Appeal submitted', timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000) },
          { event: 'Under review', timestamp: new Date(Date.now() - i * 12 * 60 * 60 * 1000), actor: 'mod-0001' },
        ],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.appeals.set(appeal.id, appeal);
    }
  }

  /**
   * Get moderation rules
   */
  public getRules(filter?: { enabled?: boolean; violationType?: ViolationType }): ModerationRule[] {
    let rules = Array.from(this.rules.values());
    if (filter?.enabled !== undefined) rules = rules.filter((r) => r.enabled === filter.enabled);
    if (filter?.violationType) rules = rules.filter((r) => r.violationType === filter.violationType);
    return rules.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get rule
   */
  public getRule(ruleId: string): ModerationRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Create rule
   */
  public createRule(rule: Omit<ModerationRule, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): ModerationRule {
    const newRule: ModerationRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      stats: { triggered: 0, falsePositives: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.rules.set(newRule.id, newRule);
    this.emit('rule_created', newRule);

    return newRule;
  }

  /**
   * Get moderation items
   */
  public getItems(filter?: {
    status?: ModerationStatus;
    contentType?: ContentType;
    violationType?: ViolationType;
    queueId?: string;
    assignedTo?: string;
    limit?: number;
  }): ModerationItem[] {
    let items = Array.from(this.items.values());
    if (filter?.status) items = items.filter((i) => i.status === filter.status);
    if (filter?.contentType) items = items.filter((i) => i.contentType === filter.contentType);
    if (filter?.violationType) items = items.filter((i) => i.violation?.type === filter.violationType);
    if (filter?.assignedTo) items = items.filter((i) => i.assignment?.moderatorId === filter.assignedTo);
    items = items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (filter?.limit) items = items.slice(0, filter.limit);
    return items;
  }

  /**
   * Get item
   */
  public getItem(itemId: string): ModerationItem | undefined {
    return this.items.get(itemId);
  }

  /**
   * Submit content for moderation
   */
  public async submitContent(
    contentId: string,
    contentType: ContentType,
    content: ModerationItem['content'],
    author: ModerationItem['author']
  ): Promise<ModerationItem> {
    // Simulate ML detection
    await new Promise((resolve) => setTimeout(resolve, 200));

    const scores: Record<ViolationType, number> = {
      spam: Math.random() * 0.3,
      harassment: Math.random() * 0.3,
      hate_speech: Math.random() * 0.3,
      violence: Math.random() * 0.3,
      nudity: Math.random() * 0.2,
      misinformation: Math.random() * 0.3,
      copyright: Math.random() * 0.1,
      illegal: Math.random() * 0.05,
      self_harm: Math.random() * 0.05,
      terrorism: Math.random() * 0.02,
      fraud: Math.random() * 0.1,
      impersonation: Math.random() * 0.1,
      other: Math.random() * 0.1,
    };

    const maxScore = Math.max(...Object.values(scores));
    const maxType = Object.entries(scores).find(([, v]) => v === maxScore)?.[0] as ViolationType;

    const item: ModerationItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      contentId,
      contentType,
      content,
      author,
      context: {
        source: 'api_submission',
        reportCount: 0,
        viewCount: 0,
      },
      detection: {
        method: 'ml_text',
        confidence: maxScore,
        scores,
        detectedAt: new Date(),
      },
      status: maxScore > 0.7 ? 'flagged' : maxScore > 0.5 ? 'pending' : 'auto_approved',
      violation: maxScore > 0.5 ? {
        type: maxType,
        severity: maxScore > 0.85 ? 'critical' : maxScore > 0.7 ? 'high' : 'medium',
        description: `Potential ${maxType.replace('_', ' ')} detected`,
        evidence: [`ML confidence: ${maxScore.toFixed(2)}`],
      } : undefined,
      auditTrail: [
        {
          id: `audit-${Date.now()}-1`,
          itemId: '',
          action: 'submitted',
          actor: { id: 'system', type: 'system' },
          details: { method: 'api_submission' },
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    item.auditTrail[0].itemId = item.id;
    this.items.set(item.id, item);

    this.emit('content_submitted', item);

    return item;
  }

  /**
   * Make decision
   */
  public makeDecision(
    itemId: string,
    moderatorId: string,
    action: 'approve' | 'reject' | 'escalate',
    reason: string,
    notes?: string
  ): ModerationItem {
    const item = this.items.get(itemId);
    if (!item) throw new Error('Item not found');

    item.decision = {
      action,
      reason,
      moderatorId,
      decidedAt: new Date(),
      notes,
    };

    item.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'escalated';
    item.updatedAt = new Date();

    item.auditTrail.push({
      id: `audit-${Date.now()}`,
      itemId,
      action: `decision_${action}`,
      actor: { id: moderatorId, type: 'moderator' },
      details: { reason, notes },
      timestamp: new Date(),
    });

    this.emit('decision_made', item);

    return item;
  }

  /**
   * Get queues
   */
  public getQueues(): ModerationQueue[] {
    return Array.from(this.queues.values()).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get queue
   */
  public getQueue(queueId: string): ModerationQueue | undefined {
    return this.queues.get(queueId);
  }

  /**
   * Get queue items
   */
  public getQueueItems(queueId: string, limit?: number): ModerationItem[] {
    const queue = this.queues.get(queueId);
    if (!queue) return [];

    let items = Array.from(this.items.values()).filter(
      (i) => queue.violationTypes.length === 0 || (i.violation && queue.violationTypes.includes(i.violation.type))
    );
    items = items.filter((i) => i.status === 'pending' || i.status === 'flagged');
    items = items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (limit) items = items.slice(0, limit);

    return items;
  }

  /**
   * Get appeals
   */
  public getAppeals(filter?: { status?: AppealStatus; limit?: number }): ModerationAppeal[] {
    let appeals = Array.from(this.appeals.values());
    if (filter?.status) appeals = appeals.filter((a) => a.status === filter.status);
    appeals = appeals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (filter?.limit) appeals = appeals.slice(0, filter.limit);
    return appeals;
  }

  /**
   * Submit appeal
   */
  public submitAppeal(itemId: string, userId: string, reason: string, evidence?: string[]): ModerationAppeal {
    const item = this.items.get(itemId);
    if (!item) throw new Error('Item not found');
    if (item.status !== 'rejected') throw new Error('Can only appeal rejected items');

    const appeal: ModerationAppeal = {
      id: `appeal-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      itemId,
      userId,
      status: 'pending',
      reason,
      evidence,
      originalDecision: {
        action: item.decision!.action,
        reason: item.decision!.reason,
        decidedAt: item.decision!.decidedAt,
      },
      timeline: [
        { event: 'Appeal submitted', timestamp: new Date() },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.appeals.set(appeal.id, appeal);
    item.appeal = appeal;
    item.status = 'appealed';

    this.emit('appeal_submitted', appeal);

    return appeal;
  }

  /**
   * Review appeal
   */
  public reviewAppeal(
    appealId: string,
    reviewerId: string,
    decision: 'uphold' | 'overturn' | 'partial',
    reason: string
  ): ModerationAppeal {
    const appeal = this.appeals.get(appealId);
    if (!appeal) throw new Error('Appeal not found');

    appeal.review = {
      reviewerId,
      decision,
      reason,
      reviewedAt: new Date(),
    };
    appeal.status = decision === 'overturn' ? 'approved' : 'rejected';
    appeal.timeline.push({
      event: `Appeal ${decision === 'overturn' ? 'approved' : decision === 'uphold' ? 'rejected' : 'partially resolved'}`,
      timestamp: new Date(),
      actor: reviewerId,
    });
    appeal.updatedAt = new Date();

    // Update original item if overturned
    if (decision === 'overturn') {
      const item = this.items.get(appeal.itemId);
      if (item) {
        item.status = 'approved';
        item.updatedAt = new Date();
      }
    }

    this.emit('appeal_reviewed', appeal);

    return appeal;
  }

  /**
   * Get moderators
   */
  public getModerators(filter?: { role?: ModeratorRole; status?: string }): ModeratorProfile[] {
    let moderators = Array.from(this.moderators.values());
    if (filter?.role) moderators = moderators.filter((m) => m.role === filter.role);
    if (filter?.status) moderators = moderators.filter((m) => m.status === filter.status);
    return moderators;
  }

  /**
   * Get moderator
   */
  public getModerator(moderatorId: string): ModeratorProfile | undefined {
    return this.moderators.get(moderatorId);
  }

  /**
   * Get content filters
   */
  public getFilters(): ContentFilter[] {
    return Array.from(this.filters.values());
  }

  /**
   * Apply filters to content
   */
  public applyFilters(content: string): { passed: boolean; matches: { filterId: string; action: string }[] } {
    const matches: { filterId: string; action: string }[] = [];

    this.filters.forEach((filter) => {
      if (!filter.enabled) return;

      let matched = false;
      if (filter.type === 'keyword' && filter.keywords) {
        matched = filter.keywords.some((kw) => content.toLowerCase().includes(kw.toLowerCase()));
      } else if (filter.type === 'regex' && filter.pattern) {
        matched = new RegExp(filter.pattern, 'i').test(content);
      }

      if (matched) {
        matches.push({ filterId: filter.id, action: filter.action });
        filter.stats.matches++;
        filter.stats.lastMatch = new Date();
      }
    });

    return {
      passed: !matches.some((m) => m.action === 'block'),
      matches,
    };
  }

  /**
   * Get moderation stats
   */
  public getStats(period: { start: Date; end: Date }): ModerationStats {
    const items = Array.from(this.items.values()).filter(
      (i) => i.createdAt >= period.start && i.createdAt <= period.end
    );

    const byViolationType: Record<ViolationType, number> = {
      spam: 0, harassment: 0, hate_speech: 0, violence: 0, nudity: 0,
      misinformation: 0, copyright: 0, illegal: 0, self_harm: 0,
      terrorism: 0, fraud: 0, impersonation: 0, other: 0,
    };
    const byContentType: Record<ContentType, number> = {
      text: 0, image: 0, video: 0, audio: 0, file: 0, link: 0, comment: 0, profile: 0, message: 0,
    };
    const bySeverity: Record<SeverityLevel, number> = { low: 0, medium: 0, high: 0, critical: 0 };

    items.forEach((item) => {
      byContentType[item.contentType]++;
      if (item.violation) {
        byViolationType[item.violation.type]++;
        bySeverity[item.violation.severity]++;
      }
    });

    const total = items.length || 1;

    return {
      period,
      overview: {
        totalItems: items.length,
        pending: items.filter((i) => i.status === 'pending' || i.status === 'flagged').length,
        approved: items.filter((i) => i.status === 'approved' || i.status === 'auto_approved').length,
        rejected: items.filter((i) => i.status === 'rejected' || i.status === 'auto_rejected').length,
        escalated: items.filter((i) => i.status === 'escalated').length,
        appealed: items.filter((i) => i.status === 'appealed').length,
      },
      byViolationType: Object.entries(byViolationType).map(([type, count]) => ({
        type: type as ViolationType,
        count,
        percentage: (count / total) * 100,
      })),
      byContentType: Object.entries(byContentType).map(([type, count]) => ({
        type: type as ContentType,
        count,
        percentage: (count / total) * 100,
      })),
      bySeverity: Object.entries(bySeverity).map(([level, count]) => ({
        level: level as SeverityLevel,
        count,
        percentage: (count / total) * 100,
      })),
      performance: {
        avgResolutionTime: 45,
        slaCompliance: 92,
        accuracyRate: 94,
        falsePositiveRate: 6,
      },
      trends: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        items: Math.floor(Math.random() * 100) + 50,
        violations: Math.floor(Math.random() * 30) + 10,
      })),
      topModerators: Array.from(this.moderators.values())
        .filter((m) => m.role !== 'ml_system')
        .slice(0, 5)
        .map((m) => ({
          id: m.id,
          username: m.username,
          decisions: m.stats.totalDecisions,
          accuracy: m.stats.accuracyRate,
        })),
    };
  }

  /**
   * Subscribe to events
   */
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    this.listeners.forEach((callback) => callback(event, data));
  }
}

export const moderationService = ModerationService.getInstance();
export type {
  ModerationStatus,
  ContentType,
  ViolationType,
  SeverityLevel,
  AppealStatus,
  ModeratorRole,
  DetectionMethod,
  ModerationRule,
  ModerationItem,
  ModerationQueue,
  ModerationAppeal,
  AuditLogEntry,
  MLDetectionResult,
  ModeratorProfile,
  ModerationStats,
  ContentFilter,
  BanRecord,
};

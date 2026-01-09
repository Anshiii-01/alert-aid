/**
 * A/B Testing Service
 * Comprehensive experimentation, hypothesis testing, and statistical analysis
 */

// Experiment Type
type ExperimentType = 'ab_test' | 'multivariate' | 'split_url' | 'multi_page' | 'personalization' | 'bandit';

// Experiment Status
type ExperimentStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'archived' | 'stopped';

// Traffic Allocation Method
type TrafficAllocationMethod = 'random' | 'weighted' | 'deterministic' | 'sticky' | 'adaptive';

// Statistical Method
type StatisticalMethod = 'frequentist' | 'bayesian' | 'sequential' | 'fixed_horizon';

// Metric Type
type MetricType = 'conversion' | 'revenue' | 'engagement' | 'retention' | 'custom' | 'count' | 'duration';

// Goal Type
type GoalType = 'primary' | 'secondary' | 'guardrail';

// Experiment
interface Experiment {
  id: string;
  key: string;
  name: string;
  description: string;
  hypothesis: ExperimentHypothesis;
  type: ExperimentType;
  project: string;
  environment: string;
  status: ExperimentStatus;
  variations: Variation[];
  traffic: TrafficConfiguration;
  targeting: ExperimentTargeting;
  metrics: ExperimentMetricConfig[];
  goals: ExperimentGoal[];
  scheduling: ExperimentSchedule;
  results: ExperimentResultsData;
  analysis: StatisticalAnalysis;
  integrations: ExperimentIntegration[];
  collaboration: ExperimentCollaboration;
  audit: ExperimentAuditLog;
  metadata: ExperimentMetadata;
}

// Experiment Hypothesis
interface ExperimentHypothesis {
  statement: string;
  expectedOutcome: string;
  minimumDetectableEffect: number;
  confidence: number;
  testType: 'one_tailed' | 'two_tailed';
  direction?: 'increase' | 'decrease';
  rationale?: string;
}

// Variation
interface Variation {
  id: string;
  key: string;
  name: string;
  description?: string;
  weight: number;
  isControl: boolean;
  changes: VariationChange[];
  screenshots?: string[];
  codeChanges?: CodeChange[];
  metadata: VariationMetadata;
}

// Variation Change
interface VariationChange {
  id: string;
  type: 'element' | 'redirect' | 'code' | 'feature_flag' | 'personalization';
  selector?: string;
  attribute?: string;
  originalValue?: unknown;
  newValue: unknown;
  action: 'modify' | 'insert' | 'remove' | 'replace' | 'redirect';
}

// Code Change
interface CodeChange {
  id: string;
  type: 'javascript' | 'css' | 'html';
  code: string;
  location: 'head' | 'body_start' | 'body_end' | 'custom';
  customSelector?: string;
}

// Variation Metadata
interface VariationMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  tags: string[];
}

// Traffic Configuration
interface TrafficConfiguration {
  allocation: number;
  method: TrafficAllocationMethod;
  bucketing: BucketingConfiguration;
  holdout: HoldoutConfiguration;
  exclusion: ExclusionConfiguration;
  queueing: QueueingConfiguration;
}

// Bucketing Configuration
interface BucketingConfiguration {
  bucketBy: string;
  seed?: number;
  hash: 'murmur3' | 'md5' | 'sha256';
  sticky: boolean;
  fallbackBehavior: 'control' | 'off' | 'random';
}

// Holdout Configuration
interface HoldoutConfiguration {
  enabled: boolean;
  percentage: number;
  behavior: 'control' | 'off';
  includeInAnalysis: boolean;
}

// Exclusion Configuration
interface ExclusionConfiguration {
  mutuallyExclusive: string[];
  excludeFromGlobal: boolean;
  excludeQATraffic: boolean;
  excludeBots: boolean;
}

// Queueing Configuration
interface QueueingConfiguration {
  enabled: boolean;
  maxWait: number;
  behavior: 'block' | 'fallback' | 'timeout';
}

// Experiment Targeting
interface ExperimentTargeting {
  enabled: boolean;
  audiences: TargetingAudience[];
  segments: string[];
  rules: TargetingRule[];
  geo: GeoTargeting;
  device: DeviceTargeting;
  behavior: BehaviorTargeting;
  scheduling: ScheduleTargeting;
}

// Targeting Audience
interface TargetingAudience {
  id: string;
  name: string;
  conditions: AudienceCondition[];
  match: 'all' | 'any';
}

// Audience Condition
interface AudienceCondition {
  attribute: string;
  operator: string;
  value: unknown;
  values?: unknown[];
}

// Targeting Rule
interface TargetingRule {
  id: string;
  name: string;
  priority: number;
  conditions: AudienceCondition[];
  traffic: number;
  variation?: string;
  enabled: boolean;
}

// Geo Targeting
interface GeoTargeting {
  enabled: boolean;
  countries: string[];
  regions: string[];
  cities: string[];
  exclude: boolean;
}

// Device Targeting
interface DeviceTargeting {
  enabled: boolean;
  deviceTypes: ('desktop' | 'mobile' | 'tablet')[];
  browsers: string[];
  operatingSystems: string[];
  screenSizes: ScreenSizeRange[];
}

// Screen Size Range
interface ScreenSizeRange {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

// Behavior Targeting
interface BehaviorTargeting {
  enabled: boolean;
  newVisitors: boolean;
  returningVisitors: boolean;
  sessionCount?: { min?: number; max?: number };
  pageViews?: { min?: number; max?: number };
  timeOnSite?: { min?: number; max?: number };
}

// Schedule Targeting
interface ScheduleTargeting {
  enabled: boolean;
  daysOfWeek: number[];
  hoursOfDay: number[];
  timezone: string;
}

// Experiment Metric Config
interface ExperimentMetricConfig {
  id: string;
  metricId: string;
  name: string;
  type: MetricType;
  goalType: GoalType;
  eventName: string;
  aggregation: 'sum' | 'count' | 'average' | 'unique' | 'rate';
  attribution: AttributionModel;
  filter?: MetricFilter;
  transformation?: MetricTransformation;
  minimumSampleSize: number;
  minimumDetectableEffect: number;
}

// Attribution Model
interface AttributionModel {
  model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
  window: number;
  windowUnit: 'minutes' | 'hours' | 'days';
}

// Metric Filter
interface MetricFilter {
  conditions: AudienceCondition[];
  match: 'all' | 'any';
}

// Metric Transformation
interface MetricTransformation {
  type: 'log' | 'winsorize' | 'cap' | 'normalize';
  params: Record<string, unknown>;
}

// Experiment Goal
interface ExperimentGoal {
  id: string;
  name: string;
  description?: string;
  type: GoalType;
  metric: string;
  direction: 'increase' | 'decrease';
  baseline?: number;
  target: number;
  minimumImprovement: number;
  successCriteria: GoalSuccessCriteria;
}

// Goal Success Criteria
interface GoalSuccessCriteria {
  minConfidence: number;
  minEffect: number;
  minSampleSize: number;
  maxPValue: number;
}

// Experiment Schedule
interface ExperimentSchedule {
  startDate?: Date;
  endDate?: Date;
  autoStart: boolean;
  autoStop: boolean;
  duration?: ExperimentDuration;
  rampUp?: RampUpSchedule;
  notifications: ScheduleNotification[];
}

// Experiment Duration
interface ExperimentDuration {
  value: number;
  unit: 'hours' | 'days' | 'weeks';
  extendOnInconclusive: boolean;
  maxExtensions: number;
}

// Ramp Up Schedule
interface RampUpSchedule {
  enabled: boolean;
  stages: RampUpStage[];
}

// Ramp Up Stage
interface RampUpStage {
  traffic: number;
  duration: number;
  durationUnit: 'hours' | 'days';
  criteria?: StageCriteria;
}

// Stage Criteria
interface StageCriteria {
  minSampleSize: number;
  maxErrorRate: number;
  metrics: MetricCriteria[];
}

// Metric Criteria
interface MetricCriteria {
  metricId: string;
  condition: 'above' | 'below' | 'within';
  threshold: number;
  tolerance?: number;
}

// Schedule Notification
interface ScheduleNotification {
  type: 'start' | 'end' | 'milestone' | 'warning';
  channels: string[];
  timing?: number;
  timingUnit?: 'hours' | 'days';
}

// Experiment Results Data
interface ExperimentResultsData {
  startedAt?: Date;
  completedAt?: Date;
  lastUpdated: Date;
  totalVisitors: number;
  totalConversions: number;
  overallConversionRate: number;
  variationResults: VariationResultData[];
  winner?: WinnerDeclaration;
  timeline: ResultTimeline[];
  segmentResults: SegmentResultData[];
}

// Variation Result Data
interface VariationResultData {
  variationId: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  conversionRateCI: ConfidenceInterval;
  improvement: number;
  improvementCI: ConfidenceInterval;
  pValue: number;
  significance: number;
  confidence: number;
  power: number;
  sampleSize: number;
  expectedLoss: number;
  chanceToBeatControl: number;
  isWinner: boolean;
  metrics: MetricResultData[];
}

// Confidence Interval
interface ConfidenceInterval {
  lower: number;
  upper: number;
  confidence: number;
}

// Metric Result Data
interface MetricResultData {
  metricId: string;
  name: string;
  value: number;
  valueCI: ConfidenceInterval;
  improvement: number;
  improvementCI: ConfidenceInterval;
  pValue: number;
  significance: number;
  isSignificant: boolean;
}

// Winner Declaration
interface WinnerDeclaration {
  variationId: string;
  declaredAt: Date;
  declaredBy: 'system' | 'user';
  confidence: number;
  reason: string;
  implementation: WinnerImplementation;
}

// Winner Implementation
interface WinnerImplementation {
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  implementedAt?: Date;
  implementedBy?: string;
  notes?: string;
}

// Result Timeline
interface ResultTimeline {
  timestamp: Date;
  variationId: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  cumulativeVisitors: number;
  cumulativeConversions: number;
}

// Segment Result Data
interface SegmentResultData {
  segmentId: string;
  segmentName: string;
  variationResults: VariationResultData[];
}

// Statistical Analysis
interface StatisticalAnalysis {
  method: StatisticalMethod;
  config: AnalysisConfiguration;
  power: PowerAnalysis;
  sampleSize: SampleSizeCalculation;
  sequentialAnalysis?: SequentialAnalysis;
  bayesianAnalysis?: BayesianAnalysis;
  diagnostics: AnalysisDiagnostics;
}

// Analysis Configuration
interface AnalysisConfiguration {
  alpha: number;
  beta: number;
  minSampleSize: number;
  maxSampleSize?: number;
  correctionMethod: 'bonferroni' | 'holm' | 'benjamini_hochberg' | 'none';
  twoSided: boolean;
}

// Power Analysis
interface PowerAnalysis {
  requiredSampleSize: number;
  achievedPower: number;
  effectSize: number;
  detectedEffectSize?: number;
}

// Sample Size Calculation
interface SampleSizeCalculation {
  method: 'z_test' | 't_test' | 'chi_square';
  baselineRate: number;
  minimumEffect: number;
  confidence: number;
  power: number;
  estimatedDuration: number;
  durationUnit: 'days' | 'weeks';
}

// Sequential Analysis
interface SequentialAnalysis {
  enabled: boolean;
  method: 'obrien_fleming' | 'pocock' | 'haybittle_peto' | 'lan_demets';
  looks: number;
  currentLook: number;
  boundaries: BoundaryConfig[];
  spendingFunction: 'obrien_fleming' | 'pocock' | 'kim_demets';
  alphaSpent: number;
}

// Boundary Config
interface BoundaryConfig {
  look: number;
  lowerBoundary: number;
  upperBoundary: number;
  alphaSpent: number;
  futilityBoundary?: number;
}

// Bayesian Analysis
interface BayesianAnalysis {
  enabled: boolean;
  prior: PriorDistribution;
  posterior: PosteriorDistribution[];
  credibleInterval: number;
  ropeMin?: number;
  ropeMax?: number;
  hdpi: ConfidenceInterval;
}

// Prior Distribution
interface PriorDistribution {
  type: 'beta' | 'normal' | 'uniform' | 'jeffreys';
  alpha?: number;
  beta?: number;
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
}

// Posterior Distribution
interface PosteriorDistribution {
  variationId: string;
  mean: number;
  std: number;
  credibleInterval: ConfidenceInterval;
  probabilityToBeatControl: number;
  expectedLoss: number;
}

// Analysis Diagnostics
interface AnalysisDiagnostics {
  srmCheck: SRMCheck;
  noveltyEffect: NoveltyEffect;
  priorSensitivity?: PriorSensitivity;
  convergence?: ConvergenceDiagnostic;
  warnings: AnalysisWarning[];
}

// SRM Check (Sample Ratio Mismatch)
interface SRMCheck {
  expected: Record<string, number>;
  observed: Record<string, number>;
  chiSquare: number;
  pValue: number;
  hasSRM: boolean;
  severity: 'none' | 'low' | 'medium' | 'high';
}

// Novelty Effect
interface NoveltyEffect {
  detected: boolean;
  magnitude?: number;
  stabilizationDay?: number;
  recommendation?: string;
}

// Prior Sensitivity
interface PriorSensitivity {
  priors: PriorDistribution[];
  posteriors: PosteriorDistribution[][];
  sensitivity: number;
}

// Convergence Diagnostic
interface ConvergenceDiagnostic {
  converged: boolean;
  iterations: number;
  rHat?: number;
  effectiveSampleSize?: number;
}

// Analysis Warning
interface AnalysisWarning {
  type: 'low_sample' | 'srm' | 'novelty' | 'peeking' | 'multiple_testing' | 'convergence';
  severity: 'info' | 'warning' | 'error';
  message: string;
  recommendation?: string;
}

// Experiment Integration
interface ExperimentIntegration {
  id: string;
  type: 'analytics' | 'cdp' | 'data_warehouse' | 'notification' | 'custom';
  provider: string;
  config: IntegrationConfig;
  events: string[];
  enabled: boolean;
}

// Integration Config
interface IntegrationConfig {
  apiKey?: string;
  endpoint?: string;
  credentials?: Record<string, string>;
  settings: Record<string, unknown>;
}

// Experiment Collaboration
interface ExperimentCollaboration {
  owner: string;
  team: string;
  stakeholders: Stakeholder[];
  comments: ExperimentComment[];
  reviews: ExperimentReview[];
  decisions: ExperimentDecision[];
}

// Stakeholder
interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'reviewer' | 'observer' | 'implementer';
  notifications: string[];
}

// Experiment Comment
interface ExperimentComment {
  id: string;
  author: string;
  timestamp: Date;
  content: string;
  type: 'comment' | 'question' | 'concern' | 'suggestion';
  resolved: boolean;
  replies: ExperimentComment[];
}

// Experiment Review
interface ExperimentReview {
  id: string;
  reviewer: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  feedback?: string;
  checklist: ReviewChecklist;
}

// Review Checklist
interface ReviewChecklist {
  hypothesisClear: boolean;
  sampleSizeAdequate: boolean;
  metricsAppropriate: boolean;
  targetingCorrect: boolean;
  durationSufficient: boolean;
  noConflicts: boolean;
  notes?: string;
}

// Experiment Decision
interface ExperimentDecision {
  id: string;
  type: 'start' | 'pause' | 'stop' | 'declare_winner' | 'extend' | 'archive';
  madeBy: string;
  timestamp: Date;
  reason: string;
  previousState?: ExperimentStatus;
  newState: ExperimentStatus;
}

// Experiment Audit Log
interface ExperimentAuditLog {
  enabled: boolean;
  events: AuditLogEvent[];
  retentionDays: number;
}

// Audit Log Event
interface AuditLogEvent {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  actorType: 'user' | 'system' | 'api';
  details: Record<string, unknown>;
  previousValue?: unknown;
  newValue?: unknown;
}

// Experiment Metadata
interface ExperimentMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
  tags: string[];
  labels: Record<string, string>;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  jiraTicket?: string;
  documentationUrl?: string;
}

// Metric Definition
interface MetricDefinition {
  id: string;
  key: string;
  name: string;
  description: string;
  type: MetricType;
  eventName: string;
  aggregation: 'sum' | 'count' | 'average' | 'unique' | 'rate';
  unit?: string;
  valueProperty?: string;
  filter?: MetricFilter;
  baseline?: MetricBaseline;
  owner: string;
  tags: string[];
  metadata: MetricMetadata;
}

// Metric Baseline
interface MetricBaseline {
  value: number;
  variance: number;
  source: 'historical' | 'calculated' | 'manual';
  period?: string;
  lastUpdated: Date;
}

// Metric Metadata
interface MetricMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
}

// A/B Testing Statistics
interface ABTestingStatistics {
  overview: {
    totalExperiments: number;
    activeExperiments: number;
    completedExperiments: number;
    avgDurationDays: number;
    avgSampleSize: number;
    winRate: number;
  };
  byType: Record<ExperimentType, number>;
  byStatus: Record<ExperimentStatus, number>;
  byProject: Record<string, number>;
  performance: {
    avgConversionLift: number;
    avgConfidence: number;
    inconclusiveRate: number;
    srmRate: number;
  };
  trends: {
    experimentsPerMonth: Record<string, number>;
    winRateByMonth: Record<string, number>;
    avgLiftByMonth: Record<string, number>;
  };
  topMetrics: {
    metricId: string;
    metricName: string;
    experiments: number;
    avgLift: number;
  }[];
}

class ABTestingService {
  private static instance: ABTestingService;
  private experiments: Map<string, Experiment> = new Map();
  private metrics: Map<string, MetricDefinition> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ABTestingService {
    if (!ABTestingService.instance) {
      ABTestingService.instance = new ABTestingService();
    }
    return ABTestingService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Metrics
    const metricsData = [
      { key: 'conversion_rate', name: 'Conversion Rate', type: 'conversion' as MetricType, event: 'purchase' },
      { key: 'revenue_per_visitor', name: 'Revenue Per Visitor', type: 'revenue' as MetricType, event: 'purchase' },
      { key: 'engagement_score', name: 'Engagement Score', type: 'engagement' as MetricType, event: 'engagement' },
      { key: 'bounce_rate', name: 'Bounce Rate', type: 'conversion' as MetricType, event: 'bounce' },
      { key: 'avg_session_duration', name: 'Average Session Duration', type: 'duration' as MetricType, event: 'session' },
      { key: 'click_through_rate', name: 'Click Through Rate', type: 'conversion' as MetricType, event: 'click' },
    ];

    metricsData.forEach((m, idx) => {
      const metric: MetricDefinition = {
        id: `metric-${(idx + 1).toString().padStart(4, '0')}`,
        key: m.key,
        name: m.name,
        description: `${m.name} metric`,
        type: m.type,
        eventName: m.event,
        aggregation: m.type === 'revenue' ? 'sum' : 'rate',
        baseline: { value: m.type === 'conversion' ? 3.5 : 25, variance: 0.5, source: 'historical', lastUpdated: new Date() },
        owner: 'analytics-team',
        tags: [m.type],
        metadata: { createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date(), version: 1 },
      };
      this.metrics.set(metric.id, metric);
    });

    // Initialize Experiments
    const experimentsData = [
      { key: 'homepage-hero', name: 'Homepage Hero Test', type: 'ab_test' as ExperimentType, status: 'running' as ExperimentStatus },
      { key: 'checkout-redesign', name: 'Checkout Redesign', type: 'ab_test' as ExperimentType, status: 'completed' as ExperimentStatus },
      { key: 'pricing-page', name: 'Pricing Page MVT', type: 'multivariate' as ExperimentType, status: 'running' as ExperimentStatus },
      { key: 'nav-layout', name: 'Navigation Layout', type: 'ab_test' as ExperimentType, status: 'paused' as ExperimentStatus },
      { key: 'cta-button', name: 'CTA Button Color', type: 'ab_test' as ExperimentType, status: 'draft' as ExperimentStatus },
      { key: 'product-recs', name: 'Product Recommendations', type: 'bandit' as ExperimentType, status: 'running' as ExperimentStatus },
    ];

    experimentsData.forEach((exp, idx) => {
      const expId = `exp-${(idx + 1).toString().padStart(4, '0')}`;
      const isCompleted = exp.status === 'completed';
      const isRunning = exp.status === 'running';

      const variations: Variation[] = [
        {
          id: 'var-control',
          key: 'control',
          name: 'Control',
          weight: 50,
          isControl: true,
          changes: [],
          metadata: { createdAt: new Date(), createdBy: 'admin', updatedAt: new Date(), tags: ['control'] },
        },
        {
          id: 'var-treatment',
          key: 'treatment',
          name: 'Treatment A',
          weight: 50,
          isControl: false,
          changes: [{ id: 'change-1', type: 'element', selector: '.hero-title', attribute: 'text', newValue: 'New Hero Text', action: 'modify' }],
          metadata: { createdAt: new Date(), createdBy: 'admin', updatedAt: new Date(), tags: ['treatment'] },
        },
      ];

      if (exp.type === 'multivariate') {
        variations.push({
          id: 'var-treatment-b',
          key: 'treatment-b',
          name: 'Treatment B',
          weight: 33,
          isControl: false,
          changes: [{ id: 'change-2', type: 'element', selector: '.hero-image', newValue: '/images/new-hero.png', action: 'modify' }],
          metadata: { createdAt: new Date(), createdBy: 'admin', updatedAt: new Date(), tags: ['treatment'] },
        });
        variations[0].weight = 34;
        variations[1].weight = 33;
      }

      const experiment: Experiment = {
        id: expId,
        key: exp.key,
        name: exp.name,
        description: `${exp.name} experiment`,
        hypothesis: {
          statement: `Changing the ${exp.key} will increase conversions by at least 5%`,
          expectedOutcome: '5% increase in conversion rate',
          minimumDetectableEffect: 5,
          confidence: 95,
          testType: 'two_tailed',
        },
        type: exp.type,
        project: 'proj-0001',
        environment: 'production',
        status: exp.status,
        variations,
        traffic: {
          allocation: isRunning || isCompleted ? 100 : 0,
          method: exp.type === 'bandit' ? 'adaptive' : 'random',
          bucketing: { bucketBy: 'userId', hash: 'murmur3', sticky: true, fallbackBehavior: 'control' },
          holdout: { enabled: true, percentage: 5, behavior: 'control', includeInAnalysis: false },
          exclusion: { mutuallyExclusive: [], excludeFromGlobal: false, excludeQATraffic: true, excludeBots: true },
          queueing: { enabled: false, maxWait: 0, behavior: 'fallback' },
        },
        targeting: {
          enabled: true,
          audiences: [],
          segments: [],
          rules: [],
          geo: { enabled: false, countries: [], regions: [], cities: [], exclude: false },
          device: { enabled: false, deviceTypes: ['desktop', 'mobile', 'tablet'], browsers: [], operatingSystems: [], screenSizes: [] },
          behavior: { enabled: false, newVisitors: true, returningVisitors: true },
          scheduling: { enabled: false, daysOfWeek: [], hoursOfDay: [], timezone: 'UTC' },
        },
        metrics: [
          { id: 'mc-1', metricId: 'metric-0001', name: 'Conversion Rate', type: 'conversion', goalType: 'primary', eventName: 'purchase', aggregation: 'rate', attribution: { model: 'last_touch', window: 7, windowUnit: 'days' }, minimumSampleSize: 1000, minimumDetectableEffect: 5 },
          { id: 'mc-2', metricId: 'metric-0002', name: 'Revenue Per Visitor', type: 'revenue', goalType: 'secondary', eventName: 'purchase', aggregation: 'average', attribution: { model: 'last_touch', window: 7, windowUnit: 'days' }, minimumSampleSize: 1000, minimumDetectableEffect: 10 },
        ],
        goals: [
          { id: 'goal-1', name: 'Increase Conversions', type: 'primary', metric: 'metric-0001', direction: 'increase', target: 5, minimumImprovement: 3, successCriteria: { minConfidence: 95, minEffect: 3, minSampleSize: 1000, maxPValue: 0.05 } },
        ],
        scheduling: {
          startDate: isRunning || isCompleted ? new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) : undefined,
          endDate: isCompleted ? new Date() : undefined,
          autoStart: false,
          autoStop: true,
          duration: { value: 4, unit: 'weeks', extendOnInconclusive: true, maxExtensions: 2 },
          rampUp: { enabled: true, stages: [{ traffic: 25, duration: 2, durationUnit: 'days' }, { traffic: 50, duration: 2, durationUnit: 'days' }, { traffic: 100, duration: 0, durationUnit: 'days' }] },
          notifications: [{ type: 'start', channels: ['email', 'slack'] }, { type: 'end', channels: ['email', 'slack'] }],
        },
        results: {
          lastUpdated: new Date(),
          totalVisitors: isRunning || isCompleted ? 10000 + idx * 5000 : 0,
          totalConversions: isRunning || isCompleted ? 350 + idx * 175 : 0,
          overallConversionRate: 3.5,
          variationResults: isRunning || isCompleted ? [
            { variationId: 'var-control', visitors: 5000, conversions: 175, conversionRate: 3.5, conversionRateCI: { lower: 3.0, upper: 4.0, confidence: 95 }, improvement: 0, improvementCI: { lower: 0, upper: 0, confidence: 95 }, pValue: 1, significance: 0, confidence: 0, power: 0.8, sampleSize: 5000, expectedLoss: 0, chanceToBeatControl: 50, isWinner: false, metrics: [] },
            { variationId: 'var-treatment', visitors: 5000, conversions: isCompleted ? 210 : 195, conversionRate: isCompleted ? 4.2 : 3.9, conversionRateCI: { lower: 3.6, upper: 4.8, confidence: 95 }, improvement: isCompleted ? 20 : 11.4, improvementCI: { lower: 5, upper: 35, confidence: 95 }, pValue: isCompleted ? 0.02 : 0.08, significance: isCompleted ? 98 : 92, confidence: isCompleted ? 98 : 92, power: 0.8, sampleSize: 5000, expectedLoss: 0.1, chanceToBeatControl: isCompleted ? 98 : 92, isWinner: isCompleted, metrics: [] },
          ] : [],
          winner: isCompleted ? { variationId: 'var-treatment', declaredAt: new Date(), declaredBy: 'system', confidence: 98, reason: 'Treatment achieved statistical significance with 20% lift', implementation: { status: 'completed', implementedAt: new Date(), implementedBy: 'dev-team' } } : undefined,
          timeline: [],
          segmentResults: [],
        },
        analysis: {
          method: 'frequentist',
          config: { alpha: 0.05, beta: 0.2, minSampleSize: 1000, correctionMethod: 'bonferroni', twoSided: true },
          power: { requiredSampleSize: 3840, achievedPower: 0.8, effectSize: 0.05, detectedEffectSize: isCompleted ? 0.07 : undefined },
          sampleSize: { method: 'z_test', baselineRate: 3.5, minimumEffect: 5, confidence: 95, power: 80, estimatedDuration: 14, durationUnit: 'days' },
          diagnostics: {
            srmCheck: { expected: { 'var-control': 50, 'var-treatment': 50 }, observed: { 'var-control': 50.1, 'var-treatment': 49.9 }, chiSquare: 0.02, pValue: 0.89, hasSRM: false, severity: 'none' },
            noveltyEffect: { detected: false },
            warnings: [],
          },
        },
        integrations: [
          { id: 'int-ga', type: 'analytics', provider: 'google_analytics', config: { settings: { propertyId: 'UA-XXXXX' } }, events: ['experiment_viewed', 'conversion'], enabled: true },
        ],
        collaboration: {
          owner: 'product-manager',
          team: 'growth',
          stakeholders: [{ id: 'sh-1', name: 'Product Manager', email: 'pm@example.com', role: 'owner', notifications: ['all'] }],
          comments: [],
          reviews: [{ id: 'rev-1', reviewer: 'data-scientist', timestamp: new Date(), status: 'approved', checklist: { hypothesisClear: true, sampleSizeAdequate: true, metricsAppropriate: true, targetingCorrect: true, durationSufficient: true, noConflicts: true } }],
          decisions: [],
        },
        audit: { enabled: true, events: [], retentionDays: 90 },
        metadata: {
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          updatedBy: 'admin',
          version: 3,
          tags: [exp.type, exp.status],
          labels: { team: 'growth' },
          priority: 'high',
        },
      };
      this.experiments.set(expId, experiment);
    });
  }

  // Experiment Operations
  public getExperiments(status?: ExperimentStatus, type?: ExperimentType): Experiment[] {
    let experiments = Array.from(this.experiments.values());
    if (status) experiments = experiments.filter((e) => e.status === status);
    if (type) experiments = experiments.filter((e) => e.type === type);
    return experiments;
  }

  public getExperimentById(id: string): Experiment | undefined {
    return this.experiments.get(id);
  }

  public getExperimentByKey(key: string): Experiment | undefined {
    return Array.from(this.experiments.values()).find((e) => e.key === key);
  }

  // Metric Operations
  public getMetrics(): MetricDefinition[] {
    return Array.from(this.metrics.values());
  }

  public getMetricById(id: string): MetricDefinition | undefined {
    return this.metrics.get(id);
  }

  // Statistics
  public getStatistics(): ABTestingStatistics {
    const experiments = Array.from(this.experiments.values());

    const byType: Record<ExperimentType, number> = { ab_test: 0, multivariate: 0, split_url: 0, multi_page: 0, personalization: 0, bandit: 0 };
    const byStatus: Record<ExperimentStatus, number> = { draft: 0, scheduled: 0, running: 0, paused: 0, completed: 0, archived: 0, stopped: 0 };
    const byProject: Record<string, number> = {};

    experiments.forEach((e) => {
      byType[e.type]++;
      byStatus[e.status]++;
      byProject[e.project] = (byProject[e.project] || 0) + 1;
    });

    const completed = experiments.filter((e) => e.status === 'completed');
    const winners = completed.filter((e) => e.results.winner);

    return {
      overview: {
        totalExperiments: experiments.length,
        activeExperiments: byStatus.running,
        completedExperiments: byStatus.completed,
        avgDurationDays: 14,
        avgSampleSize: 10000,
        winRate: completed.length > 0 ? (winners.length / completed.length) * 100 : 0,
      },
      byType,
      byStatus,
      byProject,
      performance: {
        avgConversionLift: 15,
        avgConfidence: 95,
        inconclusiveRate: 20,
        srmRate: 5,
      },
      trends: {
        experimentsPerMonth: { 'Jan': 5, 'Feb': 7, 'Mar': 8 },
        winRateByMonth: { 'Jan': 60, 'Feb': 71, 'Mar': 75 },
        avgLiftByMonth: { 'Jan': 10, 'Feb': 12, 'Mar': 15 },
      },
      topMetrics: [
        { metricId: 'metric-0001', metricName: 'Conversion Rate', experiments: 6, avgLift: 15 },
        { metricId: 'metric-0002', metricName: 'Revenue Per Visitor', experiments: 4, avgLift: 12 },
      ],
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

export const abTestingService = ABTestingService.getInstance();
export type {
  ExperimentType,
  ExperimentStatus,
  TrafficAllocationMethod,
  StatisticalMethod,
  MetricType,
  GoalType,
  Experiment,
  ExperimentHypothesis,
  Variation,
  VariationChange,
  CodeChange,
  VariationMetadata,
  TrafficConfiguration,
  BucketingConfiguration,
  HoldoutConfiguration,
  ExclusionConfiguration,
  QueueingConfiguration,
  ExperimentTargeting,
  TargetingAudience,
  AudienceCondition,
  TargetingRule,
  GeoTargeting,
  DeviceTargeting,
  ScreenSizeRange,
  BehaviorTargeting,
  ScheduleTargeting,
  ExperimentMetricConfig,
  AttributionModel,
  MetricFilter,
  MetricTransformation,
  ExperimentGoal,
  GoalSuccessCriteria,
  ExperimentSchedule,
  ExperimentDuration,
  RampUpSchedule,
  RampUpStage,
  StageCriteria,
  MetricCriteria,
  ScheduleNotification,
  ExperimentResultsData,
  VariationResultData,
  ConfidenceInterval,
  MetricResultData,
  WinnerDeclaration,
  WinnerImplementation,
  ResultTimeline,
  SegmentResultData,
  StatisticalAnalysis,
  AnalysisConfiguration,
  PowerAnalysis,
  SampleSizeCalculation,
  SequentialAnalysis,
  BoundaryConfig,
  BayesianAnalysis,
  PriorDistribution,
  PosteriorDistribution,
  AnalysisDiagnostics,
  SRMCheck,
  NoveltyEffect,
  PriorSensitivity,
  ConvergenceDiagnostic,
  AnalysisWarning,
  ExperimentIntegration,
  IntegrationConfig,
  ExperimentCollaboration,
  Stakeholder,
  ExperimentComment,
  ExperimentReview,
  ReviewChecklist,
  ExperimentDecision,
  ExperimentAuditLog,
  AuditLogEvent,
  ExperimentMetadata,
  MetricDefinition,
  MetricBaseline,
  MetricMetadata,
  ABTestingStatistics,
};

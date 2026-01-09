/**
 * User Experience Analytics Service - Issue #180 Implementation
 * 
 * Provides comprehensive user experience tracking and analytics for
 * disaster response applications including interaction tracking, journey
 * analysis, performance monitoring, and UX optimization insights.
 */

// Type definitions
type InteractionType = 'click' | 'scroll' | 'hover' | 'focus' | 'input' | 'submit' | 'navigation' | 'gesture' | 'voice';
type SessionStatus = 'active' | 'idle' | 'ended' | 'abandoned';
type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'other';
type EngagementLevel = 'low' | 'medium' | 'high' | 'very_high';
type SatisfactionRating = 1 | 2 | 3 | 4 | 5;

// Session tracking interfaces
interface UserSession {
  id: string;
  userId?: string;
  anonymousId: string;
  status: SessionStatus;
  startTime: Date;
  endTime?: Date;
  duration: number;
  device: DeviceInfo;
  location?: LocationInfo;
  referrer?: ReferrerInfo;
  pages: PageVisit[];
  interactions: UserInteraction[];
  events: UXEvent[];
  performance: SessionPerformance;
  engagement: EngagementMetrics;
  feedback?: SessionFeedback;
  flags: SessionFlags;
  metadata: SessionMetadata;
}

interface DeviceInfo {
  type: DeviceType;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  screenResolution: { width: number; height: number };
  viewportSize: { width: number; height: number };
  devicePixelRatio: number;
  touchEnabled: boolean;
  language: string;
  timezone: string;
  connectionType?: string;
}

interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

interface ReferrerInfo {
  url?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

interface PageVisit {
  id: string;
  url: string;
  path: string;
  title: string;
  timestamp: Date;
  duration: number;
  scrollDepth: number;
  exitPage: boolean;
  interactions: number;
  performance: PagePerformance;
}

interface PagePerformance {
  loadTime: number;
  domInteractive: number;
  domComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface UserInteraction {
  id: string;
  type: InteractionType;
  timestamp: Date;
  target: InteractionTarget;
  data?: InteractionData;
  duration?: number;
  success?: boolean;
  errorMessage?: string;
}

interface InteractionTarget {
  elementId?: string;
  elementClass?: string;
  elementTag: string;
  elementText?: string;
  selector: string;
  page: string;
  component?: string;
}

interface InteractionData {
  value?: string | number;
  scrollPosition?: number;
  coordinates?: { x: number; y: number };
  keyPressed?: string;
  gestureType?: string;
  formFields?: string[];
}

interface UXEvent {
  id: string;
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: Date;
  properties: Record<string, unknown>;
  nonInteractive: boolean;
}

interface SessionPerformance {
  averagePageLoadTime: number;
  averageTimeToInteractive: number;
  errorCount: number;
  crashCount: number;
  networkRequests: number;
  failedRequests: number;
  cacheHitRate: number;
}

interface EngagementMetrics {
  level: EngagementLevel;
  score: number;
  pageViews: number;
  uniquePages: number;
  totalInteractions: number;
  averageTimePerPage: number;
  bounceRate: number;
  returnVisitor: boolean;
  sessionsCount: number;
}

interface SessionFeedback {
  rating?: SatisfactionRating;
  npsScore?: number;
  cesScore?: number;
  comments?: string;
  issues?: string[];
  suggestions?: string[];
  collectedAt: Date;
}

interface SessionFlags {
  isBot: boolean;
  isNewUser: boolean;
  hasErrors: boolean;
  hasFrustration: boolean;
  completedGoal: boolean;
  usedSearch: boolean;
  usedHelp: boolean;
  abandoned: boolean;
}

interface SessionMetadata {
  appVersion: string;
  experimentGroups?: string[];
  featureFlags?: string[];
  customDimensions?: Record<string, string>;
}

// User journey interfaces
interface UserJourney {
  id: string;
  name: string;
  description: string;
  steps: JourneyStep[];
  startCondition: JourneyCondition;
  endCondition: JourneyCondition;
  successCriteria: JourneyCondition[];
  analytics: JourneyAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

interface JourneyStep {
  id: string;
  order: number;
  name: string;
  description: string;
  page?: string;
  action?: string;
  expectedDuration: number;
  optional: boolean;
  branchConditions?: JourneyCondition[];
}

interface JourneyCondition {
  type: 'page_visit' | 'event' | 'interaction' | 'time' | 'custom';
  value: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'matches';
  threshold?: number;
}

interface JourneyAnalytics {
  totalStarts: number;
  totalCompletions: number;
  completionRate: number;
  averageDuration: number;
  dropOffPoints: { step: string; rate: number }[];
  bottlenecks: { step: string; averageTime: number }[];
}

// User journey instance
interface JourneyInstance {
  id: string;
  journeyId: string;
  sessionId: string;
  userId?: string;
  status: 'in_progress' | 'completed' | 'abandoned' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  stepsCompleted: string[];
  currentStep?: string;
  dropOffStep?: string;
  metadata?: Record<string, unknown>;
}

// Heatmap interfaces
interface HeatmapData {
  id: string;
  pageUrl: string;
  type: 'click' | 'scroll' | 'move' | 'attention';
  resolution: { width: number; height: number };
  dataPoints: HeatmapPoint[];
  sessions: number;
  dateRange: { start: Date; end: Date };
  generatedAt: Date;
}

interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
  element?: string;
}

// Frustration detection interfaces
interface FrustrationEvent {
  id: string;
  sessionId: string;
  userId?: string;
  type: 'rage_click' | 'dead_click' | 'error_click' | 'form_abandonment' | 'thrashing' | 'back_navigation' | 'slow_response';
  timestamp: Date;
  page: string;
  element?: string;
  details: FrustrationDetails;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

interface FrustrationDetails {
  clickCount?: number;
  duration?: number;
  errorMessage?: string;
  formFields?: string[];
  navigationPattern?: string[];
  responseTime?: number;
}

// A/B testing interfaces
interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ExperimentVariant[];
  targetAudience: AudienceSegment;
  metrics: ExperimentMetric[];
  results: ExperimentResults;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  allocation: number;
  changes: VariantChange[];
  isControl: boolean;
}

interface VariantChange {
  type: 'feature_flag' | 'ui_change' | 'content' | 'flow';
  target: string;
  value: unknown;
}

interface AudienceSegment {
  id: string;
  name: string;
  conditions: SegmentCondition[];
  estimatedSize?: number;
}

interface SegmentCondition {
  attribute: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'greater_than' | 'less_than';
  value: unknown;
  logicalOperator?: 'AND' | 'OR';
}

interface ExperimentMetric {
  name: string;
  type: 'conversion' | 'engagement' | 'performance' | 'custom';
  event: string;
  isPrimary: boolean;
}

interface ExperimentResults {
  totalParticipants: number;
  variantResults: VariantResult[];
  statisticalSignificance: number;
  winner?: string;
  confidence: number;
}

interface VariantResult {
  variantId: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  improvement?: number;
  metrics: { name: string; value: number }[];
}

// Survey interfaces
interface UXSurvey {
  id: string;
  name: string;
  type: 'nps' | 'ces' | 'csat' | 'custom';
  status: 'draft' | 'active' | 'paused' | 'completed';
  questions: SurveyQuestion[];
  trigger: SurveyTrigger;
  targeting: AudienceSegment;
  responses: SurveyResponse[];
  analytics: SurveyAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

interface SurveyQuestion {
  id: string;
  order: number;
  type: 'rating' | 'text' | 'multiple_choice' | 'checkbox' | 'scale';
  text: string;
  required: boolean;
  options?: string[];
  scaleRange?: { min: number; max: number; labels?: { low: string; high: string } };
}

interface SurveyTrigger {
  type: 'page_visit' | 'time_on_page' | 'exit_intent' | 'scroll_depth' | 'interaction' | 'custom';
  value: string | number;
  delay?: number;
  frequency: 'once' | 'session' | 'always';
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  sessionId: string;
  userId?: string;
  answers: { questionId: string; value: unknown }[];
  completionTime: number;
  submittedAt: Date;
}

interface SurveyAnalytics {
  totalResponses: number;
  completionRate: number;
  averageScore?: number;
  npsScore?: number;
  distribution?: { value: number; count: number }[];
  sentimentAnalysis?: { positive: number; neutral: number; negative: number };
}

// Sample data
const sampleSessions: Partial<UserSession>[] = [
  {
    id: 'session-001',
    anonymousId: 'anon-12345',
    status: 'ended',
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(),
    duration: 3600000,
    device: {
      type: 'desktop',
      os: 'macOS',
      osVersion: '14.0',
      browser: 'Chrome',
      browserVersion: '120.0',
      screenResolution: { width: 2560, height: 1440 },
      viewportSize: { width: 1920, height: 1080 },
      devicePixelRatio: 2,
      touchEnabled: false,
      language: 'en-US',
      timezone: 'America/New_York'
    },
    pages: [],
    interactions: [],
    events: [],
    performance: {
      averagePageLoadTime: 1200,
      averageTimeToInteractive: 2000,
      errorCount: 0,
      crashCount: 0,
      networkRequests: 45,
      failedRequests: 2,
      cacheHitRate: 0.75
    },
    engagement: {
      level: 'high',
      score: 78,
      pageViews: 12,
      uniquePages: 8,
      totalInteractions: 45,
      averageTimePerPage: 300000,
      bounceRate: 0,
      returnVisitor: true,
      sessionsCount: 5
    },
    flags: {
      isBot: false,
      isNewUser: false,
      hasErrors: false,
      hasFrustration: false,
      completedGoal: true,
      usedSearch: true,
      usedHelp: false,
      abandoned: false
    },
    metadata: {
      appVersion: '2.1.0'
    }
  }
];

class UserExperienceAnalyticsService {
  private static instance: UserExperienceAnalyticsService;
  private sessions: Map<string, UserSession> = new Map();
  private journeys: Map<string, UserJourney> = new Map();
  private journeyInstances: Map<string, JourneyInstance> = new Map();
  private heatmaps: Map<string, HeatmapData> = new Map();
  private frustrationEvents: Map<string, FrustrationEvent> = new Map();
  private experiments: Map<string, Experiment> = new Map();
  private surveys: Map<string, UXSurvey> = new Map();

  private activeSession?: UserSession;

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): UserExperienceAnalyticsService {
    if (!UserExperienceAnalyticsService.instance) {
      UserExperienceAnalyticsService.instance = new UserExperienceAnalyticsService();
    }
    return UserExperienceAnalyticsService.instance;
  }

  private initializeSampleData(): void {
    // Initialize with sample session data
  }

  // ==================== Session Management ====================

  async startSession(device: DeviceInfo, userId?: string): Promise<UserSession> {
    const session: UserSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      anonymousId: `anon-${Math.random().toString(36).substr(2, 15)}`,
      status: 'active',
      startTime: new Date(),
      duration: 0,
      device,
      pages: [],
      interactions: [],
      events: [],
      performance: {
        averagePageLoadTime: 0,
        averageTimeToInteractive: 0,
        errorCount: 0,
        crashCount: 0,
        networkRequests: 0,
        failedRequests: 0,
        cacheHitRate: 0
      },
      engagement: {
        level: 'low',
        score: 0,
        pageViews: 0,
        uniquePages: 0,
        totalInteractions: 0,
        averageTimePerPage: 0,
        bounceRate: 0,
        returnVisitor: false,
        sessionsCount: 1
      },
      flags: {
        isBot: false,
        isNewUser: true,
        hasErrors: false,
        hasFrustration: false,
        completedGoal: false,
        usedSearch: false,
        usedHelp: false,
        abandoned: false
      },
      metadata: {
        appVersion: '2.1.0'
      }
    };

    this.sessions.set(session.id, session);
    this.activeSession = session;
    return session;
  }

  async endSession(sessionId: string): Promise<UserSession> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    session.status = 'ended';
    session.endTime = new Date();
    session.duration = session.endTime.getTime() - session.startTime.getTime();

    this.calculateEngagement(session);

    if (this.activeSession?.id === sessionId) {
      this.activeSession = undefined;
    }

    return session;
  }

  async getSession(sessionId: string): Promise<UserSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async getSessions(params?: {
    userId?: string;
    status?: SessionStatus;
    dateRange?: { start: Date; end: Date };
  }): Promise<UserSession[]> {
    let sessions = Array.from(this.sessions.values());

    if (params?.userId) {
      sessions = sessions.filter(s => s.userId === params.userId);
    }

    if (params?.status) {
      sessions = sessions.filter(s => s.status === params.status);
    }

    if (params?.dateRange) {
      sessions = sessions.filter(s =>
        s.startTime >= params.dateRange!.start && s.startTime <= params.dateRange!.end
      );
    }

    return sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  private calculateEngagement(session: UserSession): void {
    const uniquePages = new Set(session.pages.map(p => p.path)).size;
    const avgTimePerPage = session.pages.length > 0 ?
      session.pages.reduce((sum, p) => sum + p.duration, 0) / session.pages.length : 0;

    let score = 0;
    score += Math.min(session.pages.length * 5, 30);
    score += Math.min(session.interactions.length * 2, 30);
    score += session.flags.completedGoal ? 20 : 0;
    score += Math.min(session.duration / 60000, 20);

    session.engagement = {
      level: score >= 75 ? 'very_high' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low',
      score,
      pageViews: session.pages.length,
      uniquePages,
      totalInteractions: session.interactions.length,
      averageTimePerPage: avgTimePerPage,
      bounceRate: session.pages.length === 1 ? 100 : 0,
      returnVisitor: session.engagement.returnVisitor,
      sessionsCount: session.engagement.sessionsCount
    };
  }

  // ==================== Page Tracking ====================

  async trackPageVisit(sessionId: string, page: Omit<PageVisit, 'id'>): Promise<PageVisit> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    // End previous page visit
    if (session.pages.length > 0) {
      const lastPage = session.pages[session.pages.length - 1];
      if (!lastPage.exitPage) {
        lastPage.duration = page.timestamp.getTime() - lastPage.timestamp.getTime();
      }
    }

    const pageVisit: PageVisit = {
      ...page,
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    session.pages.push(pageVisit);
    return pageVisit;
  }

  async updatePageMetrics(sessionId: string, pageId: string, updates: Partial<PageVisit>): Promise<PageVisit> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const page = session.pages.find(p => p.id === pageId);
    if (!page) throw new Error(`Page not found: ${pageId}`);

    Object.assign(page, updates);
    return page;
  }

  // ==================== Interaction Tracking ====================

  async trackInteraction(sessionId: string, interaction: Omit<UserInteraction, 'id'>): Promise<UserInteraction> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const userInteraction: UserInteraction = {
      ...interaction,
      id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    session.interactions.push(userInteraction);

    // Check for frustration patterns
    await this.detectFrustration(session, userInteraction);

    return userInteraction;
  }

  async trackEvent(sessionId: string, event: Omit<UXEvent, 'id'>): Promise<UXEvent> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    const uxEvent: UXEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    session.events.push(uxEvent);
    return uxEvent;
  }

  // ==================== Frustration Detection ====================

  private async detectFrustration(session: UserSession, interaction: UserInteraction): Promise<void> {
    // Detect rage clicks (3+ clicks in same area within 2 seconds)
    const recentClicks = session.interactions
      .filter(i => i.type === 'click' &&
        i.timestamp.getTime() > Date.now() - 2000 &&
        i.target.selector === interaction.target.selector);

    if (recentClicks.length >= 3) {
      await this.recordFrustrationEvent(session.id, session.userId, {
        type: 'rage_click',
        page: interaction.target.page,
        element: interaction.target.selector,
        details: { clickCount: recentClicks.length },
        severity: recentClicks.length >= 5 ? 'high' : 'medium'
      });
    }
  }

  async recordFrustrationEvent(
    sessionId: string,
    userId: string | undefined,
    params: Omit<FrustrationEvent, 'id' | 'sessionId' | 'userId' | 'timestamp' | 'resolved'>
  ): Promise<FrustrationEvent> {
    const event: FrustrationEvent = {
      ...params,
      id: `frust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId,
      timestamp: new Date(),
      resolved: false
    };

    this.frustrationEvents.set(event.id, event);

    // Update session flags
    const session = this.sessions.get(sessionId);
    if (session) {
      session.flags.hasFrustration = true;
    }

    return event;
  }

  async getFrustrationEvents(params?: {
    sessionId?: string;
    type?: FrustrationEvent['type'];
    severity?: FrustrationEvent['severity'];
  }): Promise<FrustrationEvent[]> {
    let events = Array.from(this.frustrationEvents.values());

    if (params?.sessionId) {
      events = events.filter(e => e.sessionId === params.sessionId);
    }

    if (params?.type) {
      events = events.filter(e => e.type === params.type);
    }

    if (params?.severity) {
      events = events.filter(e => e.severity === params.severity);
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // ==================== User Journey Management ====================

  async createJourney(params: Omit<UserJourney, 'id' | 'analytics' | 'createdAt' | 'updatedAt'>): Promise<UserJourney> {
    const journey: UserJourney = {
      ...params,
      id: `journey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      analytics: {
        totalStarts: 0,
        totalCompletions: 0,
        completionRate: 0,
        averageDuration: 0,
        dropOffPoints: [],
        bottlenecks: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.journeys.set(journey.id, journey);
    return journey;
  }

  async getJourney(journeyId: string): Promise<UserJourney | null> {
    return this.journeys.get(journeyId) || null;
  }

  async getJourneys(): Promise<UserJourney[]> {
    return Array.from(this.journeys.values());
  }

  async startJourneyInstance(journeyId: string, sessionId: string, userId?: string): Promise<JourneyInstance> {
    const journey = this.journeys.get(journeyId);
    if (!journey) throw new Error(`Journey not found: ${journeyId}`);

    const instance: JourneyInstance = {
      id: `ji-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      journeyId,
      sessionId,
      userId,
      status: 'in_progress',
      startTime: new Date(),
      stepsCompleted: [],
      currentStep: journey.steps[0]?.id
    };

    this.journeyInstances.set(instance.id, instance);
    journey.analytics.totalStarts++;
    return instance;
  }

  async completeJourneyStep(instanceId: string, stepId: string): Promise<JourneyInstance> {
    const instance = this.journeyInstances.get(instanceId);
    if (!instance) throw new Error(`Journey instance not found: ${instanceId}`);

    const journey = this.journeys.get(instance.journeyId);
    if (!journey) throw new Error(`Journey not found: ${instance.journeyId}`);

    if (!instance.stepsCompleted.includes(stepId)) {
      instance.stepsCompleted.push(stepId);
    }

    const stepIndex = journey.steps.findIndex(s => s.id === stepId);
    if (stepIndex >= 0 && stepIndex < journey.steps.length - 1) {
      instance.currentStep = journey.steps[stepIndex + 1].id;
    } else {
      // Journey completed
      instance.status = 'completed';
      instance.endTime = new Date();
      instance.duration = instance.endTime.getTime() - instance.startTime.getTime();
      journey.analytics.totalCompletions++;
      journey.analytics.completionRate = (journey.analytics.totalCompletions / journey.analytics.totalStarts) * 100;
    }

    return instance;
  }

  // ==================== Heatmap Generation ====================

  async generateHeatmap(pageUrl: string, type: HeatmapData['type'], dateRange: { start: Date; end: Date }): Promise<HeatmapData> {
    // Collect interactions for the page
    const sessions = Array.from(this.sessions.values());
    const dataPoints: HeatmapPoint[] = [];
    let sessionCount = 0;

    sessions.forEach(session => {
      if (session.startTime >= dateRange.start && session.startTime <= dateRange.end) {
        const pageInteractions = session.interactions.filter(i =>
          i.target.page === pageUrl &&
          (type === 'click' ? i.type === 'click' : type === 'scroll' ? i.type === 'scroll' : true)
        );

        if (pageInteractions.length > 0) {
          sessionCount++;
          pageInteractions.forEach(i => {
            if (i.data?.coordinates) {
              const existing = dataPoints.find(dp =>
                Math.abs(dp.x - i.data!.coordinates!.x) < 10 &&
                Math.abs(dp.y - i.data!.coordinates!.y) < 10
              );
              if (existing) {
                existing.value++;
              } else {
                dataPoints.push({
                  x: i.data.coordinates.x,
                  y: i.data.coordinates.y,
                  value: 1,
                  element: i.target.selector
                });
              }
            }
          });
        }
      }
    });

    const heatmap: HeatmapData = {
      id: `heatmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pageUrl,
      type,
      resolution: { width: 1920, height: 1080 },
      dataPoints,
      sessions: sessionCount,
      dateRange,
      generatedAt: new Date()
    };

    this.heatmaps.set(heatmap.id, heatmap);
    return heatmap;
  }

  async getHeatmap(heatmapId: string): Promise<HeatmapData | null> {
    return this.heatmaps.get(heatmapId) || null;
  }

  // ==================== A/B Testing ====================

  async createExperiment(params: Omit<Experiment, 'id' | 'status' | 'results' | 'createdAt' | 'updatedAt'>): Promise<Experiment> {
    const experiment: Experiment = {
      ...params,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      results: {
        totalParticipants: 0,
        variantResults: params.variants.map(v => ({
          variantId: v.id,
          participants: 0,
          conversions: 0,
          conversionRate: 0,
          metrics: []
        })),
        statisticalSignificance: 0,
        confidence: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.experiments.set(experiment.id, experiment);
    return experiment;
  }

  async getExperiment(experimentId: string): Promise<Experiment | null> {
    return this.experiments.get(experimentId) || null;
  }

  async getExperiments(status?: Experiment['status']): Promise<Experiment[]> {
    let experiments = Array.from(this.experiments.values());

    if (status) {
      experiments = experiments.filter(e => e.status === status);
    }

    return experiments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async assignVariant(experimentId: string, sessionId: string): Promise<ExperimentVariant> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) throw new Error(`Experiment not found: ${experimentId}`);
    if (experiment.status !== 'running') throw new Error('Experiment is not running');

    // Simple random allocation based on weights
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of experiment.variants) {
      cumulative += variant.allocation;
      if (random <= cumulative) {
        // Record participation
        const result = experiment.results.variantResults.find(r => r.variantId === variant.id);
        if (result) {
          result.participants++;
          experiment.results.totalParticipants++;
        }
        return variant;
      }
    }

    return experiment.variants[experiment.variants.length - 1];
  }

  // ==================== Surveys ====================

  async createSurvey(params: Omit<UXSurvey, 'id' | 'status' | 'responses' | 'analytics' | 'createdAt' | 'updatedAt'>): Promise<UXSurvey> {
    const survey: UXSurvey = {
      ...params,
      id: `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      responses: [],
      analytics: {
        totalResponses: 0,
        completionRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.surveys.set(survey.id, survey);
    return survey;
  }

  async getSurvey(surveyId: string): Promise<UXSurvey | null> {
    return this.surveys.get(surveyId) || null;
  }

  async submitSurveyResponse(surveyId: string, response: Omit<SurveyResponse, 'id' | 'surveyId' | 'submittedAt'>): Promise<SurveyResponse> {
    const survey = this.surveys.get(surveyId);
    if (!survey) throw new Error(`Survey not found: ${surveyId}`);

    const surveyResponse: SurveyResponse = {
      ...response,
      id: `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      surveyId,
      submittedAt: new Date()
    };

    survey.responses.push(surveyResponse);
    this.updateSurveyAnalytics(survey);
    survey.updatedAt = new Date();

    return surveyResponse;
  }

  private updateSurveyAnalytics(survey: UXSurvey): void {
    survey.analytics.totalResponses = survey.responses.length;

    // Calculate NPS if applicable
    if (survey.type === 'nps') {
      const npsQuestion = survey.questions.find(q => q.type === 'scale');
      if (npsQuestion) {
        const scores = survey.responses
          .map(r => r.answers.find(a => a.questionId === npsQuestion.id)?.value as number)
          .filter(s => typeof s === 'number');

        if (scores.length > 0) {
          const promoters = scores.filter(s => s >= 9).length;
          const detractors = scores.filter(s => s <= 6).length;
          survey.analytics.npsScore = ((promoters - detractors) / scores.length) * 100;
        }
      }
    }
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalSessions: number;
    activeSessions: number;
    averageSessionDuration: number;
    averagePageViews: number;
    averageEngagementScore: number;
    bounceRate: number;
    frustrationRate: number;
    totalFrustrationEvents: number;
    totalJourneys: number;
    averageJourneyCompletion: number;
    totalExperiments: number;
    runningExperiments: number;
    totalSurveys: number;
    averageNPS: number;
    deviceBreakdown: { type: string; count: number }[];
    topPages: { path: string; views: number }[];
    frustrationByType: { type: string; count: number }[];
  }> {
    const sessions = Array.from(this.sessions.values());
    const frustrations = Array.from(this.frustrationEvents.values());
    const journeys = Array.from(this.journeys.values());
    const experiments = Array.from(this.experiments.values());
    const surveys = Array.from(this.surveys.values());

    const endedSessions = sessions.filter(s => s.status === 'ended');
    const avgDuration = endedSessions.length > 0 ?
      endedSessions.reduce((sum, s) => sum + s.duration, 0) / endedSessions.length : 0;

    const deviceCounts: Record<string, number> = {};
    sessions.forEach(s => {
      deviceCounts[s.device.type] = (deviceCounts[s.device.type] || 0) + 1;
    });

    const pageCounts: Record<string, number> = {};
    sessions.forEach(s => {
      s.pages.forEach(p => {
        pageCounts[p.path] = (pageCounts[p.path] || 0) + 1;
      });
    });

    const frustrationCounts: Record<string, number> = {};
    frustrations.forEach(f => {
      frustrationCounts[f.type] = (frustrationCounts[f.type] || 0) + 1;
    });

    const npsSurveys = surveys.filter(s => s.type === 'nps' && s.analytics.npsScore !== undefined);
    const avgNPS = npsSurveys.length > 0 ?
      npsSurveys.reduce((sum, s) => sum + (s.analytics.npsScore || 0), 0) / npsSurveys.length : 0;

    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter(s => s.status === 'active').length,
      averageSessionDuration: avgDuration,
      averagePageViews: sessions.length > 0 ?
        sessions.reduce((sum, s) => sum + s.pages.length, 0) / sessions.length : 0,
      averageEngagementScore: endedSessions.length > 0 ?
        endedSessions.reduce((sum, s) => sum + s.engagement.score, 0) / endedSessions.length : 0,
      bounceRate: sessions.length > 0 ?
        (sessions.filter(s => s.pages.length === 1).length / sessions.length) * 100 : 0,
      frustrationRate: sessions.length > 0 ?
        (sessions.filter(s => s.flags.hasFrustration).length / sessions.length) * 100 : 0,
      totalFrustrationEvents: frustrations.length,
      totalJourneys: journeys.length,
      averageJourneyCompletion: journeys.length > 0 ?
        journeys.reduce((sum, j) => sum + j.analytics.completionRate, 0) / journeys.length : 0,
      totalExperiments: experiments.length,
      runningExperiments: experiments.filter(e => e.status === 'running').length,
      totalSurveys: surveys.length,
      averageNPS: avgNPS,
      deviceBreakdown: Object.entries(deviceCounts).map(([type, count]) => ({ type, count })),
      topPages: Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, views]) => ({ path, views })),
      frustrationByType: Object.entries(frustrationCounts).map(([type, count]) => ({ type, count }))
    };
  }
}

export const userExperienceAnalyticsService = UserExperienceAnalyticsService.getInstance();
export default UserExperienceAnalyticsService;

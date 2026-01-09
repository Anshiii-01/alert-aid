/**
 * Sentiment Analysis Service - Issue #137 Implementation
 * 
 * Provides comprehensive sentiment analysis for disaster response including
 * public opinion tracking, emergency communication effectiveness measurement,
 * community concern identification, and emotional trend monitoring.
 */

// Type definitions
type SentimentPolarity = 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
type EmotionCategory = 'fear' | 'anger' | 'sadness' | 'anxiety' | 'hope' | 'relief' | 'gratitude' | 'frustration' | 'confusion' | 'trust' | 'neutral';
type ContentSource = 'social_media' | 'news' | 'survey' | 'hotline' | 'email' | 'feedback_form' | 'community_meeting' | 'interview';
type AnalysisScope = 'incident' | 'agency' | 'topic' | 'location' | 'demographic' | 'communication';

// Analysis interfaces
interface SentimentAnalysis {
  id: string;
  contentId: string;
  source: ContentSource;
  content: string;
  incidentId?: string;
  locationId?: string;
  timestamp: Date;
  sentiment: SentimentResult;
  emotions: EmotionResult[];
  topics: TopicExtraction[];
  concerns: ConcernExtraction[];
  entities: EntityMention[];
  language: string;
  confidence: number;
  metadata: Record<string, any>;
  analyzedAt: Date;
}

interface SentimentResult {
  polarity: SentimentPolarity;
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  subjectivity: number; // 0 to 1
  comparative: number;
  wordBreakdown?: { word: string; score: number; contribution: number }[];
}

interface EmotionResult {
  emotion: EmotionCategory;
  score: number;
  confidence: number;
  indicators: string[];
}

interface TopicExtraction {
  topic: string;
  relevance: number;
  sentiment: SentimentPolarity;
  sentimentScore: number;
  keywords: string[];
}

interface ConcernExtraction {
  concern: string;
  category: 'safety' | 'resources' | 'communication' | 'response' | 'recovery' | 'health' | 'economic' | 'infrastructure' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  sentiment: SentimentPolarity;
  frequency: number;
  sampleTexts: string[];
}

interface EntityMention {
  entity: string;
  type: 'organization' | 'person' | 'location' | 'event' | 'service' | 'facility';
  sentiment: SentimentPolarity;
  sentimentScore: number;
  mentionCount: number;
}

// Aggregation interfaces
interface SentimentAggregation {
  id: string;
  scope: AnalysisScope;
  scopeId: string;
  scopeName: string;
  period: { start: Date; end: Date };
  sampleSize: number;
  overallSentiment: {
    polarity: SentimentPolarity;
    averageScore: number;
    distribution: Record<SentimentPolarity, number>;
    trend: 'improving' | 'stable' | 'declining';
    trendMagnitude: number;
  };
  emotionProfile: {
    dominant: EmotionCategory;
    distribution: Record<EmotionCategory, number>;
    intensity: number;
  };
  topConcerns: ConcernSummary[];
  topTopics: TopicSummary[];
  entitySentiments: EntitySentimentSummary[];
  demographicBreakdown?: DemographicSentiment[];
  sourceBreakdown: Record<ContentSource, { count: number; avgSentiment: number }>;
  timeSeriesData: TimeSeriesPoint[];
  generatedAt: Date;
}

interface ConcernSummary {
  concern: string;
  category: ConcernExtraction['category'];
  frequency: number;
  percentageOfTotal: number;
  averageSentiment: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  urgencyLevel: ConcernExtraction['urgency'];
  recommendedAction?: string;
}

interface TopicSummary {
  topic: string;
  frequency: number;
  averageSentiment: number;
  sentimentTrend: 'improving' | 'stable' | 'declining';
  relatedConcerns: string[];
  peakTime?: Date;
}

interface EntitySentimentSummary {
  entity: string;
  type: EntityMention['type'];
  mentionCount: number;
  averageSentiment: number;
  sentimentDistribution: Record<SentimentPolarity, number>;
  trend: 'improving' | 'stable' | 'declining';
}

interface DemographicSentiment {
  demographic: string;
  sampleSize: number;
  averageSentiment: number;
  topConcerns: string[];
  dominantEmotion: EmotionCategory;
}

interface TimeSeriesPoint {
  timestamp: Date;
  sentimentScore: number;
  volume: number;
  dominantEmotion: EmotionCategory;
  significantEvent?: string;
}

// Communication effectiveness interfaces
interface CommunicationAnalysis {
  id: string;
  communicationId: string;
  communicationType: 'alert' | 'press_release' | 'social_post' | 'broadcast' | 'email' | 'sms';
  content: string;
  publishedAt: Date;
  incidentId?: string;
  reach: number;
  responseAnalysis: {
    totalResponses: number;
    sentimentBreakdown: Record<SentimentPolarity, number>;
    averageSentiment: number;
    emotionBreakdown: Record<EmotionCategory, number>;
  };
  effectiveness: {
    clarityScore: number;
    actionabilityScore: number;
    reassuranceScore: number;
    overallScore: number;
  };
  concerns: string[];
  misunderstandings: string[];
  positiveReactions: string[];
  recommendations: string[];
  analyzedAt: Date;
}

// Alert interfaces
interface SentimentAlert {
  id: string;
  type: 'sentiment_drop' | 'concern_spike' | 'negative_trend' | 'emotion_surge' | 'entity_criticism' | 'misinformation_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  scope: AnalysisScope;
  scopeId: string;
  title: string;
  description: string;
  metrics: {
    currentValue: number;
    previousValue: number;
    threshold: number;
    changePercent: number;
  };
  affectedContent: string[];
  recommendedActions: string[];
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  status: 'active' | 'acknowledged' | 'resolved';
}

// Report interfaces
interface SentimentReport {
  id: string;
  title: string;
  incidentId?: string;
  reportType: 'daily' | 'weekly' | 'incident' | 'communication' | 'custom';
  period: { start: Date; end: Date };
  executiveSummary: string;
  keyFindings: string[];
  aggregations: SentimentAggregation[];
  communicationAnalyses?: CommunicationAnalysis[];
  alerts: SentimentAlert[];
  recommendations: Recommendation[];
  appendices?: { title: string; content: string }[];
  generatedAt: Date;
  generatedBy: string;
}

interface Recommendation {
  priority: 'immediate' | 'short_term' | 'medium_term';
  category: 'communication' | 'response' | 'resources' | 'engagement' | 'other';
  recommendation: string;
  rationale: string;
  expectedImpact: string;
}

// Monitoring configuration
interface MonitoringConfig {
  id: string;
  name: string;
  incidentId?: string;
  scope: AnalysisScope;
  scopeId: string;
  sources: ContentSource[];
  keywords: string[];
  excludeKeywords: string[];
  languages: string[];
  alertThresholds: {
    sentimentDropThreshold: number;
    concernSpikeThreshold: number;
    negativeTrendDays: number;
    emotionSurgeThreshold: number;
  };
  aggregationInterval: 'hourly' | 'daily' | 'weekly';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Sample data
const sampleAnalyses: SentimentAnalysis[] = [
  {
    id: 'analysis-001',
    contentId: 'post-001',
    source: 'social_media',
    content: 'Really grateful for the quick response from emergency services. They helped evacuate our neighborhood safely. #ThankYou #EmergencyResponse',
    incidentId: 'incident-001',
    timestamp: new Date(),
    sentiment: {
      polarity: 'very_positive',
      score: 0.85,
      magnitude: 0.9,
      subjectivity: 0.7,
      comparative: 0.8
    },
    emotions: [
      { emotion: 'gratitude', score: 0.9, confidence: 0.95, indicators: ['grateful', 'thank you'] },
      { emotion: 'relief', score: 0.7, confidence: 0.85, indicators: ['safely'] }
    ],
    topics: [
      { topic: 'emergency response', relevance: 0.95, sentiment: 'very_positive', sentimentScore: 0.85, keywords: ['emergency services', 'response'] },
      { topic: 'evacuation', relevance: 0.8, sentiment: 'positive', sentimentScore: 0.6, keywords: ['evacuate', 'neighborhood'] }
    ],
    concerns: [],
    entities: [
      { entity: 'emergency services', type: 'organization', sentiment: 'very_positive', sentimentScore: 0.85, mentionCount: 1 }
    ],
    language: 'en',
    confidence: 0.92,
    metadata: { platform: 'twitter', engagement: 150 },
    analyzedAt: new Date()
  }
];

class SentimentAnalysisService {
  private static instance: SentimentAnalysisService;
  private analyses: Map<string, SentimentAnalysis> = new Map();
  private aggregations: Map<string, SentimentAggregation> = new Map();
  private communicationAnalyses: Map<string, CommunicationAnalysis> = new Map();
  private alerts: Map<string, SentimentAlert> = new Map();
  private reports: Map<string, SentimentReport> = new Map();
  private configs: Map<string, MonitoringConfig> = new Map();

  // Sentiment lexicon (simplified)
  private readonly positiveLexicon: Record<string, number> = {
    'good': 0.5, 'great': 0.7, 'excellent': 0.9, 'amazing': 0.8, 'wonderful': 0.8,
    'helpful': 0.6, 'grateful': 0.8, 'thank': 0.6, 'safe': 0.5, 'relief': 0.6,
    'quick': 0.4, 'efficient': 0.5, 'professional': 0.5, 'caring': 0.6, 'hope': 0.5
  };

  private readonly negativeLexicon: Record<string, number> = {
    'bad': -0.5, 'terrible': -0.8, 'horrible': -0.9, 'awful': -0.8, 'poor': -0.5,
    'slow': -0.4, 'delayed': -0.5, 'frustrated': -0.6, 'angry': -0.7, 'scared': -0.5,
    'worried': -0.4, 'confused': -0.4, 'neglected': -0.6, 'failed': -0.6, 'worst': -0.8
  };

  private readonly emotionKeywords: Record<EmotionCategory, string[]> = {
    fear: ['scared', 'afraid', 'terrified', 'frightened', 'panic', 'alarmed'],
    anger: ['angry', 'furious', 'outraged', 'mad', 'annoyed', 'irritated'],
    sadness: ['sad', 'devastated', 'heartbroken', 'grief', 'loss', 'tragic'],
    anxiety: ['worried', 'anxious', 'nervous', 'uneasy', 'concerned', 'stressed'],
    hope: ['hope', 'hopeful', 'optimistic', 'looking forward', 'positive'],
    relief: ['relief', 'relieved', 'thankful', 'grateful', 'safe'],
    gratitude: ['thank', 'grateful', 'appreciate', 'thankful', 'blessed'],
    frustration: ['frustrated', 'annoyed', 'irritated', 'fed up', 'disappointed'],
    confusion: ['confused', 'unclear', 'don\'t understand', 'lost', 'puzzled'],
    trust: ['trust', 'confident', 'believe', 'reliable', 'dependable'],
    neutral: []
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SentimentAnalysisService {
    if (!SentimentAnalysisService.instance) {
      SentimentAnalysisService.instance = new SentimentAnalysisService();
    }
    return SentimentAnalysisService.instance;
  }

  private initializeSampleData(): void {
    sampleAnalyses.forEach(a => this.analyses.set(a.id, a));
  }

  // ==================== Content Analysis ====================

  async analyzeContent(params: {
    contentId: string;
    source: ContentSource;
    content: string;
    incidentId?: string;
    locationId?: string;
    timestamp?: Date;
    metadata?: Record<string, any>;
  }): Promise<SentimentAnalysis> {
    const sentiment = this.calculateSentiment(params.content);
    const emotions = this.detectEmotions(params.content);
    const topics = this.extractTopics(params.content);
    const concerns = this.extractConcerns(params.content);
    const entities = this.extractEntities(params.content);

    const analysis: SentimentAnalysis = {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contentId: params.contentId,
      source: params.source,
      content: params.content,
      incidentId: params.incidentId,
      locationId: params.locationId,
      timestamp: params.timestamp || new Date(),
      sentiment,
      emotions,
      topics,
      concerns,
      entities,
      language: 'en', // Would use language detection
      confidence: this.calculateConfidence(params.content, sentiment, emotions),
      metadata: params.metadata || {},
      analyzedAt: new Date()
    };

    this.analyses.set(analysis.id, analysis);

    // Check for alerts
    await this.checkAlertTriggers(analysis);

    return analysis;
  }

  private calculateSentiment(text: string): SentimentResult {
    const words = text.toLowerCase().split(/\s+/);
    let totalScore = 0;
    let wordCount = 0;
    const breakdown: { word: string; score: number; contribution: number }[] = [];

    words.forEach(word => {
      const cleanWord = word.replace(/[^a-z]/g, '');
      if (this.positiveLexicon[cleanWord]) {
        const score = this.positiveLexicon[cleanWord];
        totalScore += score;
        wordCount++;
        breakdown.push({ word: cleanWord, score, contribution: score });
      } else if (this.negativeLexicon[cleanWord]) {
        const score = this.negativeLexicon[cleanWord];
        totalScore += score;
        wordCount++;
        breakdown.push({ word: cleanWord, score, contribution: score });
      }
    });

    const averageScore = wordCount > 0 ? totalScore / wordCount : 0;
    const magnitude = wordCount > 0 ? Math.abs(totalScore) / words.length : 0;

    let polarity: SentimentPolarity;
    if (averageScore >= 0.5) polarity = 'very_positive';
    else if (averageScore >= 0.2) polarity = 'positive';
    else if (averageScore <= -0.5) polarity = 'very_negative';
    else if (averageScore <= -0.2) polarity = 'negative';
    else polarity = 'neutral';

    // Estimate subjectivity based on emotional word density
    const subjectivity = Math.min(1, wordCount / (words.length * 0.3));

    return {
      polarity,
      score: Math.max(-1, Math.min(1, averageScore)),
      magnitude,
      subjectivity,
      comparative: averageScore,
      wordBreakdown: breakdown.slice(0, 10)
    };
  }

  private detectEmotions(text: string): EmotionResult[] {
    const textLower = text.toLowerCase();
    const results: EmotionResult[] = [];

    (Object.keys(this.emotionKeywords) as EmotionCategory[]).forEach(emotion => {
      if (emotion === 'neutral') return;

      const keywords = this.emotionKeywords[emotion];
      const indicators: string[] = [];
      let matchCount = 0;

      keywords.forEach(keyword => {
        if (textLower.includes(keyword)) {
          indicators.push(keyword);
          matchCount++;
        }
      });

      if (matchCount > 0) {
        results.push({
          emotion,
          score: Math.min(1, matchCount * 0.3 + 0.2),
          confidence: Math.min(0.95, 0.6 + matchCount * 0.1),
          indicators
        });
      }
    });

    // Sort by score and return top emotions
    return results.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  private extractTopics(text: string): TopicExtraction[] {
    const topics: TopicExtraction[] = [];
    const textLower = text.toLowerCase();

    const topicPatterns: { topic: string; keywords: string[] }[] = [
      { topic: 'emergency response', keywords: ['emergency', 'response', 'responders', '911', 'rescue'] },
      { topic: 'evacuation', keywords: ['evacuat', 'shelter', 'relocat', 'flee'] },
      { topic: 'communication', keywords: ['inform', 'alert', 'noti', 'update', 'news'] },
      { topic: 'resources', keywords: ['food', 'water', 'supplies', 'medicine', 'need'] },
      { topic: 'damage', keywords: ['damage', 'destroyed', 'flood', 'fire', 'wreck'] },
      { topic: 'recovery', keywords: ['recover', 'rebuild', 'repair', 'restore'] },
      { topic: 'safety', keywords: ['safe', 'danger', 'risk', 'protect'] }
    ];

    topicPatterns.forEach(pattern => {
      const matchedKeywords = pattern.keywords.filter(k => textLower.includes(k));
      if (matchedKeywords.length > 0) {
        const relevance = Math.min(1, matchedKeywords.length * 0.25 + 0.25);
        
        // Calculate topic-specific sentiment
        const topicSentiment = this.calculateSentiment(
          matchedKeywords.map(k => {
            const idx = textLower.indexOf(k);
            return text.substring(Math.max(0, idx - 30), Math.min(text.length, idx + 30));
          }).join(' ')
        );

        topics.push({
          topic: pattern.topic,
          relevance,
          sentiment: topicSentiment.polarity,
          sentimentScore: topicSentiment.score,
          keywords: matchedKeywords
        });
      }
    });

    return topics.sort((a, b) => b.relevance - a.relevance);
  }

  private extractConcerns(text: string): ConcernExtraction[] {
    const concerns: ConcernExtraction[] = [];
    const textLower = text.toLowerCase();

    const concernPatterns: { concern: string; category: ConcernExtraction['category']; patterns: string[] }[] = [
      { concern: 'Slow response time', category: 'response', patterns: ['slow', 'delay', 'waiting', 'too long'] },
      { concern: 'Lack of information', category: 'communication', patterns: ['no info', 'don\'t know', 'unclear', 'confus'] },
      { concern: 'Resource shortage', category: 'resources', patterns: ['no food', 'no water', 'running out', 'need supplies'] },
      { concern: 'Safety fears', category: 'safety', patterns: ['not safe', 'dangerous', 'scared', 'afraid'] },
      { concern: 'Communication issues', category: 'communication', patterns: ['can\'t reach', 'no signal', 'no internet'] },
      { concern: 'Health concerns', category: 'health', patterns: ['sick', 'medical', 'hospital', 'injury'] }
    ];

    concernPatterns.forEach(pattern => {
      const matches = pattern.patterns.filter(p => textLower.includes(p));
      if (matches.length > 0) {
        const sentiment = this.calculateSentiment(text);
        concerns.push({
          concern: pattern.concern,
          category: pattern.category,
          urgency: sentiment.score < -0.5 ? 'high' : sentiment.score < -0.2 ? 'medium' : 'low',
          sentiment: sentiment.polarity,
          frequency: matches.length,
          sampleTexts: [text.substring(0, 100)]
        });
      }
    });

    return concerns;
  }

  private extractEntities(text: string): EntityMention[] {
    const entities: EntityMention[] = [];
    
    const entityPatterns: { pattern: RegExp; type: EntityMention['type'] }[] = [
      { pattern: /(?:emergency services?|fire department|police|ems|ambulance)/gi, type: 'organization' },
      { pattern: /(?:red cross|fema|national guard)/gi, type: 'organization' },
      { pattern: /(?:mayor|governor|president|official)/gi, type: 'person' },
      { pattern: /(?:shelter|hospital|school|center)/gi, type: 'facility' }
    ];

    entityPatterns.forEach(({ pattern, type }) => {
      const matches = text.match(pattern);
      if (matches) {
        const uniqueMatches = [...new Set(matches.map(m => m.toLowerCase()))];
        uniqueMatches.forEach(match => {
          // Get context around entity for sentiment
          const idx = text.toLowerCase().indexOf(match);
          const context = text.substring(Math.max(0, idx - 50), Math.min(text.length, idx + 50));
          const entitySentiment = this.calculateSentiment(context);

          entities.push({
            entity: match,
            type,
            sentiment: entitySentiment.polarity,
            sentimentScore: entitySentiment.score,
            mentionCount: matches.filter(m => m.toLowerCase() === match).length
          });
        });
      }
    });

    return entities;
  }

  private calculateConfidence(text: string, sentiment: SentimentResult, emotions: EmotionResult[]): number {
    let confidence = 0.5;

    // Longer text = more confidence
    if (text.length > 100) confidence += 0.1;
    if (text.length > 200) confidence += 0.1;

    // More sentiment signals = more confidence
    if (sentiment.wordBreakdown && sentiment.wordBreakdown.length > 3) confidence += 0.1;

    // Detected emotions add confidence
    if (emotions.length > 0) confidence += 0.1;

    // High magnitude = more confidence
    if (sentiment.magnitude > 0.3) confidence += 0.1;

    return Math.min(0.95, confidence);
  }

  async getAnalysis(analysisId: string): Promise<SentimentAnalysis | null> {
    return this.analyses.get(analysisId) || null;
  }

  async searchAnalyses(query: {
    incidentId?: string;
    source?: ContentSource[];
    polarity?: SentimentPolarity[];
    emotions?: EmotionCategory[];
    topics?: string[];
    dateRange?: { start: Date; end: Date };
    minConfidence?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ analyses: SentimentAnalysis[]; total: number }> {
    let analyses = Array.from(this.analyses.values());

    if (query.incidentId) {
      analyses = analyses.filter(a => a.incidentId === query.incidentId);
    }

    if (query.source && query.source.length > 0) {
      analyses = analyses.filter(a => query.source!.includes(a.source));
    }

    if (query.polarity && query.polarity.length > 0) {
      analyses = analyses.filter(a => query.polarity!.includes(a.sentiment.polarity));
    }

    if (query.emotions && query.emotions.length > 0) {
      analyses = analyses.filter(a =>
        a.emotions.some(e => query.emotions!.includes(e.emotion))
      );
    }

    if (query.topics && query.topics.length > 0) {
      analyses = analyses.filter(a =>
        a.topics.some(t => query.topics!.some(qt => t.topic.toLowerCase().includes(qt.toLowerCase())))
      );
    }

    if (query.dateRange) {
      analyses = analyses.filter(a =>
        a.timestamp >= query.dateRange!.start && a.timestamp <= query.dateRange!.end
      );
    }

    if (query.minConfidence) {
      analyses = analyses.filter(a => a.confidence >= query.minConfidence!);
    }

    analyses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = analyses.length;
    const offset = query.offset || 0;
    const limit = query.limit || 50;

    return {
      analyses: analyses.slice(offset, offset + limit),
      total
    };
  }

  // ==================== Aggregation ====================

  async generateAggregation(params: {
    scope: AnalysisScope;
    scopeId: string;
    scopeName: string;
    period: { start: Date; end: Date };
    incidentId?: string;
  }): Promise<SentimentAggregation> {
    // Get relevant analyses
    const { analyses } = await this.searchAnalyses({
      incidentId: params.incidentId,
      dateRange: params.period
    });

    if (analyses.length === 0) {
      throw new Error('No analyses found for the specified criteria');
    }

    // Calculate overall sentiment
    const sentimentScores = analyses.map(a => a.sentiment.score);
    const averageScore = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;

    const polarityDistribution: Record<SentimentPolarity, number> = {
      very_negative: 0, negative: 0, neutral: 0, positive: 0, very_positive: 0
    };
    analyses.forEach(a => polarityDistribution[a.sentiment.polarity]++);

    // Calculate emotion profile
    const emotionCounts: Record<EmotionCategory, number> = {} as Record<EmotionCategory, number>;
    analyses.forEach(a => {
      a.emotions.forEach(e => {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + e.score;
      });
    });

    const dominantEmotion = (Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral') as EmotionCategory;

    // Aggregate concerns
    const concernMap = new Map<string, { count: number; sentiments: number[]; urgencies: string[] }>();
    analyses.forEach(a => {
      a.concerns.forEach(c => {
        const existing = concernMap.get(c.concern) || { count: 0, sentiments: [], urgencies: [] };
        existing.count++;
        existing.sentiments.push(a.sentiment.score);
        existing.urgencies.push(c.urgency);
        concernMap.set(c.concern, existing);
      });
    });

    const topConcerns: ConcernSummary[] = Array.from(concernMap.entries())
      .map(([concern, data]) => ({
        concern,
        category: 'other' as const,
        frequency: data.count,
        percentageOfTotal: (data.count / analyses.length) * 100,
        averageSentiment: data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length,
        trend: 'stable' as const,
        urgencyLevel: data.urgencies.includes('critical') ? 'critical' as const :
          data.urgencies.includes('high') ? 'high' as const :
          data.urgencies.includes('medium') ? 'medium' as const : 'low' as const
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Aggregate topics
    const topicMap = new Map<string, { count: number; sentiments: number[] }>();
    analyses.forEach(a => {
      a.topics.forEach(t => {
        const existing = topicMap.get(t.topic) || { count: 0, sentiments: [] };
        existing.count++;
        existing.sentiments.push(t.sentimentScore);
        topicMap.set(t.topic, existing);
      });
    });

    const topTopics: TopicSummary[] = Array.from(topicMap.entries())
      .map(([topic, data]) => ({
        topic,
        frequency: data.count,
        averageSentiment: data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length,
        sentimentTrend: 'stable' as const,
        relatedConcerns: []
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    // Aggregate entities
    const entityMap = new Map<string, { type: EntityMention['type']; count: number; sentiments: number[] }>();
    analyses.forEach(a => {
      a.entities.forEach(e => {
        const existing = entityMap.get(e.entity) || { type: e.type, count: 0, sentiments: [] };
        existing.count += e.mentionCount;
        existing.sentiments.push(e.sentimentScore);
        entityMap.set(e.entity, existing);
      });
    });

    const entitySentiments: EntitySentimentSummary[] = Array.from(entityMap.entries())
      .map(([entity, data]) => ({
        entity,
        type: data.type,
        mentionCount: data.count,
        averageSentiment: data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length,
        sentimentDistribution: { very_negative: 0, negative: 0, neutral: 0, positive: 0, very_positive: 0 },
        trend: 'stable' as const
      }))
      .sort((a, b) => b.mentionCount - a.mentionCount)
      .slice(0, 10);

    // Source breakdown
    const sourceBreakdown: Record<ContentSource, { count: number; avgSentiment: number }> = {} as any;
    analyses.forEach(a => {
      if (!sourceBreakdown[a.source]) {
        sourceBreakdown[a.source] = { count: 0, avgSentiment: 0 };
      }
      sourceBreakdown[a.source].count++;
      sourceBreakdown[a.source].avgSentiment += a.sentiment.score;
    });
    Object.keys(sourceBreakdown).forEach(source => {
      const s = source as ContentSource;
      sourceBreakdown[s].avgSentiment /= sourceBreakdown[s].count;
    });

    // Time series
    const hourlyBuckets = new Map<number, { scores: number[]; emotions: EmotionCategory[] }>();
    analyses.forEach(a => {
      const hour = Math.floor(a.timestamp.getTime() / (60 * 60 * 1000));
      const bucket = hourlyBuckets.get(hour) || { scores: [], emotions: [] };
      bucket.scores.push(a.sentiment.score);
      if (a.emotions[0]) bucket.emotions.push(a.emotions[0].emotion);
      hourlyBuckets.set(hour, bucket);
    });

    const timeSeriesData: TimeSeriesPoint[] = Array.from(hourlyBuckets.entries())
      .map(([hour, data]) => ({
        timestamp: new Date(hour * 60 * 60 * 1000),
        sentimentScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        volume: data.scores.length,
        dominantEmotion: this.getModeEmotion(data.emotions)
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const aggregation: SentimentAggregation = {
      id: `agg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      scope: params.scope,
      scopeId: params.scopeId,
      scopeName: params.scopeName,
      period: params.period,
      sampleSize: analyses.length,
      overallSentiment: {
        polarity: this.getPolarityFromScore(averageScore),
        averageScore,
        distribution: polarityDistribution,
        trend: 'stable',
        trendMagnitude: 0
      },
      emotionProfile: {
        dominant: dominantEmotion,
        distribution: emotionCounts,
        intensity: Object.values(emotionCounts).reduce((a, b) => a + b, 0) / analyses.length
      },
      topConcerns,
      topTopics,
      entitySentiments,
      sourceBreakdown,
      timeSeriesData,
      generatedAt: new Date()
    };

    this.aggregations.set(aggregation.id, aggregation);
    return aggregation;
  }

  private getModeEmotion(emotions: EmotionCategory[]): EmotionCategory {
    if (emotions.length === 0) return 'neutral';
    
    const counts = emotions.reduce((acc, e) => {
      acc[e] = (acc[e] || 0) + 1;
      return acc;
    }, {} as Record<EmotionCategory, number>);

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0][0] as EmotionCategory;
  }

  private getPolarityFromScore(score: number): SentimentPolarity {
    if (score >= 0.5) return 'very_positive';
    if (score >= 0.2) return 'positive';
    if (score <= -0.5) return 'very_negative';
    if (score <= -0.2) return 'negative';
    return 'neutral';
  }

  async getAggregation(aggregationId: string): Promise<SentimentAggregation | null> {
    return this.aggregations.get(aggregationId) || null;
  }

  // ==================== Communication Analysis ====================

  async analyzeCommunication(params: {
    communicationId: string;
    communicationType: CommunicationAnalysis['communicationType'];
    content: string;
    publishedAt: Date;
    incidentId?: string;
    responses: { content: string; source: ContentSource }[];
  }): Promise<CommunicationAnalysis> {
    // Analyze each response
    const responseAnalyses: SentimentAnalysis[] = [];
    for (const response of params.responses) {
      const analysis = await this.analyzeContent({
        contentId: `response-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        source: response.source,
        content: response.content,
        incidentId: params.incidentId
      });
      responseAnalyses.push(analysis);
    }

    // Aggregate response sentiment
    const sentimentBreakdown: Record<SentimentPolarity, number> = {
      very_negative: 0, negative: 0, neutral: 0, positive: 0, very_positive: 0
    };
    const emotionBreakdown: Record<EmotionCategory, number> = {} as Record<EmotionCategory, number>;

    responseAnalyses.forEach(a => {
      sentimentBreakdown[a.sentiment.polarity]++;
      a.emotions.forEach(e => {
        emotionBreakdown[e.emotion] = (emotionBreakdown[e.emotion] || 0) + 1;
      });
    });

    const averageSentiment = responseAnalyses.length > 0
      ? responseAnalyses.reduce((sum, a) => sum + a.sentiment.score, 0) / responseAnalyses.length
      : 0;

    // Calculate effectiveness scores
    const contentLower = params.content.toLowerCase();
    const clarityScore = this.calculateClarityScore(params.content);
    const actionabilityScore = this.calculateActionabilityScore(params.content);
    const reassuranceScore = this.calculateReassuranceScore(params.content);

    // Extract concerns and misunderstandings from responses
    const concerns: string[] = [];
    const misunderstandings: string[] = [];
    const positiveReactions: string[] = [];

    responseAnalyses.forEach(a => {
      if (a.sentiment.score < -0.3) {
        concerns.push(a.content.substring(0, 100));
      }
      if (a.emotions.some(e => e.emotion === 'confusion')) {
        misunderstandings.push(a.content.substring(0, 100));
      }
      if (a.sentiment.score > 0.3) {
        positiveReactions.push(a.content.substring(0, 100));
      }
    });

    const analysis: CommunicationAnalysis = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      communicationId: params.communicationId,
      communicationType: params.communicationType,
      content: params.content,
      publishedAt: params.publishedAt,
      incidentId: params.incidentId,
      reach: params.responses.length * 10, // Estimate
      responseAnalysis: {
        totalResponses: params.responses.length,
        sentimentBreakdown,
        averageSentiment,
        emotionBreakdown
      },
      effectiveness: {
        clarityScore,
        actionabilityScore,
        reassuranceScore,
        overallScore: (clarityScore + actionabilityScore + reassuranceScore) / 3
      },
      concerns: concerns.slice(0, 5),
      misunderstandings: misunderstandings.slice(0, 5),
      positiveReactions: positiveReactions.slice(0, 5),
      recommendations: this.generateCommunicationRecommendations(clarityScore, actionabilityScore, reassuranceScore, averageSentiment),
      analyzedAt: new Date()
    };

    this.communicationAnalyses.set(analysis.id, analysis);
    return analysis;
  }

  private calculateClarityScore(content: string): number {
    let score = 0.5;

    // Short sentences = clearer
    const sentences = content.split(/[.!?]+/);
    const avgSentenceLength = content.split(/\s+/).length / sentences.length;
    if (avgSentenceLength < 15) score += 0.2;
    else if (avgSentenceLength < 20) score += 0.1;
    else if (avgSentenceLength > 30) score -= 0.1;

    // Has structure (bullet points, numbers)
    if (/[\d•\-\*]/.test(content)) score += 0.1;

    // Simple words (fewer long words)
    const words = content.split(/\s+/);
    const longWords = words.filter(w => w.length > 10).length;
    if (longWords / words.length < 0.1) score += 0.1;

    return Math.min(1, Math.max(0, score));
  }

  private calculateActionabilityScore(content: string): number {
    let score = 0.3;
    const contentLower = content.toLowerCase();

    // Contains action verbs
    const actionVerbs = ['go', 'call', 'contact', 'visit', 'follow', 'check', 'stay', 'avoid', 'evacuate', 'prepare'];
    actionVerbs.forEach(verb => {
      if (contentLower.includes(verb)) score += 0.1;
    });

    // Contains specific instructions
    if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(content)) score += 0.1; // Phone number
    if (/www\.|http|\.com|\.org/.test(content)) score += 0.1; // URL
    if (/\d+\s*(am|pm|:)/i.test(content)) score += 0.05; // Time

    return Math.min(1, score);
  }

  private calculateReassuranceScore(content: string): number {
    let score = 0.3;
    const contentLower = content.toLowerCase();

    const reassuringWords = ['safe', 'help', 'support', 'assistance', 'available', 'working', 'monitoring', 'ready', 'prepared'];
    reassuringWords.forEach(word => {
      if (contentLower.includes(word)) score += 0.08;
    });

    // Mentions resources or support
    if (/shelter|food|water|medical/i.test(content)) score += 0.1;

    // Provides contact information
    if (/contact|call|reach/i.test(content)) score += 0.1;

    return Math.min(1, score);
  }

  private generateCommunicationRecommendations(clarity: number, actionability: number, reassurance: number, sentiment: number): string[] {
    const recommendations: string[] = [];

    if (clarity < 0.6) {
      recommendations.push('Use shorter sentences and simpler language');
      recommendations.push('Add bullet points or numbered lists for key information');
    }

    if (actionability < 0.5) {
      recommendations.push('Include specific action steps for recipients');
      recommendations.push('Add contact information and resources');
    }

    if (reassurance < 0.5) {
      recommendations.push('Add reassuring language about response efforts');
      recommendations.push('Highlight available support and resources');
    }

    if (sentiment < -0.2) {
      recommendations.push('Address common concerns identified in responses');
      recommendations.push('Consider a follow-up communication with clarifications');
    }

    if (recommendations.length === 0) {
      recommendations.push('Communication appears effective - continue monitoring responses');
    }

    return recommendations;
  }

  // ==================== Alert Management ====================

  private async checkAlertTriggers(analysis: SentimentAnalysis): Promise<void> {
    // Check for very negative sentiment
    if (analysis.sentiment.score < -0.6) {
      await this.createAlert({
        type: 'sentiment_drop',
        severity: 'high',
        scope: analysis.incidentId ? 'incident' : 'topic',
        scopeId: analysis.incidentId || 'general',
        title: 'Highly negative sentiment detected',
        description: `Content shows very negative sentiment (score: ${analysis.sentiment.score.toFixed(2)})`,
        metrics: {
          currentValue: analysis.sentiment.score,
          previousValue: 0,
          threshold: -0.5,
          changePercent: 0
        },
        affectedContent: [analysis.id]
      });
    }

    // Check for critical concerns
    const criticalConcerns = analysis.concerns.filter(c => c.urgency === 'critical');
    if (criticalConcerns.length > 0) {
      await this.createAlert({
        type: 'concern_spike',
        severity: 'critical',
        scope: 'incident',
        scopeId: analysis.incidentId || 'general',
        title: 'Critical concerns detected',
        description: `${criticalConcerns.length} critical concern(s): ${criticalConcerns.map(c => c.concern).join(', ')}`,
        metrics: {
          currentValue: criticalConcerns.length,
          previousValue: 0,
          threshold: 1,
          changePercent: 100
        },
        affectedContent: [analysis.id]
      });
    }
  }

  async createAlert(params: {
    type: SentimentAlert['type'];
    severity: SentimentAlert['severity'];
    scope: AnalysisScope;
    scopeId: string;
    title: string;
    description: string;
    metrics: SentimentAlert['metrics'];
    affectedContent: string[];
  }): Promise<SentimentAlert> {
    const recommendations = this.getAlertRecommendations(params.type, params.severity);

    const alert: SentimentAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      severity: params.severity,
      scope: params.scope,
      scopeId: params.scopeId,
      title: params.title,
      description: params.description,
      metrics: params.metrics,
      affectedContent: params.affectedContent,
      recommendedActions: recommendations,
      createdAt: new Date(),
      status: 'active'
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  private getAlertRecommendations(type: SentimentAlert['type'], severity: SentimentAlert['severity']): string[] {
    const recommendations: string[] = [];

    switch (type) {
      case 'sentiment_drop':
        recommendations.push('Review recent communications for potential issues');
        recommendations.push('Consider issuing clarifying statement');
        break;
      case 'concern_spike':
        recommendations.push('Investigate root cause of concern');
        recommendations.push('Prepare targeted response addressing specific concern');
        break;
      case 'negative_trend':
        recommendations.push('Analyze trend causes');
        recommendations.push('Develop communication strategy to address issues');
        break;
      case 'entity_criticism':
        recommendations.push('Review criticism for validity');
        recommendations.push('Consider public response if appropriate');
        break;
    }

    if (severity === 'critical') {
      recommendations.unshift('Escalate to communications team immediately');
    }

    return recommendations;
  }

  async getAlerts(params?: {
    type?: SentimentAlert['type'];
    severity?: SentimentAlert['severity'];
    status?: SentimentAlert['status'];
    scope?: AnalysisScope;
  }): Promise<SentimentAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.type) {
      alerts = alerts.filter(a => a.type === params.type);
    }

    if (params?.severity) {
      alerts = alerts.filter(a => a.severity === params.severity);
    }

    if (params?.status) {
      alerts = alerts.filter(a => a.status === params.status);
    }

    if (params?.scope) {
      alerts = alerts.filter(a => a.scope === params.scope);
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity] || b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<SentimentAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.status = 'acknowledged';
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;

    return alert;
  }

  async resolveAlert(alertId: string): Promise<SentimentAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.status = 'resolved';
    alert.resolvedAt = new Date();

    return alert;
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalAnalyses: number;
    avgSentiment: number;
    sentimentDistribution: Record<SentimentPolarity, number>;
    topEmotions: { emotion: EmotionCategory; count: number }[];
    topConcerns: { concern: string; count: number }[];
    sourceBreakdown: Record<ContentSource, number>;
    activeAlerts: number;
  }> {
    let analyses = Array.from(this.analyses.values());

    if (incidentId) {
      analyses = analyses.filter(a => a.incidentId === incidentId);
    }

    const sentimentDistribution: Record<SentimentPolarity, number> = {
      very_negative: 0, negative: 0, neutral: 0, positive: 0, very_positive: 0
    };
    const emotionCounts: Record<EmotionCategory, number> = {} as Record<EmotionCategory, number>;
    const concernCounts: Record<string, number> = {};
    const sourceBreakdown: Record<ContentSource, number> = {} as Record<ContentSource, number>;

    analyses.forEach(a => {
      sentimentDistribution[a.sentiment.polarity]++;
      
      a.emotions.forEach(e => {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
      });

      a.concerns.forEach(c => {
        concernCounts[c.concern] = (concernCounts[c.concern] || 0) + 1;
      });

      sourceBreakdown[a.source] = (sourceBreakdown[a.source] || 0) + 1;
    });

    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion, count]) => ({ emotion: emotion as EmotionCategory, count }));

    const topConcerns = Object.entries(concernCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([concern, count]) => ({ concern, count }));

    const avgSentiment = analyses.length > 0
      ? analyses.reduce((sum, a) => sum + a.sentiment.score, 0) / analyses.length
      : 0;

    const activeAlerts = (await this.getAlerts({ status: 'active' })).length;

    return {
      totalAnalyses: analyses.length,
      avgSentiment,
      sentimentDistribution,
      topEmotions,
      topConcerns,
      sourceBreakdown,
      activeAlerts
    };
  }
}

export const sentimentAnalysisService = SentimentAnalysisService.getInstance();
export default SentimentAnalysisService;

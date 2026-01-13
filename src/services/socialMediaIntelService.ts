/**
 * Social Media Intelligence Service - Issue #133 Implementation
 * 
 * Provides comprehensive social media monitoring, analysis, and intelligence
 * gathering for disaster response including real-time trending analysis,
 * misinformation detection, influencer identification, and geo-tagged content.
 */

// Type definitions
type Platform = 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'reddit' | 'nextdoor' | 'linkedin' | 'telegram' | 'whatsapp';
type ContentType = 'text' | 'image' | 'video' | 'audio' | 'link' | 'poll' | 'story' | 'live';
type SentimentType = 'positive' | 'negative' | 'neutral' | 'mixed';
type CredibilityLevel = 'verified' | 'high' | 'medium' | 'low' | 'unknown' | 'suspected_misinfo';
type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
type TrendStatus = 'emerging' | 'rising' | 'peaked' | 'declining' | 'stable';

// Social media post interfaces
interface SocialPost {
  id: string;
  platform: Platform;
  platformPostId: string;
  contentType: ContentType;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorVerified: boolean;
  authorFollowers: number;
  content: string;
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
  urls: string[];
  location?: GeoLocation;
  language: string;
  postedAt: Date;
  collectedAt: Date;
  engagement: EngagementMetrics;
  analysis: PostAnalysis;
  incidentId?: string;
  isBookmarked: boolean;
  isArchived: boolean;
  notes: string[];
}

interface GeoLocation {
  name?: string;
  coordinates?: { lat: number; lon: number };
  placeId?: string;
  city?: string;
  state?: string;
  country?: string;
  radius?: number;
  accuracy: 'exact' | 'approximate' | 'inferred';
}

interface EngagementMetrics {
  likes: number;
  shares: number;
  comments: number;
  views?: number;
  reactions?: Record<string, number>;
  engagementRate: number;
  viralScore: number;
  reachEstimate: number;
}

interface PostAnalysis {
  sentiment: SentimentType;
  sentimentScore: number;
  credibility: CredibilityLevel;
  credibilityScore: number;
  categories: string[];
  entities: ExtractedEntity[];
  keywords: string[];
  urgencyScore: number;
  relevanceScore: number;
  misinfoFlags: MisinfoFlag[];
  isActionable: boolean;
  needsVerification: boolean;
  analyzedAt: Date;
}

interface ExtractedEntity {
  type: 'person' | 'organization' | 'location' | 'event' | 'product' | 'other';
  value: string;
  confidence: number;
  linkedId?: string;
}

interface MisinfoFlag {
  type: 'factual_error' | 'misleading' | 'out_of_context' | 'manipulated_media' | 'satire' | 'unverified_claim';
  description: string;
  confidence: number;
  factCheckUrl?: string;
  detectedBy: 'ai' | 'manual' | 'external';
}

// Author and influencer interfaces
interface SocialAuthor {
  id: string;
  platform: Platform;
  platformUserId: string;
  username: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  accountCreated?: Date;
  location?: string;
  credibilityRating: CredibilityLevel;
  influenceScore: number;
  categories: string[];
  recentActivity: {
    postsLast24h: number;
    postsLast7d: number;
    avgEngagement: number;
  };
  trustScore: number;
  flags: AuthorFlag[];
  isMonitored: boolean;
  notes: string;
  updatedAt: Date;
}

interface AuthorFlag {
  type: 'bot_suspected' | 'coordinated_behavior' | 'misinfo_spreader' | 'crisis_actor' | 'trusted_source';
  confidence: number;
  evidence: string;
  flaggedAt: Date;
  flaggedBy: string;
}

// Monitoring and search interfaces
interface MonitoringQuery {
  id: string;
  name: string;
  incidentId?: string;
  platforms: Platform[];
  keywords: string[];
  hashtags: string[];
  accounts: string[];
  excludeKeywords: string[];
  location?: {
    coordinates: { lat: number; lon: number };
    radius: number;
    unit: 'km' | 'mi';
  };
  language?: string[];
  dateRange?: { start: Date; end?: Date };
  contentTypes?: ContentType[];
  minEngagement?: number;
  isActive: boolean;
  alertThreshold?: AlertThreshold;
  collectionFrequency: 'realtime' | '5min' | '15min' | '30min' | 'hourly';
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  postsCollected: number;
}

interface AlertThreshold {
  volumeSpike: number;
  sentimentShift: number;
  viralThreshold: number;
  misinfoDetection: boolean;
  emergencyKeywords: string[];
}

interface SearchResult {
  posts: SocialPost[];
  totalCount: number;
  platforms: Record<Platform, number>;
  timeRange: { earliest: Date; latest: Date };
  topHashtags: { tag: string; count: number }[];
  topAuthors: { author: string; postCount: number; totalEngagement: number }[];
  sentimentBreakdown: Record<SentimentType, number>;
  locationBreakdown: { location: string; count: number }[];
}

// Trend and topic interfaces
interface TrendingTopic {
  id: string;
  topic: string;
  hashtags: string[];
  keywords: string[];
  platform: Platform | 'all';
  volume: number;
  volumeChange: number;
  velocity: number;
  status: TrendStatus;
  peakTime?: Date;
  sentiment: SentimentType;
  samplePosts: string[];
  relatedTopics: string[];
  geographicFocus?: string[];
  firstSeen: Date;
  lastUpdated: Date;
  isDisasterRelated: boolean;
  incidentId?: string;
}

interface TopicCluster {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  postCount: number;
  authorCount: number;
  sentiment: SentimentType;
  timespan: { start: Date; end: Date };
  centerPost?: string;
  evolution: TopicEvolution[];
}

interface TopicEvolution {
  timestamp: Date;
  volume: number;
  sentiment: SentimentType;
  topKeywords: string[];
}

// Intelligence report interfaces
interface IntelligenceReport {
  id: string;
  incidentId: string;
  title: string;
  reportType: 'situation' | 'threat' | 'misinfo' | 'sentiment' | 'summary';
  period: { start: Date; end: Date };
  summary: string;
  keyFindings: string[];
  metrics: ReportMetrics;
  trends: TrendingTopic[];
  topPosts: SocialPost[];
  misinformationAlerts: MisinfoAlert[];
  recommendations: string[];
  attachments: string[];
  generatedAt: Date;
  generatedBy: string;
}

interface ReportMetrics {
  totalPosts: number;
  uniqueAuthors: number;
  totalEngagement: number;
  reachEstimate: number;
  platformBreakdown: Record<Platform, number>;
  sentimentOverTime: { timestamp: Date; sentiment: SentimentType; score: number }[];
  topLocations: { location: string; count: number }[];
  volumeTimeline: { timestamp: Date; count: number }[];
}

interface MisinfoAlert {
  id: string;
  incidentId?: string;
  title: string;
  description: string;
  category: MisinfoFlag['type'];
  severity: AlertPriority;
  affectedPosts: string[];
  spreadMetrics: {
    postsCount: number;
    totalReach: number;
    platforms: Platform[];
    firstSeen: Date;
    peakSpread: Date;
  };
  factCheck?: {
    claim: string;
    verdict: 'true' | 'false' | 'misleading' | 'unverifiable';
    explanation: string;
    sources: string[];
  };
  countermeasures: string[];
  status: 'active' | 'contained' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

// Alert interfaces
interface SocialAlert {
  id: string;
  type: 'volume_spike' | 'sentiment_shift' | 'viral_content' | 'misinfo_detected' | 'emergency_keyword' | 'influential_post' | 'coordinated_activity';
  priority: AlertPriority;
  title: string;
  description: string;
  queryId?: string;
  incidentId?: string;
  triggerData: Record<string, any>;
  relatedPosts: string[];
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolved: boolean;
  resolvedAt?: Date;
}

// Sample data
const samplePosts: SocialPost[] = [
  {
    id: 'post-001',
    platform: 'twitter',
    platformPostId: '1234567890',
    contentType: 'text',
    authorId: 'author-001',
    authorUsername: 'local_news_anchor',
    authorDisplayName: 'Local News Anchor',
    authorVerified: true,
    authorFollowers: 50000,
    content: 'BREAKING: Major flooding reported in downtown area. Emergency services responding. Please avoid Main St and surrounding areas. #FloodAlert #LocalEmergency',
    mediaUrls: [],
    hashtags: ['FloodAlert', 'LocalEmergency'],
    mentions: [],
    urls: [],
    location: {
      name: 'Downtown Metro Area',
      city: 'Metro City',
      state: 'CA',
      accuracy: 'approximate'
    },
    language: 'en',
    postedAt: new Date(Date.now() - 30 * 60 * 1000),
    collectedAt: new Date(),
    engagement: {
      likes: 1250,
      shares: 890,
      comments: 234,
      views: 45000,
      engagementRate: 5.2,
      viralScore: 78,
      reachEstimate: 125000
    },
    analysis: {
      sentiment: 'negative',
      sentimentScore: -0.6,
      credibility: 'verified',
      credibilityScore: 0.95,
      categories: ['emergency', 'weather', 'traffic'],
      entities: [
        { type: 'location', value: 'Main St', confidence: 0.9 },
        { type: 'event', value: 'flooding', confidence: 0.95 }
      ],
      keywords: ['flooding', 'emergency', 'downtown', 'avoid'],
      urgencyScore: 0.85,
      relevanceScore: 0.92,
      misinfoFlags: [],
      isActionable: true,
      needsVerification: false,
      analyzedAt: new Date()
    },
    incidentId: 'incident-flood-001',
    isBookmarked: true,
    isArchived: false,
    notes: []
  }
];

const sampleQueries: MonitoringQuery[] = [
  {
    id: 'query-001',
    name: 'Flood Emergency Monitoring',
    incidentId: 'incident-flood-001',
    platforms: ['twitter', 'facebook', 'nextdoor'],
    keywords: ['flood', 'flooding', 'water rising', 'evacuation'],
    hashtags: ['FloodAlert', 'FloodWarning', 'FloodEmergency'],
    accounts: [],
    excludeKeywords: ['flash flood watch ended'],
    isActive: true,
    alertThreshold: {
      volumeSpike: 200,
      sentimentShift: 0.3,
      viralThreshold: 1000,
      misinfoDetection: true,
      emergencyKeywords: ['trapped', 'rescue needed', 'emergency']
    },
    collectionFrequency: 'realtime',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(),
    lastRun: new Date(),
    postsCollected: 1547
  }
];

class SocialMediaIntelService {
  private static instance: SocialMediaIntelService;
  private posts: Map<string, SocialPost> = new Map();
  private authors: Map<string, SocialAuthor> = new Map();
  private queries: Map<string, MonitoringQuery> = new Map();
  private trends: Map<string, TrendingTopic> = new Map();
  private clusters: Map<string, TopicCluster> = new Map();
  private alerts: Map<string, SocialAlert> = new Map();
  private misinfoAlerts: Map<string, MisinfoAlert> = new Map();
  private reports: Map<string, IntelligenceReport> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SocialMediaIntelService {
    if (!SocialMediaIntelService.instance) {
      SocialMediaIntelService.instance = new SocialMediaIntelService();
    }
    return SocialMediaIntelService.instance;
  }

  private initializeSampleData(): void {
    samplePosts.forEach(p => this.posts.set(p.id, p));
    sampleQueries.forEach(q => this.queries.set(q.id, q));
  }

  // ==================== Post Management ====================

  async collectPost(params: {
    platform: Platform;
    platformPostId: string;
    contentType: ContentType;
    authorId: string;
    authorUsername: string;
    authorDisplayName: string;
    authorVerified: boolean;
    authorFollowers: number;
    content: string;
    mediaUrls?: string[];
    hashtags?: string[];
    mentions?: string[];
    urls?: string[];
    location?: GeoLocation;
    language?: string;
    postedAt: Date;
    engagement: Partial<EngagementMetrics>;
    incidentId?: string;
  }): Promise<SocialPost> {
    const engagement: EngagementMetrics = {
      likes: params.engagement.likes || 0,
      shares: params.engagement.shares || 0,
      comments: params.engagement.comments || 0,
      views: params.engagement.views,
      reactions: params.engagement.reactions,
      engagementRate: params.engagement.engagementRate || 0,
      viralScore: params.engagement.viralScore || 0,
      reachEstimate: params.engagement.reachEstimate || params.authorFollowers * 0.1
    };

    const post: SocialPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      platform: params.platform,
      platformPostId: params.platformPostId,
      contentType: params.contentType,
      authorId: params.authorId,
      authorUsername: params.authorUsername,
      authorDisplayName: params.authorDisplayName,
      authorVerified: params.authorVerified,
      authorFollowers: params.authorFollowers,
      content: params.content,
      mediaUrls: params.mediaUrls || [],
      hashtags: params.hashtags || [],
      mentions: params.mentions || [],
      urls: params.urls || [],
      location: params.location,
      language: params.language || 'en',
      postedAt: params.postedAt,
      collectedAt: new Date(),
      engagement,
      analysis: await this.analyzePost(params.content, params.authorVerified, params.authorFollowers),
      incidentId: params.incidentId,
      isBookmarked: false,
      isArchived: false,
      notes: []
    };

    this.posts.set(post.id, post);

    // Check for alerts
    await this.checkAlertTriggers(post);

    return post;
  }

  private async analyzePost(content: string, authorVerified: boolean, authorFollowers: number): Promise<PostAnalysis> {
    // Simulated analysis - in production would use NLP services
    const urgencyKeywords = ['emergency', 'urgent', 'help', 'trapped', 'rescue', 'critical', 'immediately'];
    const negativeKeywords = ['flood', 'fire', 'damage', 'injured', 'dead', 'destroyed', 'evacuation'];
    const positiveKeywords = ['safe', 'rescued', 'recovered', 'helped', 'volunteer', 'donation'];

    const contentLower = content.toLowerCase();
    const hasUrgency = urgencyKeywords.some(k => contentLower.includes(k));
    const negativeCount = negativeKeywords.filter(k => contentLower.includes(k)).length;
    const positiveCount = positiveKeywords.filter(k => contentLower.includes(k)).length;

    let sentiment: SentimentType = 'neutral';
    let sentimentScore = 0;

    if (negativeCount > positiveCount) {
      sentiment = 'negative';
      sentimentScore = -0.3 * negativeCount;
    } else if (positiveCount > negativeCount) {
      sentiment = 'positive';
      sentimentScore = 0.3 * positiveCount;
    }

    const credibilityScore = authorVerified ? 0.9 : (authorFollowers > 10000 ? 0.7 : 0.5);

    return {
      sentiment,
      sentimentScore: Math.max(-1, Math.min(1, sentimentScore)),
      credibility: authorVerified ? 'verified' : (credibilityScore > 0.6 ? 'high' : 'medium'),
      credibilityScore,
      categories: this.extractCategories(content),
      entities: this.extractEntities(content),
      keywords: this.extractKeywords(content),
      urgencyScore: hasUrgency ? 0.8 : 0.3,
      relevanceScore: 0.7,
      misinfoFlags: [],
      isActionable: hasUrgency,
      needsVerification: !authorVerified && hasUrgency,
      analyzedAt: new Date()
    };
  }

  private extractCategories(content: string): string[] {
    const categories: string[] = [];
    const contentLower = content.toLowerCase();

    if (/flood|water|rain|storm/.test(contentLower)) categories.push('weather', 'flooding');
    if (/fire|burn|smoke/.test(contentLower)) categories.push('fire');
    if (/earthquake|quake|tremor/.test(contentLower)) categories.push('earthquake');
    if (/evacuat|shelter|refuge/.test(contentLower)) categories.push('evacuation');
    if (/injur|hurt|wound|dead/.test(contentLower)) categories.push('casualties');
    if (/road|traffic|highway|bridge/.test(contentLower)) categories.push('transportation');
    if (/power|electric|outage/.test(contentLower)) categories.push('utilities');

    return categories.length > 0 ? categories : ['general'];
  }

  private extractEntities(content: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];

    // Simple pattern matching - production would use NER
    const locationPattern = /(?:at|in|near|on)\s+([A-Z][a-zA-Z\s]+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Highway|Hwy)?)/g;
    let match;

    while ((match = locationPattern.exec(content)) !== null) {
      entities.push({
        type: 'location',
        value: match[1].trim(),
        confidence: 0.7
      });
    }

    return entities;
  }

  private extractKeywords(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);

    const stopwords = ['this', 'that', 'with', 'from', 'have', 'been', 'were', 'they', 'their', 'what', 'when', 'where', 'which'];
    return [...new Set(words.filter(w => !stopwords.includes(w)))].slice(0, 10);
  }

  async getPost(postId: string): Promise<SocialPost | null> {
    return this.posts.get(postId) || null;
  }

  async searchPosts(query: {
    keywords?: string[];
    hashtags?: string[];
    platforms?: Platform[];
    authors?: string[];
    location?: { lat: number; lon: number; radius: number };
    dateRange?: { start: Date; end?: Date };
    sentiment?: SentimentType[];
    credibility?: CredibilityLevel[];
    incidentId?: string;
    minEngagement?: number;
    isActionable?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<SearchResult> {
    let posts = Array.from(this.posts.values());

    if (query.keywords && query.keywords.length > 0) {
      posts = posts.filter(p =>
        query.keywords!.some(k => p.content.toLowerCase().includes(k.toLowerCase()))
      );
    }

    if (query.hashtags && query.hashtags.length > 0) {
      posts = posts.filter(p =>
        query.hashtags!.some(h => p.hashtags.map(t => t.toLowerCase()).includes(h.toLowerCase()))
      );
    }

    if (query.platforms && query.platforms.length > 0) {
      posts = posts.filter(p => query.platforms!.includes(p.platform));
    }

    if (query.authors && query.authors.length > 0) {
      posts = posts.filter(p => query.authors!.includes(p.authorUsername));
    }

    if (query.dateRange) {
      posts = posts.filter(p =>
        p.postedAt >= query.dateRange!.start &&
        (!query.dateRange!.end || p.postedAt <= query.dateRange!.end)
      );
    }

    if (query.sentiment && query.sentiment.length > 0) {
      posts = posts.filter(p => query.sentiment!.includes(p.analysis.sentiment));
    }

    if (query.credibility && query.credibility.length > 0) {
      posts = posts.filter(p => query.credibility!.includes(p.analysis.credibility));
    }

    if (query.incidentId) {
      posts = posts.filter(p => p.incidentId === query.incidentId);
    }

    if (query.minEngagement) {
      posts = posts.filter(p =>
        (p.engagement.likes + p.engagement.shares + p.engagement.comments) >= query.minEngagement!
      );
    }

    if (query.isActionable !== undefined) {
      posts = posts.filter(p => p.analysis.isActionable === query.isActionable);
    }

    // Sort by relevance and recency
    posts.sort((a, b) => {
      const scoreA = a.analysis.relevanceScore * 0.5 + a.engagement.viralScore * 0.3 + (a.analysis.isActionable ? 0.2 : 0);
      const scoreB = b.analysis.relevanceScore * 0.5 + b.engagement.viralScore * 0.3 + (b.analysis.isActionable ? 0.2 : 0);
      return scoreB - scoreA || b.postedAt.getTime() - a.postedAt.getTime();
    });

    const total = posts.length;
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    posts = posts.slice(offset, offset + limit);

    // Build result metrics
    const platformCount: Record<Platform, number> = {} as Record<Platform, number>;
    const sentimentCount: Record<SentimentType, number> = { positive: 0, negative: 0, neutral: 0, mixed: 0 };
    const hashtagCount = new Map<string, number>();
    const authorStats = new Map<string, { postCount: number; totalEngagement: number }>();
    const locationCount = new Map<string, number>();

    posts.forEach(p => {
      platformCount[p.platform] = (platformCount[p.platform] || 0) + 1;
      sentimentCount[p.analysis.sentiment]++;

      p.hashtags.forEach(h => hashtagCount.set(h, (hashtagCount.get(h) || 0) + 1));

      const stats = authorStats.get(p.authorUsername) || { postCount: 0, totalEngagement: 0 };
      stats.postCount++;
      stats.totalEngagement += p.engagement.likes + p.engagement.shares + p.engagement.comments;
      authorStats.set(p.authorUsername, stats);

      if (p.location?.city) {
        locationCount.set(p.location.city, (locationCount.get(p.location.city) || 0) + 1);
      }
    });

    return {
      posts,
      totalCount: total,
      platforms: platformCount,
      timeRange: {
        earliest: posts.length > 0 ? new Date(Math.min(...posts.map(p => p.postedAt.getTime()))) : new Date(),
        latest: posts.length > 0 ? new Date(Math.max(...posts.map(p => p.postedAt.getTime()))) : new Date()
      },
      topHashtags: Array.from(hashtagCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count })),
      topAuthors: Array.from(authorStats.entries())
        .sort((a, b) => b[1].totalEngagement - a[1].totalEngagement)
        .slice(0, 10)
        .map(([author, stats]) => ({ author, ...stats })),
      sentimentBreakdown: sentimentCount,
      locationBreakdown: Array.from(locationCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([location, count]) => ({ location, count }))
    };
  }

  async bookmarkPost(postId: string): Promise<SocialPost> {
    const post = this.posts.get(postId);
    if (!post) throw new Error(`Post not found: ${postId}`);

    post.isBookmarked = true;
    return post;
  }

  async addPostNote(postId: string, note: string): Promise<SocialPost> {
    const post = this.posts.get(postId);
    if (!post) throw new Error(`Post not found: ${postId}`);

    post.notes.push(note);
    return post;
  }

  // ==================== Monitoring Queries ====================

  async createMonitoringQuery(params: Omit<MonitoringQuery, 'id' | 'createdAt' | 'updatedAt' | 'postsCollected'>): Promise<MonitoringQuery> {
    const query: MonitoringQuery = {
      ...params,
      id: `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      postsCollected: 0
    };

    this.queries.set(query.id, query);
    return query;
  }

  async updateQuery(queryId: string, updates: Partial<MonitoringQuery>): Promise<MonitoringQuery> {
    const query = this.queries.get(queryId);
    if (!query) throw new Error(`Query not found: ${queryId}`);

    Object.assign(query, updates, { updatedAt: new Date() });
    return query;
  }

  async getQuery(queryId: string): Promise<MonitoringQuery | null> {
    return this.queries.get(queryId) || null;
  }

  async getActiveQueries(): Promise<MonitoringQuery[]> {
    return Array.from(this.queries.values()).filter(q => q.isActive);
  }

  async deleteQuery(queryId: string): Promise<boolean> {
    return this.queries.delete(queryId);
  }

  async executeQuery(queryId: string): Promise<SearchResult> {
    const query = this.queries.get(queryId);
    if (!query) throw new Error(`Query not found: ${queryId}`);

    const result = await this.searchPosts({
      keywords: query.keywords,
      hashtags: query.hashtags,
      platforms: query.platforms,
      dateRange: query.dateRange
    });

    query.lastRun = new Date();
    query.postsCollected += result.posts.length;
    query.updatedAt = new Date();

    return result;
  }

  // ==================== Trending Topics ====================

  async getTrendingTopics(params?: {
    platform?: Platform | 'all';
    location?: string;
    limit?: number;
    disasterRelatedOnly?: boolean;
  }): Promise<TrendingTopic[]> {
    let trends = Array.from(this.trends.values());

    if (params?.platform && params.platform !== 'all') {
      trends = trends.filter(t => t.platform === params.platform || t.platform === 'all');
    }

    if (params?.location) {
      trends = trends.filter(t =>
        t.geographicFocus?.some(g => g.toLowerCase().includes(params.location!.toLowerCase()))
      );
    }

    if (params?.disasterRelatedOnly) {
      trends = trends.filter(t => t.isDisasterRelated);
    }

    return trends
      .sort((a, b) => b.velocity - a.velocity)
      .slice(0, params?.limit || 20);
  }

  async trackTrend(params: {
    topic: string;
    hashtags: string[];
    platform: Platform | 'all';
    isDisasterRelated: boolean;
    incidentId?: string;
  }): Promise<TrendingTopic> {
    const trend: TrendingTopic = {
      id: `trend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      topic: params.topic,
      hashtags: params.hashtags,
      keywords: params.topic.toLowerCase().split(/\s+/),
      platform: params.platform,
      volume: 0,
      volumeChange: 0,
      velocity: 0,
      status: 'emerging',
      sentiment: 'neutral',
      samplePosts: [],
      relatedTopics: [],
      firstSeen: new Date(),
      lastUpdated: new Date(),
      isDisasterRelated: params.isDisasterRelated,
      incidentId: params.incidentId
    };

    this.trends.set(trend.id, trend);
    return trend;
  }

  async updateTrendMetrics(trendId: string, metrics: { volume: number; sentiment: SentimentType }): Promise<TrendingTopic> {
    const trend = this.trends.get(trendId);
    if (!trend) throw new Error(`Trend not found: ${trendId}`);

    const volumeChange = trend.volume > 0 ? ((metrics.volume - trend.volume) / trend.volume) * 100 : 100;

    trend.volumeChange = volumeChange;
    trend.volume = metrics.volume;
    trend.sentiment = metrics.sentiment;
    trend.velocity = volumeChange / ((Date.now() - trend.lastUpdated.getTime()) / (60 * 60 * 1000)); // per hour
    trend.lastUpdated = new Date();

    // Update status based on velocity
    if (trend.velocity > 50) {
      trend.status = 'rising';
    } else if (trend.velocity < -20) {
      trend.status = 'declining';
    } else if (trend.volume > (trend.peakTime ? 0 : trend.volume)) {
      trend.status = 'peaked';
      trend.peakTime = new Date();
    } else {
      trend.status = 'stable';
    }

    return trend;
  }

  // ==================== Alert Management ====================

  private async checkAlertTriggers(post: SocialPost): Promise<void> {
    const activeQueries = await this.getActiveQueries();

    for (const query of activeQueries) {
      if (!query.alertThreshold) continue;

      // Check emergency keywords
      if (query.alertThreshold.emergencyKeywords.some(k =>
        post.content.toLowerCase().includes(k.toLowerCase())
      )) {
        await this.createAlert({
          type: 'emergency_keyword',
          priority: 'high',
          title: 'Emergency keyword detected',
          description: `Post contains emergency keyword matching query "${query.name}"`,
          queryId: query.id,
          incidentId: post.incidentId,
          relatedPosts: [post.id]
        });
      }

      // Check viral threshold
      if (post.engagement.viralScore >= query.alertThreshold.viralThreshold) {
        await this.createAlert({
          type: 'viral_content',
          priority: 'medium',
          title: 'Viral content detected',
          description: `Post has reached viral threshold (score: ${post.engagement.viralScore})`,
          queryId: query.id,
          incidentId: post.incidentId,
          relatedPosts: [post.id]
        });
      }

      // Check misinformation
      if (query.alertThreshold.misinfoDetection && post.analysis.misinfoFlags.length > 0) {
        await this.createAlert({
          type: 'misinfo_detected',
          priority: 'high',
          title: 'Potential misinformation detected',
          description: `Post flagged for: ${post.analysis.misinfoFlags.map(f => f.type).join(', ')}`,
          queryId: query.id,
          incidentId: post.incidentId,
          relatedPosts: [post.id]
        });
      }
    }
  }

  async createAlert(params: {
    type: SocialAlert['type'];
    priority: AlertPriority;
    title: string;
    description: string;
    queryId?: string;
    incidentId?: string;
    triggerData?: Record<string, any>;
    relatedPosts: string[];
  }): Promise<SocialAlert> {
    const alert: SocialAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      priority: params.priority,
      title: params.title,
      description: params.description,
      queryId: params.queryId,
      incidentId: params.incidentId,
      triggerData: params.triggerData || {},
      relatedPosts: params.relatedPosts,
      createdAt: new Date(),
      resolved: false
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  async getAlerts(params?: {
    type?: SocialAlert['type'];
    priority?: AlertPriority;
    incidentId?: string;
    unresolved?: boolean;
  }): Promise<SocialAlert[]> {
    let alerts = Array.from(this.alerts.values());

    if (params?.type) {
      alerts = alerts.filter(a => a.type === params.type);
    }

    if (params?.priority) {
      alerts = alerts.filter(a => a.priority === params.priority);
    }

    if (params?.incidentId) {
      alerts = alerts.filter(a => a.incidentId === params.incidentId);
    }

    if (params?.unresolved) {
      alerts = alerts.filter(a => !a.resolved);
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority] || b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<SocialAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;
    return alert;
  }

  async resolveAlert(alertId: string): Promise<SocialAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.resolved = true;
    alert.resolvedAt = new Date();
    return alert;
  }

  // ==================== Misinformation Management ====================

  async flagMisinformation(postId: string, flag: MisinfoFlag): Promise<SocialPost> {
    const post = this.posts.get(postId);
    if (!post) throw new Error(`Post not found: ${postId}`);

    post.analysis.misinfoFlags.push(flag);
    post.analysis.credibility = 'suspected_misinfo';
    post.analysis.needsVerification = true;

    return post;
  }

  async createMisinfoAlert(params: {
    title: string;
    description: string;
    category: MisinfoFlag['type'];
    severity: AlertPriority;
    incidentId?: string;
    affectedPosts: string[];
    factCheck?: MisinfoAlert['factCheck'];
  }): Promise<MisinfoAlert> {
    const posts = params.affectedPosts
      .map(id => this.posts.get(id))
      .filter((p): p is SocialPost => p !== undefined);

    const platforms = [...new Set(posts.map(p => p.platform))];
    const totalReach = posts.reduce((sum, p) => sum + p.engagement.reachEstimate, 0);

    const alert: MisinfoAlert = {
      id: `misinfo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      title: params.title,
      description: params.description,
      category: params.category,
      severity: params.severity,
      affectedPosts: params.affectedPosts,
      spreadMetrics: {
        postsCount: posts.length,
        totalReach,
        platforms,
        firstSeen: posts.length > 0 ? new Date(Math.min(...posts.map(p => p.postedAt.getTime()))) : new Date(),
        peakSpread: new Date()
      },
      factCheck: params.factCheck,
      countermeasures: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.misinfoAlerts.set(alert.id, alert);
    return alert;
  }

  async getMisinfoAlerts(incidentId?: string): Promise<MisinfoAlert[]> {
    let alerts = Array.from(this.misinfoAlerts.values());

    if (incidentId) {
      alerts = alerts.filter(a => a.incidentId === incidentId);
    }

    return alerts.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.severity] - priorityOrder[b.severity];
    });
  }

  // ==================== Intelligence Reports ====================

  async generateReport(params: {
    incidentId: string;
    reportType: IntelligenceReport['reportType'];
    period: { start: Date; end: Date };
    generatedBy: string;
  }): Promise<IntelligenceReport> {
    const searchResult = await this.searchPosts({
      incidentId: params.incidentId,
      dateRange: params.period
    });

    const trends = await this.getTrendingTopics({ disasterRelatedOnly: true });
    const misinfoAlerts = await this.getMisinfoAlerts(params.incidentId);

    // Calculate metrics
    const totalEngagement = searchResult.posts.reduce((sum, p) =>
      sum + p.engagement.likes + p.engagement.shares + p.engagement.comments, 0
    );
    const reachEstimate = searchResult.posts.reduce((sum, p) => sum + p.engagement.reachEstimate, 0);

    // Generate sentiment over time
    const sentimentOverTime: ReportMetrics['sentimentOverTime'] = [];
    const hourlyBuckets = new Map<number, { sentiment: number; count: number }>();

    searchResult.posts.forEach(p => {
      const hour = Math.floor(p.postedAt.getTime() / (60 * 60 * 1000));
      const bucket = hourlyBuckets.get(hour) || { sentiment: 0, count: 0 };
      bucket.sentiment += p.analysis.sentimentScore;
      bucket.count++;
      hourlyBuckets.set(hour, bucket);
    });

    hourlyBuckets.forEach((bucket, hour) => {
      const avgSentiment = bucket.sentiment / bucket.count;
      sentimentOverTime.push({
        timestamp: new Date(hour * 60 * 60 * 1000),
        sentiment: avgSentiment > 0.2 ? 'positive' : avgSentiment < -0.2 ? 'negative' : 'neutral',
        score: avgSentiment
      });
    });

    // Key findings
    const keyFindings: string[] = [];
    if (searchResult.posts.length > 100) {
      keyFindings.push(`High social media activity with ${searchResult.posts.length} posts collected`);
    }
    if (searchResult.sentimentBreakdown.negative > searchResult.sentimentBreakdown.positive) {
      keyFindings.push('Overall negative sentiment dominates the conversation');
    }
    if (misinfoAlerts.filter(a => a.status === 'active').length > 0) {
      keyFindings.push(`${misinfoAlerts.filter(a => a.status === 'active').length} active misinformation alerts require attention`);
    }

    const report: IntelligenceReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      title: `${params.reportType.charAt(0).toUpperCase() + params.reportType.slice(1)} Report - ${params.incidentId}`,
      reportType: params.reportType,
      period: params.period,
      summary: `Social media intelligence report covering ${searchResult.posts.length} posts across ${Object.keys(searchResult.platforms).length} platforms.`,
      keyFindings,
      metrics: {
        totalPosts: searchResult.posts.length,
        uniqueAuthors: searchResult.topAuthors.length,
        totalEngagement,
        reachEstimate,
        platformBreakdown: searchResult.platforms,
        sentimentOverTime,
        topLocations: searchResult.locationBreakdown,
        volumeTimeline: [] // Would be populated from time-series data
      },
      trends: trends.filter(t => t.incidentId === params.incidentId),
      topPosts: searchResult.posts.slice(0, 10),
      misinformationAlerts: misinfoAlerts,
      recommendations: this.generateRecommendations(searchResult, misinfoAlerts),
      attachments: [],
      generatedAt: new Date(),
      generatedBy: params.generatedBy
    };

    this.reports.set(report.id, report);
    return report;
  }

  private generateRecommendations(searchResult: SearchResult, misinfoAlerts: MisinfoAlert[]): string[] {
    const recommendations: string[] = [];

    if (misinfoAlerts.filter(a => a.status === 'active').length > 0) {
      recommendations.push('Prioritize addressing active misinformation to prevent further spread');
    }

    if (searchResult.posts.filter(p => p.analysis.needsVerification).length > 10) {
      recommendations.push('Increase verification resources - multiple posts require fact-checking');
    }

    if (searchResult.topAuthors.some(a => a.totalEngagement > 10000)) {
      recommendations.push('Consider engaging influential accounts for official messaging amplification');
    }

    recommendations.push('Continue monitoring trending topics for emerging narratives');

    return recommendations;
  }

  async getReports(incidentId?: string): Promise<IntelligenceReport[]> {
    let reports = Array.from(this.reports.values());

    if (incidentId) {
      reports = reports.filter(r => r.incidentId === incidentId);
    }

    return reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalPosts: number;
    totalAuthors: number;
    platformBreakdown: Record<Platform, number>;
    sentimentBreakdown: Record<SentimentType, number>;
    activeQueries: number;
    activeAlerts: number;
    activeMisinfoAlerts: number;
    postsNeedingVerification: number;
  }> {
    let posts = Array.from(this.posts.values());

    if (incidentId) {
      posts = posts.filter(p => p.incidentId === incidentId);
    }

    const platformBreakdown: Record<Platform, number> = {} as Record<Platform, number>;
    const sentimentBreakdown: Record<SentimentType, number> = { positive: 0, negative: 0, neutral: 0, mixed: 0 };
    const authors = new Set<string>();

    posts.forEach(p => {
      platformBreakdown[p.platform] = (platformBreakdown[p.platform] || 0) + 1;
      sentimentBreakdown[p.analysis.sentiment]++;
      authors.add(p.authorId);
    });

    const alerts = await this.getAlerts({ unresolved: true });
    const misinfoAlerts = await this.getMisinfoAlerts(incidentId);

    return {
      totalPosts: posts.length,
      totalAuthors: authors.size,
      platformBreakdown,
      sentimentBreakdown,
      activeQueries: (await this.getActiveQueries()).length,
      activeAlerts: alerts.length,
      activeMisinfoAlerts: misinfoAlerts.filter(a => a.status === 'active').length,
      postsNeedingVerification: posts.filter(p => p.analysis.needsVerification).length
    };
  }
}

export const socialMediaIntelService = SocialMediaIntelService.getInstance();
export default SocialMediaIntelService;

/**
 * Alert History Service
 * Comprehensive historical alert data management and analysis
 */

// Alert types
type AlertType = 
  | 'flood'
  | 'fire'
  | 'earthquake'
  | 'cyclone'
  | 'landslide'
  | 'tsunami'
  | 'heatwave'
  | 'coldwave'
  | 'drought'
  | 'storm'
  | 'volcanic'
  | 'industrial'
  | 'biological'
  | 'nuclear';

// Alert severity
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Alert status
type AlertStatus = 'active' | 'resolved' | 'expired' | 'cancelled' | 'upgraded' | 'downgraded';

// Historical alert record
interface HistoricalAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  location: AlertLocation;
  affectedArea: AffectedArea;
  timeline: AlertTimeline;
  source: AlertSource;
  status: AlertStatus;
  impact: AlertImpact;
  response: AlertResponse;
  updates: AlertUpdate[];
  relatedAlerts: string[];
  tags: string[];
  metadata: Record<string, unknown>;
}

// Alert location
interface AlertLocation {
  name: string;
  coordinates: { lat: number; lng: number };
  district: string;
  state: string;
  country: string;
  pincode?: string;
}

// Affected area
interface AffectedArea {
  radiusKm: number;
  polygon?: { lat: number; lng: number }[];
  districts: string[];
  estimatedPopulation: number;
  zones: string[];
}

// Alert timeline
interface AlertTimeline {
  issuedAt: Date;
  effectiveFrom: Date;
  effectiveTo?: Date;
  resolvedAt?: Date;
  cancelledAt?: Date;
  lastUpdatedAt: Date;
  acknowledgedAt?: Date;
  responseStartedAt?: Date;
}

// Alert source
interface AlertSource {
  name: string;
  type: 'government' | 'weather_service' | 'seismic_agency' | 'local_authority' | 'automated' | 'crowdsourced';
  reliability: number; // 0-1
  officialId?: string;
  url?: string;
}

// Alert impact
interface AlertImpact {
  casualties: {
    injured: number;
    missing: number;
    deceased: number;
    rescued: number;
  };
  displacement: {
    evacuated: number;
    sheltered: number;
    stranded: number;
  };
  infrastructure: {
    roadsAffected: number;
    bridgesDamaged: number;
    buildingsCollapsed: number;
    powerOutages: number;
  };
  economic: {
    estimatedDamage: number; // in INR
    cropLoss: number;
    livestockLoss: number;
  };
}

// Alert response
interface AlertResponse {
  teams: ResponseTeam[];
  resources: DeployedResource[];
  shelters: ActivatedShelter[];
  evacuationRoutes: string[];
  commandCenter?: string;
  coordinationLevel: 'local' | 'district' | 'state' | 'national';
}

// Response team
interface ResponseTeam {
  id: string;
  name: string;
  type: 'ndrf' | 'sdrf' | 'fire' | 'police' | 'medical' | 'volunteer';
  personnel: number;
  deployedAt: Date;
  status: 'deployed' | 'active' | 'returning' | 'standby';
}

// Deployed resource
interface DeployedResource {
  type: string;
  quantity: number;
  unit: string;
  deployedAt: Date;
}

// Activated shelter
interface ActivatedShelter {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
}

// Alert update
interface AlertUpdate {
  id: string;
  timestamp: Date;
  type: 'severity_change' | 'area_update' | 'status_change' | 'impact_update' | 'response_update' | 'general';
  title: string;
  description: string;
  author: string;
  previousValue?: unknown;
  newValue?: unknown;
}

// Search filters
interface AlertSearchFilters {
  types?: AlertType[];
  severities?: AlertSeverity[];
  statuses?: AlertStatus[];
  dateRange?: { start: Date; end: Date };
  location?: {
    coordinates?: { lat: number; lng: number };
    radiusKm?: number;
    states?: string[];
    districts?: string[];
  };
  impactThreshold?: {
    minCasualties?: number;
    minDisplaced?: number;
    minDamage?: number;
  };
  tags?: string[];
  sources?: string[];
  searchText?: string;
}

// Search result
interface AlertSearchResult {
  alerts: HistoricalAlert[];
  total: number;
  page: number;
  pageSize: number;
  facets: SearchFacets;
}

// Search facets
interface SearchFacets {
  byType: { type: AlertType; count: number }[];
  bySeverity: { severity: AlertSeverity; count: number }[];
  byStatus: { status: AlertStatus; count: number }[];
  byState: { state: string; count: number }[];
  byYear: { year: number; count: number }[];
}

// Analytics summary
interface AlertAnalyticsSummary {
  totalAlerts: number;
  byType: Record<AlertType, number>;
  bySeverity: Record<AlertSeverity, number>;
  byMonth: { month: string; count: number }[];
  avgResponseTime: number;
  totalImpact: {
    casualties: number;
    displaced: number;
    economicDamage: number;
  };
  trends: AlertTrend[];
}

// Alert trend
interface AlertTrend {
  metric: string;
  period: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
  prediction: number;
}

// Comparison data
interface AlertComparison {
  alert1: HistoricalAlert;
  alert2: HistoricalAlert;
  similarities: string[];
  differences: ComparisonDifference[];
  impactComparison: {
    metric: string;
    alert1Value: number;
    alert2Value: number;
    difference: number;
  }[];
}

// Comparison difference
interface ComparisonDifference {
  field: string;
  alert1Value: unknown;
  alert2Value: unknown;
}

// Timeline event
interface TimelineEvent {
  id: string;
  alertId: string;
  timestamp: Date;
  type: string;
  title: string;
  description: string;
  severity?: AlertSeverity;
}

// Generate sample historical data
const generateHistoricalAlerts = (count: number): HistoricalAlert[] => {
  const types: AlertType[] = ['flood', 'fire', 'earthquake', 'cyclone', 'landslide', 'tsunami', 'heatwave', 'storm'];
  const severities: AlertSeverity[] = ['critical', 'high', 'medium', 'low'];
  const statuses: AlertStatus[] = ['resolved', 'expired'];
  const states = ['Kerala', 'Maharashtra', 'Tamil Nadu', 'West Bengal', 'Odisha', 'Gujarat', 'Assam', 'Uttarakhand'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const daysAgo = Math.floor(Math.random() * 365 * 3); // Last 3 years
    const issuedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const resolvedAt = new Date(issuedAt.getTime() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000);

    return {
      id: `HIST-${String(i + 1).padStart(6, '0')}`,
      type,
      severity,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Alert - ${state}`,
      description: `Historical ${type} event affecting ${state} region. This alert was issued based on meteorological and ground observations.`,
      location: {
        name: `${state} Region ${Math.floor(Math.random() * 10) + 1}`,
        coordinates: { lat: 10 + Math.random() * 20, lng: 72 + Math.random() * 15 },
        district: `District ${Math.floor(Math.random() * 20) + 1}`,
        state,
        country: 'India',
      },
      affectedArea: {
        radiusKm: 10 + Math.floor(Math.random() * 50),
        districts: [`District ${Math.floor(Math.random() * 10) + 1}`, `District ${Math.floor(Math.random() * 10) + 11}`],
        estimatedPopulation: 10000 + Math.floor(Math.random() * 100000),
        zones: ['Zone A', 'Zone B'],
      },
      timeline: {
        issuedAt,
        effectiveFrom: issuedAt,
        effectiveTo: resolvedAt,
        resolvedAt,
        lastUpdatedAt: resolvedAt,
        acknowledgedAt: new Date(issuedAt.getTime() + 30 * 60 * 1000),
        responseStartedAt: new Date(issuedAt.getTime() + 60 * 60 * 1000),
      },
      source: {
        name: ['IMD', 'NDMA', 'SDMA', 'Local Authority'][Math.floor(Math.random() * 4)],
        type: ['government', 'weather_service', 'local_authority'][Math.floor(Math.random() * 3)] as AlertSource['type'],
        reliability: 0.8 + Math.random() * 0.2,
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      impact: {
        casualties: {
          injured: Math.floor(Math.random() * 100),
          missing: Math.floor(Math.random() * 20),
          deceased: Math.floor(Math.random() * 10),
          rescued: Math.floor(Math.random() * 200),
        },
        displacement: {
          evacuated: Math.floor(Math.random() * 5000),
          sheltered: Math.floor(Math.random() * 3000),
          stranded: Math.floor(Math.random() * 500),
        },
        infrastructure: {
          roadsAffected: Math.floor(Math.random() * 50),
          bridgesDamaged: Math.floor(Math.random() * 10),
          buildingsCollapsed: Math.floor(Math.random() * 30),
          powerOutages: Math.floor(Math.random() * 20),
        },
        economic: {
          estimatedDamage: Math.floor(Math.random() * 10000000000),
          cropLoss: Math.floor(Math.random() * 1000000000),
          livestockLoss: Math.floor(Math.random() * 100000000),
        },
      },
      response: {
        teams: [
          {
            id: `team-${i}-1`,
            name: 'NDRF Team',
            type: 'ndrf',
            personnel: 50 + Math.floor(Math.random() * 100),
            deployedAt: new Date(issuedAt.getTime() + 2 * 60 * 60 * 1000),
            status: 'returning',
          },
        ],
        resources: [
          { type: 'Rescue Boats', quantity: 10 + Math.floor(Math.random() * 20), unit: 'units', deployedAt: issuedAt },
          { type: 'Relief Kits', quantity: 1000 + Math.floor(Math.random() * 5000), unit: 'kits', deployedAt: issuedAt },
        ],
        shelters: [
          { id: 'sh-1', name: 'Relief Camp 1', capacity: 500, occupancy: Math.floor(Math.random() * 500) },
        ],
        evacuationRoutes: ['Route A', 'Route B'],
        coordinationLevel: ['local', 'district', 'state'][Math.floor(Math.random() * 3)] as 'local' | 'district' | 'state',
      },
      updates: [
        {
          id: `upd-${i}-1`,
          timestamp: new Date(issuedAt.getTime() + 6 * 60 * 60 * 1000),
          type: 'impact_update',
          title: 'Impact Assessment Update',
          description: 'Initial damage assessment completed.',
          author: 'District EOC',
        },
      ],
      relatedAlerts: [],
      tags: [type, state, severity, `year-${issuedAt.getFullYear()}`],
      metadata: {
        weatherConditions: type === 'flood' ? 'Heavy rainfall' : type === 'cyclone' ? 'High winds' : 'Normal',
      },
    };
  });
};

class AlertHistoryService {
  private static instance: AlertHistoryService;
  private alerts: Map<string, HistoricalAlert> = new Map();
  private listeners: ((alerts: HistoricalAlert[]) => void)[] = [];

  private constructor() {
    this.initializeHistoricalData();
  }

  public static getInstance(): AlertHistoryService {
    if (!AlertHistoryService.instance) {
      AlertHistoryService.instance = new AlertHistoryService();
    }
    return AlertHistoryService.instance;
  }

  /**
   * Initialize historical data
   */
  private initializeHistoricalData(): void {
    const historicalAlerts = generateHistoricalAlerts(500);
    historicalAlerts.forEach((alert) => {
      this.alerts.set(alert.id, alert);
    });
  }

  /**
   * Search alerts
   */
  public async searchAlerts(
    filters: AlertSearchFilters,
    page: number = 1,
    pageSize: number = 20,
    sortBy: 'date' | 'severity' | 'impact' = 'date',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<AlertSearchResult> {
    let results = Array.from(this.alerts.values());

    // Apply filters
    if (filters.types?.length) {
      results = results.filter((a) => filters.types!.includes(a.type));
    }

    if (filters.severities?.length) {
      results = results.filter((a) => filters.severities!.includes(a.severity));
    }

    if (filters.statuses?.length) {
      results = results.filter((a) => filters.statuses!.includes(a.status));
    }

    if (filters.dateRange) {
      results = results.filter((a) => {
        const date = a.timeline.issuedAt;
        return date >= filters.dateRange!.start && date <= filters.dateRange!.end;
      });
    }

    if (filters.location?.states?.length) {
      results = results.filter((a) => filters.location!.states!.includes(a.location.state));
    }

    if (filters.location?.districts?.length) {
      results = results.filter((a) => filters.location!.districts!.includes(a.location.district));
    }

    if (filters.location?.coordinates && filters.location.radiusKm) {
      const { coordinates, radiusKm } = filters.location;
      results = results.filter((a) => {
        const distance = this.calculateDistance(
          coordinates.lat,
          coordinates.lng,
          a.location.coordinates.lat,
          a.location.coordinates.lng
        );
        return distance <= radiusKm;
      });
    }

    if (filters.impactThreshold?.minCasualties) {
      results = results.filter((a) => {
        const total = a.impact.casualties.injured + a.impact.casualties.deceased;
        return total >= filters.impactThreshold!.minCasualties!;
      });
    }

    if (filters.tags?.length) {
      results = results.filter((a) => filters.tags!.some((tag) => a.tags.includes(tag)));
    }

    if (filters.searchText) {
      const search = filters.searchText.toLowerCase();
      results = results.filter((a) =>
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        a.location.name.toLowerCase().includes(search)
      );
    }

    // Calculate facets
    const facets = this.calculateFacets(results);

    // Sort
    results = this.sortAlerts(results, sortBy, sortOrder);

    // Paginate
    const total = results.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    return {
      alerts: paginatedResults,
      total,
      page,
      pageSize,
      facets,
    };
  }

  /**
   * Calculate facets
   */
  private calculateFacets(alerts: HistoricalAlert[]): SearchFacets {
    const byType = new Map<AlertType, number>();
    const bySeverity = new Map<AlertSeverity, number>();
    const byStatus = new Map<AlertStatus, number>();
    const byState = new Map<string, number>();
    const byYear = new Map<number, number>();

    alerts.forEach((alert) => {
      byType.set(alert.type, (byType.get(alert.type) || 0) + 1);
      bySeverity.set(alert.severity, (bySeverity.get(alert.severity) || 0) + 1);
      byStatus.set(alert.status, (byStatus.get(alert.status) || 0) + 1);
      byState.set(alert.location.state, (byState.get(alert.location.state) || 0) + 1);
      const year = alert.timeline.issuedAt.getFullYear();
      byYear.set(year, (byYear.get(year) || 0) + 1);
    });

    return {
      byType: Array.from(byType.entries()).map(([type, count]) => ({ type, count })),
      bySeverity: Array.from(bySeverity.entries()).map(([severity, count]) => ({ severity, count })),
      byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count })),
      byState: Array.from(byState.entries()).map(([state, count]) => ({ state, count })).sort((a, b) => b.count - a.count),
      byYear: Array.from(byYear.entries()).map(([year, count]) => ({ year, count })).sort((a, b) => b.year - a.year),
    };
  }

  /**
   * Sort alerts
   */
  private sortAlerts(
    alerts: HistoricalAlert[],
    sortBy: 'date' | 'severity' | 'impact',
    sortOrder: 'asc' | 'desc'
  ): HistoricalAlert[] {
    const severityOrder: Record<AlertSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    return [...alerts].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return multiplier * (a.timeline.issuedAt.getTime() - b.timeline.issuedAt.getTime());
        case 'severity':
          return multiplier * (severityOrder[a.severity] - severityOrder[b.severity]);
        case 'impact':
          const impactA = a.impact.casualties.injured + a.impact.casualties.deceased + a.impact.displacement.evacuated;
          const impactB = b.impact.casualties.injured + b.impact.casualties.deceased + b.impact.displacement.evacuated;
          return multiplier * (impactA - impactB);
        default:
          return 0;
      }
    });
  }

  /**
   * Get alert by ID
   */
  public getAlert(alertId: string): HistoricalAlert | undefined {
    return this.alerts.get(alertId);
  }

  /**
   * Get alerts by type
   */
  public getAlertsByType(type: AlertType, limit?: number): HistoricalAlert[] {
    const alerts = Array.from(this.alerts.values())
      .filter((a) => a.type === type)
      .sort((a, b) => b.timeline.issuedAt.getTime() - a.timeline.issuedAt.getTime());
    return limit ? alerts.slice(0, limit) : alerts;
  }

  /**
   * Get alerts by location
   */
  public getAlertsByLocation(state: string, district?: string): HistoricalAlert[] {
    return Array.from(this.alerts.values()).filter((a) => {
      if (district) {
        return a.location.state === state && a.location.district === district;
      }
      return a.location.state === state;
    });
  }

  /**
   * Get analytics summary
   */
  public getAnalyticsSummary(dateRange?: { start: Date; end: Date }): AlertAnalyticsSummary {
    let alerts = Array.from(this.alerts.values());

    if (dateRange) {
      alerts = alerts.filter((a) => {
        const date = a.timeline.issuedAt;
        return date >= dateRange.start && date <= dateRange.end;
      });
    }

    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byMonthMap = new Map<string, number>();
    let totalResponseTime = 0;
    let responseTimeCount = 0;
    let totalCasualties = 0;
    let totalDisplaced = 0;
    let totalDamage = 0;

    alerts.forEach((alert) => {
      byType[alert.type] = (byType[alert.type] || 0) + 1;
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;

      const monthKey = `${alert.timeline.issuedAt.getFullYear()}-${String(alert.timeline.issuedAt.getMonth() + 1).padStart(2, '0')}`;
      byMonthMap.set(monthKey, (byMonthMap.get(monthKey) || 0) + 1);

      if (alert.timeline.acknowledgedAt && alert.timeline.issuedAt) {
        const responseTime = alert.timeline.acknowledgedAt.getTime() - alert.timeline.issuedAt.getTime();
        totalResponseTime += responseTime;
        responseTimeCount++;
      }

      totalCasualties += alert.impact.casualties.injured + alert.impact.casualties.deceased;
      totalDisplaced += alert.impact.displacement.evacuated + alert.impact.displacement.sheltered;
      totalDamage += alert.impact.economic.estimatedDamage;
    });

    const byMonth = Array.from(byMonthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalAlerts: alerts.length,
      byType: byType as Record<AlertType, number>,
      bySeverity: bySeverity as Record<AlertSeverity, number>,
      byMonth,
      avgResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount / 60000 : 0, // minutes
      totalImpact: {
        casualties: totalCasualties,
        displaced: totalDisplaced,
        economicDamage: totalDamage,
      },
      trends: this.calculateTrends(alerts),
    };
  }

  /**
   * Calculate trends
   */
  private calculateTrends(alerts: HistoricalAlert[]): AlertTrend[] {
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());

    const lastYearAlerts = alerts.filter((a) => a.timeline.issuedAt >= lastYear);
    const previousYearAlerts = alerts.filter((a) => a.timeline.issuedAt >= twoYearsAgo && a.timeline.issuedAt < lastYear);

    const alertChange = previousYearAlerts.length > 0
      ? ((lastYearAlerts.length - previousYearAlerts.length) / previousYearAlerts.length) * 100
      : 0;

    return [
      {
        metric: 'Total Alerts',
        period: 'Year over Year',
        trend: alertChange > 5 ? 'increasing' : alertChange < -5 ? 'decreasing' : 'stable',
        changePercent: Math.round(alertChange * 10) / 10,
        prediction: Math.round(lastYearAlerts.length * (1 + alertChange / 100)),
      },
    ];
  }

  /**
   * Compare alerts
   */
  public compareAlerts(alertId1: string, alertId2: string): AlertComparison | null {
    const alert1 = this.alerts.get(alertId1);
    const alert2 = this.alerts.get(alertId2);

    if (!alert1 || !alert2) return null;

    const similarities: string[] = [];
    const differences: ComparisonDifference[] = [];

    // Check similarities
    if (alert1.type === alert2.type) similarities.push(`Same disaster type: ${alert1.type}`);
    if (alert1.severity === alert2.severity) similarities.push(`Same severity: ${alert1.severity}`);
    if (alert1.location.state === alert2.location.state) similarities.push(`Same state: ${alert1.location.state}`);

    // Check differences
    if (alert1.type !== alert2.type) {
      differences.push({ field: 'Type', alert1Value: alert1.type, alert2Value: alert2.type });
    }
    if (alert1.severity !== alert2.severity) {
      differences.push({ field: 'Severity', alert1Value: alert1.severity, alert2Value: alert2.severity });
    }

    const impactComparison = [
      { metric: 'Casualties', alert1Value: alert1.impact.casualties.injured + alert1.impact.casualties.deceased, alert2Value: alert2.impact.casualties.injured + alert2.impact.casualties.deceased, difference: 0 },
      { metric: 'Displaced', alert1Value: alert1.impact.displacement.evacuated, alert2Value: alert2.impact.displacement.evacuated, difference: 0 },
      { metric: 'Economic Damage', alert1Value: alert1.impact.economic.estimatedDamage, alert2Value: alert2.impact.economic.estimatedDamage, difference: 0 },
    ];

    impactComparison.forEach((item) => {
      item.difference = item.alert1Value - item.alert2Value;
    });

    return { alert1, alert2, similarities, differences, impactComparison };
  }

  /**
   * Get timeline
   */
  public getTimeline(alertId: string): TimelineEvent[] {
    const alert = this.alerts.get(alertId);
    if (!alert) return [];

    const events: TimelineEvent[] = [
      {
        id: `${alertId}-issued`,
        alertId,
        timestamp: alert.timeline.issuedAt,
        type: 'issued',
        title: 'Alert Issued',
        description: `${alert.type.toUpperCase()} alert issued for ${alert.location.name}`,
        severity: alert.severity,
      },
    ];

    if (alert.timeline.acknowledgedAt) {
      events.push({
        id: `${alertId}-ack`,
        alertId,
        timestamp: alert.timeline.acknowledgedAt,
        type: 'acknowledged',
        title: 'Alert Acknowledged',
        description: 'Alert acknowledged by emergency response team',
      });
    }

    if (alert.timeline.responseStartedAt) {
      events.push({
        id: `${alertId}-response`,
        alertId,
        timestamp: alert.timeline.responseStartedAt,
        type: 'response_started',
        title: 'Response Initiated',
        description: 'Emergency response operations commenced',
      });
    }

    alert.updates.forEach((update) => {
      events.push({
        id: update.id,
        alertId,
        timestamp: update.timestamp,
        type: update.type,
        title: update.title,
        description: update.description,
      });
    });

    if (alert.timeline.resolvedAt) {
      events.push({
        id: `${alertId}-resolved`,
        alertId,
        timestamp: alert.timeline.resolvedAt,
        type: 'resolved',
        title: 'Alert Resolved',
        description: 'Situation normalized, alert closed',
      });
    }

    return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get similar alerts
   */
  public getSimilarAlerts(alertId: string, limit: number = 5): HistoricalAlert[] {
    const sourceAlert = this.alerts.get(alertId);
    if (!sourceAlert) return [];

    return Array.from(this.alerts.values())
      .filter((a) => a.id !== alertId)
      .map((alert) => ({
        alert,
        score: this.calculateSimilarityScore(sourceAlert, alert),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.alert);
  }

  /**
   * Calculate similarity score
   */
  private calculateSimilarityScore(alert1: HistoricalAlert, alert2: HistoricalAlert): number {
    let score = 0;

    if (alert1.type === alert2.type) score += 30;
    if (alert1.severity === alert2.severity) score += 15;
    if (alert1.location.state === alert2.location.state) score += 20;
    if (alert1.location.district === alert2.location.district) score += 10;

    // Location proximity
    const distance = this.calculateDistance(
      alert1.location.coordinates.lat,
      alert1.location.coordinates.lng,
      alert2.location.coordinates.lat,
      alert2.location.coordinates.lng
    );
    if (distance < 50) score += 15;
    else if (distance < 100) score += 10;
    else if (distance < 200) score += 5;

    // Time proximity (within same season)
    const month1 = alert1.timeline.issuedAt.getMonth();
    const month2 = alert2.timeline.issuedAt.getMonth();
    if (Math.abs(month1 - month2) <= 1) score += 10;

    return score;
  }

  /**
   * Calculate distance between coordinates
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Export history
   */
  public exportHistory(filters?: AlertSearchFilters): string {
    let alerts = Array.from(this.alerts.values());

    if (filters?.dateRange) {
      alerts = alerts.filter((a) => {
        const date = a.timeline.issuedAt;
        return date >= filters.dateRange!.start && date <= filters.dateRange!.end;
      });
    }

    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      totalRecords: alerts.length,
      alerts,
    }, null, 2);
  }

  /**
   * Archive alert
   */
  public archiveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;
    
    alert.status = 'expired';
    alert.tags.push('archived');
    return true;
  }

  /**
   * Subscribe to updates
   */
  public subscribe(callback: (alerts: HistoricalAlert[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }
}

export const alertHistoryService = AlertHistoryService.getInstance();
export type {
  AlertType,
  AlertSeverity,
  AlertStatus,
  HistoricalAlert,
  AlertLocation,
  AffectedArea,
  AlertTimeline,
  AlertSource,
  AlertImpact,
  AlertResponse,
  ResponseTeam,
  DeployedResource,
  ActivatedShelter,
  AlertUpdate,
  AlertSearchFilters,
  AlertSearchResult,
  SearchFacets,
  AlertAnalyticsSummary,
  AlertTrend,
  AlertComparison,
  ComparisonDifference,
  TimelineEvent,
};

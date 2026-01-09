/**
 * Cost Management Service
 * Comprehensive cost tracking, budgeting, optimization, and financial reporting
 */

// Cost Category
type CostCategory = 'compute' | 'storage' | 'network' | 'database' | 'licensing' | 'support' | 'labor' | 'other';

// Cost Type
type CostType = 'fixed' | 'variable' | 'reserved' | 'spot' | 'on_demand';

// Currency
type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

// Budget Status
type BudgetStatus = 'on_track' | 'at_risk' | 'over_budget' | 'under_budget';

// Allocation Status
type AllocationStatus = 'active' | 'pending' | 'expired' | 'cancelled';

// Cost Item
interface CostItem {
  id: string;
  name: string;
  description: string;
  category: CostCategory;
  costType: CostType;
  provider: CostProvider;
  resource: CostResource;
  pricing: CostPricing;
  usage: CostUsage;
  allocation: CostAllocation;
  tags: string[];
  labels: Record<string, string>;
  metadata: CostItemMetadata;
}

// Cost Provider
interface CostProvider {
  type: 'aws' | 'azure' | 'gcp' | 'datadog' | 'newrelic' | 'internal' | 'other';
  accountId: string;
  accountName: string;
  region?: string;
  service?: string;
}

// Cost Resource
interface CostResource {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  environment: string;
  tier: string;
  team: string;
  project: string;
}

// Cost Pricing
interface CostPricing {
  unitPrice: number;
  unit: string;
  currency: Currency;
  pricingModel: 'per_hour' | 'per_day' | 'per_month' | 'per_unit' | 'flat_rate' | 'tiered';
  tier?: PricingTier[];
  discount?: PricingDiscount;
  effectiveDate: Date;
  expiryDate?: Date;
}

// Pricing Tier
interface PricingTier {
  minUsage: number;
  maxUsage: number;
  pricePerUnit: number;
}

// Pricing Discount
interface PricingDiscount {
  type: 'percentage' | 'fixed' | 'volume' | 'commitment';
  value: number;
  description: string;
  validUntil?: Date;
}

// Cost Usage
interface CostUsage {
  quantity: number;
  unit: string;
  periodStart: Date;
  periodEnd: Date;
  peakUsage: number;
  avgUsage: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  trendPercentage: number;
}

// Cost Allocation
interface CostAllocation {
  costCenter: string;
  businessUnit: string;
  department: string;
  project: string;
  environment: string;
  owner: string;
  allocationPercentage: number;
  chargebackEnabled: boolean;
}

// Cost Item Metadata
interface CostItemMetadata {
  createdAt: Date;
  updatedAt: Date;
  lastBillingDate: Date;
  invoiceId?: string;
  notes?: string;
}

// Budget
interface Budget {
  id: string;
  name: string;
  description: string;
  scope: BudgetScope;
  period: BudgetPeriod;
  amounts: BudgetAmounts;
  thresholds: BudgetThresholds;
  alerts: BudgetAlert[];
  tracking: BudgetTracking;
  approvals: BudgetApproval[];
  status: BudgetStatus;
  metadata: BudgetMetadata;
}

// Budget Scope
interface BudgetScope {
  categories: CostCategory[];
  providers: string[];
  costCenters: string[];
  projects: string[];
  environments: string[];
  teams: string[];
  tags: Record<string, string>;
}

// Budget Period
interface BudgetPeriod {
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  startDate: Date;
  endDate: Date;
  fiscalYearStart?: Date;
}

// Budget Amounts
interface BudgetAmounts {
  allocated: number;
  spent: number;
  committed: number;
  forecasted: number;
  remaining: number;
  currency: Currency;
  breakdown: BudgetBreakdown[];
}

// Budget Breakdown
interface BudgetBreakdown {
  category: CostCategory;
  allocated: number;
  spent: number;
  percentage: number;
}

// Budget Thresholds
interface BudgetThresholds {
  warning: number;
  critical: number;
  forecast: number;
  softLimit: number;
  hardLimit: number;
}

// Budget Alert
interface BudgetAlert {
  id: string;
  type: 'threshold' | 'forecast' | 'anomaly' | 'trend';
  threshold: number;
  triggered: boolean;
  triggeredAt?: Date;
  recipients: string[];
  channels: ('email' | 'slack' | 'webhook')[];
  message?: string;
}

// Budget Tracking
interface BudgetTracking {
  currentSpend: number;
  spendRate: number;
  projectedSpend: number;
  variance: number;
  variancePercent: number;
  dailyAverage: number;
  history: BudgetHistoryEntry[];
}

// Budget History Entry
interface BudgetHistoryEntry {
  date: Date;
  spent: number;
  budget: number;
  variance: number;
}

// Budget Approval
interface BudgetApproval {
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  date?: Date;
  amount: number;
  comments?: string;
}

// Budget Metadata
interface BudgetMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
  lastReview: Date;
  nextReview: Date;
}

// Cost Report
interface CostReport {
  id: string;
  name: string;
  description: string;
  reportType: 'summary' | 'detailed' | 'trend' | 'comparison' | 'forecast' | 'chargeback';
  period: ReportPeriod;
  filters: ReportFilters;
  groupBy: ReportGrouping;
  data: ReportData;
  visualizations: ReportVisualization[];
  schedule: ReportSchedule;
  distribution: ReportDistribution;
  metadata: ReportMetadata;
}

// Report Period
interface ReportPeriod {
  startDate: Date;
  endDate: Date;
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
  comparison?: {
    startDate: Date;
    endDate: Date;
  };
}

// Report Filters
interface ReportFilters {
  categories?: CostCategory[];
  providers?: string[];
  costCenters?: string[];
  projects?: string[];
  environments?: string[];
  teams?: string[];
  tags?: Record<string, string>;
  minCost?: number;
  maxCost?: number;
}

// Report Grouping
interface ReportGrouping {
  primary: 'category' | 'provider' | 'cost_center' | 'project' | 'team' | 'tag' | 'time';
  secondary?: 'category' | 'provider' | 'cost_center' | 'project' | 'team' | 'tag' | 'time';
  sortBy: 'cost' | 'name' | 'change';
  sortOrder: 'asc' | 'desc';
}

// Report Data
interface ReportData {
  summary: ReportSummary;
  breakdown: ReportBreakdownItem[];
  trends: ReportTrendItem[];
  topCosts: ReportTopCost[];
  anomalies: ReportAnomaly[];
}

// Report Summary
interface ReportSummary {
  totalCost: number;
  previousPeriodCost: number;
  change: number;
  changePercent: number;
  avgDailyCost: number;
  projectedCost: number;
  currency: Currency;
}

// Report Breakdown Item
interface ReportBreakdownItem {
  name: string;
  value: string;
  cost: number;
  percentage: number;
  previousCost: number;
  change: number;
  changePercent: number;
  items?: ReportBreakdownItem[];
}

// Report Trend Item
interface ReportTrendItem {
  date: Date;
  cost: number;
  previousCost?: number;
  forecast?: number;
  budget?: number;
}

// Report Top Cost
interface ReportTopCost {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  cost: number;
  percentage: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  recommendation?: string;
}

// Report Anomaly
interface ReportAnomaly {
  date: Date;
  resource: string;
  expectedCost: number;
  actualCost: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// Report Visualization
interface ReportVisualization {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'table' | 'heatmap';
  title: string;
  dataKey: string;
  config: Record<string, unknown>;
}

// Report Schedule
interface ReportSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  lastRun?: Date;
  nextRun?: Date;
}

// Report Distribution
interface ReportDistribution {
  channels: DistributionChannel[];
  format: 'pdf' | 'csv' | 'excel' | 'html' | 'json';
  includeCharts: boolean;
}

// Distribution Channel
interface DistributionChannel {
  type: 'email' | 'slack' | 's3' | 'webhook';
  target: string;
  enabled: boolean;
}

// Report Metadata
interface ReportMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  lastGenerated?: Date;
  generationDuration?: number;
}

// Cost Optimization
interface CostOptimization {
  id: string;
  name: string;
  description: string;
  type: OptimizationType;
  resource: OptimizationResource;
  savings: OptimizationSavings;
  implementation: OptimizationImplementation;
  risk: OptimizationRisk;
  status: 'identified' | 'analyzing' | 'approved' | 'implementing' | 'implemented' | 'rejected' | 'expired';
  priority: 'critical' | 'high' | 'medium' | 'low';
  metadata: OptimizationMetadata;
}

// Optimization Type
type OptimizationType = 'rightsizing' | 'reserved_instances' | 'spot_instances' | 'unused_resources' | 'scheduling' | 'storage_tiering' | 'network_optimization' | 'license_optimization';

// Optimization Resource
interface OptimizationResource {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  provider: string;
  region: string;
  currentConfig: Record<string, unknown>;
  recommendedConfig: Record<string, unknown>;
}

// Optimization Savings
interface OptimizationSavings {
  currentCost: number;
  projectedCost: number;
  monthlySavings: number;
  annualSavings: number;
  savingsPercent: number;
  paybackPeriod?: number;
  currency: Currency;
  confidence: 'high' | 'medium' | 'low';
}

// Optimization Implementation
interface OptimizationImplementation {
  automated: boolean;
  steps: ImplementationStep[];
  estimatedDuration: number;
  downtime: boolean;
  approvalRequired: boolean;
  rollbackAvailable: boolean;
  prerequisites: string[];
}

// Implementation Step
interface ImplementationStep {
  order: number;
  name: string;
  description: string;
  command?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  result?: string;
}

// Optimization Risk
interface OptimizationRisk {
  level: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
  mitigations: string[];
}

// Risk Factor
interface RiskFactor {
  name: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

// Optimization Metadata
interface OptimizationMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  implementedBy?: string;
  implementedAt?: Date;
  expiresAt?: Date;
}

// Cost Allocation Rule
interface CostAllocationRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'tag_based' | 'proportional' | 'fixed' | 'usage_based' | 'custom';
  source: AllocationSource;
  targets: AllocationTarget[];
  schedule: AllocationSchedule;
  status: AllocationStatus;
  metadata: AllocationMetadata;
}

// Allocation Source
interface AllocationSource {
  type: 'cost_item' | 'budget' | 'cost_center' | 'provider';
  filters: Record<string, string>;
  totalAmount?: number;
}

// Allocation Target
interface AllocationTarget {
  costCenter: string;
  department: string;
  project: string;
  percentage: number;
  fixedAmount?: number;
  allocationKey?: string;
}

// Allocation Schedule
interface AllocationSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfMonth?: number;
  lastRun?: Date;
  nextRun?: Date;
  enabled: boolean;
}

// Allocation Metadata
interface AllocationMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
}

// Invoice
interface Invoice {
  id: string;
  invoiceNumber: string;
  provider: string;
  account: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  amounts: InvoiceAmounts;
  lineItems: InvoiceLineItem[];
  payments: InvoicePayment[];
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'disputed' | 'cancelled';
  dueDate: Date;
  metadata: InvoiceMetadata;
}

// Invoice Amounts
interface InvoiceAmounts {
  subtotal: number;
  taxes: number;
  credits: number;
  discounts: number;
  total: number;
  paid: number;
  balance: number;
  currency: Currency;
}

// Invoice Line Item
interface InvoiceLineItem {
  id: string;
  description: string;
  category: CostCategory;
  resourceId?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  discount?: number;
  tax?: number;
}

// Invoice Payment
interface InvoicePayment {
  id: string;
  date: Date;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'wire' | 'check';
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

// Invoice Metadata
interface InvoiceMetadata {
  createdAt: Date;
  receivedAt: Date;
  processedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}

// Chargeback
interface Chargeback {
  id: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  source: ChargebackSource;
  allocations: ChargebackAllocation[];
  summary: ChargebackSummary;
  status: 'draft' | 'pending_approval' | 'approved' | 'finalized' | 'disputed';
  approvals: ChargebackApproval[];
  metadata: ChargebackMetadata;
}

// Chargeback Source
interface ChargebackSource {
  totalCost: number;
  costItems: number;
  currency: Currency;
  providers: string[];
}

// Chargeback Allocation
interface ChargebackAllocation {
  costCenter: string;
  department: string;
  project: string;
  team: string;
  amount: number;
  percentage: number;
  items: ChargebackItem[];
}

// Chargeback Item
interface ChargebackItem {
  costItemId: string;
  description: string;
  category: CostCategory;
  amount: number;
}

// Chargeback Summary
interface ChargebackSummary {
  totalAllocated: number;
  unallocated: number;
  costCenters: number;
  departments: number;
  projects: number;
}

// Chargeback Approval
interface ChargebackApproval {
  approver: string;
  role: string;
  costCenter: string;
  status: 'pending' | 'approved' | 'rejected' | 'disputed';
  date?: Date;
  comments?: string;
}

// Chargeback Metadata
interface ChargebackMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  finalizedAt?: Date;
  finalizedBy?: string;
}

// Cost Statistics
interface CostStatistics {
  overview: {
    totalCost: number;
    monthToDate: number;
    previousMonth: number;
    changePercent: number;
    avgDailyCost: number;
    projectedMonthly: number;
    currency: Currency;
  };
  byCategory: Record<CostCategory, CategoryStats>;
  byProvider: Record<string, number>;
  byCostCenter: Record<string, number>;
  byEnvironment: Record<string, number>;
  budgets: {
    totalBudgets: number;
    onTrack: number;
    atRisk: number;
    overBudget: number;
    totalAllocated: number;
    totalSpent: number;
  };
  optimization: {
    totalOpportunities: number;
    potentialSavings: number;
    implementedSavings: number;
    pendingSavings: number;
    avgSavingsPercent: number;
  };
  invoices: {
    totalInvoices: number;
    pendingPayment: number;
    overdue: number;
    totalOwed: number;
    totalPaid: number;
  };
}

// Category Stats
interface CategoryStats {
  cost: number;
  percentage: number;
  items: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  change: number;
}

class CostManagementService {
  private static instance: CostManagementService;
  private costItems: Map<string, CostItem> = new Map();
  private budgets: Map<string, Budget> = new Map();
  private reports: Map<string, CostReport> = new Map();
  private optimizations: Map<string, CostOptimization> = new Map();
  private allocationRules: Map<string, CostAllocationRule> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private chargebacks: Map<string, Chargeback> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CostManagementService {
    if (!CostManagementService.instance) {
      CostManagementService.instance = new CostManagementService();
    }
    return CostManagementService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Cost Items
    const costItemsData = [
      { name: 'EC2 Production Instances', category: 'compute' as CostCategory, cost: 12500, provider: 'aws' },
      { name: 'RDS PostgreSQL Primary', category: 'database' as CostCategory, cost: 4500, provider: 'aws' },
      { name: 'S3 Storage Buckets', category: 'storage' as CostCategory, cost: 2500, provider: 'aws' },
      { name: 'CloudFront Distribution', category: 'network' as CostCategory, cost: 1800, provider: 'aws' },
      { name: 'Azure AKS Cluster', category: 'compute' as CostCategory, cost: 8500, provider: 'azure' },
      { name: 'Azure SQL Database', category: 'database' as CostCategory, cost: 3200, provider: 'azure' },
      { name: 'Datadog Monitoring', category: 'licensing' as CostCategory, cost: 2500, provider: 'datadog' },
      { name: 'New Relic APM', category: 'licensing' as CostCategory, cost: 1500, provider: 'newrelic' },
      { name: 'Enterprise Support AWS', category: 'support' as CostCategory, cost: 3000, provider: 'aws' },
      { name: 'DevOps Engineering', category: 'labor' as CostCategory, cost: 25000, provider: 'internal' },
    ];

    costItemsData.forEach((item, idx) => {
      const costItem: CostItem = {
        id: `cost-${(idx + 1).toString().padStart(4, '0')}`,
        name: item.name,
        description: `${item.name} monthly cost`,
        category: item.category,
        costType: item.category === 'labor' ? 'fixed' : idx % 3 === 0 ? 'reserved' : 'on_demand',
        provider: {
          type: item.provider as CostItem['provider']['type'],
          accountId: `account-${idx + 100}`,
          accountName: `${item.provider}-production`,
          region: item.provider === 'aws' ? 'us-east-1' : item.provider === 'azure' ? 'eastus' : undefined,
          service: item.category === 'compute' ? 'EC2' : item.category === 'database' ? 'RDS' : item.category,
        },
        resource: {
          resourceId: `res-${idx + 1}`,
          resourceName: item.name,
          resourceType: item.category,
          environment: 'production',
          tier: idx < 4 ? 'tier-1' : 'tier-2',
          team: idx < 5 ? 'platform' : 'infrastructure',
          project: 'main-application',
        },
        pricing: {
          unitPrice: item.cost / 730,
          unit: item.category === 'labor' ? 'month' : 'hour',
          currency: 'USD',
          pricingModel: item.category === 'labor' ? 'flat_rate' : 'per_hour',
          discount: idx % 2 === 0 ? { type: 'percentage', value: 10, description: 'Annual commitment discount' } : undefined,
          effectiveDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        },
        usage: {
          quantity: 730,
          unit: 'hours',
          periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          periodEnd: new Date(),
          peakUsage: 850,
          avgUsage: 680,
          trend: idx % 3 === 0 ? 'increasing' : idx % 3 === 1 ? 'stable' : 'decreasing',
          trendPercentage: Math.random() * 20 - 10,
        },
        allocation: {
          costCenter: `CC-${1000 + idx}`,
          businessUnit: 'Engineering',
          department: idx < 5 ? 'Platform' : 'Infrastructure',
          project: 'main-application',
          environment: 'production',
          owner: 'platform-team',
          allocationPercentage: 100,
          chargebackEnabled: true,
        },
        tags: [item.category, item.provider, 'production'],
        labels: { environment: 'production', team: idx < 5 ? 'platform' : 'infrastructure', cost_center: `CC-${1000 + idx}` },
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          lastBillingDate: new Date(),
          invoiceId: `INV-${Date.now()}-${idx}`,
        },
      };
      this.costItems.set(costItem.id, costItem);
    });

    // Initialize Budget
    const budget: Budget = {
      id: 'budget-0001',
      name: 'Q1 2024 Infrastructure Budget',
      description: 'Quarterly budget for production infrastructure',
      scope: {
        categories: ['compute', 'database', 'storage', 'network'],
        providers: ['aws', 'azure'],
        costCenters: ['CC-1000', 'CC-1001', 'CC-1002'],
        projects: ['main-application'],
        environments: ['production'],
        teams: ['platform', 'infrastructure'],
        tags: { environment: 'production' },
      },
      period: {
        type: 'quarterly',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        fiscalYearStart: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
      amounts: {
        allocated: 200000,
        spent: 65000,
        committed: 45000,
        forecasted: 195000,
        remaining: 135000,
        currency: 'USD',
        breakdown: [
          { category: 'compute', allocated: 80000, spent: 25000, percentage: 40 },
          { category: 'database', allocated: 50000, spent: 18000, percentage: 25 },
          { category: 'storage', allocated: 40000, spent: 12000, percentage: 20 },
          { category: 'network', allocated: 30000, spent: 10000, percentage: 15 },
        ],
      },
      thresholds: {
        warning: 70,
        critical: 90,
        forecast: 105,
        softLimit: 190000,
        hardLimit: 210000,
      },
      alerts: [
        { id: 'alert-1', type: 'threshold', threshold: 70, triggered: false, recipients: ['finance@company.com'], channels: ['email', 'slack'] },
        { id: 'alert-2', type: 'forecast', threshold: 100, triggered: false, recipients: ['cto@company.com'], channels: ['email'] },
      ],
      tracking: {
        currentSpend: 65000,
        spendRate: 2200,
        projectedSpend: 195000,
        variance: -5000,
        variancePercent: -2.5,
        dailyAverage: 2200,
        history: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
          spent: 2000 + Math.random() * 500,
          budget: 6666,
          variance: Math.random() * 200 - 100,
        })),
      },
      approvals: [
        { approver: 'CFO', role: 'executive', status: 'approved', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), amount: 200000, comments: 'Approved for Q1' },
        { approver: 'VP Engineering', role: 'technical', status: 'approved', date: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000), amount: 200000 },
      ],
      status: 'on_track',
      metadata: {
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        createdBy: 'finance-team',
        updatedAt: new Date(),
        version: 2,
        lastReview: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextReview: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      },
    };
    this.budgets.set(budget.id, budget);

    // Initialize Cost Report
    const report: CostReport = {
      id: 'report-0001',
      name: 'Monthly Cost Summary',
      description: 'Monthly infrastructure cost summary report',
      reportType: 'summary',
      period: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        granularity: 'daily',
        comparison: {
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      filters: {
        categories: ['compute', 'database', 'storage', 'network'],
        environments: ['production'],
      },
      groupBy: {
        primary: 'category',
        secondary: 'provider',
        sortBy: 'cost',
        sortOrder: 'desc',
      },
      data: {
        summary: {
          totalCost: 65000,
          previousPeriodCost: 62000,
          change: 3000,
          changePercent: 4.8,
          avgDailyCost: 2167,
          projectedCost: 68000,
          currency: 'USD',
        },
        breakdown: [
          { name: 'Compute', value: 'compute', cost: 21000, percentage: 32.3, previousCost: 20000, change: 1000, changePercent: 5 },
          { name: 'Database', value: 'database', cost: 18000, percentage: 27.7, previousCost: 17500, change: 500, changePercent: 2.9 },
          { name: 'Storage', value: 'storage', cost: 14500, percentage: 22.3, previousCost: 14000, change: 500, changePercent: 3.6 },
          { name: 'Network', value: 'network', cost: 11500, percentage: 17.7, previousCost: 10500, change: 1000, changePercent: 9.5 },
        ],
        trends: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
          cost: 2000 + Math.random() * 400,
          previousCost: 1900 + Math.random() * 350,
          forecast: 2100 + Math.random() * 300,
          budget: 2222,
        })),
        topCosts: [
          { resourceId: 'res-1', resourceName: 'EC2 Production Instances', resourceType: 'compute', cost: 12500, percentage: 19.2, trend: 'increasing', recommendation: 'Consider reserved instances' },
          { resourceId: 'res-5', resourceName: 'Azure AKS Cluster', resourceType: 'compute', cost: 8500, percentage: 13.1, trend: 'stable' },
          { resourceId: 'res-2', resourceName: 'RDS PostgreSQL Primary', resourceType: 'database', cost: 4500, percentage: 6.9, trend: 'stable' },
        ],
        anomalies: [
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), resource: 'EC2 Production Instances', expectedCost: 400, actualCost: 550, deviation: 37.5, severity: 'medium', description: 'Unexpected spike in compute usage' },
        ],
      },
      visualizations: [
        { id: 'viz-1', type: 'pie', title: 'Cost by Category', dataKey: 'breakdown', config: {} },
        { id: 'viz-2', type: 'line', title: 'Daily Cost Trend', dataKey: 'trends', config: {} },
        { id: 'viz-3', type: 'bar', title: 'Top Costs', dataKey: 'topCosts', config: {} },
      ],
      schedule: {
        enabled: true,
        frequency: 'monthly',
        dayOfMonth: 1,
        time: '09:00',
        timezone: 'America/New_York',
        lastRun: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      distribution: {
        channels: [
          { type: 'email', target: 'finance@company.com', enabled: true },
          { type: 'slack', target: '#cost-reports', enabled: true },
        ],
        format: 'pdf',
        includeCharts: true,
      },
      metadata: {
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        createdBy: 'finance-team',
        updatedAt: new Date(),
        lastGenerated: new Date(),
        generationDuration: 45,
      },
    };
    this.reports.set(report.id, report);

    // Initialize Cost Optimizations
    const optimizationsData = [
      { name: 'EC2 Reserved Instances', type: 'reserved_instances' as OptimizationType, savings: 3500 },
      { name: 'Rightsizing EC2 Instances', type: 'rightsizing' as OptimizationType, savings: 2000 },
      { name: 'Unused EBS Volumes', type: 'unused_resources' as OptimizationType, savings: 800 },
      { name: 'S3 Intelligent Tiering', type: 'storage_tiering' as OptimizationType, savings: 600 },
    ];

    optimizationsData.forEach((opt, idx) => {
      const optimization: CostOptimization = {
        id: `opt-${(idx + 1).toString().padStart(4, '0')}`,
        name: opt.name,
        description: `Optimization opportunity: ${opt.name}`,
        type: opt.type,
        resource: {
          resourceId: `res-${idx + 1}`,
          resourceName: costItemsData[idx].name,
          resourceType: costItemsData[idx].category,
          provider: costItemsData[idx].provider,
          region: 'us-east-1',
          currentConfig: { instanceType: 'm5.2xlarge', count: 10 },
          recommendedConfig: { instanceType: 'm5.xlarge', count: 8 },
        },
        savings: {
          currentCost: opt.savings * 3,
          projectedCost: opt.savings * 2,
          monthlySavings: opt.savings,
          annualSavings: opt.savings * 12,
          savingsPercent: 33,
          paybackPeriod: 0,
          currency: 'USD',
          confidence: idx === 0 ? 'high' : 'medium',
        },
        implementation: {
          automated: idx === 2,
          steps: [
            { order: 1, name: 'Review current configuration', description: 'Analyze current resource usage', status: 'completed' },
            { order: 2, name: 'Plan changes', description: 'Create implementation plan', status: idx === 0 ? 'in_progress' : 'pending' },
            { order: 3, name: 'Apply changes', description: 'Implement optimizations', status: 'pending' },
          ],
          estimatedDuration: 4,
          downtime: false,
          approvalRequired: true,
          rollbackAvailable: true,
          prerequisites: ['Backup current configuration', 'Notify stakeholders'],
        },
        risk: {
          level: 'low',
          factors: [
            { name: 'Performance impact', description: 'Potential performance degradation', likelihood: 'low', impact: 'medium' },
          ],
          mitigations: ['Gradual rollout', 'Performance monitoring', 'Quick rollback capability'],
        },
        status: idx === 0 ? 'approved' : idx === 1 ? 'analyzing' : 'identified',
        priority: idx === 0 ? 'high' : 'medium',
        metadata: {
          createdAt: new Date(Date.now() - (30 - idx * 5) * 24 * 60 * 60 * 1000),
          createdBy: 'cost-optimizer',
          updatedAt: new Date(),
          approvedBy: idx === 0 ? 'cto@company.com' : undefined,
          approvedAt: idx === 0 ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : undefined,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        },
      };
      this.optimizations.set(optimization.id, optimization);
    });

    // Initialize Invoice
    const invoice: Invoice = {
      id: 'inv-0001',
      invoiceNumber: 'INV-2024-001',
      provider: 'AWS',
      account: 'account-100',
      period: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
      amounts: {
        subtotal: 42500,
        taxes: 3400,
        credits: -1500,
        discounts: -2000,
        total: 42400,
        paid: 0,
        balance: 42400,
        currency: 'USD',
      },
      lineItems: costItemsData.filter((_, idx) => idx < 4).map((item, idx) => ({
        id: `line-${idx + 1}`,
        description: item.name,
        category: item.category,
        resourceId: `res-${idx + 1}`,
        quantity: 730,
        unitPrice: item.cost / 730,
        amount: item.cost,
        discount: idx === 0 ? 200 : undefined,
      })),
      payments: [],
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      metadata: {
        createdAt: new Date(),
        receivedAt: new Date(),
        processedAt: new Date(),
      },
    };
    this.invoices.set(invoice.id, invoice);

    // Initialize Chargeback
    const chargeback: Chargeback = {
      id: 'cb-0001',
      period: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
      source: {
        totalCost: 65000,
        costItems: 10,
        currency: 'USD',
        providers: ['aws', 'azure', 'datadog', 'newrelic'],
      },
      allocations: [
        {
          costCenter: 'CC-1000',
          department: 'Platform',
          project: 'main-application',
          team: 'platform',
          amount: 35000,
          percentage: 53.8,
          items: [
            { costItemId: 'cost-0001', description: 'EC2 Production Instances', category: 'compute', amount: 12500 },
            { costItemId: 'cost-0002', description: 'RDS PostgreSQL Primary', category: 'database', amount: 4500 },
          ],
        },
        {
          costCenter: 'CC-1001',
          department: 'Infrastructure',
          project: 'main-application',
          team: 'infrastructure',
          amount: 30000,
          percentage: 46.2,
          items: [
            { costItemId: 'cost-0005', description: 'Azure AKS Cluster', category: 'compute', amount: 8500 },
            { costItemId: 'cost-0006', description: 'Azure SQL Database', category: 'database', amount: 3200 },
          ],
        },
      ],
      summary: {
        totalAllocated: 65000,
        unallocated: 0,
        costCenters: 2,
        departments: 2,
        projects: 1,
      },
      status: 'pending_approval',
      approvals: [
        { approver: 'Platform Lead', role: 'manager', costCenter: 'CC-1000', status: 'approved', date: new Date(), comments: 'Approved' },
        { approver: 'Infra Lead', role: 'manager', costCenter: 'CC-1001', status: 'pending' },
      ],
      metadata: {
        createdAt: new Date(),
        createdBy: 'finance-team',
        updatedAt: new Date(),
      },
    };
    this.chargebacks.set(chargeback.id, chargeback);
  }

  // Cost Item Operations
  public getCostItems(category?: CostCategory): CostItem[] {
    let items = Array.from(this.costItems.values());
    if (category) items = items.filter((i) => i.category === category);
    return items;
  }

  public getCostItemById(id: string): CostItem | undefined {
    return this.costItems.get(id);
  }

  // Budget Operations
  public getBudgets(): Budget[] {
    return Array.from(this.budgets.values());
  }

  public getBudgetById(id: string): Budget | undefined {
    return this.budgets.get(id);
  }

  // Report Operations
  public getReports(): CostReport[] {
    return Array.from(this.reports.values());
  }

  public getReportById(id: string): CostReport | undefined {
    return this.reports.get(id);
  }

  // Optimization Operations
  public getOptimizations(status?: CostOptimization['status']): CostOptimization[] {
    let opts = Array.from(this.optimizations.values());
    if (status) opts = opts.filter((o) => o.status === status);
    return opts;
  }

  public getOptimizationById(id: string): CostOptimization | undefined {
    return this.optimizations.get(id);
  }

  // Invoice Operations
  public getInvoices(): Invoice[] {
    return Array.from(this.invoices.values());
  }

  public getInvoiceById(id: string): Invoice | undefined {
    return this.invoices.get(id);
  }

  // Chargeback Operations
  public getChargebacks(): Chargeback[] {
    return Array.from(this.chargebacks.values());
  }

  public getChargebackById(id: string): Chargeback | undefined {
    return this.chargebacks.get(id);
  }

  // Statistics
  public getStatistics(): CostStatistics {
    const items = Array.from(this.costItems.values());
    const budgets = Array.from(this.budgets.values());
    const optimizations = Array.from(this.optimizations.values());
    const invoices = Array.from(this.invoices.values());

    const totalCost = items.reduce((sum, i) => sum + (i.pricing.unitPrice * i.usage.quantity), 0);

    const byCategory: Record<CostCategory, CategoryStats> = {
      compute: { cost: 0, percentage: 0, items: 0, trend: 'stable', change: 0 },
      storage: { cost: 0, percentage: 0, items: 0, trend: 'stable', change: 0 },
      network: { cost: 0, percentage: 0, items: 0, trend: 'stable', change: 0 },
      database: { cost: 0, percentage: 0, items: 0, trend: 'stable', change: 0 },
      licensing: { cost: 0, percentage: 0, items: 0, trend: 'stable', change: 0 },
      support: { cost: 0, percentage: 0, items: 0, trend: 'stable', change: 0 },
      labor: { cost: 0, percentage: 0, items: 0, trend: 'stable', change: 0 },
      other: { cost: 0, percentage: 0, items: 0, trend: 'stable', change: 0 },
    };

    items.forEach((item) => {
      const cost = item.pricing.unitPrice * item.usage.quantity;
      byCategory[item.category].cost += cost;
      byCategory[item.category].items++;
      byCategory[item.category].trend = item.usage.trend;
      byCategory[item.category].change = item.usage.trendPercentage;
    });

    Object.keys(byCategory).forEach((cat) => {
      byCategory[cat as CostCategory].percentage = totalCost > 0 ? (byCategory[cat as CostCategory].cost / totalCost) * 100 : 0;
    });

    const byProvider: Record<string, number> = {};
    const byCostCenter: Record<string, number> = {};
    const byEnvironment: Record<string, number> = {};

    items.forEach((item) => {
      const cost = item.pricing.unitPrice * item.usage.quantity;
      byProvider[item.provider.type] = (byProvider[item.provider.type] || 0) + cost;
      byCostCenter[item.allocation.costCenter] = (byCostCenter[item.allocation.costCenter] || 0) + cost;
      byEnvironment[item.allocation.environment] = (byEnvironment[item.allocation.environment] || 0) + cost;
    });

    return {
      overview: {
        totalCost,
        monthToDate: totalCost,
        previousMonth: totalCost * 0.95,
        changePercent: 5.2,
        avgDailyCost: totalCost / 30,
        projectedMonthly: totalCost * 1.05,
        currency: 'USD',
      },
      byCategory,
      byProvider,
      byCostCenter,
      byEnvironment,
      budgets: {
        totalBudgets: budgets.length,
        onTrack: budgets.filter((b) => b.status === 'on_track').length,
        atRisk: budgets.filter((b) => b.status === 'at_risk').length,
        overBudget: budgets.filter((b) => b.status === 'over_budget').length,
        totalAllocated: budgets.reduce((sum, b) => sum + b.amounts.allocated, 0),
        totalSpent: budgets.reduce((sum, b) => sum + b.amounts.spent, 0),
      },
      optimization: {
        totalOpportunities: optimizations.length,
        potentialSavings: optimizations.reduce((sum, o) => sum + o.savings.monthlySavings, 0),
        implementedSavings: optimizations.filter((o) => o.status === 'implemented').reduce((sum, o) => sum + o.savings.monthlySavings, 0),
        pendingSavings: optimizations.filter((o) => o.status !== 'implemented' && o.status !== 'rejected').reduce((sum, o) => sum + o.savings.monthlySavings, 0),
        avgSavingsPercent: optimizations.length > 0 ? optimizations.reduce((sum, o) => sum + o.savings.savingsPercent, 0) / optimizations.length : 0,
      },
      invoices: {
        totalInvoices: invoices.length,
        pendingPayment: invoices.filter((i) => i.status === 'pending').length,
        overdue: invoices.filter((i) => i.status === 'overdue').length,
        totalOwed: invoices.reduce((sum, i) => sum + i.amounts.balance, 0),
        totalPaid: invoices.reduce((sum, i) => sum + i.amounts.paid, 0),
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

export const costManagementService = CostManagementService.getInstance();
export type {
  CostCategory,
  CostType,
  Currency,
  BudgetStatus,
  AllocationStatus,
  CostItem,
  CostProvider,
  CostResource,
  CostPricing,
  PricingTier,
  PricingDiscount,
  CostUsage,
  CostAllocation,
  CostItemMetadata,
  Budget,
  BudgetScope,
  BudgetPeriod,
  BudgetAmounts,
  BudgetBreakdown,
  BudgetThresholds,
  BudgetAlert,
  BudgetTracking,
  BudgetHistoryEntry,
  BudgetApproval,
  BudgetMetadata,
  CostReport,
  ReportPeriod,
  ReportFilters,
  ReportGrouping,
  ReportData,
  ReportSummary,
  ReportBreakdownItem,
  ReportTrendItem,
  ReportTopCost,
  ReportAnomaly,
  ReportVisualization,
  ReportSchedule,
  ReportDistribution,
  DistributionChannel,
  ReportMetadata,
  CostOptimization,
  OptimizationType,
  OptimizationResource,
  OptimizationSavings,
  OptimizationImplementation,
  ImplementationStep,
  OptimizationRisk,
  RiskFactor,
  OptimizationMetadata,
  CostAllocationRule,
  AllocationSource,
  AllocationTarget,
  AllocationSchedule,
  AllocationMetadata,
  Invoice,
  InvoiceAmounts,
  InvoiceLineItem,
  InvoicePayment,
  InvoiceMetadata,
  Chargeback,
  ChargebackSource,
  ChargebackAllocation,
  ChargebackItem,
  ChargebackSummary,
  ChargebackApproval,
  ChargebackMetadata,
  CostStatistics,
  CategoryStats,
};

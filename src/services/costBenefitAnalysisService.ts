/**
 * Cost-Benefit Analysis Service - Issue #138 Implementation
 * 
 * Provides comprehensive economic analysis for disaster response including
 * resource allocation optimization, intervention ROI calculation, recovery
 * cost estimation, mitigation investment analysis, and budget planning.
 */

// Type definitions
type AnalysisType = 'intervention' | 'mitigation' | 'recovery' | 'resource_allocation' | 'infrastructure' | 'policy';
type CostCategory = 'personnel' | 'equipment' | 'supplies' | 'infrastructure' | 'services' | 'administrative' | 'opportunity' | 'indirect';
type BenefitCategory = 'lives_saved' | 'injuries_prevented' | 'property_protected' | 'economic_activity' | 'infrastructure_preserved' | 'environmental' | 'social' | 'intangible';
type TimeHorizon = 'immediate' | 'short_term' | 'medium_term' | 'long_term';
type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high';
type AnalysisStatus = 'draft' | 'in_review' | 'approved' | 'archived';

// Cost interfaces
interface CostItem {
  id: string;
  category: CostCategory;
  name: string;
  description: string;
  amount: number;
  currency: string;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'annually';
  duration?: number;
  uncertainty: number; // 0-1, level of cost uncertainty
  assumptions: string[];
  sources: string[];
}

interface CostEstimate {
  id: string;
  analysisId: string;
  scenario: string;
  items: CostItem[];
  totalDirectCosts: number;
  totalIndirectCosts: number;
  totalOpportunityCosts: number;
  grandTotal: number;
  currency: string;
  timeHorizon: TimeHorizon;
  discountRate: number;
  presentValue: number;
  confidenceLevel: number;
  breakdown: {
    category: CostCategory;
    amount: number;
    percentage: number;
  }[];
  riskAdjustment: number;
  contingency: number;
  createdAt: Date;
  updatedAt: Date;
}

// Benefit interfaces
interface BenefitItem {
  id: string;
  category: BenefitCategory;
  name: string;
  description: string;
  quantifiedValue: number;
  monetizedValue: number;
  currency: string;
  measurementUnit: string;
  valuationMethod: 'market_price' | 'willingness_to_pay' | 'statistical_life' | 'replacement_cost' | 'avoided_cost' | 'hedonic' | 'transfer';
  uncertainty: number;
  assumptions: string[];
  sources: string[];
}

interface BenefitEstimate {
  id: string;
  analysisId: string;
  scenario: string;
  items: BenefitItem[];
  totalTangibleBenefits: number;
  totalIntangibleBenefits: number;
  grandTotal: number;
  currency: string;
  timeHorizon: TimeHorizon;
  discountRate: number;
  presentValue: number;
  confidenceLevel: number;
  breakdown: {
    category: BenefitCategory;
    amount: number;
    percentage: number;
  }[];
  distributionalEffects: {
    stakeholder: string;
    benefitShare: number;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Analysis interfaces
interface CostBenefitAnalysis {
  id: string;
  title: string;
  description: string;
  type: AnalysisType;
  incidentId?: string;
  projectId?: string;
  locationId?: string;
  status: AnalysisStatus;
  analyst: string;
  reviewers: string[];
  scenarios: Scenario[];
  selectedScenario?: string;
  baselineScenario: string;
  parameters: AnalysisParameters;
  results: AnalysisResults;
  sensitivityAnalysis?: SensitivityAnalysis;
  riskAssessment?: RiskAssessment;
  recommendations: Recommendation[];
  limitations: string[];
  methodology: string;
  dataSources: string[];
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  isBaseline: boolean;
  costs: CostEstimate;
  benefits: BenefitEstimate;
  probability: number;
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: { date: Date; description: string }[];
  };
}

interface AnalysisParameters {
  discountRate: number;
  timeHorizon: TimeHorizon;
  horizonYears: number;
  inflationRate: number;
  valueOfStatisticalLife: number;
  valueOfInjuryPrevented: number;
  currency: string;
  exchangeRates?: Record<string, number>;
}

interface AnalysisResults {
  netPresentValue: number;
  benefitCostRatio: number;
  internalRateOfReturn: number;
  paybackPeriod: number; // years
  economicEfficiency: number;
  breakEvenPoint: number;
  annualizedNetBenefit: number;
  expectedValue: number;
  certaintyEquivalent: number;
  riskPremium: number;
  ranking: number;
  recommendation: 'strongly_recommended' | 'recommended' | 'marginally_recommended' | 'not_recommended';
}

interface SensitivityAnalysis {
  id: string;
  analysisId: string;
  variables: SensitivityVariable[];
  scenarios: SensitivityScenario[];
  switchingValues: SwitchingValue[];
  tornadoDiagram?: TornadoData;
  monteCarloResults?: MonteCarloResults;
}

interface SensitivityVariable {
  name: string;
  baseValue: number;
  minValue: number;
  maxValue: number;
  distribution: 'uniform' | 'normal' | 'triangular' | 'lognormal';
  impact: 'high' | 'medium' | 'low';
}

interface SensitivityScenario {
  name: string;
  variables: { name: string; value: number }[];
  npv: number;
  bcr: number;
  recommendation: string;
}

interface SwitchingValue {
  variable: string;
  switchingPoint: number;
  baseValue: number;
  changeRequired: number;
  changePercent: number;
  interpretation: string;
}

interface TornadoData {
  variables: {
    name: string;
    lowNpv: number;
    highNpv: number;
    baseNpv: number;
    sensitivity: number;
  }[];
}

interface MonteCarloResults {
  iterations: number;
  npvDistribution: { value: number; frequency: number }[];
  meanNpv: number;
  medianNpv: number;
  stdDevNpv: number;
  percentile5: number;
  percentile95: number;
  probabilityOfPositiveNpv: number;
}

interface RiskAssessment {
  id: string;
  analysisId: string;
  overallRiskLevel: RiskLevel;
  risks: RiskItem[];
  mitigationStrategies: MitigationStrategy[];
  contingencyReserve: number;
}

interface RiskItem {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'financial' | 'operational' | 'external' | 'stakeholder';
  likelihood: number; // 0-1
  impact: number; // monetary
  riskScore: number;
  affectedCosts: string[];
  affectedBenefits: string[];
}

interface MitigationStrategy {
  riskId: string;
  strategy: string;
  cost: number;
  residualRisk: number;
  effectiveness: number;
}

interface Recommendation {
  priority: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  recommendation: string;
  rationale: string;
  expectedImpact: number;
  implementationCost: number;
  timeline: string;
}

// Comparison interfaces
interface ComparativeAnalysis {
  id: string;
  title: string;
  analysisIds: string[];
  criteria: ComparisonCriterion[];
  rankings: { analysisId: string; rank: number; score: number }[];
  tradeoffs: string[];
  recommendation: string;
  createdAt: Date;
}

interface ComparisonCriterion {
  name: string;
  weight: number;
  scores: { analysisId: string; score: number; rationale: string }[];
}

// Budget interfaces
interface BudgetAllocation {
  id: string;
  incidentId?: string;
  fiscalYear: number;
  totalBudget: number;
  currency: string;
  allocations: AllocationItem[];
  constraints: BudgetConstraint[];
  optimizationResults?: OptimizationResults;
  status: 'draft' | 'proposed' | 'approved' | 'executed';
  createdAt: Date;
  updatedAt: Date;
}

interface AllocationItem {
  id: string;
  category: string;
  projectId?: string;
  amount: number;
  priority: number;
  expectedBcr: number;
  rationale: string;
  flexibility: 'fixed' | 'adjustable' | 'contingent';
}

interface BudgetConstraint {
  type: 'minimum' | 'maximum' | 'ratio' | 'equity';
  category?: string;
  value: number;
  description: string;
}

interface OptimizationResults {
  method: 'linear_programming' | 'integer_programming' | 'multi_objective';
  objectiveValue: number;
  optimalAllocations: { itemId: string; amount: number }[];
  shadowPrices: { constraint: string; price: number }[];
  marginalValues: { category: string; value: number }[];
}

// Sample data
const sampleAnalyses: CostBenefitAnalysis[] = [
  {
    id: 'cba-001',
    title: 'Flood Early Warning System Implementation',
    description: 'Cost-benefit analysis for implementing a community flood early warning system',
    type: 'mitigation',
    status: 'approved',
    analyst: 'Dr. Sarah Chen',
    reviewers: ['Dr. James Miller', 'Prof. Emily Watson'],
    scenarios: [],
    baselineScenario: 'scenario-001',
    parameters: {
      discountRate: 0.03,
      timeHorizon: 'long_term',
      horizonYears: 20,
      inflationRate: 0.02,
      valueOfStatisticalLife: 11600000,
      valueOfInjuryPrevented: 580000,
      currency: 'USD'
    },
    results: {
      netPresentValue: 45000000,
      benefitCostRatio: 4.2,
      internalRateOfReturn: 0.18,
      paybackPeriod: 3.5,
      economicEfficiency: 0.76,
      breakEvenPoint: 2.8,
      annualizedNetBenefit: 2800000,
      expectedValue: 42000000,
      certaintyEquivalent: 38000000,
      riskPremium: 4000000,
      ranking: 1,
      recommendation: 'strongly_recommended'
    },
    recommendations: [
      {
        priority: 'immediate',
        recommendation: 'Proceed with early warning system implementation',
        rationale: 'BCR of 4.2 indicates strong economic justification',
        expectedImpact: 45000000,
        implementationCost: 15000000,
        timeline: '18 months'
      }
    ],
    limitations: [
      'Benefits from reduced psychological trauma not fully quantified',
      'Climate change impacts on flood frequency not incorporated'
    ],
    methodology: 'Standard CBA with Monte Carlo simulation for uncertainty analysis',
    dataSources: ['Historical flood data (20 years)', 'Property value assessments', 'Insurance claim records'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    approvedAt: new Date('2024-02-25'),
    approvedBy: 'Emergency Management Director'
  }
];

class CostBenefitAnalysisService {
  private static instance: CostBenefitAnalysisService;
  private analyses: Map<string, CostBenefitAnalysis> = new Map();
  private costEstimates: Map<string, CostEstimate> = new Map();
  private benefitEstimates: Map<string, BenefitEstimate> = new Map();
  private comparisons: Map<string, ComparativeAnalysis> = new Map();
  private budgetAllocations: Map<string, BudgetAllocation> = new Map();

  // Default parameters
  private readonly defaultParameters: AnalysisParameters = {
    discountRate: 0.03,
    timeHorizon: 'long_term',
    horizonYears: 20,
    inflationRate: 0.02,
    valueOfStatisticalLife: 11600000, // EPA 2023 estimate
    valueOfInjuryPrevented: 580000,
    currency: 'USD'
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CostBenefitAnalysisService {
    if (!CostBenefitAnalysisService.instance) {
      CostBenefitAnalysisService.instance = new CostBenefitAnalysisService();
    }
    return CostBenefitAnalysisService.instance;
  }

  private initializeSampleData(): void {
    sampleAnalyses.forEach(a => this.analyses.set(a.id, a));
  }

  // ==================== Analysis Management ====================

  async createAnalysis(params: {
    title: string;
    description: string;
    type: AnalysisType;
    incidentId?: string;
    projectId?: string;
    locationId?: string;
    analyst: string;
    parameters?: Partial<AnalysisParameters>;
  }): Promise<CostBenefitAnalysis> {
    const analysis: CostBenefitAnalysis = {
      id: `cba-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: params.title,
      description: params.description,
      type: params.type,
      incidentId: params.incidentId,
      projectId: params.projectId,
      locationId: params.locationId,
      status: 'draft',
      analyst: params.analyst,
      reviewers: [],
      scenarios: [],
      baselineScenario: '',
      parameters: { ...this.defaultParameters, ...params.parameters },
      results: this.getEmptyResults(),
      recommendations: [],
      limitations: [],
      methodology: '',
      dataSources: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.analyses.set(analysis.id, analysis);
    return analysis;
  }

  private getEmptyResults(): AnalysisResults {
    return {
      netPresentValue: 0,
      benefitCostRatio: 0,
      internalRateOfReturn: 0,
      paybackPeriod: 0,
      economicEfficiency: 0,
      breakEvenPoint: 0,
      annualizedNetBenefit: 0,
      expectedValue: 0,
      certaintyEquivalent: 0,
      riskPremium: 0,
      ranking: 0,
      recommendation: 'not_recommended'
    };
  }

  async getAnalysis(analysisId: string): Promise<CostBenefitAnalysis | null> {
    return this.analyses.get(analysisId) || null;
  }

  async updateAnalysis(analysisId: string, updates: Partial<CostBenefitAnalysis>): Promise<CostBenefitAnalysis> {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) throw new Error(`Analysis not found: ${analysisId}`);

    const updated: CostBenefitAnalysis = {
      ...analysis,
      ...updates,
      updatedAt: new Date()
    };

    this.analyses.set(analysisId, updated);
    return updated;
  }

  async searchAnalyses(query: {
    type?: AnalysisType;
    status?: AnalysisStatus;
    incidentId?: string;
    analyst?: string;
    minBcr?: number;
    dateRange?: { start: Date; end: Date };
    limit?: number;
    offset?: number;
  }): Promise<{ analyses: CostBenefitAnalysis[]; total: number }> {
    let analyses = Array.from(this.analyses.values());

    if (query.type) {
      analyses = analyses.filter(a => a.type === query.type);
    }

    if (query.status) {
      analyses = analyses.filter(a => a.status === query.status);
    }

    if (query.incidentId) {
      analyses = analyses.filter(a => a.incidentId === query.incidentId);
    }

    if (query.analyst) {
      analyses = analyses.filter(a => a.analyst.toLowerCase().includes(query.analyst!.toLowerCase()));
    }

    if (query.minBcr) {
      analyses = analyses.filter(a => a.results.benefitCostRatio >= query.minBcr!);
    }

    if (query.dateRange) {
      analyses = analyses.filter(a =>
        a.createdAt >= query.dateRange!.start && a.createdAt <= query.dateRange!.end
      );
    }

    analyses.sort((a, b) => b.results.benefitCostRatio - a.results.benefitCostRatio);

    const total = analyses.length;
    const offset = query.offset || 0;
    const limit = query.limit || 50;

    return {
      analyses: analyses.slice(offset, offset + limit),
      total
    };
  }

  // ==================== Cost Estimation ====================

  async createCostEstimate(params: {
    analysisId: string;
    scenario: string;
    items: Omit<CostItem, 'id'>[];
    timeHorizon: TimeHorizon;
  }): Promise<CostEstimate> {
    const analysis = this.analyses.get(params.analysisId);
    if (!analysis) throw new Error(`Analysis not found: ${params.analysisId}`);

    const items: CostItem[] = params.items.map(item => ({
      ...item,
      id: `cost-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    }));

    // Calculate totals
    let totalDirect = 0;
    let totalIndirect = 0;
    let totalOpportunity = 0;

    items.forEach(item => {
      let amount = item.amount;
      if (item.isRecurring && item.duration) {
        amount = this.calculateRecurringCost(item, analysis.parameters);
      }

      if (item.category === 'indirect') {
        totalIndirect += amount;
      } else if (item.category === 'opportunity') {
        totalOpportunity += amount;
      } else {
        totalDirect += amount;
      }
    });

    const grandTotal = totalDirect + totalIndirect + totalOpportunity;

    // Calculate present value
    const presentValue = this.calculatePresentValue(grandTotal, analysis.parameters);

    // Calculate breakdown
    const breakdown = this.calculateCostBreakdown(items);

    // Calculate confidence based on uncertainty
    const avgUncertainty = items.reduce((sum, i) => sum + i.uncertainty, 0) / items.length;
    const confidenceLevel = 1 - avgUncertainty;

    const estimate: CostEstimate = {
      id: `cost-est-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      analysisId: params.analysisId,
      scenario: params.scenario,
      items,
      totalDirectCosts: totalDirect,
      totalIndirectCosts: totalIndirect,
      totalOpportunityCosts: totalOpportunity,
      grandTotal,
      currency: analysis.parameters.currency,
      timeHorizon: params.timeHorizon,
      discountRate: analysis.parameters.discountRate,
      presentValue,
      confidenceLevel,
      breakdown,
      riskAdjustment: grandTotal * avgUncertainty * 0.5,
      contingency: grandTotal * 0.1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.costEstimates.set(estimate.id, estimate);
    return estimate;
  }

  private calculateRecurringCost(item: CostItem, params: AnalysisParameters): number {
    if (!item.duration) return item.amount;

    let periodsPerYear: number;
    switch (item.frequency) {
      case 'daily': periodsPerYear = 365; break;
      case 'weekly': periodsPerYear = 52; break;
      case 'monthly': periodsPerYear = 12; break;
      case 'annually': periodsPerYear = 1; break;
      default: periodsPerYear = 1;
    }

    // Calculate present value of annuity
    const r = params.discountRate;
    const n = item.duration;
    const annualAmount = item.amount * periodsPerYear;

    if (r === 0) return annualAmount * n;

    return annualAmount * (1 - Math.pow(1 + r, -n)) / r;
  }

  private calculatePresentValue(futureValue: number, params: AnalysisParameters): number {
    // Simple present value for single sum
    // For more complex scenarios, would need year-by-year cash flows
    const midpoint = params.horizonYears / 2;
    return futureValue / Math.pow(1 + params.discountRate, midpoint);
  }

  private calculateCostBreakdown(items: CostItem[]): { category: CostCategory; amount: number; percentage: number }[] {
    const categoryTotals: Record<CostCategory, number> = {} as Record<CostCategory, number>;
    let grandTotal = 0;

    items.forEach(item => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
      grandTotal += item.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as CostCategory,
        amount,
        percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // ==================== Benefit Estimation ====================

  async createBenefitEstimate(params: {
    analysisId: string;
    scenario: string;
    items: Omit<BenefitItem, 'id'>[];
    timeHorizon: TimeHorizon;
  }): Promise<BenefitEstimate> {
    const analysis = this.analyses.get(params.analysisId);
    if (!analysis) throw new Error(`Analysis not found: ${params.analysisId}`);

    const items: BenefitItem[] = params.items.map(item => ({
      ...item,
      id: `benefit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    }));

    // Calculate totals
    let totalTangible = 0;
    let totalIntangible = 0;

    items.forEach(item => {
      if (item.category === 'intangible' || item.category === 'social') {
        totalIntangible += item.monetizedValue;
      } else {
        totalTangible += item.monetizedValue;
      }
    });

    const grandTotal = totalTangible + totalIntangible;
    const presentValue = this.calculatePresentValue(grandTotal, analysis.parameters);

    // Calculate breakdown
    const breakdown = this.calculateBenefitBreakdown(items);

    // Calculate confidence
    const avgUncertainty = items.reduce((sum, i) => sum + i.uncertainty, 0) / items.length;
    const confidenceLevel = 1 - avgUncertainty;

    const estimate: BenefitEstimate = {
      id: `benefit-est-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      analysisId: params.analysisId,
      scenario: params.scenario,
      items,
      totalTangibleBenefits: totalTangible,
      totalIntangibleBenefits: totalIntangible,
      grandTotal,
      currency: analysis.parameters.currency,
      timeHorizon: params.timeHorizon,
      discountRate: analysis.parameters.discountRate,
      presentValue,
      confidenceLevel,
      breakdown,
      distributionalEffects: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.benefitEstimates.set(estimate.id, estimate);
    return estimate;
  }

  private calculateBenefitBreakdown(items: BenefitItem[]): { category: BenefitCategory; amount: number; percentage: number }[] {
    const categoryTotals: Record<BenefitCategory, number> = {} as Record<BenefitCategory, number>;
    let grandTotal = 0;

    items.forEach(item => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.monetizedValue;
      grandTotal += item.monetizedValue;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as BenefitCategory,
        amount,
        percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // ==================== Analysis Calculation ====================

  async calculateResults(analysisId: string): Promise<AnalysisResults> {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) throw new Error(`Analysis not found: ${analysisId}`);

    if (analysis.scenarios.length === 0) {
      throw new Error('No scenarios defined for analysis');
    }

    // Get primary scenario (selected or baseline)
    const primaryScenario = analysis.scenarios.find(s =>
      s.id === (analysis.selectedScenario || analysis.baselineScenario)
    );

    if (!primaryScenario) {
      throw new Error('Primary scenario not found');
    }

    const costs = primaryScenario.costs;
    const benefits = primaryScenario.benefits;

    // Calculate NPV
    const netPresentValue = benefits.presentValue - costs.presentValue;

    // Calculate BCR
    const benefitCostRatio = costs.presentValue > 0 ? benefits.presentValue / costs.presentValue : 0;

    // Calculate IRR (simplified)
    const internalRateOfReturn = this.calculateIRR(costs.grandTotal, benefits.grandTotal, analysis.parameters.horizonYears);

    // Calculate payback period
    const paybackPeriod = this.calculatePaybackPeriod(costs.grandTotal, benefits.grandTotal / analysis.parameters.horizonYears);

    // Calculate economic efficiency
    const economicEfficiency = netPresentValue / benefits.presentValue;

    // Calculate break-even point
    const breakEvenPoint = this.calculateBreakEven(costs.grandTotal, benefits.grandTotal, analysis.parameters.horizonYears);

    // Calculate annualized net benefit
    const annualizedNetBenefit = this.calculateAnnualizedValue(netPresentValue, analysis.parameters);

    // Expected value (probability-weighted)
    const expectedValue = analysis.scenarios.reduce((sum, s) =>
      sum + (s.benefits.presentValue - s.costs.presentValue) * s.probability, 0
    );

    // Risk calculations
    const riskPremium = netPresentValue * 0.1; // Simplified
    const certaintyEquivalent = netPresentValue - riskPremium;

    // Determine recommendation
    const recommendation = this.determineRecommendation(benefitCostRatio, netPresentValue);

    const results: AnalysisResults = {
      netPresentValue,
      benefitCostRatio,
      internalRateOfReturn,
      paybackPeriod,
      economicEfficiency,
      breakEvenPoint,
      annualizedNetBenefit,
      expectedValue,
      certaintyEquivalent,
      riskPremium,
      ranking: 0,
      recommendation
    };

    // Update analysis with results
    analysis.results = results;
    analysis.updatedAt = new Date();
    this.analyses.set(analysisId, analysis);

    return results;
  }

  private calculateIRR(totalCost: number, totalBenefit: number, years: number): number {
    // Simplified IRR calculation using Newton-Raphson approximation
    if (totalCost <= 0) return 0;

    const annualNetBenefit = (totalBenefit - totalCost) / years;
    const initialGuess = annualNetBenefit / totalCost;

    let irr = initialGuess;
    for (let i = 0; i < 100; i++) {
      let npv = -totalCost;
      let derivative = 0;

      for (let t = 1; t <= years; t++) {
        const factor = Math.pow(1 + irr, -t);
        npv += (totalBenefit / years) * factor;
        derivative -= t * (totalBenefit / years) * Math.pow(1 + irr, -(t + 1));
      }

      if (Math.abs(npv) < 0.01) break;
      if (derivative === 0) break;

      irr = irr - npv / derivative;
    }

    return Math.max(0, Math.min(1, irr));
  }

  private calculatePaybackPeriod(totalCost: number, annualBenefit: number): number {
    if (annualBenefit <= 0) return Infinity;
    return totalCost / annualBenefit;
  }

  private calculateBreakEven(totalCost: number, totalBenefit: number, years: number): number {
    const annualBenefit = totalBenefit / years;
    if (annualBenefit <= 0) return Infinity;
    return totalCost / annualBenefit;
  }

  private calculateAnnualizedValue(npv: number, params: AnalysisParameters): number {
    const r = params.discountRate;
    const n = params.horizonYears;

    if (r === 0) return npv / n;

    // Capital recovery factor
    const crf = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return npv * crf;
  }

  private determineRecommendation(bcr: number, npv: number): AnalysisResults['recommendation'] {
    if (bcr >= 2 && npv > 0) return 'strongly_recommended';
    if (bcr >= 1.2 && npv > 0) return 'recommended';
    if (bcr >= 1 && npv > 0) return 'marginally_recommended';
    return 'not_recommended';
  }

  // ==================== Sensitivity Analysis ====================

  async runSensitivityAnalysis(analysisId: string, variables: SensitivityVariable[]): Promise<SensitivityAnalysis> {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) throw new Error(`Analysis not found: ${analysisId}`);

    const scenarios: SensitivityScenario[] = [];
    const switchingValues: SwitchingValue[] = [];

    // Generate scenarios for each variable at min/max
    for (const variable of variables) {
      // Low scenario
      scenarios.push({
        name: `${variable.name} - Low`,
        variables: [{ name: variable.name, value: variable.minValue }],
        npv: analysis.results.netPresentValue * (1 - (variable.baseValue - variable.minValue) / variable.baseValue * 0.5),
        bcr: analysis.results.benefitCostRatio * (1 - (variable.baseValue - variable.minValue) / variable.baseValue * 0.3),
        recommendation: ''
      });

      // High scenario
      scenarios.push({
        name: `${variable.name} - High`,
        variables: [{ name: variable.name, value: variable.maxValue }],
        npv: analysis.results.netPresentValue * (1 + (variable.maxValue - variable.baseValue) / variable.baseValue * 0.5),
        bcr: analysis.results.benefitCostRatio * (1 + (variable.maxValue - variable.baseValue) / variable.baseValue * 0.3),
        recommendation: ''
      });

      // Calculate switching value
      const switchingPoint = this.calculateSwitchingValue(analysis, variable);
      switchingValues.push({
        variable: variable.name,
        switchingPoint,
        baseValue: variable.baseValue,
        changeRequired: switchingPoint - variable.baseValue,
        changePercent: ((switchingPoint - variable.baseValue) / variable.baseValue) * 100,
        interpretation: switchingPoint > variable.maxValue
          ? `BCR unlikely to fall below 1.0 within plausible range`
          : `BCR would fall below 1.0 if ${variable.name} changes by ${Math.abs(((switchingPoint - variable.baseValue) / variable.baseValue) * 100).toFixed(1)}%`
      });
    }

    // Generate tornado diagram data
    const tornadoDiagram: TornadoData = {
      variables: variables.map(v => ({
        name: v.name,
        lowNpv: analysis.results.netPresentValue * (1 - (v.baseValue - v.minValue) / v.baseValue * 0.5),
        highNpv: analysis.results.netPresentValue * (1 + (v.maxValue - v.baseValue) / v.baseValue * 0.5),
        baseNpv: analysis.results.netPresentValue,
        sensitivity: Math.abs((v.maxValue - v.minValue) / v.baseValue)
      })).sort((a, b) => (b.highNpv - b.lowNpv) - (a.highNpv - a.lowNpv))
    };

    // Run Monte Carlo simulation
    const monteCarloResults = this.runMonteCarloSimulation(analysis, variables);

    const sensitivityAnalysis: SensitivityAnalysis = {
      id: `sens-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      analysisId,
      variables,
      scenarios,
      switchingValues,
      tornadoDiagram,
      monteCarloResults
    };

    analysis.sensitivityAnalysis = sensitivityAnalysis;
    this.analyses.set(analysisId, analysis);

    return sensitivityAnalysis;
  }

  private calculateSwitchingValue(analysis: CostBenefitAnalysis, variable: SensitivityVariable): number {
    // Simplified switching value calculation
    // Point where BCR = 1.0
    const baseNpv = analysis.results.netPresentValue;
    const sensitivityFactor = 0.5; // Assumed impact factor

    if (baseNpv <= 0) return variable.baseValue;

    // Calculate change needed to make NPV = 0
    const changeNeeded = baseNpv / (variable.baseValue * sensitivityFactor);
    return variable.baseValue - changeNeeded;
  }

  private runMonteCarloSimulation(analysis: CostBenefitAnalysis, variables: SensitivityVariable[]): MonteCarloResults {
    const iterations = 1000;
    const npvResults: number[] = [];

    for (let i = 0; i < iterations; i++) {
      let adjustmentFactor = 0;

      variables.forEach(v => {
        // Generate random value based on distribution
        let randomValue: number;
        switch (v.distribution) {
          case 'normal':
            randomValue = this.normalRandom(v.baseValue, (v.maxValue - v.minValue) / 4);
            break;
          case 'triangular':
            randomValue = this.triangularRandom(v.minValue, v.baseValue, v.maxValue);
            break;
          default:
            randomValue = v.minValue + Math.random() * (v.maxValue - v.minValue);
        }

        adjustmentFactor += (randomValue - v.baseValue) / v.baseValue;
      });

      adjustmentFactor /= variables.length;
      npvResults.push(analysis.results.netPresentValue * (1 + adjustmentFactor));
    }

    npvResults.sort((a, b) => a - b);

    // Calculate distribution
    const buckets = 20;
    const minNpv = npvResults[0];
    const maxNpv = npvResults[npvResults.length - 1];
    const bucketSize = (maxNpv - minNpv) / buckets;

    const distribution: { value: number; frequency: number }[] = [];
    for (let b = 0; b < buckets; b++) {
      const lowerBound = minNpv + b * bucketSize;
      const upperBound = lowerBound + bucketSize;
      const count = npvResults.filter(v => v >= lowerBound && v < upperBound).length;
      distribution.push({ value: (lowerBound + upperBound) / 2, frequency: count / iterations });
    }

    return {
      iterations,
      npvDistribution: distribution,
      meanNpv: npvResults.reduce((a, b) => a + b, 0) / iterations,
      medianNpv: npvResults[Math.floor(iterations / 2)],
      stdDevNpv: Math.sqrt(npvResults.reduce((sum, v) => sum + Math.pow(v - npvResults.reduce((a, b) => a + b, 0) / iterations, 2), 0) / iterations),
      percentile5: npvResults[Math.floor(iterations * 0.05)],
      percentile95: npvResults[Math.floor(iterations * 0.95)],
      probabilityOfPositiveNpv: npvResults.filter(v => v > 0).length / iterations
    };
  }

  private normalRandom(mean: number, stdDev: number): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }

  private triangularRandom(min: number, mode: number, max: number): number {
    const u = Math.random();
    const f = (mode - min) / (max - min);
    if (u < f) {
      return min + Math.sqrt(u * (max - min) * (mode - min));
    }
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }

  // ==================== Comparative Analysis ====================

  async compareAnalyses(analysisIds: string[], criteria?: { name: string; weight: number }[]): Promise<ComparativeAnalysis> {
    const analyses = analysisIds.map(id => this.analyses.get(id)).filter(Boolean) as CostBenefitAnalysis[];

    if (analyses.length < 2) {
      throw new Error('At least 2 analyses required for comparison');
    }

    // Default criteria if not provided
    const comparisonCriteria = criteria || [
      { name: 'Net Present Value', weight: 0.3 },
      { name: 'Benefit-Cost Ratio', weight: 0.25 },
      { name: 'Payback Period', weight: 0.2 },
      { name: 'Risk Level', weight: 0.15 },
      { name: 'Implementation Feasibility', weight: 0.1 }
    ];

    // Score each analysis on each criterion
    const scoredCriteria: ComparisonCriterion[] = comparisonCriteria.map(c => ({
      ...c,
      scores: analyses.map(a => ({
        analysisId: a.id,
        score: this.scoreAnalysisOnCriterion(a, c.name),
        rationale: this.getRationale(a, c.name)
      }))
    }));

    // Calculate weighted scores and rankings
    const rankings = analyses.map(a => {
      const totalScore = scoredCriteria.reduce((sum, criterion) => {
        const analysisScore = criterion.scores.find(s => s.analysisId === a.id);
        return sum + (analysisScore?.score || 0) * criterion.weight;
      }, 0);

      return { analysisId: a.id, rank: 0, score: totalScore };
    });

    rankings.sort((a, b) => b.score - a.score);
    rankings.forEach((r, idx) => r.rank = idx + 1);

    // Identify tradeoffs
    const tradeoffs = this.identifyTradeoffs(analyses, scoredCriteria);

    const comparison: ComparativeAnalysis = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `Comparison of ${analyses.length} alternatives`,
      analysisIds,
      criteria: scoredCriteria,
      rankings,
      tradeoffs,
      recommendation: `Based on weighted analysis, ${analyses.find(a => a.id === rankings[0].analysisId)?.title} ranks highest with a score of ${rankings[0].score.toFixed(2)}`,
      createdAt: new Date()
    };

    this.comparisons.set(comparison.id, comparison);
    return comparison;
  }

  private scoreAnalysisOnCriterion(analysis: CostBenefitAnalysis, criterion: string): number {
    switch (criterion) {
      case 'Net Present Value':
        return Math.min(100, Math.max(0, (analysis.results.netPresentValue / 1000000) * 10));
      case 'Benefit-Cost Ratio':
        return Math.min(100, analysis.results.benefitCostRatio * 20);
      case 'Payback Period':
        return Math.max(0, 100 - analysis.results.paybackPeriod * 10);
      case 'Risk Level':
        return 100 - (analysis.results.riskPremium / analysis.results.netPresentValue) * 100;
      case 'Implementation Feasibility':
        return 70; // Would need more detailed assessment
      default:
        return 50;
    }
  }

  private getRationale(analysis: CostBenefitAnalysis, criterion: string): string {
    switch (criterion) {
      case 'Net Present Value':
        return `NPV of ${(analysis.results.netPresentValue / 1000000).toFixed(1)}M`;
      case 'Benefit-Cost Ratio':
        return `BCR of ${analysis.results.benefitCostRatio.toFixed(2)}`;
      case 'Payback Period':
        return `Payback in ${analysis.results.paybackPeriod.toFixed(1)} years`;
      default:
        return '';
    }
  }

  private identifyTradeoffs(analyses: CostBenefitAnalysis[], criteria: ComparisonCriterion[]): string[] {
    const tradeoffs: string[] = [];

    for (let i = 0; i < analyses.length - 1; i++) {
      for (let j = i + 1; j < analyses.length; j++) {
        const a1 = analyses[i];
        const a2 = analyses[j];

        if (a1.results.netPresentValue > a2.results.netPresentValue &&
            a1.results.paybackPeriod > a2.results.paybackPeriod) {
          tradeoffs.push(`${a1.title} has higher NPV but longer payback than ${a2.title}`);
        }

        if (a1.results.benefitCostRatio > a2.results.benefitCostRatio &&
            a1.results.riskPremium > a2.results.riskPremium) {
          tradeoffs.push(`${a1.title} has higher BCR but also higher risk than ${a2.title}`);
        }
      }
    }

    return tradeoffs;
  }

  // ==================== Budget Optimization ====================

  async createBudgetAllocation(params: {
    incidentId?: string;
    fiscalYear: number;
    totalBudget: number;
    currency: string;
    allocations: Omit<AllocationItem, 'id'>[];
    constraints?: BudgetConstraint[];
  }): Promise<BudgetAllocation> {
    const allocations: AllocationItem[] = params.allocations.map(a => ({
      ...a,
      id: `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    }));

    const allocation: BudgetAllocation = {
      id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      fiscalYear: params.fiscalYear,
      totalBudget: params.totalBudget,
      currency: params.currency,
      allocations,
      constraints: params.constraints || [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.budgetAllocations.set(allocation.id, allocation);
    return allocation;
  }

  async optimizeBudgetAllocation(allocationId: string): Promise<OptimizationResults> {
    const allocation = this.budgetAllocations.get(allocationId);
    if (!allocation) throw new Error(`Budget allocation not found: ${allocationId}`);

    // Simple optimization: allocate proportionally to BCR until budget exhausted
    const sortedItems = [...allocation.allocations].sort((a, b) => b.expectedBcr - a.expectedBcr);

    let remainingBudget = allocation.totalBudget;
    const optimalAllocations: { itemId: string; amount: number }[] = [];
    let totalObjectiveValue = 0;

    for (const item of sortedItems) {
      if (remainingBudget <= 0) break;

      // Check constraints
      const maxAmount = this.getMaxAllowedAmount(item, allocation.constraints, remainingBudget);
      const allocatedAmount = Math.min(item.amount, maxAmount);

      optimalAllocations.push({ itemId: item.id, amount: allocatedAmount });
      remainingBudget -= allocatedAmount;
      totalObjectiveValue += allocatedAmount * item.expectedBcr;
    }

    // Calculate shadow prices (simplified)
    const shadowPrices = allocation.constraints.map(c => ({
      constraint: c.description,
      price: c.type === 'maximum' ? -0.1 : 0.05
    }));

    // Calculate marginal values
    const categoryTotals: Record<string, number> = {};
    allocation.allocations.forEach(a => {
      categoryTotals[a.category] = (categoryTotals[a.category] || 0) + a.amount;
    });

    const marginalValues = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      value: amount > 0 ? totalObjectiveValue / amount : 0
    }));

    const results: OptimizationResults = {
      method: 'linear_programming',
      objectiveValue: totalObjectiveValue,
      optimalAllocations,
      shadowPrices,
      marginalValues
    };

    allocation.optimizationResults = results;
    allocation.updatedAt = new Date();
    this.budgetAllocations.set(allocationId, allocation);

    return results;
  }

  private getMaxAllowedAmount(item: AllocationItem, constraints: BudgetConstraint[], remainingBudget: number): number {
    let maxAmount = remainingBudget;

    constraints.forEach(c => {
      if (c.category && c.category !== item.category) return;

      if (c.type === 'maximum') {
        maxAmount = Math.min(maxAmount, c.value);
      }
    });

    return maxAmount;
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalAnalyses: number;
    byStatus: Record<AnalysisStatus, number>;
    byType: Record<AnalysisType, number>;
    averageBcr: number;
    totalNpv: number;
    recommendationDistribution: Record<string, number>;
  }> {
    let analyses = Array.from(this.analyses.values());

    if (incidentId) {
      analyses = analyses.filter(a => a.incidentId === incidentId);
    }

    const byStatus: Record<AnalysisStatus, number> = { draft: 0, in_review: 0, approved: 0, archived: 0 };
    const byType: Record<AnalysisType, number> = {
      intervention: 0, mitigation: 0, recovery: 0, resource_allocation: 0, infrastructure: 0, policy: 0
    };
    const recommendationDistribution: Record<string, number> = {
      strongly_recommended: 0, recommended: 0, marginally_recommended: 0, not_recommended: 0
    };

    let totalBcr = 0;
    let totalNpv = 0;

    analyses.forEach(a => {
      byStatus[a.status]++;
      byType[a.type]++;
      recommendationDistribution[a.results.recommendation]++;
      totalBcr += a.results.benefitCostRatio;
      totalNpv += a.results.netPresentValue;
    });

    return {
      totalAnalyses: analyses.length,
      byStatus,
      byType,
      averageBcr: analyses.length > 0 ? totalBcr / analyses.length : 0,
      totalNpv,
      recommendationDistribution
    };
  }
}

export const costBenefitAnalysisService = CostBenefitAnalysisService.getInstance();
export default CostBenefitAnalysisService;

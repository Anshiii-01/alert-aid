/**
 * Predictive Modeling Service - Issue #136 Implementation
 * 
 * Provides advanced predictive analytics for disaster management including
 * disaster occurrence prediction, impact modeling, resource demand forecasting,
 * evacuation timing optimization, and risk assessment using ML/statistical models.
 */

// Type definitions
type ModelType = 'regression' | 'classification' | 'time_series' | 'neural_network' | 'ensemble' | 'simulation' | 'bayesian';
type PredictionCategory = 'disaster_occurrence' | 'impact_severity' | 'resource_demand' | 'evacuation' | 'recovery' | 'casualty' | 'economic' | 'infrastructure';
type DisasterType = 'flood' | 'earthquake' | 'hurricane' | 'tornado' | 'wildfire' | 'tsunami' | 'volcanic' | 'landslide' | 'drought' | 'pandemic';
type ConfidenceLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
type ModelStatus = 'draft' | 'training' | 'validating' | 'active' | 'deprecated' | 'archived';

// Model interfaces
interface PredictiveModel {
  id: string;
  name: string;
  version: string;
  type: ModelType;
  category: PredictionCategory;
  disasterTypes: DisasterType[];
  description: string;
  inputFeatures: ModelFeature[];
  outputVariables: OutputVariable[];
  hyperparameters: Record<string, any>;
  performance: ModelPerformance;
  trainingInfo: TrainingInfo;
  status: ModelStatus;
  usageCount: number;
  lastUsed?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ModelFeature {
  name: string;
  type: 'numeric' | 'categorical' | 'temporal' | 'spatial' | 'boolean';
  description: string;
  required: boolean;
  defaultValue?: any;
  validRange?: { min?: number; max?: number };
  categories?: string[];
  importance?: number;
  preprocessing?: string;
}

interface OutputVariable {
  name: string;
  type: 'numeric' | 'categorical' | 'probability' | 'time_series';
  description: string;
  unit?: string;
  range?: { min: number; max: number };
  categories?: string[];
}

interface ModelPerformance {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  rmse?: number;
  mae?: number;
  r2Score?: number;
  auc?: number;
  confusionMatrix?: number[][];
  validationMethod: string;
  validationDate: Date;
  testDataSize: number;
  notes?: string;
}

interface TrainingInfo {
  dataSource: string;
  dataSize: number;
  dateRange?: { start: Date; end: Date };
  trainingDuration: number; // seconds
  trainingDate: Date;
  framework: string;
  computeResources?: string;
  dataPreprocessing: string[];
  featureEngineering: string[];
}

// Prediction interfaces
interface Prediction {
  id: string;
  modelId: string;
  modelName: string;
  category: PredictionCategory;
  incidentId?: string;
  locationId?: string;
  location?: {
    name: string;
    coordinates: { lat: number; lon: number };
    radius?: number;
  };
  timeframe: {
    predictionTime: Date;
    targetStart: Date;
    targetEnd: Date;
    horizon: number; // hours
  };
  inputs: Record<string, any>;
  outputs: PredictionOutput[];
  confidence: ConfidenceLevel;
  confidenceScore: number;
  uncertainty: UncertaintyMetrics;
  factors: ContributingFactor[];
  scenarios?: Scenario[];
  recommendations: string[];
  status: 'generated' | 'validated' | 'expired' | 'superseded';
  validUntil: Date;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

interface PredictionOutput {
  variable: string;
  value: number | string | number[];
  unit?: string;
  confidenceInterval?: { low: number; high: number };
  percentile?: { p10: number; p50: number; p90: number };
  timeSeries?: { timestamp: Date; value: number }[];
  explanation?: string;
}

interface UncertaintyMetrics {
  overall: number;
  byFactor: { factor: string; contribution: number }[];
  dataQuality: number;
  modelUncertainty: number;
  scenarioVariance?: number;
}

interface ContributingFactor {
  name: string;
  influence: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  description: string;
  dataSource?: string;
}

interface Scenario {
  name: string;
  description: string;
  probability: number;
  assumptions: string[];
  outcomes: PredictionOutput[];
}

// Risk assessment interfaces
interface RiskAssessment {
  id: string;
  name: string;
  locationId?: string;
  location: {
    name: string;
    type: 'point' | 'area' | 'region';
    coordinates?: { lat: number; lon: number };
    boundary?: { lat: number; lon: number }[];
  };
  timeframe: {
    start: Date;
    end: Date;
  };
  disasterType: DisasterType;
  riskScore: number;
  riskLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'extreme';
  components: RiskComponent[];
  vulnerabilities: Vulnerability[];
  exposures: Exposure[];
  mitigationRecommendations: MitigationRecommendation[];
  historicalContext: HistoricalContext;
  predictionIds: string[];
  createdAt: Date;
  validUntil: Date;
}

interface RiskComponent {
  name: string;
  type: 'hazard' | 'vulnerability' | 'exposure' | 'capacity';
  score: number;
  weight: number;
  factors: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface Vulnerability {
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedPopulation?: number;
  affectedAssets?: string[];
  mitigationStatus: 'not_addressed' | 'partial' | 'addressed';
}

interface Exposure {
  type: 'population' | 'infrastructure' | 'economic' | 'environmental' | 'cultural';
  description: string;
  quantification: {
    value: number;
    unit: string;
  };
  estimatedLoss?: {
    value: number;
    currency: string;
    methodology: string;
  };
}

interface MitigationRecommendation {
  priority: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  category: string;
  action: string;
  expectedImpact: string;
  estimatedCost?: number;
  implementationTime?: string;
  responsible?: string;
}

interface HistoricalContext {
  previousEvents: { date: Date; severity: string; impact: string }[];
  frequency: { period: string; count: number };
  trend: 'increasing' | 'stable' | 'decreasing';
  comparisonToBaseline: string;
}

// Demand forecast interfaces
interface ResourceDemandForecast {
  id: string;
  incidentId?: string;
  disasterType: DisasterType;
  location: {
    name: string;
    coordinates: { lat: number; lon: number };
    affectedArea: number; // sq km
    affectedPopulation: number;
  };
  timeframe: {
    start: Date;
    end: Date;
    intervals: number;
  };
  forecasts: ResourceForecast[];
  assumptions: string[];
  methodology: string;
  confidenceScore: number;
  createdAt: Date;
  validUntil: Date;
}

interface ResourceForecast {
  resourceType: string;
  category: 'personnel' | 'equipment' | 'supplies' | 'facilities' | 'vehicles' | 'financial';
  timeline: DemandPoint[];
  peakDemand: {
    value: number;
    unit: string;
    expectedTime: Date;
  };
  totalRequired: {
    value: number;
    unit: string;
  };
  currentAvailable?: number;
  gap?: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  alternatives?: string[];
}

interface DemandPoint {
  timestamp: Date;
  demand: number;
  confidence: number;
  driverExplanation?: string;
}

// Impact projection interfaces
interface ImpactProjection {
  id: string;
  incidentId?: string;
  disasterType: DisasterType;
  scenario: string;
  location: {
    name: string;
    coordinates?: { lat: number; lon: number };
    affectedArea: number;
  };
  humanImpact: HumanImpact;
  infrastructureImpact: InfrastructureImpact;
  economicImpact: EconomicImpact;
  environmentalImpact: EnvironmentalImpact;
  recoveryProjection: RecoveryProjection;
  confidenceScore: number;
  methodology: string;
  createdAt: Date;
}

interface HumanImpact {
  estimatedCasualties: {
    fatalities: { estimate: number; range: { low: number; high: number } };
    injuries: { estimate: number; range: { low: number; high: number } };
    missing: { estimate: number; range: { low: number; high: number } };
  };
  displacedPopulation: {
    estimate: number;
    range: { low: number; high: number };
    duration: string;
  };
  shelterNeeds: {
    estimate: number;
    type: string[];
  };
  vulnerableGroups: {
    group: string;
    estimated: number;
    specialNeeds: string[];
  }[];
}

interface InfrastructureImpact {
  buildings: {
    totalAffected: number;
    byDamageLevel: { level: string; count: number; percentage: number }[];
  };
  utilities: {
    type: string;
    affectedCustomers: number;
    estimatedOutageDuration: string;
  }[];
  transportation: {
    type: string;
    affected: string;
    estimatedClosureDuration: string;
  }[];
  criticalFacilities: {
    type: string;
    affected: number;
    impact: string;
  }[];
}

interface EconomicImpact {
  directLosses: {
    total: number;
    currency: string;
    breakdown: { category: string; amount: number }[];
  };
  indirectLosses: {
    total: number;
    currency: string;
    breakdown: { category: string; amount: number }[];
  };
  businessInterruption: {
    affectedBusinesses: number;
    estimatedDuration: string;
    economicLoss: number;
  };
  employmentImpact: {
    jobsAffected: number;
    temporary: number;
    permanent: number;
  };
}

interface EnvironmentalImpact {
  contaminationRisk: { type: string; severity: string; area: number }[];
  ecosystemDamage: { ecosystem: string; impact: string; recovery: string }[];
  wasteGeneration: { type: string; estimatedVolume: number; unit: string }[];
  longTermEffects: string[];
}

interface RecoveryProjection {
  phases: {
    phase: string;
    duration: string;
    keyMilestones: string[];
    estimatedCost: number;
  }[];
  totalRecoveryTime: string;
  totalEstimatedCost: number;
  criticalPath: string[];
  risks: string[];
}

// Sample data
const sampleModels: PredictiveModel[] = [
  {
    id: 'model-001',
    name: 'Flood Risk Predictor',
    version: '2.1.0',
    type: 'ensemble',
    category: 'disaster_occurrence',
    disasterTypes: ['flood'],
    description: 'Ensemble model for predicting flood occurrence based on weather, terrain, and historical data',
    inputFeatures: [
      { name: 'precipitation_forecast', type: 'numeric', description: 'Forecasted precipitation in mm', required: true },
      { name: 'soil_saturation', type: 'numeric', description: 'Current soil saturation level', required: true },
      { name: 'river_level', type: 'numeric', description: 'Current river level', required: true },
      { name: 'terrain_slope', type: 'numeric', description: 'Average terrain slope', required: false }
    ],
    outputVariables: [
      { name: 'flood_probability', type: 'probability', description: 'Probability of flooding', range: { min: 0, max: 1 } },
      { name: 'severity_class', type: 'categorical', description: 'Predicted severity', categories: ['minor', 'moderate', 'major', 'catastrophic'] }
    ],
    hyperparameters: { n_estimators: 100, max_depth: 10 },
    performance: {
      accuracy: 0.87,
      precision: 0.85,
      recall: 0.89,
      f1Score: 0.87,
      auc: 0.92,
      validationMethod: 'k-fold cross-validation',
      validationDate: new Date(),
      testDataSize: 10000
    },
    trainingInfo: {
      dataSource: 'NOAA Historical Flood Data',
      dataSize: 50000,
      trainingDuration: 3600,
      trainingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      framework: 'scikit-learn',
      dataPreprocessing: ['missing value imputation', 'outlier removal', 'feature scaling'],
      featureEngineering: ['rolling averages', 'lag features', 'seasonal decomposition']
    },
    status: 'active',
    usageCount: 1547,
    createdBy: 'ML Team',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

class PredictiveModelingService {
  private static instance: PredictiveModelingService;
  private models: Map<string, PredictiveModel> = new Map();
  private predictions: Map<string, Prediction> = new Map();
  private riskAssessments: Map<string, RiskAssessment> = new Map();
  private demandForecasts: Map<string, ResourceDemandForecast> = new Map();
  private impactProjections: Map<string, ImpactProjection> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): PredictiveModelingService {
    if (!PredictiveModelingService.instance) {
      PredictiveModelingService.instance = new PredictiveModelingService();
    }
    return PredictiveModelingService.instance;
  }

  private initializeSampleData(): void {
    sampleModels.forEach(m => this.models.set(m.id, m));
  }

  // ==================== Model Management ====================

  async registerModel(params: {
    name: string;
    version: string;
    type: ModelType;
    category: PredictionCategory;
    disasterTypes: DisasterType[];
    description: string;
    inputFeatures: ModelFeature[];
    outputVariables: OutputVariable[];
    hyperparameters?: Record<string, any>;
    trainingInfo: TrainingInfo;
    createdBy: string;
  }): Promise<PredictiveModel> {
    const model: PredictiveModel = {
      id: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      version: params.version,
      type: params.type,
      category: params.category,
      disasterTypes: params.disasterTypes,
      description: params.description,
      inputFeatures: params.inputFeatures,
      outputVariables: params.outputVariables,
      hyperparameters: params.hyperparameters || {},
      performance: {
        validationMethod: 'pending',
        validationDate: new Date(),
        testDataSize: 0
      },
      trainingInfo: params.trainingInfo,
      status: 'draft',
      usageCount: 0,
      createdBy: params.createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.models.set(model.id, model);
    return model;
  }

  async getModel(modelId: string): Promise<PredictiveModel | null> {
    return this.models.get(modelId) || null;
  }

  async getModels(params?: {
    category?: PredictionCategory;
    disasterType?: DisasterType;
    type?: ModelType;
    status?: ModelStatus;
  }): Promise<PredictiveModel[]> {
    let models = Array.from(this.models.values());

    if (params?.category) {
      models = models.filter(m => m.category === params.category);
    }

    if (params?.disasterType) {
      models = models.filter(m => m.disasterTypes.includes(params.disasterType!));
    }

    if (params?.type) {
      models = models.filter(m => m.type === params.type);
    }

    if (params?.status) {
      models = models.filter(m => m.status === params.status);
    }

    return models.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateModelPerformance(modelId: string, performance: ModelPerformance): Promise<PredictiveModel> {
    const model = this.models.get(modelId);
    if (!model) throw new Error(`Model not found: ${modelId}`);

    model.performance = performance;
    model.status = 'validating';
    model.updatedAt = new Date();

    return model;
  }

  async activateModel(modelId: string): Promise<PredictiveModel> {
    const model = this.models.get(modelId);
    if (!model) throw new Error(`Model not found: ${modelId}`);

    if (!model.performance.accuracy && !model.performance.rmse) {
      throw new Error('Model must be validated before activation');
    }

    model.status = 'active';
    model.updatedAt = new Date();

    return model;
  }

  async deprecateModel(modelId: string, reason: string): Promise<PredictiveModel> {
    const model = this.models.get(modelId);
    if (!model) throw new Error(`Model not found: ${modelId}`);

    model.status = 'deprecated';
    model.updatedAt = new Date();

    return model;
  }

  // ==================== Prediction Generation ====================

  async generatePrediction(params: {
    modelId: string;
    incidentId?: string;
    location: {
      name: string;
      coordinates: { lat: number; lon: number };
      radius?: number;
    };
    horizon: number; // hours
    inputs: Record<string, any>;
  }): Promise<Prediction> {
    const model = this.models.get(params.modelId);
    if (!model) throw new Error(`Model not found: ${params.modelId}`);
    if (model.status !== 'active') throw new Error('Model is not active');

    // Validate inputs
    const missingFeatures = model.inputFeatures
      .filter(f => f.required && params.inputs[f.name] === undefined)
      .map(f => f.name);

    if (missingFeatures.length > 0) {
      throw new Error(`Missing required features: ${missingFeatures.join(', ')}`);
    }

    // Simulate prediction (production would call actual ML model)
    const outputs = this.simulatePrediction(model, params.inputs);
    const { confidence, confidenceScore } = this.calculateConfidence(model, params.inputs);
    const factors = this.identifyContributingFactors(model, params.inputs);
    const uncertainty = this.calculateUncertainty(model, params.inputs);

    const prediction: Prediction = {
      id: `pred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      modelId: params.modelId,
      modelName: model.name,
      category: model.category,
      incidentId: params.incidentId,
      location: params.location,
      timeframe: {
        predictionTime: new Date(),
        targetStart: new Date(),
        targetEnd: new Date(Date.now() + params.horizon * 60 * 60 * 1000),
        horizon: params.horizon
      },
      inputs: params.inputs,
      outputs,
      confidence,
      confidenceScore,
      uncertainty,
      factors,
      recommendations: this.generateRecommendations(model.category, outputs, factors),
      status: 'generated',
      validUntil: new Date(Date.now() + Math.min(params.horizon, 24) * 60 * 60 * 1000),
      createdAt: new Date()
    };

    this.predictions.set(prediction.id, prediction);

    // Update model usage
    model.usageCount++;
    model.lastUsed = new Date();

    return prediction;
  }

  private simulatePrediction(model: PredictiveModel, inputs: Record<string, any>): PredictionOutput[] {
    const outputs: PredictionOutput[] = [];

    model.outputVariables.forEach(variable => {
      if (variable.type === 'probability') {
        const value = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
        outputs.push({
          variable: variable.name,
          value,
          confidenceInterval: { low: value * 0.8, high: Math.min(1, value * 1.2) },
          explanation: `Based on current ${Object.keys(inputs).slice(0, 2).join(' and ')}`
        });
      } else if (variable.type === 'categorical' && variable.categories) {
        const index = Math.floor(Math.random() * variable.categories.length);
        outputs.push({
          variable: variable.name,
          value: variable.categories[index],
          explanation: `Most likely category based on input features`
        });
      } else if (variable.type === 'numeric') {
        const range = variable.range || { min: 0, max: 100 };
        const value = range.min + Math.random() * (range.max - range.min);
        outputs.push({
          variable: variable.name,
          value,
          unit: variable.unit,
          confidenceInterval: { low: value * 0.9, high: value * 1.1 },
          explanation: `Estimated based on model analysis`
        });
      }
    });

    return outputs;
  }

  private calculateConfidence(model: PredictiveModel, inputs: Record<string, any>): { confidence: ConfidenceLevel; confidenceScore: number } {
    // Base confidence on model performance and input completeness
    let score = model.performance.accuracy || model.performance.auc || 0.7;

    // Adjust for input completeness
    const providedFeatures = Object.keys(inputs).length;
    const totalFeatures = model.inputFeatures.length;
    score *= (providedFeatures / totalFeatures);

    // Adjust for model age
    const modelAge = (Date.now() - model.trainingInfo.trainingDate.getTime()) / (30 * 24 * 60 * 60 * 1000);
    if (modelAge > 6) score *= 0.9;
    if (modelAge > 12) score *= 0.85;

    let confidence: ConfidenceLevel;
    if (score >= 0.85) confidence = 'very_high';
    else if (score >= 0.7) confidence = 'high';
    else if (score >= 0.55) confidence = 'medium';
    else if (score >= 0.4) confidence = 'low';
    else confidence = 'very_low';

    return { confidence, confidenceScore: score };
  }

  private identifyContributingFactors(model: PredictiveModel, inputs: Record<string, any>): ContributingFactor[] {
    const factors: ContributingFactor[] = [];

    model.inputFeatures.forEach(feature => {
      if (inputs[feature.name] !== undefined) {
        const importance = feature.importance || Math.random() * 0.5;
        let influence: 'positive' | 'negative' | 'neutral' = 'neutral';
        
        if (feature.validRange) {
          const value = inputs[feature.name];
          const midpoint = (feature.validRange.min! + feature.validRange.max!) / 2;
          influence = value > midpoint ? 'positive' : 'negative';
        }

        factors.push({
          name: feature.name,
          influence,
          magnitude: importance,
          description: feature.description,
          dataSource: 'Input data'
        });
      }
    });

    return factors.sort((a, b) => b.magnitude - a.magnitude).slice(0, 5);
  }

  private calculateUncertainty(model: PredictiveModel, inputs: Record<string, any>): UncertaintyMetrics {
    const modelUncertainty = 1 - (model.performance.accuracy || model.performance.auc || 0.7);
    const dataQuality = Object.keys(inputs).length / model.inputFeatures.length;
    const overall = (modelUncertainty + (1 - dataQuality)) / 2;

    return {
      overall,
      byFactor: model.inputFeatures.slice(0, 3).map(f => ({
        factor: f.name,
        contribution: Math.random() * 0.3
      })),
      dataQuality,
      modelUncertainty
    };
  }

  private generateRecommendations(category: PredictionCategory, outputs: PredictionOutput[], factors: ContributingFactor[]): string[] {
    const recommendations: string[] = [];

    switch (category) {
      case 'disaster_occurrence':
        const probability = outputs.find(o => o.variable.includes('probability'));
        if (probability && typeof probability.value === 'number' && probability.value > 0.6) {
          recommendations.push('Activate emergency response protocols');
          recommendations.push('Issue public warning alerts');
          recommendations.push('Pre-position emergency resources');
        }
        break;
      case 'resource_demand':
        recommendations.push('Review and update resource inventory');
        recommendations.push('Coordinate with mutual aid partners');
        recommendations.push('Prepare logistics for resource deployment');
        break;
      case 'evacuation':
        recommendations.push('Finalize evacuation route planning');
        recommendations.push('Alert transportation resources');
        recommendations.push('Prepare shelter facilities');
        break;
      default:
        recommendations.push('Continue monitoring situation');
        recommendations.push('Update stakeholders on predictions');
    }

    return recommendations;
  }

  async getPrediction(predictionId: string): Promise<Prediction | null> {
    return this.predictions.get(predictionId) || null;
  }

  async getPredictions(params?: {
    modelId?: string;
    category?: PredictionCategory;
    incidentId?: string;
    status?: Prediction['status'];
    validOnly?: boolean;
  }): Promise<Prediction[]> {
    let predictions = Array.from(this.predictions.values());

    if (params?.modelId) {
      predictions = predictions.filter(p => p.modelId === params.modelId);
    }

    if (params?.category) {
      predictions = predictions.filter(p => p.category === params.category);
    }

    if (params?.incidentId) {
      predictions = predictions.filter(p => p.incidentId === params.incidentId);
    }

    if (params?.status) {
      predictions = predictions.filter(p => p.status === params.status);
    }

    if (params?.validOnly) {
      predictions = predictions.filter(p => p.validUntil > new Date() && p.status === 'generated');
    }

    return predictions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ==================== Risk Assessment ====================

  async generateRiskAssessment(params: {
    name: string;
    location: RiskAssessment['location'];
    timeframe: { start: Date; end: Date };
    disasterType: DisasterType;
  }): Promise<RiskAssessment> {
    // Get relevant predictions
    const relevantModels = await this.getModels({
      disasterType: params.disasterType,
      status: 'active'
    });

    const predictionIds: string[] = [];

    // Generate predictions from relevant models
    for (const model of relevantModels.slice(0, 3)) {
      try {
        const prediction = await this.generatePrediction({
          modelId: model.id,
          location: {
            name: params.location.name,
            coordinates: params.location.coordinates || { lat: 0, lon: 0 }
          },
          horizon: Math.ceil((params.timeframe.end.getTime() - params.timeframe.start.getTime()) / (60 * 60 * 1000)),
          inputs: {} // Would be populated with actual data
        });
        predictionIds.push(prediction.id);
      } catch (error) {
        // Skip failed predictions
      }
    }

    // Calculate risk components
    const hazardScore = Math.random() * 0.4 + 0.3;
    const vulnerabilityScore = Math.random() * 0.3 + 0.3;
    const exposureScore = Math.random() * 0.4 + 0.2;
    const capacityScore = Math.random() * 0.3 + 0.4;

    const riskScore = (hazardScore * 0.4 + vulnerabilityScore * 0.25 + exposureScore * 0.25 - capacityScore * 0.1);

    let riskLevel: RiskAssessment['riskLevel'];
    if (riskScore >= 0.8) riskLevel = 'extreme';
    else if (riskScore >= 0.6) riskLevel = 'high';
    else if (riskScore >= 0.4) riskLevel = 'moderate';
    else if (riskScore >= 0.2) riskLevel = 'low';
    else riskLevel = 'minimal';

    const assessment: RiskAssessment = {
      id: `risk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      location: params.location,
      timeframe: params.timeframe,
      disasterType: params.disasterType,
      riskScore,
      riskLevel,
      components: [
        { name: 'Hazard', type: 'hazard', score: hazardScore, weight: 0.4, factors: ['Weather patterns', 'Seasonal factors'], trend: 'stable' },
        { name: 'Vulnerability', type: 'vulnerability', score: vulnerabilityScore, weight: 0.25, factors: ['Building age', 'Infrastructure condition'], trend: 'stable' },
        { name: 'Exposure', type: 'exposure', score: exposureScore, weight: 0.25, factors: ['Population density', 'Asset concentration'], trend: 'increasing' },
        { name: 'Response Capacity', type: 'capacity', score: capacityScore, weight: 0.1, factors: ['Emergency services', 'Community preparedness'], trend: 'stable' }
      ],
      vulnerabilities: [
        { category: 'Infrastructure', description: 'Aging stormwater systems', severity: 'medium', mitigationStatus: 'partial' },
        { category: 'Social', description: 'Vulnerable population concentrations', severity: 'high', mitigationStatus: 'not_addressed' }
      ],
      exposures: [
        { type: 'population', description: 'Residents in flood zone', quantification: { value: 15000, unit: 'people' } },
        { type: 'infrastructure', description: 'Critical facilities', quantification: { value: 12, unit: 'facilities' } }
      ],
      mitigationRecommendations: this.generateMitigationRecommendations(params.disasterType, riskLevel),
      historicalContext: {
        previousEvents: [
          { date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), severity: 'moderate', impact: 'Localized flooding' }
        ],
        frequency: { period: '10 years', count: 3 },
        trend: 'increasing',
        comparisonToBaseline: 'Above historical average'
      },
      predictionIds,
      createdAt: new Date(),
      validUntil: params.timeframe.end
    };

    this.riskAssessments.set(assessment.id, assessment);
    return assessment;
  }

  private generateMitigationRecommendations(disasterType: DisasterType, riskLevel: RiskAssessment['riskLevel']): MitigationRecommendation[] {
    const recommendations: MitigationRecommendation[] = [];

    if (riskLevel === 'high' || riskLevel === 'extreme') {
      recommendations.push({
        priority: 'immediate',
        category: 'Preparedness',
        action: 'Activate emergency operations center',
        expectedImpact: 'Improved coordination and response time',
        implementationTime: 'Immediate'
      });
    }

    recommendations.push({
      priority: 'short_term',
      category: 'Infrastructure',
      action: `Review and update ${disasterType} protection infrastructure`,
      expectedImpact: 'Reduced physical vulnerability',
      estimatedCost: 50000,
      implementationTime: '1-3 months'
    });

    recommendations.push({
      priority: 'medium_term',
      category: 'Community',
      action: 'Conduct community awareness and training programs',
      expectedImpact: 'Improved community resilience',
      implementationTime: '3-6 months'
    });

    return recommendations;
  }

  async getRiskAssessment(assessmentId: string): Promise<RiskAssessment | null> {
    return this.riskAssessments.get(assessmentId) || null;
  }

  async getRiskAssessments(params?: {
    disasterType?: DisasterType;
    riskLevel?: RiskAssessment['riskLevel'][];
    validOnly?: boolean;
  }): Promise<RiskAssessment[]> {
    let assessments = Array.from(this.riskAssessments.values());

    if (params?.disasterType) {
      assessments = assessments.filter(a => a.disasterType === params.disasterType);
    }

    if (params?.riskLevel && params.riskLevel.length > 0) {
      assessments = assessments.filter(a => params.riskLevel!.includes(a.riskLevel));
    }

    if (params?.validOnly) {
      assessments = assessments.filter(a => a.validUntil > new Date());
    }

    return assessments.sort((a, b) => b.riskScore - a.riskScore);
  }

  // ==================== Resource Demand Forecasting ====================

  async generateDemandForecast(params: {
    incidentId?: string;
    disasterType: DisasterType;
    location: ResourceDemandForecast['location'];
    timeframe: { start: Date; end: Date; intervals: number };
  }): Promise<ResourceDemandForecast> {
    const resourceTypes = [
      { type: 'Emergency Medical Technicians', category: 'personnel' as const },
      { type: 'Shelter Beds', category: 'facilities' as const },
      { type: 'Water (gallons)', category: 'supplies' as const },
      { type: 'Heavy Equipment', category: 'equipment' as const },
      { type: 'Transport Vehicles', category: 'vehicles' as const }
    ];

    const forecasts: ResourceForecast[] = resourceTypes.map(rt => {
      const baseDemand = params.location.affectedPopulation * (Math.random() * 0.1 + 0.05);
      const timeline: DemandPoint[] = [];
      
      const intervalMs = (params.timeframe.end.getTime() - params.timeframe.start.getTime()) / params.timeframe.intervals;
      
      for (let i = 0; i <= params.timeframe.intervals; i++) {
        const timestamp = new Date(params.timeframe.start.getTime() + i * intervalMs);
        // Demand typically peaks early then declines
        const factor = Math.exp(-i / (params.timeframe.intervals * 0.5)) * (1 + Math.random() * 0.2);
        
        timeline.push({
          timestamp,
          demand: Math.round(baseDemand * factor),
          confidence: 0.8 - (i / params.timeframe.intervals) * 0.3,
          driverExplanation: i === 0 ? 'Initial response surge' : undefined
        });
      }

      const peakPoint = timeline.reduce((max, p) => p.demand > max.demand ? p : max, timeline[0]);

      return {
        resourceType: rt.type,
        category: rt.category,
        timeline,
        peakDemand: {
          value: peakPoint.demand,
          unit: rt.type === 'Water (gallons)' ? 'gallons' : 'units',
          expectedTime: peakPoint.timestamp
        },
        totalRequired: {
          value: timeline.reduce((sum, p) => sum + p.demand, 0),
          unit: rt.type === 'Water (gallons)' ? 'gallons' : 'units'
        },
        currentAvailable: Math.round(peakPoint.demand * 0.7),
        gap: Math.round(peakPoint.demand * 0.3),
        priority: peakPoint.demand > baseDemand * 2 ? 'critical' : 'high'
      };
    });

    const forecast: ResourceDemandForecast = {
      id: `demand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      disasterType: params.disasterType,
      location: params.location,
      timeframe: params.timeframe,
      forecasts,
      assumptions: [
        'Based on population exposure estimates',
        'Assumes typical resource consumption patterns',
        'Does not account for mutual aid availability'
      ],
      methodology: 'Population-based demand modeling with temporal decay',
      confidenceScore: 0.75,
      createdAt: new Date(),
      validUntil: params.timeframe.end
    };

    this.demandForecasts.set(forecast.id, forecast);
    return forecast;
  }

  async getDemandForecast(forecastId: string): Promise<ResourceDemandForecast | null> {
    return this.demandForecasts.get(forecastId) || null;
  }

  // ==================== Impact Projections ====================

  async generateImpactProjection(params: {
    incidentId?: string;
    disasterType: DisasterType;
    scenario: string;
    location: ImpactProjection['location'];
  }): Promise<ImpactProjection> {
    const basePopulation = params.location.affectedArea * 2000; // Rough estimate

    const projection: ImpactProjection = {
      id: `impact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId: params.incidentId,
      disasterType: params.disasterType,
      scenario: params.scenario,
      location: params.location,
      humanImpact: {
        estimatedCasualties: {
          fatalities: { estimate: Math.round(basePopulation * 0.001), range: { low: Math.round(basePopulation * 0.0005), high: Math.round(basePopulation * 0.002) } },
          injuries: { estimate: Math.round(basePopulation * 0.01), range: { low: Math.round(basePopulation * 0.005), high: Math.round(basePopulation * 0.02) } },
          missing: { estimate: Math.round(basePopulation * 0.002), range: { low: Math.round(basePopulation * 0.001), high: Math.round(basePopulation * 0.005) } }
        },
        displacedPopulation: {
          estimate: Math.round(basePopulation * 0.15),
          range: { low: Math.round(basePopulation * 0.1), high: Math.round(basePopulation * 0.25) },
          duration: '2-4 weeks'
        },
        shelterNeeds: {
          estimate: Math.round(basePopulation * 0.08),
          type: ['Emergency shelters', 'Hotels/motels', 'Temporary housing']
        },
        vulnerableGroups: [
          { group: 'Elderly (65+)', estimated: Math.round(basePopulation * 0.18 * 0.15), specialNeeds: ['Medical support', 'Mobility assistance'] },
          { group: 'Children', estimated: Math.round(basePopulation * 0.22 * 0.15), specialNeeds: ['Supervision', 'Education continuity'] }
        ]
      },
      infrastructureImpact: {
        buildings: {
          totalAffected: Math.round(params.location.affectedArea * 400),
          byDamageLevel: [
            { level: 'Minor', count: Math.round(params.location.affectedArea * 200), percentage: 50 },
            { level: 'Moderate', count: Math.round(params.location.affectedArea * 120), percentage: 30 },
            { level: 'Major', count: Math.round(params.location.affectedArea * 60), percentage: 15 },
            { level: 'Destroyed', count: Math.round(params.location.affectedArea * 20), percentage: 5 }
          ]
        },
        utilities: [
          { type: 'Electric', affectedCustomers: Math.round(basePopulation * 0.4), estimatedOutageDuration: '3-7 days' },
          { type: 'Water', affectedCustomers: Math.round(basePopulation * 0.2), estimatedOutageDuration: '1-3 days' }
        ],
        transportation: [
          { type: 'Roads', affected: '15-20% of local roads', estimatedClosureDuration: '1-2 weeks' }
        ],
        criticalFacilities: [
          { type: 'Hospitals', affected: 2, impact: 'Reduced capacity' },
          { type: 'Schools', affected: 8, impact: 'Temporary closure' }
        ]
      },
      economicImpact: {
        directLosses: {
          total: params.location.affectedArea * 5000000,
          currency: 'USD',
          breakdown: [
            { category: 'Residential', amount: params.location.affectedArea * 2000000 },
            { category: 'Commercial', amount: params.location.affectedArea * 1500000 },
            { category: 'Infrastructure', amount: params.location.affectedArea * 1500000 }
          ]
        },
        indirectLosses: {
          total: params.location.affectedArea * 2000000,
          currency: 'USD',
          breakdown: [
            { category: 'Business interruption', amount: params.location.affectedArea * 1200000 },
            { category: 'Supply chain disruption', amount: params.location.affectedArea * 800000 }
          ]
        },
        businessInterruption: {
          affectedBusinesses: Math.round(params.location.affectedArea * 50),
          estimatedDuration: '2-4 weeks',
          economicLoss: params.location.affectedArea * 1200000
        },
        employmentImpact: {
          jobsAffected: Math.round(params.location.affectedArea * 200),
          temporary: Math.round(params.location.affectedArea * 180),
          permanent: Math.round(params.location.affectedArea * 20)
        }
      },
      environmentalImpact: {
        contaminationRisk: [
          { type: 'Water contamination', severity: 'moderate', area: params.location.affectedArea * 0.3 }
        ],
        ecosystemDamage: [
          { ecosystem: 'Wetlands', impact: 'Temporary disruption', recovery: '6-12 months' }
        ],
        wasteGeneration: [
          { type: 'Debris', estimatedVolume: params.location.affectedArea * 10000, unit: 'cubic yards' }
        ],
        longTermEffects: ['Soil erosion', 'Habitat disruption']
      },
      recoveryProjection: {
        phases: [
          { phase: 'Emergency Response', duration: '1-2 weeks', keyMilestones: ['Search and rescue', 'Life safety'], estimatedCost: params.location.affectedArea * 500000 },
          { phase: 'Short-term Recovery', duration: '1-3 months', keyMilestones: ['Temporary housing', 'Utility restoration'], estimatedCost: params.location.affectedArea * 2000000 },
          { phase: 'Long-term Recovery', duration: '1-3 years', keyMilestones: ['Permanent reconstruction', 'Economic recovery'], estimatedCost: params.location.affectedArea * 4000000 }
        ],
        totalRecoveryTime: '2-3 years',
        totalEstimatedCost: params.location.affectedArea * 7000000,
        criticalPath: ['Utility restoration', 'Housing availability', 'Economic recovery'],
        risks: ['Funding delays', 'Labor shortages', 'Secondary disasters']
      },
      confidenceScore: 0.7,
      methodology: 'HAZUS-based impact modeling with local adjustments',
      createdAt: new Date()
    };

    this.impactProjections.set(projection.id, projection);
    return projection;
  }

  async getImpactProjection(projectionId: string): Promise<ImpactProjection | null> {
    return this.impactProjections.get(projectionId) || null;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalModels: number;
    activeModels: number;
    totalPredictions: number;
    predictionsByCategory: Record<PredictionCategory, number>;
    avgConfidence: number;
    riskAssessments: number;
    highRiskAssessments: number;
  }> {
    const models = Array.from(this.models.values());
    const predictions = Array.from(this.predictions.values());
    const riskAssessments = Array.from(this.riskAssessments.values());

    const predictionsByCategory: Record<PredictionCategory, number> = {} as Record<PredictionCategory, number>;
    predictions.forEach(p => {
      predictionsByCategory[p.category] = (predictionsByCategory[p.category] || 0) + 1;
    });

    return {
      totalModels: models.length,
      activeModels: models.filter(m => m.status === 'active').length,
      totalPredictions: predictions.length,
      predictionsByCategory,
      avgConfidence: predictions.length > 0
        ? predictions.reduce((sum, p) => sum + p.confidenceScore, 0) / predictions.length
        : 0,
      riskAssessments: riskAssessments.length,
      highRiskAssessments: riskAssessments.filter(r => r.riskLevel === 'high' || r.riskLevel === 'extreme').length
    };
  }
}

export const predictiveModelingService = PredictiveModelingService.getInstance();
export default PredictiveModelingService;

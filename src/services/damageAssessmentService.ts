/**
 * Damage Assessment Service - Issue #135 Implementation
 * 
 * Provides comprehensive damage assessment capabilities for disaster response
 * including structural damage evaluation, infrastructure assessment, property
 * damage tracking, cost estimation, and insurance claim support.
 */

// Type definitions
type DamageCategory = 'structural' | 'infrastructure' | 'utility' | 'environmental' | 'agricultural' | 'commercial' | 'residential' | 'public_facility' | 'transportation' | 'communication';
type DamageSeverity = 'none' | 'minor' | 'moderate' | 'major' | 'severe' | 'destroyed';
type AssessmentStatus = 'pending' | 'in_progress' | 'preliminary' | 'completed' | 'verified' | 'appealed';
type StructuralRating = 'safe' | 'restricted_use' | 'unsafe_limited' | 'unsafe' | 'area_unsafe';
type PropertyType = 'single_family' | 'multi_family' | 'commercial' | 'industrial' | 'agricultural' | 'public' | 'infrastructure' | 'mixed_use';
type AssessmentType = 'rapid' | 'detailed' | 'engineering' | 'economic' | 'environmental';

// Assessment interfaces
interface DamageAssessment {
  id: string;
  assessmentNumber: string;
  incidentId: string;
  type: AssessmentType;
  status: AssessmentStatus;
  property: PropertyInfo;
  damage: DamageInfo;
  inspection: InspectionInfo;
  costEstimate?: CostEstimate;
  structuralEvaluation?: StructuralEvaluation;
  photos: AssessmentPhoto[];
  documents: AssessmentDocument[];
  timeline: AssessmentEvent[];
  flags: AssessmentFlag[];
  insuranceClaim?: InsuranceClaim;
  createdAt: Date;
  updatedAt: Date;
}

interface PropertyInfo {
  address: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates?: { lat: number; lon: number };
  parcelId?: string;
  propertyType: PropertyType;
  yearBuilt?: number;
  squareFootage?: number;
  stories?: number;
  constructionType?: string;
  occupancyType?: string;
  preDisasterValue?: number;
  owner?: {
    name: string;
    phone?: string;
    email?: string;
    alternateContact?: string;
  };
  tenant?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

interface DamageInfo {
  overallSeverity: DamageSeverity;
  categories: CategoryDamage[];
  primaryCause: string;
  secondaryCauses?: string[];
  affectedAreas: AffectedArea[];
  hazards: HazardInfo[];
  utilities: UtilityStatus;
  accessStatus: 'accessible' | 'limited' | 'blocked';
  habitability: 'habitable' | 'limited' | 'uninhabitable';
  description: string;
}

interface CategoryDamage {
  category: DamageCategory;
  severity: DamageSeverity;
  percentAffected: number;
  components: ComponentDamage[];
  description: string;
}

interface ComponentDamage {
  component: string;
  severity: DamageSeverity;
  damageType: string;
  repairRequired: boolean;
  immediateAction?: string;
  estimatedCost?: number;
}

interface AffectedArea {
  name: string;
  type: 'room' | 'floor' | 'building' | 'structure' | 'land' | 'other';
  severity: DamageSeverity;
  squareFootage?: number;
  description: string;
  photos: string[];
}

interface HazardInfo {
  type: 'structural' | 'electrical' | 'gas' | 'water' | 'chemical' | 'biological' | 'fire' | 'collapse';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  mitigationRequired: boolean;
  mitigationStatus: 'pending' | 'in_progress' | 'completed';
  mitigationActions?: string[];
}

interface UtilityStatus {
  electricity: { status: 'working' | 'partial' | 'out' | 'dangerous'; notes?: string };
  gas: { status: 'working' | 'partial' | 'out' | 'shut_off' | 'leak_detected'; notes?: string };
  water: { status: 'working' | 'partial' | 'out' | 'contaminated'; notes?: string };
  sewer: { status: 'working' | 'partial' | 'out' | 'backup'; notes?: string };
  hvac: { status: 'working' | 'partial' | 'out' | 'damaged'; notes?: string };
  communications: { status: 'working' | 'partial' | 'out'; notes?: string };
}

interface InspectionInfo {
  inspectorId: string;
  inspectorName: string;
  inspectorCredentials?: string;
  organization?: string;
  inspectionDate: Date;
  duration: number; // minutes
  methodology: string;
  tools: string[];
  accessLimitations?: string[];
  weatherConditions?: string;
  witnessPresent?: boolean;
  witnessName?: string;
}

interface StructuralEvaluation {
  rating: StructuralRating;
  ratingJustification: string;
  foundationDamage: {
    severity: DamageSeverity;
    type?: string;
    details: string;
  };
  framingDamage: {
    severity: DamageSeverity;
    type?: string;
    details: string;
  };
  roofDamage: {
    severity: DamageSeverity;
    type?: string;
    percentDamaged: number;
    details: string;
  };
  wallDamage: {
    severity: DamageSeverity;
    type?: string;
    details: string;
  };
  chimneyDamage?: {
    present: boolean;
    severity: DamageSeverity;
    details: string;
  };
  geotechnical?: {
    soilMovement: boolean;
    liquefaction: boolean;
    erosion: boolean;
    details: string;
  };
  recommendations: string[];
  requiredRepairs: string[];
  engineeringReviewRequired: boolean;
}

interface CostEstimate {
  totalEstimate: number;
  currency: string;
  methodology: 'unit_cost' | 'detailed' | 'parametric' | 'professional';
  confidence: 'low' | 'medium' | 'high';
  breakdown: CostBreakdown[];
  contingency: number;
  laborCosts: number;
  materialCosts: number;
  permitCosts?: number;
  professionalFees?: number;
  temporaryMeasures?: number;
  demolitionCosts?: number;
  debrisRemoval?: number;
  estimatedBy: string;
  estimateDate: Date;
  validUntil?: Date;
  notes: string;
}

interface CostBreakdown {
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  priority: 'emergency' | 'high' | 'medium' | 'low';
}

interface AssessmentPhoto {
  id: string;
  url: string;
  thumbnailUrl?: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  capturedAt: Date;
  uploadedAt: Date;
  uploadedBy: string;
  location?: { lat: number; lon: number };
  direction?: string;
  category: string;
  description: string;
  tags: string[];
  isAnnotated: boolean;
  annotations?: PhotoAnnotation[];
}

interface PhotoAnnotation {
  type: 'arrow' | 'circle' | 'rectangle' | 'text';
  coordinates: { x: number; y: number; width?: number; height?: number };
  label: string;
  color: string;
}

interface AssessmentDocument {
  id: string;
  type: 'report' | 'permit' | 'estimate' | 'insurance' | 'engineering' | 'legal' | 'other';
  name: string;
  url: string;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

interface AssessmentEvent {
  id: string;
  timestamp: Date;
  type: 'created' | 'inspection_started' | 'inspection_completed' | 'status_changed' | 'cost_updated' | 'document_added' | 'verified' | 'appealed' | 'note';
  description: string;
  actor: string;
  details?: Record<string, any>;
}

interface AssessmentFlag {
  type: 'urgent' | 'safety_concern' | 'needs_review' | 'incomplete' | 'disputed' | 'historic_property';
  reason: string;
  createdAt: Date;
  createdBy: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

interface InsuranceClaim {
  claimNumber?: string;
  insuranceCompany?: string;
  policyNumber?: string;
  claimStatus: 'not_filed' | 'filed' | 'under_review' | 'approved' | 'denied' | 'partial' | 'closed';
  claimAmount?: number;
  approvedAmount?: number;
  deductible?: number;
  adjusterName?: string;
  adjusterPhone?: string;
  filedDate?: Date;
  lastUpdateDate?: Date;
  notes?: string;
}

// Area and summary interfaces
interface DamageArea {
  id: string;
  name: string;
  incidentId: string;
  boundary: { lat: number; lon: number }[];
  center: { lat: number; lon: number };
  areaSquareKm: number;
  assessmentCount: number;
  summaryStats: AreaSummaryStats;
  status: 'defining' | 'assessing' | 'assessed' | 'verified';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTeams: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AreaSummaryStats {
  totalProperties: number;
  assessedProperties: number;
  bySeverity: Record<DamageSeverity, number>;
  byPropertyType: Record<PropertyType, number>;
  totalEstimatedDamage: number;
  uninhabitableCount: number;
  hazardCount: number;
}

interface DamageSummary {
  incidentId: string;
  incidentName: string;
  reportDate: Date;
  areas: DamageArea[];
  overallStats: {
    totalAssessments: number;
    completedAssessments: number;
    pendingAssessments: number;
    bySeverity: Record<DamageSeverity, number>;
    byCategory: Record<DamageCategory, number>;
    totalEstimatedCost: number;
    structuralRatings: Record<StructuralRating, number>;
  };
  criticalFindings: string[];
  recommendations: string[];
}

// Team and assignment interfaces
interface AssessmentTeam {
  id: string;
  name: string;
  incidentId?: string;
  members: TeamMember[];
  certifications: string[];
  equipment: string[];
  assignedAreaId?: string;
  currentAssignments: string[];
  completedAssessments: number;
  status: 'available' | 'deployed' | 'unavailable';
  location?: { lat: number; lon: number };
  lastCheckIn?: Date;
}

interface TeamMember {
  id: string;
  name: string;
  role: 'lead' | 'inspector' | 'engineer' | 'photographer' | 'support';
  certifications: string[];
  phone?: string;
  email?: string;
}

interface AssessmentAssignment {
  id: string;
  assessmentId: string;
  teamId: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedAt: Date;
  dueBy?: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: 'assigned' | 'en_route' | 'on_site' | 'completed' | 'cancelled';
  notes?: string;
}

// Sample data
const sampleAssessments: DamageAssessment[] = [
  {
    id: 'assess-001',
    assessmentNumber: 'DA-2024-001-0001',
    incidentId: 'incident-001',
    type: 'rapid',
    status: 'completed',
    property: {
      address: {
        street: '123 Main St',
        city: 'Metro City',
        state: 'CA',
        zipCode: '94102',
        country: 'USA'
      },
      coordinates: { lat: 37.7749, lon: -122.4194 },
      propertyType: 'single_family',
      yearBuilt: 1985,
      squareFootage: 2200,
      stories: 2
    },
    damage: {
      overallSeverity: 'moderate',
      categories: [
        {
          category: 'structural',
          severity: 'moderate',
          percentAffected: 30,
          components: [
            { component: 'Roof', severity: 'moderate', damageType: 'Wind damage', repairRequired: true, estimatedCost: 8000 }
          ],
          description: 'Roof damage from wind, some shingles missing'
        }
      ],
      primaryCause: 'Wind damage from storm',
      affectedAreas: [
        { name: 'Roof', type: 'structure', severity: 'moderate', description: 'Multiple shingles displaced', photos: [] }
      ],
      hazards: [],
      utilities: {
        electricity: { status: 'working' },
        gas: { status: 'working' },
        water: { status: 'working' },
        sewer: { status: 'working' },
        hvac: { status: 'working' },
        communications: { status: 'working' }
      },
      accessStatus: 'accessible',
      habitability: 'habitable',
      description: 'Moderate wind damage to roof, property remains habitable'
    },
    inspection: {
      inspectorId: 'inspector-001',
      inspectorName: 'John Smith',
      organization: 'Metro Building Dept',
      inspectionDate: new Date(),
      duration: 45,
      methodology: 'Visual inspection',
      tools: ['Camera', 'Measuring tape', 'Level']
    },
    costEstimate: {
      totalEstimate: 12500,
      currency: 'USD',
      methodology: 'unit_cost',
      confidence: 'medium',
      breakdown: [
        { category: 'Roofing', description: 'Shingle replacement', quantity: 200, unit: 'sqft', unitCost: 40, totalCost: 8000, priority: 'high' },
        { category: 'Labor', description: 'Installation labor', quantity: 16, unit: 'hours', unitCost: 75, totalCost: 1200, priority: 'high' }
      ],
      contingency: 1500,
      laborCosts: 3000,
      materialCosts: 8000,
      estimatedBy: 'John Smith',
      estimateDate: new Date(),
      notes: 'Estimate based on current market rates'
    },
    photos: [],
    documents: [],
    timeline: [
      { id: 'event-001', timestamp: new Date(), type: 'created', description: 'Assessment created', actor: 'System' }
    ],
    flags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class DamageAssessmentService {
  private static instance: DamageAssessmentService;
  private assessments: Map<string, DamageAssessment> = new Map();
  private areas: Map<string, DamageArea> = new Map();
  private teams: Map<string, AssessmentTeam> = new Map();
  private assignments: Map<string, AssessmentAssignment> = new Map();
  private assessmentCounter: Map<string, number> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): DamageAssessmentService {
    if (!DamageAssessmentService.instance) {
      DamageAssessmentService.instance = new DamageAssessmentService();
    }
    return DamageAssessmentService.instance;
  }

  private initializeSampleData(): void {
    sampleAssessments.forEach(a => this.assessments.set(a.id, a));
  }

  private generateAssessmentNumber(incidentId: string): string {
    const count = (this.assessmentCounter.get(incidentId) || 0) + 1;
    this.assessmentCounter.set(incidentId, count);
    const year = new Date().getFullYear();
    return `DA-${year}-${incidentId.substring(0, 3).toUpperCase()}-${String(count).padStart(4, '0')}`;
  }

  // ==================== Assessment Management ====================

  async createAssessment(params: {
    incidentId: string;
    type: AssessmentType;
    property: PropertyInfo;
    inspectorId?: string;
    inspectorName?: string;
  }): Promise<DamageAssessment> {
    const assessment: DamageAssessment = {
      id: `assess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assessmentNumber: this.generateAssessmentNumber(params.incidentId),
      incidentId: params.incidentId,
      type: params.type,
      status: 'pending',
      property: params.property,
      damage: {
        overallSeverity: 'none',
        categories: [],
        primaryCause: '',
        affectedAreas: [],
        hazards: [],
        utilities: {
          electricity: { status: 'working' },
          gas: { status: 'working' },
          water: { status: 'working' },
          sewer: { status: 'working' },
          hvac: { status: 'working' },
          communications: { status: 'working' }
        },
        accessStatus: 'accessible',
        habitability: 'habitable',
        description: ''
      },
      inspection: params.inspectorId ? {
        inspectorId: params.inspectorId,
        inspectorName: params.inspectorName || 'Unknown',
        inspectionDate: new Date(),
        duration: 0,
        methodology: '',
        tools: []
      } : undefined as any,
      photos: [],
      documents: [],
      timeline: [{
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        type: 'created',
        description: 'Assessment created',
        actor: params.inspectorName || 'System'
      }],
      flags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  async getAssessment(assessmentId: string): Promise<DamageAssessment | null> {
    return this.assessments.get(assessmentId) || null;
  }

  async getAssessmentByNumber(assessmentNumber: string): Promise<DamageAssessment | null> {
    return Array.from(this.assessments.values())
      .find(a => a.assessmentNumber === assessmentNumber) || null;
  }

  async searchAssessments(query: {
    incidentId?: string;
    status?: AssessmentStatus[];
    severity?: DamageSeverity[];
    propertyType?: PropertyType[];
    structuralRating?: StructuralRating[];
    areaId?: string;
    inspectorId?: string;
    dateRange?: { start: Date; end: Date };
    hasHazards?: boolean;
    uninhabitableOnly?: boolean;
    minCost?: number;
    maxCost?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ assessments: DamageAssessment[]; total: number }> {
    let assessments = Array.from(this.assessments.values());

    if (query.incidentId) {
      assessments = assessments.filter(a => a.incidentId === query.incidentId);
    }

    if (query.status && query.status.length > 0) {
      assessments = assessments.filter(a => query.status!.includes(a.status));
    }

    if (query.severity && query.severity.length > 0) {
      assessments = assessments.filter(a => query.severity!.includes(a.damage.overallSeverity));
    }

    if (query.propertyType && query.propertyType.length > 0) {
      assessments = assessments.filter(a => query.propertyType!.includes(a.property.propertyType));
    }

    if (query.structuralRating && query.structuralRating.length > 0) {
      assessments = assessments.filter(a =>
        a.structuralEvaluation && query.structuralRating!.includes(a.structuralEvaluation.rating)
      );
    }

    if (query.inspectorId) {
      assessments = assessments.filter(a => a.inspection?.inspectorId === query.inspectorId);
    }

    if (query.dateRange) {
      assessments = assessments.filter(a =>
        a.createdAt >= query.dateRange!.start && a.createdAt <= query.dateRange!.end
      );
    }

    if (query.hasHazards) {
      assessments = assessments.filter(a => a.damage.hazards.length > 0);
    }

    if (query.uninhabitableOnly) {
      assessments = assessments.filter(a => a.damage.habitability === 'uninhabitable');
    }

    if (query.minCost !== undefined) {
      assessments = assessments.filter(a =>
        a.costEstimate && a.costEstimate.totalEstimate >= query.minCost!
      );
    }

    if (query.maxCost !== undefined) {
      assessments = assessments.filter(a =>
        a.costEstimate && a.costEstimate.totalEstimate <= query.maxCost!
      );
    }

    assessments.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const total = assessments.length;
    const offset = query.offset || 0;
    const limit = query.limit || 50;

    return {
      assessments: assessments.slice(offset, offset + limit),
      total
    };
  }

  async updateAssessmentStatus(assessmentId: string, status: AssessmentStatus, actor: string, notes?: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    assessment.status = status;
    assessment.updatedAt = new Date();
    assessment.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'status_changed',
      description: `Status changed to ${status}${notes ? `: ${notes}` : ''}`,
      actor
    });

    return assessment;
  }

  // ==================== Damage Recording ====================

  async recordDamage(assessmentId: string, damage: Partial<DamageInfo>, actor: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    Object.assign(assessment.damage, damage);
    
    // Recalculate overall severity if categories provided
    if (damage.categories) {
      assessment.damage.overallSeverity = this.calculateOverallSeverity(damage.categories);
    }

    assessment.updatedAt = new Date();
    assessment.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'note',
      description: 'Damage information updated',
      actor,
      details: damage
    });

    return assessment;
  }

  private calculateOverallSeverity(categories: CategoryDamage[]): DamageSeverity {
    if (categories.length === 0) return 'none';

    const severityOrder: DamageSeverity[] = ['none', 'minor', 'moderate', 'major', 'severe', 'destroyed'];
    const maxSeverityIndex = Math.max(...categories.map(c => severityOrder.indexOf(c.severity)));

    return severityOrder[maxSeverityIndex];
  }

  async addCategoryDamage(assessmentId: string, category: CategoryDamage, actor: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    const existingIndex = assessment.damage.categories.findIndex(c => c.category === category.category);
    if (existingIndex >= 0) {
      assessment.damage.categories[existingIndex] = category;
    } else {
      assessment.damage.categories.push(category);
    }

    assessment.damage.overallSeverity = this.calculateOverallSeverity(assessment.damage.categories);
    assessment.updatedAt = new Date();

    return assessment;
  }

  async addHazard(assessmentId: string, hazard: HazardInfo, actor: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    assessment.damage.hazards.push(hazard);
    assessment.updatedAt = new Date();

    // Flag for safety concern if high severity
    if (hazard.severity === 'high' || hazard.severity === 'critical') {
      assessment.flags.push({
        type: 'safety_concern',
        reason: `${hazard.type} hazard: ${hazard.description}`,
        createdAt: new Date(),
        createdBy: actor,
        resolved: false
      });
    }

    return assessment;
  }

  async updateUtilityStatus(assessmentId: string, utilities: Partial<UtilityStatus>, actor: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    Object.assign(assessment.damage.utilities, utilities);
    assessment.updatedAt = new Date();

    return assessment;
  }

  // ==================== Structural Evaluation ====================

  async recordStructuralEvaluation(assessmentId: string, evaluation: StructuralEvaluation, actor: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    assessment.structuralEvaluation = evaluation;
    assessment.updatedAt = new Date();

    // Update habitability based on structural rating
    if (evaluation.rating === 'unsafe' || evaluation.rating === 'area_unsafe') {
      assessment.damage.habitability = 'uninhabitable';
    } else if (evaluation.rating === 'unsafe_limited') {
      assessment.damage.habitability = 'limited';
    }

    assessment.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'note',
      description: `Structural evaluation completed: ${evaluation.rating}`,
      actor
    });

    return assessment;
  }

  // ==================== Cost Estimation ====================

  async createCostEstimate(assessmentId: string, estimate: Omit<CostEstimate, 'estimateDate'>, actor: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    assessment.costEstimate = {
      ...estimate,
      estimateDate: new Date(),
      estimatedBy: actor
    };
    assessment.updatedAt = new Date();

    assessment.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'cost_updated',
      description: `Cost estimate: $${estimate.totalEstimate.toLocaleString()}`,
      actor
    });

    return assessment;
  }

  async updateCostEstimate(assessmentId: string, updates: Partial<CostEstimate>, actor: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);
    if (!assessment.costEstimate) throw new Error('No existing cost estimate');

    Object.assign(assessment.costEstimate, updates, { estimateDate: new Date() });
    assessment.updatedAt = new Date();

    return assessment;
  }

  // ==================== Photos and Documents ====================

  async addPhoto(assessmentId: string, photo: Omit<AssessmentPhoto, 'id' | 'uploadedAt'>): Promise<AssessmentPhoto> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    const newPhoto: AssessmentPhoto = {
      ...photo,
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date(),
      isAnnotated: false
    };

    assessment.photos.push(newPhoto);
    assessment.updatedAt = new Date();

    return newPhoto;
  }

  async addDocument(assessmentId: string, document: Omit<AssessmentDocument, 'id' | 'uploadedAt'>): Promise<AssessmentDocument> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    const newDoc: AssessmentDocument = {
      ...document,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date()
    };

    assessment.documents.push(newDoc);
    assessment.updatedAt = new Date();

    assessment.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'document_added',
      description: `Document added: ${document.name}`,
      actor: document.uploadedBy
    });

    return newDoc;
  }

  // ==================== Insurance ====================

  async updateInsuranceClaim(assessmentId: string, claim: Partial<InsuranceClaim>, actor: string): Promise<DamageAssessment> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    if (!assessment.insuranceClaim) {
      assessment.insuranceClaim = {
        claimStatus: 'not_filed'
      };
    }

    Object.assign(assessment.insuranceClaim, claim, { lastUpdateDate: new Date() });
    assessment.updatedAt = new Date();

    return assessment;
  }

  // ==================== Area Management ====================

  async createDamageArea(params: {
    name: string;
    incidentId: string;
    boundary: { lat: number; lon: number }[];
    priority: DamageArea['priority'];
  }): Promise<DamageArea> {
    const lats = params.boundary.map(p => p.lat);
    const lons = params.boundary.map(p => p.lon);
    const center = {
      lat: lats.reduce((a, b) => a + b, 0) / lats.length,
      lon: lons.reduce((a, b) => a + b, 0) / lons.length
    };

    // Calculate area using shoelace formula (approximate)
    let area = 0;
    for (let i = 0; i < params.boundary.length; i++) {
      const j = (i + 1) % params.boundary.length;
      area += params.boundary[i].lat * params.boundary[j].lon;
      area -= params.boundary[j].lat * params.boundary[i].lon;
    }
    const areaSquareKm = Math.abs(area / 2) * 111.32 * 111.32 / 1000000;

    const damageArea: DamageArea = {
      id: `area-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      incidentId: params.incidentId,
      boundary: params.boundary,
      center,
      areaSquareKm,
      assessmentCount: 0,
      summaryStats: {
        totalProperties: 0,
        assessedProperties: 0,
        bySeverity: { none: 0, minor: 0, moderate: 0, major: 0, severe: 0, destroyed: 0 },
        byPropertyType: {} as Record<PropertyType, number>,
        totalEstimatedDamage: 0,
        uninhabitableCount: 0,
        hazardCount: 0
      },
      status: 'defining',
      priority: params.priority,
      assignedTeams: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.areas.set(damageArea.id, damageArea);
    return damageArea;
  }

  async getDamageArea(areaId: string): Promise<DamageArea | null> {
    return this.areas.get(areaId) || null;
  }

  async getDamageAreas(incidentId?: string): Promise<DamageArea[]> {
    let areas = Array.from(this.areas.values());

    if (incidentId) {
      areas = areas.filter(a => a.incidentId === incidentId);
    }

    return areas.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async updateAreaStats(areaId: string): Promise<DamageArea> {
    const area = this.areas.get(areaId);
    if (!area) throw new Error(`Area not found: ${areaId}`);

    const assessments = Array.from(this.assessments.values())
      .filter(a => a.incidentId === area.incidentId);

    // Filter assessments within area bounds (simplified point-in-polygon)
    const areaAssessments = assessments.filter(a => {
      if (!a.property.coordinates) return false;
      return this.isPointInPolygon(a.property.coordinates, area.boundary);
    });

    const stats: AreaSummaryStats = {
      totalProperties: areaAssessments.length,
      assessedProperties: areaAssessments.filter(a => a.status !== 'pending').length,
      bySeverity: { none: 0, minor: 0, moderate: 0, major: 0, severe: 0, destroyed: 0 },
      byPropertyType: {} as Record<PropertyType, number>,
      totalEstimatedDamage: 0,
      uninhabitableCount: 0,
      hazardCount: 0
    };

    areaAssessments.forEach(a => {
      stats.bySeverity[a.damage.overallSeverity]++;
      stats.byPropertyType[a.property.propertyType] = (stats.byPropertyType[a.property.propertyType] || 0) + 1;
      if (a.costEstimate) {
        stats.totalEstimatedDamage += a.costEstimate.totalEstimate;
      }
      if (a.damage.habitability === 'uninhabitable') {
        stats.uninhabitableCount++;
      }
      stats.hazardCount += a.damage.hazards.length;
    });

    area.summaryStats = stats;
    area.assessmentCount = areaAssessments.length;
    area.updatedAt = new Date();

    return area;
  }

  private isPointInPolygon(point: { lat: number; lon: number }, polygon: { lat: number; lon: number }[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lon, yi = polygon[i].lat;
      const xj = polygon[j].lon, yj = polygon[j].lat;
      
      if (((yi > point.lat) !== (yj > point.lat)) &&
          (point.lon < (xj - xi) * (point.lat - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }

  // ==================== Team Management ====================

  async createTeam(params: {
    name: string;
    incidentId?: string;
    members: TeamMember[];
    certifications: string[];
    equipment: string[];
  }): Promise<AssessmentTeam> {
    const team: AssessmentTeam = {
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      incidentId: params.incidentId,
      members: params.members,
      certifications: params.certifications,
      equipment: params.equipment,
      currentAssignments: [],
      completedAssessments: 0,
      status: 'available'
    };

    this.teams.set(team.id, team);
    return team;
  }

  async getTeams(incidentId?: string): Promise<AssessmentTeam[]> {
    let teams = Array.from(this.teams.values());

    if (incidentId) {
      teams = teams.filter(t => t.incidentId === incidentId);
    }

    return teams;
  }

  async assignTeamToAssessment(teamId: string, assessmentId: string, priority: AssessmentAssignment['priority']): Promise<AssessmentAssignment> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error(`Team not found: ${teamId}`);

    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);

    const assignment: AssessmentAssignment = {
      id: `assign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assessmentId,
      teamId,
      priority,
      assignedAt: new Date(),
      status: 'assigned'
    };

    this.assignments.set(assignment.id, assignment);
    team.currentAssignments.push(assessmentId);
    team.status = 'deployed';

    return assignment;
  }

  async completeAssignment(assignmentId: string): Promise<AssessmentAssignment> {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    assignment.status = 'completed';
    assignment.completedAt = new Date();

    const team = this.teams.get(assignment.teamId);
    if (team) {
      team.currentAssignments = team.currentAssignments.filter(a => a !== assignment.assessmentId);
      team.completedAssessments++;
      if (team.currentAssignments.length === 0) {
        team.status = 'available';
      }
    }

    return assignment;
  }

  // ==================== Reporting ====================

  async generateDamageSummary(incidentId: string): Promise<DamageSummary> {
    const assessments = Array.from(this.assessments.values())
      .filter(a => a.incidentId === incidentId);
    
    const areas = await this.getDamageAreas(incidentId);

    const overallStats = {
      totalAssessments: assessments.length,
      completedAssessments: assessments.filter(a => a.status === 'completed' || a.status === 'verified').length,
      pendingAssessments: assessments.filter(a => a.status === 'pending' || a.status === 'in_progress').length,
      bySeverity: { none: 0, minor: 0, moderate: 0, major: 0, severe: 0, destroyed: 0 } as Record<DamageSeverity, number>,
      byCategory: {} as Record<DamageCategory, number>,
      totalEstimatedCost: 0,
      structuralRatings: { safe: 0, restricted_use: 0, unsafe_limited: 0, unsafe: 0, area_unsafe: 0 } as Record<StructuralRating, number>
    };

    assessments.forEach(a => {
      overallStats.bySeverity[a.damage.overallSeverity]++;
      
      a.damage.categories.forEach(c => {
        overallStats.byCategory[c.category] = (overallStats.byCategory[c.category] || 0) + 1;
      });

      if (a.costEstimate) {
        overallStats.totalEstimatedCost += a.costEstimate.totalEstimate;
      }

      if (a.structuralEvaluation) {
        overallStats.structuralRatings[a.structuralEvaluation.rating]++;
      }
    });

    const criticalFindings: string[] = [];
    if (overallStats.bySeverity.destroyed > 0) {
      criticalFindings.push(`${overallStats.bySeverity.destroyed} properties completely destroyed`);
    }
    if (overallStats.structuralRatings.unsafe > 0) {
      criticalFindings.push(`${overallStats.structuralRatings.unsafe} structures marked unsafe`);
    }

    const uninhabitableCount = assessments.filter(a => a.damage.habitability === 'uninhabitable').length;
    if (uninhabitableCount > 0) {
      criticalFindings.push(`${uninhabitableCount} properties currently uninhabitable`);
    }

    const hazardCount = assessments.reduce((sum, a) => sum + a.damage.hazards.filter(h => h.severity === 'critical').length, 0);
    if (hazardCount > 0) {
      criticalFindings.push(`${hazardCount} critical hazards require immediate attention`);
    }

    return {
      incidentId,
      incidentName: `Incident ${incidentId}`,
      reportDate: new Date(),
      areas,
      overallStats,
      criticalFindings,
      recommendations: [
        'Continue systematic assessment of affected areas',
        'Prioritize safety hazard mitigation',
        'Coordinate with insurance adjusters for claim processing',
        'Document all damage with photographs'
      ]
    };
  }

  // ==================== Statistics ====================

  async getStatistics(incidentId?: string): Promise<{
    totalAssessments: number;
    byStatus: Record<AssessmentStatus, number>;
    bySeverity: Record<DamageSeverity, number>;
    totalEstimatedDamage: number;
    avgAssessmentTime: number;
    teamsDeployed: number;
    areasAssessed: number;
  }> {
    let assessments = Array.from(this.assessments.values());

    if (incidentId) {
      assessments = assessments.filter(a => a.incidentId === incidentId);
    }

    const byStatus: Record<AssessmentStatus, number> = {
      pending: 0, in_progress: 0, preliminary: 0, completed: 0, verified: 0, appealed: 0
    };
    const bySeverity: Record<DamageSeverity, number> = {
      none: 0, minor: 0, moderate: 0, major: 0, severe: 0, destroyed: 0
    };

    let totalCost = 0;
    let totalDuration = 0;
    let durationCount = 0;

    assessments.forEach(a => {
      byStatus[a.status]++;
      bySeverity[a.damage.overallSeverity]++;
      if (a.costEstimate) {
        totalCost += a.costEstimate.totalEstimate;
      }
      if (a.inspection?.duration) {
        totalDuration += a.inspection.duration;
        durationCount++;
      }
    });

    const teams = await this.getTeams(incidentId);
    const areas = await this.getDamageAreas(incidentId);

    return {
      totalAssessments: assessments.length,
      byStatus,
      bySeverity,
      totalEstimatedDamage: totalCost,
      avgAssessmentTime: durationCount > 0 ? totalDuration / durationCount : 0,
      teamsDeployed: teams.filter(t => t.status === 'deployed').length,
      areasAssessed: areas.filter(a => a.status === 'assessed' || a.status === 'verified').length
    };
  }
}

export const damageAssessmentService = DamageAssessmentService.getInstance();
export default DamageAssessmentService;

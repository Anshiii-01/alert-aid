/**
 * Epidemic Surveillance Service - Issue #129 Implementation
 * 
 * Provides comprehensive disease outbreak monitoring, case tracking,
 * contact tracing, syndromic surveillance, and early warning systems
 * for public health emergency response.
 */

// Type definitions
type DiseaseCategory = 'respiratory' | 'gastrointestinal' | 'vector_borne' | 'sexually_transmitted' | 'vaccine_preventable' | 'zoonotic' | 'bloodborne' | 'neurological' | 'unknown';
type TransmissionMode = 'airborne' | 'droplet' | 'contact' | 'fecal_oral' | 'vector' | 'bloodborne' | 'sexual' | 'vertical' | 'unknown';
type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical';
type CaseStatus = 'suspected' | 'probable' | 'confirmed' | 'recovered' | 'deceased' | 'unknown';
type SurveillanceLevel = 'routine' | 'enhanced' | 'intensive' | 'emergency';
type AlertTrigger = 'threshold_exceeded' | 'unusual_pattern' | 'novel_pathogen' | 'geographic_spread' | 'mortality_increase' | 'healthcare_surge';

// Disease and pathogen interfaces
interface Disease {
  id: string;
  name: string;
  icdCode: string;
  category: DiseaseCategory;
  pathogen: Pathogen;
  transmissionModes: TransmissionMode[];
  incubationPeriod: { min: number; max: number; unit: 'hours' | 'days' };
  infectiousPeriod: { min: number; max: number; unit: 'days' };
  r0?: number; // Basic reproduction number
  caseFatalityRate?: number;
  symptoms: string[];
  riskFactors: string[];
  preventionMeasures: string[];
  treatmentProtocols: string[];
  reportable: boolean;
  reportingTimeframe?: number; // hours
  notifiableCondition: boolean;
  vaccinationAvailable: boolean;
}

interface Pathogen {
  name: string;
  type: 'virus' | 'bacteria' | 'parasite' | 'fungus' | 'prion' | 'unknown';
  family?: string;
  genus?: string;
  species?: string;
  strain?: string;
  geneticSequence?: string;
  variants?: PathogenVariant[];
}

interface PathogenVariant {
  id: string;
  name: string;
  mutations: string[];
  transmissibility: 'lower' | 'similar' | 'higher';
  severity: 'lower' | 'similar' | 'higher';
  vaccineEfficacy?: number;
  firstDetected: Date;
  prevalence: number;
}

// Case management interfaces
interface Case {
  id: string;
  caseNumber: string;
  diseaseId: string;
  status: CaseStatus;
  severity: SeverityLevel;
  patient: PatientInfo;
  clinicalInfo: ClinicalInfo;
  epidemiologicalInfo: EpidemiologicalInfo;
  labResults: LabResult[];
  contacts: ContactInfo[];
  timeline: CaseEvent[];
  reportedBy: string;
  reportedAt: Date;
  confirmedAt?: Date;
  resolvedAt?: Date;
  notes: string;
}

interface PatientInfo {
  id: string;
  anonymizedId: string;
  age: number;
  ageGroup: '0-4' | '5-17' | '18-44' | '45-64' | '65-74' | '75+';
  gender: 'male' | 'female' | 'other';
  occupation?: string;
  healthcareWorker: boolean;
  location: {
    jurisdiction: string;
    zipCode: string;
    coordinates?: { lat: number; lon: number };
  };
  underlyingConditions: string[];
  vaccinationStatus?: {
    vaccinated: boolean;
    doses?: number;
    lastDoseDate?: Date;
    vaccine?: string;
  };
}

interface ClinicalInfo {
  onsetDate: Date;
  symptoms: SymptomRecord[];
  hospitalized: boolean;
  hospitalizationDate?: Date;
  icuAdmission: boolean;
  icuDate?: Date;
  mechanicalVentilation: boolean;
  outcome?: 'recovered' | 'ongoing' | 'deceased';
  outcomeDate?: Date;
  treatmentReceived: string[];
}

interface SymptomRecord {
  symptom: string;
  onsetDate: Date;
  severity: SeverityLevel;
  resolved: boolean;
  resolvedDate?: Date;
}

interface EpidemiologicalInfo {
  exposureHistory: ExposureEvent[];
  travelHistory: TravelRecord[];
  clusterAssociation?: string;
  transmissionSetting?: string;
  importedCase: boolean;
  sourceCountry?: string;
  investigationStatus: 'pending' | 'in_progress' | 'completed';
  investigator?: string;
}

interface ExposureEvent {
  id: string;
  type: 'household' | 'workplace' | 'healthcare' | 'social' | 'travel' | 'community' | 'unknown';
  date: Date;
  location: string;
  description: string;
  linkedCaseId?: string;
}

interface TravelRecord {
  destination: string;
  departureDate: Date;
  returnDate: Date;
  purpose: string;
}

interface LabResult {
  id: string;
  testType: string;
  testDate: Date;
  specimenType: string;
  specimenCollectionDate: Date;
  result: 'positive' | 'negative' | 'indeterminate' | 'pending';
  quantitativeResult?: number;
  unit?: string;
  laboratory: string;
  reportedDate: Date;
  sequenceData?: string;
  variantId?: string;
}

interface ContactInfo {
  id: string;
  name: string;
  relationship: string;
  exposureDate: Date;
  exposureType: 'household' | 'close' | 'casual';
  riskLevel: 'high' | 'medium' | 'low';
  quarantineRequired: boolean;
  quarantineStart?: Date;
  quarantineEnd?: Date;
  monitoringStatus: 'not_started' | 'active' | 'completed';
  symptoms: boolean;
  tested: boolean;
  testResult?: 'positive' | 'negative' | 'pending';
  convertedToCase?: string;
  contactInfo: { phone?: string; email?: string };
}

interface CaseEvent {
  timestamp: Date;
  type: 'reported' | 'investigated' | 'lab_result' | 'status_change' | 'hospitalized' | 'discharged' | 'deceased' | 'note';
  description: string;
  actor: string;
}

// Cluster and outbreak interfaces
interface Cluster {
  id: string;
  name: string;
  diseaseId: string;
  cases: string[];
  setting: string;
  location: {
    jurisdiction: string;
    address?: string;
    coordinates?: { lat: number; lon: number };
  };
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'contained' | 'resolved';
  attackRate?: number;
  transmissionPattern?: string;
  interventions: Intervention[];
  createdAt: Date;
}

interface Outbreak {
  id: string;
  name: string;
  diseaseId: string;
  declaration: {
    declaredBy: string;
    declaredAt: Date;
    authority: string;
  };
  geographicScope: 'local' | 'regional' | 'national' | 'international';
  affectedJurisdictions: string[];
  clusters: string[];
  totalCases: number;
  totalDeaths: number;
  surveillanceLevel: SurveillanceLevel;
  responseTeam: ResponseTeamMember[];
  objectives: string[];
  interventions: Intervention[];
  status: 'declared' | 'active' | 'declining' | 'ended';
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ResponseTeamMember {
  name: string;
  role: string;
  organization: string;
  contact: string;
  assignedAt: Date;
}

interface Intervention {
  id: string;
  type: 'isolation' | 'quarantine' | 'vaccination' | 'prophylaxis' | 'closure' | 'travel_restriction' | 'public_communication' | 'testing' | 'contact_tracing';
  description: string;
  targetPopulation?: string;
  startDate: Date;
  endDate?: Date;
  effectiveness?: number;
  implementedBy: string;
}

// Surveillance interfaces
interface SurveillanceReport {
  id: string;
  period: { start: Date; end: Date };
  jurisdiction: string;
  data: SurveillanceData;
  trends: TrendAnalysis[];
  alerts: SurveillanceAlert[];
  recommendations: string[];
  preparedBy: string;
  preparedAt: Date;
}

interface SurveillanceData {
  newCases: number;
  cumulativeCases: number;
  activeCases: number;
  recoveries: number;
  deaths: number;
  hospitalizations: number;
  icuAdmissions: number;
  testsPerformed: number;
  positivityRate: number;
  casesByAge: Record<string, number>;
  casesByGender: Record<string, number>;
  casesByJurisdiction: Record<string, number>;
  vaccinationCoverage?: number;
}

interface TrendAnalysis {
  metric: string;
  direction: 'increasing' | 'stable' | 'decreasing';
  percentChange: number;
  comparisonPeriod: string;
  significance: 'significant' | 'not_significant';
}

interface SurveillanceAlert {
  id: string;
  diseaseId: string;
  trigger: AlertTrigger;
  severity: 'low' | 'medium' | 'high' | 'critical';
  jurisdiction: string;
  description: string;
  metrics: { name: string; value: number; threshold: number }[];
  recommendedActions: string[];
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
}

// Syndromic surveillance interfaces
interface SyndromicSurveillance {
  id: string;
  syndrome: string;
  indicators: string[];
  dataSources: DataSource[];
  thresholds: AlertThreshold[];
  currentLevel: number;
  historicalBaseline: number;
  status: 'normal' | 'elevated' | 'alert';
  lastUpdated: Date;
}

interface DataSource {
  name: string;
  type: 'emergency_department' | 'urgent_care' | 'pharmacy' | 'laboratory' | 'school_absenteeism' | 'poison_control' | '911_calls' | 'social_media';
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  coverage: string;
  latency: number; // hours
  reliability: number; // 0-1
}

interface AlertThreshold {
  level: 'warning' | 'alert' | 'critical';
  value: number;
  duration?: number; // consecutive periods
  action: string;
}

// Sample data
const sampleDiseases: Disease[] = [
  {
    id: 'disease-001',
    name: 'COVID-19',
    icdCode: 'U07.1',
    category: 'respiratory',
    pathogen: {
      name: 'SARS-CoV-2',
      type: 'virus',
      family: 'Coronaviridae',
      genus: 'Betacoronavirus',
      variants: [
        { id: 'var-001', name: 'Omicron BA.5', mutations: ['L452R', 'F486V'], transmissibility: 'higher', severity: 'lower', vaccineEfficacy: 0.65, firstDetected: new Date('2022-01-01'), prevalence: 0.75 }
      ]
    },
    transmissionModes: ['airborne', 'droplet', 'contact'],
    incubationPeriod: { min: 2, max: 14, unit: 'days' },
    infectiousPeriod: { min: 2, max: 10, unit: 'days' },
    r0: 3.5,
    caseFatalityRate: 0.02,
    symptoms: ['fever', 'cough', 'fatigue', 'loss of taste/smell', 'difficulty breathing'],
    riskFactors: ['age over 65', 'immunocompromised', 'cardiovascular disease', 'diabetes', 'obesity'],
    preventionMeasures: ['vaccination', 'mask wearing', 'social distancing', 'hand hygiene', 'ventilation'],
    treatmentProtocols: ['supportive care', 'antiviral therapy', 'monoclonal antibodies', 'corticosteroids'],
    reportable: true,
    reportingTimeframe: 24,
    notifiableCondition: true,
    vaccinationAvailable: true
  },
  {
    id: 'disease-002',
    name: 'Influenza A',
    icdCode: 'J10',
    category: 'respiratory',
    pathogen: {
      name: 'Influenza A virus',
      type: 'virus',
      family: 'Orthomyxoviridae'
    },
    transmissionModes: ['droplet', 'contact'],
    incubationPeriod: { min: 1, max: 4, unit: 'days' },
    infectiousPeriod: { min: 1, max: 7, unit: 'days' },
    r0: 1.3,
    caseFatalityRate: 0.001,
    symptoms: ['fever', 'cough', 'body aches', 'headache', 'fatigue'],
    riskFactors: ['age over 65', 'children under 5', 'pregnancy', 'chronic conditions'],
    preventionMeasures: ['annual vaccination', 'hand hygiene', 'respiratory etiquette'],
    treatmentProtocols: ['supportive care', 'antiviral therapy (oseltamivir)'],
    reportable: true,
    reportingTimeframe: 24,
    notifiableCondition: true,
    vaccinationAvailable: true
  }
];

class EpidemicSurveillanceService {
  private static instance: EpidemicSurveillanceService;
  private diseases: Map<string, Disease> = new Map();
  private cases: Map<string, Case> = new Map();
  private clusters: Map<string, Cluster> = new Map();
  private outbreaks: Map<string, Outbreak> = new Map();
  private alerts: Map<string, SurveillanceAlert> = new Map();
  private syndromicData: Map<string, SyndromicSurveillance> = new Map();
  private reports: Map<string, SurveillanceReport> = new Map();
  private caseCounter: number = 0;

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): EpidemicSurveillanceService {
    if (!EpidemicSurveillanceService.instance) {
      EpidemicSurveillanceService.instance = new EpidemicSurveillanceService();
    }
    return EpidemicSurveillanceService.instance;
  }

  private initializeSampleData(): void {
    sampleDiseases.forEach(d => this.diseases.set(d.id, d));
    this.initializeSyndromicSurveillance();
  }

  private initializeSyndromicSurveillance(): void {
    const syndromes = [
      {
        syndrome: 'Influenza-like Illness',
        indicators: ['fever', 'cough', 'sore throat', 'body aches'],
        currentLevel: 4.2,
        historicalBaseline: 3.5
      },
      {
        syndrome: 'Acute Respiratory Illness',
        indicators: ['difficulty breathing', 'cough', 'chest pain'],
        currentLevel: 2.8,
        historicalBaseline: 2.5
      },
      {
        syndrome: 'Gastrointestinal Illness',
        indicators: ['vomiting', 'diarrhea', 'abdominal pain'],
        currentLevel: 1.5,
        historicalBaseline: 1.8
      }
    ];

    syndromes.forEach((s, i) => {
      const surveillance: SyndromicSurveillance = {
        id: `synd-${i + 1}`,
        syndrome: s.syndrome,
        indicators: s.indicators,
        dataSources: [
          { name: 'Emergency Departments', type: 'emergency_department', frequency: 'daily', coverage: 'Metro Area', latency: 24, reliability: 0.95 },
          { name: 'Urgent Care', type: 'urgent_care', frequency: 'daily', coverage: 'Metro Area', latency: 24, reliability: 0.85 }
        ],
        thresholds: [
          { level: 'warning', value: s.historicalBaseline * 1.2, action: 'Enhanced monitoring' },
          { level: 'alert', value: s.historicalBaseline * 1.5, action: 'Investigation required' },
          { level: 'critical', value: s.historicalBaseline * 2.0, action: 'Emergency response' }
        ],
        currentLevel: s.currentLevel,
        historicalBaseline: s.historicalBaseline,
        status: s.currentLevel > s.historicalBaseline * 1.5 ? 'alert' : s.currentLevel > s.historicalBaseline * 1.2 ? 'elevated' : 'normal',
        lastUpdated: new Date()
      };
      this.syndromicData.set(surveillance.id, surveillance);
    });
  }

  // ==================== Disease Management ====================

  async registerDisease(disease: Omit<Disease, 'id'>): Promise<Disease> {
    const newDisease: Disease = {
      ...disease,
      id: `disease-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.diseases.set(newDisease.id, newDisease);
    return newDisease;
  }

  async getDisease(diseaseId: string): Promise<Disease | null> {
    return this.diseases.get(diseaseId) || null;
  }

  async getAllDiseases(): Promise<Disease[]> {
    return Array.from(this.diseases.values());
  }

  async searchDiseases(query: { term?: string; category?: DiseaseCategory; reportable?: boolean }): Promise<Disease[]> {
    let diseases = Array.from(this.diseases.values());

    if (query.term) {
      const term = query.term.toLowerCase();
      diseases = diseases.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.icdCode.toLowerCase().includes(term) ||
        d.pathogen.name.toLowerCase().includes(term)
      );
    }

    if (query.category) {
      diseases = diseases.filter(d => d.category === query.category);
    }

    if (query.reportable !== undefined) {
      diseases = diseases.filter(d => d.reportable === query.reportable);
    }

    return diseases;
  }

  // ==================== Case Management ====================

  async reportCase(params: {
    diseaseId: string;
    patient: PatientInfo;
    clinicalInfo: ClinicalInfo;
    reportedBy: string;
    labResults?: LabResult[];
    status?: CaseStatus;
  }): Promise<Case> {
    const disease = this.diseases.get(params.diseaseId);
    if (!disease) throw new Error(`Disease not found: ${params.diseaseId}`);

    this.caseCounter++;
    const caseNumber = `CASE-${new Date().getFullYear()}-${String(this.caseCounter).padStart(6, '0')}`;

    const newCase: Case = {
      id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      caseNumber,
      diseaseId: params.diseaseId,
      status: params.status || 'suspected',
      severity: this.assessSeverity(params.clinicalInfo),
      patient: params.patient,
      clinicalInfo: params.clinicalInfo,
      epidemiologicalInfo: {
        exposureHistory: [],
        travelHistory: [],
        investigationStatus: 'pending',
        importedCase: false
      },
      labResults: params.labResults || [],
      contacts: [],
      timeline: [{
        timestamp: new Date(),
        type: 'reported',
        description: 'Case reported',
        actor: params.reportedBy
      }],
      reportedBy: params.reportedBy,
      reportedAt: new Date(),
      notes: ''
    };

    this.cases.set(newCase.id, newCase);

    // Check for alert conditions
    await this.checkAlertConditions(params.diseaseId, params.patient.location.jurisdiction);

    return newCase;
  }

  private assessSeverity(clinicalInfo: ClinicalInfo): SeverityLevel {
    if (clinicalInfo.mechanicalVentilation) return 'critical';
    if (clinicalInfo.icuAdmission) return 'severe';
    if (clinicalInfo.hospitalized) return 'moderate';
    return 'mild';
  }

  async getCase(caseId: string): Promise<Case | null> {
    return this.cases.get(caseId) || null;
  }

  async getCaseByCaseNumber(caseNumber: string): Promise<Case | null> {
    return Array.from(this.cases.values())
      .find(c => c.caseNumber === caseNumber) || null;
  }

  async updateCaseStatus(caseId: string, status: CaseStatus, updatedBy: string): Promise<Case> {
    const caseRecord = this.cases.get(caseId);
    if (!caseRecord) throw new Error(`Case not found: ${caseId}`);

    caseRecord.status = status;

    if (status === 'confirmed' && !caseRecord.confirmedAt) {
      caseRecord.confirmedAt = new Date();
    }

    if (status === 'recovered' || status === 'deceased') {
      caseRecord.resolvedAt = new Date();
      caseRecord.clinicalInfo.outcome = status === 'recovered' ? 'recovered' : 'deceased';
      caseRecord.clinicalInfo.outcomeDate = new Date();
    }

    caseRecord.timeline.push({
      timestamp: new Date(),
      type: 'status_change',
      description: `Status changed to ${status}`,
      actor: updatedBy
    });

    return caseRecord;
  }

  async addLabResult(caseId: string, labResult: Omit<LabResult, 'id'>): Promise<Case> {
    const caseRecord = this.cases.get(caseId);
    if (!caseRecord) throw new Error(`Case not found: ${caseId}`);

    const result: LabResult = {
      ...labResult,
      id: `lab-${Date.now()}`
    };

    caseRecord.labResults.push(result);

    // Auto-update status if positive and currently suspected
    if (result.result === 'positive' && caseRecord.status === 'suspected') {
      caseRecord.status = 'confirmed';
      caseRecord.confirmedAt = new Date();
    }

    caseRecord.timeline.push({
      timestamp: new Date(),
      type: 'lab_result',
      description: `Lab result: ${result.testType} - ${result.result}`,
      actor: 'Laboratory'
    });

    return caseRecord;
  }

  async searchCases(query: {
    diseaseId?: string;
    status?: CaseStatus[];
    jurisdiction?: string;
    dateRange?: { start: Date; end: Date };
  }): Promise<Case[]> {
    let cases = Array.from(this.cases.values());

    if (query.diseaseId) {
      cases = cases.filter(c => c.diseaseId === query.diseaseId);
    }

    if (query.status && query.status.length > 0) {
      cases = cases.filter(c => query.status!.includes(c.status));
    }

    if (query.jurisdiction) {
      cases = cases.filter(c => 
        c.patient.location.jurisdiction.toLowerCase().includes(query.jurisdiction!.toLowerCase())
      );
    }

    if (query.dateRange) {
      cases = cases.filter(c =>
        c.reportedAt >= query.dateRange!.start && c.reportedAt <= query.dateRange!.end
      );
    }

    return cases.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
  }

  // ==================== Contact Tracing ====================

  async addContact(caseId: string, contact: Omit<ContactInfo, 'id' | 'convertedToCase'>): Promise<Case> {
    const caseRecord = this.cases.get(caseId);
    if (!caseRecord) throw new Error(`Case not found: ${caseId}`);

    const newContact: ContactInfo = {
      ...contact,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    };

    // Calculate quarantine dates based on disease
    const disease = this.diseases.get(caseRecord.diseaseId);
    if (disease && newContact.quarantineRequired) {
      newContact.quarantineStart = newContact.exposureDate;
      newContact.quarantineEnd = new Date(
        newContact.exposureDate.getTime() + disease.incubationPeriod.max * 24 * 60 * 60 * 1000
      );
    }

    caseRecord.contacts.push(newContact);

    return caseRecord;
  }

  async updateContactStatus(caseId: string, contactId: string, updates: Partial<ContactInfo>): Promise<ContactInfo> {
    const caseRecord = this.cases.get(caseId);
    if (!caseRecord) throw new Error(`Case not found: ${caseId}`);

    const contact = caseRecord.contacts.find(c => c.id === contactId);
    if (!contact) throw new Error(`Contact not found: ${contactId}`);

    Object.assign(contact, updates);

    // If contact tests positive, create new case
    if (updates.testResult === 'positive' && !contact.convertedToCase) {
      const newCase = await this.reportCase({
        diseaseId: caseRecord.diseaseId,
        patient: {
          id: `patient-${Date.now()}`,
          anonymizedId: `ANO-${Date.now()}`,
          age: 0,
          ageGroup: '18-44',
          gender: 'other',
          healthcareWorker: false,
          location: caseRecord.patient.location,
          underlyingConditions: []
        },
        clinicalInfo: {
          onsetDate: new Date(),
          symptoms: contact.symptoms ? [{ symptom: 'Various', onsetDate: new Date(), severity: 'mild', resolved: false }] : [],
          hospitalized: false,
          icuAdmission: false,
          mechanicalVentilation: false,
          treatmentReceived: []
        },
        reportedBy: 'Contact Tracing'
      });

      contact.convertedToCase = newCase.id;

      // Link exposure
      const newCaseRecord = this.cases.get(newCase.id);
      if (newCaseRecord) {
        newCaseRecord.epidemiologicalInfo.exposureHistory.push({
          id: `exp-${Date.now()}`,
          type: contact.exposureType === 'household' ? 'household' : 'social',
          date: contact.exposureDate,
          location: 'Contact with case',
          description: `Linked to case ${caseRecord.caseNumber}`,
          linkedCaseId: caseId
        });
      }
    }

    return contact;
  }

  async getContactsByCase(caseId: string): Promise<ContactInfo[]> {
    const caseRecord = this.cases.get(caseId);
    if (!caseRecord) throw new Error(`Case not found: ${caseId}`);

    return caseRecord.contacts;
  }

  // ==================== Cluster & Outbreak Management ====================

  async createCluster(params: {
    name: string;
    diseaseId: string;
    caseIds: string[];
    setting: string;
    location: Cluster['location'];
  }): Promise<Cluster> {
    const cluster: Cluster = {
      id: `cluster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      diseaseId: params.diseaseId,
      cases: params.caseIds,
      setting: params.setting,
      location: params.location,
      startDate: new Date(),
      status: 'active',
      interventions: [],
      createdAt: new Date()
    };

    // Calculate attack rate if applicable
    // This would normally require population data

    this.clusters.set(cluster.id, cluster);
    return cluster;
  }

  async addCaseToCluster(clusterId: string, caseId: string): Promise<Cluster> {
    const cluster = this.clusters.get(clusterId);
    if (!cluster) throw new Error(`Cluster not found: ${clusterId}`);

    if (!cluster.cases.includes(caseId)) {
      cluster.cases.push(caseId);
    }

    return cluster;
  }

  async declareOutbreak(params: {
    name: string;
    diseaseId: string;
    declaredBy: string;
    authority: string;
    geographicScope: Outbreak['geographicScope'];
    affectedJurisdictions: string[];
    clusterIds?: string[];
  }): Promise<Outbreak> {
    const outbreak: Outbreak = {
      id: `outbreak-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      diseaseId: params.diseaseId,
      declaration: {
        declaredBy: params.declaredBy,
        declaredAt: new Date(),
        authority: params.authority
      },
      geographicScope: params.geographicScope,
      affectedJurisdictions: params.affectedJurisdictions,
      clusters: params.clusterIds || [],
      totalCases: 0,
      totalDeaths: 0,
      surveillanceLevel: 'enhanced',
      responseTeam: [],
      objectives: [],
      interventions: [],
      status: 'declared',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Calculate initial totals
    outbreak.totalCases = this.calculateOutbreakCases(outbreak);
    outbreak.totalDeaths = this.calculateOutbreakDeaths(outbreak);

    this.outbreaks.set(outbreak.id, outbreak);

    // Create alert
    await this.createAlert({
      diseaseId: params.diseaseId,
      trigger: 'geographic_spread',
      severity: 'high',
      jurisdiction: params.affectedJurisdictions.join(', '),
      description: `Outbreak declared: ${params.name}`,
      metrics: [{ name: 'Cases', value: outbreak.totalCases, threshold: 0 }],
      recommendedActions: ['Activate response team', 'Enhance surveillance', 'Implement control measures']
    });

    return outbreak;
  }

  private calculateOutbreakCases(outbreak: Outbreak): number {
    const clusterCases = outbreak.clusters.flatMap(clusterId => {
      const cluster = this.clusters.get(clusterId);
      return cluster ? cluster.cases : [];
    });

    const jurisdictionCases = Array.from(this.cases.values())
      .filter(c =>
        c.diseaseId === outbreak.diseaseId &&
        outbreak.affectedJurisdictions.some(j =>
          c.patient.location.jurisdiction.includes(j)
        )
      );

    const allCases = new Set([...clusterCases, ...jurisdictionCases.map(c => c.id)]);
    return allCases.size;
  }

  private calculateOutbreakDeaths(outbreak: Outbreak): number {
    return Array.from(this.cases.values())
      .filter(c =>
        c.diseaseId === outbreak.diseaseId &&
        c.status === 'deceased' &&
        outbreak.affectedJurisdictions.some(j =>
          c.patient.location.jurisdiction.includes(j)
        )
      ).length;
  }

  async updateOutbreakStatus(outbreakId: string, status: Outbreak['status']): Promise<Outbreak> {
    const outbreak = this.outbreaks.get(outbreakId);
    if (!outbreak) throw new Error(`Outbreak not found: ${outbreakId}`);

    outbreak.status = status;
    outbreak.updatedAt = new Date();

    if (status === 'ended') {
      outbreak.endedAt = new Date();
    }

    return outbreak;
  }

  // ==================== Surveillance & Alerts ====================

  private async checkAlertConditions(diseaseId: string, jurisdiction: string): Promise<void> {
    const disease = this.diseases.get(diseaseId);
    if (!disease) return;

    // Count recent cases
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCases = Array.from(this.cases.values())
      .filter(c =>
        c.diseaseId === diseaseId &&
        c.patient.location.jurisdiction === jurisdiction &&
        c.reportedAt >= oneDayAgo
      );

    // Simple threshold check
    if (recentCases.length >= 5) {
      await this.createAlert({
        diseaseId,
        trigger: 'threshold_exceeded',
        severity: recentCases.length >= 10 ? 'high' : 'medium',
        jurisdiction,
        description: `${recentCases.length} new ${disease.name} cases in past 24 hours`,
        metrics: [{ name: 'New Cases', value: recentCases.length, threshold: 5 }],
        recommendedActions: ['Increase surveillance', 'Begin contact tracing', 'Prepare public notification']
      });
    }
  }

  private async createAlert(params: Omit<SurveillanceAlert, 'id' | 'acknowledged' | 'createdAt'>): Promise<SurveillanceAlert> {
    const alert: SurveillanceAlert = {
      ...params,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      acknowledged: false,
      createdAt: new Date()
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  async getActiveAlerts(jurisdiction?: string): Promise<SurveillanceAlert[]> {
    let alerts = Array.from(this.alerts.values())
      .filter(a => !a.acknowledged);

    if (jurisdiction) {
      alerts = alerts.filter(a => a.jurisdiction.includes(jurisdiction));
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<SurveillanceAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();

    return alert;
  }

  // ==================== Syndromic Surveillance ====================

  async getSyndromicData(): Promise<SyndromicSurveillance[]> {
    return Array.from(this.syndromicData.values());
  }

  async updateSyndromicData(syndromeId: string, newLevel: number): Promise<SyndromicSurveillance> {
    const data = this.syndromicData.get(syndromeId);
    if (!data) throw new Error(`Syndrome data not found: ${syndromeId}`);

    data.currentLevel = newLevel;
    data.lastUpdated = new Date();

    // Update status based on thresholds
    const criticalThreshold = data.thresholds.find(t => t.level === 'critical');
    const alertThreshold = data.thresholds.find(t => t.level === 'alert');
    const warningThreshold = data.thresholds.find(t => t.level === 'warning');

    if (criticalThreshold && newLevel >= criticalThreshold.value) {
      data.status = 'alert';
    } else if (alertThreshold && newLevel >= alertThreshold.value) {
      data.status = 'alert';
    } else if (warningThreshold && newLevel >= warningThreshold.value) {
      data.status = 'elevated';
    } else {
      data.status = 'normal';
    }

    return data;
  }

  // ==================== Reporting ====================

  async generateSurveillanceReport(diseaseId: string, jurisdiction: string, period: { start: Date; end: Date }): Promise<SurveillanceReport> {
    const cases = Array.from(this.cases.values())
      .filter(c =>
        c.diseaseId === diseaseId &&
        c.patient.location.jurisdiction === jurisdiction &&
        c.reportedAt >= period.start &&
        c.reportedAt <= period.end
      );

    const data: SurveillanceData = {
      newCases: cases.length,
      cumulativeCases: Array.from(this.cases.values())
        .filter(c => c.diseaseId === diseaseId && c.patient.location.jurisdiction === jurisdiction).length,
      activeCases: cases.filter(c => c.status !== 'recovered' && c.status !== 'deceased').length,
      recoveries: cases.filter(c => c.status === 'recovered').length,
      deaths: cases.filter(c => c.status === 'deceased').length,
      hospitalizations: cases.filter(c => c.clinicalInfo.hospitalized).length,
      icuAdmissions: cases.filter(c => c.clinicalInfo.icuAdmission).length,
      testsPerformed: cases.reduce((sum, c) => sum + c.labResults.length, 0),
      positivityRate: cases.length > 0 ? 
        cases.filter(c => c.labResults.some(l => l.result === 'positive')).length / cases.length : 0,
      casesByAge: this.groupBy(cases, c => c.patient.ageGroup),
      casesByGender: this.groupBy(cases, c => c.patient.gender),
      casesByJurisdiction: { [jurisdiction]: cases.length }
    };

    const report: SurveillanceReport = {
      id: `report-${Date.now()}`,
      period,
      jurisdiction,
      data,
      trends: this.calculateTrends(diseaseId, jurisdiction, period),
      alerts: Array.from(this.alerts.values())
        .filter(a => a.diseaseId === diseaseId && a.jurisdiction === jurisdiction && !a.acknowledged),
      recommendations: this.generateRecommendations(data),
      preparedBy: 'System',
      preparedAt: new Date()
    };

    this.reports.set(report.id, report);
    return report;
  }

  private groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
    return items.reduce((acc, item) => {
      const key = keyFn(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateTrends(diseaseId: string, jurisdiction: string, period: { start: Date; end: Date }): TrendAnalysis[] {
    // Simplified trend calculation
    return [
      { metric: 'New Cases', direction: 'stable', percentChange: 5, comparisonPeriod: 'Previous week', significance: 'not_significant' },
      { metric: 'Hospitalizations', direction: 'decreasing', percentChange: -15, comparisonPeriod: 'Previous week', significance: 'significant' }
    ];
  }

  private generateRecommendations(data: SurveillanceData): string[] {
    const recommendations: string[] = [];

    if (data.positivityRate > 0.1) {
      recommendations.push('Consider expanding testing capacity');
    }

    if (data.hospitalizations > 0.3 * data.newCases) {
      recommendations.push('Alert healthcare facilities about potential surge');
    }

    if (data.activeCases > 100) {
      recommendations.push('Implement enhanced contact tracing');
    }

    return recommendations.length > 0 ? recommendations : ['Continue routine surveillance'];
  }

  // ==================== Statistics ====================

  async getStatistics(diseaseId?: string): Promise<{
    totalCases: number;
    activeCases: number;
    recovered: number;
    deceased: number;
    activeOutbreaks: number;
    activeClusters: number;
    pendingAlerts: number;
  }> {
    let cases = Array.from(this.cases.values());

    if (diseaseId) {
      cases = cases.filter(c => c.diseaseId === diseaseId);
    }

    return {
      totalCases: cases.length,
      activeCases: cases.filter(c => c.status !== 'recovered' && c.status !== 'deceased').length,
      recovered: cases.filter(c => c.status === 'recovered').length,
      deceased: cases.filter(c => c.status === 'deceased').length,
      activeOutbreaks: Array.from(this.outbreaks.values())
        .filter(o => o.status !== 'ended' && (!diseaseId || o.diseaseId === diseaseId)).length,
      activeClusters: Array.from(this.clusters.values())
        .filter(c => c.status === 'active' && (!diseaseId || c.diseaseId === diseaseId)).length,
      pendingAlerts: Array.from(this.alerts.values())
        .filter(a => !a.acknowledged && (!diseaseId || a.diseaseId === diseaseId)).length
    };
  }
}

export const epidemicSurveillanceService = EpidemicSurveillanceService.getInstance();
export default EpidemicSurveillanceService;

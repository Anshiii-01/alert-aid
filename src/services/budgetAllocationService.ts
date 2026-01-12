/**
 * Budget Allocation Service - Issue #162 Implementation
 * 
 * Provides comprehensive budget management for disaster response
 * including budget planning, fund allocation, expenditure tracking,
 * financial reporting, and cost recovery management.
 */

// Type definitions
type BudgetCategory = 'personnel' | 'equipment' | 'supplies' | 'services' | 'facilities' | 'communications' | 'transportation' | 'training' | 'administration' | 'contingency';
type FundSource = 'general_fund' | 'emergency_reserve' | 'federal_grant' | 'state_grant' | 'donation' | 'insurance' | 'reimbursement' | 'special_fund';
type AllocationStatus = 'proposed' | 'approved' | 'active' | 'frozen' | 'closed' | 'reallocated';
type ExpenditureStatus = 'pending' | 'approved' | 'processed' | 'paid' | 'rejected' | 'voided';
type ReimbursementStatus = 'eligible' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'paid' | 'appealed';

// Budget interfaces
interface Budget {
  id: string;
  name: string;
  description: string;
  fiscalYear: string;
  type: 'annual' | 'supplemental' | 'emergency' | 'project' | 'grant';
  status: 'draft' | 'proposed' | 'approved' | 'active' | 'amended' | 'closed';
  period: { start: Date; end: Date };
  totalAmount: number;
  allocatedAmount: number;
  spentAmount: number;
  encumberedAmount: number;
  availableAmount: number;
  categories: BudgetCategoryAllocation[];
  fundSources: FundSourceAllocation[];
  amendments: BudgetAmendment[];
  approvals: BudgetApproval[];
  reportingSchedule: ReportingSchedule;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetCategoryAllocation {
  category: BudgetCategory;
  plannedAmount: number;
  allocatedAmount: number;
  spentAmount: number;
  encumberedAmount: number;
  availableAmount: number;
  subcategories?: {
    name: string;
    amount: number;
    spent: number;
  }[];
}

interface FundSourceAllocation {
  source: FundSource;
  name: string;
  amount: number;
  restrictions?: string[];
  expirationDate?: Date;
  matchingRequired?: boolean;
  matchRatio?: string;
  grantId?: string;
}

interface BudgetAmendment {
  id: string;
  date: Date;
  type: 'increase' | 'decrease' | 'transfer' | 'reallocation';
  description: string;
  amount: number;
  fromCategory?: BudgetCategory;
  toCategory?: BudgetCategory;
  justification: string;
  approvedBy?: string;
  approvalDate?: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface BudgetApproval {
  stage: string;
  approver: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  date?: Date;
  comments?: string;
}

interface ReportingSchedule {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  recipients: string[];
  nextReportDate: Date;
  reports: { date: Date; reportId: string }[];
}

// Allocation interfaces
interface FundAllocation {
  id: string;
  budgetId: string;
  budgetName: string;
  name: string;
  description: string;
  category: BudgetCategory;
  fundSource: FundSource;
  amount: number;
  status: AllocationStatus;
  purpose: string;
  incidentId?: string;
  incidentName?: string;
  projectCode?: string;
  costCenter?: string;
  authorizedBy: string;
  authorizedDate: Date;
  effectiveDate: Date;
  expirationDate?: Date;
  expenditures: string[];
  spentAmount: number;
  encumberedAmount: number;
  availableAmount: number;
  restrictions?: string[];
  accountingCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// Expenditure interfaces
interface Expenditure {
  id: string;
  allocationId: string;
  allocationName: string;
  budgetId: string;
  type: 'purchase' | 'contract' | 'payroll' | 'reimbursement' | 'grant_disbursement' | 'transfer';
  category: BudgetCategory;
  description: string;
  vendor?: VendorInfo;
  amount: number;
  quantity?: number;
  unitCost?: number;
  status: ExpenditureStatus;
  requestedBy: string;
  requestDate: Date;
  approvedBy?: string;
  approvalDate?: Date;
  processedDate?: Date;
  paidDate?: Date;
  paymentMethod?: 'check' | 'ach' | 'wire' | 'credit_card' | 'petty_cash';
  paymentReference?: string;
  incidentId?: string;
  projectCode?: string;
  costCenter?: string;
  accountingCode: string;
  documentation: ExpenditureDocument[];
  auditTrail: AuditEntry[];
  reimbursable: boolean;
  reimbursementId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorInfo {
  id?: string;
  name: string;
  taxId?: string;
  address?: string;
  contact?: string;
  phone?: string;
  email?: string;
}

interface ExpenditureDocument {
  id: string;
  type: 'invoice' | 'receipt' | 'contract' | 'quote' | 'approval' | 'justification';
  name: string;
  url: string;
  uploadedDate: Date;
  uploadedBy: string;
}

interface AuditEntry {
  date: Date;
  action: string;
  user: string;
  details?: string;
  previousValue?: string;
  newValue?: string;
}

// Cost recovery interfaces
interface CostRecoveryRequest {
  id: string;
  incidentId: string;
  incidentName: string;
  disasterType: string;
  declarationNumber?: string;
  requestType: 'fema_pa' | 'fema_hmgp' | 'state_assistance' | 'insurance' | 'other_federal';
  status: ReimbursementStatus;
  totalRequested: number;
  totalApproved: number;
  totalPaid: number;
  federalShare?: number;
  stateShare?: number;
  localShare?: number;
  categories: CostRecoveryCategory[];
  projectSheets: ProjectSheet[];
  timeline: CostRecoveryTimeline;
  contacts: CostRecoveryContact[];
  documents: CostRecoveryDocument[];
  auditFindings?: AuditFinding[];
  appeals?: Appeal[];
  createdAt: Date;
  updatedAt: Date;
}

interface CostRecoveryCategory {
  category: string;
  code: string;
  requestedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  status: ReimbursementStatus;
  expenditures: string[];
}

interface ProjectSheet {
  id: string;
  projectNumber: string;
  category: string;
  title: string;
  description: string;
  location?: string;
  scope: string;
  estimatedCost: number;
  federalShare: number;
  nonFederalShare: number;
  status: 'draft' | 'submitted' | 'approved' | 'obligated' | 'completed' | 'closed';
  versions: { version: number; date: Date; changes: string }[];
  specialConsiderations?: string[];
}

interface CostRecoveryTimeline {
  incidentDate: Date;
  declarationDate?: Date;
  applicationDeadline?: Date;
  applicationSubmitted?: Date;
  projectDeadline?: Date;
  closeoutDeadline?: Date;
  milestones: { name: string; targetDate: Date; actualDate?: Date; status: string }[];
}

interface CostRecoveryContact {
  role: 'applicant_agent' | 'state_coordinator' | 'fema_rep' | 'finance' | 'legal';
  name: string;
  title: string;
  organization: string;
  phone: string;
  email: string;
}

interface CostRecoveryDocument {
  id: string;
  type: 'application' | 'project_worksheet' | 'supporting' | 'correspondence' | 'determination';
  name: string;
  url: string;
  uploadedDate: Date;
  category?: string;
}

interface AuditFinding {
  id: string;
  date: Date;
  auditor: string;
  finding: string;
  amount?: number;
  status: 'open' | 'resolved' | 'disputed';
  resolution?: string;
}

interface Appeal {
  id: string;
  level: 'first' | 'second' | 'final';
  filedDate: Date;
  basis: string;
  amount: number;
  status: 'filed' | 'under_review' | 'decided';
  decision?: string;
  decisionDate?: Date;
}

// Financial report interfaces
interface FinancialReport {
  id: string;
  type: 'budget_status' | 'expenditure' | 'cost_recovery' | 'audit' | 'forecast' | 'variance';
  title: string;
  period: { start: Date; end: Date };
  generatedDate: Date;
  generatedBy: string;
  budgetId?: string;
  incidentId?: string;
  summary: ReportSummary;
  sections: ReportSection[];
  charts?: ChartData[];
  recommendations?: string[];
  distribution: string[];
  status: 'draft' | 'final' | 'distributed';
}

interface ReportSummary {
  totalBudget?: number;
  totalAllocated?: number;
  totalSpent?: number;
  totalEncumbered?: number;
  totalAvailable?: number;
  burnRate?: number;
  projectedEndDate?: Date;
  keyFindings: string[];
}

interface ReportSection {
  title: string;
  content: string;
  tables?: { headers: string[]; rows: string[][] }[];
  highlights?: string[];
}

interface ChartData {
  type: 'bar' | 'pie' | 'line' | 'area';
  title: string;
  data: { label: string; value: number }[];
}

// Sample data
const sampleBudgets: Budget[] = [
  {
    id: 'budget-001',
    name: 'FY2024 Emergency Management Operating Budget',
    description: 'Annual operating budget for emergency management activities',
    fiscalYear: 'FY2024',
    type: 'annual',
    status: 'active',
    period: {
      start: new Date('2024-01-01'),
      end: new Date('2024-12-31')
    },
    totalAmount: 5000000,
    allocatedAmount: 4500000,
    spentAmount: 2100000,
    encumberedAmount: 800000,
    availableAmount: 1600000,
    categories: [
      {
        category: 'personnel',
        plannedAmount: 2500000,
        allocatedAmount: 2500000,
        spentAmount: 1250000,
        encumberedAmount: 600000,
        availableAmount: 650000
      },
      {
        category: 'equipment',
        plannedAmount: 1000000,
        allocatedAmount: 800000,
        spentAmount: 400000,
        encumberedAmount: 150000,
        availableAmount: 250000
      },
      {
        category: 'training',
        plannedAmount: 500000,
        allocatedAmount: 500000,
        spentAmount: 200000,
        encumberedAmount: 50000,
        availableAmount: 250000
      }
    ],
    fundSources: [
      { source: 'general_fund', name: 'General Fund', amount: 3500000 },
      { source: 'federal_grant', name: 'EMPG', amount: 1000000, matchingRequired: true, matchRatio: '50:50' },
      { source: 'state_grant', name: 'State Homeland Security', amount: 500000 }
    ],
    amendments: [],
    approvals: [
      {
        stage: 'Department Head',
        approver: 'Director Chen',
        title: 'Emergency Management Director',
        status: 'approved',
        date: new Date('2023-11-15')
      },
      {
        stage: 'Finance',
        approver: 'CFO Williams',
        title: 'Chief Financial Officer',
        status: 'approved',
        date: new Date('2023-11-20')
      }
    ],
    reportingSchedule: {
      frequency: 'monthly',
      recipients: ['Director', 'CFO', 'County Manager'],
      nextReportDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      reports: []
    },
    createdBy: 'Budget Office',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date()
  }
];

class BudgetAllocationService {
  private static instance: BudgetAllocationService;
  private budgets: Map<string, Budget> = new Map();
  private allocations: Map<string, FundAllocation> = new Map();
  private expenditures: Map<string, Expenditure> = new Map();
  private costRecoveryRequests: Map<string, CostRecoveryRequest> = new Map();
  private financialReports: Map<string, FinancialReport> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): BudgetAllocationService {
    if (!BudgetAllocationService.instance) {
      BudgetAllocationService.instance = new BudgetAllocationService();
    }
    return BudgetAllocationService.instance;
  }

  private initializeSampleData(): void {
    sampleBudgets.forEach(b => this.budgets.set(b.id, b));
  }

  // ==================== Budget Management ====================

  async createBudget(params: Omit<Budget, 'id' | 'allocatedAmount' | 'spentAmount' | 'encumberedAmount' | 'availableAmount' | 'amendments' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const budget: Budget = {
      ...params,
      id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      allocatedAmount: 0,
      spentAmount: 0,
      encumberedAmount: 0,
      availableAmount: params.totalAmount,
      amendments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Initialize category amounts
    budget.categories.forEach(cat => {
      cat.allocatedAmount = cat.plannedAmount;
      cat.spentAmount = 0;
      cat.encumberedAmount = 0;
      cat.availableAmount = cat.plannedAmount;
    });

    this.budgets.set(budget.id, budget);
    return budget;
  }

  async getBudget(budgetId: string): Promise<Budget | null> {
    return this.budgets.get(budgetId) || null;
  }

  async getBudgets(params?: {
    fiscalYear?: string;
    type?: Budget['type'];
    status?: Budget['status'];
  }): Promise<Budget[]> {
    let budgets = Array.from(this.budgets.values());

    if (params?.fiscalYear) {
      budgets = budgets.filter(b => b.fiscalYear === params.fiscalYear);
    }

    if (params?.type) {
      budgets = budgets.filter(b => b.type === params.type);
    }

    if (params?.status) {
      budgets = budgets.filter(b => b.status === params.status);
    }

    return budgets.sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateBudget(budgetId: string, update: Partial<Budget>): Promise<Budget> {
    const budget = this.budgets.get(budgetId);
    if (!budget) throw new Error(`Budget not found: ${budgetId}`);

    Object.assign(budget, update, { updatedAt: new Date() });
    return budget;
  }

  async amendBudget(budgetId: string, amendment: Omit<BudgetAmendment, 'id' | 'status'>): Promise<Budget> {
    const budget = this.budgets.get(budgetId);
    if (!budget) throw new Error(`Budget not found: ${budgetId}`);

    const fullAmendment: BudgetAmendment = {
      ...amendment,
      id: `amend-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending'
    };

    budget.amendments.push(fullAmendment);
    budget.updatedAt = new Date();

    return budget;
  }

  async approveAmendment(budgetId: string, amendmentId: string, approver: string): Promise<Budget> {
    const budget = this.budgets.get(budgetId);
    if (!budget) throw new Error(`Budget not found: ${budgetId}`);

    const amendment = budget.amendments.find(a => a.id === amendmentId);
    if (!amendment) throw new Error(`Amendment not found: ${amendmentId}`);

    amendment.status = 'approved';
    amendment.approvedBy = approver;
    amendment.approvalDate = new Date();

    // Apply amendment
    if (amendment.type === 'increase') {
      budget.totalAmount += amendment.amount;
      budget.availableAmount += amendment.amount;
    } else if (amendment.type === 'decrease') {
      budget.totalAmount -= amendment.amount;
      budget.availableAmount -= amendment.amount;
    } else if (amendment.type === 'transfer' && amendment.fromCategory && amendment.toCategory) {
      const fromCat = budget.categories.find(c => c.category === amendment.fromCategory);
      const toCat = budget.categories.find(c => c.category === amendment.toCategory);

      if (fromCat && toCat) {
        fromCat.allocatedAmount -= amendment.amount;
        fromCat.availableAmount -= amendment.amount;
        toCat.allocatedAmount += amendment.amount;
        toCat.availableAmount += amendment.amount;
      }
    }

    budget.status = 'amended';
    budget.updatedAt = new Date();

    return budget;
  }

  private recalculateBudget(budget: Budget): void {
    budget.allocatedAmount = 0;
    budget.spentAmount = 0;
    budget.encumberedAmount = 0;

    for (const cat of budget.categories) {
      budget.allocatedAmount += cat.allocatedAmount;
      budget.spentAmount += cat.spentAmount;
      budget.encumberedAmount += cat.encumberedAmount;
      cat.availableAmount = cat.allocatedAmount - cat.spentAmount - cat.encumberedAmount;
    }

    budget.availableAmount = budget.totalAmount - budget.spentAmount - budget.encumberedAmount;
  }

  // ==================== Allocation Management ====================

  async createAllocation(params: Omit<FundAllocation, 'id' | 'expenditures' | 'spentAmount' | 'encumberedAmount' | 'availableAmount' | 'createdAt' | 'updatedAt'>): Promise<FundAllocation> {
    const budget = this.budgets.get(params.budgetId);
    if (!budget) throw new Error(`Budget not found: ${params.budgetId}`);

    // Check available funds
    const category = budget.categories.find(c => c.category === params.category);
    if (!category) throw new Error(`Category not found: ${params.category}`);

    if (params.amount > category.availableAmount) {
      throw new Error('Insufficient funds in category');
    }

    const allocation: FundAllocation = {
      ...params,
      id: `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      expenditures: [],
      spentAmount: 0,
      encumberedAmount: 0,
      availableAmount: params.amount,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.allocations.set(allocation.id, allocation);

    // Update budget
    budget.allocatedAmount += params.amount;
    category.encumberedAmount += params.amount;
    category.availableAmount -= params.amount;
    budget.updatedAt = new Date();

    return allocation;
  }

  async getAllocation(allocationId: string): Promise<FundAllocation | null> {
    return this.allocations.get(allocationId) || null;
  }

  async getAllocations(params?: {
    budgetId?: string;
    category?: BudgetCategory;
    status?: AllocationStatus;
    incidentId?: string;
  }): Promise<FundAllocation[]> {
    let allocations = Array.from(this.allocations.values());

    if (params?.budgetId) {
      allocations = allocations.filter(a => a.budgetId === params.budgetId);
    }

    if (params?.category) {
      allocations = allocations.filter(a => a.category === params.category);
    }

    if (params?.status) {
      allocations = allocations.filter(a => a.status === params.status);
    }

    if (params?.incidentId) {
      allocations = allocations.filter(a => a.incidentId === params.incidentId);
    }

    return allocations;
  }

  async updateAllocationStatus(allocationId: string, status: AllocationStatus): Promise<FundAllocation> {
    const allocation = this.allocations.get(allocationId);
    if (!allocation) throw new Error(`Allocation not found: ${allocationId}`);

    allocation.status = status;
    allocation.updatedAt = new Date();

    return allocation;
  }

  // ==================== Expenditure Management ====================

  async createExpenditure(params: Omit<Expenditure, 'id' | 'status' | 'auditTrail' | 'createdAt' | 'updatedAt'>): Promise<Expenditure> {
    const allocation = this.allocations.get(params.allocationId);
    if (!allocation) throw new Error(`Allocation not found: ${params.allocationId}`);

    if (params.amount > allocation.availableAmount) {
      throw new Error('Insufficient funds in allocation');
    }

    const expenditure: Expenditure = {
      ...params,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      auditTrail: [
        {
          date: new Date(),
          action: 'Created',
          user: params.requestedBy,
          details: `Expenditure request created for $${params.amount}`
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.expenditures.set(expenditure.id, expenditure);

    // Update allocation
    allocation.expenditures.push(expenditure.id);
    allocation.encumberedAmount += params.amount;
    allocation.availableAmount -= params.amount;
    allocation.updatedAt = new Date();

    return expenditure;
  }

  async getExpenditure(expenditureId: string): Promise<Expenditure | null> {
    return this.expenditures.get(expenditureId) || null;
  }

  async getExpenditures(params?: {
    allocationId?: string;
    budgetId?: string;
    category?: BudgetCategory;
    status?: ExpenditureStatus;
    incidentId?: string;
    dateRange?: { start: Date; end: Date };
  }): Promise<Expenditure[]> {
    let expenditures = Array.from(this.expenditures.values());

    if (params?.allocationId) {
      expenditures = expenditures.filter(e => e.allocationId === params.allocationId);
    }

    if (params?.budgetId) {
      expenditures = expenditures.filter(e => e.budgetId === params.budgetId);
    }

    if (params?.category) {
      expenditures = expenditures.filter(e => e.category === params.category);
    }

    if (params?.status) {
      expenditures = expenditures.filter(e => e.status === params.status);
    }

    if (params?.incidentId) {
      expenditures = expenditures.filter(e => e.incidentId === params.incidentId);
    }

    if (params?.dateRange) {
      expenditures = expenditures.filter(e =>
        e.requestDate >= params.dateRange!.start && e.requestDate <= params.dateRange!.end
      );
    }

    return expenditures.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async approveExpenditure(expenditureId: string, approver: string): Promise<Expenditure> {
    const expenditure = this.expenditures.get(expenditureId);
    if (!expenditure) throw new Error(`Expenditure not found: ${expenditureId}`);

    expenditure.status = 'approved';
    expenditure.approvedBy = approver;
    expenditure.approvalDate = new Date();
    expenditure.auditTrail.push({
      date: new Date(),
      action: 'Approved',
      user: approver
    });
    expenditure.updatedAt = new Date();

    return expenditure;
  }

  async processExpenditure(expenditureId: string, processor: string): Promise<Expenditure> {
    const expenditure = this.expenditures.get(expenditureId);
    if (!expenditure) throw new Error(`Expenditure not found: ${expenditureId}`);

    expenditure.status = 'processed';
    expenditure.processedDate = new Date();
    expenditure.auditTrail.push({
      date: new Date(),
      action: 'Processed',
      user: processor
    });
    expenditure.updatedAt = new Date();

    return expenditure;
  }

  async payExpenditure(expenditureId: string, payment: {
    method: Expenditure['paymentMethod'];
    reference: string;
    paidBy: string;
  }): Promise<Expenditure> {
    const expenditure = this.expenditures.get(expenditureId);
    if (!expenditure) throw new Error(`Expenditure not found: ${expenditureId}`);

    expenditure.status = 'paid';
    expenditure.paidDate = new Date();
    expenditure.paymentMethod = payment.method;
    expenditure.paymentReference = payment.reference;
    expenditure.auditTrail.push({
      date: new Date(),
      action: 'Paid',
      user: payment.paidBy,
      details: `Payment via ${payment.method}, ref: ${payment.reference}`
    });
    expenditure.updatedAt = new Date();

    // Update allocation
    const allocation = this.allocations.get(expenditure.allocationId);
    if (allocation) {
      allocation.encumberedAmount -= expenditure.amount;
      allocation.spentAmount += expenditure.amount;
      allocation.updatedAt = new Date();

      // Update budget
      const budget = this.budgets.get(allocation.budgetId);
      if (budget) {
        const category = budget.categories.find(c => c.category === allocation.category);
        if (category) {
          category.encumberedAmount -= expenditure.amount;
          category.spentAmount += expenditure.amount;
        }
        this.recalculateBudget(budget);
      }
    }

    return expenditure;
  }

  async rejectExpenditure(expenditureId: string, rejector: string, reason: string): Promise<Expenditure> {
    const expenditure = this.expenditures.get(expenditureId);
    if (!expenditure) throw new Error(`Expenditure not found: ${expenditureId}`);

    expenditure.status = 'rejected';
    expenditure.auditTrail.push({
      date: new Date(),
      action: 'Rejected',
      user: rejector,
      details: reason
    });
    expenditure.updatedAt = new Date();

    // Release encumbered funds
    const allocation = this.allocations.get(expenditure.allocationId);
    if (allocation) {
      allocation.encumberedAmount -= expenditure.amount;
      allocation.availableAmount += expenditure.amount;
      allocation.updatedAt = new Date();

      const budget = this.budgets.get(allocation.budgetId);
      if (budget) {
        const category = budget.categories.find(c => c.category === allocation.category);
        if (category) {
          category.encumberedAmount -= expenditure.amount;
          category.availableAmount += expenditure.amount;
        }
        this.recalculateBudget(budget);
      }
    }

    return expenditure;
  }

  // ==================== Cost Recovery Management ====================

  async createCostRecoveryRequest(params: Omit<CostRecoveryRequest, 'id' | 'status' | 'totalApproved' | 'totalPaid' | 'auditFindings' | 'appeals' | 'createdAt' | 'updatedAt'>): Promise<CostRecoveryRequest> {
    const request: CostRecoveryRequest = {
      ...params,
      id: `recovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'eligible',
      totalApproved: 0,
      totalPaid: 0,
      auditFindings: [],
      appeals: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.costRecoveryRequests.set(request.id, request);
    return request;
  }

  async getCostRecoveryRequest(requestId: string): Promise<CostRecoveryRequest | null> {
    return this.costRecoveryRequests.get(requestId) || null;
  }

  async getCostRecoveryRequests(params?: {
    incidentId?: string;
    requestType?: CostRecoveryRequest['requestType'];
    status?: ReimbursementStatus;
  }): Promise<CostRecoveryRequest[]> {
    let requests = Array.from(this.costRecoveryRequests.values());

    if (params?.incidentId) {
      requests = requests.filter(r => r.incidentId === params.incidentId);
    }

    if (params?.requestType) {
      requests = requests.filter(r => r.requestType === params.requestType);
    }

    if (params?.status) {
      requests = requests.filter(r => r.status === params.status);
    }

    return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateCostRecoveryStatus(requestId: string, status: ReimbursementStatus): Promise<CostRecoveryRequest> {
    const request = this.costRecoveryRequests.get(requestId);
    if (!request) throw new Error(`Cost recovery request not found: ${requestId}`);

    request.status = status;
    request.updatedAt = new Date();

    return request;
  }

  async addProjectSheet(requestId: string, projectSheet: Omit<ProjectSheet, 'id' | 'status' | 'versions'>): Promise<CostRecoveryRequest> {
    const request = this.costRecoveryRequests.get(requestId);
    if (!request) throw new Error(`Cost recovery request not found: ${requestId}`);

    request.projectSheets.push({
      ...projectSheet,
      id: `ps-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'draft',
      versions: [{ version: 1, date: new Date(), changes: 'Initial version' }]
    });

    request.updatedAt = new Date();
    return request;
  }

  async approveProjectSheet(requestId: string, projectSheetId: string, approvedAmount: number): Promise<CostRecoveryRequest> {
    const request = this.costRecoveryRequests.get(requestId);
    if (!request) throw new Error(`Cost recovery request not found: ${requestId}`);

    const projectSheet = request.projectSheets.find(p => p.id === projectSheetId);
    if (!projectSheet) throw new Error(`Project sheet not found: ${projectSheetId}`);

    projectSheet.status = 'approved';
    request.totalApproved += approvedAmount;
    request.updatedAt = new Date();

    return request;
  }

  async recordPayment(requestId: string, categoryCode: string, amount: number): Promise<CostRecoveryRequest> {
    const request = this.costRecoveryRequests.get(requestId);
    if (!request) throw new Error(`Cost recovery request not found: ${requestId}`);

    const category = request.categories.find(c => c.code === categoryCode);
    if (category) {
      category.paidAmount += amount;
    }

    request.totalPaid += amount;
    request.updatedAt = new Date();

    return request;
  }

  async fileAppeal(requestId: string, appeal: Omit<Appeal, 'id' | 'status'>): Promise<CostRecoveryRequest> {
    const request = this.costRecoveryRequests.get(requestId);
    if (!request) throw new Error(`Cost recovery request not found: ${requestId}`);

    if (!request.appeals) request.appeals = [];

    request.appeals.push({
      ...appeal,
      id: `appeal-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'filed'
    });

    request.status = 'appealed';
    request.updatedAt = new Date();

    return request;
  }

  // ==================== Financial Reporting ====================

  async generateReport(params: Omit<FinancialReport, 'id' | 'generatedDate' | 'status'>): Promise<FinancialReport> {
    const report: FinancialReport = {
      ...params,
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      generatedDate: new Date(),
      status: 'draft'
    };

    this.financialReports.set(report.id, report);
    return report;
  }

  async getReports(params?: {
    type?: FinancialReport['type'];
    budgetId?: string;
    incidentId?: string;
    status?: FinancialReport['status'];
  }): Promise<FinancialReport[]> {
    let reports = Array.from(this.financialReports.values());

    if (params?.type) {
      reports = reports.filter(r => r.type === params.type);
    }

    if (params?.budgetId) {
      reports = reports.filter(r => r.budgetId === params.budgetId);
    }

    if (params?.incidentId) {
      reports = reports.filter(r => r.incidentId === params.incidentId);
    }

    if (params?.status) {
      reports = reports.filter(r => r.status === params.status);
    }

    return reports.sort((a, b) => b.generatedDate.getTime() - a.generatedDate.getTime());
  }

  async generateBudgetStatusReport(budgetId: string, generatedBy: string): Promise<FinancialReport> {
    const budget = this.budgets.get(budgetId);
    if (!budget) throw new Error(`Budget not found: ${budgetId}`);

    const utilizationRate = (budget.spentAmount / budget.totalAmount) * 100;
    const burnRate = budget.spentAmount / this.getMonthsElapsed(budget.period.start);

    const report = await this.generateReport({
      type: 'budget_status',
      title: `Budget Status Report - ${budget.name}`,
      period: budget.period,
      generatedBy,
      budgetId,
      summary: {
        totalBudget: budget.totalAmount,
        totalAllocated: budget.allocatedAmount,
        totalSpent: budget.spentAmount,
        totalEncumbered: budget.encumberedAmount,
        totalAvailable: budget.availableAmount,
        burnRate,
        keyFindings: [
          `Budget utilization: ${utilizationRate.toFixed(1)}%`,
          `Monthly burn rate: $${burnRate.toLocaleString()}`,
          `Available funds: $${budget.availableAmount.toLocaleString()}`
        ]
      },
      sections: [
        {
          title: 'Category Breakdown',
          content: 'Detailed breakdown by budget category',
          tables: [{
            headers: ['Category', 'Planned', 'Spent', 'Available', 'Utilization'],
            rows: budget.categories.map(c => [
              c.category,
              `$${c.plannedAmount.toLocaleString()}`,
              `$${c.spentAmount.toLocaleString()}`,
              `$${c.availableAmount.toLocaleString()}`,
              `${((c.spentAmount / c.plannedAmount) * 100).toFixed(1)}%`
            ])
          }]
        }
      ],
      charts: [
        {
          type: 'pie',
          title: 'Spending by Category',
          data: budget.categories.map(c => ({
            label: c.category,
            value: c.spentAmount
          }))
        }
      ],
      distribution: budget.reportingSchedule.recipients
    });

    return report;
  }

  private getMonthsElapsed(startDate: Date): number {
    const now = new Date();
    const months = (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth()) + 1;
    return Math.max(months, 1);
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalBudgets: number;
    activeBudgets: number;
    totalBudgetAmount: number;
    totalSpent: number;
    totalAvailable: number;
    overallUtilization: number;
    totalAllocations: number;
    activeAllocations: number;
    pendingExpenditures: number;
    totalExpenditures: number;
    costRecoveryRequested: number;
    costRecoveryReceived: number;
    byCategory: Record<BudgetCategory, { spent: number; available: number }>;
    byFundSource: Record<FundSource, number>;
  }> {
    const budgets = Array.from(this.budgets.values());
    const allocations = Array.from(this.allocations.values());
    const expenditures = Array.from(this.expenditures.values());
    const costRecovery = Array.from(this.costRecoveryRequests.values());

    let totalBudgetAmount = 0;
    let totalSpent = 0;
    let totalAvailable = 0;

    const byCategory: Record<BudgetCategory, { spent: number; available: number }> = {} as any;
    const byFundSource: Record<FundSource, number> = {} as any;

    budgets.forEach(b => {
      totalBudgetAmount += b.totalAmount;
      totalSpent += b.spentAmount;
      totalAvailable += b.availableAmount;

      b.categories.forEach(c => {
        if (!byCategory[c.category]) {
          byCategory[c.category] = { spent: 0, available: 0 };
        }
        byCategory[c.category].spent += c.spentAmount;
        byCategory[c.category].available += c.availableAmount;
      });

      b.fundSources.forEach(f => {
        byFundSource[f.source] = (byFundSource[f.source] || 0) + f.amount;
      });
    });

    let costRecoveryRequested = 0;
    let costRecoveryReceived = 0;
    costRecovery.forEach(r => {
      costRecoveryRequested += r.totalRequested;
      costRecoveryReceived += r.totalPaid;
    });

    return {
      totalBudgets: budgets.length,
      activeBudgets: budgets.filter(b => b.status === 'active').length,
      totalBudgetAmount,
      totalSpent,
      totalAvailable,
      overallUtilization: totalBudgetAmount > 0 ? (totalSpent / totalBudgetAmount) * 100 : 0,
      totalAllocations: allocations.length,
      activeAllocations: allocations.filter(a => a.status === 'active').length,
      pendingExpenditures: expenditures.filter(e => e.status === 'pending').length,
      totalExpenditures: expenditures.length,
      costRecoveryRequested,
      costRecoveryReceived,
      byCategory,
      byFundSource
    };
  }
}

export const budgetAllocationService = BudgetAllocationService.getInstance();
export default BudgetAllocationService;

/**
 * Equipment Tracking Service - Issue #167 Implementation
 * 
 * Provides comprehensive equipment management for disaster response
 * including asset tracking, maintenance scheduling, deployment management,
 * utilization monitoring, and lifecycle management.
 */

// Type definitions
type EquipmentCategory = 'vehicles' | 'communications' | 'medical' | 'rescue' | 'generators' | 'pumps' | 'lighting' | 'shelter' | 'decon' | 'tools' | 'ppe' | 'other';
type EquipmentStatus = 'available' | 'deployed' | 'in_transit' | 'maintenance' | 'repair' | 'out_of_service' | 'retired';
type MaintenanceType = 'preventive' | 'corrective' | 'emergency' | 'inspection' | 'calibration';
type CheckoutStatus = 'pending' | 'approved' | 'checked_out' | 'in_use' | 'returning' | 'checked_in' | 'overdue';
type ConditionRating = 'excellent' | 'good' | 'fair' | 'poor' | 'non_functional';

// Equipment interfaces
interface Equipment {
  id: string;
  assetTag: string;
  name: string;
  description: string;
  category: EquipmentCategory;
  subcategory?: string;
  status: EquipmentStatus;
  condition: ConditionRating;
  specifications: EquipmentSpecifications;
  acquisition: AcquisitionInfo;
  location: EquipmentLocation;
  assignment?: EquipmentAssignment;
  maintenance: MaintenanceInfo;
  certifications: EquipmentCertification[];
  accessories: Accessory[];
  documentation: EquipmentDocument[];
  history: EquipmentHistoryEntry[];
  tracking: TrackingInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface EquipmentSpecifications {
  manufacturer: string;
  model: string;
  serialNumber: string;
  year?: number;
  capacity?: string;
  powerRequirements?: string;
  fuelType?: string;
  dimensions?: { length: number; width: number; height: number; unit: string };
  weight?: { value: number; unit: string };
  operatingRange?: string;
  features?: string[];
  limitations?: string[];
}

interface AcquisitionInfo {
  method: 'purchase' | 'lease' | 'grant' | 'donation' | 'transfer';
  date: Date;
  cost: number;
  vendor?: string;
  purchaseOrder?: string;
  grantId?: string;
  warranty: WarrantyInfo;
  expectedLifeYears: number;
  currentValue: number;
  depreciationMethod?: string;
}

interface WarrantyInfo {
  provider: string;
  startDate: Date;
  endDate: Date;
  coverage: string;
  contactPhone?: string;
  contractNumber?: string;
}

interface EquipmentLocation {
  type: 'warehouse' | 'station' | 'field' | 'maintenance' | 'vendor' | 'deployed';
  facilityId?: string;
  facilityName: string;
  building?: string;
  room?: string;
  coordinates?: [number, number];
  lastUpdated: Date;
}

interface EquipmentAssignment {
  type: 'incident' | 'unit' | 'person' | 'project';
  assignedTo: string;
  assignedToId?: string;
  assignedBy: string;
  assignedDate: Date;
  expectedReturn?: Date;
  purpose?: string;
}

interface MaintenanceInfo {
  lastService: Date;
  nextService: Date;
  serviceIntervalDays: number;
  meterReading?: number;
  meterUnit?: 'hours' | 'miles' | 'cycles';
  servicePlan?: string;
  maintenanceNotes?: string;
  issues: EquipmentIssue[];
}

interface EquipmentIssue {
  id: string;
  reportedDate: Date;
  reportedBy: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'cosmetic';
  status: 'open' | 'in_progress' | 'resolved' | 'deferred';
  resolution?: string;
  resolvedDate?: Date;
  cost?: number;
}

interface EquipmentCertification {
  type: string;
  issuedBy: string;
  issueDate: Date;
  expirationDate: Date;
  certificateNumber?: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

interface Accessory {
  id: string;
  name: string;
  assetTag?: string;
  serialNumber?: string;
  status: 'attached' | 'detached' | 'lost' | 'damaged';
}

interface EquipmentDocument {
  id: string;
  type: 'manual' | 'warranty' | 'certificate' | 'inspection' | 'repair' | 'photo';
  name: string;
  url: string;
  uploadedDate: Date;
}

interface EquipmentHistoryEntry {
  timestamp: Date;
  type: 'status_change' | 'location_change' | 'maintenance' | 'checkout' | 'checkin' | 'issue' | 'inspection';
  description: string;
  performedBy: string;
  details?: Record<string, string>;
}

interface TrackingInfo {
  gpsEnabled: boolean;
  trackerId?: string;
  lastLocation?: [number, number];
  lastPing?: Date;
  geofenceEnabled?: boolean;
  geofenceArea?: string;
}

// Maintenance interfaces
interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  assetTag: string;
  type: MaintenanceType;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  scheduledDate: Date;
  startDate?: Date;
  completedDate?: Date;
  technician?: string;
  vendor?: string;
  location: string;
  description: string;
  workPerformed?: string;
  partsUsed: PartUsed[];
  laborHours?: number;
  costs: MaintenanceCosts;
  meterReading?: number;
  nextServiceDue?: Date;
  findings?: string;
  recommendations?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface PartUsed {
  partNumber: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface MaintenanceCosts {
  parts: number;
  labor: number;
  vendor: number;
  other: number;
  total: number;
}

// Checkout interfaces
interface EquipmentCheckout {
  id: string;
  checkoutNumber: string;
  equipmentId: string;
  equipmentName: string;
  assetTag: string;
  status: CheckoutStatus;
  requestedBy: CheckoutRequestor;
  purpose: string;
  incidentId?: string;
  incidentName?: string;
  projectCode?: string;
  schedule: CheckoutSchedule;
  approval?: CheckoutApproval;
  condition: ConditionCheck;
  returnCondition?: ConditionCheck;
  notes: CheckoutNote[];
  createdAt: Date;
  updatedAt: Date;
}

interface CheckoutRequestor {
  name: string;
  organization: string;
  department?: string;
  phone: string;
  email: string;
  certifications?: string[];
}

interface CheckoutSchedule {
  requestedStart: Date;
  requestedEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  extensions: { requestedDate: Date; newEndDate: Date; approved: boolean }[];
}

interface CheckoutApproval {
  approver: string;
  approvalDate: Date;
  conditions?: string[];
}

interface ConditionCheck {
  date: Date;
  checkedBy: string;
  overallCondition: ConditionRating;
  meterReading?: number;
  fuelLevel?: number;
  items: { item: string; status: 'ok' | 'damaged' | 'missing'; notes?: string }[];
  photos?: string[];
  signature?: string;
}

interface CheckoutNote {
  timestamp: Date;
  author: string;
  content: string;
}

// Equipment pool interfaces
interface EquipmentPool {
  id: string;
  name: string;
  description: string;
  category: EquipmentCategory;
  manager: string;
  equipment: string[];
  totalCount: number;
  availableCount: number;
  deployedCount: number;
  maintenanceCount: number;
  utilizationRate: number;
  location: string;
  shareableWith: string[];
  reservationPolicy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Inspection interfaces
interface EquipmentInspection {
  id: string;
  equipmentId: string;
  equipmentName: string;
  assetTag: string;
  type: 'routine' | 'pre_deployment' | 'post_deployment' | 'annual' | 'certification';
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  scheduledDate: Date;
  completedDate?: Date;
  inspector: string;
  checklist: InspectionItem[];
  overallResult: 'pass' | 'pass_with_conditions' | 'fail' | 'pending';
  findings: string[];
  recommendations: string[];
  nextInspectionDue?: Date;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface InspectionItem {
  id: string;
  category: string;
  item: string;
  requirement: string;
  result: 'pass' | 'fail' | 'na' | 'pending';
  notes?: string;
  photos?: string[];
}

// Utilization interfaces
interface UtilizationRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  period: { start: Date; end: Date };
  totalHours: number;
  operatingHours: number;
  idleHours: number;
  utilizationRate: number;
  deployments: number;
  incidents: string[];
  meterStart?: number;
  meterEnd?: number;
  fuelConsumed?: number;
  maintenanceHours: number;
  costs: { operations: number; maintenance: number; fuel: number; total: number };
  notes?: string;
  createdAt: Date;
}

// Sample data
const sampleEquipment: Equipment[] = [
  {
    id: 'equip-001',
    assetTag: 'EM-VEH-001',
    name: 'Emergency Response Vehicle #1',
    description: 'Heavy-duty emergency response vehicle with command capabilities',
    category: 'vehicles',
    subcategory: 'Command Vehicle',
    status: 'available',
    condition: 'excellent',
    specifications: {
      manufacturer: 'Ford',
      model: 'F-550',
      serialNumber: '1FDAF5HT5KED12345',
      year: 2023,
      capacity: '6 passengers',
      fuelType: 'Diesel',
      dimensions: { length: 252, width: 96, height: 84, unit: 'inches' },
      weight: { value: 14000, unit: 'lbs' },
      features: ['4WD', 'Command console', 'Radio system', 'Generator'],
      limitations: ['Max speed 80 mph', 'Requires CDL for operation']
    },
    acquisition: {
      method: 'purchase',
      date: new Date('2023-03-15'),
      cost: 125000,
      vendor: 'County Ford',
      purchaseOrder: 'PO-2023-1234',
      warranty: {
        provider: 'Ford Motor Company',
        startDate: new Date('2023-03-15'),
        endDate: new Date('2028-03-15'),
        coverage: 'Comprehensive 5-year/100,000 mile'
      },
      expectedLifeYears: 15,
      currentValue: 115000,
      depreciationMethod: 'Straight-line'
    },
    location: {
      type: 'station',
      facilityId: 'station-001',
      facilityName: 'Emergency Management HQ',
      building: 'Main Building',
      room: 'Vehicle Bay 1',
      lastUpdated: new Date()
    },
    maintenance: {
      lastService: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      nextService: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      serviceIntervalDays: 90,
      meterReading: 15420,
      meterUnit: 'miles',
      issues: []
    },
    certifications: [
      {
        type: 'Annual Inspection',
        issuedBy: 'State DMV',
        issueDate: new Date('2024-06-01'),
        expirationDate: new Date('2025-06-01'),
        status: 'valid'
      }
    ],
    accessories: [
      { id: 'acc-001', name: 'Portable Radio Set', assetTag: 'EM-RAD-001', status: 'attached' },
      { id: 'acc-002', name: 'Emergency Light Bar', status: 'attached' }
    ],
    documentation: [],
    history: [],
    tracking: {
      gpsEnabled: true,
      trackerId: 'GPS-VEH-001',
      lastLocation: [38.5816, -121.4944],
      lastPing: new Date(),
      geofenceEnabled: true,
      geofenceArea: 'County Boundary'
    },
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date()
  }
];

class EquipmentTrackingService {
  private static instance: EquipmentTrackingService;
  private equipment: Map<string, Equipment> = new Map();
  private maintenanceRecords: Map<string, MaintenanceRecord> = new Map();
  private checkouts: Map<string, EquipmentCheckout> = new Map();
  private pools: Map<string, EquipmentPool> = new Map();
  private inspections: Map<string, EquipmentInspection> = new Map();
  private utilizationRecords: Map<string, UtilizationRecord> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): EquipmentTrackingService {
    if (!EquipmentTrackingService.instance) {
      EquipmentTrackingService.instance = new EquipmentTrackingService();
    }
    return EquipmentTrackingService.instance;
  }

  private initializeSampleData(): void {
    sampleEquipment.forEach(e => this.equipment.set(e.id, e));
  }

  // ==================== Equipment Management ====================

  async createEquipment(params: Omit<Equipment, 'id' | 'history' | 'createdAt' | 'updatedAt'>): Promise<Equipment> {
    const equipment: Equipment = {
      ...params,
      id: `equip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      history: [
        {
          timestamp: new Date(),
          type: 'status_change',
          description: 'Equipment record created',
          performedBy: 'System'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.equipment.set(equipment.id, equipment);
    return equipment;
  }

  async getEquipment(equipmentId: string): Promise<Equipment | null> {
    return this.equipment.get(equipmentId) || null;
  }

  async getEquipmentByAssetTag(assetTag: string): Promise<Equipment | null> {
    return Array.from(this.equipment.values()).find(e => e.assetTag === assetTag) || null;
  }

  async getAllEquipment(params?: {
    category?: EquipmentCategory;
    status?: EquipmentStatus;
    condition?: ConditionRating;
    locationId?: string;
    search?: string;
  }): Promise<Equipment[]> {
    let equipment = Array.from(this.equipment.values());

    if (params?.category) {
      equipment = equipment.filter(e => e.category === params.category);
    }

    if (params?.status) {
      equipment = equipment.filter(e => e.status === params.status);
    }

    if (params?.condition) {
      equipment = equipment.filter(e => e.condition === params.condition);
    }

    if (params?.locationId) {
      equipment = equipment.filter(e => e.location.facilityId === params.locationId);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      equipment = equipment.filter(e =>
        e.name.toLowerCase().includes(searchLower) ||
        e.assetTag.toLowerCase().includes(searchLower) ||
        e.specifications.serialNumber.toLowerCase().includes(searchLower)
      );
    }

    return equipment.sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateEquipmentStatus(equipmentId: string, status: EquipmentStatus, updatedBy: string): Promise<Equipment> {
    const equipment = this.equipment.get(equipmentId);
    if (!equipment) throw new Error(`Equipment not found: ${equipmentId}`);

    const previousStatus = equipment.status;
    equipment.status = status;
    equipment.history.push({
      timestamp: new Date(),
      type: 'status_change',
      description: `Status changed from ${previousStatus} to ${status}`,
      performedBy: updatedBy
    });
    equipment.updatedAt = new Date();

    return equipment;
  }

  async updateEquipmentLocation(equipmentId: string, location: EquipmentLocation, updatedBy: string): Promise<Equipment> {
    const equipment = this.equipment.get(equipmentId);
    if (!equipment) throw new Error(`Equipment not found: ${equipmentId}`);

    const previousLocation = equipment.location.facilityName;
    equipment.location = { ...location, lastUpdated: new Date() };
    equipment.history.push({
      timestamp: new Date(),
      type: 'location_change',
      description: `Location changed from ${previousLocation} to ${location.facilityName}`,
      performedBy: updatedBy
    });
    equipment.updatedAt = new Date();

    return equipment;
  }

  async updateEquipmentCondition(equipmentId: string, condition: ConditionRating, notes: string, updatedBy: string): Promise<Equipment> {
    const equipment = this.equipment.get(equipmentId);
    if (!equipment) throw new Error(`Equipment not found: ${equipmentId}`);

    equipment.condition = condition;
    equipment.history.push({
      timestamp: new Date(),
      type: 'inspection',
      description: `Condition updated to ${condition}: ${notes}`,
      performedBy: updatedBy
    });
    equipment.updatedAt = new Date();

    return equipment;
  }

  async reportIssue(equipmentId: string, issue: Omit<EquipmentIssue, 'id' | 'status'>): Promise<Equipment> {
    const equipment = this.equipment.get(equipmentId);
    if (!equipment) throw new Error(`Equipment not found: ${equipmentId}`);

    equipment.maintenance.issues.push({
      ...issue,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'open'
    });

    equipment.history.push({
      timestamp: new Date(),
      type: 'issue',
      description: `Issue reported: ${issue.description}`,
      performedBy: issue.reportedBy
    });

    if (issue.severity === 'critical') {
      equipment.status = 'out_of_service';
    }

    equipment.updatedAt = new Date();
    return equipment;
  }

  async resolveIssue(equipmentId: string, issueId: string, resolution: string, resolvedBy: string): Promise<Equipment> {
    const equipment = this.equipment.get(equipmentId);
    if (!equipment) throw new Error(`Equipment not found: ${equipmentId}`);

    const issue = equipment.maintenance.issues.find(i => i.id === issueId);
    if (!issue) throw new Error(`Issue not found: ${issueId}`);

    issue.status = 'resolved';
    issue.resolution = resolution;
    issue.resolvedDate = new Date();

    equipment.history.push({
      timestamp: new Date(),
      type: 'issue',
      description: `Issue resolved: ${resolution}`,
      performedBy: resolvedBy
    });

    equipment.updatedAt = new Date();
    return equipment;
  }

  // ==================== Maintenance Management ====================

  async scheduleMaintenance(params: Omit<MaintenanceRecord, 'id' | 'status' | 'partsUsed' | 'costs' | 'attachments' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceRecord> {
    const record: MaintenanceRecord = {
      ...params,
      id: `maint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      partsUsed: [],
      costs: { parts: 0, labor: 0, vendor: 0, other: 0, total: 0 },
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.maintenanceRecords.set(record.id, record);
    return record;
  }

  async getMaintenanceRecord(recordId: string): Promise<MaintenanceRecord | null> {
    return this.maintenanceRecords.get(recordId) || null;
  }

  async getMaintenanceRecords(params?: {
    equipmentId?: string;
    type?: MaintenanceType;
    status?: MaintenanceRecord['status'];
    dateRange?: { start: Date; end: Date };
  }): Promise<MaintenanceRecord[]> {
    let records = Array.from(this.maintenanceRecords.values());

    if (params?.equipmentId) {
      records = records.filter(r => r.equipmentId === params.equipmentId);
    }

    if (params?.type) {
      records = records.filter(r => r.type === params.type);
    }

    if (params?.status) {
      records = records.filter(r => r.status === params.status);
    }

    if (params?.dateRange) {
      records = records.filter(r =>
        r.scheduledDate >= params.dateRange!.start && r.scheduledDate <= params.dateRange!.end
      );
    }

    return records.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  async startMaintenance(recordId: string, technician: string): Promise<MaintenanceRecord> {
    const record = this.maintenanceRecords.get(recordId);
    if (!record) throw new Error(`Maintenance record not found: ${recordId}`);

    record.status = 'in_progress';
    record.startDate = new Date();
    record.technician = technician;
    record.updatedAt = new Date();

    // Update equipment status
    const equipment = this.equipment.get(record.equipmentId);
    if (equipment) {
      equipment.status = 'maintenance';
      equipment.history.push({
        timestamp: new Date(),
        type: 'maintenance',
        description: `Maintenance started: ${record.description}`,
        performedBy: technician
      });
      equipment.updatedAt = new Date();
    }

    return record;
  }

  async completeMaintenance(recordId: string, completion: {
    workPerformed: string;
    partsUsed: PartUsed[];
    laborHours: number;
    costs: MaintenanceCosts;
    meterReading?: number;
    findings?: string;
    recommendations?: string;
    nextServiceDue?: Date;
  }): Promise<MaintenanceRecord> {
    const record = this.maintenanceRecords.get(recordId);
    if (!record) throw new Error(`Maintenance record not found: ${recordId}`);

    record.status = 'completed';
    record.completedDate = new Date();
    Object.assign(record, completion);
    record.updatedAt = new Date();

    // Update equipment
    const equipment = this.equipment.get(record.equipmentId);
    if (equipment) {
      equipment.status = 'available';
      equipment.maintenance.lastService = new Date();
      if (completion.nextServiceDue) {
        equipment.maintenance.nextService = completion.nextServiceDue;
      }
      if (completion.meterReading) {
        equipment.maintenance.meterReading = completion.meterReading;
      }
      equipment.history.push({
        timestamp: new Date(),
        type: 'maintenance',
        description: `Maintenance completed: ${completion.workPerformed}`,
        performedBy: record.technician || 'Unknown'
      });
      equipment.updatedAt = new Date();
    }

    return record;
  }

  async getUpcomingMaintenance(days: number = 30): Promise<MaintenanceRecord[]> {
    const cutoffDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    
    return Array.from(this.maintenanceRecords.values())
      .filter(r => r.status === 'scheduled' && r.scheduledDate <= cutoffDate)
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  // ==================== Checkout Management ====================

  async createCheckout(params: Omit<EquipmentCheckout, 'id' | 'checkoutNumber' | 'status' | 'notes' | 'createdAt' | 'updatedAt'>): Promise<EquipmentCheckout> {
    const equipment = this.equipment.get(params.equipmentId);
    if (!equipment) throw new Error(`Equipment not found: ${params.equipmentId}`);

    if (equipment.status !== 'available') {
      throw new Error('Equipment is not available for checkout');
    }

    const checkout: EquipmentCheckout = {
      ...params,
      id: `checkout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      checkoutNumber: `CO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'pending',
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.checkouts.set(checkout.id, checkout);
    return checkout;
  }

  async getCheckout(checkoutId: string): Promise<EquipmentCheckout | null> {
    return this.checkouts.get(checkoutId) || null;
  }

  async getCheckouts(params?: {
    equipmentId?: string;
    status?: CheckoutStatus;
    requestedBy?: string;
    incidentId?: string;
  }): Promise<EquipmentCheckout[]> {
    let checkouts = Array.from(this.checkouts.values());

    if (params?.equipmentId) {
      checkouts = checkouts.filter(c => c.equipmentId === params.equipmentId);
    }

    if (params?.status) {
      checkouts = checkouts.filter(c => c.status === params.status);
    }

    if (params?.requestedBy) {
      checkouts = checkouts.filter(c => c.requestedBy.name.includes(params.requestedBy!));
    }

    if (params?.incidentId) {
      checkouts = checkouts.filter(c => c.incidentId === params.incidentId);
    }

    return checkouts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async approveCheckout(checkoutId: string, approval: CheckoutApproval): Promise<EquipmentCheckout> {
    const checkout = this.checkouts.get(checkoutId);
    if (!checkout) throw new Error(`Checkout not found: ${checkoutId}`);

    checkout.status = 'approved';
    checkout.approval = approval;
    checkout.updatedAt = new Date();

    return checkout;
  }

  async processCheckout(checkoutId: string, conditionCheck: ConditionCheck): Promise<EquipmentCheckout> {
    const checkout = this.checkouts.get(checkoutId);
    if (!checkout) throw new Error(`Checkout not found: ${checkoutId}`);

    checkout.status = 'checked_out';
    checkout.condition = conditionCheck;
    checkout.schedule.actualStart = new Date();
    checkout.updatedAt = new Date();

    // Update equipment
    const equipment = this.equipment.get(checkout.equipmentId);
    if (equipment) {
      equipment.status = 'deployed';
      equipment.assignment = {
        type: checkout.incidentId ? 'incident' : 'person',
        assignedTo: checkout.requestedBy.name,
        assignedBy: conditionCheck.checkedBy,
        assignedDate: new Date(),
        expectedReturn: checkout.schedule.requestedEnd,
        purpose: checkout.purpose
      };
      equipment.history.push({
        timestamp: new Date(),
        type: 'checkout',
        description: `Checked out to ${checkout.requestedBy.name} for ${checkout.purpose}`,
        performedBy: conditionCheck.checkedBy
      });
      equipment.updatedAt = new Date();
    }

    return checkout;
  }

  async processCheckin(checkoutId: string, returnCondition: ConditionCheck): Promise<EquipmentCheckout> {
    const checkout = this.checkouts.get(checkoutId);
    if (!checkout) throw new Error(`Checkout not found: ${checkoutId}`);

    checkout.status = 'checked_in';
    checkout.returnCondition = returnCondition;
    checkout.schedule.actualEnd = new Date();
    checkout.updatedAt = new Date();

    // Update equipment
    const equipment = this.equipment.get(checkout.equipmentId);
    if (equipment) {
      equipment.status = 'available';
      equipment.assignment = undefined;
      equipment.condition = returnCondition.overallCondition;
      equipment.location = {
        type: 'station',
        facilityName: 'Returned',
        lastUpdated: new Date()
      };
      equipment.history.push({
        timestamp: new Date(),
        type: 'checkin',
        description: `Checked in from ${checkout.requestedBy.name}, condition: ${returnCondition.overallCondition}`,
        performedBy: returnCondition.checkedBy
      });
      if (returnCondition.meterReading && equipment.maintenance.meterReading) {
        equipment.maintenance.meterReading = returnCondition.meterReading;
      }
      equipment.updatedAt = new Date();
    }

    return checkout;
  }

  async extendCheckout(checkoutId: string, newEndDate: Date, reason: string): Promise<EquipmentCheckout> {
    const checkout = this.checkouts.get(checkoutId);
    if (!checkout) throw new Error(`Checkout not found: ${checkoutId}`);

    checkout.schedule.extensions.push({
      requestedDate: new Date(),
      newEndDate,
      approved: true
    });
    checkout.schedule.requestedEnd = newEndDate;
    checkout.notes.push({
      timestamp: new Date(),
      author: checkout.requestedBy.name,
      content: `Extension requested: ${reason}`
    });
    checkout.updatedAt = new Date();

    return checkout;
  }

  async getOverdueCheckouts(): Promise<EquipmentCheckout[]> {
    const now = new Date();
    return Array.from(this.checkouts.values())
      .filter(c => 
        c.status === 'checked_out' && 
        c.schedule.requestedEnd < now
      );
  }

  // ==================== Equipment Pool Management ====================

  async createPool(params: Omit<EquipmentPool, 'id' | 'equipment' | 'totalCount' | 'availableCount' | 'deployedCount' | 'maintenanceCount' | 'utilizationRate' | 'createdAt' | 'updatedAt'>): Promise<EquipmentPool> {
    const pool: EquipmentPool = {
      ...params,
      id: `pool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      equipment: [],
      totalCount: 0,
      availableCount: 0,
      deployedCount: 0,
      maintenanceCount: 0,
      utilizationRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pools.set(pool.id, pool);
    return pool;
  }

  async getPool(poolId: string): Promise<EquipmentPool | null> {
    return this.pools.get(poolId) || null;
  }

  async getPools(params?: {
    category?: EquipmentCategory;
    manager?: string;
  }): Promise<EquipmentPool[]> {
    let pools = Array.from(this.pools.values());

    if (params?.category) {
      pools = pools.filter(p => p.category === params.category);
    }

    if (params?.manager) {
      pools = pools.filter(p => p.manager.includes(params.manager!));
    }

    return pools;
  }

  async addEquipmentToPool(poolId: string, equipmentId: string): Promise<EquipmentPool> {
    const pool = this.pools.get(poolId);
    if (!pool) throw new Error(`Pool not found: ${poolId}`);

    const equipment = this.equipment.get(equipmentId);
    if (!equipment) throw new Error(`Equipment not found: ${equipmentId}`);

    pool.equipment.push(equipmentId);
    await this.updatePoolCounts(poolId);

    return pool;
  }

  private async updatePoolCounts(poolId: string): Promise<void> {
    const pool = this.pools.get(poolId);
    if (!pool) return;

    const equipmentList = pool.equipment.map(id => this.equipment.get(id)).filter(Boolean) as Equipment[];

    pool.totalCount = equipmentList.length;
    pool.availableCount = equipmentList.filter(e => e.status === 'available').length;
    pool.deployedCount = equipmentList.filter(e => e.status === 'deployed').length;
    pool.maintenanceCount = equipmentList.filter(e => ['maintenance', 'repair'].includes(e.status)).length;
    pool.utilizationRate = pool.totalCount > 0 ? (pool.deployedCount / pool.totalCount) * 100 : 0;
    pool.updatedAt = new Date();
  }

  // ==================== Inspection Management ====================

  async scheduleInspection(params: Omit<EquipmentInspection, 'id' | 'status' | 'overallResult' | 'findings' | 'recommendations' | 'attachments' | 'createdAt' | 'updatedAt'>): Promise<EquipmentInspection> {
    const inspection: EquipmentInspection = {
      ...params,
      id: `insp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      overallResult: 'pending',
      findings: [],
      recommendations: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.inspections.set(inspection.id, inspection);
    return inspection;
  }

  async getInspection(inspectionId: string): Promise<EquipmentInspection | null> {
    return this.inspections.get(inspectionId) || null;
  }

  async completeInspection(inspectionId: string, results: {
    checklist: InspectionItem[];
    overallResult: EquipmentInspection['overallResult'];
    findings: string[];
    recommendations: string[];
    nextInspectionDue?: Date;
  }): Promise<EquipmentInspection> {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) throw new Error(`Inspection not found: ${inspectionId}`);

    inspection.status = 'completed';
    inspection.completedDate = new Date();
    Object.assign(inspection, results);
    inspection.updatedAt = new Date();

    // Update equipment
    const equipment = this.equipment.get(inspection.equipmentId);
    if (equipment) {
      equipment.history.push({
        timestamp: new Date(),
        type: 'inspection',
        description: `Inspection completed: ${results.overallResult}`,
        performedBy: inspection.inspector
      });
      equipment.updatedAt = new Date();
    }

    return inspection;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalEquipment: number;
    availableEquipment: number;
    deployedEquipment: number;
    maintenanceEquipment: number;
    totalValue: number;
    averageAge: number;
    upcomingMaintenance: number;
    overdueCheckouts: number;
    activeCheckouts: number;
    poolCount: number;
    averageUtilization: number;
    byCategory: Record<EquipmentCategory, { total: number; available: number }>;
    byCondition: Record<ConditionRating, number>;
    maintenanceCostsYTD: number;
  }> {
    const equipment = Array.from(this.equipment.values());
    const checkouts = Array.from(this.checkouts.values());
    const maintenance = Array.from(this.maintenanceRecords.values());
    const pools = Array.from(this.pools.values());

    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);

    let totalValue = 0;
    let totalAge = 0;
    const byCategory: Record<EquipmentCategory, { total: number; available: number }> = {} as any;
    const byCondition: Record<ConditionRating, number> = {} as any;

    equipment.forEach(e => {
      totalValue += e.acquisition.currentValue;
      
      if (e.specifications.year) {
        totalAge += now.getFullYear() - e.specifications.year;
      }

      if (!byCategory[e.category]) {
        byCategory[e.category] = { total: 0, available: 0 };
      }
      byCategory[e.category].total++;
      if (e.status === 'available') {
        byCategory[e.category].available++;
      }

      byCondition[e.condition] = (byCondition[e.condition] || 0) + 1;
    });

    const upcomingMaintenanceCount = equipment.filter(e => 
      e.maintenance.nextService <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ).length;

    const overdueCheckouts = checkouts.filter(c => 
      c.status === 'checked_out' && c.schedule.requestedEnd < now
    ).length;

    const maintenanceCostsYTD = maintenance
      .filter(m => m.completedDate && m.completedDate >= yearStart)
      .reduce((sum, m) => sum + m.costs.total, 0);

    const avgUtilization = pools.length > 0 
      ? pools.reduce((sum, p) => sum + p.utilizationRate, 0) / pools.length 
      : 0;

    return {
      totalEquipment: equipment.length,
      availableEquipment: equipment.filter(e => e.status === 'available').length,
      deployedEquipment: equipment.filter(e => e.status === 'deployed').length,
      maintenanceEquipment: equipment.filter(e => ['maintenance', 'repair'].includes(e.status)).length,
      totalValue,
      averageAge: equipment.length > 0 ? totalAge / equipment.length : 0,
      upcomingMaintenance: upcomingMaintenanceCount,
      overdueCheckouts,
      activeCheckouts: checkouts.filter(c => c.status === 'checked_out').length,
      poolCount: pools.length,
      averageUtilization: avgUtilization,
      byCategory,
      byCondition,
      maintenanceCostsYTD
    };
  }
}

export const equipmentTrackingService = EquipmentTrackingService.getInstance();
export default EquipmentTrackingService;

/**
 * Logistics Service - Issue #166 Implementation
 * 
 * Provides comprehensive logistics management for disaster response
 * including supply chain management, warehouse operations, distribution,
 * transportation coordination, and inventory tracking.
 */

// Type definitions
type SupplyCategory = 'food' | 'water' | 'medical' | 'shelter' | 'hygiene' | 'clothing' | 'tools' | 'fuel' | 'communications' | 'safety' | 'other';
type WarehouseType = 'central' | 'regional' | 'forward' | 'mobile' | 'partner';
type ShipmentStatus = 'pending' | 'scheduled' | 'in_transit' | 'delayed' | 'delivered' | 'cancelled';
type RequestPriority = 'critical' | 'urgent' | 'high' | 'medium' | 'low';
type RequestStatus = 'submitted' | 'reviewing' | 'approved' | 'sourcing' | 'shipping' | 'delivered' | 'denied' | 'cancelled';

// Supply item interfaces
interface SupplyItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: SupplyCategory;
  subcategory?: string;
  unit: string;
  specifications: ItemSpecifications;
  procurement: ProcurementInfo;
  storage: StorageRequirements;
  distribution: DistributionInfo;
  tracking: ItemTracking;
  createdAt: Date;
  updatedAt: Date;
}

interface ItemSpecifications {
  weight?: string;
  dimensions?: { length: number; width: number; height: number; unit: string };
  volume?: string;
  packSize?: number;
  shelfLife?: string;
  hazardous: boolean;
  hazmatClass?: string;
  temperatureRange?: { min: number; max: number; unit: string };
  specialHandling?: string[];
}

interface ProcurementInfo {
  preferredVendors: string[];
  leadTime: string;
  minimumOrder: number;
  unitCost: number;
  bulkDiscount?: { quantity: number; discount: number }[];
  lastPurchaseDate?: Date;
  lastPurchasePrice?: number;
}

interface StorageRequirements {
  type: 'ambient' | 'refrigerated' | 'frozen' | 'controlled' | 'hazmat';
  stackable: boolean;
  maxStackHeight?: number;
  requiresPallet: boolean;
  specialConditions?: string[];
}

interface DistributionInfo {
  distributionUnit: string;
  perPersonAllocation?: number;
  perHouseholdAllocation?: number;
  restrictions?: string[];
  documentation?: string[];
}

interface ItemTracking {
  batchTracking: boolean;
  expirationTracking: boolean;
  serialTracking: boolean;
  lotTracking: boolean;
}

// Warehouse interfaces
interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: WarehouseType;
  status: 'active' | 'inactive' | 'maintenance' | 'emergency_only';
  location: WarehouseLocation;
  capacity: WarehouseCapacity;
  operations: WarehouseOperations;
  contacts: WarehouseContact[];
  inventory: InventorySummary;
  equipment: WarehouseEquipment[];
  security: SecurityInfo;
  certifications: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface WarehouseLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: [number, number];
  accessInstructions?: string;
  loadingDocks: number;
  parkingCapacity: number;
}

interface WarehouseCapacity {
  totalSquareFeet: number;
  usableSquareFeet: number;
  palletPositions: number;
  usedPalletPositions: number;
  refrigeratedSpace: number;
  frozenSpace: number;
  hazmatSpace: number;
  utilizationPercent: number;
}

interface WarehouseOperations {
  hoursOfOperation: { day: string; open: string; close: string }[];
  emergencyAvailable: boolean;
  receivingCapacity: number;
  shippingCapacity: number;
  crossDockCapable: boolean;
  kittingCapable: boolean;
  lastInventoryCount: Date;
}

interface WarehouseContact {
  role: 'manager' | 'operations' | 'receiving' | 'shipping' | 'emergency';
  name: string;
  phone: string;
  email: string;
  available24x7: boolean;
}

interface InventorySummary {
  totalItems: number;
  totalValue: number;
  byCategory: { category: SupplyCategory; quantity: number; value: number }[];
  lowStock: number;
  expiringSoon: number;
  lastUpdated: Date;
}

interface WarehouseEquipment {
  type: string;
  quantity: number;
  status: 'operational' | 'maintenance' | 'out_of_service';
  capacity?: string;
}

interface SecurityInfo {
  accessControl: 'badge' | 'key' | 'code' | 'biometric';
  surveillance: boolean;
  alarmSystem: boolean;
  guardService: boolean;
  fencing: boolean;
}

// Inventory interfaces
interface InventoryRecord {
  id: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemName: string;
  sku: string;
  category: SupplyCategory;
  location: StorageLocation;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitCost: number;
  totalValue: number;
  batch?: BatchInfo;
  status: 'available' | 'reserved' | 'quarantine' | 'expired' | 'damaged';
  lastTransaction: Date;
  lastCount: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface StorageLocation {
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin?: string;
  fullLocation: string;
}

interface BatchInfo {
  batchNumber: string;
  lotNumber?: string;
  manufacturingDate?: Date;
  expirationDate?: Date;
  receivedDate: Date;
  supplier?: string;
}

// Supply request interfaces
interface SupplyRequest {
  id: string;
  requestNumber: string;
  incidentId?: string;
  incidentName?: string;
  requestedBy: RequestorInfo;
  deliveryLocation: DeliveryLocation;
  priority: RequestPriority;
  status: RequestStatus;
  requestDate: Date;
  neededBy: Date;
  items: RequestedItem[];
  justification: string;
  approvals: RequestApproval[];
  fulfillment?: FulfillmentInfo;
  delivery?: DeliveryInfo;
  costs: RequestCosts;
  notes: RequestNote[];
  createdAt: Date;
  updatedAt: Date;
}

interface RequestorInfo {
  name: string;
  organization: string;
  department?: string;
  phone: string;
  email: string;
  authorityLevel: string;
}

interface DeliveryLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: [number, number];
  contactName: string;
  contactPhone: string;
  deliveryInstructions?: string;
  accessRestrictions?: string[];
}

interface RequestedItem {
  itemId: string;
  itemName: string;
  sku: string;
  category: SupplyCategory;
  quantityRequested: number;
  quantityApproved?: number;
  quantityFulfilled?: number;
  unit: string;
  specifications?: string;
  substitutesAcceptable: boolean;
}

interface RequestApproval {
  level: string;
  approver: string;
  status: 'pending' | 'approved' | 'denied' | 'modified';
  date?: Date;
  comments?: string;
  modifications?: string;
}

interface FulfillmentInfo {
  sourceWarehouse: string;
  fulfillmentDate: Date;
  fulfilledBy: string;
  pickedItems: PickedItem[];
  packingSlip?: string;
}

interface PickedItem {
  itemId: string;
  quantity: number;
  location: string;
  batch?: string;
  pickedBy: string;
  pickedAt: Date;
}

interface DeliveryInfo {
  shipmentId: string;
  carrier: string;
  trackingNumber?: string;
  scheduledDate: Date;
  actualDeliveryDate?: Date;
  receivedBy?: string;
  proofOfDelivery?: string;
  condition: 'good' | 'damaged' | 'partial';
  discrepancies?: string;
}

interface RequestCosts {
  itemCost: number;
  shippingCost: number;
  handlingCost: number;
  totalCost: number;
  fundingSource?: string;
  costCenter?: string;
}

interface RequestNote {
  timestamp: Date;
  author: string;
  content: string;
  type: 'info' | 'issue' | 'resolution';
}

// Shipment interfaces
interface Shipment {
  id: string;
  shipmentNumber: string;
  type: 'outbound' | 'inbound' | 'transfer';
  status: ShipmentStatus;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  carrier: CarrierInfo;
  schedule: ShipmentSchedule;
  contents: ShipmentContents;
  tracking: ShipmentTracking[];
  documents: ShipmentDocument[];
  costs: ShipmentCosts;
  specialInstructions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ShipmentLocation {
  type: 'warehouse' | 'vendor' | 'field_location' | 'distribution_point';
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactName: string;
  contactPhone: string;
}

interface CarrierInfo {
  name: string;
  type: 'ltl' | 'ftl' | 'parcel' | 'air' | 'rail' | 'dedicated';
  contractNumber?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleId?: string;
  trailerNumber?: string;
}

interface ShipmentSchedule {
  requestedPickup: Date;
  scheduledPickup?: Date;
  actualPickup?: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  transitTime: string;
}

interface ShipmentContents {
  totalItems: number;
  totalWeight: number;
  weightUnit: string;
  totalPallets?: number;
  totalVolume?: number;
  volumeUnit?: string;
  items: ShipmentItem[];
  hazmat: boolean;
  refrigerated: boolean;
}

interface ShipmentItem {
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  weight: number;
  pallets?: number;
  batch?: string;
}

interface ShipmentTracking {
  timestamp: Date;
  location: string;
  status: string;
  notes?: string;
  coordinates?: [number, number];
}

interface ShipmentDocument {
  type: 'bill_of_lading' | 'packing_slip' | 'proof_of_delivery' | 'customs' | 'hazmat' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
}

interface ShipmentCosts {
  freight: number;
  fuel: number;
  accessorial: number;
  insurance: number;
  total: number;
  invoiceNumber?: string;
  invoiceDate?: Date;
  paid: boolean;
}

// Distribution point interfaces
interface DistributionPoint {
  id: string;
  name: string;
  type: 'pod' | 'shelter' | 'community_center' | 'mobile' | 'drive_through';
  status: 'planning' | 'setting_up' | 'open' | 'closing' | 'closed';
  incidentId?: string;
  location: DistributionLocation;
  schedule: DistributionSchedule;
  capacity: DistributionCapacity;
  staff: DistributionStaff[];
  inventory: DistributionInventory[];
  operations: DistributionOperations;
  statistics: DistributionStatistics;
  createdAt: Date;
  updatedAt: Date;
}

interface DistributionLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: [number, number];
  facilityName?: string;
  parkingAvailable: boolean;
  accessibleEntry: boolean;
}

interface DistributionSchedule {
  activationDate: Date;
  plannedCloseDate?: Date;
  actualCloseDate?: Date;
  hoursOfOperation: { day: string; open: string; close: string }[];
}

interface DistributionCapacity {
  maxHourlyThroughput: number;
  currentThroughput: number;
  maxQueueLength: number;
  currentQueueLength: number;
  waitTime: string;
}

interface DistributionStaff {
  id: string;
  name: string;
  role: 'manager' | 'volunteer' | 'security' | 'interpreter' | 'medical';
  organization: string;
  shift: { start: Date; end: Date };
  status: 'active' | 'break' | 'off_duty';
}

interface DistributionInventory {
  itemId: string;
  itemName: string;
  category: SupplyCategory;
  startingQuantity: number;
  currentQuantity: number;
  distributed: number;
  unit: string;
  reorderPoint: number;
  status: 'adequate' | 'low' | 'critical' | 'out';
}

interface DistributionOperations {
  registrationRequired: boolean;
  idRequired: boolean;
  limitPerHousehold: boolean;
  verificationMethod?: string;
  languages: string[];
  specialAccommodations: string[];
}

interface DistributionStatistics {
  totalServed: number;
  householdsServed: number;
  individualsServed: number;
  itemsDistributed: number;
  peakHour?: Date;
  peakThroughput?: number;
  averageServiceTime: string;
}

// Sample data
const sampleWarehouses: Warehouse[] = [
  {
    id: 'wh-001',
    name: 'Regional Emergency Supplies Warehouse',
    code: 'RESW-CENTRAL',
    type: 'central',
    status: 'active',
    location: {
      address: '1500 Emergency Response Blvd',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95814',
      coordinates: [38.5816, -121.4944],
      loadingDocks: 8,
      parkingCapacity: 50
    },
    capacity: {
      totalSquareFeet: 100000,
      usableSquareFeet: 85000,
      palletPositions: 5000,
      usedPalletPositions: 3500,
      refrigeratedSpace: 5000,
      frozenSpace: 2000,
      hazmatSpace: 1000,
      utilizationPercent: 70
    },
    operations: {
      hoursOfOperation: [
        { day: 'Monday-Friday', open: '06:00', close: '22:00' },
        { day: 'Saturday', open: '08:00', close: '18:00' }
      ],
      emergencyAvailable: true,
      receivingCapacity: 50,
      shippingCapacity: 75,
      crossDockCapable: true,
      kittingCapable: true,
      lastInventoryCount: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    contacts: [
      {
        role: 'manager',
        name: 'Robert Martinez',
        phone: '555-0300',
        email: 'rmartinez@warehouse.gov',
        available24x7: true
      }
    ],
    inventory: {
      totalItems: 450,
      totalValue: 2500000,
      byCategory: [
        { category: 'food', quantity: 50000, value: 500000 },
        { category: 'water', quantity: 100000, value: 200000 },
        { category: 'medical', quantity: 25000, value: 750000 }
      ],
      lowStock: 12,
      expiringSoon: 8,
      lastUpdated: new Date()
    },
    equipment: [
      { type: 'Forklift', quantity: 6, status: 'operational', capacity: '5000 lbs' },
      { type: 'Pallet Jack', quantity: 12, status: 'operational' }
    ],
    security: {
      accessControl: 'badge',
      surveillance: true,
      alarmSystem: true,
      guardService: true,
      fencing: true
    },
    certifications: ['FEMA Qualified', 'ISO 9001'],
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date()
  }
];

class LogisticsService {
  private static instance: LogisticsService;
  private supplyItems: Map<string, SupplyItem> = new Map();
  private warehouses: Map<string, Warehouse> = new Map();
  private inventoryRecords: Map<string, InventoryRecord> = new Map();
  private supplyRequests: Map<string, SupplyRequest> = new Map();
  private shipments: Map<string, Shipment> = new Map();
  private distributionPoints: Map<string, DistributionPoint> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): LogisticsService {
    if (!LogisticsService.instance) {
      LogisticsService.instance = new LogisticsService();
    }
    return LogisticsService.instance;
  }

  private initializeSampleData(): void {
    sampleWarehouses.forEach(w => this.warehouses.set(w.id, w));
  }

  // ==================== Supply Item Management ====================

  async createSupplyItem(params: Omit<SupplyItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplyItem> {
    const item: SupplyItem = {
      ...params,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.supplyItems.set(item.id, item);
    return item;
  }

  async getSupplyItem(itemId: string): Promise<SupplyItem | null> {
    return this.supplyItems.get(itemId) || null;
  }

  async getSupplyItems(params?: {
    category?: SupplyCategory;
    search?: string;
  }): Promise<SupplyItem[]> {
    let items = Array.from(this.supplyItems.values());

    if (params?.category) {
      items = items.filter(i => i.category === params.category);
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(searchLower) ||
        i.sku.toLowerCase().includes(searchLower)
      );
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  // ==================== Warehouse Management ====================

  async createWarehouse(params: Omit<Warehouse, 'id' | 'inventory' | 'createdAt' | 'updatedAt'>): Promise<Warehouse> {
    const warehouse: Warehouse = {
      ...params,
      id: `wh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      inventory: {
        totalItems: 0,
        totalValue: 0,
        byCategory: [],
        lowStock: 0,
        expiringSoon: 0,
        lastUpdated: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.warehouses.set(warehouse.id, warehouse);
    return warehouse;
  }

  async getWarehouse(warehouseId: string): Promise<Warehouse | null> {
    return this.warehouses.get(warehouseId) || null;
  }

  async getWarehouses(params?: {
    type?: WarehouseType;
    status?: Warehouse['status'];
    state?: string;
  }): Promise<Warehouse[]> {
    let warehouses = Array.from(this.warehouses.values());

    if (params?.type) {
      warehouses = warehouses.filter(w => w.type === params.type);
    }

    if (params?.status) {
      warehouses = warehouses.filter(w => w.status === params.status);
    }

    if (params?.state) {
      warehouses = warehouses.filter(w => w.location.state === params.state);
    }

    return warehouses.sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateWarehouseStatus(warehouseId: string, status: Warehouse['status']): Promise<Warehouse> {
    const warehouse = this.warehouses.get(warehouseId);
    if (!warehouse) throw new Error(`Warehouse not found: ${warehouseId}`);

    warehouse.status = status;
    warehouse.updatedAt = new Date();

    return warehouse;
  }

  // ==================== Inventory Management ====================

  async createInventoryRecord(params: Omit<InventoryRecord, 'id' | 'availableQuantity' | 'totalValue' | 'lastTransaction' | 'lastCount' | 'createdAt' | 'updatedAt'>): Promise<InventoryRecord> {
    const record: InventoryRecord = {
      ...params,
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      availableQuantity: params.quantity - params.reservedQuantity,
      totalValue: params.quantity * params.unitCost,
      lastTransaction: new Date(),
      lastCount: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.inventoryRecords.set(record.id, record);

    // Update warehouse inventory summary
    await this.updateWarehouseInventorySummary(params.warehouseId);

    return record;
  }

  async getInventoryRecord(recordId: string): Promise<InventoryRecord | null> {
    return this.inventoryRecords.get(recordId) || null;
  }

  async getInventory(params?: {
    warehouseId?: string;
    itemId?: string;
    category?: SupplyCategory;
    status?: InventoryRecord['status'];
  }): Promise<InventoryRecord[]> {
    let records = Array.from(this.inventoryRecords.values());

    if (params?.warehouseId) {
      records = records.filter(r => r.warehouseId === params.warehouseId);
    }

    if (params?.itemId) {
      records = records.filter(r => r.itemId === params.itemId);
    }

    if (params?.category) {
      records = records.filter(r => r.category === params.category);
    }

    if (params?.status) {
      records = records.filter(r => r.status === params.status);
    }

    return records;
  }

  async adjustInventory(recordId: string, adjustment: {
    quantity: number;
    reason: string;
    adjustedBy: string;
  }): Promise<InventoryRecord> {
    const record = this.inventoryRecords.get(recordId);
    if (!record) throw new Error(`Inventory record not found: ${recordId}`);

    record.quantity += adjustment.quantity;
    record.availableQuantity = record.quantity - record.reservedQuantity;
    record.totalValue = record.quantity * record.unitCost;
    record.lastTransaction = new Date();
    record.updatedAt = new Date();

    await this.updateWarehouseInventorySummary(record.warehouseId);

    return record;
  }

  async reserveInventory(recordId: string, quantity: number): Promise<InventoryRecord> {
    const record = this.inventoryRecords.get(recordId);
    if (!record) throw new Error(`Inventory record not found: ${recordId}`);

    if (quantity > record.availableQuantity) {
      throw new Error('Insufficient available quantity');
    }

    record.reservedQuantity += quantity;
    record.availableQuantity -= quantity;
    record.updatedAt = new Date();

    return record;
  }

  async releaseReservation(recordId: string, quantity: number): Promise<InventoryRecord> {
    const record = this.inventoryRecords.get(recordId);
    if (!record) throw new Error(`Inventory record not found: ${recordId}`);

    record.reservedQuantity = Math.max(0, record.reservedQuantity - quantity);
    record.availableQuantity = record.quantity - record.reservedQuantity;
    record.updatedAt = new Date();

    return record;
  }

  private async updateWarehouseInventorySummary(warehouseId: string): Promise<void> {
    const warehouse = this.warehouses.get(warehouseId);
    if (!warehouse) return;

    const records = Array.from(this.inventoryRecords.values())
      .filter(r => r.warehouseId === warehouseId);

    const byCategory: Map<SupplyCategory, { quantity: number; value: number }> = new Map();

    records.forEach(r => {
      const existing = byCategory.get(r.category) || { quantity: 0, value: 0 };
      existing.quantity += r.quantity;
      existing.value += r.totalValue;
      byCategory.set(r.category, existing);
    });

    warehouse.inventory = {
      totalItems: records.length,
      totalValue: records.reduce((sum, r) => sum + r.totalValue, 0),
      byCategory: Array.from(byCategory.entries()).map(([category, data]) => ({
        category,
        quantity: data.quantity,
        value: data.value
      })),
      lowStock: records.filter(r => r.availableQuantity < 100).length,
      expiringSoon: records.filter(r => r.batch?.expirationDate && 
        r.batch.expirationDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000).length,
      lastUpdated: new Date()
    };

    warehouse.updatedAt = new Date();
  }

  // ==================== Supply Request Management ====================

  async createSupplyRequest(params: Omit<SupplyRequest, 'id' | 'requestNumber' | 'status' | 'approvals' | 'costs' | 'notes' | 'createdAt' | 'updatedAt'>): Promise<SupplyRequest> {
    const request: SupplyRequest = {
      ...params,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requestNumber: `SR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'submitted',
      approvals: [],
      costs: {
        itemCost: 0,
        shippingCost: 0,
        handlingCost: 0,
        totalCost: 0
      },
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.supplyRequests.set(request.id, request);
    return request;
  }

  async getSupplyRequest(requestId: string): Promise<SupplyRequest | null> {
    return this.supplyRequests.get(requestId) || null;
  }

  async getSupplyRequests(params?: {
    incidentId?: string;
    status?: RequestStatus;
    priority?: RequestPriority;
    requestedBy?: string;
  }): Promise<SupplyRequest[]> {
    let requests = Array.from(this.supplyRequests.values());

    if (params?.incidentId) {
      requests = requests.filter(r => r.incidentId === params.incidentId);
    }

    if (params?.status) {
      requests = requests.filter(r => r.status === params.status);
    }

    if (params?.priority) {
      requests = requests.filter(r => r.priority === params.priority);
    }

    if (params?.requestedBy) {
      requests = requests.filter(r => r.requestedBy.name.includes(params.requestedBy!));
    }

    return requests.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async approveRequest(requestId: string, approval: Omit<RequestApproval, 'date'>): Promise<SupplyRequest> {
    const request = this.supplyRequests.get(requestId);
    if (!request) throw new Error(`Supply request not found: ${requestId}`);

    request.approvals.push({
      ...approval,
      date: new Date()
    });

    if (approval.status === 'approved') {
      request.status = 'approved';
    } else if (approval.status === 'denied') {
      request.status = 'denied';
    }

    request.updatedAt = new Date();
    return request;
  }

  async fulfillRequest(requestId: string, fulfillment: FulfillmentInfo): Promise<SupplyRequest> {
    const request = this.supplyRequests.get(requestId);
    if (!request) throw new Error(`Supply request not found: ${requestId}`);

    request.fulfillment = fulfillment;
    request.status = 'shipping';

    // Update item quantities
    for (const item of request.items) {
      const picked = fulfillment.pickedItems.find(p => p.itemId === item.itemId);
      if (picked) {
        item.quantityFulfilled = picked.quantity;
      }
    }

    // Calculate costs
    request.costs.itemCost = request.items.reduce((sum, item) => {
      const supplyItem = this.supplyItems.get(item.itemId);
      return sum + ((item.quantityFulfilled || 0) * (supplyItem?.procurement.unitCost || 0));
    }, 0);

    request.updatedAt = new Date();
    return request;
  }

  async completeDelivery(requestId: string, delivery: DeliveryInfo): Promise<SupplyRequest> {
    const request = this.supplyRequests.get(requestId);
    if (!request) throw new Error(`Supply request not found: ${requestId}`);

    request.delivery = delivery;
    request.status = 'delivered';
    request.updatedAt = new Date();

    return request;
  }

  async addRequestNote(requestId: string, note: Omit<RequestNote, 'timestamp'>): Promise<SupplyRequest> {
    const request = this.supplyRequests.get(requestId);
    if (!request) throw new Error(`Supply request not found: ${requestId}`);

    request.notes.push({
      ...note,
      timestamp: new Date()
    });
    request.updatedAt = new Date();

    return request;
  }

  // ==================== Shipment Management ====================

  async createShipment(params: Omit<Shipment, 'id' | 'shipmentNumber' | 'status' | 'tracking' | 'documents' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
    const shipment: Shipment = {
      ...params,
      id: `ship-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      shipmentNumber: `SH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'pending',
      tracking: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.shipments.set(shipment.id, shipment);
    return shipment;
  }

  async getShipment(shipmentId: string): Promise<Shipment | null> {
    return this.shipments.get(shipmentId) || null;
  }

  async getShipments(params?: {
    type?: Shipment['type'];
    status?: ShipmentStatus;
    originId?: string;
    destinationId?: string;
  }): Promise<Shipment[]> {
    let shipments = Array.from(this.shipments.values());

    if (params?.type) {
      shipments = shipments.filter(s => s.type === params.type);
    }

    if (params?.status) {
      shipments = shipments.filter(s => s.status === params.status);
    }

    if (params?.originId) {
      shipments = shipments.filter(s => s.origin.id === params.originId);
    }

    if (params?.destinationId) {
      shipments = shipments.filter(s => s.destination.id === params.destinationId);
    }

    return shipments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateShipmentStatus(shipmentId: string, status: ShipmentStatus, location?: string): Promise<Shipment> {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) throw new Error(`Shipment not found: ${shipmentId}`);

    shipment.status = status;

    // Update schedule timestamps
    if (status === 'in_transit' && !shipment.schedule.actualPickup) {
      shipment.schedule.actualPickup = new Date();
    } else if (status === 'delivered') {
      shipment.schedule.actualDelivery = new Date();
    }

    // Add tracking entry
    shipment.tracking.push({
      timestamp: new Date(),
      location: location || shipment.origin.city,
      status: status
    });

    shipment.updatedAt = new Date();
    return shipment;
  }

  async addTrackingUpdate(shipmentId: string, tracking: Omit<ShipmentTracking, 'timestamp'>): Promise<Shipment> {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) throw new Error(`Shipment not found: ${shipmentId}`);

    shipment.tracking.push({
      ...tracking,
      timestamp: new Date()
    });
    shipment.updatedAt = new Date();

    return shipment;
  }

  // ==================== Distribution Point Management ====================

  async createDistributionPoint(params: Omit<DistributionPoint, 'id' | 'inventory' | 'statistics' | 'createdAt' | 'updatedAt'>): Promise<DistributionPoint> {
    const point: DistributionPoint = {
      ...params,
      id: `dist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      inventory: [],
      statistics: {
        totalServed: 0,
        householdsServed: 0,
        individualsServed: 0,
        itemsDistributed: 0,
        averageServiceTime: '0 minutes'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.distributionPoints.set(point.id, point);
    return point;
  }

  async getDistributionPoint(pointId: string): Promise<DistributionPoint | null> {
    return this.distributionPoints.get(pointId) || null;
  }

  async getDistributionPoints(params?: {
    incidentId?: string;
    type?: DistributionPoint['type'];
    status?: DistributionPoint['status'];
  }): Promise<DistributionPoint[]> {
    let points = Array.from(this.distributionPoints.values());

    if (params?.incidentId) {
      points = points.filter(p => p.incidentId === params.incidentId);
    }

    if (params?.type) {
      points = points.filter(p => p.type === params.type);
    }

    if (params?.status) {
      points = points.filter(p => p.status === params.status);
    }

    return points;
  }

  async updateDistributionPointStatus(pointId: string, status: DistributionPoint['status']): Promise<DistributionPoint> {
    const point = this.distributionPoints.get(pointId);
    if (!point) throw new Error(`Distribution point not found: ${pointId}`);

    point.status = status;

    if (status === 'closed') {
      point.schedule.actualCloseDate = new Date();
    }

    point.updatedAt = new Date();
    return point;
  }

  async recordDistribution(pointId: string, distribution: {
    households: number;
    individuals: number;
    items: { itemId: string; quantity: number }[];
  }): Promise<DistributionPoint> {
    const point = this.distributionPoints.get(pointId);
    if (!point) throw new Error(`Distribution point not found: ${pointId}`);

    point.statistics.totalServed++;
    point.statistics.householdsServed += distribution.households;
    point.statistics.individualsServed += distribution.individuals;

    let totalItems = 0;
    for (const item of distribution.items) {
      const inv = point.inventory.find(i => i.itemId === item.itemId);
      if (inv) {
        inv.currentQuantity -= item.quantity;
        inv.distributed += item.quantity;
        inv.status = inv.currentQuantity <= inv.reorderPoint ? 
          (inv.currentQuantity === 0 ? 'out' : 'low') : 'adequate';
      }
      totalItems += item.quantity;
    }

    point.statistics.itemsDistributed += totalItems;
    point.updatedAt = new Date();

    return point;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalWarehouses: number;
    activeWarehouses: number;
    totalInventoryValue: number;
    totalSupplyItems: number;
    lowStockItems: number;
    pendingRequests: number;
    totalRequests: number;
    activeShipments: number;
    totalShipments: number;
    distributionPoints: number;
    activeDistributionPoints: number;
    totalServed: number;
    byCategory: Record<SupplyCategory, number>;
    byWarehouseUtilization: { name: string; utilization: number }[];
  }> {
    const warehouses = Array.from(this.warehouses.values());
    const inventory = Array.from(this.inventoryRecords.values());
    const requests = Array.from(this.supplyRequests.values());
    const shipments = Array.from(this.shipments.values());
    const distributionPoints = Array.from(this.distributionPoints.values());

    let totalInventoryValue = 0;
    let lowStockItems = 0;
    const byCategory: Record<SupplyCategory, number> = {} as any;

    inventory.forEach(r => {
      totalInventoryValue += r.totalValue;
      if (r.availableQuantity < 100) lowStockItems++;
      byCategory[r.category] = (byCategory[r.category] || 0) + r.quantity;
    });

    let totalServed = 0;
    distributionPoints.forEach(p => {
      totalServed += p.statistics.totalServed;
    });

    const byWarehouseUtilization = warehouses.map(w => ({
      name: w.name,
      utilization: w.capacity.utilizationPercent
    }));

    return {
      totalWarehouses: warehouses.length,
      activeWarehouses: warehouses.filter(w => w.status === 'active').length,
      totalInventoryValue,
      totalSupplyItems: this.supplyItems.size,
      lowStockItems,
      pendingRequests: requests.filter(r => ['submitted', 'reviewing'].includes(r.status)).length,
      totalRequests: requests.length,
      activeShipments: shipments.filter(s => s.status === 'in_transit').length,
      totalShipments: shipments.length,
      distributionPoints: distributionPoints.length,
      activeDistributionPoints: distributionPoints.filter(p => p.status === 'open').length,
      totalServed,
      byCategory,
      byWarehouseUtilization
    };
  }
}

export const logisticsService = LogisticsService.getInstance();
export default LogisticsService;

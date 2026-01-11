/**
 * Medical Supply Tracking Service - Issue #128 Implementation
 * 
 * Provides comprehensive medical supply chain management including inventory
 * tracking, expiration monitoring, distribution logistics, and demand forecasting
 * for emergency medical supplies during disaster response.
 */

// Type definitions
type SupplyCategory = 'medications' | 'ppe' | 'equipment' | 'consumables' | 'blood_products' | 'vaccines' | 'fluids' | 'surgical' | 'diagnostic' | 'respiratory' | 'trauma' | 'pediatric';
type SupplyStatus = 'available' | 'low_stock' | 'critical' | 'out_of_stock' | 'expired' | 'recalled';
type StorageCondition = 'room_temperature' | 'refrigerated' | 'frozen' | 'controlled_substance' | 'hazardous';
type TransferStatus = 'pending' | 'approved' | 'in_transit' | 'delivered' | 'cancelled';
type UrgencyLevel = 'critical' | 'urgent' | 'routine' | 'planned';

// Supply interfaces
interface MedicalSupply {
  id: string;
  name: string;
  genericName?: string;
  category: SupplyCategory;
  sku: string;
  ndc?: string; // National Drug Code
  manufacturer: string;
  description: string;
  unitOfMeasure: string;
  reorderPoint: number;
  criticalLevel: number;
  maxQuantity: number;
  storageConditions: StorageCondition[];
  temperatureRange?: { min: number; max: number };
  shelfLifeDays?: number;
  controlledSubstance: boolean;
  scheduleClass?: 'II' | 'III' | 'IV' | 'V';
  requiresPrescription: boolean;
  alternativeSupplies?: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryItem {
  id: string;
  supplyId: string;
  facilityId: string;
  lotNumber: string;
  batchNumber?: string;
  quantity: number;
  reservedQuantity: number;
  expirationDate: Date;
  manufacturingDate?: Date;
  receivedDate: Date;
  location: StorageLocation;
  status: SupplyStatus;
  lastCheckedAt: Date;
  lastCheckedBy: string;
  notes?: string;
}

interface StorageLocation {
  building: string;
  floor?: string;
  room: string;
  shelf?: string;
  bin?: string;
  coordinates?: { x: number; y: number; z: number };
  temperature?: number;
  humidity?: number;
}

interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'warehouse' | 'field_hospital' | 'pharmacy' | 'distribution_center' | 'mobile_unit';
  address: string;
  location: { lat: number; lon: number };
  contacts: FacilityContact[];
  operatingHours: { open: string; close: string; timezone: string };
  storageCapabilities: StorageCondition[];
  certifications: string[];
  status: 'operational' | 'limited' | 'offline';
  lastInventoryDate?: Date;
}

interface FacilityContact {
  name: string;
  role: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface SupplyRequest {
  id: string;
  requestingFacilityId: string;
  incidentId?: string;
  requestedBy: {
    id: string;
    name: string;
    role: string;
  };
  items: RequestItem[];
  urgency: UrgencyLevel;
  justification: string;
  neededBy: Date;
  status: 'draft' | 'submitted' | 'approved' | 'partial' | 'fulfilled' | 'denied' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  fulfillments: Fulfillment[];
  createdAt: Date;
  updatedAt: Date;
}

interface RequestItem {
  supplyId: string;
  supplyName: string;
  requestedQuantity: number;
  fulfilledQuantity: number;
  priority: number;
  notes?: string;
}

interface Fulfillment {
  id: string;
  requestId: string;
  sourceFacilityId: string;
  items: FulfillmentItem[];
  status: TransferStatus;
  transferId?: string;
  createdAt: Date;
}

interface FulfillmentItem {
  supplyId: string;
  inventoryItemId: string;
  quantity: number;
  lotNumber: string;
}

interface SupplyTransfer {
  id: string;
  sourceFacilityId: string;
  destinationFacilityId: string;
  requestId?: string;
  items: TransferItem[];
  carrier?: {
    name: string;
    trackingNumber?: string;
    vehicleId?: string;
    driver?: string;
  };
  scheduledPickup?: Date;
  actualPickup?: Date;
  scheduledDelivery?: Date;
  actualDelivery?: Date;
  status: TransferStatus;
  temperatureLog?: TemperatureReading[];
  signatures: TransferSignature[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TransferItem {
  supplyId: string;
  inventoryItemId: string;
  quantity: number;
  lotNumber: string;
  condition: 'good' | 'damaged' | 'partial';
}

interface TemperatureReading {
  timestamp: Date;
  temperature: number;
  humidity?: number;
  location: string;
  withinRange: boolean;
}

interface TransferSignature {
  type: 'pickup' | 'delivery' | 'chain_of_custody';
  signedBy: string;
  signedAt: Date;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'wholesaler' | 'government';
  contacts: FacilityContact[];
  address: string;
  supplies: SupplierProduct[];
  leadTimeDays: number;
  minimumOrderQuantity?: number;
  contractExpiration?: Date;
  rating: number;
  isPreferred: boolean;
  emergencyCapable: boolean;
}

interface SupplierProduct {
  supplyId: string;
  unitPrice: number;
  currency: string;
  packSize: number;
  lastPriceUpdate: Date;
}

interface ExpirationAlert {
  id: string;
  inventoryItemId: string;
  supplyId: string;
  facilityId: string;
  expirationDate: Date;
  daysUntilExpiration: number;
  quantity: number;
  alertLevel: 'warning' | 'critical' | 'expired';
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  action?: 'use' | 'transfer' | 'dispose';
  createdAt: Date;
}

interface DemandForecast {
  supplyId: string;
  facilityId: string;
  period: { start: Date; end: Date };
  predictedDemand: number;
  confidence: number;
  factors: string[];
  recommendation: 'increase_stock' | 'maintain' | 'reduce_stock';
  suggestedQuantity: number;
}

interface UsageRecord {
  id: string;
  supplyId: string;
  inventoryItemId: string;
  facilityId: string;
  quantity: number;
  usedBy: string;
  usedFor: string;
  patientId?: string;
  incidentId?: string;
  timestamp: Date;
}

// Sample data
const sampleSupplies: MedicalSupply[] = [
  {
    id: 'supply-001',
    name: 'Epinephrine Auto-Injector',
    genericName: 'Epinephrine',
    category: 'medications',
    sku: 'EPI-AI-001',
    ndc: '0074-3875-01',
    manufacturer: 'Meridian Medical',
    description: '0.3mg/0.3mL auto-injector for emergency treatment of anaphylaxis',
    unitOfMeasure: 'unit',
    reorderPoint: 50,
    criticalLevel: 20,
    maxQuantity: 200,
    storageConditions: ['room_temperature'],
    temperatureRange: { min: 20, max: 25 },
    shelfLifeDays: 365,
    controlledSubstance: false,
    requiresPrescription: true,
    alternativeSupplies: ['supply-002'],
    tags: ['emergency', 'allergy', 'anaphylaxis'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'supply-002',
    name: 'Morphine Sulfate Injection',
    genericName: 'Morphine',
    category: 'medications',
    sku: 'MOR-INJ-001',
    ndc: '0641-0175-21',
    manufacturer: 'Hospira',
    description: '10mg/mL injection for severe pain management',
    unitOfMeasure: 'vial',
    reorderPoint: 100,
    criticalLevel: 30,
    maxQuantity: 500,
    storageConditions: ['controlled_substance', 'room_temperature'],
    temperatureRange: { min: 15, max: 30 },
    shelfLifeDays: 730,
    controlledSubstance: true,
    scheduleClass: 'II',
    requiresPrescription: true,
    tags: ['pain', 'narcotic', 'controlled'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'supply-003',
    name: 'N95 Respirator Mask',
    category: 'ppe',
    sku: 'N95-MSK-001',
    manufacturer: '3M',
    description: 'NIOSH-approved N95 particulate respirator',
    unitOfMeasure: 'box',
    reorderPoint: 500,
    criticalLevel: 100,
    maxQuantity: 2000,
    storageConditions: ['room_temperature'],
    shelfLifeDays: 1825,
    controlledSubstance: false,
    requiresPrescription: false,
    tags: ['ppe', 'respiratory', 'covid'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleFacilities: Facility[] = [
  {
    id: 'facility-001',
    name: 'Metro General Hospital',
    type: 'hospital',
    address: '100 Medical Center Dr',
    location: { lat: 34.0522, lon: -118.2437 },
    contacts: [
      { name: 'Sarah Johnson', role: 'Supply Manager', phone: '+1-555-0101', email: 'sjohnson@metrogeneral.org', isPrimary: true }
    ],
    operatingHours: { open: '00:00', close: '23:59', timezone: 'America/Los_Angeles' },
    storageCapabilities: ['room_temperature', 'refrigerated', 'frozen', 'controlled_substance'],
    certifications: ['Joint Commission', 'DEA Licensed'],
    status: 'operational'
  },
  {
    id: 'facility-002',
    name: 'Regional Distribution Center',
    type: 'distribution_center',
    address: '500 Logistics Way',
    location: { lat: 34.1522, lon: -118.3437 },
    contacts: [
      { name: 'Mike Thompson', role: 'Warehouse Manager', phone: '+1-555-0102', email: 'mthompson@regionaldist.org', isPrimary: true }
    ],
    operatingHours: { open: '06:00', close: '22:00', timezone: 'America/Los_Angeles' },
    storageCapabilities: ['room_temperature', 'refrigerated', 'frozen'],
    certifications: ['FDA Registered', 'cGMP Compliant'],
    status: 'operational'
  }
];

class MedicalSupplyTrackingService {
  private static instance: MedicalSupplyTrackingService;
  private supplies: Map<string, MedicalSupply> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private facilities: Map<string, Facility> = new Map();
  private requests: Map<string, SupplyRequest> = new Map();
  private transfers: Map<string, SupplyTransfer> = new Map();
  private suppliers: Map<string, Supplier> = new Map();
  private expirationAlerts: Map<string, ExpirationAlert> = new Map();
  private usageRecords: Map<string, UsageRecord> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): MedicalSupplyTrackingService {
    if (!MedicalSupplyTrackingService.instance) {
      MedicalSupplyTrackingService.instance = new MedicalSupplyTrackingService();
    }
    return MedicalSupplyTrackingService.instance;
  }

  private initializeSampleData(): void {
    sampleSupplies.forEach(s => this.supplies.set(s.id, s));
    sampleFacilities.forEach(f => this.facilities.set(f.id, f));
    this.generateSampleInventory();
  }

  private generateSampleInventory(): void {
    // Generate inventory items for sample supplies at sample facilities
    sampleSupplies.forEach(supply => {
      sampleFacilities.forEach(facility => {
        const item: InventoryItem = {
          id: `inv-${supply.id}-${facility.id}`,
          supplyId: supply.id,
          facilityId: facility.id,
          lotNumber: `LOT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          quantity: Math.floor(Math.random() * supply.maxQuantity),
          reservedQuantity: 0,
          expirationDate: new Date(Date.now() + (supply.shelfLifeDays || 365) * 24 * 60 * 60 * 1000),
          receivedDate: new Date(),
          location: {
            building: 'Main',
            room: 'Storage A',
            shelf: 'S1',
            bin: 'B1'
          },
          status: 'available',
          lastCheckedAt: new Date(),
          lastCheckedBy: 'System'
        };
        this.inventory.set(item.id, item);
      });
    });
  }

  // ==================== Supply Management ====================

  async registerSupply(supply: Omit<MedicalSupply, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalSupply> {
    const newSupply: MedicalSupply = {
      ...supply,
      id: `supply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.supplies.set(newSupply.id, newSupply);
    return newSupply;
  }

  async getSupply(supplyId: string): Promise<MedicalSupply | null> {
    return this.supplies.get(supplyId) || null;
  }

  async searchSupplies(query: {
    term?: string;
    category?: SupplyCategory;
    controlledOnly?: boolean;
    tags?: string[];
  }): Promise<MedicalSupply[]> {
    let supplies = Array.from(this.supplies.values());

    if (query.term) {
      const term = query.term.toLowerCase();
      supplies = supplies.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.genericName?.toLowerCase().includes(term) ||
        s.sku.toLowerCase().includes(term) ||
        s.ndc?.includes(term)
      );
    }

    if (query.category) {
      supplies = supplies.filter(s => s.category === query.category);
    }

    if (query.controlledOnly) {
      supplies = supplies.filter(s => s.controlledSubstance);
    }

    if (query.tags && query.tags.length > 0) {
      supplies = supplies.filter(s =>
        query.tags!.some(tag => s.tags.includes(tag))
      );
    }

    return supplies;
  }

  // ==================== Inventory Management ====================

  async addInventory(params: {
    supplyId: string;
    facilityId: string;
    lotNumber: string;
    quantity: number;
    expirationDate: Date;
    location: StorageLocation;
    batchNumber?: string;
    manufacturingDate?: Date;
  }): Promise<InventoryItem> {
    const supply = this.supplies.get(params.supplyId);
    if (!supply) throw new Error(`Supply not found: ${params.supplyId}`);

    const facility = this.facilities.get(params.facilityId);
    if (!facility) throw new Error(`Facility not found: ${params.facilityId}`);

    const item: InventoryItem = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      supplyId: params.supplyId,
      facilityId: params.facilityId,
      lotNumber: params.lotNumber,
      batchNumber: params.batchNumber,
      quantity: params.quantity,
      reservedQuantity: 0,
      expirationDate: params.expirationDate,
      manufacturingDate: params.manufacturingDate,
      receivedDate: new Date(),
      location: params.location,
      status: 'available',
      lastCheckedAt: new Date(),
      lastCheckedBy: 'System'
    };

    this.inventory.set(item.id, item);

    // Check for expiration alerts
    await this.checkExpirationAlert(item);

    return item;
  }

  async getInventoryItem(itemId: string): Promise<InventoryItem | null> {
    return this.inventory.get(itemId) || null;
  }

  async getInventoryByFacility(facilityId: string): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values())
      .filter(item => item.facilityId === facilityId);
  }

  async getInventoryBySupply(supplyId: string, facilityId?: string): Promise<InventoryItem[]> {
    let items = Array.from(this.inventory.values())
      .filter(item => item.supplyId === supplyId);

    if (facilityId) {
      items = items.filter(item => item.facilityId === facilityId);
    }

    return items;
  }

  async adjustInventory(itemId: string, adjustment: number, reason: string, adjustedBy: string): Promise<InventoryItem> {
    const item = this.inventory.get(itemId);
    if (!item) throw new Error(`Inventory item not found: ${itemId}`);

    item.quantity += adjustment;
    item.lastCheckedAt = new Date();
    item.lastCheckedBy = adjustedBy;

    // Update status
    await this.updateInventoryStatus(item);

    // Record usage if negative adjustment
    if (adjustment < 0) {
      const usage: UsageRecord = {
        id: `usage-${Date.now()}`,
        supplyId: item.supplyId,
        inventoryItemId: itemId,
        facilityId: item.facilityId,
        quantity: Math.abs(adjustment),
        usedBy: adjustedBy,
        usedFor: reason,
        timestamp: new Date()
      };
      this.usageRecords.set(usage.id, usage);
    }

    return item;
  }

  private async updateInventoryStatus(item: InventoryItem): Promise<void> {
    const supply = this.supplies.get(item.supplyId);
    if (!supply) return;

    const now = new Date();
    if (item.expirationDate < now) {
      item.status = 'expired';
    } else if (item.quantity <= 0) {
      item.status = 'out_of_stock';
    } else if (item.quantity <= supply.criticalLevel) {
      item.status = 'critical';
    } else if (item.quantity <= supply.reorderPoint) {
      item.status = 'low_stock';
    } else {
      item.status = 'available';
    }
  }

  async reserveInventory(itemId: string, quantity: number, reservedFor: string): Promise<InventoryItem> {
    const item = this.inventory.get(itemId);
    if (!item) throw new Error(`Inventory item not found: ${itemId}`);

    const availableQuantity = item.quantity - item.reservedQuantity;
    if (quantity > availableQuantity) {
      throw new Error(`Insufficient available quantity. Available: ${availableQuantity}, Requested: ${quantity}`);
    }

    item.reservedQuantity += quantity;
    item.notes = `${item.notes || ''}\nReserved ${quantity} for ${reservedFor} at ${new Date().toISOString()}`;

    return item;
  }

  async releaseReservation(itemId: string, quantity: number): Promise<InventoryItem> {
    const item = this.inventory.get(itemId);
    if (!item) throw new Error(`Inventory item not found: ${itemId}`);

    item.reservedQuantity = Math.max(0, item.reservedQuantity - quantity);
    return item;
  }

  // ==================== Supply Requests ====================

  async createSupplyRequest(params: {
    requestingFacilityId: string;
    incidentId?: string;
    requestedBy: SupplyRequest['requestedBy'];
    items: Omit<RequestItem, 'fulfilledQuantity'>[];
    urgency: UrgencyLevel;
    justification: string;
    neededBy: Date;
  }): Promise<SupplyRequest> {
    const request: SupplyRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requestingFacilityId: params.requestingFacilityId,
      incidentId: params.incidentId,
      requestedBy: params.requestedBy,
      items: params.items.map(item => ({ ...item, fulfilledQuantity: 0 })),
      urgency: params.urgency,
      justification: params.justification,
      neededBy: params.neededBy,
      status: 'submitted',
      fulfillments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.requests.set(request.id, request);
    return request;
  }

  async approveRequest(requestId: string, approvedBy: string): Promise<SupplyRequest> {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    request.status = 'approved';
    request.approvedBy = approvedBy;
    request.approvedAt = new Date();
    request.updatedAt = new Date();

    // Auto-find fulfillment sources
    await this.findFulfillmentSources(request);

    return request;
  }

  private async findFulfillmentSources(request: SupplyRequest): Promise<void> {
    for (const item of request.items) {
      const remainingQuantity = item.requestedQuantity - item.fulfilledQuantity;
      if (remainingQuantity <= 0) continue;

      // Find available inventory at other facilities
      const inventoryItems = Array.from(this.inventory.values())
        .filter(inv =>
          inv.supplyId === item.supplyId &&
          inv.facilityId !== request.requestingFacilityId &&
          inv.status === 'available' &&
          inv.quantity - inv.reservedQuantity > 0
        )
        .sort((a, b) => {
          // Prioritize items expiring sooner (FEFO)
          return a.expirationDate.getTime() - b.expirationDate.getTime();
        });

      let quantityToFulfill = remainingQuantity;
      for (const inv of inventoryItems) {
        if (quantityToFulfill <= 0) break;

        const availableQty = inv.quantity - inv.reservedQuantity;
        const fulfillQty = Math.min(availableQty, quantityToFulfill);

        // Reserve the inventory
        await this.reserveInventory(inv.id, fulfillQty, `Request ${request.id}`);

        // Create fulfillment
        const fulfillment: Fulfillment = {
          id: `fulfill-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          requestId: request.id,
          sourceFacilityId: inv.facilityId,
          items: [{
            supplyId: item.supplyId,
            inventoryItemId: inv.id,
            quantity: fulfillQty,
            lotNumber: inv.lotNumber
          }],
          status: 'pending',
          createdAt: new Date()
        };

        request.fulfillments.push(fulfillment);
        item.fulfilledQuantity += fulfillQty;
        quantityToFulfill -= fulfillQty;
      }
    }

    // Update request status
    const allFulfilled = request.items.every(i => i.fulfilledQuantity >= i.requestedQuantity);
    const partialFulfilled = request.items.some(i => i.fulfilledQuantity > 0);

    if (allFulfilled) {
      request.status = 'fulfilled';
    } else if (partialFulfilled) {
      request.status = 'partial';
    }
  }

  async getRequest(requestId: string): Promise<SupplyRequest | null> {
    return this.requests.get(requestId) || null;
  }

  async getRequestsByFacility(facilityId: string): Promise<SupplyRequest[]> {
    return Array.from(this.requests.values())
      .filter(r => r.requestingFacilityId === facilityId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ==================== Transfer Management ====================

  async createTransfer(params: {
    sourceFacilityId: string;
    destinationFacilityId: string;
    requestId?: string;
    items: { inventoryItemId: string; quantity: number }[];
    scheduledPickup?: Date;
    scheduledDelivery?: Date;
  }): Promise<SupplyTransfer> {
    const transferItems: TransferItem[] = [];

    for (const item of params.items) {
      const invItem = this.inventory.get(item.inventoryItemId);
      if (!invItem) throw new Error(`Inventory item not found: ${item.inventoryItemId}`);

      transferItems.push({
        supplyId: invItem.supplyId,
        inventoryItemId: item.inventoryItemId,
        quantity: item.quantity,
        lotNumber: invItem.lotNumber,
        condition: 'good'
      });

      // Reduce source inventory
      await this.adjustInventory(item.inventoryItemId, -item.quantity, `Transfer out`, 'System');
    }

    const transfer: SupplyTransfer = {
      id: `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceFacilityId: params.sourceFacilityId,
      destinationFacilityId: params.destinationFacilityId,
      requestId: params.requestId,
      items: transferItems,
      scheduledPickup: params.scheduledPickup,
      scheduledDelivery: params.scheduledDelivery,
      status: 'pending',
      temperatureLog: [],
      signatures: [],
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.transfers.set(transfer.id, transfer);
    return transfer;
  }

  async updateTransferStatus(transferId: string, status: TransferStatus, signature?: Omit<TransferSignature, 'signedAt'>): Promise<SupplyTransfer> {
    const transfer = this.transfers.get(transferId);
    if (!transfer) throw new Error(`Transfer not found: ${transferId}`);

    transfer.status = status;
    transfer.updatedAt = new Date();

    if (status === 'in_transit') {
      transfer.actualPickup = new Date();
    }

    if (status === 'delivered') {
      transfer.actualDelivery = new Date();

      // Add items to destination inventory
      for (const item of transfer.items) {
        const sourceItem = this.inventory.get(item.inventoryItemId);
        if (sourceItem) {
          await this.addInventory({
            supplyId: item.supplyId,
            facilityId: transfer.destinationFacilityId,
            lotNumber: item.lotNumber,
            quantity: item.quantity,
            expirationDate: sourceItem.expirationDate,
            location: {
              building: 'Receiving',
              room: 'Pending',
              shelf: 'TBD',
              bin: 'TBD'
            }
          });
        }
      }
    }

    if (signature) {
      transfer.signatures.push({
        ...signature,
        signedAt: new Date()
      });
    }

    return transfer;
  }

  async logTransferTemperature(transferId: string, reading: Omit<TemperatureReading, 'withinRange'>): Promise<SupplyTransfer> {
    const transfer = this.transfers.get(transferId);
    if (!transfer) throw new Error(`Transfer not found: ${transferId}`);

    // Check if temperature is within range for all items
    let withinRange = true;
    for (const item of transfer.items) {
      const supply = this.supplies.get(item.supplyId);
      if (supply?.temperatureRange) {
        if (reading.temperature < supply.temperatureRange.min ||
            reading.temperature > supply.temperatureRange.max) {
          withinRange = false;
          break;
        }
      }
    }

    transfer.temperatureLog = transfer.temperatureLog || [];
    transfer.temperatureLog.push({
      ...reading,
      withinRange
    });

    return transfer;
  }

  // ==================== Expiration Management ====================

  private async checkExpirationAlert(item: InventoryItem): Promise<void> {
    const supply = this.supplies.get(item.supplyId);
    if (!supply) return;

    const now = new Date();
    const daysUntilExpiration = Math.ceil(
      (item.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let alertLevel: ExpirationAlert['alertLevel'] | null = null;

    if (daysUntilExpiration <= 0) {
      alertLevel = 'expired';
    } else if (daysUntilExpiration <= 30) {
      alertLevel = 'critical';
    } else if (daysUntilExpiration <= 90) {
      alertLevel = 'warning';
    }

    if (alertLevel) {
      const alert: ExpirationAlert = {
        id: `alert-${Date.now()}-${item.id}`,
        inventoryItemId: item.id,
        supplyId: item.supplyId,
        facilityId: item.facilityId,
        expirationDate: item.expirationDate,
        daysUntilExpiration,
        quantity: item.quantity,
        alertLevel,
        acknowledged: false,
        createdAt: new Date()
      };

      this.expirationAlerts.set(alert.id, alert);
    }
  }

  async getExpirationAlerts(facilityId?: string, acknowledged?: boolean): Promise<ExpirationAlert[]> {
    let alerts = Array.from(this.expirationAlerts.values());

    if (facilityId) {
      alerts = alerts.filter(a => a.facilityId === facilityId);
    }

    if (acknowledged !== undefined) {
      alerts = alerts.filter(a => a.acknowledged === acknowledged);
    }

    return alerts.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
  }

  async acknowledgeExpirationAlert(alertId: string, acknowledgedBy: string, action: ExpirationAlert['action']): Promise<ExpirationAlert> {
    const alert = this.expirationAlerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();
    alert.action = action;

    return alert;
  }

  async scanForExpiringItems(): Promise<ExpirationAlert[]> {
    const alerts: ExpirationAlert[] = [];

    for (const item of this.inventory.values()) {
      await this.checkExpirationAlert(item);
    }

    return this.getExpirationAlerts(undefined, false);
  }

  // ==================== Demand Forecasting ====================

  async forecastDemand(supplyId: string, facilityId: string, periodDays: number = 30): Promise<DemandForecast> {
    const supply = this.supplies.get(supplyId);
    if (!supply) throw new Error(`Supply not found: ${supplyId}`);

    // Get historical usage data
    const usageHistory = Array.from(this.usageRecords.values())
      .filter(u => u.supplyId === supplyId && u.facilityId === facilityId);

    // Calculate average daily usage
    const totalUsage = usageHistory.reduce((sum, u) => sum + u.quantity, 0);
    const daysWithData = Math.max(1, usageHistory.length);
    const avgDailyUsage = totalUsage / daysWithData;

    // Predict demand with safety factor
    const predictedDemand = Math.ceil(avgDailyUsage * periodDays * 1.2);

    // Get current inventory
    const currentInventory = Array.from(this.inventory.values())
      .filter(i => i.supplyId === supplyId && i.facilityId === facilityId)
      .reduce((sum, i) => sum + i.quantity - i.reservedQuantity, 0);

    let recommendation: DemandForecast['recommendation'] = 'maintain';
    let suggestedQuantity = 0;

    if (currentInventory < predictedDemand) {
      recommendation = 'increase_stock';
      suggestedQuantity = predictedDemand - currentInventory + supply.reorderPoint;
    } else if (currentInventory > supply.maxQuantity) {
      recommendation = 'reduce_stock';
      suggestedQuantity = currentInventory - supply.maxQuantity;
    }

    return {
      supplyId,
      facilityId,
      period: { start: new Date(), end: new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000) },
      predictedDemand,
      confidence: usageHistory.length > 10 ? 0.85 : 0.5,
      factors: ['Historical usage', 'Safety stock', 'Seasonal adjustment'],
      recommendation,
      suggestedQuantity
    };
  }

  // ==================== Statistics ====================

  async getInventoryStatistics(facilityId?: string): Promise<{
    totalItems: number;
    totalValue: number;
    byStatus: Record<SupplyStatus, number>;
    byCategory: Record<SupplyCategory, number>;
    expiringWithin30Days: number;
    lowStockItems: number;
    criticalItems: number;
  }> {
    let items = Array.from(this.inventory.values());

    if (facilityId) {
      items = items.filter(i => i.facilityId === facilityId);
    }

    const byStatus: Record<SupplyStatus, number> = {
      available: 0,
      low_stock: 0,
      critical: 0,
      out_of_stock: 0,
      expired: 0,
      recalled: 0
    };

    const byCategory: Record<SupplyCategory, number> = {
      medications: 0,
      ppe: 0,
      equipment: 0,
      consumables: 0,
      blood_products: 0,
      vaccines: 0,
      fluids: 0,
      surgical: 0,
      diagnostic: 0,
      respiratory: 0,
      trauma: 0,
      pediatric: 0
    };

    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    for (const item of items) {
      byStatus[item.status]++;

      const supply = this.supplies.get(item.supplyId);
      if (supply) {
        byCategory[supply.category] = (byCategory[supply.category] || 0) + item.quantity;
      }
    }

    return {
      totalItems: items.length,
      totalValue: 0, // Would calculate based on unit prices
      byStatus,
      byCategory,
      expiringWithin30Days: items.filter(i => i.expirationDate <= thirtyDaysFromNow && i.expirationDate > new Date()).length,
      lowStockItems: byStatus.low_stock,
      criticalItems: byStatus.critical
    };
  }

  // ==================== Facility Management ====================

  async registerFacility(facility: Omit<Facility, 'id'>): Promise<Facility> {
    const newFacility: Facility = {
      ...facility,
      id: `facility-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.facilities.set(newFacility.id, newFacility);
    return newFacility;
  }

  async getFacility(facilityId: string): Promise<Facility | null> {
    return this.facilities.get(facilityId) || null;
  }

  async getAllFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }

  async updateFacilityStatus(facilityId: string, status: Facility['status']): Promise<Facility> {
    const facility = this.facilities.get(facilityId);
    if (!facility) throw new Error(`Facility not found: ${facilityId}`);

    facility.status = status;
    return facility;
  }
}

export const medicalSupplyTrackingService = MedicalSupplyTrackingService.getInstance();
export default MedicalSupplyTrackingService;

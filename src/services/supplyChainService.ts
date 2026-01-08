/**
 * Supply Chain Management Service
 * Manage relief supplies, inventory, and distribution
 */

// Item category
type ItemCategory = 
  | 'food'
  | 'water'
  | 'medicine'
  | 'clothing'
  | 'shelter'
  | 'hygiene'
  | 'baby_care'
  | 'medical_equipment'
  | 'communication'
  | 'tools'
  | 'bedding'
  | 'cooking'
  | 'lighting'
  | 'other';

// Item status
type ItemStatus = 'available' | 'reserved' | 'allocated' | 'in_transit' | 'delivered' | 'expired' | 'damaged';

// Warehouse status
type WarehouseStatus = 'operational' | 'full' | 'limited' | 'closed' | 'emergency';

// Shipment status
type ShipmentStatus = 'pending' | 'preparing' | 'dispatched' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';

// Priority level
type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

// Transport mode
type TransportMode = 'road' | 'rail' | 'air' | 'water' | 'helicopter';

// Supply item
interface SupplyItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ItemCategory;
  subcategory?: string;
  unit: string;
  unitWeight?: number; // in kg
  unitVolume?: number; // in liters
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  shelfLife?: number; // in days
  storageRequirements?: StorageRequirements;
  specifications?: Record<string, string>;
  images?: string[];
  barcode?: string;
  isPerishable: boolean;
  isHazardous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Storage requirements
interface StorageRequirements {
  temperatureMin?: number;
  temperatureMax?: number;
  humidity?: { min: number; max: number };
  specialConditions?: string[];
}

// Inventory item
interface InventoryItem {
  id: string;
  itemId: string;
  warehouseId: string;
  batchNumber: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  status: ItemStatus;
  receivedDate: Date;
  expiryDate?: Date;
  manufactureDate?: Date;
  sourceType: 'donation' | 'purchase' | 'government' | 'transfer';
  sourceId?: string;
  sourceName?: string;
  cost?: number;
  location: StorageLocation;
  condition: 'new' | 'good' | 'fair' | 'poor';
  notes?: string;
  lastAuditDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Storage location
interface StorageLocation {
  zone: string;
  aisle?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
}

// Warehouse
interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: 'central' | 'regional' | 'mobile' | 'temporary';
  status: WarehouseStatus;
  address: WarehouseAddress;
  capacity: WarehouseCapacity;
  currentUtilization: number;
  operatingHours: OperatingHours;
  contactPerson: ContactPerson;
  facilities: string[];
  equipment: WarehouseEquipment[];
  certifications?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Warehouse address
interface WarehouseAddress {
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  coordinates: { lat: number; lng: number };
  landmark?: string;
}

// Warehouse capacity
interface WarehouseCapacity {
  totalArea: number; // in sq meters
  storageArea: number;
  coldStorageArea?: number;
  loadingDocks: number;
  maxPallets: number;
  currentPallets: number;
}

// Operating hours
interface OperatingHours {
  monday: { open: string; close: string } | null;
  tuesday: { open: string; close: string } | null;
  wednesday: { open: string; close: string } | null;
  thursday: { open: string; close: string } | null;
  friday: { open: string; close: string } | null;
  saturday: { open: string; close: string } | null;
  sunday: { open: string; close: string } | null;
  is24x7Emergency: boolean;
}

// Contact person
interface ContactPerson {
  name: string;
  designation: string;
  phone: string;
  alternatePhone?: string;
  email: string;
}

// Warehouse equipment
interface WarehouseEquipment {
  type: string;
  quantity: number;
  condition: 'operational' | 'needs_maintenance' | 'out_of_service';
}

// Shipment
interface Shipment {
  id: string;
  shipmentNumber: string;
  type: 'inbound' | 'outbound' | 'transfer';
  status: ShipmentStatus;
  priority: PriorityLevel;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  items: ShipmentItem[];
  transportMode: TransportMode;
  vehicleInfo?: VehicleInfo;
  driverInfo?: DriverInfo;
  timeline: ShipmentTimeline;
  tracking: TrackingInfo[];
  documents: ShipmentDocument[];
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  specialInstructions?: string;
  totalWeight: number;
  totalVolume: number;
  totalValue?: number;
  disasterId?: string;
  requestId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Shipment location
interface ShipmentLocation {
  type: 'warehouse' | 'relief_camp' | 'distribution_point' | 'vendor' | 'other';
  id?: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  contactPerson: ContactPerson;
}

// Shipment item
interface ShipmentItem {
  inventoryId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  batchNumber: string;
  weight?: number;
  volume?: number;
  status: 'pending' | 'packed' | 'loaded' | 'delivered' | 'returned';
}

// Vehicle info
interface VehicleInfo {
  type: string;
  registrationNumber: string;
  capacity: number;
  driver?: string;
  gpsEnabled: boolean;
}

// Driver info
interface DriverInfo {
  name: string;
  phone: string;
  licenseNumber: string;
  vehicleNumber: string;
}

// Shipment timeline
interface ShipmentTimeline {
  createdAt: Date;
  approvedAt?: Date;
  packingStarted?: Date;
  packingCompleted?: Date;
  dispatchedAt?: Date;
  deliveredAt?: Date;
  receivedConfirmedAt?: Date;
}

// Tracking info
interface TrackingInfo {
  timestamp: Date;
  status: string;
  location?: { lat: number; lng: number };
  locationName?: string;
  remarks?: string;
  updatedBy: string;
}

// Shipment document
interface ShipmentDocument {
  type: 'delivery_challan' | 'invoice' | 'packing_list' | 'gate_pass' | 'receipt' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
}

// Supply request
interface SupplyRequest {
  id: string;
  requestNumber: string;
  type: 'emergency' | 'routine' | 'replenishment';
  status: 'draft' | 'submitted' | 'approved' | 'processing' | 'fulfilled' | 'rejected' | 'cancelled';
  priority: PriorityLevel;
  requestedBy: RequestorInfo;
  destination: ShipmentLocation;
  items: RequestItem[];
  disasterId?: string;
  disasterName?: string;
  justification: string;
  requiredBy: Date;
  approvals: Approval[];
  fulfilledItems: { itemId: string; quantity: number; shipmentId: string }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Requestor info
interface RequestorInfo {
  id: string;
  name: string;
  organization: string;
  designation: string;
  phone: string;
  email: string;
}

// Request item
interface RequestItem {
  itemId: string;
  itemName: string;
  requestedQuantity: number;
  approvedQuantity?: number;
  fulfilledQuantity: number;
  unit: string;
  priority: PriorityLevel;
  remarks?: string;
}

// Approval
interface Approval {
  level: number;
  approverName: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  timestamp?: Date;
}

// Stock alert
interface StockAlert {
  id: string;
  type: 'low_stock' | 'expiring_soon' | 'expired' | 'overstocked' | 'quality_issue';
  severity: 'critical' | 'warning' | 'info';
  itemId: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  message: string;
  currentLevel?: number;
  threshold?: number;
  expiryDate?: Date;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
}

// Supplier
interface Supplier {
  id: string;
  name: string;
  code: string;
  type: 'manufacturer' | 'distributor' | 'retailer' | 'ngo' | 'government';
  categories: ItemCategory[];
  contactInfo: SupplierContact;
  address: WarehouseAddress;
  bankDetails?: BankDetails;
  rating: number;
  isApproved: boolean;
  panNumber?: string;
  gstNumber?: string;
  registrationNumber?: string;
  certifications?: string[];
  leadTime: number; // in days
  paymentTerms?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Supplier contact
interface SupplierContact {
  primaryContact: ContactPerson;
  alternateContact?: ContactPerson;
  website?: string;
  email: string;
  phone: string;
}

// Bank details
interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'current' | 'savings';
}

// Purchase order
interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'submitted' | 'confirmed' | 'partially_received' | 'received' | 'cancelled';
  items: POItem[];
  totalAmount: number;
  currency: string;
  deliveryAddress: WarehouseAddress;
  expectedDelivery: Date;
  actualDelivery?: Date;
  paymentTerms: string;
  approvals: Approval[];
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// PO item
interface POItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  specifications?: string;
}

// Inventory summary
interface InventorySummary {
  totalItems: number;
  totalValue: number;
  byCategory: { category: ItemCategory; count: number; value: number }[];
  byWarehouse: { warehouseId: string; warehouseName: string; itemCount: number; utilization: number }[];
  lowStockItems: { itemId: string; itemName: string; currentStock: number; minStock: number }[];
  expiringItems: { itemId: string; itemName: string; expiryDate: Date; quantity: number }[];
  recentMovements: InventoryMovement[];
}

// Inventory movement
interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'inbound' | 'outbound' | 'adjustment' | 'transfer';
  quantity: number;
  warehouseId: string;
  warehouseName: string;
  referenceType: 'shipment' | 'purchase_order' | 'adjustment' | 'disposal';
  referenceId: string;
  performedBy: string;
  timestamp: Date;
  notes?: string;
}

// Search filters
interface InventorySearchFilters {
  query?: string;
  categories?: ItemCategory[];
  warehouseIds?: string[];
  status?: ItemStatus[];
  expiringWithinDays?: number;
  lowStockOnly?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
}

// Sample data
const ITEM_CATEGORIES: { category: ItemCategory; name: string; icon: string }[] = [
  { category: 'food', name: 'Food Items', icon: '🍚' },
  { category: 'water', name: 'Drinking Water', icon: '💧' },
  { category: 'medicine', name: 'Medicines', icon: '💊' },
  { category: 'clothing', name: 'Clothing', icon: '👕' },
  { category: 'shelter', name: 'Shelter Materials', icon: '🏕️' },
  { category: 'hygiene', name: 'Hygiene Products', icon: '🧴' },
  { category: 'baby_care', name: 'Baby Care', icon: '👶' },
  { category: 'medical_equipment', name: 'Medical Equipment', icon: '🩺' },
  { category: 'communication', name: 'Communication Devices', icon: '📻' },
  { category: 'tools', name: 'Tools', icon: '🔧' },
  { category: 'bedding', name: 'Bedding', icon: '🛏️' },
  { category: 'cooking', name: 'Cooking Supplies', icon: '🍳' },
  { category: 'lighting', name: 'Lighting', icon: '💡' },
  { category: 'other', name: 'Other', icon: '📦' },
];

const INDIAN_STATES = ['Kerala', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Gujarat', 'Delhi', 'Uttar Pradesh', 'West Bengal', 'Odisha', 'Andhra Pradesh'];

class SupplyChainService {
  private static instance: SupplyChainService;
  private items: Map<string, SupplyItem> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private warehouses: Map<string, Warehouse> = new Map();
  private shipments: Map<string, Shipment> = new Map();
  private requests: Map<string, SupplyRequest> = new Map();
  private suppliers: Map<string, Supplier> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();
  private alerts: Map<string, StockAlert> = new Map();
  private movements: InventoryMovement[] = [];
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SupplyChainService {
    if (!SupplyChainService.instance) {
      SupplyChainService.instance = new SupplyChainService();
    }
    return SupplyChainService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Create sample supply items
    const sampleItems: Omit<SupplyItem, 'createdAt' | 'updatedAt'>[] = [
      { id: 'item-001', sku: 'RICE-25KG', name: 'Rice (25kg bag)', description: 'Premium quality rice', category: 'food', unit: 'bag', unitWeight: 25, minStockLevel: 100, maxStockLevel: 1000, reorderPoint: 200, shelfLife: 365, isPerishable: false, isHazardous: false },
      { id: 'item-002', sku: 'WATER-1L', name: 'Drinking Water (1L bottle)', description: 'Packaged drinking water', category: 'water', unit: 'bottle', unitWeight: 1, minStockLevel: 500, maxStockLevel: 10000, reorderPoint: 1000, shelfLife: 180, isPerishable: false, isHazardous: false },
      { id: 'item-003', sku: 'BLANKET-STD', name: 'Woolen Blanket', description: 'Standard size woolen blanket', category: 'bedding', unit: 'piece', unitWeight: 2, minStockLevel: 200, maxStockLevel: 2000, reorderPoint: 400, isPerishable: false, isHazardous: false },
      { id: 'item-004', sku: 'MED-FIRST-AID', name: 'First Aid Kit', description: 'Standard first aid kit', category: 'medicine', unit: 'kit', unitWeight: 1.5, minStockLevel: 100, maxStockLevel: 500, reorderPoint: 150, shelfLife: 730, isPerishable: false, isHazardous: false },
      { id: 'item-005', sku: 'TARP-10X12', name: 'Tarpaulin Sheet (10x12 ft)', description: 'Waterproof tarpaulin sheet', category: 'shelter', unit: 'piece', unitWeight: 3, minStockLevel: 200, maxStockLevel: 1500, reorderPoint: 300, isPerishable: false, isHazardous: false },
    ];

    sampleItems.forEach((item) => {
      this.items.set(item.id, { ...item, createdAt: new Date(), updatedAt: new Date() });
    });

    // Create sample warehouses
    for (let i = 1; i <= 5; i++) {
      const warehouse: Warehouse = {
        id: `wh-${i.toString().padStart(3, '0')}`,
        name: `${INDIAN_STATES[i - 1]} Central Warehouse`,
        code: `WH-${INDIAN_STATES[i - 1].substring(0, 3).toUpperCase()}`,
        type: i === 1 ? 'central' : 'regional',
        status: 'operational',
        address: {
          street: `Industrial Area, Sector ${i}`,
          city: 'City',
          district: 'District',
          state: INDIAN_STATES[i - 1],
          pincode: `${500000 + i * 100}`,
          coordinates: { lat: 10 + i, lng: 75 + i },
        },
        capacity: {
          totalArea: 10000 + i * 2000,
          storageArea: 8000 + i * 1500,
          coldStorageArea: i % 2 === 0 ? 500 : undefined,
          loadingDocks: 4 + i,
          maxPallets: 500 + i * 100,
          currentPallets: Math.floor((500 + i * 100) * 0.6),
        },
        currentUtilization: 60 + Math.random() * 20,
        operatingHours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '22:00' },
          saturday: { open: '08:00', close: '18:00' },
          sunday: null,
          is24x7Emergency: true,
        },
        contactPerson: {
          name: `Manager ${i}`,
          designation: 'Warehouse Manager',
          phone: `+91${9800000000 + i}`,
          email: `manager${i}@warehouse.com`,
        },
        facilities: ['Loading Bay', 'Fork Lifts', 'Security', 'CCTV'],
        equipment: [
          { type: 'Forklift', quantity: 3, condition: 'operational' },
          { type: 'Pallet Jack', quantity: 10, condition: 'operational' },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.warehouses.set(warehouse.id, warehouse);
    }

    // Create sample inventory
    let invCounter = 1;
    this.items.forEach((item) => {
      this.warehouses.forEach((warehouse) => {
        const inventory: InventoryItem = {
          id: `inv-${(invCounter++).toString().padStart(6, '0')}`,
          itemId: item.id,
          warehouseId: warehouse.id,
          batchNumber: `BATCH-${Date.now()}-${invCounter}`,
          quantity: Math.floor(Math.random() * 500) + 100,
          reservedQuantity: 0,
          availableQuantity: 0,
          status: 'available',
          receivedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          expiryDate: item.shelfLife ? new Date(Date.now() + item.shelfLife * 24 * 60 * 60 * 1000) : undefined,
          sourceType: 'donation',
          location: { zone: 'A', aisle: '1', rack: 'R1', shelf: 'S1' },
          condition: 'new',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        inventory.availableQuantity = inventory.quantity - inventory.reservedQuantity;
        this.inventory.set(inventory.id, inventory);
      });
    });

    // Create sample suppliers
    for (let i = 1; i <= 10; i++) {
      const supplier: Supplier = {
        id: `sup-${i.toString().padStart(3, '0')}`,
        name: `Supplier Company ${i}`,
        code: `SUP-${i.toString().padStart(4, '0')}`,
        type: (['manufacturer', 'distributor', 'retailer'] as const)[i % 3],
        categories: [ITEM_CATEGORIES[i % ITEM_CATEGORIES.length].category],
        contactInfo: {
          primaryContact: {
            name: `Contact Person ${i}`,
            designation: 'Sales Manager',
            phone: `+91${9700000000 + i}`,
            email: `sales${i}@supplier.com`,
          },
          email: `info@supplier${i}.com`,
          phone: `+91${9700000000 + i}`,
        },
        address: {
          street: `Business Park ${i}`,
          city: 'City',
          district: 'District',
          state: INDIAN_STATES[i % INDIAN_STATES.length],
          pincode: `${400000 + i * 10}`,
          coordinates: { lat: 15 + i * 0.5, lng: 73 + i * 0.5 },
        },
        rating: 3.5 + Math.random() * 1.5,
        isApproved: true,
        leadTime: 3 + (i % 5),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.suppliers.set(supplier.id, supplier);
    }
  }

  /**
   * Create supply item
   */
  public async createItem(data: Omit<SupplyItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplyItem> {
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    const item: SupplyItem = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.set(id, item);
    this.emit('item_created', item);
    return item;
  }

  /**
   * Get item
   */
  public getItem(itemId: string): SupplyItem | undefined {
    return this.items.get(itemId);
  }

  /**
   * Get all items
   */
  public getAllItems(category?: ItemCategory): SupplyItem[] {
    const items = Array.from(this.items.values());
    if (category) return items.filter((i) => i.category === category);
    return items;
  }

  /**
   * Add inventory
   */
  public async addInventory(data: Omit<InventoryItem, 'id' | 'availableQuantity' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const id = `inv-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    const inventory: InventoryItem = {
      ...data,
      id,
      availableQuantity: data.quantity - data.reservedQuantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inventory.set(id, inventory);

    // Record movement
    this.recordMovement({
      itemId: data.itemId,
      type: 'inbound',
      quantity: data.quantity,
      warehouseId: data.warehouseId,
      referenceType: data.sourceType === 'purchase' ? 'purchase_order' : 'shipment',
      referenceId: data.sourceId || '',
      performedBy: 'System',
    });

    this.emit('inventory_added', inventory);
    this.checkStockAlerts(data.itemId, data.warehouseId);
    return inventory;
  }

  /**
   * Update inventory quantity
   */
  public updateInventoryQuantity(inventoryId: string, quantityChange: number, reason: string): boolean {
    const inventory = this.inventory.get(inventoryId);
    if (!inventory) return false;

    inventory.quantity += quantityChange;
    inventory.availableQuantity = inventory.quantity - inventory.reservedQuantity;
    inventory.updatedAt = new Date();

    this.recordMovement({
      itemId: inventory.itemId,
      type: quantityChange > 0 ? 'inbound' : 'outbound',
      quantity: Math.abs(quantityChange),
      warehouseId: inventory.warehouseId,
      referenceType: 'adjustment',
      referenceId: inventoryId,
      performedBy: 'System',
      notes: reason,
    });

    this.emit('inventory_updated', inventory);
    this.checkStockAlerts(inventory.itemId, inventory.warehouseId);
    return true;
  }

  /**
   * Reserve inventory
   */
  public reserveInventory(inventoryId: string, quantity: number): boolean {
    const inventory = this.inventory.get(inventoryId);
    if (!inventory || inventory.availableQuantity < quantity) return false;

    inventory.reservedQuantity += quantity;
    inventory.availableQuantity = inventory.quantity - inventory.reservedQuantity;
    inventory.updatedAt = new Date();

    this.emit('inventory_reserved', { inventoryId, quantity });
    return true;
  }

  /**
   * Release reservation
   */
  public releaseReservation(inventoryId: string, quantity: number): boolean {
    const inventory = this.inventory.get(inventoryId);
    if (!inventory || inventory.reservedQuantity < quantity) return false;

    inventory.reservedQuantity -= quantity;
    inventory.availableQuantity = inventory.quantity - inventory.reservedQuantity;
    inventory.updatedAt = new Date();

    this.emit('reservation_released', { inventoryId, quantity });
    return true;
  }

  /**
   * Search inventory
   */
  public searchInventory(filters: InventorySearchFilters, page: number = 1, pageSize: number = 20): { items: (InventoryItem & { itemDetails?: SupplyItem })[], total: number } {
    let results = Array.from(this.inventory.values());

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((inv) => {
        const item = this.items.get(inv.itemId);
        return item?.name.toLowerCase().includes(query) || item?.sku.toLowerCase().includes(query);
      });
    }

    if (filters.categories?.length) {
      results = results.filter((inv) => {
        const item = this.items.get(inv.itemId);
        return item && filters.categories!.includes(item.category);
      });
    }

    if (filters.warehouseIds?.length) {
      results = results.filter((inv) => filters.warehouseIds!.includes(inv.warehouseId));
    }

    if (filters.status?.length) {
      results = results.filter((inv) => filters.status!.includes(inv.status));
    }

    if (filters.expiringWithinDays) {
      const cutoff = new Date(Date.now() + filters.expiringWithinDays * 24 * 60 * 60 * 1000);
      results = results.filter((inv) => inv.expiryDate && inv.expiryDate <= cutoff);
    }

    if (filters.lowStockOnly) {
      results = results.filter((inv) => {
        const item = this.items.get(inv.itemId);
        return item && inv.availableQuantity <= item.minStockLevel;
      });
    }

    const total = results.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize).map((inv) => ({
      ...inv,
      itemDetails: this.items.get(inv.itemId),
    }));

    return { items: paginatedResults, total };
  }

  /**
   * Get warehouse
   */
  public getWarehouse(warehouseId: string): Warehouse | undefined {
    return this.warehouses.get(warehouseId);
  }

  /**
   * Get all warehouses
   */
  public getAllWarehouses(state?: string): Warehouse[] {
    const warehouses = Array.from(this.warehouses.values());
    if (state) return warehouses.filter((w) => w.address.state === state);
    return warehouses;
  }

  /**
   * Create shipment
   */
  public async createShipment(data: Omit<Shipment, 'id' | 'shipmentNumber' | 'status' | 'timeline' | 'tracking' | 'createdAt' | 'updatedAt'>): Promise<Shipment> {
    const id = `shp-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    const shipmentNumber = `SHP-${new Date().getFullYear()}-${id.substr(-6).toUpperCase()}`;

    const shipment: Shipment = {
      ...data,
      id,
      shipmentNumber,
      status: 'pending',
      timeline: { createdAt: new Date() },
      tracking: [{ timestamp: new Date(), status: 'Shipment created', updatedBy: data.createdBy }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.shipments.set(id, shipment);
    this.emit('shipment_created', shipment);
    return shipment;
  }

  /**
   * Update shipment status
   */
  public updateShipmentStatus(shipmentId: string, status: ShipmentStatus, location?: { lat: number; lng: number }, remarks?: string, updatedBy: string = 'System'): boolean {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) return false;

    shipment.status = status;
    shipment.updatedAt = new Date();

    // Update timeline
    if (status === 'dispatched') shipment.timeline.dispatchedAt = new Date();
    if (status === 'delivered') {
      shipment.timeline.deliveredAt = new Date();
      shipment.actualDelivery = new Date();
    }

    // Add tracking
    shipment.tracking.push({
      timestamp: new Date(),
      status: `Status updated to ${status}`,
      location,
      remarks,
      updatedBy,
    });

    this.emit('shipment_updated', shipment);
    return true;
  }

  /**
   * Get shipment
   */
  public getShipment(shipmentId: string): Shipment | undefined {
    return this.shipments.get(shipmentId);
  }

  /**
   * Get shipments
   */
  public getShipments(filters?: { status?: ShipmentStatus[]; type?: Shipment['type']; warehouseId?: string }): Shipment[] {
    let results = Array.from(this.shipments.values());

    if (filters?.status?.length) {
      results = results.filter((s) => filters.status!.includes(s.status));
    }

    if (filters?.type) {
      results = results.filter((s) => s.type === filters.type);
    }

    if (filters?.warehouseId) {
      results = results.filter((s) =>
        s.origin.id === filters.warehouseId || s.destination.id === filters.warehouseId
      );
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Create supply request
   */
  public async createRequest(data: Omit<SupplyRequest, 'id' | 'requestNumber' | 'status' | 'approvals' | 'fulfilledItems' | 'createdAt' | 'updatedAt'>): Promise<SupplyRequest> {
    const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    const requestNumber = `REQ-${new Date().getFullYear()}-${id.substr(-6).toUpperCase()}`;

    const request: SupplyRequest = {
      ...data,
      id,
      requestNumber,
      status: 'draft',
      approvals: [{ level: 1, approverName: 'Pending', approverId: '', status: 'pending' }],
      fulfilledItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.requests.set(id, request);
    this.emit('request_created', request);
    return request;
  }

  /**
   * Approve request
   */
  public approveRequest(requestId: string, approverId: string, approverName: string, comments?: string): boolean {
    const request = this.requests.get(requestId);
    if (!request || request.status !== 'submitted') return false;

    const pendingApproval = request.approvals.find((a) => a.status === 'pending');
    if (pendingApproval) {
      pendingApproval.status = 'approved';
      pendingApproval.approverId = approverId;
      pendingApproval.approverName = approverName;
      pendingApproval.comments = comments;
      pendingApproval.timestamp = new Date();
    }

    request.status = 'approved';
    request.updatedAt = new Date();

    // Auto-approve requested quantities
    request.items.forEach((item) => {
      item.approvedQuantity = item.requestedQuantity;
    });

    this.emit('request_approved', request);
    return true;
  }

  /**
   * Get requests
   */
  public getRequests(filters?: { status?: SupplyRequest['status'][]; priority?: PriorityLevel; disasterId?: string }): SupplyRequest[] {
    let results = Array.from(this.requests.values());

    if (filters?.status?.length) {
      results = results.filter((r) => filters.status!.includes(r.status));
    }

    if (filters?.priority) {
      results = results.filter((r) => r.priority === filters.priority);
    }

    if (filters?.disasterId) {
      results = results.filter((r) => r.disasterId === filters.disasterId);
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Record inventory movement
   */
  private recordMovement(data: Omit<InventoryMovement, 'id' | 'itemName' | 'warehouseName' | 'timestamp'>): void {
    const item = this.items.get(data.itemId);
    const warehouse = this.warehouses.get(data.warehouseId);

    const movement: InventoryMovement = {
      ...data,
      id: `mov-${Date.now()}`,
      itemName: item?.name || 'Unknown',
      warehouseName: warehouse?.name || 'Unknown',
      timestamp: new Date(),
    };

    this.movements.push(movement);
    if (this.movements.length > 1000) {
      this.movements = this.movements.slice(-500);
    }
  }

  /**
   * Check stock alerts
   */
  private checkStockAlerts(itemId: string, warehouseId: string): void {
    const item = this.items.get(itemId);
    const warehouse = this.warehouses.get(warehouseId);
    if (!item || !warehouse) return;

    const inventory = Array.from(this.inventory.values())
      .filter((inv) => inv.itemId === itemId && inv.warehouseId === warehouseId)
      .reduce((sum, inv) => sum + inv.availableQuantity, 0);

    // Low stock alert
    if (inventory <= item.minStockLevel) {
      this.createAlert({
        type: 'low_stock',
        severity: inventory <= item.minStockLevel * 0.5 ? 'critical' : 'warning',
        itemId,
        itemName: item.name,
        warehouseId,
        warehouseName: warehouse.name,
        message: `Stock level (${inventory}) is below minimum (${item.minStockLevel})`,
        currentLevel: inventory,
        threshold: item.minStockLevel,
      });
    }
  }

  /**
   * Create alert
   */
  private createAlert(data: Omit<StockAlert, 'id' | 'isAcknowledged' | 'createdAt'>): void {
    const id = `alert-${Date.now()}`;
    const alert: StockAlert = {
      ...data,
      id,
      isAcknowledged: false,
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    this.emit('alert_created', alert);
  }

  /**
   * Get alerts
   */
  public getAlerts(unacknowledgedOnly: boolean = false): StockAlert[] {
    const alerts = Array.from(this.alerts.values());
    if (unacknowledgedOnly) return alerts.filter((a) => !a.isAcknowledged);
    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: string, userId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.isAcknowledged = true;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();
    return true;
  }

  /**
   * Get inventory summary
   */
  public getInventorySummary(): InventorySummary {
    const inventoryItems = Array.from(this.inventory.values());
    const items = Array.from(this.items.values());

    const categoryTotals = new Map<ItemCategory, { count: number; value: number }>();
    const warehouseTotals = new Map<string, { itemCount: number }>();

    inventoryItems.forEach((inv) => {
      const item = this.items.get(inv.itemId);
      if (item) {
        const cat = categoryTotals.get(item.category) || { count: 0, value: 0 };
        cat.count += inv.quantity;
        categoryTotals.set(item.category, cat);
      }

      const wh = warehouseTotals.get(inv.warehouseId) || { itemCount: 0 };
      wh.itemCount++;
      warehouseTotals.set(inv.warehouseId, wh);
    });

    const lowStockItems: { itemId: string; itemName: string; currentStock: number; minStock: number }[] = [];
    items.forEach((item) => {
      const totalStock = inventoryItems
        .filter((inv) => inv.itemId === item.id)
        .reduce((sum, inv) => sum + inv.availableQuantity, 0);
      if (totalStock <= item.minStockLevel) {
        lowStockItems.push({ itemId: item.id, itemName: item.name, currentStock: totalStock, minStock: item.minStockLevel });
      }
    });

    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringItems = inventoryItems
      .filter((inv) => inv.expiryDate && inv.expiryDate <= thirtyDaysLater && inv.expiryDate > now)
      .map((inv) => {
        const item = this.items.get(inv.itemId);
        return { itemId: inv.itemId, itemName: item?.name || 'Unknown', expiryDate: inv.expiryDate!, quantity: inv.quantity };
      });

    return {
      totalItems: inventoryItems.length,
      totalValue: 0,
      byCategory: Array.from(categoryTotals.entries()).map(([category, data]) => ({ category, ...data })),
      byWarehouse: Array.from(warehouseTotals.entries()).map(([warehouseId, data]) => {
        const warehouse = this.warehouses.get(warehouseId);
        return { warehouseId, warehouseName: warehouse?.name || 'Unknown', ...data, utilization: warehouse?.currentUtilization || 0 };
      }),
      lowStockItems,
      expiringItems,
      recentMovements: this.movements.slice(-20),
    };
  }

  /**
   * Subscribe to events
   */
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    this.listeners.forEach((callback) => callback(event, data));
  }
}

export const supplyChainService = SupplyChainService.getInstance();
export type {
  ItemCategory,
  ItemStatus,
  WarehouseStatus,
  ShipmentStatus,
  PriorityLevel,
  TransportMode,
  SupplyItem,
  StorageRequirements,
  InventoryItem,
  StorageLocation,
  Warehouse,
  WarehouseAddress,
  WarehouseCapacity,
  OperatingHours,
  ContactPerson,
  WarehouseEquipment,
  Shipment,
  ShipmentLocation,
  ShipmentItem,
  VehicleInfo,
  DriverInfo,
  ShipmentTimeline,
  TrackingInfo,
  ShipmentDocument,
  SupplyRequest,
  RequestorInfo,
  RequestItem,
  Approval,
  StockAlert,
  Supplier,
  SupplierContact,
  BankDetails,
  PurchaseOrder,
  POItem,
  InventorySummary,
  InventoryMovement,
  InventorySearchFilters,
};

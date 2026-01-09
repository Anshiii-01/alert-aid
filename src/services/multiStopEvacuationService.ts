/**
 * Multi-stop Evacuation Planning Service
 * Plan evacuation routes with multiple stops (family pickup, supplies, shelters)
 */

// Stop types for evacuation
type StopType = 
  | 'origin'
  | 'family_pickup'
  | 'medical_pickup'
  | 'pet_pickup'
  | 'supply_point'
  | 'fuel_station'
  | 'atm'
  | 'pharmacy'
  | 'checkpoint'
  | 'shelter'
  | 'hospital'
  | 'destination';

// Priority levels
type Priority = 'critical' | 'high' | 'medium' | 'low' | 'optional';

// Stop in evacuation plan
interface EvacuationStop {
  id: string;
  type: StopType;
  name: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  priority: Priority;
  estimatedTime: number; // minutes to spend at stop
  notes?: string;
  contacts?: Contact[];
  requirements?: string[];
  completed: boolean;
  completedAt?: Date;
  skipped: boolean;
  skipReason?: string;
}

// Contact information
interface Contact {
  name: string;
  phone: string;
  relationship?: string;
  notified: boolean;
}

// Evacuation plan
interface EvacuationPlan {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  stops: EvacuationStop[];
  participants: Participant[];
  routes: RouteSegment[];
  totalDistance: number; // km
  totalTime: number; // minutes
  currentStopIndex: number;
  emergencyContacts: Contact[];
  checklist: ChecklistItem[];
  notes: string;
}

// Participant in evacuation
interface Participant {
  id: string;
  name: string;
  phone?: string;
  pickupStopId?: string;
  specialNeeds?: string[];
  status: 'pending' | 'picked_up' | 'at_shelter' | 'missing';
}

// Route segment between stops
interface RouteSegment {
  fromStopId: string;
  toStopId: string;
  distance: number; // km
  duration: number; // minutes
  waypoints: { lat: number; lng: number }[];
  instructions: string[];
  trafficCondition?: 'clear' | 'moderate' | 'heavy' | 'blocked';
}

// Checklist item
interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  item: string;
  checked: boolean;
  essential: boolean;
}

// Checklist categories
type ChecklistCategory = 
  | 'documents'
  | 'medical'
  | 'food_water'
  | 'clothing'
  | 'electronics'
  | 'cash'
  | 'tools'
  | 'personal'
  | 'pets'
  | 'other';

// Optimization result
interface OptimizationResult {
  originalOrder: string[];
  optimizedOrder: string[];
  timeSaved: number; // minutes
  distanceSaved: number; // km
  explanation: string;
}

// Stop icons
const STOP_ICONS: Record<StopType, string> = {
  origin: '🏠',
  family_pickup: '👨‍👩‍👧‍👦',
  medical_pickup: '🏥',
  pet_pickup: '🐕',
  supply_point: '📦',
  fuel_station: '⛽',
  atm: '🏧',
  pharmacy: '💊',
  checkpoint: '🚧',
  shelter: '🏕️',
  hospital: '🏥',
  destination: '🎯',
};

// Default checklist items
const DEFAULT_CHECKLIST: Omit<ChecklistItem, 'id' | 'checked'>[] = [
  // Documents
  { category: 'documents', item: 'ID Cards / Aadhaar', essential: true },
  { category: 'documents', item: 'Passport', essential: false },
  { category: 'documents', item: 'Insurance documents', essential: true },
  { category: 'documents', item: 'Property documents', essential: false },
  { category: 'documents', item: 'Bank passbooks', essential: false },
  { category: 'documents', item: 'Medical records', essential: true },
  
  // Medical
  { category: 'medical', item: 'Prescription medicines', essential: true },
  { category: 'medical', item: 'First aid kit', essential: true },
  { category: 'medical', item: 'Face masks', essential: true },
  { category: 'medical', item: 'Sanitizer', essential: true },
  { category: 'medical', item: 'Glasses / contacts', essential: false },
  
  // Food & Water
  { category: 'food_water', item: 'Drinking water (3-day supply)', essential: true },
  { category: 'food_water', item: 'Non-perishable food', essential: true },
  { category: 'food_water', item: 'Baby food / formula', essential: false },
  { category: 'food_water', item: 'Can opener', essential: false },
  
  // Electronics
  { category: 'electronics', item: 'Mobile phones', essential: true },
  { category: 'electronics', item: 'Phone chargers', essential: true },
  { category: 'electronics', item: 'Power bank', essential: true },
  { category: 'electronics', item: 'Flashlight / torch', essential: true },
  { category: 'electronics', item: 'Extra batteries', essential: false },
  { category: 'electronics', item: 'Radio', essential: false },
  
  // Cash
  { category: 'cash', item: 'Cash (emergency fund)', essential: true },
  { category: 'cash', item: 'ATM / debit cards', essential: true },
  
  // Clothing
  { category: 'clothing', item: 'Change of clothes', essential: true },
  { category: 'clothing', item: 'Rain gear / umbrella', essential: true },
  { category: 'clothing', item: 'Sturdy shoes', essential: true },
  { category: 'clothing', item: 'Blankets', essential: false },
  
  // Tools
  { category: 'tools', item: 'Rope', essential: false },
  { category: 'tools', item: 'Multi-tool / knife', essential: false },
  { category: 'tools', item: 'Whistle', essential: true },
  
  // Personal
  { category: 'personal', item: 'Toiletries', essential: false },
  { category: 'personal', item: 'Sanitary items', essential: false },
  { category: 'personal', item: 'Entertainment for children', essential: false },
  
  // Pets
  { category: 'pets', item: 'Pet food', essential: false },
  { category: 'pets', item: 'Pet carrier', essential: false },
  { category: 'pets', item: 'Pet medicines', essential: false },
  { category: 'pets', item: 'Pet documents', essential: false },
];

// Sample shelter locations
const SAMPLE_SHELTERS = [
  { name: 'Govt School Relief Camp', lat: 10.5125, lng: 76.2228, capacity: 500 },
  { name: 'Community Hall Shelter', lat: 10.5256, lng: 76.2156, capacity: 200 },
  { name: 'Stadium Relief Center', lat: 10.4987, lng: 76.2312, capacity: 1000 },
];

class MultiStopEvacuationService {
  private static instance: MultiStopEvacuationService;
  private plans: Map<string, EvacuationPlan> = new Map();
  private activePlan: EvacuationPlan | null = null;
  private listeners: ((plan: EvacuationPlan | null) => void)[] = [];

  private constructor() {}

  public static getInstance(): MultiStopEvacuationService {
    if (!MultiStopEvacuationService.instance) {
      MultiStopEvacuationService.instance = new MultiStopEvacuationService();
    }
    return MultiStopEvacuationService.instance;
  }

  /**
   * Create new evacuation plan
   */
  public createPlan(
    name: string,
    origin: { lat: number; lng: number; address?: string }
  ): EvacuationPlan {
    const id = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const plan: EvacuationPlan = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      stops: [
        {
          id: `stop-${Date.now()}`,
          type: 'origin',
          name: 'Starting Point',
          location: origin,
          priority: 'critical',
          estimatedTime: 0,
          completed: false,
          skipped: false,
        },
      ],
      participants: [],
      routes: [],
      totalDistance: 0,
      totalTime: 0,
      currentStopIndex: 0,
      emergencyContacts: [],
      checklist: DEFAULT_CHECKLIST.map((item, index) => ({
        ...item,
        id: `check-${index}`,
        checked: false,
      })),
      notes: '',
    };

    this.plans.set(id, plan);
    return plan;
  }

  /**
   * Add stop to plan
   */
  public addStop(
    planId: string,
    stop: Omit<EvacuationStop, 'id' | 'completed' | 'skipped'>
  ): EvacuationStop | null {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const newStop: EvacuationStop = {
      ...stop,
      id: `stop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      completed: false,
      skipped: false,
    };

    // Insert before destination if exists, otherwise at end
    const destIndex = plan.stops.findIndex((s) => s.type === 'destination');
    if (destIndex !== -1) {
      plan.stops.splice(destIndex, 0, newStop);
    } else {
      plan.stops.push(newStop);
    }

    plan.updatedAt = new Date();
    this.recalculateRoutes(plan);
    this.notifyListeners();

    return newStop;
  }

  /**
   * Remove stop from plan
   */
  public removeStop(planId: string, stopId: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    const index = plan.stops.findIndex((s) => s.id === stopId);
    if (index === -1 || plan.stops[index].type === 'origin') return false;

    plan.stops.splice(index, 1);
    plan.updatedAt = new Date();
    this.recalculateRoutes(plan);
    this.notifyListeners();

    return true;
  }

  /**
   * Reorder stops
   */
  public reorderStops(planId: string, stopIds: string[]): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    const origin = plan.stops.find((s) => s.type === 'origin');
    if (!origin) return false;

    const newStops: EvacuationStop[] = [origin];

    stopIds.forEach((id) => {
      const stop = plan.stops.find((s) => s.id === id && s.type !== 'origin');
      if (stop) newStops.push(stop);
    });

    plan.stops = newStops;
    plan.updatedAt = new Date();
    this.recalculateRoutes(plan);
    this.notifyListeners();

    return true;
  }

  /**
   * Optimize stop order (TSP-like optimization)
   */
  public optimizeRoute(planId: string): OptimizationResult | null {
    const plan = this.plans.get(planId);
    if (!plan || plan.stops.length < 3) return null;

    const originalOrder = plan.stops.map((s) => s.id);
    
    // Separate fixed and movable stops
    const origin = plan.stops[0];
    const destination = plan.stops.find((s) => s.type === 'destination');
    const criticalStops = plan.stops.filter(
      (s) => s.priority === 'critical' && s.type !== 'origin' && s.type !== 'destination'
    );
    const otherStops = plan.stops.filter(
      (s) => s.priority !== 'critical' && s.type !== 'origin' && s.type !== 'destination'
    );

    // Simple nearest neighbor algorithm for non-critical stops
    const optimizedOther: EvacuationStop[] = [];
    let currentLocation = origin.location;
    const remaining = [...otherStops];

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDist = Infinity;

      remaining.forEach((stop, index) => {
        const dist = this.calculateDistance(
          currentLocation.lat, currentLocation.lng,
          stop.location.lat, stop.location.lng
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIndex = index;
        }
      });

      const nearest = remaining.splice(nearestIndex, 1)[0];
      optimizedOther.push(nearest);
      currentLocation = nearest.location;
    }

    // Rebuild plan with optimized order
    const newStops = [origin, ...criticalStops, ...optimizedOther];
    if (destination) newStops.push(destination);

    const oldTime = plan.totalTime;
    const oldDistance = plan.totalDistance;

    plan.stops = newStops;
    this.recalculateRoutes(plan);

    const optimizedOrder = plan.stops.map((s) => s.id);

    return {
      originalOrder,
      optimizedOrder,
      timeSaved: Math.max(0, oldTime - plan.totalTime),
      distanceSaved: Math.max(0, oldDistance - plan.totalDistance),
      explanation: `Optimized route by reordering ${otherStops.length} stops. Critical stops (${criticalStops.length}) kept in priority order.`,
    };
  }

  /**
   * Recalculate routes between stops
   */
  private recalculateRoutes(plan: EvacuationPlan): void {
    plan.routes = [];
    plan.totalDistance = 0;
    plan.totalTime = 0;

    for (let i = 0; i < plan.stops.length - 1; i++) {
      const from = plan.stops[i];
      const to = plan.stops[i + 1];

      const distance = this.calculateDistance(
        from.location.lat, from.location.lng,
        to.location.lat, to.location.lng
      );

      // Estimate time: ~30 km/h average in emergency conditions
      const duration = (distance / 30) * 60; // minutes

      const segment: RouteSegment = {
        fromStopId: from.id,
        toStopId: to.id,
        distance: Math.round(distance * 10) / 10,
        duration: Math.round(duration),
        waypoints: [from.location, to.location],
        instructions: [
          `Head towards ${to.name}`,
          `Distance: ${distance.toFixed(1)} km`,
          `Estimated time: ${Math.round(duration)} minutes`,
        ],
        trafficCondition: 'moderate',
      };

      plan.routes.push(segment);
      plan.totalDistance += distance;
      plan.totalTime += duration + (to.estimatedTime || 0);
    }

    plan.totalDistance = Math.round(plan.totalDistance * 10) / 10;
    plan.totalTime = Math.round(plan.totalTime);
  }

  /**
   * Add participant
   */
  public addParticipant(
    planId: string,
    participant: Omit<Participant, 'id' | 'status'>
  ): Participant | null {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const newParticipant: Participant = {
      ...participant,
      id: `part-${Date.now()}`,
      status: 'pending',
    };

    plan.participants.push(newParticipant);
    plan.updatedAt = new Date();
    this.notifyListeners();

    return newParticipant;
  }

  /**
   * Update participant status
   */
  public updateParticipantStatus(
    planId: string,
    participantId: string,
    status: Participant['status']
  ): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    const participant = plan.participants.find((p) => p.id === participantId);
    if (!participant) return false;

    participant.status = status;
    plan.updatedAt = new Date();
    this.notifyListeners();

    return true;
  }

  /**
   * Set destination shelter
   */
  public setDestination(
    planId: string,
    shelter: { name: string; lat: number; lng: number; address?: string }
  ): EvacuationStop | null {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    // Remove existing destination
    plan.stops = plan.stops.filter((s) => s.type !== 'destination');

    const destination: EvacuationStop = {
      id: `stop-dest-${Date.now()}`,
      type: 'destination',
      name: shelter.name,
      location: { lat: shelter.lat, lng: shelter.lng, address: shelter.address },
      priority: 'critical',
      estimatedTime: 30, // Registration time
      completed: false,
      skipped: false,
    };

    plan.stops.push(destination);
    plan.updatedAt = new Date();
    this.recalculateRoutes(plan);
    this.notifyListeners();

    return destination;
  }

  /**
   * Start evacuation
   */
  public startEvacuation(planId: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan || plan.stops.length < 2) return false;

    plan.status = 'active';
    plan.currentStopIndex = 0;
    plan.updatedAt = new Date();
    this.activePlan = plan;
    this.notifyListeners();

    return true;
  }

  /**
   * Mark stop as completed
   */
  public completeStop(planId: string, stopId: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    const stop = plan.stops.find((s) => s.id === stopId);
    if (!stop) return false;

    stop.completed = true;
    stop.completedAt = new Date();

    // Update current stop index
    const completedIndex = plan.stops.findIndex((s) => s.id === stopId);
    if (completedIndex >= plan.currentStopIndex) {
      plan.currentStopIndex = completedIndex + 1;
    }

    // Check if all stops completed
    if (plan.currentStopIndex >= plan.stops.length) {
      plan.status = 'completed';
    }

    plan.updatedAt = new Date();
    this.notifyListeners();

    return true;
  }

  /**
   * Skip stop
   */
  public skipStop(planId: string, stopId: string, reason: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    const stop = plan.stops.find((s) => s.id === stopId);
    if (!stop || stop.priority === 'critical') return false;

    stop.skipped = true;
    stop.skipReason = reason;

    const skippedIndex = plan.stops.findIndex((s) => s.id === stopId);
    if (skippedIndex >= plan.currentStopIndex) {
      plan.currentStopIndex = skippedIndex + 1;
    }

    plan.updatedAt = new Date();
    this.recalculateRoutes(plan);
    this.notifyListeners();

    return true;
  }

  /**
   * Pause evacuation
   */
  public pauseEvacuation(planId: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan || plan.status !== 'active') return false;

    plan.status = 'paused';
    plan.updatedAt = new Date();
    this.notifyListeners();

    return true;
  }

  /**
   * Resume evacuation
   */
  public resumeEvacuation(planId: string): boolean {
    const plan = this.plans.get(planId);
    if (!plan || plan.status !== 'paused') return false;

    plan.status = 'active';
    plan.updatedAt = new Date();
    this.notifyListeners();

    return true;
  }

  /**
   * Update checklist
   */
  public updateChecklist(planId: string, itemId: string, checked: boolean): boolean {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    const item = plan.checklist.find((i) => i.id === itemId);
    if (!item) return false;

    item.checked = checked;
    plan.updatedAt = new Date();
    this.notifyListeners();

    return true;
  }

  /**
   * Get checklist progress
   */
  public getChecklistProgress(planId: string): {
    total: number;
    checked: number;
    essential: number;
    essentialChecked: number;
    percentage: number;
  } {
    const plan = this.plans.get(planId);
    if (!plan) {
      return { total: 0, checked: 0, essential: 0, essentialChecked: 0, percentage: 0 };
    }

    const total = plan.checklist.length;
    const checked = plan.checklist.filter((i) => i.checked).length;
    const essential = plan.checklist.filter((i) => i.essential).length;
    const essentialChecked = plan.checklist.filter((i) => i.essential && i.checked).length;

    return {
      total,
      checked,
      essential,
      essentialChecked,
      percentage: total > 0 ? Math.round((checked / total) * 100) : 0,
    };
  }

  /**
   * Get nearby shelters
   */
  public getNearbyShelters(lat: number, lng: number, radiusKm: number = 20): typeof SAMPLE_SHELTERS {
    return SAMPLE_SHELTERS.filter((shelter) => {
      const distance = this.calculateDistance(lat, lng, shelter.lat, shelter.lng);
      return distance <= radiusKm;
    }).sort((a, b) => {
      const distA = this.calculateDistance(lat, lng, a.lat, a.lng);
      const distB = this.calculateDistance(lat, lng, b.lat, b.lng);
      return distA - distB;
    });
  }

  /**
   * Get ETA for specific stop
   */
  public getETAForStop(planId: string, stopId: string): Date | null {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    let totalMinutes = 0;
    let foundCurrentStop = false;

    for (let i = 0; i < plan.stops.length; i++) {
      const stop = plan.stops[i];

      if (i === plan.currentStopIndex) {
        foundCurrentStop = true;
      }

      if (foundCurrentStop && !stop.completed && !stop.skipped) {
        if (stop.id === stopId) {
          return new Date(Date.now() + totalMinutes * 60 * 1000);
        }

        const route = plan.routes.find((r) => r.fromStopId === stop.id);
        if (route) {
          totalMinutes += route.duration + (stop.estimatedTime || 0);
        }
      }
    }

    return null;
  }

  /**
   * Get plan summary
   */
  public getPlanSummary(planId: string): {
    stopsTotal: number;
    stopsCompleted: number;
    stopsSkipped: number;
    participantsTotal: number;
    participantsPickedUp: number;
    distanceRemaining: number;
    timeRemaining: number;
    progress: number;
  } | null {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const activeStops = plan.stops.filter((s) => !s.skipped);
    const completedStops = activeStops.filter((s) => s.completed);
    const skippedStops = plan.stops.filter((s) => s.skipped);

    let distanceRemaining = 0;
    let timeRemaining = 0;

    for (let i = plan.currentStopIndex; i < plan.routes.length; i++) {
      const route = plan.routes[i];
      const toStop = plan.stops.find((s) => s.id === route.toStopId);
      if (toStop && !toStop.skipped) {
        distanceRemaining += route.distance;
        timeRemaining += route.duration + (toStop.estimatedTime || 0);
      }
    }

    return {
      stopsTotal: activeStops.length,
      stopsCompleted: completedStops.length,
      stopsSkipped: skippedStops.length,
      participantsTotal: plan.participants.length,
      participantsPickedUp: plan.participants.filter((p) => p.status === 'picked_up' || p.status === 'at_shelter').length,
      distanceRemaining: Math.round(distanceRemaining * 10) / 10,
      timeRemaining: Math.round(timeRemaining),
      progress: activeStops.length > 0 ? Math.round((completedStops.length / activeStops.length) * 100) : 0,
    };
  }

  /**
   * Get plan
   */
  public getPlan(planId: string): EvacuationPlan | undefined {
    return this.plans.get(planId);
  }

  /**
   * Get all plans
   */
  public getAllPlans(): EvacuationPlan[] {
    return Array.from(this.plans.values());
  }

  /**
   * Get active plan
   */
  public getActivePlan(): EvacuationPlan | null {
    return this.activePlan;
  }

  /**
   * Get stop icon
   */
  public getStopIcon(type: StopType): string {
    return STOP_ICONS[type] || '📍';
  }

  /**
   * Get default checklist
   */
  public getDefaultChecklist(): typeof DEFAULT_CHECKLIST {
    return DEFAULT_CHECKLIST;
  }

  /**
   * Subscribe to updates
   */
  public subscribe(callback: (plan: EvacuationPlan | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback(this.activePlan));
  }

  /**
   * Calculate distance between two points
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Format time
   */
  public formatTime(minutes: number): string {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

export const multiStopEvacuationService = MultiStopEvacuationService.getInstance();
export type {
  EvacuationPlan,
  EvacuationStop,
  StopType,
  Priority,
  Participant,
  RouteSegment,
  ChecklistItem,
  ChecklistCategory,
  Contact,
  OptimizationResult,
};

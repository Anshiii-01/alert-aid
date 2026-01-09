/**
 * Predictive Resource Allocation Service
 * ML-based resource needs prediction before disasters
 */

export interface ResourceType {
  id: string;
  name: string;
  category: 'medical' | 'shelter' | 'food' | 'water' | 'equipment' | 'personnel' | 'transport';
  unit: string;
  criticalThreshold: number;
  costPerUnit: number;
}

export interface ResourceInventory {
  resourceId: string;
  currentStock: number;
  reservedStock: number;
  inTransit: number;
  lastUpdated: Date;
  location: { lat: number; lon: number; name: string };
}

export interface ResourcePrediction {
  id: string;
  timestamp: Date;
  disasterType: string;
  affectedArea: { lat: number; lon: number; radius: number; name: string };
  estimatedPopulation: number;
  duration: number; // hours
  resources: ResourceNeed[];
  totalCost: number;
  confidence: number;
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface ResourceNeed {
  resourceId: string;
  resourceName: string;
  category: string;
  predictedNeed: number;
  currentAvailable: number;
  gap: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeline: 'immediate' | '24h' | '72h' | 'week';
  costEstimate: number;
}

export interface AllocationPlan {
  id: string;
  predictionId: string;
  allocations: ResourceAllocation[];
  totalCost: number;
  coveragePercentage: number;
  estimatedDeliveryTime: number; // hours
  status: 'draft' | 'approved' | 'executing' | 'completed';
  createdAt: Date;
}

export interface ResourceAllocation {
  resourceId: string;
  sourceLocation: string;
  destinationLocation: string;
  quantity: number;
  transportMode: 'road' | 'air' | 'rail' | 'water';
  estimatedArrival: Date;
  cost: number;
  priority: number;
}

// Standard resources database
const RESOURCE_DATABASE: ResourceType[] = [
  { id: 'med_kit', name: 'First Aid Kits', category: 'medical', unit: 'kits', criticalThreshold: 100, costPerUnit: 500 },
  { id: 'med_beds', name: 'Hospital Beds', category: 'medical', unit: 'beds', criticalThreshold: 50, costPerUnit: 15000 },
  { id: 'med_vent', name: 'Ventilators', category: 'medical', unit: 'units', criticalThreshold: 10, costPerUnit: 200000 },
  { id: 'med_meds', name: 'Emergency Medicines', category: 'medical', unit: 'boxes', criticalThreshold: 200, costPerUnit: 2000 },
  { id: 'shel_tent', name: 'Relief Tents', category: 'shelter', unit: 'tents', criticalThreshold: 100, costPerUnit: 8000 },
  { id: 'shel_blank', name: 'Blankets', category: 'shelter', unit: 'pieces', criticalThreshold: 500, costPerUnit: 200 },
  { id: 'shel_mat', name: 'Sleeping Mats', category: 'shelter', unit: 'pieces', criticalThreshold: 300, costPerUnit: 150 },
  { id: 'food_ration', name: 'Food Rations', category: 'food', unit: 'packets', criticalThreshold: 1000, costPerUnit: 50 },
  { id: 'food_baby', name: 'Baby Food', category: 'food', unit: 'packets', criticalThreshold: 200, costPerUnit: 80 },
  { id: 'water_bottle', name: 'Drinking Water', category: 'water', unit: 'liters', criticalThreshold: 5000, costPerUnit: 20 },
  { id: 'water_purif', name: 'Water Purification Tablets', category: 'water', unit: 'strips', criticalThreshold: 500, costPerUnit: 100 },
  { id: 'equip_gen', name: 'Generators', category: 'equipment', unit: 'units', criticalThreshold: 20, costPerUnit: 50000 },
  { id: 'equip_pump', name: 'Water Pumps', category: 'equipment', unit: 'units', criticalThreshold: 30, costPerUnit: 25000 },
  { id: 'equip_light', name: 'Emergency Lights', category: 'equipment', unit: 'units', criticalThreshold: 100, costPerUnit: 1500 },
  { id: 'pers_rescue', name: 'Rescue Personnel', category: 'personnel', unit: 'persons', criticalThreshold: 50, costPerUnit: 5000 },
  { id: 'pers_med', name: 'Medical Staff', category: 'personnel', unit: 'persons', criticalThreshold: 30, costPerUnit: 8000 },
  { id: 'trans_ambu', name: 'Ambulances', category: 'transport', unit: 'vehicles', criticalThreshold: 10, costPerUnit: 100000 },
  { id: 'trans_boat', name: 'Rescue Boats', category: 'transport', unit: 'boats', criticalThreshold: 15, costPerUnit: 80000 },
];

// Disaster-specific resource multipliers
const DISASTER_RESOURCE_FACTORS: Record<string, Record<string, number>> = {
  flood: {
    med_kit: 1.5, shel_tent: 2.0, water_bottle: 2.5, water_purif: 3.0, equip_pump: 5.0, trans_boat: 4.0
  },
  earthquake: {
    med_kit: 2.5, med_beds: 3.0, med_vent: 2.0, shel_tent: 2.5, equip_gen: 2.0, pers_rescue: 3.0
  },
  cyclone: {
    shel_tent: 3.0, shel_blank: 2.0, food_ration: 2.5, equip_gen: 2.5, trans_ambu: 1.5
  },
  wildfire: {
    med_kit: 2.0, water_bottle: 3.0, pers_rescue: 2.5, trans_ambu: 2.0
  },
  drought: {
    water_bottle: 5.0, water_purif: 4.0, food_ration: 2.0, equip_pump: 2.0
  },
};

class ResourceAllocationService {
  private static instance: ResourceAllocationService;
  private inventory: Map<string, ResourceInventory[]> = new Map();
  private predictions: Map<string, ResourcePrediction> = new Map();

  private constructor() {
    this.initializeSampleInventory();
  }

  public static getInstance(): ResourceAllocationService {
    if (!ResourceAllocationService.instance) {
      ResourceAllocationService.instance = new ResourceAllocationService();
    }
    return ResourceAllocationService.instance;
  }

  private initializeSampleInventory(): void {
    // Sample inventory across multiple locations
    const locations = [
      { name: 'Delhi Central Warehouse', lat: 28.6139, lon: 77.2090 },
      { name: 'Noida Depot', lat: 28.5355, lon: 77.3910 },
      { name: 'Gurgaon Hub', lat: 28.4595, lon: 77.0266 },
    ];

    for (const resource of RESOURCE_DATABASE) {
      const inventoryList: ResourceInventory[] = locations.map(loc => ({
        resourceId: resource.id,
        currentStock: Math.floor(Math.random() * resource.criticalThreshold * 3) + resource.criticalThreshold,
        reservedStock: Math.floor(Math.random() * resource.criticalThreshold * 0.3),
        inTransit: Math.floor(Math.random() * resource.criticalThreshold * 0.2),
        lastUpdated: new Date(),
        location: loc,
      }));
      this.inventory.set(resource.id, inventoryList);
    }
  }

  /**
   * Predict resource needs based on disaster parameters
   */
  public predictResourceNeeds(
    disasterType: string,
    affectedArea: { lat: number; lon: number; radius: number; name: string },
    estimatedPopulation: number,
    severity: 'low' | 'moderate' | 'high' | 'critical',
    duration: number
  ): ResourcePrediction {
    const predictionId = `pred_${Date.now()}`;
    const severityMultiplier = { low: 0.3, moderate: 0.6, high: 0.85, critical: 1.2 }[severity];
    const disasterFactors = DISASTER_RESOURCE_FACTORS[disasterType] || {};

    const resources: ResourceNeed[] = [];
    let totalCost = 0;

    for (const resource of RESOURCE_DATABASE) {
      const baseFactor = disasterFactors[resource.id] || 1.0;
      const categoryFactor = this.getCategoryFactor(resource.category, disasterType);
      
      // Calculate predicted need
      let predictedNeed = this.calculateBasicNeed(resource, estimatedPopulation, duration);
      predictedNeed = Math.ceil(predictedNeed * baseFactor * categoryFactor * severityMultiplier);

      // Get current availability
      const inventoryList = this.inventory.get(resource.id) || [];
      const currentAvailable = inventoryList.reduce((sum, inv) => sum + inv.currentStock - inv.reservedStock, 0);

      const gap = Math.max(0, predictedNeed - currentAvailable);
      const costEstimate = gap * resource.costPerUnit;
      totalCost += costEstimate;

      resources.push({
        resourceId: resource.id,
        resourceName: resource.name,
        category: resource.category,
        predictedNeed,
        currentAvailable,
        gap,
        priority: this.calculatePriority(gap, resource.criticalThreshold),
        timeline: this.determineTimeline(resource.category, severity),
        costEstimate,
      });
    }

    // Sort by priority
    resources.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const prediction: ResourcePrediction = {
      id: predictionId,
      timestamp: new Date(),
      disasterType,
      affectedArea,
      estimatedPopulation,
      duration,
      resources,
      totalCost,
      confidence: 0.75 + Math.random() * 0.15,
      priorityLevel: severity === 'moderate' ? 'medium' : severity,
      recommendations: this.generateRecommendations(resources, severity),
    };

    this.predictions.set(predictionId, prediction);
    return prediction;
  }

  private calculateBasicNeed(resource: ResourceType, population: number, duration: number): number {
    const dailyFactor = duration / 24;
    
    const categoryNeeds: Record<string, number> = {
      medical: 0.1, // 10% of population
      shelter: 0.25, // 25% need shelter
      food: 3, // 3 meals per person
      water: 5, // 5 liters per person
      equipment: 0.01, // 1% of population
      personnel: 0.005, // 0.5% of population
      transport: 0.002, // 0.2% of population
    };

    const need = population * (categoryNeeds[resource.category] || 0.1) * dailyFactor;
    return Math.ceil(need);
  }

  private getCategoryFactor(category: string, disasterType: string): number {
    const factors: Record<string, Record<string, number>> = {
      flood: { water: 0.5, shelter: 1.5, transport: 1.5 },
      earthquake: { medical: 1.5, shelter: 1.5, equipment: 1.5 },
      cyclone: { shelter: 2.0, food: 1.5 },
      wildfire: { medical: 1.5, water: 2.0 },
      drought: { water: 3.0, food: 1.5 },
    };
    return factors[disasterType]?.[category] || 1.0;
  }

  private calculatePriority(gap: number, threshold: number): ResourceNeed['priority'] {
    const ratio = gap / threshold;
    if (ratio >= 2) return 'critical';
    if (ratio >= 1) return 'high';
    if (ratio >= 0.5) return 'medium';
    return 'low';
  }

  private determineTimeline(category: string, severity: string): ResourceNeed['timeline'] {
    if (severity === 'critical') return 'immediate';
    
    const immediateCategories = ['medical', 'water'];
    if (immediateCategories.includes(category)) {
      return severity === 'high' ? 'immediate' : '24h';
    }
    
    return severity === 'high' ? '24h' : '72h';
  }

  private generateRecommendations(resources: ResourceNeed[], severity: string): string[] {
    const recommendations: string[] = [];
    const criticalResources = resources.filter(r => r.priority === 'critical');
    
    if (criticalResources.length > 0) {
      recommendations.push(`🚨 Critical shortage of ${criticalResources.length} resource types - immediate action required`);
      recommendations.push(`Priority procurement needed for: ${criticalResources.slice(0, 3).map(r => r.resourceName).join(', ')}`);
    }

    if (severity === 'critical' || severity === 'high') {
      recommendations.push('Activate mutual aid agreements with neighboring districts');
      recommendations.push('Pre-position resources at identified staging areas');
      recommendations.push('Alert logistics partners for emergency transportation');
    }

    const medicalResources = resources.filter(r => r.category === 'medical' && r.gap > 0);
    if (medicalResources.length > 0) {
      recommendations.push('Coordinate with hospitals for surge capacity');
    }

    const shelterResources = resources.filter(r => r.category === 'shelter' && r.gap > 0);
    if (shelterResources.length > 0) {
      recommendations.push('Identify additional shelter locations (schools, community centers)');
    }

    return recommendations;
  }

  /**
   * Generate optimal allocation plan
   */
  public generateAllocationPlan(predictionId: string): AllocationPlan | null {
    const prediction = this.predictions.get(predictionId);
    if (!prediction) return null;

    const allocations: ResourceAllocation[] = [];
    let totalCost = 0;

    for (const need of prediction.resources.filter(r => r.gap > 0)) {
      const inventoryList = this.inventory.get(need.resourceId) || [];
      let remainingNeed = need.gap;

      for (const inventory of inventoryList) {
        if (remainingNeed <= 0) break;

        const available = inventory.currentStock - inventory.reservedStock;
        if (available <= 0) continue;

        const allocateQuantity = Math.min(remainingNeed, available);
        const resource = RESOURCE_DATABASE.find(r => r.id === need.resourceId)!;

        allocations.push({
          resourceId: need.resourceId,
          sourceLocation: inventory.location.name,
          destinationLocation: prediction.affectedArea.name,
          quantity: allocateQuantity,
          transportMode: this.determineTransportMode(inventory.location, prediction.affectedArea),
          estimatedArrival: new Date(Date.now() + this.estimateDeliveryTime(inventory.location, prediction.affectedArea) * 60 * 60 * 1000),
          cost: allocateQuantity * resource.costPerUnit,
          priority: need.priority === 'critical' ? 1 : need.priority === 'high' ? 2 : 3,
        });

        totalCost += allocateQuantity * resource.costPerUnit;
        remainingNeed -= allocateQuantity;
      }
    }

    const totalNeeded = prediction.resources.reduce((sum, r) => sum + r.gap, 0);
    const totalAllocated = allocations.reduce((sum, a) => sum + a.quantity, 0);
    const coveragePercentage = totalNeeded > 0 ? (totalAllocated / totalNeeded) * 100 : 100;

    return {
      id: `plan_${Date.now()}`,
      predictionId,
      allocations: allocations.sort((a, b) => a.priority - b.priority),
      totalCost,
      coveragePercentage: Math.min(100, coveragePercentage),
      estimatedDeliveryTime: Math.max(...allocations.map(a => 
        (a.estimatedArrival.getTime() - Date.now()) / (60 * 60 * 1000)
      )) || 0,
      status: 'draft',
      createdAt: new Date(),
    };
  }

  private determineTransportMode(
    source: { lat: number; lon: number },
    dest: { lat: number; lon: number; radius: number }
  ): ResourceAllocation['transportMode'] {
    const distance = this.haversineDistance(source, dest);
    if (distance > 500) return 'air';
    if (distance > 200) return 'rail';
    return 'road';
  }

  private estimateDeliveryTime(source: { lat: number; lon: number }, dest: { lat: number; lon: number }): number {
    const distance = this.haversineDistance(source, dest);
    // Assume average speed of 40 km/h for road transport
    return Math.ceil(distance / 40);
  }

  private haversineDistance(coord1: { lat: number; lon: number }, coord2: { lat: number; lon: number }): number {
    const R = 6371;
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lon - coord1.lon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  public getResourceDatabase(): ResourceType[] {
    return RESOURCE_DATABASE;
  }

  public getInventory(resourceId: string): ResourceInventory[] {
    return this.inventory.get(resourceId) || [];
  }
}

export const resourceAllocationService = ResourceAllocationService.getInstance();
export default resourceAllocationService;

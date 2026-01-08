/**
 * Indoor Navigation Service
 * Navigate inside emergency shelters and relief camps
 */

// Point in indoor space
interface IndoorPoint {
  x: number; // meters from origin
  y: number;
  floor: number;
  buildingId: string;
}

// Navigation node
interface NavNode {
  id: string;
  point: IndoorPoint;
  type: 'entrance' | 'exit' | 'stairs' | 'elevator' | 'hallway' | 'room' | 'waypoint' | 'emergency_exit';
  name?: string;
  accessible: boolean;
  connections: string[]; // connected node IDs
}

// Indoor building map
interface IndoorMap {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'school' | 'community_center' | 'stadium' | 'government_building';
  address: string;
  geoLocation: { lat: number; lng: number };
  floors: FloorPlan[];
  nodes: NavNode[];
  facilities: Facility[];
  capacity: {
    total: number;
    current: number;
  };
  lastUpdated: Date;
}

// Floor plan
interface FloorPlan {
  level: number;
  name: string; // Ground, First, Basement, etc.
  height: number; // meters
  outline: { x: number; y: number }[];
  rooms: Room[];
  obstacles: Obstacle[];
  imageUrl?: string;
}

// Room definition
interface Room {
  id: string;
  name: string;
  type: RoomType;
  floor: number;
  bounds: { x: number; y: number; width: number; height: number };
  capacity?: number;
  currentOccupancy?: number;
  amenities: string[];
  accessible: boolean;
  status: 'available' | 'occupied' | 'closed' | 'emergency';
}

// Room types
type RoomType = 
  | 'sleeping_area'
  | 'dining_hall'
  | 'medical_room'
  | 'storage'
  | 'bathroom'
  | 'kitchen'
  | 'registration'
  | 'common_area'
  | 'children_area'
  | 'women_area'
  | 'elderly_area'
  | 'pet_area'
  | 'isolation_room'
  | 'office'
  | 'supply_room';

// Obstacle
interface Obstacle {
  type: 'wall' | 'pillar' | 'furniture' | 'temporary';
  bounds: { x: number; y: number; width: number; height: number };
  floor: number;
  passable: boolean;
}

// Facility
interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  location: IndoorPoint;
  status: 'operational' | 'limited' | 'closed';
  waitTime?: number; // minutes
  accessible: boolean;
  schedule?: { open: string; close: string };
}

// Facility types
type FacilityType = 
  | 'toilet'
  | 'shower'
  | 'water_station'
  | 'charging_station'
  | 'first_aid'
  | 'information_desk'
  | 'food_distribution'
  | 'clothing_distribution'
  | 'baby_care'
  | 'wheelchair'
  | 'atm'
  | 'phone_booth'
  | 'wifi_zone';

// Navigation route
interface NavigationRoute {
  startNode: string;
  endNode: string;
  path: NavNode[];
  distance: number; // meters
  estimatedTime: number; // seconds
  steps: NavigationStep[];
  accessibility: {
    wheelchairAccessible: boolean;
    visuallyImpaired: boolean;
    hasStairs: boolean;
    hasElevator: boolean;
  };
}

// Navigation step
interface NavigationStep {
  instruction: string;
  distance: number;
  direction: 'straight' | 'left' | 'right' | 'up' | 'down' | 'enter' | 'exit';
  landmark?: string;
  node: NavNode;
}

// User preferences for navigation
interface NavigationPreferences {
  avoidStairs: boolean;
  wheelchairAccess: boolean;
  visualAssist: boolean;
  preferElevator: boolean;
  avoidCrowded: boolean;
}

// Facility icons
const FACILITY_ICONS: Record<FacilityType, string> = {
  toilet: '🚻',
  shower: '🚿',
  water_station: '💧',
  charging_station: '🔌',
  first_aid: '🏥',
  information_desk: 'ℹ️',
  food_distribution: '🍽️',
  clothing_distribution: '👕',
  baby_care: '👶',
  wheelchair: '♿',
  atm: '🏧',
  phone_booth: '📞',
  wifi_zone: '📶',
};

// Room icons
const ROOM_ICONS: Record<RoomType, string> = {
  sleeping_area: '🛏️',
  dining_hall: '🍽️',
  medical_room: '🏥',
  storage: '📦',
  bathroom: '🚻',
  kitchen: '👨‍🍳',
  registration: '📋',
  common_area: '👥',
  children_area: '👧',
  women_area: '👩',
  elderly_area: '👴',
  pet_area: '🐕',
  isolation_room: '🔒',
  office: '🏢',
  supply_room: '📦',
};

// Sample shelter data
const SAMPLE_SHELTERS: IndoorMap[] = [
  {
    id: 'shelter-001',
    name: 'Government Higher Secondary School Relief Camp',
    type: 'school',
    address: 'Thrissur Town, Kerala',
    geoLocation: { lat: 10.5125, lng: 76.2228 },
    floors: [
      {
        level: 0,
        name: 'Ground Floor',
        height: 3.5,
        outline: [
          { x: 0, y: 0 },
          { x: 60, y: 0 },
          { x: 60, y: 40 },
          { x: 0, y: 40 },
        ],
        rooms: [
          { id: 'r1', name: 'Registration Hall', type: 'registration', floor: 0, bounds: { x: 0, y: 0, width: 15, height: 20 }, capacity: 50, amenities: ['seating', 'desk'], accessible: true, status: 'available' },
          { id: 'r2', name: 'Main Sleeping Area A', type: 'sleeping_area', floor: 0, bounds: { x: 15, y: 0, width: 25, height: 20 }, capacity: 100, amenities: ['mats', 'fans'], accessible: true, status: 'occupied' },
          { id: 'r3', name: 'Dining Hall', type: 'dining_hall', floor: 0, bounds: { x: 40, y: 0, width: 20, height: 20 }, capacity: 150, amenities: ['tables', 'chairs', 'wash_area'], accessible: true, status: 'available' },
          { id: 'r4', name: 'Women\'s Area', type: 'women_area', floor: 0, bounds: { x: 0, y: 20, width: 20, height: 20 }, capacity: 60, amenities: ['mats', 'privacy_screens'], accessible: true, status: 'available' },
          { id: 'r5', name: 'Children\'s Play Area', type: 'children_area', floor: 0, bounds: { x: 20, y: 20, width: 15, height: 20 }, capacity: 40, amenities: ['toys', 'games'], accessible: true, status: 'available' },
          { id: 'r6', name: 'Medical Room', type: 'medical_room', floor: 0, bounds: { x: 35, y: 20, width: 15, height: 10 }, capacity: 20, amenities: ['beds', 'medical_supplies'], accessible: true, status: 'available' },
          { id: 'r7', name: 'Bathrooms', type: 'bathroom', floor: 0, bounds: { x: 50, y: 20, width: 10, height: 20 }, capacity: 10, amenities: ['toilets', 'sinks'], accessible: true, status: 'available' },
        ],
        obstacles: [
          { type: 'pillar', bounds: { x: 20, y: 10, width: 1, height: 1 }, floor: 0, passable: false },
          { type: 'pillar', bounds: { x: 40, y: 10, width: 1, height: 1 }, floor: 0, passable: false },
        ],
      },
      {
        level: 1,
        name: 'First Floor',
        height: 3.5,
        outline: [
          { x: 0, y: 0 },
          { x: 60, y: 0 },
          { x: 60, y: 40 },
          { x: 0, y: 40 },
        ],
        rooms: [
          { id: 'r8', name: 'Main Sleeping Area B', type: 'sleeping_area', floor: 1, bounds: { x: 0, y: 0, width: 30, height: 20 }, capacity: 120, amenities: ['mats', 'fans'], accessible: false, status: 'available' },
          { id: 'r9', name: 'Main Sleeping Area C', type: 'sleeping_area', floor: 1, bounds: { x: 30, y: 0, width: 30, height: 20 }, capacity: 120, amenities: ['mats', 'fans'], accessible: false, status: 'available' },
          { id: 'r10', name: 'Elderly Area', type: 'elderly_area', floor: 1, bounds: { x: 0, y: 20, width: 25, height: 20 }, capacity: 50, amenities: ['beds', 'medical_support'], accessible: false, status: 'available' },
          { id: 'r11', name: 'Storage Room', type: 'storage', floor: 1, bounds: { x: 25, y: 20, width: 20, height: 20 }, capacity: 0, amenities: [], accessible: false, status: 'available' },
          { id: 'r12', name: 'Office', type: 'office', floor: 1, bounds: { x: 45, y: 20, width: 15, height: 20 }, capacity: 10, amenities: ['desks', 'phones'], accessible: false, status: 'available' },
        ],
        obstacles: [],
      },
    ],
    nodes: [],
    facilities: [
      { id: 'f1', type: 'information_desk', name: 'Help Desk', location: { x: 5, y: 10, floor: 0, buildingId: 'shelter-001' }, status: 'operational', accessible: true, schedule: { open: '06:00', close: '22:00' } },
      { id: 'f2', type: 'water_station', name: 'Drinking Water', location: { x: 55, y: 35, floor: 0, buildingId: 'shelter-001' }, status: 'operational', accessible: true },
      { id: 'f3', type: 'charging_station', name: 'Phone Charging', location: { x: 30, y: 35, floor: 0, buildingId: 'shelter-001' }, status: 'operational', accessible: true },
      { id: 'f4', type: 'first_aid', name: 'First Aid Station', location: { x: 40, y: 25, floor: 0, buildingId: 'shelter-001' }, status: 'operational', accessible: true },
      { id: 'f5', type: 'food_distribution', name: 'Food Counter', location: { x: 45, y: 5, floor: 0, buildingId: 'shelter-001' }, status: 'operational', waitTime: 15, accessible: true, schedule: { open: '07:00', close: '20:00' } },
      { id: 'f6', type: 'toilet', name: 'Toilet Block', location: { x: 55, y: 30, floor: 0, buildingId: 'shelter-001' }, status: 'operational', accessible: true },
      { id: 'f7', type: 'baby_care', name: 'Baby Care Room', location: { x: 10, y: 30, floor: 0, buildingId: 'shelter-001' }, status: 'operational', accessible: true },
      { id: 'f8', type: 'wifi_zone', name: 'WiFi Area', location: { x: 25, y: 30, floor: 0, buildingId: 'shelter-001' }, status: 'limited', accessible: true },
    ],
    capacity: { total: 500, current: 320 },
    lastUpdated: new Date(),
  },
];

class IndoorNavigationService {
  private static instance: IndoorNavigationService;
  private buildings: Map<string, IndoorMap> = new Map();
  private currentBuilding: IndoorMap | null = null;
  private currentPosition: IndoorPoint | null = null;

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): IndoorNavigationService {
    if (!IndoorNavigationService.instance) {
      IndoorNavigationService.instance = new IndoorNavigationService();
    }
    return IndoorNavigationService.instance;
  }

  /**
   * Initialize with sample data
   */
  private initializeData(): void {
    SAMPLE_SHELTERS.forEach((shelter) => {
      // Generate navigation nodes
      shelter.nodes = this.generateNavigationNodes(shelter);
      this.buildings.set(shelter.id, shelter);
    });
  }

  /**
   * Generate navigation nodes from floor plan
   */
  private generateNavigationNodes(building: IndoorMap): NavNode[] {
    const nodes: NavNode[] = [];
    let nodeId = 0;

    building.floors.forEach((floor) => {
      // Add entrance/exit nodes
      nodes.push({
        id: `node-${nodeId++}`,
        point: { x: 30, y: 0, floor: floor.level, buildingId: building.id },
        type: floor.level === 0 ? 'entrance' : 'stairs',
        name: floor.level === 0 ? 'Main Entrance' : `Staircase ${floor.name}`,
        accessible: true,
        connections: [],
      });

      // Add emergency exit
      nodes.push({
        id: `node-${nodeId++}`,
        point: { x: 0, y: 20, floor: floor.level, buildingId: building.id },
        type: 'emergency_exit',
        name: `Emergency Exit ${floor.name}`,
        accessible: true,
        connections: [],
      });

      // Add room waypoints
      floor.rooms.forEach((room) => {
        const centerX = room.bounds.x + room.bounds.width / 2;
        const centerY = room.bounds.y + room.bounds.height / 2;

        nodes.push({
          id: `node-${nodeId++}`,
          point: { x: centerX, y: centerY, floor: floor.level, buildingId: building.id },
          type: 'room',
          name: room.name,
          accessible: room.accessible,
          connections: [],
        });
      });

      // Add hallway waypoints
      const hallwayPoints = [
        { x: 15, y: 10 },
        { x: 30, y: 10 },
        { x: 45, y: 10 },
        { x: 15, y: 30 },
        { x: 30, y: 30 },
        { x: 45, y: 30 },
      ];

      hallwayPoints.forEach((point) => {
        nodes.push({
          id: `node-${nodeId++}`,
          point: { x: point.x, y: point.y, floor: floor.level, buildingId: building.id },
          type: 'hallway',
          accessible: true,
          connections: [],
        });
      });
    });

    // Connect nodes
    this.connectNodes(nodes);

    return nodes;
  }

  /**
   * Connect navigation nodes
   */
  private connectNodes(nodes: NavNode[]): void {
    nodes.forEach((node) => {
      nodes.forEach((other) => {
        if (node.id === other.id) return;

        // Same floor connections
        if (node.point.floor === other.point.floor) {
          const distance = this.calculateDistance(node.point, other.point);
          if (distance < 20) {
            // Within 20 meters
            if (!node.connections.includes(other.id)) {
              node.connections.push(other.id);
            }
          }
        }

        // Cross-floor connections (stairs/elevator)
        if (
          Math.abs(node.point.floor - other.point.floor) === 1 &&
          (node.type === 'stairs' || node.type === 'elevator') &&
          (other.type === 'stairs' || other.type === 'elevator')
        ) {
          if (!node.connections.includes(other.id)) {
            node.connections.push(other.id);
          }
        }
      });
    });
  }

  /**
   * Calculate distance between points
   */
  private calculateDistance(p1: IndoorPoint, p2: IndoorPoint): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = (p2.floor - p1.floor) * 3.5; // floor height
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Set current building
   */
  public setCurrentBuilding(buildingId: string): IndoorMap | null {
    this.currentBuilding = this.buildings.get(buildingId) || null;
    return this.currentBuilding;
  }

  /**
   * Update user position
   */
  public updatePosition(position: IndoorPoint): void {
    this.currentPosition = position;
  }

  /**
   * Find route using A* algorithm
   */
  public findRoute(
    fromPoint: IndoorPoint,
    toPoint: IndoorPoint,
    preferences: NavigationPreferences = {
      avoidStairs: false,
      wheelchairAccess: false,
      visualAssist: false,
      preferElevator: false,
      avoidCrowded: false,
    }
  ): NavigationRoute | null {
    if (!this.currentBuilding) return null;

    const startNode = this.findNearestNode(fromPoint);
    const endNode = this.findNearestNode(toPoint);

    if (!startNode || !endNode) return null;

    const path = this.aStarSearch(startNode, endNode, preferences);
    if (!path) return null;

    return this.buildRoute(path, preferences);
  }

  /**
   * Find nearest navigation node
   */
  private findNearestNode(point: IndoorPoint): NavNode | null {
    if (!this.currentBuilding) return null;

    let nearest: NavNode | null = null;
    let minDistance = Infinity;

    this.currentBuilding.nodes.forEach((node) => {
      const distance = this.calculateDistance(point, node.point);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = node;
      }
    });

    return nearest;
  }

  /**
   * A* pathfinding algorithm
   */
  private aStarSearch(
    start: NavNode,
    end: NavNode,
    preferences: NavigationPreferences
  ): NavNode[] | null {
    if (!this.currentBuilding) return null;

    const openSet = new Set<string>([start.id]);
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    gScore.set(start.id, 0);
    fScore.set(start.id, this.heuristic(start, end));

    while (openSet.size > 0) {
      // Get node with lowest fScore
      let current: string | null = null;
      let lowestF = Infinity;

      openSet.forEach((nodeId) => {
        const f = fScore.get(nodeId) || Infinity;
        if (f < lowestF) {
          lowestF = f;
          current = nodeId;
        }
      });

      if (!current) break;

      if (current === end.id) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.delete(current);

      const currentNode = this.currentBuilding.nodes.find((n) => n.id === current)!;

      for (const neighborId of currentNode.connections) {
        const neighbor = this.currentBuilding.nodes.find((n) => n.id === neighborId);
        if (!neighbor) continue;

        // Check accessibility preferences
        if (preferences.wheelchairAccess && !neighbor.accessible) continue;
        if (preferences.avoidStairs && neighbor.type === 'stairs') continue;

        const tentativeG =
          (gScore.get(current) || 0) +
          this.calculateDistance(currentNode.point, neighbor.point) *
            this.getPreferenceCost(neighbor, preferences);

        if (tentativeG < (gScore.get(neighborId) || Infinity)) {
          cameFrom.set(neighborId, current);
          gScore.set(neighborId, tentativeG);
          fScore.set(neighborId, tentativeG + this.heuristic(neighbor, end));
          openSet.add(neighborId);
        }
      }
    }

    return null;
  }

  /**
   * Heuristic for A*
   */
  private heuristic(node: NavNode, goal: NavNode): number {
    return this.calculateDistance(node.point, goal.point);
  }

  /**
   * Get cost multiplier based on preferences
   */
  private getPreferenceCost(node: NavNode, preferences: NavigationPreferences): number {
    let cost = 1;

    if (node.type === 'stairs') {
      if (preferences.avoidStairs) cost *= 10;
      if (preferences.wheelchairAccess) cost *= 100;
    }

    if (node.type === 'elevator' && preferences.preferElevator) {
      cost *= 0.5;
    }

    return cost;
  }

  /**
   * Reconstruct path from A* result
   */
  private reconstructPath(cameFrom: Map<string, string>, current: string): NavNode[] {
    const path: NavNode[] = [];
    let currentId: string | undefined = current;

    while (currentId) {
      const node = this.currentBuilding!.nodes.find((n) => n.id === currentId);
      if (node) path.unshift(node);
      currentId = cameFrom.get(currentId);
    }

    return path;
  }

  /**
   * Build navigation route
   */
  private buildRoute(path: NavNode[], preferences: NavigationPreferences): NavigationRoute {
    const steps: NavigationStep[] = [];
    let totalDistance = 0;
    let hasStairs = false;
    let hasElevator = false;

    for (let i = 0; i < path.length; i++) {
      const current = path[i];
      const next = path[i + 1];

      if (current.type === 'stairs') hasStairs = true;
      if (current.type === 'elevator') hasElevator = true;

      if (next) {
        const distance = this.calculateDistance(current.point, next.point);
        totalDistance += distance;

        const direction = this.getDirection(current, next);
        const instruction = this.generateInstruction(current, next, direction);

        steps.push({
          instruction,
          distance,
          direction,
          landmark: current.name,
          node: current,
        });
      } else {
        steps.push({
          instruction: `Arrive at ${current.name || 'destination'}`,
          distance: 0,
          direction: 'straight',
          landmark: current.name,
          node: current,
        });
      }
    }

    const walkingSpeed = preferences.wheelchairAccess ? 0.8 : 1.2; // m/s
    const estimatedTime = totalDistance / walkingSpeed;

    return {
      startNode: path[0].id,
      endNode: path[path.length - 1].id,
      path,
      distance: totalDistance,
      estimatedTime,
      steps,
      accessibility: {
        wheelchairAccessible: !hasStairs,
        visuallyImpaired: true,
        hasStairs,
        hasElevator,
      },
    };
  }

  /**
   * Get direction between nodes
   */
  private getDirection(
    from: NavNode,
    to: NavNode
  ): 'straight' | 'left' | 'right' | 'up' | 'down' | 'enter' | 'exit' {
    if (to.point.floor > from.point.floor) return 'up';
    if (to.point.floor < from.point.floor) return 'down';
    if (to.type === 'entrance') return 'enter';
    if (to.type === 'exit' || to.type === 'emergency_exit') return 'exit';

    const dx = to.point.x - from.point.x;
    const dy = to.point.y - from.point.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (Math.abs(angle) < 45) return 'straight';
    if (angle >= 45 && angle < 135) return 'right';
    if (angle <= -45 && angle > -135) return 'left';
    return 'straight';
  }

  /**
   * Generate navigation instruction
   */
  private generateInstruction(
    from: NavNode,
    to: NavNode,
    direction: string
  ): string {
    const distance = Math.round(this.calculateDistance(from.point, to.point));

    const directionInstructions: Record<string, string> = {
      straight: `Continue straight for ${distance}m`,
      left: `Turn left and walk ${distance}m`,
      right: `Turn right and walk ${distance}m`,
      up: `Go up to ${to.name || 'next floor'}`,
      down: `Go down to ${to.name || 'lower floor'}`,
      enter: `Enter through ${from.name || 'entrance'}`,
      exit: `Exit through ${to.name || 'exit'}`,
    };

    let instruction = directionInstructions[direction] || `Walk ${distance}m`;

    if (to.name && to.type === 'room') {
      instruction += ` towards ${to.name}`;
    }

    return instruction;
  }

  /**
   * Find nearest facility
   */
  public findNearestFacility(type: FacilityType, fromPoint?: IndoorPoint): Facility | null {
    if (!this.currentBuilding) return null;

    const point = fromPoint || this.currentPosition;
    if (!point) return null;

    let nearest: Facility | null = null;
    let minDistance = Infinity;

    this.currentBuilding.facilities
      .filter((f) => f.type === type && f.status !== 'closed')
      .forEach((facility) => {
        const distance = this.calculateDistance(point, facility.location);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = facility;
        }
      });

    return nearest;
  }

  /**
   * Get all facilities of type
   */
  public getFacilities(type?: FacilityType): Facility[] {
    if (!this.currentBuilding) return [];

    if (type) {
      return this.currentBuilding.facilities.filter((f) => f.type === type);
    }

    return this.currentBuilding.facilities;
  }

  /**
   * Find room by type
   */
  public findRooms(type: RoomType): Room[] {
    if (!this.currentBuilding) return [];

    const rooms: Room[] = [];
    this.currentBuilding.floors.forEach((floor) => {
      floor.rooms.filter((r) => r.type === type).forEach((r) => rooms.push(r));
    });

    return rooms;
  }

  /**
   * Get floor plan
   */
  public getFloorPlan(level: number): FloorPlan | null {
    if (!this.currentBuilding) return null;
    return this.currentBuilding.floors.find((f) => f.level === level) || null;
  }

  /**
   * Get building info
   */
  public getBuildingInfo(): IndoorMap | null {
    return this.currentBuilding;
  }

  /**
   * Get all buildings
   */
  public getAllBuildings(): IndoorMap[] {
    return Array.from(this.buildings.values());
  }

  /**
   * Get emergency exits
   */
  public getEmergencyExits(): NavNode[] {
    if (!this.currentBuilding) return [];
    return this.currentBuilding.nodes.filter((n) => n.type === 'emergency_exit');
  }

  /**
   * Navigate to nearest emergency exit
   */
  public navigateToEmergencyExit(fromPoint?: IndoorPoint): NavigationRoute | null {
    if (!this.currentBuilding) return null;

    const point = fromPoint || this.currentPosition;
    if (!point) return null;

    const exits = this.getEmergencyExits();
    if (exits.length === 0) return null;

    // Find nearest exit
    let nearestExit: NavNode | null = null;
    let minDistance = Infinity;

    exits.forEach((exit) => {
      const distance = this.calculateDistance(point, exit.point);
      if (distance < minDistance) {
        minDistance = distance;
        nearestExit = exit;
      }
    });

    if (!nearestExit) return null;

    return this.findRoute(point, nearestExit.point, { avoidStairs: false, wheelchairAccess: false, visualAssist: false, preferElevator: false, avoidCrowded: false });
  }

  /**
   * Get occupancy status
   */
  public getOccupancyStatus(): { total: number; current: number; percentage: number } {
    if (!this.currentBuilding) {
      return { total: 0, current: 0, percentage: 0 };
    }

    return {
      total: this.currentBuilding.capacity.total,
      current: this.currentBuilding.capacity.current,
      percentage: (this.currentBuilding.capacity.current / this.currentBuilding.capacity.total) * 100,
    };
  }

  /**
   * Get facility icon
   */
  public getFacilityIcon(type: FacilityType): string {
    return FACILITY_ICONS[type] || '📍';
  }

  /**
   * Get room icon
   */
  public getRoomIcon(type: RoomType): string {
    return ROOM_ICONS[type] || '🚪';
  }

  /**
   * Format distance
   */
  public formatDistance(meters: number): string {
    if (meters < 1) return `${Math.round(meters * 100)} cm`;
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  }

  /**
   * Format time
   */
  public formatTime(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)} sec`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return remainingSeconds > 0 ? `${minutes} min ${remainingSeconds} sec` : `${minutes} min`;
  }
}

export const indoorNavigationService = IndoorNavigationService.getInstance();
export type {
  IndoorMap,
  IndoorPoint,
  NavNode,
  FloorPlan,
  Room,
  RoomType,
  Facility,
  FacilityType,
  NavigationRoute,
  NavigationStep,
  NavigationPreferences,
};

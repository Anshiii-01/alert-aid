/**
 * ENHANCED EVACUATION ROUTE SERVICE
 * Provides color-coded routes, ETA calculations, and traffic integration
 * Issue #10 Implementation
 */

export interface EvacuationRoute {
  id: string;
  name: string;
  distance: number; // in kilometers
  duration: number; // in minutes
  dangerLevel: 'safe' | 'moderate' | 'high';
  trafficCondition: 'clear' | 'moderate' | 'congested';
  waypoints: Array<{ lat: number; lng: number }>;
  warnings: string[];
  recommended: boolean;
}

export interface RouteVisualizationOptions {
  showTraffic: boolean;
  showDangerZones: boolean;
  showETA: boolean;
  showDistance: boolean;
}

class EnhancedEvacuationRouteService {
  /**
   * Calculate danger level based on route characteristics
   */
  calculateDangerLevel(route: any): 'safe' | 'moderate' | 'high' {
    // Mock calculation - in real app would use actual hazard data
    const distance = route.distance;
    const traffic = route.trafficCondition;
    
    if (traffic === 'congested' || distance > 10) {
      return 'high';
    } else if (traffic === 'moderate' || distance > 5) {
      return 'moderate';
    }
    return 'safe';
  }
  
  /**
   * Get color for route based on danger level
   */
  getRouteColor(dangerLevel: 'safe' | 'moderate' | 'high'): string {
    switch (dangerLevel) {
      case 'safe':
        return '#22C55E'; // Green
      case 'moderate':
        return '#FBBF24'; // Yellow
      case 'high':
        return '#EF4444'; // Red
    }
  }
  
  /**
   * Get route visualization config
   */
  getRouteVisualization(dangerLevel: 'safe' | 'moderate' | 'high') {
    return {
      color: this.getRouteColor(dangerLevel),
      width: dangerLevel === 'safe' ? 5 : dangerLevel === 'moderate' ? 4 : 3,
      opacity: dangerLevel === 'safe' ? 1.0 : dangerLevel === 'moderate' ? 0.9 : 0.7,
      dashArray: dangerLevel === 'high' ? [10, 5] : undefined,
      animated: dangerLevel === 'safe',
    };
  }
  
  /**
   * Format duration to readable string
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  }
  
  /**
   * Format distance to readable string
   */
  formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  }
  
  /**
   * Calculate ETA based on current time and duration
   */
  calculateETA(durationMinutes: number): string {
    const now = new Date();
    const eta = new Date(now.getTime() + durationMinutes * 60000);
    return eta.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  /**
   * Generate mock routes (in real app, would use routing API)
   */
  generateMockRoutes(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number }
  ): EvacuationRoute[] {
    return [
      {
        id: 'route-1',
        name: 'Primary Route (Highway)',
        distance: 5.2,
        duration: 12,
        dangerLevel: 'safe',
        trafficCondition: 'clear',
        waypoints: this.generateWaypoints(from, to, 8),
        warnings: [],
        recommended: true,
      },
      {
        id: 'route-2',
        name: 'Alternative Route (City Roads)',
        distance: 6.8,
        duration: 18,
        dangerLevel: 'moderate',
        trafficCondition: 'moderate',
        waypoints: this.generateWaypoints(from, to, 12),
        warnings: ['Moderate traffic expected'],
        recommended: false,
      },
      {
        id: 'route-3',
        name: 'Emergency Bypass',
        distance: 8.5,
        duration: 25,
        dangerLevel: 'high',
        trafficCondition: 'congested',
        waypoints: this.generateWaypoints(from, to, 15),
        warnings: ['Heavy traffic', 'Construction zone ahead'],
        recommended: false,
      },
    ];
  }
  
  /**
   * Generate waypoints between two points
   */
  private generateWaypoints(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    count: number
  ): Array<{ lat: number; lng: number }> {
    const waypoints: Array<{ lat: number; lng: number }> = [from];
    
    for (let i = 1; i < count - 1; i++) {
      const ratio = i / (count - 1);
      const lat = from.lat + (to.lat - from.lat) * ratio + (Math.random() - 0.5) * 0.01;
      const lng = from.lng + (to.lng - from.lng) * ratio + (Math.random() - 0.5) * 0.01;
      waypoints.push({ lat, lng });
    }
    
    waypoints.push(to);
    return waypoints;
  }
  
  /**
   * Get route icon based on traffic condition
   */
  getTrafficIcon(condition: 'clear' | 'moderate' | 'congested'): string {
    switch (condition) {
      case 'clear':
        return '🟢';
      case 'moderate':
        return '🟡';
      case 'congested':
        return '🔴';
    }
  }
}

export const evacuationRouteService = new EnhancedEvacuationRouteService();
export default evacuationRouteService;

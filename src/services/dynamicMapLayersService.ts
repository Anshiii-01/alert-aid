/**
 * Dynamic Map Layers Service
 * Manage and toggle multiple data layers on disaster maps
 */

// Layer types
type LayerType = 
  | 'base'
  | 'hazard'
  | 'infrastructure'
  | 'population'
  | 'weather'
  | 'resource'
  | 'real_time'
  | 'historical'
  | 'custom';

// Layer category
type LayerCategory = 
  | 'flood'
  | 'fire'
  | 'earthquake'
  | 'cyclone'
  | 'landslide'
  | 'tsunami'
  | 'shelter'
  | 'medical'
  | 'evacuation'
  | 'traffic'
  | 'population'
  | 'terrain'
  | 'weather'
  | 'satellite';

// Map layer definition
interface MapLayer {
  id: string;
  name: string;
  description: string;
  type: LayerType;
  category: LayerCategory;
  source: LayerSource;
  visible: boolean;
  opacity: number; // 0-1
  zIndex: number;
  minZoom: number;
  maxZoom: number;
  interactive: boolean;
  legend?: LayerLegend;
  style?: LayerStyle;
  filters?: LayerFilter[];
  metadata: {
    lastUpdated: Date;
    updateInterval?: number; // seconds
    attribution?: string;
    dataQuality?: 'high' | 'medium' | 'low';
  };
}

// Layer data source
interface LayerSource {
  type: 'geojson' | 'vector' | 'raster' | 'wms' | 'wmts' | 'real_time';
  url?: string;
  data?: unknown;
  tiles?: string[];
  bounds?: [number, number, number, number]; // [west, south, east, north]
}

// Layer style
interface LayerStyle {
  type: 'fill' | 'line' | 'circle' | 'symbol' | 'heatmap' | 'fill-extrusion';
  paint: Record<string, unknown>;
  layout?: Record<string, unknown>;
}

// Layer legend
interface LayerLegend {
  title: string;
  items: {
    label: string;
    color?: string;
    icon?: string;
    value?: string | number;
  }[];
}

// Layer filter
interface LayerFilter {
  property: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains';
  value: unknown;
}

// Layer group
interface LayerGroup {
  id: string;
  name: string;
  description?: string;
  layers: string[]; // layer IDs
  visible: boolean;
  exclusive?: boolean; // Only one layer visible at a time
  collapsed: boolean;
}

// Layer preset
interface LayerPreset {
  id: string;
  name: string;
  description: string;
  disasterType?: string;
  layers: { id: string; visible: boolean; opacity?: number }[];
  icon: string;
}

// Feature info popup
interface FeatureInfo {
  layerId: string;
  layerName: string;
  coordinates: { lat: number; lng: number };
  properties: Record<string, unknown>;
  timestamp?: Date;
}

// Default layers configuration
const DEFAULT_LAYERS: Omit<MapLayer, 'visible' | 'opacity'>[] = [
  // Hazard layers
  {
    id: 'flood-zones',
    name: 'Flood Zones',
    description: 'Areas prone to flooding based on historical data',
    type: 'hazard',
    category: 'flood',
    source: { type: 'geojson', data: null },
    zIndex: 10,
    minZoom: 8,
    maxZoom: 18,
    interactive: true,
    legend: {
      title: 'Flood Risk',
      items: [
        { label: 'High Risk', color: '#F44336' },
        { label: 'Medium Risk', color: '#FF9800' },
        { label: 'Low Risk', color: '#4CAF50' },
      ],
    },
    style: {
      type: 'fill',
      paint: {
        'fill-color': ['match', ['get', 'risk'], 'high', '#F44336', 'medium', '#FF9800', '#4CAF50'],
        'fill-opacity': 0.5,
      },
    },
    metadata: { lastUpdated: new Date(), dataQuality: 'high' },
  },
  {
    id: 'active-fires',
    name: 'Active Fires',
    description: 'Real-time fire detection from satellites',
    type: 'real_time',
    category: 'fire',
    source: { type: 'geojson', data: null },
    zIndex: 15,
    minZoom: 6,
    maxZoom: 18,
    interactive: true,
    legend: {
      title: 'Fire Intensity',
      items: [
        { label: 'High (>100 MW)', color: '#FF0000', icon: '🔥' },
        { label: 'Medium (50-100 MW)', color: '#FF6600' },
        { label: 'Low (<50 MW)', color: '#FF9900' },
      ],
    },
    style: {
      type: 'circle',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['get', 'frp'], 0, 5, 100, 15, 500, 30],
        'circle-color': ['interpolate', ['linear'], ['get', 'frp'], 0, '#FF9900', 100, '#FF0000'],
        'circle-opacity': 0.8,
      },
    },
    metadata: { lastUpdated: new Date(), updateInterval: 300, attribution: 'MODIS/VIIRS' },
  },
  {
    id: 'earthquake-intensity',
    name: 'Earthquake Intensity',
    description: 'ShakeMap showing ground shaking intensity',
    type: 'hazard',
    category: 'earthquake',
    source: { type: 'raster', tiles: [] },
    zIndex: 8,
    minZoom: 5,
    maxZoom: 14,
    interactive: false,
    legend: {
      title: 'Modified Mercalli Intensity',
      items: [
        { label: 'X (Extreme)', color: '#8B0000' },
        { label: 'VIII (Severe)', color: '#FF0000' },
        { label: 'VI (Strong)', color: '#FFA500' },
        { label: 'IV (Light)', color: '#FFFF00' },
        { label: 'II (Weak)', color: '#00FF00' },
      ],
    },
    metadata: { lastUpdated: new Date(), attribution: 'USGS ShakeMap' },
  },
  {
    id: 'cyclone-track',
    name: 'Cyclone Track',
    description: 'Predicted cyclone path and cone of uncertainty',
    type: 'hazard',
    category: 'cyclone',
    source: { type: 'geojson', data: null },
    zIndex: 12,
    minZoom: 4,
    maxZoom: 12,
    interactive: true,
    legend: {
      title: 'Cyclone Category',
      items: [
        { label: 'Category 5', color: '#FF00FF' },
        { label: 'Category 4', color: '#FF0000' },
        { label: 'Category 3', color: '#FF6600' },
        { label: 'Category 2', color: '#FFCC00' },
        { label: 'Category 1', color: '#FFFF00' },
      ],
    },
    style: {
      type: 'line',
      paint: {
        'line-color': '#FF0000',
        'line-width': 3,
        'line-dasharray': [2, 2],
      },
    },
    metadata: { lastUpdated: new Date(), updateInterval: 3600, attribution: 'IMD' },
  },
  // Infrastructure layers
  {
    id: 'shelters',
    name: 'Emergency Shelters',
    description: 'Government and community shelter locations',
    type: 'infrastructure',
    category: 'shelter',
    source: { type: 'geojson', data: null },
    zIndex: 20,
    minZoom: 8,
    maxZoom: 18,
    interactive: true,
    legend: {
      title: 'Shelter Status',
      items: [
        { label: 'Open (Available)', color: '#4CAF50', icon: '🏠' },
        { label: 'Open (Full)', color: '#FF9800', icon: '🏠' },
        { label: 'Closed', color: '#9E9E9E', icon: '🏠' },
      ],
    },
    style: {
      type: 'symbol',
      paint: {},
      layout: {
        'icon-image': 'shelter',
        'icon-size': 1.2,
        'text-field': ['get', 'name'],
        'text-offset': [0, 1.5],
        'text-size': 12,
      },
    },
    metadata: { lastUpdated: new Date(), updateInterval: 600 },
  },
  {
    id: 'hospitals',
    name: 'Hospitals & Medical Centers',
    description: 'Healthcare facilities and emergency medical services',
    type: 'infrastructure',
    category: 'medical',
    source: { type: 'geojson', data: null },
    zIndex: 20,
    minZoom: 8,
    maxZoom: 18,
    interactive: true,
    legend: {
      title: 'Medical Facilities',
      items: [
        { label: 'Hospital', color: '#F44336', icon: '🏥' },
        { label: 'Clinic', color: '#E91E63', icon: '🏥' },
        { label: 'Pharmacy', color: '#9C27B0', icon: '💊' },
      ],
    },
    style: {
      type: 'symbol',
      paint: {},
      layout: {
        'icon-image': 'hospital',
        'icon-size': 1,
      },
    },
    metadata: { lastUpdated: new Date() },
  },
  {
    id: 'evacuation-routes',
    name: 'Evacuation Routes',
    description: 'Designated evacuation routes and assembly points',
    type: 'infrastructure',
    category: 'evacuation',
    source: { type: 'geojson', data: null },
    zIndex: 18,
    minZoom: 10,
    maxZoom: 18,
    interactive: true,
    legend: {
      title: 'Route Status',
      items: [
        { label: 'Clear', color: '#4CAF50' },
        { label: 'Congested', color: '#FF9800' },
        { label: 'Blocked', color: '#F44336' },
      ],
    },
    style: {
      type: 'line',
      paint: {
        'line-color': ['match', ['get', 'status'], 'clear', '#4CAF50', 'congested', '#FF9800', '#F44336'],
        'line-width': 4,
      },
    },
    metadata: { lastUpdated: new Date(), updateInterval: 300 },
  },
  // Weather layers
  {
    id: 'rainfall',
    name: 'Rainfall Radar',
    description: 'Real-time precipitation data',
    type: 'weather',
    category: 'weather',
    source: { type: 'raster', tiles: [] },
    zIndex: 5,
    minZoom: 4,
    maxZoom: 12,
    interactive: false,
    legend: {
      title: 'Rainfall (mm/hr)',
      items: [
        { label: '>50', color: '#9400D3' },
        { label: '25-50', color: '#FF0000' },
        { label: '10-25', color: '#FFA500' },
        { label: '5-10', color: '#FFFF00' },
        { label: '1-5', color: '#00FF00' },
        { label: '<1', color: '#0000FF' },
      ],
    },
    metadata: { lastUpdated: new Date(), updateInterval: 600, attribution: 'IMD Radar' },
  },
  {
    id: 'wind-speed',
    name: 'Wind Speed',
    description: 'Current wind speed and direction',
    type: 'weather',
    category: 'weather',
    source: { type: 'geojson', data: null },
    zIndex: 6,
    minZoom: 4,
    maxZoom: 10,
    interactive: true,
    legend: {
      title: 'Wind Speed (km/h)',
      items: [
        { label: '>100', color: '#FF0000' },
        { label: '60-100', color: '#FF6600' },
        { label: '30-60', color: '#FFCC00' },
        { label: '<30', color: '#00FF00' },
      ],
    },
    metadata: { lastUpdated: new Date(), updateInterval: 1800 },
  },
  // Population layers
  {
    id: 'population-density',
    name: 'Population Density',
    description: 'Census-based population density',
    type: 'population',
    category: 'population',
    source: { type: 'geojson', data: null },
    zIndex: 3,
    minZoom: 6,
    maxZoom: 14,
    interactive: true,
    legend: {
      title: 'People per sq km',
      items: [
        { label: '>10000', color: '#800026' },
        { label: '5000-10000', color: '#BD0026' },
        { label: '1000-5000', color: '#FC4E2A' },
        { label: '500-1000', color: '#FEB24C' },
        { label: '<500', color: '#FFEDA0' },
      ],
    },
    style: {
      type: 'fill',
      paint: {
        'fill-color': [
          'interpolate', ['linear'], ['get', 'density'],
          0, '#FFEDA0',
          500, '#FEB24C',
          1000, '#FC4E2A',
          5000, '#BD0026',
          10000, '#800026',
        ],
        'fill-opacity': 0.6,
      },
    },
    metadata: { lastUpdated: new Date(), attribution: 'Census 2011' },
  },
  // Terrain layers
  {
    id: 'elevation',
    name: 'Elevation',
    description: 'Digital elevation model',
    type: 'base',
    category: 'terrain',
    source: { type: 'raster', tiles: [] },
    zIndex: 1,
    minZoom: 6,
    maxZoom: 14,
    interactive: false,
    legend: {
      title: 'Elevation (m)',
      items: [
        { label: '>3000', color: '#FFFFFF' },
        { label: '1500-3000', color: '#8B4513' },
        { label: '500-1500', color: '#228B22' },
        { label: '100-500', color: '#90EE90' },
        { label: '<100', color: '#006400' },
      ],
    },
    metadata: { lastUpdated: new Date(), attribution: 'SRTM' },
  },
  {
    id: 'slope',
    name: 'Slope Gradient',
    description: 'Terrain slope for landslide risk assessment',
    type: 'hazard',
    category: 'landslide',
    source: { type: 'raster', tiles: [] },
    zIndex: 2,
    minZoom: 10,
    maxZoom: 16,
    interactive: false,
    legend: {
      title: 'Slope (degrees)',
      items: [
        { label: '>45°', color: '#FF0000' },
        { label: '30-45°', color: '#FF6600' },
        { label: '15-30°', color: '#FFCC00' },
        { label: '<15°', color: '#00FF00' },
      ],
    },
    metadata: { lastUpdated: new Date() },
  },
];

// Default layer groups
const DEFAULT_GROUPS: LayerGroup[] = [
  { id: 'group-hazards', name: 'Hazard Layers', layers: ['flood-zones', 'active-fires', 'earthquake-intensity', 'cyclone-track', 'slope'], visible: true, collapsed: false },
  { id: 'group-infrastructure', name: 'Infrastructure', layers: ['shelters', 'hospitals', 'evacuation-routes'], visible: true, collapsed: false },
  { id: 'group-weather', name: 'Weather', layers: ['rainfall', 'wind-speed'], visible: true, collapsed: true },
  { id: 'group-population', name: 'Population', layers: ['population-density'], visible: true, collapsed: true },
  { id: 'group-terrain', name: 'Terrain', layers: ['elevation', 'slope'], visible: true, collapsed: true },
];

// Default presets
const DEFAULT_PRESETS: LayerPreset[] = [
  {
    id: 'preset-flood',
    name: 'Flood Response',
    description: 'Layers optimized for flood monitoring',
    disasterType: 'flood',
    layers: [
      { id: 'flood-zones', visible: true, opacity: 0.7 },
      { id: 'shelters', visible: true },
      { id: 'evacuation-routes', visible: true },
      { id: 'rainfall', visible: true, opacity: 0.5 },
      { id: 'population-density', visible: true, opacity: 0.4 },
    ],
    icon: '🌊',
  },
  {
    id: 'preset-fire',
    name: 'Fire Response',
    description: 'Layers for wildfire monitoring',
    disasterType: 'fire',
    layers: [
      { id: 'active-fires', visible: true },
      { id: 'wind-speed', visible: true },
      { id: 'shelters', visible: true },
      { id: 'hospitals', visible: true },
    ],
    icon: '🔥',
  },
  {
    id: 'preset-earthquake',
    name: 'Earthquake Response',
    description: 'Layers for earthquake assessment',
    disasterType: 'earthquake',
    layers: [
      { id: 'earthquake-intensity', visible: true },
      { id: 'hospitals', visible: true },
      { id: 'shelters', visible: true },
      { id: 'population-density', visible: true, opacity: 0.5 },
    ],
    icon: '🏚️',
  },
  {
    id: 'preset-cyclone',
    name: 'Cyclone Response',
    description: 'Layers for cyclone tracking',
    disasterType: 'cyclone',
    layers: [
      { id: 'cyclone-track', visible: true },
      { id: 'wind-speed', visible: true },
      { id: 'rainfall', visible: true },
      { id: 'evacuation-routes', visible: true },
      { id: 'shelters', visible: true },
    ],
    icon: '🌀',
  },
];

class DynamicMapLayersService {
  private static instance: DynamicMapLayersService;
  private layers: Map<string, MapLayer> = new Map();
  private groups: Map<string, LayerGroup> = new Map();
  private presets: Map<string, LayerPreset> = new Map();
  private activePreset: string | null = null;
  private listeners: ((layers: MapLayer[]) => void)[] = [];

  private constructor() {
    this.initializeDefaults();
  }

  public static getInstance(): DynamicMapLayersService {
    if (!DynamicMapLayersService.instance) {
      DynamicMapLayersService.instance = new DynamicMapLayersService();
    }
    return DynamicMapLayersService.instance;
  }

  /**
   * Initialize with default layers
   */
  private initializeDefaults(): void {
    DEFAULT_LAYERS.forEach((layer) => {
      this.layers.set(layer.id, { ...layer, visible: false, opacity: 1 });
    });

    DEFAULT_GROUPS.forEach((group) => {
      this.groups.set(group.id, group);
    });

    DEFAULT_PRESETS.forEach((preset) => {
      this.presets.set(preset.id, preset);
    });
  }

  /**
   * Get all layers
   */
  public getLayers(): MapLayer[] {
    return Array.from(this.layers.values()).sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * Get layer by ID
   */
  public getLayer(layerId: string): MapLayer | undefined {
    return this.layers.get(layerId);
  }

  /**
   * Get visible layers
   */
  public getVisibleLayers(): MapLayer[] {
    return this.getLayers().filter((layer) => layer.visible);
  }

  /**
   * Toggle layer visibility
   */
  public toggleLayer(layerId: string): boolean {
    const layer = this.layers.get(layerId);
    if (!layer) return false;

    layer.visible = !layer.visible;
    this.notifyListeners();
    return layer.visible;
  }

  /**
   * Set layer visibility
   */
  public setLayerVisibility(layerId: string, visible: boolean): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;

    layer.visible = visible;
    this.notifyListeners();
  }

  /**
   * Set layer opacity
   */
  public setLayerOpacity(layerId: string, opacity: number): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;

    layer.opacity = Math.max(0, Math.min(1, opacity));
    this.notifyListeners();
  }

  /**
   * Set layer z-index
   */
  public setLayerZIndex(layerId: string, zIndex: number): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;

    layer.zIndex = zIndex;
    this.notifyListeners();
  }

  /**
   * Add custom layer
   */
  public addLayer(layer: Omit<MapLayer, 'id'>): MapLayer {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newLayer: MapLayer = { ...layer, id };
    this.layers.set(id, newLayer);
    this.notifyListeners();
    return newLayer;
  }

  /**
   * Remove layer
   */
  public removeLayer(layerId: string): boolean {
    const result = this.layers.delete(layerId);
    if (result) {
      // Remove from groups
      this.groups.forEach((group) => {
        group.layers = group.layers.filter((id) => id !== layerId);
      });
      this.notifyListeners();
    }
    return result;
  }

  /**
   * Update layer data
   */
  public updateLayerData(layerId: string, data: unknown): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;

    if (layer.source.type === 'geojson') {
      layer.source.data = data;
    }
    layer.metadata.lastUpdated = new Date();
    this.notifyListeners();
  }

  /**
   * Apply filter to layer
   */
  public setLayerFilter(layerId: string, filters: LayerFilter[]): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;

    layer.filters = filters;
    this.notifyListeners();
  }

  /**
   * Clear layer filters
   */
  public clearLayerFilters(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (!layer) return;

    layer.filters = [];
    this.notifyListeners();
  }

  /**
   * Get layer groups
   */
  public getGroups(): LayerGroup[] {
    return Array.from(this.groups.values());
  }

  /**
   * Toggle group visibility
   */
  public toggleGroupVisibility(groupId: string): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    group.visible = !group.visible;
    group.layers.forEach((layerId) => {
      const layer = this.layers.get(layerId);
      if (layer) layer.visible = group.visible;
    });
    this.notifyListeners();
  }

  /**
   * Toggle group collapsed state
   */
  public toggleGroupCollapsed(groupId: string): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    group.collapsed = !group.collapsed;
  }

  /**
   * Get presets
   */
  public getPresets(): LayerPreset[] {
    return Array.from(this.presets.values());
  }

  /**
   * Apply preset
   */
  public applyPreset(presetId: string): void {
    const preset = this.presets.get(presetId);
    if (!preset) return;

    // Reset all layers
    this.layers.forEach((layer) => {
      layer.visible = false;
      layer.opacity = 1;
    });

    // Apply preset settings
    preset.layers.forEach((config) => {
      const layer = this.layers.get(config.id);
      if (layer) {
        layer.visible = config.visible;
        if (config.opacity !== undefined) {
          layer.opacity = config.opacity;
        }
      }
    });

    this.activePreset = presetId;
    this.notifyListeners();
  }

  /**
   * Get active preset
   */
  public getActivePreset(): string | null {
    return this.activePreset;
  }

  /**
   * Save current state as preset
   */
  public saveAsPreset(name: string, description: string, icon: string = '📍'): LayerPreset {
    const id = `preset-custom-${Date.now()}`;
    const layers = Array.from(this.layers.values())
      .filter((l) => l.visible)
      .map((l) => ({ id: l.id, visible: true, opacity: l.opacity }));

    const preset: LayerPreset = {
      id,
      name,
      description,
      layers,
      icon,
    };

    this.presets.set(id, preset);
    return preset;
  }

  /**
   * Get layers by category
   */
  public getLayersByCategory(category: LayerCategory): MapLayer[] {
    return Array.from(this.layers.values()).filter((l) => l.category === category);
  }

  /**
   * Get layers by type
   */
  public getLayersByType(type: LayerType): MapLayer[] {
    return Array.from(this.layers.values()).filter((l) => l.type === type);
  }

  /**
   * Get feature info at point
   */
  public async getFeatureInfo(
    layerId: string,
    lat: number,
    lng: number
  ): Promise<FeatureInfo | null> {
    const layer = this.layers.get(layerId);
    if (!layer || !layer.interactive) return null;

    // Simulate feature info (in real app, would query actual data)
    return {
      layerId,
      layerName: layer.name,
      coordinates: { lat, lng },
      properties: {
        name: 'Sample Feature',
        description: 'Feature information would appear here',
        category: layer.category,
      },
      timestamp: new Date(),
    };
  }

  /**
   * Get legend for layer
   */
  public getLayerLegend(layerId: string): LayerLegend | null {
    const layer = this.layers.get(layerId);
    return layer?.legend || null;
  }

  /**
   * Bulk update layer visibility
   */
  public setMultipleLayerVisibility(layerConfigs: { id: string; visible: boolean }[]): void {
    layerConfigs.forEach((config) => {
      const layer = this.layers.get(config.id);
      if (layer) layer.visible = config.visible;
    });
    this.notifyListeners();
  }

  /**
   * Reset to defaults
   */
  public resetToDefaults(): void {
    this.layers.clear();
    this.groups.clear();
    this.activePreset = null;
    this.initializeDefaults();
    this.notifyListeners();
  }

  /**
   * Export layer configuration
   */
  public exportConfiguration(): string {
    const config = {
      layers: Array.from(this.layers.values()).map((l) => ({
        id: l.id,
        visible: l.visible,
        opacity: l.opacity,
        filters: l.filters,
      })),
      groups: Array.from(this.groups.values()),
      activePreset: this.activePreset,
    };
    return JSON.stringify(config);
  }

  /**
   * Import layer configuration
   */
  public importConfiguration(configJson: string): void {
    try {
      const config = JSON.parse(configJson);
      
      config.layers?.forEach((lc: { id: string; visible: boolean; opacity: number; filters?: LayerFilter[] }) => {
        const layer = this.layers.get(lc.id);
        if (layer) {
          layer.visible = lc.visible;
          layer.opacity = lc.opacity;
          layer.filters = lc.filters;
        }
      });

      if (config.activePreset) {
        this.activePreset = config.activePreset;
      }

      this.notifyListeners();
    } catch (error) {
      console.error('Failed to import configuration:', error);
    }
  }

  /**
   * Subscribe to layer changes
   */
  public subscribe(callback: (layers: MapLayer[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Notify listeners of changes
   */
  private notifyListeners(): void {
    const layers = this.getLayers();
    this.listeners.forEach((callback) => callback(layers));
  }
}

export const dynamicMapLayersService = DynamicMapLayersService.getInstance();
export type {
  MapLayer,
  LayerType,
  LayerCategory,
  LayerSource,
  LayerStyle,
  LayerLegend,
  LayerFilter,
  LayerGroup,
  LayerPreset,
  FeatureInfo,
};

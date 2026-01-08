/**
 * Image Recognition Service for Damage Assessment
 * AI-powered image analysis for disaster damage classification
 */

export interface DamageAnalysisResult {
  id: string;
  imageUrl: string;
  timestamp: Date;
  damageType: DamageType;
  severity: 'none' | 'minor' | 'moderate' | 'severe' | 'destroyed';
  severityScore: number; // 0-100
  confidence: number;
  detectedObjects: DetectedObject[];
  affectedArea: {
    percentage: number;
    squareMeters?: number;
  };
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  recommendations: string[];
  metadata: {
    modelVersion: string;
    processingTime: number;
    imageQuality: 'low' | 'medium' | 'high';
  };
}

export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  damageState: 'intact' | 'damaged' | 'destroyed';
}

export type DamageType = 
  | 'flood_damage'
  | 'structural_collapse'
  | 'fire_damage'
  | 'wind_damage'
  | 'earthquake_damage'
  | 'landslide'
  | 'infrastructure_damage'
  | 'vehicle_damage'
  | 'debris'
  | 'water_logging'
  | 'none';

// Simulated ML model weights for damage classification
const DAMAGE_PATTERNS: Record<DamageType, { features: string[]; baseCost: number }> = {
  flood_damage: { features: ['water', 'mud', 'debris', 'watermark'], baseCost: 50000 },
  structural_collapse: { features: ['rubble', 'collapsed', 'broken', 'crack'], baseCost: 500000 },
  fire_damage: { features: ['burn', 'char', 'smoke', 'ash'], baseCost: 200000 },
  wind_damage: { features: ['fallen', 'uprooted', 'torn', 'scattered'], baseCost: 75000 },
  earthquake_damage: { features: ['crack', 'tilt', 'collapse', 'foundation'], baseCost: 350000 },
  landslide: { features: ['soil', 'rock', 'buried', 'slope'], baseCost: 150000 },
  infrastructure_damage: { features: ['road', 'bridge', 'power', 'pipeline'], baseCost: 1000000 },
  vehicle_damage: { features: ['car', 'vehicle', 'transport', 'wreck'], baseCost: 25000 },
  debris: { features: ['debris', 'wreckage', 'fragments', 'scattered'], baseCost: 30000 },
  water_logging: { features: ['water', 'flooded', 'submerged', 'standing'], baseCost: 20000 },
  none: { features: [], baseCost: 0 },
};

class ImageRecognitionService {
  private static instance: ImageRecognitionService;
  private modelVersion = '1.0.0';
  private isModelLoaded = false;

  private constructor() {
    this.initializeModel();
  }

  public static getInstance(): ImageRecognitionService {
    if (!ImageRecognitionService.instance) {
      ImageRecognitionService.instance = new ImageRecognitionService();
    }
    return ImageRecognitionService.instance;
  }

  private async initializeModel(): Promise<void> {
    // Simulate model loading
    await new Promise(resolve => setTimeout(resolve, 200));
    this.isModelLoaded = true;
    console.log('[Image Recognition] Model loaded v' + this.modelVersion);
  }

  /**
   * Analyze image for damage assessment
   */
  public async analyzeImage(imageData: string | File): Promise<DamageAnalysisResult> {
    const startTime = Date.now();
    
    if (!this.isModelLoaded) {
      await this.initializeModel();
    }

    // Simulate image processing
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Simulated analysis results
    const damageType = this.detectDamageType();
    const severity = this.calculateSeverity(damageType);
    const severityScore = this.calculateSeverityScore(severity);
    const detectedObjects = this.detectObjects(damageType);
    const affectedArea = this.estimateAffectedArea(severityScore);
    const estimatedCost = this.estimateCost(damageType, severity, affectedArea.percentage);
    const confidence = 0.75 + Math.random() * 0.2;

    const processingTime = Date.now() - startTime;

    return {
      id: `analysis_${Date.now()}`,
      imageUrl: typeof imageData === 'string' ? imageData : URL.createObjectURL(imageData),
      timestamp: new Date(),
      damageType,
      severity,
      severityScore,
      confidence: Math.round(confidence * 100) / 100,
      detectedObjects,
      affectedArea,
      estimatedCost,
      recommendations: this.generateRecommendations(damageType, severity),
      metadata: {
        modelVersion: this.modelVersion,
        processingTime,
        imageQuality: this.assessImageQuality(),
      },
    };
  }

  /**
   * Batch analyze multiple images
   */
  public async batchAnalyze(images: (string | File)[]): Promise<DamageAnalysisResult[]> {
    return Promise.all(images.map(img => this.analyzeImage(img)));
  }

  /**
   * Detect damage type from image features
   */
  private detectDamageType(): DamageType {
    const types = Object.keys(DAMAGE_PATTERNS) as DamageType[];
    const randomIndex = Math.floor(Math.random() * (types.length - 1)); // Exclude 'none'
    return types[randomIndex];
  }

  /**
   * Calculate severity based on damage type
   */
  private calculateSeverity(damageType: DamageType): DamageAnalysisResult['severity'] {
    if (damageType === 'none') return 'none';
    
    const rand = Math.random();
    if (damageType === 'structural_collapse' || damageType === 'earthquake_damage') {
      if (rand < 0.4) return 'destroyed';
      if (rand < 0.7) return 'severe';
      return 'moderate';
    }
    
    if (rand < 0.15) return 'destroyed';
    if (rand < 0.35) return 'severe';
    if (rand < 0.6) return 'moderate';
    return 'minor';
  }

  /**
   * Calculate numeric severity score
   */
  private calculateSeverityScore(severity: DamageAnalysisResult['severity']): number {
    const scores = { none: 0, minor: 25, moderate: 50, severe: 75, destroyed: 100 };
    const base = scores[severity];
    return Math.min(100, Math.max(0, base + (Math.random() * 20 - 10)));
  }

  /**
   * Detect objects in the image
   */
  private detectObjects(damageType: DamageType): DetectedObject[] {
    const objects: DetectedObject[] = [];
    const patterns = DAMAGE_PATTERNS[damageType];
    
    // Generate 3-6 detected objects
    const count = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < count; i++) {
      const label = patterns.features[i % patterns.features.length] || 'structure';
      objects.push({
        label,
        confidence: 0.7 + Math.random() * 0.25,
        boundingBox: {
          x: Math.random() * 0.5,
          y: Math.random() * 0.5,
          width: 0.2 + Math.random() * 0.3,
          height: 0.2 + Math.random() * 0.3,
        },
        damageState: this.randomDamageState(),
      });
    }

    return objects;
  }

  private randomDamageState(): DetectedObject['damageState'] {
    const rand = Math.random();
    if (rand < 0.3) return 'intact';
    if (rand < 0.7) return 'damaged';
    return 'destroyed';
  }

  /**
   * Estimate affected area
   */
  private estimateAffectedArea(severityScore: number): DamageAnalysisResult['affectedArea'] {
    const percentage = Math.min(100, severityScore * (0.8 + Math.random() * 0.4));
    const baseArea = 100 + Math.random() * 400; // 100-500 sq meters
    
    return {
      percentage: Math.round(percentage),
      squareMeters: Math.round(baseArea * (percentage / 100)),
    };
  }

  /**
   * Estimate repair/recovery cost
   */
  private estimateCost(
    damageType: DamageType,
    severity: DamageAnalysisResult['severity'],
    affectedPercentage: number
  ): DamageAnalysisResult['estimatedCost'] {
    const baseCost = DAMAGE_PATTERNS[damageType].baseCost;
    const severityMultipliers = { none: 0, minor: 0.3, moderate: 0.6, severe: 0.85, destroyed: 1.2 };
    
    const estimated = baseCost * severityMultipliers[severity] * (affectedPercentage / 100);
    
    return {
      min: Math.round(estimated * 0.7),
      max: Math.round(estimated * 1.4),
      currency: 'INR',
    };
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(damageType: DamageType, severity: DamageAnalysisResult['severity']): string[] {
    const recommendations: string[] = [];

    // General recommendations
    if (severity === 'destroyed' || severity === 'severe') {
      recommendations.push('⚠️ Immediate evacuation recommended');
      recommendations.push('Contact emergency services');
      recommendations.push('Do not enter damaged structures');
    }

    // Type-specific recommendations
    switch (damageType) {
      case 'flood_damage':
        recommendations.push('Document all water damage for insurance');
        recommendations.push('Check for contaminated water');
        recommendations.push('Inspect electrical systems before use');
        break;
      case 'structural_collapse':
        recommendations.push('Keep safe distance from collapsed structures');
        recommendations.push('Request structural engineering assessment');
        recommendations.push('Check for gas leaks');
        break;
      case 'fire_damage':
        recommendations.push('Ensure fire is completely extinguished');
        recommendations.push('Ventilate smoke-affected areas');
        recommendations.push('Check for structural weakening');
        break;
      case 'earthquake_damage':
        recommendations.push('Be prepared for aftershocks');
        recommendations.push('Check foundation and load-bearing walls');
        recommendations.push('Inspect utility connections');
        break;
      case 'wind_damage':
        recommendations.push('Secure loose materials');
        recommendations.push('Check roof integrity');
        recommendations.push('Remove fallen trees safely');
        break;
      default:
        recommendations.push('Document all damage with photos');
        recommendations.push('Contact your insurance provider');
    }

    recommendations.push('File damage report with local authorities');
    
    return recommendations;
  }

  /**
   * Assess image quality
   */
  private assessImageQuality(): 'low' | 'medium' | 'high' {
    const rand = Math.random();
    if (rand < 0.2) return 'low';
    if (rand < 0.6) return 'medium';
    return 'high';
  }

  /**
   * Get model information
   */
  public getModelInfo(): { version: string; isLoaded: boolean; supportedTypes: DamageType[] } {
    return {
      version: this.modelVersion,
      isLoaded: this.isModelLoaded,
      supportedTypes: Object.keys(DAMAGE_PATTERNS) as DamageType[],
    };
  }
}

export const imageRecognitionService = ImageRecognitionService.getInstance();
export default imageRecognitionService;

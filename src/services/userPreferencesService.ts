/**
 * User Preferences Service
 * Comprehensive user settings and preferences management
 */

// Theme options
type ThemeMode = 'light' | 'dark' | 'system' | 'high-contrast';

// Language codes
type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'kn' | 'bn' | 'mr' | 'gu' | 'pa';

// Map style
type MapStyle = 'standard' | 'satellite' | 'terrain' | 'hybrid' | 'dark';

// Unit system
type UnitSystem = 'metric' | 'imperial';

// Date format
type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

// Time format
type TimeFormat = '12h' | '24h';

// Alert sound
type AlertSound = 'default' | 'urgent' | 'soft' | 'siren' | 'none';

// Font size
type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

// User preferences
interface UserPreferences {
  userId: string;
  general: GeneralPreferences;
  display: DisplayPreferences;
  notifications: NotificationPreferences;
  accessibility: AccessibilityPreferences;
  map: MapPreferences;
  privacy: PrivacyPreferences;
  alerts: AlertPreferences;
  emergency: EmergencyPreferences;
  data: DataPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// General preferences
interface GeneralPreferences {
  language: LanguageCode;
  timezone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  unitSystem: UnitSystem;
  currency: string;
  startPage: 'dashboard' | 'alerts' | 'map' | 'shelters';
}

// Display preferences
interface DisplayPreferences {
  theme: ThemeMode;
  fontSize: FontSize;
  compactMode: boolean;
  showAnimations: boolean;
  sidebarCollapsed: boolean;
  dashboardLayout: DashboardLayoutPreference;
  colorScheme: ColorSchemePreference;
}

// Dashboard layout preference
interface DashboardLayoutPreference {
  widgets: string[];
  columns: number;
  rowHeight: number;
}

// Color scheme preference
interface ColorSchemePreference {
  primary: string;
  secondary: string;
  accent: string;
  customColors?: Record<string, string>;
}

// Notification preferences
interface NotificationPreferences {
  enabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  categories: {
    alerts: NotificationCategorySettings;
    updates: NotificationCategorySettings;
    reminders: NotificationCategorySettings;
    system: NotificationCategorySettings;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    allowCritical: boolean;
  };
  digest: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
    dayOfWeek?: number;
  };
  sound: AlertSound;
  vibration: boolean;
}

// Notification category settings
interface NotificationCategorySettings {
  enabled: boolean;
  priority: 'all' | 'high_only' | 'critical_only';
}

// Accessibility preferences
interface AccessibilityPreferences {
  screenReader: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
  voiceCommands: boolean;
  textToSpeech: boolean;
  captions: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  focusIndicator: boolean;
}

// Map preferences
interface MapPreferences {
  defaultStyle: MapStyle;
  defaultZoom: number;
  defaultCenter?: { lat: number; lng: number };
  showTraffic: boolean;
  showShelters: boolean;
  showEvacuationRoutes: boolean;
  showAlertZones: boolean;
  showMyLocation: boolean;
  clustering: boolean;
  heatmapEnabled: boolean;
  offlineAreasDownloaded: string[];
}

// Privacy preferences
interface PrivacyPreferences {
  shareLocation: boolean;
  locationPrecision: 'exact' | 'approximate' | 'city';
  shareActivityStatus: boolean;
  showInVolunteerDirectory: boolean;
  allowAnalytics: boolean;
  allowPersonalization: boolean;
  dataRetentionDays: number;
  exportDataOnRequest: boolean;
}

// Alert preferences
interface AlertPreferences {
  alertTypes: {
    flood: boolean;
    fire: boolean;
    earthquake: boolean;
    cyclone: boolean;
    landslide: boolean;
    tsunami: boolean;
    heatwave: boolean;
    coldwave: boolean;
    airQuality: boolean;
  };
  severityThreshold: 'all' | 'medium' | 'high' | 'critical';
  radiusKm: number;
  customLocations: MonitoredLocation[];
  autoEvacuationAlerts: boolean;
  weatherAlerts: boolean;
}

// Monitored location
interface MonitoredLocation {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  radiusKm: number;
  notifyTypes: string[];
}

// Emergency preferences
interface EmergencyPreferences {
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalInfo;
  householdMembers: HouseholdMember[];
  specialNeeds: string[];
  evacuationPreferences: EvacuationPreferences;
}

// Emergency contact
interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  notifyOnEmergency: boolean;
}

// Medical info
interface MedicalInfo {
  bloodType?: string;
  allergies: string[];
  medications: string[];
  medicalConditions: string[];
  doctorContact?: string;
  insuranceInfo?: string;
}

// Household member
interface HouseholdMember {
  id: string;
  name: string;
  age: number;
  relationship: string;
  specialNeeds?: string[];
  requiresAssistance: boolean;
}

// Evacuation preferences
interface EvacuationPreferences {
  hasVehicle: boolean;
  vehicleCapacity?: number;
  needsTransportation: boolean;
  preferredShelterType: 'any' | 'school' | 'community_center' | 'hospital';
  petInfo?: {
    hasPets: boolean;
    petTypes: string[];
    count: number;
  };
}

// Data preferences
interface DataPreferences {
  autoSync: boolean;
  syncFrequency: 'realtime' | '5min' | '15min' | '30min' | 'hourly';
  offlineMode: boolean;
  cacheSize: number; // MB
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataCompression: boolean;
  lowBandwidthMode: boolean;
}

// Preference category
type PreferenceCategory = 
  | 'general'
  | 'display'
  | 'notifications'
  | 'accessibility'
  | 'map'
  | 'privacy'
  | 'alerts'
  | 'emergency'
  | 'data';

// Preference change event
interface PreferenceChangeEvent {
  userId: string;
  category: PreferenceCategory;
  key: string;
  oldValue: unknown;
  newValue: unknown;
  timestamp: Date;
}

// Default preferences
const DEFAULT_PREFERENCES: Omit<UserPreferences, 'userId' | 'createdAt' | 'updatedAt'> = {
  general: {
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    unitSystem: 'metric',
    currency: 'INR',
    startPage: 'dashboard',
  },
  display: {
    theme: 'system',
    fontSize: 'medium',
    compactMode: false,
    showAnimations: true,
    sidebarCollapsed: false,
    dashboardLayout: {
      widgets: ['alerts', 'map', 'shelters', 'resources', 'weather'],
      columns: 3,
      rowHeight: 200,
    },
    colorScheme: {
      primary: '#1976D2',
      secondary: '#424242',
      accent: '#FF9800',
    },
  },
  notifications: {
    enabled: true,
    channels: {
      push: true,
      email: true,
      sms: true,
      inApp: true,
    },
    categories: {
      alerts: { enabled: true, priority: 'all' },
      updates: { enabled: true, priority: 'high_only' },
      reminders: { enabled: true, priority: 'all' },
      system: { enabled: true, priority: 'high_only' },
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
      allowCritical: true,
    },
    digest: {
      enabled: false,
      frequency: 'daily',
      time: '09:00',
    },
    sound: 'default',
    vibration: true,
  },
  accessibility: {
    screenReader: false,
    highContrast: false,
    reduceMotion: false,
    largeText: false,
    keyboardNavigation: true,
    voiceCommands: false,
    textToSpeech: false,
    captions: false,
    colorBlindMode: 'none',
    focusIndicator: true,
  },
  map: {
    defaultStyle: 'standard',
    defaultZoom: 12,
    showTraffic: true,
    showShelters: true,
    showEvacuationRoutes: true,
    showAlertZones: true,
    showMyLocation: true,
    clustering: true,
    heatmapEnabled: false,
    offlineAreasDownloaded: [],
  },
  privacy: {
    shareLocation: true,
    locationPrecision: 'approximate',
    shareActivityStatus: false,
    showInVolunteerDirectory: false,
    allowAnalytics: true,
    allowPersonalization: true,
    dataRetentionDays: 365,
    exportDataOnRequest: true,
  },
  alerts: {
    alertTypes: {
      flood: true,
      fire: true,
      earthquake: true,
      cyclone: true,
      landslide: true,
      tsunami: true,
      heatwave: true,
      coldwave: true,
      airQuality: true,
    },
    severityThreshold: 'all',
    radiusKm: 50,
    customLocations: [],
    autoEvacuationAlerts: true,
    weatherAlerts: true,
  },
  emergency: {
    emergencyContacts: [],
    medicalInfo: {
      allergies: [],
      medications: [],
      medicalConditions: [],
    },
    householdMembers: [],
    specialNeeds: [],
    evacuationPreferences: {
      hasVehicle: false,
      needsTransportation: false,
      preferredShelterType: 'any',
    },
  },
  data: {
    autoSync: true,
    syncFrequency: '5min',
    offlineMode: false,
    cacheSize: 100,
    autoBackup: true,
    backupFrequency: 'weekly',
    dataCompression: true,
    lowBandwidthMode: false,
  },
};

// Language names
const LANGUAGE_NAMES: Record<LanguageCode, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिंदी', english: 'Hindi' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  ml: { native: 'മലയാളം', english: 'Malayalam' },
  kn: { native: 'ಕನ್ನಡ', english: 'Kannada' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  mr: { native: 'मराठी', english: 'Marathi' },
  gu: { native: 'ગુજરાતી', english: 'Gujarati' },
  pa: { native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
};

// Timezone options
const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Asia/Dhaka', label: 'Bangladesh Standard Time (BST)' },
  { value: 'Asia/Colombo', label: 'Sri Lanka Standard Time (SLST)' },
  { value: 'Asia/Kathmandu', label: 'Nepal Time (NPT)' },
  { value: 'Asia/Thimphu', label: 'Bhutan Time (BTT)' },
];

class UserPreferencesService {
  private static instance: UserPreferencesService;
  private preferences: Map<string, UserPreferences> = new Map();
  private changeHistory: PreferenceChangeEvent[] = [];
  private listeners: Map<string, ((prefs: UserPreferences) => void)[]> = new Map();

  private constructor() {
    // Initialize with sample user
    this.initializeSampleUser();
  }

  public static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    return UserPreferencesService.instance;
  }

  /**
   * Initialize sample user
   */
  private initializeSampleUser(): void {
    const sampleUser = this.createUserPreferences('sample-user');
    this.preferences.set(sampleUser.userId, sampleUser);
  }

  /**
   * Create user preferences
   */
  public createUserPreferences(userId: string): UserPreferences {
    const now = new Date();
    const preferences: UserPreferences = {
      userId,
      ...JSON.parse(JSON.stringify(DEFAULT_PREFERENCES)),
      createdAt: now,
      updatedAt: now,
    };
    this.preferences.set(userId, preferences);
    return preferences;
  }

  /**
   * Get user preferences
   */
  public getPreferences(userId: string): UserPreferences {
    let prefs = this.preferences.get(userId);
    if (!prefs) {
      prefs = this.createUserPreferences(userId);
    }
    return prefs;
  }

  /**
   * Update preferences
   */
  public updatePreferences<K extends PreferenceCategory>(
    userId: string,
    category: K,
    updates: Partial<UserPreferences[K]>
  ): UserPreferences {
    const prefs = this.getPreferences(userId);
    const categoryPrefs = prefs[category];

    // Track changes
    for (const [key, newValue] of Object.entries(updates)) {
      const oldValue = (categoryPrefs as any)[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        this.recordChange(userId, category, key, oldValue, newValue);
      }
    }

    Object.assign(categoryPrefs, updates);
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);

    return prefs;
  }

  /**
   * Update single preference
   */
  public updateSinglePreference<
    K extends PreferenceCategory,
    P extends keyof UserPreferences[K]
  >(
    userId: string,
    category: K,
    key: P,
    value: UserPreferences[K][P]
  ): UserPreferences {
    return this.updatePreferences(userId, category, { [key]: value } as any);
  }

  /**
   * Reset category to defaults
   */
  public resetCategory<K extends PreferenceCategory>(
    userId: string,
    category: K
  ): UserPreferences {
    const prefs = this.getPreferences(userId);
    const defaultCategory = DEFAULT_PREFERENCES[category];
    (prefs as any)[category] = JSON.parse(JSON.stringify(defaultCategory));
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Reset all preferences
   */
  public resetAllPreferences(userId: string): UserPreferences {
    const prefs = this.createUserPreferences(userId);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Set theme
   */
  public setTheme(userId: string, theme: ThemeMode): UserPreferences {
    return this.updateSinglePreference(userId, 'display', 'theme', theme);
  }

  /**
   * Set language
   */
  public setLanguage(userId: string, language: LanguageCode): UserPreferences {
    return this.updateSinglePreference(userId, 'general', 'language', language);
  }

  /**
   * Set notification settings
   */
  public setNotificationEnabled(userId: string, enabled: boolean): UserPreferences {
    return this.updateSinglePreference(userId, 'notifications', 'enabled', enabled);
  }

  /**
   * Add emergency contact
   */
  public addEmergencyContact(userId: string, contact: Omit<EmergencyContact, 'id'>): UserPreferences {
    const prefs = this.getPreferences(userId);
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact-${Date.now()}`,
    };
    prefs.emergency.emergencyContacts.push(newContact);
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Remove emergency contact
   */
  public removeEmergencyContact(userId: string, contactId: string): UserPreferences {
    const prefs = this.getPreferences(userId);
    prefs.emergency.emergencyContacts = prefs.emergency.emergencyContacts.filter(
      (c) => c.id !== contactId
    );
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Add monitored location
   */
  public addMonitoredLocation(userId: string, location: Omit<MonitoredLocation, 'id'>): UserPreferences {
    const prefs = this.getPreferences(userId);
    const newLocation: MonitoredLocation = {
      ...location,
      id: `loc-${Date.now()}`,
    };
    prefs.alerts.customLocations.push(newLocation);
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Remove monitored location
   */
  public removeMonitoredLocation(userId: string, locationId: string): UserPreferences {
    const prefs = this.getPreferences(userId);
    prefs.alerts.customLocations = prefs.alerts.customLocations.filter(
      (l) => l.id !== locationId
    );
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Add household member
   */
  public addHouseholdMember(userId: string, member: Omit<HouseholdMember, 'id'>): UserPreferences {
    const prefs = this.getPreferences(userId);
    const newMember: HouseholdMember = {
      ...member,
      id: `member-${Date.now()}`,
    };
    prefs.emergency.householdMembers.push(newMember);
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Update medical info
   */
  public updateMedicalInfo(userId: string, info: Partial<MedicalInfo>): UserPreferences {
    const prefs = this.getPreferences(userId);
    Object.assign(prefs.emergency.medicalInfo, info);
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Set quiet hours
   */
  public setQuietHours(
    userId: string,
    enabled: boolean,
    start?: string,
    end?: string
  ): UserPreferences {
    return this.updatePreferences(userId, 'notifications', {
      quietHours: {
        enabled,
        start: start || '22:00',
        end: end || '07:00',
        allowCritical: true,
      },
    });
  }

  /**
   * Toggle alert type
   */
  public toggleAlertType(userId: string, alertType: keyof AlertPreferences['alertTypes'], enabled: boolean): UserPreferences {
    const prefs = this.getPreferences(userId);
    prefs.alerts.alertTypes[alertType] = enabled;
    prefs.updatedAt = new Date();
    this.preferences.set(userId, prefs);
    this.notifyListeners(userId, prefs);
    return prefs;
  }

  /**
   * Set accessibility option
   */
  public setAccessibilityOption<K extends keyof AccessibilityPreferences>(
    userId: string,
    option: K,
    value: AccessibilityPreferences[K]
  ): UserPreferences {
    return this.updateSinglePreference(userId, 'accessibility', option, value);
  }

  /**
   * Export preferences
   */
  public exportPreferences(userId: string): string {
    const prefs = this.getPreferences(userId);
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      preferences: prefs,
    }, null, 2);
  }

  /**
   * Import preferences
   */
  public importPreferences(userId: string, data: string): UserPreferences {
    try {
      const imported = JSON.parse(data);
      const prefs = this.getPreferences(userId);
      
      // Merge imported preferences
      const categories: PreferenceCategory[] = [
        'general', 'display', 'notifications', 'accessibility',
        'map', 'privacy', 'alerts', 'emergency', 'data'
      ];

      for (const category of categories) {
        if (imported.preferences[category]) {
          Object.assign(prefs[category], imported.preferences[category]);
        }
      }

      prefs.updatedAt = new Date();
      this.preferences.set(userId, prefs);
      this.notifyListeners(userId, prefs);
      return prefs;
    } catch {
      throw new Error('Invalid preferences data');
    }
  }

  /**
   * Get change history
   */
  public getChangeHistory(userId: string, limit?: number): PreferenceChangeEvent[] {
    const userHistory = this.changeHistory
      .filter((h) => h.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? userHistory.slice(0, limit) : userHistory;
  }

  /**
   * Record preference change
   */
  private recordChange(
    userId: string,
    category: PreferenceCategory,
    key: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    this.changeHistory.push({
      userId,
      category,
      key,
      oldValue,
      newValue,
      timestamp: new Date(),
    });

    // Keep only last 1000 changes per user
    const userChanges = this.changeHistory.filter((h) => h.userId === userId);
    if (userChanges.length > 1000) {
      const excess = userChanges.length - 1000;
      this.changeHistory = this.changeHistory.filter(
        (h) => h.userId !== userId || userChanges.indexOf(h) >= excess
      );
    }
  }

  /**
   * Get available languages
   */
  public getAvailableLanguages(): { code: LanguageCode; native: string; english: string }[] {
    return Object.entries(LANGUAGE_NAMES).map(([code, names]) => ({
      code: code as LanguageCode,
      ...names,
    }));
  }

  /**
   * Get available timezones
   */
  public getAvailableTimezones(): { value: string; label: string }[] {
    return TIMEZONE_OPTIONS;
  }

  /**
   * Get default preferences
   */
  public getDefaultPreferences(): typeof DEFAULT_PREFERENCES {
    return JSON.parse(JSON.stringify(DEFAULT_PREFERENCES));
  }

  /**
   * Validate preferences
   */
  public validatePreferences(prefs: Partial<UserPreferences>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate alerts
    if (prefs.alerts) {
      if (prefs.alerts.radiusKm && (prefs.alerts.radiusKm as unknown as number) < 1) {
        errors.push('Alert radius must be at least 1 km');
      }
    }

    // Validate notifications
    if (prefs.notifications?.quietHours) {
      const { start, end } = prefs.notifications.quietHours;
      if (start && end && start >= end) {
        errors.push('Quiet hours start time must be before end time');
      }
    }

    // Validate emergency contacts
    if (prefs.emergency?.emergencyContacts) {
      const primaryCount = prefs.emergency.emergencyContacts.filter((c) => c.isPrimary).length;
      if (primaryCount > 1) {
        errors.push('Only one emergency contact can be primary');
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Apply theme to document
   */
  public applyTheme(theme: ThemeMode): void {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }

  /**
   * Get computed theme
   */
  public getComputedTheme(theme: ThemeMode): 'light' | 'dark' | 'high-contrast' {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme === 'high-contrast' ? 'high-contrast' : theme;
  }

  /**
   * Subscribe to preference changes
   */
  public subscribe(userId: string, callback: (prefs: UserPreferences) => void): () => void {
    const userListeners = this.listeners.get(userId) || [];
    userListeners.push(callback);
    this.listeners.set(userId, userListeners);

    return () => {
      const listeners = this.listeners.get(userId) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(userId, listeners);
      }
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(userId: string, prefs: UserPreferences): void {
    const listeners = this.listeners.get(userId) || [];
    listeners.forEach((callback) => callback(prefs));
  }

  /**
   * Check if notifications are enabled for category
   */
  public areNotificationsEnabled(
    userId: string,
    category: keyof NotificationPreferences['categories']
  ): boolean {
    const prefs = this.getPreferences(userId);
    return prefs.notifications.enabled && prefs.notifications.categories[category].enabled;
  }

  /**
   * Get effective notification channels
   */
  public getEffectiveNotificationChannels(userId: string): string[] {
    const prefs = this.getPreferences(userId);
    const channels: string[] = [];
    
    if (prefs.notifications.channels.push) channels.push('push');
    if (prefs.notifications.channels.email) channels.push('email');
    if (prefs.notifications.channels.sms) channels.push('sms');
    if (prefs.notifications.channels.inApp) channels.push('in_app');
    
    return channels;
  }

  /**
   * Is in quiet hours
   */
  public isInQuietHours(userId: string): boolean {
    const prefs = this.getPreferences(userId);
    
    if (!prefs.notifications.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const { start, end } = prefs.notifications.quietHours;
    
    if (start < end) {
      return currentTime >= start && currentTime <= end;
    } else {
      // Handles overnight quiet hours (e.g., 22:00 to 07:00)
      return currentTime >= start || currentTime <= end;
    }
  }

  /**
   * Format date according to user preferences
   */
  public formatDate(userId: string, date: Date): string {
    const prefs = this.getPreferences(userId);
    const format = prefs.general.dateFormat;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return date.toLocaleDateString();
    }
  }

  /**
   * Format time according to user preferences
   */
  public formatTime(userId: string, date: Date): string {
    const prefs = this.getPreferences(userId);
    const format = prefs.general.timeFormat;
    
    if (format === '24h') {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  }
}

export const userPreferencesService = UserPreferencesService.getInstance();
export type {
  ThemeMode,
  LanguageCode,
  MapStyle,
  UnitSystem,
  DateFormat,
  TimeFormat,
  AlertSound,
  FontSize,
  UserPreferences,
  GeneralPreferences,
  DisplayPreferences,
  DashboardLayoutPreference,
  ColorSchemePreference,
  NotificationPreferences,
  NotificationCategorySettings,
  AccessibilityPreferences,
  MapPreferences,
  PrivacyPreferences,
  AlertPreferences,
  MonitoredLocation,
  EmergencyPreferences,
  EmergencyContact,
  MedicalInfo,
  HouseholdMember,
  EvacuationPreferences,
  DataPreferences,
  PreferenceCategory,
  PreferenceChangeEvent,
};

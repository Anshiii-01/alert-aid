/**
 * Accessibility Service
 * WCAG compliance, screen reader support, and accessibility features for disaster app
 */

// Accessibility level
type AccessibilityLevel = 'A' | 'AA' | 'AAA';

// Accessibility category
type AccessibilityCategory = 'perceivable' | 'operable' | 'understandable' | 'robust';

// Issue severity
type IssueSeverity = 'critical' | 'major' | 'minor' | 'info';

// Issue status
type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'wont_fix' | 'false_positive';

// Disability type
type DisabilityType = 'visual' | 'auditory' | 'motor' | 'cognitive' | 'speech' | 'neurological';

// Assistive technology
type AssistiveTechnology = 'screen_reader' | 'magnifier' | 'voice_control' | 'switch_device' | 'braille_display' | 'eye_tracker';

// Color blindness type
type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

// User accessibility settings
interface AccessibilitySettings {
  userId: string;
  highContrast: boolean;
  largeText: boolean;
  textScale: number;
  reduceMotion: boolean;
  reduceTransparency: boolean;
  screenReader: boolean;
  voiceOver: boolean;
  colorBlindnessMode?: ColorBlindnessType;
  monochrome: boolean;
  captions: boolean;
  audioDescriptions: boolean;
  keyboardNavigation: boolean;
  focusIndicator: 'default' | 'enhanced' | 'custom';
  cursorSize: 'normal' | 'large' | 'extra_large';
  hapticFeedback: boolean;
  soundEffects: boolean;
  readAloud: boolean;
  readAloudSpeed: number;
  signLanguage: boolean;
  simplifiedUI: boolean;
  dyslexiaFont: boolean;
  lineSpacing: number;
  wordSpacing: number;
  customColors?: {
    background: string;
    foreground: string;
    accent: string;
    link: string;
    error: string;
    success: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// WCAG guideline
interface WCAGGuideline {
  id: string;
  number: string;
  title: string;
  description: string;
  level: AccessibilityLevel;
  category: AccessibilityCategory;
  successCriteria: SuccessCriterion[];
  techniques: Technique[];
  url: string;
}

// Success criterion
interface SuccessCriterion {
  id: string;
  number: string;
  title: string;
  description: string;
  level: AccessibilityLevel;
  howToMeet: string;
  examples: string[];
}

// Technique
interface Technique {
  id: string;
  title: string;
  description: string;
  type: 'sufficient' | 'advisory' | 'failure';
  code?: string;
}

// Accessibility issue
interface AccessibilityIssue {
  id: string;
  guidelineId: string;
  criterionId?: string;
  severity: IssueSeverity;
  status: IssueStatus;
  title: string;
  description: string;
  element?: string;
  selector?: string;
  screenshot?: string;
  recommendation: string;
  affectedDisabilities: DisabilityType[];
  wcagLevel: AccessibilityLevel;
  impact: string;
  howToFix: string;
  codeExample?: string;
  reportedBy: string;
  assignedTo?: string;
  pageUrl?: string;
  component?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

// Accessibility audit
interface AccessibilityAudit {
  id: string;
  name: string;
  description?: string;
  targetLevel: AccessibilityLevel;
  scope: {
    pages?: string[];
    components?: string[];
    includeAll: boolean;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  results?: AuditResult;
  automatedChecks: number;
  manualChecks: number;
  auditedBy: string;
  startedAt?: Date;
  completedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
}

// Audit result
interface AuditResult {
  totalIssues: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  infoIssues: number;
  passedChecks: number;
  failedChecks: number;
  notApplicable: number;
  complianceScore: number;
  levelACompliance: number;
  levelAACompliance: number;
  levelAAACompliance: number;
  issuesByCategory: Record<AccessibilityCategory, number>;
  issuesByDisability: Record<DisabilityType, number>;
  recommendations: string[];
}

// Keyboard shortcut
interface KeyboardShortcut {
  id: string;
  key: string;
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  action: string;
  description: string;
  category: string;
  isGlobal: boolean;
  isCustomizable: boolean;
  isEnabled: boolean;
}

// Skip link
interface SkipLink {
  id: string;
  label: string;
  targetId: string;
  order: number;
  isVisible: boolean;
}

// Focus trap
interface FocusTrap {
  id: string;
  containerId: string;
  initialFocusId?: string;
  returnFocusId?: string;
  isActive: boolean;
  escapeDeactivates: boolean;
  clickOutsideDeactivates: boolean;
}

// ARIA landmark
interface ARIALandmark {
  id: string;
  role: 'banner' | 'navigation' | 'main' | 'complementary' | 'contentinfo' | 'search' | 'form' | 'region';
  label: string;
  selector: string;
  order: number;
}

// Live region
interface LiveRegion {
  id: string;
  type: 'polite' | 'assertive' | 'off';
  atomic: boolean;
  relevant: ('additions' | 'removals' | 'text' | 'all')[];
  label: string;
  selector: string;
}

// Text alternative
interface TextAlternative {
  id: string;
  elementType: 'image' | 'video' | 'audio' | 'icon' | 'chart' | 'diagram';
  elementId: string;
  altText: string;
  longDescription?: string;
  transcription?: string;
  audioDescription?: string;
  isDecorative: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Color contrast result
interface ColorContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesLargeTextAA: boolean;
  passesLargeTextAAA: boolean;
  recommendation?: string;
}

// Reading order element
interface ReadingOrderElement {
  id: string;
  selector: string;
  order: number;
  label: string;
  isInteractive: boolean;
}

// Accessibility announcement
interface AccessibilityAnnouncement {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: Date;
  source: string;
}

// Screen reader hint
interface ScreenReaderHint {
  elementId: string;
  hint: string;
  label?: string;
  role?: string;
  state?: Record<string, boolean>;
}

// Accessibility testing profile
interface AccessibilityTestingProfile {
  id: string;
  name: string;
  description: string;
  disabilityTypes: DisabilityType[];
  assistiveTechnologies: AssistiveTechnology[];
  settings: Partial<AccessibilitySettings>;
  testScenarios: TestScenario[];
}

// Test scenario
interface TestScenario {
  id: string;
  name: string;
  description: string;
  steps: string[];
  expectedOutcome: string;
  actualOutcome?: string;
  passed?: boolean;
}

// Accessibility compliance report
interface ComplianceReport {
  id: string;
  auditId: string;
  generatedAt: Date;
  targetLevel: AccessibilityLevel;
  overallCompliance: number;
  executiveSummary: string;
  findings: {
    category: AccessibilityCategory;
    compliance: number;
    issues: number;
    criticalIssues: number;
  }[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    description: string;
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
  }[];
  timeline: {
    milestone: string;
    targetDate: Date;
    items: string[];
  }[];
}

class AccessibilityService {
  private static instance: AccessibilityService;
  private userSettings: Map<string, AccessibilitySettings> = new Map();
  private guidelines: Map<string, WCAGGuideline> = new Map();
  private issues: Map<string, AccessibilityIssue> = new Map();
  private audits: Map<string, AccessibilityAudit> = new Map();
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private skipLinks: SkipLink[] = [];
  private focusTraps: Map<string, FocusTrap> = new Map();
  private landmarks: ARIALandmark[] = [];
  private liveRegions: Map<string, LiveRegion> = new Map();
  private textAlternatives: Map<string, TextAlternative> = new Map();
  private testingProfiles: Map<string, AccessibilityTestingProfile> = new Map();
  private announcements: AccessibilityAnnouncement[] = [];
  private screenReaderHints: Map<string, ScreenReaderHint> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize WCAG guidelines
    const guidelinesData: Omit<WCAGGuideline, 'successCriteria' | 'techniques'>[] = [
      { id: 'wcag-1.1', number: '1.1', title: 'Text Alternatives', description: 'Provide text alternatives for non-text content', level: 'A', category: 'perceivable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/text-alternatives' },
      { id: 'wcag-1.2', number: '1.2', title: 'Time-based Media', description: 'Provide alternatives for time-based media', level: 'A', category: 'perceivable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/time-based-media' },
      { id: 'wcag-1.3', number: '1.3', title: 'Adaptable', description: 'Create content that can be presented in different ways', level: 'A', category: 'perceivable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/adaptable' },
      { id: 'wcag-1.4', number: '1.4', title: 'Distinguishable', description: 'Make it easier for users to see and hear content', level: 'AA', category: 'perceivable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/distinguishable' },
      { id: 'wcag-2.1', number: '2.1', title: 'Keyboard Accessible', description: 'Make all functionality available from a keyboard', level: 'A', category: 'operable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard-accessible' },
      { id: 'wcag-2.2', number: '2.2', title: 'Enough Time', description: 'Provide users enough time to read and use content', level: 'A', category: 'operable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/enough-time' },
      { id: 'wcag-2.3', number: '2.3', title: 'Seizures and Physical Reactions', description: 'Do not design content that causes seizures', level: 'A', category: 'operable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/seizures-and-physical-reactions' },
      { id: 'wcag-2.4', number: '2.4', title: 'Navigable', description: 'Provide ways to help users navigate and find content', level: 'A', category: 'operable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/navigable' },
      { id: 'wcag-2.5', number: '2.5', title: 'Input Modalities', description: 'Make it easier for users to operate functionality', level: 'A', category: 'operable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/input-modalities' },
      { id: 'wcag-3.1', number: '3.1', title: 'Readable', description: 'Make text content readable and understandable', level: 'A', category: 'understandable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/readable' },
      { id: 'wcag-3.2', number: '3.2', title: 'Predictable', description: 'Make web pages appear and operate in predictable ways', level: 'A', category: 'understandable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/predictable' },
      { id: 'wcag-3.3', number: '3.3', title: 'Input Assistance', description: 'Help users avoid and correct mistakes', level: 'A', category: 'understandable', url: 'https://www.w3.org/WAI/WCAG21/Understanding/input-assistance' },
      { id: 'wcag-4.1', number: '4.1', title: 'Compatible', description: 'Maximize compatibility with assistive technologies', level: 'A', category: 'robust', url: 'https://www.w3.org/WAI/WCAG21/Understanding/compatible' },
    ];

    guidelinesData.forEach((g) => {
      this.guidelines.set(g.id, {
        ...g,
        successCriteria: [],
        techniques: [],
      });
    });

    // Initialize keyboard shortcuts
    const shortcutsData = [
      { key: '/', modifiers: [], action: 'search', description: 'Open search', category: 'navigation', isGlobal: true },
      { key: 'Escape', modifiers: [], action: 'close', description: 'Close modal or dialog', category: 'navigation', isGlobal: true },
      { key: 'h', modifiers: ['alt'], action: 'home', description: 'Go to home page', category: 'navigation', isGlobal: true },
      { key: 'a', modifiers: ['alt'], action: 'alerts', description: 'View alerts', category: 'navigation', isGlobal: true },
      { key: 's', modifiers: ['alt'], action: 'shelters', description: 'Find shelters', category: 'navigation', isGlobal: true },
      { key: 'e', modifiers: ['alt'], action: 'emergency', description: 'Emergency SOS', category: 'emergency', isGlobal: true },
      { key: 'm', modifiers: ['alt'], action: 'map', description: 'Open map', category: 'navigation', isGlobal: true },
      { key: 'p', modifiers: ['alt'], action: 'profile', description: 'Open profile', category: 'navigation', isGlobal: true },
      { key: 'n', modifiers: ['alt'], action: 'notifications', description: 'View notifications', category: 'navigation', isGlobal: true },
      { key: '?', modifiers: ['shift'], action: 'shortcuts', description: 'Show keyboard shortcuts', category: 'help', isGlobal: true },
      { key: 'Tab', modifiers: [], action: 'next_focus', description: 'Move to next focusable element', category: 'focus', isGlobal: false },
      { key: 'Tab', modifiers: ['shift'], action: 'prev_focus', description: 'Move to previous focusable element', category: 'focus', isGlobal: false },
      { key: 'Enter', modifiers: [], action: 'activate', description: 'Activate current element', category: 'interaction', isGlobal: false },
      { key: ' ', modifiers: [], action: 'toggle', description: 'Toggle checkbox or button', category: 'interaction', isGlobal: false },
      { key: 'ArrowDown', modifiers: [], action: 'next_item', description: 'Move to next item in list', category: 'list', isGlobal: false },
      { key: 'ArrowUp', modifiers: [], action: 'prev_item', description: 'Move to previous item in list', category: 'list', isGlobal: false },
    ];

    shortcutsData.forEach((s, index) => {
      const shortcut: KeyboardShortcut = {
        id: `shortcut-${(index + 1).toString().padStart(4, '0')}`,
        key: s.key,
        modifiers: s.modifiers as ('ctrl' | 'alt' | 'shift' | 'meta')[],
        action: s.action,
        description: s.description,
        category: s.category,
        isGlobal: s.isGlobal,
        isCustomizable: true,
        isEnabled: true,
      };
      this.shortcuts.set(shortcut.id, shortcut);
    });

    // Initialize skip links
    this.skipLinks = [
      { id: 'skip-1', label: 'Skip to main content', targetId: 'main-content', order: 1, isVisible: true },
      { id: 'skip-2', label: 'Skip to navigation', targetId: 'main-navigation', order: 2, isVisible: true },
      { id: 'skip-3', label: 'Skip to alerts', targetId: 'alerts-section', order: 3, isVisible: true },
      { id: 'skip-4', label: 'Skip to search', targetId: 'search-input', order: 4, isVisible: true },
      { id: 'skip-5', label: 'Skip to footer', targetId: 'footer', order: 5, isVisible: true },
    ];

    // Initialize ARIA landmarks
    this.landmarks = [
      { id: 'landmark-1', role: 'banner', label: 'Site header', selector: 'header', order: 1 },
      { id: 'landmark-2', role: 'navigation', label: 'Main navigation', selector: 'nav[aria-label="Main"]', order: 2 },
      { id: 'landmark-3', role: 'search', label: 'Search', selector: 'form[role="search"]', order: 3 },
      { id: 'landmark-4', role: 'main', label: 'Main content', selector: 'main', order: 4 },
      { id: 'landmark-5', role: 'complementary', label: 'Sidebar', selector: 'aside', order: 5 },
      { id: 'landmark-6', role: 'contentinfo', label: 'Site footer', selector: 'footer', order: 6 },
    ];

    // Initialize live regions
    const liveRegionsData = [
      { id: 'live-1', type: 'assertive' as const, label: 'Emergency alerts', selector: '#emergency-alerts', atomic: true, relevant: ['additions' as const, 'text' as const] },
      { id: 'live-2', type: 'polite' as const, label: 'Notifications', selector: '#notifications', atomic: false, relevant: ['additions' as const] },
      { id: 'live-3', type: 'polite' as const, label: 'Status updates', selector: '#status-updates', atomic: true, relevant: ['text' as const] },
      { id: 'live-4', type: 'assertive' as const, label: 'Form errors', selector: '#form-errors', atomic: true, relevant: ['additions' as const, 'text' as const] },
    ];

    liveRegionsData.forEach((lr) => {
      this.liveRegions.set(lr.id, lr);
    });

    // Initialize accessibility issues
    const issuesData = [
      { guidelineId: 'wcag-1.1', severity: 'critical' as IssueSeverity, title: 'Images missing alt text', description: 'Several images on the alerts page are missing alt text', recommendation: 'Add descriptive alt text to all informative images', affectedDisabilities: ['visual' as DisabilityType], wcagLevel: 'A' as AccessibilityLevel },
      { guidelineId: 'wcag-1.4', severity: 'major' as IssueSeverity, title: 'Low color contrast on buttons', description: 'Button text does not meet WCAG AA contrast requirements', recommendation: 'Increase contrast ratio to at least 4.5:1', affectedDisabilities: ['visual' as DisabilityType], wcagLevel: 'AA' as AccessibilityLevel },
      { guidelineId: 'wcag-2.1', severity: 'critical' as IssueSeverity, title: 'Dropdown menu not keyboard accessible', description: 'Users cannot navigate dropdown menus using keyboard only', recommendation: 'Implement proper keyboard navigation with arrow keys', affectedDisabilities: ['motor' as DisabilityType, 'visual' as DisabilityType], wcagLevel: 'A' as AccessibilityLevel },
      { guidelineId: 'wcag-2.4', severity: 'major' as IssueSeverity, title: 'Missing focus indicators', description: 'Focus state is not visible on interactive elements', recommendation: 'Add visible focus indicators with sufficient contrast', affectedDisabilities: ['motor' as DisabilityType, 'visual' as DisabilityType], wcagLevel: 'AA' as AccessibilityLevel },
      { guidelineId: 'wcag-3.3', severity: 'major' as IssueSeverity, title: 'Form errors not announced', description: 'Screen readers do not announce form validation errors', recommendation: 'Use aria-live regions for error announcements', affectedDisabilities: ['visual' as DisabilityType], wcagLevel: 'A' as AccessibilityLevel },
    ];

    issuesData.forEach((issue, index) => {
      const accessibilityIssue: AccessibilityIssue = {
        id: `issue-${(index + 1).toString().padStart(6, '0')}`,
        guidelineId: issue.guidelineId,
        severity: issue.severity,
        status: 'open',
        title: issue.title,
        description: issue.description,
        recommendation: issue.recommendation,
        affectedDisabilities: issue.affectedDisabilities,
        wcagLevel: issue.wcagLevel,
        impact: issue.severity === 'critical' ? 'Prevents access for some users' : 'Causes difficulty for some users',
        howToFix: issue.recommendation,
        reportedBy: 'accessibility-audit',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.issues.set(accessibilityIssue.id, accessibilityIssue);
    });

    // Initialize testing profiles
    const profilesData = [
      {
        id: 'profile-1',
        name: 'Screen Reader User',
        description: 'Testing profile for blind users using screen readers',
        disabilityTypes: ['visual' as DisabilityType],
        assistiveTechnologies: ['screen_reader' as AssistiveTechnology],
        settings: { screenReader: true, reduceMotion: true, highContrast: false },
      },
      {
        id: 'profile-2',
        name: 'Low Vision User',
        description: 'Testing profile for users with low vision',
        disabilityTypes: ['visual' as DisabilityType],
        assistiveTechnologies: ['magnifier' as AssistiveTechnology],
        settings: { largeText: true, textScale: 2, highContrast: true },
      },
      {
        id: 'profile-3',
        name: 'Keyboard Only User',
        description: 'Testing profile for users who cannot use a mouse',
        disabilityTypes: ['motor' as DisabilityType],
        assistiveTechnologies: ['switch_device' as AssistiveTechnology],
        settings: { keyboardNavigation: true, focusIndicator: 'enhanced' as const },
      },
      {
        id: 'profile-4',
        name: 'Color Blind User',
        description: 'Testing profile for users with color blindness',
        disabilityTypes: ['visual' as DisabilityType],
        assistiveTechnologies: [],
        settings: { colorBlindnessMode: 'deuteranopia' as ColorBlindnessType },
      },
      {
        id: 'profile-5',
        name: 'Cognitive Accessibility',
        description: 'Testing profile for users with cognitive disabilities',
        disabilityTypes: ['cognitive' as DisabilityType],
        assistiveTechnologies: [],
        settings: { simplifiedUI: true, reduceMotion: true, dyslexiaFont: true },
      },
    ];

    profilesData.forEach((p) => {
      this.testingProfiles.set(p.id, {
        ...p,
        testScenarios: [],
      });
    });

    // Initialize user settings
    for (let i = 1; i <= 20; i++) {
      const settings: AccessibilitySettings = {
        userId: `user-${i}`,
        highContrast: Math.random() > 0.8,
        largeText: Math.random() > 0.7,
        textScale: 1 + Math.random() * 0.5,
        reduceMotion: Math.random() > 0.6,
        reduceTransparency: Math.random() > 0.8,
        screenReader: Math.random() > 0.9,
        voiceOver: Math.random() > 0.9,
        monochrome: false,
        captions: Math.random() > 0.7,
        audioDescriptions: Math.random() > 0.8,
        keyboardNavigation: Math.random() > 0.7,
        focusIndicator: 'default',
        cursorSize: 'normal',
        hapticFeedback: true,
        soundEffects: true,
        readAloud: Math.random() > 0.8,
        readAloudSpeed: 1,
        signLanguage: false,
        simplifiedUI: Math.random() > 0.9,
        dyslexiaFont: Math.random() > 0.9,
        lineSpacing: 1.5,
        wordSpacing: 1,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.userSettings.set(settings.userId, settings);
    }
  }

  /**
   * Get user settings
   */
  public getUserSettings(userId: string): AccessibilitySettings {
    return (
      this.userSettings.get(userId) || {
        userId,
        highContrast: false,
        largeText: false,
        textScale: 1,
        reduceMotion: false,
        reduceTransparency: false,
        screenReader: false,
        voiceOver: false,
        monochrome: false,
        captions: false,
        audioDescriptions: false,
        keyboardNavigation: false,
        focusIndicator: 'default',
        cursorSize: 'normal',
        hapticFeedback: true,
        soundEffects: true,
        readAloud: false,
        readAloudSpeed: 1,
        signLanguage: false,
        simplifiedUI: false,
        dyslexiaFont: false,
        lineSpacing: 1.5,
        wordSpacing: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  }

  /**
   * Update user settings
   */
  public updateUserSettings(userId: string, settings: Partial<AccessibilitySettings>): AccessibilitySettings {
    const existing = this.getUserSettings(userId);
    const updated: AccessibilitySettings = {
      ...existing,
      ...settings,
      userId,
      updatedAt: new Date(),
    };
    this.userSettings.set(userId, updated);
    this.emit('settings_updated', { userId, settings: updated });
    return updated;
  }

  /**
   * Check color contrast
   */
  public checkColorContrast(foreground: string, background: string): ColorContrastResult {
    const fgLuminance = this.getLuminance(foreground);
    const bgLuminance = this.getLuminance(background);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
      foreground,
      background,
      ratio: Math.round(ratio * 100) / 100,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      passesLargeTextAA: ratio >= 3,
      passesLargeTextAAA: ratio >= 4.5,
      recommendation: ratio < 4.5 ? 'Increase contrast by darkening foreground or lightening background' : undefined,
    };
  }

  /**
   * Get luminance
   */
  private getLuminance(color: string): number {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Announce message
   */
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite', source: string = 'system'): void {
    const announcement: AccessibilityAnnouncement = {
      id: `announce-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      message,
      priority,
      timestamp: new Date(),
      source,
    };
    this.announcements.push(announcement);
    if (this.announcements.length > 100) {
      this.announcements = this.announcements.slice(-100);
    }
    this.emit('announcement', announcement);
  }

  /**
   * Get keyboard shortcuts
   */
  public getKeyboardShortcuts(category?: string): KeyboardShortcut[] {
    let shortcuts = Array.from(this.shortcuts.values());
    if (category) {
      shortcuts = shortcuts.filter((s) => s.category === category);
    }
    return shortcuts.filter((s) => s.isEnabled);
  }

  /**
   * Get skip links
   */
  public getSkipLinks(): SkipLink[] {
    return this.skipLinks.filter((s) => s.isVisible).sort((a, b) => a.order - b.order);
  }

  /**
   * Get ARIA landmarks
   */
  public getARIALandmarks(): ARIALandmark[] {
    return this.landmarks.sort((a, b) => a.order - b.order);
  }

  /**
   * Get live regions
   */
  public getLiveRegions(): LiveRegion[] {
    return Array.from(this.liveRegions.values());
  }

  /**
   * Get accessibility issues
   */
  public getIssues(filters?: { severity?: IssueSeverity; status?: IssueStatus; guidelineId?: string }): AccessibilityIssue[] {
    let issues = Array.from(this.issues.values());

    if (filters?.severity) {
      issues = issues.filter((i) => i.severity === filters.severity);
    }
    if (filters?.status) {
      issues = issues.filter((i) => i.status === filters.status);
    }
    if (filters?.guidelineId) {
      issues = issues.filter((i) => i.guidelineId === filters.guidelineId);
    }

    return issues.sort((a, b) => {
      const severityOrder = { critical: 0, major: 1, minor: 2, info: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Report issue
   */
  public reportIssue(data: {
    guidelineId: string;
    severity: IssueSeverity;
    title: string;
    description: string;
    recommendation: string;
    affectedDisabilities: DisabilityType[];
    wcagLevel: AccessibilityLevel;
    reportedBy: string;
    element?: string;
    selector?: string;
    pageUrl?: string;
  }): AccessibilityIssue {
    const issue: AccessibilityIssue = {
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      ...data,
      status: 'open',
      impact: data.severity === 'critical' ? 'Prevents access for some users' : 'Causes difficulty for some users',
      howToFix: data.recommendation,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.issues.set(issue.id, issue);
    this.emit('issue_reported', issue);
    return issue;
  }

  /**
   * Update issue status
   */
  public updateIssueStatus(issueId: string, status: IssueStatus, assignedTo?: string): AccessibilityIssue {
    const issue = this.issues.get(issueId);
    if (!issue) throw new Error('Issue not found');

    issue.status = status;
    issue.assignedTo = assignedTo || issue.assignedTo;
    issue.updatedAt = new Date();
    if (status === 'resolved') {
      issue.resolvedAt = new Date();
    }

    this.emit('issue_updated', issue);
    return issue;
  }

  /**
   * Get WCAG guidelines
   */
  public getGuidelines(category?: AccessibilityCategory): WCAGGuideline[] {
    let guidelines = Array.from(this.guidelines.values());
    if (category) {
      guidelines = guidelines.filter((g) => g.category === category);
    }
    return guidelines.sort((a, b) => a.number.localeCompare(b.number));
  }

  /**
   * Create audit
   */
  public createAudit(data: {
    name: string;
    description?: string;
    targetLevel: AccessibilityLevel;
    scope: AccessibilityAudit['scope'];
    auditedBy: string;
    scheduledAt?: Date;
  }): AccessibilityAudit {
    const audit: AccessibilityAudit = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      ...data,
      status: 'pending',
      automatedChecks: 0,
      manualChecks: 0,
      createdAt: new Date(),
    };
    this.audits.set(audit.id, audit);
    return audit;
  }

  /**
   * Get audits
   */
  public getAudits(): AccessibilityAudit[] {
    return Array.from(this.audits.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get testing profiles
   */
  public getTestingProfiles(): AccessibilityTestingProfile[] {
    return Array.from(this.testingProfiles.values());
  }

  /**
   * Set screen reader hint
   */
  public setScreenReaderHint(elementId: string, hint: ScreenReaderHint): void {
    this.screenReaderHints.set(elementId, hint);
  }

  /**
   * Get screen reader hint
   */
  public getScreenReaderHint(elementId: string): ScreenReaderHint | undefined {
    return this.screenReaderHints.get(elementId);
  }

  /**
   * Generate compliance report
   */
  public generateComplianceReport(auditId: string): ComplianceReport {
    const audit = this.audits.get(auditId);
    if (!audit) throw new Error('Audit not found');

    const issues = this.getIssues();
    const criticalCount = issues.filter((i) => i.severity === 'critical').length;
    const majorCount = issues.filter((i) => i.severity === 'major').length;
    const minorCount = issues.filter((i) => i.severity === 'minor').length;

    const overallCompliance = Math.max(0, 100 - criticalCount * 20 - majorCount * 10 - minorCount * 5);

    return {
      id: `report-${Date.now()}`,
      auditId,
      generatedAt: new Date(),
      targetLevel: audit.targetLevel,
      overallCompliance,
      executiveSummary: `The accessibility audit identified ${issues.length} issues. ${criticalCount} critical issues require immediate attention.`,
      findings: [
        { category: 'perceivable', compliance: 75, issues: 2, criticalIssues: 1 },
        { category: 'operable', compliance: 80, issues: 2, criticalIssues: 1 },
        { category: 'understandable', compliance: 90, issues: 1, criticalIssues: 0 },
        { category: 'robust', compliance: 95, issues: 0, criticalIssues: 0 },
      ],
      recommendations: [
        { priority: 'high', description: 'Add alt text to all images', effort: 'low', impact: 'high' },
        { priority: 'high', description: 'Implement keyboard navigation', effort: 'medium', impact: 'high' },
        { priority: 'medium', description: 'Improve color contrast', effort: 'low', impact: 'medium' },
      ],
      timeline: [
        { milestone: 'Critical fixes', targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), items: ['Fix alt text', 'Fix keyboard nav'] },
        { milestone: 'Level AA compliance', targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), items: ['Fix contrast', 'Add focus indicators'] },
      ],
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

export const accessibilityService = AccessibilityService.getInstance();
export type {
  AccessibilityLevel,
  AccessibilityCategory,
  IssueSeverity,
  IssueStatus,
  DisabilityType,
  AssistiveTechnology,
  ColorBlindnessType,
  AccessibilitySettings,
  WCAGGuideline,
  SuccessCriterion,
  Technique,
  AccessibilityIssue,
  AccessibilityAudit,
  AuditResult,
  KeyboardShortcut,
  SkipLink,
  FocusTrap,
  ARIALandmark,
  LiveRegion,
  TextAlternative,
  ColorContrastResult,
  ReadingOrderElement,
  AccessibilityAnnouncement,
  ScreenReaderHint,
  AccessibilityTestingProfile,
  TestScenario,
  ComplianceReport,
};

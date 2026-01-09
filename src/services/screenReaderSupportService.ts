/**
 * Screen Reader Support Service - Issue #179 Implementation
 * 
 * Provides comprehensive screen reader support and ARIA management for
 * disaster response applications including live regions, announcements,
 * focus management, and semantic structure.
 */

// Type definitions
type AnnouncementPriority = 'off' | 'polite' | 'assertive';
type AriaRole = 'alert' | 'alertdialog' | 'application' | 'article' | 'banner' | 'button' | 'cell' | 
  'checkbox' | 'columnheader' | 'combobox' | 'complementary' | 'contentinfo' | 'definition' | 
  'dialog' | 'directory' | 'document' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell' | 
  'group' | 'heading' | 'img' | 'link' | 'list' | 'listbox' | 'listitem' | 'log' | 'main' | 
  'marquee' | 'math' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 
  'navigation' | 'none' | 'note' | 'option' | 'presentation' | 'progressbar' | 'radio' | 
  'radiogroup' | 'region' | 'row' | 'rowgroup' | 'rowheader' | 'scrollbar' | 'search' | 
  'searchbox' | 'separator' | 'slider' | 'spinbutton' | 'status' | 'switch' | 'tab' | 
  'table' | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'timer' | 'toolbar' | 
  'tooltip' | 'tree' | 'treegrid' | 'treeitem';

// Live region interfaces
interface LiveRegion {
  id: string;
  name: string;
  type: 'status' | 'log' | 'alert' | 'progressbar' | 'marquee' | 'timer' | 'custom';
  priority: AnnouncementPriority;
  atomic: boolean;
  relevant: ('additions' | 'removals' | 'text' | 'all')[];
  busy: boolean;
  labelledBy?: string;
  describedBy?: string;
  elementId?: string;
  history: LiveRegionUpdate[];
  createdAt: Date;
  updatedAt: Date;
}

interface LiveRegionUpdate {
  id: string;
  timestamp: Date;
  content: string;
  priority: AnnouncementPriority;
  announced: boolean;
  announcedAt?: Date;
}

// Announcement interfaces
interface Announcement {
  id: string;
  content: string;
  priority: AnnouncementPriority;
  type: 'status' | 'alert' | 'error' | 'success' | 'progress' | 'navigation' | 'custom';
  context?: string;
  clearAfter?: number;
  interruptible: boolean;
  announced: boolean;
  announcedAt?: Date;
  scheduledAt?: Date;
  expireAt?: Date;
  metadata?: AnnouncementMetadata;
  createdAt: Date;
}

interface AnnouncementMetadata {
  source: string;
  category: string;
  relatedElementId?: string;
  actionRequired?: boolean;
  repeatCount?: number;
  lastRepeated?: Date;
}

// Focus management interfaces
interface FocusContext {
  id: string;
  name: string;
  type: 'modal' | 'menu' | 'dialog' | 'dropdown' | 'sidebar' | 'toolbar' | 'custom';
  active: boolean;
  trapFocus: boolean;
  restoreFocus: boolean;
  previousFocusElement?: string;
  firstFocusable?: string;
  lastFocusable?: string;
  initialFocus?: string;
  focusableElements: string[];
  excludeElements: string[];
  allowOutsideClick: boolean;
  onEscape: 'close' | 'nothing' | 'custom';
  history: FocusHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

interface FocusHistoryEntry {
  timestamp: Date;
  elementId: string;
  action: 'focus' | 'blur' | 'trap_enter' | 'trap_exit';
  reason?: string;
}

interface FocusIndicatorConfig {
  style: 'outline' | 'ring' | 'underline' | 'background' | 'custom';
  color: string;
  width: string;
  offset: string;
  borderRadius?: string;
  animation?: string;
  customStyles?: Record<string, string>;
}

// Semantic structure interfaces
interface SemanticStructure {
  id: string;
  pageId: string;
  pageName: string;
  landmarks: LandmarkInfo[];
  headingStructure: HeadingInfo[];
  regions: RegionInfo[];
  forms: FormInfo[];
  tables: TableInfo[];
  issues: StructureIssue[];
  validatedAt: Date;
}

interface LandmarkInfo {
  id: string;
  role: 'banner' | 'navigation' | 'main' | 'complementary' | 'contentinfo' | 'search' | 'form' | 'region';
  label?: string;
  labelledBy?: string;
  selector: string;
  hasMultiple: boolean;
  issues: string[];
}

interface HeadingInfo {
  id: string;
  level: number;
  text: string;
  selector: string;
  parent?: string;
  skippedLevels: number[];
  issues: string[];
}

interface RegionInfo {
  id: string;
  name?: string;
  role: string;
  labelledBy?: string;
  describedBy?: string;
  selector: string;
  live?: AnnouncementPriority;
  atomic?: boolean;
}

interface FormInfo {
  id: string;
  name?: string;
  action?: string;
  method?: string;
  selector: string;
  fields: FormFieldInfo[];
  hasSubmitButton: boolean;
  issues: string[];
}

interface FormFieldInfo {
  id: string;
  type: string;
  name?: string;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  required: boolean;
  invalid: boolean;
  errorMessage?: string;
  helpText?: string;
  autocomplete?: string;
  issues: string[];
}

interface TableInfo {
  id: string;
  caption?: string;
  summary?: string;
  selector: string;
  rowCount: number;
  columnCount: number;
  hasHeaders: boolean;
  headerScope: 'row' | 'col' | 'both' | 'none';
  issues: string[];
}

interface StructureIssue {
  id: string;
  type: 'error' | 'warning' | 'notice';
  category: 'landmark' | 'heading' | 'form' | 'table' | 'aria' | 'focus';
  message: string;
  selector?: string;
  wcagCriteria?: string;
  remediation: string;
}

// ARIA attributes interfaces
interface AriaConfiguration {
  id: string;
  elementId: string;
  role?: AriaRole;
  attributes: AriaAttributes;
  states: AriaStates;
  properties: AriaProperties;
  relationships: AriaRelationships;
  createdAt: Date;
  updatedAt: Date;
}

interface AriaAttributes {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  details?: string;
  controls?: string;
  owns?: string;
  flowTo?: string;
  current?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
  keyShortcuts?: string;
  roleDescription?: string;
}

interface AriaStates {
  busy?: boolean;
  checked?: boolean | 'mixed';
  disabled?: boolean;
  expanded?: boolean;
  grabbed?: boolean | 'undefined';
  hidden?: boolean;
  invalid?: boolean | 'grammar' | 'spelling';
  pressed?: boolean | 'mixed';
  selected?: boolean;
}

interface AriaProperties {
  autocomplete?: 'inline' | 'list' | 'both' | 'none';
  hasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  level?: number;
  modal?: boolean;
  multiline?: boolean;
  multiselectable?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'undefined';
  placeholder?: string;
  posInSet?: number;
  readonly?: boolean;
  required?: boolean;
  setSize?: number;
  sort?: 'ascending' | 'descending' | 'none' | 'other';
  valueMax?: number;
  valueMin?: number;
  valueNow?: number;
  valueText?: string;
}

interface AriaRelationships {
  activedescendant?: string;
  colCount?: number;
  colIndex?: number;
  colSpan?: number;
  rowCount?: number;
  rowIndex?: number;
  rowSpan?: number;
  errorMessage?: string;
}

// Screen reader testing interfaces
interface ScreenReaderTest {
  id: string;
  testNumber: string;
  name: string;
  screenReader: 'nvda' | 'jaws' | 'voiceover' | 'talkback' | 'narrator' | 'orca';
  browser: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'blocked';
  testCases: ScreenReaderTestCase[];
  summary: TestSummary;
  tester: string;
  createdAt: Date;
  completedAt?: Date;
}

interface ScreenReaderTestCase {
  id: string;
  name: string;
  description: string;
  steps: string[];
  expectedAnnouncements: string[];
  actualAnnouncements?: string[];
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  notes?: string;
  recording?: string;
}

interface TestSummary {
  totalCases: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
}

// Sample data
const sampleLiveRegions: LiveRegion[] = [
  {
    id: 'region-status',
    name: 'Status Messages',
    type: 'status',
    priority: 'polite',
    atomic: true,
    relevant: ['additions', 'text'],
    busy: false,
    elementId: 'status-region',
    history: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'region-alerts',
    name: 'Emergency Alerts',
    type: 'alert',
    priority: 'assertive',
    atomic: true,
    relevant: ['additions'],
    busy: false,
    elementId: 'alert-region',
    history: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class ScreenReaderSupportService {
  private static instance: ScreenReaderSupportService;
  private liveRegions: Map<string, LiveRegion> = new Map();
  private announcements: Map<string, Announcement> = new Map();
  private focusContexts: Map<string, FocusContext> = new Map();
  private semanticStructures: Map<string, SemanticStructure> = new Map();
  private ariaConfigurations: Map<string, AriaConfiguration> = new Map();
  private screenReaderTests: Map<string, ScreenReaderTest> = new Map();

  private announcementQueue: Announcement[] = [];
  private focusIndicatorConfig: FocusIndicatorConfig = {
    style: 'ring',
    color: '#6366F1',
    width: '3px',
    offset: '2px'
  };

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ScreenReaderSupportService {
    if (!ScreenReaderSupportService.instance) {
      ScreenReaderSupportService.instance = new ScreenReaderSupportService();
    }
    return ScreenReaderSupportService.instance;
  }

  private initializeSampleData(): void {
    sampleLiveRegions.forEach(r => this.liveRegions.set(r.id, r));
  }

  // ==================== Live Region Management ====================

  async createLiveRegion(params: Omit<LiveRegion, 'id' | 'history' | 'createdAt' | 'updatedAt'>): Promise<LiveRegion> {
    const region: LiveRegion = {
      ...params,
      id: `region-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      history: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.liveRegions.set(region.id, region);
    return region;
  }

  async getLiveRegion(regionId: string): Promise<LiveRegion | null> {
    return this.liveRegions.get(regionId) || null;
  }

  async getLiveRegions(type?: LiveRegion['type']): Promise<LiveRegion[]> {
    let regions = Array.from(this.liveRegions.values());

    if (type) {
      regions = regions.filter(r => r.type === type);
    }

    return regions;
  }

  async updateLiveRegion(regionId: string, content: string, priority?: AnnouncementPriority): Promise<LiveRegionUpdate> {
    const region = this.liveRegions.get(regionId);
    if (!region) throw new Error(`Live region not found: ${regionId}`);

    const update: LiveRegionUpdate = {
      id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      content,
      priority: priority || region.priority,
      announced: false
    };

    region.history.push(update);
    region.updatedAt = new Date();

    // Trigger announcement
    await this.announce({
      content,
      priority: update.priority,
      type: region.type === 'alert' ? 'alert' : 'status',
      interruptible: region.priority === 'polite'
    });

    update.announced = true;
    update.announcedAt = new Date();

    return update;
  }

  async setLiveRegionBusy(regionId: string, busy: boolean): Promise<LiveRegion> {
    const region = this.liveRegions.get(regionId);
    if (!region) throw new Error(`Live region not found: ${regionId}`);

    region.busy = busy;
    region.updatedAt = new Date();
    return region;
  }

  // ==================== Announcement Management ====================

  async announce(params: Omit<Announcement, 'id' | 'announced' | 'createdAt'>): Promise<Announcement> {
    const announcement: Announcement = {
      ...params,
      id: `announce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      announced: false,
      createdAt: new Date()
    };

    this.announcements.set(announcement.id, announcement);

    // Add to queue based on priority
    if (announcement.priority === 'assertive') {
      // Clear queue and announce immediately
      this.announcementQueue = [announcement];
    } else if (announcement.priority === 'polite') {
      this.announcementQueue.push(announcement);
    }

    // Process queue
    await this.processAnnouncementQueue();

    return announcement;
  }

  private async processAnnouncementQueue(): Promise<void> {
    while (this.announcementQueue.length > 0) {
      const announcement = this.announcementQueue.shift();
      if (announcement) {
        // Simulate announcement
        announcement.announced = true;
        announcement.announcedAt = new Date();

        // Auto-clear after delay if specified
        if (announcement.clearAfter) {
          setTimeout(() => {
            this.announcements.delete(announcement.id);
          }, announcement.clearAfter);
        }
      }
    }
  }

  async getRecentAnnouncements(limit: number = 10): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async clearAnnouncements(): Promise<void> {
    this.announcementQueue = [];
    // Keep history but mark as cleared
  }

  // ==================== Focus Management ====================

  async createFocusContext(params: Omit<FocusContext, 'id' | 'history' | 'createdAt' | 'updatedAt'>): Promise<FocusContext> {
    const context: FocusContext = {
      ...params,
      id: `focus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      history: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.focusContexts.set(context.id, context);
    return context;
  }

  async getFocusContext(contextId: string): Promise<FocusContext | null> {
    return this.focusContexts.get(contextId) || null;
  }

  async getActiveFocusContext(): Promise<FocusContext | null> {
    return Array.from(this.focusContexts.values())
      .find(c => c.active) || null;
  }

  async activateFocusContext(contextId: string, previousFocusElement?: string): Promise<FocusContext> {
    // Deactivate current context
    const activeContext = await this.getActiveFocusContext();
    if (activeContext) {
      activeContext.active = false;
    }

    // Activate new context
    const context = this.focusContexts.get(contextId);
    if (!context) throw new Error(`Focus context not found: ${contextId}`);

    context.active = true;
    context.previousFocusElement = previousFocusElement;
    context.history.push({
      timestamp: new Date(),
      elementId: context.initialFocus || context.firstFocusable || '',
      action: 'trap_enter'
    });
    context.updatedAt = new Date();

    return context;
  }

  async deactivateFocusContext(contextId: string): Promise<FocusContext> {
    const context = this.focusContexts.get(contextId);
    if (!context) throw new Error(`Focus context not found: ${contextId}`);

    context.active = false;
    context.history.push({
      timestamp: new Date(),
      elementId: context.previousFocusElement || '',
      action: 'trap_exit'
    });
    context.updatedAt = new Date();

    return context;
  }

  async recordFocusChange(contextId: string, elementId: string, action: 'focus' | 'blur'): Promise<void> {
    const context = this.focusContexts.get(contextId);
    if (!context) return;

    context.history.push({
      timestamp: new Date(),
      elementId,
      action
    });
    context.updatedAt = new Date();
  }

  setFocusIndicatorConfig(config: Partial<FocusIndicatorConfig>): void {
    Object.assign(this.focusIndicatorConfig, config);
  }

  getFocusIndicatorConfig(): FocusIndicatorConfig {
    return { ...this.focusIndicatorConfig };
  }

  generateFocusIndicatorCss(): string {
    const config = this.focusIndicatorConfig;
    
    switch (config.style) {
      case 'outline':
        return `outline: ${config.width} solid ${config.color}; outline-offset: ${config.offset};`;
      case 'ring':
        return `box-shadow: 0 0 0 ${config.offset} transparent, 0 0 0 calc(${config.offset} + ${config.width}) ${config.color};`;
      case 'underline':
        return `border-bottom: ${config.width} solid ${config.color};`;
      case 'background':
        return `background-color: ${config.color}20;`;
      default:
        return Object.entries(config.customStyles || {})
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ');
    }
  }

  // ==================== Semantic Structure ====================

  async analyzeSemanticStructure(pageId: string, pageName: string): Promise<SemanticStructure> {
    // This would normally analyze the DOM, but we'll create a mock structure
    const structure: SemanticStructure = {
      id: `struct-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pageId,
      pageName,
      landmarks: [
        { id: 'lm-1', role: 'banner', label: 'Site Header', selector: 'header', hasMultiple: false, issues: [] },
        { id: 'lm-2', role: 'navigation', label: 'Main Navigation', selector: 'nav', hasMultiple: false, issues: [] },
        { id: 'lm-3', role: 'main', selector: 'main', hasMultiple: false, issues: [] },
        { id: 'lm-4', role: 'contentinfo', label: 'Footer', selector: 'footer', hasMultiple: false, issues: [] }
      ],
      headingStructure: [
        { id: 'h-1', level: 1, text: 'Page Title', selector: 'h1', skippedLevels: [], issues: [] },
        { id: 'h-2', level: 2, text: 'Section 1', selector: 'h2:nth-of-type(1)', parent: 'h-1', skippedLevels: [], issues: [] },
        { id: 'h-3', level: 2, text: 'Section 2', selector: 'h2:nth-of-type(2)', parent: 'h-1', skippedLevels: [], issues: [] }
      ],
      regions: [],
      forms: [],
      tables: [],
      issues: [],
      validatedAt: new Date()
    };

    this.semanticStructures.set(pageId, structure);
    return structure;
  }

  async getSemanticStructure(pageId: string): Promise<SemanticStructure | null> {
    return this.semanticStructures.get(pageId) || null;
  }

  async validateHeadingStructure(pageId: string): Promise<StructureIssue[]> {
    const structure = await this.getSemanticStructure(pageId);
    if (!structure) return [];

    const issues: StructureIssue[] = [];
    let previousLevel = 0;

    structure.headingStructure.forEach(heading => {
      if (heading.level > previousLevel + 1 && previousLevel > 0) {
        issues.push({
          id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'error',
          category: 'heading',
          message: `Skipped heading level: h${previousLevel} to h${heading.level}`,
          selector: heading.selector,
          wcagCriteria: '1.3.1',
          remediation: `Change to h${previousLevel + 1} or add missing heading levels`
        });
      }
      previousLevel = heading.level;
    });

    return issues;
  }

  // ==================== ARIA Configuration ====================

  async setAriaConfiguration(elementId: string, config: Omit<AriaConfiguration, 'id' | 'elementId' | 'createdAt' | 'updatedAt'>): Promise<AriaConfiguration> {
    const ariaConfig: AriaConfiguration = {
      ...config,
      id: `aria-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      elementId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.ariaConfigurations.set(elementId, ariaConfig);
    return ariaConfig;
  }

  async getAriaConfiguration(elementId: string): Promise<AriaConfiguration | null> {
    return this.ariaConfigurations.get(elementId) || null;
  }

  async updateAriaState(elementId: string, states: Partial<AriaStates>): Promise<AriaConfiguration> {
    let config = this.ariaConfigurations.get(elementId);
    if (!config) {
      config = await this.setAriaConfiguration(elementId, {
        attributes: {},
        states: {},
        properties: {},
        relationships: {}
      });
    }

    Object.assign(config.states, states);
    config.updatedAt = new Date();
    return config;
  }

  generateAriaAttributes(config: AriaConfiguration): Record<string, string> {
    const attrs: Record<string, string> = {};

    if (config.role) {
      attrs['role'] = config.role;
    }

    // Attributes
    Object.entries(config.attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        attrs[`aria-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = String(value);
      }
    });

    // States
    Object.entries(config.states).forEach(([key, value]) => {
      if (value !== undefined) {
        attrs[`aria-${key}`] = String(value);
      }
    });

    // Properties
    Object.entries(config.properties).forEach(([key, value]) => {
      if (value !== undefined) {
        attrs[`aria-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = String(value);
      }
    });

    // Relationships
    Object.entries(config.relationships).forEach(([key, value]) => {
      if (value !== undefined) {
        attrs[`aria-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = String(value);
      }
    });

    return attrs;
  }

  // ==================== Screen Reader Testing ====================

  async createScreenReaderTest(params: Omit<ScreenReaderTest, 'id' | 'testNumber' | 'status' | 'summary' | 'createdAt'>): Promise<ScreenReaderTest> {
    const test: ScreenReaderTest = {
      ...params,
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      testNumber: `SRT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'pending',
      summary: {
        totalCases: params.testCases.length,
        passed: 0,
        failed: 0,
        skipped: 0,
        passRate: 0
      },
      createdAt: new Date()
    };

    this.screenReaderTests.set(test.id, test);
    return test;
  }

  async getScreenReaderTest(testId: string): Promise<ScreenReaderTest | null> {
    return this.screenReaderTests.get(testId) || null;
  }

  async getScreenReaderTests(screenReader?: ScreenReaderTest['screenReader']): Promise<ScreenReaderTest[]> {
    let tests = Array.from(this.screenReaderTests.values());

    if (screenReader) {
      tests = tests.filter(t => t.screenReader === screenReader);
    }

    return tests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateTestCase(testId: string, testCaseId: string, result: Pick<ScreenReaderTestCase, 'status' | 'actualAnnouncements' | 'notes'>): Promise<ScreenReaderTest> {
    const test = this.screenReaderTests.get(testId);
    if (!test) throw new Error(`Test not found: ${testId}`);

    const testCase = test.testCases.find(tc => tc.id === testCaseId);
    if (!testCase) throw new Error(`Test case not found: ${testCaseId}`);

    Object.assign(testCase, result);

    // Update summary
    test.summary.passed = test.testCases.filter(tc => tc.status === 'passed').length;
    test.summary.failed = test.testCases.filter(tc => tc.status === 'failed').length;
    test.summary.skipped = test.testCases.filter(tc => tc.status === 'skipped').length;
    test.summary.passRate = test.summary.totalCases > 0 ?
      (test.summary.passed / test.summary.totalCases) * 100 : 0;

    // Check if test is complete
    if (test.summary.passed + test.summary.failed + test.summary.skipped === test.summary.totalCases) {
      test.status = test.summary.failed > 0 ? 'failed' : 'passed';
      test.completedAt = new Date();
    } else {
      test.status = 'in_progress';
    }

    return test;
  }

  // ==================== Utility Methods ====================

  getAriaLiveHtml(priority: AnnouncementPriority, content: string): string {
    return `<div role="status" aria-live="${priority}" aria-atomic="true">${content}</div>`;
  }

  getSupportedRoles(): AriaRole[] {
    return [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell',
      'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition',
      'dialog', 'directory', 'document', 'feed', 'figure', 'form', 'grid', 'gridcell',
      'group', 'heading', 'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
      'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
      'navigation', 'none', 'note', 'option', 'presentation', 'progressbar', 'radio',
      'radiogroup', 'region', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search',
      'searchbox', 'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab',
      'table', 'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
      'tooltip', 'tree', 'treegrid', 'treeitem'
    ];
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalLiveRegions: number;
    totalAnnouncements: number;
    announcementsToday: number;
    activeFocusContexts: number;
    totalFocusContexts: number;
    analyzedPages: number;
    totalStructureIssues: number;
    totalAriaConfigurations: number;
    totalScreenReaderTests: number;
    testPassRate: number;
    announcementsByPriority: { priority: string; count: number }[];
    issuesByCategory: { category: string; count: number }[];
  }> {
    const announcements = Array.from(this.announcements.values());
    const focusContexts = Array.from(this.focusContexts.values());
    const structures = Array.from(this.semanticStructures.values());
    const tests = Array.from(this.screenReaderTests.values());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const priorityCounts: Record<string, number> = {};
    announcements.forEach(a => {
      priorityCounts[a.priority] = (priorityCounts[a.priority] || 0) + 1;
    });

    const issueCategoryCounts: Record<string, number> = {};
    structures.forEach(s => {
      s.issues.forEach(i => {
        issueCategoryCounts[i.category] = (issueCategoryCounts[i.category] || 0) + 1;
      });
    });

    const completedTests = tests.filter(t => t.completedAt);
    const totalPassRate = completedTests.length > 0 ?
      completedTests.reduce((sum, t) => sum + t.summary.passRate, 0) / completedTests.length : 0;

    return {
      totalLiveRegions: this.liveRegions.size,
      totalAnnouncements: announcements.length,
      announcementsToday: announcements.filter(a => a.createdAt >= today).length,
      activeFocusContexts: focusContexts.filter(c => c.active).length,
      totalFocusContexts: focusContexts.length,
      analyzedPages: structures.length,
      totalStructureIssues: structures.reduce((sum, s) => sum + s.issues.length, 0),
      totalAriaConfigurations: this.ariaConfigurations.size,
      totalScreenReaderTests: tests.length,
      testPassRate: totalPassRate,
      announcementsByPriority: Object.entries(priorityCounts).map(([priority, count]) => ({ priority, count })),
      issuesByCategory: Object.entries(issueCategoryCounts).map(([category, count]) => ({ category, count }))
    };
  }
}

export const screenReaderSupportService = ScreenReaderSupportService.getInstance();
export default ScreenReaderSupportService;

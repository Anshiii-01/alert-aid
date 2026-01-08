/**
 * Notification System Service
 * Multi-channel notification delivery and management
 */

// Notification channels
type NotificationChannel = 'push' | 'email' | 'sms' | 'in_app' | 'whatsapp' | 'voice' | 'telegram';

// Notification priority
type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';

// Notification status
type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'cancelled';

// Notification category
type NotificationCategory = 
  | 'alert'
  | 'warning'
  | 'evacuation'
  | 'shelter'
  | 'resource'
  | 'volunteer'
  | 'system'
  | 'reminder'
  | 'update'
  | 'emergency';

// Notification template
interface NotificationTemplate {
  id: string;
  name: string;
  category: NotificationCategory;
  channels: NotificationChannel[];
  subject: string;
  body: string;
  bodyHtml?: string;
  variables: TemplateVariable[];
  settings: TemplateSettings;
}

// Template variable
interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'location' | 'link';
  required: boolean;
  defaultValue?: unknown;
  description: string;
}

// Template settings
interface TemplateSettings {
  priority: NotificationPriority;
  ttl?: number; // Time to live in seconds
  retryAttempts?: number;
  sound?: string;
  vibration?: boolean;
  actionButtons?: ActionButton[];
  localization?: LocalizedContent[];
}

// Action button
interface ActionButton {
  id: string;
  label: string;
  action: 'open_url' | 'dismiss' | 'reply' | 'custom';
  data?: string;
}

// Localized content
interface LocalizedContent {
  language: string;
  subject: string;
  body: string;
}

// Notification payload
interface NotificationPayload {
  id: string;
  templateId?: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  recipients: Recipient[];
  content: NotificationContent;
  scheduling?: SchedulingConfig;
  tracking: TrackingConfig;
  metadata?: Record<string, unknown>;
}

// Notification content
interface NotificationContent {
  title: string;
  body: string;
  bodyHtml?: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
  actions?: ActionButton[];
}

// Recipient
interface Recipient {
  id: string;
  type: 'user' | 'group' | 'role' | 'location' | 'all';
  value: string;
  channels?: NotificationChannel[];
  preferences?: RecipientPreferences;
}

// Recipient preferences
interface RecipientPreferences {
  channels: NotificationChannel[];
  quietHours?: { start: string; end: string };
  language?: string;
  timezone?: string;
}

// Scheduling config
interface SchedulingConfig {
  sendAt?: Date;
  expireAt?: Date;
  repeatInterval?: number; // seconds
  repeatCount?: number;
  timezone?: string;
}

// Tracking config
interface TrackingConfig {
  trackDelivery: boolean;
  trackRead: boolean;
  trackClicks: boolean;
  webhookUrl?: string;
}

// Sent notification
interface SentNotification {
  id: string;
  payloadId: string;
  recipientId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  content: NotificationContent;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failureReason?: string;
  retryCount: number;
  metadata?: Record<string, unknown>;
}

// Notification stats
interface NotificationStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  pending: number;
  byChannel: Record<NotificationChannel, ChannelStats>;
  byCategory: Record<NotificationCategory, number>;
  deliveryRate: number;
  readRate: number;
}

// Channel stats
interface ChannelStats {
  sent: number;
  delivered: number;
  failed: number;
  avgDeliveryTime: number;
}

// User notification preferences
interface UserNotificationPreferences {
  userId: string;
  enabled: boolean;
  channels: {
    [K in NotificationChannel]?: {
      enabled: boolean;
      address?: string;
    };
  };
  categories: {
    [K in NotificationCategory]?: {
      enabled: boolean;
      channels?: NotificationChannel[];
    };
  };
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
    allowCritical: boolean;
  };
  language: string;
  digest?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
  };
}

// Notification history entry
interface NotificationHistoryEntry {
  id: string;
  notificationId: string;
  action: 'created' | 'sent' | 'delivered' | 'read' | 'clicked' | 'failed' | 'retried';
  timestamp: Date;
  channel?: NotificationChannel;
  details?: Record<string, unknown>;
}

// Default templates
const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'alert-critical',
    name: 'Critical Alert',
    category: 'alert',
    channels: ['push', 'sms', 'in_app'],
    subject: '🚨 CRITICAL ALERT: {{alertType}}',
    body: 'Critical {{alertType}} alert in {{location}}. {{description}}. Take immediate action.',
    bodyHtml: '<h2 style="color:red">🚨 CRITICAL ALERT</h2><p><strong>{{alertType}}</strong> in {{location}}</p><p>{{description}}</p><p><strong>Take immediate action.</strong></p>',
    variables: [
      { name: 'alertType', type: 'string', required: true, description: 'Type of alert' },
      { name: 'location', type: 'location', required: true, description: 'Affected location' },
      { name: 'description', type: 'string', required: false, defaultValue: 'Emergency situation detected', description: 'Alert details' },
    ],
    settings: {
      priority: 'critical',
      ttl: 3600,
      retryAttempts: 3,
      sound: 'critical_alert',
      vibration: true,
      actionButtons: [
        { id: 'view', label: 'View Details', action: 'open_url', data: '{{alertUrl}}' },
        { id: 'acknowledge', label: 'Acknowledge', action: 'custom', data: 'ack' },
      ],
    },
  },
  {
    id: 'evacuation-order',
    name: 'Evacuation Order',
    category: 'evacuation',
    channels: ['push', 'sms', 'voice', 'in_app'],
    subject: '⚠️ EVACUATION ORDER: {{zone}}',
    body: 'Immediate evacuation ordered for {{zone}}. Proceed to {{shelter}} via {{route}}. Emergency contact: {{contact}}',
    variables: [
      { name: 'zone', type: 'string', required: true, description: 'Evacuation zone' },
      { name: 'shelter', type: 'string', required: true, description: 'Destination shelter' },
      { name: 'route', type: 'string', required: true, description: 'Evacuation route' },
      { name: 'contact', type: 'string', required: false, defaultValue: '1078', description: 'Emergency contact' },
    ],
    settings: {
      priority: 'critical',
      ttl: 7200,
      retryAttempts: 5,
      sound: 'evacuation_siren',
      vibration: true,
      actionButtons: [
        { id: 'navigate', label: 'Get Directions', action: 'open_url', data: '{{navigationUrl}}' },
        { id: 'safe', label: 'Mark Safe', action: 'custom', data: 'safe' },
      ],
      localization: [
        { language: 'hi', subject: '⚠️ निकासी आदेश: {{zone}}', body: '{{zone}} के लिए तत्काल निकासी आदेश। {{shelter}} के लिए {{route}} से जाएं।' },
        { language: 'ta', subject: '⚠️ வெளியேற்ற உத்தரவு: {{zone}}', body: '{{zone}} இலிருந்து உடனடி வெளியேற்றம். {{shelter}} க்கு {{route}} வழியாக செல்லவும்.' },
      ],
    },
  },
  {
    id: 'shelter-update',
    name: 'Shelter Status Update',
    category: 'shelter',
    channels: ['push', 'in_app'],
    subject: 'Shelter Update: {{shelterName}}',
    body: '{{shelterName}} status: {{status}}. Capacity: {{capacity}}. Available: {{available}}',
    variables: [
      { name: 'shelterName', type: 'string', required: true, description: 'Shelter name' },
      { name: 'status', type: 'string', required: true, description: 'Current status' },
      { name: 'capacity', type: 'number', required: true, description: 'Total capacity' },
      { name: 'available', type: 'number', required: true, description: 'Available spots' },
    ],
    settings: {
      priority: 'high',
      ttl: 1800,
      actionButtons: [
        { id: 'view', label: 'View Shelter', action: 'open_url', data: '{{shelterUrl}}' },
      ],
    },
  },
  {
    id: 'resource-request',
    name: 'Resource Request',
    category: 'resource',
    channels: ['push', 'email', 'in_app'],
    subject: 'Resource Request: {{resourceType}}',
    body: 'Urgent request for {{quantity}} {{resourceType}} at {{location}}. Requested by: {{requester}}',
    variables: [
      { name: 'resourceType', type: 'string', required: true, description: 'Type of resource' },
      { name: 'quantity', type: 'number', required: true, description: 'Quantity needed' },
      { name: 'location', type: 'string', required: true, description: 'Delivery location' },
      { name: 'requester', type: 'string', required: false, defaultValue: 'System', description: 'Requesting party' },
    ],
    settings: {
      priority: 'high',
      retryAttempts: 2,
      actionButtons: [
        { id: 'fulfill', label: 'Fulfill Request', action: 'custom', data: 'fulfill' },
        { id: 'forward', label: 'Forward', action: 'custom', data: 'forward' },
      ],
    },
  },
  {
    id: 'volunteer-assignment',
    name: 'Volunteer Task Assignment',
    category: 'volunteer',
    channels: ['push', 'sms', 'in_app'],
    subject: 'New Task: {{taskTitle}}',
    body: 'You have been assigned: {{taskTitle}} at {{location}}. Report by {{reportTime}}. Contact: {{supervisor}}',
    variables: [
      { name: 'taskTitle', type: 'string', required: true, description: 'Task title' },
      { name: 'location', type: 'string', required: true, description: 'Task location' },
      { name: 'reportTime', type: 'date', required: true, description: 'Report time' },
      { name: 'supervisor', type: 'string', required: false, description: 'Supervisor name' },
    ],
    settings: {
      priority: 'normal',
      actionButtons: [
        { id: 'accept', label: 'Accept', action: 'custom', data: 'accept' },
        { id: 'decline', label: 'Decline', action: 'custom', data: 'decline' },
      ],
    },
  },
  {
    id: 'weather-warning',
    name: 'Weather Warning',
    category: 'warning',
    channels: ['push', 'in_app'],
    subject: '🌧️ Weather Warning: {{condition}}',
    body: '{{condition}} expected in {{area}} from {{startTime}} to {{endTime}}. {{advisory}}',
    variables: [
      { name: 'condition', type: 'string', required: true, description: 'Weather condition' },
      { name: 'area', type: 'string', required: true, description: 'Affected area' },
      { name: 'startTime', type: 'date', required: true, description: 'Start time' },
      { name: 'endTime', type: 'date', required: true, description: 'End time' },
      { name: 'advisory', type: 'string', required: false, description: 'Advisory message' },
    ],
    settings: {
      priority: 'high',
      ttl: 7200,
    },
  },
  {
    id: 'daily-briefing',
    name: 'Daily Briefing',
    category: 'update',
    channels: ['email', 'in_app'],
    subject: '📊 Daily Situation Briefing - {{date}}',
    body: 'Daily briefing for {{date}}:\n\n• Active Alerts: {{alertCount}}\n• Shelters Open: {{shelterCount}}\n• People Evacuated: {{evacuatedCount}}\n• Resources Deployed: {{resourceCount}}',
    bodyHtml: '<h2>📊 Daily Situation Briefing</h2><p>Date: {{date}}</p><ul><li>Active Alerts: {{alertCount}}</li><li>Shelters Open: {{shelterCount}}</li><li>People Evacuated: {{evacuatedCount}}</li><li>Resources Deployed: {{resourceCount}}</li></ul>',
    variables: [
      { name: 'date', type: 'date', required: true, description: 'Report date' },
      { name: 'alertCount', type: 'number', required: true, description: 'Alert count' },
      { name: 'shelterCount', type: 'number', required: true, description: 'Shelter count' },
      { name: 'evacuatedCount', type: 'number', required: true, description: 'Evacuated count' },
      { name: 'resourceCount', type: 'number', required: true, description: 'Resource count' },
    ],
    settings: {
      priority: 'normal',
    },
  },
  {
    id: 'system-maintenance',
    name: 'System Maintenance',
    category: 'system',
    channels: ['email', 'in_app'],
    subject: '🔧 System Maintenance Notice',
    body: 'Scheduled maintenance from {{startTime}} to {{endTime}}. Services affected: {{services}}. {{message}}',
    variables: [
      { name: 'startTime', type: 'date', required: true, description: 'Start time' },
      { name: 'endTime', type: 'date', required: true, description: 'End time' },
      { name: 'services', type: 'string', required: true, description: 'Affected services' },
      { name: 'message', type: 'string', required: false, description: 'Additional message' },
    ],
    settings: {
      priority: 'low',
    },
  },
];

class NotificationService {
  private static instance: NotificationService;
  private templates: Map<string, NotificationTemplate> = new Map();
  private notifications: Map<string, SentNotification> = new Map();
  private preferences: Map<string, UserNotificationPreferences> = new Map();
  private history: NotificationHistoryEntry[] = [];
  private listeners: ((notification: SentNotification) => void)[] = [];
  private pendingQueue: NotificationPayload[] = [];

  private constructor() {
    this.initializeTemplates();
    this.startQueueProcessor();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize templates
   */
  private initializeTemplates(): void {
    DEFAULT_TEMPLATES.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Start queue processor
   */
  private startQueueProcessor(): void {
    setInterval(() => {
      this.processQueue();
    }, 1000);
  }

  /**
   * Process notification queue
   */
  private async processQueue(): Promise<void> {
    const now = new Date();
    
    for (let i = this.pendingQueue.length - 1; i >= 0; i--) {
      const payload = this.pendingQueue[i];
      
      if (payload.scheduling?.sendAt && payload.scheduling.sendAt > now) {
        continue;
      }
      
      this.pendingQueue.splice(i, 1);
      await this.deliverNotification(payload);
    }
  }

  /**
   * Send notification
   */
  public async send(payload: Omit<NotificationPayload, 'id' | 'tracking'>): Promise<string> {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    
    const fullPayload: NotificationPayload = {
      ...payload,
      id,
      tracking: {
        trackDelivery: true,
        trackRead: true,
        trackClicks: false,
      },
    };

    this.addHistoryEntry(id, 'created');

    if (payload.scheduling?.sendAt && payload.scheduling.sendAt > new Date()) {
      this.pendingQueue.push(fullPayload);
      return id;
    }

    await this.deliverNotification(fullPayload);
    return id;
  }

  /**
   * Send using template
   */
  public async sendFromTemplate(
    templateId: string,
    recipients: Recipient[],
    variables: Record<string, unknown>,
    overrides?: Partial<NotificationPayload>
  ): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const content = this.processTemplate(template, variables);

    return this.send({
      templateId,
      category: template.category,
      priority: template.settings.priority,
      channels: template.channels,
      recipients,
      content,
      ...overrides,
    });
  }

  /**
   * Process template
   */
  private processTemplate(
    template: NotificationTemplate,
    variables: Record<string, unknown>
  ): NotificationContent {
    let title = template.subject;
    let body = template.body;
    let bodyHtml = template.bodyHtml;

    for (const variable of template.variables) {
      const value = variables[variable.name] ?? variable.defaultValue ?? '';
      const placeholder = `{{${variable.name}}}`;
      const stringValue = this.formatVariable(value, variable.type);
      
      title = title.replace(new RegExp(placeholder, 'g'), stringValue);
      body = body.replace(new RegExp(placeholder, 'g'), stringValue);
      if (bodyHtml) {
        bodyHtml = bodyHtml.replace(new RegExp(placeholder, 'g'), stringValue);
      }
    }

    return {
      title,
      body,
      bodyHtml,
      actions: template.settings.actionButtons,
      data: variables as Record<string, unknown>,
    };
  }

  /**
   * Format variable
   */
  private formatVariable(value: unknown, type: string): string {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'date':
        return value instanceof Date
          ? value.toLocaleString('en-IN')
          : new Date(value as string).toLocaleString('en-IN');
      case 'number':
        return Number(value).toLocaleString('en-IN');
      case 'location':
        if (typeof value === 'object' && value !== null) {
          const loc = value as { name?: string; lat?: number; lng?: number };
          return loc.name || `${loc.lat}, ${loc.lng}`;
        }
        return String(value);
      default:
        return String(value);
    }
  }

  /**
   * Deliver notification
   */
  private async deliverNotification(payload: NotificationPayload): Promise<void> {
    for (const recipient of payload.recipients) {
      const preferences = this.preferences.get(recipient.id);
      const channels = this.getEffectiveChannels(payload, recipient, preferences);

      for (const channel of channels) {
        const notification = await this.sendToChannel(payload, recipient, channel);
        this.notifications.set(notification.id, notification);
        this.notifyListeners(notification);
      }
    }
  }

  /**
   * Get effective channels
   */
  private getEffectiveChannels(
    payload: NotificationPayload,
    recipient: Recipient,
    preferences?: UserNotificationPreferences
  ): NotificationChannel[] {
    let channels = [...payload.channels];

    if (recipient.channels) {
      channels = channels.filter((c) => recipient.channels!.includes(c));
    }

    if (preferences) {
      channels = channels.filter((c) => {
        const channelPref = preferences.channels[c];
        if (!channelPref?.enabled) return false;
        
        const categoryPref = preferences.categories[payload.category];
        if (categoryPref && !categoryPref.enabled) return false;
        if (categoryPref?.channels && !categoryPref.channels.includes(c)) return false;
        
        return true;
      });

      // Check quiet hours
      if (preferences.quietHours?.enabled && payload.priority !== 'critical') {
        const now = new Date();
        const currentTime = now.toTimeString().substr(0, 5);
        if (currentTime >= preferences.quietHours.start && currentTime <= preferences.quietHours.end) {
          return [];
        }
      }
    }

    return channels;
  }

  /**
   * Send to channel
   */
  private async sendToChannel(
    payload: NotificationPayload,
    recipient: Recipient,
    channel: NotificationChannel
  ): Promise<SentNotification> {
    const id = `sent-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date();

    const notification: SentNotification = {
      id,
      payloadId: payload.id,
      recipientId: recipient.id,
      channel,
      status: 'pending',
      content: payload.content,
      retryCount: 0,
      metadata: payload.metadata,
    };

    try {
      // Simulate channel-specific delivery
      await this.simulateChannelDelivery(channel, notification);
      
      notification.status = 'sent';
      notification.sentAt = now;
      
      // Simulate delivery confirmation
      setTimeout(() => {
        notification.status = 'delivered';
        notification.deliveredAt = new Date();
        this.addHistoryEntry(notification.id, 'delivered', channel);
        this.notifyListeners(notification);
      }, 500 + Math.random() * 2000);
      
      this.addHistoryEntry(notification.id, 'sent', channel);
    } catch (error) {
      notification.status = 'failed';
      notification.failureReason = error instanceof Error ? error.message : 'Unknown error';
      this.addHistoryEntry(notification.id, 'failed', channel, { error: notification.failureReason });
    }

    return notification;
  }

  /**
   * Simulate channel delivery
   */
  private async simulateChannelDelivery(
    channel: NotificationChannel,
    notification: SentNotification
  ): Promise<void> {
    const delays: Record<NotificationChannel, number> = {
      push: 100,
      in_app: 50,
      sms: 500,
      email: 300,
      whatsapp: 400,
      voice: 1000,
      telegram: 200,
    };

    await new Promise((resolve) => setTimeout(resolve, delays[channel]));

    // Simulate occasional failures
    if (Math.random() < 0.02) {
      throw new Error(`${channel} delivery failed: Service unavailable`);
    }
  }

  /**
   * Mark as read
   */
  public markAsRead(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;

    notification.status = 'read';
    notification.readAt = new Date();
    this.addHistoryEntry(notificationId, 'read');
    this.notifyListeners(notification);
    return true;
  }

  /**
   * Get user notifications
   */
  public getUserNotifications(userId: string, options?: {
    status?: NotificationStatus[];
    category?: NotificationCategory[];
    limit?: number;
    offset?: number;
  }): SentNotification[] {
    let notifications = Array.from(this.notifications.values())
      .filter((n) => n.recipientId === userId);

    if (options?.status) {
      notifications = notifications.filter((n) => options.status!.includes(n.status));
    }

    if (options?.category) {
      const templates = Array.from(this.templates.values());
      notifications = notifications.filter((n) => {
        const template = templates.find((t) => t.id === (n.metadata as { templateId?: string })?.templateId);
        return template && options.category!.includes(template.category);
      });
    }

    notifications.sort((a, b) => {
      const dateA = a.sentAt || new Date(0);
      const dateB = b.sentAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const offset = options?.offset || 0;
    const limit = options?.limit || 50;
    return notifications.slice(offset, offset + limit);
  }

  /**
   * Get unread count
   */
  public getUnreadCount(userId: string): number {
    return Array.from(this.notifications.values())
      .filter((n) => n.recipientId === userId && n.status !== 'read')
      .length;
  }

  /**
   * Set user preferences
   */
  public setUserPreferences(preferences: UserNotificationPreferences): void {
    this.preferences.set(preferences.userId, preferences);
  }

  /**
   * Get user preferences
   */
  public getUserPreferences(userId: string): UserNotificationPreferences | undefined {
    return this.preferences.get(userId);
  }

  /**
   * Get statistics
   */
  public getStatistics(timeRange?: { start: Date; end: Date }): NotificationStats {
    let notifications = Array.from(this.notifications.values());

    if (timeRange) {
      notifications = notifications.filter((n) => {
        const date = n.sentAt || new Date();
        return date >= timeRange.start && date <= timeRange.end;
      });
    }

    const total = notifications.length;
    const sent = notifications.filter((n) => n.status !== 'pending').length;
    const delivered = notifications.filter((n) => ['delivered', 'read'].includes(n.status)).length;
    const read = notifications.filter((n) => n.status === 'read').length;
    const failed = notifications.filter((n) => n.status === 'failed').length;
    const pending = notifications.filter((n) => n.status === 'pending').length;

    const channels: NotificationChannel[] = ['push', 'email', 'sms', 'in_app', 'whatsapp', 'voice', 'telegram'];
    const byChannel = {} as Record<NotificationChannel, ChannelStats>;
    
    channels.forEach((channel) => {
      const channelNotifs = notifications.filter((n) => n.channel === channel);
      byChannel[channel] = {
        sent: channelNotifs.filter((n) => n.status !== 'pending').length,
        delivered: channelNotifs.filter((n) => ['delivered', 'read'].includes(n.status)).length,
        failed: channelNotifs.filter((n) => n.status === 'failed').length,
        avgDeliveryTime: this.calculateAvgDeliveryTime(channelNotifs),
      };
    });

    const categories: NotificationCategory[] = ['alert', 'warning', 'evacuation', 'shelter', 'resource', 'volunteer', 'system', 'reminder', 'update', 'emergency'];
    const byCategory = {} as Record<NotificationCategory, number>;
    categories.forEach((cat) => { byCategory[cat] = 0; });

    return {
      total,
      sent,
      delivered,
      read,
      failed,
      pending,
      byChannel,
      byCategory,
      deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
      readRate: delivered > 0 ? (read / delivered) * 100 : 0,
    };
  }

  /**
   * Calculate average delivery time
   */
  private calculateAvgDeliveryTime(notifications: SentNotification[]): number {
    const delivered = notifications.filter((n) => n.sentAt && n.deliveredAt);
    if (delivered.length === 0) return 0;
    
    const totalTime = delivered.reduce((sum, n) => {
      return sum + (n.deliveredAt!.getTime() - n.sentAt!.getTime());
    }, 0);
    
    return totalTime / delivered.length / 1000; // seconds
  }

  /**
   * Get templates
   */
  public getTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template
   */
  public getTemplate(templateId: string): NotificationTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Create template
   */
  public createTemplate(template: Omit<NotificationTemplate, 'id'>): NotificationTemplate {
    const id = `template-${Date.now()}`;
    const newTemplate: NotificationTemplate = { ...template, id };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  /**
   * Broadcast notification
   */
  public async broadcast(
    content: NotificationContent,
    options: {
      category: NotificationCategory;
      priority: NotificationPriority;
      channels: NotificationChannel[];
      filters?: {
        roles?: string[];
        locations?: string[];
      };
    }
  ): Promise<string> {
    return this.send({
      category: options.category,
      priority: options.priority,
      channels: options.channels,
      recipients: [{ id: 'all', type: 'all', value: '*' }],
      content,
    });
  }

  /**
   * Send emergency alert
   */
  public async sendEmergencyAlert(
    alertType: string,
    location: string,
    description: string,
    recipients: Recipient[]
  ): Promise<string> {
    return this.sendFromTemplate('alert-critical', recipients, {
      alertType,
      location,
      description,
      alertUrl: `/alerts/latest`,
    });
  }

  /**
   * Send evacuation order
   */
  public async sendEvacuationOrder(
    zone: string,
    shelter: string,
    route: string,
    recipients: Recipient[]
  ): Promise<string> {
    return this.sendFromTemplate('evacuation-order', recipients, {
      zone,
      shelter,
      route,
      contact: '1078',
      navigationUrl: `/navigate?to=${encodeURIComponent(shelter)}`,
    });
  }

  /**
   * Add history entry
   */
  private addHistoryEntry(
    notificationId: string,
    action: NotificationHistoryEntry['action'],
    channel?: NotificationChannel,
    details?: Record<string, unknown>
  ): void {
    this.history.push({
      id: `hist-${Date.now()}`,
      notificationId,
      action,
      timestamp: new Date(),
      channel,
      details,
    });
  }

  /**
   * Get history
   */
  public getHistory(notificationId?: string): NotificationHistoryEntry[] {
    if (notificationId) {
      return this.history.filter((h) => h.notificationId === notificationId);
    }
    return [...this.history];
  }

  /**
   * Subscribe to updates
   */
  public subscribe(callback: (notification: SentNotification) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(notification: SentNotification): void {
    this.listeners.forEach((callback) => callback(notification));
  }
}

export const notificationService = NotificationService.getInstance();
export type {
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationCategory,
  NotificationTemplate,
  TemplateVariable,
  TemplateSettings,
  ActionButton,
  LocalizedContent,
  NotificationPayload,
  NotificationContent,
  Recipient,
  RecipientPreferences,
  SchedulingConfig,
  TrackingConfig,
  SentNotification,
  NotificationStats,
  ChannelStats,
  UserNotificationPreferences,
  NotificationHistoryEntry,
};

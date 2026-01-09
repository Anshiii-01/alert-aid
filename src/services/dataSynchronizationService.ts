/**
 * Data Synchronization Service
 * Offline-first data sync with conflict resolution and real-time updates
 */

// Sync status
type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline' | 'paused';

// Sync operation type
type SyncOperationType = 'create' | 'update' | 'delete' | 'upsert';

// Conflict resolution strategy
type ConflictStrategy = 'client_wins' | 'server_wins' | 'latest_wins' | 'manual' | 'merge';

// Entity type
type EntityType = 'alert' | 'user' | 'resource' | 'shelter' | 'volunteer' | 'donation' | 'report' | 'message' | 'location' | 'settings';

// Sync direction
type SyncDirection = 'push' | 'pull' | 'bidirectional';

// Sync entity
interface SyncEntity {
  id: string;
  entityType: EntityType;
  entityId: string;
  data: Record<string, unknown>;
  version: number;
  checksum: string;
  localModifiedAt: Date;
  serverModifiedAt?: Date;
  syncedAt?: Date;
  status: 'pending' | 'synced' | 'conflict' | 'failed';
  conflictData?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Sync operation
interface SyncOperation {
  id: string;
  operationType: SyncOperationType;
  entityType: EntityType;
  entityId: string;
  data: Record<string, unknown>;
  previousData?: Record<string, unknown>;
  version: number;
  deviceId: string;
  userId: string;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'conflict';
  retryCount: number;
  maxRetries: number;
  error?: string;
  conflictResolution?: ConflictResolution;
  createdAt: Date;
  completedAt?: Date;
}

// Conflict resolution
interface ConflictResolution {
  strategy: ConflictStrategy;
  clientData: Record<string, unknown>;
  serverData: Record<string, unknown>;
  resolvedData?: Record<string, unknown>;
  resolvedBy?: string;
  resolvedAt?: Date;
  autoResolved: boolean;
}

// Sync queue
interface SyncQueue {
  id: string;
  deviceId: string;
  userId: string;
  operations: SyncOperation[];
  status: SyncStatus;
  priority: number;
  batchSize: number;
  currentBatch: number;
  totalBatches: number;
  startedAt?: Date;
  completedAt?: Date;
  lastError?: string;
  retryAfter?: Date;
  createdAt: Date;
}

// Sync config
interface SyncConfig {
  id: string;
  entityType: EntityType;
  enabled: boolean;
  direction: SyncDirection;
  conflictStrategy: ConflictStrategy;
  syncInterval: number; // in seconds
  batchSize: number;
  maxRetries: number;
  retryDelay: number; // in seconds
  offlineSupport: boolean;
  compression: boolean;
  encryption: boolean;
  deltaSync: boolean;
  priority: number;
  filters?: SyncFilter[];
  transformations?: SyncTransformation[];
  createdAt: Date;
  updatedAt: Date;
}

// Sync filter
interface SyncFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'greater_than' | 'less_than';
  value: unknown;
}

// Sync transformation
interface SyncTransformation {
  type: 'rename' | 'omit' | 'transform' | 'default';
  sourceField: string;
  targetField?: string;
  transformer?: string;
  defaultValue?: unknown;
}

// Device sync state
interface DeviceSyncState {
  deviceId: string;
  userId: string;
  deviceName: string;
  deviceType: 'mobile' | 'web' | 'desktop' | 'tablet';
  platform: string;
  appVersion: string;
  lastSyncAt?: Date;
  lastSyncStatus: SyncStatus;
  syncInProgress: boolean;
  pendingOperations: number;
  conflicts: number;
  isOnline: boolean;
  lastOnlineAt: Date;
  bandwidth?: number;
  storage: {
    used: number;
    available: number;
    syncDataSize: number;
  };
  entityVersions: { entityType: EntityType; version: number; count: number }[];
  createdAt: Date;
  updatedAt: Date;
}

// Sync batch
interface SyncBatch {
  id: string;
  queueId: string;
  batchNumber: number;
  operations: SyncOperation[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial';
  startedAt?: Date;
  completedAt?: Date;
  processedCount: number;
  failedCount: number;
  conflictCount: number;
  bytesTransferred: number;
  duration?: number;
}

// Change event
interface ChangeEvent {
  id: string;
  eventType: 'created' | 'updated' | 'deleted';
  entityType: EntityType;
  entityId: string;
  data: Record<string, unknown>;
  previousData?: Record<string, unknown>;
  changedFields: string[];
  userId: string;
  deviceId: string;
  version: number;
  timestamp: Date;
  propagated: boolean;
  subscribers: string[];
}

// Sync session
interface SyncSession {
  id: string;
  deviceId: string;
  userId: string;
  direction: SyncDirection;
  status: SyncStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  operationsPushed: number;
  operationsPulled: number;
  conflictsResolved: number;
  errors: number;
  bytesUploaded: number;
  bytesDownloaded: number;
  entityStats: { entityType: EntityType; pushed: number; pulled: number; conflicts: number }[];
}

// Sync analytics
interface SyncAnalytics {
  period: { start: Date; end: Date };
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  avgDuration: number;
  totalDataTransferred: number;
  totalOperations: number;
  conflicts: number;
  conflictsResolved: number;
  byDirection: { direction: SyncDirection; count: number }[];
  byEntity: { entityType: EntityType; operations: number; conflicts: number }[];
  byDevice: { deviceId: string; syncs: number; operations: number }[];
  byHour: { hour: number; count: number }[];
  errorRates: { entityType: EntityType; errorRate: number }[];
}

// Webhook subscription
interface WebhookSubscription {
  id: string;
  url: string;
  events: ('sync_completed' | 'sync_failed' | 'conflict_detected' | 'offline_data_available')[];
  entityTypes: EntityType[];
  secret: string;
  enabled: boolean;
  retries: number;
  lastDelivery?: Date;
  failureCount: number;
  createdAt: Date;
}

// Offline data package
interface OfflineDataPackage {
  id: string;
  userId: string;
  deviceId: string;
  entityTypes: EntityType[];
  data: { entityType: EntityType; entities: SyncEntity[] }[];
  totalEntities: number;
  sizeBytes: number;
  compressed: boolean;
  encrypted: boolean;
  expiresAt: Date;
  downloadedAt?: Date;
  version: number;
  checksum: string;
  createdAt: Date;
}

class DataSynchronizationService {
  private static instance: DataSynchronizationService;
  private syncEntities: Map<string, SyncEntity> = new Map();
  private syncOperations: Map<string, SyncOperation> = new Map();
  private syncQueues: Map<string, SyncQueue> = new Map();
  private syncConfigs: Map<EntityType, SyncConfig> = new Map();
  private deviceStates: Map<string, DeviceSyncState> = new Map();
  private changeEvents: ChangeEvent[] = [];
  private syncSessions: SyncSession[] = [];
  private webhooks: Map<string, WebhookSubscription> = new Map();
  private offlinePackages: Map<string, OfflineDataPackage> = new Map();
  private serverVersions: Map<string, number> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): DataSynchronizationService {
    if (!DataSynchronizationService.instance) {
      DataSynchronizationService.instance = new DataSynchronizationService();
    }
    return DataSynchronizationService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize sync configs for each entity type
    const entityTypes: EntityType[] = ['alert', 'user', 'resource', 'shelter', 'volunteer', 'donation', 'report', 'message', 'location', 'settings'];

    entityTypes.forEach((entityType, index) => {
      const config: SyncConfig = {
        id: `cfg-${entityType}`,
        entityType,
        enabled: true,
        direction: entityType === 'settings' ? 'bidirectional' : entityType === 'alert' ? 'pull' : 'bidirectional',
        conflictStrategy: entityType === 'settings' ? 'latest_wins' : 'server_wins',
        syncInterval: entityType === 'alert' ? 30 : entityType === 'message' ? 10 : 60,
        batchSize: entityType === 'message' ? 100 : 50,
        maxRetries: 3,
        retryDelay: 5,
        offlineSupport: true,
        compression: true,
        encryption: entityType === 'user' || entityType === 'settings',
        deltaSync: true,
        priority: entityType === 'alert' ? 1 : entityType === 'message' ? 2 : index + 3,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.syncConfigs.set(entityType, config);
      this.serverVersions.set(entityType, Math.floor(Math.random() * 1000) + 1000);
    });

    // Create sample devices
    const devices = [
      { id: 'dev-001', name: 'iPhone 15', type: 'mobile' as const, platform: 'iOS 17' },
      { id: 'dev-002', name: 'Chrome Browser', type: 'web' as const, platform: 'Web' },
      { id: 'dev-003', name: 'Samsung Galaxy', type: 'mobile' as const, platform: 'Android 14' },
      { id: 'dev-004', name: 'iPad Pro', type: 'tablet' as const, platform: 'iPadOS 17' },
      { id: 'dev-005', name: 'MacBook Pro', type: 'desktop' as const, platform: 'macOS 14' },
    ];

    devices.forEach((device) => {
      const state: DeviceSyncState = {
        deviceId: device.id,
        userId: `user-${Math.floor(Math.random() * 10) + 1}`,
        deviceName: device.name,
        deviceType: device.type,
        platform: device.platform,
        appVersion: '2.5.0',
        lastSyncAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        lastSyncStatus: Math.random() > 0.1 ? 'idle' : 'error',
        syncInProgress: false,
        pendingOperations: Math.floor(Math.random() * 20),
        conflicts: Math.floor(Math.random() * 3),
        isOnline: Math.random() > 0.2,
        lastOnlineAt: new Date(),
        bandwidth: Math.floor(Math.random() * 50) + 10,
        storage: {
          used: Math.floor(Math.random() * 500) * 1024 * 1024,
          available: Math.floor(Math.random() * 2000 + 500) * 1024 * 1024,
          syncDataSize: Math.floor(Math.random() * 100) * 1024 * 1024,
        },
        entityVersions: entityTypes.map((et) => ({
          entityType: et,
          version: Math.floor(Math.random() * 100) + 900,
          count: Math.floor(Math.random() * 500),
        })),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.deviceStates.set(device.id, state);
    });

    // Create sample sync entities
    for (let i = 0; i < 500; i++) {
      const entityType = entityTypes[i % entityTypes.length];
      const entity: SyncEntity = {
        id: `se-${i.toString().padStart(6, '0')}`,
        entityType,
        entityId: `${entityType}-${Math.floor(i / entityTypes.length) + 1}`,
        data: { name: `Sample ${entityType} ${i}`, value: Math.random() * 100 },
        version: Math.floor(Math.random() * 50) + 1,
        checksum: this.generateChecksum(`data-${i}`),
        localModifiedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        serverModifiedAt: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000),
        syncedAt: Math.random() > 0.1 ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : undefined,
        status: Math.random() > 0.9 ? 'pending' : Math.random() > 0.95 ? 'conflict' : 'synced',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.syncEntities.set(entity.id, entity);
    }

    // Create sample sync operations
    const operationTypes: SyncOperationType[] = ['create', 'update', 'delete'];
    for (let i = 0; i < 200; i++) {
      const entityType = entityTypes[i % entityTypes.length];
      const operation: SyncOperation = {
        id: `op-${i.toString().padStart(6, '0')}`,
        operationType: operationTypes[i % operationTypes.length],
        entityType,
        entityId: `${entityType}-${Math.floor(i / 10) + 1}`,
        data: { modified: true, timestamp: Date.now() },
        version: Math.floor(Math.random() * 50) + 1,
        deviceId: devices[i % devices.length].id,
        userId: `user-${(i % 10) + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        status: i < 50 ? 'pending' : i < 150 ? 'completed' : Math.random() > 0.5 ? 'failed' : 'conflict',
        retryCount: Math.floor(Math.random() * 3),
        maxRetries: 3,
        createdAt: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000),
        completedAt: i >= 50 && i < 150 ? new Date() : undefined,
      };
      this.syncOperations.set(operation.id, operation);
    }

    // Create sample change events
    for (let i = 0; i < 100; i++) {
      const entityType = entityTypes[i % entityTypes.length];
      const event: ChangeEvent = {
        id: `evt-${i.toString().padStart(6, '0')}`,
        eventType: i % 3 === 0 ? 'created' : i % 3 === 1 ? 'updated' : 'deleted',
        entityType,
        entityId: `${entityType}-${Math.floor(i / 10) + 1}`,
        data: { updated: true },
        changedFields: ['field1', 'field2'],
        userId: `user-${(i % 10) + 1}`,
        deviceId: devices[i % devices.length].id,
        version: Math.floor(Math.random() * 50) + 1,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        propagated: Math.random() > 0.2,
        subscribers: [`user-${(i + 1) % 10 + 1}`, `user-${(i + 2) % 10 + 1}`],
      };
      this.changeEvents.push(event);
    }

    // Create sample sync sessions
    for (let i = 0; i < 50; i++) {
      const session: SyncSession = {
        id: `sess-${i.toString().padStart(6, '0')}`,
        deviceId: devices[i % devices.length].id,
        userId: `user-${(i % 10) + 1}`,
        direction: 'bidirectional',
        status: i < 5 ? 'syncing' : Math.random() > 0.9 ? 'error' : 'idle',
        startedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        completedAt: i >= 5 ? new Date(Date.now() - Math.random() * 23 * 60 * 60 * 1000) : undefined,
        duration: Math.floor(Math.random() * 30000) + 1000,
        operationsPushed: Math.floor(Math.random() * 50),
        operationsPulled: Math.floor(Math.random() * 100),
        conflictsResolved: Math.floor(Math.random() * 5),
        errors: Math.floor(Math.random() * 3),
        bytesUploaded: Math.floor(Math.random() * 1024 * 1024),
        bytesDownloaded: Math.floor(Math.random() * 5 * 1024 * 1024),
        entityStats: entityTypes.slice(0, 5).map((et) => ({
          entityType: et,
          pushed: Math.floor(Math.random() * 20),
          pulled: Math.floor(Math.random() * 50),
          conflicts: Math.floor(Math.random() * 2),
        })),
      };
      this.syncSessions.push(session);
    }
  }

  /**
   * Generate checksum
   */
  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Track local change
   */
  public trackChange(data: {
    operationType: SyncOperationType;
    entityType: EntityType;
    entityId: string;
    data: Record<string, unknown>;
    previousData?: Record<string, unknown>;
    deviceId: string;
    userId: string;
  }): SyncOperation {
    const config = this.syncConfigs.get(data.entityType);
    if (!config?.enabled) {
      throw new Error(`Sync is not enabled for entity type: ${data.entityType}`);
    }

    const currentVersion = this.getEntityVersion(data.entityType, data.entityId);

    const operation: SyncOperation = {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      operationType: data.operationType,
      entityType: data.entityType,
      entityId: data.entityId,
      data: data.data,
      previousData: data.previousData,
      version: currentVersion + 1,
      deviceId: data.deviceId,
      userId: data.userId,
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0,
      maxRetries: config.maxRetries,
      createdAt: new Date(),
    };

    this.syncOperations.set(operation.id, operation);

    // Update or create sync entity
    const entityKey = `${data.entityType}-${data.entityId}`;
    const existingEntity = Array.from(this.syncEntities.values())
      .find((e) => e.entityType === data.entityType && e.entityId === data.entityId);

    if (existingEntity) {
      existingEntity.data = data.data;
      existingEntity.version = operation.version;
      existingEntity.localModifiedAt = new Date();
      existingEntity.status = 'pending';
      existingEntity.checksum = this.generateChecksum(JSON.stringify(data.data));
      existingEntity.updatedAt = new Date();
    } else {
      const newEntity: SyncEntity = {
        id: `se-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        entityType: data.entityType,
        entityId: data.entityId,
        data: data.data,
        version: operation.version,
        checksum: this.generateChecksum(JSON.stringify(data.data)),
        localModifiedAt: new Date(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.syncEntities.set(newEntity.id, newEntity);
    }

    // Create change event
    const changeEvent: ChangeEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      eventType: data.operationType === 'create' ? 'created' : data.operationType === 'delete' ? 'deleted' : 'updated',
      entityType: data.entityType,
      entityId: data.entityId,
      data: data.data,
      previousData: data.previousData,
      changedFields: data.previousData ? this.getChangedFields(data.previousData, data.data) : Object.keys(data.data),
      userId: data.userId,
      deviceId: data.deviceId,
      version: operation.version,
      timestamp: new Date(),
      propagated: false,
      subscribers: [],
    };

    this.changeEvents.push(changeEvent);
    this.emit('change_tracked', { operation, changeEvent });

    // Update device state
    this.updateDevicePendingCount(data.deviceId, 1);

    return operation;
  }

  /**
   * Get entity version
   */
  private getEntityVersion(entityType: EntityType, entityId: string): number {
    const entity = Array.from(this.syncEntities.values())
      .find((e) => e.entityType === entityType && e.entityId === entityId);
    return entity?.version || 0;
  }

  /**
   * Get changed fields
   */
  private getChangedFields(previous: Record<string, unknown>, current: Record<string, unknown>): string[] {
    const changed: string[] = [];
    const allKeys = new Set([...Object.keys(previous), ...Object.keys(current)]);

    allKeys.forEach((key) => {
      if (JSON.stringify(previous[key]) !== JSON.stringify(current[key])) {
        changed.push(key);
      }
    });

    return changed;
  }

  /**
   * Update device pending count
   */
  private updateDevicePendingCount(deviceId: string, delta: number): void {
    const device = this.deviceStates.get(deviceId);
    if (device) {
      device.pendingOperations += delta;
      device.updatedAt = new Date();
    }
  }

  /**
   * Start sync
   */
  public async startSync(deviceId: string, options?: {
    direction?: SyncDirection;
    entityTypes?: EntityType[];
    force?: boolean;
  }): Promise<SyncSession> {
    const device = this.deviceStates.get(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    if (device.syncInProgress && !options?.force) {
      throw new Error('Sync already in progress');
    }

    const session: SyncSession = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      deviceId,
      userId: device.userId,
      direction: options?.direction || 'bidirectional',
      status: 'syncing',
      startedAt: new Date(),
      operationsPushed: 0,
      operationsPulled: 0,
      conflictsResolved: 0,
      errors: 0,
      bytesUploaded: 0,
      bytesDownloaded: 0,
      entityStats: [],
    };

    device.syncInProgress = true;
    device.lastSyncStatus = 'syncing';
    device.updatedAt = new Date();

    this.syncSessions.push(session);
    this.emit('sync_started', session);

    try {
      // Get pending operations for this device
      const pendingOps = Array.from(this.syncOperations.values())
        .filter((op) => op.deviceId === deviceId && op.status === 'pending')
        .filter((op) => !options?.entityTypes || options.entityTypes.includes(op.entityType));

      // Process operations
      for (const op of pendingOps) {
        try {
          await this.processOperation(op);
          session.operationsPushed++;
          session.bytesUploaded += JSON.stringify(op.data).length;
        } catch (error) {
          if (this.isConflict(error)) {
            const resolved = await this.resolveConflict(op);
            if (resolved) {
              session.conflictsResolved++;
            } else {
              session.errors++;
            }
          } else {
            session.errors++;
          }
        }
      }

      // Pull server changes
      const entityTypes = options?.entityTypes || Array.from(this.syncConfigs.keys());
      for (const entityType of entityTypes) {
        const config = this.syncConfigs.get(entityType);
        if (!config?.enabled || config.direction === 'push') continue;

        const serverChanges = await this.pullServerChanges(deviceId, entityType);
        session.operationsPulled += serverChanges.count;
        session.bytesDownloaded += serverChanges.bytes;
      }

      // Update session
      session.status = 'idle';
      session.completedAt = new Date();
      session.duration = session.completedAt.getTime() - session.startedAt.getTime();

      // Update device state
      device.syncInProgress = false;
      device.lastSyncAt = new Date();
      device.lastSyncStatus = session.errors > 0 ? 'error' : 'idle';
      device.pendingOperations = Array.from(this.syncOperations.values())
        .filter((op) => op.deviceId === deviceId && op.status === 'pending').length;

      this.emit('sync_completed', session);
    } catch (error) {
      session.status = 'error';
      session.completedAt = new Date();
      session.duration = session.completedAt.getTime() - session.startedAt.getTime();

      device.syncInProgress = false;
      device.lastSyncStatus = 'error';

      this.emit('sync_failed', { session, error });
    }

    return session;
  }

  /**
   * Process operation
   */
  private async processOperation(operation: SyncOperation): Promise<void> {
    operation.status = 'processing';

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100));

    // Simulate success (95% success rate)
    if (Math.random() > 0.05) {
      operation.status = 'completed';
      operation.completedAt = new Date();

      // Update entity status
      const entity = Array.from(this.syncEntities.values())
        .find((e) => e.entityType === operation.entityType && e.entityId === operation.entityId);

      if (entity) {
        entity.status = 'synced';
        entity.syncedAt = new Date();
        entity.serverModifiedAt = new Date();
        entity.updatedAt = new Date();
      }
    } else {
      throw new Error('Server error');
    }
  }

  /**
   * Check if error is conflict
   */
  private isConflict(error: unknown): boolean {
    return error instanceof Error && error.message.includes('conflict');
  }

  /**
   * Resolve conflict
   */
  private async resolveConflict(operation: SyncOperation): Promise<boolean> {
    const config = this.syncConfigs.get(operation.entityType);
    if (!config) return false;

    const serverData = await this.getServerData(operation.entityType, operation.entityId);
    const clientData = operation.data;

    let resolvedData: Record<string, unknown>;

    switch (config.conflictStrategy) {
      case 'client_wins':
        resolvedData = clientData;
        break;
      case 'server_wins':
        resolvedData = serverData;
        break;
      case 'latest_wins':
        // Compare timestamps
        resolvedData = operation.timestamp > new Date(serverData._modifiedAt as string) ? clientData : serverData;
        break;
      case 'merge':
        resolvedData = { ...serverData, ...clientData };
        break;
      case 'manual':
        operation.status = 'conflict';
        operation.conflictResolution = {
          strategy: 'manual',
          clientData,
          serverData,
          autoResolved: false,
        };
        return false;
      default:
        resolvedData = serverData;
    }

    operation.data = resolvedData;
    operation.conflictResolution = {
      strategy: config.conflictStrategy,
      clientData,
      serverData,
      resolvedData,
      resolvedAt: new Date(),
      autoResolved: true,
    };

    return true;
  }

  /**
   * Get server data (mock)
   */
  private async getServerData(entityType: EntityType, entityId: string): Promise<Record<string, unknown>> {
    return {
      id: entityId,
      type: entityType,
      _modifiedAt: new Date(Date.now() - Math.random() * 60000).toISOString(),
      serverField: 'server_value',
    };
  }

  /**
   * Pull server changes
   */
  private async pullServerChanges(deviceId: string, entityType: EntityType): Promise<{ count: number; bytes: number }> {
    // Simulate pulling changes
    const changeCount = Math.floor(Math.random() * 20);
    const bytes = changeCount * Math.floor(Math.random() * 500 + 100);

    return { count: changeCount, bytes };
  }

  /**
   * Get pending operations
   */
  public getPendingOperations(deviceId?: string, entityType?: EntityType): SyncOperation[] {
    let operations = Array.from(this.syncOperations.values())
      .filter((op) => op.status === 'pending');

    if (deviceId) {
      operations = operations.filter((op) => op.deviceId === deviceId);
    }

    if (entityType) {
      operations = operations.filter((op) => op.entityType === entityType);
    }

    return operations.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  /**
   * Get conflicts
   */
  public getConflicts(deviceId?: string): SyncOperation[] {
    let operations = Array.from(this.syncOperations.values())
      .filter((op) => op.status === 'conflict');

    if (deviceId) {
      operations = operations.filter((op) => op.deviceId === deviceId);
    }

    return operations;
  }

  /**
   * Manually resolve conflict
   */
  public resolveConflictManually(operationId: string, resolution: 'client' | 'server' | 'custom', customData?: Record<string, unknown>): boolean {
    const operation = this.syncOperations.get(operationId);
    if (!operation || operation.status !== 'conflict') return false;

    const conflict = operation.conflictResolution;
    if (!conflict) return false;

    let resolvedData: Record<string, unknown>;

    switch (resolution) {
      case 'client':
        resolvedData = conflict.clientData;
        break;
      case 'server':
        resolvedData = conflict.serverData;
        break;
      case 'custom':
        if (!customData) return false;
        resolvedData = customData;
        break;
    }

    operation.data = resolvedData;
    operation.status = 'pending';
    conflict.resolvedData = resolvedData;
    conflict.resolvedAt = new Date();
    conflict.resolvedBy = 'user';
    conflict.autoResolved = false;

    this.emit('conflict_resolved', operation);
    return true;
  }

  /**
   * Get device sync state
   */
  public getDeviceSyncState(deviceId: string): DeviceSyncState | undefined {
    return this.deviceStates.get(deviceId);
  }

  /**
   * Get all device states
   */
  public getAllDeviceStates(userId?: string): DeviceSyncState[] {
    let states = Array.from(this.deviceStates.values());
    if (userId) {
      states = states.filter((s) => s.userId === userId);
    }
    return states;
  }

  /**
   * Register device
   */
  public registerDevice(data: {
    deviceId: string;
    userId: string;
    deviceName: string;
    deviceType: DeviceSyncState['deviceType'];
    platform: string;
    appVersion: string;
  }): DeviceSyncState {
    const state: DeviceSyncState = {
      ...data,
      lastSyncStatus: 'idle',
      syncInProgress: false,
      pendingOperations: 0,
      conflicts: 0,
      isOnline: true,
      lastOnlineAt: new Date(),
      storage: { used: 0, available: 0, syncDataSize: 0 },
      entityVersions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.deviceStates.set(data.deviceId, state);
    this.emit('device_registered', state);

    return state;
  }

  /**
   * Update device online status
   */
  public updateDeviceOnlineStatus(deviceId: string, isOnline: boolean): void {
    const device = this.deviceStates.get(deviceId);
    if (device) {
      device.isOnline = isOnline;
      if (isOnline) {
        device.lastOnlineAt = new Date();
      }
      device.updatedAt = new Date();

      this.emit('device_status_changed', { deviceId, isOnline });
    }
  }

  /**
   * Get sync config
   */
  public getSyncConfig(entityType: EntityType): SyncConfig | undefined {
    return this.syncConfigs.get(entityType);
  }

  /**
   * Update sync config
   */
  public updateSyncConfig(entityType: EntityType, updates: Partial<Omit<SyncConfig, 'id' | 'entityType' | 'createdAt' | 'updatedAt'>>): SyncConfig {
    const existing = this.syncConfigs.get(entityType);
    if (!existing) {
      throw new Error('Sync config not found');
    }

    const updated: SyncConfig = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.syncConfigs.set(entityType, updated);
    this.emit('config_updated', updated);

    return updated;
  }

  /**
   * Get sync analytics
   */
  public getAnalytics(period: { start: Date; end: Date }): SyncAnalytics {
    const periodSessions = this.syncSessions.filter(
      (s) => s.startedAt >= period.start && s.startedAt <= period.end
    );

    const byDirection = new Map<SyncDirection, number>();
    const byEntity = new Map<EntityType, { operations: number; conflicts: number }>();
    const byDevice = new Map<string, { syncs: number; operations: number }>();
    const byHour = new Map<number, number>();

    let totalOps = 0, totalConflicts = 0, totalConflictsResolved = 0;

    periodSessions.forEach((session) => {
      // By direction
      byDirection.set(session.direction, (byDirection.get(session.direction) || 0) + 1);

      // By device
      const deviceStats = byDevice.get(session.deviceId) || { syncs: 0, operations: 0 };
      deviceStats.syncs++;
      deviceStats.operations += session.operationsPushed + session.operationsPulled;
      byDevice.set(session.deviceId, deviceStats);

      // By hour
      const hour = session.startedAt.getHours();
      byHour.set(hour, (byHour.get(hour) || 0) + 1);

      // Entity stats
      session.entityStats.forEach((es) => {
        const entityStats = byEntity.get(es.entityType) || { operations: 0, conflicts: 0 };
        entityStats.operations += es.pushed + es.pulled;
        entityStats.conflicts += es.conflicts;
        byEntity.set(es.entityType, entityStats);
      });

      totalOps += session.operationsPushed + session.operationsPulled;
      totalConflictsResolved += session.conflictsResolved;
    });

    return {
      period,
      totalSyncs: periodSessions.length,
      successfulSyncs: periodSessions.filter((s) => s.status === 'idle').length,
      failedSyncs: periodSessions.filter((s) => s.status === 'error').length,
      avgDuration: periodSessions.length > 0
        ? periodSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / periodSessions.length
        : 0,
      totalDataTransferred: periodSessions.reduce((sum, s) => sum + s.bytesUploaded + s.bytesDownloaded, 0),
      totalOperations: totalOps,
      conflicts: totalConflicts,
      conflictsResolved: totalConflictsResolved,
      byDirection: Array.from(byDirection.entries()).map(([direction, count]) => ({ direction, count })),
      byEntity: Array.from(byEntity.entries()).map(([entityType, stats]) => ({ entityType, ...stats })),
      byDevice: Array.from(byDevice.entries()).map(([deviceId, stats]) => ({ deviceId, ...stats })),
      byHour: Array.from(byHour.entries()).map(([hour, count]) => ({ hour, count })),
      errorRates: [],
    };
  }

  /**
   * Get change events
   */
  public getChangeEvents(filters?: {
    entityType?: EntityType;
    entityId?: string;
    userId?: string;
    deviceId?: string;
    since?: Date;
  }, limit: number = 100): ChangeEvent[] {
    let events = [...this.changeEvents];

    if (filters?.entityType) {
      events = events.filter((e) => e.entityType === filters.entityType);
    }

    if (filters?.entityId) {
      events = events.filter((e) => e.entityId === filters.entityId);
    }

    if (filters?.userId) {
      events = events.filter((e) => e.userId === filters.userId);
    }

    if (filters?.deviceId) {
      events = events.filter((e) => e.deviceId === filters.deviceId);
    }

    if (filters?.since) {
      events = events.filter((e) => e.timestamp >= filters.since!);
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }

  /**
   * Create offline package
   */
  public createOfflinePackage(userId: string, deviceId: string, entityTypes: EntityType[]): OfflineDataPackage {
    const data = entityTypes.map((entityType) => {
      const entities = Array.from(this.syncEntities.values())
        .filter((e) => e.entityType === entityType);
      return { entityType, entities };
    });

    const totalEntities = data.reduce((sum, d) => sum + d.entities.length, 0);
    const sizeBytes = JSON.stringify(data).length;

    const pkg: OfflineDataPackage = {
      id: `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId,
      deviceId,
      entityTypes,
      data,
      totalEntities,
      sizeBytes,
      compressed: true,
      encrypted: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      version: Date.now(),
      checksum: this.generateChecksum(JSON.stringify(data)),
      createdAt: new Date(),
    };

    this.offlinePackages.set(pkg.id, pkg);
    return pkg;
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

export const dataSynchronizationService = DataSynchronizationService.getInstance();
export type {
  SyncStatus,
  SyncOperationType,
  ConflictStrategy,
  EntityType,
  SyncDirection,
  SyncEntity,
  SyncOperation,
  ConflictResolution,
  SyncQueue,
  SyncConfig,
  SyncFilter,
  SyncTransformation,
  DeviceSyncState,
  SyncBatch,
  ChangeEvent,
  SyncSession,
  SyncAnalytics,
  WebhookSubscription,
  OfflineDataPackage,
};

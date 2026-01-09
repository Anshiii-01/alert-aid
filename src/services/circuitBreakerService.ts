/**
 * Circuit Breaker Service
 * Comprehensive circuit breaker patterns, failure handling, and resilience management
 */

// Circuit State
type CircuitState = 'closed' | 'open' | 'half_open';

// Failure Type
type FailureType = 'timeout' | 'error' | 'exception' | 'slow_call' | 'rejection' | 'custom';

// Health Status
type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

// Recovery Strategy
type RecoveryStrategy = 'linear' | 'exponential' | 'fibonacci' | 'custom';

// Circuit Breaker
interface CircuitBreaker {
  id: string;
  name: string;
  description: string;
  service: string;
  endpoint?: string;
  state: CircuitState;
  enabled: boolean;
  config: CircuitConfig;
  metrics: CircuitMetrics;
  history: StateTransition[];
  health: CircuitHealth;
  fallback?: FallbackConfig;
  bulkhead?: BulkheadConfig;
  retry?: RetryConfig;
  timeout?: TimeoutConfig;
  listeners: CircuitListener[];
  metadata: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    lastStateChange: Date;
    version: number;
  };
}

// Circuit Config
interface CircuitConfig {
  failureRateThreshold: number;
  slowCallRateThreshold: number;
  slowCallDurationThreshold: number;
  permittedCallsInHalfOpen: number;
  slidingWindowType: 'count_based' | 'time_based';
  slidingWindowSize: number;
  minimumNumberOfCalls: number;
  waitDurationInOpenState: number;
  automaticTransitionEnabled: boolean;
  maxWaitDuration: number;
  recordExceptions: string[];
  ignoreExceptions: string[];
  recordFailurePredicate?: string;
  successRateThreshold?: number;
}

// Circuit Metrics
interface CircuitMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    slow: number;
    rejected: number;
  };
  rates: {
    failureRate: number;
    slowCallRate: number;
    successRate: number;
    rejectionRate: number;
  };
  timing: {
    avgResponseTime: number;
    p50: number;
    p95: number;
    p99: number;
    maxResponseTime: number;
  };
  stateMetrics: {
    closedDuration: number;
    openDuration: number;
    halfOpenDuration: number;
    stateTransitions: number;
  };
  window: {
    type: string;
    size: number;
    entries: WindowEntry[];
  };
  last24h: {
    requests: number;
    failures: number;
    stateChanges: number;
  };
}

// Window Entry
interface WindowEntry {
  timestamp: Date;
  success: boolean;
  duration: number;
  errorType?: string;
  slow?: boolean;
}

// State Transition
interface StateTransition {
  id: string;
  timestamp: Date;
  fromState: CircuitState;
  toState: CircuitState;
  reason: string;
  metrics: {
    failureRate: number;
    slowCallRate: number;
    totalCalls: number;
  };
  manual: boolean;
  triggeredBy?: string;
}

// Circuit Health
interface CircuitHealth {
  status: HealthStatus;
  lastCheck: Date;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  uptime: number;
  degradedSince?: Date;
  healthChecks: HealthCheck[];
  dependencies: DependencyHealth[];
}

// Health Check
interface HealthCheck {
  id: string;
  name: string;
  type: 'ping' | 'http' | 'tcp' | 'custom';
  interval: number;
  timeout: number;
  endpoint?: string;
  lastResult: {
    success: boolean;
    responseTime: number;
    timestamp: Date;
    error?: string;
  };
  history: {
    timestamp: Date;
    success: boolean;
    responseTime: number;
  }[];
}

// Dependency Health
interface DependencyHealth {
  service: string;
  circuitId?: string;
  status: HealthStatus;
  latency: number;
  availability: number;
  lastError?: string;
}

// Fallback Config
interface FallbackConfig {
  enabled: boolean;
  type: 'static' | 'cache' | 'default' | 'function' | 'redirect';
  staticValue?: unknown;
  cacheKey?: string;
  cacheTtl?: number;
  functionName?: string;
  redirectUrl?: string;
  conditions: FallbackCondition[];
  metrics: {
    invocations: number;
    successes: number;
    failures: number;
  };
}

// Fallback Condition
interface FallbackCondition {
  type: 'exception' | 'status_code' | 'timeout' | 'circuit_open';
  value?: unknown;
  handler?: string;
}

// Bulkhead Config
interface BulkheadConfig {
  enabled: boolean;
  type: 'semaphore' | 'thread_pool';
  maxConcurrent: number;
  maxWait: number;
  queueSize?: number;
  threadPoolSize?: number;
  keepAlive?: number;
  fairness?: boolean;
  metrics: {
    availablePermits: number;
    activePermits: number;
    waitingThreads: number;
    rejectedCalls: number;
  };
}

// Retry Config
interface RetryConfig {
  enabled: boolean;
  maxAttempts: number;
  waitDuration: number;
  intervalFunction: RecoveryStrategy;
  multiplier?: number;
  maxWaitDuration?: number;
  retryOnResult?: string;
  retryExceptions: string[];
  ignoreExceptions: string[];
  failAfterMaxRetries: boolean;
  metrics: {
    totalRetries: number;
    successfulRetries: number;
    failedRetries: number;
    retriesExhausted: number;
  };
}

// Timeout Config
interface TimeoutConfig {
  enabled: boolean;
  duration: number;
  cancelRunningFuture: boolean;
  timeoutException?: string;
  metrics: {
    timedOutCalls: number;
    totalCalls: number;
    avgDuration: number;
  };
}

// Circuit Listener
interface CircuitListener {
  id: string;
  name: string;
  type: 'webhook' | 'email' | 'slack' | 'pagerduty' | 'custom';
  events: ('state_change' | 'failure' | 'slow_call' | 'success' | 'reset')[];
  config: {
    url?: string;
    email?: string;
    channel?: string;
    customHandler?: string;
  };
  enabled: boolean;
  lastTriggered?: Date;
}

// Service Circuit Group
interface ServiceCircuitGroup {
  id: string;
  name: string;
  description: string;
  service: string;
  circuits: string[];
  aggregateState: CircuitState;
  aggregateHealth: HealthStatus;
  strategy: 'any_open' | 'all_open' | 'majority_open' | 'weighted';
  weights?: Record<string, number>;
  config: {
    propagateState: boolean;
    cascadeOpen: boolean;
    cascadeTimeout: number;
  };
  metrics: {
    totalRequests: number;
    totalFailures: number;
    avgFailureRate: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

// Call Record
interface CallRecord {
  id: string;
  circuitId: string;
  timestamp: Date;
  duration: number;
  success: boolean;
  slow: boolean;
  circuitState: CircuitState;
  errorType?: FailureType;
  errorMessage?: string;
  retryAttempt?: number;
  fallbackUsed?: boolean;
  bulkheadRejected?: boolean;
  timedOut?: boolean;
  metadata?: Record<string, unknown>;
}

// Circuit Event
interface CircuitEvent {
  id: string;
  circuitId: string;
  circuitName: string;
  type: 'state_change' | 'call_failed' | 'call_slow' | 'call_success' | 'fallback_invoked' | 'bulkhead_rejected' | 'retry_attempted' | 'timeout' | 'health_check' | 'manual_override';
  timestamp: Date;
  data: Record<string, unknown>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// Dashboard Widget
interface DashboardWidget {
  id: string;
  type: 'state_indicator' | 'metrics_chart' | 'health_map' | 'failure_rate' | 'latency_histogram' | 'timeline' | 'dependency_graph';
  title: string;
  config: Record<string, unknown>;
  position: { x: number; y: number; width: number; height: number };
}

// Circuit Breaker Statistics
interface CircuitBreakerStatistics {
  overview: {
    totalCircuits: number;
    closedCircuits: number;
    openCircuits: number;
    halfOpenCircuits: number;
    healthyServices: number;
    degradedServices: number;
  };
  performance: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgFailureRate: number;
    avgLatency: number;
    p95Latency: number;
  };
  resilience: {
    fallbackInvocations: number;
    retryAttempts: number;
    timeouts: number;
    bulkheadRejections: number;
    circuitOpens: number;
  };
  trends: {
    date: string;
    requests: number;
    failures: number;
    stateChanges: number;
    avgLatency: number;
  }[];
}

class CircuitBreakerService {
  private static instance: CircuitBreakerService;
  private circuits: Map<string, CircuitBreaker> = new Map();
  private groups: Map<string, ServiceCircuitGroup> = new Map();
  private callRecords: Map<string, CallRecord[]> = new Map();
  private events: Map<string, CircuitEvent[]> = new Map();
  private widgets: Map<string, DashboardWidget> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CircuitBreakerService {
    if (!CircuitBreakerService.instance) {
      CircuitBreakerService.instance = new CircuitBreakerService();
    }
    return CircuitBreakerService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Circuit Breakers
    const circuitsData = [
      { name: 'User Service', service: 'user-service', state: 'closed' },
      { name: 'Alert Service', service: 'alert-service', state: 'closed' },
      { name: 'Notification Service', service: 'notification-service', state: 'half_open' },
      { name: 'Analytics Service', service: 'analytics-service', state: 'open' },
      { name: 'Email Gateway', service: 'email-gateway', state: 'closed' },
      { name: 'SMS Gateway', service: 'sms-gateway', state: 'closed' },
      { name: 'Payment Service', service: 'payment-service', state: 'closed' },
      { name: 'Search Service', service: 'search-service', state: 'half_open' },
      { name: 'Cache Service', service: 'cache-service', state: 'closed' },
      { name: 'External API', service: 'external-api', state: 'open' },
    ];

    circuitsData.forEach((c, idx) => {
      const state = c.state as CircuitState;
      const failureRate = state === 'open' ? 75 + Math.random() * 20 : state === 'half_open' ? 40 + Math.random() * 20 : Math.random() * 30;
      
      const circuit: CircuitBreaker = {
        id: `circuit-${(idx + 1).toString().padStart(4, '0')}`,
        name: c.name,
        description: `Circuit breaker for ${c.service}`,
        service: c.service,
        state,
        enabled: true,
        config: {
          failureRateThreshold: 50,
          slowCallRateThreshold: 80,
          slowCallDurationThreshold: 2000,
          permittedCallsInHalfOpen: 10,
          slidingWindowType: idx % 2 === 0 ? 'count_based' : 'time_based',
          slidingWindowSize: idx % 2 === 0 ? 100 : 60000,
          minimumNumberOfCalls: 10,
          waitDurationInOpenState: 60000,
          automaticTransitionEnabled: true,
          maxWaitDuration: 300000,
          recordExceptions: ['TimeoutException', 'ServiceUnavailableException', 'HttpServerErrorException'],
          ignoreExceptions: ['BadRequestException', 'ValidationException'],
        },
        metrics: {
          requests: {
            total: Math.floor(Math.random() * 100000) + 10000,
            successful: Math.floor(Math.random() * 90000) + 9000,
            failed: Math.floor(Math.random() * 5000) + 500,
            slow: Math.floor(Math.random() * 2000) + 200,
            rejected: state === 'open' ? Math.floor(Math.random() * 1000) + 100 : 0,
          },
          rates: {
            failureRate,
            slowCallRate: Math.random() * 20,
            successRate: 100 - failureRate,
            rejectionRate: state === 'open' ? Math.random() * 50 : 0,
          },
          timing: {
            avgResponseTime: Math.random() * 500 + 100,
            p50: Math.random() * 300 + 50,
            p95: Math.random() * 1000 + 500,
            p99: Math.random() * 2000 + 1000,
            maxResponseTime: Math.random() * 5000 + 2000,
          },
          stateMetrics: {
            closedDuration: state === 'closed' ? Math.floor(Math.random() * 86400000) : Math.floor(Math.random() * 3600000),
            openDuration: state === 'open' ? Math.floor(Math.random() * 3600000) : 0,
            halfOpenDuration: state === 'half_open' ? Math.floor(Math.random() * 60000) : 0,
            stateTransitions: Math.floor(Math.random() * 50) + 5,
          },
          window: {
            type: idx % 2 === 0 ? 'count_based' : 'time_based',
            size: idx % 2 === 0 ? 100 : 60000,
            entries: [],
          },
          last24h: {
            requests: Math.floor(Math.random() * 50000) + 5000,
            failures: Math.floor(Math.random() * 2500) + 250,
            stateChanges: Math.floor(Math.random() * 10),
          },
        },
        history: [
          {
            id: `trans-${idx}-1`,
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            fromState: state === 'closed' ? 'half_open' : 'closed',
            toState: state,
            reason: state === 'open' ? 'Failure rate exceeded threshold' : state === 'half_open' ? 'Wait duration in open state elapsed' : 'Success rate reached threshold',
            metrics: { failureRate, slowCallRate: Math.random() * 20, totalCalls: 100 },
            manual: false,
          },
        ],
        health: {
          status: state === 'open' ? 'unhealthy' : state === 'half_open' ? 'degraded' : 'healthy',
          lastCheck: new Date(),
          consecutiveFailures: state === 'open' ? Math.floor(Math.random() * 10) + 5 : 0,
          consecutiveSuccesses: state === 'closed' ? Math.floor(Math.random() * 100) + 10 : 0,
          uptime: state === 'closed' ? 99.5 + Math.random() * 0.5 : state === 'half_open' ? 95 + Math.random() * 3 : 80 + Math.random() * 10,
          degradedSince: state !== 'closed' ? new Date(Date.now() - Math.random() * 60 * 60 * 1000) : undefined,
          healthChecks: [
            {
              id: `hc-${idx}-1`,
              name: 'HTTP Health Check',
              type: 'http',
              interval: 30000,
              timeout: 5000,
              endpoint: `/health`,
              lastResult: {
                success: state !== 'open',
                responseTime: Math.random() * 100 + 50,
                timestamp: new Date(),
                error: state === 'open' ? 'Connection refused' : undefined,
              },
              history: [],
            },
          ],
          dependencies: [
            {
              service: 'database',
              status: 'healthy',
              latency: Math.random() * 50 + 10,
              availability: 99.9,
            },
            {
              service: 'cache',
              status: idx % 3 === 0 ? 'degraded' : 'healthy',
              latency: Math.random() * 20 + 5,
              availability: 99.5,
            },
          ],
        },
        fallback: {
          enabled: true,
          type: idx % 3 === 0 ? 'cache' : idx % 3 === 1 ? 'static' : 'default',
          staticValue: { status: 'fallback', message: 'Service temporarily unavailable' },
          cacheKey: `fallback:${c.service}`,
          cacheTtl: 300,
          conditions: [
            { type: 'circuit_open' },
            { type: 'timeout' },
            { type: 'exception', value: 'ServiceUnavailableException' },
          ],
          metrics: {
            invocations: state !== 'closed' ? Math.floor(Math.random() * 1000) + 100 : 0,
            successes: state !== 'closed' ? Math.floor(Math.random() * 900) + 90 : 0,
            failures: state !== 'closed' ? Math.floor(Math.random() * 100) + 10 : 0,
          },
        },
        bulkhead: {
          enabled: true,
          type: idx % 2 === 0 ? 'semaphore' : 'thread_pool',
          maxConcurrent: 20 + idx * 5,
          maxWait: 1000,
          queueSize: 10,
          threadPoolSize: idx % 2 === 1 ? 10 : undefined,
          keepAlive: 60000,
          fairness: true,
          metrics: {
            availablePermits: Math.floor(Math.random() * 10) + 5,
            activePermits: Math.floor(Math.random() * 15) + 5,
            waitingThreads: Math.floor(Math.random() * 5),
            rejectedCalls: Math.floor(Math.random() * 100),
          },
        },
        retry: {
          enabled: true,
          maxAttempts: 3,
          waitDuration: 1000,
          intervalFunction: 'exponential',
          multiplier: 2,
          maxWaitDuration: 10000,
          retryExceptions: ['TimeoutException', 'ServiceUnavailableException'],
          ignoreExceptions: ['BadRequestException'],
          failAfterMaxRetries: true,
          metrics: {
            totalRetries: Math.floor(Math.random() * 5000) + 500,
            successfulRetries: Math.floor(Math.random() * 4000) + 400,
            failedRetries: Math.floor(Math.random() * 500) + 50,
            retriesExhausted: Math.floor(Math.random() * 100) + 10,
          },
        },
        timeout: {
          enabled: true,
          duration: 5000,
          cancelRunningFuture: true,
          timeoutException: 'TimeoutException',
          metrics: {
            timedOutCalls: Math.floor(Math.random() * 500) + 50,
            totalCalls: Math.floor(Math.random() * 100000) + 10000,
            avgDuration: Math.random() * 2000 + 500,
          },
        },
        listeners: [
          {
            id: `listener-${idx}-1`,
            name: 'Slack Notification',
            type: 'slack',
            events: ['state_change'],
            config: { channel: '#alerts' },
            enabled: true,
          },
          {
            id: `listener-${idx}-2`,
            name: 'PagerDuty Alert',
            type: 'pagerduty',
            events: ['state_change', 'failure'],
            config: {},
            enabled: state === 'open' || state === 'half_open',
          },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          lastStateChange: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          version: Math.floor(Math.random() * 10) + 1,
        },
      };
      this.circuits.set(circuit.id, circuit);

      // Generate call records for each circuit
      const records: CallRecord[] = [];
      for (let r = 0; r < 50; r++) {
        const success = Math.random() > (failureRate / 100);
        const record: CallRecord = {
          id: `record-${circuit.id}-${r}`,
          circuitId: circuit.id,
          timestamp: new Date(Date.now() - r * 60 * 1000),
          duration: Math.random() * 2000 + 100,
          success,
          slow: Math.random() < 0.1,
          circuitState: circuit.state,
          errorType: !success ? (['timeout', 'error', 'exception'] as FailureType[])[Math.floor(Math.random() * 3)] : undefined,
          errorMessage: !success ? 'Service temporarily unavailable' : undefined,
          retryAttempt: Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : undefined,
          fallbackUsed: !success && Math.random() < 0.5,
          bulkheadRejected: Math.random() < 0.05,
          timedOut: !success && Math.random() < 0.3,
        };
        records.push(record);
      }
      this.callRecords.set(circuit.id, records);

      // Generate events for each circuit
      const circuitEvents: CircuitEvent[] = [];
      for (let e = 0; e < 20; e++) {
        const eventTypes = ['state_change', 'call_failed', 'call_slow', 'call_success', 'fallback_invoked', 'retry_attempted'] as CircuitEvent['type'][];
        const event: CircuitEvent = {
          id: `event-${circuit.id}-${e}`,
          circuitId: circuit.id,
          circuitName: circuit.name,
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          timestamp: new Date(Date.now() - e * 5 * 60 * 1000),
          data: {},
          severity: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)] as CircuitEvent['severity'],
        };
        circuitEvents.push(event);
      }
      this.events.set(circuit.id, circuitEvents);
    });

    // Initialize Service Groups
    const groupsData = [
      { name: 'Core Services', services: ['user-service', 'alert-service'] },
      { name: 'Communication Services', services: ['notification-service', 'email-gateway', 'sms-gateway'] },
      { name: 'External Integrations', services: ['external-api', 'payment-service'] },
    ];

    groupsData.forEach((g, idx) => {
      const circuitIds = Array.from(this.circuits.values())
        .filter((c) => g.services.includes(c.service))
        .map((c) => c.id);

      const circuits = circuitIds.map((id) => this.circuits.get(id)!);
      const hasOpen = circuits.some((c) => c.state === 'open');
      const hasHalfOpen = circuits.some((c) => c.state === 'half_open');

      const group: ServiceCircuitGroup = {
        id: `group-${(idx + 1).toString().padStart(4, '0')}`,
        name: g.name,
        description: `Circuit breaker group for ${g.name.toLowerCase()}`,
        service: g.services[0],
        circuits: circuitIds,
        aggregateState: hasOpen ? 'open' : hasHalfOpen ? 'half_open' : 'closed',
        aggregateHealth: hasOpen ? 'unhealthy' : hasHalfOpen ? 'degraded' : 'healthy',
        strategy: 'any_open',
        config: {
          propagateState: true,
          cascadeOpen: false,
          cascadeTimeout: 30000,
        },
        metrics: {
          totalRequests: circuits.reduce((sum, c) => sum + c.metrics.requests.total, 0),
          totalFailures: circuits.reduce((sum, c) => sum + c.metrics.requests.failed, 0),
          avgFailureRate: circuits.reduce((sum, c) => sum + c.metrics.rates.failureRate, 0) / circuits.length,
        },
        metadata: {
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      };
      this.groups.set(group.id, group);
    });

    // Initialize Dashboard Widgets
    const widgetsData = [
      { type: 'state_indicator', title: 'Circuit States Overview' },
      { type: 'metrics_chart', title: 'Request Metrics' },
      { type: 'health_map', title: 'Service Health Map' },
      { type: 'failure_rate', title: 'Failure Rate Trends' },
      { type: 'latency_histogram', title: 'Latency Distribution' },
      { type: 'timeline', title: 'State Change Timeline' },
    ];

    widgetsData.forEach((w, idx) => {
      const widget: DashboardWidget = {
        id: `widget-${(idx + 1).toString().padStart(4, '0')}`,
        type: w.type as DashboardWidget['type'],
        title: w.title,
        config: {},
        position: { x: (idx % 3) * 4, y: Math.floor(idx / 3) * 3, width: 4, height: 3 },
      };
      this.widgets.set(widget.id, widget);
    });
  }

  // Execute Call with Circuit Breaker
  public async executeCall<T>(circuitId: string, call: () => Promise<T>): Promise<T> {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) throw new Error('Circuit not found');
    if (!circuit.enabled) return call();

    // Check if circuit is open
    if (circuit.state === 'open') {
      if (this.shouldTransitionToHalfOpen(circuit)) {
        this.transitionState(circuit, 'half_open', 'Wait duration elapsed');
      } else {
        this.recordRejection(circuit);
        if (circuit.fallback?.enabled) {
          return this.executeFallback(circuit) as T;
        }
        throw new Error('Circuit is open');
      }
    }

    // Execute call with timeout
    const startTime = Date.now();
    try {
      const result = await this.executeWithTimeout(circuit, call);
      const duration = Date.now() - startTime;
      this.recordSuccess(circuit, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordFailure(circuit, duration, error as Error);
      
      if (circuit.fallback?.enabled) {
        return this.executeFallback(circuit) as T;
      }
      throw error;
    }
  }

  private async executeWithTimeout<T>(circuit: CircuitBreaker, call: () => Promise<T>): Promise<T> {
    if (!circuit.timeout?.enabled) return call();

    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout'));
      }, circuit.timeout!.duration);

      call()
        .then((result) => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  private shouldTransitionToHalfOpen(circuit: CircuitBreaker): boolean {
    const lastTransition = circuit.history[circuit.history.length - 1];
    if (!lastTransition) return true;
    
    const elapsedTime = Date.now() - lastTransition.timestamp.getTime();
    return elapsedTime >= circuit.config.waitDurationInOpenState;
  }

  private recordSuccess(circuit: CircuitBreaker, duration: number): void {
    circuit.metrics.requests.total++;
    circuit.metrics.requests.successful++;
    circuit.health.consecutiveSuccesses++;
    circuit.health.consecutiveFailures = 0;

    if (duration > circuit.config.slowCallDurationThreshold) {
      circuit.metrics.requests.slow++;
    }

    this.updateRates(circuit);
    this.checkStateTransition(circuit);
    this.emit('call.success', { circuitId: circuit.id, duration });
  }

  private recordFailure(circuit: CircuitBreaker, duration: number, error: Error): void {
    circuit.metrics.requests.total++;
    circuit.metrics.requests.failed++;
    circuit.health.consecutiveFailures++;
    circuit.health.consecutiveSuccesses = 0;

    if (duration > circuit.config.slowCallDurationThreshold) {
      circuit.metrics.requests.slow++;
    }

    this.updateRates(circuit);
    this.checkStateTransition(circuit);
    this.emit('call.failure', { circuitId: circuit.id, duration, error: error.message });
  }

  private recordRejection(circuit: CircuitBreaker): void {
    circuit.metrics.requests.rejected++;
    this.emit('call.rejected', { circuitId: circuit.id });
  }

  private updateRates(circuit: CircuitBreaker): void {
    const { requests } = circuit.metrics;
    circuit.metrics.rates.failureRate = (requests.failed / requests.total) * 100;
    circuit.metrics.rates.slowCallRate = (requests.slow / requests.total) * 100;
    circuit.metrics.rates.successRate = (requests.successful / requests.total) * 100;
    circuit.metrics.rates.rejectionRate = (requests.rejected / requests.total) * 100;
  }

  private checkStateTransition(circuit: CircuitBreaker): void {
    if (!circuit.config.automaticTransitionEnabled) return;

    const { rates } = circuit.metrics;
    const minCalls = circuit.config.minimumNumberOfCalls;

    if (circuit.state === 'closed') {
      if (circuit.metrics.requests.total >= minCalls && rates.failureRate >= circuit.config.failureRateThreshold) {
        this.transitionState(circuit, 'open', 'Failure rate exceeded threshold');
      }
    } else if (circuit.state === 'half_open') {
      const recentCalls = circuit.metrics.window.entries.slice(-circuit.config.permittedCallsInHalfOpen);
      const recentSuccessRate = recentCalls.filter((e) => e.success).length / recentCalls.length * 100;

      if (recentSuccessRate >= (circuit.config.successRateThreshold || 50)) {
        this.transitionState(circuit, 'closed', 'Success rate reached threshold');
      } else if (recentCalls.filter((e) => !e.success).length >= Math.ceil(circuit.config.permittedCallsInHalfOpen / 2)) {
        this.transitionState(circuit, 'open', 'Too many failures in half-open state');
      }
    }
  }

  private transitionState(circuit: CircuitBreaker, newState: CircuitState, reason: string): void {
    const oldState = circuit.state;
    circuit.state = newState;
    circuit.metadata.lastStateChange = new Date();

    const transition: StateTransition = {
      id: `trans-${this.generateId()}`,
      timestamp: new Date(),
      fromState: oldState,
      toState: newState,
      reason,
      metrics: {
        failureRate: circuit.metrics.rates.failureRate,
        slowCallRate: circuit.metrics.rates.slowCallRate,
        totalCalls: circuit.metrics.requests.total,
      },
      manual: false,
    };
    circuit.history.push(transition);

    // Update health status
    circuit.health.status = newState === 'open' ? 'unhealthy' : newState === 'half_open' ? 'degraded' : 'healthy';
    if (newState !== 'closed') {
      circuit.health.degradedSince = new Date();
    } else {
      circuit.health.degradedSince = undefined;
    }

    this.emit('state.change', { circuit, transition });
    this.notifyListeners(circuit, 'state_change', transition);
  }

  private executeFallback(circuit: CircuitBreaker): unknown {
    if (!circuit.fallback) return null;
    
    circuit.fallback.metrics.invocations++;
    
    switch (circuit.fallback.type) {
      case 'static':
        circuit.fallback.metrics.successes++;
        return circuit.fallback.staticValue;
      case 'cache':
        circuit.fallback.metrics.successes++;
        return { cached: true, key: circuit.fallback.cacheKey };
      case 'default':
        circuit.fallback.metrics.successes++;
        return null;
      default:
        circuit.fallback.metrics.failures++;
        throw new Error('Fallback failed');
    }
  }

  private notifyListeners(circuit: CircuitBreaker, event: string, data: unknown): void {
    circuit.listeners
      .filter((l) => l.enabled && l.events.includes(event as CircuitListener['events'][0]))
      .forEach((listener) => {
        listener.lastTriggered = new Date();
        // In a real implementation, this would send actual notifications
        this.emit('notification.sent', { listener, circuit, event, data });
      });
  }

  // Circuit Operations
  public getCircuits(state?: CircuitState): CircuitBreaker[] {
    let circuits = Array.from(this.circuits.values());
    if (state) circuits = circuits.filter((c) => c.state === state);
    return circuits.sort((a, b) => a.name.localeCompare(b.name));
  }

  public getCircuitById(id: string): CircuitBreaker | undefined {
    return this.circuits.get(id);
  }

  public getCircuitByService(service: string): CircuitBreaker | undefined {
    return Array.from(this.circuits.values()).find((c) => c.service === service);
  }

  public createCircuit(data: Partial<CircuitBreaker>): CircuitBreaker {
    const circuit: CircuitBreaker = {
      id: `circuit-${this.generateId()}`,
      name: data.name || 'New Circuit',
      description: data.description || '',
      service: data.service || '',
      state: 'closed',
      enabled: true,
      config: data.config || {
        failureRateThreshold: 50,
        slowCallRateThreshold: 80,
        slowCallDurationThreshold: 2000,
        permittedCallsInHalfOpen: 10,
        slidingWindowType: 'count_based',
        slidingWindowSize: 100,
        minimumNumberOfCalls: 10,
        waitDurationInOpenState: 60000,
        automaticTransitionEnabled: true,
        maxWaitDuration: 300000,
        recordExceptions: [],
        ignoreExceptions: [],
      },
      metrics: {
        requests: { total: 0, successful: 0, failed: 0, slow: 0, rejected: 0 },
        rates: { failureRate: 0, slowCallRate: 0, successRate: 100, rejectionRate: 0 },
        timing: { avgResponseTime: 0, p50: 0, p95: 0, p99: 0, maxResponseTime: 0 },
        stateMetrics: { closedDuration: 0, openDuration: 0, halfOpenDuration: 0, stateTransitions: 0 },
        window: { type: 'count_based', size: 100, entries: [] },
        last24h: { requests: 0, failures: 0, stateChanges: 0 },
      },
      history: [],
      health: { status: 'healthy', lastCheck: new Date(), consecutiveFailures: 0, consecutiveSuccesses: 0, uptime: 100, healthChecks: [], dependencies: [] },
      listeners: [],
      metadata: { createdAt: new Date(), createdBy: 'admin', updatedAt: new Date(), lastStateChange: new Date(), version: 1 },
    };
    this.circuits.set(circuit.id, circuit);
    this.emit('circuit.created', circuit);
    return circuit;
  }

  public manualTransition(id: string, newState: CircuitState, reason: string, triggeredBy: string): CircuitBreaker {
    const circuit = this.circuits.get(id);
    if (!circuit) throw new Error('Circuit not found');

    const oldState = circuit.state;
    circuit.state = newState;
    circuit.metadata.lastStateChange = new Date();
    circuit.metadata.updatedAt = new Date();

    const transition: StateTransition = {
      id: `trans-${this.generateId()}`,
      timestamp: new Date(),
      fromState: oldState,
      toState: newState,
      reason,
      metrics: {
        failureRate: circuit.metrics.rates.failureRate,
        slowCallRate: circuit.metrics.rates.slowCallRate,
        totalCalls: circuit.metrics.requests.total,
      },
      manual: true,
      triggeredBy,
    };
    circuit.history.push(transition);

    this.emit('state.change', { circuit, transition });
    return circuit;
  }

  public resetCircuit(id: string): CircuitBreaker {
    const circuit = this.circuits.get(id);
    if (!circuit) throw new Error('Circuit not found');

    circuit.state = 'closed';
    circuit.metrics = {
      requests: { total: 0, successful: 0, failed: 0, slow: 0, rejected: 0 },
      rates: { failureRate: 0, slowCallRate: 0, successRate: 100, rejectionRate: 0 },
      timing: { avgResponseTime: 0, p50: 0, p95: 0, p99: 0, maxResponseTime: 0 },
      stateMetrics: { closedDuration: 0, openDuration: 0, halfOpenDuration: 0, stateTransitions: 0 },
      window: { type: circuit.config.slidingWindowType, size: circuit.config.slidingWindowSize, entries: [] },
      last24h: { requests: 0, failures: 0, stateChanges: 0 },
    };
    circuit.health.consecutiveFailures = 0;
    circuit.health.consecutiveSuccesses = 0;
    circuit.health.status = 'healthy';
    circuit.metadata.updatedAt = new Date();
    circuit.metadata.lastStateChange = new Date();

    this.emit('circuit.reset', circuit);
    return circuit;
  }

  // Group Operations
  public getGroups(): ServiceCircuitGroup[] {
    return Array.from(this.groups.values());
  }

  public getGroupById(id: string): ServiceCircuitGroup | undefined {
    return this.groups.get(id);
  }

  // Call Records
  public getCallRecords(circuitId: string): CallRecord[] {
    return this.callRecords.get(circuitId) || [];
  }

  // Events
  public getEvents(circuitId?: string): CircuitEvent[] {
    if (circuitId) {
      return this.events.get(circuitId) || [];
    }
    return Array.from(this.events.values()).flat().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Widgets
  public getWidgets(): DashboardWidget[] {
    return Array.from(this.widgets.values());
  }

  // Statistics
  public getStatistics(): CircuitBreakerStatistics {
    const circuits = Array.from(this.circuits.values());

    return {
      overview: {
        totalCircuits: circuits.length,
        closedCircuits: circuits.filter((c) => c.state === 'closed').length,
        openCircuits: circuits.filter((c) => c.state === 'open').length,
        halfOpenCircuits: circuits.filter((c) => c.state === 'half_open').length,
        healthyServices: circuits.filter((c) => c.health.status === 'healthy').length,
        degradedServices: circuits.filter((c) => c.health.status === 'degraded' || c.health.status === 'unhealthy').length,
      },
      performance: {
        totalRequests: circuits.reduce((sum, c) => sum + c.metrics.requests.total, 0),
        successfulRequests: circuits.reduce((sum, c) => sum + c.metrics.requests.successful, 0),
        failedRequests: circuits.reduce((sum, c) => sum + c.metrics.requests.failed, 0),
        avgFailureRate: circuits.reduce((sum, c) => sum + c.metrics.rates.failureRate, 0) / circuits.length,
        avgLatency: circuits.reduce((sum, c) => sum + c.metrics.timing.avgResponseTime, 0) / circuits.length,
        p95Latency: Math.max(...circuits.map((c) => c.metrics.timing.p95)),
      },
      resilience: {
        fallbackInvocations: circuits.reduce((sum, c) => sum + (c.fallback?.metrics.invocations || 0), 0),
        retryAttempts: circuits.reduce((sum, c) => sum + (c.retry?.metrics.totalRetries || 0), 0),
        timeouts: circuits.reduce((sum, c) => sum + (c.timeout?.metrics.timedOutCalls || 0), 0),
        bulkheadRejections: circuits.reduce((sum, c) => sum + (c.bulkhead?.metrics.rejectedCalls || 0), 0),
        circuitOpens: circuits.reduce((sum, c) => sum + c.metrics.stateMetrics.stateTransitions, 0),
      },
      trends: [],
    };
  }

  // Event Handling
  public subscribe(callback: (event: string, data: unknown) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) this.eventListeners.splice(index, 1);
    };
  }

  private emit(event: string, data: unknown): void {
    this.eventListeners.forEach((callback) => callback(event, data));
  }
}

export const circuitBreakerService = CircuitBreakerService.getInstance();
export type {
  CircuitState,
  FailureType,
  HealthStatus,
  RecoveryStrategy,
  CircuitBreaker,
  CircuitConfig,
  CircuitMetrics,
  WindowEntry,
  StateTransition,
  CircuitHealth,
  HealthCheck,
  DependencyHealth,
  FallbackConfig,
  FallbackCondition,
  BulkheadConfig,
  RetryConfig,
  TimeoutConfig,
  CircuitListener,
  ServiceCircuitGroup,
  CallRecord,
  CircuitEvent,
  DashboardWidget,
  CircuitBreakerStatistics,
};

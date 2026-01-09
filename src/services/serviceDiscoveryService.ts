/**
 * Service Discovery Service
 * Comprehensive service registration, discovery, and health management
 */

// Service Status
type ServiceStatus = 'healthy' | 'unhealthy' | 'degraded' | 'starting' | 'stopping' | 'unknown';

// Health Check Type
type HealthCheckType = 'http' | 'tcp' | 'grpc' | 'script' | 'ttl';

// Load Balancer Algorithm
type LoadBalancerAlgorithm = 'round_robin' | 'least_connections' | 'random' | 'weighted' | 'ip_hash' | 'consistent_hash';

// Service Protocol
type ServiceProtocol = 'http' | 'https' | 'grpc' | 'tcp' | 'udp' | 'websocket';

// Service Instance
interface ServiceInstance {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  version: string;
  address: ServiceAddress;
  health: InstanceHealth;
  metadata: InstanceMetadata;
  registration: InstanceRegistration;
  loadBalancing: InstanceLoadBalancing;
  status: ServiceStatus;
  tags: string[];
}

// Service Address
interface ServiceAddress {
  host: string;
  port: number;
  protocol: ServiceProtocol;
  secure: boolean;
  zone?: string;
  region?: string;
  datacenter?: string;
  endpoints: ServiceEndpoint[];
}

// Service Endpoint
interface ServiceEndpoint {
  name: string;
  path: string;
  method?: string;
  protocol: ServiceProtocol;
  port?: number;
  metadata?: Record<string, string>;
}

// Instance Health
interface InstanceHealth {
  status: ServiceStatus;
  lastCheck: Date;
  nextCheck: Date;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  checks: HealthCheck[];
  history: HealthHistoryEntry[];
}

// Health Check
interface HealthCheck {
  id: string;
  name: string;
  type: HealthCheckType;
  config: HealthCheckConfig;
  status: 'passing' | 'warning' | 'critical' | 'unknown';
  lastResult: HealthCheckResult;
  enabled: boolean;
}

// Health Check Config
interface HealthCheckConfig {
  endpoint?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  expectedStatus?: number[];
  expectedBody?: string;
  timeout: number;
  interval: number;
  deregisterAfter?: number;
  successThreshold: number;
  failureThreshold: number;
  tlsSkipVerify?: boolean;
  script?: string;
}

// Health Check Result
interface HealthCheckResult {
  timestamp: Date;
  status: 'passing' | 'warning' | 'critical';
  duration: number;
  output?: string;
  error?: string;
  statusCode?: number;
}

// Health History Entry
interface HealthHistoryEntry {
  timestamp: Date;
  status: ServiceStatus;
  duration: number;
  reason?: string;
}

// Instance Metadata
interface InstanceMetadata {
  version: string;
  buildNumber?: string;
  commitHash?: string;
  environment: string;
  namespace?: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  capabilities: string[];
  dependencies: ServiceDependency[];
}

// Service Dependency
interface ServiceDependency {
  serviceId: string;
  serviceName: string;
  required: boolean;
  version?: string;
  endpoints?: string[];
}

// Instance Registration
interface InstanceRegistration {
  registeredAt: Date;
  lastHeartbeat: Date;
  ttl: number;
  autoDeregister: boolean;
  deregisterTimeout: number;
  source: 'manual' | 'auto' | 'kubernetes' | 'consul' | 'eureka';
  registrationToken?: string;
}

// Instance Load Balancing
interface InstanceLoadBalancing {
  weight: number;
  priority: number;
  enabled: boolean;
  warmup: number;
  drainingMode: boolean;
  connectionLimit?: number;
  activeConnections: number;
}

// Service Definition
interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  namespace: string;
  team: string;
  owner: string;
  instances: string[];
  routing: ServiceRouting;
  discovery: ServiceDiscoveryConfig;
  healthPolicy: ServiceHealthPolicy;
  security: ServiceSecurity;
  documentation: ServiceDocumentation;
  alerts: ServiceAlert[];
  metadata: ServiceMetadata;
  status: ServiceStatus;
}

// Service Routing
interface ServiceRouting {
  loadBalancer: LoadBalancerConfig;
  circuitBreaker: CircuitBreakerConfig;
  retry: RetryConfig;
  timeout: TimeoutConfig;
  failover: FailoverConfig;
  canary?: CanaryConfig;
}

// Load Balancer Config
interface LoadBalancerConfig {
  algorithm: LoadBalancerAlgorithm;
  healthyOnly: boolean;
  stickySession: StickySessionConfig;
  connectionPooling: ConnectionPoolConfig;
  zonalAffinity: ZonalAffinityConfig;
}

// Sticky Session Config
interface StickySessionConfig {
  enabled: boolean;
  type: 'cookie' | 'header' | 'ip';
  cookieName?: string;
  headerName?: string;
  ttl: number;
}

// Connection Pool Config
interface ConnectionPoolConfig {
  enabled: boolean;
  maxConnections: number;
  maxIdleConnections: number;
  idleTimeout: number;
  maxConnectionAge: number;
}

// Zonal Affinity Config
interface ZonalAffinityConfig {
  enabled: boolean;
  preferSameZone: boolean;
  failoverToOtherZones: boolean;
  zonePriorities: { zone: string; priority: number }[];
}

// Circuit Breaker Config
interface CircuitBreakerConfig {
  enabled: boolean;
  threshold: number;
  timeout: number;
  halfOpenRequests: number;
  failureRateThreshold: number;
  slowCallRateThreshold: number;
  slowCallDuration: number;
  minimumRequests: number;
  windowSize: number;
}

// Retry Config
interface RetryConfig {
  enabled: boolean;
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  multiplier: number;
  retryableErrors: string[];
  retryableStatusCodes: number[];
}

// Timeout Config
interface TimeoutConfig {
  connect: number;
  read: number;
  write: number;
  idle: number;
  request: number;
}

// Failover Config
interface FailoverConfig {
  enabled: boolean;
  policy: 'sequential' | 'priority' | 'random';
  maxFailovers: number;
  failoverDelay: number;
  excludeUnhealthy: boolean;
  crossZone: boolean;
  crossRegion: boolean;
}

// Canary Config
interface CanaryConfig {
  enabled: boolean;
  weight: number;
  version: string;
  headerMatch?: { name: string; value: string };
  cookieMatch?: { name: string; value: string };
  userMatch?: string[];
}

// Service Discovery Config
interface ServiceDiscoveryConfig {
  type: 'dns' | 'api' | 'sidecar' | 'multicast';
  refreshInterval: number;
  cacheEnabled: boolean;
  cacheTTL: number;
  watchEnabled: boolean;
  filters: DiscoveryFilter[];
}

// Discovery Filter
interface DiscoveryFilter {
  type: 'tag' | 'label' | 'version' | 'zone' | 'status';
  key?: string;
  value: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'matches';
}

// Service Health Policy
interface ServiceHealthPolicy {
  minHealthyInstances: number;
  minHealthyPercentage: number;
  unhealthyThreshold: number;
  degradedThreshold: number;
  autoRecovery: boolean;
  recoveryDelay: number;
  aggregationMethod: 'any' | 'all' | 'majority';
}

// Service Security
interface ServiceSecurity {
  authentication: ServiceAuthentication;
  authorization: ServiceAuthorization;
  encryption: ServiceEncryption;
  rateLimiting: ServiceRateLimiting;
}

// Service Authentication
interface ServiceAuthentication {
  required: boolean;
  methods: AuthMethod[];
  mtlsEnabled: boolean;
  tokenValidation?: TokenValidation;
}

// Auth Method
interface AuthMethod {
  type: 'jwt' | 'api_key' | 'oauth2' | 'mtls' | 'basic';
  config: Record<string, unknown>;
  priority: number;
}

// Token Validation
interface TokenValidation {
  issuer: string;
  audience: string;
  jwksUri?: string;
  algorithms: string[];
  claims?: Record<string, string>;
}

// Service Authorization
interface ServiceAuthorization {
  enabled: boolean;
  type: 'rbac' | 'abac' | 'acl';
  policies: AuthorizationPolicy[];
  defaultAction: 'allow' | 'deny';
}

// Authorization Policy
interface AuthorizationPolicy {
  id: string;
  name: string;
  subjects: string[];
  resources: string[];
  actions: string[];
  effect: 'allow' | 'deny';
  conditions?: Record<string, unknown>;
}

// Service Encryption
interface ServiceEncryption {
  inTransit: boolean;
  atRest: boolean;
  tlsVersion: string;
  cipherSuites: string[];
  certificateId?: string;
}

// Service Rate Limiting
interface ServiceRateLimiting {
  enabled: boolean;
  requestsPerSecond: number;
  burstSize: number;
  keyExtractor: 'ip' | 'user' | 'service' | 'custom';
  responseOnLimit: 'reject' | 'queue' | 'throttle';
}

// Service Documentation
interface ServiceDocumentation {
  description: string;
  readme?: string;
  openApiSpec?: string;
  asyncApiSpec?: string;
  runbook?: string;
  architecture?: string;
  contacts: ServiceContact[];
  links: ServiceLink[];
}

// Service Contact
interface ServiceContact {
  name: string;
  role: string;
  email: string;
  slack?: string;
  phone?: string;
}

// Service Link
interface ServiceLink {
  name: string;
  url: string;
  type: 'dashboard' | 'logs' | 'metrics' | 'traces' | 'repo' | 'docs' | 'other';
}

// Service Alert
interface ServiceAlert {
  id: string;
  name: string;
  description: string;
  condition: AlertCondition;
  severity: 'critical' | 'high' | 'medium' | 'low';
  channels: string[];
  enabled: boolean;
  silenced: boolean;
  silencedUntil?: Date;
}

// Alert Condition
interface AlertCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration: number;
  aggregation: 'avg' | 'sum' | 'max' | 'min' | 'count';
}

// Service Metadata
interface ServiceMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: number;
  tags: string[];
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

// Service Registry
interface ServiceRegistry {
  id: string;
  name: string;
  description: string;
  type: 'consul' | 'eureka' | 'kubernetes' | 'etcd' | 'zookeeper' | 'custom';
  connection: RegistryConnection;
  replication: RegistryReplication;
  security: RegistrySecurity;
  health: RegistryHealth;
  statistics: RegistryStatistics;
  status: 'connected' | 'disconnected' | 'degraded';
  metadata: RegistryMetadata;
}

// Registry Connection
interface RegistryConnection {
  endpoints: string[];
  timeout: number;
  retryPolicy: RetryConfig;
  authentication?: RegistryAuth;
}

// Registry Auth
interface RegistryAuth {
  type: 'token' | 'basic' | 'certificate';
  credentials: Record<string, string>;
}

// Registry Replication
interface RegistryReplication {
  enabled: boolean;
  mode: 'sync' | 'async';
  replicas: RegistryReplica[];
  consistency: 'strong' | 'eventual';
}

// Registry Replica
interface RegistryReplica {
  id: string;
  endpoint: string;
  role: 'leader' | 'follower';
  status: 'healthy' | 'unhealthy' | 'syncing';
  lastSync: Date;
  lag: number;
}

// Registry Security
interface RegistrySecurity {
  tlsEnabled: boolean;
  aclEnabled: boolean;
  encryptionEnabled: boolean;
}

// Registry Health
interface RegistryHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: Date;
  uptime: number;
  leaderElected: boolean;
  leaderId?: string;
}

// Registry Statistics
interface RegistryStatistics {
  totalServices: number;
  totalInstances: number;
  healthyInstances: number;
  unhealthyInstances: number;
  registrationsToday: number;
  deregistrationsToday: number;
  averageHeartbeatLatency: number;
}

// Registry Metadata
interface RegistryMetadata {
  createdAt: Date;
  version: string;
  datacenter: string;
  region: string;
}

// Service Mesh
interface ServiceMesh {
  id: string;
  name: string;
  description: string;
  type: 'istio' | 'linkerd' | 'consul_connect' | 'aws_app_mesh' | 'custom';
  configuration: MeshConfiguration;
  policies: MeshPolicy[];
  gateways: MeshGateway[];
  observability: MeshObservability;
  status: 'active' | 'inactive' | 'degraded';
  metadata: MeshMetadata;
}

// Mesh Configuration
interface MeshConfiguration {
  mtlsMode: 'strict' | 'permissive' | 'disabled';
  proxyConfig: ProxyConfig;
  trafficManagement: TrafficManagement;
  resiliency: ResiliencyConfig;
}

// Proxy Config
interface ProxyConfig {
  image: string;
  version: string;
  resources: {
    cpu: string;
    memory: string;
  };
  logging: {
    level: string;
    format: string;
  };
  tracing: {
    enabled: boolean;
    samplingRate: number;
  };
}

// Traffic Management
interface TrafficManagement {
  loadBalancing: LoadBalancerConfig;
  rateLimiting: ServiceRateLimiting;
  circuitBreaking: CircuitBreakerConfig;
  retries: RetryConfig;
  timeouts: TimeoutConfig;
}

// Resiliency Config
interface ResiliencyConfig {
  circuitBreaker: CircuitBreakerConfig;
  retries: RetryConfig;
  timeouts: TimeoutConfig;
  outlierDetection: OutlierDetection;
}

// Outlier Detection
interface OutlierDetection {
  enabled: boolean;
  consecutive5xxErrors: number;
  interval: number;
  baseEjectionTime: number;
  maxEjectionPercent: number;
  minHealthPercent: number;
}

// Mesh Policy
interface MeshPolicy {
  id: string;
  name: string;
  type: 'traffic' | 'security' | 'observability';
  targets: PolicyTarget[];
  rules: PolicyRules;
  enabled: boolean;
}

// Policy Target
interface PolicyTarget {
  service: string;
  namespace?: string;
  version?: string;
  port?: number;
}

// Policy Rules
interface PolicyRules {
  allow?: string[];
  deny?: string[];
  rateLimit?: ServiceRateLimiting;
  timeout?: number;
  retries?: number;
}

// Mesh Gateway
interface MeshGateway {
  id: string;
  name: string;
  type: 'ingress' | 'egress' | 'east_west';
  hosts: string[];
  ports: GatewayPort[];
  tls: GatewayTLS;
  routing: GatewayRouting[];
  status: 'active' | 'inactive';
}

// Gateway Port
interface GatewayPort {
  number: number;
  name: string;
  protocol: ServiceProtocol;
}

// Gateway TLS
interface GatewayTLS {
  mode: 'passthrough' | 'simple' | 'mutual';
  certificateId?: string;
  minVersion: string;
  cipherSuites: string[];
}

// Gateway Routing
interface GatewayRouting {
  match: RoutingMatch;
  destination: RoutingDestination;
  weight?: number;
}

// Routing Match
interface RoutingMatch {
  uri?: { prefix?: string; exact?: string; regex?: string };
  headers?: Record<string, string>;
  method?: string[];
}

// Routing Destination
interface RoutingDestination {
  service: string;
  port: number;
  subset?: string;
}

// Mesh Observability
interface MeshObservability {
  metrics: {
    enabled: boolean;
    provider: string;
    scrapeInterval: number;
  };
  tracing: {
    enabled: boolean;
    provider: string;
    samplingRate: number;
  };
  logging: {
    enabled: boolean;
    level: string;
    accessLog: boolean;
  };
}

// Mesh Metadata
interface MeshMetadata {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  version: string;
}

// Discovery Statistics
interface DiscoveryStatistics {
  overview: {
    totalServices: number;
    totalInstances: number;
    healthyInstances: number;
    unhealthyInstances: number;
    degradedInstances: number;
    averageInstancesPerService: number;
  };
  byStatus: Record<ServiceStatus, number>;
  byZone: Record<string, { services: number; instances: number }>;
  byNamespace: Record<string, { services: number; instances: number }>;
  health: {
    passingChecks: number;
    warningChecks: number;
    criticalChecks: number;
    averageCheckLatency: number;
  };
  traffic: {
    totalRequests: number;
    successRate: number;
    averageLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
  };
  registrations: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

class ServiceDiscoveryService {
  private static instance: ServiceDiscoveryService;
  private services: Map<string, ServiceDefinition> = new Map();
  private instances: Map<string, ServiceInstance> = new Map();
  private registries: Map<string, ServiceRegistry> = new Map();
  private meshes: Map<string, ServiceMesh> = new Map();
  private eventListeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): ServiceDiscoveryService {
    if (!ServiceDiscoveryService.instance) {
      ServiceDiscoveryService.instance = new ServiceDiscoveryService();
    }
    return ServiceDiscoveryService.instance;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSampleData(): void {
    // Initialize Services and Instances
    const servicesData = [
      { name: 'user-service', namespace: 'default', team: 'platform', instances: 3 },
      { name: 'order-service', namespace: 'commerce', team: 'commerce', instances: 5 },
      { name: 'payment-service', namespace: 'commerce', team: 'payments', instances: 3 },
      { name: 'notification-service', namespace: 'messaging', team: 'comms', instances: 2 },
      { name: 'inventory-service', namespace: 'commerce', team: 'warehouse', instances: 4 },
      { name: 'api-gateway', namespace: 'infra', team: 'platform', instances: 3 },
      { name: 'auth-service', namespace: 'security', team: 'security', instances: 3 },
      { name: 'search-service', namespace: 'search', team: 'search', instances: 4 },
    ];

    servicesData.forEach((svc, svcIdx) => {
      const serviceId = `svc-${(svcIdx + 1).toString().padStart(4, '0')}`;
      const instanceIds: string[] = [];

      // Create instances for each service
      for (let i = 0; i < svc.instances; i++) {
        const instanceId = `inst-${serviceId}-${(i + 1).toString().padStart(2, '0')}`;
        instanceIds.push(instanceId);
        const isHealthy = Math.random() > 0.1;

        const instance: ServiceInstance = {
          id: instanceId,
          serviceId,
          name: `${svc.name}-${i + 1}`,
          description: `Instance ${i + 1} of ${svc.name}`,
          version: '1.5.0',
          address: {
            host: `${svc.name}-${i + 1}.${svc.namespace}.svc.cluster.local`,
            port: 8080,
            protocol: 'http',
            secure: false,
            zone: ['us-west-2a', 'us-west-2b', 'us-west-2c'][i % 3],
            region: 'us-west-2',
            datacenter: 'dc1',
            endpoints: [
              { name: 'http', path: '/', protocol: 'http', port: 8080 },
              { name: 'grpc', path: '/', protocol: 'grpc', port: 9090 },
              { name: 'health', path: '/health', protocol: 'http', port: 8080 },
            ],
          },
          health: {
            status: isHealthy ? 'healthy' : 'unhealthy',
            lastCheck: new Date(),
            nextCheck: new Date(Date.now() + 10000),
            consecutiveSuccesses: isHealthy ? 10 : 0,
            consecutiveFailures: isHealthy ? 0 : 3,
            checks: [
              {
                id: `check-${instanceId}-http`,
                name: 'HTTP Health Check',
                type: 'http',
                config: {
                  endpoint: '/health',
                  method: 'GET',
                  expectedStatus: [200],
                  timeout: 5000,
                  interval: 10000,
                  successThreshold: 2,
                  failureThreshold: 3,
                },
                status: isHealthy ? 'passing' : 'critical',
                lastResult: {
                  timestamp: new Date(),
                  status: isHealthy ? 'passing' : 'critical',
                  duration: 25,
                  statusCode: isHealthy ? 200 : 503,
                },
                enabled: true,
              },
            ],
            history: [
              { timestamp: new Date(Date.now() - 3600000), status: 'healthy', duration: 3600000 },
            ],
          },
          metadata: {
            version: '1.5.0',
            buildNumber: '1234',
            commitHash: 'abc123',
            environment: 'production',
            namespace: svc.namespace,
            labels: { app: svc.name, version: 'v1', team: svc.team },
            annotations: {},
            capabilities: ['http', 'grpc'],
            dependencies: [],
          },
          registration: {
            registeredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            lastHeartbeat: new Date(),
            ttl: 30000,
            autoDeregister: true,
            deregisterTimeout: 60000,
            source: 'kubernetes',
          },
          loadBalancing: {
            weight: 100,
            priority: 1,
            enabled: true,
            warmup: 0,
            drainingMode: false,
            connectionLimit: 1000,
            activeConnections: Math.floor(Math.random() * 100),
          },
          status: isHealthy ? 'healthy' : 'unhealthy',
          tags: [svc.namespace, svc.team, 'production'],
        };
        this.instances.set(instanceId, instance);
      }

      // Create service definition
      const service: ServiceDefinition = {
        id: serviceId,
        name: svc.name,
        description: `${svc.name} microservice`,
        version: '1.5.0',
        namespace: svc.namespace,
        team: svc.team,
        owner: `${svc.team}-lead`,
        instances: instanceIds,
        routing: {
          loadBalancer: {
            algorithm: 'round_robin',
            healthyOnly: true,
            stickySession: { enabled: false, type: 'cookie', ttl: 3600 },
            connectionPooling: { enabled: true, maxConnections: 100, maxIdleConnections: 10, idleTimeout: 60000, maxConnectionAge: 3600000 },
            zonalAffinity: { enabled: true, preferSameZone: true, failoverToOtherZones: true, zonePriorities: [] },
          },
          circuitBreaker: { enabled: true, threshold: 5, timeout: 30000, halfOpenRequests: 3, failureRateThreshold: 50, slowCallRateThreshold: 80, slowCallDuration: 5000, minimumRequests: 10, windowSize: 10 },
          retry: { enabled: true, maxRetries: 3, initialDelay: 100, maxDelay: 5000, multiplier: 2, retryableErrors: ['connection_refused', 'timeout'], retryableStatusCodes: [502, 503, 504] },
          timeout: { connect: 5000, read: 30000, write: 30000, idle: 60000, request: 60000 },
          failover: { enabled: true, policy: 'sequential', maxFailovers: 2, failoverDelay: 1000, excludeUnhealthy: true, crossZone: true, crossRegion: false },
        },
        discovery: {
          type: 'dns',
          refreshInterval: 30000,
          cacheEnabled: true,
          cacheTTL: 60000,
          watchEnabled: true,
          filters: [],
        },
        healthPolicy: {
          minHealthyInstances: 1,
          minHealthyPercentage: 50,
          unhealthyThreshold: 3,
          degradedThreshold: 2,
          autoRecovery: true,
          recoveryDelay: 10000,
          aggregationMethod: 'majority',
        },
        security: {
          authentication: {
            required: true,
            methods: [{ type: 'jwt', config: {}, priority: 1 }],
            mtlsEnabled: true,
          },
          authorization: {
            enabled: true,
            type: 'rbac',
            policies: [],
            defaultAction: 'deny',
          },
          encryption: {
            inTransit: true,
            atRest: true,
            tlsVersion: 'TLS1.3',
            cipherSuites: ['TLS_AES_256_GCM_SHA384'],
          },
          rateLimiting: {
            enabled: true,
            requestsPerSecond: 1000,
            burstSize: 100,
            keyExtractor: 'service',
            responseOnLimit: 'reject',
          },
        },
        documentation: {
          description: `${svc.name} handles core business logic`,
          contacts: [{ name: `${svc.team} Team`, role: 'Owner', email: `${svc.team}@example.com` }],
          links: [
            { name: 'Dashboard', url: `https://grafana.example.com/d/${svc.name}`, type: 'dashboard' },
            { name: 'Logs', url: `https://logs.example.com/${svc.name}`, type: 'logs' },
          ],
        },
        alerts: [
          { id: `alert-${serviceId}-1`, name: 'High Error Rate', description: 'Service error rate is high', condition: { metric: 'error_rate', operator: 'gt', threshold: 5, duration: 300, aggregation: 'avg' }, severity: 'critical', channels: ['slack', 'pagerduty'], enabled: true, silenced: false },
          { id: `alert-${serviceId}-2`, name: 'High Latency', description: 'Service latency is high', condition: { metric: 'latency_p95', operator: 'gt', threshold: 1000, duration: 300, aggregation: 'avg' }, severity: 'high', channels: ['slack'], enabled: true, silenced: false },
        ],
        metadata: {
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          createdBy: 'admin',
          updatedAt: new Date(),
          version: 15,
          tags: [svc.namespace, svc.team],
          labels: { app: svc.name, team: svc.team },
          annotations: {},
        },
        status: 'healthy',
      };
      this.services.set(serviceId, service);
    });

    // Initialize Registry
    const registry: ServiceRegistry = {
      id: 'registry-0001',
      name: 'Production Registry',
      description: 'Main service registry for production',
      type: 'consul',
      connection: {
        endpoints: ['consul-1.example.com:8500', 'consul-2.example.com:8500', 'consul-3.example.com:8500'],
        timeout: 5000,
        retryPolicy: { enabled: true, maxRetries: 3, initialDelay: 100, maxDelay: 5000, multiplier: 2, retryableErrors: [], retryableStatusCodes: [] },
      },
      replication: {
        enabled: true,
        mode: 'sync',
        replicas: [
          { id: 'replica-1', endpoint: 'consul-1.example.com:8500', role: 'leader', status: 'healthy', lastSync: new Date(), lag: 0 },
          { id: 'replica-2', endpoint: 'consul-2.example.com:8500', role: 'follower', status: 'healthy', lastSync: new Date(), lag: 50 },
          { id: 'replica-3', endpoint: 'consul-3.example.com:8500', role: 'follower', status: 'healthy', lastSync: new Date(), lag: 75 },
        ],
        consistency: 'strong',
      },
      security: { tlsEnabled: true, aclEnabled: true, encryptionEnabled: true },
      health: { status: 'healthy', lastCheck: new Date(), uptime: 99.99, leaderElected: true, leaderId: 'replica-1' },
      statistics: {
        totalServices: this.services.size,
        totalInstances: this.instances.size,
        healthyInstances: Array.from(this.instances.values()).filter((i) => i.status === 'healthy').length,
        unhealthyInstances: Array.from(this.instances.values()).filter((i) => i.status === 'unhealthy').length,
        registrationsToday: 5,
        deregistrationsToday: 2,
        averageHeartbeatLatency: 15,
      },
      status: 'connected',
      metadata: { createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), version: '1.15.0', datacenter: 'dc1', region: 'us-west-2' },
    };
    this.registries.set(registry.id, registry);

    // Initialize Service Mesh
    const mesh: ServiceMesh = {
      id: 'mesh-0001',
      name: 'Production Mesh',
      description: 'Istio service mesh for production',
      type: 'istio',
      configuration: {
        mtlsMode: 'strict',
        proxyConfig: { image: 'istio/proxyv2', version: '1.18.0', resources: { cpu: '100m', memory: '128Mi' }, logging: { level: 'info', format: 'json' }, tracing: { enabled: true, samplingRate: 0.1 } },
        trafficManagement: {
          loadBalancing: { algorithm: 'round_robin', healthyOnly: true, stickySession: { enabled: false, type: 'cookie', ttl: 3600 }, connectionPooling: { enabled: true, maxConnections: 100, maxIdleConnections: 10, idleTimeout: 60000, maxConnectionAge: 3600000 }, zonalAffinity: { enabled: true, preferSameZone: true, failoverToOtherZones: true, zonePriorities: [] } },
          rateLimiting: { enabled: true, requestsPerSecond: 1000, burstSize: 100, keyExtractor: 'service', responseOnLimit: 'reject' },
          circuitBreaking: { enabled: true, threshold: 5, timeout: 30000, halfOpenRequests: 3, failureRateThreshold: 50, slowCallRateThreshold: 80, slowCallDuration: 5000, minimumRequests: 10, windowSize: 10 },
          retries: { enabled: true, maxRetries: 3, initialDelay: 100, maxDelay: 5000, multiplier: 2, retryableErrors: [], retryableStatusCodes: [502, 503, 504] },
          timeouts: { connect: 5000, read: 30000, write: 30000, idle: 60000, request: 60000 },
        },
        resiliency: {
          circuitBreaker: { enabled: true, threshold: 5, timeout: 30000, halfOpenRequests: 3, failureRateThreshold: 50, slowCallRateThreshold: 80, slowCallDuration: 5000, minimumRequests: 10, windowSize: 10 },
          retries: { enabled: true, maxRetries: 3, initialDelay: 100, maxDelay: 5000, multiplier: 2, retryableErrors: [], retryableStatusCodes: [502, 503, 504] },
          timeouts: { connect: 5000, read: 30000, write: 30000, idle: 60000, request: 60000 },
          outlierDetection: { enabled: true, consecutive5xxErrors: 5, interval: 10000, baseEjectionTime: 30000, maxEjectionPercent: 50, minHealthPercent: 30 },
        },
      },
      policies: [],
      gateways: [
        { id: 'gw-ingress', name: 'Ingress Gateway', type: 'ingress', hosts: ['api.example.com'], ports: [{ number: 443, name: 'https', protocol: 'https' }], tls: { mode: 'simple', minVersion: 'TLS1.2', cipherSuites: [] }, routing: [], status: 'active' },
      ],
      observability: { metrics: { enabled: true, provider: 'prometheus', scrapeInterval: 15 }, tracing: { enabled: true, provider: 'jaeger', samplingRate: 0.1 }, logging: { enabled: true, level: 'info', accessLog: true } },
      status: 'active',
      metadata: { createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), createdBy: 'admin', updatedAt: new Date(), version: '1.18.0' },
    };
    this.meshes.set(mesh.id, mesh);
  }

  // Service Operations
  public getServices(namespace?: string): ServiceDefinition[] {
    let services = Array.from(this.services.values());
    if (namespace) services = services.filter((s) => s.namespace === namespace);
    return services;
  }

  public getServiceById(id: string): ServiceDefinition | undefined {
    return this.services.get(id);
  }

  public getServiceByName(name: string): ServiceDefinition | undefined {
    return Array.from(this.services.values()).find((s) => s.name === name);
  }

  // Instance Operations
  public getInstances(serviceId?: string): ServiceInstance[] {
    let instances = Array.from(this.instances.values());
    if (serviceId) instances = instances.filter((i) => i.serviceId === serviceId);
    return instances;
  }

  public getInstanceById(id: string): ServiceInstance | undefined {
    return this.instances.get(id);
  }

  public getHealthyInstances(serviceId: string): ServiceInstance[] {
    return Array.from(this.instances.values()).filter(
      (i) => i.serviceId === serviceId && i.status === 'healthy'
    );
  }

  // Registry Operations
  public getRegistries(): ServiceRegistry[] {
    return Array.from(this.registries.values());
  }

  public getRegistryById(id: string): ServiceRegistry | undefined {
    return this.registries.get(id);
  }

  // Mesh Operations
  public getMeshes(): ServiceMesh[] {
    return Array.from(this.meshes.values());
  }

  public getMeshById(id: string): ServiceMesh | undefined {
    return this.meshes.get(id);
  }

  // Statistics
  public getStatistics(): DiscoveryStatistics {
    const services = Array.from(this.services.values());
    const instances = Array.from(this.instances.values());

    const byStatus: Record<ServiceStatus, number> = {
      healthy: 0, unhealthy: 0, degraded: 0, starting: 0, stopping: 0, unknown: 0,
    };
    const byZone: Record<string, { services: number; instances: number }> = {};
    const byNamespace: Record<string, { services: number; instances: number }> = {};

    instances.forEach((i) => {
      byStatus[i.status]++;
      const zone = i.address.zone || 'unknown';
      if (!byZone[zone]) byZone[zone] = { services: 0, instances: 0 };
      byZone[zone].instances++;
    });

    services.forEach((s) => {
      if (!byNamespace[s.namespace]) byNamespace[s.namespace] = { services: 0, instances: 0 };
      byNamespace[s.namespace].services++;
      byNamespace[s.namespace].instances += s.instances.length;
    });

    return {
      overview: {
        totalServices: services.length,
        totalInstances: instances.length,
        healthyInstances: byStatus.healthy,
        unhealthyInstances: byStatus.unhealthy,
        degradedInstances: byStatus.degraded,
        averageInstancesPerService: instances.length / (services.length || 1),
      },
      byStatus,
      byZone,
      byNamespace,
      health: {
        passingChecks: instances.filter((i) => i.status === 'healthy').length * 2,
        warningChecks: Math.floor(instances.length * 0.1),
        criticalChecks: byStatus.unhealthy,
        averageCheckLatency: 25,
      },
      traffic: {
        totalRequests: Math.floor(Math.random() * 10000000),
        successRate: 99.5,
        averageLatency: 45,
        p50Latency: 35,
        p95Latency: 120,
        p99Latency: 250,
      },
      registrations: {
        today: 5,
        thisWeek: 25,
        thisMonth: 100,
      },
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

export const serviceDiscoveryService = ServiceDiscoveryService.getInstance();
export type {
  ServiceStatus,
  HealthCheckType,
  LoadBalancerAlgorithm,
  ServiceProtocol,
  ServiceInstance,
  ServiceAddress,
  ServiceEndpoint,
  InstanceHealth,
  HealthCheck,
  HealthCheckConfig,
  HealthCheckResult,
  HealthHistoryEntry,
  InstanceMetadata,
  ServiceDependency,
  InstanceRegistration,
  InstanceLoadBalancing,
  ServiceDefinition,
  ServiceRouting,
  LoadBalancerConfig,
  StickySessionConfig,
  ConnectionPoolConfig,
  ZonalAffinityConfig,
  CircuitBreakerConfig,
  RetryConfig,
  TimeoutConfig,
  FailoverConfig,
  CanaryConfig,
  ServiceDiscoveryConfig,
  DiscoveryFilter,
  ServiceHealthPolicy,
  ServiceSecurity,
  ServiceAuthentication,
  AuthMethod,
  TokenValidation,
  ServiceAuthorization,
  AuthorizationPolicy,
  ServiceEncryption,
  ServiceRateLimiting,
  ServiceDocumentation,
  ServiceContact,
  ServiceLink,
  ServiceAlert,
  AlertCondition,
  ServiceMetadata,
  ServiceRegistry,
  RegistryConnection,
  RegistryAuth,
  RegistryReplication,
  RegistryReplica,
  RegistrySecurity,
  RegistryHealth,
  RegistryStatistics,
  RegistryMetadata,
  ServiceMesh,
  MeshConfiguration,
  ProxyConfig,
  TrafficManagement,
  ResiliencyConfig,
  OutlierDetection,
  MeshPolicy,
  PolicyTarget,
  PolicyRules,
  MeshGateway,
  GatewayPort,
  GatewayTLS,
  GatewayRouting,
  RoutingMatch,
  RoutingDestination,
  MeshObservability,
  MeshMetadata,
  DiscoveryStatistics,
};

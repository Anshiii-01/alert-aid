/**
 * Session Management Service
 * User session tracking, security, and device management
 */

// Session status
type SessionStatus = 'active' | 'idle' | 'expired' | 'terminated' | 'locked';

// Session type
type SessionType = 'web' | 'mobile' | 'api' | 'desktop' | 'embedded';

// Device type
type DeviceType = 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'smartwatch' | 'other';

// Authentication method
type AuthMethod = 'password' | 'biometric' | 'mfa' | 'sso' | 'oauth' | 'magic_link' | 'otp';

// Termination reason
type TerminationReason = 'user_logout' | 'timeout' | 'admin_action' | 'security_violation' | 'device_change' | 'password_change' | 'concurrent_limit' | 'account_disabled';

// Session
interface Session {
  id: string;
  userId: string;
  type: SessionType;
  status: SessionStatus;
  device: DeviceInfo;
  location?: LocationInfo;
  authMethod: AuthMethod;
  mfaVerified: boolean;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  terminatedAt?: Date;
  terminationReason?: TerminationReason;
  ipHistory: { ip: string; timestamp: Date; location?: string }[];
  activityCount: number;
  riskScore: number;
  metadata: Record<string, unknown>;
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  };
}

// Device info
interface DeviceInfo {
  id: string;
  type: DeviceType;
  name: string;
  os: string;
  osVersion: string;
  browser?: string;
  browserVersion?: string;
  appVersion?: string;
  screenResolution?: string;
  language: string;
  timezone: string;
  fingerprint: string;
  isTrusted: boolean;
  firstSeenAt: Date;
  lastSeenAt: Date;
}

// Location info
interface LocationInfo {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp?: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
}

// Session policy
interface SessionPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  maxSessionDuration: number; // minutes
  maxIdleTime: number; // minutes
  maxConcurrentSessions: number;
  requireMfa: boolean;
  allowRememberDevice: boolean;
  trustDeviceDuration: number; // days
  blockVpn: boolean;
  blockProxy: boolean;
  blockTor: boolean;
  allowedCountries: string[];
  blockedCountries: string[];
  sessionTypeRules: {
    type: SessionType;
    maxDuration?: number;
    maxIdleTime?: number;
    requireMfa?: boolean;
  }[];
  riskRules: {
    condition: string;
    action: 'block' | 'challenge' | 'alert' | 'terminate';
    threshold?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// User device
interface UserDevice {
  id: string;
  userId: string;
  device: DeviceInfo;
  name?: string;
  status: 'active' | 'inactive' | 'blocked';
  trustLevel: 'untrusted' | 'recognized' | 'trusted';
  lastUsedAt: Date;
  sessionsCount: number;
  failedAttemptsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Session activity
interface SessionActivity {
  id: string;
  sessionId: string;
  timestamp: Date;
  type: 'page_view' | 'api_call' | 'action' | 'idle' | 'active';
  details: {
    path?: string;
    action?: string;
    duration?: number;
    metadata?: Record<string, unknown>;
  };
  ipAddress: string;
}

// Security event
interface SecurityEvent {
  id: string;
  sessionId?: string;
  userId: string;
  type: 'login_success' | 'login_failure' | 'logout' | 'mfa_challenge' | 'mfa_success' | 'mfa_failure' | 'session_hijack_attempt' | 'suspicious_activity' | 'device_blocked' | 'location_change';
  severity: 'info' | 'warning' | 'high' | 'critical';
  description: string;
  ipAddress: string;
  userAgent: string;
  location?: LocationInfo;
  riskFactors: string[];
  action: 'allowed' | 'blocked' | 'challenged' | 'alerted';
  createdAt: Date;
}

// MFA challenge
interface MFAChallenge {
  id: string;
  sessionId: string;
  userId: string;
  type: 'totp' | 'sms' | 'email' | 'push' | 'biometric' | 'security_key';
  status: 'pending' | 'completed' | 'failed' | 'expired';
  code?: string;
  attemptsRemaining: number;
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
}

// Session summary
interface SessionSummary {
  totalSessions: number;
  activeSessions: number;
  idleSessions: number;
  expiredSessions: number;
  terminatedSessions: number;
  byType: Record<SessionType, number>;
  byDevice: Record<DeviceType, number>;
  averageDuration: number;
  averageActivityCount: number;
  securityEvents: {
    total: number;
    bySeverity: Record<string, number>;
    recent: SecurityEvent[];
  };
  topLocations: { location: string; count: number }[];
  concurrentSessionsHistory: { time: string; count: number }[];
}

// Geofence rule
interface GeofenceRule {
  id: string;
  name: string;
  enabled: boolean;
  type: 'allow' | 'deny' | 'challenge';
  regions: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
  }[];
  action: 'block' | 'terminate' | 'alert' | 'mfa';
  createdAt: Date;
}

// Rate limit rule
interface RateLimitRule {
  id: string;
  name: string;
  enabled: boolean;
  scope: 'user' | 'ip' | 'device' | 'global';
  action: string;
  limit: number;
  windowSeconds: number;
  blockDurationSeconds: number;
  createdAt: Date;
}

// Token refresh request
interface TokenRefreshRequest {
  refreshToken: string;
  deviceFingerprint: string;
  ipAddress: string;
}

// Token refresh result
interface TokenRefreshResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  error?: string;
}

class SessionManagementService {
  private static instance: SessionManagementService;
  private sessions: Map<string, Session> = new Map();
  private devices: Map<string, UserDevice> = new Map();
  private activities: SessionActivity[] = [];
  private securityEvents: SecurityEvent[] = [];
  private mfaChallenges: Map<string, MFAChallenge> = new Map();
  private policies: Map<string, SessionPolicy> = new Map();
  private geofenceRules: Map<string, GeofenceRule> = new Map();
  private rateLimitRules: Map<string, RateLimitRule> = new Map();
  private rateLimitCounters: Map<string, { count: number; resetAt: Date }> = new Map();
  private listeners: ((event: string, data: unknown) => void)[] = [];

  private constructor() {
    this.initializeSampleData();
    this.startSessionCleanup();
  }

  public static getInstance(): SessionManagementService {
    if (!SessionManagementService.instance) {
      SessionManagementService.instance = new SessionManagementService();
    }
    return SessionManagementService.instance;
  }

  /**
   * Initialize sample data
   */
  private initializeSampleData(): void {
    // Initialize session policies
    const policiesData = [
      { id: 'policy-default', name: 'Default Policy', description: 'Standard session settings', maxSessionDuration: 1440, maxIdleTime: 30, maxConcurrentSessions: 5, requireMfa: false },
      { id: 'policy-admin', name: 'Admin Policy', description: 'Enhanced security for admins', maxSessionDuration: 480, maxIdleTime: 15, maxConcurrentSessions: 2, requireMfa: true },
      { id: 'policy-api', name: 'API Policy', description: 'API session settings', maxSessionDuration: 43200, maxIdleTime: 1440, maxConcurrentSessions: 10, requireMfa: false },
      { id: 'policy-mobile', name: 'Mobile Policy', description: 'Mobile app session settings', maxSessionDuration: 10080, maxIdleTime: 60, maxConcurrentSessions: 3, requireMfa: false },
    ];

    policiesData.forEach((p) => {
      const policy: SessionPolicy = {
        ...p,
        enabled: true,
        allowRememberDevice: true,
        trustDeviceDuration: 30,
        blockVpn: false,
        blockProxy: true,
        blockTor: true,
        allowedCountries: [],
        blockedCountries: [],
        sessionTypeRules: [],
        riskRules: [
          { condition: 'new_device', action: 'challenge' },
          { condition: 'new_location', action: 'alert' },
          { condition: 'risk_score > 70', action: 'challenge', threshold: 70 },
          { condition: 'risk_score > 90', action: 'terminate', threshold: 90 },
        ],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };
      this.policies.set(policy.id, policy);
    });

    // Initialize geofence rules
    const geofenceData = [
      { id: 'geo-india', name: 'India Only', type: 'allow' as const, regions: [{ country: 'IN' }], action: 'block' as const },
      { id: 'geo-office', name: 'Office Location', type: 'allow' as const, regions: [{ latitude: 19.076, longitude: 72.8777, radiusKm: 5 }], action: 'mfa' as const },
    ];

    geofenceData.forEach((g) => {
      this.geofenceRules.set(g.id, { ...g, enabled: true, createdAt: new Date() });
    });

    // Initialize rate limit rules
    const rateLimitData = [
      { id: 'rate-login', name: 'Login Rate Limit', scope: 'ip' as const, action: 'login', limit: 5, windowSeconds: 300, blockDurationSeconds: 900 },
      { id: 'rate-api', name: 'API Rate Limit', scope: 'user' as const, action: 'api_call', limit: 100, windowSeconds: 60, blockDurationSeconds: 60 },
      { id: 'rate-mfa', name: 'MFA Rate Limit', scope: 'user' as const, action: 'mfa_attempt', limit: 5, windowSeconds: 300, blockDurationSeconds: 1800 },
    ];

    rateLimitData.forEach((r) => {
      this.rateLimitRules.set(r.id, { ...r, enabled: true, createdAt: new Date() });
    });

    // Initialize sample sessions
    const sessionTypes: SessionType[] = ['web', 'mobile', 'api'];
    const deviceTypes: DeviceType[] = ['desktop', 'mobile', 'tablet'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const oses = ['Windows 10', 'macOS 14', 'iOS 17', 'Android 14'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];

    for (let i = 1; i <= 50; i++) {
      const userId = `user-${(i % 20) + 1}`;
      const type = sessionTypes[i % sessionTypes.length];
      const deviceType = deviceTypes[i % deviceTypes.length];
      const isActive = Math.random() > 0.3;
      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const lastActivityAt = isActive
        ? new Date(Date.now() - Math.random() * 30 * 60 * 1000)
        : new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000);

      const device: DeviceInfo = {
        id: `device-${i}`,
        type: deviceType,
        name: `${deviceType === 'desktop' ? 'Desktop' : deviceType === 'mobile' ? 'iPhone' : 'iPad'} ${i}`,
        os: oses[i % oses.length],
        osVersion: '1.0',
        browser: browsers[i % browsers.length],
        browserVersion: '120.0',
        language: 'en-IN',
        timezone: 'Asia/Kolkata',
        fingerprint: `fp-${Math.random().toString(36).substr(2, 16)}`,
        isTrusted: Math.random() > 0.5,
        firstSeenAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastSeenAt: lastActivityAt,
      };

      const location: LocationInfo = {
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        country: 'India',
        countryCode: 'IN',
        region: 'Maharashtra',
        city: cities[i % cities.length],
        latitude: 19.076 + (Math.random() - 0.5) * 2,
        longitude: 72.8777 + (Math.random() - 0.5) * 2,
        isVpn: Math.random() > 0.95,
        isProxy: Math.random() > 0.98,
        isTor: Math.random() > 0.99,
      };

      let status: SessionStatus;
      if (isActive) {
        status = Math.random() > 0.7 ? 'idle' : 'active';
      } else {
        status = Math.random() > 0.5 ? 'expired' : 'terminated';
      }

      const session: Session = {
        id: `session-${i.toString().padStart(8, '0')}`,
        userId,
        type,
        status,
        device,
        location,
        authMethod: ['password', 'mfa', 'biometric'][i % 3] as AuthMethod,
        mfaVerified: Math.random() > 0.5,
        createdAt,
        lastActivityAt,
        expiresAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000),
        terminatedAt: status === 'terminated' ? lastActivityAt : undefined,
        terminationReason: status === 'terminated' ? 'user_logout' : undefined,
        ipHistory: [{ ip: location.ip, timestamp: createdAt, location: location.city }],
        activityCount: Math.floor(Math.random() * 100) + 10,
        riskScore: Math.floor(Math.random() * 50),
        metadata: {},
        tokens: {
          accessToken: `at-${Math.random().toString(36).substr(2, 32)}`,
          refreshToken: `rt-${Math.random().toString(36).substr(2, 32)}`,
          accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
          refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      };

      this.sessions.set(session.id, session);

      // Create or update device
      const deviceKey = `${userId}-${device.fingerprint}`;
      if (!this.devices.has(deviceKey)) {
        const userDevice: UserDevice = {
          id: device.id,
          userId,
          device,
          status: 'active',
          trustLevel: device.isTrusted ? 'trusted' : 'recognized',
          lastUsedAt: lastActivityAt,
          sessionsCount: 1,
          failedAttemptsCount: 0,
          createdAt: device.firstSeenAt,
          updatedAt: lastActivityAt,
        };
        this.devices.set(deviceKey, userDevice);
      } else {
        const existingDevice = this.devices.get(deviceKey)!;
        existingDevice.sessionsCount++;
        existingDevice.lastUsedAt = lastActivityAt;
      }
    }

    // Initialize sample security events
    const eventTypes: SecurityEvent['type'][] = ['login_success', 'login_failure', 'logout', 'mfa_challenge', 'suspicious_activity'];

    for (let i = 0; i < 100; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const session = Array.from(this.sessions.values())[i % this.sessions.size];

      const event: SecurityEvent = {
        id: `sec-${(i + 1).toString().padStart(8, '0')}`,
        sessionId: eventType !== 'login_failure' ? session?.id : undefined,
        userId: session?.userId || `user-${Math.floor(Math.random() * 20) + 1}`,
        type: eventType,
        severity: eventType === 'login_failure' || eventType === 'suspicious_activity' ? 'warning' : 'info',
        description: this.getEventDescription(eventType),
        ipAddress: session?.location?.ip || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: session?.location,
        riskFactors: eventType === 'suspicious_activity' ? ['new_device', 'unusual_time'] : [],
        action: eventType === 'suspicious_activity' ? 'challenged' : 'allowed',
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      };

      this.securityEvents.push(event);
    }

    this.securityEvents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get event description
   */
  private getEventDescription(type: SecurityEvent['type']): string {
    const descriptions: Record<SecurityEvent['type'], string> = {
      login_success: 'User successfully logged in',
      login_failure: 'Failed login attempt',
      logout: 'User logged out',
      mfa_challenge: 'MFA challenge issued',
      mfa_success: 'MFA verification successful',
      mfa_failure: 'MFA verification failed',
      session_hijack_attempt: 'Potential session hijacking detected',
      suspicious_activity: 'Suspicious activity detected',
      device_blocked: 'Device blocked due to security policy',
      location_change: 'Significant location change detected',
    };
    return descriptions[type];
  }

  /**
   * Start session cleanup
   */
  private startSessionCleanup(): void {
    setInterval(() => {
      const now = new Date();
      const sessionsArray = Array.from(this.sessions.values());
      for (const session of sessionsArray) {
        if (session.status === 'active' || session.status === 'idle') {
          // Check expiration
          if (session.expiresAt < now) {
            session.status = 'expired';
            session.terminatedAt = now;
            session.terminationReason = 'timeout';
            this.emit('session_expired', { sessionId: session.id, userId: session.userId });
          }
          // Check idle timeout
          else {
            const policy = this.getApplicablePolicy(session);
            const idleMs = now.getTime() - session.lastActivityAt.getTime();
            const maxIdleMs = policy.maxIdleTime * 60 * 1000;

            if (idleMs > maxIdleMs) {
              session.status = 'idle';
              if (idleMs > maxIdleMs * 2) {
                session.status = 'expired';
                session.terminatedAt = now;
                session.terminationReason = 'timeout';
              }
            }
          }
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Create session
   */
  public createSession(data: {
    userId: string;
    type: SessionType;
    device: DeviceInfo;
    location?: LocationInfo;
    authMethod: AuthMethod;
    mfaVerified?: boolean;
  }): Session {
    const policy = this.getApplicablePolicyByType(data.type);

    // Check concurrent sessions
    const userSessions = this.getUserSessions(data.userId, true);
    if (userSessions.length >= policy.maxConcurrentSessions) {
      // Terminate oldest session
      const oldestSession = userSessions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
      this.terminateSession(oldestSession.id, 'concurrent_limit');
    }

    const now = new Date();
    const session: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      userId: data.userId,
      type: data.type,
      status: 'active',
      device: data.device,
      location: data.location,
      authMethod: data.authMethod,
      mfaVerified: data.mfaVerified || false,
      createdAt: now,
      lastActivityAt: now,
      expiresAt: new Date(now.getTime() + policy.maxSessionDuration * 60 * 1000),
      ipHistory: data.location ? [{ ip: data.location.ip, timestamp: now, location: data.location.city }] : [],
      activityCount: 0,
      riskScore: this.calculateRiskScore(data),
      metadata: {},
      tokens: {
        accessToken: this.generateToken(),
        refreshToken: this.generateToken(),
        accessTokenExpiresAt: new Date(now.getTime() + 60 * 60 * 1000),
        refreshTokenExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    };

    this.sessions.set(session.id, session);

    // Update device
    this.updateDeviceInfo(data.userId, data.device);

    // Log security event
    this.logSecurityEvent({
      sessionId: session.id,
      userId: data.userId,
      type: 'login_success',
      severity: 'info',
      description: 'User successfully logged in',
      ipAddress: data.location?.ip || 'unknown',
      userAgent: data.device.browser || 'unknown',
      location: data.location,
      riskFactors: [],
      action: 'allowed',
    });

    this.emit('session_created', session);
    return session;
  }

  /**
   * Generate token
   */
  private generateToken(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 32)}`;
  }

  /**
   * Calculate risk score
   */
  private calculateRiskScore(data: { userId: string; device: DeviceInfo; location?: LocationInfo }): number {
    let score = 0;

    // New device
    const deviceKey = `${data.userId}-${data.device.fingerprint}`;
    if (!this.devices.has(deviceKey)) {
      score += 20;
    }

    // Untrusted device
    if (!data.device.isTrusted) {
      score += 10;
    }

    // VPN/Proxy/Tor
    if (data.location?.isVpn) score += 15;
    if (data.location?.isProxy) score += 20;
    if (data.location?.isTor) score += 30;

    // Unusual time (night hours in India)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 23) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Get session
   */
  public getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get user sessions
   */
  public getUserSessions(userId: string, activeOnly: boolean = false): Session[] {
    let sessions = Array.from(this.sessions.values()).filter((s) => s.userId === userId);
    if (activeOnly) {
      sessions = sessions.filter((s) => s.status === 'active' || s.status === 'idle');
    }
    return sessions.sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());
  }

  /**
   * Update session activity
   */
  public updateActivity(sessionId: string, activity: { path?: string; action?: string }): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.status === 'expired' || session.status === 'terminated') {
      throw new Error('Invalid or inactive session');
    }

    session.lastActivityAt = new Date();
    session.activityCount++;
    if (session.status === 'idle') {
      session.status = 'active';
    }

    this.activities.push({
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sessionId,
      timestamp: new Date(),
      type: 'action',
      details: activity,
      ipAddress: session.location?.ip || 'unknown',
    });

    // Keep only recent activities
    if (this.activities.length > 10000) {
      this.activities = this.activities.slice(-5000);
    }
  }

  /**
   * Terminate session
   */
  public terminateSession(sessionId: string, reason: TerminationReason): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.status = 'terminated';
    session.terminatedAt = new Date();
    session.terminationReason = reason;

    this.logSecurityEvent({
      sessionId,
      userId: session.userId,
      type: 'logout',
      severity: 'info',
      description: `Session terminated: ${reason}`,
      ipAddress: session.location?.ip || 'unknown',
      userAgent: session.device.browser || 'unknown',
      location: session.location,
      riskFactors: [],
      action: 'allowed',
    });

    this.emit('session_terminated', { sessionId, reason });
  }

  /**
   * Terminate all user sessions
   */
  public terminateAllUserSessions(userId: string, reason: TerminationReason, exceptSessionId?: string): number {
    const sessions = this.getUserSessions(userId, true);
    let count = 0;

    sessions.forEach((session) => {
      if (session.id !== exceptSessionId) {
        this.terminateSession(session.id, reason);
        count++;
      }
    });

    return count;
  }

  /**
   * Refresh token
   */
  public refreshToken(request: TokenRefreshRequest): TokenRefreshResult {
    // Find session by refresh token
    const session = Array.from(this.sessions.values()).find(
      (s) => s.tokens.refreshToken === request.refreshToken
    );

    if (!session) {
      return { success: false, error: 'Invalid refresh token' };
    }

    if (session.status !== 'active' && session.status !== 'idle') {
      return { success: false, error: 'Session is not active' };
    }

    if (session.tokens.refreshTokenExpiresAt < new Date()) {
      return { success: false, error: 'Refresh token expired' };
    }

    // Verify device fingerprint
    if (session.device.fingerprint !== request.deviceFingerprint) {
      this.logSecurityEvent({
        sessionId: session.id,
        userId: session.userId,
        type: 'session_hijack_attempt',
        severity: 'critical',
        description: 'Token refresh attempted with different device fingerprint',
        ipAddress: request.ipAddress,
        userAgent: 'unknown',
        riskFactors: ['device_mismatch', 'potential_hijack'],
        action: 'blocked',
      });
      this.terminateSession(session.id, 'security_violation');
      return { success: false, error: 'Security violation detected' };
    }

    // Generate new tokens
    const now = new Date();
    session.tokens.accessToken = this.generateToken();
    session.tokens.refreshToken = this.generateToken();
    session.tokens.accessTokenExpiresAt = new Date(now.getTime() + 60 * 60 * 1000);
    session.tokens.refreshTokenExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Update IP history
    if (session.location?.ip !== request.ipAddress) {
      session.ipHistory.push({
        ip: request.ipAddress,
        timestamp: now,
      });
    }

    return {
      success: true,
      accessToken: session.tokens.accessToken,
      refreshToken: session.tokens.refreshToken,
      expiresAt: session.tokens.accessTokenExpiresAt,
    };
  }

  /**
   * Create MFA challenge
   */
  public createMFAChallenge(sessionId: string, type: MFAChallenge['type']): MFAChallenge {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const challenge: MFAChallenge = {
      id: `mfa-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sessionId,
      userId: session.userId,
      type,
      status: 'pending',
      code: type === 'totp' || type === 'sms' || type === 'email'
        ? Math.floor(100000 + Math.random() * 900000).toString()
        : undefined,
      attemptsRemaining: 3,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };

    this.mfaChallenges.set(challenge.id, challenge);

    this.logSecurityEvent({
      sessionId,
      userId: session.userId,
      type: 'mfa_challenge',
      severity: 'info',
      description: `MFA challenge issued: ${type}`,
      ipAddress: session.location?.ip || 'unknown',
      userAgent: session.device.browser || 'unknown',
      location: session.location,
      riskFactors: [],
      action: 'challenged',
    });

    return challenge;
  }

  /**
   * Verify MFA challenge
   */
  public verifyMFAChallenge(challengeId: string, code: string): { success: boolean; error?: string } {
    const challenge = this.mfaChallenges.get(challengeId);
    if (!challenge) {
      return { success: false, error: 'Challenge not found' };
    }

    if (challenge.status !== 'pending') {
      return { success: false, error: 'Challenge is not pending' };
    }

    if (challenge.expiresAt < new Date()) {
      challenge.status = 'expired';
      return { success: false, error: 'Challenge expired' };
    }

    if (challenge.attemptsRemaining <= 0) {
      challenge.status = 'failed';
      return { success: false, error: 'No attempts remaining' };
    }

    if (challenge.code !== code) {
      challenge.attemptsRemaining--;
      if (challenge.attemptsRemaining <= 0) {
        challenge.status = 'failed';
      }
      return { success: false, error: 'Invalid code' };
    }

    challenge.status = 'completed';
    challenge.completedAt = new Date();

    const session = this.sessions.get(challenge.sessionId);
    if (session) {
      session.mfaVerified = true;

      this.logSecurityEvent({
        sessionId: challenge.sessionId,
        userId: challenge.userId,
        type: 'mfa_success',
        severity: 'info',
        description: 'MFA verification successful',
        ipAddress: session.location?.ip || 'unknown',
        userAgent: session.device.browser || 'unknown',
        location: session.location,
        riskFactors: [],
        action: 'allowed',
      });
    }

    return { success: true };
  }

  /**
   * Get user devices
   */
  public getUserDevices(userId: string): UserDevice[] {
    return Array.from(this.devices.values())
      .filter((d) => d.userId === userId)
      .sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime());
  }

  /**
   * Update device info
   */
  private updateDeviceInfo(userId: string, device: DeviceInfo): void {
    const deviceKey = `${userId}-${device.fingerprint}`;
    const existing = this.devices.get(deviceKey);

    if (existing) {
      existing.device = device;
      existing.lastUsedAt = new Date();
      existing.sessionsCount++;
      existing.updatedAt = new Date();
    } else {
      const userDevice: UserDevice = {
        id: device.id,
        userId,
        device,
        status: 'active',
        trustLevel: 'recognized',
        lastUsedAt: new Date(),
        sessionsCount: 1,
        failedAttemptsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.devices.set(deviceKey, userDevice);
    }
  }

  /**
   * Trust device
   */
  public trustDevice(userId: string, deviceFingerprint: string): void {
    const deviceKey = `${userId}-${deviceFingerprint}`;
    const device = this.devices.get(deviceKey);
    if (device) {
      device.trustLevel = 'trusted';
      device.device.isTrusted = true;
      device.updatedAt = new Date();
    }
  }

  /**
   * Block device
   */
  public blockDevice(userId: string, deviceFingerprint: string): void {
    const deviceKey = `${userId}-${deviceFingerprint}`;
    const device = this.devices.get(deviceKey);
    if (device) {
      device.status = 'blocked';
      device.trustLevel = 'untrusted';
      device.updatedAt = new Date();

      // Terminate all sessions from this device
      const sessionsArray = Array.from(this.sessions.values());
      for (const session of sessionsArray) {
        if (session.userId === userId && session.device.fingerprint === deviceFingerprint) {
          if (session.status === 'active' || session.status === 'idle') {
            this.terminateSession(session.id, 'device_change');
          }
        }
      }
    }
  }

  /**
   * Get security events
   */
  public getSecurityEvents(userId?: string, limit: number = 50): SecurityEvent[] {
    let events = [...this.securityEvents];
    if (userId) {
      events = events.filter((e) => e.userId === userId);
    }
    return events.slice(0, limit);
  }

  /**
   * Log security event
   */
  private logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'createdAt'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date(),
    };

    this.securityEvents.unshift(securityEvent);

    // Keep only recent events
    if (this.securityEvents.length > 5000) {
      this.securityEvents = this.securityEvents.slice(0, 2500);
    }

    this.emit('security_event', securityEvent);
  }

  /**
   * Get session summary
   */
  public getSessionSummary(): SessionSummary {
    const sessions = Array.from(this.sessions.values());

    const byType: Record<SessionType, number> = { web: 0, mobile: 0, api: 0, desktop: 0, embedded: 0 };
    const byDevice: Record<DeviceType, number> = { desktop: 0, laptop: 0, tablet: 0, mobile: 0, smartwatch: 0, other: 0 };
    let totalDuration = 0;
    let totalActivity = 0;
    const locationCounts: Record<string, number> = {};

    sessions.forEach((s) => {
      byType[s.type]++;
      byDevice[s.device.type]++;
      totalDuration += s.lastActivityAt.getTime() - s.createdAt.getTime();
      totalActivity += s.activityCount;

      const loc = s.location?.city || 'Unknown';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const severityCounts: Record<string, number> = { info: 0, warning: 0, high: 0, critical: 0 };
    this.securityEvents.forEach((e) => {
      severityCounts[e.severity]++;
    });

    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter((s) => s.status === 'active').length,
      idleSessions: sessions.filter((s) => s.status === 'idle').length,
      expiredSessions: sessions.filter((s) => s.status === 'expired').length,
      terminatedSessions: sessions.filter((s) => s.status === 'terminated').length,
      byType,
      byDevice,
      averageDuration: sessions.length > 0 ? totalDuration / sessions.length / 60000 : 0, // minutes
      averageActivityCount: sessions.length > 0 ? totalActivity / sessions.length : 0,
      securityEvents: {
        total: this.securityEvents.length,
        bySeverity: severityCounts,
        recent: this.securityEvents.slice(0, 10),
      },
      topLocations: Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      concurrentSessionsHistory: [],
    };
  }

  /**
   * Get policies
   */
  public getPolicies(): SessionPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Get applicable policy
   */
  private getApplicablePolicy(session: Session): SessionPolicy {
    return this.getApplicablePolicyByType(session.type);
  }

  /**
   * Get applicable policy by type
   */
  private getApplicablePolicyByType(type: SessionType): SessionPolicy {
    const typePolicy = Array.from(this.policies.values()).find((p) =>
      p.sessionTypeRules.some((r) => r.type === type)
    );
    return typePolicy || this.policies.get('policy-default')!;
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

export const sessionManagementService = SessionManagementService.getInstance();
export type {
  SessionStatus,
  SessionType,
  DeviceType,
  AuthMethod,
  TerminationReason,
  Session,
  DeviceInfo,
  LocationInfo,
  SessionPolicy,
  UserDevice,
  SessionActivity,
  SecurityEvent,
  MFAChallenge,
  SessionSummary,
  GeofenceRule,
  RateLimitRule,
  TokenRefreshRequest,
  TokenRefreshResult,
};

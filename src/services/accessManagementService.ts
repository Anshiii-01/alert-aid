/**
 * Access Management Service - Issue #174 Implementation
 * 
 * Provides comprehensive access management for disaster response operations
 * including identity and access management, role-based access control,
 * permission management, and access governance.
 */

// Type definitions
type UserStatus = 'active' | 'inactive' | 'suspended' | 'locked' | 'pending_activation';
type RoleType = 'system' | 'organizational' | 'incident' | 'temporary' | 'emergency';
type PermissionScope = 'global' | 'organization' | 'department' | 'incident' | 'resource';
type AccessRequestStatus = 'pending' | 'approved' | 'denied' | 'expired' | 'revoked';
type AuthenticationMethod = 'password' | 'mfa' | 'sso' | 'certificate' | 'biometric' | 'token';

// User account interfaces
interface UserAccount {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  profile: UserProfile;
  authentication: AuthenticationConfig;
  roles: AssignedRole[];
  permissions: DirectPermission[];
  accessHistory: AccessHistoryEntry[];
  securitySettings: UserSecuritySettings;
  provisioning: ProvisioningInfo;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  title?: string;
  department?: string;
  organization: string;
  phone?: string;
  location?: string;
  supervisor?: string;
  employeeId?: string;
  badgeNumber?: string;
  photoUrl?: string;
}

interface AuthenticationConfig {
  primaryMethod: AuthenticationMethod;
  secondaryMethod?: AuthenticationMethod;
  mfaEnabled: boolean;
  mfaMethods?: string[];
  passwordLastChanged?: Date;
  passwordExpiresAt?: Date;
  lastLogin?: Date;
  lastLoginIp?: string;
  failedAttempts: number;
  lockedUntil?: Date;
  ssoProvider?: string;
  certificates?: { name: string; thumbprint: string; expiresAt: Date }[];
}

interface AssignedRole {
  roleId: string;
  roleName: string;
  assignedAt: Date;
  expiresAt?: Date;
  assignedBy: string;
  scope: RoleScope;
  reason?: string;
  active: boolean;
}

interface RoleScope {
  type: PermissionScope;
  value?: string;
  incidentId?: string;
  organizationId?: string;
  departmentId?: string;
}

interface DirectPermission {
  permissionId: string;
  permissionName: string;
  resource: string;
  actions: string[];
  scope: PermissionScope;
  grantedAt: Date;
  expiresAt?: Date;
  grantedBy: string;
  reason: string;
}

interface AccessHistoryEntry {
  timestamp: Date;
  action: 'login' | 'logout' | 'access_granted' | 'access_denied' | 'permission_change' | 'role_change';
  resource?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  details?: string;
  success: boolean;
}

interface UserSecuritySettings {
  sessionTimeout: number;
  allowedIpRanges?: string[];
  allowedDevices?: string[];
  requireMfaForSensitive: boolean;
  notifyOnLogin: boolean;
  notifyOnPermissionChange: boolean;
  trustedDevices: TrustedDevice[];
}

interface TrustedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'mobile' | 'tablet';
  fingerprint: string;
  addedAt: Date;
  lastUsed: Date;
  trusted: boolean;
}

interface ProvisioningInfo {
  source: 'manual' | 'ad_sync' | 'sso' | 'api' | 'self_registration';
  externalId?: string;
  syncedAt?: Date;
  autoProvisionedRoles?: string[];
  deactivationDate?: Date;
  deactivationReason?: string;
}

// Role interfaces
interface Role {
  id: string;
  name: string;
  code: string;
  type: RoleType;
  description: string;
  status: 'active' | 'inactive' | 'deprecated';
  permissions: RolePermission[];
  inheritsFrom?: string[];
  constraints: RoleConstraint[];
  metadata: RoleMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface RolePermission {
  permissionId: string;
  name: string;
  resource: string;
  actions: string[];
  conditions?: PermissionCondition[];
}

interface PermissionCondition {
  attribute: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: string | string[] | number;
}

interface RoleConstraint {
  type: 'max_users' | 'mutual_exclusive' | 'requires_role' | 'time_limited' | 'approval_required';
  value: string | number;
  description: string;
}

interface RoleMetadata {
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reviewRequired: boolean;
  reviewFrequency?: string;
  approvalLevels: number;
  maxDuration?: number;
  documentation?: string;
}

// Permission interfaces
interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  resource: ResourceDefinition;
  actions: ActionDefinition[];
  scope: PermissionScope;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'deprecated';
  audit: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ResourceDefinition {
  type: string;
  name: string;
  path?: string;
  service?: string;
  classification?: string;
}

interface ActionDefinition {
  code: string;
  name: string;
  description: string;
  sensitive: boolean;
}

// Access request interfaces
interface AccessRequest {
  id: string;
  requestNumber: string;
  requestType: 'role' | 'permission' | 'access' | 'elevation' | 'temporary';
  status: AccessRequestStatus;
  requestor: RequestorInfo;
  beneficiary: BeneficiaryInfo;
  requestedItems: RequestedAccessItem[];
  justification: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  approvals: AccessApproval[];
  timeline: AccessRequestTimeline;
  metadata: RequestMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface RequestorInfo {
  userId: string;
  name: string;
  email: string;
  department: string;
  organization: string;
}

interface BeneficiaryInfo {
  userId: string;
  name: string;
  email: string;
  department?: string;
  organization: string;
  isSelf: boolean;
}

interface RequestedAccessItem {
  id: string;
  type: 'role' | 'permission' | 'resource_access';
  itemId: string;
  itemName: string;
  scope?: RoleScope;
  requestedDuration?: number;
  startDate?: Date;
  endDate?: Date;
  status: 'pending' | 'approved' | 'denied';
  denialReason?: string;
}

interface AccessApproval {
  level: number;
  approverRole: string;
  approver?: string;
  status: 'pending' | 'approved' | 'denied' | 'delegated';
  approvedAt?: Date;
  comments?: string;
  delegatedTo?: string;
  delegatedAt?: Date;
}

interface AccessRequestTimeline {
  submitted: Date;
  lastUpdated: Date;
  approved?: Date;
  denied?: Date;
  provisioned?: Date;
  expired?: Date;
  revoked?: Date;
  events: TimelineEvent[];
}

interface TimelineEvent {
  timestamp: Date;
  event: string;
  actor: string;
  details?: string;
}

interface RequestMetadata {
  incidentId?: string;
  incidentName?: string;
  ticketNumber?: string;
  projectCode?: string;
  riskAssessment?: string;
  complianceNotes?: string;
}

// Access policy interfaces
interface AccessPolicy {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'mandatory' | 'discretionary' | 'role_based' | 'attribute_based';
  status: 'active' | 'inactive' | 'draft';
  priority: number;
  conditions: PolicyCondition[];
  effect: 'allow' | 'deny';
  actions: string[];
  resources: string[];
  subjects: PolicySubject[];
  exceptions: PolicyException[];
  enforcement: PolicyEnforcement;
  audit: PolicyAudit;
  createdAt: Date;
  updatedAt: Date;
}

interface PolicyCondition {
  attribute: string;
  operator: string;
  value: string | string[] | number | boolean;
  logicalOperator?: 'AND' | 'OR';
}

interface PolicySubject {
  type: 'user' | 'role' | 'group' | 'department' | 'organization';
  value: string;
  include: boolean;
}

interface PolicyException {
  id: string;
  description: string;
  subjects: string[];
  validFrom: Date;
  validTo: Date;
  approvedBy: string;
  reason: string;
}

interface PolicyEnforcement {
  mode: 'enforcing' | 'permissive' | 'audit_only';
  startDate: Date;
  notifications: { event: string; recipients: string[] }[];
  overrideAllowed: boolean;
  overrideApprovers?: string[];
}

interface PolicyAudit {
  logAccess: boolean;
  logDenials: boolean;
  alertOnViolation: boolean;
  retentionDays: number;
}

// Access review interfaces
interface AccessReview {
  id: string;
  reviewNumber: string;
  name: string;
  type: 'periodic' | 'triggered' | 'certification' | 'segregation_of_duties';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scope: ReviewScope;
  reviewers: Reviewer[];
  items: ReviewItem[];
  schedule: ReviewSchedule;
  statistics: ReviewStatistics;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewScope {
  type: 'all_users' | 'role' | 'department' | 'organization' | 'resource' | 'custom';
  value?: string;
  filters?: { attribute: string; value: string }[];
}

interface Reviewer {
  userId: string;
  name: string;
  role: 'primary' | 'delegate' | 'escalation';
  assignedItems: number;
  completedItems: number;
  deadline: Date;
  remindersSent: number;
}

interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  accessType: 'role' | 'permission' | 'direct_access';
  accessId: string;
  accessName: string;
  currentStatus: 'active' | 'expired' | 'pending';
  lastUsed?: Date;
  reviewer?: string;
  decision?: 'approve' | 'revoke' | 'modify' | 'escalate';
  decisionDate?: Date;
  comments?: string;
  riskIndicators: string[];
}

interface ReviewSchedule {
  startDate: Date;
  endDate: Date;
  reminderDays: number[];
  escalationDays: number;
  autoRevokeDays?: number;
}

interface ReviewStatistics {
  totalItems: number;
  completedItems: number;
  approvedItems: number;
  revokedItems: number;
  modifiedItems: number;
  escalatedItems: number;
  pendingItems: number;
  completionRate: number;
}

// Session interfaces
interface UserSession {
  id: string;
  userId: string;
  userName: string;
  status: 'active' | 'expired' | 'terminated';
  startedAt: Date;
  expiresAt: Date;
  terminatedAt?: Date;
  ipAddress: string;
  userAgent: string;
  device: string;
  location?: { city: string; country: string };
  authMethod: AuthenticationMethod;
  mfaVerified: boolean;
  activities: SessionActivity[];
  elevatedAccess: ElevatedAccess[];
}

interface SessionActivity {
  timestamp: Date;
  action: string;
  resource?: string;
  result: 'success' | 'failure';
  details?: string;
}

interface ElevatedAccess {
  roleId: string;
  roleName: string;
  grantedAt: Date;
  expiresAt: Date;
  reason: string;
  approvedBy: string;
}

// Sample data
const sampleUsers: UserAccount[] = [
  {
    id: 'user-001',
    username: 'jsmith',
    email: 'jsmith@agency.gov',
    status: 'active',
    profile: {
      firstName: 'John',
      lastName: 'Smith',
      displayName: 'John Smith',
      title: 'Emergency Response Coordinator',
      department: 'Emergency Management',
      organization: 'County Emergency Services',
      phone: '555-0101',
      employeeId: 'EMP-001'
    },
    authentication: {
      primaryMethod: 'password',
      secondaryMethod: 'mfa',
      mfaEnabled: true,
      mfaMethods: ['authenticator', 'sms'],
      passwordLastChanged: new Date('2024-01-01'),
      passwordExpiresAt: new Date('2024-04-01'),
      lastLogin: new Date(),
      failedAttempts: 0
    },
    roles: [
      {
        roleId: 'role-001',
        roleName: 'Emergency Coordinator',
        assignedAt: new Date('2023-01-01'),
        assignedBy: 'System Admin',
        scope: { type: 'organization', organizationId: 'org-001' },
        active: true
      }
    ],
    permissions: [],
    accessHistory: [],
    securitySettings: {
      sessionTimeout: 30,
      requireMfaForSensitive: true,
      notifyOnLogin: true,
      notifyOnPermissionChange: true,
      trustedDevices: []
    },
    provisioning: {
      source: 'ad_sync',
      externalId: 'AD-12345',
      syncedAt: new Date()
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date()
  }
];

const sampleRoles: Role[] = [
  {
    id: 'role-001',
    name: 'Emergency Coordinator',
    code: 'EMERG_COORD',
    type: 'organizational',
    description: 'Full access to emergency coordination functions and resources',
    status: 'active',
    permissions: [
      {
        permissionId: 'perm-001',
        name: 'View Incidents',
        resource: 'incidents',
        actions: ['read', 'list']
      },
      {
        permissionId: 'perm-002',
        name: 'Manage Incidents',
        resource: 'incidents',
        actions: ['create', 'update', 'delete']
      },
      {
        permissionId: 'perm-003',
        name: 'View Resources',
        resource: 'resources',
        actions: ['read', 'list']
      }
    ],
    inheritsFrom: ['role-base'],
    constraints: [
      { type: 'approval_required', value: 'manager', description: 'Manager approval required for assignment' }
    ],
    metadata: {
      category: 'Emergency Management',
      riskLevel: 'high',
      reviewRequired: true,
      reviewFrequency: 'quarterly',
      approvalLevels: 2
    },
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date()
  }
];

class AccessManagementService {
  private static instance: AccessManagementService;
  private users: Map<string, UserAccount> = new Map();
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private accessRequests: Map<string, AccessRequest> = new Map();
  private accessPolicies: Map<string, AccessPolicy> = new Map();
  private accessReviews: Map<string, AccessReview> = new Map();
  private sessions: Map<string, UserSession> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): AccessManagementService {
    if (!AccessManagementService.instance) {
      AccessManagementService.instance = new AccessManagementService();
    }
    return AccessManagementService.instance;
  }

  private initializeSampleData(): void {
    sampleUsers.forEach(u => this.users.set(u.id, u));
    sampleRoles.forEach(r => this.roles.set(r.id, r));
  }

  // ==================== User Account Management ====================

  async createUser(params: Omit<UserAccount, 'id' | 'accessHistory' | 'createdAt' | 'updatedAt'>): Promise<UserAccount> {
    const user: UserAccount = {
      ...params,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      accessHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user.id, user);
    return user;
  }

  async getUser(userId: string): Promise<UserAccount | null> {
    return this.users.get(userId) || null;
  }

  async getUserByUsername(username: string): Promise<UserAccount | null> {
    return Array.from(this.users.values()).find(u => u.username === username) || null;
  }

  async getUsers(params?: {
    status?: UserStatus;
    organization?: string;
    department?: string;
    role?: string;
  }): Promise<UserAccount[]> {
    let users = Array.from(this.users.values());

    if (params?.status) {
      users = users.filter(u => u.status === params.status);
    }

    if (params?.organization) {
      users = users.filter(u => u.profile.organization === params.organization);
    }

    if (params?.department) {
      users = users.filter(u => u.profile.department === params.department);
    }

    if (params?.role) {
      users = users.filter(u => u.roles.some(r => r.roleId === params.role || r.roleName === params.role));
    }

    return users.sort((a, b) => a.profile.lastName.localeCompare(b.profile.lastName));
  }

  async updateUserStatus(userId: string, status: UserStatus, reason?: string): Promise<UserAccount> {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User not found: ${userId}`);

    user.status = status;
    user.accessHistory.push({
      timestamp: new Date(),
      action: 'permission_change',
      details: `Status changed to ${status}${reason ? `: ${reason}` : ''}`,
      success: true
    });
    user.updatedAt = new Date();
    return user;
  }

  async assignRole(userId: string, role: Omit<AssignedRole, 'active'>): Promise<UserAccount> {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User not found: ${userId}`);

    user.roles.push({ ...role, active: true });
    user.accessHistory.push({
      timestamp: new Date(),
      action: 'role_change',
      details: `Role assigned: ${role.roleName}`,
      success: true
    });
    user.updatedAt = new Date();
    return user;
  }

  async revokeRole(userId: string, roleId: string, reason: string): Promise<UserAccount> {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User not found: ${userId}`);

    const role = user.roles.find(r => r.roleId === roleId);
    if (role) {
      role.active = false;
      user.accessHistory.push({
        timestamp: new Date(),
        action: 'role_change',
        details: `Role revoked: ${role.roleName} - ${reason}`,
        success: true
      });
    }
    user.updatedAt = new Date();
    return user;
  }

  async grantPermission(userId: string, permission: DirectPermission): Promise<UserAccount> {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User not found: ${userId}`);

    user.permissions.push(permission);
    user.accessHistory.push({
      timestamp: new Date(),
      action: 'permission_change',
      details: `Permission granted: ${permission.permissionName}`,
      success: true
    });
    user.updatedAt = new Date();
    return user;
  }

  async recordAccessAttempt(userId: string, entry: Omit<AccessHistoryEntry, 'timestamp'>): Promise<UserAccount> {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User not found: ${userId}`);

    user.accessHistory.push({ ...entry, timestamp: new Date() });
    
    if (entry.action === 'login') {
      if (entry.success) {
        user.authentication.lastLogin = new Date();
        user.authentication.lastLoginIp = entry.ipAddress;
        user.authentication.failedAttempts = 0;
      } else {
        user.authentication.failedAttempts++;
        if (user.authentication.failedAttempts >= 5) {
          user.status = 'locked';
          user.authentication.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        }
      }
    }
    
    user.updatedAt = new Date();
    return user;
  }

  // ==================== Role Management ====================

  async createRole(params: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    const role: Role = {
      ...params,
      id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.roles.set(role.id, role);
    return role;
  }

  async getRole(roleId: string): Promise<Role | null> {
    return this.roles.get(roleId) || null;
  }

  async getRoles(params?: {
    type?: RoleType;
    status?: Role['status'];
    category?: string;
  }): Promise<Role[]> {
    let roles = Array.from(this.roles.values());

    if (params?.type) {
      roles = roles.filter(r => r.type === params.type);
    }

    if (params?.status) {
      roles = roles.filter(r => r.status === params.status);
    }

    if (params?.category) {
      roles = roles.filter(r => r.metadata.category === params.category);
    }

    return roles.sort((a, b) => a.name.localeCompare(b.name));
  }

  async addPermissionToRole(roleId: string, permission: RolePermission): Promise<Role> {
    const role = this.roles.get(roleId);
    if (!role) throw new Error(`Role not found: ${roleId}`);

    role.permissions.push(permission);
    role.updatedAt = new Date();
    return role;
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<Role> {
    const role = this.roles.get(roleId);
    if (!role) throw new Error(`Role not found: ${roleId}`);

    role.permissions = role.permissions.filter(p => p.permissionId !== permissionId);
    role.updatedAt = new Date();
    return role;
  }

  // ==================== Access Request Management ====================

  async createAccessRequest(params: Omit<AccessRequest, 'id' | 'requestNumber' | 'status' | 'approvals' | 'timeline' | 'createdAt' | 'updatedAt'>): Promise<AccessRequest> {
    const role = await this.getRole(params.requestedItems[0]?.itemId);
    const approvalLevels = role?.metadata.approvalLevels || 1;

    const request: AccessRequest = {
      ...params,
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requestNumber: `AR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'pending',
      approvals: Array.from({ length: approvalLevels }, (_, i) => ({
        level: i + 1,
        approverRole: i === 0 ? 'Manager' : i === 1 ? 'Security Admin' : 'Executive',
        status: 'pending'
      })),
      timeline: {
        submitted: new Date(),
        lastUpdated: new Date(),
        events: [{ timestamp: new Date(), event: 'Request submitted', actor: params.requestor.name }]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accessRequests.set(request.id, request);
    return request;
  }

  async getAccessRequest(requestId: string): Promise<AccessRequest | null> {
    return this.accessRequests.get(requestId) || null;
  }

  async getAccessRequests(params?: {
    status?: AccessRequestStatus;
    requestorId?: string;
    beneficiaryId?: string;
    pendingApproverRole?: string;
  }): Promise<AccessRequest[]> {
    let requests = Array.from(this.accessRequests.values());

    if (params?.status) {
      requests = requests.filter(r => r.status === params.status);
    }

    if (params?.requestorId) {
      requests = requests.filter(r => r.requestor.userId === params.requestorId);
    }

    if (params?.beneficiaryId) {
      requests = requests.filter(r => r.beneficiary.userId === params.beneficiaryId);
    }

    if (params?.pendingApproverRole) {
      requests = requests.filter(r => 
        r.approvals.some(a => a.status === 'pending' && a.approverRole === params.pendingApproverRole)
      );
    }

    return requests.sort((a, b) => b.timeline.submitted.getTime() - a.timeline.submitted.getTime());
  }

  async approveAccessRequest(requestId: string, level: number, approver: string, comments?: string): Promise<AccessRequest> {
    const request = this.accessRequests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    const approval = request.approvals.find(a => a.level === level);
    if (!approval) throw new Error(`Approval level not found: ${level}`);

    approval.status = 'approved';
    approval.approver = approver;
    approval.approvedAt = new Date();
    approval.comments = comments;

    request.timeline.events.push({
      timestamp: new Date(),
      event: `Level ${level} approved`,
      actor: approver,
      details: comments
    });
    request.timeline.lastUpdated = new Date();

    // Check if all approvals are complete
    if (request.approvals.every(a => a.status === 'approved')) {
      request.status = 'approved';
      request.timeline.approved = new Date();

      // Auto-provision the access
      await this.provisionAccess(request);
      request.timeline.provisioned = new Date();
    }

    request.updatedAt = new Date();
    return request;
  }

  async denyAccessRequest(requestId: string, level: number, approver: string, reason: string): Promise<AccessRequest> {
    const request = this.accessRequests.get(requestId);
    if (!request) throw new Error(`Request not found: ${requestId}`);

    const approval = request.approvals.find(a => a.level === level);
    if (approval) {
      approval.status = 'denied';
      approval.approver = approver;
      approval.approvedAt = new Date();
      approval.comments = reason;
    }

    request.status = 'denied';
    request.timeline.denied = new Date();
    request.timeline.events.push({
      timestamp: new Date(),
      event: `Request denied at level ${level}`,
      actor: approver,
      details: reason
    });

    request.requestedItems.forEach(item => {
      item.status = 'denied';
      item.denialReason = reason;
    });

    request.updatedAt = new Date();
    return request;
  }

  private async provisionAccess(request: AccessRequest): Promise<void> {
    for (const item of request.requestedItems) {
      if (item.type === 'role') {
        await this.assignRole(request.beneficiary.userId, {
          roleId: item.itemId,
          roleName: item.itemName,
          assignedAt: new Date(),
          expiresAt: item.endDate,
          assignedBy: 'System (Auto-provisioned)',
          scope: item.scope || { type: 'global' },
          reason: request.justification
        });
      }
      item.status = 'approved';
    }
  }

  // ==================== Access Policy Management ====================

  async createAccessPolicy(params: Omit<AccessPolicy, 'id' | 'createdAt' | 'updatedAt'>): Promise<AccessPolicy> {
    const policy: AccessPolicy = {
      ...params,
      id: `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accessPolicies.set(policy.id, policy);
    return policy;
  }

  async getAccessPolicy(policyId: string): Promise<AccessPolicy | null> {
    return this.accessPolicies.get(policyId) || null;
  }

  async getAccessPolicies(params?: {
    type?: AccessPolicy['type'];
    status?: AccessPolicy['status'];
  }): Promise<AccessPolicy[]> {
    let policies = Array.from(this.accessPolicies.values());

    if (params?.type) {
      policies = policies.filter(p => p.type === params.type);
    }

    if (params?.status) {
      policies = policies.filter(p => p.status === params.status);
    }

    return policies.sort((a, b) => a.priority - b.priority);
  }

  async evaluateAccess(userId: string, resource: string, action: string): Promise<{ allowed: boolean; reason: string; policies: string[] }> {
    const user = await this.getUser(userId);
    if (!user) return { allowed: false, reason: 'User not found', policies: [] };

    if (user.status !== 'active') {
      return { allowed: false, reason: `User status: ${user.status}`, policies: [] };
    }

    // Check role-based permissions
    for (const role of user.roles.filter(r => r.active)) {
      const roleObj = await this.getRole(role.roleId);
      if (roleObj) {
        const hasPermission = roleObj.permissions.some(p =>
          p.resource === resource && p.actions.includes(action)
        );
        if (hasPermission) {
          return { allowed: true, reason: `Granted by role: ${role.roleName}`, policies: [role.roleId] };
        }
      }
    }

    // Check direct permissions
    const directPerm = user.permissions.find(p =>
      p.resource === resource && p.actions.includes(action) &&
      (!p.expiresAt || p.expiresAt > new Date())
    );
    if (directPerm) {
      return { allowed: true, reason: `Direct permission: ${directPerm.permissionName}`, policies: [directPerm.permissionId] };
    }

    return { allowed: false, reason: 'No matching permission found', policies: [] };
  }

  // ==================== Access Review Management ====================

  async createAccessReview(params: Omit<AccessReview, 'id' | 'reviewNumber' | 'status' | 'items' | 'statistics' | 'createdAt' | 'updatedAt'>): Promise<AccessReview> {
    const review: AccessReview = {
      ...params,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reviewNumber: `REV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'scheduled',
      items: [],
      statistics: {
        totalItems: 0,
        completedItems: 0,
        approvedItems: 0,
        revokedItems: 0,
        modifiedItems: 0,
        escalatedItems: 0,
        pendingItems: 0,
        completionRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accessReviews.set(review.id, review);
    return review;
  }

  async getAccessReview(reviewId: string): Promise<AccessReview | null> {
    return this.accessReviews.get(reviewId) || null;
  }

  async getAccessReviews(params?: {
    status?: AccessReview['status'];
    type?: AccessReview['type'];
  }): Promise<AccessReview[]> {
    let reviews = Array.from(this.accessReviews.values());

    if (params?.status) {
      reviews = reviews.filter(r => r.status === params.status);
    }

    if (params?.type) {
      reviews = reviews.filter(r => r.type === params.type);
    }

    return reviews.sort((a, b) => b.schedule.startDate.getTime() - a.schedule.startDate.getTime());
  }

  async submitReviewDecision(reviewId: string, itemId: string, decision: ReviewItem['decision'], reviewer: string, comments?: string): Promise<AccessReview> {
    const review = this.accessReviews.get(reviewId);
    if (!review) throw new Error(`Review not found: ${reviewId}`);

    const item = review.items.find(i => i.id === itemId);
    if (!item) throw new Error(`Item not found: ${itemId}`);

    item.decision = decision;
    item.reviewer = reviewer;
    item.decisionDate = new Date();
    item.comments = comments;

    // Update statistics
    review.statistics.completedItems++;
    if (decision === 'approve') review.statistics.approvedItems++;
    else if (decision === 'revoke') review.statistics.revokedItems++;
    else if (decision === 'modify') review.statistics.modifiedItems++;
    else if (decision === 'escalate') review.statistics.escalatedItems++;

    review.statistics.pendingItems = review.statistics.totalItems - review.statistics.completedItems;
    review.statistics.completionRate = (review.statistics.completedItems / review.statistics.totalItems) * 100;

    if (review.statistics.completedItems === review.statistics.totalItems) {
      review.status = 'completed';
    }

    review.updatedAt = new Date();
    return review;
  }

  // ==================== Session Management ====================

  async createSession(params: Omit<UserSession, 'id' | 'status' | 'activities' | 'elevatedAccess'>): Promise<UserSession> {
    const session: UserSession = {
      ...params,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      activities: [],
      elevatedAccess: []
    };

    this.sessions.set(session.id, session);
    return session;
  }

  async getSession(sessionId: string): Promise<UserSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async getUserSessions(userId: string, activeOnly: boolean = true): Promise<UserSession[]> {
    return Array.from(this.sessions.values())
      .filter(s => s.userId === userId && (!activeOnly || s.status === 'active'));
  }

  async terminateSession(sessionId: string): Promise<UserSession> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    session.status = 'terminated';
    session.terminatedAt = new Date();
    return session;
  }

  async terminateAllUserSessions(userId: string): Promise<number> {
    const sessions = await this.getUserSessions(userId, true);
    for (const session of sessions) {
      await this.terminateSession(session.id);
    }
    return sessions.length;
  }

  // ==================== Statistics ====================

  async getStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    lockedUsers: number;
    totalRoles: number;
    activeRoles: number;
    highRiskRoles: number;
    pendingRequests: number;
    requestsThisMonth: number;
    approvalRate: number;
    averageApprovalTime: number;
    activeSessions: number;
    mfaAdoptionRate: number;
    pendingReviews: number;
    overdueReviews: number;
    accessViolations: number;
  }> {
    const users = Array.from(this.users.values());
    const roles = Array.from(this.roles.values());
    const requests = Array.from(this.accessRequests.values());
    const sessions = Array.from(this.sessions.values());
    const reviews = Array.from(this.accessReviews.values());

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const requestsThisMonth = requests.filter(r => r.timeline.submitted >= thisMonth);
    const approvedRequests = requests.filter(r => r.status === 'approved');
    const decidedRequests = requests.filter(r => ['approved', 'denied'].includes(r.status));

    let totalApprovalTime = 0;
    let approvalTimeCount = 0;
    approvedRequests.forEach(r => {
      if (r.timeline.approved) {
        totalApprovalTime += r.timeline.approved.getTime() - r.timeline.submitted.getTime();
        approvalTimeCount++;
      }
    });

    const mfaEnabledUsers = users.filter(u => u.authentication.mfaEnabled);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      lockedUsers: users.filter(u => u.status === 'locked').length,
      totalRoles: roles.length,
      activeRoles: roles.filter(r => r.status === 'active').length,
      highRiskRoles: roles.filter(r => r.metadata.riskLevel === 'high' || r.metadata.riskLevel === 'critical').length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      requestsThisMonth: requestsThisMonth.length,
      approvalRate: decidedRequests.length > 0 ? (approvedRequests.length / decidedRequests.length) * 100 : 0,
      averageApprovalTime: approvalTimeCount > 0 ? totalApprovalTime / approvalTimeCount / (1000 * 60 * 60) : 0,
      activeSessions: sessions.filter(s => s.status === 'active').length,
      mfaAdoptionRate: users.length > 0 ? (mfaEnabledUsers.length / users.length) * 100 : 0,
      pendingReviews: reviews.filter(r => r.status === 'in_progress').length,
      overdueReviews: reviews.filter(r => r.status === 'in_progress' && r.schedule.endDate < now).length,
      accessViolations: users.reduce((sum, u) =>
        sum + u.accessHistory.filter(h => h.action === 'access_denied').length, 0
      )
    };
  }
}

export const accessManagementService = AccessManagementService.getInstance();
export default AccessManagementService;

/**
 * Crisis Hotline Service - Issue #125 Implementation
 * 
 * Provides crisis hotline management, call routing, queue management, and agent
 * coordination for emergency communication centers. Supports multi-channel
 * communication including voice, text, and chat.
 */

// Status and type definitions
type CallStatus = 'queued' | 'ringing' | 'active' | 'on_hold' | 'transferred' | 'completed' | 'abandoned' | 'failed';
type AgentStatus = 'available' | 'busy' | 'on_call' | 'wrap_up' | 'break' | 'offline' | 'training';
type ChannelType = 'voice' | 'sms' | 'chat' | 'video' | 'tty' | 'relay';
type CrisisLevel = 'critical' | 'high' | 'medium' | 'low';
type CrisisType = 'suicide' | 'domestic_violence' | 'child_abuse' | 'substance_abuse' | 'disaster' | 'mental_health' | 'welfare_check' | 'general';
type DispositionCode = 'resolved' | 'referred' | 'follow_up_needed' | 'emergency_dispatch' | 'callback_scheduled' | 'disconnected' | 'wrong_number' | 'test_call';

// Agent interfaces
interface HotlineAgent {
  id: string;
  name: string;
  employeeId: string;
  status: AgentStatus;
  skills: AgentSkill[];
  languages: string[];
  certifications: string[];
  currentCall?: string;
  queue: string;
  shift: AgentShift;
  metrics: AgentMetrics;
  lastStatusChange: Date;
  createdAt: Date;
}

interface AgentSkill {
  type: CrisisType;
  level: 'basic' | 'intermediate' | 'advanced' | 'specialist';
  certified: boolean;
}

interface AgentShift {
  startTime: Date;
  endTime: Date;
  breaks: { start: Date; end: Date; type: 'lunch' | 'short' | 'training' }[];
}

interface AgentMetrics {
  callsHandled: number;
  averageHandleTime: number; // seconds
  averageWrapUpTime: number; // seconds
  customerSatisfaction: number; // 0-5
  firstCallResolution: number; // percentage
  transferRate: number; // percentage
  escalationRate: number; // percentage
  shiftCallsToday: number;
}

// Call interfaces
interface HotlineCall {
  id: string;
  channel: ChannelType;
  status: CallStatus;
  crisisLevel: CrisisLevel;
  crisisType: CrisisType;
  caller: CallerInfo;
  agent?: {
    id: string;
    name: string;
    assignedAt: Date;
  };
  queue: CallQueue;
  timing: CallTiming;
  notes: CallNote[];
  disposition?: CallDisposition;
  recording?: CallRecording;
  transcript?: string;
  tags: string[];
  metadata: Record<string, any>;
}

interface CallerInfo {
  callerId?: string;
  phone?: string;
  name?: string;
  location?: {
    lat?: number;
    lon?: number;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  language: string;
  previousCalls: number;
  riskLevel?: CrisisLevel;
  specialNeeds?: string[];
}

interface CallQueue {
  id: string;
  name: string;
  priority: number;
  position?: number;
  estimatedWait?: number;
}

interface CallTiming {
  created: Date;
  queued?: Date;
  answered?: Date;
  holdTimes: { start: Date; end?: Date; reason: string }[];
  ended?: Date;
  totalDuration?: number;
  talkTime?: number;
  holdTime?: number;
  wrapUpTime?: number;
}

interface CallNote {
  id: string;
  timestamp: Date;
  author: string;
  content: string;
  type: 'assessment' | 'action' | 'referral' | 'safety_plan' | 'general';
  confidential: boolean;
}

interface CallDisposition {
  code: DispositionCode;
  details: string;
  referrals: Referral[];
  followUp?: {
    required: boolean;
    scheduledFor?: Date;
    assignedTo?: string;
    notes?: string;
  };
  safetyPlan?: SafetyPlan;
  emergencyDispatch?: EmergencyDispatch;
}

interface Referral {
  id: string;
  organization: string;
  service: string;
  phone?: string;
  address?: string;
  notes?: string;
  warm: boolean; // warm transfer vs cold referral
}

interface SafetyPlan {
  id: string;
  warningSignals: string[];
  copingStrategies: string[];
  supportContacts: { name: string; phone: string; relationship: string }[];
  professionalContacts: { name: string; phone: string; organization: string }[];
  environmentSafety: string[];
  reasonsForLiving: string[];
  createdAt: Date;
}

interface EmergencyDispatch {
  id: string;
  type: 'police' | 'fire' | 'ems' | 'mobile_crisis' | 'welfare_check';
  status: 'requested' | 'dispatched' | 'arrived' | 'completed' | 'cancelled';
  location: CallerInfo['location'];
  priority: 'emergency' | 'urgent' | 'routine';
  notes: string;
  dispatchedAt?: Date;
  responderId?: string;
}

interface CallRecording {
  id: string;
  url: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  encrypted: boolean;
  retentionDate: Date;
}

// Queue interfaces
interface HotlineQueue {
  id: string;
  name: string;
  description: string;
  crisisTypes: CrisisType[];
  priority: number;
  config: QueueConfig;
  status: 'active' | 'paused' | 'overflow' | 'closed';
  statistics: QueueStatistics;
}

interface QueueConfig {
  maxWaitTime: number; // seconds
  wrapUpTime: number; // seconds
  serviceLevel: { threshold: number; target: number }; // e.g., 80% answered within 30s
  overflowQueue?: string;
  afterHoursQueue?: string;
  skills: CrisisType[];
  languages: string[];
  maxQueueSize: number;
  announcements: QueueAnnouncement[];
}

interface QueueAnnouncement {
  type: 'welcome' | 'wait_time' | 'position' | 'options' | 'callback_offer';
  message: string;
  interval?: number; // seconds between repeats
}

interface QueueStatistics {
  callsWaiting: number;
  callsInProgress: number;
  averageWaitTime: number;
  longestWaitTime: number;
  abandonRate: number;
  serviceLevelMet: number;
  agentsAvailable: number;
  agentsOnCall: number;
}

// Callback interfaces
interface ScheduledCallback {
  id: string;
  callerId: string;
  phone: string;
  name?: string;
  scheduledFor: Date;
  reason: string;
  crisisType: CrisisType;
  crisisLevel: CrisisLevel;
  assignedAgent?: string;
  status: 'scheduled' | 'attempted' | 'completed' | 'failed' | 'cancelled';
  attempts: { timestamp: Date; result: string }[];
  originalCallId?: string;
  notes?: string;
}

// IVR interfaces
interface IVRMenu {
  id: string;
  name: string;
  prompt: string;
  options: IVROption[];
  timeout: number;
  maxRetries: number;
  defaultAction: string;
}

interface IVROption {
  digit: string;
  description: string;
  action: 'queue' | 'transfer' | 'menu' | 'voicemail' | 'callback' | 'info';
  target: string;
}

// Supervisor interfaces
interface SupervisorAlert {
  id: string;
  type: 'long_call' | 'high_crisis' | 'queue_threshold' | 'agent_help' | 'abandoned_call';
  severity: 'info' | 'warning' | 'critical';
  callId?: string;
  agentId?: string;
  queueId?: string;
  message: string;
  acknowledged: boolean;
  timestamp: Date;
}

// Subscription interface
interface HotlineSubscription {
  id: string;
  callback: (event: HotlineEvent) => void;
  eventTypes?: HotlineEventType[];
}

type HotlineEventType = 'call_received' | 'call_answered' | 'call_ended' | 'agent_status' | 'queue_alert' | 'supervisor_alert' | 'callback_due';

interface HotlineEvent {
  type: HotlineEventType;
  timestamp: Date;
  data: any;
}

// Sample data
const sampleQueues: HotlineQueue[] = [
  {
    id: 'queue-crisis',
    name: 'Crisis Line',
    description: 'Primary crisis intervention queue',
    crisisTypes: ['suicide', 'mental_health', 'substance_abuse'],
    priority: 1,
    config: {
      maxWaitTime: 60,
      wrapUpTime: 120,
      serviceLevel: { threshold: 30, target: 80 },
      skills: ['suicide', 'mental_health'],
      languages: ['en', 'es'],
      maxQueueSize: 50,
      announcements: [
        { type: 'welcome', message: 'Thank you for calling the crisis line. Your call is important to us.' },
        { type: 'wait_time', message: 'Your estimated wait time is approximately {time} minutes.', interval: 60 }
      ]
    },
    status: 'active',
    statistics: {
      callsWaiting: 3,
      callsInProgress: 8,
      averageWaitTime: 45,
      longestWaitTime: 120,
      abandonRate: 5.2,
      serviceLevelMet: 82,
      agentsAvailable: 4,
      agentsOnCall: 8
    }
  },
  {
    id: 'queue-disaster',
    name: 'Disaster Response',
    description: 'Emergency disaster assistance',
    crisisTypes: ['disaster', 'welfare_check'],
    priority: 1,
    config: {
      maxWaitTime: 120,
      wrapUpTime: 90,
      serviceLevel: { threshold: 60, target: 90 },
      skills: ['disaster'],
      languages: ['en', 'es', 'zh', 'vi'],
      maxQueueSize: 100,
      announcements: [
        { type: 'welcome', message: 'Disaster assistance line. Please stay on the line.' }
      ]
    },
    status: 'active',
    statistics: {
      callsWaiting: 12,
      callsInProgress: 15,
      averageWaitTime: 180,
      longestWaitTime: 420,
      abandonRate: 8.5,
      serviceLevelMet: 75,
      agentsAvailable: 6,
      agentsOnCall: 15
    }
  }
];

const sampleAgents: HotlineAgent[] = [
  {
    id: 'agent-001',
    name: 'Sarah Johnson',
    employeeId: 'EMP-1001',
    status: 'available',
    skills: [
      { type: 'suicide', level: 'specialist', certified: true },
      { type: 'mental_health', level: 'advanced', certified: true },
      { type: 'substance_abuse', level: 'intermediate', certified: true }
    ],
    languages: ['en', 'es'],
    certifications: ['QPR', 'ASIST', 'CIT'],
    queue: 'queue-crisis',
    shift: {
      startTime: new Date('2026-01-09T08:00:00'),
      endTime: new Date('2026-01-09T16:00:00'),
      breaks: []
    },
    metrics: {
      callsHandled: 1245,
      averageHandleTime: 1200,
      averageWrapUpTime: 90,
      customerSatisfaction: 4.8,
      firstCallResolution: 78,
      transferRate: 8,
      escalationRate: 3,
      shiftCallsToday: 12
    },
    lastStatusChange: new Date(),
    createdAt: new Date('2023-01-15')
  }
];

class CrisisHotlineService {
  private static instance: CrisisHotlineService;
  private queues: Map<string, HotlineQueue> = new Map();
  private agents: Map<string, HotlineAgent> = new Map();
  private calls: Map<string, HotlineCall> = new Map();
  private callbacks: Map<string, ScheduledCallback> = new Map();
  private ivrMenus: Map<string, IVRMenu> = new Map();
  private alerts: Map<string, SupervisorAlert> = new Map();
  private subscriptions: Map<string, HotlineSubscription> = new Map();
  private callQueue: HotlineCall[] = [];

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): CrisisHotlineService {
    if (!CrisisHotlineService.instance) {
      CrisisHotlineService.instance = new CrisisHotlineService();
    }
    return CrisisHotlineService.instance;
  }

  private initializeSampleData(): void {
    sampleQueues.forEach(q => this.queues.set(q.id, q));
    sampleAgents.forEach(a => this.agents.set(a.id, a));
    this.initializeIVRMenus();
  }

  private initializeIVRMenus(): void {
    const mainMenu: IVRMenu = {
      id: 'ivr-main',
      name: 'Main Menu',
      prompt: 'Press 1 for crisis support, 2 for disaster assistance, 3 for general information, or stay on the line to speak with someone.',
      options: [
        { digit: '1', description: 'Crisis Support', action: 'queue', target: 'queue-crisis' },
        { digit: '2', description: 'Disaster Assistance', action: 'queue', target: 'queue-disaster' },
        { digit: '3', description: 'Information', action: 'info', target: 'info-general' },
        { digit: '0', description: 'Operator', action: 'queue', target: 'queue-general' }
      ],
      timeout: 10,
      maxRetries: 3,
      defaultAction: 'queue-crisis'
    };
    this.ivrMenus.set(mainMenu.id, mainMenu);
  }

  // ==================== Call Management ====================

  async receiveCall(params: {
    channel: ChannelType;
    caller: CallerInfo;
    crisisType?: CrisisType;
  }): Promise<HotlineCall> {
    const call: HotlineCall = {
      id: `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      channel: params.channel,
      status: 'queued',
      crisisLevel: this.assessInitialCrisisLevel(params.caller),
      crisisType: params.crisisType || 'general',
      caller: params.caller,
      queue: this.selectQueue(params.crisisType || 'general', params.caller.language),
      timing: {
        created: new Date(),
        queued: new Date(),
        holdTimes: []
      },
      notes: [],
      tags: [],
      metadata: {}
    };

    this.calls.set(call.id, call);
    this.callQueue.push(call);
    this.updateQueueStatistics(call.queue.id);

    this.emitEvent({
      type: 'call_received',
      timestamp: new Date(),
      data: { callId: call.id, crisisLevel: call.crisisLevel, queue: call.queue.name }
    });

    // Check for immediate escalation
    if (call.crisisLevel === 'critical') {
      await this.escalateCall(call.id, 'Critical crisis level detected');
    }

    // Route to available agent
    await this.routeCall(call.id);

    return call;
  }

  private assessInitialCrisisLevel(caller: CallerInfo): CrisisLevel {
    if (caller.riskLevel) return caller.riskLevel;
    if (caller.previousCalls > 5) return 'medium';
    return 'low';
  }

  private selectQueue(crisisType: CrisisType, language: string): CallQueue {
    // Find best matching queue
    let bestQueue: HotlineQueue | null = null;
    let bestScore = -1;

    for (const queue of this.queues.values()) {
      if (queue.status !== 'active') continue;
      
      let score = 0;
      if (queue.crisisTypes.includes(crisisType)) score += 10;
      if (queue.config.languages.includes(language)) score += 5;
      score -= queue.statistics.callsWaiting; // Penalize busy queues
      
      if (score > bestScore) {
        bestScore = score;
        bestQueue = queue;
      }
    }

    if (!bestQueue) {
      bestQueue = Array.from(this.queues.values())[0];
    }

    return {
      id: bestQueue.id,
      name: bestQueue.name,
      priority: bestQueue.priority,
      position: bestQueue.statistics.callsWaiting + 1,
      estimatedWait: this.estimateWaitTime(bestQueue)
    };
  }

  private estimateWaitTime(queue: HotlineQueue): number {
    if (queue.statistics.agentsAvailable > 0) return 0;
    
    const avgHandleTime = 900; // 15 minutes average
    const callsAhead = queue.statistics.callsWaiting;
    const agentsTotal = queue.statistics.agentsAvailable + queue.statistics.agentsOnCall;
    
    if (agentsTotal === 0) return 3600; // 1 hour if no agents
    
    return Math.ceil((callsAhead / agentsTotal) * avgHandleTime);
  }

  async routeCall(callId: string): Promise<boolean> {
    const call = this.calls.get(callId);
    if (!call || call.status !== 'queued') return false;

    // Find available agent with matching skills
    const agent = this.findBestAgent(call);
    if (!agent) return false;

    call.status = 'ringing';
    call.agent = {
      id: agent.id,
      name: agent.name,
      assignedAt: new Date()
    };

    // Update agent status
    agent.status = 'on_call';
    agent.currentCall = callId;
    agent.lastStatusChange = new Date();

    // Remove from queue
    const queueIndex = this.callQueue.findIndex(c => c.id === callId);
    if (queueIndex > -1) this.callQueue.splice(queueIndex, 1);

    this.updateQueueStatistics(call.queue.id);

    return true;
  }

  private findBestAgent(call: HotlineCall): HotlineAgent | null {
    const availableAgents = Array.from(this.agents.values())
      .filter(a => a.status === 'available' && a.queue === call.queue.id);

    if (availableAgents.length === 0) return null;

    // Score agents based on skills, language, and metrics
    let bestAgent: HotlineAgent | null = null;
    let bestScore = -1;

    for (const agent of availableAgents) {
      let score = 0;

      // Skill match
      const skill = agent.skills.find(s => s.type === call.crisisType);
      if (skill) {
        const skillScores = { basic: 1, intermediate: 2, advanced: 3, specialist: 4 };
        score += skillScores[skill.level] * 10;
        if (skill.certified) score += 5;
      }

      // Language match
      if (agent.languages.includes(call.caller.language)) {
        score += 15;
      }

      // Performance metrics
      score += agent.metrics.customerSatisfaction * 2;
      score += agent.metrics.firstCallResolution / 10;

      // Workload balancing (prefer agents with fewer calls today)
      score -= agent.metrics.shiftCallsToday;

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return bestAgent;
  }

  async answerCall(callId: string, agentId: string): Promise<HotlineCall> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    call.status = 'active';
    call.timing.answered = new Date();

    this.emitEvent({
      type: 'call_answered',
      timestamp: new Date(),
      data: { callId, agentId, agentName: agent.name, waitTime: this.calculateWaitTime(call) }
    });

    return call;
  }

  async holdCall(callId: string, reason: string): Promise<HotlineCall> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    call.status = 'on_hold';
    call.timing.holdTimes.push({ start: new Date(), reason });

    return call;
  }

  async resumeCall(callId: string): Promise<HotlineCall> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    const lastHold = call.timing.holdTimes[call.timing.holdTimes.length - 1];
    if (lastHold && !lastHold.end) {
      lastHold.end = new Date();
    }

    call.status = 'active';
    return call;
  }

  async transferCall(callId: string, targetQueueId: string, warm: boolean = true): Promise<HotlineCall> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    const targetQueue = this.queues.get(targetQueueId);
    if (!targetQueue) throw new Error(`Queue not found: ${targetQueueId}`);

    // Release current agent
    if (call.agent) {
      const agent = this.agents.get(call.agent.id);
      if (agent) {
        agent.status = warm ? 'busy' : 'wrap_up';
        agent.currentCall = undefined;
        agent.metrics.transferRate++;
      }
    }

    call.status = 'transferred';
    call.queue = {
      id: targetQueue.id,
      name: targetQueue.name,
      priority: targetQueue.priority
    };

    // Re-route the call
    if (!warm) {
      call.agent = undefined;
      call.status = 'queued';
      this.callQueue.push(call);
    }

    await this.routeCall(callId);

    return call;
  }

  async endCall(callId: string, disposition: CallDisposition): Promise<HotlineCall> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    call.status = 'completed';
    call.timing.ended = new Date();
    call.disposition = disposition;

    // Calculate timing
    if (call.timing.answered) {
      call.timing.totalDuration = (call.timing.ended.getTime() - call.timing.created.getTime()) / 1000;
      call.timing.talkTime = (call.timing.ended.getTime() - call.timing.answered.getTime()) / 1000;
      call.timing.holdTime = call.timing.holdTimes.reduce((total, hold) => {
        const end = hold.end || new Date();
        return total + (end.getTime() - hold.start.getTime()) / 1000;
      }, 0);
    }

    // Update agent metrics and status
    if (call.agent) {
      const agent = this.agents.get(call.agent.id);
      if (agent) {
        agent.status = 'wrap_up';
        agent.currentCall = undefined;
        agent.metrics.callsHandled++;
        agent.metrics.shiftCallsToday++;
        agent.metrics.averageHandleTime = 
          (agent.metrics.averageHandleTime * (agent.metrics.callsHandled - 1) + (call.timing.talkTime || 0)) 
          / agent.metrics.callsHandled;
        
        // Auto-return to available after wrap-up time
        const queue = this.queues.get(call.queue.id);
        const wrapUpTime = queue?.config.wrapUpTime || 120;
        setTimeout(() => {
          if (agent.status === 'wrap_up') {
            agent.status = 'available';
            agent.lastStatusChange = new Date();
            this.emitEvent({
              type: 'agent_status',
              timestamp: new Date(),
              data: { agentId: agent.id, status: 'available' }
            });
          }
        }, wrapUpTime * 1000);
      }
    }

    this.emitEvent({
      type: 'call_ended',
      timestamp: new Date(),
      data: {
        callId,
        duration: call.timing.totalDuration,
        disposition: disposition.code,
        crisisLevel: call.crisisLevel
      }
    });

    // Schedule follow-up if needed
    if (disposition.followUp?.required && disposition.followUp.scheduledFor) {
      await this.scheduleCallback({
        callerId: call.caller.callerId || call.id,
        phone: call.caller.phone || '',
        name: call.caller.name,
        scheduledFor: disposition.followUp.scheduledFor,
        reason: 'Follow-up call',
        crisisType: call.crisisType,
        crisisLevel: call.crisisLevel,
        assignedAgent: disposition.followUp.assignedTo,
        originalCallId: callId
      });
    }

    return call;
  }

  async escalateCall(callId: string, reason: string): Promise<SupervisorAlert> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    call.crisisLevel = 'critical';
    call.tags.push('escalated');

    const alert: SupervisorAlert = {
      id: `alert-${Date.now()}`,
      type: 'high_crisis',
      severity: 'critical',
      callId,
      agentId: call.agent?.id,
      message: `Escalation: ${reason}`,
      acknowledged: false,
      timestamp: new Date()
    };

    this.alerts.set(alert.id, alert);

    this.emitEvent({
      type: 'supervisor_alert',
      timestamp: new Date(),
      data: alert
    });

    return alert;
  }

  // ==================== Call Notes & Safety Plans ====================

  async addCallNote(callId: string, note: Omit<CallNote, 'id' | 'timestamp'>): Promise<CallNote> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    const newNote: CallNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: new Date()
    };

    call.notes.push(newNote);
    return newNote;
  }

  async createSafetyPlan(callId: string, plan: Omit<SafetyPlan, 'id' | 'createdAt'>): Promise<SafetyPlan> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    const safetyPlan: SafetyPlan = {
      ...plan,
      id: `sp-${Date.now()}`,
      createdAt: new Date()
    };

    if (!call.disposition) {
      call.disposition = {
        code: 'resolved',
        details: '',
        referrals: []
      };
    }
    call.disposition.safetyPlan = safetyPlan;

    return safetyPlan;
  }

  async requestEmergencyDispatch(callId: string, dispatch: Omit<EmergencyDispatch, 'id' | 'status' | 'dispatchedAt'>): Promise<EmergencyDispatch> {
    const call = this.calls.get(callId);
    if (!call) throw new Error(`Call not found: ${callId}`);

    const emergencyDispatch: EmergencyDispatch = {
      ...dispatch,
      id: `dispatch-${Date.now()}`,
      status: 'requested',
      dispatchedAt: new Date()
    };

    if (!call.disposition) {
      call.disposition = {
        code: 'emergency_dispatch',
        details: `Emergency ${dispatch.type} dispatch requested`,
        referrals: []
      };
    }
    call.disposition.emergencyDispatch = emergencyDispatch;

    // Emit high priority alert
    this.emitEvent({
      type: 'supervisor_alert',
      timestamp: new Date(),
      data: {
        type: 'emergency_dispatch',
        severity: 'critical',
        callId,
        message: `Emergency ${dispatch.type} dispatch requested`,
        dispatch: emergencyDispatch
      }
    });

    return emergencyDispatch;
  }

  // ==================== Agent Management ====================

  async registerAgent(agent: Omit<HotlineAgent, 'id' | 'metrics' | 'lastStatusChange' | 'createdAt'>): Promise<HotlineAgent> {
    const newAgent: HotlineAgent = {
      ...agent,
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metrics: {
        callsHandled: 0,
        averageHandleTime: 0,
        averageWrapUpTime: 0,
        customerSatisfaction: 0,
        firstCallResolution: 0,
        transferRate: 0,
        escalationRate: 0,
        shiftCallsToday: 0
      },
      lastStatusChange: new Date(),
      createdAt: new Date()
    };

    this.agents.set(newAgent.id, newAgent);
    return newAgent;
  }

  async updateAgentStatus(agentId: string, status: AgentStatus): Promise<HotlineAgent> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    const previousStatus = agent.status;
    agent.status = status;
    agent.lastStatusChange = new Date();

    if (status === 'offline' && agent.currentCall) {
      // Handle active call if agent goes offline
      const call = this.calls.get(agent.currentCall);
      if (call) {
        await this.transferCall(call.id, call.queue.id, false);
      }
    }

    this.updateQueueStatistics(agent.queue);

    this.emitEvent({
      type: 'agent_status',
      timestamp: new Date(),
      data: { agentId, previousStatus, newStatus: status }
    });

    return agent;
  }

  async getAgent(agentId: string): Promise<HotlineAgent | null> {
    return this.agents.get(agentId) || null;
  }

  async getAllAgents(filters?: {
    status?: AgentStatus[];
    queue?: string;
    skills?: CrisisType[];
  }): Promise<HotlineAgent[]> {
    let agents = Array.from(this.agents.values());

    if (filters?.status) {
      agents = agents.filter(a => filters.status!.includes(a.status));
    }

    if (filters?.queue) {
      agents = agents.filter(a => a.queue === filters.queue);
    }

    if (filters?.skills) {
      agents = agents.filter(a => 
        filters.skills!.some(skill => a.skills.some(s => s.type === skill))
      );
    }

    return agents;
  }

  async requestSupervisorHelp(agentId: string, callId: string, reason: string): Promise<SupervisorAlert> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    const alert: SupervisorAlert = {
      id: `alert-${Date.now()}`,
      type: 'agent_help',
      severity: 'warning',
      callId,
      agentId,
      message: `Agent ${agent.name} requests assistance: ${reason}`,
      acknowledged: false,
      timestamp: new Date()
    };

    this.alerts.set(alert.id, alert);

    this.emitEvent({
      type: 'supervisor_alert',
      timestamp: new Date(),
      data: alert
    });

    return alert;
  }

  // ==================== Queue Management ====================

  async getQueue(queueId: string): Promise<HotlineQueue | null> {
    return this.queues.get(queueId) || null;
  }

  async getAllQueues(): Promise<HotlineQueue[]> {
    return Array.from(this.queues.values());
  }

  async updateQueueStatus(queueId: string, status: HotlineQueue['status']): Promise<HotlineQueue> {
    const queue = this.queues.get(queueId);
    if (!queue) throw new Error(`Queue not found: ${queueId}`);

    queue.status = status;

    if (status === 'closed' || status === 'paused') {
      // Move calls to overflow queue if configured
      if (queue.config.overflowQueue) {
        const callsToMove = this.callQueue.filter(c => c.queue.id === queueId);
        for (const call of callsToMove) {
          call.queue = this.selectQueue(call.crisisType, call.caller.language);
        }
      }
    }

    return queue;
  }

  private updateQueueStatistics(queueId: string): void {
    const queue = this.queues.get(queueId);
    if (!queue) return;

    const queueCalls = this.callQueue.filter(c => c.queue.id === queueId);
    const activeCalls = Array.from(this.calls.values())
      .filter(c => c.queue.id === queueId && c.status === 'active');
    const queueAgents = Array.from(this.agents.values())
      .filter(a => a.queue === queueId);

    queue.statistics = {
      callsWaiting: queueCalls.length,
      callsInProgress: activeCalls.length,
      averageWaitTime: this.calculateAverageWaitTime(queueCalls),
      longestWaitTime: this.calculateLongestWaitTime(queueCalls),
      abandonRate: queue.statistics.abandonRate, // Would be calculated from historical data
      serviceLevelMet: this.calculateServiceLevel(queueId),
      agentsAvailable: queueAgents.filter(a => a.status === 'available').length,
      agentsOnCall: queueAgents.filter(a => a.status === 'on_call').length
    };

    // Check for queue alerts
    if (queue.statistics.callsWaiting > queue.config.maxQueueSize * 0.8) {
      this.createQueueAlert(queueId, 'queue_threshold', 
        `Queue ${queue.name} at ${Math.round(queue.statistics.callsWaiting / queue.config.maxQueueSize * 100)}% capacity`);
    }
  }

  private calculateAverageWaitTime(calls: HotlineCall[]): number {
    if (calls.length === 0) return 0;
    const now = Date.now();
    const totalWait = calls.reduce((sum, call) => 
      sum + (now - (call.timing.queued?.getTime() || call.timing.created.getTime())), 0);
    return totalWait / calls.length / 1000;
  }

  private calculateLongestWaitTime(calls: HotlineCall[]): number {
    if (calls.length === 0) return 0;
    const now = Date.now();
    return Math.max(...calls.map(call => 
      (now - (call.timing.queued?.getTime() || call.timing.created.getTime())) / 1000));
  }

  private calculateServiceLevel(queueId: string): number {
    // Would calculate based on calls answered within threshold
    return 80; // Placeholder
  }

  private calculateWaitTime(call: HotlineCall): number {
    if (!call.timing.answered || !call.timing.queued) return 0;
    return (call.timing.answered.getTime() - call.timing.queued.getTime()) / 1000;
  }

  private createQueueAlert(queueId: string, type: SupervisorAlert['type'], message: string): void {
    const alert: SupervisorAlert = {
      id: `alert-${Date.now()}`,
      type,
      severity: 'warning',
      queueId,
      message,
      acknowledged: false,
      timestamp: new Date()
    };

    this.alerts.set(alert.id, alert);
    this.emitEvent({ type: 'queue_alert', timestamp: new Date(), data: alert });
  }

  // ==================== Callback Management ====================

  async scheduleCallback(params: Omit<ScheduledCallback, 'id' | 'status' | 'attempts'>): Promise<ScheduledCallback> {
    const callback: ScheduledCallback = {
      ...params,
      id: `cb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      attempts: []
    };

    this.callbacks.set(callback.id, callback);

    // Schedule reminder
    const timeUntil = callback.scheduledFor.getTime() - Date.now();
    if (timeUntil > 0) {
      setTimeout(() => {
        this.emitEvent({
          type: 'callback_due',
          timestamp: new Date(),
          data: callback
        });
      }, Math.min(timeUntil, 2147483647)); // Max timeout value
    }

    return callback;
  }

  async executeCallback(callbackId: string, agentId: string): Promise<HotlineCall> {
    const callback = this.callbacks.get(callbackId);
    if (!callback) throw new Error(`Callback not found: ${callbackId}`);

    callback.attempts.push({ timestamp: new Date(), result: 'attempting' });

    // Create outbound call
    const call = await this.receiveCall({
      channel: 'voice',
      caller: {
        callerId: callback.callerId,
        phone: callback.phone,
        name: callback.name,
        language: 'en',
        previousCalls: 1
      },
      crisisType: callback.crisisType
    });

    call.metadata.isCallback = true;
    call.metadata.callbackId = callbackId;

    callback.status = 'attempted';

    return call;
  }

  async getScheduledCallbacks(filters?: {
    status?: ScheduledCallback['status'];
    agentId?: string;
    dateRange?: { start: Date; end: Date };
  }): Promise<ScheduledCallback[]> {
    let callbacks = Array.from(this.callbacks.values());

    if (filters?.status) {
      callbacks = callbacks.filter(c => c.status === filters.status);
    }

    if (filters?.agentId) {
      callbacks = callbacks.filter(c => c.assignedAgent === filters.agentId);
    }

    if (filters?.dateRange) {
      callbacks = callbacks.filter(c => 
        c.scheduledFor >= filters.dateRange!.start && 
        c.scheduledFor <= filters.dateRange!.end
      );
    }

    return callbacks.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  }

  // ==================== Reporting & Analytics ====================

  getCallStatistics(dateRange?: { start: Date; end: Date }): {
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;
    averageWaitTime: number;
    averageHandleTime: number;
    serviceLevelMet: number;
    byChannel: Record<ChannelType, number>;
    byCrisisType: Record<CrisisType, number>;
    byCrisisLevel: Record<CrisisLevel, number>;
    byDisposition: Record<DispositionCode, number>;
  } {
    let calls = Array.from(this.calls.values());

    if (dateRange) {
      calls = calls.filter(c => 
        c.timing.created >= dateRange.start && 
        c.timing.created <= dateRange.end
      );
    }

    const byChannel: Record<string, number> = {};
    const byCrisisType: Record<string, number> = {};
    const byCrisisLevel: Record<string, number> = {};
    const byDisposition: Record<string, number> = {};

    let totalWaitTime = 0;
    let totalHandleTime = 0;
    let answeredCount = 0;

    for (const call of calls) {
      byChannel[call.channel] = (byChannel[call.channel] || 0) + 1;
      byCrisisType[call.crisisType] = (byCrisisType[call.crisisType] || 0) + 1;
      byCrisisLevel[call.crisisLevel] = (byCrisisLevel[call.crisisLevel] || 0) + 1;

      if (call.disposition) {
        byDisposition[call.disposition.code] = (byDisposition[call.disposition.code] || 0) + 1;
      }

      if (call.timing.answered) {
        answeredCount++;
        totalWaitTime += this.calculateWaitTime(call);
        totalHandleTime += call.timing.totalDuration || 0;
      }
    }

    return {
      totalCalls: calls.length,
      answeredCalls: answeredCount,
      abandonedCalls: calls.filter(c => c.status === 'abandoned').length,
      averageWaitTime: answeredCount > 0 ? totalWaitTime / answeredCount : 0,
      averageHandleTime: answeredCount > 0 ? totalHandleTime / answeredCount : 0,
      serviceLevelMet: 80, // Would be calculated
      byChannel: byChannel as Record<ChannelType, number>,
      byCrisisType: byCrisisType as Record<CrisisType, number>,
      byCrisisLevel: byCrisisLevel as Record<CrisisLevel, number>,
      byDisposition: byDisposition as Record<DispositionCode, number>
    };
  }

  getAgentPerformance(agentId: string): AgentMetrics | null {
    const agent = this.agents.get(agentId);
    return agent?.metrics || null;
  }

  // ==================== Alerts Management ====================

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<SupervisorAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);

    alert.acknowledged = true;
    return alert;
  }

  getActiveAlerts(): SupervisorAlert[] {
    return Array.from(this.alerts.values())
      .filter(a => !a.acknowledged)
      .sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }

  // ==================== Subscriptions ====================

  subscribe(callback: (event: HotlineEvent) => void, eventTypes?: HotlineEventType[]): string {
    const id = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(id, { id, callback, eventTypes });
    return id;
  }

  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  private emitEvent(event: HotlineEvent): void {
    for (const subscription of this.subscriptions.values()) {
      if (!subscription.eventTypes || subscription.eventTypes.includes(event.type)) {
        try {
          subscription.callback(event);
        } catch (error) {
          console.error('Subscription callback error:', error);
        }
      }
    }
  }
}

export const crisisHotlineService = CrisisHotlineService.getInstance();
export default CrisisHotlineService;

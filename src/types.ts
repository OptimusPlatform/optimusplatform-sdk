export interface OptimusConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface KubernetesDeploymentConfig {
  name: string;
  image: string;
  replicas: number;
  port: number;
  env?: Record<string, string>;
  resources?: {
    cpu?: string;
    memory?: string;
  };
}

export interface KubernetesScaleConfig {
  name: string;
  replicas: number;
}

export interface KubernetesDeleteConfig {
  name: string;
}

export interface KubernetesStatusConfig {
  name: string;
}

export interface DeploymentStatus {
  name: string;
  replicas: number;
  readyReplicas: number;
  status: 'running' | 'pending' | 'failed';
  pods: Array<{
    name: string;
    status: string;
    restarts: number;
  }>;
}

export interface WorkflowStep {
  type: 'fetch' | 'ai' | 'deploy' | 'transform';
  source?: string;
  model?: string;
  config?: Record<string, unknown>;
}

export interface WorkflowConfig {
  name: string;
  steps: WorkflowStep[];
  schedule?: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  status: 'active' | 'paused' | 'failed';
  createdAt: string;
}

export interface AIRunConfig {
  model: string;
  input: {
    text?: string;
    data?: unknown;
  };
  parameters?: Record<string, unknown>;
}

export interface AIRunResult {
  id: string;
  model: string;
  output: unknown;
  usage: {
    tokens?: number;
    cost?: number;
  };
  createdAt: string;
}

export interface PlatformMetrics {
  api: {
    totalRequests: number;
    requestsPerSecond: number;
    averageLatency: number;
  };
  deployments: {
    total: number;
    healthy: number;
    unhealthy: number;
  };
  cluster: {
    cpu: {
      used: number;
      total: number;
      percentage: number;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  performance: {
    uptime: number;
    availability: number;
  };
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  config: Record<string, unknown>;
}

export interface IntegrationConfig {
  name: string;
  type: string;
  config: Record<string, unknown>;
}

export type EventType =
  | 'deployment.status'
  | 'deployment.created'
  | 'deployment.updated'
  | 'deployment.deleted'
  | 'workflow.progress'
  | 'workflow.started'
  | 'workflow.completed'
  | 'workflow.failed'
  | 'pod.logs'
  | 'pod.created'
  | 'pod.deleted'
  | 'metrics.update'
  | 'cluster.event'
  | 'custom';

export interface DeploymentEvent {
  type: 'deployment.status' | 'deployment.created' | 'deployment.updated' | 'deployment.deleted';
  timestamp: string;
  deployment: {
    name: string;
    namespace?: string;
    status: 'pending' | 'running' | 'failed' | 'completed';
    replicas: {
      desired: number;
      ready: number;
      available: number;
    };
    conditions?: Array<{
      type: string;
      status: string;
      reason?: string;
      message?: string;
    }>;
  };
}

export interface WorkflowProgressEvent {
  type: 'workflow.progress' | 'workflow.started' | 'workflow.completed' | 'workflow.failed';
  timestamp: string;
  workflow: {
    id: string;
    name: string;
    status: 'running' | 'completed' | 'failed' | 'paused';
    currentStep?: number;
    totalSteps: number;
    progress: number;
    step?: {
      index: number;
      type: string;
      status: 'pending' | 'running' | 'completed' | 'failed';
      message?: string;
      startedAt?: string;
      completedAt?: string;
    };
    error?: string;
  };
}

export interface PodLogEvent {
  type: 'pod.logs';
  timestamp: string;
  pod: {
    name: string;
    namespace?: string;
    container?: string;
  };
  log: {
    message: string;
    timestamp: string;
    stream?: 'stdout' | 'stderr';
  };
}

export interface MetricsEvent {
  type: 'metrics.update';
  timestamp: string;
  metrics: {
    cpu: {
      usage: number;
      total: number;
      percentage: number;
    };
    memory: {
      usage: number;
      total: number;
      percentage: number;
    };
    network?: {
      bytesIn: number;
      bytesOut: number;
    };
    requests?: {
      total: number;
      rps: number;
      latency: number;
    };
  };
}

export type EventHandler<T> = (event: T) => void | Promise<void>;

export interface EventSubscription {
  id: string;
  eventType: EventType;
  handler: EventHandler<unknown>;
  active: boolean;
  createdAt: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  unsubscribe: () => void;
}

export interface EventStreamConfig {
  endpoint?: string;
  transport?: 'websocket' | 'sse';
  reconnect?: boolean;
  reconnectInterval?: number;
  filters?: Record<string, unknown>;
}

export interface WebSocketConfig {
  url: string;
  subscriptionId: string;
  reconnect: boolean;
  reconnectInterval: number;
}

export interface SSEConfig {
  url: string;
  subscriptionId: string;
  reconnect: boolean;
  reconnectInterval: number;
}

export interface LogStreamConfig {
  podName: string;
  namespace?: string;
  container?: string;
  follow?: boolean;
  tailLines?: number;
  sinceSeconds?: number;
  timestamps?: boolean;
}

export interface StreamConnection {
  id: string;
  type: 'websocket' | 'sse';
  status: 'connecting' | 'connected' | 'error' | 'closed';
  subscriptionId: string;
  connection: WebSocket | EventSource;
  createdAt: string;
}

export interface BlueGreenDeploymentConfig {
  name: string;
  blueVersion: {
    image: string;
    replicas: number;
    env?: Record<string, string>;
    resources?: {
      cpu?: string;
      memory?: string;
    };
  };
  greenVersion: {
    image: string;
    replicas: number;
    env?: Record<string, string>;
    resources?: {
      cpu?: string;
      memory?: string;
    };
  };
  healthCheck?: {
    path: string;
    port: number;
    initialDelaySeconds?: number;
    periodSeconds?: number;
  };
  autoPromote?: boolean;
  autoPromoteDelay?: number;
}

export interface CanaryDeploymentConfig {
  name: string;
  baselineVersion: {
    image: string;
    replicas: number;
    env?: Record<string, string>;
    resources?: {
      cpu?: string;
      memory?: string;
    };
  };
  canaryVersion: {
    image: string;
    replicas: number;
    env?: Record<string, string>;
    resources?: {
      cpu?: string;
      memory?: string;
    };
  };
  trafficSplit: {
    baseline: number;
    canary: number;
  };
  steps?: Array<{
    weight: number;
    pause?: number;
  }>;
  analysis?: {
    metrics: Array<{
      name: string;
      threshold: number;
      query?: string;
    }>;
    interval: number;
    failureThreshold: number;
  };
  autoPromote?: boolean;
}

export interface DeploymentStrategy {
  id: string;
  name: string;
  type: 'blue-green' | 'canary' | 'rolling' | 'recreate';
  status: 'pending' | 'active' | 'promoting' | 'rolling-back' | 'completed' | 'failed';
  config: BlueGreenDeploymentConfig | CanaryDeploymentConfig;
  currentPhase?: string;
  activeVersion?: string;
  trafficSplit?: {
    [version: string]: number;
  };
  healthStatus?: {
    healthy: boolean;
    checks: Array<{
      name: string;
      status: 'passed' | 'failed';
      message?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeploymentStrategyStatus {
  id: string;
  name: string;
  type: string;
  status: string;
  currentPhase: string;
  activeVersion: string;
  versions: Array<{
    name: string;
    replicas: number;
    readyReplicas: number;
    trafficPercentage: number;
    image: string;
  }>;
  metrics?: {
    successRate: number;
    errorRate: number;
    latency: {
      p50: number;
      p95: number;
      p99: number;
    };
  };
  events: Array<{
    timestamp: string;
    type: string;
    message: string;
  }>;
}

export interface TrafficSplitConfig {
  splits: Array<{
    version: string;
    weight: number;
  }>;
}

export interface PromoteConfig {
  version?: string;
  immediate?: boolean;
}

export interface RollbackConfig {
  toVersion?: string;
  reason?: string;
}

export interface AutoscalingConfig {
  minReplicas: number;
  maxReplicas: number;
  metrics: Array<{
    type: 'cpu' | 'memory' | 'custom';
    target: number;
    name?: string;
  }>;
  behavior?: {
    scaleUp?: {
      stabilizationWindowSeconds?: number;
      policies?: Array<{
        type: 'pods' | 'percent';
        value: number;
        periodSeconds: number;
      }>;
    };
    scaleDown?: {
      stabilizationWindowSeconds?: number;
      policies?: Array<{
        type: 'pods' | 'percent';
        value: number;
        periodSeconds: number;
      }>;
    };
  };
}

export interface HPAConfig {
  name: string;
  deployment: string;
  namespace?: string;
  minReplicas: number;
  maxReplicas: number;
  targetCPUUtilization?: number;
  targetMemoryUtilization?: number;
  customMetrics?: Array<{
    name: string;
    target: number;
    query?: string;
  }>;
}

export interface VPAConfig {
  name: string;
  deployment: string;
  namespace?: string;
  updateMode: 'off' | 'initial' | 'recreate' | 'auto';
  resourcePolicy?: {
    containerPolicies: Array<{
      containerName: string;
      minAllowed?: {
        cpu?: string;
        memory?: string;
      };
      maxAllowed?: {
        cpu?: string;
        memory?: string;
      };
    }>;
  };
}

export interface AutoscalingPolicy {
  id: string;
  name: string;
  type: 'hpa' | 'vpa';
  deployment: string;
  namespace: string;
  config: HPAConfig | VPAConfig;
  status: 'active' | 'inactive' | 'error';
  currentMetrics?: Array<{
    name: string;
    current: number;
    target: number;
  }>;
  currentReplicas?: number;
  desiredReplicas?: number;
  recommendations?: {
    cpu?: string;
    memory?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ScalingEvent {
  id: string;
  timestamp: string;
  deployment: string;
  type: 'scale-up' | 'scale-down';
  oldReplicas: number;
  newReplicas: number;
  reason: string;
  metrics?: Array<{
    name: string;
    value: number;
    threshold: number;
  }>;
}

export interface ResourceQuotaConfig {
  namespace: string;
  hard: {
    cpu?: string;
    memory?: string;
    pods?: number;
    persistentVolumeClaims?: number;
    services?: number;
  };
  scopeSelector?: {
    matchExpressions: Array<{
      scopeName: string;
      operator: 'in' | 'notin' | 'exists' | 'doesnotexist';
      values?: string[];
    }>;
  };
}

export interface ResourceQuota {
  id: string;
  namespace: string;
  hard: {
    cpu?: string;
    memory?: string;
    pods?: number;
    persistentVolumeClaims?: number;
    services?: number;
  };
  used: {
    cpu?: string;
    memory?: string;
    pods?: number;
    persistentVolumeClaims?: number;
    services?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ResourceUsage {
  namespace?: string;
  cpu: {
    used: string;
    total: string;
    percentage: number;
  };
  memory: {
    used: string;
    total: string;
    percentage: number;
  };
  pods: {
    used: number;
    total: number;
  };
  storage?: {
    used: string;
    total: string;
    percentage: number;
  };
  byDeployment?: Array<{
    name: string;
    cpu: string;
    memory: string;
    pods: number;
  }>;
}

export interface CostEstimate {
  namespace?: string;
  timeRange: string;
  totalCost: number;
  breakdown: {
    compute: number;
    storage: number;
    network: number;
  };
  byDeployment: Array<{
    name: string;
    cost: number;
    cpu: number;
    memory: number;
    storage: number;
  }>;
  forecast?: {
    daily: number;
    monthly: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface SecretConfig {
  name: string;
  namespace?: string;
  type?: 'opaque' | 'tls' | 'docker-registry' | 'service-account-token';
  data: Record<string, string>;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
}

export interface Secret {
  id: string;
  name: string;
  namespace: string;
  type: string;
  keys: string[];
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  lastRotated?: string;
}

export interface SecretRotationConfig {
  strategy?: 'immediate' | 'graceful';
  gracePeriod?: number;
  notifyWebhook?: string;
}

export interface RBACPolicyConfig {
  name: string;
  namespace?: string;
  subjects: Array<{
    kind: 'user' | 'group' | 'serviceAccount';
    name: string;
    namespace?: string;
  }>;
  rules: Array<{
    apiGroups: string[];
    resources: string[];
    verbs: string[];
    resourceNames?: string[];
  }>;
}

export interface RBACPolicy {
  id: string;
  name: string;
  namespace?: string;
  subjects: Array<{
    kind: string;
    name: string;
    namespace?: string;
  }>;
  rules: Array<{
    apiGroups: string[];
    resources: string[];
    verbs: string[];
    resourceNames?: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface VulnerabilityScan {
  id: string;
  image: string;
  status: 'queued' | 'scanning' | 'completed' | 'failed';
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  totalVulnerabilities: number;
  scanDate: string;
  completedAt?: string;
}

export interface SecurityScanResult {
  id: string;
  image: string;
  vulnerabilities: Array<{
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    package: string;
    version: string;
    fixedVersion?: string;
    title: string;
    description: string;
    references?: string[];
  }>;
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  passed: boolean;
  scanDate: string;
}

export interface NetworkPolicyConfig {
  name: string;
  namespace?: string;
  podSelector: {
    matchLabels?: Record<string, string>;
    matchExpressions?: Array<{
      key: string;
      operator: 'in' | 'notin' | 'exists' | 'doesnotexist';
      values?: string[];
    }>;
  };
  policyTypes: Array<'ingress' | 'egress'>;
  ingress?: Array<{
    from?: Array<{
      podSelector?: {
        matchLabels?: Record<string, string>;
      };
      namespaceSelector?: {
        matchLabels?: Record<string, string>;
      };
      ipBlock?: {
        cidr: string;
        except?: string[];
      };
    }>;
    ports?: Array<{
      protocol?: 'tcp' | 'udp' | 'sctp';
      port?: number | string;
    }>;
  }>;
  egress?: Array<{
    to?: Array<{
      podSelector?: {
        matchLabels?: Record<string, string>;
      };
      namespaceSelector?: {
        matchLabels?: Record<string, string>;
      };
      ipBlock?: {
        cidr: string;
        except?: string[];
      };
    }>;
    ports?: Array<{
      protocol?: 'tcp' | 'udp' | 'sctp';
      port?: number | string;
    }>;
  }>;
}

export interface NetworkPolicy {
  id: string;
  name: string;
  namespace: string;
  podSelector: unknown;
  policyTypes: string[];
  ingress?: unknown[];
  egress?: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceReport {
  id: string;
  standard: 'SOC2' | 'HIPAA' | 'PCI-DSS' | 'ISO27001';
  status: 'generating' | 'completed' | 'failed';
  score: number;
  passed: boolean;
  findings: Array<{
    control: string;
    requirement: string;
    status: 'passed' | 'failed' | 'warning';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    remediation?: string;
  }>;
  summary: {
    totalControls: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  generatedAt: string;
  expiresAt?: string;
  reportUrl?: string;
}

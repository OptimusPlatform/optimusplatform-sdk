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

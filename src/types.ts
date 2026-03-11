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

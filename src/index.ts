export { Optimus } from './client';

export type {
  OptimusConfig,
  KubernetesDeploymentConfig,
  KubernetesScaleConfig,
  KubernetesDeleteConfig,
  KubernetesStatusConfig,
  DeploymentStatus,
  WorkflowStep,
  WorkflowConfig,
  Workflow,
  AIRunConfig,
  AIRunResult,
  PlatformMetrics,
  Integration,
  IntegrationConfig,
  EventType,
  EventHandler,
  EventSubscription,
  EventStreamConfig,
  DeploymentEvent,
  WorkflowProgressEvent,
  PodLogEvent,
  MetricsEvent,
  LogStreamConfig,
  SSEConfig,
  WebSocketConfig,
  StreamConnection,
} from './types';

export {
  OptimusError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  NetworkError,
} from './errors';

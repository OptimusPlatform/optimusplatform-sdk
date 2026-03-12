import { HttpClient } from './http/request';
import { KubernetesModule } from './modules/kubernetes';
import { WorkflowModule } from './modules/workflow';
import { AIModule } from './modules/ai';
import { MetricsModule } from './modules/metrics';
import { IntegrationsModule } from './modules/integrations';
import { EventStreamModule } from './modules/events';
import { DeploymentStrategiesModule } from './modules/deployment-strategies';
import { ResourceManagementModule } from './modules/resources';
import { SecurityModule } from './modules/security';
import type { OptimusConfig } from './types';

export class Optimus {
  public readonly kubernetes: KubernetesModule;
  public readonly workflow: WorkflowModule;
  public readonly ai: AIModule;
  public readonly metrics: MetricsModule;
  public readonly integrations: IntegrationsModule;
  public readonly events: EventStreamModule;
  public readonly deploymentStrategies: DeploymentStrategiesModule;
  public readonly resources: ResourceManagementModule;
  public readonly security: SecurityModule;

  private http: HttpClient;

  constructor(config: OptimusConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    this.http = new HttpClient(config);

    this.kubernetes = new KubernetesModule(this.http);
    this.workflow = new WorkflowModule(this.http);
    this.ai = new AIModule(this.http);
    this.metrics = new MetricsModule(this.http);
    this.integrations = new IntegrationsModule(this.http);
    this.events = new EventStreamModule(this.http);
    this.deploymentStrategies = new DeploymentStrategiesModule(this.http);
    this.resources = new ResourceManagementModule(this.http);
    this.security = new SecurityModule(this.http);
  }
}

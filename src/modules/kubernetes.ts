import type { HttpClient } from '../http/request';
import type {
  KubernetesDeploymentConfig,
  KubernetesScaleConfig,
  KubernetesDeleteConfig,
  KubernetesStatusConfig,
  DeploymentStatus,
} from '../types';

export class KubernetesModule {
  constructor(private http: HttpClient) {}

  async deploy(config: KubernetesDeploymentConfig): Promise<DeploymentStatus> {
    return this.http.request<DeploymentStatus>({
      method: 'POST',
      path: '/v1/kubernetes/deployments',
      body: config,
    });
  }

  async scale(config: KubernetesScaleConfig): Promise<DeploymentStatus> {
    return this.http.request<DeploymentStatus>({
      method: 'PATCH',
      path: `/v1/kubernetes/deployments/${config.name}/scale`,
      body: { replicas: config.replicas },
    });
  }

  async delete(config: KubernetesDeleteConfig): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path: `/v1/kubernetes/deployments/${config.name}`,
    });
  }

  async status(config: KubernetesStatusConfig): Promise<DeploymentStatus> {
    return this.http.request<DeploymentStatus>({
      method: 'GET',
      path: `/v1/kubernetes/deployments/${config.name}`,
    });
  }

  async list(): Promise<DeploymentStatus[]> {
    return this.http.request<DeploymentStatus[]>({
      method: 'GET',
      path: '/v1/kubernetes/deployments',
    });
  }

  async logs(config: {
    name: string;
    tail?: number;
  }): Promise<{ logs: string[] }> {
    const query = config.tail ? `?tail=${config.tail}` : '';
    return this.http.request<{ logs: string[] }>({
      method: 'GET',
      path: `/v1/kubernetes/deployments/${config.name}/logs${query}`,
    });
  }
}

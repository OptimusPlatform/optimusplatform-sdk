import type { HttpClient } from '../http/request';
import type {
  BlueGreenDeploymentConfig,
  CanaryDeploymentConfig,
  DeploymentStrategy,
  RollbackConfig,
  TrafficSplitConfig,
  DeploymentStrategyStatus,
  PromoteConfig,
} from '../types';

export class DeploymentStrategiesModule {
  constructor(private http: HttpClient) {}

  async createBlueGreen(config: BlueGreenDeploymentConfig): Promise<DeploymentStrategy> {
    return this.http.request<DeploymentStrategy>({
      method: 'POST',
      path: '/v1/deployment-strategies/blue-green',
      body: config,
    });
  }

  async createCanary(config: CanaryDeploymentConfig): Promise<DeploymentStrategy> {
    return this.http.request<DeploymentStrategy>({
      method: 'POST',
      path: '/v1/deployment-strategies/canary',
      body: config,
    });
  }

  async getStrategy(id: string): Promise<DeploymentStrategy> {
    return this.http.request<DeploymentStrategy>({
      method: 'GET',
      path: `/v1/deployment-strategies/${id}`,
    });
  }

  async listStrategies(filters?: { type?: string; status?: string }): Promise<DeploymentStrategy[]> {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.status) queryParams.append('status', filters.status);

    const path = `/v1/deployment-strategies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<DeploymentStrategy[]>({
      method: 'GET',
      path,
    });
  }

  async getStatus(id: string): Promise<DeploymentStrategyStatus> {
    return this.http.request<DeploymentStrategyStatus>({
      method: 'GET',
      path: `/v1/deployment-strategies/${id}/status`,
    });
  }

  async updateTrafficSplit(id: string, config: TrafficSplitConfig): Promise<DeploymentStrategy> {
    return this.http.request<DeploymentStrategy>({
      method: 'POST',
      path: `/v1/deployment-strategies/${id}/traffic`,
      body: config,
    });
  }

  async promote(id: string, config?: PromoteConfig): Promise<DeploymentStrategy> {
    return this.http.request<DeploymentStrategy>({
      method: 'POST',
      path: `/v1/deployment-strategies/${id}/promote`,
      body: config,
    });
  }

  async rollback(id: string, config?: RollbackConfig): Promise<DeploymentStrategy> {
    return this.http.request<DeploymentStrategy>({
      method: 'POST',
      path: `/v1/deployment-strategies/${id}/rollback`,
      body: config,
    });
  }

  async abort(id: string): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'POST',
      path: `/v1/deployment-strategies/${id}/abort`,
    });
  }

  async delete(id: string): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path: `/v1/deployment-strategies/${id}`,
    });
  }
}

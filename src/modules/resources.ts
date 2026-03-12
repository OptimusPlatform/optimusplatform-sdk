import type { HttpClient } from '../http/request';
import type {
  AutoscalingConfig,
  AutoscalingPolicy,
  ResourceQuota,
  ResourceQuotaConfig,
  ResourceUsage,
  ScalingEvent,
  HPAConfig,
  VPAConfig,
  CostEstimate,
} from '../types';

export class ResourceManagementModule {
  constructor(private http: HttpClient) {}

  async createHPA(config: HPAConfig): Promise<AutoscalingPolicy> {
    return this.http.request<AutoscalingPolicy>({
      method: 'POST',
      path: '/v1/autoscaling/hpa',
      body: config,
    });
  }

  async createVPA(config: VPAConfig): Promise<AutoscalingPolicy> {
    return this.http.request<AutoscalingPolicy>({
      method: 'POST',
      path: '/v1/autoscaling/vpa',
      body: config,
    });
  }

  async getAutoscalingPolicy(id: string): Promise<AutoscalingPolicy> {
    return this.http.request<AutoscalingPolicy>({
      method: 'GET',
      path: `/v1/autoscaling/${id}`,
    });
  }

  async listAutoscalingPolicies(filters?: { type?: string; deployment?: string }): Promise<AutoscalingPolicy[]> {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.deployment) queryParams.append('deployment', filters.deployment);

    const path = `/v1/autoscaling${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<AutoscalingPolicy[]>({
      method: 'GET',
      path,
    });
  }

  async updateAutoscalingPolicy(id: string, config: Partial<AutoscalingConfig>): Promise<AutoscalingPolicy> {
    return this.http.request<AutoscalingPolicy>({
      method: 'PATCH',
      path: `/v1/autoscaling/${id}`,
      body: config,
    });
  }

  async deleteAutoscalingPolicy(id: string): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path: `/v1/autoscaling/${id}`,
    });
  }

  async getScalingEvents(deploymentName: string, limit?: number): Promise<ScalingEvent[]> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());

    const path = `/v1/autoscaling/events/${deploymentName}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<ScalingEvent[]>({
      method: 'GET',
      path,
    });
  }

  async createResourceQuota(config: ResourceQuotaConfig): Promise<ResourceQuota> {
    return this.http.request<ResourceQuota>({
      method: 'POST',
      path: '/v1/resources/quotas',
      body: config,
    });
  }

  async getResourceQuota(namespace: string): Promise<ResourceQuota> {
    return this.http.request<ResourceQuota>({
      method: 'GET',
      path: `/v1/resources/quotas/${namespace}`,
    });
  }

  async listResourceQuotas(): Promise<ResourceQuota[]> {
    return this.http.request<ResourceQuota[]>({
      method: 'GET',
      path: '/v1/resources/quotas',
    });
  }

  async updateResourceQuota(namespace: string, config: Partial<ResourceQuotaConfig>): Promise<ResourceQuota> {
    return this.http.request<ResourceQuota>({
      method: 'PATCH',
      path: `/v1/resources/quotas/${namespace}`,
      body: config,
    });
  }

  async deleteResourceQuota(namespace: string): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path: `/v1/resources/quotas/${namespace}`,
    });
  }

  async getResourceUsage(namespace?: string): Promise<ResourceUsage> {
    const path = namespace ? `/v1/resources/usage/${namespace}` : '/v1/resources/usage';
    return this.http.request<ResourceUsage>({
      method: 'GET',
      path,
    });
  }

  async getCostEstimate(config: { namespace?: string; timeRange?: string }): Promise<CostEstimate> {
    const queryParams = new URLSearchParams();
    if (config.namespace) queryParams.append('namespace', config.namespace);
    if (config.timeRange) queryParams.append('timeRange', config.timeRange);

    const path = `/v1/resources/cost${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<CostEstimate>({
      method: 'GET',
      path,
    });
  }

  async getRecommendations(deploymentName: string): Promise<{
    deployment: string;
    recommendations: Array<{
      type: 'cpu' | 'memory' | 'replicas';
      current: string | number;
      recommended: string | number;
      reason: string;
      estimatedSavings?: number;
    }>;
  }> {
    return this.http.request({
      method: 'GET',
      path: `/v1/resources/recommendations/${deploymentName}`,
    });
  }
}

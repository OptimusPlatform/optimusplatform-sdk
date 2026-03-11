import type { HttpClient } from '../http/request';
import type { Integration, IntegrationConfig } from '../types';

export class IntegrationsModule {
  constructor(private http: HttpClient) {}

  async create(config: IntegrationConfig): Promise<Integration> {
    return this.http.request<Integration>({
      method: 'POST',
      path: '/v1/integrations',
      body: config,
    });
  }

  async get(id: string): Promise<Integration> {
    return this.http.request<Integration>({
      method: 'GET',
      path: `/v1/integrations/${id}`,
    });
  }

  async list(): Promise<Integration[]> {
    return this.http.request<Integration[]>({
      method: 'GET',
      path: '/v1/integrations',
    });
  }

  async update(
    id: string,
    config: Partial<IntegrationConfig>
  ): Promise<Integration> {
    return this.http.request<Integration>({
      method: 'PATCH',
      path: `/v1/integrations/${id}`,
      body: config,
    });
  }

  async delete(id: string): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path: `/v1/integrations/${id}`,
    });
  }

  async test(id: string): Promise<{ success: boolean; message?: string }> {
    return this.http.request<{ success: boolean; message?: string }>({
      method: 'POST',
      path: `/v1/integrations/${id}/test`,
    });
  }
}

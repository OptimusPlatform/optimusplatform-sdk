import type { HttpClient } from '../http/request';
import type { WorkflowConfig, Workflow } from '../types';

export class WorkflowModule {
  constructor(private http: HttpClient) {}

  async create(config: WorkflowConfig): Promise<Workflow> {
    return this.http.request<Workflow>({
      method: 'POST',
      path: '/v1/workflows',
      body: config,
    });
  }

  async get(id: string): Promise<Workflow> {
    return this.http.request<Workflow>({
      method: 'GET',
      path: `/v1/workflows/${id}`,
    });
  }

  async list(): Promise<Workflow[]> {
    return this.http.request<Workflow[]>({
      method: 'GET',
      path: '/v1/workflows',
    });
  }

  async delete(id: string): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path: `/v1/workflows/${id}`,
    });
  }

  async pause(id: string): Promise<Workflow> {
    return this.http.request<Workflow>({
      method: 'POST',
      path: `/v1/workflows/${id}/pause`,
    });
  }

  async resume(id: string): Promise<Workflow> {
    return this.http.request<Workflow>({
      method: 'POST',
      path: `/v1/workflows/${id}/resume`,
    });
  }

  async trigger(id: string, input?: unknown): Promise<{ executionId: string }> {
    return this.http.request<{ executionId: string }>({
      method: 'POST',
      path: `/v1/workflows/${id}/trigger`,
      body: input ? { input } : undefined,
    });
  }
}

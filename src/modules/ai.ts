import type { HttpClient } from '../http/request';
import type { AIRunConfig, AIRunResult } from '../types';

export class AIModule {
  constructor(private http: HttpClient) {}

  async run(config: AIRunConfig): Promise<AIRunResult> {
    return this.http.request<AIRunResult>({
      method: 'POST',
      path: '/v1/ai/run',
      body: config,
    });
  }

  async models(): Promise<Array<{ name: string; type: string; description: string }>> {
    return this.http.request<Array<{ name: string; type: string; description: string }>>({
      method: 'GET',
      path: '/v1/ai/models',
    });
  }

  async getResult(id: string): Promise<AIRunResult> {
    return this.http.request<AIRunResult>({
      method: 'GET',
      path: `/v1/ai/results/${id}`,
    });
  }

  async cancel(id: string): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'POST',
      path: `/v1/ai/results/${id}/cancel`,
    });
  }
}

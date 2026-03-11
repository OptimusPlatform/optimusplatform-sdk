import type { HttpClient } from '../http/request';
import type { PlatformMetrics } from '../types';

export class MetricsModule {
  constructor(private http: HttpClient) {}

  async get(): Promise<PlatformMetrics> {
    return this.http.request<PlatformMetrics>({
      method: 'GET',
      path: '/v1/metrics',
    });
  }

  async usage(timeRange?: '1h' | '24h' | '7d' | '30d'): Promise<{
    api: {
      requests: number;
      bandwidth: number;
    };
    compute: {
      cpuHours: number;
      memoryGbHours: number;
    };
    storage: {
      gb: number;
    };
  }> {
    const query = timeRange ? `?range=${timeRange}` : '';
    return this.http.request({
      method: 'GET',
      path: `/v1/metrics/usage${query}`,
    });
  }

  async deployment(name: string): Promise<{
    cpu: {
      current: number;
      average: number;
      max: number;
    };
    memory: {
      current: number;
      average: number;
      max: number;
    };
    requests: {
      total: number;
      successful: number;
      failed: number;
    };
  }> {
    return this.http.request({
      method: 'GET',
      path: `/v1/metrics/deployments/${name}`,
    });
  }
}

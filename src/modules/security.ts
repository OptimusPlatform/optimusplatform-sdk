import type { HttpClient } from '../http/request';
import type {
  Secret,
  SecretConfig,
  RBACPolicy,
  RBACPolicyConfig,
  SecurityScanResult,
  NetworkPolicy,
  NetworkPolicyConfig,
  ComplianceReport,
  VulnerabilityScan,
  SecretRotationConfig,
} from '../types';

export class SecurityModule {
  constructor(private http: HttpClient) {}

  async createSecret(config: SecretConfig): Promise<Secret> {
    return this.http.request<Secret>({
      method: 'POST',
      path: '/v1/security/secrets',
      body: config,
    });
  }

  async getSecret(name: string, namespace?: string): Promise<Secret> {
    const queryParams = new URLSearchParams();
    if (namespace) queryParams.append('namespace', namespace);

    const path = `/v1/security/secrets/${name}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<Secret>({
      method: 'GET',
      path,
    });
  }

  async listSecrets(namespace?: string): Promise<Secret[]> {
    const queryParams = new URLSearchParams();
    if (namespace) queryParams.append('namespace', namespace);

    const path = `/v1/security/secrets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<Secret[]>({
      method: 'GET',
      path,
    });
  }

  async updateSecret(name: string, config: Partial<SecretConfig>): Promise<Secret> {
    return this.http.request<Secret>({
      method: 'PATCH',
      path: `/v1/security/secrets/${name}`,
      body: config,
    });
  }

  async deleteSecret(name: string, namespace?: string): Promise<{ success: boolean }> {
    const queryParams = new URLSearchParams();
    if (namespace) queryParams.append('namespace', namespace);

    const path = `/v1/security/secrets/${name}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path,
    });
  }

  async rotateSecret(name: string, config?: SecretRotationConfig): Promise<Secret> {
    return this.http.request<Secret>({
      method: 'POST',
      path: `/v1/security/secrets/${name}/rotate`,
      body: config,
    });
  }

  async createRBACPolicy(config: RBACPolicyConfig): Promise<RBACPolicy> {
    return this.http.request<RBACPolicy>({
      method: 'POST',
      path: '/v1/security/rbac',
      body: config,
    });
  }

  async getRBACPolicy(id: string): Promise<RBACPolicy> {
    return this.http.request<RBACPolicy>({
      method: 'GET',
      path: `/v1/security/rbac/${id}`,
    });
  }

  async listRBACPolicies(namespace?: string): Promise<RBACPolicy[]> {
    const queryParams = new URLSearchParams();
    if (namespace) queryParams.append('namespace', namespace);

    const path = `/v1/security/rbac${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<RBACPolicy[]>({
      method: 'GET',
      path,
    });
  }

  async updateRBACPolicy(id: string, config: Partial<RBACPolicyConfig>): Promise<RBACPolicy> {
    return this.http.request<RBACPolicy>({
      method: 'PATCH',
      path: `/v1/security/rbac/${id}`,
      body: config,
    });
  }

  async deleteRBACPolicy(id: string): Promise<{ success: boolean }> {
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path: `/v1/security/rbac/${id}`,
    });
  }

  async scanImage(image: string): Promise<VulnerabilityScan> {
    return this.http.request<VulnerabilityScan>({
      method: 'POST',
      path: '/v1/security/scan',
      body: { image },
    });
  }

  async getScanResults(scanId: string): Promise<SecurityScanResult> {
    return this.http.request<SecurityScanResult>({
      method: 'GET',
      path: `/v1/security/scan/${scanId}`,
    });
  }

  async listScans(filters?: { image?: string; severity?: string }): Promise<VulnerabilityScan[]> {
    const queryParams = new URLSearchParams();
    if (filters?.image) queryParams.append('image', filters.image);
    if (filters?.severity) queryParams.append('severity', filters.severity);

    const path = `/v1/security/scan${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<VulnerabilityScan[]>({
      method: 'GET',
      path,
    });
  }

  async createNetworkPolicy(config: NetworkPolicyConfig): Promise<NetworkPolicy> {
    return this.http.request<NetworkPolicy>({
      method: 'POST',
      path: '/v1/security/network-policies',
      body: config,
    });
  }

  async getNetworkPolicy(name: string, namespace?: string): Promise<NetworkPolicy> {
    const queryParams = new URLSearchParams();
    if (namespace) queryParams.append('namespace', namespace);

    const path = `/v1/security/network-policies/${name}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<NetworkPolicy>({
      method: 'GET',
      path,
    });
  }

  async listNetworkPolicies(namespace?: string): Promise<NetworkPolicy[]> {
    const queryParams = new URLSearchParams();
    if (namespace) queryParams.append('namespace', namespace);

    const path = `/v1/security/network-policies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<NetworkPolicy[]>({
      method: 'GET',
      path,
    });
  }

  async deleteNetworkPolicy(name: string, namespace?: string): Promise<{ success: boolean }> {
    const queryParams = new URLSearchParams();
    if (namespace) queryParams.append('namespace', namespace);

    const path = `/v1/security/network-policies/${name}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.http.request<{ success: boolean }>({
      method: 'DELETE',
      path,
    });
  }

  async generateComplianceReport(standard: 'SOC2' | 'HIPAA' | 'PCI-DSS' | 'ISO27001'): Promise<ComplianceReport> {
    return this.http.request<ComplianceReport>({
      method: 'POST',
      path: '/v1/security/compliance/report',
      body: { standard },
    });
  }

  async getComplianceReport(reportId: string): Promise<ComplianceReport> {
    return this.http.request<ComplianceReport>({
      method: 'GET',
      path: `/v1/security/compliance/report/${reportId}`,
    });
  }

  async listComplianceReports(): Promise<ComplianceReport[]> {
    return this.http.request<ComplianceReport[]>({
      method: 'GET',
      path: '/v1/security/compliance/reports',
    });
  }

  async getSecurityPosture(): Promise<{
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    findings: Array<{
      severity: 'critical' | 'high' | 'medium' | 'low';
      category: string;
      description: string;
      recommendation: string;
    }>;
    summary: {
      totalFindings: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  }> {
    return this.http.request({
      method: 'GET',
      path: '/v1/security/posture',
    });
  }
}

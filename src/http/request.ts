import {
  OptimusError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  NetworkError,
} from '../errors';
import type { OptimusConfig, RequestOptions } from '../types';

export class HttpClient {
  private config: Required<OptimusConfig>;

  constructor(config: OptimusConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://api.optimusplt.xyz',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
    };
  }

  async request<T>(options: RequestOptions): Promise<T> {
    return this.retryRequest(options, 0);
  }

  private async retryRequest<T>(
    options: RequestOptions,
    attemptCount: number
  ): Promise<T> {
    try {
      return await this.executeRequest<T>(options);
    } catch (error) {
      if (this.shouldRetry(error, attemptCount)) {
        const delay = this.calculateBackoff(attemptCount);
        await this.sleep(delay);
        return this.retryRequest(options, attemptCount + 1);
      }
      throw error;
    }
  }

  private async executeRequest<T>(options: RequestOptions): Promise<T> {
    const url = `${this.config.baseUrl}${options.path}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return {} as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof OptimusError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout');
        }
        throw new NetworkError(error.message);
      }

      throw new NetworkError('Unknown error occurred');
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: { message?: string; code?: string } = {};

    try {
      const data = await response.json();
      errorData = data as { message?: string; code?: string };
    } catch {
      // Ignore JSON parse errors
    }

    const message = errorData.message || response.statusText || 'Request failed';

    switch (response.status) {
      case 401:
        throw new AuthenticationError(message);
      case 404:
        throw new NotFoundError(message);
      case 400:
        throw new ValidationError(message);
      case 429: {
        const retryAfter = response.headers.get('Retry-After');
        throw new RateLimitError(
          message,
          retryAfter ? parseInt(retryAfter, 10) : undefined
        );
      }
      default:
        throw new OptimusError(message, response.status, errorData.code);
    }
  }

  private shouldRetry(error: unknown, attemptCount: number): boolean {
    if (attemptCount >= this.config.maxRetries) {
      return false;
    }

    if (error instanceof RateLimitError) {
      return true;
    }

    if (error instanceof NetworkError) {
      return true;
    }

    if (error instanceof OptimusError) {
      const statusCode = error.statusCode;
      return statusCode ? statusCode >= 500 : false;
    }

    return false;
  }

  private calculateBackoff(attemptCount: number): number {
    return Math.min(1000 * Math.pow(2, attemptCount), 10000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

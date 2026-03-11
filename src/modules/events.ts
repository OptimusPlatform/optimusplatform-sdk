import { HttpClient } from '../http/request';
import type {
  EventStreamConfig,
  EventSubscription,
  EventHandler,
  DeploymentEvent,
  WorkflowProgressEvent,
  PodLogEvent,
  MetricsEvent,
  EventType,
  StreamConnection,
  SSEConfig,
  WebSocketConfig,
  LogStreamConfig,
} from '../types';

export class EventStreamModule {
  private http: HttpClient;
  private connections: Map<string, StreamConnection>;
  private subscriptions: Map<string, EventSubscription>;

  constructor(http: HttpClient) {
    this.http = http;
    this.connections = new Map();
    this.subscriptions = new Map();
  }

  public subscribeToDeployment(
    deploymentName: string,
    handler: EventHandler<DeploymentEvent>
  ): EventSubscription {
    const subscriptionId = this.generateId();
    const eventType: EventType = 'deployment.status';

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType,
      handler: handler as EventHandler<unknown>,
      active: true,
      createdAt: new Date().toISOString(),
      unsubscribe: () => this.unsubscribe(subscriptionId),
    };

    this.subscriptions.set(subscriptionId, subscription);

    this.connectWebSocket({
      url: this.buildWebSocketUrl(`/deployments/${deploymentName}/events`),
      subscriptionId,
      reconnect: true,
      reconnectInterval: 5000,
    });

    return subscription;
  }

  public subscribeToWorkflow(
    workflowId: string,
    handler: EventHandler<WorkflowProgressEvent>
  ): EventSubscription {
    const subscriptionId = this.generateId();
    const eventType: EventType = 'workflow.progress';

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType,
      handler: handler as EventHandler<unknown>,
      active: true,
      createdAt: new Date().toISOString(),
      unsubscribe: () => this.unsubscribe(subscriptionId),
    };

    this.subscriptions.set(subscriptionId, subscription);

    this.connectWebSocket({
      url: this.buildWebSocketUrl(`/workflows/${workflowId}/events`),
      subscriptionId,
      reconnect: true,
      reconnectInterval: 5000,
    });

    return subscription;
  }

  public streamPodLogs(
    config: LogStreamConfig,
    handler: EventHandler<PodLogEvent>
  ): EventSubscription {
    const subscriptionId = this.generateId();
    const eventType: EventType = 'pod.logs';

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType,
      handler: handler as EventHandler<unknown>,
      active: true,
      createdAt: new Date().toISOString(),
      unsubscribe: () => this.unsubscribe(subscriptionId),
    };

    this.subscriptions.set(subscriptionId, subscription);

    const queryParams = new URLSearchParams();
    if (config.follow) queryParams.append('follow', 'true');
    if (config.tailLines) queryParams.append('tailLines', config.tailLines.toString());
    if (config.sinceSeconds) queryParams.append('sinceSeconds', config.sinceSeconds.toString());
    if (config.timestamps) queryParams.append('timestamps', 'true');
    if (config.container) queryParams.append('container', config.container);

    const url = `/pods/${config.podName}/logs?${queryParams.toString()}`;

    this.connectWebSocket({
      url: this.buildWebSocketUrl(url),
      subscriptionId,
      reconnect: config.follow || false,
      reconnectInterval: 3000,
    });

    return subscription;
  }

  public streamMetrics(
    handler: EventHandler<MetricsEvent>,
    config?: SSEConfig
  ): EventSubscription {
    const subscriptionId = this.generateId();
    const eventType: EventType = 'metrics.update';

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType,
      handler: handler as EventHandler<unknown>,
      active: true,
      createdAt: new Date().toISOString(),
      unsubscribe: () => this.unsubscribe(subscriptionId),
    };

    this.subscriptions.set(subscriptionId, subscription);

    this.connectSSE({
      url: this.buildHttpUrl('/metrics/stream'),
      subscriptionId,
      reconnect: config?.reconnect ?? true,
      reconnectInterval: config?.reconnectInterval ?? 10000,
    });

    return subscription;
  }

  public subscribe<T = unknown>(
    eventType: EventType,
    handler: EventHandler<T>,
    config?: EventStreamConfig
  ): EventSubscription {
    const subscriptionId = this.generateId();

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType,
      handler: handler as EventHandler<unknown>,
      active: true,
      createdAt: new Date().toISOString(),
      unsubscribe: () => this.unsubscribe(subscriptionId),
    };

    this.subscriptions.set(subscriptionId, subscription);

    if (config?.transport === 'sse') {
      this.connectSSE({
        url: this.buildHttpUrl(config.endpoint || '/events'),
        subscriptionId,
        reconnect: config.reconnect ?? true,
        reconnectInterval: config.reconnectInterval ?? 5000,
      });
    } else {
      this.connectWebSocket({
        url: this.buildWebSocketUrl(config?.endpoint || '/events'),
        subscriptionId,
        reconnect: config?.reconnect ?? true,
        reconnectInterval: config?.reconnectInterval ?? 5000,
      });
    }

    return subscription;
  }

  private connectWebSocket(config: WebSocketConfig): void {
    if (typeof WebSocket === 'undefined') {
      throw new Error('WebSocket is not supported in this environment');
    }

    const ws = new WebSocket(config.url);
    const connectionId = this.generateId();

    const connection: StreamConnection = {
      id: connectionId,
      type: 'websocket',
      status: 'connecting',
      subscriptionId: config.subscriptionId,
      connection: ws,
      createdAt: new Date().toISOString(),
    };

    this.connections.set(connectionId, connection);

    ws.onopen = () => {
      connection.status = 'connected';
      const subscription = this.subscriptions.get(config.subscriptionId);
      if (subscription?.onConnect) {
        subscription.onConnect();
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const subscription = this.subscriptions.get(config.subscriptionId);
        if (subscription?.active) {
          subscription.handler(data);
        }
      } catch (error) {
        const subscription = this.subscriptions.get(config.subscriptionId);
        if (subscription?.onError) {
          subscription.onError(error as Error);
        }
      }
    };

    ws.onerror = () => {
      connection.status = 'error';
      const subscription = this.subscriptions.get(config.subscriptionId);
      if (subscription?.onError) {
        subscription.onError(new Error('WebSocket error occurred'));
      }
    };

    ws.onclose = () => {
      connection.status = 'closed';
      this.connections.delete(connectionId);

      const subscription = this.subscriptions.get(config.subscriptionId);
      if (subscription?.onDisconnect) {
        subscription.onDisconnect();
      }

      if (config.reconnect && subscription?.active) {
        setTimeout(() => {
          if (subscription.active) {
            this.connectWebSocket(config);
          }
        }, config.reconnectInterval);
      }
    };
  }

  private connectSSE(config: SSEConfig): void {
    if (typeof EventSource === 'undefined') {
      throw new Error('Server-Sent Events are not supported in this environment');
    }

    const eventSource = new EventSource(config.url);
    const connectionId = this.generateId();

    const connection: StreamConnection = {
      id: connectionId,
      type: 'sse',
      status: 'connecting',
      subscriptionId: config.subscriptionId,
      connection: eventSource,
      createdAt: new Date().toISOString(),
    };

    this.connections.set(connectionId, connection);

    eventSource.onopen = () => {
      connection.status = 'connected';
      const subscription = this.subscriptions.get(config.subscriptionId);
      if (subscription?.onConnect) {
        subscription.onConnect();
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const subscription = this.subscriptions.get(config.subscriptionId);
        if (subscription?.active) {
          subscription.handler(data);
        }
      } catch (error) {
        const subscription = this.subscriptions.get(config.subscriptionId);
        if (subscription?.onError) {
          subscription.onError(error as Error);
        }
      }
    };

    eventSource.onerror = () => {
      connection.status = 'error';
      eventSource.close();
      this.connections.delete(connectionId);

      const subscription = this.subscriptions.get(config.subscriptionId);
      if (subscription?.onDisconnect) {
        subscription.onDisconnect();
      }

      if (config.reconnect && subscription?.active) {
        setTimeout(() => {
          if (subscription.active) {
            this.connectSSE(config);
          }
        }, config.reconnectInterval);
      }
    };
  }

  private unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.active = false;
      this.subscriptions.delete(subscriptionId);
    }

    for (const [connectionId, connection] of this.connections.entries()) {
      if (connection.subscriptionId === subscriptionId) {
        if (connection.type === 'websocket' && connection.connection instanceof WebSocket) {
          connection.connection.close();
        } else if (connection.type === 'sse' && connection.connection instanceof EventSource) {
          connection.connection.close();
        }
        this.connections.delete(connectionId);
      }
    }
  }

  public unsubscribeAll(): void {
    for (const subscriptionId of this.subscriptions.keys()) {
      this.unsubscribe(subscriptionId);
    }
  }

  public getActiveSubscriptions(): EventSubscription[] {
    return Array.from(this.subscriptions.values()).filter((sub) => sub.active);
  }

  public getConnectionStatus(subscriptionId: string): string | null {
    for (const connection of this.connections.values()) {
      if (connection.subscriptionId === subscriptionId) {
        return connection.status;
      }
    }
    return null;
  }

  private buildWebSocketUrl(path: string): string {
    const baseUrl = this.http.getBaseUrl();
    const wsUrl = baseUrl.replace(/^http/, 'ws');
    return `${wsUrl}${path}`;
  }

  private buildHttpUrl(path: string): string {
    const baseUrl = this.http.getBaseUrl();
    return `${baseUrl}${path}`;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

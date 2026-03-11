const { Optimus } = require('@optimus-plt/sdk');

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY,
  baseUrl: 'https://api.optimusplt.xyz',
});

async function demonstrateRealtimeFeatures() {
  console.log('🚀 Optimus SDK - Real-time Event Streaming Demo\n');

  console.log('1️⃣  Subscribing to deployment status updates...');
  const deploymentSub = optimus.events.subscribeToDeployment(
    'web-app',
    (event) => {
      console.log('📦 Deployment Event:', {
        type: event.type,
        name: event.deployment.name,
        status: event.deployment.status,
        replicas: `${event.deployment.replicas.ready}/${event.deployment.replicas.desired}`,
        timestamp: new Date(event.timestamp).toLocaleTimeString(),
      });

      if (event.deployment.conditions) {
        event.deployment.conditions.forEach((condition) => {
          console.log(`   ├─ ${condition.type}: ${condition.status}`);
          if (condition.message) {
            console.log(`   │  └─ ${condition.message}`);
          }
        });
      }
    }
  );

  deploymentSub.onConnect = () => {
    console.log('✅ Connected to deployment stream\n');
  };

  deploymentSub.onError = (error) => {
    console.error('❌ Deployment stream error:', error.message);
  };

  deploymentSub.onDisconnect = () => {
    console.log('🔌 Disconnected from deployment stream');
  };

  console.log('2️⃣  Subscribing to workflow progress...');
  const workflowSub = optimus.events.subscribeToWorkflow(
    'data-pipeline-123',
    (event) => {
      console.log('⚙️  Workflow Event:', {
        type: event.type,
        workflow: event.workflow.name,
        status: event.workflow.status,
        progress: `${event.workflow.progress}%`,
        step: event.workflow.currentStep
          ? `${event.workflow.currentStep}/${event.workflow.totalSteps}`
          : 'N/A',
        timestamp: new Date(event.timestamp).toLocaleTimeString(),
      });

      if (event.workflow.step) {
        console.log(`   └─ Step ${event.workflow.step.index}: ${event.workflow.step.type}`);
        console.log(`      Status: ${event.workflow.step.status}`);
        if (event.workflow.step.message) {
          console.log(`      Message: ${event.workflow.step.message}`);
        }
      }

      if (event.workflow.error) {
        console.log(`   ⚠️  Error: ${event.workflow.error}`);
      }
    }
  );

  workflowSub.onConnect = () => {
    console.log('✅ Connected to workflow stream\n');
  };

  console.log('3️⃣  Streaming pod logs in real-time...');
  const logSub = optimus.events.streamPodLogs(
    {
      podName: 'web-app-7d9f8c6b5-xk2mz',
      follow: true,
      tailLines: 50,
      timestamps: true,
      container: 'main',
    },
    (event) => {
      const time = new Date(event.log.timestamp).toLocaleTimeString();
      const stream = event.log.stream === 'stderr' ? '⚠️ ' : '📝';
      console.log(`${stream} [${time}] ${event.pod.name}: ${event.log.message}`);
    }
  );

  logSub.onConnect = () => {
    console.log('✅ Connected to pod logs stream\n');
  };

  console.log('4️⃣  Streaming metrics via Server-Sent Events...');
  const metricsSub = optimus.events.streamMetrics(
    (event) => {
      console.log('📊 Metrics Update:', {
        timestamp: new Date(event.timestamp).toLocaleTimeString(),
        cpu: `${event.metrics.cpu.percentage.toFixed(2)}% (${event.metrics.cpu.usage}/${event.metrics.cpu.total})`,
        memory: `${event.metrics.memory.percentage.toFixed(2)}% (${event.metrics.memory.usage}GB/${event.metrics.memory.total}GB)`,
        requests: event.metrics.requests
          ? `${event.metrics.requests.rps} req/s, ${event.metrics.requests.latency}ms avg`
          : 'N/A',
      });
    },
    {
      reconnect: true,
      reconnectInterval: 5000,
    }
  );

  metricsSub.onConnect = () => {
    console.log('✅ Connected to metrics stream\n');
  };

  console.log('5️⃣  Using generic event subscription...');
  const customSub = optimus.events.subscribe(
    'cluster.event',
    (event) => {
      console.log('🔔 Cluster Event:', event);
    },
    {
      endpoint: '/cluster/events',
      transport: 'websocket',
      reconnect: true,
      reconnectInterval: 3000,
    }
  );

  console.log('\n📡 All event streams are now active!');
  console.log('💡 Connection statuses:');
  console.log(`   Deployment: ${optimus.events.getConnectionStatus(deploymentSub.id)}`);
  console.log(`   Workflow: ${optimus.events.getConnectionStatus(workflowSub.id)}`);
  console.log(`   Logs: ${optimus.events.getConnectionStatus(logSub.id)}`);
  console.log(`   Metrics: ${optimus.events.getConnectionStatus(metricsSub.id)}`);

  console.log('\n🎯 Active subscriptions:', optimus.events.getActiveSubscriptions().length);

  setTimeout(() => {
    console.log('\n🛑 Demonstrating individual unsubscribe...');
    customSub.unsubscribe();
    console.log('✅ Custom subscription unsubscribed');
    console.log('🎯 Remaining subscriptions:', optimus.events.getActiveSubscriptions().length);
  }, 30000);

  setTimeout(() => {
    console.log('\n🛑 Cleaning up all subscriptions...');
    optimus.events.unsubscribeAll();
    console.log('✅ All subscriptions closed');
    console.log('👋 Demo complete!');
    process.exit(0);
  }, 60000);

  process.on('SIGINT', () => {
    console.log('\n\n🛑 Received interrupt signal, cleaning up...');
    optimus.events.unsubscribeAll();
    console.log('✅ Cleanup complete');
    process.exit(0);
  });
}

async function demonstrateErrorHandling() {
  console.log('\n📚 Error Handling Examples\n');

  const sub = optimus.events.subscribeToDeployment('production-app', (event) => {
    console.log('Event received:', event);
  });

  sub.onError = (error) => {
    console.error('❌ Stream error occurred:', error.message);
    console.log('🔄 SDK will automatically attempt to reconnect...');
  };

  sub.onDisconnect = () => {
    console.log('🔌 Stream disconnected');
    console.log('⏳ Waiting for reconnection...');
  };

  sub.onConnect = () => {
    console.log('✅ Stream (re)connected successfully');
  };
}

async function demonstrateAdvancedLogStreaming() {
  console.log('\n📝 Advanced Log Streaming Examples\n');

  console.log('Example 1: Tail last 100 lines without following');
  const historicalLogs = optimus.events.streamPodLogs(
    {
      podName: 'api-server-abc123',
      follow: false,
      tailLines: 100,
      timestamps: true,
    },
    (event) => {
      console.log(`[${event.log.timestamp}] ${event.log.message}`);
    }
  );

  console.log('\nExample 2: Stream logs from last 5 minutes');
  const recentLogs = optimus.events.streamPodLogs(
    {
      podName: 'worker-def456',
      follow: true,
      sinceSeconds: 300,
      timestamps: true,
    },
    (event) => {
      console.log(event.log.message);
    }
  );

  console.log('\nExample 3: Stream specific container logs');
  const containerLogs = optimus.events.streamPodLogs(
    {
      podName: 'multi-container-pod',
      container: 'sidecar',
      follow: true,
      timestamps: false,
    },
    (event) => {
      if (event.log.stream === 'stderr') {
        console.error('ERROR:', event.log.message);
      } else {
        console.log('INFO:', event.log.message);
      }
    }
  );
}

if (require.main === module) {
  demonstrateRealtimeFeatures().catch(console.error);
}

module.exports = {
  demonstrateRealtimeFeatures,
  demonstrateErrorHandling,
  demonstrateAdvancedLogStreaming,
};

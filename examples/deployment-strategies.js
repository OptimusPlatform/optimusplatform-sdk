const { Optimus } = require('@optimus-plt/sdk');

const client = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY,
  baseUrl: 'https://api.optimus.dev',
});

async function blueGreenExample() {
  console.log('Creating blue-green deployment...');

  const deployment = await client.deploymentStrategies.createBlueGreen({
    name: 'my-app-blue-green',
    blueVersion: {
      image: 'myapp:v1.0.0',
      replicas: 3,
      env: {
        ENV: 'production',
        VERSION: 'v1.0.0',
      },
      resources: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    greenVersion: {
      image: 'myapp:v2.0.0',
      replicas: 3,
      env: {
        ENV: 'production',
        VERSION: 'v2.0.0',
      },
      resources: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    healthCheck: {
      path: '/health',
      port: 8080,
      initialDelaySeconds: 10,
      periodSeconds: 5,
    },
    autoPromote: false,
  });

  console.log('Blue-Green deployment created:', deployment.id);
  console.log('Active version:', deployment.activeVersion);

  await new Promise(resolve => setTimeout(resolve, 30000));

  const status = await client.deploymentStrategies.getStatus(deployment.id);
  console.log('Deployment status:', status);

  if (status.healthStatus?.healthy) {
    console.log('Health checks passed, promoting green version...');
    await client.deploymentStrategies.promote(deployment.id);
    console.log('Promotion complete!');
  } else {
    console.log('Health checks failed, rolling back...');
    await client.deploymentStrategies.rollback(deployment.id);
  }
}

async function canaryExample() {
  console.log('Creating canary deployment...');

  const deployment = await client.deploymentStrategies.createCanary({
    name: 'my-app-canary',
    baselineVersion: {
      image: 'myapp:v1.0.0',
      replicas: 10,
      resources: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    canaryVersion: {
      image: 'myapp:v2.0.0',
      replicas: 1,
      resources: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    trafficSplit: {
      baseline: 95,
      canary: 5,
    },
    steps: [
      { weight: 10, pause: 300 },
      { weight: 25, pause: 300 },
      { weight: 50, pause: 600 },
      { weight: 75, pause: 300 },
      { weight: 100, pause: 0 },
    ],
    analysis: {
      metrics: [
        {
          name: 'error-rate',
          threshold: 0.01,
        },
        {
          name: 'latency-p99',
          threshold: 500,
        },
      ],
      interval: 60,
      failureThreshold: 3,
    },
    autoPromote: true,
  });

  console.log('Canary deployment created:', deployment.id);

  const statusInterval = setInterval(async () => {
    const status = await client.deploymentStrategies.getStatus(deployment.id);
    console.log('Current phase:', status.currentPhase);
    console.log('Traffic split:', status.versions.map(v =>
      `${v.name}: ${v.trafficPercentage}%`
    ).join(', '));

    if (status.status === 'completed') {
      console.log('Canary deployment completed successfully!');
      clearInterval(statusInterval);
    } else if (status.status === 'failed') {
      console.log('Canary deployment failed, rolling back...');
      clearInterval(statusInterval);
    }
  }, 10000);
}

async function trafficSplitExample() {
  console.log('Updating traffic split...');

  await client.deploymentStrategies.updateTrafficSplit('deployment-id', {
    splits: [
      { version: 'v1', weight: 75 },
      { version: 'v2', weight: 25 },
    ],
  });

  console.log('Traffic split updated successfully');
}

async function listStrategies() {
  const strategies = await client.deploymentStrategies.listStrategies({
    type: 'canary',
    status: 'active',
  });

  console.log('Active canary deployments:', strategies.length);
  strategies.forEach(strategy => {
    console.log(`- ${strategy.name} (${strategy.status})`);
  });
}

async function main() {
  try {
    await blueGreenExample();
    await canaryExample();
    await trafficSplitExample();
    await listStrategies();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  blueGreenExample,
  canaryExample,
  trafficSplitExample,
  listStrategies,
};

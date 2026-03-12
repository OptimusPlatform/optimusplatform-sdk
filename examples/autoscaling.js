const { Optimus } = require('@optimus-plt/sdk');

const client = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY,
  baseUrl: 'https://api.optimus.dev',
});

async function hpaExample() {
  console.log('Creating Horizontal Pod Autoscaler...');

  const hpa = await client.resources.createHPA({
    name: 'my-app-hpa',
    deployment: 'my-app',
    namespace: 'production',
    minReplicas: 2,
    maxReplicas: 10,
    targetCPUUtilization: 70,
    targetMemoryUtilization: 80,
    customMetrics: [
      {
        name: 'http_requests_per_second',
        target: 1000,
      },
    ],
  });

  console.log('HPA created:', hpa.id);
  console.log('Current replicas:', hpa.currentReplicas);
  console.log('Desired replicas:', hpa.desiredReplicas);
}

async function vpaExample() {
  console.log('Creating Vertical Pod Autoscaler...');

  const vpa = await client.resources.createVPA({
    name: 'my-app-vpa',
    deployment: 'my-app',
    namespace: 'production',
    updateMode: 'auto',
    resourcePolicy: {
      containerPolicies: [
        {
          containerName: 'app',
          minAllowed: {
            cpu: '100m',
            memory: '128Mi',
          },
          maxAllowed: {
            cpu: '2000m',
            memory: '2Gi',
          },
        },
      ],
    },
  });

  console.log('VPA created:', vpa.id);
  console.log('Recommendations:', vpa.recommendations);
}

async function monitorScaling() {
  console.log('Monitoring scaling events...');

  const events = await client.resources.getScalingEvents('my-app', 10);

  events.forEach(event => {
    console.log(`[${event.timestamp}] ${event.type}:`);
    console.log(`  ${event.oldReplicas} → ${event.newReplicas} replicas`);
    console.log(`  Reason: ${event.reason}`);
    if (event.metrics) {
      event.metrics.forEach(metric => {
        console.log(`  ${metric.name}: ${metric.value} (threshold: ${metric.threshold})`);
      });
    }
  });
}

async function resourceQuotaExample() {
  console.log('Creating resource quota...');

  const quota = await client.resources.createResourceQuota({
    namespace: 'development',
    hard: {
      cpu: '10',
      memory: '20Gi',
      pods: 50,
      persistentVolumeClaims: 10,
      services: 20,
    },
  });

  console.log('Resource quota created for namespace:', quota.namespace);
  console.log('Hard limits:', quota.hard);
  console.log('Current usage:', quota.used);
}

async function getResourceUsage() {
  console.log('Fetching resource usage...');

  const usage = await client.resources.getResourceUsage('production');

  console.log('CPU Usage:', `${usage.cpu.percentage}% (${usage.cpu.used}/${usage.cpu.total})`);
  console.log('Memory Usage:', `${usage.memory.percentage}% (${usage.memory.used}/${usage.memory.total})`);
  console.log('Pods:', `${usage.pods.used}/${usage.pods.total}`);

  if (usage.byDeployment) {
    console.log('\nUsage by deployment:');
    usage.byDeployment.forEach(dep => {
      console.log(`  ${dep.name}: CPU ${dep.cpu}, Memory ${dep.memory}, Pods ${dep.pods}`);
    });
  }
}

async function costEstimateExample() {
  console.log('Generating cost estimate...');

  const estimate = await client.resources.getCostEstimate({
    namespace: 'production',
    timeRange: '7d',
  });

  console.log('Total cost (7 days):', `$${estimate.totalCost.toFixed(2)}`);
  console.log('Breakdown:');
  console.log('  Compute:', `$${estimate.breakdown.compute.toFixed(2)}`);
  console.log('  Storage:', `$${estimate.breakdown.storage.toFixed(2)}`);
  console.log('  Network:', `$${estimate.breakdown.network.toFixed(2)}`);

  if (estimate.forecast) {
    console.log('\nForecast:');
    console.log('  Daily:', `$${estimate.forecast.daily.toFixed(2)}`);
    console.log('  Monthly:', `$${estimate.forecast.monthly.toFixed(2)}`);
    console.log('  Trend:', estimate.forecast.trend);
  }

  console.log('\nTop 5 most expensive deployments:');
  estimate.byDeployment
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5)
    .forEach(dep => {
      console.log(`  ${dep.name}: $${dep.cost.toFixed(2)}`);
    });
}

async function getRecommendations() {
  console.log('Getting resource recommendations...');

  const recs = await client.resources.getRecommendations('my-app');

  console.log('Recommendations for:', recs.deployment);
  recs.recommendations.forEach(rec => {
    console.log(`\n${rec.type.toUpperCase()}:`);
    console.log(`  Current: ${rec.current}`);
    console.log(`  Recommended: ${rec.recommended}`);
    console.log(`  Reason: ${rec.reason}`);
    if (rec.estimatedSavings) {
      console.log(`  Est. savings: $${rec.estimatedSavings}/month`);
    }
  });
}

async function main() {
  try {
    await hpaExample();
    await vpaExample();
    await monitorScaling();
    await resourceQuotaExample();
    await getResourceUsage();
    await costEstimateExample();
    await getRecommendations();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  hpaExample,
  vpaExample,
  monitorScaling,
  resourceQuotaExample,
  getResourceUsage,
  costEstimateExample,
  getRecommendations,
};

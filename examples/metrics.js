const { Optimus } = require('@optimus-plt/sdk');

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY
});

async function metricsExample() {
  try {
    console.log('Getting platform metrics...');
    const metrics = await optimus.metrics.get();
    console.log('Platform metrics:', metrics);
    console.log('API requests:', metrics.api.totalRequests);
    console.log('Healthy deployments:', metrics.deployments.healthy);
    console.log('CPU usage:', metrics.cluster.cpu.percentage + '%');
    console.log('Uptime:', metrics.performance.uptime);

    console.log('\nGetting usage metrics (24h)...');
    const usage = await optimus.metrics.usage('24h');
    console.log('Usage metrics:', usage);
    console.log('API requests:', usage.api.requests);
    console.log('CPU hours:', usage.compute.cpuHours);
    console.log('Storage (GB):', usage.storage.gb);

    console.log('\nGetting deployment metrics...');
    const deploymentMetrics = await optimus.metrics.deployment('web-app');
    console.log('Deployment metrics:', deploymentMetrics);
    console.log('Current CPU:', deploymentMetrics.cpu.current);
    console.log('Average memory:', deploymentMetrics.memory.average);
    console.log('Total requests:', deploymentMetrics.requests.total);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

metricsExample();

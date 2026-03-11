const { Optimus } = require('@optimus-plt/sdk');

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY,
  timeout: 30000,
  maxRetries: 3
});

async function completeExample() {
  try {
    console.log('=== Optimus Platform SDK - Complete Example ===\n');

    console.log('1. Deploy application');
    const deployment = await optimus.kubernetes.deploy({
      name: 'my-app',
      image: 'node:20-alpine',
      replicas: 2,
      port: 8080,
      env: {
        NODE_ENV: 'production'
      }
    });
    console.log('✓ Deployed:', deployment.name);

    console.log('\n2. Create AI workflow');
    const workflow = await optimus.workflow.create({
      name: 'ml-pipeline',
      steps: [
        { type: 'fetch', source: 'postgres' },
        { type: 'ai', model: 'optimus-ml' },
        { type: 'deploy' }
      ]
    });
    console.log('✓ Workflow created:', workflow.id);

    console.log('\n3. Run AI model');
    const aiResult = await optimus.ai.run({
      model: 'optimus-ml',
      input: {
        text: 'predict customer churn based on usage patterns'
      }
    });
    console.log('✓ AI result:', aiResult.id);

    console.log('\n4. Create Slack integration');
    const integration = await optimus.integrations.create({
      name: 'slack-alerts',
      type: 'slack',
      config: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL,
        channel: '#ops'
      }
    });
    console.log('✓ Integration created:', integration.name);

    console.log('\n5. Get platform metrics');
    const metrics = await optimus.metrics.get();
    console.log('✓ Platform metrics:');
    console.log('  - API requests:', metrics.api.totalRequests);
    console.log('  - Deployments:', metrics.deployments.total);
    console.log('  - CPU usage:', metrics.cluster.cpu.percentage + '%');

    console.log('\n6. Scale deployment');
    await optimus.kubernetes.scale({
      name: 'my-app',
      replicas: 5
    });
    console.log('✓ Scaled to 5 replicas');

    console.log('\n7. Trigger workflow');
    const { executionId } = await optimus.workflow.trigger(workflow.id);
    console.log('✓ Workflow triggered:', executionId);

    console.log('\n=== All operations completed successfully ===');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
  }
}

completeExample();

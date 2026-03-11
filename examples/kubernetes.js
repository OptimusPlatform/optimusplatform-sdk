const { Optimus } = require('@optimus-plt/sdk');

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY
});

async function kubernetesExample() {
  try {
    console.log('Deploying application...');
    const deployment = await optimus.kubernetes.deploy({
      name: 'web-app',
      image: 'node:20',
      replicas: 3,
      port: 3000,
      env: {
        NODE_ENV: 'production',
        PORT: '3000'
      },
      resources: {
        cpu: '500m',
        memory: '512Mi'
      }
    });
    console.log('Deployment created:', deployment);

    console.log('\nGetting deployment status...');
    const status = await optimus.kubernetes.status({
      name: 'web-app'
    });
    console.log('Status:', status);

    console.log('\nListing all deployments...');
    const deployments = await optimus.kubernetes.list();
    console.log('Deployments:', deployments);

    console.log('\nScaling deployment...');
    await optimus.kubernetes.scale({
      name: 'web-app',
      replicas: 5
    });
    console.log('Scaled to 5 replicas');

    console.log('\nGetting logs...');
    const { logs } = await optimus.kubernetes.logs({
      name: 'web-app',
      tail: 50
    });
    console.log('Recent logs:', logs);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

kubernetesExample();

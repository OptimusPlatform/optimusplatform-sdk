const { Optimus } = require('@optimus-plt/sdk');

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY
});

async function integrationsExample() {
  try {
    console.log('Creating Slack integration...');
    const integration = await optimus.integrations.create({
      name: 'slack-notifications',
      type: 'slack',
      config: {
        webhookUrl: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL',
        channel: '#deployments'
      }
    });
    console.log('Integration created:', integration);

    console.log('\nListing all integrations...');
    const integrations = await optimus.integrations.list();
    console.log('Integrations:', integrations);

    console.log('\nTesting integration...');
    const { success, message } = await optimus.integrations.test(integration.id);
    console.log('Test result:', { success, message });

    console.log('\nUpdating integration...');
    await optimus.integrations.update(integration.id, {
      config: {
        channel: '#alerts'
      }
    });
    console.log('Integration updated');

    console.log('\nGetting integration details...');
    const details = await optimus.integrations.get(integration.id);
    console.log('Integration details:', details);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

integrationsExample();

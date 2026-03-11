const { Optimus } = require('@optimus-plt/sdk');

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY
});

async function workflowExample() {
  try {
    console.log('Creating workflow...');
    const workflow = await optimus.workflow.create({
      name: 'data-pipeline',
      steps: [
        { type: 'fetch', source: 'postgres' },
        { type: 'ai', model: 'optimus-ml' },
        { type: 'deploy' }
      ],
      schedule: '0 */6 * * *'
    });
    console.log('Workflow created:', workflow);

    console.log('\nListing workflows...');
    const workflows = await optimus.workflow.list();
    console.log('Workflows:', workflows);

    console.log('\nTriggering workflow...');
    const { executionId } = await optimus.workflow.trigger(workflow.id, {
      custom: 'data',
      source: 'manual'
    });
    console.log('Workflow triggered, execution ID:', executionId);

    console.log('\nGetting workflow details...');
    const details = await optimus.workflow.get(workflow.id);
    console.log('Workflow details:', details);

    console.log('\nPausing workflow...');
    await optimus.workflow.pause(workflow.id);
    console.log('Workflow paused');

    console.log('\nResuming workflow...');
    await optimus.workflow.resume(workflow.id);
    console.log('Workflow resumed');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

workflowExample();

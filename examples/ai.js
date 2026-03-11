const { Optimus } = require('@optimus-plt/sdk');

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY
});

async function aiExample() {
  try {
    console.log('Listing available AI models...');
    const models = await optimus.ai.models();
    console.log('Available models:', models);

    console.log('\nRunning AI model...');
    const result = await optimus.ai.run({
      model: 'optimus-ml',
      input: {
        text: 'analyze this data for patterns and anomalies',
        data: [1, 2, 3, 5, 8, 13, 21, 34]
      },
      parameters: {
        temperature: 0.7,
        maxTokens: 500
      }
    });
    console.log('AI result:', result);
    console.log('Output:', result.output);
    console.log('Usage:', result.usage);

    console.log('\nGetting result details...');
    const resultDetails = await optimus.ai.getResult(result.id);
    console.log('Result details:', resultDetails);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

aiExample();

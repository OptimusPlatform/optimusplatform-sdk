const {
  Optimus,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  NetworkError
} = require('@optimus-plt/sdk');

const optimus = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY
});

async function errorHandlingExample() {
  console.log('=== Error Handling Examples ===\n');

  console.log('1. Handling authentication errors');
  try {
    const invalidOptimus = new Optimus({ apiKey: 'invalid-key' });
    await invalidOptimus.kubernetes.list();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log('✓ Caught authentication error:', error.message);
    }
  }

  console.log('\n2. Handling not found errors');
  try {
    await optimus.kubernetes.status({ name: 'non-existent-app' });
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log('✓ Caught not found error:', error.message);
    }
  }

  console.log('\n3. Handling validation errors');
  try {
    await optimus.kubernetes.deploy({
      name: '',
      image: 'node:20'
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('✓ Caught validation error:', error.message);
    }
  }

  console.log('\n4. Handling rate limit errors');
  try {
    for (let i = 0; i < 100; i++) {
      await optimus.metrics.get();
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.log('✓ Caught rate limit error:', error.message);
      console.log('  Retry after:', error.retryAfter, 'seconds');
    }
  }

  console.log('\n5. Handling network errors');
  try {
    const customOptimus = new Optimus({
      apiKey: process.env.OPTIMUS_API_KEY,
      baseUrl: 'https://invalid-domain-that-does-not-exist.com',
      timeout: 5000
    });
    await customOptimus.kubernetes.list();
  } catch (error) {
    if (error instanceof NetworkError) {
      console.log('✓ Caught network error:', error.message);
    }
  }

  console.log('\n6. Generic error handling with retry logic');
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      await optimus.kubernetes.deploy({
        name: 'resilient-app',
        image: 'node:20',
        replicas: 1,
        port: 3000
      });
      console.log('✓ Deployment successful');
      break;
    } catch (error) {
      retries++;
      console.log(`Attempt ${retries} failed:`, error.message);

      if (retries >= maxRetries) {
        console.log('✗ Max retries reached');
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }

  console.log('\n=== Error handling examples completed ===');
}

errorHandlingExample();

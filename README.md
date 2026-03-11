# Optimus Platform SDK

  

![enter image description here](https://olive-chemical-haddock-701.mypinata.cloud/ipfs/bafybeifja2g6texqpcolvuj3a366kxmsamsvzv4v242qp3h2var7awfhmu)

  

<p  align="center">
<img  src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"  />
<img  src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"  />
<img  src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"  />
<img  src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"  />
<img  src="https://img.shields.io/badge/Edge_Runtime-000000?style=for-the-badge&logo=vercel&logoColor=white"  />
<img  src="https://img.shields.io/badge/OpenAI-AI-412991?style=for-the-badge&logo=openai&logoColor=white"  />
<img  src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"  />
</p>

  

Production-ready TypeScript SDK for the Optimus platform. Deploy applications, manage Kubernetes workloads, create workflows, run AI pipelines, and monitor deployments.

  

## Installation

  

```bash

npm  install  @optimus-plt/sdk

```

  

## Quick Start

  

```typescript

import { Optimus } from  '@optimus-plt/sdk';

  

const  optimus = new  Optimus({

apiKey:  process.env.OPTIMUS_API_KEY

});

```

  

## Features

  

-  **Kubernetes Management** - Deploy, scale, and manage containerized applications

-  **Workflow Orchestration** - Create and manage AI-native data pipelines

-  **AI Integration** - Run AI models and manage inference pipelines

-  **Real-time Metrics** - Monitor platform health and deployment performance

-  **Integrations** - Connect external services and APIs

-  **TypeScript First** - Full type safety and autocomplete support

-  **Auto Retry** - Built-in retry logic with exponential backoff

-  **Rate Limiting** - Automatic rate limit handling

  

## Kubernetes Module

  

### Deploy Application

  

```typescript

const  deployment = await  optimus.kubernetes.deploy({

name:  'web-app',

image:  'node:20',

replicas:  3,

port:  3000,

env: {

NODE_ENV:  'production'

},

resources: {

cpu:  '500m',

memory:  '512Mi'

}

});

```

  

### Scale Deployment

  

```typescript

await  optimus.kubernetes.scale({

name:  'web-app',

replicas:  10

});

```

  

### Get Deployment Status

  

```typescript

const  status = await  optimus.kubernetes.status({

name:  'web-app'

});

  

console.log(status.replicas);

console.log(status.readyReplicas);

console.log(status.pods);

```

  

### Delete Deployment

  

```typescript

await  optimus.kubernetes.delete({

name:  'web-app'

});

```

  

### List All Deployments

  

```typescript

const  deployments = await  optimus.kubernetes.list();

```

  

### Get Logs

  

```typescript

const { logs } = await  optimus.kubernetes.logs({

name:  'web-app',

tail:  100

});

```

  

## Workflow Module

  

### Create Workflow

  

```typescript

const  workflow = await  optimus.workflow.create({

name:  'data-pipeline',

steps: [

{ type:  'fetch', source:  'postgres' },

{ type:  'ai', model:  'optimus-ml' },

{ type:  'deploy' }

],

schedule:  '0 */6 * * *'

});

```

  

### Get Workflow

  

```typescript

const  workflow = await  optimus.workflow.get('workflow-id');

```

  

### List Workflows

  

```typescript

const  workflows = await  optimus.workflow.list();

```

  

### Trigger Workflow

  

```typescript

const { executionId } = await  optimus.workflow.trigger('workflow-id', {

custom:  'data'

});

```

  

### Pause/Resume Workflow

  

```typescript

await  optimus.workflow.pause('workflow-id');

await  optimus.workflow.resume('workflow-id');

```

  

### Delete Workflow

  

```typescript

await  optimus.workflow.delete('workflow-id');

```

  

## AI Module

  

### Run AI Model

  

```typescript

const  result = await  optimus.ai.run({

model:  'optimus-ml',

input: {

text:  'analyze this data'

},

parameters: {

temperature:  0.7

}

});

  

console.log(result.output);

console.log(result.usage);

```

  

### List Available Models

  

```typescript

const  models = await  optimus.ai.models();

```

  

### Get AI Result

  

```typescript

const  result = await  optimus.ai.getResult('result-id');

```

  

### Cancel AI Job

  

```typescript

await  optimus.ai.cancel('result-id');

```

  

## Metrics Module

  

### Get Platform Metrics

  

```typescript

const  metrics = await  optimus.metrics.get();

  

console.log(metrics.api.totalRequests);

console.log(metrics.deployments.healthy);

console.log(metrics.cluster.cpu.percentage);

console.log(metrics.performance.uptime);

```

  

### Get Usage Metrics

  

```typescript

const  usage = await  optimus.metrics.usage('24h');

  

console.log(usage.api.requests);

console.log(usage.compute.cpuHours);

console.log(usage.storage.gb);

```

  

### Get Deployment Metrics

  

```typescript

const  metrics = await  optimus.metrics.deployment('web-app');

  

console.log(metrics.cpu.current);

console.log(metrics.memory.average);

console.log(metrics.requests.total);

```

  

## Integrations Module

  

### Create Integration

  

```typescript

const  integration = await  optimus.integrations.create({

name:  'slack-notifications',

type:  'slack',

config: {

webhookUrl:  'https://hooks.slack.com/...',

channel:  '#deployments'

}

});

```

  

### List Integrations

  

```typescript

const  integrations = await  optimus.integrations.list();

```

  

### Update Integration

  

```typescript

await  optimus.integrations.update('integration-id', {

config: {

channel:  '#alerts'

}

});

```

  

### Test Integration

  

```typescript

const { success, message } = await  optimus.integrations.test('integration-id');

```

  

### Delete Integration

  

```typescript

await  optimus.integrations.delete('integration-id');

```

  

## Configuration

  

### Custom Base URL

  

```typescript

const  optimus = new  Optimus({

apiKey:  process.env.OPTIMUS_API_KEY,

baseUrl:  'https://custom.optimusplt.xyz'

});

```

  

### Custom Timeout

  

```typescript

const  optimus = new  Optimus({

apiKey:  process.env.OPTIMUS_API_KEY,

timeout:  60000  // 60 seconds

});

```

  

### Custom Max Retries

  

```typescript

const  optimus = new  Optimus({

apiKey:  process.env.OPTIMUS_API_KEY,

maxRetries:  5

});

```

  

## Error Handling

  

The SDK provides typed error classes for better error handling:

  

```typescript

import {

OptimusError,

AuthenticationError,

RateLimitError,

ValidationError,

NotFoundError,

NetworkError

} from  '@optimus-plt/sdk';

  

try {

await  optimus.kubernetes.deploy({...});

} catch (error) {

if (error  instanceof  AuthenticationError) {

console.error('Invalid API key');

} else  if (error  instanceof  RateLimitError) {

console.error('Rate limit exceeded, retry after:', error.retryAfter);

} else  if (error  instanceof  ValidationError) {

console.error('Invalid input:', error.message);

} else  if (error  instanceof  NotFoundError) {

console.error('Resource not found:', error.message);

} else  if (error  instanceof  NetworkError) {

console.error('Network error:', error.message);

}

}

```

  

## TypeScript Support

  

Full TypeScript support with comprehensive type definitions:

  

```typescript

import  type {

DeploymentStatus,

Workflow,

AIRunResult,

PlatformMetrics

} from  '@optimus-plt/sdk';

  

const  status: DeploymentStatus = await  optimus.kubernetes.status({

name:  'web-app'

});

```

  

## Runtime Support

  

The SDK works across multiple JavaScript runtimes:

  

- Node.js 16+

- Bun

- Deno

- Edge Runtime (Cloudflare Workers, Vercel Edge)

  

## License

  

MIT
const { Optimus } = require('@optimus-plt/sdk');

const client = new Optimus({
  apiKey: process.env.OPTIMUS_API_KEY,
  baseUrl: 'https://api.optimus.dev',
});

async function secretManagementExample() {
  console.log('Creating secret...');

  const secret = await client.security.createSecret({
    name: 'database-credentials',
    namespace: 'production',
    type: 'opaque',
    data: {
      username: Buffer.from('admin').toString('base64'),
      password: Buffer.from('super-secret-password').toString('base64'),
      host: Buffer.from('db.example.com').toString('base64'),
    },
    labels: {
      app: 'my-app',
      environment: 'production',
    },
  });

  console.log('Secret created:', secret.id);
  console.log('Keys:', secret.keys);

  console.log('\nRotating secret...');
  const rotated = await client.security.rotateSecret('database-credentials', {
    strategy: 'graceful',
    gracePeriod: 300,
  });

  console.log('Secret rotated successfully');
  console.log('Last rotated:', rotated.lastRotated);
}

async function rbacExample() {
  console.log('Creating RBAC policy...');

  const policy = await client.security.createRBACPolicy({
    name: 'developer-access',
    namespace: 'development',
    subjects: [
      {
        kind: 'group',
        name: 'developers',
      },
    ],
    rules: [
      {
        apiGroups: ['', 'apps'],
        resources: ['deployments', 'pods', 'services'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch'],
      },
      {
        apiGroups: [''],
        resources: ['secrets'],
        verbs: ['get', 'list'],
        resourceNames: ['app-config'],
      },
    ],
  });

  console.log('RBAC policy created:', policy.id);
  console.log('Subjects:', policy.subjects);
  console.log('Rules:', policy.rules.length);
}

async function vulnerabilityScanExample() {
  console.log('Scanning container image...');

  const scan = await client.security.scanImage('myapp:latest');

  console.log('Scan initiated:', scan.id);
  console.log('Status:', scan.status);

  await new Promise(resolve => setTimeout(resolve, 5000));

  const results = await client.security.getScanResults(scan.id);

  console.log('\nScan Results:');
  console.log('Total vulnerabilities:', results.summary.total);
  console.log('Critical:', results.summary.critical);
  console.log('High:', results.summary.high);
  console.log('Medium:', results.summary.medium);
  console.log('Low:', results.summary.low);
  console.log('Passed:', results.passed);

  if (results.vulnerabilities.length > 0) {
    console.log('\nTop 5 vulnerabilities:');
    results.vulnerabilities
      .slice(0, 5)
      .forEach(vuln => {
        console.log(`\n[${vuln.severity.toUpperCase()}] ${vuln.id}`);
        console.log(`  Package: ${vuln.package}@${vuln.version}`);
        console.log(`  Title: ${vuln.title}`);
        if (vuln.fixedVersion) {
          console.log(`  Fixed in: ${vuln.fixedVersion}`);
        }
      });
  }
}

async function networkPolicyExample() {
  console.log('Creating network policy...');

  const policy = await client.security.createNetworkPolicy({
    name: 'allow-frontend-to-backend',
    namespace: 'production',
    podSelector: {
      matchLabels: {
        app: 'backend',
      },
    },
    policyTypes: ['ingress'],
    ingress: [
      {
        from: [
          {
            podSelector: {
              matchLabels: {
                app: 'frontend',
              },
            },
          },
        ],
        ports: [
          {
            protocol: 'tcp',
            port: 8080,
          },
        ],
      },
    ],
  });

  console.log('Network policy created:', policy.id);
  console.log('Name:', policy.name);
}

async function complianceReportExample() {
  console.log('Generating compliance report...');

  const report = await client.security.generateComplianceReport('SOC2');

  console.log('Report ID:', report.id);
  console.log('Standard:', report.standard);
  console.log('Status:', report.status);

  await new Promise(resolve => setTimeout(resolve, 10000));

  const completedReport = await client.security.getComplianceReport(report.id);

  console.log('\nCompliance Report Results:');
  console.log('Score:', completedReport.score);
  console.log('Passed:', completedReport.passed);
  console.log('\nSummary:');
  console.log('  Total controls:', completedReport.summary.totalControls);
  console.log('  Passed:', completedReport.summary.passed);
  console.log('  Failed:', completedReport.summary.failed);
  console.log('  Warnings:', completedReport.summary.warnings);

  const failedFindings = completedReport.findings.filter(f => f.status === 'failed');
  if (failedFindings.length > 0) {
    console.log('\nFailed Controls:');
    failedFindings.forEach(finding => {
      console.log(`\n[${finding.severity.toUpperCase()}] ${finding.control}`);
      console.log(`  Requirement: ${finding.requirement}`);
      console.log(`  Description: ${finding.description}`);
      if (finding.remediation) {
        console.log(`  Remediation: ${finding.remediation}`);
      }
    });
  }

  if (completedReport.reportUrl) {
    console.log('\nFull report available at:', completedReport.reportUrl);
  }
}

async function securityPostureExample() {
  console.log('Analyzing security posture...');

  const posture = await client.security.getSecurityPosture();

  console.log('Security Score:', posture.score);
  console.log('Grade:', posture.grade);
  console.log('\nFindings Summary:');
  console.log('  Total:', posture.summary.totalFindings);
  console.log('  Critical:', posture.summary.critical);
  console.log('  High:', posture.summary.high);
  console.log('  Medium:', posture.summary.medium);
  console.log('  Low:', posture.summary.low);

  const criticalFindings = posture.findings.filter(f => f.severity === 'critical');
  if (criticalFindings.length > 0) {
    console.log('\nCritical Findings:');
    criticalFindings.forEach(finding => {
      console.log(`\n[${finding.category}]`);
      console.log(`  ${finding.description}`);
      console.log(`  Recommendation: ${finding.recommendation}`);
    });
  }
}

async function listAllSecrets() {
  const secrets = await client.security.listSecrets('production');
  console.log(`Found ${secrets.length} secrets in production namespace`);
  secrets.forEach(secret => {
    console.log(`  - ${secret.name} (${secret.keys.length} keys)`);
  });
}

async function scanMultipleImages() {
  const images = ['myapp:v1.0.0', 'myapp:v2.0.0', 'myapp:latest'];

  console.log('Scanning multiple images...');

  const scans = await Promise.all(
    images.map(image => client.security.scanImage(image))
  );

  await new Promise(resolve => setTimeout(resolve, 10000));

  const results = await Promise.all(
    scans.map(scan => client.security.getScanResults(scan.id))
  );

  console.log('\nComparison:');
  results.forEach((result, i) => {
    console.log(`\n${images[i]}:`);
    console.log(`  Total: ${result.summary.total}`);
    console.log(`  Critical: ${result.summary.critical}`);
    console.log(`  High: ${result.summary.high}`);
    console.log(`  Passed: ${result.passed}`);
  });
}

async function main() {
  try {
    await secretManagementExample();
    await rbacExample();
    await vulnerabilityScanExample();
    await networkPolicyExample();
    await complianceReportExample();
    await securityPostureExample();
    await listAllSecrets();
    await scanMultipleImages();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  secretManagementExample,
  rbacExample,
  vulnerabilityScanExample,
  networkPolicyExample,
  complianceReportExample,
  securityPostureExample,
  listAllSecrets,
  scanMultipleImages,
};

'use client';

import ExampleApiUsage from '../../components/ExampleApiUsage';

export default function ApiTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Backend-Frontend Connection Test</h1>
      <ExampleApiUsage />
    </div>
  );
}

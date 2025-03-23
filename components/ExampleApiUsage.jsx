'use client';

import { useState, useEffect } from 'react';
import { useGet, usePost } from '../hooks/useApi';

export default function ExampleApiUsage() {
  // For GET requests
  const { data: healthData, loading: healthLoading, error: healthError, refetch: refreshHealth } = useGet('/health');
  
  // For POST/PUT/DELETE requests
  const { data: postResult, loading: postLoading, error: postError, post } = usePost();
  
  // Local state for form
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Example endpoint - replace with your actual endpoint
    await post('reviews/submit', formData);
  };
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      {/* Health check section */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Backend Health Check:</h3>
        {healthLoading ? (
          <p>Loading...</p>
        ) : healthError ? (
          <div className="text-red-500">
            <p>Error connecting to backend: {healthError}</p>
            <p className="text-sm mt-1">
              Make sure your backend server is running on http://localhost:3000
            </p>
          </div>
        ) : healthData ? (
          <div className="text-green-500">
            <p>✅ Successfully connected to backend!</p>
            <p className="text-sm mt-1">Status: {healthData.status}</p>
            <p className="text-sm">Time: {healthData.timestamp}</p>
          </div>
        ) : (
          <p>Click the button below to check connection</p>
        )}
        <button 
          onClick={refreshHealth} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={healthLoading}
        >
          {healthLoading ? 'Checking...' : 'Check Connection'}
        </button>
      </div>
      
      {/* Example form submission */}
      <div>
        <h3 className="font-medium mb-2">Test API Submission:</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={postLoading}
          >
            {postLoading ? 'Submitting...' : 'Submit Form'}
          </button>
        </form>
        
        {postError && (
          <p className="mt-2 text-red-500">Error: {postError}</p>
        )}
        
        {postResult && (
          <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
            <p className="text-green-700">Form submitted successfully!</p>
            <pre className="mt-1 text-xs">{JSON.stringify(postResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

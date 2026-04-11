"use client";
import React, { useEffect, useState } from 'react';
import Loader from '@/components/Common/Loader';
import { getWritingSamples } from '@/lib/contentful';

const TestPage = () => {
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        setLoading(true);
        const data = await getWritingSamples();
        console.log('Fetched samples:', data);
        setSamples(data);
      } catch (err) {
        setError('Failed to load writing samples');
        console.error('Error fetching samples:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Loading writing sample..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Contentful Test</h1>
      
      <div className="mb-4">
        <p className="text-lg">Samples found: {samples.length}</p>
      </div>

      {samples.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Sample Data:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(samples[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestPage;

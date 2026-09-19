import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <LoadingSpinner label="Loading Admin Console & Live Database..." />
    </div>
  );
}

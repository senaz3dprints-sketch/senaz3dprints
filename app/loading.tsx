import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <LoadingSpinner label="Loading SenAZ 3D PRINTS..." size="lg" />
    </div>
  );
}

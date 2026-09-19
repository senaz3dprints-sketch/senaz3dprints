import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <LoadingSpinner label="Loading Product Specs, Filament Colors & 3D Render..." size="fullscreen" />
    </div>
  );
}

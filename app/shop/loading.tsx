import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ShopLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <LoadingSpinner label="Fabricating Catalog & Loading 3D Models..." size="fullscreen" />
    </div>
  );
}

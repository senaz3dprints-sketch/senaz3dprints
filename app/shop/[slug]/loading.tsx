import React from 'react';
import { Layers } from 'lucide-react';

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-12 bg-tech-card rounded" />
        <div className="h-3 w-3 bg-tech-card rounded" />
        <div className="h-3 w-12 bg-tech-card rounded" />
        <div className="h-3 w-3 bg-tech-card rounded" />
        <div className="h-3 w-32 bg-tech-card rounded" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Skeleton */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full bg-tech-card rounded-2xl border border-tech-border flex items-center justify-center">
            <Layers className="w-12 h-12 text-slate-700 animate-pulse" />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-20 rounded-xl bg-tech-card border border-tech-border" />
            ))}
          </div>
        </div>

        {/* Right Column: Details Skeleton */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="h-3 w-28 bg-tech-card rounded" />
            <div className="h-8 w-4/5 bg-tech-card rounded-lg" />
            <div className="h-7 w-32 bg-tech-card rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-3.5 w-full bg-tech-card rounded" />
            <div className="h-3.5 w-full bg-tech-card rounded" />
            <div className="h-3.5 w-3/4 bg-tech-card rounded" />
          </div>

          <div className="h-28 w-full bg-tech-card/70 rounded-xl border border-tech-border" />
          <div className="h-16 w-full bg-tech-card/70 rounded-xl border border-tech-border" />

          <div className="flex gap-4 pt-4">
            <div className="h-12 flex-1 bg-tech-card rounded-xl" />
            <div className="h-12 flex-1 bg-tech-card rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

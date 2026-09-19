import React from 'react';
import { Layers } from 'lucide-react';

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-tech-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-tech-card rounded" />
          <div className="h-8 w-64 bg-tech-card rounded-lg" />
          <div className="h-3 w-36 bg-tech-card/60 rounded" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-9 w-28 bg-tech-card rounded-lg" />
          <div className="h-9 w-36 bg-tech-card rounded-lg" />
        </div>
      </div>

      {/* Category Pills Skeleton */}
      <div className="flex flex-wrap items-center gap-2 border-b border-tech-border/60 pb-4">
        {[80, 95, 120, 75, 110, 100].map((w, i) => (
          <div key={i} className="h-8 bg-tech-card rounded-lg" style={{ width: `${w}px` }} />
        ))}
      </div>

      {/* Search Input Skeleton */}
      <div className="h-9 max-w-md bg-tech-card rounded-xl border border-tech-border" />

      {/* Product Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-tech-card rounded-xl border border-tech-border overflow-hidden flex flex-col"
          >
            {/* Image Placeholder */}
            <div className="aspect-square w-full bg-tech-bg/90 relative flex items-center justify-center">
              <Layers className="w-8 h-8 text-slate-700 animate-pulse" />
            </div>

            {/* Info Placeholder */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-2.5 w-20 bg-slate-800 rounded" />
                <div className="h-4 w-3/4 bg-slate-700 rounded" />
                <div className="h-3 w-full bg-slate-800 rounded" />
                <div className="h-3 w-2/3 bg-slate-800 rounded" />
              </div>

              <div className="pt-3 border-t border-tech-border/60 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-2.5 w-16 bg-slate-800 rounded" />
                  <div className="h-5 w-14 bg-slate-700 rounded" />
                </div>
                <div className="h-8 w-16 bg-slate-800 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
  label = 'Loading 3D Models & Specs...',
  size = 'md',
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      {/* 3D Layer Printing Animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-14 h-14 rounded-2xl border-2 border-tech-accent/30 animate-spin border-t-tech-accent shadow-lg shadow-tech-accent/20" />
        
        {/* Inner concentric layer */}
        <div className="absolute w-8 h-8 rounded-xl border-2 border-slate-700 animate-ping opacity-30" />
        
        {/* Center Icon */}
        <div className="absolute flex items-center justify-center">
          <Layers className="w-5 h-5 text-tech-accent animate-pulse" />
        </div>
      </div>

      {/* Label and high-tech indicator */}
      <div className="space-y-1">
        <p className="text-xs font-mono text-slate-200 tracking-wide font-medium">
          {label}
        </p>
        <p className="text-[10px] font-mono text-tech-accent flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 animate-spin" />
          <span>SENAZ FDM ENGINE ACTIVE</span>
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';

// Dynamic import with SSR false for smooth client-side canvas/svg rendering
const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then((mod) => mod.DotLottiePlayer),
  { ssr: false }
);

interface Lottie3DPrintLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export default function Lottie3DPrintLoader({
  label = 'Fabricating & Loading 3D Models...',
  size = 'md',
}: Lottie3DPrintLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [animLoaded, setAnimLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dimensionMap = {
    sm: { width: 140, height: 140 },
    md: { width: 220, height: 220 },
    lg: { width: 300, height: 300 },
    fullscreen: { width: 320, height: 320 },
  };

  const currentDim = dimensionMap[size] || dimensionMap.md;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center select-none ${
        size === 'fullscreen' ? 'min-h-[70vh] py-16' : 'p-6'
      }`}
    >
      {/* 3D Print Animation Container */}
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-tech-card/30 border border-tech-border/60 shadow-2xl backdrop-blur-sm"
        style={{ width: `${currentDim.width}px`, height: `${currentDim.height}px` }}
      >
        {/* DotLottie Native Player */}
        {mounted && (
          <div
            className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${
              animLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <DotLottiePlayer
              src="/animations/3d-print.lottie"
              autoplay
              loop
              onEvent={(event: string) => {
                if (event === 'ready' || event === 'play' || event === 'frame') {
                  setAnimLoaded(true);
                }
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}

        {/* High-Precision SVG 3D Printer Animation (Instant fallback while loading) */}
        {(!mounted || !animLoaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <svg
              viewBox="0 0 160 160"
              className="w-28 h-28 text-tech-accent"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Frame */}
              <rect x="20" y="20" width="120" height="120" rx="12" stroke="#334155" strokeWidth="3" />
              
              {/* Top Gantry Axis */}
              <line x1="20" y1="45" x2="140" y2="45" stroke="#475569" strokeWidth="3" />
              
              {/* Moving Extruder Nozzle Head */}
              <g className="animate-[bounce_1.5s_infinite]">
                <rect x="65" y="38" width="30" height="18" rx="3" fill="#0f172a" stroke="#00e5ff" strokeWidth="2" />
                {/* Nozzle Tip */}
                <polygon points="75,56 85,56 80,66" fill="#00e5ff" />
                {/* Hotend Filament Glow */}
                <circle cx="80" cy="68" r="2.5" fill="#f59e0b" className="animate-ping" />
              </g>

              {/* Build Plate Heated Bed */}
              <rect x="35" y="115" width="90" height="8" rx="2" fill="#1e293b" stroke="#00e5ff" strokeWidth="1.5" />
              
              {/* 3D Printed Object Layers Growing */}
              <rect x="55" y="102" width="50" height="12" rx="2" fill="#00e5ff" opacity="0.8" className="animate-pulse" />
              <rect x="62" y="90" width="36" height="12" rx="2" fill="#00e5ff" opacity="0.6" className="animate-pulse" />
              <rect x="70" y="78" width="20" height="12" rx="2" fill="#00e5ff" opacity="0.4" className="animate-pulse" />
            </svg>
          </div>
        )}

        {/* Ambient Glow */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-tech-accent/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Label and Status */}
      <div className="mt-4 space-y-1">
        <p className="text-xs sm:text-sm font-mono text-slate-200 tracking-wide font-semibold">
          {label}
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-tech-accent">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-tech-accent" />
          <span className="tracking-wider uppercase">SenAZ 3D Printing Engine</span>
        </div>
      </div>
    </div>
  );
}

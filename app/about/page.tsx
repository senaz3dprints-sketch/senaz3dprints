import React from 'react';
import Link from 'next/link';
import { Printer, Cpu, ShieldCheck, Zap, Layers, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent">
          <Printer className="w-3.5 h-3.5" />
          <span>About SenAZ 3D PRINTS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight leading-tight">
          Precision FDM 3D Printing in India.
        </h1>
        <p className="text-base text-slate-300 font-sans leading-relaxed">
          SenAZ 3D PRINTS (`senaz3dprints.in`) is an engineering-focused micro manufacturing print studio dedicated to high-precision personalized keychains, desk accessories, figures, and custom 3D model manufacturing.
        </p>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-tech-card p-6 rounded-2xl border border-tech-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-tech-bg border border-tech-border flex items-center justify-center">
            <Cpu className="w-5 h-5 text-tech-accent" />
          </div>
          <h3 className="text-lg font-bold text-white font-sans">High Precision Calibration</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Our FDM print beds are auto-mesh leveled and calibrated to sub-millimeter tolerances for clean surface finishes.
          </p>
        </div>

        <div className="bg-tech-card p-6 rounded-2xl border border-tech-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-tech-bg border border-tech-border flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-sans">Tough Engineering Polymers</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            We exclusively use high-grade PLA/PLA+, heat-resistant PETG, flexible TPU rubber, ASA, ABS, and technical Nylon polymers.
          </p>
        </div>

        <div className="bg-tech-card p-6 rounded-2xl border border-tech-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-tech-bg border border-tech-border flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-sans">Direct WhatsApp Order Flow</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            No friction or complex payment gateways. Real human stock confirmation and live preview approvals on WhatsApp.
          </p>
        </div>
      </div>

      {/* Tech Specifications Section */}
      <div className="bg-tech-card rounded-2xl border border-tech-border p-8 lg:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-white font-sans">Print Farm Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-4 bg-tech-bg rounded-xl border border-tech-border">
            <span className="text-slate-500 block">Nozzle Diameter</span>
            <span className="text-lg font-bold text-tech-accent">0.4mm / 0.2mm</span>
          </div>
          <div className="p-4 bg-tech-bg rounded-xl border border-tech-border">
            <span className="text-slate-500 block">Layer Height Range</span>
            <span className="text-lg font-bold text-white">0.08mm - 0.28mm</span>
          </div>
          <div className="p-4 bg-tech-bg rounded-xl border border-tech-border">
            <span className="text-slate-500 block">Max Build Volume</span>
            <span className="text-lg font-bold text-white">250 x 250 x 260 mm</span>
          </div>
          <div className="p-4 bg-tech-bg rounded-xl border border-tech-border">
            <span className="text-slate-500 block">Quality Check</span>
            <span className="text-lg font-bold text-emerald-400">100% Inspection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

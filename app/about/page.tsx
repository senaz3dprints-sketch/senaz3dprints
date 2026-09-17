import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Printer, Cpu, ShieldCheck, Zap, Layers, Award, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function AboutPage() {
  let content: any = null;
  try {
    const siteContent = await db.siteContent.findUnique({
      where: { key: 'homepage' },
    });
    if (siteContent) {
      content = JSON.parse(siteContent.content);
    }
  } catch (e) {
    console.error('Failed to fetch about content:', e);
  }

  const aboutTitle = content?.aboutTitle || 'Precision FDM 3D Printing in India.';
  const aboutStory =
    content?.aboutStory ||
    'SenAZ 3D PRINTS (senaz3dprints.in) is an engineering-focused micro manufacturing print studio dedicated to high-precision personalized keychains, desk accessories, figures, and custom 3D model manufacturing.';
  
  const highlight1Title = content?.aboutHighlight1Title || 'High Precision Calibration';
  const highlight1Desc = content?.aboutHighlight1Desc || 'Our FDM print beds are auto-mesh leveled and calibrated to sub-millimeter tolerances for clean surface finishes.';

  const highlight2Title = content?.aboutHighlight2Title || 'Tough Engineering Polymers';
  const highlight2Desc = content?.aboutHighlight2Desc || 'We exclusively use high-grade PLA/PLA+, heat-resistant PETG, flexible TPU rubber, ASA, ABS, and technical Nylon polymers.';

  const highlight3Title = content?.aboutHighlight3Title || 'Direct WhatsApp Order Flow';
  const highlight3Desc = content?.aboutHighlight3Desc || 'No friction or complex payment gateways. Real human stock confirmation and live preview approvals on WhatsApp.';

  const specNozzle = content?.aboutSpecNozzle || '0.4mm / 0.2mm';
  const specLayerHeight = content?.aboutSpecLayerHeight || '0.08mm - 0.28mm';
  const specBuildVolume = content?.aboutSpecBuildVolume || '250 x 250 x 260 mm';
  const specQuality = content?.aboutSpecQuality || '100% Inspection';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent">
          <Printer className="w-3.5 h-3.5" />
          <span>About SenAZ 3D PRINTS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight leading-tight">
          {aboutTitle}
        </h1>
        <p className="text-base text-slate-300 font-sans leading-relaxed">
          {aboutStory}
        </p>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-tech-card p-6 rounded-2xl border border-tech-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-tech-bg border border-tech-border flex items-center justify-center">
            <Cpu className="w-5 h-5 text-tech-accent" />
          </div>
          <h3 className="text-lg font-bold text-white font-sans">{highlight1Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {highlight1Desc}
          </p>
        </div>

        <div className="bg-tech-card p-6 rounded-2xl border border-tech-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-tech-bg border border-tech-border flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-sans">{highlight2Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {highlight2Desc}
          </p>
        </div>

        <div className="bg-tech-card p-6 rounded-2xl border border-tech-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-tech-bg border border-tech-border flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-sans">{highlight3Title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {highlight3Desc}
          </p>
        </div>
      </div>

      {/* Tech Specifications Section */}
      <div className="bg-tech-card rounded-2xl border border-tech-border p-8 lg:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-white font-sans">Print Farm Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-4 bg-tech-bg rounded-xl border border-tech-border">
            <span className="text-slate-500 block">Nozzle Diameter</span>
            <span className="text-lg font-bold text-tech-accent">{specNozzle}</span>
          </div>
          <div className="p-4 bg-tech-bg rounded-xl border border-tech-border">
            <span className="text-slate-500 block">Layer Height Range</span>
            <span className="text-lg font-bold text-white">{specLayerHeight}</span>
          </div>
          <div className="p-4 bg-tech-bg rounded-xl border border-tech-border">
            <span className="text-slate-500 block">Max Build Volume</span>
            <span className="text-lg font-bold text-white">{specBuildVolume}</span>
          </div>
          <div className="p-4 bg-tech-bg rounded-xl border border-tech-border">
            <span className="text-slate-500 block">Quality Check</span>
            <span className="text-lg font-bold text-emerald-400">{specQuality}</span>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="p-8 bg-gradient-to-r from-tech-card to-tech-bg border border-tech-accent/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Ready to create a custom 3D design?</h3>
          <p className="text-xs text-slate-400 mt-1">Upload your STL file or customize your nameplate keychain today.</p>
        </div>
        <Link
          href="/custom-printing"
          className="px-6 py-3 bg-tech-accent text-tech-bg font-bold font-mono text-xs rounded-xl hover:bg-tech-accent/90 transition-all flex items-center gap-2 shrink-0"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}


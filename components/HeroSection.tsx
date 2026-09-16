'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Upload } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export default function HeroSection({
  title = 'Made to Print.\nBuilt for You.',
  subtitle = 'Custom 3D printed products, personalised creations and functional designs made to your specifications.',
  primaryCta = 'Shop Products',
  secondaryCta = 'Get a Custom Print',
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-tech-bg border-b border-tech-border py-12 lg:py-20">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: BRAND & CALL TO ACTION (50% Width on Desktop) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Small Brand Label */}
            <div className="inline-block">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-tech-accent">
                SENAZ 3D PRINTS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans leading-[1.1]">
              Made to Print.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-tech-accent via-slate-100 to-brand-300">
                Built for You.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-sans leading-relaxed">
              {subtitle}
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-4 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{primaryCta}</span>
              </Link>
              <Link
                href="/custom-printing"
                className="px-8 py-4 rounded-xl bg-tech-card border border-tech-border hover:border-tech-accent/50 text-slate-200 hover:text-white font-extrabold text-sm font-mono transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-tech-accent" />
                <span>{secondaryCta}</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: REAL 3D PRINTER PHOTOGRAPH (50% Width on Desktop) */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="w-full max-w-xl relative rounded-2xl overflow-hidden shadow-2xl bg-tech-card border border-tech-border/80 aspect-4/3 sm:aspect-16/10 group">
              <img
                src="/images/senaz_3d_printer_hero.jpg"
                alt="SENAZ 3D Printing Studio - Real FDM Printer on Workbench"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

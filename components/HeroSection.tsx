'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Upload, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export default function HeroSection({
  title = 'Made to Print.\nBuilt for You.',
  subtitle = 'Custom 3D printed products, personalized designs, and high-precision functional parts made to your exact specifications. Available in PLA/PLA+, PETG, TPU, ASA, ABS, and Nylon.',
  primaryCta = 'Shop Products',
  secondaryCta = 'Get a Custom Print',
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  // Defer background video playback until after initial paint & idle to maximize LCP and FCP
  useEffect(() => {
    // Only load background video on desktop/fast devices after main paint
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.innerWidth >= 640) {
        setLoadVideo(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loadVideo && videoRef.current) {
      const video = videoRef.current;
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    }
  }, [loadVideo]);

  return (
    <section className="relative overflow-hidden bg-tech-bg border-b border-tech-border min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] flex items-center">
      {/* 1. BACKGROUND HIGH-PERFORMANCE POSTER & OPTIONAL AMBIENT VIDEO */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Instant LCP High-Priority Image */}
        <Image
          src="/images/senaz_3d_printer_hero.jpg"
          alt="SenAZ 3D Printing Production Farm"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_45%] sm:object-center transition-opacity duration-700 opacity-80"
        />

        {/* Deferred ambient video on larger screens */}
        {loadVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            x5-playsinline="true"
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover object-[55%_45%] sm:object-center transition-opacity duration-1000 opacity-90"
          >
            <source src="/videos/3d-printer-printing.mp4" type="video/mp4" />
            <track kind="captions" srcLang="en" label="English" default />
          </video>
        )}

        {/* Dynamic Dark Gradient & Overlays: Balanced for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-tech-bg/95 via-tech-bg/85 to-tech-bg/40 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-tech-bg via-transparent to-tech-bg/60" />
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        
        {/* Ambient Cyan Glow */}
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-tech-accent/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. HERO FOREGROUND CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24 w-full">
        <div className="max-w-3xl space-y-6 text-left">
          
          {/* Live 3D Printing Studio Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-tech-card/90 border border-tech-border backdrop-blur-md shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-tech-accent">
              SenAZ 3D PRINTS • LIVE STUDIO
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans leading-[1.08] drop-shadow-md">
            Made to Print.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-tech-accent via-slate-100 to-cyan-300">
              Built for You.
            </span>
          </h1>

          {/* Supporting Subtitle */}
          <p className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed drop-shadow max-w-2xl">
            {subtitle}
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/shop"
              aria-label="Shop our 3D printed products catalog"
              className="px-8 py-4 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-xl shadow-tech-accent/25 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>{primaryCta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/custom-printing"
              aria-label="Get a custom 3D print quotation"
              className="px-8 py-4 rounded-xl bg-tech-card/90 border border-tech-border/90 hover:border-tech-accent/60 backdrop-blur-md text-white font-extrabold text-sm font-mono transition-all shadow-lg flex items-center justify-center gap-2 hover:bg-tech-card"
            >
              <Upload className="w-4 h-4 text-tech-accent" />
              <span>{secondaryCta}</span>
            </Link>
          </div>

          {/* Quick Highlight Feature Pills */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-tech-border/60">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-tech-accent shrink-0" />
              <span>24–48h Dispatch</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-tech-accent shrink-0" />
              <span>High Precision FDM</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200 col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-tech-accent shrink-0" />
              <span>WhatsApp Live Preview</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

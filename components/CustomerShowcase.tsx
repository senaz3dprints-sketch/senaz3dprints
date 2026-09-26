'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Upload, CheckCircle2, SlidersHorizontal, Eye, MessageCircle } from 'lucide-react';
import { parseImageList } from '@/lib/images';

export interface CustomShowcaseItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number | null;
  images: string;
  material?: string;
  category?: { name: string; slug: string };
  personalizationEnabled?: boolean;
}

interface CustomerShowcaseProps {
  customProducts: CustomShowcaseItem[];
}

export default function CustomerShowcase({ customProducts }: CustomerShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo3d' | 'names' | 'functional'>('all');

  const filteredItems = customProducts.filter((p) => {
    const text = (p.name + ' ' + p.shortDescription + ' ' + (p.category?.name || '')).toLowerCase();
    if (activeFilter === 'photo3d') {
      return text.includes('photo') || text.includes('2d') || text.includes('model') || text.includes('statue');
    }
    if (activeFilter === 'names') {
      return p.personalizationEnabled || text.includes('keychain') || text.includes('name') || text.includes('custom');
    }
    if (activeFilter === 'functional') {
      return text.includes('utility') || text.includes('lamp') || text.includes('gear') || text.includes('part') || text.includes('print');
    }
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-tech-card to-tech-bg border border-tech-accent/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-tech-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-tech-border/70 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/40 text-xs font-mono text-tech-accent font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-tech-accent" />
                <span>Hall of Prints • Real Works</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight">
                Made for Our Customers
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1.5 max-w-2xl leading-relaxed">
                Explore real custom prints crafted in our print farm — from 2D photos transformed into physical 3D figurines to personalized name gifts and bespoke STL files.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/custom-printing"
                className="px-4 py-2.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-xs font-mono hover:bg-tech-accent/90 transition-all flex items-center gap-1.5 shadow-lg shadow-tech-accent/20"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Submit Your Custom Idea</span>
              </Link>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Custom Creations' },
              { id: 'photo3d', label: '📸 2D Photo to 3D Prints' },
              { id: 'names', label: '✨ Name & Personalized Gifts' },
              { id: 'functional', label: '⚙️ Functional & Custom STL' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeFilter === tab.id
                    ? 'bg-tech-accent text-tech-bg font-bold shadow-md shadow-tech-accent/20 ring-1 ring-tech-accent'
                    : 'bg-tech-card/80 border border-tech-border text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Showcase Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredItems.map((item) => {
              const imageList = parseImageList(item.images);
              const mainImage = imageList[0] || 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={item.id}
                  className="group bg-tech-bg/90 rounded-xl border border-tech-border hover:border-tech-accent/50 transition-all duration-300 flex flex-col overflow-hidden shadow-md hover:shadow-tech-accent/10"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-tech-card">
                    <img
                      src={mainImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      <span className="bg-tech-bg/90 border border-tech-accent/40 text-tech-accent text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow backdrop-blur-md">
                        {item.category?.name || 'Custom'}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-emerald-500/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-1 backdrop-blur-md">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Real Print
                      </span>
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-tech-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <span className="text-[10px] font-mono text-white flex items-center gap-1 font-semibold">
                        <Eye className="w-3 h-3 text-tech-accent" /> View details
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-0.5">
                      <Link href={`/shop/${item.slug}`}>
                        <h3 className="text-sm font-semibold text-white group-hover:text-tech-accent transition-colors line-clamp-1 leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-1 leading-tight">
                        {item.shortDescription}
                      </p>
                    </div>

                    {/* Specs Pills */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-tech-card/60 p-1.5 rounded-lg border border-tech-border">
                      <span className="text-slate-400">Material:</span>
                      <span className="text-tech-accent font-semibold">{item.material || 'PLA+'}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-400">Finish:</span>
                      <span className="text-white">Precision FDM</span>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-1.5 border-t border-tech-border/70 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 block leading-none mb-0.5">From</span>
                        <span className="text-base font-bold text-white font-mono">₹{item.price}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/shop/${item.slug}`}
                          className="px-2.5 py-1.5 rounded-lg bg-tech-accent text-tech-bg hover:bg-tech-accent/90 text-[11px] font-mono font-bold flex items-center gap-1 transition-all shadow shadow-tech-accent/10"
                        >
                          {item.personalizationEnabled ? (
                            <>
                              <SlidersHorizontal className="w-3 h-3" />
                              <span>Personalise</span>
                            </>
                          ) : (
                            <>
                              <span>Order</span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner for Custom Inquiries */}
          <div className="p-5 rounded-2xl bg-tech-bg/80 border border-tech-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-tech-accent/10 border border-tech-accent/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-tech-accent" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">Want your own photo or CAD idea printed?</h4>
                <p className="text-xs text-slate-300 font-sans">Send us your image or 3D file for an instant quotation and preview.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/custom-printing"
                className="px-4 py-2 rounded-xl bg-tech-card hover:bg-tech-card/80 border border-tech-accent/40 text-tech-accent font-mono text-xs font-bold transition-all"
              >
                Upload File / Photo
              </Link>
              <a
                href="https://wa.me/918761053230?text=Hi%20SenAZ%203D%20PRINTS%2C%20I%20have%20a%20custom%203D%20printing%20idea%20and%20want%20to%20get%20a%20quote."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-black" />
                <span>WhatsApp Quote</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

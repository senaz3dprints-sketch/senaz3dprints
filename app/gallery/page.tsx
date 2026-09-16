import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Sparkles } from 'lucide-react';

export default function GalleryPage() {
  const galleryItems = [
    {
      title: 'Custom Name Keychain - Dual Color Layer',
      category: 'Keychains',
      material: 'PLA+ White / Black',
      image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Low-Poly Dragon Statue Metallic Finish',
      category: 'Figures',
      material: 'Silk Gold PLA',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Voronoi Openwork Geometric Planter',
      category: 'Decor',
      material: 'Recycled Black PLA',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Minimalist Modular Desk Cable Clamps',
      category: 'Desk & Utility',
      material: 'PETG Industrial',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Custom Executive Desk Nameplate',
      category: 'Personalised',
      material: 'Wood-Fill & PLA+',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Chibi Mascot Desk Figurine',
      category: 'Figures',
      material: 'Tough Resin',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent">
          <Camera className="w-3.5 h-3.5" />
          <span>Real Print Showcase</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
          SENAZ Business Gallery
        </h1>
        <p className="text-sm text-slate-300 font-sans leading-relaxed">
          High-resolution product photographs showcasing surface quality, layer fidelity, and custom finishes.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            className="group bg-tech-card rounded-2xl border border-tech-border overflow-hidden hover:border-tech-accent/50 transition-all shadow-lg"
          >
            <div className="relative aspect-4/3 w-full bg-tech-bg overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-tech-bg/80 border border-tech-border text-tech-accent font-mono text-[10px] font-semibold px-2.5 py-1 rounded backdrop-blur-sm">
                {item.category}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-semibold text-white text-sm group-hover:text-tech-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Material: <span className="text-slate-200">{item.material}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

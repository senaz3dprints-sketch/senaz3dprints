'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Printer, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/products`);
        if (res.ok) {
          const data = await res.json();
          const q = query.toLowerCase();
          const filtered = (data.products || []).filter(
            (p: any) =>
              p.name.toLowerCase().includes(q) ||
              p.shortDescription.toLowerCase().includes(q) ||
              p.material.toLowerCase().includes(q)
          );
          setProducts(filtered);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="relative w-full max-w-2xl bg-tech-card border border-tech-border rounded-2xl shadow-2xl overflow-hidden text-slate-100 space-y-4 p-4 sm:p-6">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 border-b border-tech-border pb-3">
          <Search className="w-5 h-5 text-tech-accent shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search 3D printed keychains, figures, desk utility..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-slate-500 font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-tech-bg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="space-y-2 py-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Popular Searches:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Personalized Keychain', 'Dragon Statue', 'Voronoi Planter', 'Cable Clamps', 'Custom Nameplate'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 rounded-md bg-tech-bg border border-tech-border hover:border-tech-accent text-xs font-mono text-slate-300 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-slate-400">Searching catalog...</div>
        ) : query && products.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-slate-400">
            No products matching "{query}". Try checking product materials or categories!
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2">
            {products.map((p) => {
              let images = [];
              try {
                images = JSON.parse(p.images);
              } catch (e) {
                images = [p.images];
              }
              const img = images[0] || 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80';

              return (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-tech-bg border border-transparent hover:border-tech-border transition-colors group"
                >
                  <img src={img} alt={p.name} className="w-12 h-12 object-cover rounded bg-tech-card" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-white group-hover:text-tech-accent truncate">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{p.shortDescription}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-white">₹{p.price}</span>
                    <span className="block text-[10px] text-tech-accent">{p.material}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

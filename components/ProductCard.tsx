'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getFilamentColorStyle } from '@/lib/colors';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number | null;
  images: string; // JSON string array or string
  material?: string;
  colors?: string | null;
  isFeatured?: boolean;
  isNew?: boolean;
  personalizationEnabled?: boolean;
  shippingFee?: number | null;
  category?: { name: string; slug: string };
}

export default function ProductCard({
  id,
  name,
  slug,
  shortDescription,
  price,
  compareAtPrice,
  images,
  material = 'PLA+',
  colors,
  isFeatured,
  isNew,
  personalizationEnabled,
  shippingFee,
  category,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(id);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Parse images JSON safely
  let imageList: string[] = [];
  try {
    imageList = typeof images === 'string' ? JSON.parse(images) : images;
  } catch (e) {
    imageList = [images as unknown as string];
  }
  if (!Array.isArray(imageList) || imageList.length === 0) {
    imageList = ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'];
  }

  // Parse colors JSON safely
  let colorList: string[] = [];
  if (colors) {
    try {
      colorList = typeof colors === 'string' ? JSON.parse(colors) : colors;
    } catch (e) {}
  }

  const discountPercent = compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null;

  // Swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % imageList.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <div className="group bg-tech-card rounded-xl border border-tech-border hover:border-tech-accent/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-tech-accent/5 select-none">
      {/* Image Container with Swipe / Slide */}
      <div
        className="relative aspect-square w-full bg-tech-bg/80 overflow-hidden"
        onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStart === null) return;
          const touchEnd = e.changedTouches[0].clientX;
          const diff = touchStart - touchEnd;
          if (diff > 35 && imageList.length > 1) {
            setActiveImgIdx((prev) => (prev + 1) % imageList.length);
          } else if (diff < -35 && imageList.length > 1) {
            setActiveImgIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
          }
          setTouchStart(null);
        }}
      >
        <Link href={`/shop/${slug}`} className="block w-full h-full">
          <div
            className="flex w-full h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeImgIdx * 100}%)` }}
          >
            {imageList.map((img, idx) => (
              <div key={idx} className="w-full h-full shrink-0 relative">
                <img
                  src={img}
                  alt={`${name} - ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </Link>

        {/* Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isNew && (
            <span className="bg-tech-accent text-tech-bg text-[10px] font-extrabold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
              New
            </span>
          )}
          {personalizationEnabled && (
            <span className="bg-brand-800/90 border border-tech-accent/30 text-tech-accent text-[10px] font-semibold px-2 py-0.5 rounded font-mono flex items-center gap-1 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" /> Custom Text
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-500/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded font-mono">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Prev / Next Arrows (Visible on Card Hover if > 1 image) */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-tech-bg/80 hover:bg-tech-card text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-tech-bg/80 hover:bg-tech-card text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots indicator at bottom */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-tech-bg/70 backdrop-blur-sm z-10 pointer-events-none">
              {imageList.map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all ${
                    activeImgIdx === idx ? 'w-3 h-1.5 bg-tech-accent' : 'w-1.5 h-1.5 bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Wishlist Button Top Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full border transition-all z-20 backdrop-blur-md ${
            inWishlist
              ? 'bg-rose-500/20 border-rose-500 text-rose-500'
              : 'bg-tech-bg/60 border-tech-border text-slate-300 hover:text-white'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {category && (
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              {category.name}
            </span>
          )}
          <Link href={`/shop/${slug}`}>
            <h3 className="font-semibold text-slate-100 group-hover:text-tech-accent transition-colors text-base line-clamp-1">
              {name}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        {/* Color Swatches Preview */}
        {colorList.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="text-[10px]">Colors:</span>
            <div className="flex items-center gap-1">
              {colorList.slice(0, 5).map((col, idx) => {
                const style = getFilamentColorStyle(col);
                return (
                  <span
                    key={idx}
                    title={col}
                    className="w-3 h-3 rounded-full border border-slate-700 shadow-sm shrink-0"
                    style={{ background: style.background, borderColor: style.border }}
                  />
                );
              })}
              {colorList.length > 5 && (
                <span className="text-[10px] text-slate-500">+{colorList.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {/* Material Tag & Price */}
        <div className="pt-2 border-t border-tech-border/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 font-medium">Material: {material}</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold text-white font-mono">₹{price}</span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  ₹{compareAtPrice}
                </span>
              )}
            </div>
          </div>

          {/* Quick CTA */}
          {personalizationEnabled ? (
            <Link
              href={`/shop/${slug}`}
              className="px-3 py-2 rounded-lg bg-tech-card border border-tech-accent/40 text-tech-accent hover:bg-tech-accent/10 text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Personalise</span>
            </Link>
          ) : (
            <button
              onClick={() =>
                addToCart({
                  productId: id,
                  slug,
                  name,
                  image: imageList[activeImgIdx] || imageList[0],
                  price,
                  shippingFee: shippingFee || 0,
                  quantity: 1,
                  color: colorList[0] || 'Default',
                })
              }
              className="px-3 py-2 rounded-lg bg-tech-accent text-tech-bg hover:bg-tech-accent/90 text-xs font-semibold font-mono flex items-center gap-1.5 transition-all shadow shadow-tech-accent/10"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

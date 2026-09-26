'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getFilamentColorStyle, parseProductColors } from '@/lib/colors';
import { parseImageList } from '@/lib/images';

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

  // Parse images safely and normalize Drive/remote URLs
  const imageList = parseImageList(images);

  // Parse colors safely
  const colorList = parseProductColors(colors);

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
    <div className="group bg-tech-card rounded-xl border border-tech-border hover:border-tech-accent/40 transition-all duration-300 flex flex-col overflow-hidden shadow-md hover:shadow-tech-accent/5 select-none">
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
        <Link href={`/shop/${slug}`} className="block w-full h-full" aria-label={`View ${name}`}>
          <div
            className="flex w-full h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeImgIdx * 100}%)` }}
          >
            {imageList.map((img, idx) => (
              <div key={idx} className="w-full h-full shrink-0 relative">
                <Image
                  src={img}
                  alt={`${name} - ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </Link>

        {/* Badges Top Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {isNew && (
            <span className="bg-tech-accent text-tech-bg text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shadow">
              New
            </span>
          )}
          {personalizationEnabled && (
            <span className="bg-brand-900/95 border border-tech-accent/40 text-tech-accent text-[9px] font-semibold px-1.5 py-0.5 rounded font-mono flex items-center gap-1 backdrop-blur-sm shadow">
              <Sparkles className="w-2.5 h-2.5" /> Custom Text
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-500/95 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono shadow">
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
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-tech-bg/85 hover:bg-tech-card text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm z-20"
              aria-label="Previous product image"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-tech-bg/85 hover:bg-tech-card text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm z-20"
              aria-label="Next product image"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Dots indicator at bottom */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-tech-bg/80 backdrop-blur-sm z-10 pointer-events-none">
              {imageList.map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all ${
                    activeImgIdx === idx ? 'w-2.5 h-1 bg-tech-accent' : 'w-1 h-1 bg-slate-400'
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
          className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all z-20 backdrop-blur-md shadow ${
            inWishlist
              ? 'bg-rose-500/20 border-rose-500 text-rose-400'
              : 'bg-tech-bg/70 border-tech-border text-slate-200 hover:text-white'
          }`}
          aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {category && (
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
              {category.name}
            </span>
          )}
          <Link href={`/shop/${slug}`}>
            <h3 className="font-semibold text-white group-hover:text-tech-accent transition-colors text-sm leading-snug line-clamp-1">
              {name}
            </h3>
          </Link>
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-tight">
            {shortDescription}
          </p>
        </div>

        {/* Color Swatches Preview */}
        {colorList.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <span>Colors:</span>
            <div className="flex items-center gap-1">
              {colorList.slice(0, 4).map((col, idx) => {
                const style = getFilamentColorStyle(col);
                return (
                  <span
                    key={idx}
                    title={col.name}
                    className="w-2.5 h-2.5 rounded-full border border-slate-700 shadow-sm shrink-0"
                    style={{ background: style.background, borderColor: style.border }}
                  />
                );
              })}
              {colorList.length > 4 && (
                <span className="text-[9px] text-slate-400">+{colorList.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Material Tag & Price */}
        <div className="pt-1.5 border-t border-tech-border/60 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400">{material}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white font-mono">₹{price}</span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-[11px] text-slate-400 line-through font-mono">
                  ₹{compareAtPrice}
                </span>
              )}
            </div>
          </div>

          {/* Quick CTA */}
          {personalizationEnabled ? (
            <Link
              href={`/shop/${slug}`}
              aria-label={`Personalise ${name}`}
              className="px-2.5 py-1.5 rounded-lg bg-tech-card border border-tech-accent/40 text-tech-accent hover:bg-tech-accent/10 text-[11px] font-semibold font-mono flex items-center gap-1 transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3" />
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
                  color: colorList[0]?.name || 'Default',
                })
              }
              aria-label={`Add ${name} to order bag`}
              className="px-2.5 py-1.5 rounded-lg bg-tech-accent text-tech-bg hover:bg-tech-accent/90 text-[11px] font-semibold font-mono flex items-center gap-1 transition-all shadow shadow-tech-accent/10"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

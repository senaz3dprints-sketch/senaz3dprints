'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  Info,
  Type,
  Palette,
  Check,
  Shield,
  Video,
  Play,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { generateProductInquiryUrl } from '@/lib/whatsapp';
import { getFilamentColorStyle, parseProductColors, ColorOption } from '@/lib/colors';
import { parseImageList } from '@/lib/images';
import { parseProductVideo, ParsedVideo } from '@/lib/video';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

const BASE_COLORS = [
  { name: 'Matte Obsidian Black', hex: '#12161f', border: '#374151' },
  { name: 'Carbon Stealth Grey', hex: '#1e293b', border: '#475569' },
  { name: 'Pure Arctic White', hex: '#f8fafc', border: '#cbd5e1' },
  { name: 'Deep Navy Blue', hex: '#0f172a', border: '#2563eb' },
  { name: 'Racing Crimson Red', hex: '#991b1b', border: '#ef4444' },
];

const TEXT_COLORS = [
  { name: 'Electric Neon Cyan', hex: '#00e5ff', glow: 'rgba(0, 229, 255, 0.5)' },
  { name: 'Silk Radiant Gold', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
  { name: 'Pure Arctic White', hex: '#ffffff', glow: 'rgba(255, 255, 255, 0.5)' },
  { name: 'Ruby Flame Red', hex: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' },
  { name: 'Vibrant Lime Green', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' },
  { name: 'Sunset Signal Orange', hex: '#f97316', glow: 'rgba(249, 115, 22, 0.5)' },
];

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();

  // Parse media (images + video)
  const imageList = parseImageList(product.images || product.image);
  const parsedVideo = parseProductVideo(product.videoUrl);

  type MediaSlide =
    | { type: 'image'; url: string }
    | { type: 'video'; embedUrl: string; videoType: 'youtube' | 'drive' | 'direct'; originalUrl: string };

  const mediaSlides: MediaSlide[] = [
    ...imageList.map((url) => ({ type: 'image' as const, url })),
    ...(parsedVideo
      ? [{ type: 'video' as const, embedUrl: parsedVideo.embedUrl, videoType: parsedVideo.type, originalUrl: parsedVideo.originalUrl }]
      : []),
  ];

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Parse color options (supports custom color swatch images)
  const colorOptions: ColorOption[] = parseProductColors(product.colors);

  const sizeList: string[] = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === 'string'
    ? JSON.parse(product.sizes || '[]')
    : [];

  const [selectedColor, setSelectedColor] = useState(
    colorOptions[0]?.name || 'Default'
  );
  const [selectedSize, setSelectedSize] = useState(sizeList[0] || 'Standard');

  // Swipe / Drag handling state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const minSwipeDistance = 40;

  const nextSlide = () => {
    if (mediaSlides.length <= 1) return;
    setActiveMediaIndex((prev) => (prev + 1) % mediaSlides.length);
  };

  const prevSlide = () => {
    if (mediaSlides.length <= 1) return;
    setActiveMediaIndex((prev) => (prev - 1 + mediaSlides.length) % mediaSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setMouseStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown || mouseStartX === null) return;
    const distance = mouseStartX - e.clientX;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setIsMouseDown(false);
    setMouseStartX(null);
  };

  // Personalization state
  const isPersonalizationDefault = product.personalizationEnabled || product.customTextEnabled;
  const [isPersonalizationActive, setIsPersonalizationActive] = useState(Boolean(isPersonalizationDefault));
  const [personalizedText, setPersonalizedText] = useState('YOUR NAME');
  const [selectedBaseColor, setSelectedBaseColor] = useState(BASE_COLORS[0]);
  const [selectedTextColor, setSelectedTextColor] = useState(TEXT_COLORS[0]);
  const [quantity, setQuantity] = useState(1);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const displayText = personalizedText.trim() ? personalizedText.toUpperCase() : 'YOUR NAME';

  const handleAddToCart = () => {
    const finalColor = isPersonalizationActive
      ? `${selectedBaseColor.name} / ${selectedTextColor.name}`
      : selectedColor;

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: imageList[0] || (mediaSlides[0]?.type === 'image' ? mediaSlides[0].url : 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'),
      price: product.price,
      shippingFee: product.shippingFee || 0,
      quantity,
      color: finalColor,
      size: selectedSize,
      personalizedText: isPersonalizationActive && personalizedText.trim() ? personalizedText.trim().toUpperCase() : undefined,
    });
  };

  const whatsappInquiryUrl = generateProductInquiryUrl(product.name, product.price, {
    quantity,
    color: isPersonalizationActive ? `${selectedBaseColor.name} + ${selectedTextColor.name}` : selectedColor,
    size: selectedSize,
    personalizedText: isPersonalizationActive && personalizedText.trim() ? personalizedText.trim().toUpperCase() : undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 select-none">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-white transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 truncate">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Swipeable Image & Video Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className="relative aspect-square w-full bg-tech-card rounded-2xl border border-tech-border overflow-hidden shadow-2xl group cursor-grab active:cursor-grabbing touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            {/* Sliding Media Strip (Images & Video) */}
            <div
              className="flex w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeMediaIndex * 100}%)` }}
            >
              {mediaSlides.map((slide, idx) => (
                <div key={idx} className="w-full h-full shrink-0 relative bg-tech-bg flex items-center justify-center overflow-hidden">
                  {slide.type === 'image' ? (
                    <img
                      src={slide.url}
                      alt={`${product.name} - Slide ${idx + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                    />
                  ) : slide.videoType === 'youtube' ? (
                    <div className="w-full h-full flex items-center justify-center bg-black relative">
                      <iframe
                        src={slide.embedUrl}
                        title={`${product.name} Video`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : slide.videoType === 'drive' ? (
                    <div className="w-full h-full flex items-center justify-center bg-black relative">
                      <iframe
                        src={slide.embedUrl}
                        title={`${product.name} Video`}
                        className="w-full h-full border-0"
                        allow="autoplay"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      src={slide.embedUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover bg-black"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Badges Top Left */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {discountPercent && (
                <span className="bg-rose-500 text-white font-mono font-extrabold text-xs px-2.5 py-1 rounded shadow-lg">
                  -{discountPercent}% OFF
                </span>
              )}
              {product.personalizationEnabled && (
                <span className="bg-tech-accent/90 text-tech-bg font-mono font-extrabold text-xs px-2.5 py-1 rounded shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Personalised</span>
                </span>
              )}
            </div>

            {/* Video Label Badge Top Right if active is video */}
            {mediaSlides[activeMediaIndex]?.type === 'video' && (
              <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span className="bg-tech-bg/90 border border-tech-accent text-tech-accent font-mono font-bold text-[11px] px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                  <Play className="w-3 h-3 fill-tech-accent" />
                  <span>Product Action Video</span>
                </span>
              </div>
            )}

            {/* Prev / Next Swipe Arrows (Visible when > 1 slide) */}
            {mediaSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-tech-bg/70 hover:bg-tech-card border border-tech-border text-slate-200 hover:text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md z-10"
                  aria-label="Previous media"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-tech-bg/70 hover:bg-tech-card border border-tech-border text-slate-200 hover:text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md z-10"
                  aria-label="Next media"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots Pagination Indicator & Swipe Hint */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tech-bg/80 border border-tech-border backdrop-blur-md z-10">
                  {mediaSlides.map((slide, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMediaIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all flex items-center justify-center ${
                        activeMediaIndex === idx
                          ? 'w-6 bg-tech-accent shadow-sm'
                          : 'w-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-slate-400 ml-1">
                    {activeMediaIndex + 1}/{mediaSlides.length}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Synced Thumbnails Strip */}
          {mediaSlides.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {mediaSlides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 relative ${
                    activeMediaIndex === idx
                      ? 'border-tech-accent scale-95 shadow-lg shadow-tech-accent/20 ring-1 ring-tech-accent'
                      : 'border-tech-border opacity-60 hover:opacity-100'
                  }`}
                >
                  {slide.type === 'image' ? (
                    <img src={slide.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-tech-card flex flex-col items-center justify-center gap-1 text-tech-accent relative">
                      <Play className="w-5 h-5 fill-tech-accent" />
                      <span className="text-[9px] font-mono font-bold tracking-wider">VIDEO</span>
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tech-accent animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-tech-card border border-tech-border flex items-center gap-2.5 text-xs font-mono text-slate-300">
              <ShieldCheck className="w-4 h-4 text-tech-accent shrink-0" />
              <span>High Precision FDM Calibration</span>
            </div>
            <div className="p-3 rounded-xl bg-tech-card border border-tech-border flex items-center gap-2.5 text-xs font-mono text-slate-300">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pan-India Secure Dispatch</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Order Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-tech-accent uppercase tracking-wider block">
                {product.category?.name || '3D Printed Product'}
              </span>
              {product.isFeatured && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-bold text-white font-mono">₹{product.price}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-slate-500 line-through font-mono">
                  ₹{product.compareAtPrice}
                </span>
              )}
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                In Stock ({product.stockQuantity} available)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {product.fullDescription || product.shortDescription}
          </p>

          {/* Custom Name / Personalization Section (if enabled) */}
          {(isPersonalizationDefault || isPersonalizationActive) && (
            <div className="p-4 rounded-xl bg-tech-card border border-tech-border space-y-3">
              <div className="flex items-center justify-between border-b border-tech-border/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-tech-accent" />
                  <span className="text-xs sm:text-sm font-bold text-white font-sans">
                    Custom Name & Dual-Color Inscription
                  </span>
                </div>
                {!isPersonalizationDefault && (
                  <button
                    type="button"
                    onClick={() => setIsPersonalizationActive(!isPersonalizationActive)}
                    className="text-[11px] font-mono text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-tech-accent" />
                      <span>Custom Inscribed Name / Text</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {personalizedText.length}/14 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={14}
                    value={personalizedText}
                    onChange={(e) => setPersonalizedText(e.target.value)}
                    placeholder="e.g. SENAZ 3D"
                    className="w-full bg-tech-bg border border-tech-border rounded-xl px-3.5 py-2 text-xs text-white font-mono tracking-wider focus:outline-none focus:border-tech-accent"
                  />
                </div>

                {/* Base Color & Text Layer Color Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-tech-accent" />
                      <span>Base: <strong className="text-white">{selectedBaseColor.name.split(' ')[1] || selectedBaseColor.name}</strong></span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {BASE_COLORS.map((base) => (
                        <button
                          key={base.name}
                          type="button"
                          onClick={() => setSelectedBaseColor(base)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                            selectedBaseColor.name === base.name
                              ? 'border-tech-accent scale-110 ring-1 ring-tech-accent'
                              : 'border-tech-border opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: base.hex }}
                          title={base.name}
                        >
                          {selectedBaseColor.name === base.name && (
                            <Check className="w-3.5 h-3.5 text-tech-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-tech-accent" />
                      <span>Text: <strong className="text-white">{selectedTextColor.name.split(' ')[1] || selectedTextColor.name}</strong></span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TEXT_COLORS.map((tc) => (
                        <button
                          key={tc.name}
                          type="button"
                          onClick={() => setSelectedTextColor(tc)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                            selectedTextColor.name === tc.name
                              ? 'border-tech-accent scale-110 ring-1 ring-tech-accent'
                              : 'border-tech-border opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: tc.hex }}
                          title={tc.name}
                        >
                          {selectedTextColor.name === tc.name && (
                            <Check className="w-3.5 h-3.5 text-black" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If personalization is optional and not active */}
          {!isPersonalizationDefault && !isPersonalizationActive && (
            <button
              type="button"
              onClick={() => setIsPersonalizationActive(true)}
              className="w-full py-2 px-3 rounded-xl bg-tech-card/60 hover:bg-tech-card border border-tech-border hover:border-tech-accent/60 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-tech-accent" />
              <span>+ Add Custom Inscribed Name / Text (Free)</span>
            </button>
          )}

          {/* Standard Color Selector (if personalization not active and product has colors) */}
          {!isPersonalizationActive && colorOptions.length > 0 && (
            <div className="space-y-2.5 p-3.5 bg-tech-card/50 rounded-xl border border-tech-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-tech-accent" />
                  <span>Choose Filament Color:</span>
                </label>
                <span className="text-xs font-mono text-tech-accent font-bold">
                  {selectedColor}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-0.5">
                {colorOptions.map((colorOpt) => {
                  const style = getFilamentColorStyle(colorOpt);
                  const isSelected = selectedColor === colorOpt.name;
                  return (
                    <button
                      key={colorOpt.name}
                      type="button"
                      onClick={() => setSelectedColor(colorOpt.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-tech-accent/20 border-tech-accent text-white shadow-md shadow-tech-accent/10 ring-1 ring-tech-accent font-bold'
                          : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {colorOpt.image ? (
                        <img
                          src={colorOpt.image}
                          alt={colorOpt.name}
                          className="w-4 h-4 rounded-full object-cover border border-tech-accent/60 shadow-sm shrink-0"
                        />
                      ) : (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0 shadow-sm"
                          style={{ background: style.background, borderColor: style.border }}
                        />
                      )}
                      <span>{colorOpt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizeList.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                Select Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeList.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      selectedSize === sz
                        ? 'bg-tech-accent/20 border-tech-accent text-tech-accent font-semibold'
                        : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="pt-4 border-t border-tech-border space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-slate-300 font-semibold">Quantity:</span>
              <div className="flex items-center border border-tech-border rounded-lg bg-tech-card">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono text-white font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Order Bag</span>
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm font-mono hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="bg-tech-card rounded-xl border border-tech-border p-4 space-y-2 text-xs font-mono">
            <span className="text-slate-200 font-bold uppercase tracking-wider block border-b border-tech-border pb-2">
              Technical Specifications
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
              <div>
                Material: <span className="text-white font-semibold">{product.material}</span>
              </div>
              {product.weight && (
                <div>
                  Weight: <span className="text-white font-semibold">{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  Dimensions: <span className="text-white font-semibold">{product.dimensions}</span>
                </div>
              )}
              <div>
                Print Resolution: <span className="text-tech-accent font-semibold">High Precision FDM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-tech-border space-y-6">
          <h2 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                id={rel.id}
                name={rel.name}
                slug={rel.slug}
                shortDescription={rel.shortDescription}
                price={rel.price}
                compareAtPrice={rel.compareAtPrice}
                images={rel.images}
                material={rel.material}
                colors={rel.colors}
                personalizationEnabled={rel.personalizationEnabled}
                shippingFee={rel.shippingFee}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

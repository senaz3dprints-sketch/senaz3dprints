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
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { generateProductInquiryUrl } from '@/lib/whatsapp';
import { getFilamentColorStyle } from '@/lib/colors';
import { parseImageList } from '@/lib/images';

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

  // Safely parse and normalize image list
  const imageList = parseImageList(product.images || product.image);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const colorList: string[] = Array.isArray(product.colors)
    ? product.colors
    : typeof product.colors === 'string'
    ? JSON.parse(product.colors || '[]')
    : [];

  const sizeList: string[] = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === 'string'
    ? JSON.parse(product.sizes || '[]')
    : [];

  const [selectedColor, setSelectedColor] = useState(
    colorList[0] || 'Default'
  );
  const [selectedSize, setSelectedSize] = useState(sizeList[0] || 'Standard');

  // Swipe / Drag handling state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const minSwipeDistance = 40;

  const nextImage = () => {
    if (imageList.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    if (imageList.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
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
      nextImage();
    } else if (distance < -minSwipeDistance) {
      prevImage();
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
      nextImage();
    } else if (distance < -minSwipeDistance) {
      prevImage();
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
      image: imageList[activeImageIndex] || imageList[0],
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
        {/* Left Column: Swipeable Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className="relative aspect-square w-full bg-tech-card rounded-2xl border border-tech-border overflow-hidden shadow-2xl group cursor-grab active:cursor-grabbing touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            {/* Sliding Image Strip */}
            <div
              className="flex w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
            >
              {imageList.map((img, idx) => (
                <div key={idx} className="w-full h-full shrink-0 relative bg-tech-bg">
                  <img
                    src={img}
                    alt={`${product.name} - Photo ${idx + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
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

            {/* Prev / Next Swipe Arrows (Visible when > 1 image) */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-tech-bg/70 hover:bg-tech-card border border-tech-border text-slate-200 hover:text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-tech-bg/70 hover:bg-tech-card border border-tech-border text-slate-200 hover:text-white flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-md z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots Pagination Indicator & Swipe Hint */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tech-bg/80 border border-tech-border backdrop-blur-md z-10">
                  {imageList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        activeImageIndex === idx
                          ? 'w-6 bg-tech-accent shadow-sm'
                          : 'w-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-slate-400 ml-1">
                    {activeImageIndex + 1}/{imageList.length}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Synced Thumbnails Strip */}
          {imageList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 relative ${
                    activeImageIndex === idx
                      ? 'border-tech-accent scale-95 shadow-lg shadow-tech-accent/20 ring-1 ring-tech-accent'
                      : 'border-tech-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
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
          {!isPersonalizationActive && colorList.length > 0 && (
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
                {colorList.map((color) => {
                  const style = getFilamentColorStyle(color);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-tech-accent/20 border-tech-accent text-white shadow-md shadow-tech-accent/10 ring-1 ring-tech-accent font-bold'
                          : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0 shadow-sm"
                        style={{ background: style.background, borderColor: style.border }}
                      />
                      <span>{color}</span>
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

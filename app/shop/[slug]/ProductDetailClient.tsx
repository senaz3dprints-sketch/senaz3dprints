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
  Info,
  Type,
  Palette,
  Check,
  Shield,
  Upload,
  X,
  FileText,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { generateProductInquiryUrl } from '@/lib/whatsapp';

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

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'
  );
  const [selectedColor, setSelectedColor] = useState(
    colorList[0] || 'Default'
  );
  const [selectedSize, setSelectedSize] = useState(sizeList[0] || 'Standard');

  // Personalization state
  const isPersonalizationDefault = product.personalizationEnabled || product.customTextEnabled;
  const [isPersonalizationActive, setIsPersonalizationActive] = useState(Boolean(isPersonalizationDefault));
  const [personalizedText, setPersonalizedText] = useState('YOUR NAME');
  const [selectedBaseColor, setSelectedBaseColor] = useState(BASE_COLORS[0]);
  const [selectedTextColor, setSelectedTextColor] = useState(TEXT_COLORS[0]);
  const [uploadedPhoto, setUploadedPhoto] = useState<{ name: string; previewUrl?: string } | null>(null);
  const [photoStyle, setPhotoStyle] = useState<'EMBOSS' | 'FULL_COLOR' | 'LITHOPHANE'>('EMBOSS');
  const [quantity, setQuantity] = useState(1);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const displayText = personalizedText.trim() ? personalizedText.toUpperCase() : (uploadedPhoto?.previewUrl ? '' : 'YOUR NAME');

  const handleAddToCart = () => {
    const finalColor = isPersonalizationActive
      ? `${selectedBaseColor.name} / ${selectedTextColor.name}`
      : selectedColor;

    const customDesc = isPersonalizationActive
      ? [
          displayText ? `Name: ${displayText}` : '',
          uploadedPhoto ? `Image: ${uploadedPhoto.name} (${photoStyle})` : '',
        ]
          .filter(Boolean)
          .join(' • ')
      : undefined;

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: selectedImage,
      price: product.price,
      shippingFee: product.shippingFee || 0,
      quantity,
      color: finalColor,
      size: selectedSize,
      personalizedText: customDesc || undefined,
    });
  };

  const customTextForWhatsapp = isPersonalizationActive
    ? [
        displayText ? `"${displayText}"` : '',
        uploadedPhoto ? `Attached Image: ${uploadedPhoto.name} [3D Style: ${photoStyle}]` : '',
      ]
        .filter(Boolean)
        .join(' + ')
    : undefined;

  const whatsappInquiryUrl = generateProductInquiryUrl(product.name, product.price, {
    quantity,
    color: isPersonalizationActive ? `${selectedBaseColor.name} + ${selectedTextColor.name}` : selectedColor,
    size: selectedSize,
    personalizedText: customTextForWhatsapp,
  });

  // Parse Images JSON for gallery fallback
  let imageList: string[] = [];
  try {
    imageList = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || [selectedImage]);
  } catch (e) {
    imageList = [product.images || selectedImage];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
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
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full bg-tech-card rounded-2xl border border-tech-border overflow-hidden shadow-2xl">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-mono font-extrabold text-xs px-2.5 py-1 rounded shadow-lg">
                -{discountPercent}% OFF
              </span>
            )}
            {product.personalizationEnabled && (
              <span className="absolute top-4 right-4 bg-tech-accent/90 text-tech-bg font-mono font-extrabold text-xs px-2.5 py-1 rounded shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Personalised</span>
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {imageList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-tech-accent scale-95 shadow-md shadow-tech-accent/20'
                      : 'border-tech-border opacity-70 hover:opacity-100'
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

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 🌟 IN-PAGE 3D PERSONALISATION CUSTOMIZER STUDIO 🌟 */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div className="p-4 sm:p-5 rounded-2xl bg-tech-card border border-tech-border space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-tech-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-tech-accent animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-white font-sans">
                  Custom 3D Personalisation & Name Engraving
                </span>
              </div>

              {!isPersonalizationDefault && (
                <button
                  type="button"
                  onClick={() => setIsPersonalizationActive(!isPersonalizationActive)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
                    isPersonalizationActive
                      ? 'bg-tech-accent text-tech-bg font-bold border-tech-accent'
                      : 'bg-tech-bg text-slate-400 border-tech-border hover:text-white'
                  }`}
                >
                  {isPersonalizationActive ? 'Enabled (Free)' : '+ Add Custom Name'}
                </button>
              )}

              {isPersonalizationDefault && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Included (Free)
                </span>
              )}
            </div>

            {isPersonalizationActive && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 1. Live 3D Embossed Preview Plate */}
                <div className="relative w-full min-h-[140px] bg-gradient-to-b from-[#0b0f19] to-[#04060a] rounded-xl border border-tech-border flex items-center justify-center p-4 overflow-hidden select-none shadow-inner">
                  <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
                  <div className="absolute top-0 inset-x-1/4 h-16 bg-tech-accent/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Keychain / 3D Tag Embossed Assembly */}
                  <div
                    className="relative flex items-center rounded-xl transition-all duration-300 border shadow-[0_16px_32px_-8px_rgba(0,0,0,0.9),0_4px_8px_rgba(0,0,0,0.6)]"
                    style={{
                      backgroundColor: selectedBaseColor.hex,
                      borderColor: selectedBaseColor.border,
                    }}
                  >
                    {/* Keyring Tab */}
                    <div
                      className="w-7 h-10 -ml-1.5 rounded-l-xl flex items-center justify-center border-y border-l shrink-0"
                      style={{
                        backgroundColor: selectedBaseColor.hex,
                        borderColor: selectedBaseColor.border,
                      }}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-[#05080e] border border-slate-400 shadow-inner" />
                    </div>

                    {/* Main Embossed Plate */}
                    <div className="relative px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2.5 min-w-[120px] max-w-[320px]">
                      {/* Converted 3D Picture Emblem */}
                      {uploadedPhoto?.previewUrl && (
                        <div
                          className={`relative shrink-0 rounded-lg overflow-hidden border transition-all duration-300 ${
                            displayText ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-14 h-14 my-0.5'
                          }`}
                          style={{
                            borderColor: selectedTextColor.hex,
                            backgroundColor: selectedBaseColor.hex,
                            boxShadow: `0 2px 6px rgba(0,0,0,0.8), 0 0 8px ${selectedTextColor.glow}`,
                          }}
                        >
                          {/* 3D Print Layer Lines */}
                          <div
                            className="absolute inset-0 z-20 pointer-events-none opacity-25"
                            style={{
                              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.15) 1px, rgba(255,255,255,0.15) 2px)`,
                            }}
                          />

                          {photoStyle === 'EMBOSS' && (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img
                                src={uploadedPhoto.previewUrl}
                                alt="3D Converted Photo"
                                className="w-full h-full object-cover select-none"
                                style={{
                                  filter: `grayscale(100%) contrast(170%) drop-shadow(0 1px 1px rgba(0,0,0,0.8))`,
                                }}
                              />
                              <div
                                className="absolute inset-0 mix-blend-multiply opacity-85 pointer-events-none"
                                style={{ backgroundColor: selectedTextColor.hex }}
                              />
                            </div>
                          )}

                          {photoStyle === 'FULL_COLOR' && (
                            <div className="relative w-full h-full">
                              <img
                                src={uploadedPhoto.previewUrl}
                                alt="3D Photo"
                                className="w-full h-full object-cover select-none"
                              />
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                            </div>
                          )}

                          {photoStyle === 'LITHOPHANE' && (
                            <div className="relative w-full h-full bg-amber-950/40 flex items-center justify-center">
                              <img
                                src={uploadedPhoto.previewUrl}
                                alt="Lithophane"
                                className="w-full h-full object-cover select-none mix-blend-screen opacity-90"
                                style={{
                                  filter: `grayscale(100%) contrast(200%) brightness(120%)`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {displayText && (
                        <span
                          className="font-black font-mono tracking-widest text-sm sm:text-lg md:text-xl uppercase select-none drop-shadow-md truncate relative z-10 transition-colors duration-200"
                          style={{
                            color: selectedTextColor.hex,
                            textShadow: `
                              0 1px 0 rgba(255, 255, 255, 0.4),
                              0 2px 0 rgba(0, 0, 0, 0.6),
                              0 4px 6px rgba(0, 0, 0, 0.9),
                              0 0 12px ${selectedTextColor.glow}
                            `,
                          }}
                        >
                          {displayText}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="absolute bottom-1.5 right-3 text-[9px] font-mono text-slate-500">
                    {uploadedPhoto ? 'Converted 3D Image Active' : 'Live Dual-Extrusion 3D Preview'}
                  </span>
                </div>

                {/* 2. Text Input & Optional Picture Upload Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-7 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-tech-accent" />
                        <span>Custom Text</span>
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

                  {/* Photo / Logo Upload */}
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-tech-accent" />
                        <span>Add Picture</span>
                      </span>
                      <span className="text-[9px] text-cyan-400 font-mono">3D Auto</span>
                    </label>

                    {!uploadedPhoto ? (
                      <label className="border border-dashed border-tech-border hover:border-tech-accent/80 bg-tech-bg rounded-xl px-3 py-2 flex items-center justify-center gap-2 cursor-pointer transition-colors text-slate-300 hover:text-white">
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-mono">Upload Photo</span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.webp,.svg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const previewUrl = URL.createObjectURL(file);
                              setUploadedPhoto({ name: file.name, previewUrl });
                            }
                          }}
                        />
                      </label>
                    ) : (
                      <div className="bg-tech-bg border border-emerald-500/40 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          {uploadedPhoto.previewUrl && (
                            <img
                              src={uploadedPhoto.previewUrl}
                              alt="Upload"
                              className="w-5 h-5 rounded object-cover border border-slate-700 shrink-0"
                            />
                          )}
                          <span className="text-[10px] text-emerald-400 truncate font-mono">
                            {uploadedPhoto.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (uploadedPhoto.previewUrl) URL.revokeObjectURL(uploadedPhoto.previewUrl);
                            setUploadedPhoto(null);
                          }}
                          className="text-slate-400 hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Picture 3D Mode Selector if Photo Attached */}
                {uploadedPhoto && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">3D Render:</span>
                    {(['EMBOSS', 'FULL_COLOR', 'LITHOPHANE'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPhotoStyle(mode)}
                        className={`flex-1 py-1 rounded text-[10px] font-mono border transition-all ${
                          photoStyle === mode
                            ? 'bg-tech-accent text-tech-bg font-bold border-tech-accent'
                            : 'bg-tech-card border-tech-border text-slate-300 hover:text-white'
                        }`}
                      >
                        {mode === 'EMBOSS' ? '⚡ Emboss' : mode === 'FULL_COLOR' ? '🎨 Color' : '💡 Lithophane'}
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Base Color & Raised Text Color Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Base Plate Color */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-tech-accent" />
                      <span>Base Layer: <strong className="text-white">{selectedBaseColor.name.split(' ')[1] || selectedBaseColor.name}</strong></span>
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

                  {/* Raised Text Color */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Palette className="w-3 h-3 text-tech-accent" />
                      <span>Text Layer: <strong className="text-white">{selectedTextColor.name.split(' ')[1] || selectedTextColor.name}</strong></span>
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
            )}
          </div>

          {/* Standard Color Selector (if personalization not active and product has colors) */}
          {!isPersonalizationActive && colorList.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                Available Colors:
              </label>
              <div className="flex flex-wrap gap-2">
                {colorList.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      selectedColor === color
                        ? 'bg-tech-accent/20 border-tech-accent text-tech-accent font-semibold'
                        : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
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

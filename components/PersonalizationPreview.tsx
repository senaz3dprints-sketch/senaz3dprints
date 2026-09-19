'use client';

import React, { useState, useRef } from 'react';
import {
  Type,
  Palette,
  Sparkles,
  MessageCircle,
  Layers,
  Check,
  Shield,
  Upload,
  Plus,
  Minus,
  FileText,
  X,
  Image as ImageIcon,
} from 'lucide-react';

interface PersonalizationPreviewProps {
  initialText?: string;
  colors?: string[];
  showHeroBanner?: boolean;
  onPersonalizationChange?: (data: {
    text: string;
    baseColor?: string;
    textColor?: string;
    color?: string;
    quantity?: number;
    uploadedFileName?: string;
  }) => void;
}

const BASE_COLORS = [
  { name: 'Matte Obsidian Black', hex: '#12161f', border: '#374151', textPreviewColor: '#94a3b8' },
  { name: 'Carbon Stealth Grey', hex: '#1e293b', border: '#475569', textPreviewColor: '#cbd5e1' },
  { name: 'Pure Snow White', hex: '#f8fafc', border: '#cbd5e1', textPreviewColor: '#0f172a' },
  { name: 'Deep Navy Blue', hex: '#0f172a', border: '#2563eb', textPreviewColor: '#93c5fd' },
  { name: 'Racing Crimson Red', hex: '#991b1b', border: '#ef4444', textPreviewColor: '#fca5a5' },
];

const TEXT_COLORS = [
  { name: 'Electric Neon Cyan', hex: '#00e5ff', glow: 'rgba(0, 229, 255, 0.5)' },
  { name: 'Silk Radiant Gold', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
  { name: 'Ruby Flame Red', hex: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' },
  { name: 'Pure Arctic White', hex: '#ffffff', glow: 'rgba(255, 255, 255, 0.5)' },
  { name: 'Vibrant Lime Green', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' },
  { name: 'Sunset Signal Orange', hex: '#f97316', glow: 'rgba(249, 115, 22, 0.5)' },
];

export default function PersonalizationPreview({
  initialText = 'SenAZ 3D',
  showHeroBanner = false,
  onPersonalizationChange,
}: PersonalizationPreviewProps) {
  const [text, setText] = useState(initialText);
  const [selectedBase, setSelectedBase] = useState(BASE_COLORS[0]);
  const [selectedText, setSelectedText] = useState(TEXT_COLORS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; previewUrl?: string } | null>(null);
  const [imageStyle, setImageStyle] = useState<'EMBOSS' | 'FULL_COLOR' | 'LITHOPHANE'>('EMBOSS');
  const [invertEmboss, setInvertEmboss] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (val: string) => {
    const sanitized = val.slice(0, 14);
    setText(sanitized);
    notifyChange(sanitized, selectedBase.name, selectedText.name, quantity, uploadedFile?.name, imageStyle);
  };

  const handleBaseChange = (base: typeof BASE_COLORS[0]) => {
    setSelectedBase(base);
    notifyChange(text, base.name, selectedText.name, quantity, uploadedFile?.name, imageStyle);
  };

  const handleTextColorChange = (textColor: typeof TEXT_COLORS[0]) => {
    setSelectedText(textColor);
    notifyChange(text, selectedBase.name, textColor.name, quantity, uploadedFile?.name, imageStyle);
  };

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, Math.min(500, newQty));
    setQuantity(validQty);
    notifyChange(text, selectedBase.name, selectedText.name, validQty, uploadedFile?.name, imageStyle);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;
      const fileData = { name: file.name, size: `${sizeMb} MB`, previewUrl };
      setUploadedFile(fileData);
      notifyChange(text, selectedBase.name, selectedText.name, quantity, file.name, imageStyle);
    }
  };

  const removeUploadedFile = () => {
    if (uploadedFile?.previewUrl) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    notifyChange(text, selectedBase.name, selectedText.name, quantity, undefined, imageStyle);
  };

  const notifyChange = (t: string, b: string, tc: string, q: number, fn?: string, style?: string) => {
    if (onPersonalizationChange) {
      onPersonalizationChange({
        text: t,
        baseColor: b,
        textColor: tc,
        color: tc,
        quantity: q,
        uploadedFileName: fn ? `${fn} [3D Style: ${style || imageStyle}]` : undefined,
      });
    }
  };

  const displayText = text.trim() ? text.toUpperCase() : (uploadedFile?.previewUrl ? '' : 'YOUR NAME');

  const styleLabel =
    imageStyle === 'EMBOSS'
      ? 'Dual-Tone Filament Emboss'
      : imageStyle === 'FULL_COLOR'
      ? 'Vibrant Full-Color 3D Direct Print'
      : '3D Lithophane Relief';

  const whatsappMessage = encodeURIComponent(
    `Hi SenAZ 3D PRINTS! I would like to order Custom 3D Printed Keychains.\n\n` +
    (displayText ? `• Custom Text: "${displayText}"\n` : '') +
    `• Base Color: ${selectedBase.name}\n` +
    `• Accent Color: ${selectedText.name}\n` +
    `• Order Quantity: ${quantity} unit${quantity > 1 ? 's' : ''}\n` +
    (uploadedFile
      ? `• Custom Image/Design: Attached ("${uploadedFile.name}")\n• 3D Conversion Mode: ${styleLabel}\n`
      : '') +
    `\nPlease share pricing, 3D mockup confirmation, and estimated dispatch time.`
  );

  return (
    <div className="bg-tech-card rounded-2xl border border-tech-border p-6 sm:p-8 lg:p-10 space-y-8 shadow-2xl">
      {/* HEADER SECTION (Unified Banner or Tool Header) */}
      {showHeroBanner ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-tech-border/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalised Name Products & 3D Keychains</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight leading-tight">
              Turn Names & Ideas into Tactile 3D Objects.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Live dual-extrusion preview. Type your custom text, pick layer colors, choose quantity, or upload custom logo files for instant production.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col sm:items-end gap-3 shrink-0">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Interactive 3D Studio
            </span>
            <a
              href="/shop?category=keychains"
              className="px-4 py-2 rounded-lg bg-tech-bg hover:bg-tech-card border border-tech-border hover:border-tech-accent/60 text-slate-300 hover:text-white font-mono text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <span>Browse Catalog</span>
              <span>→</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-tech-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-tech-accent" />
            <div>
              <h4 className="font-bold text-white text-base font-sans tracking-wide">
                Real 3D Keychain Customizer & Order Tool
              </h4>
              <p className="text-xs text-slate-400">Design online or upload custom 2D/3D logo files</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live 3D Render
          </span>
        </div>
      )}

      {/* UNIFIED BALANCED 2-COLUMN STUDIO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 3D Render Canvas + Custom Text Input + Order CTA */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* REAL PHYSICAL KEYCHAIN STUDIO VIEW */}
          <div className="relative w-full min-h-[220px] sm:min-h-[260px] bg-gradient-to-b from-[#0b0f19] to-[#04060a] rounded-xl border border-tech-border flex items-center justify-center p-6 overflow-hidden select-none shadow-inner">
            {/* Studio Background Grid & Spotlights */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
            <div className="absolute top-0 inset-x-1/4 h-28 bg-tech-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Specs tag & Live Converted Badge */}
            <div className="absolute bottom-2.5 left-4 sm:left-6 text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tech-accent" />
              <span>
                {uploadedFile?.previewUrl
                  ? `3D CONVERTED • ${styleLabel.toUpperCase()}`
                  : 'FDM DUAL-EXTRUSION • REINFORCED INFILL'}
              </span>
            </div>

            {uploadedFile?.previewUrl && (
              <div className="absolute top-2.5 right-4 sm:right-6">
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-400/40 flex items-center gap-1.5 shadow-md backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  3D Picture Active
                </span>
              </div>
            )}

            {/* Realistic Keychain Object Floating Assembly */}
            <div className="relative flex items-center pl-2 sm:pl-6 transition-transform duration-300 hover:scale-[1.02]">
              
              {/* 1. REALISTIC CHROME METAL SPLIT-RING & CHAIN ASSEMBLY */}
              <div className="flex items-center -mr-2 z-10 shrink-0">
                {/* Split Keyring */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[5px] border-slate-300 shadow-[0_8px_16px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.7)] bg-gradient-to-tr from-slate-400 via-slate-100 to-slate-300 flex items-center justify-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#070b12] border border-slate-400/80 shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)]" />
                  <div className="absolute top-0 right-3 w-1.5 h-2.5 bg-slate-500/80 rotate-45" />
                </div>

                {/* 3-Link Metal Jump Chain */}
                <div className="flex items-center -space-x-1.5 -ml-1">
                  <div className="w-3.5 h-5 rounded-full border-[2.5px] border-slate-200 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-md rotate-12" />
                  <div className="w-3.5 h-5 rounded-full border-[2.5px] border-slate-200 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-md -rotate-12" />
                  <div className="w-3.5 h-5 rounded-full border-[2.5px] border-slate-200 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-md rotate-6" />
                </div>
              </div>

              {/* 2. REALISTIC 3D PRINTED KEYCHAIN BODY */}
              <div
                className="relative flex items-center rounded-2xl transition-all duration-300 border shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9),0_6px_12px_rgba(0,0,0,0.7)]"
                style={{
                  backgroundColor: selectedBase.hex,
                  borderColor: selectedBase.border,
                }}
              >
                {/* Reinforced Keychain Eyelet Tab */}
                <div
                  className="w-8 sm:w-9 h-12 sm:h-14 -ml-2 rounded-l-2xl flex items-center justify-center border-y border-l shrink-0"
                  style={{
                    backgroundColor: selectedBase.hex,
                    borderColor: selectedBase.border,
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-300 shadow-[inset_0_3px_6px_rgba(0,0,0,0.9),0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#05080e]" />
                  </div>
                </div>

                {/* Main Keychain Body Plate with 3D Textured Surface */}
                <div className="relative px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-3 sm:gap-4 min-w-[140px] max-w-[340px] sm:max-w-[420px]">
                  <div
                    className="absolute inset-0 rounded-r-2xl opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 3px)`,
                    }}
                  />
                  <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/20 rounded-t-2xl" />

                  {/* CONVERTED 3D IMAGE / EMBOSS EMBLEM */}
                  {uploadedFile?.previewUrl && (
                    <div
                      className={`relative shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        displayText ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-20 h-20 sm:w-24 sm:h-24 my-1'
                      }`}
                      style={{
                        borderColor: selectedText.hex,
                        backgroundColor: selectedBase.hex,
                        boxShadow: `0 4px 10px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.4), 0 0 12px ${selectedText.glow}`,
                      }}
                    >
                      {/* 3D Print Extrusion Layer Lines Texture */}
                      <div
                        className="absolute inset-0 z-20 pointer-events-none opacity-30"
                        style={{
                          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1.5px, rgba(255,255,255,0.15) 1.5px, rgba(255,255,255,0.15) 2.5px)`,
                        }}
                      />

                      {/* MODE 1: DUAL-TONE FILAMENT EMBOSS */}
                      {imageStyle === 'EMBOSS' && (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={uploadedFile.previewUrl}
                            alt="3D Embossed Graphic"
                            className="w-full h-full object-cover select-none transition-all duration-200"
                            style={{
                              filter: `grayscale(100%) contrast(180%) brightness(${invertEmboss ? '130%' : '90%'}) ${
                                invertEmboss ? 'invert(100%)' : ''
                              } drop-shadow(0 1px 0 rgba(255,255,255,0.5)) drop-shadow(0 2px 2px rgba(0,0,0,0.9))`,
                            }}
                          />
                          {/* Filament Color Tint Layer */}
                          <div
                            className="absolute inset-0 mix-blend-multiply opacity-80 pointer-events-none"
                            style={{ backgroundColor: selectedText.hex }}
                          />
                          <div
                            className="absolute inset-0 mix-blend-color opacity-70 pointer-events-none"
                            style={{ backgroundColor: selectedText.hex }}
                          />
                        </div>
                      )}

                      {/* MODE 2: FULL-COLOR 3D DIRECT PRINT */}
                      {imageStyle === 'FULL_COLOR' && (
                        <div className="relative w-full h-full">
                          <img
                            src={uploadedFile.previewUrl}
                            alt="Full Color 3D Print"
                            className="w-full h-full object-cover select-none"
                          />
                          {/* 3D Resin Protective Gloss Specular Sheen */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                        </div>
                      )}

                      {/* MODE 3: 3D LITHOPHANE RELIEF */}
                      {imageStyle === 'LITHOPHANE' && (
                        <div className="relative w-full h-full bg-amber-950/40 flex items-center justify-center">
                          {/* Translucent Backlight Glow */}
                          <div className="absolute inset-0 bg-amber-200/30 blur-sm pointer-events-none" />
                          <img
                            src={uploadedFile.previewUrl}
                            alt="3D Lithophane Relief"
                            className="w-full h-full object-cover select-none mix-blend-screen opacity-90"
                            style={{
                              filter: `grayscale(100%) contrast(200%) brightness(120%) drop-shadow(0 0 6px rgba(253,230,138,0.7))`,
                            }}
                          />
                        </div>
                      )}

                      {/* Embossed Corner Bevel Accents */}
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/60 pointer-events-none z-30" />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/60 pointer-events-none z-30" />
                      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/60 pointer-events-none z-30" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/60 pointer-events-none z-30" />
                    </div>
                  )}

                  {/* RAISED 3D EMBOSSED TEXT */}
                  {displayText && (
                    <span
                      className="font-black font-mono tracking-widest text-base sm:text-xl md:text-2xl uppercase select-none drop-shadow-lg truncate relative z-10 transition-colors duration-200"
                      style={{
                        color: selectedText.hex,
                        textShadow: `
                          0 1px 0 rgba(255, 255, 255, 0.4),
                          0 2px 0 rgba(0, 0, 0, 0.5),
                          0 3px 0 rgba(0, 0, 0, 0.7),
                          0 5px 8px rgba(0, 0, 0, 0.9),
                          0 0 16px ${selectedText.glow}
                        `,
                      }}
                    >
                      {displayText}
                    </span>
                  )}

                  <div
                    className="absolute inset-x-0 bottom-0 h-1.5 rounded-b-2xl opacity-80"
                    style={{
                      backgroundColor: selectedText.hex,
                      boxShadow: `0 0 10px ${selectedText.glow}`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* 1. Custom Text Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
                <Type className="w-4 h-4 text-tech-accent" /> 1. Custom Text / Name
              </span>
              <span className="text-xs text-slate-400 font-mono font-semibold">{text.length}/14 Characters</span>
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="e.g. SENAZ 3D, MILAN, VIP-01"
              className="w-full bg-tech-bg border border-tech-border rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-tech-accent font-mono tracking-wider shadow-inner"
              maxLength={14}
            />
          </div>

          {/* Direct WhatsApp Order Button + Guarantee */}
          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/918761053230?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-emerald-950/50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Order on WhatsApp ({quantity} unit{quantity > 1 ? 's' : ''})</span>
            </a>

            <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2 text-center">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Includes stainless steel split keyring & jump chain • Pan-India Dispatch</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Color Selectors + Quantity Selector + Design Upload */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 2. Base Color Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
                <Layers className="w-4 h-4 text-tech-accent" /> 2. Keychain Base Color
              </label>
              <span className="text-[11px] font-mono font-semibold text-tech-accent bg-tech-bg px-2.5 py-0.5 rounded border border-tech-border">
                {selectedBase.name}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BASE_COLORS.map((base) => {
                const isSelected = selectedBase.name === base.name;
                return (
                  <button
                    key={base.name}
                    type="button"
                    onClick={() => handleBaseChange(base)}
                    className={`p-2.5 rounded-xl text-xs font-sans font-semibold border flex items-center gap-2.5 transition-all text-left shadow-sm ${
                      isSelected
                        ? 'bg-tech-accent/15 border-tech-accent text-white ring-1 ring-tech-accent'
                        : 'bg-tech-bg/90 border-tech-border text-slate-300 hover:border-slate-500 hover:bg-tech-card'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-400 shadow-sm shrink-0"
                      style={{ backgroundColor: base.hex }}
                    />
                    <span className="truncate">{base.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-tech-accent ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Raised Text Color Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
                <Palette className="w-4 h-4 text-tech-accent" /> 3. Raised Text & Accent Color
              </label>
              <span className="text-[11px] font-mono font-semibold text-tech-accent bg-tech-bg px-2.5 py-0.5 rounded border border-tech-border">
                {selectedText.name}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TEXT_COLORS.map((tc) => {
                const isSelected = selectedText.name === tc.name;
                return (
                  <button
                    key={tc.name}
                    type="button"
                    onClick={() => handleTextColorChange(tc)}
                    className={`p-2.5 rounded-xl text-xs font-sans font-semibold border flex items-center gap-2.5 transition-all text-left shadow-sm ${
                      isSelected
                        ? 'bg-tech-accent/15 border-tech-accent text-white ring-1 ring-tech-accent'
                        : 'bg-tech-bg/90 border-tech-border text-slate-300 hover:border-slate-500 hover:bg-tech-card'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-400 shadow-sm shrink-0"
                      style={{ backgroundColor: tc.hex }}
                    />
                    <span className="truncate">{tc.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-tech-accent ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Order Quantity & 5. Custom Design File Upload Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* Order Quantity */}
            <div className="bg-tech-bg/90 border border-tech-border p-3.5 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Quantity
                </span>
                <span className="text-[10px] font-mono text-slate-400">Bulk packs</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent flex items-center justify-center text-white disabled:opacity-40 transition-colors shrink-0"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1 bg-tech-card border border-tech-border rounded-lg py-1 px-2 text-center">
                  <span className="font-mono font-bold text-sm text-white block">
                    {quantity} {quantity === 1 ? 'Unit' : 'Units'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 500}
                  className="w-8 h-8 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent flex items-center justify-center text-white transition-colors shrink-0"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 pt-0.5">
                {[1, 5, 10, 25, 50].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => handleQuantityChange(qty)}
                    className={`flex-1 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      quantity === qty
                        ? 'bg-tech-accent text-tech-bg font-bold border-tech-accent'
                        : 'bg-tech-card border-tech-border text-slate-400 hover:text-white'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Keychain Design Upload & 3D Conversion Engine */}
            <div className="bg-tech-bg/90 border border-tech-border p-3.5 rounded-xl space-y-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-tech-accent" /> Upload Picture / Logo
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Auto 3D Converted</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg,.stl,.obj,.3mf"
                onChange={handleFileUpload}
                className="hidden"
                id="keychain-design-uploader"
              />

              {!uploadedFile ? (
                <label
                  htmlFor="keychain-design-uploader"
                  className="border-2 border-dashed border-tech-border hover:border-tech-accent/80 bg-tech-card/50 rounded-lg p-2.5 flex flex-col items-center justify-center cursor-pointer transition-colors group text-center flex-1"
                >
                  <Upload className="w-4 h-4 text-slate-400 group-hover:text-tech-accent mb-0.5 transition-colors" />
                  <span className="text-[11px] font-semibold text-slate-200">Upload Photo / Logo</span>
                  <span className="text-[9px] text-slate-400 font-mono">Converts into 3D embossed print</span>
                </label>
              ) : (
                <div className="space-y-2.5">
                  <div className="bg-tech-card border border-emerald-500/40 rounded-lg p-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {uploadedFile.previewUrl ? (
                        <img
                          src={uploadedFile.previewUrl}
                          alt="Uploaded Preview"
                          className="w-8 h-8 rounded object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-semibold text-white truncate">{uploadedFile.name}</p>
                        <p className="text-[9px] font-mono text-emerald-400">
                          {uploadedFile.previewUrl ? '✨ Converted to 3D' : `${uploadedFile.size} • Ready`}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeUploadedFile}
                      className="p-1 rounded hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 3D Conversion Style Switcher for Image */}
                  {uploadedFile.previewUrl && (
                    <div className="space-y-1.5 pt-1 border-t border-tech-border/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold text-slate-300">
                          3D Convert Mode:
                        </span>
                        {imageStyle === 'EMBOSS' && (
                          <button
                            type="button"
                            onClick={() => setInvertEmboss(!invertEmboss)}
                            className="text-[9px] font-mono text-tech-accent hover:underline flex items-center gap-1"
                          >
                            <span>Invert {invertEmboss ? 'On' : 'Off'}</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setImageStyle('EMBOSS');
                            notifyChange(text, selectedBase.name, selectedText.name, quantity, uploadedFile.name, 'EMBOSS');
                          }}
                          className={`py-1 px-1 rounded text-[9px] font-mono border transition-all text-center ${
                            imageStyle === 'EMBOSS'
                              ? 'bg-tech-accent text-tech-bg font-bold border-tech-accent shadow-sm'
                              : 'bg-tech-card border-tech-border text-slate-300 hover:text-white'
                          }`}
                        >
                          ⚡ 3D Emboss
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageStyle('FULL_COLOR');
                            notifyChange(text, selectedBase.name, selectedText.name, quantity, uploadedFile.name, 'FULL_COLOR');
                          }}
                          className={`py-1 px-1 rounded text-[9px] font-mono border transition-all text-center ${
                            imageStyle === 'FULL_COLOR'
                              ? 'bg-tech-accent text-tech-bg font-bold border-tech-accent shadow-sm'
                              : 'bg-tech-card border-tech-border text-slate-300 hover:text-white'
                          }`}
                        >
                          🎨 Full Color
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageStyle('LITHOPHANE');
                            notifyChange(text, selectedBase.name, selectedText.name, quantity, uploadedFile.name, 'LITHOPHANE');
                          }}
                          className={`py-1 px-1 rounded text-[9px] font-mono border transition-all text-center ${
                            imageStyle === 'LITHOPHANE'
                              ? 'bg-tech-accent text-tech-bg font-bold border-tech-accent shadow-sm'
                              : 'bg-tech-card border-tech-border text-slate-300 hover:text-white'
                          }`}
                        >
                          💡 Lithophane
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}




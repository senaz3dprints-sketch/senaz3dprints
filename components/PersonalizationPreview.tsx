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
  RotateCcw,
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
  { name: 'Pure Arctic White', hex: '#ffffff', glow: 'rgba(255, 255, 255, 0.5)' },
  { name: 'Ruby Flame Red', hex: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' },
  { name: 'Vibrant Lime Green', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' },
  { name: 'Sunset Signal Orange', hex: '#f97316', glow: 'rgba(249, 115, 22, 0.5)' },
];

const SAMPLE_PHOTO = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';

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
  const [imageStyle, setImageStyle] = useState<'EMBOSS' | 'LITHOPHANE' | 'FULL_COLOR'>('EMBOSS');
  const [invertEmboss, setInvertEmboss] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (val: string) => {
    const sanitized = val.slice(0, 24);
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

  const displayText = text.trim();
  const activeImage = uploadedFile?.previewUrl || SAMPLE_PHOTO;
  const isSample = !uploadedFile?.previewUrl;

  const styleLabel =
    imageStyle === 'EMBOSS'
      ? 'Dual-Tone Filament Emboss'
      : imageStyle === 'LITHOPHANE'
      ? '3D Glowing Lithophane Relief'
      : 'Vibrant Full-Color 3D Plaque';

  const whatsappMessage = encodeURIComponent(
    `Hi SenAZ 3D PRINTS! I would like to order a Custom 3D Photo Plaque / Lithophane.\n\n` +
    `• 3D Render Style: ${styleLabel}\n` +
    (displayText ? `• Custom Inscribed Caption: "${displayText}"\n` : '') +
    `• Frame/Base Color: ${selectedBase.name}\n` +
    `• Accent/Text Color: ${selectedText.name}\n` +
    `• Order Quantity: ${quantity} unit${quantity > 1 ? 's' : ''}\n` +
    (uploadedFile
      ? `• Attached Photo/Image: Yes ("${uploadedFile.name}")\n`
      : `• Photo to Print: Will share on chat\n`) +
    `\nPlease share pricing, 3D render preview confirmation, and estimated dispatch time.`
  );

  return (
    <div className="bg-tech-card rounded-2xl border border-tech-border p-6 sm:p-8 lg:p-10 space-y-8 shadow-2xl">
      {/* HEADER SECTION */}
      {showHeroBanner ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-tech-border/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalised 3D Photo & Lithophane Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight leading-tight">
              Turn Photos & Memories into Tactile 3D Objects.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Upload your photo, portrait, couple memory, or company logo. Our live 3D engine converts it into an embossed filament relief plaque, illuminated lithophane, or custom textured desktop frame.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col sm:items-end gap-3 shrink-0">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 px-3.5 py-1.5 rounded-full border border-cyan-500/30 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Live 3D Photo Conversion
            </span>
            <a
              href="/custom-printing"
              className="px-4 py-2 rounded-lg bg-tech-bg hover:bg-tech-card border border-tech-border hover:border-tech-accent/60 text-slate-300 hover:text-white font-mono text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <span>Custom 3D Request</span>
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
                Live 3D Photo & Image Personalisation Studio
              </h4>
              <p className="text-xs text-slate-400">Convert any image into a 3D embossed plaque or lithophane</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Interactive 3D Engine
          </span>
        </div>
      )}

      {/* 2-COLUMN STUDIO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 3D Plaque / Lithophane Object Canvas & Quick Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* REAL PHYSICAL 3D PHOTO PLAQUE / LITHOPHANE DESK STAND */}
          <div className="relative w-full min-h-[340px] sm:min-h-[400px] bg-gradient-to-b from-[#0b0f19] via-[#070b14] to-[#04060a] rounded-2xl border border-tech-border flex flex-col items-center justify-center p-6 overflow-hidden select-none shadow-2xl">
            {/* Studio Background Grid & Spotlights */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
            <div className="absolute top-0 inset-x-1/4 h-36 bg-tech-accent/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Status Badges */}
            <div className="absolute top-3 inset-x-4 sm:inset-x-6 flex items-center justify-between z-30 pointer-events-none">
              <span className="text-[10px] font-mono text-slate-400 bg-tech-bg/90 px-2.5 py-1 rounded-full border border-tech-border flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-tech-accent animate-pulse" />
                <span>{styleLabel}</span>
              </span>

              {uploadedFile?.previewUrl ? (
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5 shadow-md">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Custom Photo Converted</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/70 px-2.5 py-1 rounded-full border border-amber-500/30">
                  Sample Preview • Upload Yours
                </span>
              )}
            </div>

            {/* 3D FLOATING DESK PLAQUE / LITHOPHANE ASSEMBLY */}
            <div className="relative flex flex-col items-center pt-8 pb-4 transition-transform duration-300 hover:scale-[1.02] z-10 max-w-[320px] sm:max-w-[360px] w-full">
              
              {/* 1. 3D FRAMED PHOTO / LITHOPHANE BODY */}
              <div
                className="relative w-full rounded-2xl p-3 sm:p-4 border-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95),0_8px_16px_rgba(0,0,0,0.8)] transition-all duration-300 flex flex-col items-center"
                style={{
                  backgroundColor: selectedBase.hex,
                  borderColor: selectedBase.border,
                }}
              >
                {/* 3D Top Bevel Highlight */}
                <div className="absolute inset-x-3 top-0 h-[1.5px] bg-white/25 rounded-t-xl" />

                {/* 3D Frame Corner Accents */}
                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl" />
                <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-white/40 rounded-tr" />
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-white/40 rounded-bl" />
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br" />

                {/* THE CONVERTED 3D PHOTO CANVAS */}
                <div
                  className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 shadow-inner transition-all duration-300 flex items-center justify-center group"
                  style={{
                    borderColor: selectedText.hex,
                    backgroundColor: '#070b12',
                    boxShadow: `inset 0 4px 12px rgba(0,0,0,0.9), 0 0 16px ${selectedText.glow}`,
                  }}
                >
                  {/* FDM Print Slicing Layer Texture */}
                  <div
                    className="absolute inset-0 z-20 pointer-events-none opacity-25"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1.5px, rgba(255,255,255,0.15) 1.5px, rgba(255,255,255,0.15) 2.5px)`,
                    }}
                  />

                  {/* MODE 1: DUAL-TONE FILAMENT EMBOSS */}
                  {imageStyle === 'EMBOSS' && (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <img
                        src={activeImage}
                        alt="3D Embossed Photo"
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{
                          filter: `grayscale(100%) contrast(190%) brightness(${invertEmboss ? '135%' : '90%'}) ${
                            invertEmboss ? 'invert(100%)' : ''
                          } drop-shadow(0 -1px 0 rgba(255,255,255,0.5)) drop-shadow(0 3px 4px rgba(0,0,0,0.95))`,
                        }}
                      />
                      {/* Filament Tint Layers */}
                      <div
                        className="absolute inset-0 mix-blend-multiply opacity-85 pointer-events-none"
                        style={{ backgroundColor: selectedText.hex }}
                      />
                      <div
                        className="absolute inset-0 mix-blend-color opacity-70 pointer-events-none"
                        style={{ backgroundColor: selectedText.hex }}
                      />
                    </div>
                  )}

                  {/* MODE 2: 3D GLOWING LITHOPHANE */}
                  {imageStyle === 'LITHOPHANE' && (
                    <div className="relative w-full h-full bg-[#181108] flex items-center justify-center overflow-hidden">
                      {/* Backlight Internal Light Aura */}
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-400/40 via-amber-200/30 to-amber-500/20 blur-md pointer-events-none" />
                      <img
                        src={activeImage}
                        alt="3D Lithophane Relief"
                        className="w-full h-full object-cover select-none mix-blend-screen opacity-95 transition-all duration-300"
                        style={{
                          filter: `grayscale(100%) contrast(220%) brightness(120%) drop-shadow(0 0 10px rgba(253,230,138,0.8))`,
                        }}
                      />
                      {/* Backlit Diffuser Border */}
                      <div className="absolute inset-0 border border-amber-300/40 pointer-events-none" />
                    </div>
                  )}

                  {/* MODE 3: FULL-COLOR 3D DIRECT PRINT */}
                  {imageStyle === 'FULL_COLOR' && (
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={activeImage}
                        alt="Full Color 3D Plaque"
                        className="w-full h-full object-cover select-none transition-all duration-300"
                      />
                      {/* Resin Specular Gloss Highlight */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Click to upload overlay if sample */}
                  {isSample && (
                    <label
                      htmlFor="photo-studio-file-input"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer z-30 text-white gap-2 text-center p-4 backdrop-blur-xs"
                    >
                      <Upload className="w-6 h-6 text-tech-accent animate-bounce" />
                      <span className="text-xs font-bold">Click to Upload Your Photo</span>
                      <span className="text-[10px] text-slate-300 font-mono">Converts into 3D instantly</span>
                    </label>
                  )}
                </div>

                {/* CUSTOM INSCRIBED 3D TEXT CAPTION (If Text Entered) */}
                {displayText && (
                  <div className="w-full mt-3 pt-2.5 border-t border-white/10 flex items-center justify-center">
                    <span
                      className="font-black font-mono tracking-widest text-xs sm:text-sm md:text-base uppercase select-none drop-shadow-lg truncate relative z-10 transition-colors duration-200 text-center"
                      style={{
                        color: selectedText.hex,
                        textShadow: `
                          0 1px 0 rgba(255, 255, 255, 0.4),
                          0 2px 0 rgba(0, 0, 0, 0.6),
                          0 4px 6px rgba(0, 0, 0, 0.9),
                          0 0 12px ${selectedText.glow}
                        `,
                      }}
                    >
                      {displayText}
                    </span>
                  </div>
                )}
              </div>

              {/* 2. REALISTIC 3D DESK STAND FEET / PEDESTAL */}
              <div className="relative w-3/4 flex items-center justify-between -mt-1 z-0 px-4">
                {/* Left Angled Stand Foot */}
                <div
                  className="w-10 h-3 rounded-b-lg border-b-2 border-x shadow-lg transform -skew-x-12"
                  style={{
                    backgroundColor: selectedBase.hex,
                    borderColor: selectedBase.border,
                  }}
                />
                {/* Center Support Shadow */}
                <div className="flex-1 h-1.5 bg-black/60 blur-xs mx-1" />
                {/* Right Angled Stand Foot */}
                <div
                  className="w-10 h-3 rounded-b-lg border-b-2 border-x shadow-lg transform skew-x-12"
                  style={{
                    backgroundColor: selectedBase.hex,
                    borderColor: selectedBase.border,
                  }}
                />
              </div>

            </div>

            {/* Bottom Specs Line */}
            <div className="absolute bottom-2.5 left-4 sm:left-6 text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tech-accent" />
              <span>HIGH-PRECISION TACTILE 3D PRINT • DESK DISPLAY STAND INCLUDED</span>
            </div>
          </div>

          {/* Direct WhatsApp Order Button + Guarantee */}
          <div className="space-y-3 pt-1">
            <a
              href={`https://wa.me/918761053230?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-emerald-950/50 hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Order Custom 3D Photo on WhatsApp ({quantity} unit{quantity > 1 ? 's' : ''})</span>
            </a>

            <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2 text-center">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>3D Mockup Preview Sent Before Printing • Safe All-India Shipping</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Upload Image + 3D Render Styles + Inscription + Colors + Quantity */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 1. UPLOAD PHOTO / LOGO SECTION */}
          <div className="space-y-2.5 bg-tech-bg/90 border border-tech-border p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
                <Upload className="w-4 h-4 text-tech-accent" /> 1. Upload Your Photo / Image
              </label>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                Instant 3D Conversion
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg,.stl,.obj"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-studio-file-input"
            />

            {!uploadedFile ? (
              <label
                htmlFor="photo-studio-file-input"
                className="border-2 border-dashed border-tech-border hover:border-tech-accent/80 bg-tech-card/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group text-center space-y-1.5"
              >
                <div className="w-10 h-10 rounded-full bg-tech-accent/10 border border-tech-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-tech-accent" />
                </div>
                <p className="text-xs font-bold text-white">Click or Drag to Upload Picture</p>
                <p className="text-[10px] text-slate-400 font-mono">Supports JPG, PNG, WEBP, SVG, STL (Up to 25MB)</p>
              </label>
            ) : (
              <div className="bg-tech-card border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  {uploadedFile.previewUrl ? (
                    <img
                      src={uploadedFile.previewUrl}
                      alt="Uploaded Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{uploadedFile.name}</p>
                    <p className="text-[10px] font-mono text-emerald-400">
                      {uploadedFile.size} • Converted to 3D Preview
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label
                    htmlFor="photo-studio-file-input"
                    className="px-2.5 py-1 rounded bg-tech-bg hover:bg-slate-800 text-[10px] font-mono text-slate-300 hover:text-white border border-tech-border cursor-pointer transition-colors"
                  >
                    Change
                  </label>
                  <button
                    type="button"
                    onClick={removeUploadedFile}
                    className="p-1.5 rounded hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. SELECT 3D CONVERSION STYLE */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-tech-accent" /> 2. 3D Render & Printing Style
              </label>
              {imageStyle === 'EMBOSS' && (
                <button
                  type="button"
                  onClick={() => setInvertEmboss(!invertEmboss)}
                  className="text-[10px] font-mono text-tech-accent hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Invert Contrast: {invertEmboss ? 'ON' : 'OFF'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Style 1: 3D Emboss */}
              <button
                type="button"
                onClick={() => {
                  setImageStyle('EMBOSS');
                  notifyChange(text, selectedBase.name, selectedText.name, quantity, uploadedFile?.name, 'EMBOSS');
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  imageStyle === 'EMBOSS'
                    ? 'bg-tech-accent/15 border-tech-accent ring-1 ring-tech-accent'
                    : 'bg-tech-bg/90 border-tech-border hover:border-slate-500 hover:bg-tech-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">⚡</span>
                  {imageStyle === 'EMBOSS' && <Check className="w-3.5 h-3.5 text-tech-accent" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-sans">3D Filament Emboss</p>
                  <p className="text-[10px] text-slate-400 font-mono">Raised dual-layer relief</p>
                </div>
              </button>

              {/* Style 2: Lithophane */}
              <button
                type="button"
                onClick={() => {
                  setImageStyle('LITHOPHANE');
                  notifyChange(text, selectedBase.name, selectedText.name, quantity, uploadedFile?.name, 'LITHOPHANE');
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  imageStyle === 'LITHOPHANE'
                    ? 'bg-tech-accent/15 border-tech-accent ring-1 ring-tech-accent'
                    : 'bg-tech-bg/90 border-tech-border hover:border-slate-500 hover:bg-tech-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">💡</span>
                  {imageStyle === 'LITHOPHANE' && <Check className="w-3.5 h-3.5 text-tech-accent" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-sans">Glowing Lithophane</p>
                  <p className="text-[10px] text-slate-400 font-mono">Backlit 3D translucent photo</p>
                </div>
              </button>

              {/* Style 3: Full Color Print */}
              <button
                type="button"
                onClick={() => {
                  setImageStyle('FULL_COLOR');
                  notifyChange(text, selectedBase.name, selectedText.name, quantity, uploadedFile?.name, 'FULL_COLOR');
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  imageStyle === 'FULL_COLOR'
                    ? 'bg-tech-accent/15 border-tech-accent ring-1 ring-tech-accent'
                    : 'bg-tech-bg/90 border-tech-border hover:border-slate-500 hover:bg-tech-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">🎨</span>
                  {imageStyle === 'FULL_COLOR' && <Check className="w-3.5 h-3.5 text-tech-accent" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-white font-sans">Full Color 3D Plaque</p>
                  <p className="text-[10px] text-slate-400 font-mono">UV color + tactile border</p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. CUSTOM INSCRIBED TEXT / CAPTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-200 flex items-center gap-1.5 font-bold">
                <Type className="w-4 h-4 text-tech-accent" /> 3. Inscribed Caption / Name (Optional)
              </label>
              <span className="text-xs text-slate-400 font-mono font-semibold">{text.length}/24 Chars</span>
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="e.g. SENAZ 3D, MILAN & RIYA, EST. 2024"
              className="w-full bg-tech-bg border border-tech-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-tech-accent font-mono tracking-wider shadow-inner"
              maxLength={24}
            />
          </div>

          {/* 4. BASE FRAME COLOR & ACCENT FILAMENT COLOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Base Frame Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1 font-bold text-white text-xs">
                  <Layers className="w-3.5 h-3.5 text-tech-accent" /> Frame / Base
                </label>
                <span className="text-[10px] font-mono text-tech-accent truncate max-w-[100px]">
                  {selectedBase.name.split(' ')[1] || selectedBase.name}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {BASE_COLORS.map((base) => (
                  <button
                    key={base.name}
                    type="button"
                    onClick={() => handleBaseChange(base)}
                    className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                      selectedBase.name === base.name
                        ? 'border-tech-accent scale-105 ring-1 ring-tech-accent'
                        : 'border-tech-border opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: base.hex }}
                    title={base.name}
                  >
                    {selectedBase.name === base.name && <Check className="w-3.5 h-3.5 text-tech-accent" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent / Text Filament Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1 font-bold text-white text-xs">
                  <Palette className="w-3.5 h-3.5 text-tech-accent" /> Relief & Accent
                </label>
                <span className="text-[10px] font-mono text-tech-accent truncate max-w-[100px]">
                  {selectedText.name.split(' ')[1] || selectedText.name}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {TEXT_COLORS.map((tc) => (
                  <button
                    key={tc.name}
                    type="button"
                    onClick={() => handleTextColorChange(tc)}
                    className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                      selectedText.name === tc.name
                        ? 'border-tech-accent scale-105 ring-1 ring-tech-accent'
                        : 'border-tech-border opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: tc.hex }}
                    title={tc.name}
                  >
                    {selectedText.name === tc.name && <Check className="w-3.5 h-3.5 text-black" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. QUANTITY SELECTOR */}
          <div className="bg-tech-bg/90 border border-tech-border p-3.5 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Order Quantity
              </span>
              <span className="text-[10px] font-mono text-slate-400">Plaque & Desk Stand Pack</span>
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
                  {quantity} {quantity === 1 ? 'Plaque Unit' : 'Plaque Units'}
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

            <div className="flex items-center gap-1.5 pt-0.5">
              {[1, 2, 5, 10, 25].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handleQuantityChange(qty)}
                  className={`flex-1 py-1 rounded text-[10px] font-mono border transition-all ${
                    quantity === qty
                      ? 'bg-tech-accent text-tech-bg font-bold border-tech-accent'
                      : 'bg-tech-card border-tech-border text-slate-400 hover:text-white'
                  }`}
                >
                  {qty} {qty === 1 ? 'pc' : 'pcs'}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}




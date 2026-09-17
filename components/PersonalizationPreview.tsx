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
  onPersonalizationChange,
}: PersonalizationPreviewProps) {
  const [text, setText] = useState(initialText);
  const [selectedBase, setSelectedBase] = useState(BASE_COLORS[0]);
  const [selectedText, setSelectedText] = useState(TEXT_COLORS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; previewUrl?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (val: string) => {
    const sanitized = val.slice(0, 14);
    setText(sanitized);
    notifyChange(sanitized, selectedBase.name, selectedText.name, quantity, uploadedFile?.name);
  };

  const handleBaseChange = (base: typeof BASE_COLORS[0]) => {
    setSelectedBase(base);
    notifyChange(text, base.name, selectedText.name, quantity, uploadedFile?.name);
  };

  const handleTextColorChange = (textColor: typeof TEXT_COLORS[0]) => {
    setSelectedText(textColor);
    notifyChange(text, selectedBase.name, textColor.name, quantity, uploadedFile?.name);
  };

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, Math.min(500, newQty));
    setQuantity(validQty);
    notifyChange(text, selectedBase.name, selectedText.name, validQty, uploadedFile?.name);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;
      const fileData = { name: file.name, size: `${sizeMb} MB`, previewUrl };
      setUploadedFile(fileData);
      notifyChange(text, selectedBase.name, selectedText.name, quantity, file.name);
    }
  };

  const removeUploadedFile = () => {
    if (uploadedFile?.previewUrl) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    notifyChange(text, selectedBase.name, selectedText.name, quantity, undefined);
  };

  const notifyChange = (t: string, b: string, tc: string, q: number, fn?: string) => {
    if (onPersonalizationChange) {
      onPersonalizationChange({
        text: t,
        baseColor: b,
        textColor: tc,
        color: tc,
        quantity: q,
        uploadedFileName: fn,
      });
    }
  };

  const displayText = text.trim() ? text.toUpperCase() : 'YOUR NAME';

  const whatsappMessage = encodeURIComponent(
    `Hi SenAZ 3D PRINTS! I would like to order Custom 3D Printed Keychains.\n\n` +
    `• Custom Text: "${displayText}"\n` +
    `• Base Color: ${selectedBase.name}\n` +
    `• Text Color: ${selectedText.name}\n` +
    `• Order Quantity: ${quantity} unit${quantity > 1 ? 's' : ''}\n` +
    (uploadedFile ? `• Custom Logo/Design Attached: Yes ("${uploadedFile.name}")\n` : '') +
    `\nPlease share pricing, mockup confirmation, and estimated dispatch time.`
  );

  return (
    <div className="bg-tech-card rounded-2xl border border-tech-border p-5 sm:p-7 space-y-6 shadow-2xl">
      {/* Header */}
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

      {/* REAL PHYSICAL KEYCHAIN STUDIO VIEW */}
      <div className="relative w-full min-h-[230px] sm:min-h-[250px] bg-gradient-to-b from-[#0b0f19] to-[#04060a] rounded-xl border border-tech-border flex items-center justify-center p-6 overflow-hidden select-none">
        
        {/* Studio Background Grid & Spotlights */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-0 inset-x-1/4 h-28 bg-tech-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Specs tag */}
        <div className="absolute bottom-2.5 left-4 sm:left-6 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tech-accent" />
          <span>FDM DUAL-EXTRUSION • REINFORCED INFILL</span>
        </div>

        {/* Realistic Keychain Object Floating Assembly */}
        <div className="relative flex items-center pl-4 sm:pl-8 transition-transform duration-300 hover:scale-[1.02]">
          
          {/* 1. REALISTIC CHROME METAL SPLIT-RING & CHAIN ASSEMBLY */}
          <div className="flex items-center -mr-2 z-10 shrink-0">
            {/* Split Keyring */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[5px] border-slate-300 shadow-[0_8px_16px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.7)] bg-gradient-to-tr from-slate-400 via-slate-100 to-slate-300 flex items-center justify-center">
              {/* Inner hole */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#070b12] border border-slate-400/80 shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)]" />
              {/* Metallic Split Cut Line */}
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
              {/* Eyelet Metal Eye Ring & Hole */}
              <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-300 shadow-[inset_0_3px_6px_rgba(0,0,0,0.9),0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#05080e]" />
              </div>
            </div>

            {/* Main Keychain Body Plate with 3D Textured Surface */}
            <div className="relative px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center min-w-[150px] max-w-[280px] sm:max-w-[360px]">
              
              {/* Subtle 3D Layer Lines Simulation Texture */}
              <div
                className="absolute inset-0 rounded-r-2xl opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 3px)`,
                }}
              />

              {/* Chamfered Top Bevel Highlight */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/20 rounded-t-2xl" />

              {/* RAISED 3D EMBOSSED TEXT WITH MULTI-TIER REALISTIC LIGHTING */}
              <span
                className="font-black font-mono tracking-widest text-lg sm:text-2xl uppercase select-none drop-shadow-lg truncate relative z-10 transition-colors duration-200"
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

              {/* Bottom 3D Filament Extrusion Edge */}
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

      {/* CONTROLS */}
      <div className="space-y-6 pt-2">
        
        {/* 1. Custom Text Input */}
        <div>
          <label className="block text-xs font-mono text-slate-200 mb-1.5 flex items-center justify-between">
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

        {/* 2. Base Color Selection - WITH CLEAR, FULL NAMES */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
              <Layers className="w-4 h-4 text-tech-accent" /> 2. Keychain Base Color
            </label>
            <span className="text-xs font-mono font-semibold text-tech-accent bg-tech-bg px-2.5 py-0.5 rounded border border-tech-border">
              Active: {selectedBase.name}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {BASE_COLORS.map((base) => {
              const isSelected = selectedBase.name === base.name;
              return (
                <button
                  key={base.name}
                  type="button"
                  onClick={() => handleBaseChange(base)}
                  className={`p-2.5 rounded-xl text-xs font-sans font-semibold border flex items-center gap-3 transition-all text-left shadow-sm ${
                    isSelected
                      ? 'bg-tech-accent/15 border-tech-accent text-white ring-1 ring-tech-accent'
                      : 'bg-tech-bg/90 border-tech-border text-slate-300 hover:border-slate-500 hover:bg-tech-card'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border-2 border-slate-400 shadow-sm shrink-0"
                    style={{ backgroundColor: base.hex }}
                  />
                  <span className="truncate">{base.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-tech-accent ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Raised Text Color Selection - WITH CLEAR, FULL NAMES */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 font-bold text-white text-xs sm:text-sm">
              <Palette className="w-4 h-4 text-tech-accent" /> 3. Raised Text & Accent Color
            </label>
            <span className="text-xs font-mono font-semibold text-tech-accent bg-tech-bg px-2.5 py-0.5 rounded border border-tech-border">
              Active: {selectedText.name}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {TEXT_COLORS.map((tc) => {
              const isSelected = selectedText.name === tc.name;
              return (
                <button
                  key={tc.name}
                  type="button"
                  onClick={() => handleTextColorChange(tc)}
                  className={`p-2.5 rounded-xl text-xs font-sans font-semibold border flex items-center gap-3 transition-all text-left shadow-sm ${
                    isSelected
                      ? 'bg-tech-accent/15 border-tech-accent text-white ring-1 ring-tech-accent'
                      : 'bg-tech-bg/90 border-tech-border text-slate-300 hover:border-slate-500 hover:bg-tech-card'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border-2 border-slate-400 shadow-sm shrink-0"
                    style={{ backgroundColor: tc.hex }}
                  />
                  <span className="truncate">{tc.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-tech-accent ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Quantity Selector & 5. Custom Design File Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-tech-border/80">
          
          {/* Order Quantity Counter */}
          <div className="bg-tech-bg/80 border border-tech-border p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Order Quantity
              </span>
              <span className="text-[11px] font-mono text-slate-400">Bulk packs available</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent flex items-center justify-center text-white disabled:opacity-40 disabled:hover:border-tech-border transition-colors shrink-0"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 bg-tech-card border border-tech-border rounded-lg py-2 px-3 text-center">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-full bg-transparent text-center font-mono font-extrabold text-lg text-white focus:outline-none"
                />
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  {quantity === 1 ? 'Single Unit' : `${quantity} Units`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 500}
                className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent flex items-center justify-center text-white transition-colors shrink-0"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Quantity Chips */}
            <div className="flex items-center gap-2 pt-1">
              {[1, 5, 10, 25, 50].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => handleQuantityChange(qty)}
                  className={`flex-1 py-1 rounded text-[11px] font-mono border transition-all ${
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

          {/* Custom Keychain Design Upload (Logo / Sketch / 3D Model) */}
          <div className="bg-tech-bg/80 border border-tech-border p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-tech-accent" /> Custom Design Upload
              </span>
              <span className="text-[11px] font-mono text-slate-400">Optional</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".stl,.obj,.3mf,.step,.stp,.png,.jpg,.jpeg,.svg,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="keychain-design-uploader"
            />

            {!uploadedFile ? (
              <label
                htmlFor="keychain-design-uploader"
                className="w-full border-2 border-dashed border-tech-border hover:border-tech-accent/80 bg-tech-card/50 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-colors group text-center"
              >
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-tech-accent mb-1 transition-colors" />
                <span className="text-xs font-semibold text-slate-200">
                  Click to upload Logo / Custom Shape
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Supports .stl, .obj, .png, .jpg, .svg (Max 25MB)
                </span>
              </label>
            ) : (
              <div className="bg-tech-card border border-emerald-500/40 rounded-lg p-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {uploadedFile.previewUrl ? (
                    <img
                      src={uploadedFile.previewUrl}
                      alt="Uploaded Preview"
                      className="w-9 h-9 rounded object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-white truncate">{uploadedFile.name}</p>
                    <p className="text-[10px] font-mono text-emerald-400">{uploadedFile.size} • Ready</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeUploadedFile}
                  className="p-1.5 rounded hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Direct WhatsApp Order CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-tech-border/80">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Includes stainless steel split keyring & jump chain • Pan-India Dispatch</span>
        </div>

        <a
          href={`https://wa.me/918761053230?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Order ({quantity} unit{quantity > 1 ? 's' : ''}) on WhatsApp</span>
        </a>
      </div>

    </div>
  );
}



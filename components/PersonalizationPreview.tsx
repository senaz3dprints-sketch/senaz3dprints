'use client';

import React, { useState } from 'react';
import { Type, Palette, Sparkles, MessageCircle, Layers, Check, Shield } from 'lucide-react';

interface PersonalizationPreviewProps {
  initialText?: string;
  colors?: string[];
  onPersonalizationChange?: (data: { text: string; baseColor?: string; textColor?: string; color?: string }) => void;
}

const BASE_COLORS = [
  { name: 'Matte Obsidian', hex: '#12161f', border: '#2d3748', isDark: true },
  { name: 'Carbon Stealth', hex: '#1e293b', border: '#334155', isDark: true },
  { name: 'Pure Snow White', hex: '#f8fafc', border: '#e2e8f0', isDark: false },
  { name: 'Deep Navy', hex: '#0f172a', border: '#1e3a8a', isDark: true },
  { name: 'Racing Red', hex: '#991b1b', border: '#dc2626', isDark: true },
];

const TEXT_COLORS = [
  { name: 'Electric Cyan', hex: '#00e5ff', glow: 'rgba(0, 229, 255, 0.4)' },
  { name: 'Silk Gold', hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  { name: 'Ruby Red', hex: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  { name: 'Arctic White', hex: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' },
  { name: 'Lime Green', hex: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { name: 'Sunset Orange', hex: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
];

export default function PersonalizationPreview({
  initialText = 'SenAZ 3D',
  onPersonalizationChange,
}: PersonalizationPreviewProps) {
  const [text, setText] = useState(initialText);
  const [selectedBase, setSelectedBase] = useState(BASE_COLORS[0]);
  const [selectedText, setSelectedText] = useState(TEXT_COLORS[0]);

  const handleTextChange = (val: string) => {
    const sanitized = val.slice(0, 14);
    setText(sanitized);
    if (onPersonalizationChange) {
      onPersonalizationChange({
        text: sanitized,
        baseColor: selectedBase.name,
        textColor: selectedText.name,
        color: selectedText.name,
      });
    }
  };

  const handleBaseChange = (base: typeof BASE_COLORS[0]) => {
    setSelectedBase(base);
    if (onPersonalizationChange) {
      onPersonalizationChange({
        text,
        baseColor: base.name,
        textColor: selectedText.name,
        color: selectedText.name,
      });
    }
  };

  const handleTextColorChange = (textColor: typeof TEXT_COLORS[0]) => {
    setSelectedText(textColor);
    if (onPersonalizationChange) {
      onPersonalizationChange({
        text,
        baseColor: selectedBase.name,
        textColor: textColor.name,
        color: textColor.name,
      });
    }
  };

  const displayText = text.trim() ? text.toUpperCase() : 'YOUR NAME';

  const whatsappMessage = encodeURIComponent(
    `Hi SenAZ 3D PRINTS! I would like to order a Custom 3D Printed Keychain.\n\n` +
    `• Custom Text: "${displayText}"\n` +
    `• Base Color: ${selectedBase.name}\n` +
    `• Text Color: ${selectedText.name}\n` +
    `• Quantity: 1\n\n` +
    `Please share pricing and estimated dispatch time.`
  );

  return (
    <div className="bg-tech-card rounded-2xl border border-tech-border p-5 sm:p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-tech-border/80 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-tech-accent" />
          <h4 className="font-bold text-white text-sm font-sans tracking-wide">
            Real 3D Keychain Customizer
          </h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live 3D Render
        </span>
      </div>

      {/* REAL PHYSICAL KEYCHAIN STUDIO VIEW */}
      <div className="relative w-full min-h-[220px] sm:min-h-[240px] bg-gradient-to-b from-[#090d16] to-[#04060a] rounded-xl border border-tech-border flex items-center justify-center p-6 overflow-hidden select-none">
        
        {/* Studio Background Grid & Spotlights */}
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
        <div className="absolute top-0 inset-x-1/4 h-24 bg-tech-accent/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-2 left-6 text-[10px] font-mono text-slate-500 tracking-wider">
          FDM DUAL-EXTRUSION • 100% INFILL
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
            <div className="relative px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center min-w-[140px] max-w-[280px] sm:max-w-[340px]">
              
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        
        {/* Text Input */}
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Type className="w-3.5 h-3.5 text-tech-accent" /> 1. Enter Name / Text
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{text.length}/14 Characters</span>
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

        {/* Base Body Color Selection */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5 font-semibold text-white">
            <Layers className="w-3.5 h-3.5 text-tech-accent" /> 2. Keychain Base Color
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BASE_COLORS.map((base) => {
              const isSelected = selectedBase.name === base.name;
              return (
                <button
                  key={base.name}
                  type="button"
                  onClick={() => handleBaseChange(base)}
                  className={`p-2 rounded-lg text-xs font-mono border flex items-center gap-2 transition-all text-left ${
                    isSelected
                      ? 'bg-tech-accent/15 border-tech-accent text-white shadow-sm'
                      : 'bg-tech-bg border-tech-border text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0"
                    style={{ backgroundColor: base.hex }}
                  />
                  <span className="truncate text-[11px]">{base.name.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3 h-3 text-tech-accent ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Embossed Text Accent Color Selection */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5 font-semibold text-white">
            <Palette className="w-3.5 h-3.5 text-tech-accent" /> 3. Raised Text Color
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TEXT_COLORS.map((tc) => {
              const isSelected = selectedText.name === tc.name;
              return (
                <button
                  key={tc.name}
                  type="button"
                  onClick={() => handleTextColorChange(tc)}
                  className={`p-2 rounded-lg text-xs font-mono border flex items-center gap-2 transition-all text-left ${
                    isSelected
                      ? 'bg-tech-accent/15 border-tech-accent text-white shadow-sm'
                      : 'bg-tech-bg border-tech-border text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0 shadow-sm"
                    style={{ backgroundColor: tc.hex }}
                  />
                  <span className="truncate text-[11px]">{tc.name.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3 h-3 text-tech-accent ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Direct WhatsApp Order CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-tech-border/80">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Includes stainless steel split keyring & jump chain</span>
        </div>

        <a
          href={`https://wa.me/918761053230?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Order This Design on WhatsApp</span>
        </a>
      </div>

    </div>
  );
}


'use client';

import React, { useState } from 'react';
import { Type, Palette, Info, Check, Sparkles } from 'lucide-react';

interface PersonalizationPreviewProps {
  initialText?: string;
  colors?: string[];
  onPersonalizationChange?: (data: { text: string; color: string }) => void;
}

export default function PersonalizationPreview({
  initialText = 'YOUR NAME',
  colors = ['Arctic White', 'Matte Black', 'Electric Blue', 'Ruby Red', 'Silk Gold'],
  onPersonalizationChange,
}: PersonalizationPreviewProps) {
  const [text, setText] = useState(initialText);
  const [selectedColor, setSelectedColor] = useState(colors[0] || 'Arctic White');

  const handleTextChange = (val: string) => {
    // Max 18 characters for clean 3D physical print aspect ratio
    const sanitized = val.slice(0, 18);
    setText(sanitized);
    if (onPersonalizationChange) {
      onPersonalizationChange({ text: sanitized, color: selectedColor });
    }
  };

  const handleColorChange = (col: string) => {
    setSelectedColor(col);
    if (onPersonalizationChange) {
      onPersonalizationChange({ text, color: col });
    }
  };

  // Color mapping helper for visual mockup
  const getColorHex = (c: string) => {
    const lower = c.toLowerCase();
    if (lower.includes('white')) return '#f8fafc';
    if (lower.includes('black')) return '#18181b';
    if (lower.includes('blue')) return '#2563eb';
    if (lower.includes('red')) return '#dc2626';
    if (lower.includes('gold')) return '#d97706';
    if (lower.includes('green')) return '#059669';
    return '#64748b';
  };

  return (
    <div className="bg-tech-card rounded-xl border border-tech-border p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-tech-border pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-tech-accent" />
          <h4 className="font-semibold text-white text-sm font-sans">
            3D Text Personalisation Tool
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-tech-bg px-2 py-0.5 rounded border border-tech-border">
          Live Render Preview
        </span>
      </div>

      {/* Live Visual Mockup Canvas */}
      <div className="relative w-full h-36 bg-tech-bg rounded-lg border border-tech-border flex items-center justify-center p-4 overflow-hidden">
        {/* Layer pattern simulating 3D infill */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* 3D Keychain / Tag Plate Mockup */}
        <div
          className="relative px-8 py-4 rounded-lg shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-slate-700/60 max-w-full overflow-hidden"
          style={{
            backgroundColor: getColorHex(selectedColor),
            color: selectedColor.toLowerCase().includes('white') ? '#0f172a' : '#ffffff',
            boxShadow: `0 10px 25px -5px ${getColorHex(selectedColor)}40`,
          }}
        >
          {/* Keyring Loop Hole visual */}
          <div className="absolute left-2 w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-slate-800 shrink-0" />

          {/* Embossed Text */}
          <span className="font-extrabold font-mono tracking-widest text-lg sm:text-xl uppercase drop-shadow-md truncate pl-3">
            {text.trim() || 'YOUR NAME'}
          </span>

          {/* Simulated 3D layer line accent */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-tech-accent/70" />
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {/* Text Input */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-tech-accent" /> Custom Name / Text
            </span>
            <span className="text-[10px] text-slate-400">{text.length}/18 Chars</span>
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="e.g. MILAN, SenAZ-3D"
            className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-tech-accent font-mono"
            maxLength={18}
          />
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-tech-accent" /> Select Print Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono border flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-tech-accent/20 border-tech-accent text-tech-accent font-semibold'
                      : 'bg-tech-bg border-tech-border text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-600"
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                  <span>{color}</span>
                  {isSelected && <Check className="w-3 h-3 text-tech-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Physical Disclaimer */}
      <div className="p-3 rounded-lg bg-tech-bg/80 border border-tech-border/80 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed font-sans">
        <Info className="w-4 h-4 text-tech-accent shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-slate-300">Note:</span> Final physical appearance may vary slightly depending on print layer height and filament material density.
        </p>
      </div>
    </div>
  );
}

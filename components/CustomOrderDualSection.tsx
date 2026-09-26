'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  FileCode2,
  Image as ImageIcon,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function CustomOrderDualSection() {
  // Quick WhatsApp Form State (For users without a design file)
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [referencePhoto, setReferencePhoto] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    requestId: string;
    whatsappUrl: string;
  } | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferencePhoto(file);
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || !ideaDescription.trim()) {
      setError('Please fill in your name, WhatsApp number, and what you want to 3D print.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('customerName', name.trim());
      formData.append('whatsapp', whatsapp.trim());
      formData.append('productType', 'Custom 3D Idea (No CAD File)');
      formData.append('materialPreference', 'PLA+ / Expert Recommendation');
      formData.append('colorPreference', 'Discuss on WhatsApp');
      formData.append('quantity', '1');
      formData.append('additionalNotes', ideaDescription.trim());

      if (referencePhoto) {
        formData.append('referenceImage', referencePhoto);
      }

      const res = await fetch('/api/custom-request', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessData({
          requestId: data.requestId,
          whatsappUrl: data.whatsappUrl,
        });

        // Open WhatsApp in new tab automatically
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }
      } else {
        setError(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>On-Demand 3D Fabrication</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
          Custom 3D Printing Service
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          Whether you already have a ready 3D CAD model or just an idea with no design file, we have you covered.
        </p>
      </div>

      {/* Dual Pathway Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* ================================================================= */}
        {/* OPTION 1: HAVE A 3D FILE (.STL, .OBJ, .3MF, .STEP) */}
        {/* ================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-tech-card via-tech-card/90 to-tech-bg border border-tech-border p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:border-tech-accent/40 transition-all group">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-[11px] font-mono font-bold text-tech-accent">
                Option 1 • Ready 3D File
              </span>
              <FileCode2 className="w-6 h-6 text-tech-accent group-hover:scale-110 transition-transform" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans">
                I have a 3D Model File (.STL / .OBJ)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Upload your CAD file for precise slicer analysis, exact material weight calculation, and fast production quote.
              </p>
            </div>

            {/* Feature checklist */}
            <div className="space-y-2.5 py-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-tech-accent shrink-0" />
                <span>Supports <strong>.STL, .OBJ, .3MF, .STEP, .STP, .GCODE</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-tech-accent shrink-0" />
                <span>Choose materials: PLA+, PETG, TPU Rubber, ABS, ASA, Nylon</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-tech-accent shrink-0" />
                <span>Select custom infill %, wall thickness & high-speed print layer</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/custom-printing"
              className="w-full py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload 3D File & Calculate Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* OPTION 2: NO DESIGN FILE? QUICK WHATSAPP CHAT */}
        {/* ================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950/40 via-tech-card to-tech-bg border border-emerald-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400">
                Option 2 • No 3D File Needed
              </span>
              <MessageCircle className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans flex items-center gap-2">
                <span>Don't have a design file?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Tell us your idea below. We'll record your request, design the 3D model for you, and connect directly on WhatsApp!
              </p>
            </div>

            {/* Quick Form */}
            {successData ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 my-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    Request Recorded Successfully!
                  </span>
                  <h4 className="text-xl font-bold text-white font-mono mt-0.5">{successData.requestId}</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Your request has been logged in our system. Click below if WhatsApp did not open automatically:
                  </p>
                </div>
                <a
                  href={successData.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs font-mono hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>Open WhatsApp Chat Now</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSuccessData(null);
                    setIdeaDescription('');
                    setReferencePhoto(null);
                  }}
                  className="text-[11px] text-slate-400 hover:text-white font-mono underline cursor-pointer"
                >
                  Send another custom idea
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-3.5 pt-1">
                {error && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-mono text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">
                      WhatsApp Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    Describe your idea / What do you want to 3D print? <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. I need a custom headphone desk mount with my logo / replacement gear for a toy..."
                    value={ideaDescription}
                    onChange={(e) => setIdeaDescription(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 placeholder:text-slate-500 resize-none"
                  />
                </div>

                {/* Optional Photo / Sketch Attachment */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    Have a reference photo / hand sketch? (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tech-bg border border-tech-border hover:border-emerald-400/60 text-xs font-mono text-slate-300 hover:text-white transition-colors">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{referencePhoto ? 'Change Photo' : 'Attach Photo/Sketch'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </label>
                    {referencePhoto && (
                      <span className="text-[11px] font-mono text-emerald-400 truncate max-w-[180px]">
                        ✓ {referencePhoto.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm font-mono hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-70 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>{loading ? 'Recording & Connecting...' : 'Discuss Idea on WhatsApp 💬'}</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-mono mt-1.5">
                    ✓ Saved to our database & synced to WhatsApp with tracking ID
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import {
  Upload,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  FileCode,
  Sparkles,
  FileCode2,
  Image as ImageIcon,
} from 'lucide-react';

export default function CustomPrintingPage() {
  const [activeTab, setActiveTab] = useState<'nofile' | 'file'>('nofile');

  // Common Contact Info
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // No-File Quick Request State
  const [ideaDescription, setIdeaDescription] = useState('');
  const [referencePhoto, setReferencePhoto] = useState<File | null>(null);

  // File Upload Request State
  const [productType, setProductType] = useState('Custom Prototype / STL');
  const [materialPreference, setMaterialPreference] = useState(
    'PLA / PLA+ / Pro / Rapid PLA — Standard & High Speed (Recommended)'
  );
  const [colorPreference, setColorPreference] = useState('Arctic White');
  const [quantity, setQuantity] = useState(1);
  const [dimensions, setDimensions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [file3d, setFile3d] = useState<File | null>(null);
  const [file3dLink, setFile3dLink] = useState('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    requestId: string;
    whatsappUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !whatsapp.trim()) {
      setError('Please fill in your name and WhatsApp number.');
      return;
    }

    if (activeTab === 'nofile' && !ideaDescription.trim()) {
      setError('Please describe your 3D print idea or requirements.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('customerName', customerName.trim());
      formData.append('whatsapp', whatsapp.trim());
      if (email) formData.append('email', email.trim());

      if (activeTab === 'nofile') {
        formData.append('productType', 'Custom 3D Idea (No CAD File)');
        formData.append('materialPreference', 'PLA+ / Expert Recommendation');
        formData.append('colorPreference', 'Discuss on WhatsApp');
        formData.append('quantity', '1');
        formData.append('additionalNotes', ideaDescription.trim());
        if (referencePhoto) formData.append('referenceImage', referencePhoto);
      } else {
        formData.append('productType', productType);
        formData.append('materialPreference', materialPreference);
        formData.append('colorPreference', colorPreference);
        formData.append('quantity', quantity.toString());
        if (dimensions) formData.append('dimensions', dimensions.trim());
        if (additionalNotes) formData.append('additionalNotes', additionalNotes.trim());
        if (file3d) formData.append('file3d', file3d);
        if (file3dLink) formData.append('file3dLink', file3dLink.trim());
        if (referenceImage) formData.append('referenceImage', referenceImage);
      }

      const res = await fetch('/api/custom-request', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess({
          requestId: data.requestId,
          whatsappUrl: data.whatsappUrl,
        });

        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }
      } else {
        setError(data.error || 'Failed to submit request. Please check your inputs.');
      }
    } catch (err) {
      setError('An unexpected server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Industrial High-Precision FDM 3D Printing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
          Custom 3D Printing & Design
        </h1>
        <p className="text-sm text-slate-300 font-sans leading-relaxed">
          Need a custom part, personalized gift, or ready STL printed? Choose an option below to get started.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-tech-card p-1.5 rounded-2xl border border-tech-border max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => {
            setActiveTab('nofile');
            setError(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'nofile'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageCircle className={`w-4 h-4 ${activeTab === 'nofile' ? 'fill-black' : ''}`} />
          <span>No 3D File? (WhatsApp Idea)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('file');
            setError(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'file'
              ? 'bg-tech-accent text-tech-bg shadow-lg shadow-tech-accent/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          <span>I Have a 3D File (.STL/.OBJ)</span>
        </button>
      </div>

      {/* Success View */}
      {success ? (
        <div className="bg-tech-card rounded-3xl border border-tech-border p-8 text-center space-y-6 max-w-lg mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Request Recorded in Admin System
            </span>
            <h3 className="text-2xl font-extrabold text-white font-mono">{success.requestId}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your custom request has been recorded into our database. Click below to continue your discussion directly with our team on WhatsApp!
            </p>
          </div>

          <a
            href={success.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm font-mono hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="w-5 h-5 fill-black" />
            <span>Open WhatsApp Chat ({success.requestId})</span>
          </a>

          <button
            onClick={() => {
              setSuccess(null);
              setIdeaDescription('');
              setReferencePhoto(null);
            }}
            className="text-xs text-slate-400 hover:text-white font-mono underline cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="bg-tech-card rounded-3xl border border-tech-border p-6 sm:p-8 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-mono text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Your Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                WhatsApp Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
              />
            </div>
          </div>

          {/* TAB 1: NO 3D FILE / QUICK WHATSAPP FORM */}
          {activeTab === 'nofile' && (
            <div className="space-y-4 pt-2 border-t border-tech-border/60">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Describe what you want to 3D print <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. I need a custom key holder shaped like a mountain with my name, or a replacement gear for a toy..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Have a hand sketch, photo, or inspiration image? (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-tech-bg border border-tech-border hover:border-emerald-400/60 text-xs font-mono text-slate-300 hover:text-white transition-colors">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>{referencePhoto ? 'Change Image' : 'Upload Sketch / Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setReferencePhoto(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {referencePhoto && (
                    <span className="text-xs font-mono text-emerald-400 truncate max-w-xs">
                      ✓ {referencePhoto.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 font-sans flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>We will generate a custom 3D CAD design for you and discuss pricing, dimensions & materials on WhatsApp.</span>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED 3D FILE UPLOAD FORM */}
          {activeTab === 'file' && (
            <div className="space-y-6 pt-2 border-t border-tech-border/60">
              {/* File Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FileUpload
                    label="1. Upload 3D File (.stl, .obj, .3mf, .step, .gcode)"
                    acceptTypes=".stl,.obj,.3mf,.step,.stp,.gcode"
                    maxSizeMb={25}
                    allowedExtensionsText=".stl, .obj, .3mf, .step, .gcode"
                    onFileSelect={(f) => setFile3d(f)}
                  />
                  <div className="pt-1">
                    <input
                      type="url"
                      placeholder="Or paste Google Drive / Dropbox link..."
                      value={file3dLink}
                      onChange={(e) => setFile3dLink(e.target.value)}
                      className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-1.5 text-[11px] text-white focus:outline-none focus:border-tech-accent font-mono"
                    />
                  </div>
                </div>

                <FileUpload
                  label="2. Upload Reference Image (.jpg, .png, .webp)"
                  acceptTypes=".jpg,.jpeg,.png,.webp"
                  maxSizeMb={10}
                  allowedExtensionsText=".jpg, .png, .webp"
                  onFileSelect={(f) => setReferenceImage(f)}
                />
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Product Type <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                  >
                    <option value="Custom Prototype / STL">Custom Prototype / STL</option>
                    <option value="Personalized Gift / Nameplate">Personalized Gift / Nameplate</option>
                    <option value="Replacement Part / Utility">Replacement Part / Utility</option>
                    <option value="Figurine / Statue">Figurine / Statue</option>
                    <option value="Architecture Model">Architecture Model</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Material Preference
                  </label>
                  <select
                    value={materialPreference}
                    onChange={(e) => setMaterialPreference(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                  >
                    <option value="PLA / PLA+ / Pro / Rapid PLA — Standard & High Speed (Recommended)">
                      PLA / PLA+ / Pro / Rapid PLA — Standard & High Speed (Recommended)
                    </option>
                    <option value="PETG — Heat & Water Resistant">
                      PETG — Heat & Water Resistant
                    </option>
                    <option value="TPU — Rubber Flexible">
                      TPU — Rubber Flexible
                    </option>
                    <option value="ABS — Impact & Heat Resistant">
                      ABS — Impact & Heat Resistant
                    </option>
                    <option value="ASA — UV & Outdoor Weather Resistant">
                      ASA — UV & Outdoor Weather Resistant
                    </option>
                    <option value="Nylon (PA) — High Strength & Wear Resistant">
                      Nylon (PA) — High Strength & Wear Resistant
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Color Preference
                  </label>
                  <input
                    type="text"
                    placeholder="White, Black, Blue, Gold..."
                    value={colorPreference}
                    onChange={(e) => setColorPreference(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Quantity Required
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Approximate Dimensions (e.g. 100 x 50 x 30 mm)
                  </label>
                  <input
                    type="text"
                    placeholder="100 x 50 x 30 mm"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Additional Requirements / Infill / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify infill percentage, solid walls, or functional stress load requirements..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent resize-none"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-extrabold text-sm font-mono transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                activeTab === 'nofile'
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
                  : 'bg-tech-accent text-tech-bg hover:bg-tech-accent/90 shadow-tech-accent/20'
              }`}
            >
              {activeTab === 'nofile' ? (
                <>
                  <MessageCircle className="w-5 h-5 fill-black" />
                  <span>{loading ? 'Submitting & Opening WhatsApp...' : 'Submit Idea & Chat on WhatsApp'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>{loading ? 'Uploading File & Processing...' : 'Submit 3D Model & Get Quote'}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 font-mono mt-2">
              ✓ Logged to admin portal & synced with Google Sheets
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

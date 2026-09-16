'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { Upload, MessageCircle, CheckCircle, ShieldCheck, AlertCircle, FileCode } from 'lucide-react';

export default function CustomPrintingPage() {
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [productType, setProductType] = useState('Custom Prototype / STL');
  const [materialPreference, setMaterialPreference] = useState('PLA+ High Stiffness');
  const [colorPreference, setColorPreference] = useState('Arctic White');
  const [quantity, setQuantity] = useState(1);
  const [dimensions, setDimensions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [file3d, setFile3d] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    requestId: string;
    whatsappUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !whatsapp || !productType) {
      setError('Please fill in your name, WhatsApp contact, and product type.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('customerName', customerName);
      formData.append('whatsapp', whatsapp);
      if (email) formData.append('email', email);
      formData.append('productType', productType);
      formData.append('materialPreference', materialPreference);
      formData.append('colorPreference', colorPreference);
      formData.append('quantity', quantity.toString());
      if (dimensions) formData.append('dimensions', dimensions);
      if (additionalNotes) formData.append('additionalNotes', additionalNotes);

      if (file3d) formData.append('file3d', file3d);
      if (referenceImage) formData.append('referenceImage', referenceImage);

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
      } else {
        setError(data.error || 'Failed to submit request. Please check file format or size.');
      }
    } catch (err) {
      setError('An unexpected server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent">
          <FileCode className="w-3.5 h-3.5" />
          <span>Industrial FDM & Resin Printing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
          Have a 3D idea?
        </h1>
        <p className="text-sm text-slate-300 font-sans leading-relaxed">
          Send us your model file, reference image or requirements. We'll review it and get back with a quote.
        </p>
      </div>

      {/* Success View */}
      {success ? (
        <div className="bg-tech-card rounded-2xl border border-tech-border p-8 text-center space-y-6 max-w-lg mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              Request Received
            </span>
            <h3 className="text-2xl font-extrabold text-white font-mono">{success.requestId}</h3>
            <p className="text-xs text-slate-300">
              Your 3D request & files have been safely uploaded. Click below to initiate instant WhatsApp quote discussion!
            </p>
          </div>

          <a
            href={success.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm font-mono hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="w-5 h-5 fill-black" />
            <span>Discuss & Get Quote on WhatsApp</span>
          </a>

          <button
            onClick={() => setSuccess(null)}
            className="text-xs text-slate-400 hover:text-white font-mono"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="bg-tech-card rounded-2xl border border-tech-border p-6 sm:p-8 space-y-6 shadow-2xl">
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
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
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
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
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
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
              />
            </div>
          </div>

          {/* File Uploaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <FileUpload
              label="1. Upload 3D File (.stl, .obj, .3mf)"
              acceptTypes=".stl,.obj,.3mf"
              maxSizeMb={25}
              allowedExtensionsText=".stl, .obj, .3mf"
              onFileSelect={(f) => setFile3d(f)}
            />

            <FileUpload
              label="2. Upload Reference Image (.jpg, .png, .webp)"
              acceptTypes=".jpg,.jpeg,.png,.webp"
              maxSizeMb={10}
              allowedExtensionsText=".jpg, .png, .webp"
              onFileSelect={(f) => setReferenceImage(f)}
            />
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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
                <option value="PLA+ High Stiffness">PLA+ High Stiffness (Recommended)</option>
                <option value="PETG Heat & Water Resistant">PETG Heat & Water Resistant</option>
                <option value="TPU Rubber Flexible">TPU Rubber Flexible</option>
                <option value="Resin High Detail">Resin High Detail</option>
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
              Additional Requirements / Infill / Layer Height Notes
            </label>
            <textarea
              rows={3}
              placeholder="Specify infill percentage, solid walls, or functional stress load requirements..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-tech-accent" /> Server File MIME Verification
            </span>
            <span>Fast WhatsApp Quote</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{loading ? 'Uploading & Processing Request...' : 'Submit Request & Get Quote'}</span>
          </button>
        </form>
      )}
    </div>
  );
}

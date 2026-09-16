'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminContentPage() {
  const [heroTitle, setHeroTitle] = useState('Made to Print. Built for You.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Custom 3D printed products, personalised designs and functional creations made to your specifications.'
  );
  const [primaryCtaText, setPrimaryCtaText] = useState('Shop Products');
  const [secondaryCtaText, setSecondaryCtaText] = useState('Get a Custom Print');
  const [contactWhatsapp, setContactWhatsapp] = useState('919876543210');
  const [contactEmail, setContactEmail] = useState('support@senaz3dprints.in');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          if (data.content.heroTitle) setHeroTitle(data.content.heroTitle);
          if (data.content.heroSubtitle) setHeroSubtitle(data.content.heroSubtitle);
          if (data.content.primaryCtaText) setPrimaryCtaText(data.content.primaryCtaText);
          if (data.content.secondaryCtaText) setSecondaryCtaText(data.content.secondaryCtaText);
          if (data.content.contactWhatsapp) setContactWhatsapp(data.content.contactWhatsapp);
          if (data.content.contactEmail) setContactEmail(data.content.contactEmail);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        heroTitle,
        heroSubtitle,
        primaryCtaText,
        secondaryCtaText,
        contactWhatsapp,
        contactEmail,
        faqItems: [
          {
            question: 'What materials do you use for 3D printing?',
            answer:
              'We primarily print with PLA+ (eco-friendly, high stiffness), PETG (heat & water resistant), TPU (flexible rubber-like), and high-resolution Resin for detailed figurines.',
          },
          {
            question: 'How long does custom 3D printing take?',
            answer:
              'Most standard catalog products ship within 24-48 hours. Custom CAD designs and complex 3D model requests take 2-4 business days depending on print hours.',
          },
          {
            question: 'Can I send my own 3D model file?',
            answer:
              'Yes! Visit our /custom-printing page to upload your .stl, .obj, or .3mf model files along with your preferred material and color.',
          },
          {
            question: 'How does payment work?',
            answer:
              'Once you place an order or custom print request on our website, you will be redirected to WhatsApp where we confirm stock, final text previews, and send secure UPI/NetBanking payment options.',
          },
        ],
      };

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedSuccess(true);
      }
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-tech-border pb-4">
        <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
          Editable Website Content (CMS)
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Modify website headlines, hero subtitles, contact phone numbers without editing source code
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-tech-card rounded-2xl border border-tech-border p-6 sm:p-8 space-y-6">
        {savedSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Website content updated successfully! Public pages updated in real-time.</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold text-white text-base font-sans">Homepage Hero Section</h3>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Hero Main Title</label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Hero Subtitle</label>
            <textarea
              rows={2}
              required
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Primary CTA Button</label>
              <input
                type="text"
                value={primaryCtaText}
                onChange={(e) => setPrimaryCtaText(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Secondary CTA Button</label>
              <input
                type="text"
                value={secondaryCtaText}
                onChange={(e) => setSecondaryCtaText(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-tech-border">
          <h3 className="font-bold text-white text-base font-sans">Business Contact Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">WhatsApp Support Number</label>
              <input
                type="text"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-tech-accent text-tech-bg font-extrabold text-xs font-mono rounded-xl hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-tech-accent/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Website Content'}</span>
        </button>
      </form>
    </div>
  );
}

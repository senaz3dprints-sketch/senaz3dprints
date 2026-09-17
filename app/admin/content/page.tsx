'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  CheckCircle,
  Sparkles,
  Info,
  Layers,
  Phone,
  HelpCircle,
  Plus,
  Trash2,
  Cpu,
  Truck,
} from 'lucide-react';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'about' | 'contact' | 'faqs' | 'shipping'>('homepage');

  // Shipping & Delivery States
  const [shippingFlatRate, setShippingFlatRate] = useState(0);
  const [shippingFreeThreshold, setShippingFreeThreshold] = useState(0);
  const [shippingNote, setShippingNote] = useState('Standard delivery in 3-5 business days across India');

  // Homepage States
  const [heroTitle, setHeroTitle] = useState('Made to Print. Built for You.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Custom 3D printed products, personalized designs, and high-precision functional parts made to your exact specifications. Available in PLA/PLA+, PETG, TPU, ASA, ABS, and Nylon.'
  );
  const [primaryCtaText, setPrimaryCtaText] = useState('Shop Products');
  const [secondaryCtaText, setSecondaryCtaText] = useState('Get a Custom Print');

  // About Page States
  const [aboutTitle, setAboutTitle] = useState('Precision FDM 3D Printing in India.');
  const [aboutStory, setAboutStory] = useState(
    'SenAZ 3D PRINTS (senaz3dprints.in) is an engineering-focused micro manufacturing print studio dedicated to high-precision personalized keychains, desk accessories, figures, and custom 3D model manufacturing.'
  );
  const [aboutHighlight1Title, setAboutHighlight1Title] = useState('High Precision Calibration');
  const [aboutHighlight1Desc, setAboutHighlight1Desc] = useState(
    'Our FDM print beds are auto-mesh leveled and calibrated to sub-millimeter tolerances for clean surface finishes.'
  );
  const [aboutHighlight2Title, setAboutHighlight2Title] = useState('Tough Engineering Polymers');
  const [aboutHighlight2Desc, setAboutHighlight2Desc] = useState(
    'We exclusively use high-grade PLA/PLA+, heat-resistant PETG, flexible TPU rubber, ASA, ABS, and technical Nylon polymers.'
  );
  const [aboutHighlight3Title, setAboutHighlight3Title] = useState('Direct WhatsApp Order Flow');
  const [aboutHighlight3Desc, setAboutHighlight3Desc] = useState(
    'No friction or complex payment gateways. Real human stock confirmation and live preview approvals on WhatsApp.'
  );

  const [aboutSpecNozzle, setAboutSpecNozzle] = useState('0.4mm / 0.2mm');
  const [aboutSpecLayerHeight, setAboutSpecLayerHeight] = useState('0.08mm - 0.28mm');
  const [aboutSpecBuildVolume, setAboutSpecBuildVolume] = useState('250 x 250 x 260 mm');
  const [aboutSpecQuality, setAboutSpecQuality] = useState('100% Inspection');

  // Contact & Social States
  const [contactWhatsapp, setContactWhatsapp] = useState('918761053230');
  const [contactEmail, setContactEmail] = useState('senaz3dprints@gmail.com');
  const [contactAddress, setContactAddress] = useState('India | Nationwide Dispatch');
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/senaz_prints');
  const [youtubeUrl, setYoutubeUrl] = useState('https://youtube.com/@senaz3dprints');

  // FAQs
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
    {
      question: 'What materials do you use for 3D printing?',
      answer:
        'We primarily print with PLA/PLA+, PETG (heat & water resistant), TPU (flexible rubber), ASA (UV resistant), ABS (impact resistant), and Nylon (PA) for high strength technical & functional parts.',
    },
    {
      question: 'How long does custom 3D printing take?',
      answer:
        'Most standard catalog products ship within 24-48 hours. Custom CAD designs and complex 3D model requests take 2-4 business days depending on print hours.',
    },
    {
      question: 'Can I send my own 3D model file?',
      answer:
        'Yes! Visit our /custom-printing page to upload your .stl, .obj, .3mf, .step, or .gcode model files along with your preferred material and color.',
    },
    {
      question: 'How does payment work?',
      answer:
        'Once you place an order or custom print request on our website, you will be redirected to WhatsApp where we confirm stock, final text previews, and send secure UPI/NetBanking payment options.',
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          const c = data.content;
          if (c.heroTitle) setHeroTitle(c.heroTitle);
          if (c.heroSubtitle) setHeroSubtitle(c.heroSubtitle);
          if (c.primaryCtaText) setPrimaryCtaText(c.primaryCtaText);
          if (c.secondaryCtaText) setSecondaryCtaText(c.secondaryCtaText);

          if (c.aboutTitle) setAboutTitle(c.aboutTitle);
          if (c.aboutStory) setAboutStory(c.aboutStory);
          if (c.aboutHighlight1Title) setAboutHighlight1Title(c.aboutHighlight1Title);
          if (c.aboutHighlight1Desc) setAboutHighlight1Desc(c.aboutHighlight1Desc);
          if (c.aboutHighlight2Title) setAboutHighlight2Title(c.aboutHighlight2Title);
          if (c.aboutHighlight2Desc) setAboutHighlight2Desc(c.aboutHighlight2Desc);
          if (c.aboutHighlight3Title) setAboutHighlight3Title(c.aboutHighlight3Title);
          if (c.aboutHighlight3Desc) setAboutHighlight3Desc(c.aboutHighlight3Desc);

          if (c.aboutSpecNozzle) setAboutSpecNozzle(c.aboutSpecNozzle);
          if (c.aboutSpecLayerHeight) setAboutSpecLayerHeight(c.aboutSpecLayerHeight);
          if (c.aboutSpecBuildVolume) setAboutSpecBuildVolume(c.aboutSpecBuildVolume);
          if (c.aboutSpecQuality) setAboutSpecQuality(c.aboutSpecQuality);

          if (c.contactWhatsapp) setContactWhatsapp(c.contactWhatsapp);
          if (c.contactEmail) setContactEmail(c.contactEmail);
          if (c.contactAddress) setContactAddress(c.contactAddress);
          if (c.instagramUrl) setInstagramUrl(c.instagramUrl);
          if (c.youtubeUrl) setYoutubeUrl(c.youtubeUrl);

          if (Array.isArray(c.faqItems) && c.faqItems.length > 0) {
            setFaqs(c.faqItems);
          }
        }
      })
      .finally(() => setLoading(false));

    // Fetch Shipping Settings
    fetch('/api/admin/shipping')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setShippingFlatRate(data.settings.flatRate || 0);
          setShippingFreeThreshold(data.settings.freeShippingThreshold || 0);
          if (data.settings.shippingNote) setShippingNote(data.settings.shippingNote);
        }
      })
      .catch(() => {});
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

        aboutTitle,
        aboutStory,
        aboutHighlight1Title,
        aboutHighlight1Desc,
        aboutHighlight2Title,
        aboutHighlight2Desc,
        aboutHighlight3Title,
        aboutHighlight3Desc,

        aboutSpecNozzle,
        aboutSpecLayerHeight,
        aboutSpecBuildVolume,
        aboutSpecQuality,

        contactWhatsapp,
        contactEmail,
        contactAddress,
        instagramUrl,
        youtubeUrl,

        faqItems: faqs,
      };

      const [contentRes, shippingRes] = await Promise.all([
        fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        fetch('/api/admin/shipping', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flatRate: Number(shippingFlatRate) || 0,
            freeShippingThreshold: Number(shippingFreeThreshold) || 0,
            shippingNote,
          }),
        }),
      ]);

      if (contentRes.ok && shippingRes.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (e) {
      console.error('Failed to update content:', e);
    } finally {
      setSaving(false);
    }
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: 'New Question', answer: 'New Answer' }]);
  };

  const removeFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const updateFaq = (idx: number, field: 'question' | 'answer', val: string) => {
    const updated = [...faqs];
    updated[idx][field] = val;
    setFaqs(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-tech-border pb-4">
        <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
          Website Content Management System (CMS)
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Edit all website copy, shipping rates, About Us story, tech specs, FAQs, and business contacts live
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-tech-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('homepage')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'homepage'
              ? 'bg-tech-accent text-tech-bg shadow-md'
              : 'bg-tech-card text-slate-300 hover:text-white border border-tech-border'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Homepage Hero</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'shipping'
              ? 'bg-tech-accent text-tech-bg shadow-md'
              : 'bg-tech-card text-slate-300 hover:text-white border border-tech-border'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Shipping & Delivery</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'about'
              ? 'bg-tech-accent text-tech-bg shadow-md'
              : 'bg-tech-card text-slate-300 hover:text-white border border-tech-border'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>About Us Section</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'contact'
              ? 'bg-tech-accent text-tech-bg shadow-md'
              : 'bg-tech-card text-slate-300 hover:text-white border border-tech-border'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact & Socials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'bg-tech-accent text-tech-bg shadow-md'
              : 'bg-tech-card text-slate-300 hover:text-white border border-tech-border'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQ Questions ({faqs.length})</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-tech-card rounded-2xl border border-tech-border p-6 sm:p-8 space-y-6 shadow-2xl">
        {savedSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Website content updated successfully! All pages updated live on the website.</span>
          </div>
        )}

        {/* 1. HOMEPAGE TAB */}
        {activeTab === 'homepage' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-white text-base font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tech-accent" />
              <span>Homepage Hero Headlines & Buttons</span>
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Hero Main Headline</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. Made to Print. Built for You."
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-tech-accent font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Hero Subtitle / Description</label>
              <textarea
                rows={3}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Detailed intro under hero"
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white resize-none focus:outline-none focus:border-tech-accent font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Primary CTA Button Label</label>
                <input
                  type="text"
                  value={primaryCtaText}
                  onChange={(e) => setPrimaryCtaText(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Secondary CTA Button Label</label>
                <input
                  type="text"
                  value={secondaryCtaText}
                  onChange={(e) => setSecondaryCtaText(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SHIPPING & DELIVERY TAB */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base font-sans flex items-center gap-2">
                <Truck className="w-4 h-4 text-tech-accent" />
                <span>Shipping Rates & Delivery Configuration</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Configure your nationwide delivery charges, free shipping qualification thresholds, and customer notifications.
              </p>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="p-4 bg-tech-bg/70 rounded-xl border border-tech-border space-y-2.5">
              <span className="text-xs font-mono font-bold text-slate-300">Quick Configuration Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShippingFlatRate(0);
                    setShippingFreeThreshold(0);
                    setShippingNote('Free All-India Delivery');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border text-slate-200 text-xs font-mono border border-tech-border transition-colors"
                >
                  🎁 Free Delivery on All Orders
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShippingFlatRate(50);
                    setShippingFreeThreshold(0);
                    setShippingNote('Standard delivery in 3-5 business days (₹50)');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border text-slate-200 text-xs font-mono border border-tech-border transition-colors"
                >
                  📦 Flat ₹50 All Orders
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShippingFlatRate(50);
                    setShippingFreeThreshold(499);
                    setShippingNote('Free delivery on orders above ₹499 (otherwise ₹50)');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border text-slate-200 text-xs font-mono border border-tech-border transition-colors"
                >
                  🚀 Free Above ₹499 (₹50 otherwise)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShippingFlatRate(80);
                    setShippingFreeThreshold(999);
                    setShippingNote('Free delivery on orders above ₹999 (otherwise ₹80)');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border text-slate-200 text-xs font-mono border border-tech-border transition-colors"
                >
                  ⚡ Free Above ₹999 (₹80 otherwise)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Standard Flat Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={shippingFlatRate}
                  onChange={(e) => setShippingFlatRate(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                  placeholder="0 for 100% Free Shipping"
                />
                <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                  Set to 0 if all orders should have free delivery.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Free Shipping Minimum Cart Value (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={shippingFreeThreshold}
                  onChange={(e) => setShippingFreeThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                  placeholder="0 to disable free threshold"
                />
                <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                  Example: 499 means orders of ₹499 or more get FREE delivery.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                Delivery Timeline & Customer Notice
              </label>
              <input
                type="text"
                value={shippingNote}
                onChange={(e) => setShippingNote(e.target.value)}
                placeholder="e.g. Standard delivery in 3-5 business days across India"
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
              />
            </div>

            {/* Live Preview Box */}
            <div className="p-4 rounded-xl bg-tech-bg border border-tech-border space-y-2">
              <span className="text-xs font-mono font-bold text-tech-accent">Live Shipping Rule Preview:</span>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <p>
                  • <strong>Default Shipping Fee:</strong>{' '}
                  {shippingFlatRate === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE (₹0)</span>
                  ) : (
                    <span className="text-white font-bold">₹{shippingFlatRate}</span>
                  )}
                </p>
                {shippingFlatRate > 0 && (
                  <p>
                    • <strong>Free Delivery Rule:</strong>{' '}
                    {shippingFreeThreshold > 0 ? (
                      <span className="text-emerald-400">
                        Automatic FREE Delivery on cart totals of ₹{shippingFreeThreshold} or more.
                      </span>
                    ) : (
                      <span className="text-slate-400">No free shipping threshold (₹{shippingFlatRate} flat fee on every order).</span>
                    )}
                  </p>
                )}
                <p>
                  • <strong>Notice Displayed to Customers:</strong> "{shippingNote}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. ABOUT US TAB */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base font-sans flex items-center gap-2">
                <Info className="w-4 h-4 text-tech-accent" />
                <span>About Us Headline & Studio Story</span>
              </h3>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">About Page Main Title</label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-tech-accent font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">About Page Studio Story / Mission</label>
                <textarea
                  rows={4}
                  value={aboutStory}
                  onChange={(e) => setAboutStory(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white resize-none focus:outline-none focus:border-tech-accent font-sans"
                />
              </div>
            </div>

            {/* 3 Highlights */}
            <div className="space-y-4 pt-4 border-t border-tech-border">
              <h4 className="font-bold text-white text-sm font-sans">Core Value Highlights (3 Cards)</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-tech-bg/60 p-3.5 rounded-xl border border-tech-border space-y-2">
                  <span className="text-[11px] font-mono text-tech-accent font-bold">Highlight 1</span>
                  <input
                    type="text"
                    value={aboutHighlight1Title}
                    onChange={(e) => setAboutHighlight1Title(e.target.value)}
                    className="w-full bg-tech-card border border-tech-border rounded p-2 text-xs text-white font-bold"
                  />
                  <textarea
                    rows={3}
                    value={aboutHighlight1Desc}
                    onChange={(e) => setAboutHighlight1Desc(e.target.value)}
                    className="w-full bg-tech-card border border-tech-border rounded p-2 text-[11px] text-slate-300 resize-none"
                  />
                </div>

                <div className="bg-tech-bg/60 p-3.5 rounded-xl border border-tech-border space-y-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">Highlight 2</span>
                  <input
                    type="text"
                    value={aboutHighlight2Title}
                    onChange={(e) => setAboutHighlight2Title(e.target.value)}
                    className="w-full bg-tech-card border border-tech-border rounded p-2 text-xs text-white font-bold"
                  />
                  <textarea
                    rows={3}
                    value={aboutHighlight2Desc}
                    onChange={(e) => setAboutHighlight2Desc(e.target.value)}
                    className="w-full bg-tech-card border border-tech-border rounded p-2 text-[11px] text-slate-300 resize-none"
                  />
                </div>

                <div className="bg-tech-bg/60 p-3.5 rounded-xl border border-tech-border space-y-2">
                  <span className="text-[11px] font-mono text-amber-400 font-bold">Highlight 3</span>
                  <input
                    type="text"
                    value={aboutHighlight3Title}
                    onChange={(e) => setAboutHighlight3Title(e.target.value)}
                    className="w-full bg-tech-card border border-tech-border rounded p-2 text-xs text-white font-bold"
                  />
                  <textarea
                    rows={3}
                    value={aboutHighlight3Desc}
                    onChange={(e) => setAboutHighlight3Desc(e.target.value)}
                    className="w-full bg-tech-card border border-tech-border rounded p-2 text-[11px] text-slate-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Farm Specifications */}
            <div className="space-y-4 pt-4 border-t border-tech-border">
              <h4 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <Cpu className="w-4 h-4 text-tech-accent" />
                <span>Print Farm Specifications Matrix</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Nozzle Diameter</label>
                  <input
                    type="text"
                    value={aboutSpecNozzle}
                    onChange={(e) => setAboutSpecNozzle(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Layer Height Range</label>
                  <input
                    type="text"
                    value={aboutSpecLayerHeight}
                    onChange={(e) => setAboutSpecLayerHeight(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Max Build Volume</label>
                  <input
                    type="text"
                    value={aboutSpecBuildVolume}
                    onChange={(e) => setAboutSpecBuildVolume(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Quality Inspection</label>
                  <input
                    type="text"
                    value={aboutSpecQuality}
                    onChange={(e) => setAboutSpecQuality(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CONTACT & SOCIAL TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-white text-base font-sans flex items-center gap-2">
              <Phone className="w-4 h-4 text-tech-accent" />
              <span>Business Contact & Social Channels</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">WhatsApp Order Number</label>
                <input
                  type="text"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="e.g. 918761053230"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Official Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. senaz3dprints@gmail.com"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Dispatch / Studio Location Text</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="e.g. India | Nationwide Dispatch"
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">Instagram Profile URL</label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">YouTube Channel URL</label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. FAQS TAB */}
        {activeTab === 'faqs' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-sans flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-tech-accent" />
                <span>Frequently Asked Questions</span>
              </h3>
              <button
                type="button"
                onClick={addFaq}
                className="px-3 py-1.5 bg-tech-accent text-tech-bg font-bold font-mono text-xs rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 bg-tech-bg/70 rounded-xl border border-tech-border space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-tech-accent">Q{idx + 1}.</span>
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                    placeholder="Question..."
                    className="w-full bg-tech-card border border-tech-border rounded p-2 text-xs text-white font-bold"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                    placeholder="Answer..."
                    className="w-full bg-tech-card border border-tech-border rounded p-2 text-xs text-slate-300 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="pt-4 border-t border-tech-border flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Changes reflect instantly across the live website.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-tech-accent text-tech-bg font-extrabold text-xs font-mono rounded-xl hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-tech-accent/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Live...' : 'Save Website Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}


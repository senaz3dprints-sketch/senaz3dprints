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
  MapPin,
  RotateCcw,
  Sliders,
  Package,
} from 'lucide-react';
import {
  ShippingZone,
  DEFAULT_SHIPPING_ZONES,
  DEFAULT_SHIPPING_SETTINGS,
  ALL_INDIAN_STATES,
} from '@/lib/shipping-utils';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'about' | 'contact' | 'faqs' | 'shipping'>('homepage');

  // Shipping & Delivery States
  const [shippingDefaultRate, setShippingDefaultRate] = useState(60);
  const [shippingFreeThreshold, setShippingFreeThreshold] = useState(0);
  const [shippingNote, setShippingNote] = useState('Standard delivery in 3-5 business days across India');
  const [shippingCalculationMode, setShippingCalculationMode] = useState<
    'MAX_OF_ZONE_AND_PRODUCTS' | 'ZONE_PLUS_PRODUCT_SURCHARGES' | 'ZONE_BASE'
  >('MAX_OF_ZONE_AND_PRODUCTS');
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(DEFAULT_SHIPPING_ZONES);
  const [selectedStateToAdd, setSelectedStateToAdd] = useState<{ [zoneId: string]: string }>({});

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
          const s = data.settings;
          setShippingDefaultRate(typeof s.defaultRate === 'number' ? s.defaultRate : (typeof s.flatRate === 'number' ? s.flatRate : 60));
          setShippingFreeThreshold(typeof s.freeShippingThreshold === 'number' ? s.freeShippingThreshold : 0);
          if (s.shippingNote) setShippingNote(s.shippingNote);
          if (s.calculationMode) setShippingCalculationMode(s.calculationMode);
          if (Array.isArray(s.zones) && s.zones.length > 0) setShippingZones(s.zones);
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
            defaultRate: Number(shippingDefaultRate) || 0,
            freeShippingThreshold: Number(shippingFreeThreshold) || 0,
            shippingNote,
            calculationMode: shippingCalculationMode,
            zones: shippingZones,
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-tech-border/60 pb-3">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base font-sans flex items-center gap-2">
                  <Truck className="w-4 h-4 text-tech-accent" />
                  <span>Shipping Rates & Regional Delivery Configuration</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Configure nationwide regional delivery charges (Option B), individual product overrides (Option A), and free delivery thresholds.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShippingZones(DEFAULT_SHIPPING_ZONES);
                  setShippingDefaultRate(60);
                  setShippingFreeThreshold(0);
                  setShippingCalculationMode('MAX_OF_ZONE_AND_PRODUCTS');
                }}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-tech-bg hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-tech-border text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Reset all zones and rates to factory defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="p-4 bg-tech-bg/70 rounded-xl border border-tech-border space-y-2.5">
              <span className="text-xs font-mono font-bold text-slate-300">Quick Configuration Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShippingDefaultRate(0);
                    setShippingFreeThreshold(0);
                    setShippingZones(shippingZones.map((z) => ({ ...z, rate: 0 })));
                    setShippingNote('Free All-India Delivery on all orders');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border text-slate-200 text-xs font-mono border border-tech-border transition-colors"
                >
                  🎁 Free Delivery for Everyone
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShippingZones(DEFAULT_SHIPPING_ZONES);
                    setShippingDefaultRate(60);
                    setShippingFreeThreshold(499);
                    setShippingCalculationMode('MAX_OF_ZONE_AND_PRODUCTS');
                    setShippingNote('Free delivery on orders above ₹499 (NE: ₹40, Metro: ₹60, ROI: ₹75)');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border text-slate-200 text-xs font-mono border border-tech-border transition-colors text-tech-accent border-tech-accent/40"
                >
                  🚚 Standard Regional + Free Above ₹499 (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShippingDefaultRate(50);
                    setShippingFreeThreshold(499);
                    setShippingZones(shippingZones.map((z) => ({ ...z, rate: 50 })));
                    setShippingNote('Free delivery on orders above ₹499 (otherwise ₹50)');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border text-slate-200 text-xs font-mono border border-tech-border transition-colors"
                >
                  🚀 Flat ₹50 + Free Above ₹499
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShippingDefaultRate(70);
                    setShippingFreeThreshold(999);
                    setShippingZones(shippingZones.map((z) => ({ ...z, rate: 70 })));
                    setShippingNote('Free delivery on orders above ₹999 (otherwise ₹70)');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border text-slate-200 text-xs font-mono border border-tech-border transition-colors"
                >
                  ⚡ Flat ₹70 + Free Above ₹999
                </button>
              </div>
            </div>

            {/* Dual Calculation Strategy Selector */}
            <div className="p-4 rounded-xl bg-tech-card border border-tech-border space-y-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-tech-accent" />
                <label className="text-xs font-mono text-slate-200 font-bold">
                  Calculation Logic (Regional Zones & Individual Product Rates):
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div
                  onClick={() => setShippingCalculationMode('MAX_OF_ZONE_AND_PRODUCTS')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    shippingCalculationMode === 'MAX_OF_ZONE_AND_PRODUCTS'
                      ? 'bg-tech-accent/10 border-tech-accent shadow-sm shadow-tech-accent/10'
                      : 'bg-tech-bg/50 border-tech-border hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono text-white">Hybrid Smart Max</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-tech-accent/20 text-tech-accent font-semibold">Recommended</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                    Takes the <strong>higher</strong> of the destination Zone Rate OR individual product shipping charge. Ideal for standard orders with occasional bulky items.
                  </p>
                </div>

                <div
                  onClick={() => setShippingCalculationMode('ZONE_PLUS_PRODUCT_SURCHARGES')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    shippingCalculationMode === 'ZONE_PLUS_PRODUCT_SURCHARGES'
                      ? 'bg-tech-accent/10 border-tech-accent shadow-sm shadow-tech-accent/10'
                      : 'bg-tech-bg/50 border-tech-border hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono text-white">Zone + Product Surcharge</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                    Charges the base Regional Zone rate <strong>plus</strong> any specific product extra shipping fees added in the catalog.
                  </p>
                </div>

                <div
                  onClick={() => setShippingCalculationMode('ZONE_BASE')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    shippingCalculationMode === 'ZONE_BASE'
                      ? 'bg-tech-accent/10 border-tech-accent shadow-sm shadow-tech-accent/10'
                      : 'bg-tech-bg/50 border-tech-border hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono text-white">Zone Base Only</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                    Strictly applies the destination Zone delivery rate, ignoring individual product fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Thresholds & Fallback */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  e.g. 499 means orders of ₹499 or more receive 100% FREE delivery. Set to 0 to disable.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1 font-semibold">
                  Fallback Delivery Rate (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={shippingDefaultRate}
                  onChange={(e) => setShippingDefaultRate(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                  placeholder="60"
                />
                <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                  Used if a customer's state does not match any configured regional zone.
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

            {/* Regional Shipping Zones Management */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-tech-accent" />
                    <span>Regional Destination Zones ({shippingZones.length})</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Define delivery rates per geographical cluster and state assignments.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newId = `custom_zone_${Date.now()}`;
                    setShippingZones([
                      ...shippingZones,
                      { id: newId, name: 'Custom Regional Zone', states: [], rate: 50 },
                    ]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-tech-card hover:bg-tech-border border border-tech-border text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-tech-accent" />
                  <span>Add Zone</span>
                </button>
              </div>

              <div className="space-y-4">
                {shippingZones.map((zone, zIndex) => (
                  <div
                    key={zone.id || zIndex}
                    className="p-4 rounded-xl bg-tech-card border border-tech-border space-y-3.5 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-tech-border/60 pb-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Zone Name</label>
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => {
                            const updated = [...shippingZones];
                            updated[zIndex].name = e.target.value;
                            setShippingZones(updated);
                          }}
                          className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-tech-accent"
                          placeholder="e.g. Assam & North East (Local Zone)"
                        />
                      </div>

                      <div className="w-full sm:w-44">
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">Delivery Charge (₹)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">₹</span>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={zone.rate}
                            onChange={(e) => {
                              const updated = [...shippingZones];
                              updated[zIndex].rate = Math.max(0, parseInt(e.target.value) || 0);
                              setShippingZones(updated);
                            }}
                            className="w-full bg-tech-bg border border-tech-border rounded-lg pl-7 pr-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-tech-accent"
                          />
                        </div>
                      </div>

                      {shippingZones.length > 1 && (
                        <div className="sm:self-end">
                          <button
                            type="button"
                            onClick={() => {
                              setShippingZones(shippingZones.filter((_, idx) => idx !== zIndex));
                            }}
                            className="p-2 rounded-lg bg-tech-bg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-tech-border transition-colors"
                            title="Delete Zone"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* States List in Zone */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Assigned States & UTs ({zone.states.length}):</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {zone.states.map((st, sIndex) => (
                          <span
                            key={st}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tech-bg border border-tech-border text-[11px] font-mono text-slate-200"
                          >
                            <span>{st}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...shippingZones];
                                updated[zIndex].states = updated[zIndex].states.filter((_, idx) => idx !== sIndex);
                                setShippingZones(updated);
                              }}
                              className="text-slate-400 hover:text-rose-400 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}

                        {zone.states.length === 0 && (
                          <span className="text-xs text-amber-400/80 font-mono italic">
                            No states assigned yet.
                          </span>
                        )}
                      </div>

                      {/* Add State to Zone */}
                      <div className="pt-2 flex items-center gap-2 max-w-sm">
                        <select
                          value={selectedStateToAdd[zone.id] || ''}
                          onChange={(e) => {
                            setSelectedStateToAdd({
                              ...selectedStateToAdd,
                              [zone.id]: e.target.value,
                            });
                          }}
                          className="bg-tech-bg border border-tech-border rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-tech-accent flex-1"
                        >
                          <option value="">+ Select State to Add...</option>
                          {ALL_INDIAN_STATES.filter((st) => !zone.states.includes(st)).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!selectedStateToAdd[zone.id]}
                          onClick={() => {
                            const stateToAdd = selectedStateToAdd[zone.id];
                            if (!stateToAdd) return;
                            const updated = [...shippingZones];
                            if (!updated[zIndex].states.includes(stateToAdd)) {
                              updated[zIndex].states.push(stateToAdd);
                              setShippingZones(updated);
                            }
                            setSelectedStateToAdd({
                              ...selectedStateToAdd,
                              [zone.id]: '',
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-tech-accent text-tech-bg text-xs font-mono font-bold hover:bg-tech-accent/90 disabled:opacity-40 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="p-4 rounded-xl bg-tech-bg border border-tech-border space-y-2.5">
              <span className="text-xs font-mono font-bold text-tech-accent flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Live Shipping Rules Summary:</span>
              </span>
              <div className="text-xs font-mono text-slate-300 space-y-1.5 leading-relaxed">
                <p>
                  • <strong>Calculation Mode:</strong>{' '}
                  <span className="text-white font-semibold">{shippingCalculationMode}</span>
                </p>
                <p>
                  • <strong>Free Delivery Rule:</strong>{' '}
                  {shippingFreeThreshold > 0 ? (
                    <span className="text-emerald-400 font-semibold">
                      Orders of ₹{shippingFreeThreshold} or more receive FREE Shipping nationwide.
                    </span>
                  ) : (
                    <span className="text-slate-400">No free shipping threshold configured.</span>
                  )}
                </p>
                <div className="pt-1">
                  <p className="text-slate-400 mb-1">• <strong>Active Regional Rates:</strong></p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-[11px] text-slate-300">
                    {shippingZones.map((z) => (
                      <li key={z.id || z.name}>
                        <strong className="text-white">{z.name}:</strong> ₹{z.rate}{' '}
                        <span className="text-slate-500">({z.states.length} states)</span>
                      </li>
                    ))}
                    <li>
                      <strong className="text-white">Unlisted / Fallback State:</strong> ₹{shippingDefaultRate}
                    </li>
                  </ul>
                </div>
                <p className="pt-1 text-slate-400">
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


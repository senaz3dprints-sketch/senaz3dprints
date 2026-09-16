import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import PersonalizationPreview from '@/components/PersonalizationPreview';
import {
  Upload,
  Layers,
  ShieldCheck,
  Zap,
  MessageCircle,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Star,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const revalidate = 0; // Dynamic rendering for fresh site content

export default async function HomePage() {
  // Fetch Featured Products & Categories from Database
  const products = await db.product.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  const categories = await db.category.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  // Fetch Editable Site Content
  const siteContentRecord = await db.siteContent.findUnique({
    where: { key: 'homepage' },
  });
  let content = {
    heroTitle: 'Made to Print. Built for You.',
    heroSubtitle:
      'Custom 3D printed products, personalised designs and functional creations made to your specifications.',
    primaryCtaText: 'Shop Products',
    secondaryCtaText: 'Get a Custom Print',
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

  if (siteContentRecord?.content) {
    try {
      content = { ...content, ...JSON.parse(siteContentRecord.content) };
    } catch (e) {}
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <HeroSection
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        primaryCta={content.primaryCtaText}
        secondaryCta={content.secondaryCtaText}
      />

      {/* 2. FEATURED PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-tech-accent uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Precision Crafted</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-mono text-tech-accent hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              shortDescription={product.shortDescription}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              images={product.images}
              material={product.material}
              colors={product.colors}
              isFeatured={product.isFeatured}
              isNew={product.isNew}
              personalizationEnabled={product.personalizationEnabled}
              category={product.category}
            />
          ))}
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES GRID */}
      <section className="bg-tech-card/50 border-y border-tech-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
              Flexible Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              From personalized gifts to technical desk accessories and custom STL printing.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative rounded-xl bg-tech-bg border border-tech-border hover:border-tech-accent/50 p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center mb-3 group-hover:border-tech-accent transition-colors">
                  <Printer className="w-6 h-6 text-tech-accent group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-tech-accent transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono mt-1">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PERSONALISATION FEATURE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-tech-card rounded-2xl border border-tech-border p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/30 text-xs font-mono text-tech-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalised Name Products</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans leading-tight">
              Turn Names & Ideas into Tactile 3D Objects.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Customize keychains, desk nameplates, and monogram tags with your exact text. Pick from arctic white, obsidian black, ruby red, or silk gold layers.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/shop?category=personalised"
                className="px-6 py-3 rounded-lg bg-tech-accent text-tech-bg font-bold text-xs font-mono hover:bg-tech-accent/90 transition-all flex items-center gap-2"
              >
                <span>Browse Personalised Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <PersonalizationPreview
              initialText="SENAZ 3D"
            />
          </div>
        </div>
      </section>

      {/* 5. CUSTOM 3D PRINTING SERVICE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-950 via-tech-card to-tech-bg border border-tech-accent/30 p-8 sm:p-12 text-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-tech-accent font-semibold uppercase tracking-wider">
              <Upload className="w-4 h-4" />
              <span>Custom STL / OBJ Service</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Have a 3D idea or model file?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Send us your .stl, .obj, .3mf model file or a reference sketch. We’ll analyze the mesh, calculate print hours, and provide an instant WhatsApp quote.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/custom-printing"
              className="px-8 py-4 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all text-center shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Model & Quote</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
            Simple Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            How SENAZ Printing Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-tech-card p-6 rounded-xl border border-tech-border space-y-3 relative">
            <span className="text-xs font-mono font-bold text-tech-accent bg-tech-bg px-2.5 py-1 rounded border border-tech-border inline-block">
              STEP 01
            </span>
            <h3 className="text-lg font-semibold text-white font-sans">Select or Upload</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose a product from our catalog or upload your custom 3D model file (.stl, .obj, .3mf) on our website.
            </p>
          </div>

          <div className="bg-tech-card p-6 rounded-xl border border-tech-border space-y-3 relative">
            <span className="text-xs font-mono font-bold text-tech-accent bg-tech-bg px-2.5 py-1 rounded border border-tech-border inline-block">
              STEP 02
            </span>
            <h3 className="text-lg font-semibold text-white font-sans">WhatsApp Confirmation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive live text preview approvals, material specs, stock confirmation, and payment options via WhatsApp.
            </p>
          </div>

          <div className="bg-tech-card p-6 rounded-xl border border-tech-border space-y-3 relative">
            <span className="text-xs font-mono font-bold text-tech-accent bg-tech-bg px-2.5 py-1 rounded border border-tech-border inline-block">
              STEP 03
            </span>
            <h3 className="text-lg font-semibold text-white font-sans">Print & Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Printed at sub-millimeter precision on calibrated FDM/Resin printers, quality tested, and dispatched across India.
            </p>
          </div>
        </div>
      </section>

      {/* 7. WHY SENAZ */}
      <section className="bg-tech-card/40 border-y border-tech-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
                Engineering Quality
              </span>
              <h2 className="text-3xl font-extrabold text-white font-sans tracking-tight">
                Why Choose SENAZ 3D PRINTS?
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-tech-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">0.12mm Micro Layer Accuracy</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      Smooth surface finishes with minimal visible print lines.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Industrial PLA+ & PETG Filaments</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      High impact strength, temperature tolerance, and vibrant non-fading colors.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Rapid 24-48hr Production</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      In-house print farm optimized for fast turnaround without compromising detail.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="SENAZ 3D Printing Quality"
                className="w-full h-80 lg:h-96 object-cover rounded-2xl border border-tech-border shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-tech-card/95 border border-tech-border backdrop-blur-md p-3.5 rounded-xl font-mono text-xs text-slate-200">
                <span className="text-tech-accent font-bold">SENAZ Quality Check:</span> Passed 100% Surface Inspection
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
            Real Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            What Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Arjun K.',
              role: 'Product Designer',
              comment:
                'Uploaded an STL file for a prototype enclosure. The layer smoothness and dimension tolerance were spot on. Quick WhatsApp update too!',
              stars: 5,
            },
            {
              name: 'Priya Sharma',
              role: 'Verified Buyer',
              comment:
                'Ordered personalized name keychains for my team. The dual-color text looks premium and feel super solid in hand. Highly recommended!',
              stars: 5,
            },
            {
              name: 'Vikram R.',
              role: 'Tech Enthusiast',
              comment:
                'The Low-Poly Dragon statue sits right next to my setup. Crisp geometric edges and fast delivery. SENAZ is my go-to print lab now.',
              stars: 5,
            },
          ].map((t, idx) => (
            <div key={idx} className="bg-tech-card p-6 rounded-xl border border-tech-border space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">"{t.comment}"</p>
              <div className="pt-2 border-t border-tech-border/60 font-mono text-xs">
                <span className="font-bold text-white block">{t.name}</span>
                <span className="text-slate-500 text-[10px]">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {content.faqItems.map((item: any, idx: number) => (
            <div key={idx} className="bg-tech-card p-5 rounded-xl border border-tech-border space-y-2">
              <h4 className="font-semibold text-white text-sm font-sans flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-tech-accent shrink-0" />
                <span>{item.question}</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-tech-card rounded-2xl border border-tech-border p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
            Ready to Bring Your 3D Idea to Life?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Browse our products catalog or send us your STL model file directly on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20"
            >
              Shop Catalog
            </Link>
            <a
              href="https://wa.me/918761053230"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm font-mono hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import CustomerShowcase from '@/components/CustomerShowcase';
import CustomOrderDualSection from '@/components/CustomOrderDualSection';
import CustomerFeedbackSection from '@/components/CustomerFeedbackSection';
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
  SlidersHorizontal,
  PenTool,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [products, personalizedProducts, categories, siteContentRecord, customShowcaseProducts, initialFeedbacks] = await Promise.all([
    // 1. Featured / Catalog Products
    db.product.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        images: true,
        material: true,
        colors: true,
        isFeatured: true,
        isNew: true,
        personalizationEnabled: true,
        shippingFee: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 8,
    }).catch(() => []),

    // 2. Personalized / Customized Products
    db.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { personalizationEnabled: true },
          { name: { contains: 'custom', mode: 'insensitive' } },
          { name: { contains: 'name', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        images: true,
        material: true,
        colors: true,
        isFeatured: true,
        isNew: true,
        personalizationEnabled: true,
        shippingFee: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 4,
    }).catch(() => []),

    // 3. Categories
    db.category.findMany({
      orderBy: { displayOrder: 'asc' },
    }).catch(() => []),

    // 4. Site Content
    db.siteContent.findUnique({
      where: { key: 'homepage' },
    }).catch(() => null),

    // 5. Custom Creations / Showcase Products
    db.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { category: { slug: 'custom-prints' } },
          { personalizationEnabled: true },
          { name: { contains: 'photo', mode: 'insensitive' } },
          { name: { contains: 'custom', mode: 'insensitive' } },
          { name: { contains: 'model', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        images: true,
        material: true,
        personalizationEnabled: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
    }).catch(() => []),

    // 6. Customer Testimonials / Feedbacks
    db.feedback.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }).catch(() => []),
  ]);

  let content = {
    heroTitle: 'Made to Print. Built for You.',
    heroSubtitle:
      'Custom 3D printed products, personalized designs, and high-precision functional parts made to your exact specifications. Available in PLA/PLA+, PETG, TPU, ASA, ABS, and Nylon.',
    primaryCtaText: 'Shop Products',
    secondaryCtaText: 'Get a Custom Print',
    faqItems: [
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

      {/* 2. DEDICATED PERSONALIZED & CUSTOM 3D GIFTS SECTION */}
      {personalizedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-brand-950/70 via-tech-card/90 to-tech-bg border border-tech-accent/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-tech-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-tech-border/70 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tech-accent/10 border border-tech-accent/40 text-xs font-mono text-tech-accent font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Personalized & Custom Crafted</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                    Custom Name & Photo 3D Prints
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 font-sans mt-1 max-w-2xl">
                    Add your name, custom text, favorite logo, or transform personal photos into stunning 3D printed keepsakes.
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-tech-accent hover:text-white font-semibold transition-colors shrink-0"
                  aria-label="Explore all personalized 3D print items"
                >
                  <span>Explore All Personalised</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Highlight Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-tech-bg/80 border border-tech-border/70">
                  <div className="w-9 h-9 rounded-lg bg-tech-accent/10 border border-tech-accent/30 flex items-center justify-center shrink-0">
                    <PenTool className="w-4 h-4 text-tech-accent" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-sans">Custom Name Engraving</h3>
                    <p className="text-[11px] text-slate-300">High-contrast dual color text</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-tech-bg/80 border border-tech-border/70">
                  <div className="w-9 h-9 rounded-lg bg-tech-accent/10 border border-tech-accent/30 flex items-center justify-center shrink-0">
                    <Palette className="w-4 h-4 text-tech-accent" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-sans">Choice of 20+ Filaments</h3>
                    <p className="text-[11px] text-slate-300">Vibrant, silk & matte finishes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-tech-bg/80 border border-tech-border/70">
                  <div className="w-9 h-9 rounded-lg bg-tech-accent/10 border border-tech-accent/30 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4 text-tech-accent" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-sans">2D Photo to 3D Statues</h3>
                    <p className="text-[11px] text-slate-300">Turn photos into physical art</p>
                  </div>
                </div>
              </div>

              {/* Personalized Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {personalizedProducts.map((product) => (
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
                    shippingFee={product.shippingFee}
                    category={product.category}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED PRODUCTS CATALOG */}
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
            aria-label="View full 3D printed products catalog"
          >
            <span>View Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
              shippingFee={product.shippingFee}
              category={product.category}
            />
          ))}
        </div>
      </section>

      {/* 4. PRODUCT CATEGORIES GRID */}
      <section className="bg-tech-card/50 border-y border-tech-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
              Flexible Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              From personalized gifts to technical desk accessories and custom STL printing.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                aria-label={`Browse ${cat.name} 3D prints`}
                className="group relative rounded-xl bg-tech-bg border border-tech-border hover:border-tech-accent/50 p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-tech-card border border-tech-border overflow-hidden flex items-center justify-center mb-3 group-hover:border-tech-accent transition-colors">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <Printer className="w-6 h-6 text-tech-accent group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-tech-accent transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono mt-1">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER SHOWCASE / HALL OF PRINTS (MADE FOR CUSTOMERS) */}
      {customShowcaseProducts.length > 0 && (
        <CustomerShowcase customProducts={customShowcaseProducts} />
      )}

      {/* 6. CUSTOM 3D PRINTING DUAL PATHWAY (FILE UPLOAD VS WHATSAPP CHAT) */}
      <CustomOrderDualSection />

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
            Simple Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            How SenAZ Printing Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-tech-card p-6 rounded-xl border border-tech-border space-y-3 relative">
            <span className="text-xs font-mono font-bold text-tech-accent bg-tech-bg px-2.5 py-1 rounded border border-tech-border inline-block">
              STEP 01
            </span>
            <h3 className="text-lg font-semibold text-white font-sans">Select or Upload</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Choose a product from our catalog or upload your custom 3D model file (.stl, .obj, .3mf) on our website.
            </p>
          </div>

          <div className="bg-tech-card p-6 rounded-xl border border-tech-border space-y-3 relative">
            <span className="text-xs font-mono font-bold text-tech-accent bg-tech-bg px-2.5 py-1 rounded border border-tech-border inline-block">
              STEP 02
            </span>
            <h3 className="text-lg font-semibold text-white font-sans">WhatsApp Confirmation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receive live text preview approvals, material specs, stock confirmation, and payment options via WhatsApp.
            </p>
          </div>

          <div className="bg-tech-card p-6 rounded-xl border border-tech-border space-y-3 relative">
            <span className="text-xs font-mono font-bold text-tech-accent bg-tech-bg px-2.5 py-1 rounded border border-tech-border inline-block">
              STEP 03
            </span>
            <h3 className="text-lg font-semibold text-white font-sans">Print & Dispatch</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Printed with high precision on calibrated FDM printers, quality tested, and dispatched across India.
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
                Why Choose SenAZ 3D PRINTS?
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-tech-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Micro Layer Accuracy</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      Smooth surface finishes with minimal visible print lines.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Industrial PLA+ & PETG Filaments</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      High impact strength, temperature tolerance, and vibrant non-fading colors.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Rapid 24-48hr Production</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      In-house print farm optimized for fast turnaround without compromising detail.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="SenAZ 3D Printing Quality"
                className="w-full h-80 lg:h-96 object-cover rounded-2xl border border-tech-border shadow-2xl"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 bg-tech-card/95 border border-tech-border backdrop-blur-md p-3.5 rounded-xl font-mono text-xs text-slate-200">
                <span className="text-tech-accent font-bold">SenAZ Quality Check:</span> Passed 100% Surface Inspection
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS & FEEDBACK SECTION */}
      <CustomerFeedbackSection initialFeedbacks={initialFeedbacks} />

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
              <h3 className="font-semibold text-white text-sm font-sans flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-tech-accent shrink-0" />
                <span>{item.question}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{item.answer}</p>
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
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto">
            Browse our products catalog or send us your STL model file directly on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              aria-label="Shop catalog products"
              className="px-8 py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20"
            >
              Shop Catalog
            </Link>
            <a
              href="https://wa.me/918761053230"
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with SenAZ 3D PRINTS on WhatsApp"
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

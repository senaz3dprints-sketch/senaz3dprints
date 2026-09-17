'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import PersonalizationPreview from '@/components/PersonalizationPreview';
import ProductCard from '@/components/ProductCard';
import { generateProductInquiryUrl } from '@/lib/whatsapp';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product.id);

  // Parse Images JSON
  let imageList: string[] = [];
  try {
    imageList = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  } catch (e) {
    imageList = [product.images];
  }
  const [selectedImage, setSelectedImage] = useState(imageList[0] || 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80');

  // Parse Colors JSON
  let colorList: string[] = [];
  if (product.colors) {
    try {
      colorList = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors;
    } catch (e) {}
  }
  const [selectedColor, setSelectedColor] = useState(colorList[0] || 'Default');

  // Parse Sizes JSON
  let sizeList: string[] = [];
  if (product.sizes) {
    try {
      sizeList = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
    } catch (e) {}
  }
  const [selectedSize, setSelectedSize] = useState(sizeList[0] || 'Standard');

  // Personalization state
  const [personalizedText, setPersonalizedText] = useState('YOUR NAME');
  const [quantity, setQuantity] = useState(1);

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: selectedImage,
      price: product.price,
      shippingFee: product.shippingFee || 0,
      quantity,
      color: selectedColor,
      size: selectedSize,
      personalizedText: product.personalizationEnabled ? personalizedText : undefined,
    });
  };

  const whatsappInquiryUrl = generateProductInquiryUrl(product.name, product.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-white">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 truncate">{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full bg-tech-card rounded-2xl border border-tech-border overflow-hidden shadow-2xl">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white font-mono font-extrabold text-xs px-2.5 py-1 rounded">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {imageList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-tech-accent scale-95'
                      : 'border-tech-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Order Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-mono text-tech-accent uppercase tracking-wider block mb-1">
              {product.category?.name || '3D Printed Product'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-bold text-white font-mono">₹{product.price}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-slate-500 line-through font-mono">
                  ₹{product.compareAtPrice}
                </span>
              )}
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                In Stock ({product.stockQuantity} available)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {product.fullDescription || product.shortDescription}
          </p>

          {/* Personalization Section if enabled */}
          {product.personalizationEnabled && (
            <div className="pt-2">
              <PersonalizationPreview
                initialText="YOUR NAME"
                colors={colorList.length > 0 ? colorList : undefined}
                onPersonalizationChange={(data) => {
                  setPersonalizedText(data.text);
                  if (data.textColor || data.color) {
                    setSelectedColor(data.textColor || data.color || '');
                  }
                }}
              />
            </div>
          )}

          {/* Color Selector (if not personalization handled) */}
          {!product.personalizationEnabled && colorList.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                Available Colors:
              </label>
              <div className="flex flex-wrap gap-2">
                {colorList.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      selectedColor === color
                        ? 'bg-tech-accent/20 border-tech-accent text-tech-accent font-semibold'
                        : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizeList.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                Select Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeList.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      selectedSize === sz
                        ? 'bg-tech-accent/20 border-tech-accent text-tech-accent font-semibold'
                        : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="pt-4 border-t border-tech-border space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-slate-300">Quantity:</span>
              <div className="flex items-center border border-tech-border rounded-lg bg-tech-card">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono text-white font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Order Bag</span>
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm font-mono hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="bg-tech-card rounded-xl border border-tech-border p-4 space-y-2 text-xs font-mono">
            <span className="text-slate-200 font-bold uppercase tracking-wider block border-b border-tech-border pb-2">
              Technical Specifications
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
              <div>
                Material: <span className="text-white font-semibold">{product.material}</span>
              </div>
              {product.weight && (
                <div>
                  Weight: <span className="text-white font-semibold">{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  Dimensions: <span className="text-white font-semibold">{product.dimensions}</span>
                </div>
              )}
              <div>
                Print Resolution: <span className="text-tech-accent font-semibold">High Precision</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-tech-border space-y-6">
          <h2 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                id={rel.id}
                name={rel.name}
                slug={rel.slug}
                shortDescription={rel.shortDescription}
                price={rel.price}
                compareAtPrice={rel.compareAtPrice}
                images={rel.images}
                material={rel.material}
                colors={rel.colors}
                personalizationEnabled={rel.personalizationEnabled}
                shippingFee={rel.shippingFee}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

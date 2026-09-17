'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Filter, SlidersHorizontal, Heart, Search, Sparkles } from 'lucide-react';

interface ShopClientProps {
  initialProducts: any[];
  categories: any[];
}

export default function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const filterParam = searchParams.get('filter') || '';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortOption, setSortOption] = useState('newest');
  const [showWishlistOnly, setShowWishlistOnly] = useState(filterParam === 'wishlist');

  const { wishlist } = useCart();

  // Sync state when URL searchParams change
  React.useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setShowWishlistOnly(searchParams.get('filter') === 'wishlist');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Wishlist filter
    if (showWishlistOnly) {
      list = list.filter((p) => wishlist.includes(p.id));
    }

    // Category filter
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        list = list.filter((p) => p.categoryId === cat.id);
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          (p.category?.name && p.category.name.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortOption === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [initialProducts, selectedCategory, showWishlistOnly, searchQuery, sortOption, wishlist, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-tech-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
            Product Catalogue
          </span>
          <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">
            {showWishlistOnly ? 'Your Saved Wishlist' : 'Shop 3D Printed Products'}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Wishlist Toggle Button */}
          <button
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-mono border flex items-center gap-2 transition-all ${
              showWishlistOnly
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold'
                : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-rose-400' : ''}`} />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-slate-400">Sort:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-tech-card border border-tech-border text-xs text-white rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-tech-accent"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-tech-border/60 pb-4">
        <button
          onClick={() => {
            setSelectedCategory('');
            setShowWishlistOnly(false);
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            !selectedCategory && !showWishlistOnly
              ? 'bg-tech-accent/20 border-tech-accent text-tech-accent font-semibold'
              : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500'
          }`}
        >
          All Products
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.slug);
              setShowWishlistOnly(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              selectedCategory === cat.slug && !showWishlistOnly
                ? 'bg-tech-accent/20 border-tech-accent text-tech-accent font-semibold'
                : 'bg-tech-card border-tech-border text-slate-300 hover:border-slate-500'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search Input Bar inside shop */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          placeholder="Filter products by name or material..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-tech-card border border-tech-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-tech-accent font-mono"
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-tech-card rounded-2xl border border-tech-border p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <Filter className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">
            {showWishlistOnly ? 'Your wishlist is empty' : 'No products found'}
          </h3>
          <p className="text-xs text-slate-400">
            {showWishlistOnly
              ? 'Click the heart icon on any product card to save it to your wishlist!'
              : 'No products matched your selected category or search filter.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('');
              setShowWishlistOnly(false);
              setSearchQuery('');
            }}
            className="inline-block px-5 py-2.5 rounded-lg bg-tech-accent text-tech-bg text-xs font-mono font-bold hover:bg-tech-accent/90 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
      )}
    </div>
  );
}

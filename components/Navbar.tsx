'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Search, Menu, X, Printer, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Custom Printing', href: '/custom-printing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) return null; // Admin has its own dedicated sidebar layout

  return (
    <>
      <header className="sticky top-0 z-40 bg-tech-bg/90 backdrop-blur-md border-b border-tech-border text-slate-100">
        {/* Top Announcement Bar */}
        <div className="bg-brand-950/80 border-b border-brand-900/60 text-xs py-1.5 px-4 text-center text-slate-300 flex items-center justify-center gap-2 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-tech-accent animate-pulse"></span>
          <span>Fast Dispatch across India | Custom 3D Orders Accepted via WhatsApp</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-brand-950/80 border border-tech-accent/40 flex items-center justify-center overflow-hidden group-hover:border-tech-accent transition-colors shadow-sm shrink-0">
              <Image
                src="/images/logo-icon.png"
                alt="SenAZ 3D PRINTS Logo"
                width={36}
                height={36}
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg leading-tight font-sans text-white">
                Sen<span className="text-tech-accent">AZ</span> <span className="text-tech-accent font-mono text-sm font-semibold">3D PRINTS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Ideas Into Reality
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-tech-accent ${
                    isActive ? 'text-tech-accent font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-tech-card text-slate-300 hover:text-white transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/shop?filter=wishlist"
              className="p-2 rounded-lg hover:bg-tech-card text-slate-300 hover:text-white transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-lg bg-tech-accent/10 border border-tech-accent/30 text-tech-accent hover:bg-tech-accent/20 transition-all flex items-center gap-2 relative"
              aria-label="Order Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-mono font-semibold">Bag</span>
              {cartCount > 0 && (
                <span className="bg-tech-accent text-tech-bg text-xs font-extrabold px-1.5 py-0.5 rounded-full font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Quick Link */}
            <Link
              href="/admin/login"
              className="hidden lg:flex p-2 rounded-lg hover:bg-tech-card text-slate-400 hover:text-slate-200 transition-colors"
              title="Admin Portal"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-tech-card text-slate-300"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-tech-card border-b border-tech-border px-4 pt-3 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-tech-accent/10 text-tech-accent font-semibold'
                    : 'text-slate-200 hover:bg-tech-border'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-tech-border flex justify-between items-center text-xs text-slate-400 font-mono">
              <Link href="/admin/login" className="hover:text-tech-accent">
                Owner Dashboard →
              </Link>
              <span>senaz3dprints.in</span>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Custom Printing', href: '/custom-printing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY.current;

          // Automatically close mobile menu immediately if user starts scrolling
          if (Math.abs(delta) > 8 && mobileMenuOpen) {
            setMobileMenuOpen(false);
          }

          // Near top of page: always keep header visible
          if (currentScrollY <= 40) {
            setIsVisible(true);
          } else if (delta > 12 && currentScrollY > 100) {
            // Significant downward scroll: hide header smoothly
            setIsVisible(false);
          } else if (delta < -8) {
            // Scrolling upwards: reveal header smoothly
            setIsVisible(true);
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) return null; // Admin has its own dedicated sidebar layout

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-tech-bg/95 backdrop-blur-md border-b border-tech-border text-slate-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0 shadow-md shadow-tech-bg/50' : '-translate-y-full shadow-none'
        }`}
      >
        {/* Top Announcement Bar */}
        <div className="bg-brand-950/80 border-b border-brand-900/60 text-xs py-1.5 px-4 text-center text-slate-300 flex items-center justify-center gap-2 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-tech-accent animate-pulse"></span>
          <span>Fast Dispatch across India | Custom 3D Orders Accepted via WhatsApp</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-950/80 border border-tech-accent/40 flex items-center justify-center overflow-hidden group-hover:border-tech-accent transition-colors shadow-sm shrink-0">
              <Image
                src="/images/logo-icon.png"
                alt="SenAZ 3D PRINTS Logo"
                width={36}
                height={36}
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <div className="font-extrabold tracking-tight text-base sm:text-lg leading-tight font-sans text-white flex items-baseline gap-1">
                <span>Sen<span className="text-tech-accent">AZ</span></span>
                <span className="text-tech-accent font-mono text-xs sm:text-sm font-semibold">3D PRINTS</span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wider sm:tracking-widest uppercase leading-none mt-0.5">
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
              className="md:hidden p-2 rounded-lg hover:bg-tech-card text-slate-300 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Smooth Slide & Fade */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-tech-card border-b border-tech-border ${
            mobileMenuOpen ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0 py-0 border-transparent pointer-events-none'
          }`}
        >
          <div className="px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-tech-accent/10 text-tech-accent font-semibold'
                    : 'text-slate-200 hover:bg-tech-border'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-tech-border flex justify-between items-center text-xs text-slate-400 font-mono">
              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-tech-accent">
                Owner Dashboard →
              </Link>
              <span>senaz3dprints.in</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden transition-opacity duration-300 animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

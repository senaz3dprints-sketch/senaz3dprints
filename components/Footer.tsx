'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Printer, MessageCircle, Mail, MapPin, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-tech-bg border-t border-tech-border text-slate-400 font-sans text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-brand-950 border border-tech-accent/40 flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/images/logo-icon.png"
                  alt="SENAZ 3D PRINTS Logo"
                  width={32}
                  height={32}
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">
                SENAZ <span className="text-tech-accent font-mono text-xs font-semibold">3D PRINTS</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Custom 3D printed products, personalized designs, and high-precision functional parts made to your exact specifications. High-density PLA+, PETG, and Tough Resin prints.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5 bg-tech-card px-2.5 py-1 rounded border border-tech-border">
                <Cpu className="w-3.5 h-3.5 text-tech-accent" />
                <span>0.12mm Precision</span>
              </div>
              <div className="flex items-center gap-1.5 bg-tech-card px-2.5 py-1 rounded border border-tech-border">
                <ShieldCheck className="w-3.5 h-3.5 text-tech-accent" />
                <span>Quality Tested</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="hover:text-tech-accent transition-colors">
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link href="/custom-printing" className="hover:text-tech-accent transition-colors">
                  Custom 3D Printing
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-tech-accent transition-colors">
                  Gallery & Showcase
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-tech-accent transition-colors">
                  About SENAZ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-tech-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=keychains" className="hover:text-tech-accent transition-colors">
                  Personalised Keychains
                </Link>
              </li>
              <li>
                <Link href="/shop?category=figures" className="hover:text-tech-accent transition-colors">
                  Figures & Statues
                </Link>
              </li>
              <li>
                <Link href="/shop?category=decor" className="hover:text-tech-accent transition-colors">
                  Home & Desk Decor
                </Link>
              </li>
              <li>
                <Link href="/shop?category=desk-utility" className="hover:text-tech-accent transition-colors">
                  Desk Utility Products
                </Link>
              </li>
              <li>
                <Link href="/custom-printing" className="hover:text-tech-accent transition-colors">
                  Custom STL Printing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://wa.me/918761053230"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-tech-accent transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Order Support</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>senaz3dprints@gmail.com</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>India | Nationwide Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-tech-border flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} SENAZ 3D PRINTS (senaz3dprints.in). All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="hover:text-slate-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

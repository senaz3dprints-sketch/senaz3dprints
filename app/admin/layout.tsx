'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  UploadCloud,
  Tag,
  Share2,
  FileText,
  LogOut,
  Printer,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render full screen without sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-tech-bg text-slate-100">{children}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {}
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Custom Requests', href: '/admin/custom-requests', icon: UploadCloud },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Referrals', href: '/admin/referrals', icon: Share2 },
    { name: 'Site Content', href: '/admin/content', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-tech-bg text-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-tech-card border-r border-tech-border p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-tech-border">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-brand-950 border border-tech-accent/40 flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/images/logo-icon.png"
                  alt="SenAZ Admin Logo"
                  width={32}
                  height={32}
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-bold text-white text-sm font-sans">
                Sen<span className="text-tech-accent">AZ</span> <span className="text-tech-accent font-mono text-xs">ADMIN</span>
              </span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="p-1.5 rounded hover:bg-tech-bg text-slate-400 hover:text-white"
              title="View Public Store"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-tech-accent/20 border border-tech-accent/40 text-tech-accent font-semibold'
                      : 'text-slate-300 hover:bg-tech-bg hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Footer */}
        <div className="pt-4 border-t border-tech-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

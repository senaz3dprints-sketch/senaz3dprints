'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-tech-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-tech-card border border-tech-border rounded-2xl p-8 space-y-6 shadow-2xl text-center">
        {/* Brand Logo */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-950 border border-tech-accent/40 flex items-center justify-center mx-auto shadow-lg overflow-hidden p-1">
            <Image
              src="/images/logo-icon.png"
              alt="SenAZ 3D PRINTS Logo"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            Sen<span className="text-tech-accent">AZ</span> Admin Portal
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Direct Access Enabled
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="w-full py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-xs font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Admin Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

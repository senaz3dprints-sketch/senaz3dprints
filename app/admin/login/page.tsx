'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tech-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-tech-card border border-tech-border rounded-2xl p-8 space-y-6 shadow-2xl">
        {/* Brand Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-950 border border-tech-accent/40 flex items-center justify-center mx-auto shadow-lg overflow-hidden p-1">
            <Image
              src="/images/logo-icon.png"
              alt="SENAZ 3D PRINTS Logo"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            SENAZ Admin Portal
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage products, orders, requests & content
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
            />
          </div>

          <div className="p-3 bg-tech-bg rounded-lg border border-tech-border text-[11px] font-mono text-slate-400">
            <span className="text-tech-accent font-bold">Default Credentials:</span> Username: <span className="text-white">admin</span> | Password: <span className="text-white">admin_senaz_pass</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-xs font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

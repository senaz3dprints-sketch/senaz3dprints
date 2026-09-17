'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  Check,
  X,
  Users,
  IndianRupee,
  Copy,
  MessageCircle,
  Link as LinkIcon,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  // Form State
  const [referralCode, setReferralCode] = useState('');
  const [referrerName, setReferrerName] = useState('');
  const [referrerContact, setReferrerContact] = useState('');

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/referrals');
      if (res.ok) {
        const data = await res.json();
        setReferrals(data.referrals || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const totalPartners = referrals.length;
  const totalReferralOrders = referrals.reduce((sum, r) => sum + (r.totalReferrals || 0), 0);
  const totalReferralRevenue = referrals.reduce((sum, r) => sum + (r.totalOrderValue || 0), 0);

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://senaz3dprints.in';
    const link = `${origin}/?ref=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getWhatsAppShareUrl = (code: string, referrer: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://senaz3dprints.in';
    const link = `${origin}/?ref=${encodeURIComponent(code)}`;
    const msg = encodeURIComponent(
      `Hey! Check out custom 3D printed keychains, desk decor, and precision prints at SenAZ 3D PRINTS.\n\n` +
      `Use my referral link to get 10% OFF on your order: ${link}`
    );
    return `https://wa.me/?text=${msg}`;
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode,
        referrerName,
        referrerContact,
      }),
    });

    if (res.ok) {
      setModalOpen(false);
      setReferralCode('');
      setReferrerName('');
      setReferrerContact('');
      fetchReferrals();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to create referral code');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const res = await fetch('/api/admin/referrals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) fetchReferrals();
  };

  const handleDeleteReferral = async (id: string, code: string) => {
    if (!confirm(`Delete referral code ${code}?`)) return;
    const res = await fetch(`/api/admin/referrals?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchReferrals();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            Referral & Partner Network
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Track partner performance, live attributed customer orders, and shareable referral links (`?ref=CODE`).
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-xs font-mono hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-tech-accent/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Referral Partner</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-tech-card p-4 rounded-xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Active Partners</span>
            <Users className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalPartners}</div>
          <p className="text-[10px] font-mono text-slate-500">Registered referral codes</p>
        </div>

        <div className="bg-tech-card p-4 rounded-xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Referral Orders</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">{totalReferralOrders}</div>
          <p className="text-[10px] font-mono text-slate-500">Attributed customer orders</p>
        </div>

        <div className="bg-tech-card p-4 rounded-xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Referral Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ₹{totalReferralRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Total gross value from referrals</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-tech-card/80 border border-tech-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-slate-300">
          <LinkIcon className="w-4 h-4 text-tech-accent shrink-0" />
          <span>
            Referral Link Format: <strong className="text-tech-accent">https://senaz3dprints.in/?ref=CODE</strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Customers using referral links automatically receive 10% discount on checkout.
        </span>
      </div>

      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Referral Code</th>
                <th className="p-3.5">Share Link</th>
                <th className="p-3.5">Referrer Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Orders</th>
                <th className="p-3.5">Generated Value</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {referrals.map((r) => {
                const isExpanded = expandedCode === r.referralCode;
                const matchingOrders = r.orders || [];

                return (
                  <React.Fragment key={r.id}>
                    <tr className="hover:bg-tech-bg/50">
                      <td className="p-3.5 font-bold text-tech-accent tracking-wider">
                        {r.referralCode}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(r.referralCode)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                              copiedCode === r.referralCode
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                : 'bg-tech-bg border-tech-border text-slate-300 hover:text-white hover:border-tech-accent'
                            }`}
                            title="Copy direct referral URL"
                          >
                            {copiedCode === r.referralCode ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-tech-accent" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>

                          <a
                            href={getWhatsAppShareUrl(r.referralCode, r.referrerName)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60 transition-colors"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-white">{r.referrerName}</td>
                      <td className="p-3.5">{r.referrerContact || 'N/A'}</td>
                      <td className="p-3.5">
                        {matchingOrders.length > 0 ? (
                          <button
                            onClick={() => setExpandedCode(isExpanded ? null : r.referralCode)}
                            className="flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30"
                          >
                            <span>{r.totalReferrals} orders</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        ) : (
                          <span className="font-bold text-slate-400">{r.totalReferrals}</span>
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-400">₹{r.totalOrderValue}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleStatus(r.id, r.status)}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            r.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                          title="Click to toggle active status"
                        >
                          {r.status}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteReferral(r.id, r.referralCode)}
                          className="p-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                          title="Delete Referral"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible live orders list */}
                    {isExpanded && matchingOrders.length > 0 && (
                      <tr>
                        <td colSpan={8} className="p-4 bg-tech-bg/80 border-b border-tech-border">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-300">
                              Attributed Orders for {r.referralCode} ({matchingOrders.length}):
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {matchingOrders.map((ord: any) => (
                                <div
                                  key={ord.id}
                                  className="p-2.5 rounded-lg bg-tech-card border border-tech-border text-[11px] space-y-1"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-white">{ord.id}</span>
                                    <span className="text-emerald-400 font-bold">₹{ord.totalAmount}</span>
                                  </div>
                                  <div className="text-slate-400">Customer: {ord.customerName}</div>
                                  <div className="flex justify-between text-slate-500 text-[10px]">
                                    <span>{ord.status}</span>
                                    <span>{new Date(ord.createdAt).toLocaleDateString('en-IN')}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {referrals.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs font-mono">
                    No referral codes created yet. Click "New Referral Partner" above to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE REFERRAL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-tech-card border border-tech-border rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-tech-border">
              <h3 className="font-bold text-white text-base">Create Referral Partner Code</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Referral Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SENAZ-MILAN"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Referrer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milan Jyoti Ray"
                  value={referrerName}
                  onChange={(e) => setReferrerName(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">WhatsApp / Contact (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={referrerContact}
                  onChange={(e) => setReferrerContact(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-tech-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-tech-bg border border-tech-border rounded-lg text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tech-accent text-tech-bg font-bold rounded-lg hover:bg-tech-accent/90"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

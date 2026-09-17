'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Plus, Trash2, Check, X, Users, IndianRupee } from 'lucide-react';

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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
            Referral System Records
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Track referrer performance, create unique codes (`?ref=CODE`), and monitor earnings
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-xs font-mono hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Referral Code</span>
        </button>
      </div>

      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Referral Code</th>
                <th className="p-3.5">Referrer Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Successful Referrals</th>
                <th className="p-3.5">Total Generated Value</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {referrals.map((r) => (
                <tr key={r.id} className="hover:bg-tech-bg/50">
                  <td className="p-3.5 font-bold text-tech-accent tracking-wider">
                    {r.referralCode}
                  </td>
                  <td className="p-3.5 font-bold text-white">{r.referrerName}</td>
                  <td className="p-3.5">{r.referrerContact || 'N/A'}</td>
                  <td className="p-3.5 font-bold text-white">{r.totalReferrals}</td>
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
              ))}
              {referrals.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs font-mono">
                    No referral codes created yet. Click "New Referral Code" above to add one.
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
              <h3 className="font-bold text-white text-base">Create Referral Code</h3>
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

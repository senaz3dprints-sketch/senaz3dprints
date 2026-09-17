'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Check, X } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('0');
  const [usageLimit, setUsageLimit] = useState('100');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        discountType,
        discountValue,
        minOrderValue,
        usageLimit,
      }),
    });

    if (res.ok) {
      setModalOpen(false);
      setCode('');
      fetchCoupons();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await fetch('/api/admin/coupons', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !currentStatus }),
    });
    if (res.ok) fetchCoupons();
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Delete coupon code?')) return;
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            Coupon Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Create percentage or fixed amount promotional discount codes
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-tech-accent text-tech-bg font-bold text-xs font-mono rounded-lg hover:bg-tech-accent/90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Discount</th>
                <th className="p-3.5">Min Order</th>
                <th className="p-3.5">Times Used</th>
                <th className="p-3.5">Usage Limit</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-tech-bg/50">
                  <td className="p-3.5 font-bold text-white tracking-wider">{c.code}</td>
                  <td className="p-3.5 font-semibold text-tech-accent">{c.discountType}</td>
                  <td className="p-3.5 font-bold text-white">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                  </td>
                  <td className="p-3.5">₹{c.minOrderValue}</td>
                  <td className="p-3.5 font-bold">{c.timesUsed}</td>
                  <td className="p-3.5">{c.usageLimit}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleStatus(c.id, c.isActive)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                      title="Click to toggle active status"
                    >
                      {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-tech-card border border-tech-border rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-tech-border pb-3">
              <h3 className="font-bold text-white text-base">Create Coupon Code</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SENAZ20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED">FIXED AMOUNT (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-tech-accent text-tech-bg font-bold rounded-xl hover:bg-tech-accent/90 transition-all"
              >
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UploadCloud, FileText, Image as ImageIcon, MessageCircle, ExternalLink, Trash2, Receipt, IndianRupee } from 'lucide-react';

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/custom-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/custom-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) fetchRequests();
  };

  const handleUpdatePrice = async (id: string, newPrice: number) => {
    const res = await fetch('/api/admin/custom-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quotedPrice: newPrice }),
    });
    if (res.ok) fetchRequests();
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm(`Delete custom request ${id}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/custom-requests?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchRequests();
  };

  const totalCustomRevenue = requests.reduce((sum, r) => sum + (Number(r.quotedPrice) || 0), 0);
  const quotedCount = requests.filter((r) => r.status === 'QUOTED' || r.status === 'IN_PRODUCTION' || r.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            Custom 3D Printing Requests
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Review uploaded .stl, .obj, .3mf model files, set negotiated prices, and generate quotes
          </p>
        </div>

        {/* Custom Revenue Stat Card */}
        <div className="flex items-center gap-3 bg-tech-card px-4 py-2.5 rounded-xl border border-tech-border">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Custom Orders Revenue</span>
            <span className="text-base font-bold font-mono text-emerald-400">₹{totalCustomRevenue.toLocaleString('en-IN')}</span>
            <span className="text-[10px] font-mono text-slate-500 ml-1.5">({quotedCount} priced)</span>
          </div>
        </div>
      </div>

      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Request ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Type & Specs</th>
                <th className="p-3.5">Uploaded Files</th>
                <th className="p-3.5">Deal Price (₹)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-tech-bg/50">
                  <td className="p-3.5 font-bold text-white">{req.id}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-white block">{req.customerName}</span>
                    <span className="text-[11px] text-slate-400">{req.whatsapp}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-tech-accent block">{req.productType}</span>
                    <span className="text-slate-400 text-[11px]">
                      {req.materialPreference} | {req.colorPreference} (Qty: {req.quantity})
                    </span>
                  </td>
                  <td className="p-3.5 space-y-1">
                    {req.fileUrl && (
                      <a
                        href={req.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-tech-accent hover:underline text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download 3D Model</span>
                      </a>
                    )}
                    {req.referenceImageUrl && (
                      <a
                        href={req.referenceImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sky-400 hover:underline text-[11px]"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>View Image</span>
                      </a>
                    )}
                    {!req.fileUrl && !req.referenceImageUrl && (
                      <span className="text-slate-500 text-[10px]">No file attached</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">₹</span>
                      <input
                        type="number"
                        defaultValue={req.quotedPrice || ''}
                        onBlur={(e) => {
                          const val = Number(e.target.value) || 0;
                          if (val !== req.quotedPrice) handleUpdatePrice(req.id, val);
                        }}
                        placeholder="0"
                        className="w-20 bg-tech-bg border border-tech-border text-white text-xs px-2 py-1 rounded font-mono focus:border-tech-accent focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={req.status}
                      onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                      className="bg-tech-bg border border-tech-border text-[11px] text-white rounded px-2 py-1 font-mono"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="QUOTED">QUOTED</option>
                      <option value="IN_PRODUCTION">IN_PRODUCTION</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right flex items-center justify-end gap-2">
                    <Link
                      href="/admin/receipts"
                      className="px-2.5 py-1.5 bg-tech-bg border border-tech-border text-slate-300 hover:text-white rounded-lg text-xs font-mono font-semibold hover:border-tech-accent transition-colors inline-flex items-center gap-1.5"
                      title="Create Quotation / Advance Receipt"
                    >
                      <Receipt className="w-3 h-3 text-tech-accent" />
                      <span>Quote / Receipt</span>
                    </Link>

                    <a
                      href={`https://wa.me/${req.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-mono font-semibold hover:bg-emerald-500/30 transition-colors inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

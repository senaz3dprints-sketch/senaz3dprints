'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  ExternalLink,
  Trash2,
  Receipt,
  IndianRupee,
  Clock,
  CheckCircle,
  Sparkles,
  Save,
} from 'lucide-react';

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAmounts, setEditingAmounts] = useState<{ [id: string]: string }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/custom-requests');
      if (res.ok) {
        const data = await res.json();
        const reqList = data.requests || [];
        setRequests(reqList);
        const amounts: { [id: string]: string } = {};
        reqList.forEach((r: any) => {
          amounts[r.id] = r.quotedAmount ? String(r.quotedAmount) : '';
        });
        setEditingAmounts(amounts);
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

  const handleSaveQuotedAmount = async (id: string) => {
    const amountVal = parseFloat(editingAmounts[id] || '0') || 0;
    setSavingId(id);
    try {
      const res = await fetch('/api/admin/custom-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quotedAmount: amountVal }),
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (e) {
      alert('Failed to save quoted amount.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm(`Delete custom request ${id}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/custom-requests?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchRequests();
  };

  const handleDownloadFile = (req: any, type: 'file' | 'image' = 'file') => {
    const targetUrl = type === 'image' ? req.referenceImageUrl : req.fileUrl;
    const defaultName = type === 'image' ? `reference_${req.id}.jpg` : (req.fileName || `model_${req.id}.stl`);

    if (!targetUrl) return;

    // Fast client-side blob download if Base64
    if (targetUrl.startsWith('data:')) {
      try {
        const parts = targetUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = defaultName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        return;
      } catch (err) {
        console.error('Client blob download fallback:', err);
      }
    }

    // Direct endpoint download
    const downloadUrl = `/api/admin/custom-requests/download?id=${req.id}&type=${type}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = defaultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Metrics calculations
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'PENDING').length;
  const inProductionRequests = requests.filter((r) => r.status === 'IN_PRODUCTION' || r.status === 'QUOTED').length;
  const completedRequests = requests.filter((r) => r.status === 'COMPLETED').length;
  const totalCustomRevenue = requests
    .filter((r) => r.status !== 'REJECTED')
    .reduce((sum, r) => sum + (Number(r.quotedAmount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight flex items-center gap-2.5">
            <UploadCloud className="w-6 h-6 text-tech-accent" />
            <span>Custom 3D Printing Requests</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Review STL/OBJ/3MF 3D model files, set negotiated quotes, and manage custom order revenue
          </p>
        </div>

        <Link
          href="/admin/receipts"
          className="px-3.5 py-2 rounded-xl bg-tech-accent text-tech-bg font-mono font-bold text-xs hover:bg-tech-accent/90 transition-all flex items-center gap-1.5 shadow"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Generate Receipt / Quote</span>
        </Link>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-tech-card p-4 rounded-2xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Total Requests</span>
            <UploadCloud className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-xl font-bold font-mono text-white">{totalRequests}</div>
          <p className="text-[10px] font-mono text-slate-500">{pendingRequests} pending initial review</p>
        </div>

        <div className="bg-tech-card p-4 rounded-2xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Custom Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            ₹{totalCustomRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Agreed custom quotes total</p>
        </div>

        <div className="bg-tech-card p-4 rounded-2xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Active Production</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">{inProductionRequests}</div>
          <p className="text-[10px] font-mono text-slate-500">Quoted & on printing beds</p>
        </div>

        <div className="bg-tech-card p-4 rounded-2xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Completed</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">{completedRequests}</div>
          <p className="text-[10px] font-mono text-slate-500">Printed and fulfilled</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Request ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Type & Specs</th>
                <th className="p-3.5">3D Model / Image</th>
                <th className="p-3.5">Quoted Amount (₹)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-mono">
                    No custom printing requests recorded yet.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-tech-bg/50">
                    <td className="p-3.5 font-bold text-white whitespace-nowrap">{req.id}</td>
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
                    <td className="p-3.5 space-y-1.5">
                      {req.fileUrl && (
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(req, 'file')}
                            className="flex items-center gap-1.5 text-tech-accent hover:text-tech-accent/80 font-bold hover:underline text-[11px] text-left"
                            title="Download 3D Model File"
                          >
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[160px]" title={req.fileName || 'Download 3D Model'}>
                              {req.fileName || 'Download 3D Model'}
                            </span>
                          </button>
                          <a
                            href={`/api/admin/custom-requests/download?id=${req.id}&type=file`}
                            download={req.fileName || `model_${req.id}.stl`}
                            className="text-[9px] text-slate-400 hover:text-tech-accent transition-colors flex items-center gap-1 font-mono"
                          >
                            <span>⤓ Direct Download Link</span>
                          </a>
                        </div>
                      )}
                      {req.referenceImageUrl && (
                        <div className="flex flex-col gap-0.5 pt-0.5 border-t border-tech-border/40">
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(req, 'image')}
                            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium hover:underline text-[11px] text-left"
                            title="Download Reference Image"
                          >
                            <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>View / Download Image</span>
                          </button>
                          <a
                            href={`/api/admin/custom-requests/download?id=${req.id}&type=image`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[9px] text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-mono"
                          >
                            <span>↗ Open in New Tab</span>
                          </a>
                        </div>
                      )}
                      {!req.fileUrl && !req.referenceImageUrl && (
                        <span className="text-slate-500 text-[10px]">No file attached</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">₹</span>
                        <input
                          type="number"
                          value={editingAmounts[req.id] !== undefined ? editingAmounts[req.id] : ''}
                          onChange={(e) =>
                            setEditingAmounts({ ...editingAmounts, [req.id]: e.target.value })
                          }
                          onBlur={() => handleSaveQuotedAmount(req.id)}
                          placeholder="0"
                          className="w-24 bg-tech-bg border border-tech-border rounded px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-tech-accent"
                        />
                        <button
                          onClick={() => handleSaveQuotedAmount(req.id)}
                          disabled={savingId === req.id}
                          className="p-1 rounded bg-tech-bg hover:bg-tech-border border border-tech-border text-slate-400 hover:text-white"
                          title="Save Quoted Price"
                        >
                          <Save className="w-3 h-3" />
                        </button>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, MessageCircle, ExternalLink } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="border-b border-tech-border pb-4">
        <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
          Custom 3D Printing Requests
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Review uploaded .stl, .obj, .3mf model files and reference images
        </p>
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
                  <td className="p-3.5 text-right">
                    <a
                      href={`https://wa.me/${req.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-mono font-semibold hover:bg-emerald-500/30 transition-colors inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send Quote</span>
                    </a>
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

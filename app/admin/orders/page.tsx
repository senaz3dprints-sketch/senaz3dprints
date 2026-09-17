'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageCircle, CheckCircle, Clock, Truck, XCircle, Trash2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) fetchOrders();
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm(`Delete order ${id}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchOrders();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-tech-border pb-4">
        <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
          Orders Management
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Track customer submissions, personalized notes, address details, and update status
        </p>
      </div>

      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer & Contact</th>
                <th className="p-3.5">Address</th>
                <th className="p-3.5">Items & Personalisation</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {orders.map((ord) => {
                let itemsList = [];
                try {
                  itemsList = JSON.parse(ord.items);
                } catch (e) {}

                return (
                  <tr key={ord.id} className="hover:bg-tech-bg/50">
                    <td className="p-3.5 font-bold text-white">{ord.id}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{ord.customerName}</span>
                      <span className="text-[11px] text-slate-400">{ord.whatsapp}</span>
                    </td>
                    <td className="p-3.5 max-w-xs text-[11px] text-slate-400">
                      {ord.address}, {ord.city}, {ord.state} - {ord.pincode}
                    </td>
                    <td className="p-3.5 max-w-sm space-y-1">
                      {itemsList.map((item: any, idx: number) => (
                        <div key={idx} className="bg-tech-bg p-1.5 rounded border border-tech-border text-[11px]">
                          <span className="font-bold text-white">{item.name}</span> (x{item.quantity})
                          {item.personalizedText && (
                            <span className="block text-tech-accent font-semibold">
                              Text: "{item.personalizedText}"
                            </span>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="p-3.5 font-bold text-tech-accent">₹{ord.totalAmount}</td>
                    <td className="p-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="bg-tech-bg border border-tech-border text-[11px] text-white rounded px-2 py-1 font-mono"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${ord.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-mono font-semibold hover:bg-emerald-500/30 transition-colors inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="p-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

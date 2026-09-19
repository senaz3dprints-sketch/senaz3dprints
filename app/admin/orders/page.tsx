'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, CheckCircle, Clock, Truck, XCircle, Trash2, Send, Tag, Sparkles, Receipt } from 'lucide-react';
import { generateAdminToCustomerConfirmationWhatsAppUrl } from '@/lib/whatsapp';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchOrders();
    } catch (e) {
    } finally {
      setUpdatingId(null);
    }
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
          Track customer submissions, personalized notes, address details, and update status in real-time across database & Google Sheets.
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
                <th className="p-3.5">Discount & Billing</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Customer Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {orders.map((ord) => {
                let itemsList = [];
                try {
                  itemsList = JSON.parse(ord.items);
                } catch (e) {}

                const whatsappUrl = generateAdminToCustomerConfirmationWhatsAppUrl({
                  customerPhone: ord.whatsapp,
                  customerName: ord.customerName,
                  orderId: ord.id,
                  totalAmount: ord.totalAmount,
                  status: ord.status,
                });

                return (
                  <tr key={ord.id} className="hover:bg-tech-bg/50">
                    <td className="p-3.5 font-bold text-white whitespace-nowrap">
                      {ord.id}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{ord.customerName}</span>
                      <span className="text-[11px] text-slate-400">{ord.whatsapp}</span>
                      {ord.email && (
                        <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                          {ord.email}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 max-w-xs text-[11px] text-slate-400">
                      {ord.address}, {ord.city}, {ord.state} - {ord.pincode}
                      {ord.orderNotes && (
                        <p className="text-[10px] text-amber-300 mt-1 italic">
                          Note: "{ord.orderNotes}"
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 max-w-sm space-y-1">
                      {itemsList.map((item: any, idx: number) => (
                        <div key={idx} className="bg-tech-bg p-1.5 rounded border border-tech-border text-[11px]">
                          <span className="font-bold text-white">{item.name}</span> (x{item.quantity})
                          {item.personalizedText && (
                            <span className="block text-tech-accent font-semibold flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> "{item.personalizedText}"
                            </span>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-bold text-tech-accent text-sm block">₹{ord.totalAmount}</span>
                      <div className="text-[10px] text-slate-400">
                        Subtotal: ₹{ord.subtotal || ord.totalAmount + (ord.discountAmount || 0)}
                      </div>
                      {ord.discountAmount > 0 && (
                        <div className="text-[10px] text-emerald-400">
                          -₹{ord.discountAmount} ({ord.couponCode || ord.referralCode || 'Promo'})
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <select
                        value={ord.status}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`bg-tech-bg border text-[11px] font-bold rounded px-2.5 py-1.5 font-mono cursor-pointer transition-colors ${
                          ord.status === 'PENDING'
                            ? 'border-amber-500/50 text-amber-400'
                            : ord.status === 'CONFIRMED' || ord.status === 'PROCESSING'
                            ? 'border-sky-500/50 text-sky-400'
                            : ord.status === 'SHIPPED' || ord.status === 'DELIVERED'
                            ? 'border-emerald-500/50 text-emerald-400'
                            : 'border-rose-500/50 text-rose-400'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      {updatingId === ord.id && (
                        <span className="block text-[9px] text-slate-500 mt-0.5">Syncing...</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Generate / View Receipt */}
                        <Link
                          href={`/admin/receipts`}
                          className="px-2.5 py-1.5 bg-tech-bg border border-tech-border text-slate-300 hover:text-white rounded-lg text-xs font-mono font-semibold hover:border-tech-accent transition-colors inline-flex items-center gap-1.5 shadow-sm"
                          title="Generate or Customize Receipt for this order"
                        >
                          <Receipt className="w-3 h-3 text-tech-accent" />
                          <span>Receipt</span>
                        </Link>

                        {/* 1-Click WhatsApp Status Notification to Customer */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-mono font-semibold hover:bg-emerald-500/30 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                          title="Send Order Status confirmation to customer on WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-xs font-mono">
                    No customer orders received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

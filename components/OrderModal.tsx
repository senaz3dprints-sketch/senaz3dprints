'use client';

import React, { useState } from 'react';
import { X, MessageCircle, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface OrderModalProps {
  appliedCoupon?: string;
  referralCode?: string;
  onClose: () => void;
}

export default function OrderModal({ appliedCoupon, referralCode, onClose }: OrderModalProps) {
  const { cart, clearCart, setIsCartOpen } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    whatsappUrl: string;
    totalAmount: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !whatsapp || !address || !city || !state || !pincode) {
      setError('Please fill in all required contact and shipping address fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        customerName,
        whatsapp,
        email,
        address,
        city,
        state,
        pincode,
        orderNotes,
        items: cart,
        couponCode: appliedCoupon,
        referralCode,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrderSuccess({
          orderId: data.orderId,
          whatsappUrl: data.whatsappUrl,
          totalAmount: data.totalAmount,
        });
        clearCart();
      } else {
        setError(data.error || 'Failed to submit order. Please check your input.');
      }
    } catch (err) {
      setError('An unexpected server error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-tech-card border border-tech-border rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tech-border pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-sans">Checkout Details</h3>
            <p className="text-xs text-slate-400 font-mono">
              Provide contact info for instant WhatsApp order confirmation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-tech-bg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Screen */}
        {orderSuccess ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                Order Received
              </span>
              <h3 className="text-2xl font-extrabold text-white font-mono">
                {orderSuccess.orderId}
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your order has been recorded securely. Click below to confirm item details & delivery schedule directly with our team on WhatsApp!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-tech-bg border border-tech-border text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Customer:</span>
                <span className="text-white font-semibold">{customerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Amount:</span>
                <span className="text-tech-accent font-bold">₹{orderSuccess.totalAmount}</span>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <a
              href={orderSuccess.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm font-mono hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Confirm Order on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          /* Form Input */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  WhatsApp Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Street Address <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="House No., Street name, Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  City <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  State <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Karnataka"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Pincode <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="560001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Order Notes / Delivery Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Please wrap carefully or call before delivery"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
              />
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe Order Sync
              </span>
              <span>WhatsApp Confirmation</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Generating Order...' : 'Submit & Open WhatsApp'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, MessageCircle, CheckCircle, ShieldCheck, AlertCircle, ShoppingBag, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface OrderModalProps {
  appliedCoupon?: string;
  referralCode?: string;
  discountAmount?: number;
  shippingFee?: number;
  shippingSettings?: {
    flatRate: number;
    freeShippingThreshold: number;
    shippingNote: string;
  };
  onClose: () => void;
}

export default function OrderModal({
  appliedCoupon,
  referralCode,
  discountAmount = 0,
  shippingFee: initialShippingFee,
  shippingSettings: initialShippingSettings,
  onClose,
}: OrderModalProps) {
  const { cart, cartTotal, clearCart, setIsCartOpen } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [shippingSettings, setShippingSettings] = useState(
    initialShippingSettings || {
      flatRate: 0,
      freeShippingThreshold: 0,
      shippingNote: 'Standard delivery in 3-5 business days across India',
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    whatsappUrl: string;
    totalAmount: number;
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
  } | null>(null);

  // Fetch shipping settings if not provided
  React.useEffect(() => {
    if (!initialShippingSettings) {
      fetch('/api/shipping')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) {
            setShippingSettings(data.settings);
          }
        })
        .catch(() => {});
    }
  }, [initialShippingSettings]);

  const calculatedDiscount = Math.min(cartTotal, Math.max(0, discountAmount));
  const isFreeShipping =
    shippingSettings.flatRate <= 0 ||
    (shippingSettings.freeShippingThreshold > 0 && cartTotal >= shippingSettings.freeShippingThreshold);
  const calculatedShipping = initialShippingFee !== undefined ? initialShippingFee : (isFreeShipping ? 0 : shippingSettings.flatRate);
  const finalTotal = Math.max(0, cartTotal - calculatedDiscount + calculatedShipping);

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
        couponCode: appliedCoupon || null,
        referralCode: referralCode || null,
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
          subtotal: cartTotal,
          discountAmount: calculatedDiscount,
          shippingFee: calculatedShipping,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-tech-card border border-tech-border rounded-2xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tech-border pb-3">
          <div>
            <h3 className="text-lg font-bold text-white font-sans">Complete Your Order</h3>
            <p className="text-xs text-slate-400 font-mono">
              Provide contact info for instant WhatsApp dispatch confirmation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-tech-bg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Screen */}
        {orderSuccess ? (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                Order Placed Successfully
              </span>
              <h3 className="text-2xl font-extrabold text-white font-mono">
                {orderSuccess.orderId}
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your order is saved and recorded. Click the button below to confirm production & delivery details directly on WhatsApp!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-tech-bg border border-tech-border text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between text-slate-400">
                <span>Customer Name:</span>
                <span className="text-white font-semibold">{customerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-slate-200">₹{orderSuccess.subtotal}</span>
              </div>
              {orderSuccess.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Applied:</span>
                  <span>-₹{orderSuccess.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping:</span>
                {orderSuccess.shippingFee > 0 ? (
                  <span className="text-slate-200 font-semibold">₹{orderSuccess.shippingFee}</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">FREE</span>
                )}
              </div>
              <div className="flex justify-between text-white font-bold pt-1 border-t border-tech-border">
                <span>Final Payable Amount:</span>
                <span className="text-tech-accent text-sm">₹{orderSuccess.totalAmount}</span>
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
              <span>Confirm on WhatsApp Now</span>
            </a>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-white font-mono block mx-auto pt-1"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Summary Box */}
            <div className="p-3.5 rounded-xl bg-tech-bg border border-tech-border space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 pb-2 border-b border-tech-border">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <ShoppingBag className="w-3.5 h-3.5 text-tech-accent" /> Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </span>
                <span className="text-[11px] text-slate-400">
                  {calculatedShipping === 0 ? 'Free All-India Delivery' : shippingSettings.shippingNote}
                </span>
              </div>

              {/* Items scroll */}
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300 text-[11px] font-mono">
                    <span className="truncate max-w-[200px] sm:max-w-[260px]">
                      {item.quantity}x {item.name}
                      {item.personalizedText ? ` ("${item.personalizedText}")` : ''}
                    </span>
                    <span className="text-white font-semibold shrink-0 ml-2">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Cost breakdown */}
              <div className="pt-2 border-t border-tech-border text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>

                {calculatedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Discount ({appliedCoupon || referralCode})
                    </span>
                    <span>-₹{calculatedDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Shipping Fee</span>
                  {calculatedShipping === 0 ? (
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  ) : (
                    <span className="text-slate-200 font-semibold">₹{calculatedShipping}</span>
                  )}
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-tech-border">
                  <span>Total Payable</span>
                  <span className="text-tech-accent">₹{finalTotal}</span>
                </div>
              </div>
            </div>

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
                placeholder="House No., Flat, Building, Street, Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
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
                Order Notes / Customization Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Please pack safely or call before dispatch"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Database & Sheet Sync
              </span>
              <span>Direct WhatsApp Confirmation</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all shadow-lg shadow-tech-accent/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                'Processing Order...'
              ) : (
                <>
                  <span>Place Order • Pay ₹{finalTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

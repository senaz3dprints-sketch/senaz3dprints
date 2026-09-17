'use client';

import React, { useState } from 'react';
import { X, Trash2, Tag, ArrowRight, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import OrderModal from './OrderModal';

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    cartTotal,
    referralCode,
    setReferralCode,
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: cartTotal }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
        });
        setCouponError(null);
      } else {
        setCouponError(data.error || 'Invalid coupon code.');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Failed to validate coupon code.');
    } finally {
      setCouponLoading(false);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-tech-card border-l border-tech-border text-slate-100 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-tech-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-tech-accent" />
                <h3 className="font-bold text-white text-base font-sans">Your Order Bag</h3>
                <span className="text-xs font-mono bg-tech-bg px-2 py-0.5 rounded border border-tech-border text-slate-400">
                  {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded hover:bg-tech-bg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-tech-bg border border-tech-border flex items-center justify-center text-slate-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300">Your bag is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Browse our products catalog or order a personalized keychain!
                  </p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-tech-bg rounded-lg border border-tech-border/80 flex gap-3 relative"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded bg-tech-card border border-tech-border shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-xs text-white truncate">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-400">
                        {item.color && (
                          <span className="bg-tech-card px-1.5 py-0.5 rounded border border-tech-border">
                            Color: {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-tech-card px-1.5 py-0.5 rounded border border-tech-border">
                            Size: {item.size}
                          </span>
                        )}
                      </div>

                      {/* Personalized Text badge */}
                      {item.personalizedText && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-tech-accent bg-tech-accent/10 px-2 py-0.5 rounded border border-tech-accent/20">
                          <Sparkles className="w-3 h-3" />
                          <span>Text: "{item.personalizedText}"</span>
                        </div>
                      )}

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-mono text-sm font-bold text-white">
                          ₹{item.price * item.quantity}
                        </span>

                        <div className="flex items-center border border-tech-border rounded bg-tech-card">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono text-white font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-4 bg-tech-card border-t border-tech-border space-y-3">
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Coupon (e.g. WELCOME10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-tech-bg border border-tech-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-tech-accent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-3 py-1.5 bg-tech-bg border border-tech-border hover:border-tech-accent text-slate-200 hover:text-white text-xs font-mono font-semibold rounded-lg"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" /> Coupon {appliedCoupon.code} applied!
                      </span>
                      <span>-₹{appliedCoupon.discountAmount}</span>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] font-mono text-rose-400 pt-1">{couponError}</p>
                  )}
                </form>

                {/* Referral Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Referral Code (Optional)"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-tech-accent"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-tech-border/60 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{appliedCoupon.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-tech-border">
                    <span>Total Amount</span>
                    <span className="text-tech-accent">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3 rounded-lg bg-tech-accent text-tech-bg font-bold text-sm font-mono hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-tech-accent/10"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Order Details Modal */}
      {isCheckoutModalOpen && (
        <OrderModal
          appliedCoupon={appliedCoupon?.code}
          referralCode={referralCode}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
      )}
    </>
  );
}

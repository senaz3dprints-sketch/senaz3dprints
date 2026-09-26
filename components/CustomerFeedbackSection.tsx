'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquarePlus,
  CheckCircle,
  Sparkles,
  X,
  AlertCircle,
  Quote,
} from 'lucide-react';

export interface FeedbackItem {
  id: string;
  customerName: string;
  roleOrCity?: string | null;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface CustomerFeedbackSectionProps {
  initialFeedbacks?: FeedbackItem[];
}

export default function CustomerFeedbackSection({ initialFeedbacks = [] }: CustomerFeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [roleOrCity, setRoleOrCity] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch feedbacks if none provided initially
  useEffect(() => {
    if (feedbacks.length === 0) {
      fetch('/api/feedback')
        .then((res) => res.json())
        .then((data) => {
          if (data.feedbacks) {
            setFeedbacks(data.feedbacks);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      setError('Please provide your name and your review.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          roleOrCity: roleOrCity.trim() || 'Verified Customer',
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedbacks((prev) => [data.feedback, ...prev]);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsModalOpen(false);
          setCustomerName('');
          setRoleOrCity('');
          setComment('');
          setRating(5);
        }, 2000);
      } else {
        setError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header with Write Review CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-tech-border/70 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-tech-accent uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
            Real experiences from creators, designers, and customers across India.
          </p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setError(null);
            setSuccess(false);
          }}
          className="px-4 py-2.5 rounded-xl bg-tech-accent text-tech-bg font-mono font-bold text-xs hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-tech-accent/15 shrink-0 cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review / Feedback</span>
        </button>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedbacks.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-tech-card/90 rounded-2xl border border-tech-border p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-tech-accent/40 transition-all shadow-md group"
          >
            <div className="space-y-2.5">
              {/* Star Rating & Quote Icon */}
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <Quote className="w-4 h-4 text-slate-600 group-hover:text-tech-accent/60 transition-colors" />
              </div>

              {/* Review Text */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-4">
                "{item.comment}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-2 border-t border-tech-border/60 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs">{item.customerName}</span>
                <span className="text-slate-400 text-[10px] block">{item.roleOrCity || 'Verified Customer'}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-tech-bg border border-tech-border text-[9px] text-emerald-400 font-semibold">
                ✓ Verified
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-tech-card rounded-3xl border border-tech-accent/40 p-6 sm:p-8 shadow-2xl space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-tech-bg text-slate-400 hover:text-white border border-tech-border transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div>
              <span className="text-[11px] font-mono text-tech-accent uppercase tracking-wider font-semibold">
                Share Your Experience
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mt-0.5">
                Write Customer Feedback
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your feedback helps us continuously improve our print quality and customer service!
              </p>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white font-sans">Thank you for your feedback!</h4>
                <p className="text-xs text-slate-300">Your review has been saved and published to our community wall.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-mono text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Rating Picker */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Rating <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating !== null ? hoverRating : rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 text-slate-600 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              active ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-mono text-slate-300 ml-2">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name and City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      City / Profession (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore • Designer"
                      value={roleOrCity}
                      onChange={(e) => setRoleOrCity(e.target.value)}
                      className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                    />
                  </div>
                </div>

                {/* Review Message */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Your Review / Feedback <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the print quality, layer smoothness, shipping speed, or overall experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-tech-accent resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-tech-accent text-tech-bg font-extrabold text-sm font-mono hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-tech-accent/20 cursor-pointer disabled:opacity-60"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>{loading ? 'Submitting Review...' : 'Post Feedback'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

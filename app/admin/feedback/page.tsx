'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Search,
  Sparkles,
  AlertCircle,
  Quote,
} from 'lucide-react';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [roleOrCity, setRoleOrCity] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isApproved, setIsApproved] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
      }
    } catch (e) {
      console.error('Failed to load feedback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleToggleApproval = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !currentVal }),
      });
      if (res.ok) {
        fetchFeedbacks();
      }
    } catch (e) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const res = await fetch(`/api/admin/feedback?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFeedbacks();
      }
    } catch (e) {
      alert('Failed to delete feedback.');
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      setError('Please fill in customer name and feedback comment.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          roleOrCity: roleOrCity.trim(),
          rating,
          comment: comment.trim(),
          isApproved,
        }),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setCustomerName('');
        setRoleOrCity('');
        setComment('');
        setRating(5);
        fetchFeedbacks();
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to add feedback.');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const text = (f.customerName + ' ' + (f.roleOrCity || '') + ' ' + f.comment).toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const totalReviews = feedbacks.length;
  const approvedCount = feedbacks.filter((f) => f.isApproved).length;
  const avgRating = totalReviews > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-tech-accent" />
            <span>Customer Feedback & Reviews</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Manage public testimonials, approve submissions, and monitor client satisfaction
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddOpen(true);
            setError(null);
          }}
          className="px-4 py-2.5 rounded-xl bg-tech-accent text-tech-bg font-mono font-bold text-xs hover:bg-tech-accent/90 transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Testimonial</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-tech-card p-4 rounded-2xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Total Reviews</span>
            <MessageSquare className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalReviews}</div>
          <p className="text-[10px] font-mono text-slate-500">{approvedCount} visible on website</p>
        </div>

        <div className="bg-tech-card p-4 rounded-2xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 flex items-baseline gap-1">
            <span>{avgRating}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[10px] font-mono text-slate-500">Based on all feedback entries</p>
        </div>

        <div className="bg-tech-card p-4 rounded-2xl border border-tech-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Published Status</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {totalReviews > 0 ? `${Math.round((approvedCount / totalReviews) * 100)}%` : '100%'}
          </div>
          <p className="text-[10px] font-mono text-slate-500">Approval rate</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search reviews by name, city, or comment text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-tech-card border border-tech-border rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-tech-accent placeholder:text-slate-500"
        />
      </div>

      {/* Feedback Table / List */}
      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Customer & Origin</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5">Feedback / Review Comment</th>
                <th className="p-3.5">Submitted Date</th>
                <th className="p-3.5">Website Visibility</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    No customer feedbacks found.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-tech-bg/50">
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{item.customerName}</span>
                      <span className="text-[11px] text-slate-400">{item.roleOrCity || 'Verified Customer'}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < item.rating ? 'fill-amber-400' : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 max-w-md">
                      <p className="text-xs text-slate-200 line-clamp-3 font-sans">
                        "{item.comment}"
                      </p>
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleApproval(item.id, item.isApproved)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                          item.isApproved
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-500/10 border-slate-500/30 text-slate-400 hover:bg-slate-500/20'
                        }`}
                      >
                        {item.isApproved ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Visible on Site</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                        title="Delete Feedback"
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

      {/* Add Testimonial Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-tech-card rounded-3xl border border-tech-border p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-tech-border pb-3">
              <h3 className="text-lg font-bold text-white font-sans">Add Customer Testimonial</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-mono text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleAddFeedback} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Customer Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Role or Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified Buyer • Delhi"
                  value={roleOrCity}
                  onChange={(e) => setRoleOrCity(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Star Rating (1 to 5)
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value) || 5)}
                  className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                  <option value={2}>★★☆☆☆ (2 Stars)</option>
                  <option value={1}>★☆☆☆☆ (1 Star)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Review Text <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the customer testimonial..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isApproved"
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  className="rounded border-tech-border text-tech-accent focus:ring-0"
                />
                <label htmlFor="isApproved" className="text-xs font-mono text-slate-300">
                  Publish immediately on website
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-tech-bg border border-tech-border text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-tech-accent text-tech-bg font-mono font-bold text-xs hover:bg-tech-accent/90"
                >
                  {submitting ? 'Saving...' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-mono text-tech-accent uppercase tracking-wider font-semibold">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
          Contact SenAZ 3D PRINTS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-sans">
          Have questions regarding an order, material recommendation, or bulk inquiry? Reach out anytime!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-tech-card p-6 rounded-2xl border border-tech-border space-y-4">
            <h3 className="font-bold text-white text-base">Direct Channels</h3>

            <a
              href="https://wa.me/918761053230"
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-4 p-4 rounded-xl bg-tech-bg border border-tech-border hover:border-emerald-500/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold block">
                  WhatsApp Support (Fastest)
                </span>
                <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  +91 8761053230
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Instant stock checks, quote discussions, and live preview updates.
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-tech-bg border border-tech-border">
              <div className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-tech-accent" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 block">Email Address</span>
                <span className="text-sm font-semibold text-white">senaz3dprints@gmail.com</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-tech-bg border border-tech-border">
              <div className="w-10 h-10 rounded-lg bg-tech-card border border-tech-border flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 block">Dispatch Hub</span>
                <span className="text-sm font-semibold text-white">India | Nationwide Courier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-tech-card p-6 sm:p-8 rounded-2xl border border-tech-border">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Sent!</h3>
              <p className="text-xs text-slate-400">
                Thank you for contacting SENAZ 3D PRINTS. We will reply to your message shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-white font-sans">Send Us a Quick Message</h3>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your custom 3D printing query..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-tech-accent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-tech-accent text-tech-bg font-bold text-xs font-mono hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

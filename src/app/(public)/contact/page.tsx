'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import Footer from '@/components/layout/Footer';
import { api } from '@/utils/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage({ type: 'error', text: 'Please fill out all fields.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res: any = await api.post('/contact', formData);
      setStatusMessage({
        type: 'success',
        text: res.message || 'Thank you! Your message has been sent successfully.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to submit message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-light">
      <PublicNavbar />

      {/* Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-white via-emerald-50/20 to-surface-light border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">Get In Touch</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-forest-900 mt-2 mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
            Have questions about PAISA BADHAO, virtual stock trading, or our learning modules? We’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Content Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Information Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="font-serif text-3xl font-bold text-forest-900">Let’s Start a Conversation</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Whether you are a student, teacher, or aspiring investor, our team is dedicated to supporting your
                  financial literacy journey.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-light border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-forest-800 text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-bold text-forest-900">info@paisabadhao.pk</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-light border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-forest-800 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Helpline</p>
                    <p className="text-sm font-bold text-forest-900">+92 300 1234567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-light border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-forest-800 text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Location</p>
                    <p className="text-sm font-bold text-forest-900">Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-surface-light border border-slate-200 shadow-md">
              <h3 className="font-serif font-bold text-2xl text-forest-900 mb-6">Send Us a Direct Message</h3>

              {statusMessage && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs flex items-center gap-3 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your financial literacy or trading journey?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-forest-800 hover:bg-forest-700 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-forest-950/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

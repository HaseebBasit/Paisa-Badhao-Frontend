'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { api } from '@/utils/api';
import { Expert, ExpertBooking } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function ExpertsPage() {
  const { user } = useAuthStore();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [myBookings, setMyBookings] = useState<ExpertBooking[]>([]);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-11-15');
  const [bookingTime, setBookingTime] = useState('04:00 PM - 05:00 PM');
  const [bookingTopic, setBookingTopic] = useState('PSX Portfolio Diversification & Risk');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadExperts();
    if (user) {
      loadMyBookings();
    }
  }, [user]);

  const loadExperts = async () => {
    try {
      const res: any = await api.get('/experts');
      setExperts(res.data || []);
    } catch (err) {
      console.warn('Failed to load experts:', err);
    }
  };

  const loadMyBookings = async () => {
    try {
      const res: any = await api.get('/experts/user/bookings');
      setMyBookings(res.data || []);
    } catch (err) {
      console.warn('Failed to load user bookings:', err);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert || !user) return;

    setIsBooking(true);
    setBookingSuccess(null);

    try {
      await api.post('/experts/book', {
        expertId: selectedExpert._id,
        date: bookingDate,
        timeSlot: bookingTime,
        topic: bookingTopic,
        notes: bookingNotes,
      });

      setBookingSuccess(`Your consultation with ${selectedExpert.name} has been booked!`);
      loadMyBookings();
      setTimeout(() => {
        setSelectedExpert(null);
        setBookingSuccess(null);
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to book session.');
    } finally {
      setIsBooking(false);
    }
  };

  const filteredExperts = experts.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'All' ||
      e.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-forest-900 to-forest-800 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest border border-emerald-500/30">
              Professional Mentorship
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Verified Investing Experts
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Get guidance from trusted financial mentors and market experts. Schedule 1-on-1 consultations to review
              your PSX strategy, equity research, and capital allocation.
            </p>
          </div>
        </div>

        {/* Search & Specialty Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Equity Research', 'CFA', 'Technical Chart'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSpecialty(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedSpecialty === cat
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Experts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredExperts.map((exp) => (
            <div
              key={exp._id}
              className="rounded-3xl bg-white border border-slate-200/80 p-7 flex flex-col justify-between shadow-xs hover:border-emerald-600 hover:shadow-xl transition-all group"
            >
              <div className="space-y-4">
                {/* Avatar Placeholder */}
                <div className="relative w-20 h-20 mx-auto rounded-3xl bg-forest-800 text-emerald-300 border-2 border-emerald-400/30 flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                  {exp.name.split(' ').map((n) => n[0]).join('')}
                  {exp.isVerified && (
                    <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-serif font-bold text-xl text-forest-900">{exp.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700">{exp.designation}</p>
                  <div className="flex items-center justify-center gap-1 text-gold-500 pt-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold text-slate-700">{exp.rating}</span>
                    <span className="text-[11px] text-slate-400">({exp.reviewsCount}+ reviews)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed text-center line-clamp-3">
                  {exp.bio}
                </p>

                {/* Specialties Badges */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {exp.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fee & Booking CTA */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee per session</span>
                  <span className="font-serif font-bold text-sm text-forest-900">
                    {exp.feeCurrency} {exp.feePerSession.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedExpert(exp)}
                  className="px-5 py-2.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm group-hover:bg-emerald-600 cursor-pointer"
                >
                  <span>Book Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* User's Booking History */}
        {myBookings.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-xl text-forest-900">Your Scheduled Consultations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl bg-surface-light border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-forest-900 text-sm">{b.expert?.name || 'Mentor'}</p>
                    <p className="text-slate-500 font-medium">Topic: {b.topic}</p>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" /> {b.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" /> {b.timeSlot}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Consultation Modal */}
        {selectedExpert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 space-y-6 relative">
              <button
                onClick={() => setSelectedExpert(null)}
                className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Schedule Consultation</span>
                <h3 className="font-serif font-bold text-2xl text-forest-900">
                  Book with {selectedExpert.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedExpert.designation}</p>
              </div>

              {bookingSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{bookingSuccess}</span>
                </div>
              )}

              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Available Time Slot
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {selectedExpert.availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Consultation Topic
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Notes for the Mentor (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Describe specific questions or holdings you want to discuss..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm resize-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-surface-light border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Consultation Session Fee</span>
                  <span className="font-serif font-bold text-sm text-forest-900">
                    {selectedExpert.feeCurrency} {selectedExpert.feePerSession.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isBooking}
                  className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {isBooking ? 'Confirming...' : 'Confirm Consultation Booking'}
                </button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Award, Briefcase, Mail } from 'lucide-react';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import Footer from '@/components/layout/Footer';

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'ABDUL RAOF',
      position: 'Team Lead',
      image: '/images/team-raof.jpg',
      bio: 'Leading technological infrastructure, systems scalability, and security architecture across the PAISA BADHAO platform. Passionate about empowering Pakistanis with resilient digital financial solutions.',
      skills: ['Engineering Leadership', 'Distributed Systems', 'Platform Resilience'],
      isCreator: false,
    },
    {
      name: 'Tooba Rehman',
      position: 'Team Member',
      image: '/images/team-tooba.jpg',
      bio: 'Visionary designer, architect, and lead developer of the entire PAISA BADHAO experience. Leading UI/UX design systems, financial literacy curricula, and interactive virtual trading mechanics.',
      skills: ['Full-Stack Engineering', 'Fintech UI/UX', 'Financial Literacy'],
      isCreator: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface-light">
      <PublicNavbar />

      {/* Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-white via-emerald-50/20 to-surface-light border-b border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Leadership</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-forest-900 tracking-tight">
            Our Dedicated Team
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mt-4 leading-relaxed">
            The visionary minds committed to elevating financial literacy and equity market confidence throughout Pakistan.
          </p>
        </div>
      </section>

      {/* Team Profiles Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="p-8 rounded-3xl bg-surface-light border border-slate-200/90 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-600 flex flex-col justify-between"
              >
                <div>
                  {/* Real Photograph with Professional Aspect Ratio */}
                  <div className="relative w-40 h-48 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-white mb-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="font-serif font-bold text-2xl text-forest-900">{member.name}</h3>
                      {member.isCreator && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                          Creator
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                      {member.position}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed max-w-md mx-auto pt-2">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Skills & Badges */}
                <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap justify-center gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 text-[11px] font-medium shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Prominent Website Creator Statement */}
          <div className="mt-16 p-8 rounded-3xl bg-forest-900 text-white text-center shadow-xl border border-emerald-500/30 max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              Platform Attestation
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400 tracking-wide">
              This Website Is Made By Tooba Rehman.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Designed and engineered to deliver an uncompromising, high-performance financial educational experience for Pakistan.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

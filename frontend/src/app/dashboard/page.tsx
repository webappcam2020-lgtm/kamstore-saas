'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Bot, 
  Globe, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useLeadStore, useScraperStore, usePaymentStore, useTourismStore } from '@/lib/store';

export default function DashboardPage() {
  const { user } = useAuth();
  const { leads } = useLeadStore();
  const { jobs } = useScraperStore();
  const { payments } = usePaymentStore();
  const { listings } = useTourismStore();

  const totalSpent = payments
    .filter((p) => p.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold uppercase tracking-wider">
              Espace Client & Opérateur 🇨🇲
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Bienvenue, {user?.name || 'Administrateur KamStore'} !
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Supervisez l'ensemble de votre écosystème : réservations touristiques, logements vérifiés, 
              pipelines de scraping asynchrones, extraction de leads IA et transactions MTN MoMo & Orange Money.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
            <Compass className="w-96 h-96" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Dépenses / Recettes</span>
              <span className="text-xl font-extrabold text-gray-900 mt-1 block">
                {totalSpent.toLocaleString('fr-FR')} XAF
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> 100% Mobile Money
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Leads Extraits (IA)</span>
              <span className="text-xl font-extrabold text-gray-900 mt-1 block">
                {leads.length} Entreprises
              </span>
              <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-0.5 mt-1">
                <Bot className="w-3 h-3" /> Précision 94%+
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Jobs de Scraping</span>
              <span className="text-xl font-extrabold text-gray-900 mt-1 block">
                {jobs.length} Tâches Celery
              </span>
              <span className="text-[11px] text-cyan-600 font-semibold flex items-center gap-0.5 mt-1">
                <Activity className="w-3 h-3" /> Proxies en rotation
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Annonces Disponibles</span>
              <span className="text-xl font-extrabold text-gray-900 mt-1 block">
                {listings.length} Logements
              </span>
              <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-0.5 mt-1">
                <Calendar className="w-3 h-3" /> Kribi, Douala, Yaoundé
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/lead-extraction"
            className="p-5 bg-white hover:bg-purple-50/50 rounded-2xl border border-gray-200 shadow-sm transition group"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mt-3">Extraire des Leads</h3>
            <p className="text-xs text-gray-500 mt-0.5">NLP automatique sur textes et listings</p>
          </Link>

          <Link
            href="/scraping"
            className="p-5 bg-white hover:bg-cyan-50/50 rounded-2xl border border-gray-200 shadow-sm transition group"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mt-3">Lancer un Scraper</h3>
            <p className="text-xs text-gray-500 mt-0.5">Scrapy & Playwright avec rotation IP</p>
          </Link>

          <Link
            href="/tourism"
            className="p-5 bg-white hover:bg-blue-50/50 rounded-2xl border border-gray-200 shadow-sm transition group"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mt-3">Réserver un Séjour</h3>
            <p className="text-xs text-gray-500 mt-0.5">Villas balnéaires et appartements</p>
          </Link>

          <Link
            href="/payments"
            className="p-5 bg-white hover:bg-emerald-50/50 rounded-2xl border border-gray-200 shadow-sm transition group"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mt-3">Paiement Mobile Money</h3>
            <p className="text-xs text-gray-500 mt-0.5">Notch Pay & Campay (MTN/Orange)</p>
          </Link>
        </div>

        {/* Activity Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Extracted Leads */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600" />
                Derniers Leads Extraits
              </h3>
              <Link href="/lead-extraction" className="text-xs text-purple-600 font-semibold hover:underline">
                Voir tout
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {leads.slice(0, 4).map((l, i) => (
                <div key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">{l.company_name}</span>
                    <span className="text-[11px] text-gray-500">{l.city} • {l.category}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                    {l.phone || l.email || 'Validé'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Mobile Money Transactions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Transactions Mobile Money
              </h3>
              <Link href="/payments" className="text-xs text-emerald-600 font-semibold hover:underline">
                Voir tout
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {payments.slice(0, 4).map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-xs text-gray-900 block">{p.transaction_ref}</span>
                    <span className="text-[11px] text-gray-500 capitalize">{p.provider.replace('_', ' ')} • {p.customer_phone || '+237'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900 block">{p.amount.toLocaleString('fr-FR')} XAF</span>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase">Complété</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Bot, 
  Globe, 
  CreditCard, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers,
  Phone,
  Server
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'tourism' | 'leads' | 'scraping' | 'payments'>('tourism');

  const techStack = [
    { name: 'Next.js 14 & Tailwind', cat: 'Frontend', desc: 'React App Router + Zustand' },
    { name: 'FastAPI (Python 3.12)', cat: 'Backend API', desc: 'Async RESTful micro-services' },
    { name: 'PostgreSQL 16 & Redis', cat: 'Database & Cache', desc: 'Relational data + Celery queue' },
    { name: 'OpenAI & LangChain', cat: 'AI / NLP Engine', desc: 'Extraction de leads B2B + NER' },
    { name: 'Scrapy & Playwright', cat: 'Web Scraping', desc: 'Rotation de proxies & anti-ban' },
    { name: 'Notch Pay & Campay', cat: 'Payment Gateway', desc: 'MTN MoMo & Orange Money XAF' },
    { name: 'Celery & Redis', cat: 'Queue & Automations', desc: 'Tâches asynchrones & scheduling' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-white to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plateforme SaaS Multi-Services avec IA Intégrée 🇨🇲</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Tourisme, Logement & Intelligence Artificielle au{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Cameroun
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            La solution tout-en-un pour explorer l'Afrique centrale : réservations touristiques, 
            hébergements vérifiés, extraction de leads par IA, scraping haute vitesse avec rotation de proxies 
            et paiements instantanés <strong>MTN Mobile Money</strong> & <strong>Orange Money</strong> via <strong>Notch Pay</strong> et <strong>Campay</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/tourism"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Explorer le Tourisme & Logement
            </Link>
            <Link
              href="/lead-extraction"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Extraire des Leads par IA
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Matrix / Specification Badges */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Architecture Technique & Technologies Conformes au Cahier des Charges
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-sm text-center flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                    {tech.cat}
                  </span>
                  <span className="font-bold text-xs text-gray-900 block mt-0.5">
                    {tech.name}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 mt-2 block border-t border-gray-100 pt-1">
                  {tech.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Deep Dive */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Modules Métiers Opérationnels
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Une Suite Complète pour Particuliers & Entreprises
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            Sélectionnez un service pour découvrir ses fonctionnalités et son intégration technique.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-gray-100 rounded-2xl max-w-2xl mx-auto">
          {[
            { id: 'tourism', label: 'Tourisme & Hébergement', icon: Compass },
            { id: 'leads', label: 'Extraction Leads IA', icon: Bot },
            { id: 'scraping', label: 'Scraping & Proxies', icon: Globe },
            { id: 'payments', label: 'Paiements MoMo', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                  isSel
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Showcase */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
          {activeTab === 'tourism' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                  Tourisme & Housing
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Découvrez les Joyaux Touristiques du Cameroun
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Réservez des villas balnéaires privées à Kribi face à l'Atlantique, des appartements de haut standing 
                  à Douala Bonapriso et Yaoundé Bastos, ou planifiez l'ascension guidée du Mont Cameroun à Buea.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tarification transparente en Francs CFA (XAF)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Logements meublés avec groupe électrogène & Wi-Fi fibre
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Guides touristiques locaux certifiés
                  </li>
                </ul>
                <Link
                  href="/tourism"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2"
                >
                  Explorer les annonces <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                  alt="Kribi Beach Villa"
                  className="w-full h-72 object-cover"
                />
                <div className="p-4 bg-white">
                  <span className="text-xs font-bold text-gray-900 block">Villa Vue Mer - Kribi Plage</span>
                  <span className="text-xs text-gray-500">À partir de 45 000 XAF / nuit</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-md">
                  IA & NLP Extraction
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Extraction Automatique de Contacts B2B
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Exploitez la puissance des modèles OpenAI (GPT-4o), LangChain et HuggingFace pour transformer 
                  des annuaires non structurés en listes exploitables de prospects au Cameroun (+237 MTN / Orange).
                </p>
                <ul className="space-y-2 text-xs font-semibold text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" /> Validation des numéros MTN MoMo (67x) et Orange (69x)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" /> Détection géographique intelligente (Douala, Yaoundé, Kribi...)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" /> Export instantané en CSV et JSON pour CRM
                  </li>
                </ul>
                <Link
                  href="/lead-extraction"
                  className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 pt-2"
                >
                  Accéder au Studio IA <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3 font-mono text-xs">
                <div className="p-3 bg-purple-50 text-purple-900 rounded-xl">
                  <strong>Entrée brute :</strong> "Hôtel Atlantic Kribi. Contact: M. Eto'o, Tel: 677 12 34 56, email: contact@atlantic.cm"
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-700">Sortie JSON Extraite :</div>
                  <div>- Entreprise: Hôtel Atlantic Kribi</div>
                  <div>- Téléphone: +237677123456 (MTN)</div>
                  <div>- Ville: Kribi | Score: 96%</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scraping' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold rounded-md">
                  Scrapy, Playwright & Puppeteer
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Web Scraping avec Rotation Dynamique de Proxies
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Crawlez des catalogues, des annonces immobilières et des répertoires d'entreprises sans interruption. 
                  Notre ProxyRotator surveille la santé des IP et bascule automatiquement en cas de limitation de débit.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Pool de proxies datacenters & résidentiels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" /> File d'attente Celery & Redis pour exécution en tâche de fond
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Émulation de navigateurs réels avec user-agents aléatoires
                  </li>
                </ul>
                <Link
                  href="/scraping"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-600 hover:text-cyan-700 pt-2"
                >
                  Ouvrir le Hub de Scraping <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-gray-900 text-emerald-400 p-5 rounded-2xl font-mono text-xs space-y-2 shadow-inner border border-gray-800">
                <div className="text-gray-400"># Celery Async Worker Output</div>
                <div>[INFO] Spawning Playwright spider on target_url...</div>
                <div>[INFO] Assigned Proxy: http://198.51.100.1:8080 (Health: 100%)</div>
                <div>[INFO] Rendered dynamic JS in 1.2s</div>
                <div>[INFO] Extracted 12 leads via AILeadExtractor</div>
                <div className="text-white">[SUCCESS] Job completed without ban</div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">
                  Notch Pay & Campay API
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Paiements Directs MTN MoMo & Orange Money
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Offrez l'expérience d'achat la plus fluide au Cameroun avec prélèvement USSD direct ou redirection 
                  sécurisée. Notifications instantanées par Webhooks signés HMAC.
                </p>
                <ul className="space-y-2 text-xs font-semibold text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Prise en charge officielle MTN MoMo (+237)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Prise en charge officielle Orange Money Cameroun
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reçus électroniques par email & SMS
                  </li>
                </ul>
                <Link
                  href="/payments"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2"
                >
                  Tester le portail de paiement <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                  <span className="font-bold text-xs text-yellow-900">MTN Mobile Money</span>
                  <span className="text-xs font-mono font-bold text-yellow-800">*126# USSD</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200">
                  <span className="font-bold text-xs text-orange-900">Orange Money</span>
                  <span className="text-xs font-mono font-bold text-orange-800">#150# USSD</span>
                </div>
                <div className="text-center pt-2">
                  <span className="text-[11px] text-gray-400">
                    Certifié Notch Pay & Campay avec vérification webhook en temps réel
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Prêt à déployer votre solution SaaS au Cameroun ?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Profitez d'un code propre, testé, documenté et prêt pour vos commits GitHub et déploiements Docker.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl font-bold text-sm shadow-xl transition inline-flex items-center gap-2"
            >
              Créer mon compte KamStore <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

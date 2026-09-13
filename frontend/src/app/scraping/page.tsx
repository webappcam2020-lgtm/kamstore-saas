'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Play, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Activity, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { useScraperStore } from '@/lib/store';

export default function ScrapingHubPage() {
  const { jobs, activeProxiesCount, rotationStrategy, isLoading, createJob } = useScraperStore();

  const [targetUrl, setTargetUrl] = useState('https://annuaire-cameroun.cm/hotels-kribi');
  const [keyword, setKeyword] = useState('Tourisme & Résidences');
  const [engine, setEngine] = useState('playwright');
  const [enableProxy, setEnableProxy] = useState(true);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;
    await createJob(targetUrl, keyword, engine, enableProxy);
  };

  const presetUrls = [
    { label: 'Hôtels Kribi', url: 'https://pagesjaunes-cameroun.com/hotels-kribi', cat: 'Hôtellerie' },
    { label: 'Agences Immobilières Douala', url: 'https://douala-immo.cm/agences-bonapriso', cat: 'Immobilier' },
    { label: 'Tourisme Limbe & Buea', url: 'https://tourisme-littoral.cm/excursions', cat: 'Tourisme' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-md flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Scraping & Automation Hub
            </span>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Proxy Rotation Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Web Scraping & Gestionnaire de Proxies
          </h1>
          <p className="text-gray-600 text-sm mt-1 max-w-2xl">
            Exécutez des crawlers haute vitesse via Scrapy, Playwright ou Puppeteer. Contournez les blocages 
            anti-bots et rate limits grâce au pool de proxies avec rotation dynamique et file d'attente Celery / Redis.
          </p>
        </div>

        {/* Configuration and Proxy Pool Monitor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Launch Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-cyan-600" />
              Lancer une nouvelle tâche de scraping
            </h2>

            <form onSubmit={handleLaunch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Cible
                </label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://exemple.cm/annuaire"
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500 font-medium">Exemples :</span>
                {presetUrls.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => {
                      setTargetUrl(p.url);
                      setKeyword(p.cat);
                    }}
                    className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-cyan-50 hover:text-cyan-700 text-gray-600 rounded-lg transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Framework de Scraping
                  </label>
                  <select
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="playwright">Playwright (Headless Browser & JS)</option>
                    <option value="scrapy">Scrapy Engine (Fast Concurrent Spider)</option>
                    <option value="puppeteer">Puppeteer (Chromium DevTools)</option>
                    <option value="async_http">Async HTTP + BeautifulSoup (Ultra Rapide)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mots-clés / Catégorie cible
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Ex: Hôtels, Transport, Immobilier"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-cyan-50/60 rounded-xl border border-cyan-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RotateCw className="w-5 h-5 text-cyan-600 animate-spin-slow" />
                  <div>
                    <span className="text-xs font-bold text-cyan-900 block">
                      Rotation Automatique de Proxies
                    </span>
                    <span className="text-[11px] text-cyan-700">
                      Alterne entre adresses IP datacenters et résidentielles à chaque requête.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableProxy}
                  onChange={(e) => setEnableProxy(e.target.checked)}
                  className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !targetUrl.trim()}
                className="w-full py-3.5 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-md shadow-cyan-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Lancement de la tâche Celery...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Démarrer le Scraping
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Proxy Pool Health & Status */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-600" /> Pool de Proxies Actif
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Proxies Opérationnels</span>
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {activeProxiesCount} Actifs
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Stratégie de Rotation</span>
                  <span className="text-xs font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                    {rotationStrategy}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Orchestrateur Async</span>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    Celery + Redis
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-gray-700 block">État des Nœuds</span>
                <div className="p-2.5 bg-gray-50 rounded-lg text-[11px] font-mono flex justify-between items-center border border-gray-100">
                  <span className="text-gray-600">198.51.100.1:8080 (DC)</span>
                  <span className="text-emerald-600 font-bold">100% Santé</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg text-[11px] font-mono flex justify-between items-center border border-gray-100">
                  <span className="text-gray-600">203.0.113.10:3128 (Résid.)</span>
                  <span className="text-emerald-600 font-bold">98% Santé</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg text-[11px] font-mono flex justify-between items-center border border-gray-100">
                  <span className="text-gray-600">198.51.100.2:8080 (DC)</span>
                  <span className="text-emerald-600 font-bold">95% Santé</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Protection Anti-Ban Automatique
              </div>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                En cas d'erreur HTTP 429 (Too Many Requests) ou de captcha Cloudflare, le ProxyRotator met automatiquement l'adresse IP en quarantaine et bascule sur un nouveau nœud sans interrompre le job.
              </p>
            </div>
          </div>
        </div>

        {/* Scraping Jobs Queue Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600" />
              File des Tâches de Scraping ({jobs.length})
            </h2>
            <span className="text-xs text-gray-500">
              Synchronisé en temps réel avec le worker Celery
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 text-left">URL Cible & Mot-clé</th>
                  <th className="px-6 py-3.5 text-left">Moteur</th>
                  <th className="px-6 py-3.5 text-left">Proxy Utilisé</th>
                  <th className="px-6 py-3.5 text-left">Statut</th>
                  <th className="px-6 py-3.5 text-left">Leads Générés</th>
                  <th className="px-6 py-3.5 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 flex items-center gap-1 max-w-sm truncate">
                        <span title={job.target_url}>{job.target_url}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      </div>
                      {job.keyword && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          Cible : {job.keyword}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                        {job.engine}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">
                      {job.proxy_used || (job.proxy_rotation_enabled ? 'Rotation Active' : 'Direct')}
                    </td>
                    <td className="px-6 py-4">
                      {job.status === 'completed' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          Complété
                        </span>
                      )}
                      {job.status === 'running' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1 w-max">
                          <Activity className="w-3 h-3 animate-pulse" /> En cours
                        </span>
                      )}
                      {job.status === 'pending' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                          En attente
                        </span>
                      )}
                      {job.status === 'failed' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Échoué
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {job.leads_extracted} lead(s)
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(job.created_at).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Download, 
  Trash2, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  FileText,
  Search
} from 'lucide-react';
import { useLeadStore, Lead } from '@/lib/store';

export default function LeadExtractionPage() {
  const { leads, isLoading, engineUsed, processingTimeMs, extractLeads, clearLeads } = useLeadStore();
  
  const [rawText, setRawText] = useState(
    `Palm Beach Resort & Spa Kribi\nComplexe touristique 4 étoiles en bord de mer.\nDirecteur: M. Martin Abena\nTéléphone: +237 677 45 67 89 / 699 12 34 56\nEmail: reservations@palmbeach-kribi.cm\nAdresse: Boulevard Maritime, Kribi, Cameroun\n\nDouala VIP Transport & Logistics\nLocation de véhicules 4x4 et navettes aéroport Douala - Yaoundé.\nContact: Mme Chantal Bella\nTel: +237 650 11 22 33\nEmail: contact@douala-viptransport.cm\nLocalisation: Akwa, Douala`
  );
  const [engine, setEngine] = useState('auto');
  const [categoryHint, setCategoryHint] = useState('Tourisme & Hôtellerie');
  const [searchFilter, setSearchFilter] = useState('');

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    await extractLeads(rawText, categoryHint, engine);
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.company_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (l.phone && l.phone.includes(searchFilter)) ||
      (l.category && l.category.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = ['Entreprise', 'Contact', 'Email', 'Téléphone', 'Catégorie', 'Ville', 'Adresse', 'Confiance', 'Résumé IA'];
    const rows = filteredLeads.map((l) => [
      `"${l.company_name}"`,
      `"${l.contact_person || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.category || ''}"`,
      `"${l.city || ''}"`,
      `"${l.address || ''}"`,
      l.confidence_score,
      `"${l.ai_summary || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kamstore_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLeads, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `kamstore_leads_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-md flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> IA & NLP Engine
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md">
                Cameroun 🇨🇲 +237
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Extraction Intelligente de Leads B2B
            </h1>
            <p className="text-gray-600 text-sm mt-1 max-w-2xl">
              Analysez du texte brut, des pages web scrapées ou des annuaires d'entreprises. Notre IA extrait 
              automatiquement les téléphones MTN/Orange validés, emails, contacts et villes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              disabled={leads.length === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1.5 shadow-sm transition"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
            <button
              onClick={exportJSON}
              disabled={leads.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50 flex items-center gap-1.5 shadow-sm transition"
            >
              <Download className="w-4 h-4" /> JSON
            </button>
          </div>
        </div>

        {/* Studio Input & Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <form onSubmit={handleExtract} className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Texte source ou données scrapées
                </label>
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                >
                  Effacer
                </button>
              </div>

              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Collez ici les paragraphes contenant des adresses, numéros (+237), contacts, annonces..."
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-mono leading-relaxed"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Moteur IA / Modèle NLP
                  </label>
                  <select
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                  >
                    <option value="auto">Auto (OpenAI / LangChain / Fallback)</option>
                    <option value="openai">OpenAI (GPT-4o-mini JSON Mode)</option>
                    <option value="langchain">LangChain Structured Output</option>
                    <option value="huggingface">HuggingFace NER (dslim/bert)</option>
                    <option value="local_nlp">Moteur NLP Local (Cameroun +237)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Suggestion de secteur d'activité
                  </label>
                  <select
                    value={categoryHint}
                    onChange={(e) => setCategoryHint(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                  >
                    <option value="Tourisme & Hôtellerie">Tourisme & Hôtellerie</option>
                    <option value="Immobilier & Logement">Immobilier & Logement</option>
                    <option value="Transport & Logistique">Transport & Logistique</option>
                    <option value="Commerce & Retail">Commerce & Retail</option>
                    <option value="Services & Technologies">Services & Technologies</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !rawText.trim()}
                className="w-full py-3.5 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Extraction IA en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Lancer l'Extraction de Leads
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Engine Metrics & Stats */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" /> Métriques du pipeline IA
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Moteur actif</span>
                  <span className="text-xs font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {engineUsed}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Temps d'exécution</span>
                  <span className="text-xs font-mono font-semibold text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {processingTimeMs} ms
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500">Leads identifiés</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {filteredLeads.length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-gray-500">Précision opérateur</span>
                  <span className="text-xs font-semibold text-gray-700">MTN & Orange (100%)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100 text-xs text-purple-900 space-y-2">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                Compatibilité Télécom Cameroun
              </p>
              <p className="text-purple-700 leading-relaxed">
                Le moteur valide les numéros aux formats <strong>+237 67x, 68x, 65x</strong> (MTN MoMo) et <strong>+237 69x, 655-659</strong> (Orange Money) pour garantir des listes prêtes au démarchage WhatsApp & SMS.
              </p>
            </div>
          </div>
        </div>

        {/* Extracted Leads Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                Leads Extraits ({filteredLeads.length})
              </h2>
              {leads.length > 0 && (
                <button
                  onClick={clearLeads}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Vider
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrer entreprise, ville..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 text-left">Entreprise & Contact</th>
                  <th className="px-6 py-3.5 text-left">Coordonnées (+237)</th>
                  <th className="px-6 py-3.5 text-left">Localisation</th>
                  <th className="px-6 py-3.5 text-left">Catégorie</th>
                  <th className="px-6 py-3.5 text-left">Confiance</th>
                  <th className="px-6 py-3.5 text-left">Résumé IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                      Aucun lead à afficher. Collez du texte ci-dessus et cliquez sur "Lancer l'Extraction de Leads".
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                          {lead.company_name}
                        </div>
                        {lead.contact_person && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Contact : {lead.contact_person}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {lead.phone && (
                          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700">
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {lead.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-800">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          {lead.city}
                        </div>
                        {lead.address && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {lead.address}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {lead.category || 'Général'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${Math.round(lead.confidence_score * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700">
                            {Math.round(lead.confidence_score * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                        {lead.ai_summary || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

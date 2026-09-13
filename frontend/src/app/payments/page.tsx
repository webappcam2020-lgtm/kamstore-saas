'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Lock,
  Zap
} from 'lucide-react';
import { usePaymentStore, PaymentRecord } from '@/lib/store';

export default function PaymentsPage() {
  const { payments, isProcessing, initiatePayment, verifyPayment } = usePaymentStore();

  const [provider, setProvider] = useState<'notch_pay' | 'campay'>('notch_pay');
  const [operator, setOperator] = useState<'mtn' | 'orange'>('mtn');
  const [amount, setAmount] = useState<number>(15000);
  const [phone, setPhone] = useState<string>('+237 677 00 11 22');
  const [email, setEmail] = useState<string>('client@kamstore.cm');

  const [activePayment, setActivePayment] = useState<PaymentRecord | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationSuccess(null);
    const res = await initiatePayment(amount, provider, phone, email);
    setActivePayment(res);
  };

  const handleVerify = async () => {
    if (!activePayment) return;
    setIsVerifying(true);
    const ok = await verifyPayment(activePayment.transaction_ref);
    setVerificationSuccess(ok);
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-md flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Money Cameroun
            </span>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Notch Pay & Campay API
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Paiements Sécurisés MTN MoMo & Orange Money
          </h1>
          <p className="text-gray-600 text-sm mt-1 max-w-2xl">
            Effectuez des paiements instantanés en Francs CFA (XAF) pour vos réservations hôtelières, 
            excursions touristiques ou forfaits SaaS. Intégration native des passerelles certifiées Notch Pay et Campay.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Initier une transaction Mobile Money
            </h2>

            <form onSubmit={handlePay} className="space-y-6">
              {/* Gateway Choice: Notch Pay vs Campay */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  1. Passerelle de Paiement
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setProvider('notch_pay')}
                    className={`p-4 rounded-xl border text-left transition ${
                      provider === 'notch_pay'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">Notch Pay API</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                        Populaire
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Checkout multi-canaux (MTN, Orange, Cartes bancaires).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('campay')}
                    className={`p-4 rounded-xl border text-left transition ${
                      provider === 'campay'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">Campay API</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                        Direct USSD
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Débit USSD direct sur le numéro de téléphone sans redirection.
                    </p>
                  </button>
                </div>
              </div>

              {/* Operator: MTN vs Orange */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  2. Opérateur Mobile Money (+237)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOperator('mtn');
                      setPhone('+237 677 00 11 22');
                    }}
                    className={`p-3 rounded-xl border flex items-center space-x-3 transition ${
                      operator === 'mtn'
                        ? 'border-yellow-500 bg-yellow-50/60 ring-2 ring-yellow-400/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-400 font-bold text-black flex items-center justify-center text-xs">
                      MTN
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-gray-900">MTN MoMo</span>
                      <span className="text-[11px] text-gray-500">67x, 68x, 650-654</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOperator('orange');
                      setPhone('+237 699 33 44 55');
                    }}
                    className={`p-3 rounded-xl border flex items-center space-x-3 transition ${
                      operator === 'orange'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-400/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 font-bold text-white flex items-center justify-center text-xs">
                      OM
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-gray-900">Orange Money</span>
                      <span className="text-[11px] text-gray-500">69x, 655-659</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount & Phone Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Montant en Francs CFA (XAF)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full p-3 pr-14 rounded-xl border border-gray-300 font-mono text-base font-bold text-gray-900 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                    <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400">
                      XAF
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Numéro de Téléphone (+237)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full p-3 rounded-xl border border-gray-300 font-mono text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email du client pour le reçu électronique
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@kamstore.cm"
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing || amount <= 0}
                className="w-full py-4 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Initialisation avec la passerelle...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Payer {amount.toLocaleString('fr-FR')} XAF via {provider === 'notch_pay' ? 'Notch Pay' : 'Campay'}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Interactive Simulation & USSD Flow */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Simulateur de Validation USSD
              </h3>

              {activePayment ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 text-white rounded-xl font-mono text-xs space-y-2 border border-gray-800 shadow-inner">
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Prompt Mobile Money
                    </div>
                    <p className="text-gray-300">
                      Demande de débit de <strong className="text-white">{activePayment.amount} XAF</strong> vers KamStore.
                    </p>
                    <p className="text-gray-400">
                      Réf: {activePayment.transaction_ref}
                    </p>
                    <div className="pt-2 border-t border-gray-800 text-[11px] text-yellow-300">
                      Approuvez la transaction en composant *126# (MTN) ou #150# (Orange).
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleVerify}
                      disabled={isVerifying}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Vérification du statut...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Simuler la confirmation de paiement
                        </>
                      )}
                    </button>

                    {activePayment.checkout_url && (
                      <a
                        href={activePayment.checkout_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1"
                      >
                        Ouvrir le portail officiel Notch Pay <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {verificationSuccess && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Paiement validé avec succès ! Reçu électronique envoyé à {email}.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-500">
                  Remplissez le formulaire et cliquez sur "Payer" pour déclencher la simulation USSD.
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-xs text-blue-900 space-y-2">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Sécurité & Webhooks Asynchrones
              </span>
              <p className="text-blue-700 leading-relaxed text-[11px]">
                Toutes les notifications de débit sont validées par signature cryptographique HMAC-SHA256 sur les endpoints <code>/api/v1/payments/webhook/notchpay</code> et <code>/api/v1/payments/webhook/campay</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Historique des Transactions Récentes ({payments.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 text-left">Référence</th>
                  <th className="px-6 py-3.5 text-left">Passerelle</th>
                  <th className="px-6 py-3.5 text-left">Montant</th>
                  <th className="px-6 py-3.5 text-left">Téléphone</th>
                  <th className="px-6 py-3.5 text-left">Statut</th>
                  <th className="px-6 py-3.5 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      {p.transaction_ref}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                        p.provider === 'notch_pay' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.provider === 'notch_pay' ? 'Notch Pay' : 'Campay MoMo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {p.amount.toLocaleString('fr-FR')} {p.currency}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">
                      {p.customer_phone || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'completed' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          Complété
                        </span>
                      )}
                      {p.status === 'processing' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1 w-max">
                          <Clock className="w-3 h-3 animate-spin" /> En traitement
                        </span>
                      )}
                      {p.status === 'pending' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                          En attente
                        </span>
                      )}
                      {p.status === 'failed' && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Échoué
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(p.created_at).toLocaleString('fr-FR')}
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

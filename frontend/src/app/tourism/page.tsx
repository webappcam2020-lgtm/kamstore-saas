'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  CreditCard, 
  X, 
  CheckCircle2, 
  Filter,
  Sparkles
} from 'lucide-react';
import { useTourismStore, ListingItem } from '@/lib/store';

export default function TourismHousingPage() {
  const { listings, filterCategory, filterCity, setCategory, setCity } = useTourismStore();

  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [checkIn, setCheckIn] = useState<string>('2026-09-20');
  const [checkOut, setCheckOut] = useState<string>('2026-09-23');
  const [guests, setGuests] = useState<number>(2);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  const filtered = listings.filter((item) => {
    const matchCat = filterCategory === 'all' || item.category === filterCategory;
    const matchCity = filterCity === 'all' || item.city.toLowerCase() === filterCity.toLowerCase();
    return matchCat && matchCity;
  });

  const calculateTotal = (pricePerNight: number) => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    return diffTime * pricePerNight;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Services & Tourisme au Cameroun
            </span>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md">
              Hébergements & Activités
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Explorez et Réservez au Cameroun 🇨🇲
          </h1>
          <p className="text-gray-600 text-sm mt-1 max-w-2xl">
            Villas en bord de mer à Kribi, appartements de standing à Douala et Yaoundé, 
            randonnées au Mont Cameroun. Réservez et payez en direct avec MTN Mobile Money & Orange Money.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-xs font-bold text-gray-700 uppercase">Catégorie :</span>
            {['all', 'hotel', 'housing', 'activity'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filterCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' && 'Tous'}
                {cat === 'hotel' && 'Hôtels'}
                {cat === 'housing' && 'Appartements'}
                {cat === 'activity' && 'Excursions'}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-700 uppercase">Ville :</span>
            <select
              value={filterCity}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 bg-white focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Toutes les villes</option>
              <option value="Kribi">Kribi (Plages & Chutes)</option>
              <option value="Douala">Douala (Littoral)</option>
              <option value="Yaoundé">Yaoundé (Centre)</option>
              <option value="Buea">Buea (Mont Cameroun)</option>
              <option value="Limbe">Limbe (Sable noir)</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-black/60 backdrop-blur text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {item.city}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-white/90 text-amber-600 flex items-center gap-0.5 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {item.rating}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex justify-between items-center border-t border-gray-100 mt-4">
                <div>
                  <span className="text-lg font-black text-gray-900">
                    {item.price.toLocaleString('fr-FR')} XAF
                  </span>
                  <span className="text-[11px] text-gray-400 block">/ nuit ou forfait</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedListing(item);
                    setBookingConfirmed(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 transition"
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Booking Modal */}
        {selectedListing && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {!bookingConfirmed ? (
                <>
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Réservation Immédiate
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                      {selectedListing.title}
                    </h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {selectedListing.city}, Cameroun
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Date d'arrivée
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Date de départ
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nombre de voyageurs
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800"
                      >
                        <option value={1}>1 voyageur</option>
                        <option value={2}>2 voyageurs</option>
                        <option value={4}>3-4 voyageurs</option>
                        <option value={6}>5+ voyageurs</option>
                      </select>
                    </div>

                    {/* Price Summary */}
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                      <div className="flex justify-between text-xs text-emerald-900">
                        <span>Tarif par nuit / session</span>
                        <span className="font-semibold">{selectedListing.price.toLocaleString('fr-FR')} XAF</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-emerald-950 pt-2 border-t border-emerald-200">
                        <span>Total estimé</span>
                        <span>{calculateTotal(selectedListing.price).toLocaleString('fr-FR')} XAF</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setBookingConfirmed(true)}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirmer la réservation
                    </button>
                    <Link
                      href="/payments"
                      className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      Payer directement par MTN MoMo / Orange Money
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Réservation Enregistrée !
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    Votre demande pour <strong>{selectedListing.title}</strong> a été validée. 
                    Un SMS et un email de confirmation vous ont été transmis.
                  </p>
                  <div className="pt-4 flex flex-col gap-2">
                    <Link
                      href="/payments"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
                    >
                      Procéder au paiement Mobile Money ({calculateTotal(selectedListing.price).toLocaleString('fr-FR')} XAF)
                    </Link>
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="text-xs text-gray-500 hover:underline pt-1"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

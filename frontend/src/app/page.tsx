import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Map as MapIcon, Home, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547471080-7fc2caa6f56c?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Découvrez le Cameroun <br className="hidden md:block" />
            <span className="text-secondary-400">comme jamais</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
            Services de localisation, tourisme, logement — tout en un. La plateforme intelligente pour tous vos besoins au Cameroun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-secondary-500 hover:bg-secondary-600 text-white border-0">
                Commencer
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10 dark:hover:bg-white/10 dark:text-white">
                Découvrir nos services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nos Services Principaux</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Des solutions innovantes adaptées à vos besoins locaux.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow text-center">
              <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Localisation</h3>
              <p className="text-gray-600 dark:text-gray-400">Localisez n'importe quel numéro de téléphone en temps réel avec précision.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow text-center">
              <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <Navigation className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Géolocalisation</h3>
              <p className="text-gray-600 dark:text-gray-400">Suivez vos appareils et véhicules en temps réel sur une carte interactive.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow text-center">
              <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <MapIcon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tourisme</h3>
              <p className="text-gray-600 dark:text-gray-400">Explorez les merveilles du Cameroun avec nos guides touristiques virtuels IA.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow text-center">
              <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <Home className="h-7 w-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Logement</h3>
              <p className="text-gray-600 dark:text-gray-400">Trouvez votre logement idéal, de la chambre d'hôtel à l'appartement meublé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-card border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">+1000</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Utilisateurs</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">+500</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Annonces</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">+200</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Réservations</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">10</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Régions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">Ce que disent nos utilisateurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex text-secondary-500 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "Une application fantastique ! J'ai pu trouver un appartement meublé à Douala en quelques minutes. L'interface est très fluide."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Utilisateur {i}</h4>
                    <span className="text-sm text-gray-500">Yaoundé, CM</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Prêt à simplifier votre vie au Cameroun ?</h2>
          <p className="text-xl mb-10 text-primary-100">Rejoignez des milliers d'utilisateurs qui font déjà confiance à KamStore pour leurs besoins quotidiens.</p>
          <form className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="px-4 py-3 rounded-md flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary-500"
            />
            <Button variant="secondary" size="lg" className="whitespace-nowrap">
              S'inscrire
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { MapPin, Navigation, Map as MapIcon, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ServicesPage() {
  const services = [
    {
      id: 'localisation',
      title: 'Localisation de Numéro',
      icon: MapPin,
      description: 'Découvrez de quelle région provient un numéro de téléphone camerounais instantanément. Pratique pour vérifier l\'origine de vos appels.',
      features: ['Détection d\'opérateur', 'Région d\'origine', 'Historique des recherches'],
      status: 'Disponible'
    },
    {
      id: 'geolocalisation',
      title: 'Géolocalisation (GPS)',
      icon: Navigation,
      description: 'Suivez vos appareils, véhicules ou proches en temps réel. Une solution complète de sécurité et de gestion de flotte.',
      features: ['Suivi en temps réel', 'Historique des trajets', 'Alertes de zone'],
      status: 'Bientôt disponible'
    },
    {
      id: 'tourisme',
      title: 'Guide Touristique IA',
      icon: MapIcon,
      description: 'Explorez le Cameroun avec notre assistant IA. Trouvez les meilleurs sites touristiques, restaurants et activités selon vos préférences.',
      features: ['Recommandations IA', 'Réservation d\'activités', 'Guides locaux'],
      status: 'Disponible'
    },
    {
      id: 'logement',
      title: 'Réservation de Logement',
      icon: Home,
      description: 'Trouvez facilement des hôtels, appartements meublés ou maisons d\'hôtes certifiés partout au Cameroun.',
      features: ['Paiement Mobile Money', 'Avis vérifiés', 'Garantie KamStore'],
      status: 'Disponible'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Nos Services</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Découvrez la suite complète d'outils KamStore conçue pour faciliter votre quotidien au Cameroun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.id} id={service.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    service.status === 'Disponible' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-base mt-2">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">Fonctionnalités clés</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={service.status === 'Disponible' ? 'primary' : 'secondary'} disabled={service.status !== 'Disponible'}>
                  {service.status === 'Disponible' ? 'Essayer maintenant' : 'Être notifié'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

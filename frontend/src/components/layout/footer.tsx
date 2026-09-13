import React from 'react';
import Link from 'next/link';
import { MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-dark-bg dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Kam<span className="text-primary-600">Store</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              La plateforme multi-services numéro 1 au Cameroun. Localisation, tourisme et logement en un seul clic.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services#localisation" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">Localisation Numéro</Link></li>
              <li><Link href="/services#geolocalisation" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">Géolocalisation d'Appareils</Link></li>
              <li><Link href="/services#tourisme" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">Guide Touristique</Link></li>
              <li><Link href="/services#logement" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">Réservation Logement</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">Contactez-nous</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">Politique de Confidentialité</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">Conditions d'Utilisation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>Douala, Cameroun</li>
              <li>+237 600 000 000</li>
              <li>contact@kamstore.cm</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} KamStore SaaS. Tous droits réservés.
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
            Made in Cameroon 🇨🇲
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { PageLoader } from '@/components/ui/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Map, CreditCard, Star } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return <PageLoader />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bonjour, {user.name} 👋</h1>
        <p className="text-gray-500 mt-1">Voici un aperçu de votre activité sur KamStore.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-600 mt-1">+2 ce mois-ci</p>
          </CardContent>
        </Card>
        
        {user.role === 'HOST' || user.role === 'ADMIN' ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Annonces Actives</CardTitle>
              <Map className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-gray-500 mt-1">2 logements, 2 services</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Score IA</CardTitle>
              <Star className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-gray-500 mt-1">Niveau de personnalisation</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Paiements (XAF)</CardTitle>
            <CreditCard className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-gray-500 mt-1">Dépenses du mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Réservation Hôtel Akwa Palace</p>
                  <p className="text-xs text-gray-500">Confirmée - Il y a 2 jours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Profil mis à jour</p>
                  <p className="text-xs text-gray-500">Succès - Il y a 1 semaine</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
             <Button className="justify-start" variant="outline">Nouvelle recherche de logement</Button>
             <Button className="justify-start" variant="outline">Localiser un numéro (Démo)</Button>
             {user.role === 'HOST' && (
                <Button className="justify-start">Ajouter une annonce</Button>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

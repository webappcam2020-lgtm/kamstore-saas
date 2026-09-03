"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { 
  LayoutDashboard, 
  Calendar, 
  Map, 
  CreditCard, 
  Settings, 
  User,
  Users,
  BarChart
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const commonLinks = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mes Réservations', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Paiements', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Profil', href: '/dashboard/profile', icon: User },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];

  const hostLinks = [
    { name: 'Mes Annonces', href: '/dashboard/listings', icon: Map },
  ];

  const adminLinks = [
    { name: 'Utilisateurs', href: '/dashboard/admin/users', icon: Users },
    { name: 'Statistiques', href: '/dashboard/admin/stats', icon: BarChart },
  ];

  let links = [...commonLinks];
  if (user?.role === 'HOST' || user?.role === 'ADMIN') {
    links = [...commonLinks.slice(0, 2), ...hostLinks, ...commonLinks.slice(2)];
  }
  if (user?.role === 'ADMIN') {
    links = [...links, ...adminLinks];
  }

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-dark-bg min-h-[calc(100vh-4rem)] hidden md:block">
      <div className="h-full flex flex-col py-4">
        <nav className="flex-1 space-y-1 px-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-400 group-hover:text-primary-600 dark:text-gray-500 dark:group-hover:text-primary-400"
                  )}
                  aria-hidden="true"
                />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

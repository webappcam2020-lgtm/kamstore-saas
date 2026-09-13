'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Compass, 
  Bot, 
  Globe, 
  CreditCard, 
  Settings, 
  User,
  Sparkles
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tourisme & Logement', href: '/tourism', icon: Compass },
    { name: 'Extraction Leads IA', href: '/lead-extraction', icon: Bot, badge: 'IA' },
    { name: 'Scraping & Proxies', href: '/scraping', icon: Globe },
    { name: 'Paiements MoMo', href: '/payments', icon: CreditCard, badge: 'XAF' },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white min-h-[calc(100vh-4rem)] hidden md:block">
      <div className="h-full flex flex-col py-6">
        <div className="px-5 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
            Navigation SaaS
          </span>
        </div>
        <nav className="flex-1 space-y-1.5 px-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "group flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

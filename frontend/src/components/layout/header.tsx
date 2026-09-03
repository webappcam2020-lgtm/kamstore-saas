"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MapPin, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Basic dark mode sync
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Tourisme', href: '/services#tourisme' },
    { name: 'Logement', href: '/services#logement' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-dark-bg/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Kam<span className="text-primary-600">Store</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-600",
                  pathname === link.href ? "text-primary-600 dark:text-primary-400" : "text-gray-600 dark:text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Tableau de bord
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Inscription</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
             <button onClick={toggleDarkMode} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              {isAuthenticated ? (
                <div className="space-y-2">
                   <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                     <span className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300">Tableau de bord</span>
                   </Link>
                   <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600">
                     Déconnexion
                   </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Connexion</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full">Inscription</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

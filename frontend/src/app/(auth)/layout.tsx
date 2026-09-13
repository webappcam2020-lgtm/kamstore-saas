import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <MapPin className="h-10 w-10 text-primary-600" />
        <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Kam<span className="text-primary-600">Store</span>
        </span>
      </Link>
      {children}
    </div>
  );
}

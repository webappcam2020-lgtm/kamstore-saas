import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-6 w-6 animate-spin text-primary-600", className)} />;
}

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-dark-bg">
      <Spinner className="h-10 w-10" />
    </div>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      {...props}
    />
  );
}

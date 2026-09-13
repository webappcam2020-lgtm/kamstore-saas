"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginForm } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data);
      router.push('/dashboard');
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bon retour!</h1>
        <p className="text-sm text-gray-500 mt-2">Connectez-vous à votre compte KamStore</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md flex items-start gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Adresse Email"
          type="email"
          placeholder="vous@exemple.com"
          icon={<Mail className="h-5 w-5" />}
          {...register('email', { required: 'L\'email est requis' })}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5" />}
            {...register('password', { required: 'Le mot de passe est requis' })}
            error={errors.password?.message}
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-500">
              Mot de passe oublié?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Se connecter
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Pas de compte?{' '}
        <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-500">
          S'inscrire
        </Link>
      </div>
    </div>
  );
}

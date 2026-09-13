"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RegisterForm } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    defaultValues: { role: 'USER' }
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await registerUser(data);
      router.push('/dashboard');
    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 my-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un compte</h1>
        <p className="text-sm text-gray-500 mt-2">Rejoignez KamStore aujourd'hui</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md flex items-start gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nom complet"
          placeholder="Jean Dupont"
          icon={<User className="h-5 w-5" />}
          {...register('name', { required: 'Le nom est requis' })}
          error={errors.name?.message}
        />

        <Input
          label="Adresse Email"
          type="email"
          placeholder="vous@exemple.com"
          icon={<Mail className="h-5 w-5" />}
          {...register('email', { 
            required: 'L\'email est requis',
            pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' }
          })}
          error={errors.email?.message}
        />

        <Input
          label="Numéro de téléphone"
          type="tel"
          placeholder="+237 600 000 000"
          icon={<Phone className="h-5 w-5" />}
          {...register('phone', { required: 'Le numéro est requis' })}
          error={errors.phone?.message}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type de compte</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="USER" {...register('role')} className="text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Utilisateur</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="HOST" {...register('role')} className="text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Hôte (Prestataire)</span>
            </label>
          </div>
        </div>

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-5 w-5" />}
          {...register('password', { 
            required: 'Le mot de passe est requis',
            minLength: { value: 6, message: 'Minimum 6 caractères' }
          })}
          error={errors.password?.message}
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-5 w-5" />}
          {...register('confirmPassword', { 
            required: 'Veuillez confirmer',
            validate: value => value === password || 'Les mots de passe ne correspondent pas'
          })}
          error={errors.confirmPassword?.message}
        />

        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" id="terms" required className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <label htmlFor="terms" className="text-xs text-gray-500">
            J'accepte les conditions d'utilisation et la politique de confidentialité de KamStore.
          </label>
        </div>

        <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
          Créer mon compte
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Déjà un compte?{' '}
        <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500">
          Se connecter
        </Link>
      </div>
    </div>
  );
}

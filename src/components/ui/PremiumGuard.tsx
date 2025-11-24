import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface PremiumGuardProps {
  children: React.ReactNode;
  featureName?: string;
  fallback?: React.ReactNode; // Opcional: mostrar algo distinto al banner estándar
}

export const PremiumGuard = ({ children, featureName = "esta función", fallback }: PremiumGuardProps) => {
  const { profile, upgradeToPremium } = useAuth();

  // Si es Premium, renderizar el contenido normal (children)
  if (profile?.subscriptionStatus === 'PREMIUM') {
    return <>{children}</>;
  }

  // Si hay un fallback personalizado, usarlo
  if (fallback) return <>{fallback}</>;

  // Si no, mostrar el Paywall por defecto
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-lg">
      {/* Fondo borroso para simular contenido detrás */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-indigo-50 p-4 ring-8 ring-indigo-50/50">
          <Lock className="h-8 w-8 text-indigo-600" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900">
          Desbloquea {featureName}
        </h3>
        
        <p className="max-w-md text-slate-500">
          Esta es una característica exclusiva del plan <strong>Ingeniero</strong>. Obtén acceso ilimitado al algoritmo WEDF, analíticas avanzadas y más.
        </p>

        <button
          onClick={upgradeToPremium} // Simulamos el pago aquí
          className="group mt-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105 hover:shadow-xl"
        >
          <Sparkles size={18} className="group-hover:animate-spin" />
          Mejorar a Premium (Simular Pago)
        </button>
        
        <p className="text-xs text-slate-400">30 días de garantía de devolución.</p>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { RoutineForm } from '../routine/RoutineForm';
import { Settings as SettingsIcon, User, Edit2, Save, X, CreditCard, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const SettingsView = () => {
  const { user, profile, upgradeToPremium } = useAuth();
  
  // Estados de edición
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.displayName || '');
  const [email, setEmail] = useState(profile?.email || ''); // Nota: Cambiar email real requiere re-auth de Firebase
  const [loading, setLoading] = useState(false);

  // Sincronizar estado si el perfil cambia (ej: al cargar)
  useEffect(() => {
    if (profile) {
      setName(profile.displayName || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Actualizamos en Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: name,
        // email: email // Descomentar si implementas lógica de cambio de email en Auth
      });
      
      setIsEditing(false);
      // Opcional: Mostrar toast de éxito
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al guardar los cambios.");
    }
    setLoading(false);
  };

  const handleManageSubscription = async () => {
    if (profile?.subscriptionStatus === 'FREE') {
        if (window.confirm("¿Quieres mejorar a Plan Ingeniero por 4.99€/mes?")) {
            await upgradeToPremium();
        }
    } else {
        alert("Para cancelar tu suscripción, contacta con soporte (Simulación).");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="text-slate-400" /> Configuración
        </h2>
        <p className="text-slate-500 mt-1">Gestiona tu perfil y preferencias de estudio.</p>
      </div>

      {/* Sección Perfil Editable */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <User size={20} className="text-blue-500" /> Perfil de Estudiante
            </h3>
            {!isEditing ? (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Edit2 size={16} /> Editar
                </button>
            ) : (
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                        disabled={loading}
                    >
                        <X size={18} />
                    </button>
                    <button 
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : <><Save size={16} /> Guardar</>}
                    </button>
                </div>
            )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nombre Visible</label>
            {isEditing ? (
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                    placeholder="Tu Nombre"
                />
            ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-slate-700 font-medium border border-slate-100">
                    {profile?.displayName || 'Sin nombre'}
                </div>
            )}
          </div>

          {/* Email (Solo lectura por seguridad básica en esta demo) */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Email (Cuenta)</label>
            <div className="p-3 bg-slate-100 rounded-lg text-slate-500 font-medium border border-slate-200 flex justify-between items-center">
                {profile?.email}
                {isEditing && <span className="text-[10px] text-slate-400 italic">No editable</span>}
            </div>
          </div>

          {/* Plan / Suscripción */}
          <div className="md:col-span-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Suscripción Actual</label>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${profile?.subscriptionStatus === 'PREMIUM' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                        {profile?.subscriptionStatus === 'PREMIUM' ? <Crown size={20} /> : <User size={20} />}
                    </div>
                    <div>
                        <p className={`font-bold ${profile?.subscriptionStatus === 'PREMIUM' ? 'text-indigo-700' : 'text-slate-700'}`}>
                            {profile?.subscriptionStatus === 'PREMIUM' ? 'Estudiante Pro' : 'Plan Básico'}
                        </p>
                        <p className="text-xs text-slate-500">
                            {profile?.subscriptionStatus === 'PREMIUM' ? 'Facturación mensual' : 'Gratis para siempre'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={handleManageSubscription}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        profile?.subscriptionStatus === 'PREMIUM' 
                        ? 'text-slate-600 hover:bg-slate-200 bg-slate-100'
                        : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                    }`}
                >
                    {profile?.subscriptionStatus === 'PREMIUM' ? 'Gestionar' : 'Mejorar Plan'}
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reutilizamos el formulario de rutina aquí */}
      <section>
        <RoutineForm />
      </section>

    </div>
  );
};
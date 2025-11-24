import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { ArrowRight, Check, User, Moon, BookOpen, Star } from 'lucide-react';

export const OnboardingWizard = () => {
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [name, setName] = useState('');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [taskTitle, setTaskTitle] = useState('');

  if (!user) return null;

  const handleFinish = async () => {
    setLoading(true);
    try {
      const USER_ID = user.uid;

      // 1. Guardar Rutina Básica
      await setDoc(doc(db, 'users', USER_ID, 'routine', 'weekly'), {
        sleepStart: sleepTime,
        sleepEnd: '07:00', // Default
        unavailableBlocks: []
      });

      // 2. Crear la Primera Tarea
      if (taskTitle) {
        await addDoc(collection(db, 'users', USER_ID, 'tasks'), {
          title: taskTitle,
          subject: 'Mi Primer Objetivo',
          status: 'TODO',
          priority: 'HIGH',
          duration: 60,
          dueDate: Timestamp.fromDate(new Date()), // Para hoy
          createdAt: Timestamp.now()
        });
      }

      // 3. Finalizar en AuthContext
      await completeOnboarding({ displayName: name });

    } catch (error) {
      console.error("Error en onboarding:", error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="p-8 md:p-10">
          
          {/* STEP 1: NOMBRE */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">¡Hola! Vamos a conocernos</h2>
              <p className="text-center text-slate-500 mb-8">Antes de organizar tu vida, ¿cómo te llamas?</p>
              
              <input 
                autoFocus
                type="text" 
                placeholder="Tu nombre"
                className="w-full text-center text-xl py-3 border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors bg-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name && setStep(2)}
              />
            </div>
          )}

          {/* STEP 2: RUTINA */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-300">
               <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Moon size={24} />
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Descanso sagrado</h2>
              <p className="text-center text-slate-500 mb-8">
                Para que el algoritmo funcione, necesitamos saber cuándo sueles irte a dormir.
              </p>
              
              <div className="flex justify-center">
                <input 
                  type="time" 
                  className="text-3xl font-bold text-slate-700 bg-slate-100 px-6 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: PRIMERA TAREA */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-300">
               <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Star size={24} />
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Tu primer objetivo</h2>
              <p className="text-center text-slate-500 mb-8">
                Escribe una tarea importante que tengas pendiente para hoy.
              </p>
              
              <input 
                autoFocus
                type="text" 
                placeholder="Ej: Estudiar Cálculo Tema 1"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && taskTitle && handleFinish()}
              />
            </div>
          )}

          {/* FOOTER BUTTONS */}
          <div className="mt-10 flex justify-end">
            {step < 3 ? (
              <button 
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && !name}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                disabled={!taskTitle || loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Configurando...' : '¡Empezar a Estudiar!'}
                {!loading && <Check size={20} />}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
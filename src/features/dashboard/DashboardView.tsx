import { useState } from 'react';
import { Plus, Clock, CheckCircle2, CalendarClock, X, Sparkles, BrainCircuit, BarChart3 } from 'lucide-react';
import type { Task } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

// --- AQUÍ ESTABA EL PROBLEMA: Añadimos onTaskComplete a la interfaz ---
interface DashboardViewProps {
  tasks: Task[];
  onAddTask: () => void;
  onTaskComplete?: (taskId: string) => void; // <--- Propiedad necesaria
}

export const DashboardView = ({ tasks, onAddTask, onTaskComplete }: DashboardViewProps) => {
  const { profile, upgradeToPremium } = useAuth();
  const isPremium = profile?.subscriptionStatus === 'PREMIUM';
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const pendingTasks = tasks.filter(t => t.status !== 'DONE');
  const completedToday = tasks.filter(t => t.status === 'DONE').length;

  const handleConfirmUpgrade = async () => {
    if (window.confirm("Confirmar pago simulado de 4.99€")) {
      await upgradeToPremium();
      setShowPremiumModal(false);
    }
  };

  const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

  return (
    <>
      {/* --- MODAL DE INFORMACIÓN PREMIUM --- */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X size={20} className="text-slate-400" />
            </button>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm shadow-lg">
                  <Sparkles size={32} className="text-yellow-300 fill-yellow-300" />
                </div>
                <h2 className="text-2xl font-bold">Estudiante Pro</h2>
                <p className="text-blue-100 text-sm">Desbloquea todo tu potencial académico</p>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-full mt-0.5">
                    <BrainCircuit size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Planificación Inteligente</h4>
                    <p className="text-xs text-slate-500">Algoritmo automático basado en tus fechas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-purple-100 text-purple-600 rounded-full mt-0.5">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Analíticas Avanzadas</h4>
                    <p className="text-xs text-slate-500">Visualiza tu rendimiento y predicción de éxito.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-amber-100 text-amber-600 rounded-full mt-0.5">
                    <CalendarClock size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Sincronización Total</h4>
                    <p className="text-xs text-slate-500">Conecta con tu calendario personal (Próximamente).</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Precio mensual</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">4.99€</span>
                  <span className="text-xs text-slate-400">/mes</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmUpgrade}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                Mejorar a Premium <ArrowRightIcon />
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-3">
                Pago seguro vía Stripe (Simulado). Cancela cuando quieras.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Panel de Control</h2>
            <p className="text-slate-500">Resumen de tu actividad y progreso.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Semana Actual</span>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            
            <button 
              onClick={onAddTask} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shadow-blue-200 hover:shadow-md active:scale-95 transform duration-100"
            >
              <Plus size={16} /> Nueva Tarea
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-sm font-medium text-slate-500">Pendientes</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{pendingTasks.length}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-medium text-slate-500">Completadas Hoy</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{completedToday}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-medium text-slate-500">Horas de Estudio</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">12.5h</p>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
            <p className="text-sm font-medium text-slate-300">Racha Actual</p>
            <p className="text-3xl font-bold text-amber-400 mt-2">4 <span className="text-sm text-slate-300 font-normal">días 🔥</span></p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tareas Sugeridas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Plan Sugerido para Hoy</h3>
              {isPremium && (
                <Badge type="subject">Planificación Activa</Badge>
              )}
            </div>
            
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Clock size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{task.subject}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{task.duration} min est.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge type="priority">{task.priority}</Badge>
                  {/* Botón Completar Tarea */}
                  <button 
                    onClick={() => onTaskComplete && onTaskComplete(task.id)}
                    className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                    title="Marcar como completada"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            
            {pendingTasks.length === 0 && (
               <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm">
                  ¡Todo limpio! No tienes tareas pendientes.
               </div>
            )}
          </div>

          {/* Sidebar Derecho */}
          <div className="space-y-4">
            {!isPremium ? (
              <Card className="p-5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]" >
                <div 
                  className="absolute inset-0 z-20 cursor-pointer" 
                  onClick={() => setShowPremiumModal(true)} 
                />
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                   <CalendarClock size={100} />
                </div>
                <div className="relative z-10 flex items-start justify-between pointer-events-none">
                  <div>
                    <h3 className="font-semibold text-lg">Modo Premium</h3>
                    <p className="text-blue-100 text-sm mt-1">Desbloquea la IA.</p>
                    <div className="mt-4 text-xs bg-white/20 inline-block px-2 py-1 rounded font-medium backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                       Ver detalles
                    </div>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <CalendarClock size={20} />
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-5 bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-none relative overflow-hidden">
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Plan Activo</h3>
                    <p className="text-emerald-100 text-sm mt-1">Todo listo.</p>
                    <div className="mt-4 text-xs bg-white/20 inline-block px-2 py-1 rounded font-medium backdrop-blur-sm">
                       Estudiante Pro ⚡
                    </div>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
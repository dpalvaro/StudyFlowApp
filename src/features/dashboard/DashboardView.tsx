import { Plus, Clock, CheckCircle2, CalendarClock } from 'lucide-react';
import type { Task } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const DashboardView = ({ tasks }: { tasks: Task[] }) => {
  const pendingTasks = tasks.filter(t => t.status !== 'DONE');
  const completedToday = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Panel de Control</h2>
          <p className="text-slate-500">Resumen de tu actividad y progreso.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Semana 12</span>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
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
            <Badge type="subject">Algoritmo WEDF Activo</Badge>
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
                <button className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                  <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Derecho */}
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">Modo Premium</h3>
                <p className="text-blue-100 text-sm mt-1">Asignación dinámica activa.</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <CalendarClock size={20} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
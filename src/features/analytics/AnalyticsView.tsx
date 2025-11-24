import type { Task } from '../../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { CheckCircle2, Clock, AlertTriangle, Trophy, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
}

export const AnalyticsView = ({ tasks }: AnalyticsViewProps) => {
  
  // --- 1. PROCESAMIENTO DE DATOS ---

  // Datos Globales
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Cálculo de Horas Estimadas
  const totalMinutes = tasks.reduce((acc, t) => acc + t.duration, 0);
  const completedMinutes = tasks.filter(t => t.status === 'DONE').reduce((acc, t) => acc + t.duration, 0);
  const remainingHours = Math.round((totalMinutes - completedMinutes) / 60);

  // Datos para Gráfico Circular (Estado)
  const statusData = [
    { name: 'Pendientes', value: tasks.filter(t => t.status === 'TODO').length, color: '#94a3b8' }, // Slate 400
    { name: 'En Progreso', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#3b82f6' }, // Blue 500
    { name: 'Completadas', value: completedTasks, color: '#10b981' }, // Emerald 500
  ].filter(d => d.value > 0);

  // Datos para Gráfico de Barras (Prioridad)
  const priorityData = [
    { name: 'Alta', cantidad: tasks.filter(t => t.priority === 'HIGH').length },
    { name: 'Media', cantidad: tasks.filter(t => t.priority === 'MEDIUM').length },
    { name: 'Baja', cantidad: tasks.filter(t => t.priority === 'LOW').length },
  ];

  // --- 2. RENDERIZADO ---

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="text-emerald-600" /> Análisis de Rendimiento
        </h2>
        <p className="text-slate-500 mt-1">Visualiza tus métricas de estudio y cumplimiento de objetivos.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasa de Éxito</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{completionRate}%</p>
            </div>
            <Trophy className="text-emerald-500 opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tareas Totales</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{totalTasks}</p>
            </div>
            <CheckCircle2 className="text-blue-500 opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Horas Restantes</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{remainingHours}h</p>
            </div>
            <Clock className="text-indigo-500 opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-rose-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alta Prioridad</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {tasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE').length}
              </p>
            </div>
            <AlertTriangle className="text-rose-500 opacity-20" size={32} />
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Distribución de Estado */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Estado de Tareas</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Distribución por Prioridad */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Carga por Prioridad</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="cantidad" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
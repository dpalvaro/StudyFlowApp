import type { Task } from '../../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, ZAxis 
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { CheckCircle2, Clock, AlertTriangle, Trophy, TrendingUp, BrainCircuit, Target } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
}

export const AnalyticsView = ({ tasks }: AnalyticsViewProps) => {
  
  // --- 1. PROCESAMIENTO DE DATOS ---

  // Datos Globales
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'DONE');
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // Cálculo de Horas Estimadas (Usando el nuevo campo estimatedDuration)
  const totalMinutesEstimated = tasks.reduce((acc, t) => acc + (t.estimatedDuration || 0), 0);
  const completedMinutes = completedTasks.reduce((acc, t) => acc + (t.estimatedDuration || 0), 0);
  const remainingHours = Math.round((totalMinutesEstimated - completedMinutes) / 60);

  // Nota en Juego (Suma de gradeImpact de tareas completadas)
  // Esto es una simulación: asume que si completas la tarea, consigues ese % de la nota.
  const gradeSecured = completedTasks.reduce((acc, t) => acc + (t.gradeImpact || 0), 0);
  const totalGradePotential = tasks.reduce((acc, t) => acc + (t.gradeImpact || 0), 0);

  // Datos para Gráfico Circular (Dificultad)
  const difficultyData = [
    { name: 'Fácil', value: tasks.filter(t => t.difficulty === 'EASY').length, color: '#10b981' }, // Emerald
    { name: 'Media', value: tasks.filter(t => t.difficulty === 'MEDIUM').length, color: '#3b82f6' }, // Blue
    { name: 'Difícil', value: tasks.filter(t => t.difficulty === 'HARD').length, color: '#f59e0b' }, // Amber
    { name: 'Extrema', value: tasks.filter(t => t.difficulty === 'EXTREME').length, color: '#ef4444' }, // Red
  ].filter(d => d.value > 0);

  // Datos para Gráfico de Barras (Tipo de Contenido)
  const contentTypeData = [
    { name: 'Lectura', cantidad: tasks.filter(t => t.contentType === 'PAGES').length },
    { name: 'Ejercicios', cantidad: tasks.filter(t => t.contentType === 'EXERCISES').length },
    { name: 'Temas', cantidad: tasks.filter(t => t.contentType === 'TOPICS').length },
    { name: 'Proyectos', cantidad: tasks.filter(t => t.contentType === 'PROJECT_HOURS').length },
  ];

  // Datos para Scatter (Impacto vs Duración) -> ¿Gastas tiempo en lo importante?
  const scatterData = tasks.map(t => ({
    x: t.estimatedDuration || 0, // Eje X: Tiempo (min)
    y: t.gradeImpact || 0,       // Eje Y: Nota (%)
    z: 1,                        // Tamaño burbuja
    name: t.title,
    status: t.status
  }));

  // --- 2. RENDERIZADO ---

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="text-emerald-600" /> Inteligencia Académica
        </h2>
        <p className="text-slate-500 mt-1">Métricas basadas en el Algoritmo WEDF y tu rendimiento real.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nota Asegurada</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {gradeSecured}<span className="text-sm text-slate-400 font-normal">/{totalGradePotential}</span>
              </p>
            </div>
            <Trophy className="text-emerald-500 opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eficiencia</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{completionRate}%</p>
            </div>
            <CheckCircle2 className="text-blue-500 opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Carga Restante</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{remainingHours}h</p>
            </div>
            <Clock className="text-indigo-500 opacity-20" size={32} />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-rose-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tareas Extremas</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {tasks.filter(t => t.difficulty === 'EXTREME' && t.status !== 'DONE').length}
              </p>
            </div>
            <AlertTriangle className="text-rose-500 opacity-20" size={32} />
          </div>
        </Card>
      </div>

      {/* Gráficos Principales */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Distribución de Dificultad */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <BrainCircuit size={18} className="text-indigo-500" />
                Complejidad del Temario
             </h3>
             <p className="text-xs text-slate-400">Distribución de tareas según dificultad asignada.</p>
          </div>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: ROI de Estudio (Impacto vs Tiempo) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Target size={18} className="text-rose-500" />
                ROI de Estudio
             </h3>
             <p className="text-xs text-slate-400">¿Vale la pena el tiempo invertido? (Arriba a la izquierda = Mejor ROI)</p>
          </div>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Tiempo (min)" unit="m" stroke="#94a3b8" fontSize={12} />
                <YAxis type="number" dataKey="y" name="Impacto Nota" unit="%" stroke="#94a3b8" fontSize={12} />
                <ZAxis type="number" range={[60, 60]} />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Tareas" data={scatterData} fill="#8884d8">
                    {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.status === 'DONE' ? '#10b981' : '#6366f1'} />
                    ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Gráfico 3: Tipos de Actividad */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Estilo de Estudio</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentTypeData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} style={{fontSize: '12px', fontWeight: 500}} />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="cantidad" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#f8fafc' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>

    </div>
  );
};
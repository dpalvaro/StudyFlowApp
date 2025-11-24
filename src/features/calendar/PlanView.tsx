import { useState, useEffect } from 'react';
import type { RoutineConfig, Task, StudySession } from '../../types';
import { generateStudyPlan } from '../../lib/algorithm';
import { RoutineForm } from '../routine/RoutineForm';
import { Calendar, BrainCircuit, ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { format, isSameDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const DEMO_USER_ID = "demo-student";

interface PlanViewProps {
  tasks: Task[];
}

export const PlanView = ({ tasks }: PlanViewProps) => {
  const [mode, setMode] = useState<'VIEW' | 'CONFIG'>('VIEW');
  const [routine, setRoutine] = useState<RoutineConfig | null>(null);
  const [plan, setPlan] = useState<StudySession[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Cargar rutina al inicio
  useEffect(() => {
    const fetchRoutine = async () => {
      const docSnap = await getDoc(doc(db, 'users', DEMO_USER_ID, 'routine', 'weekly'));
      if (docSnap.exists()) {
        setRoutine(docSnap.data() as RoutineConfig);
      }
    };
    fetchRoutine();
  }, []);

  // Ejecutar algoritmo cuando hay rutina y tareas
  useEffect(() => {
    if (routine && tasks.length > 0 && mode === 'VIEW') {
      setIsGenerating(true);
      // Simular un pequeño delay para efecto "Calculando..."
      setTimeout(() => {
        const generatedPlan = generateStudyPlan(tasks, routine);
        setPlan(generatedPlan);
        setIsGenerating(false);
      }, 800);
    }
  }, [routine, tasks, mode]);

  if (mode === 'CONFIG' || !routine) {
    return (
      <div>
        <button 
          onClick={() => setMode('VIEW')} 
          className="mb-4 text-slate-500 hover:text-blue-600 flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Volver al Plan
        </button>
        <RoutineForm />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="text-indigo-600" /> Planificador Inteligente
          </h2>
          <p className="text-slate-500 mt-1">
            Algoritmo WEDF: Optimizando tus siguientes 3 días.
          </p>
        </div>
        <button 
          onClick={() => setMode('CONFIG')}
          className="text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
        >
          Ajustar Rutina / Horario
        </button>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="p-12 text-center border-2 border-dashed border-indigo-100 rounded-xl bg-indigo-50/30">
          <BrainCircuit className="mx-auto h-12 w-12 text-indigo-400 animate-pulse mb-4" />
          <h3 className="text-lg font-medium text-indigo-900">Calculando ruta óptima...</h3>
          <p className="text-indigo-600/70">Analizando prioridades y huecos libres.</p>
        </div>
      )}

      {/* Results: Timeline */}
      {!isGenerating && plan.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map(dayOffset => {
            const date = addDays(new Date(), dayOffset);
            const daySessions = plan.filter(s => isSameDay(s.startTime, date));

            return (
              <div key={dayOffset} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-slate-50 p-3 border-b border-slate-100 font-bold text-slate-700 text-center uppercase text-sm tracking-wider">
                  {format(date, "EEEE d", { locale: es })}
                </div>
                
                <div className="p-3 space-y-3 flex-1 min-h-[200px]">
                  {daySessions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic">
                      <p>Sin sesiones programadas</p>
                    </div>
                  ) : (
                    daySessions.map(session => (
                      <div key={session.id} className="bg-white border-l-4 border-indigo-500 shadow-sm p-3 rounded-r-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {format(session.startTime, 'HH:mm')} - {format(session.endTime, 'HH:mm')}
                          </span>
                          <span className="text-xs text-slate-400">{session.durationMinutes}m</span>
                        </div>
                        <h4 className="font-medium text-slate-800 text-sm leading-tight">{session.taskTitle}</h4>
                        <div className="flex items-center gap-1mt-1 text-xs text-slate-500 mt-1">
                           <BookOpen size={12} /> {session.subject}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isGenerating && plan.length === 0 && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
          <Calendar className="mx-auto text-slate-300 mb-2" size={48} />
          <p className="text-slate-600 font-medium">No hay sesiones planificadas.</p>
          <p className="text-sm text-slate-400">Puede que no tengas tareas pendientes o que tu rutina no tenga huecos libres.</p>
        </div>
      )}
    </div>
  );
};
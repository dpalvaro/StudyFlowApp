import { useState, useEffect } from 'react';
import type { RoutineConfig, Task, StudySession } from '../../types';
import { generateStudyPlan } from '../../lib/algorithm';
import { RoutineForm } from '../routine/RoutineForm';
import { Calendar, BrainCircuit, ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { format, isSameDay, addDays, isValid } from 'date-fns'; 
import { es } from 'date-fns/locale';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface PlanViewProps {
  tasks: Task[];
}

export const PlanView = ({ tasks }: PlanViewProps) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'VIEW' | 'CONFIG'>('VIEW');
  const [routine, setRoutine] = useState<RoutineConfig | null>(null);
  const [plan, setPlan] = useState<StudySession[]>([]);
  const [isGenerating, setIsGenerating] = useState(true); 

  useEffect(() => {
    if (!user) return;
    const fetchRoutine = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid, 'routine', 'weekly'));
        if (docSnap.exists()) {
          setRoutine(docSnap.data() as RoutineConfig);
        } else {
            setRoutine(null); 
        }
      } catch (error) {
        console.error("Error cargando rutina:", error);
      } finally {
        if (tasks.length === 0) setIsGenerating(false);
      }
    };
    fetchRoutine();
  }, [user]);

  useEffect(() => {
    if (routine && tasks.length > 0 && mode === 'VIEW') {
      setIsGenerating(true);
      const timer = setTimeout(() => {
        try {
          const generatedPlan = generateStudyPlan(tasks, routine);
          setPlan(generatedPlan);
        } catch (e) {
          console.error("Error generando plan:", e);
        } finally {
          setIsGenerating(false);
        }
      }, 800);
      return () => clearTimeout(timer);
    } else if (tasks.length === 0) {
        setPlan([]);
        setIsGenerating(false);
    }
  }, [routine, tasks, mode]);

  if (!routine && !isGenerating) {
     return (
        <div className="text-center p-10">
            <h3 className="text-lg font-bold text-slate-700 mb-2">Falta configurar tu rutina</h3>
            <p className="text-slate-500 mb-6">Para generar un plan, necesitamos saber tus horarios.</p>
            <button 
                onClick={() => setMode('CONFIG')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Configurar Horario Ahora
            </button>
            {mode === 'CONFIG' && <RoutineForm />} 
        </div>
     );
  }

  if (mode === 'CONFIG') {
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

  // Renderizar los próximos 5 días para tener mejor visión
  const DAYS_TO_SHOW = 5;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="text-indigo-600" /> Planificador Inteligente
          </h2>
          <p className="text-slate-500 mt-1">
            Algoritmo Activo: Calculando ruta óptima hasta tus entregas.
          </p>
        </div>
        <button 
          onClick={() => setMode('CONFIG')}
          className="text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
        >
          Ajustar Rutina
        </button>
      </div>

      {isGenerating && (
        <div className="p-12 text-center border-2 border-dashed border-indigo-100 rounded-xl bg-indigo-50/30">
          <BrainCircuit className="mx-auto h-12 w-12 text-indigo-400 animate-pulse mb-4" />
          <h3 className="text-lg font-medium text-indigo-900">Calculando ruta óptima...</h3>
          <p className="text-indigo-600/70">Analizando prioridades y huecos libres.</p>
        </div>
      )}

      {!isGenerating && plan.length > 0 && (
        // Ahora usamos grid-cols-5 en pantallas grandes para ver más días
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: DAYS_TO_SHOW }).map((_, dayOffset) => {
            const date = addDays(new Date(), dayOffset);
            const daySessions = plan.filter(s => 
              isSameDay(s.startTime, date) && isValid(s.startTime) && isValid(s.endTime)
            );

            return (
              <div key={dayOffset} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow min-h-[250px]">
                <div className={`p-3 border-b border-slate-100 font-bold text-center uppercase text-xs tracking-wider ${dayOffset === 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'}`}>
                  {isValid(date) ? format(date, "EEE d", { locale: es }) : 'Invalid'}
                  {dayOffset === 0 && " (Hoy)"}
                </div>
                
                <div className="p-2 space-y-2 flex-1 overflow-y-auto custom-scrollbar max-h-[400px]">
                  {daySessions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 text-xs italic p-4 text-center">
                      <p>Libre</p>
                    </div>
                  ) : (
                    daySessions.map(session => (
                      <div key={session.id} className="bg-white border border-slate-100 border-l-4 border-l-indigo-500 shadow-sm p-2 rounded hover:bg-indigo-50/30 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">
                            {format(session.startTime, 'HH:mm')}
                          </span>
                          <span className="text-[10px] text-slate-400">{session.durationMinutes}m</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs leading-snug mb-0.5 line-clamp-2">{session.taskTitle}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                           <BookOpen size={10} /> 
                           <span className="truncate">{session.subject}</span>
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

      {!isGenerating && plan.length === 0 && tasks.length > 0 && (
        <div className="p-8 text-center bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
          <div className="flex justify-center mb-2"><Calendar className="text-amber-500" size={40} /></div>
          <h3 className="font-bold text-lg">No se pudo generar un plan</h3>
          <p className="text-sm opacity-80 max-w-md mx-auto mt-1">
            El algoritmo no encontró huecos libres compatibles antes de tus fechas de entrega.
            <br/><span className="font-semibold">Prueba a reducir la duración estimada o liberar espacio en tu rutina.</span>
          </p>
        </div>
      )}

      {!isGenerating && tasks.length === 0 && (
        <div className="p-12 text-center bg-slate-50 rounded-xl border border-slate-200">
          <Calendar className="mx-auto text-slate-300 mb-2" size={48} />
          <h3 className="text-xl font-bold text-slate-700">¡Estás al día!</h3>
          <p className="text-slate-500 mt-2">No hay tareas pendientes para planificar.</p>
        </div>
      )}
    </div>
  );
};
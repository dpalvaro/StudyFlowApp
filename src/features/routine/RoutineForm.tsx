import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Save, Moon, Sun, BookOpen, Info, Eraser, Tag, Plus, X, Edit3 } from 'lucide-react';
import type { RoutineConfig, TimeBlock } from '../../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const DEMO_USER_ID = "demo-student";
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Extendemos la interfaz para incluir las etiquetas personalizadas si no existen
interface ExtendedRoutineConfig extends RoutineConfig {
  customTags?: string[];
}

export const RoutineForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // --- ESTADOS DE CONFIGURACIÓN ---
  const [routine, setRoutine] = useState<ExtendedRoutineConfig>({
    sleepStart: "23:00",
    sleepEnd: "07:00",
    unavailableBlocks: [],
    customTags: ['Clases', 'Deporte', 'Trabajo', 'Estudio'] // Default tags
  });

  const [interval, setInterval] = useState<60 | 30>(60);
  
  // Etiqueta actual para "pintar"
  const [currentLabel, setCurrentLabel] = useState("Clases");
  
  // Estado para gestionar la edición de etiquetas
  const [isManagingTags, setIsManagingTags] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  // Estado visual del Grid
  const [gridData, setGridData] = useState<Record<string, string>>({});
  
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isPainting, setIsPainting] = useState(true);

  // 1. Cargar Rutina
  useEffect(() => {
    const fetchRoutine = async () => {
      const docRef = doc(db, 'users', DEMO_USER_ID, 'routine', 'weekly');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as ExtendedRoutineConfig;
        
        // Asegurar que customTags existe (para usuarios antiguos)
        if (!data.customTags) {
            data.customTags = ['Clases', 'Deporte', 'Trabajo', 'Estudio'];
        }
        
        setRoutine(data);
        
        // Detectar intervalo
        const needs30Min = data.unavailableBlocks.some(b => b.start.includes(':30') || b.end.includes(':30'));
        const loadedInterval = needs30Min ? 30 : 60;
        setInterval(loadedInterval);

        // Reconstruir grid
        const newGrid: Record<string, string> = {};
        data.unavailableBlocks.forEach(block => {
          const [startH, startM] = block.start.split(':').map(Number);
          const [endH, endM] = block.end.split(':').map(Number);
          
          let currentH = startH;
          let currentM = startM;
          
          while (currentH < endH || (currentH === endH && currentM < endM)) {
            newGrid[`${block.day}-${currentH}-${currentM}`] = block.label || "Ocupado";
            currentM += loadedInterval;
            if (currentM >= 60) {
              currentM = 0;
              currentH++;
            }
          }
        });
        setGridData(newGrid);
      }
      setLoading(false);
    };
    fetchRoutine();
  }, []);

  // --- Generar slots dinámicamente ---
  const timeSlots = useMemo(() => {
    const start = parseInt(routine.sleepEnd.split(':')[0]); 
    const end = parseInt(routine.sleepStart.split(':')[0]); 
    
    if (isNaN(start) || isNaN(end)) return [];

    const slots: { h: number, m: number }[] = [];
    let current = start;
    let safety = 0;

    while (current !== end && safety < 48) {
        slots.push({ h: current, m: 0 });
        if (interval === 30) {
            slots.push({ h: current, m: 30 });
        }
        current = (current + 1) % 24;
        safety++;
    }
    return slots;
  }, [routine.sleepStart, routine.sleepEnd, interval]);

  // Helper: Serializar Grid a Bloques
  const serializeGridToBlocks = (): TimeBlock[] => {
    const blocks: TimeBlock[] = [];
    
    for (let d = 0; d < 7; d++) {
      const dayKeys = Object.keys(gridData)
        .filter(k => k.startsWith(`${d}-`))
        .sort((a, b) => {
           const [, h1, m1] = a.split('-').map(Number);
           const [, h2, m2] = b.split('-').map(Number);
           return (h1 * 60 + m1) - (h2 * 60 + m2);
        });

      if (dayKeys.length === 0) continue;

      let currentBlockStartKey = dayKeys[0];
      let prevKey = dayKeys[0];
      let currentLabel = gridData[prevKey];

      for (let i = 1; i <= dayKeys.length; i++) {
        const key = dayKeys[i];
        const label = gridData[key];
        
        const [, prevH, prevM] = prevKey.split('-').map(Number);
        const nextExpectedM = prevM + interval;
        const expectedH = nextExpectedM >= 60 ? prevH + 1 : prevH;
        const expectedM = nextExpectedM >= 60 ? 0 : nextExpectedM;
        
        const isConsecutive = key === `${d}-${expectedH}-${expectedM}`;
        const isSameLabel = label === currentLabel;

        if (!key || !isConsecutive || !isSameLabel) {
          const [, startH, startM] = currentBlockStartKey.split('-').map(Number);
          const [, endH, endM] = prevKey.split('-').map(Number);
          let finalEndM = endM + interval;
          let finalEndH = endH;
          if (finalEndM >= 60) {
             finalEndH++;
             finalEndM = 0;
          }

          blocks.push({
            day: d,
            start: `${startH.toString().padStart(2,'0')}:${startM.toString().padStart(2,'0')}`,
            end: `${finalEndH.toString().padStart(2,'0')}:${finalEndM.toString().padStart(2,'0')}`,
            label: currentLabel
          });

          if (key) {
            currentBlockStartKey = key;
            currentLabel = label;
          }
        }
        prevKey = key;
      }
    }
    return blocks;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const optimizedBlocks = serializeGridToBlocks();
      const configToSave = { ...routine, unavailableBlocks: optimizedBlocks };
      
      await setDoc(doc(db, 'users', DEMO_USER_ID, 'routine', 'weekly'), configToSave);
      setRoutine(configToSave);
      alert('¡Rutina actualizada correctamente!');
    } catch (error) {
      console.error(error);
      alert('Error al guardar.');
    }
    setSaving(false);
  };

  // --- GESTIÓN DE ETIQUETAS ---
  const handleAddTag = () => {
    if (newTagInput.trim() && !routine.customTags?.includes(newTagInput.trim())) {
        const updatedTags = [...(routine.customTags || []), newTagInput.trim()];
        setRoutine(prev => ({ ...prev, customTags: updatedTags }));
        setCurrentLabel(newTagInput.trim());
        setNewTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
      if (window.confirm(`¿Eliminar la etiqueta "${tagToDelete}"?`)) {
          const updatedTags = routine.customTags?.filter(t => t !== tagToDelete) || [];
          setRoutine(prev => ({ ...prev, customTags: updatedTags }));
          if (currentLabel === tagToDelete) setCurrentLabel(updatedTags[0] || "");
      }
  };

  // --- INTERACCIÓN CON EL GRID ---
  const handleMouseDown = (day: number, hour: number, minute: number) => {
    setIsMouseDown(true);
    const key = `${day}-${hour}-${minute}`;
    const startPainting = !gridData[key]; 
    setIsPainting(startPainting);
    
    setGridData(prev => {
       const next = { ...prev };
       if (startPainting) next[key] = currentLabel;
       else delete next[key];
       return next;
    });
  };

  const handleMouseEnter = (day: number, hour: number, minute: number) => {
    if (isMouseDown) {
      const key = `${day}-${hour}-${minute}`;
      setGridData(prev => {
        const next = { ...prev };
        if (isPainting) next[key] = currentLabel;
        else delete next[key];
        return next;
      });
    }
  };

  const handleIntervalChange = (newInterval: 60 | 30) => {
     if (confirm("Cambiar el intervalo recalculará la vista. ¿Continuar?")) {
        setInterval(newInterval);
        setGridData({});
     }
  };

  useEffect(() => {
    const handleUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleUp);
    return () => window.removeEventListener('mouseup', handleUp);
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-24">
      
      <header className="flex flex-col md:flex-row justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="text-blue-600" /> Configuración de Rutina
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Define tus bloques ocupados. Usa el selector para etiquetar actividades.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
           
           {/* Selector de Intervalo */}
           <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button 
                onClick={() => interval !== 60 && handleIntervalChange(60)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${interval === 60 ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                1h
              </button>
              <button 
                onClick={() => interval !== 30 && handleIntervalChange(30)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${interval === 30 ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                30m
              </button>
           </div>

           <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

           {/* Selector de Etiqueta y Gestión */}
           <div className="flex flex-col items-end gap-2 w-full sm:w-auto relative">
              <div className="flex items-center gap-2 w-full">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    {/* Dropdown de etiquetas o input si estamos editando */}
                    <select 
                        value={currentLabel}
                        onChange={(e) => setCurrentLabel(e.target.value)}
                        className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-48 appearance-none cursor-pointer"
                    >
                        {routine.customTags?.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                    {/* Flecha custom para el select */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsManagingTags(!isManagingTags)}
                    className={`p-2 rounded-lg border transition-colors ${isManagingTags ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    title="Gestionar etiquetas"
                  >
                    <Edit3 size={16} />
                  </button>
              </div>

              {/* PANEL FLOTANTE DE GESTIÓN DE ETIQUETAS */}
              {isManagingTags && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-500 uppercase">Mis Etiquetas</span>
                          <button onClick={() => setIsManagingTags(false)}><X size={14} className="text-slate-400 hover:text-slate-600"/></button>
                      </div>
                      
                      <div className="space-y-1 max-h-40 overflow-y-auto mb-3 custom-scrollbar">
                          {routine.customTags?.map(tag => (
                              <div key={tag} className="flex items-center justify-between group hover:bg-slate-50 p-1.5 rounded-md transition-colors">
                                  <span className="text-sm text-slate-700 truncate flex-1">{tag}</span>
                                  <button 
                                    onClick={() => handleDeleteTag(tag)}
                                    className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                  >
                                      <Eraser size={12} />
                                  </button>
                              </div>
                          ))}
                      </div>

                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Nueva..."
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            className="flex-1 px-2 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:border-blue-500 outline-none"
                          />
                          <button 
                            onClick={handleAddTag}
                            disabled={!newTagInput.trim()}
                            className="bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                              <Plus size={16} />
                          </button>
                      </div>
                  </div>
              )}
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Sidebar Izquierdo */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide text-slate-500">
              <Moon size={16} /> Horario de Sueño
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Dormir</label>
                <input 
                  type="time" 
                  value={routine.sleepStart}
                  onChange={(e) => setRoutine({...routine, sleepStart: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Despertar</label>
                <input 
                  type="time" 
                  value={routine.sleepEnd}
                  onChange={(e) => setRoutine({...routine, sleepEnd: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-700 leading-relaxed">
             <Info size={14} className="inline mr-1 mb-0.5" />
             Mantén pulsado y arrastra sobre el horario para pintar bloques con la etiqueta <strong>"{currentLabel}"</strong>.
          </div>
          
          <button 
             onClick={() => setGridData({})}
             className="w-full py-2 flex items-center justify-center gap-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg text-sm font-medium transition-colors"
           >
             <Eraser size={14} /> Borrar Todo
           </button>
        </section>

        {/* Grid Principal */}
        <section className="lg:col-span-9 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          
          <div className="flex-1 overflow-x-auto pb-4 select-none">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-8 gap-1 mb-2 sticky top-0 z-10 bg-white">
                <div className="text-[10px] font-bold text-slate-300 uppercase text-center pt-2">Hora</div>
                {DAYS.map((day, i) => (
                  <div key={i} className="text-xs font-bold text-slate-600 uppercase text-center py-2 bg-slate-50 rounded-lg">
                    {day}
                  </div>
                ))}
              </div>

              <div className="space-y-1" onMouseLeave={() => setIsMouseDown(false)}>
                {timeSlots.map(({ h, m }) => (
                  <div key={`${h}-${m}`} className="grid grid-cols-8 gap-1 h-8">
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-end pr-2 relative top-[-6px]">
                      {m === 0 ? `${h}:00` : ''} 
                      {m === 30 && <span className="text-[8px] opacity-50 ml-1">:30</span>}
                    </div>
                    
                    {DAYS.map((_, dayIndex) => {
                      const key = `${dayIndex}-${h}-${m}`;
                      const label = gridData[key];
                      const isSelected = !!label;
                      
                      // Asignación dinámica de colores basada en la etiqueta (hash simple)
                      // Usamos el primer caracter para decidir el color para mantener consistencia visual
                      const charCode = label ? label.charCodeAt(0) : 0;
                      let colorClass = 'bg-slate-800 border-slate-900 text-white';
                      
                      if (label) {
                          if (['Clases', 'Estudio', 'Universidad'].includes(label)) colorClass = 'bg-indigo-500 border-indigo-600 text-white';
                          else if (['Deporte', 'Gimnasio', 'Entreno'].includes(label)) colorClass = 'bg-emerald-500 border-emerald-600 text-white';
                          else if (['Trabajo', 'Reunión'].includes(label)) colorClass = 'bg-amber-500 border-amber-600 text-white';
                          else if (['Ocio', 'Fiesta', 'Descanso'].includes(label)) colorClass = 'bg-rose-500 border-rose-600 text-white';
                          else {
                              // Fallback dinámico para etiquetas custom
                              const colors = [
                                  'bg-blue-500 border-blue-600', 
                                  'bg-purple-500 border-purple-600', 
                                  'bg-cyan-500 border-cyan-600',
                                  'bg-pink-500 border-pink-600'
                              ];
                              colorClass = `${colors[charCode % colors.length]} text-white`;
                          }
                      }

                      return (
                        <div
                          key={key}
                          onMouseDown={() => handleMouseDown(dayIndex, h, m)}
                          onMouseEnter={() => handleMouseEnter(dayIndex, h, m)}
                          className={`
                            rounded text-[8px] flex items-center justify-center font-medium truncate px-1 cursor-pointer transition-colors border
                            ${isSelected 
                              ? colorClass 
                              : 'bg-white border-slate-100 hover:border-blue-300 hover:bg-blue-50'
                            }
                          `}
                          title={isSelected ? `${label} (${h}:${m.toString().padStart(2,'0')})` : 'Libre'}
                        >
                          {isSelected && label}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-2xl shadow-slate-900/30 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 border-2 border-slate-700"
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar Rutina'}
        </button>
      </div>

    </div>
  );
};
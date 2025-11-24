import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Save, Moon, Sun, BookOpen } from 'lucide-react';
import type { RoutineConfig, TimeBlock } from '../../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const DEMO_USER_ID = "demo-student";
const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const RoutineForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado inicial
  const [routine, setRoutine] = useState<RoutineConfig>({
    sleepStart: "23:00",
    sleepEnd: "07:00",
    unavailableBlocks: []
  });

  // Estados para el formulario de nuevo bloque
  const [newBlockDay, setNewBlockDay] = useState(1);
  const [newBlockStart, setNewBlockStart] = useState("09:00");
  const [newBlockEnd, setNewBlockEnd] = useState("14:00");
  const [newBlockLabel, setNewBlockLabel] = useState("Clases Universidad");

  // 1. Cargar Rutina existente de Firestore
  useEffect(() => {
    const fetchRoutine = async () => {
      const docRef = doc(db, 'users', DEMO_USER_ID, 'routine', 'weekly');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setRoutine(docSnap.data() as RoutineConfig);
      }
      setLoading(false);
    };
    fetchRoutine();
  }, []);

  // 2. Guardar Rutina en Firestore
  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', DEMO_USER_ID, 'routine', 'weekly'), routine);
      alert('¡Rutina guardada correctamente! El algoritmo usará esto para planificar.');
    } catch (error) {
      console.error("Error guardando rutina:", error);
      alert('Error al guardar.');
    }
    setSaving(false);
  };

  const addBlock = () => {
    const newBlock: TimeBlock = {
      day: newBlockDay,
      start: newBlockStart,
      end: newBlockEnd,
      label: newBlockLabel
    };
    setRoutine(prev => ({
      ...prev,
      unavailableBlocks: [...prev.unavailableBlocks, newBlock]
    }));
  };

  const removeBlock = (index: number) => {
    setRoutine(prev => ({
      ...prev,
      unavailableBlocks: prev.unavailableBlocks.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando configuración...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Clock className="text-blue-600" /> Configuración de Rutina
        </h2>
        <p className="text-slate-500">Define tu horario base. El algoritmo respetará tus horas de sueño y clases.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* SECCIÓN 1: SUEÑO */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Moon size={20} className="text-indigo-500" /> Horario de Sueño
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Hora de dormir</label>
              <input 
                type="time" 
                value={routine.sleepStart}
                onChange={(e) => setRoutine({...routine, sleepStart: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Hora de despertar</label>
              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  value={routine.sleepEnd}
                  onChange={(e) => setRoutine({...routine, sleepEnd: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <Sun size={20} className="text-amber-500" />
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: BLOQUES OCUPADOS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-500" /> Bloques Ocupados (Clases)
          </h3>
          
          {/* Formulario añadir bloque */}
          <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-100 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Día</label>
              <select 
                value={newBlockDay}
                onChange={(e) => setNewBlockDay(parseInt(e.target.value))}
                className="w-full mt-1 px-2 py-1.5 rounded border border-slate-300 text-sm"
              >
                {DAYS.map((day, i) => <option key={i} value={i}>{day}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Inicio</label>
                <input type="time" value={newBlockStart} onChange={e => setNewBlockStart(e.target.value)} className="w-full mt-1 px-2 py-1.5 rounded border border-slate-300 text-sm"/>
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Fin</label>
                <input type="time" value={newBlockEnd} onChange={e => setNewBlockEnd(e.target.value)} className="w-full mt-1 px-2 py-1.5 rounded border border-slate-300 text-sm"/>
              </div>
            </div>
            <button 
              onClick={addBlock}
              className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 flex justify-center items-center gap-2 text-sm"
            >
              <Plus size={16} /> Añadir Clase/Bloque
            </button>
          </div>

          {/* Lista de bloques */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {routine.unavailableBlocks.length === 0 && <p className="text-center text-xs text-slate-400 italic py-2">No hay clases definidas.</p>}
            
            {routine.unavailableBlocks.map((block, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                <div>
                  <span className="font-bold text-slate-700">{DAYS[block.day]}</span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-600">{block.start} - {block.end}</span>
                </div>
                <button onClick={() => removeBlock(idx)} className="text-slate-400 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER ACCIONES */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar Rutina Semanal'}
        </button>
      </div>

    </div>
  );
};
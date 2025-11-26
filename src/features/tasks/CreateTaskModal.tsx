import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, GraduationCap, FileText, Gauge, Star, Calculator } from 'lucide-react';
import type { DifficultyLevel, ContentType } from '../../types';
import { calculateEstimatedDuration } from '../../lib/algorithm'; // Importamos el calculador

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
}

export const CreateTaskModal = ({ isOpen, onClose, onSubmit }: CreateTaskModalProps) => {
  // Datos Básicos
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Datos del Algoritmo
  const [contentType, setContentType] = useState<ContentType>('PAGES');
  const [contentAmount, setContentAmount] = useState(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [gradeImpact, setGradeImpact] = useState(20); // % de la nota
  const [personalImportance, setPersonalImportance] = useState(3); // 1-5 estrellas

  // Resultado Calculado
  const [calculatedTime, setCalculatedTime] = useState(0);

  // Recalcular tiempo cada vez que cambian los inputs
  useEffect(() => {
    const time = calculateEstimatedDuration(contentAmount, contentType, difficulty);
    setCalculatedTime(time);
  }, [contentAmount, contentType, difficulty]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      subject,
      status: 'TODO',
      dueDate,
      
      // Nuevos campos del algoritmo
      contentType,
      contentAmount,
      difficulty,
      gradeImpact,
      personalImportance,
      
      estimatedDuration: calculatedTime, // Guardamos el resultado
      calculatedPriorityScore: 0 // Se calculará al planificar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Calculator size={20} className="text-indigo-600" />
            Nueva Tarea Inteligente
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulario Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* 1. INFORMACIÓN BÁSICA */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. ¿Qué tienes que hacer?</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                    <input 
                    required
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Examen Tema 4"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Asignatura</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            required
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Ej: Historia"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        />
                    </div>
                </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* 2. ESTIMACIÓN DE TIEMPO (INPUTS DEL ALGORITMO) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                2. Carga de Trabajo <span className="text-indigo-500 text-[10px] bg-indigo-50 px-2 py-0.5 rounded-full">Impacta en Duración</span>
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4">
                {/* Tipo de Contenido */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select 
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value as ContentType)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
                        >
                            <option value="PAGES">Páginas / Apuntes</option>
                            <option value="EXERCISES">Ejercicios</option>
                            <option value="TOPICS">Temas Completos</option>
                            <option value="PROJECT_HOURS">Horas Proyecto</option>
                        </select>
                    </div>
                </div>

                {/* Cantidad */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
                    <input 
                        type="number" 
                        min="1"
                        value={contentAmount}
                        onChange={(e) => setContentAmount(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>

                {/* Dificultad */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dificultad</label>
                    <div className="relative">
                        <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select 
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
                        >
                            <option value="EASY">Fácil (Repaso)</option>
                            <option value="MEDIUM">Media</option>
                            <option value="HARD">Difícil (Nuevo)</option>
                            <option value="EXTREME">Extrema (Complejo)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* PREVISUALIZACIÓN DE TIEMPO */}
            <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 flex items-center justify-between">
                <span className="text-sm text-indigo-800">Tiempo Estimado por IA:</span>
                <span className="text-lg font-bold text-indigo-600">
                    {calculatedTime < 60 ? `${calculatedTime} min` : `${(calculatedTime / 60).toFixed(1)} horas`}
                </span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* 3. PRIORIDAD Y FECHAS (INPUTS DEL SCORE) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                3. Importancia <span className="text-emerald-500 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Impacta en Prioridad</span>
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Impacto en Nota */}
                <div>
                    <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                        <span>Impacto en Nota Final</span>
                        <span className="text-slate-500">{gradeImpact}%</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" max="100" step="5"
                        value={gradeImpact}
                        onChange={(e) => setGradeImpact(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Nada (0%)</span>
                        <span>Crucial (100%)</span>
                    </div>
                </div>

                {/* Importancia Personal */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Interés Personal</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setPersonalImportance(star)}
                                className={`p-1 rounded-md transition-all ${personalImportance >= star ? 'text-amber-400 scale-110' : 'text-slate-300'}`}
                            >
                                <Star size={24} fill={personalImportance >= star ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fecha Límite */}
            <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Límite / Examen</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        required
                        type="date" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>
            </div>
          </div>

        </form>

        {/* Footer Fijo */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <GraduationCap size={18} />
              Crear Planificación
            </button>
        </div>

      </div>
    </div>
  );
};
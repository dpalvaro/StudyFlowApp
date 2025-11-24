import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, s: TaskStatus) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export const KanbanBoard = ({ tasks, onStatusChange, onDelete, onAddClick }: KanbanBoardProps) => {
  const columns: { id: TaskStatus, label: string }[] = [
    { id: 'TODO', label: 'Por Hacer' },
    { id: 'IN_PROGRESS', label: 'En Progreso' },
    { id: 'DONE', label: 'Completado' }
  ];

  // Estados para gestionar los efectos visuales del Drag & Drop
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  // INICIO DEL ARRASTRE
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // CUANDO SE ARRASTRA SOBRE UNA COLUMNA
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault(); // Necesario para permitir el evento onDrop
    setDragOverCol(status);
  };

  // AL SOLTAR EN UNA COLUMNA
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (taskId && taskId !== '') {
      onStatusChange(taskId, status);
    }
    
    // Resetear estados visuales
    setDraggedTaskId(null);
    setDragOverCol(null);
  };

  // LIMPIEZA SI SE CANCELA EL ARRASTRE
  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverCol(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] overflow-x-auto">
      <div className="flex h-full gap-6 min-w-[900px] pb-4">
        {columns.map(col => (
          <div 
            key={col.id} 
            // Estilos dinámicos: Iluminar la columna si estamos arrastrando algo sobre ella
            className={`flex-1 flex flex-col rounded-xl border transition-all duration-200 ${
              dragOverCol === col.id 
                ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200 ring-opacity-50 scale-[1.01]' 
                : 'bg-slate-50/80 border-slate-200'
            }`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Header Columna */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <h3 className="font-semibold text-slate-700">{col.label}</h3>
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            {/* Body Columna */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div 
                  key={task.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  // Estilos dinámicos de la tarjeta al ser arrastrada
                  className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing group relative hover:shadow-md transition-all select-none ${
                    draggedTaskId === task.id ? 'opacity-40 rotate-2 scale-95 ring-2 ring-blue-400' : 'opacity-100'
                  }`}
                >
                  
                  <div className="flex justify-between items-start mb-2">
                    <Badge type="priority">{task.priority}</Badge>
                    
                    {/* Botón Borrar */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      title="Eliminar tarea"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-800 leading-tight mb-1">{task.title}</h4>
                  <p className="text-xs text-slate-500 mb-3">{task.subject}</p>
                  
                  {/* Indicador sutil para el usuario */}
                  {!draggedTaskId && (
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[9px] text-slate-300 uppercase font-bold tracking-wider">Arrastrar</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Botón Añadir */}
            <button 
              onClick={onAddClick}
              className="m-3 py-2 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg border border-dashed border-slate-300 transition-colors"
            >
              <Plus size={16} /> Añadir Tarea
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
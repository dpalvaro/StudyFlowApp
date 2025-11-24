import { Plus, Trash2, MoreVertical } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, s: TaskStatus) => void;
  onDelete: (id: string) => void; // Nueva prop para borrar
  onAddClick: () => void; // Nueva prop para abrir modal
}

export const KanbanBoard = ({ tasks, onStatusChange, onDelete, onAddClick }: KanbanBoardProps) => {
  const columns: { id: TaskStatus, label: string }[] = [
    { id: 'TODO', label: 'Por Hacer' },
    { id: 'IN_PROGRESS', label: 'En Progreso' },
    { id: 'DONE', label: 'Completado' }
  ];

  return (
    <div className="h-[calc(100vh-8rem)] overflow-x-auto">
      <div className="flex h-full gap-6 min-w-[900px] pb-4">
        {columns.map(col => (
          <div key={col.id} className="flex-1 flex flex-col bg-slate-50/80 rounded-xl border border-slate-200">
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
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing group relative hover:shadow-md transition-all">
                  
                  <div className="flex justify-between items-start mb-2">
                    <Badge type="priority">{task.priority}</Badge>
                    
                    {/* Botón Borrar (Solo visible al hacer hover) */}
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
                  
                  {/* Controles de Movimiento */}
                  <div className="flex justify-end pt-2 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                    {col.id !== 'TODO' && (
                      <button onClick={() => onStatusChange(task.id, 'TODO')} className="p-1.5 hover:bg-slate-100 rounded text-slate-500">←</button>
                    )}
                    {col.id !== 'DONE' && (
                      <button onClick={() => onStatusChange(task.id, 'DONE')} className="p-1.5 hover:bg-slate-100 rounded text-slate-500">→</button>
                    )}
                    {col.id === 'TODO' && (
                       <button onClick={() => onStatusChange(task.id, 'IN_PROGRESS')} className="p-1.5 hover:bg-slate-100 rounded text-slate-500">▶</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botón Añadir en cada columna */}
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
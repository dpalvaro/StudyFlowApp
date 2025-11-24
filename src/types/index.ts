export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  subject: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; 
  duration: number; // minutos estimados
  createdAt?: any;
}

export interface TimeBlock {
  day: number; // 0=Domingo, 1=Lunes...
  start: string; // "09:00"
  end: string; // "14:00"
  label: string; 
}

export interface RoutineConfig {
  sleepStart: string; 
  sleepEnd: string; 
  unavailableBlocks: TimeBlock[]; 
}

// --- NUEVO: Resultado del Algoritmo ---
export interface StudySession {
  id: string;
  taskId: string;
  taskTitle: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
}
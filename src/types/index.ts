export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// Ampliamos la escala de dificultad
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';

// Tipos de contenido para estimar tiempo
export type ContentType = 'PAGES' | 'EXERCISES' | 'TOPICS' | 'PROJECT_HOURS';

export interface Task {
  id: string;
  title: string;
  subject: string;
  status: TaskStatus;
  
  // --- NUEVOS CAMPOS PARA EL ALGORITMO v3.0 ---
  
  // 1. Factores de Tiempo
  contentType: ContentType;
  contentAmount: number; // Ej: 20 páginas, 5 ejercicios
  difficulty: DifficultyLevel; // Multiplicador de tiempo
  
  // 2. Factores de Prioridad
  dueDate: string; 
  gradeImpact: number; // Del 0 al 100 (Porcentaje de la nota final)
  personalImportance: number; // Del 1 al 5 (Estrellas)
  
  // 3. Resultados Calculados
  estimatedDuration: number; // Calculado automáticamente (minutos)
  calculatedPriorityScore: number; // Score interno para ordenar (0-1000)
  
  createdAt?: any;
}

export interface TimeBlock {
  day: number; 
  start: string; 
  end: string; 
  label: string; 
}

export interface RoutineConfig {
  sleepStart: string; 
  sleepEnd: string; 
  unavailableBlocks: TimeBlock[]; 
  customTags?: string[];
}

export interface StudySession {
  id: string;
  taskId: string;
  taskTitle: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
}
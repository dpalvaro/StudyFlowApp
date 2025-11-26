import type { Task, RoutineConfig, StudySession, DifficultyLevel, ContentType } from '../types';
import { addDays, setHours, setMinutes, differenceInMinutes, isAfter, isBefore, getDay, addMinutes, isValid, differenceInDays, startOfDay } from 'date-fns';

// --- CONSTANTES DE ESTIMACIÓN ---
const BASE_TIME_MINUTES: Record<ContentType, number> = {
  PAGES: 6,       
  EXERCISES: 15,  
  TOPICS: 45,     
  PROJECT_HOURS: 60 
};

const DIFFICULTY_MULTIPLIER: Record<DifficultyLevel, number> = {
  EASY: 0.8,    
  MEDIUM: 1.0,  
  HARD: 1.5,    
  EXTREME: 2.5  
};

// --- 1. CALCULADORA DE TIEMPO ---
export const calculateEstimatedDuration = (
  amount: number, 
  type: ContentType, 
  difficulty: DifficultyLevel
): number => {
  const baseTime = BASE_TIME_MINUTES[type] || BASE_TIME_MINUTES.PAGES; 
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty] || 1.0;
  const rawTime = (amount || 0) * baseTime * multiplier;
  return Math.round(rawTime * 1.1); 
};

// --- 2. CALCULADORA DE PRIORIDAD ---
export const calculateSmartScore = (task: Task): number => {
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  
  if (!isValid(dueDate)) return 0; 

  // Calculamos urgencia
  const daysUntilDue = Math.max(0.1, (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const urgencyScore = 100 / Math.pow(daysUntilDue, 1.2); // Ajustado exponente para no disparar score demasiado pronto

  const impactScore = (task.gradeImpact || 0) * 2; 
  const preferenceScore = (task.personalImportance || 1) * 10;

  const difficultyWeights = { EASY: 0, MEDIUM: 10, HARD: 30, EXTREME: 50 };
  const difficultyScore = difficultyWeights[task.difficulty || 'MEDIUM'] || 10;

  return urgencyScore + impactScore + difficultyScore + preferenceScore;
};

// --- HELPERS DE FECHA ROBUSTOS ---
const parseTimeOnDate = (timeStr: string | undefined, baseDate: Date): Date | null => {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return setMinutes(setHours(baseDate, hours), minutes);
};

const getAvailableSlots = (routine: RoutineConfig, daysToPlan: number) => {
  let slots: { start: Date; end: Date }[] = [];
  const now = new Date();

  // Valores por defecto seguros
  const sleepStart = routine?.sleepStart || "23:00";
  const sleepEnd = routine?.sleepEnd || "07:00";
  const unavailableBlocks = routine?.unavailableBlocks || [];

  for (let i = 0; i < daysToPlan; i++) {
    const currentDate = addDays(now, i);
    let dayStart = parseTimeOnDate(sleepEnd, currentDate); // Hora despertar
    let dayEnd = parseTimeOnDate(sleepStart, currentDate); // Hora dormir

    if (!dayStart || !dayEnd) continue;

    // CORRECCIÓN CRÍTICA: Manejo de horario nocturno (Ej: dormir a la 01:00 AM)
    // Si la hora de dormir es "menor" que la de despertar, significa que es el día siguiente.
    if (isBefore(dayEnd, dayStart)) {
        dayEnd = addDays(dayEnd, 1);
    }

    // Si es hoy y ya pasó la hora de inicio, empezamos desde "ahora"
    if (i === 0 && isAfter(now, dayStart)) {
      dayStart = addMinutes(now, 15); // 15 min buffer
    }

    // Si el tiempo disponible ya pasó (ej: son las 23:30 y te duermes a las 23:00), saltar día
    if (isAfter(dayStart, dayEnd)) continue;

    const currentDayOfWeek = getDay(currentDate);
    const todayBlocks = unavailableBlocks
      .filter(b => b.day === currentDayOfWeek)
      .map(b => ({
        start: parseTimeOnDate(b.start, currentDate),
        end: parseTimeOnDate(b.end, currentDate)
      }))
      .filter(b => b.start !== null && b.end !== null) as { start: Date; end: Date }[];
      
    // Ordenar bloques por hora
    todayBlocks.sort((a, b) => a.start.getTime() - b.start.getTime());

    let pointer = dayStart;

    for (const block of todayBlocks) {
      // Si el puntero está antes del bloque, hay hueco
      if (isBefore(pointer, block.start)) {
        // Solo huecos útiles > 30 min
        if (differenceInMinutes(block.start, pointer) >= 30) {
          slots.push({ start: pointer, end: block.start });
        }
      }
      // Mover puntero al final del bloqueo si es posterior
      if (isAfter(block.end, pointer)) {
        pointer = block.end;
      }
    }

    // Último hueco del día (desde el último bloqueo hasta dormir)
    if (isBefore(pointer, dayEnd) && differenceInMinutes(dayEnd, pointer) >= 30) {
      slots.push({ start: pointer, end: dayEnd });
    }
  }
  return slots;
};

// --- 3. GENERADOR DE PLAN ---
export const generateStudyPlan = (tasks: Task[], routine: RoutineConfig): StudySession[] => {
  if (!tasks || tasks.length === 0) return [];

  // 1. Preparar tareas
  let activeTasks = tasks
    .filter(t => t.status !== 'DONE')
    .map(t => ({ 
      ...t, 
      calculatedPriorityScore: calculateSmartScore(t),
      remainingDuration: t.estimatedDuration || 60,
      dueDateObj: new Date(t.dueDate) // Asegurar objeto Date
    }))
    .sort((a, b) => b.calculatedPriorityScore - a.calculatedPriorityScore);

  if (activeTasks.length === 0) return [];

  // 2. Horizonte Temporal Dinámico
  const today = new Date();
  let maxDueDate = addDays(today, 7); // Mínimo una semana

  activeTasks.forEach(t => {
    if (isValid(t.dueDateObj) && isAfter(t.dueDateObj, maxDueDate)) {
      maxDueDate = t.dueDateObj;
    }
  });

  // Calcular días necesarios (+ buffer de seguridad)
  let daysToPlan = differenceInDays(maxDueDate, today) + 5; 
  if (daysToPlan > 90) daysToPlan = 90; // Límite técnico de 3 meses
  if (daysToPlan < 1) daysToPlan = 1;

  // 3. Obtener huecos
  const slots = getAvailableSlots(routine, daysToPlan);
  const schedule: StudySession[] = [];

  // 4. Asignación
  for (const slot of slots) {
    if (activeTasks.length === 0) break;

    let slotDuration = differenceInMinutes(slot.end, slot.start);
    let currentSlotTime = slot.start;

    // Bucle de asignación en el slot
    for (let i = 0; i < activeTasks.length; i++) {
      const task = activeTasks[i];
      if (task.remainingDuration <= 0) continue;

      // REGLA: No programar después de la fecha límite
      // Usamos el final del día de entrega para ser flexibles
      const deadline = addDays(task.dueDateObj, 1); 
      deadline.setHours(23, 59, 59);
      
      if (isAfter(currentSlotTime, deadline)) continue;

      if (slotDuration >= 20) {
        const timeToAllocate = Math.min(task.remainingDuration, slotDuration);
        const sessionEnd = addMinutes(currentSlotTime, timeToAllocate);

        if (isValid(currentSlotTime) && isValid(sessionEnd)) {
            schedule.push({
              id: crypto.randomUUID(),
              taskId: task.id,
              taskTitle: task.title,
              subject: task.subject,
              startTime: new Date(currentSlotTime), // Copia nueva fecha
              endTime: new Date(sessionEnd),
              durationMinutes: timeToAllocate
            });
        }

        task.remainingDuration -= timeToAllocate;
        slotDuration -= timeToAllocate;
        currentSlotTime = addMinutes(currentSlotTime, timeToAllocate);

        if (slotDuration > 5) {
            slotDuration -= 5; 
            currentSlotTime = addMinutes(currentSlotTime, 5);
        }
      }
    }
    // Limpiar tareas acabadas
    activeTasks = activeTasks.filter(t => t.remainingDuration > 0);
  }

  return schedule;
};
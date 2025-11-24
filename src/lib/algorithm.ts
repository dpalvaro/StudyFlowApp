import type { Task, RoutineConfig, StudySession, TimeBlock } from '../types';
import { addDays, setHours, setMinutes, format, parse, differenceInMinutes, isAfter, isBefore, getDay, addMinutes } from 'date-fns';

// --- HELPER: Parsear horas "HH:mm" a Date hoy/mañana ---
const parseTimeOnDate = (timeStr: string, baseDate: Date): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return setMinutes(setHours(baseDate, hours), minutes);
};

// --- PASO 1: Calcular Urgencia (WEDF) ---
const calculateUrgency = (task: Task): number => {
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  
  // Días hasta la entrega (mínimo 0.1 para evitar división por cero)
  const daysUntilDue = Math.max(0.1, (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const priorityWeight = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
  
  // FÓRMULA WEDF: (Peso Prioridad * 2) + (10 / Días Restantes)
  // Tareas urgentes disparan su score. Tareas importantes tienen base alta.
  return (priorityWeight[task.priority] * 2) + (10 / daysUntilDue);
};

// --- PASO 2: Generar Huecos Libres (Availability Map) ---
const getAvailableSlots = (routine: RoutineConfig, daysToPlan: number = 3) => {
  let slots: { start: Date; end: Date }[] = [];
  const now = new Date();

  for (let i = 0; i < daysToPlan; i++) {
    const currentDate = addDays(now, i);
    
    // 1. Definir ventana despierto del día (Ej: 07:00 a 23:00)
    let dayStart = parseTimeOnDate(routine.sleepEnd, currentDate);
    let dayEnd = parseTimeOnDate(routine.sleepStart, currentDate);

    // Si es hoy y ya son las 10:00, el inicio es ahora (no planificar en el pasado)
    if (i === 0 && isAfter(now, dayStart)) {
      dayStart = addMinutes(now, 15); // Empezar 15 min en el futuro
    }

    if (isAfter(dayStart, dayEnd)) continue; // Ya pasó el día

    // 2. Obtener bloqueos (Clases) para este día de la semana
    const currentDayOfWeek = getDay(currentDate); // 0=Domingo
    const todayBlocks = routine.unavailableBlocks
      .filter(b => b.day === currentDayOfWeek)
      .map(b => ({
        start: parseTimeOnDate(b.start, currentDate),
        end: parseTimeOnDate(b.end, currentDate)
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    // 3. Restar bloqueos a la ventana principal (Algoritmo de sustracción de intervalos)
    let pointer = dayStart;

    for (const block of todayBlocks) {
      // Si hay hueco entre el puntero y el inicio del bloqueo, es tiempo libre
      if (isBefore(pointer, block.start)) {
        if (differenceInMinutes(block.start, pointer) >= 30) { // Mínimo 30 min para estudiar
          slots.push({ start: pointer, end: block.start });
        }
      }
      // Mover el puntero al final del bloqueo si es posterior
      if (isAfter(block.end, pointer)) {
        pointer = block.end;
      }
    }

    // Añadir el último hueco del día (después de la última clase hasta dormir)
    if (isBefore(pointer, dayEnd) && differenceInMinutes(dayEnd, pointer) >= 30) {
      slots.push({ start: pointer, end: dayEnd });
    }
  }
  
  return slots;
};

// --- FUNCIÓN PRINCIPAL: Generar Plan ---
export const generateStudyPlan = (tasks: Task[], routine: RoutineConfig): StudySession[] => {
  
  // 1. Preparar Tareas: Filtrar pendientes y calcular prioridad
  let pendingTasks = tasks
    .filter(t => t.status !== 'DONE')
    .map(t => ({ ...t, urgency: calculateUrgency(t), remainingDuration: t.duration }))
    .sort((a, b) => b.urgency - a.urgency); // Ordenar por mayor urgencia

  // 2. Obtener Huecos Libres
  const slots = getAvailableSlots(routine);
  const schedule: StudySession[] = [];

  // 3. Asignación Voraz (Greedy) con Fragmentación
  for (const slot of slots) {
    if (pendingTasks.length === 0) break; // Ya no hay tareas

    let slotDuration = differenceInMinutes(slot.end, slot.start);
    let currentSlotTime = slot.start;

    // Intentar llenar el hueco con tareas
    for (let i = 0; i < pendingTasks.length; i++) {
      const task = pendingTasks[i];
      if (task.remainingDuration <= 0) continue;

      if (slotDuration >= 15) { // Solo asignar si quedan al menos 15 mins
        // Determinar cuánto tiempo dedicar (lo que quede de tarea o lo que quepa en el hueco)
        const timeToAllocate = Math.min(task.remainingDuration, slotDuration);
        
        // Crear sesión
        schedule.push({
          id: Math.random().toString(36).substr(2, 9),
          taskId: task.id,
          taskTitle: task.title,
          subject: task.subject,
          startTime: currentSlotTime,
          endTime: addMinutes(currentSlotTime, timeToAllocate),
          durationMinutes: timeToAllocate
        });

        // Actualizar contadores
        task.remainingDuration -= timeToAllocate;
        slotDuration -= timeToAllocate;
        currentSlotTime = addMinutes(currentSlotTime, timeToAllocate);

        // Si terminamos la tarea, la quitamos virtualmente (remainingDuration ya es 0)
        if (task.remainingDuration <= 0) {
            // Task completada en planificación
        }
        
        // Añadir pequeño descanso si cambiamos de tarea (context switching simulado)
        if (slotDuration > 0) {
            slotDuration -= 5; 
            currentSlotTime = addMinutes(currentSlotTime, 5);
        }
      }
    }
  }

  return schedule;
};
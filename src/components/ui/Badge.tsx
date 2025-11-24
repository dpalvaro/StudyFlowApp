import React from 'react';
import type { TaskStatus, TaskPriority } from '../../types';

interface BadgeProps {
  type: 'priority' | 'status' | 'subject';
  children: React.ReactNode;
}

export const Badge = ({ type, children }: BadgeProps) => {
  const styles = {
    priority: {
      HIGH: "bg-rose-50 text-rose-600 ring-rose-500/20",
      MEDIUM: "bg-amber-50 text-amber-600 ring-amber-500/20",
      LOW: "bg-emerald-50 text-emerald-600 ring-emerald-500/20"
    },
    status: {
      TODO: "bg-slate-100 text-slate-600",
      IN_PROGRESS: "bg-blue-50 text-blue-600",
      DONE: "bg-emerald-50 text-emerald-600"
    },
    subject: {
      DEFAULT: "bg-indigo-50 text-indigo-600"
    }
  };

  let className = "px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ";
  
  // Casteamos children a string para usarlo como clave si es necesario
  const key = children as string;
  
  if (type === 'priority') className += styles.priority[key as TaskPriority] || styles.priority.LOW;
  else if (type === 'status') className += styles.status[key as TaskStatus] || styles.status.TODO;
  else className += styles.subject.DEFAULT;

  return <span className={className}>{children}</span>;
};
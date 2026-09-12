import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'admin' | 'student' | 'faculty' | 'staff';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-teal-600 text-white shadow-2xs',
    secondary: 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    outline: 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
    admin: 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold',
    student: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold',
    faculty: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold',
    staff: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

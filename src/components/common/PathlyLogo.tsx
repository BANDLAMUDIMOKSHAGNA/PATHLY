import React from 'react';
import { MapPin } from 'lucide-react';

interface PathlyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PathlyLogo: React.FC<PathlyLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }[size];

  const pinSize = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const textColor = {
    dark: 'text-slate-900 dark:text-white',
    light: 'text-slate-800 dark:text-slate-100',
    white: 'text-white',
  }[variant];

  const taglineColor = {
    dark: 'text-slate-500 dark:text-slate-400',
    light: 'text-slate-400 dark:text-slate-400',
    white: 'text-teal-200/80',
  }[variant];

  return (
    <div
      id="pathly-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2 cursor-pointer select-none transition-transform active:scale-95 ${className}`}
    >
      {/* Green Map Pin Icon as seen in the design */}
      <div className={`${iconDimensions} rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs shrink-0`}>
        <MapPin className={`${pinSize} fill-white/20`} />
      </div>

      <div className="flex flex-col leading-tight">
        <span className={`font-bold tracking-tight ${textSize} ${textColor}`}>
          Pathly
        </span>
        {showTagline && (
          <span className={`text-[10px] font-medium tracking-wide ${taglineColor}`}>
            Navigate. Explore. Discover.
          </span>
        )}
      </div>
    </div>
  );
};


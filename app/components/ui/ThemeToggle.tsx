'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md',
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative overflow-hidden rounded-full
        bg-white/10 dark:bg-gray-800/20
        backdrop-blur-md border border-white/20 dark:border-gray-700/30
        hover:bg-white/20 dark:hover:bg-gray-700/30
        hover:scale-105 active:scale-95
        transition-all duration-300 ease-in-out
        group shadow-lg hover:shadow-xl
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon */}
        <Sun 
          size={iconSizes[size]}
          className={`
            absolute transition-all duration-500 ease-in-out
            ${theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100 text-yellow-500' 
              : 'rotate-90 scale-0 opacity-0'
            }
          `}
        />
        
        {/* Moon Icon */}
        <Moon 
          size={iconSizes[size]}
          className={`
            absolute transition-all duration-500 ease-in-out
            ${theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100 text-blue-400' 
              : '-rotate-90 scale-0 opacity-0'
            }
          `}
        />
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {showLabel && (
        <span className="sr-only">
          {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;

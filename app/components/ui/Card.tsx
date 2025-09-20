'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false,
  gradient = false,
  style
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300 border';
  
  const variantClasses = glass
    ? 'bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border-white/20 dark:border-gray-700/20 shadow-xl'
    : gradient
    ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-lg'
    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg';
  
  const hoverClasses = hover
    ? 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
    : 'hover:shadow-lg';
  
  const classes = `${baseClasses} ${variantClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = ''
}) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = ''
}) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = ''
}) => (
  <div className={`p-6 pt-4 ${className}`}>
    {children}
  </div>
);

export default Card;

'use client';

import React from 'react';
import Card from './Card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradient = 'from-blue-500 to-purple-600',
  delay = 0
}) => {
  return (
    <Card 
      hover 
      className="p-8 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
          <div className="text-white text-2xl">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default FeatureCard;

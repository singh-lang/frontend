import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  className = ''
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl border transition-all duration-300';

  const variantClasses = {
    default: 'border-soft-grey/20 shadow-md',
    elevated: 'border-soft-grey/20 shadow-xl',
    outlined: 'border-soft-grey/40 shadow-sm'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-0.5' : '';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

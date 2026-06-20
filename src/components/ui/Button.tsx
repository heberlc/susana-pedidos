import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

  const variants = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700 shadow-md',
    secondary: 'bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
  };

  const sizes = {
    sm: 'px-4 py-3 text-base min-h-12',
    md: 'px-5 py-3.5 text-lg min-h-14',
    lg: 'px-6 py-4 text-xl min-h-16',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

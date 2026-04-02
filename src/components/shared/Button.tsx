import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  onClick,
  loading = false,
  variant = 'primary',
  className = '',
  size = 'md',
}: ButtonProps) {
  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-base',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200',
    secondary: 'bg-white text-gray-700 border border-gray-200',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      className={`w-full rounded-xl font-medium transition-all disabled:opacity-50
                  ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          加载中
        </span>
      ) : children}
    </motion.button>
  );
}


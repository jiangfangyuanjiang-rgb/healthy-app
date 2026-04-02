import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm
                  ${onClick ? 'active:shadow-md' : ''}
                  transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}


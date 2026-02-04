import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-[var(--accent)] text-white shadow-lg hover:shadow-orange-500/20',
  secondary: 'bg-[var(--primary)] text-white shadow-md',
  outline: 'border-2 border-[var(--primary)] text-[var(--primary)] bg-transparent',
  ghost: 'bg-transparent text-[var(--text)] hover:bg-gray-100',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg font-bold',
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  // Combine classes manually or use a utility if available. 
  // keeping it simple with template literals for now.
  const baseClass = `inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      className={baseClass}
      whileHover={{ scale: 1.02, brightness: 1.1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
};

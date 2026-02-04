import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-[var(--text-muted)] ml-1">
                    {label} {props.required && <span className="text-[var(--accent)]">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    className={`w-full px-4 py-3 rounded-[var(--radius-sm)] border bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${error
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)] focus:ring-opacity-20'
                        } ${className}`}
                    {...props}
                />
            </div>
            <AnimatePresence>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-500 ml-1"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
});

Input.displayName = "Input";

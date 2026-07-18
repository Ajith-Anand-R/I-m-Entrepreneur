import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked, onChange, label, description, disabled = false,
}) => (
  <label className={`flex items-start gap-3 select-none ${disabled ? 'opacity-40' : 'cursor-pointer'}`}>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex shrink-0 h-6 w-11 rounded-full transition-colors duration-250 ease-in-out mt-0.5
        ${checked ? 'bg-accent' : 'bg-ink-100'}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30
      `}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`
          inline-block w-5 h-5 rounded-full bg-white shadow-sm
          ${checked ? 'translate-x-[22px]' : 'translate-x-[2px]'}
          mt-[2px]
        `}
      />
    </button>
    {(label || description) && (
      <div className="flex-1 min-w-0">
        {label && (
          <span className="text-[13px] font-semibold text-ink-900 block leading-snug">{label}</span>
        )}
        {description && (
          <span className="text-[11px] text-ink-300 block mt-0.5 leading-relaxed">{description}</span>
        )}
      </div>
    )}
  </label>
);

export default Toggle;

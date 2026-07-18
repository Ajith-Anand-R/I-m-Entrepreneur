import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title, subtitle, icon, action, className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className={`flex items-start justify-between gap-4 pb-6 mb-6 border-b border-accent/[0.08] ${className}`}
  >
    <div className="flex items-center gap-3 min-w-0">
      {icon && (
        <div className="w-10 h-10 rounded-2xl bg-accent-ghost flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl font-bold text-ink-900 font-heading truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-ink-300 mt-1 font-medium truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </motion.div>
);

export default PageHeader;

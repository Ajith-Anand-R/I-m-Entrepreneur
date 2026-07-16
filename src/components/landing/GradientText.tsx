import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  from = '#6C47FF',
  via,
  to = '#F40076',
  animate = false,
  className = '',
  as: Tag = 'span',
}) => {
  const gradientStyle: React.CSSProperties = {
    background: via
      ? `linear-gradient(135deg, ${from}, ${via}, ${to})`
      : `linear-gradient(135deg, ${from}, ${to})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    ...(animate && {
      backgroundSize: '200% 200%',
      animation: 'gradient-shift 3s ease infinite',
    }),
  };

  return (
    <Tag className={className} style={gradientStyle}>
      {children}
    </Tag>
  );
};

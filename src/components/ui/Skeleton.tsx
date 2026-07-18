import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const roundedMap = {
  sm:   'rounded-lg',
  md:   'rounded-xl',
  lg:   'rounded-2xl',
  xl:   'rounded-3xl',
  full: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '', width, height = 16, rounded = 'md',
}) => (
  <div
    className={`skeleton ${roundedMap[rounded]} ${className}`}
    style={{ width, height }}
  />
);

/* Pre-built skeleton patterns */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card-pro p-5 space-y-3 ${className}`}>
    <Skeleton width="40%" height={12} />
    <Skeleton width="100%" height={10} />
    <Skeleton width="75%" height={10} />
    <div className="flex gap-2 pt-2">
      <Skeleton width={60} height={28} rounded="lg" />
      <Skeleton width={60} height={28} rounded="lg" />
    </div>
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton width={size} height={size} rounded="full" />
);

export default Skeleton;

import React from 'react';

export type VerdictType = 'Pass' | 'Partial' | 'Fail';

interface VerdictStampProps {
  verdict: VerdictType | string;
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
  className?: string;
  animate?: boolean;
}

export const VerdictStamp: React.FC<VerdictStampProps> = ({
  verdict,
  size = 'md',
  rotation = -4,
  className = '',
  animate = true,
}) => {
  const norm = verdict.toLowerCase();

  let text = 'FAIL';
  let colorClass = 'border-stamp-red text-stamp-red';
  let icon = (
    <svg className="w-4 h-4 inline-block stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  if (norm === 'pass') {
    text = 'PASS';
    colorClass = 'border-ink text-ink';
    icon = (
      <svg className="w-4 h-4 inline-block stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
      </svg>
    );
  } else if (norm === 'partial') {
    text = 'PARTIAL';
    colorClass = 'border-pen-blue text-pen-blue';
    icon = (
      <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3 A 9 9 0 0 1 12 21 Z" fill="currentColor" />
      </svg>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 border-[1.5px] gap-1',
    md: 'text-sm px-3 py-1 border-2 gap-1.5',
    lg: 'text-base px-4 py-1.5 border-[2.5px] gap-2 tracking-wider font-extrabold',
  }[size];

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg)`,
        ['--stamp-rot' as any]: `${rotation}deg`,
      }}
      className={`inline-flex items-center uppercase font-mono font-bold select-none tracking-widest ${sizeClasses} ${colorClass} ${
        animate ? 'stamp-animate' : ''
      } ${className}`}
      role="status"
      aria-label={`Verdict: ${text}`}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
};

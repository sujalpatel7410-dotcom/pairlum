import React from 'react';

interface PaperCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hasTape?: boolean;
  hasPin?: boolean;
  hasGlow?: boolean;
  elevated?: boolean;
  className?: string;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  children,
  hasTape = false,
  hasPin = false,
  hasGlow = false,
  elevated = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        relative rounded-[20px] bg-[#FFB8CB] border border-[#F4A9BF] 
        ${elevated ? 'warm-shadow-lg' : 'warm-shadow'}
        ${hasGlow ? 'candle-glow border-[#FFC145]/40' : ''}
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {/* Tape decoration */}
      {hasTape && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#EEDECA]/80 border-x border-dashed border-[#C8B4A0]/60 rotate-[-1.5deg] shadow-xs pointer-events-none z-10" />
      )}

      {/* Pushpin decoration */}
      {hasPin && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-[#E11D48] to-[#F59E0B] shadow-sm flex items-center justify-center pointer-events-none z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      )}

      {children}
    </div>
  );
};

interface HandNoteProps {
  text: string;
  author?: string;
  date?: string;
  hasWaxSeal?: boolean;
  rotation?: number; // deg
  className?: string;
  onClick?: () => void;
}

export const HandNote: React.FC<HandNoteProps> = ({
  text,
  author,
  date,
  hasWaxSeal = false,
  rotation = 0,
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`
        relative rounded-2xl bg-[#FFD3DE] border border-[#F4A9BF] p-5 warm-shadow
        transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer
        ${className}
      `}
    >
      {/* Tape on corner */}
      <div className="absolute -top-2.5 left-4 w-12 h-4 bg-[#EEDECA]/75 border-x border-dashed border-[#C8B4A0]/60 rotate-[-3deg] pointer-events-none" />

      <p className="font-script text-xl text-[#4A0420] leading-relaxed pt-1">
        "{text}"
      </p>

      <div className="mt-4 pt-2 border-t border-[#F4A9BF]/50 flex items-center justify-between text-xs text-[#8A4058]">
        <span className="font-script text-base text-[#E11D48]">
          {author ? `with love, ${author}` : 'always yours ♡'}
        </span>
        {date && <span className="font-sans text-[11px] text-[#8A4058]/80">{date}</span>}
      </div>

      {hasWaxSeal && (
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#E11D48] shadow-sm flex items-center justify-center text-white text-xs font-bold font-serif border border-[#E11D48]">
          ♡
        </div>
      )}
    </div>
  );
};

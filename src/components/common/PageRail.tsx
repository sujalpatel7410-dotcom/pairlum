import React from 'react';
import { Heart } from 'lucide-react';

interface PageRailProps {
  step?: string; // e.g. "01 / 05"
  categoryLabel?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  quote?: string;
  quoteAuthor?: string;
  illustrationSrc?: string;
  illustrationCaption?: string;
  className?: string;
}

export const PageRail: React.FC<PageRailProps> = ({
  step,
  categoryLabel,
  title,
  subtitle,
  children,
  quote,
  quoteAuthor,
  illustrationSrc,
  illustrationCaption,
  className = ''
}) => {
  return (
    <aside className={`w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-6 ${className}`}>
      {/* Top Header info */}
      <div>
        {step && (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E11D48]/10 text-[#E11D48] text-xs font-semibold tracking-wider mb-3">
            <span>{step}</span>
          </div>
        )}
        {categoryLabel && (
          <div className="text-[11px] uppercase tracking-widest text-[#E11D48] font-semibold mb-1 flex items-center gap-1.5">
            <span>{categoryLabel}</span>
            <Heart className="w-3 h-3 fill-[#E11D48]/20 text-[#E11D48]" />
          </div>
        )}
        
        <h1 className="font-display text-3xl xl:text-4xl text-[#4A0420] font-medium leading-tight flex items-center gap-2">
          <span>{title}</span>
          <Heart className="w-5 h-5 text-[#E11D48] fill-none stroke-[1.75]" />
        </h1>

        {subtitle && (
          <p className="text-sm text-[#8A4058] leading-relaxed mt-2.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Navigation or filters content */}
      {children && (
        <div className="flex flex-col gap-1.5 py-2">
          {children}
        </div>
      )}

      {/* Optional decorative illustration or pull-quote */}
      {(illustrationSrc || quote) && (
        <div className="mt-auto pt-4 border-t border-[#F4A9BF]/60">
          {illustrationSrc && (
            <div className="relative rounded-2xl overflow-hidden mb-3 border border-[#F4A9BF] bg-[#FFB8CB] p-1.5 warm-shadow">
              <img 
                src={illustrationSrc} 
                alt="Decorative vignette" 
                className="w-full h-32 object-cover rounded-xl"
              />
              {illustrationCaption && (
                <p className="font-script text-base text-[#8A4058] text-center mt-2 pb-1">
                  {illustrationCaption}
                </p>
              )}
            </div>
          )}

          {quote && (
            <div className="p-4 rounded-2xl bg-[#FFB8CB]/80 border border-[#F4A9BF] relative">
              <span className="text-2xl text-[#E11D48]/40 font-display absolute top-2 left-3">“</span>
              <p className="font-script text-lg text-[#4A0420] pl-3 italic leading-snug">
                {quote}
              </p>
              {quoteAuthor && (
                <p className="text-xs text-[#E11D48] text-right mt-1 font-medium">
                  — {quoteAuthor}
                </p>
              )}
              <div className="flex justify-center mt-2">
                <span className="text-[#E11D48] text-sm">♡</span>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

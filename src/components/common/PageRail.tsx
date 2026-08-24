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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] text-xs font-semibold tracking-wider mb-3">
            <span>{step}</span>
          </div>
        )}
        {categoryLabel && (
          <div className="text-[11px] uppercase tracking-widest text-[#8E1B1B] font-semibold mb-1 flex items-center gap-1.5">
            <span>{categoryLabel}</span>
            <Heart className="w-3 h-3 fill-[#8E1B1B]/20 text-[#8E1B1B]" />
          </div>
        )}
        
        <h1 className="font-display text-3xl xl:text-4xl text-[#1C110E] font-medium leading-tight flex items-center gap-2">
          <span>{title}</span>
          <Heart className="w-5 h-5 text-[#8E1B1B] fill-none stroke-[1.75]" />
        </h1>

        {subtitle && (
          <p className="text-sm text-[#6E5B52] leading-relaxed mt-2.5">
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
        <div className="mt-auto pt-4 border-t border-[#E7D9C9]/60">
          {illustrationSrc && (
            <div className="relative rounded-2xl overflow-hidden mb-3 border border-[#E7D9C9] bg-[#F7EFE4] p-1.5 warm-shadow">
              <img 
                src={illustrationSrc} 
                alt="Decorative vignette" 
                className="w-full h-32 object-cover rounded-xl"
              />
              {illustrationCaption && (
                <p className="font-script text-base text-[#6E5B52] text-center mt-2 pb-1">
                  {illustrationCaption}
                </p>
              )}
            </div>
          )}

          {quote && (
            <div className="p-4 rounded-2xl bg-[#F7EFE4]/80 border border-[#E7D9C9] relative">
              <span className="text-2xl text-[#8E1B1B]/40 font-display absolute top-2 left-3">“</span>
              <p className="font-script text-lg text-[#1C110E] pl-3 italic leading-snug">
                {quote}
              </p>
              {quoteAuthor && (
                <p className="text-xs text-[#8E1B1B] text-right mt-1 font-medium">
                  — {quoteAuthor}
                </p>
              )}
              <div className="flex justify-center mt-2">
                <span className="text-[#8E1B1B] text-sm">♡</span>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

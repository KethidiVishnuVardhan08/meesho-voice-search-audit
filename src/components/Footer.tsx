import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t-2 border-ink bg-paper-dark py-8 px-4 sm:px-6 font-mono text-xs text-ink-muted text-center">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="bg-ink text-paper font-bold px-2 py-0.5 uppercase tracking-wider text-[11px]">
            CASE FILE 002
          </span>
          <span className="text-ink font-bold uppercase tracking-tight">
            EVIDENCE CONCLUDED
          </span>
        </div>

        <p className="font-serif text-sm text-ink max-w-2xl mx-auto leading-relaxed">
          Independent student audit by Shambhavi Kumari. Not affiliated with or endorsed by Meesho. Black-box testing, mock data, dated November 2026.
        </p>

        <div className="text-[11px] text-ink-muted/80 border-t border-ink/20 pt-3 max-w-xl mx-auto">
          Built with React, Vite, TypeScript & Tailwind CSS. Designed as an investigative evidence dossier. No commercial trademarks or corporate branding reproduced.
        </div>
      </div>
    </footer>
  );
};

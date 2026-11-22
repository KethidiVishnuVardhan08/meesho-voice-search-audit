import React from 'react';

export const StickyHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-xs border-b border-ink px-4 py-2 flex items-center justify-between text-xs font-mono">
      <div className="flex items-center gap-3">
        <span className="bg-ink text-paper font-bold px-2 py-0.5 tracking-wider uppercase text-xs">
          CASE 002
        </span>
        <span className="hidden sm:inline font-bold uppercase tracking-tight text-ink">
          MEESHO VOICE SEARCH AUDIT
        </span>
      </div>

      <nav aria-label="Evidence File Sections" className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-0.5">
        <a href="#brief" className="hover:underline text-ink uppercase tracking-tight whitespace-nowrap">
          Brief
        </a>
        <a href="#scoreboard" className="hover:underline text-ink uppercase tracking-tight whitespace-nowrap">
          Scores
        </a>
        <a href="#exhibits" className="hover:underline text-ink uppercase tracking-tight whitespace-nowrap">
          Exhibits
        </a>
        <a href="#failures" className="hover:underline text-ink uppercase tracking-tight whitespace-nowrap">
          Failures
        </a>
        <a href="#rerun" className="bg-pen-blue text-paper px-2 py-0.5 font-bold uppercase tracking-tight whitespace-nowrap hover:bg-opacity-90">
          Re-Run Demo
        </a>
        <a href="#evals" className="hover:underline text-ink uppercase tracking-tight whitespace-nowrap hidden md:inline">
          Evals
        </a>
        <a href="#remedy" className="hover:underline text-ink uppercase tracking-tight whitespace-nowrap hidden lg:inline">
          Remedy
        </a>
        <a href="#method" className="hover:underline text-ink uppercase tracking-tight whitespace-nowrap hidden sm:inline">
          Method
        </a>
      </nav>
    </header>
  );
};

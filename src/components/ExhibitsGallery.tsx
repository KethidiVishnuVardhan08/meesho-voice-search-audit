import React, { useState, useEffect } from 'react';
import { ScoreItem } from '../engine/types';
import { VerdictStamp } from './VerdictStamp';

interface ExhibitsGalleryProps {
  scores: ScoreItem[];
}

export const ExhibitsGallery: React.FC<ExhibitsGalleryProps> = ({ scores }) => {
  const [verdictFilter, setVerdictFilter] = useState<string>('All');
  const [failureFilter, setFailureFilter] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<ScoreItem | null>(null);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  // Close lightbox on Escape key and navigate with Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeItem) return;

      if (e.key === 'Escape') {
        setActiveItem(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = scores.findIndex((s) => s.id === activeItem.id);
        if (currentIndex < scores.length - 1) {
          setActiveItem(scores[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = scores.findIndex((s) => s.id === activeItem.id);
        if (currentIndex > 0) {
          setActiveItem(scores[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItem, scores]);

  const filteredScores = scores.filter((item) => {
    const matchesVerdict = verdictFilter === 'All' || item.verdict.toLowerCase() === verdictFilter.toLowerCase();
    const matchesFailure = failureFilter === 'All' || item.failure_category === failureFilter;
    return matchesVerdict && matchesFailure;
  });

  // Alternating deterministic rotations for evidence cards (+/- 1.2 deg)
  const getRotation = (index: number) => {
    const rot = (index % 4 === 0) ? -1.2 : (index % 4 === 1) ? 1.0 : (index % 4 === 2) ? -0.8 : 1.3;
    return rot;
  };

  return (
    <section id="exhibits" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="border-b-2 border-ink pb-3 mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-ink-muted tracking-widest">
            SECTION 03 // EVIDENCE VAULT
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink tracking-tight">
            Exhibits & Real Screenshots
          </h2>
        </div>
        <aside aria-label="Auditor margin note" className="font-hand text-pen-blue text-xl font-bold -rotate-1">
          Click any card to inspect
        </aside>
      </div>

      {/* Filter Controls */}
      <div className="bg-paper-light border border-ink p-4 mb-8 shadow-ink-3 space-y-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold uppercase text-ink mr-2">Filter by Verdict:</span>
          {['All', 'Pass', 'Partial', 'Fail'].map((v) => (
            <button
              key={v}
              onClick={() => setVerdictFilter(v)}
              className={`px-3 py-1 font-bold uppercase transition-colors border ${
                verdictFilter === v
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-paper text-ink border-ink/40 hover:border-ink'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-ink/30">
          <span className="font-bold uppercase text-ink mr-2">Failure Tag:</span>
          {['All', 'F1', 'F2', 'F3', 'F4', 'F5', 'none'].map((f) => (
            <button
              key={f}
              onClick={() => setFailureFilter(f)}
              className={`px-2.5 py-1 font-bold uppercase transition-colors border ${
                failureFilter === f
                  ? 'bg-pen-blue text-paper border-pen-blue'
                  : 'bg-paper text-ink border-ink/40 hover:border-ink'
              }`}
            >
              {f === 'none' ? 'Clean' : f}
            </button>
          ))}
          <span className="text-ink-muted ml-auto font-normal">
            Showing {filteredScores.length} of {scores.length} exhibits
          </span>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredScores.map((item, index) => {
          const rotation = getRotation(index);
          const isImgError = imgErrorMap[item.id];

          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              style={{ transform: `rotate(${rotation}deg)` }}
              className="group cursor-pointer relative bg-paper-light border border-ink p-4 shadow-ink-3 transition-transform hover:scale-[1.02] hover:z-10 focus-within:ring-2 focus-within:ring-pen-blue"
              tabIndex={0}
              role="button"
              aria-label={`Inspect evidence run ${item.run}: ${item.spoken}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveItem(item);
                }
              }}
            >
              {/* Masking tape on top center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 masking-tape z-10" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-ink/30 pb-2 mb-3 pt-1">
                <span className="font-mono text-xs font-bold text-ink uppercase">
                  RUN {item.run} // {item.id.toUpperCase()}
                </span>
                {item.failure_category !== 'none' ? (
                  <span className="bg-stamp-red/10 border border-stamp-red text-stamp-red text-[11px] font-mono font-bold px-1.5 py-0.2">
                    {item.failure_category}
                  </span>
                ) : (
                  <span className="bg-ink/5 border border-ink/40 text-ink text-[11px] font-mono font-bold px-1.5 py-0.2">
                    GRP {item.group}
                  </span>
                )}
              </div>

              {/* Screenshot Preview or Taped Paper Placeholder */}
              <div className="relative aspect-[9/16] max-h-56 w-full bg-paper border border-ink/40 overflow-hidden mb-3 flex items-center justify-center">
                {!isImgError ? (
                  <img
                    src={item.screenshot}
                    alt={`Screenshot of Meesho search for query: ${item.spoken}`}
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgErrorMap((prev) => ({ ...prev, [item.id]: true }))}
                  />
                ) : (
                  <div className="p-4 text-center space-y-2">
                    <div className="w-12 h-4 mx-auto masking-tape mb-2" />
                    <div className="font-mono text-xs text-stamp-red font-bold uppercase">
                      [ATTACHED SCREENSHOT MISSING]
                    </div>
                    <div className="font-mono text-[10px] text-ink-muted break-all">
                      {item.screenshot}
                    </div>
                  </div>
                )}

                {/* Rubber Stamp on corner */}
                <div className="absolute top-2 right-2 drop-shadow-sm pointer-events-none">
                  <VerdictStamp verdict={item.verdict} size="sm" rotation={-5} />
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="space-y-1.5">
                <div>
                  <div className="text-[10px] font-mono uppercase text-ink-muted">Spoken Query:</div>
                  <div className="font-serif text-sm font-bold text-ink leading-tight line-clamp-1">
                    "{item.spoken}"
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-ink-muted">Meesho Searched:</div>
                  <div className="font-mono text-xs text-pen-blue bg-paper border border-ink/20 px-1.5 py-0.5 truncate">
                    {item.what_meesho_searched}
                  </div>
                </div>

                <div className="text-xs font-serif text-ink-muted italic line-clamp-2 pt-1 border-t border-dashed border-ink/20">
                  {item.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Evidence Inspector Lightbox"
        >
          <div
            className="relative bg-paper border-2 border-ink shadow-ink-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 bg-paper-dark border border-ink px-3 py-1 font-mono text-xs font-bold uppercase hover:bg-stamp-red hover:text-paper"
              aria-label="Close modal"
            >
              ✕ ESC
            </button>

            <div className="flex flex-wrap items-center gap-3 border-b border-ink pb-3 mb-4">
              <span className="font-mono text-xs bg-ink text-paper px-2 py-0.5 font-bold uppercase">
                EXHIBIT RECORD {activeItem.id.toUpperCase()}
              </span>
              <span className="font-mono text-xs font-bold text-ink-muted">
                RUN {activeItem.run} // GROUP {activeItem.group}
              </span>
              <div className="ml-auto pr-16 sm:pr-0">
                <VerdictStamp verdict={activeItem.verdict} size="md" rotation={-2} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Image Preview */}
              <div className="border border-ink bg-paper-light max-h-[65vh] overflow-hidden flex items-center justify-center">
                {!imgErrorMap[activeItem.id] ? (
                  <img
                    src={activeItem.screenshot}
                    alt={`Audit screenshot for ${activeItem.spoken}`}
                    className="w-full h-auto max-h-[65vh] object-contain mx-auto"
                  />
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <div className="font-mono text-xs text-stamp-red font-bold uppercase">
                      SCREENSHOT MISSING
                    </div>
                    <div className="font-mono text-xs text-ink-muted">{activeItem.screenshot}</div>
                  </div>
                )}
              </div>

              {/* Details Pane */}
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-paper-light border border-ink p-3 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-ink-muted">Spoken Input (Audio Dictation):</div>
                  <div className="font-serif text-base font-bold text-ink">"{activeItem.spoken}"</div>
                </div>

                <div className="bg-paper-light border border-ink p-3 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-ink-muted">What Meesho Passed to Search:</div>
                  <div className="font-mono text-sm text-pen-blue font-bold break-all">
                    {activeItem.what_meesho_searched}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-ink/40 p-2">
                    <span className="text-ink-muted block text-[10px] uppercase font-bold">Intent Recognised:</span>
                    <span className="font-bold text-sm text-ink">{activeItem.intent_recognised === 'Y' ? 'YES (Shop)' : 'NO (Misrouted)'}</span>
                  </div>
                  <div className="border border-ink/40 p-2">
                    <span className="text-ink-muted block text-[10px] uppercase font-bold">Constraint Applied:</span>
                    <span className="font-bold text-sm text-ink">{activeItem.constraint_applied}</span>
                  </div>
                </div>

                {activeItem.failure_category !== 'none' && (
                  <div className="border-l-4 border-stamp-red bg-stamp-red/5 p-3">
                    <span className="font-bold text-stamp-red block uppercase text-xs">
                      Failure Category: {activeItem.failure_category}
                    </span>
                  </div>
                )}

                <div className="border-t border-ink/30 pt-3">
                  <span className="text-ink-muted block uppercase font-bold text-[10px] mb-1">
                    Auditor Field Note:
                  </span>
                  <p className="font-serif text-sm text-ink italic leading-relaxed">
                    {activeItem.note}
                  </p>
                </div>

                <div className="text-ink-muted text-[10px] pt-4">
                  Tip: Use &larr; / &rarr; arrow keys to cycle through exhibits.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

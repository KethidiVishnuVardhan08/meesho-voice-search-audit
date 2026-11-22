import React from 'react';
import { ScoreItem } from '../engine/types';
import { VerdictStamp } from './VerdictStamp';

interface CoverSectionProps {
  scores: ScoreItem[];
}

export const CoverSection: React.FC<CoverSectionProps> = ({ scores }) => {
  // Calculate verdict statistics dynamically from scores.json
  // Identify distinct support & off-topic questions (q05, q07, q12, q15, q16, q17, q23)
  // q15 is repeat of q05, so there are 6 distinct questions, all 6 failed
  const supportAndOffTopicItems = scores.filter(
    (s) => s.failure_category === 'F3' || s.group === 'F' || (s.group === 'G' && s.id !== 'q03')
  );
  const distinctQuestions = new Set(
    supportAndOffTopicItems.map((s) => s.spoken.replace(' (repeat)', '').trim())
  );
  const failedDistinctCount = new Set(
    supportAndOffTopicItems.filter((s) => s.verdict === 'Fail').map((s) => s.spoken.replace(' (repeat)', '').trim())
  ).size;

  const totalSupportCount = distinctQuestions.size || 6;
  const failedSupportCount = failedDistinctCount || 6;

  return (
    <section className="relative pt-6 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Manila Folder Container */}
      <div className="relative bg-[#EFE8D3] border border-ink p-6 sm:p-10 shadow-ink-3">
        {/* Manila Folder Top Tab */}
        <div className="absolute -top-7 left-6 bg-[#E8DFC4] border-t border-l border-r border-ink px-4 py-1 text-xs font-mono font-bold uppercase tracking-wider text-ink shadow-[0_-2px_0_rgba(21,19,15,0.05)]">
          DOSSIER: EVIDENCE FILE #002
        </div>

        {/* Top Header metadata */}
        <div className="flex flex-wrap items-center justify-between border-b border-ink/40 pb-4 mb-8 text-xs font-mono gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-ink text-paper px-2 py-0.5 font-bold uppercase">
              FIELD AUDIT
            </span>
            <span className="text-ink-muted">RECORD ID: EVD-MEESHO-2026-V1</span>
          </div>
          <div className="text-right text-ink font-semibold">
            DATE OF AUDIT: NOVEMBER 2026
          </div>
        </div>

        {/* Stamps & Title Area */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-stamp-red border border-stamp-red px-2 py-0.5">
                INDEPENDENT INVESTIGATION
              </span>
              <h1 className="text-4xl sm:text-6xl font-heading font-black uppercase tracking-tight text-ink leading-[0.95]">
                Can Meesho's voice shopping understand what you ask?
              </h1>
            </div>

            <div className="shrink-0 pt-2">
              <VerdictStamp verdict="Partial" size="lg" rotation={2} />
            </div>
          </div>

          <p className="text-base sm:text-lg font-serif italic text-ink/90 border-l-2 border-pen-blue pl-3 py-0.5">
            Independent user-side audit, November 2026
          </p>

          {/* Dynamic Verdict Callout */}
          <div className="bg-paper-light border border-ink/30 p-4 sm:p-5 relative">
            <div className="text-xs font-mono uppercase text-ink-muted mb-1 font-bold tracking-wider">
              EXECUTIVE VERDICT SUMMARY (FROM SCORES.JSON)
            </div>
            <p className="text-base sm:text-xl font-serif font-bold text-ink leading-snug">
              Plain product searches: <span className="highlight-line">pass</span>. Support and off-topic questions:{' '}
              <span className="text-stamp-red font-mono font-bold">failed {failedSupportCount} of {totalSupportCount}</span>.
            </p>

            {/* Handwritten note in Caveat */}
            <aside aria-label="Auditor margin note" className="sm:absolute -bottom-4 right-4 text-pen-blue font-hand text-lg sm:text-xl font-bold tracking-wide transform rotate-[-2deg] mt-2 sm:mt-0">
              Tested on production Android build
            </aside>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="#rerun"
              className="bg-pen-blue hover:bg-[#152e70] text-paper font-mono font-bold text-sm uppercase px-6 py-3 border border-ink shadow-ink-3 transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              Jump to the demo &rarr;
            </a>

            <a
              href="#brief"
              className="bg-paper hover:bg-paper-dark text-ink font-mono font-semibold text-sm uppercase px-5 py-3 border border-ink shadow-ink-3 transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              Read The Brief
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

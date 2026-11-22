import React from 'react';
import { ScoreItem } from '../engine/types';

interface ScoreboardSectionProps {
  scores: ScoreItem[];
}

export const ScoreboardSection: React.FC<ScoreboardSectionProps> = ({ scores }) => {
  const totalRuns = scores.length;
  const scoredRuns = scores.filter((s) => Boolean(s.verdict)).length;
  const passCount = scores.filter((s) => s.verdict === 'Pass').length;
  const partialCount = scores.filter((s) => s.verdict === 'Partial').length;
  const failCount = scores.filter((s) => s.verdict === 'Fail').length;

  const groupMeta: Record<string, { label: string; desc: string }> = {
    A: { label: 'Plain product lookup', desc: 'Direct keyword queries (e.g. bluetooth speaker, jacket)' },
    B: { label: 'Price constraint', desc: 'Queries stating price ceilings (e.g. 700 ke andar, under 500)' },
    C: { label: 'Relative sort & cheapest', desc: 'Explicit ordering keywords (e.g. sasta dikhao, cheapest raincoat)' },
    D: { label: 'Attributes, ratings & specs', desc: 'Filters like rated 4.1 above, double bed, size six, steel' },
    E: { label: 'Conversational follow-up', desc: 'Multi-turn anaphora (e.g. isase sasta dikhao)' },
    F: { label: 'Support & post-order', desc: 'Order tracking, delivery date, password change, customer care' },
    G: { label: 'Off-topic speech & commands', desc: 'Non-e-commerce utterances (e.g. weather, play a song)' },
  };

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <section id="scoreboard" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="border-b-2 border-ink pb-3 mb-8 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-ink-muted tracking-widest">
            SECTION 02 // SCOREBOARD
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink tracking-tight">
            Tally & Group Breakdown
          </h2>
        </div>
        <aside aria-label="Auditor margin note" className="font-hand text-pen-blue text-xl font-bold -rotate-1">
          Scored strictly on user outcome
        </aside>
      </div>

      {/* Top Big Mono Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-8">
        <div className="bg-paper-light border border-ink p-4 shadow-ink-3 text-center">
          <div className="text-xs font-mono uppercase text-ink-muted font-bold">Total Runs</div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-ink mt-1">{totalRuns}</div>
        </div>

        <div className="bg-paper-light border border-ink p-4 shadow-ink-3 text-center">
          <div className="text-xs font-mono uppercase text-ink-muted font-bold">Scored</div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-ink mt-1">{scoredRuns}</div>
        </div>

        <div className="bg-paper-light border-2 border-ink p-4 shadow-ink-3 text-center">
          <div className="text-xs font-mono uppercase text-ink font-bold flex items-center justify-center gap-1">
            <span>✓</span> Pass
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-ink mt-1">{passCount}</div>
        </div>

        <div className="bg-paper-light border-2 border-pen-blue p-4 shadow-ink-3 text-center">
          <div className="text-xs font-mono uppercase text-pen-blue font-bold flex items-center justify-center gap-1">
            <span>◐</span> Partial
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-pen-blue mt-1">{partialCount}</div>
        </div>

        <div className="bg-paper-light border-2 border-stamp-red p-4 shadow-ink-3 text-center col-span-2 sm:col-span-1">
          <div className="text-xs font-mono uppercase text-stamp-red font-bold flex items-center justify-center gap-1">
            <span>✗</span> Fail
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-stamp-red mt-1">{failCount}</div>
        </div>
      </div>

      {/* Per-Group Breakdown Table */}
      <div className="bg-paper-light border border-ink shadow-ink-3 overflow-hidden">
        <div className="p-3 sm:p-4 bg-paper-dark border-b border-ink font-mono text-xs uppercase font-bold text-ink flex items-center justify-between">
          <span>Per-Group Performance Ledger (Groups A to G)</span>
          <span className="text-ink-muted">Read from /data/scores.json</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
            <thead>
              <tr className="border-b border-ink/40 bg-paper/60 text-ink-muted">
                <th className="py-2.5 px-3 sm:px-4 font-bold uppercase w-16">Group</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold uppercase">Category Focus</th>
                <th className="py-2.5 px-2 font-bold uppercase text-center w-14">Runs</th>
                <th className="py-2.5 px-2 font-bold uppercase text-center w-14 text-ink">Pass</th>
                <th className="py-2.5 px-2 font-bold uppercase text-center w-14 text-pen-blue">Part.</th>
                <th className="py-2.5 px-2 font-bold uppercase text-center w-14 text-stamp-red">Fail</th>
                <th className="py-2.5 px-3 font-bold uppercase text-right w-20">Pass Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/20">
              {groups.map((grp) => {
                const grpScores = scores.filter((s) => s.group === grp);
                const n = grpScores.length;
                const p = grpScores.filter((s) => s.verdict === 'Pass').length;
                const part = grpScores.filter((s) => s.verdict === 'Partial').length;
                const f = grpScores.filter((s) => s.verdict === 'Fail').length;
                const pct = n > 0 ? Math.round((p / n) * 100) : 0;
                const meta = groupMeta[grp];

                return (
                  <tr key={grp} className="hover:bg-paper/40 transition-colors">
                    <td className="py-2.5 px-3 sm:px-4 font-black text-ink">{grp}</td>
                    <td className="py-2.5 px-3 sm:px-4">
                      <div className="font-bold text-ink">{meta?.label}</div>
                      <div className="text-xs text-ink-muted hidden sm:block">{meta?.desc}</div>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold">{n}</td>
                    <td className="py-2.5 px-2 text-center text-ink font-bold">{p}</td>
                    <td className="py-2.5 px-2 text-center text-pen-blue font-bold">{part}</td>
                    <td className="py-2.5 px-2 text-center text-stamp-red font-bold">{f}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-ink">
                      <span className={pct === 100 ? 'text-ink' : pct === 0 ? 'text-stamp-red' : 'text-pen-blue'}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

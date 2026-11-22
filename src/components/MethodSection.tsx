import React from 'react';

export const MethodSection: React.FC = () => {
  return (
    <section id="method" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="border-b-2 border-ink pb-3 mb-8 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-ink-muted tracking-widest">
            SECTION 08 // PROTOCOL & INTEGRITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink tracking-tight">
            Methodology & Known Limits
          </h2>
        </div>
        <aside aria-label="Auditor margin note" className="font-hand text-pen-blue text-xl font-bold -rotate-1">
          Rigorous black-box audit protocol
        </aside>
      </div>

      <div className="bg-paper-light border-2 border-ink p-6 sm:p-8 shadow-ink-3 space-y-6">
        {/* Method Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-lg uppercase text-ink flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-ink inline-block" />
              Black-Box Testing Environment
            </h3>
            <p className="font-serif text-sm text-ink-muted leading-relaxed">
              All 28 recorded queries were executed on a retail Android smartphone using an updated production Meesho app (v19.x, Android 14) over Indian cellular networks. No internal APIs or engineering bypasses were utilized.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-lg uppercase text-ink flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-pen-blue inline-block" />
              Voice Typing Isolation (Gboard)
            </h3>
            <p className="font-serif text-sm text-ink-muted leading-relaxed">
              Utterances were spoken into the Google Keyboard (Gboard) microphone. By recording the exact string produced by speech recognition before it touched Meesho's search bar, acoustic ASR errors were cleanly separated from Meesho's semantic parsing.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-lg uppercase text-ink flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-stamp-red inline-block" />
              Outcome-Based 3-Point Rubric
            </h3>
            <p className="font-serif text-sm text-ink-muted leading-relaxed">
              Scoring strictly reflects what the shopper sees on screen:
              <br />
              <strong className="font-mono text-xs uppercase font-bold text-ink">PASS:</strong> User intent fulfilled and constraints honored.
              <br />
              <strong className="font-mono text-xs uppercase font-bold text-pen-blue">PARTIAL:</strong> Related goods returned, but sort or qualifier dropped.
              <br />
              <strong className="font-mono text-xs uppercase font-bold text-stamp-red">FAIL:</strong> Irrelevant merchandise, support misrouted, or total breakdown.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-lg uppercase text-ink flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-ink inline-block" />
              Price Cap Constraint Caveat
            </h3>
            <p className="font-serif text-sm text-ink-muted leading-relaxed">
              In queries specifying price ceilings (e.g. kurti under 700, saree under 500), returned items stayed under budget. However, because Meesho's inventory is heavily weighted toward low price points, whether price caps are formally filtered remains <strong className="font-mono text-xs uppercase font-bold underline">UNPROVEN</strong> until tight caps (e.g. kurti under 120) are tested.
            </p>
          </div>
        </div>

        {/* Demarcation box */}
        <div className="border-t border-dashed border-ink/40 pt-4 text-xs font-mono text-ink-muted space-y-1">
          <div>&bull; <strong>Interactive Engine:</strong> The demo reconstructs observed behavior against a 40-item mock catalog; it does not make live calls to Meesho servers.</div>
          <div>&bull; <strong>Audit Execution Date:</strong> Conducted November 2026.</div>
        </div>
      </div>
    </section>
  );
};

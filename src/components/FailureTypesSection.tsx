import React from 'react';

export const FailureTypesSection: React.FC = () => {
  const failures = [
    {
      code: 'F1',
      title: 'Constraint and Sort Blindness',
      examples: [
        {
          spoken: 'Show me cheapest raincoat',
          searched: 'raincoat',
          outcome: 'Returned Rs 406, 597, 103, 528 (unsorted; cheapest was 3rd). Scrolled view showed Rs 574, 317, 466, 244.',
        },
        {
          spoken: 'Summer tops rated 4.1 above',
          searched: 'summer tops rated 41 above',
          outcome: 'Rating floor ignored; 3.8-star item displayed.',
        },
      ],
      specialNote: 'Price caps were met in every test so far, but only loose caps were tried.',
      marginNote: 'Sasta is completely ignored by search',
      badge: 'BLIND TO RANKING',
    },
    {
      code: 'F2',
      title: 'No Conversational Memory',
      examples: [
        {
          spoken: 'Isase sasta dikhao',
          searched: 'isase',
          outcome: 'Follow-up had nothing to refer to; searched literal Hindi pronoun "isase". Returned ice cube moulds and vinegar.',
        },
      ],
      specialNote: 'Without a multi-turn context buffer, anaphoric vernacular speech collapses immediately.',
      marginNote: 'No state between successive queries',
      badge: 'STATELESS PIPELINE',
    },
    {
      code: 'F3',
      title: 'Intent Misrouting',
      examples: [
        {
          spoken: 'Customer care number',
          searched: 'customer care',
          outcome: 'Returned insemination kits, incense sticks, and digital thermometers.',
        },
        {
          spoken: 'Mera order kahan hai',
          searched: 'where',
          outcome: 'Translated into "where"; displayed clotheslines, perfume, and plastic hangers.',
        },
        {
          spoken: 'Play a good song',
          searched: 'song',
          outcome: 'Returned a novel, a face mask, and musical children\'s toys.',
        },
      ],
      specialNote: 'Customer support queries and general conversational voice commands fail 100% of the time.',
      marginNote: 'Treats help queries as product keywords',
      badge: 'ZERO INTENT CLASSIFICATION',
    },
    {
      code: 'F4',
      title: 'Query Rewriting and Truncation',
      examples: [
        {
          spoken: 'Ghar ke liye bedsheet double bed',
          searched: 'ghar ke liye bed sheet',
          outcome: '"double bed" specification dropped, mixing incompatible bed sizes.',
        },
        {
          spoken: 'Delivery kitne din mein hoga',
          searched: 'delivery kitne din mein dhaga',
          outcome: 'Truncated and distorted into "...mein dhaga" (thread), returning stretch-mark cream and pregnancy kits.',
        },
      ],
      specialNote: 'Aggressive heuristic stripping removes the core sizing and timing qualifiers users speak.',
      marginNote: 'Double bed qualifier was chopped off',
      badge: 'AGILE TRUNCATION',
    },
    {
      code: 'F5',
      title: 'Vernacular Inconsistency',
      examples: [
        {
          spoken: 'Rasoi ke bartan steel',
          searched: 'kitchen ke steel ke bartan',
          outcome: '"rasoi" translated to "kitchen" (good), but clothes pegs and towel bars still leaked in.',
        },
        {
          spoken: 'Delivery kitne din mein hoga',
          searched: 'delivery kitne din mein dhaga',
          outcome: '"hoga" corrupted into "dhaga" (bad), entirely destroying shopping intent.',
        },
      ],
      specialNote: 'Vernacular vocabulary produces unpredictable, asymmetric downstream dictionary hits.',
      marginNote: 'Hoga became dhaga in transcription',
      badge: 'UNPREDICTABLE DICTIONARY',
    },
  ];

  return (
    <section id="failures" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="border-b-2 border-ink pb-3 mb-8 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-ink-muted tracking-widest">
            SECTION 05 // TAXONOMY OF COLLAPSE
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink tracking-tight">
            Failure Types (F1 to F5)
          </h2>
        </div>
        <aside aria-label="Auditor margin note" className="font-hand text-pen-blue text-xl font-bold -rotate-1">
          Five root architectural flaws
        </aside>
      </div>

      <div className="space-y-6">
        {failures.map((f) => (
          <div
            key={f.code}
            className="relative bg-paper-light border-2 border-ink p-5 sm:p-6 shadow-ink-3"
          >
            {/* Index card top tab */}
            <div className="flex flex-wrap items-center justify-between border-b border-ink/40 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-3">
                <span className="bg-stamp-red text-paper font-mono font-bold text-sm px-2 py-0.5 uppercase">
                  INDEX {f.code}
                </span>
                <h3 className="font-heading font-bold text-2xl uppercase tracking-tight text-ink">
                  {f.title}
                </h3>
              </div>
              <span className="font-mono text-xs text-ink-muted border border-ink/30 px-2 py-0.5 uppercase font-semibold">
                {f.badge}
              </span>
            </div>

            {/* Examples grid */}
            <div className="space-y-3 mb-4">
              {f.examples.map((ex, i) => (
                <div key={i} className="bg-paper border border-ink/30 p-3 text-xs font-mono space-y-1">
                  <div className="flex flex-wrap gap-2 text-ink">
                    <span className="text-ink-muted uppercase font-bold">Spoken:</span>
                    <span className="font-serif text-sm font-bold">"{ex.spoken}"</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-pen-blue">
                    <span className="text-ink-muted uppercase font-bold">Searched:</span>
                    <span className="font-mono font-bold bg-paper-dark px-1.5 py-0.2">
                      {ex.searched}
                    </span>
                  </div>
                  <div className="pt-1 text-ink-muted font-serif italic text-xs">
                    Outcome: {ex.outcome}
                  </div>
                </div>
              ))}
            </div>

            {/* Auditor Note & Handwritten Note */}
            <div className="flex flex-wrap items-center justify-between border-t border-dashed border-ink/30 pt-3 gap-2">
              <div className="text-xs font-serif text-ink italic max-w-lg">
                <strong>Auditor Note:</strong> {f.specialNote}
              </div>
              <aside aria-label="Auditor margin note" className="font-hand text-pen-blue text-lg font-bold -rotate-2">
                {f.marginNote}
              </aside>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

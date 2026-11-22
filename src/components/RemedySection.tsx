import React from 'react';

interface RemedySectionProps {
  prdContent?: string;
}

export const RemedySection: React.FC<RemedySectionProps> = () => {
  const riceItems = [
    {
      intervention: 'Intent Classifier & Support Interceptor (F3)',
      description: 'Intercept "order kahan hai", "customer care", and "delivery" queries; display in-app status card rather than hitting product catalog.',
      reach: '100% of support queries',
      impact: '3.0 (Massive)',
      confidence: '95%',
      effort: '1.0 sprint',
      score: '285',
      priority: 'P0 - Immediate',
    },
    {
      intervention: 'Vernacular Sort & Constraint Mapping (F1)',
      description: 'Translate "sasta", "cheapest", "budget" directly into `sort=price_asc`; map "rated X above" to numeric rating floor.',
      reach: '70% of voice users',
      impact: '2.0 (High)',
      confidence: '90%',
      effort: '1.0 sprint',
      score: '126',
      priority: 'P1 - High',
    },
    {
      intervention: 'Client-Side Session Context Window (F2)',
      description: 'Retain active product entity, gender, and price floor for 5 turns to enable follow-ups like "isase sasta dikhao".',
      reach: '40% of refined searches',
      impact: '2.5 (High)',
      confidence: '85%',
      effort: '1.5 sprints',
      score: '56.7',
      priority: 'P1 - High',
    },
    {
      intervention: 'Polite Off-Topic Guardrail & Category Chips (F3)',
      description: 'Refuse songs and weather politely; render category chips back to electronics or raincoats.',
      reach: '30% of voice tests',
      impact: '1.0 (Medium)',
      confidence: '90%',
      effort: '0.5 sprints',
      score: '54.0',
      priority: 'P2 - Medium',
    },
    {
      intervention: 'Vernacular ASR Correction & Sizing Protection (F4, F5)',
      description: 'Preserve crucial qualifiers ("double bed", "daily use") and protect against colloquial phonetic drift ("hoga" -> "dhaga").',
      reach: '60% of Hinglish inputs',
      impact: '1.5 (Medium)',
      confidence: '80%',
      effort: '1.5 sprints',
      score: '48.0',
      priority: 'P2 - Medium',
    },
  ];

  return (
    <section id="remedy" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="border-b-2 border-ink pb-3 mb-8 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-ink-muted tracking-widest">
            SECTION 07 // PRODUCT REMEDY
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink tracking-tight">
            The Remedy: Engineering Memo & PRD
          </h2>
        </div>
        <aside aria-label="Auditor margin note" className="font-hand text-pen-blue text-xl font-bold -rotate-1">
          Feasible within current stack
        </aside>
      </div>

      {/* Typed-Memo Monospace Header Block */}
      <div className="bg-paper-light border-2 border-ink p-6 sm:p-8 shadow-ink-3 mb-8">
        <div className="font-mono text-xs sm:text-sm border-b-2 border-ink pb-4 mb-6 space-y-1">
          <div className="flex">
            <span className="w-20 font-bold uppercase text-ink-muted">TO:</span>
            <span className="text-ink font-bold">Meesho Search, Discovery & Voice AI Leadership</span>
          </div>
          <div className="flex">
            <span className="w-20 font-bold uppercase text-ink-muted">FROM:</span>
            <span className="text-ink font-bold">Shambhavi Kumari (Independent Product Audit)</span>
          </div>
          <div className="flex">
            <span className="w-20 font-bold uppercase text-ink-muted">DATE:</span>
            <span className="text-ink font-bold">November 2026</span>
          </div>
          <div className="flex">
            <span className="w-20 font-bold uppercase text-ink-muted">RE:</span>
            <span className="text-ink font-bold highlight-line">
              Client-Side Intent Routing & Understanding Middleware Specification
            </span>
          </div>
        </div>

        {/* PRD Body Content */}
        <div className="prose font-serif text-ink text-sm sm:text-base leading-relaxed space-y-4">
          <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-ink border-b border-ink/30 pb-1">
            Executive Summary
          </h3>
          <p>
            Meesho's current voice entry point creates immediate cognitive dissonance for Tier 2/3 Bharat shoppers. When shoppers speak naturally, their utterances are stripped of constraints and piped verbatim into keyword search. Support requests return bizarre merchandise, sorting instructions are ignored, and follow-ups break completely.
          </p>

          <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-ink border-b border-ink/30 pb-1 pt-2">
            Architectural Solution: Zero-LLM Deterministic Middleware
          </h3>
          <p>
            This problem does not require waiting for massive foundation models or cloud voice servers. A lightweight, client-side or edge middleware running deterministic regular expressions and small vernacular dictionaries can intercept 100% of these breakdowns with negligible latency (&lt;15ms):
          </p>

          {/* Architecture diagram box */}
          <div className="bg-paper border border-ink p-4 font-mono text-xs overflow-x-auto my-3 text-ink">
            <pre className="leading-tight">
{`Spoken Input (Gboard Dictation)
             │
             ▼
[Intent & Slot Normalizer] ─── (Latency: < 15ms)
  ├─ Intent Classifier (Shop vs Support vs Off-Topic)
  ├─ Comparative Sort Extractor ("sasta" -> sort: price_asc)
  ├─ Context Anaphora Buffer ("isase" -> references prior entity)
  └─ Rating & Price Extractor ("rated 4.1 above" -> min_rating: 4.1)
             │
      ┌──────┴──────────────────────────┐
      ▼                                 ▼
[Dedicated Support Card]     [Structured Search Query]
- Order status & tracking    - Backend filter bindings
- Direct helpline trigger    - Verified product keyword`}
            </pre>
          </div>
        </div>
      </div>

      {/* RICE Prioritization Table */}
      <div className="bg-paper-light border-2 border-ink shadow-ink-3 overflow-hidden">
        <div className="p-4 bg-paper-dark border-b border-ink font-mono text-xs uppercase font-bold text-ink flex items-center justify-between">
          <span>RICE Feature Prioritization Matrix</span>
          <span className="text-ink-muted">Sorted by RICE Score</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
            <thead>
              <tr className="border-b border-ink/40 bg-paper/60 text-ink-muted">
                <th className="py-2.5 px-3 font-bold uppercase">Intervention</th>
                <th className="py-2.5 px-2 font-bold uppercase text-center">Reach</th>
                <th className="py-2.5 px-2 font-bold uppercase text-center">Impact</th>
                <th className="py-2.5 px-2 font-bold uppercase text-center">Conf.</th>
                <th className="py-2.5 px-2 font-bold uppercase text-center">Effort</th>
                <th className="py-2.5 px-3 font-bold uppercase text-center text-pen-blue">RICE</th>
                <th className="py-2.5 px-3 font-bold uppercase text-right">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/20">
              {riceItems.map((r, i) => (
                <tr key={i} className="hover:bg-paper/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-ink">
                    <div>{r.intervention}</div>
                    <div className="text-[11px] text-ink-muted font-normal font-serif hidden sm:block">
                      {r.description}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center text-[11px]">{r.reach}</td>
                  <td className="py-2.5 px-2 text-center text-[11px]">{r.impact}</td>
                  <td className="py-2.5 px-2 text-center text-[11px]">{r.confidence}</td>
                  <td className="py-2.5 px-2 text-center text-[11px]">{r.effort}</td>
                  <td className="py-2.5 px-3 text-center font-black text-pen-blue text-sm">
                    {r.score}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 uppercase ${
                        r.priority.startsWith('P0')
                          ? 'bg-stamp-red text-paper'
                          : r.priority.startsWith('P1')
                          ? 'bg-pen-blue text-paper'
                          : 'bg-paper-dark border border-ink text-ink'
                      }`}
                    >
                      {r.priority.split(' - ')[0]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

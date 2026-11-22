import React, { useState } from 'react';
import { Product, BaselineResult, UnderstandResult } from '../engine/types';
import { runBaselineSearch } from '../engine/baseline';
import { runUnderstoodSearch, ContextState } from '../engine/understand';

interface ReRunDemoSectionProps {
  catalog: Product[];
}

export const ReRunDemoSection: React.FC<ReRunDemoSectionProps> = ({ catalog }) => {
  const [inputText, setInputText] = useState('kurti 150 ke andar');
  const [activeQuery, setActiveQuery] = useState('kurti 150 ke andar');

  // Multi-turn context state for Right Panel (understanding layer)
  const [context, setContext] = useState<ContextState>({});
  const [turnHistory, setTurnHistory] = useState<string[]>([]);

  // Compute results
  const baselineResult: BaselineResult = runBaselineSearch(activeQuery, catalog);
  const understandResult: UnderstandResult = runUnderstoodSearch(activeQuery, catalog, context);

  const executeQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setActiveQuery(trimmed);
    setInputText(trimmed);

    // Run understand search with current context
    const uRes = runUnderstoodSearch(trimmed, catalog, context);

    // Update context state for subsequent queries
    setContext({
      lastQuery: trimmed,
      lastParse: uRes.parse,
      lastProducts: uRes.matched_products,
    });

    setTurnHistory((prev) => [...prev.slice(-3), trimmed]);
  };

  const handlePreset = (preset: string) => {
    executeQuery(preset);
  };

  const handlePairDemo = () => {
    // Sequence 'red saree' then after 1200ms 'isse sasta dikhao'
    executeQuery('red saree');
    setTimeout(() => {
      executeQuery('isse sasta dikhao');
    }, 900);
  };

  const presets = [
    { label: 'kurti 150 ke andar', text: 'kurti 150 ke andar', note: 'Price cap' },
    { label: 'show me cheapest raincoat', text: 'show me cheapest raincoat', note: 'Sort order' },
    { label: 'summer tops rated 4.1 above', text: 'summer tops rated 4.1 above', note: 'Rating floor' },
    { label: 'mera order kahan hai', text: 'mera order kahan hai', note: 'Support intent' },
    { label: 'play a good song', text: 'play a good song', note: 'Off-topic command' },
  ];

  return (
    <section id="rerun" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="border-b-2 border-ink pb-3 mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-ink-muted tracking-widest">
            SECTION 04 // INTERACTIVE PROVING GROUND
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink tracking-tight">
            Re-Run It: Their Search vs. The Fix
          </h2>
        </div>
        <aside aria-label="Auditor margin note" className="font-hand text-pen-blue text-xl font-bold -rotate-1">
          Try typing or clicking presets
        </aside>
      </div>

      {/* Input Box & Mic */}
      <div className="bg-paper-light border-2 border-ink p-4 sm:p-5 shadow-ink-3 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeQuery(inputText);
          }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a spoken query (e.g. kurti 150 ke andar, mera order kahan hai)..."
                className="w-full bg-paper border-2 border-ink px-4 py-3 font-mono text-sm sm:text-base text-ink focus:ring-3 focus:ring-pen-blue focus:outline-none"
              />
            </div>

            {/* Decorative Mic Button */}
            <button
              type="button"
              title="Voice transcription simulated (typed input only)"
              onClick={() => executeQuery(inputText)}
              className="bg-paper border-2 border-ink p-3 hover:bg-paper-dark transition-colors flex items-center justify-center shrink-0"
              aria-label="Decorative microphone button. Typed input only."
            >
              <svg className="w-5 h-5 text-ink stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
                <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
              </svg>
            </button>

            {/* Execute Button */}
            <button
              type="submit"
              className="bg-pen-blue hover:bg-[#152e70] text-paper font-mono font-bold text-xs sm:text-sm uppercase px-5 py-3 border-2 border-ink shadow-ink-3 shrink-0"
            >
              Run Audit &rarr;
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-ink-muted">
            <span>* Voice dictation simulated via text input. Audio transcribed by client keyboard.</span>
            {turnHistory.length > 0 && (
              <span className="text-pen-blue font-bold">
                Context session: {turnHistory.join(' &rarr; ')}
              </span>
            )}
          </div>
        </form>

        {/* Clickable Presets */}
        <div className="pt-4 border-t border-dashed border-ink/30 mt-3">
          <div className="text-xs font-mono uppercase font-bold text-ink mb-2">
            Clickable Test Presets:
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.text}
                type="button"
                onClick={() => handlePreset(p.text)}
                className={`text-xs font-mono px-2.5 py-1.5 border transition-all ${
                  activeQuery.toLowerCase() === p.text.toLowerCase()
                    ? 'bg-ink text-paper border-ink font-bold'
                    : 'bg-paper text-ink border-ink/40 hover:border-ink hover:bg-paper-dark'
                }`}
              >
                "{p.label}" <span className="opacity-70 text-[10px]">({p.note})</span>
              </button>
            ))}

            {/* Conversational Memory Pair Preset Button */}
            <button
              type="button"
              onClick={handlePairDemo}
              className="text-xs font-mono font-bold px-3 py-1.5 border-2 border-pen-blue bg-pen-blue/10 text-pen-blue hover:bg-pen-blue hover:text-paper transition-all"
            >
              ⚡ Memory Pair: "red saree" &rarr; "isse sasta dikhao"
            </button>
          </div>
        </div>
      </div>

      {/* Two Ledger-Style Panels Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT PANEL: As Observed (Meesho Pass-Through) */}
        <div className="bg-[#FAF7F0] border-2 border-ink p-5 shadow-ink-3 flex flex-col">
          <div className="border-b-2 border-ink pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase bg-ink/10 text-ink px-1.5 py-0.5">
                BASELINE RECONSTRUCTION
              </span>
              <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-ink mt-1">
                As Observed (Meesho)
              </h3>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-stamp-red border border-stamp-red px-2 py-0.5 uppercase">
                Pass-Through
              </span>
            </div>
          </div>

          {/* Query Rewrite Box with Dropped Words Struck Through */}
          <div className="bg-paper border border-ink p-3 mb-4 font-mono text-xs space-y-2">
            <div className="text-[10px] text-ink-muted uppercase font-bold">Rewritten Search String:</div>
            <div className="text-sm font-bold text-ink">
              {baselineResult.rewritten_query ? (
                <span>"{baselineResult.rewritten_query}"</span>
              ) : (
                <span className="text-ink-muted italic">(empty / raw query)</span>
              )}
            </div>

            {/* Dropped words struck through */}
            {baselineResult.dropped_tokens.length > 0 && (
              <div className="pt-2 border-t border-dashed border-ink/20 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-stamp-red uppercase font-bold">Dropped Words:</span>
                {baselineResult.dropped_tokens.map((token, i) => (
                  <span
                    key={i}
                    className="line-through decoration-stamp-red decoration-2 text-ink-muted bg-stamp-red/5 px-1 py-0.2"
                  >
                    {token}
                  </span>
                ))}
              </div>
            )}

            {/* Unproven Price Cap Tag */}
            {baselineResult.is_unproven_cap && (
              <div className="pt-2 border-t border-dashed border-ink/20">
                <span className="inline-block border border-dashed border-ink text-ink font-bold px-2 py-0.5 text-[11px] uppercase tracking-wider bg-paper-dark">
                  [TAG: UNPROVEN] Loose price cap co-occurred; not proven parsed
                </span>
              </div>
            )}
          </div>

          {/* Observed Behavior Note */}
          <div className="text-xs font-serif text-ink-muted italic mb-4 border-l-2 border-ink/40 pl-2">
            {baselineResult.notes}
          </div>

          {/* Results List */}
          <div className="mt-auto space-y-2">
            <div className="text-[10px] font-mono uppercase text-ink font-bold flex justify-between">
              <span>Catalog Results Returned (Mocked):</span>
              <span className="text-ink-muted">Unsorted / No Rating Floor</span>
            </div>

            <div className="space-y-2">
              {baselineResult.matched_products.map((p) => (
                <div
                  key={p.id}
                  className="bg-paper border border-ink/40 p-2.5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="truncate pr-2">
                    <div className="font-bold text-ink truncate">{p.name}</div>
                    <div className="text-[11px] text-ink-muted">
                      {p.category} &bull; Rating: {p.rating}★
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-ink">Rs {p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: With an Understanding Layer */}
        <div className="bg-paper-light border-2 border-pen-blue p-5 shadow-ink-3 flex flex-col">
          <div className="border-b-2 border-pen-blue pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase bg-pen-blue text-paper px-1.5 py-0.5">
                PROPOSED FIX
              </span>
              <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-pen-blue mt-1">
                With Understanding Layer
              </h3>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-pen-blue border border-pen-blue px-2 py-0.5 uppercase">
                Active Parser
              </span>
            </div>
          </div>

          {/* Parsed Chips Box */}
          <div className="bg-paper border border-pen-blue/40 p-3 mb-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-pen-blue uppercase font-bold">Parsed Slot Chips:</span>
              {understandResult.context_inherited && (
                <span className="bg-pen-blue text-paper text-[10px] font-bold px-1.5 py-0.2 uppercase">
                  Context Inherited
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-pen-blue text-paper px-2 py-0.5 rounded-none font-bold uppercase text-[11px]">
                intent: {understandResult.parse.intent}
              </span>

              {understandResult.parse.product && (
                <span className="bg-paper-dark border border-ink text-ink px-2 py-0.5 font-bold text-[11px]">
                  product: {understandResult.parse.product}
                </span>
              )}

              {understandResult.parse.max_price && (
                <span className="bg-paper-dark border border-stamp-red text-stamp-red px-2 py-0.5 font-bold text-[11px]">
                  max_price: &le; Rs {understandResult.parse.max_price}
                </span>
              )}

              {understandResult.parse.sort && (
                <span className="bg-paper-dark border border-pen-blue text-pen-blue px-2 py-0.5 font-bold text-[11px]">
                  sort: {understandResult.parse.sort}
                </span>
              )}

              {understandResult.parse.min_rating && (
                <span className="bg-paper-dark border border-ink text-ink px-2 py-0.5 font-bold text-[11px]">
                  rating: &ge; {understandResult.parse.min_rating}★
                </span>
              )}

              {understandResult.parse.colour && (
                <span className="bg-paper-dark border border-ink text-ink px-2 py-0.5 font-bold text-[11px]">
                  colour: {understandResult.parse.colour}
                </span>
              )}

              {understandResult.parse.size && (
                <span className="bg-paper-dark border border-ink text-ink px-2 py-0.5 font-bold text-[11px]">
                  size: {understandResult.parse.size}
                </span>
              )}

              {understandResult.parse.occasion && (
                <span className="bg-paper-dark border border-ink text-ink px-2 py-0.5 font-bold text-[11px]">
                  occasion: {understandResult.parse.occasion}
                </span>
              )}
            </div>
          </div>

          {/* Active Applied Filters Description */}
          {understandResult.active_filters_description.length > 0 && (
            <div className="mb-4 text-xs font-mono text-pen-blue flex flex-wrap gap-x-2 gap-y-1">
              {understandResult.active_filters_description.map((f, i) => (
                <span key={i} className="inline-block bg-pen-blue/5 border-b border-pen-blue/30 px-1">
                  ✓ {f}
                </span>
              ))}
            </div>
          )}

          {/* Special Cards: Support or Off-Topic or Product Listing */}
          <div className="mt-auto space-y-2">
            {understandResult.support_card ? (
              /* Support Intent Screen Card */
              <div className="bg-paper border-2 border-pen-blue p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-pen-blue/30 pb-1.5">
                  <span className="font-mono text-xs font-bold uppercase text-pen-blue">
                    {understandResult.support_card.screen_name}
                  </span>
                  <span className="bg-pen-blue text-paper text-[10px] font-mono px-1.5 py-0.2 font-bold uppercase">
                    SUPPORT ROUTE
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold uppercase text-ink">
                  {understandResult.support_card.title}
                </h4>
                <p className="font-serif text-xs text-ink-muted">
                  {understandResult.support_card.description}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full bg-pen-blue text-paper font-mono text-xs font-bold uppercase py-2 border border-ink"
                  >
                    {understandResult.support_card.action_label} &rarr;
                  </button>
                </div>
              </div>
            ) : understandResult.off_topic_card ? (
              /* Off-topic Polite Refusal Card */
              <div className="bg-paper border-2 border-ink p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-ink/30 pb-1.5">
                  <span className="font-mono text-xs font-bold uppercase text-stamp-red">
                    Polite Off-Topic Guardrail
                  </span>
                  <span className="bg-stamp-red text-paper text-[10px] font-mono px-1.5 py-0.2 font-bold uppercase">
                    NON-SHOPPING
                  </span>
                </div>
                <p className="font-serif text-xs text-ink italic leading-relaxed">
                  "{understandResult.off_topic_card.message}"
                </p>
                <div className="pt-2 border-t border-dashed border-ink/20">
                  <div className="font-mono text-[10px] uppercase font-bold text-ink mb-1">
                    {understandResult.off_topic_card.suggestion_title}
                  </div>
                  <div className="flex flex-col gap-1">
                    {understandResult.off_topic_card.suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => executeQuery(s)}
                        className="text-left font-mono text-xs text-pen-blue hover:underline bg-paper-dark/50 px-2 py-1 border border-ink/20"
                      >
                        &bull; {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Normal Filtered & Sorted Product Cards */
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase text-ink font-bold flex justify-between">
                  <span>Filtered & Sorted Results:</span>
                  <span className="text-pen-blue font-bold">
                    {understandResult.matched_products.length} Products Met Constraints
                  </span>
                </div>

                {understandResult.matched_products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-paper border border-pen-blue p-2.5 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="truncate pr-2">
                      <div className="font-bold text-ink truncate">{p.name}</div>
                      <div className="text-[11px] text-ink-muted">
                        {p.category} &bull; Rating: {p.rating}★ &bull; {p.colour}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-pen-blue">Rs {p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Footer Label under demo */}
      <div className="mt-4 p-3 bg-paper-dark border border-ink text-center text-xs font-mono text-ink-muted">
        Behaviour reconstructed from my observations. Mock catalogue of 40 products. Not Meesho's data.
      </div>
    </section>
  );
};

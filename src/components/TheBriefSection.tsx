import React from 'react';

export const TheBriefSection: React.FC = () => {
  return (
    <section id="brief" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="border-b-2 border-ink pb-3 mb-8 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-ink-muted tracking-widest">
            SECTION 01 // CONTEXT
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink tracking-tight">
            The Bet vs. What a User Can Reach
          </h2>
        </div>
        <aside aria-label="Auditor margin note" className="font-hand text-pen-blue text-xl font-bold -rotate-1">
          Where is Vaani hiding?
        </aside>
      </div>

      <div className="prose font-serif text-ink text-base sm:text-lg mb-8 leading-relaxed">
        <p>
          Meesho publicly announced <strong className="font-bold">Vaani</strong>, a vernacular voice-first shopping assistant designed to dismantle literacy and language barriers for India’s next wave of digital consumers. Yet on my freshly updated production app, I could not find any dedicated Vaani entry point or conversational assistant widget.
        </p>
        <p className="mt-3">
          To understand what a voice-first shopper actually encounters in production today, I audited the only reachable voice pathway: <span className="highlight-line font-semibold">phone keyboard voice dictation directly into Meesho’s standard search bar</span>.
        </p>
      </div>

      {/* Three Exhibit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Exhibit A */}
        <div className="relative bg-paper-light border border-ink p-5 shadow-ink-3 card-fade-up">
          <div className="absolute -top-3 left-4 bg-ink text-paper text-xs font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
            Exhibit A
          </div>
          <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-ink mt-2 mb-2">
            The Claim
          </h3>
          <p className="font-serif text-sm text-ink-muted leading-relaxed">
            High-profile announcements pitched <em>Vaani</em> as an intuitive vernacular voice interface capable of interpreting colloquial Hindi dialects, negotiating intent, and driving hands-free discovery.
          </p>
          <div className="mt-4 pt-3 border-t border-dashed border-ink/30 text-xs font-mono text-pen-blue font-bold">
            PROMISE: Voice-first conversational commerce
          </div>
        </div>

        {/* Exhibit B */}
        <div className="relative bg-paper-light border border-ink p-5 shadow-ink-3 card-fade-up">
          <div className="absolute -top-3 left-4 bg-stamp-red text-paper text-xs font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
            Exhibit B
          </div>
          <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-ink mt-2 mb-2">
            The Missing Entry Point
          </h3>
          <p className="font-serif text-sm text-ink-muted leading-relaxed">
            Across home screens, category tabs, and search headers, no separate Vaani microphone trigger, floating agent pill, or interactive voice persona was present on the test device.
          </p>
          <div className="mt-4 pt-3 border-t border-dashed border-ink/30 text-xs font-mono text-stamp-red font-bold">
            REALITY: No independent assistant UI accessible
          </div>
        </div>

        {/* Exhibit C */}
        <div className="relative bg-paper-light border border-ink p-5 shadow-ink-3 card-fade-up">
          <div className="absolute -top-3 left-4 bg-pen-blue text-paper text-xs font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
            Exhibit C
          </div>
          <h3 className="font-heading font-bold text-xl uppercase tracking-tight text-ink mt-2 mb-2">
            The Fallback Tested
          </h3>
          <p className="font-serif text-sm text-ink-muted leading-relaxed">
            Users naturally tap the microphone icon on Gboard to dictate spoken queries straight into Meesho’s universal search input. This unbuffered pass-through is what this audit tests.
          </p>
          <div className="mt-4 pt-3 border-t border-dashed border-ink/30 text-xs font-mono text-ink font-bold">
            AUDIT SCOPE: Gboard dictation into search bar
          </div>
        </div>
      </div>
    </section>
  );
};

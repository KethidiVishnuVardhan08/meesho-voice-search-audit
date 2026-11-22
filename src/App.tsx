import scoresData from '../data/scores.json';
import catalogData from '../data/catalog.json';
import evalsDataRaw from '../data/evals.json';

import { ScoreItem, Product, EvalsData } from './engine/types';
import { StickyHeader } from './components/StickyHeader';
import { CoverSection } from './components/CoverSection';
import { TheBriefSection } from './components/TheBriefSection';
import { ScoreboardSection } from './components/ScoreboardSection';
import { ExhibitsGallery } from './components/ExhibitsGallery';
import { ReRunDemoSection } from './components/ReRunDemoSection';
import { FailureTypesSection } from './components/FailureTypesSection';
import { EvalsSection } from './components/EvalsSection';
import { RemedySection } from './components/RemedySection';
import { MethodSection } from './components/MethodSection';
import { Footer } from './components/Footer';

const scores = scoresData as ScoreItem[];
const catalog = catalogData as Product[];
const evalsData = evalsDataRaw as EvalsData;

export function App() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-serif selection:bg-highlighter-yellow selection:text-ink">
      {/* Sticky top bar with CASE 002 and anchor links */}
      <StickyHeader />

      {/* Main Single-Scroll Evidence Dossier */}
      <main className="flex-1 w-full space-y-4">
        {/* Section 1: Cover Folder */}
        <CoverSection scores={scores} />

        {/* Divider */}
        <div className="max-w-4xl mx-auto px-6">
          <hr className="border-t-2 border-dashed border-ink/30" />
        </div>

        {/* Section 2: The Brief (The bet vs what a user can reach) */}
        <TheBriefSection />

        <div className="max-w-4xl mx-auto px-6">
          <hr className="border-t-2 border-dashed border-ink/30" />
        </div>

        {/* Section 3: Scoreboard (Big mono numbers, Per-group table A to G) */}
        <ScoreboardSection scores={scores} />

        <div className="max-w-4xl mx-auto px-6">
          <hr className="border-t-2 border-dashed border-ink/30" />
        </div>

        {/* Section 4: Exhibits Gallery (Real screenshots, verdict stamps, lightbox) */}
        <ExhibitsGallery scores={scores} />

        <div className="max-w-4xl mx-auto px-6">
          <hr className="border-t-2 border-dashed border-ink/30" />
        </div>

        {/* Section 5: Re-run It: Interactive Proving Ground */}
        <ReRunDemoSection catalog={catalog} />

        <div className="max-w-4xl mx-auto px-6">
          <hr className="border-t-2 border-dashed border-ink/30" />
        </div>

        {/* Section 6: Failure Types (F1 to F5 index cards) */}
        <FailureTypesSection />

        <div className="max-w-4xl mx-auto px-6">
          <hr className="border-t-2 border-dashed border-ink/30" />
        </div>

        {/* Section 7: Evals (Recharts grouped bars with diagonal hatching vs solid ink) */}
        <EvalsSection evalsData={evalsData} />

        <div className="max-w-4xl mx-auto px-6">
          <hr className="border-t-2 border-dashed border-ink/30" />
        </div>

        {/* Section 8: The Remedy (Engineering Memo, PRD, RICE Table) */}
        <RemedySection />

        <div className="max-w-4xl mx-auto px-6">
          <hr className="border-t-2 border-dashed border-ink/30" />
        </div>

        {/* Section 9: Method and Limits */}
        <MethodSection />
      </main>

      {/* Section 10: Footer */}
      <Footer />
    </div>
  );
}

export default App;

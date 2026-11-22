import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { EvalsData } from '../engine/types';

interface EvalsSectionProps {
  evalsData: EvalsData;
}

export const EvalsSection: React.FC<EvalsSectionProps> = ({ evalsData }) => {
  const isPlaceholder = evalsData.status === 'PLACEHOLDER';

  const chartData = evalsData.metrics.map((m) => ({
    name: m.name,
    shortName:
      m.key === 'sort_rating'
        ? 'Sort & Rating'
        : m.key === 'follow_up'
        ? 'Follow-Up'
        : m.key === 'intent_routing'
        ? 'Intent Routing'
        : m.key === 'support_offtopic'
        ? 'Support Handled'
        : 'Overall Pass',
    baseline: m.baseline_pct,
    fix: m.fix_pct,
    baseline_n: m.baseline_n,
    baseline_total: m.baseline_total,
    fix_n: m.fix_n,
    fix_total: m.fix_total,
  }));

  return (
    <section id="evals" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="border-b-2 border-ink pb-3 mb-8 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs uppercase font-bold text-ink-muted tracking-widest">
            SECTION 06 // SYSTEM BENCHMARKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-ink tracking-tight">
            Evals: Baseline vs. Understand Layer
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isPlaceholder ? (
            <span className="bg-stamp-red/10 border-2 border-stamp-red text-stamp-red font-mono font-bold text-xs px-2.5 py-0.5 uppercase tracking-wider">
              [STATUS: PLACEHOLDER]
            </span>
          ) : (
            <span className="bg-ink text-paper font-mono font-bold text-xs px-2.5 py-0.5 uppercase tracking-wider">
              [VERIFIED BENCHMARK]
            </span>
          )}
        </div>
      </div>

      <div className="prose font-serif text-ink text-sm sm:text-base mb-6">
        <p>
          Quantitative evaluation across all 28 audit test cases comparing the observed baseline pass-through against the client-side understanding layer.
          Bars use <strong className="font-mono text-xs uppercase font-bold">diagonal hatching for baseline</strong> and <strong className="font-mono text-xs uppercase font-bold">solid ink for fix</strong> to ensure data accessibility without relying on color alone.
        </p>
      </div>

      {/* Recharts Grouped Bars Container */}
      <div className="bg-paper-light border-2 border-ink p-4 sm:p-6 shadow-ink-3 mb-8">
        <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-ink/30 text-xs font-mono gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border border-ink bg-[radial-gradient(#15130F_1.5px,transparent_1.5px)] [background-size:5px_5px]" />
              <span className="font-bold text-ink uppercase">Baseline (Observed)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-ink border border-ink" />
              <span className="font-bold text-ink uppercase">With Fix (Understood)</span>
            </div>
          </div>
          <div className="text-ink-muted">
            {evalsData.generated_at ? `Evaluated: ${evalsData.generated_at}` : 'Awaiting run_evals execution'}
          </div>
        </div>

        {/* Chart with SVG Pattern Defs */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
              barGap={6}
            >
              <defs>
                <pattern
                  id="baselineDiagonalHatch"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#15130F" strokeWidth="2.5" />
                </pattern>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#15130F" opacity={0.15} vertical={false} />

              <XAxis
                dataKey="shortName"
                tick={{ fill: '#15130F', fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600 }}
                tickLine={{ stroke: '#15130F' }}
                axisLine={{ stroke: '#15130F', strokeWidth: 1.5 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={50}
              />

              <YAxis
                unit="%"
                domain={[0, 100]}
                tick={{ fill: '#15130F', fontFamily: 'IBM Plex Mono', fontSize: 11 }}
                tickLine={{ stroke: '#15130F' }}
                axisLine={{ stroke: '#15130F', strokeWidth: 1.5 }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-paper border-2 border-ink p-3 shadow-ink-3 font-mono text-xs space-y-1">
                        <div className="font-bold text-ink border-b border-ink/30 pb-1">{data.name}</div>
                        <div className="text-ink">
                          Baseline: <span className="font-bold">{data.baseline}%</span> ({data.baseline_n}/{data.baseline_total})
                        </div>
                        <div className="text-pen-blue font-bold">
                          With Fix: <span>{data.fix}%</span> ({data.fix_n}/{data.fix_total})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Baseline Bar with Diagonal Hatching */}
              <Bar
                dataKey="baseline"
                name="Baseline"
                fill="url(#baselineDiagonalHatch)"
                stroke="#15130F"
                strokeWidth={1.5}
              >
                <LabelList
                  dataKey="baseline"
                  position="top"
                  formatter={(val: number) => `${val}%`}
                  style={{ fill: '#15130F', fontFamily: 'IBM Plex Mono', fontSize: 10, fontWeight: 700 }}
                />
              </Bar>

              {/* Fix Bar with Solid Ink */}
              <Bar
                dataKey="fix"
                name="With Fix"
                fill="#15130F"
                stroke="#15130F"
                strokeWidth={1.5}
              >
                <LabelList
                  dataKey="fix"
                  position="top"
                  formatter={(val: number) => `${val}%`}
                  style={{ fill: '#15130F', fontFamily: 'IBM Plex Mono', fontSize: 10, fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Counts Table Below Chart */}
      <div className="bg-paper-light border-2 border-ink shadow-ink-3 overflow-hidden">
        <div className="p-3 bg-paper-dark border-b border-ink font-mono text-xs uppercase font-bold text-ink flex items-center justify-between">
          <span>Exact Evaluation Counts Ledger (n of N)</span>
          <span className="text-ink-muted">Read from /data/evals.json</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
            <thead>
              <tr className="border-b border-ink/40 bg-paper/60 text-ink-muted">
                <th className="py-2.5 px-4 font-bold uppercase">Metric</th>
                <th className="py-2.5 px-3 font-bold uppercase text-center">Baseline (n/N)</th>
                <th className="py-2.5 px-3 font-bold uppercase text-center">Baseline %</th>
                <th className="py-2.5 px-3 font-bold uppercase text-center text-pen-blue">Fix (n/N)</th>
                <th className="py-2.5 px-3 font-bold uppercase text-center text-pen-blue">Fix %</th>
                <th className="py-2.5 px-3 font-bold uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/20">
              {evalsData.metrics.map((m) => (
                <tr key={m.key} className="hover:bg-paper/40 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-ink">{m.name}</td>
                  <td className="py-2.5 px-3 text-center">
                    {m.baseline_n} of {m.baseline_total}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-stamp-red">
                    {m.baseline_pct}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-pen-blue">
                    {m.fix_n} of {m.fix_total}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-pen-blue">
                    {m.fix_pct}%
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 uppercase ${
                        isPlaceholder
                          ? 'border border-stamp-red text-stamp-red bg-stamp-red/5'
                          : 'bg-ink text-paper'
                      }`}
                    >
                      {evalsData.status}
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

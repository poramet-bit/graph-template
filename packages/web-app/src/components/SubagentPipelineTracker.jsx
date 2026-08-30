import React from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, Database, FileCheck } from 'lucide-react';

export function SubagentPipelineTracker({ steps = [], isRunning, activeStep }) {
  if (!steps.length && !isRunning) return null;

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sub-Agent Pipeline Telemetry</span>
        </div>
        {isRunning ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        )}
      </div>

      {/* Step List */}
      <div className="space-y-2 text-xs">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 transition-all"
          >
            <div className="mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-200">{s.title}</span>
                <span className="font-mono text-[10px] text-slate-500">+{s.elapsedMs}ms</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BarChart3, PieChart, Activity, Layers, Code, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { Widget } from '@poramet-bit/dashboard-widgets';

export function ChartSpecRenderer({ spec, isGenerating, onInspectSchema }) {
  const [copied, setCopied] = useState(false);

  const handleCopySpec = () => {
    if (!spec) return;
    navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getChartIcon = (type) => {
    switch (type) {
      case 'bar': return <BarChart3 className="w-4 h-4 text-indigo-400" />;
      case 'pie': return <PieChart className="w-4 h-4 text-teal-400" />;
      case 'gauge': return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'stacked_bar': return <Layers className="w-4 h-4 text-purple-400" />;
      default: return <BarChart3 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="glow-card p-6 h-full flex flex-col justify-between">
      <div>
        {/* Output 2 Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              {spec ? getChartIcon(spec.type) : <BarChart3 className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Output 2: Sub-Agent Graph Visualization</h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {spec ? `Type: ${spec.type} (schema-validated)` : 'Waiting for Sub-Agent...'}
              </span>
            </div>
          </div>

          {/* Actions Toolbar */}
          {spec && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopySpec}
                title="Copy Graph Spec JSON"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => onInspectSchema && onInspectSchema(spec)}
                title="Inspect JSON Spec & Schema Contract"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer border border-slate-700"
              >
                <Code className="w-3 h-3" />
                <span>JSON Spec</span>
              </button>
            </div>
          )}
        </div>

        {/* Rendered Chart Area */}
        <div className="min-h-[340px] flex items-center justify-center">
          {isGenerating ? (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Sub-Agent กำลังสังเคราะห์ Graph Spec...</p>
              <p className="text-xs text-slate-500">Decomposing & Validating Schema JSON</p>
            </div>
          ) : spec ? (
            <div className="w-full">
              {/* Pass data prop cleanly to Widget component */}
              <Widget widget={{ size: 'full', data: spec }} />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              ไม่มีข้อมูลกราฟ — กรุณาส่งคำถามเพื่อเริ่มต้นวิเคราะห์
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>🤖 Output 2 rendered dynamically via Component Props</span>
        <span className="font-mono text-emerald-400">Validated: {spec ? `${spec.type}.schema.json` : '--'}</span>
      </div>
    </div>
  );
}

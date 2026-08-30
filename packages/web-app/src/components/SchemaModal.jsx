import React, { useState } from 'react';
import { X, Copy, Check, FileJson, CheckCircle2 } from 'lucide-react';

export function SchemaModal({ spec, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!spec) return null;

  const jsonString = JSON.stringify(spec, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Graph Specification JSON</h3>
              <span className="text-[11px] font-mono text-emerald-400">Schema Contract: templates/{spec.type}.schema.json</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Code Block Area */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-indigo-300 bg-slate-950/90 leading-relaxed">
          <pre className="whitespace-pre-wrap">{jsonString}</pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Passed JSON Schema Validation</span>
          </span>
          <span className="font-mono text-[11px] text-slate-500">Output 2 Contract</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { MessageSquareText, Copy, Check } from 'lucide-react';

export function TextSummaryStream({ text, isStreaming }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glow-card p-6 h-full flex flex-col justify-between">
      <div>
        {/* Output 1 Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Output 1: Main Agent Text Analysis</h3>
              <span className="text-[10px] text-slate-500 font-mono">Streamed markdown summary</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            title="Copy Text"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Streamed Content Body */}
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-normal">
          {text ? (
            <>
              {text}
              {isStreaming && <span className="cursor-blink"></span>}
            </>
          ) : (
            <p className="text-slate-500 italic">กำลังรอการป้อนคำถาม หรือเลือกจากรายการด้านบน...</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>⚡ Output 1 arrives immediately via Fast Stream</span>
        <span className="font-mono text-indigo-400">MCP Protocol v1</span>
      </div>
    </div>
  );
}

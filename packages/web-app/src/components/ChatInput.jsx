import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { getPresetQueries } from '../services/ai-service';

export function ChatInput({ onSend, isProcessing }) {
  const [inputVal, setInputVal] = useState('');
  const presets = getPresetQueries();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;
    onSend(inputVal.trim());
  };

  const handleSelectPreset = (p) => {
    if (isProcessing) return;
    setInputVal(p.query);
    onSend(p.query);
  };

  return (
    <div className="w-full space-y-3">
      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>แนะนำ:</span>
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isProcessing}
            onClick={() => handleSelectPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 whitespace-nowrap transition-all cursor-pointer disabled:opacity-50 text-xs font-medium shadow-2xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Chat Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isProcessing}
            placeholder="พิมพ์คำถามวิเคราะห์งบประมาณ เช่น 'ขอดู 5 อันดับโครงการที่ใช้เงินเยอะสุด' หรือ 'สัดส่วนตามพันธกิจ'..."
            className="w-full pl-5 pr-14 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isProcessing}
            className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-950/50"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

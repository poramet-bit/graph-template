import React from 'react';
import { LayoutDashboard, MessageSquareText, FileCode2, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export function Header({ activeTab, onTabChange, isProcessing, totalRecords }) {
  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-900/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Prompt Paladins</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full font-mono">
                  Dual-Output v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">Smart Intelligence Budget Analysis & Sub-Agent Graph Engine</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => onTabChange('dual-output')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'dual-output'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Dual-Output Chat</span>
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>All Widgets Grid</span>
            </button>
          </div>

          {/* Status Indicators */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sub-Agent Ready</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{totalRecords || 38} Projects</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

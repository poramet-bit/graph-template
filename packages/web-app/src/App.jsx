import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DualOutputView } from './components/DualOutputView';
import { DashboardGridView } from './components/DashboardGridView';
import { SchemaModal } from './components/SchemaModal';
import { executeDualOutputQuery, budgetData } from './services/ai-service';

export function App() {
  const [activeTab, setActiveTab] = useState('dual-output');
  const [query, setQuery] = useState('ขอดูโครงการที่ใช้งบประมาณเยอะที่สุด 5 อันดับแรก');
  
  // Dual-Output States
  const [textSummary, setTextSummary] = useState('');
  const [isStreamingText, setIsStreamingText] = useState(false);
  const [subagentSteps, setSubagentSteps] = useState([]);
  const [isGeneratingGraph, setIsGeneratingGraph] = useState(false);
  const [graphSpec, setGraphSpec] = useState(null);
  
  // Modal State
  const [inspectSpec, setInspectSpec] = useState(null);

  const handleRunQuery = async (userQuery) => {
    setQuery(userQuery);
    setTextSummary('');
    setIsStreamingText(true);
    setSubagentSteps([]);
    setIsGeneratingGraph(true);
    setGraphSpec(null);

    try {
      const result = await executeDualOutputQuery(
        userQuery,
        (chunk, isDone) => {
          setTextSummary(chunk);
          if (isDone) setIsStreamingText(false);
        },
        (stepEvt) => {
          setSubagentSteps((prev) => [...prev, stepEvt]);
        }
      );

      setGraphSpec(result.spec);
    } catch (err) {
      console.error('Dual-output error:', err);
    } finally {
      setIsStreamingText(false);
      setIsGeneratingGraph(false);
    }
  };

  // Run initial query on mount
  useEffect(() => {
    handleRunQuery('ขอดูโครงการที่ใช้งบประมาณเยอะที่สุด 5 อันดับแรก');
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isProcessing={isStreamingText || isGeneratingGraph}
        totalRecords={budgetData.rows?.length || 38}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dual-output' ? (
          <DualOutputView
            query={query}
            onSendQuery={handleRunQuery}
            textSummary={textSummary}
            isStreamingText={isStreamingText}
            subagentSteps={subagentSteps}
            isGeneratingGraph={isGeneratingGraph}
            graphSpec={graphSpec}
            onInspectSchema={(spec) => setInspectSpec(spec)}
          />
        ) : (
          <DashboardGridView
            onInspectSchema={(spec) => setInspectSpec(spec)}
          />
        )}
      </main>

      {/* Schema & JSON Inspection Modal */}
      {inspectSpec && (
        <SchemaModal
          spec={inspectSpec}
          onClose={() => setInspectSpec(null)}
        />
      )}

      {/* Modern Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="font-semibold text-slate-400">Prompt Paladins</span>
            <span>— Smart Intelligence Budget Analysis & Sub-Agent Graph Engine</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            <span>React 18 Component Base</span>
            <span>•</span>
            <span>Sub-Agent Graph Engine</span>
            <span>•</span>
            <span>JSON Schema Contracts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

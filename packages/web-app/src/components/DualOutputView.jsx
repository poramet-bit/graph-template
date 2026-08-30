import React from 'react';
import { TextSummaryStream } from './TextSummaryStream';
import { SubagentPipelineTracker } from './SubagentPipelineTracker';
import { ChartSpecRenderer } from './ChartSpecRenderer';
import { ChatInput } from './ChatInput';

export function DualOutputView({
  query,
  onSendQuery,
  textSummary,
  isStreamingText,
  subagentSteps,
  isGeneratingGraph,
  graphSpec,
  onInspectSchema
}) {
  return (
    <div className="space-y-6">
      {/* Chat & Preset Query Section */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl">
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-white tracking-tight">AI Assistant & Sub-Agent Graph Query</h2>
          <p className="text-xs text-slate-400 mt-1">
            พิมพ์คำถามวิเคราะห์งบประมาณ หรือคลิก Preset ด้านล่างเพื่อส่งคำถามเข้าสู่ Dual-Output Pipeline
          </p>
        </div>
        <ChatInput onSend={onSendQuery} isProcessing={isStreamingText || isGeneratingGraph} />
      </div>

      {/* Telemetry Pipeline Tracker (shows when subagent is active or has steps) */}
      {subagentSteps.length > 0 && (
        <SubagentPipelineTracker steps={subagentSteps} isRunning={isGeneratingGraph} />
      )}

      {/* Dual Output Grid: Left (Output 1 Text Stream), Right (Output 2 Graph Spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Output 1 (Text Stream from Main Agent) */}
        <div className="lg:col-span-5">
          <TextSummaryStream text={textSummary} isStreaming={isStreamingText} />
        </div>

        {/* Right: Output 2 (Sub-Agent Graph Spec & Chart Render) */}
        <div className="lg:col-span-7">
          <ChartSpecRenderer
            spec={graphSpec}
            isGenerating={isGeneratingGraph}
            onInspectSchema={onInspectSchema}
          />
        </div>
      </div>
    </div>
  );
}

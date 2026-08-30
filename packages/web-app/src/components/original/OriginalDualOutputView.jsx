import React, { useState } from 'react';
import { OriginalStepper } from './OriginalStepper';
import { OriginalBarChart } from './OriginalBarChart';
import { OriginalDonutChart } from './OriginalDonutChart';
import { OriginalLineChart } from './OriginalLineChart';
import { OriginalGaugeChart } from './OriginalGaugeChart';
import { OriginalStackedBarChart } from './OriginalStackedBarChart';
import { Send, Loader2 } from 'lucide-react';

function fmtCurrency(n) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n);
}

export const ORIGINAL_PIPELINE_BY_TYPE = {
  bar: [
    { key: "s1", label: "Subagent 1", detail: "ดึงรายชื่อโครงการ (get_projects)" },
    { key: "s2", label: "Subagent 2", detail: "สรุปงบประมาณ (get_budget_summary)" },
    { key: "s3", label: "Subagent 3", detail: "หา Top N งบสูงสุด (get_top_projects)" },
  ],
  pie: [
    { key: "s1", label: "Subagent 1", detail: "ดึงรายชื่อโครงการ (get_projects)" },
    { key: "s2", label: "Subagent 2", detail: "สรุปงบประมาณ (get_budget_summary)" },
    { key: "s3", label: "Subagent 3", detail: "แบ่งตามภารกิจ (get_category_breakdown)" },
  ],
  line: [
    { key: "s1", label: "Subagent 1", detail: "ดึงรายชื่อโครงการ (get_projects)" },
    { key: "s2", label: "Subagent 2", detail: "เรียงตามรหัสโครงการ (sort_by_code)" },
    { key: "s3", label: "Subagent 3", detail: "สะสมยอดใช้จ่าย (get_cumulative_trend)" },
  ],
  area: [
    { key: "s1", label: "Subagent 1", detail: "ดึงรายชื่อโครงการ (get_projects)" },
    { key: "s2", label: "Subagent 2", detail: "เรียงตามรหัสโครงการ (sort_by_code)" },
    { key: "s3", label: "Subagent 3", detail: "สะสมยอดใช้จ่าย (get_cumulative_trend)" },
  ],
  gauge: [
    { key: "s1", label: "Subagent 1", detail: "ดึงงบต้นปีรวม (get_total_planned)" },
    { key: "s2", label: "Subagent 2", detail: "ดึงงบใช้จริงรวม (get_total_actual)" },
    { key: "s3", label: "Subagent 3", detail: "คำนวณอัตราเบิกจ่าย (calc_disbursement_rate)" },
  ],
  stacked_bar: [
    { key: "s1", label: "Subagent 1", detail: "ดึงรายชื่อโครงการ (get_projects)" },
    { key: "s2", label: "Subagent 2", detail: "จัดกลุ่มตามพันธกิจ (group_by_mission)" },
    { key: "s3", label: "Subagent 3", detail: "คำนวณงบใช้ไปและคงเหลือ (calc_used_and_remaining)" },
  ]
};

export function OriginalDualOutputView({
  stage = 4,
  pipelineStep = 3,
  query,
  onSendQuery,
  textSummary,
  isStreamingText,
  graphSpec,
  isGeneratingGraph,
  totalPlanned = 5427570,
  totalActual = 4993614.25,
  peakName = "โครงการบูรณาการเทคโนโลยีโบราณดาราศาสตร์ฯ กว๊านพะเยา",
  peakActual = 990000,
  overrunName = "ทุนสนับสนุนการวิจัย",
  overrunPct = 79
}) {
  const [customInput, setCustomInput] = useState('');
  const chartType = graphSpec ? graphSpec.type : 'bar';
  const pipeline = ORIGINAL_PIPELINE_BY_TYPE[chartType] || ORIGINAL_PIPELINE_BY_TYPE.bar;
  const schemaFile = `${chartType}_chart.schema.json`;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim() || isStreamingText || isGeneratingGraph) return;
    onSendQuery(customInput.trim());
    setCustomInput('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-white mb-1">
          งบประมาณคณะ ICT ปีงบประมาณ 2569 — dual output flow ({chartType})
        </h1>
        <p className="subtitle text-xs text-slate-400">
          User → Go Backend (MCP orchestrator) → MCP Server → Subagent (graph engine) → Frontend: สอง output คู่ขนาน (streaming text + subagent graph)
        </p>
      </div>

      {/* Query Selection & Input Bar */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-1)] space-y-3">
        {/* Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold whitespace-nowrap">ตัวอย่างคำถาม:</span>
          <button
            onClick={() => onSendQuery("ขอดูโครงการที่ใช้งบประมาณเยอะที่สุด 5 อันดับแรก")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
              chartType === 'bar' ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' : 'bg-[#0d0d0d] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            🏆 Bar (Top 5 Spenders)
          </button>

          <button
            onClick={() => onSendQuery("สัดส่วนการใช้งบประมาณแยกตามพันธกิจ")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
              chartType === 'pie' ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' : 'bg-[#0d0d0d] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            🥧 Pie / Donut (สัดส่วนตามพันธกิจ)
          </button>

          <button
            onClick={() => onSendQuery("แนวโน้มการเบิกจ่ายงบประมาณสะสมรายโครงการ")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
              chartType === 'line' || chartType === 'area' ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' : 'bg-[#0d0d0d] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            📈 Line / Area (ยอดเบิกจ่ายสะสม)
          </button>

          <button
            onClick={() => onSendQuery("อัตราการเบิกจ่ายงบประมาณของคณะเป็นกี่เปอร์เซ็นต์")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
              chartType === 'gauge' ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' : 'bg-[#0d0d0d] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            ⚡ Gauge (% อัตราเบิกจ่าย)
          </button>

          <button
            onClick={() => onSendQuery("เปรียบเทียบงบประมาณที่ใช้ไปและงบคงเหลือ")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
              chartType === 'stacked_bar' ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' : 'bg-[#0d0d0d] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            📊 Stacked Bar (ใช้ไป vs คงเหลือ)
          </button>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={isStreamingText || isGeneratingGraph}
            placeholder="หรือพิมพ์คำถามอิสระ เช่น 'ขอดูโครงการที่ใช้งบเกิน 200,000 บาท'..."
            className="flex-1 px-4 py-2 bg-[#0d0d0d] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!customInput.trim() || isStreamingText || isGeneratingGraph}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isStreamingText || isGeneratingGraph ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>ส่งคำถาม</span>
          </button>
        </form>
      </div>

      {/* 5-Stage Stepper Component */}
      <OriginalStepper stage={stage} />

      {/* Output 1: MCP Prompt Output (Full Width Panel) */}
      <div className="panel w-full">
        <div className="panel-head">
          <span className="panel-badge" style={{ background: "var(--series-1)" }}>1</span>
          <span className="panel-title">MCP Prompt Output</span>
        </div>
        <p className="panel-sub">Streaming text — Line 1 (MCP Output Stream)</p>

        {!textSummary && isStreamingText ? (
          <div className="loading"><span className="spinner" /> รอ MCP server ส่งข้อมูล...</div>
        ) : (
          <div className="stream-box">
            {textSummary}
            {isStreamingText && <span className="cursor" />}
          </div>
        )}
      </div>

      {/* Output 2: Subagent Graph View (Full Width Panel — แสดงกราฟเต็มจอ ไม่หั่นครึ่ง) */}
      <div className="panel w-full">
        <div className="panel-head">
          <span className="panel-badge" style={{ background: "var(--brand)" }}>2</span>
          <span className="panel-title">Subagent Graph View</span>
        </div>
        <p className="panel-sub">React graph — Line 2 (Graph View Stream), มาหลัง Output 1 เพราะรอ subagent ประมวลผล</p>

        {isGeneratingGraph && !graphSpec ? (
          <div className="loading"><span className="spinner" /> sub agent กำลังสร้างกราฟ...</div>
        ) : (
          <React.Fragment>
            {/* 3 Subagent Pipeline boxes */}
            <div className="pipeline-row">
              {pipeline.map((p, i) => (
                <div key={p.key} className={"pipe-box" + (pipelineStep >= i ? " lit" : "")}>
                  <span className="pipe-name">{p.label}</span>
                  {p.detail}
                </div>
              ))}
            </div>

            {/* Single aggregate box */}
            <div
              className="pipe-single"
              style={{
                opacity: pipelineStep >= 3 ? 1 : 0.45,
                borderColor: pipelineStep >= 3 ? "var(--brand)" : "var(--border)",
                fontWeight: pipelineStep >= 3 ? 600 : 400
              }}
            >
              {pipelineStep >= 3 ? "✓ " : ""}Aggregate Results → Generate Chart Spec ({schemaFile})
            </div>

            {/* Rendered Full-Width Chart */}
            {graphSpec ? (
              <div className="w-full pt-2">
                {chartType === 'bar' && <OriginalBarChart chart={graphSpec} />}
                {chartType === 'pie' && <OriginalDonutChart chart={graphSpec} />}
                {(chartType === 'line' || chartType === 'area') && <OriginalLineChart chart={graphSpec} />}
                {chartType === 'gauge' && <OriginalGaugeChart chart={graphSpec} />}
                {chartType === 'stacked_bar' && <OriginalStackedBarChart chart={graphSpec} />}

                {/* Summary List */}
                <div className="summary-list mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>Total Projects: <b>38 โครงการ</b></div>
                  <div>Total Budget (planned): <b>฿{fmtCurrency(totalPlanned)}</b></div>
                  <div>Total Budget (used): <b>฿{fmtCurrency(totalActual)}</b></div>
                  {overrunName && <div>Peak Overrun: <b>{overrunName}</b> (+{overrunPct}%)</div>}
                </div>
              </div>
            ) : (
              <div className="loading"><span className="spinner" /> sub agent กำลังสร้างกราฟ...</div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

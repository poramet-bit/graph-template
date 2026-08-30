import React from 'react';

export const STAGES = [
  { key: "frontend_req", label: "Frontend", sub: "ส่งคำถาม" },
  { key: "backend", label: "Go Backend", sub: "MCP orchestrator" },
  { key: "mcp", label: "MCP Server", sub: "คืนข้อมูล" },
  { key: "subagent", label: "Subagent", sub: "สร้างกราฟ" },
  { key: "result", label: "Frontend", sub: "แสดงผลคู่" },
];

export function OriginalStepper({ stage }) {
  return (
    <div className="stepper">
      {STAGES.map((s, i) => (
        <div key={s.key} className={"step " + (i < stage ? "done" : i === stage ? "active" : "")}>
          <span className="step-dot" />
          <span className="step-label">{s.label}</span>
          <span className="step-sub">{s.sub}</span>
        </div>
      ))}
    </div>
  );
}

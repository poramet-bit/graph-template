import React from "react";
import { fmtValue } from "./utils.js";

export function StatCard({ d }) {
  const iconBg = { good: "var(--good-soft)", warning: "var(--warning-soft)", critical: "var(--critical-soft)", neutral: "var(--accent-soft)" };
  const iconColor = { good: "var(--good)", warning: "var(--warning)", critical: "var(--critical)", neutral: "var(--accent)" };
  const status = d.status || "neutral";
  const arrow = d.trend ? ({ up: "▲ ", down: "▼ ", flat: "● " }[d.trend.direction] || "") : "";
  return (
    <div className="card kpi-card">
      <div className="kpi-top">
        <div>
          <div className="kpi-label">{d.label}</div>
          <div className="kpi-value">{fmtValue(d.value, d.format)}</div>
        </div>
        {d.icon && <div className="kpi-icon" style={{ background: iconBg[status], color: iconColor[status] }}>{d.icon}</div>}
      </div>
      {d.trend && <div className={"kpi-trend " + status}>{arrow}{d.trend.label}</div>}
    </div>
  );
}

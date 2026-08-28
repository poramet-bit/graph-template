import React, { useState } from "react";
import { fmtCompact } from "./utils.js";

export function Donut({ d }) {
  const [hover, setHover] = useState(null);
  const ds = d.datasets[0];
  const cats = d.labels.map((label, i) => ({ label, value: ds.data[i], color: (ds.backgroundColor && ds.backgroundColor[i]) || "var(--accent)" }));
  const total = cats.reduce((s, c) => s + c.value, 0);
  const r = 62, cx = 92, cy = 92, strokeW = 22, circ = 2 * Math.PI * r, gapPx = 2;

  let cumulative = 0;
  const segments = cats.map((c, i) => {
    const frac = total > 0 ? c.value / total : 0;
    const len = Math.max(frac * circ - gapPx, 0);
    const seg = { len, dashoffset: -cumulative * circ, color: c.color, i };
    cumulative += frac;
    return seg;
  });

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 184 184" width="184" height="184" role="img" aria-label={`${d.title}: total ${fmtCompact(total)}`}>
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gridline)" strokeWidth={strokeW} />
          {segments.map(s => (
            <circle key={s.i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={strokeW}
              strokeDasharray={`${s.len} ${circ - s.len}`} strokeDashoffset={s.dashoffset}
              opacity={hover === null || hover === s.i ? 1 : 0.32}
              onMouseEnter={() => setHover(s.i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer", transition: "opacity 0.15s" }} />
          ))}
        </g>
        <text x={cx} y={cy - 3} textAnchor="middle" className="donut-center" fill="var(--text-primary)">{fmtCompact(hover === null ? total : cats[hover].value)}</text>
        <text x={cx} y={cy + 13} textAnchor="middle" className="donut-center-label axis-label">{hover === null ? ds.label : cats[hover].label}</text>
      </svg>
      <div className="legend" style={{ justifyContent: "center", marginTop: 6 }}>
        {cats.map((c, i) => (
          <div className="legend-item" key={c.label} style={{ cursor: "pointer", opacity: hover === null || hover === i ? 1 : 0.5 }} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="swatch round" style={{ background: c.color }} />{c.label} ({total > 0 ? (c.value / total * 100).toFixed(0) : 0}%)
          </div>
        ))}
      </div>
    </div>
  );
}

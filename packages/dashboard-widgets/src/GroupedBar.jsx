import React, { useState, useRef } from "react";
import { fmtCompact, fmtValue, niceMax, topRoundedRectPath } from "./utils.js";

export function GroupedBar({ d }) {
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);
  const width = 900, height = 260;
  const marginLeft = 50, marginRight = 8, marginTop = 8, marginBottom = 32;
  const plotW = width - marginLeft - marginRight, plotH = height - marginTop - marginBottom;
  const n = d.labels.length, seriesN = d.datasets.length;
  const maxVal = Math.max(1, ...d.datasets.flatMap(s => s.data));
  const ceiling = niceMax(maxVal, 4);
  const gridSteps = 4;
  const groupW = plotW / n, barGap = 2;
  const barW = Math.min((groupW - (seriesN - 1) * barGap) / seriesN, 24);
  const seriesOffset = (groupW - (seriesN * barW + (seriesN - 1) * barGap)) / 2;
  const yFor = v => plotH - (v / ceiling) * plotH;

  return (
    <div style={{ position: "relative" }} ref={wrapRef}>
      {seriesN > 1 && (
        <div className="legend">
          {d.datasets.map((s, si) => (<div className="legend-item" key={s.label}><span className="swatch" style={{ background: s.backgroundColor || `var(--chart-${si + 1})` }} />{s.label}</div>))}
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} width="100%">
        <g transform={`translate(${marginLeft},${marginTop})`}>
          {Array.from({ length: gridSteps + 1 }).map((_, i) => {
            const v = (ceiling / gridSteps) * i, y = yFor(v);
            return (<g key={i}><line x1={0} x2={plotW} y1={y} y2={y} className="gridline-el" /><text x={-8} y={y} textAnchor="end" dominantBaseline="middle" className="axis-label">{fmtCompact(v)}</text></g>);
          })}
          <line x1={0} x2={plotW} y1={plotH} y2={plotH} className="baseline-el" />
          {d.labels.map((label, gi) => {
            const gx = gi * groupW;
            const isHover = hover && hover.gi === gi;
            return (
              <g key={label}>
                {d.datasets.map((s, si) => {
                  const v = s.data[gi] || 0, y = yFor(v), h = plotH - y, x = gx + seriesOffset + si * (barW + barGap);
                  return (
                    <path key={s.label} d={topRoundedRectPath(x, y, barW, Math.max(h, 0), 4)} fill={s.backgroundColor || `var(--chart-${si + 1})`} opacity={isHover ? 1 : 0.9}
                      onMouseEnter={(e) => { const box = wrapRef.current.getBoundingClientRect(); setHover({ gi, x: e.clientX - box.left + 12, y: e.clientY - box.top + 12 }); }}
                      onMouseMove={(e) => { const box = wrapRef.current.getBoundingClientRect(); setHover(h2 => h2 && { ...h2, x: e.clientX - box.left + 12, y: e.clientY - box.top + 12 }); }}
                      onMouseLeave={() => setHover(null)} />
                  );
                })}
                <text x={gx + groupW / 2} y={plotH + 16} textAnchor="middle" className="axis-label">{label}</text>
              </g>
            );
          })}
        </g>
      </svg>
      {hover && (
        <div className="chart-tooltip" style={{ left: hover.x, top: hover.y }}>
          <div className="t-title">{d.labels[hover.gi]}</div>
          {d.datasets.map(s => (<div className="t-row" key={s.label}><span>{s.label}</span><span className="v">{fmtValue(s.data[hover.gi], "number")}</span></div>))}
        </div>
      )}
    </div>
  );
}

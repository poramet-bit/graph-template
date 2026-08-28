import React, { useState, useRef } from "react";
import { fmtCompact, fmtValue, niceMax, topRoundedRectPath } from "./utils.js";

export function StackedBar({ d }) {
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);
  const width = 560, height = 220;
  const marginLeft = 46, marginRight = 8, marginTop = 8, marginBottom = 28;
  const plotW = width - marginLeft - marginRight, plotH = height - marginTop - marginBottom;
  const totals = d.labels.map((_, gi) => d.datasets.reduce((s, ds) => s + (ds.data[gi] || 0), 0));
  const ceiling = niceMax(Math.max(1, ...totals), 4);
  const gridSteps = 4;
  const n = d.labels.length, groupW = plotW / n, barW = Math.min(groupW * 0.5, 44);
  const yFor = v => plotH - (v / ceiling) * plotH;
  const GAP = 1; // 1px each side of a seam -> 2px total surface gap between segments

  return (
    <div style={{ position: "relative" }} ref={wrapRef}>
      <div className="legend">
        {d.datasets.map((s, si) => (<div className="legend-item" key={s.label}><span className="swatch" style={{ background: s.backgroundColor || `var(--chart-${si + 1})` }} />{s.label}</div>))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%">
        <g transform={`translate(${marginLeft},${marginTop})`}>
          {Array.from({ length: gridSteps + 1 }).map((_, i) => {
            const v = (ceiling / gridSteps) * i, y = yFor(v);
            return (<g key={i}><line x1={0} x2={plotW} y1={y} y2={y} className="gridline-el" /><text x={-8} y={y} textAnchor="end" dominantBaseline="middle" className="axis-label">{fmtCompact(v)}</text></g>);
          })}
          <line x1={0} x2={plotW} y1={plotH} y2={plotH} className="baseline-el" />
          {d.labels.map((label, gi) => {
            const gx = gi * groupW + (groupW - barW) / 2;
            let stackTop = 0;
            const isHover = hover === gi;
            return (
              <g key={label}>
                {d.datasets.map((ds, si) => {
                  const v = ds.data[gi] || 0;
                  let yTop = yFor(stackTop + v), yBottom = yFor(stackTop);
                  stackTop += v;
                  if (si < d.datasets.length - 1) yTop += GAP;
                  if (si > 0) yBottom -= GAP;
                  const h = Math.max(yBottom - yTop, 0);
                  const isTop = si === d.datasets.length - 1;
                  return isTop
                    ? <path key={ds.label} d={topRoundedRectPath(gx, yTop, barW, h, 4)} fill={ds.backgroundColor || `var(--chart-${si + 1})`} opacity={isHover ? 1 : 0.92}
                        onMouseEnter={() => setHover(gi)} onMouseLeave={() => setHover(null)} />
                    : <rect key={ds.label} x={gx} y={yTop} width={barW} height={h} fill={ds.backgroundColor || `var(--chart-${si + 1})`} opacity={isHover ? 1 : 0.92}
                        onMouseEnter={() => setHover(gi)} onMouseLeave={() => setHover(null)} />;
                })}
                <text x={gx + barW / 2} y={plotH + 16} textAnchor="middle" className="axis-label">{label}</text>
              </g>
            );
          })}
        </g>
      </svg>
      {hover !== null && (
        <div className="chart-tooltip" style={{ left: marginLeft + (hover + 0.5) * groupW - 70, top: 6 }}>
          <div className="t-title">{d.labels[hover]}</div>
          {d.datasets.map(ds => (<div className="t-row" key={ds.label}><span>{ds.label}</span><span className="v">{fmtValue(ds.data[hover], "number")}</span></div>))}
        </div>
      )}
    </div>
  );
}

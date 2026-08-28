import React, { useState, useRef } from "react";
import { fmtCompact, fmtValue, niceMax } from "./utils.js";

// shared by LineChart and AreaChart: a categorical x-axis, N series, and a
// crosshair+tooltip hit-column per index
export function XYChart({ d, mode }) {
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);
  const width = mode === "area" ? 900 : 620, height = 240;
  const marginLeft = 54, marginRight = 10, marginTop = 10, marginBottom = 26;
  const plotW = width - marginLeft - marginRight, plotH = height - marginTop - marginBottom;
  const n = d.labels.length;
  const xFor = i => (n <= 1 ? 0 : (i / (n - 1)) * plotW);

  let series;
  if (mode === "area" && d.stacked) {
    let running = new Array(n).fill(0);
    series = d.datasets.map(ds => {
      const base = running.slice();
      running = running.map((v, i) => v + (ds.data[i] || 0));
      return { ds, base, top: running.slice() };
    });
  } else {
    series = d.datasets.map(ds => ({ ds, base: new Array(n).fill(0), top: ds.data }));
  }
  const maxVal = Math.max(1, ...series.flatMap(s => s.top));
  const ceiling = niceMax(maxVal, 4);
  const gridSteps = 4;
  const yFor = v => plotH - (v / ceiling) * plotH;
  const colW = n > 1 ? plotW / (n - 1) : plotW;

  return (
    <div style={{ position: "relative" }} ref={wrapRef}>
      {series.length > 1 && (
        <div className="legend">
          {series.map((s, si) => (<div className="legend-item" key={s.ds.label}><span className="swatch" style={{ background: s.ds.borderColor || `var(--chart-${si + 1})` }} />{s.ds.label}</div>))}
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} width="100%">
        <g transform={`translate(${marginLeft},${marginTop})`}>
          {Array.from({ length: gridSteps + 1 }).map((_, i) => {
            const v = (ceiling / gridSteps) * i, y = yFor(v);
            return (<g key={i}><line x1={0} x2={plotW} y1={y} y2={y} className="gridline-el" /><text x={-8} y={y} textAnchor="end" dominantBaseline="middle" className="axis-label">{fmtCompact(v)}</text></g>);
          })}
          <line x1={0} x2={plotW} y1={plotH} y2={plotH} className="baseline-el" />
          {hover !== null && <line x1={xFor(hover)} x2={xFor(hover)} y1={0} y2={plotH} className="crosshair-el" />}

          {series.map((s, si) => {
            const color = s.ds.borderColor || `var(--chart-${si + 1})`;
            const topPath = d.labels.map((_, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(s.top[i])}`).join(" ");
            const areaPath = mode === "area"
              ? topPath + " " + d.labels.map((_, i) => `L${xFor(n - 1 - i)},${yFor(s.base[n - 1 - i])}`).join(" ") + " Z"
              : null;
            return (
              <g key={s.ds.label}>
                {mode === "area" && <path d={areaPath} fill={s.ds.backgroundColor || color} opacity={s.ds.backgroundColor ? 1 : 0.12} />}
                <path d={topPath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                {[0, n - 1].map(i => (
                  <circle key={"end" + i} cx={xFor(i)} cy={yFor(s.top[i])} r={5} fill={color} stroke="var(--surface)" strokeWidth={2.5} />
                ))}
                {hover !== null && <circle cx={xFor(hover)} cy={yFor(s.top[hover])} r={5} fill={color} stroke="var(--surface)" strokeWidth={2.5} />}
              </g>
            );
          })}

          {/* invisible hit column per index, wide enough for an easy hover target */}
          {d.labels.map((_, i) => (
            <rect key={i} x={xFor(i) - colW / 2} y={0} width={colW} height={plotH} fill="transparent"
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "crosshair" }} />
          ))}
          {d.labels.map((label, i) => (
            (n <= 10 || i % Math.ceil(n / 8) === 0) && <text key={label} x={xFor(i)} y={plotH + 14} textAnchor="middle" className="axis-label">{label}</text>
          ))}
        </g>
      </svg>
      {hover !== null && (
        <div className="chart-tooltip" style={{ left: Math.min(marginLeft + xFor(hover) - 60, width - 190), top: 6 }}>
          <div className="t-title">{d.labels[hover]}</div>
          {series.map(s => (<div className="t-row" key={s.ds.label}><span>{s.ds.label}</span><span className="v">{fmtValue(s.top[hover], "number")}</span></div>))}
        </div>
      )}
    </div>
  );
}

export function LineChart({ d }) { return <XYChart d={d} mode="line" />; }
export function AreaChart({ d }) { return <XYChart d={d} mode="area" />; }

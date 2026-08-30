import React, { useState, useRef } from 'react';

function fmtCurrency(n) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n);
}

function fmtCompact(n) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 1_000) return Math.round(n / 1_000) + "k";
  return String(n);
}

export function OriginalBarChart({ chart }) {
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);

  if (!chart || !chart.labels || !chart.labels.length) return null;

  // Full-width SVG coordinate system
  const width = 960;
  const height = 300;
  const marginLeft = 60;
  const marginRight = 20;
  const marginTop = 16;
  const marginBottom = 45;
  const plotW = width - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;

  const dataset = chart.datasets && chart.datasets[0] ? chart.datasets[0].data : (chart.data || []);
  const maxVal = Math.max(1, ...dataset);
  const niceMax = Math.ceil(maxVal / 200000) * 200000;
  const gridSteps = 5;
  const n = chart.labels.length;
  const groupW = plotW / n;
  const barW = Math.min(groupW * 0.45, 90);
  const yFor = (v) => plotH - (v / niceMax) * plotH;

  return (
    <div style={{ position: "relative", width: "100%" }} ref={wrapRef}>
      <div className="legend mb-3">
        <div className="legend-item">
          <span className="swatch" style={{ background: "var(--brand)" }} />
          <span>งบที่ใช้ไปจริง (Top {n} โครงการ)</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} width="100%" className="overflow-visible">
        <g transform={`translate(${marginLeft},${marginTop})`}>
          {/* Horizontal gridlines & Y-axis labels */}
          {Array.from({ length: gridSteps + 1 }).map((_, i) => {
            const v = (niceMax / gridSteps) * i;
            const y = yFor(v);
            return (
              <g key={i}>
                <line x1={0} x2={plotW} y1={y} y2={y} className="gridline-el" />
                <text x={-10} y={y} textAnchor="end" dominantBaseline="middle" className="axis-label" style={{ fontSize: "11px" }}>
                  {fmtCompact(v)}
                </text>
              </g>
            );
          })}
          <line x1={0} x2={plotW} y1={plotH} y2={plotH} className="baseline-el" />

          {/* Bars */}
          {chart.labels.map((label, gi) => {
            const gx = gi * groupW + (groupW - barW) / 2;
            const v = dataset[gi] || 0;
            const y = yFor(v);
            const h = plotH - y;
            const isHover = hover === gi;
            const codeLabel = (chart.codes && chart.codes[gi]) ? chart.codes[gi] : label;
            
            return (
              <g key={label + gi}>
                <rect
                  x={gx}
                  y={y}
                  width={barW}
                  height={Math.max(h, 0)}
                  rx={4}
                  fill="var(--brand)"
                  opacity={isHover ? 1 : 0.88}
                  onMouseEnter={() => setHover(gi)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                />
                {/* Code on x-axis */}
                <text
                  x={gx + barW / 2}
                  y={plotH + 18}
                  textAnchor="middle"
                  className="axis-label"
                  style={{ fontWeight: 600, fontSize: "11px" }}
                >
                  {String(codeLabel).slice(-4)}
                </text>
                {/* Short name below code */}
                <text
                  x={gx + barW / 2}
                  y={plotH + 32}
                  textAnchor="middle"
                  className="axis-label"
                  style={{ fontSize: "9.5px", fill: "var(--text-secondary)" }}
                >
                  {label.length > 18 ? label.slice(0, 16) + '...' : label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {hover !== null && (
        <div className="tooltip" style={{ left: Math.min(Math.max(10, marginLeft + hover * groupW), width - 260), top: 10 }}>
          <div className="t-title">{chart.labels[hover]}</div>
          <div className="t-row">
            <span>งบที่ใช้ไป</span>
            <span style={{ fontWeight: 700, color: "var(--brand)" }}>฿{fmtCurrency(dataset[hover])}</span>
          </div>
        </div>
      )}
    </div>
  );
}

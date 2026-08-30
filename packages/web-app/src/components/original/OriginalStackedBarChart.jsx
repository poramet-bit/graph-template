import React, { useState, useRef } from 'react';

function fmtCurrency(n) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n);
}

function fmtCompact(n) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 1_000) return Math.round(n / 1_000) + "k";
  return String(n);
}

export function OriginalStackedBarChart({ chart }) {
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);

  if (!chart || !chart.labels || !chart.datasets) return null;

  const width = 960;
  const height = 300;
  const marginLeft = 60;
  const marginRight = 20;
  const marginTop = 16;
  const marginBottom = 45;
  const plotW = width - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;

  const datasetUsed = chart.datasets[0]?.data || [];
  const datasetRemaining = chart.datasets[1]?.data || [];

  const maxTotals = chart.labels.map((_, i) => (datasetUsed[i] || 0) + (datasetRemaining[i] || 0));
  const maxVal = Math.max(1, ...maxTotals);
  const niceMax = Math.ceil(maxVal / 500000) * 500000;
  const gridSteps = 5;
  const n = chart.labels.length;
  const groupW = plotW / n;
  const barW = Math.min(groupW * 0.45, 90);
  const yFor = (v) => plotH - (v / niceMax) * plotH;

  return (
    <div style={{ position: "relative", width: "100%" }} ref={wrapRef}>
      <div className="legend mb-3">
        <div className="legend-item"><span className="swatch" style={{ background: "var(--brand)" }} /> งบที่ใช้ไป</div>
        <div className="legend-item"><span className="swatch" style={{ background: "var(--series-3)" }} /> งบคงเหลือ</div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} width="100%">
        <g transform={`translate(${marginLeft},${marginTop})`}>
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

          {chart.labels.map((label, gi) => {
            const gx = gi * groupW + (groupW - barW) / 2;
            const used = datasetUsed[gi] || 0;
            const remaining = datasetRemaining[gi] || 0;
            const total = used + remaining;

            const yUsed = yFor(used);
            const hUsed = plotH - yUsed;

            const yTotal = yFor(total);
            const hRemaining = yUsed - yTotal;

            const isHover = hover === gi;

            return (
              <g key={label + gi}>
                {/* Bottom Stack: Used */}
                <rect
                  x={gx}
                  y={yUsed}
                  width={barW}
                  height={Math.max(hUsed, 0)}
                  fill="var(--brand)"
                  opacity={isHover ? 1 : 0.88}
                  onMouseEnter={() => setHover(gi)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer" }}
                />
                {/* Top Stack: Remaining */}
                <rect
                  x={gx}
                  y={yTotal}
                  width={barW}
                  height={Math.max(hRemaining, 0)}
                  rx={4}
                  fill="var(--series-3)"
                  opacity={isHover ? 1 : 0.88}
                  onMouseEnter={() => setHover(gi)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer" }}
                />
                <text x={gx + barW / 2} y={plotH + 18} textAnchor="middle" className="axis-label" style={{ fontWeight: 600, fontSize: "11px" }}>
                  {String(label).slice(0, 14)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {hover !== null && (
        <div className="tooltip" style={{ left: Math.min(Math.max(10, marginLeft + hover * groupW), width - 260), top: 10 }}>
          <div className="t-title">{chart.labels[hover]}</div>
          <div className="t-row"><span>งบที่ใช้ไป</span><span>฿{fmtCurrency(datasetUsed[hover])}</span></div>
          <div className="t-row"><span>งบคงเหลือ</span><span>฿{fmtCurrency(datasetRemaining[hover])}</span></div>
        </div>
      )}
    </div>
  );
}

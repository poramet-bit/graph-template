import React, { useState, useRef } from 'react';

function fmtCurrency(n) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n);
}

function fmtCompact(n) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 1_000) return Math.round(n / 1_000) + "k";
  return String(n);
}

export function OriginalLineChart({ chart }) {
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);

  if (!chart || !chart.labels) return null;

  const dataset = chart.datasets && chart.datasets[0] ? chart.datasets[0].data : (chart.data || []);
  const points = chart.labels.map((code, i) => ({
    code,
    cumulative: dataset[i] || 0
  }));

  // Full-width SVG coordinate system
  const width = 960;
  const height = 300;
  const marginLeft = 60;
  const marginRight = 20;
  const marginTop = 16;
  const marginBottom = 38;
  const plotW = width - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;

  const maxVal = Math.max(1, ...points.map((p) => p.cumulative));
  const niceMax = Math.ceil(maxVal / 500000) * 500000;
  const gridSteps = 5;
  const n = points.length;
  const xFor = (i) => (n <= 1 ? 0 : (i / (n - 1)) * plotW);
  const yFor = (v) => plotH - (v / niceMax) * plotH;

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.cumulative)}`).join(" ");
  const areaPath = path + ` L${xFor(n - 1)},${plotH} L0,${plotH} Z`;

  return (
    <div style={{ position: "relative", width: "100%" }} ref={wrapRef}>
      <div className="legend mb-3">
        <div className="legend-item">
          <span className="swatch" style={{ background: "var(--series-1)" }} />
          <span>ยอดเบิกจ่ายสะสม (เรียงตามรหัสโครงการ 38 รายการ)</span>
        </div>
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
          <path d={areaPath} fill="var(--series-1)" opacity={0.14} />
          <path d={path} fill="none" stroke="var(--series-1)" strokeWidth={2.5} />

          {points.map((p, i) => (
            <circle
              key={p.code + i}
              cx={xFor(i)}
              cy={yFor(p.cumulative)}
              r={hover === i ? 5 : 3}
              fill="var(--series-1)"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            />
          ))}

          {points.map((p, i) =>
            i % Math.ceil(n / 10) === 0 ? (
              <text key={p.code + i} x={xFor(i)} y={plotH + 16} textAnchor="middle" className="axis-label" style={{ fontSize: "10px" }}>
                {String(p.code).slice(-4)}
              </text>
            ) : null
          )}
        </g>
      </svg>

      {hover !== null && (
        <div className="tooltip" style={{ left: Math.min(Math.max(10, marginLeft + xFor(hover) - 70), width - 260), top: 10 }}>
          <div className="t-title">รหัสโครงการ {points[hover].code}</div>
          <div className="t-row">
            <span>งบสะสม</span>
            <span style={{ fontWeight: 700, color: "var(--series-1)" }}>฿{fmtCurrency(points[hover].cumulative)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

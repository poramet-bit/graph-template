import React, { useState } from 'react';

function fmtCurrency(n) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(n);
}

function fmtCompact(n) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 1_000) return Math.round(n / 1_000) + "k";
  return String(n);
}

const DEFAULT_SERIES = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)'
];

export function OriginalDonutChart({ chart }) {
  const [hover, setHover] = useState(null);

  if (!chart || !chart.labels) return null;

  const dataset = chart.datasets && chart.datasets[0] ? chart.datasets[0].data : (chart.data || []);
  const total = dataset.reduce((s, c) => s + (Number(c) || 0), 0);
  const r = 75, cx = 110, cy = 110, strokeW = 26, circ = 2 * Math.PI * r, gapPx = 4;

  let cumulative = 0;
  const segments = chart.labels.map((label, i) => {
    const val = Number(dataset[i]) || 0;
    const frac = total > 0 ? val / total : 0;
    const len = Math.max(frac * circ - gapPx, 0);
    const color = (chart.datasets && chart.datasets[0]?.backgroundColor && chart.datasets[0]?.backgroundColor[i]) 
      || DEFAULT_SERIES[i % DEFAULT_SERIES.length];
    const seg = { len, dashoffset: -cumulative * circ, color, i, label, val, pct: (frac * 100).toFixed(1) };
    cumulative += frac;
    return seg;
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4 w-full">
      {/* Left: Donut SVG */}
      <div className="donut-wrap shrink-0">
        <svg viewBox="0 0 220 220" width="220" height="220">
          <g transform={`rotate(-90 ${cx} ${cy})`}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--gridline)" strokeWidth={strokeW} />
            {segments.map((s) => (
              <circle
                key={s.i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={strokeW}
                strokeDasharray={`${s.len} ${circ - s.len}`}
                strokeDashoffset={s.dashoffset}
                opacity={hover === null || hover === s.i ? 1 : 0.4}
                onMouseEnter={() => setHover(s.i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              />
            ))}
          </g>
          <text x={cx} y={cy - 4} textAnchor="middle" className="donut-center" fill="var(--text-primary)" style={{ fontSize: "22px" }}>
            ฿{fmtCompact(total)}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" className="donut-center-label" fill="var(--text-muted)">
            รวมใช้ไปจริง
          </text>
        </svg>
      </div>

      {/* Right: Detailed Category Cards Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {segments.map((s) => (
          <div
            key={s.label}
            onMouseEnter={() => setHover(s.i)}
            onMouseLeave={() => setHover(null)}
            className="p-3.5 rounded-xl border transition-all cursor-pointer"
            style={{
              background: hover === s.i ? "rgba(255,255,255,0.06)" : "var(--page)",
              borderColor: hover === s.i ? s.color : "var(--border)"
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="swatch round" style={{ background: s.color }} />
              <span className="font-semibold text-xs text-slate-200 truncate">{s.label}</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-sm font-bold font-mono text-white">฿{fmtCurrency(s.val)}</span>
              <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';

export function OriginalGaugeChart({ chart }) {
  if (!chart) return null;

  const value = Number(chart.value) || 0;
  const max = Number(chart.max) || 120;
  const min = Number(chart.min) || 0;
  const angle = Math.min(180, Math.max(0, ((value - min) / (max - min)) * 180));

  return (
    <div className="donut-wrap py-4">
      <svg viewBox="0 0 200 120" width="200" height="120">
        {/* Background semi-circle track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--gridline)"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Active track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={value > 100 ? "var(--series-2)" : "var(--series-3)"}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="251.3"
          strokeDashoffset={251.3 - (angle / 180) * 251.3}
        />
        <text x="100" y="85" textAnchor="middle" className="donut-center" fill="var(--text-primary)">
          {value.toFixed(1)}%
        </text>
        <text x="100" y="105" textAnchor="middle" className="donut-center-label" fill="var(--text-muted)">
          อัตราเบิกจ่าย
        </text>
      </svg>
      <div className="legend mt-2">
        <div className="legend-item"><span className="swatch" style={{ background: "var(--good)" }} /> 0-80% ปกติ</div>
        <div className="legend-item"><span className="swatch" style={{ background: "var(--series-4)" }} /> 80-100% เฝ้าระวัง</div>
        <div className="legend-item"><span className="swatch" style={{ background: "var(--series-2)" }} /> &gt;100% เกินกรอบ</div>
      </div>
    </div>
  );
}

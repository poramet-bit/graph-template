import React from "react";
import { polarPoint, valueToAngle } from "./utils.js";

export function Gauge({ d }) {
  const cx = 110, cy = 100, r = 80, strokeW = 16;
  const zoneColor = { good: "var(--good)", warning: "var(--warning)", critical: "var(--critical)" };
  const zones = d.zones && d.zones.length ? d.zones : [{ from: d.min, to: d.max, color: "good" }];
  const activeZone = zones.find(z => d.value >= z.from && d.value <= z.to) || zones[zones.length - 1];
  const needleAngle = valueToAngle(d.value, d.min, d.max);
  const needleTip = polarPoint(cx, cy, r, needleAngle);

  return (
    <div className="gauge-wrap">
      <svg viewBox="0 0 220 120" width="240" role="img" aria-label={`${d.title}: ${d.value.toFixed(1)}${d.unit || ""}`}>
        {zones.map((z, i) => {
          const a1 = valueToAngle(z.from, d.min, d.max), a2 = valueToAngle(z.to, d.min, d.max);
          const p1 = polarPoint(cx, cy, r, a1), p2 = polarPoint(cx, cy, r, a2);
          const largeArc = Math.abs(a1 - a2) > 180 ? 1 : 0;
          return <path key={i} d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`} fill="none" stroke={zoneColor[z.color]} strokeWidth={strokeW} strokeLinecap="butt" opacity={0.28} />;
        })}
        <path d={`M ${polarPoint(cx, cy, r, 180).x} ${polarPoint(cx, cy, r, 180).y} A ${r} ${r} 0 ${valueToAngle(d.min, d.min, d.max) - needleAngle > 180 ? 1 : 0} 1 ${needleTip.x} ${needleTip.y}`}
          fill="none" stroke={zoneColor[activeZone.color]} strokeWidth={strokeW} strokeLinecap="round" />
        <circle cx={needleTip.x} cy={needleTip.y} r={5} fill={zoneColor[activeZone.color]} stroke="var(--surface)" strokeWidth={2.5} />
      </svg>
      <div className="gauge-value">{d.value.toFixed(1)}{d.unit}</div>
      <div className="gauge-caption">{d.min}–{d.max}{d.unit}</div>
      <div className="gauge-legend">
        {zones.map((z, i) => (
          <div className="gauge-legend-item" key={i}><span className="gauge-swatch" style={{ background: zoneColor[z.color] }} />{z.from}–{z.to}{d.unit}</div>
        ))}
      </div>
    </div>
  );
}

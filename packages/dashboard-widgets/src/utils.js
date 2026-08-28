export function fmtNumber(n) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function fmtCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1_000) return Math.round(n / 1_000) + "k";
  return String(Math.round(n));
}

export function fmtValue(value, format) {
  if (value == null) return "–";
  if (format === "currency") return "฿" + fmtNumber(value);
  if (format === "percent") return Number(value).toFixed(1) + "%";
  if (format === "date") return String(value).slice(0, 10);
  if (format === "text") return String(value);
  return fmtNumber(value);
}

// "nice" axis ceiling, scale-agnostic (works for counts, percents, or millions of baht alike)
export function niceMax(value, steps) {
  if (!(value > 0)) return steps;
  const rough = value / steps;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return niceNorm * mag * steps;
}

// top-rounded rect (4px, square at the baseline) -- mark spec from the dataviz skill
export function topRoundedRectPath(x, y, w, h, r) {
  if (h <= 0 || w <= 0) return "";
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

export function polarPoint(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

export function valueToAngle(value, min, max) {
  const f = Math.min(Math.max((value - min) / (max - min), 0), 1);
  return 180 - f * 180;
}

// layout packer: greedily fills rows from each widget's declared size ("quarter" | "half" | full),
// flushing a partial row rather than leaving a gap
export function packRows(widgets) {
  const rows = [];
  let qBuf = [], hBuf = [];
  const flushQ = () => { if (qBuf.length) { rows.push({ cols: qBuf.length, items: qBuf }); qBuf = []; } };
  const flushH = () => { if (hBuf.length) { rows.push({ cols: hBuf.length, items: hBuf }); hBuf = []; } };
  for (const w of widgets) {
    if (w.size === "quarter") {
      flushH();
      qBuf.push(w);
      if (qBuf.length === 4) flushQ();
    } else if (w.size === "half") {
      flushQ();
      hBuf.push(w);
      if (hBuf.length === 2) flushH();
    } else {
      flushQ(); flushH();
      rows.push({ cols: 1, items: [w] });
    }
  }
  flushQ(); flushH();
  return rows;
}

export function widgetSubtitle(d) {
  const bits = [];
  if (d.axis && (d.axis.x_label || d.axis.y_label)) bits.push([d.axis.x_label, d.axis.y_label].filter(Boolean).join(" / "));
  if (d.type === "gauge" && d.zones) bits.push(d.zones.map(z => `${z.from}–${z.to}${d.unit || ""}`).join(" · "));
  if (d.type === "table" && d.meta && d.meta.row_count != null) bits.push(`${d.meta.row_count} rows`);
  if (d.meta && d.meta.unit) bits.push(d.meta.unit);
  return bits.length ? bits.join(" — ") : null;
}

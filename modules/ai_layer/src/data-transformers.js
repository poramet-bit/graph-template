/**
 * Data Transformers for Sub-Agent Graph Engine
 * Transforms raw tabular project rows into schema-conformant JSON chart specifications.
 */

import { MISSION_CATEGORIES } from './intent-analyzer.js';

const PALETTE = {
  indigo: '#4f46e5',
  purple: '#7c3aed',
  sky: '#0284c7',
  emerald: '#059669',
  amber: '#d97706',
  rose: '#e11d48',
  slate: '#64748b',
  pink: '#db2777',
  teal: '#0d9488'
};

const PIE_COLORS = [
  '#4f46e5', // Indigo (Academic)
  '#0d9488', // Teal (Arts & Culture)
  '#e11d48', // Rose (Research)
  '#d97706'  // Amber (Community Service)
];

/**
 * Extracts category from a project code (e.g., "694101033" -> "694101")
 */
export function getCategoryKey(code = '') {
  const prefix = String(code).slice(0, 6);
  return MISSION_CATEGORIES[prefix] ? prefix : 'other';
}

export function getCategoryName(code = '') {
  const key = getCategoryKey(code);
  return MISSION_CATEGORIES[key] || 'โครงการทั่วไป';
}

/**
 * 1. Transform to Bar Chart (Top N Spenders)
 */
export function buildBarChart(rows = [], topN = 5, query = '') {
  // Sort descending by actual spend
  const sorted = [...rows]
    .filter(r => (r.actual || 0) > 0)
    .sort((a, b) => (b.actual || 0) - (a.actual || 0))
    .slice(0, topN);

  const labels = sorted.map(r => {
    const name = r.name.replace(/^โครงการ/, '').trim();
    return name.length > 28 ? name.slice(0, 25) + '...' : name;
  });

  const plannedData = sorted.map(r => Number(r.planned) || 0);
  const actualData = sorted.map(r => Number(r.actual) || 0);

  return {
    type: 'bar',
    title: `โครงการที่ใช้งบประมาณสูงสุด ${sorted.length} อันดับแรก`,
    labels,
    datasets: [
      {
        label: 'งบประมาณต้นปี',
        data: plannedData,
        backgroundColor: '#6366f1'
      },
      {
        label: 'งบที่ใช้ไปจริง',
        data: actualData,
        backgroundColor: '#ec4899'
      }
    ],
    axis: {
      x_label: 'โครงการ',
      y_label: 'บาท'
    },
    meta: {
      source_query: query || 'SELECT name, planned, actual FROM projects ORDER BY actual DESC LIMIT 5',
      generated_at: new Date().toISOString(),
      unit: 'บาท',
      row_count: sorted.length
    }
  };
}

/**
 * 2. Transform to Pie / Donut Chart (Spend by Mission Category)
 */
export function buildPieChart(rows = [], query = '') {
  const categoryTotals = {};
  
  Object.keys(MISSION_CATEGORIES).forEach(key => {
    categoryTotals[MISSION_CATEGORIES[key]] = 0;
  });

  rows.forEach(r => {
    const catName = getCategoryName(r.code);
    categoryTotals[catName] = (categoryTotals[catName] || 0) + (Number(r.actual) || 0);
  });

  const labels = Object.keys(categoryTotals).filter(k => categoryTotals[k] > 0);
  const data = labels.map(k => Math.round(categoryTotals[k] * 100) / 100);

  return {
    type: 'pie',
    title: 'สัดส่วนการใช้งบประมาณจำแนกตามพันธกิจ',
    labels,
    datasets: [
      {
        label: 'งบที่ใช้ไป (บาท)',
        data,
        backgroundColor: PIE_COLORS.slice(0, labels.length)
      }
    ],
    meta: {
      source_query: query || 'SELECT category, SUM(actual) FROM projects GROUP BY category',
      generated_at: new Date().toISOString(),
      unit: 'บาท',
      total_spend: data.reduce((a, b) => a + b, 0)
    }
  };
}

/**
 * 3. Transform to Gauge Chart (Disbursement Rate)
 */
export function buildGaugeChart(rows = [], query = '') {
  const totalPlanned = rows.reduce((sum, r) => sum + (Number(r.planned) || 0), 0);
  const totalActual = rows.reduce((sum, r) => sum + (Number(r.actual) || 0), 0);

  const rate = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 1000) / 10 : 0;

  return {
    type: 'gauge',
    title: 'อัตราการเบิกจ่ายงบประมาณรวม',
    value: rate,
    min: 0,
    max: 120,
    unit: '%',
    zones: [
      { from: 0, to: 80, color: 'good' },
      { from: 80, to: 100, color: 'warning' },
      { from: 100, to: 120, color: 'critical' }
    ],
    meta: {
      source_query: query || 'SELECT SUM(actual) / SUM(planned) * 100 FROM projects',
      generated_at: new Date().toISOString(),
      total_planned: totalPlanned,
      total_actual: totalActual
    }
  };
}

/**
 * 4. Transform to Stacked Bar Chart (Used vs Remaining per Mission)
 */
export function buildStackedBarChart(rows = [], query = '') {
  const grouped = {};

  Object.keys(MISSION_CATEGORIES).forEach(key => {
    grouped[MISSION_CATEGORIES[key]] = { planned: 0, actual: 0 };
  });

  rows.forEach(r => {
    const cat = getCategoryName(r.code);
    if (!grouped[cat]) grouped[cat] = { planned: 0, actual: 0 };
    grouped[cat].planned += Number(r.planned) || 0;
    grouped[cat].actual += Number(r.actual) || 0;
  });

  const labels = Object.keys(grouped);
  const usedData = labels.map(k => Math.round(grouped[k].actual));
  const remainingData = labels.map(k => Math.max(0, Math.round(grouped[k].planned - grouped[k].actual)));

  return {
    type: 'stacked_bar',
    title: 'งบประมาณที่ใช้ไปและงบคงเหลือตามพันธกิจ',
    labels,
    datasets: [
      {
        label: 'งบที่ใช้ไป',
        data: usedData,
        backgroundColor: '#4f46e5',
        stack: 'budget'
      },
      {
        label: 'งบคงเหลือ',
        data: remainingData,
        backgroundColor: '#10b981',
        stack: 'budget'
      }
    ],
    axis: {
      x_label: 'พันธกิจ',
      y_label: 'บาท'
    },
    meta: {
      source_query: query || 'SELECT category, actual, (planned - actual) FROM projects',
      generated_at: new Date().toISOString(),
      unit: 'บาท'
    }
  };
}

/**
 * 5. Transform to Area Chart (Cumulative Spend Curve)
 */
export function buildAreaChart(rows = [], query = '') {
  let runningTotal = 0;
  const labels = [];
  const cumulativeData = [];

  rows.forEach(r => {
    runningTotal += Number(r.actual) || 0;
    labels.push(r.code);
    cumulativeData.push(Math.round(runningTotal));
  });

  return {
    type: 'area',
    title: 'การเบิกจ่ายงบประมาณสะสมรายรหัสโครงการ',
    labels,
    datasets: [
      {
        label: 'ยอดเบิกจ่ายสะสม (บาท)',
        data: cumulativeData,
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#6366f1'
      }
    ],
    axis: {
      x_label: 'รหัสโครงการ',
      y_label: 'บาท'
    },
    meta: {
      source_query: query || 'SELECT code, SUM(actual) OVER (ORDER BY code) FROM projects',
      generated_at: new Date().toISOString(),
      unit: 'บาท',
      final_cumulative: runningTotal
    }
  };
}

/**
 * 6. Transform to Stat Card (KPI Cards)
 */
export function buildStatCard(rows = [], query = '') {
  const totalPlanned = rows.reduce((sum, r) => sum + (Number(r.planned) || 0), 0);
  const totalActual = rows.reduce((sum, r) => sum + (Number(r.actual) || 0), 0);
  const rate = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 1000) / 10 : 0;

  return {
    type: 'stat_card',
    title: 'สรุปงบประมาณรวม',
    value: totalActual,
    unit: 'บาท',
    change: {
      rate: rate,
      label: 'ของงบประมาณต้นปีรวม',
      direction: rate > 100 ? 'up' : 'neutral'
    },
    metrics: [
      { label: 'งบประมาณต้นปี', value: totalPlanned, unit: 'บาท' },
      { label: 'งบที่ใช้ไปจริง', value: totalActual, unit: 'บาท' },
      { label: 'จำนวนโครงการ', value: rows.length, unit: 'โครงการ' }
    ],
    meta: {
      source_query: query,
      generated_at: new Date().toISOString()
    }
  };
}

/**
 * 7. Transform to Table format
 */
export function buildTable(rows = [], query = '') {
  return {
    type: 'table',
    title: 'รายการโครงการและงบประมาณ ปี 2569',
    columns: [
      { key: 'code', label: 'รหัสโครงการ', format: 'text' },
      { key: 'name', label: 'ชื่อโครงการ', format: 'text' },
      { key: 'planned', label: 'งบประมาณต้นปี', format: 'currency' },
      { key: 'actual', label: 'งบที่ใช้ไป', format: 'currency' }
    ],
    rows: rows,
    meta: {
      source_query: query,
      generated_at: new Date().toISOString(),
      row_count: rows.length
    }
  };
}

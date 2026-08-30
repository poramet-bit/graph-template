import React from 'react';
import { Widget } from '@poramet-bit/dashboard-widgets';
import {
  buildBarChart,
  buildPieChart,
  buildGaugeChart,
  buildStackedBarChart,
  buildAreaChart,
  buildStatCard,
  buildTable
} from '../../../../modules/ai_layer/src/index.js';
import budgetData from '../data/budgetData.json';

export function DashboardGridView({ onInspectSchema }) {
  const rows = budgetData.rows || [];

  const statCardSpec = buildStatCard(rows);
  const gaugeSpec = buildGaugeChart(rows);
  const pieSpec = buildPieChart(rows);
  const barSpec = buildBarChart(rows, 5);
  const stackedSpec = buildStackedBarChart(rows);
  const areaSpec = buildAreaChart(rows);

  const totalPlanned = rows.reduce((s, r) => s + Number(r.planned || 0), 0);
  const totalActual = rows.reduce((s, r) => s + Number(r.actual || 0), 0);
  const rate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0;
  const remaining = Math.max(0, totalPlanned - totalActual);

  const fmt = (n) => Number(n).toLocaleString('th-TH');

  return (
    <div className="space-y-6">
      {/* Top Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">ICT Budget Management Dashboard (ปี 2569)</h2>
          <p className="text-xs text-slate-400 mt-1">
            ภาพรวมการเบิกจ่ายงบประมาณโครงการทั้งหมด 38 รายการ ข้อมูลเชื่อมต่อผ่าน Schema-driven Component Grid
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Fiscal Year 2569
          </span>
        </div>
      </div>

      {/* KPI Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold text-slate-400 block mb-1">งบประมาณต้นปีรวม</span>
          <div className="text-2xl font-extrabold text-white font-mono">{fmt(totalPlanned)} <span className="text-xs font-normal text-slate-400">บาท</span></div>
          <span className="text-[11px] text-slate-500 mt-1 block">38 โครงการ</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold text-slate-400 block mb-1">งบที่ใช้ไปจริงรวม</span>
          <div className="text-2xl font-extrabold text-pink-400 font-mono">{fmt(totalActual)} <span className="text-xs font-normal text-slate-400">บาท</span></div>
          <span className="text-[11px] text-emerald-400 mt-1 block">● เบิกจ่ายแล้ว {rate}%</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold text-slate-400 block mb-1">งบคงเหลือรวม</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{fmt(remaining)} <span className="text-xs font-normal text-slate-400">บาท</span></div>
          <span className="text-[11px] text-slate-400 mt-1 block">พร้อมจัดสรรต่อ</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold text-slate-400 block mb-1">อัตราการเบิกจ่าย (Overall)</span>
          <div className="text-2xl font-extrabold text-indigo-400 font-mono">{rate}%</div>
          <span className="text-[11px] text-indigo-300 mt-1 block">เป้าหมาย &gt; 85%</span>
        </div>
      </div>

      {/* Main Widget Grid Row 1: Gauge & Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 glow-card p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Disbursement Rate Gauge</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">gauge</span>
          </div>
          <Widget widget={{ size: 'quarter', data: gaugeSpec }} />
        </div>

        <div className="lg:col-span-8 glow-card p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Spend Breakdown by Mission Category</h3>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">pie / donut</span>
          </div>
          <Widget widget={{ size: 'half', data: pieSpec }} />
        </div>
      </div>

      {/* Main Widget Grid Row 2: Top 5 Bar & Stacked Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 glow-card p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Top 5 Projects by Actual Expenditure</h3>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">bar</span>
          </div>
          <Widget widget={{ size: 'half', data: barSpec }} />
        </div>

        <div className="lg:col-span-6 glow-card p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Planned vs Used vs Remaining per Mission</h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">stacked_bar</span>
          </div>
          <Widget widget={{ size: 'half', data: stackedSpec }} />
        </div>
      </div>

      {/* Main Widget Grid Row 3: Cumulative Spend Area Chart */}
      <div className="glow-card p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Cumulative Expenditure Curve by Project Code</h3>
          <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">area</span>
        </div>
        <Widget widget={{ size: 'full', data: areaSpec }} />
      </div>
    </div>
  );
}

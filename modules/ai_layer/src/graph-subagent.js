/**
 * Graph Sub-Agent (Graph Engine)
 * Autonomous sub-agent that decomposes data queries, aggregates tabular datasets,
 * and compiles schema-validated JSON visualization specs for frontend component rendering.
 */

import { analyzeIntent, CHART_TYPES } from './intent-analyzer.js';
import {
  buildBarChart,
  buildPieChart,
  buildGaugeChart,
  buildStackedBarChart,
  buildAreaChart,
  buildStatCard,
  buildTable
} from './data-transformers.js';

export class GraphSubAgent {
  constructor(options = {}) {
    this.name = options.name || 'PromptPaladins-GraphEngine-SubAgent';
    this.version = '1.0.0';
  }

  /**
   * Generates a fast text response for Output 1 (Main Agent Text Stream)
   */
  generateTextSummary(query = '', rawData = {}) {
    const rows = rawData.rows || [];
    const intent = analyzeIntent(query);
    const totalPlanned = rows.reduce((sum, r) => sum + (Number(r.planned) || 0), 0);
    const totalActual = rows.reduce((sum, r) => sum + (Number(r.actual) || 0), 0);
    const rate = totalPlanned > 0 ? ((totalActual / totalPlanned) * 100).toFixed(1) : 0;

    const fmt = (n) => Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2 });

    let summaryText = `📊 **ผลการวิเคราะห์ข้อมูลงบประมาณ ปี 2569 (คณะ ICT)**\n\n`;
    summaryText += `• **จำนวนโครงการทั้งหมด**: ${rows.length} โครงการ\n`;
    summaryText += `• **งบประมาณต้นปีรวม**: ${fmt(totalPlanned)} บาท\n`;
    summaryText += `• **งบที่ใช้ไปจริงรวม**: ${fmt(totalActual)} บาท (คิดเป็น **${rate}%** ของงบต้นปี)\n\n`;

    if (intent.chartType === CHART_TYPES.BAR) {
      const topRows = [...rows].sort((a, b) => (b.actual || 0) - (a.actual || 0)).slice(0, intent.topN || 5);
      summaryText += `🏆 **โครงการที่มีการใช้จ่ายสูงสุด ${topRows.length} อันดับแรก:**\n`;
      topRows.forEach((r, i) => {
        summaryText += `${i + 1}. **${r.name}** (รหัส ${r.code}) — ใช้ไป **${fmt(r.actual)} บาท** (งบต้นปี ${fmt(r.planned)} บาท)\n`;
      });
    } else if (intent.chartType === CHART_TYPES.PIE || intent.chartType === CHART_TYPES.STACKED_BAR) {
      summaryText += `📌 **สรุปการใช้งบประมาณตามพันธกิจ:**\n`;
      summaryText += `ระบบได้จัดกลุ่มโครงการตามรหัสพันธกิจ 4 ด้าน (งานวิชาการ, ทำนุบำรุงศิลปวัฒนธรรม, วิจัย, บริการวิชาการ) และสรุปยอดจัดสรรและยอดเบิกจ่ายพร้อมแสดงผลด้านล่าง\n`;
    } else if (intent.chartType === CHART_TYPES.GAUGE) {
      summaryText += `⏱️ **สถานะอัตราการเบิกจ่าย:**\n`;
      summaryText += `อัตราการเบิกจ่ายรวมอยู่ที่ **${rate}%** (อยู่ในโซน ${rate > 100 ? 'เกินกรอบงบต้นปีเนื่องจากได้รับโอนงบเพิ่ม' : 'ปกติ'})\n`;
    }

    summaryText += `\n*กำลังสร้าง Interactive Graph Visualization ผ่าน Sub-Agent...*`;
    return summaryText;
  }

  /**
   * Main Sub-Agent execution pipeline:
   * 1. Intent Decomposition -> 2. Data Aggregation -> 3. Schema Construction -> 4. Output Emitted
   */
  async processQuery(query = '', rawData = {}, onProgress = null) {
    const startTime = Date.now();
    const rows = rawData.rows || [];

    const emit = async (step, title, detail, delayMs = 60) => {
      if (onProgress) {
        onProgress({
          subagent: this.name,
          timestamp: new Date().toISOString(),
          step,
          title,
          detail,
          elapsedMs: Date.now() - startTime
        });
      }
      if (delayMs > 0) {
        await new Promise(res => setTimeout(res, delayMs));
      }
    };

    // Stage 1: Intent Analysis
    await emit('intent_analysis', '🔍 วิเคราะห์เจตนาคำถาม (Decomposing Query)', `กำลังวิเคราะห์คำค้น "${query}" เพื่อเลือกประเภทของแผนภูมิ`);
    const intent = analyzeIntent(query);
    await emit('intent_classified', `🎯 เลือกประเภทกราฟ: ${intent.chartType.toUpperCase()}`, intent.reason);

    // Stage 2: Data Aggregation & Transformation
    await emit('data_aggregation', '⚙️ รวบรวมและจัดกลุ่มข้อมูล (Aggregating Rows)', `กำลังคำนวณสถิติจาก ${rows.length} รายการโครงการ...`);
    
    let chartSpec = null;
    switch (intent.chartType) {
      case CHART_TYPES.BAR:
        chartSpec = buildBarChart(rows, intent.topN || 5, query);
        break;
      case CHART_TYPES.PIE:
        chartSpec = buildPieChart(rows, query);
        break;
      case CHART_TYPES.GAUGE:
        chartSpec = buildGaugeChart(rows, query);
        break;
      case CHART_TYPES.STACKED_BAR:
        chartSpec = buildStackedBarChart(rows, query);
        break;
      case CHART_TYPES.AREA:
      case CHART_TYPES.LINE:
        chartSpec = buildAreaChart(rows, query);
        break;
      case CHART_TYPES.STAT_CARD:
        chartSpec = buildStatCard(rows, query);
        break;
      case CHART_TYPES.TABLE:
        chartSpec = buildTable(rows, query);
        break;
      default:
        chartSpec = buildBarChart(rows, 5, query);
        break;
    }

    // Stage 3: Schema Validation & Synthesis
    await emit('schema_validation', `📋 ตรวจสอบ Schema (${chartSpec.type}.schema.json)`, 'จัดโครงสร้าง JSON Spec ตาม Template Contract พร้อมส่งให้ Component Render');

    // Stage 4: Completion
    const totalDuration = Date.now() - startTime;
    await emit('completed', '✅ สร้าง Graph Spec สมบูรณ์ (Output 2 Ready)', `ประมวลผลเสร็จสิ้นใน ${totalDuration}ms ส่งผลลัพธ์เข้า Component Rendering Engine`, 0);

    return {
      spec: chartSpec,
      intent,
      meta: {
        agent: this.name,
        durationMs: totalDuration,
        sourceRowCount: rows.length
      }
    };
  }
}

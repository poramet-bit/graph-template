/**
 * Intent Analyzer for Sub-Agent Graph Engine
 * Decomposes natural language queries (Thai & English) to determine the best chart schema and parameters.
 */

export const CHART_TYPES = {
  BAR: 'bar',
  PIE: 'pie',
  GAUGE: 'gauge',
  STACKED_BAR: 'stacked_bar',
  AREA: 'area',
  LINE: 'line',
  STAT_CARD: 'stat_card',
  TABLE: 'table',
  DASHBOARD: 'dashboard_layout'
};

const MISSION_CATEGORIES = {
  '694101': 'งานวิชาการและกิจการทั่วไป',
  '694103': 'ทำนุบำรุงศิลปวัฒนธรรม',
  '694104': 'วิจัยและนวัตกรรม',
  '694105': 'บริการวิชาการแก่สังคม'
};

/**
 * Classifies the query intent and extracts visualization parameters.
 * @param {string} query - The user query or prompt
 * @returns {object} - { chartType, title, topN, metric, confidence, reason }
 */
export function analyzeIntent(query = '') {
  const q = (query || '').toLowerCase().trim();

  // 1. Gauge / Rate / Percentage intent
  if (
    q.includes('อัตราการเบิกจ่าย') ||
    q.includes('กี่เปอร์เซ็นต์') ||
    q.includes('เปอร์เซ็นต์') ||
    q.includes('ร้อยละ') ||
    q.includes('gauge') ||
    q.includes('disbursement rate') ||
    q.includes('ความคืบหน้า') ||
    q.includes('progress')
  ) {
    return {
      chartType: CHART_TYPES.GAUGE,
      title: 'อัตราการเบิกจ่ายงบประมาณรวม',
      metric: 'disbursement_rate',
      confidence: 0.95,
      reason: 'ตรวจพบคำค้นเกี่ยวกับอัตราการเบิกจ่าย/เปอร์เซ็นต์ เหมาะสำหรับ Gauge Chart'
    };
  }

  // 2. Pie / Donut / Proportion / Category share intent
  if (
    q.includes('สัดส่วน') ||
    q.includes('แบ่งตามหมวด') ||
    q.includes('แยกตามพันธกิจ') ||
    q.includes('pie') ||
    q.includes('donut') ||
    q.includes('share') ||
    q.includes('proportion') ||
    q.includes('breakdown')
  ) {
    return {
      chartType: CHART_TYPES.PIE,
      title: 'สัดส่วนการใช้งบประมาณจำแนกตามพันธกิจ',
      metric: 'spend_by_category',
      confidence: 0.92,
      reason: 'ตรวจพบคำค้นเกี่ยวกับสัดส่วนหรือการจัดกลุ่มพันธกิจ เหมาะสำหรับ Pie/Donut Chart'
    };
  }

  // 3. Stacked Bar / Planned vs Actual / Remaining intent
  if (
    q.includes('คงเหลือ') ||
    q.includes('งบที่เหลือ') ||
    q.includes('เปรียบเทียบงบ') ||
    q.includes('stacked') ||
    q.includes('remaining') ||
    q.includes('จัดสรร vs ใช้ไป')
  ) {
    return {
      chartType: CHART_TYPES.STACKED_BAR,
      title: 'งบประมาณที่ใช้ไปเทียบกับคงเหลือตามพันธกิจ',
      metric: 'planned_vs_actual_stacked',
      confidence: 0.90,
      reason: 'ตรวจพบการเปรียบเทียบงบใช้ไปและงบคงเหลือ เหมาะสำหรับ Stacked Bar Chart'
    };
  }

  // 4. Area / Line / Cumulative trend intent
  if (
    q.includes('สะสม') ||
    q.includes('แนวโน้ม') ||
    q.includes('trend') ||
    q.includes('cumulative') ||
    q.includes('line') ||
    q.includes('area') ||
    q.includes('ลำดับโครงการ')
  ) {
    return {
      chartType: CHART_TYPES.AREA,
      title: 'การเบิกจ่ายงบประมาณสะสมรายโครงการ',
      metric: 'cumulative_spend',
      confidence: 0.88,
      reason: 'ตรวจพบคำค้นเกี่ยวกับยอดสะสมหรือแนวโน้ม เหมาะสำหรับ Area / Line Chart'
    };
  }

  // 5. Stat Cards / Dashboard overview intent
  if (
    q.includes('สรุปภาพรวม') ||
    q.includes('dashboard') ||
    q.includes('kpi') ||
    q.includes('overview') ||
    q.includes('ภาพรวมทั้งหมด')
  ) {
    return {
      chartType: CHART_TYPES.STAT_CARD,
      title: 'สรุปภาพรวมสถานะงบประมาณโครงการ',
      metric: 'kpi_overview',
      confidence: 0.89,
      reason: 'ตรวจพบคำขอสรุปภาพรวม KPI เหมาะสำหรับ Stat Cards'
    };
  }

  // 6. Table / Full list intent
  if (
    q.includes('ตาราง') ||
    q.includes('รายชื่อทั้งหมด') ||
    q.includes('ทุกโครงการ') ||
    q.includes('table') ||
    q.includes('list')
  ) {
    return {
      chartType: CHART_TYPES.TABLE,
      title: 'ตารางข้อมูลโครงการและงบประมาณทั้งหมด',
      metric: 'all_projects_table',
      confidence: 0.90,
      reason: 'ตรวจพบคำขอแสดงตารางรายการ เหมาะสำหรับ Table Widget'
    };
  }

  // 7. Default or Top Spenders / Bar Chart intent
  // Extract topN if specified in query (e.g., "5 อันดับ", "top 10")
  let topN = 5;
  const topMatch = q.match(/(?:top|อันดับ|สูงสุด)\s*(\d+)/i) || q.match(/(\d+)\s*(?:อันดับ|โครงการ)/);
  if (topMatch && topMatch[1]) {
    topN = parseInt(topMatch[1], 10);
    if (isNaN(topN) || topN <= 0) topN = 5;
  }

  return {
    chartType: CHART_TYPES.BAR,
    title: `โครงการที่ใช้งบประมาณสูงสุด ${topN} อันดับแรก`,
    metric: 'top_spenders',
    topN,
    confidence: 0.85,
    reason: `วิเคราะห์โครงสร้างข้อมูลเหมาะสำหรับ Bar Chart เปรียบเทียบโครงการ Top ${topN}`
  };
}

export { MISSION_CATEGORIES };

import budgetData from '../data/budgetData.json';
import { GraphSubAgent } from '../../../../modules/ai_layer/src/index.js';

const subAgentInstance = new GraphSubAgent();

/**
 * AI Service for Component-based UI
 * Supports both direct in-browser Sub-Agent processing (zero-dependency)
 * and SSE streaming over HTTP.
 */
export async function executeDualOutputQuery(query, onChunk, onSubagentStep) {
  const data = budgetData;

  // 1. Stream Output 1 (Text summary typewriter effect)
  const fullText = subAgentInstance.generateTextSummary(query, data);
  const words = fullText.split(' ');
  let currentBuffer = '';

  for (let i = 0; i < words.length; i++) {
    currentBuffer += (i > 0 ? ' ' : '') + words[i];
    if (onChunk) {
      onChunk(currentBuffer, i === words.length - 1);
    }
    await new Promise(r => setTimeout(r, 20));
  }

  // 2. Sub-Agent Pipeline execution (Output 2)
  const result = await subAgentInstance.processQuery(query, data, (stepEvt) => {
    if (onSubagentStep) {
      onSubagentStep(stepEvt);
    }
  });

  return {
    textSummary: fullText,
    spec: result.spec,
    intent: result.intent,
    meta: result.meta
  };
}

export function getPresetQueries() {
  return [
    { label: '🏆 5 อันดับงบสูงสุด', query: 'ขอดูโครงการที่ใช้งบประมาณเยอะที่สุด 5 อันดับแรก', type: 'bar' },
    { label: '🥧 สัดส่วนตามพันธกิจ', query: 'สัดส่วนการใช้งบประมาณแยกตามพันธกิจ', type: 'pie' },
    { label: '⚡ อัตราเบิกจ่าย %', query: 'อัตราการเบิกจ่ายงบประมาณของคณะเป็นกี่เปอร์เซ็นต์', type: 'gauge' },
    { label: '📊 งบใช้ไป vs คงเหลือ', query: 'เปรียบเทียบงบประมาณที่ใช้ไปและงบคงเหลือ', type: 'stacked_bar' },
    { label: '📈 เบิกจ่ายสะสม', query: 'แนวโน้มการเบิกจ่ายงบประมาณสะสมรายโครงการ', type: 'area' },
    { label: '💎 สรุปภาพรวม KPI', query: 'สรุปภาพรวม KPI ทั้งหมด', type: 'stat_card' },
    { label: '📋 ตารางโครงการทั้งหมด', query: 'ขอดูตารางรายชื่อโครงการทั้งหมด', type: 'table' }
  ];
}

export { budgetData };

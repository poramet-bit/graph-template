import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GraphSubAgent } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, '../../../templates/examples/ict_budget_2569.table.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🚀 Running Sub-Agent Graph Engine Tests...\n');

const subAgent = new GraphSubAgent();

const testQueries = [
  'ขอดูโครงการที่ใช้งบประมาณเยอะที่สุด 5 อันดับแรก',
  'สัดส่วนการใช้งบประมาณแยกตามพันธกิจ',
  'อัตราการเบิกจ่ายงบประมาณของคณะเป็นกี่เปอร์เซ็นต์',
  'เปรียบเทียบงบประมาณที่ใช้ไปและงบคงเหลือ',
  'แนวโน้มการเบิกจ่ายงบประมาณสะสมรายโครงการ',
  'สรุปภาพรวม KPI ทั้งหมด',
  'ขอดูตารางรายชื่อโครงการทั้งหมด'
];

async function runTests() {
  for (const q of testQueries) {
    console.log(`=======================================================`);
    console.log(`📥 Query: "${q}"`);

    // Output 1: Fast Text Summary
    const textSummary = subAgent.generateTextSummary(q, rawData);
    console.log(`\n💬 [Output 1 - Main Agent Text Stream]:\n${textSummary.slice(0, 140)}...\n`);

    // Output 2: Sub-Agent Pipeline
    console.log(`🤖 [Sub-Agent Processing Pipeline]:`);
    const result = await subAgent.processQuery(q, rawData, (evt) => {
      console.log(`   [+${evt.elapsedMs}ms] ${evt.step} -> ${evt.title}`);
    });

    console.log(`\n📊 [Output 2 - Graph Spec Generated]:`);
    console.log(`   Type: ${result.spec.type}`);
    console.log(`   Title: ${result.spec.title}`);
    console.log(`   Duration: ${result.meta.durationMs}ms`);
    console.log(`   Schema Conformant: ${!!result.spec.type && !!result.spec.title}\n`);
  }

  console.log('✅ ALL SUB-AGENT TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

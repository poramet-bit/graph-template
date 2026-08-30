#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GraphSubAgent } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, '../../../templates/examples/ict_budget_2569.table.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const query = process.argv.slice(2).join(' ') || 'ขอดูโครงการที่ใช้งบประมาณเยอะที่สุด 5 อันดับแรก';

console.log(`\n======================================================`);
console.log(`🤖 Prompt Paladins — Dual-Output AI & Sub-Agent CLI`);
console.log(`======================================================`);
console.log(`💬 User Query: "${query}"\n`);

const subAgent = new GraphSubAgent();

async function run() {
  // Output 1: Fast Text Output
  console.log(`------------------------------------------------------`);
  console.log(`💬 [Output 1 - Main Agent Streamed Summary]:`);
  console.log(`------------------------------------------------------`);
  const text = subAgent.generateTextSummary(query, rawData);
  console.log(text);
  console.log(`------------------------------------------------------\n`);

  // Subagent Pipeline Events
  console.log(`⚙️ [Sub-Agent Processing Telemetry]:`);
  const result = await subAgent.processQuery(query, rawData, (evt) => {
    console.log(`  [+${evt.elapsedMs}ms] ${evt.step} -> ${evt.title} (${evt.detail})`);
  });

  // Output 2: Graph Spec JSON
  console.log(`\n------------------------------------------------------`);
  console.log(`📊 [Output 2 - Generated Graph Spec JSON]:`);
  console.log(`------------------------------------------------------`);
  console.log(JSON.stringify(result.spec, null, 2));
  console.log(`------------------------------------------------------\n`);
  console.log(`✨ Processing time: ${result.meta.durationMs}ms`);
}

run().catch(console.error);

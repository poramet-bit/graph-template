import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GraphSubAgent } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, '../../../templates/examples/ict_budget_2569.table.json');
let cachedData = null;

function getRawData() {
  if (!cachedData) {
    cachedData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  return cachedData;
}

const subAgent = new GraphSubAgent();
const PORT = process.env.PORT || 8792;

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Endpoint 1: Get raw dataset
  if (url.pathname === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getRawData()));
    return;
  }

  // Endpoint 2: Generate chart (Direct POST)
  if (url.pathname === '/api/generate-chart' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const query = payload.query || 'ขอดูโครงการที่ใช้งบเยอะสุด 5 อันดับแรก';
        const data = payload.rawData || getRawData();

        const textSummary = subAgent.generateTextSummary(query, data);
        const steps = [];
        const result = await subAgent.processQuery(query, data, (step) => {
          steps.push(step);
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          textSummary,
          spec: result.spec,
          intent: result.intent,
          subagentSteps: steps,
          meta: result.meta
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Endpoint 3: Real-Time Dual-Output SSE Stream
  if (url.pathname === '/api/dual-stream') {
    const query = url.searchParams.get('q') || 'ขอดูโครงการที่ใช้งบประมาณเยอะที่สุด 5 อันดับแรก';
    const data = getRawData();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const sendEvent = (eventType, eventData) => {
      res.write(`event: ${eventType}\ndata: ${JSON.stringify(eventData)}\n\n`);
    };

    try {
      // Step A: Stream Output 1 (Text summary typewriter)
      const fullText = subAgent.generateTextSummary(query, data);
      const words = fullText.split(' ');
      let currentBuffer = '';

      for (let i = 0; i < words.length; i++) {
        currentBuffer += (i > 0 ? ' ' : '') + words[i];
        sendEvent('text_chunk', {
          delta: words[i] + ' ',
          text: currentBuffer,
          progress: Math.round(((i + 1) / words.length) * 100)
        });
        await new Promise(r => setTimeout(r, 25));
      }
      sendEvent('text_completed', { fullText });

      // Step B: Stream Sub-Agent Pipeline Steps
      const result = await subAgent.processQuery(query, data, (stepEvt) => {
        sendEvent('subagent_step', stepEvt);
      });

      // Step C: Stream Output 2 (Graph Spec JSON)
      sendEvent('graph_spec', {
        spec: result.spec,
        intent: result.intent,
        meta: result.meta
      });

      sendEvent('completed', { status: 'success', totalDurationMs: result.meta.durationMs });
    } catch (err) {
      sendEvent('error', { message: err.message });
    } finally {
      res.end();
    }
    return;
  }

  // Health check
  if (url.pathname === '/' || url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'graph-subagent-server', port: PORT }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`🚀 Graph Sub-Agent Server running on http://localhost:${PORT}`);
  console.log(`📡 SSE Stream Endpoint: http://localhost:${PORT}/api/dual-stream?q=...`);
  console.log(`📊 JSON Endpoint:       http://localhost:${PORT}/api/generate-chart`);
});

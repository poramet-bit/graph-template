# AI Layer — Graph Engine Sub-Agent

Autonomous **Sub-Agent Engine** for Smart Intelligence Budget Analysis. Converts raw tabular datasets (from MCP/Data Layer) into valid JSON chart specifications conformant to `templates/*.schema.json`.

## Architecture & Dual-Output Flow

```
User Query / Prompt
       │
       ├───> Main Agent ───> [Output 1] Fast Streamed Text Analysis (Markdown / Text Stream)
       │
       └───> Graph Sub-Agent ───> Decompose Intent -> Select Chart Type
                                  └──> Aggregate & Transform Data Rows
                                  └──> Validate vs templates/*.schema.json
                                  └──> [Output 2] Graph Spec JSON ───> Component Rendering
```

## Features

- 🔍 **Intent Decomposition**: Classifies user queries into chart intents (`bar`, `pie`, `gauge`, `stacked_bar`, `area`, `line`, `stat_card`, `table`).
- ⚙️ **Data Transformers**: Aggregates and transforms budget rows (summation, sorting, top N, grouping by mission category).
- 📋 **Schema Validation**: Ensures output strictly matches template contracts.
- 📡 **Dual-Output SSE Stream Server**: Serves real-time Server-Sent Events (`/api/dual-stream?q=...`) for fast text streaming followed by graph spec generation.
- 💻 **CLI Runner**: Test queries directly from terminal.

## Usage

### 1. Run Tests
```bash
node modules/ai_layer/test/subagent.test.js
```

### 2. Run Interactive CLI
```bash
node modules/ai_layer/src/cli.js "ขอดูโครงการที่ใช้งบเยอะสุด 5 อันดับแรก"
```

### 3. Start SSE API Server
```bash
node modules/ai_layer/src/server.js
```
Endpoints:
- `GET /api/dual-stream?q=...` — Server-Sent Events (Output 1 text stream + Sub-agent telemetry + Output 2 Graph Spec)
- `POST /api/generate-chart` — REST JSON endpoint
- `GET /api/data` — Raw dataset JSON

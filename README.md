# graph-template

JSON chart/table template + module scaffold for Smart Intelligence Budget
Analysis (Prompt Paladins, UP AI Hackathon). Standalone for now — wired to a
real MCP server once that side is stable.

## Architecture

```
E-budget --> mcp_server --> data_layer (DuckDB/SQLite) [+ Vector DB later]
                                  |
                                  v
                              ai_layer (Text-to-SQL / RAG)
                                  |
                                  v
                         templates/*.schema.json
                                  |
                                  v
                            presentation (report/dashboard)
```

`security` cross-cuts all layers (RBAC + read-only source access + encryption at rest).

### Target request flow (dual output)

The diagram in `docs/architecture/dual-output-flow.jpeg` breaks the pipeline
above into five stages and two outputs the frontend receives in parallel:

1. **User / Frontend (React UI)** — sends the chat request, opens an SSE
   connection, renders both outputs as they arrive.
2. **Go Backend (MCP orchestrator)** — receives the query, calls the LLM
   with the MCP tools schema, streams `status` / `tool_call` / `tool_result`
   / `final_text` SSE events back as it works.
3. **Data Source / MCP Server (Tools / MCP)** — executes the actual tool
   calls (JSON-RPC 2.0 over `tools/call`) and returns structured data.
4. **Subagent (Graph Engine)** — spawned by the backend once the answer is
   ready; decomposes the visualization request into subtasks (e.g. fetch
   projects, summarize budget, pick top N), aggregates the results, and
   generates a chart spec (ECharts/Recharts/Vega JSON) matching a
   `templates/*.schema.json` shape.
5. **Frontend / Result** — renders **Output 1** (the MCP prompt's streamed
   text answer) as soon as it lands, then **Output 2** (the subagent's chart)
   when its own SSE stream (`graph_spec_result` → `completed`) finishes —
   Output 2 arrives after Output 1 since it waits on the subagent.

Why split it this way: the main agent only reasons and answers in text (fast,
no chart-building latency on that path); the subagent handles visualization
independently and can be scaled out per chart type without touching the main
agent. `modules/presentation/models/flow-bar.html` mocks exactly this
two-stream timing.

## Layout

- `templates/` — JSON schema for each chart type: pie, bar, line, area,
  stacked_bar, gauge, stat_card, table. `templates/examples/` has one
  filled-in instance per schema, including a real dataset
  (`ict_budget_2569.table.json`, ICT faculty budget data).
- `docs/architecture/` — reference diagrams for the target pipeline.
- `modules/mcp_server/` — source system connector (not yet implemented).
- `modules/data_layer/` — local structured store (not yet implemented).
- `modules/ai_layer/` — NL question -> query -> template fill (not yet implemented).
- `modules/presentation/` — renders template JSON to an actual chart. Real
  renderer not yet implemented, but `modules/presentation/models/` has
  working front-end mockups (the dual-output flow in bar/pie/line variants,
  plus a dark admin-UI clone) — see `modules/presentation/README.md`.
- `modules/security/` — access control (not yet implemented).

Each module is independent — build and test in isolation, wire into
`mcp_server` last.

## Local dev server

The mockups `fetch()` template JSON by relative path, so they need to be
served over HTTP, not opened as `file://`. From the repo root:

```
python3 -m http.server 8791
```

then open `modules/presentation/models/index.html`.

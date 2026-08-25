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

A more detailed target flow — `User -> Go Backend (MCP orchestrator) -> MCP
Server -> Subagent (graph engine) -> Frontend`, with two parallel outputs
(streaming text + subagent-built graph) — is diagrammed in
`docs/architecture/dual-output-flow.jpeg`.

## Layout

- `templates/` — JSON schema for each chart type: pie, bar, line, table.
  `templates/examples/` has one filled-in instance per schema, including a
  real dataset (`ict_budget_2569.table.json`, ICT faculty budget data).
- `docs/architecture/` — reference diagrams for the target pipeline.
- `modules/mcp_server/` — source system connector (not yet implemented).
- `modules/data_layer/` — local structured store (not yet implemented).
- `modules/ai_layer/` — NL question -> query -> template fill (not yet implemented).
- `modules/presentation/` — renders template JSON to an actual chart. Real
  renderer not yet implemented, but `modules/presentation/models/` has
  working front-end mockups (bar/pie/line chart variants of the dual-output
  flow) — see `modules/presentation/README.md`.
- `modules/security/` — access control (not yet implemented).

Each module is independent — build and test in isolation, wire into
`mcp_server` last.

## Local dev server

The mockups `fetch()` template JSON by relative path, so they need to be
served over HTTP, not opened as `file://`. Run `./serve.sh` from the repo
root (port comes from `dev.env`, not `.env` — see that file's comment for
why) and open `modules/presentation/models/index.html`.

co# graph-template

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

## Layout

- `templates/` — JSON schema for each chart type: pie, bar, line, table.
  `templates/examples/` has one filled-in instance per schema.
- `modules/mcp_server/` — source system connector (not yet implemented).
- `modules/data_layer/` — local structured store (not yet implemented).
- `modules/ai_layer/` — NL question -> query -> template fill (not yet implemented).
- `modules/presentation/` — renders template JSON to an actual chart (not yet implemented).
- `modules/security/` — access control (not yet implemented).

Each module is independent — build and test in isolation, wire into
`mcp_server` last.

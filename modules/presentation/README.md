# presentation

Renders the JSON produced by `ai_layer` (matching a schema in `../../templates/`)
into an actual chart/table on screen, using Chart.js, Recharts, or similar.

Status: not yet implemented for the real pipeline. See `templates/examples/`
for the JSON shape each renderer must accept.

## Mockups

- `react_demo.html` — single-layout demo (table then bar chart), used to test
  the two-phase render idea from skip.md (table fast, sub agent fills the chart
  after).
- `models/graph.html` — dual-output mockup matching the
  `User → Go Backend → MCP Server → Subagent → Frontend` architecture: a
  5-stage stepper, then two panels side by side — Output 1 streams a text
  summary (typewriter effect), Output 2 lights up a 3-subagent pipeline
  (`get_projects` / `get_budget_summary` / `get_top_projects`) then renders
  the bar chart, arriving after Output 1 since it waits on the subagent.
  Data from `templates/examples/ict_budget_2569.table.json`.

All are plain React via CDN (no build step) — open through a local server
(e.g. `python3 -m http.server` from the repo root), not `file://`, since they
`fetch()` the template JSON by relative path.

`models/graph.html` mocks the flow diagrammed in
`../../docs/architecture/dual-output-flow.jpeg`.

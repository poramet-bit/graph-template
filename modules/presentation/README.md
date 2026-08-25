# presentation

Renders the JSON produced by `ai_layer` (matching a schema in `../../templates/`)
into an actual chart/table on screen, using Chart.js, Recharts, or similar.

Status: not yet implemented for the real pipeline. See `templates/examples/`
for the JSON shape each renderer must accept.

## Mockups

- `react_demo.html` — single-layout demo (table then bar chart), used to test
  the two-phase render idea from skip.md (table fast, sub agent fills the chart
  after).
- `models/` — three variants of the same dual-output mockup, one per chart
  type, open `models/index.html` to pick one. All match the
  `User → Go Backend → MCP Server → Subagent → Frontend` architecture in
  `../../docs/architecture/dual-output-flow.jpeg`: a 5-stage stepper, then
  two panels side by side — Output 1 streams a text summary (typewriter
  effect), Output 2 lights up a 3-subagent pipeline then renders the chart,
  arriving after Output 1 since it waits on the subagent.
  - `graph.html` — bar chart (top 5 projects by spend, `bar_chart.schema.json`)
  - `model2.html` — pie/donut chart (spend by mission category, `pie_chart.schema.json`)
  - `model3.html` — line chart (cumulative spend by project code, `line_chart.schema.json`)

  Data from `templates/examples/ict_budget_2569.table.json`.
- `models/nexora.html` — dark admin-panel visual clone matching the
  reference Nexora Control Center screenshots, wired to the real project
  data. Two working pages via the sidebar nav: **Dashboard** (KPI cards +
  bar chart + pie chart + top-overrun list) and **Projects** (filterable/
  searchable table with a right-side detail panel on row click).

All are plain React via CDN (no build step) — open through a local server
(e.g. `python3 -m http.server` from the repo root), not `file://`, since they
`fetch()` the template JSON by relative path.

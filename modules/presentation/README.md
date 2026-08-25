# presentation

Renders the JSON produced by `ai_layer` (matching a schema in `../../templates/`)
into an actual chart/table on screen, using Chart.js, Recharts, or similar.

Status: not yet implemented for the real pipeline. See `templates/examples/`
for the JSON shape each renderer must accept.

## Mockups

- `react_demo.html` — single-layout demo (table then bar chart), used to test
  the two-phase render idea from skip.md (table fast, sub agent fills the chart
  after).
- `models/graph.html` — graphs only, no table/KPI chrome. Shows the data flow
  directly: a flow strip (`table.schema.json` fetch → sub agent derives
  `bar_chart`/`pie_chart` → render) above a bar chart and a pie chart, both
  sourced from `templates/examples/ict_budget_2569.table.json`.

All are plain React via CDN (no build step) — open through a local server
(e.g. `python3 -m http.server` from the repo root), not `file://`, since they
`fetch()` the template JSON by relative path.

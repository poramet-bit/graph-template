# presentation

Renders the JSON produced by `ai_layer` (matching a schema in `../../templates/`)
into an actual chart/table on screen, using Chart.js, Recharts, or similar.

Status: not yet implemented for the real pipeline. See `templates/examples/`
for the JSON shape each renderer must accept. `models/dashboard.html` is the
generic reference renderer — see `../../templates/dashboard_layout.schema.json`
for the config contract it consumes.

## Mockups

All front-end mockups live in `models/` — open `models/index.html` to pick
one. They're plain React via CDN (no build step); open through a local
server (e.g. `python3 -m http.server` from the repo root), not `file://`,
since they `fetch()` template JSON by relative path.

### Main dashboard (generic template)

- `models/dashboard.html` — the reusable dashboard template. It has no
  ICT-budget-specific code: it fetches a `templates/dashboard_layout.schema.json`
  config (default `templates/examples/dashboard_layout.example.json`, override
  with `?config=path/to/your.json`), packs each widget into rows by its
  declared `size` (`quarter`/`half`/`full`), and dispatches purely on each
  widget's own `data.type` to a renderer for `stat_card`, `gauge`, `pie`,
  `bar`, `line`, `area`, `stacked_bar`, or `table` — i.e. every schema in
  `../../templates/`. Drop in any conformant widget JSON (any domain, any
  language) and it renders unchanged. Dark theme; categorical colors come
  from the data itself (each widget's own `backgroundColor`/`borderColor`),
  falling back to a `dataviz`-validated palette only when a widget omits one.

### Dual-output flow

Three variants of the same mockup, one per chart type, matching the
`User → Go Backend → MCP Server → Subagent → Frontend` architecture in
`../../docs/architecture/dual-output-flow.jpeg`: a 5-stage stepper, then
two panels side by side — Output 1 streams a text summary (typewriter
effect), Output 2 lights up a 3-subagent pipeline then renders the chart,
arriving after Output 1 since it waits on the subagent.

- `models/flow-bar.html` — bar chart (top 5 projects by spend, `bar_chart.schema.json`)
- `models/flow-pie.html` — pie/donut chart (spend by mission category, `pie_chart.schema.json`)
- `models/flow-line.html` — line chart (cumulative spend by project code, `line_chart.schema.json`)

### UI clone (legacy)

- `models/dashboard-legacy.html` — dark admin-panel visual clone matching the
  reference Nexora Control Center screenshots, wired to the real project
  data. Two working pages via the sidebar nav: **Dashboard** (KPI cards +
  bar chart + pie chart + top-overrun list) and **Projects** (filterable/
  searchable table with a right-side detail panel on row click). Replaced by
  `models/dashboard.html` as the main dashboard; kept around because the
  Projects page (filter/search/detail panel) has no equivalent there yet.

### New schema types

- `models/insights.html` — one page filling all 4 newer schema types
  with real numbers computed from the same table: `gauge_chart.schema.json`
  (disbursement rate, with good/warning/critical zones), `stat_card.schema.json`
  ×4 (KPI row), `stacked_bar_chart.schema.json` (used vs remaining budget per
  mission category), `area_chart.schema.json` (cumulative spend by project
  code).

All mockups read `templates/examples/ict_budget_2569.table.json`.

# @poramet/dashboard-widgets

Config-driven React dashboard widgets, extracted from
`modules/presentation/models/dashboard.html`. Renders the same
`dashboard_layout.schema.json` widget config the HTML template consumes,
as real npm-installable components.

## Install

```bash
npm install @poramet/dashboard-widgets react react-dom
```

## Usage

```jsx
import { DashboardGrid } from "@poramet/dashboard-widgets";
import "@poramet/dashboard-widgets/styles.css";

function App({ config }) {
  return (
    <div>
      <h1>{config.title}</h1>
      <DashboardGrid widgets={config.widgets} />
    </div>
  );
}
```

`config.widgets` is an array of `{ size: "quarter" | "half" | undefined, data: {...} }`
entries — see `templates/dashboard_layout.schema.json` and
`templates/examples/dashboard_layout.example.json` in this repo for the
full shape. `DashboardGrid` packs widgets into rows by `size` and renders
each through `<Widget>`, which dispatches on `data.type`:
`stat_card`, `gauge`, `pie`, `bar`, `stacked_bar`, `line`, `area`, `table`.

## Exports

- `DashboardGrid`, `Widget` — layout + dispatch
- `StatCard`, `Gauge`, `Donut`, `GroupedBar`, `StackedBar`, `XYChart`
  (+ `LineChart`, `AreaChart`), `Table` — individual widgets, usable standalone
- `fmtNumber`, `fmtCompact`, `fmtValue`, `niceMax`, `topRoundedRectPath`,
  `polarPoint`, `valueToAngle`, `packRows`, `widgetSubtitle` — formatting
  and chart-math helpers

`styles.css` ships the dark theme (`:root` CSS vars: `--bg`, `--surface`,
`--accent`, `--good`/`--warning`/`--critical`, `--chart-1..4`, etc.) and all
component classes. Override the vars to retheme.

## Build

```bash
npm install
npm run build   # tsup -> dist/{index.js,index.cjs,index.d.ts,styles.css}
```

## Scope note

This package only covers the generic widgets from `dashboard.html`.
`dashboard-legacy.html` (ICT Budget Control Center) has app-specific
components (Sidebar, Topbar, DetailPanel, CSV export) that were left out —
they're hardcoded to that one dataset and would need generalizing first.

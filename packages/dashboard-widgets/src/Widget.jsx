import React from "react";
import { StatCard } from "./StatCard.jsx";
import { Gauge } from "./Gauge.jsx";
import { Donut } from "./Donut.jsx";
import { GroupedBar } from "./GroupedBar.jsx";
import { StackedBar } from "./StackedBar.jsx";
import { XYChart } from "./XYChart.jsx";
import { Table } from "./Table.jsx";
import { widgetSubtitle } from "./utils.js";

const BODY_BY_TYPE = {
  gauge: Gauge,
  pie: Donut,
  bar: GroupedBar,
  stacked_bar: StackedBar,
  line: ({ d }) => <XYChart d={d} mode="line" />,
  area: ({ d }) => <XYChart d={d} mode="area" />,
  table: Table,
};

// dispatches a single widget config (dashboard_layout.schema.json "widget.data")
// to the matching chart body, wrapped in the shared card chrome
export function Widget({ widget }) {
  const d = widget.data;
  if (d.type === "stat_card") return <StatCard d={d} />;

  const Body = BODY_BY_TYPE[d.type];
  const sub = widgetSubtitle(d);
  return (
    <div className="card">
      <div className="card-head"><h2>{d.title}</h2><span className="schema-tag">{d.type}</span></div>
      {sub && <p className="card-sub">{sub}</p>}
      {Body ? <Body d={d} /> : <p className="card-sub">Unknown widget type "{d.type}"</p>}
    </div>
  );
}

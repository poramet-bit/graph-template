import React from "react";
import { Widget } from "./Widget.jsx";
import { packRows } from "./utils.js";

// packs `widgets` (each { size: "quarter"|"half"|<falsy>, data: {...} }) into
// rows via packRows(), then renders every row through <Widget>
export function DashboardGrid({ widgets }) {
  const rows = packRows(widgets);
  return (
    <React.Fragment>
      {rows.map((row, ri) => (
        <div className={`widget-row row-cols-${row.cols}`} key={ri}>
          {row.items.map((w, wi) => <Widget widget={w} key={wi} />)}
        </div>
      ))}
    </React.Fragment>
  );
}

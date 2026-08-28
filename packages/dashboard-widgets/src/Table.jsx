import React from "react";
import { fmtValue } from "./utils.js";

const NUM_FORMATS = new Set(["number", "currency", "percent"]);

export function Table({ d }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>{d.columns.map(c => (<th key={c.key} className={NUM_FORMATS.has(c.format) ? "num" : ""}>{c.label}</th>))}</tr>
        </thead>
        <tbody>
          {d.rows.map((row, ri) => (
            <tr key={ri}>
              {d.columns.map(c => (<td key={c.key} className={NUM_FORMATS.has(c.format) ? "num" : ""}>{fmtValue(row[c.key], c.format)}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import "./index.css";

export default function KeyValueList({ items, columns = 2, className = "" }) {
  return (
    <dl
      className={`kvl ${className}`.trim()}
      style={{ gridTemplateColumns: `repeat(${columns}, auto 1fr)` }}
    >
      {items.map((it, idx) => {
        const key = it.label ?? idx;
        if (it.full) {
          return (
            <div key={key} className="kvl-row-full">
              <dt className="kvl-dt">{it.label}</dt>
              <dd className="kvl-dd">{it.value ?? "—"}</dd>
            </div>
          );
        }
        return (
          <React.Fragment key={key}>
            <dt className="kvl-dt">{it.label}</dt>
            <dd className="kvl-dd">{it.value ?? "—"}</dd>
          </React.Fragment>
        );
      })}
    </dl>
  );
}

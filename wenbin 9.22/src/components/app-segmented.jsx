import { useState } from "react";

// TODO(eview-react): Segmented 无对应组件，手写分段控件。
// props: value, onChange(value), options=[{label, value}], size
export default function AppSegmented({ value, onChange, options = [], size, className = "" }) {
  return (
    <div className={`app-segmented ${size === "small" ? "app-segmented-sm" : ""} ${className}`.trim()}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className={`app-segmented-item${active ? " active" : ""}`}
            onClick={() => onChange && onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

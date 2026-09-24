import { Icon } from "../shared/icon.jsx";

// TODO(eview-react): CheckboxGroup 无 Reference，当前手写复选组。
// 契约：options=[{text,value}]，value=[]，onChange(value[])，兼容源项目 Checkbox.Group options 写法。

export default function CheckGroup({ options = [], value = [], onChange }) {
  const toggle = (v) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
      {options.map((o) => {
        const checked = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 8px",
              border: "1px solid var(--divider)",
              borderRadius: "var(--radius-base)",
              background: checked ? "var(--color-select)" : "transparent",
              color: checked ? "var(--color-text-on)" : "var(--on-surface)",
              fontSize: "var(--font-size-md)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "var(--radius-xs)",
                border: checked ? "none" : "1px solid var(--color-border)",
                background: checked ? "var(--primary)" : "transparent",
                color: "var(--on-primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
              }}
            >
              {checked ? <Icon name="check" size={12} color="var(--on-primary)" /> : null}
            </span>
            {o.text}
          </button>
        );
      })}
    </div>
  );
}

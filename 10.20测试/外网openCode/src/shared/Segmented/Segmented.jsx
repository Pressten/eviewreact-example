import "./Segmented.css";

export default function Segmented({ options = [], value, onChange, size, className }) {
  return (
    <div
      className={
        "app-segmented" + (size === "small" ? " app-segmented-sm" : "") + (className ? ` ${className}` : "")
      }
    >
      <div className="app-segmented-group">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={
              "app-segmented-item" +
              (value === opt.value ? " app-segmented-item-selected" : "")
            }
            onClick={() => onChange?.(opt.value)}
          >
            <span className="app-segmented-item-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

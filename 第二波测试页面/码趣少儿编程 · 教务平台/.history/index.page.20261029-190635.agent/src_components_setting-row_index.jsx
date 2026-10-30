import "./index.css";

// Layer 3: 通用设置行 — 左侧标签+说明，右侧控件
// control 为 ReactNode（Switch / Slider / Radio 等）；status 为可选状态回显文案。
export default function SettingRow({ label, description, status, statusOn, control, labelFor }) {
  return (
    <div className="setting-row">
      <div className="setting-row__info">
        <label className="setting-row__label" htmlFor={labelFor}>
          {label}
        </label>
        {description && <p className="setting-row__desc">{description}</p>}
      </div>
      <div className="setting-row__control">
        {status && (
          <span className={`setting-row__status${statusOn ? " is-on" : " is-off"}`}>{status}</span>
        )}
        {control}
      </div>
    </div>
  );
}

import { confirmGroups, labelMaps } from "../../data.js";

// Layer 4: 步骤三 — 确认提交(只读回显,不做输入)
function displayValue(key, value) {
  if (value === undefined || value === null || value === "") return "—";
  const map = labelMaps[key];
  return map ? map[String(value)] : String(value);
}

export default function ConfirmForm({ values }) {
  return (
    <div className="step-form">
      <div className="confirm-alert" role="status">
        请核对以下配置信息,提交后设备将进入接入调试队列
      </div>
      {confirmGroups.map((group) => (
        <section key={group.key} className="confirm-group">
          <h3>{group.title}</h3>
          <dl className="confirm-list">
          {group.fields.map(([key, label]) => (
            <div className="confirm-item" key={key}>
              <dt>{label}</dt>
              <dd>{displayValue(key, values[key])}</dd>
            </div>
          ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

import DivMessage from "@nce/eview-react/DivMessage";
import { confirmGroups, labelMaps } from "../../data.js";

// Layer 4: 步骤三 — 确认提交(只读回显,不做输入)
function displayValue(key, value) {
  if (value === undefined || value === null || value === "") return "—";
  const map = labelMaps[key];
  return map ? map[String(value)] : String(value);
}

// TODO(eview-react): 键值详情块组件未覆盖,当前手写
function KeyValueList({ items, columns = 2 }) {
  return (
    <dl
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, auto 1fr)`,
        gap: "12px 16px",
        margin: 0,
      }}
    >
      {items.map((it) => [
        <dt
          key={it.label}
          style={{ color: "var(--on-surface-variant)", whiteSpace: "nowrap" }}
        >
          {it.label}
        </dt>,
        <dd key={it.label + "-v"} style={{ margin: 0, color: "var(--on-surface)" }}>
          {it.value ?? "—"}
        </dd>,
      ])}
    </dl>
  );
}

export default function ConfirmForm({ values }) {
  return (
    <div className="step-form">
      <DivMessage display type="default" showIcon className="confirm-alert">
        请核对以下配置信息,提交后设备将进入接入调试队列
      </DivMessage>
      {confirmGroups.map((group) => (
        <div key={group.key} className="confirm-group">
          <h4 className="confirm-group-title">{group.title}</h4>
          <KeyValueList
            items={group.fields.map(([key, label]) => ({
              label,
              value: displayValue(key, values[key]),
            }))}
            columns={2}
          />
        </div>
      ))}
    </div>
  );
}

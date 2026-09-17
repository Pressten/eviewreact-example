import { Fragment } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import { confirmGroups, labelMaps } from "../../data.js";

// Layer 4: 步骤三 — 确认提交(只读回显,不做输入)
// Descriptions 无对应(eview-react 无导出),手写键值详情块(dl/dt/dd + CSS 变量)
// Alert → DivMessage(display 控制; type 只有 default/success/error/warn, info 用 default 替代)

function displayValue(key, value) {
  if (value === undefined || value === null || value === "") return "—";
  const map = labelMaps[key];
  return map ? map[String(value)] : String(value);
}

function KeyValueList({ items, columns = 2 }) {
  return (
    <dl
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(120px, auto) 1fr)`,
        gap: "var(--spacing-3) var(--spacing-gutter)",
        margin: 0,
      }}
    >
      {items.map((it) => (
        <Fragment key={it.label}>
          <dt style={{ color: "var(--on-surface-variant)", whiteSpace: "nowrap" }}>
            {it.label}
          </dt>
          <dd style={{ margin: 0, color: "var(--on-surface)" }}>{it.value ?? "—"}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export default function ConfirmForm({ values }) {
  return (
    <div className="step-form">
      <DivMessage
        display
        type="default"
        enableDisposeTimeOut={false}
        className="confirm-alert"
        text="请核对以下配置信息,提交后设备将进入接入调试队列"
      />

      {confirmGroups.map((group) => (
        <div key={group.key} className="confirm-group">
          <div
            style={{
              font: "var(--font-headline-s)",
              color: "var(--on-surface)",
              marginBottom: "var(--spacing-stack)",
            }}
          >
            {group.title}
          </div>
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

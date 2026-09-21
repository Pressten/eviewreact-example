import React from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import { confirmGroups, labelMaps } from "../../data.js";

// TODO(eview-react): Descriptions 未覆盖，当前手写键值详情块（dl/dt/dd + CSS 变量）
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
      {items.map((it) => (
        <React.Fragment key={it.label}>
          <dt style={{ color: "var(--on-surface-variant)", whiteSpace: "nowrap" }}>{it.label}</dt>
          <dd style={{ margin: 0, color: "var(--on-surface)" }}>{it.value ?? "—"}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

// Layer 4: 步骤三 — 确认提交(只读回显,不做输入)
function displayValue(key, value) {
  if (value === undefined || value === null || value === "") return "—";
  const map = labelMaps[key];
  return map ? map[String(value)] : String(value);
}

export default function ConfirmForm({ values }) {
  return (
    <div className="step-form">
      <DivMessage
        display
        type="default"
        showIcon
        enableDisposeTimeOut={false}
        message="请核对以下配置信息,提交后设备将进入接入调试队列"
        className="confirm-alert"
      />
      {confirmGroups.map((group) => (
        <div key={group.key} className="confirm-group">
          <div
            style={{
              fontWeight: "var(--font-weight-medium)",
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

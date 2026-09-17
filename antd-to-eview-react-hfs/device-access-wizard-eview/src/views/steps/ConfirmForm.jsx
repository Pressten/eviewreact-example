// Layer 4: 步骤三 — 确认提交(只读回显,不做输入)
// Descriptions 在 eview-react 无对应,手写键值详情块;Alert→DivMessage(常驻)
import { Fragment } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import { confirmGroups, labelMaps } from "../../data.js";

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
        enableDisposeTimeOut={false}
        text="请核对以下配置信息,提交后设备将进入接入调试队列"
        className="confirm-alert"
      />
      {/* TODO(eview-react): Descriptions 无对应,手写键值详情块 */}
      {confirmGroups.map((group) => (
        <section key={group.key} className="confirm-group">
          <h3 className="confirm-group-title">{group.title}</h3>
          <dl className="confirm-kv">
            {group.fields.map(([key, label]) => (
              <Fragment key={key}>
                <dt className="confirm-kv-label">{label}</dt>
                <dd className="confirm-kv-value">{displayValue(key, values[key])}</dd>
              </Fragment>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

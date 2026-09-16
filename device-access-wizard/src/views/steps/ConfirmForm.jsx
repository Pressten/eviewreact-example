import { Fragment } from "react";
import DivMessage from "@nce/eview-react/DivMessage";
import { confirmGroups, labelMaps } from "../../data.js";

// Layer 4: 步骤三 — 确认提交(只读回显,不做输入)
// antd Alert → DivMessage(display 控制,enableDisposeTimeOut={false} 常驻;type 无 info,用 default)。
// antd Descriptions → 手写 dl/dt/dd 键值详情块(eview-react 无导出)。
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
        className="confirm-alert"
      >
        请核对以下配置信息,提交后设备将进入接入调试队列
      </DivMessage>

      {confirmGroups.map((group) => (
        <dl key={group.key} className="confirm-list">
          <dt className="confirm-list-title">{group.title}</dt>
          <div className="confirm-list-grid">
            {group.fields.map(([key, label]) => (
              <Fragment key={key}>
                <dt>{label}</dt>
                <dd>{displayValue(key, values[key])}</dd>
              </Fragment>
            ))}
          </div>
        </dl>
      ))}
    </div>
  );
}

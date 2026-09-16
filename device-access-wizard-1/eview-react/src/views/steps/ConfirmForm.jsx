import DivMessage from '@nce/eview-react/DivMessage';
import { KeyValueList } from '../../components/KeyValueList';
import { confirmGroups, labelMaps } from '../../data';

// 步骤三 — 确认提交（只读回显，不做输入）
// 转换要点：
//   - Alert type="info" → DivMessage type="default"（DivMessage 只有 default/success/error/warn）
//     常驻提示需 enableDisposeTimeOut={false}（默认 10s 消失）
//   - Descriptions → 手写 KeyValueList（handwrite-templates §3）
function displayValue(key, value) {
  if (value === undefined || value === null || value === '') return '—';
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
        <div key={group.key} className="confirm-group">
          <div className="confirm-group-title">{group.title}</div>
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

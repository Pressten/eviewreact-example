import { Fragment } from 'react';
import Icon from '../../components/Icon.jsx';
import { confirmGroups, labelMaps } from '../../data.js';

// 步骤三 — 确认提交（只读回显，不做输入）。
// antd Descriptions 无对应 → 手写键值详情块（dl/dt/dd + CSS 变量）。
// antd Alert（页面常驻公告）→ 不用 DivMessage（其设计为 10s 自动消失的轻量提示），
//   手写常驻信息条，用 info 语义 token。
function displayValue(key, value) {
    if (value === undefined || value === null || value === '') return '—';
    const map = labelMaps[key];
    return map ? map[String(value)] : String(value);
}

function KeyValueList({ title, fields, values, columns = 2 }) {
    return (
        <section className="confirm-group">
            <h3 className="confirm-group-title">{title}</h3>
            <dl
                className="app-keyvalue"
                style={{ gridTemplateColumns: `repeat(${columns}, auto 1fr)` }}
            >
                {fields.map(([key, label]) => (
                    <Fragment key={key}>
                        <dt className="app-keyvalue-dt">{label}</dt>
                        <dd className="app-keyvalue-dd">{displayValue(key, values[key])}</dd>
                    </Fragment>
                ))}
            </dl>
        </section>
    );
}

export default function ConfirmForm({ values }) {
    return (
        <div className="step-form">
            <div className="app-alert">
                <Icon name="bell" size={16} className="app-alert-icon" />
                <span>请核对以下配置信息,提交后设备将进入接入调试队列</span>
            </div>
            {confirmGroups.map((group) => (
                <KeyValueList
                    key={group.key}
                    title={group.title}
                    fields={group.fields}
                    values={values}
                />
            ))}
        </div>
    );
}

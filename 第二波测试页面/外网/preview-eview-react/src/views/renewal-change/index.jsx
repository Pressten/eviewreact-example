import { useState } from "react";
import { IconPlusIcDigitalPowerDpCheck, IconPlusIcDigitalPowerDpUserCluster, IconPlusIcIctAgreement, IconPlusIcPublicMoneyCircle, IconPlusIcPublicRefreshClockwise } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import Button from "@nce/eview-react/Button";
import DivMessage from "@nce/eview-react/DivMessage";
import SectionBlock from "../../components/section-block/index.jsx";
import { renewal } from "../../mock/data.js";
import "./index.css";

const ACTION_COLOR = {
  续约: "green",
  升配: "blue",
  降配: "gray",
  暂停: "red",
  恢复: "green",
};
const ACTION_TAG = {
  续约: { color: "success", text: "续约" },
  升配: { color: "processing", text: "升配" },
  降配: { color: "default", text: "降配" },
  暂停: { color: "error", text: "暂停" },
  恢复: { color: "success", text: "恢复" },
};

// 手写圆形进度条（antd Progress type="circle" 无 eview-react 对应）
function CircleProgress({ percent, size = 80 }) {
  const p = Math.min(100, Math.max(0, percent));
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (p / 100) * circumference;
  return (
    <div className="cb-rc-circle" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={6}
          className="cb-rc-circle-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="cb-rc-circle-progress"
        />
      </svg>
      <span className="cb-rc-circle-text">{p}%</span>
    </div>
  );
}

// 手写时间轴（antd Timeline 无对应 Reference，按竖线 + 节点圆点 + 内容列表手写）
const DOT_COLOR_CLASS = {
  green: "cb-rc-tl-dot-success",
  blue: "cb-rc-tl-dot-info",
  gray: "cb-rc-tl-dot-default",
  red: "cb-rc-tl-dot-error",
};
function Timeline({ items }) {
  return (
    <div className="cb-rc-timeline">
      {items.map((it, i) => (
        <div className="cb-rc-tl-node" key={i}>
          <span className={`cb-rc-tl-dot ${DOT_COLOR_CLASS[it.color] || "cb-rc-tl-dot-default"}`} />
          {it.children}
        </div>
      ))}
    </div>
  );
}

export default function RenewalChange() {
  const [selected, setSelected] = useState("flagship");
  // DivMessage 渲染式通知（替代 antd 命令式 message）
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });
  const closeNotice = () => setNotice(null);

  return (
    <SectionBlock
      id="renewal-change"
      title="续约与变更"
      icon={<IconPlusIcPublicRefreshClockwise iconSize="1.25rem" iconColor={['#0067D1']} />}
    >
      <div className="cb-rc-countdown">
        <div className="cb-rc-cd-left">
          <div className="cb-rc-cd-date-block">
            <div className="cb-rc-cd-label">合同到期日</div>
            <div className="cb-rc-cd-date">{renewal.expireDate}</div>
            <div className="cb-rc-cd-days">剩余 <strong>{renewal.renewalDays}</strong> 天</div>
          </div>
        </div>
        <div className="cb-rc-cd-right">
          <div className="cb-rc-cd-progress">
            <CircleProgress percent={renewal.progress} size={80} />
            <div className="cb-rc-cd-progress-info">
              <div className="cb-rc-cd-progress-text">合同进度 {renewal.progress}%</div>
              <div className="cb-rc-cd-warn">即将到期，建议尽快续约</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cb-rc-plans-title">推荐续约方案</div>
      <div className="cb-rc-plans">
        {renewal.plans.map((p) => {
          const isSel = selected === p.key;
          return (
            <div className={`cb-rc-plan ${isSel ? "cb-rc-plan-sel" : ""}`} key={p.key}>
              {p.highlight && <Tag color="processing" className="cb-rc-plan-badge">推荐</Tag>}
              <div className="cb-rc-plan-name">{p.name}</div>
              <div className="cb-rc-plan-price">
                <span className="cb-rc-plan-fee">{p.monthlyFee}</span>
                <span className="cb-rc-plan-unit">/ 月</span>
              </div>
              <div className="cb-rc-plan-rows">
                <div className="cb-rc-plan-row">
                  <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} />
                  <span>座位数</span>
                  <strong>{p.seats} 个</strong>
                </div>
                <div className="cb-rc-plan-row">
                  <IconPlusIcPublicMoneyCircle iconSize="0.875rem" iconColor={['currentcolor']} />
                  <span>节省说明</span>
                  <strong>{p.save}</strong>
                </div>
              </div>
              <Button
                status={isSel ? "primary" : "default"}
                leftIcon={isSel ? <IconPlusIcDigitalPowerDpCheck iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcIctAgreement iconSize="0.875rem" iconColor={['currentcolor']} />}
                text={isSel ? "已选择此方案" : "选择此方案"}
                onClick={() => {
                  setSelected(p.key);
                  notify("success", `已选择「${p.name}」，客户经理将发送正式方案`);
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="cb-rc-history">
        <div className="cb-rc-plans-title">历史变更记录</div>
        <Timeline
          className="cb-rc-timeline"
          items={renewal.history.map((h) => ({
            color: ACTION_COLOR[h.action],
            children: (
              <div className="cb-rc-tl-item">
                <div className="cb-rc-tl-head">
                  <span className="cb-rc-tl-time">{h.time}</span>
                  <Tag color={ACTION_TAG[h.action].color}>{h.action}</Tag>
                </div>
                <div className="cb-rc-tl-desc">{h.desc}</div>
                <div className="cb-rc-tl-operator">操作人：{h.operator}</div>
              </div>
            ),
          }))}
        />
      </div>

      {notice ? (
        <div className="cb-notice-floating">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={closeNotice}
          />
        </div>
      ) : null}
    </SectionBlock>
  );
}

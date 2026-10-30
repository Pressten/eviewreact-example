import { useState } from "react";
import { Progress, Tag, Button, Timeline, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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

export default function RenewalChange() {
  const [selected, setSelected] = useState("flagship");

  return (
    <SectionBlock
      id="renewal-change"
      title="续约与变更"
      icon={<Icon name="refresh-cw" size="1.25rem" color="#0067D1" />}
    >
      <div className="cb-rc-countdown">
        <div className="cb-rc-cd-date-block">
          <div className="cb-rc-cd-label">合同到期日</div>
          <div className="cb-rc-cd-date">{renewal.expireDate}</div>
        </div>
        <div className="cb-rc-cd-days-block">
          <div className="cb-rc-cd-days-num">{renewal.renewalDays}</div>
          <div className="cb-rc-cd-days-text">剩余天数</div>
        </div>
        <div className="cb-rc-cd-progress">
          <div className="cb-rc-cd-progress-label">
            <span>合同进度</span>
            <span className="cb-rc-cd-warn">即将到期，建议尽快续约</span>
          </div>
          <Progress
            percent={renewal.progress}
            status="exception"
            strokeColor={{ from: "#F4840C", to: "#E02128" }}
          />
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
                  <Icon name="users" size="0.875rem" />
                  <span>座位数</span>
                  <strong>{p.seats} 个</strong>
                </div>
                <div className="cb-rc-plan-row">
                  <Icon name="piggy-bank" size="0.875rem" />
                  <span>节省说明</span>
                  <strong>{p.save}</strong>
                </div>
              </div>
              <Button
                type={isSel ? "primary" : "default"}
                block
                icon={<Icon name={isSel ? "circle-check-big" : "handshake"} size="0.875rem" />}
                onClick={() => {
                  setSelected(p.key);
                  message.success(`已选择「${p.name}」，客户经理将发送正式方案`);
                }}
              >
                {isSel ? "已选择此方案" : "选择此方案"}
              </Button>
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
    </SectionBlock>
  );
}

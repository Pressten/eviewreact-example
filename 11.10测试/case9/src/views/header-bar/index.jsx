import { useEffect, useState } from "react";
import { Badge, Button, Segmented, Select, Tag } from "antd";
import dayjs from "dayjs";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { fmtDur } from "../../mock/alarms.js";
import { RANGE_LABELS } from "../../mock/metrics.js";
import "./index.css";

const RANGE_OPTIONS = Object.keys(RANGE_LABELS).map((value) => ({ value, label: RANGE_LABELS[value] }));
const REFRESH_OPTIONS = [
  { value: 10, label: "10 秒" },
  { value: 30, label: "30 秒" },
  { value: 60, label: "1 分钟" },
];

// ① 顶部状态栏：环境切换 / 时间范围 / 刷新频率 / 值班人 / 告警静默
export default function HeaderBar() {
  const app = useApp();
  const [now, setNow] = useState(() => dayjs());

  // 值班墙实时时钟（局部状态，避免全局重渲染）
  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const firingCount = app.alarms.filter((a) => a.status === "firing").length;
  const p0List = app.alarms.filter((a) => a.level === "P0" && a.status === "firing");
  const p0Top = p0List[0];

  const jumpToAlarms = () => {
    const el = document.getElementById("alarm-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="noc-header">
      <div className="nh-row">
        <div className="nh-group nh-left">
          <span className="nh-logo">
            <Icon name="activity" size="1.25rem" />
          </span>
          <span className="nh-title">
            NOC 监控中心<i>互联网 IT 运维 · 7×24 值班</i>
          </span>
          <Segmented
            value={app.env}
            onChange={(v) => app.setEnv(v)}
            options={[
              { label: "生产环境", value: "prod" },
              { label: "预发环境", value: "staging" },
            ]}
          />
          <Tag className={app.env === "prod" ? "env-tag env-prod" : "env-tag env-staging"}>
            {app.env === "prod" ? "PROD" : "STAGING"}
          </Tag>
        </div>
        <div className="nh-group nh-right">
          <span className="nh-live">
            <i className="live-dot" />
            实时
          </span>
          <Select className="nh-select" value={app.timeRange} onChange={app.setTimeRange} options={RANGE_OPTIONS} />
          <Select
            className="nh-select"
            value={app.refreshRate}
            onChange={app.setRefreshRate}
            options={REFRESH_OPTIONS}
          />
          <Icon name="refresh-cw" size="1rem" className="nh-refresh" title="手动刷新" onClick={app.manualRefresh} />
          <span className="nh-caption">最后刷新 {app.lastRefresh.format("HH:mm:ss")}</span>
          <span className="nh-clock">{now.format("HH:mm:ss")}</span>
          <span className="nh-divider" />
          <button type="button" className="nh-bell" title="查看触发中告警" onClick={jumpToAlarms}>
            <Badge count={firingCount} size="small">
              <Icon name="bell" size="1.25rem" />
            </Badge>
          </button>
          <div className="nh-duty">
            <Badge dot status="success">
              <img className="nh-avatar" src="./assets/uploads/user.png" alt="当前值班人" />
            </Badge>
            <div className="nh-duty-info">
              <span className="nh-duty-name">张伟</span>
              <span className="nh-duty-shift">白班 08:00–20:00 · 20:00 交接</span>
            </div>
          </div>
          <Icon
            name={app.isDark ? "sun" : "moon"}
            size="1.25rem"
            className="nh-theme"
            title="切换深色 / 浅色"
            onClick={app.toggleDark}
          />
          <Button danger icon={<Icon name="bell-off" size="0.875rem" />} onClick={() => app.openSilence(null)}>
            告警静默
          </Button>
        </div>
      </div>
      {/* P0 事故横幅：异常信息最高层级（仅生产环境出现，环境切换联动） */}
      {p0Top ? (
        <div className="noc-incident" role="button" tabIndex={0} onClick={jumpToAlarms}>
          <Icon name="siren" size="1rem" />
          <b>P0 事故 · 处置中</b>
          <span>
            {p0Top.strategyName} · {p0Top.targetName} · 触发值 {p0Top.triggerValue} · 持续{" "}
            {fmtDur(p0Top.durationMin)}
            {p0List.length > 1 ? `（等 ${p0List.length} 条 P0）` : ""}
          </span>
          <span className="noc-incident-more">
            点击查看告警
            <Icon name="chevron-right" size="0.875rem" />
          </span>
        </div>
      ) : null}
    </header>
  );
}

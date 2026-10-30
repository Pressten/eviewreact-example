import { Segmented, Dropdown, Badge } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { TIME_RANGES, REFRESH_RATES, DUTY } from "../../mock/monitor.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// 区块① 顶部状态栏：环境切换 / 时间范围 / 刷新频率 / 值班人 / 告警静默 / 主题切换
export default function HeaderBar({ env, onEnvChange, timeRange, onTimeRangeChange, refreshRate, onRefreshRateChange, onOpenSilence, alertCount }) {
  const { isDark, toggleDark } = useApp();

  const timeMenu = {
    items: TIME_RANGES.map((r) => ({ key: r.key, label: r.label })),
    onClick: ({ key }) => onTimeRangeChange(key),
  };
  const refreshMenu = {
    items: REFRESH_RATES.map((r) => ({ key: r.key, label: r.label })),
    onClick: ({ key }) => onRefreshRateChange(key),
  };

  const timeLabel = TIME_RANGES.find((r) => r.key === timeRange)?.label || "近 1 小时";
  const refreshLabel = REFRESH_RATES.find((r) => r.key === refreshRate)?.label || "30 秒";

  return (
    <header className="header-bar">
      <div className="header-brand">
        <div className="brand-logo">
          <Icon name="activity" size="1.25rem" />
        </div>
        <div className="brand-text">
          <span className="brand-title">NOC 监控告警中心</span>
          <span className="brand-sub">互联网 IT 运维 · 7×24 值班</span>
        </div>
      </div>

      <div className="header-tools">
        <div className="env-switch">
          <span className="tool-label">环境</span>
          <Segmented
            size="middle"
            value={env}
            onChange={onEnvChange}
            options={[
              { label: "生产", value: "prod" },
              { label: "预发", value: "staging" },
            ]}
          />
        </div>

        <div className="tool-divider" />

        <Dropdown menu={timeMenu} trigger={["click"]}>
          <button className="tool-pill" type="button">
            <Icon name="clock" size="0.875rem" />
            <span>{timeLabel}</span>
            <Icon name="chevron-down" size="0.875rem" />
          </button>
        </Dropdown>

        <Dropdown menu={refreshMenu} trigger={["click"]}>
          <button className="tool-pill" type="button">
            <Icon name="refresh-cw" size="0.875rem" />
            <span>刷新 {refreshLabel}</span>
            <Icon name="chevron-down" size="0.875rem" />
          </button>
        </Dropdown>

        <div className="tool-divider" />

        <div className="duty-info">
          <img className="duty-avatar" src={DUTY.avatar} alt={DUTY.name} />
          <div className="duty-meta">
            <span className="duty-name">{DUTY.name}</span>
            <span className="duty-shift">交接 {DUTY.handoverTime} · 下一班 {DUTY.nextPerson}</span>
          </div>
        </div>

        <button className="icon-btn" type="button" onClick={toggleDark} title={isDark ? "切换浅色" : "切换深色"}>
          <Icon name={isDark ? "sun" : "moon"} size="1rem" />
        </button>
      </div>

      <div className="header-action">
        <Badge count={alertCount} offset={[-2, 2]}>
          <button className="icon-btn" type="button" title="待处理告警">
            <Icon name="bell" size="1rem" />
          </button>
        </Badge>
        <button className="silence-btn" type="button" onClick={onOpenSilence}>
          <Icon name="bell-off" size="0.875rem" />
          <span>告警静默</span>
        </button>
      </div>
    </header>
  );
}

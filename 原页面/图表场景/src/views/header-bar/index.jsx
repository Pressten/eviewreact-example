import { Menu, Button, Input, Select, Segmented, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { domainOptions, verdictOptions } from "../../mock/metrics.js";
import "./index.css";

// Layer 4: 顶部导航 + 页面筛选工具区
const NAV_ITEMS = [
  { key: "overview", icon: <Icon name="layout-dashboard" size={16} />, label: "运行总览" },
  { key: "metrics", icon: <Icon name="gauge" size={16} />, label: "指标判断" },
  { key: "quality", icon: <Icon name="shield-check" size={16} />, label: "质量分析" },
  { key: "report", icon: <Icon name="file-text" size={16} />, label: "报表中心" },
];

export default function HeaderBar({ filters, onChange, onReset, period, onPeriodChange }) {
  const { isDark, toggleDark } = useApp();

  return (
    <>
      <header className="header-bar">
        <div className="header-brand">
          <span className="header-logo">
            <Icon name="activity" size={18} />
          </span>
          <span className="header-brand-name">指标判断中心</span>
        </div>
        <Menu
          className="header-nav"
          mode="horizontal"
          selectedKeys={["metrics"]}
          items={NAV_ITEMS}
        />
        <div className="header-tools">
          <Tooltip title="数据周期 2026-09-21 08:00">
            <span className="header-sync">
              <Icon name="refresh-cw" size={14} />
              已同步
            </span>
          </Tooltip>
          <Button type="text" shape="circle" icon={<Icon name="bell" size={16} />} />
          <Button
            type="text"
            shape="circle"
            onClick={toggleDark}
            icon={<Icon name={isDark ? "sun" : "moon"} size={16} />}
          />
          <span className="header-user">
            <img src="./assets/uploads/user.png" alt="用户头像" />
          </span>
        </div>
      </header>

      <div className="header-filters">
        <div className="page-head">
          <div className="page-head-title">
            <h1>数据指标判断</h1>
            <p>基于达成率阈值自动判定指标健康度，定位预警与异常项并下钻归因</p>
          </div>
          <div className="page-head-actions">
            <Button icon={<Icon name="download" size={14} />}>导出报告</Button>
            <Button type="primary" icon={<Icon name="play" size={14} />}>
              执行判断
            </Button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <Segmented
              value={period}
              onChange={onPeriodChange}
              options={["实时", "日", "周", "月", "季"]}
            />
          </div>
          <div className="filter-divider" />
          <Select
            className="filter-select"
            value={filters.domain}
            onChange={(v) => onChange({ ...filters, domain: v })}
            options={domainOptions}
          />
          <Select
            className="filter-select"
            value={filters.verdict}
            onChange={(v) => onChange({ ...filters, verdict: v })}
            options={verdictOptions}
          />
          <Input
            className="filter-search"
            value={filters.keyword}
            onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
            placeholder="搜索指标名称 / 编码 / 责任人"
            suffix={<Icon name="search" size={14} color="var(--text-placeholder)" />}
          />
          <Button onClick={onReset} icon={<Icon name="rotate-ccw" size={14} />}>
            重置
          </Button>
        </div>
      </div>
    </>
  );
}

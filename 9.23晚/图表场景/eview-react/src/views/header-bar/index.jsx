import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import SearchInput from "@nce/eview-react/SearchInput";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { domainOptions, verdictOptions } from "../../mock/metrics.js";
import "./index.css";

// Layer 4: 顶部导航 + 页面筛选工具区
// TODO(eview-react): antd Menu 无对应组件，当前手写水平导航
const NAV_ITEMS = [
  { key: "overview", icon: "layout-dashboard", label: "运行总览" },
  { key: "metrics", icon: "gauge", label: "指标判断" },
  { key: "quality", icon: "shield-check", label: "质量分析" },
  { key: "report", icon: "file-text", label: "报表中心" },
];

const ACTIVE_NAV = "metrics";

const PERIOD_OPTIONS = ["实时", "日", "周", "月", "季"].map((v) => ({ text: v, value: v }));

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
        <nav className="header-nav" aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`header-nav-item${item.key === ACTIVE_NAV ? " is-active" : ""}`}
              aria-current={item.key === ACTIVE_NAV ? "page" : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="header-tools">
          <TipBox type="simple" content="数据周期 2026-09-21 08:00" direction="bottom">
            <span className="header-sync">
              <Icon name="refresh-cw" size={14} />
              已同步
            </span>
          </TipBox>
          <IconButton
            iconName={<Icon name="bell" size={16} />}
            tipText="通知"
          />
          <IconButton
            iconName={<Icon name={isDark ? "sun" : "moon"} size={16} />}
            tipText="切换主题"
            onClick={toggleDark}
          />
          <span className="header-user">
            <img src="/uploads/user.png" alt="用户头像" />
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
            <Button text="导出报告" leftIcon={<Icon name="download" size={14} />} />
            <Button
              status="primary"
              text="执行判断"
              leftIcon={<Icon name="play" size={14} />}
            />
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <SelectCard
              value={period}
              data={PERIOD_OPTIONS}
              onChange={(value) => onPeriodChange(value)}
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
          <SearchInput
            className="filter-search"
            placeholder="搜索指标名称 / 编码 / 责任人"
            value={filters.keyword}
            onChange={(value) => onChange({ ...filters, keyword: value })}
            onClear={() => onChange({ ...filters, keyword: "" })}
          />
          <Button
            text="重置"
            leftIcon={<Icon name="rotate-ccw" size={14} />}
            onClick={onReset}
          />
        </div>
      </div>
    </>
  );
}

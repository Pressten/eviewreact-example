import { Button, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icons.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 页面头部 — 面包屑 + 标题 + 全局操作 + 指标概览卡
const KPIS = [
  { key: "total", label: "指标总数", value: "24", unit: "个", icon: "list-checks", tone: "brand" },
  { key: "normal", label: "运行正常", value: "17", unit: "个", icon: "circle-check", tone: "success" },
  { key: "warning", label: "预警指标", value: "4", unit: "个", icon: "triangle-alert", tone: "critical" },
  { key: "error", label: "异常指标", value: "2", unit: "个", icon: "circle-x", tone: "error" },
];

export default function PageHeader() {
  const { isDark, toggleDark } = useApp();

  return (
    <header className="page-header">
      <div className="page-header__top">
        <div className="page-header__heading">
          <nav className="page-header__crumb" aria-label="面包屑">
            <span>数据治理</span>
            <Icon name="chevron-right" size={12} />
            <span>指标管理</span>
            <Icon name="chevron-right" size={12} />
            <span className="page-header__crumb-current">数据管理指标</span>
          </nav>
          <h1 className="page-header__title">数据管理指标</h1>
          <p className="page-header__desc">
            统一维护指标口径、采集明细与血缘链路，支持从指标清单逐级下钻至批次明细与上下游节点。
          </p>
        </div>
        <div className="page-header__actions">
          <Tooltip title={isDark ? "切换为浅色模式" : "切换为深色模式"}>
            <Button
              type="text"
              shape="circle"
              icon={<Icon name={isDark ? "sun" : "moon"} size={16} />}
              onClick={toggleDark}
            />
          </Tooltip>
          <Button icon={<Icon name="refresh-cw" size={14} />}>刷新</Button>
          <Button icon={<Icon name="download" size={14} />}>导出报告</Button>
          <Button type="primary" icon={<Icon name="plus" size={14} />}>
            新建指标
          </Button>
        </div>
      </div>

      <div className="page-header__kpis">
        {KPIS.map((kpi) => (
          <div className="kpi-card" key={kpi.key}>
            <span className={`kpi-card__icon kpi-card__icon--${kpi.tone}`}>
              <Icon name={kpi.icon} size={16} />
            </span>
            <div className="kpi-card__body">
              <span className="kpi-card__label">{kpi.label}</span>
              <span className="kpi-card__value">
                {kpi.value}
                <em className="kpi-card__unit">{kpi.unit}</em>
              </span>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}

// =============================================================================
// [视图] PageHeader — 页面头部（面包屑 + 标题 + 全局操作 + 指标概览 KPI 卡）
// 归属：Phase 1 页面 agent 填实
// 职责：
//   1. 面包屑（数据治理 › 指标管理 › 数据管理指标）
//   2. 页面标题 + 描述
//   3. 全局操作：深浅色切换（useApp().toggleDark）/ 刷新 / 导出报告 / 新建指标
//   4. KPI 概览卡 ×4：指标总数 / 运行正常 / 预警指标 / 异常指标
// 契约（冻结）：
//   props: 无（自行从 useApp() 取 isDark/toggleDark）
//   数据：KPI 概览统计由本视图自行从 data.js 的 metricList 聚合（总数=metricList.length；
//         normal/warning/error 计数），原始 HTML 用了写死的 24/17/4/2，迁移时建议改为动态聚合。
//   共享件：IconButton/Button（@nce/eview-react）、@nce/icon-plus、useApp（src/context.jsx）
//   图标词表（icon-plus）：list-checks / circle-check / triangle-alert / circle-x /
//     chevron-right / refresh-cw / download / plus / sun / moon
// 样式：私有 index.css（页面 agent 建），消费 token；class 前缀沿用 page-header__* / kpi-card__*。
// 私有目录建议：src/views/page-header/{index.jsx, index.css}
// =============================================================================
import { useMemo } from 'react';
import Button from '@nce/eview-react/Button';
import IconButton from '@nce/eview-react/IconButton';
import Crumbs from '@nce/eview-react/Crumbs';
// TODO_CONTRACT: 下列 icon-plus 组件名按 lucide keyword 推断（chevron-right/refresh/check 经 Reference 示例确认，
//   余者按 IconPlusIcPublic<PascalCase> 命名规律推断）；本环境无法联通内网 getIconInfo 接口核对，
//   需用 getIconInfo('list-checks'/'triangle-alert'/'circle-x'/'download'/'plus'/'sun'/'moon'/'circle-check') 复核真实导出名。
import {
  IconPlusIcPublicListChecks,
  IconPlusIcPublicCheck,
  IconPlusIcPublicTriangleAlert,
  IconPlusIcPublicCircleX,
  IconPlusIcPublicChevronRight,
  IconPlusIcPublicRefresh,
  IconPlusIcPublicDownload,
  IconPlusIcPublicPlus,
  IconPlusIcPublicSun,
  IconPlusIcPublicMoon
} from '@nce/icon-plus';
import { useApp } from '../../context.jsx';
import { metricList } from '../../data.js';
import './index.css';

const CRUMBS = [
  { title: '数据治理' },
  { title: '指标管理' },
  { title: '数据管理指标' },
];

export default function PageHeader() {
  const { isDark, toggleDark } = useApp();

  const kpis = useMemo(() => {
    const total = metricList.length;
    const normal = metricList.filter((m) => m.status === 'normal').length;
    const warning = metricList.filter((m) => m.status === 'warning').length;
    const error = metricList.filter((m) => m.status === 'error').length;
    return [
      { key: 'total', label: '指标总数', value: total, unit: '个', icon: <IconPlusIcPublicListChecks iconSize={16} />, tone: 'brand' },
      { key: 'normal', label: '运行正常', value: normal, unit: '个', icon: <IconPlusIcPublicCheck iconSize={16} />, tone: 'success' },
      { key: 'warning', label: '预警指标', value: warning, unit: '个', icon: <IconPlusIcPublicTriangleAlert iconSize={16} />, tone: 'critical' },
      { key: 'error', label: '异常指标', value: error, unit: '个', icon: <IconPlusIcPublicCircleX iconSize={16} />, tone: 'error' },
    ];
  }, []);

  // TODO_CONTRACT: 刷新 / 导出报告 / 新建指标 三个操作按钮暂无下游 wiring（本视图无 props、无路由 / 弹窗契约），先留 no-op。
  const handleRefresh = () => {};
  const handleExport = () => {};
  const handleCreate = () => {};

  return (
    <header className="page-header">
      <div className="page-header__top">
        <div className="page-header__heading">
          <Crumbs
            className="page-header__crumb"
            data={CRUMBS}
            splitIcon={<IconPlusIcPublicChevronRight iconSize={12} />}
          />
          <h1 className="page-header__title">数据管理指标</h1>
          <p className="page-header__desc">
            统一维护指标口径、采集明细与血缘链路，支持从指标清单逐级下钻至批次明细与上下游节点。
          </p>
        </div>
        <div className="page-header__actions">
          <IconButton
            iconName={isDark ? <IconPlusIcPublicSun iconSize={16} /> : <IconPlusIcPublicMoon iconSize={16} />}
            tipText={isDark ? '切换为浅色模式' : '切换为深色模式'}
            onClick={toggleDark}
          />
          <Button text="刷新" leftIcon={<IconPlusIcPublicRefresh iconSize={14} />} onClick={handleRefresh} />
          <Button text="导出报告" leftIcon={<IconPlusIcPublicDownload iconSize={14} />} onClick={handleExport} />
          <Button status="primary" text="新建指标" leftIcon={<IconPlusIcPublicPlus iconSize={14} />} onClick={handleCreate} />
        </div>
      </div>

      <div className="page-header__kpis">
        {kpis.map((kpi) => (
          <div className="kpi-card" key={kpi.key}>
            <span className={`kpi-card__icon kpi-card__icon--${kpi.tone}`}>
              {kpi.icon}
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

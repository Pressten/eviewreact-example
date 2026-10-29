import Table from "@nce/eview-react/Table";
import { IconPlusIcPublicInfo, IconPlusIcPublicSortUp, IconPlusIcPublicSortDown, IconPlusIcPublicMinus } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";
import { filterDeals, filterSalespeople, teamRows } from "../../mock/selectors.js";
import { timeRangeMap } from "../../mock/stages.js";
import { fmtMoney } from "../../mock/format.js";
import OwnerAvatar from "../../components/owner-avatar/index.jsx";
import "./index.css";

const rankChangeMap = {
  up:    { IconCmp: IconPlusIcPublicSortUp,   color: "var(--success)" },
  down:  { IconCmp: IconPlusIcPublicSortDown, color: "var(--error)" },
  flat:  { IconCmp: IconPlusIcPublicMinus,    color: "var(--on-surface-variant)" },
};

function rankState(change) {
  if (change > 0) return { ...rankChangeMap.up, label: `↑${change}` };
  if (change < 0) return { ...rankChangeMap.down, label: `↓${-change}` };
  return { ...rankChangeMap.flat, label: "持平" };
}

// 手写 Progress（eview-react 无对应组件，按 handwrite-templates §9）
function AppProgress({ percent, color }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className="tt__prog-bar">
      <div className="tt__prog-bar-fill" style={{ width: `${p}%`, background: color }} />
    </div>
  );
}

export default function TeamTable() {
  const { team, productLine, dept, timeRange } = useApp();
  const salesFiltered = filterSalespeople({ team, dept });
  const deals = filterDeals({ team, productLine, dept, timeRange });
  const rows = teamRows(salesFiltered, deals);

  const columns = [
    {
      title: "排名",
      key: "rank",
      width: 64,
      align: "center",
      allowSort: false,
      render: (cell) => <span className="tt__rank-num">#{cell}</span>,
    },
    {
      title: "销售",
      key: "name",
      width: 200,
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        if (!r) return null;
        return (
          <div className="tt__person">
            <OwnerAvatar person={r} size="2rem" />
            <div className="tt__person-info">
              <span className="tt__person-name">{r.name}</span>
              <Tag bordered={false} className="tt__dept-tag">{r.deptName}</Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "签约额",
      key: "signed",
      align: "right",
      width: 130,
      render: (cell) => <span className="tt__signed">{fmtMoney(cell)}</span>,
    },
    {
      title: "单数",
      key: "dealCount",
      align: "right",
      width: 80,
      render: (cell) => <span>{cell} 单</span>,
    },
    {
      title: "平均成交周期",
      key: "avgCycle",
      align: "right",
      width: 120,
      render: (cell) => <span>{cell} 天</span>,
    },
    {
      title: "目标达成",
      key: "rate",
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        const rate = cell;
        if (!r) return null;
        const low = rate < 50;
        const over = rate >= 100;
        return (
          <div className="tt__prog">
            <AppProgress
              percent={Math.min(rate, 100)}
              color={low ? "var(--error)" : over ? "var(--success)" : "var(--primary)"}
            />
            <span className={`tt__prog-rate ${low ? "is-warn" : ""} ${over ? "is-over" : ""}`}>
              {rate.toFixed(0)}%
              <span className="tt__prog-target">/ {fmtMoney(r.target)}</span>
            </span>
          </div>
        );
      },
    },
    {
      title: "环比变动",
      key: "rankChange",
      align: "center",
      width: 110,
      allowSort: false,
      render: (cell) => {
        const s = rankState(cell);
        return (
          <span className="tt__change" style={{ color: s.color }}>
            <s.IconCmp iconSize="0.875rem" iconColor={['currentcolor']} />
            {s.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="tt">
      <div className="tt__meta">
        <span className="tt__range">{timeRangeMap[timeRange]} · 团队业绩</span>
        <span className="tt__hint">
          <IconPlusIcPublicInfo iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />
          达成率低于 50% 显示警示色
        </span>
      </div>
      <div className="tt__table-wrap">
        <Table
          columns={columns}
          dataset={rows}
          enableColumnCompareUpdate
          enableZebraCrossing={false}
          width="unset"
          className="tt__antd"
        />
      </div>
    </div>
  );
}

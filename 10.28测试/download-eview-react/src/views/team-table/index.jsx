import Table from "@nce/eview-react/Table";
import { IconPlusIcPublicInfo, IconPlusIcPublicMinus, IconPlusIcPublicSortDown, IconPlusIcPublicSortUp } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import { useApp } from "../../context.jsx";
import { filterDeals, filterSalespeople, teamRows } from "../../mock/selectors.js";
import { timeRangeMap } from "../../mock/stages.js";
import { fmtMoney } from "../../mock/format.js";
import OwnerAvatar from "../../components/owner-avatar/index.jsx";
import "./index.css";

const rankChangeMap = {
  up:    { icon: <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} />,   color: "var(--success)" },
  down:  { icon: <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />, color: "var(--error)" },
  flat:  { icon: <IconPlusIcPublicMinus iconSize="0.875rem" iconColor={['currentcolor']} />,     color: "var(--on-surface-variant)" },
};

function rankState(change) {
  if (change > 0) return { ...rankChangeMap.up, label: `↑${change}` };
  if (change < 0) return { ...rankChangeMap.down, label: `↓${-change}` };
  return { ...rankChangeMap.flat, label: "持平" };
}

// TODO(eview-react): Progress 无对应组件，手写最小进度条（参考 handwrite-templates.md §9）
function BarProgress({ percent, color }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ flex: 1, minWidth: "4rem", height: "6px", background: "var(--surface-variant)", borderRadius: "3px", overflow: "hidden" }}>
      <div style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }} />
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
      render: (v) => <span className="tt__rank-num">#{v}</span>,
    },
    {
      title: "销售",
      key: "name",
      width: 200,
      allowSort: false,
      render: (v, _rowData, _options, row) => {
        const r = row?.rawData;
        return (
          <div className="tt__person">
            <OwnerAvatar person={r} size="2rem" />
            <div className="tt__person-info">
              <span className="tt__person-name">{r?.name}</span>
              <Tag bordered={false} className="tt__dept-tag">{r?.deptName}</Tag>
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
      allowSort: true,
      render: (v) => <span className="tt__signed">{fmtMoney(v)}</span>,
    },
    {
      title: "单数",
      key: "dealCount",
      align: "right",
      width: 80,
      allowSort: true,
      render: (v) => <span>{v} 单</span>,
    },
    {
      title: "平均成交周期",
      key: "avgCycle",
      align: "right",
      width: 120,
      allowSort: true,
      render: (v) => <span>{v} 天</span>,
    },
    {
      title: "目标达成",
      key: "rate",
      width: 200,
      allowSort: true,
      render: (rate, _rowData, _options, row) => {
        const r = row?.rawData;
        const low = rate < 50;
        const over = rate >= 100;
        const color = low ? "var(--error)" : over ? "var(--success)" : "var(--primary)";
        return (
          <div className="tt__prog">
            <BarProgress percent={Math.min(rate, 100)} color={color} />
            <span className={`tt__prog-rate ${low ? "is-warn" : ""} ${over ? "is-over" : ""}`}>
              {rate.toFixed(0)}%
              <span className="tt__prog-target">/ {fmtMoney(r?.target)}</span>
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
      render: (change) => {
        const s = rankState(change);
        return (
          <span className="tt__change" style={{ color: s.color }}>
            {s.icon}
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
          dataset={rows}
          columns={columns}
          size="middle"
          width="unset"
          enableZebraCrossing={false}
          enableColumnCompareUpdate
          className="tt__antd"
        />
      </div>
    </div>
  );
}

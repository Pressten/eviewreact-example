import { Table, Progress, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../../src/context.jsx";
import { filterDeals, filterSalespeople, teamRows } from "../../../src/mock/selectors.js";
import { timeRangeMap } from "../../../src/mock/stages.js";
import { fmtMoney } from "../../../src/mock/format.js";
import OwnerAvatar from "../../../src/components/owner-avatar/index.jsx";
import "./index.css";

const rankChangeMap = {
  up:    { icon: "trending-up",   color: "var(--success)" },
  down:  { icon: "trending-down", color: "var(--error)" },
  flat:  { icon: "minus",         color: "var(--on-surface-variant)" },
};

function rankState(change) {
  if (change > 0) return { ...rankChangeMap.up, label: `↑${change}` };
  if (change < 0) return { ...rankChangeMap.down, label: `↓${-change}` };
  return { ...rankChangeMap.flat, label: "持平" };
}

export default function TeamTable() {
  const { team, productLine, dept, timeRange } = useApp();
  const salesFiltered = filterSalespeople({ team, dept });
  const deals = filterDeals({ team, productLine, dept, timeRange });
  const rows = teamRows(salesFiltered, deals);

  const columns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      width: 64,
      align: "center",
      render: (v) => <span className="tt__rank-num">#{v}</span>,
    },
    {
      title: "销售",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (_, r) => (
        <div className="tt__person">
          <OwnerAvatar person={r} size="2rem" />
          <div className="tt__person-info">
            <span className="tt__person-name">{r.name}</span>
            <Tag bordered={false} className="tt__dept-tag">{r.deptName}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "签约额",
      dataIndex: "signed",
      key: "signed",
      align: "right",
      width: 130,
      sorter: (a, b) => a.signed - b.signed,
      render: (v) => <span className="tt__signed">{fmtMoney(v)}</span>,
    },
    {
      title: "单数",
      dataIndex: "dealCount",
      key: "dealCount",
      align: "right",
      width: 80,
      sorter: (a, b) => a.dealCount - b.dealCount,
      render: (v) => <span>{v} 单</span>,
    },
    {
      title: "平均成交周期",
      dataIndex: "avgCycle",
      key: "avgCycle",
      align: "right",
      width: 120,
      sorter: (a, b) => a.avgCycle - b.avgCycle,
      render: (v) => <span>{v} 天</span>,
    },
    {
      title: "目标达成",
      dataIndex: "rate",
      key: "rate",
      width: 200,
      sorter: (a, b) => a.rate - b.rate,
      render: (rate, r) => {
        const low = rate < 50;
        const over = rate >= 100;
        return (
          <div className="tt__prog">
            <Progress
              percent={Math.min(rate, 100)}
              size="small"
              status={over ? "success" : low ? "exception" : "active"}
              strokeColor={low ? "var(--error)" : over ? "var(--success)" : undefined}
              format={() => ""}
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
      dataIndex: "rankChange",
      key: "rankChange",
      align: "center",
      width: 110,
      render: (change) => {
        const s = rankState(change);
        return (
          <span className="tt__change" style={{ color: s.color }}>
            <Icon name={s.icon} size="0.875rem" />
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
          <Icon name="info" size="0.75rem" color="var(--on-surface-variant)" />
          达成率低于 50% 显示警示色
        </span>
      </div>
      <div className="tt__table-wrap">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={rows}
          size="middle"
          pagination={false}
          sortDirections={["ascend", "descend", "ascend"]}
          showSorterTooltip={false}
          className="tt__antd"
        />
      </div>
    </div>
  );
}

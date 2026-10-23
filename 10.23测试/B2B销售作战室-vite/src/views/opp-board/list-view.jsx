import { Table, Tag } from "antd";
import Icon from "@/shared/Icon";
import { stages, stageMap } from "../../mock/stages.js";
import { ownerMap } from "../../mock/salespeople.js";
import { fmtMoney } from "../../mock/format.js";
import OwnerAvatar from "../../components/owner-avatar/index.jsx";

// 列表视图 — 商机以表格呈现
export default function ListView({ opps, onSelect }) {
  const columns = [
    {
      title: "客户",
      dataIndex: "customer",
      key: "customer",
      width: 220,
      render: (v, r) => (
        <a className="lv__link" onClick={() => onSelect(r)}>{v}</a>
      ),
    },
    {
      title: "金额",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: 130,
      sorter: (a, b) => a.amount - b.amount,
      render: (v) => <span className="lv__amount">{fmtMoney(v)}</span>,
    },
    {
      title: "阶段",
      dataIndex: "stage",
      key: "stage",
      width: 120,
      filters: stages.map((s) => ({ text: s.label, value: s.key })),
      onFilter: (val, r) => r.stage === val,
      render: (v) => {
        const st = stageMap[v];
        return st ? <Tag color={st.color} bordered={false}>{st.label}</Tag> : v;
      },
    },
    {
      title: "负责人",
      dataIndex: "owner",
      key: "owner",
      width: 160,
      render: (v) => {
        const ow = ownerMap[v];
        return ow ? (
          <span className="lv__owner">
            <OwnerAvatar person={ow} size="1.25rem" />
            {ow.name}
          </span>
        ) : "—";
      },
    },
    {
      title: "预计成交日",
      dataIndex: "closeDate",
      key: "closeDate",
      width: 130,
      sorter: (a, b) => new Date(a.closeDate) - new Date(b.closeDate),
      render: (v, r) => (
        <span className="lv__date">
          {v}
          {r.nearExpiry && <Tag color="error" bordered={false} className="lv__date-tag">临期</Tag>}
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      align: "left",
      render: (_, r) => (
        <a className="lv__link" onClick={() => onSelect(r)} title="查看详情">
          <Icon name="eye" size="0.875rem" color="var(--interactive-link)" />
          详情
        </a>
      ),
    },
  ];

  return (
    <div className="lv">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={opps}
        size="middle"
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        pagination={{
          showTotal: (total) => `总记录数：${total}`,
          showSizeChanger: true,
          showQuickJumper: { goButton: "跳转" },
          pageSize: 10,
          pageSizeOptions: ["10", "20", "50"],
        }}
        className="lv__table"
      />
    </div>
  );
}

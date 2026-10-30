import { useMemo, useState } from "react";
import { Table, Tag, Select, Dropdown, Drawer, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionBlock from "../../components/section-block/index.jsx";
import { bills, billDetails } from "../../mock/data.js";
import "./index.css";

const STATUS_MAP = {
  paid: { color: "success", text: "已付" },
  pending: { color: "warning", text: "待付" },
  overdue: { color: "error", text: "逾期" },
};

const FILTER_OPTIONS = [
  { value: "all", label: "全部状态" },
  { value: "paid", label: "已付" },
  { value: "pending", label: "待付" },
  { value: "overdue", label: "逾期" },
];

function formatMoney(n) {
  return "￥" + Number(n).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BillRecords() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [drawerBill, setDrawerBill] = useState(null);

  const filtered = useMemo(() => {
    if (filter === "all") return bills;
    return bills.filter((b) => b.status === filter);
  }, [filter]);

  const buildDetail = (bill) => {
    if (billDetails[bill.billNo]) return billDetails[bill.billNo];
    const base = 322000.0;
    const over = Math.max(0, bill.amount - base);
    return {
      ...bill,
      items: [
        { name: "基础订阅费（500 座位）", period: bill.billingCycle, amount: base },
        ...(over > 0
          ? [{ name: "模块超额费用合计", period: bill.billingCycle, amount: over }]
          : []),
      ],
    };
  };

  const columns = [
    {
      title: "账单号",
      dataIndex: "billNo",
      key: "billNo",
      render: (text, record) => (
        <a onClick={() => setDrawerBill(record)}>{text}</a>
      ),
    },
    { title: "账期", dataIndex: "billingCycle", key: "billingCycle", sorter: (a, b) => a.billingCycle.localeCompare(b.billingCycle) },
    {
      title: "账单金额",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      sorter: (a, b) => a.amount - b.amount,
      render: (v) => <span className="cb-br-money">{formatMoney(v)}</span>,
    },
    { title: "明细项数", dataIndex: "itemCount", key: "itemCount", align: "right" },
    {
      title: "出账日期",
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => a.issueDate.localeCompare(b.issueDate),
    },
    {
      title: "付款状态",
      dataIndex: "status",
      key: "status",
      render: (v) => <Tag color={STATUS_MAP[v].color}>{STATUS_MAP[v].text}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              { key: "detail", label: "查看明细", icon: <Icon name="eye" size="0.875rem" /> },
              { key: "invoice", label: "下载发票", icon: <Icon name="receipt" size="0.875rem" /> },
              { key: "review", label: "申请复核", icon: <Icon name="file-text" size="0.875rem" /> },
            ],
            onClick: ({ key }) => {
              if (key === "detail") setDrawerBill(record);
              else if (key === "invoice") message.success(`发票 ${record.billNo} 已开始下载`);
              else message.success(`已提交 ${record.billNo} 的复核申请，财务将在 3 个工作日内回复`);
            },
          }}
        >
          <span className="cb-br-action">
            更多
            <Icon name="chevron-down" size="0.875rem" />
          </span>
        </Dropdown>
      ),
    },
  ];

  const detail = drawerBill ? buildDetail(drawerBill) : null;

  return (
    <SectionBlock
      id="bill-records"
      title="账单记录"
      icon={<Icon name="receipt" size="1.25rem" color="#0067D1" />}
      extra={
        <Select
          size="middle"
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
          options={FILTER_OPTIONS}
          style={{ width: "8rem" }}
        />
      }
    >
      <Table
        size="large"
        rowKey="key"
        columns={columns}
        dataSource={filtered}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        pagination={{
          current: page,
          pageSize: 8,
          onChange: setPage,
          showTotal: (total) => `总记录数：${total}`,
          showSizeChanger: true,
          showQuickJumper: { goButton: "跳转" },
        }}
        scroll={{ x: 960 }}
      />

      <Drawer
        open={!!drawerBill}
        title="账单明细"
        width={420}
        onClose={() => setDrawerBill(null)}
        footer={null}
      >
        {detail && (
          <div className="cb-br-drawer">
            <div className="cb-br-drawer-head">
              <div>
                <div className="cb-br-drawer-no">{detail.billNo}</div>
                <div className="cb-br-drawer-cycle">账期 {detail.billingCycle} · 出账 {detail.issueDate}</div>
              </div>
              <Tag color={STATUS_MAP[detail.status].color}>{STATUS_MAP[detail.status].text}</Tag>
            </div>
            <div className="cb-br-drawer-amount">
              <span>账单总额</span>
              <strong>{formatMoney(detail.amount)}</strong>
            </div>
            <div className="cb-br-drawer-items-title">费用明细</div>
            <div className="cb-br-drawer-items">
              {detail.items.map((it, i) => (
                <div className="cb-br-drawer-item" key={i}>
                  <div>
                    <div className="cb-br-drawer-item-name">{it.name}</div>
                    <div className="cb-br-drawer-item-period">{it.period}</div>
                  </div>
                  <div className="cb-br-drawer-item-amount">{formatMoney(it.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </SectionBlock>
  );
}

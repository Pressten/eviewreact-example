import { useMemo, useState } from "react";
import { IconPlusIcDigitalPowerDpDocText, IconPlusIcPublicChevronDown, IconPlusIcPublicEye, IconPlusIcPublicInvoice } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Tag from "@/shared/Tag";
import Select from "@/shared/Select";
import Drawer from "@nce/eview-react/Drawer";
import DivMessage from "@nce/eview-react/DivMessage";
import SectionBlock from "../../components/section-block/index.jsx";
import { bills, billDetails } from "../../mock/data.js";
import "./index.css";

const STATUS_MAP = {
  paid: { color: "success", text: "已付" },
  pending: { color: "warning", text: "待付" },
  overdue: { color: "error", text: "逾期" },
};

// Select 选项：label → text
const FILTER_OPTIONS = [
  { value: "all", text: "全部状态" },
  { value: "paid", text: "已付" },
  { value: "pending", text: "待付" },
  { value: "overdue", text: "逾期" },
];

function formatMoney(n) {
  return "￥" + Number(n).toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BillRecords() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [drawerBill, setDrawerBill] = useState(null);
  // DivMessage 渲染式通知（替代 antd 命令式 message）。每条通知唯一 key。
  const [notice, setNotice] = useState(null);

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

  // 下拉菜单（手写：antd Dropdown 无 eview-react 对应）
  const [openMenuKey, setOpenMenuKey] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });
  const closeNotice = () => setNotice(null);

  const menuItems = (record) => [
    { key: "detail", label: "查看明细", icon: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "invoice", label: "下载发票", icon: <IconPlusIcPublicInvoice iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "review", label: "申请复核", icon: <IconPlusIcDigitalPowerDpDocText iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];

  const handleMenuClick = (key, record) => {
    setOpenMenuKey(null);
    if (key === "detail") setDrawerBill(record);
    else if (key === "invoice") notify("success", `发票 ${record.billNo} 已开始下载`);
    else notify("success", `已提交 ${record.billNo} 的复核申请，财务将在 3 个工作日内回复`);
  };

  const columns = [
    {
      title: "账单号",
      key: "billNo",
      allowSort: false,
      render: (text, _rowData, _options, row) => (
        <a onClick={() => setDrawerBill(row?.rawData)}>{text}</a>
      ),
    },
    { title: "账期", key: "billingCycle", allowSort: true },
    {
      title: "账单金额",
      key: "amount",
      align: "right",
      allowSort: true,
      render: (v) => <span className="cb-br-money">{formatMoney(v)}</span>,
    },
    { title: "明细项数", key: "itemCount", align: "right", allowSort: false },
    {
      title: "出账日期",
      key: "issueDate",
      allowSort: true,
    },
    {
      title: "付款状态",
      key: "status",
      allowSort: false,
      render: (v) => <Tag color={STATUS_MAP[v].color}>{STATUS_MAP[v].text}</Tag>,
    },
    {
      title: "操作",
      key: "action",
      align: "left",
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const record = row?.rawData;
        const menuKey = record?.billNo;
        const open = openMenuKey === menuKey;
        return (
          <div className="cb-br-action-wrap">
            <button
              type="button"
              className="cb-br-action"
              onClick={() => setOpenMenuKey(open ? null : menuKey)}
            >
              更多
              <IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />
            </button>
            {open ? (
              <div className="cb-br-action-menu">
                {menuItems(record).map((it) => (
                  <button
                    key={it.key}
                    type="button"
                    className="cb-br-action-menu-item"
                    onClick={() => handleMenuClick(it.key, record)}
                  >
                    {it.icon}
                    <span>{it.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
      },
    },
  ];

  const detail = drawerBill ? buildDetail(drawerBill) : null;

  // 分页（前台分页：dataset 传全量，enableAutoPaging）
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <SectionBlock
      id="bill-records"
      title="账单记录"
      icon={<IconPlusIcPublicInvoice iconSize="1.25rem" iconColor={['#0067D1']} />}
      extra={
        <Select
          size="middle"
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setPage(1);
            closeNotice();
          }}
          options={FILTER_OPTIONS}
          style={{ width: "8rem" }}
        />
      }
    >
      <Table
        columns={columns}
        dataset={filtered}
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        width="unset"
        enablePagination
        enableAutoPaging
        pageSize={pageSize}
        currentPage={page}
        recordCount={filtered.length}
        pageSizeOptions={[8, 20, 50]}
        onPageChange={(currentPage) => setPage(currentPage)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <Drawer
        visible={!!drawerBill}
        title="账单明细"
        width={420}
        onClose={() => setDrawerBill(null)}
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

      {notice ? (
        <div className="cb-notice-floating">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            onClose={closeNotice}
          />
        </div>
      ) : null}
    </SectionBlock>
  );
}

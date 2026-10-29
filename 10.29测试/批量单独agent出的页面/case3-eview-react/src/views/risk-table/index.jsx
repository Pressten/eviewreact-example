// Layer 4: 风险客户表格 — 12 行 / 状态页签（联动饼图与 KPI 下钻）/ 多选批量操作 / 行点击开详情抽屉 / 关键词搜索 / 排序筛选 / 分页
import { useEffect, useMemo, useState } from "react";
import { IconPlusIcCarUser, IconPlusIcPublicClipboard, IconPlusIcPublicEllipsis, IconPlusIcPublicEye, IconPlusIcPublicSearch, IconPlusIcPublicSend } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import Tab from "@nce/eview-react/Tab";
import TabItem from "@nce/eview-react/TabItem";
import Table from "@nce/eview-react/Table";
import TextField from "@/shared/TextField";
import dayjs from "dayjs";
import SectionCard from "../../components/section-card/index.jsx";
import SimpleProgress from "../../components/simple-progress/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { INDUSTRY_OPTIONS, TIME_RANGES, getRiskCustomers } from "../../mock/dashboard.jsx";
import "./index.css";

const STATUS_TABS = ["全部", "健康", "观察", "风险", "流失预警"];
const STATUS_ORDER = ["健康", "观察", "风险", "流失预警"];

const INDUSTRY_FILTERS = INDUSTRY_OPTIONS.filter((item) => item !== "全部行业").map((item) => ({
  text: item,
  value: item,
}));

const STATUS_FILTERS = STATUS_ORDER.map((item) => ({ text: item, value: item }));

const ROW_MENU_ITEMS = [
  { key: "detail", label: "查看详情", icon: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "change-owner", label: "修改负责人", icon: <IconPlusIcCarUser iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "watchlist", label: "加入观察名单", icon: <IconPlusIcPublicClipboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "transfer-csm", label: "转移 CSM", icon: <IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// 健康分语义色：健康=success / 观察=critical（警示橙）/ 风险与流失预警=error
function healthTone(score) {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--critical)";
  return "var(--error)";
}

function healthStatus(score) {
  if (score >= 80) return "success";
  if (score >= 60) return "normal";
  return "error";
}

// 手写补位：antd Dropdown（eview-react 无对应，按 handwrite-templates 手写点击触发的下拉菜单）
function RowMenu({ record, onAction }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    // 下一帧再绑定，避免触发本次打开的点击事件同步关闭
    const id = setTimeout(() => document.addEventListener("click", close), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", close);
    };
  }, [open]);

  return (
    <span className="row-menu-wrap">
      <IconPlusIcPublicEllipsis
        iconSize="0.875rem"
        iconColor={['currentcolor']}
        className="row-more-icon"
        title="更多操作"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((v) => !v);
        }}
      />
      {open ? (
        <ul className="row-menu-popover" onClick={(event) => event.stopPropagation()}>
          {ROW_MENU_ITEMS.map((item) => (
            <li key={item.key} className="row-menu-item" onClick={() => { setOpen(false); onAction(item.key, record); }}>
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  );
}

export default function RiskTable() {
  const {
    timeRange,
    industry,
    keyword,
    setKeyword,
    tableStatusFilter,
    setTableStatusFilter,
    openCustomerDrawer,
    openFollowUpModal,
    openTransferModal,
    notify,
  } = useApp();

  const [checkedIndexes, setCheckedIndexes] = useState([]);

  const activeRange = TIME_RANGES.find((range) => range.key === timeRange);
  const rangeLabel = activeRange ? activeRange.label : "近30天";

  const filteredRows = useMemo(
    () => getRiskCustomers(timeRange, industry, keyword),
    [timeRange, industry, keyword]
  );

  const statusCounts = useMemo(() => {
    const counts = { 全部: filteredRows.length };
    STATUS_ORDER.forEach((status) => {
      counts[status] = filteredRows.filter((row) => row.status === status).length;
    });
    return counts;
  }, [filteredRows]);

  const tableRows = useMemo(
    () => (tableStatusFilter === "全部" ? filteredRows : filteredRows.filter((row) => row.status === tableStatusFilter)),
    [tableStatusFilter, filteredRows]
  );

  const handleRowAction = (action, record, event) => {
    if (event) event.stopPropagation();
    if (action === "follow") {
      openFollowUpModal({ mode: "follow", customerId: record.id });
      return;
    }
    if (action === "transfer") {
      openTransferModal({ customerId: record.id, customerName: record.companyName });
      return;
    }
    if (action === "detail") {
      openCustomerDrawer(record.id);
      return;
    }
    if (action === "change-owner" || action === "transfer-csm") {
      openTransferModal({ customerId: record.id, customerName: record.companyName });
      return;
    }
    if (action === "watchlist") {
      notify("success", `已将「${record.companyName}」加入观察名单`);
    }
  };

  // 行点击打开详情抽屉（勾选列点击除外）
  const handleRowClick = (row, event) => {
    if (event && event.target.closest(".ev_table_checkbox")) return;
    const record = row?.rawData;
    if (record) openCustomerDrawer(record.id);
  };

  // 勾选的是行序号；按序号取整行数据
  const selectedRows = checkedIndexes.map((i) => tableRows[i]).filter(Boolean);
  const selectedCount = selectedRows.length;

  const handleBulkFollow = () => {
    notify("success", `已为选中的 ${selectedCount} 家客户批量创建跟进任务`);
    setCheckedIndexes([]);
  };

  const handleBulkTransfer = () => {
    openTransferModal({ customerId: null, customerName: `选中的 ${selectedCount} 家客户` });
  };

  const columns = [
    {
      title: "公司名称",
      key: "companyName",
      allowSort: false,
      render: (cell, rowData, options, row) => (
        <a className="table-link" onClick={(event) => handleRowAction("detail", row?.rawData, event)}>{cell}</a>
      ),
    },
    {
      title: "行业",
      key: "industry",
      width: 104,
      allowSort: false,
    },
    {
      title: "健康分",
      key: "healthScore",
      width: 148,
      align: "right",
      allowSort: true,
      render: (cell) => (
        <div className="score-cell">
          <div className="score-cell-bar">
            <SimpleProgress percent={cell} status={healthStatus(cell)} showLabel={false} />
          </div>
          <span className="score-cell-num" style={{ color: healthTone(cell) }}>{cell}</span>
        </div>
      ),
    },
    {
      title: "CSM 负责人",
      key: "csm",
      width: 132,
      allowSort: false,
      render: (cell) => (
        <span className="csm-cell">
          <img className="csm-avatar" src="/uploads/user.png" alt={cell} />
          {cell}
        </span>
      ),
    },
    {
      title: "续约日期",
      key: "renewalDate",
      width: 128,
      allowSort: true,
      render: (cell) => <span>{dayjs(cell).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "状态",
      key: "status",
      width: 116,
      allowSort: false,
      render: (cell) => <StatusTag status={cell} />,
    },
    {
      title: "操作",
      key: "actions",
      width: 188,
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const record = row?.rawData;
        return (
          <div className="row-actions" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} onClick={(event) => event.stopPropagation()}>
            <a className="table-link" onClick={() => handleRowAction("follow", record)}>跟进</a>
            <a className="table-link" onClick={() => handleRowAction("transfer", record)}>转交</a>
            <RowMenu record={record} onAction={(key, rec) => handleRowAction(key, rec)} />
          </div>
        );
      },
    },
  ];

  // 状态页签当前索引（点击切换：onClick(index, title, event)）
  const activeTabIndex = Math.max(0, STATUS_TABS.indexOf(tableStatusFilter));

  return (
    <SectionCard
      className="risk-table-card"
      title="风险客户跟进"
      subtitle={`数据范围：${rangeLabel} · ${industry}${keyword ? ` · 关键词「${keyword}」` : ""} · 共 ${filteredRows.length} 条 · 点击行查看详情`}
      actions={
        <TextField
          className="risk-table-search"
          size="small"
          value={keyword}
          onChange={(value) => setKeyword(value)}
          placeholder="搜索公司 / 负责人"
          suffix={<IconPlusIcPublicSearch iconSize="0.75rem" iconColor={['var(--text-placeholder)']} />}
        />
      }
    >
      <Tab
        className="risk-table-tabs"
        draggable={false}
        selectedIndex={activeTabIndex}
        onClick={(index, title) => setTableStatusFilter(title)}
      >
        {STATUS_TABS.map((status) => (
          <TabItem key={status} title={
            <span className="status-tab">
              {status}
              <span className="status-tab-count">{statusCounts[status]}</span>
            </span>
          } />
        ))}
      </Tab>
      {selectedCount > 0 ? (
        <div className="bulk-bar">
          <span className="bulk-bar-count">已选 {selectedCount} 项</span>
          <Button size="small" text="批量跟进" onClick={handleBulkFollow} />
          <Button size="small" text="批量转交" onClick={handleBulkTransfer} />
          <a className="table-link" onClick={() => setCheckedIndexes([])}>清空</a>
        </div>
      ) : null}
      <Table
        columns={columns}
        dataset={tableRows}
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        onRowClick={handleRowClick}
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        width="unset"
        enablePagination
        enableAutoPaging
        pageSize={10}
        pageSizeOptions={[10, 12, 20]}
        emptyTableMsg="暂无风险客户"
      />
    </SectionCard>
  );
}

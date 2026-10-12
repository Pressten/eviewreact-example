import { useState } from "react";
import { IconPlusIcPublicEllipsis, IconPlusIcPublicEye, IconPlusIcPublicMoneyCircle, IconPlusIcPublicPlus, IconPlusIcPublicProhibitCircle, IconPlusIcPublicSearch } from '@nce/icon-plus';
import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import Dropdown from "../../components/dropdown/index.jsx";
import { useNotice } from "../../components/notice/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { ORDER_STATUS, CUSTOMERS, SCENES } from "../../mock/packages.js";
import "./index.css";

const STATUS_FILTERS = Object.keys(ORDER_STATUS).map((k) => ({ text: ORDER_STATUS[k].text, value: k }));
void STATUS_FILTERS;

function mbps(bandwidth) {
  if (!bandwidth) return 0;
  return bandwidth.endsWith("G") ? parseFloat(bandwidth) * 1000 : parseFloat(bandwidth);
}

const ROW_MENU = {
  items: [
    { key: "detail", label: "查看详情", icon: <IconPlusIcPublicEye iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "bill", label: "费用明细", icon: <IconPlusIcPublicMoneyCircle iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "stop", label: "申请退订", icon: <IconPlusIcPublicProhibitCircle iconSize="0.875rem" iconColor={['currentcolor']} />, danger: true },
  ],
};

export default function OrdersView() {
  const { orders, setPrefill, setActiveTab } = useApp();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(undefined);
  const { notify, noticeNode } = useNotice();

  const data = orders.filter((o) => {
    const kw = keyword ? `${o.orderNo}${o.customer}`.toLowerCase().includes(keyword.toLowerCase()) : true;
    const st = status ? o.status === status : true;
    return kw && st;
  });

  const cloneAsDraft = (row) => {
    setPrefill({
      customer: CUSTOMERS.find((c) => c.label === row.customer)?.value,
      scene: SCENES.find((s) => s.label === row.scene)?.value,
      bandwidth: row.bandwidth,
      count: Math.max(1, Math.min(row.stations || 1, 50)),
      cycle: "包月",
      priority: "mid",
    });
    setActiveTab("config");
    notify("success", `已将工单 ${row.orderNo} 复制为开通草稿`);
  };

  const customSortFun = (key, a, b) => {
    if (key === "bandwidth") return mbps(a.bandwidth) - mbps(b.bandwidth);
    if (key === "stations") return a.stations - b.stations;
    if (key === "amount") return a.amount - b.amount;
    if (key === "createdAt") return String(a.createdAt).localeCompare(String(b.createdAt));
    const va = a?.[key];
    const vb = b?.[key];
    if (va == null) return vb == null ? 0 : -1;
    if (vb == null) return 1;
    return va < vb ? -1 : va > vb ? 1 : 0;
  };

  const columns = [
    { title: "ID", key: "id", display: false },
    {
      title: "工单号",
      key: "orderNo",
      width: 168,
      allowSort: false,
      render: (v, _rd, _o, row) => (
        <a className="cell-link" onClick={() => cloneAsDraft(row?.rawData)}>{v}</a>
      ),
    },
    { title: "客户名称", key: "customer", width: 200, ellipsis: true, allowSort: false },
    { title: "业务场景", key: "scene", width: 150, allowSort: false },
    { title: "带宽", key: "bandwidth", width: 96, allowSort: true },
    { title: "站点数", key: "stations", width: 92, align: "right", allowSort: true },
    { title: "合同金额 (元/月)", key: "amount", width: 150, align: "right", allowSort: true, render: (v) => v.toLocaleString() },
    {
      title: "状态",
      key: "status",
      width: 110,
      allowSort: false,
      render: (v) => <StatusTag value={v} map={ORDER_STATUS} />,
    },
    { title: "提交时间", key: "createdAt", width: 150, allowSort: true },
    { title: "预计完成", key: "eta", width: 120, allowSort: false },
    {
      title: "操作",
      key: "action",
      width: 132,
      align: "left",
      allowSort: false,
      render: (_v, _rd, _o, row) => (
        <div className="row-actions">
          <a className="cell-link" onClick={() => cloneAsDraft(row?.rawData)}>复制再开通</a>
          <Dropdown menu={ROW_MENU} placement="bottomRight" trigger={<span className="row-more"><IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} title="更多操作" /></span>} />
        </div>
      ),
    },
  ];

  return (
    <div className="orders-view">
      <div className="orders-toolbar">
        <div className="orders-toolbar-left">
          <TextField
            style={{ width: "16rem" }}
            placeholder="搜索工单号或客户名称"
            value={keyword}
            onChange={(v) => setKeyword(v)}
            suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['var(--on-surface-variant)']} />}
          />
          <Select
            style={{ width: "10rem" }}
            enableClear
            defaultLabel="全部状态"
            options={Object.keys(ORDER_STATUS).map((k) => ({ value: k, text: ORDER_STATUS[k].text }))}
            value={status}
            onChange={(v) => setStatus(v)}
          />
        </div>
        <Button status="primary" text="新建开通" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={() => { setPrefill(null); setActiveTab("config"); }} />
      </div>

      <Table
        columns={columns}
        dataset={data}
        enablePagination
        enableAutoPaging
        pagingProps={{ pageSize: 8 }}
        customSortFun={customSortFun}
        maxHeight={560}
      />
      {noticeNode}
    </div>
  );
}

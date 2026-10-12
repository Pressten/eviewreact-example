import { useState } from "react";
import { Table, Button, Input, Select, Dropdown, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { useApp } from "../../context.jsx";
import { ORDER_STATUS, CUSTOMERS, SCENES } from "../../mock/packages.js";
import "./index.css";

const STATUS_FILTERS = Object.keys(ORDER_STATUS).map((k) => ({ text: ORDER_STATUS[k].text, value: k }));

function mbps(bandwidth) {
  if (!bandwidth) return 0;
  return bandwidth.endsWith("G") ? parseFloat(bandwidth) * 1000 : parseFloat(bandwidth);
}

const ROW_MENU = {
  items: [
    { key: "detail", label: "查看详情", icon: <Icon name="eye" size="0.875rem" /> },
    { key: "bill", label: "费用明细", icon: <Icon name="wallet" size="0.875rem" /> },
    { key: "stop", label: "申请退订", icon: <Icon name="circle-slash" size="0.875rem" />, danger: true },
  ],
};

export default function OrdersView() {
  const { orders, setPrefill, setActiveTab } = useApp();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(undefined);

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
    message.success(`已将工单 ${row.orderNo} 复制为开通草稿`);
  };

  const columns = [
    {
      title: "工单号",
      dataIndex: "orderNo",
      width: 168,
      render: (v, row) => (
        <a className="cell-link" onClick={() => cloneAsDraft(row)}>{v}</a>
      ),
    },
    { title: "客户名称", dataIndex: "customer", width: 200, ellipsis: true },
    { title: "业务场景", dataIndex: "scene", width: 150 },
    { title: "带宽", dataIndex: "bandwidth", width: 96, sorter: (a, b) => mbps(a.bandwidth) - mbps(b.bandwidth) },
    { title: "站点数", dataIndex: "stations", width: 92, align: "right", sorter: (a, b) => a.stations - b.stations },
    { title: "合同金额 (元/月)", dataIndex: "amount", width: 150, align: "right", sorter: (a, b) => a.amount - b.amount, render: (v) => v.toLocaleString() },
    {
      title: "状态",
      dataIndex: "status",
      width: 110,
      filters: STATUS_FILTERS,
      onFilter: (v, r) => r.status === v,
      render: (v) => <StatusTag value={v} map={ORDER_STATUS} />,
    },
    { title: "提交时间", dataIndex: "createdAt", width: 150, sorter: (a, b) => a.createdAt.localeCompare(b.createdAt) },
    { title: "预计完成", dataIndex: "eta", width: 120 },
    {
      title: "操作",
      key: "action",
      width: 132,
      align: "left",
      render: (_, row) => (
        <div className="row-actions">
          <a className="cell-link" onClick={() => cloneAsDraft(row)}>复制再开通</a>
          <Dropdown menu={ROW_MENU} placement="bottomRight">
            <span className="row-more"><Icon name="ellipsis" size="0.875rem" title="更多操作" /></span>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="orders-view">
      <div className="orders-toolbar">
        <div className="orders-toolbar-left">
          <Input
            size="small"
            allowClear
            style={{ width: "16rem" }}
            placeholder="搜索工单号或客户名称"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
          />
          <Select
            size="small"
            allowClear
            style={{ width: "10rem" }}
            placeholder="全部状态"
            options={Object.keys(ORDER_STATUS).map((k) => ({ value: k, label: ORDER_STATUS[k].text }))}
            value={status}
            onChange={setStatus}
          />
        </div>
        <Button size="small" type="primary" icon={<Icon name="plus" size="0.875rem" />} onClick={() => { setPrefill(null); setActiveTab("config"); }}>新建开通</Button>
      </div>

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 1380 }}
      />
    </div>
  );
}

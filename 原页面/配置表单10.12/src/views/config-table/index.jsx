import { useState } from "react";
import { Table, Button, Input, Dropdown, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import BatchModal from "../../components/batch-modal/index.jsx";
import EditModal from "../../components/edit-modal/index.jsx";
import SubmitModal from "../../components/submit-modal/index.jsx";
import { useApp } from "../../context.jsx";
import { ITEM_STATUS, PRIORITIES, REGIONS } from "../../mock/packages.js";
import "./index.css";

const PRIORITY_TAG = {
  high: { text: "高", type: "error" },
  mid: { text: "中", type: "processing" },
  low: { text: "低", type: "default" },
};

function mbps(bandwidth) {
  if (!bandwidth) return 0;
  if (bandwidth.endsWith("G")) return parseFloat(bandwidth) * 1000;
  return parseFloat(bandwidth);
}

const CYCLE_FILTERS = [{ text: "包月", value: "包月" }, { text: "包年", value: "包年" }];
const REGION_FILTERS = REGIONS.map((r) => ({ text: r.label, value: r.label }));
const PRIORITY_FILTERS = PRIORITIES.map((p) => ({ text: p.label, value: p.value }));
const STATUS_FILTERS = Object.keys(ITEM_STATUS).map((k) => ({ text: ITEM_STATUS[k].text, value: k }));

const EXPORT_MENU = {
  items: [
    { key: "csv", label: "导出 CSV", icon: <Icon name="file-text" size="0.875rem" /> },
    { key: "xls", label: "导出 Excel", icon: <Icon name="sheet" size="0.875rem" /> },
  ],
};

export default function ConfigTable() {
  const { configItems, setConfigItems, setOrders, orders, setActiveTab } = useApp();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [batchOpen, setBatchOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitOpen, setSubmitOpen] = useState(false);

  const filtered = keyword
    ? configItems.filter((i) => `${i.code}${i.customer}${i.station}`.toLowerCase().includes(keyword.toLowerCase()))
    : configItems;

  const totalBandwidth = configItems.reduce((s, i) => s + mbps(i.bandwidth), 0);
  const totalFee = configItems.reduce((s, i) => s + (i.price || 0), 0);

  const openEdit = (row) => {
    setEditItem(row);
    setEditOpen(true);
  };

  const saveEdit = (next) => {
    setConfigItems(configItems.map((i) => (i.id === next.id ? next : i)));
    setEditOpen(false);
    message.success(`电路 ${next.code} 已更新`);
  };

  const removeItem = (id) => {
    setConfigItems(configItems.filter((i) => i.id !== id));
    message.success("已移出配置清单");
  };

  const applyBatch = ({ status, priority }) => {
    setConfigItems(configItems.map((i) => (selectedKeys.includes(i.id) ? { ...i, status: status || i.status, priority: priority || i.priority } : i)));
    setBatchOpen(false);
    setSelectedKeys([]);
    message.success("批量配置已下发");
  };

  const doSubmit = () => {
    const order = {
      id: `o-${Date.now()}`,
      orderNo: `GD-2026-${String(100000 + Math.floor(Math.random() * 9000))}`,
      customer: configItems.length ? configItems[0].customer : "—",
      scene: configItems[0]?.scene || "云专线接入",
      bandwidth: configItems[0]?.bandwidth || "—",
      stations: configItems.length,
      amount: totalFee,
      status: "review",
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      eta: "待评估",
    };
    setOrders([order, ...orders]);
    setConfigItems([]);
    setSubmitOpen(false);
    setSelectedKeys([]);
    message.success(`工单 ${order.orderNo} 已提交，正在跳转工单列表`);
    setActiveTab("orders");
  };

  const columns = [
    {
      title: "电路编号",
      dataIndex: "code",
      width: 168,
      render: (v, row) => (
        <a className="cell-link" onClick={() => openEdit(row)}>{v}</a>
      ),
    },
    { title: "客户名称", dataIndex: "customer", width: 200, ellipsis: true },
    { title: "带宽", dataIndex: "bandwidth", width: 100, sorter: (a, b) => mbps(a.bandwidth) - mbps(b.bandwidth) },
    { title: "计费周期", dataIndex: "cycle", width: 108, filters: CYCLE_FILTERS, onFilter: (v, r) => r.cycle === v },
    { title: "接入站点", dataIndex: "station", width: 210, ellipsis: true },
    { title: "区域", dataIndex: "region", width: 110, filters: REGION_FILTERS, onFilter: (v, r) => r.region === v },
    {
      title: "优先级",
      dataIndex: "priority",
      width: 96,
      filters: PRIORITY_FILTERS,
      onFilter: (v, r) => r.priority === v,
      render: (v) => <StatusTag value={v} map={PRIORITY_TAG} />,
    },
    {
      title: "月费 (元)",
      dataIndex: "price",
      width: 116,
      align: "right",
      sorter: (a, b) => a.price - b.price,
      render: (v) => v.toLocaleString(),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 110,
      filters: STATUS_FILTERS,
      onFilter: (v, r) => r.status === v,
      render: (v) => <StatusTag value={v} map={ITEM_STATUS} />,
    },
    {
      title: "操作",
      key: "action",
      width: 88,
      align: "left",
      render: (_, row) => (
        <div className="row-actions">
          <Icon name="square-pen" size="0.875rem" title="编辑" className="row-action" onClick={() => openEdit(row)} />
          <Icon name="trash-2" size="0.875rem" title="移出清单" className="row-action row-action-danger" onClick={() => removeItem(row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="cfg-table">
      <div className="cfg-table-toolbar">
        {selectedKeys.length > 0 ? (
          <div className="cfg-selected">
            <span>已选 <strong>{selectedKeys.length}</strong> 条</span>
            <Button size="small" icon={<Icon name="sliders-horizontal" size="0.875rem" />} onClick={() => setBatchOpen(true)}>批量配置</Button>
          </div>
        ) : (
          <span className="cfg-toolbar-hint">配置清单随左侧表单生成，可逐条核对与调整</span>
        )}
        <div className="cfg-table-tools">
          <Input
            size="small"
            allowClear
            style={{ width: "14rem" }}
            placeholder="搜索电路编号 / 客户 / 站点"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
          />
          <Dropdown menu={EXPORT_MENU} placement="bottomRight">
            <Button size="small" icon={<Icon name="download" size="0.875rem" />}>导出</Button>
          </Dropdown>
        </div>
      </div>

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={filtered}
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: (keys) => setSelectedKeys(keys) }}
        pagination={{ pageSize: 6, showSizeChanger: false }}
        scroll={{ x: 1180 }}
      />

      <div className="cfg-summary">
        <div className="cfg-summary-item"><span className="cfg-summary-label">合计电路</span><span className="cfg-summary-value">{configItems.length} 条</span></div>
        <div className="cfg-summary-item"><span className="cfg-summary-label">总带宽</span><span className="cfg-summary-value">{totalBandwidth.toLocaleString()} Mbps</span></div>
        <div className="cfg-summary-item"><span className="cfg-summary-label">预估月费</span><span className="cfg-summary-value">¥ {totalFee.toLocaleString()}</span></div>
        <div className="cfg-summary-actions">
          <Button type="primary" disabled={!configItems.length} icon={<Icon name="send" size="0.875rem" />} onClick={() => setSubmitOpen(true)}>提交工单</Button>
        </div>
      </div>

      <BatchModal open={batchOpen} count={selectedKeys.length} onCancel={() => setBatchOpen(false)} onOk={applyBatch} />
      <EditModal open={editOpen} item={editItem} onCancel={() => setEditOpen(false)} onSave={saveEdit} />
      <SubmitModal open={submitOpen} items={configItems} totalBandwidth={totalBandwidth} totalFee={totalFee} onCancel={() => setSubmitOpen(false)} onConfirm={doSubmit} />
    </div>
  );
}

// Layer 4: 设备运行明细表格
import { useState } from "react";
import { Table, Input, Button, Segmented } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { deviceList } from "../../mock/dashboard.js";
import "./index.css";

export default function DeviceTable({ onView }) {
  const [keyword, setKeyword] = useState("");
  const [view, setView] = useState("全部");

  const filtered = deviceList.filter((d) => {
    const matchView = view === "全部" || d.status === view;
    const kw = keyword.trim();
    const matchKeyword =
      !kw ||
      d.name.includes(kw) ||
      d.code.toLowerCase().includes(kw.toLowerCase()) ||
      d.ip.includes(kw);
    return matchView && matchKeyword;
  });

  const columns = [
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 210,
      render: (text, record) => (
        <a className="device-table__link" onClick={() => onView(record)}>
          {text}
        </a>
      ),
    },
    { title: "设备编号", dataIndex: "code", key: "code", width: 120 },
    { title: "所属区域", dataIndex: "region", key: "region", width: 100 },
    { title: "设备类型", dataIndex: "type", key: "type", width: 120 },
    {
      title: "运行状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (s) => <StatusTag status={s} />,
    },
    {
      title: "负载率",
      dataIndex: "load",
      key: "load",
      width: 100,
      align: "right",
      render: (v) => `${v}%`,
    },
    {
      title: "温度",
      dataIndex: "temp",
      key: "temp",
      width: 90,
      align: "right",
      render: (v) => `${v}°C`,
    },
    { title: "更新时间", dataIndex: "updated", key: "updated", width: 160 },
    {
      title: "操作",
      key: "action",
      width: 90,
      render: (_, record) => (
        <div className="device-table__actions">
          <Icon name="eye" size="0.875rem" title="查看详情" onClick={() => onView(record)} />
          <Icon name="ellipsis" size="0.875rem" title="更多操作" />
        </div>
      ),
    },
  ];

  return (
    <section className="device-table">
      <div className="device-table__head">
        <div className="device-table__title-wrap">
          <h3 className="device-table__title">设备运行明细</h3>
          <span className="device-table__count">共 {deviceList.length} 台设备</span>
        </div>
        <div className="device-table__tools">
          <Segmented
            size="small"
            options={["全部", "运行中", "待机", "告警", "离线"]}
            value={view}
            onChange={setView}
          />
          <Input
            size="small"
            className="device-table__search"
            placeholder="搜索名称、编号或 IP"
            suffix={<Icon name="search" size="0.875rem" />}
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button size="small" icon={<Icon name="download" size="0.875rem" />}>
            导出
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        size="middle"
        scroll={{ x: 1100 }}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </section>
  );
}

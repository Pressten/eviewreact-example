import { useState } from "react";
import { Table, Input, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { records, RECORD_STAGES, RECORD_STATUS } from "../../mock/record.js";
import StatusTag from "../../components/status-tag/index.jsx";
import StepFlow from "../../components/step-flow/index.jsx";
import "../shared-table.css";

// Layer 4: 执行记录表格 — 含步骤条列,执行 ID 链接可跳转链路详情页签
export default function RecordTable() {
  const { openDetail } = useApp();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [keyword, setKeyword] = useState("");

  const data = records.filter((r) => {
    if (!keyword) return true;
    const k = keyword.toLowerCase();
    return (
      r.id.toLowerCase().indexOf(k) > -1 ||
      r.name.toLowerCase().indexOf(k) > -1 ||
      r.node.indexOf(keyword) > -1
    );
  });

  const columns = [
    {
      title: "执行 ID",
      dataIndex: "id",
      key: "id",
      width: 190,
      render: (value, row) => (
        <a className="table-link" onClick={() => openDetail({ kind: "record", ...row })}>
          {value}
        </a>
      ),
    },
    {
      title: "关联任务",
      dataIndex: "name",
      key: "name",
      width: 240,
      render: (value, row) => (
        <a className="table-link" onClick={() => openDetail({ kind: "record", ...row })}>
          {value}
        </a>
      ),
    },
    { title: "执行节点", dataIndex: "node", key: "node", width: 140 },
    {
      title: "执行结果",
      dataIndex: "status",
      key: "status",
      width: 110,
      filters: Object.keys(RECORD_STATUS).map((k) => ({ text: RECORD_STATUS[k].text, value: k })),
      onFilter: (value, row) => row.status === value,
      render: (value) => <StatusTag {...RECORD_STATUS[value]} />,
    },
    {
      title: "阶段流程",
      key: "stage",
      width: 210,
      render: (_, row) => <StepFlow stages={RECORD_STAGES} stage={row.stage} status={row.status} variant="cell" />,
    },
    { title: "耗时", dataIndex: "duration", key: "duration", width: 120 },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      width: 170,
      sorter: (a, b) => a.startTime.localeCompare(b.startTime),
    },
    {
      title: "操作",
      key: "action",
      width: 110,
      fixed: "right",
      render: (_, row) => (
        <div className="table-actions">
          <Icon name="eye" size="0.875rem" title="查看链路详情" onClick={() => openDetail({ kind: "record", ...row })} />
          <Icon name="rotate-cw" size="0.875rem" title="重新执行" />
          <Icon name="file-check" size="0.875rem" title="查看日志" />
        </div>
      ),
    },
  ];

  return (
    <div className="data-view">
      <div className="data-toolbar">
        <div className="data-toolbar__left">
          {selectedKeys.length > 0 ? (
            <span className="data-toolbar__selected">
              已选 {selectedKeys.length} 项
              <a className="table-link">批量重跑</a>
              <a className="table-link">下载日志</a>
            </span>
          ) : (
            <span className="data-toolbar__hint">共 {data.length} 条执行记录，点击执行 ID 可跳转链路详情</span>
          )}
        </div>
        <div className="data-toolbar__right">
          <Input
            size="small"
            allowClear
            placeholder="搜索执行 ID、任务或节点"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
            style={{ width: "15rem" }}
          />
          <Button size="small" icon={<Icon name="refresh-cw" size="0.875rem" />}>刷新</Button>
          <Button size="small" type="primary" icon={<Icon name="download" size="0.875rem" />}>导出记录</Button>
        </div>
      </div>
      <Table
        className="data-table"
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={data}
        scroll={{ x: 1290 }}
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
      />
    </div>
  );
}

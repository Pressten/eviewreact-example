import { useState } from "react";
import { Table, Input, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { tasks, STAGES, TASK_STATUS } from "../../mock/task.js";
import StatusTag from "../../components/status-tag/index.jsx";
import StepFlow from "../../components/step-flow/index.jsx";
import "../shared-table.css";

// Layer 4: 任务清单表格 — 含步骤条列,名称链接可跳转链路详情页签
export default function TaskTable() {
  const { openDetail } = useApp();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [keyword, setKeyword] = useState("");

  const data = tasks.filter((t) => {
    if (!keyword) return true;
    const k = keyword.toLowerCase();
    return (
      t.name.toLowerCase().indexOf(k) > -1 ||
      t.id.toLowerCase().indexOf(k) > -1 ||
      t.owner.indexOf(keyword) > -1
    );
  });

  const columns = [
    {
      title: "任务名称",
      dataIndex: "name",
      key: "name",
      width: 210,
      render: (value, row) => (
        <a className="table-link" onClick={() => openDetail({ kind: "task", ...row })}>
          {value}
        </a>
      ),
    },
    {
      title: "任务类型",
      dataIndex: "typeLabel",
      key: "typeLabel",
      width: 110,
      filters: [
        { text: "批量任务", value: "批量任务" },
        { text: "实时任务", value: "实时任务" },
        { text: "定时任务", value: "定时任务" },
      ],
      onFilter: (value, row) => row.typeLabel === value,
    },
    { title: "数据源", dataIndex: "source", key: "source", width: 130 },
    { title: "负责人", dataIndex: "owner", key: "owner", width: 90 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: Object.keys(TASK_STATUS).map((k) => ({ text: TASK_STATUS[k].text, value: k })),
      onFilter: (value, row) => row.status === value,
      render: (value) => <StatusTag {...TASK_STATUS[value]} />,
    },
    {
      title: "阶段流程",
      key: "stage",
      width: 210,
      render: (_, row) => <StepFlow stages={STAGES} stage={row.stage} status={row.status} variant="cell" />,
    },
    {
      title: "数据量",
      dataIndex: "rows",
      key: "rows",
      width: 110,
      align: "right",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: "操作",
      key: "action",
      width: 130,
      fixed: "right",
      render: (_, row) => (
        <div className="table-actions">
          <Icon name="eye" size="0.875rem" title="查看链路详情" onClick={() => openDetail({ kind: "task", ...row })} />
          <Icon name="refresh-cw" size="0.875rem" title="重新执行" />
          <Icon name="trash-2" size="0.875rem" title="删除任务" />
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
              <a className="table-link">批量导出</a>
            </span>
          ) : (
            <span className="data-toolbar__hint">共 {data.length} 个任务，点击任务名称可跳转链路详情</span>
          )}
        </div>
        <div className="data-toolbar__right">
          <Input
            size="small"
            allowClear
            placeholder="搜索名称、ID 或负责人"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
            style={{ width: "14rem" }}
          />
          <Button size="small" icon={<Icon name="download" size="0.875rem" />}>导出</Button>
          <Button size="small" type="primary" icon={<Icon name="plus" size="0.875rem" />}>新建任务</Button>
        </div>
      </div>
      <Table
        className="data-table"
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={data}
        scroll={{ x: 1280 }}
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
      />
    </div>
  );
}

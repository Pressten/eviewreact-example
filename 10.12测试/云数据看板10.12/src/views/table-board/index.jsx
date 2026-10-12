import { useState } from "react";
import { Table, Input, Button, Dropdown, Progress, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { instances } from "../../mock/dashboard.js";
import "./index.css";

const rowMenu = {
  items: [
    { key: "restart", icon: <Icon name="rotate-cw" size="0.875rem" />, label: "重启实例" },
    { key: "snapshot", icon: <Icon name="camera" size="0.875rem" />, label: "创建快照" },
    { key: "resize", icon: <Icon name="scaling" size="0.875rem" />, label: "变更规格" },
    { type: "divider" },
    { key: "release", icon: <Icon name="trash-2" size="0.875rem" />, label: "释放实例", danger: true },
  ],
};

export default function TableBoard({ onOpen }) {
  const [keyword, setKeyword] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);

  const dataSource = instances.filter((r) => {
    if (!keyword) return true;
    const kw = keyword.toLowerCase();
    return (
      r.name.toLowerCase().includes(kw) ||
      r.id.toLowerCase().includes(kw) ||
      r.owner.includes(keyword)
    );
  });

  const columns = [
    {
      title: "实例名称",
      dataIndex: "name",
      key: "name",
      width: 180,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, row) => (
        <a className="cell-link" onClick={() => onOpen(row)}>
          {text}
        </a>
      ),
    },
    {
      title: "实例 ID",
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "区域",
      dataIndex: "region",
      key: "region",
      width: 130,
      filters: [...new Set(instances.map((r) => r.region))].map((v) => ({ text: v, value: v })),
      onFilter: (value, row) => row.region === value,
    },
    {
      title: "规格",
      dataIndex: "spec",
      key: "spec",
      width: 150,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [...new Set(instances.map((r) => r.status))].map((v) => ({ text: v, value: v })),
      onFilter: (value, row) => row.status === value,
      render: (value) => <StatusTag value={value} />,
    },
    {
      title: "CPU 使用率",
      dataIndex: "cpu",
      key: "cpu",
      width: 170,
      align: "right",
      sorter: (a, b) => a.cpu - b.cpu,
      render: (value) => (
        <div className="cell-meter">
          <Progress
            percent={value}
            size="small"
            showInfo={false}
            status={value >= 85 ? "exception" : "normal"}
          />
          <span className="cell-meter__val">{value}%</span>
        </div>
      ),
    },
    {
      title: "内存使用率",
      dataIndex: "memory",
      key: "memory",
      width: 120,
      align: "right",
      sorter: (a, b) => a.memory - b.memory,
      render: (value) => <span className="cell-num">{value}%</span>,
    },
    {
      title: "负责人",
      dataIndex: "owner",
      key: "owner",
      width: 100,
      filters: [...new Set(instances.map((r) => r.owner))].map((v) => ({ text: v, value: v })),
      onFilter: (value, row) => row.owner === value,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 170,
      sorter: (a, b) => a.updateTime.localeCompare(b.updateTime),
    },
    {
      title: "操作",
      key: "action",
      width: 130,
      align: "left",
      fixed: "right",
      render: (_, row) => (
        <div className="cell-actions">
          <Icon name="eye" size="0.875rem" title="查看详情" onClick={() => onOpen(row)} />
          <Icon name="rotate-cw" size="0.875rem" title="重启实例" />
          <Dropdown menu={rowMenu} placement="bottomRight" trigger={["click"]}>
            <span className="cell-actions__more">
              <Icon name="ellipsis" size="0.875rem" title="更多操作" />
            </span>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <SectionCard
      title="云主机实例"
      subtitle={`共 ${dataSource.length} 个实例`}
      bodyClassName="section-card__body--flush"
      extra={
        <div className="table-tools">
          {selectedKeys.length > 0 ? (
            <span className="table-tools__selected">
              已选 {selectedKeys.length} 项
              <a className="cell-link" onClick={() => setSelectedKeys([])}>
                取消选择
              </a>
            </span>
          ) : null}
          <Input
            className="table-tools__search"
            size="small"
            allowClear
            placeholder="搜索实例名称、ID 或负责人"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            suffix={<Icon name="search" size="0.875rem" />}
          />
          <Tooltip title="刷新">
            <span className="table-tools__icon">
              <Icon name="refresh-cw" size="1rem" />
            </span>
          </Tooltip>
          <Button size="small" icon={<Icon name="download" size="0.875rem" />}>
            导出
          </Button>
          <Button size="small" type="primary" icon={<Icon name="plus" size="0.875rem" />}>
            新建实例
          </Button>
        </div>
      }
    >
      <Table
        className="instance-table"
        rowKey="id"
        size="large"
        columns={columns}
        dataSource={dataSource}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => setSelectedKeys(keys),
        }}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 1400 }}
      />
    </SectionCard>
  );
}

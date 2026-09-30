import { useMemo, useState, useEffect } from "react";
import { Table, Button, Dropdown, Tooltip, Segmented, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { formatRows } from "../../mock/datasource.js";
import PageCard from "../../components/page-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

const CURRENT_USER = "张伟";
const PAGE_SIZE = 10;

// Layer 4: 数据源列表 — 工具区 + 数据表格 + 内置分页
export default function DatasourceTable() {
  const { list, filters, setStatuses, openEditor, openRemoving } = useApp();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [view, setView] = useState("all");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  useEffect(() => {
    setCurrent(1);
  }, [filters, view]);

  const rows = useMemo(() => {
    const keyword = (filters.keyword || "").trim().toLowerCase();
    return list.filter((item) => {
      if (view === "mine" && item.owner !== CURRENT_USER) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.dept && item.dept !== filters.dept) return false;
      if (filters.range && filters.range.length === 2) {
        const start = filters.range[0].format("YYYY-MM-DD");
        const end = filters.range[1].format("YYYY-MM-DD");
        if (item.createdAt < start || item.createdAt > end) return false;
      }
      if (keyword) {
        const haystack = `${item.name} ${item.id} ${item.address} ${item.owner}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });
  }, [list, filters, view]);

  const clearSelection = () => setSelectedRowKeys([]);

  const handleBulkStatus = (status, label) => {
    setStatuses(selectedRowKeys, status);
    message.success(`已${label} ${selectedRowKeys.length} 个数据源`);
    clearSelection();
  };

  const handleRowAction = (key, record) => {
    if (key === "detail") {
      openEditor("edit", record);
      return;
    }
    if (key === "copy") {
      message.success(`已复制「${record.name}」的连接配置`);
      return;
    }
    if (key === "log") {
      message.success(`「${record.name}」的同步日志已开始导出`);
      return;
    }
    if (key === "delete") {
      openRemoving([record.id]);
    }
  };

  const columns = [
    {
      title: "数据源名称",
      dataIndex: "name",
      key: "name",
      width: 240,
      fixed: "left",
      render: (value, record) => (
        <a className="ds-link" onClick={() => openEditor("edit", record)}>
          {value}
        </a>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 116,
      render: (value) => <span className="ds-type">{value}</span>,
    },
    { title: "归属部门", dataIndex: "dept", key: "dept", width: 150 },
    { title: "负责人", dataIndex: "owner", key: "owner", width: 96 },
    {
      title: "数据表数",
      dataIndex: "tables",
      key: "tables",
      width: 116,
      align: "right",
      sorter: (a, b) => a.tables - b.tables,
    },
    {
      title: "数据量",
      dataIndex: "rows",
      key: "rows",
      width: 124,
      align: "right",
      sorter: (a, b) => a.rows - b.rows,
      render: (value) => formatRows(value),
    },
    { title: "更新频率", dataIndex: "freq", key: "freq", width: 108 },
    {
      title: "运行状态",
      dataIndex: "status",
      key: "status",
      width: 118,
      render: (value) => <StatusTag status={value} />,
    },
    {
      title: "最近更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 172,
      render: (value) => <span className="ds-muted">{value}</span>,
    },
    {
      title: "操作",
      key: "action",
      width: 148,
      align: "left",
      render: (_, record) => (
        <div className="ds-actions">
          <Tooltip title="编辑">
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<Icon name="pencil" size="0.875rem" />}
              onClick={() => openEditor("edit", record)}
            />
          </Tooltip>
          <Tooltip title={record.status === "offline" ? "上线" : "下线"}>
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<Icon name="power" size="0.875rem" />}
              onClick={() => {
                setStatuses([record.id], record.status === "offline" ? "online" : "offline");
                message.success(record.status === "offline" ? "数据源已上线" : "数据源已下线");
              }}
            />
          </Tooltip>
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              items: [
                { key: "detail", label: "查看详情" },
                { key: "copy", label: "复制配置" },
                { key: "log", label: "导出同步日志" },
                { type: "divider" },
                { key: "delete", label: "删除数据源", danger: true },
              ],
              onClick: ({ key }) => handleRowAction(key, record),
            }}
          >
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<Icon name="ellipsis" size="0.875rem" />}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  const hasSelection = selectedRowKeys.length > 0;

  return (
    <PageCard
      title="数据源列表"
      subtitle={`已接入 ${list.length} 个数据源`}
      className="table-card"
      bodyClassName="table-card__body"
      extra={
        <>
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { label: "全部数据源", value: "all" },
              { label: "我负责的", value: "mine" },
            ]}
          />
          <Button
            type="primary"
            icon={<Icon name="plus" size="0.875rem" />}
            onClick={() => openEditor("create")}
          >
            新建数据源
          </Button>
        </>
      }
    >
      <div className="table-toolbar">
        <div className="table-toolbar__info">
          {hasSelection ? `已选 ${selectedRowKeys.length} 项` : `共 ${rows.length} 条记录`}
        </div>
        <div className="table-toolbar__actions">
          {hasSelection ? (
            <>
              <a className="ds-link ds-link--plain" onClick={clearSelection}>
                取消选择
              </a>
              <Button size="small" onClick={() => handleBulkStatus("online", "上线")}>
                批量上线
              </Button>
              <Button size="small" onClick={() => handleBulkStatus("offline", "下线")}>
                批量下线
              </Button>
              <Button size="small" danger onClick={() => openRemoving(selectedRowKeys)}>
                批量删除
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={rows}
        scroll={{ x: 1560 }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        pagination={{
          current,
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size);
          },
        }}
      />
    </PageCard>
  );
}

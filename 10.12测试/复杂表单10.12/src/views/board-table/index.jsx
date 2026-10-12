// Layer 4: 板卡配置清单表格 — 页面最下方信息区
import { useMemo, useState } from "react";
import { Button, Input, Select, Table, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { boardRows, STATUS_DICT, vendorOptions } from "../../mock/operator.js";
import "./index.css";

const VENDOR_MAP = vendorOptions.reduce((acc, item) => {
  acc[item.value] = item.label.replace(/（.*）/, "");
  return acc;
}, {});

const STATUS_FILTERS = Object.entries(STATUS_DICT).map(([value, cfg]) => ({
  text: cfg.text,
  value,
}));

export default function BoardTable() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState(["BD-2403", "BD-2410"]);

  const dataSource = useMemo(() => {
    return boardRows.filter((row) => {
      const matchKeyword =
        !keyword ||
        row.name.includes(keyword) ||
        row.id.toLowerCase().includes(keyword.toLowerCase()) ||
        row.model.toLowerCase().includes(keyword.toLowerCase());
      const matchStatus = statusFilter === "all" || row.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [keyword, statusFilter]);

  const columns = [
    {
      title: "板卡名称",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <a className="table-link" onClick={() => message.info(`查看板卡详情：${text}`)}>
          {text}
        </a>
      ),
    },
    {
      title: "槽位号",
      dataIndex: "slot",
      key: "slot",
      width: 92,
      align: "right",
      sorter: (a, b) => a.slot - b.slot,
      defaultSortOrder: "ascend",
    },
    {
      title: "板卡型号",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "厂商",
      dataIndex: "vendor",
      key: "vendor",
      render: (v) => VENDOR_MAP[v] || v,
    },
    {
      title: "端口总数",
      dataIndex: "ports",
      key: "ports",
      width: 104,
      align: "right",
      sorter: (a, b) => a.ports - b.ports,
    },
    {
      title: "已用端口",
      dataIndex: "usedPorts",
      key: "usedPorts",
      width: 104,
      align: "right",
      sorter: (a, b) => a.usedPorts - b.usedPorts,
    },
    {
      title: "软件版本",
      dataIndex: "version",
      key: "version",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 108,
      filters: STATUS_FILTERS,
      onFilter: (value, record) => record.status === value,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 156,
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      align: "left",
      render: (_, record) => (
        <div className="row-actions">
          <Icon
            name="pencil-line"
            size="0.875rem"
            title="编辑板卡"
            onClick={() => message.info(`编辑 ${record.name}`)}
          />
          <Icon
            name="copy"
            size="0.875rem"
            title="复制板卡"
            onClick={() => message.info(`复制 ${record.name}`)}
          />
          <Icon
            name="trash-2"
            size="0.875rem"
            title="删除板卡"
            onClick={() => message.info(`删除 ${record.name}`)}
          />
        </div>
      ),
    },
  ];

  return (
    <section className="board-table">
      <header className="board-table__head">
        <div className="board-table__title-wrap">
          <h3 className="board-table__title">板卡配置清单</h3>
          <span className="board-table__subtitle">
            共 {dataSource.length} 块板卡 · 与上方「设备与板卡信息」联动
          </span>
        </div>
        <div className="board-table__tools">
          <Input
            className="board-table__search"
            placeholder="搜索板卡名称、型号或编号"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            suffix={<Icon name="search" size="0.875rem" />}
          />
          <Select
            className="board-table__filter"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ value: "all", label: "全部状态" }, ...STATUS_FILTERS]}
          />
          <Button icon={<Icon name="download" size="0.875rem" />}>导出</Button>
          <Button type="primary" icon={<Icon name="plus" size="0.875rem" />}>
            新增板卡
          </Button>
        </div>
      </header>

      {selectedRowKeys.length > 0 ? (
        <div className="board-table__selected">
          <span>
            已选择 <em>{selectedRowKeys.length}</em> 项
          </span>
          <div className="board-table__selected-actions">
            <a
              className="table-link"
              onClick={() => message.info(`批量激活 ${selectedRowKeys.length} 块板卡`)}
            >
              批量激活
            </a>
            <a
              className="table-link"
              onClick={() => setSelectedRowKeys([])}
            >
              取消选择
            </a>
          </div>
        </div>
      ) : null}

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={dataSource}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
        scroll={{ x: 1180 }}
      />
    </section>
  );
}

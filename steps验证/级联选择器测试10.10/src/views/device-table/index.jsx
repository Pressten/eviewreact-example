import { useMemo, useState } from "react";
import { Button, Dropdown, Input, Table, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { DEVICE_STATUS } from "../../mock/devices.js";
import { deviceTypeLabel, deviceTypeOptions, protocolLabel, protocolOptions } from "../../mock/form-options.js";
import "./index.css";

export default function DeviceTable({ data, onDelete, onDeleteMany, onDuplicate, onAdd }) {
  const [keyword, setKeyword] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);

  const statusFilters = Object.keys(DEVICE_STATUS).map((key) => ({
    text: DEVICE_STATUS[key].text,
    value: key,
  }));
  const typeFilters = deviceTypeOptions.map((o) => ({ text: o.label, value: o.value }));
  const protocolFilters = protocolOptions.map((o) => ({ text: o.label, value: o.value }));

  const rows = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return data;
    return data.filter(
      (row) =>
        row.name.toLowerCase().indexOf(kw) >= 0 ||
        row.code.toLowerCase().indexOf(kw) >= 0 ||
        row.region.toLowerCase().indexOf(kw) >= 0
    );
  }, [data, keyword]);

  const columns = [
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
      render: (text, row) => (
        <a className="table-link" onClick={() => message.info("查看设备 " + row.code)}>
          {text}
        </a>
      ),
    },
    { title: "设备编码", dataIndex: "code", key: "code" },
    {
      title: "设备类型",
      dataIndex: "type",
      key: "type",
      filters: typeFilters,
      onFilter: (value, row) => row.type === value,
      render: (value) => deviceTypeLabel(value),
    },
    { title: "所属分组", dataIndex: "group", key: "group" },
    { title: "部署位置", dataIndex: "region", key: "region" },
    {
      title: "接入协议",
      dataIndex: "protocol",
      key: "protocol",
      filters: protocolFilters,
      onFilter: (value, row) => row.protocol === value,
      render: (value) => protocolLabel(value),
    },
    {
      title: "端口",
      dataIndex: "port",
      key: "port",
      align: "right",
      width: 90,
      sorter: (a, b) => (a.port || 0) - (b.port || 0),
      render: (value) => (value === null || value === undefined ? "—" : value),
    },
    {
      title: "采集周期(s)",
      dataIndex: "samples",
      key: "samples",
      align: "right",
      width: 120,
      sorter: (a, b) => a.samples - b.samples,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      filters: statusFilters,
      onFilter: (value, row) => row.status === value,
      render: (value) => {
        const meta = DEVICE_STATUS[value] || { text: value, tone: "neutral" };
        return <StatusTag tone={meta.tone}>{meta.text}</StatusTag>;
      },
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 170,
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
    },
    {
      title: "操作",
      key: "action",
      width: 130,
      fixed: "right",
      render: (text, row) => (
        <div className="row-actions">
          <Icon
            name="pencil"
            size="0.875rem"
            className="row-action"
            title="编辑"
            onClick={() => message.info("编辑 " + row.code)}
          />
          <Icon
            name="copy"
            size="0.875rem"
            className="row-action"
            title="复制"
            onClick={() => onDuplicate(row.id)}
          />
          <Icon
            name="trash-2"
            size="0.875rem"
            className="row-action"
            title="删除"
            onClick={() => onDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  const toolbar = (
    <div className="device-table__toolbar">
      <Input
        className="device-table__search"
        allowClear
        placeholder="搜索名称、编码或位置"
        value={keyword}
        suffix={<Icon name="search" size="0.875rem" />}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Icon
        name="rotate-ccw"
        size="1rem"
        className="toolbar-icon"
        title="刷新列表"
        onClick={() => {
          setKeyword("");
          message.success("列表已刷新");
        }}
      />
      <Dropdown
        menu={{
          items: [
            { key: "csv", label: "导出 CSV" },
            { key: "excel", label: "导出 Excel" },
          ],
          onClick: ({ key }) => message.success("已导出 " + rows.length + " 条记录（" + key + "）"),
        }}
      >
        <Button icon={<Icon name="file-down" size="0.875rem" />}>导出</Button>
      </Dropdown>
      <Button type="primary" icon={<Icon name="plus" size="0.875rem" />} onClick={onAdd}>
        新增配置
      </Button>
    </div>
  );

  return (
    <SectionCard
      title="设备接入列表"
      subtitle={"共 " + data.length + " 台设备 · 当前展示 " + rows.length + " 条"}
      extra={toolbar}
    >
      {selectedKeys.length > 0 ? (
        <div className="device-table__selection">
          <span className="device-table__selection-text">已选 {selectedKeys.length} 项</span>
          <div className="device-table__selection-actions">
            <a
              className="table-link"
              onClick={() => {
                message.success("已启用 " + selectedKeys.length + " 台设备");
                setSelectedKeys([]);
              }}
            >
              批量启用
            </a>
            <a
              className="table-link"
              onClick={() => {
                onDeleteMany(selectedKeys);
                setSelectedKeys([]);
              }}
            >
              批量删除
            </a>
          </div>
        </div>
      ) : null}

      <Table
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={rows}
        scroll={{ x: 1500 }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: setSelectedKeys,
          preserveSelectedRowKeys: true,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => "共 " + total + " 条",
        }}
      />
    </SectionCard>
  );
}

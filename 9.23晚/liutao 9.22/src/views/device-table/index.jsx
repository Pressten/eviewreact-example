import { useState } from "react";
import { Table, Button, Input, Drawer, Select, message, Modal } from "antd";
import { useApp } from "../../context.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { deviceList, DEVICE_STATUS, DEVICE_TYPES } from "../../mock/device.js";
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

// Layer 4: 设备管理视图 — 搜索 + 操作按钮 + 可排序可筛选表格
// 表格内设备名称为链接,点击跳转告警页签;操作列纯图标按钮跳转配置页签

function findTypeName(type) {
  const t = DEVICE_TYPES.find((d) => d.value === type);
  return t ? t.text : type;
}

export default function DeviceTable() {
  const { selectedRowKeys, setSelectedRowKeys, jumpToTab } = useApp();
  const [keyword, setKeyword] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [advType, setAdvType] = useState(undefined);
  const [advStatus, setAdvStatus] = useState(undefined);

  const filteredData = deviceList.filter((d) => {
    const kw = keyword.trim().toLowerCase();
    const kwMatch =
      !kw ||
      d.name.toLowerCase().includes(kw) ||
      d.id.toLowerCase().includes(kw) ||
      d.ip.includes(kw);
    const typeMatch = !advType || d.type === advType;
    const statusMatch = !advStatus || d.status === advStatus;
    return kwMatch && typeMatch && statusMatch;
  });

  const columns = [
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Button type="link" className="device-name-link" onClick={() => jumpToTab("alarm", record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "设备ID",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "设备类型",
      dataIndex: "type",
      key: "type",
      width: 110,
      filters: DEVICE_TYPES.map((t) => ({ text: t.text, value: t.value })),
      onFilter: (value, record) => record.type === value,
      render: (type) => findTypeName(type),
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
      width: 130,
    },
    {
      title: "机房位置",
      dataIndex: "room",
      key: "room",
      width: 120,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: Object.entries(DEVICE_STATUS).map(([k, v]) => ({ text: v.text, value: k })),
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const s = DEVICE_STATUS[status];
        return <StatusTag text={s.text} tone={s.tone} />;
      },
    },
    {
      title: "告警数",
      dataIndex: "alarmCount",
      key: "alarmCount",
      width: 90,
      align: "right",
      sorter: (a, b) => a.alarmCount - b.alarmCount,
    },
    {
      title: "CPU",
      dataIndex: "cpu",
      key: "cpu",
      width: 80,
      align: "right",
      sorter: (a, b) => a.cpu - b.cpu,
      render: (v) => (v > 0 ? `${v}%` : "—"),
    },
    {
      title: "最后在线时间",
      dataIndex: "lastTime",
      key: "lastTime",
      width: 170,
      sorter: (a, b) => new Date(a.lastTime).getTime() - new Date(b.lastTime).getTime(),
    },
    {
      title: "操作",
      key: "action",
      width: 90,
      align: "center",
      render: (_, record) => (
        <div className="device-action-group">
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<Icon name="bell" size={14} />}
            onClick={() => jumpToTab("alarm", record)}
          />
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<Icon name="settings" size={14} />}
            onClick={() => jumpToTab("config", record)}
          />
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要删除的设备");
      return;
    }
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除选中的 ${selectedRowKeys.length} 台设备吗?此操作不可撤销。`,
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        message.success(`已删除 ${selectedRowKeys.length} 台设备`);
        setSelectedRowKeys([]);
      },
    });
  };

  const handleExport = () => {
    message.success(`已导出 ${filteredData.length} 条设备数据`);
  };

  const handleAdvSearch = () => {
    setDrawerOpen(false);
    message.success("高级搜索条件已应用");
  };

  const handleAdvReset = () => {
    setAdvType(undefined);
    setAdvStatus(undefined);
  };

  return (
    <div className="device-table-view">
      <div className="table-toolbar">
        <div className="table-toolbar__search">
          <Input
            prefix={<Icon name="search" size={14} />}
            placeholder="搜索设备名称、ID 或 IP"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
          />
        </div>
        <div className="table-toolbar__actions">
          <Button icon={<Icon name="sliders-horizontal" size={14} />} onClick={() => setDrawerOpen(true)}>
            高级搜索
          </Button>
          <Button danger icon={<Icon name="trash-2" size={14} />} onClick={handleDelete}>
            删除
          </Button>
          <Button type="primary" icon={<Icon name="download" size={14} />} onClick={handleExport}>
            导出
          </Button>
        </div>
      </div>

      {selectedRowKeys.length > 0 && (
        <div className="table-selected-bar">
          <Icon name="circle-check-big" size={14} color="var(--primary)" />
          已选择 <strong>{selectedRowKeys.length}</strong> 项
          <Button type="link" size="small" onClick={() => setSelectedRowKeys([])}>
            取消选择
          </Button>
        </div>
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        }}
        scroll={{ x: 1100 }}
      />

      <Drawer
        title="高级搜索"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={380}
        extra={
          <div className="drawer-footer-actions">
            <Button onClick={handleAdvReset}>重置</Button>
            <Button type="primary" onClick={handleAdvSearch}>
              查询
            </Button>
          </div>
        }
      >
        <div className="adv-search-form">
          <div className="adv-search-form__item">
            <label>设备类型</label>
            <Select
              placeholder="请选择设备类型"
              value={advType}
              onChange={setAdvType}
              allowClear
              options={DEVICE_TYPES.map((t) => ({ label: t.text, value: t.value }))}
            />
          </div>
          <div className="adv-search-form__item">
            <label>运行状态</label>
            <Select
              placeholder="请选择运行状态"
              value={advStatus}
              onChange={setAdvStatus}
              allowClear
              options={Object.entries(DEVICE_STATUS).map(([k, v]) => ({
                label: v.text,
                value: k,
              }))}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}

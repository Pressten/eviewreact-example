import { Table, Button, Empty } from "antd";
import { useApp } from "../../context.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { alarmList, ALARM_LEVEL } from "../../mock/device.js";
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

// Layer 4: 告警列表视图 — 展示选中设备的告警记录
// 通过表格内设备名称链接跳转至此,展示该设备关联告警

export default function AlarmList() {
  const { selectedDevice, setActiveTab, jumpToTab } = useApp();

  const data = selectedDevice
    ? alarmList.filter((a) => a.deviceId === selectedDevice.id)
    : alarmList;

  const columns = [
    {
      title: "告警ID",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "告警级别",
      dataIndex: "level",
      key: "level",
      width: 100,
      filters: Object.entries(ALARM_LEVEL).map(([k, v]) => ({ text: v.text, value: k })),
      onFilter: (value, record) => record.level === value,
      render: (level) => {
        const l = ALARM_LEVEL[level];
        return <StatusTag text={l.text} tone={l.tone} />;
      },
    },
    {
      title: "告警标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
      ellipsis: true,
    },
    {
      title: "关联设备",
      dataIndex: "deviceId",
      key: "deviceId",
      width: 130,
      render: (deviceId) => {
        const dev = alarmList.find((a) => a.deviceId === deviceId);
        return (
          <Button
            type="link"
            className="alarm-device-link"
            onClick={() => {
              const d = { id: deviceId, name: deviceId };
              jumpToTab("config", d);
            }}
          >
            {deviceId}
          </Button>
        );
      },
    },
    {
      title: "发生时间",
      dataIndex: "time",
      key: "time",
      width: 170,
      sorter: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    },
  ];

  return (
    <div className="alarm-list-view">
      {selectedDevice ? (
        <div className="alarm-list-view__header">
          <div className="alarm-list-view__device">
            <Icon name="server" size={16} color="var(--primary)" />
            <span className="alarm-list-view__device-name">{selectedDevice.name}</span>
            <span className="alarm-list-view__device-id">ID: {selectedDevice.id}</span>
          </div>
          <div className="alarm-list-view__actions">
            <Button
              icon={<Icon name="settings" size={14} />}
              onClick={() => jumpToTab("config", selectedDevice)}
            >
              查看配置
            </Button>
            <Button type="primary" onClick={() => setActiveTab("device")}>
              返回设备管理
            </Button>
          </div>
        </div>
      ) : (
        <div className="alarm-list-view__header">
          <div className="alarm-list-view__device">
            <Icon name="bell" size={16} color="var(--primary)" />
            <span>全部告警记录</span>
          </div>
        </div>
      )}

      {data.length > 0 ? (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      ) : (
        <Empty description="该设备暂无告警记录" />
      )}
    </div>
  );
}

import Table from "@nce/eview-react/Table";
import Button from "@nce/eview-react/Button";
import Empty from "@nce/eview-react/Empty";
import { useApp } from "../../context.jsx";
import { Icon } from "../../shared/icon.jsx";
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
    { title: "告警ID", key: "id", width: 120, allowSort: false },
    {
      title: "告警级别",
      key: "level",
      width: 100,
      allowSort: false,
      render: (cell) => {
        const l = ALARM_LEVEL[cell];
        return <StatusTag text={l.text} tone={l.tone} />;
      },
    },
    { title: "告警标题", key: "title", allowSort: false },
    { title: "描述", key: "desc", ellipsis: true, allowSort: false },
    {
      title: "关联设备",
      key: "deviceId",
      width: 130,
      allowSort: false,
      render: (cell) => (
        <Button
          status="text"
          text={cell}
          className="alarm-device-link"
          onClick={() => {
            const d = { id: cell, name: cell };
            jumpToTab("config", d);
          }}
        />
      ),
    },
    { title: "发生时间", key: "time", width: 170 },
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
              leftIcon={<Icon name="settings" size={14} />}
              text="查看配置"
              onClick={() => jumpToTab("config", selectedDevice)}
            />
            <Button status="primary" text="返回设备管理" onClick={() => setActiveTab("device")} />
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
          columns={columns}
          dataset={data}
          keyIndex={0}
          enablePagination
          enableAutoPaging
          pageSizeOptions={[10]}
          emptyTableMsg="该设备暂无告警记录"
        />
      ) : (
        <Empty type="success" description="该设备暂无告警记录" />
      )}
    </div>
  );
}

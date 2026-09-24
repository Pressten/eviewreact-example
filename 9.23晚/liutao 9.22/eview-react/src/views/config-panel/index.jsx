import { useState } from "react";
import Button from "@nce/eview-react/Button";
import Empty from "@nce/eview-react/Empty";
import Switch from "@nce/eview-react/Switch";
import DivMessage from "@nce/eview-react/DivMessage";
import { useApp } from "../../context.jsx";
import { Icon } from "../../shared/icon.jsx";
import { DEVICE_STATUS, DEVICE_TYPES } from "../../mock/device.js";
import StatusTag from "../../components/status-tag/index.jsx";
import KeyValueList from "../../components/key-value-list/index.jsx";
import "./index.css";

// Layer 4: 配置管理视图 — 展示选中设备的配置详情
// 通过表格操作列设置图标跳转至此
// TODO(eview-react): Descriptions 无对应组件,用 KeyValueList 手写补位

export default function ConfigPanel() {
  const { selectedDevice, setActiveTab } = useApp();
  const [autoInspect, setAutoInspect] = useState(true);
  const [alarmPush, setAlarmPush] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [notice, setNotice] = useState(null);

  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  if (!selectedDevice) {
    return (
      <div className="config-panel-view">
        <Empty
          type="success"
          description={
            <span>
              请先在设备管理页签中点击设备名称或操作按钮,选择一台设备查看配置{" "}
              <Button
                status="primary"
                text="前往设备管理"
                onClick={() => setActiveTab("device")}
                style={{ marginLeft: 8 }}
              />
            </span>
          }
        />
      </div>
    );
  }

  const status = DEVICE_STATUS[selectedDevice.status];
  const type = DEVICE_TYPES.find((t) => t.value === selectedDevice.type);

  const items = [
    { label: "设备名称", value: selectedDevice.name },
    { label: "设备ID", value: selectedDevice.id },
    { label: "设备类型", value: type ? type.text : selectedDevice.type },
    { label: "IP地址", value: selectedDevice.ip },
    { label: "机房位置", value: selectedDevice.room },
    { label: "运行状态", value: <StatusTag text={status.text} tone={status.tone} /> },
    { label: "CPU使用率", value: `${selectedDevice.cpu}%` },
    { label: "内存使用率", value: `${selectedDevice.mem}%` },
    { label: "告警数量", value: selectedDevice.alarmCount },
    { label: "最后在线时间", value: selectedDevice.lastTime },
  ];

  const handleSave = () => {
    notify("success", "设备配置已保存");
  };

  return (
    <div className="config-panel-view">
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
        />
      ) : null}

      <div className="config-panel-view__header">
        <div className="config-panel-view__title">
          <Icon name="settings" size={20} color="var(--primary)" />
          <h2 className="config-panel-view__heading">设备配置详情</h2>
        </div>
        <div className="config-panel-view__actions">
          <Button text="查看告警" onClick={() => setActiveTab("alarm")} />
          <Button status="primary" text="返回设备管理" onClick={() => setActiveTab("device")} />
        </div>
      </div>

      <div className="config-panel-view__content">
        <KeyValueList items={items} columns={2} />

        <div className="config-panel-view__settings">
          <h3 className="config-panel-view__settings-title">设备开关设置</h3>
          <div className="config-panel-view__setting-row">
            <div className="config-panel-view__setting-info">
              <span className="config-panel-view__setting-label">自动巡检</span>
              <span className="config-panel-view__setting-desc">每 30 分钟自动采集设备运行指标</span>
            </div>
            <Switch
              data={[false, true]}
              toggled={autoInspect}
              onToggle={(v) => setAutoInspect(v)}
            />
          </div>
          <div className="config-panel-view__setting-row">
            <div className="config-panel-view__setting-info">
              <span className="config-panel-view__setting-label">告警推送</span>
              <span className="config-panel-view__setting-desc">设备产生告警时实时推送到告警中心</span>
            </div>
            <Switch
              data={[false, true]}
              toggled={alarmPush}
              onToggle={(v) => setAlarmPush(v)}
            />
          </div>
          <div className="config-panel-view__setting-row">
            <div className="config-panel-view__setting-info">
              <span className="config-panel-view__setting-label">维护模式</span>
              <span className="config-panel-view__setting-desc">开启后该设备告警将被静默处理</span>
            </div>
            <Switch
              data={[false, true]}
              toggled={maintenance}
              onToggle={(v) => setMaintenance(v)}
            />
          </div>
        </div>

        <div className="config-panel-view__footer">
          <Button
            status="primary"
            leftIcon={<Icon name="save" size={14} />}
            text="保存配置"
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}

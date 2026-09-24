import { Descriptions, Button, Empty, Switch } from "antd";
import { useApp } from "../../context.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { DEVICE_STATUS, DEVICE_TYPES } from "../../mock/device.js";
import StatusTag from "../../components/status-tag/index.jsx";
import "./index.css";

// Layer 4: 配置管理视图 — 展示选中设备的配置详情
// 通过表格操作列设置图标跳转至此

export default function ConfigPanel() {
  const { selectedDevice, setActiveTab } = useApp();

  if (!selectedDevice) {
    return (
      <div className="config-panel-view">
        <Empty
          description="请先在设备管理页签中点击设备名称或操作按钮,选择一台设备查看配置"
        >
          <Button type="primary" onClick={() => setActiveTab("device")}>
            前往设备管理
          </Button>
        </Empty>
      </div>
    );
  }

  const status = DEVICE_STATUS[selectedDevice.status];
  const type = DEVICE_TYPES.find((t) => t.value === selectedDevice.type);

  return (
    <div className="config-panel-view">
      <div className="config-panel-view__header">
        <div className="config-panel-view__title">
          <Icon name="settings" size={20} color="var(--primary)" />
          <h2 className="config-panel-view__heading">设备配置详情</h2>
        </div>
        <div className="config-panel-view__actions">
          <Button onClick={() => setActiveTab("alarm")}>查看告警</Button>
          <Button type="primary" onClick={() => setActiveTab("device")}>
            返回设备管理
          </Button>
        </div>
      </div>

      <div className="config-panel-view__content">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="设备名称">{selectedDevice.name}</Descriptions.Item>
          <Descriptions.Item label="设备ID">{selectedDevice.id}</Descriptions.Item>
          <Descriptions.Item label="设备类型">{type ? type.text : selectedDevice.type}</Descriptions.Item>
          <Descriptions.Item label="IP地址">{selectedDevice.ip}</Descriptions.Item>
          <Descriptions.Item label="机房位置">{selectedDevice.room}</Descriptions.Item>
          <Descriptions.Item label="运行状态">
            <StatusTag text={status.text} tone={status.tone} />
          </Descriptions.Item>
          <Descriptions.Item label="CPU使用率">{selectedDevice.cpu}%</Descriptions.Item>
          <Descriptions.Item label="内存使用率">{selectedDevice.mem}%</Descriptions.Item>
          <Descriptions.Item label="告警数量">{selectedDevice.alarmCount}</Descriptions.Item>
          <Descriptions.Item label="最后在线时间">{selectedDevice.lastTime}</Descriptions.Item>
        </Descriptions>

        <div className="config-panel-view__settings">
          <h3 className="config-panel-view__settings-title">设备开关设置</h3>
          <div className="config-panel-view__setting-row">
            <div className="config-panel-view__setting-info">
              <span className="config-panel-view__setting-label">自动巡检</span>
              <span className="config-panel-view__setting-desc">每 30 分钟自动采集设备运行指标</span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="config-panel-view__setting-row">
            <div className="config-panel-view__setting-info">
              <span className="config-panel-view__setting-label">告警推送</span>
              <span className="config-panel-view__setting-desc">设备产生告警时实时推送到告警中心</span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="config-panel-view__setting-row">
            <div className="config-panel-view__setting-info">
              <span className="config-panel-view__setting-label">维护模式</span>
              <span className="config-panel-view__setting-desc">开启后该设备告警将被静默处理</span>
            </div>
            <Switch />
          </div>
        </div>

        <div className="config-panel-view__footer">
          <Button type="primary" icon={<Icon name="save" size={14} />}>
            保存配置
          </Button>
        </div>
      </div>
    </div>
  );
}

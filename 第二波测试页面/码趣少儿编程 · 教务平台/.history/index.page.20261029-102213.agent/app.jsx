// App entry — 开发者设置页（个人偏好与 API 接入安全配置）
// Layer 5 layout：Provider + ConfigProvider + 设置状态装配
//
// 全局状态：单一 settings 对象（受控）+ 已保存快照（savedRef）。
// isDirty = 当前序列化 !== 已保存快照；改动即脏，保存即清。
// 校验：免打扰时段（止晚于起）等错误实时计算，保存时拦截。

import { useState, useMemo, useRef } from "react";
import { ConfigProvider, Divider, message } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import { DEFAULT_SETTINGS, cloneDefaults } from "./src/mock/settings.js";

import SettingsSide from "./src/views/settings-side/index.jsx";
import SettingsHeader from "./src/views/settings-header/index.jsx";
import NotificationSection from "./src/views/notification-section/index.jsx";
import AppearanceSection from "./src/views/appearance-section/index.jsx";
import SecuritySection from "./src/views/security-section/index.jsx";
import ApiPrefSection from "./src/views/api-pref-section/index.jsx";
import SaveBar from "./src/views/save-bar/index.jsx";

import "./app.css";

export default function App() {
  const [settings, setSettings] = useState(() => cloneDefaults());
  const [savedRef, setSavedRef] = useState(() => JSON.stringify(DEFAULT_SETTINGS));
  const scrollRef = useRef(null);

  // 受控更新：合并 patch
  const update = (patch) => setSettings((s) => ({ ...s, ...patch }));

  // 脏检测 + 实时校验
  const isDirty = JSON.stringify(settings) !== savedRef;

  const errors = useMemo(() => {
    const e = {};
    if (settings.dndEnd <= settings.dndStart) {
      e.dnd = "结束时间必须晚于开始时间";
    }
    return e;
  }, [settings.dndStart, settings.dndEnd]);

  // 保存：存在校验错误则拦截；否则刷新已保存快照，返回是否成功
  const handleSave = () => {
    if (Object.keys(errors).length > 0) {
      message.error("存在校验错误，请修正后再保存");
      return false;
    }
    setSavedRef(JSON.stringify(settings));
    return true;
  };

  // 取消：放弃未保存更改，回滚到上次保存的快照
  const handleCancel = () => {
    setSettings(JSON.parse(savedRef));
  };

  // 恢复默认：重置为平台默认值（是否变脏由脏检测自动判定）
  const handleRestoreDefault = () => {
    setSettings(cloneDefaults());
    message.info("已恢复为默认配置，请保存以使其生效");
  };

  return (
    <AppProvider>
      <ConfigProvider locale={zhCN} wave={{ disabled: true }}>
        <div className="app-root">
          <div className="settings-page">
            <SettingsSide scrollRef={scrollRef} />

            <div className="settings-main" ref={scrollRef}>
              <div className="settings-main__inner">
                <SettingsHeader
                  isDirty={isDirty}
                  onRestoreDefault={handleRestoreDefault}
                />

                <div className="settings-panel">
                  <NotificationSection
                    settings={settings}
                    update={update}
                    errors={errors}
                  />
                  <Divider style={{ margin: 0 }} />
                  <AppearanceSection settings={settings} update={update} />
                  <Divider style={{ margin: 0 }} />
                  <SecuritySection settings={settings} update={update} />
                  <Divider style={{ margin: 0 }} />
                  <ApiPrefSection settings={settings} update={update} />
                </div>
              </div>

              <div className="save-bar-wrap">
                <SaveBar
                  isDirty={isDirty}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}

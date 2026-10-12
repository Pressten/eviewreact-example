// App entry — ICT React page
// Layering: context.jsx(全局) → src/mock(数据) → src/components(复用组件) → src/views(视图) → app.jsx(布局骨架)
import { useRef, useState } from "react";
import { IconPlusIcIctServers, IconPlusIcPublicMoon, IconPlusIcPublicSun } from '@nce/icon-plus';
import DivMessage from "@nce/eview-react/DivMessage";
import { AppProvider, useApp } from "./context.jsx";
import SectionCard from "./components/section-card/index.jsx";
import AccessForm from "./views/access-form/index.jsx";
import DeviceTable from "./views/device-table/index.jsx";
import { devices } from "./mock/devices.js";
import "./app.css";

function Page() {
  const { isDark, toggleDark } = useApp();
  const [deviceList, setDevices] = useState(devices);
  const [notice, setNotice] = useState(null);
  const seqRef = useRef(1025);

  const addDevice = (record) => {
    const id = "D-" + seqRef.current;
    seqRef.current += 1;
    setDevices((prev) => [{ ...record, id }, ...prev]);
  };

  const duplicateDevice = (id) => {
    setDevices((prev) => {
      const hit = prev.find((row) => row.id === id);
      if (!hit) return prev;
      const copy = {
        ...hit,
        id: "D-" + seqRef.current,
        name: hit.name + "（副本）",
        code: hit.code + "-C",
        status: "pending",
      };
      seqRef.current += 1;
      return [copy, ...prev];
    });
    setNotice({ type: "success", text: "已复制设备配置", key: Date.now() });
  };

  const removeDevice = (id) => {
    setDevices((prev) => prev.filter((row) => row.id !== id));
    setNotice({ type: "success", text: "已删除 1 条配置", key: Date.now() });
  };

  const removeDevices = (ids) => {
    setDevices((prev) => prev.filter((row) => ids.indexOf(row.id) < 0));
    setNotice({
      type: "success",
      text: "已删除 " + ids.length + " 条配置",
      key: Date.now(),
    });
  };

  const scrollToForm = () => {
    const el = document.getElementById("access-form-anchor");
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setNotice({ type: "default", text: "请在上方表单填写新增配置", key: Date.now() });
  };

  return (
    <div className="page">
      <header className="top-bar">
        <div className="top-bar__brand">
          <IconPlusIcIctServers iconSize="1.25rem" iconColor={['currentcolor']} />
          <span className="top-bar__title">设备接入管理</span>
        </div>
        <div className="top-bar__tools">
          <span className="top-bar__hint">当前为{isDark ? "深色" : "浅色"}主题</span>
          {isDark ? <IconPlusIcPublicSun iconSize="1rem" iconColor={['currentcolor']} title="切换深色 / 浅色主题" onClick={toggleDark} /> : <IconPlusIcPublicMoon iconSize="1rem" iconColor={['currentcolor']} title="切换深色 / 浅色主题" onClick={toggleDark} />}
        </div>
      </header>

      <main className="page__content">
        <div id="access-form-anchor">
          <SectionCard
            title="新增设备接入配置"
            subtitle="填写设备基础信息，并按需开启高级采集与告警通知。"
          >
            <AccessForm onSubmit={addDevice} />
          </SectionCard>
        </div>

        <DeviceTable
          data={deviceList}
          onDelete={removeDevice}
          onDeleteMany={removeDevices}
          onDuplicate={duplicateDevice}
          onAdd={scrollToForm}
        />
      </main>

      {notice ? (
        <div className="app-notice">
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            enableDisposeTimeOut={!notice.persistent}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="app-root">
        <Page />
      </div>
    </AppProvider>
  );
}

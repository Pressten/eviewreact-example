import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 4: 页面头 — 标题 + 副标题 + 恢复默认 + 未保存更改提示条（有改动时出现）
export default function SettingsHeader({ isDirty, onRestoreDefault }) {
  return (
    <header className="settings-head">
      <div className="settings-head__main">
        <div className="settings-head__titles">
          <h1 className="settings-head__title">开发者设置</h1>
          <p className="settings-head__subtitle">
            管理个人偏好与 API 接入安全配置，所有改动保存后生效。
          </p>
        </div>
        <a className="settings-head__restore" onClick={onRestoreDefault} title="将所有配置重置为平台默认值">
          <Icon name="rotate-ccw" size="0.875rem" />
          <span>恢复默认</span>
        </a>
      </div>

      {isDirty && (
        <div className="settings-head__banner" role="status">
          <Icon name="circle-alert" size="1rem" />
          <span>你有未保存的更改，点击底部「保存」以使其生效。</span>
        </div>
      )}
    </header>
  );
}

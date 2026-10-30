import { IconPlusIcPublicAlert, IconPlusIcPublicResetting } from '@hui/icon-plus';
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
          <IconPlusIcPublicResetting iconSize="0.875rem" iconColor={['currentcolor']} />
          <span>恢复默认</span>
        </a>
      </div>

      {isDirty && (
        <div className="settings-head__banner" role="status">
          <IconPlusIcPublicAlert iconSize="1rem" iconColor={['currentcolor']} />
          <span>你有未保存的更改，点击底部「保存」以使其生效。</span>
        </div>
      )}
    </header>
  );
}

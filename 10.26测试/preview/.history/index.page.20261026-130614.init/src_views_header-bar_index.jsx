import { Switch, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// 顶部栏 — 48px,承载标题与全局主题切换
export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  return (
    <header className="header-bar">
      <div className="header-bar-brand">
        <Icon name="component" size="1.25rem" color="var(--primary)" />
        <span className="header-bar-title">组件尺寸规范展示</span>
      </div>
      <div className="header-bar-tools">
        <span className="header-bar-theme-label">{isDark ? "深色" : "浅色"}</span>
        <Tooltip title={isDark ? "切换到浅色模式" : "切换到深色模式"}>
          <Switch
            checked={isDark}
            onChange={toggleDark}
            checkedChildren={<Icon name="moon" size="0.75rem" />}
            unCheckedChildren={<Icon name="sun" size="0.75rem" />}
          />
        </Tooltip>
      </div>
    </header>
  );
}

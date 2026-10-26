import Toggle from "@nce/eview-react/Toggle";
import { IconPlusIcIctContainerComponent, IconPlusIcPublicMoon, IconPlusIcPublicSun } from '@hui/icon-plus';
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";
import "./index.css";

// 顶部栏 — 48px,承载标题与全局主题切换
export default function HeaderBar() {
  const { isDark, toggleDark } = useApp();
  return (
    <header className="header-bar">
      <div className="header-bar-brand">
        <IconPlusIcIctContainerComponent iconSize="1.25rem" iconColor={['var(--primary)']} />
        <span className="header-bar-title">组件尺寸规范展示</span>
      </div>
      <div className="header-bar-tools">
        <span className="header-bar-theme-label">{isDark ? "深色" : "浅色"}</span>
        <TipBox
          type="simple"
          content={isDark ? "切换到浅色模式" : "切换到深色模式"}
          direction="bottom"
        >
          <Toggle
            toggled={isDark}
            onToggle={toggleDark}
            data={[false, true]}
            taggledChildren={<IconPlusIcPublicMoon iconSize="0.75rem" iconColor={['currentcolor']} />}
            unTaggledChildren={<IconPlusIcPublicSun iconSize="0.75rem" iconColor={['currentcolor']} />}
          />
        </TipBox>
      </div>
    </header>
  );
}

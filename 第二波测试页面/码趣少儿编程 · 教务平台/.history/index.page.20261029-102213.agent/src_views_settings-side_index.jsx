import { Anchor } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 4: 左侧锚点目录 — 与右侧分组滚动联动高亮、点击定位。
// getContainer 指向右侧滚动容器，保证 scroll-spy 命中正确区域。
export default function SettingsSide({ scrollRef }) {
  const items = [
    { key: "notification", href: "#sec-notification", title: "通知偏好" },
    { key: "appearance", href: "#sec-appearance", title: "外观" },
    { key: "security", href: "#sec-security", title: "安全与接入" },
    { key: "api-pref", href: "#sec-api-pref", title: "API 偏好" },
  ];

  return (
    <aside className="settings-side">
      <div className="settings-side__brand">
        <Icon name="sliders-horizontal" size="1.25rem" />
        <span>开发者设置</span>
      </div>
      <nav className="settings-side__nav">
        <div className="settings-side__nav-title">页面导航</div>
        <Anchor
          affix={false}
          getContainer={() => scrollRef?.current || window}
          items={items}
        />
      </nav>
      <div className="settings-side__hint">
        <Icon name="info" size="0.875rem" />
        <span>改动需点击底部「保存」后生效。</span>
      </div>
    </aside>
  );
}

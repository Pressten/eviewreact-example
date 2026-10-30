import { useState } from "react";
import { IconPlusIcPublicInfo, IconPlusIcPublicSetting } from '@hui/icon-plus';
import "./index.css";

// Layer 4: 左侧锚点目录 — 与右侧分组滚动联动高亮、点击定位。
// 手写锚点导航（替代 antd Anchor）：点击 scrollIntoView 定位右侧分组。
export default function SettingsSide({ scrollRef }) {
  const items = [
    { key: "notification", href: "sec-notification", title: "通知偏好" },
    { key: "appearance", href: "sec-appearance", title: "外观" },
    { key: "security", href: "sec-security", title: "安全与接入" },
    { key: "api-pref", href: "sec-api-pref", title: "API 偏好" },
  ];
  const [active, setActive] = useState("notification");

  const handleJump = (item) => {
    setActive(item.key);
    const root = scrollRef?.current || window.document;
    const el = (root.querySelector ? root : window.document).getElementById(item.href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="settings-side">
      <div className="settings-side__brand">
        <IconPlusIcPublicSetting iconSize="1.25rem" iconColor={['currentcolor']} />
        <span>开发者设置</span>
      </div>
      <nav className="settings-side__nav">
        <div className="settings-side__nav-title">页面导航</div>
        <ul className="settings-side__anchor">
          {items.map((it) => (
            <li key={it.key}>
              <a
                href={"#" + it.href}
                className={"settings-side__anchor-link" + (active === it.key ? " is-active" : "")}
                onClick={(e) => { e.preventDefault(); handleJump(it); }}
              >
                {it.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="settings-side__hint">
        <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} />
        <span>改动需点击底部「保存」后生效。</span>
      </div>
    </aside>
  );
}

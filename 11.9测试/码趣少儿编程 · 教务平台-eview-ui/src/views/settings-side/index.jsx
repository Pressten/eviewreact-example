// TODO(eview-ui): Anchor 无对应，手写锚点目录（CSS scroll-spy + IntersectionObserver）
import { useEffect, useState } from "react";
import Icon from "@/shared/Icon";
import "./index.css";

const NAV_ITEMS = [
  { key: "notification", href: "sec-notification", title: "通知偏好" },
  { key: "appearance", href: "sec-appearance", title: "外观" },
  { key: "security", href: "sec-security", title: "安全与接入" },
  { key: "api-pref", href: "sec-api-pref", title: "API 偏好" },
];

export default function SettingsSide({ scrollRef }) {
  const [activeKey, setActiveKey] = useState("notification");

  useEffect(() => {
    const container = scrollRef?.current || window;
    const root = scrollRef?.current || document;
    const sections = NAV_ITEMS
      .map((it) => root.getElementById ? root.getElementById(it.href) : null)
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) {
          const id = visible.target.id;
          const found = NAV_ITEMS.find((it) => it.href === id);
          if (found) setActiveKey(found.key);
        }
      },
      { root: scrollRef?.current || null, threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [scrollRef]);

  const handleClick = (e, item) => {
    e.preventDefault();
    const root = scrollRef?.current || document;
    const el = root.getElementById ? root.getElementById(item.href) : document.getElementById(item.href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveKey(item.key);
    }
  };

  return (
    <aside className="settings-side">
      <div className="settings-side__brand">
        <Icon name="sliders-horizontal" size="1.25rem" />
        <span>开发者设置</span>
      </div>
      <nav className="settings-side__nav">
        <div className="settings-side__nav-title">页面导航</div>
        <ul className="settings-side__anchor">
          {NAV_ITEMS.map((it) => (
            <li key={it.key}>
              <a
                href={"#" + it.href}
                className={"settings-side__anchor-link" + (activeKey === it.key ? " is-active" : "")}
                onClick={(e) => handleClick(e, it)}
              >
                {it.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="settings-side__hint">
        <Icon name="info" size="0.875rem" />
        <span>改动需点击底部「保存」后生效。</span>
      </div>
    </aside>
  );
}

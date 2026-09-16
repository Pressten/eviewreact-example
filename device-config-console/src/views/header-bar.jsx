import { useState } from "react";
import Button from "@nce/eview-react/Button";
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../icons.jsx";
import { useApp } from "../context.jsx";
import { topNav } from "../data.js";
import { LANG_OPTIONS } from "../i18n.js";
import Dropdown from "../components/Dropdown.jsx";
import "./header-bar.css";

// Layer 4: 顶部导航栏 — 品牌标识 / 一级导航 / 语言切换 / 主题切换 / 全局工具 / 用户区
export default function HeaderBar() {
  const intl = useIntl();
  const { isDark, toggleDark, lang, setLang, collapsed, toggleCollapsed } = useApp();
  const [activeNav, setActiveNav] = useState("console");

  const collapseLabel = intl.formatMessage({
    id: collapsed ? "header.expand" : "header.collapse",
    defaultMessage: collapsed ? "展开导航" : "收起导航",
  });
  const themeLabel = intl.formatMessage({
    id: isDark ? "header.theme.toLight" : "header.theme.toDark",
    defaultMessage: isDark ? "切换浅色模式" : "切换深色模式",
  });
  const langLabel = intl.formatMessage({ id: "header.language", defaultMessage: "语言" });
  const notifyLabel = intl.formatMessage({ id: "header.notifications", defaultMessage: "通知" });

  const langMenu = {
    selectedKeys: [lang],
    items: LANG_OPTIONS.map((opt) => ({ key: opt.key, label: opt.label })),
    onClick: ({ key }) => setLang(key),
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <Icon name="user" size={14} />,
        label: <FormattedMessage id="header.profile" defaultMessage="个人资料" />,
      },
      {
        key: "help",
        icon: <Icon name="circle-question-mark" size={14} />,
        label: <FormattedMessage id="header.help" defaultMessage="帮助中心" />,
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <Icon name="log-out" size={14} />,
        label: <FormattedMessage id="header.logout" defaultMessage="退出登录" />,
      },
    ],
    onClick: () => {},
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <TipBox content={collapseLabel} direction="bottom">
          <Button
            status="text"
            aria-label={collapseLabel}
            onClick={toggleCollapsed}
            leftIcon={<Icon name="menu" size={16} />}
          />
        </TipBox>
        <div className="brand">
          <span className="brand-mark">
            <Icon name="activity" size={16} />
          </span>
          <span className="brand-name">
            <FormattedMessage id="app.name" defaultMessage="ICT 设备运维平台" />
          </span>
        </div>
      </div>

      <nav className="app-topnav">
        {topNav.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`app-topnav-item ${activeNav === item.key ? "is-active" : ""}`}
            onClick={() => setActiveNav(item.key)}
          >
            <FormattedMessage id={item.msgId} defaultMessage={item.fallback} />
          </button>
        ))}
      </nav>

      <div className="header-right">
        <Dropdown menu={langMenu} trigger="click" placement="bottomRight">
          <Button status="text" className="header-btn" aria-label={langLabel}>
            <span className="header-btn-inner">
              <Icon name="languages" size={16} />
              <span className="header-btn-text">{lang === "zh" ? "简体中文" : "English"}</span>
              <Icon name="chevron-down" size={12} />
            </span>
          </Button>
        </Dropdown>

        <TipBox content={themeLabel} direction="bottom">
          <Button
            status="text"
            aria-label={themeLabel}
            onClick={toggleDark}
            leftIcon={<Icon name={isDark ? "sun" : "moon"} size={16} />}
          />
        </TipBox>

        <TipBox content={notifyLabel} direction="bottom">
          {/* TODO(eview-react): Badge 的 size/offset 等 prop 以官方 Reference 为准,这里用 content 替代 antd count */}
          <Badge content={5}>
            <Button
              status="text"
              aria-label={notifyLabel}
              leftIcon={<Icon name="bell" size={16} />}
            />
          </Badge>
        </TipBox>

        <span className="header-divider" />

        <Dropdown menu={userMenu} trigger="click" placement="bottomRight">
          <Button status="text" className="header-user">
            {/* TODO(eview-react): Avatar 无导出,当前手写圆形占位 */}
            <span className="app-avatar">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt=""
              />
            </span>
            <span className="header-user-meta">
              <span className="header-user-name">
                <FormattedMessage id="header.user.name" defaultMessage="张运维" />
              </span>
              <span className="header-user-role">
                <FormattedMessage id="header.user.role" defaultMessage="平台管理员" />
              </span>
            </span>
            <Icon name="chevron-down" size={12} />
          </Button>
        </Dropdown>
      </div>
    </header>
  );
}

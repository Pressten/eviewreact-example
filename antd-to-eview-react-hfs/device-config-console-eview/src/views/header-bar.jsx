import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "@nce/eview-react/Button";
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import { Icon } from "../../assets/shared/icons.js";
import { useApp } from "../context.jsx";
import { topNav } from "../data.js";
import "./header-bar.css";

// Layer 4: 顶部导航栏 — 品牌标识 / 一级导航 / 语言切换 / 主题切换 / 全局工具 / 用户区
// 说明:eview-react 本批次无 Menu / Dropdown / IconButton,一级导航用原生 <nav>+<button>,
// 图标按钮用原生 <button> 承载(已标注 TODO 待 IconButton 覆盖),下拉菜单用 TipBox(click) 替代。
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

  return (
    <header className="app-header">
      <div className="header-left">
        <TipBox type="simple" content={collapseLabel} direction="bottom">
          <button
            type="button"
            className="header-icon-btn"
            aria-label={collapseLabel}
            onClick={toggleCollapsed}
          >
            <Icon name="menu" size={16} />
          </button>
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
            className={"topnav-item" + (activeNav === item.key ? " active" : "")}
            onClick={() => setActiveNav(item.key)}
          >
            <FormattedMessage id={item.msgId} defaultMessage={item.fallback} />
          </button>
        ))}
      </nav>

      <div className="header-right">
        <Button
          status="text"
          className="header-btn"
          aria-label={langLabel}
          text={lang === "zh" ? "English" : "简体中文"}
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        />

        <TipBox type="simple" content={themeLabel} direction="bottom">
          <button
            type="button"
            className="header-icon-btn"
            aria-label={themeLabel}
            onClick={toggleDark}
          >
            <Icon name={isDark ? "sun" : "moon"} size={16} />
          </button>
        </TipBox>

        <TipBox type="simple" content={notifyLabel} direction="bottom">
          <Badge content={5}>
            <button
              type="button"
              className="header-icon-btn"
              aria-label={notifyLabel}
            >
              <Icon name="bell" size={16} />
            </button>
          </Badge>
        </TipBox>

        <span className="header-divider" />

        <TipBox
          trigger="click"
          direction="bottomRight"
          isMouseLeaveClose={false}
          content={
            <div className="header-menu-pop">
              <button type="button" className="header-menu-item">
                <Icon name="user" size={14} />
                <FormattedMessage id="header.profile" defaultMessage="个人资料" />
              </button>
              <button type="button" className="header-menu-item">
                <Icon name="circle-question-mark" size={14} />
                <FormattedMessage id="header.help" defaultMessage="帮助中心" />
              </button>
              <div className="header-menu-divider" />
              <button type="button" className="header-menu-item header-menu-danger">
                <Icon name="log-out" size={14} />
                <FormattedMessage id="header.logout" defaultMessage="退出登录" />
              </button>
            </div>
          }
        >
          <button type="button" className="header-user">
            <span className="header-avatar">
              <img src="/assets/uploads/user.png" alt="" width={24} height={24} />
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
          </button>
        </TipBox>
      </div>
    </header>
  );
}

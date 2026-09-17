// Layer 4: 顶部导航栏 — 品牌标识 / 一级导航 / 语言切换 / 主题切换 / 全局工具 / 用户区
// Layout/Menu/Avatar 无对应手写;Dropdown 语言菜单退化为直切按钮、用户菜单用 TipBox click 弹层
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "@nce/eview-react/Button";
import Badge from "@nce/eview-react/Badge";
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../context.jsx";
import { topNav } from "../data.js";
import "./header-bar.css";

export default function HeaderBar() {
  const intl = useIntl();
  const { isDark, toggleDark, lang, setLang, collapsed, toggleCollapsed } = useApp();
  const [activeNav, setActiveNav] = useState("console");

  const t = (id, fallback) => intl.formatMessage({ id: id, defaultMessage: fallback });

  const collapseLabel = t(collapsed ? "header.expand" : "header.collapse", collapsed ? "展开导航" : "收起导航");
  const themeLabel = t(isDark ? "header.theme.toLight" : "header.theme.toDark", isDark ? "切换浅色模式" : "切换深色模式");
  const langLabel = t("header.language", "语言");
  const notifyLabel = t("header.notifications", "通知");

  return (
    <header className="app-header">
      <div className="header-left">
        <Button status="text" text={collapseLabel} aria-label={collapseLabel} onClick={toggleCollapsed} />
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">
            <FormattedMessage id="app.name" defaultMessage="ICT 设备运维平台" />
          </span>
        </div>
      </div>

      {/* TODO(eview-react): Menu 无对应,手写一级横向导航 */}
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
        {/* TODO(eview-react): Dropdown 语言菜单退化为中英直切 */}
        <Button
          status="text"
          className="header-btn"
          aria-label={langLabel}
          text={lang === "zh" ? "English" : "简体中文"}
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        />

        <Button status="text" className="header-btn" aria-label={themeLabel} text={themeLabel} onClick={toggleDark} />

        <Badge content={5}>
          <Button status="text" className="header-btn" aria-label={notifyLabel} text={notifyLabel} />
        </Badge>

        <span className="header-divider" />

        {/* TODO(eview-react): Avatar 无对应手写;Dropdown 用户菜单用 TipBox click 弹层 */}
        <TipBox
          trigger="click"
          direction="bottomRight"
          isMouseLeaveClose={false}
          content={
            <div className="header-menu-pop">
              <button type="button" className="header-menu-item">
                <FormattedMessage id="header.profile" defaultMessage="个人资料" />
              </button>
              <button type="button" className="header-menu-item">
                <FormattedMessage id="header.help" defaultMessage="帮助中心" />
              </button>
              <div className="header-menu-divider" />
              <button type="button" className="header-menu-item">
                <FormattedMessage id="header.logout" defaultMessage="退出登录" />
              </button>
            </div>
          }
        >
          <button type="button" className="header-user">
            <span className="header-avatar">
              <FormattedMessage id="header.user.name" defaultMessage="张运维" />
            </span>
            <span className="header-user-meta">
              <span className="header-user-name">
                <FormattedMessage id="header.user.name" defaultMessage="张运维" />
              </span>
              <span className="header-user-role">
                <FormattedMessage id="header.user.role" defaultMessage="平台管理员" />
              </span>
            </span>
          </button>
        </TipBox>
      </div>
    </header>
  );
}

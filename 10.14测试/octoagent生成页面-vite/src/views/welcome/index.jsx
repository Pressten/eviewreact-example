import Button from "@nce/eview-react/Button";
import { IconPlusIcIctDashboard, IconPlusIcPublicDownload, IconPlusIcPublicMinus, IconPlusIcPublicMoon, IconPlusIcPublicPlus, IconPlusIcPublicSortDown, IconPlusIcPublicSortUp, IconPlusIcPublicSun } from '@nce/icon-plus';
import { useApp } from "../../context.jsx";
import { stats, activities } from "../../mock/welcome.jsx";
import "./index.css";

export default function Welcome() {
  const { isDark, toggleDark } = useApp();

  return (
    <div className="welcome-root">
      {/* 顶部导航条 */}
      <header className="welcome-header">
        <div className="welcome-brand">
          <div className="welcome-brand-mark">
            <IconPlusIcIctDashboard iconSize="1.5rem" iconColor={['var(--on-primary-fixed)']} />
          </div>
          <span className="welcome-brand-name">智维控制台</span>
        </div>
        <div className="welcome-header-tools">
          <button
            className="welcome-icon-btn"
            onClick={toggleDark}
            title={isDark ? "切换到浅色" : "切换到深色"}
            aria-label="切换主题"
          >
            {isDark ? <IconPlusIcPublicSun iconSize="1.25rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMoon iconSize="1.25rem" iconColor={['currentcolor']} />}
          </button>
          <div className="welcome-user">
            <img src="/assets/uploads/user.png" alt="头像" className="welcome-avatar" />
            <span className="welcome-user-name">运维管理员</span>
          </div>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="welcome-body">
        {/* Hero */}
        <section className="welcome-hero">
          <div className="welcome-hero-text">
            <p className="welcome-hero-eyebrow">2026 年 10 月 14 日 · 星期三</p>
            <h1 className="welcome-hero-title">下午好，欢迎回来 👋</h1>
            <p className="welcome-hero-subtitle">
              今天有 3 条待处理告警与 5 项待办工单，整体系统运行平稳。
            </p>
            <div className="welcome-hero-actions">
              <Button status="primary" text="新建工单" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} />
              <Button text="导出日报" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} />
            </div>
          </div>
        </section>

        {/* 指标卡片 */}
        <section className="welcome-stats">
          {stats.map((s) => (
            <article key={s.key} className="welcome-stat-card">
              <div className="welcome-stat-icon" style={{ background: s.tint, color: s.color }}>
                {s.icon}
              </div>
              <div className="welcome-stat-meta">
                <span className="welcome-stat-value">{s.value}</span>
                <span className="welcome-stat-label">{s.label}</span>
              </div>
              <span
                className={
                  "welcome-stat-trend " +
                  (s.trend.startsWith("+") ? "is-up" : s.trend.startsWith("-") ? "is-down" : "is-flat")
                }
              >
                {s.trend.startsWith("+") ? <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} /> : s.trend.startsWith("-") ? <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicMinus iconSize="0.875rem" iconColor={['currentcolor']} />}
                {s.trend}
              </span>
            </article>
          ))}
        </section>

        {/* 近期动态 */}
        <section className="welcome-activity">
          <div className="welcome-section-head">
            <h2 className="welcome-section-title">近期动态</h2>
            <a className="welcome-link">查看全部</a>
          </div>
          <ul className="welcome-activity-list">
            {activities.map((a, i) => (
              <li key={i} className="welcome-activity-item">
                <span className={"welcome-activity-dot " + a.level} />
                <div className="welcome-activity-main">
                  <p className="welcome-activity-text">{a.text}</p>
                  <span className="welcome-activity-time">{a.time}</span>
                </div>
                {a.tag && <span className={"welcome-activity-tag " + a.level}>{a.tag}</span>}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

import { Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { stats, activities } from "../../mock/welcome.js";
import "./index.css";

export default function Welcome() {
  const { isDark, toggleDark } = useApp();

  return (
    <div className="welcome-root">
      {/* 顶部导航条 */}
      <header className="welcome-header">
        <div className="welcome-brand">
          <div className="welcome-brand-mark">
            <Icon name="hexagon" size="1.5rem" color="var(--on-primary-fixed)" />
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
            <Icon name={isDark ? "sun" : "moon"} size="1.25rem" />
          </button>
          <div className="welcome-user">
            <img src="./assets/uploads/user.png" alt="头像" className="welcome-avatar" />
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
              <Button type="primary" icon={<Icon name="plus" size="0.875rem" />}>
                新建工单
              </Button>
              <Button icon={<Icon name="download" size="0.875rem" />}>导出日报</Button>
            </div>
          </div>
        </section>

        {/* 指标卡片 */}
        <section className="welcome-stats">
          {stats.map((s) => (
            <article key={s.key} className="welcome-stat-card">
              <div className="welcome-stat-icon" style={{ background: s.tint }}>
                <Icon name={s.icon} size="1.25rem" color={s.color} />
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
                <Icon
                  name={s.trend.startsWith("+") ? "trending-up" : s.trend.startsWith("-") ? "trending-down" : "minus"}
                  size="0.875rem"
                />
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

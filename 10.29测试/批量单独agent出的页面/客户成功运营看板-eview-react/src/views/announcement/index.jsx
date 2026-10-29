import { useState, useEffect } from "react";
import { IconPlusIcPublicHorn, IconPlusIcPublicLeftArrow, IconPlusIcPublicRightArrow } from '@hui/icon-plus';
import { announcements } from "../../mock/dashboard.jsx";
import "./index.css";

// ⑧ 底部公告轮播 — 3 条产品公告,带指示点 + 左右切换箭头 + 自动播放
// antd Carousel→手写轮播（eview 无对应组件；用 state + setInterval 实现单屏切换 + 指示点 + 前后箭头）
export default function Announcement() {
  const [current, setCurrent] = useState(0);

  const goTo = (i) => {
    const n = announcements.length;
    if (!n) return;
    setCurrent((((i % n) + n) % n));
  };
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <section className="announcement">
      <div className="announcement-left">
        <IconPlusIcPublicHorn iconSize="1.25rem" iconColor={['var(--primary)']} />
        <span className="announcement-label">产品公告</span>
      </div>
      <div className="announcement-middle">
        {announcements.map((a, i) => (
          <div
            key={i}
            className={`announcement-slide ${i === current ? "is-active" : ""}`}
          >
            <span className={`announcement-tag announcement-tag-${a.type}`}>{a.typeLabel}</span>
            <span className="announcement-text">{a.text}</span>
            <span className="announcement-date">{a.date}</span>
          </div>
        ))}
      </div>
      <div className="announcement-dots">
        {announcements.map((a, i) => (
          <span
            key={i}
            className={`announcement-dot ${i === current ? "is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
      <div className="announcement-right">
        <button className="nav-arrow" type="button" onClick={prev} aria-label="上一条">
          <IconPlusIcPublicLeftArrow iconSize="0.875rem" iconColor={['currentcolor']} />
        </button>
        <button className="nav-arrow" type="button" onClick={next} aria-label="下一条">
          <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />
        </button>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from "react";
import { IconPlusIcPublicHorn, IconPlusIcPublicLeftArrow, IconPlusIcPublicRightArrow } from '@hui/icon-plus';
import { announcements } from "../../mock/dashboard.jsx";
import "./index.css";

// ⑧ 底部公告轮播 — 3 条产品公告,带指示点 + 左右切换箭头
// TODO(eview-react): Carousel 无对应组件,当前手写最小可用版
export default function Announcement() {
  const carouselRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const count = announcements.length;

  const goTo = (i) => setCurrent(((i % count) + count) % count);
  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  carouselRef.current = { goTo, prev, next };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, 6000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <section className="announcement">
      <div className="announcement-left">
        <IconPlusIcPublicHorn iconSize="1.25rem" iconColor={['var(--primary)']} />
        <span className="announcement-label">产品公告</span>
      </div>
      <div className="announcement-middle">
        <div className="announcement-carousel">
          <div
            className="announcement-track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {announcements.map((a, i) => (
              <div key={i} className="announcement-slide">
                <span className={`announcement-tag announcement-tag-${a.type}`}>{a.typeLabel}</span>
                <span className="announcement-text">{a.text}</span>
                <span className="announcement-date">{a.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="announcement-dots">
        {announcements.map((a, i) => (
          <span
            key={i}
            className={`announcement-dot ${i === current ? "is-active" : ""}`}
            onClick={() => carouselRef.current?.goTo(i)}
          />
        ))}
      </div>
      <div className="announcement-right">
        <button
          className="nav-arrow"
          type="button"
          onClick={() => carouselRef.current?.prev()}
          aria-label="上一条"
        >
          <IconPlusIcPublicLeftArrow iconSize="0.875rem" iconColor={['currentcolor']} />
        </button>
        <button
          className="nav-arrow"
          type="button"
          onClick={() => carouselRef.current?.next()}
          aria-label="下一条"
        >
          <IconPlusIcPublicRightArrow iconSize="0.875rem" iconColor={['currentcolor']} />
        </button>
      </div>
    </section>
  );
}

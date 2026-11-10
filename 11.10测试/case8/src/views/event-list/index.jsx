import { useEffect, useState } from "react";
import { Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import LevelTag from "../../components/level-tag/index.jsx";
import { EVENTS } from "../../mock/ops.js";
import { fmt } from "../../mock/flight.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// 区块⑦ 不正常事件列表 —— 机械故障/旅客疾病/鸟击/备降/超售/行李延误
// 等级三色 Tag(紧急/重要/一般) · 处置状态(处置中/已闭环) · 点击展开处置记录
export default function EventList() {
  const { airport, dataset, setSelectedFlightId, requestLocate } = useApp();
  const events = EVENTS[airport];
  const [openIds, setOpenIds] = useState(() => new Set());

  // 切换机场时默认展开首条(通常为紧急事件)
  useEffect(() => {
    setOpenIds(new Set([EVENTS[airport][0].id]));
  }, [airport]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handling = events.filter((e) => e.status === "handling").length;

  return (
    <section className="event-list">
      <div className="ev-title">
        <Icon name="siren" size="1rem" />
        不正常事件
        <span className="ev-meta">
          处置中 <b className="mono v-warn">{handling}</b> · 已闭环 <b className="mono v-ok">{events.length - handling}</b>
        </span>
      </div>

      <div className="ev-list">
        {events.map((ev) => {
          const open = openIds.has(ev.id);
          const flight = dataset.find((r) => r.id === ev.flightId);
          return (
            <div className={`ev-item ${open ? "open" : ""} ${ev.level}`} key={ev.id}>
              <div className="ev-head" onClick={() => toggle(ev.id)} title="点击展开/收起处置记录">
                <LevelTag level={ev.level} />
                <span className="ev-type">
                  <Icon name={ev.icon} size="0.875rem" />
                  {ev.type}
                </span>
                <a
                  className="ev-flight mono"
                  title="点击定位主表航班行"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (flight) {
                      setSelectedFlightId(flight.id);
                      requestLocate(flight.id);
                    }
                  }}
                >
                  {flight ? `${flight.flightNo} ${flight.from}→${flight.to}` : "—"}
                </a>
                <span className="ev-summary" title={ev.summary}>{ev.summary}</span>
                <span className="ev-time mono">{fmt(ev.time)}</span>
                <Tag color={ev.status === "handling" ? "processing" : "success"}>
                  {ev.status === "handling" ? "处置中" : "已闭环"}
                </Tag>
                <Icon name={open ? "chevron-up" : "chevron-down"} size="0.875rem" />
              </div>

              {open ? (
                <div className="ev-records" onClick={(e) => e.stopPropagation()}>
                  <span className="ev-records-label">处置记录</span>
                  {ev.records.map((r, i) => (
                    <div className="ev-record" key={i}>
                      <span className="ev-rec-time mono">{fmt(r.time)}</span>
                      <span className="ev-rec-text">{r.text}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

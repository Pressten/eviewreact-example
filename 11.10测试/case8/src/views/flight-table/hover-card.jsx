import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { CITY_NAMES } from "../../mock/flight.js";
import { CAPTAINS, DISPATCHERS, FIRST_OFFICERS } from "../../mock/crew.js";

// 行悬浮简要信息卡 —— 机组 / 值班签派 / 载量 / 登机口 / 中转 / 处置提示
// 机组与签派员按航班号+注册号散列稳定匹配(同一航班每次悬浮结果一致)
const hashCode = (s) => s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

export default function HoverCard({ flight, x, y }) {
  const seed = hashCode(flight.flightNo + flight.tailNo);
  const captain = CAPTAINS[seed % CAPTAINS.length];
  const firstOfficer = FIRST_OFFICERS[seed % FIRST_OFFICERS.length];
  const dispatcher = DISPATCHERS[seed % DISPATCHERS.length];
  const cargo = (flight.paxCount * 0.031).toFixed(1);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const left = Math.min(x + 16, vw - 324);
  const top = y + 24 + 250 > vh ? Math.max(y - 254, 8) : y + 24;

  return (
    <div className="hover-card" style={{ left, top }}>
      <div className="hc-head">
        <span className="hc-no mono">{flight.flightNo}</span>
        <span className="hc-tail mono">{flight.tailNo} · {flight.acType}</span>
        <StatusTag status={flight.status} />
      </div>
      <div className="hc-route">
        {CITY_NAMES[flight.from] || flight.from}
        <Icon name="arrow-right" size="0.75rem" />
        {CITY_NAMES[flight.to] || flight.to}
      </div>
      <div className="hc-grid">
        <span className="hc-item"><span className="hc-k">机长</span><span className="hc-v">{captain}</span></span>
        <span className="hc-item"><span className="hc-k">副驾驶</span><span className="hc-v">{firstOfficer}</span></span>
        <span className="hc-item"><span className="hc-k">值班签派</span><span className="hc-v">{dispatcher}</span></span>
        <span className="hc-item"><span className="hc-k">登机口</span><span className="hc-v mono">{flight.gate}</span></span>
        <span className="hc-item"><span className="hc-k">计划载量</span><span className="hc-v mono">{flight.paxCount} 人 · 货邮 {cargo}t</span></span>
        {flight.transferPax > 0 ? (
          <span className="hc-item"><span className="hc-k">中转旅客</span><span className="hc-v mono">{flight.transferPax} 人</span></span>
        ) : null}
      </div>
      {flight.delayReason ? (
        <div className="hc-reason">
          <Icon name="triangle-alert" size="0.75rem" />
          <span>处置提示：{flight.delayReason}</span>
        </div>
      ) : null}
    </div>
  );
}

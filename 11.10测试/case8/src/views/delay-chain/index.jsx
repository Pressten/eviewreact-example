import { useMemo } from "react";
import { Empty, Timeline, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { CITY_NAMES, buildChain, fmt, plusDays } from "../../mock/flight.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// 节点严重度: 累计延误 >60 红 / >30 橙 / 其余黄; 预计推算节点用空心圆点
function dotClass(node) {
  if (node.cumulative > 60) return "chain-dot d-high";
  if (node.cumulative > 30) return "chain-dot d-mid";
  return "chain-dot d-low";
}

// 区块③ 延误波及链 —— 选中延误航班后展示该机当日后续 3 段接力链条
export default function DelayChain() {
  const { dataset, selectedFlightId, requestLocate } = useApp();
  const chain = useMemo(() => buildChain(dataset, selectedFlightId), [dataset, selectedFlightId]);

  const head = chain ? chain.head : null;
  const nodes = chain ? chain.nodes : [];
  const peakDelay = nodes.length ? Math.max(...nodes.map((n) => n.cumulative)) : 0;
  const transferTotal = nodes.reduce((sum, n) => sum + (n.leg.transferPax || 0), 0);

  const items = useMemo(
    () =>
      nodes.map((node) => ({
        key: node.leg.id,
        dot: <span className={`${dotClass(node)}${node.projected ? " d-proj" : ""}`} />,
        children: (
          <div
            className="chain-node"
            onClick={() => requestLocate(node.leg.id)}
            title="点击定位主表航班行"
          >
            <div className="cn-top">
              <span className="cn-time mono">
                {fmt(node.leg.schedDep)}
                {plusDays(node.leg.schedDep) > 0 ? <sup>+1</sup> : null}
              </span>
              <span className="cn-no mono">{node.leg.flightNo}</span>
              <span className="cn-route mono">
                {node.leg.from}
                <Icon name="arrow-right" size="0.75rem" />
                {node.leg.to}
              </span>
              {node.projected ? (
                <span className="cn-projected">预计</span>
              ) : (
                <StatusTag status={node.leg.status} showIcon={false} />
              )}
            </div>
            <div className="cn-stats mono">
              <span className="cn-stat">传导 <b className="cn-prop">+{node.propagated}</b> 分</span>
              <span className="cn-stat">累计 <b className={`cn-cum${node.cumulative > 60 ? " c-high" : node.cumulative > 30 ? " c-mid" : " c-low"}`}>{node.cumulative}</b> 分</span>
              <span className="cn-stat">中转 <b>{node.leg.transferPax}</b> 人</span>
            </div>
          </div>
        ),
      })),
    [nodes, requestLocate]
  );

  return (
    <section className="delay-chain">
      <div className="dc-header">
        <span className="dc-title">
          <Icon name="git-branch" size="1rem" />
          延误波及链
        </span>
        {head ? (
          <Tooltip title="点击定位主表航班行">
            <span className="dc-head-link" onClick={() => requestLocate(head.id)}>
              同机接力 · {head.tailNo}
            </span>
          </Tooltip>
        ) : null}
      </div>

      {!head ? (
        <div className="dc-empty">
          <Empty description="在主表点击延误航班，查看该机当日波及链" />
        </div>
      ) : (
        <>
          <div className="chain-head-flight" onClick={() => requestLocate(head.id)} title="点击定位主表航班行">
            <div className="chf-top">
              <span className="chf-no mono">{head.flightNo}</span>
              <StatusTag status={head.status} />
              <span className="chf-delay mono">
                {head.status === "delayed" ? `延误 ${head.delayMinutes} 分` : "当前正点"}
              </span>
            </div>
            <div className="chf-route">
              {CITY_NAMES[head.from] || head.from}
              <Icon name="arrow-right" size="0.75rem" />
              {CITY_NAMES[head.to] || head.to}
            </div>
            <div className="chf-meta mono">
              {fmt(head.schedDep)} – {fmt(head.schedArr)}
              {plusDays(head.schedArr) > 0 ? <sup>+1</sup> : null}
              <span className="chf-dot">·</span>
              登机口 {head.gate}
              <span className="chf-dot">·</span>
              旅客 {head.paxCount}
            </div>
            {head.delayReason ? <div className="chf-reason">{head.delayReason}</div> : null}
          </div>

          {nodes.length === 0 ? (
            <div className="dc-empty">
              <Empty description="该航班为当日末段接力，无后续波及航班" />
            </div>
          ) : (
            <>
              <Timeline items={items} className="chain-timeline" />
              <div className="dc-summary">
                <span className="dc-sum-item">波及 <b className="mono">{nodes.length}</b> 段</span>
                <span className="dc-sum-item">峰值延误 <b className="mono dc-peak">{peakDelay}</b> 分</span>
                <span className="dc-sum-item">中转旅客合计 <b className="mono">{transferTotal}</b> 人</span>
              </div>
            </>
          )}
          <div className="dc-hint">
            <Icon name="mouse-pointer-click" size="0.75rem" />
            点击链条节点可反向定位主表航班行
          </div>
        </>
      )}
    </section>
  );
}

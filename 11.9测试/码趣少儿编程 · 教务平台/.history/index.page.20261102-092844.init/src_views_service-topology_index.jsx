import { Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { TOPOLOGY } from "../../mock/monitor.js";
import "./index.css";

const VB_W = 1240;
const VB_H = 540;
// 节点半高（用于计算边的起止 y，使连线从节点底部接到下一节点顶部）
const HALF_H = { gateway: 36, service: 42, db: 34, cache: 34 };
const STATUS_LABEL = { normal: "正常", warning: "告警", critical: "异常" };
const STATUS_TAG_COLOR = { normal: "success", warning: "warning", critical: "error" };
const TYPE_ICON = { gateway: "network", service: "box", db: "database", cache: "zap" };
const TYPE_LABEL = { gateway: "入口网关", service: "核心服务", db: "数据库", cache: "缓存" };

// 区块④ 服务拓扑（主视觉）：1 网关 + 4 核心服务 + 8 数据节点 = 13 节点；12 条调用链路
// 异常链路高亮并标注延迟毫秒数；节点点击联动图表切换。
export default function ServiceTopology({ selectedServiceId, onSelectService }) {
  const nodeById = {};
  TOPOLOGY.nodes.forEach((n) => { nodeById[n.id] = n; });

  const edgePath = (e) => {
    const s = nodeById[e.from];
    const t = nodeById[e.to];
    const sy = s.y + HALF_H[s.type];
    const ty = t.y - HALF_H[t.type];
    const mid = (sy + ty) / 2;
    return `M ${s.x},${sy} C ${s.x},${mid} ${t.x},${mid} ${t.x},${ty}`;
  };
  const edgeMid = (e) => {
    const s = nodeById[e.from];
    const t = nodeById[e.to];
    const sy = s.y + HALF_H[s.type];
    const ty = t.y - HALF_H[t.type];
    return { x: (s.x + t.x) / 2, y: (sy + ty) / 2 };
  };

  // 节点与当前选中服务的关系（用于联动高亮）
  const nodeServiceId = (n) => n.serviceId || (n.parent ? nodeById[n.parent]?.serviceId : null);
  const isNodeRelated = (n) => !!selectedServiceId && nodeServiceId(n) === selectedServiceId;
  const isEdgeRelated = (e) => {
    if (!selectedServiceId) return false;
    const s = nodeById[e.from];
    const t = nodeById[e.to];
    return nodeServiceId(s) === selectedServiceId || nodeServiceId(t) === selectedServiceId;
  };

  const handleNodeClick = (n) => {
    const sid = nodeServiceId(n);
    if (sid) onSelectService(sid);
  };

  return (
    <SectionCard
      title="服务拓扑"
      subtitle="API 网关 → 订单 / 商品 / 用户 / 支付 → MySQL / Redis · 13 节点"
      icon="share-2"
      actions={
        <div className="topo-legend">
          <span className="tl-item"><i className="tl-line tl-normal" />正常调用</span>
          <span className="tl-item"><i className="tl-line tl-abnormal" />异常链路</span>
          <span className="tl-item"><i className="tl-dot tl-ok" />正常</span>
          <span className="tl-item"><i className="tl-dot tl-warn" />告警</span>
          <span className="tl-item"><i className="tl-dot tl-crit" />异常</span>
        </div>
      }
    >
      <div className={`topology${selectedServiceId ? " has-selection" : ""}`}>
        <svg className="topo-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arrow-normal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-fill-normal" />
            </marker>
            <marker id="arrow-abnormal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-fill-abnormal" />
            </marker>
          </defs>

          {TOPOLOGY.edges.map((e) => {
            const mid = edgeMid(e);
            const abnormal = e.status === "abnormal";
            const related = isEdgeRelated(e);
            return (
              <g key={e.id}>
                <path
                  d={edgePath(e)}
                  className={`topo-edge${abnormal ? " is-abnormal" : ""}${related ? " is-related" : ""}`}
                  markerEnd={`url(#${abnormal ? "arrow-abnormal" : "arrow-normal"})`}
                />
                {abnormal && (
                  <g className="latency-label" transform={`translate(${mid.x}, ${mid.y})`}>
                    <rect x="-44" y="-11" width="88" height="22" rx="4" ry="4" />
                    <text x="0" y="4" textAnchor="middle">延迟 {e.latencyMs}ms</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {TOPOLOGY.nodes.map((n) => {
          const related = isNodeRelated(n);
          const selected = nodeServiceId(n) === selectedServiceId;
          const sid = nodeServiceId(n);
          return (
            <button
              key={n.id}
              type="button"
              className={`topo-node type-${n.type} st-${n.status}${related ? " is-related" : ""}${selected ? " is-selected" : ""}`}
              style={{ left: `${(n.x / VB_W) * 100}%`, top: `${(n.y / VB_H) * 100}%` }}
              onClick={() => handleNodeClick(n)}
              title={sid ? `点击查看 ${n.name} 实时指标` : n.name}
            >
              <span className="node-head">
                <Icon name={TYPE_ICON[n.type]} size="0.875rem" />
                <span className="node-name">{n.name}</span>
                <i className={`node-dot st-${n.status}`} />
              </span>
              <span className="node-meta">
                <span className="node-qps">{n.qps.toLocaleString()} QPS</span>
                {n.type !== "gateway" && (
                  <span className={`node-err${n.errRate > 0.5 ? " err-high" : ""}`}>
                    错误率 {n.errRate.toFixed(2)}%
                  </span>
                )}
                {n.type !== "db" && n.type !== "cache" && (
                  <Tag color={STATUS_TAG_COLOR[n.status]} bordered={false} className="node-tag">
                    {STATUS_LABEL[n.status]}
                  </Tag>
                )}
              </span>
              <span className="node-type-tag">{TYPE_LABEL[n.type]}</span>
            </button>
          );
        })}
      </div>

      <div className="topo-footnote">
        <Icon name="triangle-alert" size="0.875rem" />
        <span>异常链路：<b>API 网关 → 支付服务（延迟 850ms）</b>，根因下行至 <b>MySQL·支付（延迟 1200ms，慢查询率 12.4%）</b>，已联动支付服务可用率告警。</span>
      </div>
    </SectionCard>
  );
}

import Button from "@cloudsop/eview-ui/Button";
import Tag from "@cloudsop/eview-ui/Tag";
import Icon from "@/shared/Icon";
import { useApp } from "../../context.jsx";
import { stockoutUrgency } from "../../mock/data.js";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const URG_TAG = { "2小时": "danger", 当日: "warning", 次日: "primary" };
const URG_RANK = { "2小时": 0, 当日: 1, 次日: 2 };

// TODO(eview-ui): Empty 无对应，手写空状态（见 handwrite-templates.md §5）
function AppEmpty({ description = "暂无数据", icon = "inbox", style }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        color: "var(--on-surface-variant, #999)",
        ...style,
      }}
    >
      <Icon name={icon} size={48} />
      <p style={{ marginTop: "12px", marginBottom: 0, fontSize: "14px" }}>{description}</p>
    </div>
  );
}

export default function SupplyBoard() {
  const { region, stores, setDetailStoreId, setRestockStoreId } = useApp();

  const candidates = stores
    .filter((s) => s.stockoutSku > 0 && !s.restocked && (region === "全部" || s.region === region))
    .sort(
      (a, b) =>
        URG_RANK[stockoutUrgency(a)] - URG_RANK[stockoutUrgency(b)] || b.stockoutSku - a.stockoutSku
    );
  const board = candidates.slice(0, 8);

  return (
    <SectionCard
      className="sp-card-root"
      title="补给看板"
      icon="truck"
      extra={<span className="sp-extra">按紧急度排序 · 展示前 {board.length} 家</span>}
      bodyClassName="sp-body"
    >
      {board.length === 0 ? (
        <AppEmpty description="当前大区暂无待补货门店" style={{ padding: "2.5rem 0" }} />
      ) : (
        <div className="sp-grid">
          {board.map((s, idx) => {
            const urg = stockoutUrgency(s);
            return (
              <div key={s.storeId} className={`sp-item ${idx === 0 && urg === "2小时" ? "sp-top" : ""}`}>
                <div className="sp-item-head">
                  <a onClick={() => setDetailStoreId(s.storeId)} title="查看门店详情">
                    {s.storeName}
                  </a>
                  <Tag type="status" color={URG_TAG[urg]}>
                    {urg}
                  </Tag>
                </div>
                <div className="sp-item-body">
                  <div className="sp-main">
                    <b>{s.stockoutSku}</b>
                    <span>缺货 SKU</span>
                  </div>
                  <div className="sp-side">
                    <span>
                      <Icon name="clock" size="0.75rem" />
                      最近补货 {s.lastRestockTime || "—"}
                    </span>
                    <span>
                      {s.province} · {s.city} · {s.businessCircle}
                    </span>
                  </div>
                </div>
                <Button
                  status="primary"
                  size="small"
                  style={{ width: "100%" }}
                  onClick={() => setRestockStoreId(s.storeId)}
                  text="生成补货单"
                />
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

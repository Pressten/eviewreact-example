import { Button, Empty, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { stockoutUrgency } from "../../mock/data.js";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const URG_TAG = { "2小时": "error", 当日: "warning", 次日: "processing" };
const URG_RANK = { "2小时": 0, 当日: 1, 次日: 2 };

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
        <Empty description="当前大区暂无待补货门店" style={{ padding: "2.5rem 0" }} />
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
                  <Tag color={URG_TAG[urg]}>{urg}</Tag>
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
                <Button type="primary" size="small" block onClick={() => setRestockStoreId(s.storeId)}>
                  生成补货单
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

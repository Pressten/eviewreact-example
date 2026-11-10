import { useMemo } from "react";
import { Button, Drawer, Empty, Tag, message } from "antd";
import Chart from "../../../assets/shared/chart.jsx";
import { useApp } from "../../context.jsx";
import { INSPECTION_ISSUES, storeHourlySeries, storeStockTop5, storeWeekSeries } from "../../mock/data.js";
import { fmtInt } from "../../utils.js";
import "./index.css";

const STATUS_TAG = { 营业中: "success", 歇业: "error", 装修中: "warning" };
const LICENSE_TAG = { 有效: "success", 即将到期: "warning", 年审中: "processing" };

export default function StoreDrawer() {
  const { detailStoreId, setDetailStoreId, setRestockStoreId, stores } = useApp();
  const store = stores.find((s) => s.storeId === detailStoreId);

  const weekData = useMemo(() => (store ? storeWeekSeries(store) : []), [store]);
  const hourData = useMemo(() => (store ? storeHourlySeries(store) : []), [store]);
  const top5 = useMemo(() => (store ? storeStockTop5(store) : []), [store]);
  const issue = useMemo(
    () => (store ? INSPECTION_ISSUES.find((it) => it.storeId === store.storeId) : null),
    [store]
  );

  const scoreColor =
    !store || store.inspectionScore >= 90
      ? "var(--success)"
      : store.inspectionScore >= 75
        ? "var(--critical)"
        : "var(--error)";

  return (
    <Drawer
      open={!!store}
      onClose={() => setDetailStoreId(null)}
      width={760}
      title={
        store && (
          <div className="dw-title">
            <b>{store.storeName}</b>
            <span className="dw-sub">
              {store.storeId} · {store.region}大区 {store.province} {store.city}
              <Tag color={STATUS_TAG[store.status]} style={{ marginLeft: "0.5rem" }}>
                {store.status}
              </Tag>
            </span>
          </div>
        )
      }
      footer={
        store && (
          <div className="dw-footer">
            <a
              onClick={() =>
                message.info(`${store.storeName} 证照状态：${store.licenseStatus}（档案已推送至证照专员）`)
              }
            >
              查看证照
            </a>
            <Button
              type="primary"
              disabled={store.stockoutSku === 0}
              onClick={() => {
                const id = store.storeId;
                setDetailStoreId(null);
                setRestockStoreId(id);
              }}
            >
              生成补货单{store.stockoutSku > 0 ? `（缺货 ${store.stockoutSku}）` : ""}
            </Button>
          </div>
        )
      }
    >
      {store && (
        <div className="dw-body">
          <section className="dw-sec">
            <h4>基础信息</h4>
            <dl className="dw-info">
              <div>
                <dt>店长</dt>
                <dd>{store.managerName}</dd>
              </div>
              <div>
                <dt>面积</dt>
                <dd>{store.areaSqm} ㎡</dd>
              </div>
              <div>
                <dt>营业时间</dt>
                <dd>{store.openHours}</dd>
              </div>
              <div>
                <dt>证照状态</dt>
                <dd>
                  <Tag color={LICENSE_TAG[store.licenseStatus]}>{store.licenseStatus}</Tag>
                </dd>
              </div>
              <div>
                <dt>商圈类型</dt>
                <dd>{store.businessCircle}</dd>
              </div>
              <div>
                <dt>今日营业额 / 客流</dt>
                <dd>
                  ¥{fmtInt(store.dailySales)} / {fmtInt(store.customerCount)} 人
                </dd>
              </div>
            </dl>
          </section>

          <section className="dw-sec">
            <h4>近 7 日营业额</h4>
            <Chart
              name="LineChart"
              option={{
                data: weekData,
                xAxis: { data: "日期" },
                yAxisTitle: "营业额 (元)",
                smooth: true,
              }}
              style={{ height: "12.5rem" }}
            />
          </section>

          <section className="dw-sec">
            <h4>今日客流分时</h4>
            <Chart
              name="BarChart"
              option={{
                data: hourData,
                xAxis: { data: "时段" },
                yAxisTitle: "客流 (人次)",
              }}
              style={{ height: "12.5rem" }}
            />
          </section>

          <section className="dw-sec">
            <h4>缺货 TOP5 商品</h4>
            {store.stockoutSku === 0 ? (
              <Empty description="今日暂无缺货商品" style={{ padding: "1rem 0" }} />
            ) : (
              <ul className="dw-top5">
                {top5.map((p, i) => (
                  <li key={p.productName}>
                    <span className={`t5-rank ${i < 3 ? "t5-hot" : ""}`}>{i + 1}</span>
                    <span className="t5-name">{p.productName}</span>
                    <span className="t5-cat">{p.category}</span>
                    <span className={`t5-remain ${p.shelfRemaining === 0 ? "t5-zero" : ""}`}>
                      {p.shelfRemaining === 0 ? "售罄" : `剩 ${p.shelfRemaining} 件`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="dw-sec">
            <h4>上次巡检</h4>
            <div className="dw-inspect">
              <div className="dw-score">
                <b style={{ color: scoreColor }}>{store.inspectionScore}</b>
                <span>巡检评分（满分 100）</span>
              </div>
              <div className="dw-issue">
                {issue ? (
                  <>
                    <p>
                      遗留问题：<b>{issue.type}</b>
                      <Tag
                        color={
                          issue.status === "已整改"
                            ? "success"
                            : issue.status === "整改中"
                              ? "processing"
                              : "error"
                        }
                        style={{ marginLeft: "0.5rem" }}
                      >
                        {issue.status}
                      </Tag>
                    </p>
                    <p className="dw-issue-time">
                      发生于 {issue.occurredAt} · 严重度 {issue.severity}
                    </p>
                  </>
                ) : (
                  <p className="dw-issue-time">无遗留问题，门店运营合规</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </Drawer>
  );
}

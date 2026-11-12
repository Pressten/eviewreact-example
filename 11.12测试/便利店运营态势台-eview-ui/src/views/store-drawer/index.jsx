import { useMemo, useState } from "react";
import Button from "@cloudsop/eview-ui/Button";
import Drawer from "@cloudsop/eview-ui/Drawer";
import Tag from "@cloudsop/eview-ui/Tag";
import DivMessage from "@cloudsop/eview-ui/DivMessage";
import Chart from "../../../assets/shared/chart.jsx";
import Icon from "@/shared/Icon";
import { useApp } from "../../context.jsx";
import { INSPECTION_ISSUES, storeHourlySeries, storeStockTop5, storeWeekSeries } from "../../mock/data.js";
import { fmtInt } from "../../utils.js";
import "./index.css";

const STATUS_TAG = { 营业中: "success", 歇业: "danger", 装修中: "warning" };
const LICENSE_TAG = { 有效: "success", 即将到期: "warning", 年审中: "primary" };

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

export default function StoreDrawer() {
  const { detailStoreId, setDetailStoreId, setRestockStoreId, stores } = useApp();
  const store = stores.find((s) => s.storeId === detailStoreId);

  // message → DivMessage：受控通知浮层（独立 state）
  // TYPE_MAP 收口 antd→DivMessage 的 type 映射（DivMessage 无 info，info→default，否则整树白屏）
  const [notice, setNotice] = useState({ display: false, type: "default", text: "" });
  const TYPE_MAP = { info: "default", success: "success", warning: "warn", error: "error" };
  const notify = (antdType, text) =>
    setNotice({ display: true, type: TYPE_MAP[antdType] || "default", text });

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
      visible={!!store}
      onClose={() => setDetailStoreId(null)}
      width={760}
      title={
        store && (
          <div className="dw-title">
            <b>{store.storeName}</b>
            <span className="dw-sub">
              {store.storeId} · {store.region}大区 {store.province} {store.city}
              <Tag type="status" color={STATUS_TAG[store.status]} style={{ marginLeft: "0.5rem" }}>
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
                notify("info", `${store.storeName} 证照状态：${store.licenseStatus}（档案已推送至证照专员）`)
              }
            >
              查看证照
            </a>
            <Button
              status="primary"
              disabled={store.stockoutSku === 0}
              onClick={() => {
                const id = store.storeId;
                setDetailStoreId(null);
                setRestockStoreId(id);
              }}
            >
              {`生成补货单${store.stockoutSku > 0 ? `（缺货 ${store.stockoutSku}）` : ""}`}
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
                  <Tag type="status" color={LICENSE_TAG[store.licenseStatus]}>
                    {store.licenseStatus}
                  </Tag>
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
              <AppEmpty description="今日暂无缺货商品" style={{ padding: "1rem 0" }} />
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
                        type="status"
                        color={
                          issue.status === "已整改"
                            ? "success"
                            : issue.status === "整改中"
                              ? "primary"
                              : "danger"
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

          <DivMessage
            key={notice.text + notice.type}
            display={notice.display}
            type={notice.type}
            text={notice.text}
            disposeTimeOut={3000}
            onClose={() => setNotice((s) => ({ ...s, display: false }))}
          />
        </div>
      )}
    </Drawer>
  );
}

import { useMemo, useState } from "react";
import { Badge, Button, Dropdown, Progress } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { REGIONS, isStoreAbnormal } from "../../mock/data.js";
import { fmtWan } from "../../utils.js";
import SectionCard from "../../components/section-card/index.jsx";
import DeltaChip from "../../components/delta-chip/index.jsx";
import "./index.css";

const HEAT_LEVELS = 5;

const SORT_LABELS = { abnormal: "异常优先", sales: "营业额优先", stores: "门店数优先" };

export default function RegionGrid() {
  const { region, province, toggleProvince, stores } = useApp();
  const [sortKey, setSortKey] = useState("abnormal");

  // 省份统计（全国一次算齐，热度色阶用同一把标尺）
  const provStats = useMemo(() => {
    const map = {};
    stores.forEach((s) => {
      const m =
        map[s.province] ||
        (map[s.province] = {
          province: s.province,
          region: s.region,
          storeCount: 0,
          sales: 0,
          yesterdaySales: 0,
          abnormal: 0,
        });
      m.storeCount += 1;
      m.sales += s.dailySales;
      m.yesterdaySales += s.yesterdaySales;
      if (isStoreAbnormal(s)) m.abnormal += 1;
    });
    return Object.values(map);
  }, [stores]);

  // 营业额热度分级：按全国排名分 5 档（1 最浅 → 5 最深）
  const heatLevel = useMemo(() => {
    const sorted = [...provStats].sort((a, b) => a.sales - b.sales);
    const levels = {};
    sorted.forEach((p, i) => {
      levels[p.province] = Math.min(HEAT_LEVELS, Math.floor((i / sorted.length) * HEAT_LEVELS) + 1);
    });
    return levels;
  }, [provStats]);

  const nationalSales = provStats.reduce((a, p) => a + p.sales, 0) || 1;
  const regionsToShow = region === "全部" ? REGIONS : [region];

  // 组内省份排序：异常优先（默认，异常数降序→营业额降序）/ 营业额优先 / 门店数优先
  const sortProvs = (list) => {
    const arr = [...list];
    if (sortKey === "stores") {
      arr.sort((a, b) => b.storeCount - a.storeCount);
    } else if (sortKey === "sales") {
      arr.sort((a, b) => b.sales - a.sales);
    } else {
      arr.sort((a, b) => {
        if ((b.abnormal > 0) !== (a.abnormal > 0)) return b.abnormal > 0 ? 1 : -1;
        if (a.abnormal > 0 && b.abnormal > 0 && a.abnormal !== b.abnormal) return b.abnormal - a.abnormal;
        return b.sales - a.sales;
      });
    }
    return arr;
  };

  return (
    <div className="rg-wrap">
      <div className="rg-toolbar">
        <div className="rg-legend" aria-label="营业额热度图例">
          <span className="rg-legend-label">营业额热度</span>
          <i className="lg lg-1" />
          <i className="lg lg-2" />
          <i className="lg lg-3" />
          <i className="lg lg-4" />
          <i className="lg lg-5" />
          <span className="rg-legend-end">低 → 高</span>
        </div>
        <div className="rg-toolbar-right">
          <Dropdown
            placement="bottomRight"
            menu={{
              items: Object.keys(SORT_LABELS).map((k) => ({ key: k, label: SORT_LABELS[k] })),
              onClick: ({ key }) => setSortKey(key),
            }}
          >
            <Button size="small">
              排序：{SORT_LABELS[sortKey]}
              <Icon name="chevron-down" size="0.75rem" style={{ marginLeft: "0.25rem" }} />
            </Button>
          </Dropdown>
          <div className="rg-hint">
            <Icon name="triangle-alert" size="0.75rem" color="#E02128" />
            红描边省份存在异常门店；点击省份卡可联动下方门店明细
          </div>
        </div>
      </div>

      <div className={`rg-grid ${regionsToShow.length === 1 ? "rg-single" : ""}`}>
        {regionsToShow.map((rg) => {
          const provs = provStats.filter((p) => p.region === rg);
          const storeCount = provs.reduce((a, p) => a + p.storeCount, 0);
          const sales = provs.reduce((a, p) => a + p.sales, 0);
          const share = (sales / nationalSales) * 100;
          const sorted = sortProvs(provs);

          return (
            <SectionCard
              key={rg}
              className="rg-group"
              title={rg}
              extra={
                <div className="rg-share">
                  <span className="rg-share-meta">{storeCount} 家门店</span>
                  <span className="rg-share-label">营业额占比</span>
                  <Progress
                    percent={Math.round(share * 10) / 10}
                    size="small"
                    strokeColor="var(--primary)"
                    style={{ width: "7rem", margin: 0 }}
                    format={(p) => `${Number(p).toFixed(1)}%`}
                  />
                </div>
              }
              bodyClassName="rg-group-body"
            >
              {sorted.map((p) => {
                const selected = province === p.province;
                const delta = p.yesterdaySales ? (p.sales / p.yesterdaySales - 1) * 100 : 0;
                return (
                  <button
                    type="button"
                    key={p.province}
                    data-province={p.province}
                    className={`pv-card heat-${heatLevel[p.province]} ${p.abnormal > 0 ? "is-abnormal" : ""} ${selected ? "is-selected" : ""}`}
                    onClick={() => toggleProvince(p.province)}
                    title={`点击联动门店明细：${p.province}`}
                  >
                    <span className="pv-head">
                      <b>{p.province}</b>
                      {p.abnormal > 0 && (
                        <Badge count={p.abnormal} size="small" title="异常门店数">
                          <Icon name="triangle-alert" size="0.875rem" color="#E02128" />
                        </Badge>
                      )}
                    </span>
                    <span className="pv-sales">¥ {fmtWan(p.sales)}</span>
                    <span className="pv-foot">
                      <span className="pv-stores">{p.storeCount} 家</span>
                      <DeltaChip pct={delta} />
                    </span>
                  </button>
                );
              })}
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}

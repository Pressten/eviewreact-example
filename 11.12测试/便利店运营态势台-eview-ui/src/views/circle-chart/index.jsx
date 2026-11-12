import { useMemo, useState } from "react";
import Button from "@cloudsop/eview-ui/Button";
import Dropdown from "@cloudsop/eview-ui/Dropdown";
import Menu from "@cloudsop/eview-ui/Menu";
import DivMessage from "@cloudsop/eview-ui/DivMessage";
import Chart from "../../../assets/shared/chart.jsx";
import Icon from "@/shared/Icon";
import { useApp } from "../../context.jsx";
import { BUSINESS_CIRCLES } from "../../mock/data.js";
import { fmtWan } from "../../utils.js";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const METRIC_KEYS = { 营业额: "营业额(万元)", 客单价: "客单价(元)", 坪效: "坪效(元/㎡)" };

export default function CircleChart() {
  const { region, stores } = useApp();
  const [metric, setMetric] = useState("营业额");

  // message → DivMessage：受控通知浮层（独立 state）
  // TYPE_MAP 收口 antd→DivMessage 的 type 映射（DivMessage 无 info，info→default，否则整树白屏）
  const [notice, setNotice] = useState({ display: false, type: "default", text: "" });
  const TYPE_MAP = { info: "default", success: "success", warning: "warn", error: "error" };
  const notify = (antdType, text) =>
    setNotice({ display: true, type: TYPE_MAP[antdType] || "default", text });

  const { rows, totalSales } = useMemo(() => {
    const scoped = stores.filter((s) => region === "全部" || s.region === region);
    const list = BUSINESS_CIRCLES.map((c) => {
      const group = scoped.filter((s) => s.businessCircle === c);
      const sales = group.reduce((a, s) => a + s.dailySales, 0);
      const cust = group.reduce((a, s) => a + s.customerCount, 0);
      const area = group.reduce((a, s) => a + s.areaSqm, 0);
      return {
        商圈: c,
        门店数: group.length,
        "营业额(万元)": +(sales / 10000).toFixed(1),
        "客单价(元)": cust ? +(sales / cust).toFixed(1) : 0,
        "坪效(元/㎡)": area ? +(sales / area).toFixed(1) : 0,
      };
    }).sort((a, b) => b[METRIC_KEYS[metric]] - a[METRIC_KEYS[metric]]);
    return { rows: list, totalSales: scoped.reduce((a, s) => a + s.dailySales, 0) };
  }, [stores, region, metric]);

  return (
    <SectionCard
      className="cc-card"
      title="商圈绩效对比"
      icon="chart-column"
      extra={
        <div className="cc-actions">
          <Dropdown
            placement="bottomRight"
            trigger={["hover"]}
            overlay={
              <Menu onClick={(e) => setMetric(e.key)}>
                {Object.keys(METRIC_KEYS).map((k) => (
                  <Menu.Item key={k}>{`按${k}排序`}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button size="small">
              {`按${metric}排序`}
              <Icon name="chevron-down" size="0.75rem" style={{ marginLeft: "0.25rem" }} />
            </Button>
          </Dropdown>
          <span className="cc-divider" />
          <Icon
            name="refresh-cw"
            size="1rem"
            className="cc-refresh"
            title="按最新门店数据重新聚合"
            onClick={() => notify("success", "商圈绩效已按最新门店数据重新聚合")}
          />
        </div>
      }
      bodyClassName="cc-body"
    >
      <Chart
        name="BarChart"
        option={{
          data: rows,
          xAxis: { data: "商圈" },
          yAxisTitle: "", // 不渲染 Y 轴标题，单位已含在图例系列名中
        }}
        style={{ flex: "1 1 0", minHeight: "17.5rem" }}
      />
      <p className="cc-note">
        {region === "全部" ? "全国" : `${region}大区`}四类商圈营业额合计 {fmtWan(totalSales)}，与 KPI
        营业额同口径（今日实时）。
      </p>
      <DivMessage
        key={notice.text + notice.type}
        display={notice.display}
        type={notice.type}
        text={notice.text}
        disposeTimeOut={3000}
        onClose={() => setNotice((s) => ({ ...s, display: false }))}
      />
    </SectionCard>
  );
}

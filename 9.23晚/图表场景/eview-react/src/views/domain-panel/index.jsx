import IconButton from "@nce/eview-react/IconButton";
import Chart from "@nce/eview-react/Chart";
import { Icon } from "../../shared/icon.jsx";
import { domainBarData } from "../../mock/metrics.js";
import "./index.css";

// Layer 4: 业务域达成率对比 + 重点关注指标
export default function DomainPanel({ focusList }) {
  const barOption = {
    data: domainBarData,
    xAxis: { data: "业务域" },
    yAxisTitle: "平均达成率 (%)",
    direction: "horizontal",
    markLine: { top: 98 },
  };

  return (
    <section className="domain-row">
      <article className="panel">
        <header className="panel-head">
          <div className="panel-head-title">
            <h2>业务域达成率对比</h2>
            <p>各业务域指标达成率均值，低于基准线需专项跟踪</p>
          </div>
          <span className="panel-hint">
            <Icon name="info" size={13} />
            基准线 98%
          </span>
        </header>
        <Chart name="BarChart" option={barOption} style={{ height: 240 }} />
      </article>

      <article className="panel">
        <header className="panel-head">
          <div className="panel-head-title">
            <h2>重点关注</h2>
            <p>达成率最低的 5 项指标</p>
          </div>
        </header>
        <ul className="focus-list">
          {focusList.map((item, index) => (
            <li className="focus-item" key={item.code}>
              <span className={`focus-rank${index < 2 ? " is-top" : ""}`}>{index + 1}</span>
              <div className="focus-main">
                <span className="focus-name">{item.name}</span>
                <span className="focus-sub">
                  {item.domain} · {item.owner}
                </span>
              </div>
              <span className="focus-rate">
                {item.rate.toFixed(1)}
                <em>%</em>
              </span>
              <IconButton
                size="small"
                iconName={<Icon name="arrow-right" size={14} />}
                tipText="查看详情"
              />
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

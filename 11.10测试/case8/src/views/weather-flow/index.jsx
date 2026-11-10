import { Icon } from "../../../assets/shared/icon.jsx";
import LevelTag from "../../components/level-tag/index.jsx";
import { FLOW_CONTROLS, WEATHER } from "../../mock/ops.js";
import { useApp } from "../../context.jsx";
import "./index.css";

// 区块⑥ 气象与流量 —— 本场天气(能见度/风/现象) + 流量控制 3 条(等级分色)
// 生效气象预警条数与①顶部运行栏 Badge 联动
export default function WeatherFlow() {
  const { airport } = useApp();
  const wx = WEATHER[airport];
  const flows = FLOW_CONTROLS[airport];

  return (
    <section className="weather-flow">
      <div className="wf-title">
        <Icon name="cloud-lightning" size="1rem" />
        气象与流量
        <span className="wf-airport mono">{airport} · {flows.length} 条流控生效</span>
      </div>

      <div className="wf-body">
        <div className="wf-weather">
          <div className="wf-wx-grid">
            <span className="wf-item">
              <span className="wf-k"><Icon name="eye" size="0.75rem" />能见度</span>
              <span className="wf-v mono">{wx.weatherVis}</span>
            </span>
            <span className="wf-item">
              <span className="wf-k"><Icon name="wind" size="0.75rem" />风向风速</span>
              <span className="wf-v mono">{wx.windDir}<em>{wx.windGust}</em></span>
            </span>
            <span className="wf-item">
              <span className="wf-k"><Icon name="cloud-rain" size="0.75rem" />天气现象</span>
              <span className="wf-v">{wx.phenomenon}</span>
            </span>
            <span className="wf-item">
              <span className="wf-k"><Icon name="thermometer" size="0.75rem" />温度 / QNH</span>
              <span className="wf-v mono">{wx.temp} · {wx.qnh}</span>
            </span>
          </div>

          <div className="wf-alerts-label">
            生效气象预警 <b className="mono">{wx.alerts.length}</b> 条（与顶部 Badge 联动）
          </div>
          <div className="wf-alerts">
            {wx.alerts.map((a, i) => (
              <span className="wf-alert" key={i}>
                <LevelTag level={a.level} />
                <span className="wf-alert-title">{a.title}</span>
                <span className="wf-alert-detail">{a.detail}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="wf-flow">
          <div className="wf-flow-head">
            <Icon name="hourglass" size="0.875rem" />
            流量控制
          </div>
          {flows.map((fc, i) => (
            <div className="wf-flow-item" key={i}>
              <LevelTag level={fc.level} />
              <span className="wf-flow-content">{fc.content}</span>
              <span className="wf-flow-period mono">{fc.period}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

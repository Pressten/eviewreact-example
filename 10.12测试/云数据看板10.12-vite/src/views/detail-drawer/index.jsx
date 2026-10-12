import Drawer from "@nce/eview-react/Drawer";
import Button from "@nce/eview-react/Button";
import SimpleProgress from "../../components/simple-progress/index.jsx";
import Chart from "@/shared/Chart";
import { IconPlusIcCarRotateRight, IconPlusIcDigitalPowerDpFile } from '@nce/icon-plus';
import StatusTag from "../../components/status-tag/index.jsx";
import { hourlyCpu, instanceEvents } from "../../mock/dashboard.jsx";
import "./index.css";

export default function DetailDrawer({ record, open, onClose }) {
  const data = record || {};
  const cpu = data.cpu ?? 0;
  const memory = data.memory ?? 0;
  const disk = Number(data.id ? data.id.charCodeAt(3) % 60 : 40) + 30;

  const title = (
    <div className="detail-drawer__title">
      <span className="detail-drawer__name">{data.name || "实例详情"}</span>
      {data.status ? <StatusTag value={data.status} /> : null}
    </div>
  );

  const meta = [
    { label: "实例 ID", value: data.id || "-" },
    { label: "区域", value: data.region || "-" },
    { label: "规格", value: data.spec || "-" },
    { label: "可用区", value: data.region ? `${data.region.split("-")[1]}-AZ1` : "-" },
    { label: "负责人", value: data.owner || "-" },
    { label: "更新时间", value: data.updateTime || "-" },
    { label: "私网 IP", value: "192.168.12.36" },
    { label: "公网 IP", value: "121.36.205.88" },
  ];

  const cpuOption = {
    data: hourlyCpu,
    xAxis: { data: "时间", name: "时间" },
    yAxisTitle: "使用率 (%)",
    smooth: true,
  };

  return (
    <Drawer
      className="detail-drawer"
      contentClassName="detail-drawer-root"
      style={{ top: "3rem", bottom: "auto", height: "calc(100vh - 3rem)" }}
      width={560}
      visible={open}
      onClose={() => onClose()}
      title={title}
    >
      <div className="detail-drawer__body">
        <section className="detail-block">
          <h4 className="detail-block__title">基本信息</h4>
          <div className="detail-meta">
            {meta.map((m) => (
              <div className="detail-meta__item" key={m.label}>
                <span className="detail-meta__label">{m.label}</span>
                <span className="detail-meta__value">{m.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-block">
          <h4 className="detail-block__title">资源用量</h4>
          <div className="detail-usage">
            <div className="detail-usage__row">
              <span className="detail-usage__label">CPU 使用率</span>
              <SimpleProgress percent={cpu} status={cpu >= 85 ? "error" : "normal"} />
            </div>
            <div className="detail-usage__row">
              <span className="detail-usage__label">内存使用率</span>
              <SimpleProgress percent={memory} status={memory >= 85 ? "error" : "normal"} />
            </div>
            <div className="detail-usage__row">
              <span className="detail-usage__label">磁盘使用率</span>
              <SimpleProgress percent={disk} />
            </div>
          </div>
        </section>

        <section className="detail-block">
          <h4 className="detail-block__title">近 24 小时负载</h4>
          <div className="detail-chart">
            <Chart name="LineChart" option={cpuOption} style={{ height: 220 }} />
          </div>
        </section>

        <section className="detail-block">
          <h4 className="detail-block__title">最近事件</h4>
          <ul className="detail-events">
            {instanceEvents.map((e, i) => (
              <li className="detail-events__item" key={i}>
                <span className={`detail-events__dot detail-events__dot--${e.level}`} />
                <div className="detail-events__main">
                  <div className="detail-events__head">
                    <span className="detail-events__name">{e.title}</span>
                    <span className="detail-events__time">{e.time}</span>
                  </div>
                  <p className="detail-events__desc">{e.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="detail-drawer__footer">
        <Button text="关闭" onClick={() => onClose()} />
        <Button text="查看日志" leftIcon={<IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} />} />
        <Button status="primary" text="重启实例" leftIcon={<IconPlusIcCarRotateRight iconSize="0.875rem" iconColor={['currentcolor']} />} />
      </div>
    </Drawer>
  );
}

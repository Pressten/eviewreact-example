import { useRef, useMemo } from "react";
import Chart from "../../shared/chart.jsx";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import {
  DEVICES,
  STATUS_LIST,
  countByRegion,
  countByStatus,
  getDeviceTrend,
  getOverallTrend
} from "../../mock/device.js";
import "./index.css";

// 图表联动面板:
//   柱状图点击区域 → 联动筛选表格 + 饼图
//   饼图点击状态   → 联动筛选表格 + 柱状图
//   表格选中行     → 联动切换右侧趋势折线图
function useChartClick(ref, handler) {
  return () => {
    const ec = ref.current && ref.current.getEchartsInstance();
    if (!ec || ec.__linkBound) return;
    ec.__linkBound = true;
    ec.on("click", (params) => {
      if (params && params.name) handler(params.name);
    });
  };
}

export default function ChartPanel() {
  const {
    regionFilter,
    statusFilter,
    setStatusFilter,
    toggleRegionFilter,
    selectedDeviceCode,
    setSelectedDeviceCode
  } = useApp();

  const barRef = useRef(null);
  const pieRef = useRef(null);

  const onBarClick = useChartClick(barRef, (name) => toggleRegionFilter(name));
  const onPieClick = useChartClick(pieRef, (name) => {
    const meta = STATUS_LIST.find((item) => item.label === name);
    if (meta) setStatusFilter(meta.key);
  });

  // 柱状图:受"状态"筛选交叉联动(排除区域条件,保留区域自由度)
  const barOption = useMemo(() => {
    const scoped = statusFilter
      ? DEVICES.filter((d) => d.status === statusFilter)
      : DEVICES;
    const data = countByRegion(scoped).map((item) => ({
      区域: item.region,
      设备数: item.value
    }));
    return { data, xAxis: { data: "区域" }, yAxisTitle: "设备数 (台)" };
  }, [statusFilter]);

  // 饼图:受"区域"筛选交叉联动(排除状态条件)
  const pieOption = useMemo(() => {
    const scoped = regionFilter
      ? DEVICES.filter((d) => d.region === regionFilter)
      : DEVICES;
    const total = scoped.length;
    const data = countByStatus(scoped)
      .filter((item) => item.value > 0)
      .map((item) => ({ name: item.label, value: item.value }));
    return {
      data,
      title: { text: String(total), subtext: "设备总数" },
      legendPosition: "bottomCenter"
    };
  }, [regionFilter]);

  // 折线图:表格行选中 → 单设备趋势;未选中 → 全网趋势
  const selectedDevice = selectedDeviceCode
    ? DEVICES.find((d) => d.deviceCode === selectedDeviceCode)
    : null;

  const lineOption = useMemo(() => {
    if (selectedDevice) {
      return {
        data: getDeviceTrend(selectedDevice),
        xAxis: { data: "日期", name: "近7日" },
        yAxisTitle: "负载率 (%)",
        smooth: true,
        area: true,
        markLine: { top: 90 }
      };
    }
    return {
      data: getOverallTrend(),
      xAxis: { data: "日期", name: "近7日" },
      yAxisTitle: "负载率 (%)",
      smooth: true
    };
  }, [selectedDevice]);

  const statusLabel = statusFilter
    ? STATUS_LIST.find((item) => item.key === statusFilter).label
    : "全部";

  return (
    <section className="chart-panel">
      <div className="panel-card chart-card">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">各区域设备分布</h3>
            <p className="panel-hint">
              <Icon name="mouse-pointer-click" size={12} />
              当前状态:{statusLabel} · 点击柱体按区域联动筛选
            </p>
          </div>
          {regionFilter ? (
            // TODO(eview-react): eview Tag 无 closable，手写可点击移除 chip（点击本体即移除）
            <button
              type="button"
              className="chart-chip"
              title="点击移除区域筛选"
              onClick={() => toggleRegionFilter(regionFilter)}
            >
              区域:{regionFilter}
              <Icon name="close" size={12} />
            </button>
          ) : null}
        </div>
        <div className="chart-body">
          <Chart ref={barRef} name="BarChart" option={barOption} onChartRendered={onBarClick} />
        </div>
      </div>

      <div className="panel-card chart-card">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">设备状态分布</h3>
            <p className="panel-hint">
              <Icon name="mouse-pointer-click" size={12} />
              {regionFilter ? "当前区域:" + regionFilter : "全部区域"} · 点击扇区按状态联动筛选
            </p>
          </div>
        </div>
        <div className="chart-body">
          <Chart ref={pieRef} name="PieChart" option={pieOption} onChartRendered={onPieClick} />
        </div>
      </div>

      <div className="panel-card chart-card">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">
              {selectedDevice ? selectedDevice.deviceName + " · 负载趋势" : "全网设备 · 负载趋势"}
            </h3>
            <p className="panel-hint">
              <Icon name="mouse-pointer-click" size={12} />
              {selectedDevice
                ? "来自表格选中行 · 点击标签返回全网视角"
                : "点击下方表格行,查看单设备近7日趋势"}
            </p>
          </div>
          {selectedDevice ? (
            <button
              type="button"
              className="chart-chip"
              title="点击返回全网视角"
              onClick={() => setSelectedDeviceCode(null)}
            >
              {selectedDevice.deviceCode}
              <Icon name="close" size={12} />
            </button>
          ) : null}
        </div>
        <div className="chart-body">
          <Chart name="LineChart" option={lineOption} />
        </div>
      </div>
    </section>
  );
}

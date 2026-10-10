import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";

const Chart = forwardRef(function Chart(
  { name, option, className, style, onChartRendered },
  ref
) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const renderedRef = useRef(onChartRendered);
  renderedRef.current = onChartRendered;

  const [darkTick, setDarkTick] = useState(0);
  useEffect(() => {
    const mo = new MutationObserver(() => setDarkTick((t) => t + 1));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const dom = containerRef.current;
    if (!dom || !window.HUICharts) return;

    const isDark = document.documentElement.classList.contains("dark");
    const chart = new HUICharts();
    chart.init(dom, { renderer: "svg"});
    chart.setSimpleOption(name, {
      theme: isDark ? "hdesign-dark" : "hdesign-light",
      a2ui: true,
      ...option,
    });
    chart.render();
    chartRef.current = chart;
    if (renderedRef.current) renderedRef.current(chart);

    const ro = new ResizeObserver(() => {
      if (chartRef.current && !chartRef.current._disposed) chart.resize();
    });
    ro.observe(dom);

    return () => {
      ro.disconnect();
      try { chart.dispose(); } catch (e) { }
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, JSON.stringify(option), darkTick]);

  useImperativeHandle(ref, () => ({
    getEchartsInstance: () => (chartRef.current ? chartRef.current.getEchartsInstance() : null),
    resizeHandler: () => {
      if (chartRef.current) chartRef.current.resize();
    },
  }), []);

  const wrapperStyle = { width: "100%", height: "100%", ...style };
  return <div ref={containerRef} className={className} style={wrapperStyle} />;
});

export default Chart;

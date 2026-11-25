import {useEffect,useRef} from 'react';

// 概览仪表、表格圆环与超时标尺共用的 ECharts 画布（自绘指标图形的渲染层）。
// 图表实例随容器挂载和卸载，配置更新复用同一实例（notMerge 全量替换）。
export default function EchartsCanvas({echartsOption}) {
  const containerRef=useRef(null);
  const chartRef=useRef(null);
  useEffect(() => {
    const container=containerRef.current;
    const chart=window.echarts.init(container,null,{renderer:'svg'});
    chartRef.current=chart;
    // 监听图表容器，覆盖工作台布局变化而窗口大小没变的情况。
    const observer=new ResizeObserver(()=>chart.resize());
    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current=null;
    };
  },[]);
  useEffect(() => {
    chartRef.current?.setOption(echartsOption,{notMerge:true});
  },[echartsOption]);
  return <span ref={containerRef} style={{display:'block',width:'100%',height:'100%'}}/>;
}

import {useMemo} from 'react';
import TipBox from '@nce/eview-react/TipBox';
import Chart from '@nce/eview-react/Chart';
import {useApp, useReportChartTheme} from '../../context.jsx';
import './index.css';

function ringOption(value,total,colors){
  return {animation:false,color:[colors.active,colors.track],tooltip:{show:false},legend:{show:false},
    series:[{id:'table-compliance-ring',type:'pie',radius:['75%','100%'],center:['50%','50%'],startAngle:90,clockwise:true,
      silent:true,minAngle:0,avoidLabelOverlap:false,label:{show:false},labelLine:{show:false},emphasis:{disabled:true},
      data:[{name:'通过',value,itemStyle:{color:colors.active,borderWidth:0}},{name:'未通过',value:Math.max(0,total-value),itemStyle:{color:colors.track,borderWidth:0}}]}]};
}

// 圆环以原始通过数和未通过数绘制。百分比只在文字处四舍五入，分母为零时显示占位符。
export default function RatioMeter({value,total,unit}) {
  const {isDark}=useApp();
  const colors=useReportChartTheme()?.ratio;
  const chartBase={a2ui:true,theme:isDark?'hdesign-dark':'hdesign-light'};
  const ringOpt=useMemo(()=>colors&&total>0?ringOption(value,total,colors):null,[value,total,colors,isDark]);
  const percent=total>0?Math.max(0,Math.min(100,value/total*100)):null;
  const description=percent===null?'暂无检查数据':value+' / '+total+' '+unit+'通过';
  return <TipBox content={description} direction="top">
    <span className="report-ratio-meter" role="img" aria-label={percent===null?'合规率暂无数据':'合规率 '+percent.toFixed(1)+'%，'+description}>
      {percent!==null&&<span className="report-ratio-ring" aria-hidden="true">
        {ringOpt&&<Chart name="PieChart" option={{...chartBase,...ringOpt}}/>}
      </span>}
      <strong>{percent===null?'—':percent.toFixed(1)+'%'}</strong>
    </span>
  </TipBox>;
}

import {useEffect,useMemo,useState} from 'react';
import TipBox from '@nce/eview-react/TipBox';
import Chart from '@nce/eview-react/Chart';
import { IconPlusIcPublicSortDown, IconPlusIcPublicSortUp } from '@hui/icon-plus';
import {useApp} from '../../context.jsx';
import {gaugeGeometry} from './geometry.js';
import './index.css';

function segmentedOptions(percent,colors){
  const filled=Math.max(0,Math.min(100,percent))/100*gaugeGeometry.bars.length;
  const arcColors=[colors.start,colors.end];
  return {animation:false,color:[...arcColors,colors.track],tooltip:{show:false},series:[{type:'custom',id:'compliance-segments',coordinateSystem:'none',silent:true,
    data:gaugeGeometry.bars.map((bar,index)=>[index]),renderItem:(params,api)=>{
      const index=api.value(0),bar=gaugeGeometry.bars[index],fraction=Math.max(0,Math.min(1,filled-index));
      const scale=Math.min(api.getWidth()/gaugeGeometry.width,api.getHeight()/gaugeGeometry.height);
      const path=fill=>({type:'path',shape:{pathData:bar.paths[0].data},style:{fill}});
      // 按刻度位置采样整道弧的色带，每格用一个颜色。
      const segmentColor=window.echarts.color.lerp(index/(gaugeGeometry.bars.length-1),arcColors);
      const children=[path(fraction===1?segmentColor:colors.track)];
      if(fraction>0&&fraction<1){
        // 末格保留底色，再叠加裁剪后的彩色路径。扇区中心从仪表坐标换算为当前刻度的局部坐标。
        const angle=(-178.36+175.33*index/25)*Math.PI/180,half=3.5*Math.PI/180;
        const active=path(segmentColor);
        active.clipPath={type:'sector',shape:{cx:130.2-bar.x,cy:132-bar.y,r:500,r0:0,startAngle:angle-half,endAngle:angle-half+2*half*fraction,clockwise:true}};
        children.push(active);
      }
      return {type:'group',x:(api.getWidth()-gaugeGeometry.width*scale)/2+bar.x*scale,y:(api.getHeight()-gaugeGeometry.height*scale)/2+bar.y*scale,scaleX:scale,scaleY:scale,children};
    }}]};
}

export default function SegmentedComplianceGauge({summary,comparison}){
  const {isDark}=useApp(),[colors,setColors]=useState(null);
  const chartBase={a2ui:true,theme:isDark?'hdesign-dark':'hdesign-light'};
  useEffect(()=>{
    // SVG 图表接收主题切换后解析出的实际颜色，而非 CSS Token 名称。
    const style=getComputedStyle(document.querySelector('.report-workspace'));
    setColors({
      start:style.getPropertyValue('--report-gauge-arc-start').trim(),
      end:style.getPropertyValue('--report-gauge-arc-end').trim(),
      track:style.getPropertyValue('--report-gauge-track').trim(),
    });
  },[isDark]);
  const percent = Number(summary.compliance);
  const echartsOption = useMemo(() => colors && segmentedOptions(percent, colors), [percent, colors]);
  // 环下显示的是两期通过率之差（百分点）。卡片按稿件取整，悬浮时显示一位小数。
  const change=comparison&&summary.total?summary.passed/summary.total*100-comparison.passed/comparison.total*100:null;
  return <div className="segmented-compliance-gauge" role="img" aria-label={'设备合规率 '+summary.compliance+'%，'+summary.passed+' / '+summary.total+' 台设备通过'}>
    <div className="segmented-compliance-plot">
      {echartsOption&&<Chart option={{...chartBase, ...echartsOption}}/>}
    </div>
    <div className="segmented-compliance-value"><strong>{summary.compliance}</strong><span>%</span></div>
    <TipBox type="simple" content={change===null?'通过设备数 / 已检查设备数':'较上次提升 '+change.toFixed(1)+' 个百分点'}>
      <div className="segmented-compliance-caption"><span>合规率</span>{change!==null&&<><strong>{Math.round(change)}%</strong>{change>=0 ? <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} className="report-gauge-trend-icon" /> : <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} className="report-gauge-trend-icon" />}</>}</div>
    </TipBox>
  </div>;
}

import {useId,useRef,useState} from 'react';
import { IconPlusIcPublicDownload } from '@hui/icon-plus';
import Button from '@nce/eview-react/Button';
import TipBox from '@nce/eview-react/TipBox';
import RadioGroup from '@nce/eview-react/RadioGroup';
import {useApp} from '../../context.jsx';
import {NativeSelect} from '../form-controls/select.jsx';
import {getReportExportScopes,downloadReportExcel} from '../../utils/report-export.js';
import './index.css';

// UC2/UC4 共用导出选项；弹层只负责收集受控字段，Excel 模型仍由 utils/report-export 生成。
// Popover → TipBox trigger="click" isMouseLeaveClose={false} isClosable；下载成功后换 key 关闭。
export default function ReportExport({uc,reviews,ruleConfigs,disabled=false}){
 const {toast}=useApp(),uid=useId(),busyRef=useRef(false);
 const [busy,setBusy]=useState(false),[panelKey,setPanelKey]=useState(0);
 const [resultMode,setResultMode]=useState('violations'),[scopeMode,setScopeMode]=useState('all'),[scopeValue,setScopeValue]=useState(''),[groupBy,setGroupBy]=useState('device');
 const scopes=getReportExportScopes(uc),options=scopeMode==='institution'?scopes.institutions:scopeMode==='region'?scopes.regions:[];
 const title=uc==='uc2'?'黄金基线报告':'基线检查报告';
 const scope=next=>{setScopeMode(next);setScopeValue((next==='institution'?scopes.institutions:scopes.regions)[0]?.value||'');};
 const download=async()=>{
  if(busyRef.current||disabled||(scopeMode!=='all'&&!scopeValue))return;
  busyRef.current=true;setBusy(true);
  try{await downloadReportExcel({uc,resultMode,scopeMode,scopeValue,groupBy,reviews,ruleConfigs});toast(`${title}已导出为 Excel`);setPanelKey(k=>k+1);}
  catch(error){toast(error?.message||'导出失败，请重试');}
  finally{busyRef.current=false;setBusy(false);}
 };
 const content=<section id={`${uid}-panel`} className="report-export-panel" role="dialog" aria-modal="false" aria-labelledby={`${uid}-title`}>
  <header><strong id={`${uid}-title`}>导出 Excel</strong><span>.xlsx</span></header>
  <fieldset><legend id={`${uid}-result`}>导出内容</legend><RadioGroup className="report-export-choices" aria-labelledby={`${uid}-result`} name={`${uid}-result`} isControlled value={resultMode} onChange={(a,b)=>setResultMode(a===resultMode?b:a)} disabled={busy} data={[{value:'violations',text:'仅导出违规'},{value:'all',text:'导出所有'}]}/></fieldset>
  <fieldset><legend id={`${uid}-scope`}>导出范围</legend><RadioGroup className="report-export-choices" aria-labelledby={`${uid}-scope`} name={`${uid}-scope`} isControlled value={scopeMode} onChange={(a,b)=>scope(a===scopeMode?b:a)} disabled={busy} data={[{value:'all',text:'全部范围'},{value:'institution',text:'指定机构'},{value:'region',text:'指定区域'}]}/>{scopeMode!=='all'&&<div className="report-export-scope-field"><NativeSelect aria-label={scopeMode==='institution'?'选择导出机构':'选择导出区域'} value={scopeValue} onChange={e=>setScopeValue(e.target.value)} style={{width:'100%'}} disabled={busy}>{options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</NativeSelect></div>}</fieldset>
  <fieldset><legend id={`${uid}-group`}>生成维度</legend><RadioGroup className="report-export-choices" aria-labelledby={`${uid}-group`} name={`${uid}-group`} isControlled value={groupBy} onChange={(a,b)=>setGroupBy(a===groupBy?b:a)} disabled={busy} data={[{value:'device',text:'按设备生成'},{value:'rule',text:'按规则生成'}]}/></fieldset>
  <footer><small>当前报告范围 · 支持离线导出</small><Button status="primary" disabled={busy||(scopeMode!=='all'&&!scopeValue)} onClick={download} text={busy?'正在生成…':'下载 Excel'}/></footer>
 </section>;
 return <TipBox key={panelKey} content={content} trigger="click" direction="bottomRight" isMouseLeaveClose={false} isClosable arrowDirection="none">
  <button type="button" className="report-export-trigger" data-export-uc={uc} aria-label={`下载${title} Excel`} aria-haspopup="dialog" disabled={disabled||busy}><IconPlusIcPublicDownload iconSize="1rem" iconColor={['currentcolor']} /></button>
 </TipBox>;
}

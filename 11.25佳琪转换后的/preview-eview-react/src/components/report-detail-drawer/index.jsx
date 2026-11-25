import {useEffect,useRef} from 'react';
import { IconPlusIcPublicLeftArrow } from '@hui/icon-plus';
import Drawer from '@nce/eview-react/Drawer';
import ReportDeviceDetail, {ReportDeviceHeader} from '../report-device-detail/index.jsx';
import ReportRuleDetail, {ReportRuleHeader} from '../report-rule-detail/index.jsx';
import './index.css';

// Drawer.md：不级联多抽屉，钻取在同一抽屉内切换内容。
// stack 为钻取栈：栈底由页面链接打开，抽屉内点关联链接（规则↔设备）逐层入栈；
// 标题区返回箭头逐层回退，回退后焦点恢复到触发该层钻取的链接；整屉关闭交给 Drawer 默认行为。

function levelKey(entry,index) {
  const identity=entry.type==='device'
    ?'device:'+entry.deviceRecord.id+':'+(entry.initialRuleId||'')
    :'rule:'+entry.rule.id+':'+(entry.device||'');
  return identity+'#'+index;
}

function detailLevel(entry,devices,rules,onOpenRelated) {
  return entry.type==='device'
    ? <ReportDeviceDetail device={entry.deviceRecord} rules={rules} initialRuleId={entry.initialRuleId}
        onOpenRule={(nextRule,deviceName)=>onOpenRelated({type:'rule',rule:nextRule,device:deviceName})}/>
    : <ReportRuleDetail rule={entry.rule} devices={devices} initialDevice={entry.device}
        onOpenDevice={nextDevice=>onOpenRelated({type:'device',device:nextDevice,initialRuleId:entry.rule.id})}/>;
}

export default function ReportDetailDrawer({stack,open,devices,rules,checkedAt,onOpenRelated,onBack,onClose}) {
  const backRef=useRef(null);
  const drillTriggers=useRef([]); // drillTriggers[i] = 触发第 i 层钻取的元素（i>=1，位于上一层内容中）
  const pendingFocus=useRef(null); // 栈变化渲染后待恢复的焦点
  const stackLength=useRef(0); // 上次渲染的栈深，用于校验 pendingFocus 与栈变化方向一致
  const top=stack[stack.length-1];
  const isDevice=top?.type==='device';

  const pushRelated=entry=>{
    drillTriggers.current[stack.length]=document.activeElement;
    pendingFocus.current={kind:'back'};
    onOpenRelated(entry);
  };
  const back=()=>{
    const trigger=drillTriggers.current[stack.length-1];
    pendingFocus.current=trigger?{kind:'element',el:trigger}:null;
    drillTriggers.current.length=Math.max(0,stack.length-1);
    onBack();
  };
  useEffect(()=>{
    const grew=stack.length>stackLength.current;
    const shrank=stack.length<stackLength.current;
    stackLength.current=stack.length;
    const pending=pendingFocus.current;
    pendingFocus.current=null;
    if(!pending)return;
    if(pending.kind==='back'&&grew){backRef.current?.focus({preventScroll:true});return;}
    if(pending.kind==='element'&&shrank&&pending.el.isConnected)pending.el.focus({preventScroll:true});
  },[stack]);
  // 整屉关闭后钻取触发记录清零，下次打开从干净状态开始。
  useEffect(()=>{if(!open)drillTriggers.current.length=0;},[open]);

  if(!top)return null;
  const header=isDevice
    ?<ReportDeviceHeader device={top.deviceRecord} checkedAt={checkedAt}/>
    :<ReportRuleHeader rule={top.rule} checkedAt={checkedAt}/>;
  return <Drawer placement="right" visible={open} onClose={onClose} destroyOnClose
    className={isDevice?'report-device-drawer':'report-rule-drawer'}
    width="min(80rem, calc(100% - var(--spacing-12)))"
    isMountBody={false}
    style={{position:'absolute',top:'var(--workspace-header-height)'}}
    title={<div className="rule-inspection-drill">
      {stack.length>1&&<button type="button" ref={backRef} className="rule-inspection-drill-back"
        aria-label="返回上一级" title="返回上一级" onClick={back}>
        <IconPlusIcPublicLeftArrow iconSize="1rem" iconColor={['currentcolor']} />
      </button>}
      {header}
    </div>}>
    <div className="rule-inspection-drawer-body">
      {stack.map((entry,index)=>(
        <div key={levelKey(entry,index)} hidden={index<stack.length-1||undefined}
          className="rule-inspection-drawer-level">
          {detailLevel(entry,devices,rules,pushRelated)}
        </div>
      ))}
    </div>
  </Drawer>;
}

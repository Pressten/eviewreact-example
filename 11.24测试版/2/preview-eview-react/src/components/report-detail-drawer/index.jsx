import {useRef} from 'react';
import Drawer from '@nce/eview-react/Drawer';
import ReportDeviceDetail, {ReportDeviceHeader} from '../report-device-detail/index.jsx';
import ReportRuleDetail, {ReportRuleHeader} from '../report-rule-detail/index.jsx';
import './index.css';

function DetailLayer({selection, devices, rules, checkedAt, onClose, onOpenRelated, blocked, nested, onAfterClose}) {
  const {type, open, rule, device, deviceRecord, initialRuleId} = selection;
  const isDevice = type === 'device';
  const title = isDevice ? <ReportDeviceHeader device={deviceRecord} checkedAt={checkedAt}/>
    : <ReportRuleHeader rule={rule} checkedAt={checkedAt}/>;
  const handleClose = () => {
    onClose();
    if (nested && onAfterClose) onAfterClose();
  };
  // eview Drawer 适配：visible/destroyOnClose 对应源版 open/destroyOnHidden；isMountBody={false}
  // 在当前 DOM 挂载并用绝对定位贴工作区顶栏下沿；嵌套层作为兄弟节点渲染并抬升层级（对应源版 zIndex 1100）。
  // push 无对应属性，嵌套抽屉直接覆盖外层；closable/maskClosable 对应 showClose/isClickMask，keyboard 无对应。
  return <Drawer placement="right" visible={open} onClose={handleClose} destroyOnClose
    className={(isDevice ? 'report-device-drawer' : 'report-rule-drawer') + (nested ? ' report-drawer-nested' : '')}
    showClose={!blocked} isClickMask={!blocked}
    width="min(80rem, calc(100vw - 3rem))" isMountBody={false}
    style={{position:'absolute',top:'var(--workspace-header-height)'}} title={title}>
    <div className="rule-inspection-drawer-body" inert={blocked ? '' : undefined}>
      {isDevice
        ? <ReportDeviceDetail key={deviceRecord.id} device={deviceRecord} rules={rules} initialRuleId={initialRuleId}
          onOpenRule={onOpenRelated && ((nextRule, deviceName) => onOpenRelated({type:'rule', rule:nextRule, device:deviceName}))}/>
        : <ReportRuleDetail key={rule.id + (device || '')} rule={rule} devices={devices} initialDevice={device}
          onOpenDevice={onOpenRelated && (nextDevice => onOpenRelated({type:'device', device:nextDevice, initialRuleId:rule.id}))}/>}
    </div>
  </Drawer>;
}

export default function ReportDetailDrawer({selection, relatedSelection, devices, rules, checkedAt, onOpenRelated, onClose, onCloseRelated}) {
  const relatedTrigger = useRef(null);
  if (!selection) return null;
  const relatedOpen = Boolean(relatedSelection?.open);
  const openRelated = entry => {
    relatedTrigger.current = document.activeElement;
    onOpenRelated(entry);
  };
  const restoreFocus = () => {
    if (relatedTrigger.current?.isConnected) {
      relatedTrigger.current.focus({preventScroll:true});
    }
  };
  return <>
    <DetailLayer selection={selection} devices={devices} rules={rules} checkedAt={checkedAt}
      onClose={onClose} onOpenRelated={openRelated} blocked={relatedOpen}/>
    {relatedSelection && <DetailLayer selection={relatedSelection} devices={devices} rules={rules}
      checkedAt={checkedAt} onClose={onCloseRelated} nested onAfterClose={restoreFocus}/>}
  </>;
}

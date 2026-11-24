import {useRef} from 'react';
import Drawer from '@nce/eview-react/Drawer';
import ReportDeviceDetail, {ReportDeviceHeader} from '../report-device-detail/index.jsx';
import ReportRuleDetail, {ReportRuleHeader} from '../report-rule-detail/index.jsx';
import './index.css';

function DetailLayer({selection, devices, rules, checkedAt, onClose, onOpenRelated, blocked, nested, afterOpenChange, children}) {
  const {type, open, rule, device, deviceRecord, initialRuleId} = selection;
  const isDevice = type === 'device';
  const title = isDevice ? <ReportDeviceHeader device={deviceRecord} checkedAt={checkedAt}/>
    : <ReportRuleHeader rule={rule} checkedAt={checkedAt}/>;
  const handleClose = (isShowDrawer) => {
    if (afterOpenChange) afterOpenChange(false);
    onClose(isShowDrawer);
  };
  return <Drawer placement="right" visible={open} onClose={handleClose} destroyOnClose
    className={isDevice ? 'report-device-drawer' : 'report-rule-drawer'}
    showClose={!blocked} isClickMask={!blocked}
    width={1280}
    isMountBody={false}
    style={{position:'absolute',top:'var(--workspace-header-height)',maxWidth:'calc(100% - var(--spacing-12))'}} title={title}>
    <div className="rule-inspection-drawer-body" inert={blocked ? '' : undefined}>
      {isDevice
        ? <ReportDeviceDetail key={deviceRecord.id} device={deviceRecord} rules={rules} initialRuleId={initialRuleId}
          onOpenRule={onOpenRelated && ((nextRule, deviceName) => onOpenRelated({type:'rule', rule:nextRule, device:deviceName}))}/>
        : <ReportRuleDetail key={rule.id + (device || '')} rule={rule} devices={devices} initialDevice={device}
          onOpenDevice={onOpenRelated && (nextDevice => onOpenRelated({type:'device', device:nextDevice, initialRuleId:rule.id}))}/>}
    </div>
    {children}
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
  const restoreFocus = open => {
    if (!open && relatedTrigger.current?.isConnected) {
      relatedTrigger.current.focus({preventScroll:true});
    }
  };
  return <DetailLayer selection={selection} devices={devices} rules={rules} checkedAt={checkedAt}
    onClose={onClose} onOpenRelated={openRelated} blocked={relatedOpen}>
    {relatedSelection && <DetailLayer selection={relatedSelection} devices={devices} rules={rules}
      checkedAt={checkedAt} onClose={onCloseRelated} nested afterOpenChange={restoreFocus}/>}
  </DetailLayer>;
}

import '../report-rule-link/index.css';
import './index.css';

export default function ReportDeviceLink({device,onOpen,label,className=''}) {
  return <a href={'#device-'+device.id} aria-haspopup="dialog" className={'report-rule-link report-device-link '+className}
    title={device.name} onClick={event=>{event.preventDefault();onOpen(device);}}>{label||device.name}</a>;
}

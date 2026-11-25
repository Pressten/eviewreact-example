import {useRef,useState} from 'react';
import { IconPlusIcCarLayers, IconPlusIcCarUser, IconPlusIcDigitalPowerDpMenu, IconPlusIcIctMark, IconPlusIcPublicChevronDown, IconPlusIcPublicClose, IconPlusIcPublicCvsFileTextured, IconPlusIcPublicMoon, IconPlusIcPublicSearch, IconPlusIcPublicSquare, IconPlusIcPublicSun, IconPlusIcPublicTransverseRectangleTemplate } from '@hui/icon-plus';
import Accordion from '@/shared/Accordion';
import {Tab, TabItem} from '@nce/eview-react/Tab';
import ReportPage from '../report-page/index.jsx';
import ReportConversation from '../report-conversation/index.jsx';
import {ReportChartThemeProvider,useApp} from '../../context.jsx';
import './index.css';
import './event-colors.css';

const navigation=[
  {value:'home',title:'首页',icon:<IconPlusIcPublicTransverseRectangleTemplate iconSize="1rem" iconColor={['currentcolor']} />,disabled:true},
  {value:'chat',title:'智能体对话',icon:<IconPlusIcPublicSquare iconSize="1rem" iconColor={['currentcolor']} />},
  {value:'resources',title:'网络资源',icon:<IconPlusIcCarLayers iconSize="1rem" iconColor={['currentcolor']} />,disabled:true},
  {value:'report',title:'检查报告',icon:<IconPlusIcPublicCvsFileTextured iconSize="1rem" iconColor={['currentcolor']} />},
];

// 保留原工作台架构；仅承载当前报告，不恢复任务流或其他业务模块。
export default function ReportWorkspace() {
  const {isDark,toggleTheme}=useApp();
  const workspaceRef=useRef(null);
  const [collapsed,setCollapsed]=useState(true);
  const showReport=()=>document.getElementById('report-scroll')?.scrollTo({top:0,behavior:'smooth'});
  return <div ref={workspaceRef} className="report-workspace">
    <header className="workspace-global-header">
      <div className="workspace-brand"><IconPlusIcDigitalPowerDpMenu iconSize="1.5rem" iconColor={['currentcolor']} /><img src={isDark?'/uploads/shell-brand.svg':'/uploads/shell-brand-light.svg'} width="144" height="24" alt="iMaster NCE"/></div>
      <div className="workspace-account-tools"><span className="workspace-mode">智驾模式<IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} /></span>
        <IconPlusIcPublicSearch iconSize="1.25rem" iconColor={['currentcolor']} /><IconPlusIcIctMark iconSize="1.25rem" iconColor={['currentcolor']} />
        <button type="button" className="workspace-theme-toggle" role="switch" aria-checked={isDark} aria-label="深色主题" title={isDark?'切换为浅色主题':'切换为深色主题'} onClick={toggleTheme}>
          {isDark ? <IconPlusIcPublicMoon iconSize="1.25rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSun iconSize="1.25rem" iconColor={['currentcolor']} />}
        </button>
        <span className="workspace-account"><IconPlusIcCarUser iconSize="1.25rem" iconColor={['currentcolor']} />Admin</span>
      </div>
    </header>
    <aside className="workspace-navigation" aria-label="主导航">
      <img className="workspace-assistant-mark" src="/uploads/nav-assistant.svg" width="24" height="24" alt="Aico"/>
      <Accordion data={navigation} selectedValue="chat" onClick={()=>showReport()}
        expanded={collapsed} onExpand={(flag)=>setCollapsed(!flag)} hideIcons hideTitleBar/>
      <span className="workspace-navigation-footer"><IconPlusIcPublicClose iconSize="1rem" iconColor={['currentcolor']} /></span>
    </aside>
    <ReportConversation onShowReport={showReport}/>
    <section className="workspace-report" aria-label="报告工作区">
      <header className="workspace-report-tabs"><Tab draggable={false} selectedIndex={1}>
        <TabItem title="规则管理" disabled>{''}</TabItem>
        <TabItem title="检查报告">{''}</TabItem>
        <TabItem title="黄金基线" disabled>{''}</TabItem>
      </Tab></header>
      <div className="workspace-report-scroll" id="report-scroll">
        <ReportChartThemeProvider workspaceRef={workspaceRef}><ReportPage/></ReportChartThemeProvider>
      </div>
    </section>
  </div>;
}

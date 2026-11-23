import Accordion from '@/shared/Accordion';
import { IconPlusIcCarLayers, IconPlusIcDigitalPowerDpDocText, IconPlusIcDigitalPowerDpMenu, IconPlusIcPublicChevronDown, IconPlusIcPublicClose, IconPlusIcPublicHome, IconPlusIcPublicMessageBubble, IconPlusIcPublicMoon, IconPlusIcPublicPerson, IconPlusIcPublicQuestionmarkCircle, IconPlusIcPublicSearch, IconPlusIcPublicSun } from '@hui/icon-plus';
import Tab, {TabItem} from '@nce/eview-react/Tab';
import ReportPage from '../report-page/index.jsx';
import ReportConversation from '../report-conversation/index.jsx';
import {useApp} from '../../context.jsx';
import './index.css';
import './event-colors.css';

const navigation=[
  {title:'首页',value:'home',icon:<IconPlusIcPublicHome iconSize="1rem" iconColor={['currentcolor']} />,disabled:true},
  {title:'智能体对话',value:'chat',icon:<IconPlusIcPublicMessageBubble iconSize="1rem" iconColor={['currentcolor']} />},
  {title:'网络资源',value:'resources',icon:<IconPlusIcCarLayers iconSize="1rem" iconColor={['currentcolor']} />,disabled:true},
  {title:'检查报告',value:'report',icon:<IconPlusIcDigitalPowerDpDocText iconSize="1rem" iconColor={['currentcolor']} />},
];

const workspaceTabs=[
  {key:'rules',label:'规则管理',disabled:true},
  {key:'report',label:'检查报告'},
  {key:'baseline',label:'黄金基线',disabled:true},
];

// 保留原工作台架构；仅承载当前报告，不恢复任务流或其他业务模块。
export default function ReportWorkspace() {
  const {isDark,toggleTheme}=useApp();
  const showReport=()=>document.getElementById('report-scroll')?.scrollTo({top:0,behavior:'smooth'});
  return <div className="report-workspace">
    <header className="workspace-global-header">
      <div className="workspace-brand"><IconPlusIcDigitalPowerDpMenu iconSize="1.5rem" iconColor={['currentcolor']} /><img src={isDark?'/uploads/shell-brand.svg':'/uploads/shell-brand-light.svg'} width="144" height="24" alt="iMaster NCE"/></div>
      <div className="workspace-account-tools"><span className="workspace-mode">智驾模式<IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} /></span>
        <IconPlusIcPublicSearch iconSize="1.25rem" iconColor={['currentcolor']} /><IconPlusIcPublicQuestionmarkCircle iconSize="1.25rem" iconColor={['currentcolor']} />
        <button type="button" className="workspace-theme-toggle" role="switch" aria-checked={isDark} aria-label="深色主题" title={isDark?'切换为浅色主题':'切换为深色主题'} onClick={toggleTheme}>
          {isDark ? <IconPlusIcPublicMoon iconSize="1.25rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSun iconSize="1.25rem" iconColor={['currentcolor']} />}
        </button>
        <span className="workspace-account"><IconPlusIcPublicPerson iconSize="1.25rem" iconColor={['currentcolor']} />Admin</span>
      </div>
    </header>
    <aside className="workspace-navigation" aria-label="主导航">
      <img className="workspace-assistant-mark" src="/uploads/nav-assistant.svg" width="24" height="24" alt="Aico"/>
      <Accordion data={navigation} selectedValue="chat" onClick={()=>showReport()}
        hideIcons hideTitleBar enableExpand={false} expanded={true}/>
      <span className="workspace-navigation-footer"><IconPlusIcPublicClose iconSize="1rem" iconColor={['currentcolor']} /></span>
    </aside>
    <ReportConversation onShowReport={showReport}/>
    <section className="workspace-report" aria-label="报告工作区">
      <header className="workspace-report-tabs"><Tab type="main" draggable={false} selectedIndex={workspaceTabs.findIndex(t=>t.key==='report')}>
        {(workspaceTabs||[]).map(t=><TabItem key={t.key} title={t.label} disabled={t.disabled}/>)}
      </Tab></header>
      <div className="workspace-report-scroll" id="report-scroll"><ReportPage/></div>
    </section>
  </div>;
}

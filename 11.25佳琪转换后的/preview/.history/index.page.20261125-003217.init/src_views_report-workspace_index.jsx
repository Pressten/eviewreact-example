import {useRef} from 'react';
import {Menu,Tabs} from 'antd';
import {Icon} from '../../../public/shared/icon.jsx';
import ReportPage from '../report-page/index.jsx';
import ReportConversation from '../report-conversation/index.jsx';
import {ReportChartThemeProvider,useApp} from '../../context.jsx';
import './index.css';
import './event-colors.css';

const navigation=[
  {key:'home',label:'首页',icon:<Icon name="house" size="1rem"/>,disabled:true},
  {key:'chat',label:'智能体对话',icon:<Icon name="messages-square" size="1rem"/>},
  {key:'resources',label:'网络资源',icon:<Icon name="layers" size="1rem"/>,disabled:true},
  {key:'report',label:'检查报告',icon:<Icon name="file-text" size="1rem"/>},
];

// 保留原工作台架构；仅承载当前报告，不恢复任务流或其他业务模块。
export default function ReportWorkspace() {
  const {isDark,toggleTheme}=useApp();
  const workspaceRef=useRef(null);
  const showReport=()=>document.getElementById('report-scroll')?.scrollTo({top:0,behavior:'smooth'});
  return <div ref={workspaceRef} className="report-workspace">
    <header className="workspace-global-header">
      <div className="workspace-brand"><Icon name="menu" size="1.5rem"/><img src={isDark?'./public/uploads/shell-brand.svg':'./public/uploads/shell-brand-light.svg'} width="144" height="24" alt="iMaster NCE"/></div>
      <div className="workspace-account-tools"><span className="workspace-mode">智驾模式<Icon name="chevron-down" size="0.875rem"/></span>
        <Icon name="search" size="1.25rem"/><Icon name="circle-question-mark" size="1.25rem"/>
        <button type="button" className="workspace-theme-toggle" role="switch" aria-checked={isDark} aria-label="深色主题" title={isDark?'切换为浅色主题':'切换为深色主题'} onClick={toggleTheme}>
          <Icon name={isDark?'moon':'sun'} size="1.25rem"/>
        </button>
        <span className="workspace-account"><Icon name="user-round" size="1.25rem"/>Admin</span>
      </div>
    </header>
    <aside className="workspace-navigation" aria-label="主导航">
      <img className="workspace-assistant-mark" src="./public/uploads/nav-assistant.svg" width="24" height="24" alt="Aico"/>
      <Menu mode="inline" inlineCollapsed selectedKeys={['chat']} items={navigation} onClick={showReport}/>
      <span className="workspace-navigation-footer"><Icon name="panel-left-close" size="1rem"/></span>
    </aside>
    <ReportConversation onShowReport={showReport}/>
    <section className="workspace-report" aria-label="报告工作区">
      <header className="workspace-report-tabs"><Tabs type="line" size="middle" activeKey="report" items={[
        {key:'rules',label:'规则管理',disabled:true},
        {key:'report',label:'检查报告'},
        {key:'baseline',label:'黄金基线',disabled:true},
      ]}/></header>
      <div className="workspace-report-scroll" id="report-scroll">
        <ReportChartThemeProvider workspaceRef={workspaceRef}><ReportPage/></ReportChartThemeProvider>
      </div>
    </section>
  </div>;
}

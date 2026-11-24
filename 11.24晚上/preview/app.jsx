// 保留原工作台架构，仅实现当前报告与静态对话呈现。
import {ConfigProvider,Empty} from 'antd';
import zhCN from './assets/shared/antd-zh.js';
import ReportWorkspace from './src/views/report-workspace/index.jsx';
import {AppProvider,useApp} from './src/context.jsx';
import './app.css';

const componentTheme = {
  components: {
    Menu: {collapsedWidth:48, collapsedIconSize:16, itemHeight:48, itemMarginInline:0},
    // Drawer 的原生关闭键随 html.dark 使用同一组 ICT 前景色。
    Drawer: {colorIcon:'var(--on-surface-variant)', colorIconHover:'var(--on-surface)'},
  },
};

function AppSurface() {
 const {isDark}=useApp();
 return <ConfigProvider locale={zhCN} wave={{disabled:true}}
   empty={{image:isDark?'./assets/uploads/no-data.svg':'./assets/uploads/empty.svg',imageStyle:{height:72}}}
   renderEmpty={()=><Empty/>} theme={componentTheme}><ReportWorkspace/></ConfigProvider>;
}

export default function App() {
 return <AppProvider><AppSurface/></AppProvider>;
}

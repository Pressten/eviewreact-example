// App entry — ICT React page
// 保留原工作台架构，仅实现当前报告与静态对话呈现。
// ConfigProvider 用法与 skill 样板一致（zhCN locale + 全局 Empty/Spin 配置），
// antd 组件皮肤统一在 public/style/ant.css，theme 保持默认 light 算法。
import {ConfigProvider,Empty} from 'antd';
import zhCN from './public/shared/antd-zh.js';
import ReportWorkspace from './src/views/report-workspace/index.jsx';
import {AppProvider} from './src/context.jsx';
import './app.css';

export default function App() {
  return <AppProvider>
    <ConfigProvider locale={zhCN} wave={{disabled:true}}
      renderEmpty={()=><Empty style={{padding:'2rem 0'}}/>}
      empty={{image:'./public/uploads/empty.svg'}}
      spin={{indicator:<img src='./public/uploads/loading.svg' alt='' className='custom-spin-indicator'/>}}>
      <ReportWorkspace/>
    </ConfigProvider>
  </AppProvider>;
}

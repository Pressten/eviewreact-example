import {useEffect} from 'react';
import ReportWorkspace from './views/report-workspace/index.jsx';
import {AppProvider,useApp} from './context.jsx';
import './app.css';

function AppSurface() {
  const {isDark}=useApp();
  // context.jsx 的 useLayoutEffect 已切 html.dark 并持久化 localStorage；这里同步 body 的 aui3_1_dark 轨。
  useEffect(() => {
    document.body.classList.toggle('aui3_1_dark', isDark);
  }, [isDark]);
  return <ReportWorkspace/>;
}

export default function App() {
  return <AppProvider><AppSurface/></AppProvider>;
}

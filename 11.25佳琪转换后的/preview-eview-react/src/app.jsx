import {useEffect} from 'react';
import ReportWorkspace from './views/report-workspace/index.jsx';
import {AppProvider, useApp} from './context.jsx';
import './app.css';

function AppInner() {
  const {isDark} = useApp();
  useEffect(() => {
    document.body.classList.toggle('aui3_1_dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  return <ReportWorkspace/>;
}

export default function App() {
  return <AppProvider><AppInner/></AppProvider>;
}

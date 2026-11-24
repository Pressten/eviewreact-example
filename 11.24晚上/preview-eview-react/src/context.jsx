import {createContext,useContext,useEffect,useLayoutEffect,useState} from 'react';

const ThemeContext=createContext(null);
const ReportChartThemeContext=createContext(null);
const themeStorageKey='fabric.icbc-config-report.theme.v1';

export function AppProvider({children}) {
  const [isDark,setIsDark]=useState(()=>{
    const requested=new URLSearchParams(window.location.search).get('theme');
    if(requested==='dark'||requested==='light')return requested==='dark';
    try{const saved=localStorage.getItem(themeStorageKey);return saved===null?true:saved==='dark';}catch{return true;}
  });
  useLayoutEffect(()=>{
    document.documentElement.classList.toggle('dark',isDark);
    try{localStorage.setItem(themeStorageKey,isDark?'dark':'light');}catch{}
  },[isDark]);
  return <ThemeContext.Provider value={{isDark,toggleTheme:()=>setIsDark(value=>!value)}}>{children}</ThemeContext.Provider>;
}

export function useApp(){return useContext(ThemeContext);}

export function ReportChartThemeProvider({workspaceRef, children}) {
  const {isDark} = useApp();
  const [palette, setPalette] = useState(null);
  useEffect(() => {
    // 主题 class 更新后集中解析工作台 Token，所有 ECharts 实例共用同一份颜色。
    const style = getComputedStyle(workspaceRef.current);
    const read = token => style.getPropertyValue(token).trim();
    const success = read('--success');
    setPalette({
      gauge: {
        start: read('--report-gauge-arc-start'),
        end: read('--report-gauge-arc-end'),
        track: read('--report-gauge-track'),
      },
      ratio: {active: success, track: read('--report-ratio-track')},
      threshold: {
        track: read('--outline-variant'),
        safe: success,
        actual: read('--error'),
        label: read('--color-text-secondary'),
        font: read('--font-size-sm') + ' ' + read('--font-family'),
      },
    });
  }, [isDark, workspaceRef]);
  return <ReportChartThemeContext.Provider value={palette}>{children}</ReportChartThemeContext.Provider>;
}

export function useReportChartTheme(){return useContext(ReportChartThemeContext);}

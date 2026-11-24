import {createContext,useContext,useLayoutEffect,useState} from 'react';

const ThemeContext=createContext(null);
const themeStorageKey='fabric.icbc-config-report.theme.v1';

export function AppProvider({children}) {
  const [isDark,setIsDark]=useState(()=>{
    const requested=new URLSearchParams(window.location.search).get('theme');
    if(requested==='dark'||requested==='light')return requested==='dark';
    try{const saved=localStorage.getItem(themeStorageKey);return saved===null?true:saved==='dark';}catch{return true;}
  });
  useLayoutEffect(()=>{
    document.documentElement.classList.toggle('dark',isDark);
    document.body.classList.toggle('aui3_1_dark',isDark);
    try{localStorage.setItem(themeStorageKey,isDark?'dark':'light');}catch{}
  },[isDark]);
  return <ThemeContext.Provider value={{isDark,toggleTheme:()=>setIsDark(value=>!value)}}>{children}</ThemeContext.Provider>;
}

export function useApp(){return useContext(ThemeContext);}

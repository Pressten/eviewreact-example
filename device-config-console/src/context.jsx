import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式、界面语言与布局折叠
// 换肤双轨驱动:eview-react 组件跟随 .aui3_1_dark,手写元素跟随 .dark(原始 token 暗色覆盖)。
// 两个类名都挂在 <html> 上(与 .aui3_1 同元素),保证弹窗/下拉等 portal 也能跟随主题。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("zh");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("aui3_1_dark", isDark);
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
  }, [lang]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    lang,
    setLang,
    collapsed,
    toggleCollapsed: () => setCollapsed((c) => !c),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

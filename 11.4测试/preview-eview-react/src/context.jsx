import { useState, createContext, useContext } from "react";

// Layer 1: 全局状态 — 主题模式与业务状态
// isDark 状态在此持有；双轨类名切换（body.aui3_1_dark + html.dark）由 app.jsx 的 AppShell useEffect 驱动。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

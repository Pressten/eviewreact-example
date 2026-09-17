import { useState, useEffect, createContext, useContext } from "react";

// Layer 1: 全局状态 — dark 模式双轨同步(eview aui3_1_dark + .dark token class)
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

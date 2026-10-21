import { useState, useEffect, createContext, useContext } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    currentStep,
    setCurrentStep,
    goNext: () => setCurrentStep((s) => Math.min(s + 1, 4)),
    goPrev: () => setCurrentStep((s) => Math.max(s - 1, 1)),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

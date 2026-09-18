import { useState, useEffect, createContext, useContext } from 'react';

// 全局状态：暗色模式。
// eview-react 用类名切换代替 antd 的 theme.darkAlgorithm：
//   aui3_1_dark 挂 <body>（eview-react 组件暗色，aui3_1 已在 index.html 常驻）
//   .dark 挂 <html>（原始 token 暗色覆盖，见 theme-dark.css）
const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('aui3_1_dark', isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const value = {
        isDark,
        toggleDark: () => setIsDark((d) => !d),
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    return useContext(AppContext);
}

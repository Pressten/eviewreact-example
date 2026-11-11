import { useEffect } from 'react';
// 子路径默认导入（skill 导入规范——根包具名导入会被 check-imports.cjs 的 EVUI_ROOT_IMPORT 拦截）
import ConfigProvider from '@cloudsop/eview-ui/ConfigProvider';
import { useApp } from '../context.jsx';

// ThemeProvider：黑白主题接线层（双轨唯一驱动点，步骤 3 勿改）。
// isDark 不自持 state，消费 context.jsx 的 AppProvider（useApp().isDark）。
// 暗色双轨（实测，无需 listenTheme / body 类轨）：
//   - html .dark 轨：本文件 useEffect 切换 class，驱动 dark.css 自定义 token 四层覆盖；
//   - ConfigProvider theme 轨：eview-ui 组件库内部切换（version="aui3-1"，
//     theme="evening"/"lightday"），与 IntlProvider 无关。
// 业务侧统一用 useApp() 取 isDark / toggleDark。
export const ThemeProvider = ({ children }) => {
    const { isDark } = useApp();

    // html.dark 驱动 dark.css 自定义 token 覆盖
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    return (
        <ConfigProvider locale="zh" version="aui3-1" theme={isDark ? 'evening' : 'lightday'}>
            {children}
        </ConfigProvider>
    );
};

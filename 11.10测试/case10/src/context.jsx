import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { getApisForVersion } from "./mock/api-registry.js";

// Layer 1: 全局状态 — 主题模式 + 文档业务状态（版本 / 选中接口 / Drawer / 公告 / 筛选 / 滚动联动）
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  // 文档版本（v1 存档 / v2 稳定 / v3 预览）
  const [version, setVersionState] = useState("v2");
  // 当前选中的接口（目录树高亮 + 列表行高亮 + 详情 Drawer 数据源）
  const [selectedApiId, setSelectedApiId] = useState(null);
  // 接口详情 Drawer 开关
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 版本更新公告 Modal（首访自动弹出一次）
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  // 接口列表的方法筛选（ALL / GET / POST / PUT / DELETE）
  const [methodFilter, setMethodFilter] = useState("ALL");
  // 接口列表关键词（顶栏全局搜索与列表共用）
  const [apiKeyword, setApiKeyword] = useState("");
  // 目录树点击接口后的「定位到列表」一次性信号
  const [focusApiId, setFocusApiId] = useState(null);
  // 正文滚动联动（scroll spy）当前所在章节
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // 当前版本下可用的接口集合
  const versionApis = useMemo(() => getApisForVersion(version), [version]);

  // 当前选中的接口对象（版本切换后自动失效）
  const selectedApi = useMemo(
    () => versionApis.find((item) => item.apiId === selectedApiId) || null,
    [versionApis, selectedApiId]
  );

  // 版本切换：清除定位信号；选中接口在新版本不存在时置空
  const changeVersion = (next) => {
    if (!getApisForVersion(next).some((item) => item.apiId === selectedApiId)) {
      setSelectedApiId(null);
    }
    setFocusApiId(null);
    setVersionState(next);
  };

  // 目录树点击接口：重置筛选并请求列表定位（翻页 + 滚动）
  const requestFocusApi = (apiId) => {
    setMethodFilter("ALL");
    setApiKeyword("");
    setFocusApiId(apiId);
  };

  // 打开接口详情 Drawer（列表名称 / 行内调试按钮触发）
  const openApiDrawer = (apiId) => {
    setSelectedApiId(apiId);
    setDrawerOpen(true);
  };

  const closeApiDrawer = () => {
    setDrawerOpen(false);
  };

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    version,
    changeVersion,
    versionApis,
    selectedApiId,
    setSelectedApiId,
    selectedApi,
    requestFocusApi,
    focusApiId,
    clearFocusApi: () => setFocusApiId(null),
    methodFilter,
    setMethodFilter,
    apiKeyword,
    setApiKeyword,
    activeSection,
    setActiveSection,
    drawerOpen,
    openApiDrawer,
    closeApiDrawer,
    announcementOpen,
    setAnnouncementOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

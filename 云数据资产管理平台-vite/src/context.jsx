import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { INITIAL_DATASOURCES } from "./mock/datasource.js";

// Layer 1: 全局状态 — 主题模式、导航折叠、当前菜单与数据源列表
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随,无需 React 参与换肤。
const AppContext = createContext(null);

const EMPTY_FILTERS = { keyword: "", type: undefined, status: undefined, dept: undefined, range: null };

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("datasource");
  const [list, setList] = useState(INITIAL_DATASOURCES);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [editor, setEditor] = useState({ open: false, mode: "create", record: null });
  const [removing, setRemoving] = useState({ open: false, ids: [] });
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const upsertRecord = useCallback((record) => {
    setList((prev) => {
      const hit = prev.some((item) => item.id === record.id);
      if (hit) {
        return prev.map((item) => (item.id === record.id ? { ...item, ...record } : item));
      }
      return [record, ...prev];
    });
  }, []);

  const removeRecords = useCallback((ids) => {
    setList((prev) => prev.filter((item) => !ids.includes(item.id)));
  }, []);

  const setStatuses = useCallback((ids, status) => {
    setList((prev) =>
      prev.map((item) => (ids.includes(item.id) ? { ...item, status, updatedAt: stamp() } : item))
    );
  }, []);

  const switchStatus = useCallback((id) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "offline" ? "online" : "offline",
              updatedAt: stamp(),
            }
          : item
      )
    );
  }, []);

  const value = {
    isDark,
    toggleDark: () => setIsDark((d) => !d),
    collapsed,
    toggleCollapsed: () => setCollapsed((c) => !c),
    setCollapsed,
    activeNav,
    setActiveNav,
    list,
    upsertRecord,
    removeRecords,
    switchStatus,
    setStatuses,
    nextId: buildId(list),
    filters,
    applyFilters: (next) => setFilters(next),
    resetFilters: () => setFilters(EMPTY_FILTERS),
    emptyFilters: EMPTY_FILTERS,
    editor,
    openEditor: (mode, record) => setEditor({ open: true, mode, record: record || null }),
    closeEditor: () => setEditor((s) => ({ ...s, open: false })),
    removing,
    openRemoving: (ids) => setRemoving({ open: true, ids }),
    closeRemoving: () => setRemoving((s) => ({ ...s, open: false })),
    notice,
    notify: (type, text) => setNotice({ type, text, key: Date.now() }),
    clearNotice: () => setNotice(null),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function buildId(list) {
  const year = new Date().getFullYear();
  let max = 0;
  list.forEach((item) => {
    const num = Number(String(item.id).split("-").pop());
    if (!Number.isNaN(num) && num > max) max = num;
  });
  return `DS-${year}-${String(max + 1).padStart(4, "0")}`;
}

export function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function useApp() {
  return useContext(AppContext);
}

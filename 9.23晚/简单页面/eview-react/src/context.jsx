// Layer 1: 全局状态 — 主题模式 + 指标域业务状态（列表 / 筛选 / 选择 / 编辑器）+ 轻提示
// 换肤双轨驱动：isDark 同时切换 <body> 的 aui3_1/aui3_1_dark（eview-react 组件）与
// <html> 的 .dark（原始 token 暗色覆盖）。
import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react";
import dayjs from "dayjs";
import { INITIAL_METRICS, decorateMetric, nowStamp, nextMetricId } from "./data.js";

const AppContext = createContext(null);

const EMPTY_FILTERS = {
  keyword: "",
  category: undefined,
  cycle: undefined,
  status: undefined,
  dimension: undefined,
  source: undefined,
  owner: undefined,
  unit: undefined,
};

function matchMetric(metric, filters) {
  const keyword = (filters.keyword || "").trim().toLowerCase();
  if (keyword) {
    const haystack = (metric.name + " " + metric.code + " " + metric.owner).toLowerCase();
    if (haystack.indexOf(keyword) === -1) return false;
  }
  const keys = ["category", "cycle", "status", "dimension", "source", "owner", "unit"];
  return keys.every((key) => !filters[key] || metric[key] === filters[key]);
}

function toEffectiveDate(value) {
  if (!value) return "";
  if (value instanceof Date) return dayjs(value).format("YYYY-MM-DD");
  if (typeof value === "string") return value;
  if (value && typeof value.format === "function") return value.format("YYYY-MM-DD");
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}

function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editor, setEditor] = useState({ open: false, mode: "create", record: null });
  const [toast, setToast] = useState(null);

  // draftRef 始终持有最新 draft，避免 applyFilters 闭包读到过期 state
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const toastTimer = useRef(null);

  useEffect(() => {
    // aui3_1 已在 index.html 的 <body> 上常驻；暗色叠加 aui3_1_dark
    document.body.classList.toggle("aui3_1_dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const filteredMetrics = useMemo(
    () => metrics.filter((metric) => matchMetric(metric, filters)),
    [metrics, filters]
  );

  const activeFilterCount = useMemo(
    () => Object.keys(EMPTY_FILTERS).filter((key) => Boolean(filters[key])).length,
    [filters]
  );

  const updateDraft = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  // patch 可在调用瞬间覆盖个别字段（如头部搜索框 onSearch 直接带 keyword），避免 setState 异步导致的过期值
  const applyFilters = (patch) => setFilters({ ...draftRef.current, ...(patch || {}) });
  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
  };

  const notify = (msg) => {
    setToast({ key: Date.now(), msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => setEditor({ open: true, mode: "create", record: null });
  const openEdit = (record) => setEditor({ open: true, mode: "edit", record });
  const closeEditor = () => setEditor({ open: false, mode: "create", record: null });

  const saveMetric = (values) => {
    const stamp = nowStamp();
    const effectiveAt = toEffectiveDate(values.effectiveAt);
    setMetrics((list) => {
      const payload = { ...values, effectiveAt, updatedAt: stamp };
      if (editor.mode === "edit" && editor.record) {
        return list.map((metric) =>
          metric.id === editor.record.id ? decorateMetric({ ...metric, ...payload }) : metric
        );
      }
      const created = decorateMetric({
        ...payload,
        id: nextMetricId(list),
        current: 0,
        trend: 0,
        description: values.description || "",
      });
      return [created, ...list];
    });
    closeEditor();
  };

  const duplicateMetric = (id) => {
    setMetrics((list) => {
      const source = list.find((metric) => metric.id === id);
      if (!source) return list;
      const copy = decorateMetric({
        ...source,
        id: nextMetricId(list),
        name: source.name + "（副本）",
        status: "draft",
        updatedAt: nowStamp(),
      });
      return [copy, ...list];
    });
  };

  const updateStatus = (ids, status) => {
    setMetrics((list) =>
      list.map((metric) =>
        ids.indexOf(metric.id) !== -1
          ? { ...metric, status, updatedAt: nowStamp() }
          : metric
      )
    );
    setSelectedRowKeys((keys) => keys.filter((key) => ids.indexOf(key) === -1));
  };

  const removeMetric = (id) => {
    setMetrics((list) => list.filter((metric) => metric.id !== id));
    setSelectedRowKeys((keys) => keys.filter((key) => key !== id));
  };

  const value = {
    isDark,
    toggleDark: () => setIsDark((dark) => !dark),
    metrics,
    filteredMetrics,
    draft,
    filters,
    activeFilterCount,
    updateDraft,
    applyFilters,
    resetFilters,
    selectedRowKeys,
    setSelectedRowKeys,
    editor,
    openCreate,
    openEdit,
    closeEditor,
    saveMetric,
    duplicateMetric,
    updateStatus,
    removeMetric,
    notify,
    toast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  return useContext(AppContext);
}

export { AppProvider, useApp };

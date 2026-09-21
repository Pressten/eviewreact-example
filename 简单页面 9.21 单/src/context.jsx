import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_METRICS, decorate, nowStamp, nextMetricId } from './mock/metrics.js';

// Layer 1: 全局状态 — 主题模式 + 指标域业务状态（列表 / 筛选 / 选择 / 编辑器）+ 操作反馈
// 换肤单轨驱动：isDark 在 <html> 上同时挂 aui3_1 / aui3_1_dark / dark，
// eview 组件（aui3_1 主题）与页面自有布局类（.dark）同源跟随，无需 React 参与换肤。

const AppContext = createContext(null);

const EMPTY_FILTERS = {
  keyword: '',
  category: undefined,
  cycle: undefined,
  status: undefined,
  dimension: undefined,
  source: undefined,
  owner: undefined,
  unit: undefined,
};

function matchMetric(metric, filters) {
  const keyword = (filters.keyword || '').trim().toLowerCase();
  if (keyword) {
    const haystack = (metric.name + ' ' + metric.code + ' ' + metric.owner).toLowerCase();
    if (haystack.indexOf(keyword) === -1) return false;
  }
  const keys = ['category', 'cycle', 'status', 'dimension', 'source', 'owner', 'unit'];
  return keys.every((key) => !filters[key] || metric[key] === filters[key]);
}

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editor, setEditor] = useState({ open: false, mode: 'create', record: null });
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    // aui3_1_dark 挂 <body>（与 index.html body 上的 aui3_1 基类叠加深色样式）；
    // 页面自有 .dark 挂 <html>（驱动页面 token 深色覆盖）。
    root.classList.toggle('dark', isDark);
    document.body.classList.toggle('aui3_1_dark', isDark);
  }, [isDark]);

  const filteredMetrics = useMemo(
    () => metrics.filter((metric) => matchMetric(metric, filters)),
    [metrics, filters],
  );

  const activeFilterCount = useMemo(
    () => Object.keys(EMPTY_FILTERS).filter((key) => Boolean(filters[key])).length,
    [filters],
  );

  const updateDraft = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const applyFilters = () => setFilters(draft);
  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
  };

  // 操作反馈（替代 antd message.success / Modal.confirm 后的结果提示）
  const notify = (type, text, title) => setNotice({ key: Date.now(), type, text, title });
  const clearNotice = () => setNotice(null);

  const openCreate = () => setEditor({ open: true, mode: 'create', record: null });
  const openEdit = (record) => setEditor({ open: true, mode: 'edit', record });
  const closeEditor = () => setEditor({ open: false, mode: 'create', record: null });

  const saveMetric = (values) => {
    const stamp = nowStamp();
    const eff = values.effectiveAt;
    const effectiveAt = eff instanceof Date
      ? formatYMD(eff)
      : (typeof eff === 'string' && eff ? eff : '');
    setMetrics((list) => {
      const payload = { ...values, effectiveAt, updatedAt: stamp };
      if (editor.mode === 'edit' && editor.record) {
        return list.map((metric) =>
          metric.id === editor.record.id ? decorate({ ...metric, ...payload }) : metric,
        );
      }
      const created = decorate({
        ...payload,
        id: nextMetricId(list),
        current: 0,
        trend: 0,
        description: values.description || '',
      });
      return [created, ...list];
    });
    closeEditor();
  };

  const duplicateMetric = (id) => {
    setMetrics((list) => {
      const source = list.find((metric) => metric.id === id);
      if (!source) return list;
      const copy = decorate({
        ...source,
        id: nextMetricId(list),
        name: source.name + '（副本）',
        status: 'draft',
        updatedAt: nowStamp(),
      });
      return [copy, ...list];
    });
  };

  const updateStatus = (ids, status) => {
    setMetrics((list) =>
      list.map((metric) =>
        ids.indexOf(metric.id) !== -1 ? { ...metric, status, updatedAt: nowStamp() } : metric,
      ),
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
    notice,
    notify,
    clearNotice,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

function formatYMD(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

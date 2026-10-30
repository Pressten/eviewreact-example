import { useState, useEffect, useReducer, createContext, useContext, useMemo } from "react";
import dayjs from "dayjs";
import {
  INITIAL_PAGES,
  INITIAL_RECORDS,
  INITIAL_VERSION,
  INITIAL_ACTIVITY,
  createFloor,
} from "./mock/decoration.jsx";
import { findMaterial } from "./mock/material.js";
import { IconPlusIcDigitalPowerDpArrowMoveUp, IconPlusIcDigitalPowerDpToTop, IconPlusIcIctBulkEdit, IconPlusIcIctReverses, IconPlusIcIctSwitch, IconPlusIcPublicAlarmClock, IconPlusIcPublicCopy, IconPlusIcPublicImage, IconPlusIcPublicPlus, IconPlusIcPublicTrash, IconPlusIcPublicUpload } from '@hui/icon-plus';

// ══════════════════════════════════════════════════
// Layer 1a: 主题换肤（scaffold 保留）
// 换肤单轨驱动:isDark 只切换 <html> 的 .dark class;
// 普通 H5 元素(token 四层)与 antd 组件(ant.css 换肤层)同源跟随。
// ══════════════════════════════════════════════════
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("aui3_1_dark", isDark);
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

// ══════════════════════════════════════════════════
// Layer 1b: 装修业务全局状态
// 页面页签 / 楼层增删改排 / 批量启停 / 选中(素材替换目标) /
// 编辑弹窗 / 发布与回滚 / 操作动态日志（右侧冲刺工作台消费）
// ══════════════════════════════════════════════════
const DecoContext = createContext(null);

// 排序号连续重排：1..n，永不断档
function renumber(floors) {
  return floors.map((f, i) => ({ ...f, sort: i + 1 }));
}

function pageKeyOfFloor(pages, floorId) {
  return Object.keys(pages).find((k) => pages[k].floors.some((f) => f.id === floorId));
}

function bumpVersion(version) {
  const nums = version.replace("V", "").split(".").map(Number);
  return `V${nums[0]}.${nums[1] + 1}.0`;
}

function makeRecord(extra) {
  return {
    id: `rec-${Date.now()}`,
    operator: "李婉晴",
    time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    ...extra,
  };
}

// 通用：在楼层所在页应用 floorsMutator，并递增该页草稿数
function patchPageOfFloor(state, floorId, floorsMutator) {
  const pageKey = pageKeyOfFloor(state.pages, floorId);
  if (!pageKey) return state;
  const page = state.pages[pageKey];
  const floors = renumber(floorsMutator(page.floors));
  return {
    ...state,
    pages: {
      ...state.pages,
      [pageKey]: { ...page, floors, draftCount: page.draftCount + 1 },
    },
    syncAt: Date.now(),
  };
}

function decorationReducer(state, action) {
  switch (action.type) {
    // ② 页签切换 → 表格与预览联动
    case "SET_PAGE":
      return { ...state, activePageKey: action.pageKey };

    // ⑥ 点击表格行 → 设为素材替换目标 + 预览定位
    case "SELECT_FLOOR":
      return { ...state, selectedFloorId: action.floorId };

    // 悬浮联动：表格行 ↔ 楼层结构画布 双向高亮（不产生草稿与操作动态）
    case "HOVER_FLOOR":
      return { ...state, hoveredFloorId: action.floorId ?? null };

    // ③ 编辑组件配置 Modal
    case "OPEN_EDIT":
      return { ...state, editingFloorId: action.floorId, selectedFloorId: action.floorId };
    case "CLOSE_EDIT":
      return { ...state, editingFloorId: null };

    // ④ 添加组件 → 新行插入表格顶部并高亮
    case "ADD_FLOOR": {
      const page = state.pages[state.activePageKey];
      const floor = createFloor(action.typeKey, state.addCounter + 1);
      return {
        ...state,
        addCounter: state.addCounter + 1,
        pages: {
          ...state.pages,
          [page.key]: {
            ...page,
            floors: renumber([floor, ...page.floors]),
            draftCount: page.draftCount + 1,
          },
        },
        highlightFloorId: floor.id,
        selectedFloorId: floor.id,
        syncAt: Date.now(),
      };
    }

    // ③ 上移 / 下移 → 即时生效，预览顺序同步
    case "MOVE_FLOOR": {
      const page = state.pages[state.activePageKey];
      const idx = page.floors.findIndex((f) => f.id === action.floorId);
      const target = idx + action.dir;
      if (idx < 0 || target < 0 || target >= page.floors.length) return state;
      const floors = [...page.floors];
      const [moved] = floors.splice(idx, 1);
      floors.splice(target, 0, moved);
      return {
        ...state,
        pages: {
          ...state.pages,
          [page.key]: { ...page, floors: renumber(floors), draftCount: page.draftCount + 1 },
        },
        syncAt: Date.now(),
      };
    }

    // 更多下拉：置顶
    case "TOP_FLOOR":
      return patchPageOfFloor(state, action.floorId, (floors) => {
        const idx = floors.findIndex((f) => f.id === action.floorId);
        if (idx <= 0) return floors;
        const next = [...floors];
        const [moved] = next.splice(idx, 1);
        next.unshift(moved);
        return next;
      });

    // 更多下拉：复制组件（插入到自身之后）
    case "COPY_FLOOR":
      return patchPageOfFloor(state, action.floorId, (floors) => {
        const idx = floors.findIndex((f) => f.id === action.floorId);
        if (idx < 0) return floors;
        const source = floors[idx];
        const copy = {
          ...source,
          id: `f-copy-${Date.now()}`,
          name: `${source.name} 副本`,
          uvShare: 0,
          config: { ...source.config },
        };
        const next = [...floors];
        next.splice(idx + 1, 0, copy);
        return next;
      });

    // ③ 启停切换 → 预览显隐
    case "TOGGLE_FLOOR":
      return patchPageOfFloor(state, action.floorId, (floors) =>
        floors.map((f) => (f.id === action.floorId ? { ...f, status: !f.status } : f))
      );

    // ③ 批量启用 / 停用（预览同步显隐）
    case "BATCH_TOGGLE": {
      const ids = new Set(action.floorIds);
      const page = state.pages[state.activePageKey];
      const floors = renumber(
        page.floors.map((f) => (ids.has(f.id) ? { ...f, status: action.status } : f))
      );
      return {
        ...state,
        pages: {
          ...state.pages,
          [page.key]: { ...page, floors, draftCount: page.draftCount + 1 },
        },
        syncAt: Date.now(),
      };
    }

    // ③ 删除（单个）
    case "DELETE_FLOOR":
      return patchPageOfFloor(state, action.floorId, (floors) => floors.filter((f) => f.id !== action.floorId));

    // ③ 批量删除
    case "BATCH_DELETE": {
      const ids = new Set(action.floorIds);
      const page = state.pages[state.activePageKey];
      const floors = renumber(page.floors.filter((f) => !ids.has(f.id)));
      const selectedStillHere = floors.some((f) => f.id === state.selectedFloorId);
      return {
        ...state,
        pages: {
          ...state.pages,
          [page.key]: { ...page, floors, draftCount: page.draftCount + 1 },
        },
        selectedFloorId: selectedStillHere ? state.selectedFloorId : floors[0] ? floors[0].id : null,
        syncAt: Date.now(),
      };
    }

    // ③ 编辑保存（内容 + 样式）
    case "UPDATE_FLOOR":
      return patchPageOfFloor(state, action.floorId, (floors) =>
        floors.map((f) =>
          f.id === action.floorId
            ? { ...f, name: action.patch.name, config: { ...f.config, ...action.patch.config } }
            : f
        )
      );

    // ⑥ 替换素材 → 预览图更新
    case "REPLACE_IMAGE":
      return patchPageOfFloor(state, action.floorId, (floors) =>
        floors.map((f) => {
          if (f.id !== action.floorId) return f;
          const config = { ...f.config };
          if (Array.isArray(config.imageIds)) {
            config.imageIds = [action.materialId, ...config.imageIds.slice(1)];
          } else {
            config.imageId = action.materialId;
          }
          return { ...f, config };
        })
      );

    // ③ 定时发布：设置/修改/取消楼层的定时上线时间（到点自动上线）
    case "SET_SCHEDULE":
      return patchPageOfFloor(state, action.floorId, (floors) =>
        floors.map((f) => (f.id === action.floorId ? { ...f, scheduledAt: action.scheduledAt } : f))
      );

    // 发布：清空全部草稿角标，新增发布记录（版本号递增）
    case "PUBLISH": {
      const version = bumpVersion(state.currentVersion);
      const record = makeRecord({ version, note: action.note, isCurrent: true });
      const pages = {};
      Object.keys(state.pages).forEach((k) => {
        pages[k] = { ...state.pages[k], draftCount: 0 };
      });
      return {
        ...state,
        pages,
        currentVersion: version,
        publishRecords: [record, ...state.publishRecords.map((r) => ({ ...r, isCurrent: false }))],
        syncAt: Date.now(),
      };
    }

    // ⑧ 回滚：未发布更改丢弃，恢复目标版本并记录
    case "ROLLBACK": {
      const record = makeRecord({
        version: action.version,
        note: `回滚至 ${action.version}：恢复该版本发布时的装修配置。`,
        isCurrent: true,
      });
      const pages = {};
      Object.keys(state.pages).forEach((k) => {
        pages[k] = { ...state.pages[k], draftCount: 0 };
      });
      return {
        ...state,
        pages,
        currentVersion: action.version,
        publishRecords: [record, ...state.publishRecords.map((r) => ({ ...r, isCurrent: false }))],
        syncAt: Date.now(),
      };
    }

    default:
      return state;
  }
}

// ── 操作动态：将每次有效变更转写为人类可读的动态条目 ──
const ACTIVITY_ICONS = {
  ADD_FLOOR: <IconPlusIcPublicPlus iconSize="0.75rem" iconColor={['currentcolor']} />,
  MOVE_FLOOR: <IconPlusIcDigitalPowerDpArrowMoveUp iconSize="0.75rem" iconColor={['currentcolor']} />,
  TOP_FLOOR: <IconPlusIcDigitalPowerDpToTop iconSize="0.75rem" iconColor={['currentcolor']} />,
  COPY_FLOOR: <IconPlusIcPublicCopy iconSize="0.75rem" iconColor={['currentcolor']} />,
  TOGGLE_FLOOR: <IconPlusIcIctSwitch iconSize="0.75rem" iconColor={['currentcolor']} />,
  DELETE_FLOOR: <IconPlusIcPublicTrash iconSize="0.75rem" iconColor={['currentcolor']} />,
  BATCH_DELETE: <IconPlusIcPublicTrash iconSize="0.75rem" iconColor={['currentcolor']} />,
  BATCH_TOGGLE: <IconPlusIcIctSwitch iconSize="0.75rem" iconColor={['currentcolor']} />,
  UPDATE_FLOOR: <IconPlusIcIctBulkEdit iconSize="0.75rem" iconColor={['currentcolor']} />,
  REPLACE_IMAGE: <IconPlusIcPublicImage iconSize="0.75rem" iconColor={['currentcolor']} />,
  SET_SCHEDULE: <IconPlusIcPublicAlarmClock iconSize="0.75rem" iconColor={['currentcolor']} />,
  PUBLISH: <IconPlusIcPublicUpload iconSize="0.75rem" iconColor={['currentcolor']} />,
  ROLLBACK: <IconPlusIcIctReverses iconSize="0.75rem" iconColor={['currentcolor']} />,
};

function floorIn(state, floorId) {
  for (const page of Object.values(state.pages)) {
    const floor = page.floors.find((f) => f.id === floorId);
    if (floor) return { floor, pageTitle: page.title };
  }
  return {};
}

function buildActivity(action, prev, next) {
  const icon = ACTIVITY_ICONS[action.type];
  if (!icon) return null;
  let text = "";
  switch (action.type) {
    case "ADD_FLOOR": {
      const page = prev.pages[prev.activePageKey];
      const first = next.pages[prev.activePageKey].floors[0];
      text = `在「${page.title}」顶部添加「${first.name}」`;
      break;
    }
    case "MOVE_FLOOR": {
      const before = floorIn(prev, action.floorId).floor;
      const after = floorIn(next, action.floorId).floor;
      if (before && after) text = `「${before.name}」楼层顺序调整（排序号 ${before.sort}→${after.sort}）`;
      break;
    }
    case "TOP_FLOOR": {
      const { floor, pageTitle } = floorIn(prev, action.floorId);
      if (floor) text = `「${floor.name}」在「${pageTitle}」置顶`;
      break;
    }
    case "COPY_FLOOR": {
      const { floor } = floorIn(prev, action.floorId);
      const copy = Object.values(next.pages)
        .flatMap((p) => p.floors)
        .find((f) => f.name === `${floor ? floor.name : ""} 副本`);
      if (floor && copy) text = `复制「${floor.name}」为「${copy.name}」`;
      break;
    }
    case "TOGGLE_FLOOR": {
      const after = floorIn(next, action.floorId).floor;
      if (after) text = `「${after.name}」已${after.status ? "启用" : "停用"}`;
      break;
    }
    case "DELETE_FLOOR": {
      const { floor, pageTitle } = floorIn(prev, action.floorId);
      if (floor) text = `删除「${pageTitle}」楼层「${floor.name}」`;
      break;
    }
    case "BATCH_DELETE":
      text = `批量删除「${prev.pages[prev.activePageKey].title}」${action.floorIds.length} 个组件`;
      break;
    case "BATCH_TOGGLE":
      text = `批量${action.status ? "启用" : "停用"}「${prev.pages[prev.activePageKey].title}」${action.floorIds.length} 个组件`;
      break;
    case "UPDATE_FLOOR": {
      const { floor } = floorIn(next, action.floorId);
      if (floor) text = `更新「${floor.name}」组件配置`;
      break;
    }
    case "REPLACE_IMAGE": {
      const { floor } = floorIn(next, action.floorId);
      const material = findMaterial(action.materialId);
      if (floor && material) text = `「${floor.name}」配图替换为「${material.name}」`;
      break;
    }
    case "SET_SCHEDULE": {
      const { floor } = floorIn(next, action.floorId);
      if (floor) {
        text = action.scheduledAt
          ? `「${floor.name}」定时 ${action.scheduledAt} 自动上线`
          : `取消「${floor.name}」定时发布`;
      }
      break;
    }
    case "PUBLISH":
      text = `发布版本 ${next.currentVersion}，全部页面生效`;
      break;
    case "ROLLBACK":
      text = `回滚至 ${next.currentVersion}，未发布更改已丢弃`;
      break;
    default:
      return null;
  }
  if (!text) return null;
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    icon,
    text,
    time: dayjs().format("HH:mm:ss"),
  };
}

// 包装 reducer：业务变更生效后自动追加操作动态（最多保留 12 条）
function decoratedReducer(state, action) {
  const next = decorationReducer(state, action);
  if (next === state) return state;
  const entry = buildActivity(action, state, next);
  if (!entry) return next;
  return { ...next, activity: [entry, ...(next.activity || [])].slice(0, 12) };
}

export function DecorationProvider({ children }) {
  const [state, dispatch] = useReducer(decoratedReducer, {
    activePageKey: "home",
    pages: INITIAL_PAGES,
    selectedFloorId: "f-h01",
    hoveredFloorId: null,
    editingFloorId: null,
    highlightFloorId: null,
    publishRecords: INITIAL_RECORDS,
    currentVersion: INITIAL_VERSION,
    addCounter: 0,
    syncAt: Date.now(),
    activity: INITIAL_ACTIVITY,
  });

  const value = useMemo(() => {
    const activePage = state.pages[state.activePageKey];
    const allFloors = Object.values(state.pages).flatMap((p) => p.floors);
    const findFloor = (id) => allFloors.find((f) => f.id === id) || null;
    return {
      state,
      dispatch,
      pages: state.pages,
      activePage,
      activePageFloors: activePage.floors,
      hasUnpublished: Object.values(state.pages).some((p) => p.draftCount > 0),
      totalDrafts: Object.values(state.pages).reduce((sum, p) => sum + p.draftCount, 0),
      selectedFloor: findFloor(state.selectedFloorId),
      editingFloor: findFloor(state.editingFloorId),
      findFloor,
      activity: state.activity || [],
    };
  }, [state]);

  return <DecoContext.Provider value={value}>{children}</DecoContext.Provider>;
}

export function useDecoration() {
  return useContext(DecoContext);
}

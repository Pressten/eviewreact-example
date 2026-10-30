// ③ 楼层组件表格 + ④ 添加组件面板
// 添加组件：下拉选择 12 种组件类型 → 新行插入表格顶部并高亮
// 表格：类型筛选 / 启停切换 / 排序 / UV 占比 / 定时发布 / 上移下移删除更多 / 分页
// 工具区：关键词搜索（名称过滤）+ 勾选批量启用/停用/删除
// 点击行 = 设为素材替换目标（与素材库联动）+ 预览定位联动
// 定时发布：选择日期时间，到点自动上线（说明见弹窗）
import { useEffect, useMemo, useState } from "react";
import { IconPlusIcCarLayers, IconPlusIcDigitalPowerDpArrowMoveUp, IconPlusIcDigitalPowerDpToTop, IconPlusIcIctBulkEdit, IconPlusIcPublicAlarmClock, IconPlusIcPublicChart, IconPlusIcPublicCopy, IconPlusIcPublicEllipsis, IconPlusIcPublicInfo, IconPlusIcPublicPlus, IconPlusIcPublicScopeDot, IconPlusIcPublicSearch, IconPlusIcPublicSortDown, IconPlusIcPublicSuccess, IconPlusIcPublicTrash } from '@hui/icon-plus';
import dayjs from "dayjs";
import Button from "@nce/eview-react/Button";
import Table from "@nce/eview-react/Table";
import Dialog from "@nce/eview-react/Dialog";
import MessageDialog from "@nce/eview-react/MessageDialog";
import Toggle from "@nce/eview-react/Toggle";
import TextField from "@/shared/TextField";
import Select from "@/shared/Select";
import InputSelect from "@/shared/InputSelect";
import DatePicker from "@/shared/DatePicker";
import Tag from "@/shared/Tag";
import AppDropdown from "@/shared/AppDropdown";
import { toast } from "@/shared/AppToast";
import { useDecoration } from "../../context.jsx";
import { COMPONENT_TYPES, findType } from "../../mock/decoration.jsx";
import "./index.css";

// 类型图标底色 tone 映射（语义化 token）
const TYPE_TONES = {
  carousel: "tone-info",
  seckill: "tone-error",
  recommend: "tone-success",
  imageText: "tone-purple",
  video: "tone-cyan",
  coupon: "tone-alert",
  searchBar: "tone-indigo",
  notice: "tone-warning",
  navGrid: "tone-mint",
  floatService: "tone-pink",
  countdownBanner: "tone-orange",
  memberRights: "tone-geekblue",
};

export default function FloorTable() {
  const { state, dispatch, activePage, activePageFloors, findFloor } = useDecoration();
  const [selectedType, setSelectedType] = useState("carousel");
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);
  const [scheduleFloorId, setScheduleFloorId] = useState(null);
  const [scheduleValue, setScheduleValue] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingBatch, setPendingBatch] = useState(null);

  // 切换页面页签时重置勾选、页码、搜索与类型筛选
  useEffect(() => {
    setCheckedIndexes([]);
    setPage(1);
    setKeyword("");
    setTypeFilter(null);
  }, [activePage.key]);

  // 关键词过滤（按组件名，不区分大小写）
  const filteredFloors = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return activePageFloors;
    return activePageFloors.filter((f) => f.name.toLowerCase().includes(kw));
  }, [activePageFloors, keyword]);

  // 勾选行序号 → 楼层 ID（eview Table 勾选回调给的是行序号，需按序号取数据）
  const selectedIds = checkedIndexes.map((i) => filteredFloors[i]?.id).filter(Boolean);

  const uvTotal = useMemo(
    () => activePageFloors.reduce((sum, f) => sum + (f.uvShare || 0), 0),
    [activePageFloors]
  );

  const schedulingFloor = findFloor(scheduleFloorId);

  const openSchedule = (record) => {
    setScheduleFloorId(record.id);
    setScheduleValue(record.scheduledAt ? new Date(record.scheduledAt) : null);
  };

  const closeSchedule = () => setScheduleFloorId(null);

  const handleConfirmSchedule = () => {
    if (!scheduleValue) {
      toast.warning("请选择定时上线时间");
      return;
    }
    const timeText = dayjs(scheduleValue).format("YYYY-MM-DD HH:mm");
    dispatch({ type: "SET_SCHEDULE", floorId: schedulingFloor.id, scheduledAt: timeText });
    closeSchedule();
    toast.success(`已设置「${schedulingFloor.name}」将于 ${timeText} 自动发布上线`);
  };

  const handleClearSchedule = () => {
    dispatch({ type: "SET_SCHEDULE", floorId: schedulingFloor.id, scheduledAt: null });
    closeSchedule();
    toast.success(`已取消「${schedulingFloor.name}」的定时发布`);
  };

  const handleAdd = () => {
    dispatch({ type: "ADD_FLOOR", typeKey: selectedType });
    setCheckedIndexes([]);
    setKeyword("");
    setPage(1); // 新行插入顶部 → 跳回第 1 页以看到高亮
    toast.success(`已添加「${findType(selectedType).label}」组件，新行插入表格顶部`);
  };

  // 点击类型标签筛选（再点一次取消）
  const handleTypeFilter = (type) => {
    setTypeFilter((prev) => (prev === type ? null : type));
    setPage(1);
  };

  const confirmDelete = (ids, label) => setPendingDelete({ ids, label });

  const doDelete = () => {
    if (!pendingDelete) return;
    const { ids } = pendingDelete;
    if (ids.length === 1) {
      dispatch({ type: "DELETE_FLOOR", floorId: ids[0] });
    } else {
      dispatch({ type: "BATCH_DELETE", floorIds: ids });
    }
    setCheckedIndexes([]);
    const count = ids.length;
    setPendingDelete(null);
    toast.success(`已删除 ${count} 个组件，预览已同步`);
  };

  // 批量启用 / 停用（需确认并说明影响范围）
  const confirmBatchToggle = (ids, status) => setPendingBatch({ ids, status });

  const doBatchToggle = () => {
    if (!pendingBatch) return;
    const { ids, status } = pendingBatch;
    dispatch({ type: "BATCH_TOGGLE", floorIds: ids, status });
    setCheckedIndexes([]);
    setPendingBatch(null);
    toast.success(`已批量${status ? "启用" : "停用"} ${ids.length} 个组件，预览已同步`);
  };

  const moreMenu = (record) => ({
    items: [
      { key: "top", icon: <IconPlusIcDigitalPowerDpToTop iconSize="0.875rem" iconColor={['currentcolor']} />, label: "置顶" },
      { key: "schedule", icon: <IconPlusIcPublicAlarmClock iconSize="0.875rem" iconColor={['currentcolor']} />, label: "定时发布" },
      { key: "copy", icon: <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} />, label: "复制组件" },
      { key: "data", icon: <IconPlusIcPublicChart iconSize="0.875rem" iconColor={['currentcolor']} />, label: "查看数据" },
    ],
    onClick: ({ key }) => {
      if (key === "top") {
        dispatch({ type: "TOP_FLOOR", floorId: record.id });
        toast.success(`「${record.name}」已置顶，排序号已重排`);
      } else if (key === "schedule") {
        openSchedule(record);
      } else if (key === "copy") {
        dispatch({ type: "COPY_FLOOR", floorId: record.id });
        toast.success(`已复制「${record.name}」并插入其后`);
      } else if (key === "data") {
        toast.info(
          record.uvShare > 0
            ? `「${record.name}」近 7 天 UV 占比 ${record.uvShare.toFixed(1)}%，转化率 3.2%，平均停留 42s`
            : `「${record.name}」为新增组件，近 7 天暂无数据`
        );
      }
    },
  });

  const columns = [
    {
      title: "组件名",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
      render: (cell, _rowData, _options, row) => {
        const record = row?.rawData;
        return (
          <div className="floor-name-cell">
            <span className={`floor-type-icon ${TYPE_TONES[record.type] || "tone-info"}`}>
              {findType(record.type).icon}
            </span>
            <a
              className="floor-name-link"
              onClick={() => dispatch({ type: "OPEN_EDIT", floorId: record.id })}
              title="点击编辑组件配置"
            >
              {record.name}
            </a>
          </div>
        );
      },
    },
    {
      title: "类型",
      key: "type",
      width: 104,
      allowSort: false,
      render: (type) => {
        const t = findType(type);
        return (
          <Tag color={t.tagColor} className="type-tag" title="点击按此类型筛选" onClick={() => handleTypeFilter(type)}>
            {t.label}
          </Tag>
        );
      },
    },
    {
      title: "状态",
      key: "status",
      width: 104,
      allowSort: false,
      render: (status, _rowData, _options, row) => {
        const record = row?.rawData;
        return (
          <Toggle
            data={[false, true]}
            toggled={!!status}
            taggledChildren="启用"
            unTaggledChildren="停用"
            onToggle={() => {
              dispatch({ type: "TOGGLE_FLOOR", floorId: record.id });
              toast.success(`「${record.name}」已${status ? "停用，预览楼层已隐藏" : "启用，预览楼层已显示"}`);
            }}
          />
        );
      },
    },
    {
      title: "排序号",
      key: "sort",
      width: 80,
      align: "right",
      sorter: (a, b) => a.sort - b.sort,
      render: (sort) => <span className="sort-number">{sort}</span>,
    },
    {
      title: "近 7 天 UV 占比",
      key: "uvShare",
      width: 152,
      align: "right",
      sorter: (a, b) => a.uvShare - b.uvShare,
      // 仅展示进度条，具体数值悬浮提示查看
      render: (uv) => (
        <span
          className="uv-bar"
          title={uv > 0 ? `近 7 天 UV 占比 ${uv.toFixed(1)}%` : "近 7 天 UV 占比：暂无数据"}
        >
          <span className="uv-bar-fill" style={{ width: `${Math.min(uv, 100)}%` }} />
        </span>
      ),
    },
    {
      title: "定时发布",
      key: "scheduledAt",
      width: 96,
      allowSort: false,
      // 统一格式：所有单元格均为「设置定时」链接；定时状态经悬浮提示展示，
      // 详情保留在定时弹窗 / 楼层结构画布 / 智能优化建议中
      render: (scheduledAt, _rowData, _options, row) => {
        const record = row?.rawData;
        return (
          <a
            className="schedule-set"
            onClick={() => openSchedule(record)}
            title={scheduledAt ? `已定时 ${scheduledAt} · 点击修改或取消` : "设置后到点自动上线"}
          >
            设置定时
          </a>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 182,
      allowSort: false,
      render: (_cell, _rowData, _options, row) => {
        const record = row?.rawData;
        const canUp = record.sort > 1;
        const canDown = record.sort < activePageFloors.length;
        return (
          <div className="floor-actions">
            <IconPlusIcIctBulkEdit
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              className="op-icon"
              title="编辑"
              onClick={() => dispatch({ type: "OPEN_EDIT", floorId: record.id })}
            />
            <IconPlusIcDigitalPowerDpArrowMoveUp
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              className={`op-icon ${canUp ? "" : "op-icon-disabled"}`}
              title="上移"
              onClick={() => canUp && dispatch({ type: "MOVE_FLOOR", floorId: record.id, dir: -1 })}
            />
            <IconPlusIcPublicSortDown
              iconSize="0.875rem"
              iconColor={['currentcolor']}
              className={`op-icon ${canDown ? "" : "op-icon-disabled"}`}
              title="下移"
              onClick={() => canDown && dispatch({ type: "MOVE_FLOOR", floorId: record.id, dir: 1 })}
            />
            <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} className="op-icon op-icon-danger" />
            <AppDropdown menu={moreMenu(record)} trigger={["click"]} placement="bottomRight">
              <span className="op-icon op-more" title="更多操作">
                <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />
              </span>
            </AppDropdown>
          </div>
        );
      },
    },
  ];

  const hasSelection = checkedIndexes.length > 0;

  return (
    <div className="deco-card floor-section">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <IconPlusIcCarLayers iconSize="1.25rem" iconColor={['currentcolor']} className="card-title-icon" />
          楼层组件管理
          <span className="card-title-caption">
            {activePage.title} · 共 {activePageFloors.length} 个楼层 · 近 7 天 UV 占比合计 {uvTotal.toFixed(1)}%
          </span>
        </div>
        <span className="card-head-caption">排序号连续 1-{activePageFloors.length}</span>
      </div>

      {/* ④ 添加组件面板 */}
      <div className="floor-toolbar">
        <span className="toolbar-block-label">添加组件</span>
        <InputSelect
          className="type-select"
          value={selectedType}
          onlySelect
          options={COMPONENT_TYPES.map((t) => ({ value: t.key, text: t.label }))}
          onChange={(v) => setSelectedType(v)}
        />
        <Button status="primary" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} text="添加组件" onClick={handleAdd} />
        <TextField
          className="floor-search"
          value={keyword}
          onChange={(v) => {
            setKeyword(v);
            setPage(1);
          }}
          suffix={<IconPlusIcPublicSearch iconSize="0.875rem" iconColor={['currentcolor']} />}
          placeholder="搜索组件名称"
        />
      </div>

      {/* 批量操作区：勾选行后可用 */}
      <div className="floor-toolbar floor-toolbar-batch">
        <Button
          disabled={!hasSelection}
          leftIcon={<IconPlusIcPublicSuccess iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="批量启用"
          onClick={() => confirmBatchToggle(selectedIds, true)}
        />
        <Button
          disabled={!hasSelection}
          leftIcon={<IconPlusIcPublicScopeDot iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="批量停用"
          onClick={() => confirmBatchToggle(selectedIds, false)}
        />
        <Button
          status="risk"
          disabled={!hasSelection}
          leftIcon={<IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} />}
          text={`批量删除${hasSelection ? `（${selectedIds.length}）` : ""}`}
          onClick={() => confirmDelete(selectedIds, "")}
        />
        <span className="toolbar-hint">
          {hasSelection
            ? `已选 ${selectedIds.length} 行，可批量启用 / 停用 / 删除`
            : "勾选行批量操作 · 点击行选中 · 双击行编辑 · 点击类型标签筛选"}
        </span>
      </div>

      <Table
        className="floor-table"
        columns={columns}
        dataset={filteredFloors}
        width="unset"
        enableZebraCrossing={false}
        enableColumnCompareUpdate
        enableCheckBox
        checkType="multi"
        checkedRows={checkedIndexes}
        onRowCheck={(_row, checkedRows) => setCheckedIndexes(checkedRows)}
        onHeaderCheck={(checkedRows) => setCheckedIndexes(checkedRows)}
        onRowClick={(row) => dispatch({ type: "SELECT_FLOOR", floorId: row?.rawData?.id })}
        onDoubleClick={(evtRow) => dispatch({ type: "OPEN_EDIT", floorId: evtRow?.rawData?.id })}
        enablePagination
        enableAutoPaging
        pagingProps={{
          currentPage: page,
          pageSize,
          pageSizeOptions: [10, 20, 50],
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
        }}
        onPageChange={(currentPage) => setPage(currentPage)}
      />

      {/* 定时发布弹窗：到点自动上线 */}
      <Dialog
        isOpen={!!schedulingFloor}
        title={schedulingFloor ? `定时发布 · ${schedulingFloor.name}` : "定时发布"}
        onClose={closeSchedule}
        size={[420, "auto"]}
        buttons={[
          ...(schedulingFloor && schedulingFloor.scheduledAt
            ? [{ text: "取消定时", status: "risk", onClick: handleClearSchedule }]
            : []),
          { text: "取消", onClick: closeSchedule },
          { text: "确定", status: "primary", onClick: handleConfirmSchedule },
        ]}
      >
        <label className="schedule-field-label">
          上线时间
        </label>
        <DatePicker
          type="datetime"
          timeEmbedded
          format="yyyy-MM-dd HH:mm"
          value={scheduleValue || undefined}
          onChange={(_dateString, date) => {
            if (date) setScheduleValue(date);
          }}
          placeholder="选择自动上线时间"
          style={{ width: "14rem" }}
        />
        <p className="schedule-tip">
          <IconPlusIcPublicInfo iconSize="0.875rem" iconColor={['currentcolor']} />
          设置后该楼层组件将于所选时间自动发布上线并生效，无需人工操作；定时上线前可随时修改或取消。
        </p>
      </Dialog>

      <MessageDialog
        type="risk"
        iconLocation="title"
        isOpen={!!pendingDelete}
        content={pendingDelete && pendingDelete.ids.length > 1 ? `确认删除选中的 ${pendingDelete.ids.length} 个组件？` : `确认删除「${pendingDelete?.label}」组件？`}
        detail="删除后买家端预览将同步移除对应楼层，剩余楼层排序号自动重排。"
        onClose={() => setPendingDelete(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setPendingDelete(null) },
          ok: { text: "删除", onClick: doDelete },
        }}
      />

      <MessageDialog
        type={pendingBatch && pendingBatch.status ? "confirm" : "risk"}
        iconLocation="title"
        isOpen={!!pendingBatch}
        content={pendingBatch ? `确认批量${pendingBatch.status ? "启用" : "停用"}选中的 ${pendingBatch.ids.length} 个组件？` : ""}
        detail={pendingBatch && pendingBatch.status ? "启用后对应楼层将立即在买家端预览中显示。" : "停用后对应楼层将从买家端预览中隐藏，配置保留可随时恢复。"}
        onClose={() => setPendingBatch(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setPendingBatch(null) },
          ok: { text: pendingBatch?.status ? "启用" : "停用", onClick: doBatchToggle },
        }}
      />
    </div>
  );
}

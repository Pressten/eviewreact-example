// ③ 楼层组件表格 + ④ 添加组件面板
// 添加组件：下拉选择 12 种组件类型 → 新行插入表格顶部并高亮
// 表格：类型筛选 / 启停切换 / 排序 / UV 占比 / 定时发布 / 上移下移删除更多 / 分页
// 工具区：关键词搜索（名称过滤）+ 勾选批量启用/停用/删除
// 点击行 = 设为素材替换目标（与素材库联动）+ 预览定位联动
// 定时发布：选择日期时间，到点自动上线（说明见弹窗）
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Button, DatePicker, Dropdown, Input, Modal, Select, Switch, Table, Tag, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useDecoration } from "../../context.jsx";
import { COMPONENT_TYPES, findType } from "../../mock/decoration.js";
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);
  const [scheduleFloorId, setScheduleFloorId] = useState(null);
  const [scheduleValue, setScheduleValue] = useState(null);

  // 切换页面页签时重置勾选、页码、搜索与类型筛选
  useEffect(() => {
    setSelectedRowKeys([]);
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

  const uvTotal = useMemo(
    () => activePageFloors.reduce((sum, f) => sum + (f.uvShare || 0), 0),
    [activePageFloors]
  );

  const schedulingFloor = findFloor(scheduleFloorId);

  const openSchedule = (record) => {
    setScheduleFloorId(record.id);
    setScheduleValue(record.scheduledAt ? dayjs(record.scheduledAt) : null);
  };

  const closeSchedule = () => setScheduleFloorId(null);

  const handleConfirmSchedule = () => {
    if (!scheduleValue) {
      message.warning("请选择定时上线时间");
      return;
    }
    const timeText = scheduleValue.format("YYYY-MM-DD HH:mm");
    dispatch({ type: "SET_SCHEDULE", floorId: schedulingFloor.id, scheduledAt: timeText });
    closeSchedule();
    message.success(`已设置「${schedulingFloor.name}」将于 ${timeText} 自动发布上线`);
  };

  const handleClearSchedule = () => {
    dispatch({ type: "SET_SCHEDULE", floorId: schedulingFloor.id, scheduledAt: null });
    closeSchedule();
    message.success(`已取消「${schedulingFloor.name}」的定时发布`);
  };

  const handleAdd = () => {
    dispatch({ type: "ADD_FLOOR", typeKey: selectedType });
    setSelectedRowKeys([]);
    setKeyword("");
    setPage(1); // 新行插入顶部 → 跳回第 1 页以看到高亮
    message.success(`已添加「${findType(selectedType).label}」组件，新行插入表格顶部`);
  };

  // 点击类型标签筛选（再点一次取消）
  const handleTypeFilter = (type) => {
    setTypeFilter((prev) => (prev === type ? null : type));
    setPage(1);
  };

  const confirmDelete = (ids, label) => {
    Modal.confirm({
      title: ids.length > 1 ? `确认删除选中的 ${ids.length} 个组件？` : `确认删除「${label}」组件？`,
      content: "删除后买家端预览将同步移除对应楼层，剩余楼层排序号自动重排。",
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        if (ids.length === 1) {
          dispatch({ type: "DELETE_FLOOR", floorId: ids[0] });
        } else {
          dispatch({ type: "BATCH_DELETE", floorIds: ids });
        }
        setSelectedRowKeys([]);
        message.success(`已删除 ${ids.length} 个组件，预览已同步`);
      },
    });
  };

  // 批量启用 / 停用（需确认并说明影响范围）
  const confirmBatchToggle = (ids, status) => {
    Modal.confirm({
      title: `确认批量${status ? "启用" : "停用"}选中的 ${ids.length} 个组件？`,
      content: status
        ? "启用后对应楼层将立即在买家端预览中显示。"
        : "停用后对应楼层将从买家端预览中隐藏，配置保留可随时恢复。",
      okText: status ? "启用" : "停用",
      okButtonProps: status ? undefined : { danger: true },
      cancelText: "取消",
      onOk: () => {
        dispatch({ type: "BATCH_TOGGLE", floorIds: ids, status });
        setSelectedRowKeys([]);
        message.success(`已批量${status ? "启用" : "停用"} ${ids.length} 个组件，预览已同步`);
      },
    });
  };

  const moreMenu = (record) => ({
    items: [
      { key: "top", icon: <Icon name="arrow-up-to-line" size="0.875rem" />, label: "置顶" },
      { key: "schedule", icon: <Icon name="alarm-clock" size="0.875rem" />, label: "定时发布" },
      { key: "copy", icon: <Icon name="copy" size="0.875rem" />, label: "复制组件" },
      { key: "data", icon: <Icon name="chart-column" size="0.875rem" />, label: "查看数据" },
    ],
    onClick: ({ key }) => {
      if (key === "top") {
        dispatch({ type: "TOP_FLOOR", floorId: record.id });
        message.success(`「${record.name}」已置顶，排序号已重排`);
      } else if (key === "schedule") {
        openSchedule(record);
      } else if (key === "copy") {
        dispatch({ type: "COPY_FLOOR", floorId: record.id });
        message.success(`已复制「${record.name}」并插入其后`);
      } else if (key === "data") {
        message.info(
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
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
      render: (_, record) => (
        <div className="floor-name-cell">
          <span className={`floor-type-icon ${TYPE_TONES[record.type] || "tone-info"}`}>
            <Icon name={findType(record.type).icon} size="0.875rem" />
          </span>
          <a
            className="floor-name-link"
            onClick={() => dispatch({ type: "OPEN_EDIT", floorId: record.id })}
            title="点击编辑组件配置"
          >
            {record.name}
          </a>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 104,
      filters: COMPONENT_TYPES.map((t) => ({ text: t.label, value: t.key })),
      filteredValue: typeFilter ? [typeFilter] : null,
      onFilter: (value, record) => record.type === value,
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
      dataIndex: "status",
      key: "status",
      width: 104,
      filters: [
        { text: "启用", value: true },
        { text: "停用", value: false },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <Switch
          checked={status}
          checkedChildren="启用"
          unCheckedChildren="停用"
          onChange={() => {
            dispatch({ type: "TOGGLE_FLOOR", floorId: record.id });
            message.success(`「${record.name}」已${status ? "停用，预览楼层已隐藏" : "启用，预览楼层已显示"}`);
          }}
        />
      ),
    },
    {
      title: "排序号",
      dataIndex: "sort",
      key: "sort",
      width: 80,
      align: "right",
      sorter: (a, b) => a.sort - b.sort,
      render: (sort) => <span className="sort-number">{sort}</span>,
    },
    {
      title: "近 7 天 UV 占比",
      dataIndex: "uvShare",
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
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      width: 96,
      // 统一格式：所有单元格均为「设置定时」链接；定时状态经悬浮提示展示，
      // 详情保留在定时弹窗 / 楼层结构画布 / 智能优化建议中
      render: (scheduledAt, record) => (
        <a
          className="schedule-set"
          onClick={() => openSchedule(record)}
          title={scheduledAt ? `已定时 ${scheduledAt} · 点击修改或取消` : "设置后到点自动上线"}
        >
          设置定时
        </a>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 182,
      render: (_, record) => {
        const canUp = record.sort > 1;
        const canDown = record.sort < activePageFloors.length;
        return (
          <div className="floor-actions">
            <Icon
              name="pencil"
              size="0.875rem"
              className="op-icon"
              title="编辑"
              onClick={() => dispatch({ type: "OPEN_EDIT", floorId: record.id })}
            />
            <Icon
              name="arrow-up"
              size="0.875rem"
              className={`op-icon ${canUp ? "" : "op-icon-disabled"}`}
              title="上移"
              onClick={() => canUp && dispatch({ type: "MOVE_FLOOR", floorId: record.id, dir: -1 })}
            />
            <Icon
              name="arrow-down"
              size="0.875rem"
              className={`op-icon ${canDown ? "" : "op-icon-disabled"}`}
              title="下移"
              onClick={() => canDown && dispatch({ type: "MOVE_FLOOR", floorId: record.id, dir: 1 })}
            />
            <Icon
              name="trash-2"
              size="0.875rem"
              className="op-icon op-icon-danger"
              title="删除"
              onClick={() => confirmDelete([record.id], record.name)}
            />
            <Dropdown menu={moreMenu(record)} trigger={["click"]} placement="bottomRight">
              <span className="op-icon op-more" title="更多操作">
                <Icon name="ellipsis" size="0.875rem" />
              </span>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const hasSelection = selectedRowKeys.length > 0;

  return (
    <div className="deco-card floor-section">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <Icon name="layers" size="1.25rem" className="card-title-icon" />
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
        <Select
          className="type-select"
          value={selectedType}
          onChange={setSelectedType}
          showSearch
          optionFilterProp="label"
          options={COMPONENT_TYPES.map((t) => ({ value: t.key, label: t.label }))}
        />
        <Button type="primary" icon={<Icon name="plus" size="0.875rem" />} onClick={handleAdd}>
          添加组件
        </Button>
        <Input
          className="floor-search"
          allowClear
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          suffix={<Icon name="search" size="0.875rem" />}
          placeholder="搜索组件名称"
        />
      </div>

      {/* 批量操作区：勾选行后可用 */}
      <div className="floor-toolbar floor-toolbar-batch">
        <Button
          disabled={!hasSelection}
          icon={<Icon name="circle-check-big" size="0.875rem" />}
          onClick={() => confirmBatchToggle(selectedRowKeys, true)}
        >
          批量启用
        </Button>
        <Button
          disabled={!hasSelection}
          icon={<Icon name="circle-dot" size="0.875rem" />}
          onClick={() => confirmBatchToggle(selectedRowKeys, false)}
        >
          批量停用
        </Button>
        <Button
          danger
          disabled={!hasSelection}
          icon={<Icon name="trash-2" size="0.875rem" />}
          onClick={() => confirmDelete(selectedRowKeys, "")}
        >
          批量删除{hasSelection ? `（${selectedRowKeys.length}）` : ""}
        </Button>
        <span className="toolbar-hint">
          {hasSelection
            ? `已选 ${selectedRowKeys.length} 行，可批量启用 / 停用 / 删除`
            : "勾选行批量操作 · 点击行选中 · 双击行编辑 · 点击类型标签筛选"}
        </span>
      </div>

      <Table
        className="floor-table"
        rowKey="id"
        columns={columns}
        dataSource={filteredFloors}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
        scroll={{ x: 960 }}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys, columnWidth: 44 }}
        pagination={{
          current: page,
          pageSize,
          showTotal: (total, range) => `总记录数：${total} 已选中行数：${selectedRowKeys.length}`,
          showSizeChanger: true,
          showQuickJumper: { goButton: "跳转" },
          onChange: (nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize);
          },
        }}
        rowClassName={(record) => {
          const cls = [];
          if (record.id === state.selectedFloorId) cls.push("floor-row-selected");
          if (record.id === state.highlightFloorId) cls.push("floor-row-highlight");
          if (record.id === state.hoveredFloorId) cls.push("floor-row-hover");
          return cls.join(" ");
        }}
        onRow={(record) => ({
          onClick: () => dispatch({ type: "SELECT_FLOOR", floorId: record.id }),
          onDoubleClick: () => dispatch({ type: "OPEN_EDIT", floorId: record.id }),
          onMouseEnter: () => dispatch({ type: "HOVER_FLOOR", floorId: record.id }),
          onMouseLeave: () => dispatch({ type: "HOVER_FLOOR", floorId: null }),
        })}
        onChange={(_pagination, filters) => {
          // 类型筛选下拉与点击标签双入口同步
          setTypeFilter(filters.type && filters.type.length > 0 ? filters.type[0] : null);
        }}
      />

      {/* 定时发布弹窗：到点自动上线 */}
      <Modal
        open={!!schedulingFloor}
        title={schedulingFloor ? `定时发布 · ${schedulingFloor.name}` : "定时发布"}
        onCancel={closeSchedule}
        width={420}
        footer={[
          schedulingFloor && schedulingFloor.scheduledAt ? (
            <Button key="clear" danger onClick={handleClearSchedule}>
              取消定时
            </Button>
          ) : null,
          <Button key="cancel" onClick={closeSchedule}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleConfirmSchedule}>
            确定
          </Button>,
        ]}
      >
        <label className="schedule-field-label" htmlFor="schedule-picker">
          上线时间
        </label>
        <DatePicker
          id="schedule-picker"
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          value={scheduleValue}
          onChange={(value) => setScheduleValue(value)}
          placeholder="选择自动上线时间"
          style={{ width: "14rem" }}
        />
        <p className="schedule-tip">
          <Icon name="info" size="0.875rem" />
          设置后该楼层组件将于所选时间自动发布上线并生效，无需人工操作；定时上线前可随时修改或取消。
        </p>
      </Modal>
    </div>
  );
}

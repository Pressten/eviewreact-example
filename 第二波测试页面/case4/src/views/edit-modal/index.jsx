// ③ 组件配置 Modal：内容 + 样式双页签
// 表单为纯 H5 骨架（form/label/div + antd 输入组件受控），不用 antd Form
// 校验文案绝对定位于控件下方，必填星号 CSS 伪元素悬挂
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Input, InputNumber, Modal, Select, Switch, Tabs, Tag, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useDecoration } from "../../context.jsx";
import { MATERIALS } from "../../mock/material.js";
import { findType } from "../../mock/decoration.js";
import "./index.css";

// 内容页签字段（按类型）
const CONTENT_FIELDS = {
  carousel: [
    { key: "autoPlay", label: "自动轮播", kind: "switch" },
    { key: "interval", label: "切换间隔（秒）", kind: "number", min: 2, max: 10 },
    { key: "imageIds", label: "轮播素材", kind: "materials", multiple: true },
  ],
  seckill: [
    { key: "title", label: "活动标题", kind: "text", required: true, maxLength: 12 },
    { key: "endsAt", label: "结束时间", kind: "datetime", required: true },
    { key: "productCount", label: "展示商品数", kind: "number", min: 2, max: 6 },
  ],
  recommend: [
    { key: "title", label: "栏目标题", kind: "text", required: true, maxLength: 12 },
    { key: "productCount", label: "商品数量", kind: "number", min: 4, max: 8 },
  ],
  imageText: [
    { key: "title", label: "卡片标题", kind: "text", required: true, maxLength: 16 },
    { key: "subtitle", label: "副标题", kind: "text", maxLength: 30 },
    { key: "imageId", label: "配图素材", kind: "materials" },
    { key: "link", label: "跳转链接", kind: "text", maxLength: 60 },
  ],
  video: [
    { key: "title", label: "视频标题", kind: "text", required: true, maxLength: 16 },
    { key: "imageId", label: "封面素材", kind: "materials" },
    { key: "duration", label: "视频时长", kind: "text", maxLength: 8 },
  ],
  coupon: [
    { key: "title", label: "栏目标题", kind: "text", required: true, maxLength: 12 },
    { key: "couponCount", label: "优惠券数量", kind: "number", min: 1, max: 5 },
  ],
  searchBar: [{ key: "hint", label: "占位文案", kind: "text", maxLength: 20 }],
  notice: [{ key: "content", label: "公告内容", kind: "text", maxLength: 50 }],
  navGrid: [
    { key: "columnCount", label: "每行宫格数", kind: "number", min: 3, max: 5 },
    { key: "entryCount", label: "入口数量", kind: "number", min: 4, max: 8 },
  ],
  floatService: [{ key: "labelText", label: "按钮文案", kind: "text", maxLength: 8 }],
  countdownBanner: [
    { key: "title", label: "主标题", kind: "text", required: true, maxLength: 16 },
    { key: "endsAt", label: "结束时间", kind: "datetime", required: true },
    { key: "imageId", label: "背景素材", kind: "materials" },
  ],
  memberRights: [
    { key: "title", label: "标题", kind: "text", required: true, maxLength: 12 },
    { key: "levelText", label: "会员等级文案", kind: "text", maxLength: 12 },
  ],
};

// 样式页签字段（所有类型通用）
const STYLE_FIELDS = [
  { key: "showTitle", label: "显示标题栏", kind: "switch" },
  {
    key: "bgTheme",
    label: "背景风格",
    kind: "select",
    options: [
      { value: "default", label: "默认白" },
      { value: "brand", label: "品牌蓝渐变" },
      { value: "promo", label: "大促红" },
      { value: "dark", label: "暗黑" },
    ],
  },
  { key: "radius", label: "圆角（px）", kind: "number", min: 0, max: 16 },
  { key: "spacing", label: "上下间距（px）", kind: "number", min: 0, max: 40 },
];

const MATERIAL_OPTIONS = MATERIALS.map((m) => ({
  value: m.id,
  label: `${m.name}（${m.width}×${m.height}）`,
}));

const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

export default function EditFloorModal() {
  const { editingFloor, dispatch } = useDecoration();
  const [draft, setDraft] = useState(null);
  const [errors, setErrors] = useState({});
  const [tabKey, setTabKey] = useState("content");

  // 打开弹窗时以当前楼层初始化表单
  useEffect(() => {
    if (editingFloor) {
      setDraft({ name: editingFloor.name, config: { ...editingFloor.config } });
      setErrors({});
      setTabKey("content");
    }
  }, [editingFloor]);

  const open = !!editingFloor;
  const typeInfo = editingFloor ? findType(editingFloor.type) : null;

  const setName = (value) => {
    setDraft((d) => ({ ...d, name: value }));
    setErrors((e) => ({ ...e, name: undefined }));
  };

  const setField = (key, value) => {
    setDraft((d) => ({ ...d, config: { ...d.config, [key]: value } }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSave = () => {
    const errs = {};
    if (!draft.name.trim()) errs.name = "请输入组件名称";

    (CONTENT_FIELDS[editingFloor.type] || []).forEach((f) => {
      const value = draft.config[f.key];
      if (f.required && (value === undefined || value === null || String(value).trim() === "")) {
        errs[f.key] = `请输入${f.label}`;
        return;
      }
      if (
        f.kind === "datetime" &&
        value &&
        (!DATETIME_PATTERN.test(String(value).trim()) || !dayjs(String(value).trim()).isValid())
      ) {
        errs[f.key] = "时间格式：YYYY-MM-DD HH:mm，如 2026-10-31 20:00";
      }
    });

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const hasContentError = errs.name || (CONTENT_FIELDS[editingFloor.type] || []).some((f) => errs[f.key]);
      if (hasContentError) setTabKey("content");
      message.warning("请按提示修正表单后再保存");
      return;
    }

    dispatch({
      type: "UPDATE_FLOOR",
      floorId: editingFloor.id,
      patch: { name: draft.name.trim(), config: draft.config },
    });
    dispatch({ type: "CLOSE_EDIT" });
    message.success("组件配置已保存，买家端预览已同步");
  };

  const renderControl = (field) => {
    const value = draft.config[field.key];
    const errorState = errors[field.key] ? "error" : undefined;
    switch (field.kind) {
      case "text":
        return (
          <Input
            id={`ef-${field.key}`}
            value={value ?? ""}
            maxLength={field.maxLength || 40}
            status={errorState}
            onChange={(e) => setField(field.key, e.target.value)}
            placeholder={`请输入${field.label}`}
            style={{ width: "100%" }}
          />
        );
      case "datetime":
        return (
          <Input
            id={`ef-${field.key}`}
            value={value ?? ""}
            status={errorState}
            onChange={(e) => setField(field.key, e.target.value)}
            placeholder="如 2026-10-31 20:00"
            style={{ width: "11rem" }}
          />
        );
      case "number":
        return (
          <InputNumber
            id={`ef-${field.key}`}
            mode="spinner"
            variant="outlined"
            style={{ width: "8rem" }}
            min={field.min}
            max={field.max}
            value={value ?? 0}
            status={errorState}
            onChange={(v) => setField(field.key, v ?? 0)}
          />
        );
      case "switch":
        return <Switch checked={!!value} onChange={(v) => setField(field.key, v)} />;
      case "select":
        return (
          <Select
            style={{ width: "11rem" }}
            options={field.options}
            value={value}
            onChange={(v) => setField(field.key, v)}
          />
        );
      case "materials":
        return field.multiple ? (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            value={value ?? []}
            onChange={(v) => setField(field.key, v)}
            options={MATERIAL_OPTIONS}
            placeholder="选择素材（第 1 张为首屏图）"
          />
        ) : (
          <Select
            style={{ width: "100%" }}
            value={value}
            onChange={(v) => setField(field.key, v)}
            options={MATERIAL_OPTIONS}
            placeholder="选择素材"
          />
        );
      default:
        return null;
    }
  };

  const renderField = (field, valueSource) => {
    const isName = field.key === "__name";
    const error = isName ? errors.name : errors[field.key];
    return (
      <div className="ef-field" key={field.key}>
        <label className={`ef-label ${field.required || isName ? "ef-label-required" : ""}`} htmlFor={isName ? "ef-name" : `ef-${field.key}`}>
          {field.label}
        </label>
        <div className="ef-control">
          {isName ? (
            <Input
              id="ef-name"
              value={draft.name}
              maxLength={20}
              status={error ? "error" : undefined}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入组件名称"
              style={{ width: "100%" }}
            />
          ) : (
            renderControl(field)
          )}
          {error && <div className="ef-error">{error}</div>}
        </div>
      </div>
    );
  };

  const nameField = { key: "__name", label: "组件名称", required: true };

  return (
    <Modal
      open={open}
      title={editingFloor ? `编辑组件 · ${editingFloor.name}` : "编辑组件"}
      width={560}
      okText="保存配置"
      cancelText="取消"
      onOk={draft ? handleSave : undefined}
      onCancel={() => dispatch({ type: "CLOSE_EDIT" })}
      destroyOnClose
    >
      {editingFloor && draft && (
        <div className="ef-body">
          <div className="ef-meta">
            <Tag color={typeInfo.tagColor}>{typeInfo.label}</Tag>
            <span className="ef-meta-text">
              {editingFloor.status ? "启用中" : "已停用"} · 排序号 {editingFloor.sort} · 近 7 天 UV 占比{" "}
              {editingFloor.uvShare > 0 ? `${editingFloor.uvShare.toFixed(1)}%` : "暂无数据"}
            </span>
          </div>
          <Tabs
            className="ef-tabs"
            activeKey={tabKey}
            onChange={setTabKey}
            items={[
              {
                key: "content",
                label: (
                  <span className="ef-tab-label">
                    <Icon name="file-text" size="0.875rem" />
                    内容配置
                  </span>
                ),
                children: (
                  <div className="ef-pane">
                    {renderField(nameField, "name")}
                    {(CONTENT_FIELDS[editingFloor.type] || []).map((f) => renderField(f, "config"))}
                  </div>
                ),
              },
              {
                key: "style",
                label: (
                  <span className="ef-tab-label">
                    <Icon name="paint-roller" size="0.875rem" />
                    样式设置
                  </span>
                ),
                children: <div className="ef-pane">{STYLE_FIELDS.map((f) => renderField(f, "style"))}</div>,
              },
            ]}
          />
        </div>
      )}
    </Modal>
  );
}

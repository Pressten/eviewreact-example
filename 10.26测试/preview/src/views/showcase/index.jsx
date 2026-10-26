import { Button, Input, Select, TreeSelect, Dropdown } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import IpInput from "../../components/ip-input/index.jsx";
import {
  regionOptions,
  tagOptions,
  categoryOptions,
  orgTreeData,
} from "../../mock/options.js";
import "./index.css";

// 三档尺寸:大 / 中 / 小(对齐 antd large / middle / small)
const SIZES = [
  { key: "large", cn: "大", en: "Large", height: "40" },
  { key: "middle", cn: "中", en: "Middle", height: "32" },
  { key: "small", cn: "小", en: "Small", height: "24" },
];

// Dropdown 菜单项
const dropdownItems = [
  { key: "export", label: "导出", icon: <Icon name="download" size="0.875rem" /> },
  { key: "copy", label: "复制", icon: <Icon name="copy" size="0.875rem" /> },
  { key: "refresh", label: "刷新", icon: <Icon name="refresh-cw" size="0.875rem" /> },
  { type: "divider" },
  { key: "delete", label: "删除", danger: true, icon: <Icon name="trash-2" size="0.875rem" /> },
];

// 组件配置:每项一个组件类别,render(size) 返回该尺寸下的实例
const SECTIONS = [
  {
    id: "button",
    icon: "hand",
    title: "Button 按钮",
    desc: "触发即时操作,同组按钮尺寸与结构保持一致",
    render: (size) => (
      <div className="comp-cluster">
        <Button type="primary" size={size}>主操作</Button>
        <Button size={size}>次操作</Button>
        <Button type="dashed" size={size}>虚线</Button>
      </div>
    ),
  },
  {
    id: "textfield",
    icon: "type",
    title: "TextField 文本输入",
    desc: "单行文本输入,常规表单用中,紧凑筛选区用小",
    render: (size) => (
      <Input size={size} allowClear placeholder="请输入设备名称" style={{ width: 260 }} />
    ),
  },
  {
    id: "ipinput",
    icon: "network",
    title: "IpInput 地址输入",
    desc: "四段 IPv4 输入,自动校验 0~255,句点跳转",
    render: (size) => <IpInput size={size} />,
  },
  {
    id: "searchinput",
    icon: "search",
    title: "SearchInput 关键词搜索",
    desc: "Input + 右侧放大镜后缀,回车搜索,支持清除",
    render: (size) => (
      <Input
        size={size}
        allowClear
        placeholder="搜索名称、ID 或 IP"
        onPressEnter={() => {}}
        suffix={<Icon name="search" size="0.875rem" color="var(--on-surface-variant)" />}
        style={{ width: 260 }}
      />
    ),
  },
  {
    id: "inputselect",
    icon: "list-filter",
    title: "InputSelect 输入选择",
    desc: "输入框前置类别选择,先选维度再输入关键词",
    render: (size) => (
      <Input
        size={size}
        allowClear
        placeholder="请输入关键词"
        addonBefore={
          <Select
            size={size}
            defaultValue="name"
            options={categoryOptions}
            style={{ width: 96 }}
          />
        }
        style={{ width: 300 }}
      />
    ),
  },
  {
    id: "multipleselect",
    icon: "tags",
    title: "MultipleSelect 多选选择器",
    desc: "从标签集合中选取多项,支持搜索与清除",
    render: (size) => (
      <Select
        mode="multiple"
        size={size}
        allowClear
        placeholder="请选择工单标签"
        options={tagOptions}
        style={{ width: 280 }}
      />
    ),
  },
  {
    id: "select",
    icon: "list",
    title: "Select 单选选择器",
    desc: "从一组选项中选择一个值,支持搜索",
    render: (size) => (
      <Select
        size={size}
        allowClear
        placeholder="请选择区域"
        options={regionOptions}
        style={{ width: 220 }}
      />
    ),
  },
  {
    id: "treeselect",
    icon: "git-branch",
    title: "TreeSelect 树选择",
    desc: "从树形结构中选择节点,适用于层级数据",
    render: (size) => (
      <TreeSelect
        size={size}
        allowClear
        placeholder="请选择组织"
        treeData={orgTreeData}
        treeDefaultExpandAll
        style={{ width: 260 }}
      />
    ),
  },
  {
    id: "dropdown",
    icon: "chevron-down",
    title: "Dropdown 下拉菜单",
    desc: "从上下文展开一组操作,触发器尺寸即下拉尺寸",
    render: (size) => (
      <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
        <Button size={size}>
          更多操作
          <Icon name="chevron-down" size="0.875rem" />
        </Button>
      </Dropdown>
    ),
  },
];

export default function Showcase() {
  return (
    <main className="showcase">
      <section className="showcase-intro">
        <h1 className="showcase-intro-title">表单控件尺寸规范</h1>
        <p className="showcase-intro-sub">
          覆盖 Button / TextField / IpInput / SearchInput / InputSelect / MultipleSelect / Select / TreeSelect / Dropdown
          共 9 类控件,每类均展示 大(40px) · 中(32px) · 小(24px) 三档尺寸。
        </p>
        <div className="showcase-legend">
          {SIZES.map((s) => (
            <span className="showcase-legend-chip" key={s.key}>
              <span className="showcase-legend-cn">{s.cn}</span>
              <span className="showcase-legend-en">{s.en} · {s.height}px</span>
            </span>
          ))}
        </div>
      </section>

      <div className="showcase-grid">
        {SECTIONS.map((sec) => (
          <section className="showcase-card" key={sec.id} id={`sec-${sec.id}`}>
            <header className="showcase-card-head">
              <span className="showcase-card-icon">
                <Icon name={sec.icon} size="1.25rem" color="var(--primary)" />
              </span>
              <div className="showcase-card-meta">
                <h2 className="showcase-card-title">{sec.title}</h2>
                <p className="showcase-card-desc">{sec.desc}</p>
              </div>
            </header>
            <div className="showcase-card-body">
              {SIZES.map((s) => (
                <div className="size-row" key={s.key}>
                  <div className="size-row-label">
                    <span className="size-row-cn">{s.cn}</span>
                    <span className="size-row-en">{s.en}</span>
                  </div>
                  <div className="size-row-control">{sec.render(s.key)}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

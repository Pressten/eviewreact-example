import Button from "@nce/eview-react/Button";
import { IconPlusIcDevBranch, IconPlusIcHuaweiCloudNetwork, IconPlusIcPublicChevronDown, IconPlusIcPublicCopy, IconPlusIcPublicDownload, IconPlusIcPublicFilter, IconPlusIcPublicHand, IconPlusIcPublicInput, IconPlusIcPublicListBullet, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSearch, IconPlusIcPublicTag, IconPlusIcPublicTrash } from '@hui/icon-plus';
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import TextField from "@/shared/TextField";
import SearchInput from "@/shared/SearchInput";
import InputSelect from "@/shared/InputSelect";
import MultipleSelect from "@/shared/MultipleSelect";
import Select from "@/shared/Select";
import TreeSelector from "@/shared/TreeSelector";
import IPInput from "@/shared/IPInput";
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

// PopUpMenu 菜单项 — children 模式,onClick 通过 evt.value 匹配 serialno
// 注:antd type:"divider" 与 danger 在 PopUpMenu 已声明字段中无对应项,按硬约束不写
const dropdownOptions = [
  { id: "export", text: "导出", serialno: "export", iconUrl: <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "copy", text: "复制", serialno: "copy", iconUrl: <IconPlusIcPublicCopy iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "refresh", text: "刷新", serialno: "refresh", iconUrl: <IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { id: "delete", text: "删除", serialno: "delete", iconUrl: <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

// 组织树默认展开所有非叶节点(对齐源 treeDefaultExpandAll)
const TREE_EXPANDED_KEYS = ["root", "rd", "ops", "pd"];

// 组件配置:每项一个组件类别,render(size) 返回该尺寸下的实例
const SECTIONS = [
  {
    id: "button",
    icon: <IconPlusIcPublicHand iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "Button 按钮",
    desc: "触发即时操作,同组按钮尺寸与结构保持一致",
    render: (size) => (
      <div className="comp-cluster">
        <Button status="primary" size={size} text="主操作" />
        <Button size={size} text="次操作" />
        <Button status="default" size={size} text="虚线" />
      </div>
    ),
  },
  {
    id: "textfield",
    icon: <IconPlusIcPublicInput iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "TextField 文本输入",
    desc: "单行文本输入,常规表单用中,紧凑筛选区用小",
    render: (size) => (
      <TextField size={size} placeholder="请输入设备名称" style={{ width: 260 }} />
    ),
  },
  {
    id: "ipinput",
    icon: <IconPlusIcHuaweiCloudNetwork iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "IpInput 地址输入",
    desc: "四段 IPv4 输入,自动校验 0~255,句点跳转",
    render: (size) => <IPInput size={size} type="v4" />,
  },
  {
    id: "searchinput",
    icon: <IconPlusIcPublicSearch iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "SearchInput 关键词搜索",
    desc: "内置搜索图标、清除按钮与回车搜索",
    render: (size) => (
      <SearchInput size={size} placeholder="搜索名称、ID 或 IP" style={{ width: 260 }} />
    ),
  },
  {
    id: "inputselect",
    icon: <IconPlusIcPublicFilter iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "InputSelect 输入选择",
    desc: "可输入过滤的下拉,敲字定位选项后回车选中",
    render: (size) => (
      <InputSelect
        size={size}
        options={categoryOptions}
        placeholder="请输入关键词"
        enableClear
        onlySelect
        style={{ width: 300 }}
      />
    ),
  },
  {
    id: "multipleselect",
    icon: <IconPlusIcPublicTag iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "MultipleSelect 多选选择器",
    desc: "从标签集合中选取多项,支持搜索与清除",
    render: (size) => (
      <MultipleSelect
        size={size}
        options={tagOptions}
        value={[]}
        placeholder="请选择工单标签"
        enableCloseIcon
        style={{ width: 280 }}
      />
    ),
  },
  {
    id: "select",
    icon: <IconPlusIcPublicListBullet iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "Select 单选选择器",
    desc: "从一组选项中选择一个值,支持清除",
    render: (size) => (
      <Select
        size={size}
        options={regionOptions}
        value={regionOptions[0].value}
        defaultLabel="请选择区域"
        enableClear
        style={{ width: 220 }}
      />
    ),
  },
  {
    id: "treeselect",
    icon: <IconPlusIcDevBranch iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "TreeSelect 树选择",
    desc: "从树形结构中选择节点,适用于层级数据",
    render: (size) => (
      <TreeSelector
        size={size}
        treeData={orgTreeData}
        value="rd-fe"
        expandedKeys={TREE_EXPANDED_KEYS}
        clearable
        style={{ width: 260 }}
      />
    ),
  },
  {
    id: "dropdown",
    icon: <IconPlusIcPublicChevronDown iconSize="1.25rem" iconColor={['var(--primary)']} />,
    title: "Dropdown 下拉菜单",
    desc: "从上下文展开一组操作,触发器尺寸即下拉尺寸",
    render: (size) => (
      <PopUpMenu options={dropdownOptions} width="180px" onClick={() => {}}>
        <Button
          text="更多操作"
          rightIcon={<IconPlusIcPublicChevronDown iconSize="0.875rem" iconColor={['currentcolor']} />}
          size={size}
        />
      </PopUpMenu>
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
                {sec.icon}
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

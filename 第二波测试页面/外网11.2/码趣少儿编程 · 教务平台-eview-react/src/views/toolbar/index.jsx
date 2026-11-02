import Crumbs from "@nce/eview-react/Crumbs";
import { IconPlusIcPublicChevronDown, IconPlusIcPublicClock, IconPlusIcPublicFolder, IconPlusIcPublicPlus, IconPlusIcPublicUpload, IconPlusIcPublicListBullet, IconPlusIcDigitalPowerDpPowerGrid, IconPlusIcPublicHome, IconPlusIcPublicTxtFileTextured, IconPlusIcDigitalPowerDpFile, IconPlusIcPublicProjector, IconPlusIcPublicHorizontalBarChart } from '@hui/icon-plus';
import SelectCard from "@nce/eview-react/SelectCard";
import Button from "@nce/eview-react/Button";
import SimpleDropdown from "../../components/simple-dropdown/index.jsx";
import "./index.css";

const VIEW_OPTIONS = [
  { label: <span className="seg-opt"><IconPlusIcPublicListBullet iconSize="0.875rem" iconColor={['currentcolor']} />列表</span>, value: "list" },
  { label: <span className="seg-opt"><IconPlusIcDigitalPowerDpPowerGrid iconSize="0.875rem" iconColor={['currentcolor']} />网格</span>, value: "grid" },
];

const SORT_OPTIONS = [
  { key: "name", label: "名称", icon: <IconPlusIcPublicListBullet iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "size", label: "大小", icon: <IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "updateTime", label: "更新时间", icon: <IconPlusIcPublicClock iconSize="0.875rem" iconColor={['currentcolor']} /> },
];

export default function Toolbar({
  breadcrumb,
  viewMode,
  onViewChange,
  sortField,
  onSortChange,
  onBreadcrumb,
  onNew,
}) {
  const crumbItems = [
    {
      title: (
        <a className="crumb-link" onClick={(e) => { e.preventDefault(); onBreadcrumb(null); }} href="#">
          <IconPlusIcPublicHome iconSize="0.875rem" iconColor={['currentcolor']} />
          我的文件
        </a>
      ),
    },
    ...breadcrumb.map((node, i) => ({
      title: i === breadcrumb.length - 1 ? (
        <span className="crumb-current">{node.name}</span>
      ) : (
        <a className="crumb-link" onClick={(e) => { e.preventDefault(); onBreadcrumb(node.key); }} href="#">
          {node.name}
        </a>
      ),
    })),
  ];

  const sortItems = SORT_OPTIONS.map((o) => ({
    key: o.key,
    icon: o.icon,
    label: o.label,
  }));

  const newItems = [
    { key: "folder", icon: <IconPlusIcPublicFolder iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建文件夹" },
    { key: "doc", icon: <IconPlusIcPublicTxtFileTextured iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建文档" },
    { type: "divider" },
    { key: "sheet", icon: <IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建表格" },
    { key: "slide", icon: <IconPlusIcPublicProjector iconSize="0.875rem" iconColor={['currentcolor']} />, label: "新建演示" },
    { type: "divider" },
    { key: "upload", icon: <IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} />, label: "上传文件" },
  ];

  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortField)?.label || "排序";

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <Crumbs data={crumbItems} />
      </div>

      <div className="toolbar-right">
        <SelectCard
          data={VIEW_OPTIONS.map(o => ({ text: o.label, value: o.value }))}
          value={viewMode}
          onChange={(v) => onViewChange(v)}
        />

        <SimpleDropdown items={sortItems} onSelect={(key) => onSortChange(key)}>
          <button className="tool-btn" title="排序方式">
            <IconPlusIcPublicHorizontalBarChart iconSize="0.875rem" iconColor={['currentcolor']} />
            <span>{sortLabel}</span>
            <IconPlusIcPublicChevronDown iconSize="0.75rem" iconColor={['#777777']} />
          </button>
        </SimpleDropdown>

        <SimpleDropdown items={newItems} onSelect={(key) => onNew(key)}>
          <Button status="primary" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} text="新建" />
        </SimpleDropdown>
      </div>
    </div>
  );
}

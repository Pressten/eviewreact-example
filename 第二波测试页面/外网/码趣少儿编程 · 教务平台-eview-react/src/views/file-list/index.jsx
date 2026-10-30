import { useMemo, useState } from "react";
import { IconPlusIcPublicEllipsis, IconPlusIcPublicDownload, IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcDigitalPowerDpMove, IconPlusIcPublicShare, IconPlusIcPublicHistoryInformation, IconPlusIcPublicTrash } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Empty from "@nce/eview-react/Empty";
import DivMessage from "@nce/eview-react/DivMessage";
import Checkbox from "@nce/eview-react/Checkbox";
import { userMap } from "../../mock/drive.jsx";
import FileTypeIcon from "../../components/file-type-icon/index.jsx";
import ShareStatusTag from "../../components/share-status-tag/index.jsx";
import AvatarStack from "../../components/avatar-stack/index.jsx";
import "./index.css";

const ROW_ACTIONS = [
  { key: "download", label: "下载", icon: <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "rename", label: "重命名", icon: <IconPlusIcPublicTransverseRectangleTemplate iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "move", label: "移动", icon: <IconPlusIcDigitalPowerDpMove iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "divider1", divider: true },
  { key: "share", label: "分享", icon: <IconPlusIcPublicShare iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "history", label: "历史版本", icon: <IconPlusIcPublicHistoryInformation iconSize="0.875rem" iconColor={['currentcolor']} /> },
  { key: "divider2", divider: true },
  { key: "delete", label: "删除", icon: <IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} />, danger: true },
];

function sortFiles(list, field) {
  const arr = list.slice();
  if (field === "name") arr.sort((a, b) => a.name.localeCompare(b.name, "zh"));
  else if (field === "size") arr.sort((a, b) => a.size - b.size);
  else arr.sort((a, b) => b.updateTs - a.updateTs);
  return arr;
}

export default function FileList({
  files,
  viewMode,
  sortField,
  selectedFileId,
  onSelectFile,
  selectedRowKeys,
  onSelectedRowKeysChange,
  onShare,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notice, setNotice] = useState(null);

  const sorted = useMemo(() => sortFiles(files, sortField), [files, sortField]);

  // 行序号勾选：selectedRowKeys 存 id，需在 dataset 中按 id 找到序号
  const checkedIndexes = useMemo(
    () => selectedRowKeys
      .map((id) => sorted.findIndex((f) => f.id === id))
      .filter((i) => i >= 0),
    [selectedRowKeys, sorted]
  );

  const handleRowCheck = (row, checkedRows) => {
    const nextKeys = checkedRows
      .map((i) => sorted[i]?.id)
      .filter(Boolean);
    onSelectedRowKeysChange(nextKeys);
  };

  const handleRowAction = (file, key) => {
    if (key === "share") onShare(file);
    else if (key === "delete") onDelete([file.id]);
    else if (key === "download") setNotice({ type: "success", text: `正在下载「${file.name}.${file.ext}」` });
    else if (key === "rename") setNotice({ type: "default", text: `重命名「${file.name}」` });
    else if (key === "move") setNotice({ type: "default", text: `移动「${file.name}」到其他目录` });
    else if (key === "history") setNotice({ type: "default", text: `查看「${file.name}」的历史版本` });
  };

  const columns = [
    {
      title: "文件名",
      key: "name",
      allowSort: false,
      render: (_cell, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return (
          <div className="file-name-cell">
            <FileTypeIcon type={r.type} />
            <a
              className={`file-name-link${selectedFileId === r.id ? " file-name-link--active" : ""}`}
              onClick={(e) => { e.preventDefault(); onSelectFile(r.id); }}
              href="#"
            >
              {r.name}
            </a>
            <span className="file-ext">.{r.ext}</span>
          </div>
        );
      },
    },
    {
      title: "大小",
      key: "size",
      width: 110,
      align: "right",
      allowSort: false,
      render: (t) => <span className="cell-muted">{t}</span>,
    },
    {
      title: "更新人",
      key: "updater",
      width: 150,
      allowSort: false,
      render: (id) => {
        const u = userMap[id];
        return (
          <div className="updater-cell">
            <AvatarStack userIds={[id]} mode="single" size={22} />
            <span>{u ? u.name : "—"}</span>
          </div>
        );
      },
    },
    {
      title: "更新时间",
      key: "updateTime",
      width: 160,
      allowSort: false,
      render: (t) => <span className="cell-muted">{t}</span>,
    },
    {
      title: "共享状态",
      key: "shareStatus",
      width: 120,
      allowSort: false,
      render: (s) => <ShareStatusTag status={s} />,
    },
    {
      title: "操作",
      key: "action",
      width: 64,
      align: "left",
      allowSort: false,
      render: (_cell, _rd, _opt, row) => {
        const r = row?.rawData || {};
        return (
          <RowMoreMenu
            actions={ROW_ACTIONS}
            onSelect={(key) => handleRowAction(r, key)}
          />
        );
      },
    },
  ];

  const total = sorted.length;
  const selectedCount = selectedRowKeys.length;

  if (total === 0) {
    return (
      <div className="file-list-empty">
        <Empty type="success" description="该目录下暂无文件" />
      </div>
    );
  }

  return (
    <div className="file-list">
      {viewMode === "list" ? (
        <Table
          className="drive-table"
          size="large"
          columns={columns}
          dataset={sorted}
          enableZebraCrossing={false}
          width="unset"
          enableColumnCompareUpdate
          enableCheckBox
          checkType="multi"
          checkedRows={checkedIndexes}
          preserveCheckedRows
          onRowCheck={handleRowCheck}
          onHeaderCheck={handleRowCheck}
          onRowClick={(row) => onSelectFile(row?.rawData?.id)}
          enablePagination
          enableAutoPaging
          pageSize={pageSize}
          currentPage={currentPage}
          pageSizeOptions={[10, 20, 50]}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
        />
      ) : (
        <GridView
          files={sorted}
          selectedFileId={selectedFileId}
          onSelectFile={onSelectFile}
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeysChange={onSelectedRowKeysChange}
          onRowAction={handleRowAction}
        />
      )}
      {notice ? (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.text}
            display
            type={notice.type}
            text={notice.text}
            onClose={() => setNotice(null)}
          />
        </div>
      ) : null}
    </div>
  );
}

// 手写下拉菜单（替代 antd Dropdown）：点击展开绝对定位浮层
function RowMoreMenu({ actions, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="row-more"
      title="更多操作"
      onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      style={{ position: "relative", display: "inline-flex", cursor: "pointer" }}
    >
      <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />
      {open ? (
        <ul className="more-menu__popover" onClick={(e) => e.stopPropagation()}>
          {actions.map((it) =>
            it.divider ? (
              <li key={it.key} className="more-menu__divider" />
            ) : (
              <li
                key={it.key}
                className={`more-menu__item${it.danger ? " more-menu__item--danger" : ""}`}
                onClick={() => { onSelect(it.key); setOpen(false); }}
              >
                {it.icon}
                <span>{it.label}</span>
              </li>
            )
          )}
        </ul>
      ) : null}
    </span>
  );
}

function GridView({ files, selectedFileId, onSelectFile, selectedRowKeys, onSelectedRowKeysChange, onRowAction }) {
  const toggleSelect = (id) => {
    const next = selectedRowKeys.includes(id)
      ? selectedRowKeys.filter((k) => k !== id)
      : [...selectedRowKeys, id];
    onSelectedRowKeysChange(next);
  };

  return (
    <div className="file-grid">
      {files.map((f) => {
        const u = userMap[f.updaterId];
        const checked = selectedRowKeys.includes(f.id);
        return (
          <div
            key={f.id}
            className={`grid-card${selectedFileId === f.id ? " grid-card--active" : ""}${checked ? " grid-card--checked" : ""}`}
            onClick={() => onSelectFile(f.id)}
          >
            <div className="grid-card-top">
              <Checkbox
                checked={checked}
                value={f.id}
                onClick={(e) => e.stopPropagation && e.stopPropagation()}
                onChange={(_value, isChecked) => toggleSelect(f.id)}
              />
              <RowMoreMenu
                actions={ROW_ACTIONS}
                onSelect={(key) => onRowAction(f, key)}
              />
            </div>
            <div className="grid-card-icon">
              <FileTypeIcon type={f.type} size="2rem" />
            </div>
            <div className="grid-card-name" title={`${f.name}.${f.ext}`}>
              {f.name}
              <span className="file-ext">.{f.ext}</span>
            </div>
            <div className="grid-card-meta">
              <ShareStatusTag status={f.shareStatus} />
              <span className="cell-muted">{f.sizeText}</span>
            </div>
            <div className="grid-card-foot">
              <span className="cell-muted">{u ? u.name : "—"} · {f.updateTime.slice(5)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

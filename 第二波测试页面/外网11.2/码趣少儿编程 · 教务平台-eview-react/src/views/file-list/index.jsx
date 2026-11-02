import { useMemo, useState } from "react";
import { IconPlusIcPublicEllipsis } from '@hui/icon-plus';
import Table from "@nce/eview-react/Table";
import Checkbox from "@nce/eview-react/Checkbox";
import Empty from "@nce/eview-react/Empty";
import DivMessage from "@nce/eview-react/DivMessage";
import SimpleDropdown from "../../components/simple-dropdown/index.jsx";
import { userMap } from "../../mock/drive.js";
import FileTypeIcon from "../../components/file-type-icon/index.jsx";
import ShareStatusTag from "../../components/share-status-tag/index.jsx";
import AvatarStack from "../../components/avatar-stack/index.jsx";
import "./index.css";

const ROW_ACTIONS = [
  { key: "download", label: "下载", icon: "download" },
  { key: "rename", label: "重命名", icon: "pencil" },
  { key: "move", label: "移动", icon: "move" },
  { type: "divider" },
  { key: "share", label: "分享", icon: "share-2" },
  { key: "history", label: "历史版本", icon: "file-clock" },
  { type: "divider" },
  { key: "delete", label: "删除", icon: "trash-2", danger: true },
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
  const [notice, setNotice] = useState(null);

  const sorted = useMemo(() => sortFiles(files, sortField), [files, sortField]);

  const selectedIndexes = sorted
    .map((f, i) => (selectedRowKeys.includes(f.id) ? i : -1))
    .filter((i) => i >= 0);

  const handleRowAction = (file, key) => {
    if (key === "share") onShare(file);
    else if (key === "delete") onDelete([file.id]);
    else if (key === "download") setNotice({ type: "success", text: `正在下载「${file.name}.${file.ext}」`, key: Date.now() });
    else if (key === "rename") setNotice({ type: "info", text: `重命名「${file.name}」`, key: Date.now() });
    else if (key === "move") setNotice({ type: "info", text: `移动「${file.name}」到其他目录`, key: Date.now() });
    else if (key === "history") setNotice({ type: "info", text: `查看「${file.name}」的历史版本`, key: Date.now() });
  };

  const columns = [
    {
      title: "文件名",
      key: "name",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        return (
          <div className="file-name-cell">
            <FileTypeIcon type={r?.type} />
            <a
              className={`file-name-link${selectedFileId === r?.id ? " file-name-link--active" : ""}`}
              onClick={(e) => { e.preventDefault(); onSelectFile(r?.id); }}
              href="#"
            >
              {r?.name}
            </a>
            <span className="file-ext">.{r?.ext}</span>
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
      render: (cell) => <span className="cell-muted">{cell}</span>,
    },
    {
      title: "更新人",
      key: "updater",
      width: 150,
      allowSort: false,
      render: (cell) => {
        const u = userMap[cell];
        return (
          <div className="updater-cell">
            <AvatarStack userIds={[cell]} mode="single" size={22} />
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
      render: (cell) => <span className="cell-muted">{cell}</span>,
    },
    {
      title: "共享状态",
      key: "shareStatus",
      width: 120,
      allowSort: false,
      render: (cell) => <ShareStatusTag status={cell} />,
    },
    {
      title: "操作",
      key: "action",
      width: 64,
      align: "left",
      allowSort: false,
      render: (cell, rowData, options, row) => {
        const r = row?.rawData;
        if (!r) return null;
        return (
          <SimpleDropdown
            items={ROW_ACTIONS}
            onSelect={(key) => handleRowAction(r, key)}
            placement="bottomRight"
          >
            <span className="row-more" title="更多操作">
              <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />
            </span>
          </SimpleDropdown>
        );
      },
    },
  ];

  const total = sorted.length;

  if (total === 0) {
    return (
      <div className="file-list-empty">
        <Empty description="该目录下暂无文件" />
      </div>
    );
  }

  return (
    <div className="file-list">
      {notice && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}>
          <DivMessage
            key={notice.key}
            display
            type={notice.type}
            text={notice.text}
            enableDisposeTimeOut={notice.type !== "error"}
            onClose={() => setNotice(null)}
          />
        </div>
      )}
      {viewMode === "list" ? (
        <Table
          className="drive-table"
          size="large"
          columns={columns}
          dataset={sorted}
          enableCheckBox
          checkedRows={selectedIndexes}
          onRowCheck={(row, checkedRows) => {
            const ids = checkedRows.map((i) => sorted[i]?.id).filter(Boolean);
            onSelectedRowKeysChange(ids);
          }}
          onRow={(row) => ({ onClick: () => { const r = row?.rawData ?? row; if (r?.id) onSelectFile(r.id); } })}
          enableZebraCrossing={false}
          enableColumnCompareUpdate
          width="unset"
          enablePagination
          enableAutoPaging
          pagingProps={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
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
    </div>
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
                onClick={(e) => e.stopPropagation()}
                onChange={(value, isChecked) => toggleSelect(f.id)}
              />
              <SimpleDropdown
                items={ROW_ACTIONS}
                onSelect={(key) => { onRowAction(f, key); }}
                placement="bottomRight"
              >
                <span className="row-more" onClick={(e) => e.stopPropagation()} title="更多操作">
                  <IconPlusIcPublicEllipsis iconSize="0.875rem" iconColor={['currentcolor']} />
                </span>
              </SimpleDropdown>
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

import { useMemo, useState } from "react";
import { Table, Dropdown, Checkbox, Empty, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sorted = useMemo(() => sortFiles(files, sortField), [files, sortField]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => onSelectedRowKeysChange(keys),
    preserveSelectedRowKeys: true,
  };

  const handleRowAction = (file, key) => {
    if (key === "share") onShare(file);
    else if (key === "delete") onDelete([file.id]);
    else if (key === "download") message.success(`正在下载「${file.name}.${file.ext}」`);
    else if (key === "rename") message.info(`重命名「${file.name}」`);
    else if (key === "move") message.info(`移动「${file.name}」到其他目录`);
    else if (key === "history") message.info(`查看「${file.name}」的历史版本`);
  };

  const columns = [
    {
      title: "文件名",
      dataIndex: "name",
      key: "name",
      sorter: false,
      render: (_, r) => (
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
      ),
    },
    {
      title: "大小",
      dataIndex: "sizeText",
      key: "size",
      width: 110,
      align: "right",
      render: (t) => <span className="cell-muted">{t}</span>,
    },
    {
      title: "更新人",
      dataIndex: "updaterId",
      key: "updater",
      width: 150,
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
      dataIndex: "updateTime",
      key: "updateTime",
      width: 160,
      render: (t) => <span className="cell-muted">{t}</span>,
    },
    {
      title: "共享状态",
      dataIndex: "shareStatus",
      key: "shareStatus",
      width: 120,
      render: (s) => <ShareStatusTag status={s} />,
    },
    {
      title: "操作",
      key: "action",
      width: 64,
      align: "left",
      render: (_, r) => (
        <Dropdown
          menu={{ items: ROW_ACTIONS, onClick: ({ key }) => handleRowAction(r, key) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <span className="row-more" title="更多操作">
            <Icon name="ellipsis" size="0.875rem" />
          </span>
        </Dropdown>
      ),
    },
  ];

  const total = sorted.length;
  const selectedCount = selectedRowKeys.length;

  if (total === 0) {
    return (
      <div className="file-list-empty">
        <Empty description="该目录下暂无文件" />
      </div>
    );
  }

  return (
    <div className="file-list">
      {viewMode === "list" ? (
        <Table
          className="drive-table"
          size="large"
          rowKey="id"
          columns={columns}
          dataSource={sorted}
          rowSelection={rowSelection}
          showSorterTooltip={false}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: { goButton: "跳转" },
            hideOnSinglePage: true,
            showTotal: selectedCount > 0
              ? () => `总记录数：${total}　已选中行数：${selectedCount}`
              : (t) => `总记录数：${t}`,
            onChange: (p) => setCurrentPage(p),
            onShowSizeChange: (_, s) => { setPageSize(s); setCurrentPage(1); },
            size: "default",
          }}
          onRow={(r) => ({ onClick: () => onSelectFile(r.id) })}
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
                onChange={() => toggleSelect(f.id)}
              />
              <Dropdown
                menu={{ items: ROW_ACTIONS, onClick: ({ key }) => { onRowAction(f, key); } }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <span className="row-more" onClick={(e) => e.stopPropagation()} title="更多操作">
                  <Icon name="ellipsis" size="0.875rem" />
                </span>
              </Dropdown>
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

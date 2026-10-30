// App entry — 企业网盘文档管理页
// Layer 5 layout：Provider + ConfigProvider + 工作区装配 + 全局交互状态

import { useState, useEffect, useMemo } from "react";
import { ConfigProvider, Empty, Modal, Button, message } from "antd";
import zhCN from "./assets/shared/antd-zh.js";
import { AppProvider } from "./src/context.jsx";
import {
  files,
  getTreePath,
} from "./src/mock/drive.js";

import HeaderBar from "./src/views/header-bar/index.jsx";
import Toolbar from "./src/views/toolbar/index.jsx";
import SpaceTree from "./src/views/space-tree/index.jsx";
import FileList from "./src/views/file-list/index.jsx";
import DetailPanel from "./src/views/detail-panel/index.jsx";
import RecentAccess from "./src/views/recent-access/index.jsx";
import StorageBar from "./src/views/storage-bar/index.jsx";
import ShareModal from "./src/views/share-modal/index.jsx";
import BatchBar from "./src/views/batch-bar/index.jsx";

import "./app.css";

export default function App() {
  const [fileList, setFileList] = useState(files);
  const [treeSelectedKey, setTreeSelectedKey] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [sortField, setSortField] = useState("updateTime");
  const [selectedFileId, setSelectedFileId] = useState(files[0].id);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [shareFile, setShareFile] = useState(null);
  const [deleteTargets, setDeleteTargets] = useState(null);

  const breadcrumb = useMemo(() => getTreePath(treeSelectedKey), [treeSelectedKey]);

  const filteredFiles = useMemo(() => {
    if (!treeSelectedKey) return fileList;
    return fileList.filter((f) => f.spacePath.includes(treeSelectedKey));
  }, [fileList, treeSelectedKey]);

  const selectedFile = useMemo(
    () => fileList.find((f) => f.id === selectedFileId) || null,
    [fileList, selectedFileId]
  );

  // 切换目录 / 删除后：若当前详情文件不在视图中，回退到首项
  useEffect(() => {
    if (filteredFiles.length && !filteredFiles.find((f) => f.id === selectedFileId)) {
      setSelectedFileId(filteredFiles[0].id);
    } else if (filteredFiles.length === 0) {
      setSelectedFileId(null);
    }
  }, [filteredFiles, selectedFileId]);

  const handleNew = (type) => {
    const labelMap = { folder: "文件夹", doc: "文档", sheet: "表格", slide: "演示", upload: "上传" };
    if (type === "upload") message.success("已打开文件选择器");
    else message.success(`已新建${labelMap[type] || type}`);
  };

  const handleNodeAction = (node, action) => {
    if (action === "delete") {
      message.warning(`目录「${node.name}」需在管理后台删除`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTargets) return;
    const removedCount = deleteTargets.length;
    setFileList((prev) => prev.filter((f) => !deleteTargets.includes(f.id)));
    setSelectedRowKeys((prev) => prev.filter((k) => !deleteTargets.includes(k)));
    setDeleteTargets(null);
    message.success(`已删除 ${removedCount} 个文件，可在回收站恢复`);
  };

  const handleBatchMove = () => {
    message.info(`正在移动 ${selectedRowKeys.length} 个文件`);
  };
  const handleBatchDownload = () => {
    message.success(`已开始打包下载 ${selectedRowKeys.length} 个文件`);
    setSelectedRowKeys([]);
  };

  const deleteNames = deleteTargets
    ? deleteTargets.map((id) => fileList.find((f) => f.id === id)).filter(Boolean)
    : [];

  return (
    <AppProvider>
      <ConfigProvider
        locale={zhCN}
        wave={{ disabled: true }}
        renderEmpty={() => <Empty style={{ padding: "2rem 0" }} />}
        empty={{ image: "./assets/uploads/empty.svg" }}
        spin={{ indicator: <img src="./assets/uploads/loading.svg" alt="" className="custom-spin-indicator" /> }}
      >
        <div className="app-root">
          <HeaderBar />

          <div className="workspace">
            <SpaceTree
              selectedKey={treeSelectedKey}
              onSelect={setTreeSelectedKey}
              onNodeAction={handleNodeAction}
            />

            <main className="center-column">
              <Toolbar
                breadcrumb={breadcrumb}
                viewMode={viewMode}
                onViewChange={setViewMode}
                sortField={sortField}
                onSortChange={setSortField}
                onBreadcrumb={(key) => setTreeSelectedKey(key)}
                onNew={handleNew}
              />

              <div className="list-region">
                <FileList
                  files={filteredFiles}
                  viewMode={viewMode}
                  sortField={sortField}
                  selectedFileId={selectedFileId}
                  onSelectFile={setSelectedFileId}
                  selectedRowKeys={selectedRowKeys}
                  onSelectedRowKeysChange={setSelectedRowKeys}
                  onShare={setShareFile}
                  onDelete={(ids) => setDeleteTargets(ids)}
                />
                <div className="batch-bar-slot">
                  <BatchBar
                    count={selectedRowKeys.length}
                    onMove={handleBatchMove}
                    onDelete={() => setDeleteTargets([...selectedRowKeys])}
                    onDownload={handleBatchDownload}
                    onClear={() => setSelectedRowKeys([])}
                  />
                </div>
              </div>

              <RecentAccess onSelectFile={setSelectedFileId} />
            </main>

            <DetailPanel file={selectedFile} onShare={setShareFile} />
          </div>

          <StorageBar onExpand={() => message.info("正在跳转扩容套餐")} />

          <ShareModal open={!!shareFile} file={shareFile} onClose={() => setShareFile(null)} />

          <Modal
            title="确认删除"
            open={!!deleteTargets}
            onCancel={() => setDeleteTargets(null)}
            width={420}
            footer={
              <div className="del-modal-foot">
                <Button onClick={() => setDeleteTargets(null)}>取消</Button>
                <Button danger type="primary" onClick={confirmDelete}>删除</Button>
              </div>
            }
          >
            {deleteTargets && (
              <div className="del-modal-body">
                <p className="del-modal-tip">
                  将删除以下 <strong>{deleteTargets.length}</strong> 个文件，删除后可在回收站 30 天内恢复：
                </p>
                <ul className="del-modal-list">
                  {deleteNames.map((f) => (
                    <li key={f.id}>
                      <span>{f.name}</span>
                      <span className="file-ext">.{f.ext}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Modal>
        </div>
      </ConfigProvider>
    </AppProvider>
  );
}

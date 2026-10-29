import { Breadcrumb, Button, Dropdown, Tooltip } from "antd";
import { useApp } from "../../context.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// 面包屑 + 顶部操作区（邀请成员 / 批量导入 / 导出 / 新建部门）
export default function PageBreadcrumb() {
  const { setModal, selectedRowKeys, currentDept } = useApp();

  const importMenu = {
    items: [
      { key: "template", label: "下载导入模板", icon: <Icon name="file-down" size="0.875rem" /> },
      { type: "divider" },
      { key: "upload", label: "上传 Excel 文件", icon: <Icon name="file-up" size="0.875rem" /> },
      { key: "csv", label: "上传 CSV 文件", icon: <Icon name="file-up" size="0.875rem" /> },
    ],
  };

  const exportMenu = {
    items: [
      { key: "all", label: "全部成员", icon: <Icon name="users" size="0.875rem" /> },
      { key: "dept", label: "当前部门成员", icon: <Icon name="users-round" size="0.875rem" /> },
      { type: "divider" },
      { key: "perm", label: "权限矩阵", icon: <Icon name="grid-3x3" size="0.875rem" /> },
    ],
  };

  return (
    <div className="page-breadcrumb">
      <div className="page-breadcrumb__left">
        <Breadcrumb
          items={[
            { title: "管理中心" },
            { title: "组织与权限" },
            { title: currentDept?.title || "—" },
          ]}
        />
        <h2 className="page-breadcrumb__title">
          组织与权限
          <span className="page-breadcrumb__title-sub">维护企业组织架构、成员账号与功能权限矩阵</span>
        </h2>
      </div>
      <div className="page-breadcrumb__right">
        {selectedRowKeys.length > 0 && (
          <Button onClick={() => setModal("transfer")}>
            <Icon name="folder-symlink" size="0.875rem" />
            批量调岗（{selectedRowKeys.length}）
          </Button>
        )}
        <Dropdown menu={importMenu} placement="bottomRight" trigger={["click"]}>
          <Button>
            <Icon name="upload" size="0.875rem" />
            批量导入
          </Button>
        </Dropdown>
        <Dropdown menu={exportMenu} placement="bottomRight" trigger={["click"]}>
          <Button>
            <Icon name="download" size="0.875rem" />
            导出
          </Button>
        </Dropdown>
        <Tooltip title="在所选部门下创建子部门或小组">
          <Button onClick={() => setModal("department")}>
            <Icon name="folder-plus" size="0.875rem" />
            新建部门
          </Button>
        </Tooltip>
        <Button type="primary" onClick={() => setModal("invite")}>
          <Icon name="user-plus" size="0.875rem" />
          邀请成员
        </Button>
      </div>
    </div>
  );
}

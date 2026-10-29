import Crumbs from "@/shared/Crumbs";
import Button from "@nce/eview-react/Button";
import TipBox from "@nce/eview-react/TipBox";
import DropdownMenu from "../../components/dropdown-menu/index.jsx";
import { useApp } from "../../context.jsx";
import {
  IconPlusIcPublicDownload,
  IconPlusIcPublicFileDown,
  IconPlusIcPublicFileUp,
  IconPlusIcPublicFolderPlus,
  IconPlusIcPublicGrid3x3,
  IconPlusIcPublicUpload,
  IconPlusIcPublicUserPlus,
  IconPlusIcPublicUsers,
  IconPlusIcIctFolderSymlink,
  IconPlusIcIctUsersRound,
} from '@hui/icon-plus';
import "./index.css";

// 面包屑 + 顶部操作区（邀请成员 / 批量导入 / 导出 / 新建部门）
export default function PageBreadcrumb() {
  const { setModal, selectedRowKeys, currentDept } = useApp();

  const importItems = [
    { key: "template", label: "下载导入模板", icon: <IconPlusIcPublicFileDown iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { type: "divider" },
    { key: "upload", label: "上传 Excel 文件", icon: <IconPlusIcPublicFileUp iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "csv", label: "上传 CSV 文件", icon: <IconPlusIcPublicFileUp iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];

  const exportItems = [
    { key: "all", label: "全部成员", icon: <IconPlusIcPublicUsers iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { key: "dept", label: "当前部门成员", icon: <IconPlusIcIctUsersRound iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { type: "divider" },
    { key: "perm", label: "权限矩阵", icon: <IconPlusIcPublicGrid3x3 iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];

  return (
    <div className="page-breadcrumb">
      <div className="page-breadcrumb__left">
        <Crumbs
          data={[
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
          <Button
            leftIcon={<IconPlusIcIctFolderSymlink iconSize="0.875rem" iconColor={['currentcolor']} />}
            text={`批量调岗（${selectedRowKeys.length}）`}
            onClick={() => setModal("transfer")}
          />
        )}
        <DropdownMenu items={importItems} placement="bottomRight">
          <Button leftIcon={<IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} />} text="批量导入" />
        </DropdownMenu>
        <DropdownMenu items={exportItems} placement="bottomRight">
          <Button leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} text="导出" />
        </DropdownMenu>
        <TipBox content="在所选部门下创建子部门或小组">
          <Button
            leftIcon={<IconPlusIcPublicFolderPlus iconSize="0.875rem" iconColor={['currentcolor']} />}
            text="新建部门"
            onClick={() => setModal("department")}
          />
        </TipBox>
        <Button
          status="primary"
          leftIcon={<IconPlusIcPublicUserPlus iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="邀请成员"
          onClick={() => setModal("invite")}
        />
      </div>
    </div>
  );
}

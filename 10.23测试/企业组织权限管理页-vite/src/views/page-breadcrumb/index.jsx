import Crumbs from "@nce/eview-react/Crumbs";
import { IconPlusIcPublicDownload, IconPlusIcPublicUpload, IconPlusIcPublicTeams, IconPlusIcDigitalPowerDpUserCluster, IconPlusIcPublicDashboard, IconPlusIcPublicFolder, IconPlusIcIctNewFolder, IconPlusIcPublicAddMember } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import PopUpMenu from "@nce/eview-react/PopUpMenu";
import TipBox from "@nce/eview-react/TipBox";
import { useApp } from "../../context.jsx";
import "./index.css";

// 面包屑 + 顶部操作区（邀请成员 / 批量导入 / 导出 / 新建部门）
export default function PageBreadcrumb() {
  const { setModal, selectedRowKeys, currentDept } = useApp();

  const importOptions = [
    { id: "template", text: "下载导入模板", serialno: "template", iconUrl: <IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "upload", text: "上传 Excel 文件", serialno: "upload", iconUrl: <IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "csv", text: "上传 CSV 文件", serialno: "csv", iconUrl: <IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} /> },
  ];

  const exportOptions = [
    { id: "all", text: "全部成员", serialno: "all", iconUrl: <IconPlusIcPublicTeams iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "dept", text: "当前部门成员", serialno: "dept", iconUrl: <IconPlusIcDigitalPowerDpUserCluster iconSize="0.875rem" iconColor={['currentcolor']} /> },
    { id: "perm", text: "权限矩阵", serialno: "perm", iconUrl: <IconPlusIcPublicDashboard iconSize="0.875rem" iconColor={['currentcolor']} /> },
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
          <Button leftIcon={<IconPlusIcPublicFolder iconSize="0.875rem" iconColor={['currentcolor']} />} text={`批量调岗（${selectedRowKeys.length}）`} onClick={() => setModal("transfer")} />
        )}
        <PopUpMenu options={importOptions}>
          <Button leftIcon={<IconPlusIcPublicUpload iconSize="0.875rem" iconColor={['currentcolor']} />} text="批量导入" />
        </PopUpMenu>
        <PopUpMenu options={exportOptions}>
          <Button leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} text="导出" />
        </PopUpMenu>
        <TipBox content="在所选部门下创建子部门或小组" direction="top">
          <Button leftIcon={<IconPlusIcIctNewFolder iconSize="0.875rem" iconColor={['currentcolor']} />} text="新建部门" onClick={() => setModal("department")} />
        </TipBox>
        <Button status="primary" leftIcon={<IconPlusIcPublicAddMember iconSize="0.875rem" iconColor={['currentcolor']} />} text="邀请成员" onClick={() => setModal("invite")} />
      </div>
    </div>
  );
}

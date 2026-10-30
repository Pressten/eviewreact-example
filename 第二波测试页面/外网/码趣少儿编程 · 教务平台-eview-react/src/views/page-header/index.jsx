// Layer 4: 页面头部（面包屑 + 标题 + 操作区）
import Crumbs from "@/shared/Crumbs";
import { IconPlusIcPublicDownload, IconPlusIcPublicAddMember } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import "./index.css";

export default function PageHeader({ onExport }) {
  return (
    <div className="page-header">
      <Crumbs
        data={[
          { title: "首页" },
          { title: "教务管理" },
          { title: "学员管理" },
        ]}
      />
      <div className="page-header__row">
        <div className="page-header__title-wrap">
          <h1 className="page-header__title">学员管理</h1>
          <p className="page-header__desc">
            管理在读学员信息、课时进度与续费提醒，点击学员姓名可查看上课记录、作品集与老师点评
          </p>
        </div>
        <div className="page-header__actions">
          <Button leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} text="导出名册" onClick={onExport} />
          <Button status="primary" leftIcon={<IconPlusIcPublicAddMember iconSize="0.875rem" iconColor={['currentcolor']} />} text="新增学员" />
        </div>
      </div>
    </div>
  );
}

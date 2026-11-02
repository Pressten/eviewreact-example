// Layer 4: 页面头部（面包屑 + 标题 + 操作区）
import Crumbs from "@nce/eview-react/Crumbs";
import Button from "@nce/eview-react/Button";
import Icon from "@/shared/Icon";
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
          <Button leftIcon={<Icon name="download" size="0.875rem" />} onClick={onExport} text="导出名册" />
          <Button status="primary" leftIcon={<Icon name="user-plus" size="0.875rem" />} text="新增学员" />
        </div>
      </div>
    </div>
  );
}

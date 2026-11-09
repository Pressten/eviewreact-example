// Layer 4: 页面头部（面包屑 + 标题 + 操作区）
import { Breadcrumb, Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function PageHeader({ onExport }) {
  return (
    <div className="page-header">
      <Breadcrumb
        items={[
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
          <Button icon={<Icon name="download" size="0.875rem" />} onClick={onExport}>
            导出名册
          </Button>
          <Button type="primary" icon={<Icon name="user-plus" size="0.875rem" />}>
            新增学员
          </Button>
        </div>
      </div>
    </div>
  );
}

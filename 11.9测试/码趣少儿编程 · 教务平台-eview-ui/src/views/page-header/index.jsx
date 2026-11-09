import Crumbs from "eview-ui/Crumbs";
import Button from "eview-ui/Button";
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
          <Button onClick={onExport}>
            <Icon name="download" size="0.875rem" />
            <span style={{ marginLeft: "0.25rem" }}>导出名册</span>
          </Button>
          <Button status="primary">
            <Icon name="user-plus" size="0.875rem" />
            <span style={{ marginLeft: "0.25rem" }}>新增学员</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Breadcrumb, Button, Tooltip } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 4: 页面标题区 — 面包屑 + 标题 + 操作
export default function PageHeader({ draftSaved, onSaveDraft, onOpenTemplate, onSubmit }) {
  return (
    <header className="page-head">
      <div className="page-head__main">
        <Breadcrumb
          items={[
            { title: "首页" },
            { title: "工单中心" },
            { title: "新建巡检工单" },
          ]}
        />
        <div className="page-head__title-row">
          <h1 className="page-head__title">新建巡检工单</h1>
          <span className="page-head__badge">
            <Icon name="square-pen" size="0.75rem" />
            {draftSaved ? "草稿已保存" : "草稿未保存"}
          </span>
        </div>
        <p className="page-head__desc">
          按机房巡检规范填写工单信息，提交后进入班组审核流程；带 <em>*</em> 的字段为必填项。
        </p>
      </div>

      <div className="page-head__actions">
        <Tooltip title="套用已保存的填报模板">
          <Button icon={<Icon name="file-clock" size="0.875rem" />} onClick={onOpenTemplate}>
            套用模板
          </Button>
        </Tooltip>
        <Button icon={<Icon name="save" size="0.875rem" />} onClick={onSaveDraft}>
          保存草稿
        </Button>
        <Button type="primary" icon={<Icon name="send" size="0.875rem" />} onClick={onSubmit}>
          提交工单
        </Button>
      </div>
    </header>
  );
}

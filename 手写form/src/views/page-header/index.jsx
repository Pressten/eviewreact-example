// Layer 4 — 页面标题与操作区

import { Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function PageHeader({ onFill, onReset, onSave, onSubmit, onSubmitAndNew }) {
  return (
    <header className="page-header">
      <div className="page-header__main">
        <nav className="page-header__crumb">
          <span>运维中心</span>
          <Icon name="chevron-right" size="0.75rem" />
          <span>工单管理</span>
          <Icon name="chevron-right" size="0.75rem" />
          <span className="page-header__crumb-current">新建工单</span>
        </nav>
        <h1 className="page-header__title">新建运维工单</h1>
        <div className="page-header__meta">
          <span className="page-header__no">
            <Icon name="hash" size="0.75rem" />
            工单号提交后自动生成
          </span>
          <span className="page-header__sep" />
          <span className="page-header__no">
            <Icon name="clock" size="0.75rem" />
            草稿自动保存于 09-29 10:24
          </span>
        </div>
      </div>

      <div className="page-header__actions">
        <Button icon={<Icon name="sparkles" size="0.875rem" />} onClick={onFill}>智能填充</Button>
        <Button icon={<Icon name="eraser" size="0.875rem" />} onClick={onReset}>清空重填</Button>
        <Button icon={<Icon name="save" size="0.875rem" />} onClick={onSave}>暂存草稿</Button>
        <Button type="primary" icon={<Icon name="send" size="0.875rem" />} onClick={onSubmit}>提交工单</Button>
        <Button type="primary" onClick={onSubmitAndNew}>提交并新建</Button>
      </div>
    </header>
  );
}

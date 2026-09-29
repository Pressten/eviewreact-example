// Layer 4 — 页面标题与操作区

import Button from "@nce/eview-react/Button";
import { IconPlusIcIctRightArrow, IconPlusIcPublicStar, IconPlusIcPublicEraser, IconPlusIcPublicDisk, IconPlusIcPublicSend, IconPlusIcIctIdcard, IconPlusIcPublicClock } from "@nce/icon-plus";
import "./index.css";

const iconColor = ["currentcolor"];

export default function PageHeader({ onFill, onReset, onSave, onSubmit, onSubmitAndNew }) {
  return (
    <header className="page-header">
      <div className="page-header__main">
        <nav className="page-header__crumb">
          <span>运维中心</span>
          <IconPlusIcIctRightArrow iconSize="0.75rem" iconColor={iconColor} />
          <span>工单管理</span>
          <IconPlusIcIctRightArrow iconSize="0.75rem" iconColor={iconColor} />
          <span className="page-header__crumb-current">新建工单</span>
        </nav>
        <h1 className="page-header__title">新建运维工单</h1>
        <div className="page-header__meta">
          <span className="page-header__no">
            <IconPlusIcIctIdcard iconSize="0.75rem" iconColor={iconColor} />
            工单号提交后自动生成
          </span>
          <span className="page-header__sep" />
          <span className="page-header__no">
            <IconPlusIcPublicClock iconSize="0.75rem" iconColor={iconColor} />
            草稿自动保存于 09-29 10:24
          </span>
        </div>
      </div>

      <div className="page-header__actions">
        <Button leftIcon={<IconPlusIcPublicStar iconSize="0.875rem" iconColor={iconColor} />} onClick={onFill} text="智能填充" />
        <Button leftIcon={<IconPlusIcPublicEraser iconSize="0.875rem" iconColor={iconColor} />} onClick={onReset} text="清空重填" />
        <Button leftIcon={<IconPlusIcPublicDisk iconSize="0.875rem" iconColor={iconColor} />} onClick={onSave} text="暂存草稿" />
        <Button leftIcon={<IconPlusIcPublicSend iconSize="0.875rem" iconColor={iconColor} />} onClick={onSubmit} text="提交工单" />
        <Button onClick={onSubmitAndNew} text="提交并新建" />
      </div>
    </header>
  );
}

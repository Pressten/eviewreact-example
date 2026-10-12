// Layer 3: 分区面板 — 标题 + 说明 + 右侧 toggle（Switch）
// toggleable 时由 Switch 控制子填充区域显隐；非 toggleable 时内容常显。
import Toggle from "@nce/eview-react/Toggle";
import { IconPlusIcPublicProhibitCircle } from '@nce/icon-plus';
import "./index.css";

export default function SectionPanel({
  index,
  icon,
  title,
  description,
  toggleable = false,
  checked = true,
  onToggle,
  meta,
  children,
}) {
  const open = toggleable ? checked : true;

  return (
    <section className={`section-panel${open ? " is-open" : ""}`}>
      <header className="section-panel__head">
        <span className="section-panel__index">{index}</span>
        {icon ? (
          <span className="section-panel__icon">
            {icon}
          </span>
        ) : null}
        <div className="section-panel__titles">
          <h3 className="section-panel__title">{title}</h3>
          {description ? <p className="section-panel__desc">{description}</p> : null}
        </div>
        <div className="section-panel__tools">
          {meta}
          {toggleable ? (
            <div className="section-panel__toggle">
              <span className="section-panel__toggle-label">{checked ? "已开启" : "已关闭"}</span>
              <Toggle data={[false, true]} toggled={checked} onToggle={onToggle} />
            </div>
          ) : null}
        </div>
      </header>

      {open ? (
        <div className="section-panel__body">{children}</div>
      ) : (
        <div className="section-panel__collapsed">
          <IconPlusIcPublicProhibitCircle iconSize="0.875rem" iconColor={['currentcolor']} />
          该子区域未开启填写，打开右上角开关即可补充信息
        </div>
      )}
    </section>
  );
}

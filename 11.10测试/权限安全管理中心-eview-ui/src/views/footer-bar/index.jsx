import { useRef } from "react";
import Button from "@cloudsop/eview-ui/Button";
import Tooltip from "@cloudsop/eview-ui/Tooltip";
import Icon from "@/shared/Icon";
import AppBadge from "@/shared/AppBadge";
import Notify from "@/shared/Notify";
import { useApp } from "../../context.jsx";
import "./index.css";

const BREAKDOWN_LABELS = [
  ["matrix", "权限矩阵"],
  ["roleInfo", "角色信息"],
  ["policy", "安全策略"],
  ["scope", "数据范围"],
  ["exceptions", "例外授权"],
  ["members", "成员变更"],
];

export default function FooterBar() {
  const { changeCount, changeBreakdown, saveAll, resetAll } = useApp();
  const notifyRef = useRef(null);

  const breakdownRows = BREAKDOWN_LABELS.map(([key, label]) => ({
    key,
    label,
    count: changeBreakdown[key] || 0,
  })).filter((r) => r.count > 0);

  const handleSave = () => {
    const n = changeCount;
    saveAll();
    notifyRef.current && notifyRef.current.show("success", `已保存 ${n} 项变更，权限与安全策略即时生效`);
  };

  const handleReset = () => {
    resetAll();
    notifyRef.current && notifyRef.current.show("info", "已恢复至上次保存的配置，未保存变更已丢弃");
  };

  const breakdownContent = (
    <div className="cb-list">
      {(breakdownRows || []).map((r) => (
        <div className="cb-row" key={r.key}>
          <span>{r.label}</span>
          <b>{r.count} 项</b>
        </div>
      ))}
    </div>
  );

  return (
    <footer className="footer-bar">
      <Notify ref={notifyRef} />
      <div className="footer-inner">
        <div className="footer-status">
          {changeCount > 0 ? (
            <>
              <Icon name="circle-alert" size="1rem" className="warn-icon" />
              {/* Popover→Tooltip：trigger="click" + content 自定义 */}
              <Tooltip content={breakdownContent} trigger="click" placement="topLeft">
                <span className="change-chip">
                  未保存变更 <b>{changeCount}</b> 项
                </span>
              </Tooltip>
              <span className="footer-note">点击可查看变更明细 · 涵盖权限矩阵 / 安全策略 / 数据权限 / 成员调整</span>
            </>
          ) : (
            <>
              <Icon name="circle-check-big" size="1rem" className="ok-icon" />
              <span className="ok-chip">全部配置已保存</span>
              <span className="footer-note">与线上策略一致</span>
            </>
          )}
          {/* Tooltip：title→content；placement 同名 */}
          <Tooltip
            content="权限矩阵与安全策略保存后立即生效；成员在线会话将在下一次操作时应用新策略；成员角色调整与移除保存后即时同步组织架构人数。"
            placement="top"
          >
            <span className="effect-tip">
              <Icon name="info" size="0.875rem" />
              变更生效说明
            </span>
          </Tooltip>
        </div>
        <div className="footer-actions">
          {/* Button 带 Icon：用 children 组合（leftIcon 是 url 字符串不匹配 Icon shim） */}
          <Button disabled={changeCount === 0} onClick={handleReset}>
            <Icon name="rotate-ccw" size="0.875rem" />
            重置
          </Button>
          <AppBadge count={changeCount} offset={[-6, 6]} color="var(--primary)">
            <Button
              status="primary"
              disabled={changeCount === 0}
              onClick={handleSave}
            >
              <Icon name="save" size="0.875rem" />
              保存变更
            </Button>
          </AppBadge>
        </div>
      </div>
    </footer>
  );
}

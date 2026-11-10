import { Button, Badge, Tooltip, Popover, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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

  const breakdownRows = BREAKDOWN_LABELS.map(([key, label]) => ({
    key,
    label,
    count: changeBreakdown[key] || 0,
  })).filter((r) => r.count > 0);

  const handleSave = () => {
    const n = changeCount;
    saveAll();
    message.success(`已保存 ${n} 项变更，权限与安全策略即时生效`);
  };

  const handleReset = () => {
    resetAll();
    message.info("已恢复至上次保存的配置，未保存变更已丢弃");
  };

  return (
    <footer className="footer-bar">
      <div className="footer-inner">
        <div className="footer-status">
          {changeCount > 0 ? (
            <>
              <Icon name="circle-alert" size="1rem" className="warn-icon" />
              <Popover
                placement="topLeft"
                title="变更明细"
                content={
                  <div className="cb-list">
                    {breakdownRows.map((r) => (
                      <div className="cb-row" key={r.key}>
                        <span>{r.label}</span>
                        <b>{r.count} 项</b>
                      </div>
                    ))}
                  </div>
                }
              >
                <span className="change-chip">
                  未保存变更 <b>{changeCount}</b> 项
                </span>
              </Popover>
              <span className="footer-note">点击可查看变更明细 · 涵盖权限矩阵 / 安全策略 / 数据权限 / 成员调整</span>
            </>
          ) : (
            <>
              <Icon name="circle-check-big" size="1rem" className="ok-icon" />
              <span className="ok-chip">全部配置已保存</span>
              <span className="footer-note">与线上策略一致</span>
            </>
          )}
          <Tooltip
            title="权限矩阵与安全策略保存后立即生效；成员在线会话将在下一次操作时应用新策略；成员角色调整与移除保存后即时同步组织架构人数。"
          >
            <span className="effect-tip">
              <Icon name="info" size="0.875rem" />
              变更生效说明
            </span>
          </Tooltip>
        </div>
        <div className="footer-actions">
          <Button icon={<Icon name="rotate-ccw" size="0.875rem" />} disabled={changeCount === 0} onClick={handleReset}>
            重置
          </Button>
          <Badge count={changeCount} offset={[-6, 6]} size="small">
            <Button
              type="primary"
              icon={<Icon name="save" size="0.875rem" />}
              disabled={changeCount === 0}
              onClick={handleSave}
            >
              保存变更
            </Button>
          </Badge>
        </div>
      </div>
    </footer>
  );
}

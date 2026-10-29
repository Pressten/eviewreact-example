import { useMemo, useState } from "react";
import { Tag, Segmented } from "antd";
import SectionCard from "../../components/section-card/index.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { auditActionOptions } from "../../mock/audit-logs.js";
import "./index.css";

// 审计日志 — 最近权限变更 6 条；支持按动作类型筛选；结果 Tag 成功/失败分色
export default function AuditLog() {
  const { logs } = useApp();
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = useMemo(() => {
    if (actionFilter === "all") return logs;
    return logs.filter((l) => l.action === actionFilter);
  }, [logs, actionFilter]);

  const successCount = filtered.filter((l) => l.result === "success").length;
  const failedCount = filtered.length - successCount;

  return (
    <SectionCard
      title="审计日志"
      subtitle={`最近权限变更记录 · 共 ${logs.length} 条`}
      icon="scroll-text"
      action={
        <div className="audit-log__stats">
          <Tag bordered={false} color="success">成功 {successCount}</Tag>
          <Tag bordered={false} color="error">失败 {failedCount}</Tag>
        </div>
      }
      bodyClassName="audit-log__body"
    >
      <div className="audit-log__filter">
        <Segmented
          size="small"
          value={actionFilter}
          onChange={(v) => setActionFilter(v)}
          options={auditActionOptions.map((o) => ({ label: o.label, value: o.value }))}
        />
      </div>
      <ul className="audit-log__list">
        {filtered.length === 0 ? (
          <li className="audit-log__empty">
            <Icon name="inbox" size="1.5rem" color="var(--on-surface-variant)" />
            <span>当前筛选条件下无日志记录</span>
          </li>
        ) : (
          filtered.map((l, idx) => (
            <li key={l.id} className={`audit-log__item ${idx === 0 ? "is-latest" : ""}`}>
              <div className="audit-log__item-head">
                <span className="audit-log__time">{l.time}</span>
                <Tag bordered={false} className="audit-log__action-tag">
                  <Icon name="git-commit-vertical" size="0.625rem" />
                  {l.actionLabel}
                </Tag>
                <Tag
                  bordered={false}
                  color={l.result === "success" ? "success" : "error"}
                  className="audit-log__result"
                >
                  {l.result === "success" ? "成功" : "失败"}
                </Tag>
                {idx === 0 && (
                  <span className="audit-log__latest-flag">最新</span>
                )}
              </div>
              <div className="audit-log__item-body">
                <div className="audit-log__row">
                  <Icon name="user-cog" size="0.75rem" color="var(--on-surface-variant)" />
                  <span className="audit-log__operator">{l.operator}</span>
                  <span className="audit-log__sep">→</span>
                  <span className="audit-log__target" title={l.target}>{l.target}</span>
                </div>
                <p className="audit-log__detail">{l.detail}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </SectionCard>
  );
}

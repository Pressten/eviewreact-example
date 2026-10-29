import { useMemo, useState } from "react";
import { IconPlusIcCarUser, IconPlusIcDevCommit, IconPlusIcDigitalPowerDpDocText, IconPlusIcPublicTray } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import SelectCard from "@nce/eview-react/SelectCard";
import SectionCard from "../../components/section-card/index.jsx";

import { useApp } from "../../context.jsx";
import { auditActionOptions } from "../../mock/audit-logs.js";
import "./index.css";

// 瀹¤鏃ュ織 鈥?鏈€杩戞潈闄愬彉鏇?6 鏉★紱鏀寔鎸夊姩浣滅被鍨嬬瓫閫夛紱缁撴灉 Tag 鎴愬姛/澶辫触鍒嗚壊
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
      title="瀹¤鏃ュ織"
      subtitle={`鏈€杩戞潈闄愬彉鏇磋褰?路 鍏?${logs.length} 鏉}
      icon={<IconPlusIcDigitalPowerDpDocText iconSize="1.25rem" iconColor={['currentcolor']} className="section-card__icon" />}
      action={
        <div className="audit-log__stats">
          <Tag bordered={false} color="success">鎴愬姛 {successCount}</Tag>
          <Tag bordered={false} color="error">澶辫触 {failedCount}</Tag>
        </div>
      }
      bodyClassName="audit-log__body"
    >
      <div className="audit-log__filter">
        <SelectCard
          type="small"
          value={actionFilter}
          onChange={(v) => setActionFilter(v)}
          data={auditActionOptions.map((o) => ({ text: o.label, value: o.value }))}
        />
      </div>
      <ul className="audit-log__list">
        {filtered.length === 0 ? (
          <li className="audit-log__empty">
            <IconPlusIcPublicTray iconSize="1.5rem" iconColor={['var(--on-surface-variant)']} />
            <span>褰撳墠绛涢€夋潯浠朵笅鏃犳棩蹇楄褰?/span>
          </li>
        ) : (
          filtered.map((l, idx) => (
            <li key={l.id} className={`audit-log__item ${idx === 0 ? "is-latest" : ""}`}>
              <div className="audit-log__item-head">
                <span className="audit-log__time">{l.time}</span>
                <Tag bordered={false} className="audit-log__action-tag">
                  <IconPlusIcDevCommit iconSize="0.625rem" iconColor={['currentcolor']} />
                  {l.actionLabel}
                </Tag>
                <Tag
                  bordered={false}
                  color={l.result === "success" ? "success" : "error"}
                  className="audit-log__result"
                >
                  {l.result === "success" ? "鎴愬姛" : "澶辫触"}
                </Tag>
                {idx === 0 && (
                  <span className="audit-log__latest-flag">鏈€鏂?/span>
                )}
              </div>
              <div className="audit-log__item-body">
                <div className="audit-log__row">
                  <IconPlusIcCarUser iconSize="0.75rem" iconColor={['var(--on-surface-variant)']} />
                  <span className="audit-log__operator">{l.operator}</span>
                  <span className="audit-log__sep">鈫?/span>
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

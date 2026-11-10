import { useState } from "react";
import { message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { ResultTag } from "../../components/status-tag/index.jsx";
import { CHANGES } from "../../mock/operations.js";
import "./index.css";

// ⑧ 变更动态：今日发布 4 条；结果分色，失败/回滚行可展开回滚说明
export default function ChangeFeed() {
  const [openId, setOpenId] = useState("CHG-04");

  return (
    <SectionCard
      id="change-section"
      icon="git-branch"
      title="变更动态 · 今日发布"
      className="cf-section"
      extra={<span className="cf-extra">4 条发布记录 · 失败行可查看回滚说明</span>}
    >
      <div className="cf-list">
        {CHANGES.map((c) => {
          const openable = c.result === "failed" || c.result === "rollback";
          const open = openId === c.id;
          return (
            <div key={c.id} className={`cf-item ${c.result}`}>
              <div className="cf-head">
                <span className="cf-rocket">
                  <Icon name="rocket" size="0.875rem" />
                </span>
                <span className="cf-service">{c.service}</span>
                <span className="cf-version">{c.version}</span>
                <ResultTag result={c.result} />
                <span className="cf-time">{c.time}</span>
              </div>
              <div className="cf-desc">
                {c.desc} · 负责人 {c.owner}
              </div>
              {openable ? (
                <>
                  <div className="cf-row">
                    <a className="cf-toggle" onClick={() => setOpenId(open ? "" : c.id)}>
                      {open ? "收起回滚说明" : "查看回滚说明"}
                      <Icon name={open ? "chevron-up" : "chevron-down"} size="0.75rem" />
                    </a>
                    <a
                      className="cf-action"
                      onClick={() => message.success(`已创建跟进工单：${c.service} ${c.version}（指派 ${c.owner}）`)}
                    >
                      <Icon name="clipboard-list" size="0.75rem" />
                      创建跟进工单
                    </a>
                  </div>
                  {open ? (
                    <div className="cf-note">
                      <span className="cf-note-ico">
                        <Icon name="undo-2" size="0.875rem" />
                      </span>
                      {c.rollbackNote}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ⑧ 发布记录：Timeline（版本号/操作人/时间/发布说明/回滚按钮）
// 固定展示最近 4 条（不出现滚动条）；回滚需确认并提示未发布更改将丢失
import { useState } from "react";
import { IconPlusIcIctReverses, IconPlusIcPublicClock } from '@hui/icon-plus';
import Button from "@nce/eview-react/Button";
import MessageDialog from "@nce/eview-react/MessageDialog";
import Tag from "@/shared/Tag";
import { toast } from "@/shared/AppToast";
import { useDecoration } from "../../context.jsx";
import "./index.css";

const VISIBLE_COUNT = 4;

export default function PublishTimeline() {
  const { state, dispatch, hasUnpublished } = useDecoration();
  const [pendingRollback, setPendingRollback] = useState(null);

  const totalCount = state.publishRecords.length;
  const visibleRecords = state.publishRecords.slice(0, VISIBLE_COUNT);

  const handleRollback = (record) => setPendingRollback(record);

  const confirmRollback = () => {
    if (!pendingRollback) return;
    dispatch({ type: "ROLLBACK", version: pendingRollback.version });
    const version = pendingRollback.version;
    setPendingRollback(null);
    toast.success(`已回滚至 ${version}，未发布更改已丢弃`);
  };

  return (
    <div className="deco-card publish-timeline">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <IconPlusIcPublicClock iconSize="1.25rem" iconColor={['currentcolor']} className="card-title-icon" />
          发布记录
          <span className="card-title-caption">时间倒序 · 可回滚</span>
        </div>
        <span className="card-head-caption">
          共 {totalCount} 条{totalCount > VISIBLE_COUNT ? ` · 显示最近 ${VISIBLE_COUNT} 条` : ""}
        </span>
      </div>
      <div className="timeline-scroll">
        <div className="app-timeline record-timeline">
          {visibleRecords.map((record, idx) => (
            <div className="app-timeline-item" key={record.id}>
              <span className={`app-timeline-dot ${idx === 0 ? "app-timeline-dot-active" : ""}`} />
              <div className="app-timeline-content">
                <div className="record-item">
                  <div className="record-head">
                    <Tag color={idx === 0 ? "blue" : "default"} className="record-version">
                      {record.version}
                    </Tag>
                    {record.isCurrent && (
                      <Tag color="green" bordered={false} className="record-current">
                        当前版本
                      </Tag>
                    )}
                    <span className="record-operator">{record.operator}</span>
                    <span className="record-time">{record.time}</span>
                  </div>
                  <div className="record-note" title={record.note}>
                    {record.note}
                  </div>
                  {idx !== 0 && (
                    <Button
                      size="small"
                      leftIcon={<IconPlusIcIctReverses iconSize="0.875rem" iconColor={['currentcolor']} />}
                      text="回滚至此版本"
                      onClick={() => handleRollback(record)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MessageDialog
        type="risk"
        iconLocation="title"
        isOpen={!!pendingRollback}
        content={`确认回滚至 ${pendingRollback?.version}？`}
        detail={
          hasUnpublished
            ? "当前存在未发布的更改，回滚后这些更改将全部丢失，装修配置将恢复为该版本发布时的状态。"
            : "回滚后装修配置将恢复为该版本发布时的状态。"
        }
        onClose={() => setPendingRollback(null)}
        buttons={{
          cancel: { text: "取消", onClick: () => setPendingRollback(null) },
          ok: { text: "确认回滚", onClick: confirmRollback },
        }}
      />
    </div>
  );
}

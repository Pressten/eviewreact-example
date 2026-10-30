// ⑧ 发布记录：Timeline（版本号/操作人/时间/发布说明/回滚按钮）
// 固定展示最近 4 条（不出现滚动条）；回滚需确认并提示未发布更改将丢失
import { Button, Modal, Tag, Timeline, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useDecoration } from "../../context.jsx";
import "./index.css";

const VISIBLE_COUNT = 4;

export default function PublishTimeline() {
  const { state, dispatch, hasUnpublished } = useDecoration();

  const totalCount = state.publishRecords.length;
  const visibleRecords = state.publishRecords.slice(0, VISIBLE_COUNT);

  const handleRollback = (record) => {
    Modal.confirm({
      title: `确认回滚至 ${record.version}？`,
      content: hasUnpublished
        ? "当前存在未发布的更改，回滚后这些更改将全部丢失，装修配置将恢复为该版本发布时的状态。"
        : "回滚后装修配置将恢复为该版本发布时的状态。",
      okText: "确认回滚",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        dispatch({ type: "ROLLBACK", version: record.version });
        message.success(`已回滚至 ${record.version}，未发布更改已丢弃`);
      },
    });
  };

  const items = visibleRecords.map((record, idx) => ({
    key: record.id,
    color: idx === 0 ? "blue" : "gray",
    children: (
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
            icon={<Icon name="rotate-ccw" size="0.875rem" />}
            onClick={() => handleRollback(record)}
          >
            回滚至此版本
          </Button>
        )}
      </div>
    ),
  }));

  return (
    <div className="deco-card publish-timeline">
      <div className="deco-card-head">
        <div className="deco-card-title">
          <Icon name="clock" size="1.25rem" className="card-title-icon" />
          发布记录
          <span className="card-title-caption">时间倒序 · 可回滚</span>
        </div>
        <span className="card-head-caption">
          共 {totalCount} 条{totalCount > VISIBLE_COUNT ? ` · 显示最近 ${VISIBLE_COUNT} 条` : ""}
        </span>
      </div>
      <div className="timeline-scroll">
        <Timeline className="record-timeline" items={items} />
      </div>
    </div>
  );
}

import { Button, Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function BottomBar({ publishStatus, onNewShowtime, onBatchSchedule, onPublish, onSave }) {
  const isPublished = publishStatus === "已发布";
  return (
    <div className="bottom-bar">
      <div className="bottom-bar-left">
        <Button type="primary" onClick={onNewShowtime}>
          <Icon name="plus" size="0.875rem" color="#FFFFFF" />
          <span>新建场次</span>
        </Button>
        <Button onClick={onBatchSchedule}>
          <Icon name="layers" size="0.875rem" />
          <span>批量排片</span>
        </Button>
      </div>
      <div className="bottom-bar-right">
        <div className="bottom-bar-status">
          <span className="bottom-bar-status-label">排片状态：</span>
          <Tag color={isPublished ? "success" : "warning"}>{publishStatus}</Tag>
        </div>
        <Button onClick={onPublish}>
          <Icon name={isPublished ? "undo-2" : "send"} size="0.875rem" />
          <span>{isPublished ? "撤回发布" : "发布排片"}</span>
        </Button>
        <Button type="primary" onClick={onSave}>
          <Icon name="save" size="0.875rem" color="#FFFFFF" />
          <span>保存</span>
        </Button>
      </div>
    </div>
  );
}

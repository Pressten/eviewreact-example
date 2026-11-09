import Button from "eview-ui/Button";
import message from "@/shared/message";
import Icon from "@/shared/Icon";
import "./index.css";

export default function BatchBar({ count, onMove, onDelete, onDownload, onClear }) {
  if (count === 0) return null;
  return (
    <div className="batch-bar">
      <div className="batch-bar-left">
        <span className="batch-count">已选 <strong>{count}</strong> 项</span>
        <a className="batch-clear" onClick={(e) => { e.preventDefault(); onClear(); }} href="#">取消选择</a>
      </div>
      <div className="batch-bar-actions">
        <Button onClick={onMove}>
          <Icon name="move" size="0.875rem" />
          <span style={{ marginLeft: "0.25rem" }}>移动</span>
        </Button>
        <Button onClick={onDownload}>
          <Icon name="download" size="0.875rem" />
          <span style={{ marginLeft: "0.25rem" }}>下载</span>
        </Button>
        <Button status="risk" onClick={onDelete}>
          <Icon name="trash-2" size="0.875rem" />
          <span style={{ marginLeft: "0.25rem" }}>删除</span>
        </Button>
      </div>
    </div>
  );
}

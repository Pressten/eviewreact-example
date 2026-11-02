import Button from "@nce/eview-react/Button";
import { IconPlusIcDigitalPowerDpMove, IconPlusIcPublicDownload, IconPlusIcPublicTrash } from '@hui/icon-plus';
import "./index.css";

// 浮动批量操作栏：已选 N 项 | 移动 / 删除 / 下载
export default function BatchBar({ count, onMove, onDelete, onDownload, onClear }) {
  if (count === 0) return null;
  return (
    <div className="batch-bar">
      <div className="batch-bar-left">
        <span className="batch-count">已选 <strong>{count}</strong> 项</span>
        <a className="batch-clear" onClick={(e) => { e.preventDefault(); onClear(); }} href="#">取消选择</a>
      </div>
      <div className="batch-bar-actions">
        <Button text="移动" leftIcon={<IconPlusIcDigitalPowerDpMove iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onMove} />
        <Button text="下载" leftIcon={<IconPlusIcPublicDownload iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onDownload} />
        <Button status="risk" text="删除" leftIcon={<IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} />} onClick={onDelete} />
      </div>
    </div>
  );
}

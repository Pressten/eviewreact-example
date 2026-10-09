import { Modal, Button, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 删除数据源二次确认弹窗
export default function ConfirmModal() {
  const { removing, closeRemoving, removeRecords, list } = useApp();
  const targets = list.filter((item) => removing.ids.includes(item.id));
  const preview = targets.slice(0, 5);

  const handleConfirm = () => {
    removeRecords(removing.ids);
    closeRemoving();
    message.success(`已删除 ${removing.ids.length} 个数据源`);
  };

  return (
    <Modal
      open={removing.open}
      title="删除数据源"
      width={480}
      onCancel={closeRemoving}
      footer={[
        <Button key="cancel" onClick={closeRemoving}>
          取消
        </Button>,
        <Button key="delete" danger type="primary" onClick={handleConfirm}>
          删除
        </Button>,
      ]}
    >
      <div className="confirm-body">
        <span className="confirm-body__icon">
          <Icon name="triangle-alert" size="1.25rem" />
        </span>
        <div className="confirm-body__text">
          <p className="confirm-body__title">
            本次将删除 {removing.ids.length} 个数据源，删除后关联的同步任务将一并停止且不可恢复。
          </p>
          <ul className="confirm-body__list">
            {preview.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span className="confirm-body__id">{item.id}</span>
              </li>
            ))}
            {targets.length > preview.length ? (
              <li className="confirm-body__more">等共 {targets.length} 个数据源</li>
            ) : null}
          </ul>
        </div>
      </div>
    </Modal>
  );
}

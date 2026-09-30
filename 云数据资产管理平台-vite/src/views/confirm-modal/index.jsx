import Dialog from "@nce/eview-react/Dialog";
import Button from "@nce/eview-react/Button";
import { IconPlusIcPublicWarning } from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import "./index.css";

// Layer 4: 删除数据源二次确认弹窗
export default function ConfirmModal() {
  const { removing, closeRemoving, removeRecords, list, notify } = useApp();
  const targets = list.filter((item) => removing.ids.includes(item.id));
  const preview = targets.slice(0, 5);

  const handleConfirm = () => {
    removeRecords(removing.ids);
    closeRemoving();
    notify("success", `已删除 ${removing.ids.length} 个数据源`);
  };

  return (
    <Dialog
      isOpen={removing.open}
      title="删除数据源"
      size={[480, "auto"]}
      style={{ maxHeight: "80vh" }}
      onClose={closeRemoving}
      buttons={[
        { text: "取消", onClick: closeRemoving },
        { text: "删除", status: "risk", onClick: handleConfirm },
      ]}
    >
      <div className="confirm-body">
        <span className="confirm-body__icon">
          <IconPlusIcPublicWarning iconSize="1.25rem" iconColor={["currentcolor"]} />
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
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import FormField from "../../components/form-field/index.jsx";
import { ITEM_STATUS, PRIORITIES } from "../../mock/packages.js";
import "./index.css";

const STATUS_OPTIONS = Object.keys(ITEM_STATUS).map((k) => ({ value: k, label: ITEM_STATUS[k].text }));
const PRIORITY_OPTIONS = PRIORITIES.map((p) => ({ value: p.value, label: p.label }));

// 批量配置弹窗：对选中电路统一下发状态 / 优先级
export default function BatchModal({ open, count, onCancel, onOk }) {
  const [status, setStatus] = useState("configuring");
  const [priority, setPriority] = useState(undefined);

  useEffect(() => {
    if (open) {
      setStatus("configuring");
      setPriority(undefined);
    }
  }, [open]);

  const confirm = () => {
    if (!status && !priority) {
      message.warning("请至少选择一项要下发的配置");
      return;
    }
    onOk({ status, priority });
  };

  return (
    <Modal
      title="批量配置"
      open={open}
      onCancel={onCancel}
      onOk={confirm}
      okText="确认下发"
      cancelText="取消"
      width={480}
      destroyOnHidden
    >
      <div className="modal-note">
        将对已选中的 <strong>{count}</strong> 条电路统一下发以下配置。
      </div>
      <div className="modal-form">
        <FormField label="目标状态" htmlFor="bm-status">
          <Select id="bm-status" style={{ width: "100%" }} options={STATUS_OPTIONS} value={status} onChange={setStatus} />
        </FormField>
        <FormField label="优先级" htmlFor="bm-priority">
          <Select id="bm-priority" style={{ width: "100%" }} allowClear placeholder="保持原优先级" options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />
        </FormField>
      </div>
    </Modal>
  );
}

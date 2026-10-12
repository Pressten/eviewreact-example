import { useState, useEffect } from "react";
import { Modal, Select } from "antd";
import FormField from "../../components/form-field/index.jsx";
import { BANDWIDTH_SPECS, STATIONS, ITEM_STATUS, PRIORITIES } from "../../mock/packages.js";
import "./index.css";

const REGION_KEY = { "华北区域": "north", "华东区域": "east", "华南区域": "south", "西部区域": "west" };

// 单条电路编辑弹窗：修改带宽 / 站点 / 优先级 / 状态 —— 直接回写清单表格
export default function EditModal({ open, item, onCancel, onSave }) {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (open && item) setDraft({ ...item });
  }, [open, item]);

  if (!draft) return null;

  const stationOptions = (STATIONS[REGION_KEY[draft.region]] || []).map((s) => ({ value: s, label: s }));

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const confirm = () => {
    const base = BANDWIDTH_SPECS.find((b) => b.value === draft.bandwidth)?.price || draft.price;
    onSave({ ...draft, price: draft.cycle === "包年" ? Math.round(base * 0.9) : base });
  };

  return (
    <Modal
      title={`编辑电路 · ${item.code}`}
      open={open}
      onCancel={onCancel}
      onOk={confirm}
      okText="保存"
      cancelText="取消"
      width={480}
      destroyOnHidden
    >
      <div className="modal-form">
        <FormField label="带宽规格" htmlFor="em-bandwidth">
          <Select id="em-bandwidth" style={{ width: "100%" }} options={BANDWIDTH_SPECS.map((b) => ({ value: b.value, label: b.label }))} value={draft.bandwidth} onChange={(v) => set("bandwidth", v)} />
        </FormField>
        <FormField label="接入站点" htmlFor="em-station">
          <Select id="em-station" style={{ width: "100%" }} options={stationOptions} value={draft.station} onChange={(v) => set("station", v)} />
        </FormField>
        <FormField label="优先级" htmlFor="em-priority">
          <Select id="em-priority" style={{ width: "100%" }} options={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))} value={draft.priority} onChange={(v) => set("priority", v)} />
        </FormField>
        <FormField label="状态" htmlFor="em-status">
          <Select id="em-status" style={{ width: "100%" }} options={Object.keys(ITEM_STATUS).map((k) => ({ value: k, label: ITEM_STATUS[k].text }))} value={draft.status} onChange={(v) => set("status", v)} />
        </FormField>
      </div>
    </Modal>
  );
}

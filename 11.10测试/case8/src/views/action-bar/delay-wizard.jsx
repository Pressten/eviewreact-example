import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Empty, InputNumber, Modal, Radio, Select, message } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import { fmt } from "../../mock/flight.js";
import { useApp } from "../../context.jsx";

// 发布延误 · 四步向导: 原因分类 → 影响航班多选 → 通知模板预览 → 确认发布
// 发布后主表对应行状态与延误分钟同步更新(经 context overrides)
const REASONS = [
  { value: "weather", label: "天气（雷雨 / 台风 / 除冰）", text: "受目的地及航路天气影响" },
  { value: "flow", label: "流量控制（空域 / 机场容量）", text: "受航路流量控制影响" },
  { value: "mechanical", label: "机务故障（排故 / 检查）", text: "因飞机机械故障排故" },
  { value: "crew", label: "机组资源（执勤超时 / 替换）", text: "因机组执勤时限调整" },
];

const TEMPLATES = [
  { value: "sms", label: "旅客短信通知" },
  { value: "counter", label: "值机柜台广播" },
  { value: "agent", label: "地服代理通知" },
];

const QUICK_MINUTES = [30, 45, 60, 90, 120];

export default function DelayWizard({ open, onClose, onLog }) {
  const { dataset, selectedFlightId, applyOverride } = useApp();
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("weather");
  const [delayMin, setDelayMin] = useState(45);
  const [affected, setAffected] = useState([]);
  const [template, setTemplate] = useState("sms");

  // 可发布航班: 出港且尚未执行(计划/登机中/已延误)
  const candidates = useMemo(
    () =>
      dataset
        .filter((r) => r.dir === "dep" && ["scheduled", "boarding", "delayed"].includes(r.status))
        .sort((a, b) => a.schedDep - b.schedDep),
    [dataset]
  );

  useEffect(() => {
    if (open) {
      setStep(0);
      setAffected(
        selectedFlightId && candidates.some((c) => c.id === selectedFlightId) ? [selectedFlightId] : []
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const reasonMeta = REASONS.find((r) => r.value === reason) || REASONS[0];
  const templateMeta = TEMPLATES.find((t) => t.value === template) || TEMPLATES[0];
  const affectedFlights = dataset.filter((r) => affected.includes(r.id));
  const firstFlight = affectedFlights[0];

  const toggleAffected = (id, checked) => {
    setAffected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const canNext =
    step === 0 ? delayMin >= 5 && delayMin <= 240 : step === 1 ? affected.length > 0 : step === 2 ? !!template : true;

  const estDep = firstFlight ? fmt(firstFlight.schedDep + delayMin) : "--:--";

  const previewText = () => {
    const f = firstFlight;
    if (!f) return "请先在第二步选择影响航班";
    if (template === "sms") {
      return `尊敬的旅客：您乘坐的 ${f.flightNo} 航班（${f.from}—${f.to}）${reasonMeta.text}，预计延误 ${delayMin} 分钟，最新预计起飞时刻 ${estDep}。请您留意登机口 ${f.gate} 的信息变化，感谢您的理解与配合。——华翼航空运控中心`;
    }
    if (template === "counter") {
      return `各位旅客请注意：您乘坐的前往 ${f.to} 的 ${f.flightNo} 航班，${reasonMeta.text}，登机口 ${f.gate}，预计 ${estDep} 起飞。请留意登机口广播信息。`;
    }
    return `【代理提示】${f.flightNo}（${f.from}—${f.to}）${reasonMeta.text}，预计延误 ${delayMin} 分钟，ETD ${estDep}，请协助保障 ${f.paxCount} 名旅客。华翼航空 AOC`;
  };

  const handlePublish = () => {
    applyOverride(
      affected.map((id) => ({
        id,
        patch: { status: "delayed", delayMinutes: delayMin, delayReason: `${reasonMeta.text} · 运控发布` },
      }))
    );
    message.success(`延误发布成功：${affected.length} 班航班延误 ${delayMin} 分钟（${reasonMeta.label}）`);
    onLog(`发布延误 · ${affected.length} 班 +${delayMin} 分（${reasonMeta.label.split("（")[0]}）`);
    onClose();
  };

  const stepContent = [
    <div className="wz-step" key="s0">
      <div className="wz-field-label">延误原因分类</div>
      <Radio.Group value={reason} onChange={(e) => setReason(e.target.value)} className="wz-reasons">
        {REASONS.map((r) => (
          <Radio key={r.value} value={r.value} className="wz-reason">
            {r.label}
          </Radio>
        ))}
      </Radio.Group>
      <div className="wz-field-label">预计延误时长（5 – 240 分钟）</div>
      <div className="wz-minutes">
        <InputNumber
          mode="spinner"
          variant="outlined"
          min={5}
          max={240}
          step={5}
          value={delayMin}
          onChange={(v) => setDelayMin(Math.min(Math.max(Number(v) || 45, 5), 240))}
        />
        <span className="wz-unit">分钟</span>
        <span className="wz-quick">
          {QUICK_MINUTES.map((m) => (
            <a key={m} className={`wz-quick-item mono ${delayMin === m ? "on" : ""}`} onClick={() => setDelayMin(m)}>
              {m}
            </a>
          ))}
        </span>
      </div>
    </div>,
    <div className="wz-step" key="s1">
      <div className="wz-field-label">选择受影响的出港航班（已执行航班不可发布）</div>
      <div className="wz-flights">
        {candidates.map((r) => (
          <label key={r.id} className="wz-flight">
            <Checkbox checked={affected.includes(r.id)} onChange={(e) => toggleAffected(r.id, e.target.checked)} />
            <span className="mono wz-f-no">{r.flightNo}</span>
            <span className="mono wz-f-route">{r.from}→{r.to}</span>
            <span className="mono wz-f-time">{fmt(r.schedDep)}</span>
            <StatusTag status={r.status} showIcon={false} />
            <span className="mono wz-f-pax">{r.paxCount} 人</span>
          </label>
        ))}
        {candidates.length === 0 ? <Empty description="当前无待发布的出港航班" /> : null}
      </div>
      <div className="wz-select-all">
        <a onClick={() => setAffected(candidates.map((c) => c.id))}>全选</a>
        <a onClick={() => setAffected([])}>清空</a>
        <span className="mono">已选 {affected.length} 班 · 涉及旅客 {affectedFlights.reduce((s, f) => s + f.paxCount, 0)} 人</span>
      </div>
    </div>,
    <div className="wz-step" key="s2">
      <div className="wz-field-label">通知模板</div>
      <Select value={template} onChange={setTemplate} options={TEMPLATES} style={{ width: "16rem" }} />
      <div className="wz-preview">
        <div className="wz-preview-head">{templateMeta.label} · 内容预览</div>
        <div className="wz-preview-body">{previewText()}</div>
      </div>
    </div>,
    <div className="wz-step" key="s3">
      <div className="wz-confirm">
        <div className="wz-c-row"><span>原因分类</span><b>{reasonMeta.label}</b></div>
        <div className="wz-c-row"><span>延误时长</span><b className="mono">{delayMin} 分钟</b></div>
        <div className="wz-c-row"><span>影响航班</span><b className="mono">{affectedFlights.map((f) => f.flightNo).join(" / ") || "—"}</b></div>
        <div className="wz-c-row"><span>涉及旅客</span><b className="mono">{affectedFlights.reduce((s, f) => s + f.paxCount, 0)} 人</b></div>
        <div className="wz-c-row"><span>通知模板</span><b>{templateMeta.label}</b></div>
      </div>
      <div className="wz-c-warn">
        <Icon name="triangle-alert" size="0.75rem" />
        发布后将同步更新主表状态与延误分钟、顶部运行摘要、登机口网格、波及链与机组执勤。
      </div>
    </div>,
  ];

  return (
    <Modal
      open={open}
      title="发布延误 · 四步向导"
      width={720}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        step > 0 ? (
          <Button key="prev" onClick={() => setStep(step - 1)}>上一步</Button>
        ) : null,
        step < 3 ? (
          <Button key="next" type="primary" disabled={!canNext} onClick={() => setStep(step + 1)}>下一步</Button>
        ) : (
          <Button key="go" type="primary" disabled={affected.length === 0} onClick={handlePublish}>确认发布</Button>
        ),
      ]}
    >
      <div className="wz-step-head">
        <span className="wz-step-count mono">{step + 1} / 4</span>
        <span className="wz-step-name">{["原因分类", "影响航班", "通知模板", "确认发布"][step]}</span>
        <span className="wz-step-hint">按「下一步」逐步完成</span>
      </div>
      {stepContent[step]}
    </Modal>
  );
}

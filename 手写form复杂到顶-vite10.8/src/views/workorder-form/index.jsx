import { useRef } from "react";
import dayjs from "dayjs";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import MultipleSelect from "@nce/eview-react/MultipleSelect";
import RadioGroup from "@nce/eview-react/RadioGroup";
import Spinner from "@nce/eview-react/Spinner";
import DatePicker from "@nce/eview-react/DatePicker";
import Toggle from "@nce/eview-react/Toggle";
import CheckboxGroup from "@nce/eview-react/CheckboxGroup";
import Button from "@nce/eview-react/Button";
import IconButton from "@nce/eview-react/IconButton";
import TipBox from "@nce/eview-react/TipBox";
import { IconPlusIcCarRotateRight, IconPlusIcDigitalPowerDpFile, IconPlusIcPublicAlert, IconPlusIcPublicCheckmark, IconPlusIcPublicClock, IconPlusIcPublicClose, IconPlusIcPublicPlus, IconPlusIcPublicSend, IconPlusIcPublicSquare, IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicTrash, IconPlusIcPublicUpload } from "@nce/icon-plus";
import FieldRow from "../../components/field-row/index.jsx";
import PanelCard from "../../components/panel-card/index.jsx";
import StatusTag from "../../components/status-tag/index.jsx";
import {
  orderTypes,
  priorityOptions,
  priorityMeta,
  stationOptions,
  ownerOptions,
  ccOptions,
  deviceOptions,
  inspectionItemOptions,
  resultOptions,
  resultMeta,
  unitOptions,
  ackOptions,
  metaOf,
} from "../../mock/workorder.jsx";
import "./index.css";

const FILE_KIND_ICON_DEFAULT = <IconPlusIcDigitalPowerDpFile iconSize="1rem" iconColor={['currentcolor']} />;
const FILE_KIND_ICON = {
  image: <IconPlusIcDigitalPowerDpFile iconSize="1rem" iconColor={['currentcolor']} />,
  sheet: <IconPlusIcPublicTransverseRectangleTemplate iconSize="1rem" iconColor={['currentcolor']} />,
  log: <IconPlusIcPublicClock iconSize="1rem" iconColor={['currentcolor']} />,
  doc: <IconPlusIcDigitalPowerDpFile iconSize="1rem" iconColor={['currentcolor']} />,
};

export default function WorkorderForm({
  form,
  errors,
  checks,
  setField,
  setItem,
  addItem,
  removeItem,
  onOpenEntry,
  addFiles,
  addSampleFile,
  removeFile,
  toggleAck,
  scrollTo,
  onSubmit,
  onSaveDraft,
  onReset,
}) {
  const fileRef = useRef(null);
  const itemErrors = errors.itemErrors || [];
  const doneCount = checks.filter((c) => c.ok).length;
  const percent = Math.round((doneCount / checks.length) * 100);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const rangeValue = form.range
    ? [form.range[0]?.toDate?.() || form.range[0], form.range[1]?.toDate?.() || form.range[1]]
    : [];

  return (
    <div className="wo-form">
      <PanelCard
        className="wo-form__section"
        icon={<IconPlusIcDigitalPowerDpFile iconSize="1rem" iconColor={['currentcolor']} />}
        title="基础信息"
        subtitle="工单归属、责任人与计划作业窗口"
        extra={<StatusTag tone="brand" label="第 1 步 / 共 3 步" size="small" />}
      >
        <div className="form-grid" id="wo-section-basic">
          <FieldRow
            label="工单标题"
            required
            full
            htmlFor="wo-title"
            error={errors.title}
            help="建议格式：设备编号 + 现象，例如「DEV-AC-0209 回风温度持续偏高」"
          >
            <TextField
              id="wo-title"
              value={form.title}
              maxLength={60}
              placeholder="请输入工单标题"
              onChange={(value) => setField("title", value)}
            />
          </FieldRow>

          <FieldRow label="工单类型" required htmlFor="wo-type" error={errors.type}>
            <Select
              id="wo-type"
              value={form.type}
              options={orderTypes}
              enableClear
              defaultLabel="请选择工单类型"
              onChange={(value) => setField("type", value)}
            />
          </FieldRow>

          <FieldRow
            label="优先级"
            required
            htmlFor="wo-priority"
            error={errors.priority}
            help={`当前：${metaOf(priorityMeta, form.priority).label}优先级`}
          >
            <RadioGroup
              isControlled
              data={priorityOptions}
              value={form.priority}
              onChange={(a, b) => {
                const next = a === form.priority ? b : a;
                setField("priority", next);
              }}
            />
          </FieldRow>

          <FieldRow label="所属站点" required htmlFor="wo-station" error={errors.station}>
            <Select
              id="wo-station"
              value={form.station}
              options={stationOptions}
              enableClear
              defaultLabel="请选择机房 / 站点"
              onChange={(value) => setField("station", value)}
            />
          </FieldRow>

          <FieldRow label="现场责任人" required htmlFor="wo-owner" error={errors.owner}>
            <Select
              id="wo-owner"
              value={form.owner}
              options={ownerOptions}
              enableClear
              defaultLabel="请选择现场责任人"
              onChange={(value) => setField("owner", value)}
            />
          </FieldRow>

          <FieldRow label="联系电话" required htmlFor="wo-phone" error={errors.phone}>
            <TextField
              id="wo-phone"
              value={form.phone}
              maxLength={11}
              format="number"
              placeholder="请输入 11 位手机号"
              onChange={(value) => setField("phone", value.replace(/\D/g, ""))}
            />
          </FieldRow>

          <FieldRow label="抄送人" htmlFor="wo-cc" help="提交后同步推送至抄送人">
            <MultipleSelect
              id="wo-cc"
              value={form.ccPersons}
              options={ccOptions}
              placeholder="选择需要同步的同事"
              onChange={(value) => setField("ccPersons", value)}
            />
          </FieldRow>

          <FieldRow
            label="计划开始与结束时间"
            required
            full
            htmlFor="wo-range"
            error={errors.range}
            help="作业窗口需与客户协商一致，最长不超过 30 天"
          >
            <DatePicker
              id="wo-range"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              timeEmbedded
              range={rangeValue}
              onChange={(dateString, date, target) => {
                if (!date) return;
                const current = form.range || [null, null];
                if (target === "from") {
                  setField("range", [dayjs(date), current[1]]);
                } else if (target === "right") {
                  setField("range", [current[0], dayjs(date)]);
                }
              }}
            />
          </FieldRow>

          <FieldRow
            label="预计工时（小时）"
            required
            htmlFor="wo-duration"
            error={errors.duration}
            help="含路途与现场准备时间"
          >
            <Spinner
              id="wo-duration"
              min={0}
              max={72}
              step={0.5}
              precision={1}
              value={form.duration}
              doNotFocusWhenValueUpdate
              onChange={(value) => setField("duration", value)}
            />
          </FieldRow>

          <FieldRow label="作业完成后需客户确认" htmlFor="wo-ack-switch" help="开启后客户将收到完工确认链接">
            <Toggle
              id="wo-ack-switch"
              data={[false, true]}
              toggled={form.needCustomerAck}
              taggledChildren="需确认"
              unTaggledChildren="免确认"
              onToggle={(value) => setField("needCustomerAck", value)}
            />
          </FieldRow>
        </div>
      </PanelCard>

      <PanelCard
        className="wo-form__section"
        icon={<IconPlusIcPublicTransverseRectangleTemplate iconSize="1rem" iconColor={['currentcolor']} />}
        title="巡检明细"
        subtitle={`已添加 ${form.items.length} 条巡检记录，逐台设备登记实测值`}
        extra={
          <>
            <Button size="small" leftIcon={<IconPlusIcPublicSquare iconSize="0.875rem" iconColor={['currentcolor']} />} text="详细登记" onClick={onOpenEntry} />
            <Button size="small" leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />} text="添加空行" onClick={addItem} />
          </>
        }
      >
        {errors.items ? (
          <p className="field-row__error inspect__alert">
            <IconPlusIcPublicAlert iconSize="0.875rem" iconColor={['currentcolor']} />
            <span>{errors.items}</span>
          </p>
        ) : null}

        <div className="inspect" id="wo-items">
          <div className="inspect__head">
            <span className="inspect__col inspect__col--no">#</span>
            <span className="inspect__col">设备</span>
            <span className="inspect__col">巡检项</span>
            <span className="inspect__col">巡检结果</span>
            <span className="inspect__col">实测值 / 单位</span>
            <span className="inspect__col">处置说明</span>
            <span className="inspect__col inspect__col--op">操作</span>
          </div>

          {form.items.length === 0 ? (
            <div className="inspect__empty">
              <IconPlusIcPublicTransverseRectangleTemplate iconSize="1.5rem" iconColor={['currentcolor']} />
              <p>暂无巡检明细，请点击「添加巡检项」开始登记</p>
            </div>
          ) : null}

          {form.items.map((row, i) => {
            const rowErr = itemErrors[i] || {};
            return (
              <div className="inspect__row" key={row.id}>
                <span className="inspect__col inspect__col--no">
                  <span className="inspect__no">{i + 1}</span>
                </span>

                <div className="inspect__col">
                  <Select
                    id={`wo-item-${i}-device`}
                    value={row.device}
                    options={deviceOptions}
                    defaultLabel="选择设备"
                    onChange={(value) => setItem(i, "device", value)}
                  />
                  {rowErr.device ? <p className="field-row__error">{rowErr.device}</p> : null}
                </div>

                <div className="inspect__col">
                  <Select
                    id={`wo-item-${i}-item`}
                    value={row.item}
                    options={inspectionItemOptions}
                    defaultLabel="选择巡检项"
                    onChange={(value) => setItem(i, "item", value)}
                  />
                  {rowErr.item ? <p className="field-row__error">{rowErr.item}</p> : null}
                </div>

                <div className="inspect__col">
                  <Select
                    id={`wo-item-${i}-result`}
                    value={row.result}
                    options={resultOptions}
                    defaultLabel="结果"
                    onChange={(value) => setItem(i, "result", value)}
                  />
                  {rowErr.result ? <p className="field-row__error">{rowErr.result}</p> : null}
                </div>

                <div className="inspect__col">
                  <div className="inspect__pair">
                    <Spinner
                      id={`wo-item-${i}-value`}
                      value={row.value}
                      doNotFocusWhenValueUpdate
                      onChange={(value) => setItem(i, "value", value)}
                    />
                    <Select
                      value={row.unit}
                      options={unitOptions}
                      onChange={(value) => setItem(i, "unit", value)}
                    />
                  </div>
                  {rowErr.value ? <p className="field-row__error">{rowErr.value}</p> : null}
                </div>

                <div className="inspect__col">
                  <TextField
                    id={`wo-item-${i}-note`}
                    value={row.note}
                    placeholder={row.result === "abnormal" ? "异常必填：处置动作" : "可选：现场备注"}
                    onChange={(value) => setItem(i, "note", value)}
                  />
                  {rowErr.note ? <p className="field-row__error">{rowErr.note}</p> : null}
                </div>

                <div className="inspect__col inspect__col--op">
                  {row.result ? (
                    <StatusTag
                      tone={metaOf(resultMeta, row.result).tone}
                      label={metaOf(resultMeta, row.result).label}
                      size="small"
                    />
                  ) : null}
                  <IconButton
                    iconName={<IconPlusIcPublicTrash iconSize="0.875rem" iconColor={['currentcolor']} />}
                    tipText={form.items.length === 1 ? "至少保留一条巡检明细" : "删除该行"}
                    size="small"
                    disabled={form.items.length === 1}
                    onClick={() => removeItem(i)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button
          className="inspect__add"
          leftIcon={<IconPlusIcPublicPlus iconSize="0.875rem" iconColor={['currentcolor']} />}
          text="打开「登记巡检明细」弹窗，纵向表单逐项填写"
          onClick={onOpenEntry}
        />
      </PanelCard>

      <PanelCard
        className="wo-form__section"
        icon={<IconPlusIcPublicTransverseRectangleTemplate iconSize="1rem" iconColor={['currentcolor']} />}
        title="补充说明与附件"
        subtitle="现场描述与佐证材料将随工单一起流转"
        extra={<StatusTag tone="brand" label="第 3 步 / 共 3 步" size="small" />}
      >
        <div className="form-grid">
          <FieldRow
            label="问题描述"
            required
            full
            htmlFor="wo-description"
            error={errors.description}
            help={`${String(form.description || "").length} / 500 字，建议包含现象、影响范围、已采取措施`}
          >
            <TextArea
              id="wo-description"
              value={form.description}
              maxLength={500}
              placeholder="例如：IDC-3 机房 3 号列头柜回风温度连续 2 小时高于 32℃，已临时开启备用精密空调，需现场核查冷通道封闭情况。"
              onChange={(value) => setField("description", value)}
            />
          </FieldRow>

          <FieldRow
            label="现场附件"
            full
            htmlFor="wo-file"
            error={errors.attachments}
            help={`已上传 ${form.attachments.length} / 5 个；高优先级或存在异常项时至少 1 个`}
          >
            <div className="attach">
              <div
                className="attach__drop"
                onClick={() => fileRef.current && fileRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <IconPlusIcPublicUpload iconSize="1.5rem" iconColor={['currentcolor']} />
                <span className="attach__drop-title">点击选择文件，或将文件拖拽到此处</span>
                <span className="attach__drop-hint">支持 jpg / png / pdf / xlsx / log，单个文件不超过 20MB</span>
              </div>
              <input
                id="wo-file"
                ref={fileRef}
                type="file"
                multiple
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />

              <div className="attach__actions">
                <a onClick={addSampleFile}>
                  <IconPlusIcDigitalPowerDpFile iconSize="0.875rem" iconColor={['currentcolor']} /> 追加一份示例附件
                </a>
                <span className="attach__count">共 {form.attachments.length} 个文件</span>
              </div>

              {form.attachments.length ? (
                <ul className="attach__list">
                  {form.attachments.map((f, i) => (
                    <li className="attach-item" key={`${f.name}-${i}`}>
                      <span className="attach-item__icon">
                        {FILE_KIND_ICON[f.kind] || FILE_KIND_ICON_DEFAULT}
                      </span>
                      <span className="attach-item__main">
                        <span className="attach-item__name">{f.name}</span>
                        <span className="attach-item__size">{f.size}</span>
                      </span>
                      <button
                        type="button"
                        className="attach-item__remove"
                        onClick={() => removeFile(i)}
                      >
                        <IconPlusIcPublicClose iconSize="0.875rem" iconColor={['currentcolor']} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="attach__empty">尚未上传附件</p>
              )}
            </div>
          </FieldRow>

          <FieldRow label="提交前确认" required full htmlFor="wo-acks" error={errors.acks}>
            <div className="ack-list" id="wo-acks">
              <CheckboxGroup
                data={ackOptions}
                value={form.acks}
                onChange={(value) => toggleAck(value)}
              />
            </div>
          </FieldRow>
        </div>
      </PanelCard>

      <div className="form-footbar">
        <div className="form-footbar__status">
          <div className="app-progress" style={{ width: "8rem" }}>
            <div
              className="app-progress__bar"
              style={{ width: `${percent}%`, background: percent === 100 ? "var(--success)" : "var(--primary)" }}
            />
          </div>
          <span className="form-footbar__text">
            校验通过 <strong>{doneCount}</strong> / {checks.length} 项
          </span>
          {percent < 100 ? (
            <a className="form-footbar__link" onClick={() => scrollTo("wo-acks")}>
              查看未通过项
            </a>
          ) : (
            <span className="form-footbar__ok">
              <IconPlusIcPublicCheckmark iconSize="0.875rem" iconColor={['currentcolor']} />
              校验全部通过，可提交
            </span>
          )}
        </div>
        <div className="form-footbar__actions">
          <Button leftIcon={<IconPlusIcCarRotateRight iconSize="0.875rem" iconColor={['currentcolor']} />} text="重置" onClick={onReset} />
          <Button leftIcon={<IconPlusIcPublicTransverseRectangleTemplate iconSize="0.875rem" iconColor={['currentcolor']} />} text="保存草稿" onClick={onSaveDraft} />
          <Button status="primary" leftIcon={<IconPlusIcPublicSend iconSize="0.875rem" iconColor={['currentcolor']} />} text="提交工单" onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
}

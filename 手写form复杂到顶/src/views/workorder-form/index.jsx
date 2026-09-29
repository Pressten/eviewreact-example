import { useRef } from "react";
import {
  Input,
  Select,
  Radio,
  InputNumber,
  DatePicker,
  Switch,
  Checkbox,
  Button,
  Tooltip,
  Progress,
} from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
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
} from "../../mock/workorder.js";
import "./index.css";

const FILE_KIND_ICON = {
  image: "file-text",
  sheet: "table",
  log: "file-clock",
  doc: "file-check",
};

// Layer 4: 工单填报表单 — 纯 H5 骨架 + antd 输入组件受控使用
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

  return (
    <div className="wo-form">
      {/* ========== 1. 基础信息 ========== */}
      <PanelCard
        className="wo-form__section"
        icon="file-text"
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
            <Input
              id="wo-title"
              value={form.title}
              maxLength={60}
              showCount
              status={errors.title ? "error" : undefined}
              placeholder="请输入工单标题"
              onChange={(e) => setField("title", e.target.value)}
            />
          </FieldRow>

          <FieldRow label="工单类型" required htmlFor="wo-type" error={errors.type}>
            <Select
              id="wo-type"
              value={form.type}
              options={orderTypes}
              allowClear
              status={errors.type ? "error" : undefined}
              placeholder="请选择工单类型"
              onChange={(v) => setField("type", v)}
            />
          </FieldRow>

          <FieldRow
            label="优先级"
            required
            htmlFor="wo-priority"
            error={errors.priority}
            help={`当前：${metaOf(priorityMeta, form.priority).label}优先级`}
          >
            <Radio.Group
              value={form.priority}
              optionType="button"
              buttonStyle="solid"
              options={priorityOptions}
              onChange={(e) => setField("priority", e.target.value)}
            />
          </FieldRow>

          <FieldRow label="所属站点" required htmlFor="wo-station" error={errors.station}>
            <Select
              id="wo-station"
              value={form.station}
              options={stationOptions}
              showSearch
              optionFilterProp="label"
              status={errors.station ? "error" : undefined}
              placeholder="请选择机房 / 站点"
              onChange={(v) => setField("station", v)}
            />
          </FieldRow>

          <FieldRow label="现场责任人" required htmlFor="wo-owner" error={errors.owner}>
            <Select
              id="wo-owner"
              value={form.owner}
              options={ownerOptions}
              showSearch
              optionFilterProp="label"
              status={errors.owner ? "error" : undefined}
              placeholder="请选择现场责任人"
              onChange={(v) => setField("owner", v)}
            />
          </FieldRow>

          <FieldRow label="联系电话" required htmlFor="wo-phone" error={errors.phone}>
            <Input
              id="wo-phone"
              value={form.phone}
              maxLength={11}
              prefix={<Icon name="phone" size="0.875rem" />}
              status={errors.phone ? "error" : undefined}
              placeholder="请输入 11 位手机号"
              onChange={(e) => setField("phone", e.target.value.replace(/\D/g, ""))}
            />
          </FieldRow>

          <FieldRow label="抄送人" htmlFor="wo-cc" help="提交后同步推送至抄送人">
            <Select
              id="wo-cc"
              mode="multiple"
              value={form.ccPersons}
              options={ccOptions}
              maxTagCount="responsive"
              placeholder="选择需要同步的同事"
              onChange={(v) => setField("ccPersons", v)}
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
            <DatePicker.RangePicker
              id="wo-range"
              value={form.range}
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder={["计划开始时间", "计划结束时间"]}
              status={errors.range ? "error" : undefined}
              onChange={(v) => setField("range", v)}
            />
          </FieldRow>

          <FieldRow
            label="预计工时（小时）"
            required
            htmlFor="wo-duration"
            error={errors.duration}
            help="含路途与现场准备时间"
          >
            <InputNumber
              id="wo-duration"
              mode="spinner"
              variant="outlined"
              value={form.duration}
              min={0}
              max={72}
              step={0.5}
              precision={1}
              status={errors.duration ? "error" : undefined}
              placeholder="0.5 – 72"
              onChange={(v) => setField("duration", v)}
            />
          </FieldRow>

          <FieldRow label="作业完成后需客户确认" htmlFor="wo-ack-switch" help="开启后客户将收到完工确认链接">
            <Switch
              id="wo-ack-switch"
              checked={form.needCustomerAck}
              checkedChildren="需确认"
              unCheckedChildren="免确认"
              onChange={(v) => setField("needCustomerAck", v)}
            />
          </FieldRow>
        </div>
      </PanelCard>

      {/* ========== 2. 巡检明细 ========== */}
      <PanelCard
        className="wo-form__section"
        icon="scan-line"
        title="巡检明细"
        subtitle={`已添加 ${form.items.length} 条巡检记录，逐台设备登记实测值`}
        extra={
          <>
            <Button size="small" icon={<Icon name="square-pen" size="0.875rem" />} onClick={onOpenEntry}>
              详细登记
            </Button>
            <Button size="small" icon={<Icon name="plus" size="0.875rem" />} onClick={addItem}>
              添加空行
            </Button>
          </>
        }
      >
        {errors.items ? (
          <p className="field-row__error inspect__alert">
            <Icon name="circle-alert" size="0.875rem" />
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
              <Icon name="inbox" size="1.5rem" />
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
                    showSearch
                    optionFilterProp="label"
                    size="small"
                    placeholder="选择设备"
                    status={rowErr.device ? "error" : undefined}
                    onChange={(v) => setItem(i, "device", v)}
                  />
                  {rowErr.device ? <p className="field-row__error">{rowErr.device}</p> : null}
                </div>

                <div className="inspect__col">
                  <Select
                    id={`wo-item-${i}-item`}
                    value={row.item}
                    options={inspectionItemOptions}
                    size="small"
                    placeholder="选择巡检项"
                    status={rowErr.item ? "error" : undefined}
                    onChange={(v) => setItem(i, "item", v)}
                  />
                  {rowErr.item ? <p className="field-row__error">{rowErr.item}</p> : null}
                </div>

                <div className="inspect__col">
                  <Select
                    id={`wo-item-${i}-result`}
                    value={row.result}
                    options={resultOptions}
                    size="small"
                    placeholder="结果"
                    status={rowErr.result ? "error" : undefined}
                    onChange={(v) => setItem(i, "result", v)}
                  />
                  {rowErr.result ? <p className="field-row__error">{rowErr.result}</p> : null}
                </div>

                <div className="inspect__col">
                  <div className="inspect__pair">
                    <InputNumber
                      id={`wo-item-${i}-value`}
                      mode="spinner"
                      variant="outlined"
                      size="small"
                      value={row.value}
                      status={rowErr.value ? "error" : undefined}
                      placeholder="实测值"
                      onChange={(v) => setItem(i, "value", v)}
                    />
                    <Select
                      value={row.unit}
                      options={unitOptions}
                      size="small"
                      onChange={(v) => setItem(i, "unit", v)}
                    />
                  </div>
                  {rowErr.value ? <p className="field-row__error">{rowErr.value}</p> : null}
                </div>

                <div className="inspect__col">
                  <Input
                    id={`wo-item-${i}-note`}
                    value={row.note}
                    size="small"
                    placeholder={row.result === "abnormal" ? "异常必填：处置动作" : "可选：现场备注"}
                    status={rowErr.note ? "error" : undefined}
                    onChange={(e) => setItem(i, "note", e.target.value)}
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
                  <Tooltip title={form.items.length === 1 ? "至少保留一条巡检明细" : "删除该行"}>
                    <Button
                      shape="circle"
                      size="small"
                      disabled={form.items.length === 1}
                      icon={<Icon name="trash-2" size="0.875rem" />}
                      onClick={() => removeItem(i)}
                    />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="dashed"
          block
          className="inspect__add"
          icon={<Icon name="plus" size="0.875rem" />}
          onClick={onOpenEntry}
        >
          打开「登记巡检明细」弹窗，纵向表单逐项填写
        </Button>
      </PanelCard>

      {/* ========== 3. 补充说明与附件 ========== */}
      <PanelCard
        className="wo-form__section"
        icon="paperclip"
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
            <Input.TextArea
              id="wo-description"
              value={form.description}
              rows={4}
              maxLength={500}
              status={errors.description ? "error" : undefined}
              placeholder="例如：IDC-3 机房 3 号列头柜回风温度连续 2 小时高于 32℃，已临时开启备用精密空调，需现场核查冷通道封闭情况。"
              onChange={(e) => setField("description", e.target.value)}
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
                <Icon name="upload" size="1.5rem" />
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
                  <Icon name="file-check" size="0.875rem" /> 追加一份示例附件
                </a>
                <span className="attach__count">共 {form.attachments.length} 个文件</span>
              </div>

              {form.attachments.length ? (
                <ul className="attach__list">
                  {form.attachments.map((f, i) => (
                    <li className="attach-item" key={`${f.name}-${i}`}>
                      <span className="attach-item__icon">
                        <Icon name={FILE_KIND_ICON[f.kind] || "file-text"} size="1rem" />
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
                        <Icon name="x" size="0.875rem" />
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
              <Checkbox.Group
                value={form.acks}
                options={ackOptions}
                onChange={toggleAck}
              />
            </div>
          </FieldRow>
        </div>
      </PanelCard>

      {/* ========== 底部操作条 ========== */}
      <div className="form-footbar">
        <div className="form-footbar__status">
          <Progress
            percent={percent}
            size="small"
            showInfo={false}
            strokeColor={percent === 100 ? "var(--success)" : "var(--primary)"}
            style={{ width: "8rem" }}
          />
          <span className="form-footbar__text">
            校验通过 <strong>{doneCount}</strong> / {checks.length} 项
          </span>
          {percent < 100 ? (
            <a className="form-footbar__link" onClick={() => scrollTo("wo-acks")}>
              查看未通过项
            </a>
          ) : (
            <span className="form-footbar__ok">
              <Icon name="circle-check" size="0.875rem" />
              校验全部通过，可提交
            </span>
          )}
        </div>
        <div className="form-footbar__actions">
          <Button icon={<Icon name="rotate-ccw" size="0.875rem" />} onClick={onReset}>
            重置
          </Button>
          <Button icon={<Icon name="save" size="0.875rem" />} onClick={onSaveDraft}>
            保存草稿
          </Button>
          <Button type="primary" icon={<Icon name="send" size="0.875rem" />} onClick={onSubmit}>
            提交工单
          </Button>
        </div>
      </div>
    </div>
  );
}

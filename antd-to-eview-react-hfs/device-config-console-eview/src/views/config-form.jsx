// Layer 4: 采集策略表单区 — 基础字段 + 增强采集开关(开启后展开详细参数)
// eview-react 转换要点:
//   1. Row/Col 栅格 → Form 级 itemCol={8}(三项一行,所有项同等宽度);Form 内不允许 div 栅格
//   2. 校验控制流:onFinish/validateFields → ref.submit() + onSuccess 回调链
//   3. 增强开关行(含标题文案与详细参数区)在手写容器中,详细字段放第二个 Form;
//      保存时链式提交:基础表单通过后再提交详情表单,全部通过才算保存成功
//   4. message.success → Toast(DivMessage 渲染式)
import { useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import Spinner from "@nce/eview-react/Spinner";
import Toggle from "@nce/eview-react/Toggle";
import Button from "@nce/eview-react/Button";
import SectionCard from "../components/SectionCard.jsx";
import { useToast } from "../components/Toast.jsx";
import {
  compressionOptions,
  deviceTypeOptions,
  policyFormInitialValues,
  priorityOptions,
  protocolOptions,
  siteOptions,
} from "../data.js";
import "./config-form.css";

const BASIC_INITIAL = {
  policyName: policyFormInitialValues.policyName,
  deviceType: policyFormInitialValues.deviceType,
  site: policyFormInitialValues.site,
  protocol: policyFormInitialValues.protocol,
  interval: policyFormInitialValues.interval,
  priority: policyFormInitialValues.priority,
};

const DETAIL_INITIAL = {
  sampleInterval: policyFormInitialValues.sampleInterval,
  batchSize: policyFormInitialValues.batchSize,
  heartbeat: policyFormInitialValues.heartbeat,
  bufferLimit: policyFormInitialValues.bufferLimit,
  compression: policyFormInitialValues.compression,
  retries: policyFormInitialValues.retries,
  masking: policyFormInitialValues.masking,
  remark: policyFormInitialValues.remark,
};

export default function ConfigForm() {
  const intl = useIntl();
  const toast = useToast();
  const basicFormRef = useRef(null);
  const detailFormRef = useRef(null);
  const basicValuesRef = useRef(null);
  const [enhanced, setEnhanced] = useState(policyFormInitialValues.enhanced);

  const t = (id, fallback, values) =>
    intl.formatMessage({ id: id, defaultMessage: fallback }, values);
  const label = (id, fallback) => <FormattedMessage id={id} defaultMessage={fallback} />;
  const toOptions = (list) =>
    list.map((item) => ({
      value: item.value,
      text: item.label || t(item.msgId, item.fallback),
    }));

  const finishSave = () => {
    toast("success", t("form.saved", "采集策略已保存并下发"));
  };

  // 链式提交:基础表单校验通过 → 存值;开启增强时继续提交详情表单,否则直接保存成功
  const handleBasicPass = (values) => {
    basicValuesRef.current = values;
    if (enhanced) {
      detailFormRef.current?.submit();
    } else {
      finishSave();
    }
  };

  const handleDetailPass = (values) => {
    finishSave({ ...basicValuesRef.current, ...values });
  };

  const handleSubmit = () => {
    basicFormRef.current?.submit();
  };

  const handleReset = () => {
    basicFormRef.current?.resetFields();
    detailFormRef.current?.resetFields();
    setEnhanced(policyFormInitialValues.enhanced);
  };

  return (
    <SectionCard
      title={label("form.title", "采集策略配置")}
      subtitle={label("form.subtitle", "策略生效后将下发至所选站点下的同类型设备。")}
      extra={<span className="bound-tag">{t("form.bound", "已绑定 {count} 台设备", { count: 18 })}</span>}
    >
      <Form
        ref={basicFormRef}
        layout="vertical"
        itemCol={8}
        initialValues={BASIC_INITIAL}
        validateErrorType="tip"
        onSuccess={handleBasicPass}
      >
        <Form.Item
          name="policyName"
          label={label("form.policyName", "策略名称")}
          rules={[{ required: true }]}
        >
          <TextField placeholder={t("form.policyName.placeholder", "请输入策略名称")} />
        </Form.Item>
        <Form.Item name="deviceType" label={label("form.deviceType", "设备类型")}>
          <Select options={toOptions(deviceTypeOptions)} />
        </Form.Item>
        <Form.Item name="site" label={label("form.site", "应用站点")}>
          <Select options={toOptions(siteOptions)} />
        </Form.Item>
        <Form.Item name="protocol" label={label("form.protocol", "上报协议")}>
          <SelectCard data={toOptions(protocolOptions)} />
        </Form.Item>
        <Form.Item name="interval" label={label("form.interval", "采集周期（秒）")}>
          <Spinner min={5} max={3600} step={5} doNotFocusWhenValueUpdate />
        </Form.Item>
        <Form.Item name="priority" label={label("form.priority", "策略优先级")}>
          <Select options={toOptions(priorityOptions)} />
        </Form.Item>
      </Form>

      {/* 开关行:说明在行首,Toggle 在行尾(Form 外的独立受控开关) */}
      <div className="toggle-row">
        <div className="toggle-copy">
          <span className="toggle-icon" aria-hidden="true" />
          <div className="toggle-text">
            <div className="toggle-title">{label("form.enhanced", "启用增强采集")}</div>
            <div className="toggle-desc">
              {label(
                "form.enhanced.desc",
                "开启后可继续配置采样间隔、压缩算法与失败重试等高级参数"
              )}
            </div>
          </div>
        </div>
        <Toggle data={[false, true]} toggled={enhanced} onToggle={setEnhanced} />
      </div>

      {enhanced ? (
        <div className="detail-region">
          <div className="detail-head">
            <span className="detail-title">{label("form.detail.title", "增强采集参数")}</span>
            <span className="detail-hint">
              {label(
                "form.detail.hint",
                "采样频率越高，带宽占用与设备功耗越大，请按业务场景开启"
              )}
            </span>
          </div>
          <Form
            ref={detailFormRef}
            layout="vertical"
            itemCol={8}
            initialValues={DETAIL_INITIAL}
            validateErrorType="tip"
            onSuccess={handleDetailPass}
          >
            <Form.Item name="sampleInterval" label={label("form.sampleInterval", "采样间隔（毫秒）")}>
              <Spinner min={100} max={60000} step={100} doNotFocusWhenValueUpdate />
            </Form.Item>
            <Form.Item name="batchSize" label={label("form.batchSize", "单次上报条数")}>
              <Spinner min={1} max={500} doNotFocusWhenValueUpdate />
            </Form.Item>
            <Form.Item name="heartbeat" label={label("form.heartbeat", "心跳超时（秒）")}>
              <Spinner min={5} max={600} doNotFocusWhenValueUpdate />
            </Form.Item>
            <Form.Item name="bufferLimit" label={label("form.bufferLimit", "离线缓存上限（条）")}>
              <Spinner min={100} max={100000} step={100} doNotFocusWhenValueUpdate />
            </Form.Item>
            <Form.Item name="compression" label={label("form.compression", "数据压缩")}>
              <Select options={toOptions(compressionOptions)} />
            </Form.Item>
            <Form.Item name="retries" label={label("form.retries", "失败重试次数")}>
              <Spinner min={0} max={10} doNotFocusWhenValueUpdate />
            </Form.Item>
            <Form.Item
              name="masking"
              label={label("form.masking", "敏感数据脱敏")}
              valuePropName="toggled"
              updateTrigger="onToggle"
            >
              <Toggle data={[false, true]} />
            </Form.Item>
            <Form.Item name="remark" label={label("form.remark", "策略备注")}>
              <TextArea
                rows={2}
                placeholder={t(
                  "form.remark.placeholder",
                  "补充说明该策略的适用范围与注意事项"
                )}
              />
            </Form.Item>
          </Form>
        </div>
      ) : null}

      <div className="form-actions">
        <Button text={label("form.reset", "重置")} onClick={handleReset} />
        <Button status="primary" text={label("form.submit", "保存配置")} onClick={handleSubmit} />
      </div>
    </SectionCard>
  );
}

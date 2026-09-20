import { useRef, useState } from "react";
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import TextArea from "@nce/eview-react/TextArea";
import Spinner from "@nce/eview-react/Spinner";
import Select from "@nce/eview-react/Select";
import SelectCard from "@nce/eview-react/SelectCard";
import Toggle from "@nce/eview-react/Toggle";
import Button from "@nce/eview-react/Button";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../icons.jsx";
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

// Layer 4: 采集策略表单区 — 基础字段 + 增强采集开关(开启后展开详细参数)
// antd → eview-react:
//   Form.useForm/onFinish → Form ref + submit() → onSuccess(values) 回调(非 Promise);
//   InputNumber → Spinner(程序化改值场景加 doNotFocusWhenValueUpdate);
//   Radio.Group button → SelectCard(data[].text);Switch → Toggle(valuePropName="toggled" updateTrigger="onToggle");
//   Row/Col 栅格 → form-row/form-col CSS grid。
export default function ConfigForm() {
  const intl = useIntl();
  const toast = useToast();
  const formRef = useRef(null);
  const [enhanced, setEnhanced] = useState(true);

  const t = (id, fallback, values) =>
    intl.formatMessage({ id: id, defaultMessage: fallback }, values);
  const label = (id, fallback) => <FormattedMessage id={id} defaultMessage={fallback} />;
  const toOptions = (list) =>
    list.map((item) => ({
      value: item.value,
      text: item.label || t(item.msgId, item.fallback),
    }));

  const handleSuccess = () => {
    toast.success(t("form.saved", "采集策略已保存并下发"));
  };

  const handleReset = () => {
    formRef.current && formRef.current.resetFields();
    setEnhanced(policyFormInitialValues.enhanced);
  };

  return (
    <SectionCard
      title={label("form.title", "采集策略配置")}
      subtitle={label("form.subtitle", "策略生效后将下发至所选站点下的同类型设备。")}
      extra={
        <span className="bound-tag">
          <Icon name="layers" size={14} />
          {t("form.bound", "已绑定 {count} 台设备", { count: 18 })}
        </span>
      }
    >
      <Form
        ref={formRef}
        layout="vertical"
        validateErrorType="tip"
        initialValues={policyFormInitialValues}
        onSuccess={handleSuccess}
        onFailed={() => {}}
        onValuesChange={(changed) => {
          // 增强采集开关联动显隐:Form 托管 Toggle 值,这里同步给本地 state 驱动条件渲染
          if (changed && "enhanced" in changed) setEnhanced(!!changed.enhanced);
        }}
      >
        <div className="form-row">
          <div className="form-col">
            <Form.Item name="policyName" label={label("form.policyName", "策略名称")} rules={[{ required: true }]}>
              <TextField placeholder={t("form.policyName.placeholder", "请输入策略名称")} />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item name="deviceType" label={label("form.deviceType", "设备类型")}>
              <Select options={toOptions(deviceTypeOptions)} />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item name="site" label={label("form.site", "应用站点")}>
              <Select options={toOptions(siteOptions)} />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item name="protocol" label={label("form.protocol", "上报协议")}>
              <SelectCard data={toOptions(protocolOptions)} />
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item name="interval" label={label("form.interval", "采集周期（秒）")}>
              <div className="full-width">
                <Spinner min={5} max={3600} step={5} doNotFocusWhenValueUpdate />
              </div>
            </Form.Item>
          </div>
          <div className="form-col">
            <Form.Item name="priority" label={label("form.priority", "策略优先级")}>
              <Select options={toOptions(priorityOptions)} />
            </Form.Item>
          </div>
        </div>

        <div className="toggle-row">
          <div className="toggle-copy">
            <span className="toggle-icon">
              <Icon name="sliders-horizontal" size={16} />
            </span>
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
          <Form.Item name="enhanced" valuePropName="toggled" updateTrigger="onToggle">
            <Toggle data={[false, true]} />
          </Form.Item>
        </div>

        {enhanced ? (
          <div className="detail-region">
            <div className="detail-head">
              <span className="detail-title">
                <Icon name="sliders-horizontal" size={14} />
                {label("form.detail.title", "增强采集参数")}
              </span>
              <span className="detail-hint">
                <Icon name="info" size={12} />
                {label(
                  "form.detail.hint",
                  "采样频率越高，带宽占用与设备功耗越大，请按业务场景开启"
                )}
              </span>
            </div>
            <div className="form-row">
              <div className="form-col">
                <Form.Item name="sampleInterval" label={label("form.sampleInterval", "采样间隔（毫秒）")}>
                  <div className="full-width">
                    <Spinner min={100} max={60000} step={100} doNotFocusWhenValueUpdate />
                  </div>
                </Form.Item>
              </div>
              <div className="form-col">
                <Form.Item name="batchSize" label={label("form.batchSize", "单次上报条数")}>
                  <div className="full-width">
                    <Spinner min={1} max={500} doNotFocusWhenValueUpdate />
                  </div>
                </Form.Item>
              </div>
              <div className="form-col">
                <Form.Item name="heartbeat" label={label("form.heartbeat", "心跳超时（秒）")}>
                  <div className="full-width">
                    <Spinner min={5} max={600} doNotFocusWhenValueUpdate />
                  </div>
                </Form.Item>
              </div>
              <div className="form-col">
                <Form.Item name="bufferLimit" label={label("form.bufferLimit", "离线缓存上限（条）")}>
                  <div className="full-width">
                    <Spinner min={100} max={100000} step={100} doNotFocusWhenValueUpdate />
                  </div>
                </Form.Item>
              </div>
              <div className="form-col">
                <Form.Item name="compression" label={label("form.compression", "数据压缩")}>
                  <Select options={toOptions(compressionOptions)} />
                </Form.Item>
              </div>
              <div className="form-col">
                <Form.Item name="retries" label={label("form.retries", "失败重试次数")}>
                  <div className="full-width">
                    <Spinner min={0} max={10} doNotFocusWhenValueUpdate />
                  </div>
                </Form.Item>
              </div>
              <div className="form-col">
                <Form.Item name="masking" label={label("form.masking", "敏感数据脱敏")} valuePropName="toggled" updateTrigger="onToggle">
                  <Toggle data={[false, true]} />
                </Form.Item>
              </div>
              <div className="form-col form-col-full">
                <Form.Item name="remark" label={label("form.remark", "策略备注")}>
                  <TextArea
                    maxLength={200}
                    placeholder={t(
                      "form.remark.placeholder",
                      "补充说明该策略的适用范围与注意事项"
                    )}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        ) : null}

        <div className="form-actions">
          <Button text={t("form.reset", "重置")} onClick={handleReset} />
          <Button
            status="primary"
            leftIcon={<Icon name="save" size={14} />}
            text={t("form.submit", "保存配置")}
            onClick={() => formRef.current && formRef.current.submit()}
          />
        </div>
      </Form>
    </SectionCard>
  );
}

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
//   Radio.Group button → SelectCard(data[].text);Switch → Toggle;
//   Row/Col 栅格 → Form 的 itemCol={8} 三列 + Form.Item.col 单项覆盖。
//   注意:Form.Item 必须是 Form 的直接子节点,ev_label 标签宽度和栅格都按直接子级计算,
//   用 div/flex/grid 包裹 Form.Item 会导致标签塌缩、栅格失效;
//   条件显隐也不能用 Fragment/容器包一组(脱离直接子级),改为返回 Form.Item 数组保持聚合(见 skill Form.md)。
export default function ConfigForm() {
  const intl = useIntl();
  const toast = useToast();
  const formRef = useRef(null);
  // 增强采集开关是"设置页开关联动"型 UI 开关(Toggle.md),走受控写法放在装饰行内;
  // 不能为了排版把 Form.Item 包进 div,表单字段仍全部由 Form 托管。
  const [enhanced, setEnhanced] = useState(policyFormInitialValues.enhanced);

  const t = (id, fallback, values) =>
    intl.formatMessage({ id: id, defaultMessage: fallback }, values);
  const label = (id, fallback) => <FormattedMessage id={id} defaultMessage={fallback} />;
  const toOptions = (list) =>
    list.map((item) => ({
      value: item.value,
      text: item.label || t(item.msgId, item.fallback),
    }));

  const handleEnhancedToggle = (value) => {
    setEnhanced(!!value);
  };

  const handleSuccess = (values) => {
    // enhanced 由受控 Toggle 持有,真实项目提交时合并:{ ...values, enhanced }
    toast.success(t("form.saved", "采集策略已保存并下发"));
  };

  const handleReset = () => {
    formRef.current && formRef.current.resetFields();
    setEnhanced(policyFormInitialValues.enhanced);
  };

  // 增强采集参数一组:整组放数组保持代码聚合,React.Children 展开后仍是 Form 直接子级,itemCol 可注入(实测可行);
  // 不能换成 Fragment/div 包裹整组(脱离直接子级,栅格失效)。
  const detailItems = [
    <Form.Item key="sampleInterval" name="sampleInterval" label={label("form.sampleInterval", "采样间隔（毫秒）")}>
      <Spinner min={100} max={60000} step={100} doNotFocusWhenValueUpdate style={{ width: "100%" }} />
    </Form.Item>,
    <Form.Item key="batchSize" name="batchSize" label={label("form.batchSize", "单次上报条数")}>
      <Spinner min={1} max={500} doNotFocusWhenValueUpdate style={{ width: "100%" }} />
    </Form.Item>,
    <Form.Item key="heartbeat" name="heartbeat" label={label("form.heartbeat", "心跳超时（秒）")}>
      <Spinner min={5} max={600} doNotFocusWhenValueUpdate style={{ width: "100%" }} />
    </Form.Item>,
    <Form.Item key="bufferLimit" name="bufferLimit" label={label("form.bufferLimit", "离线缓存上限（条）")}>
      <Spinner min={100} max={100000} step={100} doNotFocusWhenValueUpdate style={{ width: "100%" }} />
    </Form.Item>,
    <Form.Item key="compression" name="compression" label={label("form.compression", "数据压缩")}>
      <Select options={toOptions(compressionOptions)} />
    </Form.Item>,
    <Form.Item key="retries" name="retries" label={label("form.retries", "失败重试次数")}>
      <Spinner min={0} max={10} doNotFocusWhenValueUpdate style={{ width: "100%" }} />
    </Form.Item>,
    <Form.Item key="masking" name="masking" label={label("form.masking", "敏感数据脱敏")} valuePropName="toggled" updateTrigger="onToggle">
      <Toggle data={[false, true]} />
    </Form.Item>,
    // col={24}: 单项覆盖占整行
    <Form.Item key="remark" col={24} name="remark" label={label("form.remark", "策略备注")}>
      <TextArea
        maxLength={200}
        placeholder={t("form.remark.placeholder", "补充说明该策略的适用范围与注意事项")}
      />
    </Form.Item>,
  ];

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
      {/* itemCol={8}: 三列栅格设在 Form 上;Form.Item 全部为直接子节点 */}
      <Form
        ref={formRef}
        layout="vertical"
        itemCol={8}
        validateErrorType="tip"
        initialValues={policyFormInitialValues}
        onSuccess={handleSuccess}
        onFailed={() => {}}
      >
        <Form.Item name="policyName" label={label("form.policyName", "策略名称")} rules={[{ required: true }]}>
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
          {/* 控件直接作为 Form.Item 子节点(Form 注入 value/onChange),不能再包 div */}
          <Spinner min={5} max={3600} step={5} doNotFocusWhenValueUpdate style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="priority" label={label("form.priority", "策略优先级")}>
          <Select options={toOptions(priorityOptions)} />
        </Form.Item>

        {/* 开关行:Form.Item 之间的普通节点(不包裹 Form.Item),Toggle 受控驱动下方区块显隐 */}
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
          <Toggle
            data={[false, true]}
            toggled={enhanced}
            onToggle={handleEnhancedToggle}
          />
        </div>

        {/* 条件显隐:分组标题为普通节点,整组字段用数组保持直接子级 */}
        {enhanced ? (
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
        ) : null}
        {enhanced ? detailItems : null}

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

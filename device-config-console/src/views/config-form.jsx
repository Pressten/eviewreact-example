import { useState } from "react";
import { Button, Col, Form, Input, InputNumber, Radio, Row, Select, Switch, message } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../assets/shared/icons.js";
import SectionCard from "../components/SectionCard.jsx";
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
export default function ConfigForm() {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [enhanced, setEnhanced] = useState(true);

  const t = (id, fallback, values) =>
    intl.formatMessage({ id: id, defaultMessage: fallback }, values);
  const label = (id, fallback) => <FormattedMessage id={id} defaultMessage={fallback} />;
  const toOptions = (list) =>
    list.map((item) => ({
      value: item.value,
      label: item.label || t(item.msgId, item.fallback),
    }));

  const requiredRule = [{ required: true, message: t("form.required", "此项为必填") }];

  const handleFinish = () => {
    message.success(t("form.saved", "采集策略已保存并下发"));
  };

  const handleReset = () => {
    form.resetFields();
    setEnhanced(true);
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
        form={form}
        layout="vertical"
        initialValues={policyFormInitialValues}
        onFinish={handleFinish}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="policyName"
              label={label("form.policyName", "策略名称")}
              rules={requiredRule}
            >
              <Input placeholder={t("form.policyName.placeholder", "请输入策略名称")} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="deviceType" label={label("form.deviceType", "设备类型")}>
              <Select options={toOptions(deviceTypeOptions)} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="site" label={label("form.site", "应用站点")}>
              <Select options={toOptions(siteOptions)} showSearch optionFilterProp="label" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="protocol" label={label("form.protocol", "上报协议")}>
              <Radio.Group options={protocolOptions} optionType="button" buttonStyle="solid" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="interval" label={label("form.interval", "采集周期（秒）")}>
              <InputNumber min={5} max={3600} step={5} className="full-width" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="priority" label={label("form.priority", "策略优先级")}>
              <Select options={toOptions(priorityOptions)} />
            </Form.Item>
          </Col>
        </Row>

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
          <Form.Item name="enhanced" valuePropName="checked" noStyle>
            <Switch onChange={setEnhanced} />
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
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="sampleInterval"
                  label={label("form.sampleInterval", "采样间隔（毫秒）")}
                >
                  <InputNumber min={100} max={60000} step={100} className="full-width" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="batchSize" label={label("form.batchSize", "单次上报条数")}>
                  <InputNumber min={1} max={500} className="full-width" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="heartbeat" label={label("form.heartbeat", "心跳超时（秒）")}>
                  <InputNumber min={5} max={600} className="full-width" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="bufferLimit"
                  label={label("form.bufferLimit", "离线缓存上限（条）")}
                >
                  <InputNumber min={100} max={100000} step={100} className="full-width" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="compression" label={label("form.compression", "数据压缩")}>
                  <Select options={toOptions(compressionOptions)} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="retries" label={label("form.retries", "失败重试次数")}>
                  <InputNumber min={0} max={10} className="full-width" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="masking"
                  valuePropName="checked"
                  label={label("form.masking", "敏感数据脱敏")}
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="remark" label={label("form.remark", "策略备注")}>
                  <Input.TextArea
                    rows={2}
                    placeholder={t(
                      "form.remark.placeholder",
                      "补充说明该策略的适用范围与注意事项"
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        ) : null}

        <div className="form-actions">
          <Button onClick={handleReset}>{label("form.reset", "重置")}</Button>
          <Button type="primary" htmlType="submit" icon={<Icon name="save" size={14} />}>
            {label("form.submit", "保存配置")}
          </Button>
        </div>
      </Form>
    </SectionCard>
  );
}

import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import Drawer from "@nce/eview-react/Drawer";
import Form from "@nce/eview-react/Form";
import TextField from "@nce/eview-react/TextField";
import Select from "@nce/eview-react/Select";
import Spinner from "@nce/eview-react/Spinner";
import DatePicker from "@nce/eview-react/DatePicker";
import TextArea from "@nce/eview-react/TextArea";
import Button from "@nce/eview-react/Button";
// TODO_CONTRACT: IconPlusIcPublicClock 组件名需经 icon-plus getIconInfo("clock") 核实（skill 示例名为示意）
import { IconPlusIcPublicClock } from "@nce/icon-plus";
import { useApp } from "../../context.jsx";
import {
  CATEGORY_OPTIONS,
  CYCLE_OPTIONS,
  DIMENSION_OPTIONS,
  OWNER_OPTIONS,
  POLARITY_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
  UNIT_OPTIONS,
} from "../../data.js";
import "./index.css";

// Layer 4: 指标定义编辑器（抽屉表单：新建 / 编辑复用同一份字段）
// data.js 的字典用 { value, label }；eview-react Select 需 { text, value }，在此适配
const toSelectOptions = (opts) => opts.map((o) => ({ text: o.label, value: o.value }));

const INITIAL_VALUES = {
  name: "",
  code: "",
  category: "资源性能",
  cycle: "每日",
  dimension: "全局",
  unit: "%",
  polarity: "higher",
  status: "draft",
  source: "指标中台",
  owner: "张明",
  effectiveAt: new Date(),
  description: "",
};

// TODO_CONTRACT: 成功反馈 toast 未接入（eview-react skill 暂未覆盖 transient toast；
// 原 antd 命令式提示已移除，保存后由抽屉关闭 + 列表刷新提供反馈）

export default function MetricEditor() {
  const { editor, closeEditor, saveMetric } = useApp();
  const formRef = useRef(null);
  const isEdit = editor.mode === "edit";

  useEffect(() => {
    if (!editor.open) return;
    if (isEdit && editor.record) {
      formRef.current?.setFieldsValue({
        name: editor.record.name,
        code: editor.record.code,
        category: editor.record.category,
        cycle: editor.record.cycle,
        dimension: editor.record.dimension,
        unit: editor.record.unit,
        target: editor.record.target,
        polarity: editor.record.polarity,
        status: editor.record.status,
        source: editor.record.source,
        owner: editor.record.owner,
        effectiveAt: editor.record.effectiveAt ? new Date(editor.record.effectiveAt) : new Date(),
        description: editor.record.description,
      });
    } else {
      formRef.current?.resetFields();
      // initialValues 的 effectiveAt 在模块加载时取值，此处按打开时刻刷新
      formRef.current?.setFieldsValue({ effectiveAt: new Date() });
    }
  }, [editor.open, editor.mode, editor.record]);

  // DatePicker 在 Form 内托管，onSuccess 拿到的是 Date；saveMetric 期望 dayjs（调 .format）
  const handleSuccess = (values) => {
    const payload = {
      ...values,
      effectiveAt: values.effectiveAt ? dayjs(values.effectiveAt) : null,
    };
    saveMetric(payload);
  };

  return (
    <Drawer
      visible={editor.open}
      title={isEdit ? "编辑指标" : "新建指标"}
      placement="right"
      width={720}
      destroyOnClose
      isClickMask={false}
      className="metric-editor"
      onClose={closeEditor}
    >
      <Form
        ref={formRef}
        initialValues={INITIAL_VALUES}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        component={false}
        onSuccess={handleSuccess}
      >
        <h3 className="metric-editor__section-title">基本信息</h3>
        <Form.Item label="指标名称" name="name" rules={[{ required: true }]}>
          <TextField placeholder="例如：集群 CPU 平均使用率" maxLength={64} />
        </Form.Item>
        <Form.Item label="指标编码" name="code" rules={[{ required: true }]}>
          <TextField
            placeholder="例如：res.cpu.usage.avg"
            maxLength={64}
            isCharacterAllowed={(v) => /^[a-z0-9.]*$/.test(v)}
          />
        </Form.Item>
        <Form.Item label="指标分类" name="category" rules={[{ required: true }]}>
          <Select options={toSelectOptions(CATEGORY_OPTIONS)} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="统计周期" name="cycle" rules={[{ required: true }]}>
          <Select options={toSelectOptions(CYCLE_OPTIONS)} defaultLabel="请选择" />
        </Form.Item>

        <h3 className="metric-editor__section-title">统计口径</h3>
        <Form.Item label="统计维度" name="dimension" rules={[{ required: true }]}>
          <Select options={toSelectOptions(DIMENSION_OPTIONS)} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="统计单位" name="unit" rules={[{ required: true }]}>
          <Select options={toSelectOptions(UNIT_OPTIONS)} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="目标值" name="target" rules={[{ required: true }]}>
          <Spinner min={0} max={100000000} precision={2} doNotFocusWhenValueUpdate />
        </Form.Item>
        <Form.Item label="指标极性" name="polarity" rules={[{ required: true }]}>
          <Select options={toSelectOptions(POLARITY_OPTIONS)} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="数据来源" name="source" rules={[{ required: true }]}>
          <Select options={toSelectOptions(SOURCE_OPTIONS)} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="责任人" name="owner" rules={[{ required: true }]}>
          <Select options={toSelectOptions(OWNER_OPTIONS)} defaultLabel="请选择" />
        </Form.Item>

        <h3 className="metric-editor__section-title">生效与归属</h3>
        <Form.Item label="生效日期" name="effectiveAt" rules={[{ required: true }]}>
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择生效日期" />
        </Form.Item>
        <Form.Item label="指标状态" name="status" rules={[{ required: true }]}>
          <Select options={toSelectOptions(STATUS_OPTIONS)} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item col={24} label="指标说明" name="description">
          <TextArea
            rows={3}
            placeholder="说明统计口径、异常判定规则与下游联动，例如：按机房维度采集，偏差超过 10% 触发告警。"
          />
        </Form.Item>
      </Form>

      {isEdit && editor.record ? (
        <div className="metric-editor__meta">
          <IconPlusIcPublicClock iconSize={14} />
          <span>
            最近更新 {editor.record.updatedAt} · 达成率{" "}
            {Number(editor.record.ratio || 0).toFixed(1)}%
          </span>
        </div>
      ) : null}

      <div className="metric-editor__footer">
        <Button text="取消" onClick={closeEditor} />
        <Button status="primary" text="保存" onClick={() => formRef.current.submit()} />
      </div>
    </Drawer>
  );
}

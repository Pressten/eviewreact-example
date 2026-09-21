import { useRef } from 'react';
import Drawer from '@nce/eview-react/Drawer';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import TextArea from '@nce/eview-react/TextArea';
import Select from '@nce/eview-react/Select';
import Spinner from '@nce/eview-react/Spinner';
import DatePicker from '@nce/eview-react/DatePicker';
import Button from '@nce/eview-react/Button';
import {
  CATEGORY_OPTIONS,
  CYCLE_OPTIONS,
  DIMENSION_OPTIONS,
  OWNER_OPTIONS,
  POLARITY_OPTIONS,
  SOURCE_OPTIONS,
  STATUS_OPTIONS,
  UNIT_OPTIONS,
} from '../../mock/metrics.js';
import { IconClock } from '../../components/icons.jsx';
import { useApp } from '../../context.jsx';

// 指标定义编辑器（抽屉表单：新建 / 编辑复用同一份字段）
// Form 2.0 托管：Form.Item name + rules，控件不传 value/onChange；
// 提交按钮调 formRef.current.submit() → 校验通过走 onSuccess(values)，失败走 onFailed。
// 多列用 Form itemCol={12}（两列），单项整行用 Form.Item col={24}；
// 分组标题 <h3> 作为 Form 直接子级放在 Form.Item 之间（不包进容器）。

const CREATE_INITIAL = {
  name: '',
  code: '',
  category: '资源性能',
  cycle: '每日',
  dimension: '全局',
  unit: '%',
  target: '',
  polarity: 'higher',
  source: '指标中台',
  owner: '张明',
  effectiveAt: new Date(),
  status: 'draft',
  description: '',
};

function MetricEditor() {
  const { editor, closeEditor, saveMetric, notify } = useApp();
  const formRef = useRef(null);
  const isEdit = editor.mode === 'edit';

  const initialValues = isEdit && editor.record
    ? {
        name: editor.record.name || '',
        code: editor.record.code || '',
        category: editor.record.category,
        cycle: editor.record.cycle,
        dimension: editor.record.dimension,
        unit: editor.record.unit,
        target: editor.record.target,
        polarity: editor.record.polarity,
        source: editor.record.source,
        owner: editor.record.owner,
        effectiveAt: editor.record.effectiveAt ? new Date(editor.record.effectiveAt) : new Date(),
        status: editor.record.status,
        description: editor.record.description || '',
      }
    : CREATE_INITIAL;

  const handleSuccess = (values) => {
    saveMetric(values);
    notify('success', isEdit ? '指标定义已更新' : '指标定义已创建');
  };

  const handleFailed = () => {
    notify('warn', '请补全必填字段');
  };

  const validateCode = (value) => ({
    result: !value || /^[a-z0-9.]+$/.test(value),
    message: '仅支持小写字母、数字与英文句点',
  });

  return (
    <Drawer
      title={isEdit ? '编辑指标' : '新建指标'}
      visible={editor.open}
      width={720}
      destroyOnClose
      onClose={closeEditor}
    >
      <Form
        ref={formRef}
        key={(isEdit ? 'edit-' : 'create-') + (editor.record ? editor.record.id : 'new')}
        initialValues={initialValues}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        validateAllChildComponent
        component={false}
        onSuccess={handleSuccess}
        onFailed={handleFailed}
      >
        <h3 className="metric-editor__section-title">基本信息</h3>
        <Form.Item label="指标名称" name="name" rules={[{ required: true }]}>
          <TextField placeholder="例如：集群 CPU 平均使用率" maxLength={64} />
        </Form.Item>
        <Form.Item label="指标编码" name="code" rules={[{ required: true }]}>
          <TextField placeholder="例如：res.cpu.usage.avg" validator={validateCode} ruleText="小写字母、数字与句点" />
        </Form.Item>
        <Form.Item label="指标分类" name="category" rules={[{ required: true }]}>
          <Select options={CATEGORY_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="统计周期" name="cycle" rules={[{ required: true }]}>
          <Select options={CYCLE_OPTIONS} defaultLabel="请选择" />
        </Form.Item>

        <h3 className="metric-editor__section-title">统计口径</h3>
        <Form.Item label="统计维度" name="dimension" rules={[{ required: true }]}>
          <Select options={DIMENSION_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="统计单位" name="unit" rules={[{ required: true }]}>
          <Select options={UNIT_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="目标值" name="target" rules={[{ required: true }]}>
          <Spinner min={0} precision={2} doNotFocusWhenValueUpdate />
        </Form.Item>
        <Form.Item label="指标极性" name="polarity" rules={[{ required: true }]}>
          <Select options={POLARITY_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="数据来源" name="source" rules={[{ required: true }]}>
          <Select options={SOURCE_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="责任人" name="owner" rules={[{ required: true }]}>
          <Select options={OWNER_OPTIONS} defaultLabel="请选择" />
        </Form.Item>

        <h3 className="metric-editor__section-title">生效与归属</h3>
        <Form.Item label="生效日期" name="effectiveAt" rules={[{ required: true }]}>
          <DatePicker type="date" format="yyyy-MM-dd" placeholder="请选择生效日期" />
        </Form.Item>
        <Form.Item label="指标状态" name="status" rules={[{ required: true }]}>
          <Select options={STATUS_OPTIONS} defaultLabel="请选择" />
        </Form.Item>
        <Form.Item label="指标说明" name="description" col={24}>
          <TextArea
            rows={3}
            placeholder="说明统计口径、异常判定规则与下游联动，例如：按机房维度采集，偏差超过 10% 触发告警。"
          />
        </Form.Item>
      </Form>

      {isEdit && editor.record ? (
        <div className="metric-editor__meta">
          <IconClock />
          <span>
            最近更新 {editor.record.updatedAt} · 达成率 {Number(editor.record.ratio || 0).toFixed(1)}%
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

export default MetricEditor;

import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Select from '@nce/eview-react/Select';
import Spinner from '@nce/eview-react/Spinner';
import TextArea from '@nce/eview-react/TextArea';
import Toggle from '@nce/eview-react/Toggle';
import CheckboxGroup from '@nce/eview-react/CheckboxGroup';
import { Icon } from '../../shared/icon.jsx';
import TimeRangeField from '../../shared/time-range-field.jsx';
import { deviceTypeOptions, levelOptions, notifyOptions } from '../../mock/strategy.js';
import './index.css';

// Layer 3: 策略参数字段组 — 以“返回 Form.Item 数组的函数”形式提供，
// 在 <Form> 内直接展开为直接子级（eview-react Form.Item 必须是 Form 的直接子节点，
// 不能用 div / Fragment / 子组件包裹一组，否则 itemCol 栅格与 ev_label 宽度塌缩）。
// 基础参数（StrategyForm 与 StrategyModal 共用）；高级参数（仅 StrategyForm 开关打开后渲染）。

function toOptions(list, t) {
  return list.map((item) => ({ value: item.value, text: t(item.labelId) }));
}

// 基础参数 Form.Item 数组（首项是分组标题装饰节点，放在 Form.Item 之间，不包裹它们）
export function basicFieldItems(t, intl) {
  return [
    <div key="basic-head" className="strategy-fields__group">
      <span className="strategy-fields__group-title">{t('form.basicTitle')}</span>
      <span className="strategy-fields__group-line" />
    </div>,
    <Form.Item key="name" label={t('form.name')} name="name" rules={[{ required: true }]} col={24}>
      <TextField placeholder={t('form.name.ph')} maxLength={40} />
    </Form.Item>,
    <Form.Item key="deviceType" label={t('form.deviceType')} name="deviceType" rules={[{ required: true }]}>
      <Select options={toOptions(deviceTypeOptions, t)} defaultLabel={t('form.deviceType.ph')} />
    </Form.Item>,
    <Form.Item key="intervalSec" label={t('form.interval')} name="intervalSec" rules={[{ required: true }]}>
      <Spinner min={5} max={86400} step={5} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item key="level" label={t('form.level')} name="level">
      <Select options={toOptions(levelOptions, t)} />
    </Form.Item>,
    <Form.Item key="timeRange" label={t('form.timeRange')} name="timeRange">
      <TimeRangeField placeholderStart="00:00" placeholderEnd="23:59" />
    </Form.Item>,
    <Form.Item key="desc" label={t('form.desc2')} name="desc" col={24}>
      <TextArea rows={3} maxLength={200} placeholder={t('form.desc2.ph')} />
    </Form.Item>,
  ];
}

// 高级参数 Form.Item 数组（开关打开后渲染；首项为高级分组标题）
export function advancedFieldItems(t, intl) {
  return [
    <div key="adv-head" className="strategy-fields__group">
      <span className="strategy-fields__group-title">{t('form.advancedTitle')}</span>
      <span className="strategy-fields__group-line" />
      <span className="strategy-fields__group-chip">
        <Icon name="sliders-horizontal" size={12} />
        {intl.formatMessage({ id: 'form.advancedBadge' }, { count: 6 })}
      </span>
    </div>,
    <Form.Item key="threshold" label={t('form.threshold')} name="threshold">
      <Spinner min={0} max={100} step={1} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item key="retry" label={t('form.retry')} name="retry">
      <Spinner min={1} max={10} step={1} doNotFocusWhenValueUpdate />
    </Form.Item>,
    <Form.Item
      key="flap"
      label={t('form.flap')}
      name="flap"
      valuePropName="toggled"
      updateTrigger="onToggle"
      labelTip={t('form.flapDesc')}
      layout="horizontal"
      labelCol={20}
      wrapperCol={4}
      col={24}
      className="switch-row-item"
    >
      <Toggle data={[false, true]} />
    </Form.Item>,
    <Form.Item key="silent" label={t('form.silent')} name="silent">
      <TimeRangeField placeholderStart="22:00" placeholderEnd="06:00" />
    </Form.Item>,
    <Form.Item key="notify" label={t('form.notify')} name="notify" col={24}>
      <CheckboxGroup data={toOptions(notifyOptions, t)} className="strategy-fields__checks" />
    </Form.Item>,
    <Form.Item key="memo" label={t('form.memo')} name="memo" col={24}>
      <TextArea rows={2} maxLength={120} placeholder={t('form.memo.ph')} />
    </Form.Item>,
  ];
}

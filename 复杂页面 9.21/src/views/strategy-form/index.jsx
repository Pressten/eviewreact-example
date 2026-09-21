import { useRef, useState } from 'react';
import Form from '@nce/eview-react/Form';
import Button from '@nce/eview-react/Button';
import Toggle from '@nce/eview-react/Toggle';
import { useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import { useToast } from '../../shared/toast.jsx';
import { basicFieldItems, advancedFieldItems } from '../../components/strategy-fields/index.jsx';
import './index.css';

// Layer 4: 策略参数表单卡片 — 开关打开后展开高级参数面板
// Form 2.0 托管：ref + onSuccess/onFailed；按钮 onClick 调 formRef.submit() 触发校验。
// Form.Item 必须是 Form 直接子节点 → 字段以数组形式展开（不用 div / Fragment 包裹一组）。
const INITIAL = {
  name: '',
  deviceType: null,
  intervalSec: 60,
  level: 'warning',
  timeRange: null,
  desc: '',
  advanced: false,
  threshold: 90,
  retry: 3,
  flap: true,
  silent: null,
  notify: ['inbox', 'email'],
  memo: '',
};

export default function StrategyForm({ onOpenModal }) {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancedOn, setAdvancedOn] = useState(false);
  const { notify } = useToast();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const handleSuccess = async (values) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // 真实项目替换为已有 Service
      await new Promise((resolve) => setTimeout(resolve, 600));
      notify('success', t('toast.created'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFailed = () => {
    notify('warn', t('toast.validate'));
  };

  const handleReset = () => {
    formRef.current?.resetFields();
    setAdvancedOn(false);
  };

  return (
    <section className="panel-card strategy-form">
      <header className="panel-card__head">
        <div className="panel-card__titles">
          <h2 className="panel-card__title">
            <Icon name="sliders-horizontal" size={16} />
            {t('form.title')}
          </h2>
          <p className="panel-card__desc">{t('form.desc')}</p>
        </div>
        <div className="panel-card__actions">
          <span className="strategy-form__draft">
            <Icon name="pencil-line" size={12} />
            {t('form.draftTag')}
          </span>
          <Button
            status="text"
            leftIcon={<Icon name="external-link" size={14} />}
            text={t('form.openModal')}
            onClick={onOpenModal}
          />
        </div>
      </header>

      <Form
        ref={formRef}
        initialValues={INITIAL}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        onSuccess={handleSuccess}
        onFailed={handleFailed}
        onValuesChange={(changed) => {
          if (changed && 'advanced' in changed) setAdvancedOn(!!changed.advanced);
        }}
      >
        {basicFieldItems(t, intl)}

        <Form.Item
          label={t('form.advanced.toggle')}
          name="advanced"
          valuePropName="toggled"
          updateTrigger="onToggle"
          labelTip={t('form.advanced.toggleDesc')}
          layout="horizontal"
          labelCol={20}
          wrapperCol={4}
          col={24}
          className="switch-row-item"
        >
          <Toggle data={[false, true]} />
        </Form.Item>

        {advancedOn ? advancedFieldItems(t, intl) : null}

        {advancedOn ? (
          <p className="strategy-form__hint">
            <Icon name="info" size={12} />
            {t('form.hint')}
          </p>
        ) : null}

        <Form.Item colon={false} col={24}>
          <div className="strategy-form__footer">
            <Button
              leftIcon={<Icon name="undo-2" size={14} />}
              text={t('form.reset')}
              onClick={handleReset}
            />
            <div className="strategy-form__footer-main">
              <Button
                text={t('form.saveDraft')}
                disabled={submitting}
                onClick={() => notify('success', t('toast.draft'))}
              />
              <Button
                status="primary"
                text={t('form.submit')}
                disabled={submitting}
                leftIcon={<Icon name="save" size={14} />}
                onClick={() => formRef.current?.submit()}
              />
            </div>
          </div>
        </Form.Item>
      </Form>
    </section>
  );
}

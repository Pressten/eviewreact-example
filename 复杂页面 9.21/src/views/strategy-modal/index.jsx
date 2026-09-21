import { useEffect, useRef, useState } from 'react';
import Dialog from '@nce/eview-react/Dialog';
import Form from '@nce/eview-react/Form';
import Button from '@nce/eview-react/Button';
import Toggle from '@nce/eview-react/Toggle';
import { useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import { useToast } from '../../shared/toast.jsx';
import { basicFieldItems } from '../../components/strategy-fields/index.jsx';
import './index.css';

// Layer 4: 策略弹窗表单 — 页面头/表格行均可唤起，复用同一套基础参数字段
// Dialog：isOpen 受控 + onClose + buttons 数组；Form：ref + onSuccess；确定按钮调 submit()
const INITIAL = {
  name: '',
  deviceType: null,
  intervalSec: 60,
  level: 'warning',
  timeRange: null,
  desc: '',
  enableNow: true,
  flap: true,
};

export default function StrategyModal({ isOpen, record, onClose }) {
  const formRef = useRef(null);
  const [enableNow, setEnableNow] = useState(true);
  const [saving, setSaving] = useState(false);
  const { notify } = useToast();
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  // 编辑态：打开后用 setFieldsValue 回填（initialValues 只在初始化生效）
  useEffect(() => {
    if (!isOpen) return;
    if (record) {
      formRef.current?.setFieldsValue({
        name: record.name,
        deviceType: record.deviceType,
        intervalSec: record.intervalSec,
        level: record.level,
        enableNow: record.status === 'enabled',
      });
      setEnableNow(record.status === 'enabled');
    } else {
      formRef.current?.resetFields();
      setEnableNow(true);
    }
  }, [isOpen, record]);

  const handleSuccess = async (values) => {
    if (saving) return;
    setSaving(true);
    try {
      // 真实项目替换为已有 Service
      await new Promise((resolve) => setTimeout(resolve, 400));
      notify('success', record ? t('toast.updated') : t('toast.created'));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleFailed = () => {
    notify('warn', t('toast.validate'));
  };

  const handleDraft = () => {
    notify('success', t('toast.draft'));
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size={[560, 'auto']}
      style={{ maxHeight: '80vh' }}
      title={
        <span className="strategy-modal__title">
          <Icon name="circle-plus" size={16} />
          {record ? t('modal.title.edit') : t('modal.title.new')}
        </span>
      }
      buttons={[
        { text: t('modal.cancel'), disabled: saving, onClick: onClose },
        { text: t('modal.draft'), disabled: saving, onClick: handleDraft },
        { text: t('modal.ok'), status: 'primary', disabled: saving, onClick: () => formRef.current?.submit() },
      ]}
    >
      <p className="strategy-modal__desc">{t('modal.desc')}</p>

      <Form
        ref={formRef}
        initialValues={INITIAL}
        layout="vertical"
        itemCol={12}
        validateErrorType="tip"
        onSuccess={handleSuccess}
        onFailed={handleFailed}
        onValuesChange={(changed) => {
          if (changed && 'enableNow' in changed) setEnableNow(!!changed.enableNow);
        }}
      >
        {basicFieldItems(t, intl)}

        <Form.Item
          label={t('modal.enableNow')}
          name="enableNow"
          valuePropName="toggled"
          updateTrigger="onToggle"
          labelTip={t('modal.enableNowDesc')}
          layout="horizontal"
          labelCol={20}
          wrapperCol={4}
          col={24}
          className="switch-row-item"
        >
          <Toggle data={[false, true]} />
        </Form.Item>

        <p className="strategy-modal__status">
          <Icon name={enableNow ? 'circle-check' : 'pencil-line'} size={12} />
          {enableNow ? t('opt.status.enabled') : t('opt.status.draft')}
        </p>
      </Form>
    </Dialog>
  );
}

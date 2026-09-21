import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Icon } from '../../shared/icon.jsx';
import { useApp } from '../../context.jsx';
import './index.css';

// TODO(eview-react): 侧边导航 Menu（antd Menu mode="inline" + submenu）未覆盖，此处手写补位。
// 真实组件建议待 Menu / SideNav 规格就绪后替换；当前支持折叠态 + 子菜单展开/收起 + 选中态。
export default function SideNav() {
  const { collapsed } = useApp();
  const [current, setCurrent] = useState('strategy-form');
  const [openKeys, setOpenKeys] = useState({ strategy: true, device: true, alarm: false });
  const intl = useIntl();
  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback || id });

  const toggleGroup = (key) => {
    if (collapsed) return;
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    { key: 'overview', icon: 'layout-dashboard', label: t('nav.overview') },
    {
      key: 'strategy', icon: 'scroll-text', label: t('nav.strategy'),
      children: [
        { key: 'strategy-form', icon: 'sliders-horizontal', label: t('nav.strategy.form') },
        { key: 'strategy-list', icon: 'list-checks', label: t('nav.strategy.list') },
        { key: 'strategy-tpl', icon: 'copy', label: t('nav.strategy.template') },
      ],
    },
    {
      key: 'device', icon: 'network', label: t('nav.device'),
      children: [
        { key: 'device-list', icon: 'router', label: t('nav.device.list') },
        { key: 'device-group', icon: 'users', label: t('nav.device.group') },
        { key: 'device-firmware', icon: 'hard-drive', label: t('nav.device.firmware') },
      ],
    },
    {
      key: 'alarm', icon: 'bell', label: t('nav.alarm'),
      children: [
        { key: 'alarm-rule', icon: 'triangle-alert', label: t('nav.alarm.rule') },
        { key: 'alarm-history', icon: 'activity', label: t('nav.alarm.history') },
      ],
    },
    { key: 'report', icon: 'chart-column', label: t('nav.report') },
    { key: 'audit', icon: 'shield-check', label: t('nav.audit') },
    { key: 'settings', icon: 'settings', label: t('nav.settings') },
  ];

  return (
    <aside className={`side-nav${collapsed ? ' is-collapsed' : ''}`}>
      <nav className="side-nav__menu" aria-label="侧边导航">
        {items.map((item) => {
          const hasChildren = !!item.children;
          const isOpen = !!openKeys[item.key];
          const isGroupActive = hasChildren && item.children.some((c) => c.key === current);
          return (
            <div key={item.key} className="side-nav__item">
              <button
                type="button"
                className={`side-nav__link${isGroupActive ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
                onClick={() => (hasChildren ? toggleGroup(item.key) : setCurrent(item.key))}
                title={collapsed ? item.label : ''}
              >
                <Icon name={item.icon} size={16} />
                {!collapsed ? <span className="side-nav__label">{item.label}</span> : null}
                {hasChildren && !collapsed ? (
                  <Icon name={isOpen ? 'panel-left-close' : 'panel-left-open'} size={12} className="side-nav__arrow" />
                ) : null}
              </button>
              {hasChildren && isOpen && !collapsed ? (
                <div className="side-nav__sub">
                  {item.children.map((child) => (
                    <button
                      key={child.key}
                      type="button"
                      className={`side-nav__sublink${current === child.key ? ' is-active' : ''}`}
                      onClick={() => setCurrent(child.key)}
                    >
                      <Icon name={child.icon} size={16} />
                      <span>{child.label}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      <div className="side-nav__footer">
        <Icon name="wifi" size={14} />
        {collapsed ? null : <span>{t('nav.version')}</span>}
      </div>
    </aside>
  );
}

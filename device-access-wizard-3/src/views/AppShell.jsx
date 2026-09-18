import { useState } from 'react';
import Button from '@nce/eview-react/Button';
import Crumbs from '@nce/eview-react/Crumbs';
import SearchInput from '@nce/eview-react/SearchInput';
import Icon from '../components/Icon.jsx';
import { useApp } from '../context.jsx';
import { menuItems, breadcrumbs } from '../data.js';
import StepFlow from './StepFlow.jsx';
import './app-shell.css';

// Layout 有导出名但无 Reference → 手写 CSS 布局，复用源项目的 .shell-* 类名
function AppLayout({ header, sider, children }) {
    return (
        <div className="shell">
            <header className="shell-header">{header}</header>
            <div className="shell-body">
                <aside className="shell-sider">{sider}</aside>
                <main className="shell-content">{children}</main>
            </div>
        </div>
    );
}

// Menu 有导出名但无 Reference → 手写侧导航（可点击元素用 button）
function AppMenu({ items, activeKey, onSelect }) {
    return (
        <nav className="app-menu">
            {items.map((m) => (
                <button
                    key={m.key}
                    type="button"
                    className={`app-menu-item ${activeKey === m.key ? 'active' : ''}`}
                    onClick={() => onSelect(m.key)}
                >
                    <Icon name={m.icon} size={14} className="app-menu-icon" />
                    <span>{m.label}</span>
                </button>
            ))}
        </nav>
    );
}

// Avatar 无导出 → 手写圆形占位
function AppAvatar({ text }) {
    return (
        <div className="shell-avatar">{text}</div>
    );
}

// 布局骨架：顶导航 + 侧菜单 + 主体（面包屑 → 步骤流）
export default function AppShell() {
    const { isDark, toggleDark } = useApp();
    const [activeKey, setActiveKey] = useState('devices');

    return (
        <AppLayout
            header={
                <>
                    <div className="shell-brand">
                        <Icon name="zap" size={22} className="shell-brand-icon" />
                        <span className="shell-brand-text">电力接入平台</span>
                    </div>
                    <div className="shell-tools">
                        <SearchInput
                            placeholder="搜索设备 / 站点"
                            className="shell-search"
                        />
                        <Button
                            onClick={toggleDark}
                            title={isDark ? '切换浅色' : '切换深色'}
                        >
                            <Icon name={isDark ? 'sun' : 'moon'} size={14} /> {isDark ? '浅色' : '深色'}
                        </Button>
                        <AppAvatar text="王" />
                    </div>
                </>
            }
            sider={
                <AppMenu
                    items={menuItems}
                    activeKey={activeKey}
                    onSelect={setActiveKey}
                />
            }
        >
            <Crumbs
                data={breadcrumbs.map((b) => ({ title: b }))}
                className="shell-breadcrumb"
            />
            <StepFlow />
        </AppLayout>
    );
}

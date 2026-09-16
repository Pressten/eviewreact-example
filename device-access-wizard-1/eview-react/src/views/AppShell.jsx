import Crumbs from '@nce/eview-react/Crumbs';
import SearchInput from '@nce/eview-react/SearchInput';
import Button from '@nce/eview-react/Button';
import { Icon } from '../icons/Icon';
import { useApp } from '../context';
import { menuItems, breadcrumbs } from '../data';
import StepFlow from './StepFlow';

// 布局骨架 — antd Layout/Header/Sider/Content + Menu + Avatar 全部手写（无对应/无 Reference）
// 视觉用源项目的 .shell* / .app-menu* / .shell-avatar CSS，引用原始 token。
export default function AppShell() {
  const { isDark, toggleDark } = useApp();

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <Icon name="zap" size={22} className="shell-brand-icon" />
          <span className="shell-brand-text">电力接入平台</span>
        </div>
        <div className="shell-tools">
          {/* SearchInput 自带搜索图标，源项目的 prefix Icon 不再单独传 */}
          <SearchInput
            placeholder="搜索设备 / 站点"
            className="shell-search"
          />
          <Button onClick={toggleDark}>
            <Icon name={isDark ? 'sun' : 'moon'} size={14} />
          </Button>
          {/* Avatar 手写圆形占位 */}
          <div className="shell-avatar" title="当前用户">王</div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="shell-sider">
          {/* Menu 手写侧导航 */}
          <nav className="app-menu">
            {menuItems.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`app-menu-item ${m.key === 'devices' ? 'active' : ''}`}
              >
                <Icon name={m.icon} size={14} />
                <span>{m.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="shell-content">
          <Crumbs
            data={breadcrumbs.map((b) => ({ title: b }))}
            className="shell-breadcrumb"
          />
          <StepFlow />
        </main>
      </div>
    </div>
  );
}

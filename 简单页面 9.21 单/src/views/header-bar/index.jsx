import Badge from '@nce/eview-react/Badge';
import Button from '@nce/eview-react/Button';
import IconButton from '@nce/eview-react/IconButton';
import SearchInput from '@nce/eview-react/SearchInput';
import TipBox from '@nce/eview-react/TipBox';
import Toggle from '@nce/eview-react/Toggle';
import { IconGauge, IconBell, IconChevronDown } from '../../components/icons.jsx';
import { useApp } from '../../context.jsx';

// 顶部全局栏 — 品牌标识 / 全局检索 / 主题切换 / 用户区
function HeaderBar() {
  const { isDark, toggleDark, draft, updateDraft, applyFilters } = useApp();

  const handleKeywordKey = (event) => {
    if (event.key === 'Enter') applyFilters();
  };

  return (
    <header className="header-bar">
      <div className="header-bar__brand">
        <span className="header-bar__logo">
          <IconGauge />
        </span>
        <span className="header-bar__name">数据指标中心</span>
        <span className="header-bar__divider" />
        <span className="header-bar__module">指标管理</span>
      </div>

      <div className="header-bar__tools">
        <SearchInput
          className="header-bar__search"
          value={draft.keyword}
          placeholder="搜索指标名称、编码或负责人"
          onChange={(value) => updateDraft('keyword', value)}
          onClear={() => updateDraft('keyword', '')}
          inputProps={{ onKeyDown: handleKeywordKey }}
        />
        <TipBox type="simple" content={isDark ? '切换浅色模式' : '切换深色模式'} direction="bottom">
          <Toggle data={[false, true]} toggled={isDark} onToggle={() => toggleDark()} />
        </TipBox>
        <Badge content={3} offset={[-2, 2]}>
          <IconButton iconName={<IconBell />} tipText="消息通知" />
        </Badge>
        <span className="header-bar__divider" />
        <button type="button" className="header-bar__user">
          <span className="header-bar__avatar">顾</span>
          <span className="header-bar__username">顾云舟</span>
          <IconChevronDown />
        </button>
      </div>
    </header>
  );
}

export default HeaderBar;

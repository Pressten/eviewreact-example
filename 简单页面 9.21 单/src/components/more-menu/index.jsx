import { useEffect, useRef, useState } from 'react';
import IconButton from '@nce/eview-react/IconButton';
import { IconEllipsis } from '../icons.jsx';

// 行操作“更多”下拉菜单
// TODO(eview-react): 建议替换为 @nce/eview-react 的 DropDown / PopUpMenu，
// 本 Skill 暂无其规格；此处为最小可用版（点击展开 / 点外部收起 / 分隔线 / 危险项）。
function MoreMenu({ items, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const handleSelect = (key) => {
    setOpen(false);
    if (onSelect) onSelect(key);
  };

  return (
    <div className="more-menu" ref={rootRef}>
      <IconButton iconName={<IconEllipsis />} onClick={() => setOpen((v) => !v)} />
      {open ? (
        <div className="more-menu__panel" role="menu">
          {items.map((item, idx) =>
            item.divider ? (
              <div key={'d' + idx} className="more-menu__divider" role="separator" />
            ) : (
              <button
                key={item.key}
                type="button"
                className={'more-menu__item' + (item.danger ? ' more-menu__item--danger' : '')}
                onClick={() => handleSelect(item.key)}
              >
                {item.icon ? <span className="more-menu__item-icon">{item.icon}</span> : null}
                {item.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

export default MoreMenu;

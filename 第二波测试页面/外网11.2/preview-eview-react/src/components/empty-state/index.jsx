import Empty from '@nce/eview-react/Empty';

// 空态资源由组件库提供，业务只传说明文字。
export default function EmptyState({text,cls='device-empty',children}) {
  return <div className={cls}><Empty description={text}>{children}</Empty></div>;
}

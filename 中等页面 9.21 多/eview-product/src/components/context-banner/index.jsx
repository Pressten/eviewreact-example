// =============================================================================
// [共享组件] ContextBanner — 下钻上下文条（全局共享，多视图复用）
// 职责：二/三级页签中展示「当前基于哪条记录下钻」，并提供回退入口（onBack）。
// 复用方：record-detail / lineage-trace。
// 契约（冻结，勿改签名）：
//   props: {
//     icon?: string='link-2',       // icon-plus 图标语义名（经 ICON_MAP 映射到具体 IconPlus 组件）
//     title: string,                 // 上下文标题（指标名 / 记录批次）
//     crumb?: string,                // 副标题（code · domain · source 等）
//     fields?: Array<{label,value}>, // 摘要字段
//     onBack?: Function,             // 回退回调
//     backText?: string='返回上一级'
//   }
// 工程：@nce/eview-react Button + @nce/icon-plus 按需引入；禁用内置 Icon name=。
// 样式：私有 index.css，消费 token；class 前缀沿用 context-banner__*；暗色经 token 自动跟随。
// TODO_CONTRACT: 下列 IconPlusIc* 组件名为按 antd/Lucide keyword 推断的迁移占位，
//   待内网用 @nce/icon-plus 的 getIconInfo 接口核验后回填准确导出名（不影响 L0 渲染）。
// =============================================================================
import Button from '@nce/eview-react/Button';
import {
  IconPlusIcPublicLink,
  IconPlusIcPublicDatabase,
  IconPlusIcPublicArrowLeft,
} from '@nce/icon-plus';
import './index.css';

// 语义名 → icon-plus 组件映射（缺省回退到 link 图标）
const ICON_MAP = {
  'link-2': IconPlusIcPublicLink,
  database: IconPlusIcPublicDatabase,
  'arrow-left': IconPlusIcPublicArrowLeft,
};

export default function ContextBanner({
  icon = 'link-2',
  title,
  crumb,
  fields = [],
  onBack,
  backText = '返回上一级',
}) {
  const IconComp = ICON_MAP[icon] || IconPlusIcPublicLink;

  return (
    <div className="context-banner">
      <span className="context-banner__icon" aria-hidden="true">
        <IconComp iconSize={16} />
      </span>
      <div className="context-banner__body">
        <div className="context-banner__head">
          <span className="context-banner__title">{title}</span>
          {crumb ? <span className="context-banner__crumb">{crumb}</span> : null}
        </div>
        {fields.length > 0 ? (
          <div className="context-banner__fields">
            {fields.map((f) => (
              <span className="context-banner__field" key={f.label}>
                <span className="context-banner__field-label">{f.label}</span>
                <span className="context-banner__field-value">{f.value}</span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {onBack ? (
        <Button
          size="small"
          leftIcon={<IconPlusIcPublicArrowLeft iconSize={14} />}
          text={backText}
          onClick={onBack}
        />
      ) : null}
    </div>
  );
}

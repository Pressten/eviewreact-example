// Layer 3: 指标分类色标（非语义配色，仅用于分类区分，映射固定）。
// eview-react Tag 仅 6 种语义色（default/primary/success/warning/caution/danger），无法承载 5 类分类色系，
// 按 fallback pattern 用原生 JSX；颜色走已冻结的 --color-tag-text-*/--color-tag-bg-* token，
// 暗色随 <body>.dark（与 aui3_1_dark 同步）自动翻转，深色软底另加描边见 index.css。
// TODO(eview-react): 若需统一用 Tag，可用 <Tag style={{ color, background }}> 自定义分类色（TagClassify 用法）。
import "./index.css";

const CATEGORY_TONE = {
  资源性能: "info",
  业务运营: "green",
  服务质量: "purple",
  安全合规: "rose",
  容量规划: "cyan",
};

export default function CategoryChip({ category }) {
  const tone = CATEGORY_TONE[category] || "none";
  return <span className={"category-chip category-chip--" + tone}>{category}</span>;
}

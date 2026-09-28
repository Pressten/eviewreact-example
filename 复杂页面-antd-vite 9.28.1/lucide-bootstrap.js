// lucide-bootstrap.js
// 复刻 UMD index.page.html 的全局 LUCIDE 注入：在应用模块图求值前把 lucide 图标节点表
// 挂到 window.LUCIDE，供 assets/shared/icon.jsx 的 `typeof LUCIDE !== "undefined"` 分支使用。
// 本模块在 index.html 中以独立 <script type="module"> 置于 /src/main.jsx 之前，保证求值顺序。
import lucideNodes from './assets/library/lucide-icon-nodes.json';

if (typeof window !== 'undefined' && !window.LUCIDE) {
  window.LUCIDE = lucideNodes;
}

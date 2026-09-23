# Spin → Loading 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Spin` ⇄ eview `Loading`（`Loader` 是同一组件的别名导出）
- 定位差异：两者都是「加载动效」。但 eview Loading 用 `type`（`global` 全页遮罩 / `local` 覆盖最近 `position: relative` 父容器 / `micro` 控件内小圈）+ `isOpen` 显隐控制，而非 antd 的「包裹子元素 + `spinning`」模式。eview Loading 用 `desc` 表达说明文字、`iconUrl` 自定义图标；antd 用 `tip`/`indicator`。eview 无 `delay`/`percent`/`size` 等能力。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `spinning` | `isOpen` | 改名 | 显隐控制；eview 默认 `false` |
| `tip` | `desc` | 改名 | 说明文字 |
| `indicator` | `iconUrl` | 改名 | 自定义图标，eview 默认用 icon+ 组件 |
| `fullscreen` | `type="global"` | 改值 | antd `fullscreen` 布尔 → eview `type="global"`（见 2.1） |
| `size` | — | ❌ 无法映射 | eview 无尺寸属性，`micro` 已是小圈 |
| `delay` | — | ❌ 无法映射 | eview 无延迟显示，需自行用定时器实现（见 3.1） |
| `percent` | — | ❌ 无法映射 | eview 无进度展示，改用进度条组件 |
| `wrapperClassName` | `className` | 改名 | 包裹器类名 → 最外层类名 |
| — | `type` | eview 特有 | `'global' \| 'local' \| 'micro'`，默认 `global` |
| — | `textClassName` | eview 特有 | 说明文字样式 |
| — | `id` / `style` | eview 特有 | 最外层（局部遮罩常需 `zIndex`） |

## 2. 处理方式详解

### 2.1 `fullscreen` + `spinning` → `type="global"` + `isOpen`（改值 + 综合映射）

antd 用 `fullscreen` 布尔 + `spinning` 控制全页遮罩；eview 用 `type="global"` + `isOpen`。非全屏包裹场景对应 eview `type="local"`，按钮旁小圈对应 `type="micro"`。

```jsx
// antd 全屏
<Spin fullscreen spinning={pageLoading} tip="加载中..." />

// eview 全屏
<Loading type="global" isOpen={pageLoading} desc="加载中..." />

// antd 局部包裹
<Spin spinning={panelLoading} tip="刷新中"><Panel /></Spin>

// eview 局部：父容器必须 position: relative
<div style={{ position: 'relative', minHeight: 200 }}>
  <Panel />
  <Loading type="local" isOpen={panelLoading} desc="刷新中" />
</div>

// antd 按钮旁小圈（Spin 无此模式，常用 loading 属性）
// eview 微型
<Loading type="micro" isOpen={submitting} desc="提交中" />
```

### 2.2 `indicator` → `iconUrl`（改名）

```jsx
// antd
<Spin indicator={<CustomIcon spin />} spinning={loading} />

// eview
import { IconPlusIcPublicLoading } from '@nce/icon-plus';
<Loading type="micro" isOpen={loading} iconUrl={<IconPlusIcPublicLoading />} />
// eview iconUrl 收 string | ReactElement，推荐用 icon+ 组件
```

## 3. 无法映射的属性与建议处理

### 3.1 `delay` 延迟显示

eview 无延迟属性，需自行用定时器实现防闪烁。

```jsx
const [showLoading, setShowLoading] = useState(false);
useEffect(() => {
  if (!loading) { setShowLoading(false); return; }
  const t = setTimeout(() => setShowLoading(true), 200);   // 延迟 200ms 显示
  return () => clearTimeout(t);
}, [loading]);
<Loading type="local" isOpen={showLoading} />
```

### 3.2 `percent` 进度

eview Loading 无进度展示。如需进度条，改用专门的进度组件或自定义 `desc` 文案。

```jsx
<Loading type="local" isOpen={loading} desc={`${percent}%`} />
```

### 3.3 包裹子元素模式 → `local` + 父容器

antd Spin 习惯「包裹子元素」自动覆盖；eview 需手动给父容器加 `position: relative` 并把 Loading 放进去。

```jsx
// antd
<Spin spinning={loading}><Table /></Spin>

// eview
<div style={{ position: 'relative' }}>
  <Table />
  <Loading type="local" isOpen={loading} />
</div>
```

### 3.4 静态方法 `Spin.setDefaultIndicator`

eview 无全局默认指示符设置方法，需在每个 Loading 上单独传 `iconUrl`，或封装业务组件统一默认图标。

## 4. 完整示例对照

```jsx
// antd
<Spin
  fullscreen
  spinning={pageLoading}
  tip="加载中..."
  indicator={<CustomSpinIcon />}
  delay={200}
/>

// eview 等价
import Loading from '@nce/eview-react/Loading';
import { IconPlusIcPublicLoading } from '@nce/icon-plus';
const [showLoading, setShowLoading] = useState(false);
useEffect(() => {
  if (!pageLoading) { setShowLoading(false); return; }
  const t = setTimeout(() => setShowLoading(true), 200);   // delay 自行实现
  return () => clearTimeout(t);
}, [pageLoading]);
<Loading
  type="global"                                  // fullscreen → type="global"
  isOpen={showLoading}                          // spinning → isOpen
  desc="加载中..."                               // tip → desc
  iconUrl={<IconPlusIcPublicLoading />}         // indicator → iconUrl
/>
```

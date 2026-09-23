# Empty → Empty 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Empty` ⇄ eview `Empty`
- 定位差异：两者都是「没有内容」的占位组件（图 + 描述）。但 eview Empty 用 `type`（`'success'` / `'fail'`）显式区分「加载成功但数据为 0」与「加载失败 / 无权限」两种语义，antd Empty 只有一套默认插画，不区分成功 / 失败。语义迁移要点：搜索无结果、首次进入无数据 → `type="success"`；接口报错、无权限 → `type="fail"`。
- 内置图片常量：antd 提供 `Empty.PRESENTED_IMAGE_DEFAULT`（默认插画）与 `Empty.PRESENTED_IMAGE_SIMPLE`（简约插画，多用于表格内嵌小空态）。eview 没有等价的插画常量，改用 `type` 切换内置图：`PRESENTED_IMAGE_DEFAULT` → `type="success"`（语义为「无数据」）；`PRESENTED_IMAGE_SIMPLE` → `type="success"`（丢失简约样式，eview 表格内嵌空态请改用 `Table` 自带的 `emptyTableMsg` / `showEmptyImage`，不要在 Table 外再叠 Empty）。
- `description` 的本地化定制：antd 通过 `ConfigProvider` 的 `locale.RenderEmpty` 全局自定义各场景空态。eview 没有等价全局配置，需在使用处逐个传 `description` / `type`。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `description` | `description` | 直接改名 | 类型一致，均为 ReactNode，可放按钮等节点 |
| `image`（string URL） | `imgSrc` | 改值 | string 类型图片地址 → `imgSrc`（见 2.1） |
| `image`（`PRESENTED_IMAGE_DEFAULT`） | `type="success"` | 综合映射 | 默认插画 → success 语义；若场景为失败 / 无权限应改 `type="fail"`（见 2.2） |
| `image`（`PRESENTED_IMAGE_SIMPLE`） | `type="success"` | 综合映射 | 简约插画无等价物；表格内嵌建议改用 `Table` 自带空态（见 2.2） |
| `image`（自定义 ReactNode 插画） | — | ❌ 无法映射 | eview `imgSrc` 仅收 string；自定义插画 ReactNode 无对应槽位，改用 `imgSrc` 传 URL 或 `icon` 传图标（见 3.1） |
| `imageStyle` | — | ❌ 无法映射 | eview 无图片样式属性，需通过自定义 `imgSrc` 资源或外层 `style` 调整（见 3.2） |
| — | `type` | eview 特有 | `'success'` / `'fail'`，区分无数据 / 失败语义 |
| — | `icon` | eview 特有 | 自定义图标 ReactNode（推荐 `icon={<IconPlusIc* />}`） |
| — | `imgSrc` | eview 特有 | 自定义图片地址（仅 string） |
| — | `className` / `style` | eview 特有 | 最外层样式 |

## 2. 处理方式详解

### 2.1 `image`（string URL）→ `imgSrc`（改值）

antd `image` 为 string 时表示自定义图片地址；eview `imgSrc` 同样收 string URL，直接改名即可。注意 eview `imgSrc` 仅接受 string，不接受 ReactNode。

```jsx
// antd
<Empty image="./images/no-data.png" description="暂无数据" />

// eview
<Empty imgSrc="./images/no-data.png" description="暂无数据" />
```

### 2.2 `image`（内置常量）→ `type`（综合映射）

antd 两个内置常量对应不同插画样式，eview 没有「简约 / 默认」的样式切换，只有 `type` 的语义切换。需按使用场景选 `type`：

```js
function toEviewType(image) {
  // antd 默认插画 / 简约插画 → eview 用语义 type
  // 「无数据」场景（搜索无结果、首次进入）→ success
  // 「失败 / 无权限」场景 → fail
  // PRESENTED_IMAGE_SIMPLE 多用于表格内嵌 → 改用 Table 自带空态
  return 'success'; // 默认按「无数据」处理
}
```

```jsx
// antd：默认插画
<Empty description="暂无数据" />
// 等价于 image={Empty.PRESENTED_IMAGE_DEFAULT}

// eview：默认按「无数据」语义
<Empty type="success" description="暂无数据" />

// antd：简约插画（表格内嵌）
<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />

// eview：表格内嵌空态改用 Table 自带，不要外叠 Empty
<Table dataset={rows} emptyTableMsg="暂无数据" showEmptyImage />
```

注：若原场景是接口报错 / 无权限，应改 `type="fail"`，而非沿用 `success`。

## 3. 无法映射的属性与建议处理

### 3.1 `image`（自定义 ReactNode 插画）

eview 的 `imgSrc` 仅收 string，`icon` 收 ReactNode 但定位是图标而非插画。自定义插画 ReactNode 无直接槽位，建议改用 `imgSrc` 传图片 URL，或用 `icon` 传一个图标组件近似。

```jsx
// antd
<Empty image={<CustomIllustration />} description="暂无权限" />

// eview：改用 imgSrc 传 URL（推荐）
<Empty imgSrc="./images/no-permission.png" description="暂无权限，请联系管理员" />

// 或用 icon 传图标近似（丢失插画细节）
<Empty icon={<IconPlusIcPublicSearch />} description="暂无权限，请联系管理员" />
```

### 3.2 `imageStyle`

eview Empty 没有图片样式属性，无法控制内置图的大小 / 边距。建议：

```jsx
// antd
<Empty imageStyle={{ height: 60, marginBottom: 8 }} description="暂无数据" />

// eview：自定义图片资源时通过外层 style 间接调整；内置图无法调样式
<Empty
  type="success"
  description="暂无数据"
  style={{ ['--empty-img-height' as any]: 60 }} // 仅在内置图暴露 CSS 变量时有效，否则无效
/>
// 最稳妥：改用 imgSrc 传自带尺寸的自定义图片
<Empty imgSrc="./images/no-data-sm.png" description="暂无数据" />
```

## 4. 完整示例对照

```jsx
// antd
import { Empty, Button } from 'antd';

<Empty
  image={Empty.PRESENTED_IMAGE_SIMPLE}
  imageStyle={{ height: 60 }}
  description={<span>未找到相关结果 <Button type="link">清空筛选</Button></span>}
/>

// eview 等价
import Empty from '@nce/eview-react/Empty';
import Button from '@nce/eview-react/Button';

<Empty
  type="success"                  // PRESENTED_IMAGE_SIMPLE → type="success"（丢失简约样式）
  description={                   // description 直接保留，内嵌按钮改用 status="text"
    <span>
      未找到相关结果
      <Button status="text" text="清空筛选" onClick={() => {}} />
    </span>
  }
/>
// 注：imageStyle 无法映射，需通过自定义 imgSrc 资源调整图片尺寸
```

# Steps → Steps 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Steps` ⇄ eview `Steps`（导入路径是 `Steps`，`Wizards` 是同时保留的旧名）
- 定位差异：两者都是「多步骤任务的步骤条」。但 eview Steps 用 `data` 数组驱动（不是 `items`），选项字段是 `text`/`value`（不是 `title`）；`currentStep` 对应 `data[].value`（不是下标）。eview Steps 无 `type`（navigation/inline）、`percent`、`progressDot`、`responsive`、`size` 等能力，状态仅支持 `error`（无 wait/process/finish 显式枚举，由 `currentStep` 推导）。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `items` | `data` | 综合映射 | 字段名不同：antd `{ title, value?, description?, icon?, status?, subTitle?, disabled? }` → eview `{ text, value, description?, iconUrl?, status?, className? }`（见 2.1） |
| `current` | `currentStep` | 综合映射 | antd 是下标（0 起）；eview 对应 `data[].value`（见 2.2） |
| `initial` | — | ❌ 无法映射 | eview 序号由 `data[].value` 决定，无起始偏移 |
| `direction` | `direction` | 直接改名 | eview 仅 `vertical`（demo 出现，API 表未列）；antd `horizontal` 默认即 eview 默认 |
| `labelPlacement` | `labelPlacement` | 改值 | 默认值不同：antd 默认 `horizontal`，eview 默认 `vertical`（见 2.3） |
| `status` | `data[].status` | 综合映射 | antd 整条 Steps 的 status → eview 拆到每项；eview 仅支持 `error`（见 2.4） |
| `type` | — | ❌ 无法映射 | eview 无 navigation/inline 类型，仅 default 形态 |
| `percent` | — | ❌ 无法映射 | eview 无进度条进度 |
| `progressDot` | — | ❌ 无法映射 | eview 无点状步骤条 |
| `responsive` | — | ❌ 无法映射 | eview 无响应式自动竖排 |
| `size` | — | ❌ 无法映射 | eview 无尺寸属性 |
| `className` | `className` | 直接改名 | |
| `onChange` | `onClick` | 改名 + 签名调整 | antd `onChange(current)` → eview `onClick(index)`；参数语义均为下标（见 2.5） |
| — | `disabled` | eview 特有 | 整条禁用 |
| — | `wizardTextStyle` | eview 特有 | 每步文字样式 |
| — | `id` / `style` | eview 特有 | 外层容器 |

### StepItem → StepItem

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `title` | `text` | 改名 | 标题字段名转换 |
| `value` | `value` | 直接改名 | eview 必填；不配时序号默认 1、2、3… |
| `description` | `description` | 直接改名 | eview 可放 ReactNode |
| `icon` | `iconUrl` | 改名 | 自定义图标字段名转换 |
| `status` | `status` | 改值 | antd `wait`/`process`/`finish`/`error` → eview 仅 `error`（见 2.4） |
| `subTitle` | — | ❌ 无法映射 | eview 无子标题，折叠进 `description` |
| `disabled` | — | ❌ 无法映射 | eview 项级无 disabled，用 `onClick` 守卫拦截（见 3.1） |

## 2. 处理方式详解

### 2.1 `items` → `data` 字段转换（综合映射）

antd 用 `items`，字段 `{ title, value?, description?, icon?, status?, subTitle?, disabled? }`；eview 用 `data`，字段 `{ text, value, description?, iconUrl?, status?, className? }`。

```js
function toEviewData(antdItems) {
  return antdItems.map((it) => ({
    text: typeof it.title === 'string' ? it.title : String(it.title),  // title → text
    value: it.value ?? undefined,                                        // eview 必填
    description: it.subTitle ? <>{it.description} {it.subTitle}</> : it.description,  // subTitle 折进 description
    iconUrl: it.icon,                                                    // icon → iconUrl
    status: it.status === 'error' ? 'error' : '',                       // 仅保留 error
  }));
}
```

### 2.2 `current` → `currentStep`（综合映射）

antd `current` 是下标（从 `initial` 起）；eview `currentStep` 对应 `data[].value`，需按下标取 value。

```jsx
// antd：current 是下标
<Steps current={1} items={stepItems} />

// eview：currentStep 对应 data[].value
const stepData = [
  { text: '基本信息', value: '1' },
  { text: '网络配置', value: '2' },
  { text: '确认', value: '3' },
];
const [stepIndex, setStepIndex] = useState(1);
<Steps data={stepData} currentStep={stepData[stepIndex].value} />
```

### 2.3 `labelPlacement` 默认值差异（改值）

antd 默认 `horizontal`（文字在图标右侧）；eview 默认 `vertical`（文字在图标下方）。迁移时需显式传 `labelPlacement="horizontal"` 保持 antd 行为。

```jsx
// antd 默认水平
<Steps current={1} items={items} />

// eview 需显式声明以保持水平
<Steps data={data} currentStep={cur} labelPlacement="horizontal" />
```

### 2.4 `status` → `data[].status`（综合映射）

antd 整条 Steps 的 `status`（`wait`/`process`/`finish`/`error`）+ 子项 status；eview 仅支持项级 `status: 'error' | ''`，其余状态由 `currentStep` 推导。

```jsx
// antd：某步失败
<Steps current={1} status="error" items={items} />

// eview：把失败步骤的 status 设为 'error'
const data = stepData.map((s, i) => ({ ...s, status: i === 1 ? 'error' : '' }));
<Steps data={data} currentStep={stepData[stepIndex].value} />
```

### 2.5 `onChange` → `onClick`（改名 + 签名调整）

antd `onChange(current)`；eview `onClick(index)`。参数语义均为下标，但 eview 回调名不同。

```jsx
// antd：onChange(current)
<Steps current={cur} items={items} onChange={(current) => setCur(current)} />

// eview：onClick(index)
<Steps data={data} currentStep={cur} onClick={(index) => setStepIndex(index)} />
```

## 3. 无法映射的属性与建议处理

### 3.1 项级 `disabled` → `onClick` 守卫

eview 项级无 disabled 属性，需在 `onClick` 里拦截。

```jsx
const stepData = [
  { text: '基本信息', value: '1' },
  { text: '网络配置', value: '2' },
  { text: '确认', value: '3' },
];
<Steps
  data={stepData}
  currentStep={stepData[stepIndex].value}
  onClick={(index) => {
    if (index < stepIndex) setStepIndex(index);   // 只允许回跳已完成步骤
  }}
/>
```

### 3.2 `type="navigation"` / `type="inline"`

eview Steps 无 navigation/inline 类型，仅 default 形态。navigation 风格需自定义样式；inline 风格改用竖排 + 自定义描述。

### 3.3 `percent` 进度

eview 无步骤进度条，可在 `description` 中用文字表达进度。

### 3.4 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `initial` | 序号直接写进 `data[].value` |
| `type` (navigation/inline) | 忽略，仅 default |
| `percent` | 用 description 文字表达 |
| `progressDot` | 忽略 |
| `responsive` | 忽略 |
| `size` | 忽略 |
| StepItem.`subTitle` | 折进 `description` |
| StepItem.`disabled` | `onClick` 守卫拦截 |

## 4. 完整示例对照

```jsx
// antd
const stepItems = [
  { title: '基本信息', description: '名称', value: 1 },
  { title: '网络配置', description: '区域', value: 2 },
  { title: '确认', value: 3 },
];
<Steps
  current={1}
  status="process"
  labelPlacement="horizontal"
  items={stepItems}
  onChange={(current) => setStepIndex(current)}
/>

// eview 等价
import Steps from '@nce/eview-react/Steps';
const stepData = [
  { text: '基本信息', value: '1', description: '名称' },    // title → text
  { text: '网络配置', value: '2', description: '区域' },
  { text: '确认', value: '3' },
];
const [stepIndex, setStepIndex] = useState(1);
const data = stepData.map((s) => ({ ...s, status: '' }));   // status 由 currentStep 推导
<Steps
  data={data}
  currentStep={stepData[stepIndex].value}                    // current 下标 → currentStep value
  labelPlacement="horizontal"                                // 显式声明保持 antd 默认
  onClick={(index) => setStepIndex(index)}                  // onChange → onClick
/>
```

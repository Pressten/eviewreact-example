# DatePicker → DatePicker 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `DatePicker` ⇄ eview `DatePicker`
- 定位差异：两者都是「点输入框弹出面板选日期」。但 antd 通过**多个组件 + `picker` 属性**表达不同形态——`DatePicker`、`DatePicker[picker=month|week|quarter|year]`、`RangePicker` 五种；eview 用**单一组件 + `type` / `range`** 表达全部形态：`type="date|datetime|month|quarter|year|week"`、`range={[]}` 开启范围选择。更关键的差异是**数据类型与受控语义**：antd 用 dayjs 对象受控、`onChange(date, dateString)` 直接回写；eview 用 **Date 对象（24 小时制）**，且官方明确警告——`onChange(dateString, date?, target?, dstDate?)` 的第一个参是字符串，**不能无条件回写 `value`**（官方反例 `DatePickerBadExample.jsx`），只应在第二参 `date` 为有效 Date 时回写 Date 对象，或干脆用 `defaultValue` + `ref.getValue()`。此外 antd 的 `showTime` / `disabledDate` / `minDate` / `maxDate` 在 eview 分别落到 `type="datetime"` + `timeEmbedded` + `format`、`dateRange` 上；antd RangePicker 的确定/取消落到 eview `onOkClick` / `onCancelClick`（且 `onOkClick` 内需 `setTimeout` 再 setState）。

## 1. 属性映射表

> antd 通过 `picker` 与 `RangePicker` 派生多种形态，eview 统一用 `type` + `range` 表达。下表把 DatePicker / 各 picker 变体 / RangePicker 的全部属性合并列出。

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `picker="date"` | `type="date"` | 改值 | 默认值一致 |
| `picker="month"` | `type="month"` | 改值 | 值同名，需配 `format="yyyy-MM"` |
| `picker="week"` | `type="week"` | 改值 | 需配 `format="yyyy-wo"` |
| `picker="quarter"` | `type="quarter"` | 改值 | 需配 `format="yyyy-QQ"` |
| `picker="year"` | `type="year"` | 改值 | 需配 `format="yyyy"` |
| `value` (dayjs) | `value` (Date) | 改值 | dayjs → Date；用 24 小时制，不建议传字符串（见 2.1） |
| `defaultValue` (dayjs) | `defaultValue` (Date) | 改值 | dayjs → Date；eview `defaultValue` 只在初始化生效，异步回填需用 `value`（见 2.1） |
| `format` | `format` | 改值 | dayjs 占位符 → eview 占位符：`YYYY→yyyy`、`DD→dd`、`wo→wo`、`QQ→QQ`，其余 `MM/HH/mm/ss` 一致（见 2.2） |
| `showTime` | `type="datetime"` + `timeEmbedded` + `format` | 综合映射 | `showTime` 不是布尔开关，要同时改 `type`、补时间占位符、aui3_1 主题加 `timeEmbedded`（见 2.3） |
| `showTime.defaultOpenValue` | — | ❌ 无法映射 | eview 无"选择时默认时分秒"，可设 `defaultValue` 近似 |
| `disabledDate` | `dateRange={{ dateFrom, dateTo }}` | 综合映射 | 函数式禁用 → 区间式限制；只能表达"连续区间可选"，无法表达离散禁用（见 2.4） |
| `minDate` | `dateRange.dateFrom` | 综合映射 | 并入 `dateRange`（见 2.4） |
| `maxDate` | `dateRange.dateTo` | 综合映射 | 并入 `dateRange`（见 2.4） |
| `disabledTime` | — | ❌ 无法映射 | eview 无时分秒级别禁用；如需限制时刻，自行在 `onChange` 校验 |
| `disabled` | `disabled` | 直接改名 | RangePicker 的 `[bool, bool]` 取两者合并为单布尔（见 2.5） |
| `allowClear` | — | ❌ 无法映射 | eview 无清除开关，靠 `value={undefined}` 重置 |
| `autoFocus` | `focusShowCalender` | 综合映射 | 近似：eview `focusShowCalender` 控制聚焦是否展开面板；语义不完全等价（见 2.6） |
| `className` | `className` | 直接改名 | |
| `style` | `style` | 直接改名 | |
| `placeholder` | `placeholder` | 直接改名 | RangePicker 的 `[string, string]` 只能取第一个或拼成单一占位 |
| `inputReadOnly` | `readOnly` | 直接改名 | |
| `size="large"/"middle"/"small"` | — | ❌ 无法映射 | eview DatePicker 无 size，改用 `style={{ width }}` 或 `selectStyle` 控宽 |
| `status="error"/"warning"` | — | ❌ 无法映射 | eview 无校验状态色，用 `hintType` + 外层校验提示近似 |
| `variant` | — | ❌ 无法映射 | eview 无形态变体（outlined/borderless/filled/underlined） |
| `placement` | `popupDirection` | 改值 | `bottomLeft/bottomRight→bottom`、`topLeft/topRight→top`（见 2.7） |
| `open` | `focusShowCalender` / `display` | 综合映射 | antd 受控展开；eview 无等价受控 `open`，用 `focusShowCalender` 近似或外层控制（见 2.6） |
| `defaultOpen` | `focusShowCalender` | 综合映射 | 同上，近似 |
| `onOpenChange(open)` | `onOpenChange()` | 直接改名 | eview 回调无入参，丢失 `open` 布尔（见 2.8） |
| `onPanelChange(value, mode)` | — | ❌ 无法映射 | eview 无面板切换回调 |
| `onOk()` | `onOkClick(obj, event, target?)` | 综合映射 | antd 单选 + showTime 的确定回调；eview `onOkClick` 主要用于 range 模式，且参为 `{fromDateObj,toDateObj,...}`，需 `setTimeout` 再 setState（见 2.9） |
| `onChange(date, dateString)` | `onChange(dateString, date?, target?, dstDate?)` | 综合映射 | 参顺序颠倒；不可无条件回写 `value`（见 2.10） |
| `locale` | — | ❌ 无法映射 | eview 国际化由主题/全局控制，单组件无 locale |
| `mode` | — | ❌ 无法映射 | eview 无面板模式受控 |
| `needConfirm` | — | ❌ 无法映射 | eview range 模式固定走 `onOkClick`/`onCancelClick`，无开关 |
| `order` | — | ❌ 无法映射 | eview 范围模式自动有序 |
| `preserveInvalidOnBlur` | — | ❌ 无法映射 | eview 行为固定 |
| `multiple` | — | ❌ 无法映射 | eview 无多选；范围用 `range`，多选需自行叠加 |
| `presets` | — | ❌ 无法映射 | eview 无预设快捷；自行在外层放按钮组 |
| `showNow` | `showNow` | 直接改名 | |
| `showWeek` | — | ❌ 无法映射 | eview `type="week"` 已自带周展示，无需开关 |
| `defaultPickerValue` | — | ❌ 无法映射 | eview 无"面板默认定位日期" |
| `pickerValue` | — | ❌ 无法映射 | eview 无受控面板日期 |
| `renderExtraFooter` | — | ❌ 无法映射 | eview 无额外页脚插槽 |
| `panelRender` | — | ❌ 无法映射 | eview 无面板整体渲染 |
| `cellRender` / `dateRender` | — | ❌ 无法映射 | eview 无自定义单元格 |
| `components` | — | ❌ 无法映射 | eview 无自定义面板组件 |
| `getPopupContainer` | — | ❌ 无法映射 | eview 弹层容器固定 |
| `popupClassName` / `popupStyle` | — | ❌ 无法映射 | 已废弃；eview 用 `selectClassName` / `selectStyle` 近似 |
| `prefix` | — | ❌ 无法映射 | eview 无前缀 |
| `suffixIcon` | — | ❌ 无法映射 | eview 后缀图标固定 |
| `nextIcon` / `prevIcon` / `superNextIcon` / `superPrevIcon` | — | ❌ 无法映射 | eview 翻页图标固定 |
| `id` (RangePicker `{start,end}`) | `id` (string) | 改值 | 仅能取一个；双输入框 id 无法等价表达 |
| `separator` | — | ❌ 无法映射 | eview 范围分隔符固定 |
| `allowEmpty` | — | ❌ 无法映射 | eview 起始/结束是否可空固定 |
| `onCalendarChange` | — | ❌ 无法映射 | 用 `onChange` 的 `target` 参近似 |
| `onFocus(event, {range})` | — | ❌ 无法映射 | eview 无 onFocus；范围起点/终点用 `onChange` 第三参 `target` 区分 |
| `onBlur(event, {range})` | `onBlur({event, value, text, format})` | 综合映射 | 参结构不同，且 eview 无 range 信息（见 2.11） |
| `disabled` (RangePicker `[bool,bool]`) | `disabled` (bool) | 改值 | 见 2.5 |
| — | `range` | eview 特有 | antd `RangePicker` → eview `range={[]}` |
| — | `onOkClick` / `onCancelClick` | eview 特有 | RangePicker 确定/取消 |
| — | `dateRange` | eview 特有 | 区间限制（合并自 disabledDate/minDate/maxDate） |
| — | `label` / `required` | eview 特有 | antd 用外层 Form.Item label/required |
| — | `hintType` | eview 特有 | 提示形式 `div/tip/none` |
| — | `timeFormat` / `amPm` | eview 特有 | datetime 时间格式 / 12 小时制 |
| — | `timeEmbedded` | eview 特有 | aui3_1 主题下 datetime 必加 |
| — | `popupDirection` | eview 特有 | 弹出方向 |
| — | `showTimezone` / `timezoneRule` | eview 特有 | 时区 / 夏令时 |
| — | `ifTriggerOnChangeWithCalender` | eview 特有 | 打开面板是否触发 onChange |
| — | `focusShowCalender` / `tipDisplay` / `display` / `zIndex` | eview 特有 | 展开/提示/显隐/层级 |
| — | `selectStyle` / `selectClassName` / `labelStyle` | eview 特有 | 局部样式透传 |
| — | `ref.getValue()` | eview 特有 | 推荐取值方式 |

## 2. 处理方式详解

### 2.1 `value` / `defaultValue`：dayjs → Date（改值）

antd 用 dayjs 受控；eview 用 **Date 对象（24 小时制）**，且不建议传字符串。注意 eview `defaultValue` 只在初始化生效，异步回填（如编辑页接口返回）必须用 `value`，且只回写有效 Date。

```jsx
// antd
<DatePicker value={dayjs('2024-01-01')} defaultValue={dayjs()} />

// eview
<DatePicker
  value={new Date(2024, 0, 1)}                 // dayjs → new Date()，24 小时制
  defaultValue={new Date()}                     // 仅初始化生效；异步回填改用 value
/>
```

### 2.2 `format`：占位符转换（改值）

dayjs 与 eview 占位符大小写不同，需逐字符替换；`MM/HH/mm/ss/wo/QQ` 一致，`YYYY→yyyy`、`DD→dd`。

```js
function toEviewFormat(fmt = 'YYYY-MM-DD') {
  return fmt
    .replace(/YYYY/g, 'yyyy')
    .replace(/DD/g, 'dd');
}
// picker=month: 'YYYY-MM' → 'yyyy-MM'
// picker=quarter: 'YYYY-\\QQ' → 'yyyy-QQ'
// picker=week: 'YYYY-wo' → 'yyyy-wo'
// showTime: 'YYYY-MM-DD HH:mm:ss' → 'yyyy-MM-dd HH:mm:ss'
```

### 2.3 `showTime` → `type="datetime"` + `timeEmbedded` + `format`（综合映射）

antd `showTime` 是布尔/对象开关；eview 没有"在 date 上叠加时间"的开关，而是**换一个 `type`**。aui3_1 主题下还需 `timeEmbedded`，并补全 `format` 的时间占位符。

```jsx
// antd
<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />

// eview
<DatePicker
  type="datetime"                               // showTime → type="datetime"
  format="yyyy-MM-dd HH:mm:ss"                  // 补时间占位符
  timeEmbedded                                  // aui3_1 主题必加
/>
```

### 2.4 `disabledDate` + `minDate` + `maxDate` → `dateRange`（综合映射）

antd 用函数 `disabledDate(current, info) => boolean` 表达任意禁用规则，外加 `minDate`/`maxDate`。eview 只有**区间式** `dateRange={{ dateFrom, dateTo }}`，表达"连续可选区间"。三者合并：`minDate → dateFrom`、`maxDate → dateTo`；函数式离散禁用（如禁周末）无法表达。

```jsx
// antd
<DatePicker
  minDate={dayjs('2024-01-01')}
  maxDate={dayjs('2030-12-31')}
  disabledDate={(current) => current.isAfter(dayjs('2030-12-31'))}
/>

// eview
<DatePicker
  dateRange={{ dateFrom: new Date(2024, 0, 1), dateTo: new Date(2030, 11, 31) }}
/>
// 注：禁周末等离散规则无法映射，需在外层 onChange 校验
```

### 2.5 RangePicker `disabled=[bool,bool]` → `disabled`（改值）

RangePicker 起始/结束分别禁用；eview 只有单布尔。取"任一为 true 即禁用"近似。

```js
function toEviewDisabled(disabled) {
  if (Array.isArray(disabled)) return disabled[0] || disabled[1]; // 任一禁用即禁用
  return !!disabled;
}
```

### 2.6 `open` / `defaultOpen` / `autoFocus` → `focusShowCalender`（综合映射）

eview 无受控 `open`。`focusShowCalender` 控制"聚焦时是否展开面板"，语义近似 `defaultOpen`/`autoFocus`，但无法程序化"打开/关闭"。

```jsx
// antd
<DatePicker defaultOpen autoFocus />

// eview（近似）
<DatePicker focusShowCalender />
// 受控打开/关闭需外层条件渲染或 ref 触发 focus()
```

### 2.7 `placement` → `popupDirection`（改值）

```js
function toPopupDirection(placement = 'bottomLeft') {
  if (placement.startsWith('top')) return 'top';
  if (placement.startsWith('bottom')) return 'bottom';
  if (placement.startsWith('left')) return 'left';
  if (placement.startsWith('right')) return 'right';
  return 'bottom';
}
// bottomLeft/bottomRight → bottom；topLeft/topRight → top
```

### 2.8 `onOpenChange(open)` → `onOpenChange()`（直接改名 + 签名调整）

```jsx
// antd：onOpenChange(open: boolean)
<DatePicker onOpenChange={(open) => setOpen(open)} />

// eview：onOpenChange() 无入参，无法区分开/关
<DatePicker onOpenChange={() => console.log('面板状态切换')} />
// 如需区分开/关，需自行维护状态
```

### 2.9 `onOk` / RangePicker 确定 → `onOkClick`（综合映射）

antd 单选 + showTime 的 `onOk()` 与 RangePicker 的确定都落到 eview `onOkClick`。eview `onOkClick` 入参为对象 `{ dateFormate, fromDateObj, fromSelectDate, toDateObj, toSelectDate }`（仅 range 有意义），且 demo `DatePickerUpdate.jsx` 明确：**`onOkClick` 内一定要 `setTimeout` 再 setState**。

```jsx
// antd RangePicker
<RangePicker showTime onChange={(dates, strs) => setPeriod(...)} />

// eview
<DatePicker
  type="datetime"
  format="yyyy-MM-dd HH:mm:ss"
  timeEmbedded
  range={[]}
  onOkClick={(obj) => {
    // obj.fromDateObj / obj.toDateObj 为起止 Date
    setTimeout(() => setPeriod({ from: obj.fromDateObj, to: obj.toDateObj }), 100);
  }}
  onCancelClick={() => {}}
/>
```

### 2.10 `onChange(date, dateString)` → `onChange(dateString, date?, target?, dstDate?)`（综合映射）

**参顺序颠倒**：antd 第一参是 dayjs、第二参是字符串；eview 第一参是字符串、第二参才是 Date。更关键：eview 官方反例警告——**不要把第一参字符串无条件回写 `value`**，只在第二参 `date` 为有效 Date 时回写 Date 对象（正例 `DatePickerEvent.jsx`：`if (obj)`）。

```jsx
// antd：onChange(date: dayjs, dateString: string) — 可直接回写
<DatePicker value={d} onChange={(date, str) => setD(date)} />

// eview：onChange(dateString, date?, target?, dstDate?) — 只回写有效 Date
<DatePicker
  value={d}
  onChange={(dateString, date, target, dstDate) => {
    if (date) setD(date);          // 有效 Date 才回写，且回写 Date 对象
    // target: 'left' | 'right'（range 模式区分起止）
    // ❌ 不要 setD(dateString)
  }}
/>
```

### 2.11 `onBlur` 签名调整（综合映射）

antd `onBlur(event, { range })`；eview `onBlur({ event, value, text, format })`，参结构不同，且无 range 信息。

```jsx
// antd
<RangePicker onBlur={(e, { range }) => ...} />

// eview
<DatePicker
  onBlur={(ev) => {
    // ev.event / ev.value(Date) / ev.text / ev.format
  }}
/>
```

## 3. 无法映射的属性与建议处理

### 3.1 `disabledDate`（离散禁用规则）

eview `dateRange` 只能表达连续区间。禁周末、禁特定日期等离散规则需在 `onChange`/提交时校验：

```jsx
const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;
<DatePicker
  dateRange={{ dateFrom: new Date(2024, 0, 1), dateTo: new Date(2030, 11, 31) }}
  onChange={(str, date) => {
    if (date && isWeekend(date)) alert('不允许选择周末');
  }}
/>
```

### 3.2 `disabledTime`（时分秒级禁用）

eview 无时刻级禁用，自行在 `onChange` 校验：

```jsx
<DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" timeEmbedded
  onChange={(str, date) => {
    if (date && date.getHours() < 9 || date.getHours() > 18) alert('仅工作时间');
  }}
/>
```

### 3.3 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `allowClear` | 用 `value={undefined}` 或外加"清空"按钮调 `setD(undefined)` |
| `size` | `style={{ width }}` 或 `selectStyle` 控宽 |
| `status="error"/"warning"` | 用 `hintType` + 外层校验文案；红框靠 `className` 自定义 |
| `variant` | 自定义 `selectClassName` / `style` 模拟 borderless/filled |
| `multiple` | 自行用多选下拉或多个 DatePicker 叠加 |
| `presets` | 外层放按钮组，onClick 调 `setD(...)` |
| `renderExtraFooter` / `panelRender` / `cellRender` / `components` | 无插槽，需深度定制只能 fork 组件 |
| `getPopupContainer` / `popupClassName` / `popupStyle` | `selectClassName` / `selectStyle` 近似，弹层部分无法定制 |
| `prefix` / `suffixIcon` / `nextIcon` / `prevIcon` / `superNextIcon` / `superPrevIcon` | 图标固定，无法替换 |
| `locale` | 由 eview 主题/全局控制，单组件无法改 |
| `mode` / `needConfirm` / `order` / `preserveInvalidOnBlur` | 行为固定，忽略 |
| `defaultPickerValue` / `pickerValue` / `onPanelChange` | 无面板定位/切换控制，忽略 |
| `separator` / `allowEmpty` / RangePicker `id {start,end}` / `onCalendarChange` / `onFocus` | 范围行为固定；起点/终点用 `onChange` 第三参 `target` 区分；id 取其一 |
| `showWeek` | `type="week"` 已自带，无需开关 |
| `showTime.defaultOpenValue` | 设 `defaultValue` 近似默认时刻 |
| `autoFocus`/`open` 受控 | `focusShowCalender` 近似；程序化开关需 ref 触发 focus |

## 4. 完整示例对照

```jsx
// antd：范围 + 时间 + 禁未来 + 预设
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const presets = [
  { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
  { label: '近7天', value: [dayjs().subtract(6, 'day').startOf('day'), dayjs()] },
];

<RangePicker
  showTime
  format="YYYY-MM-DD HH:mm:ss"
  disabledDate={(current) => current && current.isAfter(dayjs().endOf('day'))}
  presets={presets}
  size="large"
  placeholder={['开始时间', '结束时间']}
  onChange={(dates, dateStrings) => setPeriod({
    from: dates[0].toDate(),
    to: dates[1].toDate(),
  })}
/>

// eview 等价
<DatePicker
  type="datetime"                              // showTime → type="datetime"
  format="yyyy-MM-dd HH:mm:ss"                 // YYYY→yyyy、DD→dd
  timeEmbedded                                 // aui3_1 主题必加
  range={[]}                                   // RangePicker → range
  dateRange={{ dateFrom: new Date(2020, 0, 1), dateTo: new Date() }}  // disabledDate 未来不可选 → dateTo=今天
  placeholder="开始时间 - 结束时间"             // [string,string] → 单占位
  style={{ width: 360 }}                       // size="large" → width
  onOkClick={(obj) => {
    // 预设按钮自行在外层实现；这里取确认结果
    setTimeout(() => setPeriod({               // 官方要求 setTimeout 再 setState
      from: obj.fromDateObj,
      to: obj.toDateObj,
    }), 100);
  }}
  onCancelClick={() => {}}
/>
```

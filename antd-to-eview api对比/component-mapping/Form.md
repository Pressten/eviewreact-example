# Form → Form 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Form` ⇄ eview `Form`
- antd `Form.Item` ⇄ eview `Form.Item`
- antd `Form.List` ⇄ ❌（eview 无对应，见 3.3）
- antd `Form.ErrorList` ⇄ ❌（eview 无对应，见 3.3）
- antd `Form.Provider` ⇄ ❌（eview 无对应，见 3.3）
- antd `Form.useForm` ⇄ eview `useRef` + `ref`（综合映射，见 2.1）
- antd `Form.useFormInstance` ⇄ ❌（eview 无上下文注入，需自行透传 `ref`）
- antd `Form.useWatch` ⇄ ❌（eview 无订阅式 watch，改用 `onValuesChange`）
- antd `Form.Item.useStatus` ⇄ ❌（eview 无该项 hook，校验状态由 `rules` + `validateErrorType` 自动管理）

定位差异：两者都是「按 `Form.Item` 的 `name` 收集值、按 `rules` 统一校验」的表单容器。但 eview Form 是 **2.0 托管模式**：控件不传 `value`/`onChange`，值与校验全由 Form 接管，提交靠 `ref.submit()` → `onSuccess(values)` / `onFailed(errors, values?)`，而非 antd 的 `onFinish` + 原生 `submit`。eview Form **不支持 `inline` 布局、`Form.List` 数组化、`Form.Provider` 表单间联动、`useWatch` 字段订阅、`requiredMark` 必选样式开关、`size`/`variant` 全局控件样式、`validateMessages` 模板** 等能力；多列布局改用 `itemCol`，错误提示形式用 `validateErrorType`，标签提示用 `labelTip`，控件自带校验开关用 `validateAllChildComponent`。`Form.Item` 必须是 `Form` 的**直接子节点**，不能用 `div`/`Fragment` 包裹模拟 antd 的 `Row/Col`（栅格会失效）。

## 1. 属性映射表

### Form 级属性

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `colon` | `colon` | 直接改名 | Form 级统一配置 Form.Item 冒号，语义一致 |
| `disabled` | — | ❌ 无法映射 | eview 无表单级禁用，改逐个控件设 `disabled` 或自行遍历 `ref` 设置（见 3.1） |
| `component` | `component` | 直接改名 | 类型一致（`ComponentType \| false`）；eview 类型 `any`，默认 `form` |
| `fields` | `fields` | 直接改名 | 语义有差异：antd 用于 redux 类外部状态控制，eview 标注「外部状态管理，不推荐」，二者皆非推荐用法（见 3.2） |
| `form` | `ref` | 综合映射 | antd 传 `Form.useForm()` 实例；eview 用 `useRef` + `ref={formRef}`，实例方法名亦有差异（见 2.1） |
| `feedbackIcons` | — | ❌ 无法映射 | eview 无自定义校验图标，校验反馈固定由 `validateErrorType` 控制 |
| `initialValues` | `initialValues` | 改值 | 类型一致（`object`），但 eview **必须传对象**，传 `undefined` 会使 `onSuccess(values)` 收到空对象（已真机确认）；动态/异步回填改用 `setFieldsValue`（见 2.2） |
| `labelAlign` | `labelAlign` | 直接改名 | `'left' \| 'right'`，默认一致（`right`） |
| `labelWrap` | — | ❌ 无法映射 | eview 无标签换行开关，标签过长自行 `style` 处理 |
| `labelCol` | `labelCol` | 改值 | antd 是 Col 对象 `{span, offset, sm, ...}`；eview 是 `number \| { span, offset }`，多响应式断点丢失（见 2.3） |
| `layout` | `layout` | 改值 | antd `'horizontal' \| 'vertical' \| 'inline'`；eview 仅 `'horizontal' \| 'vertical'`，`inline` 需自行 `style={{display:'inline-flex'}}` 近似 |
| `name` | — | ❌ 无法映射 | eview Form 不以 `name` 作字段 id 前缀（滚动定位由 `ref` 完成），表单间联动亦无机制；忽略即可 |
| `preserve` | — | ❌ 无法映射 | eview 无字段删除时是否保留值的开关，默认行为由 Form 内部决定 |
| `requiredMark` | — | ❌ 无法映射 | eview 无必选样式开关，必填样式由 `rules:[{required:true}]` 自动驱动 |
| `scrollToFirstError` | — | ❌ 无法映射 | eview 无提交失败自动滚动；改在 `onFailed` 里手动滚动到目标控件（见 3.4） |
| `size` | — | ❌ 无法映射 | eview 无表单级控件尺寸，逐个控件设 `size` |
| `validateMessages` | — | ❌ 无法映射 | eview 错误文案固定，改在 `rules` 项里自定义 `message` 或在 `onFailed` 统一提示（见 3.5） |
| `validateTrigger` | `validateTrigger` | 直接改名 | 默认 `onChange`；注意 antd 支持 `string \| string[]`，eview 仅 `string` |
| `variant` | — | ❌ 无法映射 | eview 无表单级控件变体，逐个控件设样式 |
| `wrapperCol` | `wrapperCol` | 改值 | 同 `labelCol`，响应式断点丢失 |
| `onFieldsChange` | — | ❌ 无法映射 | eview 无字段级 change 事件，改用 `onValuesChange`（含值变化但不等价于字段状态变化） |
| `onFinish(values)` | `onSuccess(values)` | 综合映射 | 签名首参一致，但触发机制不同：antd 靠原生 submit / `form.submit()`，eview 靠 `ref.submit()`（见 2.4） |
| `onFinishFailed({values, errorFields, outOfDate})` | `onFailed(errors, values?)` | 改值 | 单对象拆为两参：`errors` 对应 `errorFields`，`values` 对应 `values`；`outOfDate` 丢失（见 2.5） |
| `onValuesChange(changedValues, allValues)` | `onValuesChange(changedFields, allNewValues, allPrevValues)` | 改值 | antd 2 参 → eview 3 参，多出 `allPrevValues`；`changedValues` 与 `changedFields` 语义近似（见 2.6） |
| `clearOnDestroy` | — | ❌ 无法映射 | eview 无卸载清空开关，需在 `useEffect` 清理里自行处理 |

### Form.Item 级属性

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `colon` | `colon` | 直接改名 | 语义一致 |
| `dependencies` | — | ❌ 无法映射 | eview 无依赖字段自动重校验；改在 `onValuesChange` 里手动触发 `setFieldsValue` + 重新 `rules` 计算（见 3.6） |
| `extra` | — | ❌ 无法映射 | eview 无额外提示区，改放 `Form.Item` 之间的说明节点，或用 `labelTip` |
| `getValueFromEvent` | `updateTriggerIndex` | 综合映射 | antd 用函数把 event 转成值；eview 用 `updateTrigger` 指定回调名 + `updateTriggerIndex` 指定值在第几个参数（见 2.7） |
| `getValueProps` | — | ❌ 无法映射 | eview 无自定义注入子节点属性，值属性改用 `valuePropName` |
| `hasFeedback` | — | ❌ 无法映射 | eview 无校验图标，反馈形式由 `validateErrorType` 统一控制 |
| `help` | — | ❌ 无法映射 | eview 错误文案由 `rules` 自动生成，无法手动设静态 `help`；改用 `labelTip` 或 `Form.Item` 间说明节点 |
| `hidden` | — | ❌ 无法映射 | eview 无「隐藏但收集校验」开关，改用条件渲染（值不再收集）或 `style={{display:'none'}}`（见 3.7） |
| `htmlFor` | — | ❌ 无法映射 | eview 标签关联由内部处理，无透传 `htmlFor` |
| `initialValue` | — | ❌ 无法映射 | eview Form.Item 无该项，统一用 Form 的 `initialValues` 或 `setFieldsValue` 回填（见 3.8） |
| `label` | `label` | 直接改名 | 类型一致（`ReactNode`，eview 标 `string`，ReactNode 一般可传） |
| `labelAlign` | `labelAlign` | 直接改名 | 语义一致 |
| `labelCol` | `labelCol` | 改值 | 同 Form 级，响应式断点丢失 |
| `messageVariables` | — | ❌ 无法映射 | eview 无验证信息模板变量，改在 `rules` 项里写死 `message` |
| `name` | `name` | 改值 | antd 是 `NamePath`（`string \| number \| (string\|number)[]`）；eview 仅 `string` 且**必填**，数组路径需拍平成 `'a.b'` 或拆为多个 Item（见 2.8） |
| `normalize` | — | ❌ 无法映射 | eview 无同步转换钩子，改在控件 `onChange` 或 `onValuesChange` 里手动转换 |
| `noStyle` | — | ❌ 无法映射 | eview 无纯字段控件开关，布局样式由 `col`/`layout` 控制 |
| `preserve` | — | ❌ 无法映射 | 同 Form 级 `preserve` |
| `required` | — | ❌ 无法映射 | eview 无单独必填样式属性，必填改用 `rules=[{required:true}]` |
| `rules` | `rules` | 改值 | antd `Rule[]`（`required`/`type`/`validator`/`message`/`pattern`/`min`/`max`/`len`/`enum`/`transform`/`whitespace`/`warningOnly`/`validateTrigger`/`defaultField`/`fields`）；eview `Array<{规则名:true, args?}>`，仅内置 `required`/`min`/`max`/`range`/`rangeAndInteger`/`digit`/`integer`/`url`/`email`/`alpha`/`postfix`/`ipv4`/`ipv6`/`creditCard`，无 `validator`/`pattern`/`enum`/`transform` 等（见 2.9） |
| `shouldUpdate` | — | ❌ 无法映射 | eview 无自定义更新逻辑，改用 `onValuesChange` 驱动条件渲染 |
| `tooltip` | `labelTip` | 综合映射 | antd 接 `ReactNode \| TooltipProps`；eview `labelTip` 仅 `string`，复杂 Tooltip 配置丢失（见 2.10） |
| `trigger` | `updateTrigger` | 改值 | antd `trigger` 默认 `onChange`；eview 名为 `updateTrigger`，默认同 `onChange`，语义一致改名 |
| `validateFirst` | — | ❌ 无法映射 | eview 无校验停止 / 并行策略，规则按内部顺序执行 |
| `validateDebounce` | — | ❌ 无法映射 | eview 无防抖设置，改在外层控件的 `onChange` 自行 debounce |
| `validateStatus` | — | ❌ 无法映射 | eview 校验状态由 `rules` 自动驱动，无法手动设 `success`/`warning`/`error`/`validating` |
| `validateTrigger` | `validateTrigger` | 直接改名 | 同 Form 级，eview 仅 `string` |
| `valuePropName` | `valuePropName` | 直接改名 | 语义一致（Switch/Checkbox 用 `checked`，Toggle 用 `toggled`） |
| `wrapperCol` | `wrapperCol` | 改值 | 同 Form 级 `labelCol` |
| `layout` | `layout` | 直接改名 | antd Form.Item `layout` 为 `'horizontal' \| 'vertical'`（5.18.0），与 eview 取值一致 |
| — | `itemCol` | eview 特有 | Form 级多列栅格（`24/12/8/6`），antd 无对应，靠 `Row/Col` 组合实现 |
| — | `col` | eview 特有 | Form.Item 级单项栅格覆盖 |
| — | `validateErrorType` | eview 特有 | 错误提示形式 `'div' \| 'tip' \| 'none'`，antd 无对应统一开关 |
| — | `validateAllChildComponent` | eview 特有 | 是否执行控件自带 `validator`，antd 无对应（校验始终托管在 rules） |
| — | `labelTip` | eview 特有 | 标签提示，近似 antd `tooltip` |
| — | `updateTrigger` / `updateTriggerIndex` | eview 特有 | 取值回调名 / 值在回调第几参，配合 `valuePropName` |
| — | `itemFillUp` / `padding` / `title` | eview 特有 | 垂直占满 / 内边距 / 标题，antd 需自行样式 |
| — | `getErrors()` (ref) | eview 特有 | 取当前错误，antd 需 `getFieldsError` |

### Form.List / Form.ErrorList / Form.Provider 属性

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `Form.List.children`（renderProps） | — | ❌ 无法映射 | eview 无数组化 renderProps，改用 `useState<number[]>` + `setFieldsValue` 自行管理（见 3.3） |
| `Form.List.initialValue` | — | ❌ 无法映射 | 同上，数组初值放 Form `initialValues` |
| `Form.List.name` | — | ❌ 无法映射 | 同上 |
| `Form.List.rules` | — | ❌ 无法映射 | eview 无 List 级校验，需在 `onSuccess`/`onFailed` 里手动校验数组 |
| `Form.ErrorList.errors` | — | ❌ 无法映射 | eview 无独立错误列表组件，错误由 `validateErrorType` 自动渲染 |
| `Form.Provider.onFormChange` | — | ❌ 无法映射 | eview 无表单间联动，多表单改用各自 `ref` + 自行状态管理 |
| `Form.Provider.onFormFinish` | — | ❌ 无法映射 | 同上 |

### FormInstance 实例方法（antd `form` vs eview `ref`）

| antd 方法 | eview 方法 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `getFieldError(name)` | `getErrors()` | 综合映射 | antd 按字段名取错；eview `getErrors()` 返回全部错误，需自行按 name 过滤（见 2.11） |
| `getFieldInstance(name)` | — | ❌ 无法映射 | eview 无按名取控件实例，需自行 `ref` 收集 |
| `getFieldsError(nameList?)` | `getErrors()` | 综合映射 | 同上，eview 返回全部，自行过滤 |
| `getFieldsValue(nameList? \| true \| config)` | `getFieldsValue()` | 改值 | antd 多重载（按名 / `true` 全量 / `{strict, filter}`）；eview 仅 `getFieldsValue()` 返回全部，按名取用 `getFieldValue(name)`（见 2.12） |
| `getFieldValue(name)` | `getFieldValue(name)` | 直接改名 | 语义一致 |
| `isFieldsTouched(nameList?, allTouched?)` | — | ❌ 无法映射 | eview 无「是否被操作过」状态查询 |
| `isFieldTouched(name)` | — | ❌ 无法映射 | 同上 |
| `isFieldValidating(name)` | — | ❌ 无法映射 | eview 无「是否正在校验」查询 |
| `resetFields(fields?)` | `resetFields()` | 改值 | antd 支持指定字段数组；eview 仅整体重置到 `initialValues`，无按名重载 |
| `scrollToField(name, options)` | — | ❌ 无法映射 | eview 无按名滚动，改在 `onFailed` 里用 DOM id 手动滚动 |
| `setFields(fields: FieldData[])` | — | ❌ 无法映射 | eview 无设字段状态（含 touched/validating），改用 `setFieldsValue` 仅设值 |
| `setFieldValue(name, value)` | `setFieldsValue({[name]: value})` | 综合映射 | eview 无单字段设值，用 `setFieldsValue` 传单键对象近似（见 2.13） |
| `setFieldsValue(values)` | `setFieldsValue(values)` | 直接改名 | 语义一致 |
| `submit()` | `submit()` | 直接改名 | 语义一致，均触发校验后回调 |
| `validateFields(nameList?, config?)` | — | ❌ 无法映射 | eview 无独立校验方法，校验靠 `submit()` 触发；仅校验不提交改用 `submit()` + `onFailed` 拦截 |

### Hooks

| antd Hook | eview 对应 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `Form.useForm()` | `useRef(null)` | 综合映射 | 返回 `[FormInstance]` → 返回 `ref`，实例方法名亦有差异（见 2.1） |
| `Form.useFormInstance()` | — | ❌ 无法映射 | eview 无上下文注入，需自行透传 `ref` 给子组件 |
| `Form.useWatch(namePath, form \| options)` | — | ❌ 无法映射 | eview 无订阅式字段监听，改用 `onValuesChange` 抛出 + 自行 `useState` 缓存 |
| `Form.Item.useStatus()` | — | ❌ 无法映射 | eview 无取当前 Item 校验状态的 hook |

## 2. 处理方式详解

### 2.1 `Form.useForm()` + `form` prop → `useRef` + `ref`（综合映射）

antd 通过 `Form.useForm()` 拿到 `FormInstance` 传入 `form` prop；eview 用 React 原生 `useRef`，`ref.current` 即表单实例。

```jsx
// antd
const [form] = Form.useForm();
<Form form={form} onFinish={save}>
  <Form.Item name="name"><Input /></Form.Item>
</Form>;
form.setFieldsValue({ name: 'x' });

// eview
const formRef = useRef(null);
<Form ref={formRef} onSuccess={save}>
  <Form.Item name="name"><TextField /></Form.Item>
</Form>;
formRef.current.setFieldsValue({ name: 'x' });
```

注意：实例方法名差异见下文各条；`Form.useFormInstance` 在 eview 无对应，封装子组件需把 `formRef` 显式透传。

### 2.2 `initialValues` 必须传对象

eview 真机已确认：传 `undefined` 时 `submit()` 仍触发 `onSuccess` 但 `values` 是空对象。动态 / 异步场景务必兜底。

```jsx
// ❌ eview：record 异步到达时传 undefined
<Form ref={formRef} initialValues={record} />

// ✅ 兜底为对象 + 异步用 setFieldsValue
<Form ref={formRef} initialValues={record || {}} />
useEffect(() => { if (record) formRef.current?.setFieldsValue(record); }, [record]);
```

### 2.3 `labelCol` / `wrapperCol` 响应式断点丢失

antd 接 Col 对象（`{span, offset, sm, md, lg, xl}`）；eview 接 `number \| { span, offset }`，无响应式断点。

```jsx
// antd
<Form labelCol={{ span: 3, offset: 12, sm: { span: 6 } }} wrapperCol={{ span: 12 }} />

// eview：仅保留 span/offset，响应式断点需自行 CSS media query
<Form labelCol={6} wrapperCol={18} />
```

### 2.4 `onFinish(values)` → `onSuccess(values)`（综合映射）

签名首参一致（`values`），但触发机制不同：antd 可走原生 `submit` 按钮（`htmlType="submit"`）或 `form.submit()`；eview 必须用 `ref.submit()`，Button 无 `type="submit"`。

```jsx
// antd
<Form form={form} onFinish={(values) => save(values)}>
  <Button htmlType="submit">提交</Button>
</Form>;

// eview：提交按钮 onClick 调 ref.submit()
<Form ref={formRef} onSuccess={(values) => save(values)}>
  <Form.Item colon={false}>
    <Button status="primary" text="提交" onClick={() => formRef.current.submit()} />
  </Form.Item>
</Form>;
```

### 2.5 `onFinishFailed` → `onFailed`（改值）

antd 单对象 `{ values, errorFields, outOfDate }` → eview 两参 `(errors, values?)`。

```jsx
// antd
<Form onFinishFailed={({ values, errorFields, outOfDate }) => {
  console.log(errorFields); // [{ name: ['password'], errors: ['...'] }]
}} />

// eview：errors 对应 errorFields，values 为第二参（待实测是否始终提供）
<Form onFailed={(errors, values) => {
  console.log(errors); // 错误集合，结构以 eview 实测为准
  setMessage('请修正标红字段');
}} />
```

### 2.6 `onValuesChange` 签名调整

antd `(changedValues, allValues)` → eview `(changedFields, allNewValues, allPrevValues)`，多出前一快照。

```jsx
// antd
<Form onValuesChange={(changed, all) => {
  if ('enabled' in changed) setEnabled(changed.enabled);
}} />

// eview
<Form onValuesChange={(changed, allNew, allPrev) => {
  if ('enabled' in changed) setEnabled(!!changed.enabled);
}} />
```

### 2.7 `getValueFromEvent` → `updateTrigger` + `updateTriggerIndex`（综合映射）

antd 用函数把 event 转成值；eview 用回调名 + 值在回调第几个参数定位，常见于 Checkbox/Toggle。

```jsx
// antd：Checkbox onChange 第二参才是 checked
<Form.Item name="agree" getValueFromEvent={e => e.target.checked}>
  <Checkbox />
</Form.Item>

// eview：值属性 checked + 值在 onChange 第 1 个参数（0-based）
<Form.Item name="agree" valuePropName="checked" updateTriggerIndex={1}>
  <Checkbox label="我已阅读并同意协议" />
</Form.Item>

// Toggle：值在 toggled，回调叫 onToggle
<Form.Item name="enabled" valuePropName="toggled" updateTrigger="onToggle">
  <Toggle data={[false, true]} />
</Form.Item>
```

### 2.8 `name` 数组路径需拍平

antd `NamePath` 支持 `string | number | (string|number)[]`；eview `name` 仅 `string` 且必填。

```jsx
// antd：嵌套路径
<Form.Item name={['user', 'name']}><Input /></Form.Item>

// eview：拍平为 'user.name' 或拆为独立 Item
<Form.Item name="userName"><TextField /></Form.Item>
// 若需嵌套结构，setFieldsValue({ user: { name: '' } }) 时自行组织对象
```

### 2.9 `rules` 规则对象差异（改值）

antd `Rule` 用 `required`/`type`/`validator`/`message`/`pattern`/`min`/`max`/`len`/`enum`/`transform`/`whitespace`/`warningOnly`/`validateTrigger`；eview 用 `{规则名: true, args?}`，仅内置 `required`/`min`/`max`/`range`/`rangeAndInteger`/`digit`/`integer`/`url`/`email`/`alpha`/`postfix`/`ipv4`/`ipv6`/`creditCard`，无 `validator`/`pattern`/`enum`/`transform`/`whitespace`/`warningOnly`。

```jsx
// antd
<Form.Item name="email" rules={[
  { required: true, message: '必填' },
  { type: 'email', message: '邮箱格式错误' },
  { validator: async (_, v) => { if (!v?.includes('@')) throw new Error(); } },
]}>
  <Input />
</Form.Item>

// eview：规则名置 true，参数用 args；validator/pattern 需改在控件自带 validator
//（并 Form 上设 validateAllChildComponent={true}）
<Form.Item name="email" rules={[
  { required: true },
  { email: true },
]}>
  <TextField validator={(v) => v?.includes('@') ? '' : '邮箱格式错误'} />
</Form.Item>
<Form validateAllChildComponent={true} />
```

范围校验：

```jsx
// antd
rules={[{ type: 'number', min: 1, max: 65535 }]}

// eview
rules={[{ range: true, args: [1, 65535] }]}
```

### 2.10 `tooltip` → `labelTip`（综合映射）

antd 接 `ReactNode \| TooltipProps`；eview `labelTip` 仅 `string`。

```jsx
// antd
<Form.Item label="名称" tooltip={{ title: '不超过 32 字符', icon: <InfoIcon /> }}>
  <Input />
</Form.Item>

// eview：仅文本，图标 / 配置丢失
<Form.Item label="名称" labelTip="不超过 32 字符">
  <TextField maxLength={32} />
</Form.Item>
```

### 2.11 `getFieldError` / `getFieldsError` → `getErrors()`（综合映射）

antd 按字段名取错；eview `getErrors()` 返回全部，需自行按 name 过滤。

```jsx
// antd
const errs = form.getFieldError('email'); // ['邮箱格式错误']

// eview
const allErrs = formRef.current.getErrors(); // 全部错误
const emailErr = allErrs.find(e => e.name === 'email')?.errors?.[0];
```

### 2.12 `getFieldsValue` 重载拆分

antd 多重载（`nameList?` / `true` / `{strict, filter}`）；eview 仅 `getFieldsValue()` 返回全部，按名取用 `getFieldValue(name)`。

```jsx
// antd
form.getFieldsValue();                  // 全部注册字段
form.getFieldsValue(true);              // 含未注册
form.getFieldsValue(['email']);          // 按名
form.getFieldsValue({ strict: true });   // 仅匹配 Item

// eview
formRef.current.getFieldsValue();        // 全部
formRef.current.getFieldValue('email');  // 按名；strict/filter 无对应
```

### 2.13 `setFieldValue(name, value)` → `setFieldsValue({[name]: value})`（综合映射）

eview 无单字段设值方法，用 `setFieldsValue` 传单键对象近似。

```jsx
// antd
form.setFieldValue('name', 'x');

// eview
formRef.current.setFieldsValue({ name: 'x' });
```

## 3. 无法映射的属性与建议处理

### 3.1 Form `disabled`（表单级禁用）

eview 无表单级禁用，逐个控件设 `disabled`，或自行维护 `disabled` 状态遍历设置。

```jsx
// antd
<Form disabled>...</Form>

// eview：用状态 + 逐控件 disabled
const [formDisabled, setFormDisabled] = useState(false);
<Form ref={formRef}>
  <Form.Item label="名称" name="name"><TextField disabled={formDisabled} /></Form.Item>
  <Form.Item label="区域" name="region"><Select disabled={formDisabled} /></Form.Item>
</Form>
```

### 3.2 `fields`（外部状态控制）

eview 虽有 `fields` 但官方标注「不推荐」，语义与 antd 的 redux 类外部状态控制不完全等价。强需求时建议改用 `setFieldsValue` 同步外部 store 到 Form，而非双向受控。

```jsx
// antd：redux 受控
<Form fields={fieldsFromStore} onFieldsChange={(_, all) => dispatch(setAll(all))} />

// eview：单向同步，外部 store 变化时调 setFieldsValue
useEffect(() => { formRef.current?.setFieldsValue(storeValues); }, [storeValues]);
```

### 3.3 `Form.List` / `Form.ErrorList` / `Form.Provider`

eview 无数组化 renderProps、无独立错误列表、无表单间联动。动态数组改用 `useState<number[]>` + `setFieldsValue` 管理；多表单联动用各自 `ref` + 自行状态。

```jsx
// antd：Form.List
<Form.List name="users">
  {(fields, { add, remove }) => fields.map(f => (
    <Form.Item key={f.key} {...f}><Input /></Form.Item>
  ))}
</Form.List>

// eview：自行数组管理
const [userIds, setUserIds] = useState([0]);
const add = () => setUserIds(prev => [...prev, prev.length]);
const remove = (i) => setUserIds(prev => prev.filter(x => x !== i));
<Form ref={formRef}>
  {userIds.map(id => (
    <Form.Item key={id} label={`用户${id+1}`} name={`user_${id}`}>
      <TextField />
    </Form.Item>
  ))}
</Form>;
// 提交时按 userIds 收集成数组
```

### 3.4 `scrollToFirstError`

eview 无提交失败自动滚动，改在 `onFailed` 里手动滚动到目标控件 DOM。

```jsx
// antd
<Form scrollToFirstError>...</Form>

// eview
<Form
  ref={formRef}
  onFailed={(errors) => {
    const firstName = errors?.[0]?.name;
    if (firstName) {
      document.getElementById(`field-${firstName}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  }}
>
  <Form.Item name="email">
    <TextField inputId="field-email" />  {/* 需控件支持透传 id */}
  </Form.Item>
</Form>
```

### 3.5 `validateMessages`（错误模板）

eview 错误文案固定，改在 `rules` 项里自定义 `message` 或在 `onFailed` 统一提示。

```jsx
// antd
<Form validateMessages={{ required: "'${name}' 是必选字段" }} />

// eview：无模板，改在 onFailed 统一提示
<Form onFailed={() => setMessage('请完善必填项')} />
```

### 3.6 `dependencies`（依赖字段重校验）

eview 无依赖自动重校验，改在 `onValuesChange` 里手动触发联动字段的 `setFieldsValue` + 重新计算 `rules`。

```jsx
// antd：密码变化时确认密码自动重校验
<Form.Item name="confirm" dependencies={['password']} rules={[...]}>
  <Input />
</Form.Item>

// eview：onValuesChange 监听 password，清空 confirm 并提示重输
const [confirmRules, setConfirmRules] = useState([{ required: true }]);
<Form
  onValuesChange={(changed) => {
    if ('password' in changed) {
      formRef.current?.setFieldsValue({ confirm: '' });
      setConfirmRules(prev => [...prev]); // 触发重渲染
    }
  }}
>
  <Form.Item name="confirm" rules={confirmRules}><TextField /></Form.Item>
</Form>
```

### 3.7 `hidden`（隐藏但收集）

eview 无「隐藏仍收集校验」开关。若需隐藏但收集，用 `style={{display:'none'}}`（控件仍挂载）；若可丢弃值，直接条件渲染。

```jsx
// antd
<Form.Item name="secret" hidden><Input /></Form.Item>

// eview：隐藏但保留
<Form.Item name="secret" style={{ display: 'none' }}><TextField /></Form.Item>
// 或直接条件渲染（值不再收集）
{needSecret && <Form.Item name="secret"><TextField /></Form.Item>}
```

### 3.8 `Form.Item.initialValue`

eview Form.Item 无 `initialValue`，统一用 Form `initialValues` 或 `setFieldsValue` 回填。

```jsx
// antd
<Form.Item name="name" initialValue="x"><Input /></Form.Item>

// eview
<Form initialValues={{ name: 'x' }}>
  <Form.Item name="name"><TextField /></Form.Item>
</Form>
// 动态场景
formRef.current?.setFieldsValue({ name: 'x' });
```

### 3.9 其余无法映射属性一览

| antd 属性 | 建议 |
| --- | --- |
| `feedbackIcons` / `hasFeedback` | 反馈形式由 `validateErrorType` 控制，自定义图标丢失 |
| `help` | 用 `labelTip` 或 `Form.Item` 间说明节点替代 |
| `getValueProps` | 改用 `valuePropName` |
| `htmlFor` | 标签关联由 eview 内部处理，忽略 |
| `labelWrap` | 标签过长自行 `style` 处理 |
| `name`（Form 级） | 忽略，滚动用 `ref`，联动用状态管理 |
| `preserve`（Form / Item） | 忽略 |
| `requiredMark` | 必填样式由 `rules:[{required:true}]` 自动驱动 |
| `size` / `variant` | 逐个控件设 `size` / 样式 |
| `noStyle` | 用 `col` / `layout` 控制布局 |
| `required`（Item） | 改用 `rules=[{required:true}]` |
| `shouldUpdate` | 改用 `onValuesChange` 驱动条件渲染 |
| `messageVariables` | 在 `rules` 项写死 `message` |
| `normalize` | 在 `onValuesChange` / 控件 `onChange` 手动转换 |
| `validateFirst` / `validateDebounce` | 无对应，规则按内部顺序执行，debounce 自行外层实现 |
| `validateStatus`（Item） | 由 `rules` 自动驱动，无法手动设 |
| `onFieldsChange` | 改用 `onValuesChange` |
| `clearOnDestroy` | `useEffect` 清理里自行处理 |
| `Form.useFormInstance` | 自行透传 `ref` 给子组件 |
| `Form.useWatch` | `onValuesChange` + 自行 `useState` 缓存 |
| `Form.Item.useStatus` | 无对应 hook |
| 实例 `getFieldInstance` / `isFieldsTouched` / `isFieldTouched` / `isFieldValidating` | 无对应查询，自行维护状态 |
| 实例 `scrollToField` | `onFailed` 里用 DOM id 手动滚动 |
| 实例 `setFields` | 改用 `setFieldsValue` 仅设值 |
| 实例 `validateFields` | 用 `submit()` 触发校验，`onFailed` 拦截 |

## 4. 完整示例对照

```jsx
// antd
import { Form, Input, Button } from 'antd';

const Demo = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('提交成功', values);
  };
  const onFinishFailed = ({ errorFields }) => {
    console.log('校验失败', errorFields);
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ name: '', email: '' }}
      validateTrigger="onChange"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="名称"
        name="name"
        rules={[{ required: true, message: '请输入名称' }, { max: 32, message: '不超过 32 字' }]}
      >
        <Input placeholder="请输入" maxLength={32} />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式错误' }]}
      >
        <Input placeholder="name@example.com" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};
```

```jsx
// eview 等价
import React, { useRef, useState } from 'react';
import Form from '@nce/eview-react/Form';
import TextField from '@nce/eview-react/TextField';
import Button from '@nce/eview-react/Button';

const Demo = () => {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const onSuccess = (values) => {
    console.log('提交成功', values);  // { name, email }
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 400); // 模拟请求
  };
  const onFailed = (errors) => {
    console.log('校验失败', errors);
  };

  return (
    <Form
      ref={formRef}                                  // useForm + form → useRef + ref
      layout="horizontal"
      labelCol={6}                                    // labelCol 对象 → number
      wrapperCol={18}                                 // wrapperCol 对象 → number
      initialValues={{ name: '', email: '' }}        // 必须传对象
      validateTrigger="onChange"
      onSuccess={onSuccess}                           // onFinish → onSuccess
      onFailed={onFailed}                             // onFinishFailed → onFailed
      validateErrorType="tip"                         // eview 错误提示形式
    >
      <Form.Item
        label="名称"
        name="name"
        rules={[{ required: true }, { max: true, args: [32] }]}  {/* antd {max:32} → eview {max:true,args:[32]} */}
      >
        <TextField placeholder="请输入" maxLength={32} />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name="email"
        rules={[{ required: true }, { email: true }]}  {/* antd {type:'email'} → eview {email:true} */}
      >
        <TextField placeholder="name@example.com" />
      </Form.Item>
      <Form.Item colon={false}>
        <Button
          status="primary"
          text={submitting ? '提交中...' : '提交'}      // loading → disabled + 文案
          disabled={submitting}
          onClick={() => formRef.current.submit()}      // htmlType=submit → onClick ref.submit()
        />
      </Form.Item>
    </Form>
  );
};
```

# antd → eview-react 无法映射属性汇总

> antd 5.29.3 → eview-react
> 本文件汇总所有「antd 有、eview-react 无对应」的属性，按组件分组。每条列出 antd 属性、说明、建议处理方式。仅收录无法直接/改值/综合映射的属性。

## 统计

- 有无法映射属性的组件数：35 / 35
- 无法映射属性合计：535 条
- 无对应组件（整体不生成映射）的 antd 组件：Affix、Anchor、App、Avatar、Calendar、Carousel、ColorPicker、ConfigProvider、Descriptions、Dropdown、FloatButton、Image、List、Mentions、Menu、Message、Notification、Progress、QRCode、Result、Statistic、TimePicker、Timeline、Tour、Transfer、Splitter（共 26 个，整体无 eview 对应，不在本汇总的逐组件明细中）

## 明细（按组件）

### Alert → DivMessage

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| action | 自定义操作项 | 在 `children` 里自行渲染按钮 |
| afterClose | 关闭动画后回调 | 自动消失不触发 onClose，靠换 `key` 重挂 + state 同步实现 |
| banner | 顶部公告模式 | 近似用 `type="warn"` + `showIcon` + `enableDisposeTimeOut={false}` |
| classNames | 语义化结构 class | 改用 `className` / `style` |
| styles | 语义化结构 style | 改用 `style` |

### AutoComplete → InputSelect

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| onSearch | 搜索回调 | 用 `onInputKeyUp` 近似监听输入 |
| onBlur | 失焦回调 | 无对应，可用 `ref.focus()` 命令式聚焦 |
| onFocus | 聚焦回调 | 无 onFocus 回调，可用 `ref.focus()` 命令式聚焦 |
| onInputKeyDown | 按键回调 | 用 `onInputEnter` / `onInputKeyUp` 近似（时机不同） |
| popupMatchSelectWidth | 同宽配置 | 用 `enableFixWidth` 近似 |
| open | 受控展开 | 无受控展开属性，仅事件回调 |
| defaultOpen | 默认展开 | 同上 |
| status | 校验状态 | 用 `required` + `validator` + `hintType` 表达 |
| size | 尺寸 | 外层 `style` 控宽 |
| variant | 形态变体 | 无形态变体，忽略 |
| popupRender / dropdownRender | 自定义下拉内容 | 无自定义下拉内容 |
| popupClassName / dropdownClassName | 浮层 class | 改用 `selectStyle` / `optionStyle` 透传 |
| dropdownStyle | 浮层样式 | 改用 `selectStyle` |
| getPopupContainer | 浮层容器 | 用 `popupDirection` 控制方向 |
| classNames / styles | 语义化结构 class/style | 改用 `selectStyle` / `selectClassName` / `optionStyle` |
| backfill | 键盘回填 | 无键盘回填，忽略 |
| autoFocus | 自动聚焦 | 用 `useEffect(() => ref.current.focus(), [])` |
| defaultActiveFirstOption | 默认高亮首项 | 无配置，忽略 |
| children | 自定义输入框 | 固定渲染，无自定义输入框 |

### Badge → Badge

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| size | 圆点大小 | 忽略，无大小配置 |
| title | hover title | 外层包 Tooltip 或忽略 |
| classNames | 语义化结构 class | 用 `badgeClassName` |
| styles | 语义化结构 style | 用 `badgeStyle` |
| Badge.Ribbon | 缎带组件 | 自行实现（绝对定位 + 旋转样式） |

### Breadcrumb → Crumbs

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| itemRender | 自定义渲染函数 | 用 `onClick` + 路由 `navigate` 替代 |
| params | 路由参数 | 忽略，在 `onClick` 里自行处理 |
| items[].menu | 下拉菜单配置 | 无下拉菜单，改用 `countLimit` 折叠或忽略 |
| items[].dropdownProps | 下拉菜单属性 | 无下拉菜单 |
| SeparatorType (type: 'separator') | 独立分隔项 | 用 `seprator` 统一分隔符 |
| classNames | 语义化结构 class | 改用 `className` / `itemStyle` |
| styles | 语义化结构 style | 改用 `style` / `itemStyle` |

### Button → Button

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| type="dashed" | 虚线按钮 | 自定义描边样式 |
| type="link" | 链接按钮 | `status="text"` + onClick 跳转或外层包 `<a>` |
| loading | 处理中状态 | `disabled` + 文案切换「提交中…」 |
| block | 宽度撑满父 | `style={{ width: '100%' }}` |
| ghost | 幽灵属性 | 自定义透明背景 + 边框样式 |
| shape | 形状（circle/round） | 改用 `IconButton` |
| href | 链接化 | 外层 `<a>` 包裹或 `status="text"` + onClick 跳转 |
| target | 链接目标 | 依赖 href，同上 |
| htmlType | 原生 type | 表单提交用 onClick 调 `formRef.submit()` |
| classNames | 语义化结构 class | 改用 `className` / `style` |
| styles | 语义化结构 style | 改用 `style` |
| autoInsertSpace | 汉字空格开关 | 无对应，忽略 |

### Cascader → Cascader

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| allowClear | 清除按钮 | 外部加按钮置空 `selectedValue` |
| autoClearSearchValue | 搜索框自动清空 | 无搜索框，忽略 |
| autoFocus | 自动聚焦 | 无 autoFocus |
| classNames | 语义化结构 class | 改用 `selectClassName` / `itemClassName` |
| defaultOpen | 默认展开 | 无受控展开 |
| displayRender | 自定义展示渲染 | 用 value 在 options 中递归查 label 自行渲染 |
| tagRender | 自定义 tag 渲染 | 无自定义 tag 渲染 |
| popupRender / dropdownRender | 自定义浮层内容 | 无自定义浮层内容 |
| dropdownStyle | 浮层样式 | 改用 `selectStyle` |
| expandIcon | 自定义展开图标 | 无自定义展开图标 |
| expandTrigger | 展开触发方式 | 固定 click 展开，忽略 |
| fieldNames | 自定义字段名 | 字段固定 `label`/`value`/`children`，传入前转换数据 |
| getPopupContainer | 浮层容器 | 无容器配置 |
| loadData | 动态加载 | 一次性加载完整 options |
| maxTagPlaceholder | 隐藏 tag 占位 | 无隐藏 tag 占位 |
| maxTagTextLength | tag 文本长度限制 | 无限制 |
| notFoundContent | 空内容配置 | 无空内容配置 |
| open | 受控展开 | 无受控展开 |
| placement | 浮层位置 | 无浮层位置配置 |
| prefix | 前缀 | 无前缀 |
| showSearch | 搜索 | 改用 TreeSelect 或前端过滤 options |
| searchValue | 受控搜索值 | 无搜索框 |
| onSearch | 搜索回调 | 无搜索框 |
| size | 尺寸 | 外层 `selectStyle` 控宽 |
| status | 校验状态 | 无 error/warning 状态 |
| styles | 语义化结构 style | 改用 `selectStyle` |
| suffixIcon | 自定义后缀图标 | 无自定义后缀图标 |
| variant | 形态变体 | 无形态变体 |
| showCheckedStrategy | 勾选回显策略 | demo 有但不在 props 表，待实测，勿依赖 |
| removeIcon | 自定义清除图标 | 无自定义清除图标 |
| popupMenuColumnStyle / dropdownMenuColumnStyle | 列样式 | 无列样式 |
| optionRender | 自定义选项渲染 | 无自定义选项渲染 |
| onOpenChange / onDropdownVisibleChange | 展开回调 | 无展开回调 |
| blur() / focus() | ref 方法 | 无 ref 方法 |

### Checkbox → Checkbox

> 含 Checkbox（单个）与 Checkbox.Group → CheckboxGroup

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| (单) autoFocus | 自动聚焦 | 用 `boxTabIndex` 或 mount 时原生 focus 近似 |
| (单) defaultChecked | 非受控初始值 | 改为受控 `checked` + `onChange` |
| (单) blur() / focus() | ref 方法 | 无 ref 方法，用 `boxTabIndex` 近似可聚焦 |
| (单) nativeElement | DOM 节点获取 | 无 DOM 节点获取 |
| (单) classNames | 语义化结构 class | 改用 `className` |
| (单) styles | 语义化结构 style | 改用 `style` |
| (Group) name | 表单 name | 单个 Checkbox 有 `name`，Group 无 |
| (Group) title | group 级 title | 忽略 |

### DatePicker → DatePicker

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| showTime.defaultOpenValue | 选择时默认时分秒 | 设 `defaultValue` 近似 |
| disabledTime | 时分秒级禁用 | 自行在 `onChange` 校验 |
| allowClear | 清除开关 | 用 `value={undefined}` 重置 |
| size | 尺寸 | `style={{ width }}` 或 `selectStyle` 控宽 |
| status | 校验状态色 | 用 `hintType` + 外层校验提示近似 |
| variant | 形态变体 | 自定义 `selectClassName` / `style` 模拟 |
| onPanelChange | 面板切换回调 | 无面板切换回调 |
| locale | 国际化 | 由 eview 主题/全局控制，单组件无法改 |
| mode | 面板模式受控 | 无面板模式受控 |
| needConfirm | 确认开关 | range 模式固定走 `onOkClick`/`onCancelClick` |
| order | 范围自动有序 | 自动有序，忽略 |
| preserveInvalidOnBlur | 失焦保留无效值 | 行为固定，忽略 |
| multiple | 多选 | 无多选，范围用 `range`，多选自行叠加 |
| presets | 预设快捷 | 外层放按钮组，onClick 调 `setD(...)` |
| showWeek | 周展示开关 | `type="week"` 已自带，无需开关 |
| defaultPickerValue | 面板默认定位日期 | 无面板默认定位 |
| pickerValue | 受控面板日期 | 无受控面板日期 |
| renderExtraFooter | 额外页脚插槽 | 无插槽，需深度定制只能 fork |
| panelRender | 面板整体渲染 | 无面板渲染 |
| cellRender / dateRender | 自定义单元格 | 无自定义单元格 |
| components | 自定义面板组件 | 无自定义面板组件 |
| getPopupContainer | 弹层容器 | 弹层容器固定 |
| popupClassName / popupStyle | 弹层 class/style | 已废弃，用 `selectClassName` / `selectStyle` 近似 |
| prefix | 前缀 | 无前缀 |
| suffixIcon | 后缀图标 | 后缀图标固定 |
| nextIcon / prevIcon / superNextIcon / superPrevIcon | 翻页图标 | 翻页图标固定 |
| separator | 范围分隔符 | 分隔符固定 |
| allowEmpty | 起止可空 | 起止可空固定 |
| onCalendarChange | 范围选择回调 | 用 `onChange` 的 `target` 参近似 |
| onFocus(event, {range}) | 聚焦回调 | 无 onFocus，范围起止用 `onChange` 第三参 `target` 区分 |

### Divider → Divider

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| orientationMargin | 标题与边框距离 | 改用 `style` 调整（如 `paddingInline`） |
| plain | 普通正文样式 | 改用 `style` 覆盖标题字号/颜色 |
| size | 间距尺寸 | 改用 `style` 的 margin 控制 |

### Drawer → Drawer

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| closeIcon | 自定义关闭图标 | 固定内置关闭按钮，隐藏用 `showClose={false}` |
| afterOpenChange | 打开/关闭动画结束回调 | 用 `animationDuration` 控时长，业务需后置逻辑用 `setTimeout` 近似 |
| autoFocus | 焦点切换开关 | 无焦点开关，打开后手动 `ref.current?.focus()` |
| classNames | 语义化结构 class | 改用 `className` / `contentClassName` |
| styles | 语义化结构 style | 改用 `style` / `contentClassName` |
| extra | 右上角操作区 | 自行在 `title` 或 children 内布局 |
| footer | 内置页脚 | 自写绝对定位 `<div>` 放 `Button` |
| forceRender | 预渲染 | 改用 `destroyOnClose={false}` 保持内容常驻 |
| keyboard | esc 关闭开关 | 自行 `useEffect` 监听 keydown 调 `setVisible(false)` |
| push | 多层抽屉推动 | 嵌套各自独立 `visible`，自行布局/位移表达 |
| size | default/large 预设宽度 | 直接传 `width`/`height` 数值 |
| loading | 骨架屏 | 外层包 `Skeleton` 或自管 loading 态 |
| zIndex | 层级 | 靠全局 CSS 层叠或 `style={{ zIndex: n }}` |
| drawerRender | 自定义渲染整抽屉 | 用 `children` + `contentClassName` 近似 |

### Empty → Empty

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| image（自定义 ReactNode 插画） | 自定义插画 | 改用 `imgSrc` 传 URL 或 `icon` 传图标近似 |
| imageStyle | 图片样式 | 通过自定义 `imgSrc` 资源或外层 `style` 调整 |

### Form → Form

> 含 Form 级、Form.Item 级、Form.List/ErrorList/Provider、FormInstance 方法、Hooks

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| (Form) disabled | 表单级禁用 | 逐个控件设 `disabled` 或自行遍历 `ref` 设置 |
| (Form) feedbackIcons | 自定义校验图标 | 反馈形式由 `validateErrorType` 控制 |
| (Form) labelWrap | 标签换行开关 | 标签过长自行 `style` 处理 |
| (Form) name | 字段 id 前缀 | 忽略，滚动用 `ref`，联动用状态管理 |
| (Form) preserve | 字段删除时保留值 | 默认行为由 Form 内部决定，忽略 |
| (Form) requiredMark | 必选样式开关 | 必填样式由 `rules:[{required:true}]` 自动驱动 |
| (Form) scrollToFirstError | 提交失败自动滚动 | 在 `onFailed` 里手动滚动到目标控件 |
| (Form) size | 表单级控件尺寸 | 逐个控件设 `size` |
| (Form) validateMessages | 错误模板 | 在 `rules` 项自定义 `message` 或 `onFailed` 统一提示 |
| (Form) variant | 表单级控件变体 | 逐个控件设样式 |
| (Form) onFieldsChange | 字段级 change 事件 | 改用 `onValuesChange` |
| (Form) clearOnDestroy | 卸载清空 | 在 `useEffect` 清理里自行处理 |
| (Item) dependencies | 依赖字段重校验 | 在 `onValuesChange` 手动触发联动字段重校验 |
| (Item) extra | 额外提示区 | 放 `Form.Item` 间说明节点或用 `labelTip` |
| (Item) getValueProps | 自定义注入子节点属性 | 改用 `valuePropName` |
| (Item) hasFeedback | 校验图标 | 反馈形式由 `validateErrorType` 统一控制 |
| (Item) help | 静态错误文案 | 改用 `labelTip` 或 `Form.Item` 间说明节点 |
| (Item) hidden | 隐藏但收集校验 | 用 `style={{display:'none'}}` 或条件渲染 |
| (Item) htmlFor | 标签关联 | 标签关联由 eview 内部处理，忽略 |
| (Item) initialValue | Item 初始值 | 统一用 Form `initialValues` 或 `setFieldsValue` |
| (Item) messageVariables | 验证信息模板变量 | 在 `rules` 项写死 `message` |
| (Item) normalize | 同步转换钩子 | 在控件 `onChange` 或 `onValuesChange` 手动转换 |
| (Item) noStyle | 纯字段控件开关 | 用 `col` / `layout` 控制布局 |
| (Item) preserve | 字段删除时保留值 | 忽略 |
| (Item) required | 单独必填样式 | 改用 `rules=[{required:true}]` |
| (Item) shouldUpdate | 自定义更新逻辑 | 改用 `onValuesChange` 驱动条件渲染 |
| (Item) validateFirst | 校验停止/并行策略 | 规则按内部顺序执行 |
| (Item) validateDebounce | 防抖 | 在外层控件 `onChange` 自行 debounce |
| (Item) validateStatus | 手动校验状态 | 由 `rules` 自动驱动，无法手动设 |
| (List) Form.List.children | 数组化 renderProps | 改用 `useState<number[]>` + `setFieldsValue` 自行管理 |
| (List) Form.List.initialValue | 数组初值 | 放 Form `initialValues` |
| (List) Form.List.name | List 名称 | 同上，自行管理 |
| (List) Form.List.rules | List 级校验 | 在 `onSuccess`/`onFailed` 手动校验数组 |
| (List) Form.ErrorList.errors | 错误列表 | 错误由 `validateErrorType` 自动渲染 |
| (Provider) Form.Provider.onFormChange | 表单间联动 | 多表单用各自 `ref` + 自行状态管理 |
| (Provider) Form.Provider.onFormFinish | 表单间完成联动 | 同上 |
| (ref) getFieldInstance | 按名取控件实例 | 自行 `ref` 收集 |
| (ref) isFieldsTouched | 是否被操作过 | 无查询，自行维护状态 |
| (ref) isFieldTouched | 单字段是否被操作 | 同上 |
| (ref) isFieldValidating | 是否正在校验 | 同上 |
| (ref) scrollToField | 按名滚动 | 在 `onFailed` 里用 DOM id 手动滚动 |
| (ref) setFields | 设字段状态 | 改用 `setFieldsValue` 仅设值 |
| (ref) validateFields | 独立校验 | 用 `submit()` 触发校验，`onFailed` 拦截 |
| (Hook) Form.useFormInstance | 上下文注入 | 自行透传 `ref` 给子组件 |
| (Hook) Form.useWatch | 字段订阅 | `onValuesChange` + 自行 `useState` 缓存 |
| (Hook) Form.Item.useStatus | 取 Item 校验状态 | 无对应 hook |

### Icon → Icon

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| createFromIconfontCN({ scriptUrl, extraCommonProps }) | iconfont 在线脚本 | 改用 icon+ 命名组件或自定义 SVG 透传 |
| getTwoToneColor / setTwoToneColor | 全局双色主色 | 逐组件 `iconColor` + 工厂函数统一 |

### Input → TextField

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| addonAfter | 后置标签 | 已废弃，外层 `Space.Compact` 或自定义布局 |
| addonBefore | 前置标签 | 同上 |
| allowClear | 清除按钮 | 用 `suffix` 放清除图标 + `onClick` 清空 value |
| bordered | 边框开关 | 已废弃，用 `style` 控边框 |
| classNames | 语义化结构 class | 用 `inputStyle` / `labelStyle` / `containerStyle` / `className` |
| count | 字符计数配置 | 自行 `maxLength` + 外部计数文案 |
| defaultValue | 非受控初始值 | 用 `useState` 初始值近似 |
| prefix | 前缀 | 外层 `<div>` 横向布局或用 `suffix` 近似 |
| showCount | 字数展示 | 自行 `maxLength` + 外部文案 |
| size | 尺寸 | 靠 `style` 的 `fontSize` / `padding` 近似 |
| variant | 形态变体 | 靠 `style` 自定义背景/边框 |
| onClear | 清除回调 | 在清除图标 `onClick` 里自行调用 |

### InputNumber → Spinner

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| addonAfter | 后置标签 | 已废弃，外层 `Space.Compact` |
| addonBefore | 前置标签 | 同上 |
| autoFocus | 自动聚焦 | 用 `ref.focus()` 在 mount 时调用 |
| changeOnWheel | 滚轮改值 | 不支持滚轮改值，忽略 |
| controls | 加减按钮配置 | 加减按钮固定显示，`controls={false}` 改用 `TextField format="number"` |
| decimalSeparator | 小数点分隔符 | 小数点固定 `.`，外部文案格式化 |
| placeholder | 占位 | Spinner 有默认值 0，无占位；空态用 `TextField format="number"` |
| defaultValue | 非受控初始值 | 用 `useState` 初始值近似 |
| formatter | 展示格式化 | 在 `onChange` 后自行格式化，或用 `customPrefix` |
| keyboard | 键盘行为开关 | 固定开启，忽略 |
| parser | 解析函数 | 配合 formatter，用 `isCharacterAllowed` 近似 |
| readOnly | 只读 | 用 `disabled` 近似（会灰化） |
| suffix | 后缀 | 外层布局放单位文案 |
| size | 尺寸 | 靠 `style` / `inputClassName` 近似 |
| stringMode | 高精度字符串模式 | 时间型 onChange 已返回 string；高精度不支持 |
| variant | 形态变体 | 靠 `style` 自定义 |
| onStep | 上下箭头点击回调 | 加减变化统一走 `onChange` |

### Modal → Dialog

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| loading | 骨架屏 | 内容区自行 `<div>加载中...</div>` 占位 |
| maskClosable | 点击蒙层关闭 | 默认点蒙层不关，如需实现自行 `maskStyle` onClick（不推荐） |
| classNames | 语义化结构 class | 用 `buttonStyle` / `contentStyle` / `maskStyle` / `style` / `className` |
| forceRender | 强制渲染 | 不支持，打开时用 `useEffect` + `setFieldsValue` 回填 |
| modalRender | 自定义渲染 | 用 `style` / `className` / `contentStyle` 近似 |
| afterClose | 完全关闭后回调 | 用 `onClose` + `setTimeout` 近似，或 `animationOff` 关动画后直接处理 |
| afterOpenChange | 打开/关闭动画结束回调 | 同上 |

### MultipleSelect → MultipleSelect

> antd `Select`（`mode="multiple"`）→ eview `MultipleSelect`；含 Option props

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultValue | 默认值 | 用 `value` 受控初始化 |
| autoClearSearchValue | 搜索框自动清空 | 无搜索框自动清空开关，忽略 |
| optionFilterProp | 搜索过滤字段 | 搜索内部按 `text` 过滤，无字段配置 |
| filterOption | 自定义筛选函数 | 无自定义筛选函数 |
| filterSort | 筛选排序 | 无筛选排序 |
| maxCount | 最大选中数量 | 用业务校验 `onChange` 判断长度 |
| maxTagPlaceholder | 隐藏 tag 占位内容 | 无自定义 tag/label 渲染，忽略 |
| maxTagTextLength | tag 文本长度限制 | 同上 |
| tagRender | 自定义 tag 渲染 | 同上 |
| labelRender | 自定义 label 渲染 | 同上 |
| labelInValue | value 含 label | value 只支持基本类型数组，自行维护 label 映射 |
| menuItemSelectedIcon | 自定义选中图标 | 无自定义图标，忽略 |
| removeIcon | 自定义清除图标 | 同上 |
| suffixIcon | 自定义后缀图标 | 同上 |
| prefix | 前缀 | 同上 |
| defaultOpen | 默认展开 | 无默认展开开关 |
| onPopupScroll | 弹窗滚动回调 | 无对应回调，忽略 |
| onInputKeyDown | 按键回调 | 同上 |
| onClear | 清除回调 | 用 `enableCloseIcon` + `onChange` |
| notFoundContent | 空状态自定义 | 无空状态自定义 |
| loading | 加载态 | 用 `disabled` 表达加载态 |
| size | 尺寸 | 用 `inputStyle` 近似 |
| variant | 形态变体 | 无形态变体 |
| fieldNames | 自定义字段名 | 字段固定 `text`/`value`，需先转数据 |
| getPopupContainer | 弹层父节点 | 未暴露弹层父节点 |
| popupMatchSelectWidth | 同宽配置 | 未暴露同宽配置 |
| popupRender | 自定义下拉内容 | 无自定义下拉内容 |
| optionRender | 自定义选项渲染 | 无自定义选项渲染 |
| optionLabelProp | 回填字段 | 回填固定用 `text` |
| defaultActiveFirstOption | 默认高亮 | 无默认高亮 |
| mode="tags" | tags 模式 | 无 tags 模式，用 MultipleSelect 近似（丢失自动分词） |
| tokenSeparators | 自动分词 | 无自动分词 |
| (Option) className | 选项 class | 无选项 class |
| (Option) title | 原生 title | 无原生 title |

### Pagination → Paging

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultCurrent | 非受控当前页 | 用 `useState` 初始值近似 |
| defaultPageSize | 非受控每页条数 | 用 `useState` 初始值近似 |
| showSizeChanger | 每页条数切换器 | 用 `disableSelect` 禁用下拉近似 `false` |
| showTotal | 总量文案 | 用 `recordCountDisp` / `enableSelectedCount` / `pagingCountContent` 近似 |
| size | 尺寸 | `small` 用 `type="select"` 近似（语义不同） |
| responsive | 响应式自动调整 | 忽略，自行按屏幕宽度切换 `type` |
| showLessItems | 页码折叠 | 页码折叠策略固定，忽略 |
| showTitle | 原生 tooltip 开关 | 忽略 |
| itemRender | 自定义页码结构 | 无自定义页码结构，忽略 |
| hideOnSinglePage | 单页隐藏 | 自行 `{total <= pageSize ? null : <Paging />}` 条件渲染 |

### Popover → TipBox

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| open | 受控显隐 | `display` 在有 children 时不支持，用 key 重挂近似 |
| defaultOpen | 默认开态 | 用 `open` 受控 + key 重挂，或忽略 |
| onOpenChange | 显隐变化回调 | 无显隐变化回调；`onDispose` 仅自动关闭触发 |
| autoAdjustOverflow | 自动溢出调整 | 自动处理，不可配置 |
| destroyTooltipOnHide | 销毁选项 | 用 key 重挂近似 |
| getPopupContainer | 自定义挂载节点 | 无自定义挂载节点（`autoZindex` 自动层级） |
| zIndex | 层级 | `autoZindex` 自动管理 |
| openClassName | 触发元素开态 class | 无对应，忽略 |
| afterOpenChange | 显隐后回调 | 无对应，忽略 |

### Radio → Radio

> 含 Radio（单个）、Radio.Group → RadioGroup、CheckboxOptionType（options 子项字段）

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| (单) autoFocus | 自动聚焦 | 用 `ref.focus()` 近似 |
| (单) defaultChecked | 非受控初始值 | 用初始 `useState` + `isControlled` 近似 |
| (Group) buttonStyle | 按钮风格 | 按钮样式改用 `SelectCard` |
| (Group) defaultValue | 非受控初始值 | 用初始 state + `isControlled` 近似 |
| (Group) name | input name | 表单内由 `Form.Item` 的 `name` 托管 |
| (Group) optionType | 选项类型（button） | 按钮型改用 `SelectCard` 或自行样式 |
| (Group) size | 尺寸 | 按钮样式才生效，eview 无按钮样式，忽略 |
| (Group) block | 宽度铺满 | `style={{ width: '100%' }}` |
| (Option) disabled | 单项禁用 | 整组用 `RadioGroup.disabled` |
| (Option) style / className | 单项样式 | 不支持，忽略 |
| (Option) title / id | 单项 title/id | 不支持，忽略 |
| (Option) onChange | 单项 onChange | 统一走组 `onChange` |
| (Option) required | 单项必填 | 组 `required` |

### Rate → Rating

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| allowClear | 再次点击清除 | 在 `onClick` 里判断同分清零 |
| autoFocus | 自动聚焦 | 用 `ref.focus()` 命令式 |
| defaultValue | 非受控初始值 | 用 `useState` 初始值近似 |
| tooltips | 每项提示信息 | 自行外层 `Tooltip` 包裹或外部文案展示分值 |
| onBlur() | 失焦回调 | 外层 `<div onBlur={...}>` 近似 |
| onFocus() | 聚焦回调 | 外层 `<div onFocus={...}>` 近似 |

### Segmented → SelectCard

> 含主属性与 SegmentedItemType → SelectCardItem

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultValue | 默认值 | 用 `value` 受控初始化 |
| block | 宽度铺满 | `style={{ width: '100%' }}` |
| vertical | 竖排 | 改用 `RadioGroup` |
| shape | 圆角形状 | 忽略 |
| name | input name | 忽略 |
| (Item) icon | 选项图标 | 丢失，改用其他组件或放弃 |
| (Item) className | 选项 class | 用 `itemStyle` / `itemClassName` |

### Select → Select

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultValue | 默认值 | 用 `value` 受控初始化 |
| autoClearSearchValue | 搜索框自动清空 | 多选/标签模式属性，单选不涉及 |
| autoFocus | 自动聚焦 | 用 `ref.focus()` 命令式聚焦 |
| classNames | 语义化结构 class | 改用 `selectClassName`/`optionClassName` |
| styles | 语义化结构 style | 改用 `selectStyle`/`optionStyle` |
| defaultActiveFirstOption | 默认高亮首项 | 无此选项，忽略 |
| defaultOpen | 默认展开 | 用 `onDropdownVisibleChange` + 状态受控 |
| popupMatchSelectWidth | 同宽 | 下拉宽度固定，忽略 |
| popupRender | 自定义下拉内容 | 无自定义下拉内容渲染 |
| dropdownRender | 自定义下拉内容（废弃） | 同 `popupRender` |
| fieldNames | 自定义字段名 | 字段固定 `text`/`value`，数据层转换 |
| filterOption | 自定义筛选 | 单选无搜索，改用 `InputSelect` |
| filterSort | 筛选排序 | 无筛选排序 |
| getPopupContainer | 弹层容器 | 弹层位置由 `popupDirection` 控制 |
| labelInValue | value 含 label | 用 `onChange` 的 `text` 参数 |
| listHeight | 列表高度 | 用 `virtualScroll` 控制滚动 |
| loading | 加载态 | 外层包 `Loading type="local"` |
| maxCount | 最大选中数量 | 多选模式属性 |
| maxTagCount | 最多显示 tag 数 | 多选模式属性 |
| maxTagPlaceholder | 隐藏 tag 占位 | 多选模式属性 |
| maxTagTextLength | tag 文本长度 | 多选模式属性 |
| menuItemSelectedIcon | 自定义选中图标 | 多选模式属性 |
| mode | 多选/标签模式 | 单选不设 mode；多选见 MultipleSelect |
| notFoundContent | 空列表文案 | 无空列表文案属性 |
| open | 受控展开 | 用 `onDropdownVisibleChange` 受控 |
| optionFilterProp | 搜索过滤字段 | 单选无搜索 |
| optionLabelProp | 回填字段 | 回填固定取 `text` |
| optionRender | 自定义选项渲染 | 选项结构固定，自定义用 `icon`/`iconActive` |
| prefix | 前缀 | 无前缀属性 |
| removeIcon | 自定义清除图标 | 多选模式属性 |
| searchValue | 受控搜索值 | 单选无搜索 |
| showSearch | 可搜索 | 改用 `InputSelect` |
| size | 尺寸 | 无尺寸属性 |
| status | 校验状态 | 用 `validator` + `hintType` 表达 |
| suffixIcon | 后缀图标 | 后缀图标固定 |
| tagRender | 自定义 tag 渲染 | 多选模式属性 |
| labelRender | 自定义 label 渲染 | label 固定取 `text` |
| tokenSeparators | 自动分词 | tags 模式属性 |
| variant | 形态变体 | 无形态变体 |
| onClear | 清空回调 | 清空靠 `enableClear` 内置 |
| onDeselect | 取消选中回调 | 多选模式属性 |
| onInputKeyDown | 按键回调 | 无按键回调 |
| onPopupScroll | 弹窗滚动回调 | 无滚动回调 |
| onSearch | 搜索回调 | 单选无搜索 |
| onSelect | 选中回调 | 选中走 `onChange` |

### Slider → DragInput

> 含主属性、range 子属性、tooltip 子属性

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultValue | 默认值 | 用 `value` 受控初始化 |
| dots | 只能拖到刻度 | `markIndexes` 仅控制显示，忽略 |
| included | 包含/并列开关 | 无对应，忽略 |
| vertical | 竖排方向 | 无竖排方向，忽略 |
| reverse | 反向坐标轴 | 无反向，忽略 |
| keyboard | 键盘操作开关 | 无键盘开关，忽略 |
| autoFocus | 自动聚焦 | 用 `ref.focus()` |
| tooltip | 数值提示 | 用 `displayInput` / `labelFormat` 近似 |
| classNames | 语义化结构 class | 改用 `stickStyle`/`barStyle`/`inputStyle` 对应 className |
| styles | 语义化结构 style | 同上 |
| onChangeComplete | 拖拽结束回调 | 在 `onChange` 里自行防抖 |
| range.draggableTrack | 区间整体拖拽 | 无对应，忽略 |
| range.editable | 动态增减节点 | 无对应，忽略 |
| range.minCount / range.maxCount | 节点数量限制 | 同上，忽略 |
| tooltip.open | 受控提示显隐 | 无 Tooltip |
| tooltip.placement | 提示位置 | 无对应 |
| tooltip.autoAdjustOverflow | 溢出调整 | 无对应 |
| tooltip.getPopupContainer | 提示容器 | 无对应 |

### Spin → Loading

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| size | 尺寸 | 无尺寸属性，`micro` 已是小圈 |
| delay | 延迟显示 | 自行用定时器实现防闪烁 |
| percent | 进度展示 | 改用进度条组件或自定义 `desc` 文案 |

### Steps → Steps

> 含主属性与 StepItem

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| initial | 起始偏移 | 序号直接写进 `data[].value` |
| type | navigation/inline 类型 | 仅 default 形态，忽略 |
| percent | 进度条进度 | 用 description 文字表达 |
| progressDot | 点状步骤条 | 忽略 |
| responsive | 响应式自动竖排 | 忽略 |
| size | 尺寸 | 忽略 |
| (Item) subTitle | 子标题 | 折叠进 `description` |
| (Item) disabled | 项级禁用 | 用 `onClick` 守卫拦截 |

### Switch → Toggle

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultChecked | 非受控初始值 | 用 `toggled` 受控初始化 |
| defaultValue | 同 defaultChecked 别名 | 同上 |
| onClick | 独立点击回调 | `onToggle` 覆盖 |
| loading | 加载态 | 用 `disabled` + 外层 `Loading type="micro"` |
| size | 尺寸 | 自定义 `fieldStyle` 缩放 |
| autoFocus | 自动聚焦 | 忽略，无对应方法 |

### Table → Table

> 含 Table 主属性、Column 列属性、rowSelection、expandable、scroll、Table ref

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| bordered | 外/列边框开关 | 自定义 CSS 边框；斑马纹用 `enableZebraCrossing` |
| size | 尺寸档 | `style` 字号或固定行高近似 |
| title(currentPageData) | 表格标题 | 外部 `<div>` 包裹 |
| footer(currentPageData) | 表尾 | 外部 `<div>` 包裹 |
| summary(currentData) | 总结栏 | 外部自行渲染 |
| components | 覆盖 table 元素 | 无法覆盖；用 `render` 自定义单元格内容 |
| getPopupContainer | 筛选菜单浮层 | 无浮层，忽略 |
| rowClassName | 行类名 | 用 `onRowClick` + 外部 CSS 选中态近似 |
| rowHoverable | 行 hover 交互开关 | 不可关闭，忽略 |
| showHeader | 表头显隐 | 不可隐藏，忽略 |
| showSorterTooltip | 排序 tooltip | 无提示，忽略 |
| sticky | 粘性头部 | 表头固定靠容器 `maxHeight` 滚动 |
| tableLayout | 表格布局 | 内部管理，忽略 |
| onHeaderRow | 表头行事件 | 无对应，忽略 |
| onScroll | 滚动事件回调 | 无对应，忽略 |
| onChange filters / extra.action='filter' | 列值筛选 | 后台过滤由业务在请求层处理 |
| (Column) colSpan | 表头列合并 | 无表头合并，自定义 render |
| (Column) className | 列 class | 用 `style` / 自定义 render 容器 |
| (Column) defaultFilteredValue / filteredValue / filters / filterDropdown / filterDropdownProps / filterIcon / filterMode / filterMultiple / filterSearch / filterOnClose / filtered / onFilter | 列值筛选 | 后台过滤由业务在请求层处理 |
| (Column) sortIcon | 自定义排序图标 | 无自定义排序图标 |
| (Column) showSorterTooltip | 排序 tooltip | 无提示，忽略 |
| (Column) minWidth | 最小列宽 | 无最小列宽 |
| (Column) responsive | 响应式断点 | 无响应式断点 |
| (Column) rowScope | 列范围 | 无列范围 |
| (Column) shouldCellUpdate | 单元格更新 | 用表级 `isRequiredToUpdateColumns` / `enableColumnCompareUpdate` |
| (Column) onCell | 单元格属性回调 | 无对应，忽略 |
| (Column) onHeaderCell | 表头单元格回调 | 无对应，忽略 |
| (rowSelection) onSelect / onSelectAll / onSelectInvert / onSelectNone / onSelectMultiple | 细分选择回调 | 用 `onRowCheck` / `onHeaderCheck` 的 `checkedRows` 判断 |
| (rowSelection) checkStrictly | 父子联动开关 | 无父子联动开关（eview 不做树形） |
| (rowSelection) columnTitle / columnWidth / align / fixed | 勾选列样式 | 勾选列样式不可定制 |
| (rowSelection) defaultSelectedRowKeys | 默认勾选 | 用受控 `checkedRows` |
| (rowSelection) selections | 自定义选择项 | 用外部按钮 + `ref.setCheckedRows()` |
| (rowSelection) hideSelectAll | 隐藏表头勾选框 | 不可隐藏 |
| (rowSelection) renderCell | 勾选单元格自定义渲染 | 不可自定义渲染 |
| (rowSelection) getTitleCheckboxProps | 表头勾选 props | 无对应 |
| (rowSelection) onCell | 勾选单元格回调 | 无对应 |
| (expandable) defaultExpandAllRows | 默认全展开 | 用 `expandedRow` 受控传入全部 |
| (expandable) columnTitle / columnWidth / expandIcon / fixed / indentSize / rowExpandable / showExpandColumn | 展开列定制 | 展开列样式/图标/缩进不可定制 |
| (expandable) childrenColumnName | 树形数据 | 树形数据用 `TreeTable` |
| (expandable) onExpand | 单行展开回调 | 用 `expandedRow` 受控 + `onRowClick` 判断 |
| (expandable) onExpandedRowsChange | 展开变化回调 | 用 `expandedRow` 受控自管 |
| (scroll) scroll.scrollToFirstRowOnChange | 翻页滚顶 | 翻页时业务自行处理 |
| (ref) nativeElement | 裸 DOM | 无裸 DOM |
| (ref) scrollTo | 滚动到行 | 无滚动到行方法 |

### Tabs → Tab

> 含 Tabs → Tab 主属性、TabItemType → TabItem、MoreProps

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| addIcon | 新增按钮图标 | 外部 `Button` 自管数组新增 |
| removeIcon | 关闭按钮图标 | 关闭图标不可定制，用 `closable` 开关 |
| animated | 切换动画 | 忽略 |
| centered | 页签居中 | 用 `headStyle` flex 近似 |
| hideAdd | 隐藏加号 | 无内置加号 |
| indicator | 指示条 | 指示条不可自定义，忽略 |
| more | 收纳菜单配置 | 收纳菜单自动处理，不可配置 |
| popupClassName | 收纳菜单 className | 无 className |
| renderTabBar | 标题头二次封装 | 不可二次封装 |
| size | 尺寸 | 忽略或 CSS 字号 |
| tabBarExtraContent | 标题区额外内容 | 用外部布局包裹 |
| tabBarGutter | 页签间距 | CSS 间距近似 |
| onTabScroll | 滚动回调 | 无对应，忽略 |
| (Item) closeIcon | 关闭图标自定义 | 关闭图标不可定制，用 `closable` 开关 |
| (More) more.icon | 收纳图标 | 收纳图标不可定制 |
| (More) more (DropdownProps) | 收纳菜单属性 | 收纳菜单属性不可透传 |

### Tag → Tag

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| closeIcon | 关闭图标 | 无关闭按钮，用文字后缀「×」+ `onClick` 移除 |
| onClose | 关闭回调 | 用 `onClick` 业务自管数组 |

### TextArea → TextArea

> antd `Input.TextArea` → eview `TextArea`

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultValue | 非受控初始值 | 用受控 `value` + `onChange` |
| variant | 形态变体 | 用 `inputStyle` 自定义边框 |
| size | 尺寸 | 用 `inputStyle` 字号/行高近似 |
| allowClear | 清除按钮 | 外部清除按钮 + `value` 清空 |
| onClear | 清除回调 | 同上 |
| addonAfter / addonBefore | 前后置标签 | 已废弃，外层布局包裹 |
| prefix / suffix | 前后缀图标 | TextArea 不适用，外层布局 |
| bordered | 边框开关 | 已废弃，用 `inputStyle` 边框 |
| type | 类型 | TextArea 不适用（原生 textarea 无 type） |

### Tooltip → TipBox

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| open | 受控显隐 | `display` 在有 children 时不支持，用 key 重挂近似 |
| defaultOpen | 默认开态 | 用 `open` 受控 + key 重挂，或忽略 |
| onOpenChange | 显隐变化回调 | 无显隐变化回调；`onDispose` 仅自动关闭触发 |
| autoAdjustOverflow | 自动溢出调整 | 自动处理，不可配置 |
| destroyTooltipOnHide | 销毁选项 | 用 key 重挂近似 |
| getPopupContainer | 自定义挂载节点 | 无自定义挂载节点（`autoZindex` 自动层级） |
| zIndex | 层级 | `autoZindex` 自动管理 |
| openClassName | 触发元素开态 class | 无对应，忽略 |
| fresh | 内容刷新开关 | 无对应，忽略 |
| afterOpenChange | 显隐后回调 | 无对应，忽略 |

### Tree → Tree

> 含 Tree 主属性、TreeNode props、DirectoryTree props

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultSelectedKeys | 默认选中 | 用受控 `selectedKeys` 初始化 |
| selectable | 全局可选开关 | 用 `selectBoxType` 或节点级 `disabled` 近似 |
| defaultCheckedKeys | 默认勾选 | 用受控 `checkedKeys` 初始化 |
| defaultExpandAll | 默认全展开 | 用 `expandedKeys` 受控或 `expandAll` 方法 |
| defaultExpandedKeys | 默认展开 keys | 用 `expandedKeys` 初始化 |
| defaultExpandParent | 默认展开父级 | 无该开关 |
| autoExpandParent | 自动展开父级 | 展开态完全由 `expandedKeys` 控制 |
| onDragEnter / onDragLeave / onDragOver | 细粒度拖拽回调 | 未暴露，忽略 |
| allowDrop | 放置位置控制 | 无放置位置控制 |
| loadedKeys | 已加载节点受控 | 无已加载节点受控数组 |
| onLoad | 加载完毕回调 | 无加载完毕回调 |
| showIcon | 图标显示开关 | 设了图标属性即显示，无独立开关 |
| switcherLoadingIcon | 独立加载图标 | 无独立加载图标 |
| blockNode | 节点占整行开关 | 用 `style` / `className` 自定义节点宽度 100% |
| titleRender | 自定义渲染节点 | 用节点数据 `text` 或前后缀近似 |
| (Node) selectable | 节点级可选开关 | 无节点级可选开关 |
| (Node) disableCheckbox | 禁勾 | 改用 `disabled` 近似 |
| (Dir) expandAction | 目录树展开动作 | 用 `expandedKeys` + `onSelect` 自行实现 |

### TreeSelect → TreeSelect

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| defaultValue | 默认值 | 用 `value` 受控初始化 |
| autoClearSearchValue | 搜索框自动清空 | 无搜索框，忽略 |
| showSearch | 可搜索 | 资料薄未演示，待实测；暂用外层 `SearchInput` + 树数据过滤近似 |
| searchValue | 受控搜索值 | 同上 |
| onSearch | 搜索回调 | 同上 |
| treeDefaultExpandAll | 默认全展开 | 未暴露受控展开，内部管理 |
| treeDefaultExpandedKeys | 默认展开 keys | 同上 |
| treeExpandedKeys | 受控展开 keys | 未暴露 |
| onTreeExpand | 展开回调 | 同上 |
| treeExpandAction | 展开动作 | 无对应，忽略 |
| treeLine | 连线 | 未暴露连线 |
| treeIcon | 树图标开关 | 未暴露树图标开关 |
| treeLoadedKeys | 已加载节点 | 未暴露 |
| loadData | 异步加载 | 待实测，暂用预加载全树替代 |
| treeDataSimpleMode | 简单格式 | 先扁平转 `{id,text,children}` 再传 |
| treeTitleRender | 自定义渲染节点 | 无自定义渲染，用 `text` |
| switcherIcon | 展开/折叠图标 | 未暴露 |
| labelInValue | value 含 label | `onChange` 本就回传节点对象，无需该开关 |
| showCheckedStrategy | 勾选回显策略 | 内部管理，无配置 |
| maxCount | 最大数量 | 未暴露 |
| maxTagCount | tag 数量限制 | 未暴露 |
| maxTagPlaceholder | 隐藏 tag 占位 | 同上 |
| maxTagTextLength | tag 文本长度 | 同上 |
| tagRender | 自定义 tag 渲染 | 无自定义 tag 渲染 |
| open | 受控展开 | 用 `onOpenMultipleSelectPopup` 监听开合，无受控展开 |
| defaultOpen | 默认展开 | 同上 |
| notFoundContent | 空状态自定义 | 无空状态自定义 |
| suffixIcon | 自定义后缀图标 | 无自定义后缀图标 |
| listHeight | 弹窗高度 | 未暴露 |
| virtual | 虚拟滚动开关 | 未暴露 |
| popupMatchSelectWidth | 同宽 | 未暴露 |
| popupRender | 自定义下拉内容 | 无自定义下拉内容 |
| getPopupContainer | 弹层父节点 | 未暴露 |
| placement | 弹出位置 | 未暴露 |
| size | 尺寸 | 用 `selectStyle` / `inputStyle` 近似 |
| variant | 形态变体 | 无形态变体 |
| prefix | 前缀 | 无前缀 |
| onSelect / onPopupScroll | 选中/弹窗滚动回调 | 未暴露，忽略 |

### Upload → FileUpload

| antd 属性 | 说明 | 建议处理 |
| --- | --- | --- |
| action | 上传地址 | eview 不发请求，删掉；业务在 `handleSubmit` 里自行发请求 |
| data | 额外参数 | 在 `handleSubmit` 里自行拼 FormData |
| headers | 请求头 | eview 不发请求，业务自行拼 |
| method | 请求方法 | 同上 |
| name | 上传字段名 | 同上，业务自行拼 FormData 字段名 |
| withCredentials | 携带凭证 | 同上 |
| listType | 列表样式 | 列表样式固定，无内建变体 |
| openFileDialogOnClick | 点击打开文件框 | 未暴露该开关 |
| pastable | 粘贴上传 | 未暴露粘贴上传 |
| showUploadList | 列表显隐 | 文件列表固定显示，无法隐藏 |
| iconRender | 自定义图标 | 无自定义图标 |
| isImageUrl | 缩略图判断 | 无缩略图判断 |
| itemRender | 自定义列表项渲染 | 无自定义列表项渲染 |
| previewFile | 自定义预览 | 无自定义预览逻辑 |
| onDrop | 拖拽回调 | 未暴露拖拽回调 |
| onDownload | 下载回调 | 无下载回调，业务自行实现 |

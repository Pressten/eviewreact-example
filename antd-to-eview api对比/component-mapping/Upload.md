# Upload → FileUpload 映射规则

> antd 5.29.3 → eview-react

## 0. 组件对应关系

- antd `Upload` ⇄ eview `FileUpload`
- 定位差异：两者都是「选文件 + 文件列表 + 上传」控件，支持单 / 多文件、类型 / 大小 / 数量校验。**关键架构差异：antd Upload 内部会自己发上传请求（`action` / `customRequest`），eview FileUpload 不会发任何请求**——用户点上传按钮只触发 `handleSubmit({ event, data })`，请求、进度、成功失败全由业务代码做，再通过 `updateProgressStatus` / `fileUploadStatus` 两个按文件名索引的对象回写给组件驱动进度 UI。此外禁用属性 antd 是 `disabled`，eview 是 **`disable`**（不是 `disabled`）。单 / 多文件 antd 无显式模式开关（靠 `multiple`），eview 用 `type="single" | "multi"`。

## 1. 属性映射表

| antd 属性 | eview 属性 | 处理方式 | 说明 |
| --- | --- | --- | --- |
| `accept` | `accept` | 直接改名 | 选择框过滤类型 |
| `action` | — | ❌ 无法映射 | **eview 不发请求**，删掉；业务在 `handleSubmit` 里自行发请求（见 2.1） |
| `beforeUpload` | `validator` | 综合映射 | antd 上传前拦截；eview 点上传时校验，返回 `{ result, message }`（见 2.2） |
| `customRequest` | `handleSubmit` | 综合映射 | antd 覆盖上传实现；eview 在 `handleSubmit` 里自行实现请求（见 2.1） |
| `data` | — | ❌ 无法映射 | eview 无额外参数配置；在 `handleSubmit` 里自行拼 FormData |
| `defaultFileList` | `fileList` | 综合映射 | antd 默认列表；eview 用 `fileList` 受控初始化 |
| `fileList` | `fileList` | 直接改名 | 受控文件列表 |
| `disabled` | `disable` | 直接改名 | **注意 eview 是 `disable` 不是 `disabled`** |
| `directory` | `directory` | 直接改名 | 上传整个文件夹 |
| `headers` | — | ❌ 无法映射 | eview 不发请求，无 headers；业务自行拼 |
| `method` | — | ❌ 无法映射 | 同上 |
| `name` | — | ❌ 无法映射 | 同上，业务自行拼 FormData 字段名 |
| `withCredentials` | — | ❌ 无法映射 | 同上 |
| `listType` | — | ❌ 无法映射 | eview 无 `text`/`picture`/`picture-card` 内建样式；列表样式固定 |
| `maxCount` | `maxFileCount` | 直接改名 | antd `maxCount` → eview `maxFileCount`（默认 10） |
| `multiple` | `type="multi"` | 综合映射 | antd `multiple` 布尔；eview 用 `type="single" | "multi"` 表达单/多（见 2.3） |
| `openFileDialogOnClick` | — | ❌ 无法映射 | eview 未暴露该开关 |
| `pastable` | — | ❌ 无法映射 | eview 未暴露粘贴上传 |
| `progress` | `enableProgress` + `updateProgressStatus` | 综合映射 | antd 自带进度条样式；eview 需 `enableProgress` 开关 + `updateProgressStatus` 回写百分比（见 2.4） |
| `showUploadList` | — | ❌ 无法映射 | eview 无列表显隐开关（文件列表固定显示） |
| `iconRender` | — | ❌ 无法映射 | eview 无自定义图标 |
| `isImageUrl` | — | ❌ 无法映射 | eview 无缩略图判断 |
| `itemRender` | — | ❌ 无法映射 | eview 无自定义列表项渲染 |
| `previewFile` | — | ❌ 无法映射 | eview 无自定义预览逻辑 |
| `onChange` | `onChange` | 综合映射 | antd 上传各阶段回调；eview 选择文件变化回调，签名不同（见 2.5） |
| `onDrop` | — | ❌ 无法映射 | eview 未暴露拖拽回调 |
| `onDownload` | — | ❌ 无法映射 | eview 无下载回调 |
| `onPreview` | `onFileItemClick` | 改名 | 点击文件项 |
| `onRemove` | `onFileClose` | 改名 | 移除文件 |
| `type` | `type` | 改值 | antd 无；eview `'single' | 'multi'`（默认 single） |
| `disable` | — | eview 特有 | 禁用（拼写如此） |
| `display` | — | eview 特有 | 是否显示组件 |
| `isAcceptValidate` | — | eview 特有 | 开启 accept 校验 |
| `maxSize` | — | eview 特有 | 单文件大小上限（如 "10MB"） |
| `validator` | — | eview 特有 | 点上传时校验 |
| `handleSubmit` | — | eview 特有 | 点上传按钮回调，业务在此发请求 |
| `onFileClose` / `onCancelUpload` / `onReload` | — | eview 特有 | 删除 / 取消 / 失败重传 |
| `onFileItemClick` | — | eview 特有 | 点击某个文件 |
| `enableProgress` / `updateProgressStatus` / `fileUploadStatus` | — | eview 特有 | 进度开关 / 进度回写 / 状态回写 |
| `IsStepFileUpload` | — | eview 特有 | multi 下按序逐个上传并显示第几个 |
| `hideUploadButton` | — | eview 特有 | 隐藏上传按钮（自动上传用） |
| `buttonText` / `buttonStyle` / `placeHolder` / `tipText` | — | eview 特有 | 文案与样式 |
| `width` | — | eview 特有 | 宽度（不支持百分比，建议 ≥ 292px） |
| `hintType` / `showCustomHintTip` | — | eview 特有 | 校验提示形式 |
| `showFileSize` / `displayToolTip` / `isShowCancelFileText` | — | eview 特有 | 显示大小 / 提示 / 取消文本 |
| `ref.handleSubmit()` / `ref.getValue()` / `ref.getValueEx()` | — | eview 特有 | 命令式触发上传 / 取文件列表 |

## 2. 处理方式详解

### 2.1 `action` / `customRequest` → `handleSubmit`（综合映射）

**核心架构差异**：antd Upload 内部发请求（`action` 指定地址，或 `customRequest` 覆盖实现）；eview FileUpload **不发任何请求**，点上传按钮只触发 `handleSubmit({ event, data })`，业务在此用 FormData + fetch/XHR 自行发请求，再通过 `updateProgressStatus` / `fileUploadStatus` 按文件名回写进度与状态。

```tsx
// antd
<Upload action="/api/upload" name="file" onChange={handleChange} />

// eview
const [progress, setProgress] = useState<Record<string, number>>({});
const [status, setStatus] = useState<Record<string, UploadStatus>>({});

const handleSubmit = async ({ data }: { event: any; data: any[] }) => {
  for (const item of data) {                        // data 项：{ name, data: File }
    const name = item.name;
    setProgress((p) => ({ ...p, [name]: 0 }));
    setStatus((s) => ({ ...s, [name]: 'loading' }));
    try {
      const form = new FormData();
      form.append('file', item.data);               // 业务自行拼字段名
      const res = await api.upload(form, (pct) => setProgress((p) => ({ ...p, [name]: pct })));
      setStatus((s) => ({ ...s, [name]: 'success' }));
    } catch (e) {
      setStatus((s) => ({ ...s, [name]: 'fail' }));
    }
  }
};

<FileUpload
  type="multi"
  maxFileCount={5}
  accept=".png,.svg,.xlsx"
  isAcceptValidate
  enableProgress
  updateProgressStatus={progress}
  fileUploadStatus={status}
  handleSubmit={handleSubmit}
/>
```

### 2.2 `beforeUpload` → `validator`（综合映射）

antd `beforeUpload` 在选文件后、上传前拦截，返回 `false` / `Upload.LIST_IGNORE` 停止；eview `validator(files)` 在点上传按钮时校验，返回 `{ result: boolean, message: string }`，`result: true` 放行。

```tsx
// antd
<Upload beforeUpload={(file) => file.size < 10 * 1024 * 1024} action="/api" />

// eview
<FileUpload
  maxSize="10MB"
  validator={(files) => ({
    result: files.every((f) => /^[\w.-]+$/.test(f.name)),
    message: '文件名只能包含字母、数字、下划线、点和短横线',
  })}
  handleSubmit={handleSubmit}
/>
```

### 2.3 `multiple` → `type`（综合映射）

antd 用 `multiple` 布尔开关；eview 用 `type="single" | "multi"` 表达单 / 多文件。

```jsx
// antd 多文件
<Upload multiple action="/api" />

// eview 多文件
<FileUpload type="multi" handleSubmit={handleSubmit} />

// antd 单文件
<Upload action="/api" />

// eview 单文件（默认）
<FileUpload type="single" handleSubmit={handleSubmit} />
```

### 2.4 `progress` → `enableProgress` + `updateProgressStatus`（综合映射）

antd 自带进度条，`progress` 定制样式；eview 需 `enableProgress` 开启，并业务回写 `updateProgressStatus`（按文件名 key 的百分比）+ `fileUploadStatus`（按文件名 key 的状态）。

```tsx
// antd
<Upload progress={{ strokeWidth: 2, showInfo: false }} action="/api" />

// eview
<FileUpload
  enableProgress
  updateProgressStatus={progress}     // { [fileName]: number }
  fileUploadStatus={status}           // { [fileName]: 'loading'|'success'|'fail'|'added'|'' }
  handleSubmit={handleSubmit}
/>
```

### 2.5 `onChange` 签名调整

antd `onChange({ file, fileList, event })` 上传各阶段触发；eview `onChange(event, itemList)` 选择文件变化触发，不携带上传状态。上传状态需读 `fileUploadStatus`。

```tsx
// antd
<Upload onChange={(info) => setFileList(info.fileList)} action="/api" />

// eview
<FileUpload onChange={(event, itemList) => setFileList(itemList)} handleSubmit={handleSubmit} />
```

### 2.6 自动上传（`beforeUpload` 返回 false 场景 → `hideUploadButton` + `ref.handleSubmit`）

antd 可用 `beforeUpload` 返回 `false` 阻止自动上传、手动控制；eview 用 `hideUploadButton` 隐藏按钮 + `onChange` 里调 `ref.handleSubmit()` 实现选完即传。

```tsx
// eview 自动上传
<FileUpload
  ref={uploadRef}
  type="single"
  hideUploadButton
  onChange={(event, itemList) => uploadRef.current.handleSubmit()}
  handleSubmit={handleSubmit}
/>
```

## 3. 无法映射的属性与建议处理

| antd 属性 | 建议 |
| --- | --- |
| `action` / `method` / `name` / `headers` / `data` / `withCredentials` | 删掉，业务在 `handleSubmit` 里自行拼 FormData + fetch/XHR |
| `listType`（text/picture/picture-card/picture-circle） | eview 列表样式固定，无内建变体 |
| `showUploadList` | 文件列表固定显示，无法隐藏 |
| `iconRender` / `isImageUrl` / `itemRender` / `previewFile` | 无自定义渲染 / 预览，忽略 |
| `openFileDialogOnClick` | 无对应，忽略 |
| `pastable` | 无粘贴上传，忽略 |
| `onDrop` / `onDownload` | 无拖拽 / 下载回调，业务自行实现 |
| `defaultFileList` | 用 `fileList` 受控初始化 |

## 4. 完整示例对照

```tsx
// antd
import { Upload, Button } from 'antd';

<Upload
  action="/api/upload"
  method="post"
  name="file"
  data={{ bizId: '123' }}
  headers={{ Authorization: 'Bearer xxx' }}
  accept=".png,.svg,.xlsx"
  multiple
  maxCount={5}
  beforeUpload={(file) => file.size < 10 * 1024 * 1024}
  fileList={fileList}
  onChange={(info) => setFileList(info.fileList)}
  onRemove={(file) => true}
>
  <Button type="primary">上传</Button>
</Upload>

// eview 等价
import FileUpload from '@nce/eview-react/FileUpload';

const [progress, setProgress] = useState<Record<string, number>>({});
const [status, setStatus] = useState<Record<string, UploadStatus>>({});

const handleSubmit = async ({ data }: { event: any; data: any[] }) => {
  for (const item of data) {
    const name = item.name;
    setProgress((p) => ({ ...p, [name]: 0 }));
    setStatus((s) => ({ ...s, [name]: 'loading' }));
    try {
      const form = new FormData();
      form.append('file', item.data);              // name → 自拼字段名
      // data / headers / method / action 全在业务里拼
      await api.upload(form, { bizId: '123' }, (pct) => setProgress((p) => ({ ...p, [name]: pct })));
      setStatus((s) => ({ ...s, [name]: 'success' }));
    } catch (e) {
      setStatus((s) => ({ ...s, [name]: 'fail' }));
    }
  }
};

<FileUpload
  type="multi"                                      // multiple → type="multi"
  maxFileCount={5}                                   // maxCount → maxFileCount
  accept=".png,.svg,.xlsx"
  isAcceptValidate
  maxSize="10MB"                                     // beforeUpload 大小校验 → maxSize
  enableProgress
  updateProgressStatus={progress}                    // 进度回写（eview 特有）
  fileUploadStatus={status}                          // 状态回写（eview 特有）
  fileList={fileList}
  handleSubmit={handleSubmit}                        // action/customRequest → handleSubmit
  onFileClose={(event) => {                          // onRemove → onFileClose
    // 同步删掉 progress/status 里对应项
  }}
/>
```

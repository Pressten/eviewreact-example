# Empty


## 何时使用 {#when-to-use}

- 当目前没有数据时，用于显式的用户提示。
- 初始化场景时的引导创建流程。

## API

通用属性参考：[通用属性](/docs/react/common-props)

```jsx
<Empty>
  <Button>创建</Button>
</Empty>
```

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| description | 自定义描述内容 | ReactNode | - |  |
| image | 设置显示图片，为 string 时表示自定义图片地址。 | ReactNode | `Empty.PRESENTED_IMAGE_DEFAULT` |  |
| imageStyle | 图片样式 | CSSProperties | - |  |

## 内置图片

- Empty.PRESENTED_IMAGE_SIMPLE

  <div class="site-empty-buildIn-img site-empty-buildIn-simple"><div>

- Empty.PRESENTED_IMAGE_DEFAULT

  <div class="site-empty-buildIn-img site-empty-buildIn-default"></div>

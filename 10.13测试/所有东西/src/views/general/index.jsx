// Layer 4 view — 通用 (General): Button, Divider, Typography(H5), Space/Flex(H5)
import { Button, Divider } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { Section, SubCard, Demo, TTitle, TText, TLink, TParagraph, HStack, VStack, Wrap, Cluster } from "../../components/showcase/index.jsx";

export default function GeneralView() {
  return (
    <Section id="general" title="1. 通用" desc="Button / Divider 真实 antd 组件;Typography、Space、Flex 已被设计系统替换为 H5 + token 实现。">
      {/* Button */}
      <SubCard title="Button 按钮" extra={<TLink onClick={() => {}}>设计规范</TLink>}>
        <Demo label="type: default / primary / dashed / text(无 link,链接式用 <a>)">
          <Button>Default</Button>
          <Button type="primary">Primary</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="text">Text</Button>
        </Demo>
        <Demo label="danger(在 primary 上)">
          <Button type="primary" danger>危险操作</Button>
          <Button danger>删除</Button>
        </Demo>
        <Demo label="shape: default / round(纯图标圆形禁用 → 用 <Icon>)">
          <Button shape="round" type="primary">圆角按钮</Button>
          <Icon name="search" size="1rem" title="搜索" color="var(--primary)" style={{ cursor: "pointer" }} />
          <TText type="secondary">↑ 纯图标场景用 Icon 组件</TText>
        </Demo>
        <Demo label="icon + 文字(Lucide)">
          <Button type="primary" icon={<Icon name="download" size="0.875rem" />}>导出</Button>
          <Button icon={<Icon name="plus" size="0.875rem" />}>新建</Button>
          <Button icon={<Icon name="settings" size="0.875rem" />}>配置</Button>
        </Demo>
        <Demo label="loading / disabled">
          <Button type="primary" loading>提交中</Button>
          <Button disabled>不可用</Button>
          <Button type="primary" disabled>禁用主按钮</Button>
        </Demo>
        <Demo label="size: large / middle(default) / small">
          <Button size="large" type="primary">Large</Button>
          <Button type="primary">Middle</Button>
          <Button size="small" type="primary">Small</Button>
        </Demo>
        <Demo label="block(撑满容器)" block>
          <Button type="primary" block>block 满宽按钮</Button>
        </Demo>
        <Demo label="链接式操作(替代 type=link):<a> + var(--interactive-link)">
          <TLink onClick={() => {}}>查看详情</TLink>
          <TText type="secondary">正文内</TText>
          <TLink onClick={() => {}}>跳转文档</TLink>
        </Demo>
      </SubCard>

      {/* Divider */}
      <SubCard title="Divider 分割线">
        <Demo label="type: horizontal(默认)">
          <div style={{ width: "100%" }}>
            <TText>上文内容</TText>
            <Divider />
            <TText>下文内容</TText>
          </div>
        </Demo>
        <Demo label="type: vertical">
          <TText>文本A</TText>
          <Divider type="vertical" />
          <TText>文本B</TText>
          <Divider type="vertical" />
          <TText>文本C</TText>
        </Demo>
        <Demo label="orientation: left / center / right">
          <div style={{ width: "100%" }}>
            <Divider orientation="left">左对齐</Divider>
            <Divider>居中</Divider>
            <Divider orientation="right">右对齐</Divider>
          </div>
        </Demo>
        <Demo label="dashed 虚线">
          <div style={{ width: "100%" }}>
            <Divider dashed>带文字虚线</Divider>
          </div>
        </Demo>
      </SubCard>

      {/* Typography (H5) */}
      <SubCard title="Typography(antd 已禁用 → H5 + token)">
        <Demo label="Title h1 ~ h5">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100%" }}>
            <TTitle level={1}>H1 Display S</TTitle>
            <TTitle level={2}>H2 Headline L</TTitle>
            <TTitle level={3}>H3 Headline M</TTitle>
            <TTitle level={4}>H4 Headline S</TTitle>
            <TTitle level={5}>H5 Body L</TTitle>
          </div>
        </Demo>
        <Demo label="Text: default / secondary / strong / code">
          <TText>默认文本</TText>
          <TText type="secondary">次要文本</TText>
          <TText strong>加粗文本</TText>
          <TText code>code</TText>
        </Demo>
        <Demo label="Text type: success / warning / danger / disabled">
          <TText type="success">success</TText>
          <TText type="warning">warning</TText>
          <TText type="danger">danger</TText>
          <TText type="disabled">disabled</TText>
        </Demo>
        <Demo label="Link + Paragraph 可展开">
          <div style={{ width: "100%", maxWidth: "32rem" }}>
            <TLink href="https://example.com" target="_blank">外链示例</TLink>
            <TParagraph rows={2} expandable>
              这是一段较长的正文示例,用于演示 H5 实现的可展开/收起段落。设计系统在 token 层提供 --font-body-m、--on-surface 与 --interactive-link,使段落排版与 antd Typography 视觉一致,同时具备暗色自适应。再补充一些内容以便触发省略号与展开行为,验证 clamp 与切换逻辑正常工作。
            </TParagraph>
          </div>
        </Demo>
      </SubCard>

      {/* Space / Flex (H5) */}
      <SubCard title="Space / Flex(antd 已禁用 → H5 flex + gap token)">
        <Demo label="HStack horizontal(size inline/stack/gutter)">
          <HStack gap="var(--spacing-inline)"><Button>项 1</Button><Button>项 2</Button><Button>项 3</Button></HStack>
          <HStack gap="var(--spacing-gutter)"><Button type="primary">Gutter-A</Button><Button type="primary">Gutter-B</Button></HStack>
        </Demo>
        <Demo label="VStack vertical + align">
          <VStack gap="var(--spacing-stack)" align="flex-start">
            <TText>第一行</TText>
            <TText type="secondary">第二行</TText>
            <TText type="secondary">第三行</TText>
          </VStack>
        </Demo>
        <Demo label="wrap 换行">
          <Wrap gap="var(--spacing-inline)">
            {Array.from({ length: 12 }).map((_, i) => (
              <Button key={i}>标签 {i + 1}</Button>
            ))}
          </Wrap>
        </Demo>
        <Demo label="split 分隔符">
          <HStack gap="var(--spacing-inline)" split="·">
            <TLink onClick={() => {}}>首页</TLink>
            <TLink onClick={() => {}}>产品</TLink>
            <TLink onClick={() => {}}>关于</TLink>
          </HStack>
        </Demo>
        <Demo label="Cluster: align / justify / gap 各形态">
          <Cluster justify="space-between" gap="var(--spacing-gutter)" style={{ width: "100%" }}>
            <TText strong>左侧标题</TText>
            <HStack gap="var(--spacing-inline)"><Button size="small">编辑</Button><Button size="small" type="primary">保存</Button></HStack>
          </Cluster>
        </Demo>
      </SubCard>
    </Section>
  );
}

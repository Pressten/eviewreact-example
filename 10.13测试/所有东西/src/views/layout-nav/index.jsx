// Layer 4 view — 5. 布局与导航 (Layout & Nav)
import { useState, useRef } from "react";
import { Menu, Breadcrumb, Steps, Button, Switch } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { Section, SubCard, Demo, TText, TLink, HStack, VStack, Grid12, GCol, Sticky, BackTop, TTitle } from "../../components/showcase/index.jsx";
import "./index.css";

/* local BackTop demo bound to its own scroll box via ref */
function LocalBackTop() {
  const ref = useRef(null);
  return (
    <div className="fv-affix-scroll" ref={ref}>
      <div className="fv-affix-tall">滚动后右下角出现回到顶部按钮…</div>
      <BackTop target={ref} visibilityHeight={80} />
    </div>
  );
}

export default function LayoutNavView() {
  const [menuKey, setMenuKey] = useState("1-1");
  const [inlineCollapsed, setInlineCollapsed] = useState(false);
  const [menuTheme, setMenuTheme] = useState("light");
  const [current, setCurrent] = useState(1);

  const menuItems = [
    { key: "grp", type: "group", label: "运维管理", children: [
      { key: "1-1", label: "设备清单", icon: <Icon name="server" size="0.875rem" /> },
      { key: "1-2", label: "告警中心", icon: <Icon name="bell" size="0.875rem" /> },
    ] },
    { key: "2", label: "配置", icon: <Icon name="settings" size="0.875rem" />, children: [
      { key: "2-1", label: "网络配置" },
      { key: "2-2", label: "安全策略" },
      { type: "divider" },
      { key: "2-3", label: "高级设置" },
    ] },
  ];

  const crumbItems = [
    { title: <a className="sc-link" style={{ cursor: "pointer" }}>首页</a> },
    { title: <a className="sc-link" style={{ cursor: "pointer" }}>运维管理</a> },
    { title: <a className="sc-link" style={{ cursor: "pointer" }}>设备 ▾</a>, menu: { items: [{ title: "设备清单", key: "dev" }, { title: "告警中心", key: "alarm" }] } },
    { title: "DEV-10241" },
  ];

  const stepItems = [
    { title: "创建", description: "提交工单" },
    { title: "派单", description: "分配工程师" },
    { title: "处理", status: "process", description: "更换部件" },
    { title: "验收", description: "业务恢复" },
    { title: "闭环", status: "wait", description: "归档" },
  ];

  return (
    <Section id="layout" title="5. 布局与导航" desc="Menu/Breadcrumb/Steps 为真实 antd;Layout/Row-Col/Affix/BackTop 已禁用 → H5 + token 替代(本页骨架即 Layout 替代)。">
      {/* Layout (H5) */}
      <SubCard title="Layout(H5 替代)">
        <Demo label="Header / Sider / Content / Footer 组合(本页骨架即此实现)" block>
          <div className="fv-mini-layout">
            <div className="fv-mini-header">Header</div>
            <div className="fv-mini-mid">
              <div className="fv-mini-sider">Sider</div>
              <div className="fv-mini-content">Content</div>
            </div>
            <div className="fv-mini-footer">Footer</div>
          </div>
          <TText type="secondary">Sider collapsible / breakpoint / trigger:见下方 Menu inlineCollapsed 演示。</TText>
        </Demo>
      </SubCard>

      {/* Menu */}
      <SubCard title="Menu">
        <Demo label="items(group + submenu + divider)+ selectedKeys 受控 + onClick({key})" block>
          <HStack gap="1rem" align="flex-start">
            <div className="fv-menu-box">
              <Menu mode="inline" theme={menuTheme} items={menuItems} selectedKeys={[menuKey]} onClick={(e) => setMenuKey(e.key)} inlineCollapsed={inlineCollapsed} style={{ width: inlineCollapsed ? "3rem" : "16rem" }} />
            </div>
            <VStack gap="0.5rem">
              <TText>当前 key: {menuKey}</TText>
              <HStack gap="0.5rem"><TText type="secondary">inlineCollapsed</TText><Switch checked={inlineCollapsed} onChange={setInlineCollapsed} /></HStack>
              <HStack gap="0.5rem"><TText type="secondary">theme</TText><Switch checked={menuTheme === "dark"} onChange={(v) => setMenuTheme(v ? "dark" : "light")} /></HStack>
            </VStack>
          </HStack>
        </Demo>
        <Demo label="mode: horizontal(顶部导航 — 规范:顶部导航应用原生 nav 自写)" block>
          <Menu mode="horizontal" items={menuItems} selectedKeys={[menuKey]} onClick={(e) => setMenuKey(e.key)} />
        </Demo>
      </SubCard>

      {/* Breadcrumb */}
      <SubCard title="Breadcrumb">
        <Demo label="items + separator + Dropdown 子菜单 + onClick">
          <Breadcrumb items={crumbItems} separator="/" />
        </Demo>
      </SubCard>

      {/* Affix (H5 Sticky) */}
      <SubCard title="Affix(H5 Sticky 替代)">
        <Demo label="offsetTop 吸顶 Button(滚动下方容器查看)" block>
          <div className="fv-affix-scroll">
            <Sticky offsetTop={4}>
              <Button type="primary">我被吸顶了(offsetTop)</Button>
            </Sticky>
            <div className="fv-affix-tall">向下滚动…</div>
          </div>
        </Demo>
      </SubCard>

      {/* BackTop (H5) */}
      <SubCard title="BackTop(H5 替代,FloatButton 已禁用)">
        <Demo label="visibilityHeight + 自定义 target(滚动下方容器)" block>
          <LocalBackTop />
        </Demo>
      </SubCard>

      {/* Row/Col (H5 Grid12) */}
      <SubCard title="Row / Col(H5 12 栅格替代)">
        <Demo label="gutter + span(8/8/8、12、6×4 等)" block>
          <Grid12 gutter="var(--spacing-gutter)">
            <GCol span={8}><div className="fv-grid-cell">span 8</div></GCol>
            <GCol span={8}><div className="fv-grid-cell">span 8</div></GCol>
            <GCol span={8}><div className="fv-grid-cell">span 8</div></GCol>
          </Grid12>
        </Demo>
        <Demo label="offset + order" block>
          <Grid12 gutter="var(--spacing-gutter)">
            <GCol span={6} offset={6}><div className="fv-grid-cell">span 6 · offset 6</div></GCol>
            <GCol span={6} order={1}><div className="fv-grid-cell">span 6 · order 1</div></GCol>
          </Grid12>
        </Demo>
        <Demo label="响应式 xs/sm/md/lg/xl/xxl(媒体查询由栅格自实现)" note="H5 栅格内置断点适配,与 antd Row/Col 响应式语义对齐">
          <Grid12 gutter="var(--spacing-gutter)">
            {[1, 2, 3, 4, 6].map((n) => (
              <GCol key={n} span={Math.round(12 / n)}><div className="fv-grid-cell">1/{n}</div></GCol>
            ))}
          </Grid12>
        </Demo>
      </SubCard>

      {/* Steps */}
      <SubCard title="Steps">
        <Demo label="current 受控 + items + type=default + onChange" block>
          <Steps current={current} items={stepItems} onChange={setCurrent} />
          <HStack style={{ marginTop: "0.5rem" }}><Button size="small" onClick={() => setCurrent(Math.max(0, current - 1))}>上一步</Button><Button size="small" type="primary" onClick={() => setCurrent(Math.min(stepItems.length - 1, current + 1))}>下一步</Button></HStack>
        </Demo>
        <Demo label="size: small" block>
          <Steps size="small" current={2} items={stepItems} />
        </Demo>
        <Demo label="status=error(错误步骤)+ progressDot" block>
          <Steps current={2} status="error" items={stepItems} />
          <TText type="secondary" style={{ marginTop: "0.5rem", display: "block" }}>progressDot:</TText>
          <Steps current={2} progressDot items={stepItems} />
        </Demo>
        <Demo label="带 Step icon" block>
          <Steps current={1} items={[
            { title: "创建", icon: <Icon name="file-plus" size="0.875rem" /> },
            { title: "派单", icon: <Icon name="send" size="0.875rem" /> },
            { title: "处理", icon: <Icon name="wrench" size="0.875rem" /> },
            { title: "闭环", icon: <Icon name="check" size="0.875rem" /> },
          ]} />
        </Demo>
        <Demo label="type=inline/navigation(设计规范已禁用)" note="规范要求 inline / navigation 形态用 div + CSS 自实现">
          <TText type="secondary">请用 H5 + token 自行实现 inline / navigation 步骤。</TText>
        </Demo>
      </SubCard>
    </Section>
  );
}

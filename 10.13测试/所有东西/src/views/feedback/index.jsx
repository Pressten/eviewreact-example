// Layer 4 view — 4. 反馈 (Feedback)
import { useState } from "react";
import { Modal, Drawer, message, notification, Spin, Progress, Button, Switch } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { Section, SubCard, Demo, TText, TLink, HStack, VStack, HAlert, HResult } from "../../components/showcase/index.jsx";
import "./index.css";

export default function FeedbackView() {
  const [m1, setM1] = useState(false);
  const [m2, setM2] = useState(false);
  const [d1, setD1] = useState(false);
  const [d2, setD2] = useState(false);
  const [dPlace, setDPlace] = useState("right");
  const [fullSpin, setFullSpin] = useState(false);

  // Modal static methods
  const confirm = () => Modal.confirm({ title: "确认删除?", content: "删除后不可恢复。", okText: "删除", cancelText: "取消", okType: "danger", onOk: () => message.success("已删除"), onCancel: () => message.info("已取消") });
  const info = () => Modal.info({ title: "提示", content: "该操作需要管理员权限。", onOk: () => {} });
  const success = () => Modal.success({ title: "提交成功", content: "工单已派发至工程师。", onOk: () => {} });
  const warn = () => Modal.warning({ title: "警告", content: "剩余配额不足,请尽快扩容。", onOk: () => {} });
  const err = () => Modal.error({ title: "执行失败", content: "与远端通信超时,请重试。", onOk: () => {} });

  // message variants
  const msg = (type) => message[type]("这是一条 " + type + " 提示", 2);

  // notification variants
  const notify = (type, placement) => notification[type]({ message: type + " 通知标题", description: "这是通知的详细描述内容,用于演示各方位与类型。", placement, btn: <Button size="small" type="primary">处理</Button>, icon: <Icon name="bell" size="1rem" /> });

  return (
    <Section id="feedback" title="4. 反馈" desc="Modal/Drawer/message/notification/Spin/Progress 为真实 antd;Alert/Result 已禁用 → H5 替代。">
      {/* Modal */}
      <SubCard title="Modal">
        <Demo label="open 受控 + title + footer 自定义 + width + centered + maskClosable">
          <Button type="primary" onClick={() => setM1(true)}>打开 Modal</Button>
          <Modal open={m1} title="编辑设备" width={480} centered maskClosable destroyOnClose onCancel={() => setM1(false)} footer={[<Button key="c" onClick={() => setM1(false)}>取消</Button>, <Button key="o" type="primary" onClick={() => { setM1(false); message.success("已保存"); }}>确定</Button>]}>
            <TText>Modal 正文内容,destroyOnClose 关闭即销毁。</TText>
          </Modal>
        </Demo>
        <Demo label="无 footer(footer=null)">
          <Button onClick={() => setM2(true)}>无底部按钮</Button>
          <Modal open={m2} title="自定义底部" footer={null} onCancel={() => setM2(false)}>
            <VStack gap="0.5rem"><TText>这里没有默认按钮。</TText><Button type="primary" block onClick={() => setM2(false)}>我知道了</Button></VStack>
          </Modal>
        </Demo>
        <Demo label="Modal.confirm() / .info() / .success() / .warning() / .error()">
          <Button onClick={confirm}>confirm</Button>
          <Button onClick={info}>info</Button>
          <Button onClick={success}>success</Button>
          <Button onClick={warn}>warning</Button>
          <Button danger onClick={err}>error</Button>
        </Demo>
      </SubCard>

      {/* Drawer */}
      <SubCard title="Drawer">
        <Demo label="open + placement(切换)+ width + title + extra + footer + size">
          <Segmentedish value={dPlace} onChange={setDPlace} />
          <Button onClick={() => setD1(true)}>打开 Drawer</Button>
          <Drawer open={d1} placement={dPlace} width={400} title="设备详情" extra={<Button size="small" onClick={() => setD1(false)}>关闭</Button>} footer={<HStack style={{ justifyContent: "flex-end" }}><Button onClick={() => setD1(false)}>取消</Button><Button type="primary" onClick={() => { setD1(false); message.success("已保存"); }}>保存</Button></HStack>} destroyOnClose onClose={() => setD1(false)}>
            <TText>Drawer 承载更多纵向内容,适合详情/筛选/分步表单。</TText>
          </Drawer>
        </Demo>
        <Demo label="size=large(placement=top)">
          <Button onClick={() => setD2(true)}>顶部大尺寸 Drawer</Button>
          <Drawer open={d2} placement="top" size="large" title="批量导入" onClose={() => setD2(false)}>
            <TText>顶部抽屉,大尺寸。</TText>
          </Drawer>
        </Demo>
      </SubCard>

      {/* Alert (H5) */}
      <SubCard title="Alert(H5 替代)">
        <Demo label="type: success / info / warning / error + showIcon + description" block>
          <VStack gap="0.5rem">
            <HAlert type="success" showIcon message="操作成功" description="设备配置已下发并生效。" />
            <HAlert type="info" showIcon message="信息提示" description="当前为只读模式。" />
            <HAlert type="warning" showIcon message="容量预警" description="存储使用率已达 85%。" />
            <HAlert type="error" showIcon message="执行异常" description="与远端通信失败,请检查网络。" />
          </VStack>
        </Demo>
        <Demo label="closable + action + banner" block>
          <HAlert type="warning" showIcon closable message="可关闭告警" action={<Button size="small">立即处理</Button>} />
          <HAlert type="info" banner message="顶部 banner(无圆角,贴边)" />
        </Demo>
      </SubCard>

      {/* message */}
      <SubCard title="message">
        <Demo label="success / info / warning / error / loading + duration">
          <Button onClick={() => msg("success")}>success</Button>
          <Button onClick={() => msg("info")}>info</Button>
          <Button onClick={() => msg("warning")}>warning</Button>
          <Button onClick={() => msg("error")}>error</Button>
          <Button onClick={() => { const hide = message.loading("加载中…", 0); setTimeout(() => { hide(); message.success("完成"); }, 1500); }}>loading</Button>
        </Demo>
      </SubCard>

      {/* notification */}
      <SubCard title="notification">
        <Demo label="success / info / warning / error + placement(各方位)+ btn + icon">
          <Button onClick={() => notify("success", "topRight")}>success topRight</Button>
          <Button onClick={() => notify("info", "topLeft")}>info topLeft</Button>
          <Button onClick={() => notify("warning", "bottomRight")}>warning bottomRight</Button>
          <Button onClick={() => notify("error", "bottomLeft")}>error bottomLeft</Button>
        </Demo>
      </SubCard>

      {/* Spin */}
      <SubCard title="Spin">
        <Demo label="size: small / default / large">
          <HStack gap="1rem"><Spin size="small" /><Spin /><Spin size="large" /></HStack>
        </Demo>
        <Demo label="tip + delay + 嵌套子元素">
          <div className="fv-spin-box">
            <Spin tip="加载中…" delay={200}><div className="fv-spin-inner"><TText>被 Spin 包裹的内容区</TText></div></Spin>
          </div>
        </Demo>
        <Demo label="全屏 Spin(fullscreen 受控)">
          <HStack gap="0.5rem"><Switch checked={fullSpin} onChange={setFullSpin} /><TText>开启全屏加载</TText></HStack>
          {fullSpin ? <Spin fullscreen tip="全屏加载中…" /> : null}
        </Demo>
      </SubCard>

      {/* Result (H5) */}
      <SubCard title="Result(H5 替代)">
        <Demo label="status: success / error / info / warning" block>
          <HStack gap="1rem" wrap>
            <div className="fv-result-col"><HResult status="success" title="提交成功" subTitle="工单已派发" extra={<Button type="primary">查看工单</Button>} /></div>
            <div className="fv-result-col"><HResult status="error" title="执行失败" subTitle="通信超时" extra={<Button>重试</Button>} /></div>
            <div className="fv-result-col"><HResult status="info" title="提示" subTitle="需管理员权限" /></div>
            <div className="fv-result-col"><HResult status="warning" title="容量预警" subTitle="使用率 85%" /></div>
          </HStack>
        </Demo>
        <Demo label="404 / 403 / 500" block>
          <HStack gap="1rem" wrap>
            <div className="fv-result-col"><HResult status={404} title="404" subTitle="页面不存在" extra={<Button type="primary">返回首页</Button>} /></div>
            <div className="fv-result-col"><HResult status={403} title="403" subTitle="无访问权限" /></div>
            <div className="fv-result-col"><HResult status={500} title="500" subTitle="服务器错误" /></div>
          </HStack>
        </Demo>
      </SubCard>

      {/* Progress */}
      <SubCard title="Progress">
        <Demo label="type: line + status + strokeColor" block>
          <VStack gap="0.5rem" style={{ width: "20rem" }}>
            <Progress percent={60} />
            <Progress percent={70} status="exception" />
            <Progress percent={50} strokeColor="#0067D1" />
            <Progress percent={100} success={{ percent: 40 }} />
          </VStack>
        </Demo>
        <Demo label="type: circle / dashboard">
          <HStack gap="2rem" align="center"><Progress type="circle" percent={70} /><Progress type="dashboard" percent={55} /></HStack>
        </Demo>
        <Demo label="steps(step)">
          <Progress percent={60} steps={5} style={{ width: "20rem" }} />
        </Demo>
      </SubCard>
    </Section>
  );
}

/* tiny local Segmented-ish toggle for Drawer placement (keeps deps local) */
function Segmentedish({ value, onChange }) {
  const opts = ["right", "left", "top", "bottom"];
  return (
    <div className="fv-seg">
      {opts.map((o) => (
        <button key={o} className={"fv-seg-item" + (value === o ? " active" : "")} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

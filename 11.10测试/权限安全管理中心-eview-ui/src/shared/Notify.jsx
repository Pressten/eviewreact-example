// TODO(eview-ui): antd message 命令式 API 无对应——改造为受控 DivMessage 渲染。
// 通知浮层抽离为独立子组件 + 自身 state：父组件通过 ref 调用 show(type, text) 触发，
// 不改动父 state，避免 DivMessage 重渲染父组件打掉 TextField/Select 等输入组件焦点（焦点竞争）。
// display 显隐；disposeTimeOut（拼写：TimeOut 大写 O）3000ms 自动消失；closable 默认 true。
import { forwardRef, useImperativeHandle, useState } from "react";
import DivMessage from "@cloudsop/eview-ui/DivMessage";

const Notify = forwardRef(function Notify(_, ref) {
  const [state, setState] = useState({ display: false, type: "info", text: "" });

  useImperativeHandle(
    ref,
    () => ({
      // type: success / info / error / warn（message.warning→warn）
      show: (type, text) => setState({ display: true, type, text }),
    }),
    []
  );

  return (
    <DivMessage
      display={state.display}
      type={state.type}
      text={state.text}
      disposeTimeOut={3000}
      onClose={() => setState((s) => ({ ...s, display: false }))}
    />
  );
});

export default Notify;
